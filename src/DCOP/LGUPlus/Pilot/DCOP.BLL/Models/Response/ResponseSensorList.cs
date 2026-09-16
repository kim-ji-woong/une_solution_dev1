using System.Collections.Generic;
using DCOP.Model.Sensor;

namespace DCOP.BLL.Models.Response
{
    public class ResponseSensorList : MessageResult
    {
        private List<SensorEx> m_sensors = new List<SensorEx>();

        public List<SensorEx> Sensors
        {
            get { return m_sensors; }
            set { m_sensors = value; }
        }

        public ResponseSensorList()
            : base()
        {
        }

        public ResponseSensorList(bool success, string message)
            : base(success, message)
        {
        }
    }

    public class SensorEx : Sensor
    {
        private SensorType m_sensorType = null;

        public SensorType SensorType
        {
            get { return m_sensorType; }
            set { m_sensorType = value; }
        }

        public SensorEx()
        {
        }

        public SensorEx(Sensor sensor)
        {
            SetSensor(sensor);
        }

        public SensorEx(Sensor sensor, SensorType sensorType)
        {
            SetSensor(sensor);
            m_sensorType = sensorType;
        }

        public void SetSensor(Sensor sensor)
        {
            this.SensorNo = sensor.SensorNo;
            this.Name = sensor.Name;
            this.SensorTypeNo = sensor.SensorTypeNo;
            this.DataCenterNo = sensor.DataCenterNo;
            this.RegTime = sensor.RegTime;
            this.UpdateTime = sensor.UpdateTime;
            this.X = sensor.X;
            this.Y = sensor.Y;
            this.Z = sensor.Z;
            this.Value = sensor.Value;
        }
    }
}
