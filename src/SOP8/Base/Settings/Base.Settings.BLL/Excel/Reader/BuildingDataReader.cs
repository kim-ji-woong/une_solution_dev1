using dnsExcelReport.Models;
using dnsExcelReport.Reader;
using System.Collections.Generic;
using dnsDapperDBUtil.DataAccessLayer.IDAL;
using Base.Model.Spatial;

namespace Base.Settings.BLL.Excel.Reader
{
    using Writer;

    class BuildingDataReader : ExcelReader
    {
        private int BuildingName_Index = 0;
        private int Text_Index = 1;
        private int WithDot_Index = 2;
        private int Indent_Index = 3;

        private IDataManager m_dataManager = null;
        private int? m_siteNo = null;

        public BuildingDataReader(string strFilePath, IDataManager dataManager, int? siteNo)
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

            Dictionary<int, Building> dicBuildings;
            Dictionary<string, Building> dicBuildingNames;

            // Key : Building Name
            Dictionary<string, List<BuildingData>> dicBuildingDatas = ReadBuildings(m_dataManager, m_siteNo, out dicBuildings, out dicBuildingNames, out strErrorMessage);

            if (dicBuildingDatas == null)
                return false;

            bool result = CheckData(dicBuildingDatas, dicBuildings, dicBuildingNames, sheetDatas, out strErrorMessage);

            if (result == false)
            {
                if (strErrorMessage != null)
                {
                    System.Diagnostics.Trace.WriteLine("BuildingReader.UpdateData Fail2 : " + strErrorMessage);
                }

                strErrorMessage = "잘못된 형식의 엑셀파일이거나 파일을 열수 없습니다.";
            }

            return result;
        }

        private bool CheckData(Dictionary<string, List<BuildingData>> dicBuildingDatas, Dictionary<int, Building> dicBuildings, Dictionary<string, Building> dicBuildingNames, List<SheetData> sheetDatas, out string strErrorMessage)
        {
            strErrorMessage = null;

            foreach (SheetData sheet in sheetDatas)
            {
                Dictionary<string, List<BuildingData>> dicSheetBuildingDatas = MakeSheetBuildingDatas(sheet, dicBuildings, dicBuildingNames);

                if (CheckData(dicBuildingDatas, dicSheetBuildingDatas, out strErrorMessage) == false)
                    return false;
            }

            return true;
        }

        private bool CheckData(Dictionary<string, List<BuildingData>> dicDBBuildingDatas, Dictionary<string, List<BuildingData>> dicSheetBuildingDatas, out string strErrorMessage)
        {
            List<BuildingData> removeDatas = new List<BuildingData>();
            List<BuildingData> newDatas = new List<BuildingData>();
            List<BuildingData> changedDatas = new List<BuildingData>();

            List<BuildingData> buildingDatas;
            Dictionary<int, List<int>> dicAliveDataID = new Dictionary<int, List<int>>();

            foreach (KeyValuePair<string, List<BuildingData>> pair in dicSheetBuildingDatas)
            {
                if (dicDBBuildingDatas.TryGetValue(pair.Key, out buildingDatas) == false)
                {
                    int nOrderIndex = 1;

                    foreach (BuildingData buildingData in pair.Value)
                    {
                        buildingData.ordr_indx = nOrderIndex++;
                        newDatas.Add(buildingData);
                    }

                    continue;
                }
                else
                {
                    int nOrderIndex = 1;

                    foreach (BuildingData buildingData in pair.Value)
                    {
                        BuildingData data = FindData(buildingDatas, buildingData, nOrderIndex++);

                        if (data == null)
                        {
                            buildingData.ordr_indx = nOrderIndex - 1;
                            newDatas.Add(buildingData);
                            SetAliveData(dicAliveDataID, buildingData, nOrderIndex - 1);
                        }
                        else
                        {
                            int result = CompareData(data, buildingData);

                            if (result != 0)
                                changedDatas.Add(data);

                            SetAliveData(dicAliveDataID, buildingData, nOrderIndex - 1);
                        }
                    }
                }
            }

            foreach (KeyValuePair<string, List<BuildingData>> pair in dicDBBuildingDatas)
            {
                foreach (BuildingData data in pair.Value)
                {
                    if (IsAliveData(data, dicAliveDataID) == false)
                        removeDatas.Add(data);
                }
            }

            IDataManager dataManager = m_dataManager.Clone();

            if (dataManager.BeginBatch(out strErrorMessage) == false)
            {
                strErrorMessage = "시스템 데이터베이스의 트랜잭션을 시작할 수 없습니다.";
                return false;
            }

            if (RemoveData(dataManager, removeDatas, out strErrorMessage) == false)
            {
                string strTemp;
                dataManager.BatchRollback(out strTemp);

                strErrorMessage = "CheckData, RemoveData Error : " + strErrorMessage;
                return false;
            }

            if (ChangeData(dataManager, changedDatas, out strErrorMessage) == false)
            {
                string strTemp;
                dataManager.BatchRollback(out strTemp);

                strErrorMessage = "CheckData, ChangeData Error : " + strErrorMessage;
                return false;
            }

            if (AddData(dataManager, newDatas, out strErrorMessage) == false)
            {
                string strTemp;
                dataManager.BatchRollback(out strTemp);

                strErrorMessage = "CheckData, AddData Error : " + strErrorMessage;
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

        // Key : Building Name
        private Dictionary<string, List<BuildingData>> MakeSheetBuildingDatas(SheetData sheetData, Dictionary<int, Building> dicBuildings, Dictionary<string, Building> dicBuildingNames)
        {
            // Key : Building Name
            Dictionary<string, List<BuildingData>> dicSheetBuildingDatas = new Dictionary<string, List<BuildingData>>();

            int min = 1, max = 0;

            foreach (KeyValuePair<int, string> pair in sheetData.Titles)
            {
                if (pair.Value == BuildingDataWriter.Column_BuildingName)
                    BuildingName_Index = pair.Key;
                else if (pair.Value == BuildingDataWriter.Column_Text)
                    Text_Index = pair.Key;
                else if (pair.Value == BuildingDataWriter.Column_WithDot)
                    WithDot_Index = pair.Key;
                else if (pair.Value == BuildingDataWriter.Column_Indent)
                    Indent_Index = pair.Key;

                if (min > max)
                    min = max = pair.Key;

                if (min > pair.Key)
                    min = pair.Key;

                if (max < pair.Key)
                    max = pair.Key;
            }

            if (min > max)
                return dicSheetBuildingDatas;

            int maxColumnCount = 0;
            int[] arrColumnCount = GetColumnCounts(sheetData, min, max, out maxColumnCount);

            if (arrColumnCount == null)
                return dicSheetBuildingDatas;

            List<string> datas;
            string strPrevBuildingName = null;
            bool withDot;
            int indent = 0;

            for (int j = 0; j < maxColumnCount; j++)
            {
                string strBuildingName = null;
                string strText = null;
                string strWithDot = null;
                string strIndent = null;

                for (int i = min; i <= max; i++)
                {
                    if (sheetData.ColumnDatas.TryGetValue(i, out datas))
                    {
                        if (arrColumnCount[i] > j)
                        {
                            if (i == BuildingName_Index)
                                strBuildingName = datas[j];
                            else if (i == Text_Index)
                                strText = datas[j];
                            else if (i == WithDot_Index)
                                strWithDot = datas[j];
                            else if (i == Indent_Index)
                                strIndent = datas[j];
                        }
                    }
                }

                if (strBuildingName == null)
                    strBuildingName = strPrevBuildingName;

                if (strBuildingName == null)
                    continue;

                if (strText == null)
                    continue;

                if (strWithDot == null)
                {
                    strWithDot = "0";
                    //continue;
                }

                strPrevBuildingName = strBuildingName;

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

                Building building;

                if (dicBuildingNames.TryGetValue(strBuildingName, out building) == false)
                    continue;

                BuildingData data = new BuildingData();
                data.buld_sn = building.buld_sn;
                data.value = strText;
                data.wdt = withDot;

                if (strIndent != null)
                    data.indent_level = indent;

                List<BuildingData> buildingDatas;

                if (dicSheetBuildingDatas.TryGetValue(strBuildingName, out buildingDatas) == false)
                {
                    buildingDatas = new List<BuildingData>();
                    dicSheetBuildingDatas[strBuildingName] = buildingDatas;
                }

                buildingDatas.Add(data);
            }

            return dicSheetBuildingDatas;
        }

        // Key : Building Name
        private Dictionary<string, List<BuildingData>> ReadBuildings(IDataManager dataManager, int? siteNo, out Dictionary<int, Building> dicBuildings, out Dictionary<string, Building> dicBuildingNames, out string strErrorMessage)
        {
            dicBuildings = null;
            dicBuildingNames = new Dictionary<string, Building>();

            string strCondition = null;

            if (siteNo != null)
            {
                strCondition = string.Format("{0} in (Select {1} from {2} where {3} = {4})",
                    Building.Fields.buld_group_sn,
                    BuildingGroup.Fields.buld_group_sn,
                    BuildingGroup.TableName,
                    BuildingGroup.Fields.site_sn,
                    (int)siteNo);
            }

            IEnumerable<Building> buildings = dataManager.GetSelect().Select<Building>(strCondition, out strErrorMessage);

            if (buildings == null)
                return null;

            string strBuildingNos = "-1";

            foreach (Building _building in buildings)
            {
                if (strBuildingNos == "-1")
                    strBuildingNos = _building.buld_sn.ToString();
                else
                    strBuildingNos += "," + _building.buld_sn.ToString();
            }

            string strAdditionalConditions = string.Format("{0} in ({1})", BuildingData.Fields.buld_sn, strBuildingNos);

            IEnumerable<BuildingData> datas = dataManager.GetSelect().Select<BuildingData>(strAdditionalConditions, out strErrorMessage);

            if (datas == null)
                return null;

            Building building;
            dicBuildings = ToDictionary(buildings);

            foreach (KeyValuePair<int, Building> pair in dicBuildings)
            {
                dicBuildingNames[pair.Value.name] = pair.Value;
            }

            List<BuildingData> buildingDatas;
            Dictionary<string, List<BuildingData>> dicBuildingDatas = new Dictionary<string, List<BuildingData>>();

            foreach (BuildingData data in datas)
            {
                if (dicBuildings.TryGetValue(data.buld_sn, out building))
                {
                    if (dicBuildingDatas.TryGetValue(building.name, out buildingDatas) == false)
                    {
                        buildingDatas = new List<BuildingData>();
                        dicBuildingDatas[building.name] = buildingDatas;
                    }

                    buildingDatas.Add(data);
                }
            }

            foreach (KeyValuePair<string, List<BuildingData>> pair in dicBuildingDatas)
            {
                pair.Value.Sort();
            }

            return dicBuildingDatas;
        }

        private Dictionary<int, Building> ToDictionary(IEnumerable<Building> buildings)
        {
            Dictionary<int, Building> dicBuildings = new Dictionary<int, Building>();

            foreach (var building in buildings)
            {
                dicBuildings[building.buld_sn] = building;
            }

            return dicBuildings;
        }

        private BuildingData FindData(List<BuildingData> datas, BuildingData buildingData, int nOrderIndex)
        {
            foreach (BuildingData data in datas)
            {
                if (data.buld_sn == buildingData.buld_sn && data.ordr_indx == nOrderIndex)
                {
                    datas.Remove(data);
                    return data;
                }
            }

            return null;
        }

        private void SetAliveData(Dictionary<int, List<int>> dicAliveDataID, BuildingData buildingData, int nOrderIndex)
        {
            List<int> orderIndices;

            if (dicAliveDataID.TryGetValue(buildingData.buld_sn, out orderIndices) == false)
            {
                orderIndices = new List<int>();
                dicAliveDataID[buildingData.buld_sn] = orderIndices;
            }

            orderIndices.Add(nOrderIndex);
        }

        // Return 값 :
        //              0 => 동일하다.
        //              1 => 다르다.
        private int CompareData(BuildingData dbData, BuildingData sheetData)
        {
            if (dbData.value != sheetData.value)
                return SetData(dbData, sheetData, 1);
            if (dbData.wdt != sheetData.wdt)
                return SetData(dbData, sheetData, 1);
            if (dbData.indent_level != sheetData.indent_level)
                return SetData(dbData, sheetData, 1);

            return 0;
        }

        private int SetData(BuildingData trg, BuildingData src, int result)
        {
            trg.value = src.value;
            trg.wdt = src.wdt;
            trg.indent_level = src.indent_level;
            return result;
        }

        private bool IsAliveData(BuildingData data, Dictionary<int, List<int>> dicAliveDataID)
        {
            List<int> orderIndices;

            if (dicAliveDataID.TryGetValue(data.buld_sn, out orderIndices))
            {
                foreach (int order in orderIndices)
                {
                    if (data.ordr_indx == order)
                        return true;
                }
            }

            return false;
        }

        private bool AddData(IDataManager dataManager, List<BuildingData> newDatas, out string strErrorMessage)
        {
            strErrorMessage = null;

            foreach (BuildingData data in newDatas)
            {
                if (dataManager.GetCreate().Insert<BuildingData>(data, out strErrorMessage) == false)
                    return false;
            }

            return true;
        }

        private bool ChangeData(IDataManager dataManager, List<BuildingData> changedDatas, out string strErrorMessage)
        {
            strErrorMessage = null;

            foreach (BuildingData data in changedDatas)
            {
                if (dataManager.GetUpdate().Update<BuildingData>(data, null, out strErrorMessage) == false)
                    return false;
            }

            return true;
        }

        private bool RemoveData(IDataManager dataManager, List<BuildingData> removeDatas, out string strErrorMessage)
        {
            strErrorMessage = null;

            foreach (BuildingData data in removeDatas)
            {
                if (dataManager.GetDelete().Delete<BuildingData>(data, null, out strErrorMessage) == false)
                    return false;
            }

            return true;
        }
    }
}
