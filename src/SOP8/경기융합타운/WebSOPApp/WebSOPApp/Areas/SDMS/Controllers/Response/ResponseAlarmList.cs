using System;
using System.Collections;
using System.Collections.Generic;
using SDMS.IDAL;
using SDMS.Model.Sensor;
using SDMS.Model.Alarm;
using SDMS.Model.History;
using SDMS.Model.Spatial;
using dnsData.Sensor;

namespace WebSOPApp.Areas.SDMS.Controllers.Response
{
    public class ResponseAlarmList : MessageResult
    {
        private List<AlarmData> m_alarms = new List<AlarmData>();

        public List<AlarmData> Alarms
        {
            get { return m_alarms; }
            set { m_alarms = value; }
        }

        public ResponseAlarmList()
            : base()
        {
        }

        public ResponseAlarmList(bool success, string message)
            : base(success, message)
        {
        }

        public static ResponseAlarmList GetAlarmList(IDataManager dataManager)
        {
            ResponseAlarmList response = new ResponseAlarmList(true, "");

            string strErrorMessage = null;

            //string strAdditionalConditions = string.Format("({0}.{1} < {2} or {0}.{1} > {3})", SensorZone.TableName, SensorZone.Fields.SensorType, (int)Facility.FacilityType.Intrusion_S1, (int)Facility.FacilityType.EmergencyBell_S1);
            string strAdditionalConditions = null;

            ArrayList arrDatas = dataManager.GetSelectManager().JoinCurrentAlarmSensorZoneHistorySensorZoneTagInfo(strAdditionalConditions, out strErrorMessage);
            if (arrDatas == null)
            {
                response.Success = false;
                response.Message = strErrorMessage;
                return response;
            }

            int nDataCount = arrDatas.Count;
            List<AlarmData> alarms = new List<AlarmData>();
            Dictionary<int, string> dicEquipZoneNames = new Dictionary<int, string>();
            Dictionary<AlarmData, int> dicAlarms = new Dictionary<AlarmData, int>();

            for (int i = 0; i < nDataCount - 3; i += 4)
            {
                if (arrDatas[i] != null && arrDatas[i + 1] != null && arrDatas[i + 2] != null && arrDatas[i + 3] != null &&
                    arrDatas[i] is CurrentAlarm && arrDatas[i + 1] is SensorZoneHistory && arrDatas[i + 2] is SensorZone && arrDatas[i + 3] is TagInfo)
                {
                    CurrentAlarm currentAlarm = (CurrentAlarm)arrDatas[i];
                    SensorZoneHistory sensorZoneHistory = (SensorZoneHistory)arrDatas[i + 1];
                    SensorZone sensorZone = (SensorZone)arrDatas[i + 2];
                    TagInfo tagInfo = (TagInfo)arrDatas[i + 3];

                    AlarmData alarm = new AlarmData();
                    alarm.SensorType = sensorZone.SensorType;
                    alarm.SensorTagID = tagInfo.ID;
                    alarm.SensorZoneID = sensorZone.ID;
                    alarm.SensorZoneIDs.AddRange(currentAlarm.AlarmSensorZoneIDs);
                    alarm.Time = TimeToString(sensorZoneHistory.Time);
                    alarm.SensorZoneHistoryID = sensorZoneHistory.ID;

                    alarms.Add(alarm);

                    dicAlarms[alarm] = sensorZone.EquipZoneID;
                    dicEquipZoneNames[sensorZone.EquipZoneID] = null;
                }
            }

            string strEquipZoneIDs = "";

            foreach (KeyValuePair<int, string> pair in dicEquipZoneNames)
            {
                if (strEquipZoneIDs.Length == 0)
                    strEquipZoneIDs = pair.Key.ToString();
                else
                    strEquipZoneIDs += "," + pair.Key.ToString();
            }

            if (strEquipZoneIDs.Length > 0)
            {
                bool isNullable;
                string strCondition = string.Format("{0} in ({1})", EquipmentZone.GetFieldName(EquipmentZone.Fields.ID, out isNullable), strEquipZoneIDs);
                List<EquipmentZone> equipZones = dataManager.GetSelectManager().SelectEquipmentZones(null, strCondition, out strErrorMessage);

                if (equipZones == null)
                {
                    response.Success = false;
                    response.Message = strErrorMessage;
                    return response;
                }

                foreach (EquipmentZone equipZone in equipZones)
                {
                    dicEquipZoneNames[equipZone.ID] = equipZone.ZoneName;
                }

                foreach (KeyValuePair<AlarmData, int> pair in dicAlarms)
                {
                    string strEquipZoneName;
                    
                    if (dicEquipZoneNames.TryGetValue(pair.Value, out strEquipZoneName))
                    {
                        pair.Key.PositionName = strEquipZoneName;
                    }
                }
            }

            response.Alarms.AddRange(alarms);
            return response;
        }

        private static string TimeToString(DateTime time)
        {
            string strTime = string.Format("{0}-{1:00}-{2:00} {3:00}:{4:00}:{5:00}", time.Year, time.Month, time.Day, time.Hour, time.Minute, time.Second);
            return strTime;
        }
    }

    public class AlarmData
    {
        private int m_nSensorType = -1;
        private int m_nSensorTagID = -1;
        private int m_nSensorZoneID = -1;
        private int m_nSensorID = -1;
        private string m_strTime = "";
        private int m_nSensorZoneHistoryID = -1;
        private string m_strPositionName = "";
        private List<int> m_sensorZoneIDs = new List<int>();

        public int SensorType
        {
            get { return m_nSensorType; }
            set { m_nSensorType = value; }
        }

        public int SensorTagID
        {
            get { return m_nSensorTagID; }
            set { m_nSensorTagID = value; }
        }

        public int SensorZoneID
        {
            get { return m_nSensorZoneID; }
            set { m_nSensorZoneID = value; }
        }

        public List<int> SensorZoneIDs
        {
            get { return m_sensorZoneIDs; }
            set { m_sensorZoneIDs = value; }
        }

        public int SensorID
        {
            get { return m_nSensorID; }
            set { m_nSensorID = value; }
        }

        public string Time
        {
            get { return m_strTime; }
            set { m_strTime = value; }
        }

        public int SensorZoneHistoryID
        {
            get { return m_nSensorZoneHistoryID; }
            set { m_nSensorZoneHistoryID = value; }
        }

        public string PositionName
        {
            get { return m_strPositionName; }
            set { m_strPositionName = value; }
        }
    }
}
