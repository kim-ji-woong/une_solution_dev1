using Response;

namespace Base.Account.IBLL.Response
{
    using Models;

    public class ResponseAccountUser : MessageResult
    {
        private AccountUser m_user = null;

        public AccountUser User
        {
            get { return m_user; }
            set { m_user = value; }
        }

        public ResponseAccountUser()
            : base()
        {
        }

        public ResponseAccountUser(bool success, string message)
            : base(success, message)
        {
        }
    }
}
