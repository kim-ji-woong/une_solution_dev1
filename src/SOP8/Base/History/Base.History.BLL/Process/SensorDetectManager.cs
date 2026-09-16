using System;
using System.Collections.Generic;
using dnsDapperDBUtil.DataAccessLayer.IDAL;
using Base.History.IBLL.Request;
using Base.History.IBLL.Response;
using Base.Model.History;
using Base.Model.Spatial;
using Base.History.IBLL.Models.History;
using Base.Model.Common;
using Base.DAL;
using System.Collections;

namespace Base.History.BLL.Process
{
    using Models;

    class SensorDetectManager
    {
        private class SensorDetectHistoryEx : SensorDetectHistory
        {
            public enum DetectStatusTypes { None = 0, Test, Real }
            public enum CloseTypes { None = 0, SensorClear, UserReset, Malfunction }

            // 하나의 SensorZoneHistory에 여러 SensorZone이 연결되어 있는 경우를 위하여...
            private List<int> m_sensorZoneNos = new List<int>();

            private int? m_sensorZoneNo = null;
            private int? m_equipZoneNo = null;
            private int? m_sensorZoneHistoryNo = null;
            private int? m_sensorTypeCode = null;
            private int? m_sensorSubTypeNo = null;
            private DetectStatusTypes m_detectStatusType = DetectStatusTypes.None;
            private CloseTypes m_closeType = CloseTypes.None;
            private int m_nAlarmDepth = -1;
            private int m_nRowNo = -1;
            private int m_nSensorReactionHistoryNo = -1;

            // 하나의 SensorZoneHistory에 여러 SensorZone이 연결되어 있는 경우를 위하여...
            public List<int> SensorZoneNos
            {
                get { return m_sensorZoneNos; }
                set { m_sensorZoneNos = value; }
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

            public int? SensorZoneHistoryNo
            {
                get { return m_sensorZoneHistoryNo; }
                set { m_sensorZoneHistoryNo = value; }
            }

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

            public DetectStatusTypes DetectStatusType
            {
                get { return m_detectStatusType; }
                set { m_detectStatusType = value; }
            }

            public CloseTypes CloseType
            {
                get { return m_closeType; }
                set { m_closeType = value; }
            }

            public int AlarmDepth
            {
                get { return m_nAlarmDepth; }
                set { m_nAlarmDepth = value; }
            }

            public int SensorReactionHistoryNo
            {
                get { return m_nSensorReactionHistoryNo; }
                set { m_nSensorReactionHistoryNo = value; }
            }

            public new int RowNo
            {
                get { return m_nRowNo; }
                set { m_nRowNo = value; }
            }

            public static DetectStatusTypes GetDetectStastusType(string strMessage)
            {
                if (strMessage == null || strMessage.Length == 0)
                    return DetectStatusTypes.None;

                if (strMessage.Trim().ToLower().StartsWith("[test]"))
                    return DetectStatusTypes.Test;

                return DetectStatusTypes.Real;
            }

            public string GetDetectStatusTypeName()
            {
                if (m_detectStatusType == DetectStatusTypes.Real)
                    return "실제";
                else if (m_detectStatusType == DetectStatusTypes.Test)
                    return "테스트";

                return "";
            }

            public string GetCloseTypeName()
            {
                if (m_closeType == CloseTypes.SensorClear)
                    return "현장 종료";
                else if (m_closeType == CloseTypes.UserReset)
                    return "사용자 복구";
                else if (m_closeType == CloseTypes.Malfunction)
                    return "오작동";

                return "";
            }

            public string GetAlarmDepthName()
            {
                if (m_nAlarmDepth == 1)
                    return "관심";
                else if (m_nAlarmDepth == 2)
                    return "주의";
                else if (m_nAlarmDepth == 3)
                    return "경계";
                else if (m_nAlarmDepth == 4)
                    return "주의";

                return "";
            }
        }

        private class SensorZoneHistoryEx : SensorZone
        {
            public int sensor_react_hist_sn { get; set; }

            public SensorZoneHistoryEx()
            {
            }

            public SensorZoneHistoryEx(SensorZone sensorZoneHistory)
            {
                this.FromCopy(sensorZoneHistory);
            }
        }

        public class SensorZoneEx
        {
            private Model.Sensor.Sensor m_sensor = null;
            private Model.Sensor.SensorZone m_sensorZone = null;

            public Model.Sensor.Sensor Sensor
            {
                get { return m_sensor; }
                set { m_sensor = value; }
            }

            public Model.Sensor.SensorZone SensorZone
            {
                get { return m_sensorZone; }
                set { m_sensorZone = value; }
            }

            public SensorZoneEx()
            {
            }

            public SensorZoneEx(Model.Sensor.Sensor sensor, Model.Sensor.SensorZone sensorZone)
            {
                m_sensor = sensor;
                m_sensorZone = sensorZone;
            }
        }

        private IDataManager m_dataManager = null;

        public SensorDetectManager(IDataManager dataManager)
        {
            m_dataManager = dataManager;
        }

        public ResponseSensorDetectHistory GetSensorDetectHistory(RequestSensorDetectHistory data)
        {
            // 하나의 SensorZoneHistory에 두 개 이상의 센서가 신호를 발생할 경우에 대한 예외처리를 위하여 alias 추가
            string strAlias = "a";

            string strCondition = string.Format("{3}.{0} >= '{1}' and {3}.{0} <= '{2}'",
                SensorZone.Fields.tm,
                LoadManager.GetDateString(data.BeginYear, data.BeginMonth, data.BeginDay, true),
                LoadManager.GetDateString(data.EndYear, data.EndMonth, data.EndDay, false),
                strAlias);

            if (data.SensorType != null)
            {
                strCondition += string.Format(" and {2}.{0} = {1}", SensorZone.Fields.sensor_ty_code, (int)data.SensorType, strAlias);

                if (data.SensorSubTypes != null && data.SensorSubTypes.Count > 0)
                {
                    strCondition += string.Format(" and {10}.{0} in (Select {1} from {2} where {3} in (Select {4} from {5} where {6} = {7} and {8} in ({9})))",
                        SensorZone.Fields.sensor_zone_hist_sn,
                        SensorZoneDetail.Fields.sensor_zone_hist_sn,
                        SensorZoneDetail.TableName,
                        SensorZoneDetail.Fields.sensor_zone_sn,
                        Model.Sensor.SensorZone.Fields.sensor_zone_sn,
                        Model.Sensor.SensorZone.TableName,
                        Model.Sensor.SensorZone.Fields.sensor_ty_code,
                        (int)data.SensorType,
                        Model.Sensor.SensorZone.Fields.sensor_sub_ty_no,
                        string.Join(",", data.SensorSubTypes.ToArray()),
                        strAlias);
                }
            }

            if (data.SensorNo != null)
                AddSensorNoCondition(ref strCondition, (int)data.SensorNo, strAlias);
            else if (data.ZoneNo != null)
                AddZoneNoCondition(ref strCondition, (int)data.ZoneNo, strAlias);
            else if (data.BuildingNo != null)
                AddBuildingNoCondition(ref strCondition, (int)data.BuildingNo, strAlias);
            else if (data.BuildingGroupNo != null)
                AddBuildingGroupNoCondition(ref strCondition, (int)data.BuildingGroupNo, strAlias);

            if (data.SiteNo != null)
                strCondition += string.Format(" and {2}.{0} = {1}", SensorZone.Fields.site_sn, (int)data.SiteNo, strAlias);

            int beginIndex = 1;
            int? itemCount = data.PageRowCount;

            if (data.PageRowCount != null)
            {
                beginIndex = (int)data.PageRowCount * (data.PageNo - 1) + 1;
            }

            data.CheckAdditionalCondition(ref strCondition);
            return GetSensorDetectHistory(data, strCondition, beginIndex, itemCount, strAlias);
        }

        private ResponseSensorDetectHistory GetSensorDetectHistory(RequestSensorDetectHistory data, string strCondition, int beginIndex, int? itemCount, string strAlias)
        {
            SensorZone sensorZoneTable = new SensorZone();

            int? endIndex = null;

            if (itemCount != null)
                endIndex = beginIndex + (int)itemCount - 1;

            // BeginStatus와 AlarmSignal이 둘다 있는 알람은 AlarmSignal을 사용하고 => 일반 센서 탐지
            // BeginStatus만 있는 알람은 BeginStatus를 사용한다. => 수동신고
            string strSubQuery = string.Format("SELECT h.{1}, h.{2}, min(h.{3}) as {3} FROM {0} h WHERE h.{4} = CASE WHEN EXISTS (SELECT {5} FROM {0} h2 WHERE h2.{1} = h.{1} AND h2.{4} = {6}) THEN {6} ELSE {5} END group by h.{1}, h.{2}",
                SensorReaction.TableName,
                SensorReaction.Fields.sensor_zone_hist_sn,
                SensorReaction.Fields.sensor_zone_sn,
                SensorReaction.Fields.sensor_react_hist_sn,
                SensorReaction.Fields.react_ty_code,
                dnsData.CommonCode.History.ReactionType.BeginStatus,
                dnsData.CommonCode.History.ReactionType.AlarmSignal);

            string strFieldNames = GetFieldNames(sensorZoneTable, strAlias);

            // 하나의 SensorZoneHistory에 두 개 이상의 센서가 신호를 발생할 경우에 대한 예외처리 추가
            string strSQL = string.Format("Select {0}, b.{6} from {1} {2} inner join ({5}) b on {2}.{7} = b.{4} where {3}",
                strFieldNames,
                //GetFieldNames(sensorZoneTable, strAlias),
                sensorZoneTable.GetTableName(), strAlias,
                strCondition,
                SensorReaction.Fields.sensor_zone_hist_sn,
                strSubQuery,
                SensorReaction.Fields.sensor_react_hist_sn,
                SensorZone.Fields.sensor_zone_hist_sn);

            strFieldNames += " , b." + SensorReaction.Fields.sensor_react_hist_sn.ToString();
            string strQuery = MakeSensorDetectHistoryPaginationQuery(m_dataManager, sensorZoneTable.GetTableName(), strAlias, SensorZone.Fields.sensor_zone_hist_sn.ToString(), strCondition, strFieldNames, strSubQuery, beginIndex, endIndex);

            if (strQuery == null)
                strQuery = CustomManager.MakePaginationQuery(m_dataManager, strSQL, beginIndex, endIndex, strAlias + "." + SensorZone.Fields.sensor_zone_hist_sn.ToString());

            // 하나의 SensorZoneHistory에는 하나의 센서 신호만 있다는 가정하에 만들어진 Query
            //string strSQL = string.Format("Select {0} from {1} where {2}", sensorZoneTable.GetFieldNames(), sensorZoneTable.GetTableName(), strCondition);
            //string strQuery = CustomManager.MakePaginationQuery(m_dataManager, strSQL, beginIndex, endIndex, SensorZone.Fields.sensor_zone_hist_sn.ToString());

            string strErrorMessage;
            IEnumerable<SensorZoneHistoryEx> sensorZoneHistories = m_dataManager.GetDBManager().Query<SensorZoneHistoryEx>(strQuery, out strErrorMessage);
            //IEnumerable<SensorZone> sensorZoneHistories = m_dataManager.GetSelect().Select<SensorZone>(strCondition, out strErrorMessage);

            if (sensorZoneHistories == null)
                return new ResponseSensorDetectHistory(false, strErrorMessage);

            // Key : SensorZoneHistoryNo
            Dictionary<int, SensorZone> dicSensorZoneHistories = new Dictionary<int, SensorZone>();
            // Key : SensorZoneHistoryNo
            Dictionary<int, List<int>> dicSensorReactionHistoryNos = new Dictionary<int, List<int>>();

            foreach (var sensorZoneHistory in sensorZoneHistories)
            {
                dicSensorZoneHistories[sensorZoneHistory.sensor_zone_hist_sn] = sensorZoneHistory;

                List<int> sensorReactionHistoryNos = null;

                if (dicSensorReactionHistoryNos.TryGetValue(sensorZoneHistory.sensor_zone_hist_sn, out sensorReactionHistoryNos) == false)
                {
                    sensorReactionHistoryNos = new List<int>();
                    dicSensorReactionHistoryNos[sensorZoneHistory.sensor_zone_hist_sn] = sensorReactionHistoryNos;
                }

                sensorReactionHistoryNos.Add(sensorZoneHistory.sensor_react_hist_sn);
            }

            if (dicSensorZoneHistories.Count == 0)
                return new ResponseSensorDetectHistory(true, "");

            Dictionary<int, List<SensorZoneHistoryDetailEx>> dicSensorZoneHistoryDetails = GetSensorZoneHistoryDetail(m_dataManager, data.UseSensorName, dicSensorZoneHistories, out strErrorMessage);

            if (dicSensorZoneHistoryDetails == null)
                return new ResponseSensorDetectHistory(false, strErrorMessage);

            Dictionary<int, List<SensorReaction>> dicSensorReactionHistories = GetSensorReactionHistory(m_dataManager, dicSensorZoneHistories, out strErrorMessage);

            if (dicSensorZoneHistories == null)
                return new ResponseSensorDetectHistory(false, strErrorMessage);

            // SensorZoneHistory가 SensorTester에 의한것인지 여부
            Dictionary<int, bool> dicSensorZoneHistoryTestSignal = CheckSensorSignal(dicSensorReactionHistories);

            return GetSensorDetectHistory(m_dataManager, data, dicSensorZoneHistories, dicSensorReactionHistoryNos, dicSensorZoneHistoryDetails, dicSensorZoneHistoryTestSignal, dicSensorReactionHistories, beginIndex, itemCount);
        }

        private string MakeSensorDetectHistoryPaginationQuery(IDataManager dataManager, string strTableName, string strAlias, string strOrderByField, string strCondition, string strFieldNames, string strSubQuery, int beginIndex, int? endIndex)
        {
            var dbType = dataManager.GetDBManager().DatabaseType;

            if (dbType == dnsDapperDBUtil.Manager.WebDBManager.DBType.sqlserver ||
                dbType == dnsDapperDBUtil.Manager.WebDBManager.DBType.mysql ||
                dbType == dnsDapperDBUtil.Manager.WebDBManager.DBType.oracle ||
                dbType == dnsDapperDBUtil.Manager.WebDBManager.DBType.npgsql)
            {
                // MySQL(8.0이상)은 CTE와 윈도우 함수(ROW_NUMBER(), COUNT() OVER)를 지원한다.
                // Oracle(12c 이상)은 CTE와 윈도우 함수(ROW_NUMBER(), COUNT() OVER)를 지원한다.
                // PostgreSQL도 CTE와 윈도우 함수(ROW_NUMBER(), COUNT() OVER)를 지원한다.
                return MakeSensorDetectHistoryPaginationQuery_SqlServer(strTableName, strAlias, strOrderByField, strCondition, strFieldNames, strSubQuery, beginIndex, endIndex);
            }

            return null;
        }

        private string MakeSensorDetectHistoryPaginationQuery_SqlServer(string strTableName, string strAlias, string strOrderByField, string strCondition, string strFieldNames, string strSubQuery, int beginIndex, int? endIndex)
        {
            string strQuery = string.Format("WITH DistinctDatas AS (Select Distinct {0}.{1}, {0}.{2} from {3} {0} INNER JOIN ({4}) b ON {0}.{1} = b.{1}",
                    strAlias,
                    strOrderByField,
                    SensorZone.Fields.tm,
                    strTableName,
                    strSubQuery);

            if (strCondition != null && strCondition.Trim().Length > 0)
                strQuery += string.Format(" where {0}), ", strCondition);
            else
                strQuery += "), ";

            string strDataIndex = "dataindex";

            strQuery += string.Format("PagedDatas AS (Select {0}, ROW_NUMBER() OVER (ORDER BY {3}) as {1}, COUNT(*) OVER() as {2} FROM DistinctDatas) ",
                strOrderByField, strDataIndex, Base.DAL.Models.Pagination.TotalCountField, SensorZone.Fields.tm);

            strQuery += string.Format("Select ROW_NUMBER() OVER (ORDER BY p.{6}, {4}.{5}) AS {0}, p.{1}, {2} FROM PagedDatas p JOIN {3} {4} ON p.{5} = {4}.{5} ",
                Base.DAL.Models.Pagination.RowNoField, Base.DAL.Models.Pagination.TotalCountField,
                strFieldNames,
                strTableName, strAlias,
                strOrderByField,
                strDataIndex);

            strQuery += string.Format("JOIN ({0}) b ON {1}.{2} = b.{2} ",
                strSubQuery, strAlias, strOrderByField);

            if (endIndex != null)
            {
                strQuery += string.Format("WHERE p.{0} BETWEEN {1} AND {2} ORDER BY {3}.{5}, p.{0}, {3}.{4}",
                    strDataIndex,
                    beginIndex, (int)endIndex,
                    strAlias,
                    strOrderByField,
                    SensorZone.Fields.tm);
            }
            else
            {
                strQuery += string.Format("ORDER BY {1}.{3}, p.{0}, {1}.{2}",
                    strDataIndex,
                    strAlias,
                    strOrderByField,
                    SensorZone.Fields.tm);
            }

            return strQuery;
        }

        // SensorZoneHistory가 SensorTester에 의한것인지 여부를 확인한다.
        private static Dictionary<int, bool> CheckSensorSignal(Dictionary<int, List<SensorReaction>> dicSensorReactionHistories)
        {
            Dictionary<int, bool> dicSensorZoneHistoryTestSignal = new Dictionary<int, bool>();

            foreach (KeyValuePair<int, List<SensorReaction>> pair in dicSensorReactionHistories)
            {
                int sensorZoneHistoryNo = pair.Key;

                foreach (var sensorReactionHistory in pair.Value)
                {
                    if (sensorReactionHistory.react_ty_code == dnsData.CommonCode.History.ReactionType.BeginStatus)
                    {
                        bool isTestSignal = sensorReactionHistory.mssage.Contains("[Test]");
                        dicSensorZoneHistoryTestSignal[sensorZoneHistoryNo] = isTestSignal;
                        break;
                    }
                }
            }

            return dicSensorZoneHistoryTestSignal;
        }

        private string GetFieldNames(Table t, string alias)
        {
            string strFields = t.GetFieldNames();
            string[] tokens = strFields.Split(',');

            string results = null;

            foreach (string strToken in tokens)
            {
                if (results == null)
                    results = alias + "." + strToken.Trim();
                else
                    results += ", " + alias + "." + strToken.Trim();
            }

            return results;
        }

        private ResponseSensorDetectHistory GetSensorDetectHistory(IDataManager dataManager, RequestSensorDetectHistory data, Dictionary<int, SensorZone> dicSensorZoneHistories, Dictionary<int, List<int>> dicSensorReactionHistoryNos, Dictionary<int, List<SensorZoneHistoryDetailEx>> dicSensorZoneHistoryDetails, Dictionary<int, bool> dicSensorZoneHistoryTestSignal, Dictionary<int, List<SensorReaction>> dicSensorReactionHistories, int beginIndex, int? itemCount)
        {
            List<SensorZone> sensorZoneHistories = new List<SensorZone>();
            sensorZoneHistories.AddRange(dicSensorZoneHistories.Values);
            // 이미 시간순으로 정렬되었다.
            //sensorZoneHistories.Sort();

            foreach (KeyValuePair<int, List<SensorZoneHistoryDetailEx>> pair in dicSensorZoneHistoryDetails)
            {
                pair.Value.Sort();
            }

            foreach (KeyValuePair<int, List<SensorReaction>> pair in dicSensorReactionHistories)
            {
                pair.Value.Sort();
            }

            string strErrorMessage;
            List<int> sensorReactionHistoryNos;
            List<SensorDetectHistoryEx> sensorDetectHistories = new List<SensorDetectHistoryEx>();

            foreach (SensorZone sensorZoneHistory in sensorZoneHistories)
            {
                if (dicSensorReactionHistoryNos.TryGetValue(sensorZoneHistory.sensor_zone_hist_sn, out sensorReactionHistoryNos))
                {
                    List<SensorDetectHistoryEx> histories = MakeSensorDetectHistories(dataManager, data, sensorZoneHistory, dicSensorZoneHistoryDetails, sensorReactionHistoryNos, dicSensorReactionHistories, out strErrorMessage);

                    if (histories == null)
                        return new ResponseSensorDetectHistory(false, strErrorMessage);

                    sensorDetectHistories.AddRange(histories);
                }
            }

            //SetRowNo(sensorDetectHistories);
            //List<SensorDetectHistoryEx> pageHistories = GetPageData(sensorDetectHistories, beginIndex, itemCount);

            Dictionary<long, SensorTypeData> dicSensorTypeDatas = null;

            if (data.SensorTypeDatas != null)
            {
                dicSensorTypeDatas = new Dictionary<long, SensorTypeData>();

                foreach (SensorTypeData sensorTypeData in data.SensorTypeDatas)
                {
                    dicSensorTypeDatas[sensorTypeData.GetKey()] = sensorTypeData;
                }
            }

            List<SensorDetectHistory> resultHistories = ToSensorDetectHistories(dataManager, data, sensorDetectHistories/*pageHistories*/, dicSensorTypeDatas, dicSensorZoneHistoryDetails, dicSensorZoneHistoryTestSignal, out strErrorMessage);

            if (resultHistories == null)
                return new ResponseSensorDetectHistory(false, strErrorMessage);

            ResponseSensorDetectHistory response = new ResponseSensorDetectHistory(true, "");
            response.Histories.AddRange(resultHistories);
            response.TotalCount = sensorZoneHistories.Count > 0 ? sensorZoneHistories[0].totalcount : 0;
            //response.TotalCount = sensorDetectHistories.Count;
            return response;
        }

        private void SetRowNo(List<SensorDetectHistoryEx> histories)
        {
            int rowNo = 1;

            foreach (var history in histories)
            {
                history.RowNo = rowNo++;
            }
        }

        private List<SensorDetectHistory> ToSensorDetectHistories(IDataManager dataManager, RequestSensorDetectHistory data, List<SensorDetectHistoryEx> pageHistories, Dictionary<long, SensorTypeData> dicSensorTypeDatas, Dictionary<int, List<SensorZoneHistoryDetailEx>> dicSensorZoneHistoryDetails, Dictionary<int, bool> dicSensorZoneHistoryTestSignal, out string strErrorMessage)
        {
            // Key : SensorType No, Value : SensorType Name
            Dictionary<int, string> dicSensorTypes = new Dictionary<int, string>();
            // Key : SensorType No & SensorSubType No, Value : SensorType Name
            Dictionary<long, string> dicSensorSubTypes = new Dictionary<long, string>();
            // Key : SensorZone No
            Dictionary<int, SensorZoneEx> dicSensorZones = new Dictionary<int, SensorZoneEx>();
            // Key : EquipZone No, Value : EquipZone Name
            Dictionary<int, string> dicEquipZones = new Dictionary<int, string>();
            // Key : EquipZone No, Value : Zone Name
            Dictionary<int, string> dicZones = new Dictionary<int, string>();
            // Key : SensorZoneHistory No, Value : SOP 이름
            Dictionary<int, string> dicSensorZoneHistorySops = new Dictionary<int, string>();
            // Key : EquipZone No
            Dictionary<int, List<Zone>> dicLinkedZones = new Dictionary<int, List<Zone>>();
            // Key : Zone No
            Dictionary<int, Building> dicLinkedBuildings = new Dictionary<int, Building>();
            // Key : Building No
            Dictionary<int, BuildingGroup> dicLinkedBuildingGroups = new Dictionary<int, BuildingGroup>();

            foreach (SensorDetectHistoryEx history in pageHistories)
            {
                foreach (int sensorZoneNo in history.SensorZoneNos)
                    dicSensorZones[sensorZoneNo] = null;
                //if (history.SensorZoneNo != null)
                //    dicSensorZones[(int)history.SensorZoneNo] = null;
            }

            if (ReadSensorNames(dataManager, dicSensorZones, out strErrorMessage) == false)
                return null;

            foreach (SensorDetectHistoryEx history in pageHistories)
            {
                if (history.SensorZoneNo != null)
                {
                    SensorZoneEx sensorZoneEx;

                    if (dicSensorZones.TryGetValue((int)history.SensorZoneNo, out sensorZoneEx))
                        history.SensorSubTypeNo = sensorZoneEx.SensorZone.sensor_sub_ty_no;
                }

                if (history.SensorTypeCode != null)
                {
                    dicSensorTypes[(int)history.SensorTypeCode] = null;

                    if (history.SensorSubTypeNo != null)
                    {
                        long key = GetSubTypeKey((int)history.SensorTypeCode, (int)history.SensorSubTypeNo);
                        dicSensorSubTypes[key] = null;
                    }
                }

                if (history.EquipZoneNo != null)
                    dicEquipZones[(int)history.EquipZoneNo] = null;

                if (history.ZoneNo != null)
                    dicZones[(int)history.ZoneNo] = null;

                if (history.SensorZoneHistoryNo != null)
                    dicSensorZoneHistorySops[(int)history.SensorZoneHistoryNo] = null;
            }

            if (dicSensorTypes.Count > 0)
            {
                if (ReadSensorTypes(dataManager, dicSensorTypes, out strErrorMessage) == false)
                    return null;
            }

            if (dicSensorSubTypes.Count > 0)
            {
                if (ReadSensorSubTypes(dataManager, dicSensorSubTypes, out strErrorMessage) == false)
                    return null;
            }

            if (ReadEquipZoneNames(dataManager, dicEquipZones, out strErrorMessage) == false)
                return null;

            if (ReadLinkedZones(dataManager, dicEquipZones, dicZones, dicLinkedZones, dicLinkedBuildings, dicLinkedBuildingGroups, out strErrorMessage) == false)
                return null;

            if (ReadSensorZoneHistorySOP(dataManager, dicSensorZoneHistorySops, out strErrorMessage) == false)
                return null;

            List<SensorDetectHistory> resultHistories = new List<SensorDetectHistory>();

            bool isFirst = true;
            int no = -1;

            foreach (SensorDetectHistoryEx history in pageHistories)
            {
                SensorDetectHistory detectHistory = ToSensorDetectHistory(dataManager, data, history, dicSensorTypes, dicSensorSubTypes, dicSensorTypeDatas, dicSensorZones, dicEquipZones, dicZones, dicSensorZoneHistorySops, dicSensorZoneHistoryDetails, dicSensorZoneHistoryTestSignal, dicLinkedZones, dicLinkedBuildings, dicLinkedBuildingGroups);
                resultHistories.Add(detectHistory);

                if (isFirst)
                {
                    isFirst = false;
                    no = detectHistory.RowNo;
                }
                else
                {
                    detectHistory.RowNo = ++no;
                }
            }

            return resultHistories;
        }

        private bool ReadLinkedZones(IDataManager dataManager, Dictionary<int, string> dicEquipZones, Dictionary<int, string> dicZones, Dictionary<int, List<Zone>> dicLinkedZones, Dictionary<int, Building> dicLinkedBuildings, Dictionary<int, BuildingGroup> dicLinkedBuildingGroups, out string strErrorMessage)
        {
            string strCondition = null;

            foreach (KeyValuePair<int, string> pair in dicEquipZones)
            {
                if (strCondition == null)
                    strCondition = string.Format("a.{0} in ({1}", EquipmentZone.Fields.eqp_zone_sn, pair.Key);
                else
                    strCondition += string.Format(", {0}", pair.Key);
            }

            if (strCondition != null)
                strCondition += ")";

            JoinManager joinManager = new JoinManager(dataManager);
            ArrayList arrResults = joinManager.JoinEquipmentZoneEquipmentZoneLinkedZone(strCondition, out strErrorMessage);

            if (arrResults == null)
                return false;

            int nResultCount = arrResults.Count;
            string strZoneNos = null;

            // Key : ZoneNo
            // Value : EquipZoneNo
            Dictionary<int, int> dicZoneEquipZoneNo = new Dictionary<int, int>();

            for (int i=0;i<nResultCount-1;i+=2)
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

                for (int i=0;i<nResultCount-2;i+=3)
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

                        if (dicZones.ContainsKey(zone.zone_sn))
                            dicZones[zone.zone_sn] = zone.disp_text;
                    }
                }
            }

            strZoneNos = null;

            foreach (KeyValuePair<int, string> pair in dicZones)
            {
                if (pair.Value != null)
                {
                    if (strZoneNos == null)
                        strZoneNos = pair.Key.ToString();
                    else
                        strZoneNos += ", " + pair.Key.ToString();
                }
            }

            if (strZoneNos != null)
            {
                strCondition = string.Format("{0} in ({1})", Zone.Fields.zone_sn, strZoneNos);
                IEnumerable<Zone> zones = dataManager.GetSelect().Select<Zone>(strCondition, out strErrorMessage);

                if (zones == null)
                    return false;

                foreach (Zone zone in zones)
                {
                    dicZones[zone.zone_sn] = zone.disp_text;
                }
            }

            return true;
        }

        private SensorDetectHistory ToSensorDetectHistory(IDataManager dataManager, RequestSensorDetectHistory data, SensorDetectHistoryEx history, Dictionary<int, string> dicSensorTypes, Dictionary<long, string> dicSensorSubTypes, Dictionary<long, SensorTypeData> dicSensorTypeDatas, Dictionary<int, SensorZoneEx> dicSensorZones, Dictionary<int, string> dicEquipZones, Dictionary<int, string> dicZones, Dictionary<int, string> dicSensorZoneHistorySops, Dictionary<int, List<SensorZoneHistoryDetailEx>> dicSensorZoneHistoryDetails, Dictionary<int, bool> dicSensorZoneHistoryTestSignal, Dictionary<int, List<Zone>> dicLinkedZones, Dictionary<int, Building> dicLinkedBuildings, Dictionary<int, BuildingGroup> dicLinkedBuildingGroups)
        {
            SensorDetectHistory detectHistory = new SensorDetectHistory();

            detectHistory.BeginTime = history.BeginTime;
            detectHistory.EndTime = history.EndTime;
            detectHistory.RowNo = history.RowNo;

            if (history.SensorTypeCode != null)
            {
                detectHistory.SensorTypeName = GetSensorTypeName((int)history.SensorTypeCode, history.SensorSubTypeNo, dicSensorTypes, dicSensorSubTypes, dicSensorTypeDatas);
            }

            foreach (int sensorZoneNo in history.SensorZoneNos)
            {
                SensorZoneEx sensorZoneEx;

                if (dicSensorZones.TryGetValue(sensorZoneNo, out sensorZoneEx))
                {
                    if (detectHistory.SensorName == null)
                        detectHistory.SensorName = sensorZoneEx.Sensor.sensor_name;
                    else
                        detectHistory.SensorName += ", " + sensorZoneEx.Sensor.sensor_name;
                }
            }

            /*if (history.SensorZoneNo != null)
            {
                SensorZoneEx sensorZoneEx;

                if (dicSensorZones.TryGetValue((int)history.SensorZoneNo, out sensorZoneEx))
                    detectHistory.SensorName = sensorZoneEx.Sensor.sensor_name;
            }*/

            if (history.EquipZoneNo != null)
            {
                string strLocationName;

                if (dicEquipZones.TryGetValue((int)history.EquipZoneNo, out strLocationName))
                    detectHistory.LocationName = data.GetLocationName(dataManager, (int)history.EquipZoneNo, strLocationName, dicLinkedZones, dicLinkedBuildings, dicLinkedBuildingGroups);//strLocationName;
            }
            else if (history.ZoneNo != null)
            {
                string strLocationName;

                if (dicZones.TryGetValue((int)history.ZoneNo, out strLocationName))
                    detectHistory.LocationName = data.GetLocationName(dataManager, (int)history.ZoneNo, strLocationName);
            }

            detectHistory.DetectStatus = history.GetDetectStatusTypeName();
            detectHistory.ClearType = history.GetCloseTypeName();
            detectHistory.AlarmDepthName = history.GetAlarmDepthName();

            if (history.SensorZoneHistoryNo != null)
            {
                string strSopName;

                if (dicSensorZoneHistorySops.TryGetValue((int)history.SensorZoneHistoryNo, out strSopName))
                    detectHistory.SopName = strSopName;

                List<SensorZoneHistoryDetailEx> sensorZoneHistoryDetails;

                if (dicSensorZoneHistoryDetails.TryGetValue((int)history.SensorZoneHistoryNo, out sensorZoneHistoryDetails))
                {
                    foreach (var historyDetail in sensorZoneHistoryDetails)
                    {
                        detectHistory.IsManual = historyDetail.IsManual;
                        break;
                    }
                }

                bool isTestSignal;

                if (dicSensorZoneHistoryTestSignal.TryGetValue((int)history.SensorZoneHistoryNo, out isTestSignal))
                    detectHistory.IsTestSignal = isTestSignal;
            }

            detectHistory.Memo = history.Memo;

            if (history.LocationName != null)
                detectHistory.LocationName = history.LocationName;
            
            if (history.SensorZoneHistoryNo != null && history.SensorZoneHistoryNo > 0)
                detectHistory.SensorZoneHistoryNo = history.SensorZoneHistoryNo;

            List<Zone> zones;
            Building building;
            BuildingGroup buildingGroup;

            if (history.EquipZoneNo != null && dicLinkedZones.TryGetValue((int)history.EquipZoneNo, out zones))
            {
                foreach (Zone zone in zones)
                {
                    if (dicLinkedBuildings.TryGetValue(zone.zone_sn, out building))
                    {
                        if (dicLinkedBuildingGroups.TryGetValue(building.buld_sn, out buildingGroup))
                        {
                            detectHistory.ZoneNo = zone.zone_sn;
                            detectHistory.ZoneName = zone.disp_text;
                            detectHistory.BuildingNo = building.buld_sn;
                            detectHistory.BuildingName = building.disp_text;
                            detectHistory.BuildingGroupNo = buildingGroup.buld_group_sn;
                            detectHistory.BuildingGroupName = buildingGroup.disp_text;
                            break;
                        }
                    }
                }

                if (detectHistory.ZoneNo == null && zones.Count > 0)
                {
                    detectHistory.ZoneNo = zones[0].zone_sn;
                    detectHistory.ZoneName = zones[0].disp_text;
                }
            }

            return detectHistory;
        }

        public static string GetSensorTypeName(int sensorTypeNo, int? sensorSubTypeNo, Dictionary<int, string> dicSensorTypes, Dictionary<long, string> dicSensorSubTypes, Dictionary<long, SensorTypeData> dicSensorTypeDatas)
        {
            if (dicSensorTypeDatas != null)
            {
                long key = SensorTypeData.MakeKey(sensorTypeNo, sensorSubTypeNo);
                SensorTypeData sensorTypeData;

                if (dicSensorTypeDatas.TryGetValue(key, out sensorTypeData))
                    return sensorTypeData.SensorTypeName;
            }

            string strSensorTypeName;

            if (sensorSubTypeNo != null)
            {
                long key = GetSubTypeKey(sensorTypeNo, (int)sensorSubTypeNo);

                if (dicSensorSubTypes.TryGetValue(key, out strSensorTypeName))
                    return strSensorTypeName;
            }
            else if (dicSensorTypes.TryGetValue(sensorTypeNo, out strSensorTypeName))
                return strSensorTypeName;

            // Default 값 사용
            SensorDetectHistory detectHistory = new SensorDetectHistory();
            return detectHistory.SensorTypeName;
        }

        // Key : SensorZoneHistory No, Value : SOP 이름
        private bool ReadSensorZoneHistorySOP(IDataManager dataManager, Dictionary<int, string> dicSensorZoneHistorySops, out string strErrorMessage)
        {
            strErrorMessage = null;

            if (dicSensorZoneHistorySops.Count == 0)
                return true;

            JoinManager joinManager = new JoinManager(dataManager);

            string strCondition = string.Format("{0} in ({1})", ActionStep.Fields.sensor_zone_hist_sn, string.Join(",", dicSensorZoneHistorySops.Keys));
            ArrayList arrDatas = joinManager.JoinActionStepHistoryActionStepSmallClass(strCondition, out strErrorMessage);

            if (arrDatas == null)
                return false;

            int nDataCount = arrDatas.Count;

            for (int i=0;i<nDataCount-2;i+=3)
            {
                if (arrDatas[i] is ActionStep && arrDatas[i + 1] is Model.Sop.Category.ActionStep && arrDatas[i + 2] is Model.Sop.Category.SmallClass)
                {
                    ActionStep actionStepHistory = (ActionStep)arrDatas[i];
                    Model.Sop.Category.ActionStep actionStep = (Model.Sop.Category.ActionStep)arrDatas[i + 1];
                    Model.Sop.Category.SmallClass smallClass = (Model.Sop.Category.SmallClass)arrDatas[i + 2];

                    if (actionStepHistory.sensor_zone_hist_sn != null)
                    {
                        dicSensorZoneHistorySops[(int)actionStepHistory.sensor_zone_hist_sn] = smallClass.sclas_name + ">" + actionStep.action_step_name;
                    }
                }
            }

            return true;
        }

        // Key : EquipZone No, Value : EquipZone Name
        public static bool ReadEquipZoneNames(IDataManager dataManager, Dictionary<int, string> dicEquipZones, out string strErrorMessage)
        {
            strErrorMessage = null;

            if (dicEquipZones.Count == 0)
                return true;

            string strCondition = string.Format("{0} in ({1})", EquipmentZone.Fields.eqp_zone_sn, string.Join(",", dicEquipZones.Keys));
            IEnumerable<EquipmentZone> equipZones = dataManager.GetSelect().Select<EquipmentZone>(strCondition, out strErrorMessage);

            if (equipZones == null)
                return false;

            foreach (EquipmentZone equipZone in equipZones)
            {
                dicEquipZones[equipZone.eqp_zone_sn] = equipZone.name;
            }

            return true;
        }

        // Key : SensorZone No, Value : Sensor Name
        public static bool ReadSensorNames(IDataManager dataManager, Dictionary<int, SensorZoneEx> dicSensorZones, out string strErrorMessage)
        {
            strErrorMessage = null;

            if (dicSensorZones.Count == 0)
                return true;

            JoinManager joinManager = new JoinManager(dataManager);

            string strCondition = string.Format("b.{0} in ({1})", Model.Sensor.SensorZone.Fields.sensor_zone_sn, string.Join(",", dicSensorZones.Keys));
            ArrayList arrDatas = joinManager.JoinSensorSensorZone(strCondition, out strErrorMessage);

            if (arrDatas == null)
                return false;

            int nDataCount = arrDatas.Count;

            for (int i=0;i<nDataCount-1;i+=2)
            {
                if (arrDatas[i] is Model.Sensor.Sensor && arrDatas[i + 1] is Model.Sensor.SensorZone)
                {
                    Model.Sensor.Sensor sensor = (Model.Sensor.Sensor)arrDatas[i];
                    Model.Sensor.SensorZone sensorZone = (Model.Sensor.SensorZone)arrDatas[i + 1];
                    dicSensorZones[sensorZone.sensor_zone_sn] = new SensorZoneEx(sensor, sensorZone);
                }
            }

            return true;
        }

        // Key : SensorType No, Value : SensorType Name
        public static bool ReadSensorTypes(IDataManager dataManager, Dictionary<int, string> dicSensorTypes, out string strErrorMessage)
        {
            strErrorMessage = null;

            if (dicSensorTypes.Count == 0)
                return true;

            string strCondition = string.Format("{0} = {1}", Codes.Fields.cl_code, (int)dnsData.CommonCode.CodeType.SensorType);
            IEnumerable<Codes> commonCodes = dataManager.GetSelect().Select<Codes>(strCondition, out strErrorMessage);

            if (commonCodes == null)
                return false;

            foreach (Codes code in commonCodes)
            {
                dicSensorTypes[code.code] = code.code_name;
            }

            return true;
        }

        // Key : SensorType No & SensorSubType No, Value : SensorType Name
        public static bool ReadSensorSubTypes(IDataManager dataManager, Dictionary<long, string> dicSensorSubTypes, out string strErrorMessage)
        {
            strErrorMessage = null;

            if (dicSensorSubTypes.Count == 0)
                return true;

            string strCondition = null;

            foreach (KeyValuePair<long, string> pair in dicSensorSubTypes)
            {
                int sensorTypeCode = (int)(pair.Key >> 32);
                int sensorSubTypeNo = (int)(pair.Key & 0xffffffff);

                if (strCondition == null)
                    strCondition = string.Format("({0} = {1} and {2} = {3})", Model.Sensor.SubType.Fields.sensor_ty_code, sensorTypeCode, Model.Sensor.SubType.Fields.sensor_sub_ty_no, sensorSubTypeNo);
                else
                    strCondition += string.Format(" or ({0} = {1} and {2} = {3})", Model.Sensor.SubType.Fields.sensor_ty_code, sensorTypeCode, Model.Sensor.SubType.Fields.sensor_sub_ty_no, sensorSubTypeNo);
            }

            IEnumerable<Model.Sensor.SubType> sensorSubTypes = dataManager.GetSelect().Select<Model.Sensor.SubType>(strCondition, out strErrorMessage);

            if (sensorSubTypes == null)
                return false;

            foreach (var sensorSubType in sensorSubTypes)
            {
                long key = GetSubTypeKey(sensorSubType.sensor_ty_code, sensorSubType.sensor_sub_ty_no);
                dicSensorSubTypes[key] = sensorSubType.sensor_sub_ty_name;
            }

            return true;
        }

        public static long GetSubTypeKey(int sensorTypeNo, int sensorSubTypeNo)
        {
            return ((((long)sensorTypeNo) << 32) | (long)sensorSubTypeNo);
        }

        private List<SensorDetectHistoryEx> MakeSensorDetectHistories(IDataManager dataManager, RequestSensorDetectHistory data, SensorZone sensorZoneHistory, Dictionary<int, List<SensorZoneHistoryDetailEx>> dicSensorZoneHistoryDetails, List<int> sensorReactionHistoryNos, Dictionary<int, List<SensorReaction>> dicSensorReactionHistories, out string strErrorMessage)
        {
            strErrorMessage = null;
            List<SensorReaction> sensorReactionHistories = null;

            List<SensorDetectHistoryEx> histories = new List<SensorDetectHistoryEx>();

            if (dicSensorReactionHistories.TryGetValue(sensorZoneHistory.sensor_zone_hist_sn, out sensorReactionHistories))
            {
                SensorDetectHistoryEx mainHistory = new SensorDetectHistoryEx();

                if (data.UseSensorTypeName)
                    mainHistory.SensorTypeCode = sensorZoneHistory.sensor_ty_code;

                mainHistory.SensorZoneHistoryNo = sensorZoneHistory.sensor_zone_hist_sn;
                mainHistory.RowNo = sensorZoneHistory.rowindex;
                mainHistory.ZoneNo = sensorZoneHistory.zone_sn;
                histories.Add(mainHistory);

                Dictionary<int, DateTime> dicSensorZoneBeginTimes = new Dictionary<int, DateTime>();

                foreach (SensorReaction sensorReactionHistory in sensorReactionHistories)
                {
                    if (sensorReactionHistory.react_ty_code == dnsData.CommonCode.History.ReactionType.BeginStatus)
                    {
                        mainHistory.BeginTime = sensorReactionHistory.tm;

                        if (data.UseSensorName)
                        {
                            mainHistory.SensorZoneNo = sensorReactionHistory.sensor_zone_sn;

                            if (sensorReactionHistory.sensor_zone_sn != null)
                                mainHistory.SensorZoneNos.Add((int)sensorReactionHistory.sensor_zone_sn);
                        }

                        if (data.UseLocationName)
                            mainHistory.EquipZoneNo = sensorReactionHistory.eqp_zone_sn;

                        if (data.UseDetectStatus)
                            mainHistory.DetectStatusType = SensorDetectHistoryEx.GetDetectStastusType(sensorReactionHistory.mssage);

                        if (data.UseSopName)
                            mainHistory.SensorZoneHistoryNo = sensorZoneHistory.sensor_zone_hist_sn;

                        if (data.UseMemo)
                            mainHistory.Memo = sensorZoneHistory.memo;

                        dicSensorZoneBeginTimes[(int)sensorReactionHistory.sensor_zone_sn] = mainHistory.BeginTime;
                    }
                    else if (sensorReactionHistory.react_ty_code == dnsData.CommonCode.History.ReactionType.EndStatus)
                    {
                        mainHistory.EndTime = sensorReactionHistory.tm;

                        if (data.UseClearType)
                        {
                            //if (mainHistory.DetectStatusType == SensorDetectHistoryEx.DetectStatusTypes.Real)
                                mainHistory.CloseType = SensorDetectHistoryEx.CloseTypes.SensorClear;
                            //else
                            //    mainHistory.CloseType = SensorDetectHistoryEx.CloseTypes.UserReset;
                        }
                    }
                    else if (sensorReactionHistory.react_ty_code == dnsData.CommonCode.History.ReactionType.Malfunction)
                    {
                        if (data.UseClearType)
                            mainHistory.CloseType = SensorDetectHistoryEx.CloseTypes.Malfunction;
                    }
                    else if (sensorReactionHistory.react_ty_code == dnsData.CommonCode.History.ReactionType.UserReset)
                    {
                        mainHistory.EndTime = sensorReactionHistory.tm;

                        if (data.UseClearType)
                            mainHistory.CloseType = SensorDetectHistoryEx.CloseTypes.UserReset;
                    }
                    else if (sensorReactionHistory.react_ty_code == dnsData.CommonCode.History.ReactionType.AlarmSignal)
                    {
                        if (data.UseSensorName && sensorReactionHistory.sensor_zone_sn != null)
                        {
                            if (mainHistory.SensorZoneNo == sensorReactionHistory.sensor_zone_sn/* && TimeDiff(mainHistory.BeginTime, sensorReactionHistory.tm) < 1*/)
                            {
                                // 알람신호를 이중으로 표기할 필요가 없다.
                                if (sensorReactionHistoryNos.Contains(sensorReactionHistory.sensor_react_hist_sn))
                                    mainHistory.SensorReactionHistoryNo = sensorReactionHistory.sensor_react_hist_sn;

                                continue;
                            }
                            else
                            {
                                SensorDetectHistoryEx history = new SensorDetectHistoryEx();
                                history.SensorZoneNo = sensorReactionHistory.sensor_zone_sn;
                                history.BeginTime = sensorReactionHistory.tm;
                                history.SensorReactionHistoryNo = sensorReactionHistory.sensor_react_hist_sn;
                                history.SensorZoneHistoryNo = sensorReactionHistory.sensor_zone_hist_sn;
                                // 같은 알람(SensorZoneHistory)에 대해서는 하나의 이력정보만 만들도록 한다.
                                //histories.Add(history);

                                if (sensorReactionHistory.sensor_zone_sn != null)
                                    mainHistory.SensorZoneNos.Add((int)sensorReactionHistory.sensor_zone_sn);

                                dicSensorZoneBeginTimes[(int)history.SensorZoneNo] = history.BeginTime;
                            }
                        }
                    }
                    else if (sensorReactionHistory.react_ty_code == dnsData.CommonCode.History.ReactionType.ClearSignal)
                    {
                        if (data.UseSensorName && sensorReactionHistory.sensor_zone_sn != null)
                        {
                            foreach (var _history in histories)
                            {
                                if (_history.SensorZoneNo == sensorReactionHistory.sensor_zone_sn)
                                {
                                    _history.EndTime = sensorReactionHistory.tm;
                                    break;
                                }
                            }
                            /*DateTime beginTime;

                            if (dicSensorZoneBeginTimes.TryGetValue((int)sensorReactionHistory.sensor_zone_sn, out beginTime))
                            {
                                SensorDetectHistoryEx history = new SensorDetectHistoryEx();
                                history.SensorZoneNo = (int)sensorReactionHistory.sensor_zone_sn;
                                history.BeginTime = beginTime;
                                history.EndTime = sensorReactionHistory.tm;
                                histories.Add(history);
                            }*/
                        }
                    }
                    else if (sensorReactionHistory.react_ty_code == dnsData.CommonCode.History.ReactionType.ChangeAlarmDepth)
                    {
                        if (data.UseAlarmDepthName && sensorReactionHistory.alarm_level != null)
                        {
                            int _historyCount = histories.Count;
                        
                            if (_historyCount > 0)
                            {
                                histories[_historyCount - 1].AlarmDepth = (int)sensorReactionHistory.alarm_level;
                            }
                        }
                    }

                    if (sensorReactionHistory.alarm_level != null)
                    {
                        if (data.UseAlarmDepthName)
                        {
                            if (mainHistory.AlarmDepth < (int)sensorReactionHistory.alarm_level)
                                mainHistory.AlarmDepth = (int)sensorReactionHistory.alarm_level;
                        }
                    }
                }

                int historyCount = histories.Count;

                for (int i=historyCount-1;i>=0;i--)
                //for (int i=1;i<historyCount;i++)
                {
                    SensorDetectHistoryEx history = histories[i];

                    if (history.SensorReactionHistoryNo < 0)
                    {
                        if (SetSensorReactionHistoryNo(dataManager, data, history, sensorReactionHistories, out strErrorMessage) == false)
                            return null;
                    }

                    if (sensorReactionHistoryNos.Contains(history.SensorReactionHistoryNo) == false ||
                        (i > 0 && i == historyCount - 1 && history.EndTime != null && mainHistory.EndTime != null && history.SensorZoneNo == mainHistory.SensorZoneNo))
                    {
                        // 복구신호를 이중으로 표기할 필요가 없다.
                        histories.RemoveAt(i);
                    }
                    else
                    {
                        history.SensorTypeCode = mainHistory.SensorTypeCode;
                        history.EquipZoneNo = mainHistory.EquipZoneNo;
                        history.DetectStatusType = mainHistory.DetectStatusType;
                    }
                }
            }

            return histories;
        }

        // 수동신고에 대한 정보 추가
        private bool SetSensorReactionHistoryNo(IDataManager dataManager, RequestSensorDetectHistory data, SensorDetectHistoryEx history, List<SensorReaction> sensorReactionHistories, out string strErrorMessage)
        {
            foreach (SensorReaction sensorReactionHistory in sensorReactionHistories)
            {
                if (sensorReactionHistory.react_ty_code == dnsData.CommonCode.History.ReactionType.BeginStatus && history.SensorZoneNo == sensorReactionHistory.sensor_zone_sn)
                {
                    history.SensorReactionHistoryNo = sensorReactionHistory.sensor_react_hist_sn;

                    if (sensorReactionHistory.eqp_zone_sn == null && sensorReactionHistory.zone_sn != null)
                    {
                        string strCondition = string.Format("{0} = {1}", Zone.Fields.zone_sn, (int)sensorReactionHistory.zone_sn);

                        Zone zone = dataManager.GetSelect().SelectFirst<Zone>(strCondition, out strErrorMessage);

                        if (zone == null)
                            return false;

                        history.LocationName = data.GetLocationName(dataManager, zone.zone_sn, zone.disp_text);//zone.disp_text;
                        return true;
                    }

                    break;
                }
            }

            strErrorMessage = null;
            return true;
        }

        // 시간 차이를 초로 환산하여 알려준다.
        private double TimeDiff(DateTime time1, DateTime time2)
        {
            TimeSpan span = time1 - time2;
            double seconds = span.TotalSeconds;

            if (seconds < 0)
                return seconds * (-1);

            return seconds;
        }

        public static Dictionary<int, List<SensorReaction>> GetSensorReactionHistory(IDataManager dataManager, Dictionary<int, SensorZone> dicSensorZoneHistories, out string strErrorMessage)
        {
            strErrorMessage = null;

            string strCondition = string.Format("{0} in ({1})", SensorReaction.Fields.sensor_zone_hist_sn, GetSensorZoneHistoryNos(dicSensorZoneHistories.Values));
            IEnumerable<SensorReaction> sensorReactionHistories = dataManager.GetSelect().Select<SensorReaction>(strCondition, out strErrorMessage);

            if (sensorReactionHistories == null)
                return null;

            List<SensorReaction> reactionHistories = null;
            Dictionary<int, List<SensorReaction>> dicSensorReactionHistories = new Dictionary<int, List<SensorReaction>>();

            foreach (var sensorReactionHistory in sensorReactionHistories)
            {
                if (dicSensorReactionHistories.TryGetValue(sensorReactionHistory.sensor_zone_hist_sn, out reactionHistories) == false)
                {
                    reactionHistories = new List<SensorReaction>();
                    dicSensorReactionHistories[sensorReactionHistory.sensor_zone_hist_sn] = reactionHistories;
                }

                reactionHistories.Add(sensorReactionHistory);
            }

            return dicSensorReactionHistories;
        }

        public static Dictionary<int, List<SensorZoneHistoryDetailEx>> GetSensorZoneHistoryDetail(IDataManager dataManager, bool useSensorName, Dictionary<int, SensorZone> dicSensorZoneHistories, out string strErrorMessage)
        {
            strErrorMessage = null;

            if (useSensorName == false)
                return new Dictionary<int, List<SensorZoneHistoryDetailEx>>();

            List<SensorZoneHistoryDetailEx> sensorZoneHistoryDetails = GetSensorZoneHistoryDetailEx(dataManager, dicSensorZoneHistories, out strErrorMessage);
            //string strCondition = string.Format("{0} in ({1})", SensorZoneDetail.Fields.sensor_zone_hist_sn, GetSensorZoneHistoryNos(dicSensorZoneHistories.Values));
            //IEnumerable<SensorZoneDetail> sensorZoneHistoryDetails = dataManager.GetSelect().Select<SensorZoneDetail>(strCondition, out strErrorMessage);

            if (sensorZoneHistoryDetails == null)
                return null;

            List<SensorZoneHistoryDetailEx> details = null;
            Dictionary<int, List<SensorZoneHistoryDetailEx>> dicSensorZoneHistoryDetails = new Dictionary<int, List<SensorZoneHistoryDetailEx>>();

            foreach (SensorZoneHistoryDetailEx sensorZoneHistoryDetail in sensorZoneHistoryDetails)
            {
                if (dicSensorZoneHistoryDetails.TryGetValue(sensorZoneHistoryDetail.sensor_zone_hist_sn, out details) == false)
                {
                    details = new List<SensorZoneHistoryDetailEx>();
                    dicSensorZoneHistoryDetails[sensorZoneHistoryDetail.sensor_zone_hist_sn] = details;
                }

                details.Add(sensorZoneHistoryDetail);
            }

            return dicSensorZoneHistoryDetails;
        }

        private static List<SensorZoneHistoryDetailEx> GetSensorZoneHistoryDetailEx(IDataManager dataManager, Dictionary<int, SensorZone> dicSensorZoneHistories, out string strErrorMessage)
        {
            string strSQL = string.Format("select a.*, c.{3} from {0} a inner join {1} b on a.{4} = b.{5} inner join {2} c on b.{6} = c.{7} where a.{8} in ({9})",
                SensorZoneDetail.TableName, Base.Model.Sensor.SensorZone.TableName, Base.Model.Sensor.Sensor.TableName,
                Base.Model.Sensor.Sensor.Fields.manual_yn,
                SensorZoneDetail.Fields.sensor_zone_sn, Base.Model.Sensor.SensorZone.Fields.sensor_zone_sn,
                Base.Model.Sensor.SensorZone.Fields.sensor_sn, Base.Model.Sensor.Sensor.Fields.sensor_sn,
                SensorZoneDetail.Fields.sensor_zone_hist_sn, GetSensorZoneHistoryNos(dicSensorZoneHistories.Values));

            IEnumerable<dynamic> result = dataManager.GetSelect().Select(strSQL, out strErrorMessage);

            if (result == null)
                return null;

            JoinManager joinManager = new JoinManager(dataManager);
            SensorZoneDetail sensorZoneHistoryDetail = new SensorZoneDetail();

            int nSensorZoneHistoryDetailFieldCount = sensorZoneHistoryDetail.GetFieldCount();
            List<SensorZoneHistoryDetailEx> histories = new List<SensorZoneHistoryDetailEx>();

            foreach (var item in result)
            {
                var data = item as IDictionary<string, object>;
                int nIndex = 0;

                sensorZoneHistoryDetail = new SensorZoneDetail();
                bool? isManual = null;

                foreach (KeyValuePair<string, object> pair in data)
                {
                    if (nIndex < nSensorZoneHistoryDetailFieldCount)
                    {
                        joinManager.ReadSensorZoneHistoryDetail(pair.Key, pair.Value, sensorZoneHistoryDetail);
                    }
                    else if (pair.Key == Base.Model.Sensor.Sensor.Fields.manual_yn.ToString())
                    {
                        isManual = (bool)pair.Value;
                    }

                    nIndex++;
                }

                if (isManual != null)
                {
                    SensorZoneHistoryDetailEx history = new SensorZoneHistoryDetailEx(sensorZoneHistoryDetail);
                    history.IsManual = (bool)isManual;
                    histories.Add(history);
                }
            }

            return histories;
        }

        private static string GetSensorZoneHistoryNos(ICollection<SensorZone> sensorZoneHistories)
        {
            string strNos = "";

            foreach (var sensorZoneHistory in sensorZoneHistories)
            {
                if (strNos.Length == 0)
                    strNos = sensorZoneHistory.sensor_zone_hist_sn.ToString();
                else
                    strNos += "," + sensorZoneHistory.sensor_zone_hist_sn.ToString();
            }

            return strNos;
        }

        public static void AddSensorNoCondition(ref string strCondition, int sensorNo, string strAlias)
        {
            strCondition += string.Format(" and {8}.{0} in (Select {1} from {2} where {3} in (Select {4} from {5} where {6} = {7}))",
                SensorZone.Fields.sensor_zone_hist_sn,
                SensorZoneDetail.Fields.sensor_zone_hist_sn,
                SensorZoneDetail.TableName,
                SensorZoneDetail.Fields.sensor_zone_sn,
                Model.Sensor.SensorZone.Fields.sensor_zone_sn,
                Model.Sensor.SensorZone.TableName,
                Model.Sensor.SensorZone.Fields.sensor_sn,
                sensorNo,
                strAlias);
        }

        public static void AddZoneNoCondition(ref string strCondition, int zoneNo, string strAlias)
        {
            strCondition += string.Format(" and {2}.{0} = {1}", Zone.Fields.zone_sn, zoneNo, strAlias);
        }

        public static void AddBuildingNoCondition(ref string strCondition, int buildingNo, string strAlias)
        {
            strCondition += string.Format(" and {5}.{0} in (Select {1} from {2} where {3} = {4})",
                SensorZone.Fields.zone_sn,
                Zone.Fields.zone_sn,
                Zone.TableName,
                Zone.Fields.buld_sn,
                buildingNo,
                strAlias);
        }

        public static void AddBuildingGroupNoCondition(ref string strCondition, int buildingGroupNo, string strAlias)
        {
            strCondition += string.Format(" and {8}.{0} in (Select {1} from {2} where {3} in (Select {4} from {5} where {6} = {7}))",
                SensorZone.Fields.zone_sn,
                Zone.Fields.zone_sn,
                Zone.TableName,
                Zone.Fields.buld_sn,
                Building.Fields.buld_sn,
                Building.TableName,
                Building.Fields.buld_group_sn,
                buildingGroupNo,
                strAlias);
        }

        public static List<DataType> GetPageData<DataType>(List<DataType> datas, int beginIndex, int? itemCount)
        {
            if (itemCount == null)
                return datas;

            List<DataType> results = new List<DataType>();

            int dataCount = datas.Count;
            beginIndex = beginIndex - 1;
            int endIndex = beginIndex + (int)itemCount;

            for (int i=beginIndex;i<endIndex && i<dataCount;i++)
            {
                results.Add(datas[i]);
            }

            return results;
        }
    }
}
