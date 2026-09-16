using dnsExcelReport.Models;
using dnsExcelReport.Writer;
using dnsDapperDBUtil.DataAccessLayer.IDAL;
using System.Collections.Generic;
using NPOI.HSSF.UserModel;
using NPOI.SS.UserModel;
using Base.Model.Spatial;

namespace Base.Settings.BLL.Excel.Writer
{
    class BuildingDataWriter : ExcelWriter
    {
        public const string Column_BuildingName = "건물";
        public const string Column_Text = "Text";
        public const string Column_WithDot = "WithDot";
        public const string Column_Indent = "들여쓰기";

        private const int NormalFontSize = 11;
        private const int RowHeight = 22;

        private IDataManager m_dataManager = null;
        private int? m_buildingNo = null;
        private int? m_siteNo = null;

        public BuildingDataWriter(IDataManager dataManager, int? buildingNo, int? siteNo)
        {
            m_dataManager = dataManager;
            m_buildingNo = buildingNo;
            m_siteNo = siteNo;
        }

        public static string GetColumnName(int index)
        {
            if (index == 0)
                return BuildingDataWriter.Column_BuildingName;
            else if (index == 1)
                return BuildingDataWriter.Column_Text;
            else if (index == 2)
                return BuildingDataWriter.Column_WithDot;
            else if (index == 3)
                return BuildingDataWriter.Column_Indent;

            return null;
        }

        public static int GetColumnCount()
        {
            return 4;
        }

        protected override string GetSubject()
        {
            return "건물 정보";
        }

        protected override ICollection<SheetData> ReadSheetDatas(HSSFWorkbook workbook, out string strErrorMessage)
        {
            if (m_dataManager == null)
            {
                strErrorMessage = "DB에 연결할 수 없습니다.";
                return null;
            }

            Dictionary<int, Building> dicBuildings;
            Dictionary<string, Building> dicBuildingNames;

            // Key : Building Name
            Dictionary<string, List<BuildingData>> dicBuildingDatas = ReadBuildings(m_dataManager, m_buildingNo, m_siteNo, out dicBuildings, out dicBuildingNames, out strErrorMessage);

            if (dicBuildingDatas == null)
                return null;

            int buildingDataCount = GetBuildingDataCount(dicBuildingDatas);

            CheckEmptyBuildingData(dicBuildings.Values, dicBuildingDatas);

            Building building;
            SheetData sheetData = null;

            foreach (KeyValuePair<string, List<BuildingData>> pair in dicBuildingDatas)
            {
                string strBuildingName = pair.Key;
                List<BuildingData> datas = pair.Value;
                datas.Sort();

                if (sheetData == null)
                {
                    sheetData = new SheetData("data");
                    SetTitles(workbook, sheetData, buildingDataCount == 0);
                }

                if (dicBuildingNames.TryGetValue(strBuildingName, out building) == false)
                    continue;

                int nCount = datas.Count;

                if (nCount == 0)
                    SetColumnDatas(sheetData, building.name, null, null, null);
                else
                {
                    SetColumnDatas(sheetData, building.name, datas[0].value, datas[0].wdt, datas[0].indent_level);

                    for (int i = 1; i < nCount; i++)
                    {
                        SetColumnDatas(sheetData, null, datas[i].value, datas[i].wdt, datas[i].indent_level);
                    }
                }
            }

            List<SheetData> sheetDatas = new List<SheetData>();

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

                sheetDatas.Add(sheetData);
            }

            return sheetDatas;
        }

        private int GetBuildingDataCount(Dictionary<string, List<BuildingData>> dicBuildingDatas)
        {
            int count = 0;

            foreach (KeyValuePair<string, List<BuildingData>> pair in dicBuildingDatas)
            {
                count += pair.Value.Count;
            }

            return count;
        }

        private void SetColumnDatas(SheetData sheetData, string strBuildingGroupName, string strValue, bool? withDot, int? indent)
        {
            List<string> columnDatas;

            if (sheetData.ColumnDatas.TryGetValue(0, out columnDatas))
            {
                if (strBuildingGroupName != null)
                    columnDatas.Add(strBuildingGroupName);
                else
                    columnDatas.Add(null);
            }

            if (sheetData.ColumnDatas.TryGetValue(1, out columnDatas))
            {
                if (strValue != null)
                    columnDatas.Add(strValue);
                else
                    columnDatas.Add(null);
            }

            if (sheetData.ColumnDatas.TryGetValue(2, out columnDatas))
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

            if (sheetData.ColumnDatas.TryGetValue(3, out columnDatas))
            {
                if (indent != null)
                    columnDatas.Add(((int)indent).ToString());
                else
                    columnDatas.Add(null);
            }
        }

        private void SetTitles(HSSFWorkbook workbook, SheetData sheetData, bool isEmpty)
        {
            sheetData.Titles[0] = BuildingDataWriter.Column_BuildingName;
            sheetData.Titles[1] = BuildingDataWriter.Column_Text;
            sheetData.Titles[2] = BuildingDataWriter.Column_WithDot;
            sheetData.Titles[3] = BuildingDataWriter.Column_Indent;

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

            HorizontalAlignment align = (columnIndex == 1) ? HorizontalAlignment.Left : HorizontalAlignment.Center;

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

        private void CheckEmptyBuildingData(ICollection<Building> buildings, Dictionary<string, List<BuildingData>> dicBuildingDatas)
        {
            List<BuildingData> buildingDatas;

            foreach (Building building in buildings)
            {
                if (dicBuildingDatas.TryGetValue(building.name, out buildingDatas) == false)
                    dicBuildingDatas[building.name] = new List<BuildingData>();
            }
        }

        // Key : Building Name
        public static Dictionary<string, List<BuildingData>> ReadBuildings(IDataManager dataManager, int? buildingNo, int? siteNo, out Dictionary<int, Building> dicBuildings, out Dictionary<string, Building> dicBuildingNames, out string strErrorMessage)
        {
            strErrorMessage = null;
            dicBuildings = null;
            dicBuildingNames = null;

            string strCondition = null;

            if (buildingNo != null)
                strCondition = string.Format("{0} = {1}", Building.Fields.buld_sn, (int)buildingNo);
            else if (siteNo != null)
                strCondition = string.Format("{0} in (Select {1} from {2} where {3} = {4})", Building.Fields.buld_group_sn, BuildingGroup.Fields.buld_group_sn, BuildingGroup.TableName, BuildingGroup.Fields.site_sn, (int)siteNo);

            IEnumerable<Building> buildings = dataManager.GetSelect().Select<Building>(strCondition, out strErrorMessage);

            if (buildings == null)
                return null;

            dicBuildings = new Dictionary<int, Building>();
            dicBuildingNames = new Dictionary<string, Building>();

            foreach (var building in buildings)
            {
                dicBuildings[building.buld_sn] = building;
                dicBuildingNames[building.name] = building;
            }

            strCondition = null;

            if (buildingNo != null)
            {
                strCondition = string.Format("{0} = {1}", BuildingData.Fields.buld_sn, (int)buildingNo);
            }
            else if (siteNo != null)
            {
                strCondition = string.Format("{0} in (Select {1} from {2} where {3} in (Select {4} from {5} where {6} = {7}))",
                    BuildingData.Fields.buld_sn,
                    Building.Fields.buld_sn,
                    Building.TableName,
                    Building.Fields.buld_group_sn,
                    BuildingGroup.Fields.buld_group_sn,
                    BuildingGroup.TableName,
                    BuildingGroup.Fields.site_sn,
                    (int)siteNo);
            }

            IEnumerable<BuildingData> buildingDatas = dataManager.GetSelect().Select<BuildingData>(strCondition, out strErrorMessage);

            if (buildingDatas == null)
                return null;

            Dictionary<string, List<BuildingData>> dicBuildingDatas = new Dictionary<string, List<BuildingData>>();
            List<BuildingData> _buildingDatas = null;

            foreach (var buildingData in buildingDatas)
            {
                Building building;

                if (dicBuildings.TryGetValue(buildingData.buld_sn, out building))
                {
                    if (dicBuildingDatas.TryGetValue(building.name, out _buildingDatas) == false)
                    {
                        _buildingDatas = new List<BuildingData>();
                        dicBuildingDatas[building.name] = _buildingDatas;
                    }

                    _buildingDatas.Add(buildingData);
                }
            }

            return dicBuildingDatas;
        }

        protected override void WritePost(ISheet sheet, HSSFWorkbook workbook)
        {
            // 열크기 자동 조절
            sheet.AutoSizeColumn(1);
        }
    }
}
