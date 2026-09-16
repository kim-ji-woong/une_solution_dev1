using System;
using System.Collections.Generic;

namespace Base.Settings.IBLL.Models
{
    public class SettingCategory
    {
        public enum CategoryTypes { None = -1, SOP = 0, SDMS, Team, Etc }

        private CategoryTypes m_categoryType = CategoryTypes.None;
        private List<SettingData> m_settingDatas = new List<SettingData>();

        public string CategoryType
        {
            get { return m_categoryType.ToString(); }
            set { m_categoryType = ToCategoryType(value); }
        }

        public List<SettingData> SettingDatas
        {
            get { return m_settingDatas; }
            set { m_settingDatas = value; }
        }

        public static CategoryTypes ToCategoryType(string strType)
        {
            if (strType == null)
                return CategoryTypes.None;

            strType = strType.ToLower();

            foreach (CategoryTypes type in Enum.GetValues(typeof(CategoryTypes)))
            {
                if (type.ToString().ToLower() == strType)
                    return type;
            }

            return CategoryTypes.None;
        }
    }
}
