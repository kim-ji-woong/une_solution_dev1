using Response;

namespace Base.SOPManager.IBLL.Response
{
    public class ResponseParseSpecialMessage : MessageResult
    {
        private string m_strParseMessage = "";

        // 변환된 메시지
        public string ParseMessage
        {
            get { return m_strParseMessage; }
            set { m_strParseMessage = value; }
        }

        public ResponseParseSpecialMessage()
        {
        }

        public ResponseParseSpecialMessage(bool success, string strMessage, string strErrorMessage)
        {
            m_strParseMessage = strMessage;
            Message = strErrorMessage;
            Success = success;
        }
    }
}
