namespace DCOP.BLL.Models.Response
{
    public class ResponseFacilityInfo : MessageResult
    {
        private int m_nFaclityNo = -1;
        private string m_strFacilityName = "";
        private string m_strImagePath = null;

        public int FaclilityNo
        {
            get { return m_nFaclityNo; }
            set { m_nFaclityNo = value; }
        }

        public string ImagePath
        {
            get { return m_strImagePath; }
            set { m_strImagePath = value; }
        }

        public string FacilityName
        {
            get { return m_strFacilityName; }
            set { m_strFacilityName = value; }
        }

        public ResponseFacilityInfo()
            : base()
        {
        }

        public ResponseFacilityInfo(bool success, string message)
            : base(success, message)
        {
        }
    }
}
