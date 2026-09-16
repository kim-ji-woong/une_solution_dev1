namespace Soulbrain.BLL.Request
{
    public class RequestWaterGatherInfo
    {
        private int m_nSensorSn = 0;
        
        public int SensorSn
        {
            get { return m_nSensorSn; }
            set { m_nSensorSn = value; }
        }
    }
}