using System.Collections.Generic;
using DCOP.Model;

namespace DCOP.BLL.Models.Response
{
    public class ResponseRackFilterList : MessageResult
    {
        private List<Company> m_companies = new List<Company>();
        private List<string> m_rackTypes = new List<string>();
        private List<int> m_units = new List<int>();

        public List<Company> Companies
        {
            get { return m_companies; }
            set { m_companies = value; }
        }

        public List<string> RackTypes
        {
            get { return m_rackTypes; }
            set { m_rackTypes = value; }
        }

        public List<int> Units
        {
            get { return m_units; }
            set { m_units = value; }
        }

        public ResponseRackFilterList()
            : base()
        {
        }

        public ResponseRackFilterList(bool success, string message)
            : base(success, message)
        {
        }
    }
}
