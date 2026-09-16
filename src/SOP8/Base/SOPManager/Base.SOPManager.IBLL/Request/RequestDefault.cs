namespace Base.SOPManager.IBLL.Request
{
    public class RequestDefault
    {
        private int m_nSiteNo = -1;
        private bool m_requestActionSteps = false;

        public int site_sn
        {
            get { return m_nSiteNo; }
            set { m_nSiteNo = value; }
        }

        public bool RequestActionSteps
        {
            get { return m_requestActionSteps; }
            set { m_requestActionSteps = value; }
        }
    }

    public class RequestDefaultStepMember
    {
        private int m_nActionStepNo = -1;

        public int ActionStepNo
        {
            get { return m_nActionStepNo; }
            set { m_nActionStepNo = value; }
        }
    }
}
