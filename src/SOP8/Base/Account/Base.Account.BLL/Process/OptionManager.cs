using dnsDapperDBUtil.DataAccessLayer.IDAL;
using System.Collections.Generic;
using Base.Account.IBLL.Response;
using Base.Account.IBLL.Request;
using Base.Account.IBLL.Models;
using Base.Model.Account;
using Response.Resource;
using Response;

namespace Base.Account.BLL.Process
{
    using Resource;

    class OptionManager
    {
        public static ResponseOption GetOption(RequestOption data, IDataManager dataManager)
        {
            ResponseOption result = new ResponseOption();

            string strErrorMessage = null;
            string strCondition = string.Format("{0} = {1}", Option.Fields.user_sn, data.UserNo);

            if (data.Category != null && data.Category.Length > 0)
            {
                if (data.SubCategory != null && data.SubCategory.Length > 0)
                    strCondition += string.Format(" and {0} = '{1}' and {2} = '{3}'",
                        Option.Fields.optn_cl, data.Category,
                        Option.Fields.optn_sclas, data.SubCategory);
                else
                    strCondition += string.Format(" and {0} = '{1}'",
                        Option.Fields.optn_cl, data.Category);
            }

            strCondition += string.Format(" order by {0}, {1}, {2}", Option.Fields.optn_cl, Option.Fields.optn_sclas, Option.Fields.optn_indx);

            IEnumerable<Option> options = dataManager.GetSelect().Select<Option>(strCondition, out strErrorMessage);

            if (options == null)
            {
                result.Success = false;
                result.Message = ID.Get<ErrorMessage>("failToReadOption").Value();
                return result;
            }

            result.Success = true;
            result.UserNo = data.UserNo;
            result.Options = new List<UserOption>();
            result.Options.AddRange(ToUserOptions(options));
            return result;
        }

        private static IEnumerable<UserOption> ToUserOptions(IEnumerable<Option> options)
        {
            Dictionary<string, UserOption> dicUserOptions = new Dictionary<string, UserOption>();
            UserOption userOption;

            foreach (Option option in options)
            {
                string strKey = option.optn_cl;

                if (option.optn_sclas != null)
                    strKey += "_" + option.optn_sclas;

                if (dicUserOptions.TryGetValue(strKey, out userOption) == false)
                {
                    userOption = new UserOption();
                    userOption.Category = option.optn_cl;
                    userOption.SubCategory = option.optn_sclas;

                    dicUserOptions[strKey] = userOption;
                }

                userOption.Values.Add(option.optn_value);
            }

            return dicUserOptions.Values;
        }

        public static MessageResult SaveOption(int userNo, List<UserOption> options, IDataManager dataManager)
        {
            string strErrorMessage = null;

            dataManager = dataManager.Clone();

            if (dataManager.BeginBatch(out strErrorMessage) == false)
                return new MessageResult(false, "시스템 데이터베이스의 트랜잭션을 시작할 수 없습니다.");

            foreach (UserOption option in options)
            {
                // 기존 옵션 삭제
                string strCondition = string.Format("{0} = {1}", Option.Fields.user_sn, userNo);

                if (option.Category != null)
                {
                    if (option.SubCategory != null)
                        strCondition += string.Format(" and {0} = '{1}' and {2} = '{3}'", Option.Fields.optn_cl, option.Category, Option.Fields.optn_sclas, option.SubCategory);
                    else
                        strCondition += string.Format(" and {0} = '{1}'", Option.Fields.optn_cl, option.Category);
                }

                if (dataManager.GetDelete().Delete<Option>(strCondition, out strErrorMessage) == false)
                {
                    string strTemp;
                    dataManager.BatchRollback(out strTemp);
                    return new MessageResult(false, strErrorMessage);
                }
            }

            List<Option> userOptions = new List<Option>();

            foreach (UserOption option in options)
            {
                if (option.Values == null)
                    continue;

                int valueCount = option.Values.Count;

                for (int i=0;i<valueCount;i++)
                {
                    Option userOption = new Option();

                    userOption.user_sn = userNo;
                    userOption.optn_cl = option.Category;
                    userOption.optn_sclas = option.SubCategory;
                    userOption.optn_indx = i + 1;
                    userOption.optn_value = option.Values[i];

                    userOptions.Add(userOption);
                }
            }

            if (userOptions.Count > 0)
            {
                if (dataManager.GetCreate().Insert<Option>(userOptions, out strErrorMessage) == false)
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
                return new MessageResult(false, "시스템 데이터베이스의 트랜잭션을 종료할 수 없습니다.");
            }

            return new MessageResult(true, "");
        }
    }
}
