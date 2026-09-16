using System.Collections.Generic;

namespace Base.Account.IBLL.Models
{
    public class UserOption
    {
        private string m_strCategory = null;
        private string m_strSubCategory = null;
        private List<string> m_strValues = new List<string>();

        public string Category
        {
            get { return m_strCategory; }
            set { m_strCategory = value; }
        }

        public string SubCategory
        {
            get { return m_strSubCategory; }
            set { m_strSubCategory = value; }
        }

        public List<string> Values
        {
            get { return m_strValues; }
            set { m_strValues = value; }
        }
    }
}
