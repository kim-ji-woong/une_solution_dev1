using Base.Model.Alarm;
using Base.Model.Sensor;
using dnsDapperDBUtil.DataAccessLayer.DAL;
using dnsDapperDBUtil.DataAccessLayer.IDAL;
using dnsPipeHelper;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using static dnsData.CommonCode.SdmsSensor;

namespace SoulbrainIoT
{
    public class SensorDataManager
    {


        public SensorDataManager(DataManager dataManager)
        {

        }

        public static List<string> LoadSensorKeys(IDataManager dataManager, int nSensorType, out string strErrorMessage)
        {
            strErrorMessage = null;
            List<string> sensorKeys = null;

            string strSQL = $"select {SensorZone.Fields.unq_key} from {SensorZone.TableName} where {SensorZone.Fields.sensor_ty_code} = {nSensorType}";

            IEnumerable<dynamic> dynamics = dataManager.GetSelect().Select(strSQL, out strErrorMessage);
            if (dynamics != null)
            {
                sensorKeys = new List<string>();

                foreach (var item in dynamics)
                {
                    string strUniqueKey = item.unq_key;

                    int nIdx = strUniqueKey.LastIndexOf("_");
                    if (nIdx != -1)
                    {
                        strUniqueKey = strUniqueKey.Substring(0, nIdx);

                        if (sensorKeys.Contains(strUniqueKey) == false)
                            sensorKeys.Add(strUniqueKey);
                    }
                }
            }

            return sensorKeys;
        }

        public static List<AlarmData> GetAlarmList(IDataManager dataManager, out string strErrorMessage)
        {
            strErrorMessage = null;
            List<AlarmData> alarms = new List<AlarmData>();

            List<Current> currentAlarms = null;

            try
            {
                string strSQL = string.Format($@"
                                    select sensor.{Sensor.Fields.sensor_name}, sz.{SensorZone.Fields.unq_key}, sz.{SensorZone.Fields.sensor_ty_code}, sensor.{Sensor.Fields.sensor_sn}, sub.{SubType.Fields.sensor_sub_ty_name}
                                    from {Current.TableName} cur 
                                    inner join {SensorZone.TableName} sz on sz.{SensorZone.Fields.sensor_zone_sn} = cur.{Current.Fields.sensor_zone_sn} 
                                    inner join {Sensor.TableName} sensor on sensor.{Sensor.Fields.sensor_sn} = sz.{SensorZone.Fields.sensor_sn} 
                                    inner join {SubType.TableName} sub on sub.{SubType.Fields.sensor_sub_ty_no} = sz.{SensorZone.Fields.sensor_sub_ty_no} 
                                    where sz.{SensorZone.Fields.sensor_ty_code} in ({SensorType.PSM}, {SensorType.Etc})");

                IEnumerable<dynamic> dynamics = dataManager.GetSelect().Select(strSQL, out strErrorMessage);
                if (dynamics == null)
                {
                    return null;
                }

                foreach (var item in dynamics)
                {
                    string strDeviceName = item.sensor_name;
                    string strDeviceID = item.unq_key;
                    string strSensorName = item.sensor_sub_ty_name;
                    int nSensorID = item.sensor_sn;
                    int nSensorType = item.sensor_ty_code;

                    AlarmData alarm = new AlarmData();
                    alarm.DeviceName = strDeviceName;
                    alarm.DeviceID = strDeviceID;
                    alarm.SensorType = nSensorType;
                    alarm.OrgSensorID = nSensorID;
                    alarm.SensorName = strSensorName;

                    alarms.Add(alarm);
                }
            }
            catch (Exception e)
            {
                strErrorMessage = e.Message;
                return null;
            }

            return alarms;
        }

        public static AlarmData GetAlarmData(IDataManager dataManager, DataDevice device, DataSensor sensor, string strSOPWebServerURL, out string strErrorMessage)
        {
            string strUrl = "";

            AlarmData alarm = null;
            strErrorMessage = null;

            try
            {
                string strCondition = string.Format($"{SensorZone.Fields.unq_key} = '{device.DeviceId}_{sensor.SensorName}'");
                SensorZone sz = dataManager.GetSelect().SelectFirst<SensorZone>(strCondition, out strErrorMessage);
                if (sz == null)
                {
                    return null;
                }

                int sensor_zone_sn = sz.sensor_zone_sn;
                int sensor_ty_code = sz.sensor_ty_code;

                if (sensor_ty_code == SensorType.PSM)
                {
                    strUrl = strSOPWebServerURL + "/api/EtcSensor";
                }
                else if (sensor_ty_code == SensorType.Etc)
                {
                    strUrl = strSOPWebServerURL + "/api/PSMSensor";
                }
                else
                {
                    strErrorMessage = "sensor_ty_code 값이 올바르지 않습니다.";
                    return null;
                }

                alarm = new AlarmData();
                alarm.DeviceID = device.DeviceId;
                alarm.DeviceName = device.DeviceName;
                alarm.SensorID = sensor.SensorId;
                alarm.SensorZoneID = sensor_zone_sn;
                alarm.SensorType = sensor_ty_code;
                alarm.URL = strUrl;

            }
            catch (Exception e)
            {
                strErrorMessage = e.Message;
                return null;
            }

            return alarm;
        }

        /// <summary>
        /// Device 임계치 및 기준값 업데이트
        /// </summary>
        /// <param name="dicDevices">Device 리스트</param>
        /// <returns></returns>
        public static bool UpdateSensorsThresholds(IDataManager dataManager, Logger logger, Dictionary<string, DataDevice> dicDevices, out string strErrorMessage)
        {
            strErrorMessage = "";

            if (dicDevices == null || dicDevices.Count == 0)
            {
                strErrorMessage = "dicDevices 데이터가 존재하지 않습니다.";
                return false;
            }

            foreach (KeyValuePair<string, DataDevice> pair in dicDevices)
            {
                DataDevice device = pair.Value;

                UpdateSensorsThreshold(dataManager, logger, device);
            }

            return true;
        }

        public static void UpdateSensorsThreshold(IDataManager dataManager, Logger logger, DataDevice device)
        {
            string strErrorMessage = "";

            if (device == null)
            {
                logger.Write("DataDevice 존재하지 않습니다.");
                return;
            }

            List<DataSensor> listSensorData = device.SensorDataList;
            if (listSensorData == null)
            {
                logger.Write("DataDevice SensorDataList 존재하지 않습니다.");
                return;
            }

            foreach (DataSensor sensor in listSensorData)
            {
                try
                {
                    if (sensor.SensorName == "")
                        continue;

                    // 센서존 조회
                    string strConditions = $"{SensorZone.Fields.unq_key} = '{device.DeviceId}_{sensor.SensorName}'";

                    SensorZone sensorZone = dataManager.GetSelect().SelectFirst<SensorZone>(strConditions, out strErrorMessage);
                    if (sensorZone == null)
                        continue;

                    strConditions = $"{MaterialLimitData.Fields.sensor_zone_sn} = {sensorZone.sensor_zone_sn}";

                    IEnumerable<MaterialLimitData> datas = dataManager.GetSelect().Select<MaterialLimitData>(strConditions, out strErrorMessage);
                    if (datas == null)
                        continue;

                    List<MaterialLimitData> limitDatas = datas.Cast<MaterialLimitData>().ToList();

                    MaterialLimitData limit0 = limitDatas.Find(x => x.lim_indx == 0);
                    MaterialLimitData limit1 = limitDatas.Find(x => x.lim_indx == 1);
                    MaterialLimitData limit2 = limitDatas.Find(x => x.lim_indx == 2);

                    // 관심 limit 업데이트
                    if (limit0 == null)
                    {   // 생성
                        limit0 = new MaterialLimitData();
                        limit0.sensor_zone_sn = sensorZone.sensor_zone_sn;
                        limit0.lim_indx = 0;
                        limit0.usab = false;
                        limit0.value = null;

                        if (dataManager.GetCreate().Insert<MaterialLimitData>(limit0, out strErrorMessage) == false)
                        {
                            logger.Write("MaterialLimitData Insert Error: " + strErrorMessage);
                            continue;
                        }
                    }
                    else
                    {   // 업데이트
                        limit0.usab = false;
                        limit0.value = null;

                        if (dataManager.GetUpdate().Update<MaterialLimitData>(limit0, null, out strErrorMessage) == false)
                        {
                            logger.Write("MaterialLimitData Update Error: " + strErrorMessage);
                            continue;
                        }
                    }

                    bool usab = false;
                    double? value = null;
                    double dTemp = 0;

                    // 주의 limit 업데이트
                    if (sensor.CautionRange != null && sensor.CautionRange != "" && double.TryParse(sensor.CautionRange, out dTemp))
                    {
                        usab = true;
                        value = Math.Round(dTemp, 2);
                    }
                    else
                    {
                        usab = false;
                        value = null;
                    }

                    if (limit1 == null)
                    {
                        limit1 = new MaterialLimitData();
                        limit1.sensor_zone_sn = sensorZone.sensor_zone_sn;
                        limit1.lim_indx = 1;
                        limit1.usab = usab;
                        limit1.value = value;

                        if (dataManager.GetCreate().Insert<MaterialLimitData>(limit1, out strErrorMessage) == false)
                        {
                            logger.Write("MaterialLimitData Insert Error: " + strErrorMessage);
                            continue;
                        }
                    }
                    else
                    {
                        limit1.usab = usab;
                        limit1.value = value;

                        if (dataManager.GetUpdate().Update<MaterialLimitData>(limit1, null, out strErrorMessage) == false)
                        {
                            logger.Write("MaterialLimitData Update Error: " + strErrorMessage);
                            continue;
                        }
                    }

                    // 경계 limit 업데이트
                    if (sensor.WarningRange != null && sensor.WarningRange != "" && double.TryParse(sensor.WarningRange, out dTemp))
                    {
                        usab = true;
                        value = Math.Round(dTemp, 2);
                    }
                    else
                    {
                        usab = false;
                        value = null;
                    }

                    if (limit2 == null)
                    {
                        limit2 = new MaterialLimitData();
                        limit2.sensor_zone_sn = sensorZone.sensor_zone_sn;
                        limit2.lim_indx = 2;
                        limit2.usab = usab;
                        limit2.value = value;

                        if (dataManager.GetCreate().Insert<MaterialLimitData>(limit2, out strErrorMessage) == false)
                        {
                            logger.Write("MaterialLimitData Insert Error: " + strErrorMessage);
                            continue;
                        }
                    }
                    else
                    {
                        limit2.usab = usab;
                        limit2.value = value;

                        if (dataManager.GetUpdate().Update<MaterialLimitData>(limit2, null, out strErrorMessage) == false)
                        {
                            logger.Write("MaterialLimitData Update Error: " + strErrorMessage);
                            continue;
                        }
                    }


                    if (sensor.NormalRange != null && sensor.NormalRange != "" && double.TryParse(sensor.NormalRange, out dTemp))
                    {
                        value = Math.Round(dTemp, 2);
                    }

                    Dictionary<Material.Fields, object> dicSets = new Dictionary<Material.Fields, object>();
                    dicSets[Material.Fields.lim_bas] = value;
                    dicSets[Material.Fields.sensor_lim_ty_optn_code] = dnsData.CommonCode.CodeType.SensorLimitType;
                    dicSets[Material.Fields.sensor_lim_ty] = SensorLimitType.Normal;

                    strConditions = $"{Material.Fields.sensor_zone_sn} = {sensorZone.sensor_zone_sn}";

                    if (dataManager.GetUpdate().Update<Material, Material.Fields>(dicSets, strConditions, out strErrorMessage) == false)
                    {
                        logger.Write("Material Update Error: " + strErrorMessage);
                        continue;
                    }
                }
                catch (Exception e)
                {
                    logger.Write("UpdateSensorsThreshold Exception: " + e.Message);
                    continue;
                }
            }

            return;
        }

        // Sensor 현재 수치 값 및 상태 업데이트
        public static bool UpdateETCSensor(IDataManager dataManager, DataDevice device, out string strErrorMessage)
        {
            strErrorMessage = "";

            if (device == null)
            {
                strErrorMessage = "device 정보가 없습니다.";
                return false;
            }

            List<DataSensor> listSensorData = device.SensorDataList;
            if (listSensorData == null)
            {
                strErrorMessage = "device SensorDataList 정보가 없습니다.";
                return false;
            }


            foreach (DataSensor sensor in listSensorData)
            {
                if (sensor.ModelName == SoulbrainID.MODEL_DEBUGGING ||
                    sensor.SensorName == SoulbrainID.ETC_CONNECT ||
                    sensor.SensorName == "" || sensor.Value == "")
                    continue;

                int nEnabled = 0;
                bool bEnabled = false;
                string strAdditionalConditions = "";
                int nSensorStatus = 0;

                if (sensor.SensorStatus == SoulbrainID.STATUS_CAUTION)
                    nSensorStatus = SoulbrainID.LEVEL_CAUTION;
                else if (sensor.SensorStatus == SoulbrainID.STATUS_WARNING)
                    nSensorStatus = SoulbrainID.LEVEL_WARNING;

                if (sensor.SensorStatus != SoulbrainID.STATUS_OFFLINE)
                    nEnabled = 1;

                bEnabled = (nEnabled == 1);

                try
                {
                    // fa_sensor_zone 조회
                    string strCondition = string.Format($"{SensorZone.Fields.unq_key} = '{device.DeviceId}_{sensor.SensorName}'");
                    SensorZone sensorZone = dataManager.GetSelect().SelectFirst<SensorZone>(strCondition, out strErrorMessage);
                    if (sensorZone == null)
                        return false;

                    // 현재 값 업데이트
                    Dictionary<Material.Fields, object> dicSets = new Dictionary<Material.Fields, object>();
                    dicSets[Material.Fields.cur_data] = sensor.Value;

                    string strConditions = $"{Material.Fields.sensor_zone_sn} = {sensorZone.sensor_zone_sn}";

                    if (dataManager.GetUpdate().Update<Material, Material.Fields>(dicSets, strConditions, out strErrorMessage) == false)
                        return false;

                    // 센서 켜짐,꺼짐 상태 업데이트
                    Dictionary<Sensor.Fields, object> dicSets_Sensor = new Dictionary<Sensor.Fields, object>();
                    dicSets_Sensor[Sensor.Fields.enab] = bEnabled;

                    strConditions = $"{Sensor.Fields.sensor_sn} = {sensorZone.sensor_sn}";

                    if (dataManager.GetUpdate().Update<Sensor, Sensor.Fields>(dicSets_Sensor, strConditions, out strErrorMessage) == false)
                        return false;
                }
                catch (Exception e)
                {
                    strErrorMessage = "UpdateETCSensor 실패(예외처리: " + e.Message + ")";
                    return false;
                }
            }

            return true;
        }

        public static AlarmData GetAlarmData(IDataManager dataManager, AlarmSensorData alarmSensorData, string strSOPWebServerURL, out string strErrorMessage)
        {
            AlarmData alarm = null;

            strErrorMessage = "";

            try
            {
                // fa_sensor_zone 조회
                string strCondition = string.Format($"{SensorZone.Fields.unq_key} = '{alarmSensorData.UniqueKey}'");
                SensorZone sensorZone = dataManager.GetSelect().SelectFirst<SensorZone>(strCondition, out strErrorMessage);
                if (sensorZone == null)
                {
                    strErrorMessage = $"{alarmSensorData.UniqueKey}의 SensorZone 조회되지 않습니다.";
                    return alarm;
                }


                alarm = new AlarmData
                {
                    SensorZoneID = sensorZone.sensor_zone_sn,
                    SensorType = sensorZone.sensor_ty_code,
                    URL = strSOPWebServerURL
                };
            }
            catch (Exception e)
            {
                strErrorMessage = $"GetAlarmData Exception : {e.Message}";
                return alarm;
            }

            return alarm;
        }

        public static bool UpdateETCSensor(IDataManager dataManager, Logger logger, List<AlarmSensorData> alarmSensors, out string strErrorMessage)
        {
            strErrorMessage = null;

            if (alarmSensors == null)
            {
                strErrorMessage = "알람데이터가 존재하지 않습니다.";
                return false;
            }

            foreach (AlarmSensorData alarmSensorData in alarmSensors)
            {
                List<DataSensor> listSensorData = alarmSensorData.SensorDataList;
                if (listSensorData == null)
                    continue;

                foreach (DataSensor sensor in listSensorData)
                {
                    if (sensor.ModelName == SoulbrainID.MODEL_DEBUGGING ||
                        sensor.SensorName == "" || sensor.Value == "")
                        continue;

                    //int nEnabled = 0;
                    //bool bEnabled = false;
                    //string strAdditionalConditions = "";
                    //int nSensorStatus = 0;

                    //if (sensor.SensorStatus == SoulbrainID.STATUS_CAUTION)
                    //    nSensorStatus = SoulbrainID.LEVEL_CAUTION;
                    //else if (sensor.SensorStatus == SoulbrainID.STATUS_WARNING)
                    //    nSensorStatus = SoulbrainID.LEVEL_WARNING;

                    //if (sensor.SensorStatus != SoulbrainID.STATUS_OFFLINE)
                    //    nEnabled = 1;

                    //bEnabled = (nEnabled == 1);

                    try
                    {
                        // 센서존 조회
                        string strCondition = string.Format($"{SensorZone.Fields.unq_key} = '{alarmSensorData.UniqueKey}'");
                        SensorZone sensorZone = dataManager.GetSelect().SelectFirst<SensorZone>(strCondition, out strErrorMessage);
                        if (sensorZone == null)
                        {
                            logger.Write($"UpdateETCSensor SelectFirst : {alarmSensorData.UniqueKey}의 SensorZone 조회되지 않습니다.");
                            continue;
                        }

                        // 현재 값 업데이트
                        Dictionary<Material.Fields, object> dicSets = new Dictionary<Material.Fields, object>();
                        dicSets[Material.Fields.cur_data] = sensor.Value;

                        string strConditions = $"{Material.Fields.sensor_zone_sn} = {sensorZone.sensor_zone_sn}";

                        if (dataManager.GetUpdate().Update<Material, Material.Fields>(dicSets, strConditions, out strErrorMessage) == false)
                        {
                            logger.Write("UpdateETCSensor Update : " + strErrorMessage);
                            continue;
                        }
                    }
                    catch (Exception e)
                    {
                        logger.Write("UpdateETCSensor Exception : " + e.Message);
                    }
                }
            }

            return true;
        }
    }
}
