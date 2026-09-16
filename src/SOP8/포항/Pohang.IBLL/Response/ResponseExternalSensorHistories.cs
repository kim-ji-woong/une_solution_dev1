using System.Collections.Generic;
using Pohang.Model;
using Response;

namespace Pohang.IBLL.Response
{
    public class ResponseExternalSensorHistories : MessageResult
    {
        private List<SensorHistory> m_sensorHistories = new List<SensorHistory>();
        
        public List<SensorHistory> SensorHistories
        {
            get { return m_sensorHistories; }
            set { m_sensorHistories = value; }
        }
        
        public ResponseExternalSensorHistories()
            : base()
        {
        }
        
        public ResponseExternalSensorHistories(bool success, string message)
            : base(success, message)
        {
        }
    }
}