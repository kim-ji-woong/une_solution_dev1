using System.Collections.Generic;
using Base.Model.Sop.Category;

namespace Base.SOPManager.IBLL.Models.Category
{
    public class DisasterCategoryData
    {
        private LargeClass m_disasterCategory = null;
        private List<SubDisasterCategoryData> m_subDisasterCategories = new List<SubDisasterCategoryData>();

        public LargeClass DisasterCategory
        {
            get { return m_disasterCategory; }
            set { m_disasterCategory = value; }
        }

        public List<SubDisasterCategoryData> SubDisasterCategories
        {
            get { return m_subDisasterCategories; }
        }
    }
}
