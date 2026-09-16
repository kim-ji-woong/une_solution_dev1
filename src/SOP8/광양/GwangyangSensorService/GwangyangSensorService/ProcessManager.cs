using System;
using System.Text;
using System.Threading;
using System.Threading.Tasks;
using GwangyangSensorService.Api;
using GwangyangSensorService.Managers;
using GwangyangSensorService.Models;

namespace GwangyangSensorService
{
    public class ProcessManager
    {
        private readonly IApiClient _apiClient;
        private readonly SensorManager _sensorManager;
        private readonly WeatherManager _weatherManager;
        private readonly AlarmManager _alarmManager;

        public ProcessManager(IApiClient apiClient, SensorManager sensorManager, WeatherManager weatherManager, AlarmManager alarmManager)
        {
            _apiClient = apiClient;
            _sensorManager = sensorManager;
            _weatherManager = weatherManager;
            _alarmManager = alarmManager;
        }

        public void Initialize()
        {
            _sensorManager.Initialize();
        }

        /// <returns>모든 캐시를 정상 적재했으면 true. 하나라도 실패하면 false.</returns>
        public bool ReloadSensorCache()
        {
            return _sensorManager.ReloadCache();
        }

        public async Task<bool> GetCurrentAlarmListAsync()
        {
            return await _alarmManager.WatchAlarmAsync();
        }
        
        public async Task<bool> WatchAlarmOptionsAsync()
        {
            return await _alarmManager.WatchUseAlarmAsync();
        }
        
        public async Task<bool> WatchTimeoutAlarmAsync(CancellationToken ct = default)
        {
            return await _alarmManager.WatchTimeoutAlarmAsync(ct);
        }
        
        public async Task<int> FlushFiveMinuteHistoryAsync(CancellationToken ct = default)
        {
            return await _sensorManager.FlushFiveMinuteHistoryAsync(ct);
        }
        
        public async Task<ApiResult<ReportLastResponse>> GetReportLastAsync(CancellationToken cancellationToken = default)
        {
            var result = await _apiClient.GetAsync<ReportLastResponse>("report/last", cancellationToken);
            if (result.Success && result.Data != null)
                await _sensorManager.HandleReportLastAsync(result.Data, cancellationToken);

            return result;
        }

        public async Task<ApiResult<SensorListResponse>> GetSensorListAsync(CancellationToken cancellationToken = default)
        {
            var result = await _apiClient.GetAsync<SensorListResponse>("sensor/list", cancellationToken);
            if (result.Success && result.Data != null)
                _sensorManager.HandleSensorList(result.Data);
            return result;
        }

        public async Task<ApiResult<NodeCategoryResponse>> GetNodeCategoryListAsync(CancellationToken cancellationToken = default)
        {
            var result = await _apiClient.GetAsync<NodeCategoryResponse>("node/cate/list", cancellationToken);
            if (result.Success && result.Data != null)
                _sensorManager.HandleNodeCategoryList(result.Data);
            return result;
        }

        public async Task<ApiResult<UltraSrtFcstResponse>> GetUltraSrtFcstAsync(
            string serviceKey,
            string baseDate,
            string baseTime,
            int nx,
            int ny,
            int numOfRows = 60,
            int pageNo = 1,
            string dataType = "JSON",
            string baseUrl = "https://apis.data.go.kr/1360000/VilageFcstInfoService_2.0/getUltraSrtFcst",
            CancellationToken cancellationToken = default)
        {
            if (string.IsNullOrWhiteSpace(serviceKey))
                throw new ArgumentException("serviceKey is required.", nameof(serviceKey));

            var query = new StringBuilder();
            query.Append("?serviceKey=").Append(Uri.EscapeDataString(serviceKey));
            query.Append("&numOfRows=").Append(numOfRows);
            query.Append("&pageNo=").Append(pageNo);
            query.Append("&dataType=").Append(Uri.EscapeDataString(dataType));
            query.Append("&base_date=").Append(Uri.EscapeDataString(baseDate));
            query.Append("&base_time=").Append(Uri.EscapeDataString(baseTime));
            query.Append("&nx=").Append(nx);
            query.Append("&ny=").Append(ny);

            string url = baseUrl + query;
            var result = await _apiClient.GetAsync<UltraSrtFcstResponse>(url, cancellationToken);
            
            if (result.Success && result.Data != null)
                await _weatherManager.HandleUltraSrtFcstAsync(result.Data);
            
            return result;
        }
    }
}
