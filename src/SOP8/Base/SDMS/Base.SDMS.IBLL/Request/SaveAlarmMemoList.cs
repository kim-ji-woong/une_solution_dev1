using System.Collections.Generic;

namespace Base.SDMS.IBLL.Request
{
    public class SaveAlarmMemoList
    {
        private List<int> m_sensorZoneHistoryNos = new List<int>();
        private string m_strAlarmMemo = "";

        public List<int> SensorZoneHistoryNos
        {
            get { return m_sensorZoneHistoryNos; }
            set { m_sensorZoneHistoryNos = value; }
        }

        public string Memo
        {
            get { return m_strAlarmMemo; }
            set { m_strAlarmMemo = value; }
        }
    }
}
