using System;
using System.Collections.Generic;
using System.Text;

namespace Base.SDMS.IBLL.Request
{
    public class RequestAlarm
    {
        private int? m_siteNo = null;
        //private bool m_todayAllAlarms = false;
        private int? m_sensorType = null;
        private DateTime? m_beginDate = null;
        private DateTime? m_endDate = null;

        // 이 값이 null이면 모든 Site의 알람을 받아온다.
        public int? SiteNo
        {
            get { return m_siteNo; }
            set { m_siteNo = value; }
        }

        // 오늘 발생한 모든 알람을 받아올 것인가?(종료된 알람 포함해서)
        /*public bool TodayAllAlarms
        {
            get { return m_todayAllAlarms; }
            set { m_todayAllAlarms = value; }
        }*/

        public int? SensorType
        {
            get { return m_sensorType; }
            set { m_sensorType = value; }
        }

        public DateTime? BeginDate
        {
            get { return m_beginDate; }
            set { m_beginDate = value; }
        }

        public DateTime? EndDate
        {
            get { return m_endDate; }
            set { m_endDate = value; }
        }
    }
}
