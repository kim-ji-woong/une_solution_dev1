using System;
using System.Collections;
using System.Collections.Generic;
using dnsDapperDBUtil.DataAccessLayer.IDAL;
using Base.Model.History;
using Base.DAL;
using Base.Model.Spatial;

namespace Soulbrain.BLL.Process
{
    using Response;

    class AlarmManager
    {
        private IDataManager m_dataManager = null;

        public AlarmManager(IDataManager dataManager)
        {
            m_dataManager = dataManager;
        }

        public ResponseWeeklyStatus RequestWeeklyStatus()
        {
            DateTime now = DateTime.Now;
            string strStart = now.AddDays(-6).ToString("yyyy-MM-dd") + " 00:00:00";
            string strEnd = now.ToString("yyyy-MM-dd") + " 23:59:59";
            string strCondition = string.Format("a.{0} >= '{1}' AND a.{0} <= '{2}'", SensorZone.Fields.tm, strStart, strEnd);

            return GetWeeklyStatus(strCondition);
        }

        private ResponseWeeklyStatus GetWeeklyStatus(string strCondition)
        {
            string strErrorMessage;
            JoinManager joinManager = new JoinManager(m_dataManager);
            ArrayList arrDatas = joinManager.JoinSensorZoneHistorySensorZoneHistoryDetailSensorZone(strCondition, out strErrorMessage);

            if (arrDatas == null)
                return new ResponseWeeklyStatus(false, strErrorMessage);

            Dictionary<int, int> dicZoneNos = new Dictionary<int, int>();

            // Key : SensorZoneHistory No
            Dictionary<int, AlarmInfo> dicAlarmInfos = new Dictionary<int, AlarmInfo>();
            int dataCount = arrDatas.Count;

            for (int i=0;i<dataCount-2;i+=3)
            {
                if (arrDatas[i] is SensorZone && arrDatas[i + 2] is Base.Model.Sensor.SensorZone)
                {
                    SensorZone sensorZoneHistory = (SensorZone)arrDatas[i];
                    Base.Model.Sensor.SensorZone sensorZone = (Base.Model.Sensor.SensorZone)arrDatas[i + 2];

                    AlarmInfo alarmInfo;

                    if (dicAlarmInfos.TryGetValue(sensorZoneHistory.sensor_zone_hist_sn, out alarmInfo) == false)
                    {
                        alarmInfo = new AlarmInfo();
                        dicAlarmInfos[sensorZoneHistory.sensor_zone_hist_sn] = alarmInfo;
                    }

                    alarmInfo.SensorZoneNo = sensorZone.sensor_zone_sn;
                    alarmInfo.SensorNo = sensorZone.sensor_sn;
                    alarmInfo.SensorTypeNo = sensorZone.sensor_ty_code;
                    alarmInfo.SensorSubTypeNo = sensorZone.sensor_sub_ty_no;
                    alarmInfo.ZoneNo = sensorZoneHistory.zone_sn != null ? (int)sensorZoneHistory.zone_sn : -1;
                    alarmInfo.SiteNo = sensorZoneHistory.site_sn;
                    alarmInfo.EquipZoneNo = sensorZone.eqp_zone_sn != null ? (int)sensorZone.eqp_zone_sn : -1;
                    alarmInfo.Time = sensorZoneHistory.tm;
                    alarmInfo.IsManual = IsManulAlarm(sensorZone);

                    if (sensorZoneHistory.zone_sn != null)
                        dicZoneNos[(int)sensorZoneHistory.zone_sn] = (int)sensorZoneHistory.zone_sn;
                }
            }

            // Key : Zone No
            Dictionary<int, ArrayList> dicZoneDatas = GetZoneDatas(joinManager, dicZoneNos, out strErrorMessage);

            if (dicZoneDatas == null)
                return new ResponseWeeklyStatus(false, strErrorMessage);

            ResponseWeeklyStatus response = new ResponseWeeklyStatus(true, "");

            foreach (KeyValuePair<int, AlarmInfo> pair in dicAlarmInfos)
            {
                AlarmInfo alarmInfo = pair.Value;

                if (alarmInfo.ZoneNo >= 0)
                {
                    if (dicZoneDatas.TryGetValue(alarmInfo.ZoneNo, out arrDatas))
                    {
                        Zone zone = (Zone)arrDatas[0];
                        Building building = (Building)arrDatas[1];
                        BuildingGroup buildingGroup = (BuildingGroup)arrDatas[2];

                        alarmInfo.BuildingNo = building.buld_sn;
                        alarmInfo.BuildingGroupNo = buildingGroup.buld_group_sn;
                    }
                }

                response.AlarmInfos.Add(alarmInfo);
            }

            return response;
        }

        private bool IsManulAlarm(Base.Model.Sensor.SensorZone sensorZone)
        {
            if (sensorZone.sensor_sub_ty_no == null && sensorZone.sensor_server_sn == null)
                return true;

            return false;
        }

        private Dictionary<int, ArrayList> GetZoneDatas(JoinManager joinManager, Dictionary<int, int> dicZoneNos, out string strErrorMessage)
        {
            // Key : Zone No
            Dictionary<int, ArrayList> dicZoneDatas = new Dictionary<int, ArrayList>();

            if (dicZoneNos.Count > 0)
            {
                string strCondition = string.Format("a.{0} in ({1})", Zone.Fields.zone_sn, string.Join(",", dicZoneNos.Keys));
                ArrayList arrDatas = joinManager.JoinZoneBuildingBuildingGroup(strCondition, out strErrorMessage);

                if (arrDatas == null)
                    return null;

                int dataCount = arrDatas.Count;

                for (int i = 0; i < dataCount - 2; i += 3)
                {
                    if (arrDatas[i] is Zone && arrDatas[i + 1] is Building && arrDatas[i + 2] is BuildingGroup)
                    {
                        Zone zone = (Zone)arrDatas[i];
                        Building building = (Building)arrDatas[i + 1];
                        BuildingGroup buildingGroup = (BuildingGroup)arrDatas[i + 2];

                        ArrayList arr = new ArrayList();
                        arr.Add(zone);
                        arr.Add(building);
                        arr.Add(buildingGroup);

                        dicZoneDatas[zone.zone_sn] = arr;
                    }
                }
            }

            strErrorMessage = null;
            return dicZoneDatas;
        }
    }
}
