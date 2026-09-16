using Base.Model.Common.Team;
using dnsDapperDBUtil.DataAccessLayer.DAL;
using dnsDapperDBUtil.DataAccessLayer.IDAL;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace AccessERP
{
    class DBManager
    {
        private IDataManager m_dataManager = null;
        private AccessERPManager m_parent = null;

        public DBManager(AccessERPManager parent, IDataManager dataManager)
        {
            m_parent = parent;
            m_dataManager = dataManager;
        }

        public Dictionary<string, int> GetLevels(IDataManager dataManager, out string strErrMsg)
        {
            strErrMsg = null;

            Dictionary<string, int> dicLevels = new Dictionary<string, int>();

            try
            {
                string strConditions = $"{Option.Fields.team_optn_ty_no} = {(int)dnsData.CommonCode.CodeType.JobLevel}";

                IEnumerable<Option> options = dataManager.GetSelect().Select<Option>(strConditions, out strErrMsg);
                if (options == null)
                {
                    throw new ApplicationException(strErrMsg);
                }

                foreach (Option option in options)
                {
                    if (dicLevels.ContainsKey(option.team_optn_name) == false)
                    {
                        dicLevels[option.team_optn_name] = option.team_optn_no;
                    }
                }
            }
            catch (Exception e)
            {
                strErrMsg = "GetLevels Error: " + e.Message;
                dicLevels = null;
            }

            return dicLevels;            
        }

        public List<Regular> GetRegulars(out string strErrMsg)
        {
            strErrMsg = null;

            List<Regular> teams = new List<Regular>();

            try
            {
                string strConditions = null;

                IEnumerable<Regular> regulars = m_dataManager.GetSelect().Select<Regular>(strConditions, out strErrMsg);
                if (regulars == null)
                {
                    throw new ApplicationException(strErrMsg);
                }

                teams.AddRange(regulars);
            }
            catch (Exception e)
            {
                strErrMsg = "GetRegulars Error: " + e.Message;
                teams = null;
            }

            return teams;
        }

        public List<RegularMember> GetRegularMembers(out string strErrMsg)
        {
            strErrMsg = null;

            List<RegularMember> members = new List<RegularMember>();

            try
            {
                string strConditions = null;

                IEnumerable<RegularMember> regularMembers = m_dataManager.GetSelect().Select<RegularMember>(strConditions, out strErrMsg);
                if (regularMembers == null)
                {
                    throw new ApplicationException(strErrMsg);
                }

                members.AddRange(regularMembers);
            }
            catch (Exception e)
            {
                strErrMsg = "GetRegularMembers Error: " + e.Message;
                members = null;
            }

            return members;
        }

        public Dictionary<string, int> CompareJobLevel(IDataManager dataManager, Dictionary<string, int> dicLevels, List<string> levels, out string strErrMsg)
        {
            strErrMsg = null;

            Dictionary<string, int> compareLevels = new Dictionary<string, int>();

            try
            {
                if (dicLevels == null)
                {
                    m_parent.Logger.Write("dicLevels null");
                    dicLevels = new Dictionary<string, int>();
                }

                // 비교하여 없는 것들만 추려서 추가
                foreach (string level in levels)
                {
                    if (level == null)
                        continue;

                    if (dicLevels.ContainsKey(level) == false)
                    {
                        compareLevels[level] = -1;
                    }
                }

                // 추가 후 기존 것들이랑 병합
                if (compareLevels.Count > 0)
                {
                    // team_optn_no 최대값 구하기
                    int team_optn_no = (int)dnsData.CommonCode.CodeType.JobLevel;
                    string strSQL = $"SELECT MAX({Option.Fields.team_optn_no}) AS max FROM {Option.TableName} WHERE {Option.Fields.team_optn_ty_no} = {(int)dnsData.CommonCode.CodeType.JobLevel}";

                    dynamic dynamic = dataManager.GetSelect().SelectFirst(strSQL, out strErrMsg);
                    if (dynamic != null)
                    {
                        int? nMax = dynamic.max;
                        if (nMax.HasValue)
                        {
                            team_optn_no = nMax.Value + 1;
                        }
                    }

                    // 추가
                    List<Option> options = new List<Option>();

                    foreach (KeyValuePair<string, int> pair in compareLevels)
                    {
                        Option option = new Option();
                        option.team_optn_no = team_optn_no;
                        option.team_optn_ty_no = (int)dnsData.CommonCode.CodeType.JobLevel;
                        option.team_optn_name = pair.Key;

                        options.Add(option);

                        team_optn_no++;
                    }

                    if (dataManager.GetCreate().Insert<Option>(options, out strErrMsg) == false)
                    {
                        throw new ApplicationException(strErrMsg);
                    }

                    // 다시 조회
                    compareLevels = GetLevels(dataManager, out strErrMsg);
                    if (compareLevels == null)
                    {
                        throw new ApplicationException(strErrMsg);
                    }
                }
                else
                {
                    compareLevels = dicLevels;
                }
            }
            catch (Exception e)
            {
                compareLevels = null;
                strErrMsg = "CompareJobLevel Error: " + e.Message;
            }
           
            return compareLevels;
        }

        public bool Synchronization(IDataManager dataManager, List<ORG> orgs, List<Person> people, Dictionary<string, int> dicJobLevels, List<Regular> regulars, List<RegularMember> regularMembers, out string strErrMsg)
        {
            bool bRet = false;
            strErrMsg = null;

            try
            {
                //List<ORG> org_new = new List<ORG>();
                //List<ORG> org_update = new List<ORG>();

                List<Regular> regulars_new = new List<Regular>();
                List<Regular> regulars_update = new List<Regular>();

                // 조직 비교
                foreach (ORG org in orgs)
                {
                    Regular regular = regulars.Find(x => x.rgl_sn == org.OrgID);
                    if (regular == null)
                    {
                        //org_new.Add(org);

                        Regular _regular = new Regular();
                        _regular.rgl_sn = org.OrgID;
                        _regular.team_name = org.OrgName;
                        _regular.parnts_sn = org.ParentOrgID;
                        _regular.site_sn = 120;

                        regulars_new.Add(_regular);
                    }
                    else
                    {
                        if (org.OrgName != regular.team_name || org.ParentOrgID != regular.parnts_sn)
                        {
                            //org_update.Add(org);

                            regular.team_name = org.OrgName;
                            regular.parnts_sn = org.ParentOrgID;

                            regulars_update.Add(regular);
                        }
                    }
                }

                List<Regular> regulars_remove = new List<Regular>();
                string strRegularRemoveIDs = null;

                foreach (Regular regular in regulars)
                {
                    ORG _org = orgs.Find(x => x.OrgID == regular.rgl_sn);
                    if (_org == null)
                    {
                        regulars_remove.Add(regular);

                        if (strRegularRemoveIDs == null)
                            strRegularRemoveIDs = regular.rgl_sn.ToString();
                        else
                            strRegularRemoveIDs += "," + regular.rgl_sn.ToString();
                    }
                }

                // 조직원 비교
                //List<Person> people_new = new List<Person>();
                //List<Person> people_update = new List<Person>();

                List<RegularMember> members_new = new List<RegularMember>();
                List<RegularMember> members_update = new List<RegularMember>();

                foreach (Person person in people)
                {
                    RegularMember member = regularMembers.Find(x => x.unq_key == person.Sabun);
                    if (member == null)
                    {
                        //people_new.Add(person);

                        RegularMember _regularMember = new RegularMember();
                        _regularMember.unq_key = person.Sabun;
                        _regularMember.memb_name = person.Name;
                        _regularMember.rgl_sn = person.OrgID;
                        _regularMember.offm_telno = person.Tel;

                        string strMobile = null;
                        if (person.Mobile?.Length > 0)
                        {
                            strMobile = dnsDapperDBUtil.AES256Cipher.AES_encrypt(person.Mobile);
                        }
                        _regularMember.telno = strMobile;

                        members_new.Add(_regularMember);
                    }
                    else
                    {
                        string strGradeName = null;
                        string strMobile = null;

                        if (member.clsf_no.HasValue && dicJobLevels.ContainsValue(member.clsf_no.Value))
                            strGradeName = dicJobLevels.FirstOrDefault(x => x.Value == member.clsf_no.Value).Key;

                        if (member.telno?.Length > 0)
                        {
                            strMobile = dnsDapperDBUtil.AES256Cipher.AES_decrypt(member.telno);
                        }

                        if (person.Name != member.memb_name || 
                            person.OrgID != member.rgl_sn ||
                            person.GradeName != strGradeName ||
                            person.Tel != member.offm_telno ||
                            person.Mobile != strMobile)
                        {
                            //people_update.Add(person);

                            member.memb_name = person.Name;
                            member.rgl_sn = person.OrgID;
                            member.offm_telno = person.Tel;

                            strMobile = null;
                            if (person.Mobile?.Length > 0)
                            {
                                strMobile = dnsDapperDBUtil.AES256Cipher.AES_encrypt(person.Mobile);
                            }
                            member.telno = strMobile;

                            int? nGradeNo = null;
                            if (person.GradeName?.Length > 0 && dicJobLevels.ContainsKey(person.GradeName))
                                nGradeNo = dicJobLevels[person.GradeName];

                            member.clsf_no = nGradeNo;

                            members_update.Add(member);
                        }
                    }
                }

                string strMemberRemoveIDs = null;
                List<RegularMember> members_remove = new List<RegularMember>();

                foreach (RegularMember regularMember in regularMembers)
                {
                    Person person = people.Find(x => x.Sabun == regularMember.unq_key);
                    if (person == null)
                    {
                        members_remove.Add(regularMember);

                        if (strMemberRemoveIDs == null)
                            strMemberRemoveIDs = regularMember.rgl_memb_sn.ToString();
                        else
                            strMemberRemoveIDs += "," + regularMember.rgl_memb_sn.ToString();

                    }
                }

                // 새 조직 추가
                if (regulars_new.Count > 0)
                {
                    string strSQL = "ALTER TABLE [dbo].[co_team_rgl] NOCHECK CONSTRAINT [FK_co_team_rgl_TO_co_team_rgl] ";
                    if (dataManager.GetCreate().Insert(strSQL, out strErrMsg) == false)
                    {
                        throw new ApplicationException(strErrMsg);
                    }

                    strSQL = "SET IDENTITY_INSERT [dbo].[co_team_rgl] ON ";
                    if (dataManager.GetCreate().Insert(strSQL, out strErrMsg) == false)
                    {
                        throw new ApplicationException(strErrMsg);
                    }

                    foreach (Regular regular in regulars_new)
                    {
                        strSQL = $"INSERT INTO {Regular.TableName} ({Regular.Fields.rgl_sn}, {Regular.Fields.team_name}, {Regular.Fields.parnts_sn}, {Regular.Fields.site_sn}) VALUES ({regular.rgl_sn}, '{regular.team_name}', {(regular.parnts_sn == null ? "NULL" : regular.parnts_sn)}, {regular.site_sn})";
                        if (dataManager.GetCreate().Insert(strSQL, out strErrMsg) == false)
                        {
                            throw new ApplicationException(strErrMsg);
                        }
                    }

                    strSQL = "ALTER TABLE [dbo].[co_team_rgl] CHECK CONSTRAINT [FK_co_team_rgl_TO_co_team_rgl]";
                    if (dataManager.GetCreate().Insert(strSQL, out strErrMsg) == false)
                    {
                        throw new ApplicationException(strErrMsg);
                    }

                    strSQL = "SET IDENTITY_INSERT [dbo].[co_team_rgl] OFF ";
                    if (dataManager.GetCreate().Insert(strSQL, out strErrMsg) == false)
                    {
                        throw new ApplicationException(strErrMsg);
                    }
                }

                // 조직 업데이트
                if (regulars_update.Count > 0)
                {
                    if (dataManager.GetUpdate().Update<Regular>(regulars_update, out strErrMsg) == false)
                    {
                        throw new ApplicationException(strErrMsg);
                    }
                }

                // 새 조직원 추가
                if (members_new.Count > 0)
                {
                    foreach (RegularMember member in members_new)
                    {
                        if (dataManager.GetCreate().Insert<RegularMember>(member, out strErrMsg) == false)
                        {
                            m_parent.Logger.Write("RegularMember Insert Error: " + strErrMsg);
                        }
                    }                    
                }

                // 조직원 업데이트
                if (members_update.Count > 0)
                {
                    if (dataManager.GetUpdate().Update<RegularMember>(members_update, out strErrMsg) == false)
                    {
                        throw new ApplicationException(strErrMsg);
                    }
                }

                // 조직원 삭제 하기 전 연관 처리                
                if (members_remove.Count > 0)
                {                    
                    // acc_user - 대상 NULL 처리
                    Dictionary<Base.Model.Account.User.Fields, object> dicSets = new Dictionary<Base.Model.Account.User.Fields, object>();
                    dicSets[Base.Model.Account.User.Fields.rgl_memb_sn] = null;

                    string strConditions = $"{Base.Model.Account.User.Fields.rgl_memb_sn} in ({strMemberRemoveIDs})";

                    if (dataManager.GetUpdate().Update<Base.Model.Account.User, Base.Model.Account.User.Fields>(dicSets, strConditions, out strErrMsg) == false)
                    {
                        throw new ApplicationException(strErrMsg);
                    }

                    // co_team_tmpr_memb - 대상 NULL 처리
                    Dictionary<TemporaryMember.Fields, object> dicSets_TemporaryMember = new Dictionary<TemporaryMember.Fields, object>();
                    dicSets_TemporaryMember[TemporaryMember.Fields.rgl_memb_sn] = null;

                    strConditions = $"{TemporaryMember.Fields.rgl_memb_sn} in ({strMemberRemoveIDs})";

                    if (dataManager.GetUpdate().Update<TemporaryMember, TemporaryMember.Fields>(dicSets_TemporaryMember, strConditions, out strErrMsg) == false)
                    {
                        throw new ApplicationException(strErrMsg);
                    }

                    // fa_sensor_fclty_mgr_rgl_memb - 대상 삭제
                    strConditions = $"{Base.Model.Sensor.FacilityManagerRegularMember.Fields.rgl_memb_sn} in ({strMemberRemoveIDs})";
                    if (dataManager.GetDelete().Delete<Base.Model.Sensor.FacilityManagerRegularMember>(strConditions, out strErrMsg) == false)
                    {
                        throw new ApplicationException(strErrMsg);
                    }


                    // his_sms_rcver - 대상 삭제
                    strConditions = $"{Base.Model.History.SMSReceiver.Fields.rgl_memb_sn} in ({strMemberRemoveIDs})";
                    if (dataManager.GetDelete().Delete<Base.Model.History.SMSReceiver>(strConditions, out strErrMsg) == false)
                    {
                        throw new ApplicationException(strErrMsg);
                    }


                    // 조직원 삭제
                    strConditions = $"{RegularMember.Fields.rgl_memb_sn} in ({strMemberRemoveIDs})";
                    if (dataManager.GetDelete().Delete<RegularMember>(strConditions, out strErrMsg) == false)
                    {
                        throw new ApplicationException(strErrMsg);
                    }
                }

                // 조직 삭제
                if (regulars_remove.Count > 0)
                {
                    string strConditions2 = $"{Regular.Fields.rgl_sn} in ({strRegularRemoveIDs})";
                    if (dataManager.GetDelete().Delete<Regular>(strConditions2, out strErrMsg) == false)
                    {
                        throw new ApplicationException(strErrMsg);
                    }
                }

                bRet = true;
            }
            catch(Exception e)
            {
                string strSQL = "ALTER TABLE [dbo].[co_team_rgl] CHECK CONSTRAINT [FK_co_team_rgl_TO_co_team_rgl]";
                if (dataManager.GetCreate().Insert(strSQL, out strErrMsg) == false)
                {
                    throw new ApplicationException(strErrMsg);
                }

                strSQL = "SET IDENTITY_INSERT [dbo].[co_team_rgl] OFF ";
                if (dataManager.GetCreate().Insert(strSQL, out strErrMsg) == false)
                {
                    throw new ApplicationException(strErrMsg);
                }

                bRet = false;
                strErrMsg = "Synchronization Error: " + e.Message;
            }

            return bRet;
        }
    }
}
