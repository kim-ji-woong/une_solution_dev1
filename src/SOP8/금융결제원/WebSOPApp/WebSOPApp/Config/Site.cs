using Microsoft.Extensions.Configuration;
using Base.Controller.Options;

namespace WebSOPApp.Config
{
    public class Site : ILoginOption, IAlarmOption
    {
        private string m_strWebServerURL = "";
        private string m_strSOPWebServerURL = "";
        private string m_strStreamServerURL = "";
        private string m_strResourceRootPath = "";
        private string m_strExternalLogin = null;
        private bool m_autoLogin = false;
        private string m_strDBName = "";
        private int? m_nDBType = null;
        //private int? m_nSiteNo = null;
        private int? m_nWebSocketPort = null;

        public string WebServerURL
        {
            get { return m_strWebServerURL; }
            set { m_strWebServerURL = value; }
        }

        public string SOPWebServerURL
        {
            get { return m_strSOPWebServerURL; }
            set { m_strSOPWebServerURL = value; }
        }

        public string StreamServerUrl
        {
            get { return m_strStreamServerURL; }
            set { m_strStreamServerURL = value; }
        }

        public string ResourceRootPath
        {
            get { return m_strResourceRootPath; }
            set { m_strResourceRootPath = value; }
        }

        public string ExternalLoginUrl
        {
            get { return m_strExternalLogin; }
            set { m_strExternalLogin = value; }
        }

        public bool AutoLogin
        {
            get { return m_autoLogin; }
            set { m_autoLogin = value; }
        }

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

        /*public int? site_sn
        {
            get { return m_nSiteNo; }
            set { m_nSiteNo = value; }
        }*/

        public int? WebSocketPort
        {
            get { return m_nWebSocketPort; }
            set { m_nWebSocketPort = value; }
        }

        public void ReadConfig(IConfiguration config, string strHeader = "Site")
        {
            ReadString(config, strHeader + ":DBName", ref m_strDBName);
            ReadInt(config, strHeader + ":DBType", ref m_nDBType);
            //ReadInt(config, strHeader + ":ID", ref m_nSiteNo);

            ReadString(config, strHeader + ":WebServerURL", ref m_strWebServerURL);
            ReadString(config, strHeader + ":SOPWebServerURL", ref m_strSOPWebServerURL);
            ReadString(config, strHeader + ":StreamServerURL", ref m_strStreamServerURL);
            ReadString(config, strHeader + ":externalLogin", ref m_strExternalLogin);

            ReadInt(config, strHeader + ":webSocketPort", ref m_nWebSocketPort);

            string strAutoLogin = config[strHeader + ":AutoLogin"];

            if (strAutoLogin != null && strAutoLogin.Trim().Length > 0)
            {
                strAutoLogin = strAutoLogin.ToLower().Trim();

                if (strAutoLogin == "true")
                    AutoLogin = true;
                else if (strAutoLogin == "false")
                    AutoLogin = false;
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
