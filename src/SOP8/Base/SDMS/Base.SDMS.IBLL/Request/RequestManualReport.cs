using System;

namespace Base.SDMS.IBLL.Request
{
    // 수동신고
    public class RequestManualReport
    {
        // 알람시간을 서버 수신시간이 아니라 특정 시간으로 지정하고 싶을때 사용한다.
        private DateTime? m_timeStamp = null;
        private int m_nSensorType = -1;
        private int? m_sensorSubType = null;
        private int m_nZoneNo = -1;
        private int? m_alarmDepth = null;
        private int m_nUserNo = -1;
        private string m_strReportPerson = "";
        private string m_strMemo = "";

        public DateTime? TimeStamp
        {
            get { return m_timeStamp; }
            set { m_timeStamp = value; }
        }

        public int SensorType
        {
            get { return m_nSensorType; }
            set { m_nSensorType = value; }
        }

        public int? SensorSubType
        {
            get { return m_sensorSubType; }
            set { m_sensorSubType = value; }
        }

        public int ZoneNo
        {
            get { return m_nZoneNo; }
            set { m_nZoneNo = value; }
        }

        public int? AlarmDepth
        {
            get { return m_alarmDepth; }
            set { m_alarmDepth = value; }
        }

        public int UserNo
        {
            get { return m_nUserNo; }
            set { m_nUserNo = value; }
        }

        public string ReportPerson
        {
            get { return m_strReportPerson; }
            set { m_strReportPerson = value; }
        }

        public string Memo
        {
            get { return m_strMemo; }
            set { m_strMemo = value; }
        }
    }
}
