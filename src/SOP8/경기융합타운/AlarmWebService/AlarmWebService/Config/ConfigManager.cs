using Microsoft.Extensions.Configuration;

namespace AlarmWebService.Config
{
    public class ConfigManager
    {
        private Database m_db = new Database();

        public Database Database
        {
            get { return m_db; }
        }

        public void ReadConfig(IConfiguration config)
        {
            m_db.ReadConfig(config);
        }
    }
}
