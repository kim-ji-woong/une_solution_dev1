using Base.Model.Common.Team;

namespace Base.TeamEditor.IBLL.Request
{
    public class RequestUpdateTemporaryTeam
    {
        private Temporary m_temporaryTeam = null;

        public Temporary TemporaryTeam
        {
            get { return m_temporaryTeam; }
            set { m_temporaryTeam = value; }
        }
    }
}
