namespace Sop7ToSop8.Migration.History
{
    class HistoryManager
    {
        private IMigrationClient m_client = null;
        private int m_nSop8SiteNo = -1;
        private SensorZoneHistoryManager m_sensorZoneHistoryManager = null;

        public SensorZoneHistoryManager SensorZoneHistoryManager
        {
            get { return m_sensorZoneHistoryManager; }
        }

        public HistoryManager(IMigrationClient client, int sop8SiteNo)
        {
            m_client = client;
            m_nSop8SiteNo = sop8SiteNo;
        }

        public bool Run()
        {
            m_sensorZoneHistoryManager = new SensorZoneHistoryManager(m_client, m_nSop8SiteNo);

            if (m_sensorZoneHistoryManager.Run() == false)
                return false;

            SensorReactionHistoryManager sensorReactionHistoryManager = new SensorReactionHistoryManager(m_client, m_nSop8SiteNo, m_sensorZoneHistoryManager);

            if (sensorReactionHistoryManager.Run() == false)
                return false;

            ActionStepHistoryManager actionStepHistoryManager = new ActionStepHistoryManager(m_client, m_nSop8SiteNo);

            if (actionStepHistoryManager.Run() == false)
                return false;

            ComponentHistoryManager componentHistoryManager = new ComponentHistoryManager(m_client, m_nSop8SiteNo);

            if (componentHistoryManager.Run() == false)
                return false;

            return true;
        }
    }
}
