using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace AlarmWebService.Models.Response
{
    public class ResponseAlarm
    {
        private bool m_success = false;
        private string m_strErrorMessage = "";
        private string m_strAlarmType = null;

        public bool Success
        {
            get { return m_success; }
            set { m_success = value; }
        }

        public string ErrorMessage
        {
            get { return m_strErrorMessage; }
            set { m_strErrorMessage = value; }
        }

        public string AlarmType
        {
            get { return m_strAlarmType; }
            set { m_strAlarmType = value; }
        }

        public ResponseAlarm()
        {
        }

        public ResponseAlarm(bool success, string strErrorMessage, string strAlarmType = null)
        {
            m_success = success;
            m_strErrorMessage = strErrorMessage;
            m_strAlarmType = strAlarmType;
        }
    }
}
