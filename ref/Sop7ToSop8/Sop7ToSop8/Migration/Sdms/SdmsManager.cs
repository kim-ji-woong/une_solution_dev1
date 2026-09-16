namespace Sop7ToSop8.Migration.Sdms
{
    class SdmsManager
    {
        private IMigrationClient m_client = null;
        private int m_nSop8SiteNo = -1;

        public SdmsManager(IMigrationClient client, int sop8SiteNo)
        {
            m_client = client;
            m_nSop8SiteNo = sop8SiteNo;
        }

        public bool Run()
        {
            GltfModelManager gltfModelManager = new GltfModelManager(m_client, m_nSop8SiteNo);

            if (gltfModelManager.Run() == false)
                return false;

            GltfModelDataManager gltfModelDataManager = new GltfModelDataManager(m_client, m_nSop8SiteNo);

            if (gltfModelDataManager.Run() == false)
                return false;

            GltfModelOrthoDataManager gltfModelOrthoDataManager = new GltfModelOrthoDataManager(m_client, m_nSop8SiteNo);

            if (gltfModelOrthoDataManager.Run() == false)
                return false;

            return true;
        }
    }
}
