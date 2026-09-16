
using System;
using System.Collections.Generic;
using System.IO;
using System.IO.Compression;
using System.Text;
using System.Threading.Tasks;

namespace dnsSMS.LogManager.YoungJin
{
    internal class YoungJinArchiveManager
    {
        private const int ArchiveLockStaleMinutes = 30;
        private const int ArchiveCheckThrottleMinutes = 10;

        private static readonly object _archiveStateLock = new object();
        private static readonly HashSet<string> _archiveInProgressMonths = new HashSet<string>(StringComparer.Ordinal);
        private static string _lastArchiveCheckMonth = "";
        private static DateTime _lastArchiveCheckUtc = DateTime.MinValue;

        private readonly YoungJinLogWriter m_logWriter;

        public YoungJinArchiveManager(YoungJinLogWriter logWriter)
        {
            m_logWriter = logWriter;
        }

        public void TryStartMonthlyArchive(DateTime now)
        {
            string currentMonth = now.ToString("yyyyMM");
            string targetMonth = now.AddMonths(-1).ToString("yyyyMM");

            lock (_archiveStateLock)
            {
                DateTime utcNow = DateTime.UtcNow;
                if (string.Equals(_lastArchiveCheckMonth, currentMonth, StringComparison.Ordinal) &&
                    utcNow - _lastArchiveCheckUtc < TimeSpan.FromMinutes(ArchiveCheckThrottleMinutes))
                    return;

                _lastArchiveCheckMonth = currentMonth;
                _lastArchiveCheckUtc = utcNow;

                if (_archiveInProgressMonths.Contains(targetMonth))
                    return;
            }

            if (File.Exists(m_logWriter.GetArchiveZipPath(targetMonth)))
                return;

            string[] logFiles = m_logWriter.GetMonthLogFiles(targetMonth);
            if (logFiles.Length == 0)
                return;

            if (TryAcquireArchiveLock(targetMonth, out string lockPath) == false)
                return;

            bool shouldStart = false;
            lock (_archiveStateLock)
            {
                if (_archiveInProgressMonths.Contains(targetMonth) == false)
                {
                    _archiveInProgressMonths.Add(targetMonth);
                    shouldStart = true;
                }
            }

            if (shouldStart == false)
            {
                ReleaseArchiveLock(lockPath);
                return;
            }

            try
            {
                Task.Run(() => ArchiveMonthLogs(targetMonth, lockPath));
            }
            catch (Exception ex)
            {
                lock (_archiveStateLock)
                {
                    _archiveInProgressMonths.Remove(targetMonth);
                }

                ReleaseArchiveLock(lockPath);
                m_logWriter.AppendLogLine(DateTime.Now, "ARCHIVE_ERROR", $"target_month={targetMonth} error={ex.Message}");
            }
        }

        private bool TryAcquireArchiveLock(string targetMonth, out string lockPath)
        {
            string archiveDirectoryPath = m_logWriter.ArchiveDirectoryPath;
            lockPath = m_logWriter.GetArchiveLockPath(targetMonth);
            Directory.CreateDirectory(archiveDirectoryPath);

            if (File.Exists(lockPath))
            {
                DateTime lockWriteTimeUtc = File.GetLastWriteTimeUtc(lockPath);
                if (DateTime.UtcNow - lockWriteTimeUtc <= TimeSpan.FromMinutes(ArchiveLockStaleMinutes))
                    return false;

                try
                {
                    File.Delete(lockPath);
                }
                catch
                {
                    return false;
                }
            }

            try
            {
                using (var stream = new FileStream(lockPath, FileMode.CreateNew, FileAccess.Write, FileShare.None))
                using (var writer = new StreamWriter(stream, new UTF8Encoding(false)))
                {
                    writer.WriteLine($"created_utc={DateTime.UtcNow:O}");
                    writer.WriteLine($"machine={Environment.MachineName}");
                    writer.WriteLine($"process_id={System.Diagnostics.Process.GetCurrentProcess().Id}");
                    writer.WriteLine($"target_month={targetMonth}");
                }

                return true;
            }
            catch
            {
                return false;
            }
        }

        private void ReleaseArchiveLock(string lockPath)
        {
            if (string.IsNullOrWhiteSpace(lockPath))
                return;

            try
            {
                if (File.Exists(lockPath))
                    File.Delete(lockPath);
            }
            catch
            {
            }
        }

        private void ArchiveMonthLogs(string targetMonth, string lockPath)
        {
            string tempZipPath = null;

            try
            {
                string[] logFiles = m_logWriter.GetMonthLogFiles(targetMonth);
                if (logFiles.Length == 0)
                {
                    m_logWriter.AppendLogLine(DateTime.Now, "ARCHIVE_SKIP", $"target_month={targetMonth} reason=no_log_files");
                    return;
                }

                string archiveDirectoryPath = m_logWriter.ArchiveDirectoryPath;
                string zipPath = m_logWriter.GetArchiveZipPath(targetMonth);
                tempZipPath = zipPath + ".tmp";

                Directory.CreateDirectory(archiveDirectoryPath);

                if (File.Exists(zipPath))
                {
                    m_logWriter.AppendLogLine(DateTime.Now, "ARCHIVE_SKIP", $"target_month={targetMonth} reason=zip_exists");
                    return;
                }

                if (File.Exists(tempZipPath))
                    File.Delete(tempZipPath);

                using (ZipArchive zipArchive = ZipFile.Open(tempZipPath, ZipArchiveMode.Create))
                {
                    foreach (string logFile in logFiles)
                    {
                        zipArchive.CreateEntryFromFile(logFile, Path.GetFileName(logFile), CompressionLevel.Optimal);
                    }
                }

                FileInfo zipFileInfo = new FileInfo(tempZipPath);
                if (zipFileInfo.Exists == false || zipFileInfo.Length <= 0)
                    throw new InvalidOperationException("Archive file was not created correctly.");

                File.Move(tempZipPath, zipPath);

                foreach (string logFile in logFiles)
                {
                    File.Delete(logFile);
                }

                m_logWriter.AppendLogLine(DateTime.Now, "ARCHIVE_SUCCESS", $"target_month={targetMonth} file_count={logFiles.Length} archive={Path.GetFileName(zipPath)}");
            }
            catch (Exception ex)
            {
                m_logWriter.AppendLogLine(DateTime.Now, "ARCHIVE_ERROR", $"target_month={targetMonth} error={ex.Message}");
            }
            finally
            {
                if (string.IsNullOrWhiteSpace(tempZipPath) == false)
                {
                    try
                    {
                        if (File.Exists(tempZipPath))
                            File.Delete(tempZipPath);
                    }
                    catch
                    {
                    }
                }

                lock (_archiveStateLock)
                {
                    _archiveInProgressMonths.Remove(targetMonth);
                }

                ReleaseArchiveLock(lockPath);
            }
        }
    }
}