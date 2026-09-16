using Base.DAL;
using Base.Model.Sensor;
using Base.Model.Spatial;
using dnsDapperDBUtil.DataAccessLayer.IDAL;
using dnsExcelReport.Models;
using Kftc.BLL.Request;
using Kftc.BLL.Response;
using Kftc.Model.History;
using NPOI.HPSF;
using NPOI.HSSF.UserModel;
using NPOI.SS.UserModel;
using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Text;

namespace Kftc.BLL.Process
{
    public class ComingPersonManager
    {
        private IDataManager m_dataManager = null;

        private const int TYPE_SPEED = 1;
        private const int TYPE_AREA = 2;

        private const string EXCEL_TITLE = "출입자 리스트";

        public const int TitleFontSize = 20;
        public const int NormalFontSize = 11;
        public const int RowHeight = 22;

        private Dictionary<int, int> m_dicColumnWidths = new Dictionary<int, int>();
        private int m_nColumnCount = 8;        

        private const string Column_No = "No";
        private const string Column_PersonName = "출입자";
        private const string Column_Visitor = "구분";
        private const string Column_TeamName = "부서";
        private const string Column_Position = "직급";
        private const string Column_Door = "출입문";
        private const string Column_Enterance = "출입 상태";
        private const string Column_Time = "출입 상태";

        

        public ComingPersonManager(IDataManager dataManager)
        {
            m_dataManager = dataManager;
        }

        // 건물 내부 정보 가져오기 (입장 수, 잔류 수, 출입자 리스트[입장/퇴장])
        public ResponseComingHistory GetComingHistory()
        {
            ResponseComingHistory response = new ResponseComingHistory();

            try
            {
                DateTime dtToday = DateTime.Today;

                // 오늘 날짜 his_cmg_nmpr / fa_sensor / fa_sensor_zone 조회
                // .TODO: 테스트를 위한 조건 주석처리
                // WHERE {ComingPerson.Fields.cmg_tm} >= '{dtToday.ToString("yyyy-MM-dd 00:00:00")}' and {ComingPerson.Fields.cmg_tm} <= '{dtToday.ToString("yyyy-MM-dd 23:59:59")}'
                string strSQL = string.Format(@$"SELECT {ComingPerson.Fields.cmg_nmpr_hist_sn},{ComingPerson.Fields.cmg_nmpr_name},{ComingPerson.Fields.visitr_yn},{ComingPerson.Fields.team_name},{ComingPerson.Fields.clsf_name},
                                                {ComingPerson.Fields.cmg_tm},{ComingPerson.TableName}.{ComingPerson.Fields.sensor_sn},{ComingPerson.Fields.entnc_yn},{ComingPerson.Fields.event_name},{ComingPerson.Fields.event_code},
                                                {ComingPerson.Fields.empno}, {ComingPerson.Fields.card_no}, {Sensor.TableName}.{Sensor.Fields.sensor_name},{SensorZone.Fields.sensor_sub_ty_no} 
                                                FROM {ComingPerson.TableName} 
                                                INNER JOIN {Sensor.TableName} ON {ComingPerson.TableName}.{ComingPerson.Fields.sensor_sn} = {Sensor.TableName}.{Sensor.Fields.sensor_sn} 
                                                INNER JOIN {SensorZone.TableName} ON {ComingPerson.TableName}.{ComingPerson.Fields.sensor_sn} = {SensorZone.TableName}.{SensorZone.Fields.sensor_zone_sn} 
                                                ORDER BY {ComingPerson.Fields.cmg_tm}");

                IEnumerable<dynamic> results = m_dataManager.GetSelect().Select(strSQL, out string strErrMsg);
                if (results == null)
                {
                    throw new ApplicationException(strErrMsg);
                }

                Dictionary<string, ComingPersonDateInfo> dicPersonInfo = new Dictionary<string, ComingPersonDateInfo>();

                // 카드번호별(card_no) 입장/퇴장 처리 >> 스피드 게이트 퇴실 경우 퇴장 처리
                foreach (var result in results)
                {
                    string cmg_nmpr_name = result.cmg_nmpr_name;
                    bool visitr_yn = result.visitr_yn;
                    //string team_name = result.team_name;
                    //string clsf_name = result.clsf_name;
                    DateTime cmg_tm = result.cmg_tm;
                    //int sensor_sn = result.sensor_sn;
                    bool entnc_yn = result.entnc_yn;
                    //string event_name = result.event_name;
                    //string event_code = result.event_code;
                    //string empno = result.empno;
                    string card_no = result.card_no;
                    string sensor_name = result.sensor_name;
                    int? sensor_sub_ty_no = result.sensor_sub_ty_no;

                    ComingPersonDateInfo personInfo = null;

                    if (dicPersonInfo.ContainsKey(card_no) == false)
                    {
                        personInfo = new ComingPersonDateInfo();
                        personInfo.PersonName = cmg_nmpr_name;
                        personInfo.DoorName = sensor_name;
                        personInfo.IsVisitor = visitr_yn;
                        personInfo.IsEnterance = entnc_yn;
                        personInfo.CardNo = card_no;

                        dicPersonInfo[card_no] = personInfo;
                    }
                    else
                    {
                        personInfo = dicPersonInfo[card_no];
                    }

                    // 스피드 게이트 퇴실 경우 퇴실 처리
                    if (sensor_sub_ty_no == TYPE_SPEED && entnc_yn == false)
                        personInfo.BuildingEnterance = entnc_yn;
                    else
                        personInfo.BuildingEnterance = true;

                    personInfo.DoorName = sensor_name;
                    personInfo.IsEnterance = entnc_yn;
                    personInfo.Time = cmg_tm;
                }

                // 리스트로 변환 후
                List<ComingPersonDateInfo> personInfos = dicPersonInfo.Values.ToList();

                // 시간 순으로 정렬
                personInfos.Sort((a, b) => 
                {
                    if (!a.Time.HasValue && !b.Time.HasValue) return 0;
                    if (!b.Time.HasValue) return 1;   // a가 null → 뒤로
                    if (!a.Time.HasValue) return -1;  // b가 null → 뒤로
                    return b.Time.Value.CompareTo(a.Time.Value);
                });

                // 조건 리스트 검색 및 카운팅
                response.TotalComingCount = personInfos.Count;
                response.TotalComingCount_Worker = personInfos.FindAll(x => x.IsVisitor == false).Count;
                response.TotalComingCount_Visitor = personInfos.FindAll(x => x.IsVisitor == true).Count;

                response.TotalRemainingCount = personInfos.FindAll(x => x.BuildingEnterance == true).Count;
                response.TotalRemainingCount_Worker = personInfos.FindAll(x => x.BuildingEnterance == true && x.IsVisitor == false).Count;
                response.TotalRemainingCount_Visitor = personInfos.FindAll(x => x.BuildingEnterance == true && x.IsVisitor == true).Count;

                response.ComingPersonInfos = personInfos;

                response.Success = true;
            }
            catch (Exception e)
            {
                response.Success = false;
                response.Message = e.Message;
            }
           
            return response;
        }

        // 중요구역 정보 가져오기 (중요구역 리스트, 중요구역별 출입자 리스트, 총 입장 수, 총 잔류 수)
        public ResponseAreaComingHistory GetAreaComingHistory()
        {
            ResponseAreaComingHistory response = new ResponseAreaComingHistory();

            DateTime dtToday = DateTime.Today;

            try
            {
                // 오늘 날짜 비상구역 출입문 his_cmg_nmpr / fa_sensor / fa_sensor_zone 조회
                // .TODO: 테스트를 위해 조건 주석처리
                // AND {ComingPerson.Fields.cmg_tm} >= '{dtToday.ToString("yyyy-MM-dd 00:00:00")}' AND {ComingPerson.Fields.cmg_tm} <= '{dtToday.ToString("yyyy-MM-dd 23:59:59")}'
                string strSQL = string.Format(@$"SELECT {ComingPerson.Fields.cmg_nmpr_hist_sn},{ComingPerson.Fields.cmg_nmpr_name},{ComingPerson.Fields.visitr_yn},{ComingPerson.Fields.team_name},{ComingPerson.Fields.clsf_name},
                                                {ComingPerson.Fields.cmg_tm},{ComingPerson.TableName}.{ComingPerson.Fields.sensor_sn},{ComingPerson.Fields.entnc_yn},{ComingPerson.Fields.event_name},{ComingPerson.Fields.event_code},
                                                {ComingPerson.Fields.empno}, {ComingPerson.Fields.card_no}, {Sensor.TableName}.{Sensor.Fields.sensor_name}, {SensorZone.Fields.sensor_sub_ty_no} 
                                                FROM {ComingPerson.TableName} 
                                                INNER JOIN {Sensor.TableName} ON {ComingPerson.TableName}.{ComingPerson.Fields.sensor_sn} = {Sensor.TableName}.{Sensor.Fields.sensor_sn} 
                                                INNER JOIN {SensorZone.TableName} ON {ComingPerson.TableName}.{ComingPerson.Fields.sensor_sn} = {SensorZone.TableName}.{SensorZone.Fields.sensor_zone_sn}
                                                WHERE {SensorZone.Fields.sensor_sub_ty_no} = {TYPE_AREA}
                                                AND {ComingPerson.Fields.cmg_tm} >= '{dtToday.ToString("yyyy-MM-dd 00:00:00")}' AND {ComingPerson.Fields.cmg_tm} <= '{dtToday.ToString("yyyy-MM-dd 23:59:59")}'
                                                ORDER BY {ComingPerson.Fields.cmg_tm}");

                IEnumerable<dynamic> results = m_dataManager.GetSelect().Select(strSQL, out string strErrMsg);
                if (results == null)
                {
                    throw new ApplicationException(strErrMsg);
                }

                Dictionary<int, DoorInfo> dicDoorInfos = new Dictionary<int, DoorInfo>();

                // 출입문 별(sensor_sn) 안에서 카드번호 별(card_no) 입장/퇴장 처리
                foreach (var result in results)
                {
                    string cmg_nmpr_name = result.cmg_nmpr_name;
                    bool visitr_yn = result.visitr_yn;
                    //string team_name = result.team_name;
                    //string clsf_name = result.clsf_name;
                    //DateTime cmg_tm = result.cmg_tm;
                    int sensor_sn = result.sensor_sn;
                    bool entnc_yn = result.entnc_yn;
                    //string event_name = result.event_name;
                    //string event_code = result.event_code;
                    //string empno = result.empno;
                    string card_no = result.card_no;
                    string sensor_name = result.sensor_name;
                    int? sensor_sub_ty_no = result.sensor_sub_ty_no;

                    DoorInfo doorInfo = null;



                    // 먼저 출입문 별 데이터 구분
                    if (dicDoorInfos.ContainsKey(sensor_sn) == false)
                    {
                        doorInfo = new DoorInfo();
                        doorInfo.DoorName = sensor_name;
                        doorInfo.nSensorNo = sensor_sn;
                        doorInfo.ComingPersonInfos = new List<ComingPersonInfo>();

                        dicDoorInfos[sensor_sn] = doorInfo;
                    }
                    else
                    {
                        doorInfo = dicDoorInfos[sensor_sn];
                    }

                    List<ComingPersonInfo> personInfos = doorInfo.ComingPersonInfos;

                    // 카드번호 별 입장/퇴장 처리
                    ComingPersonInfo personInfo = personInfos.Find(x => x.CardNo == card_no);

                    if (personInfo == null)
                    {
                        personInfo = new ComingPersonInfo();
                        personInfo.PersonName = cmg_nmpr_name;
                        personInfo.DoorName = sensor_name;
                        personInfo.IsVisitor = visitr_yn;
                        personInfo.IsEnterance = entnc_yn;
                        personInfo.CardNo = card_no;

                        personInfos.Add(personInfo);
                    }

                    personInfo.DoorName = sensor_name;
                    personInfo.IsEnterance = entnc_yn;
                    personInfo.BuildingEnterance = entnc_yn;
                }


                // 출입문 종합 데이터 합산 처리
                foreach (KeyValuePair<int, DoorInfo> pair in dicDoorInfos)
                {
                    DoorInfo doorInfo = pair.Value;
                    List<ComingPersonInfo> personInfos = doorInfo.ComingPersonInfos;

                    // 조건 리스트 검색 및 카운팅
                    doorInfo.TotalComingCount = personInfos.Count;

                    response.TotalComingCount += personInfos.Count;
                    response.TotalComingCount_Worker += personInfos.FindAll(x => x.IsVisitor == false).Count;
                    response.TotalComingCount_Visitor += personInfos.FindAll(x => x.IsVisitor == true).Count;

                    response.TotalRemainingCount += personInfos.FindAll(x => x.BuildingEnterance == true).Count;
                    response.TotalRemainingCount_Worker += personInfos.FindAll(x => x.BuildingEnterance == true && x.IsVisitor == false).Count;
                    response.TotalRemainingCount_Visitor += personInfos.FindAll(x => x.BuildingEnterance == true && x.IsVisitor == true).Count;
                }

                response.DoorInfos = dicDoorInfos.Values.ToList();

                response.Success = true;
            }
            catch (Exception e)
            {
                response.Success = false;
                response.Message = e.Message;
            }

            return response;
        }


        // 출입자 이동 동선 가져오기
        public ResponseRouteHistory GetRouteHistory(string strCardNo)
        {
            ResponseRouteHistory response = new ResponseRouteHistory();

            try
            {
                DateTime dtToday = DateTime.Today;

                // CardNo 대상으로 오늘 날짜의 출입문 his_cmg_nmpr / fa_sensor / fa_sensor_zone 조회
                // .TODO: 테스트를 위해 조건 주석처리
                // AND {ComingPerson.Fields.cmg_tm} >= '{dtToday.ToString("yyyy-MM-dd 00:00:00")}' AND {ComingPerson.Fields.cmg_tm} <= '{dtToday.ToString("yyyy-MM-dd 23:59:59")}'   
                string strSQL = string.Format(@$"SELECT {ComingPerson.Fields.cmg_nmpr_hist_sn},{ComingPerson.Fields.cmg_nmpr_name},{ComingPerson.Fields.visitr_yn},{ComingPerson.Fields.team_name},{ComingPerson.Fields.clsf_name},
                                                {ComingPerson.Fields.cmg_tm},{ComingPerson.TableName}.{ComingPerson.Fields.sensor_sn},{ComingPerson.Fields.entnc_yn},{ComingPerson.Fields.event_name},{ComingPerson.Fields.event_code},
                                                {ComingPerson.Fields.empno}, {ComingPerson.Fields.card_no}, {Sensor.TableName}.{Sensor.Fields.sensor_name}, {Sensor.TableName}.{Sensor.Fields.zone_sn}, {SensorZone.Fields.sensor_sub_ty_no}, 
                                                {Zone.TableName}.{Zone.Fields.name}
                                                FROM {ComingPerson.TableName} 
                                                INNER JOIN {Sensor.TableName} ON {ComingPerson.TableName}.{ComingPerson.Fields.sensor_sn} = {Sensor.TableName}.{Sensor.Fields.sensor_sn} 
                                                INNER JOIN {SensorZone.TableName} ON {ComingPerson.TableName}.{ComingPerson.Fields.sensor_sn} = {SensorZone.TableName}.{SensorZone.Fields.sensor_zone_sn}
                                                INNER JOIN {Zone.TableName} ON {Sensor.TableName}.{Sensor.Fields.zone_sn} = {Zone.TableName}.{Zone.Fields.zone_sn}
                                                WHERE {ComingPerson.Fields.card_no} = '{strCardNo}' 
                                                AND {ComingPerson.Fields.cmg_tm} >= '{dtToday.ToString("yyyy-MM-dd 00:00:00")}' AND {ComingPerson.Fields.cmg_tm} <= '{dtToday.ToString("yyyy-MM-dd 23:59:59")}'   
                                                ORDER BY {ComingPerson.Fields.cmg_tm}");

                IEnumerable<dynamic> results = m_dataManager.GetSelect().Select(strSQL, out string strErrMsg);
                if (results == null)
                {
                    throw new ApplicationException(strErrMsg);
                }

                List<RouteInfo> routes = new List<RouteInfo>();

                // 전 경로 비교 후 같은 출입문 경우 입/퇴실 타입이 다르고 해당 이력이 없다면 채우고 
                // 전 경로가 없거나 / 출입문이 다르다거 / 입/퇴실 타입이 같거나 또는 이미 해당 이력이 존재한다면 새로 데이터 입력
                // 
                foreach (var result in results)
                {
                    string cmg_nmpr_name = result.cmg_nmpr_name;
                    bool visitr_yn = result.visitr_yn;
                    //string team_name = result.team_name;
                    //string clsf_name = result.clsf_name;
                    DateTime cmg_tm = result.cmg_tm;
                    int sensor_sn = result.sensor_sn;
                    bool entnc_yn = result.entnc_yn;
                    //string event_name = result.event_name;
                    //string event_code = result.event_code;
                    string empno = result.empno;
                    string card_no = result.card_no;
                    string sensor_name = result.sensor_name;
                    int zone_sn = result.zone_sn;
                    int? sensor_sub_ty_no = result.sensor_sub_ty_no;
                    string name = result.name;

                    if (response.CardNo == null || response.PersonName == null || response.IsVisitor == null)
                    {
                        response.CardNo = card_no;
                        response.PersonName = cmg_nmpr_name;
                        response.Sabun = empno;
                        response.IsVisitor = visitr_yn;
                    }
                    
                    if (routes.Count == 0)
                    {   // 경로가 없을 경우
                        RouteInfo routeInfo = new RouteInfo();
                        routeInfo.SensorNo = sensor_sn;
                        routeInfo.DoorName = sensor_name;
                        routeInfo.ZoneNo = zone_sn;
                        routeInfo.ZoneName = name;
                        routeInfo.IsImportant = (sensor_sub_ty_no == TYPE_AREA);

                        if (entnc_yn)
                        {
                            routeInfo.EntryTime = cmg_tm;
                            routeInfo.Key = GetTimeKey(routeInfo.EntryTime, routeInfo.ExitTime);
                        }
                        else
                        {
                            routeInfo.ExitTime = cmg_tm;
                            routeInfo.Key = GetTimeKey(routeInfo.EntryTime, routeInfo.ExitTime);
                        }
                            
                        routes.Add(routeInfo);
                    }
                    else if (routes.Count > 0)
                    {   // 마지막 경로 비교
                        RouteInfo routeInfo = routes[routes.Count - 1];
                        
                        if (routeInfo.SensorNo == sensor_sn && ((entnc_yn == true && routeInfo.EntryTime == null) || (entnc_yn == false && routeInfo.ExitTime == null)))
                        {   // 같은 출입문 경우 (입/퇴실 데이터가 비었을 경우)
                            if (entnc_yn)
                            {
                                routeInfo.EntryTime = cmg_tm;
                                routeInfo.Key = GetTimeKey(routeInfo.EntryTime, routeInfo.ExitTime);
                            }
                            else
                            {
                                routeInfo.ExitTime = cmg_tm;
                                routeInfo.Key = GetTimeKey(routeInfo.EntryTime, routeInfo.ExitTime);
                            }
                        }
                        else
                        {   // 같은 출입문이 아닐 경우
                            RouteInfo route = new RouteInfo();
                            route.SensorNo = sensor_sn;
                            route.DoorName = sensor_name;
                            route.ZoneNo = zone_sn;
                            route.ZoneName = name;
                            route.IsImportant = (sensor_sub_ty_no == TYPE_AREA);

                            if (entnc_yn)
                            {
                                route.EntryTime = cmg_tm;
                                route.Key = GetTimeKey(route.EntryTime, route.ExitTime);
                            }
                            else
                            {
                                route.ExitTime = cmg_tm;
                                route.Key = GetTimeKey(route.EntryTime, route.ExitTime);
                            }

                            routes.Add(route);
                        }
                    }
                }

                response.Histories = routes;
                response.Success = true;
            }
            catch (Exception e)
            {
                response.Success = false;
                response.Message = e.Message;
            }

            return response;
        }

        private string GetTimeKey (DateTime? EntryTime, DateTime? ExitTime)
        {
            string strKey = null;

            string strEntryTime = "";
            if (EntryTime.HasValue)
                strEntryTime = EntryTime.Value.ToString("yyMMddHHmmss");

            string strExitTime = "";
            if (ExitTime.HasValue)
                strExitTime = ExitTime.Value.ToString("yyMMddHHmmss");

            strKey = $"Entry-{strEntryTime}_Exit-{strExitTime}";

            return strKey;
        }

        // 최신 이동현황 가져오기
        public ResponseLastComingPerson GetLastComingPerson()
        {
            ResponseLastComingPerson response = new ResponseLastComingPerson();

            try
            {
                // WHERE {ComingPerson.Fields.cmg_tm} >= '{dtToday.ToString("yyyy-MM-dd 00:00:00")}' AND {ComingPerson.Fields.cmg_tm} <= '{dtToday.ToString("yyyy-MM-dd 23:59:59")}' 

                string strSQL = string.Format(@$"SELECT {ComingPerson.Fields.cmg_nmpr_hist_sn},{ComingPerson.Fields.cmg_nmpr_name},{ComingPerson.Fields.visitr_yn},{ComingPerson.Fields.team_name},{ComingPerson.Fields.clsf_name},
                                                {ComingPerson.Fields.cmg_tm},{ComingPerson.TableName}.{ComingPerson.Fields.sensor_sn},{ComingPerson.Fields.entnc_yn},{ComingPerson.Fields.event_name},{ComingPerson.Fields.event_code},
                                                {ComingPerson.Fields.empno}, {ComingPerson.Fields.card_no}, {Sensor.TableName}.{Sensor.Fields.sensor_name}, {Sensor.TableName}.{Sensor.Fields.zone_sn}, {SensorZone.Fields.sensor_sub_ty_no}, 
                                                {Zone.TableName}.{Zone.Fields.name}
                                                FROM {ComingPerson.TableName} 
                                                INNER JOIN {Sensor.TableName} ON {ComingPerson.TableName}.{ComingPerson.Fields.sensor_sn} = {Sensor.TableName}.{Sensor.Fields.sensor_sn} 
                                                INNER JOIN {SensorZone.TableName} ON {ComingPerson.TableName}.{ComingPerson.Fields.sensor_sn} = {SensorZone.TableName}.{SensorZone.Fields.sensor_zone_sn}
                                                INNER JOIN {Zone.TableName} ON {Sensor.TableName}.{Sensor.Fields.zone_sn} = {Zone.TableName}.{Zone.Fields.zone_sn}
                                                ORDER BY {ComingPerson.Fields.cmg_tm} DESC");

                dynamic result = m_dataManager.GetSelect().SelectFirst(strSQL, out string strErrMsg);
                if (result == null && strErrMsg.Length > 0)
                {
                    throw new ApplicationException(strErrMsg);
                }
                else if (result == null && (strErrMsg == null || strErrMsg.Length == 0))
                {
                    response.PersonName = null;
                    response.DoorName = null;
                    response.ZoneName = null;
                    response.IsVisitor = null;
                    response.IsEnterance = null;
                    response.Time = null;
                    response.IsImportant = null;
                }
                else
                {
                    string cmg_nmpr_name = result.cmg_nmpr_name;
                    bool visitr_yn = result.visitr_yn;
                    DateTime cmg_tm = result.cmg_tm;
                    //int sensor_sn = result.sensor_sn;
                    bool entnc_yn = result.entnc_yn;
                    string card_no = result.card_no;
                    string sensor_name = result.sensor_name;
                    //int zone_sn = result.zone_sn;
                    int? sensor_sub_ty_no = result.sensor_sub_ty_no;
                    string name = result.name;

                    response.PersonName = cmg_nmpr_name;
                    response.DoorName = sensor_name;
                    response.ZoneName = name;
                    response.IsVisitor = visitr_yn;
                    response.IsEnterance = entnc_yn;
                    response.Time = cmg_tm;
                    response.IsImportant = (sensor_sub_ty_no == TYPE_AREA);
                }
               
                response.Success = true;
            }
            catch (Exception e)
            {
                response.Success = false;
                response.Message = e.Message;
            }

            return response;
        }

        public ResponseComingPersonHistory GetComingHistories(RequestComingPersonHistory request)
        {
            ResponseComingPersonHistory response = new ResponseComingPersonHistory();

            try
            {
                List<ComingHistory> histories = GetComingHistoryDatas(request.BeginYear, request.BeginMonth, request.BeginDay, request.EndYear, request.EndMonth, request.EndDay, request.IsVisitor, request.DoorNo, request.PersonName, request.IsImportArea, request.PageRowCount, request.PageNo, out int? nTotalCount, out string strErrorMessage);
                if (histories == null)
                {
                    throw new ApplicationException(strErrorMessage);
                }

                response.Histories = histories;
                response.TotalCount = (nTotalCount.HasValue ? nTotalCount.Value : histories.Count);
                response.Success = true;
            }
            catch (Exception e)
            {
                response.Success = false;
                response.Message = e.Message;
            }

            return response;
        }

        private List<ComingHistory> GetComingHistoryDatas(int BeginYear, int BeginMonth, int BeginDay, int EndYear, int EndMonth, int EndDay, bool? IsVisitor, int? DoorNo, string PersonName, bool isImportArea, int? PageRowCount, int? PageNo, out int? nTotalCount, out string strErrorMessage)
        {
            List<ComingHistory> histories = new List<ComingHistory>();
            strErrorMessage = "";
            nTotalCount = null;

            try
            {
                // 출입문 조회
                string strConditions = $"{Sensor.Fields.sensor_ty_code} = {(int)dnsDataKftc.CommonCode.SdmsSensor.SensorType.Door}";

                IEnumerable<Sensor> doorDatas = m_dataManager.GetSelect().Select<Sensor>(strConditions, out strErrorMessage);
                if (doorDatas == null)
                {
                    throw new ApplicationException(strErrorMessage);
                }

                List<Sensor> doors = doorDatas.ToList();


                // 날짜 
                string strCondition = string.Format("{0} >= '{1}' and {0} <= '{2}'",
                   ComingPerson.Fields.cmg_tm,
                   GetDateString(BeginYear, BeginMonth, BeginDay, true),
                   GetDateString(EndYear, EndMonth, EndDay, false));

                // 출입자 명
                if (PersonName?.Length > 0)
                    strCondition += $" and {ComingPerson.Fields.cmg_nmpr_name} like '%{PersonName}%'";

                // 출입문 ID
                if (DoorNo.HasValue)
                    strCondition += $" and {ComingPerson.TableName}.{ComingPerson.Fields.sensor_sn} = {DoorNo.Value}";

                // 방문자 여부
                if (IsVisitor.HasValue)
                    strCondition += $" and {ComingPerson.Fields.visitr_yn} = {(IsVisitor.Value ? "1" : "0")}";

                if (isImportArea)
                    strCondition += $" and {SensorZone.Fields.sensor_sub_ty_no} = 2";

                int beginIndex = 1;
                int? itemCount = PageRowCount;
                int? endIndex = null;

                if (PageRowCount.HasValue && PageNo.HasValue)
                    beginIndex = (int)PageRowCount.Value * (PageNo.Value - 1) + 1;

                if (itemCount != null)
                    endIndex = beginIndex + (int)itemCount - 1;

                ComingPerson comingPerson = new ComingPerson();

                SensorZone sz = new SensorZone();

                string strFields = comingPerson.GetFieldNames();
                strFields = strFields.Replace($"{ComingPerson.Fields.sensor_sn}", $"{ComingPerson.TableName}.{ComingPerson.Fields.sensor_sn}");

                string strSQL = string.Format("Select {0} from {1} Inner Join {3} on {3}.{4} = {1}.{5} where {2}", strFields, comingPerson.GetTableName(), strCondition, sz.GetTableName(), SensorZone.Fields.sensor_zone_sn, ComingPerson.Fields.sensor_sn);

                IEnumerable<ComingPerson> comings = m_dataManager.GetDBManager().Query<ComingPerson>(strSQL, out strErrorMessage);
                if (comings == null)
                {
                    throw new ApplicationException(strErrorMessage);
                }

                nTotalCount = comings.Count<ComingPerson>();

                string strQuery = CustomManager.MakePaginationQuery(m_dataManager, strSQL, beginIndex, endIndex, ComingPerson.Fields.cmg_nmpr_hist_sn.ToString());

                comings = m_dataManager.GetDBManager().Query<ComingPerson>(strQuery, out strErrorMessage);
                if (comings == null)
                {
                    throw new ApplicationException(strErrorMessage);
                }

                foreach (ComingPerson coming in comings)
                {
                    ComingHistory history = new ComingHistory();
                    history.PersonName = coming.cmg_nmpr_name;
                    history.IsVisitor = coming.visitr_yn;
                    history.IsEnterance = coming.entnc_yn;
                    history.TeamName = coming.team_name;
                    history.PositionName = coming.clsf_name;
                    history.Time = coming.cmg_tm;

                    Sensor data = doors.Find(x => x.sensor_sn == coming.sensor_sn);
                    if (data != null)
                    {
                        history.DoorName = data.sensor_name;
                    }

                    histories.Add(history);
                }
            }
            catch (Exception e)
            {
                strErrorMessage = e.Message;
                histories = null;
            }

            return histories;
        }

        private string GetDateString(int year, int month, int day, bool isBegin)
        {
            if (isBegin)
                return string.Format("{0}-{1:00}-{2:00} 00:00:00", year, month, day);

            return string.Format("{0}-{1:00}-{2:00} 23:59:59", year, month, day);
        }

        public ResponseComingDoors GetComingDoors()
        {
            ResponseComingDoors response = new ResponseComingDoors();

            try
            {
                string strSQL = string.Format(@$"SELECT {Sensor.TableName}.{Sensor.Fields.sensor_sn},  {Sensor.TableName}.{Sensor.Fields.sensor_name}, {SensorZone.Fields.sensor_sub_ty_no}
                                                FROM {Sensor.TableName} 
                                                INNER JOIN {SensorZone.TableName} ON {Sensor.TableName}.{Sensor.Fields.sensor_sn} = {SensorZone.TableName}.{SensorZone.Fields.sensor_zone_sn}
                                                WHERE {Sensor.TableName}.{Sensor.Fields.sensor_ty_code} = {dnsDataKftc.CommonCode.SdmsSensor.SensorType.Door} AND {Sensor.Fields.manual_yn} = 0");

                IEnumerable<dynamic> results = m_dataManager.GetSelect().Select(strSQL, out string strErrMsg);
                if (results == null)
                {
                    throw new ApplicationException(strErrMsg);
                }

                response.Doors = new List<DoorList>();

                // 출입문 별(sensor_sn) 안에서 카드번호 별(card_no) 입장/퇴장 처리
                foreach (var result in results)
                {
                    int sensor_sn = result.sensor_sn;
                    string sensor_name = result.sensor_name;
                    int? sensor_sub_ty_no = result.sensor_sub_ty_no;

                    DoorList door = new DoorList();
                    door.DoorNo = sensor_sn;
                    door.DoorName = sensor_name;
                    door.IsArea = (sensor_sub_ty_no == TYPE_AREA ? true : false);

                    response.Doors.Add(door);
                }

                response.Success = true;
            }
            catch(Exception e)
            {
                response.Doors = null;
                response.Success = false;
                response.Message = e.Message;
            }

            return response;
        }

        public ResponseExcelInfo DownloadExcelComingHistory(RequestExcelPartialComingHistory request)
        {
            ResponseExcelInfo response = new ResponseExcelInfo();
            string strErrorMessage = "";

            try
            {
                RequestExcelComingHistory requestData = new RequestExcelComingHistory();

                if (request.Histories == null)
                {
                    throw new ApplicationException("데이터 존재하지 않습니다.");
                }
                else if (request.Histories.Count >= 65500)
                {
                    request.Histories = request.Histories.Take(65500).ToList();
                }

                byte[] bytes = MakeExcelComingHistory(request.Histories, requestData, out strErrorMessage);
                if (bytes == null)
                {
                    throw new ApplicationException(strErrorMessage);
                }

                response.Bytes = bytes;
                response.FileName = GetFileName(EXCEL_TITLE);
                response.Success = true;
            }
            catch (Exception e)
            {
                response.Success = false;
                response.Message = e.Message;
            }

            return response;
        }

        public ResponseExcelInfo DownloadExcelAllComingHistory(RequestExcelComingHistory request)
        {
            ResponseExcelInfo response = new ResponseExcelInfo();
            string strErrorMessage = "";

            try
            {
                List<ComingHistory> histories = GetComingHistoryDatas(request.BeginYear, request.BeginMonth, request.BeginDay, request.EndYear, request.EndMonth, request.EndDay, request.IsVisitor, request.DoorNo, request.PersonName, request.IsImportArea, null, null, out int? nTotalCount, out strErrorMessage);
                if (histories == null)
                {
                    throw new ApplicationException(strErrorMessage);
                }
                else if (histories.Count >= 65500)
                {
                    histories = histories.Take(65500).ToList();
                }

                byte[] bytes = MakeExcelComingHistory(histories, request, out strErrorMessage);
                if (bytes == null)
                {
                    throw new ApplicationException(strErrorMessage);
                }

                response.Bytes = bytes;
                response.FileName = GetFileName(EXCEL_TITLE);
                response.Success = true;
            }
            catch (Exception e)
            {
                response.Success = false;
                response.Message = e.Message;
            }

            return response;
        }

        private byte[] MakeExcelComingHistory(List<ComingHistory> histories, RequestExcelComingHistory requestData, out string strErrorMessage)
        {
            ResponseExcelInfo response = new ResponseExcelInfo();
            strErrorMessage = null;

            try
            {
                HSSFWorkbook workbook = MakeWorkbook();

                if (workbook == null)
                    return null;

                List<SheetData> sheetDatas = new List<SheetData>();

                // 컬럼 및 데이터 생성
                SheetData sheet = MakeSheet(workbook, histories);
                sheetDatas.Add(sheet);

                if (sheetDatas == null)
                {
                    System.Diagnostics.Trace.WriteLine(strErrorMessage);
                    return null;
                }

                // 생성된 데이터로 시트에 채우기
                WriteSheetDatas(workbook, sheetDatas, requestData);

                byte[] bytes = null;

                using (MemoryStream stream = new MemoryStream())
                {
                    workbook.Write(stream);
                    bytes = stream.ToArray();
                }

                workbook.Close();
                return bytes;
            }
            catch (Exception e)
            {
                System.Diagnostics.Trace.WriteLine(e.Message);
                strErrorMessage = e.Message;
            }

            return null;
        }

        private HSSFWorkbook MakeWorkbook()
        {
            string strCompany = "금융결제원";

            if (strCompany == null)
                strCompany = "";

            HSSFWorkbook hssfworkbook = new HSSFWorkbook(/*stream*/);

            DocumentSummaryInformation dsi = PropertySetFactory.CreateDocumentSummaryInformation();
            dsi.Company = strCompany;
            hssfworkbook.DocumentSummaryInformation = dsi;

            //create a entry of SummaryInformation
            SummaryInformation si = PropertySetFactory.CreateSummaryInformation();
            si.Subject = EXCEL_TITLE;
            hssfworkbook.SummaryInformation = si;

            return hssfworkbook;
        }

        private SheetData MakeSheet(HSSFWorkbook workbook, List<ComingHistory> histories)
        {
            int historyCount = histories.Count;
            string strSubject = EXCEL_TITLE;

            SheetData sheetData = new SheetData(strSubject);
            SetTitles(workbook, sheetData, historyCount);

            Dictionary<int, ICellStyle> dicStyles = new Dictionary<int, ICellStyle>();

            for (int i = 0; i < historyCount; i++)
            {
                var historyData = histories[i];

                int index = 0;

                m_dicColumnWidths[index] = 40;
                sheetData.ColumnDatas[index++].Add((i + 1).ToString());

                m_dicColumnWidths[index] = 160;
                sheetData.ColumnDatas[index++].Add(GetText(historyData.PersonName));

                m_dicColumnWidths[index] = 160;
                sheetData.ColumnDatas[index++].Add(GetText((historyData.IsVisitor ? "방문자" : "임직원")));

                m_dicColumnWidths[index] = 160;
                sheetData.ColumnDatas[index++].Add(GetText(historyData.TeamName));

                m_dicColumnWidths[index] = 160;
                sheetData.ColumnDatas[index++].Add(GetText(historyData.PositionName));

                m_dicColumnWidths[index] = 160;
                sheetData.ColumnDatas[index++].Add(GetText(historyData.DoorName));

                m_dicColumnWidths[index] = 160;
                sheetData.ColumnDatas[index++].Add(GetText((historyData.IsEnterance ? "입장" : "퇴장")));

                m_dicColumnWidths[index] = 160;
                sheetData.ColumnDatas[index++].Add(GetText(historyData.Time));

                for (int j = 0; j < index; j++)
                {
                    SetBodyStyle(workbook, sheetData, dicStyles, i, historyCount, j, index);
                }

                sheetData.RowHeight[i] = RowHeight;
            }

            return sheetData;
        }

        private string GetFileName(string strTag)
        {
            DateTime dtNow = DateTime.Now;
            return string.Format("{0}_{1}{2:00}{3:00}_{4:00}{5:00}{6:00}.xls", strTag, dtNow.Year, dtNow.Month, dtNow.Day, dtNow.Hour, dtNow.Minute, dtNow.Second);
        }

        void WriteSheetDatas(HSSFWorkbook workbook, ICollection<SheetData> sheetDatas, RequestExcelComingHistory requestData)
        {
            foreach (SheetData sheetData in sheetDatas)
            {
                ISheet sheet = workbook.CreateSheet(sheetData.SheetName);

                if (sheet == null)
                    return;

                int nextRowIndex = WritePrev(sheet, workbook, requestData);

                IRow row = sheet.CreateRow(nextRowIndex);

                if (sheetData.TitleRowHeight != null)
                    row.HeightInPoints = (int)sheetData.TitleRowHeight;

                int min, max;

                if (GetMinMax(sheetData.Titles, out max, out min) == false)
                    continue;

                string strTitle;

                for (int i = min; i <= max; i++)
                {
                    if (sheetData.Titles.TryGetValue(i, out strTitle))
                    {
                        ICell cell = row.CreateCell(i);

                        ICellStyle style;

                        if (sheetData.TitleStyles.TryGetValue(i, out style))
                            cell.CellStyle = style;

                        if (cell != null && strTitle != null)
                            cell.SetCellValue(strTitle);
                    }
                }

                List<string> values;
                // Key : Column Index
                Dictionary<int, IRow> dicColumnRows = new Dictionary<int, IRow>();

                for (int i = min; i <= max; i++)
                {
                    if (sheetData.ColumnDatas.TryGetValue(i, out values))
                    {
                        int nValueCount = values.Count;

                        for (int j = 0; j < nValueCount; j++)
                        {
                            if (dicColumnRows.TryGetValue(j, out row) == false)
                            {
                                row = sheet.CreateRow(j + 1 + nextRowIndex);
                                dicColumnRows[j] = row;

                                int rowHeight;

                                if (sheetData.RowHeight.TryGetValue(j, out rowHeight))
                                    row.HeightInPoints = rowHeight;
                            }

                            string str = values[j];
                            ICell cell = row.CreateCell(i);

                            Dictionary<int, ICellStyle> dicStyles;

                            if (sheetData.CellStyles.TryGetValue(i, out dicStyles))
                            {
                                ICellStyle style;

                                if (dicStyles.TryGetValue(j, out style))
                                    cell.CellStyle = style;
                            }

                            if (cell != null && str != null)
                                cell.SetCellValue(str);
                        }
                    }
                }

                WritePost(sheet, workbook);
            }
        }

        void WritePost(ISheet sheet, HSSFWorkbook workbook)
        {

        }

        bool GetMinMax(Dictionary<int, string> dicTitles, out int max, out int min)
        {
            max = -1;
            min = 1;

            foreach (KeyValuePair<int, string> pair in dicTitles)
            {
                if (min > max)
                {
                    min = max = pair.Key;
                }
                else
                {
                    if (min > pair.Key)
                        min = pair.Key;

                    if (max < pair.Key)
                        max = pair.Key;
                }
            }

            return min <= max;
        }

        int WritePrev(ISheet sheet, HSSFWorkbook workbook, RequestExcelComingHistory requestData)
        {
            ICellStyle styleNormalLeft = GetNormalStyle(workbook, HorizontalAlignment.Left);
            CreateTitle(sheet, workbook);

            IRow row = null;
            ICell cell = null;

            int i = 2;

            if (requestData.BeginYear != -1 && requestData.BeginMonth != -1 && requestData.BeginDay != -1 && requestData.EndYear != -1 && requestData.EndMonth != -1 && requestData.EndDay != -1)
            {
                row = CreateRow(sheet, i);
                cell = row.CreateCell(0);
                cell.CellStyle = styleNormalLeft;
                cell.SetCellValue("조회 기간 : " + GetPeriod(requestData.BeginYear, requestData.BeginMonth, requestData.BeginDay, requestData.EndYear, requestData.EndMonth, requestData.EndDay));

                i++;
            }

            row = CreateRow(sheet, i);
            i++;

            return i;
        }

        void CreateTitle(ISheet sheet, HSSFWorkbook workbook)
        {
            IRow row = CreateRow(sheet, 0);
            ICell firstCell = row.CreateCell(0);

            firstCell.CellStyle = GetTitleStyle(workbook, true, true, false, false);

            for (int i = 1; i < m_nColumnCount - 1; i++)
            {
                row.CreateCell(i).CellStyle = GetTitleStyle(workbook, false, true, false, false);
            }

            row.CreateCell(m_nColumnCount - 1).CellStyle = GetTitleStyle(workbook, false, true, true, false);

            IRow nextRow = CreateRow(sheet, 1);

            nextRow.CreateCell(0).CellStyle = GetTitleStyle(workbook, true, false, false, true);

            for (int i = 1; i < m_nColumnCount - 1; i++)
            {
                nextRow.CreateCell(i).CellStyle = GetTitleStyle(workbook, false, false, false, true);
            }

            nextRow.CreateCell(m_nColumnCount - 1).CellStyle = GetTitleStyle(workbook, false, false, true, true);

            string strSubject = EXCEL_TITLE;
            firstCell.SetCellValue(strSubject);
            Merge(sheet, 0, 1, 0, m_nColumnCount - 1);

            double dPixelWidth = sheet.GetColumnWidthInPixels(0);
            double dWidth = sheet.GetColumnWidth(0);

            for (int i = 0; i < m_nColumnCount; i++)
            {
                sheet.SetColumnWidth(i, GetColumnWidth(dPixelWidth, dWidth, m_dicColumnWidths[i]));
            }
        }


        private string GetText(string strText)
        {
            if (strText != null && strText.Length > 0)
                return strText;

            return "-";
        }

        private string GetText(DateTime? time)
        {
            if (time == null)
                return "-";

            return string.Format("{0}-{1:00}-{2:00} {3:00}:{4:00}:{5:00}", ((DateTime)time).Year, ((DateTime)time).Month, ((DateTime)time).Day, ((DateTime)time).Hour, ((DateTime)time).Minute, ((DateTime)time).Second);
        }

        private void SetTitles(HSSFWorkbook workbook, SheetData sheetData, int historyCount)
        {
            int index = 0;

            // 출입자 리스트
            sheetData.Titles[index++] = Column_No;
            sheetData.Titles[index++] = Column_PersonName;
            sheetData.Titles[index++] = Column_Visitor;
            sheetData.Titles[index++] = Column_TeamName;
            sheetData.Titles[index++] = Column_Position;
            sheetData.Titles[index++] = Column_Door;
            sheetData.Titles[index++] = Column_Enterance;
            sheetData.Titles[index++] = Column_Time;

            ICellStyle leftHeader = GetHeaderStyle(workbook, dnsExcelReport.Writer.ExcelWriter.TableHeaderMode.Left);
            ICellStyle middleHeader = GetHeaderStyle(workbook, dnsExcelReport.Writer.ExcelWriter.TableHeaderMode.Middle);
            ICellStyle rightHeader = GetHeaderStyle(workbook, dnsExcelReport.Writer.ExcelWriter.TableHeaderMode.Right);

            if (historyCount == 0)
            {
                leftHeader.BorderBottom = BorderStyle.Medium;
                middleHeader.BorderBottom = BorderStyle.Medium;
                rightHeader.BorderBottom = BorderStyle.Medium;
            }

            foreach (KeyValuePair<int, string> pair in sheetData.Titles)
            {
                sheetData.ColumnDatas[pair.Key] = new List<string>();

                if (pair.Key == 0)
                    sheetData.TitleStyles[pair.Key] = leftHeader;
                else
                    sheetData.TitleStyles[pair.Key] = middleHeader;
            }

            sheetData.TitleRowHeight = RowHeight;

            return;
        }

        private double GetColumnWidth(double standardPixelWidth, double standardWidth, double dPixelWidth)
        {
            return standardWidth * dPixelWidth / standardPixelWidth;
        }

        private void Merge(ISheet sheet, int beginRowIndex, int endRowIndex, int beginColumnIndex, int endColumnIndex)
        {
            //Merging Cells
            NPOI.SS.Util.CellRangeAddress mergedBatch = new NPOI.SS.Util.CellRangeAddress(beginRowIndex, endRowIndex, beginColumnIndex, endColumnIndex);
            sheet.AddMergedRegion(mergedBatch);
        }

        private IRow CreateRow(ISheet sheet, int index)
        {
            IRow row = sheet.CreateRow(index);
            row.HeightInPoints = RowHeight;
            return row;
        }

        private ICellStyle GetTitleStyle(HSSFWorkbook workbook, bool left, bool top, bool right, bool bottom)
        {
            ICellStyle style = workbook.CreateCellStyle();

            style.Alignment = HorizontalAlignment.Center;
            style.VerticalAlignment = VerticalAlignment.Center;

            if (left)
                style.BorderLeft = BorderStyle.Medium;

            if (top)
                style.BorderTop = BorderStyle.Medium;

            if (right)
                style.BorderRight = BorderStyle.Medium;

            if (bottom)
                style.BorderBottom = BorderStyle.Medium;

            IFont font = workbook.CreateFont();

            font.IsBold = true;
            font.FontHeightInPoints = TitleFontSize;

            style.SetFont(font);
            return style;
        }

        private ICellStyle GetHeaderStyle(HSSFWorkbook workbook, dnsExcelReport.Writer.ExcelWriter.TableHeaderMode headerMode)
        {
            ICellStyle style = workbook.CreateCellStyle();
            style.Alignment = HorizontalAlignment.Center;
            style.VerticalAlignment = VerticalAlignment.Center;

            IFont font = workbook.CreateFont();
            font.FontHeightInPoints = NormalFontSize;
            style.SetFont(font);

            style.BorderTop = BorderStyle.Medium;
            style.BorderBottom = BorderStyle.Double;

            if (headerMode == dnsExcelReport.Writer.ExcelWriter.TableHeaderMode.Left)
            {
                style.BorderLeft = BorderStyle.Medium;
                style.BorderRight = BorderStyle.Dotted;
            }
            else if (headerMode == dnsExcelReport.Writer.ExcelWriter.TableHeaderMode.Middle)
            {
                style.BorderLeft = BorderStyle.Dotted;
                style.BorderRight = BorderStyle.Dotted;
            }
            else if (headerMode == dnsExcelReport.Writer.ExcelWriter.TableHeaderMode.Right)
            {
                style.BorderLeft = BorderStyle.Dotted;
                style.BorderRight = BorderStyle.Medium;
            }

            style.FillPattern = FillPattern.SolidForeground;
            style.FillForegroundColor = IndexedColors.LightTurquoise.Index;
            return style;
        }

        private ICellStyle GetNormalStyle(HSSFWorkbook workbook, HorizontalAlignment alignment)
        {
            ICellStyle style = workbook.CreateCellStyle();
            style.Alignment = alignment;
            style.VerticalAlignment = VerticalAlignment.Center;

            IFont font = workbook.CreateFont();
            font.FontHeightInPoints = NormalFontSize;

            style.SetFont(font);
            return style;
        }

        private string GetPeriod(int beginYear, int beginMonth, int beginDay, int endYear, int endMonth, int endDay)
        {
            return string.Format("{0}-{1:00}-{2:00} ~ {3}-{4:00}-{5:00}",
                        beginYear, beginMonth, beginDay,
                        endYear, endMonth, endDay);
        }

        private void SetBodyStyle(HSSFWorkbook workbook, SheetData sheetData, Dictionary<int, ICellStyle> dicStyles, int rowIndex, int historyCount, int columnIndex, int columnCount)
        {
            int rowMode = 0;

            if (rowIndex == 0)
                rowMode = (int)dnsExcelReport.Writer.ExcelWriter.TableBodyRow.Top;

            if (rowIndex == historyCount - 1)
                rowMode |= (int)dnsExcelReport.Writer.ExcelWriter.TableBodyRow.Bottom;

            if (rowIndex > 0 && rowIndex < historyCount - 1)
                rowMode = (int)dnsExcelReport.Writer.ExcelWriter.TableBodyRow.Middle;

            dnsExcelReport.Writer.ExcelWriter.TableHeaderMode headerMode;

            if (columnIndex == 0)
                headerMode = dnsExcelReport.Writer.ExcelWriter.TableHeaderMode.Left;
            else if (columnIndex == columnCount - 1)
                headerMode = dnsExcelReport.Writer.ExcelWriter.TableHeaderMode.Right;
            else
                headerMode = dnsExcelReport.Writer.ExcelWriter.TableHeaderMode.Middle;

            ICellStyle style = GetBodyStyle(workbook, dicStyles, headerMode, rowMode);

            Dictionary<int, ICellStyle> _dicStyles;

            if (sheetData.CellStyles.TryGetValue(columnIndex, out _dicStyles) == false)
            {
                _dicStyles = new Dictionary<int, ICellStyle>();
                sheetData.CellStyles[columnIndex] = _dicStyles;
            }

            _dicStyles[rowIndex] = style;
        }

        private ICellStyle GetBodyStyle(HSSFWorkbook workbook, Dictionary<int, ICellStyle> dicStyles, dnsExcelReport.Writer.ExcelWriter.TableHeaderMode headerMode, int rowMode)
        {
            ICellStyle style;
            int key = (((int)headerMode) << 16) | rowMode;

            if (dicStyles.TryGetValue(key, out style))
                return style;

            style = workbook.CreateCellStyle();
            style.Alignment = HorizontalAlignment.Center;
            style.VerticalAlignment = VerticalAlignment.Center;

            IFont font = workbook.CreateFont();
            font.FontHeightInPoints = NormalFontSize;
            style.SetFont(font);

            if (IsTop(rowMode))
            {
                style.BorderTop = BorderStyle.Double;

                if (IsBottom(rowMode))
                    style.BorderBottom = BorderStyle.Medium;
                else
                    style.BorderBottom = BorderStyle.Dotted;
            }
            else if (IsVMiddle(rowMode))
            {
                style.BorderTop = BorderStyle.Dotted;

                if (IsBottom(rowMode))
                    style.BorderBottom = BorderStyle.Medium;
                else
                    style.BorderBottom = BorderStyle.Dotted;
            }
            else
            {
                style.BorderTop = BorderStyle.Dotted;
                style.BorderBottom = BorderStyle.Medium;
            }

            if (headerMode == dnsExcelReport.Writer.ExcelWriter.TableHeaderMode.Left)
            {
                style.BorderLeft = BorderStyle.Medium;
                style.BorderRight = BorderStyle.Dotted;
            }
            else if (headerMode == dnsExcelReport.Writer.ExcelWriter.TableHeaderMode.Right)
            {
                style.BorderLeft = BorderStyle.Dotted;
                style.BorderRight = BorderStyle.Medium;
            }
            else
            {
                style.BorderLeft = BorderStyle.Dotted;
                style.BorderRight = BorderStyle.Dotted;
            }

            dicStyles[key] = style;
            return style;
        }

        static bool IsTop(int mode)
        {
            if ((mode & (int)dnsExcelReport.Writer.ExcelWriter.TableBodyRow.Top) == (int)dnsExcelReport.Writer.ExcelWriter.TableBodyRow.Top)
                return true;

            return false;
        }

        static bool IsVMiddle(int mode)
        {
            if ((mode & (int)dnsExcelReport.Writer.ExcelWriter.TableBodyRow.Middle) == (int)dnsExcelReport.Writer.ExcelWriter.TableBodyRow.Middle)
                return true;

            return false;
        }

        static bool IsBottom(int mode)
        {
            if ((mode & (int)dnsExcelReport.Writer.ExcelWriter.TableBodyRow.Bottom) == (int)dnsExcelReport.Writer.ExcelWriter.TableBodyRow.Bottom)
                return true;

            return false;
        }
    }
}
