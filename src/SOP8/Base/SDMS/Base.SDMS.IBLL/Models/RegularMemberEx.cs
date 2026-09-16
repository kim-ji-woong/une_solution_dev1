using Base.Model.Common.Team;

namespace Base.SDMS.IBLL.Models
{
    public class RegularMemberEx : RegularMember
    {
        private string m_strTeamName = "";

        public string TeamName
        {
            get { return m_strTeamName; }
            set { m_strTeamName = value; }
        }

        public RegularMemberEx()
        {
        }

        public RegularMemberEx(RegularMember member)
        {
            this.FromCopy(member);
        }
    }
}
