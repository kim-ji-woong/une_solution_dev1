using Response.Request;
using System.Collections.Generic;
using Base.Model.Spatial;
using dnsDapperDBUtil.DataAccessLayer.IDAL;

namespace Base.History.IBLL.Request
{
    using Models.History;

    public class RequestSensorDetectHistory : RequestPage
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
        private bool m_useDetectStatus = false;
        private bool m_useClearType = true;
        private bool m_useAlarmDepthName = true;
        private bool m_useSopName = false;
        private bool m_useMemo = false;

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

        public bool UseDetectStatus
        {
            get { return m_useDetectStatus; }
            set { m_useDetectStatus = value; }
        }

        public bool UseClearType
        {
            get { return m_useClearType; }
            set { m_useClearType = value; }
        }

        public bool UseAlarmDepthName
        {
            get { return m_useAlarmDepthName; }
            set { m_useAlarmDepthName = value; }
        }

        public bool UseSopName
        {
            get { return m_useSopName; }
            set { m_useSopName = value; }
        }

        public bool UseMemo
        {
            get { return m_useMemo; }
            set { m_useMemo = value; }
        }

        public virtual void CheckAdditionalCondition(ref string strCondition)
        {
        }

        // dicLinkedZones.Key : EquipZone No
        public virtual string GetLocationName(IDataManager dataManager, int equipZoneNo, string strEquipZoneName, Dictionary<int, List<Zone>> dicLinkedZones, Dictionary<int, Building> dicLinkedBuildings, Dictionary<int, BuildingGroup> dicLinkedBuildingGroups)
        {
            return strEquipZoneName;
        }

        public virtual string GetLocationName(IDataManager dataManager, int zoneNo, string strZoneName)
        {
            return strZoneName;
        }
    }
}
