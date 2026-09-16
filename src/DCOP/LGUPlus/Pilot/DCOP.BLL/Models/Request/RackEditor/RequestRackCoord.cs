namespace DCOP.BLL.Models.Request.RackEditor
{
    public class RequestRackCoord
    {
        private string m_strBarcode = null;
        private int m_nCodeTypeNo = 0;
        private int m_nCodeLength = 0;
        private int m_nCodeCount = 0;

        public string Barcode
        {
            get { return m_strBarcode; }
            set { m_strBarcode = value; }
        }

        public int CodeTypeNo
        {
            get { return m_nCodeTypeNo; }
            set { m_nCodeTypeNo = value; }
        }

        public int CodeLength
        {
            get { return m_nCodeLength; }
            set { m_nCodeLength = value; }
        }

        public int CodeCount
        {
            get { return m_nCodeCount; }
            set { m_nCodeCount = value; }
        }
    }
}
