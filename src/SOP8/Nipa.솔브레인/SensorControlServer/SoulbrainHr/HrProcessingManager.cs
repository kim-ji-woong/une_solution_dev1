using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using Base.Model.Common.Team;
using dnsDapperDBUtil;
using dnsDapperDBUtil.DataAccessLayer.DAL;
using dnsDapperDBUtil.DataAccessLayer.IDAL;
using dnsData.CommonCode;
using dnsPipeHelper;
using SoulbrainHr.Data;

namespace SoulbrainHr
{
    public class HrProcessingManager
    {
        private int m_nSiteID = 0;

        private IDataManager m_dataManager = null;
        private DataManager m_hrDataManager = null;

        private Dictionary<string, List<Regular>> m_dicCurrentRegular = null;
        private Dictionary<string, RegularMember> m_dicCurrentRegularMember = null;
        private List<RegularMember> m_listCurrentDuplicatedRegularMember = null;

        private Dictionary<string, HRData.HrRegular> m_dicHrRegulars = null;
        private Dictionary<string, HRData.HrRegularMember> m_dicHrRegularMembers = null;

        private HrEntityManager m_hrEntityManager = null;
        private HrDataProcessingManager m_hrDataProcessingManager = null;

        private Dictionary<string, Option> m_dicJobPositionOptions = null;
        private Dictionary<string, Option> m_dicJobLevelOptions = null;
        private Dictionary<string, Option> m_dicJobStatusOptions = null;

        private const int MEMBER_STATUS_CD = 500104; // 재직

        public HrProcessingManager(IDataManager dataManager, DataManager hrDataManager, int nSiteID)
        {
            m_nSiteID = nSiteID;
            m_dataManager = dataManager;
            m_hrDataManager = hrDataManager;
            m_hrEntityManager = new HrEntityManager(hrDataManager);
            m_hrDataProcessingManager = new HrDataProcessingManager(dataManager);
        }

        public bool ProcessingSynchronous(Logger logger, out string strErrorMessage)
        {
            strErrorMessage = String.Empty;

            DataManager clone = m_dataManager.Clone() as DataManager;

            if (clone == null)
                return false;

            try
            {
                if (clone.BeginBatch(out strErrorMessage) == false)
                    throw new ApplicationException(strErrorMessage);

                // 직위 직책 조회
                if (LoadCurrentOptions(out strErrorMessage) == false)
                    logger.Write($@"[ERROR] LoadCurrentOptions has Error : {strErrorMessage}");

                // 직위 직책값 업데이트
                if (UpdateOptions(clone, out strErrorMessage) == false)
                    logger.Write($@"[ERROR] UpdateOptions has Error : {strErrorMessage}");

                // Soulbrain_HR. Member, Team 조회
                if (LoadHrData(out strErrorMessage) == false)
                    logger.Write($@"[ERROR] LoadHrData has Error : {strErrorMessage}");

                // co_team_rgl 조회
                if (LoadCurrentTeam(clone, out strErrorMessage) == false)
                    logger.Write($@"[ERROR] LoadCurrentTeam has Error : {strErrorMessage}");

                // co_team_rgl_member 조회
                if (LoadCurrentMember(clone, out strErrorMessage) == false)
                    logger.Write($@"[ERROR] LoadCurrentMember has Error : {strErrorMessage}");

                // 동기화
                if (SetHrData(clone, out strErrorMessage) == false)
                    logger.Write($@"[ERROR] SetHrData has Error : {strErrorMessage}");

                if (clone.BatchCommit(out strErrorMessage) == false)
                    logger.Write($@"[ERROR] BatchCommit has Error : {strErrorMessage}");

                return true;
            }
            catch (Exception e)
            {
                clone.BatchRollback(out string rollbackMsg);
                    
                // 원래 발생한 예외 메시지를 설정
                strErrorMessage = e.Message;
                    
                // 필요하다면 롤백 에러도 함께 기록 (선택사항)
                if (!string.IsNullOrEmpty(rollbackMsg))
                {
                    strErrorMessage += $" (Rollback Error: {rollbackMsg})";
                }

                return false;
            }
        }

        private bool LoadCurrentOptions(out string strErrorMessage)
        {
            strErrorMessage = string.Empty;

            m_dicJobStatusOptions = new Dictionary<string, Option>();
            m_dicJobPositionOptions = new Dictionary<string, Option>();
            m_dicJobLevelOptions = new Dictionary<string, Option>();

            try
            {
                IEnumerable<Option> options = m_dataManager.GetSelect().Select<Option>(null, out strErrorMessage);

                if (options == null)
                    return false;

                foreach (Option option in options)
                {
                    if (option.team_optn_ty_no == (int)CodeType.JobStatus) // 500100
                        m_dicJobStatusOptions.Add(option.team_optn_name, option);
                    else if (option.team_optn_ty_no == (int)CodeType.JobPosition) // 500300
                        m_dicJobPositionOptions.Add(option.team_optn_name, option);
                    else if (option.team_optn_ty_no == (int)CodeType.JobLevel) // 500200
                        m_dicJobLevelOptions.Add(option.team_optn_name, option);
                }

                List<Option> optionsList = options.ToList();

                // options 객체들의 프로퍼티 team_optn_no의 값중 500200 500300이 없으면 Insert 먼저 해준다.
                if (optionsList.Select(x => x.team_optn_no).Contains((int)CodeType.JobLevel) == false)
                {
                    string strInsertOption =
                        $@"INSERT INTO {Option.TableName} ({Option.Fields.team_optn_name}, {Option.Fields.team_optn_ty_no}, {Option.Fields.team_optn_no})
                                    VALUES ('알 수 없음', {(int)CodeType.JobLevel}, {(int)CodeType.JobLevel})";
                    if (m_dataManager.GetCreate().Insert(strInsertOption, out strErrorMessage) == false)
                        return false;

                    m_dicJobLevelOptions["알 수 없음"] = new Option
                    {
                        team_optn_name = "알 수 없음",
                        team_optn_no = (int)CodeType.JobLevel,
                        team_optn_ty_no = (int)CodeType.JobLevel
                    };
                }

                if (optionsList.Select(x => x.team_optn_no).Contains((int)CodeType.JobPosition) == false)
                {
                    string strInsertOption =
                        $@"INSERT INTO {Option.TableName} ({Option.Fields.team_optn_name}, {Option.Fields.team_optn_ty_no}, {Option.Fields.team_optn_no})
                                    VALUES ('알 수 없음', {(int)CodeType.JobPosition}, {(int)CodeType.JobPosition})";

                    if (m_dataManager.GetCreate().Insert(strInsertOption, out strErrorMessage) == false)
                        return false;

                    m_dicJobPositionOptions["알 수 없음"] = new Option
                    {
                        team_optn_name = "알 수 없음",
                        team_optn_no = (int)CodeType.JobPosition,
                        team_optn_ty_no = (int)CodeType.JobPosition
                    };
                }

                // m_dicJobPositionOptions 와 m_dicJobLevelOptions 를 Value.team_optn_no 값 기준으로 오름차순으로 정렬.
                m_dicJobLevelOptions = m_dicJobLevelOptions.OrderBy(x => x.Value.team_optn_no)
                    .ToDictionary(x => x.Key, x => x.Value);
                m_dicJobPositionOptions = m_dicJobPositionOptions.OrderBy(x => x.Value.team_optn_no)
                    .ToDictionary(x => x.Key, x => x.Value);
            }
            catch (Exception e)
            {
                strErrorMessage = e.Message;
                return false;
            }

            return true;
        }

        private bool UpdateOptions(DataManager dbManager, out string strErrorMessage)
        {
            strErrorMessage = String.Empty;

            string strJobLevelQuery = $@"SELECT JIKWEE_NM from Member Group By JIKWEE_NM";

            IEnumerable<dynamic> jobLevels = m_hrDataManager.GetSelect().Select(strJobLevelQuery, out strErrorMessage);

            if (jobLevels == null)
                return false;

            foreach (dynamic jl in jobLevels)
            {
                if (m_dicJobLevelOptions.ContainsKey(jl.JIKWEE_NM))
                    continue;

                Option opt = new Option();
                opt.team_optn_name = jl.JIKWEE_NM;
                opt.team_optn_no = GetOptionNo(CodeType.JobLevel, out strErrorMessage);
                opt.team_optn_ty_no = (int)CodeType.JobLevel;

                if (dbManager.GetCreate().Insert<Option>(opt, out strErrorMessage) == false)
                {
                    strErrorMessage = $@"UpdateOptions() : Option Insert Error : {strErrorMessage}";
                    return false;
                }

                m_dicJobLevelOptions.Add(jl.JIKWEE_NM, opt);
            }

            string strJobPostionQuery = $@"SELECT JIKCHAK_NM from Member Group By JIKCHAK_NM";

            IEnumerable<dynamic> jobPostions =
                m_hrDataManager.GetSelect().Select(strJobPostionQuery, out strErrorMessage);

            if (jobPostions == null)
                return false;

            foreach (dynamic jp in jobPostions)
            {
                if (m_dicJobPositionOptions.ContainsKey(jp.JIKCHAK_NM))
                    continue;

                Option opt = new Option();
                opt.team_optn_name = jp.JIKCHAK_NM;
                opt.team_optn_no = GetOptionNo(CodeType.JobPosition, out strErrorMessage);
                opt.team_optn_ty_no = (int)CodeType.JobPosition;

                if (dbManager.GetCreate().Insert<Option>(opt, out strErrorMessage) == false)
                {
                    strErrorMessage = $@"UpdateOptions() : Option Insert Error : {strErrorMessage}";
                    return false;
                }

                m_dicJobPositionOptions.Add(jp.JIKCHAK_NM, opt);
            }

            return true;
        }

        /// <summary>
        /// CodeType 범위내의 빈값을 찾아 반환한다.
        /// </summary>
        /// <param name="codeType"></param>
        /// <param name="strErrorMessage"></param>
        /// <returns></returns>
        private int GetOptionNo(CodeType codeType, out string strErrorMessage)
        {
            strErrorMessage = String.Empty;

            int boundary = 100;

            // CodeType에 따른 Dictionary 선택
            Dictionary<string, Option> optionDict = null;

            switch (codeType)
            {
                case CodeType.JobLevel:
                    optionDict = m_dicJobLevelOptions;
                    break;
                case CodeType.JobPosition:
                    optionDict = m_dicJobPositionOptions;
                    break;
                default:
                    return (int)codeType;
            }

            // 공통 로직
            return FindAvailableOptionNumber(optionDict, codeType, boundary, out strErrorMessage);
        }

        /// <summary>
        /// 지정된 범위에서 사용되지 않은 첫 번째 번호를 찾아 반환한다.
        /// </summary>
        /// <param name="optionDict">옵션 Dictionary</param>
        /// <param name="codeType">코드 타입</param>
        /// <param name="boundary">범위</param>
        /// <returns></returns>
        private int FindAvailableOptionNumber(Dictionary<string, Option> optionDict, CodeType codeType, int boundary,
            out string strErrorMessage)
        {
            strErrorMessage = String.Empty;

            var usedNumbers = new HashSet<int>(
                optionDict.Values.Select(x => x.team_optn_no)
                    .Where(x => x >= (int)codeType && x < (int)codeType + boundary)
            );

            for (int i = (int)codeType; i < (int)codeType + boundary; i++)
            {
                if (!usedNumbers.Contains(i))
                    return i;
            }

            strErrorMessage = $@"사용 가능한 옵션코드 값이 없습니다. CodeType : {codeType}";
            return (int)codeType;
        }


        /// <summary>
        /// Regular Dictionary Key = team_name
        /// RegularMember Dictionary Key = unq_key
        /// </summary>
        /// <param name="strErrorMessage"></param>
        /// <returns></returns>
        private bool LoadCurrentTeam(DataManager dbManager, out string strErrorMessage)
        {
            strErrorMessage = String.Empty;

            m_dicCurrentRegular = new Dictionary<string, List<Regular>>();

            IEnumerable<Regular> curretRegulars = dbManager.GetSelect().Select<Regular>(null, out strErrorMessage);

            if (curretRegulars == null)
            {
                //m_logger.Write(LogTypes.Error, SdmsSensor.ServerType.Soulbrain_HR, m_nServerSeqNo, $@"Regular Table 조회 실패 : {strErrorMessage}");
                return false;
            }

            foreach (Regular regular in curretRegulars)
            {
                if (string.IsNullOrEmpty(regular.team_name))
                {
                    //m_logger.Write(LogTypes.Error, SdmsSensor.ServerType.Soulbrain_HR, m_nServerSeqNo, $@"LoadCurrentTeam() : Regular.team_name is null. : {regular.rgl_sn}");
                    continue;
                }

                if (!m_dicCurrentRegular.ContainsKey(regular.team_name))
                {
                    m_dicCurrentRegular[regular.team_name] = new List<Regular>();
                }
                m_dicCurrentRegular[regular.team_name].Add(regular);
            }

            return true;
        }

        private bool LoadCurrentMember(DataManager dbManager, out string strErrorMessage)
        {
            strErrorMessage = String.Empty;

            m_dicCurrentRegularMember = new Dictionary<string, RegularMember>();

            m_listCurrentDuplicatedRegularMember = new List<RegularMember>();

            try
            {
                IEnumerable<RegularMember> currentRegularMembers =
                    dbManager.GetSelect().Select<RegularMember>(null, out strErrorMessage);

                if (currentRegularMembers == null)
                {
                    //m_logger.Write(LogTypes.Error, SdmsSensor.ServerType.Soulbrain_HR, m_nServerSeqNo, $@"RegularMember Table 조회 실패 : {strErrorMessage}");
                    return false;
                }

                foreach (RegularMember regularMember in currentRegularMembers)
                {
                    if (string.IsNullOrEmpty(regularMember.unq_key))
                    {
                        //m_logger.Write(LogTypes.Error, SdmsSensor.ServerType.Soulbrain_HR, m_nServerSeqNo, $@"LoadCurrentTeam() : RegularMember.unq_key is null. : {regularMember.rgl_memb_sn}");
                        continue;
                    }

                    if (m_dicCurrentRegularMember.ContainsKey(regularMember.unq_key) == false)
                        m_dicCurrentRegularMember.Add(regularMember.unq_key, regularMember);
                    else
                    {
                        // 중복으로 존재하는 RegularMember는 전체적으로 동기화 하기 이전에 가장 나중에 입력된 값을 제외하고 모두 지운다.
                        RegularMember prevRegularMember = m_dicCurrentRegularMember[regularMember.unq_key];
                        if (prevRegularMember.rgl_memb_sn > regularMember.rgl_memb_sn)
                        {
                            m_listCurrentDuplicatedRegularMember.Add(regularMember);
                        }
                        else
                        {
                            m_listCurrentDuplicatedRegularMember.Add(prevRegularMember);
                            m_dicCurrentRegularMember.Remove(regularMember.unq_key);
                            m_dicCurrentRegularMember.Add(regularMember.unq_key, regularMember);
                        }
                    }
                }
            }
            catch (Exception e)
            {
                strErrorMessage = e.Message;
                return false;
            }

            return true;
        }

        public bool LoadHrData(out string strErrorMessage)
        {
            strErrorMessage = String.Empty;

            List<HRData.Team> HrTeams = m_hrEntityManager.GetHrTeamList(out strErrorMessage);
            if (HrTeams == null)
                return false;

            List<HRData.Member> HrMembers = m_hrEntityManager.GetHrMemberList(out strErrorMessage);
            if (HrMembers == null)
                return false;

            m_dicHrRegulars = new Dictionary<string, HRData.HrRegular>();
            m_dicHrRegularMembers = new Dictionary<string, HRData.HrRegularMember>();

            try
            {
                foreach (HRData.Team hrTeam in HrTeams)
                {
                    if (string.IsNullOrEmpty(hrTeam.ORG_NM))
                    {
                        continue;
                    }

                    HRData.HrRegular hrRegular = new HRData.HrRegular();
                    hrRegular.rgl_sn = -1;
                    hrRegular.team_name = hrTeam.ORG_NM;
                    hrRegular.site_sn = m_nSiteID;
                    hrRegular.ORG_CD = hrTeam.ORG_CD;
                    hrRegular.PRIOR_ORG_CD = hrTeam.PRIOR_ORG_CD;
                    hrRegular.ORG_LEVEL = hrTeam.ORG_LEVEL;

                    if (m_dicHrRegulars.ContainsKey(hrTeam.ORG_CD) == false)
                    {
                        m_dicHrRegulars.Add(hrTeam.ORG_CD, hrRegular);
                    }
                    
                }

                // m_dicHrRegulars를 Value.ORG_LEVEL기준 오름차순으로 정렬
                m_dicHrRegulars = m_dicHrRegulars.OrderBy(x => x.Value.ORG_LEVEL)
                    .ToDictionary(x => x.Key, x => x.Value);

                foreach (HRData.Member hrMember in HrMembers)
                {
                    if (string.IsNullOrEmpty(hrMember.SABUN))
                    {
                        continue;
                    }

                    HRData.HrRegularMember hrRegularMember = new HRData.HrRegularMember();
                    hrRegularMember.rgl_memb_sn = -1;
                    hrRegularMember.rgl_sn = -1;
                    hrRegularMember.unq_key = hrMember.SABUN;
                    hrRegularMember.ORG_CD = hrMember.ORG_CD;
                    hrRegularMember.email = hrMember.ADDRESS_IM;
                    hrRegularMember.offm_telno = hrMember.ADDRESS_OT;
                    hrRegularMember.telno = hrMember.ADDRESS_HP;
                    hrRegularMember.memb_name = hrMember.NAME;
                    hrRegularMember.JIKWEE_NM = hrMember.JIKWEE_NM;
                    hrRegularMember.JIKCHAK_NM = hrMember.JIKCHAK_NM;
                    hrRegularMember.clsf_optn_no = (int)CodeType.JobStatus;
                    hrRegularMember.clsf_no = GetJikweeCd(hrMember.JIKWEE_NM, out strErrorMessage);
                    hrRegularMember.ofcps_optn_no = (int)CodeType.JobPosition;
                    hrRegularMember.ofcps_no = GetJikchakCd(hrMember.JIKCHAK_NM, out strErrorMessage);
                    hrRegularMember.dty_sttus_optn_no = (int)CodeType.JobStatus;
                    hrRegularMember.dty_sttus_no = (int)CodeType.JobStatus;

                    m_dicHrRegularMembers[hrMember.SABUN] = hrRegularMember;
                }
            }
            catch (Exception e)
            {
                strErrorMessage = e.Message;
                return false;
            }

            return true;
        }

        private int GetJikweeCd(string strJikWeeName, out string strErrorMessage)
        {
            strErrorMessage = String.Empty;
            
            if (string.IsNullOrEmpty(strJikWeeName))
                return 500200;
            
            if (m_dicJobLevelOptions.ContainsKey(strJikWeeName) == false)
                return 500200;
            else
                return m_dicJobLevelOptions[strJikWeeName].team_optn_no;
            
        }

        private int GetJikchakCd(string strJikChakName, out string strErrorMessage)
        {
            strErrorMessage = String.Empty;
            
            if (string.IsNullOrEmpty(strJikChakName))
                return 500300;
            
            if (m_dicJobPositionOptions.ContainsKey(strJikChakName) == false)
                return 500300;
            else
                return m_dicJobPositionOptions[strJikChakName].team_optn_no;
            
        }

        private bool SetHrData(DataManager dbManager, out string strErrorMessage)
         {
             strErrorMessage = String.Empty;
             
             List<HRData.HrRegular> addRegulars = new List<HRData.HrRegular>();
             List<HRData.HrRegular> updateRegulars = new List<HRData.HrRegular>();
             List<Regular> deleteRegulars = new List<Regular>();
             
             List<HRData.HrRegularMember> addRegularMembers = new List<HRData.HrRegularMember>();
             List<HRData.HrRegularMember> updateRegularMembers = new List<HRData.HrRegularMember>();
             List<RegularMember> deleteRegularMembers = new List<RegularMember>();
  
             if (dbManager == null)
             {
                 strErrorMessage = "DataManager Clone() Error";
                 return false;
             }
             
             try
             {
                     Dictionary<string, int> mapOrgCdToRglSn = MapSourceToTarget(out strErrorMessage);
                     if (!string.IsNullOrEmpty(strErrorMessage)) return false;

                     foreach (KeyValuePair<string, HRData.HrRegular> hrRegularKV in m_dicHrRegulars)
                     {
                         HRData.HrRegular hrRegular = hrRegularKV.Value;
                         string orgCd = hrRegular.ORG_CD;

                         if (mapOrgCdToRglSn.ContainsKey(orgCd))
                         {
                             int existingSn = mapOrgCdToRglSn[orgCd];
                             hrRegular.rgl_sn = existingSn; // 기존 PK 사용
                             
                             updateRegulars.Add(hrRegular);

                             RemoveFromCurrentList(hrRegular.team_name, existingSn);
                         }
                         else
                         {
                             addRegulars.Add(hrRegular);
                         }
                     }
                 
                     foreach (var list in m_dicCurrentRegular.Values)
                     {
                         deleteRegulars.AddRange(list);
                     }
 
                     if (SetFilteredMember(deleteRegulars, out strErrorMessage) == false)
                     {
                         strErrorMessage = "SetFilteredMember() Error";
                         return false;
                     }
 
                     foreach (KeyValuePair<string, HRData.HrRegularMember> hrRegularMember in m_dicHrRegularMembers)
                     {
                         if (m_dicCurrentRegularMember.ContainsKey(hrRegularMember.Value.unq_key) == false)
                         {
                             addRegularMembers.Add(hrRegularMember.Value);
                             m_dicCurrentRegularMember.Remove(hrRegularMember.Value.unq_key);
                         }
                         else
                         {
                             if (CompareRegularMember(hrRegularMember.Value, m_dicCurrentRegularMember[hrRegularMember.Value.unq_key], out strErrorMessage) == false)
                             {
                                 hrRegularMember.Value.rgl_memb_sn = m_dicCurrentRegularMember[hrRegularMember.Value.unq_key].rgl_memb_sn;
                                 updateRegularMembers.Add(hrRegularMember.Value);
                                 m_dicCurrentRegularMember.Remove(hrRegularMember.Value.unq_key);
                             }
                             else
                             {
                                 m_dicCurrentRegularMember.Remove(hrRegularMember.Value.unq_key);
                             }
                         }
                     }
                 
                     deleteRegularMembers = m_dicCurrentRegularMember.Values.ToList();
                 
                     if (SaveRegular(dbManager, addRegulars, updateRegulars, deleteRegulars, out strErrorMessage) == false)
                         throw new ApplicationException(strErrorMessage);
                 
                     if (SaveRegularMember(dbManager, addRegularMembers, updateRegularMembers, deleteRegularMembers, out strErrorMessage) == false)
                         throw new ApplicationException(strErrorMessage);
             }
             catch (Exception e)
             {
                 strErrorMessage = e.Message;
                 return false;
             }
             
             return true;
         }
 
         /// <summary>
         /// 삭제대상이 된 Regular에 소속된 RegularMember는 Regular 처리과정에서 삭제되므로 별도로 관리하지 않는다.
         /// </summary>
         /// <param name="deleteRegulars"></param>
         /// <param name="strErrorMessage"></param>
         /// <returns></returns>
         private bool SetFilteredMember(List<Regular> deleteRegulars, out string strErrorMessage)
         {
             strErrorMessage = String.Empty;
 
             try
             {
                 foreach (KeyValuePair<string, RegularMember> regularMember in m_dicCurrentRegularMember)
                 {
                     int memberRglSn = regularMember.Value.rgl_sn;
 
                     foreach (Regular regular in deleteRegulars)
                     {
                         if (regular.rgl_sn == memberRglSn)
                             m_dicCurrentRegularMember.Remove(regularMember.Key);
                     }
                 }
             }
             catch (Exception e)
             {
                 strErrorMessage = e.Message;
                 return false;           
             }
             
             return true;
         }
 
         private bool CompareRegularMember(HRData.HrRegularMember hrRegularMember, RegularMember regularMember, out string strErrorMessage)
         {
             strErrorMessage = String.Empty;
             
             if ((hrRegularMember.email ?? "") != (regularMember.email ?? "") ||
                 (hrRegularMember.offm_telno ?? "") != (regularMember.offm_telno ?? "") ||
                 (hrRegularMember.memb_name ?? "") != (regularMember.memb_name ?? ""))
             {
                 if (hrRegularMember.rgl_sn != regularMember.rgl_sn && hrRegularMember.rgl_sn >= 1)
                     return false;
             }
 
             string targetTelNo = (hrRegularMember.telno ?? "").Trim();
             string decryptedTelNo = "";
                 
             if (!string.IsNullOrEmpty(regularMember.telno))
             {
                 try 
                 {
                     decryptedTelNo = AES256Cipher.AES_decrypt(regularMember.telno.Trim());
                     if (decryptedTelNo == null) decryptedTelNo = "";
                 }
                 catch
                 {
                     // 복호화 실패 시 불일치로 간주하거나 빈값 처리
                     decryptedTelNo = "";
                 }
             }
             
             if (targetTelNo != decryptedTelNo)
                 return false;
             
             List<Option> regularMemberOptions = GetRegularMemberOptions(regularMember, out strErrorMessage);
             
             Option jobLevelOption = regularMemberOptions.Find(x => x.team_optn_ty_no == (int)CodeType.JobLevel);
             Option jobPositionOption = regularMemberOptions.Find(x => x.team_optn_ty_no == (int)CodeType.JobPosition);
 
             if (jobLevelOption == null || jobLevelOption.team_optn_name != hrRegularMember.JIKWEE_NM)
                 return false;
             
             if (jobPositionOption == null || jobPositionOption.team_optn_name != hrRegularMember.JIKCHAK_NM)
                 return false;
             
             return true;
         }
 
         private List<Option> GetRegularMemberOptions(RegularMember regularMember, out string strErrorMessage)
         {
             strErrorMessage = String.Empty;
     
             var jobLevelOptions = m_dicJobLevelOptions.Values
                 .Where(opt => regularMember.clsf_no == opt.team_optn_no);
     
             var jobPositionOptions = m_dicJobPositionOptions.Values
                 .Where(opt => regularMember.ofcps_no == opt.team_optn_no);
     
             return jobLevelOptions.Concat(jobPositionOptions).ToList();
 
         }
 
        private bool SaveRegular(DataManager dbManager, List<HRData.HrRegular> addRegulars, List<HRData.HrRegular> updateRegulars, List<Regular> deleteRegulars, out string strErrorMessage)
        {
            strErrorMessage = String.Empty;
        
            StringBuilder sbAddAllQuery = new StringBuilder();
            StringBuilder sbUpdateAllQuery = new StringBuilder();
            StringBuilder sbDeleteAllQuery = new StringBuilder();
        
            foreach (HRData.HrRegular hrRegular in addRegulars)
            {
                string escapedTeamName = hrRegular.team_name?.Replace("'", "''") ?? "";
                
                string strAddQuery = $@"Insert Into {Regular.TableName} 
                                            (
                                                {Regular.Fields.team_name}, 
                                                {Regular.Fields.parnts_sn}, 
                                                {Regular.Fields.site_sn}
                                            )
                                            Values 
                                            (
                                                '{escapedTeamName}',
                                                NULL, 
                                                {m_nSiteID}
                                            );";
                
                sbAddAllQuery.AppendLine(strAddQuery);
            }

            foreach (HRData.HrRegular hrRegular in updateRegulars)
            {
                string strUpdateQuery = $@"Update {Regular.TableName} Set 
                                                        {Regular.Fields.team_name} = '{hrRegular.team_name}',
                                                        {Regular.Fields.site_sn} = {m_nSiteID}
                                                    Where {Regular.Fields.rgl_sn} = {hrRegular.rgl_sn};";
                sbUpdateAllQuery.AppendLine(strUpdateQuery);
            }

            foreach (Regular regular in deleteRegulars)
            {
                List<UNEData.ForeignKeyInfo> fkInfos = m_hrDataProcessingManager.GetForeignKeyInfo(dbManager, Regular.TableName,  nameof(Regular.Fields.rgl_sn), out strErrorMessage);
            
                // FK 정보를 불러오지 못하거나 FK로 설정되어있는 자식 테이블의 데이터를 처리하지 못할시에 쿼리를 추가하지 않는다.
                if (fkInfos == null || string.IsNullOrEmpty(strErrorMessage) == false)
                {
                    strErrorMessage = $"GetForeignKeyInfo() Error : {strErrorMessage}";
                    continue;
                }

                if (m_hrDataProcessingManager.AddForeignKeyQuery(dbManager, regular.rgl_sn, fkInfos, ref sbDeleteAllQuery, out strErrorMessage) == false)
                {
                    strErrorMessage = $"ProcessingForeignKey() Error : {strErrorMessage}";
                    continue;
                }
            
                string strDeleteQuery = $@"Delete From {Regular.TableName} Where {Regular.Fields.rgl_sn} = {regular.rgl_sn};";
            
                sbDeleteAllQuery.AppendLine(strDeleteQuery);
            }
        
            if (addRegulars.Any() && dbManager.GetDBManager().Excute(sbAddAllQuery.ToString(), out strErrorMessage) == false)
                return false;
        
            if (updateRegulars.Any() && dbManager.GetDBManager().Excute(sbUpdateAllQuery.ToString(), out strErrorMessage) == false)
                return false;
        
            if (deleteRegulars.Any() && dbManager.GetDBManager().Excute(sbDeleteAllQuery.ToString(), out strErrorMessage) == false)
                return false;

            return true;
        }
 
         private bool SaveRegularMember(DataManager dbManager, List<HRData.HrRegularMember> addRegularMembers, List<HRData.HrRegularMember> updateRegularMembers, List<RegularMember> deleteRegularMembers, out string strErrorMessage)
         {
             strErrorMessage = String.Empty;
             
             IEnumerable<Regular> regulars = dbManager.GetSelect().Select<Regular>(null, out strErrorMessage);
             
             if (regulars == null)
                 return false;
             
             List<Regular> regularList = regulars.ToList();
             
             StringBuilder sbAddAllQuery = new StringBuilder();
             StringBuilder sbUpdateAllQuery = new StringBuilder();
             StringBuilder sbDeleteAllQuery = new StringBuilder();
 
             foreach (HRData.HrRegularMember hrRegularMember in addRegularMembers)
             {
                 string escapedMemberName = hrRegularMember.memb_name?.Replace("'", "''") ?? "";
                 string escapedEmail = hrRegularMember.email?.Replace("'", "''") ?? "";
                 string escapedOffmTelno = hrRegularMember.offm_telno?.Replace("'", "''").Replace("-", "").Trim() ?? "";
                 if (escapedOffmTelno.Length >= 20)
                     escapedOffmTelno = "";
                 string escapedTelno;
 
                 if (string.IsNullOrEmpty(hrRegularMember.telno?.Trim()))
                 {
                     escapedTelno = "";
                 }
                 else
                 {
                     escapedTelno = AES256Cipher.AES_encrypt(hrRegularMember.telno?.Trim().Replace("'", "''")) ?? "";
                 }
                 
                 string orgName = m_dicHrRegulars.Values.FirstOrDefault(x => x.ORG_CD == hrRegularMember.ORG_CD)?.team_name;
                 if (string.IsNullOrEmpty(orgName))
                 {
                     continue;
                 }
                 
                 Regular regular = regularList.FirstOrDefault(x => x.team_name == orgName);
                 if (regular == null)
                 {
                     continue;
                 }
 
                 int rglSn = regular.rgl_sn;

                 int jobLevel = 0;
                 int jobPosition = 0;
                 try
                 {
                     string strJobLevelOption = string.IsNullOrEmpty(hrRegularMember.JIKWEE_NM)
                         ? "알 수 없음"
                         : hrRegularMember.JIKWEE_NM;
                     string strJobPosition = string.IsNullOrEmpty(hrRegularMember.JIKCHAK_NM)
                         ? "알 수 없음"
                         : hrRegularMember.JIKCHAK_NM;

                     jobLevel = m_dicJobLevelOptions[strJobLevelOption].team_optn_no;
                     jobPosition = m_dicJobPositionOptions[strJobPosition].team_optn_no;
                 }
                 catch (Exception e)
                 {
                     strErrorMessage = e.Message;
                     continue;
                 }
 
                 string strAddQuery = $@"INSERT INTO {RegularMember.TableName}
                                         (
                                             {RegularMember.Fields.rgl_sn},
                                             {RegularMember.Fields.memb_name}, 
                                             {RegularMember.Fields.unq_key},
                                             {RegularMember.Fields.email},
                                             {RegularMember.Fields.offm_telno},
                                             {RegularMember.Fields.telno},
                                             {RegularMember.Fields.clsf_optn_no},
                                             {RegularMember.Fields.clsf_no},
                                             {RegularMember.Fields.ofcps_optn_no},
                                             {RegularMember.Fields.ofcps_no},
                                             {RegularMember.Fields.dty_sttus_optn_no},
                                             {RegularMember.Fields.dty_sttus_no}
                                          )
                                         VALUES 
                                             (
                                              {rglSn},
                                              '{escapedMemberName}',
                                              '{hrRegularMember.unq_key}',
                                              '{escapedEmail}',
                                              '{escapedOffmTelno}',
                                              '{escapedTelno}',
                                              {(int)CodeType.JobLevel},
                                              {jobLevel},
                                              {(int)CodeType.JobPosition},
                                              {jobPosition},
                                              {(int)CodeType.JobStatus},
                                              {MEMBER_STATUS_CD}
                                             );";
                 sbAddAllQuery.AppendLine(strAddQuery);
             }
 
             foreach (HRData.HrRegularMember hrRegularMember in updateRegularMembers)
             {
                 string escapedMemberName = hrRegularMember.memb_name?.Replace("'", "''") ?? "";
                 string escapedEmail = hrRegularMember.email?.Replace("'", "''") ?? "";
                 string escapedOffmTelno = hrRegularMember.offm_telno?.Replace("'", "''").Replace("-", "") ?? "";
                 string escapedTelno;
                 
                 if (escapedOffmTelno.Length >= 20)
                     escapedOffmTelno = "";
 
                 if (string.IsNullOrEmpty(hrRegularMember.telno?.Trim()))
                 {
                     escapedTelno = "";
                 }
                 else
                 {
                     escapedTelno = AES256Cipher.AES_encrypt(hrRegularMember.telno?.Trim().Replace("'", "''")) ?? "";
                 }
                 
                 string orgName = m_dicHrRegulars.Values.FirstOrDefault(x => x.ORG_CD == hrRegularMember.ORG_CD)?.team_name;
                 if (string.IsNullOrEmpty(orgName))
                 {
                     continue;
                 }
                 
                 Regular regular = regularList.FirstOrDefault(x => x.team_name == orgName);
                 if (regular == null)
                 {
                     continue;
                 }
 
                 int rglSn = regular.rgl_sn;
                 
                 int jobLevel = 0;
                 int jobPosition = 0;
                     
                 try
                 {
                     string strJobLevelOption = string.IsNullOrEmpty(hrRegularMember.JIKWEE_NM)
                         ? "알 수 없음"
                         : hrRegularMember.JIKWEE_NM;
                         
                     string strJobPositionOption = string.IsNullOrEmpty(hrRegularMember.JIKCHAK_NM)
                         ? "알 수 없음"
                         : hrRegularMember.JIKCHAK_NM;
                         
                     if (!m_dicJobLevelOptions.ContainsKey(strJobLevelOption))
                         strJobLevelOption = "알 수 없음";
                             
                     if (!m_dicJobPositionOptions.ContainsKey(strJobPositionOption))
                         strJobPositionOption = "알 수 없음";

                     jobLevel = m_dicJobLevelOptions[strJobLevelOption].team_optn_no;
                     jobPosition = m_dicJobPositionOptions[strJobPositionOption].team_optn_no;
                 }
                 catch (Exception e)
                 {
                     strErrorMessage = e.Message;
                     continue;
                 }
                 
                 string strUpdateQuery = $@"UPDATE {RegularMember.TableName} Set 
                                                     {RegularMember.Fields.rgl_sn} = {rglSn},
                                                     {RegularMember.Fields.memb_name} = '{escapedMemberName}',
                                                     {RegularMember.Fields.email} = '{escapedEmail}',
                                                     {RegularMember.Fields.offm_telno} = '{escapedOffmTelno}',
                                                     {RegularMember.Fields.telno} = '{escapedTelno}',
                                                     {RegularMember.Fields.clsf_no} = {jobLevel},
                                                     {RegularMember.Fields.ofcps_no} = {jobPosition}
                                                 Where {RegularMember.Fields.rgl_memb_sn} = {hrRegularMember.rgl_memb_sn};";
                 
                 sbUpdateAllQuery.AppendLine(strUpdateQuery);
             }
             
             foreach (RegularMember regularMember in deleteRegularMembers)
             {
                 List<UNEData.ForeignKeyInfo> fkInfos = m_hrDataProcessingManager.GetForeignKeyInfo(dbManager, RegularMember.TableName, nameof(RegularMember.Fields.rgl_memb_sn), out strErrorMessage);
                 
                 // FK 정보를 불러오지 못하거나 FK로 설정되어있는 자식 테이블의 데이터를 처리하지 못할시에 쿼리를 추가하지 않는다.
                 if (fkInfos == null || string.IsNullOrEmpty(strErrorMessage) == false)
                 {
                     strErrorMessage = $"GetForeignKeyInfo() Error : {strErrorMessage}";
                     continue;
                 }
                 
                 if (m_hrDataProcessingManager.AddForeignKeyQuery(dbManager, regularMember.rgl_memb_sn, fkInfos, ref sbDeleteAllQuery, out strErrorMessage) == false)
                 {
                     strErrorMessage = $"ProcessingForeignKey() Error : {strErrorMessage}";
                     continue;
                 }
                 
                 string strDeleteQuery = $@"Delete From {RegularMember.TableName} Where {RegularMember.Fields.rgl_memb_sn} = {regularMember.rgl_memb_sn}";
                 
                 sbDeleteAllQuery.AppendLine(strDeleteQuery);
             }
 
             foreach (RegularMember regularMember in m_listCurrentDuplicatedRegularMember)
             {
                 List<UNEData.ForeignKeyInfo> fkInfos = m_hrDataProcessingManager.GetForeignKeyInfo(dbManager, RegularMember.TableName, nameof(RegularMember.Fields.rgl_memb_sn), out strErrorMessage);
                 
                 if (fkInfos == null || string.IsNullOrEmpty(strErrorMessage) == false)
                 {
                     strErrorMessage = $"GetForeignKeyInfo() Error : {strErrorMessage}";
                     continue;
                 }
                 
                 if (m_hrDataProcessingManager.AddForeignKeyQuery(dbManager, regularMember.rgl_memb_sn, fkInfos, ref sbDeleteAllQuery, out strErrorMessage) == false)
                 {
                     strErrorMessage = $"ProcessingForeignKey() Error : {strErrorMessage}";
                     continue;
                 }
                 
                 string strDeleteQuery = $@"Delete From {RegularMember.TableName} Where {RegularMember.Fields.rgl_memb_sn} = {regularMember.rgl_memb_sn}";
                 
                 sbDeleteAllQuery.AppendLine(strDeleteQuery);
             }
             
             string addQuery = sbAddAllQuery.ToString();
             string updateQuery = sbUpdateAllQuery.ToString();
             
             if (addRegularMembers.Any() && addQuery.Length > 0 && dbManager.GetDBManager().Excute(addQuery, out strErrorMessage) == false)
                 return false;
             
             if (updateRegularMembers.Any() && updateQuery.Length > 0 && dbManager.GetDBManager().Excute(updateQuery, out strErrorMessage) == false)
                 return false;
             
             if ((deleteRegularMembers.Any() || m_listCurrentDuplicatedRegularMember.Any()) && dbManager.GetDBManager().Excute(sbDeleteAllQuery.ToString(), out strErrorMessage) == false)
                 return false;
             
             // 자동 증가 ID로 인해 rgl_sn을 할당한 뒤에 prnts_sn을 업데이트 한다.
             if (UpdateRegularParent(dbManager, out strErrorMessage) == false)
                 return false;
             
             return true;
         }
 
         private bool UpdateRegularParent(DataManager dbManager, out string strErrorMessage)
         {
             strErrorMessage = String.Empty;
 
             try
             {
                    string query = $"SELECT {Regular.Fields.rgl_sn}, {Regular.Fields.parnts_sn}, {Regular.Fields.team_name} FROM {Regular.TableName}";
                    IEnumerable<dynamic> dbRegulars = dbManager.GetSelect().Select(query, out strErrorMessage);
                    
                    if (dbRegulars == null) return false;

                    var listDbRegulars = dbRegulars.ToList();

                    Dictionary<string, int> orgCdToRglSnMap = new Dictionary<string, int>();

                    foreach (var hrRegular in m_dicHrRegulars.Values)
                    {
                        int? parentRglSn = null;
                        if (!string.IsNullOrEmpty(hrRegular.PRIOR_ORG_CD) && orgCdToRglSnMap.ContainsKey(hrRegular.PRIOR_ORG_CD))
                        {
                            parentRglSn = orgCdToRglSnMap[hrRegular.PRIOR_ORG_CD];
                        }

                        Regular matchedRegular = null;
                        
                        var candidates = listDbRegulars.Where(x => x.team_name == hrRegular.team_name).ToList();
                        
                        if (candidates.Count == 1)
                        {
                            matchedRegular = new Regular { rgl_sn = (int)candidates[0].rgl_sn, parnts_sn = (int?)candidates[0].parnts_sn };
                        }
                        else if (candidates.Count > 1)
                        {
                            if (parentRglSn.HasValue)
                            {
                                var perfectMatch = candidates.FirstOrDefault(x => (int?)x.parnts_sn == parentRglSn.Value);
                                if (perfectMatch != null)
                                {
                                    matchedRegular = new Regular { rgl_sn = (int)perfectMatch.rgl_sn };
                                }
                                else
                                {
                                    var newCandidate = candidates.FirstOrDefault(x => x.parnts_sn == null);
                                    if (newCandidate != null)
                                        matchedRegular = new Regular { rgl_sn = (int)newCandidate.rgl_sn };
                                }
                            }
                        }

                        if (matchedRegular != null)
                        {
                            orgCdToRglSnMap[hrRegular.ORG_CD] = matchedRegular.rgl_sn;
                        }
                    }

                    StringBuilder sbUpdateQuery = new StringBuilder();
                    
                    foreach (var hrRegular in m_dicHrRegulars.Values)
                    {
                        if (!orgCdToRglSnMap.ContainsKey(hrRegular.ORG_CD)) continue;

                        int myRglSn = orgCdToRglSnMap[hrRegular.ORG_CD];
                        string parentSnValue = "NULL";

                        if (!string.IsNullOrEmpty(hrRegular.PRIOR_ORG_CD) && orgCdToRglSnMap.ContainsKey(hrRegular.PRIOR_ORG_CD))
                        {
                            int parentRglSn = orgCdToRglSnMap[hrRegular.PRIOR_ORG_CD];
                            if (myRglSn != parentRglSn)
                            {
                                parentSnValue = parentRglSn.ToString();
                            }
                        }

                        // parnts_sn 업데이트 쿼리
                        sbUpdateQuery.AppendLine($@"UPDATE {Regular.TableName} 
                                                    SET {Regular.Fields.parnts_sn} = {parentSnValue} 
                                                    WHERE {Regular.Fields.rgl_sn} = {myRglSn};");
                    }

                    if (sbUpdateQuery.Length > 0)
                    {
                        if (!dbManager.GetDBManager().Excute(sbUpdateQuery.ToString(), out strErrorMessage))
                        {
                            return false;
                        }
                    }

             }
             catch (Exception e)
             {
                 strErrorMessage = e.Message;
                 return false;
             }
             
             return true;
         }
        
        private void RemoveFromCurrentList(string teamName, int rglSn)
        {
            if (m_dicCurrentRegular.ContainsKey(teamName))
            {
                var list = m_dicCurrentRegular[teamName];
                var target = list.FirstOrDefault(x => x.rgl_sn == rglSn);
                if (target != null)
                {
                    list.Remove(target);
                }
                if (list.Count == 0)
                {
                    m_dicCurrentRegular.Remove(teamName);
                }
            }
        }

        private Dictionary<string, int> MapSourceToTarget(out string strErrorMessage)
        {
            strErrorMessage = string.Empty;
            Dictionary<string, int> map = new Dictionary<string, int>();

            foreach (var hrRegular in m_dicHrRegulars.Values)
            {
                string teamName = hrRegular.team_name;

                if (!m_dicCurrentRegular.ContainsKey(teamName)) continue;

                List<Regular> candidates = m_dicCurrentRegular[teamName];
                Regular matched = null;

                if (candidates.Count == 1)
                {
                    matched = candidates[0];
                }
                else
                {
                    int? parentRglSn = null;
                    if (!string.IsNullOrEmpty(hrRegular.PRIOR_ORG_CD) && map.ContainsKey(hrRegular.PRIOR_ORG_CD))
                    {
                        parentRglSn = map[hrRegular.PRIOR_ORG_CD];
                    }

                    if (parentRglSn.HasValue)
                    {
                        matched = candidates.FirstOrDefault(x => x.parnts_sn == parentRglSn.Value);
                    }
                    
                    if (matched == null)
                    {
                        var usedSns = new HashSet<int>(map.Values);
                        matched = candidates.FirstOrDefault(x => !usedSns.Contains(x.rgl_sn));
                    }
                }

                if (matched != null)
                {
                    map[hrRegular.ORG_CD] = matched.rgl_sn;
                }
            }

            return map;
        }
    }
}