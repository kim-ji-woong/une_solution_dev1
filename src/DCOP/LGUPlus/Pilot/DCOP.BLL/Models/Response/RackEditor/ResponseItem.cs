using System;
using System.Collections.Generic;
using DCOP.Model;

namespace DCOP.BLL.Models.Response.RackEditor
{
    public class ResponseItem : MessageResult
    {
        private Item m_item = null;
        private ItemType m_itemType = null;
        private EquipmentType m_equipmentType = null;

        public Item Item
        {
            get { return m_item; }
            set { m_item = value; }
        }

        public ItemType ItemType
        {
            get { return m_itemType; }
            set { m_itemType = value; }
        }

        public EquipmentType EquipmentType
        {
            get { return m_equipmentType; }
            set { m_equipmentType = value; }
        }

        public ResponseItem()
            : base()
        {
        }

        public ResponseItem(bool success, string message)
            : base(success, message)
        {
        }
    }
}
