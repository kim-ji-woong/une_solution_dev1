using Microsoft.Extensions.Configuration;

namespace WebSOPApp.Config
{
    public class ConfigManager
    {
        private Site m_site = new Site();
        private Database m_db = new Database();
        private PasswordPolicy m_passwordPolicy = new PasswordPolicy();

        public Site Site
        {
            get { return m_site; }
        }

        public Database DB
        {
            get { return m_db; }
        }
        
        public PasswordPolicy PasswordPolicy
        {
            get { return m_passwordPolicy; }
        }

        public void ReadConfig(IConfiguration config)
        {
            m_site.ReadConfig(config);
            m_db.ReadConfig(config);
            m_passwordPolicy.ReadConfig(config);
        }
    }
}
