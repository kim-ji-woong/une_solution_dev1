using System;

namespace Base.SDMS.IBLL.Request
{
    public class NotifyAlarm
    {
        private int m_nSensorZoneHistoryNo = -1;
        private DateTime? m_timeStamp = null;
        private int m_nUserNo = -1;

        public int SensorZoneHistoryNo
        {
            get { return m_nSensorZoneHistoryNo; }
            set { m_nSensorZoneHistoryNo = value; }
        }

        public DateTime? TimeStamp
        {
            get { return m_timeStamp; }
            set { m_timeStamp = value; }
        }

        public int UserNo
        {
            get { return m_nUserNo; }
            set { m_nUserNo = value; }
        }
    }
}
