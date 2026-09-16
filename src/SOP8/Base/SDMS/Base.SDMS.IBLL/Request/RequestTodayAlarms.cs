namespace Base.SDMS.IBLL.Request
{
    // 오늘 발생한 모든 알람 요청(종료된 알람 포함해서)
    // 오늘 이전에 발생한 알람이더라도 아직 종료되지 않았으면 같이 요청한다.
    public class RequestTodayAlarms
    {
        private int? m_siteNo = null;
        private int? m_sensorType = null;

        public int? SiteNo
        {
            get { return m_siteNo; }
            set { m_siteNo = value; }
        }

        public int? SensorType
        {
            get { return m_sensorType; }
            set { m_sensorType = value; }
        }
    }
}
