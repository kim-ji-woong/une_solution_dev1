using System.Collections.Generic;
using Response;
using Base.Model.Common.Team;
using Base.TeamEditor.IBLL.Models;

namespace Base.TeamEditor.IBLL.Response
{
    public class ResponseDisplayRegular : MessageResult
    {
        private List<Regular> m_regulars = new List<Regular>();
        private List<TeamMemberCount> m_memberCounts = new List<TeamMemberCount>();

        public List<Regular> Regulars
        {
            get { return m_regulars; }
            set { m_regulars = value; }
        }

        public List<TeamMemberCount> MemberCounts
        {
            get { return m_memberCounts; }
            set { m_memberCounts = value; }
        }
        
        public ResponseDisplayRegular()
            : base()
        {
        }

        public ResponseDisplayRegular(bool success, string message)
            : base(success, message)
        {
        }
    }
}
