using dnsPipeHelper;
using dnsDapperDBUtil.DataAccessLayer.IDAL;
using Base.Model.Sensor;
using Response;

namespace dnsSensorServer
{
    public class SensorServer
    {
        private IDataManager m_dataManager = null;
        private Logger m_logger = null;
        private string m_strSOPWebServerUrl = null;
        private int m_nSiteNo = -1;

        public IDataManager DataManager
        {
            get { return m_dataManager; }
        }

        public Logger Logger
        {
            get { return m_logger; }
        }

        public string SOPWebServerUrl
        {
            get { return m_strSOPWebServerUrl; }
        }

        public int SiteNo
        {
            get { return m_nSiteNo; }
        }

        public SensorServer(string strLogTag)
        {
            m_dataManager = ProcessManager.GetDataManager();
            m_logger = ProcessManager.GetLogger(strLogTag);
            m_strSOPWebServerUrl = ProcessManager.GetSOPWebServerUrl();
            m_nSiteNo = ProcessManager.GetSiteNo();
        }

        public SensorZone FindSensorZone(string strUniqueKey, out string strErrorMessage)
        {
            SensorManager sensorManager = new SensorManager(m_dataManager);
            return sensorManager.FindSensorZone(strUniqueKey, out strErrorMessage);
        }

        public MessageResult SendSensorAlarm(int sensorZoneNo, int sensorType, bool isAlarm, string strSensorValue = null, int? nAlarmDepth = null, string strSOPWebServerUrl = null)
        {
            if (strSOPWebServerUrl == null)
                strSOPWebServerUrl = m_strSOPWebServerUrl;

            AlarmManager alarmManager = new AlarmManager();
            return alarmManager.SendSensorAlarm(sensorZoneNo, sensorType, isAlarm, strSensorValue, nAlarmDepth, strSOPWebServerUrl);
        }

        public MessageResult ClearAllAlarm(int? sensorType, int? sensorSubType, int? siteNo, string strSOPWebServerUrl = null)
        {
            if (strSOPWebServerUrl == null)
                strSOPWebServerUrl = m_strSOPWebServerUrl;

            AlarmManager alarmManager = new AlarmManager();
            return alarmManager.ClearAllAlarm(sensorType, sensorSubType, siteNo, strSOPWebServerUrl);
        }

        public bool UpdateConnectionState(string strServerType, bool isConnected, out string strErrorMessage)
        {
            SensorManager sensorManager = new SensorManager(m_dataManager);
            return sensorManager.UpdateConnectionState(strServerType, isConnected, out strErrorMessage);
        }
    }
}
