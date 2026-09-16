using Response;

namespace Base.Account.IBLL.Response
{
    public class ResponseLoginKey : MessageResult
    {
        private string m_strLoginKey = "";
        private string m_strSalt = "";
        private bool m_externalLogin = false;

        public string LoginKey
        {
            get { return m_strLoginKey; }
            set { m_strLoginKey = value; }
        }

        public string Salt
        {
            get { return m_strSalt; }
            set { m_strSalt = value; }
        }

        public bool ExternalLogin
        {
            get { return m_externalLogin; }
            set { m_externalLogin = value; }
        }
    }
}
