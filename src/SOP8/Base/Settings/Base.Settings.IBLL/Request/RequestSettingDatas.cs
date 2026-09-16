namespace Base.Settings.IBLL.Request
{
    public class RequestSettingDatas
    {
        private int? m_siteNo = null;
        private string m_strCategoryName = null;
        private string m_strPropertyName = null;

        public int? SiteNo
        {
            get { return m_siteNo; }
            set { m_siteNo = value; }
        }

        public string CategoryName
        {
            get { return m_strCategoryName; }
            set { m_strCategoryName = value; }
        }

        public string PropertyName
        {
            get { return m_strPropertyName; }
            set { m_strPropertyName = value; }
        }
    }
}
