using Base.SDMS.IBLL.Models;
using System;
using System.Collections.Generic;
using Response;

namespace Base.SDMS.IBLL.Response
{
    public class ResponseAlarm : MessageResult
    {
        private List<AlarmData> m_alarmDatas = new List<AlarmData>();
        public List<AlarmData> AlarmDatas
        {
            get { return m_alarmDatas; }
            set { m_alarmDatas = value; }
        }

        /*private List<AlarmData> m_allAlarmDatas = new List<AlarmData>();
        public List<AlarmData> AllAlarmDatas
        {
            get { return m_allAlarmDatas; }
            set { m_allAlarmDatas = value; }
        }*/

        public ResponseAlarm()
            : base()
        {
        }

        public ResponseAlarm(bool success, string message)
            : base(success, message)
        {
        }

        public ResponseAlarm(bool success, string message, int errorCode)
            : base(success, message, errorCode)
        {
        }
    }
}
