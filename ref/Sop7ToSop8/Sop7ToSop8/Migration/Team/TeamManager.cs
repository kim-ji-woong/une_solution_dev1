namespace Sop7ToSop8.Migration.Team
{
    class TeamManager
    {
        private IMigrationClient m_client = null;
        private int m_nSop8SiteNo = -1;

        public TeamManager(IMigrationClient client, int sop8SiteNo)
        {
            m_client = client;
            m_nSop8SiteNo = sop8SiteNo;
        }

        public bool Run()
        {
            OptionManager optionManager = new OptionManager(m_client);

            if (optionManager.Run() == false)
                return false;

            RegularTeamManager regularTeamManager = new RegularTeamManager(m_client, m_nSop8SiteNo);

            if (regularTeamManager.Run() == false)
                return false;

            RegularMemberManager regularMemberManager = new RegularMemberManager(m_client, m_nSop8SiteNo);

            if (regularMemberManager.Run() == false)
                return false;

            TemporaryTeamManager temporaryTeamManager = new TemporaryTeamManager(m_client, m_nSop8SiteNo);

            if (temporaryTeamManager.Run() == false)
                return false;

            TemporaryMemberManager temporaryMemberManager = new TemporaryMemberManager(m_client, m_nSop8SiteNo);

            if (temporaryMemberManager.Run() == false)
                return false;

            return true;
        }
    }
}
