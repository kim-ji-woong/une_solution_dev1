namespace Base.SDMS.IBLL.Request
{
    public class RequestAlarmMemo
    {
        private int m_nSensorZoneHistoryNo = -1;

        public int SensorZoneHistoryNo
        {
            get { return m_nSensorZoneHistoryNo; }
            set { m_nSensorZoneHistoryNo = value; }
        }
    }
}
