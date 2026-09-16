using Response;
using System.Collections.Generic;

namespace SOPWebServer.IBLL.Models.Response
{
    public class ResponseSensorSignalList : MessageResult
    {
        private List<int> m_sensorZoneHistoryNos = new List<int>();
        private string m_strProcessMessage = "";

        public List<int> SensorZoneHistoryNos
        {
            get { return m_sensorZoneHistoryNos; }
            set { m_sensorZoneHistoryNos = value; }
        }

        public string ProcessMessage
        {
            get { return m_strProcessMessage; }
            set { m_strProcessMessage = value; }
        }

        public ResponseSensorSignalList()
            : base()
        {
        }

        public ResponseSensorSignalList(bool success, string message)
            : base(success, message)
        {
        }
    }
}
