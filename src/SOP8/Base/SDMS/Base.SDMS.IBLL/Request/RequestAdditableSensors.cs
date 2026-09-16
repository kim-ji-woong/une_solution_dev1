namespace Base.SDMS.IBLL.Request
{
    public class RequestAdditableSensors
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
