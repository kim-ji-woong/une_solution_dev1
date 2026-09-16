using System.Collections.Generic;

namespace WebSOPApp.Areas.SDMS.Controllers.Request
{
    public class RequestData
    {
        private RequestSendSensorAlarm m_sendAlarm = null;
        private bool? m_requestAlarmList = null;
        private RequestClearSensorAlarm m_requestClearSensorAlarm = null;

        public RequestSendSensorAlarm RequestSendSensorAlarm
        {
            get { return m_sendAlarm; }
            set { m_sendAlarm = value; }
        }

        public bool? RequestAlarmList
        {
            get { return m_requestAlarmList; }
            set { m_requestAlarmList = value; }
        }

        public RequestClearSensorAlarm RequestClearSensorAlarm
        {
            get { return m_requestClearSensorAlarm; }
            set { m_requestClearSensorAlarm = value; }
        }
    }

    public class RequestSendSensorAlarm
    {
        private int m_nSensorType = -1;
        private int m_nSensorTagInfoID = -1;
        private int m_nSensorZoneID = -1;

        public int SensorType
        {
            get { return m_nSensorType; }
            set { m_nSensorType = value; }
        }

        public int SensorTagInfoID
        {
            get { return m_nSensorTagInfoID; }
            set { m_nSensorTagInfoID = value; }
        }

        public int SensorZoneID
        {
            get { return m_nSensorZoneID; }
            set { m_nSensorZoneID = value; }
        }
    }

    public class RequestClearSensorAlarm
    {
        private int m_nSensorType = -1;
        private int m_nSensorTagInfoID = -1;
        private List<int> m_sensorZoneID = new List<int>();

        public int SensorType
        {
            get { return m_nSensorType; }
            set { m_nSensorType = value; }
        }

        public int SensorTagInfoID
        {
            get { return m_nSensorTagInfoID; }
            set { m_nSensorTagInfoID = value; }
        }

        public List<int> SensorZoneIDs
        {
            get { return m_sensorZoneID; }
            set { m_sensorZoneID = value; }
        }
    }
}
