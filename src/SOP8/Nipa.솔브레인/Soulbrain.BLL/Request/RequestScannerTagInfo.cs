namespace Soulbrain.BLL.Request
{
    public class RequestScannerTagInfo
    {
        private int m_nSensorZoneHistoryNo = -1;
        
        public int SensorZoneHistoryNo
        {
            get { return m_nSensorZoneHistoryNo; }
            set { m_nSensorZoneHistoryNo = value; }
        }
    }
}