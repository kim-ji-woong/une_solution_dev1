using System.Collections;
using System.Collections.Generic;
using dnsDapperDBUtil.DataAccessLayer.IDAL;
using Base.DAL;
using Base.TeamEditor.IBLL.Request;
using Base.TeamEditor.IBLL.Response;
using Base.Model.Common.Team;
using Base.TeamEditor.IBLL.Models;
using dnsData.CommonCode;
using Response;

namespace Base.TeamEditor.BLL.Process
{
    class TeamManager
    {
        private IDataManager m_dataManager = null;

        public const int RoleOptionNumber = 500400;

        public TeamManager(IDataManager dataManager)
        {
            m_dataManager = dataManager;
        }

        public ResponseDisplayTemporaryMember DisplayTemporaryMember(DisplayTemporaryMember data)
        {
            string strErrorMessage;
            string strCondition = MakeTemporaryMemberCondition(data, out strErrorMessage);

            if (strErrorMessage != null)
                return new ResponseDisplayTemporaryMember(false, strErrorMessage);

            JoinManager joinManager = new JoinManager(m_dataManager);
            bool useSortedSqlPaging = UseSortedSqlPaging(data.SearchText, data.SortType, data.PageRowCount);

            if (useSortedSqlPaging)
            {
                int? beginIndex = data.GetBeginIndex();
                int? itemCount = data.PageRowCount;

                if (beginIndex == null)
                {
                    beginIndex = 1;
                    itemCount = null;
                }

                string strOrderBy = GetTemporaryMemberOrderBy(data);
                ArrayList arrDatas = joinManager.JoinTemporaryMemberTemporaryRegularRegularMember(strCondition, (int)beginIndex, itemCount, strOrderBy, out strErrorMessage);
                ResponseDisplayTemporaryMember response = MakeTemporaryMemberListFromPaging(arrDatas, strErrorMessage);

                if (response.Success == false)
                    return response;

                if (arrDatas != null && arrDatas.Count == 0 && (int)beginIndex > 1)
                {
                    ArrayList arrTemp = joinManager.JoinTemporaryMemberTemporaryRegularRegularMember(strCondition, 1, itemCount, strOrderBy, out strErrorMessage);

                    if (arrTemp != null && arrTemp.Count > 0 && arrTemp[0] is Base.DAL.Models.Pagination)
                        response.TotalCount = ((Base.DAL.Models.Pagination)arrTemp[0]).TotalCount;
                }

                return response;
            }

            ArrayList arrList = joinManager.JoinTemporaryMemberTemporaryRegularRegularMember(strCondition, out strErrorMessage);
            ResponseDisplayTemporaryMember finalResponse = MakeTemporaryMemberList(arrList, data, strErrorMessage);

            if (finalResponse.Success == false)
                return finalResponse;

            SortTemporaryMembers(finalResponse.TemporaryMembers, data);
            ApplyTemporaryMemberPaging(finalResponse, data);
            return finalResponse;
        }

        private bool CheckSearchText(TemporaryMember temporaryMember, Temporary temporary, Regular regular, RegularMember regularMember, DisplayTemporaryMember data, ref Dictionary<int, string> dicJobLevels, ref Dictionary<int, string> dicJobPositions, ref Dictionary<int, string> dicRoles, out string strErrorMessage)
        {
            strErrorMessage = null;

            if (data.SearchText == null)
                return true;

            string strSearchText = data.SearchText.ToLower().Trim();

            if (data.SearchRegularTeamName && regular != null)
            {
                if (regular.team_name.ToLower().Contains(strSearchText))
                    return true;
            }

            if (data.SearchTemporaryTeamName)
            {
                if (temporary.team_name.ToLower().Contains(strSearchText))
                    return true;
            }

            if (data.SearchRegularMemberName && regularMember != null)
            {
                if (regularMember.memb_name.ToLower().Contains(strSearchText))
                    return true;
            }

            if (data.SearchSopName && temporaryMember.disp_name != null)
            {
                if (temporaryMember.disp_name.ToLower().Contains(strSearchText))
                    return true;
            }

            if (data.SearchJobLevel && regularMember != null && regularMember.clsf_no != null)
            {
                if (dicJobLevels == null)
                {
                    if (ReadTeamOptions(ref dicJobLevels, ref dicJobPositions, out strErrorMessage) == false)
                        return false;
                }

                string strJobLevel;

                if (dicJobLevels.TryGetValue((int)regularMember.clsf_no, out strJobLevel))
                {
                    if (strJobLevel.ToLower().Contains(strSearchText))
                        return true;
                }
            }

            if (data.SearchJobPosition && regularMember != null && regularMember.ofcps_no != null)
            {
                if (dicJobPositions == null)
                {
                    if (ReadTeamOptions(ref dicJobLevels, ref dicJobPositions, out strErrorMessage) == false)
                        return false;
                }

                string strJobPosition;

                if (dicJobPositions.TryGetValue((int)regularMember.ofcps_no, out strJobPosition))
                {
                    if (strJobPosition.ToLower().Contains(strSearchText))
                        return true;
                }
            }

            if (data.SearchRole && temporaryMember.role_no != null)
            {
                if (dicRoles == null)
                {
                    dicRoles = ReadRole(out strErrorMessage);

                    if (dicRoles == null)
                        return false;
                }

                string strRole;

                if (dicRoles.TryGetValue((int)temporaryMember.role_no, out strRole))
                {
                    if (strRole.ToLower().Contains(strSearchText))
                        return true;
                }
            }

            if (data.SearchTemporaryMemo && temporaryMember.memo != null)
            {
                if (temporaryMember.memo.ToLower().Contains(strSearchText))
                    return true;
            }

            return false;
        }

        private Dictionary<int, string> ReadRole(out string strErrorMessage)
        {
            string strCondition = string.Format("{0} = {1}", Model.Common.Codes.Fields.cl_code, (int)CodeType.Role);
            IEnumerable<Model.Common.Codes> codes = m_dataManager.GetSelect().Select<Model.Common.Codes>(strCondition, out strErrorMessage);

            if (codes == null)
                return null;

            Dictionary<int, string> dicRoles = new Dictionary<int, string>();

            foreach (var code in codes)
            {
                dicRoles[code.code] = code.code_name;
            }

            return dicRoles;
        }

        private bool HasSearchText(string strSearchText)
        {
            return strSearchText != null && strSearchText.Trim().Length > 0;
        }

        private bool UseSortedSqlPaging(string strSearchText, int? sortType, int? pageRowCount)
        {
            if (sortType == null)
                return false;

            if (HasSearchText(strSearchText))
                return false;

            return pageRowCount != null && pageRowCount > 0;
        }

        private string MakeRegularMemberCondition(DisplayRegularMember data, out string strErrorMessage)
        {
            strErrorMessage = null;
            List<string> conditions = new List<string>();

            if (data.site_sn.HasValue && data.site_sn > 0)
                conditions.Add(string.Format("(a.{0} = {1} or a.{0} is NULL)", Regular.Fields.site_sn, data.site_sn.Value));

            ICollection<int> teamNos = GetRegularTeamNos(data, out strErrorMessage);

            if (strErrorMessage != null)
                return null;

            if (teamNos != null && teamNos.Count > 0)
                conditions.Add(string.Format("a.{0} in ({1})", Regular.Fields.rgl_sn, string.Join(",", teamNos)));

            if (conditions.Count == 0)
                return null;

            return string.Join(" and ", conditions);
        }

        private ICollection<int> GetRegularTeamNos(DisplayRegularMember data, out string strErrorMessage)
        {
            strErrorMessage = null;

            if (data.rgl_sn == null || data.rgl_sn <= 0)
                return null;

            if (data.IncludeChildTeams == false)
                return new List<int>() { (int)data.rgl_sn };

            string strCondition = string.Format("{0} = {1}", Regular.Fields.rgl_sn, (int)data.rgl_sn);
            return CustomManager.GetRecursiveQuery(m_dataManager, Regular.TableName, Regular.Fields.rgl_sn.ToString(), Regular.Fields.parnts_sn.ToString(), strCondition, out strErrorMessage);
        }

        private string MakeTemporaryMemberCondition(DisplayTemporaryMember data, out string strErrorMessage)
        {
            strErrorMessage = null;
            List<string> conditions = new List<string>();
            conditions.Add(string.Format("b.{0} = {1}", Temporary.Fields.nor_yn, data.IsNormal));

            ICollection<int> teamNos = GetTemporaryTeamNos(data, out strErrorMessage);

            if (strErrorMessage != null)
                return null;

            if (teamNos != null && teamNos.Count > 0)
                conditions.Add(string.Format("a.{0} in ({1})", TemporaryMember.Fields.tmpr_sn, string.Join(",", teamNos)));
            else if (data.tmpr_sn > 0)
                conditions.Add(string.Format("a.{0} = {1}", TemporaryMember.Fields.tmpr_sn, data.tmpr_sn));

            return string.Join(" and ", conditions);
        }

        private ICollection<int> GetTemporaryTeamNos(DisplayTemporaryMember data, out string strErrorMessage)
        {
            strErrorMessage = null;

            if (data.tmpr_sn <= 0)
                return null;

            if (data.IncludeChildTeams == false)
                return new List<int>() { data.tmpr_sn };

            string strCondition = string.Format("{0} = {1}", Temporary.Fields.tmpr_sn, data.tmpr_sn);
            return CustomManager.GetRecursiveQuery(m_dataManager, Temporary.TableName, Temporary.Fields.tmpr_sn.ToString(), Temporary.Fields.parnts_sn.ToString(), strCondition, out strErrorMessage);
        }

        private string GetRegularMemberOrderBy(DisplayRegularMember data)
        {
            if (data.SortType == null)
                return null;

            string strDirection = data.SortMethod ? "asc" : "desc";

            switch ((int)data.SortType)
            {
                case DisplayRegularMemberSortTypeCode.RegularMemberNo:
                    return string.Format("b.{0} {1}", RegularMember.Fields.rgl_memb_sn, strDirection);
                default:
                    return null;
            }
        }

        private string GetTemporaryMemberOrderBy(DisplayTemporaryMember data)
        {
            if (data.SortType == null)
                return null;

            string strDirection = data.SortMethod ? "asc" : "desc";

            switch ((int)data.SortType)
            {
                case DisplayTemporaryMemberSortTypeCode.TemporaryMemberNo:
                    return string.Format("a.{0} {1}", TemporaryMember.Fields.tmpr_memb_sn, strDirection);
                default:
                    return null;
            }
        }

        private ResponseDisplayRegularMember MakeRegularMemberList(ArrayList arrDatas, DisplayRegularMember data, string strErrorMessage)
        {
            if (arrDatas == null)
                return new ResponseDisplayRegularMember(false, strErrorMessage);

            int nDataCount = arrDatas.Count;
            ResponseDisplayRegularMember response = new ResponseDisplayRegularMember(true, "");

            Dictionary<int, string> dicJobLevels = null;
            Dictionary<int, string> dicJobPositions = null;
            Dictionary<int, string> dicJobStatus = null;

            string strMemberNos = null;
            Dictionary<int, RegularMemberEx> dicMembers = new Dictionary<int, RegularMemberEx>();

            for (int i = 0; i < nDataCount - 1; i += 2)
            {
                if (arrDatas[i] is Regular && arrDatas[i + 1] is RegularMember)
                {
                    Regular regular = (Regular)arrDatas[i];
                    RegularMember member = (RegularMember)arrDatas[i + 1];

                    if (member.telno != null && member.telno.Length > 0)
                        member.telno = dnsDapperDBUtil.AES256Cipher.AES_decrypt(member.telno);

                    RegularMemberEx memberEx = new RegularMemberEx(member);

                    if (CheckSearchText(member, regular, data, ref dicJobLevels, ref dicJobPositions, ref dicJobStatus, out strErrorMessage))
                    {
                        response.RegularMembers.Add(memberEx);
                        dicMembers[memberEx.rgl_memb_sn] = memberEx;

                        if (strMemberNos == null)
                            strMemberNos = memberEx.rgl_memb_sn.ToString();
                        else
                            strMemberNos += "," + memberEx.rgl_memb_sn.ToString();
                    }
                    else if (strErrorMessage != null)
                    {
                        return new ResponseDisplayRegularMember(false, strErrorMessage);
                    }
                }
            }

            if (CheckHasUserInfo(dicMembers, strMemberNos, out strErrorMessage) == false)
                return new ResponseDisplayRegularMember(false, strErrorMessage);

            response.TotalCount = response.RegularMembers.Count;
            return response;
        }

        private ResponseDisplayRegularMember MakeRegularMemberListFromPaging(ArrayList arrDatas, string strErrorMessage)
        {
            if (arrDatas == null)
                return new ResponseDisplayRegularMember(false, strErrorMessage);

            ResponseDisplayRegularMember response = new ResponseDisplayRegularMember(true, "");
            string strMemberNos = null;
            Dictionary<int, RegularMemberEx> dicMembers = new Dictionary<int, RegularMemberEx>();

            for (int i = 0; i < arrDatas.Count - 2; i += 3)
            {
                if (arrDatas[i] is Base.DAL.Models.Pagination && arrDatas[i + 1] is Regular && arrDatas[i + 2] is RegularMember)
                {
                    Base.DAL.Models.Pagination pagination = (Base.DAL.Models.Pagination)arrDatas[i];
                    RegularMember member = (RegularMember)arrDatas[i + 2];

                    if (member.telno != null && member.telno.Length > 0)
                        member.telno = dnsDapperDBUtil.AES256Cipher.AES_decrypt(member.telno);

                    RegularMemberEx memberEx = new RegularMemberEx(member);
                    response.RegularMembers.Add(memberEx);
                    response.TotalCount = pagination.TotalCount;
                    dicMembers[memberEx.rgl_memb_sn] = memberEx;

                    if (strMemberNos == null)
                        strMemberNos = memberEx.rgl_memb_sn.ToString();
                    else
                        strMemberNos += "," + memberEx.rgl_memb_sn.ToString();
                }
            }

            if (CheckHasUserInfo(dicMembers, strMemberNos, out strErrorMessage) == false)
                return new ResponseDisplayRegularMember(false, strErrorMessage);

            return response;
        }

        private ResponseDisplayTemporaryMember MakeTemporaryMemberList(ArrayList arrDatas, DisplayTemporaryMember data, string strErrorMessage)
        {
            if (arrDatas == null)
                return new ResponseDisplayTemporaryMember(false, strErrorMessage);

            ResponseDisplayTemporaryMember response = new ResponseDisplayTemporaryMember(true, "");
            Dictionary<int, string> dicJobLevels = null;
            Dictionary<int, string> dicJobPositions = null;
            Dictionary<int, string> dicRoles = null;

            for (int i = 0; i < arrDatas.Count - 3; i += 4)
            {
                if (arrDatas[i] is TemporaryMember && arrDatas[i + 1] is Temporary && (arrDatas[i + 2] is Regular || arrDatas[i + 2] == null) && (arrDatas[i + 3] is RegularMember || arrDatas[i + 3] == null))
                {
                    TemporaryMember temporaryMember = (TemporaryMember)arrDatas[i];
                    Temporary temporary = (Temporary)arrDatas[i + 1];
                    Regular regular = (Regular)arrDatas[i + 2];
                    RegularMember regularMember = (RegularMember)arrDatas[i + 3];

                    if (CheckSearchText(temporaryMember, temporary, regular, regularMember, data, ref dicJobLevels, ref dicJobPositions, ref dicRoles, out strErrorMessage))
                    {
                        RegularmemberTemporarymember member = new RegularmemberTemporarymember(temporaryMember, temporary, regular, regularMember);
                        response.TemporaryMembers.Add(member);
                    }
                    else if (strErrorMessage != null)
                    {
                        return new ResponseDisplayTemporaryMember(false, strErrorMessage);
                    }
                }
            }

            response.TotalCount = response.TemporaryMembers.Count;
            return response;
        }

        private ResponseDisplayTemporaryMember MakeTemporaryMemberListFromPaging(ArrayList arrDatas, string strErrorMessage)
        {
            if (arrDatas == null)
                return new ResponseDisplayTemporaryMember(false, strErrorMessage);

            ResponseDisplayTemporaryMember response = new ResponseDisplayTemporaryMember(true, "");

            for (int i = 0; i < arrDatas.Count - 4; i += 5)
            {
                if (arrDatas[i] is Base.DAL.Models.Pagination && arrDatas[i + 1] is TemporaryMember && arrDatas[i + 2] is Temporary && (arrDatas[i + 3] is Regular || arrDatas[i + 3] == null) && (arrDatas[i + 4] is RegularMember || arrDatas[i + 4] == null))
                {
                    Base.DAL.Models.Pagination pagination = (Base.DAL.Models.Pagination)arrDatas[i];
                    TemporaryMember temporaryMember = (TemporaryMember)arrDatas[i + 1];
                    Temporary temporary = (Temporary)arrDatas[i + 2];
                    Regular regular = (Regular)arrDatas[i + 3];
                    RegularMember regularMember = (RegularMember)arrDatas[i + 4];

                    response.TemporaryMembers.Add(new RegularmemberTemporarymember(temporaryMember, temporary, regular, regularMember));
                    response.TotalCount = pagination.TotalCount;
                }
            }

            return response;
        }

        private void SortRegularMembers(List<RegularMemberEx> members, DisplayRegularMember data)
        {
            if (members == null || data.SortType == null)
                return;

            switch ((int)data.SortType)
            {
                case DisplayRegularMemberSortTypeCode.RegularMemberNo:
                    members.Sort((a, b) => data.SortMethod ? a.rgl_memb_sn.CompareTo(b.rgl_memb_sn) : b.rgl_memb_sn.CompareTo(a.rgl_memb_sn));
                    break;
            }
        }

        private void SortTemporaryMembers(List<RegularmemberTemporarymember> members, DisplayTemporaryMember data)
        {
            if (members == null || data.SortType == null)
                return;

            switch ((int)data.SortType)
            {
                case DisplayTemporaryMemberSortTypeCode.TemporaryMemberNo:
                    members.Sort((a, b) => data.SortMethod ? a.TemporaryMemberNo.CompareTo(b.TemporaryMemberNo) : b.TemporaryMemberNo.CompareTo(a.TemporaryMemberNo));
                    break;
            }
        }

        private void ApplyRegularMemberPaging(ResponseDisplayRegularMember response, DisplayRegularMember data)
        {
            if (response == null)
                return;

            response.TotalCount = response.RegularMembers.Count;

            if (data.PageRowCount == null || data.PageRowCount <= 0)
                return;

            int beginIndex = (data.PageNo - 1) * (int)data.PageRowCount;

            if (beginIndex < 0)
                beginIndex = 0;

            if (beginIndex >= response.RegularMembers.Count)
            {
                response.RegularMembers.Clear();
                return;
            }

            int endIndex = beginIndex + (int)data.PageRowCount;

            if (endIndex > response.RegularMembers.Count)
                endIndex = response.RegularMembers.Count;

            response.RegularMembers = response.RegularMembers.GetRange(beginIndex, endIndex - beginIndex);
        }

        private void ApplyTemporaryMemberPaging(ResponseDisplayTemporaryMember response, DisplayTemporaryMember data)
        {
            if (response == null)
                return;

            response.TotalCount = response.TemporaryMembers.Count;

            if (data.PageRowCount == null || data.PageRowCount <= 0)
                return;

            int beginIndex = (data.PageNo - 1) * (int)data.PageRowCount;

            if (beginIndex < 0)
                beginIndex = 0;

            if (beginIndex >= response.TemporaryMembers.Count)
            {
                response.TemporaryMembers.Clear();
                return;
            }

            int endIndex = beginIndex + (int)data.PageRowCount;

            if (endIndex > response.TemporaryMembers.Count)
                endIndex = response.TemporaryMembers.Count;

            response.TemporaryMembers = response.TemporaryMembers.GetRange(beginIndex, endIndex - beginIndex);
        }

        public ResponseJobLevels LoadJobLevel()
        {
            string strErrorMessage;
            string strCondition = string.Format("{0} = {1}", Option.Fields.team_optn_ty_no, (int)CodeType.JobLevel);
            IEnumerable<Option> options = m_dataManager.GetSelect().Select<Option>(strCondition, out strErrorMessage);

            if (options == null)
                return new ResponseJobLevels(false, strErrorMessage);

            ResponseJobLevels response = new ResponseJobLevels(true, "");
            response.Options.AddRange(options);
            return response;
        }

        public ResponseJobPositions LoadJobPosition()
        {
            string strErrorMessage;
            string strCondition = string.Format("{0} = {1}", Option.Fields.team_optn_ty_no, (int)CodeType.JobPosition);
            IEnumerable<Option> options = m_dataManager.GetSelect().Select<Option>(strCondition, out strErrorMessage);

            if (options == null)
                return new ResponseJobPositions(false, strErrorMessage);

            ResponseJobPositions response = new ResponseJobPositions(true, "");
            response.Options.AddRange(options);
            return response;
        }

        public ResponseDisplayRegularMember LoadRegularMembers(DisplayRegularMember data)
        {
            string strErrorMessage;
            string strCondition = MakeRegularMemberCondition(data, out strErrorMessage);

            if (strErrorMessage != null)
                return new ResponseDisplayRegularMember(false, strErrorMessage);

            JoinManager joinManager = new JoinManager(m_dataManager);
            bool useSortedSqlPaging = UseSortedSqlPaging(data.SearchText, data.SortType, data.PageRowCount);

            if (useSortedSqlPaging)
            {
                int? beginIndex = data.GetBeginIndex();
                int? itemCount = data.PageRowCount;

                if (beginIndex == null)
                {
                    beginIndex = 1;
                    itemCount = null;
                }

                string strOrderBy = GetRegularMemberOrderBy(data);
                ArrayList arrDatas = joinManager.JoinRegularRegularMember(strCondition, (int)beginIndex, itemCount, strOrderBy, out strErrorMessage);
                ResponseDisplayRegularMember response = MakeRegularMemberListFromPaging(arrDatas, strErrorMessage);

                if (response.Success == false)
                    return response;

                if (arrDatas != null && arrDatas.Count == 0 && (int)beginIndex > 1)
                {
                    ArrayList arrTemp = joinManager.JoinRegularRegularMember(strCondition, 1, itemCount, strOrderBy, out strErrorMessage);

                    if (arrTemp != null && arrTemp.Count > 0 && arrTemp[0] is Base.DAL.Models.Pagination)
                        response.TotalCount = ((Base.DAL.Models.Pagination)arrTemp[0]).TotalCount;
                }

                return response;
            }

            ArrayList arrList = joinManager.JoinRegularRegularMember(strCondition, out strErrorMessage);
            ResponseDisplayRegularMember finalResponse = MakeRegularMemberList(arrList, data, strErrorMessage);

            if (finalResponse.Success == false)
                return finalResponse;

            SortRegularMembers(finalResponse.RegularMembers, data);
            ApplyRegularMemberPaging(finalResponse, data);
            return finalResponse;
        }

        private bool CheckHasUserInfo(Dictionary<int, RegularMemberEx> dicMembers, string strMemberNos, out string strErrorMessage)
        {
            strErrorMessage = null;

            if (strMemberNos == null)
                return true;

            string strCondition = string.Format("{0} in ({1})", Model.Account.User.Fields.rgl_memb_sn, strMemberNos);
            var users = m_dataManager.GetSelect().Select<Model.Account.User>(strCondition, out strErrorMessage);

            if (users == null)
                return false;

            foreach (var user in users)
            {
                if (user.rgl_memb_sn != null)
                {
                    RegularMemberEx member;

                    if (dicMembers.TryGetValue((int)user.rgl_memb_sn, out member))
                    {
                        member.HasUserInfo = true;
                    }
                }
            }

            return true;
        }

        private bool CheckSearchText(RegularMember member, Regular regular, DisplayRegularMember data, ref Dictionary<int, string> dicJobLevels, ref Dictionary<int, string> dicJobPositions, ref Dictionary<int, string> dicJobStatus, out string strErrorMessage)
        {
            strErrorMessage = null;

            if (data.SearchText == null)
                return true;

            string strSearchText = data.SearchText.Trim().ToLower();

            if (strSearchText.Length == 0)
                return true;

            if (member.memb_name.ToLower().Contains(strSearchText))
                return true;

            if (data.SearchTeamName)
            {
                if (regular.team_name.ToLower().Contains(strSearchText))
                    return true;
            }

            if (data.SearchJobLevel && member.clsf_no != null)
            {
                if (dicJobLevels == null)
                {
                    if (ReadTeamOptions(ref dicJobLevels, ref dicJobPositions, out strErrorMessage) == false)
                        return false;
                }

                string strJobLevel;

                if (dicJobLevels.TryGetValue((int)member.clsf_no, out strJobLevel))
                {
                    if (strJobLevel.ToLower().Contains(strSearchText))
                        return true;
                }
            }

            if (data.SearchJobPosition && member.ofcps_no != null)
            {
                if (dicJobPositions == null)
                {
                    if (ReadTeamOptions(ref dicJobLevels, ref dicJobPositions, out strErrorMessage) == false)
                        return false;
                }

                string strJobPosition;

                if (dicJobPositions.TryGetValue((int)member.ofcps_no, out strJobPosition))
                {
                    if (strJobPosition.ToLower().Contains(strSearchText))
                        return true;
                }
            }

            if (data.SearchUniqueKey && member.unq_key != null)
            {
                if (member.unq_key.ToLower().Contains(strSearchText))
                    return true;
            }

            if (data.SearchPhoneNumber && member.telno != null && member.telno.Length > 0)
            {
                if (member.telno.Contains(strSearchText))
                    return true;
            }

            if (data.SearchOfficePhoneNumber && member.offm_telno != null && member.offm_telno.Length > 0)
            {
                if (member.offm_telno.Contains(strSearchText))
                    return true;
            }

            if (data.SearchEmail && member.email != null)
            {
                if (member.email.ToLower().Contains(strSearchText))
                    return true;
            }

            if (data.SearchJobStatus && member.dty_sttus_no != null)
            {
                if (dicJobStatus == null)
                {
                    dicJobStatus = ReadJobStatus(out strErrorMessage);

                    if (dicJobStatus == null)
                        return false;
                }

                string strJobStatus;

                if (dicJobStatus.TryGetValue((int)member.dty_sttus_no, out strJobStatus))
                {
                    if (strJobStatus.ToLower().Contains(strSearchText))
                        return true;
                }
            }

            if (data.SearchMemo && member.memo != null)
            {
                if (member.memo.ToLower().Contains(strSearchText))
                    return true;
            }

            return false;
        }

        private Dictionary<int, string> ReadJobStatus(out string strErrorMessage)
        {
            string strCondition = string.Format("{0} = {1}", Model.Common.Codes.Fields.cl_code, (int)CodeType.JobStatus);
            IEnumerable<Model.Common.Codes> codes = m_dataManager.GetSelect().Select<Model.Common.Codes>(strCondition, out strErrorMessage);

            if (codes == null)
                return null;

            Dictionary<int, string> dicJobStatus = new Dictionary<int, string>();

            foreach (var code in codes)
            {
                dicJobStatus[code.code] = code.code_name;
            }

            return dicJobStatus;
        }

        private bool ReadTeamOptions(ref Dictionary<int, string> dicJobLevels, ref Dictionary<int, string> dicJobPositions, out string strErrorMessage)
        {
            var options = m_dataManager.GetSelect().Select<Option>(null, out strErrorMessage);

            if (options == null)
                return false;

            foreach (var option in options)
            {
                if (option.team_optn_ty_no == (int)CodeType.JobLevel)
                {
                    if (dicJobLevels == null)
                        dicJobLevels = new Dictionary<int, string>();

                    dicJobLevels[option.team_optn_no] = option.team_optn_name;
                }
                else if (option.team_optn_ty_no == (int)CodeType.JobPosition)
                {
                    if (dicJobPositions == null)
                        dicJobPositions = new Dictionary<int, string>();

                    dicJobPositions[option.team_optn_no] = option.team_optn_name;
                }
            }

            return true;
        }

        private string MakeInCondition(object fieldName, ICollection<int> teamNos)
        {
            if (teamNos == null || teamNos.Count == 0)
                return null;

            return string.Format("{0} in ({1})", fieldName, string.Join(", ", teamNos));
        }

        private int GetTotalTeamMemberCount(int teamNo, Dictionary<int, int> directCounts, Dictionary<int, List<int>> childMap, Dictionary<int, int> totalCounts, HashSet<int> visiting)
        {
            if (totalCounts.ContainsKey(teamNo))
                return totalCounts[teamNo];

            int total = directCounts.ContainsKey(teamNo) ? directCounts[teamNo] : 0;

            if (visiting.Contains(teamNo))
                return total;

            visiting.Add(teamNo);

            List<int> childTeamNos;
            if (childMap.TryGetValue(teamNo, out childTeamNos))
            {
                foreach (int childTeamNo in childTeamNos)
                {
                    total += GetTotalTeamMemberCount(childTeamNo, directCounts, childMap, totalCounts, visiting);
                }
            }

            visiting.Remove(teamNo);
            totalCounts[teamNo] = total;
            return total;
        }

        private List<TeamMemberCount> MakeRegularMemberCounts(List<Regular> regulars, out string strErrorMessage)
        {
            strErrorMessage = null;
            List<TeamMemberCount> memberCounts = new List<TeamMemberCount>();

            if (regulars == null || regulars.Count == 0)
                return memberCounts;

            List<int> teamNos = new List<int>();
            Dictionary<int, int> directCounts = new Dictionary<int, int>();
            Dictionary<int, List<int>> childMap = new Dictionary<int, List<int>>();

            foreach (Regular regular in regulars)
            {
                if (!directCounts.ContainsKey(regular.rgl_sn))
                    directCounts[regular.rgl_sn] = 0;

                teamNos.Add(regular.rgl_sn);

                if (regular.parnts_sn.HasValue)
                {
                    if (!childMap.ContainsKey(regular.parnts_sn.Value))
                        childMap[regular.parnts_sn.Value] = new List<int>();

                    childMap[regular.parnts_sn.Value].Add(regular.rgl_sn);
                }
            }

            string strCondition = MakeInCondition(RegularMember.Fields.rgl_sn, teamNos);
            IEnumerable<RegularMember> members = m_dataManager.GetSelect().Select<RegularMember>(strCondition, out strErrorMessage);

            if (members == null)
                return null;

            foreach (RegularMember member in members)
            {
                if (directCounts.ContainsKey(member.rgl_sn))
                    directCounts[member.rgl_sn]++;
            }

            Dictionary<int, int> totalCounts = new Dictionary<int, int>();
            HashSet<int> visiting = new HashSet<int>();

            foreach (Regular regular in regulars)
            {
                int count = GetTotalTeamMemberCount(regular.rgl_sn, directCounts, childMap, totalCounts, visiting);
                memberCounts.Add(new TeamMemberCount(regular.rgl_sn, count));
            }

            return memberCounts;
        }

        private List<TeamMemberCount> MakeTemporaryMemberCounts(List<Temporary> temporaries, out string strErrorMessage)
        {
            strErrorMessage = null;
            List<TeamMemberCount> memberCounts = new List<TeamMemberCount>();

            if (temporaries == null || temporaries.Count == 0)
                return memberCounts;

            List<int> teamNos = new List<int>();
            Dictionary<int, int> directCounts = new Dictionary<int, int>();
            Dictionary<int, List<int>> childMap = new Dictionary<int, List<int>>();

            foreach (Temporary temporary in temporaries)
            {
                if (!directCounts.ContainsKey(temporary.tmpr_sn))
                    directCounts[temporary.tmpr_sn] = 0;

                teamNos.Add(temporary.tmpr_sn);

                if (temporary.parnts_sn.HasValue)
                {
                    if (!childMap.ContainsKey(temporary.parnts_sn.Value))
                        childMap[temporary.parnts_sn.Value] = new List<int>();

                    childMap[temporary.parnts_sn.Value].Add(temporary.tmpr_sn);
                }
            }

            string strCondition = MakeInCondition(TemporaryMember.Fields.tmpr_sn, teamNos);
            IEnumerable<TemporaryMember> members = m_dataManager.GetSelect().Select<TemporaryMember>(strCondition, out strErrorMessage);

            if (members == null)
                return null;

            foreach (TemporaryMember member in members)
            {
                if (directCounts.ContainsKey(member.tmpr_sn))
                    directCounts[member.tmpr_sn]++;
            }

            Dictionary<int, int> totalCounts = new Dictionary<int, int>();
            HashSet<int> visiting = new HashSet<int>();

            foreach (Temporary temporary in temporaries)
            {
                int count = GetTotalTeamMemberCount(temporary.tmpr_sn, directCounts, childMap, totalCounts, visiting);
                memberCounts.Add(new TeamMemberCount(temporary.tmpr_sn, count));
            }

            return memberCounts;
        }

        public ResponseDisplayRegular LoadRegulars(int? siteNo)
        {
            string strErrorMessage;
            string strCondition = "";

            if (siteNo.HasValue && siteNo > 0)
            {
                // site 번호가 null이면 모든 Regular에 해당한다.
                strCondition = string.Format("{0} = {1} or {0} is NULL", Regular.Fields.site_sn, siteNo.Value);
            }

            IEnumerable<Regular> regulars = m_dataManager.GetSelect().Select<Regular>(strCondition, out strErrorMessage);

            if (regulars == null)
                return new ResponseDisplayRegular(false, strErrorMessage);

            List<Regular> regularList = new List<Regular>(regulars);
            List<TeamMemberCount> memberCounts = MakeRegularMemberCounts(regularList, out strErrorMessage);

            if (memberCounts == null)
                return new ResponseDisplayRegular(false, strErrorMessage);

            ResponseDisplayRegular response = new ResponseDisplayRegular(true, "");
            response.Regulars.AddRange(regularList);
            response.MemberCounts.AddRange(memberCounts);
            return response;
        }

        public ResponseDisplayTemporary LoadTemporaries(bool isNormal, int? siteNo)
        {
            string strErrorMessage;
            string strCondition = string.Format("{0} = {1}", Temporary.Fields.nor_yn, CustomManager.GetBoolValue(m_dataManager, isNormal));

            if (siteNo != null)
            {
                strCondition += string.Format(" and {0} = {1}", Temporary.Fields.site_sn, (int)siteNo);
            }

            IEnumerable<Temporary> temporaries = m_dataManager.GetSelect().Select<Temporary>(strCondition, out strErrorMessage);

            if (temporaries == null)
                return new ResponseDisplayTemporary(false, strErrorMessage);

            List<Temporary> temporaryList = new List<Temporary>(temporaries);
            List<TeamMemberCount> memberCounts = MakeTemporaryMemberCounts(temporaryList, out strErrorMessage);

            if (memberCounts == null)
                return new ResponseDisplayTemporary(false, strErrorMessage);

            ResponseDisplayTemporary response = new ResponseDisplayTemporary(true, "");
            response.Temporaries.AddRange(temporaryList);
            response.MemberCounts.AddRange(memberCounts);
            return response;
        }

        public ResponseTemporaryMembers LoadTemporaryMembers()
        {
            JoinManager joinManager = new JoinManager(m_dataManager);

            string strErrorMessage;
            ArrayList arrDatas = joinManager.JoinTemporaryMemberTemporaryRegularRegularMember(null, out strErrorMessage);

            if (arrDatas == null)
                return new ResponseTemporaryMembers(false, strErrorMessage);

            int nDataCount = arrDatas.Count;

            ResponseTemporaryMembers response = new ResponseTemporaryMembers(true, "");

            for (int i = 0; i < nDataCount - 3; i += 4)
            {
                if (arrDatas[i] is TemporaryMember && arrDatas[i + 1] is Temporary && (arrDatas[i + 2] is Regular || arrDatas[i + 2] == null) && (arrDatas[i + 3] is RegularMember || arrDatas[i + 3] == null))
                {
                    TemporaryMember temporaryMember = (TemporaryMember)arrDatas[i];
                    Temporary temporary = (Temporary)arrDatas[i + 1];
                    Regular regular = (Regular)arrDatas[i + 2];
                    RegularMember regularMember = (RegularMember)arrDatas[i + 3];

                    TemporaryMemberInfo member = new TemporaryMemberInfo(temporaryMember, temporary, regular, regularMember);
                    response.TemporaryMemberInfos.Add(member);
                }
            }

            return response;
        }

        public MessageResult RemoveRegularMembers(RequestRemoveRegularMember data)
        {
            string strErrorMessage = null;
            MessageResult res = new MessageResult();

            IDataManager dataManager = m_dataManager.Clone();

            if (dataManager.BeginBatch(out strErrorMessage) == false)
                return new MessageResult(false, DBException.FAIL_TO_BEGIN_BATCH);

            // RegularMember 삭제
            if (DeleteManager.RemoveRegularMember(dataManager, data.Members, out strErrorMessage) == false)
            {
                string strTemp;
                dataManager.BatchRollback(out strTemp);
                res.Success = false;
                res.Message = strErrorMessage;
            }
            else
            {
                if (dataManager.BatchCommit(out strErrorMessage) == false)
                {
                    string strTemp;
                    dataManager.BatchRollback(out strTemp);
                    res.Success = false;
                    res.Message = strErrorMessage;
                }
                else
                {
                    res.Success = true;
                    res.Message = "";
                }
            }

            return res;
        }

        public MessageResult RemoveRegularTeams(RequestRemoveRegularTeam data)
        {
            string strErrorMessage = null;
            MessageResult res = new MessageResult();

            IDataManager dataManager = m_dataManager.Clone();

            if (dataManager.BeginBatch(out strErrorMessage) == false)
                return new MessageResult(false, DBException.FAIL_TO_BEGIN_BATCH);

            // Regular 삭제
            if (DeleteManager.RemoveRegular(dataManager, data.TeamNos, out strErrorMessage) == false)
            {
                string strTemp;
                dataManager.BatchRollback(out strTemp);
                res.Success = false;
                res.Message = strErrorMessage;
            }
            else
            {
                if (dataManager.BatchCommit(out strErrorMessage) == false)
                {
                    string strTemp;
                    dataManager.BatchRollback(out strTemp);
                    res.Success = false;
                    res.Message = strErrorMessage;
                }
                else
                {
                    res.Success = true;
                    res.Message = "";
                }
            }

            return res;
        }

        public MessageResult RemoveTemporaryMembers(RequestRemoveTemporaryMember data)
        {
            string strErrorMessage = null;
            MessageResult res = new MessageResult();

            IDataManager dataManager = m_dataManager.Clone();

            if (dataManager.BeginBatch(out strErrorMessage) == false)
                return new MessageResult(false, DBException.FAIL_TO_BEGIN_BATCH);

            if (DeleteManager.RemoveTemporaryMembers(dataManager, data.Members, out strErrorMessage) == false)
            {
                string strTemp;
                dataManager.BatchRollback(out strTemp);
                res.Success = false;
                res.Message = strErrorMessage;
            }
            else
            {
                if (dataManager.BatchCommit(out strErrorMessage) == false)
                {
                    string strTemp;
                    dataManager.BatchRollback(out strTemp);
                    res.Success = false;
                    res.Message = strErrorMessage;
                }
                else
                {
                    res.Success = true;
                    res.Message = "";
                }
            }

            return res;
        }

        public MessageResult RemoveTemporaryTeams(RequestRemoveTemporaryTeam data)
        {
            string strErrorMessage = null;
            MessageResult res = new MessageResult();

            IDataManager dataManager = m_dataManager.Clone();

            if (dataManager.BeginBatch(out strErrorMessage) == false)
                return new MessageResult(false, DBException.FAIL_TO_BEGIN_BATCH);

            if (DeleteManager.RemoveTemporaries(dataManager, data.TeamNos, out strErrorMessage) == false)
            {
                string strTemp;
                dataManager.BatchRollback(out strTemp);
                res.Success = false;
                res.Message = strErrorMessage;
            }
            else
            {
                if (dataManager.BatchCommit(out strErrorMessage) == false)
                {
                    string strTemp;
                    dataManager.BatchRollback(out strTemp);
                    res.Success = false;
                    res.Message = strErrorMessage;
                }
                else
                {
                    res.Success = true;
                    res.Message = "";
                }
            }

            return res;
        }

        public MessageResult SaveUpdateData(RequestSaveUpdateData data)
        {
            string strErrorMessage = null;
            MessageResult res = new MessageResult();

            IDataManager dataManager = m_dataManager.Clone();

            if (dataManager.BeginBatch(out strErrorMessage) == false)
                return new MessageResult(false, DBException.FAIL_TO_BEGIN_BATCH);

            if (SaveManager.SaveUpdateData(dataManager, data, out strErrorMessage) == false)
            {
                string strTemp;
                dataManager.BatchRollback(out strTemp);
                res.Success = false;
                res.Message = strErrorMessage;
            }
            else
            {
                if (dataManager.BatchCommit(out strErrorMessage) == false)
                {
                    string strTemp;
                    dataManager.BatchRollback(out strTemp);
                    res.Success = false;
                    res.Message = strErrorMessage;
                }
                else
                {
                    res.Success = true;
                    res.Message = "";
                }
            }

            return res;
        }

        public ResponseUpdateRegularMember UpdateRegularMember(RequestUpdateRegularMember data)
        {
            string strErrorMessage = null;
            ResponseUpdateRegularMember res = new ResponseUpdateRegularMember();

            IDataManager dataManager = m_dataManager.Clone();

            if (dataManager.BeginBatch(out strErrorMessage) == false)
                return new ResponseUpdateRegularMember(false, DBException.FAIL_TO_BEGIN_BATCH);

            if (!string.IsNullOrEmpty(data.Member.telno))
            {
                string encPhone = dnsDapperDBUtil.AES256Cipher.AES_encrypt(data.Member.telno);
                string phoneCondition = string.Format("{0} = '{1}'", RegularMember.Fields.telno, encPhone);

                if (data.Member.rgl_memb_sn > 0)
                    phoneCondition += string.Format(" AND {0} != {1}", RegularMember.Fields.rgl_memb_sn, data.Member.rgl_memb_sn);

                RegularMember existing = dataManager.GetSelect().SelectFirst<RegularMember>(phoneCondition, out strErrorMessage);
                if (strErrorMessage != null)
                    return new ResponseUpdateRegularMember(false, strErrorMessage);

                if (existing != null)
                {
                    string strTemp;
                    dataManager.BatchRollback(out strTemp);
                    return new ResponseUpdateRegularMember(false, "이미 사용 중인 전화번호입니다.");
                }
            }
            
            if (!string.IsNullOrEmpty(data.Member.email))
            {
                string emailCondition = string.Format("{0} = '{1}'", RegularMember.Fields.email, data.Member.email);

                if (data.Member.rgl_memb_sn > 0)
                    emailCondition += string.Format(" AND {0} != {1}", RegularMember.Fields.rgl_memb_sn, data.Member.rgl_memb_sn);

                RegularMember existing = dataManager.GetSelect().SelectFirst<RegularMember>(emailCondition, out strErrorMessage);
                if (strErrorMessage != null)
                    return new ResponseUpdateRegularMember(false, strErrorMessage);

                if (existing != null)
                {
                    string strTemp;
                    dataManager.BatchRollback(out strTemp);
                    return new ResponseUpdateRegularMember(false, "이미 사용 중인 이메일입니다.");
                }
            }
            
            int newNo = SaveManager.UpdateRegularMember(dataManager, data, out strErrorMessage);

            if (newNo < 0)
            {
                string strTemp;
                dataManager.BatchRollback(out strTemp);
                res.Success = false;
                res.Message = strErrorMessage;
            }
            else
            {
                if (dataManager.BatchCommit(out strErrorMessage) == false)
                {
                    string strTemp;
                    dataManager.BatchRollback(out strTemp);
                    res.Success = false;
                    res.Message = strErrorMessage;
                }
                else
                {
                    res.Success = true;
                    res.Message = "";

                    if (newNo > 0)
                        res.NewNo = newNo;
                }
            }

            return res;
        }

        public ResponseUpdateRegularTeam UpdateRegularTeam(RequestUpdateRegularTeam data)
        {
            string strErrorMessage = null;
            ResponseUpdateRegularTeam res = new ResponseUpdateRegularTeam();

            IDataManager dataManager = m_dataManager.Clone();

            if (dataManager.BeginBatch(out strErrorMessage) == false)
                return new ResponseUpdateRegularTeam(false, DBException.FAIL_TO_BEGIN_BATCH);

            int newNo = SaveManager.UpdateRegular(dataManager, data, out strErrorMessage);

            if (newNo < 0)
            {
                string strTemp;
                dataManager.BatchRollback(out strTemp);
                res.Success = false;
                res.Message = strErrorMessage;
            }
            else
            {
                if (dataManager.BatchCommit(out strErrorMessage) == false)
                {
                    string strTemp;
                    dataManager.BatchRollback(out strTemp);
                    res.Success = false;
                    res.Message = strErrorMessage;
                }
                else
                {
                    res.Success = true;
                    res.Message = "";

                    if (newNo > 0)
                        res.NewNo = newNo;
                }
            }

            return res;
        }

        public ResponseUpdateTemporaryMember UpdateTemporaryMember(RequestUpdateTemporaryMember data)
        {
            string strErrorMessage = null;
            ResponseUpdateTemporaryMember res = new ResponseUpdateTemporaryMember();

            IDataManager dataManager = m_dataManager.Clone();

            if (dataManager.BeginBatch(out strErrorMessage) == false)
                return new ResponseUpdateTemporaryMember(false, DBException.FAIL_TO_BEGIN_BATCH);

            int newNo = SaveManager.UpdateTemporaryMember(dataManager, data, out strErrorMessage);

            if (newNo < 0)
            {
                string strTemp;
                dataManager.BatchRollback(out strTemp);
                res.Success = false;
                res.Message = strErrorMessage;
            }
            else
            {
                if (dataManager.BatchCommit(out strErrorMessage) == false)
                {
                    string strTemp;
                    dataManager.BatchRollback(out strTemp);
                    res.Success = false;
                    res.Message = strErrorMessage;
                }
                else
                {
                    res.Success = true;
                    res.Message = "";

                    if (newNo > 0)
                        res.NewNo = newNo;
                }
            }

            return res;
        }

        public ResponseUpdateTemporaryTeam UpdateTemporaryTeam(RequestUpdateTemporaryTeam data)
        {
            string strErrorMessage = null;
            ResponseUpdateTemporaryTeam res = new ResponseUpdateTemporaryTeam();

            if (data.TemporaryTeam.team_name == null || data.TemporaryTeam.team_name.Length == 0)
                data.TemporaryTeam.team_name = "새 비상조직";

            IDataManager dataManager = m_dataManager.Clone();

            if (dataManager.BeginBatch(out strErrorMessage) == false)
                return new ResponseUpdateTemporaryTeam(false, DBException.FAIL_TO_BEGIN_BATCH);

            int newNo = SaveManager.UpdateTemporaryTeam(dataManager, data, out strErrorMessage);

            if (newNo < 0)
            {
                string strTemp;
                dataManager.BatchRollback(out strTemp);
                res.Success = false;
                res.Message = strErrorMessage;
            }
            else
            {
                if (dataManager.BatchCommit(out strErrorMessage) == false)
                {
                    string strTemp;
                    dataManager.BatchRollback(out strTemp);
                    res.Success = false;
                    res.Message = strErrorMessage;
                }
                else
                {
                    res.Success = true;
                    res.Message = "";

                    if (newNo > 0)
                        res.NewNo = newNo;
                }
            }

            return res;
        }

        public ResponseTemporaryRoleList LoadTemporaryRoleList()
        {
            string strErrorMessage;
            string strCondition = string.Format("{0} = {1} order by {2}", Option.Fields.team_optn_ty_no, TeamManager.RoleOptionNumber, Option.Fields.team_optn_no);
            IEnumerable<Option> options = m_dataManager.GetSelect().Select<Option>(strCondition, out strErrorMessage);

            if (options == null)
                return new ResponseTemporaryRoleList(false, strErrorMessage);

            ResponseTemporaryRoleList response = new ResponseTemporaryRoleList(true, "");

            foreach (Option option in options)
            {
                response.RoleDatas.Add(new RoleData(option.team_optn_no, option.team_optn_name));
            }

            return response;
        }
    }
}
