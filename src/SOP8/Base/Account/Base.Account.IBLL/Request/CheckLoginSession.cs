namespace Base.Account.IBLL.Request
{
    public class CheckLoginSession
    {
        private int m_nUserNo = -1;
        private string m_strSessionKey = "";


        public int UserNo
        {
            get { return m_nUserNo; }
            set { m_nUserNo = value; }
        }

        public string SessionKey
        {
            get { return m_strSessionKey; }
            set { m_strSessionKey = value; }
        }
    }
}
