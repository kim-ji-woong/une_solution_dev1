using System;

namespace Base.History.IBLL.Models.History
{
    public class SensorDetectHistory
    {
        private DateTime m_dtBegin = new DateTime();
        private DateTime? m_dtEnd = null;
        private int? m_nSensorZoneHistoryNo = null;
        private string m_strSensorTypeName = null;
        private string m_strSensorName = null;
        private string m_strLocationName = null;
        private string m_detectStatus = null;
        private string m_strClearType = null;
        private string m_strAlarmDepthName = null;
        private string m_strSopName = null;
        private string m_strMemo = null;
        private int m_nRowNo = -1;
        // 수동신고된 알람인가?
        private bool m_isManual = false;
        private bool m_isTestSignal = false;

        private int? m_buildingGroupNo = null;
        private string m_strBuildingGroupName = null;
        private int? m_buildingNo = null;
        private string m_strBuildingName = null;
        private int? m_zoneNo = null;
        private string m_strZoneName = null;

        public DateTime BeginTime
        {
            get { return m_dtBegin; }
            set { m_dtBegin = value; }
        }

        public DateTime? EndTime
        {
            get { return m_dtEnd; }
            set { m_dtEnd = value; }
        }
        
        public int? SensorZoneHistoryNo
        {
            get { return m_nSensorZoneHistoryNo; }
            set { m_nSensorZoneHistoryNo = value; }
        }
        
        public string SensorTypeName
        {
            get { return m_strSensorTypeName; }
            set { m_strSensorTypeName = value; }
        }

        public string SensorName
        {
            get { return m_strSensorName; }
            set { m_strSensorName = value; }
        }

        public string LocationName
        {
            get { return m_strLocationName; }
            set { m_strLocationName = value; }
        }

        public string DetectStatus
        {
            get { return m_detectStatus; }
            set { m_detectStatus = value; }
        }

        public string ClearType
        {
            get { return m_strClearType; }
            set { m_strClearType = value; }
        }

        public string AlarmDepthName
        {
            get { return m_strAlarmDepthName; }
            set { m_strAlarmDepthName = value; }
        }

        public string SopName
        {
            get { return m_strSopName; }
            set { m_strSopName = value; }
        }

        public string Memo
        {
            get { return m_strMemo; }
            set { m_strMemo = value; }
        }

        public int RowNo
        {
            get { return m_nRowNo; }
            set { m_nRowNo = value; }
        }

        // 수동신고된 알람인가?
        public bool IsManual
        {
            get { return m_isManual; }
            set { m_isManual = value; }
        }

        public bool IsTestSignal
        {
            get { return m_isTestSignal; }
            set { m_isTestSignal = value; }
        }

        public int? BuildingGroupNo
        {
            get { return m_buildingGroupNo; }
            set { m_buildingGroupNo = value; }
        }

        public string BuildingGroupName
        {
            get { return m_strBuildingGroupName; }
            set { m_strBuildingGroupName = value; }
        }

        public int? BuildingNo
        {
            get { return m_buildingNo; }
            set { m_buildingNo = value; }
        }

        public string BuildingName
        {
            get { return m_strBuildingName; }
            set { m_strBuildingName = value; }
        }

        public int? ZoneNo
        {
            get { return m_zoneNo; }
            set { m_zoneNo = value; }
        }

        public string ZoneName
        {
            get { return m_strZoneName; }
            set { m_strZoneName = value; }
        }
    }
}
