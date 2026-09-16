using Base.Model.History;

namespace Base.History.BLL.Models
{
    class SensorZoneHistoryDetailEx : SensorZoneDetail
    {
        private bool m_isManual = false;

        public bool IsManual
        {
            get { return m_isManual; }
            set { m_isManual = value; }
        }

        public SensorZoneHistoryDetailEx()
        {
        }

        public SensorZoneHistoryDetailEx(SensorZoneDetail sensorZoneHistoryDetail)
        {
            this.FromCopy(sensorZoneHistoryDetail);
        }
    }
}
