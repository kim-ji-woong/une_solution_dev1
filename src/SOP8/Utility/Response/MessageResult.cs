using System.Collections.Generic;

namespace Response
{
    public class MessageResult
    {
        private string m_strMessage = "";
        private bool m_success = false;
        private int? m_errorCode = null;

        public string Message
        {
            get { return m_strMessage; }
            set { m_strMessage = value; }
        }

        public bool Success
        {
            get { return m_success; }
            set { m_success = value; }
        }

        public int? ErrorCode
        {
            get { return m_errorCode; }
            set { m_errorCode = value; }
        }

        public MessageResult()
        {
        }

        public MessageResult(bool success, string strMessage)
        {
            Success = success;
            m_strMessage = strMessage;
        }

        public MessageResult(bool success, string strMessage, int errorCode)
        {
            Success = success;
            m_strMessage = strMessage;
            m_errorCode = errorCode;
        }
    }

    public class MessageResultData<T> : MessageResult
    {
        private T m_data;

        public T Data
        {
            get { return m_data; }
            set { m_data = value; }
        }

        public MessageResultData()
            : base()
        {
        }

        public MessageResultData(bool success, string message)
            : base(success, message)
        {
        }
    }

    public class MessageResultListData<T> : MessageResult
    {
        private IEnumerable<T> m_datas = new List<T>();

        public IEnumerable<T> Datas
        {
            get { return m_datas; }
            set { m_datas = value; }
        }

        public MessageResultListData()
            : base()
        {
        }

        public MessageResultListData(bool success, string message)
            : base(success, message)
        {
        }
    }
}
