using Response.Request;
using System.Collections.Generic;
using dnsDapperDBUtil.DataAccessLayer.IDAL;

namespace Base.History.IBLL.Request
{
    using Models.History;

    public class RequestSensorAnalysisHistory : RequestPage
    {
        private int m_nBeginYear = -1;
        private int m_nBeginMonth = -1;
        private int m_nBeginDay = -1;
        private int m_nEndYear = -1;
        private int m_nEndMonth = -1;
        private int m_nEndDay = -1;
        private int? m_buildingGroupNo = null;
        private int? m_buildingNo = null;
        private int? m_zoneNo = null;
        private int? m_sensorNo = null;
        private int? m_sensorType = null;
        private List<int> m_sensorSubTypes = null;
        private int? m_siteNo = null;

        private List<SensorTypeData> m_sensorTypeDatas = null;

        private bool m_useSensorTypeName = true;
        private bool m_useSensorName = true;
        private bool m_useLocationName = true;
        private bool m_useDetectCount = true;
        private bool m_useMalfunctionCount = true;
        private bool m_useSensorClearCount = true;
        private bool m_useUserResetCount = true;
        private bool m_useMalfunctionRatio = true;

        public int BeginYear
        {
            get { return m_nBeginYear; }
            set { m_nBeginYear = value; }
        }

        public int BeginMonth
        {
            get { return m_nBeginMonth; }
            set { m_nBeginMonth = value; }
        }

        public int BeginDay
        {
            get { return m_nBeginDay; }
            set { m_nBeginDay = value; }
        }

        public int EndYear
        {
            get { return m_nEndYear; }
            set { m_nEndYear = value; }
        }

        public int EndMonth
        {
            get { return m_nEndMonth; }
            set { m_nEndMonth = value; }
        }

        public int EndDay
        {
            get { return m_nEndDay; }
            set { m_nEndDay = value; }
        }

        public int? BuildingGroupNo
        {
            get { return m_buildingGroupNo; }
            set { m_buildingGroupNo = value; }
        }

        public int? BuildingNo
        {
            get { return m_buildingNo; }
            set { m_buildingNo = value; }
        }

        public int? ZoneNo
        {
            get { return m_zoneNo; }
            set { m_zoneNo = value; }
        }

        public int? SensorNo
        {
            get { return m_sensorNo; }
            set { m_sensorNo = value; }
        }

        public int? SensorType
        {
            get { return m_sensorType; }
            set { m_sensorType = value; }
        }

        public List<int> SensorSubTypes
        {
            get { return m_sensorSubTypes; }
            set { m_sensorSubTypes = value; }
        }

        public int? SiteNo
        {
            get { return m_siteNo; }
            set { m_siteNo = value; }
        }

        public List<SensorTypeData> SensorTypeDatas
        {
            get { return m_sensorTypeDatas; }
            set { m_sensorTypeDatas = value; }
        }

        public bool UseSensorTypeName
        {
            get { return m_useSensorTypeName; }
            set { m_useSensorTypeName = value; }
        }

        public bool UseSensorName
        {
            get { return m_useSensorName; }
            set { m_useSensorName = value; }
        }

        public bool UseLocationName
        {
            get { return m_useLocationName; }
            set { m_useLocationName = value; }
        }

        public bool UseDetectCount
        {
            get { return m_useDetectCount; }
            set { m_useDetectCount = value; }
        }

        public bool UseMalfunctionCount
        {
            get { return m_useMalfunctionCount; }
            set { m_useMalfunctionCount = value; }
        }

        public bool UseSensorClearCount
        {
            get { return m_useSensorClearCount; }
            set { m_useSensorClearCount = value; }
        }

        public bool UseUserResetCount
        {
            get { return m_useUserResetCount; }
            set { m_useUserResetCount = value; }
        }

        public bool UseMalfunctionRatio
        {
            get { return m_useMalfunctionRatio; }
            set { m_useMalfunctionRatio = value; }
        }

        public virtual void CheckAdditionalCondition(ref string strCondition)
        {
        }

        // Key : SensorZone No
        public virtual bool GetLocationName(IDataManager dataManager, Dictionary<int, string> dicSensorZoneLocationNames)
        {
            return false;
        }
    }
}
