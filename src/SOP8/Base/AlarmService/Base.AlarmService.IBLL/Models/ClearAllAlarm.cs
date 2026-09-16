using System;

namespace Base.AlarmService.IBLL.Models
{
    public class ClearAllAlarm
    {
        // 특정 타입의 센서만 전체 복구하고 싶을때 사용한다.
        private int? m_sensorType = null;
        // 특정 하위타입의 센서만 전체 복구하고 싶을때 사용한다.
        private int? m_sensorSubType = null;
        // 알람시간을 서버 수신시간이 아니라 특정 시간으로 지정하고 싶을때 사용한다.
        private DateTime? m_timeStamp = null;
        // 특정 Site만 all clear 하고 싶을때 이 값을 사용한다.
        private int? m_siteNo = null;
        private int m_nUserNo = -1;

        // 특정 타입의 센서만 전체 복구하고 싶을때 사용한다.
        public int? SensorType
        {
            get { return m_sensorType; }
            set { m_sensorType = value; }
        }

        // 특정 하위타입의 센서만 전체 복구하고 싶을때 사용한다.
        public int? SensorSubType
        {
            get { return m_sensorSubType; }
            set { m_sensorSubType = value; }
        }

        // 알람시간을 서버 수신시간이 아니라 특정 시간으로 지정하고 싶을때 사용한다.
        public DateTime? TimeStamp
        {
            get { return m_timeStamp; }
            set { m_timeStamp = value; }
        }

        // 특정 Site만 all clear 하고 싶을때 이 값을 사용한다.
        public int? SiteNo
        {
            get { return m_siteNo; }
            set { m_siteNo = value; }
        }

        public int UserNo
        {
            get { return m_nUserNo; }
            set { m_nUserNo = value; }
        }
    }
}
