using System.Collections.Generic;
using Response;
using Kftc.Model.Spatial;

namespace Kftc.BLL.Response
{
    public class ResponseElevators : MessageResult
    {
        private List<Elevator> m_elevators = new List<Elevator>();

        public List<Elevator> Elevators
        {
            get { return m_elevators; }
            set { m_elevators = value; }
        }

        public ResponseElevators()
            : base()
        {
        }

        public ResponseElevators(bool success, string message)
            : base(success, message)
        {
        }
    }
}
