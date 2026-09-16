using System.Collections.Generic;
using Response;
using Base.Model.Common.Team;
using Base.TeamEditor.IBLL.Models;

namespace Base.TeamEditor.IBLL.Response
{
    public class ResponseDisplayTemporary : MessageResult
    {
        private List<Temporary> m_temporaries = new List<Temporary>();
        private List<TeamMemberCount> m_memberCounts = new List<TeamMemberCount>();

        public List<Temporary> Temporaries
        {
            get { return m_temporaries; }
            set { m_temporaries = value; }
        }

        public List<TeamMemberCount> MemberCounts
        {
            get { return m_memberCounts; }
            set { m_memberCounts = value; }
        }

        public ResponseDisplayTemporary()
            : base()
        {
        }

        public ResponseDisplayTemporary(bool success, string message)
            : base(success, message)
        {
        }
    }
}
