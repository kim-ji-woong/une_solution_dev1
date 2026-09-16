using Response;

namespace Base.SOPSimulator.IBLL.Response
{
    public class ResponseExecuteSOP : MessageResult
    {
        private int m_nActionStepHistoryNo = -1;

        public int ActionStepHistoryNo
        {
            get { return m_nActionStepHistoryNo; }
            set { m_nActionStepHistoryNo = value; }
        }

        public ResponseExecuteSOP()
            : base()
        {
        }

        public ResponseExecuteSOP(bool success, string message)
            : base(success, message)
        {
        }
    }
}
