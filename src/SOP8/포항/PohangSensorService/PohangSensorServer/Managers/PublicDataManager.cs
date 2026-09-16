using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading;
using dnsDapperDBUtil.DataAccessLayer.DAL;
using Pohang.Model;

namespace PohangSensorServer.Managers
{
    
    public class PublicDataManager : IDisposable
    {
        private readonly Logger m_logger;
        private readonly DataManager m_dataManager;
        private readonly WebServiceManager m_webServiceManager;
        
        private Thread m_publicDataThread;
        
        private const int THREAD_JOIN_TIMEOUT_MS = 5 * 1000;
        private const int DATA_UPDATE_INTERVAL_MS = 10 * 60 * 1000; // 10분마다 업데이트
        private const int ERROR_RETRY_INTERVAL_MS = 60 * 1000; // Exception시 1분마다 재시도
        
        private volatile bool m_disposed = false;
        private CancellationTokenSource m_cancellationTokenSource;
        
        private string m_TmsURL;
        private string m_airKoreaURL;
        private string m_weatherURL;
    
        public PublicDataManager(DataManager dataManager, WebServiceManager webServiceManager, Logger logger, string TmsURL, string airKoreaURL, string weatherURL)
        {
            m_logger = logger;
            m_dataManager = dataManager;
            m_webServiceManager = webServiceManager;
            m_TmsURL = TmsURL;
            m_airKoreaURL = airKoreaURL;
            m_weatherURL = weatherURL;
            
            if (m_TmsURL == null || m_airKoreaURL == null || m_weatherURL == null)
                m_logger.Write("PublicDataManager 생성 실패: URL이 null입니다.");
            
            m_cancellationTokenSource = new CancellationTokenSource();

        }
        
        public void Dispose()
        {
            if (m_disposed)
                return;
            
            m_disposed = true;

            try
            {
                m_cancellationTokenSource?.Cancel();
                m_logger.Write("PublicDataManager 종료 신호 발송");

                if (m_publicDataThread?.IsAlive == true)
                {
                    if (!m_publicDataThread.Join(THREAD_JOIN_TIMEOUT_MS))
                        m_logger.Write("PublicData thread did not terminate gracefully");
                    else
                        m_logger.Write("PublicData thread terminated successfully");
                }
            }
            catch (Exception e)
            {
                m_logger.Write("Disposing PublicDataManager failed: " + e.Message);
            }
            finally
            {
                GC.SuppressFinalize(this);
            }
        }

        public void Start()
        {
            m_publicDataThread = new Thread(() =>
            {
                while (!m_cancellationTokenSource.Token.IsCancellationRequested)
                {
                    UpdatePublicData();
                    Thread.Sleep(DATA_UPDATE_INTERVAL_MS);
                }
            });
            m_publicDataThread.Start();
        }

        private void UpdatePublicData()
        {
            string strErrorMessage;
            if (UpdateTMS(out strErrorMessage) == false)
                m_logger.Write($@"UpdateTMS returned false : {strErrorMessage}");
            if (UpdateAirKorea(out strErrorMessage) == false)
                m_logger.Write($@"UpdateAirKorea returned false : {strErrorMessage}");
            if (UpdateWeather(out strErrorMessage) == false)
                m_logger.Write($@"UpdateWeather returned false : {strErrorMessage}");
        }

        private bool UpdateTMS(out string strErrorMessage)
        {
            strErrorMessage = null;

            try
            {
                ApiResponse<dynamic> TMSResponse = m_webServiceManager.GetApiDataAsync<dynamic>(m_TmsURL).Result;
                
                if (!TMSResponse.Success)
                {
                    strErrorMessage = TMSResponse.Message;
                    return false;
                }
                
                List<dynamic> TMSData = TMSResponse.Data.data.ToObject<List<dynamic>>();

                StringBuilder insertBuilder = new StringBuilder();
                if (TMSData.Any())
                {
                    if (m_dataManager.GetDelete().Delete<PublicTms>(null, out strErrorMessage) == false)
                    {
                        strErrorMessage = $@"Delete TMS Data Error: {strErrorMessage}";
                        return false;
                    }
                    
                    foreach (dynamic data in TMSData)
                    {
                        string insert = $@"Insert Into {PublicTms.TableName} 
                                             (
                                              {PublicTms.Fields.company_name}, 
                                              {PublicTms.Fields.address}, 
                                              {PublicTms.Fields.tm}, 
                                              {PublicTms.Fields.sox_value},
                                              {PublicTms.Fields.nox_value},
                                              {PublicTms.Fields.co_value},
                                              {PublicTms.Fields.tsp_value},
                                              {PublicTms.Fields.hcl_value},
                                              {PublicTms.Fields.hf_value},
                                              {PublicTms.Fields.nh3_value}
                                              )
                                             VALUES
                                             (
                                             '{data.name}',
                                             '{data.addr}',
                                             '{data.mesure_dt}',
                                              {data.sox_mesure_value},
                                              {data.nox_mesure_value},
                                              {data.co_mesure_value},
                                              {data.tsp_mesure_value},
                                              {data.hcl_mesure_value},
                                              {data.hf_mesure_value},
                                              {data.nh3_mesure_value}
                                              );
                                            ";
                        insertBuilder.AppendLine(insert);
                    }
                }

                if (insertBuilder.Length > 0)
                {
                    if (m_dataManager.GetCreate().Insert(insertBuilder.ToString(), out strErrorMessage) == false)
                    {
                        strErrorMessage = $@"Insert TMS Data Error: {strErrorMessage}";
                        return false;
                    }
                }
                
                return true;
            }
            catch (Exception ex)
            {
                strErrorMessage = ex.Message;
                return false;
            }
        }    
        
        private bool UpdateAirKorea(out string strErrorMessage)
        {
            strErrorMessage = null;

            try
            {
                ApiResponse<dynamic> airKoreaResponse = m_webServiceManager.GetApiDataAsync<dynamic>(m_airKoreaURL).Result;
                
                if (!airKoreaResponse.Success)
                {
                    strErrorMessage = airKoreaResponse.Message;
                    return false;
                }
                
                List<dynamic> airKoreaData = airKoreaResponse.Data.data.ToObject<List<dynamic>>();
                
                StringBuilder insertBuilder = new StringBuilder();
                if (airKoreaData.Any())
                {
                    if (m_dataManager.GetDelete().Delete<PublicAirKorea>(null, out strErrorMessage) == false)
                    {
                        strErrorMessage = $@"Delete AirKorea Data Error: {strErrorMessage}";
                        return false;
                    }
                    
                    foreach (dynamic data in airKoreaData)
                    {
                        string insert = $@"Insert Into {PublicAirKorea.TableName} 
                                                (
                                                 {PublicAirKorea.Fields.lc_name},
                                                 {PublicAirKorea.Fields.address},
                                                 {PublicAirKorea.Fields.tm},
                                                 {PublicAirKorea.Fields.pm10_value},
                                                 {PublicAirKorea.Fields.pm25_value},
                                                 {PublicAirKorea.Fields.o3_value},
                                                 {PublicAirKorea.Fields.co_value},
                                                 {PublicAirKorea.Fields.so2_value}
                                                )
                                                VALUES
                                                ('{data.name}', 
                                                 '{data.addr}',
                                                 '{data.data_time}',
                                                 {data.pm10_value},
                                                 {data.pm25_value},
                                                 {data.o3_value},
                                                 {data.co_value},
                                                 {data.so2_value}
                                                );
                                                ";
                        
                        insertBuilder.AppendLine(insert);
                    }
                }
                
                if (insertBuilder.Length > 0)
                {
                    if (m_dataManager.GetCreate().Insert(insertBuilder.ToString(), out strErrorMessage) == false)
                    {
                        strErrorMessage = $@"Insert AirKorea Data Error: {strErrorMessage}";
                        return false;
                    }
                }
                
                return true;
            }
            catch (Exception ex)
            {
                strErrorMessage = ex.Message;
                return false;
            }
        }   
        
        private bool UpdateWeather(out string strErrorMessage)
        {
            strErrorMessage = null;

            try
            {
                ApiResponse<dynamic> weatherResponse = m_webServiceManager.GetApiDataAsync<dynamic>(m_weatherURL).Result;
                
                if (!weatherResponse.Success)
                {
                    strErrorMessage = weatherResponse.Message;
                    return false;
                }
                
                List<dynamic> weatherData = weatherResponse.Data.data.ToObject<List<dynamic>>();
                
                StringBuilder insertBuilder = new StringBuilder();
                if (weatherData.Any())
                {
                    if (m_dataManager.GetDelete().Delete<PublicWeather>(null, out strErrorMessage) == false)
                    {
                        strErrorMessage = $@"Delete Weather Data Error: {strErrorMessage}";
                        return false;
                    }
                    
                    foreach (dynamic data in weatherData)
                    {
                        string insert = $@"Insert Into {PublicWeather.TableName}
                                             (
                                             {PublicWeather.Fields.region_name},
                                             {PublicWeather.Fields.tm}, 
                                             {PublicWeather.Fields.temp_value},
                                             {PublicWeather.Fields.humi_value},
                                             {PublicWeather.Fields.wind_speed_value},
                                             {PublicWeather.Fields.wind_direction_value},
                                             {PublicWeather.Fields.air_pressure_value},
                                             {PublicWeather.Fields.insolation_value}
                                             )
                                            VALUES 
                                            (
                                             '{data.name}',
                                             '{data.obs_time}',
                                             {data.temperature},
                                             {data.humidity},
                                             {data.wind_speed},
                                             {data.wind_direction},
                                             {data.air_pressure},
                                             {data.solar_radiation}
                                            );
                                            ";
                        
                        insertBuilder.AppendLine(insert);
                    }
                }

                if (insertBuilder.Length > 0)
                {
                    if (m_dataManager.GetCreate().Insert(insertBuilder.ToString(), out strErrorMessage) == false)
                    {
                        strErrorMessage = $@"Insert Weather Data Error: {strErrorMessage}";
                        return false;
                    }
                }
                
                return true;
            }
            catch(Exception ex)
            {
                strErrorMessage = ex.Message;
                return false;
            }
        }
    
    }
}
