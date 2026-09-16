using dnsDapperDBUtil.DataAccessLayer.DAL;
using SoulbrainWebAPIServer.Model;
using System;
using System.Collections.Generic;

namespace SoulbrainWebAPIServer.Managers
{
    public class WorkListManager
    {
        private DataManager m_wishDataManager = null;
        
        private ExcelReaderManager m_excelReaderManager;
        
        Dictionary<string, string> m_dicTeamData = new Dictionary<string, string>();
        Dictionary<string, BuildingData> m_dicPlaceID = new Dictionary<string, BuildingData>();
        Dictionary<string, BuildingData> m_dicPlaceID2 = new Dictionary<string, BuildingData>();
        Dictionary<string, BuildingData> m_dicPlaceID3 = new Dictionary<string, BuildingData>();
        private readonly Dictionary<string, string> m_dicWorkData = new Dictionary<string, string>()
        {
            { "S_WO_WORK_TYPE_1", "신설" },
            { "S_WO_WORK_TYPE_2", "증설" },
            { "S_WO_WORK_TYPE_3", "정비" },
            { "S_WO_WORK_TYPE_4", "기타" }
        };
        
        public WorkListManager(DataManager dataManager, string strExcelPath)
        {
            m_wishDataManager = dataManager;
            m_excelReaderManager = new ExcelReaderManager(strExcelPath);
            
            SetWorkPlaceData();
        }

        public void SetWorkPlaceData()
        {
            m_excelReaderManager.SetExcelData(ref m_dicTeamData, ref m_dicPlaceID, ref m_dicPlaceID2, ref m_dicPlaceID3);
        }

        public ResponseTodayWorkList GetTodayWorkList()
        {
            ResponseTodayWorkList response = new ResponseTodayWorkList();

            if (m_dicPlaceID.Count == 0 || m_dicPlaceID2.Count == 0 || m_dicPlaceID3.Count == 0 || m_dicTeamData.Count == 0)
            {
                response.Message = $@"Building Data Load Error";
                response.Success = false;
                return response;
            }
                
            DateTime dtToday = DateTime.Today;
            DateTime dtTomorrow = dtToday.AddDays(1);

            string strSQL =
                $@"Select SAFE_WKOD_ID,
                          PLACE_ID3,
                          PLAN_NAME, WORK_GBN,
                          WORK_ENTRANT_NAME,
                          COMPANY_GBN, SDATE,
                          EDATE,
                          SUBCONTRACTOR_NAME,
                          FIELD_MANAGER_NAME,
                          FIELD_PEOPLE_NUM,
                          APPR_DEPT1,
                          APPR_DEPT2,
                          STIME,
                          ETIME,
                          PLACE_ID,
                          PLACE_ID2,
                          CONST_NAME
                    From SWOT_DSAFE_WKOD_NEW
                    WHERE 
                        SDATE >='{dtToday.ToString("yyyy-MM-dd 00:00:00")}' 
                    And SDATE < '{dtTomorrow.ToString("yyyy-MM-dd 00:00:00")}' 
                    And [STATUS] = 'S_WO_DSAFE_STATUS_APPROVE'
                ";
            
            IEnumerable<dynamic> results = m_wishDataManager.GetSelect().Select(strSQL, out string strErrorMessage);

            if (results == null)
            {
                response.Message = $@"WorkList Load Error Results are null : {strErrorMessage}";
                response.Success = false;
            }
            
            foreach (var item in results)
            {
                TodayWork todayWork = new TodayWork();
                todayWork.ID = (int)item.SAFE_WKOD_ID;
                todayWork.PLAN_NAME = item.CONST_NAME;
                todayWork.WORK_ENTRANT_NAME = item.WORK_ENTRANT_NAME;
                todayWork.COMPANY_GBN = item.COMPANY_GBN;
                todayWork.SDATE = item.SDATE.ToString("yyyy-MM-dd ") + item.STIME + ":00";
                //todayWork.EDATE = item.EDATE == null ? "" : item.EDATE.ToString("yyyy-MM-dd ") + item.ETIME + ":00";
                todayWork.EDATE = item.ETIME == null ? "" : item.ETIME + ":00";
                todayWork.SUBCONTRACTOR_NAME = item.SUBCONTRACTOR_NAME;
                todayWork.FIELD_MANAGER_NAME = item.FIELD_MANAGER_NAME;
                
                string fieldPeopleNumStr = item.FIELD_PEOPLE_NUM?.ToString() ?? "";
                int? nFieldPeopleNum = int.TryParse(fieldPeopleNumStr, out int result) ? result : null;
                todayWork.FIELD_PEOPLE_NUM = nFieldPeopleNum;

                string strPLACE_ID = item.PLACE_ID;
                string strPLACE_ID2 = item.PLACE_ID2;
                string strPLACE_ID3 = item.PLACE_ID3;

                string? strPLACE_NAME = "";
                if (strPLACE_ID != null && strPLACE_ID.Length > 0 && m_dicPlaceID.ContainsKey(strPLACE_ID))
                {
                    BuildingData buildingData = m_dicPlaceID[strPLACE_ID];
                    strPLACE_NAME = buildingData.DisplayName;
                    todayWork.BuildingGroupID = buildingData.ID;
                    todayWork.BuildingGroupName = buildingData.Name;
                }

                if (strPLACE_ID2 != null && strPLACE_ID2.Length > 0 && m_dicPlaceID2.ContainsKey(strPLACE_ID2))
                {
                    BuildingData buildingData = m_dicPlaceID2[strPLACE_ID2];
                    if (strPLACE_NAME?.Length == 0)
                        strPLACE_NAME = buildingData.DisplayName;
                    else
                        strPLACE_NAME += " " + buildingData.DisplayName;
                    todayWork.BuildingID = buildingData.ID;
                }

                if (strPLACE_ID3 != null && strPLACE_ID3.Length > 0 && m_dicPlaceID3.ContainsKey(strPLACE_ID3))
                {
                    BuildingData buildingData = m_dicPlaceID3[strPLACE_ID3];
                    if (strPLACE_NAME?.Length == 0)
                        strPLACE_NAME = buildingData.DisplayName;
                    else
                        strPLACE_NAME += " " + buildingData.DisplayName;
                    todayWork.ZoneID = buildingData.ID;
                    todayWork.FloorIndex = buildingData.FloorIndex;
                }
                
                todayWork.PLACE_NAME = strPLACE_NAME;
                
                if (m_dicTeamData.ContainsKey(item.APPR_DEPT1))
                    todayWork.APPR_DEPT1 = m_dicTeamData[item.APPR_DEPT1];
                if (m_dicTeamData.ContainsKey(item.APPR_DEPT2))
                    todayWork.APPR_DEPT2 = m_dicTeamData[item.APPR_DEPT2];
                
                if (m_dicWorkData.ContainsKey(item.WORK_GBN))
                    todayWork.WORK_GBN = m_dicWorkData[item.WORK_GBN];
                
                response.TodayWorkList.Add(todayWork);
            }
            response.Success = true;
            response.Message = "Success";
            return response;
        }
    }
}