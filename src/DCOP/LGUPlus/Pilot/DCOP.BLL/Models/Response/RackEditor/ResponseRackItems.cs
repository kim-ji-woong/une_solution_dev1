using System.Collections.Generic;

namespace DCOP.BLL.Models.Response.RackEditor
{
    public class ResponseRackItems : MessageResult
    {
        private List<RackItem> m_items = new List<RackItem>();

        public List<RackItem> Items
        {
            get { return m_items; }
            set { m_items = value; }
        }

        public ResponseRackItems()
            : base()
        {
        }

        public ResponseRackItems(bool success, string message)
            : base(success, message)
        {
        }
    }
}
