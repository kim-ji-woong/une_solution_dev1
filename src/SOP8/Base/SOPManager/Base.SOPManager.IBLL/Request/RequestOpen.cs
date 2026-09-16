namespace Base.SOPManager.IBLL.Request
{
    public class RequestOpen
    {
        private int m_nTarget = (int)RequestData.ContentsType.DB;

        // DB 옵션
        private int m_nDisasterNo = -1;

        // XML 옵션
        private string m_strXMLData = "";

        public int Target
        {
            get { return m_nTarget; }
            set { m_nTarget = value; }
        }

        public int DisasterNo
        {
            get { return m_nDisasterNo; }
            set { m_nDisasterNo = value; }
        }

        public string XMLData
        {
            get { return m_strXMLData; }
            set { m_strXMLData = value; }
        }
    }

    public class RequestOpenAll
    {
        private int? m_siteNo = null;

        // 이 값이 null이면 전체 SOP를 요청한다.
        public int? SiteNo
        {
            get { return m_siteNo; }
            set { m_siteNo = value; }
        }
    }
}
