using DapperSample.BLL.DataAccessLayer.IDAL;

namespace DapperSample.BLL
{
    public class ProcessManager
    {
        private LoadManager m_loadManager = null;
        private SaveManager m_saveManager = null;
        public LoadManager LoadManager { get { return m_loadManager; } }
        public SaveManager SaveManager { get { return m_saveManager; } }
        public ProcessManager(IDataManager2 dataManager)
        {
            m_loadManager = new LoadManager(dataManager);
            m_saveManager = new SaveManager(dataManager);
        }
    }
}
