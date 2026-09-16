using System.Collections.Generic;
using Response;

namespace Base.Settings.IBLL.Response
{
    using Models;

    public class ResponseSettingDatas : MessageResult
    {
        private List<SettingCategory> m_settingCategories = new List<SettingCategory>();

        public List<SettingCategory> Categories
        {
            get { return m_settingCategories; }
            set { m_settingCategories = value; }
        }

        public ResponseSettingDatas()
            : base()
        {
        }

        public ResponseSettingDatas(bool success, string message)
            : base(success, message)
        {
        }
    }
}
