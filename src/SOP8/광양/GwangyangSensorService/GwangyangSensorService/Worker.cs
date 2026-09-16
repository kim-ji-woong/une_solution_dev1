using System;
using System.Threading;
using System.Threading.Tasks;
using dnsDapperDBUtil.DataAccessLayer.DAL;
using GwangyangSensorService.Config;
using GwangyangSensorService.Logging;
using Microsoft.Extensions.Hosting;
using Microsoft.Extensions.Logging;
using Microsoft.Extensions.Options;

namespace GwangyangSensorService
{
    public class Worker : BackgroundService
    {
        private readonly ILogger<Worker> _logger;
        private readonly DataManager _dataManager;
        private readonly ProcessManager _processManager;
        private readonly WeatherApiOptions _weatherOptions;
        private readonly LogOptions _logOptions;
        private readonly MonitoringOptions _monitoringOptions;

        public Worker(
            ILogger<Worker> logger,
            DataManager dataManager,
            ProcessManager processManager,
            IOptions<WeatherApiOptions> weatherOptions,
            IOptions<LogOptions> logOptions,
            IOptions<MonitoringOptions> monitoringOptions)
        {
            _logger = logger;
            _dataManager = dataManager;
            _processManager = processManager;
            _weatherOptions = weatherOptions.Value;
            _logOptions = logOptions.Value;
            _monitoringOptions = monitoringOptions.Value;
        }

        /// <summary>
        /// 루프별 실패 추적기를 생성한다. 루프 1개당 1개를 루프 진입 시 만들어 재사용한다.
        /// </summary>
        /// <param name="escalateAfter">
        /// 승격 임계치를 개별 지정한다. null이면 설정값을 사용한다.
        /// 실패 신호가 예외뿐인 루프는 1을 넘겨 기존의 "즉시 Error" 동작을 유지한다.
        /// </param>
        private LoopFailureTracker CreateFailureTracker(string name, int? escalateAfter = null)
        {
            return new LoopFailureTracker(
                name,
                escalateAfter ?? _monitoringOptions.EscalateAfterConsecutiveFailures,
                TimeSpan.FromMinutes(_monitoringOptions.FailureRepeatIntervalMinutes),
                _monitoringOptions.SlowResponseWarningMs > 0
                    ? TimeSpan.FromMilliseconds(_monitoringOptions.SlowResponseWarningMs)
                    : TimeSpan.Zero);
        }

        public override Task StartAsync(CancellationToken cancellationToken)
        {
            using (FileLogger.Instance.BeginChannel("service"))
            {
                FileLogger.Instance.Initialize(
                    _logOptions,
                    (message, exception) => _logger.LogError(exception, "{message}", message));
                FileLogger.Instance.Info("GwangyangSensorService starting.");
            }

            _processManager.Initialize();
            return base.StartAsync(cancellationToken);
        }

        public override Task StopAsync(CancellationToken cancellationToken)
        {
            using (FileLogger.Instance.BeginChannel("service"))
                FileLogger.Instance.Info("GwangyangSensorService stopping.");

            FileLogger.Instance.Dispose();
            return base.StopAsync(cancellationToken);
        }

        protected override async Task ExecuteAsync(CancellationToken stoppingToken)
        {
            var reportTask = RunReportLastLoop(stoppingToken);
            var weatherTask = RunUltraSrtFcstLoop(stoppingToken);
            var alarmTask = RunWatchAlarmLoop(stoppingToken);
            var alarmOptionTask = RunWatchAlarmOptions(stoppingToken);
            var timeoutAlarmTask = RunWatchTimeoutAlarmLoop(stoppingToken);
            var fiveMinuteIngestTask = RunFiveMinuteIngestLoop(stoppingToken);
            var reloadCacheTask = RunReloadCacheLoop(stoppingToken);
            await Task.WhenAll(reportTask, weatherTask, alarmTask, alarmOptionTask, timeoutAlarmTask, fiveMinuteIngestTask, reloadCacheTask);
        }

        private async Task RunWatchAlarmLoop(CancellationToken stoppingToken)
        {
            using (FileLogger.Instance.BeginChannel("alarm"))
            {
                // 1.5초 주기라 설정값(기본 3)을 그대로 쓰면 4.5초 만에 승격된다.
                // 순간적인 DB 지연으로 EventLog가 오염되지 않도록 약 60초에 해당하는 횟수를 쓴다.
                var tracker = CreateFailureTracker("GetCurrentAlarmList", escalateAfter: 40);
                try
                {
                    while (!stoppingToken.IsCancellationRequested)
                    {
                        try
                        {
                            if (await _processManager.GetCurrentAlarmListAsync())
                                tracker.ReportSuccess();
                            else
                                tracker.ReportFailure("GetCurrentAlarmList returned false.");
                        }
                        catch (OperationCanceledException) when (stoppingToken.IsCancellationRequested)
                        {
                            throw;
                        }
                        catch (Exception ex)
                        {
                            FileLogger.Instance.Error($"RunWatchAlarmLoop failed: {ex.Message}");
                        }

                        await Task.Delay(TimeSpan.FromMilliseconds(1500), stoppingToken);
                    }
                }
                catch (OperationCanceledException) when (stoppingToken.IsCancellationRequested)
                {
                }
            }
        }

        private async Task RunWatchAlarmOptions(CancellationToken stoppingToken)
        {
            using (FileLogger.Instance.BeginChannel("alarm-options"))
            {
                // 2초 주기. 위와 같은 이유로 약 60초에 해당하는 횟수를 쓴다.
                var tracker = CreateFailureTracker("WatchAlarmOptions", escalateAfter: 30);
                try
                {
                    while (!stoppingToken.IsCancellationRequested)
                    {
                        try
                        {
                            if (await _processManager.WatchAlarmOptionsAsync())
                                tracker.ReportSuccess();
                            else
                                tracker.ReportFailure("WatchAlarmOptions returned false.");
                        }
                        catch (OperationCanceledException) when (stoppingToken.IsCancellationRequested)
                        {
                            throw;
                        }
                        catch (Exception ex)
                        {
                            FileLogger.Instance.Error($"RunWatchAlarmOptions failed: {ex.Message}");
                        }

                        await Task.Delay(TimeSpan.FromSeconds(2), stoppingToken);
                    }
                }
                catch (OperationCanceledException) when (stoppingToken.IsCancellationRequested)
                {
                }
            }
        }

        private async Task RunWatchTimeoutAlarmLoop(CancellationToken stoppingToken)
        {
            using (FileLogger.Instance.BeginChannel("timeout-alarm"))
            {
                var tracker = CreateFailureTracker("WatchTimeoutAlarm");
                try
                {
                    while (!stoppingToken.IsCancellationRequested)
                    {
                        try
                        {
                            bool ok = await _processManager.WatchTimeoutAlarmAsync(stoppingToken);

                            if (ok)
                                tracker.ReportSuccess();
                            else if (!stoppingToken.IsCancellationRequested)
                                tracker.ReportFailure("WatchTimeoutAlarm returned false.");
                        }
                        catch (OperationCanceledException) when (stoppingToken.IsCancellationRequested)
                        {
                            throw;
                        }
                        catch (Exception ex)
                        {
                            FileLogger.Instance.Error($"RunWatchTimeoutAlarmLoop failed: {ex.Message}");
                        }

                        await Task.Delay(TimeSpan.FromMinutes(1), stoppingToken);
                    }
                }
                catch (OperationCanceledException) when (stoppingToken.IsCancellationRequested)
                {
                }
            }
        }

        private async Task RunFiveMinuteIngestLoop(CancellationToken stoppingToken)
        {
            using (FileLogger.Instance.BeginChannel("five-minute"))
            {
                // 실패 신호가 예외뿐인 루프라 첫 실패부터 Error로 남긴다(기존 동작 유지).
                // 반복 실패만 억제해 동일 예외 도배를 막는다.
                var tracker = CreateFailureTracker("RunFiveMinuteIngestLoop", escalateAfter: 1);
                try
                {
                    while (!stoppingToken.IsCancellationRequested)
                    {
                        try
                        {
                            var inserted = await _processManager.FlushFiveMinuteHistoryAsync(stoppingToken);
                            if (inserted < 0)
                            {
                                tracker.ReportFailure("Five-minute history insert failed. See DB error above.");
                            }
                            else
                            {
                                if (inserted > 0)
                                    FileLogger.Instance.Info($"Inserted {inserted} rows into ex_sensor_his.");

                                tracker.ReportSuccess();
                            }
                        }
                        catch (OperationCanceledException) when (stoppingToken.IsCancellationRequested)
                        {
                            throw;
                        }
                        catch (Exception ex)
                        {
                            tracker.ReportFailure(ex.Message);
                        }

                        await Task.Delay(TimeSpan.FromMinutes(5), stoppingToken);
                    }
                }
                catch (OperationCanceledException) when (stoppingToken.IsCancellationRequested)
                {
                }
            }
        }

        private async Task RunReloadCacheLoop(CancellationToken stoppingToken)
        {
            using (FileLogger.Instance.BeginChannel("reload-cache"))
            {
                // 실패 신호가 예외뿐인 루프라 첫 실패부터 Error로 남긴다(기존 동작 유지).
                var tracker = CreateFailureTracker("RunReloadCacheLoop", escalateAfter: 1);
                try
                {
                    while (!stoppingToken.IsCancellationRequested)
                    {
                        try
                        {
                            bool reloaded = await Task.Run(() => _processManager.ReloadSensorCache(), stoppingToken);
                            if (reloaded)
                                tracker.ReportSuccess();
                            else
                                tracker.ReportFailure("Sensor cache reload failed. See cache load errors above.");
                        }
                        catch (OperationCanceledException) when (stoppingToken.IsCancellationRequested)
                        {
                            throw;
                        }
                        catch (Exception ex)
                        {
                            tracker.ReportFailure(ex.Message);
                        }

                        await Task.Delay(TimeSpan.FromMinutes(5), stoppingToken);
                    }
                }
                catch (OperationCanceledException) when (stoppingToken.IsCancellationRequested)
                {
                }
            }
        }

        private async Task RunReportLastLoop(CancellationToken stoppingToken)
        {
            using (FileLogger.Instance.BeginChannel("report-last"))
            {
                var tracker = CreateFailureTracker("report/last");
                try
                {
                    while (!stoppingToken.IsCancellationRequested)
                    {
                        try
                        {
                            var result = await _processManager.GetReportLastAsync(stoppingToken);
                            if (result.Success)
                                tracker.ReportSuccess(result.Elapsed);
                            else
                                tracker.ReportFailure($"{result.Error} | elapsed={result.ElapsedMs}ms");
                        }
                        catch (OperationCanceledException) when (stoppingToken.IsCancellationRequested)
                        {
                            throw;
                        }
                        catch (Exception ex)
                        {
                            FileLogger.Instance.Error($"RunReportLastLoop failed: {ex.Message}");
                        }

                        await Task.Delay(TimeSpan.FromSeconds(30), stoppingToken);
                    }
                }
                catch (OperationCanceledException) when (stoppingToken.IsCancellationRequested)
                {
                }
            }
        }

        private async Task RunUltraSrtFcstLoop(CancellationToken stoppingToken)
        {
            using (FileLogger.Instance.BeginChannel("weather"))
            {
                var tracker = CreateFailureTracker("getUltraSrtFcst");
                try
                {
                    while (!stoppingToken.IsCancellationRequested)
                    {
                        try
                        {
                            (string baseDate, string baseTime) = GetUltraSrtFcstBaseDateTime();
                            var result = await _processManager.GetUltraSrtFcstAsync(
                                _weatherOptions.ServiceKey,
                                baseDate,
                                baseTime,
                                _weatherOptions.Nx,
                                _weatherOptions.Ny,
                                _weatherOptions.NumOfRows,
                                _weatherOptions.PageNo,
                                _weatherOptions.DataType,
                                _weatherOptions.BaseUrl,
                                stoppingToken);
                            if (result.Success)
                                tracker.ReportSuccess(result.Elapsed);
                            else
                                tracker.ReportFailure($"{result.Error} | elapsed={result.ElapsedMs}ms");
                        }
                        catch (OperationCanceledException) when (stoppingToken.IsCancellationRequested)
                        {
                            throw;
                        }
                        catch (Exception ex)
                        {
                            FileLogger.Instance.Error($"RunUltraSrtFcstLoop failed: {ex.Message}");
                        }

                        await Task.Delay(TimeSpan.FromMinutes(10), stoppingToken);
                    }
                }
                catch (OperationCanceledException) when (stoppingToken.IsCancellationRequested)
                {
                }
            }
        }

        private static (string BaseDate, string BaseTime) GetUltraSrtFcstBaseDateTime()
        {
            var kst = TimeZoneInfo.FindSystemTimeZoneById("Korea Standard Time");
            var nowKst = TimeZoneInfo.ConvertTime(DateTimeOffset.UtcNow, kst);

            DateTimeOffset baseTimePoint = nowKst.Minute < 45 ? nowKst.AddHours(-1) : nowKst;
            baseTimePoint = new DateTimeOffset(
                baseTimePoint.Year,
                baseTimePoint.Month,
                baseTimePoint.Day,
                baseTimePoint.Hour,
                30,
                0,
                baseTimePoint.Offset);

            return (baseTimePoint.ToString("yyyyMMdd"), baseTimePoint.ToString("HHmm"));
        }
    }
}
