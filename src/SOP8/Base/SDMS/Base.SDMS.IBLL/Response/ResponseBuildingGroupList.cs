using System.Collections.Generic;
using Base.SDMS.IBLL.Models;
using Response;

namespace Base.SDMS.IBLL.Response
{
    public class ResponseBuildingGroupList : MessageResult
    {
        private List<SpatialData.BuildingGroupData> m_buildingGroups = null;
        
        private List<SpatialData.ZoneData> m_outdoorZones = new List<SpatialData.ZoneData>();
        
        public List<SpatialData.BuildingGroupData> BuildingGroups
        {
            get { return m_buildingGroups; }
            set { m_buildingGroups = value; }
        }
        
        public List<SpatialData.ZoneData> OutdoorZones
        {
            get { return m_outdoorZones; }
            set { m_outdoorZones = value; }
        }

        public ResponseBuildingGroupList()
            : base()
        {
        }

        public ResponseBuildingGroupList(bool success, string message)
            : base(success, message)
        {
        }

        public ResponseBuildingGroupList(bool success, string message, int errorCode)
            : base(success, message, errorCode)
        {
        }
    }
}