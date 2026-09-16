namespace BusanSensorServer.Config
{
    public class Site
    {
        public string No { get; set; }
        public string DBName { get; set; }
        public string DBType { get; set; }
        public string DBHost { get; set; }
        public string DBID { get; set; }
        public string DBPw { get; set; }
            
        public string ExternalDBType { get; set; }
        public string ExternalDBHost { get; set; }
        public string ExternalDBName { get; set; }
        public string ExternalDBID { get; set; }
        public string ExternalDBPW { get; set; }
            
    }

    public class Log
    {
        public string LogFolder { get; set; }
        public int LogLifeTime { get; set; }
        public string LogFileTag { get; set; }
    }
}