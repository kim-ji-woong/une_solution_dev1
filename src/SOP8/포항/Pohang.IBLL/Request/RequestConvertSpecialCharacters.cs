namespace Pohang.IBLL.Request
{
    public class RequestConvertSpecialCharacters
    {
        private string m_strMessage;
        private int m_nActionStepHistoryNo;
        
        public string Message
        {
            get { return m_strMessage; }
            set { m_strMessage = value; }
        }
        
        public int ActionStepHistoryNo
        {
            get { return m_nActionStepHistoryNo; }
            set { m_nActionStepHistoryNo = value; }
        }
    }
}