namespace Base.Settings.IBLL.Request
{
    public class RequestDownloadBuildingGroupData
    {
        private int? m_buildingGroupNo = null;
        private int? m_siteNo = null;

        public int? BuildingGroupNo
        {
            get { return m_buildingGroupNo; }
            set { m_buildingGroupNo = value; }
        }

        public int? SiteNo
        {
            get { return m_siteNo; }
            set { m_siteNo = value; }
        }
    }
}
