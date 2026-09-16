using System;
using System.Collections.Generic;
using dnsDapperDBUtil.DataAccessLayer.IDAL;
using Base.History.IBLL.Models.SOP;
using NPOI.SS.UserModel;
using NPOI.HSSF.UserModel;
using System.Collections;
using Base.History.IBLL.Request;
using dnsExcelReport.Writer;
using dnsExcelReport.Models;

namespace Base.History.BLL.Excel.Writer
{
    class SOPHistoryWriter : ExcelWriter
    {
        private const string Column_No = "No";
        private const string Column_SopType = "재난 유형";
        private const string Column_SopName = "SOP 이름";
        private const string Column_ActionStepName = "SOP 단계";
        private const string Column_SensorName = "센서명";
        private const string Column_Position = "위치";
        private const string Column_BeginTime = "시작일시";
        private const string Column_EndTime = "종료일시";
        private const string Column_UserName = "실행자";

        public const int TitleFontSize = 20;
        public const int NormalFontSize = 11;
        public const int RowHeight = 22;

        private List<SOPHistoryData> m_sopHistoryDatas = null;
        private RequestExcelSOPPartialHistory m_request = null;
        private RequestSOPHistory m_requestSOPHistory = null;

        private IDataManager m_dataManager = null;

        public SOPHistoryWriter(IDataManager dataManager, ArrayList arrDatas)
        {
            if (arrDatas[0] is RequestExcelSOPPartialHistory)
                m_request = (RequestExcelSOPPartialHistory)arrDatas[0];
            else if (arrDatas[0] is RequestSOPHistory)
                m_requestSOPHistory = (RequestSOPHistory)arrDatas[0];

            m_sopHistoryDatas = (List<SOPHistoryData>)arrDatas[1];
            m_dataManager = dataManager;
        }

        protected override string GetSubject()
        {
            return "SOP 실행 이력";
        }

        protected override ICollection<SheetData> ReadSheetDatas(HSSFWorkbook workbook, out string strErrorMessage)
        {
            strErrorMessage = null;

            List<SheetData> sheetDatas = new List<SheetData>();
            sheetDatas.Add(MakeSheet(workbook, m_sopHistoryDatas));

            return sheetDatas;
        }

        protected override int WritePrev(ISheet sheet, HSSFWorkbook workbook)
        {
            ICellStyle styleNormalLeft = GetNormalStyle(workbook, HorizontalAlignment.Left);
            CreateTitle(sheet, workbook);

            IRow row = CreateRow(sheet, 2);
            ICell cell = row.CreateCell(0);
            cell.CellStyle = styleNormalLeft;
            cell.SetCellValue("조회 기간 : " + GetPeriod());

            row = CreateRow(sheet, 3);
            cell = row.CreateCell(0);
            cell.CellStyle = styleNormalLeft;
            cell.SetCellValue("재난 타입 : " + GetDisasterCategoryName());

            row = CreateRow(sheet, 4);
            cell = row.CreateCell(0);
            cell.CellStyle = styleNormalLeft;
            cell.SetCellValue("위기경보 단계 : " + GetActionStepName());

            row = CreateRow(sheet, 5);
            return 6;
        }

        private string GetPeriod()
        {
            if (m_request != null)
            {
                return GetPeriod(m_request.BeginYear, m_request.BeginMonth, m_request.BeginDay, m_request.EndYear, m_request.EndMonth, m_request.EndDay);
            }
            else if (m_requestSOPHistory != null)
            {
                return GetPeriod(m_requestSOPHistory.BeginYear, m_requestSOPHistory.BeginMonth, m_requestSOPHistory.BeginDay, m_requestSOPHistory.EndYear, m_requestSOPHistory.EndMonth, m_requestSOPHistory.EndDay);
            }
            else
                return "-";
        }

        public static string GetPeriod(int beginYear, int beginMonth, int beginDay, int endYear, int endMonth, int endDay)
        {
            return string.Format("{0}-{1:00}-{2:00} ~ {3}-{4:00}-{5:00}",
                        beginYear, beginMonth, beginDay,
                        endYear, endMonth, endDay);
        }

        private string GetDisasterCategoryName()
        {
            if (m_request != null && m_request.DisasterCategoryName != null && m_request.DisasterCategoryName.Length > 0)
                return m_request.DisasterCategoryName;

            if (m_requestSOPHistory != null && m_requestSOPHistory.DisasterCategoryName != null && m_requestSOPHistory.DisasterCategoryName.Length > 0)
                return m_requestSOPHistory.DisasterCategoryName;

            return "전체";
        }

        private string GetActionStepName()
        {
            if (m_request != null && m_request.ActionStepName != null && m_request.ActionStepName.Length > 0)
                return m_request.ActionStepName;

            if (m_requestSOPHistory != null && m_requestSOPHistory.ActionStepName != null && m_requestSOPHistory.ActionStepName.Length > 0)
                return m_requestSOPHistory.ActionStepName;

            return "전체";
        }

        public static IRow CreateRow(ISheet sheet, int index)
        {
            IRow row = sheet.CreateRow(index);
            row.HeightInPoints = RowHeight;
            return row;
        }

        private void CreateTitle(ISheet sheet, HSSFWorkbook workbook)
        {
            IRow row = CreateRow(sheet, 0);
            ICell firstCell = row.CreateCell(0);

            firstCell.CellStyle = GetTitleStyle(workbook, true, true, false, false);

            for (int i=1;i<=7;i++)
            {
                row.CreateCell(i).CellStyle = GetTitleStyle(workbook, false, true, false, false);
            }

            row.CreateCell(8).CellStyle = GetTitleStyle(workbook, false, true, true, false);

            IRow nextRow = CreateRow(sheet, 1);

            nextRow.CreateCell(0).CellStyle = GetTitleStyle(workbook, true, false, false, true);

            for (int i = 1; i <= 7; i++)
            {
                nextRow.CreateCell(i).CellStyle = GetTitleStyle(workbook, false, false, false, true);
            }

            nextRow.CreateCell(8).CellStyle = GetTitleStyle(workbook, false, false, true, true);

            firstCell.SetCellValue("SOP 이력");
            Merge(sheet, 0, 1, 0, 8);

            double dPixelWidth = sheet.GetColumnWidthInPixels(0);
            double dWidth = sheet.GetColumnWidth(0);

            sheet.SetColumnWidth(0, GetColumnWidth(dPixelWidth, dWidth, 40));
            sheet.SetColumnWidth(1, GetColumnWidth(dPixelWidth, dWidth, 160));
            sheet.SetColumnWidth(2, GetColumnWidth(dPixelWidth, dWidth, 120));
            sheet.SetColumnWidth(3, GetColumnWidth(dPixelWidth, dWidth, 120));
            sheet.SetColumnWidth(4, GetColumnWidth(dPixelWidth, dWidth, 240));
            sheet.SetColumnWidth(5, GetColumnWidth(dPixelWidth, dWidth, 200));
            sheet.SetColumnWidth(6, GetColumnWidth(dPixelWidth, dWidth, 160));
            sheet.SetColumnWidth(7, GetColumnWidth(dPixelWidth, dWidth, 160));
            sheet.SetColumnWidth(8, GetColumnWidth(dPixelWidth, dWidth, 120));
        }

        public static double GetColumnWidth(double standardPixelWidth, double standardWidth, double dPixelWidth)
        {
            return standardWidth * dPixelWidth / standardPixelWidth;
        }

        public static void Merge(ISheet sheet, int beginRowIndex, int endRowIndex, int beginColumnIndex, int endColumnIndex)
        {
            //Merging Cells
            NPOI.SS.Util.CellRangeAddress mergedBatch = new NPOI.SS.Util.CellRangeAddress(beginRowIndex, endRowIndex, beginColumnIndex, endColumnIndex);
            sheet.AddMergedRegion(mergedBatch);
        }

        public static ICellStyle GetNormalStyle(HSSFWorkbook workbook, HorizontalAlignment alignment)
        {
            ICellStyle style = workbook.CreateCellStyle();
            style.Alignment = alignment;
            style.VerticalAlignment = VerticalAlignment.Center;

            IFont font = workbook.CreateFont();
            font.FontHeightInPoints = NormalFontSize;

            style.SetFont(font);
            return style;
        }

        public static ICellStyle GetTitleStyle(HSSFWorkbook workbook, bool left, bool top, bool right, bool bottom)
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

        public static ICellStyle GetHeaderStyle(HSSFWorkbook workbook, TableHeaderMode headerMode)
        {
            ICellStyle style = workbook.CreateCellStyle();
            style.Alignment = HorizontalAlignment.Center;
            style.VerticalAlignment = VerticalAlignment.Center;

            IFont font = workbook.CreateFont();
            font.FontHeightInPoints = NormalFontSize;
            style.SetFont(font);

            style.BorderTop = BorderStyle.Medium;
            style.BorderBottom = BorderStyle.Double;

            if (headerMode == TableHeaderMode.Left)
            {
                style.BorderLeft = BorderStyle.Medium;
                style.BorderRight = BorderStyle.Dotted;
            }
            else if (headerMode == TableHeaderMode.Middle)
            {
                style.BorderLeft = BorderStyle.Dotted;
                style.BorderRight = BorderStyle.Dotted;
            }
            else if (headerMode == TableHeaderMode.Right)
            {
                style.BorderLeft = BorderStyle.Dotted;
                style.BorderRight = BorderStyle.Medium;
            }

            style.FillPattern = FillPattern.SolidForeground;
            style.FillForegroundColor = IndexedColors.LightTurquoise.Index;
            return style;
        }

        public static ICellStyle GetBodyStyle(HSSFWorkbook workbook, Dictionary<int, ICellStyle> dicStyles, TableHeaderMode headerMode, int rowMode)
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

            if (headerMode == TableHeaderMode.Left)
            {
                style.BorderLeft = BorderStyle.Medium;
                style.BorderRight = BorderStyle.Dotted;
            }
            else if (headerMode == TableHeaderMode.Right)
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

        private SheetData MakeSheet(HSSFWorkbook workbook, List<SOPHistoryData> sopHistoryDatas)
        {
            int historyCount = sopHistoryDatas.Count;
            string strSubject = m_request != null && m_request.SubjectName != null && m_request.SubjectName.Trim().Length > 0 ? m_request.SubjectName.Trim() : GetSubject();

            SheetData sheetData = new SheetData(strSubject);
            SetTitles(workbook, sheetData, historyCount);

            Dictionary<int, ICellStyle> dicStyles = new Dictionary<int, ICellStyle>();

            for (int i=0;i<historyCount;i++)
            {
                SOPHistoryData historyData = sopHistoryDatas[i];

                sheetData.ColumnDatas[0].Add((i + 1).ToString());
                sheetData.ColumnDatas[1].Add(GetText(historyData.DisasterCategoryName));
                sheetData.ColumnDatas[2].Add(GetText(historyData.SopName));
                sheetData.ColumnDatas[3].Add(GetText(historyData.ActionStepName));
                sheetData.ColumnDatas[4].Add(GetText(historyData.SensorName));
                sheetData.ColumnDatas[5].Add(GetText(historyData.Position));
                sheetData.ColumnDatas[6].Add(GetText(historyData.BeginTime));
                sheetData.ColumnDatas[7].Add(GetText(historyData.EndTime));
                sheetData.ColumnDatas[8].Add(GetText(historyData.UserName));

                SetBodyStyle(workbook, sheetData, dicStyles, i, historyCount, 0, 9);
                SetBodyStyle(workbook, sheetData, dicStyles, i, historyCount, 1, 9);
                SetBodyStyle(workbook, sheetData, dicStyles, i, historyCount, 2, 9);
                SetBodyStyle(workbook, sheetData, dicStyles, i, historyCount, 3, 9);
                SetBodyStyle(workbook, sheetData, dicStyles, i, historyCount, 4, 9);
                SetBodyStyle(workbook, sheetData, dicStyles, i, historyCount, 5, 9);
                SetBodyStyle(workbook, sheetData, dicStyles, i, historyCount, 6, 9);
                SetBodyStyle(workbook, sheetData, dicStyles, i, historyCount, 7, 9);
                SetBodyStyle(workbook, sheetData, dicStyles, i, historyCount, 8, 9);

                sheetData.RowHeight[i] = RowHeight;
            }

            return sheetData;
        }

        public static void SetBodyStyle(HSSFWorkbook workbook, SheetData sheetData, Dictionary<int, ICellStyle> dicStyles, int rowIndex, int historyCount, int columnIndex, int columnCount)
        {
            int rowMode = 0;

            if (rowIndex == 0)
                rowMode = (int)TableBodyRow.Top;

            if (rowIndex == historyCount - 1)
                rowMode |= (int)TableBodyRow.Bottom;

            if (rowIndex > 0 && rowIndex < historyCount - 1)
                rowMode = (int)TableBodyRow.Middle;

            TableHeaderMode headerMode;

            if (columnIndex == 0)
                headerMode = TableHeaderMode.Left;
            else if (columnIndex == columnCount - 1)
                headerMode = TableHeaderMode.Right;
            else
                headerMode = TableHeaderMode.Middle;

            ICellStyle style = GetBodyStyle(workbook, dicStyles, headerMode, rowMode);

            Dictionary<int, ICellStyle> _dicStyles;

            if (sheetData.CellStyles.TryGetValue(columnIndex, out _dicStyles) == false)
            {
                _dicStyles = new Dictionary<int, ICellStyle>();
                sheetData.CellStyles[columnIndex] = _dicStyles;
            }

            _dicStyles[rowIndex] = style;
        }

        public static string GetText(string strText)
        {
            if (strText != null && strText.Length > 0)
                return strText;

            return "-";
        }

        public static string GetText(DateTime? time)
        {
            if (time == null)
                return "-";

            return string.Format("{0}-{1:00}-{2:00} {3:00}:{4:00}:{5:00}", ((DateTime)time).Year, ((DateTime)time).Month, ((DateTime)time).Day, ((DateTime)time).Hour, ((DateTime)time).Minute, ((DateTime)time).Second);
        }

        private void SetTitles(HSSFWorkbook workbook, SheetData sheetData, int historyCount)
        {
            sheetData.Titles[0] = Column_No;
            sheetData.Titles[1] = Column_SopType;
            sheetData.Titles[2] = Column_SopName;
            sheetData.Titles[3] = Column_ActionStepName;
            sheetData.Titles[4] = Column_SensorName;
            sheetData.Titles[5] = Column_Position;
            sheetData.Titles[6] = Column_BeginTime;
            sheetData.Titles[7] = Column_EndTime;
            sheetData.Titles[8] = Column_UserName;

            ICellStyle leftHeader = GetHeaderStyle(workbook, TableHeaderMode.Left);
            ICellStyle middleHeader = GetHeaderStyle(workbook, TableHeaderMode.Middle);
            ICellStyle rightHeader = GetHeaderStyle(workbook, TableHeaderMode.Right);

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
                else if (pair.Key == 8)
                    sheetData.TitleStyles[pair.Key] = rightHeader;
                else
                    sheetData.TitleStyles[pair.Key] = middleHeader;
            }

            sheetData.TitleRowHeight = RowHeight;
        }
    }
}
