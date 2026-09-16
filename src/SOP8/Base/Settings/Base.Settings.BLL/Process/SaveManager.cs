using Response;
using Base.Settings.IBLL.Request;
using Base.Settings.IBLL.Models;
using dnsDapperDBUtil.DataAccessLayer.IDAL;
using Base.Model.Common;
using System.Collections.Generic;

namespace Base.Settings.BLL.Process
{
    class SaveManager
    {
        private IDataManager m_dataManager = null;

        public SaveManager(IDataManager dataManager)
        {
            m_dataManager = dataManager;
        }

        public MessageResult Save(RequestSave data)
        {
            string strErrorMessage;

            IDataManager dataManager = m_dataManager.Clone();

            if (dataManager.BeginBatch(out strErrorMessage) == false)
                return new MessageResult(false, "시스템 데이터베이스의 트랜잭션을 시작할 수 없습니다.");

            foreach (SettingCategory category in data.Categories)
            {
                if (SaveCategory(dataManager, category, out strErrorMessage) == false)
                {
                    string strTemp;
                    dataManager.BatchRollback(out strTemp);
                    return new MessageResult(false, strErrorMessage);
                }
            }

            if (dataManager.BatchCommit(out strErrorMessage) == false)
            {
                string strTemp;
                dataManager.BatchRollback(out strTemp);
                return new MessageResult(false, "시스템 데이터베이스의 트랜잭션을 정상적으로 종료할 수 없습니다.");
            }

            return new MessageResult(true, "");
        }

        private bool SaveCategory(IDataManager dataManager, SettingCategory category, out string strErrorMessage)
        {
            foreach (SettingData data in category.SettingDatas)
            {
                if (SaveData(dataManager, category.CategoryType, data, out strErrorMessage) == false)
                    return false;
            }

            strErrorMessage = null;
            return true;
        }

        private bool SaveData(IDataManager dataManager, string strCategoryType, SettingData data, out string strErrorMessage)
        {
            string strCondition = string.Format("{0} = '{1}/{2}' and {3} = {4}",
                Option.Fields.prop_name, strCategoryType, data.Name,
                Option.Fields.site_sn, data.SiteNo);

            Option option = dataManager.GetSelect().SelectFirst<Option>(strCondition, out strErrorMessage);

            if (option == null)
            {
                if (strErrorMessage != null)
                    return false;
                else
                {
                    option = new Option();

                    option.prop_name = string.Format("{0}/{1}", strCategoryType, data.Name);
                    option.site_sn = data.SiteNo;
                    option.prop_value = data.Value;
                    option.descp = data.Description;

                    if (dataManager.GetCreate().Insert<Option>(option, out strErrorMessage) == false)
                        return false;
                    else
                        return true;
                }
            }

            option.prop_value = data.Value;
            return dataManager.GetUpdate().Update<Option>(option, null, out strErrorMessage);
        }

        public MessageResult Initialize(RequestInitialize data)
        {
            string strCondition = string.Format("{0} = {1}",
                Option.Fields.site_sn, data.SiteNo);

            string strErrorMessage;
            IEnumerable<Option> options = m_dataManager.GetSelect().Select<Option>(strCondition, out strErrorMessage);

            if (options == null)
                return new MessageResult(false, strErrorMessage);

            Dictionary<string, Option> dicDefaultOptions = GetDefaultOptions(out strErrorMessage);

            if (dicDefaultOptions == null)
                return new MessageResult(false, strErrorMessage);

            List<Option> updateOptions = new List<Option>();

            foreach (Option option in options)
            {
                Option defaultOption;

                if (dicDefaultOptions.TryGetValue(option.prop_name.ToLower(), out defaultOption))
                {
                    option.prop_value = defaultOption.prop_value;
                    updateOptions.Add(option);
                }    
            }

            if (m_dataManager.GetUpdate().Update<Option>(updateOptions, out strErrorMessage) == false)
                return new MessageResult(false, strErrorMessage);

            return new MessageResult(true, "");
        }

        private Dictionary<string, Option> GetDefaultOptions(out string strErrorMessage)
        {
            string strTarget = "Default/";
            string strCondition = string.Format("{0} like '{1}%'", Option.Fields.prop_name, strTarget);
            IEnumerable<Option> options = m_dataManager.GetSelect().Select<Option>(strCondition, out strErrorMessage);

            if (options == null)
                return null;

            int targetLen = strTarget.Length;
            Dictionary<string, Option> dicOptions = new Dictionary<string, Option>();

            foreach (Option option in options)
            {
                option.prop_name = option.prop_name.Substring(targetLen).Trim();
                dicOptions[option.prop_name.ToLower()] = option;
            }

            return dicOptions;
        }
    }
}
