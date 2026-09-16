using Microsoft.Extensions.Configuration;

namespace WebSOPApp.Config
{
    public class ConfigManager
    {
        private Site m_site = new Site();
        private Site m_siteBase = new Site();
        private Database m_db = new Database();
        private Database m_dbBase = new Database();

        public Site Site
        {
            get { return m_site; }
        }

        public Site BaseSite
        {
            get { return m_siteBase; }
        }

        public Database DB
        {
            get { return m_db; }
        }
        public Database BaseDB
        {
            get { return m_dbBase; }
        }

        public void ReadConfig(IConfiguration config)
        {
            m_site.ReadConfig(config);
            m_siteBase.ReadConfig(config, "Site_New");
            m_db.ReadConfig(config);
            m_dbBase.ReadConfig(config, "Site_New");
        }
    }
}
