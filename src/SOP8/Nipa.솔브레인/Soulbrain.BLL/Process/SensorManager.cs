using System.Collections;
using System.Collections.Generic;
using dnsDapperDBUtil.DataAccessLayer.IDAL;
using Base.Model.Sensor;
using dnsData.CommonCode;
using Base.DAL;
using Base.Model.Spatial;
using Base.Model.Alarm;
using Base.Model.Common;
using Base.Model.Sensor.CCTV;

namespace Soulbrain.BLL.Process
{
    using Request;
    using Response;

    class SensorManager
    {
        private IDataManager m_dataManager = null;

        public SensorManager(IDataManager dataManager)
        {
            m_dataManager = dataManager;
        }

        public ResponseSensorinfo RequestSensorInfo(RequestSensorInfo data)
        {
            string strCondition = string.Format("{0} = {1}", Sensor.Fields.sensor_sn, data.SensorNo);

            string strErrorMessage;
            Sensor sensor = m_dataManager.GetSelect().SelectFirst<Sensor>(strCondition, out strErrorMessage);

            if (sensor == null)
            {
                if (strErrorMessage != null)
                    return new ResponseSensorinfo(false, strErrorMessage);
                else
                    return new ResponseSensorinfo(false, "존재하지 않는 센서입니다.");
            }

            ResponseSensorinfo response = null;
            List <SensorData> sensorDatas = null;

            if (sensor.sensor_ty_code == SdmsSensor.SensorType.Fire)
                sensorDatas = GetFireSensorInfo(sensor, out strErrorMessage);
            else if (sensor.sensor_ty_code == SdmsSensor.SensorType.PSM)
                sensorDatas = GetPSMSensorInfo(sensor, out strErrorMessage);
            else if (sensor.sensor_ty_code == SdmsSensor.SensorType.Etc)
                sensorDatas = GetPSMSensorInfo(sensor, out strErrorMessage);
            else
                strErrorMessage = "정의되지 않은 센서타입입니다.";

            if (sensorDatas == null)
                response = new ResponseSensorinfo(false, strErrorMessage);
            else
            {
                response = new ResponseSensorinfo(true, "");
                response.SensorDatas.AddRange(sensorDatas);
            }

            return response;
        }

        public ResponseAdditableSensors GetAdditableSensors(RequestAdditableSensors data)
        {
            string strCondition = string.Format("(a.{0} is null or a.{1} is null or a.{2} is null or a.{3} is null or a.{6} = 1) and a.{4} not like '%수동신고%' and a.{5} = 1",
                Sensor.Fields.x, Sensor.Fields.y, Sensor.Fields.z, Sensor.Fields.zone_sn, Sensor.Fields.sensor_name, Sensor.Fields.enab, Sensor.Fields.deleted);

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
            Dictionary<int, SensorData2> dicSensorDatas = new Dictionary<int, SensorData2>();

            foreach (var sensorList in sensorLists)
            {
                foreach (SensorData2 sensorData in sensorList.Sensors)
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
                SensorData2 sensorData;

                if (dicSensorDatas.TryGetValue(cctv.sensor_sn, out sensorData))
                    sensorData.Cctv = cctv;
            }

            return true;
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

        private long GetSubTypeKey(int sensorType, int sensorSubType)
        {
            long key = ((((long)sensorType) << 32) | ((long)sensorSubType));
            return key;
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

            for (int i=0;i<nDataCount-2;i+=3)
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

            SensorData2 sensorData = new SensorData2();

            sensorData.Sensor = sensorEx;
            sensorData.SensorZoneData = sensorZoneData;

            sensorList.Sensors.Add(sensorData);
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

        private List<SensorData> GetPSMSensorInfo(Sensor sensor, out string strErrorMessage)
        {
            Dictionary<int, int> dicSensorZoneAlarms = GetAlarmSensorZones(out strErrorMessage);

            if (dicSensorZoneAlarms == null)
                return null;

            JoinManager joinManager = new JoinManager(m_dataManager);

            string strCondition = string.Format("a.{0} = {1}", SensorZone.Fields.sensor_sn, sensor.sensor_sn);
            ArrayList arrDatas = joinManager.JoinSensorZoneMaterialSensor(strCondition, out strErrorMessage);

            if (arrDatas == null)
                return null;

            List<SensorData> sensorDatas = new List<SensorData>();
            int dataCount = arrDatas.Count;

            for (int i=0;i<dataCount-1;i+=2)
            {
                if (arrDatas[i] is SensorZone && arrDatas[i + 1] is Material)
                {
                    SensorZone sensorZone = (SensorZone)arrDatas[i];
                    Material materialSensor = (Material)arrDatas[i + 1];

                    string strUnit;
                    string strSubTypeName = GetSubTypeName(sensorZone, out strUnit, out strErrorMessage);

                    if (strSubTypeName == null)
                        return null;

                    string strValue = materialSensor.cur_data;

                    if (strValue != null && strValue.Trim().Length > 0)
                    {
                        if (strUnit != null && strUnit.Trim().Length > 0)
                            strValue = strValue.Trim() + " " + strUnit.Trim();
                    }

                    int alarmDepth;

                    if (dicSensorZoneAlarms.TryGetValue(sensorZone.sensor_zone_sn, out alarmDepth))
                        sensorDatas.Add(new SensorData(strSubTypeName, strValue, alarmDepth));
                    else
                        sensorDatas.Add(new SensorData(strSubTypeName, strValue, 0));
                }
            }

            return sensorDatas;
        }

        // Key : SensorZoneNo
        // Value : Alarm Depth
        private Dictionary<int, int> GetAlarmSensorZones(out string strErrorMessage)
        {
            IEnumerable<Current> alarms = m_dataManager.GetSelect().Select<Current>(null, out strErrorMessage);

            if (alarms == null)
                return null;

            Dictionary<int, int> dicSensorZoneAlarms = new Dictionary<int, int>();

            foreach (Current alarm in alarms)
            {
                dicSensorZoneAlarms[alarm.sensor_zone_sn] = alarm.alarm_level;
            }

            return dicSensorZoneAlarms;
        }

        private List<SensorData> GetFireSensorInfo(Sensor sensor, out string strErrorMessage)
        {
            string strLocation = GetLocation(sensor, out strErrorMessage);

            if (strLocation == null)
                return null;

            SensorZone sensorZone = GetSensorZone(sensor, out strErrorMessage);

            if (sensorZone == null)
                return null;

            string strUnit;
            string strSubTypeName = GetSubTypeName(sensorZone, out strUnit, out strErrorMessage);

            if (strSubTypeName == null)
                return null;

            if (strSubTypeName == "")
                strSubTypeName = "일반감지기";
            else
                strSubTypeName = strSubTypeName + "감지기";

            List<SensorData> sensorDatas = new List<SensorData>();

            sensorDatas.Add(new SensorData("위치", strLocation));
            sensorDatas.Add(new SensorData("수신기 번호", GetFireSensorInfo(sensorZone)));
            sensorDatas.Add(new SensorData("감지기종류", strSubTypeName));

            return sensorDatas;
        }

        private string GetFireSensorInfo(SensorZone sensorZone)
        {
            if (sensorZone.tag_no == null)
                return "";

            int tagNo = (int)sensorZone.tag_no;
            int receiverNo = (tagNo - 1000000000) / 10000000;
            int relayTeam = (tagNo % 10000000) / 100000;
            int loop = (tagNo % 100000) / 10000;
            int relayNo = (tagNo % 10000) / 10;
            int tag = tagNo % 10;

            return string.Format("{0}-{1}-{2}-{3}-{4}", receiverNo, relayTeam, loop, relayNo, tag);
        }

        private string GetSubTypeName(SensorZone sensorZone, out string strUnit, out string strErrorMessage)
        {
            strErrorMessage = null;
            strUnit = null;

            if (sensorZone.sensor_sub_ty_no == null)
                return "";

            string strCondition = string.Format("{0} = {1} and {2} = {3}",
                SubType.Fields.sensor_ty_code, sensorZone.sensor_ty_code,
                SubType.Fields.sensor_sub_ty_no, (int)sensorZone.sensor_sub_ty_no);

            SubType subType = m_dataManager.GetSelect().SelectFirst<SubType>(strCondition, out strErrorMessage);

            if (subType == null)
            {
                if (strErrorMessage != null)
                    return null;
                else
                    return "";
            }

            strUnit = subType.uom;
            return subType.sensor_sub_ty_name;
        }

        private SensorZone GetSensorZone(Sensor sensor, out string strErrorMessage)
        {
            string strCondition = string.Format("{0} = {1}", SensorZone.Fields.sensor_sn, sensor.sensor_sn);
            IEnumerable<SensorZone> sensorZones = m_dataManager.GetSelect().Select<SensorZone>(strCondition, out strErrorMessage);

            if (sensorZones == null)
                return null;

            foreach (SensorZone sensorZone in sensorZones)
            {
                return sensorZone;
            }

            strErrorMessage = "센서의 부가정보를 찾을수 없습니다.";
            return null;
        }

        private string GetLocation(Sensor sensor, out string strErrorMessage)
        {
            JoinManager joinManager = new JoinManager(m_dataManager);

            string strCondition = string.Format("a.{0} = {1}", Zone.Fields.zone_sn, sensor.zone_sn);
            ArrayList arrDatas = joinManager.JoinZoneBuilding(strCondition, out strErrorMessage);

            if (arrDatas == null)
                return null;

            int dataCount = arrDatas.Count;

            if (dataCount < 2)
            {
                strErrorMessage = "센서의 위치정보를 찾을수 없습니다.";
                return null;
            }

            Zone zone = (Zone)arrDatas[0];
            Building building = (Building)arrDatas[1];

            if (building != null)
            {
                string strBuildingName = building.disp_text;
                string strZoneName = zone.disp_text;

                if (strZoneName.StartsWith(strBuildingName))
                    return strZoneName;
                else
                    return strBuildingName + " " + strZoneName;
            }

            return zone.disp_text;
        }
    }
}
