namespace DCOP.BLL.Models.Request.RackEditor
{
    public class RequestRackItems
    {
        private int m_nRackTypeNo = -1;
        private int m_nRackNo = -1;

        public int RackTypeNo
        {
            get { return m_nRackTypeNo; }
            set { m_nRackTypeNo = value; }
        }

        public int RackNo
        {
            get { return m_nRackNo; }
            set { m_nRackNo = value; }
        }
    }
}
