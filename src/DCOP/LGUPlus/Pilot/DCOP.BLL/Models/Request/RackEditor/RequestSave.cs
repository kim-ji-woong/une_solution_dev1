using System.Collections.Generic;
using DCOP.Model;

namespace DCOP.BLL.Models.Request.RackEditor
{
    public class RequestSave
    {
        private Rack m_rack = null;
        private List<RackItem> m_rackItems = null;

        public Rack Rack
        {
            get { return m_rack; }
            set { m_rack = value; }
        }

        public List<RackItem> RackItems
        {
            get { return m_rackItems; }
            set { m_rackItems = value; }
        }
    }
}
