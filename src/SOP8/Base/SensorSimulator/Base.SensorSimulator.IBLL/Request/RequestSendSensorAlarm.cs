namespace Base.SensorSimulator.IBLL.Request
{
    public class RequestSendSensorAlarm
    {
        private int m_nSensorType = -1;
        private int m_nSensorZoneNo = -1;

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
    }
}
