using Response;

namespace SOPWebServer.IBLL.Models.Response
{
    public class ResponseSensorSignal : MessageResult
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

        public ResponseSensorSignal()
            : base()
        {
        }

        public ResponseSensorSignal(bool success, string message)
            : base(success, message)
        {
        }
    }
}
