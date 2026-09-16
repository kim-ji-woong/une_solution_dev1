using System;
using System.Collections;
using System.Collections.Generic;
using Base.DAL;
using dnsDapperDBUtil.DataAccessLayer.IDAL;
using dnsData.CommonCode;
using Base.Model.Sensor;
using Base.Model.Spatial;
using Base.Model.Alarm;
using Response;
using SOPWebServer.IBLL.Models.Request;
using SOPWebServer.IBLL.Models.Response;
using SOPWebServer.IBLL.Models.History;
using SOPWebServer.IBLL.Interface;
using Base.Model.Common;

namespace SOPWebServer.BLL.Server
{
    using Process;

    abstract class SensorServer
    {
        protected IDataManager m_dataManager = null;
        protected IAgentManager m_agentManager = null;
        protected string m_strSensorType = "";

        private static SensorServer GetSensorServer(IDataManager dataManager, int sensorType, IAgentManager agentManager, out string strErrorMessage)
        {
            strErrorMessage = null;

            IAgentManager.SensorType _sensorType;
            string strParameter;

            if (agentManager.GetSensorServerType(sensorType, out _sensorType, out strParameter))
            {
                bool useReceive = agentManager.GetUseReceive(dataManager, sensorType, null);

                if (useReceive == false)
                {
                    // 알람을 처리하지 않는다.
                    string strSensorTypeName = GetSensorTypeName(dataManager, sensorType, out strErrorMessage);

                    if (strErrorMessage != null)
                        return null;
                    else
                        strErrorMessage = string.Format("현재 {0} 신호에 대한 알람처리를 하지 않도록 설정되어 있습니다.", strSensorTypeName);

                    return null;
                }

                if (_sensorType == IAgentManager.SensorType.Fire)
                    return new FireSensor(dataManager);
                else if (_sensorType == IAgentManager.SensorType.MaterialSensor)
                    return new MaterialSensor(dataManager, strParameter);
            }

            if (sensorType == SdmsSensor.SensorType.Fire)
                return new FireSensor(dataManager);
            else if (sensorType == SdmsSensor.SensorType.PSM)
                return new MaterialSensor(dataManager, "psm");
            else if (sensorType == SdmsSensor.SensorType.Etc)
                return new MaterialSensor(dataManager, "etc");
            else if (sensorType == SdmsSensor.SensorType.CCTV)
                return new MaterialSensor(dataManager, "cctv");

            strErrorMessage = string.Format("알수없는 센서타입입니다.({0})", sensorType);
            return null;
        }

        private static string GetSensorTypeName(IDataManager dataManager, int sensorType, out string strErrorMessage)
        {
            string strCondition = string.Format("{0} = {1}", Codes.Fields.code, sensorType);
            Codes code = dataManager.GetSelect().SelectFirst<Codes>(strCondition, out strErrorMessage);

            if (code == null)
            {
                if (strErrorMessage != null)
                    return null;
                else
                    return "알려지지 않은 센서타입(" + sensorType.ToString() + ")";
            }

            return code.code_name;
        }

        private static SensorServer GetSensorServer(IDataManager dataManager, ClearAlarm signal, IAgentManager agentManager, out Base.Model.History.SensorZone sensorZoneHistory, out string strErrorMessage)
        {
            strErrorMessage = null;

            string strCondition = string.Format("{0} = {1}", Base.Model.History.SensorZone.Fields.sensor_zone_hist_sn, signal.SensorZoneHistoryNo);
            sensorZoneHistory = dataManager.GetSelect().SelectFirst<Base.Model.History.SensorZone>(strCondition, out strErrorMessage);

            if (sensorZoneHistory == null)
                return null;

            IAgentManager.SensorType _sensorType;
            string strParameter;

            if (agentManager.GetSensorServerType(sensorZoneHistory.sensor_ty_code, out _sensorType, out strParameter))
            {
                if (_sensorType == IAgentManager.SensorType.Fire)
                    return new FireSensor(dataManager);
                else if (_sensorType == IAgentManager.SensorType.MaterialSensor)
                    return new MaterialSensor(dataManager, strParameter);
            }

            if (sensorZoneHistory.sensor_ty_code == SdmsSensor.SensorType.Fire)
                return new FireSensor(dataManager);
            else if (sensorZoneHistory.sensor_ty_code == SdmsSensor.SensorType.PSM)
                return new MaterialSensor(dataManager, "psm");
            else if (sensorZoneHistory.sensor_ty_code == SdmsSensor.SensorType.Etc)
                return new MaterialSensor(dataManager, "etc");
            else if (sensorZoneHistory.sensor_ty_code == SdmsSensor.SensorType.CCTV)
                return new MaterialSensor(dataManager, "cctv");
            
            strErrorMessage = string.Format("알수없는 센서타입입니다.({0})", sensorZoneHistory.sensor_ty_code);
            return null;
        }

        private static List<SensorServer> GetSensorServer(IDataManager dataManager, ClearAlarmList signal, IAgentManager agentManager, List<Base.Model.History.SensorZone> sensorZoneHistories, out string strErrorMessage)
        {
            strErrorMessage = null;

            if (signal.SensorZoneHistoryNos.Count == 0)
            {
                strErrorMessage = "알람이 선택되지 않았습니다.";
                return null;
            }

            string strCondition = string.Format("{0} in ({1})", Base.Model.History.SensorZone.Fields.sensor_zone_hist_sn, string.Join(",", signal.SensorZoneHistoryNos));
            IEnumerable<Base.Model.History.SensorZone> sensorZoneHistoryList = dataManager.GetSelect().Select<Base.Model.History.SensorZone>(strCondition, out strErrorMessage);

            if (sensorZoneHistoryList == null)
                return null;

            sensorZoneHistories.AddRange(sensorZoneHistoryList);

            List<SensorServer> sensorServers = new List<SensorServer>();

            IAgentManager.SensorType _sensorType;
            string strParameter;

            foreach (var sensorZoneHistory in sensorZoneHistories)
            {
                if (agentManager.GetSensorServerType(sensorZoneHistory.sensor_ty_code, out _sensorType, out strParameter))
                {
                    if (_sensorType == IAgentManager.SensorType.Fire)
                    {
                        sensorServers.Add(new FireSensor(dataManager));
                        continue;
                    }
                    else if (_sensorType == IAgentManager.SensorType.MaterialSensor)
                    {
                        sensorServers.Add(new MaterialSensor(dataManager, strParameter));
                        continue;
                    }
                }

                if (sensorZoneHistory.sensor_ty_code == SdmsSensor.SensorType.Fire)
                    sensorServers.Add(new FireSensor(dataManager));
                else if (sensorZoneHistory.sensor_ty_code == SdmsSensor.SensorType.PSM)
                    sensorServers.Add(new MaterialSensor(dataManager, "psm"));
                else if (sensorZoneHistory.sensor_ty_code == SdmsSensor.SensorType.Etc)
                    sensorServers.Add(new MaterialSensor(dataManager, "etc"));
                else if (sensorZoneHistory.sensor_ty_code == SdmsSensor.SensorType.CCTV)
                    sensorServers.Add(new MaterialSensor(dataManager, "cctv"));
                else
                {
                    strErrorMessage = string.Format("알수없는 센서타입입니다.({0})", sensorZoneHistory.sensor_ty_code);
                    return null;
                }
            }

            return sensorServers;
        }

        // Key : SensorType
        private static Dictionary<int, SensorServer> MakeAllSensorServers(IDataManager dataManager)
        {
            Dictionary<int, SensorServer> dicSensorServers = new Dictionary<int, SensorServer>();

            FireSensor fireSensorServer = new FireSensor(dataManager);
            MaterialSensor psmSensorServer = new MaterialSensor(dataManager, "psm");
            MaterialSensor etcSensorServer = new MaterialSensor(dataManager, "etc");

            dicSensorServers[SdmsSensor.SensorType.Fire] = fireSensorServer;
            dicSensorServers[SdmsSensor.SensorType.PSM] = psmSensorServer;
            dicSensorServers[SdmsSensor.SensorType.Etc] = etcSensorServer;

            return dicSensorServers;
        }

        public static ResponseSensorSignal ProcessSensorSignal(SensorSignal signal, IDataManager dataManager, IAgentManager agentManager)
        {
            string strErrorMessage;
            SensorServer sensorServer = GetSensorServer(dataManager, signal.SensorType, agentManager, out strErrorMessage);

            if (sensorServer == null)
                return new ResponseSensorSignal(false, strErrorMessage);

            return sensorServer.Process_SensorSignal(signal, dataManager, agentManager);
        }

        public static ResponseSensorSignal ProcessClearAlarm(ClearAlarm signal, IDataManager dataManager, IAgentManager agentManager)
        {
            string strErrorMessage;
            Base.Model.History.SensorZone sensorZoneHistory;
            SensorServer sensorServer = GetSensorServer(dataManager, signal, agentManager, out sensorZoneHistory, out strErrorMessage);

            if (sensorServer == null)
            {
                if (strErrorMessage == null)
                    return new ResponseSensorSignal(false, "존재하지 않는 알람이력 번호입니다.(" + signal.SensorZoneHistoryNo + ")");

                return new ResponseSensorSignal(false, strErrorMessage);
            }

            return sensorServer.Process_ClearAlarm(signal, sensorZoneHistory, dataManager);
        }

        public static ResponseSensorSignalList ProcessClearAlarmList(ClearAlarmList signal, IDataManager dataManager, IAgentManager agentManager)
        {
            string strErrorMessage;
            List<Base.Model.History.SensorZone> sensorZoneHistories = new List<Base.Model.History.SensorZone>();
            List<SensorServer> sensorServers = GetSensorServer(dataManager, signal, agentManager, sensorZoneHistories, out strErrorMessage);

            if (sensorServers == null)
            {
                return new ResponseSensorSignalList(false, strErrorMessage);
            }

            ResponseSensorSignalList response = new ResponseSensorSignalList(true, "");
            int sensorServerCount = sensorServers.Count;

            for (int i=0;i<sensorServerCount;i++)
            {
                SensorServer sensorServer = sensorServers[i];
                var sensorZoneHistory = sensorZoneHistories[i];

                ResponseSensorSignal _response = sensorServer.Process_ClearAlarm(signal, sensorZoneHistory, dataManager);

                if (_response.Success == false)
                    return new ResponseSensorSignalList(false, _response.Message);
                else
                {
                    response.SensorZoneHistoryNos.Add(sensorZoneHistory.sensor_zone_hist_sn);
                    response.ProcessMessage = _response.ProcessMessage;
                }
            }

            return response;
        }

        public static MessageResult ProcessClearAll(ClearAll signal, IDataManager dataManager, IAgentManager agentManager)
        {
            string strErrorMessage;
            List<SensorZoneHistoryData> sensorZoneHistoryDatas = SensorManager.GetActiveSensorZoneHistories(signal, dataManager, out strErrorMessage);

            if (sensorZoneHistoryDatas == null)
                return new MessageResult(false, strErrorMessage);

            string strSensorZoneNos = "", strSensorZoneHistoryNos = "";
            Dictionary<int, int> dicSensorZoneNos = new Dictionary<int, int>();
            Dictionary<int, int> dicSensorZoneHistoryNos = new Dictionary<int, int>();

            Dictionary<int, SensorServer> dicSensorServers = new Dictionary<int, SensorServer>();
            //Dictionary<int, SensorServer> dicSensorServers = MakeAllSensorServers(dataManager);

            if (dataManager.BeginBatch(out strErrorMessage) == false)
                return new MessageResult(false, ErrorMessage.ToMessage(ErrorMessage.FAIL_BEGIN_TRANSACTION));

            foreach (SensorZoneHistoryData sensorZoneHistoryData in sensorZoneHistoryDatas)
            {
                if (sensorZoneHistoryData.SensorZone == null)
                    continue;

                if (dicSensorZoneNos.ContainsKey(sensorZoneHistoryData.SensorZone.sensor_zone_sn) == false)
                {
                    dicSensorZoneNos[sensorZoneHistoryData.SensorZone.sensor_zone_sn] = sensorZoneHistoryData.SensorZone.sensor_zone_sn;

                    if (strSensorZoneNos.Length == 0)
                        strSensorZoneNos = sensorZoneHistoryData.SensorZone.sensor_zone_sn.ToString();
                    else
                        strSensorZoneNos += "," + sensorZoneHistoryData.SensorZone.sensor_zone_sn.ToString();
                }

                if (dicSensorZoneHistoryNos.ContainsKey(sensorZoneHistoryData.SensorZoneHistory.sensor_zone_hist_sn) == false)
                {
                    dicSensorZoneHistoryNos[sensorZoneHistoryData.SensorZoneHistory.sensor_zone_hist_sn] = sensorZoneHistoryData.SensorZoneHistory.sensor_zone_hist_sn;

                    if (strSensorZoneHistoryNos.Length == 0)
                        strSensorZoneHistoryNos = sensorZoneHistoryData.SensorZoneHistory.sensor_zone_hist_sn.ToString();
                    else
                        strSensorZoneHistoryNos += "," + sensorZoneHistoryData.SensorZoneHistory.sensor_zone_hist_sn.ToString();
                }

                SensorServer sensorServer = GetSensorServer(sensorZoneHistoryData.SensorZone.sensor_ty_code, dicSensorServers, dataManager, agentManager);

                // ReactionHistory 생성
                if (sensorServer != null)
                //if (dicSensorServers.TryGetValue(sensorZoneHistoryData.SensorZone.sensor_ty_code, out sensorServer))
                {
                    SensorSignal sensorSignal = new SensorSignal();

                    sensorSignal.Header = Header.CLEAR_DETECT_ALL;
                    sensorSignal.SensorData = 0;
                    sensorSignal.SensorType = sensorZoneHistoryData.SensorZone.sensor_ty_code;
                    sensorSignal.SensorZoneNo = sensorZoneHistoryData.SensorZone.sensor_zone_sn;
                    sensorSignal.TimeStamp = signal.TimeStamp;

                    string strMessage = sensorServer.GetMessage(sensorSignal, sensorZoneHistoryData.SensorZone, sensorZoneHistoryData.Sensor, sensorZoneHistoryData.EquipmentZone, sensorZoneHistoryData.UseSensorAlarm, true, false, out strErrorMessage);

                    if (strErrorMessage != null)
                    {
                        string strTemp;
                        dataManager.BatchRollback(out strTemp);
                        return new MessageResult(false, strErrorMessage);
                    }

                    DateTime time = signal.TimeStamp != null ? (DateTime)signal.TimeStamp : DateTime.Now;
                    if (HistoryManager.MakeSensorReactionHistory(dataManager, sensorZoneHistoryData.SensorZoneHistory, sensorZoneHistoryData.SensorZone, History.ReactionType.EndStatus, time, strMessage, sensorZoneHistoryData.Sensor.zone_sn, signal.UserNo, null, null, out strErrorMessage) == null)
                    {
                        string strTemp;
                        dataManager.BatchRollback(out strTemp);
                        return new MessageResult(false, strErrorMessage);
                    }
                }
            }

            if (strSensorZoneHistoryNos.Length > 0)
            {
                // CurrentAlarm 제거
                string strCondition = string.Format("{0} in ({1})", Current.Fields.sensor_zone_hist_sn, strSensorZoneHistoryNos);

                if (dataManager.GetDelete().Delete<Current>(strCondition, out strErrorMessage) == false)
                {
                    string strTemp;
                    dataManager.BatchRollback(out strTemp);
                    return new MessageResult(false, strErrorMessage);
                }
            }

            if (strSensorZoneNos.Length > 0)
            {
                // SensorZone.IsAlarmStatus 0으로 초기화
                string strCondition = string.Format("{0} in ({1})", SensorZone.Fields.sensor_zone_sn, strSensorZoneNos);

                Dictionary<SensorZone.Fields, object> dicSets = new Dictionary<SensorZone.Fields, object>();
                string strAlarmYn = CustomManager.GetBoolValue(dataManager, false);

                if (strAlarmYn.Length > 1)
                {
                    dicSets[SensorZone.Fields.alarm_yn] = strAlarmYn == "true";
                }
                else
                {
                    dicSets[SensorZone.Fields.alarm_yn] = strAlarmYn == "1" ? 1 : 0;
                }

                if (dataManager.GetUpdate().Update<SensorZone, SensorZone.Fields>(dicSets, strCondition, out strErrorMessage) == false)
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
                return new MessageResult(false, strErrorMessage);
            }

            return new MessageResult(true, "");
        }

        private static SensorServer GetSensorServer(int sensorType, Dictionary<int, SensorServer> dicSensorServers, IDataManager dataManager, IAgentManager agentManager)
        {
            SensorServer sensorServer = null;

            if (dicSensorServers.TryGetValue(sensorType, out sensorServer))
                return sensorServer;

            string strErrorMessage;
            sensorServer = GetSensorServer(dataManager, sensorType, agentManager, out strErrorMessage);

            if (sensorServer != null)
                dicSensorServers[sensorType] = sensorServer;

            return sensorServer;
        }

        // 수동신고
        public static ResponseSensorSignal ProcessManualReport(ManualReport signal, IDataManager dataManager, IAgentManager agentManager)
        {
            string strErrorMessage;
            SensorServer sensorServer = GetSensorServer(dataManager, signal.SensorType, agentManager, out strErrorMessage);

            if (sensorServer == null)
                return new ResponseSensorSignal(false, strErrorMessage);

            return sensorServer.Process_ManualReport(signal, dataManager, agentManager);
        }

        // 1. 알람 복구(수동신고 포함)
        // 2. 탐지된 알람을 실제상황으로 승격한다.(재난신고)
        public static ResponseSensorSignal ProcessManualReport2(ManualReport2 signal, IDataManager dataManager, IAgentManager agentManager)
        {
            string strErrorMessage;
            string strCondition = string.Format("{0} = {1}", Base.Model.History.SensorZone.Fields.sensor_zone_hist_sn, signal.SensorZoneHistoryNo);
            Base.Model.History.SensorZone sensorZoneHistory = dataManager.GetSelect().SelectFirst<Base.Model.History.SensorZone>(strCondition, out strErrorMessage);

            if (sensorZoneHistory == null)
            {
                if (strErrorMessage != null)
                    return new ResponseSensorSignal(false, strErrorMessage);
                else
                    return new ResponseSensorSignal(false, ErrorMessage.ToMessage(ErrorMessage.UNKNOWN_SENSORZONE_HISTORY_ID));
            }

            SensorServer sensorServer = GetSensorServer(dataManager, sensorZoneHistory.sensor_ty_code, agentManager, out strErrorMessage);

            if (sensorServer == null)
                return new ResponseSensorSignal(false, strErrorMessage);

            INotifyManager notifyManager = agentManager != null ? agentManager.GetNotifyManager() : null;
            return sensorServer.ProcessManualReport2(signal, sensorZoneHistory, dataManager, notifyManager);
        }

        public static ResponseSensorSignal NotifyAlarm(NotifyAlarm signal, IDataManager dataManager, IAgentManager agentManager)
        {
            string strErrorMessage;
            string strCondition = string.Format("{0} = {1}", Base.Model.History.SensorZone.Fields.sensor_zone_hist_sn, signal.SensorZoneHistoryNo);
            Base.Model.History.SensorZone sensorZoneHistory = dataManager.GetSelect().SelectFirst<Base.Model.History.SensorZone>(strCondition, out strErrorMessage);

            if (sensorZoneHistory == null)
            {
                if (strErrorMessage != null)
                    return new ResponseSensorSignal(false, strErrorMessage);
                else
                    return new ResponseSensorSignal(false, ErrorMessage.ToMessage(ErrorMessage.UNKNOWN_SENSORZONE_HISTORY_ID));
            }

            SensorServer sensorServer = GetSensorServer(dataManager, sensorZoneHistory.sensor_ty_code, agentManager, out strErrorMessage);

            if (sensorServer == null)
                return new ResponseSensorSignal(false, strErrorMessage);

            // 실제 상황으로 신고
            SensorZone sensorZone = sensorServer.GetFirstSensorZone(dataManager, sensorZoneHistory, out strErrorMessage);

            if (sensorZone == null)
                return new ResponseSensorSignal(false, strErrorMessage);

            string strMessage = sensorServer.GetReportMessage(sensorZoneHistory, sensorZone, out strErrorMessage);
            Base.Model.History.SensorReaction sensorReactionHistory = HistoryManager.ReportAlarm(dataManager, signal.TimeStamp, signal.UserNo, sensorZoneHistory, sensorZone, strMessage, out strErrorMessage);

            if (sensorReactionHistory == null)
                return new ResponseSensorSignal(false, strErrorMessage);

            INotifyManager notifyManager = agentManager != null ? agentManager.GetNotifyManager() : null;
            NotifyManager.NotifyAlarm(notifyManager, dataManager, sensorZoneHistory, SdmsSensor.DetectType.Report, out strErrorMessage);

            ResponseSensorSignal response = new ResponseSensorSignal(true, "");
            response.SensorZoneHistoryNo = sensorReactionHistory.sensor_zone_hist_sn;
            response.ProcessMessage = sensorReactionHistory.mssage;

            return response;
        }

        public static MessageResult CheckTimeoutAlarm(IDataManager dataManager, IAgentManager agentManager)
        {
            JoinManager joinManager = new JoinManager(dataManager);

            string strErrorMessage;
            ArrayList arrDatas = joinManager.JoinCurrentAlarmHistorySensorZone(null, out strErrorMessage);

            if (arrDatas == null)
                return new MessageResult(false, strErrorMessage);

            DateTime dtNow = DateTime.Now;
            int nDataCount = arrDatas.Count;

            bool result = true;
            string strResultMessage = "";

            for (int i=0;i<nDataCount-1;i+=2)
            {
                if (arrDatas[i] is Current && arrDatas[i + 1] is Base.Model.History.SensorZone)
                {
                    var sensorZoneHistory = (Base.Model.History.SensorZone)arrDatas[i + 1];
                    TimeSpan span = dtNow - sensorZoneHistory.tm;

                    if (span.TotalDays >= 1)
                    {
                        ClearAlarm signal = new ClearAlarm();
                        signal.Header = Header.TIMEOUT;
                        signal.SensorZoneHistoryNo = sensorZoneHistory.sensor_zone_hist_sn;

                        ResponseSensorSignal response = ProcessClearAlarm(signal, dataManager, agentManager);

                        if (response.Success == false)
                        {
                            result = false;
                            strResultMessage = response.Message;
                        }
                    }
                }
            }

            return new MessageResult(result, strResultMessage);
        }

        // 센서신호에 대한 처리메시지를 얻어온다.
        protected abstract string GetMessage(SensorSignal signal, SensorZone sensorZone, Sensor sensor, EquipmentZone equipZone, bool useSensorAlarm, bool isReal, bool isAlarm, out string strErrorMessage);
        protected abstract string GetMessage(_ClearAlarm signal, SensorZone sensorZone, Sensor sensor, EquipmentZone equipZone, bool useSensorAlarm, bool isManual, out string strErrorMessage);
        protected abstract string GetMessage(ManualReport signal, SensorZone sensorZone, out string strErrorMessage);
        protected abstract string GetUserResetMessage(Base.Model.History.SensorZone sensorZoneHistory, out string strErrorMessage);
        protected abstract string GetMalfunctionMessage(Base.Model.History.SensorZone sensorZoneHistory, out string strErrorMessage);
        protected abstract string GetReportMessage(Base.Model.History.SensorZone sensorZoneHistory, SensorZone sensorZone, out string strErrorMessage);
        // 같은 영역내에 존재하는 같은 타입의 SensorZone들을 얻어온다.
        protected abstract IEnumerable<SensorZone> GetSameEquipZoneSensorZones(SensorZone sensorZone, out string strErrorMessage);
        protected abstract string GetChangeAlarmDepthMessage(string strAlarmMessage, string strLocation, int prevAlarmDepth, int currentAlarmDepth);

        public virtual string GetSensorValue(SensorSignal sensorSignal, bool isAlarm)
        {
            if (isAlarm)
                return "1";

            return "0";
        }

        public virtual string GetSensorMessage(IDataManager dataManager, SensorSignal sensorSignal, bool isAlarm)
        {
            string strCondition = string.Format("{0} = (Select {1} from {2} where {3} = {4})",
                Sensor.Fields.sensor_sn,
                SensorZone.Fields.sensor_sn,
                SensorZone.TableName,
                SensorZone.Fields.sensor_zone_sn,
                sensorSignal.SensorZoneNo);

            string strErrorMessage;
            Sensor sensor = dataManager.GetSelect().SelectFirst<Sensor>(strCondition, out strErrorMessage);

            if (sensor == null)
            {
                if (strErrorMessage != null)
                    System.Diagnostics.Trace.WriteLine(strErrorMessage);

                if (isAlarm)
                    return "탐지신호를 수신하였습니다.";
                else
                    return "복구신호를 수신하였습니다.";
            }

            if (isAlarm)
                return string.Format("{0}로부터 탐지신호를 수신하였습니다.", sensor.sensor_name);
            else
                return string.Format("{0}로부터 복구신호를 수신하였습니다.", sensor.sensor_name);
        }

        public string GetChangeAlarmDepthMessage(IDataManager dataManager, int sensorZoneHistoryNo, int prevAlarmDepth, int currentAlarmDepth, out Base.Model.History.SensorReaction sensorReactionHistory)
        {
            string strErrorMessage;
            sensorReactionHistory = null;

            string strCondition = string.Format("{0} = {1} and {2} = {3}",
                Base.Model.History.SensorReaction.Fields.sensor_zone_hist_sn, sensorZoneHistoryNo,
                Base.Model.History.SensorReaction.Fields.react_ty_code, History.ReactionType.BeginStatus);

            sensorReactionHistory = dataManager.GetSelect().SelectFirst<Base.Model.History.SensorReaction>(strCondition, out strErrorMessage);

            if (sensorReactionHistory == null)
            {
                if (strErrorMessage != null)
                    System.Diagnostics.Trace.WriteLine(strErrorMessage);

                return null;
            }

            string strAlarmMessage = sensorReactionHistory.mssage;
            
            int index = strAlarmMessage.LastIndexOf("에서");

            if (index < 0)
                return null;

            string strLocation = strAlarmMessage.Substring(0, index).Trim();

            if (strLocation == null)
                return null;

            return GetChangeAlarmDepthMessage(strAlarmMessage, strLocation, prevAlarmDepth, currentAlarmDepth);
        }

        // useSensorAlarm : true이면 센서별 알람 처리
        //                  false이면 영역별 알람 처리
        protected virtual int GetAlarmDepth(SensorSignal signal, SensorZone sensorZone, bool useSensorAlarm, out string strErrorMessage)
        {
            strErrorMessage = null;

            IAgent agent = m_agentManager == null ? null : m_agentManager.GetAgent(m_strSensorType, m_dataManager);

            if (agent != null)
                return agent.GetAlarmDepth(m_dataManager, signal, useSensorAlarm, sensorZone, false);

            if (signal.AlarmDepth != null)
                return (int)signal.AlarmDepth;

            return 2;
        }

        protected virtual ResponseSensorSignal Process_ClearAlarm(_ClearAlarm signal, Base.Model.History.SensorZone sensorZoneHistory, IDataManager dataManager)
        {
            m_dataManager = dataManager;

            bool useSensorAlarm;
            string strErrorMessage;
            EquipmentZone equipZone;
            SensorZone sensorZone = SensorManager.GetFirstSensorZone(sensorZoneHistory.sensor_zone_hist_sn, m_dataManager, out useSensorAlarm, out equipZone, out strErrorMessage);

            if (sensorZone == null)
                return new ResponseSensorSignal(false, strErrorMessage);

            Sensor sensor = GetSensor(sensorZone, out strErrorMessage);

            if (sensor == null)
                return new ResponseSensorSignal(false, strErrorMessage);

            bool isManual = sensor.manual_yn;
            //bool isManual = Base.SDMS.BLL.Process.ManualAlarmChecker.IsManualAlarm(sensorZone, dataManager);

            string strMessage = GetMessage(signal, sensorZone, sensor, equipZone, useSensorAlarm, isManual, out strErrorMessage);
            Base.Model.History.SensorReaction sensorReactionHistory = HistoryManager.ClearAlarm(m_dataManager, signal, sensorZone, sensorZoneHistory, strMessage, out strErrorMessage);

            if (sensorReactionHistory == null)
                return new ResponseSensorSignal(false, strErrorMessage);

            ResponseSensorSignal response = new ResponseSensorSignal(true, "");
            response.ProcessMessage = sensorReactionHistory.mssage;
            response.SensorZoneHistoryNo = sensorReactionHistory.sensor_zone_hist_sn;
            return response;
        }

        protected virtual ResponseSensorSignal Process_SensorSignal(SensorSignal signal, IDataManager dataManager, IAgentManager agentManager)
        {
            m_dataManager = dataManager;
            m_agentManager = agentManager;

            if (signal.Header == Header.SENSOR_DATA)
                return ProcessSensorData(signal, true);
            else if (signal.Header == Header.SENSOR_DATA_TEST)
                return ProcessSensorData(signal, false);

            return new ResponseSensorSignal(false, ErrorMessage.ToMessage(ErrorMessage.UNKNOWN_HEADER));
        }

        protected virtual ResponseSensorSignal Process_ManualReport(ManualReport signal, IDataManager dataManager, IAgentManager agentManager)
        {
            m_dataManager = dataManager;
            return ProcessManualReport(signal, agentManager);
        }

        protected virtual ResponseSensorSignal ProcessManualReport2(ManualReport2 signal, Base.Model.History.SensorZone sensorZoneHistory, IDataManager dataManager, INotifyManager notifyManager)
        {
            m_dataManager = dataManager;
            return ProcessManualReport2(signal, sensorZoneHistory, notifyManager);
        }

        protected Sensor GetSensor(SensorZone sensorZone, out string strErrorMessage)
        {
            string strCondition = string.Format("{0} = {1}", Sensor.Fields.sensor_sn, sensorZone.sensor_sn);
            Sensor sensor = m_dataManager.GetSelect().SelectFirst<Sensor>(strCondition, out strErrorMessage);

            if (sensor == null)
                return null;

            return sensor;
        }

        private ResponseSensorSignal ProcessSensorData(SensorSignal signal, bool isReal)
        {
            bool useSensorAlarm;
            string strErrorMessage;
            EquipmentZone equipZone;
            SensorZone sensorZone = SensorManager.GetSensorZone(signal.SensorZoneNo, m_dataManager, out useSensorAlarm, out equipZone, out strErrorMessage);

            if (sensorZone == null)
                return new ResponseSensorSignal(false, strErrorMessage);

            if (sensorZone.acti == false)
                return new ResponseSensorSignal(true, ErrorMessage.ToMessage(ErrorMessage.NO_ACTIVATE_SENSOR));

            bool isAlarm = signal.SensorData > 0;

            if (useSensorAlarm)
            {
                if (isAlarm)
                {
                    // 센서별 알람처리
                    return ProcessSensorAlarm(signal, isReal, sensorZone, equipZone);
                }
                else
                {
                    // 센서별 알람복구
                    return ProcessSensorClear(signal, isReal, sensorZone, equipZone);
                }
            }

            if (isAlarm)
            {
                // 영역별 알람처리
                return ProcessEquipZoneAlarm(signal, isReal, sensorZone, equipZone);
            }
            else
            {
                // 영역별 알람처리
                return ProcessEquipZoneClear(signal, isReal, sensorZone, equipZone);
            }
        }

        // 센서별 알람복구
        private ResponseSensorSignal ProcessEquipZoneClear(SensorSignal signal, bool isReal, SensorZone sensorZone, EquipmentZone equipZone)
        {
            string strErrorMessage;
            IEnumerable<SensorZone> sensorZoneGroups = GetSameEquipZoneSensorZones(sensorZone, out strErrorMessage);

            if (sensorZoneGroups == null)
                return new ResponseSensorSignal(false, strErrorMessage);

            // 알람이 이미 발생했는지 확인한다.
            Base.Model.History.SensorZone _sensorZoneHistory = HistoryManager.GetSensorZoneHistoryFromSensorZone(m_dataManager, sensorZoneGroups, out strErrorMessage);

            if (_sensorZoneHistory == null && strErrorMessage != null)
                return new ResponseSensorSignal(false, strErrorMessage);
            else if (_sensorZoneHistory == null)
            {
                // 알람이 발생하지 않은 상태다.
                return new ResponseSensorSignal(true, "");
            }

            Sensor sensor = GetSensor(sensorZone, out strErrorMessage);

            if (sensor == null)
                return new ResponseSensorSignal(false, strErrorMessage);

            string strMessage = GetMessage(signal, sensorZone, sensor, equipZone, true, isReal, false, out strErrorMessage);

            if (strMessage == null)
                return new ResponseSensorSignal(false, strErrorMessage);

            int sensorZoneHistoryNo;
            Base.Model.History.SensorReaction sensorReactionHistory = HistoryManager.Transaction_MakeEquipZoneClear(m_dataManager, this, signal, sensorZone, sensor, strMessage, null, out sensorZoneHistoryNo, out strErrorMessage);

            if (sensorReactionHistory == null)
            {
                if (strErrorMessage != null)
                    return new ResponseSensorSignal(false, strErrorMessage);
                else
                {
                    // 아직 알람상태인 센서가 남아있는 상태
                    if (CheckSensorSignalHistory(m_dataManager, sensorZoneHistoryNo, sensorZone, signal, false, out strErrorMessage) == false)
                        return new ResponseSensorSignal(false, strErrorMessage);

                    return new ResponseSensorSignal(true, "");
                }
            }

            if (CheckSensorSignalHistory(m_dataManager, sensorReactionHistory, sensorZone, signal, false, out strErrorMessage) == false)
                return new ResponseSensorSignal(false, strErrorMessage);

            // 탐지메시지 상황전파는 실패하더라도 전체 진행과정에 영향을 주지 않는다.
            // 그래서, SendMessage(...)의 결과값을 검사하지 않는다.
            //int detectType = SdmsSensor.DetectType.Detect;
            //TransferManager.SendMessage(m_dataManager, sensor.SensorType, detectType, sensor.SiteNo, strMessage, TransferManager.TransferType.SMS, out strErrorMessage);

            ResponseSensorSignal response = new ResponseSensorSignal(true, "");
            response.SensorZoneHistoryNo = sensorReactionHistory.sensor_zone_hist_sn;
            response.ProcessMessage = strMessage;
            return response;
        }

        // 영역별 알람처리
        private ResponseSensorSignal ProcessEquipZoneAlarm(SensorSignal signal, bool isReal, SensorZone sensorZone, EquipmentZone equipZone)
        {
            string strErrorMessage;
            IEnumerable<SensorZone> sensorZoneGroups = GetSameEquipZoneSensorZones(sensorZone, out strErrorMessage);

            if (sensorZoneGroups == null)
                return new ResponseSensorSignal(false, strErrorMessage);

            Base.Model.History.SensorZone lastSensorZoneHistory = HistoryManager.GetLastSensorZoneHistory(m_dataManager, out strErrorMessage);

            if (lastSensorZoneHistory == null)
                return new ResponseSensorSignal(false, strErrorMessage);

            // 알람이 이미 발생했는지 확인한다.
            Base.Model.History.SensorZone _sensorZoneHistory = HistoryManager.GetSensorZoneHistoryFromSensorZone(m_dataManager, sensorZoneGroups, out strErrorMessage);

            int alarmDepth = GetAlarmDepth(signal, sensorZone, false, out strErrorMessage);

            if (strErrorMessage != null)
                return new ResponseSensorSignal(false, strErrorMessage);

            if (_sensorZoneHistory == null && strErrorMessage != null)
                return new ResponseSensorSignal(false, strErrorMessage);
            else if (_sensorZoneHistory != null)
            {
                // 이미 같은 영역에서 알람이 발생한 상태다.
                if (HistoryManager.AddSensorZoneToSensorZoneHistory(m_dataManager, this, signal, _sensorZoneHistory, sensorZone, alarmDepth, false, out strErrorMessage) == false)
                    return new ResponseSensorSignal(false, strErrorMessage);

                if (CheckSensorSignalHistory(m_dataManager, _sensorZoneHistory, sensorZone, signal, true, out strErrorMessage) == false)
                    return new ResponseSensorSignal(false, strErrorMessage);

                ResponseSensorSignal _response = new ResponseSensorSignal(true, "");
                _response.SensorZoneHistoryNo = _sensorZoneHistory.sensor_zone_hist_sn;
                return _response;
            }

            Sensor sensor = GetSensor(sensorZone, out strErrorMessage);

            if (sensor == null)
                return new ResponseSensorSignal(false, strErrorMessage);

            string strMessage = GetMessage(signal, sensorZone, sensor, equipZone, true, isReal, true, out strErrorMessage);

            if (strMessage == null)
                return new ResponseSensorSignal(false, strErrorMessage);

            int detectStatus = isReal ? History.DetectStatus.Real : History.DetectStatus.Test;
            Base.Model.History.SensorZone sensorZoneHistory = HistoryManager.Transaction_MakeEquipZoneAlarm(m_dataManager, this, signal, sensorZone, sensor, lastSensorZoneHistory, sensorZoneGroups, alarmDepth, detectStatus, strMessage, null, out strErrorMessage);

            if (sensorZoneHistory == null)
                return new ResponseSensorSignal(false, strErrorMessage);

            if (CheckSensorSignalHistory(m_dataManager, sensorZoneHistory, sensorZone, signal, true, out strErrorMessage) == false)
                return new ResponseSensorSignal(false, strErrorMessage);

            // 탐지메시지 상황전파는 실패하더라도 전체 진행과정에 영향을 주지 않는다.
            // 그래서, SendMessage(...)의 결과값을 검사하지 않는다.
            //int detectType = signal.Header == Header.MANUAL_REPORT ? SdmsSensor.DetectType.Report : SdmsSensor.DetectType.Detect;
            //TransferManager.SendMessage(m_dataManager, sensor.SensorType, detectType, sensor.SiteNo, strMessage, TransferManager.TransferType.SMS, out strErrorMessage);

            ResponseSensorSignal response = new ResponseSensorSignal(true, "");
            response.SensorZoneHistoryNo = sensorZoneHistory.sensor_zone_hist_sn;
            response.ProcessMessage = strMessage;
            return response;
        }

        // 센서별 알람복구
        private ResponseSensorSignal ProcessSensorClear(SensorSignal signal, bool isReal, SensorZone sensorZone, EquipmentZone equipZone)
        {
            string strErrorMessage;
            
            if (sensorZone.alarm_yn == false)
            {
                ResponseSensorSignal _response = new ResponseSensorSignal(true, "");
                _response.ProcessMessage = ErrorMessage.ToMessage(ErrorMessage.NO_ALARM_STATUS);
                return _response;
            }

            Sensor sensor = GetSensor(sensorZone, out strErrorMessage);

            if (sensor == null)
                return new ResponseSensorSignal(false, strErrorMessage);

            string strMessage = GetMessage(signal, sensorZone, sensor, equipZone, true, isReal, false, out strErrorMessage);

            if (strMessage == null)
                return new ResponseSensorSignal(false, strErrorMessage);

            int detectStatus = isReal ? History.DetectStatus.Real : History.DetectStatus.Test;
            Base.Model.History.SensorReaction sensorReactionHistory = HistoryManager.Transaction_MakeSensorClear(m_dataManager, this, signal, sensorZone, sensor, strMessage, null, out strErrorMessage);

            if (sensorReactionHistory == null)
            {
                if (strErrorMessage != null)
                    return new ResponseSensorSignal(false, strErrorMessage);
                else
                    return new ResponseSensorSignal(true, "");
            }

            if (CheckSensorSignalHistory(m_dataManager, sensorReactionHistory, sensorZone, signal, false, out strErrorMessage) == false)
                return new ResponseSensorSignal(false, strErrorMessage);

            // 탐지메시지 상황전파는 실패하더라도 전체 진행과정에 영향을 주지 않는다.
            // 그래서, SendMessage(...)의 결과값을 검사하지 않는다.
            //int detectType = SdmsSensor.DetectType.Detect;
            //TransferManager.SendMessage(m_dataManager, sensor.SensorType, detectType, sensor.SiteNo, strMessage, TransferManager.TransferType.SMS, out strErrorMessage);

            ResponseSensorSignal response = new ResponseSensorSignal(true, "");
            response.SensorZoneHistoryNo = sensorReactionHistory.sensor_zone_hist_sn;
            response.ProcessMessage = strMessage;
            return response;
        }

        // 센서별 알람처리
        private ResponseSensorSignal ProcessSensorAlarm(SensorSignal signal, bool isReal, SensorZone sensorZone, EquipmentZone equipZone)
        {
            string strErrorMessage;
            Base.Model.History.SensorZone lastSensorZoneHistory = HistoryManager.GetLastSensorZoneHistory(m_dataManager, out strErrorMessage);

            if (lastSensorZoneHistory == null)
                return new ResponseSensorSignal(false, strErrorMessage);

            if (sensorZone.alarm_yn)
            {
                // 이미 알람 처리되었다.
                Base.Model.History.SensorZone _sensorZoneHistory = HistoryManager.GetLastSensorZoneHistory(m_dataManager, signal.SensorZoneNo, out strErrorMessage);

                if (_sensorZoneHistory == null)
                    return new ResponseSensorSignal(false, strErrorMessage);

                ResponseSensorSignal _response = new ResponseSensorSignal(true, "");
                _response.SensorZoneHistoryNo = _sensorZoneHistory.sensor_zone_hist_sn;
                return _response;
            }

            int alarmDepth = GetAlarmDepth(signal, sensorZone, true, out strErrorMessage);

            if (strErrorMessage != null)
                return new ResponseSensorSignal(false, strErrorMessage);

            Sensor sensor = GetSensor(sensorZone, out strErrorMessage);

            if (sensor == null)
                return new ResponseSensorSignal(false, strErrorMessage);

            string strMessage = GetMessage(signal, sensorZone, sensor, equipZone, true, isReal, true, out strErrorMessage);

            if (strMessage == null)
                return new ResponseSensorSignal(false, strErrorMessage);

            INotifyManager notifyManager = m_agentManager == null ? null : m_agentManager.GetNotifyManager();
            int detectStatus = isReal ? History.DetectStatus.Real : History.DetectStatus.Test;
            Base.Model.History.SensorZone sensorZoneHistory = HistoryManager.Transaction_MakeSensorAlarm(m_dataManager, this, signal, sensorZone, sensor, lastSensorZoneHistory, alarmDepth, detectStatus, strMessage, null, out strErrorMessage);

            if (sensorZoneHistory == null)
                return new ResponseSensorSignal(false, strErrorMessage);

            if (CheckSensorSignalHistory(m_dataManager, sensorZoneHistory, sensorZone, signal, true, out strErrorMessage) == false)
                return new ResponseSensorSignal(false, strErrorMessage);

            // 탐지메시지 상황전파는 실패하더라도 전체 진행과정에 영향을 주지 않는다.
            // 그래서, SendMessage(...)의 결과값을 검사하지 않는다.
            //int detectType = signal.Header == Header.MANUAL_REPORT ? SdmsSensor.DetectType.Report : SdmsSensor.DetectType.Detect;
            //TransferManager.SendMessage(m_dataManager, sensor.SensorType, detectType, sensor.SiteNo, strMessage, TransferManager.TransferType.SMS, out strErrorMessage);

            ResponseSensorSignal response = new ResponseSensorSignal(true, "");
            response.SensorZoneHistoryNo = sensorZoneHistory.sensor_zone_hist_sn;
            response.ProcessMessage = strMessage;
            return response;
        }

        private bool CheckSensorSignalHistory(IDataManager dataManager, Base.Model.History.SensorReaction sensorReactionHistory, SensorZone sensorZone, SensorSignal sensorSignal, bool isAlarm, out string strErrorMessage)
        {
            return CheckSensorSignalHistory(dataManager, sensorReactionHistory.sensor_zone_hist_sn, sensorZone, sensorSignal, isAlarm, out strErrorMessage);
        }

        private bool CheckSensorSignalHistory(IDataManager dataManager, int sensorZoneHistoryNo, SensorZone sensorZone, SensorSignal sensorSignal, bool isAlarm, out string strErrorMessage)
        {
            string strCondition = string.Format("{0} = {1}", Base.Model.History.SensorZone.Fields.sensor_zone_hist_sn, sensorZoneHistoryNo);
            Base.Model.History.SensorZone sensorZoneHistory = dataManager.GetSelect().SelectFirst<Base.Model.History.SensorZone>(strCondition, out strErrorMessage);

            if (sensorZoneHistory == null)
                return false;

            return CheckSensorSignalHistory(dataManager, sensorZoneHistory, sensorZone, sensorSignal, isAlarm, out strErrorMessage);
        }

        private bool CheckSensorSignalHistory(IDataManager dataManager, Base.Model.History.SensorZone sensorZoneHistory, SensorZone sensorZone, SensorSignal sensorSignal, bool isAlarm, out string strErrorMessage)
        {
            // 가장 최근의 것부터 읽을수 있게 역순으로 얻어온다.
            string strCondition = string.Format("{0} = {1} order by {2} desc",
                Base.Model.History.SensorReaction.Fields.sensor_zone_hist_sn, sensorZoneHistory.sensor_zone_hist_sn,
                Base.Model.History.SensorReaction.Fields.sensor_react_hist_sn);

            IEnumerable<Base.Model.History.SensorReaction> reactionHistories = dataManager.GetSelect().Select<Base.Model.History.SensorReaction>(strCondition, out strErrorMessage);

            if (reactionHistories == null)
                return false;

            DateTime time = sensorSignal.TimeStamp == null ? DateTime.Now : (DateTime)sensorSignal.TimeStamp;

            if (isAlarm)
            {
                foreach (var reactionHistory in reactionHistories)
                {
                    if (reactionHistory.react_ty_code == History.ReactionType.AlarmSignal && reactionHistory.sensor_zone_sn == sensorZone.sensor_zone_sn)
                    {
                        // 이미 처리되었다.
                        return true;
                    }
                    else if (reactionHistory.react_ty_code == History.ReactionType.ClearSignal && reactionHistory.sensor_zone_sn == sensorZone.sensor_zone_sn)
                    {
                        // 알람해제 처리되었으니 이제 알람처리로 바꾼다.
                        break;
                    }
                }

                string strSensorValue = GetSensorValue(sensorSignal, true);
                string strSensorMessage = GetSensorMessage(dataManager, sensorSignal, true);

                if (HistoryManager.MakeSensorReactionHistory(dataManager, sensorZoneHistory, sensorZone, History.ReactionType.AlarmSignal, time, strSensorMessage, null, null, null, strSensorValue, out strErrorMessage) == null)
                    return false;
            }
            else
            {
                foreach (var reactionHistory in reactionHistories)
                {
                    if (reactionHistory.react_ty_code == History.ReactionType.ClearSignal && reactionHistory.sensor_zone_sn == sensorZone.sensor_zone_sn)
                    {
                        // 이미 처리되었다.
                        return true;
                    }
                    else if (reactionHistory.react_ty_code == History.ReactionType.AlarmSignal && reactionHistory.sensor_zone_sn == sensorZone.sensor_zone_sn)
                    {
                        // 알람 처리되었으니 이제 알람해제 처리로 바꾼다.
                        break;
                    }
                }

                string strSensorValue = GetSensorValue(sensorSignal, false);
                string strSensorMessage = GetSensorMessage(dataManager, sensorSignal, false);

                if (HistoryManager.MakeSensorReactionHistory(dataManager, sensorZoneHistory, sensorZone, History.ReactionType.ClearSignal, time, strSensorMessage, null, null, null, strSensorValue, out strErrorMessage) == null)
                    return false;
            }

            return true;
        }

        private ResponseSensorSignal ProcessManualReport(ManualReport signal, IAgentManager agentManager)
        {
            string strErrorMessage;
            SensorZone sensorZone = SensorManager.GetSensorZone(signal, m_dataManager, out strErrorMessage);

            if (sensorZone == null)
            {
                if (strErrorMessage != null)
                    return new ResponseSensorSignal(false, strErrorMessage);
                else
                    return new ResponseSensorSignal(false, "시스템 데이터베이스에 수동신고를 위한 SensorData가 존재하지 않습니다.");
            }

            string strMessage = GetMessage(signal, sensorZone, out strErrorMessage);

            if (strMessage == null)
                return new ResponseSensorSignal(false, strErrorMessage);

            if (signal.AlarmDepth == null)
            {
                IAgent agent = GetAgent(agentManager, m_strSensorType, m_dataManager);

                if (agent != null)
                    signal.AlarmDepth = agent.GetAlarmDepth(m_dataManager, ToSensorSignal(signal, sensorZone), false, sensorZone, true);
            }

            INotifyManager notifyManager = m_agentManager == null ? null : m_agentManager.GetNotifyManager();
            Base.Model.History.SensorZone sensorZoneHistory = HistoryManager.ProcessManualReport(notifyManager, m_dataManager, signal, sensorZone, strMessage, out strErrorMessage);

            if (sensorZoneHistory == null)
                return new ResponseSensorSignal(false, strErrorMessage);

            ResponseSensorSignal response = new ResponseSensorSignal(true, "");
            response.SensorZoneHistoryNo = sensorZoneHistory.sensor_zone_hist_sn;
            response.ProcessMessage = strMessage;
            return response;
        }

        private SensorSignal ToSensorSignal(ManualReport data, SensorZone sensorZone)
        {
            SensorSignal signal = new SensorSignal();

            signal.AlarmDepth = data.AlarmDepth;
            signal.Header = Header.MANUAL_REPORT;
            signal.SensorData = -1;
            signal.SensorType = data.SensorType;
            signal.SensorValue = null;
            signal.SensorZoneNo = sensorZone.sensor_zone_sn;
            signal.TimeStamp = data.TimeStamp;
            signal.UserNo = data.UserNo;

            return signal;
        }

        private ResponseSensorSignal ProcessManualReport2(ManualReport2 signal, Base.Model.History.SensorZone sensorZoneHistory, INotifyManager notifyManager)
        {
            string strErrorMessage = null;
            Base.Model.History.SensorReaction sensorReactionHistory = null;

            if (signal.ReportType == (int)ManualReport2.ReportTypes.ClearAlarm)
            {
                // 사용자 복구
                string strMessage = GetUserResetMessage(sensorZoneHistory, out strErrorMessage);
                sensorReactionHistory = HistoryManager.ClearAlarm(m_dataManager, signal, sensorZoneHistory, History.ReactionType.UserReset, strMessage, out strErrorMessage);
            }
            else if (signal.ReportType == (int)ManualReport2.ReportTypes.ReportAlarm)
            {
                // 실제상황으로 신고
                SensorZone sensorZone = GetFirstSensorZone(m_dataManager, sensorZoneHistory, out strErrorMessage);

                if (sensorZone == null)
                    return new ResponseSensorSignal(false, strErrorMessage);

                string strMessage = GetReportMessage(sensorZoneHistory, sensorZone, out strErrorMessage);
                sensorReactionHistory = HistoryManager.ReportAlarm(m_dataManager, signal.TimeStamp, signal.UserNo, sensorZoneHistory, sensorZone, strMessage, out strErrorMessage);

                if (sensorReactionHistory != null)
                    NotifyManager.NotifyAlarm(notifyManager, m_dataManager, sensorZoneHistory, SdmsSensor.DetectType.Report, out strErrorMessage);
            }
            else if (signal.ReportType == (int)ManualReport2.ReportTypes.Malfunction)
            {
                // 오작동으로 신고
                string strMessage = GetMalfunctionMessage(sensorZoneHistory, out strErrorMessage);
                sensorReactionHistory = HistoryManager.ClearAlarm(m_dataManager, signal, sensorZoneHistory, History.ReactionType.Malfunction, strMessage, out strErrorMessage);
            }

            if (sensorReactionHistory == null)
                return new ResponseSensorSignal(false, strErrorMessage);

            ResponseSensorSignal response = new ResponseSensorSignal(true, "");
            response.SensorZoneHistoryNo = sensorReactionHistory.sensor_zone_hist_sn;
            response.ProcessMessage = sensorReactionHistory.mssage;
            return response;
        }

        // Error를 발생시킨 첫번째 SensorZone을 얻어온다.
        protected SensorZone GetFirstSensorZone(IDataManager dataManager, Base.Model.History.SensorZone sensorZoneHistory, out string strErrorMessage)
        {
            string strCondition = string.Format("{0} in (Select {1} from {2} where {3} = {4} and {5} = {6})",
                SensorZone.Fields.sensor_zone_sn,
                Base.Model.History.SensorReaction.Fields.sensor_zone_sn,
                Base.Model.History.SensorReaction.TableName,
                Base.Model.History.SensorReaction.Fields.sensor_zone_hist_sn,
                sensorZoneHistory.sensor_zone_hist_sn,
                Base.Model.History.SensorReaction.Fields.react_ty_code,
                History.ReactionType.BeginStatus);

            IEnumerable<SensorZone> sensorZones = dataManager.GetSelect().Select<SensorZone>(strCondition, out strErrorMessage);

            if (sensorZones == null)
                return null;

            foreach (var sensorZone in sensorZones)
            {
                return sensorZone;
            }

            strErrorMessage = "알람이 발생한 센서를 찾을수 없습니다.";
            return null;
        }

        public IAgent GetAgent()
        {
            return GetAgent(m_agentManager, m_strSensorType, m_dataManager);
        }

        public static IAgent GetAgent(IAgentManager agentManager, string strSensorType, IDataManager dataManager)
        {
            if (agentManager == null)
                return null;

            return agentManager.GetAgent(strSensorType, dataManager);
        }

        public INotifyManager GetNotifyManager()
        {
            if (m_agentManager == null)
                return null;

            return m_agentManager.GetNotifyManager();
        }
    }
}
