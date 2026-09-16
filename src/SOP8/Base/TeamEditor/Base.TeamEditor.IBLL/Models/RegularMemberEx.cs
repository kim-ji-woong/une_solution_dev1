using Base.Model.Common.Team;

namespace Base.TeamEditor.IBLL.Models
{
    public class RegularMemberEx : RegularMember
    {
        private bool m_hasUserInfo = false;

        public bool HasUserInfo
        {
            get { return m_hasUserInfo; }
            set { m_hasUserInfo = value; }
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
