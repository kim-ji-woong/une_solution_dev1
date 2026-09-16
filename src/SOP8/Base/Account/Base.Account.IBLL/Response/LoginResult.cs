using Response;
using Base.Model.Account;

namespace Base.Account.IBLL.Response
{
    using Models;

    public class LoginResult : MessageResult
    {
        private ApplicationUser m_user = null;

        public ApplicationUser User
        {
            get { return m_user; }
            set { m_user = value; }
        }

        public LoginResult()
            : base()
        {
        }

        public LoginResult(bool success, string message)
            : base(success, message)
        {
        }
    }
}
