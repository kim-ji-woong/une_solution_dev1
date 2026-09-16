using System;
using System.Collections;
using System.Collections.Generic;
using dnsDapperDBUtil.DataAccessLayer.DAL;
using dnsDapperDBUtil.DataAccessLayer.IDAL;
using Base.Model.Sensor;
using Base.Model.Sensor.CCTV;
using Base.Model.Spatial;
using Base.Model.Alarm;
using Base.Model.Account;
using Base.Model.Sop.Component;
using Base.Model.Sop.Category;
using Base.Model.Common.Team;

namespace Base.DAL
{
    using Models;

    public class JoinManager : SelectManager
    {
        private IDataManager m_dataManager = null;

        public JoinManager(IDataManager dataManager)
            : base(dataManager)
        {
            m_dataManager = dataManager;
        }

        public ArrayList JoinSensorSensorZone(string strAdditionalConditions, out string strErrorMessage)
        {
            Sensor sensor = new Sensor();
            SensorZone sensorZone = new SensorZone();

            string strSQL = string.Format("Select a.*, b.* from {0} a inner join {1} b on a.{2} = b.{3}",
                sensor.GetTableName(), sensorZone.GetTableName(),
                Sensor.Fields.sensor_sn, SensorZone.Fields.sensor_sn);

            if (strAdditionalConditions != null && strAdditionalConditions.Length > 0)
            {
                if (strAdditionalConditions.ToLower().Trim().StartsWith("order by"))
                    strSQL += " " + strAdditionalConditions;
                else
                    strSQL += " where " + strAdditionalConditions;
            }

            ArrayList arrDatas = new ArrayList();
            IEnumerable<dynamic> result = this.Select(strSQL, out strErrorMessage);

            if (result == null)
                return null;

            int nSensorFieldCount = sensor.GetFieldCount();

            foreach (var item in result)
            {
                var data = item as IDictionary<string, object>;
                int nIndex = 0;

                sensor = new Sensor();
                sensorZone = new SensorZone();

                foreach (KeyValuePair<string, object> pair in data)
                {
                    if (nIndex < nSensorFieldCount)
                    {
                        ReadSensor(pair.Key, pair.Value, sensor);
                    }
                    else
                        ReadSensorZone(pair.Key, pair.Value, sensorZone);

                    nIndex++;
                }

                arrDatas.Add(sensor);
                arrDatas.Add(sensorZone);
            }

            return arrDatas;
        }

        public ArrayList JoinSensorSensorZoneSdmsCCTV(string strAdditionalConditions, out string strErrorMessage)
        {
            Sensor sensor = new Sensor();
            SensorZone sensorZone = new SensorZone();
            CCTV cctv = new CCTV();

            string strSQL = string.Format("Select a.*, b.*, c.* from {0} a inner join {1} b on a.{3} = b.{4} inner join {2} c on a.{3} = c.{5}",
                sensor.GetTableName(), sensorZone.GetTableName(), cctv.GetTableName(),
                Sensor.Fields.sensor_sn, SensorZone.Fields.sensor_sn, CCTV.Fields.sensor_sn);

            if (strAdditionalConditions != null && strAdditionalConditions.Length > 0)
            {
                if (strAdditionalConditions.ToLower().Trim().StartsWith("order by"))
                    strSQL += " " + strAdditionalConditions;
                else
                    strSQL += " where " + strAdditionalConditions;
            }

            ArrayList arrDatas = new ArrayList();
            IEnumerable<dynamic> result = this.Select(strSQL, out strErrorMessage);

            if (result == null)
                return null;

            int nSensorFieldCount = sensor.GetFieldCount();
            int nSensorZoneFieldCount = sensor.GetFieldCount();

            foreach (var item in result)
            {
                var data = item as IDictionary<string, object>;
                int nIndex = 0;

                sensor = new Sensor();
                sensorZone = new SensorZone();
                cctv = new CCTV();

                foreach (KeyValuePair<string, object> pair in data)
                {
                    if (nIndex < nSensorFieldCount)
                    {
                        ReadSensor(pair.Key, pair.Value, sensor);
                    }
                    else if (nIndex < nSensorFieldCount + nSensorZoneFieldCount)
                    {
                        ReadSensorZone(pair.Key, pair.Value, sensorZone);
                    }
                    else
                        ReadCCTV(pair.Key, pair.Value, cctv);

                    nIndex++;
                }

                arrDatas.Add(sensor);
                arrDatas.Add(sensorZone);
            }

            return arrDatas;
        }

        public ArrayList JoinSensorZoneEquipZoneCCTVSensorZoneCCTVEquipmentZone(string strAdditionalConditions, out string strErrorMessage)
        {
            SensorZone sensorZone = new SensorZone();
            EquipZoneCCTV equipZoneCCTV = new EquipZoneCCTV();
            SensorZoneCCTV sensorZoneCCTV = new SensorZoneCCTV();
            EquipmentZone equipZone = new EquipmentZone();

            string strSQL = string.Format("Select a.*, b.*, c.*, d.* from {0} a left outer join {1} b on a.{4} = b.{5} left outer join {2} c on a.{6} = c.{7} left outer join {3} d on a.{4} = d.{8}",
                sensorZone.GetTableName(), equipZoneCCTV.GetTableName(), sensorZoneCCTV.GetTableName(), equipZone.GetTableName(),
                SensorZone.Fields.eqp_zone_sn, EquipZoneCCTV.Fields.eqp_zone_sn,
                SensorZone.Fields.sensor_zone_sn, SensorZoneCCTV.Fields.sensor_zone_sn,
                EquipmentZone.Fields.eqp_zone_sn);

            if (strAdditionalConditions != null && strAdditionalConditions.Length > 0)
            {
                if (strAdditionalConditions.ToLower().Trim().StartsWith("order by"))
                    strSQL += " " + strAdditionalConditions;
                else
                    strSQL += " where " + strAdditionalConditions;
            }

            ArrayList arrDatas = new ArrayList();
            IEnumerable<dynamic> result = this.Select(strSQL, out strErrorMessage);

            if (result == null)
                return null;

            int nSensorZoneFieldCount = sensorZone.GetFieldCount();
            int nEquipZoneCCTVFieldCount = equipZoneCCTV.GetFieldCount();
            int nSensorZoneCCTVFieldCount = sensorZoneCCTV.GetFieldCount();

            foreach (var item in result)
            {
                var data = item as IDictionary<string, object>;
                int nIndex = 0;

                sensorZone = new SensorZone();
                equipZoneCCTV = new EquipZoneCCTV();
                sensorZoneCCTV = new SensorZoneCCTV();
                equipZone = new EquipmentZone();

                foreach (KeyValuePair<string, object> pair in data)
                {
                    if (nIndex < nSensorZoneFieldCount)
                    {
                        ReadSensorZone(pair.Key, pair.Value, sensorZone);
                    }
                    else if (nIndex < nSensorZoneFieldCount + nEquipZoneCCTVFieldCount)
                    {
                        ReadEquipZoneCCTV(pair.Key, pair.Value, ref equipZoneCCTV);
                    }
                    else if (nIndex < nSensorZoneFieldCount + nEquipZoneCCTVFieldCount + nSensorZoneCCTVFieldCount)
                    {
                        ReadSensorZoneCCTV(pair.Key, pair.Value, ref sensorZoneCCTV);
                    }
                    else
                        ReadEquipmentZone(pair.Key, pair.Value, ref equipZone);

                    nIndex++;
                }

                arrDatas.Add(sensorZone);
                arrDatas.Add(equipZoneCCTV);
                arrDatas.Add(sensorZoneCCTV);
                arrDatas.Add(equipZone);
            }

            return arrDatas;
        }

        public ArrayList JoinSensorZoneSensorEquipZoneCCTVSensorZoneCCTVEquipmentZone(string strAdditionalConditions, out string strErrorMessage)
        {
            SensorZone sensorZone = new SensorZone();
            Sensor sensor = new Sensor();
            EquipZoneCCTV equipZoneCCTV = new EquipZoneCCTV();
            SensorZoneCCTV sensorZoneCCTV = new SensorZoneCCTV();
            EquipmentZone equipZone = new EquipmentZone();

            string strSQL = string.Format("Select a.*, b.*, c.*, d.*, e.* from {0} a inner join {9} e on a.{10} = e.{11} left outer join {1} b on a.{4} = b.{5} left outer join {2} c on a.{6} = c.{7} left outer join {3} d on a.{4} = d.{8}",
                sensorZone.GetTableName(), equipZoneCCTV.GetTableName(), sensorZoneCCTV.GetTableName(), equipZone.GetTableName(),
                SensorZone.Fields.eqp_zone_sn, EquipZoneCCTV.Fields.eqp_zone_sn,
                SensorZone.Fields.sensor_zone_sn, SensorZoneCCTV.Fields.sensor_zone_sn,
                EquipmentZone.Fields.eqp_zone_sn,
                sensor.GetTableName(),
                SensorZone.Fields.sensor_sn, Sensor.Fields.sensor_sn);

            if (strAdditionalConditions != null && strAdditionalConditions.Length > 0)
            {
                if (strAdditionalConditions.ToLower().Trim().StartsWith("order by"))
                    strSQL += " " + strAdditionalConditions;
                else
                    strSQL += " where " + strAdditionalConditions;
            }

            ArrayList arrDatas = new ArrayList();
            IEnumerable<dynamic> result = this.Select(strSQL, out strErrorMessage);

            if (result == null)
                return null;

            int nSensorZoneFieldCount = sensorZone.GetFieldCount();
            int nEquipZoneCCTVFieldCount = equipZoneCCTV.GetFieldCount();
            int nSensorZoneCCTVFieldCount = sensorZoneCCTV.GetFieldCount();
            int nEquipZoneFieldCount = equipZone.GetFieldCount();

            foreach (var item in result)
            {
                var data = item as IDictionary<string, object>;
                int nIndex = 0;

                sensorZone = new SensorZone();
                sensor = new Sensor();
                equipZoneCCTV = new EquipZoneCCTV();
                sensorZoneCCTV = new SensorZoneCCTV();
                equipZone = new EquipmentZone();

                foreach (KeyValuePair<string, object> pair in data)
                {
                    if (nIndex < nSensorZoneFieldCount)
                    {
                        ReadSensorZone(pair.Key, pair.Value, sensorZone);
                    }
                    else if (nIndex < nSensorZoneFieldCount + nEquipZoneCCTVFieldCount)
                    {
                        ReadEquipZoneCCTV(pair.Key, pair.Value, ref equipZoneCCTV);
                    }
                    else if (nIndex < nSensorZoneFieldCount + nEquipZoneCCTVFieldCount + nSensorZoneCCTVFieldCount)
                    {
                        ReadSensorZoneCCTV(pair.Key, pair.Value, ref sensorZoneCCTV);
                    }
                    else if (nIndex < nSensorZoneFieldCount + nEquipZoneCCTVFieldCount + nSensorZoneCCTVFieldCount + nEquipZoneFieldCount)
                    {
                        ReadEquipmentZone(pair.Key, pair.Value, ref equipZone);
                    }
                    else
                        ReadSensor(pair.Key, pair.Value, sensor);

                    nIndex++;
                }

                arrDatas.Add(sensorZone);
                arrDatas.Add(sensor);
                arrDatas.Add(equipZoneCCTV);
                arrDatas.Add(sensorZoneCCTV);
                arrDatas.Add(equipZone);
            }

            return arrDatas;
        }

        public ArrayList JoinSensorZoneHistorySensorZoneHistoryDetail(string strAdditionalConditions, out string strErrorMessage)
        {
            Base.Model.History.SensorZone sensorZoneHistory = new Base.Model.History.SensorZone();
            Base.Model.History.SensorZoneDetail sensorZoneHistoryList = new Base.Model.History.SensorZoneDetail();

            string strSQL = string.Format("Select a.*, b.* from {0} a inner join {1} b on a.{2} = b.{3}",
                sensorZoneHistory.GetTableName(), sensorZoneHistoryList.GetTableName(),
                Base.Model.History.SensorZone.Fields.sensor_zone_hist_sn, Base.Model.History.SensorZoneDetail.Fields.sensor_zone_hist_sn);

            if (strAdditionalConditions != null && strAdditionalConditions.Length > 0)
            {
                if (strAdditionalConditions.ToLower().Trim().StartsWith("order by"))
                    strSQL += " " + strAdditionalConditions;
                else
                    strSQL += " where " + strAdditionalConditions;
            }

            ArrayList arrDatas = new ArrayList();
            IEnumerable<dynamic> result = this.Select(strSQL, out strErrorMessage);

            if (result == null)
                return null;

            int nSensorZoneHistoryFieldCount = sensorZoneHistory.GetFieldCount();

            foreach (var item in result)
            {
                var data = item as IDictionary<string, object>;
                int nIndex = 0;

                sensorZoneHistory = new Base.Model.History.SensorZone();
                sensorZoneHistoryList = new Base.Model.History.SensorZoneDetail();

                foreach (KeyValuePair<string, object> pair in data)
                {
                    if (nIndex < nSensorZoneHistoryFieldCount)
                    {
                        ReadSensorZoneHistory(pair.Key, pair.Value, sensorZoneHistory);
                    }
                    else
                    {
                        ReadSensorZoneHistoryDetail(pair.Key, pair.Value, sensorZoneHistoryList);
                    }

                    nIndex++;
                }

                arrDatas.Add(sensorZoneHistory);
                arrDatas.Add(sensorZoneHistoryList);
            }

            return arrDatas;
        }

        public ArrayList JoinSensorZoneHistorySensorZoneHistoryDetailSensorZone(string strAdditionalConditions, out string strErrorMessage)
        {
            Model.History.SensorZone sensorZoneHistory = new Model.History.SensorZone();
            Model.History.SensorZoneDetail sensorZoneHistoryDetail = new Model.History.SensorZoneDetail();
            SensorZone sensorZone = new SensorZone();

            string strSQL = string.Format("Select a.*, b.*, c.* from {0} a inner join {1} b on a.{3} = b.{4} inner join {2} c on b.{5} = c.{6}",
                sensorZoneHistory.GetTableName(), sensorZoneHistoryDetail.GetTableName(), SensorZone.TableName,
                Model.History.SensorZone.Fields.sensor_zone_hist_sn, Model.History.SensorZoneDetail.Fields.sensor_zone_hist_sn,
                Model.History.SensorZoneDetail.Fields.sensor_zone_sn, SensorZone.Fields.sensor_zone_sn);

            if (strAdditionalConditions != null && strAdditionalConditions.Length > 0)
            {
                if (strAdditionalConditions.ToLower().Trim().StartsWith("order by"))
                    strSQL += " " + strAdditionalConditions;
                else
                    strSQL += " where " + strAdditionalConditions;
            }

            ArrayList arrDatas = new ArrayList();
            IEnumerable<dynamic> result = this.Select(strSQL, out strErrorMessage);

            if (result == null)
                return null;

            int nSensorZoneHistoryFieldCount = sensorZoneHistory.GetFieldCount();
            int nSensorZoneHistoryDetailFieldCount = sensorZoneHistoryDetail.GetFieldCount();

            foreach (var item in result)
            {
                var data = item as IDictionary<string, object>;
                int nIndex = 0;

                sensorZoneHistory = new Model.History.SensorZone();
                sensorZoneHistoryDetail = new Model.History.SensorZoneDetail();
                sensorZone = new SensorZone();

                foreach (KeyValuePair<string, object> pair in data)
                {
                    if (nIndex < nSensorZoneHistoryFieldCount)
                    {
                        ReadSensorZoneHistory(pair.Key, pair.Value, sensorZoneHistory);
                    }
                    else if (nIndex < nSensorZoneHistoryFieldCount + nSensorZoneHistoryDetailFieldCount)
                    {
                        ReadSensorZoneHistoryDetail(pair.Key, pair.Value, sensorZoneHistoryDetail);
                    }
                    else
                    {
                        ReadSensorZone(pair.Key, pair.Value, sensorZone);
                    }

                    nIndex++;
                }

                arrDatas.Add(sensorZoneHistory);
                arrDatas.Add(sensorZoneHistoryDetail);
                arrDatas.Add(sensorZone);
            }

            return arrDatas;
        }

        public ArrayList JoinSensorZoneHistorySensorZoneHistoryDetailSensorZoneEquipmentZone(string strAdditionalConditions, out string strErrorMessage)
        {
            Model.History.SensorZone sensorZoneHistory = new Model.History.SensorZone();
            Model.History.SensorZoneDetail sensorZoneHistoryDetail = new Model.History.SensorZoneDetail();
            SensorZone sensorZone = new SensorZone();
            EquipmentZone equipZone = new EquipmentZone();

            string strSQL = string.Format("Select a.*, b.*, c.*, d.* from {0} a inner join {1} b on a.{4} = b.{5} inner join {2} c on b.{6} = c.{7} left outer join {3} d on c.{8} = d.{9}",
                sensorZoneHistory.GetTableName(), sensorZoneHistoryDetail.GetTableName(), SensorZone.TableName, EquipmentZone.TableName,
                Model.History.SensorZone.Fields.sensor_zone_hist_sn, Model.History.SensorZoneDetail.Fields.sensor_zone_hist_sn,
                Model.History.SensorZoneDetail.Fields.sensor_zone_sn, SensorZone.Fields.sensor_zone_sn,
                SensorZone.Fields.eqp_zone_sn, EquipmentZone.Fields.eqp_zone_sn);

            if (strAdditionalConditions != null && strAdditionalConditions.Length > 0)
            {
                if (strAdditionalConditions.ToLower().Trim().StartsWith("order by"))
                    strSQL += " " + strAdditionalConditions;
                else
                    strSQL += " where " + strAdditionalConditions;
            }

            ArrayList arrDatas = new ArrayList();
            IEnumerable<dynamic> result = this.Select(strSQL, out strErrorMessage);

            if (result == null)
                return null;

            int nSensorZoneHistoryFieldCount = sensorZoneHistory.GetFieldCount();
            int nSensorZoneHistoryDetailFieldCount = sensorZoneHistoryDetail.GetFieldCount();
            int nSensorZoneFieldCount = sensorZone.GetFieldCount();

            foreach (var item in result)
            {
                var data = item as IDictionary<string, object>;
                int nIndex = 0;

                sensorZoneHistory = new Model.History.SensorZone();
                sensorZoneHistoryDetail = new Model.History.SensorZoneDetail();
                sensorZone = new SensorZone();
                equipZone = new EquipmentZone();

                foreach (KeyValuePair<string, object> pair in data)
                {
                    if (nIndex < nSensorZoneHistoryFieldCount)
                    {
                        ReadSensorZoneHistory(pair.Key, pair.Value, sensorZoneHistory);
                    }
                    else if (nIndex < nSensorZoneHistoryFieldCount + nSensorZoneHistoryDetailFieldCount)
                    {
                        ReadSensorZoneHistoryDetail(pair.Key, pair.Value, sensorZoneHistoryDetail);
                    }
                    else if (nIndex < nSensorZoneHistoryFieldCount + nSensorZoneHistoryDetailFieldCount + nSensorZoneFieldCount)
                    {
                        ReadSensorZone(pair.Key, pair.Value, sensorZone);
                    }
                    else
                    {
                        ReadEquipmentZone(pair.Key, pair.Value, ref equipZone);
                    }

                    nIndex++;
                }

                arrDatas.Add(sensorZoneHistory);
                arrDatas.Add(sensorZoneHistoryDetail);
                arrDatas.Add(sensorZone);
                arrDatas.Add(equipZone);
            }

            return arrDatas;
        }

        public ArrayList JoinCurrentAlarmSensorZone(string strAdditionalConditions, out string strErrorMessage)
        {
            Current alarm = new Current();
            SensorZone sensorZone = new SensorZone();

            string strSQL = string.Format("Select a.*, b.* from {0} a inner join {1} b on a.{2} = b.{3}",
                alarm.GetTableName(), sensorZone.GetTableName(),
                Current.Fields.sensor_zone_sn, SensorZone.Fields.sensor_zone_sn);

            if (strAdditionalConditions != null && strAdditionalConditions.Length > 0)
            {
                if (strAdditionalConditions.ToLower().Trim().StartsWith("order by"))
                    strSQL += " " + strAdditionalConditions;
                else
                    strSQL += " where " + strAdditionalConditions;
            }

            ArrayList arrDatas = new ArrayList();
            IEnumerable<dynamic> result = this.Select(strSQL, out strErrorMessage);

            if (result == null)
                return null;

            int nAlarmFieldCount = alarm.GetFieldCount();

            foreach (var item in result)
            {
                var data = item as IDictionary<string, object>;
                int nIndex = 0;

                alarm = new Current();
                sensorZone = new SensorZone();

                foreach (KeyValuePair<string, object> pair in data)
                {
                    if (nIndex < nAlarmFieldCount)
                    {
                        ReadAlarm(pair.Key, pair.Value, alarm);
                    }
                    else
                    {
                        ReadSensorZone(pair.Key, pair.Value, sensorZone);
                    }

                    nIndex++;
                }

                arrDatas.Add(alarm);
                arrDatas.Add(sensorZone);
            }

            return arrDatas;
        }

        public ArrayList JoinSensorCCTV(string strAdditionalConditions, out string strErrorMessage)
        {
            Sensor sensor = new Sensor();
            CCTV cctv = new CCTV();

            string strSQL = string.Format("Select a.*, b.* from {0} a inner join {1} b on a.{2} = b.{3}",
                sensor.GetTableName(), cctv.GetTableName(),
                Sensor.Fields.sensor_sn, CCTV.Fields.sensor_sn);

            if (strAdditionalConditions != null && strAdditionalConditions.Length > 0)
            {
                if (strAdditionalConditions.ToLower().Trim().StartsWith("order by"))
                    strSQL += " " + strAdditionalConditions;
                else
                    strSQL += " where " + strAdditionalConditions;
            }

            ArrayList arrDatas = new ArrayList();
            IEnumerable<dynamic> result = this.Select(strSQL, out strErrorMessage);

            if (result == null)
                return null;

            int nSensorFieldCount = sensor.GetFieldCount();

            foreach (var item in result)
            {
                var data = item as IDictionary<string, object>;
                int nIndex = 0;

                sensor = new Sensor();
                cctv = new CCTV();

                foreach (KeyValuePair<string, object> pair in data)
                {
                    if (nIndex < nSensorFieldCount)
                    {
                        ReadSensor(pair.Key, pair.Value, sensor);
                    }
                    else
                    {
                        ReadCCTV(pair.Key, pair.Value, cctv);
                    }

                    nIndex++;
                }

                arrDatas.Add(sensor);
                arrDatas.Add(cctv);
            }

            return arrDatas;
        }

        public ArrayList JoinSensorZoneMaterialSensor(string strAdditionalConditions, out string strErrorMessage)
        {
            SensorZone sensorZone = new SensorZone();
            Material material = new Material();

            string strSQL = string.Format("Select a.*, b.* from {0} a left outer join {1} b on a.{2} = b.{3}",
                sensorZone.GetTableName(), material.GetTableName(),
                SensorZone.Fields.sensor_zone_sn, Material.Fields.sensor_zone_sn);

            if (strAdditionalConditions != null && strAdditionalConditions.Length > 0)
            {
                if (strAdditionalConditions.ToLower().Trim().StartsWith("order by"))
                    strSQL += " " + strAdditionalConditions;
                else
                    strSQL += " where " + strAdditionalConditions;
            }

            ArrayList arrDatas = new ArrayList();
            IEnumerable<dynamic> result = this.Select(strSQL, out strErrorMessage);

            if (result == null)
                return null;

            int nSensorZoneFieldCount = sensorZone.GetFieldCount();

            foreach (var item in result)
            {
                var data = item as IDictionary<string, object>;
                int nIndex = 0;

                sensorZone = new SensorZone();
                material = new Material();

                foreach (KeyValuePair<string, object> pair in data)
                {
                    if (nIndex < nSensorZoneFieldCount)
                        ReadSensorZone(pair.Key, pair.Value, sensorZone);
                    else
                        ReadMaterial(pair.Key, pair.Value, ref material);

                    nIndex++;
                }

                arrDatas.Add(sensorZone);
                arrDatas.Add(material);
            }

            return arrDatas;
        }

        public ArrayList JoinSensorSensorZoneMaterialSensor(string strAdditionalConditions, out string strErrorMessage)
        {
            Sensor sensor = new Sensor();
            SensorZone sensorZone = new SensorZone();
            Material material = new Material();

            string strSQL = string.Format("Select a.*, b.*, c.* from {0} a inner join {1} b on a.{3} = b.{4} left outer join {2} c on b.{5} = c.{6}",
                sensor.GetTableName(), sensorZone.GetTableName(), material.GetTableName(),
                Sensor.Fields.sensor_sn, SensorZone.Fields.sensor_sn,
                SensorZone.Fields.sensor_zone_sn, Material.Fields.sensor_zone_sn);

            if (strAdditionalConditions != null && strAdditionalConditions.Length > 0)
            {
                if (strAdditionalConditions.ToLower().Trim().StartsWith("order by"))
                    strSQL += " " + strAdditionalConditions;
                else
                    strSQL += " where " + strAdditionalConditions;
            }

            ArrayList arrDatas = new ArrayList();
            IEnumerable<dynamic> result = this.Select(strSQL, out strErrorMessage);

            if (result == null)
                return null;

            int nSensorFieldCount = sensor.GetFieldCount();
            int nSensorZoneFieldCount = sensorZone.GetFieldCount();

            foreach (var item in result)
            {
                var data = item as IDictionary<string, object>;
                int nIndex = 0;

                sensor = new Sensor();
                sensorZone = new SensorZone();
                material = new Material();

                foreach (KeyValuePair<string, object> pair in data)
                {
                    if (nIndex < nSensorFieldCount)
                        ReadSensor(pair.Key, pair.Value, sensor);
                    else if (nIndex < nSensorFieldCount + nSensorZoneFieldCount)
                        ReadSensorZone(pair.Key, pair.Value, sensorZone);
                    else
                        ReadMaterial(pair.Key, pair.Value, ref material);

                    nIndex++;
                }

                arrDatas.Add(sensor);
                arrDatas.Add(sensorZone);
                arrDatas.Add(material);
            }

            return arrDatas;
        }

        public ArrayList JoinVersionUser(string strAdditionalConditions, out string strErrorMessage)
        {
            Base.Model.Sop.Category.Version version = new Base.Model.Sop.Category.Version();
            User user = new User();

            string strSQL = string.Format("Select a.*, b.* from {0} a left outer join {1} b on a.{2} = b.{3}",
                version.GetTableName(), user.GetTableName(),
                Base.Model.Sop.Category.Version.Fields.user_sn, User.Fields.user_sn);

            if (strAdditionalConditions != null && strAdditionalConditions.Length > 0)
            {
                if (strAdditionalConditions.ToLower().Trim().StartsWith("order by"))
                    strSQL += " " + strAdditionalConditions;
                else
                    strSQL += " where " + strAdditionalConditions;
            }

            ArrayList arrDatas = new ArrayList();
            IEnumerable<dynamic> result = this.Select(strSQL, out strErrorMessage);

            if (result == null)
                return null;

            int nVersionFieldCount = version.GetFieldCount();

            foreach (var item in result)
            {
                var data = item as IDictionary<string, object>;
                int nIndex = 0;

                version = new Base.Model.Sop.Category.Version();
                user = new User();

                foreach (KeyValuePair<string, object> pair in data)
                {
                    if (nIndex < nVersionFieldCount)
                        ReadVersion(pair.Key, pair.Value, ref version);
                    else
                        ReadUser(pair.Key, pair.Value, ref user);

                    nIndex++;
                }

                arrDatas.Add(version);
                arrDatas.Add(user);
            }

            return arrDatas;
        }

        public ArrayList JoinSectionGridGridColumn(string strAdditionalConditions, out string strErrorMessage)
        {
            Grid grid = new Grid();
            GridColumn column = new GridColumn();

            string strSQL = string.Format("Select a.*, b.* from {0} a inner join {1} b on a.{2} = b.{3}",
                grid.GetTableName(), column.GetTableName(),
                Grid.Fields.grid_sn, GridColumn.Fields.grid_sn);

            if (strAdditionalConditions != null && strAdditionalConditions.Length > 0)
            {
                if (strAdditionalConditions.ToLower().Trim().StartsWith("order by"))
                    strSQL += " " + strAdditionalConditions;
                else
                    strSQL += " where " + strAdditionalConditions;
            }

            ArrayList arrDatas = new ArrayList();
            IEnumerable<dynamic> result = this.Select(strSQL, out strErrorMessage);

            if (result == null)
                return null;

            int nGridFieldCount = grid.GetFieldCount();

            foreach (var item in result)
            {
                var data = item as IDictionary<string, object>;
                int nIndex = 0;

                grid = new Grid();
                column = new GridColumn();

                foreach (KeyValuePair<string, object> pair in data)
                {
                    if (nIndex < nGridFieldCount)
                        ReadSectionGrid(pair.Key, pair.Value, grid);
                    else
                        ReadSectionGridColumn(pair.Key, pair.Value, column);

                    nIndex++;
                }

                arrDatas.Add(grid);
                arrDatas.Add(column);
            }

            return arrDatas;
        }

        public ArrayList JoinSectionGridGridRow(string strAdditionalConditions, out string strErrorMessage)
        {
            Grid grid = new Grid();
            GridRow row = new GridRow();

            string strSQL = string.Format("Select a.*, b.* from {0} a inner join {1} b on a.{2} = b.{3}",
                grid.GetTableName(), row.GetTableName(),
                Grid.Fields.grid_sn, GridRow.Fields.grid_sn);

            if (strAdditionalConditions != null && strAdditionalConditions.Length > 0)
            {
                if (strAdditionalConditions.ToLower().Trim().StartsWith("order by"))
                    strSQL += " " + strAdditionalConditions;
                else
                    strSQL += " where " + strAdditionalConditions;
            }

            ArrayList arrDatas = new ArrayList();
            IEnumerable<dynamic> result = this.Select(strSQL, out strErrorMessage);

            if (result == null)
                return null;

            int nGridFieldCount = grid.GetFieldCount();

            foreach (var item in result)
            {
                var data = item as IDictionary<string, object>;
                int nIndex = 0;

                grid = new Grid();
                row = new GridRow();

                foreach (KeyValuePair<string, object> pair in data)
                {
                    if (nIndex < nGridFieldCount)
                        ReadSectionGrid(pair.Key, pair.Value, grid);
                    else
                        ReadSectionGridRow(pair.Key, pair.Value, row);

                    nIndex++;
                }

                arrDatas.Add(grid);
                arrDatas.Add(row);
            }

            return arrDatas;
        }

        public ArrayList JoinSectionComponentSectionAnnotationDecisionEndPointProcessTransmission(string strAdditionalConditions, out string strErrorMessage)
        {
            Component section = new Component();
            Comment comment = new Comment();
            Decision decision = new Decision();
            Endpoint endpoint = new Endpoint();
            Process process = new Process();
            Transmission transmission = new Transmission();

            string strFormat = "Select a.*, b.*, c.*, d.*, e.*, f.* from {0} a left outer join {1} b on a.{6} = b.{7} ";
            strFormat += "left outer join {2} c on a.{6} = c.{8} ";
            strFormat += "left outer join {3} d on a.{6} = d.{9} ";
            strFormat += "left outer join {4} e on a.{6} = e.{10} ";
            strFormat += "left outer join {5} f on a.{6} = f.{11}";

            string strSQL = string.Format(strFormat,
                Component.TableName, Comment.TableName, Decision.TableName, Endpoint.TableName, Process.TableName, Transmission.TableName,
                Component.Fields.compn_sn,
                Comment.Fields.compn_sn,
                Endpoint.Fields.compn_sn,
                Decision.Fields.compn_sn,
                Process.Fields.compn_sn,
                Transmission.Fields.compn_sn);

            if (strAdditionalConditions != null && strAdditionalConditions.Length > 0)
            {
                if (strAdditionalConditions.ToLower().Trim().StartsWith("order by"))
                    strSQL += " " + strAdditionalConditions;
                else
                    strSQL += " where " + strAdditionalConditions;
            }

            ArrayList arrDatas = new ArrayList();
            IEnumerable<dynamic> result = this.Select(strSQL, out strErrorMessage);

            if (result == null)
                return null;

            int nSectionFieldCount = section.GetFieldCount();
            int nAnnotationFieldCount = comment.GetFieldCount();
            int nDecisionFieldCount = decision.GetFieldCount();
            int nEndPointFieldCount = endpoint.GetFieldCount();
            int nProcessFieldCount = process.GetFieldCount();

            foreach (var item in result)
            {
                var data = item as IDictionary<string, object>;
                int nIndex = 0;

                section = new Component();
                comment = new Comment();
                decision = new Decision();
                endpoint = new Endpoint();
                process = new Process();
                transmission = new Transmission();

                foreach (KeyValuePair<string, object> pair in data)
                {
                    if (nIndex < nSectionFieldCount)
                        ReadSectionComponent(pair.Key, pair.Value, section);
                    else if (nIndex < nSectionFieldCount + nAnnotationFieldCount)
                        ReadSectionComponentComment(pair.Key, pair.Value, ref comment);
                    else if (nIndex < nSectionFieldCount + nAnnotationFieldCount + nDecisionFieldCount)
                        ReadSectionComponentDecision(pair.Key, pair.Value, ref decision);
                    else if (nIndex < nSectionFieldCount + nAnnotationFieldCount + nDecisionFieldCount + nEndPointFieldCount)
                        ReadSectionComponentEndpoint(pair.Key, pair.Value, ref endpoint);
                    else if (nIndex < nSectionFieldCount + nAnnotationFieldCount + nDecisionFieldCount + nEndPointFieldCount + nProcessFieldCount)
                        ReadSectionComponentProcess(pair.Key, pair.Value, ref process);
                    else
                        ReadSectionComponentTransmission(pair.Key, pair.Value, ref transmission);

                    nIndex++;
                }

                arrDatas.Add(section);
                arrDatas.Add(comment);
                arrDatas.Add(decision);
                arrDatas.Add(endpoint);
                arrDatas.Add(process);
                arrDatas.Add(transmission);
            }

            return arrDatas;
        }

        public ArrayList JoinDisasterVersionUser(int nDisasterNo, out string strErrorMessage)
        {
            string strCollate = "";

            if (m_dbManager.DatabaseType == dnsDapperDBUtil.Manager.WebDBManager.DBType.sqlserver)
            {
                // SQL 서버에서 DB Server가 한글 OS가 아닐 경우 Collate 에러가 발생하는것을 방지한다.
                strCollate = "collate Korean_Wansung_CI_AS";
            }

            string strCondition = string.Format("concat(concat(a.{1} {0}, '/') {0}, a.{2}) in (Select concat(concat({1} {0}, '/') {0}, {2}) from {3} where {4} = {5})",
                strCollate,
                SmallClass.Fields.sclas_name,
                SmallClass.Fields.mclas_sn,
                SmallClass.TableName,
                SmallClass.Fields.sclas_sn,
                nDisasterNo);

            return JoinDisasterVersionUser(strCondition, out strErrorMessage);
        }

        public ArrayList JoinDisasterVersionUser(string strAdditionalConditions, out string strErrorMessage)
        {
            SmallClass disaster = new SmallClass();
            Model.Sop.Category.Version version = new Model.Sop.Category.Version();
            User user = new User();

            string strSQL = string.Format("Select a.*, b.*, c.* from {0} a inner join {1} b on a.{3} = b.{4} left outer join {2} c on b.{5} = c.{6}",
                SmallClass.TableName, Model.Sop.Category.Version.TableName, User.TableName,
                SmallClass.Fields.ver_sn,
                Model.Sop.Category.Version.Fields.ver_sn,
                Model.Sop.Category.Version.Fields.user_sn,
                User.Fields.user_sn);

            if (strAdditionalConditions != null && strAdditionalConditions.Length > 0)
            {
                if (strAdditionalConditions.ToLower().Trim().StartsWith("order by"))
                    strSQL += " " + strAdditionalConditions;
                else
                    strSQL += " where " + strAdditionalConditions;
            }

            ArrayList arrDatas = new ArrayList();
            IEnumerable<dynamic> result = this.Select(strSQL, out strErrorMessage);

            if (result == null)
                return null;

            int nDisasterFieldCount = disaster.GetFieldCount();
            int nVersionFieldCount = version.GetFieldCount();

            foreach (var item in result)
            {
                var data = item as IDictionary<string, object>;
                int nIndex = 0;

                disaster = new SmallClass();
                version = new Model.Sop.Category.Version();
                user = new User();

                foreach (KeyValuePair<string, object> pair in data)
                {
                    if (nIndex < nDisasterFieldCount)
                        ReadDisaster(pair.Key, pair.Value, disaster);
                    else if (nIndex < nDisasterFieldCount + nVersionFieldCount)
                        ReadVersion(pair.Key, pair.Value, ref version);
                    else
                        ReadUser(pair.Key, pair.Value, ref user);

                    nIndex++;
                }

                arrDatas.Add(disaster);
                arrDatas.Add(version);
                arrDatas.Add(user);
            }

            return arrDatas;
        }

        public ArrayList JoinSessionUserGrade(string strAdditionalConditions, out string strErrorMessage)
        {
            Session session = new Session();
            User user = new User();
            Grade grade = new Grade();

            string strSQL = string.Format("Select a.*, b.*, c.* from {0} a inner join {1} b on a.{3} = b.{4} inner join {2} c on b.{5} = c.{6}",
                Session.TableName, User.TableName, Grade.TableName,
                Session.Fields.user_sn,
                User.Fields.user_sn,
                User.Fields.grad_sn,
                Grade.Fields.grad_sn);

            if (strAdditionalConditions != null && strAdditionalConditions.Length > 0)
            {
                if (strAdditionalConditions.ToLower().Trim().StartsWith("order by"))
                    strSQL += " " + strAdditionalConditions;
                else
                    strSQL += " where " + strAdditionalConditions;
            }

            ArrayList arrDatas = new ArrayList();
            IEnumerable<dynamic> result = this.Select(strSQL, out strErrorMessage);

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
                grade = new Grade();

                foreach (KeyValuePair<string, object> pair in data)
                {
                    if (nIndex < nSessionFieldCount)
                        ReadSession(pair.Key, pair.Value, session);
                    else if (nIndex < nSessionFieldCount + nUserFieldCount)
                        ReadUser(pair.Key, pair.Value, ref user);
                    else
                        ReadUserGrade(pair.Key, pair.Value, grade);

                    nIndex++;
                }

                arrDatas.Add(session);
                arrDatas.Add(user);
                arrDatas.Add(grade);
            }

            return arrDatas;
        }

        public ArrayList JoinDisasterCategorySubDisasterCategoryDisasterVersionUser(string strAdditionalConditions, out string strErrorMessage)
        {
            LargeClass dc = new LargeClass();
            MiddleClass sdc = new MiddleClass();
            SmallClass disaster = new SmallClass();
            User user = new User();
            Model.Sop.Category.Version version = new Model.Sop.Category.Version();

            string strSQL = string.Format("Select a.*, b.*, c.*, d.*, e.* from {0} a inner join {1} b on a.{5} = b.{6} inner join {2} c on b.{7} = c.{8} inner join {3} d on c.{9} = d.{10} left outer join {4} e on d.{11} = e.{12}",
                LargeClass.TableName, MiddleClass.TableName, SmallClass.TableName, Model.Sop.Category.Version.TableName, User.TableName,
                LargeClass.Fields.lclas_sn, MiddleClass.Fields.lclas_sn,
                MiddleClass.Fields.mclas_sn, SmallClass.Fields.mclas_sn,
                SmallClass.Fields.ver_sn, Model.Sop.Category.Version.Fields.ver_sn,
                Model.Sop.Category.Version.Fields.user_sn, User.Fields.user_sn);

            if (strAdditionalConditions != null && strAdditionalConditions.Length > 0)
            {
                if (strAdditionalConditions.ToLower().Trim().StartsWith("order by"))
                    strSQL += " " + strAdditionalConditions;
                else
                    strSQL += " where " + strAdditionalConditions;
            }

            ArrayList arrDatas = new ArrayList();
            IEnumerable<dynamic> result = this.Select(strSQL, out strErrorMessage);

            if (result == null)
                return null;

            int nDisasterCategoryFieldCount = dc.GetFieldCount();
            int nSubDisasterCategoryFieldCount = sdc.GetFieldCount();
            int nDisasterFieldCount = disaster.GetFieldCount();
            int nVersionFieldCount = version.GetFieldCount();

            foreach (var item in result)
            {
                var data = item as IDictionary<string, object>;
                int nIndex = 0;

                dc = new LargeClass();
                sdc = new MiddleClass();
                disaster = new SmallClass();
                user = new User();
                version = new Model.Sop.Category.Version();

                foreach (KeyValuePair<string, object> pair in data)
                {
                    if (nIndex < nDisasterCategoryFieldCount)
                        ReadDisasterCategory(pair.Key, pair.Value, dc);
                    else if (nIndex < nDisasterCategoryFieldCount + nSubDisasterCategoryFieldCount)
                        ReadSubDisasterCategory(pair.Key, pair.Value, sdc);
                    else if (nIndex < nDisasterCategoryFieldCount + nSubDisasterCategoryFieldCount + nDisasterFieldCount)
                        ReadDisaster(pair.Key, pair.Value, disaster);
                    else if (nIndex < nDisasterCategoryFieldCount + nSubDisasterCategoryFieldCount + nDisasterFieldCount + nVersionFieldCount)
                        ReadVersion(pair.Key, pair.Value, ref version);
                    else
                        ReadUser(pair.Key, pair.Value, ref user);

                    nIndex++;
                }

                arrDatas.Add(dc);
                arrDatas.Add(sdc);
                arrDatas.Add(disaster);
                arrDatas.Add(version);
                arrDatas.Add(user);
            }

            return arrDatas;
        }

        public ArrayList JoinTemporaryMemberTemporaryRegularRegularMember(string strAdditionalConditions, out string strErrorMessage)
        {
            strErrorMessage = null;

            TemporaryMember temporaryMember = new TemporaryMember();
            Temporary temporary = new Temporary();
            Regular regular = new Regular();
            RegularMember regularMember = new RegularMember();

            string strSQL = string.Format("Select a.*, b.*, c.*, d.* from {0} a inner join {1} b on a.{4} = b.{5} left outer join {2} c on a.{6} = c.{7} left outer join {3} d on a.{8} = d.{9}",
                TemporaryMember.TableName, Temporary.TableName, Regular.TableName, RegularMember.TableName,
                TemporaryMember.Fields.tmpr_sn, Temporary.Fields.tmpr_sn,
                TemporaryMember.Fields.rgl_sn, Regular.Fields.rgl_sn,
                TemporaryMember.Fields.rgl_memb_sn, RegularMember.Fields.rgl_memb_sn);

            if (strAdditionalConditions != null && strAdditionalConditions.Length > 0)
            {
                if (strAdditionalConditions.ToLower().Trim().StartsWith("order by"))
                    strSQL += " " + strAdditionalConditions;
                else
                    strSQL += " where " + strAdditionalConditions;
            }

            ArrayList arrDatas = new ArrayList();
            IEnumerable<dynamic> result = this.Select(strSQL, out strErrorMessage);

            if (result == null)
                return null;

            int nTemporaryMemberFieldCount = temporaryMember.GetFieldCount();
            int nTemporaryFieldCount = temporary.GetFieldCount();
            int nRegularFieldCount = regular.GetFieldCount();

            foreach (var item in result)
            {
                var data = item as IDictionary<string, object>;
                int nIndex = 0;

                temporaryMember = new TemporaryMember();
                temporary = new Temporary();
                regular = new Regular();
                regularMember = new RegularMember();

                foreach (KeyValuePair<string, object> pair in data)
                {
                    if (nIndex < nTemporaryMemberFieldCount)
                        ReadTemporaryMember(pair.Key, pair.Value, temporaryMember);
                    else if (nIndex < nTemporaryMemberFieldCount + nTemporaryFieldCount)
                        ReadTemporary(pair.Key, pair.Value, temporary);
                    else if (nIndex < nTemporaryMemberFieldCount + nTemporaryFieldCount + nRegularFieldCount)
                        ReadRegular(pair.Key, pair.Value, ref regular);
                    else
                        ReadRegularMember(pair.Key, pair.Value, ref regularMember);

                    nIndex++;
                }

                arrDatas.Add(temporaryMember);
                arrDatas.Add(temporary);
                arrDatas.Add(regular);
                arrDatas.Add(regularMember);
            }

            return arrDatas;
        }

        public ArrayList JoinTemporaryMemberTemporaryRegularRegularMember(string strAdditionalConditions, int beginIndex, int? itemCount, out string strErrorMessage)
        {
            return JoinTemporaryMemberTemporaryRegularRegularMember(strAdditionalConditions, beginIndex, itemCount, string.Format("a.{0}", TemporaryMember.Fields.tmpr_memb_sn), out strErrorMessage);
        }

        public ArrayList JoinTemporaryMemberTemporaryRegularRegularMember(string strAdditionalConditions, int beginIndex, int? itemCount, string strOrderByField, out string strErrorMessage)
        {
            strErrorMessage = null;

            TemporaryMember temporaryMember = new TemporaryMember();
            Temporary temporary = new Temporary();
            Regular regular = new Regular();
            RegularMember regularMember = new RegularMember();

            string strSQL = string.Format("Select a.*, b.*, c.*, d.* from {0} a inner join {1} b on a.{4} = b.{5} left outer join {2} c on a.{6} = c.{7} left outer join {3} d on a.{8} = d.{9}",
                TemporaryMember.TableName, Temporary.TableName, Regular.TableName, RegularMember.TableName,
                TemporaryMember.Fields.tmpr_sn, Temporary.Fields.tmpr_sn,
                TemporaryMember.Fields.rgl_sn, Regular.Fields.rgl_sn,
                TemporaryMember.Fields.rgl_memb_sn, RegularMember.Fields.rgl_memb_sn);

            if (strAdditionalConditions != null && strAdditionalConditions.Length > 0)
            {
                if (strAdditionalConditions.ToLower().Trim().StartsWith("order by"))
                    strSQL += " " + strAdditionalConditions;
                else
                    strSQL += " where " + strAdditionalConditions;
            }

            int? endIndex = null;

            if (itemCount != null)
                endIndex = beginIndex + (int)itemCount - 1;

            if (strOrderByField == null || strOrderByField.Trim().Length == 0)
                strOrderByField = string.Format("a.{0}", TemporaryMember.Fields.tmpr_memb_sn);

            string strSQL2 = CustomManager.MakePaginationQuery(m_dataManager, strSQL, beginIndex, endIndex, strOrderByField);

            ArrayList arrDatas = new ArrayList();
            IEnumerable<dynamic> result = this.Select(strSQL2, out strErrorMessage);

            if (result == null)
                return null;

            int nPaginationFieldCount = Pagination.GetFieldCount();
            int nTemporaryMemberFieldCount = temporaryMember.GetFieldCount();
            int nTemporaryFieldCount = temporary.GetFieldCount();
            int nRegularFieldCount = regular.GetFieldCount();

            Pagination pagination = null;

            foreach (var item in result)
            {
                var data = item as IDictionary<string, object>;
                int nIndex = 0;

                pagination = new Pagination();
                temporaryMember = new TemporaryMember();
                temporary = new Temporary();
                regular = new Regular();
                regularMember = new RegularMember();

                foreach (KeyValuePair<string, object> pair in data)
                {
                    if (nIndex < nPaginationFieldCount)
                        ReadPagination(pair.Key, pair.Value, pagination);
                    else if (nIndex < nPaginationFieldCount + nTemporaryMemberFieldCount)
                        ReadTemporaryMember(pair.Key, pair.Value, temporaryMember);
                    else if (nIndex < nPaginationFieldCount + nTemporaryMemberFieldCount + nTemporaryFieldCount)
                        ReadTemporary(pair.Key, pair.Value, temporary);
                    else if (nIndex < nPaginationFieldCount + nTemporaryMemberFieldCount + nTemporaryFieldCount + nRegularFieldCount)
                        ReadRegular(pair.Key, pair.Value, ref regular);
                    else
                        ReadRegularMember(pair.Key, pair.Value, ref regularMember);

                    nIndex++;
                }

                arrDatas.Add(pagination);
                arrDatas.Add(temporaryMember);
                arrDatas.Add(temporary);
                arrDatas.Add(regular);
                arrDatas.Add(regularMember);
            }

            return arrDatas;
        }

        public ArrayList JoinRegularRegularMember(string strAdditionalConditions, out string strErrorMessage)
        {
            strErrorMessage = null;

            Regular regular = new Regular();
            RegularMember regularMember = new RegularMember();

            string strSQL = string.Format("Select a.*, b.* from {0} a inner join {1} b on a.{2} = b.{3}",
                Regular.TableName, RegularMember.TableName,
                Regular.Fields.rgl_sn, RegularMember.Fields.rgl_sn);

            if (strAdditionalConditions != null && strAdditionalConditions.Length > 0)
            {
                if (strAdditionalConditions.ToLower().Trim().StartsWith("order by"))
                    strSQL += " " + strAdditionalConditions;
                else
                    strSQL += " where " + strAdditionalConditions;
            }

            ArrayList arrDatas = new ArrayList();
            IEnumerable<dynamic> result = this.Select(strSQL, out strErrorMessage);

            if (result == null)
                return null;

            int nRegularFieldCount = regular.GetFieldCount();

            foreach (var item in result)
            {
                var data = item as IDictionary<string, object>;
                int nIndex = 0;

                regular = new Regular();
                regularMember = new RegularMember();

                foreach (KeyValuePair<string, object> pair in data)
                {
                    if (nIndex < nRegularFieldCount)
                        ReadRegular(pair.Key, pair.Value, ref regular);
                    else
                        ReadRegularMember(pair.Key, pair.Value, ref regularMember);

                    nIndex++;
                }

                if (regular != null && regularMember != null)
                {
                    arrDatas.Add(regular);
                    arrDatas.Add(regularMember);
                }
            }

            return arrDatas;
        }

        public ArrayList JoinRegularRegularMember(string strAdditionalConditions, int beginIndex, int? itemCount, out string strErrorMessage)
        {
            return JoinRegularRegularMember(strAdditionalConditions, beginIndex, itemCount, string.Format("b.{0}", RegularMember.Fields.rgl_memb_sn), out strErrorMessage);
        }

        public ArrayList JoinRegularRegularMember(string strAdditionalConditions, int beginIndex, int? itemCount, string strOrderByField, out string strErrorMessage)
        {
            strErrorMessage = null;

            Regular regular = new Regular();
            RegularMember regularMember = new RegularMember();

            string strSQL = string.Format("Select a.*, b.* from {0} a inner join {1} b on a.{2} = b.{3}",
                Regular.TableName, RegularMember.TableName,
                Regular.Fields.rgl_sn, RegularMember.Fields.rgl_sn);

            if (strAdditionalConditions != null && strAdditionalConditions.Length > 0)
            {
                if (strAdditionalConditions.ToLower().Trim().StartsWith("order by"))
                    strSQL += " " + strAdditionalConditions;
                else
                    strSQL += " where " + strAdditionalConditions;
            }

            int? endIndex = null;

            if (itemCount != null)
                endIndex = beginIndex + (int)itemCount - 1;

            if (strOrderByField == null || strOrderByField.Trim().Length == 0)
                strOrderByField = string.Format("b.{0}", RegularMember.Fields.rgl_memb_sn);

            string strSQL2 = CustomManager.MakePaginationQuery(m_dataManager, strSQL, beginIndex, endIndex, strOrderByField);

            ArrayList arrDatas = new ArrayList();
            IEnumerable<dynamic> result = this.Select(strSQL2, out strErrorMessage);

            if (result == null)
                return null;

            int nPaginationFieldCount = Pagination.GetFieldCount();
            int nRegularFieldCount = regular.GetFieldCount();

            Pagination pagination = null;

            foreach (var item in result)
            {
                var data = item as IDictionary<string, object>;
                int nIndex = 0;

                pagination = new Pagination();
                regular = new Regular();
                regularMember = new RegularMember();

                foreach (KeyValuePair<string, object> pair in data)
                {
                    if (nIndex < nPaginationFieldCount)
                        ReadPagination(pair.Key, pair.Value, pagination);
                    else if (nIndex < nPaginationFieldCount + nRegularFieldCount)
                        ReadRegular(pair.Key, pair.Value, ref regular);
                    else
                        ReadRegularMember(pair.Key, pair.Value, ref regularMember);

                    nIndex++;
                }

                if (regular != null && regularMember != null)
                {
                    arrDatas.Add(pagination);
                    arrDatas.Add(regular);
                    arrDatas.Add(regularMember);
                }
            }

            return arrDatas;
        }

        public ArrayList JoinActionStepHistoryVersion(string strAdditionalConditions, out string strErrorMessage)
        {
            strErrorMessage = null;

            Model.History.ActionStep actionStepHistory = new Model.History.ActionStep();
            ActionStep actionStep = new ActionStep();
            SmallClass smallClass = new SmallClass();
            Model.Sop.Category.Version version = new Model.Sop.Category.Version();

            string strSQL = string.Format("Select a.*, b.* from {0} a inner join {1} d on a.{4} = d.{5} inner join {2} c on d.{6} = c.{7} inner join {3} b on c.{8} = b.{9}",
                Model.History.ActionStep.TableName, ActionStep.TableName, SmallClass.TableName, Model.Sop.Category.Version.TableName,
                Model.History.ActionStep.Fields.action_step_sn, ActionStep.Fields.action_step_sn,
                ActionStep.Fields.sclas_sn, SmallClass.Fields.sclas_sn,
                SmallClass.Fields.ver_sn, Model.Sop.Category.Version.Fields.ver_sn);

            if (strAdditionalConditions != null && strAdditionalConditions.Length > 0)
            {
                if (strAdditionalConditions.ToLower().Trim().StartsWith("order by"))
                    strSQL += " " + strAdditionalConditions;
                else
                    strSQL += " where " + strAdditionalConditions;
            }

            ArrayList arrDatas = new ArrayList();
            IEnumerable<dynamic> result = this.Select(strSQL, out strErrorMessage);

            if (result == null)
                return null;

            int nActionStepHistoryFieldCount = actionStepHistory.GetFieldCount();

            foreach (var item in result)
            {
                var data = item as IDictionary<string, object>;
                int nIndex = 0;

                actionStepHistory = new Model.History.ActionStep();
                version = new Model.Sop.Category.Version();

                foreach (KeyValuePair<string, object> pair in data)
                {
                    if (nIndex < nActionStepHistoryFieldCount)
                        ReadActionStepHistory(pair.Key, pair.Value, ref actionStepHistory);
                    else
                        ReadVersion(pair.Key, pair.Value, ref version);

                    nIndex++;
                }

                arrDatas.Add(actionStepHistory);
                arrDatas.Add(version);
            }

            return arrDatas;
        }

        public ArrayList JoinActionStepHistoryActionStepVersionLargeClassMiddleClassSmallClass(string strAdditionalConditions, out string strErrorMessage)
        {
            strErrorMessage = null;

            Model.History.ActionStep actionStepHistory = new Model.History.ActionStep();
            Model.Sop.Category.Version version = new Model.Sop.Category.Version();
            LargeClass largeClass = new LargeClass();
            MiddleClass middleClass = new MiddleClass();
            SmallClass smallClass = new SmallClass();
            ActionStep actionStep = new ActionStep();

            string strSQL = string.Format("Select a.*, d.*, b.*, c.*, e.*, f.* from {0} a inner join {1} d on a.{6} = d.{7} inner join {2} f on d.{8} = f.{9} inner join {3} b on f.{10} = b.{11} inner join {4} e on f.{12} = e.{13} inner join {5} c on e.{14} = c.{15}",
                Model.History.ActionStep.TableName, ActionStep.TableName, SmallClass.TableName, Model.Sop.Category.Version.TableName, MiddleClass.TableName, LargeClass.TableName,
                Model.History.ActionStep.Fields.action_step_sn, ActionStep.Fields.action_step_sn,
                ActionStep.Fields.sclas_sn, SmallClass.Fields.sclas_sn,
                SmallClass.Fields.ver_sn, Model.Sop.Category.Version.Fields.ver_sn,
                SmallClass.Fields.mclas_sn, MiddleClass.Fields.mclas_sn,
                MiddleClass.Fields.lclas_sn, LargeClass.Fields.lclas_sn);

            if (strAdditionalConditions != null && strAdditionalConditions.Length > 0)
            {
                if (strAdditionalConditions.ToLower().Trim().StartsWith("order by"))
                    strSQL += " " + strAdditionalConditions;
                else
                    strSQL += " where " + strAdditionalConditions;
            }

            ArrayList arrDatas = new ArrayList();
            IEnumerable<dynamic> result = this.Select(strSQL, out strErrorMessage);

            if (result == null)
                return null;

            int nActionStepHistoryFieldCount = actionStepHistory.GetFieldCount();
            int nActionStepFieldCount = actionStep.GetFieldCount();
            int nVersionCount = version.GetFieldCount();
            int nLargeClassCount = largeClass.GetFieldCount();
            int nMiddleClassCount = middleClass.GetFieldCount();

            foreach (var item in result)
            {
                var data = item as IDictionary<string, object>;
                int nIndex = 0;

                actionStepHistory = new Model.History.ActionStep();
                actionStep = new ActionStep();
                version = new Model.Sop.Category.Version();
                largeClass = new LargeClass();
                middleClass = new MiddleClass();
                smallClass = new SmallClass();

                foreach (KeyValuePair<string, object> pair in data)
                {
                    if (nIndex < nActionStepHistoryFieldCount)
                        ReadActionStepHistory(pair.Key, pair.Value, ref actionStepHistory);
                    else if (nIndex < nActionStepHistoryFieldCount + nActionStepFieldCount)
                        ReadActionStep(pair.Key, pair.Value, actionStep);
                    else if (nIndex < nActionStepHistoryFieldCount + nActionStepFieldCount + nVersionCount)
                        ReadVersion(pair.Key, pair.Value, ref version);
                    else if (nIndex < nActionStepHistoryFieldCount + nActionStepFieldCount + nVersionCount + nLargeClassCount)
                        ReadDisasterCategory(pair.Key, pair.Value, largeClass);
                    else if (nIndex < nActionStepHistoryFieldCount + nActionStepFieldCount + nVersionCount + nLargeClassCount + nMiddleClassCount)
                        ReadSubDisasterCategory(pair.Key, pair.Value, middleClass);
                    else
                        ReadDisaster(pair.Key, pair.Value, smallClass);

                    nIndex++;
                }

                arrDatas.Add(actionStepHistory);
                arrDatas.Add(actionStep);
                arrDatas.Add(version);
                arrDatas.Add(largeClass);
                arrDatas.Add(middleClass);
                arrDatas.Add(smallClass);
            }

            return arrDatas;
        }

        public ArrayList JoinProcessTemporaryTemporary(string strAdditionalConditions, out string strErrorMessage)
        {
            strErrorMessage = null;

            ProcessTemporary processTemporary = new ProcessTemporary();
            Temporary temporary = new Temporary();

            string strSQL = string.Format("Select a.*, b.* from {0} a inner join {1} b on a.{2} = b.{3}",
                ProcessTemporary.TableName, Temporary.TableName,
                ProcessTemporary.Fields.tmpr_sn, Temporary.Fields.tmpr_sn);

            if (strAdditionalConditions != null && strAdditionalConditions.Length > 0)
            {
                if (strAdditionalConditions.ToLower().Trim().StartsWith("order by"))
                    strSQL += " " + strAdditionalConditions;
                else
                    strSQL += " where " + strAdditionalConditions;
            }

            ArrayList arrDatas = new ArrayList();
            IEnumerable<dynamic> result = this.Select(strSQL, out strErrorMessage);

            if (result == null)
                return null;

            int nProcessTemporaryFieldCount = processTemporary.GetFieldCount();

            foreach (var item in result)
            {
                var data = item as IDictionary<string, object>;
                int nIndex = 0;

                processTemporary = new ProcessTemporary();
                temporary = new Temporary();

                foreach (KeyValuePair<string, object> pair in data)
                {
                    if (nIndex < nProcessTemporaryFieldCount)
                        ReadProcessTemporary(pair.Key, pair.Value, processTemporary);
                    else
                        ReadTemporary(pair.Key, pair.Value, temporary);

                    nIndex++;
                }

                arrDatas.Add(processTemporary);
                arrDatas.Add(temporary);
            }

            return arrDatas;
        }

        public ArrayList JoinTransmissionTemporaryTemporary(string strAdditionalConditions, out string strErrorMessage)
        {
            strErrorMessage = null;

            TransmissionTemporary transmissionTemporary = new TransmissionTemporary();
            Temporary temporary = new Temporary();

            string strSQL = string.Format("Select a.*, b.* from {0} a inner join {1} b on a.{2} = b.{3}",
                TransmissionTemporary.TableName, Temporary.TableName,
                TransmissionTemporary.Fields.tmpr_sn, Temporary.Fields.tmpr_sn);

            if (strAdditionalConditions != null && strAdditionalConditions.Length > 0)
            {
                if (strAdditionalConditions.ToLower().Trim().StartsWith("order by"))
                    strSQL += " " + strAdditionalConditions;
                else
                    strSQL += " where " + strAdditionalConditions;
            }

            ArrayList arrDatas = new ArrayList();
            IEnumerable<dynamic> result = this.Select(strSQL, out strErrorMessage);

            if (result == null)
                return null;

            int nTransmissionTemporaryFieldCount = transmissionTemporary.GetFieldCount();

            foreach (var item in result)
            {
                var data = item as IDictionary<string, object>;
                int nIndex = 0;

                transmissionTemporary = new TransmissionTemporary();
                temporary = new Temporary();

                foreach (KeyValuePair<string, object> pair in data)
                {
                    if (nIndex < nTransmissionTemporaryFieldCount)
                        ReadTransmissionTemporary(pair.Key, pair.Value, transmissionTemporary);
                    else
                        ReadTemporary(pair.Key, pair.Value, temporary);

                    nIndex++;
                }

                arrDatas.Add(transmissionTemporary);
                arrDatas.Add(temporary);
            }

            return arrDatas;
        }

        // ActionStep 목록과 그 ActionStep들의 실행중인 SOP 이력을 얻어온다.
        public ArrayList JoinActionStepActionStepHistory(string strAdditionalConditions, out string strErrorMessage)
        {
            strErrorMessage = null;

            ActionStep actionStep = new ActionStep();
            Model.History.ActionStep actionStepHistory = new Model.History.ActionStep();

            string strSQL = string.Format("Select a.*, b.* from {0} a left outer join {1} b on a.{2} = b.{3} and b.{4} is NULL and b.{5} = (Select max({5}) from {1} where {3} = b.{3})",
                ActionStep.TableName, Model.History.ActionStep.TableName,
                ActionStep.Fields.action_step_sn, Model.History.ActionStep.Fields.action_step_sn,
                Model.History.ActionStep.Fields.end_time, Model.History.ActionStep.Fields.begin_time);

            if (strAdditionalConditions != null && strAdditionalConditions.Length > 0)
            {
                if (strAdditionalConditions.ToLower().Trim().StartsWith("order by"))
                    strSQL += " " + strAdditionalConditions;
                else
                    strSQL += " where " + strAdditionalConditions;
            }

            ArrayList arrDatas = new ArrayList();
            IEnumerable<dynamic> result = this.Select(strSQL, out strErrorMessage);

            if (result == null)
                return null;

            int nActionStepFieldCount = actionStep.GetFieldCount();

            foreach (var item in result)
            {
                var data = item as IDictionary<string, object>;
                int nIndex = 0;

                actionStep = new ActionStep();
                actionStepHistory = new Model.History.ActionStep();

                foreach (KeyValuePair<string, object> pair in data)
                {
                    if (nIndex < nActionStepFieldCount)
                        ReadActionStep(pair.Key, pair.Value, actionStep);
                    else
                        ReadActionStepHistory(pair.Key, pair.Value, ref actionStepHistory);

                    nIndex++;
                }

                arrDatas.Add(actionStep);
                arrDatas.Add(actionStepHistory);
            }

            return arrDatas;
        }

        public ArrayList JoinActionStepHistoryActionStepSmallClass(string strAdditionalConditions, out string strErrorMessage)
        {
            strErrorMessage = null;

            ActionStep actionStep = new ActionStep();
            Model.History.ActionStep actionStepHistory = new Model.History.ActionStep();
            SmallClass smallClass = new SmallClass();

            string strSQL = string.Format("Select a.*, b.*, c.* from {0} a inner join {1} b on a.{3} = b.{4} inner join {2} c on b.{5} = c.{6}",
                Model.History.ActionStep.TableName, ActionStep.TableName, SmallClass.TableName,
                Model.History.ActionStep.Fields.action_step_sn, ActionStep.Fields.action_step_sn,
                ActionStep.Fields.sclas_sn, SmallClass.Fields.sclas_sn);

            if (strAdditionalConditions != null && strAdditionalConditions.Length > 0)
            {
                if (strAdditionalConditions.ToLower().Trim().StartsWith("order by"))
                    strSQL += " " + strAdditionalConditions;
                else
                    strSQL += " where " + strAdditionalConditions;
            }

            ArrayList arrDatas = new ArrayList();
            IEnumerable<dynamic> result = this.Select(strSQL, out strErrorMessage);

            if (result == null)
                return null;

            int nActionStepHistoryFieldCount = actionStepHistory.GetFieldCount();
            int nActionStepFieldCount = actionStep.GetFieldCount();

            foreach (var item in result)
            {
                var data = item as IDictionary<string, object>;
                int nIndex = 0;

                actionStep = new ActionStep();
                actionStepHistory = new Model.History.ActionStep();
                smallClass = new SmallClass();

                foreach (KeyValuePair<string, object> pair in data)
                {
                    if (nIndex < nActionStepHistoryFieldCount)
                        ReadActionStepHistory(pair.Key, pair.Value, ref actionStepHistory);
                    else if (nIndex < nActionStepHistoryFieldCount + nActionStepFieldCount)
                        ReadActionStep(pair.Key, pair.Value, actionStep);
                    else
                        ReadDisaster(pair.Key, pair.Value, smallClass);

                    nIndex++;
                }

                arrDatas.Add(actionStepHistory);
                arrDatas.Add(actionStep);
                arrDatas.Add(smallClass);
            }

            return arrDatas;
        }

        public ArrayList JoinComponentHistoryComponent(string strAdditionalConditions, out string strErrorMessage)
        {
            strErrorMessage = null;

            Model.History.Component componentHistory = new Model.History.Component();
            Component component = new Component();

            string strSQL = string.Format("Select a.*, b.* from {0} a inner join {1} b on a.{2} = b.{3}",
                Model.History.Component.TableName, Component.TableName,
                Model.History.Component.Fields.compn_sn, Component.Fields.compn_sn);

            if (strAdditionalConditions != null && strAdditionalConditions.Length > 0)
            {
                if (strAdditionalConditions.ToLower().Trim().StartsWith("order by"))
                    strSQL += " " + strAdditionalConditions;
                else
                    strSQL += " where " + strAdditionalConditions;
            }

            ArrayList arrDatas = new ArrayList();
            IEnumerable<dynamic> result = this.Select(strSQL, out strErrorMessage);

            if (result == null)
                return null;

            int nComponentHistoryFieldCount = componentHistory.GetFieldCount();

            foreach (var item in result)
            {
                var data = item as IDictionary<string, object>;
                int nIndex = 0;

                componentHistory = new Model.History.Component();
                component = new Component();

                foreach (KeyValuePair<string, object> pair in data)
                {
                    if (nIndex < nComponentHistoryFieldCount)
                        ReadComponentHistory(pair.Key, pair.Value, componentHistory);
                    else
                        ReadComponent(pair.Key, pair.Value, component);

                    nIndex++;
                }

                arrDatas.Add(componentHistory);
                arrDatas.Add(component);
            }

            return arrDatas;
        }

        public ArrayList JoinActionStepDisasterCategory(string strAdditionalConditions, out string strErrorMessage)
        {
            strErrorMessage = null;

            ActionStep actionStep = new ActionStep();
            LargeClass largeClass = new LargeClass();

            string strSQL = string.Format("Select a.*, b.* from {0} a inner join {1} c on a.{4} = c.{5} inner join {2} d on c.{6} = d.{7} inner join {3} b on d.{8} = b.{9}",
                ActionStep.TableName, SmallClass.TableName, MiddleClass.TableName, LargeClass.TableName,
                ActionStep.Fields.sclas_sn, SmallClass.Fields.sclas_sn,
                SmallClass.Fields.mclas_sn, MiddleClass.Fields.mclas_sn,
                MiddleClass.Fields.lclas_sn, LargeClass.Fields.lclas_sn);

            if (strAdditionalConditions != null && strAdditionalConditions.Length > 0)
            {
                if (strAdditionalConditions.ToLower().Trim().StartsWith("order by"))
                    strSQL += " " + strAdditionalConditions;
                else
                    strSQL += " where " + strAdditionalConditions;
            }

            ArrayList arrDatas = new ArrayList();
            IEnumerable<dynamic> result = this.Select(strSQL, out strErrorMessage);

            if (result == null)
                return null;

            int nActionStepFieldCount = actionStep.GetFieldCount();

            foreach (var item in result)
            {
                var data = item as IDictionary<string, object>;
                int nIndex = 0;

                actionStep = new ActionStep();
                largeClass = new LargeClass();

                foreach (KeyValuePair<string, object> pair in data)
                {
                    if (nIndex < nActionStepFieldCount)
                        ReadActionStep(pair.Key, pair.Value, actionStep);
                    else
                        ReadDisasterCategory(pair.Key, pair.Value, largeClass);

                    nIndex++;
                }

                arrDatas.Add(actionStep);
                arrDatas.Add(largeClass);
            }

            return arrDatas;
        }

        public ArrayList JoinDisasterCategorySubDisasterCategoryDisasterActionStepActionStepHistoryUser(string strAdditionalConditions, int beginIndex, int? itemCount, out string strErrorMessage)
        {
            strErrorMessage = null;

            ActionStep actionStep = new ActionStep();
            LargeClass largeClass = new LargeClass();
            MiddleClass middleClass = new MiddleClass();
            SmallClass smallClass = new SmallClass();
            Model.History.ActionStep actionStepHistory = new Model.History.ActionStep();
            User user = new User();

            string strSQL = string.Format("Select a.*, b.*, c.*, d.*, e.*, f.* from {0} a inner join {1} b on a.{6} = b.{7} inner join {2} c on b.{8} = c.{9} inner join {3} d on c.{10} = d.{11} inner join {4} e on d.{12} = e.{13} left outer join {5} f on e.{14} = f.{15}",
                LargeClass.TableName, MiddleClass.TableName, SmallClass.TableName, ActionStep.TableName, Model.History.ActionStep.TableName, User.TableName,
                LargeClass.Fields.lclas_sn, MiddleClass.Fields.lclas_sn,
                MiddleClass.Fields.mclas_sn, SmallClass.Fields.mclas_sn,
                SmallClass.Fields.sclas_sn, ActionStep.Fields.sclas_sn,
                ActionStep.Fields.action_step_sn, Model.History.ActionStep.Fields.action_step_sn,
                Model.History.ActionStep.Fields.user_sn, User.Fields.user_sn);

            if (strAdditionalConditions != null && strAdditionalConditions.Length > 0)
            {
                if (strAdditionalConditions.ToLower().Trim().StartsWith("order by"))
                    strSQL += " " + strAdditionalConditions;
                else
                    strSQL += " where " + strAdditionalConditions;
            }

            int? endIndex = null;

            if (itemCount != null)
                endIndex = beginIndex + (int)itemCount - 1;

            string strSQL2 = CustomManager.MakePaginationQuery(m_dataManager, strSQL, beginIndex, endIndex, string.Format("e.{0}", Model.History.ActionStep.Fields.begin_time));

            ArrayList arrDatas = new ArrayList();
            IEnumerable<dynamic> result = this.Select(strSQL2, out strErrorMessage);

            if (result == null)
                return null;

            int nPaginationFieldCount = Pagination.GetFieldCount();
            int nLargeClassFieldCount = largeClass.GetFieldCount();
            int nMiddleClassFieldCount = middleClass.GetFieldCount();
            int nSmallClassFieldCount = smallClass.GetFieldCount();
            int nActionStepFieldCount = actionStep.GetFieldCount();
            int nActionStepHistoryFieldCount = actionStepHistory.GetFieldCount();

            Pagination pagination = null;

            foreach (var item in result)
            {
                var data = item as IDictionary<string, object>;
                int nIndex = 0;

                pagination = new Pagination();
                actionStep = new ActionStep();
                largeClass = new LargeClass();
                middleClass = new MiddleClass();
                smallClass = new SmallClass();
                actionStepHistory = new Model.History.ActionStep();
                user = new User();

                foreach (KeyValuePair<string, object> pair in data)
                {
                    if (nIndex < nPaginationFieldCount)
                        ReadPagination(pair.Key, pair.Value, pagination);
                    else if (nIndex < nPaginationFieldCount + nLargeClassFieldCount)
                        ReadDisasterCategory(pair.Key, pair.Value, largeClass);
                    else if (nIndex < nPaginationFieldCount + nLargeClassFieldCount + nMiddleClassFieldCount)
                        ReadSubDisasterCategory(pair.Key, pair.Value, middleClass);
                    else if (nIndex < nPaginationFieldCount + nLargeClassFieldCount + nMiddleClassFieldCount + nSmallClassFieldCount)
                        ReadDisaster(pair.Key, pair.Value, smallClass);
                    else if (nIndex < nPaginationFieldCount + nLargeClassFieldCount + nMiddleClassFieldCount + nSmallClassFieldCount + nActionStepFieldCount)
                        ReadActionStep(pair.Key, pair.Value, actionStep);
                    else if (nIndex < nPaginationFieldCount + nLargeClassFieldCount + nMiddleClassFieldCount + nSmallClassFieldCount + nActionStepFieldCount + nActionStepHistoryFieldCount)
                        ReadActionStepHistory(pair.Key, pair.Value, ref actionStepHistory);
                    else
                        ReadUser(pair.Key, pair.Value, ref user);

                    nIndex++;
                }

                arrDatas.Add(pagination);
                arrDatas.Add(largeClass);
                arrDatas.Add(middleClass);
                arrDatas.Add(smallClass);
                arrDatas.Add(actionStep);
                arrDatas.Add(actionStepHistory);
                arrDatas.Add(user);
            }

            return arrDatas;
        }

        public ArrayList JoinUserRegularMemberRegular(string strAdditionalConditions, int beginIndex, int? itemCount, out string strErrorMessage)
        {
            return JoinUserRegularMemberRegular(strAdditionalConditions, beginIndex, itemCount, string.Format("a.{0}", User.Fields.user_sn), out strErrorMessage);
        }

        public ArrayList JoinUserRegularMemberRegular(string strAdditionalConditions, int beginIndex, int? itemCount, string strOrderByField, out string strErrorMessage)
        {
            strErrorMessage = null;

            User user = new User();
            RegularMember regularMember = new RegularMember();
            Regular regular = new Regular();

            string strSQL = string.Format("Select a.*, b.*, c.* from {0} a left outer join {1} b on a.{3} = b.{4} left outer join {2} c on b.{5} = c.{6}",
                User.TableName, RegularMember.TableName, Regular.TableName,
                User.Fields.rgl_memb_sn, RegularMember.Fields.rgl_memb_sn,
                RegularMember.Fields.rgl_sn, Regular.Fields.rgl_sn);

            if (strAdditionalConditions != null && strAdditionalConditions.Length > 0)
            {
                if (strAdditionalConditions.ToLower().Trim().StartsWith("order by"))
                    strSQL += " " + strAdditionalConditions;
                else
                    strSQL += " where " + strAdditionalConditions;
            }

            int? endIndex = null;

            if (itemCount != null)
                endIndex = beginIndex + (int)itemCount - 1;

            if (strOrderByField == null || strOrderByField.Trim().Length == 0)
                strOrderByField = string.Format("a.{0}", User.Fields.user_sn);

            string strSQL2 = CustomManager.MakePaginationQuery(m_dataManager, strSQL, beginIndex, endIndex, strOrderByField);

            ArrayList arrDatas = new ArrayList();
            IEnumerable<dynamic> result = this.Select(strSQL2, out strErrorMessage);

            if (result == null)
                return null;

            int nPaginationFieldCount = Pagination.GetFieldCount();
            int nUserFieldCount = user.GetFieldCount();
            int nRegularMemberFieldCount = regularMember.GetFieldCount();

            Pagination pagination = null;

            foreach (var item in result)
            {
                var data = item as IDictionary<string, object>;
                int nIndex = 0;

                pagination = new Pagination();
                user = new User();
                regularMember = new RegularMember();
                regular = new Regular();

                foreach (KeyValuePair<string, object> pair in data)
                {
                    if (nIndex < nPaginationFieldCount)
                        ReadPagination(pair.Key, pair.Value, pagination);
                    else if (nIndex < nPaginationFieldCount + nUserFieldCount)
                        ReadUser(pair.Key, pair.Value, ref user);
                    else if (nIndex < nPaginationFieldCount + nUserFieldCount + nRegularMemberFieldCount)
                        ReadRegularMember(pair.Key, pair.Value, ref regularMember);
                    else
                        ReadRegular(pair.Key, pair.Value, ref regular);

                    nIndex++;
                }

                arrDatas.Add(pagination);
                arrDatas.Add(user);
                arrDatas.Add(regularMember);
                arrDatas.Add(regular);
            }

            return arrDatas;
        }

        public ArrayList JoinUserRegularMember(string strAdditionalConditions, int beginIndex, int? itemCount, out string strErrorMessage)
        {
            return JoinUserRegularMember(strAdditionalConditions, beginIndex, itemCount, string.Format("a.{0}", User.Fields.user_sn), out strErrorMessage);
        }

        public ArrayList JoinUserRegularMember(string strAdditionalConditions, int beginIndex, int? itemCount, string strOrderByField, out string strErrorMessage)
        {
            strErrorMessage = null;

            User user = new User();
            RegularMember regularMember = new RegularMember();

            string strSQL = string.Format("Select a.*, b.* from {0} a left outer join {1} b on a.{2} = b.{3}",
                User.TableName, RegularMember.TableName,
                User.Fields.rgl_memb_sn, RegularMember.Fields.rgl_memb_sn);

            if (strAdditionalConditions != null && strAdditionalConditions.Length > 0)
            {
                if (strAdditionalConditions.ToLower().Trim().StartsWith("order by"))
                    strSQL += " " + strAdditionalConditions;
                else
                    strSQL += " where " + strAdditionalConditions;
            }

            int? endIndex = null;

            if (itemCount != null)
                endIndex = beginIndex + (int)itemCount - 1;

            if (strOrderByField == null || strOrderByField.Trim().Length == 0)
                strOrderByField = string.Format("a.{0}", User.Fields.user_sn);

            string strSQL2 = CustomManager.MakePaginationQuery(m_dataManager, strSQL, beginIndex, endIndex, strOrderByField);

            ArrayList arrDatas = new ArrayList();
            IEnumerable<dynamic> result = this.Select(strSQL2, out strErrorMessage);

            if (result == null)
                return null;

            int nPaginationFieldCount = Pagination.GetFieldCount();
            int nUserFieldCount = user.GetFieldCount();

            Pagination pagination = null;

            foreach (var item in result)
            {
                var data = item as IDictionary<string, object>;
                int nIndex = 0;

                pagination = new Pagination();
                user = new User();
                regularMember = new RegularMember();

                foreach (KeyValuePair<string, object> pair in data)
                {
                    if (nIndex < nPaginationFieldCount)
                        ReadPagination(pair.Key, pair.Value, pagination);
                    else if (nIndex < nPaginationFieldCount + nUserFieldCount)
                        ReadUser(pair.Key, pair.Value, ref user);
                    else
                        ReadRegularMember(pair.Key, pair.Value, ref regularMember);

                    nIndex++;
                }

                arrDatas.Add(pagination);
                arrDatas.Add(user);
                arrDatas.Add(regularMember);
            }

            return arrDatas;
        }

        public ArrayList JoinEquipmentZoneEquipmentZoneLinkedZone(string strAdditionalConditions, out string strErrorMessage)
        {
            strErrorMessage = null;

            EquipmentZone equipZone = new EquipmentZone();
            EquipmentZoneLinkedZone eqiupZoneLink = new EquipmentZoneLinkedZone();

            string strSQL = string.Format("Select a.*, b.* from {0} a inner join {1} b on a.{2} = b.{3}",
                EquipmentZone.TableName, EquipmentZoneLinkedZone.TableName,
                EquipmentZone.Fields.eqp_zone_sn, EquipmentZoneLinkedZone.Fields.eqp_zone_sn);

            if (strAdditionalConditions != null && strAdditionalConditions.Length > 0)
            {
                if (strAdditionalConditions.ToLower().Trim().StartsWith("order by"))
                    strSQL += " " + strAdditionalConditions;
                else
                    strSQL += " where " + strAdditionalConditions;
            }

            ArrayList arrDatas = new ArrayList();
            IEnumerable<dynamic> result = this.Select(strSQL, out strErrorMessage);

            if (result == null)
                return null;

            int nEquipZoneFieldCount = equipZone.GetFieldCount();

            foreach (var item in result)
            {
                var data = item as IDictionary<string, object>;
                int nIndex = 0;

                equipZone = new EquipmentZone();
                eqiupZoneLink = new EquipmentZoneLinkedZone();

                foreach (KeyValuePair<string, object> pair in data)
                {
                    if (nIndex < nEquipZoneFieldCount)
                        ReadEquipmentZone(pair.Key, pair.Value, ref equipZone);
                    else
                        ReadEquipmentZoneLinkedZone(pair.Key, pair.Value, eqiupZoneLink);

                    nIndex++;
                }

                arrDatas.Add(equipZone);
                arrDatas.Add(eqiupZoneLink);
            }

            return arrDatas;
        }

        public ArrayList JoinZoneBuilding(string strAdditionalConditions, out string strErrorMessage)
        {
            strErrorMessage = null;

            Zone zone = new Zone();
            Building building = new Building();

            string strSQL = string.Format("Select a.*, b.* from {0} a left outer join {1} b on a.{2} = b.{3}",
                Zone.TableName, Building.TableName,
                Zone.Fields.buld_sn, Building.Fields.buld_sn);

            if (strAdditionalConditions != null && strAdditionalConditions.Length > 0)
            {
                if (strAdditionalConditions.ToLower().Trim().StartsWith("order by"))
                    strSQL += " " + strAdditionalConditions;
                else
                    strSQL += " where " + strAdditionalConditions;
            }

            ArrayList arrDatas = new ArrayList();
            IEnumerable<dynamic> result = this.Select(strSQL, out strErrorMessage);

            if (result == null)
                return null;

            int nZoneFieldCount = zone.GetFieldCount();

            foreach (var item in result)
            {
                var data = item as IDictionary<string, object>;
                int nIndex = 0;

                zone = new Zone();
                building = new Building();

                foreach (KeyValuePair<string, object> pair in data)
                {
                    if (nIndex < nZoneFieldCount)
                        ReadZone(pair.Key, pair.Value, ref zone);
                    else
                        ReadBuilding(pair.Key, pair.Value, ref building);

                    nIndex++;
                }

                arrDatas.Add(zone);
                arrDatas.Add(building);
            }

            return arrDatas;
        }

        public ArrayList JoinZoneBuildingBuildingGroup(string strAdditionalConditions, out string strErrorMessage)
        {
            strErrorMessage = null;

            Zone zone = new Zone();
            Building building = new Building();
            BuildingGroup buildingGroup = new BuildingGroup();

            string strSQL = string.Format("Select a.*, b.*, c.* from {0} a left outer join {1} b on a.{3} = b.{4} left outer join {2} c on b.{5} = c.{6}",
                Zone.TableName, Building.TableName, BuildingGroup.TableName,
                Zone.Fields.buld_sn, Building.Fields.buld_sn,
                Building.Fields.buld_group_sn, BuildingGroup.Fields.buld_group_sn);

            if (strAdditionalConditions != null && strAdditionalConditions.Length > 0)
            {
                if (strAdditionalConditions.ToLower().Trim().StartsWith("order by"))
                    strSQL += " " + strAdditionalConditions;
                else
                    strSQL += " where " + strAdditionalConditions;
            }

            ArrayList arrDatas = new ArrayList();
            IEnumerable<dynamic> result = this.Select(strSQL, out strErrorMessage);

            if (result == null)
                return null;

            int nZoneFieldCount = zone.GetFieldCount();
            int nBuildingFieldCount = building.GetFieldCount();

            foreach (var item in result)
            {
                var data = item as IDictionary<string, object>;
                int nIndex = 0;

                zone = new Zone();
                building = new Building();
                buildingGroup = new BuildingGroup();

                foreach (KeyValuePair<string, object> pair in data)
                {
                    if (nIndex < nZoneFieldCount)
                        ReadZone(pair.Key, pair.Value, ref zone);
                    else if (nIndex < nZoneFieldCount + nBuildingFieldCount)
                        ReadBuilding(pair.Key, pair.Value, ref building);
                    else
                        ReadBuildingGroup(pair.Key, pair.Value, ref buildingGroup);

                    nIndex++;
                }

                arrDatas.Add(zone);
                arrDatas.Add(building);
                arrDatas.Add(buildingGroup);
            }

            return arrDatas;
        }

        private void ReadPagination(string strFieldName, object value, Pagination pagination)
        {
            if (strFieldName == Pagination.RowNoField)
                pagination.RowNo = ToInt(value);
            else if (strFieldName == Pagination.TotalCountField)
                pagination.TotalCount = ToInt(value);
        }

        private int ToInt(object value)
        {
            if (value is Int32)
                return (int)value;
            else if (value is Int64)
                return (int)(long)value;

            return int.Parse(value.ToString());
        }

        public void ReadComponent(string strFieldName, object value, Component component)
        {
            if (strFieldName == Component.Fields.compn_sn.ToString())
                component.compn_sn = (int)value;
            else if (strFieldName == Component.Fields.grid_sn.ToString())
                component.grid_sn = (int)value;
            else if (strFieldName == Component.Fields.column_no.ToString())
                component.column_no = (int)value;
            else if (strFieldName == Component.Fields.row_no.ToString())
                component.row_no = (int)value;
            else if (strFieldName == Component.Fields.compn_optn_code.ToString())
                component.compn_optn_code = (int)value;
            else if (strFieldName == Component.Fields.compn_code.ToString())
                component.compn_code = (int)value;
            else if (strFieldName == Component.Fields.step_memb_sn.ToString())
                component.step_memb_sn = (int)value;
        }

        public void ReadComponentHistory(string strFieldName, object value, Model.History.Component componentHistory)
        {
            if (strFieldName == Model.History.Component.Fields.compn_hist_sn.ToString())
                componentHistory.compn_hist_sn = (int)value;
            else if (strFieldName == Model.History.Component.Fields.action_step_hist_sn.ToString())
                componentHistory.action_step_hist_sn = (int)value;
            else if (strFieldName == Model.History.Component.Fields.compn_sn.ToString())
                componentHistory.compn_sn = (int)value;
            else if (strFieldName == Model.History.Component.Fields.time.ToString())
                componentHistory.time = (DateTime)value;
            else if (strFieldName == Model.History.Component.Fields.sop_sttus_optn_code.ToString())
                componentHistory.sop_sttus_optn_code = (int)value;
            else if (strFieldName == Model.History.Component.Fields.sop_sttus_code.ToString())
                componentHistory.sop_sttus_code = (int)value;
            else if (strFieldName == Model.History.Component.Fields.compt_cnt.ToString())
            {
                if (value == null)
                    componentHistory.compt_cnt = null;
                else
                    componentHistory.compt_cnt = (int)value;
            }
            else if (strFieldName == Model.History.Component.Fields.user_sn.ToString())
            {
                if (value == null)
                    componentHistory.user_sn = null;
                else
                    componentHistory.user_sn = (int)value;
            }
            else if (strFieldName == Model.History.Component.Fields.descp.ToString())
                componentHistory.descp = (string)value;
        }

        public void ReadActionStep(string strFieldName, object value, ActionStep actionStep)
        {
            if (strFieldName == ActionStep.Fields.action_step_sn.ToString())
                actionStep.action_step_sn = (int)value;
            else if (strFieldName == ActionStep.Fields.action_step_name.ToString())
                actionStep.action_step_name = (string)value;
            else if (strFieldName == ActionStep.Fields.sclas_sn.ToString())
                actionStep.sclas_sn = (int)value;
        }

        public void ReadActionStepHistory(string strFieldName, object value, ref Model.History.ActionStep actionStepHistory)
        {
            if (actionStepHistory == null)
                return;

            if (strFieldName == Model.History.ActionStep.Fields.action_step_hist_sn.ToString())
            {
                if (value == null)
                    actionStepHistory = null;
                else
                    actionStepHistory.action_step_hist_sn = (int)value;
            }
            else if (strFieldName == Model.History.ActionStep.Fields.action_step_sn.ToString())
            {
                if (value == null)
                    actionStepHistory = null;
                else
                    actionStepHistory.action_step_sn = (int)value;
            }
            else if (strFieldName == Model.History.ActionStep.Fields.begin_time.ToString())
            {
                if (value == null)
                    actionStepHistory = null;
                else
                    actionStepHistory.begin_time = (DateTime)value;
            }
            else if (strFieldName == Model.History.ActionStep.Fields.end_time.ToString())
            {
                if (value == null)
                    actionStepHistory.end_time = null;
                else
                    actionStepHistory.end_time = (DateTime)value;
            }
            else if (strFieldName == Model.History.ActionStep.Fields.last_acces_time.ToString())
            {
                if (value == null)
                    actionStepHistory.last_acces_time = null;
                else
                    actionStepHistory.last_acces_time = (DateTime)value;
            }
            else if (strFieldName == Model.History.ActionStep.Fields.detct_end_time.ToString())
            {
                if (value == null)
                    actionStepHistory.detct_end_time = null;
                else
                    actionStepHistory.detct_end_time = (DateTime)value;
            }
            else if (strFieldName == Model.History.ActionStep.Fields.detct_time.ToString())
            {
                if (value == null)
                    actionStepHistory.detct_time = null;
                else
                    actionStepHistory.detct_time = (DateTime)value;
            }
            else if (strFieldName == Model.History.ActionStep.Fields.lc.ToString())
                actionStepHistory.lc = (string)value;
            else if (strFieldName == Model.History.ActionStep.Fields.user_sn.ToString())
            {
                if (value == null)
                    actionStepHistory.user_sn = null;
                else
                    actionStepHistory.user_sn = (int)value;
            }
            else if (strFieldName == Model.History.ActionStep.Fields.sop_optn.ToString())
                actionStepHistory.sop_optn = (string)value;
            else if (strFieldName == Model.History.ActionStep.Fields.sensor_zone_hist_sn.ToString())
            {
                if (value == null)
                    actionStepHistory.sensor_zone_hist_sn = null;
                else
                    actionStepHistory.sensor_zone_hist_sn = (int)value;
            }
            else if (strFieldName == Model.History.ActionStep.Fields.descp.ToString())
                actionStepHistory.descp = (string)value;
        }

        public void ReadTemporaryMember(string strFieldName, object value, TemporaryMember temporaryMember)
        {
            if (strFieldName == TemporaryMember.Fields.tmpr_memb_sn.ToString())
                temporaryMember.tmpr_memb_sn = (int)value;
            else if (strFieldName == TemporaryMember.Fields.disp_name.ToString())
                temporaryMember.disp_name = (string)value;
            else if (strFieldName == TemporaryMember.Fields.tmpr_sn.ToString())
                temporaryMember.tmpr_sn = (int)value;
            else if (strFieldName == TemporaryMember.Fields.rgl_sn.ToString())
            {
                if (value == null)
                    temporaryMember.rgl_sn = null;
                else
                    temporaryMember.rgl_sn = (int)value;
            }
            else if (strFieldName == TemporaryMember.Fields.rgl_memb_sn.ToString())
            {
                if (value == null)
                    temporaryMember.rgl_memb_sn = null;
                else
                    temporaryMember.rgl_memb_sn = (int)value;
            }
            else if (strFieldName == TemporaryMember.Fields.role_optn_no.ToString())
            {
                if (value == null)
                    temporaryMember.role_optn_no = null;
                else
                    temporaryMember.role_optn_no = (int)value;
            }
            else if (strFieldName == TemporaryMember.Fields.role_no.ToString())
            {
                if (value == null)
                    temporaryMember.role_no = null;
                else
                    temporaryMember.role_no = (int)value;
            }
            else if (strFieldName == TemporaryMember.Fields.memo.ToString())
                temporaryMember.memo = (string)value;
        }

        public void ReadProcessTemporary(string strFieldName, object value, ProcessTemporary processTemporary)
        {
            if (strFieldName == ProcessTemporary.Fields.compn_sn.ToString())
                processTemporary.compn_sn = (int)value;
            else if (strFieldName == ProcessTemporary.Fields.tmpr_sn.ToString())
                processTemporary.tmpr_sn = (int)value;
        }

        public void ReadTransmissionTemporary(string strFieldName, object value, TransmissionTemporary transmissionTemporary)
        {
            if (strFieldName == TransmissionTemporary.Fields.compn_sn.ToString())
                transmissionTemporary.compn_sn = (int)value;
            else if (strFieldName == TransmissionTemporary.Fields.tmpr_sn.ToString())
                transmissionTemporary.tmpr_sn = (int)value;
        }

        public void ReadTemporary(string strFieldName, object value, Temporary temporary)
        {
            if (strFieldName == Temporary.Fields.tmpr_sn.ToString())
                temporary.tmpr_sn = (int)value;
            else if (strFieldName == Temporary.Fields.parnts_sn.ToString())
            {
                if (value == null)
                    temporary.parnts_sn = null;
                else
                    temporary.parnts_sn = (int)value;
            }
            else if (strFieldName == Temporary.Fields.team_name.ToString())
                temporary.team_name = (string)value;
            else if (strFieldName == Temporary.Fields.nor_yn.ToString())
                temporary.nor_yn = (bool)value;
            else if (strFieldName == Temporary.Fields.site_sn.ToString())
                temporary.site_sn = (int)value;
        }

        public void ReadRegular(string strFieldName, object value, ref Regular regular)
        {
            if (regular == null)
                return;

            if (strFieldName == Regular.Fields.rgl_sn.ToString())
            {
                if (value == null)
                    regular = null;
                else
                    regular.rgl_sn = (int)value;
            }
            else if (strFieldName == Regular.Fields.team_name.ToString())
            {
                if (value == null)
                    regular = null;
                else
                    regular.team_name = (string)value;
            }
            else if (strFieldName == Regular.Fields.parnts_sn.ToString())
            {
                if (value == null && regular != null)
                    regular.parnts_sn = null;
                else
                    regular.parnts_sn = (int)value;
            }
            else if (strFieldName == Regular.Fields.site_sn.ToString())
            {
                if (value == null && regular != null)
                    regular.site_sn = null;
                else
                    regular.site_sn = (int)value;
            }
        }

        public void ReadRegularMember(string strFieldName, object value, ref RegularMember regularMember)
        {
            if (regularMember == null)
                return;

            if (strFieldName == RegularMember.Fields.rgl_memb_sn.ToString())
            {
                if (value == null)
                    regularMember = null;
                else
                    regularMember.rgl_memb_sn = (int)value;
            }
            else if (strFieldName == RegularMember.Fields.rgl_sn.ToString())
            {
                if (value == null)
                    regularMember = null;
                else
                    regularMember.rgl_sn = (int)value;
            }
            else if (strFieldName == RegularMember.Fields.memb_name.ToString())
            {
                if (value == null)
                    regularMember = null;
                else
                    regularMember.memb_name = (string)value;
            }
            else if (strFieldName == RegularMember.Fields.unq_key.ToString())
            {
                if (value == null && regularMember != null)
                    regularMember.unq_key = null;
                else
                    regularMember.unq_key = (string)value;
            }
            else if (strFieldName == RegularMember.Fields.offm_telno.ToString())
            {
                if (value == null && regularMember != null)
                    regularMember.offm_telno = null;
                else
                    regularMember.offm_telno = (string)value;
            }
            else if (strFieldName == RegularMember.Fields.telno.ToString())
            {
                if (value == null && regularMember != null)
                    regularMember.telno = null;
                else
                    regularMember.telno = (string)value;
            }
            else if (strFieldName == RegularMember.Fields.email.ToString())
            {
                if (value == null && regularMember != null)
                    regularMember.email = null;
                else
                    regularMember.email = (string)value;
            }
            else if (strFieldName == RegularMember.Fields.clsf_optn_no.ToString())
            {
                if (value == null && regularMember != null)
                    regularMember.clsf_optn_no = null;
                else
                    regularMember.clsf_optn_no = (int)value;
            }
            else if (strFieldName == RegularMember.Fields.clsf_no.ToString())
            {
                if (value == null && regularMember != null)
                    regularMember.clsf_no = null;
                else
                    regularMember.clsf_no = (int)value;
            }
            else if (strFieldName == RegularMember.Fields.ofcps_optn_no.ToString())
            {
                if (value == null && regularMember != null)
                    regularMember.ofcps_optn_no = null;
                else
                    regularMember.ofcps_optn_no = (int)value;
            }
            else if (strFieldName == RegularMember.Fields.ofcps_no.ToString())
            {
                if (value == null && regularMember != null)
                    regularMember.ofcps_no = null;
                else
                    regularMember.ofcps_no = (int)value;
            }
            else if (strFieldName == RegularMember.Fields.dty_sttus_optn_no.ToString())
            {
                if (value == null && regularMember != null)
                    regularMember.dty_sttus_optn_no = null;
                else
                    regularMember.dty_sttus_optn_no = (int)value;
            }
            else if (strFieldName == RegularMember.Fields.dty_sttus_no.ToString())
            {
                if (value == null && regularMember != null)
                    regularMember.dty_sttus_no = null;
                else
                    regularMember.dty_sttus_no = (int)value;
            }
            else if (strFieldName == RegularMember.Fields.memo.ToString())
            {
                if (regularMember != null)
                    regularMember.memo = (string)value;
            }
        }

        public void ReadSubDisasterCategory(string strFieldName, object value, MiddleClass subDisasterCategory)
        {
            if (strFieldName == MiddleClass.Fields.mclas_sn.ToString())
                subDisasterCategory.mclas_sn = (int)value;
            else if (strFieldName == MiddleClass.Fields.lclas_sn.ToString())
                subDisasterCategory.lclas_sn = (int)value;
            else if (strFieldName == MiddleClass.Fields.mclas_name.ToString())
                subDisasterCategory.mclas_name = (string)value;
        }

        public void ReadDisasterCategory(string strFieldName, object value, LargeClass disasterCategory)
        {
            if (strFieldName == LargeClass.Fields.lclas_sn.ToString())
                disasterCategory.lclas_sn = (int)value;
            else if (strFieldName == LargeClass.Fields.lclas_name.ToString())
                disasterCategory.lclas_name = (string)value;
            else if (strFieldName == LargeClass.Fields.site_sn.ToString())
                disasterCategory.site_sn = (int)value;
        }

        public void ReadDisaster(string strFieldName, object value, SmallClass disaster)
        {
            if (strFieldName == SmallClass.Fields.sclas_sn.ToString())
                disaster.sclas_sn = (int)value;
            else if (strFieldName == SmallClass.Fields.sclas_name.ToString())
                disaster.sclas_name = (string)value;
            else if (strFieldName == SmallClass.Fields.mclas_sn.ToString())
                disaster.mclas_sn = (int)value;
            else if (strFieldName == SmallClass.Fields.ver_sn.ToString())
                disaster.ver_sn = (int)value;
            else if (strFieldName == SmallClass.Fields.nor_yn.ToString())
                disaster.nor_yn = (bool)value;
            else if (strFieldName == SmallClass.Fields.descp.ToString())
                disaster.descp = (string)value;
        }

        public void ReadSectionComponentTransmission(string strFieldName, object value, ref Transmission transmission)
        {
            if (transmission == null)
                return;

            if (strFieldName == Transmission.Fields.compn_sn.ToString())
            {
                if (value == null)
                    transmission = null;
                else
                    transmission.compn_sn = (int)value;
            }
            else if (strFieldName == Transmission.Fields.title.ToString())
                transmission.title = (string)value;
            else if (strFieldName == Transmission.Fields.sms_yn.ToString())
            {
                if (value == null)
                    transmission = null;
                else
                    transmission.sms_yn = (bool)value;
            }
            else if (strFieldName == Transmission.Fields.email_yn.ToString())
            {
                if (value == null)
                    transmission = null;
                else
                    transmission.email_yn = (bool)value;
            }
            else if (strFieldName == Transmission.Fields.brdcst_yn.ToString())
            {
                if (value == null)
                    transmission = null;
                else
                    transmission.brdcst_yn = (bool)value;
            }
            else if (strFieldName == Transmission.Fields.mssage.ToString())
                transmission.mssage = (string)value;
            else if (strFieldName == Transmission.Fields.leadr_prvuse_yn.ToString())
            {
                if (value == null)
                    transmission.leadr_prvuse_yn = null;
                else
                    transmission.leadr_prvuse_yn = (bool)value;
            }
            else if (strFieldName == Transmission.Fields.atmc_execut_yn.ToString())
            {
                if (value == null)
                    transmission = null;
                else
                    transmission.atmc_execut_yn = (bool)value;
            }
            else if (strFieldName == Transmission.Fields.siren_yn.ToString())
            {
                if (value == null)
                    transmission.siren_yn = null;
                else
                    transmission.siren_yn = (bool)value;
            }
            else if (strFieldName == Transmission.Fields.execut_no.ToString())
            {
                if (value == null)
                    transmission.execut_no = null;
                else
                    transmission.execut_no = (int)value;
            }
        }

        public void ReadSectionComponentProcess(string strFieldName, object value, ref Process process)
        {
            if (process == null)
                return;

            if (strFieldName == Process.Fields.compn_sn.ToString())
            {
                if (value == null)
                    process = null;
                else
                    process.compn_sn = (int)value;
            }
            else if (strFieldName == Process.Fields.title.ToString())
                process.title = (string)value;
            else if (strFieldName == Process.Fields.leadr_prvuse_yn.ToString())
            {
                if (value == null)
                    process.leadr_prvuse_yn = null;
                else
                    process.leadr_prvuse_yn = (bool)value;
            }
            else if (strFieldName == Process.Fields.atmc_execut_yn.ToString())
            {
                if (value == null)
                    process = null;
                else
                    process.atmc_execut_yn = (bool)value;
            }
            else if (strFieldName == Process.Fields.execut_no.ToString())
            {
                if (value == null)
                    process.execut_no = null;
                else
                    process.execut_no = (int)value;
            }
        }

        public void ReadSectionComponentEndpoint(string strFieldName, object value, ref Endpoint endpoint)
        {
            if (endpoint == null)
                return;

            if (strFieldName == Endpoint.Fields.compn_sn.ToString())
            {
                if (value == null)
                    endpoint = null;
                else
                    endpoint.compn_sn = (int)value;
            }
            else if (strFieldName == Endpoint.Fields.title.ToString())
                endpoint.title = (string)value;
            else if (strFieldName == Endpoint.Fields.begin_yn.ToString())
            {
                if (value == null)
                    endpoint = null;
                else
                    endpoint.begin_yn = (bool)value;
            }
            else if (strFieldName == Endpoint.Fields.execut_no.ToString())
            {
                if (value == null)
                    endpoint.execut_no = null;
                else
                    endpoint.execut_no = (int)value;
            }
        }

        public void ReadSectionComponentDecision(string strFieldName, object value, ref Decision decision)
        {
            if (decision == null)
                return;

            if (strFieldName == Decision.Fields.compn_sn.ToString())
            {
                if (value == null)
                    decision = null;
                else
                    decision.compn_sn = (int)value;
            }
            else if (strFieldName == Decision.Fields.title.ToString())
                decision.title = (string)value;
            else if (strFieldName == Decision.Fields.descp.ToString())
                decision.descp = (string)value;
            else if (strFieldName == Decision.Fields.atmc_execut_script.ToString())
                decision.atmc_execut_script = (string)value;
            else if (strFieldName == Decision.Fields.execut_no.ToString())
            {
                if (value == null)
                    decision.execut_no = null;
                else
                    decision.execut_no = (int)value;
            }
        }

        public void ReadSectionComponentComment(string strFieldName, object value, ref Comment annotation)
        {
            if (annotation == null)
                return;

            if (strFieldName == Comment.Fields.compn_sn.ToString())
            {
                if (value == null)
                    annotation = null;
                else
                    annotation.compn_sn = (int)value;
            }
            else if (strFieldName == Comment.Fields.contents.ToString())
                annotation.contents = (string)value;
        }

        public void ReadSectionComponent(string strFieldName, object value, Component section)
        {
            if (strFieldName == Component.Fields.compn_sn.ToString())
                section.compn_sn = (int)value;
            else if (strFieldName == Component.Fields.grid_sn.ToString())
                section.grid_sn = (int)value;
            else if (strFieldName == Component.Fields.column_no.ToString())
                section.column_no = (int)value;
            else if (strFieldName == Component.Fields.row_no.ToString())
                section.row_no = (int)value;
            else if (strFieldName == Component.Fields.compn_optn_code.ToString())
                section.compn_optn_code = (int)value;
            else if (strFieldName == Component.Fields.compn_code.ToString())
                section.compn_code = (int)value;
            else if (strFieldName == Component.Fields.step_memb_sn.ToString())
                section.step_memb_sn = (int)value;
        }

        public void ReadSectionGrid(string strFieldName, object value, Grid grid)
        {
            if (strFieldName == Grid.Fields.grid_sn.ToString())
                grid.grid_sn = (int)value;
            else if (strFieldName == Grid.Fields.step_memb_sn.ToString())
                grid.step_memb_sn = (int)value;
        }

        public void ReadSectionGridColumn(string strFieldName, object value, GridColumn column)
        {
            if (strFieldName == GridColumn.Fields.grid_sn.ToString())
                column.grid_sn = (int)value;
            else if (strFieldName == GridColumn.Fields.column_no.ToString())
                column.column_no = (int)value;
            else if (strFieldName == GridColumn.Fields.width.ToString())
                column.width = (int)value;
        }

        public void ReadSectionGridRow(string strFieldName, object value, GridRow row)
        {
            if (strFieldName == GridRow.Fields.grid_sn.ToString())
                row.grid_sn = (int)value;
            else if (strFieldName == GridRow.Fields.row_no.ToString())
                row.row_no = (int)value;
            else if (strFieldName == GridRow.Fields.height.ToString())
                row.height = (int)value;
        }

        public void ReadUser(string strFieldName, object value, ref User user)
        {
            if (user == null)
                return;

            if (strFieldName == User.Fields.user_sn.ToString())
            {
                if (value == null)
                    user = null;
                else
                    user.user_sn = (int)value;
            }
            else if (strFieldName == User.Fields.grad_sn.ToString())
            {
                if (value == null)
                    user = null;
                else
                    user.grad_sn = (int)value;
            }
            else if (strFieldName == User.Fields.rgl_memb_sn.ToString())
            {
                if (value == null)
                    user.rgl_memb_sn = null;
                else
                    user.rgl_memb_sn = (int)value;
            }
            else if (strFieldName == User.Fields.password.ToString())
                user.password = (string)value;
            else if (strFieldName == User.Fields.user_id.ToString())
                user.user_id = (string)value;
            else if (strFieldName == User.Fields.user_name.ToString())
                user.user_name = (string)value;
            else if (strFieldName == User.Fields.password_key.ToString())
                user.password_key = (string)value;
            else if (strFieldName == User.Fields.password_salt.ToString())
                user.password_salt = (string)value;
            else if (strFieldName == User.Fields.site_sn.ToString())
            {
                if (value == null)
                    user.site_sn = null;
                else
                    user.site_sn = (int)value;
            }
            else if (strFieldName == User.Fields.memo.ToString())
                user.memo = (string)value;
        }

        public void ReadVersion(string strFieldName, object value, ref Base.Model.Sop.Category.Version version)
        {
            if (version == null)
                return;

            if (strFieldName == Base.Model.Sop.Category.Version.Fields.ver_sn.ToString())
            {
                if (value == null)
                    version = null;
                else
                    version.ver_sn = (int)value;
            }
            else if (strFieldName == Base.Model.Sop.Category.Version.Fields.creat_de.ToString())
            {
                if (value == null)
                    version = null;
                else
                    version.creat_de = (DateTime)value;
            }
            else if (strFieldName == Base.Model.Sop.Category.Version.Fields.last_acces_de.ToString())
            {
                if (value == null)
                    version = null;
                else
                    version.last_acces_de = (DateTime)value;
            }
            else if (strFieldName == Base.Model.Sop.Category.Version.Fields.name.ToString())
                version.name = (string)value;
            else if (strFieldName == Base.Model.Sop.Category.Version.Fields.user_sn.ToString())
            {
                if (value == null)
                    version.user_sn = null;
                else
                    version.user_sn = (int)value;
            }
            else if (strFieldName == Base.Model.Sop.Category.Version.Fields.site_sn.ToString())
            {
                if (value == null)
                    version = null;
                else
                    version.site_sn = (int)value;
            }
            else if (strFieldName == Base.Model.Sop.Category.Version.Fields.descp.ToString())
                version.descp = (string)value;
        }

        public void ReadSensorZoneHistoryDetail(string strFieldName, object value, Base.Model.History.SensorZoneDetail sensorZoneHistoryList)
        {
            if (strFieldName == Base.Model.History.SensorZoneDetail.Fields.sensor_zone_hist_sn.ToString())
                sensorZoneHistoryList.sensor_zone_hist_sn = (int)value;
            else if (strFieldName == Base.Model.History.SensorZoneDetail.Fields.sensor_zone_sn.ToString())
                sensorZoneHistoryList.sensor_zone_sn = (int)value;
            else if (strFieldName == Model.History.SensorZoneDetail.Fields.tm.ToString())
            {
                if (value == null)
                    sensorZoneHistoryList.tm = null;
                else
                    sensorZoneHistoryList.tm = (DateTime)value;
            }
        }

        public void ReadSensorZoneHistory(string strFieldName, object value, Base.Model.History.SensorZone sensorZoneHistory)
        {
            if (strFieldName == Base.Model.History.SensorZone.Fields.sensor_zone_hist_sn.ToString())
                sensorZoneHistory.sensor_zone_hist_sn = (int)value;
            else if (strFieldName == Base.Model.History.SensorZone.Fields.tm.ToString())
                sensorZoneHistory.tm = (DateTime)value;
            else if (strFieldName == Base.Model.History.SensorZone.Fields.zone_sn.ToString())
            {
                if (value == null)
                    sensorZoneHistory.zone_sn = null;
                else
                    sensorZoneHistory.zone_sn = (int)value;
            }
            else if (strFieldName == Base.Model.History.SensorZone.Fields.sensor_ty_optn_code.ToString())
                sensorZoneHistory.sensor_ty_optn_code = (int)value;
            else if (strFieldName == Base.Model.History.SensorZone.Fields.sensor_ty_code.ToString())
                sensorZoneHistory.sensor_ty_code = (int)value;
            else if (strFieldName == Base.Model.History.SensorZone.Fields.detct_sttus_optn_code.ToString())
            {
                if (value == null)
                    sensorZoneHistory.detct_sttus_optn_code = null;
                else
                    sensorZoneHistory.detct_sttus_optn_code = (int)value;
            }
            else if (strFieldName == Base.Model.History.SensorZone.Fields.detct_sttus_code.ToString())
            {
                if (value == null)
                    sensorZoneHistory.detct_sttus_code = null;
                else
                    sensorZoneHistory.detct_sttus_code = (int)value;
            }
            else if (strFieldName == Base.Model.History.SensorZone.Fields.memo.ToString())
                sensorZoneHistory.memo = (string)value;
            else if (strFieldName == Base.Model.History.SensorZone.Fields.site_sn.ToString())
                sensorZoneHistory.site_sn = (int)value;
            else if (strFieldName == Base.Model.History.SensorZone.Fields.reportr.ToString())
                sensorZoneHistory.reportr = (string)value;
        }

        public void ReadSensor(string strFieldName, object value, Sensor sensor)
        {
            if (strFieldName == Sensor.Fields.sensor_sn.ToString())
                sensor.sensor_sn = (int)value;
            else if (strFieldName == Sensor.Fields.sensor_ty_optn_code.ToString())
                sensor.sensor_ty_optn_code = (int)value;
            else if (strFieldName == Sensor.Fields.sensor_ty_code.ToString())
                sensor.sensor_ty_code = (int)value;
            else if (strFieldName == Sensor.Fields.sensor_name.ToString())
                sensor.sensor_name = (string)value;
            else if (strFieldName == Sensor.Fields.lc_name.ToString())
                sensor.lc_name = (string)value;
            else if (strFieldName == Sensor.Fields.x.ToString())
            {
                if (value == null)
                    sensor.x = null;
                else
                    sensor.x = (double)(float)value;
            }
            else if (strFieldName == Sensor.Fields.y.ToString())
            {
                if (value == null)
                    sensor.y = null;
                else
                    sensor.y = (double)(float)value;
            }
            else if (strFieldName == Sensor.Fields.z.ToString())
            {
                if (value == null)
                    sensor.z = null;
                else
                    sensor.z = (double)(float)value;
            }
            else if (strFieldName == Sensor.Fields.zone_sn.ToString())
            {
                if (value == null)
                    sensor.zone_sn = null;
                else
                    sensor.zone_sn = (int)value;
            }
            else if (strFieldName == Sensor.Fields.site_sn.ToString())
                sensor.site_sn = (int)value;
            else if (strFieldName == Sensor.Fields.sensor_sttus_optn_code.ToString())
            {
                if (value == null)
                    sensor.sensor_sttus_optn_code = null;
                else
                    sensor.sensor_sttus_optn_code = (int)value;
            }
            else if (strFieldName == Sensor.Fields.sensor_sttus_code.ToString())
            {
                if (value == null)
                    sensor.sensor_sttus_code = null;
                else
                    sensor.sensor_sttus_code = (int)value;
            }
            else if (strFieldName == Sensor.Fields.enab.ToString())
                sensor.enab = (bool)value;
            else if (strFieldName == Sensor.Fields.deleted.ToString())
                sensor.deleted = (bool)value;
            else if (strFieldName == Sensor.Fields.manual_yn.ToString())
                sensor.manual_yn = (bool)value;
        }

        public void ReadSensorZone(string strFieldName, object value, SensorZone sensorZone)
        {
            if (strFieldName == SensorZone.Fields.sensor_zone_sn.ToString())
                sensorZone.sensor_zone_sn = (int)value;
            else if (strFieldName == SensorZone.Fields.sensor_sn.ToString())
                sensorZone.sensor_sn = (int)value;
            else if (strFieldName == SensorZone.Fields.sensor_ty_optn_code.ToString())
                sensorZone.sensor_ty_optn_code = (int)value;
            else if (strFieldName == SensorZone.Fields.sensor_ty_code.ToString())
                sensorZone.sensor_ty_code = (int)value;
            else if (strFieldName == SensorZone.Fields.sensor_sub_ty_no.ToString())
            {
                if (value == null)
                    sensorZone.sensor_sub_ty_no = null;
                else
                    sensorZone.sensor_sub_ty_no = (int)value;
            }
            else if (strFieldName == SensorZone.Fields.unq_key.ToString())
                sensorZone.unq_key = (string)value;
            else if (strFieldName == SensorZone.Fields.eqp_zone_sn.ToString())
            {
                if (value == null)
                    sensorZone.eqp_zone_sn = null;
                else
                    sensorZone.eqp_zone_sn = (int)value;
            }
            else if (strFieldName == SensorZone.Fields.alarm_yn.ToString())
                sensorZone.alarm_yn = (bool)value;
            else if (strFieldName == SensorZone.Fields.tag_no.ToString())
            {
                if (value == null)
                    sensorZone.tag_no = null;
                else
                    sensorZone.tag_no = (int)value;
            }
            else if (strFieldName == SensorZone.Fields.acti.ToString())
                sensorZone.acti = (bool)value;
            else if (strFieldName == SensorZone.Fields.sensor_server_sn.ToString())
            {
                if (value == null)
                    sensorZone.sensor_server_sn = null;
                else
                    sensorZone.sensor_server_sn = (int)value;
            }
            else if (strFieldName == SensorZone.Fields.descp.ToString())
                sensorZone.descp = (string)value;
        }

        public void ReadMaterial(string strFieldName, object value, ref Material sensor)
        {
            if (sensor == null)
                return;

            if (strFieldName == Material.Fields.sensor_zone_sn.ToString())
            {
                if (value == null)
                {
                    sensor = null;
                    return;
                }

                sensor.sensor_zone_sn = (int)value;
            }
            else if (strFieldName == Material.Fields.cur_data.ToString())
                sensor.cur_data = (string)value;
            else if (strFieldName == Material.Fields.lim_bas.ToString())
            {
                if (value == null)
                    sensor.lim_bas = null;
                else
                    sensor.lim_bas = (float)value;
            }
            else if (strFieldName == Material.Fields.sensor_lim_ty_optn_code.ToString())
            {
                if (value == null)
                    sensor.sensor_lim_ty_optn_code = null;
                else
                    sensor.sensor_lim_ty_optn_code = (int)value;
            }
            else if (strFieldName == Material.Fields.sensor_lim_ty.ToString())
            {
                if (value == null)
                    sensor.sensor_lim_ty = null;
                else
                    sensor.sensor_lim_ty = (int)value;
            }
        }

        public void ReadEquipZoneCCTV(string strFieldName, object value, ref EquipZoneCCTV equipZoneCCTV)
        {
            if (equipZoneCCTV == null)
                return;

            if (strFieldName == EquipZoneCCTV.Fields.eqp_zone_sn.ToString())
            {
                if (value == null)
                {
                    equipZoneCCTV = null;
                    return;
                }

                equipZoneCCTV.eqp_zone_sn = (int)value;
            }
            else if (strFieldName == EquipZoneCCTV.Fields.cctv_1.ToString())
            {
                if (value == null)
                    equipZoneCCTV.cctv_1 = null;
                else
                    equipZoneCCTV.cctv_1 = (int)value;
            }
            else if (strFieldName == EquipZoneCCTV.Fields.cctv_2.ToString())
            {
                if (value == null)
                    equipZoneCCTV.cctv_2 = null;
                else
                    equipZoneCCTV.cctv_2 = (int)value;
            }
            else if (strFieldName == EquipZoneCCTV.Fields.cctv_3.ToString())
            {
                if (value == null)
                    equipZoneCCTV.cctv_3 = null;
                else
                    equipZoneCCTV.cctv_3 = (int)value;
            }
            else if (strFieldName == EquipZoneCCTV.Fields.cctv_4.ToString())
            {
                if (value == null)
                    equipZoneCCTV.cctv_4 = null;
                else
                    equipZoneCCTV.cctv_4 = (int)value;
            }
        }

        public void ReadSensorZoneCCTV(string strFieldName, object value, ref SensorZoneCCTV sensorZoneCCTV)
        {
            if (sensorZoneCCTV == null)
                return;

            if (strFieldName == SensorZoneCCTV.Fields.sensor_zone_sn.ToString())
            {
                if (value == null)
                {
                    sensorZoneCCTV = null;
                    return;
                }

                sensorZoneCCTV.sensor_zone_sn = (int)value;
            }
            else if (strFieldName == SensorZoneCCTV.Fields.cctv_1.ToString())
            {
                if (value == null)
                    sensorZoneCCTV.cctv_1 = null;
                else
                    sensorZoneCCTV.cctv_1 = (int)value;
            }
            else if (strFieldName == SensorZoneCCTV.Fields.cctv_2.ToString())
            {
                if (value == null)
                    sensorZoneCCTV.cctv_2 = null;
                else
                    sensorZoneCCTV.cctv_2 = (int)value;
            }
            else if (strFieldName == SensorZoneCCTV.Fields.cctv_3.ToString())
            {
                if (value == null)
                    sensorZoneCCTV.cctv_3 = null;
                else
                    sensorZoneCCTV.cctv_3 = (int)value;
            }
            else if (strFieldName == SensorZoneCCTV.Fields.cctv_4.ToString())
            {
                if (value == null)
                    sensorZoneCCTV.cctv_4 = null;
                else
                    sensorZoneCCTV.cctv_4 = (int)value;
            }
        }

        public void ReadEquipmentZone(string strFieldName, object value, ref EquipmentZone equipZone)
        {
            if (equipZone == null)
                return;

            if (strFieldName == EquipmentZone.Fields.eqp_zone_sn.ToString())
            {
                if (value == null)
                {
                    equipZone = null;
                    return;
                }

                equipZone.eqp_zone_sn = (int)value;
            }
            else if (strFieldName == EquipmentZone.Fields.name.ToString())
                equipZone.name = (string)value;
            else if (strFieldName == EquipmentZone.Fields.text_center_crdnt_x.ToString())
            {
                if (value == null)
                    equipZone.text_center_crdnt_x = null;
                else
                    equipZone.text_center_crdnt_x = (double)(float)value;
            }
            else if (strFieldName == EquipmentZone.Fields.text_center_crdnt_y.ToString())
            {
                if (value == null)
                    equipZone.text_center_crdnt_y = null;
                else
                    equipZone.text_center_crdnt_y = (double)(float)value;
            }
            else if (strFieldName == EquipmentZone.Fields.text_center_crdnt_z.ToString())
            {
                if (value == null)
                    equipZone.text_center_crdnt_z = null;
                else
                    equipZone.text_center_crdnt_z = (double)(float)value;
            }
            else if (strFieldName == EquipmentZone.Fields.brdcst_text.ToString())
                equipZone.brdcst_text = (string)value;
            else if (strFieldName == EquipmentZone.Fields.disp_text.ToString())
                equipZone.disp_text = (string)value;
            else if (strFieldName == EquipmentZone.Fields.site_sn.ToString())
            {
                if (value == null)
                {
                    equipZone = null;
                    return;
                }

                equipZone.site_sn = (int)value;
            }
        }

        public void ReadEquipmentZoneLinkedZone(string strFieldName, object value, EquipmentZoneLinkedZone link)
        {
            if (strFieldName == EquipmentZoneLinkedZone.Fields.eqp_zone_sn.ToString())
                link.eqp_zone_sn = (int)value;
            else if (strFieldName == EquipmentZoneLinkedZone.Fields.zone_sn.ToString())
                link.zone_sn = (int)value;
        }

        public void ReadCCTV(string strFieldName, object value, CCTV cctv)
        {
            if (cctv == null)
                return;

            if (strFieldName == CCTV.Fields.sensor_sn.ToString())
                cctv.sensor_sn = (int)value;
            else if (strFieldName == CCTV.Fields.sensor_ty_optn_code.ToString())
                cctv.sensor_ty_optn_code = (int)value;
            else if (strFieldName == CCTV.Fields.sensor_ty_code.ToString())
                cctv.sensor_ty_code = (int)value;
            else if (strFieldName == CCTV.Fields.cctv_no.ToString())
                cctv.cctv_no = (int)value;
            else if (strFieldName == CCTV.Fields.unq_key.ToString())
                cctv.unq_key = (string)value;
            else if (strFieldName == CCTV.Fields.indoor_yn.ToString())
                cctv.indoor_yn = (bool)value;
            else if (strFieldName == CCTV.Fields.strmg_ty.ToString())
                cctv.strmg_ty = (string)value;
            else if (strFieldName == CCTV.Fields.chnnl.ToString())
            {
                if (value == null)
                    cctv.chnnl = null;
                else
                    cctv.chnnl = (int)value;
            }
            else if (strFieldName == CCTV.Fields.user_id.ToString())
                cctv.user_id = (string)value;
            else if (strFieldName == CCTV.Fields.password.ToString())
                cctv.password = (string)value;
            else if (strFieldName == CCTV.Fields.url.ToString())
                cctv.url = (string)value;
            else if (strFieldName == CCTV.Fields.hd_url.ToString())
                cctv.hd_url = (string)value;
            else if (strFieldName == CCTV.Fields.ld_url.ToString())
                cctv.ld_url = (string)value;
            else if (strFieldName == CCTV.Fields.camera_ip.ToString())
                cctv.camera_ip = (string)value;
            else if (strFieldName == CCTV.Fields.camera_makr_name.ToString())
                cctv.camera_makr_name = (string)value;
            else if (strFieldName == CCTV.Fields.camera_model_name.ToString())
                cctv.camera_model_name = (string)value;
        }

        public void ReadAlarm(string strFieldName, object value, Current alarm)
        {
            if (strFieldName == Current.Fields.sensor_zone_hist_sn.ToString())
                alarm.sensor_zone_hist_sn = (int)value;
            else if (strFieldName == Current.Fields.sensor_zone_sn.ToString())
                alarm.sensor_zone_sn = (int)value;
            else if (strFieldName == Current.Fields.detct_ty_optn_code.ToString())
                alarm.detct_ty_optn_code = (int)value;
            else if (strFieldName == Current.Fields.detct_ty_code.ToString())
                alarm.detct_ty_code = (int)value;
            else if (strFieldName == Current.Fields.alarm_tm.ToString())
                alarm.alarm_tm = (DateTime)value;
            else if (strFieldName == Current.Fields.sop_sttus_optn_code.ToString())
                alarm.sop_sttus_optn_code = (int)value;
            else if (strFieldName == Current.Fields.sop_sttus_code.ToString())
                alarm.sop_sttus_code = (int)value;
            else if (strFieldName == Current.Fields.alarm_level.ToString())
                alarm.alarm_level = (int)value;
        }

        public void ReadSession(string strFieldName, object value, Session session)
        {
            if (strFieldName == Session.Fields.user_sn.ToString())
                session.user_sn = (int)value;
            else if (strFieldName == Session.Fields.session_key.ToString())
                session.session_key = (string)value;
            else if (strFieldName == Session.Fields.creat_de.ToString())
                session.creat_de = (DateTime)value;
            else if (strFieldName == Session.Fields.updt_de.ToString())
                session.updt_de = (DateTime)value;
            else if (strFieldName == Session.Fields.atmc_login_yn.ToString())
                session.atmc_login_yn = (bool)value;
        }

        public void ReadUserGrade(string strFieldName, object value, Grade grade)
        {
            if (strFieldName == Grade.Fields.grad_sn.ToString())
                grade.grad_sn = (int)value;
            else if (strFieldName == Grade.Fields.grad_name.ToString())
                grade.grad_name = (string)value;
        }

        public ArrayList JoinHistorySensorReactionHistorySensorZoneZone(string strAdditionalConditions, out string strErrorMessage)
        {
            Model.History.SensorReaction reaction = new Model.History.SensorReaction();
            Model.History.SensorZone sensorZoneHistory = new Model.History.SensorZone();
            Zone zone = new Zone();

            string strFormat = "Select a.*, b.*, c.* from {0} a inner join {1} b on a.{3} = b.{4} inner join {2} c on b.{5} = c.{6} ";

            string strSQL = string.Format(strFormat,
                Model.History.SensorReaction.TableName, Model.History.SensorZone.TableName, Zone.TableName,
                Model.History.SensorReaction.Fields.sensor_zone_hist_sn,
                Model.History.SensorZone.Fields.sensor_zone_hist_sn,
                Model.History.SensorZone.Fields.zone_sn,
                Zone.Fields.zone_sn);

            if (strAdditionalConditions != null && strAdditionalConditions.Length > 0)
            {
                if (strAdditionalConditions.ToLower().Trim().StartsWith("order by"))
                    strSQL += " " + strAdditionalConditions;
                else
                    strSQL += " where " + strAdditionalConditions;
            }

            ArrayList arrDatas = new ArrayList();
            IEnumerable<dynamic> result = this.Select(strSQL, out strErrorMessage);

            if (result == null)
                return null;

            int nSensorReactionFieldCount = reaction.GetFieldCount();
            int nSensorZoneHistoryFieldCount = sensorZoneHistory.GetFieldCount();
            int nZoneFieldCount = zone.GetFieldCount();

            foreach (var item in result)
            {
                var data = item as IDictionary<string, object>;
                int nIndex = 0;

                reaction = new Model.History.SensorReaction();
                sensorZoneHistory = new Model.History.SensorZone();
                zone = new Zone();

                foreach (KeyValuePair<string, object> pair in data)
                {
                    if (nIndex < nSensorReactionFieldCount)
                        ReadSensorReaction(pair.Key, pair.Value, reaction);
                    else if (nIndex < nSensorReactionFieldCount + nSensorZoneHistoryFieldCount)
                        ReadHistorySensorZone(pair.Key, pair.Value, sensorZoneHistory);
                    else
                        ReadZone(pair.Key, pair.Value, ref zone);

                    nIndex++;
                }

                arrDatas.Add(reaction);
                arrDatas.Add(sensorZoneHistory);
                arrDatas.Add(zone);
            }

            return arrDatas;
        }

        public ArrayList JoinHistorySensorZoneDetailSensorZoneEquipmentZone(string strAdditionalConditions, out string strErrorMessage)
        {
            Model.History.SensorZoneDetail sensorZoneDetail = new Model.History.SensorZoneDetail();
            SensorZone sensorZone = new SensorZone();
            EquipmentZone equipment = new EquipmentZone();

            string strFormat = "Select a.*, b.*, c.* from {0} a, {1} b, {2} c ";
            strFormat += "where a.{3} = b.{4} ";
            strFormat += "and b.{5} = c.{6} ";

            string strSQL = string.Format(strFormat,
                Model.History.SensorZoneDetail.TableName, SensorZone.TableName, EquipmentZone.TableName,
                Model.History.SensorZoneDetail.Fields.sensor_zone_sn,
                SensorZone.Fields.sensor_zone_sn,
                SensorZone.Fields.eqp_zone_sn,
                EquipmentZone.Fields.eqp_zone_sn);

            if (strAdditionalConditions != null && strAdditionalConditions.Length > 0)
            {
                if (strAdditionalConditions.ToLower().Trim().StartsWith("order by"))
                    strSQL += " " + strAdditionalConditions;
                else
                    strSQL += " where " + strAdditionalConditions;
            }

            ArrayList arrDatas = new ArrayList();
            IEnumerable<dynamic> result = this.Select(strSQL, out strErrorMessage);

            if (result == null)
                return null;

            int nSensorZoneDetailFieldCount = sensorZoneDetail.GetFieldCount();
            int nSensorZoneFieldCount = sensorZone.GetFieldCount();
            int nEquipmentZoneFieldCount = equipment.GetFieldCount();

            foreach (var item in result)
            {
                var data = item as IDictionary<string, object>;
                int nIndex = 0;

                sensorZoneDetail = new Model.History.SensorZoneDetail();
                sensorZone = new SensorZone();
                equipment = new EquipmentZone();

                foreach (KeyValuePair<string, object> pair in data)
                {
                    if (nIndex < nSensorZoneDetailFieldCount)
                        ReadSensorZoneHistoryDetail(pair.Key, pair.Value, sensorZoneDetail);
                    else if (nIndex < nSensorZoneDetailFieldCount + nSensorZoneFieldCount)
                        ReadSensorZone(pair.Key, pair.Value, sensorZone);
                    else
                        ReadEquipmentZone(pair.Key, pair.Value, ref equipment);


                    nIndex++;
                }

                arrDatas.Add(sensorZoneDetail);
                arrDatas.Add(sensorZone);
                arrDatas.Add(equipment);
            }

            return arrDatas;
        }

        public ArrayList JoinSensorZoneEquipmentZoneZoneBuilding(string strAdditionalConditions, out string strErrorMessage)
        {
            SensorZone sensorZone = new SensorZone();
            EquipmentZone equipZone = new EquipmentZone();
            Zone zone = new Zone();
            Building building = new Building();
            EquipmentZoneLinkedZone link = new EquipmentZoneLinkedZone();

            string strFormat = "Select a.*, b.*, c.*, d.* from {0} a inner join {1} b on a.{5} = b.{6} inner join {2} e on b.{6} = e.{7} inner join {3} c on e.{8} = c.{9} left outer join {4} d on c.{10} = d.{11}";

            string strSQL = string.Format(strFormat,
                SensorZone.TableName, EquipmentZone.TableName, EquipmentZoneLinkedZone.TableName, Zone.TableName, Building.TableName,
                SensorZone.Fields.eqp_zone_sn, EquipmentZone.Fields.eqp_zone_sn,
                EquipmentZoneLinkedZone.Fields.eqp_zone_sn,
                EquipmentZoneLinkedZone.Fields.zone_sn, Zone.Fields.zone_sn,
                Zone.Fields.buld_sn, Building.Fields.buld_sn);

            if (strAdditionalConditions != null && strAdditionalConditions.Length > 0)
            {
                if (strAdditionalConditions.ToLower().Trim().StartsWith("order by"))
                    strSQL += " " + strAdditionalConditions;
                else
                    strSQL += " where " + strAdditionalConditions;
            }

            ArrayList arrDatas = new ArrayList();
            IEnumerable<dynamic> result = this.Select(strSQL, out strErrorMessage);

            if (result == null)
                return null;

            int nSensorZoneFieldCount = sensorZone.GetFieldCount();
            int nEquipZoneFieldCount = equipZone.GetFieldCount();
            int nZoneFieldCount = zone.GetFieldCount();

            foreach (var item in result)
            {
                var data = item as IDictionary<string, object>;
                int nIndex = 0;

                sensorZone = new SensorZone();
                equipZone = new EquipmentZone();
                zone = new Zone();
                building = new Building();

                foreach (KeyValuePair<string, object> pair in data)
                {
                    if (nIndex < nSensorZoneFieldCount)
                        ReadSensorZone(pair.Key, pair.Value, sensorZone);
                    else if (nIndex < nSensorZoneFieldCount + nEquipZoneFieldCount)
                        ReadEquipmentZone(pair.Key, pair.Value, ref equipZone);
                    else if (nIndex < nSensorZoneFieldCount + nEquipZoneFieldCount + nZoneFieldCount)
                        ReadZone(pair.Key, pair.Value, ref zone);
                    else
                        ReadBuilding(pair.Key, pair.Value, ref building);

                    nIndex++;
                }

                arrDatas.Add(sensorZone);
                arrDatas.Add(equipZone);
                arrDatas.Add(zone);
                arrDatas.Add(building);
            }

            return arrDatas;
        }

        public ArrayList JoinSensorZoneEquipmentZoneZoneBuildingBuildingGroup(string strAdditionalConditions, out string strErrorMessage)
        {
            SensorZone sensorZone = new SensorZone();
            EquipmentZone equipZone = new EquipmentZone();
            Zone zone = new Zone();
            Building building = new Building();
            BuildingGroup buildingGroup = new BuildingGroup();
            EquipmentZoneLinkedZone link = new EquipmentZoneLinkedZone();

            string strFormat = "Select a.*, b.*, c.*, d.*, f.* from {0} a inner join {1} b on a.{6} = b.{7} inner join {2} e on b.{7} = e.{8} inner join {3} c on e.{9} = c.{10} left outer join {4} d on c.{11} = d.{12} left outer join {5} f on d.{13} = f.{14}";

            string strSQL = string.Format(strFormat,
                SensorZone.TableName, EquipmentZone.TableName, EquipmentZoneLinkedZone.TableName, Zone.TableName, Building.TableName, BuildingGroup.TableName,
                SensorZone.Fields.eqp_zone_sn, EquipmentZone.Fields.eqp_zone_sn,
                EquipmentZoneLinkedZone.Fields.eqp_zone_sn,
                EquipmentZoneLinkedZone.Fields.zone_sn, Zone.Fields.zone_sn,
                Zone.Fields.buld_sn, Building.Fields.buld_sn,
                Building.Fields.buld_group_sn, BuildingGroup.Fields.buld_group_sn);

            if (strAdditionalConditions != null && strAdditionalConditions.Length > 0)
            {
                if (strAdditionalConditions.ToLower().Trim().StartsWith("order by"))
                    strSQL += " " + strAdditionalConditions;
                else
                    strSQL += " where " + strAdditionalConditions;
            }

            ArrayList arrDatas = new ArrayList();
            IEnumerable<dynamic> result = this.Select(strSQL, out strErrorMessage);

            if (result == null)
                return null;

            int nSensorZoneFieldCount = sensorZone.GetFieldCount();
            int nEquipZoneFieldCount = equipZone.GetFieldCount();
            int nZoneFieldCount = zone.GetFieldCount();
            int nBuildingFieldCount = building.GetFieldCount();

            foreach (var item in result)
            {
                var data = item as IDictionary<string, object>;
                int nIndex = 0;

                sensorZone = new SensorZone();
                equipZone = new EquipmentZone();
                zone = new Zone();
                building = new Building();
                buildingGroup = new BuildingGroup();

                foreach (KeyValuePair<string, object> pair in data)
                {
                    if (nIndex < nSensorZoneFieldCount)
                        ReadSensorZone(pair.Key, pair.Value, sensorZone);
                    else if (nIndex < nSensorZoneFieldCount + nEquipZoneFieldCount)
                        ReadEquipmentZone(pair.Key, pair.Value, ref equipZone);
                    else if (nIndex < nSensorZoneFieldCount + nEquipZoneFieldCount + nZoneFieldCount)
                        ReadZone(pair.Key, pair.Value, ref zone);
                    else if (nIndex < nSensorZoneFieldCount + nEquipZoneFieldCount + nZoneFieldCount + nBuildingFieldCount)
                        ReadBuilding(pair.Key, pair.Value, ref building);
                    else
                        ReadBuildingGroup(pair.Key, pair.Value, ref buildingGroup);

                    nIndex++;
                }

                arrDatas.Add(sensorZone);
                arrDatas.Add(equipZone);
                arrDatas.Add(zone);
                arrDatas.Add(building);
                arrDatas.Add(buildingGroup);
            }

            return arrDatas;
        }

        public ArrayList JoinSensorZoneEquipmentZone(string strAdditionalConditions, out string strErrorMessage)
        {
            SensorZone sensorZone = new SensorZone();
            EquipmentZone equipZone = new EquipmentZone();

            string strFormat = "Select a.*, b.* from {0} a inner join {1} b on a.{2} = b.{3}";

            string strSQL = string.Format(strFormat,
                SensorZone.TableName, EquipmentZone.TableName,
                SensorZone.Fields.eqp_zone_sn, EquipmentZone.Fields.eqp_zone_sn);

            if (strAdditionalConditions != null && strAdditionalConditions.Length > 0)
            {
                if (strAdditionalConditions.ToLower().Trim().StartsWith("order by"))
                    strSQL += " " + strAdditionalConditions;
                else
                    strSQL += " where " + strAdditionalConditions;
            }

            ArrayList arrDatas = new ArrayList();
            IEnumerable<dynamic> result = this.Select(strSQL, out strErrorMessage);

            if (result == null)
                return null;

            int nSensorZoneFieldCount = sensorZone.GetFieldCount();

            foreach (var item in result)
            {
                var data = item as IDictionary<string, object>;
                int nIndex = 0;

                sensorZone = new SensorZone();
                equipZone = new EquipmentZone();

                foreach (KeyValuePair<string, object> pair in data)
                {
                    if (nIndex < nSensorZoneFieldCount)
                        ReadSensorZone(pair.Key, pair.Value, sensorZone);
                    else
                        ReadEquipmentZone(pair.Key, pair.Value, ref equipZone);

                    nIndex++;
                }

                arrDatas.Add(sensorZone);
                arrDatas.Add(equipZone);
            }

            return arrDatas;
        }

        public void ReadSensorReaction(string strFieldName, object value, Model.History.SensorReaction sensorReaction)
        {
            if (sensorReaction == null)
                return;

            if (strFieldName == Model.History.SensorReaction.Fields.sensor_react_hist_sn.ToString())
                sensorReaction.sensor_react_hist_sn = (int)value;
            else if (strFieldName == Model.History.SensorReaction.Fields.sensor_zone_hist_sn.ToString())
                sensorReaction.sensor_zone_hist_sn = (int)value;
            else if (strFieldName == Model.History.SensorReaction.Fields.react_ty_optn_code.ToString())
                sensorReaction.react_ty_optn_code = (int)value;
            else if (strFieldName == Model.History.SensorReaction.Fields.react_ty_code.ToString())
                sensorReaction.react_ty_code = (int)value;
            else if (strFieldName == Model.History.SensorReaction.Fields.tm.ToString())
                sensorReaction.tm = (DateTime)value;
            else if (strFieldName == Model.History.SensorReaction.Fields.mssage.ToString())
                sensorReaction.mssage = (string)value;
            else if (strFieldName == Model.History.SensorReaction.Fields.zone_sn.ToString())
            {
                if (value == null)
                    sensorReaction.zone_sn = null;
                else
                    sensorReaction.zone_sn = (int)value;
            }
            else if (strFieldName == Model.History.SensorReaction.Fields.eqp_zone_sn.ToString())
            {
                if (value == null)
                    sensorReaction.eqp_zone_sn = null;
                else
                    sensorReaction.eqp_zone_sn = (int)value;
            }
            else if (strFieldName == Model.History.SensorReaction.Fields.sensor_zone_sn.ToString())
            {
                if (value == null)
                    sensorReaction.sensor_zone_sn = null;
                else
                    sensorReaction.sensor_zone_sn = (int)value;
            }
            else if (strFieldName == Model.History.SensorReaction.Fields.sensor_value.ToString())
                sensorReaction.sensor_value = (string)value;
            else if (strFieldName == Model.History.SensorReaction.Fields.user_sn.ToString())
            {
                if (value == null)
                    sensorReaction.user_sn = null;
                else
                    sensorReaction.user_sn = (int)value;
            }
            else if (strFieldName == Model.History.SensorReaction.Fields.alarm_level.ToString())
            {
                if (value == null)
                    sensorReaction.alarm_level = null;
                else
                    sensorReaction.alarm_level = (int)value;
            }
        }

        public void ReadHistorySensorZone(string strFieldName, object value, Model.History.SensorZone sensorZone)
        {
            if (sensorZone == null)
                return;

            if (strFieldName == Model.History.SensorZone.Fields.sensor_zone_hist_sn.ToString())
                sensorZone.sensor_zone_hist_sn = (int)value;
            else if (strFieldName == Model.History.SensorZone.Fields.tm.ToString())
                sensorZone.tm = (DateTime)value;
            else if (strFieldName == Model.History.SensorZone.Fields.zone_sn.ToString())
            {
                if (value == null)
                    sensorZone.zone_sn = null;
                else
                    sensorZone.zone_sn = (int)value;
            }
            else if (strFieldName == Model.History.SensorZone.Fields.sensor_ty_optn_code.ToString())
                sensorZone.sensor_ty_optn_code = (int)value;
            else if (strFieldName == Model.History.SensorZone.Fields.sensor_ty_code.ToString())
                sensorZone.sensor_ty_code = (int)value;
            else if (strFieldName == Model.History.SensorZone.Fields.detct_sttus_optn_code.ToString())
            {
                if (value == null)
                    sensorZone.detct_sttus_optn_code = null;
                else
                    sensorZone.detct_sttus_optn_code = (int)value;
            }
            else if (strFieldName == Model.History.SensorZone.Fields.detct_sttus_code.ToString())
            {
                if (value == null)
                    sensorZone.detct_sttus_code = null;
                else
                    sensorZone.detct_sttus_code = (int)value;
            }
            else if (strFieldName == Model.History.SensorZone.Fields.memo.ToString())
                sensorZone.memo = (string)value;
            else if (strFieldName == Model.History.SensorZone.Fields.site_sn.ToString())
                sensorZone.site_sn = (int)value;
            else if (strFieldName == Model.History.SensorZone.Fields.reportr.ToString())
                sensorZone.reportr = (string)value;
        }

        public void ReadZone(string strFieldName, object value, ref Zone zone)
        {
            if (zone == null)
                return;

            if (strFieldName == Zone.Fields.zone_sn.ToString())
            {
                if (value == null)
                    zone = null;
                else
                    zone.zone_sn = (int)value;
            }
            else if (strFieldName == Zone.Fields.name.ToString())
                zone.name = (string)value;
            else if (strFieldName == Zone.Fields.buld_sn.ToString())
            {
                if (value == null)
                    zone.buld_sn = null;
                else
                    zone.buld_sn = (int)value;
            }
            else if (strFieldName == Zone.Fields.floor_indx.ToString())
            {
                if (value == null)
                    zone.floor_indx = null;
                else
                    zone.floor_indx = (int)value;
            }
            else if (strFieldName == Zone.Fields.adit_floor.ToString())
            {
                if (value == null)
                    zone.adit_floor = null;
                else
                    zone.adit_floor = (float)value;
            }
            else if (strFieldName == Zone.Fields.text_center_crdnt_x.ToString())
            {
                if (value == null)
                    zone.text_center_crdnt_x = null;
                else
                    zone.text_center_crdnt_x = (float)value;
            }
            else if (strFieldName == Zone.Fields.text_center_crdnt_y.ToString())
            {
                if (value == null)
                    zone.text_center_crdnt_y = null;
                else
                    zone.text_center_crdnt_y = (float)value;
            }
            else if (strFieldName == Zone.Fields.text_center_crdnt_z.ToString())
            {
                if (value == null)
                    zone.text_center_crdnt_z = null;
                else
                    zone.text_center_crdnt_z = (float)value;
            }
            else if (strFieldName == Zone.Fields.brdcst_text.ToString())
                zone.brdcst_text = (string)value;
            else if (strFieldName == Zone.Fields.disp_text.ToString())
                zone.disp_text = (string)value;
            else if (strFieldName == Zone.Fields.site_sn.ToString())
                zone.site_sn = (int)value;
        }

        public void ReadBuilding(string strFieldName, object value, ref Building building)
        {
            if (building == null)
                return;

            if (strFieldName == Building.Fields.buld_sn.ToString())
            {
                if (value == null)
                    building = null;
                else
                    building.buld_sn = (int)value;
            }
            else if (strFieldName == Building.Fields.buld_code.ToString())
                building.buld_code = (string)value;
            else if (strFieldName == Building.Fields.name.ToString())
                building.name = (string)value;
            else if (strFieldName == Building.Fields.buld_group_sn.ToString())
                building.buld_group_sn = (int)value;
            else if (strFieldName == Building.Fields.top_floor_indx.ToString())
                building.top_floor_indx = (int)value;
            else if (strFieldName == Building.Fields.min_floor_indx.ToString())
                building.min_floor_indx = (int)value;
            else if (strFieldName == Building.Fields.text_center_crdnt_x.ToString())
            {
                if (value == null)
                    building.text_center_crdnt_x = null;
                else
                    building.text_center_crdnt_x = (double)(float)value;
            }
            else if (strFieldName == Building.Fields.text_center_crdnt_y.ToString())
            {
                if (value == null)
                    building.text_center_crdnt_y = null;
                else
                    building.text_center_crdnt_y = (double)(float)value;
            }
            else if (strFieldName == Building.Fields.text_center_crdnt_z.ToString())
            {
                if (value == null)
                    building.text_center_crdnt_z = null;
                else
                    building.text_center_crdnt_z = (double)(float)value;
            }
            else if (strFieldName == Building.Fields.brdcst_text.ToString())
                building.brdcst_text = (string)value;
            else if (strFieldName == Building.Fields.disp_text.ToString())
                building.disp_text = (string)value;
        }

        public void ReadBuildingGroup(string strFieldName, object value, ref BuildingGroup buildingGroup)
        {
            if (buildingGroup == null)
                return;

            if (strFieldName == BuildingGroup.Fields.buld_group_sn.ToString())
            {
                if (value == null)
                    buildingGroup = null;
                else
                    buildingGroup.buld_group_sn = (int)value;
            }
            else if (strFieldName == BuildingGroup.Fields.name.ToString())
                buildingGroup.name = (string)value;
            else if (strFieldName == BuildingGroup.Fields.text_center_crdnt_x.ToString())
            {
                if (value == null)
                    buildingGroup.text_center_crdnt_x = null;
                else
                    buildingGroup.text_center_crdnt_x = (double)(float)value;
            }
            else if (strFieldName == BuildingGroup.Fields.text_center_crdnt_y.ToString())
            {
                if (value == null)
                    buildingGroup.text_center_crdnt_y = null;
                else
                    buildingGroup.text_center_crdnt_y = (double)(float)value;
            }
            else if (strFieldName == BuildingGroup.Fields.text_center_crdnt_z.ToString())
            {
                if (value == null)
                    buildingGroup.text_center_crdnt_z = null;
                else
                    buildingGroup.text_center_crdnt_z = (double)(float)value;
            }
            else if (strFieldName == BuildingGroup.Fields.disp_text.ToString())
                buildingGroup.disp_text = (string)value;
            else if (strFieldName == BuildingGroup.Fields.site_sn.ToString())
                buildingGroup.site_sn = (int)value;
        }

        public ArrayList JoinCurrentAlarmHistorySensorZoneDetail(string strAdditionalConditions, out string strErrorMessage)
        {
            Current alarm = new Current();
            Model.History.SensorZoneDetail sensorZoneDetail = new Model.History.SensorZoneDetail();

            string strSQL = string.Format("Select a.*, b.* from {0} a inner join {1} b on a.{2} = b.{3}",
                alarm.GetTableName(), sensorZoneDetail.GetTableName(),
                Current.Fields.sensor_zone_hist_sn, Model.History.SensorZoneDetail.Fields.sensor_zone_hist_sn);

            if (strAdditionalConditions != null && strAdditionalConditions.Length > 0)
            {
                if (strAdditionalConditions.ToLower().Trim().StartsWith("order by"))
                    strSQL += " " + strAdditionalConditions;
                else
                    strSQL += " where " + strAdditionalConditions;
            }

            ArrayList arrDatas = new ArrayList();
            IEnumerable<dynamic> result = this.Select(strSQL, out strErrorMessage);

            if (result == null)
                return null;

            int nAlarmFieldCount = alarm.GetFieldCount();

            foreach (var item in result)
            {
                var data = item as IDictionary<string, object>;
                int nIndex = 0;

                alarm = new Current();
                sensorZoneDetail = new Model.History.SensorZoneDetail();

                foreach (KeyValuePair<string, object> pair in data)
                {
                    if (nIndex < nAlarmFieldCount)
                    {
                        ReadAlarm(pair.Key, pair.Value, alarm);
                    }
                    else
                    {
                        ReadSensorZoneHistoryDetail(pair.Key, pair.Value, sensorZoneDetail);
                    }

                    nIndex++;
                }

                arrDatas.Add(alarm);
                arrDatas.Add(sensorZoneDetail);
            }

            return arrDatas;
        }

        public ArrayList JoinCurrentAlarmHistorySensorZone(string strAdditionalConditions, out string strErrorMessage)
        {
            Current alarm = new Current();
            Model.History.SensorZone sensorZoneHistory = new Model.History.SensorZone();

            string strSQL = string.Format("Select a.*, b.* from {0} a inner join {1} b on a.{2} = b.{3}",
                alarm.GetTableName(), sensorZoneHistory.GetTableName(),
                Current.Fields.sensor_zone_hist_sn, Model.History.SensorZone.Fields.sensor_zone_hist_sn);

            if (strAdditionalConditions != null && strAdditionalConditions.Length > 0)
            {
                if (strAdditionalConditions.ToLower().Trim().StartsWith("order by"))
                    strSQL += " " + strAdditionalConditions;
                else
                    strSQL += " where " + strAdditionalConditions;
            }

            ArrayList arrDatas = new ArrayList();
            IEnumerable<dynamic> result = this.Select(strSQL, out strErrorMessage);

            if (result == null)
                return null;

            int nAlarmFieldCount = alarm.GetFieldCount();

            foreach (var item in result)
            {
                var data = item as IDictionary<string, object>;
                int nIndex = 0;

                alarm = new Current();
                sensorZoneHistory = new Model.History.SensorZone();

                foreach (KeyValuePair<string, object> pair in data)
                {
                    if (nIndex < nAlarmFieldCount)
                    {
                        ReadAlarm(pair.Key, pair.Value, alarm);
                    }
                    else
                    {
                        ReadSensorZoneHistory(pair.Key, pair.Value, sensorZoneHistory);
                    }

                    nIndex++;
                }

                arrDatas.Add(alarm);
                arrDatas.Add(sensorZoneHistory);
            }

            return arrDatas;
        }

        public void ReadSubType(string strFieldName, object value, SubType subType)
        {
            if (strFieldName == SubType.Fields.sensor_ty_optn_code.ToString())
                subType.sensor_ty_optn_code = (int)value;
            else if (strFieldName == SubType.Fields.sensor_ty_code.ToString())
                subType.sensor_ty_code = (int)value;
            else if (strFieldName == SubType.Fields.sensor_sub_ty_no.ToString())
                subType.sensor_sub_ty_no = (int)value;
            else if (strFieldName == SubType.Fields.sensor_sub_ty_name.ToString())
                subType.sensor_sub_ty_name = (string)value;
            else if (strFieldName == SubType.Fields.uom.ToString())
                subType.uom = (string)value;
            else if (strFieldName == SubType.Fields.descp.ToString())
                subType.descp = (string)value;
        }
    }
}
