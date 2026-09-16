using IntegrationServer.Datas;
using Newtonsoft.Json.Linq;
using System;
using System.Collections;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Net;
using System.Text;
using static dnsData.CommonCode.SdmsSensor;

namespace IntegrationServer.Servers.IoT.Soulbrain
{
    public class SoulbrainID
    {
        // 디바이스 버전
        public const string VERSION_30056 = "30056";
        public const string VERSION_30057 = "30057";
        public const string VERSION_30058 = "30058";
        public const string VERSION_30061 = "30061";
        public const string VERSION_30062 = "30062";
        public const string VERSION_30063 = "30063";    // 인디게이터
        public const string VERSION_30064 = "30064";
        public const string VERSION_30065 = "30065";
        public const string VERSION_31007 = "31007";
        public const string VERSION_31008 = "31008";
        public const string VERSION_32001 = "32001";    // 게이트웨이
        public const string VERSION_32002 = "32002";
        public const string VERSION_32003 = "32003";    // 레벨감지기 수신반
        public const string VERSION_32004 = "32004";
        public const string VERSION_32005 = "32005";
        public const string VERSION_32006 = "32006";

        public const string VERSION_30056_NAME = "NeoBerry(v3.0)";
        public const string VERSION_30061_NAME = "스크러버감지기(v5.1)";
        public const string VERSION_30063_NAME = "가스감지기 수신반";
        public const string VERSION_30064_NAME = "가스감지기";
        public const string VERSION_30065_NAME = "POLI";
        public const string VERSION_31007_NAME = "환경안전센서";
        public const string VERSION_31008_NAME = "우수관수문";
        public const string VERSION_32001_NAME = "HF IoT 게이트웨이";
        public const string VERSION_32002_NAME = "HF IoT 센서";
        public const string VERSION_32003_NAME = "레벨감지기 수신반";
        public const string VERSION_32004_NAME = "레벨감지기";
        public const string VERSION_32005_NAME = "HORIBA수질측정기(수온포함)";
        public const string VERSION_32006_NAME = "HORIBA수질측정기";



        // 공장 이름
        public const string FACT_PAJU = "파주 공장";
        public const string FACT_PAJU2 = "파주공장";
        public const string FACT_GONGJU = "공주 공장";

        // 센서 상태
        public const string STATUS_OFFLINE = "OFFLINE";
        public const string STATUS_NORMAL = "NORMAL";
        public const string STATUS_CAUTION = "CAUTION";
        public const string STATUS_WARNING = "WARNING";

        public const int LEVEL_CAUTION = 2;
        public const int LEVEL_WARNING = 3;

        // 디버깅용 센서
        public const string MODEL_DEBUGGING = "디버깅용";
        public const string SENSOR_GAS_TYPE = "가스종류";
        public const string SENSOR_LEVEL = "LEVEL";
        public const string SENSOR_RESULT = "센서값";
        public const string SENSOR_STATUS = "STATUS";
        public const string TEST_DEVICE1 = "BERRY51-I003";      // 설치 장소가 표시 안된 디바이스
        public const string TEST_DEVICE2 = "TestDevice01";      // 한컴 테스트 디바이스
        public const string SENSOR_DMGD = "DMGD";

        public const string SENSOR_MAC = "MAC";
        public const string SENSOR_TYPE = "TYPE";
        public const string SENSOR_GW_ID = "GW_ID";
        public const string SENSOR_KIND = "종류";
        public const string SENSOR_MEASURE = "측정종류";

        public const string DEVICE_STATUS = "기기상태";
        public const string SENSOR_ERROR = "에러상태";
        public const string SENSOR_CH_NUM = "CH_NUM";

        public const string SENSOR_GAS_VAL1 = "Gas Value 1";
        public const string SENSOR_GAS_VAL2 = "Gas Value 2";
        public const string SENSOR_GAS_VAL3 = "Gas Value 3";
        public const string SENSOR_GAS_VAL4 = "Gas Value 4";
        public const string SENSOR_GAS_VAL5 = "Gas Value 5";

        public const string SENSOR_GAS_NAME1 = "Gas Name 1";
        public const string SENSOR_GAS_NAME2 = "Gas Name 2";
        public const string SENSOR_GAS_NAME3 = "Gas Name 3";
        public const string SENSOR_GAS_NAME4 = "Gas Name 4";
        public const string SENSOR_GAS_NAME5 = "Gas Name 5";

        // ETC 종류
        public const string ETC_TEMP = "온도";
        public const string ETC_TEMP_31007 = "Temperature";
        public const string ETC_HUMI = "습도";
        public const string ETC_HUMI_31007 = "Humidity";
        public const string ETC_CO2 = "CO2";
        public const string ETC_TVOC = "TVOC";
        public const string ETC_PM1 = "미세먼지(PM 1.0)";
        public const string ETC_PM1_31007 = "PM1.0";
        public const string ETC_PM2 = "미세먼지(PM 2.5)";
        public const string ETC_PM2_31007 = "PM2.5";
        public const string ETC_PM10 = "미세먼지(PM 10)";
        public const string ETC_PM10_31007 = "PM10";
        public const string ETC_AirPress = "기압";
        public const string ETC_Inclin_X = "기울기(X)";
        public const string ETC_Inclin_Y = "기울기(Y)";
        public const string ETC_Vib_X = "진동(X)";
        public const string ETC_Vib_Y = "진동(Y)";
        public const string ETC_Vib_Z = "진동(Z)";
        public const string ETC_Noise = "소음";
        public const string ETC_BLE_Count = "BLE_Count";
        public const string ETC_BLE_Count2 = "BLE Count";
        public const string ETC_O2 = "O2";
        public const string ETC_Value = "수치";
        public const string ETC_mA = "mA";
        public const string ETC_Contact = "접점";
        public const string ETC_Relay = "릴레이";

        public const string ETC_pH = "pH";
        public const string ETC_AUTO = "자동모드";
        public const string ETC_GATE1_OPEN = "수문1 열림";
        public const string ETC_GATE1_CLOSE = "수문1 닫힘";
        public const string ETC_GATE1_RATE = "수문1 개도율";
        public const string ETC_GATE1_FAULT = "수문1 FAULT";
        public const string ETC_GATE2_OPEN = "수문2 열림";
        public const string ETC_GATE2_CLOSE = "수문2 닫힘";
        public const string ETC_GATE2_RATE = "수문2 개도율";
        public const string ETC_GATE2_FAULT = "수문2 FAULT";
        public const string ETC_BATTERY = "배터리";
        public const string ETC_OPERATION = "동작상태";
        public const string ETC_WATER_TEMP = "수온";
        public const string ETC_SCRUBBER = "스크러버";
        public const string ETC_Flame = "Flame";
        public const string ETC_FLAME = "FLAME";
        public const string ETC_Leak = "Leak";
        public const string ETC_LEL = "LEL";
        public const string ETC_CONNECT = "통신상태";

        public const string ETC_OFFLINE = "오프라인";
        public const string ETC_RETURN = "정상 복귀";


        // PSM 종류
        public const string PSM_HF = "HF";
        public const string PSM_CO = "CO";
        public const string PSM_HCL = "HCL";
        public const string PSM_CH3C = "CH3COOH";
        public const string PSM_N2H4 = "N2H4";
        public const string PSM_CA = "CA";
        public const string PSM_EA = "EA";
        public const string PSM_VOC = "VOC";
        public const string PSM_H2O2 = "H2O2";
        public const string PSM_THC = "THC";
        public const string PSM_HNO3 = "HNO3";
        public const string PSM_CL = "CL";
        public const string PSM_TOLUENE = "TOLUENE";
        public const string PSM_TOLU = "TOLU";
        public const string PSM_F2 = "F2";
        public const string PSM_NH3 = "NH3";
        public const string PSM_LNG = "LNG";
        public const string PSM_PGME = "PGME";
        public const string PSM_H2S = "H2S";

        public const string PSM_F = "F";
        public const string PSM_H2 = "H2";
        public const string PSM_CL2 = "CL2";
        public const string PSM_C2H6O = "C2H6O";
        public const string PSM_TEPO = "TEPO";

        public const string PSM_ETHA = "ETHA";
        public const string PSM_DCS = "DCS";
        public const string PSM_HI = "HI";
        public const string PSM_TMED = "TMED";
        public const string PSM_DAP1 = "DAP1";
        public const string PSM_ANHY = "ANHY";
        public const string PSM_S1 = "S1";

        public static string ChangeSensorType(string strSensorType)
        {
            string strRet = strSensorType;

            if (strSensorType == ETC_PM1_31007)
                strRet = ETC_PM1;
            else if (strSensorType == ETC_PM2_31007)
                strRet = ETC_PM2;
            else if (strSensorType == ETC_PM10_31007)
                strRet = ETC_PM10;

            return strRet;
        }
    }

    public class WebServiceManager
    {
        public const string SUCESS = "success";
        public const string Header_Authorization = "Authorization";

        private string m_strSoulURL = null;
        private string m_strSoulID = null;
        private string m_strSoulPW = null;

        private string m_strToken = null;
        private string m_strRefreshtoken = null;

        private SoulbrainManager m_parent = null;

        private Dictionary<string, bool> m_dicAlarmLogChk = new Dictionary<string, bool>();

        private DateTime m_dtChkDay = DateTime.Now;
        private DateTime m_dtCreate = DateTime.Now;

        private int m_nMaxRecordID = 0;

        public WebServiceManager(SoulbrainManager parent, string strSoulURL, string strSoulID, string strSoulPW)
        {
            m_strSoulURL = strSoulURL;
            m_strSoulID = strSoulID;
            m_strSoulPW = strSoulPW;

            m_parent = parent;
        }

        public bool RequestLogin(out string strErrorMessage)
        {
            // Login 요청 정보 작성
            string strURL = "/api/login";
            strErrorMessage = null;

            Dictionary<string, string> dicHeaders = new Dictionary<string, string>();
            string strJson = "{\"userid\": \"" + m_strSoulID + "\", \"password\":\"" + m_strSoulPW + "\"}";

            // Login REST API 요청
            string strResult = SendQuery(dicHeaders, strJson, strURL, out strErrorMessage, "POST");

            if (strErrorMessage == SUCESS)
            {
                // 로그인 성공 >> 토큰 저장
                JObject jResult = JObject.Parse(strResult);
                string strToken = jResult["token"].ToString();
                string strRefreshtoken = jResult["refreshtoken"].ToString();

                m_strToken = strToken;
                m_strRefreshtoken = strRefreshtoken;
            }
            else
            {
                m_strToken = null;
                m_strRefreshtoken = null;
                return false;
            }

            return true;
        }

        public Dictionary<string, DataDevice> RequestDeviceList(List<string> etcSensorKeys, List<string> psmSensorKeys, out string strErrorMessage)
        {
            strErrorMessage = null;

            // 로그인 실패로 인해서 토큰 값이 없음.
            if (m_strToken == null)
            {
                strErrorMessage = "Token 값이 존재하지 않습니다.";
                return null;
            }                

            // Device List 요청 정보 작성
            string strURL = "/api/deviceext/list?size=1000";        // size 값은 한번 요청 시 확인할 device 갯수            

            Dictionary<string, string> dicHeaders = new Dictionary<string, string>();
            dicHeaders.Add(Header_Authorization, "Bearer " + m_strToken);

            string strJson = null;

            // Device List REST API 요청
            string strResult = SendQuery(dicHeaders, strJson, strURL, out strErrorMessage);
            if (strErrorMessage != SUCESS)
                return null;

            // 디바이스 조회 성공
            JObject jResult = JObject.Parse(strResult);
            JArray jArrDevices = (JArray)jResult["content"];

            // 조회된 디바이스가 없음
            if (jArrDevices == null || jArrDevices.Count == 0)
            {
                strErrorMessage = "조회된 디바이스가 없습니다.";
                return null;
            }

            Dictionary<string, DataDevice> dicDevices = new Dictionary<string, DataDevice>();

            // 디바이스 리스트 생성
            for (int i = 0; i < jArrDevices.Count; i++)
            {
                JObject jDevice = (JObject)jArrDevices[i];

                // 제외된 디바이스 항목
                // 파주 공장은 제외 또는 인디게이터,게이트웨이,레벨감지기_수신반 제외 또는 TEST Device 제외
                if (jDevice["organizationName"].ToString().Trim() == SoulbrainID.FACT_PAJU ||
                    jDevice["placeExt1"]?.ToString().Trim() == SoulbrainID.FACT_PAJU2 ||
                    jDevice["versionId"].ToString().Trim() == SoulbrainID.VERSION_30062 ||
                    jDevice["versionId"].ToString().Trim() == SoulbrainID.VERSION_30063 ||
                    jDevice["versionId"].ToString().Trim() == SoulbrainID.VERSION_32001 ||
                    jDevice["versionId"].ToString().Trim() == SoulbrainID.VERSION_32003 ||
                    jDevice["deviceId"].ToString().Trim() == SoulbrainID.TEST_DEVICE1 ||
                    jDevice["deviceId"].ToString().Trim() == SoulbrainID.TEST_DEVICE2)
                    continue;


                // DB에 등록된 센서만
                if (etcSensorKeys.Contains(jDevice["deviceId"].ToString().Trim()) == false &&
                    psmSensorKeys.Contains(jDevice["deviceId"].ToString().Trim()) == false)
                    continue;

                DataDevice device = null;

                device = new DataDevice();
                device.DeviceId = jDevice["deviceId"].ToString().Trim();
                device.DeviceName = jDevice["deviceName"].ToString().Trim();
                device.OrganizationName = jDevice["organizationName"].ToString().Trim();
                device.Status = jDevice["status"].ToString().Trim();
                device.VersionId = jDevice["versionId"].ToString().Trim();

                if (jDevice["placeExt1"] != null && jDevice["placeExt2"] != null && jDevice["placeExt3"] != null)
                {
                    device.PlaceExt1 = jDevice["placeExt1"].ToString().Trim();
                    device.PlaceExt2 = jDevice["placeExt2"].ToString().Trim();
                    device.PlaceExt3 = jDevice["placeExt3"].ToString().Trim();
                }
                if (jDevice["placeExt4"] != null)
                {
                    device.PlaceExt4 = jDevice["placeExt4"].ToString().Trim();
                }
                if (jDevice["placeAreaName"] != null)
                {
                    device.PlaceAreaName = jDevice["placeAreaName"].ToString().Trim();
                }

                dicDevices[device.DeviceId] = device;
            }

            return dicDevices;
        }

        /// <summary>
        /// Device 정보 및 임계치 조회
        /// </summary>
        /// <param name="dicDevices">Device 리스트</param>
        /// <returns></returns>
        public bool UpdateSensorInfos(Dictionary<string, DataDevice> dicDevices, out string strErrorMessage)
        {
            strErrorMessage = null;

            if (dicDevices == null || dicDevices.Count == 0)
            {
                strErrorMessage = "Device 리스트가 존재하지 않습니다.";
                return false;
            }

            foreach (KeyValuePair<string, DataDevice> pair in dicDevices)
            {
                DataDevice device = pair.Value;

                // 디바이스 정보 불러오기
                if (RequestSensorData(device, out strErrorMessage) == false)
                    return false;

                // 디바이스 해당 센서 임계치 정보 불러오기
                if (RequestSensorThreshold(device, out strErrorMessage) == false)
                    return false;
            }

            return true;
        }

        /// <summary>
        /// 단일 디바이스의 센서 데이터를 조회
        /// </summary>
        /// <param name="device">디바이스 정보</param>
        /// <param name="bChkAlarm">알람체크 유무</param>
        /// <param name="alarms">현재 알람 리스트</param>
        /// <returns></returns>
        public bool RequestSensorData(DataDevice device, out string strErrorMessage, bool bChkAlarm = false)
        {
            strErrorMessage = null;

            // Device Sensor Data 요청 정보 작성
            string strURL = "/api/datarecordext/" + device.DeviceId + "/latest";
            
            Dictionary<string, string> dicHeaders = new Dictionary<string, string>();
            dicHeaders.Add(Header_Authorization, "Bearer " + m_strToken);

            string strJson = null;

            // Device Sensor Data REST API 요청
            string strResult = SendQuery(dicHeaders, strJson, strURL, out strErrorMessage);
            if (strErrorMessage == SUCESS)
            {   // Device Sensor Data 조회 성공
                JArray jArrSensor = JArray.Parse(strResult);

                // 조회된 Sensor Data가 없음
                if (jArrSensor == null || jArrSensor.Count == 0)
                    return false;

                if (device.SensorDataList != null)
                {
                    device.SensorDataList.Clear();
                }

                List<DataSensor> listSensorData = GetDeviceSensorList(device, jArrSensor, bChkAlarm);
                device.SensorDataList = listSensorData;
            }
            else
            {
                strErrorMessage = $"Device Error ID: {device.DeviceId} ({strErrorMessage})";
                return false;
            }

            return true;
        }

        private List<DataSensor> GetDeviceSensorList(DataDevice device, JArray jArrSensor, bool bChkAlarm = false)
        {
            List<DataSensor> listSensorData = new List<DataSensor>();

            // 현재 알람 조회
            List<AlarmData> alarms = m_parent.GetAlarmList(out string strErrorMessage);
            if (alarms == null)
            {
                m_parent.Logger.Write(LogTypes.Error, ServerType.Soulbrain_Hancom, -1, "GetAlarmList : " + strErrorMessage);
            }

            // 버전에 따른 분류
            if (string.Compare(device.VersionId, SoulbrainID.VERSION_30064, false) == 0 ||
                string.Compare(device.VersionId, SoulbrainID.VERSION_32004, false) == 0)
            {   // B 타입
                DataSensor sensorData = new DataSensor();

                for (int i = 0; i < jArrSensor.Count; i++)
                {
                    JObject jSensor = (JObject)jArrSensor[i];

                    DataSensor sensor = new DataSensor
                    {
                        SensorId = jSensor["sensorId"].ToString().Trim(),
                        SensorName = jSensor["sensorName"].ToString().Trim(),
                        ModelName = jSensor["modelName"].ToString().Trim(),
                        SensorStatus = jSensor["sensorStatus"].ToString().Trim(),
                        Value = jSensor["value"].ToString().Trim()
                    };

                    if (string.Compare(sensor.SensorName, SoulbrainID.SENSOR_GAS_TYPE, false) == 0 ||
                        string.Compare(sensor.SensorName, SoulbrainID.SENSOR_KIND, false) == 0)
                    {
                        sensorData.SensorName = sensor.Value;

                        // H2 오타 경우 예외처리
                        if (sensorData.SensorName == "H")
                            sensorData.SensorName = SoulbrainID.PSM_H2;
                    }
                    else if (string.Compare(sensor.SensorName, SoulbrainID.ETC_Value, false) == 0)
                    {
                        sensorData.SensorId = sensor.SensorId;
                        sensorData.Value = sensor.Value;
                        sensorData.SensorStatus = sensor.SensorStatus;
                    }
                }

                // 알람 신호 체크
                if (bChkAlarm)
                    CheckAlarmData(device, sensorData, alarms);
                // 해당 센서만 추가
                listSensorData.Add(sensorData);
            }
            else if (device.VersionId == SoulbrainID.VERSION_32005)
            {   // B-2 타입
                DataSensor sensorData = new DataSensor();

                for (int i = 0; i < jArrSensor.Count; i++)
                {
                    JObject jSensor = (JObject)jArrSensor[i];

                    DataSensor sensor = new DataSensor
                    {
                        SensorId = jSensor["sensorId"].ToString().Trim(),
                        SensorName = jSensor["sensorName"].ToString().Trim(),
                        ModelName = jSensor["modelName"].ToString().Trim(),
                        SensorStatus = jSensor["sensorStatus"].ToString().Trim(),
                        Value = jSensor["value"].ToString().Trim()
                    };

                    if (string.Compare(sensor.SensorName, SoulbrainID.SENSOR_MEASURE, false) == 0)
                    {
                        sensorData.SensorName = sensor.Value;
                    }
                    else if (string.Compare(sensor.SensorName, SoulbrainID.ETC_Value, false) == 0)
                    {
                        sensorData.SensorId = sensor.SensorId;
                        sensorData.Value = sensor.Value;
                        sensorData.SensorStatus = sensor.SensorStatus;
                    }
                    else if (string.Compare(sensor.SensorName, SoulbrainID.ETC_WATER_TEMP, false) == 0)
                    {
                        // 알람 신호 체크
                        if (bChkAlarm)
                            CheckAlarmData(device, sensor, alarms);
                        // 해당 센서만 추가
                        listSensorData.Add(sensor);
                    }
                }

                // 알람 신호 체크
                if (bChkAlarm)
                    CheckAlarmData(device, sensorData, alarms);
                // 해당 센서만 추가
                listSensorData.Add(sensorData);
            }
            else if (string.Compare(device.VersionId, SoulbrainID.VERSION_30065, false) == 0)
            {   // B-3 타입
                DataSensor sensorGAS1 = new DataSensor();
                DataSensor sensorGAS2 = new DataSensor();
                DataSensor sensorGAS3 = new DataSensor();
                DataSensor sensorGAS4 = new DataSensor();
                DataSensor sensorGAS5 = new DataSensor();

                for (int i = 0; i < jArrSensor.Count; i++)
                {
                    JObject jSensor = (JObject)jArrSensor[i];

                    DataSensor sensor = new DataSensor
                    {
                        SensorId = jSensor["sensorId"].ToString().Trim(),
                        SensorName = jSensor["sensorName"].ToString().Trim(),
                        ModelName = jSensor["modelName"].ToString().Trim(),
                        SensorStatus = jSensor["sensorStatus"].ToString().Trim(),
                        Value = jSensor["value"].ToString().Trim()
                    };

                    if (string.Compare(sensor.SensorName, SoulbrainID.SENSOR_GAS_NAME1, false) == 0)
                    {
                        sensorGAS1.SensorName = sensor.Value;
                    }
                    else if (string.Compare(sensor.SensorName, SoulbrainID.SENSOR_GAS_VAL1, false) == 0)
                    {
                        sensorGAS1.SensorId = sensor.SensorId;
                        sensorGAS1.Value = sensor.Value;
                        sensorGAS1.SensorStatus = sensor.SensorStatus;
                    }
                    else if (string.Compare(sensor.SensorName, SoulbrainID.SENSOR_GAS_NAME2, false) == 0)
                    {
                        sensorGAS2.SensorName = sensor.Value;
                    }
                    else if (string.Compare(sensor.SensorName, SoulbrainID.SENSOR_GAS_VAL2, false) == 0)
                    {
                        sensorGAS2.SensorId = sensor.SensorId;
                        sensorGAS2.Value = sensor.Value;
                        sensorGAS2.SensorStatus = sensor.SensorStatus;
                    }
                    else if (string.Compare(sensor.SensorName, SoulbrainID.SENSOR_GAS_NAME3, false) == 0)
                    {
                        sensorGAS3.SensorName = sensor.Value;
                    }
                    else if (string.Compare(sensor.SensorName, SoulbrainID.SENSOR_GAS_VAL3, false) == 0)
                    {
                        sensorGAS3.SensorId = sensor.SensorId;
                        sensorGAS3.Value = sensor.Value;
                        sensorGAS3.SensorStatus = sensor.SensorStatus;
                    }
                    else if (string.Compare(sensor.SensorName, SoulbrainID.SENSOR_GAS_NAME4, false) == 0)
                    {
                        sensorGAS4.SensorName = sensor.Value;
                    }
                    else if (string.Compare(sensor.SensorName, SoulbrainID.SENSOR_GAS_VAL4, false) == 0)
                    {
                        sensorGAS4.SensorId = sensor.SensorId;
                        sensorGAS4.Value = sensor.Value;
                        sensorGAS4.SensorStatus = sensor.SensorStatus;
                    }
                    else if (string.Compare(sensor.SensorName, SoulbrainID.SENSOR_GAS_NAME5, false) == 0)
                    {
                        sensorGAS5.SensorName = sensor.Value;
                    }
                    else if (string.Compare(sensor.SensorName, SoulbrainID.SENSOR_GAS_VAL5, false) == 0)
                    {
                        sensorGAS5.SensorId = sensor.SensorId;
                        sensorGAS5.Value = sensor.Value;
                        sensorGAS5.SensorStatus = sensor.SensorStatus;
                    }
                }

                // 알람 신호 체크
                if (bChkAlarm)
                {
                    CheckAlarmData(device, sensorGAS1, alarms);
                    CheckAlarmData(device, sensorGAS2, alarms);
                    CheckAlarmData(device, sensorGAS3, alarms);
                    CheckAlarmData(device, sensorGAS4, alarms);
                    CheckAlarmData(device, sensorGAS5, alarms);
                }

                // 해당 센서만 추가
                listSensorData.Add(sensorGAS1);
                listSensorData.Add(sensorGAS2);
                listSensorData.Add(sensorGAS3);
                listSensorData.Add(sensorGAS4);
                listSensorData.Add(sensorGAS5);
            }
            else if (string.Compare(device.VersionId, SoulbrainID.VERSION_30061, false) == 0)
            {   // C 타입 - 스크러버
                List<DataSensor> temps = new List<DataSensor>();

                for (int i = 0; i < jArrSensor.Count; i++)
                {
                    JObject jSensor = (JObject)jArrSensor[i];

                    DataSensor sensor = new DataSensor
                    {
                        SensorId = jSensor["sensorId"].ToString().Trim(),
                        SensorName = jSensor["sensorName"].ToString().Trim(),
                        ModelName = jSensor["modelName"].ToString().Trim(),
                        SensorStatus = jSensor["sensorStatus"].ToString().Trim(),
                        Value = jSensor["value"].ToString().Trim()
                    };

                    if (string.Compare(sensor.SensorName, SoulbrainID.ETC_Value, false) == 0)
                    {
                        DataSensor sensorData = new DataSensor();
                        sensorData.SensorId = sensor.SensorId;
                        sensorData.SensorName = SoulbrainID.ETC_SCRUBBER;
                        sensorData.Value = sensor.Value;
                        sensorData.SensorStatus = sensor.SensorStatus;

                        // 알람 신호 체크
                        if (bChkAlarm)
                            CheckAlarmData(device, sensorData, alarms);
                        // 해당 센서만 추가
                        listSensorData.Add(sensorData);
                    }
                    else if (string.Compare(sensor.SensorName, SoulbrainID.ETC_TEMP, false) == 0)
                    {
                        // 알람 신호 체크
                        if (bChkAlarm)
                            CheckAlarmData(device, sensor, alarms);
                        // 해당 센서만 추가
                        listSensorData.Add(sensor);
                    }
                }
            }
            else if (string.Compare(device.VersionId, SoulbrainID.VERSION_32002, false) == 0)
            {   // C 타입 - HF
                List<DataSensor> temps = new List<DataSensor>();

                for (int i = 0; i < jArrSensor.Count; i++)
                {
                    JObject jSensor = (JObject)jArrSensor[i];

                    DataSensor sensor = new DataSensor
                    {
                        SensorId = jSensor["sensorId"].ToString().Trim(),
                        SensorName = jSensor["sensorName"].ToString().Trim(),
                        ModelName = jSensor["modelName"].ToString().Trim(),
                        SensorStatus = jSensor["sensorStatus"].ToString().Trim(),
                        Value = jSensor["value"].ToString().Trim()
                    };

                    if (string.Compare(sensor.SensorName, SoulbrainID.ETC_Value, false) == 0)
                    {
                        DataSensor sensorData = new DataSensor();
                        sensorData.SensorId = sensor.SensorId;
                        sensorData.SensorName = SoulbrainID.PSM_HF;
                        sensorData.Value = sensor.Value;
                        sensorData.SensorStatus = sensor.SensorStatus;

                        // 알람 신호 체크
                        if (bChkAlarm)
                            CheckAlarmData(device, sensorData, alarms);
                        // 해당 센서만 추가
                        listSensorData.Add(sensorData);
                    }
                    else if (string.Compare(sensor.SensorName, SoulbrainID.ETC_BATTERY, false) == 0 ||
                        string.Compare(sensor.SensorName, SoulbrainID.ETC_OPERATION, false) == 0)
                    {
                        // 알람 신호 체크
                        if (bChkAlarm)
                            CheckAlarmData(device, sensor, alarms);
                        // 해당 센서만 추가
                        listSensorData.Add(sensor);
                    }
                }
            }
            else
            {   // A 타입
                for (int i = 0; i < jArrSensor.Count; i++)
                {
                    JObject jSensor = (JObject)jArrSensor[i];

                    DataSensor sensor = new DataSensor
                    {
                        SensorId = jSensor["sensorId"].ToString().Trim(),
                        SensorName = jSensor["sensorName"].ToString().Trim(),
                        ModelName = jSensor["modelName"].ToString().Trim(),
                        SensorStatus = jSensor["sensorStatus"].ToString().Trim(),
                        Value = jSensor["value"].ToString().Trim()
                    };

                    // VERSION_31007 디바이스의 센서 타입 명칭이 기존 명칭과 다르다. 변환 작업
                    if (string.Compare(device.VersionId, SoulbrainID.VERSION_31007, false) == 0)
                        sensor.SensorName = SoulbrainID.ChangeSensorType(sensor.SensorName);

                    // 알람 신호 체크
                    if (bChkAlarm)
                        CheckAlarmData(device, sensor, alarms);
                    // 해당 센서만 추가
                    listSensorData.Add(sensor);
                }
            }

            return listSensorData;
        }

        private bool CheckAlarmData(DataDevice device, DataSensor sensor, List<AlarmData> alarms)
        {
            // 디버깅용,센서값,mA,접점,릴레이,가스종류,MAC,TYPE,GW_ID,종류,측정종류,기기상태,에러상태,통신상태 센서는 알람체크 제외 
            if (string.Compare(sensor.ModelName, SoulbrainID.MODEL_DEBUGGING, false) == 0 ||
                string.Compare(sensor.SensorName, SoulbrainID.SENSOR_RESULT, false) == 0 ||
                string.Compare(sensor.SensorName, SoulbrainID.ETC_mA, false) == 0 ||
                string.Compare(sensor.SensorName, SoulbrainID.ETC_Contact, false) == 0 ||
                string.Compare(sensor.SensorName, SoulbrainID.ETC_Relay, false) == 0 ||
                string.Compare(sensor.SensorName, SoulbrainID.SENSOR_GAS_TYPE, false) == 0 ||
                string.Compare(sensor.SensorName, SoulbrainID.ETC_CONNECT, false) == 0 ||
                string.Compare(sensor.SensorName, SoulbrainID.SENSOR_MAC, false) == 0 ||
                string.Compare(sensor.SensorName, SoulbrainID.SENSOR_TYPE, false) == 0 ||
                string.Compare(sensor.SensorName, SoulbrainID.SENSOR_GW_ID, false) == 0 ||
                string.Compare(sensor.SensorName, SoulbrainID.SENSOR_KIND, false) == 0 ||
                string.Compare(sensor.SensorName, SoulbrainID.SENSOR_MEASURE, false) == 0 ||
                string.Compare(sensor.SensorName, SoulbrainID.DEVICE_STATUS, false) == 0 ||
                string.Compare(sensor.SensorName, SoulbrainID.SENSOR_ERROR, false) == 0 ||
                string.Compare(sensor.SensorName, SoulbrainID.SENSOR_CH_NUM, false) == 0 ||
                string.Compare(sensor.SensorName, SoulbrainID.ETC_BLE_Count, false) == 0)
                return true;


            // TODO: 센서 알람 테스트
            //if (device.DeviceId == "BERRY40MG-00001" && sensor.SensorName == "TVOC")
            //{
            //    Console.WriteLine(device.DeviceName);
            //    sensor.SensorStatus = CommonString.STATUS_WARNING;
            //}

            AlarmData alarm = null;
            string strErrorMessage = null;

            if (alarms != null && alarms.Count > 0)
                alarm = alarms.Find(x => x.DeviceID == (device.DeviceId + "_" + sensor.SensorName));


            // 알람 리스트 중 복귀된 신호 확인
            if (alarm != null && (sensor.SensorStatus == SoulbrainID.STATUS_NORMAL || sensor.SensorStatus == SoulbrainID.STATUS_OFFLINE))
            {
                AlarmData alarmData = m_parent.GetAlarmData(device, sensor, out strErrorMessage);
                if (alarmData == null)
                {
                    m_parent.Logger.Write(LogTypes.Error, ServerType.Soulbrain_Hancom, -1, $"CheckAlarmData GetAlarmData Error ({strErrorMessage})");
                    return false;
                }
                else
                {
                    if (m_parent.SendSensorData(alarmData.SensorZoneID, alarmData.SensorType, false, alarmData.URL, out strErrorMessage) == false)
                    {
                        m_parent.Logger.Write(LogTypes.Error, ServerType.Soulbrain_Hancom, -1, $"SendSensorData Error : {strErrorMessage} (SensorType: {alarmData.SensorType.ToString()}, SensorZoneID: {alarmData.SensorZoneID.ToString()})");
                        return false;
                    }
                    else
                    {   // 알람 로그 작성
                        WriteAlarmLog(device, sensor, false);
                    }

                }
            }

            if (sensor.SensorStatus == SoulbrainID.STATUS_CAUTION || sensor.SensorStatus == SoulbrainID.STATUS_WARNING)
            {
                // 알람 발생일 경우 여기서 판단하지 말고 일단 서버로 알람 전송
                AlarmData alarmData = m_parent.GetAlarmData(device, sensor, out strErrorMessage);
                if (alarmData == null)
                {
                    m_parent.Logger.Write(LogTypes.Error, ServerType.Soulbrain_Hancom, -1, $"CheckAlarmData GetAlarmData Error ({strErrorMessage})");
                    return false;
                }
                else 
                {
                    int nAlarmLevel = SoulbrainID.LEVEL_CAUTION;
                    if (sensor.SensorStatus == SoulbrainID.STATUS_WARNING)
                        nAlarmLevel = SoulbrainID.LEVEL_WARNING;

                    if (m_parent.SendSensorData(alarmData.SensorZoneID, alarmData.SensorType, true, alarmData.URL, out strErrorMessage, nAlarmLevel) == false)
                    {
                        m_parent.Logger.Write(LogTypes.Error, ServerType.Soulbrain_Hancom, -1, $"SendSensorData Error : {strErrorMessage} (SensorType: {alarmData.SensorType.ToString()}, SensorZoneID: {alarmData.SensorZoneID.ToString()})");
                        return false;
                    }
                    else
                    {   // 알람 로그 작성
                        WriteAlarmLog(device, sensor, true);
                    }
                }
            }

            return true;
        }

        private void WriteAlarmLog(DataDevice device, DataSensor sensor, bool bIsRun)
        {
            // 로그 체크
            string strUniqueKey = device.DeviceId + "_" + sensor.SensorName;
            string strSensorStatus = sensor.SensorStatus;
            string strAlarmLog = "";

            if (m_dicAlarmLogChk.ContainsKey(strUniqueKey) == false)
            {   // 처음 작성
                m_dicAlarmLogChk[strUniqueKey] = bIsRun;

                if (bIsRun == true)
                {   // 알람 발생
                    strAlarmLog = string.Format("{0} {1} 알람이 발생하였습니다.", strUniqueKey, strSensorStatus);
                }
                else
                {   // 알람 중지
                    strAlarmLog = string.Format("{0} 알람이 중지되었습니다.", strUniqueKey);
                }

                // 로그 작성
                m_parent.Logger.Write(LogTypes.Info, ServerType.Soulbrain_Hancom, -1, strAlarmLog);
            }
            else
            {
                bool bAlarmLogChk = m_dicAlarmLogChk[strUniqueKey];

                if (bIsRun != bAlarmLogChk)
                {   // 상태 변화
                    m_dicAlarmLogChk[strUniqueKey] = bIsRun;

                    if (bIsRun == true)
                    {   // 알람 발생
                        strAlarmLog = string.Format("{0} {1} 알람이 발생하였습니다.", strUniqueKey, strSensorStatus);
                    }
                    else
                    {   // 알람 중지
                        strAlarmLog = string.Format("{0} 알람이 중지되었습니다.", strUniqueKey);
                    }

                    // 로그 작성
                    m_parent.Logger.Write(LogTypes.Info, ServerType.Soulbrain_Hancom, -1, strAlarmLog);
                    
                }
            }
        }        

        public bool RequestSensorThreshold(DataDevice device, out string strErrorMessage)
        {
            // Device Sensor Data 요청 정보 작성
            string strURL = "/api/ruleext/threshold/" + device.DeviceId;
            strErrorMessage = null;

            Dictionary<string, string> dicHeaders = new Dictionary<string, string>();
            dicHeaders.Add(Header_Authorization, "Bearer " + m_strToken);

            string strJson = null;

            // Device Sensor Data REST API 요청
            string strResult = SendQuery(dicHeaders, strJson, strURL, out strErrorMessage);

            if (strErrorMessage == SUCESS)
            {   // Device Sensor Data 조회 성공
                JArray jArrSensor = JArray.Parse(strResult);

                // 조회된 Sensor Data가 없음
                if (jArrSensor == null || jArrSensor.Count == 0)
                    return false;

                // 임계치 값 해당 센서에 넣기
                UpdateSensorThreshold(device, jArrSensor);
            }
            else
            {
                strErrorMessage = "Device Sensor Threshold REST API 실패. (Device ID: " + device.DeviceId + ", ErrorMessage: " + strErrorMessage + ")";
                return false;
            }

            return true;
        }

        private bool UpdateSensorThreshold(DataDevice device, JArray jArrSensor)
        {
            if (device == null || device.SensorDataList == null || device.SensorDataList.Count == 0 ||
                jArrSensor == null)
                return false;

            for (int i = 0; i < jArrSensor.Count; i++)
            {
                JObject jSensor = (JObject)jArrSensor[i];

                DataSensor sensor = new DataSensor();
                sensor.SensorId = jSensor["sensorId"].ToString().Trim();
                sensor.SensorName = jSensor["sensorName"].ToString().Trim();
                sensor.ModelName = jSensor["modelName"].ToString().Trim();

                sensor.NormalRange = jSensor["normalRange"].ToString().Trim();
                sensor.CautionRange = jSensor["cautionRange"].ToString().Trim();
                sensor.WarningRange = jSensor["warningRange"].ToString().Trim();


                DataSensor listSensor = device.SensorDataList.Find(x => x.SensorId == sensor.SensorId);

                if (listSensor != null)
                {
                    string strNormalRange = sensor.NormalRange;
                    string strCautionRange = sensor.CautionRange;
                    string strWarningRange = sensor.WarningRange;

                    if (strNormalRange.Contains("~") == true)
                    {   // 범위값  >> 숫자값
                        int idx = strNormalRange.IndexOf("~");

                        if (idx != -1)
                        {
                            string strTemp1 = strNormalRange.Substring(0, idx);
                            string strTemp2 = strNormalRange.Substring(idx + 1);

                            if (float.TryParse(strTemp1, out float fTemp1) && float.TryParse(strTemp2, out float fTemp2))
                            {
                                // 중간값 구하기
                                float fTemp3 = fTemp2 - fTemp1;
                                fTemp3 = fTemp3 / 2;
                                fTemp3 = fTemp1 + fTemp3;

                                strNormalRange = fTemp3.ToString("F2");
                            }
                        }
                    }

                    if (strCautionRange.Contains("~") == true)
                    {   // 범위값  >> 숫자값
                        int idx = strCautionRange.IndexOf("~");

                        if (idx != -1)
                        {
                            string strTemp1 = strCautionRange.Substring(0, idx);
                            string strTemp2 = strCautionRange.Substring(idx + 1);

                            if (float.TryParse(strTemp1, out float fTemp1) && float.TryParse(strTemp2, out float fTemp2) && float.TryParse(strNormalRange, out float fNormalRange))
                            {
                                if (fNormalRange < fTemp2)
                                {   // 기준값보다 임계치가 클 경우
                                    strCautionRange = fTemp1.ToString("F2");
                                }
                                else
                                {   // 기준값보다 임계치가 작을 경우
                                    strCautionRange = fTemp2.ToString("F2");
                                }
                            }
                        }
                    }

                    if (strWarningRange.Contains("~") == true)
                    {   // 범위값  >> 숫자값
                        int idx = strWarningRange.IndexOf("~");

                        if (idx != -1)
                        {
                            string strTemp1 = strWarningRange.Substring(0, idx);
                            string strTemp2 = strWarningRange.Substring(idx + 1);

                            if (float.TryParse(strTemp1, out float fTemp1) && float.TryParse(strTemp2, out float fTemp2) && float.TryParse(strNormalRange, out float fNormalRange))
                            {
                                if (fNormalRange < fTemp2)
                                {   // 기준값보다 임계치가 클 경우
                                    strWarningRange = fTemp1.ToString("F2");
                                }
                                else
                                {   // 기준값보다 임계치가 작을 경우
                                    strWarningRange = fTemp2.ToString("F2");
                                }
                            }
                        }
                    }
                 
                    listSensor.NormalRange = strNormalRange;
                    listSensor.CautionRange = strCautionRange;
                    listSensor.WarningRange = strWarningRange;
                }
            }

            return true;
        }

        public List<AlarmSensorData> RequestEventList(out string strErrorMessage)
        {
            strErrorMessage = null;

            List<AlarmRecord> eventList = null;
            List<AlarmSensorData> alarmSensors = null;

            // 로그인 실패로 인해서 토큰 값이 없음.
            if (m_strToken == null)
                return alarmSensors;

            try
            {
                // Device List 요청 정보 작성
                StringBuilder sb = new StringBuilder();

                // 오늘 날짜
                // 이벤트 타입은 주의 또는 경계
                // 0 페이지 1000 사이즈 조회
                //sb.AppendFormat("/api/deviceext/event/list?page=0&size=1000&sort&eventType=ALL_ALARM&optDeviceGroupName=false&optDeviceName=false&optDeviceId=false&optUserId=false&optSubOrganization=true&startDate={0}&endDate={0}", DateTime.Now.ToString("yyyy-MM-dd"));
                // 50 사이즈 조회
                sb.AppendFormat("/api/deviceext/event/list?page=0&size=50&sort&optDeviceGroupName=false&optDeviceName=false&optDeviceId=false&optUserId=false&optSubOrganization=true&startDate={0}&endDate={0}", DateTime.Now.ToString("yyyy-MM-dd"));

                Dictionary<string, string> dicHeaders = new Dictionary<string, string>();
                dicHeaders.Add(Header_Authorization, "Bearer " + m_strToken);

                string strJson = null;

                // Event List REST API 요청
                string strResult = SendQuery(dicHeaders, strJson, sb.ToString(), out strErrorMessage);

                if (strErrorMessage == SUCESS)
                {
                    // 디바이스 조회 성공
                    JObject jResult = JObject.Parse(strResult);
                    JArray jArrContents = (JArray)jResult["content"];

                    eventList = new List<AlarmRecord>();
                    alarmSensors = new List<AlarmSensorData>();

                    // 조회된 데이터가 없음
                    if (jArrContents == null || jArrContents.Count == 0)
                        return alarmSensors;

                    int nMaxRecordID = 0;
                    DateTime dtNow = DateTime.Now;

                    if ((dtNow - m_dtChkDay).TotalHours > 1)
                    {   // 한 시간 지나면 MaxRecordID 초기화
                        m_dtChkDay = dtNow;
                        m_nMaxRecordID = 0;
                    }

                    // 디바이스 리스트 생성
                    for (int i = 0; i < jArrContents.Count; i++)
                    {
                        JObject jContent = (JObject)jArrContents[i];

                        if (int.TryParse(jContent["recordId"].ToString().Trim(), out int nRecordID) == false)
                            continue;

                        // 전에 읽었던 기록은 제외
                        if (nRecordID <= m_nMaxRecordID)
                            continue;
                        else if (nMaxRecordID < nRecordID)
                            nMaxRecordID = nRecordID;



                        string strSensorName = null;
                        if (jContent["sensorName"] != null)
                            strSensorName = jContent["sensorName"].ToString().Trim();
                        else
                            Console.WriteLine("strSensorName null");

                        string strTimeCreated = jContent["timeCreated"].ToString().Trim();
                        string strEventType = jContent["eventType"].ToString().Trim();
                        string strSensorStatus = jContent["sensorStatus"].ToString().Trim();
                        DateTime dtTimeCreated = DateTime.Parse(strTimeCreated);

                        // 통신상태, 오프라인 제외
                        if (strSensorName == null || strSensorName == SoulbrainID.ETC_CONNECT ||
                            strEventType == SoulbrainID.ETC_OFFLINE || strSensorStatus == SoulbrainID.STATUS_OFFLINE ||
                             (dtTimeCreated - m_dtCreate).TotalSeconds < 0)
                            continue;


                        AlarmRecord alarmRecord = new AlarmRecord
                        {
                            RecordId = nRecordID,
                            DeviceId = jContent["deviceId"].ToString().Trim(),
                            DeviceName = jContent["deviceName"].ToString().Trim(),
                            SensorName = jContent["sensorName"].ToString().Trim(),
                            EventType = jContent["eventType"].ToString().Trim(),
                            VersionName = jContent["versionName"].ToString().Trim(),
                            SensorStatus = jContent["sensorStatus"].ToString().Trim(),
                        };

                        eventList.Add(alarmRecord);
                    }

                    // 최근 읽은 ID 값으로 업데이트
                    if (nMaxRecordID > 0)
                        m_nMaxRecordID = nMaxRecordID;


                    if (eventList.Count > 0)
                        alarmSensors = GetAlarmSensorList(eventList);

                }
                else
                {
                    strErrorMessage = "Event List REST API 실패. (" + strErrorMessage + ")";
                    return null;
                }
            }
            catch (Exception e)
            {
                strErrorMessage = $"RequestEventList Exception: {e.Message}";
                return null;
            }

            return alarmSensors;
        }

        private List<AlarmSensorData> GetAlarmSensorList(List<AlarmRecord> eventList)
        {
            if (eventList == null)
                return null;
            else if (eventList.Count == 0)
                return new List<AlarmSensorData>();

            Dictionary<string, AlarmSensorData> dicAlarmSensors = new Dictionary<string, AlarmSensorData>();

            // 역순으로 >> eventList는 최근 순으로 정렬되어 있음
            int nStartNum = eventList.Count - 1;
            //foreach (AlarmRecord record in eventList)
            for (int i = nStartNum; i >= 0; i--)
            {
                AlarmRecord record = eventList[i];

                if (string.Compare(record.VersionName, SoulbrainID.VERSION_30063_NAME, false) == 0 ||
                    string.Compare(record.VersionName, SoulbrainID.VERSION_32001_NAME, false) == 0 ||
                    string.Compare(record.VersionName, SoulbrainID.VERSION_32003_NAME, false) == 0 ||
                    string.Compare(record.SensorName, SoulbrainID.ETC_CONNECT, false) == 0)
                    continue;

                AlarmSensorData alarmSensor = null;

                // sensor_key 구하기
                // sensorType 구하기
                // sensor status 구하기

                // 버전명에 따라 분류
                if (string.Compare(record.VersionName, SoulbrainID.VERSION_30056_NAME, false) == 0 ||
                    string.Compare(record.VersionName, SoulbrainID.VERSION_31008_NAME, false) == 0)
                {
                    StringBuilder sb = new StringBuilder();
                    sb.AppendFormat("{0}_{1}", record.DeviceId, record.DeviceName);
                    string strUniqueKey = sb.ToString();

                    alarmSensor = new AlarmSensorData
                    {
                        UniqueKey = strUniqueKey,
                        SensorStatus = record.SensorStatus,
                        DeviceId = record.DeviceId,
                        VersionName = record.VersionName,
                        EventType = record.EventType
                    };
                }
                else if (string.Compare(record.VersionName, SoulbrainID.VERSION_31007_NAME, false) == 0)
                {
                    StringBuilder sb = new StringBuilder();

                    // VERSION_31007 디바이스의 센서 타입 명칭이 기존 명칭과 다르다. 변환 작업
                    record.SensorName = SoulbrainID.ChangeSensorType(record.SensorName);

                    sb.AppendFormat("{0}_{1}", record.DeviceId, record.SensorName);
                    string strUniqueKey = sb.ToString();

                    alarmSensor = new AlarmSensorData
                    {
                        UniqueKey = strUniqueKey,
                        SensorStatus = record.SensorStatus,
                        DeviceId = record.DeviceId,
                        VersionName = record.VersionName,
                        EventType = record.EventType
                    };
                }
                //else if (string.Compare(record.VersionName, SoulbrainID.VERSION_30061_NAME, false) == 0)
                //{
                //    // 디바이스가 조회되지 않음
                //}
                else if (string.Compare(record.VersionName, SoulbrainID.VERSION_30064_NAME, false) == 0 ||
                    string.Compare(record.VersionName, SoulbrainID.VERSION_32004_NAME, false) == 0 ||
                    string.Compare(record.VersionName, SoulbrainID.VERSION_32006_NAME, false) == 0)
                {
                    // 수치만 알람으로 인정
                    if (string.Compare(record.SensorName, SoulbrainID.ETC_Value, false) == 0)
                    {
                        int nIdx = record.DeviceId.IndexOf("_");
                        if (nIdx == -1)
                            continue;

                        string strSensorName = record.DeviceId.Substring(0, nIdx);
                        if (strSensorName == SoulbrainID.ETC_FLAME)
                            strSensorName = SoulbrainID.ETC_Flame;

                        StringBuilder sb = new StringBuilder();
                        sb.AppendFormat("{0}_{1}", record.DeviceId, strSensorName);
                        string strUniqueKey = sb.ToString();

                        alarmSensor = new AlarmSensorData
                        {
                            UniqueKey = strUniqueKey,
                            SensorStatus = record.SensorStatus,
                            DeviceId = record.DeviceId,
                            VersionName = record.VersionName,
                            EventType = record.EventType
                        };
                    }
                }
                //else if (string.Compare(record.VersionName, SoulbrainID.VERSION_30065_NAME, false) == 0)
                //{
                //    // 디바이스가 조회되지 않음
                //}
                else if (string.Compare(record.VersionName, SoulbrainID.VERSION_32002_NAME, false) == 0)
                {
                    StringBuilder sb = new StringBuilder();
                    sb.AppendFormat("{0}_{1}", record.DeviceId, SoulbrainID.PSM_HF);
                    string strUniqueKey = sb.ToString();

                    alarmSensor = new AlarmSensorData
                    {
                        UniqueKey = strUniqueKey,
                        SensorStatus = record.SensorStatus,
                        DeviceId = record.DeviceId,
                        VersionName = record.VersionName,
                        EventType = record.EventType
                    };
                }
                else if (string.Compare(record.VersionName, SoulbrainID.VERSION_32005_NAME, false) == 0)
                {
                    // 수치일 경우
                    if (string.Compare(record.SensorName, SoulbrainID.ETC_Value, false) == 0)
                    {
                        int nIdx = record.DeviceId.IndexOf("_");
                        if (nIdx == -1)
                            continue;

                        string strSensorName = record.DeviceId.Substring(0, nIdx);

                        StringBuilder sb = new StringBuilder();
                        sb.AppendFormat("{0}_{1}", record.DeviceId, strSensorName);
                        string strUniqueKey = sb.ToString();

                        alarmSensor = new AlarmSensorData
                        {
                            UniqueKey = strUniqueKey,
                            SensorStatus = record.SensorStatus,
                            DeviceId = record.DeviceId,
                            VersionName = record.VersionName,
                            EventType = record.EventType
                        };
                    }
                    else if (string.Compare(record.SensorName, SoulbrainID.ETC_WATER_TEMP, false) == 0)
                    {
                        StringBuilder sb = new StringBuilder();
                        sb.AppendFormat("{0}_{1}", record.DeviceId, SoulbrainID.ETC_WATER_TEMP);
                        string strUniqueKey = sb.ToString();

                        alarmSensor = new AlarmSensorData
                        {
                            UniqueKey = strUniqueKey,
                            SensorStatus = record.SensorStatus,
                            DeviceId = record.DeviceId,
                            VersionName = record.VersionName,
                            EventType = record.EventType
                        };
                    }
                }


                if (alarmSensor != null)
                    dicAlarmSensors[alarmSensor.UniqueKey] = alarmSensor;
            }

            return dicAlarmSensors.Values.ToList();
        }

        public bool SendAlarmSensorData(List<AlarmSensorData> alarmSensors, out string strErrorMessage)
        {
            strErrorMessage = null;

            if (alarmSensors == null)
            {
                strErrorMessage = "알람 데이터가 존재하지 않습니다.";
                return false;
            }                

            foreach (AlarmSensorData alarmSensorData in alarmSensors)
            {
                AlarmData alarmData = m_parent.GetAlarmData(alarmSensorData, out strErrorMessage);
                if (alarmData != null)
                {
                    bool bIsAlarm = true;
                    int? nAlarmLevel = SoulbrainID.LEVEL_CAUTION;                    

                    if (alarmSensorData.SensorStatus == SoulbrainID.STATUS_NORMAL ||
                        alarmSensorData.EventType == SoulbrainID.ETC_RETURN)
                    {
                        bIsAlarm = false;
                        nAlarmLevel = null;
                    }
                    else if (alarmSensorData.SensorStatus == SoulbrainID.STATUS_CAUTION)
                    {
                        bIsAlarm = true;
                        nAlarmLevel = SoulbrainID.LEVEL_CAUTION;
                    }
                    else if (alarmSensorData.SensorStatus == SoulbrainID.STATUS_WARNING)
                    {
                        bIsAlarm = true;
                        nAlarmLevel = SoulbrainID.LEVEL_WARNING;
                    }

                    if (m_parent.SendSensorData(alarmData.SensorZoneID, alarmData.SensorType, bIsAlarm, alarmData.URL, out strErrorMessage, nAlarmLevel) == false)
                    {
                        m_parent.Logger.Write(LogTypes.Error, m_parent.ServerType, m_parent.ServerSeqNo, $"SendSensorData Error {strErrorMessage}");
                        continue;
                    }

                    // 알람 로그 작성
                    WriteAlarmLog(alarmSensorData, bIsAlarm);
                }
                else
                {
                    m_parent.Logger.Write(LogTypes.Error, m_parent.ServerType, m_parent.ServerSeqNo, $"SendAlarmSensorData GetAlarmData Error {strErrorMessage}");
                }
            }

            return true;
        }

        public bool RequestSensorData(List<AlarmSensorData> alarmSensors, out string strErrorMessage)
        {
            strErrorMessage = null;

            if (alarmSensors == null)
            {
                strErrorMessage = "알람 데이터가 존재하지 않습니다.";
                return false;
            }                

            foreach (AlarmSensorData alarmSensor in alarmSensors)
            {
                // Device Sensor Data 요청 정보 작성
                string strURL = "/api/datarecordext/" + alarmSensor.DeviceId + "/latest";

                Dictionary<string, string> dicHeaders = new Dictionary<string, string>();
                dicHeaders.Add(Header_Authorization, "Bearer " + m_strToken);

                string strJson = null;

                // Device Sensor Data REST API 요청
                string strResult = SendQuery(dicHeaders, strJson, strURL, out strErrorMessage);

                if (strErrorMessage == SUCESS)
                {   // Device Sensor Data 조회 성공
                    JArray jArrSensor = JArray.Parse(strResult);

                    // 조회된 Sensor Data가 없음
                    if (jArrSensor == null || jArrSensor.Count == 0)
                        continue;

                    List<DataSensor> listSensorData = GetDeviceSensorList(alarmSensor, jArrSensor);
                    alarmSensor.SensorDataList = listSensorData;
                }
                else
                {                                        
                    m_parent.Logger.Write(LogTypes.Error, m_parent.ServerType, m_parent.ServerSeqNo, $"RequestSensorData SendQuery Error (Device ID: {alarmSensor.DeviceId}) : {strErrorMessage}");
                }
            }

            return true;
        }

        private List<DataSensor> GetDeviceSensorList(AlarmSensorData alarmSensorData, JArray jArrSensor)
        {
            List<DataSensor> listSensorData = new List<DataSensor>();

            if (string.Compare(alarmSensorData.VersionName, SoulbrainID.VERSION_30063_NAME, false) == 0 ||
                string.Compare(alarmSensorData.VersionName, SoulbrainID.VERSION_32001_NAME, false) == 0 ||
                string.Compare(alarmSensorData.VersionName, SoulbrainID.VERSION_32003_NAME, false) == 0)
                return listSensorData;


            // 버전에 따른 분류
            if (string.Compare(alarmSensorData.VersionName, SoulbrainID.VERSION_30064_NAME, false) == 0 ||
                string.Compare(alarmSensorData.VersionName, SoulbrainID.VERSION_32004_NAME, false) == 0 ||
                string.Compare(alarmSensorData.VersionName, SoulbrainID.VERSION_32006_NAME, false) == 0)
            {   // B 타입
                DataSensor sensorData = new DataSensor();

                for (int i = 0; i < jArrSensor.Count; i++)
                {
                    JObject jSensor = (JObject)jArrSensor[i];

                    DataSensor sensor = new DataSensor
                    {
                        SensorId = jSensor["sensorId"].ToString().Trim(),
                        SensorName = jSensor["sensorName"].ToString().Trim(),
                        ModelName = jSensor["modelName"].ToString().Trim(),
                        SensorStatus = jSensor["sensorStatus"].ToString().Trim(),
                        Value = jSensor["value"].ToString().Trim()
                    };

                    if (string.Compare(sensor.SensorName, SoulbrainID.SENSOR_GAS_TYPE, false) == 0 ||
                        string.Compare(sensor.SensorName, SoulbrainID.SENSOR_KIND, false) == 0 ||
                        string.Compare(sensor.SensorName, SoulbrainID.SENSOR_MEASURE, false) == 0)
                    {
                        sensorData.SensorName = sensor.Value;

                        // H2 오타 경우 예외처리
                        if (sensorData.SensorName == "H")
                            sensorData.SensorName = SoulbrainID.PSM_H2;
                    }
                    else if (string.Compare(sensor.SensorName, SoulbrainID.ETC_Value, false) == 0)
                    {
                        sensorData.SensorId = sensor.SensorId;
                        sensorData.Value = sensor.Value;
                        sensorData.SensorStatus = sensor.SensorStatus;
                    }
                    //else if (string.Compare(sensor.SensorName, CommonString.ETC_CONNECT, false) == 0)
                    //{
                    //    sensor.Value = sensor.SensorStatus;
                    //    // 해당 센서만 추가
                    //    listSensorData.Add(sensor);
                    //}
                }

                // 해당 센서만 추가
                listSensorData.Add(sensorData);
            }
            else if (string.Compare(alarmSensorData.VersionName, SoulbrainID.VERSION_32005_NAME, false) == 0)
            {   // B-2 타입
                DataSensor sensorData = new DataSensor();

                for (int i = 0; i < jArrSensor.Count; i++)
                {
                    JObject jSensor = (JObject)jArrSensor[i];

                    DataSensor sensor = new DataSensor
                    {
                        SensorId = jSensor["sensorId"].ToString().Trim(),
                        SensorName = jSensor["sensorName"].ToString().Trim(),
                        ModelName = jSensor["modelName"].ToString().Trim(),
                        SensorStatus = jSensor["sensorStatus"].ToString().Trim(),
                        Value = jSensor["value"].ToString().Trim()
                    };

                    if (string.Compare(sensor.SensorName, SoulbrainID.SENSOR_MEASURE, false) == 0)
                    {
                        sensorData.SensorName = sensor.Value;
                    }
                    else if (string.Compare(sensor.SensorName, SoulbrainID.ETC_Value, false) == 0)
                    {
                        sensorData.SensorId = sensor.SensorId;
                        sensorData.Value = sensor.Value;
                        sensorData.SensorStatus = sensor.SensorStatus;
                    }
                    else if (string.Compare(sensor.SensorName, SoulbrainID.ETC_WATER_TEMP, false) == 0)
                    {
                        // 해당 센서만 추가
                        listSensorData.Add(sensor);
                    }
                    //else if (string.Compare(sensor.SensorName, CommonString.ETC_CONNECT, false) == 0)
                    //{
                    //    sensor.Value = sensor.SensorStatus;
                    //    // 해당 센서만 추가
                    //    listSensorData.Add(sensor);
                    //}
                }

                // 해당 센서만 추가
                listSensorData.Add(sensorData);
            }
            //else if (string.Compare(alarmSensorData.VersionName, CommonString.VERSION_30065_NAME, false) == 0)
            //{   // B-3 타입
            //    // 디바이스가 조회되지 않음
            //}
            //else if (string.Compare(alarmSensorData.VersionName, CommonString.VERSION_30061_NAME, false) == 0)
            //{   // C 타입 - 스크러버
            //    // 디바이스가 조회되지 않음
            //}
            else if (string.Compare(alarmSensorData.VersionName, SoulbrainID.VERSION_32002_NAME, false) == 0)
            {   // C 타입 - HF
                List<DataSensor> temps = new List<DataSensor>();

                for (int i = 0; i < jArrSensor.Count; i++)
                {
                    JObject jSensor = (JObject)jArrSensor[i];

                    DataSensor sensor = new DataSensor
                    {
                        SensorId = jSensor["sensorId"].ToString().Trim(),
                        SensorName = jSensor["sensorName"].ToString().Trim(),
                        ModelName = jSensor["modelName"].ToString().Trim(),
                        SensorStatus = jSensor["sensorStatus"].ToString().Trim(),
                        Value = jSensor["value"].ToString().Trim()
                    };

                    if (string.Compare(sensor.SensorName, SoulbrainID.ETC_Value, false) == 0)
                    {
                        DataSensor sensorData = new DataSensor();
                        sensorData.SensorId = sensor.SensorId;
                        sensorData.SensorName = SoulbrainID.PSM_HF;
                        sensorData.Value = sensor.Value;
                        sensorData.SensorStatus = sensor.SensorStatus;

                        // 해당 센서만 추가
                        listSensorData.Add(sensorData);
                    }
                    else if (string.Compare(sensor.SensorName, SoulbrainID.ETC_BATTERY, false) == 0 ||
                        string.Compare(sensor.SensorName, SoulbrainID.ETC_OPERATION, false) == 0)
                    {
                        // 해당 센서만 추가
                        listSensorData.Add(sensor);
                    }
                }
            }
            else if (string.Compare(alarmSensorData.VersionName, SoulbrainID.VERSION_30056_NAME, false) == 0 ||
                    string.Compare(alarmSensorData.VersionName, SoulbrainID.VERSION_31007_NAME, false) == 0 ||
                    string.Compare(alarmSensorData.VersionName, SoulbrainID.VERSION_31008_NAME, false) == 0)
            {   // A 타입
                for (int i = 0; i < jArrSensor.Count; i++)
                {
                    JObject jSensor = (JObject)jArrSensor[i];

                    DataSensor sensor = new DataSensor
                    {
                        SensorId = jSensor["sensorId"].ToString().Trim(),
                        SensorName = jSensor["sensorName"].ToString().Trim(),
                        ModelName = jSensor["modelName"].ToString().Trim(),
                        SensorStatus = jSensor["sensorStatus"].ToString().Trim(),
                        Value = jSensor["value"].ToString().Trim()
                    };

                    // VERSION_31007 디바이스의 센서 타입 명칭이 기존 명칭과 다르다. 변환 작업
                    if (string.Compare(alarmSensorData.VersionName, SoulbrainID.VERSION_31007_NAME, false) == 0)
                        sensor.SensorName = SoulbrainID.ChangeSensorType(sensor.SensorName);

                    // 해당 센서만 추가
                    listSensorData.Add(sensor);
                }
            }

            return listSensorData;
        }

        private void WriteAlarmLog(AlarmSensorData alarmSensorData, bool bIsRun)
        {
            // 로그 체크
            string strUniqueKey = alarmSensorData.UniqueKey;
            string strSensorStatus = alarmSensorData.SensorStatus;
            string strAlarmLog = "";

            if (bIsRun == true)
            {   // 알람 발생
                strAlarmLog = string.Format("{0} {1} 알람이 발생하였습니다.", strUniqueKey, strSensorStatus);
            }
            else
            {   // 알람 중지
                strAlarmLog = string.Format("{0} 알람이 중지되었습니다.", strUniqueKey);
            }

            // 로그 작성
            m_parent.Logger.Write(LogTypes.Info, ServerType.Soulbrain_Hancom, -1, strAlarmLog);
        }

        private string SendQuery(Dictionary<string, string> dicHeaders, string strBodyJson, string strURL, out string strErrorMessage, string strMethodType = "GET")
        {
            strErrorMessage = "";
            string url = m_strSoulURL;

            if (strURL.StartsWith("/"))
                url += strURL;
            else
                url += "/" + strURL;

            HttpWebRequest request = (HttpWebRequest)WebRequest.Create(new Uri(url));
            request.Method = strMethodType;

            if (dicHeaders != null)
            {
                request.ContentType = "application/json; charset=utf-8";

                // 요청 헤더 추가
                foreach (KeyValuePair<string, string> pair in dicHeaders)
                {
                    string key = pair.Key;
                    string value = pair.Value;
                    request.Headers.Add(key, value);
                }
            }

            string strResponse = "";

            try
            {
                if (strBodyJson != null && strBodyJson != "")
                {
                    StreamWriter streamWriter = new StreamWriter(request.GetRequestStream());
                    streamWriter.Write(strBodyJson);
                    streamWriter.Flush();
                    streamWriter.Close();
                }

                HttpWebResponse wRes = (HttpWebResponse)request.GetResponse();

                Stream respPostStream = wRes.GetResponseStream();
                StreamReader readerPost = new StreamReader(respPostStream, System.Text.Encoding.UTF8);

                strResponse = readerPost.ReadToEnd().Trim();
                request.Abort();
                readerPost.Close();
                respPostStream.Close();

            }
            catch (WebException ex)
            {
                strErrorMessage = ex.Status.ToString();
                return "";
            }

            if (strResponse == null)
            {
                strErrorMessage = "Request 실패";
                return "";
            }

            strErrorMessage = SUCESS;
            return strResponse;
        }
    }
}
