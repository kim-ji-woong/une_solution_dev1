using System.Collections;
using System.Collections.Generic;
using dnsDapperDBUtil.DataAccessLayer.IDAL;
using Base.Model.Sensor;
using Base.Model.Sensor.CCTV;
using Base.DAL;
using Base.Model.Common;
using Response;
using dnsData.CommonCode;

namespace Base.SDMS.BLL.Process
{
    using IBLL.Request;
    using IBLL.Response;
    using IBLL.Models;

    class SensorManager
    {
        private IDataManager m_dataManager = null;

        public SensorManager(IDataManager dataManager)
        {
            m_dataManager = dataManager;
        }

        public ResponseSensorList GetSensorList(RequestSensorList data)
        {
            string strErrorMessage;
            Dictionary<int, SensorData> dicSensors = LoadSensors(data, out strErrorMessage);

            if (dicSensors == null)
                return new ResponseSensorList(false, strErrorMessage, DBError.GetInsertErrorCode(strErrorMessage));

            int totalCount;
            ResponseSensorList response = new ResponseSensorList(true, "");
            response.SensorTypes = ToSensorTypes(dicSensors, out totalCount, out strErrorMessage);

            if (response.SensorTypes == null)
                return new ResponseSensorList(false, strErrorMessage, DBError.GetInsertErrorCode(strErrorMessage));

            if (AddEmptySensorTypes(response.SensorTypes, out strErrorMessage) == false)
                return new ResponseSensorList(false, strErrorMessage);

            response.TotalCount = totalCount;
            return response;
        }

        public ResponseSensorList GetZoneSensorList(RequestZoneSensorList data)
        {
            string strErrorMessage;
            Dictionary<int, SensorData> dicSensors = LoadZoneSensors(data, out strErrorMessage);

            if (dicSensors == null)
                return new ResponseSensorList(false, strErrorMessage, DBError.GetInsertErrorCode(strErrorMessage));

            int totalCount;
            ResponseSensorList response = new ResponseSensorList(true, "");
            response.SensorTypes = ToSensorTypes(dicSensors, out totalCount, out strErrorMessage);

            if (response.SensorTypes == null)
                return new ResponseSensorList(false, strErrorMessage, DBError.GetInsertErrorCode(strErrorMessage));

            if (AddEmptySensorTypes(response.SensorTypes, out strErrorMessage) == false)
                return new ResponseSensorList(false, strErrorMessage);

            response.TotalCount = totalCount;
            return response;
        }

        public MessageResult UpdateSensorList(UpdateSensorData data)
        {
            string strErrorMessage;
            IDataManager dataManager = m_dataManager.Clone();

            if (dataManager.BeginBatch(out strErrorMessage) == false)
                return new MessageResult(false, "시스템 데이터베이스의 트랜잭션을 시작할 수 없습니다.", ErrorCode.BeginTransactionFail);

            string strDeleteSensorNos = null;

            foreach (var updateData in data.UpdateDatas)
            {
                if (updateData.Deleted)
                {
                    if (strDeleteSensorNos == null)
                        strDeleteSensorNos = updateData.SensorNo.ToString();
                    else
                        strDeleteSensorNos += "," + updateData.SensorNo.ToString();

                    continue;
                }

                if (UpdateSensor(dataManager, updateData, out strErrorMessage) == false)
                {
                    string strTemp;
                    dataManager.BatchRollback(out strTemp);
                    return new MessageResult(false, strErrorMessage, DBError.GetInsertErrorCode(strErrorMessage));
                }

                if (updateData.EquipZoneNo != null)
                {
                    if (UpdateSensorZone(dataManager, updateData.SensorNo, (int)updateData.EquipZoneNo, out strErrorMessage) == false)
                    {
                        string strTemp;
                        dataManager.BatchRollback(out strTemp);
                        return new MessageResult(false, strErrorMessage, DBError.GetInsertErrorCode(strErrorMessage));
                    }
                }
            }

            if (DeleteSensors(dataManager, strDeleteSensorNos, out strErrorMessage) == false)
            {
                string strTemp;
                dataManager.BatchRollback(out strTemp);
                return new MessageResult(false, strErrorMessage, DBError.GetInsertErrorCode(strErrorMessage));
            }

            if (dataManager.BatchCommit(out strErrorMessage) == false)
            {
                string strTemp;
                dataManager.BatchRollback(out strTemp);
                return new MessageResult(false, "시스템 데이터베이스의 트랜잭션을 종료할 수 없습니다.", ErrorCode.CommitTransactionFail);
            }

            return new MessageResult(true, "");
        }

        public ResponseZone GetZoneInfo(RequestZone data)
        {
            string strErrorMessage;

            Dictionary<int, SensorData> dicSensors = LoadSensors(data, out strErrorMessage);

            if (dicSensors == null)
                return new ResponseZone(false, strErrorMessage, DBError.GetInsertErrorCode(strErrorMessage));

            List<SpatialData.EquipmentZoneData> equipZoneDatas = LoadManager.LoadEquipZoneDatas(m_dataManager, data.SiteNo, data.ZoneNo, out strErrorMessage);

            if (equipZoneDatas == null)
                return new ResponseZone(false, strErrorMessage, DBError.GetInsertErrorCode(strErrorMessage));

            List<SpatialData.BuildingGroupData> buildingGroupDatas = LoadManager.LoadBuildingGroupDatas(m_dataManager, data.SiteNo, out strErrorMessage);

            if (buildingGroupDatas == null)
                return new ResponseZone(false, strErrorMessage, DBError.GetInsertErrorCode(strErrorMessage));

            ResponseZone response = new ResponseZone(true, "");

            int totalCount;
            response.SensorTypes = ToSensorTypes(dicSensors, out totalCount, out strErrorMessage);
            response.EquipZoneDatas = equipZoneDatas;
            response.BuildingGroupDatas = buildingGroupDatas;

            return response;
        }

        public ResponseSensorServerStatus RequestSensorServerStatus(RequestSensorServerStatus data)
        {
            string strCondition = null;

            if (data.SiteNo != null)
                strCondition = string.Format("{0} = {1}", ServerInfo.Fields.site_sn, (int)data.SiteNo);

            string strErrorMessage;
            IEnumerable<ServerInfo> servers = m_dataManager.GetSelect().Select<ServerInfo>(strCondition, out strErrorMessage);

            if (servers == null)
                return new ResponseSensorServerStatus(false, strErrorMessage);

            ResponseSensorServerStatus response = new ResponseSensorServerStatus(true, "");
            response.SensorServers.AddRange(servers);
            return response;
        }

        public ResponseSensorServerInfo RequestSensorServerInfo(RequestSensorServerInfo data)
        {
            string strSensorNoCondition = string.Format("select {1} from {0} where {2} = {3}",
                Sensor.TableName,
                Sensor.Fields.sensor_sn,
                Sensor.Fields.manual_yn,
                CustomManager.GetBoolValue(m_dataManager, false));

            if (data.SiteNo != null)
                strSensorNoCondition += string.Format(" and {0} = {1}", Sensor.Fields.site_sn, (int)data.SiteNo);

            string strSensorZoneNoCondition = string.Format("Select min({1}) from {0} group by {2}, {3}",
                SensorZone.TableName,
                SensorZone.Fields.sensor_zone_sn,
                SensorZone.Fields.sensor_ty_code,
                SensorZone.Fields.sensor_sub_ty_no);

            string strCondition = string.Format("{0} in ({1}) and {2} in ({3})",
                SensorZone.Fields.sensor_zone_sn, strSensorZoneNoCondition,
                SensorZone.Fields.sensor_sn, strSensorNoCondition);

            if (data.SensorTypeCode != null)
            {
                strCondition += string.Format(" and {0} = {1}", SensorZone.Fields.sensor_ty_code, (int)data.SensorTypeCode);

                if (data.SensorSubType != null)
                    strCondition += string.Format(" and {0} = {1}", SensorZone.Fields.sensor_sub_ty_no, (int)data.SensorSubType);
            }

            return RequestSensorServerInfo(data, strCondition);
        }

        private ResponseSensorServerInfo RequestSensorServerInfo(RequestSensorServerInfo data, string strCondition)
        {
            string strErrorMessage;
            IEnumerable<ServerInfo> sensorServers = m_dataManager.GetSelect().Select<ServerInfo>(null, out strErrorMessage);

            if (sensorServers == null)
                return new ResponseSensorServerInfo(false, strErrorMessage);

            IEnumerable<SensorZone> sensorZones = m_dataManager.GetSelect().Select<SensorZone>(strCondition, out strErrorMessage);

            if (sensorZones == null)
                return new ResponseSensorServerInfo(false, strErrorMessage);

            Dictionary<int, ServerInfo> dicSensorServers = new Dictionary<int, ServerInfo>();

            foreach (var serverInfo in sensorServers)
            {
                dicSensorServers[serverInfo.sensor_server_sn] = serverInfo;
            }

            // Key : SensorTypeCode
            // Value.Key : SubTypeNo
            Dictionary<int, Dictionary<string, ServerInfo>> dicSensorTypeServerInfos = new Dictionary<int, Dictionary<string, ServerInfo>>();

            Dictionary<string, ServerInfo> dicSubTypeInfos;
            ServerInfo sensorServer;

            foreach (var sensorZone in sensorZones)
            {
                if (sensorZone.sensor_server_sn == null)
                    continue;

                if (dicSensorTypeServerInfos.TryGetValue(sensorZone.sensor_ty_code, out dicSubTypeInfos) == false)
                {
                    dicSubTypeInfos = new Dictionary<string, ServerInfo>();
                    dicSensorTypeServerInfos[sensorZone.sensor_ty_code] = dicSubTypeInfos;
                }

                if (dicSensorServers.TryGetValue((int)sensorZone.sensor_server_sn, out sensorServer))
                {
                    string strSubType = sensorZone.sensor_sub_ty_no == null ? "null" : sensorZone.sensor_sub_ty_no.ToString();
                    dicSubTypeInfos[strSubType] = sensorServer;
                }
            }

            ResponseSensorServerInfo response = new ResponseSensorServerInfo(true, "");
            response.Servers.AddRange(GetServerInfoList(data, dicSensorTypeServerInfos));
            return response;
        }

        private List<ResponseSensorServerInfo.ServerInfo> GetServerInfoList(RequestSensorServerInfo data, Dictionary<int, Dictionary<string, ServerInfo>> dicSensorTypeServerInfos)
        {
            List<ResponseSensorServerInfo.ServerInfo> serverInfos = new List<ResponseSensorServerInfo.ServerInfo>();

            foreach (KeyValuePair<int, Dictionary<string, ServerInfo>> pair in dicSensorTypeServerInfos)
            {
                bool isMultiple = IsMultiple(pair.Value.Values);

                foreach (KeyValuePair<string, ServerInfo> pair2 in pair.Value)
                {
                    bool connected = pair2.Value.cnnc_sttus == null || pair2.Value.cnnc_sttus == true;
                    bool usable = pair2.Value.usab == null || pair2.Value.usab == true;

                    ResponseSensorServerInfo.ServerInfo serverInfo = new ResponseSensorServerInfo.ServerInfo();

                    serverInfo.SensorTypeCode = pair.Key;
                    serverInfo.SensorServerNo = pair2.Value.sensor_server_sn;
                    serverInfo.Connected = connected && usable;

                    if ((data.SensorTypeCode != null && data.SensorSubType != null) || isMultiple)
                    {
                        if (pair2.Key == "null")
                            serverInfo.SensorSubType = null;
                        else
                            serverInfo.SensorSubType = int.Parse(pair2.Key);

                        serverInfos.Add(serverInfo);
                    }
                    else
                    {
                        serverInfos.Add(serverInfo);
                        break;
                    }
                }
            }

            return serverInfos;
        }

        private bool IsMultiple(ICollection<ServerInfo> serverInfos)
        {
            int? serverNo = null;

            foreach (ServerInfo serverInfo in serverInfos)
            {
                if (serverNo == null)
                    serverNo = serverInfo.sensor_server_sn;
                else
                {
                    if ((int)serverNo != serverInfo.sensor_server_sn)
                        return true;
                }
            }

            return false;
        }

        public ResponseAdditableSensors GetAdditableSensors(RequestAdditableSensors data)
        {
            string trueValue = CustomManager.GetBoolValue(m_dataManager, true);
            string falseValue = CustomManager.GetBoolValue(m_dataManager, false);

            string strCondition = string.Format("(a.{0} is null or a.{1} is null or a.{2} is null or a.{3} is null or a.{6} = {7}) and a.{4} = {8} and a.{5} = {7}",
                Sensor.Fields.x, Sensor.Fields.y, Sensor.Fields.z, Sensor.Fields.zone_sn, Sensor.Fields.manual_yn, Sensor.Fields.enab, Sensor.Fields.deleted, trueValue, falseValue);

            if (data.SensorType != null)
                strCondition += string.Format(" and a.{0} = {1}", Sensor.Fields.sensor_ty_code, (int)data.SensorType);

            string strErrorMessage;
            Dictionary<int, Sensor> dicSensors = GetSensors(strCondition, out strErrorMessage);

            if (dicSensors == null)
                return new ResponseAdditableSensors(false, strErrorMessage);

            Dictionary<int, Codes> dicSensorTypes = GetSensorTypes(out strErrorMessage);

            if (dicSensorTypes == null)
                return new ResponseAdditableSensors(false, strErrorMessage);

            Dictionary<long, SubType> dicSensorSubTypes = GetSensorSubTypes(out strErrorMessage);

            if (dicSensorSubTypes == null)
                return new ResponseAdditableSensors(false, strErrorMessage);

            Dictionary<int, SensorList> dicSensorList = GetSensorList(dicSensors, dicSensorTypes, dicSensorSubTypes, strCondition, out strErrorMessage);

            if (dicSensorList == null)
                return new ResponseAdditableSensors(false, strErrorMessage);

            ResponseAdditableSensors response = new ResponseAdditableSensors(true, "");

            foreach (KeyValuePair<int, SensorList> pair in dicSensorList)
            {
                response.SensorList.Add(pair.Value);
            }

            if (AddCCTVs(response.SensorList, out strErrorMessage) == false)
                return new ResponseAdditableSensors(false, strErrorMessage);

            return response;
        }

        private bool AddCCTVs(List<SensorList> sensorLists, out string strErrorMessage)
        {
            string strSensorNos = null;
            Dictionary<int, SensorData> dicSensorDatas = new Dictionary<int, SensorData>();

            foreach (var sensorList in sensorLists)
            {
                foreach (SensorData sensorData in sensorList.Sensors)
                {
                    if (sensorData.Sensor == null)
                        continue;

                    if (strSensorNos == null)
                        strSensorNos = sensorData.Sensor.sensor_sn.ToString();
                    else
                        strSensorNos += "," + sensorData.Sensor.sensor_sn.ToString();

                    dicSensorDatas[sensorData.Sensor.sensor_sn] = sensorData;
                }
            }

            strErrorMessage = null;

            if (strSensorNos == null)
                return true;

            string strCondition = string.Format("{0} in ({1})", CCTV.Fields.sensor_sn, strSensorNos);
            IEnumerable<CCTV> cctvs = m_dataManager.GetSelect().Select<CCTV>(strCondition, out strErrorMessage);

            if (cctvs == null)
                return false;

            foreach (CCTV cctv in cctvs)
            {
                SensorData sensorData;

                if (dicSensorDatas.TryGetValue(cctv.sensor_sn, out sensorData))
                    sensorData.Cctv = cctv;
            }

            return true;
        }

        private void AddSensorList(Dictionary<int, SensorList> dicSensorList, Dictionary<int, int> dicSensorNos, Dictionary<int, Codes> dicSensorTypes, Dictionary<long, SubType> dicSensorSubTypes, Sensor sensor, SensorZone sensorZone, Material material)
        {
            SensorList sensorList;

            if (dicSensorList.TryGetValue(sensor.sensor_ty_code, out sensorList) == false)
            {
                Codes code;

                if (dicSensorTypes.TryGetValue(sensor.sensor_ty_code, out code) == false)
                    return;

                if (code.code == SdmsSensor.SensorType.CCTV || code.code_name == "이동식 스캐너")
                {
                    sensorList = new SensorList();
                    sensorList.SensorTypeCode = sensor.sensor_ty_code;
                    sensorList.SensorTypeName = code.code_name;

                    dicSensorList[sensor.sensor_ty_code] = sensorList;
                }
                else
                    return;
            }

            SubType subType = null;

            if (sensorZone?.sensor_sub_ty_no != null)
            {
                dicSensorSubTypes.TryGetValue(GetSubTypeKey(sensorZone.sensor_ty_code, (int)sensorZone.sensor_sub_ty_no), out subType);
            }

            // 하나의 센서에 여러개의 SensorZone이 연결되어 있을수 있다.
            // 하나의 센서만 사용하도록 한다.
            if (dicSensorNos.ContainsKey(sensor.sensor_sn))
                return;
            else
                dicSensorNos[sensor.sensor_sn] = sensor.sensor_sn;

            SensorEx sensorEx = new SensorEx(sensor);

            sensorEx.sensor_ty_code = sensor.sensor_ty_code;

            if (subType != null)
            {
                sensorEx.SubTypeName = subType.sensor_sub_ty_name;
                sensorEx.SubTypeNo = subType.sensor_sub_ty_no;
            }

            SensorZoneData sensorZoneData = new SensorZoneData();

            sensorZoneData.SensorZone = sensorZone;
            sensorZoneData.SensorMaterial = material;

            SensorData sensorData = new SensorData();

            sensorData.Sensor = sensorEx;
            sensorData.SensorZoneData = sensorZoneData;

            sensorList.Sensors.Add(sensorData);
        }

        private Dictionary<int, SensorList> GetSensorList(Dictionary<int, Sensor> dicSensors, Dictionary<int, Codes> dicSensorTypes, Dictionary<long, SubType> dicSensorSubTypes, string strCondition, out string strErrorMessage)
        {
            JoinManager joinManager = new JoinManager(m_dataManager);
            ArrayList arrDatas = joinManager.JoinSensorSensorZoneMaterialSensor(strCondition, out strErrorMessage);

            if (arrDatas == null)
                return null;

            Dictionary<int, int> dicSensorNos = new Dictionary<int, int>();

            Dictionary<int, SensorList> dicSensorList = new Dictionary<int, SensorList>();
            int nDataCount = arrDatas.Count;

            for (int i = 0; i < nDataCount - 2; i += 3)
            {
                if (arrDatas[i] is Sensor && arrDatas[i + 1] is SensorZone && (arrDatas[i + 2] == null || arrDatas[i + 2] is Material))
                {
                    Sensor sensor = (Sensor)arrDatas[i];
                    SensorZone sensorZone = (SensorZone)arrDatas[i + 1];
                    Material material = (Material)arrDatas[i + 2];

                    AddSensorList(dicSensorList, dicSensorNos, dicSensorTypes, dicSensorSubTypes, sensor, sensorZone, material);
                }
            }

            foreach (KeyValuePair<int, Sensor> pair in dicSensors)
            {
                AddSensorList(dicSensorList, dicSensorNos, dicSensorTypes, dicSensorSubTypes, pair.Value, null, null);
            }

            return dicSensorList;
        }

        private long GetSubTypeKey(int sensorType, int sensorSubType)
        {
            long key = ((((long)sensorType) << 32) | ((long)sensorSubType));
            return key;
        }

        private Dictionary<long, SubType> GetSensorSubTypes(out string strErrorMessage)
        {
            IEnumerable<SubType> subTypes = m_dataManager.GetSelect().Select<SubType>(null, out strErrorMessage);

            if (subTypes == null)
                return null;

            Dictionary<long, SubType> dicSubTypes = new Dictionary<long, SubType>();

            foreach (SubType subType in subTypes)
            {
                dicSubTypes[GetSubTypeKey(subType.sensor_ty_code, subType.sensor_sub_ty_no)] = subType;
            }

            return dicSubTypes;
        }

        private Dictionary<int, Codes> GetSensorTypes(out string strErrorMessage)
        {
            Dictionary<int, Codes> dicSensorTypes = new Dictionary<int, Codes>();

            string strCondition = string.Format("{0} = {1}", Codes.Fields.cl_code, (int)CodeType.SensorType);

            IEnumerable<Codes> codes = m_dataManager.GetSelect().Select<Codes>(strCondition, out strErrorMessage);

            if (codes == null)
                return null;

            foreach (var code in codes)
            {
                dicSensorTypes[code.code] = code;
            }

            return dicSensorTypes;
        }

        private Dictionary<int, Sensor> GetSensors(string strCondition, out string strErrorMessage)
        {
            strCondition = strCondition.Replace("a.", "");
            IEnumerable<Sensor> sensors = m_dataManager.GetSelect().Select<Sensor>(strCondition, out strErrorMessage);

            if (sensors == null)
                return null;

            Dictionary<int, Sensor> dicSensors = new Dictionary<int, Sensor>();

            foreach (Sensor sensor in sensors)
            {
                dicSensors[sensor.sensor_sn] = sensor;
            }

            return dicSensors;
        }

        private bool AddEmptySensorTypes(List<SensorList> sensors, out string strErrorMessage)
        {
            string strCondition = string.Format("{0} = {1}", Codes.Fields.cl_code, (int)dnsData.CommonCode.CodeType.SensorType);
            IEnumerable<Codes> codes = m_dataManager.GetSelect().Select<Codes>(strCondition, out strErrorMessage);

            if (codes == null)
                return false;

            Dictionary<int, Codes> dicSensorTypes = new Dictionary<int, Codes>();

            foreach (Codes code in codes)
            {
                dicSensorTypes[code.code] = code;
            }

            foreach (SensorList sensorList in sensors)
            {
                dicSensorTypes.Remove(sensorList.SensorTypeCode);
            }

            // 사용되지 않았지만 목록에 있는 센서타입들을 추가한다.(빈배열)
            foreach (KeyValuePair<int, Codes> pair in dicSensorTypes)
            {
                SensorList sensorList = new SensorList();
                sensorList.SensorTypeCode = pair.Value.code;
                sensorList.SensorTypeName = pair.Value.code_name;

                sensors.Add(sensorList);
            }

            return true;
        }

        private bool DeleteSensors(IDataManager dataManager, string strDeleteSensorNos, out string strErrorMessage)
        {
            if (strDeleteSensorNos == null)
            {
                strErrorMessage = null;
                return true;
            }

            string strCondition = string.Format("{0} in ({1})", Sensor.Fields.sensor_sn, strDeleteSensorNos);

            Dictionary<Sensor.Fields, object> dicSets = new Dictionary<Sensor.Fields, object>();
            dicSets[Sensor.Fields.deleted] = true;

            return dataManager.GetUpdate().Update<Sensor, Sensor.Fields>(dicSets, strCondition, out strErrorMessage);
        }

        private bool UpdateSensor(IDataManager dataManager, UpdateSensorData.SensorData updateData, out string strErrorMessage)
        {
            string strCondition = string.Format("{0} = {1}", Sensor.Fields.sensor_sn, updateData.SensorNo);
            Dictionary<Sensor.Fields, object> dicSets = new Dictionary<Sensor.Fields, object>();

            if (updateData.Enabled != null)
                dicSets[Sensor.Fields.enab] = updateData.Enabled;

            if (updateData.X != null && updateData.Y != null && updateData.Z != null)
            {
                dicSets[Sensor.Fields.x] = updateData.X;
                dicSets[Sensor.Fields.y] = updateData.Y;
                dicSets[Sensor.Fields.z] = updateData.Z;
                dicSets[Sensor.Fields.zone_sn] = updateData.ZoneNo;
            }

            dicSets[Sensor.Fields.deleted] = updateData.Deleted;

            if (dicSets.Count > 0)
            {
                if (dataManager.GetUpdate().Update<Sensor, Sensor.Fields>(dicSets, strCondition, out strErrorMessage) == false)
                {
                    string strTemp;
                    dataManager.BatchRollback(out strTemp);
                    return false;
                }
            }

            strErrorMessage = null;
            return true;
        }

        private bool UpdateSensorZone(IDataManager dataManager, int sensorNo, int equipZoneNo, out string strErrorMessage)
        {
            string strCondition = string.Format("{0} = {1}", SensorZone.Fields.sensor_sn, sensorNo);

            Dictionary<SensorZone.Fields, object> dicSets = new Dictionary<SensorZone.Fields, object>();
            dicSets[SensorZone.Fields.eqp_zone_sn] = equipZoneNo;

            if (dataManager.GetUpdate().Update<SensorZone, SensorZone.Fields>(dicSets, strCondition, out strErrorMessage) == false)
            {
                string strTemp;
                dataManager.BatchRollback(out strTemp);
                return false;
            }

            return true;
        }

        private List<SensorList> ToSensorTypes(Dictionary<int, SensorData>  dicSensors, out int totalCount, out string strErrorMessage)
        {
            totalCount = 0;

            string strCondition = string.Format("{0} = {1}", Codes.Fields.cl_code, (int)dnsData.CommonCode.CodeType.SensorType);
            IEnumerable<Codes> codes = m_dataManager.GetSelect().Select<Codes>(strCondition, out strErrorMessage);

            if (codes == null)
                return null;

            Dictionary<int, Codes> dicCodes = new Dictionary<int, Codes>();

            foreach (Codes code in codes)
            {
                dicCodes[code.code] = code;
            }

            Dictionary<int, SensorList> dicSensorList = new Dictionary<int, SensorList>();

            SensorList sensorList;

            foreach (KeyValuePair<int, SensorData> pair in dicSensors)
            {
                if (dicSensorList.TryGetValue(pair.Value.Sensor.sensor_ty_code, out sensorList) == false)
                {
                    sensorList = new SensorList();
                    sensorList.SensorTypeCode = pair.Value.Sensor.sensor_ty_code;

                    Codes code;

                    if (dicCodes.TryGetValue(sensorList.SensorTypeCode, out code))
                        sensorList.SensorTypeName = code.code_name;

                    dicSensorList[pair.Value.Sensor.sensor_ty_code] = sensorList;
                }

                sensorList.Sensors.Add(pair.Value);
                totalCount++;
            }

            List<SensorList> sensorListResult = new List<SensorList>();
            sensorListResult.AddRange(dicSensorList.Values);
            return sensorListResult;
        }

        private Dictionary<int, SensorData> LoadZoneSensors(RequestZoneSensorList data, out string strErrorMessage)
        {
            strErrorMessage = null;

            // 삭제되지 않은 센서들만 조회한다.
            string strCondition = string.Format("{0} = {1}", Sensor.Fields.deleted, CustomManager.GetBoolValue(m_dataManager, false));

            if (data.SensorNos != null && data.SensorNos.Count > 0)
            {
                strCondition += string.Format(" and {0} in ({1})", Sensor.Fields.sensor_sn, string.Join(",", data.SensorNos));
            }

            if (data.ZoneNo != null)
            {
                strCondition += string.Format(" and {0} = {1}", Sensor.Fields.zone_sn, (int)data.ZoneNo);
            }

            if (data.SensorTypes != null && data.SensorTypes.Count > 0)
            {
                strCondition += string.Format(" and {0} in ({1})", Sensor.Fields.sensor_ty_code, string.Join(",", data.SensorTypes));
            }

            RequestSensorList request = new RequestSensorList();
            return LoadSensors(strCondition, request, out strErrorMessage);
        }

        private Dictionary<int, SensorData> LoadSensors(RequestZone data, out string strErrorMessage)
        {
            strErrorMessage = null;

            // 삭제되지 않은 센서들만 조회한다.
            string strCondition = string.Format("{0} = {1}", Sensor.Fields.deleted, CustomManager.GetBoolValue(m_dataManager, false));

            if (data.ZoneNo == null)
            {
                strCondition += string.Format(" and {0} in (Select {1} from {2} where {3} is null and {4} = {5})",
                    Sensor.Fields.zone_sn,
                    Model.Spatial.Zone.Fields.zone_sn,
                    Model.Spatial.Zone.TableName,
                    Model.Spatial.Zone.Fields.buld_sn,
                    Model.Spatial.Zone.Fields.site_sn,
                    data.SiteNo);
            }
            else
                strCondition += string.Format(" and {0} = {1}", Sensor.Fields.zone_sn, (int)data.ZoneNo);

            RequestSensorList request = new RequestSensorList();
            return LoadSensors(strCondition, request, out strErrorMessage);
        }

        private Dictionary<int, SensorData> LoadSensors(RequestSensorList data, out string strErrorMessage)
        {
            strErrorMessage = null;

            // 삭제되지 않은 센서들만 조회한다.
            string strCondition = string.Format("{0} = {1}", Sensor.Fields.deleted, CustomManager.GetBoolValue(m_dataManager, false));

            if (data.SensorTypes != null && data.SensorTypes.Count > 0)
            {
                strCondition = string.Format(" and {0} in ({1})", Sensor.Fields.sensor_ty_code, string.Join(",", data.SensorTypes.ToArray()));
            }

            if (data.SiteNos != null && data.SiteNos.Count > 0)
            {
                if (strCondition == null)
                    strCondition = string.Format("{0} in ({1})", Sensor.Fields.site_sn, string.Join(",", data.SiteNos.ToArray()));
                else
                    strCondition += string.Format(" and {0} in ({1})", Sensor.Fields.site_sn, string.Join(",", data.SiteNos.ToArray()));
            }

            if (data.Enabled != null)
            {
                if (strCondition == null)
                    strCondition = string.Format("{0} = {1}", Sensor.Fields.enab, (bool)data.Enabled ? 1 : 0);
                else
                    strCondition += string.Format(" and {0} = {1}", Sensor.Fields.enab, (bool)data.Enabled ? 1 : 0);
            }

            if (data.SearchText != null && data.SearchText.Length > 0)
            {
                if (strCondition == null)
                    strCondition = string.Format("{0} like '%{1}%'", Sensor.Fields.sensor_name, data.SearchText);
                else
                    strCondition += string.Format(" and {0} like '%{1}%'", Sensor.Fields.sensor_name, data.SearchText);
            }

            return LoadSensors(strCondition, data, out strErrorMessage);
        }

        private Dictionary<int, SensorData> LoadSensors(string strCondition, RequestSensorList data, out string strErrorMessage)
        {
            IEnumerable<Sensor> sensors = m_dataManager.GetSelect().Select<Sensor>(strCondition, out strErrorMessage);

            if (sensors == null)
                return null;

            Dictionary<int, SensorData> dicSensors = CheckSensorFilters(sensors, data);
            string strSensorNos = GetSensorNos(dicSensors);

            if (LoadCCTVs(strSensorNos, dicSensors, out strErrorMessage) == false)
                return null;

            if (LoadSensorZones(strSensorNos, dicSensors, out strErrorMessage) == false)
                return null;

            if (LoadSensorSubTypes(dicSensors, out strErrorMessage) == false)
                return null;

            return dicSensors;
        }

        private bool LoadSensorSubTypes(Dictionary<int, SensorData> dicSensors, out string strErrorMessage)
        {
            IEnumerable<SubType> subTypes = m_dataManager.GetSelect().Select<SubType>(null, out strErrorMessage);

            if (subTypes == null)
                return false;

            Dictionary<long, SubType> dicSensorSubTypes = new Dictionary<long, SubType>();

            foreach (SubType subType in subTypes)
            {
                long key = MakeSensorSubTypeKey(subType.sensor_ty_code, subType.sensor_sub_ty_no);
                dicSensorSubTypes[key] = subType;
            }

            foreach (KeyValuePair<int, SensorData> pair in dicSensors)
            {
                SensorZone sensorZone = pair.Value.SensorZoneData?.SensorZone;

                if (sensorZone?.sensor_sub_ty_no != null)
                {
                    long key = MakeSensorSubTypeKey(sensorZone.sensor_ty_code, (int)sensorZone.sensor_sub_ty_no);

                    SubType subType;

                    if (dicSensorSubTypes.TryGetValue(key, out subType))
                    {
                        pair.Value.Sensor.SubTypeNo = subType.sensor_sub_ty_no;
                        pair.Value.Sensor.SubTypeName = subType.sensor_sub_ty_name;
                    }
                }
            }

            return true;
        }

        private long MakeSensorSubTypeKey(int sensorTypeCode, int subTypeCode)
        {
            long key = ((((long)sensorTypeCode) << 32) | ((long)subTypeCode));
            return key;
        }

        private bool LoadSensorZones(string strSensorNos, Dictionary<int, SensorData> dicSensors, out string strErrorMessage)
        {
            strErrorMessage = null;

            if (strSensorNos != null)
            {
                string strCondition = string.Format("a.{0} in ({1})", SensorZone.Fields.sensor_sn, strSensorNos);

                JoinManager joinManager = new JoinManager(m_dataManager);
                ArrayList arrDatas = joinManager.JoinSensorZoneMaterialSensor(strCondition, out strErrorMessage);

                if (arrDatas == null)
                    return false;

                SensorData sensorData;
                int nDataCount = arrDatas.Count;

                for (int i=0;i<nDataCount-1;i+=2)
                {
                    if (arrDatas[i] is SensorZone && (arrDatas[i + 1] == null || arrDatas[i + 1] is Material))
                    {
                        SensorZone sensorZone = (SensorZone)arrDatas[i];
                        Material material = (Material)arrDatas[i + 1];

                        if (dicSensors.TryGetValue(sensorZone.sensor_sn, out sensorData))
                        {
                            SensorZoneData sensorZoneData = new SensorZoneData();
                            sensorZoneData.SensorZone = sensorZone;
                            sensorZoneData.SensorMaterial = material;

                            sensorData.SensorZoneData = sensorZoneData;
                        }
                    }
                }
            }

            return true;
        }

        private bool LoadCCTVs(string strSensorNos, Dictionary<int, SensorData> dicSensors, out string strErrorMessage)
        {
            strErrorMessage = null;

            if (strSensorNos != null)
            {
                string strCondition = string.Format("{0} in ({1})", CCTV.Fields.sensor_sn, strSensorNos);
                IEnumerable<CCTV> cctvs = m_dataManager.GetSelect().Select<CCTV>(strCondition, out strErrorMessage);

                if (cctvs == null)
                    return false;

                SensorData sensorData;

                foreach (CCTV cctv in cctvs)
                {
                    if (dicSensors.TryGetValue(cctv.sensor_sn, out sensorData))
                        sensorData.Cctv = cctv;
                }
            }

            return true;
        }

        private string GetSensorNos(Dictionary<int, SensorData> dicSensors)
        {
            string strNos = null;

            foreach (var pair in dicSensors)
            {
                if (strNos == null)
                    strNos = pair.Value.Sensor.sensor_sn.ToString();
                else
                    strNos += "," + pair.Value.Sensor.sensor_sn.ToString();
            }

            return strNos;
        }

        private Dictionary<int, SensorData> CheckSensorFilters(IEnumerable<Sensor> sensors, RequestSensorList data)
        {
            Dictionary<int, SensorData> dicSensors = new Dictionary<int, SensorData>();

            if (data.PageIndex != null && data.PageItemCount != null && data.PageIndex >= 0 && data.PageItemCount > 0)
            {
                int beginIndex = ((int)data.PageIndex) * (int)data.PageItemCount;
                int endIndex = ((int)data.PageIndex + 1) * (int)data.PageItemCount;

                int i = 0;

                foreach (Sensor sensor in sensors)
                {
                    if (i >= beginIndex && i < endIndex)
                    {
                        SensorData sensorData = new SensorData();
                        sensorData.Sensor = new SensorEx(sensor);
                        dicSensors[sensor.sensor_sn] = sensorData;
                    }

                    i++;
                }
            }
            else
            {
                foreach (Sensor sensor in sensors)
                {
                    SensorData sensorData = new SensorData();
                    sensorData.Sensor = new SensorEx(sensor);
                    dicSensors[sensor.sensor_sn] = sensorData;
                }
            }

            return dicSensors;
        }


    }
}
