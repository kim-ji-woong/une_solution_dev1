using dnsDapperDBUtil.DataAccessLayer.IDAL;
using Base.Model.Sop;
using Base.Model.Sop.Category;
using System;
using System.Collections.Generic;

namespace SOPMonitorService.Process
{
    class TimeoutManager
    {
        private const string Mode_AutoClose = "0";
        private const string Mode_ConfirmNClose = "1";
        private const string Mode_NoClose = "2";

        private const string Time_Second = "0";
        private const string Time_Minute = "1";
        private const string Time_Hour = "2";

        public static bool Run(IDataManager dataManager, out string strErrorMessage)
        {
            // Key : SiteNo
            // Value : Target Time
            Dictionary<int, string> dicTargetTimes = ReadOptions(dataManager, out strErrorMessage);

            if (dicTargetTimes == null)
                return false;

            foreach (KeyValuePair<int, string> pair in dicTargetTimes)
            {
                string strSubCondition = string.Format("Select a.{3} from {0} a inner join {1} b on a.{4} = b.{5} inner join {2} c on b.{6} = c.{7} and c.{8} = {9}",
                    ActionStep.TableName, SmallClass.TableName, Base.Model.Sop.Category.Version.TableName,
                    ActionStep.Fields.action_step_sn,
                    ActionStep.Fields.sclas_sn, SmallClass.Fields.sclas_sn,
                    SmallClass.Fields.ver_sn, Base.Model.Sop.Category.Version.Fields.ver_sn,
                    Base.Model.Sop.Category.Version.Fields.site_sn, pair.Key);

                string strCondition = string.Format("{0} is not null and {1} is null and {2} < '{3}' and {4} in ({5})",
                    Base.Model.History.ActionStep.Fields.begin_time, Base.Model.History.ActionStep.Fields.end_time,
                    Base.Model.History.ActionStep.Fields.last_acces_time, pair.Value,
                    Base.Model.History.ActionStep.Fields.action_step_sn, strSubCondition);

                IEnumerable<Base.Model.History.ActionStep> actionStepHistories = dataManager.GetSelect().Select<Base.Model.History.ActionStep>(strCondition, out strErrorMessage);

                if (actionStepHistories == null)
                    return false;

                List<Base.Model.History.ActionStep> _actionStepHistories = new List<Base.Model.History.ActionStep>();

                foreach (var actionStepHistory in actionStepHistories)
                {
                    actionStepHistory.end_time = DateTime.Now;
                    actionStepHistory.descp = "Timeout에 의한 자동종료";
                    _actionStepHistories.Add(actionStepHistory);
                }

                if (_actionStepHistories.Count > 0)
                {
                    if (dataManager.GetUpdate().Update<Base.Model.History.ActionStep>(_actionStepHistories, out strErrorMessage) == false)
                        return false;
                }
            }

            return true;
        }

        // Key : SiteNo
        // Value : Target Time
        private static Dictionary<int, string> ReadOptions(IDataManager dataManager, out string strErrorMessage)
        {
            string strCondition = string.Format("{0} = 'SOP/AutoClose'", Option.Fields.prop_name);
            IEnumerable<Option> options = dataManager.GetSelect().Select<Option>(strCondition, out strErrorMessage);

            if (options == null)
                return null;

            DateTime dtNow = DateTime.Now;

            // Key : SiteNo
            // Value : Target Time
            Dictionary<int, string> dicTargetTimes = new Dictionary<int, string>();

            foreach (Option option in options)
            {
                if (option.prop_value == null || option.prop_value.Length == 0)
                    continue;

                string[] tokens = option.prop_value.Split(';');

                if (tokens.Length < 3)
                    continue;

                string strTime = tokens[0].Trim();
                string strUnit = tokens[1].Trim();
                string strMode = tokens[2].Trim();

                int time;

                if (int.TryParse(strTime, out time) == false)
                    continue;

                if (strMode != Mode_AutoClose)
                    continue;

                DateTime dtTarget;

                if (strUnit == Time_Second)
                    dtTarget = dtNow.AddSeconds(time * (-1));
                else if (strUnit == Time_Minute)
                    dtTarget = dtNow.AddMinutes(time * (-1));
                else if (strUnit == Time_Hour)
                    dtTarget = dtNow.AddHours(time * (-1));
                else
                    continue;

                string strTargetTime = string.Format("{0}-{1:00}-{2:00} {3:00}:{4:00}:{5:00}", dtTarget.Year, dtTarget.Month, dtTarget.Day, dtTarget.Hour, dtTarget.Minute, dtTarget.Second);
                dicTargetTimes[option.site_sn] = strTargetTime;
            }

            return dicTargetTimes;
        }
    }
}
