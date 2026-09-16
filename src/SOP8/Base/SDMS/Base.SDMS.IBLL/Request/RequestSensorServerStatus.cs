namespace Base.SDMS.IBLL.Request
{
    public class RequestSensorServerStatus
    {
        private int? m_siteNo = null;
        
        public int? SiteNo
        {
            get { return m_siteNo; }
            set { m_siteNo = value; }
        }
    }
}
