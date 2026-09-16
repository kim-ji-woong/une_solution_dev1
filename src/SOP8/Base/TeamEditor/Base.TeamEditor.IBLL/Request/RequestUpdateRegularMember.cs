using Base.Model.Common.Team;

namespace Base.TeamEditor.IBLL.Request
{
    public class RequestUpdateRegularMember
    {
        private RegularMember m_member = null;
        public RegularMember Member
        {
            get { return m_member; }
            set { m_member = value; }
        }
    }
}
