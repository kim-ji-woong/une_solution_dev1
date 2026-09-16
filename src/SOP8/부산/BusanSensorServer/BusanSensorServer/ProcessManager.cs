using System.IO;
using System.Threading;
using System.Windows.Forms;
using dnsDapperDBUtil.DataAccessLayer.DAL;
using Microsoft.Extensions.Configuration;

namespace BusanSensorServer
{
    public class ProcessManager
    {

        private SensorManager m_sensorManager = null;
        
        private DataManager m_dataManager = null;
        private DataManager m_externalDataManager = null;

        Logger m_logger = null;
        
        Thread m_thread = null;
        
        int m_nErrorSleepTime = 1000 * 60; // 1분
        private int m_nThreadSleep = 1000 * 5; // 30초
        
        bool m_bThreadRunning = false; // Thread 동작 여부 
        
        public SensorManager SensorManager 
        {
            get { return m_sensorManager; }
        }
        
        public ProcessManager()
        {
            string strErrorMessage;
            
            if (ReadConfig())
            {
                m_sensorManager = new SensorManager(m_dataManager, m_externalDataManager);
            }
            // 센서 알람 생성 , 변경 , 해제
        }
        
        /*
         * 설정 파일을 읽어들인다.
         * DB 접속 정보를 읽어들인다.
         */
        private bool ReadConfig()
        {
            #region initDataBases

            var builder = new ConfigurationBuilder()
                .SetBasePath(Application.StartupPath)
                .AddJsonFile("appsettings.json", optional: true, reloadOnChange: true);

            IConfigurationRoot configuration = builder.Build();
            var dbConfig = new Config.Site();
            configuration.GetSection("Site").Bind(dbConfig);
            
            m_dataManager = new DataManager(int.Parse(dbConfig.DBType), dbConfig.DBHost, dbConfig.DBName, dbConfig.DBID, dbConfig.DBPw);
            m_externalDataManager = new DataManager(int.Parse(dbConfig.ExternalDBType), dbConfig.ExternalDBHost, dbConfig.ExternalDBName, dbConfig.ExternalDBID, dbConfig.ExternalDBPW);

            #endregion

            #region initLogFile

            var logConfig = new Config.Log();
            configuration.GetSection("Log").Bind(logConfig);

            m_logger = new Logger();
            m_logger.LogFolder = logConfig.LogFolder;
            m_logger.LogTag = logConfig.LogFileTag;
            m_logger.LogLifeDays = logConfig.LogLifeTime;
            
            #endregion
            
            return true;
        }

        public void Start()
        {
            string strErrorMessage;
            m_logger.Write("ProcessManager Start , Thread Start");
            
            if (!m_bThreadRunning)
            {
                m_bThreadRunning = true;
                m_thread = new Thread(() => ThreadFunc());
                m_thread.Start();
            }
        }
        
        public void ThreadFunc()
        {
            string strErrorMessage;
            while (m_bThreadRunning)
            {
                if (m_dataManager == null)
                {
                    m_logger.Write("DataManager is null");
                    return;
                }

                if (m_externalDataManager == null)
                {
                    m_logger.Write("ExternalDataManager is null");
                    return;
                }
                
                while (m_bThreadRunning)
                {
                    if (m_sensorManager.EntireProcess(out strErrorMessage))
                    {
                        Thread.Sleep(m_nThreadSleep);
                    }
                    else
                    {
                        m_logger.Write("EntireProcess is not valid : " + strErrorMessage);
                        m_logger.Write("Thread Sleep " + m_nErrorSleepTime.ToString() + "ms");
                        Thread.Sleep(m_nErrorSleepTime);
                    }
                }
            }
        }
        
        public void Stop()
        {
            m_logger.Write("ProcessManager Stop , Thread Stop");
            
            m_bThreadRunning = false;
        }
        
    }
}