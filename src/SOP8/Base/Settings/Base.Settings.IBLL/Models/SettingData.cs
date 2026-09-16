namespace Base.Settings.IBLL.Models
{
    public class SettingData
    {
        private int? m_siteNo = null;
        private string m_strName = null;
        private string m_strValue = null;
        private string m_strDesc = null;

        public int? SiteNo
        {
            get { return m_siteNo; }
            set { m_siteNo = value; }
        }

        public string Name
        {
            get { return m_strName; }
            set { m_strName = value; }
        }

        public string Value
        {
            get { return m_strValue; }
            set { m_strValue = value; }
        }

        public string Description
        {
            get { return m_strDesc; }
            set { m_strDesc = value; }
        }
    }
}
