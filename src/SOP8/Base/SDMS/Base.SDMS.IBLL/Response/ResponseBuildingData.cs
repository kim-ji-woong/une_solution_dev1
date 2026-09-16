using System.Collections.Generic;
using Base.Model.Spatial;
using Response;

namespace Base.SDMS.IBLL.Response
{
    public class ResponseBuildingData : MessageResult
    {
        private string m_strBuildingName = "";
        private List<BuildingData> m_buildingDatas = new List<BuildingData>();

        public string BuildingName
        {
            get { return m_strBuildingName; }
            set { m_strBuildingName = value; }
        }

        public List<BuildingData> BuildingDatas
        {
            get { return m_buildingDatas; }
            set { m_buildingDatas = value; }
        }

        public ResponseBuildingData()
            : base()
        {
        }

        public ResponseBuildingData(bool success, string message)
            : base(success, message)
        {
        }
    }
}
