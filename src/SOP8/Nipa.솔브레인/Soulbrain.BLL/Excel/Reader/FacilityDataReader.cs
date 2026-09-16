using dnsExcelReport.Models;
using dnsExcelReport.Reader;
using System.Collections.Generic;
using dnsDapperDBUtil.DataAccessLayer.IDAL;
using Base.Model.Spatial;
using Soulbrain.Model.Facility;

namespace Soulbrain.BLL.Excel.Reader
{
    using Writer;

    class FacilityDataReader : ExcelReader
    {
        private int FacilityNo_Index = 0;
        private int FacilityName_Index = 1;
        private int Text_Index = 2;
        private int WithDot_Index = 3;
        private int Indent_Index = 4;

        private IDataManager m_dataManager = null;
        private int? m_siteNo = null;

        public FacilityDataReader(string strFilePath, IDataManager dataManager, int? siteNo)
            : base(strFilePath)
        {
            m_dataManager = dataManager;
            m_siteNo = siteNo;
        }

        protected override bool UpdateData(List<SheetData> sheetDatas, object parameter, out string strErrorMessage)
        {
            if (m_dataManager == null)
            {
                strErrorMessage = "DB에 연결할 수 없습니다.";
                return false;
            }

            // Key : ModelName
            Dictionary<string, Facility> dicFacilityModelNames;
            // Key : FacilityName
            Dictionary<string, Facility> dicFacilityFacilityNames;

            // Key : Building Name
            Dictionary<string, Building> dicBuildings = ReadFacilities(m_dataManager, m_siteNo, out dicFacilityModelNames, out dicFacilityFacilityNames, out strErrorMessage);

            if (dicBuildings == null)
            {
                if (strErrorMessage != null)
                {
                    System.Diagnostics.Trace.WriteLine("FacilityInfoReader.UpdateData Fail : " + strErrorMessage);
                }

                strErrorMessage = "설비 DataBase에 데이터 오류가 존재합니다.\r\n시스템 관리자에게 문의해 주세요.";
                return false;
            }

            bool result = CheckData(dicBuildings, dicFacilityModelNames, dicFacilityFacilityNames, sheetDatas, out strErrorMessage);

            if (result == false)
            {
                if (strErrorMessage != null)
                {
                    System.Diagnostics.Trace.WriteLine("FacilityInfoReader.UpdateData Fail2 : " + strErrorMessage);
                }

                strErrorMessage = "잘못된 형식의 엑셀파일이거나 파일을 열수 없습니다.";
            }

            return result;
        }

        private bool CheckData(Dictionary<string, Building> dicBuildings, Dictionary<string, Facility> dicFacilityModelNames, Dictionary<string, Facility> dicFacilityFacilityNames, List<SheetData> sheetDatas, out string strErrorMessage)
        {
            strErrorMessage = null;
            Building building;

            foreach (SheetData sheet in sheetDatas)
            {
                if (dicBuildings.TryGetValue(sheet.SheetName, out building))
                {
                    if (CheckData(building, dicFacilityModelNames, dicFacilityFacilityNames, sheet, out strErrorMessage) == false)
                        return false;
                }
            }

            return true;
        }

        private bool CheckData(Building building, Dictionary<string, Facility> dicFacilityModelNames, Dictionary<string, Facility> dicFacilityFacilityNames, SheetData sheetData, out string strErrorMessage)
        {
            strErrorMessage = null;

            // Key : Facility No
            Dictionary<int, List<FacilityData>> dicSheetFacilityDatas = MakeSheetFacilityDatas(sheetData, dicFacilityModelNames, dicFacilityFacilityNames);

            IDataManager dataManager = m_dataManager.Clone();

            if (dataManager.BeginBatch(out strErrorMessage) == false)
            {
                strErrorMessage = "시스템 데이터베이스의 트랜잭션을 시작할 수 없습니다.";
                return false;
            }

            if (DeleteDatas(dataManager, building, out strErrorMessage) == false)
            {
                string strTemp;
                dataManager.BatchRollback(out strTemp);
                return false;
            }

            if (AddDatas(dataManager, dicSheetFacilityDatas, out strErrorMessage) == false)
            {
                string strTemp;
                dataManager.BatchRollback(out strTemp);
                return false;
            }

            if (dataManager.BatchCommit(out strErrorMessage) == false)
            {
                string strTemp;
                dataManager.BatchRollback(out strTemp);

                strErrorMessage = "시스템 데이터베이스의 트랜잭션을 정상적으로 종료하는데 실패하였습니다.";
                return false;
            }

            return true;
        }

        private bool AddDatas(IDataManager dataManager, Dictionary<int, List<FacilityData>> dicFacilityDatas, out string strErrorMessage)
        {
            strErrorMessage = null;
            List<FacilityData> facilityDatas = new List<FacilityData>();

            foreach (KeyValuePair<int, List<FacilityData>> pair in dicFacilityDatas)
            {
                facilityDatas.AddRange(pair.Value);
            }

            if (facilityDatas.Count == 0)
                return true;

            return dataManager.GetCreate().Insert<FacilityData>(facilityDatas, out strErrorMessage);
        }

        private bool DeleteDatas(IDataManager dataManager, Building building, out string strErrorMessage)
        {
            string strCondition = string.Format("{0} in (Select {1} from {2} where {3} in (Select {4} from {5} where {6} = {7}))",
                FacilityData.Fields.fclty_sn,
                Facility.Fields.fclty_sn,
                Facility.TableName,
                Facility.Fields.zone_sn,
                Zone.Fields.zone_sn,
                Zone.TableName,
                Zone.Fields.buld_sn,
                building.buld_sn);

            return dataManager.GetDelete().Delete<FacilityData>(strCondition, out strErrorMessage);
        }

        // Key : Facility No
        private Dictionary<int, List<FacilityData>> MakeSheetFacilityDatas(SheetData sheetData, Dictionary<string, Facility> dicFacilityModelNames, Dictionary<string, Facility> dicFacilityFacilityNames)
        {
            int min = 1, max = 0;

            foreach (KeyValuePair<int, string> pair in sheetData.Titles)
            {
                if (pair.Value == FacilityDataWriter.Column_FacilityNo)
                    FacilityNo_Index = pair.Key;
                else if (pair.Value == FacilityDataWriter.Column_FacilityName)
                    FacilityName_Index = pair.Key;
                else if (pair.Value == FacilityDataWriter.Column_Text)
                    Text_Index = pair.Key;
                else if (pair.Value == FacilityDataWriter.Column_WithDot)
                    WithDot_Index = pair.Key;
                else if (pair.Value == FacilityDataWriter.Column_Indent)
                    Indent_Index = pair.Key;

                if (min > max)
                    min = max = pair.Key;

                if (min > pair.Key)
                    min = pair.Key;

                if (max < pair.Key)
                    max = pair.Key;
            }

            List<string> datas;
            Dictionary<int, List<FacilityData>> dicSheetInfoDatas = new Dictionary<int, List<FacilityData>>();

            int maxColumnCount = 0;
            int[] arrColumnCount = GetColumnCounts(sheetData, min, max, out maxColumnCount);

            if (arrColumnCount == null)
                return dicSheetInfoDatas;

            string strPrevModelName = null;
            string strPrevFacilityName = null;
            bool withDot;
            int indent = 0;

            for (int j = 0; j < maxColumnCount; j++)
            {
                string strModelName = null;
                string strFacilityName = null;
                string strText = null;
                string strWithDot = null;
                string strIndent = null;

                for (int i = min; i <= max; i++)
                {
                    if (sheetData.ColumnDatas.TryGetValue(i, out datas))
                    {
                        if (arrColumnCount[i] > j)
                        {
                            if (i == FacilityNo_Index)
                                strModelName = datas[j];
                            else if (i == FacilityName_Index)
                                strFacilityName = datas[j];
                            else if (i == Text_Index)
                                strText = datas[j];
                            else if (i == WithDot_Index)
                                strWithDot = datas[j];
                            else if (i == Indent_Index)
                                strIndent = datas[j];
                        }
                    }
                }

                if (strModelName == null)
                    strModelName = strPrevModelName;

                if (strFacilityName == null)
                    strFacilityName = strPrevFacilityName;

                if (strModelName == null || strFacilityName == null)
                    continue;

                if (strText == null)
                    continue;

                if (strWithDot == null)
                {
                    strWithDot = "0";
                    //continue;
                }

                string strLower = strWithDot.ToLower();

                if (strWithDot == "1" || strLower == "true")
                    withDot = true;
                else if (strWithDot == "0" || strLower == "false")
                    withDot = false;
                else
                    continue;

                if (strIndent != null)
                {
                    if (int.TryParse(strIndent, out indent) == false)
                        continue;
                }

                Facility facility;

                if (dicFacilityModelNames.TryGetValue(strModelName.Trim(), out facility) || dicFacilityFacilityNames.TryGetValue(strFacilityName.Trim(), out facility))
                {
                    FacilityData data = new FacilityData();
                    data.fclty_sn = facility.fclty_sn;
                    data.value = strText;
                    data.wdt = withDot;

                    if (strIndent != null)
                        data.indent_level = indent;

                    List<FacilityData> facilityDatas;

                    if (dicSheetInfoDatas.TryGetValue(facility.fclty_sn, out facilityDatas) == false)
                    {
                        facilityDatas = new List<FacilityData>();
                        dicSheetInfoDatas[facility.fclty_sn] = facilityDatas;
                    }

                    facilityDatas.Add(data);

                    strPrevModelName = strModelName;
                    strPrevFacilityName = strFacilityName;
                }
            }

            foreach (KeyValuePair<int, List<FacilityData>> pair in dicSheetInfoDatas)
            {
                int dataCount = pair.Value.Count;

                for (int i=0;i<dataCount;i++)
                {
                    FacilityData data = pair.Value[i];
                    data.ordr_indx = i + 1;

                    if (i == 0)
                        data.name = "취급물질(대표)";
                    else if (i == 1)
                        data.name = "담당자";
                    else if (i == 2)
                        data.name = "연락처";
                }
            }

            return dicSheetInfoDatas;
        }

        // Key : Building Name
        private Dictionary<string, Building> ReadFacilities(IDataManager dataManager, int? siteNo, out Dictionary<string, Facility> dicFacilityModelNames, out Dictionary<string, Facility> dicFacilityFacilityNames, out string strErrorMessage)
        {
            dicFacilityModelNames = null;
            dicFacilityFacilityNames = null;

            string strCondition = null;

            if (siteNo != null)
                strCondition = string.Format("{0} = {1}", BuildingGroup.Fields.site_sn, (int)siteNo);

            IEnumerable<BuildingGroup> buildingGroups = dataManager.GetSelect().Select<BuildingGroup>(strCondition, out strErrorMessage);

            if (buildingGroups == null)
                return null;

            string strBuildingGroupNos = "-1";

            foreach (BuildingGroup group in buildingGroups)
            {
                if (strBuildingGroupNos == "-1")
                    strBuildingGroupNos = group.buld_group_sn.ToString();
                else
                    strBuildingGroupNos += "," + group.buld_group_sn.ToString();
            }

            string strAdditionalConditions = string.Format("{0} in ({1})", Building.Fields.buld_group_sn, strBuildingGroupNos);

            IEnumerable<Building> buildings = dataManager.GetSelect().Select<Building>(strAdditionalConditions, out strErrorMessage);

            if (buildings == null)
                return null;

            string strBuildingNos = "-1";
            Dictionary<string, Building> dicBuildings = new Dictionary<string, Building>();

            foreach (Building building in buildings)
            {
                if (strBuildingNos == "-1")
                    strBuildingNos = building.buld_sn.ToString();
                else
                    strBuildingNos += "," + building.buld_sn.ToString();

                dicBuildings[building.name] = building;
            }

            strCondition = string.Format("{0} in (Select {1} from {2} where {3} in ({4}))",
                Facility.Fields.zone_sn,
                Zone.Fields.zone_sn,
                Zone.TableName,
                Zone.Fields.buld_sn,
                strBuildingNos);

            IEnumerable<Facility> facilities = dataManager.GetSelect().Select<Facility>(strCondition, out strErrorMessage);

            if (facilities == null)
                return null;

            dicFacilityModelNames = new Dictionary<string, Facility>();
            dicFacilityFacilityNames = new Dictionary<string, Facility>();

            foreach (Facility facility in facilities)
            {
                dicFacilityFacilityNames[facility.fclty_name] = facility;
                dicFacilityModelNames[facility.model_name] = facility;
            }

            return dicBuildings;
        }
    }
}
