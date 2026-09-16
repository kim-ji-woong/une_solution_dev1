using System.Collections.Generic;
using Base.Model.Sensor;
using Response;

namespace Base.SDMS.IBLL.Response
{
    using Models;

    public class ResponseSensorList : MessageResult
    {
        private List<SensorList> m_sensorTypes = new List<SensorList>();
        private int m_nTotalCount = 0;

        public List<SensorList> SensorTypes
        {
            get { return m_sensorTypes; }
            set { m_sensorTypes = value; }
        }

        public int TotalCount
        {
            get { return m_nTotalCount; }
            set { m_nTotalCount = value; }
        }

        public ResponseSensorList()
            : base()
        {
        }

        public ResponseSensorList(bool success, string message)
            : base(success, message)
        {
        }

        public ResponseSensorList(bool success, string message, int errorCode)
            : base(success, message, errorCode)
        {
        }
    }

    public class SensorList
    {
        private int m_nSensorTypeCode = -1;
        private string m_strSensorTypeName = "";
        private List<SensorData> m_sensors = new List<SensorData>();

        public int SensorTypeCode
        {
            get { return m_nSensorTypeCode; }
            set { m_nSensorTypeCode = value; }
        }

        public string SensorTypeName
        {
            get { return m_strSensorTypeName; }
            set { m_strSensorTypeName = value; }
        }

        public List<SensorData> Sensors
        {
            get { return m_sensors; }
            set { m_sensors = value; }
        }
    }
}
