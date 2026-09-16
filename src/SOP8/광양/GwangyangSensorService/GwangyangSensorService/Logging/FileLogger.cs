using System;
using System.Collections.Concurrent;
using System.Collections.Generic;
using System.IO;
using System.IO.Compression;
using System.Linq;
using System.Text;
using System.Threading;
using System.Threading.Tasks;
using GwangyangSensorService.Config;

namespace GwangyangSensorService.Logging
{
    public sealed class FileLogger : IDisposable
    {
        private static readonly Lazy<FileLogger> InstanceHolder = new Lazy<FileLogger>(() => new FileLogger());

        private const int QueueCapacity = 10000;

        /// <summary>
        /// 반복이 멈춘 메시지의 집계분을 뽑아내는 점검 주기. 억제 창보다 짧아야 요약이 창 경계에서 나온다.
        /// </summary>
        private static readonly TimeSpan DuplicateDrainInterval = TimeSpan.FromSeconds(60);

        private static readonly UTF8Encoding Utf8NoBom = new UTF8Encoding(false);
        private readonly BlockingCollection<LogEntry> _queue = new BlockingCollection<LogEntry>(QueueCapacity);
        private readonly Task _writerTask;
        private readonly object _initLock = new object();
        private readonly object _cleanupLock = new object();
        private readonly AsyncLocal<string?> _currentChannel = new AsyncLocal<string?>();

        private bool _initialized;
        private bool _useChannelFolders = true;
        private string _logFolder = string.Empty;
        private string _logFileTag = "Log";
        private int _logLifeTimeDays = 30;
        private int _archiveAfterDays = 14;
        private int _deleteArchiveAfterDays = 365;
        private string _fallbackFolder = string.Empty;
        private DateTime _lastCleanupDate = DateTime.MinValue;
        private Action<string, Exception?>? _eventLogSink;
        private long _maxArchiveBytes = 30L * 1024 * 1024 * 1024;
        private long _maxActiveFileSizeBytes = 100L * 1024 * 1024;
        private long _droppedLogCount;
        private LogDeduplicator? _deduplicator;
        private Timer? _duplicateDrainTimer;

        private FileLogger()
        {
            _writerTask = Task.Run(WriterLoop);
        }

        public static FileLogger Instance => InstanceHolder.Value;

        public IDisposable BeginChannel(string channel)
        {
            return new ChannelScope(this, NormalizeChannel(channel), _currentChannel.Value);
        }

        public void Initialize(LogOptions options, Action<string, Exception?>? eventLogSink = null)
        {
            if (options == null)
                throw new ArgumentNullException(nameof(options));

            lock (_initLock)
            {
                if (_initialized)
                    return;

                _logFolder = options.LogFolder ?? string.Empty;
                _logFileTag = string.IsNullOrWhiteSpace(options.LogFileTag) ? "Log" : options.LogFileTag;
                _logLifeTimeDays = options.LogLifeTime <= 0 ? 30 : options.LogLifeTime;
                _useChannelFolders = options.UseChannelFolders;
                _archiveAfterDays = options.ArchiveAfterDays < 0 ? 0 : options.ArchiveAfterDays;
                _deleteArchiveAfterDays = options.DeleteArchiveAfterDays < 0 ? 0 : options.DeleteArchiveAfterDays;
                _maxArchiveBytes = options.MaxArchiveSizeGB <= 0 ? 0 : (long)options.MaxArchiveSizeGB * 1024 * 1024 * 1024;
                _maxActiveFileSizeBytes = options.MaxActiveFileSizeMB <= 0 ? 0 : (long)options.MaxActiveFileSizeMB * 1024 * 1024;
                _fallbackFolder = Path.Combine(Path.GetTempPath(), _logFileTag);
                _eventLogSink = eventLogSink;

                EnsureFolder(_logFolder);
                EnsureFolder(_fallbackFolder);
                CleanupOldLogs(DateTime.Now.Date, null);
                StartDuplicateSuppression(options);

                _initialized = true;
            }
        }

        public void Info(string message) => Enqueue(LogLevel.Info, message, null);
        public void Warn(string message) => Enqueue(LogLevel.Warn, message, null);
        public void Debug(string message) => Enqueue(LogLevel.Debug, message, null);
        public void Error(string message) => Enqueue(LogLevel.Error, message, null);
        public void Error(Exception ex, string message = null) => Enqueue(LogLevel.Error, message, ex);

        public void Dispose()
        {
            // 타이머를 먼저 멈추고, 남은 반복 집계분을 큐에 넣은 다음 큐를 닫는다.
            // 순서가 바뀌면 종료 시점의 집계분이 그대로 사라진다.
            StopDuplicateDrainTimer();
            DrainDuplicateSummaries(drainAll: true);

            _queue.CompleteAdding();
            try
            {
                _writerTask.Wait(TimeSpan.FromSeconds(5));
            }
            catch
            {
                // Best effort shutdown.
            }
        }

        private void Enqueue(LogLevel level, string message, Exception? exception)
        {
            if (!_initialized)
                return;

            var entry = new LogEntry(level, message, exception, GetCurrentChannel());

            var deduplicator = _deduplicator;
            if (deduplicator != null)
            {
                if (!deduplicator.TryAccept(entry, out string? repeatPrefix))
                    return;

                if (repeatPrefix != null)
                    entry = entry.WithMessage(repeatPrefix + (entry.Message ?? string.Empty));
            }

            Submit(entry);
        }

        /// <summary>
        /// 중복 억제를 거치지 않고 큐에 넣는다. 억제 요약처럼 그 자체가 이미 집계된 로그에 사용한다.
        /// </summary>
        private void EnqueueWithoutSuppression(LogLevel level, string message, string channel)
        {
            if (!_initialized)
                return;

            Submit(new LogEntry(level, message, null, channel));
        }

        private void Submit(LogEntry entry)
        {
            if (entry.Level == LogLevel.Error)
                TryWriteEventLog(entry);

            if (_queue.IsAddingCompleted)
                return;

            if (!_queue.TryAdd(entry))
                Interlocked.Increment(ref _droppedLogCount);
        }

        private void StartDuplicateSuppression(LogOptions options)
        {
            if (options.DuplicateSuppressionMinutes <= 0)
                return;

            TimeSpan window = TimeSpan.FromMinutes(options.DuplicateSuppressionMinutes);
            _deduplicator = new LogDeduplicator(window, options.DuplicateSuppressionMaxKeys);

            TimeSpan interval = window < DuplicateDrainInterval ? window : DuplicateDrainInterval;
            _duplicateDrainTimer = new Timer(_ => DrainDuplicateSummaries(drainAll: false), null, interval, interval);
        }

        private void StopDuplicateDrainTimer()
        {
            Timer? timer = Interlocked.Exchange(ref _duplicateDrainTimer, null);
            if (timer == null)
                return;

            try
            {
                using (var callbacksCompleted = new ManualResetEvent(false))
                {
                    if (timer.Dispose(callbacksCompleted))
                        callbacksCompleted.WaitOne(TimeSpan.FromSeconds(2));
                }
            }
            catch
            {
                // Best effort timer shutdown.
            }
        }

        /// <summary>
        /// 억제해 둔 반복 집계분을 요약 로그로 내보낸다. 타이머 스레드에서 주기적으로 호출된다.
        /// </summary>
        private void DrainDuplicateSummaries(bool drainAll)
        {
            var deduplicator = _deduplicator;
            if (deduplicator == null)
                return;

            try
            {
                DateTime now = DateTime.Now;
                var pendingRepeats = drainAll ? deduplicator.DrainAll(now) : deduplicator.DrainStale(now);
                foreach (var pending in pendingRepeats)
                    EnqueueWithoutSuppression(pending.Level, pending.Message, pending.Channel);

                long unsuppressed = deduplicator.TakeUnsuppressedByCapacityCount();
                if (unsuppressed > 0)
                {
                    EnqueueWithoutSuppression(
                        LogLevel.Warn,
                        $"FileLogger duplicate suppression capacity reached. keys={deduplicator.TrackedKeyCount}, unsuppressed={unsuppressed}",
                        "service");
                }
            }
            catch
            {
                // Best effort duplicate summary flush.
            }
        }

        private void WriterLoop()
        {
            StreamWriter? currentWriter = null;
            string? currentFilePath = null;

            try
            {
                foreach (var entry in _queue.GetConsumingEnumerable())
                {
                    try
                    {
                        FlushDroppedLogNotice(ref currentWriter, ref currentFilePath);

                        DateTime entryDate = entry.Timestamp.Date;
                        if (entryDate != _lastCleanupDate)
                            CleanupOldLogs(entryDate, currentFilePath);

                        string payload = FormatEntry(entry);
                        string filePath = ResolveActiveLogFilePath(entry, currentWriter, currentFilePath, Utf8NoBom.GetByteCount(payload));
                        if (currentWriter == null || !string.Equals(currentFilePath, filePath, StringComparison.OrdinalIgnoreCase))
                        {
                            currentWriter?.Dispose();
                            currentWriter = OpenWriter(filePath);
                            currentFilePath = filePath;
                        }

                        currentWriter.Write(payload);
                    }
                    catch
                    {
                        currentWriter?.Dispose();
                        currentWriter = null;
                        currentFilePath = null;

                        try
                        {
                            string fallbackPath = BuildFallbackFilePath(entry);
                            EnsureFolder(Path.GetDirectoryName(fallbackPath));
                            File.AppendAllText(fallbackPath, FormatEntry(entry), Utf8NoBom);
                        }
                        catch
                        {
                            // Ignore fallback failures.
                        }
                    }
                }

                FlushDroppedLogNotice(ref currentWriter, ref currentFilePath);
            }
            finally
            {
                currentWriter?.Dispose();
            }
        }

        private void FlushDroppedLogNotice(ref StreamWriter? currentWriter, ref string? currentFilePath)
        {
            long dropped = Interlocked.Exchange(ref _droppedLogCount, 0);
            if (dropped <= 0)
                return;

            var entry = new LogEntry(LogLevel.Warn, $"FileLogger queue overflow. dropped={dropped}", null, "service");
            string payload = FormatEntry(entry);
            string filePath = ResolveActiveLogFilePath(entry, currentWriter, currentFilePath, Utf8NoBom.GetByteCount(payload));
            if (currentWriter == null || !string.Equals(currentFilePath, filePath, StringComparison.OrdinalIgnoreCase))
            {
                currentWriter?.Dispose();
                currentWriter = OpenWriter(filePath);
                currentFilePath = filePath;
            }

            currentWriter.Write(payload);
        }

        private void TryWriteEventLog(LogEntry entry)
        {
            var sink = _eventLogSink;
            if (sink == null)
                return;

            try
            {
                sink(entry.Message ?? string.Empty, entry.Exception);
            }
            catch
            {
                // Best effort event log write.
            }
        }

        private string ResolveActiveLogFilePath(LogEntry entry, StreamWriter? currentWriter, string? currentFilePath, int entryByteCount)
        {
            string channel = NormalizeChannel(entry.Channel);
            string dateTag = entry.Timestamp.ToString("yyyyMMdd");
            string folderPath = GetChannelFolder(channel);
            EnsureFolder(folderPath);

            if (!string.IsNullOrWhiteSpace(currentFilePath) && IsActiveLogPathFor(currentFilePath, folderPath, dateTag))
            {
                if (CanAppendToCurrentFile(currentWriter, entryByteCount))
                    return currentFilePath;

                int currentSequence = TryParseSequence(currentFilePath, out int parsedSequence) ? parsedSequence : 1;
                return BuildActiveLogFilePath(entry.Timestamp, channel, currentSequence + 1);
            }

            if (_maxActiveFileSizeBytes <= 0)
                return BuildActiveLogFilePath(entry.Timestamp, channel, 1);

            string searchPattern = $"{_logFileTag}_{dateTag}_*.txt";
            var existingFiles = new DirectoryInfo(folderPath)
                .GetFiles(searchPattern, SearchOption.TopDirectoryOnly)
                .Where(file => TryParseSequence(file.Name, out _))
                .OrderBy(file => file.Name, StringComparer.OrdinalIgnoreCase)
                .ToArray();

            if (existingFiles.Length == 0)
                return BuildActiveLogFilePath(entry.Timestamp, channel, 1);

            FileInfo latest = existingFiles[existingFiles.Length - 1];
            if (latest.Length + entryByteCount <= _maxActiveFileSizeBytes)
                return latest.FullName;

            int latestSequence = TryParseSequence(latest.Name, out int parsed) ? parsed : 1;
            return BuildActiveLogFilePath(entry.Timestamp, channel, latestSequence + 1);
        }

        private bool CanAppendToCurrentFile(StreamWriter? currentWriter, int entryByteCount)
        {
            if (_maxActiveFileSizeBytes <= 0)
                return true;

            if (currentWriter?.BaseStream == null)
                return false;

            return currentWriter.BaseStream.Length + entryByteCount <= _maxActiveFileSizeBytes;
        }

        private string BuildFallbackFilePath(LogEntry entry)
        {
            string channel = NormalizeChannel(entry.Channel);
            string folderPath = _useChannelFolders ? Path.Combine(_fallbackFolder, channel) : _fallbackFolder;
            string dateTag = entry.Timestamp.ToString("yyyyMMdd");
            return Path.Combine(folderPath, $"{_logFileTag}_{dateTag}_001.txt");
        }

        private string BuildActiveLogFilePath(DateTime timestamp, string channel, int sequence)
        {
            string folderPath = GetChannelFolder(channel);
            string dateTag = timestamp.ToString("yyyyMMdd");
            string fileName = $"{_logFileTag}_{dateTag}_{sequence:D3}.txt";
            return Path.Combine(folderPath, fileName);
        }

        private StreamWriter OpenWriter(string filePath)
        {
            EnsureFolder(Path.GetDirectoryName(filePath));
            var stream = new FileStream(filePath, FileMode.Append, FileAccess.Write, FileShare.Read);
            return new StreamWriter(stream, Utf8NoBom) { AutoFlush = true };
        }

        private string FormatEntry(LogEntry entry)
        {
            var sb = new StringBuilder();
            sb.Append('[').Append(entry.Timestamp.ToString("yyyy-MM-dd HH:mm:ss.fff")).Append("] ");
            sb.Append('[').Append(entry.Level).Append("] ");
            sb.Append("[C:").Append(entry.Channel).Append("] ");
            sb.Append("[T:").Append(entry.ThreadId).Append("] ");
            sb.Append(entry.Message ?? string.Empty);
            sb.AppendLine();

            if (entry.Exception != null)
                sb.AppendLine(entry.Exception.ToString());

            return sb.ToString();
        }

        private void CleanupOldLogs(DateTime nowDate, string? activeFilePath)
        {
            _lastCleanupDate = nowDate;
            if (string.IsNullOrWhiteSpace(_logFolder))
                return;

            if (!Monitor.TryEnter(_cleanupLock))
                return;

            try
            {
                foreach (string channel in GetCleanupChannels())
                {
                    ArchiveClosedMonthLogs(channel, nowDate, activeFilePath);
                    DeleteExpiredArchiveFiles(channel, nowDate);
                }

                EnforceArchiveSizeLimit();
                DeleteLegacyTextLogs(nowDate);
            }
            catch
            {
                // Best effort cleanup.
            }
            finally
            {
                Monitor.Exit(_cleanupLock);
            }
        }

        private IEnumerable<string> GetCleanupChannels()
        {
            if (!_useChannelFolders)
                return new[] { "service" };

            if (!Directory.Exists(_logFolder))
                return Array.Empty<string>();

            return Directory.GetDirectories(_logFolder, "*", SearchOption.TopDirectoryOnly)
                .Select(Path.GetFileName)
                .Where(name => !string.IsNullOrWhiteSpace(name) && !string.Equals(name, "archive", StringComparison.OrdinalIgnoreCase))
                .Select(name => name!)
                .Distinct(StringComparer.OrdinalIgnoreCase)
                .ToArray();
        }

        private void ArchiveClosedMonthLogs(string channel, DateTime nowDate, string? activeFilePath)
        {
            string channelFolder = GetChannelFolder(channel);
            if (!Directory.Exists(channelFolder))
                return;

            var monthlyFiles = new Dictionary<string, List<FileInfo>>(StringComparer.OrdinalIgnoreCase);
            foreach (var file in new DirectoryInfo(channelFolder).GetFiles($"{_logFileTag}_*.txt", SearchOption.TopDirectoryOnly))
            {
                if (!TryParseActiveLogDate(file.Name, out DateTime fileDate))
                    continue;

                if (!string.IsNullOrWhiteSpace(activeFilePath) && string.Equals(file.FullName, activeFilePath, StringComparison.OrdinalIgnoreCase))
                    continue;

                if (fileDate.Year == nowDate.Year && fileDate.Month == nowDate.Month)
                    continue;

                if (_archiveAfterDays > 0 && fileDate.Date > nowDate.AddDays(-_archiveAfterDays))
                    continue;

                string monthKey = fileDate.ToString("yyyy-MM");
                if (!monthlyFiles.TryGetValue(monthKey, out var list))
                {
                    list = new List<FileInfo>();
                    monthlyFiles[monthKey] = list;
                }

                list.Add(file);
            }

            if (monthlyFiles.Count == 0)
                return;

            string archiveFolder = GetArchiveFolder(channel);
            EnsureFolder(archiveFolder);

            foreach (var kvp in monthlyFiles)
            {
                string archivePath = Path.Combine(archiveFolder, $"{kvp.Key}.zip");
                if (File.Exists(archivePath))
                    continue;

                string tempArchivePath = archivePath + ".tmp";
                try
                {
                    if (File.Exists(tempArchivePath))
                        File.Delete(tempArchivePath);

                    using (var stream = new FileStream(tempArchivePath, FileMode.CreateNew, FileAccess.ReadWrite, FileShare.None))
                    using (var archive = new ZipArchive(stream, ZipArchiveMode.Create, leaveOpen: false, entryNameEncoding: Encoding.UTF8))
                    {
                        foreach (var file in kvp.Value.OrderBy(x => x.Name, StringComparer.OrdinalIgnoreCase))
                            archive.CreateEntryFromFile(file.FullName, file.Name, CompressionLevel.Optimal);
                    }

                    var archiveInfo = new FileInfo(tempArchivePath);
                    if (!archiveInfo.Exists || archiveInfo.Length <= 0)
                    {
                        if (archiveInfo.Exists)
                            archiveInfo.Delete();
                        continue;
                    }

                    File.Move(tempArchivePath, archivePath);

                    foreach (var file in kvp.Value)
                    {
                        if (file.Exists)
                            file.Delete();
                    }
                }
                catch
                {
                    try
                    {
                        if (File.Exists(tempArchivePath))
                            File.Delete(tempArchivePath);
                    }
                    catch
                    {
                        // Ignore archive cleanup failures.
                    }
                }
            }
        }

        private void DeleteExpiredArchiveFiles(string channel, DateTime nowDate)
        {
            if (_deleteArchiveAfterDays <= 0)
                return;

            string archiveFolder = GetArchiveFolder(channel);
            if (!Directory.Exists(archiveFolder))
                return;

            DateTime cutoff = nowDate.AddDays(-_deleteArchiveAfterDays);
            foreach (var file in new DirectoryInfo(archiveFolder).GetFiles("*.zip", SearchOption.TopDirectoryOnly))
            {
                if (!TryParseArchiveMonth(file.Name, out DateTime monthStart))
                    continue;

                DateTime monthEnd = monthStart.AddMonths(1).AddDays(-1);
                if (monthEnd.Date > cutoff.Date)
                    continue;

                try
                {
                    file.Delete();
                }
                catch
                {
                    // Ignore archive delete failures.
                }
            }
        }

        private void EnforceArchiveSizeLimit()
        {
            if (_maxArchiveBytes <= 0)
                return;

            var archiveFiles = GetAllArchiveFiles().ToList();
            long totalBytes = archiveFiles.Sum(file => file.File.Length);
            while (totalBytes > _maxArchiveBytes)
            {
                var candidates = archiveFiles
                    .GroupBy(file => file.Channel, StringComparer.OrdinalIgnoreCase)
                    .Select(group => group.OrderBy(file => file.MonthStart).ThenBy(file => file.File.Name, StringComparer.OrdinalIgnoreCase).FirstOrDefault())
                    .Where(file => file != null)
                    .OrderBy(file => file!.MonthStart)
                    .ThenBy(file => file!.Channel, StringComparer.OrdinalIgnoreCase)
                    .ToList();

                if (candidates.Count == 0)
                    break;

                var target = candidates[0]!;
                try
                {
                    long deletedBytes = target.File.Length;
                    target.File.Delete();
                    totalBytes -= deletedBytes;
                    archiveFiles.Remove(target);
                }
                catch
                {
                    archiveFiles.Remove(target);
                }
            }
        }

        private IEnumerable<ArchiveFileInfo> GetAllArchiveFiles()
        {
            if (string.IsNullOrWhiteSpace(_logFolder) || !Directory.Exists(_logFolder))
                return Enumerable.Empty<ArchiveFileInfo>();

            var results = new List<ArchiveFileInfo>();
            foreach (string channel in GetCleanupChannels())
            {
                string archiveFolder = GetArchiveFolder(channel);
                if (!Directory.Exists(archiveFolder))
                    continue;

                foreach (var file in new DirectoryInfo(archiveFolder).GetFiles("*.zip", SearchOption.TopDirectoryOnly))
                {
                    if (!TryParseArchiveMonth(file.Name, out DateTime monthStart))
                        continue;

                    results.Add(new ArchiveFileInfo(channel, monthStart, file));
                }
            }

            return results;
        }

        private void DeleteLegacyTextLogs(DateTime nowDate)
        {
            if (_logLifeTimeDays <= 0)
                return;

            DateTime cutoff = nowDate.AddDays(-_logLifeTimeDays);
            foreach (string channel in GetCleanupChannels())
            {
                string channelFolder = GetChannelFolder(channel);
                if (!Directory.Exists(channelFolder))
                    continue;

                foreach (var file in new DirectoryInfo(channelFolder).GetFiles($"{_logFileTag}_*.txt", SearchOption.TopDirectoryOnly))
                {
                    if (!TryParseActiveLogDate(file.Name, out DateTime fileDate))
                        continue;

                    if (fileDate.Date > cutoff.Date)
                        continue;

                    if (fileDate.Year == nowDate.Year && fileDate.Month == nowDate.Month)
                        continue;

                    try
                    {
                        file.Delete();
                    }
                    catch
                    {
                        // Ignore legacy cleanup failures.
                    }
                }
            }
        }

        private string GetChannelFolder(string channel)
        {
            string normalizedChannel = NormalizeChannel(channel);
            return _useChannelFolders ? Path.Combine(_logFolder, normalizedChannel) : _logFolder;
        }

        private string GetArchiveFolder(string channel)
        {
            return Path.Combine(GetChannelFolder(channel), "archive");
        }

        private string GetCurrentChannel()
        {
            return NormalizeChannel(_currentChannel.Value);
        }

        private static string NormalizeChannel(string? channel)
        {
            if (string.IsNullOrWhiteSpace(channel))
                return "service";

            var sb = new StringBuilder(channel.Length);
            foreach (char ch in channel.Trim())
            {
                if (char.IsLetterOrDigit(ch) || ch == '-' || ch == '_')
                    sb.Append(char.ToLowerInvariant(ch));
                else
                    sb.Append('_');
            }

            return sb.Length == 0 ? "service" : sb.ToString();
        }

        private static bool IsActiveLogPathFor(string filePath, string expectedFolderPath, string expectedDateTag)
        {
            if (!string.Equals(Path.GetDirectoryName(filePath), expectedFolderPath, StringComparison.OrdinalIgnoreCase))
                return false;

            return TryParseActiveLogDate(Path.GetFileName(filePath), out DateTime fileDate)
                && string.Equals(fileDate.ToString("yyyyMMdd"), expectedDateTag, StringComparison.OrdinalIgnoreCase);
        }

        private static bool TryParseActiveLogDate(string fileName, out DateTime fileDate)
        {
            fileDate = default;
            string nameWithoutExtension = Path.GetFileNameWithoutExtension(fileName);
            int lastUnderscore = nameWithoutExtension.LastIndexOf('_');
            if (lastUnderscore < 0)
                return false;

            int secondLastUnderscore = nameWithoutExtension.LastIndexOf('_', lastUnderscore - 1);
            if (secondLastUnderscore < 0)
                return false;

            string datePart = nameWithoutExtension.Substring(secondLastUnderscore + 1, lastUnderscore - secondLastUnderscore - 1);
            if (datePart.Length != 8)
                return false;

            if (!int.TryParse(datePart.Substring(0, 4), out int year) ||
                !int.TryParse(datePart.Substring(4, 2), out int month) ||
                !int.TryParse(datePart.Substring(6, 2), out int day))
                return false;

            try
            {
                fileDate = new DateTime(year, month, day);
                return true;
            }
            catch
            {
                return false;
            }
        }

        private static bool TryParseSequence(string filePathOrName, out int sequence)
        {
            sequence = 0;
            string nameWithoutExtension = Path.GetFileNameWithoutExtension(filePathOrName);
            int lastUnderscore = nameWithoutExtension.LastIndexOf('_');
            if (lastUnderscore < 0)
                return false;

            string sequencePart = nameWithoutExtension.Substring(lastUnderscore + 1);
            return int.TryParse(sequencePart, out sequence);
        }

        private static bool TryParseArchiveMonth(string fileName, out DateTime monthStart)
        {
            monthStart = default;
            string nameWithoutExtension = Path.GetFileNameWithoutExtension(fileName);
            if (nameWithoutExtension.Length != 7 || nameWithoutExtension[4] != '-')
                return false;

            if (!int.TryParse(nameWithoutExtension.Substring(0, 4), out int year) ||
                !int.TryParse(nameWithoutExtension.Substring(5, 2), out int month))
                return false;

            try
            {
                monthStart = new DateTime(year, month, 1);
                return true;
            }
            catch
            {
                return false;
            }
        }

        private static void EnsureFolder(string? folder)
        {
            if (string.IsNullOrWhiteSpace(folder))
                return;

            Directory.CreateDirectory(folder);
        }

        private sealed class ChannelScope : IDisposable
        {
            private readonly FileLogger _logger;
            private readonly string? _previousChannel;
            private bool _disposed;

            public ChannelScope(FileLogger logger, string channel, string? previousChannel)
            {
                _logger = logger;
                _previousChannel = previousChannel;
                _logger._currentChannel.Value = channel;
            }

            public void Dispose()
            {
                if (_disposed)
                    return;

                _logger._currentChannel.Value = _previousChannel;
                _disposed = true;
            }
        }

        private sealed class ArchiveFileInfo
        {
            public ArchiveFileInfo(string channel, DateTime monthStart, FileInfo file)
            {
                Channel = channel;
                MonthStart = monthStart;
                File = file;
            }

            public string Channel { get; }
            public DateTime MonthStart { get; }
            public FileInfo File { get; }
        }
    }

    public enum LogLevel
    {
        Debug,
        Info,
        Warn,
        Error
    }

    public sealed class LogEntry
    {
        public DateTime Timestamp { get; }
        public LogLevel Level { get; }
        public string Message { get; }
        public Exception? Exception { get; }
        public int ThreadId { get; }
        public string Channel { get; }

        public LogEntry(LogLevel level, string message, Exception? exception, string channel)
        {
            Timestamp = DateTime.Now;
            Level = level;
            Message = message;
            Exception = exception;
            ThreadId = Thread.CurrentThread.ManagedThreadId;
            Channel = string.IsNullOrWhiteSpace(channel) ? "service" : channel;
        }

        private LogEntry(LogEntry source, string message)
        {
            Timestamp = source.Timestamp;
            Level = source.Level;
            Message = message;
            Exception = source.Exception;
            ThreadId = source.ThreadId;
            Channel = source.Channel;
        }

        /// <summary>
        /// 발생 시각/스레드/채널을 유지한 채 메시지만 바꾼 복사본을 만든다. 중복 억제 접두어를 붙일 때 사용한다.
        /// </summary>
        public LogEntry WithMessage(string message) => new LogEntry(this, message);
    }
}
