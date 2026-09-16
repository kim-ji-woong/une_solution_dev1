using dnsData.CommonCode;
using System.Collections.Generic;

namespace Base.SDMS.IBLL.Request
{
    public class RequestSaveAlarmNotification
    {
        private int m_nNotificationNo = -1;
        private int m_nSensorType = SdmsSensor.SensorType.None;
        private int? m_sensorSubType = null;
        private int? m_buildingGroupNo = null;
        private int? m_buildingNo = null;
        private int? m_zoneNo = null;
        private int m_nMessageType = SdmsSensor.NotificationType.None;
        private int m_nDetectType = SdmsSensor.DetectType.None;
        private bool m_active = true;
        private string m_strNotifyMessage = "";
        private string m_strNotificationName = null;
        private List<int> m_regularNos = new List<int>();
        private List<int> m_regularMemberNos = new List<int>();
        private List<int> m_temporaryNos = new List<int>();
        private List<int> m_temporaryMemberNos = new List<int>();

        public int NotificationNo
        {
            get { return m_nNotificationNo; }
            set { m_nNotificationNo = value;}
        }

        public int SensorType
        {
            get { return m_nSensorType; }
            set { m_nSensorType = value; }
        }

        public int? SensorSubType
        {
            get { return m_sensorSubType; }
            set { m_sensorSubType = value; }
        }

        public int? BuildingGroupNo
        {
            get { return m_buildingGroupNo; }
            set { m_buildingGroupNo = value; }
        }

        public int? BuildingNo
        {
            get { return m_buildingNo; }
            set { m_buildingNo = value; }
        }

        public int? ZoneNo
        {
            get { return m_zoneNo; }
            set { m_zoneNo = value; }
        }

        public int MessageType
        {
            get { return m_nMessageType; }
            set { m_nMessageType = value; }
        }

        public int DetectType
        {
            get { return m_nDetectType; }
            set { m_nDetectType = value; }
        }

        public bool IsActive
        {
            get { return m_active; }
            set { m_active = value; }
        }

        public string NotifyMessage
        {
            get { return m_strNotifyMessage; }
            set { m_strNotifyMessage = value; }
        }

        public string NotificationName
        {
            get { return m_strNotificationName; }
            set { m_strNotificationName = value; }
        }

        public List<int> RegularNos
        {
            get { return m_regularNos; }
            set { m_regularNos = value; }
        }

        public List<int> RegularMemberNos
        {
            get { return m_regularMemberNos; }
            set { m_regularMemberNos = value; }
        }

        public List<int> TemporaryNos
        {
            get { return m_temporaryNos; }
            set { m_temporaryNos = value; }
        }

        public List<int> TemporaryMemberNos
        {
            get { return m_temporaryMemberNos; }
            set { m_temporaryMemberNos = value; }
        }
    }
}
