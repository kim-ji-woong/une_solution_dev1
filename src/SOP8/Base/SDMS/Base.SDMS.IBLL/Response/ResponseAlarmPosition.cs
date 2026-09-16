using Response;

namespace Base.SDMS.IBLL.Response
{
    public class ResponseAlarmPosition : MessageResult
    {
        private string m_strPosition = "";

        public string Position
        {
            get { return m_strPosition; }
            set { m_strPosition = value; }
        }

        public ResponseAlarmPosition()
            : base()
        {
        }

        public ResponseAlarmPosition(bool success, string message)
            : base(success, message)
        {
        }

        public ResponseAlarmPosition(bool success, string message, int errorCode)
            : base(success, message, errorCode)
        {
        }
    }
}
