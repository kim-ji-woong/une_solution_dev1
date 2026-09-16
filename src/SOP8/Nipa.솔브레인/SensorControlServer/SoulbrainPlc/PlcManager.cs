using System;
using System.Configuration;
using System.IO;
using System.Threading;
using dnsSensorServer;
using SoulbrainPlc.Data;
using SoulbrainPlc.Process;

namespace SoulbrainPlc
{
    public class PlcManager : SensorServer
    {
        private static PlcManager m_processManager = null;
        private bool m_closeApp = false;
        private FolderReaderManager m_folderReaderManager = null;

        private bool m_bRetentionEnabled = true;
        private int m_nPurgeHour = 3;
        private DateTime m_lastPurgeDate = DateTime.MinValue;
        private RetentionManager m_retentionManager = null;

        private PlcManager (NetworkInfo networkInfo, string backupPath, bool retentionEnabled, int retentionDays, int purgeHour, int purgeMaxChunksPerRun, int backupRetentionDays)
            : base("Plc")
        {
            if (string.IsNullOrEmpty(networkInfo.NetworkFolderPath))
                this.Logger.Write($@"PlcManager Constructor : 폴더 이름을 확인해주세요.");
            if (string.IsNullOrEmpty(networkInfo.UserName))
                this.Logger.Write($@"PlcManager Constructor : 사용자 이름을 확인해주세요.");
            if (string.IsNullOrEmpty(networkInfo.Password))
                this.Logger.Write($@"PlcManager Constructor : 비밀번호를 확인해주세요.");

            m_folderReaderManager = new FolderReaderManager(this.DataManager, networkInfo, this, backupPath);

            // 안전장치 : 백업 보관기간은 DB 삭제의 유일한 복구 원본이므로, DB 보관기간보다 짧으면 안 된다.
            if (backupRetentionDays < retentionDays)
            {
                this.Logger.Write($@"[WARN] PlcManager Constructor : BackupRetentionDays({backupRetentionDays})가 RetentionDays({retentionDays})보다 작아 BackupRetentionDays를 RetentionDays로 보정합니다.");
                backupRetentionDays = retentionDays;
            }

            m_bRetentionEnabled = retentionEnabled;
            m_nPurgeHour = purgeHour;
            m_retentionManager = new RetentionManager(this, retentionDays, purgeMaxChunksPerRun, backupPath, backupRetentionDays);
        }

        private static PlcManager MakeInstance()
        {
            string strNetworkForderPath = ConfigurationManager.AppSettings.Get("FolderPath");
            string strUserName = ConfigurationManager.AppSettings.Get("UserName");
            string strPassword = ConfigurationManager.AppSettings.Get("Password");
            string strBackupPath = ConfigurationManager.AppSettings.Get("BackupPath");

            NetworkInfo networkInfo = new NetworkInfo
            {
                NetworkFolderPath = strNetworkForderPath,
                UserName = strUserName,
                Password = strPassword
            };

            // 보관정책(retention) 설정 : App.config 값이 없거나 형식이 잘못되었으면 기본값을 사용한다.
            string strRetentionEnabled = ConfigurationManager.AppSettings.Get("RetentionEnabled");
            if (!bool.TryParse(strRetentionEnabled, out bool bRetentionEnabled))
                bRetentionEnabled = true;

            string strRetentionDays = ConfigurationManager.AppSettings.Get("RetentionDays");
            if (!int.TryParse(strRetentionDays, out int nRetentionDays))
                nRetentionDays = 730;

            string strPurgeHour = ConfigurationManager.AppSettings.Get("PurgeHour");
            if (!int.TryParse(strPurgeHour, out int nPurgeHour))
                nPurgeHour = 3;

            string strPurgeMaxChunksPerRun = ConfigurationManager.AppSettings.Get("PurgeMaxChunksPerRun");
            if (!int.TryParse(strPurgeMaxChunksPerRun, out int nPurgeMaxChunksPerRun))
                nPurgeMaxChunksPerRun = 7;

            string strBackupRetentionDays = ConfigurationManager.AppSettings.Get("BackupRetentionDays");
            if (!int.TryParse(strBackupRetentionDays, out int nBackupRetentionDays))
                nBackupRetentionDays = 1095;

            return new PlcManager(networkInfo, strBackupPath, bRetentionEnabled, nRetentionDays, nPurgeHour, nPurgeMaxChunksPerRun, nBackupRetentionDays);
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

            // [수정] 람다 식 내부 전체를 try-catch로 감싸서 스레드 폭파 방지
            Thread threadSync = new Thread(() => 
            {
                try
                {
                    if (m_processManager != null)
                    {
                        m_processManager.ReadPlcThread();
                    }
                }
                catch (Exception ex)
                {
                    // 파일 로깅 또는 콘솔 출력 (m_processManager가 null일 수도 있으므로 주의)
                    File.AppendAllText("CrashLog.txt", $"[Critical Thread Error] {ex}\n");
                }
            });
            threadSync.Start();
        
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

        private void ReadPlcThread()
        {
            while (!m_closeApp)
            {
                try
                {
                    if (m_folderReaderManager != null)
                    {
                        m_folderReaderManager.ReadFolder();
                    }
                    else
                    {
                        this.Logger.Write($@"[Error] FolderReaderManager is null");
                    }
                        
                    DateTime now = DateTime.Now;

                    // 보관정책(retention) 삭제 : 지정된 시(hour)에 하루 1회만 시도한다.
                    if (m_bRetentionEnabled && now.Hour == m_nPurgeHour && m_lastPurgeDate != now.Date)
                    {
                        m_retentionManager.PurgeOldData();
                        m_lastPurgeDate = now.Date;
                    }

                    DateTime targetTime = new DateTime(now.Year, now.Month, now.Day, now.Hour, now.Minute, 55);

                    if (now > targetTime)
                    {
                        targetTime = targetTime.AddMinutes(1);
                    }

                    TimeSpan waitSpan = targetTime - now;

                    if (waitSpan.TotalMilliseconds > 0)
                    {
                        Thread.Sleep((int)waitSpan.TotalMilliseconds);
                    }
                
                }
                catch (Exception e)
                {
                    this.Logger.Write($@"[Error] ReadPlcThread() : {e.Message}");
                    Thread.Sleep(60 * 1000);
                }
            }
        }
    }
}