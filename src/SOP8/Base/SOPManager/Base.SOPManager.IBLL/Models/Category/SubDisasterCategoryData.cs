using System.Collections.Generic;
using Base.Model.Sop.Category;

namespace Base.SOPManager.IBLL.Models.Category
{
    public class SubDisasterCategoryData
    {
        private MiddleClass m_subDisasterCategory = null;
        private List<VersionDisasterData> m_disasterDatas = new List<VersionDisasterData>();
        
        public MiddleClass SubDisasterCategory
        {
            get { return m_subDisasterCategory; }
            set { m_subDisasterCategory = value; }
        }

        public List<VersionDisasterData> DisasterDatas
        {
            get { return m_disasterDatas; }
        }
    }
}
