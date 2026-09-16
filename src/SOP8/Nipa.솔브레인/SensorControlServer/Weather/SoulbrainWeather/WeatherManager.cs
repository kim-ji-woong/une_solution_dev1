using System;
using System.Configuration;
using System.Threading;
using dnsSensorServer;
using Soulbrain.Model.Weather;

namespace SoulbrainWeather
{
    using Process;

    class WeatherManager : SensorServer
    {
        private static WeatherManager m_processManager = null;

        private bool m_closeApp = false;

        private string m_strID = null;
        private string m_strPassword = null;
        private string m_str10Min = null;
        private string m_str1Min = null;
        private string m_str10Sec = null;
        private int m_nWeatherSiteNo = -1;

        private WeatherStateManager m_stateManager = null;

        private WeatherManager(string strID, string strPassword, string str10Min, string str1Min, string str10Sec, int siteNo)
            : base("Weather\\Soulbrain")
        {
            m_strID = strID;
            m_strPassword = strPassword;
            m_str10Min = str10Min;
            m_str1Min = str1Min;
            m_str10Sec = str10Sec;
            m_nWeatherSiteNo = siteNo;

            m_stateManager = new WeatherStateManager(this.Logger);
        }

        public static void Run()
        {
            if (m_processManager == null)
            {
                m_processManager = MakeInstance();

                if (m_processManager == null)
                    return;
            }
            else
                return;

            m_processManager.Logger.Write("WeatherManager Run()");

            Thread t = new Thread(() => m_processManager.MonitoringThread())
            {
                IsBackground = true
            };

            t.Start();

            while (m_processManager.m_closeApp == false)
            {
                Thread.Sleep(1000);
            }
        }

        private static WeatherManager MakeInstance()
        {
            string strID = ConfigurationManager.AppSettings.Get("ID");
            string strPassword = ConfigurationManager.AppSettings.Get("Password");
            string str10Min = ConfigurationManager.AppSettings.Get("10Min");
            string str1Min = ConfigurationManager.AppSettings.Get("1Min");
            string str10Sec = ConfigurationManager.AppSettings.Get("10Sec");
            string strWeatherSiteNo = ConfigurationManager.AppSettings.Get("WeatherSiteNo");

            int siteNo;

            if (int.TryParse(strWeatherSiteNo, out siteNo) == false)
                return null;

            return new WeatherManager(strID, strPassword, str10Min, str1Min, str10Sec, siteNo);
        }

        public static void Stop()
        {
            if (m_processManager != null)
            {
                m_processManager.m_closeApp = true;
                m_processManager = null;
            }
            else
                return;
        }

        private void MonitoringThread()
        {
            m_closeApp = false;
            
            while (m_closeApp == false)
            {
                try
                {
                    for (int i = 0; i < 60; i++)
                    {
                        if (i == 0)
                        {
                            Current current = FileManager.ReadFileSecond(m_str10Sec, m_strID, m_strPassword, this.Logger);

                            if (current == null)
                            {
                                current = FileManager.ReadFileMinute(m_str1Min, m_strID, m_strPassword, this.Logger);

                                if (current == null)
                                {
                                    current = FileManager.ReadFileMinute(m_str10Min, m_strID, m_strPassword, this.Logger);
                                }
                            }

                            if (current != null)
                            {
                                int? state = m_stateManager.ReadData();

                                if (state != null)
                                    current.wethr_sttus_code = (int)state;

                                string strErrorMessage;

                                if (UpdateDB(current, out strErrorMessage) == false)
                                {
                                    this.Logger.Write("UpdateDB Error : " + strErrorMessage);
                                }
                            }
                        }

                        Thread.Sleep(1000);

                        if (m_closeApp)
                            break;
                    }
                }
                catch (Exception e)
                {
                    this.Logger.Write("MonitoringThread() : " + e.Message);
                }
            }
        }

        private bool UpdateDB(Current current, out string strErrorMessage)
        {
            current.wethr_site_sn = m_nWeatherSiteNo;
            current.updt_tm = DateTime.Now;
            return this.DataManager.GetUpdate().Update<Current>(current, null, out strErrorMessage);
        }
    }
}
