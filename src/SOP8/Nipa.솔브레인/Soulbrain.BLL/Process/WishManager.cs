using System;
using System.Net.Http;
using System.Text.Json;
using System.Threading.Tasks;
using Soulbrain.BLL.Response;

namespace Soulbrain.BLL.Process
{
    public class WishManager
    {
        private string m_strWebAPIServerURL = "";
        private readonly HttpClient m_httpClient;
        
        public WishManager(string strWebAPIServerURL)
        {
            m_strWebAPIServerURL = strWebAPIServerURL;
            m_httpClient = new HttpClient();
            
            m_httpClient.Timeout = TimeSpan.FromSeconds(15);
            m_httpClient.DefaultRequestHeaders.Add("Accept", "application/json");
        }

        public async Task<ResponseTodayWorkList> RequestTodayWorkList()
        {
            string url = MakeWishUrl("WishData/RequestTodayWorkList");

            try
            {
                var content = new StringContent("{}", System.Text.Encoding.UTF8, "application/json");

                using (var response = await m_httpClient.PostAsync(url, content))
                {
                    if (response.IsSuccessStatusCode)
                    {
                        string jsonResponse = await response.Content.ReadAsStringAsync();

                        var result = JsonSerializer.Deserialize<ResponseTodayWorkList>(jsonResponse,
                            new JsonSerializerOptions
                            {
                                PropertyNamingPolicy = JsonNamingPolicy.CamelCase
                            });

                        return result;
                    }
                }
            }
            catch (HttpRequestException e)
            {
                return new ResponseTodayWorkList(false, $@"API 호출 실패 : {e.Message}");
            }
            catch (Exception e)
            {
                return new ResponseTodayWorkList(false, $@"API 호출 실패 : {e.Message}");
            }
            
            return null;
        }

        public async Task<ResponseCurrentWorkPermitData> RequestCurrentWorkPermitData()
        {
            string url = MakeWishUrl("WishData/RequestCurrentWorkPermitData");

            try
            {
                var content = new StringContent("{}", System.Text.Encoding.UTF8, "application/json");

                using (var response = await m_httpClient.PostAsync(url, content))
                {
                    if (response.IsSuccessStatusCode)
                    {
                        string jsonResponse = await response.Content.ReadAsStringAsync();

                        var result = JsonSerializer.Deserialize<ResponseCurrentWorkPermitData>(jsonResponse,
                            new JsonSerializerOptions
                            {
                                PropertyNamingPolicy = JsonNamingPolicy.CamelCase
                            });

                        return result;
                    }
                }
            }
            catch (HttpRequestException ex)
            {
                return new ResponseCurrentWorkPermitData(false, $@"네트워크 오류: {ex.Message}");
            }
            catch (Exception ex)
            {
                return new ResponseCurrentWorkPermitData(false, $@"예기치 않은 오류: {ex.Message}");
            }
            
            return null;
        }

        private string MakeWishUrl(string strAdd)
        {
            string strUrl = m_strWebAPIServerURL;

            if (m_strWebAPIServerURL.EndsWith("/") == false)
            {
                strUrl += "/";
                strUrl += strAdd;
                return strUrl;
            }
            
            return strUrl + strAdd;
                
        }
    }
}