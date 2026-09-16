namespace DCOP.BLL.Models.Response
{
    using Models.Account;

    public class LoginResult : MessageResult
    {
        //public enum LoginState { Login = 0, Logout, False, Disconnected, LicenseWait, LicenseExpired, LicenseAlert, LicenseInvalid }

        private ApplicationUser m_user = null;
        //private int m_nLoginState = (int)LoginState.False;

        public ApplicationUser User
        {
            get { return m_user; }
            set { m_user = value; }
        }

        /*public int State
        {
            get { return m_nLoginState; }
            set { m_nLoginState = value; }
        }*/

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
