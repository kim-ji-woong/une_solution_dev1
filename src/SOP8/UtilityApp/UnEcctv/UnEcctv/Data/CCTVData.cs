namespace UnEcctv.Data
{
    public class CCTVData
    {
        private string m_strTitle = "";
        private int m_nNo = -1;
        private string m_strUrl = "";

        // 카메라 번호
        public int No
        {
            get { return m_nNo; }
            set { m_nNo = value; }
        }

        public string Title
        {
            get { return m_strTitle; }
            set { m_strTitle = value; }
        }

        public string Url
        {
            get { return m_strUrl; }
            set { m_strUrl = value; }
        }
    }
}
