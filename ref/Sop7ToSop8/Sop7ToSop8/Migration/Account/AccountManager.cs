namespace Sop7ToSop8.Migration.Account
{
    class AccountManager
    {
        private IMigrationClient m_client = null;
        private int m_nSop8SiteNo = -1;

        public AccountManager(IMigrationClient client, int sop8SiteNo)
        {
            m_client = client;
            m_nSop8SiteNo = sop8SiteNo;
        }

        public bool Run()
        {
            GradeManager gradeManager = new GradeManager(m_client, m_nSop8SiteNo);

            if (gradeManager.Run() == false)
                return false;

            UserManager userManager = new UserManager(m_client, m_nSop8SiteNo);

            if (userManager.Run() == false)
                return false;

            // Account Option은 옮길 필요 없음
            /*OptionManager optionManager = new OptionManager(m_client);

            if (optionManager.Run() == false)
                return false;*/

            return true;
        }
    }
}
