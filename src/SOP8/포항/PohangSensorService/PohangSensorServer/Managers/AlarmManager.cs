using System;
using System.Collections.Concurrent;
using System.Collections.Generic;
using System.Linq;
using System.Net.Http;
using System.Text;
using System.Threading;
using System.Threading.Tasks;
using Base.Model.Alarm;
using dnsDapperDBUtil.DataAccessLayer.DAL;
using Newtonsoft.Json.Linq;

namespace PohangSensorServer.Managers
{
    public class AlarmManager : IDisposable
    {
        #region Constants
        private const int TIMEOUT_CHECK_INTERVAL_MS = 30 * 1000; // 30초
        private const int ALARM_LIST_UPDATE_INTERVAL_MS = 1 * 1000; // 3초  
        private const int ERROR_RETRY_INTERVAL_MS = 60 * 1000; // 1분
        private const int THREAD_JOIN_TIMEOUT_MS = 5000; // 5초
        #endregion

        #region Private Fields
        private readonly Logger _logger;
        private readonly string _sopWebServerUrl;
        private readonly DataManager _dataManager;
        private readonly HttpClient _httpClient;
        
        private Thread _alarmTimeoutThread;
        private Thread _alarmListThread;
        
        // 
        private CancellationTokenSource _cancellationTokenSource;
        
        private readonly ConcurrentDictionary<int, Current> _alarmList = new ConcurrentDictionary<int, Current>();
        
        private volatile bool _disposed = false;
        #endregion

        #region Constructor
        public AlarmManager(string sopWebServerUrl, DataManager dataManager, Logger logger)
        {
            _sopWebServerUrl = sopWebServerUrl ?? throw new ArgumentNullException(nameof(sopWebServerUrl));
            _dataManager = dataManager ?? throw new ArgumentNullException(nameof(dataManager));
            _logger = logger ?? throw new ArgumentNullException(nameof(logger));

            _httpClient = new HttpClient();
            _cancellationTokenSource = new CancellationTokenSource();
            
            InitializeThreads();
        }
        #endregion

        
        public void Start()
        {
            if (_disposed) throw new ObjectDisposedException(nameof(AlarmManager));

            if (!_alarmTimeoutThread.IsAlive) { _alarmTimeoutThread.Start(); }
            if (!_alarmListThread.IsAlive) { _alarmListThread.Start(); }
        }
        
        private void InitializeThreads()
        {
            _alarmTimeoutThread = new Thread(WatchTimeout)
            {
                IsBackground = true,
                Name = "AlarmTimeoutThread"
            };

            _alarmListThread = new Thread(WatchAlarmList)
            {
                IsBackground = true,
                Name = "AlarmListThread"
            };
        }


        /// <summary>
        /// 24시간이 지난 알람은 자동으로 해제한다.
        /// </summary>
        public void WatchTimeout()
        {
            try
            {
                while (!_cancellationTokenSource.Token.IsCancellationRequested)
                {
                    try
                    {
                        if (TimeoutAlarm())
                        {
                            // 해당 메서드로 대기 및 취소신호를 감지한다.
                            _cancellationTokenSource.Token.WaitHandle.WaitOne(TIMEOUT_CHECK_INTERVAL_MS);
                        }
                        else
                        {
                            _logger.Write("TimeoutAlarm() failed");
                            _cancellationTokenSource.Token.WaitHandle.WaitOne(ERROR_RETRY_INTERVAL_MS);
                        }
                    }
                    catch (Exception ex)
                    {
                        _logger.Write($"Error in WatchTimeout iteration: {ex.Message}");
                        _cancellationTokenSource.Token.WaitHandle.WaitOne(ERROR_RETRY_INTERVAL_MS);
                    }
                }
            }
            catch (Exception ex)
            {
                _logger.Write($"Fatal error in AlarmManager.WatchTimeout: {ex.Message}");
            }

        }
        
        private void WatchAlarmList()
        {
            try
            {
                // 취소 신호가 감지될 경우 반복 동작을 중지한다.
                while (!_cancellationTokenSource.Token.IsCancellationRequested)
                {
                    try
                    {
                        if (UpdateAlarmList(out string errorMessage))
                        {
                            _cancellationTokenSource.Token.WaitHandle.WaitOne(ALARM_LIST_UPDATE_INTERVAL_MS);
                        }
                        else
                        {
                            _logger.Write($"UpdateAlarmList() failed: {errorMessage}");
                            _cancellationTokenSource.Token.WaitHandle.WaitOne(ERROR_RETRY_INTERVAL_MS);
                        }
                    }
                    catch (Exception ex)
                    {
                        _logger.Write($"Error in WatchAlarmList iteration: {ex.Message}");
                        _cancellationTokenSource.Token.WaitHandle.WaitOne(ERROR_RETRY_INTERVAL_MS);
                    }
                }
            }
            catch (Exception ex)
            {
                _logger.Write($"Fatal error in AlarmManager.WatchAlarmList: {ex.Message}");
            }

        }

        private bool UpdateAlarmList(out string strErrorMessage)
        {
            try
            {
                var currentAlarmList = _dataManager.GetSelect().Select<Current>(null, out strErrorMessage)?.ToList();

                if (currentAlarmList == null)
                {
                    _logger.Write($"[ERROR] Select SdmsAlarmCurrent failed: {strErrorMessage}");
                    return false;
                }

                // 빈 리스트와 null을 구분하여 처리
                if (currentAlarmList.Count == 0)
                {
                    _alarmList.Clear();
                    return true;
                }

                // ConcurrentDictionary 업데이트
                _alarmList.Clear();
                foreach (var alarm in currentAlarmList)
                {
                    _alarmList.TryAdd(alarm.sensor_zone_sn, alarm);
                }

                strErrorMessage = string.Empty;
                return true;
            }
            catch (Exception ex)
            {
                strErrorMessage = ex.Message;
                return false;
            }

        }

        public bool TimeoutAlarm()
        {
            string strErrorMessage;
            
            // 24시간이 지난 알람을 조회한다.
            DateTime dtYesterday = DateTime.Now.AddDays(-1);
            string strYesterday = dtYesterday.ToString("yyyy-MM-dd HH:mm:ss");
            string strCondition = $"{Current.Fields.alarm_tm} <= '{strYesterday}'";

            IEnumerable<Current> resultAlarmCurrent = _dataManager.GetSelect().Select<Current>(strCondition, out strErrorMessage);

            if (resultAlarmCurrent == null)
            {
                _logger.Write("[ERROR] Select SdmsAlarmCurrent : " + strErrorMessage);
                return false;
            }
            
            List<Current> alarmList = resultAlarmCurrent.ToList();
            if (!alarmList.Any())
            {
                return true;
            }

            try
            {
                foreach (Current alarm in alarmList)
                {
                    if (!SendTimeoutAlarm(alarm.sensor_zone_hist_sn, out strErrorMessage))
                    {
                        _logger.Write("[ERROR] SendTimeoutAlarm : " + strErrorMessage);
                    }
                }
            }
            catch (Exception e)
            {
                _logger.Write("SendTimeoutAlarm occur error : " + e.Message);
            }

            return true;
        }
        
        /// <summary>
        /// 하루가 지난 알람은 자동으로 해제한다.
        /// </summary>
        /// <param name="nSensorZoneHistoryNo"></param>
        /// <param name="strErrorMessage"></param>
        /// <returns></returns>
        public bool SendTimeoutAlarm(int nSensorZoneHistoryNo, out string strErrorMessage)
        {
            if (string.IsNullOrEmpty(_sopWebServerUrl))
            {
                strErrorMessage = "SOPWebServerURL is null or empty";
                return false;
            }

            string timeoutUrl = _sopWebServerUrl.EndsWith("/") ? 
                _sopWebServerUrl + "api/ClearAlarm/RequestClearAlarm" : 
                _sopWebServerUrl + "/api/ClearAlarm/RequestClearAlarm";

            var json = new JObject
            {
                ["header"] = 110,
                ["sensorZoneHistoryNo"] = nSensorZoneHistoryNo,
                ["userNo"] = null,
                ["memo"] = null
            };

            return WebServiceManager.SendJsonData(json, timeoutUrl, out strErrorMessage);

        }
        
        public void Dispose()
        {
            if (_disposed)
                return;

            _disposed = true;

            try
            {
                // Dispose 호출시 취소 신호 발송 -> _cancellationTokenSource.Token.WaitHandle.WaitOne 를 사용하는 부분에서 취소신호를 감지하면 WaitOne이 즉시반환
                // Thread.Sleep() 보다 권장되는 패턴
                _cancellationTokenSource?.Cancel();

                // 스레드 종료 대기
                if (_alarmTimeoutThread?.IsAlive == true)
                {
                    if (!_alarmTimeoutThread.Join(THREAD_JOIN_TIMEOUT_MS))
                    {
                        _logger.Write("AlarmTimeout thread did not terminate gracefully");
                    }
                }

                if (_alarmListThread?.IsAlive == true)
                {
                    if (!_alarmListThread.Join(THREAD_JOIN_TIMEOUT_MS))
                    {
                        _logger.Write("AlarmList thread did not terminate gracefully");
                    }
                }

                // 리소스 정리
                _cancellationTokenSource?.Dispose();
                _httpClient?.Dispose();
            }
            catch (Exception ex)
            {
                _logger.Write($"Error during AlarmManager disposal: {ex.Message}");
            }
            finally
            {
                GC.SuppressFinalize(this);
            }
        }

        
        /// <summary>
        /// 이벤트 발생 함수 작성
        /// </summary>
        /// <param name="data"></param>
        /// <returns></returns>
        public async Task<bool> SendSensorAlarmAsync(string jsonData)
        {
            if (string.IsNullOrEmpty(jsonData))
            {
                _logger.Write("Json Data is empty");
                return false;
            }

            if (string.IsNullOrEmpty(_sopWebServerUrl))
            {
                _logger.Write("SOPWebServerURL is null or empty");
                return false;
            }

            string url = _sopWebServerUrl.EndsWith("/") ? 
                _sopWebServerUrl + "api/Sensor/RequestSensorSignal" : 
                _sopWebServerUrl + "/api/Sensor/RequestSensorSignal";

            try
            {
                using var content = new StringContent(jsonData, Encoding.UTF8, "application/json");
                using var response = await _httpClient.PostAsync(url, content); // HttpResponseMessage (Obj)
                
                var resultContent = await response.Content.ReadAsStringAsync();
                
                if (response.IsSuccessStatusCode)
                {
                    if (!GetResponse(resultContent, out string errorMessage))
                    {
                        _logger.Write($"HTTP Error: {errorMessage}");
                        return false;
                    }

                    return true;
                }
                else
                {
                    // 상태코드 - 장애요소
                    _logger.Write($"HTTP Error: {response.StatusCode} - {response.ReasonPhrase}");
                    return false;
                }
            }
            catch (HttpRequestException ex)
            {
                _logger.Write($"HTTP Request Error: {ex.Message}");
                return false;
            }
            catch (Exception ex)
            {
                _logger.Write($"Unexpected Error: {ex.Message}");
                return false;
            }
        }

        // 동기 버전 유지 (기존 코드 호환성)
        public bool SendSensorAlarm(string jsonData)
        {
            return SendSensorAlarmAsync(jsonData).GetAwaiter().GetResult();
        }


        public string CreateAlarmJson(int sensorType, int sensorZoneNo, int sensorData, int alarmLevel)
        {
            var json = new JObject
            {
                ["header"] = 100,
                ["sensorType"] = sensorType,
                ["sensorZoneNo"] = sensorZoneNo,
                ["sensorData"] = sensorData,
                ["alarmDepth"] = alarmLevel
            };

            return json.ToString();

        }
        
        private bool GetResponse(string result, out string errorMessage)
        {
            try
            {
                var json = JObject.Parse(result);
                return GetJsonResult(json, out bool success, out errorMessage) && success;
            }
            catch (Exception ex)
            {
                errorMessage = $"JSON parsing error: {ex.Message}";
                return false;
            }
        }

        private bool GetJsonResult(JObject json, out bool success, out string errorMessage)
        {
            success = false;
            errorMessage = null;

            var tokenSuccess = json.GetValue("success");
            var tokenMessage = json.GetValue("message");

            if (tokenSuccess == null)
            {
                errorMessage = "API가 제대로 실행되지 못하였습니다.";
                return false;
            }

            var successValue = tokenSuccess.Value<string>()?.ToLower();
            success = successValue == "true";

            if (tokenMessage != null)
            {
                errorMessage = tokenMessage.Value<string>();
            }
            else
            {
                errorMessage = "API의 실행결과를 읽어오지 못하였습니다.";
                return false;
            }

            return true;
        }


        public Dictionary<int, Current> GetAlarmList()
        {
            return new Dictionary<int, Current>(_alarmList);
        }

    }

    public class AlarmData
    {
        private const int DefaultAlarmLevel = 1; // 기본 알람 레벨, 상수로 분리

        public int SensorZoneNo { get; set; }
        public int SensorType { get; set; }
        public int SensorData { get; set; }
        public int AlarmDepth { get; set; }

        public AlarmData(int sensorZoneNo, int sensorType, int sensorData, int alarmLevel = DefaultAlarmLevel)
        {
            SensorZoneNo = sensorZoneNo;
            SensorType = sensorType;
            SensorData = sensorData;
            AlarmDepth = alarmLevel;
        }
    }
}
