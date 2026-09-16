using Response.Request;

namespace Base.History.IBLL.Request
{
    public class RequestSOPHistory : RequestPage
    {
        private int m_nBeginYear = -1;
        private int m_nBeginMonth = -1;
        private int m_nBeginDay = -1;
        private int m_nEndYear = -1;
        private int m_nEndMonth = -1;
        private int m_nEndDay = -1;
        private int m_nSiteNo = -1;
        private string m_strDisasterCategoryName = null;
        private string m_strActionStepName = null;
        private string m_strUserName = null;

        public int BeginYear
        {
            get { return m_nBeginYear; }
            set { m_nBeginYear = value; }
        }

        public int BeginMonth
        {
            get { return m_nBeginMonth; }
            set { m_nBeginMonth = value; }
        }

        public int BeginDay
        {
            get { return m_nBeginDay; }
            set { m_nBeginDay = value; }
        }

        public int EndYear
        {
            get { return m_nEndYear; }
            set { m_nEndYear = value; }
        }

        public int EndMonth
        {
            get { return m_nEndMonth; }
            set { m_nEndMonth = value; }
        }

        public int EndDay
        {
            get { return m_nEndDay; }
            set { m_nEndDay = value; }
        }

        public int SiteNo
        {
            get { return m_nSiteNo; }
            set { m_nSiteNo = value; }
        }

        // null이면 전체
        public string DisasterCategoryName
        {
            get { return m_strDisasterCategoryName; }
            set { m_strDisasterCategoryName = value; }
        }

        // null이면 전체
        public string ActionStepName
        {
            get { return m_strActionStepName; }
            set { m_strActionStepName = value; }
        }

        // null이면 전체
        public string UserName
        {
            get { return m_strUserName; }
            set { m_strUserName = value; }
        }
    }
}
