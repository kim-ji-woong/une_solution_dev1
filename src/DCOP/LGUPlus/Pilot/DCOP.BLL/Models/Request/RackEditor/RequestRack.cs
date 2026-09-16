namespace DCOP.BLL.Models.Request.RackEditor
{
    public class RequestRack
    {
        private int? m_rackNo = null;
        private string m_strBarcode = null;
        private int m_nDataCenterNo = 0;

        public int? RackNo
        {
            get { return m_rackNo; }
            set { m_rackNo = value; }
        }

        public string Barcode
        {
            get { return m_strBarcode; }
            set { m_strBarcode = value; }
        }

        public int DataCenterNo
        {
            get { return m_nDataCenterNo; }
            set { m_nDataCenterNo = value; }
        }
    }
}
