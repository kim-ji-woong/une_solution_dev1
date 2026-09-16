namespace DCOP.BLL.Models.Request.RackEditor
{
    public class RequestItem
    {
        private string m_strBarcode = "";

        public string Barcode
        {
            get { return m_strBarcode; }
            set { m_strBarcode = value; }
        }
    }
}
