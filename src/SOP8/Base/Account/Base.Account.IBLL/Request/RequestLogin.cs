namespace Base.Account.IBLL.Request
{
    public class RequestLogin
    {
        private string m_strValue = "";
        private string m_strKey = "";

        public string Value
        {
            get { return m_strValue; }
            set { m_strValue = value; }
        }

        public string Key
        {
            get { return m_strKey; }
            set { m_strKey = value; }
        }
    }
}
