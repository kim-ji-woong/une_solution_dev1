using DCOP.Model;

namespace DCOP.BLL.Models.Response.RackEditor
{
    public class ResponseRackType : MessageResult
    {
        private RackType m_rackType = null;

        public RackType RackType
        {
            get { return m_rackType; }
            set { m_rackType = value; }
        }

        public ResponseRackType()
            : base()
        {
        }

        public ResponseRackType(bool success, string message)
            : base(success, message)
        {
        }
    }
}
