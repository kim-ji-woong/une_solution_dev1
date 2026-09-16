using System;
using System.Collections.Generic;
using Base.DAL;
using dnsDapperDBUtil.DataAccessLayer.IDAL;
using Base.Model.History;
using Base.Model.Alarm;
using Base.Model.Spatial;
using dnsDapperDBUtil.Manager;
using dnsData.CommonCode;
using SOPWebServer.IBLL.Models.Request;
using SOPWebServer.IBLL.Interface;

namespace SOPWebServer.BLL.Process
{
    using Server;

    class HistoryManager
    {
        public static SensorZone GetLastSensorZoneHistory(IDataManager dataManager, out string strErrorMessage)
        {
            string strCondition = string.Format("{0} = (select max({0}) from {1})", SensorZone.Fields.sensor_zone_hist_sn, SensorZone.TableName);
            IEnumerable<SensorZone> sensorZoneHistories = dataManager.GetSelect().Select<SensorZone>(strCondition, out strErrorMessage);

            if (sensorZoneHistories == null)
                return null;

            foreach (SensorZone sensorZoneHistory in sensorZoneHistories)
            {
                return sensorZoneHistory;
            }

            SensorZone lastSensorZoneHistory = new SensorZone();
            lastSensorZoneHistory.sensor_zone_hist_sn = -1;
            return lastSensorZoneHistory;
        }

        public static SensorZone GetLastSensorZoneHistory(IDataManager dataManager, int sensorZoneNo, out string strErrorMessage)
        {
            string strCondition = string.Format("{0} = (select max(a.{0}) from {1} a inner join {2} b on a.{0} = b.{3} where b.{4} = {5})",
                SensorZone.Fields.sensor_zone_hist_sn,
                SensorZone.TableName,
                SensorZoneDetail.TableName,
                SensorZoneDetail.Fields.sensor_zone_hist_sn,
                SensorZoneDetail.Fields.sensor_zone_sn,
                sensorZoneNo);

            IEnumerable<SensorZone> sensorZoneHistories = dataManager.GetSelect().Select<SensorZone>(strCondition, out strErrorMessage);

            if (sensorZoneHistories == null)
                return null;

            foreach (SensorZone sensorZoneHistory in sensorZoneHistories)
            {
                return sensorZoneHistory;
            }

            SensorZone lastSensorZoneHistory = new SensorZone();
            lastSensorZoneHistory.sensor_zone_hist_sn = -1;
            return lastSensorZoneHistory;
        }

        // 마지막 SensorZoneHistory 이후에 같은 센서의 알람이 있는가?
        // Return 값 : true(같은 센서의 알람이 존재하지 않는다.)
        //             false(이미 같은 센서의 알람이 존재한다.)
        private static bool CheckSensorZoneHistoryFromLast(IDataManager dataManager, int sensorZoneNo, SensorZone newSensorZoneHistory, SensorZone lastSensorZoneHistory, out string strErrorMessage)
        {
            string strCondition = string.Format("{0} in (select a.{0} from {1} a inner join {2} b on a.{0} = b.{3} where a.{0} > {4})",
                SensorZone.Fields.sensor_zone_hist_sn,
                SensorZone.TableName,
                SensorZoneDetail.TableName,
                SensorZoneDetail.Fields.sensor_zone_hist_sn,
                lastSensorZoneHistory.sensor_zone_hist_sn);

            IEnumerable<SensorZone> sensorZoneHistories = dataManager.GetSelect().Select<SensorZone>(strCondition, out strErrorMessage);

            if (sensorZoneHistories == null)
                return false;

            foreach (SensorZone sensorZoneHistory in sensorZoneHistories)
            {
                if (sensorZoneHistory.sensor_zone_hist_sn == newSensorZoneHistory.sensor_zone_hist_sn)
                    continue;

                return false;
            }

            return true;
        }

        // 마지막 SensorZoneHistory 이후에 같은 SensorZoneGroup의 알람이 있는가?
        // Return 값 : null(같은 SensorZoneGroup의 알람이 존재하지 않는다.)
        //             not null(이미 같은 SensorZoneGroup의 알람이 존재한다.)
        private static SensorZone CheckSensorZoneHistoryFromLast(IDataManager dataManager, SensorZone newSensorZoneHistory, SensorZone lastSensorZoneHistory, IEnumerable<Base.Model.Sensor.SensorZone> sensorZoneGroups, out string strErrorMessage)
        {
            // 알람이 이미 발생했는지 확인한다.
            IEnumerable<SensorZone> sensorZoneHistories = HistoryManager.GetSensorZoneHistoryFromSensorZones(dataManager, sensorZoneGroups, lastSensorZoneHistory, out strErrorMessage);

            if (sensorZoneHistories == null)
                return null;

            foreach (SensorZone sensorZoneHistory in sensorZoneHistories)
            {
                if (sensorZoneHistory.sensor_zone_hist_sn == newSensorZoneHistory.sensor_zone_hist_sn)
                    continue;

                return sensorZoneHistory;
            }

            return null;
        }

        // 같은 SensorZoneHistory가 이미 복구되었는지 확인한다.
        // Return 값 : true(같은 알람에 대한 복구이력이 존재하지 않는다.)
        //             false(이미 같은 알람에 대한 복구이력이 존재한다.)
        private static bool CheckSensorReactionHistory(IDataManager dataManager, SensorReaction sensorReactionHistory, out string strErrorMessage)
        {
            string strCondition = string.Format("{0} = {1}",
                SensorReaction.Fields.sensor_react_hist_sn,
                sensorReactionHistory.sensor_zone_hist_sn);

            IEnumerable<SensorReaction> sensorReactionHistories = dataManager.GetSelect().Select<SensorReaction>(strCondition, out strErrorMessage);

            if (sensorReactionHistories == null)
                return false;

            foreach (SensorReaction reactionHistory in sensorReactionHistories)
            {
                if (reactionHistory.sensor_react_hist_sn == sensorReactionHistory.sensor_react_hist_sn)
                    continue;

                if (reactionHistory.react_ty_code == History.ReactionType.EndStatus ||
                    reactionHistory.react_ty_code == History.ReactionType.UserReset ||
                    reactionHistory.react_ty_code == History.ReactionType.TimeOut)
                    return false;
            }

            return true;
        }

        public static SensorReaction Transaction_MakeSensorClear(IDataManager dataManager, SensorServer sensorServer, SensorSignal signal, Base.Model.Sensor.SensorZone sensorZone, Base.Model.Sensor.Sensor sensor, string strMessage, string strMemo, out string strErrorMessage)
        {
            dataManager = dataManager.Clone();

            if (dataManager.BeginBatch(out strErrorMessage) == false)
            {
                strErrorMessage = ErrorMessage.ToMessage(ErrorMessage.FAIL_BEGIN_TRANSACTION);
                return null;
            }

            sensorZone.alarm_yn = false;

            if (dataManager.GetUpdate().Update<Base.Model.Sensor.SensorZone>(sensorZone, null, out strErrorMessage) == false)
            {
                string strTemp;
                dataManager.BatchRollback(out strTemp);
                return null;
            }

            SensorZone sensorZoneHistory = GetLastSensorZoneHistory(dataManager, sensorZone.sensor_zone_sn, out strErrorMessage);

            if (sensorZoneHistory == null)
            {
                string strTemp;
                dataManager.BatchRollback(out strTemp);
                return null;
            }

            string strCondition = string.Format("{0} = {1}", Current.Fields.sensor_zone_hist_sn, sensorZoneHistory.sensor_zone_hist_sn);
            if (dataManager.GetDelete().Delete<Current>(strCondition, out strErrorMessage) == false)
            {
                string strTemp;
                dataManager.BatchRollback(out strTemp);
                return null;
            }

            DateTime timeStamp = signal.TimeStamp != null ? (DateTime)signal.TimeStamp : DateTime.Now;
            SensorReaction sensorReactionHistory = MakeSensorReactionHistory(dataManager, sensorZoneHistory, sensorZone, History.ReactionType.EndStatus, timeStamp, strMessage, sensor.zone_sn, signal.UserNo, null, null, out strErrorMessage);

            if (sensorReactionHistory == null)
            {
                string strTemp;
                dataManager.BatchRollback(out strTemp);
                return null;
            }

            // sensorReactionHistory 이전에 이미 복구처리되었는지 확인한다.
            if (CheckSensorReactionHistory(dataManager, sensorReactionHistory, out strErrorMessage) == false)
            {
                // 이미 복구처리되었으니 방금 만든 sensorReactionHistory는 삭제한다.
                if (dataManager.GetDelete().Delete<SensorReaction>(sensorReactionHistory, null, out strErrorMessage) == false)
                {
                    string strTemp;
                    dataManager.BatchRollback(out strTemp);
                    return null;
                }

                if (dataManager.BatchCommit(out strErrorMessage) == false)
                {
                    string strTemp;
                    dataManager.BatchRollback(out strTemp);
                    return null;
                }

                // errorMessage가 null이기 때문에 정상처리 되었다.
                // SensorReactionHistory가 새로 만들어지지 않았을 뿐이다.
                return null;
            }

            if (dataManager.BatchCommit(out strErrorMessage) == false)
            {
                string strTemp;
                dataManager.BatchRollback(out strTemp);
                return null;
            }

            return sensorReactionHistory;
        }

        public static SensorZone Transaction_MakeSensorAlarm(IDataManager dataManager, SensorServer sensorServer, SensorSignal signal, Base.Model.Sensor.SensorZone sensorZone, Base.Model.Sensor.Sensor sensor, SensorZone lastSensorZoneHistory, int alarmDepth, int? detectStatus, string strMessage, string strMemo, out string strErrorMessage)
        {
            dataManager = dataManager.Clone();

            if (dataManager.BeginBatch(out strErrorMessage) == false)
            {
                strErrorMessage = ErrorMessage.ToMessage(ErrorMessage.FAIL_BEGIN_TRANSACTION);
                return null;
            }

            sensorZone.alarm_yn = true;

            if (dataManager.GetUpdate().Update<Base.Model.Sensor.SensorZone>(sensorZone, null, out strErrorMessage) == false)
            {
                string strTemp;
                dataManager.BatchRollback(out strTemp);
                return null;
            }

            SensorZone sensorZoneHistory = new SensorZone();

            if (detectStatus != null)
                sensorZoneHistory.detct_sttus_optn_code = (int)CodeType.DetectStatus;

            sensorZoneHistory.detct_sttus_code = detectStatus;
            sensorZoneHistory.sensor_ty_optn_code = (int)CodeType.SensorType;
            sensorZoneHistory.sensor_ty_code = sensorZone.sensor_ty_code;
            sensorZoneHistory.tm = signal.TimeStamp != null ? (DateTime)signal.TimeStamp : DateTime.Now;
            sensorZoneHistory.zone_sn = sensor.zone_sn;
            sensorZoneHistory.memo = strMemo;
            sensorZoneHistory.site_sn = sensor.site_sn;

            int addedID;

            if (dataManager.GetCreate().Insert<SensorZone>(sensorZoneHistory, out addedID, out strErrorMessage) == false)
            {
                string strTemp;
                dataManager.BatchRollback(out strTemp);
                return null;
            }

            sensorZoneHistory.sensor_zone_hist_sn = addedID;

            // 마지막 SensorZoneHistory 이후에 같은 센서의 알람이 있는가?
            if (CheckSensorZoneHistoryFromLast(dataManager, sensorZone.sensor_zone_sn, sensorZoneHistory, lastSensorZoneHistory, out strErrorMessage) == false)
            {
                if (strErrorMessage != null)
                {
                    string strTemp;
                    dataManager.BatchRollback(out strTemp);
                    return null;
                }

                if (dataManager.GetDelete().Delete<SensorZone>(sensorZoneHistory, null, out strErrorMessage) == false)
                {
                    string strTemp;
                    dataManager.BatchRollback(out strTemp);
                    return null;
                }

                // 이미 같은 센서에 대한 SensorZoneHistory가 존재한다.
                // 즉, 이전에 이미 알람처리가 되었다.
                dataManager.BatchCommit(out strErrorMessage);
                return null;
            }

            if (MakeSensorZoneList(dataManager, sensorZoneHistory.sensor_zone_hist_sn, sensorZone.sensor_zone_sn, sensorZoneHistory.tm, out strErrorMessage) == false)
            {
                string strTemp;
                dataManager.BatchRollback(out strTemp);
                return null;
            }

            int detectType = signal.Header != Header.MANUAL_REPORT ? SdmsSensor.DetectType.Detect : SdmsSensor.DetectType.Report;

            if (MakeCurrentAlarm(dataManager, sensorZoneHistory, sensorZone.sensor_zone_sn, alarmDepth, detectType, out strErrorMessage) == false)
            {
                string strTemp;
                dataManager.BatchRollback(out strTemp);
                return null;
            }

            if (MakeSensorReactionHistory(dataManager, sensorZoneHistory, sensorZone, History.ReactionType.BeginStatus, sensorZoneHistory.tm, strMessage, sensor.zone_sn, signal.UserNo, alarmDepth, signal.SensorValue, out strErrorMessage) == null)
            {
                string strTemp;
                dataManager.BatchRollback(out strTemp);
                return null;
            }

            if (dataManager.BatchCommit(out strErrorMessage) == false)
            {
                string strTemp;
                dataManager.BatchRollback(out strTemp);
                return null;
            }

            INotifyManager notifyManager = sensorServer.GetNotifyManager();

            NotifyManager.NotifyAlarm(notifyManager, dataManager, sensorZoneHistory, SdmsSensor.DetectType.Detect, out strErrorMessage);
            return sensorZoneHistory;
        }

        public static SensorZone Transaction_MakeEquipZoneAlarm(IDataManager dataManager, SensorServer sensorServer, SensorSignal signal, Base.Model.Sensor.SensorZone sensorZone, Base.Model.Sensor.Sensor sensor, SensorZone lastSensorZoneHistory, IEnumerable<Base.Model.Sensor.SensorZone> sensorZoneGroups, int alarmDepth, int? detectStatus, string strMessage, string strMemo, out string strErrorMessage)
        {
            dataManager = dataManager.Clone();

            if (dataManager.BeginBatch(out strErrorMessage) == false)
            {
                strErrorMessage = ErrorMessage.ToMessage(ErrorMessage.FAIL_BEGIN_TRANSACTION);
                return null;
            }

            sensorZone.alarm_yn = true;

            if (dataManager.GetUpdate().Update<Base.Model.Sensor.SensorZone>(sensorZone, null, out strErrorMessage) == false)
            {
                string strTemp;
                dataManager.BatchRollback(out strTemp);
                return null;
            }

            SensorZone sensorZoneHistory = new SensorZone();

            if (detectStatus != null)
                sensorZoneHistory.detct_sttus_optn_code = (int)CodeType.DetectStatus;

            sensorZoneHistory.detct_sttus_code = detectStatus;
            sensorZoneHistory.sensor_ty_optn_code = (int)CodeType.SensorType;
            sensorZoneHistory.sensor_ty_code = sensorZone.sensor_ty_code;
            sensorZoneHistory.tm = signal.TimeStamp != null ? (DateTime)signal.TimeStamp : DateTime.Now;
            sensorZoneHistory.zone_sn = sensor.zone_sn;
            sensorZoneHistory.memo = strMemo;
            sensorZoneHistory.site_sn = sensor.site_sn;

            int addedID;

            if (dataManager.GetCreate().Insert<SensorZone>(sensorZoneHistory, out addedID, out strErrorMessage) == false)
            {
                string strTemp;
                dataManager.BatchRollback(out strTemp);
                return null;
            }

            sensorZoneHistory.sensor_zone_hist_sn = addedID;

            // 마지막 SensorZoneHistory 이후에 같은 SensorZoneGroup의 알람이 있는가?
            SensorZone prevSensorZoneHistory = CheckSensorZoneHistoryFromLast(dataManager, sensorZoneHistory, lastSensorZoneHistory, sensorZoneGroups, out strErrorMessage);

            if (prevSensorZoneHistory != null)
            {
                // 이미 알람이 발생한 상태다.
                if (strErrorMessage != null)
                {
                    string strTemp;
                    dataManager.BatchRollback(out strTemp);
                    return null;
                }

                if (dataManager.GetDelete().Delete<SensorZone>(sensorZoneHistory, null, out strErrorMessage) == false)
                {
                    string strTemp;
                    dataManager.BatchRollback(out strTemp);
                    return null;
                }

                if (HistoryManager.AddSensorZoneToSensorZoneHistory(dataManager, sensorServer, signal, sensorZoneHistory, sensorZone, alarmDepth, true, out strErrorMessage) == false)
                {
                    // Rollback은 AddSensorZoneToSensorZoneHistory(...)에서 이미 했다.
                    return null;
                }

                // Commit은 AddSensorZoneToSensorZoneHistory(...)에서 이미 했다.
                return prevSensorZoneHistory;
            }

            if (MakeSensorZoneList(dataManager, sensorZoneHistory.sensor_zone_hist_sn, sensorZone.sensor_zone_sn, sensorZoneHistory.tm, out strErrorMessage) == false)
            {
                string strTemp;
                dataManager.BatchRollback(out strTemp);
                return null;
            }

            int detectType = signal.Header != Header.MANUAL_REPORT ? SdmsSensor.DetectType.Detect : SdmsSensor.DetectType.Report;

            if (MakeCurrentAlarm(dataManager, sensorZoneHistory, sensorZone.sensor_zone_sn, alarmDepth, detectType, out strErrorMessage) == false)
            {
                string strTemp;
                dataManager.BatchRollback(out strTemp);
                return null;
            }

            if (MakeSensorReactionHistory(dataManager, sensorZoneHistory, sensorZone, History.ReactionType.BeginStatus, sensorZoneHistory.tm, strMessage, sensor.zone_sn, signal.UserNo, alarmDepth, signal.SensorValue, out strErrorMessage) == null)
            {
                string strTemp;
                dataManager.BatchRollback(out strTemp);
                return null;
            }

            if (dataManager.BatchCommit(out strErrorMessage) == false)
            {
                string strTemp;
                dataManager.BatchRollback(out strTemp);
                return null;
            }

            INotifyManager notifyManager = sensorServer.GetNotifyManager();
            NotifyManager.NotifyAlarm(notifyManager, dataManager, sensorZoneHistory, SdmsSensor.DetectType.Detect, out strErrorMessage);
            return sensorZoneHistory;
        }

        public static SensorReaction Transaction_MakeEquipZoneClear(IDataManager dataManager, SensorServer sensorServer, SensorSignal signal, Base.Model.Sensor.SensorZone sensorZone, Base.Model.Sensor.Sensor sensor, string strMessage, string strMemo, out int sensorZoneHistoryNo, out string strErrorMessage)
        {
            sensorZoneHistoryNo = -1;
            dataManager = dataManager.Clone();

            if (dataManager.BeginBatch(out strErrorMessage) == false)
            {
                strErrorMessage = ErrorMessage.ToMessage(ErrorMessage.FAIL_BEGIN_TRANSACTION);
                return null;
            }

            sensorZone.alarm_yn = false;

            if (dataManager.GetUpdate().Update<Base.Model.Sensor.SensorZone>(sensorZone, null, out strErrorMessage) == false)
            {
                string strTemp;
                dataManager.BatchRollback(out strTemp);
                return null;
            }

            SensorZone sensorZoneHistory = GetLastSensorZoneHistory(dataManager, sensorZone.sensor_zone_sn, out strErrorMessage);

            if (sensorZoneHistory == null)
            {
                string strTemp;
                dataManager.BatchRollback(out strTemp);
                return null;
            }

            string strCondition = string.Format("{0} = {1} and {2} = {3}",
                Current.Fields.sensor_zone_hist_sn, sensorZoneHistory.sensor_zone_hist_sn,
                Current.Fields.sensor_zone_sn, sensorZone.sensor_zone_sn);

            if (dataManager.GetDelete().Delete<Current>(strCondition, out strErrorMessage) == false)
            {
                string strTemp;
                dataManager.BatchRollback(out strTemp);
                return null;
            }

            // 같은 SensorZoneHistory에 다른 CurrentAlarm이 존재하는가?
            IEnumerable<Current> alarms = GetCurrentAlarms(dataManager, sensorZoneHistory.sensor_zone_hist_sn, out strErrorMessage);

            if (alarms == null)
            {
                string strTemp;
                dataManager.BatchRollback(out strTemp);
                return null;
            }

            if (IsEmpty(alarms) == false)
            {
                // 다른 복구이력이 존재하는 경우
                SensorReaction _sensorReactionHistory = GetLastSensorReactionHistory(dataManager, sensorZoneHistory.sensor_zone_hist_sn, out strErrorMessage);

                if (_sensorReactionHistory == null)
                {
                    string strTemp;
                    dataManager.BatchRollback(out strTemp);
                    return null;
                }

                // 알람단계가 바뀌었는지 확인한다.
                if (CheckAlarmDepth(dataManager, sensorServer, signal, sensorZone, sensorZoneHistory, alarms, out strErrorMessage) == false)
                {
                    string strTemp;
                    dataManager.BatchRollback(out strTemp);
                    return null;
                }

                if (dataManager.BatchCommit(out strErrorMessage) == false)
                {
                    string strTemp;
                    dataManager.BatchRollback(out strTemp);
                    return null;
                }

                foreach (var alarm in alarms)
                {
                    sensorZoneHistoryNo = alarm.sensor_zone_hist_sn;
                    break;
                }

                // errorMessage가 null이기 때문에 정상처리 되었다.
                // SensorReactionHistory가 새로 만들어지지 않았을 뿐이다.
                return null;
            }

            DateTime timeStamp = signal.TimeStamp != null ? (DateTime)signal.TimeStamp : DateTime.Now;
            SensorReaction sensorReactionHistory = MakeSensorReactionHistory(dataManager, sensorZoneHistory, sensorZone, History.ReactionType.EndStatus, timeStamp, strMessage, sensor.zone_sn, signal.UserNo, null, null, out strErrorMessage);

            if (sensorReactionHistory == null)
            {
                string strTemp;
                dataManager.BatchRollback(out strTemp);
                return null;
            }

            // sensorReactionHistory 이전에 이미 복구처리되었는지 확인한다.
            if (CheckSensorReactionHistory(dataManager, sensorReactionHistory, out strErrorMessage) == false)
            {
                // 이미 복구처리되었으니 방금 만든 sensorReactionHistory는 삭제한다.
                if (dataManager.GetDelete().Delete<SensorReaction>(sensorReactionHistory, null, out strErrorMessage) == false)
                {
                    string strTemp;
                    dataManager.BatchRollback(out strTemp);
                    return null;
                }

                if (dataManager.BatchCommit(out strErrorMessage) == false)
                {
                    string strTemp;
                    dataManager.BatchRollback(out strTemp);
                    return null;
                }

                // errorMessage가 null이기 때문에 정상처리 되었다.
                // SensorReactionHistory가 새로 만들어지지 않았을 뿐이다.
                sensorZoneHistoryNo = sensorReactionHistory.sensor_zone_hist_sn;
                return null;
            }

            if (dataManager.BatchCommit(out strErrorMessage) == false)
            {
                string strTemp;
                dataManager.BatchRollback(out strTemp);
                return null;
            }

            return sensorReactionHistory;
        }

        // 복구신호로 인하여 알람 단계가 변경되었는지 확인하여 변경되었으면 SensorReactionHistory를 추가하고, 알람단계를 업데이트 한다.
        private static bool CheckAlarmDepth(IDataManager dataManager, SensorServer sensorServer, SensorSignal sensorSignal, Base.Model.Sensor.SensorZone sensorZone, SensorZone sensorZoneHistory, IEnumerable<Current> alarms, out string strErrorMessage)
        {
            strErrorMessage = null;
            IAgent agent = sensorServer.GetAgent();

            if (agent != null)
            {
                Current alarm = null;

                foreach (Current _alarm in alarms)
                {
                    alarm = _alarm;
                    break;
                }

                if (alarm == null)
                    return true;

                int prevAlarmDepth = alarm.alarm_level;
                int alarmDepth = agent.GetAlarmDepth(dataManager, sensorSignal, false, sensorZone, false);

                if (prevAlarmDepth != alarmDepth)
                {
                    SensorReaction sensorReactionHistory;
                    string strMessage = sensorServer.GetChangeAlarmDepthMessage(dataManager, alarm.sensor_zone_hist_sn, prevAlarmDepth, alarmDepth, out sensorReactionHistory);

                    if (strMessage != null)
                    {
                        if (MakeSensorReactionHistory(dataManager, sensorZoneHistory, sensorZone, History.ReactionType.ChangeAlarmDepth, DateTime.Now, strMessage, sensorReactionHistory.zone_sn, null, alarmDepth, sensorSignal.SensorValue, out strErrorMessage) == null)
                            return false;

                        string strCondition = string.Format("{0} = {1}", Current.Fields.sensor_zone_hist_sn, alarm.sensor_zone_hist_sn);

                        Dictionary<Current.Fields, object> dicSets = new Dictionary<Current.Fields, object>();
                        dicSets[Current.Fields.alarm_level] = alarmDepth;

                        if (dataManager.GetUpdate().Update<Current, Current.Fields>(dicSets, strCondition, out strErrorMessage) == false)
                            return false;
                    }
                }
            }

            return true;
        }

        private static SensorReaction GetLastSensorReactionHistory(IDataManager dataManger, int sensorZoneHistoryNo, out string strErrorMessage)
        {
            string strCondition = string.Format("{0} = (Select max({0}) from {1} where {2} = {3})",
                SensorReaction.Fields.sensor_react_hist_sn,
                SensorReaction.TableName,
                SensorReaction.Fields.sensor_zone_hist_sn,
                sensorZoneHistoryNo);

            return dataManger.GetSelect().SelectFirst<SensorReaction>(strCondition, out strErrorMessage);
        }

        private static bool IsEmpty<T>(IEnumerable<T> list)
        {
            foreach (T t in list)
            {
                return false;
            }

            return true;
        }

        private static IEnumerable<Current> GetCurrentAlarms(IDataManager dataManager, int sensorZoneHistoryNo, out string strErrorMessage)
        {
            string strCondition = string.Format("{0} = {1}", Current.Fields.sensor_zone_hist_sn, sensorZoneHistoryNo);
            return dataManager.GetSelect().Select<Current>(strCondition, out strErrorMessage);
        }

        public static SensorReaction MakeSensorReactionHistory(IDataManager dataManager, SensorZone sensorZoneHistory, Base.Model.Sensor.SensorZone sensorZone, int reactionType, DateTime timeStamp, string strMessage, int? zoneNo, int? userNo, int? alarmDepth, string strSensorValue, out string strErrorMessage)
        {
            SensorReaction sensorReactionHistory = new SensorReaction();

            sensorReactionHistory.sensor_zone_hist_sn = sensorZoneHistory.sensor_zone_hist_sn;
            sensorReactionHistory.react_ty_optn_code = (int)CodeType.ReactionType;
            sensorReactionHistory.react_ty_code = reactionType;
            sensorReactionHistory.tm = timeStamp;
            sensorReactionHistory.mssage = strMessage;
            sensorReactionHistory.zone_sn = zoneNo;
            sensorReactionHistory.eqp_zone_sn = sensorZone == null ? null : sensorZone.eqp_zone_sn;
            sensorReactionHistory.sensor_zone_sn = sensorZone == null ? null : (int?)sensorZone.sensor_zone_sn;
            sensorReactionHistory.user_sn = userNo;
            sensorReactionHistory.alarm_level = alarmDepth;
            sensorReactionHistory.sensor_value = strSensorValue;

            int addedID;

            if (dataManager.GetCreate().Insert<SensorReaction>(sensorReactionHistory, out addedID, out strErrorMessage) == false)
                return null;

            sensorReactionHistory.sensor_react_hist_sn = addedID;
            return sensorReactionHistory;
        }

        private static bool MakeCurrentAlarm(IDataManager dataManager, SensorZone sensorZoneHistory, int sensorZoneNo, int alarmDepth, int detectType, out string strErrorMessage)
        {
            Current alarm = new Current();

            alarm.sensor_zone_hist_sn = sensorZoneHistory.sensor_zone_hist_sn;
            alarm.sensor_zone_sn = sensorZoneNo;
            alarm.detct_ty_optn_code = (int)CodeType.DetectType;
            alarm.detct_ty_code = detectType;
            alarm.alarm_tm = sensorZoneHistory.tm;
            alarm.sop_sttus_optn_code = (int)CodeType.SopStatus;
            alarm.sop_sttus_code = History.SopStatus.Ready;
            alarm.alarm_level = alarmDepth;

            return dataManager.GetCreate().Insert<Current>(alarm, out strErrorMessage);
        }

        private static bool MakeSensorZoneList(IDataManager dataManager, int sensorZoneHistoryNo, int sensorZoneNo, DateTime timeStamp, out string strErrorMessage)
        {
            strErrorMessage = null;

            SensorZoneDetail sensorZoneList = new SensorZoneDetail();
            sensorZoneList.sensor_zone_hist_sn = sensorZoneHistoryNo;
            sensorZoneList.sensor_zone_sn = sensorZoneNo;
            sensorZoneList.tm = timeStamp;

            return dataManager.GetCreate().Insert<SensorZoneDetail>(sensorZoneList, out strErrorMessage);
        }

        // 알람이 이미 발생했는지 확인한다.
        public static SensorZone GetSensorZoneHistoryFromSensorZone(IDataManager dataManager, IEnumerable<Base.Model.Sensor.SensorZone> sensorZones, out string strErrorMessage)
        {
            string strSensorZoneNos = "";

            foreach (var sensorZone in sensorZones)
            {
                if (strSensorZoneNos.Length == 0)
                    strSensorZoneNos = sensorZone.sensor_zone_sn.ToString();
                else
                    strSensorZoneNos += "," + sensorZone.sensor_zone_sn.ToString();
            }

            if (strSensorZoneNos.Length > 0)
            {
                string strCondition = string.Format("{0} = (select max({1}) from {2} where {3} in ({4}))",
                    SensorZone.Fields.sensor_zone_hist_sn,
                    Current.Fields.sensor_zone_hist_sn,
                    Current.TableName,
                    Current.Fields.sensor_zone_sn,
                    strSensorZoneNos);

                return dataManager.GetSelect().SelectFirst<SensorZone>(strCondition, out strErrorMessage);
            }

            strErrorMessage = null;
            return null;
        }

        public static IEnumerable<SensorZone> GetSensorZoneHistoryFromSensorZones(IDataManager dataManager, IEnumerable<Base.Model.Sensor.SensorZone> sensorZones, SensorZone lastSensorZoneHistory, out string strErrorMessage)
        {
            string strSensorZoneNos = "";

            foreach (var sensorZone in sensorZones)
            {
                if (strSensorZoneNos.Length == 0)
                    strSensorZoneNos = sensorZone.sensor_zone_sn.ToString();
                else
                    strSensorZoneNos += "," + sensorZone.sensor_zone_sn.ToString();
            }

            if (strSensorZoneNos.Length > 0)
            {
                string strCondition = "";
                
                strCondition = string.Format("{0} in (Select max(a.{1}) from {2} a inner join {3} b on a.{4} = b.{5} and b.{6} = {9} and b.{5} in ({7})) and {0} > {8}",
                    SensorZone.Fields.sensor_zone_hist_sn,
                    SensorZoneDetail.Fields.sensor_zone_hist_sn,
                    SensorZoneDetail.TableName,
                    Base.Model.Sensor.SensorZone.TableName,
                    SensorZoneDetail.Fields.sensor_zone_sn,
                    Base.Model.Sensor.SensorZone.Fields.sensor_zone_sn,
                    Base.Model.Sensor.SensorZone.Fields.alarm_yn,
                    strSensorZoneNos,
                    lastSensorZoneHistory.sensor_zone_hist_sn,
                    CustomManager.GetBoolValue(dataManager, true)); 

                return dataManager.GetSelect().Select<SensorZone>(strCondition, out strErrorMessage);
            }

            strErrorMessage = null;
            return new List<SensorZone>();
        }

        public static bool AddSensorZoneToSensorZoneHistory(IDataManager dataManager, SensorServer sensorServer, SensorSignal signal, SensorZone sensorZoneHistory, Base.Model.Sensor.SensorZone sensorZone, int alarmDepth, bool externalTransaction, out string strErrorMessage)
        {
            if (externalTransaction == false)
            {
                dataManager = dataManager.Clone();

                if (dataManager.BeginBatch(out strErrorMessage) == false)
                {
                    strErrorMessage = ErrorMessage.ToMessage(ErrorMessage.FAIL_BEGIN_TRANSACTION);
                    return false;
                }
            }

            string strCondition = string.Format("{0} = {1} and {2} = {3}",
                SensorZoneDetail.Fields.sensor_zone_hist_sn, sensorZoneHistory.sensor_zone_hist_sn,
                SensorZoneDetail.Fields.sensor_zone_sn, sensorZone.sensor_zone_sn);

            SensorZoneDetail sensorZoneList = dataManager.GetSelect().SelectFirst<SensorZoneDetail>(strCondition, out strErrorMessage);

            if (strErrorMessage != null)
            {
                string strTemp;
                dataManager.BatchRollback(out strTemp);
                return true;
            }

            if (sensorZoneList == null)
            {
                sensorZoneList = new SensorZoneDetail();
                sensorZoneList.sensor_zone_hist_sn = sensorZoneHistory.sensor_zone_hist_sn;
                sensorZoneList.sensor_zone_sn = sensorZone.sensor_zone_sn;
                sensorZoneList.tm = signal.TimeStamp != null ? (DateTime)signal.TimeStamp : DateTime.Now;

                if (dataManager.GetCreate().Insert<SensorZoneDetail>(sensorZoneList, out strErrorMessage) == false)
                {
                    string strTemp;
                    dataManager.BatchRollback(out strTemp);
                    return true;
                }
            }
            else
            {
                // 이미 SensorZoneList가 생성되어 있는 상태
                sensorZoneList.tm = signal.TimeStamp != null ? (DateTime)signal.TimeStamp : DateTime.Now;

                if (dataManager.GetUpdate().Update<SensorZoneDetail>(sensorZoneList, null, out strErrorMessage) == false)
                {
                    string strTemp;
                    dataManager.BatchRollback(out strTemp);
                    return true;
                }
            }

            strCondition = string.Format("{0} = {1}", Current.Fields.sensor_zone_hist_sn, sensorZoneHistory.sensor_zone_hist_sn);
            IEnumerable<Current> prevAlarms = dataManager.GetSelect().Select<Current>(strCondition, out strErrorMessage);

            if (prevAlarms == null)
                return false;

            Current prevAlarm = null;

            foreach (Current alarm in prevAlarms)
            {
                prevAlarm = alarm;
                break;
            }

            /*Current targetAlarm = new Current();
            targetAlarm.sensor_zone_hist_sn = sensorZoneHistory.sensor_zone_hist_sn;
            targetAlarm.sensor_zone_sn = sensorZone.sensor_zone_sn;
            targetAlarm.detct_ty_optn_code = (int)CodeType.DetectType;
            targetAlarm.sop_sttus_optn_code = (int)CodeType.SopStatus;
            targetAlarm.alarm_tm = (DateTime)sensorZoneList.tm;
            targetAlarm.alarm_level = alarmDepth;

            if (prevAlarm != null)
            {
                targetAlarm.detct_ty_code = prevAlarm.detct_ty_code;
                targetAlarm.sop_sttus_code = prevAlarm.sop_sttus_code;
                //targetAlarm.alarm_level = prevAlarm.alarm_level;
            }
            else
            {
                targetAlarm.detct_ty_code = signal.Header != Header.MANUAL_REPORT ? SdmsSensor.DetectType.Detect : SdmsSensor.DetectType.Report;
                targetAlarm.sop_sttus_code = History.SopStatus.Ready;
                //targetAlarm.alarm_level = alarmDepth;
            }

            if (dataManager.GetCreate().Insert<Current>(targetAlarm, out strErrorMessage) == false)
            {
                string strTemp;
                dataManager.BatchRollback(out strTemp);
                return false;
            }*/

            if (prevAlarm != null && prevAlarm.alarm_level != alarmDepth)
            {
                Base.Model.History.SensorReaction sensorReactionHistory;
                string strChangeAlarmMessage = sensorServer.GetChangeAlarmDepthMessage(dataManager, sensorZoneHistory.sensor_zone_hist_sn, prevAlarm.alarm_level, alarmDepth, out sensorReactionHistory);

                if (strChangeAlarmMessage != null)
                {
                    if (MakeSensorReactionHistory(dataManager, sensorZoneHistory, sensorZone, History.ReactionType.ChangeAlarmDepth, (DateTime)sensorZoneList.tm/*targetAlarm.alarm_tm*/, strChangeAlarmMessage, sensorReactionHistory.zone_sn, null, alarmDepth, signal.SensorValue, out strErrorMessage) == null)
                    {
                        string strTemp;
                        dataManager.BatchRollback(out strTemp);
                        return false;
                    }
                }
            }

            Dictionary<Current.Fields, object> dicSets = new Dictionary<Current.Fields, object>();
            dicSets[Current.Fields.alarm_level] = alarmDepth;

            if (dataManager.GetUpdate().Update<Current, Current.Fields>(dicSets, strCondition, out strErrorMessage) == false)
            {
                string strTemp;
                dataManager.BatchRollback(out strTemp);
                return false;
            }

            return dataManager.BatchCommit(out strErrorMessage);
        }

        public static SensorReaction ReportAlarm(IDataManager dataManager, DateTime? timeStamp, int userNo/*, ManualReport2 signal*/, SensorZone sensorZoneHistory, Base.Model.Sensor.SensorZone sensorZone, string strMessage, out string strErrorMessage)
        {
            DateTime time = timeStamp == null ? DateTime.Now : (DateTime)timeStamp;
            //DateTime time = signal.TimeStamp == null ? DateTime.Now : (DateTime)signal.TimeStamp;
            return MakeSensorReactionHistory(dataManager, sensorZoneHistory, sensorZone, History.ReactionType.NotifySignal, time, strMessage, sensorZoneHistory.zone_sn, userNo, null, null, out strErrorMessage);
        }

        public static SensorReaction ClearAlarm(IDataManager dataManager, _ClearAlarm signal, Base.Model.Sensor.SensorZone sensorZone, SensorZone sensorZoneHistory, string strMessage, out string strErrorMessage)
        {
            dataManager = dataManager.Clone();

            if (dataManager.BeginBatch(out strErrorMessage) == false)
            {
                strErrorMessage = ErrorMessage.ToMessage(ErrorMessage.FAIL_BEGIN_TRANSACTION);
                return null;
            }

            SensorReaction sensorReactionHistory = MakeSensorReactionHistory(dataManager, signal, sensorZone, sensorZoneHistory, strMessage, out strErrorMessage);

            if (sensorReactionHistory == null)
            {
                string strTemp;
                dataManager.BatchRollback(out strTemp);
                return null;
            }

            return ClearAlarm(dataManager, sensorZoneHistory.sensor_zone_hist_sn, sensorReactionHistory, out strErrorMessage);
        }

        public static SensorReaction ClearAlarm(IDataManager dataManager, ManualReport2 signal, SensorZone sensorZoneHistory, int reactionType, string strMessage, out string strErrorMessage)
        {
            dataManager = dataManager.Clone();

            if (dataManager.BeginBatch(out strErrorMessage) == false)
            {
                strErrorMessage = ErrorMessage.ToMessage(ErrorMessage.FAIL_BEGIN_TRANSACTION);
                return null;
            }

            DateTime timeStamp = signal.TimeStamp == null ? DateTime.Now : (DateTime)signal.TimeStamp;
            SensorReaction sensorReactionHistory = MakeSensorReactionHistory(dataManager, sensorZoneHistory, null, reactionType, timeStamp, strMessage, sensorZoneHistory.zone_sn, signal.UserNo, null, null, out strErrorMessage);

            if (sensorReactionHistory == null)
            {
                string strTemp;
                dataManager.BatchRollback(out strTemp);
                return null;
            }

            return ClearAlarm(dataManager, sensorZoneHistory.sensor_zone_hist_sn, sensorReactionHistory, out strErrorMessage);
        }

        private static SensorReaction ClearAlarm(IDataManager dataManager, int sensorZoneHistoryNo, SensorReaction sensorReactionHistory, out string strErrorMessage)
        {
            string strCondition = string.Format("{0} = {1}", Current.Fields.sensor_zone_hist_sn, sensorZoneHistoryNo);

            if (dataManager.GetDelete().Delete<Current>(strCondition, out strErrorMessage) == false)
            {
                string strTemp;
                dataManager.BatchRollback(out strTemp);
                return null;
            }

            Dictionary<Base.Model.Sensor.SensorZone.Fields, object> dicSets = new Dictionary<Base.Model.Sensor.SensorZone.Fields, object>();
            
            if (dataManager.GetDBManager().DatabaseType == WebDBManager.DBType.npgsql)
            {
                dicSets[Base.Model.Sensor.SensorZone.Fields.alarm_yn] = false;
            }
            else 
            {
                dicSets[Base.Model.Sensor.SensorZone.Fields.alarm_yn] = 0;
            }

            strCondition = string.Format("{0} in (Select {1} from {2} where {3} = {4})",
                Base.Model.Sensor.SensorZone.Fields.sensor_zone_sn,
                SensorZoneDetail.Fields.sensor_zone_sn,
                SensorZoneDetail.TableName,
                SensorZoneDetail.Fields.sensor_zone_hist_sn,
                sensorZoneHistoryNo);

            if (dataManager.GetUpdate().Update<Base.Model.Sensor.SensorZone, Base.Model.Sensor.SensorZone.Fields>(dicSets, strCondition, out strErrorMessage) == false)
            {
                string strTemp;
                dataManager.BatchRollback(out strTemp);
                return null;
            }

            if (dataManager.BatchCommit(out strErrorMessage) == false)
            {
                string strTemp;
                dataManager.BatchRollback(out strTemp);
                return null;
            }

            return sensorReactionHistory;
        }

        private static int GetReactionTypeFromSignal(_ClearAlarm signal)
        {
            if (signal.Header == Header.CLEAR_MANUAL_REPORT || signal.Header == Header.SENSOR_USER_RESET)
                return History.ReactionType.UserReset;
            else if (signal.Header == Header.SENSOR_MALFUNCTION)
                return History.ReactionType.Malfunction;
            else if (signal.Header == Header.TIMEOUT)
                return History.ReactionType.TimeOut;

            return History.ReactionType.None;
        }

        private static SensorReaction MakeSensorReactionHistory(IDataManager dataManager, _ClearAlarm signal, Base.Model.Sensor.SensorZone sensorZone, SensorZone sensorZoneHistory, string strMessage, out string strErrorMessage)
        {
            int reactionType = GetReactionTypeFromSignal(signal);

            if (reactionType == History.ReactionType.None)
            {
                strErrorMessage = "처리할 수 없는 Header입니다.(" + signal.Header.ToString() + ")";
                return null;
            }

            SensorReaction sensorReactionHistory = new SensorReaction();

            sensorReactionHistory.sensor_zone_hist_sn = sensorZoneHistory.sensor_zone_hist_sn;
            sensorReactionHistory.react_ty_optn_code = (int)CodeType.ReactionType;
            sensorReactionHistory.react_ty_code = reactionType;
            sensorReactionHistory.tm = signal.TimeStamp == null ? DateTime.Now : (DateTime)signal.TimeStamp;
            sensorReactionHistory.mssage = strMessage;
            sensorReactionHistory.zone_sn = sensorZoneHistory.zone_sn;
            sensorReactionHistory.eqp_zone_sn = sensorZone.eqp_zone_sn;
            sensorReactionHistory.sensor_zone_sn = sensorZone.sensor_zone_sn;
            sensorReactionHistory.user_sn = signal.UserNo;
            sensorReactionHistory.alarm_level = null;

            int addedID;

            if (dataManager.GetCreate().Insert<SensorReaction>(sensorReactionHistory, out addedID, out strErrorMessage) == false)
                return null;

            sensorReactionHistory.sensor_react_hist_sn = addedID;
            return sensorReactionHistory;
        }

        public static SensorZone ProcessManualReport(INotifyManager notifyManager, IDataManager dataManager, ManualReport signal, Base.Model.Sensor.SensorZone  sensorZone, string strMessage, out string strErrorMessage)
        {
            dataManager = dataManager.Clone();

            string strCondition = string.Format("{0} = {1}", Zone.Fields.zone_sn, signal.ZoneNo);
            Zone zone = dataManager.GetSelect().SelectFirst<Zone>(strCondition, out strErrorMessage);

            if (zone == null)
            {
                if (strErrorMessage != null)
                    strErrorMessage = ErrorMessage.ToMessage(ErrorMessage.UNKNOWN_ZONE_ID);

                return null;
            }

            if (dataManager.BeginBatch(out strErrorMessage) == false)
                return null;

            SensorZone sensorZoneHistory = new SensorZone();

            sensorZoneHistory.tm = signal.TimeStamp != null ? (DateTime)signal.TimeStamp : DateTime.Now;
            sensorZoneHistory.zone_sn = signal.ZoneNo;
            sensorZoneHistory.sensor_ty_optn_code = (int)CodeType.SensorType;
            sensorZoneHistory.sensor_ty_code = signal.SensorType;
            sensorZoneHistory.detct_sttus_optn_code = (int)CodeType.DetectStatus;
            sensorZoneHistory.detct_sttus_code = History.DetectStatus.Real;
            sensorZoneHistory.memo = signal.Memo;
            sensorZoneHistory.site_sn = zone.site_sn;
            sensorZoneHistory.reportr = signal.ReportPerson == null ? "" : signal.ReportPerson;

            int addedID;

            // 1. SensorZoneHistory 생성
            if (dataManager.GetCreate().Insert<SensorZone>(sensorZoneHistory, out addedID, out strErrorMessage) == false)
            {
                string strTemp;
                dataManager.BatchRollback(out strTemp);
                return null;
            }

            sensorZoneHistory.sensor_zone_hist_sn = addedID;

            SensorZoneDetail sensorZoneHistoryDetail = new SensorZoneDetail();

            sensorZoneHistoryDetail.sensor_zone_hist_sn = sensorZoneHistory.sensor_zone_hist_sn;
            sensorZoneHistoryDetail.sensor_zone_sn = sensorZone.sensor_zone_sn;
            sensorZoneHistoryDetail.tm = sensorZoneHistory.tm;

            // 2. SensorZoneHistoryDetail 생성
            if (dataManager.GetCreate().Insert<SensorZoneDetail>(sensorZoneHistoryDetail, out strErrorMessage) == false)
            {
                string strTemp;
                dataManager.BatchRollback(out strTemp);
                return null;
            }

            // 3. SensorReactionHistory 생성
            SensorReaction sensorReactionHistory = MakeSensorReactionHistory(dataManager, sensorZoneHistory, sensorZone, History.ReactionType.BeginStatus, sensorZoneHistory.tm, strMessage, signal.ZoneNo, signal.UserNo, signal.AlarmDepth, null, out strErrorMessage);

            if (sensorReactionHistory == null)
            {
                string strTemp;
                dataManager.BatchRollback(out strTemp);
                return null;
            }

            Current alarm = new Current();

            alarm.sensor_zone_hist_sn = sensorZoneHistory.sensor_zone_hist_sn;
            alarm.sensor_zone_sn = sensorZone.sensor_zone_sn;
            alarm.detct_ty_optn_code = (int)CodeType.DetectType;
            alarm.detct_ty_code = SdmsSensor.DetectType.Report;
            alarm.alarm_tm = sensorZoneHistory.tm;
            alarm.sop_sttus_optn_code = (int)CodeType.SopStatus;
            alarm.sop_sttus_code = History.SopStatus.Ready;
            alarm.alarm_level = signal.AlarmDepth == null ? 1 : (int)signal.AlarmDepth;

            // 4. CurrentAlarm 생성
            if (dataManager.GetCreate().Insert<Current>(alarm, out strErrorMessage) == false)
            {
                string strTemp;
                dataManager.BatchRollback(out strTemp);
                return null;
            }

            if (dataManager.BatchCommit(out strErrorMessage) == false)
            {
                string strTemp;
                dataManager.BatchRollback(out strTemp);
                return null;
            }

            NotifyManager.NotifyAlarm(notifyManager, dataManager, sensorZoneHistory, SdmsSensor.DetectType.Report, out strErrorMessage);

            // SensorZone.IsAlarmStatus는 신경쓰지 않는다.
            // 특정 구역에 속한것이 아니라서 하나의 SensorZone으로 여러개의 알람이 발생할 수 있기 때문에 의미가 없다.
            return sensorZoneHistory;
        }
    }
}
