using System.Collections.Generic;
using Base.Model.Common.Team;

namespace Base.TeamEditor.IBLL.Request
{
    public class RequestRemoveRegularMember
    {
        private List<RegularMember> m_members = null;
        public List<RegularMember> Members
        {
            get { return m_members; }
            set { m_members = value; }
        }
    }
}
