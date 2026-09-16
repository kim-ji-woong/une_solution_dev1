using System.Collections.Generic;
using DCOP.Model;

namespace DCOP.BLL.Models.Response
{
    public class ResponseItemTypeList : MessageResult
    {
        private List<ItemTypeEx> m_itemTypes = new List<ItemTypeEx>();
        private int m_nTotalCount = 0;

        public List<ItemTypeEx> ItemTypes
        {
            get { return m_itemTypes; }
            set { m_itemTypes = value; }
        }

        public int TotalCount
        {
            get { return m_nTotalCount; }
            set { m_nTotalCount = value; }
        }

        public ResponseItemTypeList()
            : base()
        {
        }

        public ResponseItemTypeList(bool success, string message)
            : base(success, message)
        {
        }
    }

    public class ItemTypeEx : ItemType
    {
        private Company m_company = null;
        private string m_strCategoryName = null;
        private string m_strEquipmentTypeName = null;

        public Company Company
        {
            get { return m_company; }
            set { m_company = value; }
        }

        public string CategoryName
        {
            get { return m_strCategoryName; }
            set { m_strCategoryName = value; }
        }

        public string EquipmentTypeName
        {
            get { return m_strEquipmentTypeName; }
            set { m_strEquipmentTypeName = value; }
        }

        public ItemTypeEx()
        {
        }

        public ItemTypeEx(ItemType itemType, Company company, EquipmentCategory equipmentCategory, EquipmentType equipmentType)
        {
            SetItemType(itemType);
            m_company = company;
            m_strCategoryName = equipmentCategory.EquipmentCategoryName;
            m_strEquipmentTypeName = equipmentType.EquipmentTypeName;
        }

        private void SetItemType(ItemType itemType)
        {
            this.ItemTypeNo = itemType.ItemTypeNo;
            this.EquipmentTypeNo = itemType.EquipmentTypeNo;
            this.CompanyNo = itemType.CompanyNo;
            this.ModelName = itemType.ModelName;
            this.Height = itemType.Height;
            this.Width = itemType.Width;
            this.Depth = itemType.Depth;
            this.Unit = itemType.Unit;
            this.ImageUrl = itemType.ImageUrl;
            this.GlbUrl = itemType.GlbUrl;
            this.FbxUrl = itemType.FbxUrl;
            this.RegTime = itemType.RegTime;
            this.Type = itemType.Type;
        }
    }
}
