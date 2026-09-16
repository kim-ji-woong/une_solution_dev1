using System.Collections.Generic;

namespace DCOP.BLL.Models.Response
{
    using Model;

    public class ResponseAlarmList : MessageResult
    {
        private List<AlarmEx> m_alarms = new List<AlarmEx>();
        private int m_nDataCenterNo = -1;

        public List<AlarmEx> Alarms
        {
            get { return m_alarms; }
            set { m_alarms = value; }
        }

        public int DataCenterNo
        {
            get { return m_nDataCenterNo; }
            set { m_nDataCenterNo = value; }
        }

        public ResponseAlarmList()
            : base()
        {
        }

        public ResponseAlarmList(bool success, string message)
            : base(success, message)
        {
        }
    }

    public class AlarmEx : Alarm
    {
        private int m_nUPos = -1;

        public int UPos
        {
            get { return m_nUPos; }
            set { m_nUPos = value; }
        }

        public AlarmEx()
        {
        }

        public AlarmEx(Alarm alarm, int uPos)
        {
            this.AlarmNo = alarm.AlarmNo;
            this.AlarmType = alarm.AlarmType;
            this.AlarmTime = alarm.AlarmTime;
            this.ClearTime = alarm.ClearTime;
            this.RackNo = alarm.RackNo;
            this.ItemNo = alarm.ItemNo;
            this.UPos = uPos;
            this.ImagePath1 = alarm.ImagePath1;
            this.ImagePath2 = alarm.ImagePath2;
        }
    }
}
