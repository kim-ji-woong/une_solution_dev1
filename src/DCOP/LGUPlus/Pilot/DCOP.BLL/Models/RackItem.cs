using System;
using DCOP.Model;

namespace DCOP.BLL.Models
{
    public class RackItem : IComparable
    {
        private int m_nUPos = 0;
        private Item m_item = null;
        private ItemType m_itemType = null;
        private EquipmentType m_equipmentType = null;

        public int UPos
        {
            get { return m_nUPos; }
            set { m_nUPos = value; }
        }

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

        public int CompareTo(object obj)
        {
            RackItem rackItem = (RackItem)obj;
            return m_nUPos.CompareTo(rackItem.m_nUPos);
        }

        public RackItem()
        {
        }

        public RackItem(int uPos, Item item, ItemType itemType, EquipmentType equipmentType)
        {
            m_nUPos = uPos;
            m_item = item;
            m_itemType = itemType;
            m_equipmentType = equipmentType;
        }
    }
}
