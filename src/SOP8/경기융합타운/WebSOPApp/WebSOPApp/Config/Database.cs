using Microsoft.Extensions.Configuration;

namespace WebSOPApp.Config
{
    public class Database
    {
        private string m_strDbHost = "";
        private string m_strDBName = "";
        private int m_nDBType = 0;
        private string m_strDbID = "";
        private string m_strDbPw = "";
        public string DbHost
        {
            get { return m_strDbHost; }
            set { m_strDbHost = value; }
        }
        public string DBName
        {
            get { return m_strDBName; }
            set { m_strDBName = value; }
        }
        public int DBType
        {
            get { return m_nDBType; }
            set { m_nDBType = value; }
        }
        public string DbID
        {
            get { return m_strDbID; }
            set { m_strDbID = value; }
        }
        public string DbPw
        {
            get { return m_strDbPw; }
            set { m_strDbPw = value; }
        }

        private string key = new string(new char[] { 'a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm', 'n', 'o', 'p', 'q', 'r', 's', 't', 'u', 'v', 'w', 'x', 'y', 'z', '1', '2', '3', '4', '5', '6' });
        public void ReadConfig(IConfiguration config, string strHeader = "Site")
        {
            string strDBType = config[strHeader + ":DBType"];
            string strDbHost = config[strHeader + ":DbHost"];
            string strDBName = config[strHeader + ":DBName"];
            string strDbID = config[strHeader + ":DbID"];
            string strDbPw = config[strHeader + ":DbPw"];

            if (strDBType == null || strDbHost == null || strDBName == null || strDbID == null || strDbPw == null)
                return;

            int nDBType;

            if (int.TryParse(strDBType.Trim(), out nDBType) == false)
                return;

            m_nDBType = nDBType;
            m_strDbHost = dnsDBUtil.AES256Cipher.AES_decrypt(strDbHost, key);
            m_strDBName = dnsDBUtil.AES256Cipher.AES_decrypt(strDBName, key);
            m_strDbID = dnsDBUtil.AES256Cipher.AES_decrypt(strDbID, key);
            m_strDbPw = dnsDBUtil.AES256Cipher.AES_decrypt(strDbPw, key);
        }
    }
}
