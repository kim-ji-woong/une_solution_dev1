using NPOI.SS.UserModel;
using NPOI.HSSF.UserModel;
using Base.History.IBLL.Request;
using dnsExcelReport.Writer;
using dnsExcelReport.Models;
using dnsDapperDBUtil.DataAccessLayer.IDAL;
using System.Collections.Generic;
using Base.Model.Common;
using Base.Model.Sensor;
using Base.Model.Spatial;
using Base.History.IBLL.Models.History;

namespace Base.History.BLL.Excel.Writer
{
    class SensorAnalysisHistoryWriter : ExcelWriter
    {
        private const string Column_No = "No";
        private const string Column_SensorTypeName = "센서유형";
        private const string Column_SensorName = "센서명";
        private const string Column_Location = "위치";
        private const string Column_DetectCount = "탐지횟수";
        private const string Column_MalfunctionCount = "오작동";
        private const string Column_SensorClearCount = "현장 복구";
        private const string Column_UserResetCount = "사용자 복구";
        private const string Column_MalfunctionRatio = "오작동률(%)";

        private RequestExcelPartialAnalysisHistory m_data = null;
        private IDataManager m_dataManager = null;

        private int m_nColumnCount = 0;
        private Dictionary<int, int> m_dicColumnWidths = new Dictionary<int, int>();

        public SensorAnalysisHistoryWriter(IDataManager dataManager, RequestExcelPartialAnalysisHistory data)
        {
            m_dataManager = dataManager;
            m_data = data;
        }

        protected override string GetSubject()
        {
            return "이벤트 탐지 분석";
        }

        protected override ICollection<SheetData> ReadSheetDatas(HSSFWorkbook workbook, out string strErrorMessage)
        {
            strErrorMessage = null;

            List<SheetData> sheetDatas = new List<SheetData>();
            sheetDatas.Add(MakeSheet(workbook));

            return sheetDatas;
        }

        private SheetData MakeSheet(HSSFWorkbook workbook)
        {
            int historyCount = m_data.Histories.Count;
            string strSubject = m_data.SubjectName != null && m_data.SubjectName.Trim().Length > 0 ? m_data.SubjectName.Trim() : GetSubject();

            SheetData sheetData = new SheetData(strSubject);
            SetTitles(workbook, sheetData, historyCount);

            Dictionary<int, ICellStyle> dicStyles = new Dictionary<int, ICellStyle>();

            for (int i = 0; i < historyCount; i++)
            {
                var historyData = m_data.Histories[i];

                int index = 0;

                sheetData.ColumnDatas[index++].Add((i + 1).ToString());
                
                if (m_data.UseSensorTypeName)
                    sheetData.ColumnDatas[index++].Add(SOPHistoryWriter.GetText(historyData.SensorTypeName));

                if (m_data.UseSensorName)
                    sheetData.ColumnDatas[index++].Add(SOPHistoryWriter.GetText(historyData.SensorName));

                if (m_data.UseLocationName)
                    sheetData.ColumnDatas[index++].Add(SOPHistoryWriter.GetText(historyData.LocationName));

                if (m_data.UseDetectCount)
                    sheetData.ColumnDatas[index++].Add(GetText(historyData.DetectCount));

                if (m_data.UseMalfunctionCount)
                    sheetData.ColumnDatas[index++].Add(GetText(historyData.MalfunctionCount));

                if (m_data.UseSensorClearCount)
                    sheetData.ColumnDatas[index++].Add(GetText(historyData.SensorClearCount));

                if (m_data.UseUserResetCount)
                    sheetData.ColumnDatas[index++].Add(GetText(historyData.UserResetCount));

                if (m_data.UseMalfunctionRatio)
                    sheetData.ColumnDatas[index++].Add(GetText(historyData.MalfunctionCount));

                for (int j = 0; j < index; j++)
                {
                    SOPHistoryWriter.SetBodyStyle(workbook, sheetData, dicStyles, i, historyCount, j, index);
                }

                sheetData.RowHeight[i] = SOPHistoryWriter.RowHeight;
            }

            return sheetData;
        }

        protected override int WritePrev(ISheet sheet, HSSFWorkbook workbook)
        {
            ICellStyle styleNormalLeft = SOPHistoryWriter.GetNormalStyle(workbook, HorizontalAlignment.Left);
            CreateTitle(sheet, workbook);

            IRow row = SOPHistoryWriter.CreateRow(sheet, 2);
            ICell cell = row.CreateCell(0);
            cell.CellStyle = styleNormalLeft;
            cell.SetCellValue("센서 유형 : " + GetSensorTypeName());

            row = SOPHistoryWriter.CreateRow(sheet, 3);
            cell = row.CreateCell(0);
            cell.CellStyle = styleNormalLeft;
            cell.SetCellValue("위치 : " + SensorDetectHistoryWriter.GetLocationName(m_dataManager, m_data.SensorNo, m_data.ZoneNo, m_data.BuildingNo, m_data.BuildingGroupNo));

            row = SOPHistoryWriter.CreateRow(sheet, 4);
            cell = row.CreateCell(0);
            cell.CellStyle = styleNormalLeft;
            cell.SetCellValue("조회 기간 : " + SOPHistoryWriter.GetPeriod(m_data.BeginYear, m_data.BeginMonth, m_data.BeginDay, m_data.EndYear, m_data.EndMonth, m_data.EndDay));

            row = SOPHistoryWriter.CreateRow(sheet, 5);
            return 6;
            //return CreateStatistics(sheet, workbook, 6);
        }

        private string GetSensorTypeName()
        {
            if (m_data.SensorType == null)
                return "전체";

            if (m_data.SensorTypeDatas != null && m_data.SensorSubTypes.Count > 0)
            {
                foreach (SensorTypeData sensorTypeData in m_data.SensorTypeDatas)
                {
                    if (sensorTypeData.SensorTypeCode == (int)m_data.SensorType)
                    {
                        foreach (int subTypeNo in m_data.SensorSubTypes)
                        {
                            if (sensorTypeData.SensorSubTypeNo == subTypeNo)
                                return sensorTypeData.SensorTypeName;
                        }
                    }
                }
            }

            string strErrorMessage;

            if (m_data.SensorSubTypes == null || m_data.SensorSubTypes.Count == 0)
            {
                string strCondition = string.Format("{0} = {1}", Codes.Fields.code, (int)m_data.SensorType);
                Codes code = m_dataManager.GetSelect().SelectFirst<Codes>(strCondition, out strErrorMessage);

                if (code == null)
                    return "전체";

                return code.code_name;
            }
            else
            {
                string strCondition = string.Format("{0} = {1} and {2} = {3}", SubType.Fields.sensor_ty_code, (int)m_data.SensorType, SubType.Fields.sensor_sub_ty_no, (int)m_data.SensorSubTypes[0]);
                SubType subType = m_dataManager.GetSelect().SelectFirst<SubType>(strCondition, out strErrorMessage);

                if (subType == null)
                    return "전체";

                return subType.sensor_sub_ty_name;
            }
        }

        /*private int CreateStatistics(ISheet sheet, HSSFWorkbook workbook, int rowIndex)
        {
            IRow row = SOPHistoryWriter.CreateRow(sheet, rowIndex);
            ICell firstCell = row.CreateCell(0);
            IFont font = GetStatisticsFont(workbook);

            firstCell.CellStyle = SOPHistoryWriter.GetTitleStyle(workbook, true, true, false, false);
            firstCell.CellStyle.SetFont(font);

            for (int i = 1; i < m_nColumnCount - 1; i++)
            {
                ICell cell = row.CreateCell(i);
                cell.CellStyle = SOPHistoryWriter.GetTitleStyle(workbook, false, true, false, false);
                cell.CellStyle.SetFont(font);
            }

            ICell lastCell = row.CreateCell(m_nColumnCount - 1);
            lastCell.CellStyle = SOPHistoryWriter.GetTitleStyle(workbook, false, true, true, false);
            lastCell.CellStyle.SetFont(font);

            IRow nextRow = SOPHistoryWriter.CreateRow(sheet, rowIndex + 1);

            ICell _firstCell = nextRow.CreateCell(0);
            _firstCell.CellStyle = SOPHistoryWriter.GetTitleStyle(workbook, true, false, false, true);
            _firstCell.CellStyle.SetFont(font);

            for (int i = 1; i < m_nColumnCount - 1; i++)
            {
                ICell cell = nextRow.CreateCell(i);
                cell.CellStyle = SOPHistoryWriter.GetTitleStyle(workbook, false, false, false, true);
                cell.CellStyle.SetFont(font);
            }

            ICell _lastCell = nextRow.CreateCell(m_nColumnCount - 1);
            _lastCell.CellStyle = SOPHistoryWriter.GetTitleStyle(workbook, false, false, true, true);
            _lastCell.CellStyle.SetFont(font);

            // 줄바꿈 표시를 위해 WrapText 속성 설정
            firstCell.CellStyle.WrapText = true;
            firstCell.SetCellValue(GetStatisticsText());
            SOPHistoryWriter.Merge(sheet, rowIndex, rowIndex + 1, 0, m_nColumnCount - 1);

            double dPixelWidth = sheet.GetColumnWidthInPixels(0);
            double dWidth = sheet.GetColumnWidth(0);

            for (int i = 0; i < m_nColumnCount; i++)
            {
                sheet.SetColumnWidth(i, SOPHistoryWriter.GetColumnWidth(dPixelWidth, dWidth, m_dicColumnWidths[i]));
            }

            SOPHistoryWriter.CreateRow(sheet, rowIndex + 2);
            return rowIndex + 3;
        }

        private IFont GetStatisticsFont(HSSFWorkbook workbook)
        {
            IFont font = workbook.CreateFont();

            font.IsBold = true;
            font.FontHeightInPoints = SOPHistoryWriter.NormalFontSize;

            return font;
        }

        private string GetStatisticsText()
        {
            string strText = string.Format("{0}동안 {1}의 센서 탐지 횟수는 {2}회이며, 오작동률은 {3:F1}%입니다.",
                SOPHistoryWriter.GetPeriod(m_data.BeginYear, m_data.BeginMonth, m_data.BeginDay, m_data.EndYear, m_data.EndMonth, m_data.EndDay),
                SensorDetectHistoryWriter.GetLocationName(m_dataManager, m_data.SensorNo, m_data.ZoneNo, m_data.BuildingNo, m_data.BuildingGroupNo),
                m_data.TotalDetectionCount,
                m_data.TotalMalfunctionRatio);

            if (m_data.MostDetectionSensorName != null)
            {
                if (m_data.MostDetectionSensorCount != null)
                    strText += string.Format("\n가장 탐지횟수가 높은 센서는 {0}이며, 총 {1}회 탐지되었습니다.", m_data.MostDetectionSensorName, (int)m_data.MostDetectionSensorCount);
                else
                    strText += string.Format("\n가장 탐지횟수가 높은 센서는 {0}입니다.", m_data.MostDetectionSensorName);
            }

            if (m_data.MostDetectionLocationName != null)
            {
                if (m_data.MostDetectionLocationCount != null)
                    strText += string.Format("\n가장 탐지횟수가 높은 위치는 {0}이며, 총 {1}회 탐지되었습니다.", m_data.MostDetectionLocationName, (int)m_data.MostDetectionLocationCount);
                else
                    strText += string.Format("\n가장 탐지횟수가 높은 위치는 {0}입니다.", m_data.MostDetectionLocationName);
            }

            if (m_data.MostDetectionSensorTypeName != null)
            {
                if (m_data.MostDetectionSensorTypeCount != null)
                    strText += string.Format("\n가장 탐지횟수가 높은 센서유형은 {0}이며, 총 {1}회 탐지되었습니다.", m_data.MostDetectionSensorTypeName, (int)m_data.MostDetectionSensorTypeCount);
                else
                    strText += string.Format("\n가장 탐지횟수가 높은 센서유형은 {0}입니다.", m_data.MostDetectionSensorTypeName);
            }

            if (m_data.TopMalfunctionSensorName != null)
            {
                if (m_data.TopMalfunctionSensorRatio != null)
                    strText += string.Format("\n가장 많은 오작동을 일으킨 센서는 {0}이며, 오작동률은 {1:F1}%입니다.", m_data.TopMalfunctionSensorName, (double)m_data.TopMalfunctionSensorRatio);
                else
                    strText += string.Format("\n가장 많은 오작동을 일으킨 센서는 {0}입니다.", m_data.TopMalfunctionSensorName);
            }

            return strText;
        }*/

        private void CreateTitle(ISheet sheet, HSSFWorkbook workbook)
        {
            IRow row = SOPHistoryWriter.CreateRow(sheet, 0);
            ICell firstCell = row.CreateCell(0);

            firstCell.CellStyle = SOPHistoryWriter.GetTitleStyle(workbook, true, true, false, false);

            for (int i = 1; i < m_nColumnCount - 1; i++)
            {
                row.CreateCell(i).CellStyle = SOPHistoryWriter.GetTitleStyle(workbook, false, true, false, false);
            }

            row.CreateCell(m_nColumnCount - 1).CellStyle = SOPHistoryWriter.GetTitleStyle(workbook, false, true, true, false);

            IRow nextRow = SOPHistoryWriter.CreateRow(sheet, 1);

            nextRow.CreateCell(0).CellStyle = SOPHistoryWriter.GetTitleStyle(workbook, true, false, false, true);

            for (int i = 1; i < m_nColumnCount - 1; i++)
            {
                nextRow.CreateCell(i).CellStyle = SOPHistoryWriter.GetTitleStyle(workbook, false, false, false, true);
            }

            nextRow.CreateCell(m_nColumnCount - 1).CellStyle = SOPHistoryWriter.GetTitleStyle(workbook, false, false, true, true);

            string strSubject = m_data.SubjectName != null && m_data.SubjectName.Trim().Length > 0 ? m_data.SubjectName.Trim() : GetSubject();
            firstCell.SetCellValue(strSubject);
            SOPHistoryWriter.Merge(sheet, 0, 1, 0, m_nColumnCount - 1);

            double dPixelWidth = sheet.GetColumnWidthInPixels(0);
            double dWidth = sheet.GetColumnWidth(0);

            for (int i = 0; i < m_nColumnCount; i++)
            {
                sheet.SetColumnWidth(i, SOPHistoryWriter.GetColumnWidth(dPixelWidth, dWidth, m_dicColumnWidths[i]));
            }
        }

        private void SetTitles(HSSFWorkbook workbook, SheetData sheetData, int historyCount)
        {
            int index = 0;

            m_dicColumnWidths[index] = 40;
            sheetData.Titles[index++] = Column_No;

            if (m_data.UseSensorTypeName)
            {
                m_dicColumnWidths[index] = 160;
                sheetData.Titles[index++] = Column_SensorTypeName;
            }

            if (m_data.UseSensorName)
            {
                m_dicColumnWidths[index] = 240;
                sheetData.Titles[index++] = Column_SensorName;
            }

            if (m_data.UseLocationName)
            {
                m_dicColumnWidths[index] = 200;
                sheetData.Titles[index++] = Column_Location;
            }

            if (m_data.UseDetectCount)
            {
                m_dicColumnWidths[index] = 120;
                sheetData.Titles[index++] = Column_DetectCount;
            }

            if (m_data.UseMalfunctionCount)
            {
                m_dicColumnWidths[index] = 120;
                sheetData.Titles[index++] = Column_MalfunctionCount;
            }

            if (m_data.UseSensorClearCount)
            {
                m_dicColumnWidths[index] = 120;
                sheetData.Titles[index++] = Column_SensorClearCount;
            }

            if (m_data.UseUserResetCount)
            {
                m_dicColumnWidths[index] = 120;
                sheetData.Titles[index++] = Column_UserResetCount;
            }

            if (m_data.UseMalfunctionRatio)
            {
                m_dicColumnWidths[index] = 120;
                sheetData.Titles[index++] = Column_MalfunctionRatio;
            }

            m_nColumnCount = index;

            ICellStyle leftHeader = SOPHistoryWriter.GetHeaderStyle(workbook, TableHeaderMode.Left);
            ICellStyle middleHeader = SOPHistoryWriter.GetHeaderStyle(workbook, TableHeaderMode.Middle);
            ICellStyle rightHeader = SOPHistoryWriter.GetHeaderStyle(workbook, TableHeaderMode.Right);

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

            sheetData.TitleRowHeight = SOPHistoryWriter.RowHeight;
        }

        public static string GetText(int? value)
        {
            if (value == null)
                return "-";

            return ((int)value).ToString();
        }
    }
}
