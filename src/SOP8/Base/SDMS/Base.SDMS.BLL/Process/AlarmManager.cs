using System;
using System.Collections;
using System.Collections.Generic;
using dnsDapperDBUtil.DataAccessLayer.IDAL;
using Base.SDMS.IBLL.Request;
using Base.SDMS.IBLL.Response;
using Base.DAL;
using Base.Model.History;
using Base.Model.Spatial;
using Base.Model.Alarm;
using Base.Model.Common;
using dnsData.CommonCode;
using Response;
using Newtonsoft.Json.Linq;
using SOPWebServer.IBLL.Models.Request;
using Base.Model.Sensor.CCTV;

namespace Base.SDMS.BLL.Process
{
    using IBLL.Models;

    public class AlarmManager
    {
        private class EquipZone_Zone_Building_BuildingGroup
        {
            public EquipmentZone EquipZone { get; set; }
            public Zone Zone { get; set; }
            public Building Building { get; set; }
            public BuildingGroup BuildingGroup { get; set; }

            public EquipZone_Zone_Building_BuildingGroup(EquipmentZone equipZone, Zone zone, Building building, BuildingGroup buildingGroup)
            {
                this.EquipZone = equipZone;
                this.Zone = zone;
                this.Building = building;
                this.BuildingGroup = buildingGroup;
            }
        }

        private IDataManager m_dataManager = null;

        public AlarmManager(IDataManager dataManager)
        {
            m_dataManager = dataManager;
        }

        // dicOldSensorZoneHistoryDetails : 오늘 이전에 발생한 알람 가운데 아직 종료되지 않은 알람들
        public ResponseAlarm GetAlarms(RequestAlarm data, Dictionary<int, List<int>> dicOldSensorZoneHistoryDetails = null)
        {
            string strErrorMessage;
            JoinManager joinManager = new JoinManager(m_dataManager);

            // Key : SensorZoneHistory No
            // Value : SensorZone No List
            Dictionary<int, List<int>> dicSensorZoneHistoryDetails = new Dictionary<int, List<int>>();
            // Key : SensorZoneHistory No
            Dictionary<int, SensorZone> dicSensorZoneHistories = GetSensorZoneHistories(joinManager, data, dicSensorZoneHistoryDetails, out strErrorMessage);

            if (dicSensorZoneHistories == null)
                return new ResponseAlarm(false, strErrorMessage, DBError.GetInsertErrorCode(strErrorMessage));

            if (dicOldSensorZoneHistoryDetails != null)
            {
                if (MergeAlarms(dicSensorZoneHistories, dicSensorZoneHistoryDetails, dicOldSensorZoneHistoryDetails, out strErrorMessage) == false)
                    return new ResponseAlarm(false, strErrorMessage, DBError.GetInsertErrorCode(strErrorMessage));
            }

            // Key : SensorZoneHistory No
            Dictionary<int, List<SensorReaction>> dicSensorReactionHistories = GetSensorReactionHistories(joinManager, dicSensorZoneHistories, out strErrorMessage);

            if (dicSensorReactionHistories == null)
                return new ResponseAlarm(false, strErrorMessage, DBError.GetInsertErrorCode(strErrorMessage));

            List<AlarmData> alarmDatas = GetAlarmDatas(joinManager, dicSensorZoneHistories, dicSensorZoneHistoryDetails, dicSensorReactionHistories, out strErrorMessage);

            if (alarmDatas == null)
                return new ResponseAlarm(false, strErrorMessage, DBError.GetInsertErrorCode(strErrorMessage));

            ResponseAlarm response = new ResponseAlarm(true, "");
            response.AlarmDatas = alarmDatas;
            return response;
        }

        public ResponseAlarm GetTodayAlarms(RequestTodayAlarms data)
        {
            string strErrorMessage;
            JoinManager joinManager = new JoinManager(m_dataManager);

            // 오늘 이전에 발생한 알람 가운데 아직 종료되지 않은 알람이 있는지 확인한다.          
            // Key : SensorZoneHistory No
            // Value : SensorZone No List
            Dictionary<int, List<int>> dicSensorZoneHistoryDetails = GetOldAlarms(joinManager, out strErrorMessage);

            if (dicSensorZoneHistoryDetails == null)
                return new ResponseAlarm(false, strErrorMessage, DBError.GetInsertErrorCode(strErrorMessage));

            DateTime dtNow = DateTime.Now;

            RequestAlarm request = new RequestAlarm();
            request.SiteNo = data.SiteNo;
            request.SensorType = data.SensorType;
            request.BeginDate = new DateTime(dtNow.Year, dtNow.Month, dtNow.Day);

            return GetAlarms(request, dicSensorZoneHistoryDetails);
        }

        public ResponseAlarmMemo GetAlarmMemo(RequestAlarmMemo data)
        {
            string strErrorMessage;
            string strCondition = string.Format("{0} = {1}", SensorZone.Fields.sensor_zone_hist_sn, data.SensorZoneHistoryNo);
            SensorZone sensorZoneHistory = m_dataManager.GetSelect().SelectFirst<SensorZone>(strCondition, out strErrorMessage);

            if (sensorZoneHistory == null)
            {
                if (strErrorMessage == null)
                    return new ResponseAlarmMemo(false, "잘못된 입력값입니다.\r\n알람 데이터를 조회할 수 없습니다.", DBError.GetInsertErrorCode(strErrorMessage));
                else
                    return new ResponseAlarmMemo(false, strErrorMessage, DBError.GetInsertErrorCode(strErrorMessage));
            }

            ResponseAlarmMemo response = new ResponseAlarmMemo(true, "");
            response.Memo = sensorZoneHistory.memo;
            return response;
        }

        public ResponseAlarmMemo SaveAlarmMemo(SaveAlarmMemo data)
        {
            Dictionary<SensorZone.Fields, object> dicSets = new Dictionary<SensorZone.Fields, object>();
            dicSets[SensorZone.Fields.memo] = data.Memo;

            string strErrorMessage;
            string strCondition = string.Format("{0} = {1}", SensorZone.Fields.sensor_zone_hist_sn, data.SensorZoneHistoryNo);

            if (m_dataManager.GetUpdate().Update<SensorZone, SensorZone.Fields>(dicSets, strCondition, out strErrorMessage) == true)
            {
                ResponseAlarmMemo response = new ResponseAlarmMemo(true, "");
                response.Memo = data.Memo;
                return response;
            }

            return new ResponseAlarmMemo(false, strErrorMessage, DBError.GetInsertErrorCode(strErrorMessage));
        }

        public MessageResult ClearAlarm(ClearAlarm data, string strSopWebServerUrl)
        {
            if (strSopWebServerUrl == null || strSopWebServerUrl.Length == 0)
                return new MessageResult(false, "알람을 전달할 URL이 지정되지 않았습니다.", ErrorCode.NoParameters);

            string strUrl = strSopWebServerUrl.EndsWith("/") ? strSopWebServerUrl + "api/ClearAlarm/RequestClearAlarm" : strSopWebServerUrl + "/api/ClearAlarm/RequestClearAlarm";

            string strErrorMessage;

            if (SendClearAlarm(data.SensorZoneHistoryNo, data.IsMalfunction, data.UserNo, data.Memo, strUrl, out strErrorMessage) == false)
                return new MessageResult(false, strErrorMessage, DBError.GetInsertErrorCode(strErrorMessage));

            return new MessageResult(true, "");
        }

        public MessageResult ClearAlarmList(ClearAlarmList data, string strSopWebServerUrl)
        {
            if (strSopWebServerUrl == null || strSopWebServerUrl.Length == 0)
                return new MessageResult(false, "알람을 전달할 URL이 지정되지 않았습니다.", ErrorCode.NoParameters);

            string strUrl = strSopWebServerUrl.EndsWith("/") ? strSopWebServerUrl + "api/ClearAlarm/RequestClearAlarmList" : strSopWebServerUrl + "/api/ClearAlarm/RequestClearAlarmList";

            string strErrorMessage;

            if (SendClearAlarmList(data.SensorZoneHistoryNos, data.IsMalfunction, data.UserNo, data.Memo, strUrl, out strErrorMessage) == false)
                return new MessageResult(false, strErrorMessage, DBError.GetInsertErrorCode(strErrorMessage));

            return new MessageResult(true, "");
        }

        public MessageResult ClearAllAlarm(ClearAllAlarm data, string strSopWebServerUrl)
        {
            if (strSopWebServerUrl == null || strSopWebServerUrl.Length == 0)
                return new MessageResult(false, "알람을 전달할 URL이 지정되지 않았습니다.", ErrorCode.NoParameters);

            string strUrl = strSopWebServerUrl.EndsWith("/") ? strSopWebServerUrl + "api/ClearAll" : strSopWebServerUrl + "/api/ClearAll";

            string strErrorMessage;

            if (SendClearAll(data.UserNo, data.SiteNo, data.SensorType, data.SensorSubType, data.TimeStamp, strUrl, out strErrorMessage) == false)
                return new MessageResult(false, strErrorMessage, DBError.GetInsertErrorCode(strErrorMessage));

            return new MessageResult(true, "");
        }

        private bool SendClearAll(int userNo, int? siteNo, int? sensorType, int? sensorSubType, DateTime? timeStamp, string strUrl, out string strErrorMessage)
        {
            strErrorMessage = null;

            JObject json = new JObject();

            json.Add("sensorType", sensorType);
            json.Add("sensorSubType", sensorSubType);
            json.Add("timeStamp", timeStamp);
            json.Add("userNo", userNo);
            json.Add("siteNo", siteNo);

            return WebServiceManager.SendJsonData(json, strUrl, out strErrorMessage);
        }

        private bool SendClearAlarm(int nSensorZoneHistoryNo, bool isMalfunction, int userNo, string strMemo, string strUrl, out string strErrorMessage)
        {
            JObject json = new JObject();

            int header = isMalfunction ? Header.SENSOR_MALFUNCTION : Header.SENSOR_USER_RESET;

            json.Add("header", header);
            json.Add("sensorZoneHistoryNo", nSensorZoneHistoryNo);
            json.Add("userNo", userNo);
            json.Add("memo", strMemo);

            return WebServiceManager.SendJsonData(json, strUrl, out strErrorMessage);
        }

        private bool SendClearAlarmList(List<int> sensorZoneHistoryNos, bool isMalfunction, int userNo, string strMemo, string strUrl, out string strErrorMessage)
        {
            JObject json = new JObject();

            int header = isMalfunction ? Header.SENSOR_MALFUNCTION : Header.SENSOR_USER_RESET;

            JArray sensorZoneHistoryNoList = new JArray();

            foreach (int sensorZoneHistoryNo in sensorZoneHistoryNos)
            {
                sensorZoneHistoryNoList.Add(sensorZoneHistoryNo);
            }

            json.Add("header", header);
            json.Add("sensorZoneHistoryNos", sensorZoneHistoryNoList);
            json.Add("userNo", userNo);
            json.Add("memo", strMemo);

            return WebServiceManager.SendJsonData(json, strUrl, out strErrorMessage);
        }

        private bool MergeAlarms(Dictionary<int, SensorZone> dicSensorZoneHistories, Dictionary<int, List<int>> dicSensorZoneHistoryDetails, Dictionary<int, List<int>> dicOldSensorZoneHistoryDetails, out string strErrorMessage)
        {
            strErrorMessage = null;

            string strSensorZoneHistoryNos = null;

            foreach (var pair in dicOldSensorZoneHistoryDetails)
            {
                if (strSensorZoneHistoryNos == null)
                    strSensorZoneHistoryNos = pair.Key.ToString();
                else
                    strSensorZoneHistoryNos += "," + pair.Key.ToString();
            }

            if (strSensorZoneHistoryNos == null)
                return true;

            string strCondition = string.Format("{0} in ({1})", SensorZone.Fields.sensor_zone_hist_sn, strSensorZoneHistoryNos);
            IEnumerable<SensorZone> sensorZoneHistories = m_dataManager.GetSelect().Select<SensorZone>(strCondition, out strErrorMessage);

            if (sensorZoneHistories == null)
                return false;

            foreach (var sensorZoneHistory in sensorZoneHistories)
            {
                dicSensorZoneHistories[sensorZoneHistory.sensor_zone_hist_sn] = sensorZoneHistory;
            }

            foreach (var pair in dicOldSensorZoneHistoryDetails)
            {
                dicSensorZoneHistoryDetails[pair.Key] = pair.Value;
            }

            return true;
        }

        // 오늘 이전에 발생한 알람 가운데 아직 종료되지 않은 알람이 있는지 확인한다.
        private Dictionary<int, List<int>> GetOldAlarms(JoinManager joinManager, out string strErrorMessage)
        {
            DateTime dtNow = DateTime.Now;
            string strCondition = string.Format("{0} < '{1}-{2:00}-{3:00} 00:00:00'", Current.Fields.alarm_tm, dtNow.Year, dtNow.Month, dtNow.Day);
            ArrayList arrDatas = joinManager.JoinCurrentAlarmHistorySensorZoneDetail(strCondition, out strErrorMessage);

            if (arrDatas == null)
                return null;

            // Key : SensorZoneHistory No
            // Value : SensorZone No List
            Dictionary<int, List<int>> dicSensorZoneHistoryDetails = new Dictionary<int, List<int>>();
            int nDataCount = arrDatas.Count;

            for (int i = 0; i < nDataCount - 1; i += 2)
            {
                if (arrDatas[i] is Current && arrDatas[i + 1] is SensorZoneDetail)
                {
                    Current alarm = (Current)arrDatas[i];
                    SensorZoneDetail sensorZoneHistoryDetail = (SensorZoneDetail)arrDatas[i + 1];

                    List<int> sensorZoneNos = null;

                    if (dicSensorZoneHistoryDetails.TryGetValue(sensorZoneHistoryDetail.sensor_zone_hist_sn, out sensorZoneNos) == false)
                    {
                        sensorZoneNos = new List<int>();
                        dicSensorZoneHistoryDetails[sensorZoneHistoryDetail.sensor_zone_hist_sn] = sensorZoneNos;
                    }

                    sensorZoneNos.Add(sensorZoneHistoryDetail.sensor_zone_sn);
                }
            }

            return dicSensorZoneHistoryDetails;
        }

        private List<AlarmData> GetAlarmDatas(JoinManager joinManager, Dictionary<int, SensorZone> dicSensorZoneHistories, Dictionary<int, List<int>> dicSensorZoneHistoryDetails, Dictionary<int, List<SensorReaction>> dicSensorReactionHistories, out string strErrorMessage)
        {
            // Key : SensorZone No
            Dictionary<int, EquipZone_Zone_Building_BuildingGroup> dicSensorZoneInfos = GetSensorZoneInfo(joinManager, dicSensorZoneHistoryDetails, out strErrorMessage);

            if (dicSensorZoneInfos == null)
                return null;

            Dictionary<int, string> dicSensorTypeNames = GetSensorTypeNames(dicSensorZoneHistories, out strErrorMessage);

            if (dicSensorTypeNames == null)
                return null;

            Dictionary<int, Current> dicCurrentAlarms = GetCurrentAlarms(out strErrorMessage);

            if (dicCurrentAlarms == null)
                return null;

            string strSensorTypeName;
            List<AlarmData> alarmDatas = new List<AlarmData>();

            // Key : SensorZone No
            // Value : Sensor No
            Dictionary<int, int> dicSensorZoneNos = new Dictionary<int, int>();
            // Key : Zone No
            Dictionary<int, ArrayList> dicZoneBuilding = new Dictionary<int, ArrayList>();

            foreach (var pair in dicSensorZoneHistories)
            {
                SensorZone sensorZoneHistory = pair.Value;
                List<SensorReaction> sensorReactionHistories = null;
                List<int> alarmSensorZoneNos = null;

                if (dicSensorReactionHistories.TryGetValue(sensorZoneHistory.sensor_zone_hist_sn, out sensorReactionHistories) && dicSensorZoneHistoryDetails.TryGetValue(sensorZoneHistory.sensor_zone_hist_sn, out alarmSensorZoneNos))
                {
                    foreach (int sensorZoneNo in alarmSensorZoneNos)
                    {
                        dicSensorZoneNos[sensorZoneNo] = -1;
                    }

                    EquipZone_Zone_Building_BuildingGroup sensorZoneInfo = GetSensorZoneInfo(sensorZoneHistory.sensor_zone_hist_sn, dicSensorZoneHistoryDetails, dicSensorZoneInfos);
                    AlarmData alarmData = new AlarmData();

                    alarmData.AlarmDepth = GetAlarmDepth(sensorReactionHistories);
                    alarmData.AlarmMemo = sensorZoneHistory.memo;
                    alarmData.SensorZones = ToAlarmSensorZones(alarmSensorZoneNos);

                    alarmData.dtTime = sensorZoneHistory.tm;

                    if (sensorZoneInfo != null)
                        alarmData.EquipZoneNo = sensorZoneInfo.EquipZone.eqp_zone_sn;
                    else if (sensorZoneHistory.zone_sn != null)
                    {
                        Zone zone;
                        Building building;
                        BuildingGroup buildingGroup;

                        if (ReadZoneBuildingBuildingGroup(joinManager, (int)sensorZoneHistory.zone_sn, dicZoneBuilding, out zone, out building, out buildingGroup, out strErrorMessage))
                        {
                            alarmData.ZoneName = zone.disp_text;
                            alarmData.ZoneNo = zone.zone_sn;

                            if (building != null)
                            {
                                alarmData.BuildingName = building.disp_text;
                                alarmData.BuildingNo = building.buld_sn;
                            }

                            if (buildingGroup != null)
                            {
                                alarmData.BuildingGroupName = buildingGroup.disp_text;
                                alarmData.BuildingGroupNo = buildingGroup.buld_group_sn;
                            }
                        }
                    }

                    alarmData.FacilityType = sensorZoneHistory.sensor_ty_code;

                    if (dicSensorTypeNames.TryGetValue(sensorZoneHistory.sensor_ty_code, out strSensorTypeName))
                        alarmData.FacilityTypeName = strSensorTypeName;

                    alarmData.IsAlarm = dicCurrentAlarms.ContainsKey(sensorZoneHistory.sensor_zone_hist_sn);
                    alarmData.MaterialType = alarmData.FacilityType;
                    alarmData.MaterialTypeString = alarmData.MaterialTypeString;
                    alarmData.Memo = sensorZoneHistory.memo;
                    alarmData.Message = GetAlarmMessage(sensorReactionHistories);

                    DateTime? reactionTime;
                    alarmData.ReactionType = GetLastReactionType(sensorReactionHistories, out reactionTime);

                    if (reactionTime != null)
                        alarmData.ReactionTime = (DateTime)reactionTime;

                    /*if (alarmSensorZoneNos.Count > 0)
                        alarmData.OrgSensorNo = alarmSensorZoneNos[0];*/

                    EquipZone_Zone_Building_BuildingGroup info;

                    foreach (int sensorZoneNo in alarmSensorZoneNos)
                    {
                        if (dicSensorZoneInfos.TryGetValue(sensorZoneNo, out info))
                        //if (dicSensorZoneInfos.TryGetValue(sensorZoneHistory.sensor_zone_hist_sn, out info))
                        {
                            if (info.EquipZone != null)
                                alarmData.PositionName = info.EquipZone.disp_text;
                            else if (info.Zone != null)
                                alarmData.PositionName = info.Zone.disp_text;
                            else if (info.Building != null)
                                alarmData.PositionName = info.Building.disp_text;

                            if (info.Zone != null)
                            {
                                alarmData.ZoneName = info.Zone.disp_text;
                                alarmData.ZoneNo = info.Zone.zone_sn;
                            }

                            if (info.Building != null)
                            {
                                alarmData.BuildingNo = info.Building.buld_sn;
                                alarmData.BuildingName = info.Building.disp_text;
                            }

                            if (info.BuildingGroup != null)
                            {
                                alarmData.BuildingGroupNo = info.BuildingGroup.buld_group_sn;
                                alarmData.BuildingGroupName = info.BuildingGroup.disp_text;
                            }

                            break;
                        }
                    }

                    alarmData.ReportPerson = sensorZoneHistory.reportr;
                    //alarmData.SensorName = 
                    alarmData.SensorZoneHistoryNo = sensorZoneHistory.sensor_zone_hist_sn;

                    /*if (alarmSensorZoneNos.Count > 0)
                        alarmData.SensorZoneNo = alarmSensorZoneNos[0];*/

                    alarmData.SiteNo = sensorZoneHistory.site_sn;
                    //alarmData.SopStatus = 
                    alarmData.StrDateTime = GetDateTimeString(sensorZoneHistory.tm);

                    Current _alarm;

                    if (dicCurrentAlarms.TryGetValue(alarmData.SensorZoneHistoryNo, out _alarm))
                    {
                        alarmData.SopStatus = _alarm.sop_sttus_code;
                    }
                    else
                    {
                        alarmData.SopStatus = GetSopStatus(joinManager, alarmData.SensorZoneHistoryNo);
                    }

                    alarmDatas.Add(alarmData);
                }
            }

            if (SetSensorFromSensorZone(joinManager, alarmDatas, dicSensorZoneNos, out strErrorMessage) == false)
                return null;

            return alarmDatas;
        }

        private bool ReadZoneBuildingBuildingGroup(JoinManager joinManager, int zoneNo, Dictionary<int, ArrayList> dicZoneBuilding, out Zone zone, out Building building, out BuildingGroup buildingGroup, out string strErrorMessage)
        {
            ArrayList arrDatas = null;

            strErrorMessage = null;
            zone = null;
            building = null;
            buildingGroup = null;

            if (dicZoneBuilding.TryGetValue(zoneNo, out arrDatas))
            {
                if (arrDatas.Count >= 3 && arrDatas[0] is Zone && (arrDatas[1] == null ||  arrDatas[1] is Building) && (arrDatas[2] == null || arrDatas[2] is BuildingGroup))
                {
                    zone = (Zone)arrDatas[0];
                    building = (Building)arrDatas[1];
                    buildingGroup = (BuildingGroup)arrDatas[2];
                    return true;
                }
            }

            arrDatas = joinManager.JoinZoneBuildingBuildingGroup(string.Format("a.{0} = {1}", Zone.Fields.zone_sn, zoneNo), out strErrorMessage);

            if (arrDatas == null)
                return false;

            if (arrDatas.Count >= 3 && arrDatas[0] is Zone && (arrDatas[1] == null || arrDatas[1] is Building) && (arrDatas[2] == null || arrDatas[2] is BuildingGroup))
            {
                zone = (Zone)arrDatas[0];
                building = (Building)arrDatas[1];
                buildingGroup = (BuildingGroup)arrDatas[2];
                dicZoneBuilding[zoneNo] = arrDatas;
                return true;
            }

            return false;
        }

        private bool SetSensorFromSensorZone(JoinManager joinManager, List<AlarmData> alarmDatas, Dictionary<int, int> dicSensorZoneNos, out string strErrorMessage)
        {
            strErrorMessage = null;

            if (dicSensorZoneNos == null || dicSensorZoneNos.Count == 0)
                return true;

            string strCondition = string.Format("b.{0} in ({1})", Model.Sensor.SensorZone.Fields.sensor_zone_sn, string.Join(",", dicSensorZoneNos.Keys));
            ArrayList arrDatas = joinManager.JoinSensorSensorZone(strCondition, out strErrorMessage);

            if (arrDatas == null)
                return false;

            int nDataCount = arrDatas.Count;

            /*IEnumerable<Model.Sensor.SensorZone> sensorZones = joinManager.Select<Model.Sensor.SensorZone>(strCondition, out strErrorMessage);

            if (sensorZones == null)
                return false;*/

            Dictionary<int, Base.Model.Sensor.Sensor> dicSensors = new Dictionary<int, Model.Sensor.Sensor>();
            Dictionary<int, Base.Model.Sensor.SensorZone> dicSensorZones = new Dictionary<int, Model.Sensor.SensorZone>();

            Dictionary<int, long> dicSensorZoneKeys = new Dictionary<int, long>();
            Dictionary<long, Model.Sensor.SubType> dicSensorSubTypes = new Dictionary<long, Model.Sensor.SubType>();

            for (int i=0;i<nDataCount-1;i+=2)
            //foreach (var sensorZone in sensorZones)
            {
                if (arrDatas[i] is Base.Model.Sensor.Sensor && arrDatas[i + 1] is Base.Model.Sensor.SensorZone)
                {
                    Base.Model.Sensor.Sensor sensor = (Base.Model.Sensor.Sensor)arrDatas[i];
                    Base.Model.Sensor.SensorZone sensorZone = (Base.Model.Sensor.SensorZone)arrDatas[i + 1];

                    dicSensors[sensor.sensor_sn] = sensor;
                    dicSensorZoneNos[sensorZone.sensor_zone_sn] = sensorZone.sensor_sn;
                    dicSensorZones[sensorZone.sensor_zone_sn] = sensorZone;

                    if (sensorZone.sensor_sub_ty_no != null)
                    {
                        long subTypeKey = ((((long)sensorZone.sensor_ty_code) << 32) | ((long)sensorZone.sensor_sub_ty_no));
                        dicSensorSubTypes[subTypeKey] = null;
                        dicSensorZoneKeys[sensorZone.sensor_zone_sn] = subTypeKey;
                    }
                }
            }

            if (dicSensorSubTypes.Count > 0)
            {
                if (ReadSensorSubTypes(joinManager, dicSensorSubTypes, out strErrorMessage) == false)
                    return false;
            }

            int sensorNo;

            foreach (AlarmData alarmData in alarmDatas)
            {
                foreach(var sensorZone in alarmData.SensorZones)
                {
                    if (dicSensorZoneNos.TryGetValue(sensorZone.SensorZoneNo, out sensorNo))
                    {
                        sensorZone.SensorNo = sensorNo;

                        Base.Model.Sensor.Sensor sensor;

                        if (dicSensors.TryGetValue(sensorZone.SensorNo, out sensor))
                            sensorZone.SensorName = sensor.sensor_name;

                        if (alarmData.SensorZoneNo < 0)
                        {
                            alarmData.SensorZoneNo = sensorZone.SensorZoneNo;
                            alarmData.SensorNo = sensorZone.SensorNo;
                            alarmData.SensorName = sensorZone.SensorName;
                        }

                        long subTypeKey;

                        if (dicSensorZoneKeys.TryGetValue(alarmData.SensorZoneNo, out subTypeKey))
                        {
                            Model.Sensor.SubType subType;

                            if (dicSensorSubTypes.TryGetValue(subTypeKey, out subType))
                            {
                                alarmData.SensorSubType = subType.sensor_sub_ty_no;
                                alarmData.SensorSubTypeName = subType.sensor_sub_ty_name;
                            }
                        }
                    }

                    Base.Model.Sensor.SensorZone _sensorZone;
                    Base.Model.Sensor.Sensor _sensor;

                    if (dicSensorZones.TryGetValue(sensorZone.SensorZoneNo, out _sensorZone))
                    {
                        if (dicSensors.TryGetValue(_sensorZone.sensor_sn, out _sensor))
                        {
                            alarmData.IsManual = _sensor.manual_yn;
                            //alarmData.IsManual = ManualAlarmChecker.IsManualAlarm(_sensorZone, m_dataManager);
                        }
                    }
                }
            }

            return true;
        }

        private bool ReadSensorSubTypes(JoinManager joinManager, Dictionary<long, Model.Sensor.SubType> dicSensorSubTypes, out string strErrorMessage)
        {
            string strCondition = null;

            foreach (KeyValuePair<long, Model.Sensor.SubType> pair in dicSensorSubTypes)
            {
                int sensorType = (int)(pair.Key >> 32);
                int sensorSubType = (int)(pair.Key & 0xffffffff);

                if (strCondition == null)
                    strCondition = string.Format("({0} = {1} and {2} = {3})", Model.Sensor.SubType.Fields.sensor_ty_code, sensorType, Model.Sensor.SubType.Fields.sensor_sub_ty_no, sensorSubType);
                else
                    strCondition += string.Format(" or ({0} = {1} and {2} = {3})", Model.Sensor.SubType.Fields.sensor_ty_code, sensorType, Model.Sensor.SubType.Fields.sensor_sub_ty_no, sensorSubType);
            }

            IEnumerable<Model.Sensor.SubType> sensorSubTypes = joinManager.Select<Model.Sensor.SubType>(strCondition, out strErrorMessage);

            if (sensorSubTypes == null)
                return false;

            foreach (var subType in sensorSubTypes)
            {
                long subTypeKey = ((((long)subType.sensor_ty_code) << 32) | ((long)subType.sensor_sub_ty_no));
                dicSensorSubTypes[subTypeKey] = subType;
            }

            return true;
        }

        private List<AlarmData.SensorZoneData> ToAlarmSensorZones(List<int> sensorZoneNos)
        {
            if (sensorZoneNos == null)
                return null;

            List<AlarmData.SensorZoneData> alarmSensorZones = new List<AlarmData.SensorZoneData>();

            foreach (int sensorZoneNo in sensorZoneNos)
            {
                AlarmData.SensorZoneData sensorZoneData = new AlarmData.SensorZoneData();
                sensorZoneData.SensorZoneNo = sensorZoneNo;

                alarmSensorZones.Add(sensorZoneData);
            }

            return alarmSensorZones;
        }

        private int GetSopStatus(JoinManager joinManager, int sensorZoneHistoryNo)
        {
            string strErrorMessage;
            string strCondition = string.Format("{0} = {1}", ActionStep.Fields.sensor_zone_hist_sn, sensorZoneHistoryNo);
            ActionStep actionStepHistory = joinManager.SelectFirst<ActionStep>(strCondition, out strErrorMessage);

            if (actionStepHistory == null)
            {
                // SOP가 실행되지 않았다.
                return -1;
            }

            if (actionStepHistory.end_time != null)
                return History.SopStatus.FinishSOP;

            return History.SopStatus.RunningSOP;
        }

        public ResponseAlarmPosition GetAlarmPosition(RequestAlarmPosition data)
        {
            string strErrorMessage;
            string strCondition = string.Format("{0} = {1}", SensorZoneDetail.Fields.sensor_zone_hist_sn, data.SensorZoneHistoryNo);
            IEnumerable<SensorZoneDetail> sensorZoneHistoryDetails = m_dataManager.GetSelect().Select<SensorZoneDetail>(strCondition, out strErrorMessage);

            if (sensorZoneHistoryDetails == null)
                return new ResponseAlarmPosition(false, strErrorMessage);

            Dictionary<int, List<int>> dicSensorZoneHistoryDetails = new Dictionary<int, List<int>>();

            List<int> sensorZoneNos = new List<int>();
            dicSensorZoneHistoryDetails[data.SensorZoneHistoryNo] = sensorZoneNos;

            foreach (var sensorZoneHistoryDetail in sensorZoneHistoryDetails)
            {
                sensorZoneNos.Add(sensorZoneHistoryDetail.sensor_zone_sn);
            }

            JoinManager joinManager = new JoinManager(m_dataManager);

            Dictionary<int, EquipZone_Zone_Building_BuildingGroup> dicSensorZoneInfos = GetSensorZoneInfo(joinManager, dicSensorZoneHistoryDetails, out strErrorMessage);

            if (dicSensorZoneInfos == null)
                return null;

            EquipZone_Zone_Building_BuildingGroup sensorZoneInfo = GetSensorZoneInfo(data.SensorZoneHistoryNo, dicSensorZoneHistoryDetails, dicSensorZoneInfos);

            if (sensorZoneInfo == null)
                return new ResponseAlarmPosition(true, "");

            EquipZone_Zone_Building_BuildingGroup info;
            string strPosition = "";

            foreach (int sensorZoneNo in sensorZoneNos)
            {
                if (dicSensorZoneInfos.TryGetValue(sensorZoneNo, out info))
                {
                    if (info.EquipZone != null)
                        strPosition = info.EquipZone.disp_text;
                    else if (info.Zone != null)
                        strPosition = info.Zone.disp_text;
                    else if (info.Building != null)
                        strPosition = info.Building.disp_text;

                    break;
                }
            }

            ResponseAlarmPosition response = new ResponseAlarmPosition(true, "");
            response.Position = strPosition;
            return response;
        }

        public MessageResult RequestManualReport(RequestManualReport data, string strSopWebServerUrl)
        {
            if (strSopWebServerUrl == null || strSopWebServerUrl.Length == 0)
                return new MessageResult(false, "알람을 전달할 URL이 지정되지 않았습니다.", ErrorCode.NoParameters);

            string strUrl = strSopWebServerUrl.EndsWith("/") ? strSopWebServerUrl + "api/ManualReport" : strSopWebServerUrl + "/api/ManualReport";

            string strErrorMessage = null;

            JObject json = new JObject();

            json.Add("sensorType", data.SensorType);
            json.Add("sensorSubType", data.SensorSubType);
            json.Add("zoneNo", data.ZoneNo);
            json.Add("alarmDepth", data.AlarmDepth);
            json.Add("userNo", data.UserNo);
            json.Add("reportPerson", data.ReportPerson);
            json.Add("memo", data.Memo);
            json.Add("timeStamp", data.TimeStamp);

            if (WebServiceManager.SendJsonData(json, strUrl, out strErrorMessage))
                return new MessageResult(true, "");

            return new MessageResult(false, strErrorMessage);
        }

        public ResponseAlarmCCTVList RequestAlarmCCTVList(RequestAlarmCCTVList data)
        {
            string strCondition = string.Format("a.{0} = {1}", SensorZone.Fields.sensor_zone_hist_sn, data.SensorZoneHistoryNo);

            JoinManager joinManager = new JoinManager(m_dataManager);

            string strErrorMessage;
            ArrayList arrDatas = joinManager.JoinSensorZoneHistorySensorZoneHistoryDetailSensorZoneEquipmentZone(strCondition, out strErrorMessage);

            if (arrDatas == null)
                return new ResponseAlarmCCTVList(false, strErrorMessage);

            int nDataCount = arrDatas.Count;

            string strSensorZoneNos = null;
            string strEquipZoneNos = null;

            for (int i = 0; i < nDataCount - 3; i += 4)
            {
                if (arrDatas[i] is SensorZone && arrDatas[i + 1] is SensorZoneDetail && arrDatas[i + 2] is Base.Model.Sensor.SensorZone && (arrDatas[i + 3] == null || arrDatas[i + 3] is EquipmentZone))
                {
                    SensorZone sensorZoneHistory = (SensorZone)arrDatas[i];
                    SensorZoneDetail sensorZoneHistoryDetail = (SensorZoneDetail)arrDatas[i + 1];
                    Base.Model.Sensor.SensorZone sensorZone = (Base.Model.Sensor.SensorZone)arrDatas[i + 2];
                    EquipmentZone equipZone = (EquipmentZone)arrDatas[i + 3];

                    if (strSensorZoneNos == null)
                        strSensorZoneNos = sensorZone.sensor_zone_sn.ToString();
                    else
                        strSensorZoneNos += "," + sensorZone.sensor_zone_sn.ToString();

                    if (equipZone != null)
                    {
                        if (strEquipZoneNos == null)
                            strEquipZoneNos = equipZone.eqp_zone_sn.ToString();
                        else
                            strEquipZoneNos += "," + equipZone.eqp_zone_sn.ToString();
                    }
                }
            }

            if (strSensorZoneNos == null)
                return new ResponseAlarmCCTVList(true, "");

            ResponseAlarmCCTVList response = new ResponseAlarmCCTVList(true, "");
            response.SensorZoneHistoryNo = data.SensorZoneHistoryNo;

            // 먼저 SensorZoneCCTV를 검색한다.
            List<CCTVData> sensorZoneCCTVs = GetSensorZoneCCTVs(strSensorZoneNos, out strErrorMessage);

            if (sensorZoneCCTVs == null)
                return new ResponseAlarmCCTVList(false, strErrorMessage);

            if (sensorZoneCCTVs.Count > 0)
            {
                response.CctvDatas.AddRange(sensorZoneCCTVs);
                return response;
            }

            List<CCTVData> equipZoneCCTVs = GetEquipZoneCCTVs(strEquipZoneNos, out strErrorMessage);

            if (equipZoneCCTVs == null)
                return new ResponseAlarmCCTVList(false, strErrorMessage);

            if (equipZoneCCTVs.Count > 0)
            {
                response.CctvDatas.AddRange(equipZoneCCTVs);
                return response;
            }

            return response;
        }

        public ResponseAlarmMemoList RequestAlarmMemoList(RequestAlarmMemoList data)
        {
            if (data.SensorZoneHistoryNos.Count == 0)
                return new ResponseAlarmMemoList(true, "");

            string strSQL = string.Format("Select {0} sensorZoneHistoryNo, {1} memo from {2} where {0} in ({3})", SensorZone.Fields.sensor_zone_hist_sn, SensorZone.Fields.memo, SensorZone.TableName, string.Join(",", data.SensorZoneHistoryNos));

            string strErrorMessage;
            IEnumerable<dynamic> result = m_dataManager.GetSelect().Select(strSQL, out strErrorMessage);

            if (result == null)
                return new ResponseAlarmMemoList(false, strErrorMessage);

            ResponseAlarmMemoList response = new ResponseAlarmMemoList(true, "");

            foreach (var item in result)
            {
                int sensorZoneHistoryNo = item.sensorZoneHistoryNo;
                string memo = item.memo;

                ResponseAlarmMemoList.AlarmMemo alarmMemo = new ResponseAlarmMemoList.AlarmMemo();
                alarmMemo.SensorZoneHistoryNo = sensorZoneHistoryNo;
                alarmMemo.Memo = memo;

                response.AlarmMemos.Add(alarmMemo);
            }

            return response;
        }

        public ResponseAlarmMemoList SaveAlarmMemoList(SaveAlarmMemoList data)
        {
            if (data.SensorZoneHistoryNos.Count == 0)
                return new ResponseAlarmMemoList(false, "메모를 수정할 알람이 선택되지 않았습니다.");

            Dictionary<SensorZone.Fields, object> dicSets = new Dictionary<SensorZone.Fields, object>();
            dicSets[SensorZone.Fields.memo] = data.Memo;

            string strCondition = null;

            if (data.SensorZoneHistoryNos.Count > 0)
                strCondition = string.Format("{0} in ({1})", SensorZone.Fields.sensor_zone_hist_sn, string.Join(",", data.SensorZoneHistoryNos));

            string strErrorMessage;

            if (m_dataManager.GetUpdate().Update<SensorZone, SensorZone.Fields>(dicSets, strCondition, out strErrorMessage) == false)
                return new ResponseAlarmMemoList(false, strErrorMessage);

            ResponseAlarmMemoList response = new ResponseAlarmMemoList(true, "");

            foreach (int sensorZoneHistoryNo in data.SensorZoneHistoryNos)
            {
                ResponseAlarmMemoList.AlarmMemo alarmMemo = new ResponseAlarmMemoList.AlarmMemo();
                alarmMemo.SensorZoneHistoryNo = sensorZoneHistoryNo;
                alarmMemo.Memo = data.Memo;

                response.AlarmMemos.Add(alarmMemo);
            }

            return response;
        }

        public MessageResult UpdateSensorZoneCCTVs(UpdateSensorZoneCCTVs data)
        {
            string strErrorMessage;
            IDataManager dataManager = m_dataManager.Clone();

            if (dataManager.BeginBatch(out strErrorMessage) == false)
                return new MessageResult(false, "시스템 데이터베이스의 트랜잭션을 시작할 수 없습니다.", ErrorCode.BeginTransactionFail);

            if (data.UpdateDatas.Count > 0)
            {
                if (UpdateSensorZoneCCTVs(dataManager, data.UpdateDatas, out strErrorMessage) == false)
                {
                    string strTemp;
                    dataManager.BatchRollback(out strTemp);
                    return new MessageResult(false, strErrorMessage);
                }
            }

            if (data.DeleteDatas.Count > 0)
            {
                if (DeleteSensorZoneCCTVs(dataManager, data.DeleteDatas, out strErrorMessage) == false)
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
                return new ResponseAlarmNotification(false, "데이터베이스의 트랜잭션을 정상적으로 종료시키지 못하였습니다.", ErrorCode.CommitTransactionFail);
            }

            return new MessageResult(true, "");
        }

        private bool DeleteSensorZoneCCTVs(IDataManager dataManager, List<int> deleteDatas, out string strErrorMessage)
        {
            string strCondition = string.Format("{0} in ({1})", SensorZoneCCTV.Fields.sensor_zone_sn, string.Join(",", deleteDatas));
            return dataManager.GetDelete().Delete<SensorZoneCCTV>(strCondition, out strErrorMessage);
        }

        private bool UpdateSensorZoneCCTVs(IDataManager dataManager, List<UpdateCCTVData> updateDatas, out string strErrorMessage)
        {
            foreach (var updateData in updateDatas)
            {
                string strCondition = string.Format("{0} = {1}", SensorZoneCCTV.Fields.sensor_zone_sn, updateData.SensorZoneNo);
                SensorZoneCCTV sensorZoneCCTV = dataManager.GetSelect().SelectFirst<SensorZoneCCTV>(strCondition, out strErrorMessage);

                if (sensorZoneCCTV == null)
                {
                    if (strErrorMessage != null)
                        return false;
                    else
                    {
                        if (InsertSensorZoneCCTV(dataManager, updateData, out strErrorMessage) == false)
                            return false;
                    }
                }
                else
                {
                    if (UpdateSensorZoneCCTV(dataManager, updateData, out strErrorMessage) == false)
                        return false;
                }
            }

            strErrorMessage = null;
            return true;
        }

        private bool UpdateSensorZoneCCTV(IDataManager dataManager, UpdateCCTVData updateData, out string strErrorMessage)
        {
            SensorZoneCCTV sensorZoneCCTV = new SensorZoneCCTV();
            sensorZoneCCTV.sensor_zone_sn = updateData.SensorZoneNo;
            sensorZoneCCTV.cctv_1 = updateData.Cctv1;
            sensorZoneCCTV.cctv_2 = updateData.Cctv2;
            sensorZoneCCTV.cctv_3 = updateData.Cctv3;
            sensorZoneCCTV.cctv_4 = updateData.Cctv4;

            return dataManager.GetUpdate().Update<SensorZoneCCTV>(sensorZoneCCTV, null, out strErrorMessage);
        }

        private bool InsertSensorZoneCCTV(IDataManager dataManager, UpdateCCTVData updateData, out string strErrorMessage)
        {
            SensorZoneCCTV sensorZoneCCTV = new SensorZoneCCTV();
            sensorZoneCCTV.sensor_zone_sn = updateData.SensorZoneNo;
            sensorZoneCCTV.cctv_1 = updateData.Cctv1;
            sensorZoneCCTV.cctv_2 = updateData.Cctv2;
            sensorZoneCCTV.cctv_3 = updateData.Cctv3;
            sensorZoneCCTV.cctv_4 = updateData.Cctv4;

            return dataManager.GetCreate().Insert<SensorZoneCCTV>(sensorZoneCCTV, out strErrorMessage);
        }

        private List<CCTVData> GetEquipZoneCCTVs(string strEquipZoneNos, out string strErrorMessage)
        {
            string strCondition = string.Format("{0} in ({1})", EquipZoneCCTV.Fields.eqp_zone_sn, strEquipZoneNos);
            IEnumerable<EquipZoneCCTV> equipZoneCCTVs = m_dataManager.GetSelect().Select<EquipZoneCCTV>(strCondition, out strErrorMessage);

            if (equipZoneCCTVs == null)
                return null;

            Dictionary<int, int> dicCCTVNos = new Dictionary<int, int>();

            foreach (var equipZoneCCTV in equipZoneCCTVs)
            {
                if (equipZoneCCTV.cctv_1 != null)
                    dicCCTVNos[(int)equipZoneCCTV.cctv_1] = (int)equipZoneCCTV.cctv_1;

                if (equipZoneCCTV.cctv_2 != null)
                    dicCCTVNos[(int)equipZoneCCTV.cctv_2] = (int)equipZoneCCTV.cctv_2;

                if (equipZoneCCTV.cctv_3 != null)
                    dicCCTVNos[(int)equipZoneCCTV.cctv_3] = (int)equipZoneCCTV.cctv_3;

                if (equipZoneCCTV.cctv_4 != null)
                    dicCCTVNos[(int)equipZoneCCTV.cctv_4] = (int)equipZoneCCTV.cctv_4;
            }

            return ToCCTVDatas(dicCCTVNos, out strErrorMessage);
        }

        private List<CCTVData> GetSensorZoneCCTVs(string strSensorZoneNos, out string strErrorMessage)
        {
            string strCondition = string.Format("{0} in ({1})", SensorZoneCCTV.Fields.sensor_zone_sn, strSensorZoneNos);
            IEnumerable<SensorZoneCCTV> sensorZoneCCTVs = m_dataManager.GetSelect().Select<SensorZoneCCTV>(strCondition, out strErrorMessage);

            if (sensorZoneCCTVs == null)
                return null;

            Dictionary<int, int> dicCCTVNos = new Dictionary<int, int>();

            foreach (var sensorZoneCCTV in sensorZoneCCTVs)
            {
                if (sensorZoneCCTV.cctv_1 != null)
                    dicCCTVNos[(int)sensorZoneCCTV.cctv_1] = (int)sensorZoneCCTV.cctv_1;

                if (sensorZoneCCTV.cctv_2 != null)
                    dicCCTVNos[(int)sensorZoneCCTV.cctv_2] = (int)sensorZoneCCTV.cctv_2;

                if (sensorZoneCCTV.cctv_3 != null)
                    dicCCTVNos[(int)sensorZoneCCTV.cctv_3] = (int)sensorZoneCCTV.cctv_3;

                if (sensorZoneCCTV.cctv_4 != null)
                    dicCCTVNos[(int)sensorZoneCCTV.cctv_4] = (int)sensorZoneCCTV.cctv_4;
            }

            return ToCCTVDatas(dicCCTVNos, out strErrorMessage);
        }

        private List<CCTVData> ToCCTVDatas(Dictionary<int, int> dicCCTVNos, out string strErrorMessage)
        {
            strErrorMessage = null;

            if (dicCCTVNos.Count == 0)
                return new List<CCTVData>();

            string strCondition = string.Format("{0} in ({1})", Base.Model.Sensor.Sensor.Fields.sensor_sn, string.Join(",", dicCCTVNos.Keys));
            IEnumerable<Base.Model.Sensor.Sensor> sensors = m_dataManager.GetSelect().Select<Base.Model.Sensor.Sensor>(strCondition, out strErrorMessage);

            if (sensors == null)
                return null;

            List<CCTVData> cctvDatas = new List<CCTVData>();

            foreach (var sensor in sensors)
            {
                CCTVData cctvData = new CCTVData();

                cctvData.CameraName = sensor.sensor_name;
                cctvData.CctvNo = sensor.sensor_sn;

                if (sensor.zone_sn != null)
                    cctvData.ZoneNo = (int)sensor.zone_sn;

                cctvDatas.Add(cctvData);
            }

            return cctvDatas;
        }

        private int GetLastReactionType(List<SensorReaction> sensorReactionHistories, out DateTime? reactionTime)
        {
            reactionTime = null;

            if (sensorReactionHistories == null)
                return dnsData.CommonCode.History.ReactionType.None;

            int historyCount = sensorReactionHistories.Count;

            var first = sensorReactionHistories[0];
            var last = sensorReactionHistories[historyCount - 1];

            if (first.sensor_react_hist_sn > last.sensor_react_hist_sn)
            {
                reactionTime = first.tm;
                return first.react_ty_code;
            }

            reactionTime = last.tm;
            return last.react_ty_code;
        }

        private string GetAlarmMessage(List<SensorReaction> sensorReactionHistories)
        {
            // 재난신고 되었는지 먼저 확인한다.
            foreach (var sensorReactionHistory in sensorReactionHistories)
            {
                if (sensorReactionHistory.react_ty_code == History.ReactionType.NotifySignal || sensorReactionHistory.react_ty_code == (int)CodeType.ReactionType - History.ReactionType.NotifySignal)
                    return sensorReactionHistory.mssage;
            }

            // 신고되지 않은 알람이면 최초 탐지상태를 사용한다.
            foreach (var sensorReactionHistory in sensorReactionHistories)
            {
                if (sensorReactionHistory.react_ty_code == History.ReactionType.BeginStatus || sensorReactionHistory.react_ty_code == (int)CodeType.ReactionType - History.ReactionType.BeginStatus)
                    return sensorReactionHistory.mssage;
            }

            return "";
        }

        private Dictionary<int, Current> GetCurrentAlarms(out string strErrorMessage)
        {
            IEnumerable<Current> currentAlarms = m_dataManager.GetSelect().Select<Current>(null, out strErrorMessage);

            if (currentAlarms == null)
                return null;

            Dictionary<int, Current> dicCurrentAlarms = new Dictionary<int, Current>();

            foreach (Current alarm in currentAlarms)
            {
                dicCurrentAlarms[alarm.sensor_zone_hist_sn] = alarm;
            }

            return dicCurrentAlarms;
        }

        private Dictionary<int, string> GetSensorTypeNames(Dictionary<int, SensorZone> dicSensorZoneHistories, out string strErrorMessage)
        {
            Dictionary<int, int> dicCodeNos = new Dictionary<int, int>();

            foreach (var pair in dicSensorZoneHistories)
            {
                dicCodeNos[pair.Value.sensor_ty_code] = pair.Value.sensor_ty_code;
            }

            string strCodeNos = null;

            foreach (var pair in dicCodeNos)
            {
                if (strCodeNos == null)
                    strCodeNos = pair.Key.ToString();
                else
                    strCodeNos += "," + pair.Key.ToString();
            }

            Dictionary<int, string> dicSensorTypeNames = new Dictionary<int, string>();
            strErrorMessage = null;

            if (strCodeNos == null)
                return dicSensorTypeNames;

            string strCondition = string.Format("{0} in ({1})", Codes.Fields.code, strCodeNos);
            IEnumerable<Codes> codes = m_dataManager.GetSelect().Select<Codes>(strCondition, out strErrorMessage);

            if (codes == null)
                return null;

            foreach (Codes code in codes)
            {
                dicSensorTypeNames[code.code] = code.code_name;
            }

            return dicSensorTypeNames;
        }

        private EquipZone_Zone_Building_BuildingGroup GetSensorZoneInfo(int sensorZoneHistoryNo, Dictionary<int, List<int>> dicSensorZoneHistoryDetails, Dictionary<int, EquipZone_Zone_Building_BuildingGroup> dicSensorZoneInfos)
        {
            List<int> sensorZoneNos = null;

            if (dicSensorZoneHistoryDetails.TryGetValue(sensorZoneHistoryNo, out sensorZoneNos))
            {
                EquipZone_Zone_Building_BuildingGroup info;

                foreach (int sensorZoneNo in sensorZoneNos)
                {
                    if (dicSensorZoneInfos.TryGetValue(sensorZoneNo, out info))
                        return info;
                }
            }

            return null;
        }

        private Dictionary<int, EquipZone_Zone_Building_BuildingGroup> GetSensorZoneInfo(JoinManager joinManager, Dictionary<int, List<int>> dicSensorZoneHistoryDetails, out string strErrorMessage)
        {
            Dictionary<int, int> dicSensorZoneNos = new Dictionary<int, int>();

            foreach (var pair in dicSensorZoneHistoryDetails)
            {
                foreach (int sensorZoneNo in pair.Value)
                {
                    dicSensorZoneNos[sensorZoneNo] = sensorZoneNo;
                }
            }

            string strNos = null;

            foreach (var pair in dicSensorZoneNos)
            {
                if (strNos == null)
                    strNos = pair.Key.ToString();
                else
                    strNos += "," + pair.Key.ToString();
            }

            strErrorMessage = null;

            Dictionary<int, EquipZone_Zone_Building_BuildingGroup> dicSensorZoneInfos = new Dictionary<int, EquipZone_Zone_Building_BuildingGroup>();

            if (strNos == null)
                return dicSensorZoneInfos;

            string strCondition = string.Format("a.{0} in ({1})", Model.Sensor.SensorZone.Fields.sensor_zone_sn, strNos);
            ArrayList arrDatas = joinManager.JoinSensorZoneEquipmentZoneZoneBuildingBuildingGroup(strCondition, out strErrorMessage);

            if (arrDatas == null)
                return null;

            int nDataCount = arrDatas.Count;

            for (int i=0;i<nDataCount-4;i+=5)
            {
                if (arrDatas[i] is Model.Sensor.SensorZone && arrDatas[i + 1] is EquipmentZone && arrDatas[i + 2] is Zone && (arrDatas[i + 3] is null || arrDatas[i + 3] is Building) && (arrDatas[i + 4] is null || arrDatas[i + 4] is BuildingGroup))
                {
                    Model.Sensor.SensorZone sensorZone = (Model.Sensor.SensorZone)arrDatas[i];
                    EquipmentZone equipZone = (EquipmentZone)arrDatas[i + 1];
                    Zone zone = (Zone)arrDatas[i + 2];
                    Building building = (Building)arrDatas[i + 3];
                    BuildingGroup buildingGroup = (BuildingGroup)arrDatas[i + 4];

                    // 하나의 SensorZone에 두개 이상의 Zone이 있을 경우 첫번째 Zone만 사용한다.
                    if (dicSensorZoneInfos.ContainsKey(sensorZone.sensor_zone_sn) == false)
                    {
                        dicSensorZoneInfos[sensorZone.sensor_zone_sn] = new EquipZone_Zone_Building_BuildingGroup(equipZone, zone, building, buildingGroup);
                    }
                }
            }

            return dicSensorZoneInfos;
        }

        private int GetAlarmDepth(List<SensorReaction> sensorReactionHistories)
        {
            for (int i=sensorReactionHistories.Count-1;i>=0;i--)
            {
                SensorReaction sensorReactionHistory = sensorReactionHistories[i];

                if (sensorReactionHistory.alarm_level != null)
                    return (int)sensorReactionHistory.alarm_level;
            }

            return 1;
        }

        // Return 값 :
        //             Key : SensorZoneHistory No
        private Dictionary<int, List<SensorReaction>> GetSensorReactionHistories(JoinManager joinManager, Dictionary<int, SensorZone> dicSensorZoneHistories, out string strErrorMessage)
        {
            strErrorMessage = null;
            string strNos = null;

            foreach (var pair in dicSensorZoneHistories)
            {
                if (strNos == null)
                    strNos = pair.Value.sensor_zone_hist_sn.ToString();
                else
                    strNos += "," + pair.Value.sensor_zone_hist_sn.ToString();
            }

            if (strNos == null)
                return new Dictionary<int, List<SensorReaction>>();

            string strCondition = string.Format("{0} in ({1})", SensorReaction.Fields.sensor_zone_hist_sn, strNos);
            IEnumerable<SensorReaction> sensorReactionHistories = joinManager.Select<SensorReaction>(strCondition, out strErrorMessage);

            if (sensorReactionHistories == null)
                return null;

            // Key : SensorZoneHistory No
            Dictionary<int, List<SensorReaction>> dicSensorReactionHistories = new Dictionary<int, List<SensorReaction>>();

            foreach (var sensorReactionHistory in sensorReactionHistories)
            {
                List<SensorReaction> _sensorReactionHistories = null;

                if (dicSensorReactionHistories.TryGetValue(sensorReactionHistory.sensor_zone_hist_sn, out _sensorReactionHistories) == false)
                {
                    _sensorReactionHistories = new List<SensorReaction>();
                    dicSensorReactionHistories[sensorReactionHistory.sensor_zone_hist_sn] = _sensorReactionHistories;
                }

                _sensorReactionHistories.Add(sensorReactionHistory);
            }

            foreach (var pair in dicSensorReactionHistories)
            {
                pair.Value.Sort(CompareSensorReaction);
            }

            return dicSensorReactionHistories;
        }

        private int CompareSensorReaction(SensorReaction reactionHistory1, SensorReaction reactionHistory2)
        {
            if (reactionHistory1.sensor_react_hist_sn < reactionHistory2.sensor_react_hist_sn)
                return -1;
            else if (reactionHistory1.sensor_react_hist_sn > reactionHistory2.sensor_react_hist_sn)
                return 1;

            return 0;
        }

        // dicSensorZoneHistoryDetails :
        //              Key : SensorZoneHistory No
        //              Value : SensorZone No List
        // Return 값 :
        //              Key : SensorZoneHistory No
        private Dictionary<int, SensorZone> GetSensorZoneHistories(JoinManager joinManager, RequestAlarm data, Dictionary<int, List<int>> dicSensorZoneHistoryDetails, out string strErrorMessage)
        {
            string strCondition = null;

            if (data.SiteNo != null)
                SetCondition(ref strCondition, string.Format("a.{0} = {1}", SensorZone.Fields.site_sn, (int)data.SiteNo));

            if (data.SensorType != null)
                SetCondition(ref strCondition, string.Format("a.{0} = {1}", SensorZone.Fields.sensor_ty_code, (int)data.SensorType));

            if (data.BeginDate != null)
                SetCondition(ref strCondition, string.Format("a.{0} >= '{1}'", SensorZone.Fields.tm, GetDateTimeString((DateTime)data.BeginDate)));

            if (data.EndDate != null)
                SetCondition(ref strCondition, string.Format("a.{0} <= '{1}'", SensorZone.Fields.tm, GetDateTimeString((DateTime)data.EndDate)));

            ArrayList arrDatas = joinManager.JoinSensorZoneHistorySensorZoneHistoryDetail(strCondition, out strErrorMessage);

            if (arrDatas == null)
                return null;

            int nDataCount = arrDatas.Count;

            // Key : SensorZoneHistory No
            Dictionary<int, SensorZone> dicSensorZoneHistories = new Dictionary<int, SensorZone>();

            for (int i = 0; i < nDataCount - 1; i += 2)
            {
                if (arrDatas[i] is SensorZone && arrDatas[i + 1] is SensorZoneDetail)
                {
                    SensorZone sensorZoneHistory = (SensorZone)arrDatas[i];
                    SensorZoneDetail sensorZoneHistoryDetail = (SensorZoneDetail)arrDatas[i + 1];

                    List<int> sensorZoneNos = null;

                    if (dicSensorZoneHistoryDetails.TryGetValue(sensorZoneHistory.sensor_zone_hist_sn, out sensorZoneNos) == false)
                    {
                        sensorZoneNos = new List<int>();
                        dicSensorZoneHistoryDetails[sensorZoneHistory.sensor_zone_hist_sn] = sensorZoneNos;
                    }

                    sensorZoneNos.Add(sensorZoneHistoryDetail.sensor_zone_sn);
                    dicSensorZoneHistories[sensorZoneHistory.sensor_zone_hist_sn] = sensorZoneHistory;
                }
            }

            return dicSensorZoneHistories;
        }

        private string GetDateTimeString(DateTime time)
        {
            return string.Format("{0}-{1:00}-{2:00} {3:00}:{4:00}:{5:00}", time.Year, time.Month, time.Day, time.Hour, time.Minute, time.Second);
        }

        private void SetCondition(ref string strConditionTarget, string strConditionSource)
        {
            if (strConditionTarget == null || strConditionTarget.Length == 0)
                strConditionTarget = strConditionSource;
            else
                strConditionTarget += " and " + strConditionSource;
        }
    }
}
