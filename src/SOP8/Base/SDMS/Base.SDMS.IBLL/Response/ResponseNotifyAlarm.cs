using Response;

namespace Base.SDMS.IBLL.Response
{
    public class ResponseNotifyAlarm : MessageResult
    {
        private int m_nSensorZoneHistoryNo = -1;
        private string m_strProcessMessage = "";

        public int SensorZoneHistoryNo
        {
            get { return m_nSensorZoneHistoryNo; }
            set { m_nSensorZoneHistoryNo = value; }
        }

        public string ProcessMessage
        {
            get { return m_strProcessMessage; }
            set { m_strProcessMessage = value; }
        }

        public ResponseNotifyAlarm()
            : base()
        {
        }

        public ResponseNotifyAlarm(bool success, string message)
            : base(success, message)
        {
        }

        public ResponseNotifyAlarm(bool success, string message, int errorCode)
            : base(success, message, errorCode)
        {
        }
    }
}
