using Response;
using System.Collections.Generic;

namespace Base.SDMS.IBLL.Response
{
    public class ResponseSensorServerInfo : MessageResult
    {
        public class ServerInfo
        {
            private int sensorTypeCode = -1;
            private int? sensorSubType = null;
            private int sensorServerNo = -1;
            private bool? connected = null;

            public int SensorTypeCode
            {
                get { return sensorTypeCode; }
                set { sensorTypeCode = value; }
            }

            public int? SensorSubType
            {
                get { return sensorSubType; }
                set { sensorSubType = value; }
            }

            public int SensorServerNo
            {
                get { return sensorServerNo; }
                set { sensorServerNo = value; }
            }

            public bool? Connected
            {
                get { return connected; }
                set { connected = value; }
            }
        }

        private List<ServerInfo> servers = new List<ServerInfo>();

        public List<ServerInfo> Servers
        {
            get { return servers; }
            set { servers = value; }
        }

        public ResponseSensorServerInfo()
            : base()
        {
        }

        public ResponseSensorServerInfo(bool success, string message)
            : base(success, message)
        {
        }
    }
}
