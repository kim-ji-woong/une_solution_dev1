using Base.Model.Sensor;
using dnsDapperDBUtil.DataAccessLayer.DAL;
using IntegrationServer.Datas;
using System;
using System.Collections.Generic;
using System.Text;
using System.Threading;

namespace IntegrationServer.Servers.IoT.Soulbrain
{
    public class SoulbrainManager : IServer
    {
        private int m_nServerSeqNo = -1;
        public int ServerSeqNo { get { return m_nServerSeqNo; } }

        public int ServerType { get { return dnsData.CommonCode.SdmsSensor.ServerType.Soulbrain_Hancom; } }

        private string m_strServerAlias = "";
        public string ServerAlias { get { return m_strServerAlias; } }

        private bool m_isStarted = false;

        public bool IsConnected { get { return m_isStarted; } }

        public Logger Logger { get; set; }

        private ServerManager m_serverManager = null;
        public ServerManager GetServerManager() { return m_serverManager; }

        private Dictionary<ServerProperty, object> m_serverProperties = null;
        public Dictionary<ServerProperty, object> ServerProperties { get { return m_serverProperties; } }

        private DataManager m_dataManager = null;
        private int m_nSiteID = -1;
        private string m_strSOPWebServerURL = null;

        private bool m_shutdownThread = false;

        private WebServiceManager m_webServiceManager = null;

        private Thread m_threadWatch = null;        // 로그인 및 센서 정보 불러오기 쓰레드
        private Thread m_threadAlarm = null;        // 알람 정보 불러오기 쓰레드


        private bool m_isDataLoading = true;                            // 세션키, 디바이스 정보 읽는 중 체크

        private const int ErrorSleep = 60;                              // 쓰레드 오류 슬립타임
        private const double ThreadSleep = 0.2;                         // 정보 불러오기 슬립타임

        public SoulbrainManager(ServerManager serverManager, DataManager dataManager, string strSOPWebServerURL, int nSiteID, int nServerSeqNo, Dictionary<ServerProperty, object> serverProperties, string strServerAlias)
        {
            m_serverManager = serverManager;
            m_dataManager = (DataManager)dataManager.Clone();
            m_strSOPWebServerURL = strSOPWebServerURL;

            m_nSiteID = nSiteID;
            m_nServerSeqNo = nServerSeqNo;
            m_serverProperties = serverProperties;
            m_strServerAlias = strServerAlias;
        }

        public void Start()
        {
            if (m_serverProperties == null || m_serverProperties.Count == 0)
                return;

            string strSoulURL = null;
            string strSoulID = null;
            string strSoulPW = null;

            foreach (KeyValuePair<ServerProperty, object> item in m_serverProperties)
            {
                ServerProperty key = item.Key;

                if (item.Value == null)
                    continue;

                if (key == ServerProperty.SoulURL)
                {
                    strSoulURL = item.Value.ToString();
                }
                else if (key == ServerProperty.SoulID)
                {
                    strSoulID = item.Value.ToString();
                }
                else if (key == ServerProperty.SoulPW)
                {
                    strSoulPW = item.Value.ToString();
                }
            }

            if (strSoulURL == null || strSoulID == null || strSoulPW == null)
                return;

            m_webServiceManager = new WebServiceManager(this, strSoulURL, strSoulID, strSoulPW);

            // 정보 불러오기
            m_threadWatch = new Thread(() => WatchThread());
            m_threadWatch.Start();

            m_threadAlarm = new Thread(() => WatchAlarmThread());
            m_threadAlarm.Start();
        }

        public void Stop()
        {
            m_shutdownThread = true;
        }

        private void WatchThread()
        {
            DateTime dtCheckSensorInfo = new DateTime();    // 센서 정보 읽은 날짜 체크
            DateTime dtCheckLogin = new DateTime();         // 로그인 정보 읽은 시간 체크

            Dictionary<string, DataDevice> dicDevices = null;

            while (!m_shutdownThread)
            {
                try
                {
                    string strErrorMessage = null;
                    DateTime dtNow = DateTime.Now;                    

                    if (m_webServiceManager == null)
                    {
                        Logger.Write(LogTypes.Error, ServerType, m_nServerSeqNo, "WebServiceManager 선언되지 않았습니다.");
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
                            Logger.Write(LogTypes.Error, ServerType, m_nServerSeqNo, $"RequestLogin Error ({strErrorMessage})");
                            SleepSecond(ErrorSleep);
                            continue;
                        }
                        else if (m_shutdownThread)
                            break;

                        // 현재 등록된 센서 조회
                        List<string> etcSensorKeys = SensorDataManager.LoadSensorKeys(m_dataManager, dnsData.CommonCode.SdmsSensor.SensorType.Etc, out strErrorMessage);
                        if (etcSensorKeys == null)
                        {
                            Logger.Write(LogTypes.Error, ServerType, m_nServerSeqNo, $"LoadSensorKeys Error ({strErrorMessage})");
                            SleepSecond(ErrorSleep);
                            continue;
                        }
                        else if (m_shutdownThread)
                            break;

                        List<string> psmSensorKeys = SensorDataManager.LoadSensorKeys(m_dataManager, dnsData.CommonCode.SdmsSensor.SensorType.PSM, out strErrorMessage);
                        if (psmSensorKeys == null)
                        {
                            Logger.Write(LogTypes.Error, ServerType, m_nServerSeqNo, $"LoadSensorKeys Error ({strErrorMessage})");
                            SleepSecond(ErrorSleep);
                            continue;
                        }
                        else if (m_shutdownThread)
                            break;

                        // 디바이스 조회
                        dicDevices = m_webServiceManager.RequestDeviceList(etcSensorKeys, psmSensorKeys, out strErrorMessage);
                        if (dicDevices == null)
                        {
                            Logger.Write(LogTypes.Error, ServerType, m_nServerSeqNo, $"RequestDeviceList Error ({strErrorMessage})");
                            SleepSecond(ErrorSleep);
                            continue;
                        }
                        else if (dicDevices.Count == 0)
                        {
                            Logger.Write(LogTypes.Error, ServerType, m_nServerSeqNo, $"RequestDeviceList Error : Devices 정보가 조회되지 않았습니다.");
                            SleepSecond(ErrorSleep);
                            continue;
                        }
                        else if (m_shutdownThread)
                            break;

                        m_isDataLoading = false;
                        dtCheckLogin = DateTime.Now;
                    }

                    if (dicDevices == null || dicDevices.Count == 0)
                    {
                        Logger.Write(LogTypes.Error, ServerType, m_nServerSeqNo, $"WatchThread Error : Devices 정보가 존재하지 않습니다.");
                        SleepSecond(ErrorSleep);
                        continue;
                    }

                    foreach (KeyValuePair<string, DataDevice> pair in dicDevices)
                    {
                        if (m_shutdownThread)
                            break;

                        DataDevice data = pair.Value;

                        if (m_webServiceManager.RequestSensorData(data, out strErrorMessage, true) == false)
                        {
                            Logger.Write(LogTypes.Error, ServerType, m_nServerSeqNo, $"WatchThread RequestSensorData Error ({strErrorMessage})");
                            continue;
                        }
                        if (SensorDataManager.UpdateETCSensor(m_dataManager, data, out strErrorMessage) == false)
                        {
                            Logger.Write(LogTypes.Error, ServerType, m_nServerSeqNo, $"WatchThread UpdateETCSensor Error ({strErrorMessage})");
                            continue;
                        }

                        SleepSecond(ThreadSleep);
                    }

                    if (m_shutdownThread)
                        break;

                    // 하루에 한번 센서 임계치 정보 조회
                    if ((dtNow - dtCheckSensorInfo).TotalDays >= 1)
                    {
                        // 디바이스 정보 및 임계치 조회
                        if (m_webServiceManager.UpdateSensorInfos(dicDevices, out strErrorMessage) == false)
                        {
                            Logger.Write(LogTypes.Error, ServerType, m_nServerSeqNo, $"UpdateSensorInfos Error ({strErrorMessage})");                            
                            Thread.Sleep(ErrorSleep);
                            continue;
                        }

                        // 임계치 값 업데이트
                        if (SensorDataManager.UpdateSensorsThresholds(m_dataManager, this.Logger, dicDevices, out strErrorMessage) == false)
                        {
                            Logger.Write(LogTypes.Error, ServerType, m_nServerSeqNo, $"UpdateSensorsThresholds Error: {strErrorMessage}");
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
                    this.Logger.Write(LogTypes.Error, ServerType, m_nServerSeqNo, "WatchThread Exception : " + e.Message);                    
                    SleepSecond(ErrorSleep);
                    continue;
                }
            }
        }

        private void WatchAlarmThread()
        {
            while (!m_shutdownThread)
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
                            this.Logger.Write(LogTypes.Error, ServerType, m_nServerSeqNo, "WatchAlarmThread RequestEventList Error : " + strErrorMessage);
                            Thread.Sleep(ErrorSleep);
                            continue;
                        }

                        // 알람 발송 
                        if (m_webServiceManager.SendAlarmSensorData(alarmSensors, out strErrorMessage) == false)
                        {
                            this.Logger.Write(LogTypes.Error, ServerType, m_nServerSeqNo, "WatchAlarmThread SendAlarmSensorData Error : " + strErrorMessage);
                            Thread.Sleep(ErrorSleep);
                            continue;
                        }

                        // 알람 관련 데이터 조회
                        if (m_webServiceManager.RequestSensorData(alarmSensors, out strErrorMessage) == false)
                        {
                            this.Logger.Write(LogTypes.Error, ServerType, m_nServerSeqNo, "WatchAlarmThread RequestSensorData Error : " + strErrorMessage);
                            Thread.Sleep(ErrorSleep);
                            continue;
                        }

                        // 현재 값 업데이트
                        if (SensorDataManager.UpdateETCSensor(m_dataManager, this.Logger, alarmSensors, out strErrorMessage) == false)
                        {
                            this.Logger.Write(LogTypes.Error, ServerType, m_nServerSeqNo, "WatchAlarmThread UpdateETCSensor Error : " + strErrorMessage);
                            Thread.Sleep(ErrorSleep);
                            continue;
                        }
                    }

                    SleepSecond(ThreadSleep);
                }
                catch (Exception e)
                {
                    this.Logger.Write(LogTypes.Error, ServerType, m_nServerSeqNo, "WatchAlarmThread Exception : " + e.Message);
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

                if (m_shutdownThread)
                    break;
            }
        }

        public List<AlarmData> GetAlarmList(out string strErrorMessage)
        {
            return SensorDataManager.GetAlarmList(m_dataManager, out strErrorMessage);
        }       

        public AlarmData GetAlarmData(DataDevice device, DataSensor sensor, out string strErrorMessage)
        {
            return SensorDataManager.GetAlarmData(m_dataManager, device, sensor, m_strSOPWebServerURL, out strErrorMessage);
        }

        public AlarmData GetAlarmData(AlarmSensorData alarmSensorData, out string strErrorMessage)
        {
            return SensorDataManager.GetAlarmData(m_dataManager, alarmSensorData, m_strSOPWebServerURL, out strErrorMessage);
        }

        public bool SendSensorData(int nSensorZoneID, int nSensorType, bool bIsAlarm, string strSOPWebServerURL, out string strErrorMessage, int? nLevel = null)
        {
            // .TODO: 서버 테스트 주석처리
            strErrorMessage = null;
            //return m_serverManager.SendSensorData(nSensorZoneID, nSensorType, bIsAlarm, strSOPWebServerURL, out strErrorMessage, nLevel);
            return true;

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
