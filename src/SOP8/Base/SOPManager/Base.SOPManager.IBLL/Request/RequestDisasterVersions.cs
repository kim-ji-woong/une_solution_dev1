namespace Base.SOPManager.IBLL.Request
{
    public class RequestDisasterVersions
    {
        private int m_nDisasterNo = -1;
        
        public int DisasterNo
        {
            get { return m_nDisasterNo; }
            set { m_nDisasterNo = value; }
        }
    }
}
