namespace WebSOPApp.Areas.SDMS.Controllers.Response
{
    public class Result
    {
        private bool m_result = false;

        public bool Success
        {
            get { return m_result; }
            set { m_result = value; }
        }
    }

    public class MessageResult : Result
    {
        private string m_strMessage = "";

        public string Message
        {
            get { return m_strMessage; }
            set { m_strMessage = value; }
        }

        public MessageResult()
        {
        }

        public MessageResult(bool success, string strMessage)
        {
            Success = success;
            m_strMessage = strMessage;
        }
    }
}
