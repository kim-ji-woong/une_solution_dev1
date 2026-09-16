using System;
using System.Collections.Generic;
using dnsDapperDBUtil.DataAccessLayer.IDAL;
using Base.History.IBLL.Request;
using Base.History.IBLL.Response;
using Base.History.IBLL.Models.History;
using Base.Model.History;
using Base.Model.Spatial;
using Base.Model.Common;
using Base.DAL;
using dnsDapperDBUtil.Manager;
using System.Collections;

namespace Base.History.BLL.Process
{
    using Models;

    class SensorAnalysisManager
    {
        private class SensorAnalysisHistoryEx : SensorAnalysisHistory
        {
            private int? m_sensorTypeCode = null;
            private int? m_sensorSubTypeNo = null;
            private int? m_sensorZoneNo = null;
            private int? m_equipZoneNo = null;
            //private int m_accumulationRatio = 0;

            public int? SensorTypeCode
            {
                get { return m_sensorTypeCode; }
                set { m_sensorTypeCode = value; }
            }

            public int? SensorSubTypeNo
            {
                get { return m_sensorSubTypeNo; }
                set { m_sensorSubTypeNo = value; }
            }

            public int? SensorZoneNo
            {
                get { return m_sensorZoneNo; }
                set { m_sensorZoneNo = value; }
            }

            public int? EquipZoneNo
            {
                get { return m_equipZoneNo; }
                set { m_equipZoneNo = value; }
            }
        }

        private IDataManager m_dataManager = null;

        public SensorAnalysisManager(IDataManager dataManager)
        {
            m_dataManager = dataManager;
        }

        public ResponseSensorAnalysisHistory GetSensorAnalysisHistory(RequestSensorAnalysisHistory data)
        {
            string strBeginDateTime = GetDateTimeString(data.BeginYear, data.BeginMonth, data.BeginDay, true);
            string strEndDateTime = GetDateTimeString(data.EndYear, data.EndMonth, data.EndDay, false);

            int beginIndex = 1;
            int? itemCount = data.PageRowCount;

            if (data.PageRowCount != null)
            {
                beginIndex = (int)data.PageRowCount * (data.PageNo - 1) + 1;
            }

            int? endIndex = null;

            if (itemCount != null)
                endIndex = beginIndex + (int)itemCount - 1;

            return GetSensorAnalysisHistory(data, strBeginDateTime, strEndDateTime, beginIndex, endIndex);
        }

        private ResponseSensorAnalysisHistory GetSensorAnalysisHistory(RequestSensorAnalysisHistory data, string strBeginDateTime, string strEndDateTime, int beginIndex, int? endIndex, bool recursive = false)
        {
            string strBuildingGroupName = null, strBuildingName = null, strZoneName = null;
            int maxMalfunctionCount = 0, maxMalfunctionCountSensorZoneNo = 0, maxMalfunctionCountSensorNo = 0;

            string strErrorMessage;
            List<SensorAnalysisHistoryData> historyDatas = SelectSensorAnalysisHistoryData(data, beginIndex, endIndex, strBeginDateTime, strEndDateTime, ref strBuildingGroupName, ref strBuildingName, ref strZoneName, ref maxMalfunctionCount, ref maxMalfunctionCountSensorZoneNo, ref maxMalfunctionCountSensorNo, out strErrorMessage);

            if (historyDatas == null)
                return new ResponseSensorAnalysisHistory(false, strErrorMessage);

            Dictionary<long, SensorTypeData> dicSensorTypeDatas = null;

            if (data.SensorTypeDatas != null)
            {
                dicSensorTypeDatas = new Dictionary<long, SensorTypeData>();

                foreach (SensorTypeData sensorTypeData in data.SensorTypeDatas)
                {
                    dicSensorTypeDatas[sensorTypeData.GetKey()] = sensorTypeData;
                }
            }

            // Key : SensorZone No
            Dictionary<int, EquipmentZone> dicLinkedEquipZones = new Dictionary<int, EquipmentZone>();
            // Key : EquipZone No
            Dictionary<int, List<Zone>> dicLinkedZones = new Dictionary<int, List<Zone>>();
            // Key : Zone No
            Dictionary<int, Building> dicLinkedBuildings = new Dictionary<int, Building>();
            // Key : Building No
            Dictionary<int, BuildingGroup> dicLinkedBuildingGroups = new Dictionary<int, BuildingGroup>();

            if (ReadSpatialInfo(historyDatas, dicLinkedEquipZones, dicLinkedZones, dicLinkedBuildings, dicLinkedBuildingGroups, out strErrorMessage) == false)
                return new ResponseSensorAnalysisHistory(false, strErrorMessage);

            ResponseSensorAnalysisHistory response = new ResponseSensorAnalysisHistory(true, "");

            double topMalfunctionSensorRatio = 0;
            string topMalfunctionSensorName = null;
            int mostDetectionCount = 0;
            string mostDetectionSensorName = null;

            EquipmentZone equipZone;
            List<Zone> zones;
            Building building;
            BuildingGroup buildingGroup;

            foreach (var historyData in historyDatas)
            {
                SensorAnalysisHistory history = new SensorAnalysisHistory();

                history.AccumulationRatio = historyData.AccumulationEventCount * 100.0 / historyData.TotalEventCount;
                history.DetectCount = historyData.EventCount;
                history.LocationName = historyData.Location;
                history.MalfunctionCount = historyData.MalfunctionCount;
                history.MalfunctionRatio = historyData.MalfunctionRatio;
                history.RowNo = historyData.rowindex;
                history.SensorClearCount = historyData.SystemResetCount;
                history.SensorName = historyData.SensorName;
                history.SensorTypeName = GetSensorTypeName(dicSensorTypeDatas, historyData);
                history.UserResetCount = historyData.UserResetCount;

                if (historyData.SensorZoneNo == maxMalfunctionCountSensorZoneNo)
                {
                    topMalfunctionSensorName = historyData.SensorName;
                    topMalfunctionSensorRatio = historyData.MalfunctionRatio;
                }

                if (mostDetectionCount == 0 || mostDetectionCount < historyData.EventCount)
                {
                    mostDetectionCount = historyData.EventCount;
                    mostDetectionSensorName = historyData.SensorName;
                }

                response.Histories.Add(history);
                response.TotalCount = historyData.totalcount;
                response.TotalDetectionCount = historyData.TotalEventCount;
                response.TotalMalfunctionRatio = historyData.TotalMalfunctionRatio;

                if (dicLinkedEquipZones.TryGetValue(historyData.SensorZoneNo, out equipZone))
                {
                    if (dicLinkedZones.TryGetValue(equipZone.eqp_zone_sn, out zones))
                    {
                        foreach (Zone zone in zones)
                        {
                            if (dicLinkedBuildings.TryGetValue(zone.zone_sn, out building))
                            {
                                if (dicLinkedBuildingGroups.TryGetValue(building.buld_sn, out buildingGroup))
                                {
                                    history.ZoneNo = zone.zone_sn;
                                    history.ZoneName = zone.disp_text;
                                    history.BuildingNo = building.buld_sn;
                                    history.BuildingName = building.disp_text;
                                    history.BuildingGroupNo = buildingGroup.buld_group_sn;
                                    history.BuildingGroupName = buildingGroup.disp_text;
                                    break;
                                }
                            }
                        }

                        if (history.ZoneNo == null && zones.Count > 0)
                        {
                            history.ZoneNo = zones[0].zone_sn;
                            history.ZoneName = zones[0].disp_text;
                        }
                    }
                }
            }

            if (beginIndex == 1)
            {
                if (topMalfunctionSensorName != null)
                {
                    response.TopMalfunctionSensorRatio = topMalfunctionSensorRatio;
                    response.TopMalfunctionSensorName = topMalfunctionSensorName;
                }
                else if (maxMalfunctionCountSensorNo != 0 && !recursive)
                {
                    if (GetMaxMalfunctionCountSensor(response, data, strBeginDateTime, strEndDateTime, maxMalfunctionCountSensorNo) == false)
                        return response;
                }

                response.MostDetectionSensorName = mostDetectionSensorName;
                response.MostDetectionSensorCount = mostDetectionCount;
            }
            else if (!recursive)
            {
                var responseTemp = GetSensorAnalysisHistory(data, strBeginDateTime, strEndDateTime, 1, 1, true);

                if (responseTemp.Success == false)
                    return responseTemp;
                else
                {
                    response.TopMalfunctionSensorRatio = responseTemp.TopMalfunctionSensorRatio;
                    response.TopMalfunctionSensorName = responseTemp.TopMalfunctionSensorName;
                    response.MostDetectionSensorName = responseTemp.MostDetectionSensorName;
                    response.MostDetectionSensorCount = responseTemp.MostDetectionSensorCount;

                    if (response.TopMalfunctionSensorName == null && maxMalfunctionCountSensorNo != 0)
                    {
                        if (GetMaxMalfunctionCountSensor(response, data, strBeginDateTime, strEndDateTime, maxMalfunctionCountSensorNo) == false)
                            return response;
                    }
                }
            }

            response.BuildingGroupName = strBuildingGroupName;
            response.BuildingName = strBuildingName;
            response.ZoneName = strZoneName;

            return response;
        }

        private bool ReadSpatialInfo(List<SensorAnalysisHistoryData> historyDatas, Dictionary<int, EquipmentZone> dicLinkedEquipZones, Dictionary<int, List<Zone>> dicLinkedZones, Dictionary<int, Building> dicLinkedBuildings, Dictionary<int, BuildingGroup> dicLinkedBuildingGroups, out string strErrorMessage)
        {
            string strSensorZoneNos = null;

            foreach (var historyData in historyDatas)
            {
                if (strSensorZoneNos == null)
                    strSensorZoneNos = historyData.SensorZoneNo.ToString();
                else
                    strSensorZoneNos += ", " + historyData.SensorZoneNo.ToString();
            }

            strErrorMessage = null;

            if (strSensorZoneNos == null)
                return true;

            JoinManager joinManager = new JoinManager(m_dataManager);

            string strCondition = string.Format("a.{0} in ({1})", Base.Model.Sensor.SensorZone.Fields.sensor_zone_sn, strSensorZoneNos);
            ArrayList arrResults = joinManager.JoinSensorZoneEquipmentZone(strCondition, out strErrorMessage);

            if (arrResults == null)
                return false;

            string strEquipZoneNos = null;
            int nResultCount = arrResults.Count;

            for (int i=0;i<nResultCount-1;i+=2)
            {
                if (arrResults[i] is Base.Model.Sensor.SensorZone && arrResults[i + 1] is EquipmentZone)
                {
                    var sensorZone = (Base.Model.Sensor.SensorZone)arrResults[i];
                    EquipmentZone equipZone = (EquipmentZone)arrResults[i + 1];

                    dicLinkedEquipZones[sensorZone.sensor_zone_sn] = equipZone;

                    if (strEquipZoneNos == null)
                        strEquipZoneNos = equipZone.eqp_zone_sn.ToString();
                    else
                        strEquipZoneNos += ", " + equipZone.eqp_zone_sn.ToString();
                }
            }

            if (strEquipZoneNos == null)
                return true;

            strCondition = string.Format("a.{0} in ({1})", EquipmentZone.Fields.eqp_zone_sn, strEquipZoneNos);
            arrResults = joinManager.JoinEquipmentZoneEquipmentZoneLinkedZone(strCondition, out strErrorMessage);

            if (arrResults == null)
                return false;

            nResultCount = arrResults.Count;
            string strZoneNos = null;

            // Key : ZoneNo
            // Value : EquipZoneNo
            Dictionary<int, int> dicZoneEquipZoneNo = new Dictionary<int, int>();

            for (int i = 0; i < nResultCount - 1; i += 2)
            {
                if (arrResults[i] is EquipmentZone && arrResults[i + 1] is EquipmentZoneLinkedZone)
                {
                    EquipmentZone equipZone = (EquipmentZone)arrResults[i];
                    EquipmentZoneLinkedZone linkedZone = (EquipmentZoneLinkedZone)arrResults[i + 1];

                    if (strZoneNos == null)
                        strZoneNos = linkedZone.zone_sn.ToString();
                    else
                        strZoneNos += ", " + linkedZone.zone_sn.ToString();

                    dicZoneEquipZoneNo[linkedZone.zone_sn] = linkedZone.eqp_zone_sn;
                }
            }

            if (strZoneNos != null)
            {
                strCondition = string.Format("a.{0} in ({1})", Zone.Fields.zone_sn, strZoneNos);
                arrResults = joinManager.JoinZoneBuildingBuildingGroup(strCondition, out strErrorMessage);

                if (arrResults == null)
                    return false;

                int equipZoneNo;
                List<Zone> zones;

                nResultCount = arrResults.Count;

                for (int i = 0; i < nResultCount - 2; i += 3)
                {
                    if (arrResults[i] is Zone && (arrResults[i + 1] == null || arrResults[i + 1] is Building) && (arrResults[i + 2] == null || arrResults[i + 2] is BuildingGroup))
                    {
                        Zone zone = (Zone)arrResults[i];
                        Building building = (Building)arrResults[i + 1];
                        BuildingGroup buildingGroup = (BuildingGroup)arrResults[i + 2];

                        if (dicZoneEquipZoneNo.TryGetValue(zone.zone_sn, out equipZoneNo) == false)
                            continue;

                        if (dicLinkedZones.TryGetValue(equipZoneNo, out zones) == false)
                        {
                            zones = new List<Zone>();
                            dicLinkedZones[equipZoneNo] = zones;
                        }

                        zones.Add(zone);

                        if (building != null && buildingGroup != null)
                        {
                            dicLinkedBuildings[zone.zone_sn] = building;
                            dicLinkedBuildingGroups[building.buld_sn] = buildingGroup;
                        }
                    }
                }
            }

            return true;
        }

        private bool GetMaxMalfunctionCountSensor(ResponseSensorAnalysisHistory response, RequestSensorAnalysisHistory data, string strBeginDateTime, string strEndDateTime, int sensorNo)
        {
            data.SensorNo = sensorNo;

            var responseTemp = GetSensorAnalysisHistory(data, strBeginDateTime, strEndDateTime, 1, 1, true);

            if (responseTemp.Success == false)
            {
                response.Success = false;
                response.Message = responseTemp.Message;
                return false;
            }

            response.TopMalfunctionSensorRatio = responseTemp.TopMalfunctionSensorRatio;
            response.TopMalfunctionSensorName = responseTemp.TopMalfunctionSensorName;
            return true;
        }

        private string GetSensorTypeName(Dictionary<long, SensorTypeData> dicSensorTypeDatas, SensorAnalysisHistoryData historyData)
        {
            if (dicSensorTypeDatas != null)
            {
                SensorTypeData data;
                long key = SensorTypeData.MakeKey(historyData.SensorType, historyData.SensorSubType);

                if (dicSensorTypeDatas.TryGetValue(key, out data))
                    return data.SensorTypeName;
            }

            return historyData.SensorSubType != null && historyData.SensorSubTypeName != null && historyData.SensorSubTypeName.Length > 0 ? historyData.SensorSubTypeName : historyData.SensorTypeName;
        }

        private string GetDateTimeString(int year, int month, int day, bool isBegin)
        {
            if (isBegin)
                return string.Format("{0}-{1:00}-{2:00} 00:00:00", year, month, day);

            return string.Format("{0}-{1:00}-{2:00} 23:59:59", year, month, day);
        }

        private List<SensorAnalysisHistoryData> SelectSensorAnalysisHistoryData(RequestSensorAnalysisHistory data, int beginIndex, int? endIndex, string strBeginDateTime, string strEndDateTime, ref string strBuildingGroupName, ref string strBuildingName, ref string strZoneName, ref int maxMalfunctionCount, ref int maxMalfunctionCountSensorZoneNo, ref int maxMalfunctionCountSensorNo, out string strErrorMessage)
        {
            string strCondition = null;

            if (strBeginDateTime != null)
                strCondition = string.Format("a.{0} >= '{1}'", SensorZoneDetail.Fields.tm, strBeginDateTime);

            if (strEndDateTime != null)
            {
                if (strCondition != null)
                    strCondition += string.Format(" and a.{0} <= '{1}'", SensorZoneDetail.Fields.tm, strEndDateTime);
                else
                    strCondition = string.Format("a.{0} <= '{1}'", SensorZoneDetail.Fields.tm, strEndDateTime);
            }

            string eventCountField = "eventCount";
            string strSubQuery = MakeSubQuery(data, strCondition, eventCountField);

            string accumlationField = "accumulation";
            string totalEventCountField = "totalEventCount";
            string totalMalfunctionCountField = "totalMalfunctionCount";

            string strAccumulationSubQuery = GetAccumulationSubQuery(eventCountField, accumlationField, strSubQuery, beginIndex);
            string strMainQuery = MakeMainQuery(eventCountField, strSubQuery, beginIndex, endIndex);

            int index = strMainQuery.ToLower().IndexOf("from");

            if (index < 0)
            {
                strErrorMessage = "잘못된 쿼리입니다.";
                return null;
            }

            string maxMalfunctionSensorZoneField = "maxMalfunctionSensorZone";
            string strTotalEventCountQuery = GetTotalEventCountQuery(eventCountField, totalEventCountField, strSubQuery);
            string strTotalMalfunctionRatioQuery = GetTotalMalfunctionRatioQuery(data, totalMalfunctionCountField, strCondition, maxMalfunctionSensorZoneField);

            string strQuery1 = strMainQuery.Substring(0, index) + ", " + strAccumulationSubQuery + ", " + strTotalEventCountQuery + ", " + strTotalMalfunctionRatioQuery;
            string strQuery2 = " " + strMainQuery.Substring(index);
            string strQuery = strQuery1 + strQuery2;

            IEnumerable<dynamic> result = m_dataManager.GetSelect().Select(strQuery, out strErrorMessage);

            if (result == null)
                return null;

            // Key : SensorZoneNo
            Dictionary<int, SensorAnalysisHistoryData> dicSensorAnalysisHistoryDatas = new Dictionary<int, SensorAnalysisHistoryData>();
            List<SensorAnalysisHistoryData> historyDatas = new List<SensorAnalysisHistoryData>();

            // Key : SensorZone No
            Dictionary<int, string> dicSensorZoneLocationNames = new Dictionary<int, string>();

            int prevAccumulationCount = 0;

            foreach (var item in result)
            {
                var data2 = item as IDictionary<string, object>;

                SensorAnalysisHistoryData historyData = new SensorAnalysisHistoryData();
                int totalMalfunctionCount = 0, accumulationCount = 0;

                foreach (KeyValuePair<string, object> pair in data2)
                {
                    ReadSensorAnalysisHistoryData(pair.Key, pair.Value, historyData, eventCountField, accumlationField, totalEventCountField, totalMalfunctionCountField, ref accumulationCount, ref totalMalfunctionCount, ref maxMalfunctionCount, ref maxMalfunctionCountSensorZoneNo, ref maxMalfunctionCountSensorNo);
                }

                dicSensorZoneLocationNames[historyData.SensorZoneNo] = historyData.Location;

                if (prevAccumulationCount == 0)
                    prevAccumulationCount = accumulationCount;

                historyData.AccumulationEventCount = prevAccumulationCount + historyData.EventCount;
                prevAccumulationCount = historyData.AccumulationEventCount;

                if (historyData.TotalEventCount > 0)
                    historyData.TotalMalfunctionRatio = totalMalfunctionCount * 100.0f / historyData.TotalEventCount;

                historyDatas.Add(historyData);
                dicSensorAnalysisHistoryDatas[historyData.SensorZoneNo] = historyData;
            }

            if (data.GetLocationName(m_dataManager, dicSensorZoneLocationNames))
            {
                string strLocationName;

                foreach (KeyValuePair<int, SensorAnalysisHistoryData> pair in dicSensorAnalysisHistoryDatas)
                {
                    if (dicSensorZoneLocationNames.TryGetValue(pair.Key, out strLocationName))
                        pair.Value.Location = strLocationName;
                }
            }

            if (ReadSensorAnalysisHistoryCount(data, dicSensorAnalysisHistoryDatas, strBeginDateTime, strEndDateTime, ref strBuildingGroupName, ref strBuildingName, ref strZoneName, out strErrorMessage) == false)
                return null;

            return historyDatas;
        }

        private string MakeSubQuery(RequestSensorAnalysisHistory data, string strCondition, string eventCountField)
        {
            string strSQL = string.Format("Select a.{0}, count(*) as {1} from {2} a", SensorZoneDetail.Fields.sensor_zone_sn, eventCountField, SensorZoneDetail.TableName);

            if (data.SensorNo != null)
                strSQL += MakeJoinWithSensorNo((int)data.SensorNo, data.SensorType, data.SensorSubTypes);
            else if (data.ZoneNo != null)
                strSQL += MakeJoinWithZoneNo((int)data.ZoneNo, data.SensorType, data.SensorSubTypes);
            else if (data.BuildingNo != null)
                strSQL += MakeJoinWithBuildingNo((int)data.BuildingNo, data.SensorType, data.SensorSubTypes);
            else if (data.BuildingGroupNo != null)
                strSQL += MakeJoinWithBuildingGroupNo((int)data.BuildingGroupNo, data.SensorType, data.SensorSubTypes);
            else
                strSQL += MakeJoinWithNone(data.SensorType, data.SensorSubTypes);

            data.CheckAdditionalCondition(ref strSQL);

            if (strCondition != null)
                strSQL += string.Format(" where {0} group by a.{1}", strCondition, SensorZoneDetail.Fields.sensor_zone_sn);
            else
                strSQL += string.Format(" group by a.{0}", SensorZoneDetail.Fields.sensor_zone_sn);

            return strSQL;
        }

        private string MakeJoinWithNone(int? sensorType, List<int> sensorSubTypes)
        {
            string strQuery = string.Format(" inner join {0} b on a.{1} = b.{2}",
                Base.Model.Sensor.SensorZone.TableName,
                SensorZoneDetail.Fields.sensor_zone_sn, Base.Model.Sensor.SensorZone.Fields.sensor_zone_sn);

            if (sensorType != null)
            {
                strQuery += string.Format(" and b.{0} = {1}", Base.Model.Sensor.SensorZone.Fields.sensor_ty_code, (int)sensorType);

                if (sensorSubTypes != null && sensorSubTypes.Count > 0)
                    strQuery += string.Format(" and b.{0} in ({1})", Base.Model.Sensor.SensorZone.Fields.sensor_sub_ty_no, string.Join(",", sensorSubTypes));
            }

            return strQuery;
        }

        private string MakeJoinWithBuildingGroupNo(int buildingGroupNo, int? sensorType, List<int> sensorSubTypes)
        {
            string strQuery = string.Format(" inner join {0} b on a.{3} = b.{4} inner join {1} c on b.{5} = c.{6} inner join {2} d on c.{7} = d.{8} and d.{9} = {10}",
                SensorZone.TableName, Zone.TableName, Building.TableName,
                SensorZoneDetail.Fields.sensor_zone_hist_sn, SensorZone.Fields.sensor_zone_hist_sn,
                SensorZone.Fields.zone_sn, Zone.Fields.zone_sn,
                Zone.Fields.buld_sn, Building.Fields.buld_sn,
                Building.Fields.buld_group_sn, buildingGroupNo);

            if (sensorType != null)
            {
                strQuery += string.Format(" and b.{0} = {1}", SensorZone.Fields.sensor_ty_code, (int)sensorType);

                if (sensorSubTypes != null && sensorSubTypes.Count > 0)
                {
                    strQuery += string.Format(" inner join {0} e on a.{1} = e.{2} and e.{3} in ({4})",
                        Base.Model.Sensor.SensorZone.TableName,
                        SensorZoneDetail.Fields.sensor_zone_sn, Base.Model.Sensor.SensorZone.Fields.sensor_zone_sn,
                        Base.Model.Sensor.SensorZone.Fields.sensor_sub_ty_no, string.Join(",", sensorSubTypes));
                }
            }

            return strQuery;
        }

        private string MakeJoinWithBuildingNo(int buildingNo, int? sensorType, List<int> sensorSubTypes)
        {
            string strQuery = string.Format(" inner join {0} b on a.{2} = b.{3} inner join {1} c on b.{4} = c.{5} and c.{6} = {7}",
                SensorZone.TableName, Zone.TableName,
                SensorZoneDetail.Fields.sensor_zone_hist_sn, SensorZone.Fields.sensor_zone_hist_sn,
                SensorZone.Fields.zone_sn, Zone.Fields.zone_sn,
                Zone.Fields.buld_sn, buildingNo);

            if (sensorType != null)
            {
                strQuery += string.Format(" and b.{0} = {1}", SensorZone.Fields.sensor_ty_code, (int)sensorType);

                if (sensorSubTypes != null && sensorSubTypes.Count > 0)
                {
                    strQuery += string.Format(" inner join {0} d on a.{1} = d.{2} and d.{3} in ({4})",
                        Base.Model.Sensor.SensorZone.TableName,
                        SensorZoneDetail.Fields.sensor_zone_sn, Base.Model.Sensor.SensorZone.Fields.sensor_zone_sn,
                        Base.Model.Sensor.SensorZone.Fields.sensor_sub_ty_no, string.Join(",", sensorSubTypes));
                }
            }

            return strQuery;
        }

        private string MakeJoinWithZoneNo(int zoneNo, int? sensorType, List<int> sensorSubTypes)
        {
            string strQuery = string.Format(" inner join {0} b on a.{1} = b.{2} and b.{3} = {4}",
                SensorZone.TableName,
                SensorZoneDetail.Fields.sensor_zone_hist_sn, SensorZone.Fields.sensor_zone_hist_sn,
                SensorZone.Fields.zone_sn, zoneNo);

            if (sensorType != null)
            {
                strQuery += string.Format(" and b.{0} = {1}", SensorZone.Fields.sensor_ty_code, (int)sensorType);

                if (sensorSubTypes != null && sensorSubTypes.Count > 0)
                {
                    strQuery += string.Format(" inner join {0} c on a.{1} = c.{2} and c.{3} in ({4})",
                        Base.Model.Sensor.SensorZone.TableName,
                        SensorZoneDetail.Fields.sensor_zone_sn, Base.Model.Sensor.SensorZone.Fields.sensor_zone_sn,
                        Base.Model.Sensor.SensorZone.Fields.sensor_sub_ty_no, string.Join(",", sensorSubTypes));
                }
            }

            return strQuery;
        }

        private string MakeJoinWithSensorNo(int sensorNo, int? sensorType, List<int> sensorSubTypes)
        {
            string strQuery = string.Format(" inner join {0} b on a.{1} = b.{2} and b.{3} = {4}",
                Base.Model.Sensor.SensorZone.TableName,
                SensorZoneDetail.Fields.sensor_zone_sn, Base.Model.Sensor.SensorZone.Fields.sensor_zone_sn,
                Base.Model.Sensor.SensorZone.Fields.sensor_sn, sensorNo);

            if (sensorType != null)
            {
                strQuery += string.Format(" and b.{0} = {1}", Base.Model.Sensor.SensorZone.Fields.sensor_ty_code, (int)sensorType);

                if (sensorSubTypes != null && sensorSubTypes.Count > 0)
                    strQuery += string.Format(" and b.{0} in ({1})", Base.Model.Sensor.SensorZone.Fields.sensor_sub_ty_no, string.Join(",", sensorSubTypes));
            }

            return strQuery;
        }

        // return 값 : TotalMalfunction Count + "_" + Max Malfunction Count + "_" + Max Malfunction count인 SensorZoneNo + "_" + Max Malfunction count인 SensorNo
        private string GetTotalMalfunctionRatioQuery(RequestSensorAnalysisHistory data, string totalMalfunctionCountField, string strCondition, string maxMalfunctionSensorZoneField)
        {
            string strSubQuery = string.Empty;
            
            // DB종류에 따라 데이터 비교를 위한 명시적 형변환 필요 - 26-03-11 채지훈
            if(m_dataManager.GetDBManager().DatabaseType == WebDBManager.DBType.sqlserver)
                strSubQuery = string.Format("Select a.{4}, b.{5}, count(b.{5}) as typeCount from {0} a inner join {1} b on a.{6} = b.{7} and b.{5} in ({8}) inner join {2} c on a.{9} = c.{10} inner join {3} d on c.{11} = d.{12} and d.{13} = {14}",
                    SensorZoneDetail.TableName, SensorReaction.TableName, Base.Model.Sensor.SensorZone.TableName, Base.Model.Sensor.Sensor.TableName,
                    SensorZoneDetail.Fields.sensor_zone_sn,
                    SensorReaction.Fields.react_ty_code,
                    SensorZoneDetail.Fields.sensor_zone_hist_sn, SensorReaction.Fields.sensor_zone_hist_sn,
                    dnsData.CommonCode.History.ReactionType.Malfunction,
                    SensorZoneDetail.Fields.sensor_zone_sn, Base.Model.Sensor.SensorZone.Fields.sensor_zone_sn,
                    Base.Model.Sensor.SensorZone.Fields.sensor_sn, Base.Model.Sensor.Sensor.Fields.sensor_sn,
                    Base.Model.Sensor.Sensor.Fields.manual_yn, CustomManager.GetBoolValue(m_dataManager, false));
            else if (m_dataManager.GetDBManager().DatabaseType == WebDBManager.DBType.npgsql)
                strSubQuery = string.Format("Select a.{4} ::text, b.{5} ::text, count(b.{5}) as typeCount from {0} a inner join {1} b on a.{6} = b.{7} and b.{5} in ({8}) inner join {2} c on a.{9} = c.{10} inner join {3} d on c.{11} = d.{12} and d.{13} = {14}",
                    SensorZoneDetail.TableName, SensorReaction.TableName, Base.Model.Sensor.SensorZone.TableName, Base.Model.Sensor.Sensor.TableName,
                    SensorZoneDetail.Fields.sensor_zone_sn,
                    SensorReaction.Fields.react_ty_code,
                    SensorZoneDetail.Fields.sensor_zone_hist_sn, SensorReaction.Fields.sensor_zone_hist_sn,
                    dnsData.CommonCode.History.ReactionType.Malfunction,
                    SensorZoneDetail.Fields.sensor_zone_sn, Base.Model.Sensor.SensorZone.Fields.sensor_zone_sn,
                    Base.Model.Sensor.SensorZone.Fields.sensor_sn, Base.Model.Sensor.Sensor.Fields.sensor_sn,
                    Base.Model.Sensor.Sensor.Fields.manual_yn, CustomManager.GetBoolValue(m_dataManager, false));

            if (data.SensorNo != null)
                strSubQuery += MakeJoinWithSensorNo2((int)data.SensorNo, data.SensorType, data.SensorSubTypes);
            else if (data.ZoneNo != null)
                strSubQuery += MakeJoinWithZoneNo2((int)data.ZoneNo, data.SensorType, data.SensorSubTypes);
            else if (data.BuildingNo != null)
                strSubQuery += MakeJoinWithBuildingNo2((int)data.BuildingNo, data.SensorType, data.SensorSubTypes);
            else if (data.BuildingGroupNo != null)
                strSubQuery += MakeJoinWithBuildingGroupNo2((int)data.BuildingGroupNo, data.SensorType, data.SensorSubTypes);
            else
                strSubQuery += MakeJoinWithNone2(data.SensorType, data.SensorSubTypes);

            if (strCondition != null)
                strSubQuery += string.Format(" where {0} group by a.{1}, b.{2}", strCondition, SensorZoneDetail.Fields.sensor_zone_sn, SensorReaction.Fields.react_ty_code);
            else
                strSubQuery += string.Format(" group by a.{0}, b.{1}", SensorZoneDetail.Fields.sensor_zone_sn, SensorReaction.Fields.react_ty_code);

            string strMaxSensorZoneQuery = AddQueryToSensorNo(strSubQuery) + string.Format(", d.{0} order by count(b.{1}) desc", Base.Model.Sensor.Sensor.Fields.sensor_sn, SensorReaction.Fields.react_ty_code);
            strMaxSensorZoneQuery = CustomManager.MakeTopNQuery(m_dataManager, strMaxSensorZoneQuery, 1);

            List<string> fields = new List<string>();

            // DB종류에 따라 데이터 비교를 위한 명시적 형변환 필요 - 26-03-11 채지훈
            if (m_dataManager.GetDBManager().DatabaseType == WebDBManager.DBType.sqlserver)
            {
                fields.Add("sum(data.typeCount)");
                fields.Add("max(data.typeCount)");
            }
            else if (m_dataManager.GetDBManager().DatabaseType == WebDBManager.DBType.npgsql)
            {
                fields.Add("sum(data.typeCount) ::text");
                fields.Add("max(data.typeCount) ::text");
            }
            fields.Add("(" + strMaxSensorZoneQuery + ")");

            string strConcatFields = CustomManager.ConcatFields(m_dataManager, fields, "_");
            string strSQL = string.Format("Select {0} as {1} from ({2}) data", strConcatFields, maxMalfunctionSensorZoneField, strSubQuery);
            return string.Format("({0}) as {1}", strSQL, totalMalfunctionCountField);
        }

        private string AddQueryToSensorNo(string strSQL)
        {
            int index = strSQL.ToLower().IndexOf("from");

            if (index < 0)
                return strSQL;

            int index2 = strSQL.ToLower().IndexOf("where");

            if (index2 < 0)
                return strSQL;

            string strFrom = strSQL.Substring(index, index2 - index);
            string strWhere = strSQL.Substring(index2);

            List<string> fields = new List<string>();

            // DB종류에 따라 데이터 비교를 위한 명시적 형변환 필요 - 26-03-11 채지훈
            if (m_dataManager.GetDBManager().DatabaseType == WebDBManager.DBType.sqlserver)
            {
                fields.Add(string.Format("a.{0}", SensorZoneDetail.Fields.sensor_zone_sn));
                fields.Add(string.Format("d.{0}", Base.Model.Sensor.Sensor.Fields.sensor_sn));
            }
            else if (m_dataManager.GetDBManager().DatabaseType == WebDBManager.DBType.npgsql)
            {
                fields.Add(string.Format("a.{0}::text", SensorZoneDetail.Fields.sensor_zone_sn));
                fields.Add(string.Format("d.{0}::text", Base.Model.Sensor.Sensor.Fields.sensor_sn));
            }

            string strConcatFields = CustomManager.ConcatFields(m_dataManager, fields, "_");
            string strQuery = string.Format("Select {0} {1} ", strConcatFields, strFrom);

            return strQuery + strWhere;
        }

        private string MakeJoinWithNone2(int? sensorType, List<int> sensorSubTypes)
        {
            string strQuery = "";

            if (sensorType != null)
            {
                strQuery += string.Format(" and c.{0} = {1}", Base.Model.Sensor.SensorZone.Fields.sensor_ty_code, (int)sensorType);

                if (sensorSubTypes != null && sensorSubTypes.Count > 0)
                    strQuery += string.Format(" and c.{0} in ({1})", Base.Model.Sensor.SensorZone.Fields.sensor_sub_ty_no, string.Join(",", sensorSubTypes));
            }

            return strQuery;
        }

        private string MakeJoinWithBuildingGroupNo2(int buildingGroupNo, int? sensorType, List<int> sensorSubTypes)
        {
            string strQuery = string.Format(" and a.{2} = c.{3} inner join {0} e on d.{4} = e.{5} inner join {1} f on e.{6} = f.{7} and f.{8} = {9}",
                Zone.TableName, Building.TableName,
                SensorZoneDetail.Fields.sensor_zone_sn, Base.Model.Sensor.SensorZone.Fields.sensor_zone_sn,
                Base.Model.Sensor.Sensor.Fields.zone_sn, Zone.Fields.zone_sn,
                Zone.Fields.buld_sn, Building.Fields.buld_sn,
                Building.Fields.buld_group_sn, buildingGroupNo);

            if (sensorType != null)
            {
                strQuery += string.Format(" and c.{0} = {1}", SensorZone.Fields.sensor_ty_code, (int)sensorType);

                if (sensorSubTypes != null && sensorSubTypes.Count > 0)
                {
                    strQuery += string.Format(" and c.{0} in ({1})",
                        Base.Model.Sensor.SensorZone.Fields.sensor_sub_ty_no, string.Join(",", sensorSubTypes));
                }
            }

            return strQuery;
        }

        private string MakeJoinWithBuildingNo2(int buildingNo, int? sensorType, List<int> sensorSubTypes)
        {
            string strQuery = string.Format(" and a.{1} = c.{2} inner join {0} e on d.{3} = e.{4} and e.{5} = {6}",
                Zone.TableName,
                SensorZoneDetail.Fields.sensor_zone_sn, Base.Model.Sensor.SensorZone.Fields.sensor_zone_sn,
                Base.Model.Sensor.Sensor.Fields.zone_sn, Zone.Fields.zone_sn,
                Zone.Fields.buld_sn, buildingNo);

            if (sensorType != null)
            {
                strQuery += string.Format(" and c.{0} = {1}", SensorZone.Fields.sensor_ty_code, (int)sensorType);

                if (sensorSubTypes != null && sensorSubTypes.Count > 0)
                {
                    strQuery += string.Format(" and c.{0} in ({1})",
                        Base.Model.Sensor.SensorZone.Fields.sensor_sub_ty_no, string.Join(",", sensorSubTypes));
                }
            }

            return strQuery;
        }

        private string MakeJoinWithZoneNo2(int zoneNo, int? sensorType, List<int> sensorSubTypes)
        {
            string strQuery = string.Format(" and d.{0} = {1}",
                Base.Model.Sensor.Sensor.Fields.zone_sn, zoneNo);

            if (sensorType != null)
            {
                strQuery += string.Format(" and d.{0} = {1}", Base.Model.Sensor.Sensor.Fields.sensor_ty_code, (int)sensorType);

                if (sensorSubTypes != null && sensorSubTypes.Count > 0)
                {
                    strQuery += string.Format(" and c.{0} in ({1})",
                        Base.Model.Sensor.SensorZone.Fields.sensor_sub_ty_no, string.Join(",", sensorSubTypes));
                }
            }

            return strQuery;
        }

        private string MakeJoinWithSensorNo2(int sensorNo, int? sensorType, List<int> sensorSubTypes)
        {
            string strQuery = string.Format(" and c.{0} = {1}",
                Base.Model.Sensor.SensorZone.Fields.sensor_sn, sensorNo);

            if (sensorType != null)
            {
                strQuery += string.Format(" and c.{0} = {1}", Base.Model.Sensor.SensorZone.Fields.sensor_ty_code, (int)sensorType);

                if (sensorSubTypes != null && sensorSubTypes.Count > 0)
                    strQuery += string.Format(" and c.{0} in ({1})", Base.Model.Sensor.SensorZone.Fields.sensor_sub_ty_no, string.Join(",", sensorSubTypes));
            }

            return strQuery;
        }

        private string GetTotalEventCountQuery(string eventCountField, string strTotalEventCountField, string strSubQuery)
        {
            string strSQL = string.Format("Select sum({7}) from {0} a inner join ({1}) b on a.{6} = b.{10} inner join {2} c on a.{11} = c.{12} left outer join {3} d on a.{13} = d.{14} inner join {4} e on c.{15} = e.{16} left outer join {5} f on c.{15} = f.{19} and a.{20} = f.{21}",
                Base.Model.Sensor.SensorZone.TableName, strSubQuery, Base.Model.Sensor.Sensor.TableName, EquipmentZone.TableName, Codes.TableName, Base.Model.Sensor.SubType.TableName,
                Base.Model.Sensor.SensorZone.Fields.sensor_zone_sn, eventCountField, Base.Model.Sensor.Sensor.Fields.sensor_name, EquipmentZone.Fields.disp_text,
                SensorZoneDetail.Fields.sensor_zone_sn,
                Base.Model.Sensor.SensorZone.Fields.sensor_sn, Base.Model.Sensor.Sensor.Fields.sensor_sn,
                Base.Model.Sensor.SensorZone.Fields.eqp_zone_sn, EquipmentZone.Fields.eqp_zone_sn,
                Base.Model.Sensor.Sensor.Fields.sensor_ty_code, Codes.Fields.code,
                Codes.Fields.code_name,
                Base.Model.Sensor.Sensor.Fields.sensor_ty_code, Base.Model.Sensor.SubType.Fields.sensor_ty_code,
                Base.Model.Sensor.SensorZone.Fields.sensor_sub_ty_no, Base.Model.Sensor.SubType.Fields.sensor_sub_ty_no,
                Base.Model.Sensor.SubType.Fields.sensor_sub_ty_name);

            return string.Format("({0}) as {1}", strSQL, strTotalEventCountField);
        }

        private string MakeMainQuery(string eventCountField, string strSubQuery, int beginIndex, int? endIndex)
        {
            string strSQL = string.Format("Select a.{6}, a.{20}, f.{22}, b.{7}, c.{8}, d.{9}, c.{15}, e.{17} from {0} a inner join ({1}) b on a.{6} = b.{10} inner join {2} c on a.{11} = c.{12} left outer join {3} d on a.{13} = d.{14} inner join {4} e on c.{15} = e.{16} left outer join {5} f on c.{15} = f.{19} and a.{20} = f.{21}",
                Base.Model.Sensor.SensorZone.TableName, strSubQuery, Base.Model.Sensor.Sensor.TableName, EquipmentZone.TableName, Codes.TableName, Base.Model.Sensor.SubType.TableName,
                Base.Model.Sensor.SensorZone.Fields.sensor_zone_sn, eventCountField, Base.Model.Sensor.Sensor.Fields.sensor_name, EquipmentZone.Fields.disp_text,
                SensorZoneDetail.Fields.sensor_zone_sn,
                Base.Model.Sensor.SensorZone.Fields.sensor_sn, Base.Model.Sensor.Sensor.Fields.sensor_sn,
                Base.Model.Sensor.SensorZone.Fields.eqp_zone_sn, EquipmentZone.Fields.eqp_zone_sn,
                Base.Model.Sensor.Sensor.Fields.sensor_ty_code, Codes.Fields.code,
                Codes.Fields.code_name,
                Base.Model.Sensor.Sensor.Fields.sensor_ty_code, Base.Model.Sensor.SubType.Fields.sensor_ty_code,
                Base.Model.Sensor.SensorZone.Fields.sensor_sub_ty_no, Base.Model.Sensor.SubType.Fields.sensor_sub_ty_no,
                Base.Model.Sensor.SubType.Fields.sensor_sub_ty_name);

            string strOrderBy = string.Format("b.{0} desc", eventCountField);
            return Base.DAL.CustomManager.MakePaginationQuery(m_dataManager, strSQL, beginIndex, endIndex, strOrderBy);
        }

        private string GetAccumulationSubQuery(string eventCountField, string accumlationField, string strSubQuery, int beginIndex)
        {
            if (beginIndex == 1)
                return "0 as " + accumlationField;

            int endIndex = beginIndex - 1;
            string strSubQuery2 = MakeMainQuery(eventCountField, strSubQuery, 1, endIndex);
            return string.Format("(Select sum({0}) from ({2}) data) as {1}", eventCountField, accumlationField, strSubQuery2);
        }

        private bool ReadSensorAnalysisHistoryCount(RequestSensorAnalysisHistory data, Dictionary<int, SensorAnalysisHistoryData> dicSensorAnalysisHistoryDatas, string strBeginDateTime, string strEndDateTime, ref string strBuildingGroupName, ref string strBuildingName, ref string strZoneName, out string strErrorMessage)
        {
            string buildingGroupNameField = "buildingGroupName";
            string buildingNameField = "buildingName";
            string zoneNameField = "zoneName";

            string strSQL = string.Format("Select a.{2}, b.{3}, count(b.{3}) as typeCount {14} {15} {16} from {0} a inner join {1} b on a.{4} = b.{5} and b.{6} in ({10}, {11}, {12}, {13}) where a.{7} >= '{8}' and a.{7} <= '{9}'",
                SensorZoneDetail.TableName, SensorReaction.TableName,
                SensorZoneDetail.Fields.sensor_zone_sn, SensorReaction.Fields.react_ty_code,
                SensorZoneDetail.Fields.sensor_zone_hist_sn, SensorReaction.Fields.sensor_zone_hist_sn,
                SensorReaction.Fields.react_ty_code,
                SensorZoneDetail.Fields.tm, strBeginDateTime, strEndDateTime,
                dnsData.CommonCode.History.ReactionType.ClearSignal, dnsData.CommonCode.History.ReactionType.EndStatus, dnsData.CommonCode.History.ReactionType.Malfunction, dnsData.CommonCode.History.ReactionType.UserReset,
                GetBuildingGroupNameQuery(data, buildingGroupNameField),
                GetBuildingNameQuery(data, buildingNameField),
                GetZoneNameQuery(data, zoneNameField));

            int historyCount = dicSensorAnalysisHistoryDatas.Count;

            if (historyCount <= 100 && historyCount > 0)
            {
                strSQL += string.Format(" and a.{0} in ({1})", SensorZoneDetail.Fields.sensor_zone_sn, GetSensorZoneNos(dicSensorAnalysisHistoryDatas));
            }

            strSQL += string.Format(" group by a.{0}, b.{1} order by a.{0}", SensorZoneDetail.Fields.sensor_zone_sn, SensorReaction.Fields.react_ty_code);

            IEnumerable<dynamic> result = m_dataManager.GetSelect().Select(strSQL, out strErrorMessage);

            if (result == null)
                return false;

            SensorAnalysisHistoryData historyData;

            foreach (var item in result)
            {
                var data2 = item as IDictionary<string, object>;
                int sensorZoneNo = 0, reactionTypeNo = 0, typeCount = 0;

                foreach (KeyValuePair<string, object> pair in data2)
                {
                    ReadSensorAnalysisReactionCount(pair.Key, pair.Value, ref sensorZoneNo, ref reactionTypeNo, ref typeCount, ref strBuildingGroupName, ref strBuildingName, ref strZoneName, buildingGroupNameField, buildingNameField, zoneNameField);
                }

                if (dicSensorAnalysisHistoryDatas.TryGetValue(sensorZoneNo, out historyData))
                {
                    if (reactionTypeNo == dnsData.CommonCode.History.ReactionType.ClearSignal || reactionTypeNo == dnsData.CommonCode.History.ReactionType.EndStatus)
                        historyData.SystemResetCount = typeCount;
                    else if (reactionTypeNo == dnsData.CommonCode.History.ReactionType.Malfunction)
                    {
                        historyData.MalfunctionCount = typeCount;

                        if (historyData.EventCount > 0)
                            historyData.MalfunctionRatio = typeCount * 100.0f / historyData.EventCount;
                    }
                    else if (reactionTypeNo == dnsData.CommonCode.History.ReactionType.UserReset)
                        historyData.UserResetCount = typeCount;
                }
            }

            return true;
        }

        private string GetZoneNameQuery(RequestSensorAnalysisHistory data, string zoneNameField)
        {
            if (data.ZoneNo == null)
                return "";

            return string.Format(", (Select {0} from {1} where {2} = {3}) as {4}", Zone.Fields.disp_text, Zone.TableName, Zone.Fields.zone_sn, (int)data.ZoneNo, zoneNameField);
        }

        private string GetBuildingNameQuery(RequestSensorAnalysisHistory data, string buildingNameField)
        {
            if (data.BuildingNo == null)
                return "";

            return string.Format(", (Select {0} from {1} where {2} = {3}) as {4}", Building.Fields.disp_text, Building.TableName, Building.Fields.buld_sn, (int)data.BuildingNo, buildingNameField);
        }

        private string GetBuildingGroupNameQuery(RequestSensorAnalysisHistory data, string buildingGroupNameField)
        {
            if (data.BuildingGroupNo == null)
                return "";

            return string.Format(", (Select {0} from {1} where {2} = {3}) as {4}", BuildingGroup.Fields.disp_text, BuildingGroup.TableName, BuildingGroup.Fields.buld_group_sn, (int)data.BuildingGroupNo, buildingGroupNameField);
        }

        private string GetSensorZoneNos(Dictionary<int, SensorAnalysisHistoryData> dicSensorAnalysisHistoryDatas)
        {
            string strSensorZoneNos = null;

            foreach (KeyValuePair<int, SensorAnalysisHistoryData> pair in dicSensorAnalysisHistoryDatas)
            {
                if (strSensorZoneNos == null)
                    strSensorZoneNos = pair.Value.SensorZoneNo.ToString();
                else
                    strSensorZoneNos += ", " + pair.Value.SensorZoneNo.ToString();
            }

            return strSensorZoneNos;
        }

        private void ReadSensorAnalysisHistoryData(string strFieldName, object value, SensorAnalysisHistoryData data, string eventCountField, string accumlationField, string totalEventCountField, string totalMalfunctionCountField, ref int accumulationCount, ref int totalMalfunctionCount, ref int maxMalfunctionCount, ref int maxMalfunctionCountSensorZoneNo, ref int maxMalfunctionCountSensorNo)
        {
            // DB종류에 상관없이 형변환 안정성을 위해 Convert.ToInt32 - 26-03-11 채지훈
            strFieldName = strFieldName.ToLower();

            if (strFieldName == Base.Model.Sensor.SensorZone.Fields.sensor_zone_sn.ToString())
                data.SensorZoneNo = Convert.ToInt32(value);
            else if (strFieldName == Base.Model.Sensor.SensorZone.Fields.sensor_sub_ty_no.ToString())
            {
                if (value != null)
                    data.SensorSubType = Convert.ToInt32(value);
            }
            else if (strFieldName == Base.Model.Sensor.SubType.Fields.sensor_sub_ty_name.ToString())
                data.SensorSubTypeName = (string)value;
            else if (strFieldName == eventCountField.ToLower())
                data.EventCount = Convert.ToInt32(value);
            else if (strFieldName == accumlationField.ToLower())
                accumulationCount = Convert.ToInt32(value);
            else if (strFieldName == totalEventCountField.ToLower())
                data.TotalEventCount = Convert.ToInt32(value);
            else if (strFieldName == totalMalfunctionCountField.ToLower())
            {
                if (value != null)
                {
                    string[] tokens = value.ToString().Split('_');

                    if (tokens.Length == 4)
                    {
                        int data1, data2, data3, data4;

                        if (int.TryParse(tokens[0].Trim(), out data1) && int.TryParse(tokens[1].Trim(), out data2) && int.TryParse(tokens[2].Trim(), out data3) && int.TryParse(tokens[3].Trim(), out data4))
                        {
                            totalMalfunctionCount = data1;
                            maxMalfunctionCount = data2;
                            maxMalfunctionCountSensorZoneNo = data3;
                            maxMalfunctionCountSensorNo = data4;
                        }
                    }
                }
            }
            else if (strFieldName == Base.Model.Sensor.Sensor.Fields.sensor_name.ToString())
                data.SensorName = (string)value;
            else if (strFieldName == EquipmentZone.Fields.disp_text.ToString())
                data.Location = (string)value;
            else if (strFieldName == Base.Model.Sensor.Sensor.Fields.sensor_ty_code.ToString())
                data.SensorType = Convert.ToInt32(value);
            else if (strFieldName == Codes.Fields.code_name.ToString())
                data.SensorTypeName = (string)value;
            else if (strFieldName == "rowindex")
                data.rowindex = Convert.ToInt32(value);
            else if (strFieldName == "totalcount")
                data.totalcount = Convert.ToInt32(value);
        }

        private bool ReadSensorAnalysisReactionCount(string strFieldName, object value, ref int sensorZoneNo, ref int reactiontTypeNo, ref int typeCount, ref string strBuildingGroupName, ref string strBuildingName, ref string strZoneName, string buildingGroupNameField, string buildingNameField, string zoneNameField)
        {
            strFieldName = strFieldName.ToLower();

            // DB종류에 상관없이 형변환 안정성을 위해 Convert.ToInt32 - 26-03-11 채지훈
            if (strFieldName == SensorZoneDetail.Fields.sensor_zone_sn.ToString())
                sensorZoneNo = Convert.ToInt32(value);
            else if (strFieldName == SensorReaction.Fields.react_ty_code.ToString())
                reactiontTypeNo = Convert.ToInt32(value);
            else if (strFieldName == "typecount")
                typeCount = Convert.ToInt32(value);
            else if (strFieldName == buildingGroupNameField.ToLower())
                strBuildingGroupName = (string)value;
            else if (strFieldName == buildingNameField.ToLower())
                strBuildingName = (string)value;
            else if (strFieldName == zoneNameField.ToLower())
                strZoneName = (string)value;

            return true;
        }
    }
}
