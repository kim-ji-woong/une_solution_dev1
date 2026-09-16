using Base.DAL;
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
    /// <summary>
    /// 주차 현황 조회 관리자
    /// </summary>
    public class ParkingManager
    {
        private IDataManager m_dataManager = null;

        private string TYPE_NONE = "NONE";
        private string TYPE_ENTRY = "ENTRY";
        private string TYPE_EXIT = "EXIT";

        private const string EXCEL_TITLE = "출입차량 리스트";

        public const int TitleFontSize = 20;
        public const int NormalFontSize = 11;
        public const int RowHeight = 22;

        private Dictionary<int, int> m_dicColumnWidths = new Dictionary<int, int>();
        private int m_nColumnCount = 5;

        private const string Column_No = "No";
        private const string Column_ParkingNo = "차량 번호";
        private const string Column_Cmmtkt = "차량 구분";
        private const string Column_Status = "출입 상태";
        private const string Column_ParkingTime = "출입 일시";

        public ParkingManager(IDataManager dataManager)
        {
            m_dataManager = dataManager;
        }

        /// <summary>
        /// 현재 주차 현황 조회 (잔류 차량 수 + 오늘 입/출 세션 리스트)
        /// </summary>
        public ResponseCurrentParkingInfo GetCurrentParkingInfo()
        {
            ResponseCurrentParkingInfo response = new ResponseCurrentParkingInfo();

            try
            {
                // 1. 잔류 차량 리스트 구하기
                // 차량번호별 마지막 이벤트를 구해 마지막이 입차인 경우만 필터 → 현재 주차 중
                string strSQL = @$"
                    WITH LastEvent AS (
                        SELECT
                            {Parking.Fields.parkng_hist_sn},
                            {Parking.Fields.parkng_vhcle_no},
                            {Parking.Fields.parkng_tm},
                            {Parking.Fields.parkng_entvhcl_yn},
		                    {Parking.Fields.cmmtkt_yn},
		                    {Parking.Fields.user_yn},
                            ROW_NUMBER() OVER (
                                PARTITION BY {Parking.Fields.parkng_vhcle_no}
                                ORDER BY {Parking.Fields.parkng_tm} DESC, {Parking.Fields.parkng_hist_sn} DESC
                            ) AS seq
                        FROM {Parking.TableName}
                    )
                    SELECT
                        {Parking.Fields.parkng_hist_sn},
                        {Parking.Fields.parkng_vhcle_no},
                        {Parking.Fields.parkng_tm},
	                    {Parking.Fields.parkng_entvhcl_yn},
	                    {Parking.Fields.cmmtkt_yn},
	                    {Parking.Fields.user_yn}
                    FROM LastEvent
                    WHERE seq = 1
                        AND {Parking.Fields.parkng_entvhcl_yn} = 1
                    ORDER BY {Parking.Fields.parkng_tm} DESC";

                IEnumerable<dynamic> results = m_dataManager.GetSelect().Select(strSQL, out string strErrMsg);
                if (results == null)
                    throw new ApplicationException(strErrMsg);

                Dictionary<string, ParkingData> dicCurrents = new Dictionary<string, ParkingData>();
                foreach (dynamic result in results)
                {
                    ParkingData data = new ParkingData();
                    data.ParkingHisNo = result.parkng_hist_sn;
                    data.ParkngNo = result.parkng_vhcle_no;
                    data.ParkngTm = result.parkng_tm;
                    data.CmmtktYn = result.cmmtkt_yn;

                    bool userYn = result.user_yn;
                    data.ParkngStateNo = (int)ParkingData.Type.ENTRY;
                    data.ParkngStatusNm = ParkingData.GetParkngStateString(data.ParkngStateNo);

                    dicCurrents[data.ParkngNo] = data;
                }

                response.CurrentParkingNum = dicCurrents.Count;
                response.EntryParkingNum = 0;
                response.OutParkingNum = 0;

                // 2. 오늘 입/출 차량 리스트 구하기
                // 차량번호 + 시간 오름차순 정렬로 입/출 순서를 보장하여 세션 매칭
                // WHERE p.{Parking.Fields.parkng_tm} >= '{DateTime.Today.ToString("yyyy-MM-dd 00:00:00")}'
                strSQL = @$"
                        SELECT
                             {Parking.Fields.parkng_hist_sn},
                             {Parking.Fields.parkng_vhcle_no},
                             {Parking.Fields.parkng_tm},
                             {Parking.Fields.parkng_entvhcl_yn},
                             {Parking.Fields.cmmtkt_yn},
                             {Parking.Fields.user_yn},
                            --출차 행에 한해, 같은 차량의 직전 입차 시각(전날 입차 포함)을 함께 조회
                            CASE WHEN {Parking.Fields.parkng_entvhcl_yn} = 0 THEN
                               (SELECT MAX(i.{Parking.Fields.parkng_tm})
                                FROM {Parking.TableName} i
                                WHERE i.{Parking.Fields.parkng_vhcle_no} = p.{Parking.Fields.parkng_vhcle_no}
                                AND i.{Parking.Fields.parkng_entvhcl_yn} = 1                        -- 입차 행만
                                AND i.{Parking.Fields.parkng_tm} <= p.{Parking.Fields.parkng_tm})    --해당 출차 시각 이전의 가장 최근 입차
                                END AS entry_tm
                        FROM {Parking.TableName} p
                        WHERE p.{Parking.Fields.parkng_tm} >= '{DateTime.Today.ToString("yyyy-MM-dd 00:00:00")}'
                        ORDER BY p.{ Parking.Fields.parkng_vhcle_no} ASC, p.{ Parking.Fields.parkng_tm} ASC, p.{ Parking.Fields.parkng_hist_sn} ASC";

                results = m_dataManager.GetSelect().Select(strSQL, out strErrMsg);
                if (results == null)
                    throw new ApplicationException(strErrMsg);

                // 2-1. 차량번호별 이벤트 그룹핑 (쿼리 정렬 덕분에 시간순 보장)
                Dictionary<string, List<dynamic>> byVehicle = new Dictionary<string, List<dynamic>>();
                foreach (dynamic result in results)
                {
                    string vhcleNo = result.parkng_vhcle_no;
                    if (!byVehicle.ContainsKey(vhcleNo))
                        byVehicle[vhcleNo] = new List<dynamic>();
                    byVehicle[vhcleNo].Add(result);
                }

                // 2-2. 차량별 상태 머신으로 세션 매칭
                // 연속 동종 이벤트(입/입, 출/출)는 마지막 이벤트로 갱신하여 1건으로 처리
                // NONE → ENTRY: 새 입차 세션
                // NONE → EXIT:  짝 없는 출차 세션 (어제 입차 → 오늘 출차)
                // ENTRY → EXIT: 기존 입차 세션을 출차로 마감
                // ENTRY → ENTRY / EXIT → EXIT: 마지막 이벤트로 갱신 (1건 유지)
                // EXIT → ENTRY: 재입차, 새 입차 세션
                List<ParkingData> sessions = new List<ParkingData>();
                foreach (var kvp in byVehicle)
                {
                    ParkingData currentSession = null;
                    string lastEventType = TYPE_NONE; // NONE / ENTRY / EXIT

                    foreach (dynamic ev in kvp.Value)
                    {
                        bool entryYn = ev.parkng_entvhcl_yn;
                        bool userYn = ev.user_yn;
                        int stateNo = entryYn ? (int)ParkingData.Type.ENTRY
                                              : (userYn ? (int)ParkingData.Type.USER_OUT : (int)ParkingData.Type.OUT);

                        if (entryYn)
                        {
                            if (lastEventType == TYPE_ENTRY)
                            {
                                // 연속 입차 → 마지막 이벤트로 갱신 (1건 유지)
                                currentSession.ParkingHisNo = ev.parkng_hist_sn;
                                currentSession.ParkngTm = ev.parkng_tm;
                                currentSession.CmmtktYn = ev.cmmtkt_yn;
                            }
                            else
                            {
                                // NONE 또는 EXIT 후 입차 → 새 입차 세션
                                currentSession = new ParkingData
                                {
                                    ParkingHisNo = ev.parkng_hist_sn,
                                    ParkngNo = ev.parkng_vhcle_no,
                                    ParkngTm = ev.parkng_tm,
                                    CmmtktYn = ev.cmmtkt_yn,
                                    ParkngStateNo = stateNo,
                                    ParkngStatusNm = ParkingData.GetParkngStateString(stateNo)
                                };
                                sessions.Add(currentSession);

                                // 입차 카운트 (연속 입차 카운트 X)
                                response.EntryParkingNum++;
                            }
                            lastEventType = TYPE_ENTRY;
                        }
                        else
                        {
                            // 출차 카운트 (연속 출차 카운트 X)
                            if (lastEventType != TYPE_EXIT)
                                response.OutParkingNum++;

                            if (lastEventType == TYPE_NONE)
                            {
                                // 짝 없는 출차 (어제 입차 → 오늘 출차) → 새 출차 세션
                                currentSession = new ParkingData
                                {
                                    ParkingHisNo = ev.parkng_hist_sn,
                                    ParkngNo = ev.parkng_vhcle_no,
                                    //ParkngTm = ev.entry_tm,
                                    ParkngOutTm = ev.parkng_tm,
                                    CmmtktYn = ev.cmmtkt_yn,
                                    ParkngStateNo = stateNo,
                                    ParkngStatusNm = ParkingData.GetParkngStateString(stateNo)
                                };

                                if (ev.entry_tm != null)
                                    currentSession.ParkngTm = ev.entry_tm;

                                sessions.Add(currentSession);
                            }
                            else
                            {
                                // ENTRY→EXIT(정상 짝 매칭) 또는 EXIT→EXIT(연속 출차)
                                // 둘 다 currentSession을 마지막 이벤트로 갱신 (1건 유지)
                                currentSession.ParkingHisNo = ev.parkng_hist_sn;
                                if (ev.entry_tm != null)
                                    currentSession.ParkngTm = ev.entry_tm;
                                currentSession.ParkngOutTm = ev.parkng_tm;
                                currentSession.CmmtktYn = ev.cmmtkt_yn;
                                currentSession.ParkngStateNo = stateNo;
                                currentSession.ParkngStatusNm = ParkingData.GetParkngStateString(stateNo);
                            }
                            lastEventType = TYPE_EXIT;
                        }
                    }
                }

                // 2-2-1. 오늘 이벤트로 이미 리스트에 포함된 차량번호 수집
                HashSet<string> sessionVehicleNos = new HashSet<string>();
                foreach (ParkingData s in sessions)
                    sessionVehicleNos.Add(s.ParkngNo);

                // 2-2-2. 잔류 차량(오늘 이전 입차, 미출차) 중 오늘 이벤트가 없어 누락된 차량을 리스트에 추가
                //        dicCurrents 항목은 이미 ENTRY 상태/입차시각이 채워져 있어 그대로 사용
                //        당일 입차/출차 건수(EntryParkingNum/OutParkingNum)는 오늘 발생분 의미를 유지하기 위해 변경하지 않음
                foreach (KeyValuePair<string, ParkingData> kvp in dicCurrents)
                {
                    if (sessionVehicleNos.Contains(kvp.Key))
                        continue; // 오늘 이벤트로 이미 리스트에 존재 → 중복 추가 방지

                    sessions.Add(kvp.Value); // 잔류 차량을 입차/주차중 항목으로 추가
                }

                // 2-3. 최신순 정렬 후 응답 채우기
                sessions.Sort((a, b) => b.ParkngTm.CompareTo(a.ParkngTm));

                // 출차 차량은 출차 시각, 입차(주차중) 차량은 입차 시각 기준 최신순
                //sessions.Sort((a, b) => (b.ParkngOutTm ?? b.ParkngTm).CompareTo(a.ParkngOutTm ?? a.ParkngTm));

                response.ParkingList = sessions;

                response.Success = true;
            }
            catch (Exception ex)
            {
                response.Success = false;
                response.Message = ex.Message;
            }

            return response;
        }

        public ResponseParkingImage GetParkingImage(int nParkingHisNo)
        {
            ResponseParkingImage response = new ResponseParkingImage();

            try
            {
                string strConditions = $"{Parking.Fields.parkng_hist_sn} = {nParkingHisNo}";

                Parking parking = m_dataManager.GetSelect().SelectFirst<Parking>(strConditions, out string strErrMsg);
                if (parking == null)
                    throw new ApplicationException(strErrMsg);
                else if (parking.parkng_vhcle_image == null)
                    throw new ApplicationException("해당 주차차량 이미지가 존재하지 않습니다.");

                response.Bytes = parking.parkng_vhcle_image;
                response.Success = true;
            }
            catch (Exception ex)
            {
                response.Message = ex.Message;
                response.Success = false;
            }

            return response;
        }

        public ResponseParkingInfo InsertParkingManual(int nParkingHisNo)
        {
            ResponseParkingInfo response = new ResponseParkingInfo();

            try
            {
                string strConditions = $"{Parking.Fields.parkng_hist_sn} = {nParkingHisNo}";

                Parking parking = m_dataManager.GetSelect().SelectFirst<Parking>(strConditions, out string strErrMsg);
                if (parking == null)
                    throw new ApplicationException(strErrMsg);
                else if (parking.parkng_entvhcl_yn == false)
                    throw new ApplicationException("해당 데이터는 입차 차량이 아닙니다.");

                DateTime dtParking = parking.parkng_tm;

                parking.user_yn = true;
                parking.parkng_vhcle_image = null;
                parking.parkng_entvhcl_yn = false;
                parking.parkng_tm = DateTime.Now;

                if (m_dataManager.GetCreate().Insert<Parking>(parking, out strErrMsg) == false)
                    throw new ApplicationException(strErrMsg);

                 strConditions = @$"{Parking.Fields.parkng_vhcle_no} = '{parking.parkng_vhcle_no}'
                                    and {Parking.Fields.cmmtkt_yn} = {(parking.cmmtkt_yn ? 1 : 0)}
                                    and {Parking.Fields.user_yn} = {1}
                                    order by {Parking.Fields.parkng_tm} desc";

                parking = m_dataManager.GetSelect().SelectFirst<Parking>(strConditions, out strErrMsg);
                if (parking == null)
                    throw new ApplicationException(strErrMsg);

                response.ParkingHisNo = parking.parkng_hist_sn;
                response.ParkngTm = dtParking;
                response.ParkngOutTm = parking.parkng_tm;
                response.ParkngNo = parking.parkng_vhcle_no;
                response.CmmtktYn = parking.cmmtkt_yn;
                response.ParkngStateNo = (int)ParkingData.Type.USER_OUT;
                response.ParkngStatusNm = ParkingData.GetParkngStateString(response.ParkngStateNo);                

                response.Success = true;
            }
            catch (Exception ex)
            {
                response.Message = ex.Message;
                response.Success = false;
            }

            return response;
        }

        public ResponseParkingHistory GetParkingHistory(RequestParkingHistory request)
        {
            ResponseParkingHistory response = new ResponseParkingHistory();

            try
            {
                List<ParkingData> histories = GetParkingHistoryDatas(request.BeginYear, request.BeginMonth, request.BeginDay, request.EndYear, request.EndMonth, request.EndDay, request.CmmtktYn, request.ParkngNo, request.PageRowCount, request.PageNo, out int? nTotalCount, out string strErrorMessage);
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

        private List<ParkingData> GetParkingHistoryDatas(int BeginYear, int BeginMonth, int BeginDay, int EndYear, int EndMonth, int EndDay, bool? CmmtktYn, string ParkngNo, int? PageRowCount, int? PageNo, out int? nTotalCount, out string strErrorMessage)
        {
            List<ParkingData> histories = null;
            strErrorMessage = "";
            nTotalCount = null;

            try
            {
                // 날짜 
                string strCondition = string.Format("{0} >= '{1}' and {0} <= '{2}'",
                   Parking.Fields.parkng_tm,
                   GetDateString(BeginYear, BeginMonth, BeginDay, true),
                   GetDateString(EndYear, EndMonth, EndDay, false));

                // 출입차량 번호
                if (ParkngNo?.Length > 0)
                    strCondition += $" and {Parking.Fields.parkng_vhcle_no} like '%{ParkngNo}%'";

                // 차량 구분
                if (CmmtktYn != null)
                    strCondition += $" and {Parking.Fields.cmmtkt_yn} = {(CmmtktYn == true ? 1 : 0)}";

                int beginIndex = 1;
                int? itemCount = PageRowCount;
                int? endIndex = null;

                if (PageRowCount.HasValue && PageNo.HasValue)
                    beginIndex = (int)PageRowCount.Value * (PageNo.Value - 1) + 1;

                if (itemCount != null)
                    endIndex = beginIndex + (int)itemCount - 1;

                Parking parkingTable = new Parking();

                //string strSQL = string.Format("Select {0} from {1} where {2}", parkingTable.GetFieldNames(), parkingTable.GetTableName(), strCondition);
                string strSQL = @$"Select {Parking.Fields.parkng_hist_sn}, {Parking.Fields.parkng_vhcle_no}, {Parking.Fields.parkng_tm}, {Parking.Fields.cmmtkt_yn}, {Parking.Fields.parkng_entvhcl_yn},
                                    {Parking.Fields.user_yn} 
                                    from {Parking.TableName} 
                                    where {strCondition}";


                IEnumerable<Parking> parkings = m_dataManager.GetDBManager().Query<Parking>(strSQL, out strErrorMessage);
                if (parkings == null)
                {
                    throw new ApplicationException(strErrorMessage);
                }

                nTotalCount = parkings.Count<Parking>();

                string strQuery = CustomManager.MakePaginationQuery(m_dataManager, strSQL, beginIndex, endIndex, Parking.Fields.parkng_hist_sn.ToString());

                parkings = m_dataManager.GetDBManager().Query<Parking>(strQuery, out strErrorMessage);
                if (parkings == null)
                {
                    throw new ApplicationException(strErrorMessage);
                }

                histories = new List<ParkingData>();

                foreach (Parking parking in parkings)
                {
                    ParkingData parkingData = new ParkingData();
                    parkingData.ParkingHisNo = parking.parkng_hist_sn;
                    parkingData.ParkngNo = parking.parkng_vhcle_no;
                    parkingData.ParkngTm = parking.parkng_tm;
                    parkingData.CmmtktYn = parking.cmmtkt_yn;

                    bool parkng_entvhcl_yn = parking.parkng_entvhcl_yn;

                    int ParkngStateNo = (int)ParkingData.Type.ENTRY;

                    if (parkng_entvhcl_yn == false)
                    {
                        if (parking.user_yn == true)
                            ParkngStateNo = (int)ParkingData.Type.USER_OUT;
                        else
                            ParkngStateNo = (int)ParkingData.Type.OUT;
                    }

                    parkingData.ParkngStateNo = ParkngStateNo;
                    parkingData.ParkngStatusNm = ParkingData.GetParkngStateString(ParkngStateNo);

                    histories.Add(parkingData);
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

        public ResponseExcelInfo DownloadExcelParkingHistory(RequestExcelPartialParkingHistory request)
        {
            ResponseExcelInfo response = new ResponseExcelInfo();
            string strErrorMessage = "";

            try
            {
                RequestExcelParkingHistory requestData = new RequestExcelParkingHistory();

                if (request.Histories == null)
                {
                    throw new ApplicationException("데이터 존재하지 않습니다.");
                }
                else if (request.Histories.Count >= 65500)
                {
                    request.Histories = request.Histories.Take(65500).ToList();
                }

                byte[] bytes = MakeExcelParkingHistory(request.Histories, requestData, out strErrorMessage);
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

        public ResponseExcelInfo DownloadExcelAllParkingHistory(RequestExcelParkingHistory request)
        {
            ResponseExcelInfo response = new ResponseExcelInfo();
            string strErrorMessage = "";

            try
            {
                List<ParkingData> histories = GetParkingHistoryDatas(request.BeginYear, request.BeginMonth, request.BeginDay, request.EndYear, request.EndMonth, request.EndDay, request.CmmtktYn, request.ParkngNo, null, null, out int? nTotalCount, out strErrorMessage);
                if (histories == null)
                {
                    throw new ApplicationException(strErrorMessage);
                }
                else if (histories.Count >= 65500)
                {
                    histories = histories.Take(65500).ToList();
                }

                byte[] bytes = MakeExcelParkingHistory(histories, request, out strErrorMessage);
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

        private byte[] MakeExcelParkingHistory(List<ParkingData> histories, RequestExcelParkingHistory requestData, out string strErrorMessage)
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

        private SheetData MakeSheet(HSSFWorkbook workbook, List<ParkingData> histories)
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
                sheetData.ColumnDatas[index++].Add(GetText(historyData.ParkngNo));

                m_dicColumnWidths[index] = 160;
                sheetData.ColumnDatas[index++].Add(GetText((historyData.CmmtktYn ? "정기" : "방문")));

                m_dicColumnWidths[index] = 160;
                sheetData.ColumnDatas[index++].Add(GetText(historyData.ParkngStatusNm));

                m_dicColumnWidths[index] = 160;
                sheetData.ColumnDatas[index++].Add(GetText(historyData.ParkngTm.ToString("yyyy-MM-dd HH:mm:ss")));

                for (int j = 0; j < index; j++)
                {
                    SetBodyStyle(workbook, sheetData, dicStyles, i, historyCount, j, index);
                }

                sheetData.RowHeight[i] = RowHeight;
            }

            return sheetData;
        }

        void WriteSheetDatas(HSSFWorkbook workbook, ICollection<SheetData> sheetDatas, RequestExcelParkingHistory requestData)
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

        private IRow CreateRow(ISheet sheet, int index)
        {
            IRow row = sheet.CreateRow(index);
            row.HeightInPoints = RowHeight;
            return row;
        }

        int WritePrev(ISheet sheet, HSSFWorkbook workbook, RequestExcelParkingHistory requestData)
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

        private string GetFileName(string strTag)
        {
            DateTime dtNow = DateTime.Now;
            return string.Format("{0}_{1}{2:00}{3:00}_{4:00}{5:00}{6:00}.xls", strTag, dtNow.Year, dtNow.Month, dtNow.Day, dtNow.Hour, dtNow.Minute, dtNow.Second);
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
            sheetData.Titles[index++] = Column_ParkingNo;
            sheetData.Titles[index++] = Column_Cmmtkt;
            sheetData.Titles[index++] = Column_Status;
            sheetData.Titles[index++] = Column_ParkingTime;

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
