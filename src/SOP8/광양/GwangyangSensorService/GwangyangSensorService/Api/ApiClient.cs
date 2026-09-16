using System;
using System.Diagnostics;
using System.Net.Http;
using System.Net.Http.Headers;
using System.Text;
using System.Text.Json;
using System.Threading;
using System.Threading.Tasks;
using GwangyangSensorService.Config;
using GwangyangSensorService.Logging;
using Microsoft.Extensions.Options;

namespace GwangyangSensorService.Api
{
    public interface IApiClient
    {
        Task<ApiResult<T>> GetAsync<T>(string relativeUrl, CancellationToken cancellationToken = default);
        Task<ApiResult<T>> PostAsync<T>(string relativeUrl, object body, CancellationToken cancellationToken = default);
    }

    public sealed class ApiClient : IApiClient
    {
        /// <summary>오류 응답 본문을 로그에 남길 때의 최대 길이.</summary>
        private const int MaxErrorBodyLength = 300;

        private static readonly JsonSerializerOptions JsonOptions = new JsonSerializerOptions
        {
            PropertyNameCaseInsensitive = true
        };

        private readonly HttpClient _httpClient;
        private readonly ApiOptions _options;

        public ApiClient(HttpClient httpClient, IOptions<ApiOptions> options)
        {
            _httpClient = httpClient ?? throw new ArgumentNullException(nameof(httpClient));
            _options = options?.Value ?? throw new ArgumentNullException(nameof(options));

            if (!string.IsNullOrWhiteSpace(_options.BaseUrl))
                _httpClient.BaseAddress = new Uri(_options.BaseUrl, UriKind.Absolute);
        }

        public Task<ApiResult<T>> GetAsync<T>(string relativeUrl, CancellationToken cancellationToken = default)
        {
            return SendAsync<T>(HttpMethod.Get, relativeUrl, null, cancellationToken);
        }

        public Task<ApiResult<T>> PostAsync<T>(string relativeUrl, object body, CancellationToken cancellationToken = default)
        {
            string payload = JsonSerializer.Serialize(body, JsonOptions);
            var content = new StringContent(payload, Encoding.UTF8, "application/json");
            return SendAsync<T>(HttpMethod.Post, relativeUrl, content, cancellationToken);
        }

        private async Task<ApiResult<T>> SendAsync<T>(
            HttpMethod method,
            string relativeUrl,
            HttpContent content,
            CancellationToken cancellationToken)
        {
            using var request = new HttpRequestMessage(method, relativeUrl);
            if (content != null)
                request.Content = content;

            if (!string.IsNullOrWhiteSpace(_options.BearerToken))
                request.Headers.Authorization = new AuthenticationHeaderValue("Bearer", _options.BearerToken);

            var stopwatch = Stopwatch.StartNew();
            try
            {
                using HttpResponseMessage response =
                    await _httpClient.SendAsync(request, cancellationToken).ConfigureAwait(false);
                string bodyText = await response.Content.ReadAsStringAsync().ConfigureAwait(false);
                stopwatch.Stop();

                if (!response.IsSuccessStatusCode)
                {
                    // 오류 응답 본문은 HTML 페이지일 수 있으므로 1행으로 접어 길이를 제한한다.
                    return ApiResult<T>.Fail(
                        $"HTTP {(int)response.StatusCode}: {LogText.Summarize(bodyText, MaxErrorBodyLength)}",
                        stopwatch.Elapsed);
                }

                if (string.IsNullOrWhiteSpace(bodyText))
                    return ApiResult<T>.Complete(default, stopwatch.Elapsed);

                T data = JsonSerializer.Deserialize<T>(bodyText, JsonOptions);
                return ApiResult<T>.Complete(data, stopwatch.Elapsed);
            }
            catch (Exception ex)
            {
                stopwatch.Stop();
                return ApiResult<T>.Fail(ex.Message, stopwatch.Elapsed);
            }
        }
    }

    public sealed class ApiResult<T>
    {
        public bool Success { get; }
        public string Error { get; }
        public T Data { get; }

        /// <summary>요청 전송부터 응답 본문 수신까지 걸린 시간.</summary>
        public TimeSpan Elapsed { get; }

        public long ElapsedMs => (long)Elapsed.TotalMilliseconds;

        private ApiResult(bool success, T data, string error, TimeSpan elapsed)
        {
            Success = success;
            Data = data;
            Error = error;
            Elapsed = elapsed;
        }

        public static ApiResult<T> Complete(T data, TimeSpan elapsed = default) =>
            new ApiResult<T>(true, data, string.Empty, elapsed);

        public static ApiResult<T> Fail(string error, TimeSpan elapsed = default) =>
            new ApiResult<T>(false, default, error ?? "Unknown error", elapsed);
    }
}
