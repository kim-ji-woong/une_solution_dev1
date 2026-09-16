using Microsoft.Extensions.Configuration;

namespace SOPWebServer.Config
{
    public class Database
    {
        private string m_strDBName = "";
        private int? m_nDBType = null;
        private string m_strDbHost = "";
        private string m_strDbID = "";
        private string m_strDbPw = "";

        public string DBName
        {
            get { return m_strDBName; }
            set { m_strDBName = value; }
        }

        public int? DBType
        {
            get { return m_nDBType; }
            set { m_nDBType = value; }
        }

        public string DbHost
        {
            get { return m_strDbHost; }
            set { m_strDbHost = value; }
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

        public void ReadConfig(IConfiguration config)
        {
            ReadString(config, "Database:DBName", ref m_strDBName);
            ReadInt(config, "Database:DBType", ref m_nDBType);

            string strDbHost = null, strDbID = null, strDbPW = null;

            ReadString(config, "Database:DbHost", ref strDbHost);
            ReadString(config, "Database:DbID", ref strDbID);
            ReadString(config, "Database:DbPw", ref strDbPW);

            if (strDbHost != null && strDbID != null && strDbPW != null &&
                strDbHost.Trim().Length > 0 &&
                strDbID.Trim().Length > 0 &&
                strDbPW.Trim().Length > 0)
            {
                m_strDbHost = dnsDapperDBUtil.AES256Cipher.AES_decrypt(strDbHost);
                m_strDbID = dnsDapperDBUtil.AES256Cipher.AES_decrypt(strDbID);
                m_strDbPw = dnsDapperDBUtil.AES256Cipher.AES_decrypt(strDbPW);
            }
        }

        private void ReadString(IConfiguration config, string strTarget, ref string strValue)
        {
            string strData = config[strTarget];

            if (strData != null)
                strValue = strData.Trim();
        }

        private void ReadInt(IConfiguration config, string strTarget, ref int? nValue)
        {
            string strData = config[strTarget];

            if (strData != null)
            {
                int data;

                if (int.TryParse(strData.Trim(), out data))
                    nValue = data;
            }
        }
    }
}
