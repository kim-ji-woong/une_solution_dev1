namespace Base.Settings.IBLL.Request
{
    public class RequestInitialize
    {
        private int m_nSiteNo = -1;

        public int SiteNo
        {
            get { return m_nSiteNo; }
            set { m_nSiteNo = value; }
        }
    }
}
