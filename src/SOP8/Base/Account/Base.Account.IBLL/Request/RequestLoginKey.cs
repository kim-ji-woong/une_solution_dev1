namespace Base.Account.IBLL.Request
{
    public class RequestLoginKey
    {
        public enum ModeType { Email = 0, PhoneNumber };

        private long? num = null;
        private string m_strUserID = null;
        private string m_strName = null;
        private string m_strData = null;
        private int? m_nMode = null;

        public long? Num
        {
            get { return num; }
            set { num = value; }
        }

        public string UserID
        {
            get { return m_strUserID; }
            set { m_strUserID = value; }
        }

        public string Name
        {
            get { return m_strName; }
            set { m_strName = value; }
        }

        public string Data
        {
            get { return m_strData; }
            set { m_strData = value; }
        }

        // ModeType
        public int? Mode
        {
            get { return m_nMode; }
            set { m_nMode = value; }
        }
    }
}
