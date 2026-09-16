using DCOP.Model;

namespace DCOP.BLL.Models.Response.RackEditor
{
    public class ResponseRack : MessageResult
    {
        private Rack m_rack = null;
        private RackType m_rackType = null;

        public Rack Rack
        {
            get { return m_rack; }
            set { m_rack = value; }
        }

        public RackType RackType
        {
            get { return m_rackType; }
            set { m_rackType = value; }
        }

        public ResponseRack()
            : base()
        {
        }

        public ResponseRack(bool success, string message)
            : base(success, message)
        {
        }
    }
}
