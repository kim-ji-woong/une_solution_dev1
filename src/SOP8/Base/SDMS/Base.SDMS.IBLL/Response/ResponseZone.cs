using System.Collections.Generic;
using Response;

namespace Base.SDMS.IBLL.Response
{
    using Models;

    public class ResponseZone : MessageResult
    {
        private List<SensorList> m_sensorTypes = new List<SensorList>();
        private List<SpatialData.EquipmentZoneData> m_equipZoneDatas = new List<SpatialData.EquipmentZoneData>();
        private List<SpatialData.BuildingGroupData> m_buildingGroupDatas = new List<SpatialData.BuildingGroupData>();

        public List<SensorList> SensorTypes
        {
            get { return m_sensorTypes; }
            set { m_sensorTypes = value; }
        }

        public List<SpatialData.EquipmentZoneData> EquipZoneDatas
        {
            get { return m_equipZoneDatas; }
            set { m_equipZoneDatas = value; }
        }

        // 건물그룹이나 건물의 텍스트 위치가 변경될 수 있음
        // 건물그룹이나 건물의 텍스트가 변경될 수 있음
        public List<SpatialData.BuildingGroupData> BuildingGroupDatas
        {
            get { return m_buildingGroupDatas; }
            set { m_buildingGroupDatas = value; }
        }

        public ResponseZone()
            : base()
        {
        }

        public ResponseZone(bool success, string message)
            : base(success, message)
        {
        }

        public ResponseZone(bool success, string message, int errorCode)
            : base(success, message, errorCode)
        {
        }
    }
}
