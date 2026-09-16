using System.Collections.Generic;
using Response;
using Base.Model.Sensor;
using Base.Model.Sensor.CCTV;

namespace Soulbrain.BLL.Response
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

    public class SensorList
    {
        private int m_nSensorTypeCode = -1;
        private string m_strSensorTypeName = "";
        private List<SensorData2> m_sensors = new List<SensorData2>();

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

        public List<SensorData2> Sensors
        {
            get { return m_sensors; }
            set { m_sensors = value; }
        }
    }

    public class SensorData2
    {
        private SensorEx m_sensor = null;
        private SensorZoneData m_sensorZoneData = null;
        private CCTV m_cctv = null;

        public SensorEx Sensor
        {
            get { return m_sensor; }
            set { m_sensor = value; }
        }

        public SensorZoneData SensorZoneData
        {
            get { return m_sensorZoneData; }
            set { m_sensorZoneData = value; }
        }

        public CCTV Cctv
        {
            get { return m_cctv; }
            set { m_cctv = value; }
        }
    }

    public class SensorEx : Sensor
    {
        private int? m_nSensorSubType = null;
        private string m_strSubTypeName = null;

        public int? SubTypeNo
        {
            get { return m_nSensorSubType; }
            set { m_nSensorSubType = value; }
        }

        public string SubTypeName
        {
            get { return m_strSubTypeName; }
            set { m_strSubTypeName = value; }
        }

        public SensorEx()
        {
        }

        public SensorEx(Sensor sensor)
        {
            this.FromCopy(sensor);
        }
    }

    public class SensorZoneData
    {
        private SensorZone m_sensorZone = null;
        private Material m_sensorMaterial = null;

        public SensorZone SensorZone
        {
            get { return m_sensorZone; }
            set { m_sensorZone = value; }
        }

        public Material SensorMaterial
        {
            get { return m_sensorMaterial; }
            set { m_sensorMaterial = value; }
        }
    }
}
