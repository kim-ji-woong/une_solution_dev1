using Microsoft.Extensions.Configuration;
using Base.Controller.Options;
using System.Collections.Generic;

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
        private int? m_dbType = null;
        private bool m_useWorker = false;
        private string m_strWebAPIServerURL = "";
        private string m_strProjectType = null;
        private List<int> m_zoneNos = null;
        private Sensors m_sensors = null;

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
            get { return m_dbType; }
            set { m_dbType = value; }
        }

        public bool UseWorker
        {
            get { return m_useWorker; }
            set { m_useWorker = value; }
        }
        
        public string WebAPIServerURL
        {
            get { return m_strWebAPIServerURL; }
            set { m_strWebAPIServerURL = value; }
        }

        public string ProjectType
        {
            get { return m_strProjectType; }
            set { m_strProjectType = value; }
        }

        public List<int> ZoneNos
        {
            get { return m_zoneNos; }
            set { m_zoneNos = value; }
        }

        public Sensors Sensors
        {
            get { return m_sensors; }
            set { m_sensors = value; }
        }


        public void ReadConfig(IConfiguration config, string strHeader = "Site")
        {
            ReadString(config, strHeader + ":DBName", ref m_strDBName);
            ReadInt(config, strHeader + ":DBType", ref m_dbType);

            ReadString(config, strHeader + ":WebServerURL", ref m_strWebServerURL);
            ReadString(config, strHeader + ":SOPWebServerURL", ref m_strSOPWebServerURL);
            ReadString(config, strHeader + ":StreamServerURL", ref m_strStreamServerURL);
            ReadString(config, strHeader + ":externalLogin", ref m_strExternalLogin);
            ReadString(config, strHeader + ":WebAPIServerURL", ref m_strWebAPIServerURL);

            string strAutoLogin = config[strHeader + ":AutoLogin"];

            if (strAutoLogin != null && strAutoLogin.Trim().Length > 0)
            {
                strAutoLogin = strAutoLogin.ToLower().Trim();

                if (strAutoLogin == "true")
                    AutoLogin = true;
                else if (strAutoLogin == "false")
                    AutoLogin = false;
            }

            string strUseWorker = config["ui:useWorker"];

            if (strUseWorker != null && strUseWorker.Trim().Length > 0)
            {
                bool? useWorkerInfo = PasswordPolicy.GetBooleanValue(strUseWorker);

                if (useWorkerInfo != null)
                    m_useWorker = (bool)useWorkerInfo;
            }

            ReadProjectOptions(config);
        }

        private void ReadProjectOptions(IConfiguration config)
        {
            string strProjectType = config["ui:projectType"];

            if (strProjectType != null && strProjectType.Trim().Length > 0)
            {
                m_strProjectType = strProjectType.Trim();
            }

            m_zoneNos = config.GetSection("ui:zoneNos").Get<List<int>>();
            m_sensors = Sensors.ReadConfig(config);
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

    public class Sensors
    {
        private PermitZones m_permitZones = null;
        private List<int> m_permitSensorNos = null;

        public PermitZones PermitZones
        {
            get { return m_permitZones; }
            set { m_permitZones = value; }
        }

        public List<int> PermitSensorNo
        {
            get { return m_permitSensorNos; }
            set { m_permitSensorNos = value; }
        }

        public static Sensors ReadConfig(IConfiguration config)
        {
            List<int> zoneNos = config.GetSection("ui:sensors:permitZones:zoneNo").Get<List<int>>();
            List<int> exceptSensorNos = config.GetSection("ui:sensors:permitZones:exceptSensorNo").Get<List<int>>();
            List<int> permitSensorNos = config.GetSection("ui:sensors:permitSensorNo").Get<List<int>>();

            if (zoneNos == null && exceptSensorNos == null && permitSensorNos == null)
                return null;

            PermitZones permitZones = new PermitZones();

            if (zoneNos != null)
                permitZones.ZoneNo = zoneNos;

            if (exceptSensorNos != null)
                permitZones.ExceptSensorNo = exceptSensorNos;

            Sensors sensors = new Sensors();
            sensors.PermitZones = permitZones;

            if (permitSensorNos != null)
                sensors.PermitSensorNo = permitSensorNos;

            return sensors;
        }
    }

    public class PermitZones
    {
        private List<int> m_zoneNos = null;
        private List<int> m_exceptSensorNos = null;

        public List<int> ZoneNo
        {
            get { return m_zoneNos; }
            set { m_zoneNos = value; }
        }

        public List<int> ExceptSensorNo
        {
            get { return m_exceptSensorNos; }
            set { m_exceptSensorNos = value; }
        }
    }
}
