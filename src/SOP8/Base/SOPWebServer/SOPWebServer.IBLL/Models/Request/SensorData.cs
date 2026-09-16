using System;
using System.Collections.Generic;

namespace SOPWebServer.IBLL.Models.Request
{
    // 알람탐지 / 알람복구
    public class SensorSignal
    {
        private int m_nHeader = -1;
        private int m_nSensorType = -1;
        private int m_nSensorZoneNo = -1;
        private int m_nSensorData = -1;
        private int? m_userNo = null;
        private int? m_alarmDepth = null;
        // 알람시간을 서버 수신시간이 아니라 특정 시간으로 지정하고 싶을때 사용한다.
        private DateTime? m_timeStamp = null;
        private string m_strSensorValue = null;
        private string m_strMemo = null;

        public int Header
        {
            get { return m_nHeader; }
            set { m_nHeader = value; }
        }

        public int SensorType
        {
            get { return m_nSensorType; }
            set { m_nSensorType = value; }
        }

        public int SensorZoneNo
        {
            get { return m_nSensorZoneNo; }
            set { m_nSensorZoneNo = value; }
        }

        public int SensorData
        {
            get { return m_nSensorData; }
            set { m_nSensorData = value; }
        }

        public int? UserNo
        {
            get { return m_userNo; }
            set { m_userNo = value; }
        }

        public int? AlarmDepth
        {
            get { return m_alarmDepth; }
            set { m_alarmDepth = value; }
        }

        // 알람시간을 서버 수신시간이 아니라 특정 시간으로 지정하고 싶을때 사용한다.
        public DateTime? TimeStamp
        {
            get { return m_timeStamp; }
            set { m_timeStamp = value; }
        }

        public string SensorValue
        {
            get { return m_strSensorValue; }
            set { m_strSensorValue = value; }
        }

        public string Memo
        {
            get { return m_strMemo; }
            set { m_strMemo = value; }
        }
    }

    // 전체복구
    public class ClearAll
    {
        // 특정 타입의 센서만 전체 복구하고 싶을때 사용한다.
        private int? m_sensorType = null;
        // 특정 하위타입의 센서만 전체 복구하고 싶을때 사용한다.
        private int? m_sensorSubType = null;
        // 알람시간을 서버 수신시간이 아니라 특정 시간으로 지정하고 싶을때 사용한다.
        private DateTime? m_timeStamp = null;
        // 특정 Site만 all clear 하고 싶을때 이 값을 사용한다.
        private int? m_siteNo = null;
        private int? m_userNo = null;

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

        public int? UserNo
        {
            get { return m_userNo; }
            set { m_userNo = value; }
        }
    }

    // 수동신고
    public class ManualReport
    {
        private int m_nSensorType = -1;
        private int? m_sensorSubType = null;
        private int m_nZoneNo = -1;
        private int? m_alarmDepth = null;
        private int m_nUserNo = -1;
        private string m_strReportPerson = null;
        private string m_strMemo = null;
        // 알람시간을 서버 수신시간이 아니라 특정 시간으로 지정하고 싶을때 사용한다.
        private DateTime? m_timeStamp = null;

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

        // 알람시간을 서버 수신시간이 아니라 특정 시간으로 지정하고 싶을때 사용한다.
        public DateTime? TimeStamp
        {
            get { return m_timeStamp; }
            set { m_timeStamp = value; }
        }
    }

    // 1. 알람 복구(수동신고 포함)
    // 2. 탐지된 알람을 실제상황으로 승격한다.(재난신고)
    public class ManualReport2
    {
        // 재난신고, 알람복구, 오작동
        public enum ReportTypes { None = -1, ReportAlarm = 0, ClearAlarm, Malfunction }

        private int m_nSensorZoneHistoryNo = -1;
        private int m_nUserNo = -1;
        private int m_nReportType = (int)ReportTypes.None;
        // 알람시간을 서버 수신시간이 아니라 특정 시간으로 지정하고 싶을때 사용한다.
        private DateTime? m_timeStamp = null;

        public int SensorZoneHistoryNo
        {
            get { return m_nSensorZoneHistoryNo; }
            set { m_nSensorZoneHistoryNo = value; }
        }

        public int UserNo
        {
            get { return m_nUserNo; }
            set { m_nUserNo = value; }
        }

        public int ReportType
        {
            get { return m_nReportType; }
            set { m_nReportType = value; }
        }

        // 알람시간을 서버 수신시간이 아니라 특정 시간으로 지정하고 싶을때 사용한다.
        public DateTime? TimeStamp
        {
            get { return m_timeStamp; }
            set { m_timeStamp = value; }
        }
    }

    public class _ClearAlarm
    {
        private int m_nHeader = -1;
        private int? m_userNo = null;
        private string m_strMemo = null;
        private DateTime? m_timeStamp = null;

        public int Header
        {
            get { return m_nHeader; }
            set { m_nHeader = value; }
        }

        public int? UserNo
        {
            get { return m_userNo; }
            set { m_userNo = value; }
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

    // 시스템을 통한 사용자 복구, 타임아웃등을 처리
    // 특정 SensorZone을 대상으로 하지 않고, SensorZoneHistory를 사용하여 알람 복구
    public class ClearAlarm : _ClearAlarm
    {
        private int m_nSensorZoneHistoryNo = -1;

        public int SensorZoneHistoryNo
        {
            get { return m_nSensorZoneHistoryNo; }
            set { m_nSensorZoneHistoryNo = value; }
        }
    }

    // 시스템을 통한 사용자 복구, 타임아웃등을 처리
    // SensorZoneHistoryNo 배열을 사용하여 알람 복구
    public class ClearAlarmList : _ClearAlarm
    {
        private List<int> m_sensorZoneHistoryNos = new List<int>();

        public List<int> SensorZoneHistoryNos
        {
            get { return m_sensorZoneHistoryNos; }
            set { m_sensorZoneHistoryNos = value; }
        }
    }

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
