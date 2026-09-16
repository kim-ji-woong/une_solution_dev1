using System;
using System.Collections;
using System.Collections.Generic;
using dnsDapperDBUtil.DataAccessLayer.IDAL;
using DCOP.DAL;
using DCOP.Model;
using DCOP.Model.Sensor;

namespace DCOP.BLL
{
    using Models.Response;
    using Models.Request;

    public class DataCenterManager
    {
        private IDataManager m_dataManager = null;

        public DataCenterManager(IDataManager dataManager)
        {
            m_dataManager = dataManager;
        }

        public ResponseDataCenterList GetDataCenterList()
        {
            string strErrorMessage;
            ArrayList arrDatas = JoinManager.JoinRegionDataCenter(m_dataManager, null, out strErrorMessage);

            if (arrDatas == null)
                return new ResponseDataCenterList(false, strErrorMessage);

            ResponseDataCenterList response = new ResponseDataCenterList(true, "");
            DataCenterData data = null;

            int nDataCount = arrDatas.Count;

            for (int i=0;i<nDataCount-1;i+=2)
            {
                if (arrDatas[i] is Region && (arrDatas[i + 1] is DataCenter || arrDatas[i + 1] == null))
                {
                    Region region = (Region)arrDatas[i];
                    DataCenter center = (DataCenter)arrDatas[i + 1];

                    if (data == null || data.Region.RegionNo != region.RegionNo)
                    {
                        data = new DataCenterData();
                        data.Region = region;
                        response.Datas.Add(data);
                    }

                    if (center != null)
                        data.DataCenters.Add(center);
                }
            }

            return response;
        }

        // 배치된 Rack에 대한 RackGroup만 받아온다.
        // 배치된 Rack에 대한 기준은 좌표값이 0 이상일 것
        public ResponseRackGroupList GetRackGroupList(RequestRackGroupList data)
        {
            string strErrorMessage;
            IEnumerable<Company> companies = m_dataManager.GetSelect().Select<Company>(null, out strErrorMessage);

            if (companies == null)
                return new ResponseRackGroupList(false, strErrorMessage);

            Dictionary<int, Company> dicCompanies = new Dictionary<int, Company>();

            foreach (Company company in companies)
            {
                dicCompanies[company.CompanyNo] = company;
            }

            string strCondition = string.Format("b.{0} = {1}",
                Rack.Fields.DataCenterNo, data.DataCenterNo/*,
                Rack.Fields.X, Rack.Fields.Z*/);

            if (data.CompanyNo != null)
                strCondition += string.Format(" and c.{0} = {1}", RackType.Fields.CompanyNo, (int)data.CompanyNo);

            if (data.Type != null)
                strCondition += string.Format(" and c.{0} = '{1}'", RackType.Fields.Type, data.Type);

            if (data.UnitSize != null)
                strCondition += string.Format(" and c.{0} = {1}", RackType.Fields.Unit, (int)data.UnitSize);

            ArrayList arrDatas = JoinManager.JoinRackGroupRackRackType(m_dataManager, strCondition, out strErrorMessage);

            if (arrDatas == null)
                return new ResponseRackGroupList(false, strErrorMessage);

            bool searchText = data.SearchText != null && data.SearchText.Trim().Length > 0;
            string strSearchText = "";

            if (searchText)
                strSearchText = data.SearchText.Trim().ToLower();

            int nDataCount = arrDatas.Count;

            bool pageNation = data.PageIndex != null && data.PageItemCount != null && data.PageIndex >= 0 && data.PageItemCount > 0;
            int beginIndex = 0, endIndex = nDataCount;
            int itemIndex = 0;

            if (pageNation)
            {
                beginIndex = (int)data.PageItemCount * ((int)data.PageIndex);
                endIndex = beginIndex + (int)data.PageItemCount;
            }

            int totalCount = 0;
            Dictionary<int, RackGroupEx> dicRackGroups = new Dictionary<int, RackGroupEx>();

            for (int i=0;i<nDataCount-2;i+=3)
            {
                if (arrDatas[i] is RackGroup && arrDatas[i + 1] is Rack && arrDatas[i + 2] is RackType)
                {
                    RackGroup rackGroup = (RackGroup)arrDatas[i];
                    Rack rack = (Rack)arrDatas[i + 1];
                    RackType rackType = (RackType)arrDatas[i + 2];

                    RackGroupEx rackGroupEx;

                    if (dicRackGroups.TryGetValue(rackGroup.RackGroupNo, out rackGroupEx) == false)
                    {
                        rackGroupEx = new RackGroupEx(rackGroup);
                        dicRackGroups[rackGroupEx.RackGroupNo] = rackGroupEx;
                    }

                    RackEx rackEx = new RackEx(rack, rackType);

                    Company company;

                    if (dicCompanies.TryGetValue(rackType.CompanyNo, out company))
                        rackEx.CompanyName = company.CompanyName;

                    if (searchText)
                    {
                        if (CheckRackFilter(rackEx, strSearchText))
                        {
                            totalCount++;

                            if (pageNation)
                            {
                                if (CheckPageIndex(beginIndex, endIndex, ref itemIndex))
                                {
                                    rackGroupEx.Racks.Add(rackEx);

                                    // totalCount를 계산해야 한다.
                                    //if (itemIndex == endIndex)
                                    //    break;
                                }
                            }
                            else
                                rackGroupEx.Racks.Add(rackEx);
                        }
                    }
                    else
                    {
                        totalCount++;

                        if (pageNation)
                        {
                            if (CheckPageIndex(beginIndex, endIndex, ref itemIndex))
                            {
                                rackGroupEx.Racks.Add(rackEx);

                                // totalCount를 계산해야 한다.
                                //if (itemIndex == endIndex)
                                //    break;
                            }
                        }
                        else
                            rackGroupEx.Racks.Add(rackEx);
                    }
                }
            }

            ResponseRackGroupList response = new ResponseRackGroupList(true, "");
            response.RackGroups.AddRange(dicRackGroups.Values);
            response.TotalCount = totalCount;
            return response;
        }

        private bool CheckPageIndex(int beginIndex, int endIndex, ref int itemIndex)
        {
            if (itemIndex >= beginIndex && itemIndex < endIndex)
            {
                itemIndex++;
                return true;
            }

            itemIndex++;
            return false;
        }

        private bool CheckRackFilter(RackEx rack, string strSearchText)
        {
            if (rack.RackType.ModelName.ToLower().Contains(strSearchText))
                return true;

            if (rack.CompanyName.ToLower().Contains(strSearchText))
                return true;

            string strSize = string.Format("{0}x{1}x{2}", rack.RackType.Width, rack.RackType.Depth, rack.RackType.Height);

            if (strSize.Contains(strSearchText))
                return true;

            if (rack.RackType.Unit.ToString().Contains(strSearchText))
                return true;

            if (rack.RackType.Type.ToLower().Contains(strSearchText))
                return true;

            string strRegDate = string.Format("{0}-{1:00}-{2:00}", rack.RegTime.Year, rack.RegTime.Month, rack.RegTime.Day);

            if (strRegDate.Contains(strSearchText))
                return true;

            return false;
        }

        public ResponseRackItemList GetRackItemList(RequestRackItemList data)
        {
            string strCondition = string.Format("c.{0} = {1}",
                Item_RU.Fields.RackNo, data.RackNo);

            if (SetRackItemRequestCondition(data, ref strCondition) == false)
                return new ResponseRackItemList(true, "");

            return GetRackItemList(data, strCondition);
        }

        public ResponseRackItemList GetDataCenterRackItemList(RequestDataCenterRackItemList data)
        {
            string strCondition = string.Format("a.{0} = {1}",
                Item.Fields.DataCenterNo, data.DataCenterNo);

            if (SetRackItemRequestCondition(data, ref strCondition) == false)
                return new ResponseRackItemList(true, "");

            return GetRackItemList(data, strCondition);
        }

        private bool SetRackItemRequestCondition(_RequestItemList request, ref string strCondition)
        {
            string strCategoryName = GetTrimString(request.CategoryName);

            if (strCategoryName != null && strCategoryName.Length > 0)
                strCondition += string.Format(" and f.{0} = '{1}'", EquipmentCategory.Fields.EquipmentCategoryName, strCategoryName);

            string strEquipmentTypeName = GetTrimString(request.EquipmentTypeName);

            if (strEquipmentTypeName != null && strEquipmentTypeName.Length > 0)
                strCondition += string.Format(" and e.{0} = '{1}'", EquipmentType.Fields.EquipmentTypeName, strEquipmentTypeName);

            if (request.CompanyNo != null)
                strCondition += string.Format(" and d.{0} = {1}", ItemType.Fields.CompanyNo, (int)request.CompanyNo);

            string strType = GetTrimString(request.Type);

            if (strType != null && strType.Length > 0)
                strCondition += string.Format(" and d.{0} = '{1}'", ItemType.Fields.Type, strType);

            if (request.UnitSize != null)
                strCondition += string.Format(" and d.{0} = {1}", ItemType.Fields.Unit, (int)request.UnitSize);

            return true;
        }

        private string GetTrimString(string str)
        {
            if (str == null)
                return null;

            return str.Trim();
        }

        private ResponseRackItemList GetRackItemList(_RequestItemList data, string strCondition)
        {
            string strErrorMessage;
            IEnumerable<Company> companies = m_dataManager.GetSelect().Select<Company>(null, out strErrorMessage);

            if (companies == null)
                return new ResponseRackItemList(false, strErrorMessage);

            Dictionary<int, Company> dicCompanies = new Dictionary<int, Company>();

            foreach (Company company in companies)
            {
                dicCompanies[company.CompanyNo] = company;
            }

            ArrayList arrDatas = JoinManager.JoinItemItemDataItemRUItemTypeEquipmentTypeEquipmentCategory(m_dataManager, strCondition, out strErrorMessage);

            if (arrDatas == null)
                return new ResponseRackItemList(false, strErrorMessage);

            int nDataCount = arrDatas.Count;

            bool searchText = data.SearchText != null && data.SearchText.Trim().Length > 0;
            string strSearchText = "";

            if (searchText)
                strSearchText = data.SearchText.Trim().ToLower();

            bool pageNation = data.PageIndex != null && data.PageItemCount != null && data.PageIndex >= 0 && data.PageItemCount > 0;
            int beginIndex = 0, endIndex = nDataCount;
            int itemIndex = 0;

            if (pageNation)
            {
                beginIndex = (int)data.PageItemCount * ((int)data.PageIndex);
                endIndex = beginIndex + (int)data.PageItemCount;
            }

            int totalCount = 0;
            List<ItemEx> items = new List<ItemEx>();

            DateTime dtNow = DateTime.Now;

            for (int i = 0; i < nDataCount - 5; i += 6)
            {
                if (arrDatas[i] is Item && arrDatas[i + 1] is ItemData && arrDatas[i + 2] is Item_RU && arrDatas[i + 3] is ItemType && arrDatas[i + 4] is EquipmentType && arrDatas[i + 5] is EquipmentCategory)
                {
                    Item item = (Item)arrDatas[i];
                    ItemData itemData = (ItemData)arrDatas[i + 1];
                    Item_RU itemRU = (Item_RU)arrDatas[i + 2];
                    ItemType itemType = (ItemType)arrDatas[i + 3];
                    EquipmentType equipmentType = (EquipmentType)arrDatas[i + 4];
                    EquipmentCategory equipmentCategory = (EquipmentCategory)arrDatas[i + 5];

                    ItemEx itemEx = new ItemEx(item, itemRU, itemType, equipmentType, equipmentCategory);
                    itemEx.Temperature = itemData.Temperature;
                    itemEx.Power = itemData.Power;
                    itemEx.TemperatureUpdateTime = itemEx.PowerUpdateTime = dtNow;

                    Company company;

                    if (dicCompanies.TryGetValue(itemType.CompanyNo, out company))
                        itemEx.CompanyName = company.CompanyName;

                    if (searchText)
                    {
                        if (CheckItemFilter(itemEx, strSearchText))
                        {
                            totalCount++;

                            if (pageNation)
                            {
                                if (CheckPageIndex(beginIndex, endIndex, ref itemIndex))
                                {
                                    items.Add(itemEx);

                                    // totalCount를 계산해야 한다.
                                    //if (itemIndex == endIndex)
                                    //    break;
                                }
                            }
                            else
                                items.Add(itemEx);
                        }
                    }
                    else
                    {
                        totalCount++;

                        if (pageNation)
                        {
                            if (CheckPageIndex(beginIndex, endIndex, ref itemIndex))
                            {
                                items.Add(itemEx);

                                // totalCount를 계산해야 한다.
                                //if (itemIndex == endIndex)
                                //    break;
                            }
                        }
                        else
                            items.Add(itemEx);
                    }
                }
            }

            ResponseRackItemList response = new ResponseRackItemList(true, "");
            response.Items.AddRange(items);
            response.TotalCount = totalCount;
            return response;
        }

        private bool CheckItemFilter(ItemEx item, string strSearchText)
        {
            if (item.CategoryName.ToLower().Contains(strSearchText))
                return true;

            if (item.EquipmentTypeName.ToLower().Contains(strSearchText))
                return true;

            if (item.ItemType.ModelName.ToLower().Contains(strSearchText))
                return true;

            if (item.CompanyName.ToLower().Contains(strSearchText))
                return true;

            string strSize = string.Format("{0}x{1}x{2}", GetNullIntString(item.ItemType.Width), GetNullIntString(item.ItemType.Depth), GetNullIntString(item.ItemType.Height));

            if (strSize.Contains(strSearchText))
                return true;

            if (item.ItemType.Unit.ToString().Contains(strSearchText))
                return true;

            if (item.ItemType.Type != null && item.ItemType.Type.ToLower().Contains(strSearchText))
                return true;

            string strRegDate = string.Format("{0}-{1:00}-{2:00}", item.RegTime.Year, item.RegTime.Month, item.RegTime.Day);

            if (strRegDate.Contains(strSearchText))
                return true;

            return false;
        }

        private string GetNullIntString(int? data)
        {
            if (data == null)
                return "-";

            return ((int)data).ToString();
        }

        public ResponseItemData GetItemData(int nItemNo)
        {
            string strCondition = string.Format("{0} = {1}",
                ItemData.Fields.ItemNo, nItemNo);

            string strErrorMessage;
            ItemData itemData = m_dataManager.GetSelect().SelectFirst<ItemData>(strCondition, out strErrorMessage);

            if (itemData == null)
            {
                if (strErrorMessage == null)
                    return new ResponseItemData(true, "");
                else
                    return new ResponseItemData(false, strErrorMessage);
            }

            ResponseItemData response = new ResponseItemData(true, "");
            response.ItemData = itemData;
            return response;
        }

        public ResponseSensorList GetSensorList(int nDataCenterNo)
        {
            string strCondition = string.Format("a.{0} = {1} and a.{2} >= 0 and a.{3} >= 0",
                Sensor.Fields.DataCenterNo, nDataCenterNo, Sensor.Fields.X, Sensor.Fields.Z);

            string strErrorMessage;
            ArrayList arrDatas = JoinManager.JoinSensorSensorType(m_dataManager, strCondition, out strErrorMessage);

            if (arrDatas == null)
                return new ResponseSensorList(false, strErrorMessage);

            ResponseSensorList response = new ResponseSensorList(true, "");
            int nDataCount = arrDatas.Count;

            for (int i=0;i<nDataCount-1;i+=2)
            {
                if (arrDatas[i] is Sensor && arrDatas[i + 1] is SensorType)
                {
                    Sensor sensor = (Sensor)arrDatas[i];
                    SensorType sensorType = (SensorType)arrDatas[i + 1];

                    SensorEx sensorEx = new SensorEx(sensor, sensorType);
                    response.Sensors.Add(sensorEx);
                }
            }
            
            return response;
        }

        public ResponseRackTypeList GetRackTypeList(RequestRackTypeList data)
        {
            string strCondition = null;

            if (data.CompanyNo != null)
            {
                if (strCondition != null)
                    strCondition += " and ";

                strCondition += string.Format("a.{0} = {1}", RackType.Fields.CompanyNo, (int)data.CompanyNo);
            }

            if (data.Type != null)
            {
                if (strCondition != null)
                    strCondition += " and ";

                strCondition += string.Format("a.{0} = '{1}'", RackType.Fields.Type, data.Type);
            }

            if (data.UnitSize != null)
            {
                if (strCondition != null)
                    strCondition += " and ";

                strCondition += string.Format("a.{0} = {1}", RackType.Fields.Unit, (int)data.UnitSize);
            }

            string strErrorMessage;
            ArrayList arrDatas = JoinManager.JoinRackTypeCompany(m_dataManager, strCondition, out strErrorMessage);

            if (arrDatas == null)
                return new ResponseRackTypeList(false, strErrorMessage);

            bool searchText = data.SearchText != null && data.SearchText.Trim().Length > 0;
            string strSearchText = "";

            if (searchText)
                strSearchText = data.SearchText.Trim().ToLower();

            int totalCount = 0;

            int nDataCount = arrDatas.Count;
            ResponseRackTypeList response = new ResponseRackTypeList(true, "");

            bool pageNation = data.PageIndex != null && data.PageItemCount != null && data.PageIndex >= 0 && data.PageItemCount > 0;
            int beginIndex = 0, endIndex = nDataCount;
            int itemIndex = 0;

            if (pageNation)
            {
                beginIndex = (int)data.PageItemCount * ((int)data.PageIndex);
                endIndex = beginIndex + (int)data.PageItemCount;
            }

            for (int i=0;i<nDataCount-1;i+=2)
            {
                if (arrDatas[i] is RackType && arrDatas[i + 1] is Company)
                {
                    RackType rackType = (RackType)arrDatas[i];
                    Company company = (Company)arrDatas[i + 1];
                    RackTypeEx rackTypeEx = new RackTypeEx(rackType, company);

                    if (searchText)
                    {
                        if (CheckRackTypeFilter(rackTypeEx, strSearchText))
                        {
                            totalCount++;

                            if (pageNation)
                            {
                                if (CheckPageIndex(beginIndex, endIndex, ref itemIndex))
                                {
                                    response.RackTypes.Add(rackTypeEx);
                                }
                            }
                            else
                                response.RackTypes.Add(rackTypeEx);
                        }
                    }
                    else
                    {
                        totalCount++;

                        if (pageNation)
                        {
                            if (CheckPageIndex(beginIndex, endIndex, ref itemIndex))
                            {
                                response.RackTypes.Add(rackTypeEx);
                            }
                        }
                        else
                            response.RackTypes.Add(rackTypeEx);
                    }
                }
            }

            response.TotalCount = totalCount;
            return response;
        }

        private bool CheckRackTypeFilter(RackTypeEx rackTypeEx, string strSearchText)
        {
            if (rackTypeEx.ModelName.ToLower().Contains(strSearchText))
                return true;

            if (rackTypeEx.Company.CompanyName.ToLower().Contains(strSearchText))
                return true;

            string strSize = string.Format("{0}x{1}x{2}", rackTypeEx.Width, rackTypeEx.Depth, rackTypeEx.Height);

            if (strSize.Contains(strSearchText))
                return true;

            if (rackTypeEx.Unit.ToString().Contains(strSearchText))
                return true;

            if (rackTypeEx.Type.ToLower().Contains(strSearchText))
                return true;

            string strRegDate = string.Format("{0}-{1:00}-{2:00}", rackTypeEx.RegTime.Year, rackTypeEx.RegTime.Month, rackTypeEx.RegTime.Day);

            if (strRegDate.Contains(strSearchText))
                return true;

            return false;
        }

        public ResponseItemTypeList GetItemTypeList(RequestItemTypeList data)
        {
            string strCondition = null;
            string strCategoryName = GetTrimString(data.CategoryName);

            if (strCategoryName != null && strCategoryName.Length > 0)
            {
                if (strCondition != null)
                    strCondition += " and ";

                strCondition += string.Format("a.{0} = '{1}'", EquipmentCategory.Fields.EquipmentCategoryName, strCategoryName);
            }

            string strEquipmentTypeName = GetTrimString(data.EquipmentTypeName);

            if (strEquipmentTypeName != null && strEquipmentTypeName.Length > 0)
            {
                if (strCondition != null)
                    strCondition += " and ";

                strCondition += string.Format("b.{0} = '{1}'", EquipmentType.Fields.EquipmentTypeName, strEquipmentTypeName);
            }

            if (data.CompanyNo != null)
            {
                if (strCondition != null)
                    strCondition += " and ";

                strCondition += string.Format("c.{0} = {1}", ItemType.Fields.CompanyNo, (int)data.CompanyNo);
            }

            string strType = GetTrimString(data.Type);

            if (strType != null && strType.Length > 0)
            {
                if (strCondition != null)
                    strCondition += " and ";

                strCondition += string.Format("c.{0} = '{1}'", ItemType.Fields.Type, strType);
            }

            if (data.UnitSize != null)
            {
                if (strCondition != null)
                    strCondition += " and ";

                strCondition += string.Format("c.{0} = {1}", ItemType.Fields.Unit, (int)data.UnitSize);
            }

            string strErrorMessage;
            ArrayList arrDatas = JoinManager.JoinEquipmentCategoryEquipmentTypeItemTypeCompany(m_dataManager, strCondition, out strErrorMessage);

            if (arrDatas == null)
                return new ResponseItemTypeList(false, strErrorMessage);

            int nDataCount = arrDatas.Count;
            ResponseItemTypeList response = new ResponseItemTypeList(true, "");

            bool searchText = data.SearchText != null && data.SearchText.Trim().Length > 0;
            string strSearchText = "";

            if (searchText)
                strSearchText = data.SearchText.Trim().ToLower();

            bool pageNation = data.PageIndex != null && data.PageItemCount != null && data.PageIndex >= 0 && data.PageItemCount > 0;
            int beginIndex = 0, endIndex = nDataCount;
            int itemIndex = 0;

            if (pageNation)
            {
                beginIndex = (int)data.PageItemCount * ((int)data.PageIndex);
                endIndex = beginIndex + (int)data.PageItemCount;
            }

            int totalCount = 0;

            for (int i = 0; i < nDataCount - 3; i += 4)
            {
                if (arrDatas[i] is EquipmentCategory && arrDatas[i + 1] is EquipmentType && arrDatas[i + 2] is ItemType && arrDatas[i + 3] is Company)
                {
                    EquipmentCategory equipmentCategory = (EquipmentCategory)arrDatas[i];
                    EquipmentType equipmentType = (EquipmentType)arrDatas[i + 1];
                    ItemType itemType = (ItemType)arrDatas[i + 2];
                    Company company = (Company)arrDatas[i + 3];
                    ItemTypeEx itemTypeEx = new ItemTypeEx(itemType, company, equipmentCategory, equipmentType);

                    if (searchText)
                    {
                        if (CheckItemTypeFilter(itemTypeEx, strSearchText))
                        {
                            totalCount++;

                            if (pageNation)
                            {
                                if (CheckPageIndex(beginIndex, endIndex, ref itemIndex))
                                {
                                    response.ItemTypes.Add(itemTypeEx);
                                }
                            }
                            else
                                response.ItemTypes.Add(itemTypeEx);
                        }
                    }
                    else
                    {
                        totalCount++;

                        if (pageNation)
                        {
                            if (CheckPageIndex(beginIndex, endIndex, ref itemIndex))
                            {
                                response.ItemTypes.Add(itemTypeEx);
                            }
                        }
                        else
                            response.ItemTypes.Add(itemTypeEx);
                    }
                }
            }

            response.TotalCount = totalCount;
            return response;
        }

        private bool CheckItemTypeFilter(ItemTypeEx itemType, string strSearchText)
        {
            if (itemType.CategoryName.ToLower().Contains(strSearchText))
                return true;

            if (itemType.EquipmentTypeName.ToLower().Contains(strSearchText))
                return true;

            if (itemType.ModelName.ToLower().Contains(strSearchText))
                return true;

            if (itemType.Company.CompanyName.ToLower().Contains(strSearchText))
                return true;

            string strSize = string.Format("{0}x{1}x{2}", GetNullIntString(itemType.Width), GetNullIntString(itemType.Depth), GetNullIntString(itemType.Height));

            if (strSize.Contains(strSearchText))
                return true;

            if (itemType.Unit.ToString().Contains(strSearchText))
                return true;

            if (itemType.Type != null && itemType.Type.ToLower().Contains(strSearchText))
                return true;

            string strRegDate = string.Format("{0}-{1:00}-{2:00}", itemType.RegTime.Year, itemType.RegTime.Month, itemType.RegTime.Day);

            if (strRegDate.Contains(strSearchText))
                return true;

            return false;
        }

        public ResponseRackFilterList GetRackFilterList()
        {
            string strErrorMessage;
            string strCondition = string.Format("{0} in (Select {1} from {2} group by {1})", Company.Fields.CompanyNo, RackType.Fields.CompanyNo, RackType.TableName);
            IEnumerable<Company> companies = m_dataManager.GetSelect().Select<Company>(strCondition, out strErrorMessage);

            if (companies == null)
                return new ResponseRackFilterList(false, strErrorMessage);

            string strSQL = string.Format("Select {0} u from {1} group by {0} order by {0}", RackType.Fields.Unit, RackType.TableName);
            IEnumerable<dynamic> results = m_dataManager.GetSelect().Select(strSQL, out strErrorMessage);

            if (results == null)
                return new ResponseRackFilterList(false, strErrorMessage);

            strSQL = string.Format("Select {0} t from {1} group by {0} order by {0}", RackType.Fields.Type, RackType.TableName);
            IEnumerable<dynamic> results2 = m_dataManager.GetSelect().Select(strSQL, out strErrorMessage);

            if (results2 == null)
                return new ResponseRackFilterList(false, strErrorMessage);

            ResponseRackFilterList response = new ResponseRackFilterList(true, "");

            response.Companies.AddRange(companies);

            foreach (var data in results)
            {
                response.Units.Add((int)data.u);
            }

            foreach (var data in results2)
            {
                response.RackTypes.Add((string)data.t);
            }

            return response;
        }

        public ResponseItemFilterList GetItemFilterList()
        {
            string strErrorMessage;
            string strCondition = string.Format("b.{0} in (Select {1} from {2} group by {1})", EquipmentType.Fields.EquipmentTypeNo, ItemType.Fields.EquipmentTypeNo, ItemType.TableName);
            ArrayList arrDatas = JoinManager.JoinEquipmentCategoryEquipmentType(m_dataManager, strCondition, out strErrorMessage);

            if (arrDatas == null)
                return new ResponseItemFilterList(false, strErrorMessage);

            strCondition = string.Format("{0} in (Select {1} from {2} group by {1})", Company.Fields.CompanyNo, ItemType.Fields.CompanyNo, ItemType.TableName);
            IEnumerable<Company> companies = m_dataManager.GetSelect().Select<Company>(strCondition, out strErrorMessage);

            if (companies == null)
                return new ResponseItemFilterList(false, strErrorMessage);

            string strSQL = string.Format("Select {0} u from {1} group by {0} order by {0}", ItemType.Fields.Unit, ItemType.TableName);
            IEnumerable<dynamic> results = m_dataManager.GetSelect().Select(strSQL, out strErrorMessage);

            if (results == null)
                return new ResponseItemFilterList(false, strErrorMessage);

            strSQL = string.Format("Select {0} t from {1} group by {0} order by {0}", ItemType.Fields.Type, ItemType.TableName);
            IEnumerable<dynamic> results2 = m_dataManager.GetSelect().Select(strSQL, out strErrorMessage);

            if (results2 == null)
                return new ResponseItemFilterList(false, strErrorMessage);

            ResponseItemFilterList response = new ResponseItemFilterList(true, "");

            Dictionary<int, EquipmentCategory> dicEquipmentCategories = new Dictionary<int, EquipmentCategory>();
            Dictionary<int, EquipmentType> dicEquipmentTypes = new Dictionary<int, EquipmentType>();
            int nDataCount = arrDatas.Count;

            for (int i=0;i<nDataCount-1;i+=2)
            {
                if (arrDatas[i] is EquipmentCategory && arrDatas[i + 1] is EquipmentType)
                {
                    EquipmentCategory equipmentCategory = (EquipmentCategory)arrDatas[i];
                    EquipmentType equipmentType = (EquipmentType)arrDatas[i + 1];

                    dicEquipmentCategories[equipmentCategory.EquipmentCategoryNo] = equipmentCategory;
                    dicEquipmentTypes[equipmentType.EquipmentTypeNo] = equipmentType;
                }
            }

            foreach (EquipmentCategory equipmentCategory in dicEquipmentCategories.Values)
            {
                response.CategoryNames.Add(equipmentCategory.EquipmentCategoryName);
            }

            foreach (EquipmentType equipmentType in dicEquipmentTypes.Values)
            {
                response.EquipmentTypeNames.Add(equipmentType.EquipmentTypeName);
            }

            response.Companies.AddRange(companies);

            foreach (var data in results)
            {
                response.Units.Add((int)data.u);
            }

            foreach (var data in results2)
            {
                if (data.t != null)
                    response.ItemTypes.Add((string)data.t);
            }

            return response;
        }

        public Response360CameraUrl Get360CameraUrl(int nDataCenterNo)
        {
            string strErrorMessage;
            string strCondition = string.Format("{0} = {1} and {2} = '360CameraUrl'", DCOP.Model.DataCenterData.Fields.DataCenterNo, nDataCenterNo, DCOP.Model.DataCenterData.Fields.PropertyName);
            DCOP.Model.DataCenterData dataCenterData = m_dataManager.GetSelect().SelectFirst<DCOP.Model.DataCenterData>(strCondition, out strErrorMessage);

            if (dataCenterData == null || dataCenterData.PropertyValue == null || dataCenterData.PropertyValue.Length == 0)
            {
                if (strErrorMessage != null)
                    return new Response360CameraUrl(false, strErrorMessage);
                else
                    return new Response360CameraUrl(false, "360Camera 화면이 존재하지 않습니다.");
            }

            Response360CameraUrl response = new Response360CameraUrl(true, "");
            response.Url = dataCenterData.PropertyValue;
            return response;
        }

        public ResponseFacilityInfo GetFacilityInfo(int nFacilityNo)
        {
            string strErrorMessage;
            string strCondition = string.Format("{0} = {1}", Facility.Fields.FacilityNo, nFacilityNo);
            Facility facility = m_dataManager.GetSelect().SelectFirst<Facility>(strCondition, out strErrorMessage);

            if (facility == null)
            {
                if (strErrorMessage != null)
                    return new ResponseFacilityInfo(false, strErrorMessage);
                else
                    return new ResponseFacilityInfo(false, "설비 정보가 존재하지 않습니다.");
            }

            ResponseFacilityInfo response = new ResponseFacilityInfo(true, "");
            response.FacilityName = facility.FacilityName;
            response.FaclilityNo = facility.FacilityNo;
            response.ImagePath = facility.ImagePath;
            return response;
        }
    }
}
