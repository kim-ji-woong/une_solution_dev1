using dnsDapperDBUtil.DataAccessLayer.IDAL;
using Base.Model.Sensor;
using Base.Model.Sensor.CCTV;
using Base.Model.Spatial;
using Base.Model.Alarm;
using Base.DAL;
using System.Collections;
using System.Collections.Generic;
using dnsData.CommonCode;
using SOPWebServer.IBLL.Models.History;
using SOPWebServer.IBLL.Models.Request;

namespace SOPWebServer.BLL.Process
{
    class SensorManager
    {
        public static SensorZone GetSensorZone(int sensorZoneNo, IDataManager dataManager, out bool useSensorAlarm, out EquipmentZone equipZone, out string strErrorMessage)
        {
            equipZone = null;
            // 센서별 알람을 사용하는가?
            useSensorAlarm = false;
            JoinManager joinManager = new JoinManager(dataManager);

            string strConditions = string.Format("a.{0} = {1}", SensorZone.Fields.sensor_zone_sn.ToString(), sensorZoneNo);
            ArrayList arrDatas = joinManager.JoinSensorZoneEquipZoneCCTVSensorZoneCCTVEquipmentZone(strConditions, out strErrorMessage);

            if (arrDatas == null)
                return null;

            int nDataCount = arrDatas.Count;

            for (int i = 0; i < nDataCount - 3; i += 4)
            {
                if (arrDatas[i] is SensorZone &&
                    (arrDatas[i + 1] == null || arrDatas[i + 1] is EquipZoneCCTV) &&
                    (arrDatas[i + 2] == null || arrDatas[i + 2] is SensorZoneCCTV) &&
                    (arrDatas[i + 3] == null || arrDatas[i + 3] is EquipmentZone))
                {
                    SensorZone sensorZone = (SensorZone)arrDatas[i];
                    EquipZoneCCTV equipZoneCCTV = (EquipZoneCCTV)arrDatas[i + 1];
                    SensorZoneCCTV sensorZoneCCTV = (SensorZoneCCTV)arrDatas[i + 2];
                    EquipmentZone _equipZone = (EquipmentZone)arrDatas[i + 3];

                    if (_equipZone == null || sensorZoneCCTV != null)
                        useSensorAlarm = true;

                    equipZone = _equipZone;
                    return sensorZone;
                }
            }

            return null;
        }

        // 수동신고를 위한 SensorZone 검색
        public static SensorZone GetSensorZone(ManualReport signal, IDataManager dataManager, out string strErrorMessage)
        {
            string strCondition = string.Format("{0} = {1} and {2} is NULL", SensorZone.Fields.sensor_ty_code, signal.SensorType, SensorZone.Fields.sensor_server_sn);

            if (signal.SensorSubType == null)
                strCondition += string.Format(" and {0} is NULL", SensorZone.Fields.sensor_sub_ty_no);
            else
                strCondition += string.Format(" and {0} = {1}", SensorZone.Fields.sensor_sub_ty_no, (int)signal.SensorSubType);

            return dataManager.GetSelect().SelectFirst<SensorZone>(strCondition, out strErrorMessage);
        }

        public static SensorZone GetFirstSensorZone(int sensorZoneHistoryNo, IDataManager dataManager, out bool useSensorAlarm, out EquipmentZone equipZone, out string strErrorMessage)
        {
            equipZone = null;
            // 센서별 알람을 사용하는가?
            useSensorAlarm = false;
            JoinManager joinManager = new JoinManager(dataManager);

            string strConditions = string.Format("a.{0} in (select f.{1} from {2} e inner join {3} f on e.{4} = f.{5} and e.{4} = {6} and f.{7} = {8})",
                SensorZone.Fields.sensor_zone_sn,
                Base.Model.History.SensorReaction.Fields.sensor_zone_sn,
                Base.Model.History.SensorZone.TableName,
                Base.Model.History.SensorReaction.TableName,
                Base.Model.History.SensorZone.Fields.sensor_zone_hist_sn,
                Base.Model.History.SensorReaction.Fields.sensor_zone_hist_sn,
                sensorZoneHistoryNo,
                Base.Model.History.SensorReaction.Fields.react_ty_code,
                History.ReactionType.BeginStatus);

            ArrayList arrDatas = joinManager.JoinSensorZoneEquipZoneCCTVSensorZoneCCTVEquipmentZone(strConditions, out strErrorMessage);

            if (arrDatas == null)
                return null;

            int nDataCount = arrDatas.Count;

            for (int i = 0; i < nDataCount - 3; i += 4)
            {
                if (arrDatas[i] is SensorZone &&
                    (arrDatas[i + 1] == null || arrDatas[i + 1] is EquipZoneCCTV) &&
                    (arrDatas[i + 2] == null || arrDatas[i + 2] is SensorZoneCCTV) &&
                    (arrDatas[i + 3] == null || arrDatas[i + 3] is EquipmentZone))
                {
                    SensorZone sensorZone = (SensorZone)arrDatas[i];
                    EquipZoneCCTV equipZoneCCTV = (EquipZoneCCTV)arrDatas[i + 1];
                    SensorZoneCCTV sensorZoneCCTV = (SensorZoneCCTV)arrDatas[i + 2];
                    EquipmentZone _equipZone = (EquipmentZone)arrDatas[i + 3];

                    if (_equipZone == null || sensorZoneCCTV != null)
                        useSensorAlarm = true;

                    equipZone = _equipZone;
                    return sensorZone;
                }
            }

            return null;
        }

        // 현재 알람이 활성화 상태인 SensorZoneHistory 목록을 얻어온다.
        public static List<SensorZoneHistoryData> GetActiveSensorZoneHistories(ClearAll signal, IDataManager dataManager, out string strErrorMessage)
        {
            string strCondition = "";

            if (signal.SiteNo != null)
                AddCondition(ref strCondition, string.Format("a.{0} = {1}", Base.Model.History.SensorZone.Fields.site_sn, (int)signal.SiteNo));

            if (signal.SensorType != null)
            {
                AddCondition(ref strCondition, string.Format("a.{0} = {1}", Base.Model.History.SensorZone.Fields.sensor_ty_code, (int)signal.SensorType));

                if (signal.SensorSubType != null)
                {
                    strCondition += string.Format(" and a.{0} in (Select c.{1} from {2} c inner join {3} d on c.{4} = d.{5} and d.{6} = {7} and d.{8} = {9})",
                        Base.Model.History.SensorZone.Fields.sensor_zone_hist_sn,
                        Base.Model.History.SensorZoneDetail.Fields.sensor_zone_hist_sn,
                        Base.Model.History.SensorZoneDetail.TableName,
                        SensorZone.TableName,
                        Base.Model.History.SensorZoneDetail.Fields.sensor_zone_sn,
                        SensorZone.Fields.sensor_zone_sn,
                        SensorZone.Fields.sensor_ty_code,
                        (int)signal.SensorType,
                        SensorZone.Fields.sensor_sub_ty_no,
                        (int)signal.SensorSubType);
                }
            }

            string strAdditionalCondition = string.Format("a.{0} in (Select {1} from {2})",
                Base.Model.History.SensorZone.Fields.sensor_zone_hist_sn,
                Current.Fields.sensor_zone_hist_sn,
                Current.TableName);

            AddCondition(ref strCondition, strAdditionalCondition);

            JoinManager joinManager = new JoinManager(dataManager);
            ArrayList arrDatas = joinManager.JoinSensorZoneHistorySensorZoneHistoryDetail(strCondition, out strErrorMessage);

            if (arrDatas == null)
                return null;

            // Key : SensorZoneNo
            Dictionary<int, Base.Model.History.SensorZone> dicSensorZoneHistories = new Dictionary<int, Base.Model.History.SensorZone>();
            Dictionary<int, int> dicSensorZoneHistoryNos = new Dictionary<int, int>();

            int nDataCount = arrDatas.Count;
            string strSensorZoneHistoryNos = "";

            for (int i=0;i<nDataCount-1;i+=2)
            {
                if (arrDatas[i] is Base.Model.History.SensorZone && arrDatas[i + 1] is Base.Model.History.SensorZoneDetail)
                {
                    Base.Model.History.SensorZone sensorZoneHistory = (Base.Model.History.SensorZone)arrDatas[i];
                    Base.Model.History.SensorZoneDetail sensorZoneHistoryDetail = (Base.Model.History.SensorZoneDetail)arrDatas[i + 1];

                    dicSensorZoneHistories[sensorZoneHistoryDetail.sensor_zone_sn] = sensorZoneHistory;

                    if (dicSensorZoneHistoryNos.ContainsKey(sensorZoneHistoryDetail.sensor_zone_hist_sn) == false)
                    {
                        dicSensorZoneHistoryNos[sensorZoneHistoryDetail.sensor_zone_hist_sn] = sensorZoneHistoryDetail.sensor_zone_hist_sn;

                        if (strSensorZoneHistoryNos.Length == 0)
                            strSensorZoneHistoryNos = sensorZoneHistoryDetail.sensor_zone_hist_sn.ToString();
                        else
                            strSensorZoneHistoryNos += "," + sensorZoneHistoryDetail.sensor_zone_hist_sn.ToString();
                    }
                }
            }

            if (strSensorZoneHistoryNos.Length == 0)
                return new List<SensorZoneHistoryData>();

            strCondition = string.Format("a.{0} in (select g.{1} from {2} f inner join {3} g on f.{4} = g.{5} and f.{4} in ({6}) and g.{7} = {8})",
                SensorZone.Fields.sensor_zone_sn,
                Base.Model.History.SensorReaction.Fields.sensor_zone_sn,
                Base.Model.History.SensorZone.TableName,
                Base.Model.History.SensorReaction.TableName,
                Base.Model.History.SensorZone.Fields.sensor_zone_hist_sn,
                Base.Model.History.SensorReaction.Fields.sensor_zone_hist_sn,
                strSensorZoneHistoryNos,
                Base.Model.History.SensorReaction.Fields.react_ty_code,
                History.ReactionType.BeginStatus);

            arrDatas = joinManager.JoinSensorZoneSensorEquipZoneCCTVSensorZoneCCTVEquipmentZone(strCondition, out strErrorMessage);

            if (arrDatas == null)
                return null;

            nDataCount = arrDatas.Count;

            List<SensorZoneHistoryData> sensorZoneHistoryDatas = new List<SensorZoneHistoryData>();

            for (int i = 0; i < nDataCount - 4; i += 5)
            {
                if (arrDatas[i] is SensorZone &&
                    arrDatas[i + 1] is Sensor &&
                    (arrDatas[i + 2] == null || arrDatas[i + 2] is EquipZoneCCTV) &&
                    (arrDatas[i + 3] == null || arrDatas[i + 3] is SensorZoneCCTV) &&
                    (arrDatas[i + 4] == null || arrDatas[i + 4] is EquipmentZone))
                {
                    SensorZone sensorZone = (SensorZone)arrDatas[i];
                    Sensor sensor = (Sensor)arrDatas[i + 1];
                    EquipZoneCCTV equipZoneCCTV = (EquipZoneCCTV)arrDatas[i + 2];
                    SensorZoneCCTV sensorZoneCCTV = (SensorZoneCCTV)arrDatas[i + 3];
                    EquipmentZone equipZone = (EquipmentZone)arrDatas[i + 4];

                    bool useSensorAlarm = false;

                    if (equipZone == null || sensorZoneCCTV != null)
                        useSensorAlarm = true;

                    Base.Model.History.SensorZone sensorZoneHistory;

                    if (dicSensorZoneHistories.TryGetValue(sensorZone.sensor_zone_sn, out sensorZoneHistory) == false)
                    {
                        // Error
                        continue;
                    }

                    SensorZoneHistoryData sensorZoneHistoryData = new SensorZoneHistoryData();

                    sensorZoneHistoryData.EquipmentZone = equipZone;
                    sensorZoneHistoryData.SensorZone = sensorZone;
                    sensorZoneHistoryData.Sensor = sensor;
                    sensorZoneHistoryData.SensorZoneHistory = sensorZoneHistory;
                    sensorZoneHistoryData.UseSensorAlarm = useSensorAlarm;

                    sensorZoneHistoryDatas.Add(sensorZoneHistoryData);
                }
            }

            return sensorZoneHistoryDatas;
        }

        private static void AddCondition(ref string strCondition, string strAdditional)
        {
            if (strCondition.Length == 0)
                strCondition = strAdditional;
            else
                strCondition += " and " + strAdditional;
        }
    }
}
