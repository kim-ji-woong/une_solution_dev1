using System;
using System.Collections;
using System.Collections.Generic;
using dnsDapperDBUtil.DataAccessLayer.IDAL;
using DCOP.Model.Account;
using DCOP.Model;
using DCOP.Model.Sensor;

namespace DCOP.DAL
{
    public class JoinManager
    {
        public static ArrayList JoinSessionUserLevel(IDataManager dataManager, string strAdditionalConditions, out string strErrorMessage)
        {
            Session session = new Session();
            User user = new User();
            Level level = new Level();

            string strSQL = string.Format("Select a.*, b.*, c.* from {0} a, {1} b, {2} c where a.{3} = b.{4} and b.{5} = c.{6}",
                session.GetTableName(), user.GetTableName(), level.GetTableName(),
                Session.Fields.AccountUserNo, User.Fields.AccountUserNo,
                User.Fields.AccountLevelNo, Level.Fields.AccountLevelNo);

            if (strAdditionalConditions != null && strAdditionalConditions.Length > 0)
                strSQL += " and " + strAdditionalConditions;

            ArrayList arrDatas = new ArrayList();
            IEnumerable<dynamic> result = dataManager.GetSelect().Select(strSQL, out strErrorMessage);

            if (result == null)
                return null;

            int nSessionFieldCount = session.GetFieldCount();
            int nUserFieldCount = user.GetFieldCount();

            foreach (var item in result)
            {
                var data = item as IDictionary<string, object>;
                int nIndex = 0;

                session = new Session();
                user = new User();
                level = new Level();

                foreach (KeyValuePair<string, object> pair in data)
                {
                    if (nIndex < nSessionFieldCount)
                    {
                        ReadSession(pair.Key, pair.Value, session);
                    }
                    else if (nIndex < nSessionFieldCount + nUserFieldCount)
                    {
                        ReadUser(pair.Key, pair.Value, user);
                    }
                    else
                        ReadLevel(pair.Key, pair.Value, level);

                    nIndex++;
                }

                arrDatas.Add(session);
                arrDatas.Add(user);
                arrDatas.Add(level);
            }

            return arrDatas;
        }

        public static ArrayList JoinRegionDataCenter(IDataManager dataManager, string strAdditionalConditions, out string strErrorMessage)
        {
            Region region = new Region();
            DataCenter center = new DataCenter();

            string strSQL = string.Format("Select a.*, b.* from {0} a left outer join {1} b on a.{2} = b.{3}",
                region.GetTableName(), center.GetTableName(),
                Region.Fields.RegionNo, DataCenter.Fields.RegionNo);

            if (strAdditionalConditions != null && strAdditionalConditions.Length > 0)
                strSQL += " and " + strAdditionalConditions;

            ArrayList arrDatas = new ArrayList();
            IEnumerable<dynamic> result = dataManager.GetSelect().Select(strSQL, out strErrorMessage);

            if (result == null)
                return null;

            int nRegionFieldCount = region.GetFieldCount();

            foreach (var item in result)
            {
                var data = item as IDictionary<string, object>;
                int nIndex = 0;

                region = new Region();
                center = new DataCenter();

                foreach (KeyValuePair<string, object> pair in data)
                {
                    if (nIndex < nRegionFieldCount)
                    {
                        ReadRegion(pair.Key, pair.Value, region);
                    }
                    else
                        ReadDataCenter(pair.Key, pair.Value, ref center);

                    nIndex++;
                }

                arrDatas.Add(region);
                arrDatas.Add(center);
            }

            return arrDatas;
        }

        public static ArrayList JoinRackGroupRackRackType(IDataManager dataManager, string strAdditionalConditions, out string strErrorMessage)
        {
            RackGroup rackGroup = new RackGroup();
            Rack rack = new Rack();
            RackType rackType = new RackType();

            string strSQL = string.Format("Select a.*, b.*, c.* from {0} a inner join {1} b on a.{3} = b.{4} inner join {2} c on b.{5} = c.{6}",
                rackGroup.GetTableName(), rack.GetTableName(), rackType.GetTableName(),
                RackGroup.Fields.RackGroupNo, Rack.Fields.RackGroupNo,
                Rack.Fields.RackTypeNo, RackType.Fields.RackTypeNo);

            if (strAdditionalConditions != null && strAdditionalConditions.Length > 0)
                strSQL += " where " + strAdditionalConditions;

            ArrayList arrDatas = new ArrayList();
            IEnumerable<dynamic> result = dataManager.GetSelect().Select(strSQL, out strErrorMessage);

            if (result == null)
                return null;

            int nRackGroupFieldCount = rackGroup.GetFieldCount();
            int nRackFieldCount = rack.GetFieldCount();

            foreach (var item in result)
            {
                var data = item as IDictionary<string, object>;
                int nIndex = 0;

                rackGroup = new RackGroup();
                rack = new Rack();
                rackType = new RackType();

                foreach (KeyValuePair<string, object> pair in data)
                {
                    if (nIndex < nRackGroupFieldCount)
                    {
                        ReadRackGroup(pair.Key, pair.Value, rackGroup);
                    }
                    else if (nIndex < nRackGroupFieldCount + nRackFieldCount)
                        ReadRack(pair.Key, pair.Value, rack);
                    else
                        ReadRackType(pair.Key, pair.Value, rackType);

                    nIndex++;
                }

                arrDatas.Add(rackGroup);
                arrDatas.Add(rack);
                arrDatas.Add(rackType);
            }

            return arrDatas;
        }

        public static ArrayList JoinItemItemDataItemRUItemTypeEquipmentTypeEquipmentCategory(IDataManager dataManager, string strAdditionalConditions, out string strErrorMessage)
        {
            Item _item = new Item();
            ItemData itemData = new ItemData();
            Item_RU itemRU = new Item_RU();
            ItemType itemType = new ItemType();
            EquipmentType equipmentType = new EquipmentType();
            EquipmentCategory equipmentCategory = new EquipmentCategory();

            string strSQL = string.Format("Select a.*, b.*, c.*, d.*, e.*, f.* from {0} a inner join {1} b on a.{6} = b.{7} inner join {2} c on a.{8} = c.{9} inner join {3} d on a.{10} = d.{11} inner join {4} e on d.{12} = e.{13} inner join {5} f on e.{14} = f.{15}",
                _item.GetTableName(), itemData.GetTableName(), itemRU.GetTableName(), itemType.GetTableName(), equipmentType.GetTableName(), equipmentCategory.GetTableName(),
                Item.Fields.ItemNo, ItemData.Fields.ItemNo,
                Item.Fields.ItemNo, Item_RU.Fields.ItemNo,
                Item.Fields.ItemTypeNo, ItemType.Fields.ItemTypeNo,
                ItemType.Fields.EquipmentTypeNo, EquipmentType.Fields.EquipmentTypeNo,
                EquipmentType.Fields.EquipmentCategoryNo, EquipmentCategory.Fields.EquipmentCategoryNo);

            if (strAdditionalConditions != null && strAdditionalConditions.Length > 0)
                strSQL += " where " + strAdditionalConditions;

            ArrayList arrDatas = new ArrayList();
            IEnumerable<dynamic> result = dataManager.GetSelect().Select(strSQL, out strErrorMessage);

            if (result == null)
                return null;

            int nItemFieldCount = _item.GetFieldCount();
            int nItemDataFieldCount = itemData.GetFieldCount();
            int nItemRUFieldCount = itemRU.GetFieldCount();
            int nItemTypeCount = itemType.GetFieldCount();
            int nEquipmentTypeCount = equipmentType.GetFieldCount();

            foreach (var item in result)
            {
                var data = item as IDictionary<string, object>;
                int nIndex = 0;

                _item = new Item();
                itemData = new ItemData();
                itemRU = new Item_RU();
                itemType = new ItemType();
                equipmentType = new EquipmentType();
                equipmentCategory = new EquipmentCategory();

                foreach (KeyValuePair<string, object> pair in data)
                {
                    if (nIndex < nItemFieldCount)
                    {
                        ReadItem(pair.Key, pair.Value, _item);
                    }
                    else if (nIndex < nItemFieldCount + nItemDataFieldCount)
                    {
                        ReadItemData(pair.Key, pair.Value, itemData);
                    }
                    else if (nIndex < nItemFieldCount + nItemDataFieldCount + nItemRUFieldCount)
                    {
                        ReadItemRU(pair.Key, pair.Value, itemRU);
                    }
                    else if (nIndex < nItemFieldCount + nItemDataFieldCount + nItemRUFieldCount + nItemTypeCount)
                        ReadItemType(pair.Key, pair.Value, itemType);
                    else if (nIndex < nItemFieldCount + nItemDataFieldCount + nItemRUFieldCount + nItemTypeCount + nEquipmentTypeCount)
                        ReadEquipmentType(pair.Key, pair.Value, equipmentType);
                    else
                        ReadEquipmentCategory(pair.Key, pair.Value, equipmentCategory);

                    nIndex++;
                }

                arrDatas.Add(_item);
                arrDatas.Add(itemData);
                arrDatas.Add(itemRU);
                arrDatas.Add(itemType);
                arrDatas.Add(equipmentType);
                arrDatas.Add(equipmentCategory);
            }

            return arrDatas;
        }

        public static ArrayList JoinSensorSensorType(IDataManager dataManager, string strAdditionalConditions, out string strErrorMessage)
        {
            Sensor sensor = new Sensor();
            SensorType sensorType = new SensorType();

            string strSQL = string.Format("Select a.*, b.* from {0} a inner join {1} b on a.{2} = b.{3}",
                sensor.GetTableName(), sensorType.GetTableName(),
                Sensor.Fields.SensorTypeNo, SensorType.Fields.SensorTypeNo);

            if (strAdditionalConditions != null && strAdditionalConditions.Length > 0)
                strSQL += " where " + strAdditionalConditions;

            ArrayList arrDatas = new ArrayList();
            IEnumerable<dynamic> result = dataManager.GetSelect().Select(strSQL, out strErrorMessage);

            if (result == null)
                return null;

            int nSensorFieldCount = sensor.GetFieldCount();

            foreach (var item in result)
            {
                var data = item as IDictionary<string, object>;
                int nIndex = 0;

                sensor = new Sensor();
                sensorType = new SensorType();

                foreach (KeyValuePair<string, object> pair in data)
                {
                    if (nIndex < nSensorFieldCount)
                        ReadSensor(pair.Key, pair.Value, sensor);
                    else
                        ReadSensorType(pair.Key, pair.Value, sensorType);

                    nIndex++;
                }

                arrDatas.Add(sensor);
                arrDatas.Add(sensorType);
            }

            return arrDatas;
        }

        public static ArrayList JoinRackTypeCompany(IDataManager dataManager, string strAdditionalConditions, out string strErrorMessage)
        {
            RackType rackType = new RackType();
            Company company = new Company();

            string strSQL = string.Format("Select a.*, b.* from {0} a inner join {1} b on a.{2} = b.{3}",
                rackType.GetTableName(), company.GetTableName(),
                RackType.Fields.CompanyNo, Company.Fields.CompanyNo);

            if (strAdditionalConditions != null && strAdditionalConditions.Length > 0)
                strSQL += " where " + strAdditionalConditions;

            ArrayList arrDatas = new ArrayList();
            IEnumerable<dynamic> result = dataManager.GetSelect().Select(strSQL, out strErrorMessage);

            if (result == null)
                return null;

            int nRackTypeFieldCount = rackType.GetFieldCount();

            foreach (var item in result)
            {
                var data = item as IDictionary<string, object>;
                int nIndex = 0;

                rackType = new RackType();
                company = new Company();

                foreach (KeyValuePair<string, object> pair in data)
                {
                    if (nIndex < nRackTypeFieldCount)
                        ReadRackType(pair.Key, pair.Value, rackType);
                    else
                        ReadCompany(pair.Key, pair.Value, company);

                    nIndex++;
                }

                arrDatas.Add(rackType);
                arrDatas.Add(company);
            }

            return arrDatas;
        }

        public static ArrayList JoinItemTypeCompany(IDataManager dataManager, string strAdditionalConditions, out string strErrorMessage)
        {
            ItemType itemType = new ItemType();
            Company company = new Company();

            string strSQL = string.Format("Select a.*, b.* from {0} a inner join {1} b on a.{2} = b.{3}",
                itemType.GetTableName(), company.GetTableName(),
                ItemType.Fields.CompanyNo, Company.Fields.CompanyNo);

            if (strAdditionalConditions != null && strAdditionalConditions.Length > 0)
                strSQL += " where " + strAdditionalConditions;

            ArrayList arrDatas = new ArrayList();
            IEnumerable<dynamic> result = dataManager.GetSelect().Select(strSQL, out strErrorMessage);

            if (result == null)
                return null;

            int nItemTypeFieldCount = itemType.GetFieldCount();

            foreach (var item in result)
            {
                var data = item as IDictionary<string, object>;
                int nIndex = 0;

                itemType = new ItemType();
                company = new Company();

                foreach (KeyValuePair<string, object> pair in data)
                {
                    if (nIndex < nItemTypeFieldCount)
                        ReadItemType(pair.Key, pair.Value, itemType);
                    else
                        ReadCompany(pair.Key, pair.Value, company);

                    nIndex++;
                }

                arrDatas.Add(itemType);
                arrDatas.Add(company);
            }

            return arrDatas;
        }

        public static ArrayList JoinEquipmentCategoryEquipmentType(IDataManager dataManager, string strAdditionalConditions, out string strErrorMessage)
        {
            EquipmentCategory equipmentCategory = new EquipmentCategory();
            EquipmentType equipmentType = new EquipmentType();

            string strSQL = string.Format("Select a.*, b.* from {0} a inner join {1} b on a.{2} = b.{3}",
                equipmentCategory.GetTableName(), equipmentType.GetTableName(),
                EquipmentCategory.Fields.EquipmentCategoryNo, EquipmentType.Fields.EquipmentCategoryNo);

            if (strAdditionalConditions != null && strAdditionalConditions.Length > 0)
                strSQL += " where " + strAdditionalConditions;

            ArrayList arrDatas = new ArrayList();
            IEnumerable<dynamic> result = dataManager.GetSelect().Select(strSQL, out strErrorMessage);

            if (result == null)
                return null;

            int nEquipmentCategoryFieldCount = equipmentCategory.GetFieldCount();

            foreach (var item in result)
            {
                var data = item as IDictionary<string, object>;
                int nIndex = 0;

                equipmentCategory = new EquipmentCategory();
                equipmentType = new EquipmentType();

                foreach (KeyValuePair<string, object> pair in data)
                {
                    if (nIndex < nEquipmentCategoryFieldCount)
                        ReadEquipmentCategory(pair.Key, pair.Value, equipmentCategory);
                    else
                        ReadEquipmentType(pair.Key, pair.Value, equipmentType);

                    nIndex++;
                }

                arrDatas.Add(equipmentCategory);
                arrDatas.Add(equipmentType);
            }

            return arrDatas;
        }

        public static ArrayList JoinEquipmentCategoryEquipmentTypeItemTypeCompany(IDataManager dataManager, string strAdditionalConditions, out string strErrorMessage)
        {
            EquipmentCategory equipmentCategory = new EquipmentCategory();
            EquipmentType equipmentType = new EquipmentType();
            ItemType itemType = new ItemType();
            Company company = new Company();

            string strSQL = string.Format("Select a.*, b.*, c.*, d.* from {0} a inner join {1} b on a.{4} = b.{5} inner join {2} c on b.{6} = c.{7} inner join {3} d on c.{8} = d.{9}",
                equipmentCategory.GetTableName(), equipmentType.GetTableName(), itemType.GetTableName(), company.GetTableName(),
                EquipmentCategory.Fields.EquipmentCategoryNo, EquipmentType.Fields.EquipmentCategoryNo,
                EquipmentType.Fields.EquipmentTypeNo, ItemType.Fields.EquipmentTypeNo,
                ItemType.Fields.CompanyNo, Company.Fields.CompanyNo);

            if (strAdditionalConditions != null && strAdditionalConditions.Length > 0)
                strSQL += " where " + strAdditionalConditions;

            ArrayList arrDatas = new ArrayList();
            IEnumerable<dynamic> result = dataManager.GetSelect().Select(strSQL, out strErrorMessage);

            if (result == null)
                return null;

            int nEquipmentCategoryFieldCount = equipmentCategory.GetFieldCount();
            int nEquipmentTypeFieldCount = equipmentType.GetFieldCount();
            int nItemTypeFieldCount = itemType.GetFieldCount();

            foreach (var item in result)
            {
                var data = item as IDictionary<string, object>;
                int nIndex = 0;

                equipmentCategory = new EquipmentCategory();
                equipmentType = new EquipmentType();
                itemType = new ItemType();
                company = new Company();

                foreach (KeyValuePair<string, object> pair in data)
                {
                    if (nIndex < nEquipmentCategoryFieldCount)
                        ReadEquipmentCategory(pair.Key, pair.Value, equipmentCategory);
                    else if (nIndex < nEquipmentCategoryFieldCount + nEquipmentTypeFieldCount)
                        ReadEquipmentType(pair.Key, pair.Value, equipmentType);
                    else if (nIndex < nEquipmentCategoryFieldCount + nEquipmentTypeFieldCount + nItemTypeFieldCount)
                        ReadItemType(pair.Key, pair.Value, itemType);
                    else
                        ReadCompany(pair.Key, pair.Value, company);

                    nIndex++;
                }

                arrDatas.Add(equipmentCategory);
                arrDatas.Add(equipmentType);
                arrDatas.Add(itemType);
                arrDatas.Add(company);
            }

            return arrDatas;
        }

        public static ArrayList JoinItemItemTypeEquipmentType(IDataManager dataManager, string strAdditionalConditions, out string strErrorMessage)
        {
            Item item = new Item();
            ItemType itemType = new ItemType();
            EquipmentType equipmentType = new EquipmentType();

            string strSQL = string.Format("Select a.*, b.*, c.* from {0} a, {1} b, {2} c where a.{3} = b.{4} and b.{5} = c.{6}",
                item.GetTableName(), itemType.GetTableName(), equipmentType.GetTableName(),
                Item.Fields.ItemTypeNo, ItemType.Fields.ItemTypeNo,
                ItemType.Fields.EquipmentTypeNo, EquipmentType.Fields.EquipmentTypeNo);

            if (strAdditionalConditions != null && strAdditionalConditions.Length > 0)
                strSQL += " and " + strAdditionalConditions;

            ArrayList arrDatas = new ArrayList();
            IEnumerable<dynamic> result = dataManager.GetSelect().Select(strSQL, out strErrorMessage);

            if (result == null)
                return null;

            int nItemFieldCount = item.GetFieldCount();
            int nItemTypeFieldCount = itemType.GetFieldCount();

            foreach (var _item in result)
            {
                var data = _item as IDictionary<string, object>;
                int nIndex = 0;

                item = new Item();
                itemType = new ItemType();
                equipmentType = new EquipmentType();

                foreach (KeyValuePair<string, object> pair in data)
                {
                    if (nIndex < nItemFieldCount)
                    {
                        ReadItem(pair.Key, pair.Value, item);
                    }
                    else if (nIndex < nItemFieldCount + nItemTypeFieldCount)
                    {
                        ReadItemType(pair.Key, pair.Value, itemType);
                    }
                    else
                    {
                        ReadEquipmentType(pair.Key, pair.Value, equipmentType);
                    }

                    nIndex++;
                }

                arrDatas.Add(item);
                arrDatas.Add(itemType);
                arrDatas.Add(equipmentType);
            }

            return arrDatas;
        }

        public static ArrayList JoinRackRackType(IDataManager dataManager, string strAdditionalConditions, out string strErrorMessage)
        {
            Rack rack = new Rack();
            RackType rackType = new RackType();

            string strSQL = string.Format("Select a.*, b.* from {0} a, {1} b where a.{2} = b.{3}",
                rack.GetTableName(), rackType.GetTableName(),
                Rack.Fields.RackTypeNo, RackType.Fields.RackTypeNo);

            if (strAdditionalConditions != null && strAdditionalConditions.Length > 0)
                strSQL += " and " + strAdditionalConditions;

            ArrayList arrDatas = new ArrayList();
            IEnumerable<dynamic> result = dataManager.GetSelect().Select(strSQL, out strErrorMessage);

            if (result == null)
                return null;

            int nRackFieldCount = rack.GetFieldCount();

            foreach (var item in result)
            {
                var data = item as IDictionary<string, object>;
                int nIndex = 0;

                rack = new Rack();
                rackType = new RackType();

                foreach (KeyValuePair<string, object> pair in data)
                {
                    if (nIndex < nRackFieldCount)
                    {
                        ReadRack(pair.Key, pair.Value, rack);
                    }
                    else
                    {
                        ReadRackType(pair.Key, pair.Value, rackType);
                    }

                    nIndex++;
                }

                arrDatas.Add(rack);
                arrDatas.Add(rackType);
            }

            return arrDatas;
        }

        public static ArrayList JoinAlarmItemRU(IDataManager dataManager, string strAdditionalConditions, out string strErrorMessage)
        {
            Alarm alarm = new Alarm();
            Item_RU ru = new Item_RU();

            string strSQL = string.Format("Select a.*, b.* from {0} a inner join {1} b on a.{2} = b.{3}",
                alarm.GetTableName(), ru.GetTableName(),
                Alarm.Fields.ItemNo, Item_RU.Fields.ItemNo);

            if (strAdditionalConditions != null && strAdditionalConditions.Length > 0)
                strSQL += " and " + strAdditionalConditions;

            ArrayList arrDatas = new ArrayList();
            IEnumerable<dynamic> result = dataManager.GetSelect().Select(strSQL, out strErrorMessage);

            if (result == null)
                return null;

            int nAlarmFieldCount = alarm.GetFieldCount();

            foreach (var item in result)
            {
                var data = item as IDictionary<string, object>;
                int nIndex = 0;

                alarm = new Alarm();
                ru = new Item_RU();

                foreach (KeyValuePair<string, object> pair in data)
                {
                    if (nIndex < nAlarmFieldCount)
                    {
                        ReadAlarm(pair.Key, pair.Value, alarm);
                    }
                    else
                    {
                        ReadItemRU(pair.Key, pair.Value, ru);
                    }

                    nIndex++;
                }

                arrDatas.Add(alarm);
                arrDatas.Add(ru);
            }

            return arrDatas;
        }

        private static void ReadAlarm(string strFieldName, object value, Alarm alarm)
        {
            if (strFieldName == Alarm.Fields.AlarmNo.ToString())
                alarm.AlarmNo = (int)value;
            else if (strFieldName == Alarm.Fields.AlarmType.ToString())
                alarm.AlarmType = (string)value;
            else if (strFieldName == Alarm.Fields.AlarmTime.ToString())
                alarm.AlarmTime = (DateTime)value;
            else if (strFieldName == Alarm.Fields.ClearTime.ToString())
            {
                if (value == null)
                    alarm.ClearTime = null;
                else
                    alarm.ClearTime = (DateTime)value;
            }
            else if (strFieldName == Alarm.Fields.RackNo.ToString())
                alarm.RackNo = (int)value;
            else if (strFieldName == Alarm.Fields.ItemNo.ToString())
                alarm.ItemNo = (int)value;
            else if (strFieldName == Alarm.Fields.ImagePath1.ToString())
                alarm.ImagePath1 = (string)value;
            else if (strFieldName == Alarm.Fields.ImagePath2.ToString())
                alarm.ImagePath2 = (string)value;
        }

        private static void ReadCompany(string strFieldName, object value, Company company)
        {
            if (strFieldName == Company.Fields.CompanyNo.ToString())
                company.CompanyNo = (int)value;
            else if (strFieldName == Company.Fields.CompanyName.ToString())
                company.CompanyName = (string)value;
            else if (strFieldName == Company.Fields.CompanyEngName.ToString())
                company.CompanyEngName = (string)value;
        }

        private static void ReadSensor(string strFieldName, object value, Sensor sensor)
        {
            if (strFieldName == Sensor.Fields.SensorNo.ToString())
                sensor.SensorNo = (int)value;
            else if (strFieldName == Sensor.Fields.Name.ToString())
                sensor.Name = (string)value;
            else if (strFieldName == Sensor.Fields.SensorTypeNo.ToString())
                sensor.SensorTypeNo = (int)value;
            else if (strFieldName == Sensor.Fields.DataCenterNo.ToString())
                sensor.DataCenterNo = (int)value;
            else if (strFieldName == Sensor.Fields.RegTime.ToString())
                sensor.RegTime = (DateTime)value;
            else if (strFieldName == Sensor.Fields.UpdateTime.ToString())
            {
                if (value == null)
                    sensor.UpdateTime = null;
                else
                    sensor.UpdateTime = (DateTime)value;
            }
            else if (strFieldName == Sensor.Fields.X.ToString())
                sensor.X = (int)value;
            else if (strFieldName == Sensor.Fields.Y.ToString())
                sensor.Y = (int)value;
            else if (strFieldName == Sensor.Fields.Z.ToString())
                sensor.Z = (int)value;
            else if (strFieldName == Sensor.Fields.Value.ToString())
            {
                if (value == null)
                    sensor.Value = null;
                else
                    sensor.Value = (double)value;
            }
        }

        private static void ReadSensorType(string strFieldName, object value, SensorType sensorType)
        {
            if (strFieldName == SensorType.Fields.SensorTypeNo.ToString())
                sensorType.SensorTypeNo = (int)value;
            else if (strFieldName == SensorType.Fields.Name.ToString())
                sensorType.Name = (string)value;
            else if (strFieldName == SensorType.Fields.EngName.ToString())
                sensorType.EngName = (string)value;
            else if (strFieldName == SensorType.Fields.Unit.ToString())
                sensorType.Unit = (string)value;
            else if (strFieldName == SensorType.Fields.ImageUrl.ToString())
                sensorType.ImageUrl = (string)value;
        }

        private static void ReadEquipmentType(string strFieldName, object value, EquipmentType equipmentType)
        {
            if (strFieldName == EquipmentType.Fields.EquipmentTypeNo.ToString())
                equipmentType.EquipmentTypeNo = (int)value;
            else if (strFieldName == EquipmentType.Fields.EquipmentTypeName.ToString())
                equipmentType.EquipmentTypeName = (string)value;
            else if (strFieldName == EquipmentType.Fields.EquipmentCategoryNo.ToString())
                equipmentType.EquipmentCategoryNo = (int)value;
        }

        private static void ReadEquipmentCategory(string strFieldName, object value, EquipmentCategory equipmentCategory)
        {
            if (strFieldName == EquipmentCategory.Fields.EquipmentCategoryNo.ToString())
                equipmentCategory.EquipmentCategoryNo = (int)value;
            else if (strFieldName == EquipmentCategory.Fields.EquipmentCategoryName.ToString())
                equipmentCategory.EquipmentCategoryName = (string)value;
        }

        private static void ReadItemRU(string strFieldName, object value, Item_RU itemRI)
        {
            if (strFieldName == Item_RU.Fields.ItemNo.ToString())
                itemRI.ItemNo = (int)value;
            else if (strFieldName == Item_RU.Fields.RackNo.ToString())
                itemRI.RackNo = (int)value;
            else if (strFieldName == Item_RU.Fields.UPos.ToString())
                itemRI.UPos = (int)value;
        }

        private static void ReadItemData(string strFieldName, object value, ItemData itemData)
        {
            if (strFieldName == ItemData.Fields.ItemNo.ToString())
                itemData.ItemNo = (int)value;
            else if (strFieldName == ItemData.Fields.Temperature.ToString())
                itemData.Temperature = (double)value;
            else if (strFieldName == ItemData.Fields.Power.ToString())
                itemData.Power = (double)value;
        }

        private static void ReadItem(string strFieldName, object value, Item item)
        {
            if (strFieldName == Item.Fields.ItemNo.ToString())
                item.ItemNo = (int)value;
            else if (strFieldName == Item.Fields.ItemName.ToString())
                item.ItemName = (string)value;
            else if (strFieldName == Item.Fields.DataCenterNo.ToString())
                item.DataCenterNo = (int)value;
            else if (strFieldName == Item.Fields.ItemTypeNo.ToString())
                item.ItemTypeNo = (int)value;
            else if (strFieldName == Item.Fields.RegTime.ToString())
                item.RegTime = (DateTime)value;
            else if (strFieldName == Item.Fields.Barcode.ToString())
                item.Barcode = (string)value;
        }

        private static void ReadItemType(string strFieldName, object value, ItemType itemType)
        {
            if (strFieldName == ItemType.Fields.ItemTypeNo.ToString())
                itemType.ItemTypeNo = (int)value;
            else if (strFieldName == ItemType.Fields.EquipmentTypeNo.ToString())
                itemType.EquipmentTypeNo = (int)value;
            else if (strFieldName == ItemType.Fields.CompanyNo.ToString())
                itemType.CompanyNo = (int)value;
            else if (strFieldName == ItemType.Fields.ModelName.ToString())
                itemType.ModelName = (string)value;
            else if (strFieldName == ItemType.Fields.Height.ToString())
            {
                if (value == null)
                    itemType.Height = null;
                else
                    itemType.Height = (int)value;
            }
            else if (strFieldName == ItemType.Fields.Width.ToString())
            {
                if (value == null)
                    itemType.Width = null;
                else
                    itemType.Width = (int)value;
            }
            else if (strFieldName == ItemType.Fields.Depth.ToString())
            {
                if (value == null)
                    itemType.Depth = null;
                else
                    itemType.Depth = (int)value;
            }
            else if (strFieldName == ItemType.Fields.Unit.ToString())
                itemType.Unit = (int)value;
            else if (strFieldName == ItemType.Fields.ImageUrl.ToString())
                itemType.ImageUrl = (string)value;
            else if (strFieldName == ItemType.Fields.GlbUrl.ToString())
                itemType.GlbUrl = (string)value;
            else if (strFieldName == ItemType.Fields.FbxUrl.ToString())
                itemType.FbxUrl = (string)value;
            else if (strFieldName == ItemType.Fields.Type.ToString())
                itemType.Type = (string)value;
            else if (strFieldName == ItemType.Fields.RegTime.ToString())
                itemType.RegTime = (DateTime)value;
        }

        private static void ReadRackGroup(string strFieldName, object value, RackGroup rackGroup)
        {
            if (strFieldName == RackGroup.Fields.RackGroupNo.ToString())
                rackGroup.RackGroupNo = (int)value;
            else if (strFieldName == RackGroup.Fields.DataCenterNo.ToString())
                rackGroup.DataCenterNo = (int)value;
            else if (strFieldName == RackGroup.Fields.GroupName.ToString())
                rackGroup.GroupName = (string)value;
        }

        private static void ReadRack(string strFieldName, object value, Rack rack)
        {
            if (strFieldName == Rack.Fields.RackNo.ToString())
                rack.RackNo = (int)value;
            else if (strFieldName == Rack.Fields.RackName.ToString())
                rack.RackName = (string)value;
            else if (strFieldName == Rack.Fields.DataCenterNo.ToString())
                rack.DataCenterNo = (int)value;
            else if (strFieldName == Rack.Fields.RackGroupNo.ToString())
            {
                if (value == null)
                    rack.RackGroupNo = null;
                else
                    rack.RackGroupNo = (int)value;
            }
            else if (strFieldName == Rack.Fields.RackTypeNo.ToString())
                rack.RackTypeNo = (int)value;
            else if (strFieldName == Rack.Fields.Rotation.ToString())
                rack.Rotation = (double)value;
            else if (strFieldName == Rack.Fields.X.ToString())
                rack.X = (int)value;
            else if (strFieldName == Rack.Fields.Y.ToString())
                rack.Y = (int)value;
            else if (strFieldName == Rack.Fields.Z.ToString())
                rack.Z = (int)value;
            else if (strFieldName == Rack.Fields.RegTime.ToString())
                rack.RegTime = (DateTime)value;
            else if (strFieldName == Rack.Fields.Barcode.ToString())
                rack.Barcode = (string)value;
        }

        private static void ReadRackType(string strFieldName, object value, RackType rackType)
        {
            if (strFieldName == RackType.Fields.RackTypeNo.ToString())
                rackType.RackTypeNo = (int)value;
            else if (strFieldName == RackType.Fields.CompanyNo.ToString())
                rackType.CompanyNo = (int)value;
            else if (strFieldName == RackType.Fields.ModelName.ToString())
                rackType.ModelName = (string)value;
            else if (strFieldName == RackType.Fields.Height.ToString())
                rackType.Height = (int)value;
            else if (strFieldName == RackType.Fields.Width.ToString())
                rackType.Width = (int)value;
            else if (strFieldName == RackType.Fields.Depth.ToString())
                rackType.Depth = (int)value;
            else if (strFieldName == RackType.Fields.Unit.ToString())
                rackType.Unit = (int)value;
            else if (strFieldName == RackType.Fields.ImageUrl.ToString())
                rackType.ImageUrl = (string)value;
            else if (strFieldName == RackType.Fields.GlbUrl.ToString())
                rackType.GlbUrl = (string)value;
            else if (strFieldName == RackType.Fields.FbxUrl.ToString())
                rackType.FbxUrl = (string)value;
            else if (strFieldName == RackType.Fields.Type.ToString())
                rackType.Type = (string)value;
            else if (strFieldName == RackType.Fields.RegTime.ToString())
                rackType.RegTime = (DateTime)value;
            else if (strFieldName == RackType.Fields.Barcode.ToString())
                rackType.Barcode = (string)value;
        }

        private static void ReadDataCenter(string strFieldName, object value, ref DataCenter center)
        {
            if (strFieldName == DataCenter.Fields.DataCenterNo.ToString())
            {
                if (value == null)
                    center = null;
                else
                    center.DataCenterNo = (int)value;
            }
            else if (strFieldName == DataCenter.Fields.DataCenterName.ToString())
            {
                if (value == null)
                    center = null;
                else
                    center.DataCenterName = (string)value;
            }
            else if (strFieldName == DataCenter.Fields.RegionNo.ToString())
            {
                if (value == null)
                    center = null;
                else
                    center.RegionNo = (int)value;
            }
            else if (strFieldName == DataCenter.Fields.SiteNo.ToString())
            {
                if (value == null)
                    center = null;
                else
                    center.SiteNo = (int)value;
            }
            else if (strFieldName == DataCenter.Fields.Address.ToString())
            {
                if (value == null)
                    center = null;
                else
                    center.Address = (string)value;
            }
            else if (strFieldName == DataCenter.Fields.RegTime.ToString())
            {
                if (value == null)
                    center = null;
                else
                    center.RegTime = (DateTime)value;
            }
            else if (strFieldName == DataCenter.Fields.Width.ToString())
            {
                if (value == null)
                    center = null;
                else
                    center.Width = (int)value;
            }
            else if (strFieldName == DataCenter.Fields.Length.ToString())
            {
                if (value == null)
                    center = null;
                else
                    center.Length = (int)value;
            }
            else if (strFieldName == DataCenter.Fields.Height.ToString())
            {
                if (value == null)
                    center = null;
                else
                    center.Height = (int)value;
            }
            else if (strFieldName == DataCenter.Fields.TileWidth.ToString())
            {
                if (value == null)
                    center = null;
                else
                    center.TileWidth = (int)value;
            }
            else if (strFieldName == DataCenter.Fields.TileLength.ToString())
            {
                if (value == null)
                    center = null;
                else
                    center.TileLength = (int)value;
            }
            else if (strFieldName == DataCenter.Fields.TileElevation.ToString())
            {
                if (value == null)
                    center = null;
                else
                    center.TileElevation = (int)value;
            }
            else if (strFieldName == DataCenter.Fields.Latitude.ToString())
            {
                if (value == null)
                    center = null;
                else
                    center.Latitude = (double)value;
            }
            else if (strFieldName == DataCenter.Fields.Longitude.ToString())
            {
                if (value == null)
                    center = null;
                else
                    center.Longitude = (double)value;
            }
            else if (strFieldName == DataCenter.Fields.Barcode.ToString())
            {
                if (center == null)
                    return;

                center.Barcode = (string)value;
            }
        }

        private static void ReadRegion(string strFieldName, object value, Region region)
        {
            if (strFieldName == Region.Fields.RegionNo.ToString())
                region.RegionNo = (int)value;
            else if (strFieldName == Region.Fields.RegionName.ToString())
                region.RegionName = (string)value;
            else if (strFieldName == Region.Fields.ParentRegionNo.ToString())
            {
                if (value == null)
                    region.ParentRegionNo = null;
                else
                    region.ParentRegionNo = (int)value;
            }
        }

        private static void ReadLevel(string strFieldName, object value, Level level)
        {
            if (strFieldName == Level.Fields.AccountLevelNo.ToString())
                level.AccountLevelNo = (int)value;
            else if (strFieldName == Level.Fields.AccountLevelName.ToString())
                level.AccountLevelName = (string)value;
        }

        private static void ReadUser(string strFieldName, object value, User user)
        {
            if (strFieldName == User.Fields.AccountUserNo.ToString())
                user.AccountUserNo = (int)value;
            else if (strFieldName == User.Fields.AccountLevelNo.ToString())
                user.AccountLevelNo = (int)value;
            else if (strFieldName == User.Fields.Password.ToString())
                user.Password = (string)value;
            else if (strFieldName == User.Fields.UserID.ToString())
                user.UserID = (string)value;
            else if (strFieldName == User.Fields.NickName.ToString())
                user.NickName = (string)value;
            else if (strFieldName == User.Fields.PasswordCode.ToString())
                user.PasswordCode = (string)value;
            else if (strFieldName == User.Fields.Salt.ToString())
                user.Salt = (string)value;
        }

        private static void ReadSession(string strFieldName, object value, Session session)
        {
            if (strFieldName == Session.Fields.AccountUserNo.ToString())
                session.AccountUserNo = (int)value;
            else if (strFieldName == Session.Fields.SessionKey.ToString())
                session.SessionKey = (string)value;
            else if (strFieldName == Session.Fields.CreateTime.ToString())
                session.CreateTime = (DateTime)value;
            else if (strFieldName == Session.Fields.UpdateTime.ToString())
                session.UpdateTime = (DateTime)value;
        }
    }
}
