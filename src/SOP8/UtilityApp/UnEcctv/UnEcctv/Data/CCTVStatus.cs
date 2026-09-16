namespace UnEcctv.Data
{
    class CCTVStatus
    {
        private string m_strGuid = null;
        private int? m_markNo = null;
        private bool m_visible = false;
        private int m_nUserNo = -1;
        private string m_strTitle = "";
        private int? m_sensorZoneHistoryNo = null;
        private int? m_cctv1 = null;
        private int? m_cctv2 = null;
        private int? m_cctv3 = null;
        private int? m_cctv4 = null;

        public string Guid
        {
            get { return m_strGuid; }
            set { m_strGuid = value; }
        }

        public int? MarkNo
        {
            get { return m_markNo; }
            set { m_markNo = value; }
        }

        public bool Visible
        {
            get { return m_visible; }
            set { m_visible = value; }
        }

        public int UserNo
        {
            get { return m_nUserNo; }
            set { m_nUserNo = value; }
        }

        public string Title
        {
            get { return m_strTitle; }
            set { m_strTitle = value; }
        }

        public int? SensorZoneHistoryNo
        {
            get { return m_sensorZoneHistoryNo; }
            set { m_sensorZoneHistoryNo = value; }
        }

        public int? CCTV1
        {
            get { return m_cctv1; }
            set { m_cctv1 = value; }
        }

        public int? CCTV2
        {
            get { return m_cctv2; }
            set { m_cctv2 = value; }
        }

        public int? CCTV3
        {
            get { return m_cctv3; }
            set { m_cctv3 = value; }
        }

        public int? CCTV4
        {
            get { return m_cctv4; }
            set { m_cctv4 = value; }
        }
    }
}
