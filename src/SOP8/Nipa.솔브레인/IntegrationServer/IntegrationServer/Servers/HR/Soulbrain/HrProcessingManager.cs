using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using Base.Model.Common.Team;
using dnsDapperDBUtil;
using dnsDapperDBUtil.DataAccessLayer.DAL;
using dnsDapperDBUtil.Manager;
using dnsData.CommonCode;
using IntegrationServer.Datas;
using IntegrationServer.Servers.HR.Soulbrain.Data;

namespace IntegrationServer.Servers.HR.Soulbrain
{
    
    public class HrProcessingManager
    {

        private int m_nSiteID = -1;
        
        private DataManager m_dataManager = null;
        private DataManager m_hrDataManager = null;
        
        private Dictionary<string, Regular> m_dicCurrentRegular = null;
        private Dictionary<string, RegularMember> m_dicCurrentRegularMember = null;
        private List<RegularMember> m_listCurrentDuplicatedRegularMember = null;
        
        private Dictionary<string, HRData.HrRegular> m_dicHrRegulars = null;
        private Dictionary<string, HRData.HrRegularMember> m_dicHrRegularMembers = null;
        
        private HrEntityManager m_hrEntityManager = null;
        private HrDataProcessingManager m_hrDataProcessingManager = null;
        
        private Dictionary<string, Option> m_dicJobPositionOptions = null;
        private Dictionary<string, Option> m_dicJobLevelOptions = null;
        private Dictionary<string, Option> m_dicJobStatusOptions = null;
        
        private Logger m_logger = null;
        
        private int m_nServerSeqNo = -1;

        private const int MEMBER_STATUS_CD = 500104; // 재직
        
        public HrProcessingManager(DataManager dataManager, DataManager hrDataManager, int nSiteID, int nServerSeqNo)
        {
            m_dataManager = dataManager;
            m_hrDataManager = hrDataManager;
            m_nSiteID = nSiteID;
            m_logger = Logger.Instance;
            m_nServerSeqNo = nServerSeqNo;
            m_hrEntityManager = new HrEntityManager(m_hrDataManager);
            m_hrDataProcessingManager = new HrDataProcessingManager(dataManager, nServerSeqNo);;
        }

        public bool ProcessingSynchronous(out string strErrorMessage)
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
                    throw new ApplicationException(strErrorMessage);
                
                // 직위 직책값 업데이트
                if (UpdateOptions(clone, out strErrorMessage) == false)
                    throw new ApplicationException(strErrorMessage);

                // Soulbrain_HR. Member, Team 조회
                if (LoadHrData(out strErrorMessage) == false)
                    throw new ApplicationException(strErrorMessage);

                // co_team_rgl 조회
                if (LoadCurrentTeam(clone, out strErrorMessage) == false)
                    throw new ApplicationException(strErrorMessage);

                // co_team_rgl_member 조회
                if (LoadCurrentMember(clone, out strErrorMessage) == false)
                    throw new ApplicationException(strErrorMessage);

                // 동기화
                if (SetHrData(clone, out strErrorMessage) == false)
                    throw new ApplicationException(strErrorMessage);
                
                if (clone.BatchCommit(out strErrorMessage) == false)
                    throw new ApplicationException(strErrorMessage);

                return true;
            }
            catch (Exception e)
            {
                m_logger.Write(LogTypes.Error, SdmsSensor.ServerType.Soulbrain_HR, m_nServerSeqNo, $@"ProcessingSynchronous() Error : {e.Message}");
                clone.BatchRollback(out strErrorMessage);
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
                     
                     IEnumerable<dynamic> jobPostions = m_hrDataManager.GetSelect().Select(strJobPostionQuery, out strErrorMessage);
                     
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
                 private int FindAvailableOptionNumber(Dictionary<string, Option> optionDict, CodeType codeType, int boundary, out string strErrorMessage)
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
                 public bool LoadCurrentTeam(DataManager dbManager, out string strErrorMessage)
                 {
                     strErrorMessage = String.Empty;
                     
                     m_dicCurrentRegular = new Dictionary<string, Regular>();
                     
                     IEnumerable<Regular> curretRegulars = dbManager.GetSelect().Select<Regular>(null, out strErrorMessage);
         
                     if (curretRegulars == null)
                     {
                         m_logger.Write(LogTypes.Error, SdmsSensor.ServerType.Soulbrain_HR, m_nServerSeqNo, $@"Regular Table 조회 실패 : {strErrorMessage}");
                         return false;
                     }
         
                     foreach (Regular regular in curretRegulars)
                     {
                         if (string.IsNullOrEmpty(regular.team_name))
                         {
                             m_logger.Write(LogTypes.Error, SdmsSensor.ServerType.Soulbrain_HR, m_nServerSeqNo, $@"LoadCurrentTeam() : Regular.team_name is null. : {regular.rgl_sn}");
                             continue;
                         }
                         
                         m_dicCurrentRegular[regular.team_name] = regular;
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
                             m_logger.Write(LogTypes.Error, SdmsSensor.ServerType.Soulbrain_HR, m_nServerSeqNo,
                                 $@"RegularMember Table 조회 실패 : {strErrorMessage}");
                             return false;
                         }
         
                         foreach (RegularMember regularMember in currentRegularMembers)
                         {
                             if (string.IsNullOrEmpty(regularMember.unq_key))
                             {
                                 m_logger.Write(LogTypes.Error, SdmsSensor.ServerType.Soulbrain_HR, m_nServerSeqNo,
                                     $@"LoadCurrentTeam() : RegularMember.unq_key is null. : {regularMember.rgl_memb_sn}");
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
         
                             m_dicHrRegulars.Add(hrTeam.ORG_NM, hrRegular);
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
                             hrRegularMember.clsf_no = string.IsNullOrEmpty(hrMember.JIKWEE_CD) ? 500200 : Convert.ToInt32(hrMember.JIKWEE_CD);
                             hrRegularMember.ofcps_optn_no = (int)CodeType.JobPosition;
                             hrRegularMember.ofcps_no = string.IsNullOrEmpty(hrMember.JIKCHAK_CD) ? 500300 : Convert.ToInt32(hrMember.JIKCHAK_CD);
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
         
                 public bool SetHrData(DataManager dbManager, out string strErrorMessage)
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
                         
                         foreach (KeyValuePair<string, HRData.HrRegular> hrRegular in m_dicHrRegulars)
                         {
                             hrRegular.Value.parnts_sn = GetParentRegularSn(hrRegular.Value.team_name, out strErrorMessage);
         
                             if (m_dicCurrentRegular.ContainsKey(hrRegular.Value.team_name) == false)
                             {
                                 // 기존에 없던 Regular
                                 addRegulars.Add(hrRegular.Value);
                                 m_dicCurrentRegular.Remove(hrRegular.Value.team_name);
                             }
                             else
                             {
                                 // 기존에 있는 팀은 유지하며 상위 팀이 바뀌었는지 확인한다.
                                 if (CompareRegular(hrRegular.Value, m_dicCurrentRegular[hrRegular.Value.team_name], out strErrorMessage) == false)
                                 {
                                     hrRegular.Value.rgl_sn = m_dicCurrentRegular[hrRegular.Value.team_name].rgl_sn;
                                     
                                     updateRegulars.Add(hrRegular.Value);
                                     m_dicCurrentRegular.Remove(hrRegular.Value.team_name);
                                 }
                                 else
                                 {
                                     // 유지될 팀들은 Delete 대상에서 제거한다.
                                     m_dicCurrentRegular.Remove(hrRegular.Value.team_name);
                                 }
                             }
                         }
                         
                         // 잔여 CurrentDictionary는 삭제 대상 팀이다.
                         deleteRegulars = m_dicCurrentRegular.Values.ToList();
         
                         if (SetFilteredMember(deleteRegulars, out strErrorMessage) == false)
                         {
                             strErrorMessage = "SetFilteredMember() Error";
                             return false;
                         }
         
                         foreach (KeyValuePair<string, HRData.HrRegularMember> hrRegularMember in m_dicHrRegularMembers)
                         {
                             if (m_dicCurrentRegularMember.ContainsKey(hrRegularMember.Value.unq_key) == false)
                             {
                                 // 신규 멤버 추가
                                 addRegularMembers.Add(hrRegularMember.Value);
                                 m_dicCurrentRegularMember.Remove(hrRegularMember.Value.unq_key);
                             }
                             else
                             {
                                 // 기존 인원은 유지하며 인원에 대한 정보가 바뀌었는지 확인한다.
                                 if (CompareRegularMember(hrRegularMember.Value, m_dicCurrentRegularMember[hrRegularMember.Value.unq_key], out strErrorMessage) == false)
                                 {
                                     hrRegularMember.Value.rgl_memb_sn = m_dicCurrentRegularMember[hrRegularMember.Value.unq_key].rgl_memb_sn;
         
                                     updateRegularMembers.Add(hrRegularMember.Value);
                                     
                                     m_dicCurrentRegularMember.Remove(hrRegularMember.Value.unq_key);
                                 }
                                 else
                                 {
                                     // 유지할 멤버는 삭제 목록에서 제거한다.
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
                         Logger.Instance.Write(LogTypes.Error, SdmsSensor.ServerType.Soulbrain_HR, m_nServerSeqNo, $@"[ERROR] SaveHrData() : {e.Message}");
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
         
                 private int? GetParentRegularSn(string strTeamName, out string strErrorMessage)
                 {
                     strErrorMessage = String.Empty;
                     
                     if (string.IsNullOrEmpty(strTeamName))
                     {
                         strErrorMessage = "strTeamName is null";
                         return null;
                     }
         
                     // 루트레벨 팀
                     if (m_dicCurrentRegular.ContainsKey(strTeamName) == false)
                     {
                         return null;
                     }
                     
                     Regular regular = m_dicCurrentRegular[strTeamName];
                     return regular.parnts_sn;
                 }
         
                 private bool CompareRegular(HRData.HrRegular hrRegular, Regular regular, out string strErrorMessage)
                 {
                     strErrorMessage = String.Empty;
                     
                     if (hrRegular.parnts_sn != regular.parnts_sn)
                     {
                         return false;
                     }
         
                     return true;
                 }
         
                 private bool CompareRegularMember(HRData.HrRegularMember hrRegularMember, RegularMember regularMember, out string strErrorMessage)
                 {
                     strErrorMessage = String.Empty;
                     
                     if (hrRegularMember.rgl_sn != regularMember.rgl_sn ||
                         hrRegularMember.email != regularMember.email ||
                         hrRegularMember.offm_telno != regularMember.offm_telno ||
                         hrRegularMember.memb_name != regularMember.memb_name)
                     {
                         return false;
                     }
         
                     string targetTelNo = hrRegularMember.telno.Trim();
                     string decryptedTelNo = AES256Cipher.AES_decrypt(regularMember.telno.Trim());
                     
                     if (targetTelNo != decryptedTelNo)
                         return false;
                     
                     List<Option> regularMemberOptions = GetRegularMemberOptions(regularMember, out strErrorMessage);
                     
                     Option jobLevelOption = regularMemberOptions.Find(x => x.team_optn_ty_no == (int)CodeType.JobLevel);
                     Option jobPositionOption = regularMemberOptions.Find(x => x.team_optn_ty_no == (int)CodeType.JobPosition);
         
                     if (jobLevelOption.team_optn_name != hrRegularMember.JIKWEE_NM)
                         return false;
                     
                     if (jobPositionOption.team_optn_name != hrRegularMember.JIKCHAK_NM)
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
         
                     string strGetMaxSnQuery = $@"Select Max({Regular.Fields.rgl_sn}) as MaxSn From {Regular.TableName};";
                     
                     dynamic maxSnResult = m_dataManager.GetSelect().SelectFirst(strGetMaxSnQuery, out strErrorMessage);
         
                     int nLastUpdateSn = (maxSnResult?.MaxSn ?? 0);
                     if (maxSnResult == null)
                         return false;
                     
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
                                                     {Regular.Fields.site_sn})
                                                 Values 
                                                 (
                                                     '{escapedTeamName}',
                                                     {(hrRegular.parnts_sn.HasValue ? hrRegular.parnts_sn.Value : "NULL")}, 
                                                     {m_nSiteID}
                                                 );";
                         
                         sbAddAllQuery.AppendLine(strAddQuery);
                         nLastUpdateSn++;
                     }
         
                     foreach (HRData.HrRegular hrRegular in updateRegulars)
                     {
                         string strUpdateQuery = $@"Update {Regular.TableName} Set 
                                                             {Regular.Fields.rgl_sn} = {hrRegular.rgl_sn},
                                                             {Regular.Fields.team_name} = '{hrRegular.team_name}',
                                                             {Regular.Fields.parnts_sn} = {hrRegular.parnts_sn},
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
                         string escapedOffmTelno = hrRegularMember.offm_telno?.Replace("'", "''") ?? "";
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
                             strErrorMessage = $@"ORG_NM is null , ORG_CD : {hrRegularMember.ORG_CD}";
                             continue;
                         }
                         
                         Regular regular = regularList.FirstOrDefault(x => x.team_name == orgName);
                         if (regular == null)
                         {
                             strErrorMessage = $@"ORG_NM is not found , ORG_CD : {hrRegularMember.ORG_CD}";
                             continue;
                         }
         
                         int rglSn = regular.rgl_sn;
                         
                         int jobLevel = m_dicJobLevelOptions[hrRegularMember.JIKWEE_NM].team_optn_no;
                         int jobPosition = m_dicJobPositionOptions[hrRegularMember.JIKWEE_NM].team_optn_no;
         
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
                         string escapedOffmTelno = hrRegularMember.offm_telno?.Replace("'", "''") ?? "";
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
                             strErrorMessage = $@"ORG_NM is null , ORG_CD : {hrRegularMember.ORG_CD}";
                             continue;
                         }
                         
                         Regular regular = regularList.FirstOrDefault(x => x.team_name == orgName);
                         if (regular == null)
                         {
                             strErrorMessage = $@"ORG_NM is not found , ORG_CD : {hrRegularMember.ORG_CD}";
                             continue;
                         }
         
                         int rglSn = regular.rgl_sn;
                         int jobLevel = m_dicJobLevelOptions[hrRegularMember.JIKWEE_NM].team_optn_no;
                         int jobPosition = m_dicJobPositionOptions[hrRegularMember.JIKWEE_NM].team_optn_no;
                         
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
                     
                     if (addRegularMembers.Any() && dbManager.GetDBManager().Excute(sbAddAllQuery.ToString(), out strErrorMessage) == false)
                         return false;
                     
                     if (updateRegularMembers.Any() && dbManager.GetDBManager().Excute(sbUpdateAllQuery.ToString(), out strErrorMessage) == false)
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
                         // Regular 데이터 조회
                         var regulars = dbManager.GetSelect().Select<Regular>(null, out strErrorMessage);
                         if (regulars == null)
                             return false;
         
                         // Dictionary 생성 (중복 키 처리 포함)
                         var dicRegularSn = regulars
                             .GroupBy(x => x.team_name)
                             .ToDictionary(g => g.Key, g => g.First().rgl_sn);
         
                         // HR Regular에서 조직코드-팀명 매핑 생성 (LINQ 사용)
                         var dicOrgCodeToTeamName = m_dicHrRegulars.Values
                             .ToDictionary(hr => hr.ORG_CD, hr => hr.team_name);
         
                         // 업데이트 쿼리 생성 (안전성 체크 포함)
                         var updateQueries = m_dicHrRegulars.Values
                             .Where(hr => int.TryParse(hr.ORG_LEVEL, out int level) && level > 1)
                             .Where(hr => !string.IsNullOrEmpty(hr.PRIOR_ORG_CD))
                             .Where(hr => dicRegularSn.ContainsKey(hr.team_name))
                             .Where(hr => dicOrgCodeToTeamName.TryGetValue(hr.PRIOR_ORG_CD, out string parentTeamName) && 
                                          dicRegularSn.ContainsKey(parentTeamName))
                             .Select(hr => new
                             {
                                 RglSn = dicRegularSn[hr.team_name],
                                 ParentSn = dicRegularSn[dicOrgCodeToTeamName[hr.PRIOR_ORG_CD]]
                             })
                             .Select(item => $@"UPDATE {Regular.TableName} 
                               SET {Regular.Fields.parnts_sn} = {item.ParentSn} 
                               WHERE {Regular.Fields.rgl_sn} = {item.RglSn};")
                             .ToList(); // 다중 열거 방지를 위해 물질화
         
                         if (updateQueries.Any())
                         {
                             var allQueries = string.Join(Environment.NewLine, updateQueries);
                             if (!dbManager.GetDBManager().Excute(allQueries, out strErrorMessage))
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
        
    }
}

