using System.Collections.Generic;
using Response;
using Base.SDMS.IBLL.Models;

namespace Soulbrain.BLL.Response
{
    public class ResponseAlarmEx : MessageResult
    {
        private List<AlarmDataEx> m_alarmDatas = new List<AlarmDataEx>();
        public List<AlarmDataEx> AlarmDatas
        {
            get { return m_alarmDatas; }
            set { m_alarmDatas = value; }
        }

        public ResponseAlarmEx()
            : base()
        {
        }

        public ResponseAlarmEx(bool success, string message)
            : base(success, message)
        {
        }
    }

    public class AlarmDataEx : AlarmData
    {
        private bool m_isSensorAlarm = true;

        public bool IsSensorAlarm
        {
            get { return m_isSensorAlarm; }
            set { m_isSensorAlarm = value; }
        }

        public AlarmDataEx()
        {
        }

        public AlarmDataEx(AlarmData data)
        {
            AlarmData.Copy(data, this);
        }
    }
}
