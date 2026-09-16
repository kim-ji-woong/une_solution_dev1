using System;
using System.IO;
using System.Text;

namespace dnsSMS.LogManager.YoungJin
{
    internal class YoungJinLogWriter
    {
        private const long MaxLogFileSizeBytes = 100L * 1024L * 1024L;
        private const string LogFilePrefix = "une_sms_";
        private static readonly object _logLock = new object();

        private readonly string m_logRootPath;

        public YoungJinLogWriter(string logRootPath)
        {
            m_logRootPath = logRootPath;
        }

        public string LogRootPath
        {
            get { return m_logRootPath; }
        }

        public string ArchiveDirectoryPath
        {
            get { return Path.Combine(m_logRootPath, "archive"); }
        }

        public static string Sanitize(string value)
        {
            if (value == null)
                return "";

            return value.Replace("\r", " ").Replace("\n", " ").Replace("\t", " ").Replace("\"", "'").Trim();
        }

        public void AppendLogLine(DateTime now, string category, string message)
        {
            Directory.CreateDirectory(m_logRootPath);

            lock (_logLock)
            {
                string logFile = ResolveLogFilePath(now);
                string line = $"[{now:yyyy-MM-dd HH:mm:ss}] [{Sanitize(category)}] {Sanitize(message)}";
                File.AppendAllText(logFile, line + Environment.NewLine, Encoding.UTF8);
            }
        }

        public string[] GetMonthLogFiles(string targetMonth)
        {
            if (Directory.Exists(m_logRootPath) == false)
                return Array.Empty<string>();

            return Directory.GetFiles(m_logRootPath, $"{LogFilePrefix}{targetMonth}*.log");
        }

        public string GetArchiveZipPath(string targetMonth)
        {
            return Path.Combine(ArchiveDirectoryPath, $"{LogFilePrefix}{targetMonth}.zip");
        }

        public string GetArchiveLockPath(string targetMonth)
        {
            return Path.Combine(ArchiveDirectoryPath, $"{LogFilePrefix}{targetMonth}.lock");
        }

        private string ResolveLogFilePath(DateTime now)
        {
            string dateToken = now.ToString("yyyyMMdd");
            string searchPattern = $"{LogFilePrefix}{dateToken}_*.log";
            string[] candidateFiles = Directory.GetFiles(m_logRootPath, searchPattern);
            int maxSequence = 0;
            string selectedPath = null;

            foreach (string candidateFile in candidateFiles)
            {
                string fileName = Path.GetFileNameWithoutExtension(candidateFile);
                if (fileName.Length <= LogFilePrefix.Length + dateToken.Length + 1)
                    continue;

                string sequenceToken = fileName.Substring(LogFilePrefix.Length + dateToken.Length + 1);
                if (int.TryParse(sequenceToken, out int sequence) == false)
                    continue;

                if (sequence > maxSequence)
                    maxSequence = sequence;
            }

            if (maxSequence == 0)
                maxSequence = 1;

            while (true)
            {
                selectedPath = Path.Combine(m_logRootPath, $"{LogFilePrefix}{dateToken}_{maxSequence:D3}.log");
                if (File.Exists(selectedPath) == false)
                    return selectedPath;

                FileInfo fileInfo = new FileInfo(selectedPath);
                if (fileInfo.Length < MaxLogFileSizeBytes)
                    return selectedPath;

                maxSequence++;
            }
        }
    }
}