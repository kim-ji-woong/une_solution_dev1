using System;
using System.Collections.Generic;
using System.Windows.Forms;

namespace SVMSServer.SVMS
{
    using DAL;
    using Models;

    class SvmsManager : ISVMSEventOwner
    {
        #region IServer 인터페이스
        public void Start()
        {
            if (m_svmsConfig == null)
                return;

            SVMSEventReceiver receiver = new SVMSEventReceiver(this, m_siteConfig.No, m_svmsConfig.IP, m_svmsConfig.Port, m_svmsConfig.ID, m_svmsConfig.Password, m_dicCCTVSubTypes);

            m_cctvManager = new CCTVManager(this, m_dataManager, m_dataManager_Power, m_dataManager_Facility, m_nSiteNo);
            //m_alarmManager = new AlarmManager(this, receiver.DataManager);

            receiver.ConnectServer();

            m_svmsEventReceivers = new List<SVMSEventReceiver>();
            m_svmsEventReceivers.Add(receiver);

            m_cctvManager.RestartProcess();

            // 앱 시작 당일에는 자정 재접속이 즉시 트리거되지 않도록 오늘 날짜로 초기화
            m_dtLastReconnect = DateTime.Now;

            m_timer = new Timer();
            // 1초 주기
            m_timer.Interval = 1000;
            m_timer.Tick += OnTimer;
            m_timer.Start();

            OnTimer(null, null);
        }

        public void Stop()
        {
            if (m_timer != null)
            {
                m_timer.Stop();
                m_timer.Dispose();
            }
        }

        public bool IsConnected { get; }
        public Logger Logger { get; set; }
        private string m_strServerAlias = "";
        public string ServerAlias { get { return m_strServerAlias; } }
        #endregion

        private DataManager m_dataManager = null;
        private int m_nSiteNo = -1;

        // 초순수, 설비 DB 
        private DataManager m_dataManager_Power = null;
        private DataManager m_dataManager_Facility = null;

        private Datas.Site m_siteConfig = null;
        private Datas.SVMS m_svmsConfig = null;
        public Datas.SVMS SvmsConfig { get { return m_svmsConfig; } }

        private List<SVMSEventReceiver> m_svmsEventReceivers = null;
        private List<SVMSEventReceiver> m_svmsTempEventReceivers = null;
        private CCTVManager m_cctvManager = null;

        private System.Collections.Concurrent.ConcurrentQueue<Message> m_messageQueues = new System.Collections.Concurrent.ConcurrentQueue<Message>();

        private Timer m_timer = null;
        private DateTime? m_dtLastChanged = null;

        // 마지막으로 일일 재접속을 수행한 시각. 날짜가 바뀌면(자정 경과) 재접속.
        private DateTime m_dtLastReconnect = DateTime.Now;

        private Dictionary<string, int> m_dicCCTVSubTypes = new Dictionary<string, int>();

        public static string SubType_NONE = "NONE";

        public SvmsManager(DataManager dataManager, DataManager dataManager_Power, DataManager dataManager_Facility, /*string strSOPWebServerURL, */int nSiteNo, Datas.Site siteConfig, Datas.SVMS svmsConfig)
        {
            m_dataManager = dataManager;

            m_dataManager_Power = dataManager_Power;
            m_dataManager_Facility = dataManager_Facility;

            m_nSiteNo = nSiteNo;
            m_siteConfig = siteConfig;
            m_svmsConfig = svmsConfig;

            InitData();
        }

        private void InitData()
        {
            string strErrorMessage;

            Dictionary<SubType.Fields, object> dicConditions = new Dictionary<SubType.Fields, object>();
            dicConditions[SubType.Fields.sensor_ty_code] = CCTVManager.CCTV_Type_Code;

            List<SubType> subTypes = m_dataManager.GetSelectManager().SelectSubTypes(dicConditions, null, out strErrorMessage);

            m_dicCCTVSubTypes[SvmsManager.SubType_NONE] = 0;

            if (subTypes != null)
            {
                foreach (SubType subType in subTypes)
                {
                    m_dicCCTVSubTypes[subType.sensor_sub_ty_name] = subType.sensor_sub_ty_no;
                }
            }
        }

        public int GetSubType(string strSubTypeName)
        {
            int nSubType = m_dicCCTVSubTypes[SvmsManager.SubType_NONE];

            if (m_dicCCTVSubTypes.ContainsKey(strSubTypeName))
            {
                nSubType = m_dicCCTVSubTypes[strSubTypeName];
            }

            return nSubType;
        }

        private void OnTimer(object sender, EventArgs e)
        {
            DateTime dtNow = DateTime.Now;

            // === 매일 자정 SVMS 재접속(재로그인)으로 CCTV 목록 강제 갱신 ===
            // OnModifiedCamera 미동작 및 RequestCameraList 단독 호출로는 DeviceCameraListCompleted가
            // 응답하지 않는 현장 문제를 우회하기 위해, 하루 1회 풀 재로그인으로 목록을 새로 받는다.
            if (m_svmsEventReceivers != null && dtNow.Date > m_dtLastReconnect.Date)
            {
                // 1. 오늘은 처리 완료로 표시 (자정을 지난 이후 매초 재트리거되는 것 방지)
                m_dtLastReconnect = dtNow;

                foreach (SVMSEventReceiver receiver in m_svmsEventReceivers)
                {
                    // 2. 재접속 시작 (이미 진행 중이면 내부에서 건너뜀)
                    bool bStarted = receiver.Reconnect();
                    // 참고: 이 클래스에 인스턴스 프로퍼티 "Logger"가 별도로 존재하므로(위 52줄),
                    // 정적 싱글턴 Logger 클래스는 반드시 전체 이름(SVMSServer.Logger)으로 참조해야 한다.
                    SVMSServer.Logger.Instance.Write(Datas.LogTypes.Info, "SvmsManager 일일 자정 SVMS 재접속: " + (bStarted ? "시작" : "진행중 건너뜀"));
                }
            }

            // === 카메라 변경 디바운스 후 CCTVManager.Update (기존 로직) ===
            DateTime? dtLastChanged = m_dtLastChanged;

            if (dtLastChanged != null)
            {
                TimeSpan span = dtNow - (DateTime)dtLastChanged;

                if (span.TotalMinutes >= 1.0)
                {
                    // 마지막 변경 이후로 1분 이상 지났다면...
                    m_dtLastChanged = null;

                    // svms로부터 받아야 한다.
                    ICollection<CCTVData> svmsCCTVs = null;

                    if (m_svmsTempEventReceivers != null)
                    {
                        svmsCCTVs = SVMSEventReceiver.GetCCTVList(m_svmsTempEventReceivers);

                        SVMSEventReceiver.DisposeInstances(m_svmsTempEventReceivers);
                        m_svmsTempEventReceivers = null;
                    }
                    else
                        svmsCCTVs = SVMSEventReceiver.GetCCTVList(m_svmsEventReceivers);

                    if (svmsCCTVs != null)
                    {
                        m_cctvManager.Update(svmsCCTVs);
                    }
                }
            }

            //m_alarmManager.CheckAutoClose();
        }

        public bool SendSensorData(int nSensorType, int nSensorZoneNo, bool isAlarm, out string strErrorMessage)
        {
            SvmsEventHistory history = new SvmsEventHistory();

            history.sensor_zone_sn = nSensorZoneNo;
            history.sensor_ty_code = nSensorType;
            history.alarm_yn = isAlarm;
            history.process_yn = false;

            return m_dataManager.GetCreateManager().CreateSvmsEventHistory(history, out strErrorMessage) != null;
        }

        #region ISVMSEventOwner 인터페이스
        public void OnMessage(DateTime eventTime, string uniqueKey, int sensorType, string strMessage)
        {
            DateTime dtNow = DateTime.Now;
            string strTime = string.Format("{0}-{1:00}-{2:00} {3:00}:{4:00}:{5:00} ", dtNow.Year, dtNow.Month, dtNow.Day, dtNow.Hour, dtNow.Minute, dtNow.Second);

            if (sensorType != GetSubType(SubType_NONE))
            {
                m_cctvManager.SendEvent(eventTime, uniqueKey, sensorType);
            }
        }

        public void OnModifiedCamera(CCTVData cctv)
        {
            if (m_cctvManager != null)
            {
                if (m_cctvManager.UpdateCCTV(cctv))
                {
                    m_dtLastChanged = DateTime.Now;
                }
            }
        }

        public void OnAddCCTV(CCTVData cctv)
        {
            m_dtLastChanged = DateTime.Now;
        }
        #endregion

        private class Message
        {
            public DateTime EventTime;
            public string UniqueKey;
            public int SensorType;
            public string MessageString;

            public Message()
            {
            }

            public Message(DateTime eventTime, string uniqueKey, int sensorType, string message)
            {
                EventTime = eventTime;
                UniqueKey = uniqueKey;
                SensorType = sensorType;
                MessageString = message;
            }
        }
    }
}
