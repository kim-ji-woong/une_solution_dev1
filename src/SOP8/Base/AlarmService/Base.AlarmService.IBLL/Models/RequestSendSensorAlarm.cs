namespace Base.AlarmService.IBLL.Models
{
    public class RequestSendSensorAlarm
    {
        private int m_nSensorType = -1;
        private int m_nSensorZoneNo = -1;
        private int? m_alarmDepth = null;

        public int SensorType
        {
            get { return m_nSensorType; }
            set { m_nSensorType = value; }
        }

        public int SensorZoneNo
        {
            get { return m_nSensorZoneNo; }
            set { m_nSensorZoneNo = value; }
        }

        public int? AlarmDepth
        {
            get { return m_alarmDepth; }
            set { m_alarmDepth = value; }
        }
    }
}
