namespace GwangyangSensorService.Config
{
    public sealed class SiteOptions
    {
        public string DBName { get; set; } = string.Empty;
        public int DBType { get; set; }
        public string DbHost { get; set; } = string.Empty;
        public string DbID { get; set; } = string.Empty;
        public string DbPw { get; set; } = string.Empty;
        public string SOPWebServerURL { get; set; } = string.Empty;
    }
}
