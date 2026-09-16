using System.Collections.Generic;
using Pohang.Model;
using Response;

namespace Pohang.IBLL.Response
{
    public class ResponseExternalSensorTypeSubTypes : MessageResult
    {
        Dictionary<int, List<int?>> m_sensorTypeSubTypes = new Dictionary<int, List<int?>>();
        
        public Dictionary<int, List<int?>> SensorTypeSubTypes
        {
            get { return m_sensorTypeSubTypes; }
            set { m_sensorTypeSubTypes = value; }
        }
        
        public ResponseExternalSensorTypeSubTypes()
            : base()
        {
        }
        
        public ResponseExternalSensorTypeSubTypes(bool success, string message)
            : base(success, message)
        {
        }
    }
}