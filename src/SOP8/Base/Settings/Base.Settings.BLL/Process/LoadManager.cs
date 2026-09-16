using Base.Model.Common;
using Base.Settings.IBLL.Request;
using Base.Settings.IBLL.Response;
using dnsDapperDBUtil.DataAccessLayer.IDAL;
using System.Collections.Generic;
using Base.Settings.IBLL.Models;

namespace Base.Settings.BLL.Process
{
    class LoadManager
    {
        private IDataManager m_dataManager = null;

        public LoadManager(IDataManager dataManager)
        {
            m_dataManager = dataManager;
        }

        public ResponseSettingDatas RequestSettingData(RequestSettingDatas data)
        {
            string strCondition = null;

            if (data.SiteNo != null)
                strCondition = string.Format("{0} = {1}", Option.Fields.site_sn, (int)data.SiteNo);

            if (data.CategoryName != null && data.CategoryName.Length > 0)
            {
                if (data.PropertyName != null && data.PropertyName.Length > 0)
                {
                    string str = string.Format("{0} = '{1}/{2}'", Option.Fields.prop_name, data.CategoryName, data.PropertyName);

                    if (strCondition != null)
                        strCondition += " and " + str;
                    else
                        strCondition = str;
                }
                else
                {
                    string str = string.Format("{0} like '{1}/%'", Option.Fields.prop_name, data.CategoryName);

                    if (strCondition != null)
                        strCondition += " and " + str;
                    else
                        strCondition = str;
                }
            }
            else if (data.PropertyName != null && data.PropertyName.Length > 0)
            {
                string str = string.Format("{0} like '%/{1}'", Option.Fields.prop_name, data.PropertyName);

                if (strCondition != null)
                    strCondition += " and " + str;
                else
                    strCondition = str;
            }

            return GetSettingDatas(strCondition);
        }

        public ResponseSettingDatas RequestSettingDataList(RequestSettingDataList data)
        {
            string strCondition = null;

            if (data.SiteNo != null)
                strCondition = string.Format("{0} = {1}", Option.Fields.site_sn, (int)data.SiteNo);

            string strCondition3 = null;

            foreach (var settingData in data.SettingDatas)
            {
                string strCondition2 = null;

                if (settingData.CategoryName != null && settingData.CategoryName.Length > 0)
                {
                    if (settingData.PropertyName != null && settingData.PropertyName.Length > 0)
                    {
                        string str = string.Format("{0} = '{1}/{2}'", Option.Fields.prop_name, settingData.CategoryName, settingData.PropertyName);

                        if (strCondition2 != null)
                            strCondition2 += " and " + str;
                        else
                            strCondition2 = str;
                    }
                    else
                    {
                        string str = string.Format("{0} like '{1}/%'", Option.Fields.prop_name, settingData.CategoryName);

                        if (strCondition2 != null)
                            strCondition2 += " and " + str;
                        else
                            strCondition2 = str;
                    }
                }
                else if (settingData.PropertyName != null && settingData.PropertyName.Length > 0)
                {
                    string str = string.Format("{0} like '%/{1}'", Option.Fields.prop_name, settingData.PropertyName);

                    if (strCondition2 != null)
                        strCondition2 += " and " + str;
                    else
                        strCondition2 = str;
                }

                if (strCondition2 != null)
                {
                    if (strCondition3 == null)
                        strCondition3 = "(" + strCondition2 + ")";
                    else
                        strCondition3 += " or (" + strCondition2 + ")";
                }
            }

            if (strCondition != null)
            {
                if (strCondition3 != null)
                    strCondition += " and (" + strCondition3 + ")";
            }
            else
                strCondition = strCondition3;

            if (strCondition == null)
                return new ResponseSettingDatas(true, "");

            return GetSettingDatas(strCondition);
        }

        private ResponseSettingDatas GetSettingDatas(string strCondition)
        {
            string strErrorMessage;
            IEnumerable<Option> options = m_dataManager.GetSelect().Select<Option>(strCondition, out strErrorMessage);

            if (options == null)
                return new ResponseSettingDatas(false, strErrorMessage);

            Dictionary<string, SettingCategory> dicSettingCategories = new Dictionary<string, SettingCategory>();

            foreach (Option option in options)
            {
                int index = option.prop_name.IndexOf('/');

                if (index < 0)
                    continue;

                bool isDefault;
                string strCategory = GetPropertyCategoryName(option.prop_name, ref index, out isDefault);

                if (strCategory == null || isDefault)
                    continue;

                SettingCategory category;

                if (dicSettingCategories.TryGetValue(strCategory, out category) == false)
                {
                    category = new SettingCategory();
                    category.CategoryType = strCategory;

                    if (category.CategoryType == SettingCategory.CategoryTypes.None.ToString())
                        continue;

                    dicSettingCategories[strCategory] = category;
                }

                SettingData settingData = new SettingData();
                settingData.Name = option.prop_name.Substring(index + 1).Trim();
                settingData.Value = option.prop_value;
                settingData.SiteNo = option.site_sn;
                settingData.Description = option.descp;

                category.SettingDatas.Add(settingData);
            }

            ResponseSettingDatas response = new ResponseSettingDatas(true, "");

            foreach (KeyValuePair<string, SettingCategory> pair in dicSettingCategories)
            {
                response.Categories.Add(pair.Value);
            }

            return response;
        }

        private string GetPropertyCategoryName(string strPropertyName, ref int index, out bool isDefault)
        {
            isDefault = false;
            string strCategory = strPropertyName.Substring(0, index).Trim();

            if (strCategory.ToLower() == "default")
            {
                isDefault = true;

                int index2 = strPropertyName.IndexOf('/', index + 1);

                if (index2 < 0)
                    return null;

                strCategory = strPropertyName.Substring(index + 1, index2 - index - 1).Trim();
                index = index2;
            }

            return strCategory;
        }
    }
}
