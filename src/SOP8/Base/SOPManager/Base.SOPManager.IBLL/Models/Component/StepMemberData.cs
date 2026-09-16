using System.Collections.Generic;
using Base.Model.Sop.Component;

namespace Base.SOPManager.IBLL.Models.Component
{
    public class StepMemberData
    {
        private StepMember m_stepMember = null;
        private List<SectionData> m_sections = new List<SectionData>();
        private List<_SectionData> m_rawSections = new List<_SectionData>();
        private List<ArrowData> m_arrows = new List<ArrowData>();
        private List<int> m_gridColumnWidth = new List<int>();
        private List<int> m_gridRowHeight = new List<int>();

        public StepMember StepMember
        {
            get { return m_stepMember; }
            set { m_stepMember = value; }
        }

        public List<SectionData> Sections
        {
            get { return m_sections; }
            set { m_sections = value; }
        }

        public List<_SectionData> RawSections
        {
            get { return m_rawSections; }
            set { m_rawSections = value; }
        }

        public List<ArrowData> Arrows
        {
            get { return m_arrows; }
            set { m_arrows = value; }
        }

        public List<int> GridColumnWidth
        {
            get { return m_gridColumnWidth; }
            set { m_gridColumnWidth = value; }
        }

        public List<int> GridRowHeight
        {
            get { return m_gridRowHeight; }
            set { m_gridRowHeight = value; }
        }
    }
}
