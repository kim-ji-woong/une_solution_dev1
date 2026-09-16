using System;
using System.Collections.Generic;
using System.Collections;
using Base.SOPSimulator.IBLL.Request;
using Base.SOPSimulator.IBLL.Response;
using Base.SOPSimulator.IBLL.Models;
using Base.DAL;
using dnsDapperDBUtil.DataAccessLayer.IDAL;
using Base.SOPManager.IBLL.Response;
using Base.SOPManager.IBLL.Models.Category;
using Base.SOPManager.IBLL.Models.Component;
using Base.Model.Sop.Component;
using dnsData.CommonCode;
using Response;
using Base.Model.Sop.Category;
using Base.Model.Alarm;
using Base.Model.Sop.Config;
using Base.Model.Spatial;

namespace Base.SOPSimulator.BLL.Process
{
    using Models;

    class RunManager
    {
        private IDataManager m_dataManager = null;

        public RunManager(IDataManager dataManager)
        {
            m_dataManager = dataManager;
        }

        public ResponseCurrentHistory RequestCurrentSOPHistory(RequestCurrentHistory data, SOPManager.IBLL.IProcessManager sopProcessManager, SDMS.IBLL.IProcessManager sdmsProcessManager)
        {
            string strErrorMessage;
            //int maxActionStepHistoryNo = -1/*, maxComponentHistoryNo = -1*/;

            if (CheckAlarmSop(data.SiteNo, data.UserNo, sdmsProcessManager, sopProcessManager, out strErrorMessage) == false)
                return new ResponseCurrentHistory(false, strErrorMessage);

            List<ActionStepHistoryDataEx> targetActionStepHistoryDatas = new List<ActionStepHistoryDataEx>();
            Dictionary<int, ActionStepHistoryData> dicActionStepHistoryDatas = ReadActionStepHistories(data.ActionStepHistoryDatas, data.SiteNo, targetActionStepHistoryDatas, sopProcessManager, out strErrorMessage);

            if (dicActionStepHistoryDatas == null)
                return new ResponseCurrentHistory(false, strErrorMessage);

            IEnumerable<ComponentHistoryEx> componentHistories = dicActionStepHistoryDatas.Count > 0 ? ReadComponentHistories(dicActionStepHistoryDatas, data.ActionStepHistoryDatas/*, out maxComponentHistoryNo*/, out strErrorMessage) : new List<ComponentHistoryEx>();

            if (componentHistories == null)
                return new ResponseCurrentHistory(false, strErrorMessage);

            ResponseCurrentHistory response = new ResponseCurrentHistory(true, "");

            /*if (data.LastActionStepHistoryNo == null)
            {
                if (maxActionStepHistoryNo > 0)
                    response.IsChanged = true;
            }
            else if (data.LastActionStepHistoryNo < maxActionStepHistoryNo)
            {
                if (data.LastComponentHistoryNo == null || data.LastComponentHistoryNo < maxComponentHistoryNo)
                    response.IsChanged = true;
            }

            if (data.LastComponentHistoryNo == null)
            {
                if (maxComponentHistoryNo > 0)
                    response.IsChanged = true;
            }
            else if (data.LastComponentHistoryNo < maxComponentHistoryNo)
                response.IsChanged = true;*/

            MakeActionStepHistoryDatas(dicActionStepHistoryDatas, componentHistories, data.ActionStepHistoryDatas);
            response.ActionStepHistoryDatas.AddRange(targetActionStepHistoryDatas);

            ComponentHistory lastComponentHistory = GetLastElement(componentHistories);

            if (lastComponentHistory != null)
                response.LastAccessActionStepHistoryNo = lastComponentHistory.action_step_hist_sn;

            foreach (var pair in dicActionStepHistoryDatas)
            {
                if (pair.Value.IsChanged)
                {
                    response.IsChanged = true;
                    break;
                }
            }

            return response;
        }

        public static DataType GetLastElement<DataType>(IEnumerable<DataType> datas) where DataType : class
        {
            DataType last = null;

            foreach (DataType data in datas)
            {
                last = data;
            }

            return last;
        }    

        public ResponseExecuteSOP BeginSOP(RequestExecuteSOP data, SOPManager.IBLL.IProcessManager sopManagerProcessManager, IDataManager dataManager, bool transaction)
        {
            ResponseOpen responseOpen = sopManagerProcessManager.OpenDB(data.SmallClassNo);

            if (responseOpen.Success == false)
                return new ResponseExecuteSOP(false, responseOpen.Message);

            foreach (var actionStepData in responseOpen.SOPData.ActionStepDatas)
            {
                if (actionStepData.ActionStep == null)
                    continue;

                if (actionStepData.ActionStep.action_step_sn == data.ActionStepNo)
                {
                    DateTime beginTime = data.BeginTime == null ? DateTime.Now : (DateTime)data.BeginTime;

                    string strErrorMessage;
                    Model.History.ActionStep actionStepHistory = BeginSOP(beginTime, data.ActionStepNo, actionStepData, data.Position, data.LastAccessedUserNo, data.SensorZoneHistoryNo, data.DecisionValue, dataManager, transaction, out strErrorMessage);

                    if (actionStepHistory == null)
                        return new ResponseExecuteSOP(false, strErrorMessage);

                    ResponseExecuteSOP response = new ResponseExecuteSOP(true, "");
                    response.ActionStepHistoryNo = CheckDuplicationAlarmSOP(actionStepHistory, dataManager);//actionStepHistory.action_step_hist_sn;
                    return response;
                }
            }

            return new ResponseExecuteSOP(false, "SOP를 시작할 수 없습니다.");
        }

        // 하나의 SensorZoneHistory에 여러개의 ActionStepHistory가 생기지 않도록 확인한다.
        // 만일, 하나 이상의 ActionStepHistory가 생성되었으면 강제로 삭제시킨다.
        private int CheckDuplicationAlarmSOP(Model.History.ActionStep actionStepHistory, IDataManager dataManager)
        {
            if (actionStepHistory.sensor_zone_hist_sn == null)
                return actionStepHistory.action_step_hist_sn;

            string strErrorMessage;
            string strCondition = string.Format("{0} = {1}", Model.History.ActionStep.Fields.sensor_zone_hist_sn, (int)actionStepHistory.sensor_zone_hist_sn);
            IEnumerable<Model.History.ActionStep> actionStepHistories = dataManager.GetSelect().Select<Model.History.ActionStep>(strCondition, out strErrorMessage);

            if (actionStepHistories == null)
            {
                System.Diagnostics.Trace.WriteLine(strErrorMessage);
                return actionStepHistory.action_step_hist_sn;
            }

            int actionStepHistoryNo = actionStepHistory.action_step_hist_sn;

            foreach (var history in actionStepHistories)
            {
                if (history.action_step_hist_sn == actionStepHistory.action_step_hist_sn)
                    continue;

                // 하나의 SensorZoneHistory에 대하여 여러개의 actionStepHistory가 생성되었다면 가장 먼저 생성된 것을 두고 나머지는 모두 삭제하도록 한다.
                if (history.action_step_hist_sn > actionStepHistory.action_step_hist_sn)
                    RemoveActionStepHistory(history.action_step_hist_sn, dataManager);
                else
                {
                    if (actionStepHistoryNo > history.action_step_hist_sn)
                    {
                        RemoveActionStepHistory(actionStepHistoryNo, dataManager);
                        actionStepHistoryNo = history.action_step_hist_sn;
                    }
                }
            }

            return actionStepHistoryNo;
        }

        private bool RemoveActionStepHistory(int actionStepHistoryNo, IDataManager dataManager)
        {
            string strErrorMessage;

            string strCondition = string.Format("{0} in (Select {1} from {2} where {3} in (Select {4} from {5} where {6} = {7}))",
                Model.History.ComponentDetail.Fields.compn_hist_sn,
                Model.History.Component.Fields.compn_hist_sn,
                Model.History.Component.TableName,
                Model.History.Component.Fields.action_step_hist_sn,
                Model.History.ActionStep.Fields.action_step_hist_sn,
                Model.History.ActionStep.TableName,
                Model.History.ActionStep.Fields.action_step_hist_sn,
                actionStepHistoryNo);

            if (dataManager.GetDelete().Delete<Model.History.ComponentDetail>(strCondition, out strErrorMessage) == false)
            {
                System.Diagnostics.Trace.WriteLine("RemoveActionStepHistory DeleteComponentHistoryDetail Fail : " + strErrorMessage);
                return false;
            }

            strCondition = string.Format("{0} in (Select {1} from {2} where {3} = {4})",
                Model.History.Component.Fields.action_step_hist_sn,
                Model.History.ActionStep.Fields.action_step_hist_sn,
                Model.History.ActionStep.TableName,
                Model.History.ActionStep.Fields.action_step_hist_sn,
                actionStepHistoryNo);

            if (dataManager.GetDelete().Delete<Model.History.Component>(strCondition, out strErrorMessage) == false)
            {
                System.Diagnostics.Trace.WriteLine("RemoveActionStepHistory DeleteComponentHistory Fail : " + strErrorMessage);
                return false;
            }

            strCondition = string.Format("{0} = {1}", Model.History.ActionStep.Fields.action_step_hist_sn, actionStepHistoryNo);
            
            if (dataManager.GetDelete().Delete<Model.History.ActionStep>(strCondition, out strErrorMessage) == false)
            {
                System.Diagnostics.Trace.WriteLine("RemoveActionStepHistory DeleteActionStepHistory Fail : " + strErrorMessage);
                return false;
            }

            return true;
        }

        // 실행요청이 있는 Alarm SOP가 있는지 확인하여 있으면 SOP를 실행시킨다.
        private bool CheckAlarmSop(int? siteNo, int userNo, SDMS.IBLL.IProcessManager sdmsProcessManager, SOPManager.IBLL.IProcessManager sopManagerProcessManager, out string strErrorMessage)
        {
            string strCondition = string.Format("a.{0} = {1} and a.{2} = {3}",
                Current.Fields.sop_sttus_code, History.SopStatus.RequestSOP,
                Current.Fields.user_sn, userNo);

            if (siteNo != null)
                strCondition += string.Format(" and b.{0} = {1}", Model.History.SensorZone.Fields.site_sn, (int)siteNo);

            IDataManager dataManager = m_dataManager.Clone();

            // 한명의 User가 다수의 SOP Simulator 화면을 실행시키고 있을수도 있으니
            // Transaction으로 하나의 SensorZoneHistory에 여러개의 ActionStepHistory가 생성되는걸 방지한다.
            //if (dataManager.BeginBatch(out strErrorMessage) == false)
            //{
            //    strErrorMessage = "DataBase 트랜잭션을 시작할 수 없습니다.";
            //    return false;
            //}

            JoinManager joinManager = new JoinManager(dataManager);
            ArrayList arrDatas = joinManager.JoinCurrentAlarmHistorySensorZone(strCondition, out strErrorMessage);

            if (arrDatas == null)
                return false;

            //ArrayList arrBeginSops = new ArrayList();
            int nDataCount = arrDatas.Count;

            //for (int i = 0; i < nDataCount - 1; i += 2)
            //{
            //    if (arrDatas[i] is Current && arrDatas[i + 1] is Model.History.SensorZone)
            //    {
            //        Current currentAlarm = (Current)arrDatas[i];
            //        Model.History.SensorZone sensorZoneHistory = (Model.History.SensorZone)arrDatas[i + 1];

            //        LinkedSop linkedSop = GetLinkedSop(sensorZoneHistory.zone_sn, sensorZoneHistory.sensor_ty_code, siteNo, dataManager, out strErrorMessage);

            //        if (linkedSop == null)
            //        {
            //            if (strErrorMessage != null)
            //                return false;
            //            else
            //            {
            //                // 실행시킬 SOP를 찾을수 없으니 다시 대기상태로 둔다.
            //                SetReadySop(currentAlarm, dataManager, out strErrorMessage);
            //            }
            //        }
            //        else
            //        {
            //            ActionStep actionStep = GetLinkedActionStep(currentAlarm, linkedSop, dataManager, out strErrorMessage);

            //            if (actionStep == null)
            //            {
            //                if (strErrorMessage != null)
            //                    return false;
            //                else
            //                {
            //                    // 실행시킬 SOP를 찾을수 없으니 다시 대기상태로 둔다.
            //                    SetReadySop(currentAlarm, dataManager, out strErrorMessage);
            //                }
            //            }
            //            else
            //            {
            //                // UserNo를 없애서 아무도 이 알람에 대한 SOP를 실행시킬수 없도록 만든다.
            //                // 혹시 Multi로 실행되고 있을수도 있는 같은 UserNo를 사용하는 SOP Simulator로부터 보호한다.
            //                SetAlarmSopStatus(currentAlarm.sensor_zone_hist_sn, History.SopStatus.RequestSOP, null, dataManager, out strErrorMessage);

            //                arrBeginSops.Add(currentAlarm);
            //                arrBeginSops.Add(actionStep);
            //            }
            //        }
            //    }
            //}

            //if (dataManager.BatchCommit(out strErrorMessage) == false)
            //{
            //    string strTemp;
            //    dataManager.BatchRollback(out strTemp);
            //    strErrorMessage = "DataBase 트랜잭션을 정상적으로 종료할 수 없습니다.";
            //    return false;
            //}

            //int nAlarmSopParameterCount = arrBeginSops.Count;

            //for (int i=0;i<nAlarmSopParameterCount-1;i+=2)
            //{
            //    Current alarm = (Current)arrBeginSops[i];
            //    ActionStep actionStep = (ActionStep)arrBeginSops[i + 1];

            //    if (BeginAlarmSop(alarm, actionStep, userNo, sdmsProcessManager, sopManagerProcessManager, out strErrorMessage) == false)
            //        return false;
            //}

            bool noUsableSop;
            SmallClass smallClass;

            for (int i=0;i<nDataCount-1;i+=2)
            {
                if (arrDatas[i] is Current && arrDatas[i + 1] is Model.History.SensorZone)
                {
                    Current currentAlarm = (Current)arrDatas[i];
                    Model.History.SensorZone sensorZoneHistory = (Model.History.SensorZone)arrDatas[i + 1];

                    LinkedSopManager linkedSopManager = new LinkedSopManager(dataManager);
                    LinkedSop linkedSop = linkedSopManager.GetLinkedSop(sensorZoneHistory.zone_sn, sensorZoneHistory.sensor_ty_code, siteNo, out smallClass, out strErrorMessage, out noUsableSop);

                    if (linkedSop == null)
                    {
                        if (strErrorMessage != null)
                        {
                            if (noUsableSop)
                            {
                                // 실행시킬 SOP를 찾을수 없으니 다시 대기상태로 둔다.
                                SetReadySop(currentAlarm, dataManager, out strErrorMessage);
                            }

                            return false;
                        }
                        else
                        {
                            // 실행시킬 SOP를 찾을수 없으니 다시 대기상태로 둔다.
                            SetReadySop(currentAlarm, dataManager, out strErrorMessage);
                        }
                    }
                    else
                    {
                        ActionStep actionStep = GetLinkedActionStep(currentAlarm, smallClass, dataManager, out strErrorMessage);

                        if (actionStep == null)
                        {
                            if (strErrorMessage != null)
                                return false;
                            else
                            {
                                // 실행시킬 SOP를 찾을수 없으니 다시 대기상태로 둔다.
                                SetReadySop(currentAlarm, dataManager, out strErrorMessage);
                            }
                        }
                        else
                        {
                            if (BeginAlarmSop(currentAlarm, actionStep, userNo, sdmsProcessManager, sopManagerProcessManager, out strErrorMessage) == false)
                                return false;
                        }
                    }
                }
            }

            return true;
        }

        private bool BeginAlarmSop(Current alarm, ActionStep actionStep, int userNo, SDMS.IBLL.IProcessManager sdmsProcessManager, SOPManager.IBLL.IProcessManager sopManagerProcessManager, out string strErrorMessage)
        {
            if (BeginSOP(alarm.sensor_zone_hist_sn, actionStep.action_step_sn, actionStep.sclas_sn, sdmsProcessManager, sopManagerProcessManager, out strErrorMessage) == false)
            {
                // SOP 실행에 실패하였으니 다시 실행할 수 있도록 원상복구한다.
                SetAlarmSopStatus(alarm.sensor_zone_hist_sn, History.SopStatus.RequestSOP, userNo, m_dataManager, out strErrorMessage);
                return false;
            }

            return true;
        }

        private bool BeginSOP(int sensorZoneHistoryNo, int actionStepNo, int sclassNo, SDMS.IBLL.IProcessManager sdmsProcessManager, SOPManager.IBLL.IProcessManager sopManagerProcessManager, out string strErrorMessage)
        {
            SDMS.IBLL.Request.RequestAlarmPosition req = new SDMS.IBLL.Request.RequestAlarmPosition();
            req.SensorZoneHistoryNo = sensorZoneHistoryNo;

            var response = sdmsProcessManager.RequestAlarmPosition(req);

            RequestExecuteSOP request = new RequestExecuteSOP();
            request.ActionStepNo = actionStepNo;
            request.BeginTime = DateTime.Now;
            request.DecisionValue = null;
            request.LastAccessedUserNo = null;
            request.Position = response.Success ? response.Position : "";
            request.SensorZoneHistoryNo = sensorZoneHistoryNo;
            request.SmallClassNo = sclassNo;

            IDataManager dataManager = m_dataManager.Clone();

            if (dataManager.BeginBatch(out strErrorMessage) == false)
            {
                strErrorMessage = "DataBase 트랜잭션을 시작할 수 없습니다.";
                return false;
            }

            var response2 = BeginSOP(request, sopManagerProcessManager, dataManager, false);

            if (response2.Success == false)
            {
                string strTemp;
                dataManager.BatchRollback(out strTemp);
                strErrorMessage = response2.Message;
                return false;
            }

            // CurrentAlar의 SOP 상태를 실행중으로 바꾼다.
            if (SetAlarmSopStatus(sensorZoneHistoryNo, History.SopStatus.RunningSOP, null, dataManager, out strErrorMessage) == false)
            {
                string strTemp;
                dataManager.BatchRollback(out strTemp);
                return false;
            }

            if (dataManager.BatchCommit(out strErrorMessage) == false)
            {
                string strTemp;
                dataManager.BatchRollback(out strTemp);

                strErrorMessage = "DataBase 트랜잭션을 정상적으로 종료할 수 없습니다.";
                return false;
            }

            return true;
        }

        private IEnumerable<StepMember> GetStepMembers(IEnumerable<ActionStep> actionSteps, IDataManager dataManager, out string strErrorMessage)
        {
            string strActionStepNos = null;

            foreach (ActionStep actionStep in actionSteps)
            {
                if (strActionStepNos == null)
                    strActionStepNos = actionStep.action_step_sn.ToString();
                else
                    strActionStepNos += "," + actionStep.action_step_sn.ToString();
            }

            if (strActionStepNos == null)
            {
                strErrorMessage = null;
                System.Diagnostics.Trace.WriteLine("비어있는 SOP입니다.");
                //strErrorMessage = "비어있는 SOP입니다.";
                return null;
            }

            string strCondition = string.Format("{0} in ({1})", StepMember.Fields.action_step_sn, strActionStepNos);
            return dataManager.GetSelect().Select<StepMember>(strCondition, out strErrorMessage);
        }

        private ActionStep GetLinkedActionStep(Current alarm, SmallClass smallClass/*LinkedSop linkedSop*/, IDataManager dataManager, out string strErrorMessage)
        {
            /*string strSubCondition = string.Format("select max(a.{0}) from {1} a inner join {2} b on a.{3} = b.{4} and a.{5} = '{6}' and b.{4} = {7} inner join {8} c on b.{9} = c.{10} and c.{11} = {12} and c.{10} = {13}",
                SmallClass.Fields.sclas_sn,
                SmallClass.TableName, MiddleClass.TableName,
                SmallClass.Fields.mclas_sn, MiddleClass.Fields.mclas_sn,
                SmallClass.Fields.sclas_name, linkedSop.sclas_name,
                linkedSop.mclas_sn,
                LargeClass.TableName,
                MiddleClass.Fields.lclas_sn, LargeClass.Fields.lclas_sn,
                LargeClass.Fields.site_sn, linkedSop.site_sn,
                linkedSop.lclas_sn);

            string strCondition = string.Format("{0} = ({1})", SmallClass.Fields.sclas_sn, strSubCondition);
            SmallClass smallClass = dataManager.GetSelect().SelectFirst<SmallClass>(strCondition, out strErrorMessage);

            if (smallClass == null)
                return null;*/

            string strCondition = string.Format("{0} = {1}", ActionStep.Fields.sclas_sn, smallClass.sclas_sn);
            IEnumerable<ActionStep> actionSteps = dataManager.GetSelect().Select<ActionStep>(strCondition, out strErrorMessage);

            if (actionSteps == null)
                return null;

            IEnumerable<StepMember> stepMembers = GetStepMembers(actionSteps, dataManager, out strErrorMessage);

            if (stepMembers == null)
                return null;

            if (IsEmpty(stepMembers))
                return null;

            ActionStep selectedActionStep = null;
            int? diff = null;

            foreach (ActionStep actionStep in actionSteps)
            {
                if (FindStepMember(actionStep.action_step_sn, stepMembers) == null)
                    continue;

                // 같은 등급의 ActionStep이 있으면 그 ActionStep을 선택한다.
                // 같은 등급의 ActionStep이 없으면 그 보다 등급이 높은 ActionStep중 가장 등급이 가까운 ActionStep을 선택한다.
                // 그마저도 없으면 가장 가까운 ActionStep을 선택한다.
                int alarmDepth = GetAlarmDepth(actionStep.action_step_name);
                int _diff = alarm.alarm_level - alarmDepth;

                if (_diff == 0)
                    return actionStep;

                if (diff == null)
                {
                    diff = _diff;
                    selectedActionStep = actionStep;
                }
                else if (_diff > 0)
                {
                    if (diff < 0 || (diff > 0 && diff > _diff))
                    {
                        diff = _diff;
                        selectedActionStep = actionStep;
                    }
                }
                else// if (_diff < 0)
                {
                    if (diff < 0 && _diff > diff)
                    {
                        diff = _diff;
                        selectedActionStep = actionStep;
                    }
                }
            }

            return selectedActionStep;
        }

        private StepMember FindStepMember(int actionStepNo, IEnumerable<StepMember> stepMembers)
        {
            foreach (StepMember stepMember in stepMembers)
            {
                if (stepMember.action_step_sn == actionStepNo)
                    return stepMember;
            }

            return null;
        }

        private bool IsEmpty<DataType>(IEnumerable<DataType> datas)
        {
            foreach (var data in datas)
            {
                return false;
            }

            return true;
        }

        private static int GetAlarmDepth(string strActionStepName)
        {
            if (strActionStepName == "관심")
                return 1;
            if (strActionStepName == "주의")
                return 2;
            if (strActionStepName == "경계")
                return 3;
            if (strActionStepName == "심각")
                return 4;

            return 1;
        }

        private void SetReadySop(Current alarm, IDataManager dataManager, out string strErrorMessage)
        {
            Dictionary<Current.Fields, object> dicSets = new Dictionary<Current.Fields, object>();
            dicSets[Current.Fields.sop_sttus_code] = History.SopStatus.Ready;
            dicSets[Current.Fields.user_sn] = null;

            string strCondition = string.Format("{0} = {1}", Current.Fields.sensor_zone_hist_sn, alarm.sensor_zone_hist_sn);
            dataManager.GetUpdate().Update<Current, Current.Fields>(dicSets, strCondition, out strErrorMessage);
        }

        /*private LinkedSop GetLinkedSop(int? zoneNo, int sensorType, int? siteNo, IDataManager dataManager, out string strErrorMessage)
        {
            strErrorMessage = null;
            string strCondition = zoneNo == null ? null : string.Format("{0} = {1}", Zone.Fields.zone_sn, zoneNo);
            Zone zone = strCondition == null ? null : dataManager.GetSelect().SelectFirst<Zone>(strCondition, out strErrorMessage);

            if (zone == null && strCondition != null)
            {
                if (strErrorMessage != null)
                    return null;
                else
                {
                    strErrorMessage = "알람발생 위치를 확인할 수 없어 SOP를 실행할 수 없습니다.";
                    return null;
                }
            }

            if (siteNo != null)
            {
                strCondition = string.Format("{0} = {1} and {2} = {3}",
                    LinkedSop.Fields.site_sn, (int)siteNo,
                    LinkedSop.Fields.sensor_ty_code, sensorType);
            }
            else
            {
                strCondition = string.Format("{0} = {1}", LinkedSop.Fields.sensor_ty_code, sensorType);
            }

            IEnumerable<LinkedSop> linkedSops = dataManager.GetSelect().Select<LinkedSop>(strCondition, out strErrorMessage);

            if (linkedSops == null)
                return null;

            foreach (LinkedSop sop in linkedSops)
            {
                if (zone != null)
                {
                    if (sop.zone_sn != null && sop.zone_sn == zone.zone_sn)
                        return sop;
                }
                else
                {
                    // 첫번재 sop를 선택한다.
                    return sop;
                }
            }

            foreach (LinkedSop sop in linkedSops)
            {
                // 첫번재 sop를 선택한다.
                return sop;
            }

            return null;
        }*/

        private Model.History.ActionStep BeginSOP(DateTime beginTime, int actionStepNo, ActionStepData actionStepData, string position, int? userNo, int? sensorZoneHistoryNo, DecisionValue decisionValue, IDataManager dataManager, bool transaction, out string strErrorMessage)
        {
            //bool transaction = true;

            if (dataManager == null)
            {
                dataManager = m_dataManager.Clone();
                transaction = false;
            }

            if (transaction)
            {
                if (dataManager.BeginBatch(out strErrorMessage) == false)
                {
                    strErrorMessage = "DataBase 트랜잭션을 시작할 수 없습니다.";
                    return null;
                }
            }

            Model.History.ActionStep oldActionStepHistory;
            Model.History.ActionStep newHistory = ExcuteSOP(dataManager, beginTime, actionStepNo, position, null, sensorZoneHistoryNo, out oldActionStepHistory, out strErrorMessage);

            if (newHistory != null)
            {
                if (actionStepData != null)
                {
                    List<ArrowData> arrowDatas = actionStepData.StepMemberDatas[0].Arrows;
                    List<SectionData> sectionDatas = actionStepData.StepMemberDatas[0].Sections;
                    SectionData currentSectionData = actionStepData.StepMemberDatas[0].Sections[0]; // SOP가 새로 시작했으므로 첫번째가 현재section이 된다

                    Dictionary<int, SectionData> dicSectionDatas = new Dictionary<int, SectionData>();

                    foreach (SectionData sectionData in sectionDatas)
                    {
                        dicSectionDatas[sectionData.Component.compn_sn] = sectionData;
                    }

                    if (CheckAutoSection(dataManager, actionStepData, arrowDatas, dicSectionDatas, currentSectionData.Component.compn_code, currentSectionData.Component.compn_sn, Sop.SopRunStatus.Complete, currentSectionData.Text, userNo, decisionValue, newHistory, "", out strErrorMessage) == false)
                        return null;
                }
                else
                {
                    actionStepData = new ActionStepData();
                }

                if (transaction)
                {
                    if (dataManager.BatchCommit(out strErrorMessage) == false)
                    {
                        string strTemp;
                        dataManager.BatchRollback(out strTemp);

                        strErrorMessage = "DataBase 트랜잭션을 정상적으로 종료할 수 없습니다.";
                        return null;
                    }
                }

                return newHistory;
            }
            else
            {
                if (oldActionStepHistory != null)
                {
                    if (transaction)
                    {
                        if (dataManager.BatchCommit(out strErrorMessage) == false)
                        {
                            string strTemp;
                            dataManager.BatchRollback(out strTemp);

                            strErrorMessage = "DataBase 트랜잭션을 정상적으로 종료할 수 없습니다.";
                            return null;
                        }
                    }

                    // 이미 실행된 ActionStepHistory가 있다.
                    return oldActionStepHistory;
                }
            }

            if (transaction)
            {
                string strTemp;
                dataManager.BatchRollback(out strTemp);
            }

            return null;
        }

        private bool CheckAutoSection(IDataManager dataManager, ActionStepData actionStepData, List<ArrowData> arrowDatas, Dictionary<int, SectionData> dicSectionDatas, int componentType, int componentNo, int status, string sectionText, int? userNo, DecisionValue decisionValue, Model.History.ActionStep actionStepHistory, string strSopKey, out string strErrorMessage)
        {
            // 시작
            if (ProgressSOP(dataManager, actionStepHistory, componentNo, componentType, status, userNo, sectionText, null, out strErrorMessage) == null)
                return false;

            bool keepGoing = true;
            return AutoRunSection(dataManager, strSopKey, actionStepData, actionStepHistory, arrowDatas, dicSectionDatas, componentType, componentNo, userNo, decisionValue, ref keepGoing, out strErrorMessage);
        }

        private bool AutoRunSection(IDataManager dataManager, string strSopKey, ActionStepData actionStepData, Model.History.ActionStep actionStepHistory, List<ArrowData> arrowDatas, Dictionary<int, SectionData> dicSectionDatas, int componentType, int componentNo, int? userNo, DecisionValue decisionValue, ref bool keepGoing, out string strErrorMessage)
        {
            List<SectionData> nextSections = GetNextSection(arrowDatas, dicSectionDatas, componentType, componentNo, decisionValue);

            if (nextSections != null)
            {
                foreach (SectionData nextSection in nextSections)
                {
                    while (true)
                    {
                        // 실행중
                        if (ProgressSOP(dataManager, actionStepHistory, nextSection.Component.compn_sn, nextSection.Component.compn_code, Sop.SopRunStatus.InProgress, userNo, nextSection.Text, null, out strErrorMessage) == null)
                            return false;

                        if (nextSection.AutoRun == null || nextSection.AutoRun == false)
                            break;
                        else
                        {
                            // 상황전파 수행
                            if (nextSection.Transmission != null)
                            {
                                if (nextSection.Transmission.sms_yn == true)
                                {
                                    if (nextSection.Component != null && nextSection.Component is TransmissionData)
                                    {
                                        if (SmsManager.SendSMS(dataManager, (TransmissionData)nextSection.Component, out strErrorMessage) == false)
                                            return false;
                                    }
                                }
                            }

                            // 완료
                            if (ProgressSOP(dataManager, actionStepHistory, nextSection.Component.compn_sn, nextSection.Component.compn_code, Sop.SopRunStatus.Complete, userNo, nextSection.Text, null, out strErrorMessage) == null)
                                return false;

                            componentType = nextSection.Component.compn_code;
                            componentNo = nextSection.Component.compn_sn;

                            if (IsMissionProcess(nextSection))
                            {
                                ProcessData processData = (ProcessData)nextSection.Component;

                                for (int i = 0; i < processData.Missions.Count; i++)
                                {
                                    if (actionStepData != null)
                                    {
                                        if (ProgressMission(dataManager, strSopKey, actionStepData, actionStepHistory, dicSectionDatas, componentType, componentNo, i, Sop.SopRunStatus.Complete, userNo, true, false, out strErrorMessage) == false)
                                            return false;
                                    }
                                    else
                                    {
                                        // 시작 컴포넌트 다음이 바로 자동컴포넌트인 경우 SOP가 m_sopRunDatas 쌓이기 전이기때문에 ComponentHistory 정보를 별도로 넣어줌
                                        string addDescription = (i + 1) + "번째 체크";

                                        Model.History.Component componentHistory = ProgressSOP(dataManager, actionStepHistory, componentNo, componentType, Sop.SopRunStatus.Complete, null, nextSection.Text, addDescription, out strErrorMessage);
                                        if (componentHistory == null)
                                            return false;

                                        int nData = 1;

                                        Model.History.ComponentDetail detail = new Model.History.ComponentDetail();
                                        detail.compn_hist_sn = componentHistory.compn_hist_sn;
                                        detail.data_no = i;
                                        detail.data_intgr = nData;

                                        int addedID;

                                        if (dataManager.GetCreate().Insert<Model.History.ComponentDetail>(detail, out addedID, out strErrorMessage) == false)
                                            return false;

                                        detail.compn_hist_detail_sn = addedID;

                                        bool allCheck = true; // 모든 임무가 체크됐는지 확인
                                        SetCheckedMission(nextSection, i, true, ref allCheck);
                                    }
                                }
                            }
                            else
                            {
                                if (strSopKey.Length > 0)
                                {
                                    if (ProgressMission(dataManager, strSopKey, actionStepData, actionStepHistory, dicSectionDatas, componentType, componentNo, -1, Sop.SopRunStatus.Complete, null, true, false /*이미 다음 Section 찾고 있음*/, out strErrorMessage) == false)
                                        return false;
                                }
                                else
                                {
                                    // 시작 컴포넌트 다음이 바로 자동컴포넌트인 경우 SOP가 m_sopRunDatas 쌓이기 전이기때문에 ComponentHistory 정보를 별도로 넣어줌
                                    string addDescription = "0번째 체크";

                                    Model.History.Component componentHistory = ProgressSOP(dataManager, actionStepHistory, componentNo, componentType, Sop.SopRunStatus.Complete, null, nextSection.Text, addDescription, out strErrorMessage);
                                    if (componentHistory == null)
                                        return false;

                                    int nData = 1;

                                    Model.History.ComponentDetail detail = new Model.History.ComponentDetail();
                                    detail.compn_hist_sn = componentHistory.compn_hist_sn;
                                    detail.data_no = -1;
                                    detail.data_intgr = nData;

                                    int addedID;

                                    if (dataManager.GetCreate().Insert<Model.History.ComponentDetail>(detail, out addedID, out strErrorMessage) == false)
                                        return false;

                                    detail.compn_hist_detail_sn = addedID;

                                    bool allCheck = true; // 모든 임무가 체크됐는지 확인
                                    SetCheckedMission(nextSection, -1, true, ref allCheck);
                                }
                            }

                            if (AutoRunSection(dataManager, strSopKey, actionStepData, actionStepHistory, arrowDatas, dicSectionDatas, componentType, componentNo, userNo, decisionValue, ref keepGoing, out strErrorMessage) == false)
                                return false;

                            if (!keepGoing)
                                break;
                        }
                    }
                }

                keepGoing = false;
            }
            else
            {
                // 종료
                if (componentType == Sop.ComponentType.Endpoint || componentType == Sop.ComponentType.Endpoint - (int)CodeType.ComponentType)
                {
                    if (CloseSOP(dataManager, actionStepHistory, out strErrorMessage) == false)
                        return false;
                }
            }

            strErrorMessage = null;
            return true;
        }

        /// <summary>
        /// SOP를 종료상태로 만든다
        /// </summary>
        /// <param name="data"></param>
        /// <returns></returns>
        public bool CloseSOP(IDataManager dataManager, Model.History.ActionStep actionStepHistory, out string strErrorMessage)
        {
            return CloseActionStepHistory(dataManager, actionStepHistory, DateTime.Now, null, null, out strErrorMessage);
        }

        /// <summary>
        /// SdmsAlarmCurrent 테이블 SopStatus 업데이트
        /// SOP 실행 상태를 업데이트 한다
        /// </summary>
        private bool SetAlarmSopStatus(int sensorZoneHistoryNo, int sopStatus, int? userNo, IDataManager dataManager, out string strErrorMessage)
        {
            // 센서 신호로 실행된 SOP라면 SensorZoneHistoryNo가 있다.
            // 해당 SOP가 실행중임을 DB에 기록한다
            Dictionary<Current.Fields, object> dicSets = new Dictionary<Current.Fields, object>();
            dicSets.Add(Current.Fields.sop_sttus_code, sopStatus);
            dicSets.Add(Current.Fields.user_sn, userNo);

            string strCondition = string.Format("{0} = {1}", Current.Fields.sensor_zone_hist_sn, sensorZoneHistoryNo);
            return dataManager.GetUpdate().Update<Current, Current.Fields>(dicSets, strCondition, out strErrorMessage);
        }

        private void SetCheckedMission(SectionData sectionData, int dataIndex, bool isChecked, ref bool allCheck)
        {
            // 프로세스 컴포넌트는 여러 개의 Mission이 있으므로 모든 Mission이 체크됐는지 확인한다.
            if (sectionData.Component.compn_code == Sop.ComponentType.Process || sectionData.Component.compn_code == Sop.ComponentType.Process - (int)CodeType.ComponentType)
            {
                if (dataIndex < 0) // 임무 Mission이 하나도 없을때
                    allCheck = isChecked;
                else
                {
                    sectionData.ProcessData.Missions[dataIndex].Checked = isChecked;

                    foreach (ProcessMissionEx mission in sectionData.ProcessData.Missions)
                    {
                        if (mission.Checked == null || mission.Checked == false)
                        {
                            allCheck = false;
                            break;
                        }
                    }
                }
            }
            else
            {
                sectionData.Checked = isChecked;
                if (!isChecked)
                    allCheck = false;
            }

            sectionData.Checked = allCheck;
        }

        public bool ProgressMission(IDataManager dataManager, string strSopKey, ActionStepData actionStepData, Model.History.ActionStep actionStepHistory, Dictionary<int, SectionData> dicSectionDatas, int componentType, int componentNo, int dataIndex, int componentStatus, int? userNo, bool isChecked, bool findNextAutoSection, out string strErrorMessage)
        {
            strErrorMessage = null;

            try
            {
                if (actionStepData == null)
                    return false;

                if (actionStepData.StepMemberDatas == null || actionStepData.StepMemberDatas.Count == 0)
                    return false;

                StepMemberData stepMemberData = actionStepData.StepMemberDatas[0];

                foreach (SectionData section in stepMemberData.Sections)
                {
                    if (section.Component.compn_sn == componentNo && section.Component.compn_code == componentType)
                    {
                        string addDescription = (dataIndex + 1) + "번째";
                        if (isChecked)
                            addDescription += " 체크";
                        else
                            addDescription += " 체크 해제";

                        Model.History.Component componentHistory = ProgressSOP(dataManager, actionStepHistory, componentNo, componentType, componentStatus, userNo, section.Text, addDescription, out strErrorMessage);

                        if (componentHistory == null)
                            return false;

                        int nData = (isChecked == true) ? 1 : 0;

                        Model.History.ComponentDetail detail = new Model.History.ComponentDetail();
                        detail.compn_hist_sn = componentHistory.compn_hist_sn;
                        detail.data_no = dataIndex;
                        detail.data_intgr = nData;

                        int addedID;

                        if (dataManager.GetCreate().Insert<Model.History.ComponentDetail>(detail, out addedID, out strErrorMessage) == false)
                            return false;

                        detail.compn_hist_detail_sn = addedID;

                        bool allCheck = true; // 모든 임무가 체크됐는지 확인
                        SetCheckedMission(section, dataIndex, isChecked, ref allCheck);

                        // 모든 상세임무 체크한 경우 현재 임무는 완료 처리, 다음 임무를 찾아서 실행중 처리 해준다
                        if (allCheck && isChecked && findNextAutoSection)
                        {
                            if (CheckAutoSection(dataManager, actionStepData, stepMemberData.Arrows, dicSectionDatas, componentType, componentNo, Sop.SopRunStatus.Complete, section.Text, userNo, null, actionStepHistory, strSopKey, out strErrorMessage) == false)
                                return false;
                        }

                        break;
                    }
                }

                return true;
            }
            catch (Exception ex)
            {
                System.Diagnostics.Trace.WriteLine(ex.Message);
            }

            return false;
        }

        private bool IsMissionProcess(SectionData sectionData)
        {
            if (sectionData.Process != null && sectionData.Component is ProcessData)
            {
                ProcessData processData = (ProcessData)sectionData.Component;

                if (processData.Missions != null && processData.Missions.Count > 0)
                    return true;
            }

            return false;
        }

        private List<SectionData> GetNextSection(List<ArrowData> arrowDatas, Dictionary<int, SectionData> dicSectionDatas, int componentType, int componentNo, DecisionValue decisionValue)
        {
            List<SectionData> result = new List<SectionData>();

            int curComponentType = componentType;
            int curComponentNo = componentNo;

            int arrowCount = arrowDatas.Count;

            for (var i = 0; i < arrowCount; i++)
            {
                ArrowData arrowData = arrowDatas[i];

                int beginComponentNo = arrowData.Arrow.begin_compn_sn;
                int endComponentNo = arrowData.Arrow.end_compn_sn;

                if (curComponentNo == beginComponentNo)
                {
                    SectionData endSectionData = GetSectionData(arrowData.Arrow.end_compn_sn, dicSectionDatas);

                    if (endSectionData == null)
                        continue;

                    // 설명으로 이어진 화살표는 패스
                    if (endSectionData.Component.compn_code == Sop.ComponentType.Comment || endSectionData.Component.compn_code == Sop.ComponentType.Comment - (int)CodeType.ComponentType || endSectionData.Comment != null)
                        continue;

                    // 판단문은 분기에 맞춰 다음 임무로 진행한다
                    if (componentType == Sop.ComponentType.Decision || componentType == Sop.ComponentType.Decision - (int)CodeType.ComponentType)
                    {
                        if (decisionValue == null || decisionValue.ArrowNo != arrowData.ArrowNo)
                            continue;
                    }

                    foreach (KeyValuePair<int, SectionData> pair in dicSectionDatas)
                    {
                        if (pair.Value.Component.compn_code == endSectionData.Component.compn_code && pair.Value.Component.compn_sn == endSectionData.Component.compn_sn)
                        {
                            // 다음 임무 추출
                            result.Add(pair.Value);
                            break;
                        }
                    }
                }
            }

            if (result.Count > 0)
                return result;

            if (componentType != Sop.ComponentType.Endpoint && componentType != Sop.ComponentType.Endpoint - (int)CodeType.ComponentType)
            {
                int nextSectionNumber = -1;

                foreach (KeyValuePair<int, SectionData> pair in dicSectionDatas)
                {
                    if (pair.Value.Component.compn_sn == componentNo && pair.Value.Component.compn_code == componentType)
                    {
                        if (pair.Value.SectionNumber == null)
                            break;

                        nextSectionNumber = (int)pair.Value.SectionNumber + 1;
                        continue;
                    }

                    if (nextSectionNumber > 0 && pair.Value.SectionNumber != null && (int)pair.Value.SectionNumber == nextSectionNumber)
                        result.Add(pair.Value);
                }
            }

            return result;
        }

        private SectionData GetSectionData(int componentNo, Dictionary<int, SectionData> dicSectionDatas)
        {
            SectionData sectionData = null;

            if (dicSectionDatas.TryGetValue(componentNo, out sectionData))
                return sectionData;

            return null;
        }

        private Model.History.Component ProgressSOP(IDataManager dataManager, Model.History.ActionStep actionStepHistory, int componentNo, int componentType, int status, int? userNo, string text, string addDescription, out string strErrorMessage)
        {
            string strDescription = GetStringStatus(componentType, status, text);
            if (addDescription != null && addDescription.Length > 0)
                strDescription += "_" + addDescription;

            strDescription = strDescription.Replace("'", "''");
            DateTime dtNow = DateTime.Now;

            Model.History.Component componentHistory = HistoryManager.AddComponentHistory(dataManager, actionStepHistory.action_step_hist_sn, componentNo, dtNow, status, userNo, strDescription, out strErrorMessage);

            //Model.History.Component componentHistory = InsertComponentHistory(dataManager, actionStepHistory.action_step_hist_sn, componentNo, dtNow, status, null, userNo, strDescription, out strErrorMessage);

            if (componentHistory == null)
                return null;

            if (IsClosingEvent(dataManager, componentNo, componentType, status))
            {
                if (CloseSOP(dataManager, actionStepHistory, out strErrorMessage) == false)
                    return null;
            }

            actionStepHistory.last_acces_time = dtNow;

            if (dataManager.GetUpdate().Update<Model.History.ActionStep>(actionStepHistory, null, out strErrorMessage) == false)
                return null;

            return componentHistory;
        }

        private bool IsClosingEvent(IDataManager dataManager, int componentNo, int componentType, int status)
        {
            if (componentType == Sop.ComponentType.Endpoint || componentType == Sop.ComponentType.Endpoint - (int)CodeType.ComponentType)
            {
                if (status == Sop.SopRunStatus.Complete)
                {
                    string strErrorMessage;
                    string strCondition = string.Format("{0} = {1}", Endpoint.Fields.compn_sn, componentNo);
                    Endpoint endpoint = dataManager.GetSelect().SelectFirst<Endpoint>(strCondition, out strErrorMessage);

                    if (endpoint != null && endpoint.begin_yn == false)
                        return true;
                }
            }

            return false;
        }

        private string GetStringStatus(int componentType, int nStatus, string text)
        {
            string strType = "";
            if (componentType == Sop.ComponentType.Process || componentType == Sop.ComponentType.Process - (int)CodeType.ComponentType)
                strType = "Process";
            else if (componentType == Sop.ComponentType.Decision || componentType == Sop.ComponentType.Decision - (int)CodeType.ComponentType)
                strType = "Decision";
            else if (componentType == Sop.ComponentType.Endpoint || componentType == Sop.ComponentType.Endpoint - (int)CodeType.ComponentType)
                strType = "EndPoint";
            else if (componentType == Sop.ComponentType.Transmission || componentType == Sop.ComponentType.Transmission - (int)CodeType.ComponentType)
                strType = "Transmission";

            string strStatus = GetSOPRunStatus(nStatus);

            string strDescription = string.Format("{0}_{1}_{2}", strType, text, strStatus);
            return strDescription;
        }

        public static string GetSOPRunStatus(int sopRunStatus)
        {
            string strStatus = "";

            if (sopRunStatus == Sop.SopRunStatus.Normal || sopRunStatus == Sop.SopRunStatus.Normal - (int)CodeType.SopRunStatus)
                strStatus = "대기상태";
            else if (sopRunStatus == Sop.SopRunStatus.InProgress || sopRunStatus == Sop.SopRunStatus.InProgress - (int)CodeType.SopRunStatus)
                strStatus = "실행중";
            else if (sopRunStatus == Sop.SopRunStatus.Complete || sopRunStatus == Sop.SopRunStatus.Complete - (int)CodeType.SopRunStatus)
                strStatus = "완료";
            else if (sopRunStatus == Sop.SopRunStatus.Wait || sopRunStatus == Sop.SopRunStatus.Wait - (int)CodeType.SopRunStatus)
                strStatus = "입력대기";
            else if (sopRunStatus == Sop.SopRunStatus.Skip || sopRunStatus == Sop.SopRunStatus.Skip - (int)CodeType.SopRunStatus)
                strStatus = "건너뜀";

            return strStatus;
        }

        /// <summary>
        /// SOP를 실행상태로 만든다
        /// </summary>
        /// oldActionStepHistory : 새로 실행된 actionStepHistory는 아니고, 같은 SensroZoneHistory에 대하여 이미 기존에 실행되어 있는 ActionStepHistory
        private Model.History.ActionStep ExcuteSOP(IDataManager dataManager, DateTime? beginTime, int actionStepNo, string position, int? userNo, int? sensorZoneHistoryNo, out Model.History.ActionStep oldActionStepHistory, out string strErrorMessage)
        {
            strErrorMessage = null;
            oldActionStepHistory = null;

            if (sensorZoneHistoryNo != null)
            {
                string strCondition = string.Format("{0} = {1} and {2} = {3}",
                    Model.History.ActionStep.Fields.action_step_sn, actionStepNo,
                    Model.History.ActionStep.Fields.sensor_zone_hist_sn, (int)sensorZoneHistoryNo);

                // 중복 실행 방지
                IEnumerable<Model.History.ActionStep> actionStepHistories = dataManager.GetSelect().Select<Model.History.ActionStep>(strCondition, out strErrorMessage);

                if (actionStepHistories == null)
                    return null;

                foreach (var _actionStepHistory in actionStepHistories)
                {
                    oldActionStepHistory = _actionStepHistory;
                    return null;
                }
            }

            DateTime timeStamp = beginTime == null ? DateTime.Now : (DateTime)beginTime;

            Model.History.ActionStep actionStepHistory = new Model.History.ActionStep();

            actionStepHistory.action_step_sn = actionStepNo;
            actionStepHistory.begin_time = timeStamp;
            actionStepHistory.lc = position;
            actionStepHistory.user_sn = userNo;
            actionStepHistory.sensor_zone_hist_sn = sensorZoneHistoryNo;

            int actionStepHistoryNo;

            if (dataManager.GetCreate().Insert<Model.History.ActionStep>(actionStepHistory, out actionStepHistoryNo, out strErrorMessage) == false)
                return null;

            actionStepHistory.action_step_hist_sn = actionStepHistoryNo;
            return actionStepHistory;
        }

        private List<ComponentHistoryEx> ReadComponentHistories(Dictionary<int, ActionStepHistoryData> dicActionStepHistoryDatas, List<RequestCurrentHistory.ActionStepHistoryData> actionStepHistoryDatas/*int? lastComponentHistoryNo*//*, out int maxComponentHistoryNo*/, out string strErrorMessage)
        {
            strErrorMessage = null;
            //maxComponentHistoryNo = -1;
            string strCondition = null;

            if (actionStepHistoryDatas != null && actionStepHistoryDatas.Count > 0)
            {
                Dictionary<int, RequestCurrentHistory.ActionStepHistoryData> dicSource = new Dictionary<int, RequestCurrentHistory.ActionStepHistoryData>();

                foreach (var actionStepHistoryData in actionStepHistoryDatas)
                {
                    dicSource[actionStepHistoryData.ActionStepHistoryNo] = actionStepHistoryData;
                }

                foreach (KeyValuePair<int, ActionStepHistoryData> pair in dicActionStepHistoryDatas)
                {
                    RequestCurrentHistory.ActionStepHistoryData actionStepHistoryData = null;
                    dicSource.TryGetValue(pair.Key, out actionStepHistoryData);

                    string str = "";

                    if (actionStepHistoryData != null)
                    {
                        if (actionStepHistoryData.LastComponentHistoryNo != null)
                        {
                            str = string.Format("({0} = {1} and {2} > {3})",
                                Model.History.Component.Fields.action_step_hist_sn, actionStepHistoryData.ActionStepHistoryNo,
                                Model.History.Component.Fields.compn_hist_sn, actionStepHistoryData.LastComponentHistoryNo);
                        }
                        else
                        {
                            str = string.Format("({0} = {1})",
                                Model.History.Component.Fields.action_step_hist_sn, actionStepHistoryData.ActionStepHistoryNo);
                        }
                    }
                    else
                    {
                        str = string.Format("({0} = {1})",
                            Model.History.Component.Fields.action_step_hist_sn, pair.Key);
                    }

                    if (strCondition == null)
                        strCondition = str;
                    else
                        strCondition += " or " + str;
                }
            }

            // 현재 실행중인 SOP 정보만 얻어온다.
            if (strCondition == null)
            {
                strCondition = string.Format("{0} in (Select {1} from {2} where {3} is null)",
                    Base.Model.History.Component.Fields.action_step_hist_sn,
                    Base.Model.History.ActionStep.Fields.action_step_hist_sn,
                    Base.Model.History.ActionStep.TableName,
                    Base.Model.History.ActionStep.Fields.end_time);
            }
            else
            {
                strCondition = string.Format("({0}) and {1} in (Select {2} from {3} where {4} is null)",
                    strCondition,
                    Base.Model.History.Component.Fields.action_step_hist_sn,
                    Base.Model.History.ActionStep.Fields.action_step_hist_sn,
                    Base.Model.History.ActionStep.TableName,
                    Base.Model.History.ActionStep.Fields.end_time);
            }

            /*if (lastComponentHistoryNo > 0)
                strCondition = string.Format("{0} > {1}", Model.History.Component.Fields.compn_hist_sn, lastComponentHistoryNo);*/

            JoinManager joinManager = new JoinManager(m_dataManager);
            ArrayList arrDatas = joinManager.JoinComponentHistoryComponent(strCondition, out strErrorMessage);

            if (arrDatas == null)
                return null;

            string strComponentHistoryDetailCondition = strCondition == null ? null : string.Format("Select {0} from {1} where {2}", Base.Model.History.Component.Fields.compn_hist_sn, Base.Model.History.Component.TableName, strCondition);

            int nDataCount = arrDatas.Count;
            List<ComponentHistoryEx> componentHistories = new List<ComponentHistoryEx>();

            string strComponentHistoryNos = null;
            Dictionary<int, ComponentHistoryEx> dicComponentHistories = new Dictionary<int, ComponentHistoryEx>();

            for (int i=0;i<nDataCount-1;i+=2)
            {
                if (arrDatas[i] is Model.History.Component && arrDatas[i + 1] is Component)
                {
                    Model.History.Component componentHistory = (Model.History.Component)arrDatas[i];
                    Component component = (Component)arrDatas[i + 1];

                    ComponentHistoryEx history = new ComponentHistoryEx(componentHistory, component.compn_code);
                    componentHistories.Add(history);

                    if (strComponentHistoryNos == null)
                        strComponentHistoryNos = history.compn_hist_sn.ToString();
                    else
                        strComponentHistoryNos += "," + history.compn_hist_sn.ToString();

                    dicComponentHistories[history.compn_hist_sn] = history;
                }
            }

            if (AddComponentHistoryDetails(m_dataManager, strComponentHistoryDetailCondition, dicComponentHistories, out strErrorMessage) == false)
                return null;

            /*IEnumerable<Model.History.Component> componentHistories = m_dataManager.GetSelect().Select<Model.History.Component>(strCondition, out strErrorMessage);

            if (componentHistories == null)
                return null;*/

            /*foreach (var componentHistory in componentHistories)
            {
                if (dicActionStepHistoryDatas.ContainsKey(componentHistory.action_step_hist_sn))
                {
                    if (componentHistory.compn_hist_sn > maxComponentHistoryNo)
                        maxComponentHistoryNo = componentHistory.compn_hist_sn;
                }
            }*/

            return componentHistories;
        }

        private bool AddComponentHistoryDetails(IDataManager dataManager, string strComponentHistoryDetailCondition, Dictionary<int, ComponentHistoryEx> dicComponentHistories, out string strErrorMessage)
        {
            strErrorMessage = null;
            string strCondition = strComponentHistoryDetailCondition == null ? null : string.Format("{0} in ({1})", Model.History.ComponentDetail.Fields.compn_hist_sn, strComponentHistoryDetailCondition);

            IEnumerable<Model.History.ComponentDetail> componentHistoryDetails = m_dataManager.GetSelect().Select<Model.History.ComponentDetail>(strCondition, out strErrorMessage);

            if (componentHistoryDetails == null)
                return false;

            foreach (Model.History.ComponentDetail detailHistory in componentHistoryDetails)
            {
                ComponentHistoryEx componentHistory;

                if (dicComponentHistories.TryGetValue(detailHistory.compn_hist_sn, out componentHistory))
                    componentHistory.ComponentHistoryDetails.Add(detailHistory);
            }

            return true;
        }

        private SOPWaitTimeOption GetSOPWaitTime(IDataManager dataManager, int? siteNo, out string strErrorMessage)
        {
            strErrorMessage = null;
            string strCondition = string.Format("({0} = '{1}' or {0} = '{2}')",
                Model.Common.Option.Fields.prop_name, SOPWaitTimeOption.PropertyName, SOPWaitTimeOption.DefaultPropertyName);

            if (siteNo != null)
                strCondition += string.Format(" and {0} = {1}", Model.Common.Option.Fields.site_sn, (int)siteNo);

            IEnumerable<Model.Common.Option> options = dataManager.GetSelect().Select<Model.Common.Option>(strCondition, out strErrorMessage);

            if (options == null)
                return null;

            Model.Common.Option currentOption = null;
            Model.Common.Option defaultOption = null;

            foreach (var option in options)
            {
                if (string.Compare(option.prop_name, SOPWaitTimeOption.PropertyName, true) == 0)
                    currentOption = option;
                else if (string.Compare(option.prop_name, SOPWaitTimeOption.DefaultPropertyName, true) == 0)
                    defaultOption = option;
            }

            Model.Common.Option targetOption = currentOption == null ? defaultOption : currentOption;

            if (targetOption == null)
                return new SOPWaitTimeOption();

            SOPWaitTimeOption sopOption = new SOPWaitTimeOption(targetOption);

            if (sopOption.IsValid == false)
            {
                strErrorMessage = "SOP 자동종료 옵션 형식이 올바르지 않습니다.";
                return null;
            }

            return sopOption;
        }

        private List<ActionStepHistoryData> GetDefaultActionStepHistoryDatas(SOPManager.IBLL.IProcessManager sopProcessManager, int? siteNo)
        {
            List<ActionStepHistoryData> actionStepHistoryDatas = new List<ActionStepHistoryData>();

            if (siteNo != null)
            {
                ResponseActionStepDatas defaultActionStepDatas = sopProcessManager.RequestDefaultActionStepDatas((int)siteNo);

                if (defaultActionStepDatas.Success)
                {
                    foreach (ActionStepData actionStepData in defaultActionStepDatas.ActionStepDatas)
                    {
                        ActionStepHistoryData actionStepHistoryData = new ActionStepHistoryData();

                        actionStepHistoryData.SiteNo = (int)siteNo;
                        actionStepHistoryData.IsChanged = false;
                        actionStepHistoryData.StepName = actionStepData.StepName;

                        actionStepHistoryDatas.Add(actionStepHistoryData);
                    }

                    return actionStepHistoryDatas;
                }
            }

            actionStepHistoryDatas.Add(MakeDefaultActionStepHistoryData("관심"));
            actionStepHistoryDatas.Add(MakeDefaultActionStepHistoryData("주의"));
            actionStepHistoryDatas.Add(MakeDefaultActionStepHistoryData("경계"));
            actionStepHistoryDatas.Add(MakeDefaultActionStepHistoryData("심각"));
            return actionStepHistoryDatas;
        }

        private ActionStepHistoryData MakeDefaultActionStepHistoryData(string strStepName)
        {
            ActionStepHistoryData actionStepHistoryData = new ActionStepHistoryData();
            actionStepHistoryData.IsChanged = false;
            actionStepHistoryData.StepName = strStepName;
            return actionStepHistoryData;
        }

        private ActionStepHistoryData CopyActionStepHistoryData(ActionStepHistoryData actionStepHistoryData)
        {
            ActionStepHistoryData data = new ActionStepHistoryData();

            data.IsChanged = actionStepHistoryData.IsChanged;
            data.StepName = actionStepHistoryData.StepName;
            data.SiteNo = actionStepHistoryData.SiteNo;

            return data;
        }

        private void SetActionStepHistoryData(ActionStepHistoryDataEx actionStepHistoryDataEx, ActionStepHistoryData actionStepHistoryData)
        {
            for (int i=0;i<actionStepHistoryDataEx.ActionStepDatas.Count;i++)
            {
                ActionStepHistoryData data = actionStepHistoryDataEx.ActionStepDatas[i];

                if (data.StepName == actionStepHistoryData.StepName)
                {
                    actionStepHistoryDataEx.ActionStepDatas.RemoveAt(i);
                    actionStepHistoryDataEx.ActionStepDatas.Insert(i, actionStepHistoryData);
                    break;
                }
            }
        }

        private Dictionary<int, ActionStepHistoryData> ReadActionStepHistories(List<RequestCurrentHistory.ActionStepHistoryData> actionStepHistoryDatas, int? siteNo, List<ActionStepHistoryDataEx> targetActionStepHistoryDatas, SOPManager.IBLL.IProcessManager sopProcessManager, out string strErrorMessage)
        {
            IDataManager dataManager = m_dataManager.Clone();

            if (dataManager.BeginBatch(out strErrorMessage) == false)
            {
                strErrorMessage = "DataBase 트랜잭션을 시작할 수 없습니다.";
                return null;
            }

            // Key : SmallClass No
            Dictionary<int, ActionStepHistoryDataEx> dicTargetActionStepHistoryDatas = new Dictionary<int, ActionStepHistoryDataEx>();
            List<ActionStepHistoryData> defaultActionStepHistoryDatas = GetDefaultActionStepHistoryDatas(sopProcessManager, siteNo);

            SOPWaitTimeOption sopCloseOption = GetSOPWaitTime(dataManager, siteNo, out strErrorMessage);

            if (sopCloseOption == null)
                return RollBack<Dictionary<int, ActionStepHistoryData>>(dataManager, null);

            int maxActionStepHistoryNo = -1;

            string strActionStepHistoryNos = "";

            if (actionStepHistoryDatas != null && actionStepHistoryDatas.Count > 0)
            {
                foreach (var actionStepHistoryData in actionStepHistoryDatas)
                {
                    if (actionStepHistoryData.ActionStepHistoryNo > maxActionStepHistoryNo)
                        maxActionStepHistoryNo = actionStepHistoryData.ActionStepHistoryNo;

                    if (strActionStepHistoryNos.Length == 0)
                        strActionStepHistoryNos = actionStepHistoryData.ActionStepHistoryNo.ToString();
                    else
                        strActionStepHistoryNos += "," + actionStepHistoryData.ActionStepHistoryNo.ToString();
                }
            }

            string strCondition = null;

            if (strActionStepHistoryNos.Length > 0)
                strCondition = string.Format("a.{0} is null and (a.{1} in ({2}) or a.{1} > {3})",
                    Model.History.ActionStep.Fields.end_time,
                    Model.History.ActionStep.Fields.action_step_hist_sn, strActionStepHistoryNos,
                    maxActionStepHistoryNo);
            else
                strCondition = string.Format("a.{0} is null",
                    Model.History.ActionStep.Fields.end_time);

            if (siteNo != null)
            {
                if (strCondition != null)
                    strCondition += string.Format(" and b.{0} = {1}", Model.Sop.Category.Version.Fields.site_sn, siteNo);
                else
                    strCondition = string.Format("b.{0} = {1}", Model.Sop.Category.Version.Fields.site_sn, siteNo);
            }

            JoinManager joinManager = new JoinManager(dataManager);
            ArrayList arrDatas = joinManager.JoinActionStepHistoryActionStepVersionLargeClassMiddleClassSmallClass(strCondition, out strErrorMessage);

            if (arrDatas == null)
                return RollBack<Dictionary<int, ActionStepHistoryData>>(dataManager, null);

            // Key : ActionStepHistoryNo
            Dictionary<int, ActionStepHistoryData> dicActionStepHistoryDatas = new Dictionary<int, ActionStepHistoryData>();
            int nDataCount = arrDatas.Count;
            int oldMaxNo = maxActionStepHistoryNo;

            for (int i = 0; i < nDataCount - 5; i += 6)
            {
                if (arrDatas[i] is Model.History.ActionStep && arrDatas[i + 1] is ActionStep && arrDatas[i + 2] is Model.Sop.Category.Version && arrDatas[i + 3] is LargeClass && arrDatas[i + 4] is MiddleClass && arrDatas[i + 5] is SmallClass)
                {
                    Model.History.ActionStep actionStepHistory = (Model.History.ActionStep)arrDatas[i];
                    ActionStep actionStep = (ActionStep)arrDatas[i + 1];
                    Model.Sop.Category.Version version = (Model.Sop.Category.Version)arrDatas[i + 2];
                    LargeClass largeClass = (LargeClass)arrDatas[i + 3];
                    MiddleClass middleClass = (MiddleClass)arrDatas[i + 4];
                    SmallClass smallClass = (SmallClass)arrDatas[i + 5];
                    SOPWaitTimeOption option;
                    SOPWaitTimeOption.EndOptions closeOption = SOPWaitTimeOption.CheckSopCloseOption(actionStepHistory, sopCloseOption, out option);

                    if (closeOption == SOPWaitTimeOption.EndOptions.AutoClose)
                    {
                        DateTime dtNow = DateTime.Now;
                        string strDescription = HistoryManager.GetAutoCloseDescription(dtNow, actionStepHistory.last_acces_time, option);

                        if (CloseActionStepHistory(dataManager, actionStepHistory, dtNow, null, strDescription, out strErrorMessage) == false)
                            return RollBack<Dictionary<int, ActionStepHistoryData>>(dataManager, null);

                        continue;
                    }

                    ActionStepHistoryDataEx actionStepHistoryDataEx;

                    if (dicTargetActionStepHistoryDatas.TryGetValue(smallClass.sclas_sn, out actionStepHistoryDataEx) == false)
                    {
                        actionStepHistoryDataEx = new ActionStepHistoryDataEx();
                        dicTargetActionStepHistoryDatas[smallClass.sclas_sn] = actionStepHistoryDataEx;

                        foreach (ActionStepHistoryData defaultActionStepHistoryData in defaultActionStepHistoryDatas)
                        {
                            actionStepHistoryDataEx.ActionStepDatas.Add(CopyActionStepHistoryData(defaultActionStepHistoryData));
                        }
                    }

                    if (actionStepHistory.action_step_hist_sn > maxActionStepHistoryNo)
                        maxActionStepHistoryNo = actionStepHistory.action_step_hist_sn;

                    ActionStepHistoryData actionStepHistoryData = new ActionStepHistoryData();
                    actionStepHistoryData.ActionStepHistory = actionStepHistory;
                    actionStepHistoryData.SiteNo = version.site_sn;
                    // 새로운 ActionStepHistory인가?
                    actionStepHistoryData.IsChanged = actionStepHistory.action_step_hist_sn > oldMaxNo;
                    actionStepHistoryData.SopKey = ActionStepHistoryData.MakeSopKey(largeClass.lclas_sn, middleClass.mclas_sn, smallClass.sclas_sn);
                    actionStepHistoryData.ActionStep = actionStep;
                    actionStepHistoryData.StepName = actionStep.action_step_name;

                    SetActionStepHistoryData(actionStepHistoryDataEx, actionStepHistoryData);
                    dicActionStepHistoryDatas[actionStepHistory.action_step_hist_sn] = actionStepHistoryData;

                    if (closeOption == SOPWaitTimeOption.EndOptions.ConfirmNClose)
                        actionStepHistoryData.ConfirmTimeoutCloseSOP = true;
                }
            }

            if (dataManager.BatchCommit(out strErrorMessage) == false)
            {
                dataManager.BatchRollback(out strErrorMessage);
                strErrorMessage = "시스템 데이터베이스의 트랜잭션이 정상적으로 종료되지 못하였습니다.";
                return null;
            }

            targetActionStepHistoryDatas.AddRange(dicTargetActionStepHistoryDatas.Values);
            return dicActionStepHistoryDatas;
        }

        private IEnumerable<ActionStepHistoryData> MakeActionStepHistoryDatas(Dictionary<int, ActionStepHistoryData> dicActionStepHistoryDatas, IEnumerable<ComponentHistoryEx> componentHistories, List<RequestCurrentHistory.ActionStepHistoryData> actionStepHistoryDatas)
        {
            Dictionary<int, RequestCurrentHistory.ActionStepHistoryData> dicSource = new Dictionary<int, RequestCurrentHistory.ActionStepHistoryData>();

            if (actionStepHistoryDatas != null)
            {
                foreach (var _actionStepHistoryData in actionStepHistoryDatas)
                {
                    dicSource[_actionStepHistoryData.ActionStepHistoryNo] = _actionStepHistoryData;
                }
            }

            ActionStepHistoryData actionStepHistoryData;

            foreach (var componentHistory in componentHistories)
            {
                if (dicActionStepHistoryDatas.TryGetValue(componentHistory.action_step_hist_sn, out actionStepHistoryData))
                {
                    actionStepHistoryData.ComponentHistories.Add(componentHistory);
                }

                RequestCurrentHistory.ActionStepHistoryData _actionStepHistoryData;

                if (dicSource.TryGetValue(componentHistory.action_step_hist_sn, out _actionStepHistoryData))
                {
                    if (_actionStepHistoryData.LastComponentHistoryNo != null)
                    {
                        if (_actionStepHistoryData.LastComponentHistoryNo < componentHistory.compn_hist_sn)
                            actionStepHistoryData.IsChanged = true;
                    }
                    else
                        actionStepHistoryData.IsChanged = true;
                }
            }

            /*foreach (KeyValuePair<int, ActionStepHistoryData> pair in dicActionStepHistoryDatas)
            {
                pair.Value.ComponentHistories.Sort();
            }*/

            return dicActionStepHistoryDatas.Values;
        }

        public MessageResult CloseSOPByUser(RequestCloseSOP data, IDataManager dataManager = null)
        {
            bool transaction = true;

            if (dataManager == null)
                dataManager = m_dataManager.Clone();
            else
                transaction = false;

            string strCondition = string.Format("{0} = {1}", Model.History.ActionStep.Fields.action_step_hist_sn, data.ActionStepHistoryNo);

            string strErrorMessage = null;
            Model.History.ActionStep actionStepHistory = dataManager.GetSelect().SelectFirst<Model.History.ActionStep>(strCondition, out strErrorMessage);

            if (actionStepHistory == null)
            {
                if (strErrorMessage == null)
                    return new MessageResult(false, "유효하지 않은 ActionStepHistoryNo입니다.");
                else
                    return new MessageResult(false, strErrorMessage);
            }

            //IDataManager dataManager = m_dataManager.Clone();

            if (transaction)
            {
                if (dataManager.BeginBatch(out strErrorMessage) == false)
                    return new MessageResult(false, "DataBase 트랜잭션을 시작할 수 없습니다.");
            }

            DateTime endTime = data.EndTime == null ? DateTime.Now : (DateTime)data.EndTime;

            if (CloseActionStepHistory(dataManager, actionStepHistory, endTime, data.LastAccessedUserNo, null, out strErrorMessage) == false)
            {
                if (transaction)
                {
                    string strTemp;
                    dataManager.BatchRollback(out strTemp);
                }

                return new MessageResult(false, strErrorMessage);
            }

            if (transaction)
            {
                if (dataManager.BatchCommit(out strErrorMessage) == false)
                {
                    string strTemp;
                    dataManager.BatchRollback(out strTemp);
                    return new MessageResult(false, strErrorMessage);
                }
            }

            return new MessageResult(true, "");
        }

        private bool CloseActionStepHistory(IDataManager dataManager, Model.History.ActionStep actionStepHistory, DateTime endTime, int? lastAccessedUserNo, string description, out string strErrorMessage)
        {
            Dictionary<Model.History.ActionStep.Fields, object> dicSets = new Dictionary<Model.History.ActionStep.Fields, object>();
            dicSets[Model.History.ActionStep.Fields.end_time] = endTime;

            if (lastAccessedUserNo != null)
                dicSets[Model.History.ActionStep.Fields.user_sn] = lastAccessedUserNo;

            if (description != null)
                dicSets[Model.History.ActionStep.Fields.descp] = description;

            string strCondition = string.Format("{0} = {1}", Model.History.ActionStep.Fields.action_step_hist_sn, actionStepHistory.action_step_hist_sn);

            if (dataManager.GetUpdate().Update<Model.History.ActionStep, Model.History.ActionStep.Fields>(dicSets, strCondition, out strErrorMessage) == false)
                return false;

            actionStepHistory.end_time = endTime;

            if (lastAccessedUserNo != null)
                actionStepHistory.user_sn = lastAccessedUserNo;

            if (description != null)
                actionStepHistory.descp = description;

            if (actionStepHistory.sensor_zone_hist_sn != null && actionStepHistory.sensor_zone_hist_sn > 0)
                return SetAlarmSopStatus((int)actionStepHistory.sensor_zone_hist_sn, History.SopStatus.FinishSOP, null, dataManager, out strErrorMessage);

            strErrorMessage = null;
            return true;
        }

        /// <summary>
        /// 단계 격상
        /// </summary>
        public MessageResult NextActionStep(RequestNextActionStep data, SOPManager.IBLL.IProcessManager sopProcessManager)
        {
            IDataManager dataManager = m_dataManager.Clone();

            string strErrorMessage;
            string strCondition = string.Format("{0} = {1}", ActionStep.Fields.sclas_sn, data.SmallClassNo);

            JoinManager joinManager = new JoinManager(dataManager);
            ArrayList arrDatas = joinManager.JoinActionStepActionStepHistory(strCondition, out strErrorMessage);

            if (arrDatas == null)
                return new MessageResult(false, strErrorMessage);

            int nDataCount = arrDatas.Count;

            // Key : ActionStepNo
            // Value : 실행중인 SOP가 있으면 ActionStepHistory. 없으면 null
            Dictionary<int, Model.History.ActionStep> dicActionStepHistories = new Dictionary<int, Model.History.ActionStep>();

            for (int i=0;i<nDataCount-1;i+=2)
            {
                if (arrDatas[i] is ActionStep && (arrDatas[i + 1] == null || arrDatas[i + 1] is Model.History.ActionStep))
                {
                    ActionStep actionStep = (ActionStep)arrDatas[i];
                    Model.History.ActionStep actionStepHistory = (Model.History.ActionStep)arrDatas[i + 1];

                    dicActionStepHistories[actionStep.action_step_sn] = actionStepHistory;
                }
            }

            IEnumerable<ActionStepData> actionStepDatas = sopProcessManager.ReadActionSteps(dataManager, data.SmallClassNo.ToString(), out strErrorMessage);

            if (actionStepDatas == null)
                return new MessageResult(false, strErrorMessage);

            if (dataManager.BeginBatch(out strErrorMessage) == false)
                return new MessageResult(false, "DataBase 트랜잭션을 시작할 수 없습니다.");

            string strPosition = null;

            foreach (ActionStepData actionStepData in actionStepDatas)
            {
                if (actionStepData.ActionStep == null)
                    continue;

                Model.History.ActionStep actionStepHistory;

                if (dicActionStepHistories.TryGetValue(actionStepData.ActionStep.action_step_sn, out actionStepHistory))
                {
                    if (actionStepHistory == null)
                    {
                        if (actionStepData.ActionStep.action_step_sn == data.NextActionStepNo)
                        {
                            if (BeginSOP(DateTime.Now, actionStepData.ActionStep.action_step_sn, actionStepData, strPosition, data.AccessedUserNo, data.SensorZoneHistoryNo, data.DecisionValue, dataManager, false, out strErrorMessage) == null)
                            {
                                string strTemp;
                                dataManager.BatchRollback(out strTemp);
                                return new MessageResult(false, strErrorMessage);
                            }
                        }
                    }
                    else
                    {
                        if (actionStepData.ActionStep.action_step_sn == data.PrevActionStepNo)
                        {
                            actionStepHistory.user_sn = data.AccessedUserNo;

                            if (CloseSOP(dataManager, actionStepHistory, out strErrorMessage) == false)
                            {
                                string strTemp;
                                dataManager.BatchRollback(out strTemp);
                                return new MessageResult(false, strErrorMessage);
                            }
                        }

                        strPosition = actionStepHistory.lc;
                    }
                }
            }

            if (dataManager.BatchCommit(out strErrorMessage) == false)
            {
                string strTemp;
                dataManager.BatchRollback(out strTemp);
                return new MessageResult(false, "DataBase 트랜잭션을 정상적으로 종료할 수 없습니다.");
            }

            return new MessageResult(true, "");
        }

        public MessageResult RunSection(RequestProgressSOP data, SOPManager.IBLL.IProcessManager sopProcessManager, IDataManager dataManager = null)
        {
            string strErrorMessage;
            bool transaction = true;

            if (dataManager == null)
                dataManager = m_dataManager.Clone();
            else
                transaction = false;

            if (transaction)
            {
                if (dataManager.BeginBatch(out strErrorMessage) == false)
                    return new MessageResult(false, "시스템 데이터베이스의 트랜잭션을 시작할 수 없습니다.");
            }

            if (data.ActionStepHistoryNo == null)
            {
                ActionStepData actionStepData = sopProcessManager.ReadActionStep(dataManager, data.ActionStepNo, out strErrorMessage);

                if (actionStepData == null)
                    return new MessageResult(false, strErrorMessage);

                if (BeginSOP(DateTime.Now, data.ActionStepNo, actionStepData, null, data.AccessedUserNo, data.SensorZoneHistoryNo, data.DecisionValue, dataManager, !transaction, out strErrorMessage) == null)
                    return new MessageResult(false, strErrorMessage);
            }
            else
            {
                /*string strCondition = string.Format("{1} = (Select max({1}) from {0} where {2} = {3})",
                    Model.History.Component.TableName,
                    Model.History.Component.Fields.compn_hist_sn,
                    Model.History.Component.Fields.action_step_hist_sn, (int)data.ActionStepHistoryNo);

                Model.History.Component currentComponentHistory = dataManager.GetSelect().SelectFirst<Model.History.Component>(strCondition, out strErrorMessage);

                if (currentComponentHistory == null)
                {
                    if (strErrorMessage == null)
                        strErrorMessage = "아직 SOP가 실행되지 않았습니다.";

                    return new MessageResult(false, strErrorMessage);
                }*/

                //if (currentComponentHistory.compn_sn == data.ComponentNo)
                {
                    // 현재 임무의 다음 버튼을 눌려졌음
                    if (ProcessNext(dataManager, (int)data.ActionStepHistoryNo, data.ActionStepNo, data.ComponentNo, data.ComponentType, data.AccessedUserNo, data.SensorZoneHistoryNo, null, data.DecisionValue, sopProcessManager, out strErrorMessage) == false)
                    {
                        if (transaction)
                        {
                            string strTemp;
                            dataManager.BatchRollback(out strTemp);
                            return new MessageResult(false, strErrorMessage);
                        }
                    }
                }
                
                if (transaction)
                {
                    if (dataManager.BatchCommit(out strErrorMessage) == false)
                    {
                        string strTemp;
                        dataManager.BatchRollback(out strTemp);
                        return new MessageResult(false, "시스템 데이터베이스의 트랜잭션이 정상적으로 종료되지 못하였습니다.");
                    }
                }
            }

            return new MessageResult(true, "");
        }

        private bool ProcessNext(IDataManager dataManager, int actionStepHistoryNo, int actionStepNo, int componentNo, int componentType, int? userNo, int? sensorZoneHistoryNo, bool? allChecked, DecisionValue decisionValue, SOPManager.IBLL.IProcessManager sopProcessManager, out string strErrorMessage)
        {
            strErrorMessage = null;

            if (allChecked == null)
                allChecked = GetAllMissionsChecked(dataManager, actionStepHistoryNo, componentNo, componentType, null, out strErrorMessage);

            if (strErrorMessage != null)
                return false;

            int runStatus = GetRunStatus(componentType, (bool)allChecked);
            string strDescription = GetComponentHistoryDescription(componentType, runStatus, null, null, decisionValue);
            Model.History.Component componentHistory = HistoryManager.AddComponentHistory(dataManager, actionStepHistoryNo, componentNo, DateTime.Now, runStatus, userNo, strDescription, out strErrorMessage);

            if (componentHistory == null)
                return false;

            if (IsClosingEvent(dataManager, componentNo, componentType, runStatus))
            {
                RequestCloseSOP data = new RequestCloseSOP();
                data.ActionStepHistoryNo = actionStepHistoryNo;
                data.LastAccessedUserNo = userNo;

                MessageResult result = CloseSOPByUser(data, dataManager);

                if (result.Success == false)
                {
                    strErrorMessage = result.Message;
                    return false;
                }
            }
            else
            {
                if (CheckAutoSection(dataManager, actionStepHistoryNo, actionStepNo, componentNo, componentType, userNo, sensorZoneHistoryNo, decisionValue, sopProcessManager, out strErrorMessage) == false)
                    return false;
            }

            return true;
        }

        private int GetRunStatus(int componentType, bool allChecked)
        {
            if (componentType == Sop.ComponentType.Process || componentType == Sop.ComponentType.Process - (int)CodeType.ComponentType ||
                componentType == Sop.ComponentType.Transmission || componentType == Sop.ComponentType.Transmission - (int)CodeType.ComponentType)
                return allChecked ? Sop.SopRunStatus.Complete : Sop.SopRunStatus.Skip;

            return Sop.SopRunStatus.Complete;
        }

        private bool CheckAutoSection(IDataManager dataManager, int actionStepHistoryNo, int actionStepNo, int componentNo, int componentType, int? userNo, int? sensorZoneHistoryNo, DecisionValue decisionValue, SOPManager.IBLL.IProcessManager sopProcessManager, out string strErrorMessage)
        {
            List<SectionData> nextSectionDatas = FlowManager.GetNextSections(dataManager, componentNo, decisionValue, sopProcessManager, out strErrorMessage);

            if (nextSectionDatas == null)
                return false;

            foreach (SectionData sectionData in nextSectionDatas)
            {
                if (sectionData.AutoRun == true)
                {
                    RequestProgressSOP data = new RequestProgressSOP();
                    data.ActionStepHistoryNo = actionStepHistoryNo;
                    data.ActionStepNo = actionStepNo;
                    data.AccessedUserNo = userNo;
                    data.SensorZoneHistoryNo = sensorZoneHistoryNo;
                    data.ComponentNo = sectionData.Component.compn_sn;
                    data.ComponentType = sectionData.Component.compn_code;

                    MessageResult result = RunSection(data, sopProcessManager, dataManager);

                    if (result.Success == false)
                    {
                        strErrorMessage = result.Message;
                        return false;
                    }
                }
                else
                {
                    // 다음에 실행해야할 Section을 실행중으로 만든다.
                    int runStatus = Sop.SopRunStatus.InProgress;
                    string strDescription = GetComponentHistoryDescription(sectionData.Component.compn_code, runStatus, null, null);
                    Model.History.Component componentHistory = HistoryManager.SetCurrent(dataManager, actionStepHistoryNo, sectionData.Component.compn_sn, DateTime.Now, userNo, strDescription, out strErrorMessage);

                    if (componentHistory == null)
                        return false;
                }
            }

            return true;
        }

        // 모든 세부임무가 Check된 상태인가?
        private bool GetAllMissionsChecked(IDataManager dataManager, int actionStepHistoryNo, int componentNo, int componentType, int? checkedIndex, out string strErrorMessage)
        {
            strErrorMessage = null;

            if (componentType == Sop.ComponentType.Process || componentType == Sop.ComponentType.Process - (int)CodeType.ComponentType)
            {
                string strCondition = string.Format("{0} = {1}", ProcessMission.Fields.compn_sn, componentNo);
                IEnumerable<ProcessMission> processMissions = dataManager.GetSelect().Select<ProcessMission>(strCondition, out strErrorMessage);

                if (processMissions == null)
                    return false;

                int missionCount = 0;

                foreach (var mission in processMissions)
                {
                    missionCount++;
                }

                if (missionCount == 0)
                    return true;

                strCondition = string.Format("{0} in (Select {1} from {2} where {3} = {4} and {5} = {6})",
                    Model.History.ComponentDetail.Fields.compn_hist_sn,
                    Model.History.Component.Fields.compn_hist_sn,
                    Model.History.Component.TableName,
                    Model.History.Component.Fields.action_step_hist_sn, actionStepHistoryNo,
                    Model.History.Component.Fields.compn_sn, componentNo);

                IEnumerable<Model.History.ComponentDetail> componentHistoryDetails = dataManager.GetSelect().Select<Model.History.ComponentDetail>(strCondition, out strErrorMessage);

                if (componentHistoryDetails == null)
                    return false;

                Dictionary<int, bool> dicChecked = new Dictionary<int, bool>();

                foreach (var componentHistoryDetail in componentHistoryDetails)
                {
                    if (componentHistoryDetail.data_intgr == 1)
                    {
                        dicChecked[componentHistoryDetail.data_no] = true;
                    }
                    else if (componentHistoryDetail.data_intgr == 0)
                    {
                        dicChecked[componentHistoryDetail.data_no] = false;
                    }
                }

                if (checkedIndex != null)
                    dicChecked[(int)checkedIndex] = true;

                int checkedCount = 0;

                foreach (KeyValuePair<int, bool> pair in dicChecked)
                {
                    if (pair.Value)
                        checkedCount++;
                }

                if (missionCount == checkedCount)
                    return true;
            }
            else if (componentType == Sop.ComponentType.Transmission || componentType == Sop.ComponentType.Transmission - (int)CodeType.ComponentType)
            {
                // 입력값이 checked 상태일때에만 이 함수가 호출되는데 상황전파 컴포넌트는 checkbox가 하나밖에 없으므로 무조건 true
                return true;
                /*string strCondition = string.Format("{0} in (Select {1} from {2} where {3} = {4} and {5} = {6})",
                    Model.History.ComponentDetail.Fields.compn_hist_sn,
                    Model.History.Component.Fields.compn_hist_sn,
                    Model.History.Component.TableName,
                    Model.History.Component.Fields.action_step_hist_sn, actionStepHistoryNo,
                    Model.History.Component.Fields.compn_sn, componentNo);

                IEnumerable<Model.History.ComponentDetail> componentHistoryDetails = dataManager.GetSelect().Select<Model.History.ComponentDetail>(strCondition, out strErrorMessage);

                if (componentHistoryDetails == null)
                    return false;

                bool isChecked = false;

                foreach (var componentHistoryDetail in componentHistoryDetails)
                {
                    if (componentHistoryDetail.data_intgr == 1)
                        isChecked = true;
                    else if (componentHistoryDetail.data_intgr == 0)
                        isChecked = false;
                }

                return isChecked;*/
            }

            return false;
        }

        public MessageResult ProgressMission(RequestProgressMission data, SOPManager.IBLL.IProcessManager sopProcessManager)
        {
            string strErrorMessage = null;
            IDataManager dataManager = m_dataManager.Clone();

            if (dataManager.BeginBatch(out strErrorMessage) == false)
                return new MessageResult(false, "DataBase 트랜잭션을 시작할 수 없습니다.");

            bool allChecked = data.Checked ? GetAllMissionsChecked(dataManager, data.ActionStepHistoryNo, data.ComponentNo, data.ComponentType, data.DataIndex, out strErrorMessage) : false;

            if (strErrorMessage != null)
                return RollBack(dataManager, new MessageResult(false, strErrorMessage));

            int runStatus = allChecked ? Sop.SopRunStatus.Complete : Sop.SopRunStatus.InProgress;
            string strDescription = GetComponentHistoryDescription(data.ComponentType, runStatus, data.DataIndex, data.Checked);
            Model.History.Component componentHistory = HistoryManager.AddComponentHistory(dataManager, data.ActionStepHistoryNo, data.ComponentNo, DateTime.Now, runStatus, data.AccessedUserNo, strDescription, out strErrorMessage);

            if (componentHistory == null)
                return RollBack(dataManager, new MessageResult(false, strErrorMessage));

            if (IsClosingEvent(dataManager, data.ComponentNo, data.ComponentType, runStatus))
            {
                RequestCloseSOP request = new RequestCloseSOP();
                request.ActionStepHistoryNo = data.ActionStepHistoryNo;
                request.LastAccessedUserNo = data.AccessedUserNo;

                MessageResult result = CloseSOPByUser(request, dataManager);

                if (result.Success == false)
                    return RollBack(dataManager, result);
            }

            if (data.ComponentType == Sop.ComponentType.Process || data.ComponentType == Sop.ComponentType.Process - (int)CodeType.ComponentType ||
                data.ComponentType == Sop.ComponentType.Transmission || data.ComponentType == Sop.ComponentType.Transmission - (int)CodeType.ComponentType)
            {
                if (HistoryManager.AddComponentHistoryDetail(dataManager, componentHistory.compn_hist_sn, data.DataIndex, data.Checked, out strErrorMessage) == null)
                    return RollBack(dataManager, new MessageResult(false, strErrorMessage));
            }

            if (allChecked)
            {
                strDescription = GetComponentHistoryDescription(data.ComponentType, Sop.SopRunStatus.Complete, null, null);

                if (HistoryManager.AddComponentHistory(dataManager, data.ActionStepHistoryNo, data.ComponentNo, DateTime.Now, runStatus, data.AccessedUserNo, strDescription, out strErrorMessage) == null)
                    return RollBack(dataManager, new MessageResult(false, strErrorMessage));

                if (ProcessNext(dataManager, data.ActionStepHistoryNo, data.ActionStepNo, data.ComponentNo, data.ComponentType, data.AccessedUserNo, null, allChecked, null, sopProcessManager, out strErrorMessage) == false)
                    return RollBack(dataManager, new MessageResult(false, strErrorMessage));
            }

            if (dataManager.BatchCommit(out strErrorMessage) == false)
                return RollBack(dataManager, new MessageResult(false, "DataBase 트랜잭션을 정상적으로 종료할 수 없습니다."));

            return new MessageResult(true, "");
        }

        private ReturnType RollBack<ReturnType>(IDataManager dataManager, ReturnType result)
        {
            string strTemp;
            dataManager.BatchRollback(out strTemp);
            return result;
        }

        public static string GetComponentHistoryDescription(int componentType, int runStatus, int? dataIndex, bool? isChecked, DecisionValue decisionValue = null)
        {
            if (componentType == Sop.ComponentType.Process || componentType == Sop.ComponentType.Process - (int)CodeType.ComponentType ||
                componentType == Sop.ComponentType.Transmission || componentType == Sop.ComponentType.Transmission - (int)CodeType.ComponentType)
            {
                if (dataIndex != null && isChecked != null)
                    return string.Format("{0}_{1}번째 {2}", Sop.ComponentType.GetComponentType(componentType), (int)dataIndex + 1, isChecked == true ? "체크" : "체크 해제");
            }
            else if (componentType == Sop.ComponentType.Decision || componentType == Sop.ComponentType.Decision - (int)CodeType.ComponentType)
            {
                if (decisionValue != null && decisionValue.ArrowText != null && decisionValue.ArrowText.Length > 0)
                {
                    return string.Format("{0}_{1}_{2}", Sop.ComponentType.GetComponentType(componentType), decisionValue.ArrowText, GetRunStatusText(runStatus));
                }
            }

            return string.Format("{0}_{1}", Sop.ComponentType.GetComponentType(componentType), GetRunStatusText(runStatus));
        }

        public static string GetRunStatusText(int runStatus)
        {
            if (runStatus == Sop.SopRunStatus.Normal)
                return "대기상태";
            else if (runStatus == Sop.SopRunStatus.InProgress)
                return "실행중";
            else if (runStatus == Sop.SopRunStatus.Complete)
                return "완료";
            else if (runStatus == Sop.SopRunStatus.Wait)
                return "입력대기";
            else if (runStatus == Sop.SopRunStatus.Skip)
                return "건너뜀";

            return "";
        }

        public MessageResult SendMessage(RequestSendMessage data)
        {
            string strErrorMessage;

            if (SmsManager.SendSMS(m_dataManager, data, out strErrorMessage) == false)
                return new MessageResult(false, strErrorMessage);
            else
            {
                int runStatus = Sop.SopRunStatus.InProgress;
                string strDescription = string.Format("{0}_{1}_문자전송", Sop.ComponentType.GetComponentType(data.ComponentType), GetRunStatusText(runStatus));

                if (HistoryManager.AddComponentHistory(m_dataManager, data.ActionStepHistoryNo, data.ComponentNo, DateTime.Now, Sop.SopRunStatus.InProgress, data.AccessedUserNo, strDescription, out strErrorMessage) == null)
                    return new MessageResult(false, strErrorMessage);
            }

            if (BroadcastManager.RunBroadcast(m_dataManager, data, out strErrorMessage) == false)
                return new MessageResult(false, strErrorMessage);
            else
            {
                int runStatus = Sop.SopRunStatus.InProgress;
                string strDescription = string.Format("{0}_{1}_방송실행", Sop.ComponentType.GetComponentType(data.ComponentType), GetRunStatusText(runStatus));

                if (HistoryManager.AddComponentHistory(m_dataManager, data.ActionStepHistoryNo, data.ComponentNo, DateTime.Now, Sop.SopRunStatus.InProgress, data.AccessedUserNo, strDescription, out strErrorMessage) == null)
                    return new MessageResult(false, strErrorMessage);
            }

            if (EmailManager.SendEmail(m_dataManager, data, out strErrorMessage) == false)
                return new MessageResult(false, strErrorMessage);
            else
            {
                int runStatus = Sop.SopRunStatus.InProgress;
                string strDescription = string.Format("{0}_{1}_이메일전송", Sop.ComponentType.GetComponentType(data.ComponentType), GetRunStatusText(runStatus));

                if (HistoryManager.AddComponentHistory(m_dataManager, data.ActionStepHistoryNo, data.ComponentNo, DateTime.Now, Sop.SopRunStatus.InProgress, data.AccessedUserNo, strDescription, out strErrorMessage) == null)
                    return new MessageResult(false, strErrorMessage);
            }

            return new MessageResult(true, "");
        }

        public MessageResult SetCurrentSection(RequestProgressSOP data, SOPManager.IBLL.IProcessManager sopProcessManager, IDataManager dataManager = null)
        {
            string strErrorMessage;
            bool transaction = true;

            if (dataManager == null)
                dataManager = m_dataManager.Clone();
            else
                transaction = false;

            if (data.ActionStepHistoryNo == null)
            {
                // SOP가 아직 시작되지 않았으면 아무것도 하지 않는다.
                return new MessageResult(true, "");
            }
            else
            {
                if (transaction)
                {
                    if (dataManager.BeginBatch(out strErrorMessage) == false)
                        return new MessageResult(false, "시스템 데이터베이스의 트랜잭션을 시작할 수 없습니다.");
                }

                int runStatus = Sop.SopRunStatus.InProgress;
                string strDescription = GetComponentHistoryDescription(data.ComponentType, runStatus, null, null, data.DecisionValue);
                Model.History.Component componentHistory = HistoryManager.SetCurrent(dataManager, (int)data.ActionStepHistoryNo, data.ComponentNo, DateTime.Now, null, strDescription, out strErrorMessage);

                if (componentHistory == null)
                {
                    if (transaction)
                    {
                        string strTemp;
                        dataManager.BatchRollback(out strTemp);
                    }

                    return new MessageResult(false, strErrorMessage);
                }

                if (transaction)
                {
                    if (dataManager.BatchCommit(out strErrorMessage) == false)
                    {
                        string strTemp;
                        dataManager.BatchRollback(out strTemp);
                        return new MessageResult(false, "시스템 데이터베이스의 트랜잭션이 정상적으로 종료되지 못하였습니다.");
                    }
                }
            }

            return new MessageResult(true, "");
        }
    }
}
