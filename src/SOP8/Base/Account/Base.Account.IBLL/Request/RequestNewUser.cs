namespace Base.Account.IBLL.Request
{
    public class RequestNewUser
    {
        private int? m_regularMemberNo = null;
        private string m_strUserID = "";
        private string m_strNickName = "";
        private int m_nGrade = -1;
        private int? m_siteNo = null;
        private string m_strMemo = null;

        public int? RegularMemberNo
        {
            get { return m_regularMemberNo; }
            set { m_regularMemberNo = value; }
        }

        public string UserID
        {
            get { return m_strUserID; }
            set { m_strUserID = value; }
        }

        public string NickName
        {
            get { return m_strNickName; }
            set { m_strNickName = value; }
        }

        public int Grade
        {
            get { return m_nGrade; }
            set { m_nGrade = value; }
        }

        public int? SiteNo
        {
            get { return m_siteNo; }
            set { m_siteNo = value; }
        }

        public string Memo
        {
            get { return m_strMemo; }
            set { m_strMemo = value; }
        }
    }
}
