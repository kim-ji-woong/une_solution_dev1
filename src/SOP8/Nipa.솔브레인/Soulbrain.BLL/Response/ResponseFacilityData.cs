using System.Collections.Generic;
using Response;
using Soulbrain.Model.Facility;

namespace Soulbrain.BLL.Response
{
    public class ResponseFacilityData : MessageResult
    {
        private int? m_buildingGroupNo = null;
        private int? m_buildingNo = null;
        private int m_nZoneNo = -1;
        private string m_strModelName = "";
        private string m_strFacilityName = "";
        private List<FacilityData> m_facilityDatas = new List<FacilityData>();

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

        public int ZoneNo
        {
            get { return m_nZoneNo; }
            set { m_nZoneNo = value; }
        }

        public string ModelName
        {
            get { return m_strModelName; }
            set { m_strModelName = value; }
        }

        public string FacilityName
        {
            get { return m_strFacilityName; }
            set { m_strFacilityName = value; }
        }

        public List<FacilityData> FacilityDatas
        {
            get { return m_facilityDatas; }
            set { m_facilityDatas = value; }
        }

        public ResponseFacilityData()
            : base()
        {
        }

        public ResponseFacilityData(bool success, string message)
            : base(success, message)
        {
        }
    }
}
