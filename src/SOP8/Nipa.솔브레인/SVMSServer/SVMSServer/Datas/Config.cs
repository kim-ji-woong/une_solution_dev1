using System.Configuration;

namespace SVMSServer.Datas
{
    class CustomSettingsSection : ConfigurationSection
    {
        [ConfigurationProperty("Site")]
        public CategoryElement Site => (CategoryElement)this["Site"];

        [ConfigurationProperty("SVMS")]
        public CategoryElement SVMS => (CategoryElement)this["SVMS"];
    }

    class CategoryElement : ConfigurationElement
    {
        [ConfigurationProperty("", IsDefaultCollection = true)]
        public KeyValueConfigurationCollection Settings =>
            (KeyValueConfigurationCollection)this[string.Empty];
    }

    class Site
    {
        public int No { get; set; }
        public string DbName { get; set; }
        public int DbType { get; set; }
        public string DbHost { get; set; }
        public string DbId { get; set; }
        public string DbPw { get; set; }

        public string DbName_Power { get; set; }
        public string DbHost_Power { get; set; }
        public string DbId_Power { get; set; }
        public string DbPw_Power { get; set; }

        public string DbName_Facility { get; set; }
        public string DbHost_Facility { get; set; }
        public string DbId_Facility { get; set; }
        public string DbPw_Facility { get; set; }
    }

    class SVMS
    {
        public string IP { get; set; }
        public int Port { get; set; }
        public string ID { get; set; }
        public string Password { get; set; }
        public string WebRTC_Name { get; set; }
        public string WebRTC_Path { get; set; }
        public string WebRTC_Config { get; set; }
        public string go2rtc_Name { get; set; }
        public string go2rtc_Path { get; set; }
        public string go2rtc_Config { get; set; }
        public string WebRTC_URL { get; set; }
        public string go2rtc_URL { get; set; }
    }
}
