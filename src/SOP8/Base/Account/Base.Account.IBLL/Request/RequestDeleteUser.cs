namespace Base.Account.IBLL.Request
{
    public class RequestDeleteUser
    {
        private int m_nUserNo = -1;

        public int UserNo
        {
            get { return m_nUserNo; }
            set { m_nUserNo = value; }
        }
    }
}
