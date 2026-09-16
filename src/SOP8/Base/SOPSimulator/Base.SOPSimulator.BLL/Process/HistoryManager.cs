using System;
using System.Collections.Generic;
using System.Collections;
using dnsDapperDBUtil.DataAccessLayer.IDAL;
using Base.Model.History;
using dnsData.CommonCode;
using Base.DAL;
using Base.SOPSimulator.IBLL.Request;
using Base.SOPSimulator.IBLL.Response;

namespace Base.SOPSimulator.BLL.Process
{
    using Models;

    class HistoryManager
    {
        public static Component AddComponentHistory(IDataManager dataManager, int actionStepHistoryNo, int componentNo, DateTime timeStamp, int runStatus, int? userNo, string strDescription, out string strErrorMessage)
        {
            int? completeCount = GetCompleteCount(dataManager, actionStepHistoryNo, componentNo, out strErrorMessage);

            if (completeCount == null)
                return null;

            Component componentHistory = new Component();

            componentHistory.action_step_hist_sn = actionStepHistoryNo;
            componentHistory.compn_sn = componentNo;
            componentHistory.time = timeStamp;
            componentHistory.sop_sttus_optn_code = (int)CodeType.SopRunStatus;
            componentHistory.sop_sttus_code = runStatus;
            componentHistory.compt_cnt = runStatus == Sop.SopRunStatus.Complete ? (int)completeCount + 1 : (int)completeCount;
            componentHistory.user_sn = userNo;
            componentHistory.descp = strDescription;

            int addedID;

            if (dataManager.GetCreate().Insert<Component>(componentHistory, out addedID, out strErrorMessage) == false)
                return null;

            componentHistory.compn_hist_sn = addedID;

            // 새로운 ComponentHistory가 추가되었으니 ActionStepHistory의 LastAccessedTime을 바꿔준다.
            if (UpdateActionStepHistory(dataManager, actionStepHistoryNo, timeStamp, userNo, out strErrorMessage) == false)
                return null;

            return componentHistory;
        }

        // componentNo에 해당하는 Section을 실행 상태로 만들고, 기존에 실행 상태로 있던 다른 component들은 모두 skip 상태로 바꾼다.
        public static Component SetCurrent(IDataManager dataManager, int actionStepHistoryNo, int componentNo, DateTime timeStamp, int? userNo, string strDescription, out string strErrorMessage)
        {
            string strCondition = string.Format("a.{0} = {1} and a.{2} in (select max({2}) from {3} group by {4}, {5} having {5} = {6})",
                Component.Fields.sop_sttus_code, Sop.SopRunStatus.InProgress,
                Component.Fields.compn_hist_sn,
                Component.TableName,
                Component.Fields.compn_sn,
                Component.Fields.action_step_hist_sn,
                actionStepHistoryNo);

            JoinManager joinManager = new JoinManager(dataManager);
            ArrayList arrDatas = joinManager.JoinComponentHistoryComponent(strCondition, out strErrorMessage);

            if (arrDatas == null)
                return null;

            Component history = null;
            int nDataCount = arrDatas.Count;

            for (int i=0;i<nDataCount-1;i+=2)
            {
                if (arrDatas[i] is Component && arrDatas[i + 1] is Model.Sop.Component.Component)
                {
                    Component componentHistory = (Component)arrDatas[i];
                    Model.Sop.Component.Component component = (Model.Sop.Component.Component)arrDatas[i + 1];

                    if (component.compn_sn == componentNo)
                    {
                        history = componentHistory;
                        continue;
                    }

                    string strDescr = RunManager.GetComponentHistoryDescription(component.compn_code, Sop.SopRunStatus.Skip, null, null, null);

                    if (AddComponentHistory(dataManager, actionStepHistoryNo, componentHistory.compn_sn, timeStamp, Sop.SopRunStatus.Skip, userNo, strDescr, out strErrorMessage) == null)
                        return null;
                }
            }

            if (history == null)
            {
                history = AddComponentHistory(dataManager, actionStepHistoryNo, componentNo, timeStamp, Sop.SopRunStatus.InProgress, userNo, strDescription, out strErrorMessage);
            }

            return history;
        }

        private static bool UpdateActionStepHistory(IDataManager dataManager, int actionStepHistoryNo, DateTime timeStamp, int? userNo, out string strErrorMessage)
        {
            Dictionary<ActionStep.Fields, object> dicSets = new Dictionary<ActionStep.Fields, object>();
            dicSets[ActionStep.Fields.last_acces_time] = timeStamp;
            dicSets[ActionStep.Fields.user_sn] = userNo;

            string strCondition = string.Format("{0} = {1}", ActionStep.Fields.action_step_hist_sn, actionStepHistoryNo);
            return dataManager.GetUpdate().Update<ActionStep, ActionStep.Fields>(dicSets, strCondition, out strErrorMessage);
        }

        public static ComponentDetail AddComponentHistoryDetail(IDataManager dataManager, int componentHistoryNo, int dataIndex, bool isChecked, out string strErrorMessage)
        {
            ComponentDetail componentHistoryDetail = new ComponentDetail();
            componentHistoryDetail.compn_hist_sn = componentHistoryNo;
            componentHistoryDetail.data_no = dataIndex;
            componentHistoryDetail.data_intgr = isChecked ? 1 : 0;

            int addedID;

            if (dataManager.GetCreate().Insert<ComponentDetail>(componentHistoryDetail, out addedID, out strErrorMessage) == false)
                return null;

            componentHistoryDetail.compn_hist_detail_sn = addedID;
            return componentHistoryDetail;
        }

        private static int? GetCompleteCount(IDataManager dataManager, int actionStepHistoryNo, int componentNo, out string strErrorMessage)
        {
            string strCondition = string.Format("{0} = {1} and {2} = {3} and {4} = {5}",
                Component.Fields.action_step_hist_sn, actionStepHistoryNo,
                Component.Fields.compn_sn, componentNo,
                Component.Fields.sop_sttus_code, Sop.SopRunStatus.Complete);

            return CustomManager.GetCount(dataManager, "*", Component.TableName, strCondition, out strErrorMessage);
        }

        public static ResponseComponentHistory GetComponentHistory(IDataManager dataManager, RequestComponentHistory data)
        {
            string strCondition = string.Format("{0} = {1}", Component.Fields.action_step_hist_sn, data.ActionStepHistoryNo);

            if (data.LastComponentHistoryNo != null)
                strCondition += string.Format(" and {0} > {1}", Component.Fields.compn_hist_sn, (int)data.LastComponentHistoryNo);

            string strErrorMessage;
            JoinManager joinManager = new JoinManager(dataManager);
            ArrayList arrDatas = joinManager.JoinComponentHistoryComponent(strCondition, out strErrorMessage);

            if (arrDatas == null)
                return new ResponseComponentHistory(false, strErrorMessage);

            int nDataCount = arrDatas.Count;

            /*IEnumerable<Component> componentHistories = dataManager.GetSelect().Select<Component>(strCondition, out strErrorMessage);

            if (componentHistories == null)
                return new ResponseComponentHistory(false, strErrorMessage);*/

            Dictionary<int, ComponentHistoryEx> dicComponentHistories = new Dictionary<int, ComponentHistoryEx>();
            string strComponentHistoryNos = "";

            for (int i=0;i<nDataCount-1;i+=2)
            //foreach (var componentHistory in componentHistories)
            {
                if (arrDatas[i] is Component && arrDatas[i + 1] is Model.Sop.Component.Component)
                {
                    Component componentHistory = (Component)arrDatas[i];
                    Model.Sop.Component.Component component = (Model.Sop.Component.Component)arrDatas[i + 1];

                    if (strComponentHistoryNos.Length == 0)
                        strComponentHistoryNos = componentHistory.compn_hist_sn.ToString();
                    else
                        strComponentHistoryNos += "," + componentHistory.compn_hist_sn.ToString();

                    dicComponentHistories[componentHistory.compn_hist_sn] = new ComponentHistoryEx(componentHistory, component.compn_code);
                }
            }

            if (strComponentHistoryNos.Length > 0)
            {
                strCondition = string.Format("{0} in ({1})", ComponentDetail.Fields.compn_hist_sn, strComponentHistoryNos);
                IEnumerable<ComponentDetail>  componentHistoryDetails = dataManager.GetSelect().Select<ComponentDetail>(strCondition, out strErrorMessage);

                if (componentHistoryDetails == null)
                    return new ResponseComponentHistory(false, strErrorMessage);

                foreach (ComponentDetail componentHistoryDetail in componentHistoryDetails)
                {
                    ComponentHistoryEx componentHistory;

                    if (dicComponentHistories.TryGetValue(componentHistoryDetail.compn_hist_sn, out componentHistory))
                        componentHistory.ComponentHistoryDetails.Add(componentHistoryDetail);
                }
            }

            ResponseComponentHistory response = new ResponseComponentHistory(true, "");
            response.ComponentHistories.AddRange(dicComponentHistories.Values);
            return response;
        }

        public static bool AutoCloseActionStepHistory(IDataManager dataManager, ActionStep actionStepHistory, SOPWaitTimeOption option, out string strErrorMessage)
        {
            DateTime dtNow = DateTime.Now;

            Dictionary<ActionStep.Fields, object> dicSets = new Dictionary<ActionStep.Fields, object>();
            dicSets[ActionStep.Fields.end_time] = dtNow;
            dicSets[ActionStep.Fields.descp] = GetAutoCloseDescription(dtNow, actionStepHistory.last_acces_time, option);

            string strCondition = string.Format("{0} = {1}", ActionStep.Fields.action_step_hist_sn, actionStepHistory.action_step_hist_sn);
            return dataManager.GetUpdate().Update<ActionStep, ActionStep.Fields>(dicSets, strCondition, out strErrorMessage);
        }

        public static string GetAutoCloseDescription(DateTime endTime, DateTime? lastAccessedTime, SOPWaitTimeOption option)
        {
            if (lastAccessedTime == null)
                return null;

            TimeSpan span = endTime - (DateTime)lastAccessedTime;

            string strFormat = "SOP가 마지막으로 진행된 이후로 {0} 동안 아무런 진행이 없어서 자동 종료";
            string strTime = null;

            if (span.TotalDays >= 1.0)
                strTime = string.Format("{0}일", (int)span.TotalDays);

            if (span.TotalHours >= 1.0)
            {
                int hours = (int)(span.TotalHours - ((int)span.TotalDays) * 24);

                if (strTime == null)
                    strTime = string.Format("{0}시간", hours);
                else
                    strTime += string.Format(" {0}시간", hours);
            }

            if (option.TimeOption == SOPWaitTimeOption.TimeOptions.Hour)
            {
                if (strTime != null)
                    return string.Format(strFormat, strTime);
                else
                    return null;
            }

            if (span.TotalMinutes >= 1.0)
            {
                int minutes = (int)(span.TotalMinutes - ((int)span.TotalHours) * 60);

                if (strTime == null)
                    strTime = string.Format("{0}분", minutes);
                else
                    strTime += string.Format(" {0}분", minutes);
            }

            if (option.TimeOption == SOPWaitTimeOption.TimeOptions.Minute)
            {
                if (strTime != null)
                    return string.Format(strFormat, strTime);
                else
                    return null;
            }

            int seconds = (int)(span.TotalSeconds - ((int)span.TotalMinutes) * 60);

            if (seconds > 0)
            {
                if (strTime == null)
                    strTime = string.Format("{0}초", seconds);
                else
                    strTime += string.Format(" {0}초", seconds);
            }

            if (strTime == null)
                return null;

            return string.Format(strFormat, strTime);
        }
    }
}
