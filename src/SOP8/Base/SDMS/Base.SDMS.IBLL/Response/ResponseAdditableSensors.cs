using System.Collections.Generic;
using Response;

namespace Base.SDMS.IBLL.Response
{
    public class ResponseAdditableSensors : MessageResult
    {
        private List<SensorList> m_sensorList = new List<SensorList>();

        public List<SensorList> SensorList
        {
            get { return m_sensorList; }
            set { m_sensorList = value; }
        }

        public ResponseAdditableSensors()
            : base()
        {
        }

        public ResponseAdditableSensors(bool success, string message)
            : base(success, message)
        {
        }
    }
}
