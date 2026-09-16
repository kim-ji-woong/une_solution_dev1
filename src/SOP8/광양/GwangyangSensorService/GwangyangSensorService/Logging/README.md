# FileLogger 로그 기록 방식

## 개요
- `FileLogger`는 비동기 큐(`BlockingCollection`)를 사용해 로그를 적재하고, 전용 `WriterLoop`가 파일에 기록한다.
- 현재 구조는 `채널별 폴더 분기 + 활성 txt 파일 분할 + 월별 zip archive`를 지원한다.
- 로그는 기본적으로 서비스 시작/종료, 알람, 알람 옵션, 타임아웃 알람, `report/last`, 기상, 5분 적재 루프 단위로 분리된다.
- 오류 로그는 파일 기록 전 `eventLogSink`로 Windows Event Log 같은 외부 sink에도 전달할 수 있다.

## 설정 값
`LogOptions`와 `appsettings.json`의 `Log` 섹션에서 아래 값을 사용한다.

- `LogFolder`
  - 루트 로그 폴더
- `LogLifeTime`
  - 오래된 txt 로그를 정리할 때 사용하는 보관 일수
- `LogFileTag`
  - 파일명 접두어
- `UseChannelFolders`
  - `true`면 `LogFolder\channel\...` 구조 사용
- `ArchiveAfterDays`
  - 닫힌 월의 txt 로그를 zip archive 후보로 보기 시작하는 기준 일수
- `DeleteArchiveAfterDays`
  - 오래된 zip archive 삭제 기준 일수
- `MaxArchiveSizeGB`
  - archive 전체 용량 상한
- `MaxActiveFileSizeMB`
  - 활성 txt 파일 최대 크기. 초과 시 같은 날짜 내 새 파일로 분할
- `DuplicateSuppressionMinutes`
  - 글자 단위로 동일한 로그의 반복을 억제하는 창 길이(분). 0 이하면 억제하지 않는다
- `DuplicateSuppressionMaxKeys`
  - 억제 대상으로 추적할 서로 다른 메시지 개수 상한

## 루프 실패 추적 (`LoopFailureTracker`)

동일한 실패가 반복될 때 같은 로그가 수만 줄 쌓이는 것을 막고, 장애의 **시작 / 지속 / 복구** 를 상태 전이로 남긴다.

### 배경
2026-07 `report/last` 장애에서 4일 21시간 동안 동일한 Warn 13,933건(HTML 본문 포함 약 12만 행)이 쌓였고,
`Error`가 한 건도 발생하지 않아 Windows Event Log에는 아무것도 남지 않았다.
결과적으로 장애를 며칠간 아무도 인지하지 못했다.

### 기록 규칙

| 상황 | 레벨 | 예시 |
|---|---|---|
| 승격 전 실패 | `Warn` | `report/last failed (1/3). reason=HTTP 503: ...` |
| 승격 시점 | `Error` | `report/last FAILURE STARTED. consecutive=3, since=2026-07-16 13:29:31, reason=...` |
| 장애 지속 중 | `Warn` | `report/last still failing. consecutive=141, since=..., elapsed=2h00m, reason=...` |
| 복구 | `Info` | `report/last recovered. failures=8258, downtime=4d20h58m, since=...` |
| 느린 응답 | `Warn` | `report/last slow response. elapsed=21019ms, threshold=5000ms` |

- **승격 시 발생하는 `Error`가 `eventLogSink`를 타므로**, 이 시점이 외부 감시 도구의 진입점이 된다.
- 지속 중에는 `FailureRepeatIntervalMinutes` 주기로만 요약 1줄을 남긴다.
- 느린 응답 경고도 같은 주기로 throttle되어 매 사이클 기록되지 않는다.
- 실패 사유는 `LogText.Summarize()`로 1행 300자 이내로 접힌다. HTML 오류 페이지가 그대로 실리지 않는다.

### 설정 (`appsettings.json` → `Monitoring`)

```json
"Monitoring": {
  "EscalateAfterConsecutiveFailures": 3,
  "FailureRepeatIntervalMinutes": 60,
  "SlowResponseWarningMs": 5000
}
```

| 키 | 기본값 | 설명 |
|---|---|---|
| `EscalateAfterConsecutiveFailures` | 3 | 연속 실패가 이 횟수에 도달하면 `Error`로 승격 |
| `FailureRepeatIntervalMinutes` | 60 | 장애 지속 중 요약 로그 주기(분) |
| `SlowResponseWarningMs` | 5000 | 응답이 이 시간을 넘으면 느린 응답으로 기록. 0 이하면 비활성 |

> 섹션이 없으면 위 기본값이 그대로 적용된다. 기존 배포본의 `appsettings.json`을 수정하지 않아도 동작한다.

### 루프별 적용 상태

승격 임계치는 **횟수**이므로 루프 주기에 따라 실제 경과 시간이 달라진다.
고빈도 루프는 순간적인 지연으로 Event Log가 오염되지 않도록 임계치를 개별 지정한다.

| 루프 | 채널 | 주기 | 승격 임계치 | 승격까지 | 실패 판정 근거 |
|---|---|---|---|---|---|
| `RunReportLastLoop` | `report-last` | 30초 | 설정값(3) | 약 90초 | `ApiResult.Success` (소요 시간 기록) |
| `RunUltraSrtFcstLoop` | `weather` | 10분 | 설정값(3) | 약 30분 | `ApiResult.Success` (소요 시간 기록) |
| `RunWatchAlarmLoop` | `alarm` | 1.5초 | **40** | 약 60초 | `WatchAlarmAsync` 반환값 |
| `RunWatchAlarmOptions` | `alarm-options` | 2초 | **30** | 약 60초 | `WatchUseAlarmAsync` 반환값 |
| `RunWatchTimeoutAlarmLoop` | `timeout-alarm` | 1분 | 설정값(3) | 약 3분 | `WatchTimeoutAlarmAsync` 반환값 |
| `RunFiveMinuteIngestLoop` | `five-minute` | 5분 | **1** | 즉시 | `FlushFiveMinuteHistoryAsync` 반환값이 **음수**면 실패 |
| `RunReloadCacheLoop` | `reload-cache` | 5분 | **1** | 즉시 | `ReloadSensorCache()` 반환값이 **false**면 실패 |

> `FlushFiveMinuteHistoryAsync`는 적재 대상이 없을 때 `0`, DB 적재에 실패하면 `-1`을 반환한다.
> `SensorManager.LoadCache()`는 캐시 중 하나라도 적재에 실패하면 `false`를 반환한다.
> 두 메서드 모두 실패를 예외로 던지지 않으므로, 반환값을 확인하지 않으면 실패가 성공으로 집계된다.

`report-last` / `weather` 루프의 `catch (Exception)` 경로는 API 가용성과 성격이 다르므로
기존대로 `Error`를 즉시 남긴다(추적기를 거치지 않음).

### Manager 내부 로그 레벨 조정

주기 루프 안에서 매 사이클 호출되는 실패 로그는 `Warn`으로 남긴다.
Event Log로 올라가는 `Error`는 추적기가 연속 실패를 집계해 **1회만** 발생시키는 것이 목적이기 때문이다.

| 위치 | 변경 | 이유 |
|---|---|---|
| `AlarmManager.WatchAlarmAsync` (2곳) | `Error` → `Warn` | 1.5초 주기. DB 장애 시 하루 약 57,600건이 Event Log로 유입됨 |
| `AlarmManager.WatchTimeoutAlarmAsync` (2곳) | `Error` → `Warn` | 1분 주기. 응답 본문도 `LogText.Summarize()`로 축약 |

상세 오류 메시지는 채널 파일에 그대로 남으므로 원인 추적에는 영향이 없다.

## 동일 메시지 반복 억제 (`LogDeduplicator`)

`LoopFailureTracker`는 **루프 실패**만 집계한다. 그 밖의 로그는 호출부가 직접 억제하거나 아예 억제하지 않았고,
그래서 15일치 32.5MB 중 대부분이 글자 단위로 동일한 중복이었다.

| 메시지 | 15일 누적 |
|---|---:|
| `Invalid report/last item length mismatch` (9종) | 160,209건 |
| `report/last summary. zones=321, matched=177, ...` | 15,913건 |

`FileLogger`가 큐에 넣기 전에 직접 판정하도록 내려서, **호출부 수정 없이 모든 로그에 적용된다.**

### 기록 규칙

| 상황 | 동작 |
|---|---|
| 첫 발생 | 그대로 기록 |
| 창(window) 이내 재발 | 기록하지 않고 횟수만 누적 |
| 창이 지난 뒤 재발 | `(repeated N times in last 1h00m)` 접두어와 함께 기록하고 창을 다시 시작 |
| 반복이 멈춤 | 드레인 타이머가 마지막 집계분을 `(repeated N times in last ..., last at HH:mm:ss)`로 내보냄 |
| 서비스 종료 | `Dispose()`가 남은 집계분을 모두 내보냄 |

```
[10:00:00.123] [Warn] [C:report-last] Invalid report/last item length mismatch. id=102, ...
[11:00:31.004] [Warn] [C:report-last] (repeated 6,213 times in last 1h00m) Invalid report/last item length mismatch. id=102, ...
[12:01:02.771] [Warn] [C:report-last] (repeated 2 times in last 1h00m, last at 11:00:31) Invalid report/last item length mismatch. id=102, ...
```

### 판정 키

`레벨 + 채널 + 예외 타입 + 메시지 전문`이다. 해시가 아니라 전문 비교이므로 오탐이 없다.

- **메시지의 숫자가 하나라도 바뀌면 다른 키**가 되어 즉시 기록된다.
  `report/last summary`의 `matched=177` → `matched=159` 같은 상태 변화는 억제되지 않는다.
  정상 상태에서 값이 고정일 때만 접히므로, 억제 자체가 "변화 없음"의 신호가 된다.
- `LoopFailureTracker`의 로그는 `since=` / `consecutive=` / `elapsed=` 를 담고 있어 사실상 매번 키가 다르다.
  **`FAILURE STARTED`의 Event Log 승격 동작은 영향을 받지 않는다.**
- 예외를 함께 넘긴 로그는 첫 발생 기록에만 `Exception.ToString()`이 남는다. 이후 요약 줄에는 횟수만 남는다.

### 마지막 성공 시각은 유지된다

`report/last summary`는 30초마다 남는 줄이라 2026-07 장애 분석에서 **"마지막 정상 응답" 시각 앵커**로 쓰였다.
억제된다고 해서 이 기능이 사라지지 않는다.

- 도배가 멈추면(= API가 죽으면) 드레인 요약의 `last at HH:mm:ss`가 **초 단위로 마지막 성공 사이클 시각**이다.
- 장애 시작 시각은 `LoopFailureTracker`의 `FAILURE STARTED. since=`가 독립적으로 남긴다.

즉, 예전에는 2주치 32.5MB를 파싱해야 얻던 두 값을 이제 각각 1줄에서 바로 읽는다.

### Event Log 도달 경로

억제는 `eventLogSink` 호출보다 **앞에서** 판정한다. 동일한 `Error`가 30초마다 반복되면
Event Log에도 창당 1건만 올라가고, 창이 지날 때마다 횟수를 담은 1건이 다시 올라간다.
장애가 지속되는 동안 시간당 1건의 heartbeat가 남는 셈이라 감시 도구 입장에서는 오히려 다루기 쉽다.

이 규칙에 따라 **주기 루프 안에서 매번 같은 문구로 실패하는 `Error`는 시간당 1건으로 접힌다.**
예: `AlarmManager`/`SensorManager`의 `BeginBatch failed: {오류}`.

### 키 상한

메시지에 시각처럼 매번 달라지는 값이 박혀 있으면 키가 무한히 늘어난다.
`DuplicateSuppressionMaxKeys`에 도달하면 **신규 메시지는 억제하지 않고 그대로 기록**하고,
포기한 건수를 창마다 1줄로 드러낸다. 조용히 잘라내지 않는다.

```
[Warn] [C:service] FileLogger duplicate suppression capacity reached. keys=2000, unsuppressed=25
```

창의 2배 동안 재발이 없는 키는 드레인 시점에 제거되므로, 실제 운영에서는 상한에 닿기 어렵다.

### 억제되지 않는 유형 — 개체별 도배

중복 억제는 **글자 단위로 동일한** 도배만 접는다.
메시지에 개체 식별자가 박혀 매번 달라지는 도배는 키가 갈라지므로 접히지 않는다.

| 예 | 성격 | 처리 |
|---|---|---|
| `report/last summary. …, unmatchedSamples=[…]` | 이미 집계형 | 현행 유지 |
| 임계값 누락 경고 (존별) | zone마다 다른 키 | **집계로 전환** — 요약의 `missingThreshold=` |
| `Alarm disabled by option; skip enqueue. type=…, zone=…` | zone마다 다른 키 | 미처리 — 빈도가 낮아 현행 유지 |

`SensorManager`의 `report/last summary`처럼 **호출부에서 세어 1줄로 만드는 방식**이 이 유형의 해법이다.
중복 억제로 대체되지 않으므로 두 방식은 함께 쓴다.

> 판단 기준은 **키가 무엇 단위로 갈라지는가**다.
> 타입처럼 종류가 적으면 메시지에서 개체 식별자를 빼 ④에 맡기고,
> 존처럼 수백 개면 ④가 무력하므로 집계로 접어야 한다.

### 설정 (`appsettings.json` → `Log`)

```json
"Log": {
  "DuplicateSuppressionMinutes": 60,
  "DuplicateSuppressionMaxKeys": 2000
}
```

| 키 | 기본값 | 설명 |
|---|---|---|
| `DuplicateSuppressionMinutes` | 60 | 억제 창(분). 0 이하면 억제 비활성 |
| `DuplicateSuppressionMaxKeys` | 2000 | 추적할 서로 다른 메시지 개수 상한 |

> 섹션에 키가 없으면 위 기본값이 그대로 적용된다. 기존 배포본의 `appsettings.json`을 수정하지 않아도 동작한다.
> 창 기본값 60분은 `Monitoring:FailureRepeatIntervalMinutes`와 같은 근거(장애 지속 중 요약 주기)를 따른다.

### 구조

- 판정은 `Enqueue`(호출 스레드)에서 한다. 억제된 로그는 큐에 들어가지 않으므로 도배 시 큐 오버플로 드롭도 함께 줄어든다.
- 반복이 멈춘 뒤의 잔여 집계분은 별도 타이머(최대 60초 주기)가 뽑아 큐에 넣는다. `WriterLoop`는 변경되지 않았다.
- `Dispose()`는 `타이머 정지 → 잔여 집계 드레인 → CompleteAdding` 순서다. 순서가 바뀌면 종료 시점 집계분이 사라진다.

## 채널 구조
`Worker`에서 각 루프 진입 시 `BeginChannel()` scope를 열고, 해당 scope 안의 모든 로그는 같은 채널로 기록된다.

채널 값은 `AsyncLocal`로 전달되므로 병렬 루프 간 로그가 섞이지 않는다.
루프가 호출한 Manager의 로그도 같은 채널로 따라간다.

| 폴더 | 주기 | 쌓이는 로그 |
|---|---|---|
| `service` | - | 서비스 시작/종료, **초기 캐시 적재**, `FileLogger` 자기진단(`dropped=`, 중복 억제 상한) |
| `report-last` | 30초 | 센서 API 수집 전체 — 응답 파싱 경고, `report/last summary`, `Material` UPDATE 배치, 알람 전송 |
| `weather` | 10분 | 기상청 초단기예보 API + `WeatherData` INSERT/UPDATE |
| `alarm` | 1.5초 | `Current` 테이블 조회로 현재 알람 목록 캐시 갱신 |
| `alarm-options` | 2초 | `Option` 테이블에서 센서 타입별 알람 사용 여부 갱신 |
| `timeout-alarm` | 1분 | SOPWebServer `CheckTimeout` 위임 호출 |
| `five-minute` | 5분 | 5분 버킷 스냅샷 스캔 + `ex_sensor_his` INSERT |
| `reload-cache` | 5분 | **주기적** 센서 캐시 리로드 |

> `service`와 `reload-cache`에 **같은 문구의 캐시 적재 실패 로그가 나뉘어 남는다.**
> `LoadCache()`를 초기 1회는 `ProcessManager.Initialize()`가(채널 scope 밖 → `service`),
> 이후 5분마다는 `RunReloadCacheLoop`가(→ `reload-cache`) 호출하기 때문이다.
> `SensorZone cache load failed: …` 같은 줄을 찾을 때 두 폴더를 모두 봐야 한다.

`LogFolder` 루트에 있는 채널 폴더 밖의 `{LogFileTag}_yyyyMMdd.txt`는
채널 분리 이전 형식의 잔재이며 `LogLifeTime` 기준으로 정리된다.

## 기록 흐름
1. `Initialize(LogOptions, eventLogSink)` 호출로 설정을 초기화한다.
2. `Info/Warn/Debug/Error` 호출 시 `LogEntry`가 생성되어 큐에 적재된다.
3. `WriterLoop`가 큐를 소비하면서 채널/날짜/순번 기준 파일 경로를 계산한다.
4. 현재 활성 파일이 최대 크기를 넘지 않으면 같은 파일에 append한다.
5. 최대 크기를 넘으면 같은 날짜 내 다음 순번 파일로 롤오버한다.
6. 날짜가 바뀌면 cleanup/archive를 수행한 뒤 새 날짜 파일로 전환한다.
7. 파일 기록 실패 시 fallback 폴더에도 같은 구조로 기록을 시도한다.

```csharp
using (FileLogger.Instance.BeginChannel("weather"))
{
    FileLogger.Instance.Info("Weather loop started.");
    FileLogger.Instance.Warn("API getUltraSrtFcst failed.");
}
```

## 로그 포맷
각 로그는 아래 형식으로 기록된다.

```
[yyyy-MM-dd HH:mm:ss.fff] [Level] [C:channel] [T:ThreadId] Message
Exception.ToString() (예외가 있을 때만 추가)
```

예시:

```
[2026-04-08 15:10:00.123] [Warn] [C:report-last] [T:18] API report/last failed: timeout
```

## 활성 로그 파일 규칙
활성 로그는 채널별 폴더에 저장되며, 파일명은 다음 형식을 사용한다.

```
{LogFolder}\{channel}\{LogFileTag}_{yyyyMMdd}_{seq:000}.txt
```

예시:
- `C:\UnE\Log\GwangyangSensorService\weather\GwangyangSensorService_20260408_001.txt`
- `C:\UnE\Log\GwangyangSensorService\weather\GwangyangSensorService_20260408_002.txt`

의미:
- 같은 날짜라도 파일이 커지면 `_001`, `_002`, `_003` 식으로 분할된다.
- 이 구조로 큰 txt 파일을 직접 열기 어려운 문제를 줄인다.

## 월별 zip archive 규칙
닫힌 월의 txt 로그는 채널별 `archive` 폴더 아래 월별 zip 1개로 묶는다.

경로 형식:

```
{LogFolder}\{channel}\archive\yyyy-MM.zip
```

예시:
- `C:\UnE\Log\GwangyangSensorService\weather\archive\2026-03.zip`
- `C:\UnE\Log\GwangyangSensorService\report-last\archive\2026-03.zip`

zip 내부에는 해당 채널/해당 월의 txt 파일이 모두 들어간다.

예시:
- `GwangyangSensorService_20260301_001.txt`
- `GwangyangSensorService_20260301_002.txt`
- `GwangyangSensorService_20260315_001.txt`

archive 처리 조건:
- 현재 월 txt는 archive 대상에서 제외
- 현재 writer가 쓰고 있는 파일은 제외
- `ArchiveAfterDays` 기준을 만족한 닫힌 월만 처리
- zip 생성 성공 후에만 원본 txt를 삭제
- 같은 월 zip이 이미 있으면 다시 만들지 않는다

## archive 삭제 정책
archive는 두 단계로 정리한다.

### 1. 보관 기간 기준 삭제
- `DeleteArchiveAfterDays`를 지난 zip은 먼저 삭제한다.

### 2. 총량 기준 삭제
- archive 전체 용량이 `MaxArchiveSizeGB`를 초과하면 추가 정리를 수행한다.
- 방식은 `채널별 가장 오래된 zip`을 후보로 뽑아, 후보 중 가장 오래된 zip부터 삭제하는 순환 방식이다.
- 이 방식으로 특정 채널만 과도하게 먼저 지워지는 것을 줄인다.

예:
- `weather` oldest: `2025-01.zip`
- `report-last` oldest: `2025-02.zip`
- `alarm` oldest: `2025-01.zip`
- 후보 중 가장 오래된 zip부터 삭제
- 아직도 초과면 다시 채널별 oldest 후보를 뽑아 반복

## fallback 및 overflow 처리
- 파일 기록 실패 시 fallback 폴더에 동일한 구조로 다시 기록을 시도한다.
- 큐가 가득 차면 신규 로그는 드롭될 수 있으며, 드롭 수는 `FileLogger queue overflow. dropped=...` 경고로 남긴다.

## 운영 시 확인 포인트
- 채널별 폴더가 생성되는지
- 활성 로그가 `_001`, `_002` 식으로 분할되는지
- 닫힌 월에 `archive\yyyy-MM.zip`이 생성되는지
- archive 전체가 30GB를 넘을 때 채널별 oldest zip 삭제가 동작하는지

## 큰 로그 파일 열람 방법
활성 로그 분할로 크기를 줄이지만, 직접 열람 시 아래 방법을 같이 사용하면 좋다.

- 마지막 N줄 보기
  - `Get-Content <path> -Tail 200`
- 특정 키워드 검색
  - `Select-String -Path <path> -Pattern 'RunReportLastLoop failed'`
- 채널별 폴더만 좁혀서 검색
  - 예: `...\report-last\`, `...\weather\`

## 주의 사항
- 월 zip이 이미 생성된 뒤 같은 월 txt가 다시 생기면 자동 merge는 하지 않는다.
- cleanup/archive는 `best effort`로 동작한다. 실패해도 서비스 본체 동작을 중단시키지 않는다.
- 채널 값은 파일 시스템 안전 문자만 남기고 정규화한다.
