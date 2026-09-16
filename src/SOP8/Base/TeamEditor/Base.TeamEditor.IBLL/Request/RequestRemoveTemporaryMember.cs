using System.Collections.Generic;
using Base.Model.Common.Team;

namespace Base.TeamEditor.IBLL.Request
{
    public class RequestRemoveTemporaryMember
    {
        private List<TemporaryMember> m_members = null;
        public List<TemporaryMember> Members
        {
            get { return m_members; }
            set { m_members = value; }
        }
    }
}
