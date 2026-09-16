using System;
using System.Configuration;
using System.Threading;
using dnsDapperDBUtil.DataAccessLayer.DAL;
using dnsDapperDBUtil.DataAccessLayer.IDAL;
using dnsSensorServer;

namespace SoulbrainHr
{
    public class HRManager : SensorServer
    {
        private static HRManager m_processManager = null;
        
        private HrProcessingManager m_hrProcessingManager = null;
        
        private DataManager m_hrDataManager = null;
        
        private bool m_closeApp = false;
        private bool IsFirstSync = true;
        private DateTime? LastSyncTime = null;
        private const int ErrorSleep = 60 * 15;

        private HRManager(DataManager hrDataManager) : base("SoulbrainHr")
        {
            m_hrDataManager = hrDataManager;
            
            m_hrProcessingManager = new HrProcessingManager(DataManager, m_hrDataManager, SiteNo);
        }
        
        private static HRManager MakeInstance()
        {
            string strHrDatabaseHost = ConfigurationManager.AppSettings.Get("HrDatabaseHost");
            string strHrDatabaseName = ConfigurationManager.AppSettings.Get("HrDatabaseName");
            string strHrDatabaseId = ConfigurationManager.AppSettings.Get("HrDatabaseId");
            string strHrDatabasePw = ConfigurationManager.AppSettings.Get("HrDatabasePw");
            
            DataManager dataManager = new DataManager((int)dnsDapperDBUtil.Manager.WebDBManager.DBType.sqlserver, strHrDatabaseHost, strHrDatabaseName, strHrDatabaseId, strHrDatabasePw);

            return new HRManager(dataManager);
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

            Thread threadSync = new Thread(() => m_processManager.SyncThread());
            threadSync.Start();
            
        }
        
        private void SyncThread()
        {
            while (!m_processManager.m_closeApp)
            {
                try
                {
                    DateTime? dtNow = DateTime.Now;
                    if (IsFirstSync || (dtNow - LastSyncTime)?.TotalDays >= 1.0)
                    {
                        IsFirstSync = false;
                        LastSyncTime = dtNow;

                        if (m_hrProcessingManager.ProcessingSynchronous(Logger, out string strErrorMessage) == false)
                        {
                            Logger.Write($@"[ERROR] ProcessingSynchronous has Error : {strErrorMessage}");
                            Thread.Sleep(ErrorSleep * 1000);
                        }
                        else
                        {
                            // 리소스 방지용 sleep
                            Thread.Sleep( 60 * 60 * 1000);
                        }
                    }
                }
                catch (Exception e)
                {
                    Logger.Write($@"[ERROR] SyncThread has Error : {e.Message}");
                }
            }
        }
    }
}