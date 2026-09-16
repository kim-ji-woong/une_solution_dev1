using Microsoft.Extensions.Configuration;

namespace SoulbrainWebAPIServer.Config
{
    public class Database : Config
    {
        private int? m_nSiteID = null;
        private int? m_nDbType = null;
        private string m_strHost = "";
        private string m_strDbName = "";
        private string m_strUserName = "";
        private string m_strPassword = "";
        
        public int? SiteID
        {
            get { return m_nSiteID; }
            set { m_nSiteID = value; }
        }
        public int? DBType
        {
            get { return m_nDbType; }
            set { m_nDbType = value; }
        }
        public string Host
        {
            get { return m_strHost; }
            set { m_strHost = value; }
        }
        public string DbName
        {
            get { return m_strDbName; }
            set { m_strDbName = value; }
        }
        public string UserName
        {
            get { return m_strUserName; }
            set { m_strUserName = value; }
        }
        public string Password
        {
            get { return m_strPassword; }
            set { m_strPassword = value; }
        }
        
        public void ReadConfig(IConfiguration config, string strSection = "Database")
        {
            int? nSiteID = null;
            int? nDbType = null;
            
            ReadInt(config, $@"{strSection}:SiteID", ref nSiteID);
            ReadInt(config, $@"{strSection}:DBType", ref nDbType);
            ReadString(config, $@"{strSection}:Host", ref m_strHost);
            ReadString(config, $@"{strSection}:DbName", ref m_strDbName);
            ReadString(config, $@"{strSection}:UserName", ref m_strUserName);
            ReadString(config, $@"{strSection}:Password", ref m_strPassword);

            if (nSiteID.HasValue)
                m_nSiteID = nSiteID.Value;
            
            if (nDbType.HasValue)
                m_nDbType = nDbType.Value;
            
        }
    }
    
    public class Config
    {
        protected void ReadString(IConfiguration config, string strTarget, ref string strValue)
        {
            string strData = config[strTarget];

            if (strData != null)
                strValue = strData.Trim();
        }

        protected void ReadInt(IConfiguration config, string strTarget, ref int? nValue)
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