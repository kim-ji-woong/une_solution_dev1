namespace Sop7ToSop8.Migration.Spatial
{
    class SpatialManager
    {
        private IMigrationClient m_client = null;
        private int m_nSop8SiteNo = -1;
        
        public SpatialManager(IMigrationClient client, int sop8SiteNo)
        {
            m_client = client;
            m_nSop8SiteNo = sop8SiteNo;
        }

        public bool Run()
        {
            BuildingGroupManager buildingGroupManager = new BuildingGroupManager(m_client, m_nSop8SiteNo);

            if (buildingGroupManager.Run() == false)
                return false;

            BuildingManager buildingManager = new BuildingManager(m_client, m_nSop8SiteNo);

            if (buildingManager.Run() == false)
                return false;

            ZoneManager zoneManager = new ZoneManager(m_client, m_nSop8SiteNo);

            if (zoneManager.Run() == false)
                return false;

            EquipmentZoneManager equipZoneManager = new EquipmentZoneManager(m_client, m_nSop8SiteNo);

            if (equipZoneManager.Run() == false)
                return false;

            FakeWallManager fakeWallManager = new FakeWallManager(m_client, m_nSop8SiteNo);

            if (fakeWallManager.Run() == false)
                return false;

            return true;
        }
    }
}
