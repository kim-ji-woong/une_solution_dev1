using System;
using System.Collections.Generic;
using System.Threading;
using dnsDapperDBUtil.DataAccessLayer.DAL;
using IntegrationServer.Datas;

namespace IntegrationServer.Servers.HR.Soulbrain
{
    
    public class HRManager : IServer
    {
        private int m_nServerSeqNo = -1;
        private string m_strServerAlias = "";
        private bool m_isStarted = false;
        private ServerManager m_serverManager = null;
        private Dictionary<ServerProperty, object> m_serverProperties = null;
        private DataManager m_dataManager = null;
        private DataManager m_hrDataManager = null;
        private int m_nSiteID = -1;
        private bool m_shutdownThread = false;
        private Thread m_thread = null;
        private string m_strSoulHRDbName = null;
        private DateTime m_dtLastCheck = new DateTime();
        
        private const int ERROR_THREAD_INTERVAL = 1000 * 60 * 10; // 에러 발생시 10분 주기로 재시도
        
        public int ServerType
        {
            get { return dnsData.CommonCode.SdmsSensor.ServerType.Soulbrain_HR; }
        }
        
        public int ServerSeqNo { get { return m_nServerSeqNo; } }
        
        public string ServerAlias { get { return m_strServerAlias; } }
        
        public bool IsConnected { get { return false; } }

        public bool IsFirst = true;
        
        public ServerManager GetServerManager() { return m_serverManager; }
        
        public HrProcessingManager m_HrProcessingManager = null;
        
        public Logger Logger { get; set; }
        
        public HRManager(ServerManager serverManager, DataManager dataManager, DataManager hrDataManager, int nSiteID, int nServerSeqNo, Dictionary<ServerProperty, object> serverProperties, string strServerAlias)
        {
            m_serverManager = serverManager;
            m_dataManager = (DataManager)dataManager.Clone();
            m_hrDataManager = hrDataManager;
            
            m_nServerSeqNo = nServerSeqNo;
            m_nSiteID = nSiteID;
            m_strServerAlias = strServerAlias;
            m_serverProperties = serverProperties;

            m_HrProcessingManager = new HrProcessingManager(dataManager, hrDataManager, m_nSiteID, nServerSeqNo);
        }

        public void Start()
        {
            if (m_shutdownThread)
                m_shutdownThread = false;
            
            if (m_thread != null && m_thread.IsAlive)
            {
                Logger?.Write(LogTypes.Error, ServerType, m_nServerSeqNo, "Thread already running");
                return;
            }

            
            m_thread = new Thread(() => ThreadProc())
            {
                Name = $"HRManager-{m_nServerSeqNo}",
                IsBackground = true // 애플리케이션 종료 시 함께 종료
            };
            
            m_isStarted = true;
            
            m_thread.Start();
        }
        
        public void Stop()
        {
            m_shutdownThread = true;
            
            if (m_thread != null && m_thread.IsAlive)
                m_thread.Join();
            
            m_thread = null;
            
            m_isStarted = false;
            
        }
        
        private void ThreadProc()
        {
            string strErrorMessage;
            
            while (!m_shutdownThread)
            {
                // excute one time per day 
                
                try
                {
                    DateTime dtNow = DateTime.Now;
                    if (IsFirst || (dtNow - m_dtLastCheck).TotalDays >= 1.0)
                    {
                        IsFirst = false;
                        
                        if (m_HrProcessingManager.ProcessingSynchronous(out strErrorMessage) == false)
                        {
                            Logger.Instance.Write(LogTypes.Error, ServerType, m_nServerSeqNo, "ThreadProc() : " + strErrorMessage);
                            Thread.Sleep(ERROR_THREAD_INTERVAL);
                        }
                        else
                        {
                            Thread.Sleep(1000 * 60 * 30);
                        }
                    }
                    
                }
                catch (Exception e)
                {
                    Logger.Instance.Write(LogTypes.Error, ServerType, m_nServerSeqNo, "ThreadProc() : " + e.Message);
                    Thread.Sleep(ERROR_THREAD_INTERVAL);
                }
            }
        }
    }
}

