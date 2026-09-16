using dnsExcelReport.Models;
using dnsExcelReport.Writer;
using dnsDapperDBUtil.DataAccessLayer.IDAL;
using System.Collections.Generic;
using NPOI.HSSF.UserModel;
using NPOI.SS.UserModel;
using Base.Model.Spatial;
using Soulbrain.DAL;
using Soulbrain.Model.Facility;
using System.Collections;

namespace Soulbrain.BLL.Excel.Writer
{
    class FacilityDataWriter : ExcelWriter
    {
        public const string Column_FacilityNo = "설비 ID";
        public const string Column_FacilityName = "설비이름";
        public const string Column_Text = "Text";
        public const string Column_WithDot = "WithDot";
        public const string Column_Indent = "들여쓰기";

        private const int NormalFontSize = 11;
        private const int RowHeight = 22;

        private IDataManager m_dataManager = null;
        private int? m_siteNo = null;

        public FacilityDataWriter(IDataManager dataManager, int? siteNo)
        {
            m_dataManager = dataManager;
            m_siteNo = siteNo;
        }

        public static string GetColumnName(int index)
        {
            if (index == 0)
                return FacilityDataWriter.Column_FacilityNo;
            else if (index == 1)
                return FacilityDataWriter.Column_FacilityName;
            else if (index == 2)
                return FacilityDataWriter.Column_Text;
            else if (index == 3)
                return FacilityDataWriter.Column_WithDot;
            else if (index == 4)
                return FacilityDataWriter.Column_Indent;

            return null;
        }

        public static int GetColumnCount()
        {
            return 5;
        }

        protected override string GetSubject()
        {
            return "설비 정보";
        }

        protected override ICollection<SheetData> ReadSheetDatas(HSSFWorkbook workbook, out string strErrorMessage)
        {
            if (m_dataManager == null)
            {
                strErrorMessage = "DB에 연결할 수 없습니다.";
                return null;
            }

            // Key : Zone No
            // Value : Sheet Name
            Dictionary<int, string> dicZoneSheetNames = MakeZoneSheetNames(out strErrorMessage);

            // Key : Facility No
            Dictionary<int, List<FacilityData>> dicFacilityDatas;
            Dictionary<int, Facility> dicFacilities = ReadFacilityDatas(m_siteNo, out dicFacilityDatas, out strErrorMessage);

            if (dicFacilities == null)
                return null;

            int facilityDataCount = GetFacilityDataCount(dicFacilityDatas);
            CheckEmptyFacilityInfo(dicFacilities.Values, dicFacilityDatas);

            // Key : Zone No
            Dictionary<int, SheetData> dicSheetDatas = new Dictionary<int, SheetData>();
            // Key : Sheet Name
            Dictionary<string, SheetData> dicSheetDatas2 = new Dictionary<string, SheetData>();

            string strSheetName;
            SheetData sheetData = null;

            foreach (KeyValuePair<int, List<FacilityData>> pair in dicFacilityDatas)
            {
                Facility facility;

                if (dicFacilities.TryGetValue(pair.Key, out facility) == false)
                    continue;

                List<FacilityData> datas = pair.Value;
                datas.Sort();

                if (dicSheetDatas.TryGetValue(facility.zone_sn, out sheetData) == false)
                {
                    if (dicZoneSheetNames.TryGetValue(facility.zone_sn, out strSheetName) == false)
                        continue;

                    if (dicSheetDatas2.TryGetValue(strSheetName, out sheetData))
                    {
                        dicSheetDatas[facility.zone_sn] = sheetData;
                    }
                    else
                    {
                        sheetData = new SheetData(strSheetName);
                        SetTitles(workbook, sheetData, facilityDataCount == 0);
                        dicSheetDatas[facility.zone_sn] = sheetData;
                        dicSheetDatas2[strSheetName] = sheetData;
                    }
                }

                int nCount = datas.Count;

                if (nCount == 0)
                    SetColumnDatas(sheetData, facility.model_name, facility.fclty_name, null, null, null);
                else
                {
                    SetColumnDatas(sheetData, facility.model_name, facility.fclty_name, datas[0].value, datas[0].wdt, datas[0].indent_level);

                    for (int i = 1; i < nCount; i++)
                    {
                        SetColumnDatas(sheetData, null, null, datas[i].value, datas[i].wdt, datas[i].indent_level);
                    }
                }
            }

            SetSheetStyles(workbook, sheetData);

            List<SheetData> sheetDatas = new List<SheetData>();
            sheetDatas.AddRange(dicSheetDatas2.Values);

            sheetDatas.Sort();
            return sheetDatas;
        }

        private void SetSheetStyles(HSSFWorkbook workbook, SheetData sheetData)
        {
            if (sheetData != null)
            {
                int columnCount = sheetData.ColumnDatas.Count;

                if (columnCount > 0)
                {
                    int rowCount = sheetData.ColumnDatas[0].Count;

                    if (rowCount > 0)
                    {
                        Dictionary<int, ICellStyle> dicStyles = new Dictionary<int, ICellStyle>();

                        for (int i = 0; i < rowCount; i++)
                        {
                            for (int j = 0; j < columnCount; j++)
                            {
                                SetBodyStyle(workbook, sheetData, dicStyles, i, rowCount, j);
                            }
                        }
                    }
                }
            }
        }

        private Dictionary<int, Facility> ReadFacilityDatas(int? siteNo, out Dictionary<int, List<FacilityData>> dicFacilityDatas, out string strErrorMessage)
        {
            dicFacilityDatas = null;
            string strCondition = siteNo == null ? null : string.Format("c.{0} = {1}", Zone.Fields.site_sn, (int)siteNo);

            JoinManager joinManager = new JoinManager(m_dataManager);
            ArrayList arrDatas = joinManager.JoinFacilityFacilityData(strCondition, out strErrorMessage);

            if (arrDatas == null)
                return null;

            Dictionary<int, Facility> dicFacilities = new Dictionary<int, Facility>();
            // Key : Facility No
            dicFacilityDatas = new Dictionary<int, List<FacilityData>>();

            List<FacilityData> facilityDatas = null;

            int nDataCount = arrDatas.Count;

            for (int i=0;i<nDataCount-1;i+=2)
            {
                if (arrDatas[i] is Facility && arrDatas[i + 1] is FacilityData)
                {
                    Facility facility = (Facility)arrDatas[i];
                    FacilityData facilityData = (FacilityData)arrDatas[i + 1];

                    dicFacilities[facility.fclty_sn] = facility;

                    if (dicFacilityDatas.TryGetValue(facility.fclty_sn, out facilityDatas) == false)
                    {
                        facilityDatas = new List<FacilityData>();
                        dicFacilityDatas[facility.fclty_sn] = facilityDatas;
                    }

                    facilityDatas.Add(facilityData);
                }
            }

            return dicFacilities;
        }

        // Key : Zone ID
        // Value : Sheet Name
        private Dictionary<int, string> MakeZoneSheetNames(out string strErrorMessage)
        {
            IEnumerable<Building> buildings = m_dataManager.GetSelect().Select<Building>(null, out strErrorMessage);

            if (buildings == null)
                return null;

            IEnumerable<Zone> zones = m_dataManager.GetSelect().Select<Zone>(null, out strErrorMessage);

            if (zones == null)
                return null;

            Dictionary<int, Building> dicBuildings = ToDictionary(buildings);
            Dictionary<int, Zone> dicZones = ToDictionary(zones);

            Building building;
            Dictionary<int, string> dicZoneSheetNames = new Dictionary<int, string>();

            foreach (KeyValuePair<int, Zone> pair in dicZones)
            {
                if (pair.Value.buld_sn == null)
                    continue;

                if (dicBuildings.TryGetValue((int)pair.Value.buld_sn, out building))
                    dicZoneSheetNames[pair.Key] = building.name;
            }

            return dicZoneSheetNames;
        }

        private Dictionary<int, Building> ToDictionary(IEnumerable<Building> datas)
        {
            Dictionary<int, Building> dicDatas = new Dictionary<int, Building>();

            foreach (Building data in datas)
            {
                dicDatas[data.buld_sn] = data;
            }

            return dicDatas;
        }

        private Dictionary<int, Zone> ToDictionary(IEnumerable<Zone> datas)
        {
            Dictionary<int, Zone> dicDatas = new Dictionary<int, Zone>();

            foreach (Zone data in datas)
            {
                dicDatas[data.zone_sn] = data;
            }

            return dicDatas;
        }

        private int GetFacilityDataCount(Dictionary<int, List<FacilityData>> dicFacilityDatas)
        {
            int count = 0;

            foreach (KeyValuePair<int, List<FacilityData>> pair in dicFacilityDatas)
            {
                count += pair.Value.Count;
            }

            return count;
        }

        private void SetColumnDatas(SheetData sheetData, string strModelName, string strFacilityName, string strValue, bool? withDot, int? indent)
        {
            strValue = ValueLineBreak(strValue);

            List<string> columnDatas;

            if (sheetData.ColumnDatas.TryGetValue(0, out columnDatas))
            {
                if (strModelName != null)
                    columnDatas.Add(strModelName);
                else
                    columnDatas.Add(null);
            }

            if (sheetData.ColumnDatas.TryGetValue(1, out columnDatas))
            {
                if (strFacilityName != null)
                    columnDatas.Add(strFacilityName);
                else
                    columnDatas.Add(null);
            }

            if (sheetData.ColumnDatas.TryGetValue(2, out columnDatas))
            {
                if (strValue != null)
                    columnDatas.Add(strValue);
                else
                    columnDatas.Add(null);
            }

            if (sheetData.ColumnDatas.TryGetValue(3, out columnDatas))
            {
                if (withDot != null)
                {
                    if ((bool)withDot)
                        columnDatas.Add("1");
                    else
                        columnDatas.Add("0");
                }
                else
                    columnDatas.Add(null);
            }

            if (sheetData.ColumnDatas.TryGetValue(4, out columnDatas))
            {
                if (indent != null)
                    columnDatas.Add(((int)indent).ToString());
                else
                    columnDatas.Add(null);
            }
        }

        private void SetTitles(HSSFWorkbook workbook, SheetData sheetData, bool isEmpty)
        {
            sheetData.Titles[0] = FacilityDataWriter.Column_FacilityNo;
            sheetData.Titles[1] = FacilityDataWriter.Column_FacilityName;
            sheetData.Titles[2] = FacilityDataWriter.Column_Text;
            sheetData.Titles[3] = FacilityDataWriter.Column_WithDot;
            sheetData.Titles[4] = FacilityDataWriter.Column_Indent;

            foreach (KeyValuePair<int, string> pair in sheetData.Titles)
            {
                sheetData.ColumnDatas[pair.Key] = new List<string>();
            }

            ICellStyle leftHeader = GetHeaderStyle(workbook, TableHeaderMode.Left);
            ICellStyle middleHeader = GetHeaderStyle(workbook, TableHeaderMode.Middle);
            ICellStyle rightHeader = GetHeaderStyle(workbook, TableHeaderMode.Right);

            if (isEmpty)
            {
                leftHeader.BorderBottom = BorderStyle.Medium;
                middleHeader.BorderBottom = BorderStyle.Medium;
                rightHeader.BorderBottom = BorderStyle.Medium;
            }

            int titleCount = sheetData.Titles.Count;

            foreach (KeyValuePair<int, string> pair in sheetData.Titles)
            {
                sheetData.ColumnDatas[pair.Key] = new List<string>();

                if (pair.Key == 0)
                    sheetData.TitleStyles[pair.Key] = leftHeader;
                else if (pair.Key == titleCount - 1)
                    sheetData.TitleStyles[pair.Key] = rightHeader;
                else
                    sheetData.TitleStyles[pair.Key] = middleHeader;
            }

            sheetData.TitleRowHeight = RowHeight;
        }

        // 줄바꿈 기호가 있으면 줄바꿈 한뒤 Trim() 시킨다.
        private string ValueLineBreak(string strValue)
        {
            if (strValue == null)
                return strValue;

            string[] tokens = strValue.Split("\r\n");

            string strResult = null;

            foreach (string strToken in tokens)
            {
                if (strResult == null)
                    strResult = strToken.Trim();
                else
                    strResult += "\r\n" + strToken.Trim();
            }

            return strResult;
        }

        private ICellStyle GetHeaderStyle(HSSFWorkbook workbook, TableHeaderMode headerMode)
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

        private void SetBodyStyle(HSSFWorkbook workbook, SheetData sheetData, Dictionary<int, ICellStyle> dicStyles, int rowIndex, int dataCount, int columnIndex)
        {
            int rowMode = 0;

            if (rowIndex == 0)
                rowMode = (int)TableBodyRow.Top;

            if (rowIndex == dataCount - 1)
                rowMode |= (int)TableBodyRow.Bottom;

            if (rowIndex > 0 && rowIndex < dataCount - 1)
                rowMode = (int)TableBodyRow.Middle;

            TableHeaderMode headerMode;

            if (columnIndex == 0)
                headerMode = TableHeaderMode.Left;
            else if (columnIndex == GetColumnCount() - 1)
                headerMode = TableHeaderMode.Right;
            else
                headerMode = TableHeaderMode.Middle;

            HorizontalAlignment align = (columnIndex == 2) ? HorizontalAlignment.Left : HorizontalAlignment.Center;

            ICellStyle style = GetBodyStyle(workbook, dicStyles, headerMode, rowMode, align);

            Dictionary<int, ICellStyle> _dicStyles;

            if (sheetData.CellStyles.TryGetValue(columnIndex, out _dicStyles) == false)
            {
                _dicStyles = new Dictionary<int, ICellStyle>();
                sheetData.CellStyles[columnIndex] = _dicStyles;
            }

            _dicStyles[rowIndex] = style;
        }

        private ICellStyle GetBodyStyle(HSSFWorkbook workbook, Dictionary<int, ICellStyle> dicStyles, TableHeaderMode headerMode, int rowMode, HorizontalAlignment align)
        {
            ICellStyle style;
            int key = (((int)headerMode) << 24) | (rowMode << 8) | ((int)align);

            if (dicStyles.TryGetValue(key, out style))
                return style;

            style = workbook.CreateCellStyle();
            style.Alignment = align;
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

        private void CheckEmptyFacilityInfo(ICollection<Facility> facilities, Dictionary<int, List<FacilityData>> dicFacilityDatas)
        {
            Dictionary<int, int> dicFacilityDataNos = new Dictionary<int, int>();

            foreach (KeyValuePair<int, List<FacilityData>> pair in dicFacilityDatas)
            {
                dicFacilityDataNos[pair.Key] = pair.Key;
            }

            foreach (Facility facility in facilities)
            {
                if (dicFacilityDataNos.ContainsKey(facility.fclty_sn) == false)
                    dicFacilityDatas[facility.fclty_sn] = new List<FacilityData>();
            }
        }

        protected override void WritePost(ISheet sheet, HSSFWorkbook workbook)
        {
            // 열크기 자동 조절
            sheet.AutoSizeColumn(0);
            sheet.AutoSizeColumn(2);
        }
    }
}
