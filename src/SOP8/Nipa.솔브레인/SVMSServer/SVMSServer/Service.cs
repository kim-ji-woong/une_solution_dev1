using System;
using System.Collections.Generic;
using System.Configuration;
using dnsDBUtil;

namespace SVMSServer
{
    using Datas;
    using SVMS;
    using DAL;
    using Process;

    class Service
    {
        private Site m_siteConfig = null;
        private Datas.SVMS m_svmsConfig = null;

        private SvmsManager m_svmsManager = null;

        private void LoadSetting()
        {
            m_siteConfig = LoadSiteConfig();
            m_svmsConfig = LoadSVMSConfig();

            Logger.Instance.Write(LogTypes.Info, "LoadSetting Surcess");
        }

        private Site LoadSiteConfig()
        {
            var section = (CustomSettingsSection)ConfigurationManager.GetSection("customSettings");
            string strSiteNo = section.Site.Settings["No"].Value;
            string strDbName = section.Site.Settings["DbName"].Value;
            string strDbType = section.Site.Settings["DbType"].Value;
            string strDbHost = section.Site.Settings["DbHost"].Value;
            string strDbId = section.Site.Settings["DbId"].Value;
            string strDbPw = section.Site.Settings["DbPw"].Value;

            // 초순수, 전력 DB 정보
            string strDbName_Power = section.Site.Settings["DbName_Power"].Value;
            string strDbHost_Power = section.Site.Settings["DbHost_Power"].Value;
            string strDbId_Power = section.Site.Settings["DbId_Power"].Value;
            string strDbPw_Power = section.Site.Settings["DbPw_Power"].Value;

            string strDbName_Facility = section.Site.Settings["DbName_Facility"].Value;
            string strDbHost_Facility = section.Site.Settings["DbHost_Facility"].Value;
            string strDbId_Facility = section.Site.Settings["DbId_Facility"].Value;
            string strDbPw_Facility = section.Site.Settings["DbPw_Facility"].Value;

            if (strSiteNo == null || strSiteNo.Length == 0 ||
                strDbName == null || strDbName.Length == 0 ||
                strDbType == null || strDbType.Length == 0 ||
                strDbHost == null || strDbHost.Length == 0 ||
                strDbId == null || strDbId.Length == 0 ||
                strDbPw == null || strDbPw.Length == 0)
            {
                Logger.Instance.Write(LogTypes.Error, "LoadSiteConfig");
                return null;
            }

            string key = new string(new char[] { 'a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm', 'n', 'o', 'p', 'q', 'r', 's', 't', 'u', 'v', 'w', 'x', 'y', 'z', '1', '2', '3', '4', '5', '6' });

            strDbHost = AES256Cipher.AES_decrypt(strDbHost, key);
            strDbId = AES256Cipher.AES_decrypt(strDbId, key);
            strDbPw = AES256Cipher.AES_decrypt(strDbPw, key);

            if (strDbName_Power?.Length > 0 && strDbHost_Power?.Length > 0 && strDbId_Power?.Length > 0 && strDbPw_Power?.Length > 0)
            {
                strDbHost_Power = AES256Cipher.AES_decrypt(strDbHost_Power, key);
                strDbId_Power = AES256Cipher.AES_decrypt(strDbId_Power, key);
                strDbPw_Power = AES256Cipher.AES_decrypt(strDbPw_Power, key);
            }

            if (strDbName_Facility?.Length > 0 && strDbHost_Facility?.Length > 0 && strDbId_Facility?.Length > 0 && strDbPw_Facility?.Length > 0)
            {
                strDbHost_Facility = AES256Cipher.AES_decrypt(strDbHost_Facility, key);
                strDbId_Facility = AES256Cipher.AES_decrypt(strDbId_Facility, key);
                strDbPw_Facility = AES256Cipher.AES_decrypt(strDbPw_Facility, key);
            }

            int siteNo, dbType;

            if (int.TryParse(strSiteNo, out siteNo) && int.TryParse(strDbType, out dbType))
            {
                Site siteConfig = new Site();

                siteConfig.No = siteNo;
                siteConfig.DbName = strDbName;
                siteConfig.DbType = dbType;
                siteConfig.DbHost = strDbHost;
                siteConfig.DbId = strDbId;
                siteConfig.DbPw = strDbPw;

                if (strDbName_Power?.Length > 0 && strDbHost_Power?.Length > 0 && strDbId_Power?.Length > 0 && strDbPw_Power?.Length > 0)
                {
                    siteConfig.DbName_Power = strDbName_Power;
                    siteConfig.DbHost_Power = strDbHost_Power;
                    siteConfig.DbId_Power = strDbId_Power;
                    siteConfig.DbPw_Power = strDbPw_Power;
                }

                if (strDbName_Facility?.Length > 0 && strDbHost_Facility?.Length > 0 && strDbId_Facility?.Length > 0 && strDbPw_Facility?.Length > 0)
                {
                    siteConfig.DbName_Facility = strDbName_Facility;
                    siteConfig.DbHost_Facility = strDbHost_Facility;
                    siteConfig.DbId_Facility = strDbId_Facility;
                    siteConfig.DbPw_Facility = strDbPw_Facility;
                }

                return siteConfig;
            }
            else
                Logger.Instance.Write(LogTypes.Error, "LoadSiteConfig, SiteNo or DbType Error");

            return null;
        }

        private Datas.SVMS LoadSVMSConfig()
        {
            var section = (CustomSettingsSection)ConfigurationManager.GetSection("customSettings");
            string strIP = section.SVMS.Settings["IP"].Value;
            string strPort = section.SVMS.Settings["Port"].Value;
            string strID = section.SVMS.Settings["ID"].Value;
            string strPassword = section.SVMS.Settings["Password"].Value;
            string strWebRtcUrl = section.SVMS.Settings["WebRTC_URL"].Value;
            string strWebRtcName = section.SVMS.Settings["WebRTC_Name"].Value;
            string strWebRtcPath = section.SVMS.Settings["WebRTC_Path"].Value;
            string strWebRtcConfig = section.SVMS.Settings["WebRTC_Config"].Value;
            string strGoUrl = section.SVMS.Settings["go2rtc_URL"].Value;
            string strGoName = section.SVMS.Settings["go2rtc_Name"].Value;
            string strGoPath = section.SVMS.Settings["go2rtc_Path"].Value;
            string strGoConfig = section.SVMS.Settings["go2rtc_Config"].Value;

            if (strIP == null || strIP.Length == 0 ||
                strPort == null || strPort.Length == 0 ||
                strID == null || strID.Length == 0 ||
                strPassword == null || strPassword.Length == 0 ||
                strWebRtcUrl == null || strWebRtcUrl.Length == 0 ||
                strWebRtcName == null || strWebRtcName.Length == 0 ||
                strWebRtcPath == null || strWebRtcPath.Length == 0 ||
                strWebRtcConfig == null || strWebRtcConfig.Length == 0 ||
                strGoUrl == null || strGoUrl.Length == 0 ||
                strGoName == null || strGoName.Length == 0 ||
                strGoPath == null || strGoPath.Length == 0 ||
                strGoConfig == null || strGoConfig.Length == 0)
            {
                Logger.Instance.Write(LogTypes.Error, "LoadSVMSConfig");
                return null;
            }

            int port;

            if (int.TryParse(strPort, out port))
            {
                Datas.SVMS svmsConfig = new Datas.SVMS();

                svmsConfig.IP = strIP;
                svmsConfig.Port = port;
                svmsConfig.ID = strID;
                svmsConfig.Password = strPassword;
                svmsConfig.WebRTC_URL = strWebRtcUrl;
                svmsConfig.WebRTC_Name = strWebRtcName;
                svmsConfig.WebRTC_Path = strWebRtcPath;
                svmsConfig.WebRTC_Config = strWebRtcConfig;
                svmsConfig.go2rtc_URL = strGoUrl;
                svmsConfig.go2rtc_Name = strGoName;
                svmsConfig.go2rtc_Path = strGoPath;
                svmsConfig.go2rtc_Config = strGoConfig;

                return svmsConfig;
            }
            else
                Logger.Instance.Write(LogTypes.Error, "LoadSVMSConfig, port Error");

            return null;
        }

        public bool Start()
        {
            LoadSetting();
            if (m_siteConfig == null || m_svmsConfig == null)
                return false;

            DataManager dataManager = new DataManager(m_siteConfig.DbType, m_siteConfig.DbHost, m_siteConfig.DbName, m_siteConfig.DbId, m_siteConfig.DbPw, m_siteConfig.No);

            // 초순수, 전력 DB 연동
            DataManager dataManager_Power = null;
            DataManager dataManager_Facility = null;

            if (m_siteConfig.DbHost_Power?.Length > 0 && m_siteConfig.DbName_Power?.Length > 0 && m_siteConfig.DbId_Power?.Length > 0 && m_siteConfig.DbPw_Power?.Length > 0)
            {
                dataManager_Power = new DataManager(m_siteConfig.DbType, m_siteConfig.DbHost_Power, m_siteConfig.DbName_Power, m_siteConfig.DbId_Power, m_siteConfig.DbPw_Power, m_siteConfig.No);
            }
            if (m_siteConfig.DbHost_Facility?.Length > 0 && m_siteConfig.DbName_Facility?.Length > 0 && m_siteConfig.DbId_Facility?.Length > 0 && m_siteConfig.DbPw_Facility?.Length > 0)
            {
                dataManager_Facility = new DataManager(m_siteConfig.DbType, m_siteConfig.DbHost_Facility, m_siteConfig.DbName_Facility, m_siteConfig.DbId_Facility, m_siteConfig.DbPw_Facility, m_siteConfig.No);
            }

            // SensorZone이 없는 CCTV가 있는지 확인하여 없으면 새로 만들어준다.
            SensorZoneManager.CheckCCTVSensorZones(dataManager);

            m_svmsManager = new SvmsManager(dataManager, dataManager_Power, dataManager_Facility, m_siteConfig.No, m_siteConfig, m_svmsConfig);
            m_svmsManager.Start();

            Logger.Instance.Write(LogTypes.Info, "Start Server");
            return true;
        }

        public void Stop()
        {
            if (m_svmsManager != null)
                m_svmsManager.Stop();

            Logger.Instance.Write(LogTypes.Info, "Stop Server");
        }
    }
}
