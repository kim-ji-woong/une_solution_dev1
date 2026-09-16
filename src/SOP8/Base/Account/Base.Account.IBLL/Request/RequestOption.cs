namespace Base.Account.IBLL.Request
{
    public class RequestOption
    {
        private int m_nUserNo = -1;
        private string m_strCategory = null;
        private string m_strSubCategory = null;

        public int UserNo
        {
            get { return m_nUserNo; }
            set { m_nUserNo = value; }
        }

        public string Category
        {
            get { return m_strCategory; }
            set { m_strCategory = value; }
        }

        public string SubCategory
        {
            get { return m_strSubCategory; }
            set { m_strSubCategory = value; }
        }
    }
}
