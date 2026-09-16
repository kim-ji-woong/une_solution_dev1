using System.Collections.Generic;
using Base.Model.Sop.Category;

namespace Base.SOPManager.IBLL.Models
{
    using Category;

    public class SOPData
    {
        private LargeClass m_disasterCategory = null;
        private MiddleClass m_subDisasterCategory = null;
        private SmallClass m_disaster = null;
        private Model.Sop.Category.Version m_version = null;
        private List<ActionStepData> m_actionStepDatas = new List<ActionStepData>();

        public LargeClass DisasterCategory
        {
            get { return m_disasterCategory; }
            set { m_disasterCategory = value; }
        }

        public MiddleClass SubDisasterCategory
        {
            get { return m_subDisasterCategory; }
            set { m_subDisasterCategory = value; }
        }

        public SmallClass Disaster
        {
            get { return m_disaster; }
            set { m_disaster = value; }
        }

        public Model.Sop.Category.Version Version
        {
            get { return m_version; }
            set { m_version = value; }
        }

        public List<ActionStepData> ActionStepDatas
        {
            get { return m_actionStepDatas; }
            set { m_actionStepDatas = value; }
        }
    }
}
