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
    class PatrolManager
    {
        public enum ExcelType { PATROL, COURSE }

        private const string Column_No = "No";
        private const string Column_WorkName = "순찰자";
        private const string Column_Course = "순찰 코스";
        private const string Column_LastPlace = "마지막 순찰 지점";
        private const string Column_Time = "순찰 일시";
        private const string Column_Place = "순찰 지점";

        public const int TitleFontSize = 20;
        public const int NormalFontSize = 11;
        public const int RowHeight = 22;

        private IDataManager m_dataManager = null;

        private Dictionary<int, int> m_dicColumnWidths = new Dictionary<int, int>();
        private int m_nColumnCount = 5;

        public PatrolManager(IDataManager dataManager)
        {
            m_dataManager = dataManager;
        }

        public ResponsePatrolHistory GetPatrolHistory(RequestPatrolHistory request)
        {
            ResponsePatrolHistory response = new ResponsePatrolHistory();

            try
            {
                List<PatrolHistory> histories = GetPatrolHistoryDatas(request.BeginYear, request.BeginMonth, request.BeginDay, request.EndYear, request.EndMonth, request.EndDay, request.CourseName, request.WorkerName, request.PageRowCount, request.PageNo, out string strErrorMessage);
                if (histories == null)
                {
                    throw new ApplicationException(strErrorMessage);
                }

                response.Histories = histories;
                response.TotalCount = histories.Count;
                response.Success = true;
            }
            catch (Exception e)
            {
                response.Success = false;
                response.Message = e.Message;
            }            
            
            return response;
        }

        private List<PatrolHistory> GetPatrolHistoryDatas(int BeginYear, int BeginMonth, int BeginDay, int EndYear, int EndMonth, int EndDay, string CourseName, string WorkerName, int? PageRowCount, int? PageNo, out string strErrorMessage)
        {
            List<PatrolHistory> histories = new List<PatrolHistory>();
            strErrorMessage = "";

            try
            {
                // 날짜 
                string strCondition = string.Format("{0} >= '{1}' and {0} <= '{2}'",
                   Patrol.Fields.patrl_tm,
                   GetDateString(BeginYear, BeginMonth, BeginDay, true),
                   GetDateString(EndYear, EndMonth, EndDay, false));

                // 순찰 코스 이름
                if (CourseName?.Length > 0)
                    strCondition += $" and {Patrol.Fields.patrl_cours_name} like '%{CourseName}%'";

                // 순찰자 이름
                if (WorkerName?.Length > 0)
                    strCondition += $" and {Patrol.Fields.patrl_wrkr_name} like '%{WorkerName}%'";

                int beginIndex = 1;
                int? itemCount = PageRowCount;
                int? endIndex = null;

                if (PageRowCount.HasValue && PageNo.HasValue)
                    beginIndex = (int)PageRowCount.Value * (PageNo.Value - 1) + 1;

                if (itemCount != null)
                    endIndex = beginIndex + (int)itemCount - 1;

                Patrol patrolTable = new Patrol();

                string strSQL = string.Format("Select {0} from {1} where {2}", patrolTable.GetFieldNames(), patrolTable.GetTableName(), strCondition);
                string strQuery = CustomManager.MakePaginationQuery(m_dataManager, strSQL, beginIndex, endIndex, Patrol.Fields.patrl_hist_sn.ToString());

                IEnumerable<Patrol> patrols = m_dataManager.GetDBManager().Query<Patrol>(strQuery, out strErrorMessage);
                if (patrols == null)
                {
                    throw new ApplicationException(strErrorMessage);
                }

                Dictionary<int, PatrolHistory> dicPatrols = new Dictionary<int, PatrolHistory>();
                List<int> patrolIDs = new List<int>();

                foreach (Patrol patrol in patrols)
                {
                    PatrolHistory patrolHistory = new PatrolHistory();
                    patrolHistory.CourseName = patrol.patrl_cours_name;
                    patrolHistory.WorkerName = patrol.patrl_wrkr_name;
                    //patrolHistory.PatrolTime = patrol.patrl_tm;
                    patrolHistory.CourseHistories = new List<PatrolCourseHistory>();

                    dicPatrols[patrol.patrl_hist_sn] = patrolHistory;
                    patrolIDs.Add(patrol.patrl_hist_sn);
                }

                if (dicPatrols.Count > 0)
                {
                    PatrolCourse courseTable = new PatrolCourse();

                    strCondition = $"{PatrolCourse.Fields.patrl_hist_sn} in ({string.Join(",", patrolIDs)})";
                    strSQL = string.Format("Select {0} from {1} where {2}", courseTable.GetFieldNames(), courseTable.GetTableName(), strCondition);

                    IEnumerable<PatrolCourse> courses = m_dataManager.GetDBManager().Query<PatrolCourse>(strSQL, out strErrorMessage);
                    if (courses == null)
                    {
                        throw new ApplicationException(strErrorMessage);
                    }

                    foreach (PatrolCourse course in courses)
                    {
                        if (dicPatrols.ContainsKey(course.patrl_hist_sn))
                        {
                            PatrolHistory patrolHistory = dicPatrols[course.patrl_hist_sn];

                            PatrolCourseHistory courseHistory = new PatrolCourseHistory();
                            courseHistory.PatrolTime = course.patrl_place_tm;
                            courseHistory.PlaceName = course.patrl_place;
                            courseHistory.WorkerName = patrolHistory.WorkerName;
                            courseHistory.CourseName = patrolHistory.CourseName;

                            patrolHistory.PlaceName = course.patrl_place;
                            patrolHistory.PatrolTime = course.patrl_place_tm;
                            patrolHistory.CourseHistories.Add(courseHistory);
                        }
                    }

                    histories = dicPatrols.Values.ToList();
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

        public ResponseCourseList GetCourseList()
        {
            ResponseCourseList response = new ResponseCourseList();

            try
            {
                PatrolCourse courseTable = new PatrolCourse();

                string strSQL = string.Format($"Select {courseTable.GetFieldNames()} from {courseTable.GetTableName()}");

                IEnumerable<PatrolCourse> courses = m_dataManager.GetDBManager().Query<PatrolCourse>(strSQL, out string strErrorMessage);
                if (courses == null)
                {
                    throw new ApplicationException(strErrorMessage);
                }

                response.CourseList = new List<string>();

                foreach (PatrolCourse course in courses)
                {
                    if (response.CourseList.Contains(course.patrl_cours_name) == false)
                        response.CourseList.Add(course.patrl_cours_name);
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

        public ResponseExcelInfo DownloadExcelPartialPatrolHistory(RequestExcelPartialPatrolHistory request)
        {
            ResponseExcelInfo response = new ResponseExcelInfo();
            string strErrorMessage = "";

            try
            {
                RequestExcelPatrolHistory requestData = new RequestExcelPatrolHistory();

                byte[] bytes = MakeExcelPatrolHistory(request.Histories, requestData, out strErrorMessage);
                if (bytes == null)
                {
                    throw new ApplicationException(strErrorMessage);
                }
                
                response.Bytes = bytes;
                response.FileName = GetFileName(GetSubject(ExcelType.PATROL));
                response.Success = true;
            }
            catch (Exception e)
            {
                response.Success = false;
                response.Message = e.Message;
            }

            return response;
        }

        public ResponseExcelInfo DownloadExcelAllPatrolHistory(RequestExcelPatrolHistory request)
        {
            ResponseExcelInfo response = new ResponseExcelInfo();

            try
            {
                List<PatrolHistory> histories = GetPatrolHistoryDatas(request.BeginYear, request.BeginMonth, request.BeginDay, request.EndYear, request.EndMonth, request.EndDay, request.CourseName, request.WorkerName, null, null, out string strErrorMessage);
                if (histories == null)
                {
                    throw new ApplicationException(strErrorMessage);
                }

                byte[] bytes = MakeExcelPatrolHistory(histories, request, out strErrorMessage);
                if (bytes == null)
                {
                    throw new ApplicationException(strErrorMessage);
                }

                response.Bytes = bytes;
                response.FileName = GetFileName(GetSubject(ExcelType.PATROL));
                response.Success = true;
            }
            catch (Exception e)
            {
                response = new ResponseExcelInfo(false, e.Message);
            }
            
            return response;
        }

        private string GetFileName(string strTag)
        {
            DateTime dtNow = DateTime.Now;
            return string.Format("{0}_{1}{2:00}{3:00}_{4:00}{5:00}{6:00}.xls", strTag, dtNow.Year, dtNow.Month, dtNow.Day, dtNow.Hour, dtNow.Minute, dtNow.Second);
        }

        private byte[] MakeExcelPatrolHistory(List<PatrolHistory> histories, RequestExcelPatrolHistory requestData, out string strErrorMessage)
        {
            ResponseExcelInfo response = new ResponseExcelInfo();
            strErrorMessage = null;

            try
            {
                HSSFWorkbook workbook = MakeWorkbook(ExcelType.PATROL);

                if (workbook == null)
                    return null;

                //ICollection<SheetData> sheetDatas = ReadSheetDatas(workbook, histories, ExcelType.PATROL, out strErrorMessage);
                List<SheetData> sheetDatas = new List<SheetData>();

                // 컬럼 및 데이터 생성
                SheetData sheet = MakeSheet(workbook, histories, ExcelType.PATROL);
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

        private HSSFWorkbook MakeWorkbook(ExcelType excelType)
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
            si.Subject = GetSubject(excelType);
            hssfworkbook.SummaryInformation = si;

            return hssfworkbook;
        }

        private SheetData MakeSheet(HSSFWorkbook workbook, List<PatrolHistory> histories, ExcelType excelType)
        {
            int historyCount = histories.Count;
            string strSubject = GetSubject(excelType);

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
                sheetData.ColumnDatas[index++].Add(GetText(historyData.WorkerName));

                m_dicColumnWidths[index] = 160;
                sheetData.ColumnDatas[index++].Add(GetText(historyData.CourseName));

                m_dicColumnWidths[index] = 160;
                sheetData.ColumnDatas[index++].Add(GetText(historyData.PlaceName));

                m_dicColumnWidths[index] = 160;
                sheetData.ColumnDatas[index++].Add(GetText(historyData.PatrolTime));


                for (int j = 0; j < index; j++)
                {
                    SetBodyStyle(workbook, sheetData, dicStyles, i, historyCount, j, index);
                }

                sheetData.RowHeight[i] = RowHeight;
            }

            return sheetData;
        }


        private void SetTitles(HSSFWorkbook workbook, SheetData sheetData, int historyCount)
        {
            int index = 0;

            // 순찰 리스트
            sheetData.Titles[index++] = Column_No;
            sheetData.Titles[index++] = Column_WorkName;
            sheetData.Titles[index++] = Column_Course;
            sheetData.Titles[index++] = Column_LastPlace;
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
                else if (pair.Key == index - 1)
                    sheetData.TitleStyles[pair.Key] = rightHeader;
                else
                    sheetData.TitleStyles[pair.Key] = middleHeader;
            }

            sheetData.TitleRowHeight = RowHeight;

            return;
        }

        private void SetCourseTitles(HSSFWorkbook workbook, SheetData sheetData, int historyCount, ExcelType excelType)
        {
            int index = 0;

            // 상세 코스 리스트
            sheetData.Titles[index++] = Column_Course;
            sheetData.Titles[index++] = Column_Place;
            sheetData.Titles[index++] = Column_WorkName;
            sheetData.Titles[index++] = Column_Time;

            int nColumnCount = index;

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
                else if (pair.Key == index - 1)
                    sheetData.TitleStyles[pair.Key] = rightHeader;
                else
                    sheetData.TitleStyles[pair.Key] = middleHeader;
            }

            sheetData.TitleRowHeight = RowHeight;
        }

        void WriteSheetDatas(HSSFWorkbook workbook, ICollection<SheetData> sheetDatas, RequestExcelPatrolHistory requestData)
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

        int WritePrev(ISheet sheet, HSSFWorkbook workbook, RequestExcelPatrolHistory requestData)
        {
            ICellStyle styleNormalLeft = GetNormalStyle(workbook, HorizontalAlignment.Left);
            CreateTitle(sheet, workbook, ExcelType.PATROL);

            IRow row = null;
            ICell cell = null;

            int i = 2;
            
            //IRow row = CreateRow(sheet, 2);
            //ICell cell = row.CreateCell(0);
            //cell.CellStyle = styleNormalLeft;
            //cell.SetCellValue("센서 유형 : " + GetSensorTypeName());

            //row = CreateRow(sheet, 3);
            //cell = row.CreateCell(0);
            //cell.CellStyle = styleNormalLeft;
            //cell.SetCellValue("위치 : " + GetLocationName(m_dataManager, m_data.SensorNo, m_data.ZoneNo, m_data.BuildingNo, m_data.BuildingGroupNo));

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

        void CreateTitle(ISheet sheet, HSSFWorkbook workbook, ExcelType excelType)
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

            string strSubject = GetSubject(excelType);
            firstCell.SetCellValue(strSubject);
            Merge(sheet, 0, 1, 0, m_nColumnCount - 1);

            double dPixelWidth = sheet.GetColumnWidthInPixels(0);
            double dWidth = sheet.GetColumnWidth(0);

            for (int i = 0; i < m_nColumnCount; i++)
            {
                sheet.SetColumnWidth(i, GetColumnWidth(dPixelWidth, dWidth, m_dicColumnWidths[i]));
            }
        }

        private string GetSubject(ExcelType excelType)
        {
            return excelType == ExcelType.PATROL ? "순찰 리스트" : "순찰 상세 코스 리스트";
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
