using Microsoft.Extensions.Configuration;

namespace SOPWebServer.Config
{
    public class ConfigManager
    {
        private Database m_db = new Database();
        private ExternalSop m_externalSop = new ExternalSop();
        private ExternalAccess m_externalAccess = new ExternalAccess();

        public Database Database
        {
            get { return m_db; }
        }

        public ExternalSop ExternalSop
        {
            get { return m_externalSop; }
        }

        public ExternalAccess ExternalAccess
        {
            get { return m_externalAccess; }
        }

        public void ReadConfig(IConfiguration config)
        {
            m_db.ReadConfig(config);
            m_externalSop.ReadConfig(config);
            m_externalAccess.ReadConfig(config);
        }
    }
}
