using DCOP.Model;

namespace DCOP.BLL.Models.Response.RackEditor
{
    public class ResponseCodeType : MessageResult
    {
        private CodeType m_codeType = null;

        public CodeType CodeType
        {
            get { return m_codeType; }
            set { m_codeType = value; }
        }

        public ResponseCodeType()
            : base()
        {
        }

        public ResponseCodeType(bool success, string message)
            : base(success, message)
        {
        }
    }
}
