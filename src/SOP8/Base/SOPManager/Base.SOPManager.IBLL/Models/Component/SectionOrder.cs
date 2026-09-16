using System.Collections.Generic;

namespace Base.SOPManager.IBLL.Models.Component
{
    public class SectionOrder
    {
        private Model.Sop.Component.Component m_sectionData = null;
        private List<SectionOrder> m_nextSections = new List<SectionOrder>();

        public Model.Sop.Component.Component SectionData
        {
            get { return m_sectionData; }
            set { m_sectionData = value; }
        }

        public List<SectionOrder> NextSections
        {
            get { return m_nextSections; }
        }

        public SectionOrder()
        {
        }

        public SectionOrder(Model.Sop.Component.Component section)
        {
            m_sectionData = section;
        }
    }
}
