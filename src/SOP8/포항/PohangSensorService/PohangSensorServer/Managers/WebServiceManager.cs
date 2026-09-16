using System;
using System.IO;
using System.Net.Http;
using System.Threading.Tasks;
using Newtonsoft.Json.Linq;

namespace PohangSensorServer.Managers
{
    public class WebServiceManager : IDisposable
    {
        private static readonly HttpClient httpClient = new HttpClient();
        
        private static string API_KEY;
        
        private Logger m_logger = null;
        
        public WebServiceManager(Logger logger, string apiKey)
        {
            m_logger = logger;
            API_KEY = apiKey;
        }
        
        public static bool SendJsonData(JObject json, string strUrl, out string strErrorMessage)
        {
            string strJson = json.ToString();
            
            strErrorMessage = string.Empty;
            
            byte[] bytes = System.Text.Encoding.UTF8.GetBytes(strJson);
            int len = bytes.Length;
            
            System.Net.HttpWebRequest request = (System.Net.HttpWebRequest)System.Net.WebRequest.Create(new Uri(strUrl));
            request.Method = "POST";
            request.ContentType = "application/json; charset=utf-8";
            request.ContentLength = len + 3;
            
            string strResult = "";

            try
            {
                StreamWriter writer = new StreamWriter(request.GetRequestStream(), System.Text.Encoding.UTF8);
                writer.Write(strJson);
                writer.Close();
                
                System.Net.HttpWebResponse wRes = (System.Net.HttpWebResponse)request.GetResponse();
                
                Stream respPostStream = wRes.GetResponseStream();
                StreamReader readerPost = new StreamReader(respPostStream, System.Text.Encoding.UTF8);
                
                strResult = readerPost.ReadToEnd().Trim();
                request.Abort();
                readerPost.Close();

                return GetResponse(strResult, out strErrorMessage);
            }
            catch (SystemException ex)
            {
                strErrorMessage = ex.Message;
                return false;
            }
        }
        
        private static bool GetResponse(string strResult, out string strErrorMessage)
        {
            bool success;

            if (GetJsonResult(JObject.Parse(strResult), out success, out strErrorMessage) == false)
                return false;

            return success;
        }

        private static bool GetJsonResult(JObject json, out bool success, out string strErrorMessage)
        {
            success = false;
            strErrorMessage = null;

            JToken tokenSuccess = json.GetValue("success");
            JToken tokenMessage = json.GetValue("message");

            if (tokenSuccess != null)
            {
                string strSuccess = tokenSuccess.Value<string>().ToLower();

                if (strSuccess == "true")
                {
                    success = true;
                }
            }
            else
            {
                strErrorMessage = "api가 제대로 실행되지 못하였습니다.";
                return false;
            }

            if (tokenMessage != null)
                strErrorMessage = tokenMessage.Value<string>();
            else
            {
                strErrorMessage = "api의 실행결과를 읽어오지 못하였습니다.";
                return false;
            }

            return true;
        }
        
        /// <summary>
        /// HTTP GET 요청을 통해 API 데이터를 비동기적으로 가져온다.
        /// return값은 ApiResponse &lt;T&gt; 형태로 성공 여부와 데이터를 포함한다.
        /// </summary>
        /// <param name="apiUrl"></param>
        /// <typeparam name="T"></typeparam>
        /// <returns></returns>
        public async Task<ApiResponse<T>> GetApiDataAsync<T>(string apiUrl)
        {
            try
            {
                httpClient.DefaultRequestHeaders.Clear();
                httpClient.DefaultRequestHeaders.Add("X-API-KEY", API_KEY);
                
                HttpResponseMessage response = await httpClient.GetAsync(apiUrl);
                response.EnsureSuccessStatusCode();

                string jsonResponse = await response.Content.ReadAsStringAsync();
                T data = Newtonsoft.Json.JsonConvert.DeserializeObject<T>(jsonResponse);
                return new ApiResponse<T>(data); // 성공 시 데이터와 함께 ApiResponse 반환
            }
            catch (Exception ex)
            {
                m_logger.Write($"GetApiDataAsync Exception: {ex.Message}");
                m_logger.Write($@"API URL: {apiUrl} , API KEY: {API_KEY}");
                return new ApiResponse<T>(default(T), ex.Message); // 실패 시 오류 메시지와 함께 ApiResponse 반환
            }
        }
        
        public void Dispose()
        {
            if (httpClient == null)
                return;
            
            httpClient.Dispose();
        }
    }
    
    public class ApiResponse<T>
    {
        public T Data { get; }
        public bool Success => string.IsNullOrEmpty(Message);
        public string Message { get; }

        public ApiResponse(T data, string errorMessage = null)
        {
            Data = data;
            Message = errorMessage;
        }
    }
    
}