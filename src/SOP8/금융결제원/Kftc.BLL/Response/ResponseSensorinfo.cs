using System.Collections.Generic;
using Response;

namespace Kftc.BLL.Response
{
    public class ResponseSensorinfo : MessageResult
    {
        private List<SensorData> m_sensorDatas = new List<SensorData>();

        public List<SensorData> SensorDatas
        {
            get { return m_sensorDatas; }
            set { m_sensorDatas = value; }
        }

        public ResponseSensorinfo()
            : base()
        {
        }

        public ResponseSensorinfo(bool success, string message)
            : base(success, message)
        {
        }
    }

    public class SensorData
    {
        private string m_strPropertyName = "";
        private string m_strPropertyValue = "";
        private int? m_alarmDepth = null;

        public string PropertyName
        {
            get { return m_strPropertyName; }
            set { m_strPropertyName = value; }
        }

        public string PropertyValue
        {
            get { return m_strPropertyValue; }
            set { m_strPropertyValue = value; }
        }

        public int? AlarmDepth
        {
            get { return m_alarmDepth; }
            set { m_alarmDepth = value; }
        }

        public SensorData()
        {
        }

        public SensorData(string strPropertyName, string strPropertyValue)
        {
            m_strPropertyName = strPropertyName;
            m_strPropertyValue = strPropertyValue;
        }

        public SensorData(string strPropertyName, string strPropertyValue, int alarmDepth)
        {
            m_strPropertyName = strPropertyName;
            m_strPropertyValue = strPropertyValue;
            m_alarmDepth = alarmDepth;
        }
    }
}
