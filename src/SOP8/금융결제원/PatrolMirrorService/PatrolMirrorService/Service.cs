using System;
using System.Collections.Generic;
using System.Configuration;
using System.IO;
using System.Text;
using System.Threading;

namespace PatrolMirrorService
{
    public class Service
    {
        private bool m_closeThread = false;

        private string m_strFilePath = "C:\\Program Files (x86)\\LAMPUSTECH\\TouCheckerPlus";
        private string m_strLogTag = "PatrolMirror";
        private string m_strLogFolder = ".\\";

        /// <summary>마지막으로 VSS 복사를 수행했을 때의 원본 LastWriteTimeUtc. 변경 감지에 사용.</summary>
        private DateTime m_lastCopiedWriteTimeUtc = DateTime.MinValue;

        private Logger m_logger = null;
        public Logger Logger
        {
            get { return m_logger; }
        }

        public Service()
        {
            string strFilePath = ConfigurationManager.AppSettings.Get("FilePath");
            //string strLogTag = ConfigurationManager.AppSettings.Get("LogTag");
            //string strLogFolder = ConfigurationManager.AppSettings.Get("LogFolder");

            if (strFilePath?.Length > 0)
                m_strFilePath = strFilePath;


            m_logger = new Logger();
        }

        public void Start()
        {
            this.Logger.Write("PatrolMirrorService Start");

            Thread t = new Thread(new ThreadStart(MonitoringThread));
            t.Start();
        }

        public void Stop()
        {
            this.Logger.Write("PatrolMirrorService Stop");

            m_closeThread = true;
        }

        private void MonitoringThread()
        {
            m_closeThread = false;

            // 복사 대상 경로: 실행 파일 디렉터리에 원본 파일명 그대로
            // AppContext.BaseDirectory 사용 — Windows Service 환경에서 작업 디렉터리가
            // System32로 잡힐 수 있어 상대 경로(".\")보다 안전
            string destPath = Path.Combine(AppContext.BaseDirectory, Path.GetFileName(m_strFilePath));

            while (m_closeThread == false)
            {
                try
                {
                    // 1. 원본 파일 존재 확인
                    if (!File.Exists(m_strFilePath))
                        throw new ApplicationException($"파일을 찾을 수 없습니다: {m_strFilePath}");

                    // 2. 변경 감지: 원본 LastWriteTime이 마지막 복사 시점보다 새로운 경우에만 복사
                    DateTime srcWriteUtc = File.GetLastWriteTimeUtc(m_strFilePath);
                    if (srcWriteUtc > m_lastCopiedWriteTimeUtc)
                    {
                        // 3. VSS 스냅샷을 통해 복사 (잠긴 파일 우회)
                        VssSnapshotHelper.CopyViaSnapshot(m_strFilePath, destPath);

                        // 4. 마지막 복사 기준값 갱신 및 결과 로그
                        m_lastCopiedWriteTimeUtc = srcWriteUtc;
                        this.Logger.Write($"VSS 복사 성공: {m_strFilePath} -> {destPath}");
                    }
                    else
                    {
                        this.Logger.Write($"변경사항이 없어 건너뜀");
                    }
                }
                catch (Exception ex)
                {
                    this.Logger.Write($"MonitoringThread Exception: {ex.Message}");
                }

                Thread.Sleep(60000);
            }
        }
    }
}
