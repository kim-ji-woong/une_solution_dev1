namespace Base.History.IBLL.Request
{
    public class RequestSOPComponentHistory
    {
        private int m_nActionStepHistoryNo = -1;

        public int ActionStepHistoryNo
        {
            get { return m_nActionStepHistoryNo; }
            set { m_nActionStepHistoryNo = value; }
        }
    }
}
