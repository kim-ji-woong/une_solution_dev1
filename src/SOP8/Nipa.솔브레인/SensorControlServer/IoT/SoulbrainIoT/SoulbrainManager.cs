using Base.Model.Spatial;
using dnsSensorServer;
using Response;
using System;
using System.Collections.Generic;
using System.Configuration;
using Base.Model.Sensor;
using System.Threading;
using System.Threading.Tasks;

namespace SoulbrainIoT
{
    public class SoulbrainManager : SensorServer
    {
        private static SoulbrainManager m_processManager = null;

        private bool m_closeApp = false;

        private string m_strSoulURL = null;
        public string SoulURL { get { return m_strSoulURL; } }

        private string m_strSoulID = null;
        public string SoulID { get { return m_strSoulID; } }

        private string m_strSoulPW = null;
        public string SoulPW { get { return m_strSoulPW; } }

        private WebServiceManager m_webServiceManager = null;

        // 전력 서비스를 위한 옵션
        private string m_strPowerSopWebServerUrl = null;
        private List<int> m_powerZoneNos = new List<int>();
        // 초순수 서비스를 위한 옵션
        private string m_strWaterSopWebServerUrl = null;
        private List<int> m_waterZoneNos = new List<int>();

        private Thread m_threadWatch = null;            // 로그인 및 센서 정보 불러오기 쓰레드
        private Thread m_threadAlarm = null;            // 알람 정보 불러오기 쓰레드

        private bool m_isDataLoading = true;            // 세션키, 디바이스 정보 읽는 중 체크

        private const int ErrorSleep = 60;              // 쓰레드 오류 슬립타임
        private const double ThreadSleep = 0.2;         // 정보 불러오기 슬립타임

        private SoulbrainManager(string strSoulURL, string strSoulID, string strSoulPW, string strPowerUrl, string strWaterUrl, List<int> powerZoneNos, List<int> waterZoneNos)
            : base("IoT/Soulbrain")
        {
            m_strSoulURL = strSoulURL;
            m_strSoulID = strSoulID;
            m_strSoulPW = strSoulPW;

            m_strPowerSopWebServerUrl = strPowerUrl;
            m_powerZoneNos = powerZoneNos;
            m_strWaterSopWebServerUrl = strWaterUrl;
            m_waterZoneNos = waterZoneNos;

            if (m_strSoulURL == null || m_strSoulID == null || m_strSoulPW == null)
            {
                this.Logger.Write("Run Error : SoulURL, SoulID, SoulPW 정보가 없습니다.");
            }
            else
            {
                m_webServiceManager = new WebServiceManager(this, m_strSoulURL, m_strSoulID, m_strSoulPW);
            }
        }

        public static SoulbrainManager MakeInstance()
        {
            string strPowerUrl = null, strWaterUrl = null;
            List<int> powerZoneNos = null, waterZoneNos = null;
            ReadOtherServiceOptions(ref strPowerUrl, ref strWaterUrl, ref powerZoneNos, ref waterZoneNos);

            string strSoulURL = ConfigurationManager.AppSettings.Get("SoulURL");
            string strSoulID = ConfigurationManager.AppSettings.Get("SoulID");
            string strSoulPW = ConfigurationManager.AppSettings.Get("SoulPW");

            return new SoulbrainManager(strSoulURL, strSoulID, strSoulPW, strPowerUrl, strWaterUrl, powerZoneNos, waterZoneNos);
        }

        private static void ReadOtherServiceOptions(ref string strPowerUrl, ref string strWaterUrl, ref List<int> powerZoneNos, ref List<int> waterZoneNos)
        {
            strPowerUrl = ReadSopWebServerUrl("Url2");
            strWaterUrl = ReadSopWebServerUrl("Url3");

            powerZoneNos = ReadZoneNos("ZoneNos2");
            waterZoneNos = ReadZoneNos("ZoneNos3");
        }

        private static string ReadSopWebServerUrl(string strTag)
        {
            string strUrl = ConfigurationManager.AppSettings.Get(strTag);

            if (strUrl == null)
                return null;

            return strUrl.Trim();
        }

        private static List<int> ReadZoneNos(string strTag)
        {
            List<int> zoneNos = new List<int>();
            string strZoneNos = ConfigurationManager.AppSettings.Get(strTag);

            if (strZoneNos == null)
                return zoneNos;

            int data;
            string[] tokens = strZoneNos.Split(",");

            foreach (string strToken in tokens)
            {
                if (int.TryParse(strToken.Trim(), out data))
                    zoneNos.Add(data);
            }

            return zoneNos;
        }

        public static void Run()
        {
            if (m_processManager == null)
            {
                m_processManager = MakeInstance();

                if (m_processManager == null)
                    return;
            }
            else
                return;

            // 정보 불러오기
            Thread threadWatch = new Thread(() => m_processManager.WatchThread());
            threadWatch.Start();

            Thread threadAlarm = new Thread(() => m_processManager.WatchAlarmThread());
            threadAlarm.Start();

            while (m_processManager.m_closeApp == false)
            {
                Thread.Sleep(1000);
            }
        }

        private void WatchThread()
        {
            DateTime dtCheckSensorInfo = new DateTime();    // 센서 정보 읽은 날짜 체크
            DateTime dtCheckLogin = new DateTime();         // 로그인 정보 읽은 시간 체크

            Dictionary<string, DataDevice> dicDevices = null;

            while (!this.m_closeApp)
            {
                try
                {
                    string strErrorMessage = null;
                    DateTime dtNow = DateTime.Now;

                    if (m_webServiceManager == null)
                    {
                        Logger.Write("WebServiceManager 선언되지 않았습니다.");
                        SleepSecond(ErrorSleep);
                        continue;
                    }

                    // 한 시간마다 로그인 및 세션 정보 얻기
                    if ((dtNow - dtCheckLogin).TotalMinutes >= 40)
                    {
                        m_isDataLoading = true;

                        // 로그인
                        if (m_webServiceManager.RequestLogin(out strErrorMessage) == false)
                        {
                            Logger.Write($"RequestLogin Error ({strErrorMessage})");
                            SleepSecond(ErrorSleep);
                            continue;
                        }
                        else if (this.m_closeApp)
                            break;
                        
                        // 현재 등록된 센서 조회
                        List<string> etcSensorKeys = SensorDataManager.LoadSensorKeys(this.DataManager, dnsData.CommonCode.SdmsSensor.SensorType.Etc, out strErrorMessage);
                        if (etcSensorKeys == null)
                        {
                            Logger.Write($"LoadSensorKeys Error ({strErrorMessage})");
                            SleepSecond(ErrorSleep);
                            continue;
                        }
                        else if (this.m_closeApp)
                            break;

                        List<string> psmSensorKeys = SensorDataManager.LoadSensorKeys(this.DataManager, dnsData.CommonCode.SdmsSensor.SensorType.PSM, out strErrorMessage);
                        if (psmSensorKeys == null)
                        {
                            Logger.Write($"LoadSensorKeys Error ({strErrorMessage})");
                            SleepSecond(ErrorSleep);
                            continue;
                        }
                        else if (this.m_closeApp)
                            break;

                        // 디바이스 조회
                        dicDevices = m_webServiceManager.RequestDeviceList(etcSensorKeys, psmSensorKeys, out strErrorMessage);
                        if (dicDevices == null)
                        {
                            Logger.Write($"RequestDeviceList Error ({strErrorMessage})");
                            SleepSecond(ErrorSleep);
                            continue;
                        }
                        else if (dicDevices.Count == 0)
                        {
                            Logger.Write($"RequestDeviceList Error : Devices 정보가 조회되지 않았습니다.");
                            SleepSecond(ErrorSleep);
                            continue;
                        }
                        else if (this.m_closeApp)
                            break;

                        m_isDataLoading = false;
                        dtCheckLogin = DateTime.Now;
                    }

                    if (dicDevices == null || dicDevices.Count == 0)
                    {
                        Logger.Write($"WatchThread Error : Devices 정보가 존재하지 않습니다.");
                        SleepSecond(ErrorSleep);
                        continue;
                    }

                    foreach (KeyValuePair<string, DataDevice> pair in dicDevices)
                    {
                        if (this.m_closeApp)
                            break;

                        DataDevice data = pair.Value;

                        if (m_webServiceManager.RequestSensorData(data, out strErrorMessage, true) == false)
                        {
                            Logger.Write($"WatchThread RequestSensorData Error ({strErrorMessage})");
                            continue;
                        }
                        if (SensorDataManager.UpdateETCSensor(this.DataManager, data, out strErrorMessage) == false)
                        {
                            Logger.Write($"WatchThread UpdateETCSensor Error ({strErrorMessage})");
                            continue;
                        }

                        SleepSecond(ThreadSleep);
                    }

                    if (this.m_closeApp)
                        break;

                    // 하루에 한번 센서 임계치 정보 조회
                    if ((dtNow - dtCheckSensorInfo).TotalDays >= 1)
                    {
                        // 디바이스 정보 및 임계치 조회
                        if (m_webServiceManager.UpdateSensorInfos(dicDevices, out strErrorMessage) == false)
                        {
                            Logger.Write($"UpdateSensorInfos Error ({strErrorMessage})");
                            Thread.Sleep(ErrorSleep);
                            continue;
                        }

                        // 임계치 값 업데이트
                        if (SensorDataManager.UpdateSensorsThresholds(this.DataManager, this.Logger, dicDevices, out strErrorMessage) == false)
                        {
                            Logger.Write($"UpdateSensorsThresholds Error: {strErrorMessage}");
                            // 1분 후 재실행
                            Thread.Sleep(ErrorSleep);
                            continue;
                        }

                        dtCheckSensorInfo = DateTime.Now;
                    }

                    SleepSecond(ThreadSleep);
                }
                catch (Exception e)
                {
                    this.Logger.Write("WatchThread Exception : " + e.Message);
                    SleepSecond(ErrorSleep);
                    continue;
                }
            }
        }

        private void WatchAlarmThread()
        {
            while (!this.m_closeApp)
            {
                try
                {
                    string strErrorMessage = null;
                    DateTime dtNow = DateTime.Now;

                    // 센서 정보 조회 중이지 않다면
                    if (m_isDataLoading == false)
                    {
                        // 이벤트 리스트 받아오기
                        List<AlarmSensorData> alarmSensors = m_webServiceManager.RequestEventList(out strErrorMessage);
                        if (alarmSensors == null)
                        {
                            this.Logger.Write("WatchAlarmThread RequestEventList Error : " + strErrorMessage);
                            Thread.Sleep(ErrorSleep);
                            continue;
                        }

                        // 알람 발송 
                        if (m_webServiceManager.SendAlarmSensorData(alarmSensors, out strErrorMessage) == false)
                        {
                            this.Logger.Write("WatchAlarmThread SendAlarmSensorData Error : " + strErrorMessage);
                            Thread.Sleep(ErrorSleep);
                            continue;
                        }

                        // 알람 관련 데이터 조회
                        if (m_webServiceManager.RequestSensorData(alarmSensors, out strErrorMessage) == false)
                        {
                            this.Logger.Write("WatchAlarmThread RequestSensorData Error : " + strErrorMessage);
                            Thread.Sleep(ErrorSleep);
                            continue;
                        }

                        // 현재 값 업데이트
                        if (SensorDataManager.UpdateETCSensor(this.DataManager, this.Logger, alarmSensors, out strErrorMessage) == false)
                        {
                            this.Logger.Write("WatchAlarmThread UpdateETCSensor Error : " + strErrorMessage);
                            Thread.Sleep(ErrorSleep);
                            continue;
                        }
                    }

                    SleepSecond(ThreadSleep);
                }
                catch (Exception e)
                {
                    this.Logger.Write("WatchAlarmThread Exception : " + e.Message);
                    SleepSecond(ErrorSleep);
                    continue;
                }
            }
        }

        private void SleepSecond(double dSleep = 1)
        {
            if (dSleep < 0.1)
                dSleep = 1;

            dSleep *= 10;

            for (int i = 0; i < dSleep; i++)
            {
                Thread.Sleep(100);

                if (this.m_closeApp)
                    break;
            }
        }

        public List<AlarmData> GetAlarmList(out string strErrorMessage)
        {
            return SensorDataManager.GetAlarmList(this.DataManager, out strErrorMessage);
        }

        public AlarmData GetAlarmData(DataDevice device, DataSensor sensor, out string strErrorMessage)
        {
            return SensorDataManager.GetAlarmData(this.DataManager, device, sensor, this.SOPWebServerUrl, out strErrorMessage);
        }

        public AlarmData GetAlarmData(AlarmSensorData alarmSensorData, out string strErrorMessage)
        {
            return SensorDataManager.GetAlarmData(this.DataManager, alarmSensorData, this.SOPWebServerUrl, out strErrorMessage);
        }

        //public bool SendSensorData(int nSensorZoneID, int nSensorType, bool bIsAlarm, string strSOPWebServerURL, out string strErrorMessage, int? nLevel = null)
        //{
        //    // .TODO: 서버 테스트 주석처리
        //    strErrorMessage = null;
        //    //return m_serverManager.SendSensorData(nSensorZoneID, nSensorType, bIsAlarm, strSOPWebServerURL, out strErrorMessage, nLevel);
        //    return true;

        //}

        // 1. 기존의 SopWebServerUrl에 신호를 보낸다.
        // 2. 전력을 위한 별도의 SopWebServerUrl이 존재하면 그쪽으로도 신호를 보낸다.(단, 전력용 ZoneNo인지 확인해야 한다.)
        // 3. 초순수를 위한 별도의 SopWebServerUrl이 존재하면 그쪽으로도 신호를 보낸다.(단, 초순수용 ZoneNo인지 확인해야 한다.)
        public bool SendSensorData(int sensorZoneNo, int sensorType, bool isAlarm, out string strErrorMessage, int? nLevel = null)
        {
            // 동기 호출
            // Normal SopWebServer
            bool result = SendSensorData(sensorZoneNo, sensorType, isAlarm, null, nLevel, out strErrorMessage);

            // 비동기 호출
            Task.Run(() =>
            {
                int? zoneNo = GetZoneNoFromSensorZoneNo(sensorZoneNo);

                // 전력 SopWebServer
                if (CheckZoneNo(zoneNo, m_strPowerSopWebServerUrl, m_powerZoneNos))
                {
                    string strTemp;
                    SendSensorData(sensorZoneNo, sensorType, isAlarm, m_strPowerSopWebServerUrl, nLevel, out strTemp);
                }

                // 초순수 SopWebServer(비동기 호출)
                if (CheckZoneNo(zoneNo, m_strWaterSopWebServerUrl, m_waterZoneNos))
                {
                    string strTemp;
                    SendSensorData(sensorZoneNo, sensorType, isAlarm, m_strWaterSopWebServerUrl, nLevel, out strTemp);
                }
            }
            );

            return result;
            //MessageResult result = SendSensorAlarm(sensorZoneNo, sensorType, isAlarm, null, nLevel);

            //if (result.Success)
            //    strErrorMessage = null;
            //else
            //    strErrorMessage = result.Message;

            //return result.Success;
        }

        private bool CheckZoneNo(int? zoneNo, string strSopWebServerUrl, List<int> zoneNos)
        {
            if (zoneNo == null || strSopWebServerUrl == null || strSopWebServerUrl.Trim().Length == 0 || zoneNos == null)
                return false;

            return zoneNos.Contains((int)zoneNo);
        }

        private bool SendSensorData(int sensorZoneNo, int sensorType, bool isAlarm, string strSopWebServerUrl, int? level, out string strErrorMessage)
        {
            MessageResult result = SendSensorAlarm(sensorZoneNo, sensorType, isAlarm, null, level, strSopWebServerUrl);

            if (result.Success)
                strErrorMessage = null;
            else
                strErrorMessage = result.Message;

            return result.Success;
        }

        private int? GetZoneNoFromSensorZoneNo(int sensorZoneNo)
        {
            string strSQL = string.Format("Select d.{4} ZoneNo from {0} a inner join {1} b on a.{6} = b.{7} inner join {2} c on b.{7} = c.{8} inner join {3} d on c.{5} = d.{4} and a.{9} = {10}",
                SensorZone.TableName, EquipmentZone.TableName, EquipmentZoneLinkedZone.TableName, Zone.TableName,
                Zone.Fields.zone_sn,
                EquipmentZoneLinkedZone.Fields.zone_sn,
                SensorZone.Fields.eqp_zone_sn,
                EquipmentZone.Fields.eqp_zone_sn,
                EquipmentZoneLinkedZone.Fields.eqp_zone_sn,
                SensorZone.Fields.sensor_zone_sn,
                sensorZoneNo);

            string strErrorMessage;
            dynamic result = DataManager.GetSelect().SelectFirst(strSQL, out strErrorMessage);

            if (result == null)
            {
                if (strErrorMessage != null)
                    System.Diagnostics.Trace.WriteLine("GetZoneNoFromSensorZone Error : " + strErrorMessage);
                return null;
            }

            return result.ZoneNo;
        }
    }

    public class DataDevice
    {
        string m_strDeviceId = "";
        string m_strDeviceName = "";
        string m_strOrganizationName = "";
        string m_strStatus = "NORMAL";
        string m_strPlaceExt1 = "";
        string m_strPlaceExt2 = "";
        string m_strPlaceExt3 = "";
        string m_strPlaceExt4 = "";
        string m_strPlaceAreaName = "";
        string m_strVersionId = "";
        List<DataSensor> m_listSensorData = null;

        public string DeviceId
        {
            get { return m_strDeviceId; }
            set { m_strDeviceId = value; }
        }

        public string DeviceName
        {
            get { return m_strDeviceName; }
            set { m_strDeviceName = value; }
        }

        public string OrganizationName
        {
            get { return m_strOrganizationName; }
            set { m_strOrganizationName = value; }
        }

        public string Status
        {
            get { return m_strStatus; }
            set { m_strStatus = value; }
        }

        public string PlaceExt1
        {
            get { return m_strPlaceExt1; }
            set { m_strPlaceExt1 = value; }
        }

        public string PlaceExt2
        {
            get { return m_strPlaceExt2; }
            set { m_strPlaceExt2 = value; }
        }

        public string PlaceExt3
        {
            get { return m_strPlaceExt3; }
            set { m_strPlaceExt3 = value; }
        }

        public string PlaceExt4
        {
            get { return m_strPlaceExt4; }
            set { m_strPlaceExt4 = value; }
        }

        public string PlaceAreaName
        {
            get { return m_strPlaceAreaName; }
            set { m_strPlaceAreaName = value; }
        }

        public string VersionId
        {
            get { return m_strVersionId; }
            set { m_strVersionId = value; }
        }

        public List<DataSensor> SensorDataList
        {
            get { return m_listSensorData; }
            set { m_listSensorData = value; }
        }
    }

    public class DataSensor
    {
        public enum RequestType { Data = 0, Threshold }

        string m_strSensorId = "";
        string m_strSensorName = "";
        string m_strModelName = "";
        string m_strSensorStatus = "NORMAL";
        string m_strValue = "";

        string m_strNormalRange = "";
        string m_strCautionRange = "";
        string m_strWarningRange = "";

        //public DataSensor(string strSensorId, string strSensorName, string strModelName, string strSensorStatus, string strValue)
        //{
        //    this.SensorId = strSensorId;
        //    this.SensorName = strSensorName;
        //    this.ModelName = strModelName;
        //    this.SensorStatus = strSensorStatus;
        //    this.Value = strValue;
        //}

        /// <summary>
        /// Sensor ID
        /// </summary>
        public string SensorId
        {
            get { return m_strSensorId; }
            set { m_strSensorId = value; }
        }
        /// <summary>
        /// Sensor 이름
        /// </summary>
        public string SensorName
        {
            get { return m_strSensorName; }
            set { m_strSensorName = value; }
        }
        /// <summary>
        /// Sensor 모델이름
        /// </summary>
        public string ModelName
        {
            get { return m_strModelName; }
            set { m_strModelName = value; }
        }
        /// <summary>
        /// Sensor 상태값
        /// </summary>
        public string SensorStatus
        {
            get { return m_strSensorStatus; }
            set { m_strSensorStatus = value; }
        }
        /// <summary>
        /// Sensor 수치값
        /// </summary>
        public string Value
        {
            get { return m_strValue; }
            set { m_strValue = value; }
        }


        /// <summary>
        /// Sensor Normal 임계치
        /// </summary>
        public string NormalRange
        {
            get { return m_strNormalRange; }
            set { m_strNormalRange = value; }
        }
        /// <summary>
        /// Sensor Caution 임계치
        /// </summary>
        public string CautionRange
        {
            get { return m_strCautionRange; }
            set { m_strCautionRange = value; }
        }
        /// <summary>
        /// Sensor Warning 임계치
        /// </summary>
        public string WarningRange
        {
            get { return m_strWarningRange; }
            set { m_strWarningRange = value; }
        }
    }

    public class AlarmData
    {
        private string m_strDeviceId = "";
        private string m_strSensorId = "";
        private int m_nSensorType = -1;
        //private int m_nSensorTagID = -1;
        private int m_nSensorZoneID = -1;
        private bool m_bIsAlarm = false;
        private string m_strUrl = "";

        private string m_strDeviceName = "";
        private int m_nOrgSensorID = -1;
        private string m_strSensorName = "";

        public string DeviceID
        {
            get { return m_strDeviceId; }
            set { m_strDeviceId = value; }
        }

        public string DeviceName
        {
            get { return m_strDeviceName; }
            set { m_strDeviceName = value; }
        }

        public string SensorID
        {
            get { return m_strSensorId; }
            set { m_strSensorId = value; }
        }

        public string SensorName
        {
            get { return m_strSensorName; }
            set { m_strSensorName = value; }
        }

        public int SensorType
        {
            get { return m_nSensorType; }
            set { m_nSensorType = value; }
        }

        //public int SensorTagID
        //{
        //    get { return m_nSensorTagID; }
        //    set { m_nSensorTagID = value; }
        //}

        public int SensorZoneID
        {
            get { return m_nSensorZoneID; }
            set { m_nSensorZoneID = value; }
        }

        public bool IsAlarm
        {
            get { return m_bIsAlarm; }
            set { m_bIsAlarm = value; }
        }

        public string URL
        {
            get { return m_strUrl; }
            set { m_strUrl = value; }
        }

        public int OrgSensorID
        {
            get { return m_nOrgSensorID; }
            set { m_nOrgSensorID = value; }
        }
    }

    public class AlarmSensorData
    {
        //public int? FacilityType { get; set; }
        public string UniqueKey { get; set; }
        public string SensorStatus { get; set; }

        /// <summary>
        /// 해당 알람 센서의 디바이스ID
        /// </summary>
        public string DeviceId { get; set; }
        /// <summary>
        /// 해당 알람 센서의 디바이스 버전명
        /// </summary>
        public string VersionName { get; set; }
        /// <summary>
        /// 해당 알람 센서의 디바이스에 대한 데이터
        /// </summary>
        public List<DataSensor> SensorDataList { get; set; }
        public string EventType { get; set; }
    }

    public class AlarmRecord
    {
        public int RecordId { get; set; }
        public string DeviceId { get; set; }
        public string DeviceName { get; set; }
        public string SensorName { get; set; }
        public string EventType { get; set; }
        public string VersionName { get; set; }
        public string SensorStatus { get; set; }
        public DateTime TimeCreated { get; set; }
    }
}
