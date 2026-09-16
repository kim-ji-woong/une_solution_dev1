using System.Collections.Generic;
using Pohang.Model;
using Response;

namespace Pohang.IBLL.Response
{
    public class ResponseExternalSensorCategories : MessageResult
    {
        private List<SensorCategory> m_sensorCategories = new List<SensorCategory>();
        
        public List<SensorCategory> SensorCategories
        {
            get { return m_sensorCategories; }
            set { m_sensorCategories = value; }
        }
        
        public ResponseExternalSensorCategories()
            : base()
        {
        }
        
        public ResponseExternalSensorCategories(bool success, string message)
            : base(success, message)
        {
        }
    }
}