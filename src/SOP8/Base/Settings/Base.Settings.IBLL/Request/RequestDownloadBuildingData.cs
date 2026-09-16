namespace Base.Settings.IBLL.Request
{
    public class RequestDownloadBuildingData
    {
        private int? m_buildingNo = null;
        private int? m_siteNo = null;

        public int? BuildingNo
        {
            get { return m_buildingNo; }
            set { m_buildingNo = value; }
        }

        public int? SiteNo
        {
            get { return m_siteNo; }
            set { m_siteNo = value; }
        }
    }
}
