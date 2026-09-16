using DCOP.Model;

namespace DCOP.BLL.Models.Response
{
    public class ResponseItemData : MessageResult
    {
        private ItemData m_itemData = null;

        public ItemData ItemData
        {
            get { return m_itemData; }
            set { m_itemData = value; }
        }

        public ResponseItemData()
            : base()
        {
        }

        public ResponseItemData(bool success, string message)
            : base(success, message)
        {
        }
    }
}
