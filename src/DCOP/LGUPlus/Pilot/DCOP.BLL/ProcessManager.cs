using dnsDapperDBUtil.DataAccessLayer.IDAL;

namespace DCOP.BLL
{
    public class ProcessManager
    {
        private IDataManager m_dataManager = null;

        public AccountManager AccountManager
        {
            get
            {
                AccountManager accountManager = new AccountManager(m_dataManager, this);
                return accountManager;
            }
        }

        public DataCenterManager DataCenterManager
        {
            get
            {
                DataCenterManager dataCenterManager = new DataCenterManager(m_dataManager);
                return dataCenterManager;
            }
        }

        public WeatherManager WeatherManager
        {
            get
            {
                WeatherManager weatherManager = new WeatherManager(m_dataManager);
                return weatherManager;
            }
        }

        public AlarmManager AlarmManager
        {
            get
            {
                AlarmManager alarmManager = new AlarmManager(m_dataManager);
                return alarmManager;
            }
        }

        public RackEditorManager RackEditorManager
        {
            get
            {
                RackEditorManager rackEditorManager = new RackEditorManager(m_dataManager);
                return rackEditorManager;
            }
        }

        public ProcessManager(IDataManager dataManager)
        {
            m_dataManager = dataManager;
        }
    }
}
