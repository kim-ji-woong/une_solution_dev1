using System.Collections.Generic;

namespace Base.Settings.IBLL.Request
{
    public class RequestSettingDataList
    {
        public class SettingData
        {
            private string m_strCategoryName = null;
            private string m_strPropertyName = null;

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

        private int? m_siteNo = null;
        private List<SettingData> m_settingDatas = new List<SettingData>();

        public int? SiteNo
        {
            get { return m_siteNo; }
            set { m_siteNo = value; }
        }

        public List<SettingData> SettingDatas
        {
            get { return m_settingDatas; }
            set { m_settingDatas = value; }
        }
    }
}
