using System;
using System.IO;
using System.Text;

namespace dnsSMS.LogManager.YoungJin
{
    internal class YoungJinAuditWriter
    {
        private static readonly object _auditLock = new object();

        private readonly string m_auditRootPath;
        private readonly string m_filePrefix;

        public YoungJinAuditWriter(string auditRootPath, string filePrefix)
        {
            m_auditRootPath = auditRootPath;
            m_filePrefix = filePrefix;
        }

        public string AuditRootPath
        {
            get { return m_auditRootPath; }
        }

        public string ArchiveDirectoryPath
        {
            get { return Path.Combine(m_auditRootPath, "archive"); }
        }

        public string WriteAuditFile(DateTime now, string content)
        {
            string monthDirectoryPath = Path.Combine(m_auditRootPath, now.ToString("yyyyMM"));
            Directory.CreateDirectory(monthDirectoryPath);

            lock (_auditLock)
            {
                string filePath = ResolveAuditFilePath(monthDirectoryPath, now);
                File.WriteAllText(filePath, content ?? "", new UTF8Encoding(false));
                return filePath;
            }
        }

        public string[] GetMonthAuditFiles(string targetMonth)
        {
            string monthDirectoryPath = Path.Combine(m_auditRootPath, targetMonth);
            if (Directory.Exists(monthDirectoryPath) == false)
                return Array.Empty<string>();

            return Directory.GetFiles(monthDirectoryPath, $"{m_filePrefix}{targetMonth}*.json");
        }

        public string GetArchiveZipPath(string targetMonth)
        {
            return Path.Combine(ArchiveDirectoryPath, $"{m_filePrefix}{targetMonth}.zip");
        }

        public string GetArchiveLockPath(string targetMonth)
        {
            return Path.Combine(ArchiveDirectoryPath, $"{m_filePrefix}{targetMonth}.lock");
        }

        private string ResolveAuditFilePath(string monthDirectoryPath, DateTime now)
        {
            string dateToken = now.ToString("yyyyMMdd");
            string searchPattern = $"{m_filePrefix}{dateToken}_*.json";
            string[] candidateFiles = Directory.GetFiles(monthDirectoryPath, searchPattern);
            int maxSequence = 0;

            foreach (string candidateFile in candidateFiles)
            {
                string fileName = Path.GetFileNameWithoutExtension(candidateFile);
                if (fileName.Length <= m_filePrefix.Length + dateToken.Length + 1)
                    continue;

                string sequenceToken = fileName.Substring(m_filePrefix.Length + dateToken.Length + 1);
                if (int.TryParse(sequenceToken, out int sequence) == false)
                    continue;

                if (sequence > maxSequence)
                    maxSequence = sequence;
            }

            return Path.Combine(monthDirectoryPath, $"{m_filePrefix}{dateToken}_{(maxSequence + 1):D3}.json");
        }
    }
}
