namespace Base.Account.IBLL.Request
{
    public class RequestUpdateUserInfo
    {
        private int m_nUserNo = -1;
        private string m_strNickName = null;
        private int? m_grade = null;
        private string m_strMemo = null;

        public int UserNo
        {
            get { return m_nUserNo; }
            set { m_nUserNo = value; }
        }

        public string NickName
        {
            get { return m_strNickName; }
            set { m_strNickName = value; }
        }

        public int? Grade
        {
            get { return m_grade; }
            set { m_grade = value; }
        }

        public string Memo
        {
            get { return m_strMemo; }
            set { m_strMemo = value; }
        }
    }
}
