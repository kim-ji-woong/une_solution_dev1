using System.Collections.Generic;
using Base.Model.Sensor;
using Response;

namespace Pohang.IBLL.Response
{
    public class ResponseSensorSubTypes : MessageResult
    {
        private List<SubType> m_subTypes = new List<SubType>();
        
        public List<SubType> SubTypes
        {
            get { return m_subTypes; }
            set { m_subTypes = value; }
        }
        
        public ResponseSensorSubTypes()
            : base()
        {
        }
        
        public ResponseSensorSubTypes(bool success, string message)
            : base(success, message)
        {
        }
    }
}