using System.Collections.Generic;
using Gwangyang.Model;
using Response;

namespace Gwangyang.IBLL.Response
{
    public class ResponseExternalSensorTypes : MessageResult
    {
        private List<SensorType> m_sensorTypes = new List<SensorType>();
        
        public List<SensorType> SensorTypes
        {
            get { return m_sensorTypes; }
            set { m_sensorTypes = value; }
        }
        
        public ResponseExternalSensorTypes()
            : base()
        {
        }
        
        public ResponseExternalSensorTypes(bool success, string message)
            : base(success, message)
        {
        }
    }
}