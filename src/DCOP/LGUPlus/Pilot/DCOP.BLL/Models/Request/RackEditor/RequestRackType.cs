namespace DCOP.BLL.Models.Request.RackEditor
{
    public class RequestRackType
    {
        private string m_strBarcode = null;
        private int? m_rackTypeNo = null;

        public string Barcode
        {
            get { return m_strBarcode; }
            set { m_strBarcode = value; }
        }

        public int? RackTypeNo
        {
            get { return m_rackTypeNo; }
            set { m_rackTypeNo = value; }
        }
    }
}
