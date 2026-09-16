using System.Collections.Generic;
using dnsExcelReport.Reader;
using Base.Model.Common.Team;
using dnsDapperDBUtil.DataAccessLayer.IDAL;
using dnsExcelReport.Models;
using System.ComponentModel.DataAnnotations;

namespace Base.TeamEditor.BLL.Excel.Reader
{
    using Writer;
    using Process;

    class RegularMemberReader : ExcelReader
    {
        private class RegularTeam : Regular
        {
            private List<RegularTeam> m_children = new List<RegularTeam>();
            private RegularTeam m_parentTeam = null;

            public RegularTeam ParentTeam
            {
                get { return m_parentTeam; }
                set
                {
                    if (m_parentTeam != value)
                    {
                        if (m_parentTeam != null)
                            m_parentTeam.m_children.Remove(this);

                        if (value != null)
                            value.m_children.Add(this);

                        m_parentTeam = value;
                    }
                }
            }

            // 하위 팀을 포함하여 팀원이 한명이라도 존재하는가?
            public bool HasChildMembers(Dictionary<RegularTeam, List<RegularMember>> dicTeamMembers)
            {
                if (HasChildMembers(this, dicTeamMembers))
                    return true;

                return false;
            }

            private bool HasChildMembers(RegularTeam team, Dictionary<RegularTeam, List<RegularMember>> dicTeamMembers)
            {
                List<RegularMember> members;

                if (dicTeamMembers.TryGetValue(team, out members) && members.Count > 0)
                    return true;

                foreach (RegularTeam childTeam in m_children)
                {
                    if (HasChildMembers(childTeam, dicTeamMembers))
                        return true;
                }

                return false;
            }
        }

        private IDataManager m_dataManager = null;
        private int? m_siteNo = null;

        private Regular m_tempRegular = null;

        public RegularMemberReader(IDataManager dataManager, string strFilePath, int? siteNo)
            : base(strFilePath)
        {
            m_dataManager = dataManager;
            m_siteNo = siteNo;
        }

        protected override bool UpdateData(List<SheetData> sheetDatas, object parameter, out string strErrorMessage)
        {
            Dictionary<Regular, List<RegularMember>> dicRegularMembers = RegularTeamWriter.ReadRegularMembers(m_dataManager, m_siteNo, out strErrorMessage);

            if (dicRegularMembers == null)
                return false;

            if (AddEmptyRegularTeams(dicRegularMembers, m_siteNo, out strErrorMessage) == false)
                return false;

            Dictionary<int, Option> dicTeamOptions = RegularTeamWriter.ReadTeamOptions(m_dataManager, out strErrorMessage);

            if (dicTeamOptions == null)
                return false;

            Dictionary<string, Option> dicJobPositionOptions = new Dictionary<string, Option>();
            Dictionary<string, Option> dicJobLevelOptions = MakeJobLevelOptions(dicTeamOptions, dicJobPositionOptions);

            // Key : Unique Key
            Dictionary<string, RegularMember> dicUniqueKeyMembers;
            // Key : PhoneNumber
            Dictionary<string, RegularMember> dicPhoneNumberMembers;
            // Key : Email
            Dictionary<string, RegularMember> dicEmailMembers;

            SetData(dicRegularMembers, out dicUniqueKeyMembers, out dicPhoneNumberMembers, out dicEmailMembers);

            bool result = CheckData(dicRegularMembers, dicUniqueKeyMembers, dicPhoneNumberMembers, dicEmailMembers, dicJobLevelOptions, dicJobPositionOptions, sheetDatas, m_siteNo, out strErrorMessage);

            if (result == false)
            {
                if (strErrorMessage != null)
                {
                    System.Diagnostics.Trace.WriteLine("RegularMemberReader.UpdateData Fail2 : " + strErrorMessage);
                }
                else
                    strErrorMessage = "잘못된 형식의 엑셀파일이거나 파일을 열수 없습니다.";
            }

            return result;
        }

        // 팀원이 하나도 없는 팀들도 추가한다.
        private bool AddEmptyRegularTeams(Dictionary<Regular, List<RegularMember>> dicRegularMembers, int? siteNo, out string strErrorMessage)
        {
            string strCondition = null;

            if (siteNo != null)
                strCondition = string.Format("{0} = {1}", Regular.Fields.site_sn, (int)siteNo);

            IEnumerable<Regular> regulars = m_dataManager.GetSelect().Select<Regular>(strCondition, out strErrorMessage);

            if (regulars == null)
                return false;

            Dictionary<int, Regular> dicRegulars = new Dictionary<int, Regular>();

            foreach (KeyValuePair<Regular, List<RegularMember>> pair in dicRegularMembers)
            {
                dicRegulars[pair.Key.rgl_sn] = pair.Key;
            }

            foreach (Regular regular in regulars)
            {
                if (dicRegulars.ContainsKey(regular.rgl_sn) == false)
                {
                    dicRegularMembers[regular] = new List<RegularMember>();
                }
            }

            return true;
        }

        private bool CheckData(Dictionary<Regular, List<RegularMember>> dicRegularMembers, Dictionary<string, RegularMember> dicUniqueKeyMembers, Dictionary<string, RegularMember> dicPhoneNumberMembers, Dictionary<string, RegularMember> dicEmailMembers, Dictionary<string, Option> dicJobLevelOptions, Dictionary<string, Option> dicJobPositionOptions, List<SheetData> sheetDatas, int? siteNo, out string strErrorMessage)
        {
            Dictionary<string, int> dicColumnIndex = new Dictionary<string, int>();
            Dictionary<RegularTeam, List<RegularMember>> dicSheetRegularTeamMembers = new Dictionary<RegularTeam, List<RegularMember>>();
            Dictionary<string, RegularTeam> dicTeamPath = MakeTeamPath(dicRegularMembers, out strErrorMessage);

            foreach (SheetData sheet in sheetDatas)
            {
                // 첫번째 Sheet만 사용한다.
                if (MakeSheetRegularTeamMembers(sheet, dicSheetRegularTeamMembers, dicTeamPath, dicUniqueKeyMembers, dicPhoneNumberMembers, dicEmailMembers, dicJobLevelOptions, dicJobPositionOptions, dicColumnIndex, out strErrorMessage) == false)
                    return false;

                break;
            }

            List<int> teamNos = new List<int>();
            string strMemberNos;
            GetNotDeletingList(dicSheetRegularTeamMembers, dicUniqueKeyMembers, dicPhoneNumberMembers, teamNos, out strMemberNos);

            IDataManager dataManager = m_dataManager.Clone();

            if (dataManager.BeginBatch(out strErrorMessage) == false)
            {
                strErrorMessage = "시스템 데이터베이스의 트랜잭션을 시작할 수 없습니다.";
                return false;
            }

            if (DeleteRegularMembers(dataManager, strMemberNos, out strErrorMessage) == false)
            {
                return RollbackMessage(dataManager);
            }

            // 삭제되지 않는 직원들은 임시팀을 만든다음 임시팀 소속으로 둔다.
            if (SetTempRegularTeam(dataManager, strMemberNos, siteNo, out strErrorMessage) == false)
            {
                return RollbackMessage(dataManager);
            }

            // teamNos에 속해있지 않은 팀과 관련된 모든 정보를 삭제한다.
            if (DeleteManager.RemoveRegularNot(dataManager, teamNos, out strErrorMessage) == false)
            {
                return RollbackMessage(dataManager);
            }

            if (DeleteRegularTeams(dataManager, teamNos, out strErrorMessage) == false)
            {
                return RollbackMessage(dataManager);
            }

            if (AddRegularTeams(dataManager, dicSheetRegularTeamMembers.Keys, siteNo, out strErrorMessage) == false)
            {
                return RollbackMessage(dataManager);
            }

            if (UpdateRegularMembers(dataManager, strMemberNos, dicSheetRegularTeamMembers, out strErrorMessage) == false)
            {
                return RollbackMessage(dataManager);
            }

            // 임시팀 삭제
            if (DeleteTempRegularTeam(dataManager, out strErrorMessage) == false)
            {
                return RollbackMessage(dataManager);
            }

            if (AddRegularMembers(dataManager, dicSheetRegularTeamMembers, out strErrorMessage) == false)
            {
                return RollbackMessage(dataManager);
            }

            if (dataManager.BatchCommit(out strErrorMessage) == false)
            {
                strErrorMessage = "시스템 데이터베이스의 트랜잭션을 정상적으로 종료할수 없습니다.";
                return RollbackMessage(dataManager);
            }

            return true;
        }

        private bool AddRegularMembers(IDataManager dataManager, Dictionary<RegularTeam, List<RegularMember>> dicTeamMembers, out string strErrorMessage)
        {
            foreach (KeyValuePair<RegularTeam, List<RegularMember>> pair in dicTeamMembers)
            {
                foreach (RegularMember member in pair.Value)
                {
                    // 무조건 추가한다.
                    //if (member.rgl_memb_sn <= 0)
                    {
                        member.rgl_sn = pair.Key.rgl_sn;
                        member.telno = EncryptPhoneNumber(member.telno);

                        int addedID;

                        if (dataManager.GetCreate().Insert<RegularMember>(member, out addedID, out strErrorMessage) == false)
                            return false;
                        else
                        {
                            member.rgl_memb_sn = addedID;
                        }
                    }
                }
            }

            strErrorMessage = null;
            return true;
        }

        private bool DeleteTempRegularTeam(IDataManager dataManager, out string strErrorMessage)
        {
            if (m_tempRegular == null)
            {
                strErrorMessage = null;
                return true;
            }

            string strCondition = string.Format("{0} = {1}", Regular.Fields.rgl_sn, m_tempRegular.rgl_sn);

            if (dataManager.GetDelete().Delete<Regular>(strCondition, out strErrorMessage) == false)
                return false;

            m_tempRegular = null;
            return true;
        }

        private bool UpdateRegularMembers(IDataManager dataManager, string strMemberNos, Dictionary<RegularTeam, List<RegularMember>> dicTeamMembers, out string strErrorMessage)
        {
            strErrorMessage = null;

            if (strMemberNos.Length == 0)
                return true;

            string strCondition = string.Format("{0} in ({1})", RegularMember.Fields.rgl_memb_sn, strMemberNos);
            IEnumerable<RegularMember> members = dataManager.GetSelect().Select<RegularMember>(strCondition, out strErrorMessage);

            if (members == null)
                return false;

            foreach (KeyValuePair<RegularTeam, List<RegularMember>> pair in dicTeamMembers)
            {
                foreach (RegularMember member in pair.Value)
                {
                    if (member.rgl_memb_sn > 0)
                    {
                        member.rgl_sn = pair.Key.rgl_sn;
                        member.telno = EncryptPhoneNumber(member.telno);

                        if (dataManager.GetUpdate().Update<RegularMember>(member, null, out strErrorMessage) == false)
                            return false;
                    }
                }
            }

            return true;
        }

        private string EncryptPhoneNumber(string strPhoneNumber)
        {
            if (strPhoneNumber != null && strPhoneNumber.Length > 0)
            {
                if (CheckValidPhoneNumber(strPhoneNumber))
                {
                    // 아직 암호화되지 않은 전화번호일 경우 암호화 시킨다.
                    return dnsDapperDBUtil.AES256Cipher.AES_encrypt(strPhoneNumber);
                }
            }

            return strPhoneNumber;
        }

        private bool AddRegularTeams(IDataManager dataManager, ICollection<RegularTeam> teams, int? siteNo, out string strErrorMessage)
        {
            bool complete = false;

            while (complete == false)
            {
                complete = true;

                foreach (RegularTeam team in teams)
                {
                    team.site_sn = siteNo;

                    // 무조건 추가한다.
                    //if (team.rgl_sn <= 0)
                    {
                        if (team.ParentTeam == null || (team.ParentTeam != null && team.ParentTeam.rgl_sn > 0))
                        {
                            if (team.ParentTeam != null)
                            {
                                team.parnts_sn = team.ParentTeam.rgl_sn;
                            }

                            int addedID;

                            if (dataManager.GetCreate().Insert<Regular>(team, out addedID, out strErrorMessage) == false)
                                return false;
                            else
                            {
                                team.rgl_sn = addedID;
                            }
                        }
                        else
                            complete = false;
                    }
                }
            }

            strErrorMessage = null;
            return true;
        }

        private bool DeleteRegularTeams(IDataManager dataManager, List<int> notDeletingTeamNos, out string strErrorMessage)
        {
            if (m_tempRegular != null)
                notDeletingTeamNos.Add(m_tempRegular.rgl_sn);

            return DeleteManager.RemoveRegular(dataManager, notDeletingTeamNos, out strErrorMessage);
        }

        // 삭제되지 않는 직원들은 임시팀을 만든다음 임시팀 소속으로 둔다.
        private bool SetTempRegularTeam(IDataManager dataManager, string strMemberNos, int? siteNo, out string strErrorMessage)
        {
            strErrorMessage = null;

            if (strMemberNos.Length == 0)
                return true;

            if (m_tempRegular == null)
            {
                Regular tempRegular = new Regular();
                tempRegular = new Regular();
                tempRegular.parnts_sn = null;
                tempRegular.team_name = "Temp";
                tempRegular.site_sn = siteNo;

                int addedID;

                if (dataManager.GetCreate().Insert<Regular>(tempRegular, out addedID, out strErrorMessage) == false)
                    return false;
                else
                {
                    tempRegular.rgl_sn = addedID;
                    m_tempRegular = tempRegular;
                }
            }

            string strCondition = string.Format("{0} in ({1})", RegularMember.Fields.rgl_memb_sn, strMemberNos);
            IEnumerable<RegularMember> members = dataManager.GetSelect().Select<RegularMember>(strCondition, out strErrorMessage);

            if (members == null)
                return false;

            foreach (RegularMember member in members)
            {
                RegularMember updateMember = new RegularMember();
                updateMember.rgl_memb_sn = member.rgl_memb_sn;
                updateMember.email = member.email;
                updateMember.clsf_no = member.clsf_no;
                updateMember.ofcps_no = member.ofcps_no;
                updateMember.unq_key = member.unq_key;
                updateMember.memb_name = member.memb_name;
                updateMember.offm_telno = member.offm_telno;
                updateMember.telno = member.telno;
                updateMember.rgl_sn = m_tempRegular.rgl_sn;

                if (dataManager.GetUpdate().Update<RegularMember>(updateMember, null, out strErrorMessage) == false)
                    return false;
            }

            return true;
        }

        private bool DeleteRegularMembers(IDataManager dataManager, string strNotDeletingMemberNos, out string strErrorMessage)
        {
            IEnumerable<RegularMember> members = null;

            if (strNotDeletingMemberNos.Length > 0)
            {
                string strCondition = string.Format("{0} not in ({1})", RegularMember.Fields.rgl_memb_sn, strNotDeletingMemberNos);
                members = dataManager.GetSelect().Select<RegularMember>(strCondition, out strErrorMessage);
            }
            else
            {
                members = dataManager.GetSelect().Select<RegularMember>(null, out strErrorMessage);
            }

            if (members == null)
                return false;

            string strMemberNos = "";

            foreach (RegularMember member in members)
            {
                if (strMemberNos.Length == 0)
                    strMemberNos = member.rgl_memb_sn.ToString();
                else
                    strMemberNos += "," + member.rgl_memb_sn.ToString();
            }

            if (DeleteManager.RemoveRegularMember(dataManager, members, out strErrorMessage) == false)
                return false;

            return true;
        }

        private bool RollbackMessage(IDataManager dataManager)
        {
            string strTemp;
            dataManager.BatchRollback(out strTemp);
            return false;
        }

        private void GetNotDeletingList(Dictionary<RegularTeam, List<RegularMember>> dicSheetRegularTeamMembers, Dictionary<string, RegularMember> dicUniqueKeyMembers, Dictionary<string, RegularMember> dicPhoneNumberMembers, List<int> teamNos, out string strMemberNos)
        {
            strMemberNos = "";
            RegularMember _member;

            Dictionary<int, int> dicNotDeletingTeamIDs = new Dictionary<int, int>();

            foreach (KeyValuePair<RegularTeam, List<RegularMember>> pair in dicSheetRegularTeamMembers)
            {
                CheckNotDeletingTeam(pair.Key, dicNotDeletingTeamIDs);

                foreach (RegularMember member in pair.Value)
                {
                    if (member.unq_key != null && member.unq_key.Length > 0)
                    {
                        if (dicUniqueKeyMembers.TryGetValue(member.unq_key, out _member))
                            member.rgl_memb_sn = _member.rgl_memb_sn;
                    }

                    if (member.telno != null && dicPhoneNumberMembers.TryGetValue(member.telno, out _member))
                        member.rgl_memb_sn = _member.rgl_memb_sn;

                    if (member.rgl_memb_sn > 0)
                    {
                        if (strMemberNos.Length == 0)
                            strMemberNos = member.rgl_memb_sn.ToString();
                        else
                            strMemberNos += "," + member.rgl_memb_sn.ToString();
                    }
                }
            }

            foreach (KeyValuePair<int, int> pair in dicNotDeletingTeamIDs)
            {
                teamNos.Add(pair.Key);
            }
        }

        private void CheckNotDeletingTeam(RegularTeam team, Dictionary<int, int> dicNotDeletingTeamIDs)
        {
            if (team.rgl_sn > 0)
            {
                dicNotDeletingTeamIDs[team.rgl_sn] = team.rgl_sn;
            }

            if (team.ParentTeam != null)
                CheckNotDeletingTeam(team.ParentTeam, dicNotDeletingTeamIDs);
        }

        private Dictionary<string, Option> MakeJobLevelOptions(Dictionary<int, Option> dicTeamOptions, Dictionary<string, Option> dicJobPositionOptions)
        {
            Dictionary<string, Option> dicJobLevelOptions = new Dictionary<string, Option>();

            foreach (KeyValuePair<int, Option> pair in dicTeamOptions)
            {
                if ((int)dnsData.CommonCode.CodeType.JobLevel == pair.Value.team_optn_ty_no)
                    dicJobLevelOptions[pair.Value.team_optn_name] = pair.Value;
                else if ((int)dnsData.CommonCode.CodeType.JobPosition == pair.Value.team_optn_ty_no)
                    dicJobPositionOptions[pair.Value.team_optn_name] = pair.Value;
            }

            return dicJobLevelOptions;
        }

        private bool MakeSheetRegularTeamMembers(SheetData sheet, Dictionary<RegularTeam, List<RegularMember>> dicSheetRegularTeamMembers, Dictionary<string, RegularTeam> dicTeamPath, Dictionary<string, RegularMember> dicUniqueKeyMembers, Dictionary<string, RegularMember> dicPhoneNumberMembers, Dictionary<string, RegularMember> dicEmailMembers, Dictionary<string, Option> dicJobLevelOptions, Dictionary<string, Option> dicJobPositionOptions, Dictionary<string, int> dicColumnIndex, out string strErrorMessage)
        {
            strErrorMessage = null;

            int columnCount = RegularTeamWriter.GetColumnCount();

            if (dicColumnIndex.Count == 0)
            {
                foreach (KeyValuePair<int, string> pair in sheet.Titles)
                {
                    for (int i=0;i<columnCount;i++)
                    {
                        string strColumnName = RegularTeamWriter.GetColumnName(i);

                        if (pair.Value.StartsWith(strColumnName))
                        {
                            dicColumnIndex[strColumnName] = pair.Key;
                            break;
                        }
                    }
                }
            }

            List<string> teamNames = GetColumnValues(RegularTeamWriter.GetColumnName(0), sheet, dicColumnIndex);
            List<string> memberNames = GetColumnValues(RegularTeamWriter.GetColumnName(1), sheet, dicColumnIndex);
            List<string> uniqueKeys = GetColumnValues(RegularTeamWriter.GetColumnName(2), sheet, dicColumnIndex);
            List<string> phoneNumbers = GetColumnValues(RegularTeamWriter.GetColumnName(3), sheet, dicColumnIndex);
            List<string> officePhoneNumbers = GetColumnValues(RegularTeamWriter.GetColumnName(4), sheet, dicColumnIndex);
            List<string> jobLevels = GetColumnValues(RegularTeamWriter.GetColumnName(5), sheet, dicColumnIndex);
            List<string> jobPositions = GetColumnValues(RegularTeamWriter.GetColumnName(6), sheet, dicColumnIndex);
            List<string> emails = GetColumnValues(RegularTeamWriter.GetColumnName(7), sheet, dicColumnIndex);

            // 엑셀파일에 같은 사람이 두번이상 기입되지 않았는지 검사
            Dictionary<string, RegularMember> dicUniqueKeyMembers2 = new Dictionary<string, RegularMember>();
            Dictionary<string, RegularMember> dicPhoneNumberMembers2 = new Dictionary<string, RegularMember>();
            Dictionary<string, RegularMember> dicEmailMembers2 = new Dictionary<string, RegularMember>();

            int nValueCount = teamNames.Count;

            for (int i = 0; i < nValueCount; i++)
            {
                string strTeamPath = CheckNull(teamNames[i]);
                string strMemberName = CheckNull(memberNames[i]);
                string strUniqueKey = CheckNull(uniqueKeys[i]);
                string strPhoneNumber = CheckNull(phoneNumbers[i]);
                string strOfficePhoneNumber = CheckNull(officePhoneNumbers[i]);
                string strJobLevel = CheckNull(jobLevels[i]);
                string strJobPosition = CheckNull(jobPositions[i]);
                string strEmail = CheckNull(emails[i]);

                if (strTeamPath == null)
                    continue;

                if (strMemberName == null)
                {
                    // 팀원이 하나도 없는 팀은 팀만 추가하도록 한다.
                    GetRegularTeam(strTeamPath, dicTeamPath, dicSheetRegularTeamMembers);
                    continue;
                }

                //if (strTeamPath == null || strMemberName == null/* || strPhoneNumber == null || strEmail == null*/)
                //    continue;

                strTeamPath = strTeamPath.Trim();
                strMemberName = strMemberName.Trim();

                bool validPhoneNumber = true;

                if (strPhoneNumber != null)
                {
                    strPhoneNumber = TrimPhoneNumber(strPhoneNumber, ref validPhoneNumber);

                    if (validPhoneNumber == false)
                        continue;

                    if (CheckValidPhoneNumber(strPhoneNumber) == false)
                        continue;
                }

                if (strEmail != null)
                {
                    strEmail = strEmail.Trim();

                    if (CheckValidEmail(strEmail) == false)
                        continue;
                }

                if (strJobLevel != null)
                    strJobLevel = strJobLevel.Trim();

                // 한글이나 영문자 이외의 글자가 사용되면 오류로 인식한다.
                if (CheckHangul(strMemberName) == false)
                {
                    strErrorMessage = "이름은 한글과 영문만 사용할 수 있습니다.(" + strMemberName + ")";
                    return false;
                    //continue;
                }

                RegularTeam team = GetRegularTeam(strTeamPath, dicTeamPath, dicSheetRegularTeamMembers);
                List<RegularMember> members = dicSheetRegularTeamMembers[team];

                RegularMember member;

                if (strUniqueKey != null && dicUniqueKeyMembers.TryGetValue(strUniqueKey, out member))
                {
                    // 같은 사람이 중복으로 기입되었는지 검사
                    if (dicUniqueKeyMembers2.ContainsKey(strUniqueKey))
                    {
                        strErrorMessage = "같은 사번이 중복됩니다.(" + strUniqueKey + ")";
                        return false;
                    }

                    if (strPhoneNumber != null && dicPhoneNumberMembers2.ContainsKey(strPhoneNumber))
                    {
                        strErrorMessage = "같은 전화번호가 중복됩니다.(" + strPhoneNumber + ")";
                        return false;
                    }
                    
                    member.rgl_sn = team.rgl_sn;
                    member.email = strEmail != null && strEmail.Length > 0 ? strEmail : null;
                    member.unq_key = strUniqueKey;
                    member.telno = strPhoneNumber;
                }
                else if (strPhoneNumber != null && dicPhoneNumberMembers.TryGetValue(strPhoneNumber, out member))
                {
                    // 같은 사람이 중복으로 기입되었는지 검사
                    if (dicPhoneNumberMembers2.ContainsKey(strPhoneNumber))
                    {
                        strErrorMessage = "같은 전화번호가 중복됩니다.(" + strPhoneNumber + ")";
                        return false;
                    }
                    
                    member.rgl_sn = team.rgl_sn;
                    member.email = strEmail != null && strEmail.Length > 0 ? strEmail : null;
                    member.unq_key = strUniqueKey;
                    member.telno = strPhoneNumber;
                }
                else if (strEmail != null && dicEmailMembers.TryGetValue(strEmail, out member))
                {
                    // 같은 사람이 중복으로 기입되었는지 검사
                    if (dicEmailMembers2.ContainsKey(strEmail))
                    {
                        strErrorMessage = "같은 이메일 주소가 중복됩니다.(" + strEmail + ")";
                        return false;
                    }

                    member.rgl_sn = team.rgl_sn;
                    member.email = strEmail != null && strEmail.Length > 0 ? strEmail : null;
                    member.unq_key = strUniqueKey;
                    member.telno = strPhoneNumber;
                }
                else
                {
                    member = new RegularMember();

                    member.email = strEmail != null && strEmail.Length > 0 ? strEmail : null;
                    member.unq_key = strUniqueKey;
                    member.memb_name = strMemberName;
                    member.telno = strPhoneNumber;
                    member.rgl_sn = team.rgl_sn;
                }

                member.memb_name = strMemberName;
                member.offm_telno = strOfficePhoneNumber;

                SetJobLevel(member, strJobLevel, dicJobLevelOptions);
                SetJobPosition(member, strJobPosition, dicJobPositionOptions);

                members.Add(member);

                if (strUniqueKey != null)
                    dicUniqueKeyMembers2[strUniqueKey] = member;

                if (strPhoneNumber != null)
                    dicPhoneNumberMembers2[strPhoneNumber] = member;

                if (strEmail != null)
                    dicEmailMembers2[strEmail] = member;
            }

            return true;
        }

        private string CheckNull(string str)
        {
            if (str == null || str.Length == 0)
                return null;

            if (str == "-")
                return null;

            return str;
        }

        private void SetJobPosition(RegularMember member, string strJobPosition, Dictionary<string, Option> dicJobPositionOptions)
        {
            if (strJobPosition != null && strJobPosition.Length > 0)
            {
                Option option;

                if (dicJobPositionOptions.TryGetValue(strJobPosition, out option))
                    member.ofcps_no = option.team_optn_no;
                else
                    member.ofcps_no = null;
            }
            else
                member.ofcps_no = null;
        }

        private void SetJobLevel(RegularMember member, string strJobLevel, Dictionary<string, Option> dicJobLevelOptions)
        {
            if (strJobLevel != null && strJobLevel.Length > 0)
            {
                Option option;

                if (dicJobLevelOptions.TryGetValue(strJobLevel, out option))
                    member.clsf_no = option.team_optn_no;
                else
                    member.clsf_no = null;
            }
            else
                member.clsf_no = null;
        }

        private RegularTeam GetRegularTeam(string strTeamPath, Dictionary<string, RegularTeam> dicTeamPath, Dictionary<RegularTeam, List<RegularMember>> dicSheetRegularTeamMembers)
        {
            RegularTeam team;

            if (dicTeamPath.TryGetValue(strTeamPath, out team))
            {
                if (dicSheetRegularTeamMembers.ContainsKey(team) == false)
                    dicSheetRegularTeamMembers[team] = new List<RegularMember>();

                int nIndex = strTeamPath.LastIndexOf('/');

                if (nIndex >= 0)
                    GetRegularTeam(strTeamPath.Substring(0, nIndex), dicTeamPath, dicSheetRegularTeamMembers);

                return team;
            }

            string[] teamNames = strTeamPath.Split('/');
            int nTeamNameCount = teamNames.Length;

            string strPrevTeamName = "";
            RegularTeam teamPrevParent = null;

            for (int i = 0; i < nTeamNameCount; i++)
            {
                string teamName = teamNames[i].Trim();
                string strTeamName = strPrevTeamName + teamName;

                if (dicTeamPath.TryGetValue(strTeamName, out team) == false)
                {
                    RegularTeam _team = new RegularTeam();
                    _team.ParentTeam = teamPrevParent;
                    _team.team_name = teamName;

                    teamPrevParent = _team;
                    dicTeamPath[strTeamName] = _team;
                    dicSheetRegularTeamMembers[_team] = new List<RegularMember>();
                }
                else
                {
                    if (dicSheetRegularTeamMembers.ContainsKey(team) == false)
                        dicSheetRegularTeamMembers[team] = new List<RegularMember>();

                    teamPrevParent = team;
                }

                strPrevTeamName = strTeamName + "/";
            }

            return teamPrevParent;
        }

        // 한글과 영문자가 아닐경우 false를 리턴한다.
        private static bool CheckHangul(string str)
        {
            char[] arr = str.ToCharArray();

            foreach (char ch in arr)
            {
                int num = (int)ch;

                if (ch < 0xac00 || ch > 0xd7af)
                {
                    if ((ch >= 'a' && ch <= 'z') || (ch >= 'A' && ch <= 'Z') || ch == ' ')
                        continue;
                    else
                        return false;
                }
            }

            return true;
        }

        private bool CheckValidEmail(string strEmail)
        {
            var email = new EmailAddressAttribute();
            return email.IsValid(strEmail);
        }

        // 전화번호를 000-0000-0000 또는 000-000-0000 형태로 만든다.
        private bool CheckValidPhoneNumber(string strPhoneNumber)
        {
            if (strPhoneNumber.StartsWith("010"))
            {
                int len = strPhoneNumber.Length;

                if (len == 11 || len == 10)
                    return true;
            }

            return false;
        }

        // 숫자 이외의 나머지 문자들을 모두 제거한다.
        private string TrimPhoneNumber(string strPhoneNumber, ref bool success)
        {
            string phoneNumber = "";
            int len = strPhoneNumber.Length;

            for (int i = 0; i < len; i++)
            {
                char ch = strPhoneNumber[i];

                if (ch >= '0' && ch <= '9')
                {
                    phoneNumber += ch;
                }
                else if (ch != ' ' && ch != '\r' && ch != '\n' && ch != '\t' && ch != '-')
                {
                    success = false;
                    return "";
                }
            }

            return phoneNumber;
        }

        private List<string> GetColumnValues(string strTag, SheetData sheet, Dictionary<string, int> dicColumnIndex)
        {
            int nIndex;

            if (dicColumnIndex.TryGetValue(strTag, out nIndex) == false)
                return null;

            List<string> columnValues;

            if (sheet.ColumnDatas.TryGetValue(nIndex, out columnValues) == false)
                return null;

            return columnValues;
        }

        private Dictionary<string, RegularTeam> MakeTeamPath(Dictionary<Regular, List<RegularMember>> dicTeamMembers, out string strErrorMessage)
        {
            // Key : TeamNo
            Dictionary<int, Regular> dicTeams = GetRegularTeams(m_dataManager, out strErrorMessage);

            if (dicTeams == null)
                return null;

            /*foreach (KeyValuePair<Regular, List<RegularMember>> pair in dicTeamMembers)
            {
                dicTeams[pair.Key.rgl_sn] = pair.Key;
            }*/

            Dictionary<int, RegularTeam> dicRegularTeams = new Dictionary<int, RegularTeam>();
            Dictionary<string, RegularTeam> dicRegularTeamPaths = new Dictionary<string, RegularTeam>();

            foreach (KeyValuePair<int, Regular> pair in dicTeams)
            {
                string strTeamPath = GetTeamPath(pair.Value, dicTeams);

                RegularTeam team = new RegularTeam();
                team.rgl_sn = pair.Value.rgl_sn;
                team.parnts_sn = pair.Value.parnts_sn;
                team.team_name = pair.Value.team_name;

                dicRegularTeamPaths[strTeamPath] = team;
                dicRegularTeams[team.rgl_sn] = team;
            }

            foreach (KeyValuePair<int, RegularTeam> pair in dicRegularTeams)
            {
                RegularTeam team = pair.Value;

                while (team.parnts_sn != null && team.parnts_sn > 0 && team.ParentTeam == null)
                {
                    RegularTeam parent;

                    if (dicRegularTeams.TryGetValue((int)team.parnts_sn, out parent) == false)
                        break;

                    team.ParentTeam = parent;
                    team = parent;
                }
            }

            return dicRegularTeamPaths;
        }

        public static Dictionary<int, Regular> GetRegularTeams(IDataManager dataManager, out string strErrorMessage)
        {
            IEnumerable<Regular> regulars = dataManager.GetSelect().Select<Regular>(null, out strErrorMessage);

            if (regulars == null)
                return null;

            Dictionary<int, Regular> dicRegulars = new Dictionary<int, Regular>();

            foreach (Regular regular in regulars)
            {
                dicRegulars[regular.rgl_sn] = regular;
            }

            return dicRegulars;
        }

        public static string GetTeamPath(Regular team, Dictionary<int, Regular> dicTeams)
        {
            string strTeamPath = team.team_name;

            while (team.parnts_sn != null && team.parnts_sn > 0)
            {
                Regular parent;

                if (dicTeams.TryGetValue((int)team.parnts_sn, out parent) == false)
                    break;

                strTeamPath = parent.team_name + "/" + strTeamPath;
                team = parent;
            }

            return strTeamPath;
        }

        private void SetData(Dictionary<Regular, List<RegularMember>> dicRegularMembers, out Dictionary<string, RegularMember> dicUniqueKeyMembers, out Dictionary<string, RegularMember> dicPhoneNumberMembers, out Dictionary<string, RegularMember> dicEmailMembers)
        {
            dicUniqueKeyMembers = new Dictionary<string, RegularMember>();
            dicPhoneNumberMembers = new Dictionary<string, RegularMember>();
            dicEmailMembers = new Dictionary<string, RegularMember>();

            foreach (var pair in dicRegularMembers)
            {
                foreach (var regularMember in pair.Value)
                {
                    if (regularMember.unq_key != null && regularMember.unq_key.Length > 0)
                        dicUniqueKeyMembers[regularMember.unq_key] = regularMember;

                    if (regularMember.telno != null && regularMember.telno.Length > 0)
                        dicPhoneNumberMembers[regularMember.telno] = regularMember;

                    if (regularMember.email != null && regularMember.email.Length > 0)
                        dicEmailMembers[regularMember.email] = regularMember;
                }
            }
        }
    }
}
