using Microsoft.Extensions.Configuration;

namespace GGHTService.Managers
{
    class ConfigManager
    {
        public static int SiteNo { get; set; }
        public static int DbType { get; set; }
        public static string DbHost { get; set; }
        public static string DbName { get; set; }
        public static string DbID { get; set; }
        public static string DbPw { get; set; }
        public static string SOPWebServerURL { get; set; }
        public static string LogFolder { get; set; }
        public static string LogFileTag { get; set; }
        public static int LogLifeDays { get; set; }

        public static void ReadConfig(IConfiguration configuration)
        {
            string strDBName = configuration["Site:DBName"];
            string strDBType = configuration["Site:DBType"];
            string strDBHost = configuration["Site:DbHost"];
            string strDbId = configuration["Site:DbID"];
            string strDbPw = configuration["Site:DbPw"];
            string strSOPWebServerURL = configuration["Site:SOPWebServerURL"];
            string strLogFolder = configuration["Site:LogFolder"];
            string strLogFileTag = configuration["Site:LogFileTag"];
            string strLogLifeDays = configuration["Site:LogLifeDays"];

            if (strDBHost != null && strDbId != null && strDbPw != null &&
                strDBHost.Trim().Length > 0 && strDbId.Trim().Length > 0 && strDbPw.Trim().Length > 0)
            {
                ConfigManager.DbHost = dnsDapperDBUtil.AES256Cipher.AES_decrypt(strDBHost);
                ConfigManager.DbName = dnsDapperDBUtil.AES256Cipher.AES_decrypt(strDBName);
                ConfigManager.DbID = dnsDapperDBUtil.AES256Cipher.AES_decrypt(strDbId);
                ConfigManager.DbPw = dnsDapperDBUtil.AES256Cipher.AES_decrypt(strDbPw);
                ConfigManager.SOPWebServerURL = strSOPWebServerURL;

                int nDBType;

                if (int.TryParse(strDBType.Trim(), out nDBType))
                {
                    ConfigManager.DbType = nDBType;
                }
            }

            if (strLogFolder != null && strLogFolder.Trim().Length > 0 &&
                strLogFileTag != null && strLogFileTag.Trim().Length > 0 &&
                strLogLifeDays != null && strLogLifeDays.Trim().Length > 0)
            {
                int lifeDays;

                if (int.TryParse(strLogLifeDays.Trim(), out lifeDays))
                {
                    ConfigManager.LogFolder = strLogFolder.Trim();
                    ConfigManager.LogFileTag = strLogFileTag.Trim();
                    ConfigManager.LogLifeDays = lifeDays;
                }
            }
        }
    }
}
