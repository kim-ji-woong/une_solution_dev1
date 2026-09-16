using System;

namespace Base.SOPSimulator.IBLL.Request
{
    public class RequestCloseSOP
    {
        private int m_nActionStepHistoryNo = -1;
        public int ActionStepHistoryNo
        {
            get { return m_nActionStepHistoryNo; }
            set { m_nActionStepHistoryNo = value; }
        }

        private DateTime? m_endTime = null;
        public DateTime? EndTime
        {
            get { return m_endTime; }
            set { m_endTime = value; }
        }

        private int? m_nLastAccessedUserNo = null;
        public int? LastAccessedUserNo
        {
            get { return m_nLastAccessedUserNo; }
            set { m_nLastAccessedUserNo = value; }
        }
    }
}
