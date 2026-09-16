namespace Base.SDMS.IBLL.Request
{
    public class SaveAlarmMemo
    {
        private int m_nSensorZoneHistoryNo = -1;
        private string m_strMemo = null;

        public int SensorZoneHistoryNo
        {
            get { return m_nSensorZoneHistoryNo; }
            set { m_nSensorZoneHistoryNo = value; }
        }

        public string Memo
        {
            get { return m_strMemo; }
            set { m_strMemo = value; }
        }
    }
}
