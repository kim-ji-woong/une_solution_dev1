namespace Soulbrain.BLL.Request
{
    public class RequestDustForecastInfo
    {
        private int m_nSensorSn = 0;
        
        private int m_nSensorSubType = 0;
        
        public int SensorSn
        {
            get { return m_nSensorSn; }
            set { m_nSensorSn = value; }
        }

        public int SensorSubType
        {
            get { return m_nSensorSubType; }
            set { m_nSensorSubType = value; }
        }
    }
}