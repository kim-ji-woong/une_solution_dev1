using System.Collections.Generic;
using Response;

namespace Base.SDMS.IBLL.Response
{
    public class ResponseAlarmMemoList : MessageResult
    {
        public class AlarmMemo
        {
            private int m_nSensorZoneHistoryNo = -1;
            private string m_strAlarmMemo = "";

            public int SensorZoneHistoryNo
            {
                get { return m_nSensorZoneHistoryNo; }
                set { m_nSensorZoneHistoryNo = value; }
            }

            public string Memo
            {
                get { return m_strAlarmMemo; }
                set { m_strAlarmMemo = value; }
            }
        }

        private List<AlarmMemo> m_alarmMemos = new List<AlarmMemo>();

        public List<AlarmMemo> AlarmMemos
        {
            get { return m_alarmMemos; }
            set { m_alarmMemos = value; }
        }

        public ResponseAlarmMemoList()
            : base()
        {
        }

        public ResponseAlarmMemoList(bool success, string message)
            : base(success, message)
        {
        }
    }
}
