namespace Base.SOPManager.IBLL.Request
{
    using Models;

    public class RequestSave
    {
        private int m_nTarget = (int)RequestData.ContentsType.DB;
        private int m_nUserNo = -1;
        private SOPData m_sopData = null;

        public int Target
        {
            get { return m_nTarget; }
            set { m_nTarget = value; }
        }

        public int user_sn
        {
            get { return m_nUserNo; }
            set { m_nUserNo = value; }
        }

        public SOPData SOPData
        {
            get { return m_sopData; }
            set { m_sopData = value; }
        }
    }
}
