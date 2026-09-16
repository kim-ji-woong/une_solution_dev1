using Base.Model.Common.Team;

namespace Base.TeamEditor.IBLL.Request
{
    public class RequestUpdateRegularTeam
    {
        private Regular m_regularTeam = null;

        public Regular RegularTeam
        {
            get { return m_regularTeam; }
            set { m_regularTeam = value; }
        }
    }
}
