namespace Sop7ToSop8.Migration.Sop
{
    using Sop;

    class SopManager
    {
        private IMigrationClient m_client = null;
        private int m_nSop8SiteNo = -1;

        public SopManager(IMigrationClient client, int sop8SiteNo)
        {
            m_client = client;
            m_nSop8SiteNo = sop8SiteNo;
        }

        public bool Run()
        {
            LargeClassManager largeClassManager = new LargeClassManager(m_client, m_nSop8SiteNo);

            if (largeClassManager.Run() == false)
                return false;

            MiddleClassManager middleClassManager = new MiddleClassManager(m_client, m_nSop8SiteNo);

            if (middleClassManager.Run() == false)
                return false;

            VersionManager versionManager = new VersionManager(m_client, m_nSop8SiteNo);

            if (versionManager.Run() == false)
                return false;

            SmallClassManager smallClassManager = new SmallClassManager(m_client, m_nSop8SiteNo);

            if (smallClassManager.Run() == false)
                return false;

            ActionStepManager actionStepManager = new ActionStepManager(m_client, m_nSop8SiteNo);

            if (actionStepManager.Run() == false)
                return false;

            StepMemberManager stepMemberManager = new StepMemberManager(m_client, m_nSop8SiteNo);

            if (stepMemberManager.Run() == false)
                return false;

            GridManager gridManager = new GridManager(m_client, m_nSop8SiteNo);

            if (gridManager.Run() == false)
                return false;

            CommentManager commentManager = new CommentManager(m_client, m_nSop8SiteNo);

            if (commentManager.Run() == false)
                return false;

            DecisionManager decisionManager = new DecisionManager(m_client, m_nSop8SiteNo);

            if (decisionManager.Run() == false)
                return false;

            EndpointManager endpointManager = new EndpointManager(m_client, m_nSop8SiteNo);

            if (endpointManager.Run() == false)
                return false;

            ProcessManager processManager = new ProcessManager(m_client, m_nSop8SiteNo);

            if (processManager.Run() == false)
                return false;

            TransmissionManager transmissionManager = new TransmissionManager(m_client, m_nSop8SiteNo);

            if (transmissionManager.Run() == false)
                return false;

            ArrowManager arrowManager = new ArrowManager(m_client, m_nSop8SiteNo);

            if (arrowManager.Run() == false)
                return false;

            LinkedSopManager linkedSopManager = new LinkedSopManager(m_client, m_nSop8SiteNo);

            if (linkedSopManager.Run() == false)
                return false;

            SpecialMessageManager specialMessageManager = new SpecialMessageManager(m_client, m_nSop8SiteNo);

            if (specialMessageManager.Run() == false)
                return false;

            return true;
        }
    }
}
