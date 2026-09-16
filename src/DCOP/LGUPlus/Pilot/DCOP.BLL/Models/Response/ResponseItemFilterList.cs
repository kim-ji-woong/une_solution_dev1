using System.Collections.Generic;
using DCOP.Model;

namespace DCOP.BLL.Models.Response
{
    public class ResponseItemFilterList : MessageResult
    {
        private List<string> m_categoryNames = new List<string>();
        private List<string> m_equipmentTypeNames = new List<string>();
        private List<Company> m_companies = new List<Company>();
        private List<string> m_itemTypes = new List<string>();
        private List<int> m_units = new List<int>();

        public List<string> CategoryNames
        {
            get { return m_categoryNames; }
            set { m_categoryNames = value; }
        }

        public List<string> EquipmentTypeNames
        {
            get { return m_equipmentTypeNames; }
            set { m_equipmentTypeNames = value; }
        }

        public List<Company> Companies
        {
            get { return m_companies; }
            set { m_companies = value; }
        }

        public List<string> ItemTypes
        {
            get { return m_itemTypes; }
            set { m_itemTypes = value; }
        }

        public List<int> Units
        {
            get { return m_units; }
            set { m_units = value; }
        }

        public ResponseItemFilterList()
            : base()
        {
        }

        public ResponseItemFilterList(bool success, string message)
            : base(success, message)
        {
        }
    }
}
