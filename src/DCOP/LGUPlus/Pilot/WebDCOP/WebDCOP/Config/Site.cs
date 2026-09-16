using Microsoft.Extensions.Configuration;

namespace WebDCOP.Config
{
    class Site
    {
        private string m_strResourceRootPath = "";
        private string m_strExternalLogin = null;
        private bool? m_autoLogin = null;
        private string m_strDBName = "";
        private int? m_nDBType = null;
        private int? m_nWebSocketPort = null;
        private string m_strChartLicense = "";
        private string m_strMapLicense = "";
        private string m_str360Camera = null;

        public string ResourceRootPath
        {
            get { return m_strResourceRootPath; }
            set { m_strResourceRootPath = value; }
        }

        public string ExternalLogin
        {
            get { return m_strExternalLogin; }
            set { m_strExternalLogin = value; }
        }

        public bool? AutoLogin
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

        public int? WebSocketPort
        {
            get { return m_nWebSocketPort; }
            set { m_nWebSocketPort = value; }
        }

        public string ChartLicense
        {
            get { return m_strChartLicense; }
            set { m_strChartLicense = value; }
        }

        public string MapLicense
        {
            get { return m_strMapLicense; }
            set { m_strMapLicense = value; }
        }

        public string _360Camera
        {
            get { return m_str360Camera; }
            set { m_str360Camera = value; }
        }

        public void ReadConfig(IConfiguration config)
        {
            ReadString(config, "Site:DBName", ref m_strDBName);
            ReadInt(config, "Site:DBType", ref m_nDBType);

            ReadString(config, "Site:externalLogin", ref m_strExternalLogin);
            ReadString(config, "Site:chartLicense", ref m_strChartLicense);
            ReadString(config, "Site:mapLicense", ref m_strMapLicense);
            ReadString(config, "Site:360Camera", ref m_str360Camera);

            ReadInt(config, "Site:webSocketPort", ref m_nWebSocketPort);

            string strAutoLogin = config["Site:AutoLogin"];

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
