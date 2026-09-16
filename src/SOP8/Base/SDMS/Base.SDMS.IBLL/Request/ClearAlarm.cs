using System;

namespace Base.SDMS.IBLL.Request
{
    public class ClearAlarm
    {
        private int m_nSensorZoneHistoryNo = -1;
        // 오작동인가? : false이면 사용자에 의한 알람복구
        private bool m_isMalfunction = false;
        private int m_nUserNo = -1;
        private string m_strMemo = null;
        private DateTime? m_timeStamp = null;

        public int SensorZoneHistoryNo
        {
            get { return m_nSensorZoneHistoryNo; }
            set { m_nSensorZoneHistoryNo = value; }
        }

        // 오작동인가? : false이면 사용자에 의한 알람복구
        public bool IsMalfunction
        {
            get { return m_isMalfunction; }
            set { m_isMalfunction = value; }
        }

        public int UserNo
        {
            get { return m_nUserNo; }
            set { m_nUserNo = value; }
        }

        public string Memo
        {
            get { return m_strMemo; }
            set { m_strMemo = value; }
        }

        public DateTime? TimeStamp
        {
            get { return m_timeStamp; }
            set { m_timeStamp = value; }
        }
    }
}
