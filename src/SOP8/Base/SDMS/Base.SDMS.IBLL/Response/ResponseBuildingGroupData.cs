using System.Collections.Generic;
using Base.Model.Spatial;
using Response;

namespace Base.SDMS.IBLL.Response
{
    public class ResponseBuildingGroupData : MessageResult
    {
        private string m_strBuildingGroupName = "";
        private List<BuildingGroupData> m_buildingGroupDatas = new List<BuildingGroupData>();

        public string BuildingGroupName
        {
            get { return m_strBuildingGroupName; }
            set { m_strBuildingGroupName = value; }
        }

        public List<BuildingGroupData> BuildingGroupDatas
        {
            get { return m_buildingGroupDatas; }
            set { m_buildingGroupDatas = value; }
        }

        public ResponseBuildingGroupData()
            : base()
        {
        }

        public ResponseBuildingGroupData(bool success, string message)
            : base(success, message)
        {
        }
    }
}
