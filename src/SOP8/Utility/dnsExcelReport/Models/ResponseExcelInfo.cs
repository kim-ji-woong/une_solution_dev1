using Response;

namespace dnsExcelReport.Models
{
    public class ResponseExcelInfo : MessageResult
    {
        private byte[] m_bytes = null;
        private string m_strFileName = null;

        public byte[] Bytes
        {
            get { return m_bytes; }
            set { m_bytes = value; }
        }

        public string FileName
        {
            get { return m_strFileName; }
            set { m_strFileName = value; }
        }

        public ResponseExcelInfo()
            : base()
        {
        }

        public ResponseExcelInfo(bool success, string message)
            : base(success, message)
        {
        }
    }
}
