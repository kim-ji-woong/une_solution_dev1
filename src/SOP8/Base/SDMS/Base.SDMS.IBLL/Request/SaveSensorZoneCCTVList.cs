using System.Collections.Generic;
using Base.Model.Sensor.CCTV;

namespace Base.SDMS.IBLL.Request
{
    public class SaveSensorZoneCCTVList
    {
        private List<SensorZoneCCTV> m_sensorZoneCCTVs = new List<SensorZoneCCTV>();

        public List<SensorZoneCCTV> SensorZoneCCTVs
        {
            get { return m_sensorZoneCCTVs; }
            set { m_sensorZoneCCTVs = value; }
        }
    }
}
