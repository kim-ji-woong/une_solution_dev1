using System;
using System.Collections.Generic;
using System.Collections.Concurrent;
using System.Diagnostics;
using System.Globalization;
using System.Linq;
using System.Text;
using System.Threading;
using System.Threading.Tasks;
using Base.Model.Sensor;
using dnsDapperDBUtil.DataAccessLayer.DAL;
using dnsDapperDBUtil.DataAccessLayer.IDAL;
using dnsDapperDBUtil.Manager;
using Gwangyang.Model;
using GwangyangSensorService.Logging;
using GwangyangSensorService.Models;

namespace GwangyangSensorService.Managers
{
    public class SensorManager
    {
        private readonly DataManager _dataManager;
        private readonly AlarmManager _alarmManager;

        public SensorManager(DataManager dataManager, AlarmManager alarmManager)
        {
            _dataManager = dataManager;
            _alarmManager = alarmManager;
        }

        public void Initialize()
        {
            LoadCache();
        }

        /// <returns>모든 캐시를 정상 적재했으면 true. 하나라도 실패하면 false.</returns>
        public bool ReloadCache()
        {
            return LoadCache();
        }

        public IReadOnlyDictionary<int, SensorZone> SensorZones { get; private set; } =
            new Dictionary<int, SensorZone>();
        public IReadOnlyDictionary<int, SensorLink> SensorLinks { get; private set; } =
            new Dictionary<int, SensorLink>();
        public IReadOnlyDictionary<int, MaterialLink> MaterialLinks { get; private set; } =
            new Dictionary<int, MaterialLink>();
        public IReadOnlyDictionary<string, SubType> SensorSubTypes { get; private set; } =
            new Dictionary<string, SubType>();

        public IReadOnlyDictionary<int, SensorType> SensorTypes { get; private set; } =
            new Dictionary<int, SensorType>();

        private readonly ConcurrentDictionary<int, SensorSnapshot> _fiveMinuteSnapshots = new ConcurrentDictionary<int, SensorSnapshot>();
        private readonly ConcurrentDictionary<int, DateTime> _fiveMinuteLastPersistedBucket = new ConcurrentDictionary<int, DateTime>();
        private static readonly TimeSpan SnapshotValidity = TimeSpan.FromMinutes(10);
        private static readonly TimeSpan FiveMinuteInterval = TimeSpan.FromMinutes(5);

        private const int NormalThresholdReverse = 300205;
        private const int WeatherSensorTypeCode = 300321;
        private static readonly HashSet<int> FiveMinuteTargetSensorTypes = new HashSet<int>
        {
            WeatherSensorTypeCode
        };

        /// <returns>모든 캐시를 정상 적재했으면 true. 하나라도 실패하면 false.</returns>
        private bool LoadCache()
        {
            var select = _dataManager.GetSelect();
            bool loaded = true;

            string errorMessage;
            var sensorZones = new Dictionary<int, SensorZone>();
            var sensorZoneRows = select.Select<SensorZone>(null, out errorMessage);
            if (!string.IsNullOrWhiteSpace(errorMessage))
            {
                loaded = false;
                FileLogger.Instance.Error($"SensorZone cache load failed: {errorMessage}");
            }
            else
            {
                foreach (var row in sensorZoneRows)
                    sensorZones[row.sensor_zone_sn] = row;
                SensorZones = sensorZones;
            }

            var sensorLinks = new Dictionary<int, SensorLink>();
            var sensorLinkRows = select.Select<SensorLink>(null, out errorMessage);
            if (!string.IsNullOrWhiteSpace(errorMessage))
            {
                loaded = false;
                FileLogger.Instance.Error($"SensorLink cache load failed: {errorMessage}");
            }
            else
            {
                foreach (var row in sensorLinkRows)
                    sensorLinks[row.node_id] = row;
                SensorLinks = sensorLinks;
            }

            var materialLinks = new Dictionary<int, MaterialLink>();
            var materialLinkRows = select.Select<MaterialLink>(null, out errorMessage);
            if (!string.IsNullOrWhiteSpace(errorMessage))
            {
                loaded = false;
                FileLogger.Instance.Error($"MaterialLink cache load failed: {errorMessage}");
            }
            else
            {
                foreach (var row in materialLinkRows)
                    materialLinks[row.sensor_unique_id] = row;
                MaterialLinks = materialLinks;
            }

            var sensorSubTypes = new Dictionary<string, SubType>();
            var sensorSubTypeRows = select.Select<SubType>(null, out errorMessage);
            if (!string.IsNullOrWhiteSpace(errorMessage))
            {
                loaded = false;
                FileLogger.Instance.Error($"SensorSubType cache load failed: {errorMessage}");
            }
            else
            {
                foreach (var row in sensorSubTypeRows)
                {
                    if (string.IsNullOrWhiteSpace(row.descp))
                    {
                        FileLogger.Instance.Warn(
                            $"Skip SensorSubType cache row because descp is empty. sensor_ty_code={row.sensor_ty_code}, sensor_ty_optn_code={row.sensor_ty_optn_code}, sensor_sub_ty_no={row.sensor_sub_ty_no}");
                        continue;
                    }

                    var parts = row.descp.Split('_');
                    if (parts.Length < 3)
                    {
                        FileLogger.Instance.Warn(
                            $"Skip SensorSubType cache row because descp format is invalid. descp={row.descp}, sensor_ty_code={row.sensor_ty_code}, sensor_ty_optn_code={row.sensor_ty_optn_code}, sensor_sub_ty_no={row.sensor_sub_ty_no}");
                        continue;
                    }

                    if (string.IsNullOrWhiteSpace(parts[1]) || string.IsNullOrWhiteSpace(parts[2]))
                    {
                        FileLogger.Instance.Warn(
                            $"Skip SensorSubType cache row because descp key parts are empty. descp={row.descp}, sensor_ty_code={row.sensor_ty_code}, sensor_ty_optn_code={row.sensor_ty_optn_code}, sensor_sub_ty_no={row.sensor_sub_ty_no}");
                        continue;
                    }

                    sensorSubTypes[$@"{parts[1]}_{parts[2]}"] = row;
                }
                SensorSubTypes = sensorSubTypes;
            }

            var sensorTypes = new Dictionary<int, SensorType>();
            var sensorTypeRows = select.Select<SensorType>(null, out errorMessage);
            if (!string.IsNullOrWhiteSpace(errorMessage))
            {
                loaded = false;
                FileLogger.Instance.Error($"SensorType cache load failed: {errorMessage}");
            }
            else
            {
                foreach (var row in sensorTypeRows)
                    sensorTypes[row.sensor_type_idx] = row;
                SensorTypes = sensorTypes;
            }

            return loaded;
        }

        public async Task HandleReportLastAsync(ReportLastResponse response, CancellationToken ct = default)
        {
            Stopwatch sw = Stopwatch.StartNew();
            
            if (response.Data == null || response.Data.Count < 1)
            {
                FileLogger.Instance.Warn("No data from YJ API Data Count is less than 1.");
                return;
            }
            
            string strErrorMessage = string.Empty;
            
            Dictionary<string, double> keyValues = new Dictionary<string, double>();
            
            List<AlarmEntity.AlarmData> alarmDatas = new List<AlarmEntity.AlarmData>();
            
            foreach (var item in response.Data)
            {
                if (item.sensor_id == null || item.Value == null)
                {
                    FileLogger.Instance.Warn(
                        $"Invalid report/last item because sensor_id or value is null. id={item.Id}, category={item.CategoryValue}");
                    continue;
                }

                if (item.sensor_id.Count != item.Value.Count)
                {
                    FileLogger.Instance.Warn(
                        $"Invalid report/last item length mismatch. id={item.Id}, category={item.CategoryValue}, sensorIdCount={item.sensor_id.Count}, valueCount={item.Value.Count}");
                    continue;
                }

                string sensorCategory = item.CategoryValue;
                int idx = 0;
                foreach (var element in item.sensor_id)
                {
                    double sensorValue = item.Value[idx];
                    if (double.IsNaN(sensorValue) || double.IsInfinity(sensorValue))
                    {
                        FileLogger.Instance.Warn(
                            $"Skip non-finite sensor value. id={item.Id}, category={item.CategoryValue}, sensorId={element}, value={sensorValue}");
                        idx++;
                        continue;
                    }

                    keyValues[$@"{sensorCategory}_{item.Id}_{element.ToString()}"] = sensorValue;
                    idx++;
                }
            }
            
            StringBuilder updateSb = new StringBuilder();

            var alarmSnapshot = _alarmManager.GetAlarmSnapshot();
            var alarmedZoneSet = new HashSet<int>(alarmSnapshot.Select(a => a.sensor_zone_sn));
            var useAlarmSnapshot = await _alarmManager.GetUseAlarmSnapshotAsync(ct);

            int matchedCount = 0;
            int unmatchedValueCount = 0;
            int badUnqKeyCount = 0;
            int typeResolveFailCount = 0;
            int invalidMaterialIdCount = 0;
            int materialCacheMissCount = 0;
            int missingThresholdCount = 0;
            var unmatchedZoneSamples = new List<int>();
            var missingThresholdSamples = new List<int>();

            foreach (var sensorZone in SensorZones)
            {
                string[] arrUnqKey = sensorZone.Value.unq_key.Split('_');
                if (arrUnqKey.Length < 4)
                {
                    badUnqKeyCount++;
                    continue;
                }

                string compareKey = $@"{arrUnqKey[1]}_{sensorZone.Value.eqp_zone_sn.ToString()}_{arrUnqKey[3]}";

                if (!keyValues.TryGetValue(compareKey, out double value))
                {
                    unmatchedValueCount++;
                    if (unmatchedZoneSamples.Count < 5)
                        unmatchedZoneSamples.Add(sensorZone.Value.sensor_zone_sn);
                    continue;
                }

                if (!TryResolveSensorType(sensorZone.Value, arrUnqKey, out var resolvedSensorType))
                {
                    typeResolveFailCount++;
                    continue;
                }

                matchedCount++;
                int sensorTypeCode = resolvedSensorType.co_code;
                TrackFiveMinuteSnapshot(sensorZone.Value, sensorTypeCode, value);

                updateSb
                    .Append("UPDATE ")
                    .Append(Material.TableName)
                    .Append(" SET ")
                    .Append(nameof(Material.Fields.cur_data))
                    .Append(" = ")
                    .Append(value.ToString(CultureInfo.InvariantCulture))
                    .Append(" WHERE ")
                    .Append(nameof(Material.Fields.sensor_zone_sn))
                    .Append(" = ")
                    .Append(sensorZone.Value.sensor_zone_sn)
                    .Append(";");

                if (!int.TryParse(arrUnqKey[3], out int materialUnqId))
                {
                    invalidMaterialIdCount++;
                }
                else if (!MaterialLinks.TryGetValue(materialUnqId, out MaterialLink? materialLink))
                {
                    materialCacheMissCount++;
                }
                else
                {
                    if (!resolvedSensorType.alarm_yn)
                        continue;
                    
                    int alarmLevel = GetAlarmLevel(sensorZone.Value, materialLink, value, out bool thresholdMissing);
                    if (thresholdMissing)
                    {
                        missingThresholdCount++;
                        if (missingThresholdSamples.Count < 5)
                            missingThresholdSamples.Add(sensorZone.Value.sensor_zone_sn);
                    }

                    if (alarmLevel > 2)
                    {
                        if (ShouldSkipAlarmByOptions(useAlarmSnapshot, sensorTypeCode, sensorZone.Value.sensor_zone_sn))
                            continue;

                        if (!alarmedZoneSet.Contains(sensorZone.Value.sensor_zone_sn))
                            alarmDatas.Add(new AlarmEntity.AlarmData(sensorZone.Value.sensor_zone_sn, sensorTypeCode, 1, alarmLevel));
                    }
                }
            }

            string reportSummary = $"report/last summary. zones={SensorZones.Count}, matched={matchedCount}, unmatchedValue={unmatchedValueCount}, badUnqKey={badUnqKeyCount}, typeResolveFail={typeResolveFailCount}, invalidMaterialId={invalidMaterialIdCount}, materialCacheMiss={materialCacheMissCount}, missingThreshold={missingThresholdCount}, unmatchedSamples=[{string.Join(",", unmatchedZoneSamples)}], missingThresholdSamples=[{string.Join(",", missingThresholdSamples)}]";
            // missingThreshold는 레벨 판정에 넣지 않는다. 나머지는 수집/매칭이 깨진 것이지만
            // 임계값 누락은 수집이 정상인 상태의 설정 공백이다. 게이트에 넣으면 존 1개만 비어 있어도
            // 요약이 영구히 Warn으로 고정되어 레벨이 신호 구실을 못 한다.
            if (unmatchedValueCount > 0 || badUnqKeyCount > 0 || typeResolveFailCount > 0 || invalidMaterialIdCount > 0 || materialCacheMissCount > 0)
                FileLogger.Instance.Warn(reportSummary);
            else
                FileLogger.Instance.Info(reportSummary);

            var dbSuccess = await Task.Run(() =>
            {
                IDataManager clone = _dataManager.Clone();

                try
                {
                    if (updateSb.Length > 0 && clone.BeginBatch(out strErrorMessage) == false)
                    {
                        FileLogger.Instance.Error($"BeginBatch failed: {strErrorMessage}");
                        clone.BatchRollback(out strErrorMessage);
                        return false;
                    }

                    if (clone.GetDBManager().Excute(updateSb.ToString(), out strErrorMessage) == false)
                    {
                        FileLogger.Instance.Error($"Excute failed: {strErrorMessage}");
                        if (clone.BatchRollback(out strErrorMessage) == false)
                        {
                            FileLogger.Instance.Error($"BatchRollback failed: {strErrorMessage}");
                        }
                        return false;
                    }

                    if (clone.BatchCommit(out strErrorMessage) == false)
                    {
                        FileLogger.Instance.Error($"BatchCommit failed: {strErrorMessage}");
                        if (clone.BatchRollback(out strErrorMessage) == false)
                        {
                            FileLogger.Instance.Error($"BatchRollback failed: {strErrorMessage}");
                        }
                        return false;
                    }
                }
                catch(Exception e)
                {
                    FileLogger.Instance.Error($"Unexpected error Exception: {e.Message}");
                    clone.BatchRollback(out strErrorMessage);
                    return false;
                }

                return true;
            });

            if (!dbSuccess)
                return;
            
            // 수치 업데이트가 정상적으로 완료되면 알람 처리
            if (!await _alarmManager.ProcessAlarmAsync(alarmDatas, ct))
            {
                FileLogger.Instance.Error("Alarm process failed.");
                return;
            }
        }


        /// <returns>적재한 행 수. 대상이 없으면 0, DB 적재에 실패하면 -1.</returns>
        public async Task<int> FlushFiveMinuteHistoryAsync(CancellationToken ct = default)
        {
            var targetBucket = TruncateToFiveMinuteBucket(GetCurrentKstNow());
            var snapshots = _fiveMinuteSnapshots.ToArray();
            if (snapshots.Length == 0)
                return 0;

            string bucketText = targetBucket.ToString("yyyy-MM-dd HH:mm:ss", CultureInfo.InvariantCulture);
            int skippedByType = 0;
            int skippedByStale = 0;
            int skippedByAlreadyPersisted = 0;

            List<SensorSnapshot> pending = new List<SensorSnapshot>(snapshots.Length);
            foreach (var entry in snapshots)
            {
                var snapshot = entry.Value;
                if (!IsTargetFiveMinuteSensorType(snapshot.SensorTypeCode))
                {
                    skippedByType++;
                    continue;
                }

                if (targetBucket - snapshot.CapturedAt > SnapshotValidity)
                {
                    skippedByStale++;
                    continue;
                }

                if (_fiveMinuteLastPersistedBucket.TryGetValue(snapshot.SensorSn, out var lastBucket) &&
                    lastBucket >= targetBucket)
                {
                    skippedByAlreadyPersisted++;
                    continue;
                }

                pending.Add(snapshot);
            }

            FileLogger.Instance.Info($"Five-minute snapshot scan bucket={bucketText}, total={snapshots.Length}, pending={pending.Count}, stale={skippedByStale}, alreadyPersisted={skippedByAlreadyPersisted}, invalidType={skippedByType}");

            if (pending.Count == 0)
                return 0;

            var sb = new StringBuilder();

            foreach (var snapshot in pending)
            {
                var valueText = snapshot.Value.ToString(CultureInfo.InvariantCulture);
                sb.Append("INSERT INTO ex_sensor_his (sensor_sn, sensor_value, sensor_value_num, his_timestamp, temp_idx) VALUES (")
                  .Append(snapshot.SensorSn).Append(", '")
                  .Append(valueText).Append("', ")
                  .Append(valueText).Append(", '")
                  .Append(bucketText).Append("', ")
                  .Append(snapshot.SensorZoneSn).Append(");");
            }

            bool success = await Task.Run(() =>
            {
                IDataManager clone = _dataManager.Clone();
                string errorMessage = string.Empty;
                if (sb.Length == 0)
                    return true;

                if (clone.GetDBManager().Excute(sb.ToString(), out errorMessage))
                    return true;

                FileLogger.Instance.Error($"Failed to insert sensor history rows: {errorMessage}");
                return false;
            }, ct);

            // 실패(-1)와 "적재할 대상 없음"(0)을 호출부가 구분할 수 있어야 한다.
            if (!success)
                return -1;

            foreach (var snapshot in pending)
                _fiveMinuteLastPersistedBucket[snapshot.SensorSn] = targetBucket;

            var sampleSensorIds = string.Join(",", pending.Select(p => p.SensorSn).Distinct().Take(3));
            FileLogger.Instance.Info($"Five-minute history persisted bucket={bucketText}, rows={pending.Count}, sampleSensors=[{sampleSensorIds}], temp_idx=sensor_zone_sn");

            return pending.Count;
        }


        private static DateTime GetCurrentKstNow()
        {
            var kst = TimeZoneInfo.FindSystemTimeZoneById("Korea Standard Time");
            return TimeZoneInfo.ConvertTime(DateTimeOffset.UtcNow, kst).DateTime;
        }

        private static DateTime TruncateToFiveMinuteBucket(DateTime dateTime)
        {
            int intervalMinutes = (int)FiveMinuteInterval.TotalMinutes;
            int minuteBucket = (dateTime.Minute / intervalMinutes) * intervalMinutes;
            return new DateTime(dateTime.Year, dateTime.Month, dateTime.Day, dateTime.Hour, minuteBucket, 0, dateTime.Kind);
        }

        private bool IsTargetFiveMinuteSensorType(int sensorTypeCode)
        {
            return FiveMinuteTargetSensorTypes.Contains(sensorTypeCode);
        }

        private void TrackFiveMinuteSnapshot(SensorZone sensorZone, int sensorTypeCode, double value)
        {
            if (!IsTargetFiveMinuteSensorType(sensorTypeCode))
                return;

            var snapshot = new SensorSnapshot
            {
                SensorSn = sensorZone.sensor_sn,
                SensorZoneSn = sensorZone.sensor_zone_sn,
                SensorTypeCode = sensorTypeCode,
                Value = value,
                CapturedAt = GetCurrentKstNow()
            };

            _fiveMinuteSnapshots[sensorZone.sensor_sn] = snapshot;
        }

        private bool ShouldSkipAlarmByOptions(IReadOnlyDictionary<int, bool> snapshot, int sensorTypeCode, int sensorZoneNo)
        {
            if (snapshot == null || snapshot.Count == 0)
                return false;

            if (!snapshot.TryGetValue(sensorTypeCode, out var enabled))
            {
                // 옵션 누락은 센서 타입 단위 설정 문제이므로 zone은 메시지에 넣지 않는다.
                // 그래야 FileLogger의 중복 억제가 타입 단위로 묶어 재발 횟수까지 집계한다.
                FileLogger.Instance.Warn($"UseAlarm option missing; defaulting to enabled. type={sensorTypeCode}");
                return false;
            }

            if (enabled)
                return false;

            FileLogger.Instance.Info($"Alarm disabled by option; skip enqueue. type={sensorTypeCode}, zone={sensorZoneNo}");
            return true;
        }

        private bool TryResolveSensorType(SensorZone sensorZone, string[] unqKeyParts, out SensorType sensorType)
        {
            sensorType = default!;

            if (unqKeyParts.Length <= 1)
            {
                FileLogger.Instance.Warn(
                    $"Invalid sensor type index format. sensor_zone_sn={sensorZone.sensor_zone_sn}, unq_key={sensorZone.unq_key}");
                return false;
            }

            if (!int.TryParse(unqKeyParts[1], out int sensorTypeIdx))
            {
                FileLogger.Instance.Warn(
                    $"Sensor type index parse failed. sensor_zone_sn={sensorZone.sensor_zone_sn}, raw={unqKeyParts[1]}");
                return false;
            }

            if (!SensorTypes.TryGetValue(sensorTypeIdx, out var resolvedType))
            {
                FileLogger.Instance.Warn(
                    $"Sensor type index not found in cache. sensor_zone_sn={sensorZone.sensor_zone_sn}, sensor_type_idx={sensorTypeIdx}");
                return false;
            }

            sensorType = resolvedType;
            return true;
        }

        private sealed class SensorSnapshot
        {
            public int SensorSn { get; set; }
            public int SensorZoneSn { get; set; }
            public int SensorTypeCode { get; set; }
            public double Value { get; set; }
            public DateTime CapturedAt { get; set; }
        }

        /// <param name="thresholdMissing">
        /// 임계값(limit_notice/attention/warning)이 비어 알람 판정을 건너뛴 경우 true.
        /// 존마다 발생하므로 여기서 직접 기록하지 않고 호출부의 `report/last summary`에 집계한다.
        /// </param>
        private int GetAlarmLevel(SensorZone sensorZone, MaterialLink target, double value, out bool thresholdMissing)
        {
            thresholdMissing = false;

            if (target.limit_type == dnsData.CommonCode.SdmsSensor.SensorLimitType.Normal)
            {
                if (!target.limit_notice.HasValue || !target.limit_attention.HasValue || !target.limit_warning.HasValue)
                {
                    thresholdMissing = true;
                    return 1;
                }

                int alarmLevel = 1;
                
                if (target.limit_notice.Value < value)
                    alarmLevel++;
                
                if (target.limit_attention.Value < value)
                    alarmLevel++;
                
                if (target.limit_warning.Value < value)
                    alarmLevel++;
                
                return alarmLevel;
            }
            else if (target.limit_type == NormalThresholdReverse)
            {
                if (!target.limit_notice.HasValue || !target.limit_attention.HasValue || !target.limit_warning.HasValue)
                {
                    thresholdMissing = true;
                    return 1;
                }

                int alarmLevel = 1;

                if (value < target.limit_notice.Value)
                    alarmLevel++;
                if (value < target.limit_attention.Value)
                    alarmLevel++;
                if (value < target.limit_warning.Value)
                    alarmLevel++;
                
                return alarmLevel;
            }
            
            return 1;
        }


        public void HandleNodeCategoryList(NodeCategoryResponse response)
        {
            
        }

        public void HandleSensorList(SensorListResponse response)
        {
            
        }
    }
}
