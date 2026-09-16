using Response;

namespace Pohang.IBLL.Response
{
    public class ResponseConvertSpecialCharacters : MessageResult
    {
        private string m_strConvertedMessage = "";
        
        public string ConvertedMessage
        {
            get { return m_strConvertedMessage; }
            set { m_strConvertedMessage = value; }
        }
    }
}