using dnsExcelReport.Models;
using dnsExcelReport.Reader;
using System.Collections.Generic;
using dnsDapperDBUtil.DataAccessLayer.IDAL;
using Base.Model.Spatial;

namespace Base.Settings.BLL.Excel.Reader
{
    using Writer;

    class BuildingGroupDataReader : ExcelReader
    {
        private int BuildingGroup_Index = 0;
        private int Text_Index = 1;
        private int WithDot_Index = 2;
        private int Indent_Index = 3;

        private IDataManager m_dataManager = null;
        private int? m_siteNo = null;

        public BuildingGroupDataReader(string strFilePath, IDataManager dataManager, int? siteNo)
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

            Dictionary<int, BuildingGroup> dicBuildingGroups;
            Dictionary<string, BuildingGroup> dicBuildingGroupNames;

            // Key : BuildingGroup Name
            Dictionary<string, List<BuildingGroupData>> dicBuildingGroupDatas = ReadBuildingGroups(m_dataManager, m_siteNo, out dicBuildingGroups, out dicBuildingGroupNames, out strErrorMessage);

            if (dicBuildingGroupDatas == null)
                return false;

            bool result = CheckData(dicBuildingGroupDatas, dicBuildingGroups, dicBuildingGroupNames, sheetDatas, out strErrorMessage);

            if (result == false)
            {
                if (strErrorMessage != null)
                {
                    System.Diagnostics.Trace.WriteLine("BuildingGroupReader.UpdateData Fail2 : " + strErrorMessage);
                }

                strErrorMessage = "잘못된 형식의 엑셀파일이거나 파일을 열수 없습니다.";
            }

            return result;
        }

        private bool CheckData(Dictionary<string, List<BuildingGroupData>> dicBuildingGroupDatas, Dictionary<int, BuildingGroup> dicBuildingGroups, Dictionary<string, BuildingGroup> dicBuildingGroupNames, List<SheetData> sheetDatas, out string strErrorMessage)
        {
            strErrorMessage = null;

            foreach (SheetData sheet in sheetDatas)
            {
                Dictionary<string, List<BuildingGroupData>> dicSheetBuildingGroupDatas = MakeSheetBuildingGroupDatas(sheet, dicBuildingGroups, dicBuildingGroupNames);

                if (CheckData(dicBuildingGroupDatas, dicSheetBuildingGroupDatas, out strErrorMessage) == false)
                    return false;
            }

            return true;
        }

        private bool CheckData(Dictionary<string, List<BuildingGroupData>> dicDBBuildingGroupDatas, Dictionary<string, List<BuildingGroupData>> dicSheetBuildingGroupDatas, out string strErrorMessage)
        {
            List<BuildingGroupData> removeDatas = new List<BuildingGroupData>();
            List<BuildingGroupData> newDatas = new List<BuildingGroupData>();
            List<BuildingGroupData> changedDatas = new List<BuildingGroupData>();

            List<BuildingGroupData> buildingGroupDatas;
            Dictionary<int, List<int>> dicAliveDataID = new Dictionary<int, List<int>>();

            foreach (KeyValuePair<string, List<BuildingGroupData>> pair in dicSheetBuildingGroupDatas)
            {
                if (dicDBBuildingGroupDatas.TryGetValue(pair.Key, out buildingGroupDatas) == false)
                {
                    int nOrderIndex = 1;

                    foreach (BuildingGroupData buildingGroupData in pair.Value)
                    {
                        buildingGroupData.ordr_indx = nOrderIndex++;
                        newDatas.Add(buildingGroupData);
                    }

                    continue;
                }
                else
                {
                    int nOrderIndex = 1;

                    foreach (BuildingGroupData buildingGroupData in pair.Value)
                    {
                        BuildingGroupData data = FindData(buildingGroupDatas, buildingGroupData, nOrderIndex++);

                        if (data == null)
                        {
                            buildingGroupData.ordr_indx = nOrderIndex - 1;
                            newDatas.Add(buildingGroupData);
                            SetAliveData(dicAliveDataID, buildingGroupData, nOrderIndex - 1);
                        }
                        else
                        {
                            int result = CompareData(data, buildingGroupData);

                            if (result != 0)
                                changedDatas.Add(data);

                            SetAliveData(dicAliveDataID, buildingGroupData, nOrderIndex - 1);
                        }
                    }
                }
            }

            foreach (KeyValuePair<string, List<BuildingGroupData>> pair in dicDBBuildingGroupDatas)
            {
                foreach (BuildingGroupData data in pair.Value)
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

        // Key : BuildingGroup Name
        private Dictionary<string, List<BuildingGroupData>> MakeSheetBuildingGroupDatas(SheetData sheetData, Dictionary<int, BuildingGroup> dicBuildingGroups, Dictionary<string, BuildingGroup> dicBuildingGroupNames)
        {
            // Key : BuildingGroup Name
            Dictionary<string, List<BuildingGroupData>> dicSheetBuildingGroupDatas = new Dictionary<string, List<BuildingGroupData>>();

            int min = 1, max = 0;

            foreach (KeyValuePair<int, string> pair in sheetData.Titles)
            {
                if (pair.Value == BuildingGroupDataWriter.Column_BuildingGroupName)
                    BuildingGroup_Index = pair.Key;
                else if (pair.Value == BuildingGroupDataWriter.Column_Text)
                    Text_Index = pair.Key;
                else if (pair.Value == BuildingGroupDataWriter.Column_WithDot)
                    WithDot_Index = pair.Key;
                else if (pair.Value == BuildingGroupDataWriter.Column_Indent)
                    Indent_Index = pair.Key;

                if (min > max)
                    min = max = pair.Key;

                if (min > pair.Key)
                    min = pair.Key;

                if (max < pair.Key)
                    max = pair.Key;
            }

            if (min > max)
                return dicSheetBuildingGroupDatas;

            int maxColumnCount = 0;
            int[] arrColumnCount = GetColumnCounts(sheetData, min, max, out maxColumnCount);

            if (arrColumnCount == null)
                return dicSheetBuildingGroupDatas;

            List<string> datas;
            string strPrevBuildingGroupName = null;
            bool withDot;
            int indent = 0;

            for (int j = 0; j < maxColumnCount; j++)
            {
                string strBuildingGroupName = null;
                string strText = null;
                string strWithDot = null;
                string strIndent = null;

                for (int i = min; i <= max; i++)
                {
                    if (sheetData.ColumnDatas.TryGetValue(i, out datas))
                    {
                        if (arrColumnCount[i] > j)
                        {
                            if (i == BuildingGroup_Index)
                                strBuildingGroupName = datas[j];
                            else if (i == Text_Index)
                                strText = datas[j];
                            else if (i == WithDot_Index)
                                strWithDot = datas[j];
                            else if (i == Indent_Index)
                                strIndent = datas[j];
                        }
                    }
                }

                if (strBuildingGroupName == null)
                    strBuildingGroupName = strPrevBuildingGroupName;

                if (strBuildingGroupName == null)
                    continue;

                if (strText == null)
                    continue;

                if (strWithDot == null)
                {
                    strWithDot = "0";
                    //continue;
                }

                strPrevBuildingGroupName = strBuildingGroupName;

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

                BuildingGroup buildingGroup;

                if (dicBuildingGroupNames.TryGetValue(strBuildingGroupName, out buildingGroup) == false)
                    continue;

                BuildingGroupData data = new BuildingGroupData();
                data.buld_group_sn = buildingGroup.buld_group_sn;
                data.value = strText;
                data.wdt = withDot;

                if (strIndent != null)
                    data.indent_level = indent;

                List<BuildingGroupData> buildingGroupDatas;

                if (dicSheetBuildingGroupDatas.TryGetValue(strBuildingGroupName, out buildingGroupDatas) == false)
                {
                    buildingGroupDatas = new List<BuildingGroupData>();
                    dicSheetBuildingGroupDatas[strBuildingGroupName] = buildingGroupDatas;
                }

                buildingGroupDatas.Add(data);
            }

            return dicSheetBuildingGroupDatas;
        }

        // Key : BuildingGroup Name
        private Dictionary<string, List<BuildingGroupData>> ReadBuildingGroups(IDataManager dataManager, int? siteNo, out Dictionary<int, BuildingGroup> dicBuildingGroups, out Dictionary<string, BuildingGroup> dicBuildingGroupNames, out string strErrorMessage)
        {
            dicBuildingGroups = null;
            dicBuildingGroupNames = new Dictionary<string, BuildingGroup>();

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

            string strAdditionalConditions = string.Format("{0} in ({1})", BuildingGroupData.Fields.buld_group_sn, strBuildingGroupNos);

            IEnumerable<BuildingGroupData> datas = dataManager.GetSelect().Select<BuildingGroupData>(strAdditionalConditions, out strErrorMessage);

            if (datas == null)
                return null;

            BuildingGroup buildingGroup;
            dicBuildingGroups = ToDictionary(buildingGroups);

            foreach (KeyValuePair<int, BuildingGroup> pair in dicBuildingGroups)
            {
                dicBuildingGroupNames[pair.Value.name] = pair.Value;
            }

            List<BuildingGroupData> buildingGroupDatas;
            Dictionary<string, List<BuildingGroupData>> dicBuildingGroupDatas = new Dictionary<string, List<BuildingGroupData>>();

            foreach (BuildingGroupData data in datas)
            {
                if (dicBuildingGroups.TryGetValue(data.buld_group_sn, out buildingGroup))
                {
                    if (dicBuildingGroupDatas.TryGetValue(buildingGroup.name, out buildingGroupDatas) == false)
                    {
                        buildingGroupDatas = new List<BuildingGroupData>();
                        dicBuildingGroupDatas[buildingGroup.name] = buildingGroupDatas;
                    }

                    buildingGroupDatas.Add(data);
                }
            }

            foreach (KeyValuePair<string, List<BuildingGroupData>> pair in dicBuildingGroupDatas)
            {
                pair.Value.Sort();
            }

            return dicBuildingGroupDatas;
        }

        private Dictionary<int, BuildingGroup> ToDictionary(IEnumerable<BuildingGroup> buildingGroups)
        {
            Dictionary<int, BuildingGroup> dicBuildingGroups = new Dictionary<int, BuildingGroup>();

            foreach (var buildingGroup in buildingGroups)
            {
                dicBuildingGroups[buildingGroup.buld_group_sn] = buildingGroup;
            }

            return dicBuildingGroups;
        }

        private BuildingGroupData FindData(List<BuildingGroupData> datas, BuildingGroupData buildingGroupData, int nOrderIndex)
        {
            foreach (BuildingGroupData data in datas)
            {
                if (data.buld_group_sn == buildingGroupData.buld_group_sn && data.ordr_indx == nOrderIndex)
                {
                    datas.Remove(data);
                    return data;
                }
            }

            return null;
        }

        private void SetAliveData(Dictionary<int, List<int>> dicAliveDataID, BuildingGroupData buildingGroupData, int nOrderIndex)
        {
            List<int> orderIndices;

            if (dicAliveDataID.TryGetValue(buildingGroupData.buld_group_sn, out orderIndices) == false)
            {
                orderIndices = new List<int>();
                dicAliveDataID[buildingGroupData.buld_group_sn] = orderIndices;
            }

            orderIndices.Add(nOrderIndex);
        }

        // Return 값 :
        //              0 => 동일하다.
        //              1 => 다르다.
        private int CompareData(BuildingGroupData dbData, BuildingGroupData sheetData)
        {
            if (dbData.value != sheetData.value)
                return SetData(dbData, sheetData, 1);
            if (dbData.wdt != sheetData.wdt)
                return SetData(dbData, sheetData, 1);
            if (dbData.indent_level != sheetData.indent_level)
                return SetData(dbData, sheetData, 1);

            return 0;
        }

        private int SetData(BuildingGroupData trg, BuildingGroupData src, int result)
        {
            trg.value = src.value;
            trg.wdt = src.wdt;
            trg.indent_level = src.indent_level;
            return result;
        }

        private bool IsAliveData(BuildingGroupData data, Dictionary<int, List<int>> dicAliveDataID)
        {
            List<int> orderIndices;

            if (dicAliveDataID.TryGetValue(data.buld_group_sn, out orderIndices))
            {
                foreach (int order in orderIndices)
                {
                    if (data.ordr_indx == order)
                        return true;
                }
            }

            return false;
        }

        private bool AddData(IDataManager dataManager, List<BuildingGroupData> newDatas, out string strErrorMessage)
        {
            strErrorMessage = null;

            foreach (BuildingGroupData data in newDatas)
            {
                if (dataManager.GetCreate().Insert<BuildingGroupData>(data, out strErrorMessage) == false)
                    return false;
            }

            return true;
        }

        private bool ChangeData(IDataManager dataManager, List<BuildingGroupData> changedDatas, out string strErrorMessage)
        {
            strErrorMessage = null;

            foreach (BuildingGroupData data in changedDatas)
            {
                if (dataManager.GetUpdate().Update<BuildingGroupData>(data, null, out strErrorMessage) == false)
                    return false;
            }

            return true;
        }

        private bool RemoveData(IDataManager dataManager, List<BuildingGroupData> removeDatas, out string strErrorMessage)
        {
            strErrorMessage = null;

            foreach (BuildingGroupData data in removeDatas)
            {
                if (dataManager.GetDelete().Delete<BuildingGroupData>(data, null, out strErrorMessage) == false)
                    return false;
            }

            return true;
        }
    }
}
