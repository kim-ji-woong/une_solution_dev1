using DCOP.Model.Code;

namespace DCOP.BLL.Models.Response.RackEditor
{
    public class ResponseRackUnit : MessageResult
    {
        private RackUnit m_rackUnit = null;

        public RackUnit RackUnit
        {
            get { return m_rackUnit; }
            set { m_rackUnit = value; }
        }

        public ResponseRackUnit()
            : base()
        {
        }

        public ResponseRackUnit(bool success, string message)
            : base(success, message)
        {
        }
    }
}
