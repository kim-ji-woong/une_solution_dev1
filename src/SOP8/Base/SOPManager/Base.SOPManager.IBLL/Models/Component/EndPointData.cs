using Base.Model.Sop.Component;

namespace Base.SOPManager.IBLL.Models.Component
{
    public class EndpointData : Base.Model.Sop.Component.Component
    {
        private Endpoint m_endPoint = null;

        public Endpoint Endpoint
        {
            get { return m_endPoint; }
            set { m_endPoint = value; }
        }
    }
}
