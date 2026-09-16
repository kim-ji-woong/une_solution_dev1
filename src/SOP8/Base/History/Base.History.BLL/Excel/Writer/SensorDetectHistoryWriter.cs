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
    class SensorDetectHistoryWriter : ExcelWriter
    {
        private const string Column_No = "No";
        private const string Column_DetectTime = "일시";
        private const string Column_EndTime = "종료일시";
        private const string Column_SensorTypeName = "센서유형";
        private const string Column_SensorName = "센서명";
        private const string Column_Location = "위치";
        private const string Column_DetectStatus = "탐지정보";
        private const string Column_ClearType = "종료유형";
        private const string Column_AlarmDepthName = "알람단계";
        private const string Column_SopName = "대응 SOP";
        private const string Column_Memo = "메모";

        private RequestExcelPartialDetectHistory m_data = null;
        private IDataManager m_dataManager = null;

        private int m_nColumnCount = 0;
        private Dictionary<int, int> m_dicColumnWidths = new Dictionary<int, int>();

        public SensorDetectHistoryWriter(IDataManager dataManager, RequestExcelPartialDetectHistory data)
        {
            m_dataManager = dataManager;
            m_data = data;
        }

        protected override string GetSubject()
        {
            return "이벤트 탐지 이력";
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

                m_dicColumnWidths[index] = 40;
                sheetData.ColumnDatas[index++].Add((i + 1).ToString());

                m_dicColumnWidths[index] = 160;
                sheetData.ColumnDatas[index++].Add(SOPHistoryWriter.GetText(historyData.BeginTime));

                m_dicColumnWidths[index] = 160;
                sheetData.ColumnDatas[index++].Add(SOPHistoryWriter.GetText(historyData.EndTime));

                if (m_data.UseSensorTypeName)
                {
                    m_dicColumnWidths[index] = 160;
                    sheetData.ColumnDatas[index++].Add(SOPHistoryWriter.GetText(historyData.SensorTypeName));
                }

                if (m_data.UseSensorName)
                {
                    m_dicColumnWidths[index] = 240;
                    sheetData.ColumnDatas[index++].Add(SOPHistoryWriter.GetText(historyData.SensorName));
                }

                if (m_data.UseLocationName)
                {
                    m_dicColumnWidths[index] = 200;
                    sheetData.ColumnDatas[index++].Add(SOPHistoryWriter.GetText(historyData.LocationName));
                }

                if (m_data.UseDetectStatus)
                {
                    m_dicColumnWidths[index] = 120;
                    sheetData.ColumnDatas[index++].Add(SOPHistoryWriter.GetText(historyData.DetectStatus));
                }

                if (m_data.UseClearType)
                {
                    m_dicColumnWidths[index] = 120;
                    sheetData.ColumnDatas[index++].Add(SOPHistoryWriter.GetText(historyData.ClearType));
                }

                if (m_data.UseAlarmDepthName)
                {
                    m_dicColumnWidths[index] = 120;
                    sheetData.ColumnDatas[index++].Add(SOPHistoryWriter.GetText(historyData.AlarmDepthName));
                }

                if (m_data.UseSopName)
                {
                    m_dicColumnWidths[index] = 240;
                    sheetData.ColumnDatas[index++].Add(SOPHistoryWriter.GetText(historyData.SopName));
                }

                if (m_data.UseMemo)
                {
                    m_dicColumnWidths[index] = 240;
                    sheetData.ColumnDatas[index++].Add(SOPHistoryWriter.GetText(historyData.Memo));
                }

                for (int j=0;j<index;j++)
                {
                    SOPHistoryWriter.SetBodyStyle(workbook, sheetData, dicStyles, i, historyCount, j, index);
                }

                sheetData.RowHeight[i] = SOPHistoryWriter.RowHeight;
            }

            return sheetData;
        }

        private void SetTitles(HSSFWorkbook workbook, SheetData sheetData, int historyCount)
        {
            int index = 0;

            sheetData.Titles[index++] = Column_No;
            sheetData.Titles[index++] = Column_DetectTime;
            sheetData.Titles[index++] = Column_EndTime;

            if (m_data.UseSensorTypeName)
                sheetData.Titles[index++] = Column_SensorTypeName;

            if (m_data.UseSensorName)
                sheetData.Titles[index++] = Column_SensorName;

            if (m_data.UseLocationName)
                sheetData.Titles[index++] = Column_Location;

            if (m_data.UseDetectStatus)
                sheetData.Titles[index++] = Column_DetectStatus;

            if (m_data.UseClearType)
                sheetData.Titles[index++] = Column_ClearType;

            if (m_data.UseAlarmDepthName)
                sheetData.Titles[index++] = Column_AlarmDepthName;

            if (m_data.UseSopName)
                sheetData.Titles[index++] = Column_SopName;

            if (m_data.UseMemo)
                sheetData.Titles[index++] = Column_Memo;

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
            cell.SetCellValue("위치 : " + GetLocationName(m_dataManager, m_data.SensorNo, m_data.ZoneNo, m_data.BuildingNo, m_data.BuildingGroupNo));

            row = SOPHistoryWriter.CreateRow(sheet, 4);
            cell = row.CreateCell(0);
            cell.CellStyle = styleNormalLeft;
            cell.SetCellValue("조회 기간 : " + SOPHistoryWriter.GetPeriod(m_data.BeginYear, m_data.BeginMonth, m_data.BeginDay, m_data.EndYear, m_data.EndMonth, m_data.EndDay));

            row = SOPHistoryWriter.CreateRow(sheet, 5);
            return 6;
        }

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

            for (int i=0;i<m_nColumnCount;i++)
            {
                sheet.SetColumnWidth(i, SOPHistoryWriter.GetColumnWidth(dPixelWidth, dWidth, m_dicColumnWidths[i]));
            }
        }

        private string GetSensorTypeName()
        {
            if (m_data.SensorType == null)
                return "전체";

            if (m_data.SensorTypeDatas != null && m_data.SensorTypeDatas.Count > 0 && m_data.SensorSubTypes != null)
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

        public static string GetLocationName(IDataManager dataManager, int?  sensorNo, int? zoneNo, int? buildingNo, int? buildingGroupNo)
        {
            if (sensorNo != null)
                return GetSensorName(dataManager, (int)sensorNo);

            if (zoneNo != null)
                return GetZoneName(dataManager, (int)zoneNo);

            if (buildingNo != null)
                return GetBuildingName(dataManager, (int)buildingNo);

            if (buildingGroupNo != null)
                return GetBuildingGroupName(dataManager, (int)buildingGroupNo);

            return "전체";
        }

        private static string GetSensorName(IDataManager dataManager, int sensorNo)
        {
            string strErrorMessage;
            string strCondition = string.Format("{0} = {1}", Sensor.Fields.sensor_sn, sensorNo);
            Sensor sensor = dataManager.GetSelect().SelectFirst<Sensor>(strCondition, out strErrorMessage);

            if (sensor == null)
                return "-";

            return sensor.sensor_name;
        }

        private static string GetZoneName(IDataManager dataManager, int zoneNo)
        {
            string strErrorMessage;
            string strCondition = string.Format("{0} = {1}", Zone.Fields.zone_sn, zoneNo);
            Zone zone = dataManager.GetSelect().SelectFirst<Zone>(strCondition, out strErrorMessage);

            if (zone == null)
                return "-";

            return zone.disp_text;
        }

        private static string GetBuildingName(IDataManager dataManager, int buildingNo)
        {
            string strErrorMessage;
            string strCondition = string.Format("{0} = {1}", Building.Fields.buld_sn, buildingNo);
            Building building = dataManager.GetSelect().SelectFirst<Building>(strCondition, out strErrorMessage);

            if (building == null)
                return "-";

            return building.disp_text;
        }

        private static string GetBuildingGroupName(IDataManager dataManager, int buildingGroupNo)
        {
            string strErrorMessage;
            string strCondition = string.Format("{0} = {1}", BuildingGroup.Fields.buld_group_sn, buildingGroupNo);
            BuildingGroup buildingGroup = dataManager.GetSelect().SelectFirst<BuildingGroup>(strCondition, out strErrorMessage);

            if (buildingGroup == null)
                return "-";

            return buildingGroup.disp_text;
        }
    }
}
