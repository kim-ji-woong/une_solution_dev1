using Response;

namespace Base.SDMS.IBLL.Response
{
    public class ResponseAlarmMemo : MessageResult
    {
        private string m_strMemo = null;

        public string Memo
        {
            get { return m_strMemo; }
            set { m_strMemo = value; }
        }

        public ResponseAlarmMemo()
            : base()
        {
        }

        public ResponseAlarmMemo(bool success, string message)
            : base(success, message)
        {
        }

        public ResponseAlarmMemo(bool success, string message, int errorCode)
            : base(success, message, errorCode)
        {
        }
    }
}
