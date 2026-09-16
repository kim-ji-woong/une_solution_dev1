using System.Collections.Generic;

namespace Base.Settings.IBLL.Request
{
    using Models;

    public class RequestSave
    {
        private List<SettingCategory> m_settingCategories = new List<SettingCategory>();

        public List<SettingCategory> Categories
        {
            get { return m_settingCategories; }
            set { m_settingCategories = value; }
        }
    }
}
