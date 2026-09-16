namespace Soulbrain.BLL.Request
{
    public class RequestFacilityList
    {
        private int? m_siteNo = null;
        private int? m_zoneNo = null;

        public int? SiteNo
        {
            get { return m_siteNo; }
            set { m_siteNo = value; }
        }

        public int? ZoneNo
        {
            get { return m_zoneNo; }
            set { m_zoneNo = value; }
        }
    }
}
