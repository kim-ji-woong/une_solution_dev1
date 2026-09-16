using Microsoft.Extensions.Configuration;

namespace SoulbrainWebAPIServer.Config
{
    public class ConfigManager
    {
        private Database m_database = new Database();
        private WishDatabase m_wishDatabase = new WishDatabase();
        private Database m_database_power = new Database();
        private Database m_database_facility = new Database();
        private Log m_log = new Log();
        private ExcelPath m_excelPath = new ExcelPath();
        private SOPWebServer m_sopWebServer = new SOPWebServer();

        public Database Database
        {
            get { return m_database; }
            set { m_database = value; }
        }
        
        public WishDatabase WishDatabase
        {
            get { return m_wishDatabase; }
            set { m_wishDatabase = value; }
        }

        public Database Database_Power
        {
            get { return m_database_power; }
            set { m_database_power = value; }
        }
        public Database Database_Facility
        {
            get { return m_database_facility; }
            set { m_database_facility = value; }
        }
        
        public Log Log
        {
            get { return m_log; }
            set { m_log = value; }
        }
        
        public ExcelPath ExcelPath
        {
            get { return m_excelPath; }
            set { m_excelPath = value; }
        }
        
        public SOPWebServer SOPWebServer
        {
            get { return m_sopWebServer; }
            set { m_sopWebServer = value; }
        }

        public void ReadConfig(IConfiguration config)
        {
            m_database.ReadConfig(config);
            m_wishDatabase.ReadConfig(config, "WishDatabase");
            m_log.ReadConfig(config);
            m_excelPath.ReadConfig(config);
            m_sopWebServer.ReadConfig(config);

            // 초순수, 전력 DB 정보
            m_database_power.ReadConfig(config, "Database_Power");
            m_database_facility.ReadConfig(config, "Database_Facility");
        }
    }
}