using System;
using System.Windows.Forms;
using dnsDapperDBUtil.DataAccessLayer.DAL;
using Microsoft.Extensions.Configuration;
using PohangSensorServer.Managers;

namespace PohangSensorServer
{
    public class ProcessManager : IDisposable
    {
        private string SOPWebServerURL;
        private Logger m_logger;
        
        private DataManager m_dataManager; // 유엔이 DB
        private AlarmManager m_alarmManager;
        private SensorDataManager m_sensorDataManager;
        private PublicDataManager m_publicDataManager;
        private WebServiceManager m_webServiceManager;
        private bool _disposed = false;
        
        public ProcessManager(Logger logger)
        {
            m_logger = logger ?? throw new ArgumentNullException(nameof(logger));
            Init();
        }

        private void Init()
        {
            try
            {
                var builder = new ConfigurationBuilder()
                    .SetBasePath(Application.StartupPath)
                    .AddJsonFile("appsettings.json", optional: true, reloadOnChange: true);
            
                IConfigurationRoot configuration = builder.Build();
                var siteConfig = new Config.Config.Site();
                var apiConfig = new Config.Config.API();
                configuration.GetSection("Site").Bind(siteConfig);
                configuration.GetSection("API").Bind(apiConfig);
                
                SOPWebServerURL = siteConfig.SOPWebServerURL;
            
                m_dataManager = new DataManager(siteConfig.DBType, siteConfig.DBHost, siteConfig.DBName, siteConfig.DBID, siteConfig.DBPw);
                m_alarmManager = new AlarmManager(SOPWebServerURL, m_dataManager, m_logger);
                m_webServiceManager = new WebServiceManager(m_logger, apiConfig.HeaderKey);
                m_sensorDataManager = new SensorDataManager(m_dataManager, m_alarmManager, m_webServiceManager, m_logger, apiConfig.LastDataURL, apiConfig.MaterialDataURL); // 센서데이터
                m_publicDataManager = new PublicDataManager(m_dataManager, m_webServiceManager, m_logger, apiConfig.TmsDataURL, apiConfig.AirKoreaDataURL, apiConfig.WeatherDataURL); // 공공데이터
                m_logger.Write("Success Initialize Service");
            } catch (Exception ex)
            {
                m_logger.Write($"시스템 초기화 오류 : {ex.Message}");
                throw;
            }
        }
        
        public void Start()
        {
            if (m_alarmManager == null || m_sensorDataManager == null || m_publicDataManager == null)
            {
                m_logger.Write("필수 시스템이 정상적으로 초기화되지 않았습니다. // Initialize()");
                return;
            }
            m_alarmManager.Start();
            m_sensorDataManager.Start();
            m_publicDataManager.Start();
        } 
        
        public void Stop()
        {
            Dispose();
        }

        public void Dispose()
        {
            if (!_disposed)
            {
                if (m_alarmManager is IDisposable alarmDisposable)
                    alarmDisposable.Dispose();
                if (m_sensorDataManager is IDisposable sensorDisposable)
                    sensorDisposable.Dispose();
                if (m_webServiceManager is IDisposable webServiceDisposable)
                    webServiceDisposable.Dispose();
                if (m_publicDataManager is IDisposable publicDataDisposable)
                    publicDataDisposable.Dispose();
                _disposed = true;
            }
            GC.SuppressFinalize(this);
        }
    }
}