using System.Collections.Generic;
using Base.Model.Sensor;
using Response;

namespace Base.SDMS.IBLL.Response
{
    public class ResponseSensorServerStatus : MessageResult
    {
        private List<ServerInfo> m_sensorServers = new List<ServerInfo>();

        public List<ServerInfo> SensorServers
        {
            get { return m_sensorServers; }
            set { m_sensorServers = value; }
        }

        public ResponseSensorServerStatus()
            : base()
        {
        }

        public ResponseSensorServerStatus(bool success, string message)
            : base(success, message)
        {
        }
    }
}
