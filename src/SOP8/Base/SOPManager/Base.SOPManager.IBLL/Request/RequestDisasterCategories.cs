namespace Base.SOPManager.IBLL.Request
{
    public class RequestDisasterCategories
    {
        private int m_nSiteNo = -1;
        private bool? m_isNormal = null;

        public int site_sn
        {
            get { return m_nSiteNo; }
            set { m_nSiteNo = value; }
        }

        public bool? IsNormal
        {
            get { return m_isNormal; }
            set { m_isNormal = value; }
        }
    }
}
