using System.Collections.Generic;
using Soulbrain.Model.Facility;
using Response;

namespace Soulbrain.BLL.Response
{
    public class ResponseAllFacility : MessageResult
    {
        private List<Facility> m_facilities = new List<Facility>();

        public List<Facility> Facilities
        {
            get { return m_facilities; }
            set { m_facilities = value; }
        }

        public ResponseAllFacility()
            : base()
        {
        }

        public ResponseAllFacility(bool success, string message)
            : base(success, message)
        {
        }
    }
}
