using System;
using System.Collections;
using System.Collections.Generic;
using Base.History.IBLL.Response;
using Base.History.IBLL.Request;
using dnsDapperDBUtil.DataAccessLayer.IDAL;
using Base.DAL;
using Base.DAL.Models;
using Base.Model.Sop.Category;
using Base.Model.Sop.Component;
using Base.Model.Account;
using Base.History.IBLL.Models.SOP;
using Base.SOPManager.IBLL.Models.Category;
using Base.SOPManager.IBLL.Models.Component;
using Base.Model.Common.Team;

namespace Base.History.BLL.Process
{
    public class LoadManager
    {
        private IDataManager m_dataManager = null;

        public LoadManager(IDataManager dataManager)
        {
            m_dataManager = dataManager;
        }

        public ResponseSOPHistory GetSOPHistories(RequestSOPHistory data)
        {
            JoinManager joinManager = new JoinManager(m_dataManager);

            string strCondition = string.Format("e.{0} >= '{1}' and e.{0} <= '{2}'",
                Model.History.ActionStep.Fields.begin_time,
                GetDateString(data.BeginYear, data.BeginMonth, data.BeginDay, true),
                GetDateString(data.EndYear, data.EndMonth, data.EndDay, false));

            if (data.DisasterCategoryName != null && data.DisasterCategoryName.Length > 0)
                strCondition += string.Format(" and a.{0} = '{1}'", LargeClass.Fields.lclas_name, data.DisasterCategoryName);

            if (data.ActionStepName != null && data.ActionStepName.Length > 0)
                strCondition += string.Format(" and d.{0} = '{1}'", ActionStep.Fields.action_step_name, data.ActionStepName);

            if (data.UserName != null && data.UserName.Length > 0)
                strCondition += string.Format(" and f.{0} = '{1}'", User.Fields.user_name, data.UserName);

            int beginIndex = 1;
            int? itemCount = data.PageRowCount;

            if (data.PageRowCount != null)
            {
                beginIndex = (int)data.PageRowCount * (data.PageNo - 1) + 1;
            }

            return GetSOPHistories(joinManager, strCondition, beginIndex, itemCount);
        }

        public ResponseSOPHistory GetSOPHistories(RequestExcelSOPPartialHistory data)
        {
            if (data.ActionStepHistoryNos.Count == 0)
                return new ResponseSOPHistory(true, "");

            JoinManager joinManager = new JoinManager(m_dataManager);

            string strCondition = string.Format("e.{0} in ({1})", Model.History.ActionStep.Fields.action_step_hist_sn, string.Join(",", data.ActionStepHistoryNos));
            return GetSOPHistories(joinManager, strCondition, 1, null);
        }

        private ResponseSOPHistory GetSOPHistories(JoinManager joinManager, string strCondition, int beginIndex, int? itemCount)
        {
            string strErrorMessage;
            ArrayList arrDatas = joinManager.JoinDisasterCategorySubDisasterCategoryDisasterActionStepActionStepHistoryUser(strCondition, beginIndex, itemCount, out strErrorMessage);

            if (arrDatas == null)
                return new ResponseSOPHistory(false, strErrorMessage);

            int nDataCount = arrDatas.Count;
            ResponseSOPHistory response = new ResponseSOPHistory(true, "");

            Dictionary<int, SOPHistoryData> dicSensorZoneHistoryDatas = new Dictionary<int, SOPHistoryData>();

            for (int i = 0; i < nDataCount - 6; i += 7)
            {
                if (arrDatas[i] is Pagination && arrDatas[i + 1] is LargeClass && arrDatas[i + 2] is MiddleClass && arrDatas[i + 3] is SmallClass && arrDatas[i + 4] is ActionStep &&
                    arrDatas[i + 5] is Model.History.ActionStep && (arrDatas[i + 6] == null || arrDatas[i + 6] is User))
                {
                    Pagination pagination = (Pagination)arrDatas[i];
                    LargeClass largeClass = (LargeClass)arrDatas[i + 1];
                    MiddleClass middleClass = (MiddleClass)arrDatas[i + 2];
                    SmallClass smallClass = (SmallClass)arrDatas[i + 3];
                    ActionStep actionStep = (ActionStep)arrDatas[i + 4];
                    Model.History.ActionStep actionStepHistory = (Model.History.ActionStep)arrDatas[i + 5];
                    User user = (User)arrDatas[i + 6];

                    SOPHistoryData sopHistoryData = GetSOPHistoryData(largeClass, middleClass, smallClass, actionStep, actionStepHistory, user, pagination.RowNo);
                    response.SOPHistoryDatas.Add(sopHistoryData);
                    response.TotalCount = pagination.TotalCount;

                    if (sopHistoryData.SensorZoneHistoryNo != null)
                        dicSensorZoneHistoryDatas[(int)sopHistoryData.SensorZoneHistoryNo] = sopHistoryData;
                }
            }

            if (ReadSensorName(joinManager, dicSensorZoneHistoryDatas, out strErrorMessage) == false)
                return new ResponseSOPHistory(false, strErrorMessage);

            return response;
        }

        private bool ReadSensorName(JoinManager joinManger, Dictionary<int, SOPHistoryData> dicSensorZoneHistoryDatas, out string strErrorMessage)
        {
            strErrorMessage = null;

            if (dicSensorZoneHistoryDatas.Count == 0)
                return true;

            string strCondition = string.Format("a.{0} in ({1})", Model.History.SensorZone.Fields.sensor_zone_hist_sn, string.Join(",", dicSensorZoneHistoryDatas.Keys));
            ArrayList arrDatas = joinManger.JoinSensorZoneHistorySensorZoneHistoryDetail(strCondition, out strErrorMessage);

            if (arrDatas == null)
                return false;

            // Key : SensorZoneHistory No
            // Value : SensorZone No
            Dictionary<int, int> dicSensorZoneSensorZoneHistories = new Dictionary<int, int>();

            string strSensorZoneNos = null;
            int nDataCount = arrDatas.Count;

            for (int i=0;i<nDataCount-1;i+=2)
            {
                if (arrDatas[i + 1] is Model.History.SensorZoneDetail)
                {
                    Model.History.SensorZoneDetail sensorZoneHistoryDetail = (Model.History.SensorZoneDetail)arrDatas[i + 1];

                    if (strSensorZoneNos == null)
                        strSensorZoneNos = sensorZoneHistoryDetail.sensor_zone_sn.ToString();
                    else
                        strSensorZoneNos += "," + sensorZoneHistoryDetail.sensor_zone_sn.ToString();

                    dicSensorZoneSensorZoneHistories[sensorZoneHistoryDetail.sensor_zone_hist_sn] = sensorZoneHistoryDetail.sensor_zone_sn;
                }
            }

            if (strSensorZoneNos == null)
                return true;

            strCondition = string.Format("b.{0} in ({1})", Model.Sensor.SensorZone.Fields.sensor_zone_sn, strSensorZoneNos);
            arrDatas = joinManger.JoinSensorSensorZone(strCondition, out strErrorMessage);

            if (arrDatas == null)
                return false;

            SOPHistoryData sopHistoryData;
            nDataCount = arrDatas.Count;

            Dictionary<int, string> dicSensorZoneNames = new Dictionary<int, string>();

            for (int i=0;i<nDataCount-1;i+=2)
            { 
                if (arrDatas[i] is Model.Sensor.Sensor && arrDatas[i + 1] is Model.Sensor.SensorZone)
                {
                    Model.Sensor.Sensor sensor = (Model.Sensor.Sensor)arrDatas[i];
                    Model.Sensor.SensorZone sensorZone = (Model.Sensor.SensorZone)arrDatas[i + 1];
                    dicSensorZoneNames[sensorZone.sensor_zone_sn] = sensor.sensor_name;

                    int sensorZoneHistoryNo;

                    if (dicSensorZoneSensorZoneHistories.TryGetValue(sensorZone.sensor_zone_sn, out sensorZoneHistoryNo))
                    {
                        if (dicSensorZoneHistoryDatas.TryGetValue(sensorZoneHistoryNo, out sopHistoryData))
                            sopHistoryData.SensorName = sensor.sensor_name;
                    }
                }
            }

            int sensorZoneNo;
            string strSensorName;

            foreach (KeyValuePair<int, SOPHistoryData> pair in dicSensorZoneHistoryDatas)
            {
                if (dicSensorZoneSensorZoneHistories.TryGetValue(pair.Key, out sensorZoneNo))
                {
                    if (dicSensorZoneNames.TryGetValue(sensorZoneNo, out strSensorName))
                        pair.Value.SensorName = strSensorName;
                }
            }

            return true;
        }

        public ResponseSOPComponentHistory GetSOPComponentHistories(RequestSOPComponentHistory data, SOPManager.IBLL.IProcessManager sopPropcessManager, SOPSimulator.IBLL.IProcessManager sopSimulatorProcessManager)
        {
            string strErrorMessage;
            Dictionary<int, SectionData> dicSections = ReadActionStepSectionDatas(m_dataManager, data.ActionStepHistoryNo, sopPropcessManager, out strErrorMessage);

            if (dicSections == null)
                return new ResponseSOPComponentHistory(false, strErrorMessage);

            string strCondition = string.Format("{0} = {1}", Model.History.Component.Fields.action_step_hist_sn, data.ActionStepHistoryNo);
            IEnumerable<Model.History.Component> componentHistories = m_dataManager.GetSelect().Select<Model.History.Component>(strCondition, out strErrorMessage);

            if (componentHistories == null)
                return new ResponseSOPComponentHistory(false, strErrorMessage);

            Dictionary<int, Model.History.Component> dicComponentHistories = new Dictionary<int, Model.History.Component>();

            // Key : ComponentNo
            Dictionary<int, List<Model.History.ComponentDetail>> dicDetailHistories = GetComponentDetailHistories(componentHistories, dicComponentHistories, m_dataManager, out strErrorMessage);

            if (dicDetailHistories == null)
                return new ResponseSOPComponentHistory(false, strErrorMessage);

            List<SOPHistoryComponentData> sopHistoryComponentDatas = GetComponentHistoryDatas(componentHistories, dicComponentHistories, dicSections, dicDetailHistories, m_dataManager, sopSimulatorProcessManager, out strErrorMessage);

            if (sopHistoryComponentDatas == null)
                return new ResponseSOPComponentHistory(false, strErrorMessage);

            ResponseSOPComponentHistory response = new ResponseSOPComponentHistory(true, "");
            response.SopComponentHistoryDatas.AddRange(sopHistoryComponentDatas);
            return response;
        }

        private List<SOPHistoryComponentData> GetComponentHistoryDatas(IEnumerable<Model.History.Component> componentHistories, Dictionary<int, Model.History.Component> dicComponentHistories, Dictionary<int, SectionData> dicSections, Dictionary<int, List<Model.History.ComponentDetail>> dicDetailHistories, IDataManager dataManager, SOPSimulator.IBLL.IProcessManager sopSimulatorProcessManager, out string strErrorMessage)
        {
            List<SOPHistoryComponentData> sopHistoryComponentDatas = new List<SOPHistoryComponentData>();
            Dictionary<int, User> dicUsers = new Dictionary<int, User>();

            Dictionary<int, int> dicRegularNos = new Dictionary<int, int>();
            Dictionary<int, int> dicTemporaryNos = new Dictionary<int, int>();

            foreach (var componentHistory in componentHistories)
            {
                SectionData sectionData;

                if (dicSections.TryGetValue(componentHistory.compn_sn, out sectionData) == false)
                    continue;

                if (sectionData.Component == null)
                    continue;

                SOPHistoryComponentData historyData = new SOPHistoryComponentData();

                historyData.ActionStepHistoryNo = componentHistory.action_step_hist_sn;
                historyData.ComponentHistoryNo = componentHistory.compn_hist_sn;
                historyData.ComponentNo = componentHistory.compn_sn;
                historyData.ComponentType = sectionData.Component.compn_code;
                historyData.Title = sectionData.Text;
                historyData.Time = GetTimeString(componentHistory.time);
                historyData.Status = sopSimulatorProcessManager.GetSOPRunStatus(componentHistory.sop_sttus_code);
                historyData.UserNo = componentHistory.user_sn;

                if (sectionData.ProcessData != null)
                    SetProcessComponentHistory(historyData, componentHistory, dicDetailHistories, sectionData.ProcessData, dicRegularNos, dicTemporaryNos);
                else if (sectionData.TransmissionData != null)
                    SetTransmissionComponentHistory(historyData, componentHistory, sectionData.TransmissionData, dicRegularNos, dicTemporaryNos);

                if (componentHistory.user_sn != null)
                {
                    User user;

                    if (dicUsers.TryGetValue((int)componentHistory.user_sn, out user) == false)
                    {
                        string strCondition = string.Format("{0} = {1}", User.Fields.user_sn, (int)componentHistory.user_sn);
                        user = dataManager.GetSelect().SelectFirst<User>(strCondition, out strErrorMessage);

                        if (user == null)
                        {
                            if (strErrorMessage == null)
                                strErrorMessage = "SOP를 실행한 사용자 정보를 찾을수 없습니다.";

                            return null ;
                        }

                        dicUsers[(int)componentHistory.user_sn] = user;
                    }

                    historyData.UserName = user.user_name;
                }

                sopHistoryComponentDatas.Add(historyData);
            }

            Dictionary<int, Regular> dicRegulars = ReadRegulars(dataManager, dicRegularNos, out strErrorMessage);

            if (dicRegulars == null)
                return null;

            Dictionary<int, Temporary> dicTemporaries = ReadTemporaries(dataManager, dicTemporaryNos, out strErrorMessage);

            if (dicTemporaries == null)
                return null;

            foreach (SOPHistoryComponentData historyData in sopHistoryComponentDatas)
            {
                SectionData sectionData;

                if (dicSections.TryGetValue(historyData.ComponentNo, out sectionData) == false)
                    continue;

                if (sectionData.Component == null)
                    continue;

                if (sectionData.ProcessData != null)
                    SetProcessTeamList(historyData, sectionData.ProcessData, dicRegulars, dicTemporaries);
                else if (sectionData.TransmissionData != null)
                    SetTransmissionTeamList(historyData, sectionData.TransmissionData, dicRegulars, dicTemporaries);
            }

            return sopHistoryComponentDatas;
        }

        private void SetTransmissionTeamList(SOPHistoryComponentData historyData, TransmissionData transmissionData, Dictionary<int, Regular> dicRegulars, Dictionary<int, Temporary> dicTemporaries)
        {
            foreach (var regular in transmissionData.Regulars)
            {
                Regular _regular;

                if (dicRegulars.TryGetValue(regular.rgl_sn, out _regular))
                {
                    historyData.TeamList.Add(_regular.team_name);
                }
            }

            foreach (var temporary in transmissionData.Temporaries)
            {
                Temporary _temporary;

                if (dicTemporaries.TryGetValue(temporary.tmpr_sn, out _temporary))
                {
                    historyData.TeamList.Add(_temporary.team_name);
                }
            }
        }

        private void SetProcessTeamList(SOPHistoryComponentData historyData, ProcessData processData, Dictionary<int, Regular> dicRegulars, Dictionary<int, Temporary> dicTemporaries)
        {
            foreach (var regular in processData.Regulars)
            {
                Regular _regular;

                if (dicRegulars.TryGetValue(regular.rgl_sn, out _regular))
                {
                    historyData.TeamList.Add(_regular.team_name);
                }
            }

            foreach (var temporary in processData.Temporaries)
            {
                Temporary _temporary;

                if (dicTemporaries.TryGetValue(temporary.tmpr_sn, out _temporary))
                {
                    historyData.TeamList.Add(_temporary.team_name);
                }
            }
        }

        private Dictionary<int, Temporary> ReadTemporaries(IDataManager dataManager, Dictionary<int, int> dicTemporaryNos, out string strErrorMessage)
        {
            string strTemporaryNos = "";

            foreach (KeyValuePair<int, int> pair in dicTemporaryNos)
            {
                if (strTemporaryNos.Length == 0)
                    strTemporaryNos = pair.Key.ToString();
                else
                    strTemporaryNos += "," + pair.Key.ToString();
            }

            Dictionary<int, Temporary> dicTemporaries = new Dictionary<int, Temporary>();

            if (strTemporaryNos.Length == 0)
            {
                strErrorMessage = null;
                return dicTemporaries;
            }

            string strCondition = string.Format("{0} in ({1})", Temporary.Fields.tmpr_sn, strTemporaryNos);
            IEnumerable<Temporary> temporaries = dataManager.GetSelect().Select<Temporary>(strCondition, out strErrorMessage);

            if (temporaries == null)
                return null;

            foreach (Temporary temporary in temporaries)
            {
                dicTemporaries[temporary.tmpr_sn] = temporary;
            }

            return dicTemporaries;
        }

        private Dictionary<int, Regular> ReadRegulars(IDataManager dataManager, Dictionary<int, int> dicRegularNos, out string strErrorMessage)
        {
            string strRegularNos = "";

            foreach (KeyValuePair<int, int> pair in dicRegularNos)
            {
                if (strRegularNos.Length == 0)
                    strRegularNos = pair.Key.ToString();
                else
                    strRegularNos += "," + pair.Key.ToString();
            }

            Dictionary<int, Regular> dicRegulars = new Dictionary<int, Regular>();

            if (strRegularNos.Length == 0)
            {
                strErrorMessage = null;
                return dicRegulars;
            }

            string strCondition = string.Format("{0} in ({1})", Regular.Fields.rgl_sn, strRegularNos);
            IEnumerable<Regular> regulars = dataManager.GetSelect().Select<Regular>(strCondition, out strErrorMessage);

            if (regulars == null)
                return null;

            foreach (Regular regular in regulars)
            {
                dicRegulars[regular.rgl_sn] = regular;
            }

            return dicRegulars;
        }

        // Key : ComponentNo
        private Dictionary<int, List<Model.History.ComponentDetail>> GetComponentDetailHistories(IEnumerable<Model.History.Component> componentHistories, Dictionary<int, Model.History.Component> dicComponentHistories, IDataManager dataManager, out string strErrorMessage)
        {
            string strComponentHistoryNos = "";

            foreach (var componentHistory in componentHistories)
            {
                if (strComponentHistoryNos.Length == 0)
                    strComponentHistoryNos = componentHistory.compn_hist_sn.ToString();
                else
                    strComponentHistoryNos += "," + componentHistory.compn_hist_sn.ToString();

                dicComponentHistories[componentHistory.compn_hist_sn] = componentHistory;
            }

            // Key : ComponentNo
            Dictionary<int, List<Model.History.ComponentDetail>> dicDetailHistories = new Dictionary<int, List<Model.History.ComponentDetail>>();

            if (strComponentHistoryNos.Length > 0)
            {
                string strCondition = string.Format("{0} in ({1})", Model.History.ComponentDetail.Fields.compn_hist_sn, strComponentHistoryNos);
                IEnumerable<Model.History.ComponentDetail> componentHistoryDetails = dataManager.GetSelect().Select<Model.History.ComponentDetail>(strCondition, out strErrorMessage);

                if (componentHistoryDetails == null)
                    return null;

                foreach (var componentHistoryDetail in componentHistoryDetails)
                {
                    Model.History.Component componentHistory = null;

                    if (dicComponentHistories.TryGetValue(componentHistoryDetail.compn_hist_sn, out componentHistory) == false)
                        continue;

                    List<Model.History.ComponentDetail> detailHistories = null;

                    if (dicDetailHistories.TryGetValue(componentHistory.compn_sn, out detailHistories) == false)
                    {
                        detailHistories = new List<Model.History.ComponentDetail>();
                        dicDetailHistories[componentHistory.compn_sn] = detailHistories;
                    }

                    detailHistories.Add(componentHistoryDetail);
                }
            }

            strErrorMessage = null;
            return dicDetailHistories;
        }

        private void SetTransmissionComponentHistory(SOPHistoryComponentData historyData, Model.History.Component componentHistory, TransmissionData transmissionData, Dictionary<int, int> dicRegularNos, Dictionary<int, int> dicTemporaryNos)
        {
            ComponentHistoryDetailData detailData = new ComponentHistoryDetailData();
            detailData.DataIndex = 0;
            detailData.SectionName = historyData.Title;
            detailData.Time = GetTimeString(componentHistory.time);
            detailData.MissionText = transmissionData.Transmission.mssage;

            historyData.MissionDatas.Add(detailData);

            foreach (var regular in transmissionData.Regulars)
            {
                dicRegularNos[regular.rgl_sn] = regular.rgl_sn;
            }

            foreach (var temporary in transmissionData.Temporaries)
            {
                dicTemporaryNos[temporary.tmpr_sn] = temporary.tmpr_sn;
            }
        }

        private void SetProcessComponentHistory(SOPHistoryComponentData historyData, Model.History.Component componentHistory, Dictionary<int, List<Model.History.ComponentDetail>> dicDetailHistories, ProcessData processData, Dictionary<int, int> dicRegularNos, Dictionary<int, int> dicTemporaryNos)
        {
            List<Model.History.ComponentDetail> detailHistories = null;
            Dictionary<int, bool> dicCheckedMissions = new Dictionary<int, bool>();

            List<ComponentHistoryDetailData> componentHistoryDetailDatas = new List<ComponentHistoryDetailData>();
            int checkedCount = 0;

            if (dicDetailHistories.TryGetValue(processData.compn_sn, out detailHistories))
            {
                foreach (var detailHistory in detailHistories)
                {
                    dicCheckedMissions[detailHistory.data_no] = detailHistory.data_intgr == 1;

                    ComponentHistoryDetailData detailData = new ComponentHistoryDetailData();
                    detailData.DataIndex = detailHistory.data_no;
                    detailData.SectionName = historyData.Title;
                    detailData.Time = GetTimeString(componentHistory.time);
                    detailData.Completion = GetCompletionText(GetCheckedCount(dicCheckedMissions), processData.Missions);

                    if (detailHistory.data_no < processData.Missions.Count)
                    {
                        var mission = processData.Missions[detailHistory.data_no];
                        detailData.MissionText = mission.misn_contents;
                    }

                    componentHistoryDetailDatas.Add(detailData);
                }

                checkedCount = GetCheckedCount(dicCheckedMissions);
            }

            historyData.MissionDatas.AddRange(componentHistoryDetailDatas);
            historyData.Completion = GetCompletionText(checkedCount, processData.Missions);

            foreach (var regular in processData.Regulars)
            {
                dicRegularNos[regular.rgl_sn] = regular.rgl_sn;
            }

            foreach (var temporary in processData.Temporaries)
            {
                dicTemporaryNos[temporary.tmpr_sn] = temporary.tmpr_sn;
            }
        }

        private int GetCheckedCount(Dictionary<int, bool> dicCheckedMissions)
        {
            int checkedCount = 0;

            foreach (KeyValuePair<int, bool> pair in dicCheckedMissions)
            {
                if (pair.Value)
                    checkedCount++;
            }

            return checkedCount;
        }

        private string GetCompletionText(int checkedCount, List<ProcessMissionEx> missions)
        {
            if (checkedCount == missions.Count)
            {
                // 완료된 개수와  mission개수가 같다면...
                if (checkedCount == 0)
                    return "확인";
                else
                    return "완료";
            }
            else if (checkedCount > 0 && checkedCount < missions.Count)
            {
                // 완료된 개수가 mission개수보다 작다면...
                return "부분완료";
            }
            else// if (checkedCount == 0)
                return "미완료";
        }

        private Dictionary<int, SectionData> ReadActionStepSectionDatas(IDataManager dataManager, int actionStepHistoryNo, SOPManager.IBLL.IProcessManager sopPropcessManager, out string strErrorMessage)
        {
            string strCondition = string.Format("{0} = {1}", Model.History.ActionStep.Fields.action_step_hist_sn, actionStepHistoryNo);
            Model.History.ActionStep actionStepHistory = dataManager.GetSelect().SelectFirst<Model.History.ActionStep>(strCondition, out strErrorMessage);

            if (actionStepHistory == null)
            {
                if (strErrorMessage == null)
                {
                    strErrorMessage = "잘못된 actionStepHistoryNo입니다.";
                    return null;
                }
                else
                    return null;
            }

            ActionStepData actionStepData = sopPropcessManager.ReadActionStep(dataManager, actionStepHistory.action_step_sn, out strErrorMessage);

            if (actionStepData == null)
                return null;

            Dictionary<int, SectionData> dicSections = new Dictionary<int, SectionData>();

            foreach (var stepMemberData in actionStepData.StepMemberDatas)
            {
                foreach (var sectionData in stepMemberData.Sections)
                {
                    if (sectionData.Component == null)
                        continue;

                    dicSections[sectionData.Component.compn_sn] = sectionData;
                }
            }

            return dicSections;
        }

        private SOPHistoryData GetSOPHistoryData(LargeClass largeClass, MiddleClass middleClass, SmallClass smallClass, ActionStep actionStep, Model.History.ActionStep actionStepHistory, User user, int rowNo)
        {
            SOPHistoryData data = new SOPHistoryData();

            data.ActionStepHistoryNo = actionStepHistory.action_step_hist_sn;
            data.ActionStepName = actionStep.action_step_name;
            data.BeginTime = actionStepHistory.begin_time;
            data.DisasterCategoryName = largeClass.lclas_name;
            data.EndTime = actionStepHistory.end_time;
            data.LastAccessedUserNo = actionStepHistory.user_sn;
            data.Position = actionStepHistory.lc;
            data.SensorZoneHistoryNo = actionStepHistory.sensor_zone_hist_sn;
            data.SopName = smallClass.sclas_name;
            data.RowNo = rowNo;

            if (user != null)
                data.UserName = user.user_name;

            return data;
        }

        public static string GetTimeString(DateTime time)
        {
            return string.Format("{0}-{1:00}-{2:00} {3:00}:{4:00}:{5:00}", time.Year, time.Month, time.Day, time.Hour, time.Minute, time.Second);
        }

        public static string GetDateString(int year, int month, int day, bool isBegin)
        {
            if (isBegin)
                return string.Format("{0}-{1:00}-{2:00} 00:00:00", year, month, day);

            return string.Format("{0}-{1:00}-{2:00} 23:59:59", year, month, day);
        }
    }
}
