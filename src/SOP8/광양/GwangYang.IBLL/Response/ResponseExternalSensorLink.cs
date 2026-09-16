using System.Collections.Generic;
using Gwangyang.Model;
using Response;

namespace Gwangyang.IBLL.Response
{
    public class ResponseExternalSensorLink : MessageResult
    {
        private List<SensorLink> m_sensorLinks = new List<SensorLink>();
        
        public List<SensorLink> SensorLinks
        {
            get { return m_sensorLinks; }
            set { m_sensorLinks = value; }
        }
        
        public ResponseExternalSensorLink()
            : base()
        {
        }
        
        public ResponseExternalSensorLink (bool success, string message)
            : base(success, message)
        {
        }
    }
}