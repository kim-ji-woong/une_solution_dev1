using System.Collections.Generic;

namespace Base.SDMS.IBLL.Request
{
    public class RequestAlarmMemoList
    {
        private List<int> m_sensorZoneHistoryNos = new List<int>();

        public List<int> SensorZoneHistoryNos
        {
            get { return m_sensorZoneHistoryNos; }
            set { m_sensorZoneHistoryNos = value; }
        }
    }
}
