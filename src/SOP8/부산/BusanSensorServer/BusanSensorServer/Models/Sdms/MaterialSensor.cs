using System.Collections.Generic;
using Base.Model.Sdms.Sensor;

namespace BusanSensorServer.Models.Sdms
{
    public class MaterialSensor
    {
        private SensorZone m_sensorZone = null;
        private Material m_material = null;
        private List<MaterialLimitData> m_materialLimitDatas = null;
        private List<MaterialRangeLimitData> m_materialRangeLimitDatas = null;
        
        public SensorZone SensorZone
        {
            get { return m_sensorZone; }
            set { m_sensorZone = value; }
        }
        
        public Material Material
        {
            get { return m_material; }
            set { m_material = value; }
        }
        
        public List<MaterialLimitData> LimitDatas
        {
            get { return m_materialLimitDatas; }
            set { m_materialLimitDatas = value; }
        }
        
        public List<MaterialRangeLimitData> RangeLimitDatas
        {
            get { return m_materialRangeLimitDatas; }
            set { m_materialRangeLimitDatas = value; }
        }
    }
}