using System;
using System.Collections.Generic;
using System.Linq;
using System.Net.Http;
using System.Threading;
using System.Threading.Tasks;
using Base.Model.Account;
using Base.Model.Alarm;
using dnsDapperDBUtil.DataAccessLayer.DAL;
using GwangyangSensorService.Config;
using GwangyangSensorService.Logging;
using GwangyangSensorService.Models;
using Microsoft.Extensions.Options;
using Newtonsoft.Json.Linq;

namespace GwangyangSensorService.Managers
{
    public class AlarmManager
    {
        private readonly string SopWebServerUrl;
        
        private readonly DataManager m_dataManager;
        private readonly List<Current> _alarmList = new List<Current>(2048);
        private volatile IReadOnlyDictionary<int, bool> _useAlarmDic = new Dictionary<int, bool>();
        private readonly HttpClient _httpClient;
        private readonly object _alarmLock = new Object();
        private readonly SemaphoreSlim _useAlarmLoadLock = new SemaphoreSlim(1, 1);
        private static readonly TimeSpan UseAlarmRefreshWarningThreshold = TimeSpan.FromMinutes(5);
        private static readonly TimeSpan UseAlarmWarnThrottle = TimeSpan.FromMinutes(1);
        private DateTime _lastUseAlarmRefreshUtc = DateTime.MinValue;
        private DateTime _lastUseAlarmWarnUtc = DateTime.MinValue;
        private volatile bool _useAlarmLoadAttempted;
        private bool _useAlarmReady;
        
        public AlarmManager(DataManager dataManager, IOptions<SiteOptions> siteOptions, IHttpClientFactory httpClientFactory)
        {
            m_dataManager = dataManager;
            SopWebServerUrl = siteOptions.Value.SOPWebServerURL;
            _httpClient = httpClientFactory.CreateClient("SopApi");
        }

        public IReadOnlyList<Current> GetAlarmSnapshot()
        {
            lock (_alarmLock)
            {
                return _alarmList.ToList();
            }
        }

        public async Task<bool> WatchAlarmAsync()
        {
            try
            {
                string errorMessage = string.Empty;
                
                var result = await Task.Run(() => m_dataManager.GetSelect().Select<Current>(null, out errorMessage));
                if (result == null)
                {
                    // 1.5초 주기 루프이므로 Warn으로 남긴다.
                    // EventLog로 올라가는 Error는 Worker의 LoopFailureTracker가 연속 실패를 집계해 1회만 발생시킨다.
                    FileLogger.Instance.Warn($"Failed to retrieve alarm data: {errorMessage}");
                    return false;
                }

                var rows = result as IList<Current> ?? result.ToList();

                lock (_alarmLock)
                {
                    _alarmList.Clear();
                    _alarmList.AddRange(rows);
                }
                return true;
            }
            catch (Exception e)
            {
                FileLogger.Instance.Warn($"Error in WatchAlarm: {e.Message}");
                return false;
            }
        }
        
        public async Task<bool> WatchTimeoutAlarmAsync(CancellationToken ct = default)
        {
            try
            {
                using var response = await _httpClient.PostAsync("/api/ClearAlarm/CheckTimeout", null, ct);
                var body = await response.Content.ReadAsStringAsync();

                if (!response.IsSuccessStatusCode)
                {
                    // 주기 루프이므로 Warn. EventLog 승격은 Worker의 LoopFailureTracker가 담당한다.
                    FileLogger.Instance.Warn(
                        $"WatchTimeoutAlarm failed: {(int)response.StatusCode} {response.StatusCode}, "
                        + $"body={Logging.LogText.Summarize(body)}");
                    return false;
                }

                return true;
            }
            catch (OperationCanceledException) when (ct.IsCancellationRequested)
            {
                FileLogger.Instance.Info("WatchTimeoutAlarm canceled.");
                return false;
            }
            catch (Exception ex)
            {
                FileLogger.Instance.Warn($"WatchTimeoutAlarmAsync error: {ex.Message}");
                return false;
            }
        }


        public async Task<bool> WatchUseAlarmAsync()
        {
            var newDic = CreateDefaultUseAlarmDictionary();
            var now = DateTime.UtcNow;

            try
            {
                string strConditions = $@"
                                          {nameof(Base.Model.Common.Option.Fields.prop_name)} in
                                            (
                                             '{AlarmEntity.UseAtmosphereType}',
                                             '{AlarmEntity.UseWaterType}',
                                             '{AlarmEntity.UseWaterDisasterType}'
                                            )
                                            ";
                string errorMessage = null;
                var result = await Task.Run(() => m_dataManager.GetSelect().Select<Base.Model.Common.Option>(strConditions, out errorMessage));
                _useAlarmLoadAttempted = true;

                if (result == null)
                {
                    _useAlarmDic = newDic;
                    _lastUseAlarmRefreshUtc = now;
                    _useAlarmReady = true;
                    FileLogger.Instance.Warn(
                        $"Failed to retrieve alarm options; using default-enabled fallback. {errorMessage}");
                    return false;
                }

                var rows = result as IList<Base.Model.Common.Option> ?? result.ToList();
                var foundNames = new HashSet<string>(StringComparer.OrdinalIgnoreCase);

                foreach (var row in rows)
                {
                    foundNames.Add(row.prop_name ?? string.Empty);
                    bool value = bool.TryParse(row.prop_value?.Trim(), out var parsed) && parsed;

                    switch (row.prop_name)
                    {
                        case AlarmEntity.UseAtmosphereType:
                            newDic[AlarmEntity.Atmosphere] = value;
                            break;
                        case AlarmEntity.UseWaterType:
                            newDic[AlarmEntity.Water] = value;
                            break;
                        case AlarmEntity.UseWaterDisasterType:
                            newDic[AlarmEntity.WaterDisaster] = value;
                            break;
                    }
                }

                _useAlarmDic = newDic;
                _lastUseAlarmRefreshUtc = now;
                _useAlarmReady = true;

                if (!foundNames.Contains(AlarmEntity.UseAtmosphereType))
                {
                    FileLogger.Instance.Warn(
                        $"{AlarmEntity.UseAtmosphereType} option row is missing; default-enabled fallback remains active.");
                }

                if (!foundNames.Contains(AlarmEntity.UseWaterType))
                {
                    FileLogger.Instance.Warn(
                        $"{AlarmEntity.UseWaterType} option row is missing; default-enabled fallback remains active.");
                }

                if (!foundNames.Contains(AlarmEntity.UseWaterDisasterType))
                {
                    FileLogger.Instance.Warn(
                        $"{AlarmEntity.UseWaterDisasterType} option row is missing; default-enabled fallback remains active.");
                }

                return true;
                
            }
            catch (Exception e)
            {
                _useAlarmLoadAttempted = true;
                _useAlarmDic = newDic;
                _lastUseAlarmRefreshUtc = now;
                _useAlarmReady = true;
                FileLogger.Instance.Warn($"Error in WatchUseAlarm; using default-enabled fallback. {e.Message}");
                return false;
            }
        }

        public async Task<bool> ProcessAlarmAsync(List<AlarmEntity.AlarmData> alarmDatas , CancellationToken ct = default)
        {
            if (alarmDatas.Count == 0)
                return true;

            await EnsureUseAlarmLoadedOnceAsync(ct);
            WarnIfAlarmOptionsStale();

            var snapshot = _useAlarmDic;
            var tasks = alarmDatas.Select(a =>
            {
                if (ShouldSkipAlarm(snapshot, a.SensorType, a.SensorZoneNo, logSkip: true))
                {
                    return Task.CompletedTask;
                }

                return SendAlarmAsync(snapshot, a.SensorZoneNo, a.SensorType, a.AlarmLevel, ct);
            });
            await Task.WhenAll(tasks);
            return true;
        }

        public async Task<IReadOnlyDictionary<int, bool>> GetUseAlarmSnapshotAsync(CancellationToken ct = default)
        {
            await EnsureUseAlarmLoadedOnceAsync(ct);
            WarnIfAlarmOptionsStale();
            return _useAlarmDic;
        }

        
        private async Task SendAlarmAsync(
            IReadOnlyDictionary<int, bool> snapshot,
            int sensorZoneNo,
            int sensorType,
            int alarmLevel,
            CancellationToken ct = default)
        {
            if (sensorZoneNo == 0 || sensorType == 0 || alarmLevel < 3)
                return;

            if (ShouldSkipAlarm(snapshot, sensorType, sensorZoneNo, logSkip: false))
            {
                return;
            }

            try
            {
                var json = CreateAlarmJson(sensorType, sensorZoneNo, 1, alarmLevel);
                using var content = new StringContent(json, System.Text.Encoding.UTF8, "application/json");

                using var response = await _httpClient.PostAsync("/api/Sensor/RequestSensorSignal", content, ct);
                var body = await response.Content.ReadAsStringAsync();

                if (!response.IsSuccessStatusCode)
                {
                    FileLogger.Instance.Error(
                        $"SendAlarm failed: {(int)response.StatusCode} {response.StatusCode}, body={body}");
                }
            }
            catch (OperationCanceledException) when (ct.IsCancellationRequested)
            {
                // 서비스 종료/중지 시 정상 취소
                FileLogger.Instance.Info("SendAlarm canceled by shutdown token.");
            }
            catch (OperationCanceledException ex)
            {
                // timeout 또는 내부 취소
                FileLogger.Instance.Error($"SendAlarm timeout/canceled: {ex.Message}");
            }
            catch (Exception ex)
            {
                FileLogger.Instance.Error($"SendAlarm error: {ex.Message}");
            }
        }
        
        private string CreateAlarmJson(int sensorType, int sensorZoneNo, int sensorData, int alarmLevel)
        {
            var json = new JObject()
            {
                ["header"] = 100,
                ["sensorType"] = sensorType,
                ["sensorZoneNo"] = sensorZoneNo,
                ["sensorData"] = sensorData,
                ["alarmDepth"] = alarmLevel
            };

            return json.ToString();
        }

        private async Task EnsureUseAlarmLoadedOnceAsync(CancellationToken ct)
        {
            if (_useAlarmLoadAttempted && _useAlarmReady)
                return;

            await _useAlarmLoadLock.WaitAsync(ct);
            try
            {
                if (_useAlarmLoadAttempted && _useAlarmReady)
                    return;

                await WatchUseAlarmAsync();
            }
            finally
            {
                _useAlarmLoadLock.Release();
            }
        }

        private static Dictionary<int, bool> CreateDefaultUseAlarmDictionary()
        {
            return new Dictionary<int, bool>
            {
                [AlarmEntity.Atmosphere] = true,
                [AlarmEntity.Water] = true,
                [AlarmEntity.WaterDisaster] = true
            };
        }

        private bool ShouldSkipAlarm(IReadOnlyDictionary<int, bool> snapshot, int sensorType, int sensorZoneNo, bool logSkip)
        {
            if (snapshot == null || snapshot.Count == 0)
                return false;

            if (!snapshot.TryGetValue(sensorType, out var enabled))
                return false;

            if (enabled)
                return false;

            if (logSkip)
            {
                FileLogger.Instance.Info(
                    $"Alarm disabled by option; skip send. type={sensorType}, zone={sensorZoneNo}");
            }

            return true;
        }

        private void WarnIfAlarmOptionsStale()
        {
            var now = DateTime.UtcNow;
            var lastRefresh = _lastUseAlarmRefreshUtc;

            bool optionsNeverLoaded = !_useAlarmLoadAttempted || !_useAlarmReady || lastRefresh == DateTime.MinValue;
            bool refreshStale = !optionsNeverLoaded && now - lastRefresh > UseAlarmRefreshWarningThreshold;

            if (!(optionsNeverLoaded || refreshStale))
            {
                return;
            }

            if (now - _lastUseAlarmWarnUtc < UseAlarmWarnThrottle)
            {
                return;
            }

            string reason = optionsNeverLoaded
                ? "UseAlarm dictionary has not completed an initial load; alarms rely on default enabled state."
                : $"UseAlarm dictionary has been stale for {(now - lastRefresh).TotalMinutes:F1} minutes.";

            FileLogger.Instance.Warn(reason);
            _lastUseAlarmWarnUtc = now;
        }
    }
}
