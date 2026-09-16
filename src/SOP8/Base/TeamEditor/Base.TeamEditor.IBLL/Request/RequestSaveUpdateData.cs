using System;
using System.Collections.Generic;
using Base.Model.Common.Team;

namespace Base.TeamEditor.IBLL.Request
{
    public class RequestSaveUpdateData
    {
        private List<Regular> m_addRegular = null;
        private List<Regular> m_updateRegular = null;
        private List<Regular> m_removeRegular = null;
        private List<RegularMember> m_addRegularMembers = null;
        private List<RegularMember> m_updateRegularMembers = null;
        private List<RegularMember> m_removeRegularMembers = null;

        private List<Temporary> m_addTemporary = null;
        private List<Temporary> m_updateTemporary = null;
        private List<Temporary> m_removeTemporary = null;

        private List<TemporaryMember> m_addTemporaryMembers = null;
        private List<TemporaryMember> m_updateTemporaryMembers = null;
        private List<TemporaryMember> m_removeTemporaryMembers = null;

        private int m_nSiteNo = -1;

        public List<Regular> AddRegular
        {
            get { return m_addRegular; }
            set { m_addRegular = value; }
        }

        public List<Regular> UpdateRegular
        {
            get { return m_updateRegular; }
            set { m_updateRegular = value; }
        }

        public List<Regular> RemoveRegular
        {
            get { return m_removeRegular; }
            set { m_removeRegular = value; }
        }

        public List<RegularMember> AddRegularMembers
        {
            get { return m_addRegularMembers; }
            set { m_addRegularMembers = value; }
        }

        public List<RegularMember> UpdateRegularMembers
        {
            get { return m_updateRegularMembers; }
            set { m_updateRegularMembers = value; }
        }

        public List<RegularMember> RemoveRegularMembers
        {
            get { return m_removeRegularMembers; }
            set { m_removeRegularMembers = value; }
        }


        public List<Temporary> AddTemporary
        {
            get { return m_addTemporary; }
            set { m_addTemporary = value; }
        }

        public List<Temporary> UpdateTemporary
        {
            get { return m_updateTemporary; }
            set { m_updateTemporary = value; }
        }

        public List<Temporary> RemoveTemporary
        {
            get { return m_removeTemporary; }
            set { m_removeTemporary = value; }
        }

        public List<TemporaryMember> AddTemporaryMembers
        {
            get { return m_addTemporaryMembers; }
            set { m_addTemporaryMembers = value; }
        }

        public List<TemporaryMember> UpdateTemporaryMembers
        {
            get { return m_updateTemporaryMembers; }
            set { m_updateTemporaryMembers = value; }
        }

        public List<TemporaryMember> RemoveTemporaryMembers
        {
            get { return m_removeTemporaryMembers; }
            set { m_removeTemporaryMembers = value; }
        }

        public int SiteNo
        {
            get { return m_nSiteNo; }
            set { m_nSiteNo = value; }
        }
    }
}
