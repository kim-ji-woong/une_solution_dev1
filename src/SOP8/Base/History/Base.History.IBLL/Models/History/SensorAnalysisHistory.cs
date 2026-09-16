using System;

namespace Base.History.IBLL.Models.History
{
    public class SensorAnalysisHistory : IComparable
    {
        private string m_strSensorTypeName = null;
        private string m_strSensorName = null;
        private string m_strLocationName = null;
        private int m_detectCount = 0;
        private int m_malfunctionCount = 0;
        private int m_sensorClearCount = 0;
        private int m_userResetCount = 0;
        private double m_malfunctionRatio = 0;
        private double m_accumulationRatio = 0;
        private int m_nRowNo = -1;

        private int? m_buildingGroupNo = null;
        private string m_strBuildingGroupName = null;
        private int? m_buildingNo = null;
        private string m_strBuildingName = null;
        private int? m_zoneNo = null;
        private string m_strZoneName = null;

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

        public int DetectCount
        {
            get { return m_detectCount; }
            set { m_detectCount = value; }
        }

        public int MalfunctionCount
        {
            get { return m_malfunctionCount; }
            set { m_malfunctionCount = value; }
        }

        public int SensorClearCount
        {
            get { return m_sensorClearCount; }
            set { m_sensorClearCount = value; }
        }

        public int UserResetCount
        {
            get { return m_userResetCount; }
            set { m_userResetCount = value; }
        }

        public double MalfunctionRatio
        {
            get { return m_malfunctionRatio; }
            set { m_malfunctionRatio = value; }
        }

        // 누적탐지율(%)
        public double AccumulationRatio
        {
            get { return m_accumulationRatio; }
            set { m_accumulationRatio = value; }
        }

        public int RowNo
        {
            get { return m_nRowNo; }
            set { m_nRowNo = value; }
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

        public int CompareTo(object obj)
        {
            SensorAnalysisHistory history = (SensorAnalysisHistory)obj;

            if (this.DetectCount > history.DetectCount)
                return -1;
            else if (this.DetectCount < history.DetectCount)
                return 1;

            return 0;
        }
    }
}
