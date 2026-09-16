using Microsoft.Extensions.Configuration;

namespace WebDCOP.Config
{
    class ConfigManager
    {
        private Site m_site = new Site();
        private Database m_db = new Database();

        public Site Site
        {
            get { return m_site; }
        }

        public Database DB
        {
            get { return m_db; }
        }

        public void ReadConfig(IConfiguration config)
        {
            m_site.ReadConfig(config);
            m_db.ReadConfig(config);
        }
    }
}
