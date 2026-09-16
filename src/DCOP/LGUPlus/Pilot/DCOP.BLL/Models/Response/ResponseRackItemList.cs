using System;
using System.Collections.Generic;
using DCOP.Model;

namespace DCOP.BLL.Models.Response
{
    public class ResponseRackItemList : MessageResult
    {
        private List<ItemEx> m_items = new List<ItemEx>();
        private int m_nTotalCount = 0;

        public List<ItemEx> Items
        {
            get { return m_items; }
            set { m_items = value; }
        }

        public int TotalCount
        {
            get { return m_nTotalCount; }
            set { m_nTotalCount = value; }
        }

        public ResponseRackItemList()
            : base()
        {
        }

        public ResponseRackItemList(bool success, string message)
            : base(success, message)
        {
        }
    }

    public class ItemEx : Item, IComparable
    {
        private int m_nUPos = 0;
        private ItemType m_itemType = null;
        private string m_strEquipmentTypeName = "";
        private int m_nRackNo = 0;
        private string m_strCompanyName = "";
        private string m_strCategoryName = "";
        // 온도(도)
        private double m_dTemperature = 0;
        private DateTime m_dtTemperatureUpdate = new DateTime();
        // 소모전력(%)
        private double m_dPower = 0;
        private DateTime m_dtPowerUpdate = new DateTime();

        public int UPos
        {
            get { return m_nUPos; }
            set { m_nUPos = value; }
        }

        public int RackNo
        {
            get { return m_nRackNo; }
            set { m_nRackNo = value; }
        }

        public ItemType ItemType
        {
            get { return m_itemType; }
            set { m_itemType = value; }
        }

        public string EquipmentTypeName
        {
            get { return m_strEquipmentTypeName; }
            set { m_strEquipmentTypeName = value; }
        }

        public string CompanyName
        {
            get { return m_strCompanyName; }
            set { m_strCompanyName = value; }
        }

        public string CategoryName
        {
            get { return m_strCategoryName; }
            set { m_strCategoryName = value; }
        }

        // 온도(도)
        public double Temperature
        {
            get { return m_dTemperature; }
            set { m_dTemperature = value; }
        }

        public DateTime TemperatureUpdateTime
        {
            get { return m_dtTemperatureUpdate; }
            set { m_dtTemperatureUpdate = value; }
        }

        // 소모전력(%)
        public double Power
        {
            get { return m_dPower; }
            set { m_dPower = value; }
        }

        public DateTime PowerUpdateTime
        {
            get { return m_dtPowerUpdate; }
            set { m_dtPowerUpdate = value; }
        }

        public ItemEx()
        {
        }

        public ItemEx(Item item)
        {
            SetItem(item);
        }

        public ItemEx(Item item, Item_RU itemRU, ItemType itemType, EquipmentType equipmentType, EquipmentCategory equipmentCategory)
        {
            SetItem(item);
            m_itemType = itemType;
            m_strEquipmentTypeName = equipmentType.EquipmentTypeName;
            m_strCategoryName = equipmentCategory.EquipmentCategoryName;
            m_nRackNo = itemRU.RackNo;
            m_nUPos = itemRU.UPos;
        }

        public void SetItem(Item item)
        {
            this.ItemNo = item.ItemNo;
            this.ItemName = item.ItemName;
            this.DataCenterNo = item.DataCenterNo;
            this.ItemTypeNo = item.ItemTypeNo;
            this.RegTime = item.RegTime;
            this.Barcode = item.Barcode;
        }

        public int CompareTo(object obj)
        {
            ItemEx itemEx = (ItemEx)obj;
            return this.UPos.CompareTo(itemEx.UPos);
        }
    }
}
