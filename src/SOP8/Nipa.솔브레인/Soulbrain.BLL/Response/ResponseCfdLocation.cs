using System.Collections.Generic;
using Response;

namespace Soulbrain.BLL.Response
{
    public class ResponseCfdLocation : MessageResult
    {
        private List<CfdLocation> m_cfdLocations = new List<CfdLocation>();

        public List<CfdLocation> Locations
        {
            get { return m_cfdLocations; }
            set { m_cfdLocations = value; }
        }

        public ResponseCfdLocation()
            : base()
        {
        }

        public ResponseCfdLocation(bool success, string message)
            : base(success, message)
        {
        }
    }

    public class CfdLocation
    {
        private string m_strMaterialName = "";
        private int m_nBuildingNo = -1;
        private string m_strBuildingName = "";
        private string m_strBuildingGroupName = "";
        private string m_strTargetLocation = "";

        public string MaterialName
        {
            get { return m_strMaterialName; }
            set { m_strMaterialName = value; }
        }

        public int BuildingNo
        {
            get { return m_nBuildingNo; }
            set { m_nBuildingNo = value; }
        }

        public string BuildingName
        {
            get { return m_strBuildingName; }
            set { m_strBuildingName = value; }
        }

        public string BuildingGroupName
        {
            get { return m_strBuildingGroupName; }
            set { m_strBuildingGroupName = value; }
        }

        public string TargetLocation
        {
            get { return m_strTargetLocation; }
            set { m_strTargetLocation = value; }
        }
    }

    public class CfdLocationEx : CfdLocation
    {
        private int m_nMaterialNo = -1;

        public int MaterialNo
        {
            get { return m_nMaterialNo; }
            set { m_nMaterialNo = value; }
        }
    }
}
