using Base.Model.Sensor;
using Base.Model.Sensor.CCTV;

namespace Base.SDMS.IBLL.Models
{
    public class SensorData
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
}
