using System;
using System.Collections.Generic;
using System.IO;
using System.IO.Compression;
using System.Text;
using System.Threading.Tasks;

namespace dnsSMS.LogManager.YoungJin
{
    internal class YoungJinAuditArchiveManager
    {
        private const int ArchiveLockStaleMinutes = 30;
        private const int ArchiveCheckThrottleMinutes = 10;

        private static readonly object _archiveStateLock = new object();
        private static readonly HashSet<string> _archiveInProgressKeys = new HashSet<string>(StringComparer.Ordinal);
        private static readonly Dictionary<string, DateTime> _lastArchiveCheckUtcByKey = new Dictionary<string, DateTime>(StringComparer.Ordinal);

        private readonly YoungJinAuditWriter m_auditWriter;

        public YoungJinAuditArchiveManager(YoungJinAuditWriter auditWriter)
        {
            m_auditWriter = auditWriter;
        }

        public void TryStartMonthlyArchive(DateTime now)
        {
            string currentMonth = now.ToString("yyyyMM");
            string targetMonth = now.AddMonths(-1).ToString("yyyyMM");
            string archiveKey = m_auditWriter.AuditRootPath;
            string inProgressKey = archiveKey + "|" + targetMonth;

            lock (_archiveStateLock)
            {
                DateTime utcNow = DateTime.UtcNow;
                if (_lastArchiveCheckUtcByKey.TryGetValue(archiveKey, out DateTime lastArchiveCheckUtc) &&
                    utcNow - lastArchiveCheckUtc < TimeSpan.FromMinutes(ArchiveCheckThrottleMinutes))
                    return;

                _lastArchiveCheckUtcByKey[archiveKey] = utcNow;

                if (_archiveInProgressKeys.Contains(inProgressKey))
                    return;
            }

            if (File.Exists(m_auditWriter.GetArchiveZipPath(targetMonth)))
                return;

            string[] auditFiles = m_auditWriter.GetMonthAuditFiles(targetMonth);
            if (auditFiles.Length == 0)
                return;

            if (TryAcquireArchiveLock(targetMonth, out string lockPath) == false)
                return;

            bool shouldStart = false;
            lock (_archiveStateLock)
            {
                if (_archiveInProgressKeys.Contains(inProgressKey) == false)
                {
                    _archiveInProgressKeys.Add(inProgressKey);
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
                Task.Run(() => ArchiveMonthLogs(targetMonth, lockPath, inProgressKey));
            }
            catch
            {
                lock (_archiveStateLock)
                {
                    _archiveInProgressKeys.Remove(inProgressKey);
                }

                ReleaseArchiveLock(lockPath);
            }
        }

        private bool TryAcquireArchiveLock(string targetMonth, out string lockPath)
        {
            string archiveDirectoryPath = m_auditWriter.ArchiveDirectoryPath;
            lockPath = m_auditWriter.GetArchiveLockPath(targetMonth);
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

        private void ArchiveMonthLogs(string targetMonth, string lockPath, string inProgressKey)
        {
            string tempZipPath = null;

            try
            {
                string[] auditFiles = m_auditWriter.GetMonthAuditFiles(targetMonth);
                if (auditFiles.Length == 0)
                    return;

                string archiveDirectoryPath = m_auditWriter.ArchiveDirectoryPath;
                string zipPath = m_auditWriter.GetArchiveZipPath(targetMonth);
                tempZipPath = zipPath + ".tmp";

                Directory.CreateDirectory(archiveDirectoryPath);

                if (File.Exists(zipPath))
                    return;

                if (File.Exists(tempZipPath))
                    File.Delete(tempZipPath);

                using (ZipArchive zipArchive = ZipFile.Open(tempZipPath, ZipArchiveMode.Create))
                {
                    foreach (string auditFile in auditFiles)
                    {
                        zipArchive.CreateEntryFromFile(auditFile, Path.GetFileName(auditFile), CompressionLevel.Optimal);
                    }
                }

                FileInfo zipFileInfo = new FileInfo(tempZipPath);
                if (zipFileInfo.Exists == false || zipFileInfo.Length <= 0)
                    throw new InvalidOperationException("Archive file was not created correctly.");

                File.Move(tempZipPath, zipPath);

                foreach (string auditFile in auditFiles)
                {
                    File.Delete(auditFile);
                }
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
                    _archiveInProgressKeys.Remove(inProgressKey);
                }

                ReleaseArchiveLock(lockPath);
            }
        }
    }
}
