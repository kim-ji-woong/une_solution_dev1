using System;
using System.Collections.Generic;
using System.Globalization;
using System.Linq;
using System.Text;
using System.Threading;
using Base.Model.Alarm;
using Base.Model.Common;
using Base.Model.Sensor;
using dnsDapperDBUtil.DataAccessLayer.DAL;
using dnsDapperDBUtil.DataAccessLayer.IDAL;
using dnsData.CommonCode;
using Newtonsoft.Json.Linq;
using Pohang.Model;
using PohangSensorServer.Const;

namespace PohangSensorServer.Managers
{
    public class SensorDataManager : IDisposable
    {
        #region Constants
        private const int SENSOR_UPDATE_INTERVAL_MS = 3 * 1000; // 3초
        private const int MATERIAL_UPDATE_INTERVAL_MS = 5 * 60 * 1000; // 5분
        private const int ERROR_RETRY_INTERVAL_MS = 60 * 1000; // 1분
        private const int THREAD_JOIN_TIMEOUT_MS = 5000; // 5초
        #endregion
        
        #region Public Fields
        public string ListApiUrl;
        public string LastApiUrl;
        
        public const int TemperatureCode = 8192;
        public const int HumidityCode = 8448;
        public const int WindDirectionCode = 28672;
        public const int WindSpeedCode = 28928;
        #endregion
        
        #region Private Fields
        private readonly Logger logger;
        private readonly DataManager dataManager;
        private readonly AlarmManager alarmManager;
        private readonly WebServiceManager webServiceManager;
        
        // Thread 관리 필드들
        private Thread m_sensorDataThread;
        private Thread m_thresholdThread;
        private CancellationTokenSource m_cancellationTokenSource;
        private volatile bool m_disposed = false;

        private const string IsUsableEventSensor = "UseReceive";
        
        private List<MaterialLink> m_materialLinks = new List<MaterialLink>();
        private List<SensorLink> m_sensorLinks = new List<SensorLink>();

        private Dictionary<int, Base.Model.Sensor.SensorZone> m_dicSensorZones = new Dictionary<int, Base.Model.Sensor.SensorZone>();
        private Dictionary<string, string> m_dicSensorZoneKeys = new Dictionary<string, string>();
        
        private DateTime m_lastInsertTime = DateTime.MinValue;
        
        private static readonly Dictionary<string, int> SensorTypeMapping = new Dictionary<string, int>
        {
            { SensorConstant.Atmosphere, (int)SensorConstant.SensorTypeIdx.Atmosphere },
            { SensorConstant.Rainfall, (int)SensorConstant.SensorTypeIdx.Rainfall },
            { SensorConstant.WaterLevel, (int)SensorConstant.SensorTypeIdx.WaterLevel },
            { SensorConstant.Odor, (int)SensorConstant.SensorTypeIdx.Odor },
            { SensorConstant.AIOdor, (int)SensorConstant.SensorTypeIdx.AIOdor }
        };
        #endregion
        
        #region Constructor
        public SensorDataManager(DataManager dataManager, AlarmManager alarmManager, WebServiceManager webServiceManager, Logger logger, string lastDataUrl, string materialDataUrl)
        {
            this.logger = logger ?? throw new ArgumentNullException(nameof(logger));
            this.dataManager = dataManager ?? throw new ArgumentNullException(nameof(dataManager));
            this.alarmManager = alarmManager ?? throw new ArgumentNullException(nameof(alarmManager));
            this.webServiceManager = webServiceManager ?? throw new ArgumentNullException(nameof(webServiceManager));
            
            if (string.IsNullOrEmpty(lastDataUrl) || string.IsNullOrEmpty(materialDataUrl))
            {
                logger.Write("API URL이 설정되지 않았습니다. SensorDataManager 초기화 실패.");
                throw new Exception("API URL이 설정되지 않았습니다. SensorDataManager 초기화 실패.");
            }
            
            this.ListApiUrl = materialDataUrl;
            this.LastApiUrl = lastDataUrl;
            
            if (!Init(out string strErrorMessage))
            {
                logger.Write("필수 데이터 로드에 실패하였습니다. 로그 파일을 확인해주세요." + strErrorMessage);
                throw new Exception(strErrorMessage);
            }

            m_cancellationTokenSource = new CancellationTokenSource();
            InitializeThread();
        }
        #endregion

        #region Thread Management
        private void InitializeThread()
        {
            m_sensorDataThread = new Thread(EntireProcessing)
            {
                IsBackground = true,
                Name = "SensorDataThread"
            };
            
            // m_thresholdThread = new Thread(SynchronizeThresholdData)
            // {
            //     IsBackground = true,
            //     Name = "ThresholdSyncThread"
            // };
        }
        
        public void Start()
        {
            if (!m_sensorDataThread.IsAlive)
            {
                m_sensorDataThread.Start();
            }
            
            // if (!m_thresholdThread.IsAlive)
            // {
            //     m_thresholdThread.Start();
            // }
        }
        
        public void Dispose()
        {
            if (m_disposed)
                return;

            m_disposed = true;

            try
            {
                // 취소 신호 발송 => 루프 정지시킴
                m_cancellationTokenSource?.Cancel();
                logger.Write("SensorDataManager 종료 신호 발송");

                // 스레드 종료 대기
                if (m_sensorDataThread?.IsAlive == true)
                {
                    if (!m_sensorDataThread.Join(THREAD_JOIN_TIMEOUT_MS))
                    {
                        logger.Write("SensorData thread did not terminate gracefully");
                    }
                    else
                    {
                        logger.Write("SensorData thread terminated successfully");
                    }
                }
                
                // if (m_thresholdThread?.IsAlive == true)
                // {
                //     if (!m_thresholdThread.Join(THREAD_JOIN_TIMEOUT_MS))
                //     {
                //         logger.Write("ThresholdSync thread did not terminate gracefully");
                //     }
                //     else
                //     {
                //         logger.Write("ThresholdSync thread terminated successfully");
                //     }
                // }

                // 리소스 정리
                m_cancellationTokenSource?.Dispose();
            }
            catch (Exception ex)
            {
                logger.Write($"Error during SensorDataManager disposal: {ex.Message}");
            }
            finally
            {
                GC.SuppressFinalize(this);
            }

        }
        #endregion
        
        #region Thread Worker Method - 쓰레드 바인딩 함수
        private void EntireProcessing()
        {
            try
            {
                // m_cancellationTokenSource.Cancel() 신호 받으면 루프 '즉각적으로'
                // m_cancellationTokenSource.Cancel() 신호는 Dispose()가 호출될때만 실행되므로 루프는 당연히 멈춰야한다.
                while (!m_cancellationTokenSource.Token.IsCancellationRequested)
                {
                    try
                    {
                        if (UpdateSensorData(out string strErrorMessage))
                        {
                            m_cancellationTokenSource.Token.WaitHandle.WaitOne(SENSOR_UPDATE_INTERVAL_MS);
                        }
                        else
                        {
                            logger.Write($"UpdateSensorData func has Error Message: {strErrorMessage}");
                            // 에러 발생 시 1분 대기
                            m_cancellationTokenSource.Token.WaitHandle.WaitOne(ERROR_RETRY_INTERVAL_MS);
                        }
                    }
                    catch (Exception ex)
                    {
                        logger.Write($"Error in SensorDataManager iteration: {ex.Message}");
                        // 예외 발생 시에도 1분 대기 후 재시도
                        m_cancellationTokenSource.Token.WaitHandle.WaitOne(ERROR_RETRY_INTERVAL_MS);
                    }
                }
            }
            catch (Exception ex)
            {
                logger.Write($"Fatal error in SensorDataManager.EntireProcessing: {ex.Message}");
            }
        }
        #endregion

        private void SynchronizeThresholdData()
        {
            try
            {
                // 외부 루프: 스레드가 살아있는 동안 계속 실행
                while (!m_cancellationTokenSource.Token.IsCancellationRequested)
                {
                    try
                    {
                        string strErrorMessage;
                
                        ApiResponse<dynamic> sensorListResponse = webServiceManager.GetApiDataAsync<dynamic>(ListApiUrl).Result;
                    
                        if (!sensorListResponse.Success)
                        {
                            strErrorMessage = sensorListResponse.Message;
                            logger.Write($"SynchronizeThresholdData Error: {strErrorMessage}");
                            
                            // API 호출 실패 시 대기 후 재시도 (continue를 통해 아래 로직 건너뜀)
                            m_cancellationTokenSource.Token.WaitHandle.WaitOne(ERROR_RETRY_INTERVAL_MS);
                            continue;
                        }
                    
                        List<dynamic> sensorList = sensorListResponse.Data.data.ToObject<List<dynamic>>();
                        
                        List<MaterialLink> materialLinks = new List<MaterialLink>();

                        foreach (var sensor_dynamic_item in sensorList)
                        {
                            if (sensor_dynamic_item == null)
                            {
                                logger.Write("Sensor JObject is null, skipping...");
                                continue;
                            }
                        
                            var sensor = sensor_dynamic_item as Newtonsoft.Json.Linq.JObject;
                        
                            if (sensor == null)
                            {
                                logger.Write("Sensor JObject is not valid, skipping...");
                                continue;
                            }
                        
                            MaterialLink materialLink = new MaterialLink();
                        
                            materialLink.sys_op_sensor_code_idx = sensor.Value<int>("sys_op_sensor_code_idx");
                            materialLink.sensor_name_kor = sensor.Value<string>("sensor_name_kor");
                            materialLink.sensor_name_eng = sensor.Value<string>("sensor_name_eng");
                            materialLink.sensor_unique_id = sensor.Value<int>("sensor_unique_id");
                            materialLink.sensor_unit = sensor.Value<string>("sensor_unit");
                            materialLink.limit_type = sensor.Value<int>("limit_type");
                            materialLink.limit_notice = sensor.Value<float>("limit_notice");
                            materialLink.limit_attention = sensor.Value<float>("limit_attention");
                            materialLink.limit_warning = sensor.Value<float>("limit_warning");
                        
                            materialLinks.Add(materialLink);
                        }
                    
                        if (materialLinks.Count == 0)
                        {
                            strErrorMessage = "No material links found in the sensor list.";
                            logger.Write($"SynchronizeThresholdData Error: {strErrorMessage}");
                            m_cancellationTokenSource.Token.WaitHandle.WaitOne(ERROR_RETRY_INTERVAL_MS);
                            continue;
                        }
                    
                        IEnumerable<MaterialLink> currentMaterialLinks = dataManager.GetSelect().Select<MaterialLink>(null, out strErrorMessage);
                    
                        List<MaterialLink> currentMaterialLinkList = currentMaterialLinks.ToList();
                    
                        foreach (MaterialLink materialLink in materialLinks)
                        {
                            if (currentMaterialLinkList.Find(m => m.sensor_unique_id != materialLink.sensor_unique_id) != null)
                            {
                                string strUpdateMaterialLinkQuery = $@"UPDATE {MaterialLink.TableName} SET 
                                    {MaterialLink.Fields.sensor_name_kor} = '{materialLink.sensor_name_kor}',
                                    {MaterialLink.Fields.sensor_name_eng} = '{materialLink.sensor_name_eng}',
                                    {MaterialLink.Fields.sensor_unit} = '{materialLink.sensor_unit}',
                                    {MaterialLink.Fields.limit_type} = {materialLink.limit_type},
                                    {MaterialLink.Fields.limit_notice} = {materialLink.limit_notice},
                                    {MaterialLink.Fields.limit_attention} = {materialLink.limit_attention},
                                    {MaterialLink.Fields.limit_warning} = {materialLink.limit_warning}
                                    WHERE {MaterialLink.Fields.sensor_unique_id} = {materialLink.sensor_unique_id};";

                                if (dataManager.GetDBManager().Excute(strUpdateMaterialLinkQuery, out strErrorMessage) == false)
                                {
                                    logger.Write($"Update MaterialLink Error: {strErrorMessage}");
                                }
                            }
                            else
                            {
                                MaterialLink newMaterialLink = new MaterialLink();
                                newMaterialLink.sys_op_sensor_code_idx = materialLink.sys_op_sensor_code_idx;
                                newMaterialLink.sensor_unique_id = materialLink.sensor_unique_id;
                                newMaterialLink.sensor_name_kor = materialLink.sensor_name_kor;
                                newMaterialLink.sensor_name_eng = materialLink.sensor_name_eng;
                                newMaterialLink.limit_type = materialLink.limit_type;
                                newMaterialLink.limit_notice = materialLink.limit_notice;
                                newMaterialLink.limit_attention = materialLink.limit_attention;
                                newMaterialLink.limit_warning = materialLink.limit_warning;

                                if (dataManager.GetCreate().Insert<MaterialLink>(newMaterialLink, out strErrorMessage) == false)
                                {
                                    logger.Write($"Insert MaterialLink Error: {strErrorMessage}");
                                }
                            }
                        }

                        m_cancellationTokenSource.Token.WaitHandle.WaitOne(MATERIAL_UPDATE_INTERVAL_MS);
                    }
                    catch (Exception ex) // 내부 Catch: 일시적 오류 처리
                    {
                        logger.Write($"SynchronizeThresholdData loop Error: {ex.Message}");
                        // 예외 발생 시 에러 대기 시간만큼 대기
                        m_cancellationTokenSource.Token.WaitHandle.WaitOne(ERROR_RETRY_INTERVAL_MS);
                    }
                }
            }
            catch (Exception exception) // 외부 Catch: 치명적 오류 처리
            {
                logger.Write($"Fatal error in SynchronizeThresholdData: {exception.Message}");
            }
        }
        
        /// <summary>
        /// 센서 관련 정보, 물질 관련 정보 초기화 및 데이터 로드
        /// Data Row가 0인 경우는 오류로 처리하지 않는다.
        /// </summary>
        /// <returns></returns>
        #region Initialization
        private bool Init(out string strErrorMessage)
        {
            strErrorMessage = string.Empty;

            #region 초기 물질, 임계치 데이터 로드 
            if (m_materialLinks.Count == 0)
            {
                
                List<MaterialLink> materialLinks = dataManager.GetSelect().Select<MaterialLink>(null, out strErrorMessage).ToList();
                
                if (materialLinks.Count == 0)
                {
                    if (!UpdateMaterialData(out strErrorMessage))
                    {
                        logger.Write("Failed to Create MaterialLink data Line 66 : " + strErrorMessage);
                        return false;
                    }
                    else
                    {
                        materialLinks = dataManager.GetSelect().Select<MaterialLink>(null, out strErrorMessage).ToList();
                        m_materialLinks = materialLinks.ToList();
                        return true;
                    }
                }
                else
                {
                    m_materialLinks = materialLinks.ToList();
                }
            }
            #endregion
            
            #region 센서 데이터 초기화

            if (m_sensorLinks.Count == 0)
            {
                List<SensorLink> sensorLinks = dataManager.GetSelect().Select<SensorLink>(null, out strErrorMessage)?.ToList();

                if (sensorLinks == null)
                {
                    logger.Write($"Failed to load SensorLink data: {strErrorMessage}");
                }
                else if (sensorLinks.Count == 0)
                {
                    logger.Write("No SensorLink data found, initializing sensor data...");
                }

                m_sensorLinks = sensorLinks ?? new List<SensorLink>();
            }
            #endregion

            #region SensorZone Key 생성

            if (m_dicSensorZoneKeys.Count == 0)
            {
                var sensorZones = dataManager.GetSelect()?.Select<Base.Model.Sensor.SensorZone>(null, out strErrorMessage)?.ToList();
    
                if (sensorZones == null || sensorZones.Count == 0)
                {
                    logger.Write(sensorZones == null 
                        ? $"fa_sensor_zone 테이블을 조회하는데 실패하였습니다.: {strErrorMessage}" 
                        : "fa_sensor_zone 테이블에 데이터가 없습니다.");
        
                    if (sensorZones == null)
                    {
                        return false;
                    }
                }
                
                Dictionary<string, string> dicSensorZones = new Dictionary<string, string>();

                foreach (Base.Model.Sensor.SensorZone sz in sensorZones)
                {
                    string key = GetDicSensorZoneKey(sz);
                    if (string.IsNullOrEmpty(key))
                        continue;
                    dicSensorZones.Add(key, sz.sensor_zone_sn.ToString());
                    m_dicSensorZones.Add(sz.sensor_zone_sn, sz);
                }
                
                m_dicSensorZoneKeys = dicSensorZones
                    .OrderBy(k => int.TryParse(k.Key.Split('_')[0], out var part1) ? part1 : int.MaxValue)
                    .ThenBy(k => int.TryParse(k.Key.Split('_')[1], out var part2) ? part2 : int.MaxValue)
                    .ToDictionary(k => k.Key, v => v.Value);
                
            }
            #endregion
            
            return true;
        }
        #endregion

        private string GetDicSensorZoneKey(Base.Model.Sensor.SensorZone sz)
        {
            if (sz == null || string.IsNullOrEmpty(sz.unq_key) || sz.sensor_sn < 1)
            {
                logger.Write("잘못된 형식의 SensorZone 데이터입니다. unq_key 또는 sensor_sn이 비어있거나 잘못되었습니다.");
                return null;
            }
    
            string[] unqKeyArr = sz.unq_key.Split('_');
            if (unqKeyArr.Length != 4)
            {
                logger.Write($@"[ERROR] 잘못된 unq_key 형식입니다. : {sz.unq_key}");
                return null;
            }

            return $@"{sz.eqp_zone_sn.ToString()}_{unqKeyArr[3]}";
        }

        /// <summary>
        /// 시스템 초기 물질 데이터를 Insert한다.
        /// 영진측 변경사항 있을때 ex_material_link 테이블 내의 Record삭제 후 이 메서드를 호출하여 신규 데이터 구축 목적
        /// </summary>
        /// <param name="strErrorMessage"></param>
        /// <returns></returns>
        private bool UpdateMaterialData(out string strErrorMessage)
        {
            strErrorMessage = string.Empty;

            try
            {
                // Get Sensor List
                ApiResponse<dynamic> sensorListRepsonse = webServiceManager.GetApiDataAsync<dynamic>(LastApiUrl).Result;
                
                if (!sensorListRepsonse.Success)
                {
                    strErrorMessage = sensorListRepsonse.Message;
                    return false;
                }
                
                List<dynamic> sensorList = sensorListRepsonse.Data.data.ToObject<List<dynamic>>();
                List<MaterialLink> materialLinks = new List<MaterialLink>();

                foreach (var sensor_dynamic_item in sensorList)
                {
                    if (sensor_dynamic_item == null)
                    {
                        logger.Write("Sensor JObject is null, skipping...");
                        continue;
                    }
                    var sensor = sensor_dynamic_item as Newtonsoft.Json.Linq.JObject;
                    if (sensor == null)
                    {
                        logger.Write("Sensor JObject is not valid, skipping...");
                        continue;
                    }
                    MaterialLink materialLink = new MaterialLink();
                    materialLink.sys_op_sensor_code_idx = sensor.Value<int>("sys_op_sensor_code_idx");
                    materialLink.sensor_name_kor = sensor.Value<string>("sensor_name_kor");
                    materialLink.sensor_name_eng = sensor.Value<string>("sensor_name_eng");
                    materialLink.sensor_unique_id = sensor.Value<int>("sensor_unique_id");
                    materialLink.sensor_unit = sensor.Value<string>("sensor_unit");
                    materialLink.limit_type = sensor.Value<int>("limit_type");
                    materialLink.limit_notice = sensor.Value<float>("limit_notice_bgn");
                    materialLink.limit_attention = sensor.Value<float>("limit_attention_bgn");
                    materialLink.limit_warning = sensor.Value<float>("limit_warning_bgn");
                    materialLinks.Add(materialLink);
                    
                }
                foreach (MaterialLink materialLink in materialLinks)
                {
                    if (!dataManager.GetCreate().Insert<MaterialLink>(materialLink, out strErrorMessage))
                    {
                        logger.Write($"Insert MaterialLink Error: {strErrorMessage}");
                    }
                }
                return true;
            }
            catch (Exception ex)
            {
                strErrorMessage = ex.Message;
                logger.Write($"UpdateSensorData Exception: {strErrorMessage}");
                return false;
            }
        }

        private bool UpdateSensorData(out string strErrorMessage)
        {
            strErrorMessage = string.Empty;
            try
            {
                ApiResponse<dynamic> lastDataResponse = webServiceManager.GetApiDataAsync<dynamic>(LastApiUrl).Result;
                if (!lastDataResponse.Success)
                {
                    strErrorMessage = lastDataResponse.Message;
                    return false;
                }
                
                List<dynamic> lastDataList = lastDataResponse.Data.data.ToObject<List<dynamic>>();
                if (lastDataList == null || lastDataList.Count == 0)
                {
                    strErrorMessage = "No sensor data found.";
                    return false;
                }
                
                Dictionary<string, string> dicSensorLastData = GetSensorLastData(lastDataList, out strErrorMessage);
                if (!ProcessSensorData(dicSensorLastData, out strErrorMessage))
                {
                    logger.Write($"ProcessSensorData Error: {strErrorMessage}");
                    return false;
                }
            }
            catch (Exception e)
            {
                logger.Write($"UpdateSensorData Exception: {e.Message}");
                strErrorMessage = e.Message;
                return false;
            }
            return true;
        }

        private bool ProcessSensorData(Dictionary<string, string> dicSensorLastData, out string strErrorMessage)
        {

            IDataManager cloneDataManager = dataManager.Clone();
            
            if (!cloneDataManager.BeginBatch(out strErrorMessage))
            {
                logger.Write($"BeginBatch Error: {strErrorMessage}");
                return false;
            }

            Dictionary<int, Current> dicCurrentAlarm = alarmManager.GetAlarmList();
            
            List<AlarmData> alarmDataList = new List<AlarmData>();

            int nMaxHistoryId = 1;

            IEnumerable<dynamic> nMaxIdResult = cloneDataManager.GetSelect().Select("SELECT MAX(sensor_his_no) FROM ex_sensor_his;", out strErrorMessage);

            var firstResult = nMaxIdResult.FirstOrDefault();
                
            nMaxHistoryId = firstResult?.max != null ? (int)firstResult.max : nMaxHistoryId;
            
            DateTime currentTime = DateTime.Now;
            DateTime current5MinBlock = new DateTime(currentTime.Year, currentTime.Month, currentTime.Day, 
                currentTime.Hour, (currentTime.Minute / 5) * 5, 0);
            
            StringBuilder updateBuilder = new StringBuilder();
            StringBuilder insertBuilder = new StringBuilder();
            
            foreach (var data in dicSensorLastData)
            {
                // 임시 : 대기, 기상센서 외에는 처리하지 않는다.
                if (!int.TryParse(data.Key.Split('_')[0], out int zoneId) || zoneId > 300)
                    continue;
                
                if (m_dicSensorZoneKeys.TryGetValue(data.Key, out string sensorZoneSn))
                {
                    int sensorUniqueId;
                    double sensorValue = 0;
                    string strWindDirection = string.Empty;
                    int nSensorZoneSn;

                    if (!int.TryParse(data.Key.Split('_')[1], out sensorUniqueId))
                    {
                        logger.Write("[Error] SensorDataManager.cs 잘못된 SensorUniqueID 형식 : " + data.Key);
                        continue;
                    }

                    if (sensorUniqueId != WindDirectionCode && !double.TryParse(data.Value, NumberStyles.Any, CultureInfo.CurrentCulture, out sensorValue))
                    {
                        logger.Write($"[Error] SensorDataManager.cs 잘못된 SensorValue 형식 : {data.Value}");
                        continue;
                    }
                    
                    if (sensorUniqueId == WindDirectionCode && data.Value.Length > 0 && !string.IsNullOrEmpty( data.Value ))
                        strWindDirection = data.Value;
                    
                    if (!int.TryParse(sensorZoneSn, out nSensorZoneSn))
                    {
                        logger.Write($"[Error] SensorDataManager.cs 잘못된 SensorZoneSn 형식 : {sensorZoneSn}");
                        continue;
                    }
                    
                    // 이력을 남겨야 하는 센서면 ex_sensor_his 테이블에 추가
                    if (int.TryParse(data.Key.Split('_')[0], out int zoneSn))
                    {
                        if (!(m_lastInsertTime >= current5MinBlock) && zoneSn >= 200 && zoneSn <= 299 && DateTime.Now.Minute % 5 == 0)
                        {
                            string insertHistoryQuery = "";
                            
                            if (sensorUniqueId == WindDirectionCode)
                            {
                                insertHistoryQuery = $@"
                                                    Insert Into {SensorHistory.TableName} 
                                                        ({SensorHistory.Fields.sensor_his_no},
                                                         {SensorHistory.Fields.sensor_sn},
                                                         {SensorHistory.Fields.sensor_value},
                                                         {SensorHistory.Fields.his_timestamp})
                                                    Values 
                                                        ({nMaxHistoryId + 1},
                                                         {nSensorZoneSn},
                                                         '{strWindDirection}',
                                                         '{DateTime.Now.ToString("yyyy-MM-dd HH:mm:ss")}');
                                                ";
                                insertBuilder.AppendLine(insertHistoryQuery);
                            }
                            else
                            {
                                insertHistoryQuery = $@"
                                                    Insert Into {SensorHistory.TableName} 
                                                        ({SensorHistory.Fields.sensor_his_no},
                                                         {SensorHistory.Fields.sensor_sn},
                                                         {SensorHistory.Fields.sensor_value},
                                                         {SensorHistory.Fields.his_timestamp})
                                                    Values 
                                                        ({nMaxHistoryId + 1},
                                                         {nSensorZoneSn},
                                                         '{sensorValue}',
                                                         '{DateTime.Now.ToString("yyyy-MM-dd HH:mm:ss")}');
                                                ";
                                insertBuilder.AppendLine(insertHistoryQuery);
                            }
                    
                            nMaxHistoryId++;

                        }
                    }
                    
                    string updateQuery =
                        $@"
                            UPDATE {Material.TableName} 
                            SET {Material.Fields.cur_data} = '{data.Value}' 
                            WHERE {Material.Fields.sensor_zone_sn} = {sensorZoneSn};
                        ";
                    
                    updateBuilder.AppendLine(updateQuery);
                    
                    // 업데이트 이후에 알람처리
                    MaterialLink materialLink = m_materialLinks.FirstOrDefault(m => m.sensor_unique_id == sensorUniqueId);
                    if (materialLink == null)
                    {
                        logger.Write($"MaterialLink not found for sensor_unique_id: {sensorUniqueId}");
                        continue;
                    }
                    
                    SensorZone sensorZone = m_dicSensorZones[nSensorZoneSn];
                    if (sensorZone == null)
                    {
                        logger.Write($"SensorZone not found for sensor_zone_sn: {sensorZoneSn}");
                        continue;
                    }
                    
                    if (!ProcessAlarmLogic(dicCurrentAlarm, sensorZone, materialLink, sensorValue, alarmDataList))
                    {
                        logger.Write($"ProcessAlarmLogic Error: (sensor_zone_sn : {sensorZone.sensor_zone_sn})에 대한 알람데이터를 생성할 수 없습니다. SensorDataManager.cs line: 482");
                    }
                }
            }

            if (updateBuilder.Length > 0)
            {
                if (!cloneDataManager.GetDBManager().Excute(updateBuilder.ToString(), out strErrorMessage))
                {
                    logger.Write($"Failed to execute update query: {strErrorMessage}");
                    cloneDataManager.BatchRollback(out strErrorMessage);
                    return false;
                }           
            }

            if (insertBuilder.Length > 0)
            {
                if (!cloneDataManager.GetDBManager().Excute(insertBuilder.ToString(), out strErrorMessage))
                {
                    logger.Write($"Failed to execute insert query: {strErrorMessage}");
                    logger.Write(insertBuilder.ToString());
                    cloneDataManager.BatchRollback(out strErrorMessage);
                    return false;
                }           
            }
            
            m_lastInsertTime = current5MinBlock;
            
            if (!cloneDataManager.BatchCommit(out strErrorMessage))
            {
                cloneDataManager.BatchRollback(out strErrorMessage);
                logger.Write($"Failed to commit batch: {strErrorMessage}");
                return false;
            }
            
            if (alarmDataList.Count > 0)
            {
                if (!ProcessSendAlarm(alarmDataList, out strErrorMessage))
                {
                    logger.Write($"SendAlarmData Error: {strErrorMessage}");
                    return false;
                }
            }

            strErrorMessage = string.Empty;
            return true;
        }
        
        /// <summary>
        /// 알람 로직 처리 (발송 대상인지 아닌지 판별하여 알람 발송 리스트에 추가한다.
        /// </summary>
        /// <param name="dicCurrentAlarm"> 현재 알람 목록 </param>
        /// <param name="sensorZone"> 대상 센서 정보 </param>
        /// <param name="materialLink"> 연계 물질 항목 </param>
        private bool ProcessAlarmLogic(Dictionary<int, Current> dicCurrentAlarm, SensorZone sensorZone, MaterialLink materialLink, double sensorValue, List<AlarmData> alarmDataList)
        {
            if (materialLink.limit_type == (int)SensorConstant.SensorDetectType.None)
                return true;
            
            int alarmLevel = GetAlarmLevel(sensorValue, materialLink);

            string strOptionConditions = $@"{Option.Fields.prop_name} Like '%{IsUsableEventSensor}%'
                                        And {Option.Fields.prop_name} Not Like '%Default%'";
            List<Option> sysOptions = dataManager.GetSelect().Select<Option>(strOptionConditions, out string strErrorMessage)?.ToList();
            
            // m_sensorLinks의 요소중 m_sensorLinks[i].zone_sn과 sensorZone 파라미터의 sensorZone.eqp_zone_sn 값이 같은 요소를 찾는다.
            SensorLink matchingSensorLink = m_sensorLinks.FirstOrDefault(sl => sl.zone_sn == sensorZone.eqp_zone_sn);

            if (matchingSensorLink == null)
            {
                logger.Write($"SensorLink not found for zone_sn: {sensorZone.eqp_zone_sn}");
                return false;
            }

            if (matchingSensorLink.sensor_type_idx != (int)SensorConstant.SensorTypeIdx.Weather && !IsActiveSensor(matchingSensorLink, sysOptions))
            {
                logger.Write($@"알람여부가 비활성화 되어있습니다. 옵션 테이블을 확인해주세요.");
                return true;
            }
    
            // 알람 레벨이 2 이하면 즉시 반환
            if (alarmLevel <= 2)
                return true;
    
            // 이전 알람 확인 및 처리
            bool shouldSendAlarm = !dicCurrentAlarm.TryGetValue(sensorZone.sensor_zone_sn, out Current previousAlarm) ||
                                    previousAlarm == null ||
                                    alarmLevel != previousAlarm.alarm_level;
    
            if (shouldSendAlarm)
            {
                alarmDataList.Add(
                    new AlarmData(
                    sensorZone.sensor_zone_sn,
                    sensorZone.sensor_ty_code,
                    1,
                    alarmLevel)
                    );
            }
            return true;
        }

        private bool IsActiveSensor(SensorLink sensorLink, List<Option> sysOptions)
        {
            int sensorTypeIdx = sensorLink.sensor_type_idx;
            
            if (sensorTypeIdx == 0)
                return false;
            
            Dictionary<int, bool> isUsableSensorType = new Dictionary<int, bool>();

            foreach (Option option in sysOptions)
            {
                string[] optionValues = option.prop_name.Split('/');
                if (optionValues.Length < 2) continue;
    
                string targetSensorType = optionValues[1].Replace("UseReceive", string.Empty);
    
                if (SensorTypeMapping.TryGetValue(targetSensorType, out int idx))
                {
                    isUsableSensorType[idx] = option.prop_value == "true"; // Add 대신 인덱서 사용 (중복 처리)
                }
            }
            
            return isUsableSensorType.TryGetValue(sensorTypeIdx, out bool isUsable) && isUsable;

        }


        
        /// <summary>
        /// 알람 발송 총괄 메서드
        /// </summary>
        /// <param name="alarmDataList"></param>
        /// <param name="strErrorMessage"></param>
        /// <returns></returns>
        private bool ProcessSendAlarm(List<AlarmData> alarmDataList, out string strErrorMessage)
        {
            strErrorMessage = string.Empty;
            
            // 메서드 진입전 유효성 체크를 하지만 한번더 확인한다.
            if (alarmDataList == null || alarmDataList.Count == 0)
            {
                strErrorMessage = "비정상적인 알람 정보입니다. SensorDataManager.cs line: 825 ";
                return false;
            }
            
            IEnumerable<Current> currentAlarmList = dataManager.GetSelect().Select<Current>(null, out strErrorMessage);

            if (currentAlarmList == null)
            {
                strErrorMessage = "알람 데이터 조회에 실패했습니다. SensorDataManager.cs ProcessSendAlarm : " + strErrorMessage;
                return false;
            }
            
            List<Current> currentAlarms = currentAlarmList.ToList();
            
            foreach(AlarmData alarmData in alarmDataList)
            {
                if (currentAlarms.ToList().Find(ca => ca.sensor_zone_sn == alarmData.SensorZoneNo) != null)
                {
                    continue;
                }
                
                string strJson = alarmManager.CreateAlarmJson(
                    alarmData.SensorType, alarmData.SensorZoneNo,
                    alarmData.SensorData, alarmData.AlarmDepth
                );
                
                if (string.IsNullOrEmpty(strJson))
                {
                    strErrorMessage = @$"알람 JSON 생성에 실패했습니다. (ZoneNo: {alarmData.SensorZoneNo}, Type: {alarmData.SensorType})";
                    logger.Write(strErrorMessage);
                    continue;
                }
                
                if (!alarmManager.SendSensorAlarm(strJson))
                {
                    strErrorMessage = $"Failed to send alarm. ZoneNo: {alarmData.SensorZoneNo}, JsonData: {strJson}";
                    logger.Write($"AlarmManager.SendAlarmData Error: {strErrorMessage}");
                    return false;
                }
            }
            
            return true;
        }

        /// <summary>
        /// 구성 Dictionary &lt;string, string&gt; key : (node_id)_(sensor_code), value : (sensor_value)
        /// </summary>
        /// <param name="jObjList"></param>
        /// <param name="strErrorMessage"></param>
        /// <returns></returns>
        private Dictionary<string, string> GetSensorLastData(List<dynamic> sensorData, out string errorMessage)
        {
            var result = new Dictionary<string, string>();
            
            for (int i = 0; i < sensorData.Count; i++)
            {
                var jObject = (JObject)sensorData[i];
                string idValue = jObject["id"]?.ToString();
                string sensorCategoryValue = jObject["category_value"]?.ToString();
                
                if (string.IsNullOrEmpty(idValue) || string.IsNullOrEmpty(sensorCategoryValue))
                    continue;
                
                if (System.Text.RegularExpressions.Regex.IsMatch(idValue, @"^\d+$"))
                    continue;
                
                int nIdValue = int.Parse(System.Text.RegularExpressions.Regex.Replace(idValue, @"[^\d]", ""));
                int nSensorCategoryValue = int.Parse(sensorCategoryValue);
                
                int nId = nSensorCategoryValue * 100 + nIdValue;
                sensorData[i]["id"] = nId.ToString();
            }

            List<SensorLastData> sensorLastDataList = sensorData
                .Select(data => ((JObject)data).ToObject<SensorLastData>())
                .Where(data => ValidateSensorData(data, out _))
                .ToList();

            foreach (var data in sensorLastDataList)
            {
                AddSensorDataToDictionary(data, result);
            }
            errorMessage = string.Empty;
            return result;
        }

        
        private void AddSensorDataToDictionary(SensorLastData data, Dictionary<string, string> dictionary)
        {
            if (!string.IsNullOrEmpty(data.wind_dir))
            {
                dictionary[$"{data.id}_{WindDirectionCode.ToString()}"] = data.wind_dir;
            }
            for (int i = 0; i < data.sensor_code.Count; i++)
            {
                var key = $"{data.id.ToString()}_{data.sensor_code[i].ToString()}";
                var value = data.value[i].ToString(CultureInfo.CurrentCulture);
                if (!dictionary.ContainsKey(key))
                {
                    if (key.Contains(WindDirectionCode.ToString()))
                        continue;
                    
                    dictionary[key] = value;
                }
                else
                {
                    if (key.Contains(WindDirectionCode.ToString()))
                        continue; // 이미 data.wind_dir이 추가된 상태
                    
                    // 나머지 중복 key-value는 무시한다.
                }
            }
        }

        
        /// <summary>
        /// Api로 전달 받은 데이터에서 물질 종류 갯수와 수치 데이터 갯수가 맞는지 판별한다.
        /// </summary>
        /// <param name="data"></param>
        /// <param name="strErrorMessage"></param>
        /// <returns></returns>
        private bool ValidateSensorData(SensorLastData data, out string strErrorMessage)
        {
            if (data.sensor_code.Count != data.value.Count)
            {
                strErrorMessage = $"Sensor code and value count mismatch for sensor ID: {data.id}.";
                return false;
            }
            strErrorMessage = string.Empty;
            return true;
        }

        private int GetAlarmLevel(double value, MaterialLink materialLink)
        {
            if (materialLink.limit_notice == 0 && materialLink.limit_attention == 0 && materialLink.limit_warning == 0)
                return 1;
            
            // 포항은 limit_type이 Normal인 경우만 존재.
            int alarmLevel = 1;
            if (materialLink.limit_type == (int)SensorConstant.SensorDetectType.Normal)
            {
                if (value > materialLink.limit_notice)
                    alarmLevel++;
                if (value > materialLink.limit_attention)
                    alarmLevel++;
                if (value > materialLink.limit_warning)
                    alarmLevel++;
            }
            
            return alarmLevel;
        }

    }
    
    /// <summary>
    /// 영진 제공 최신 데이터 클론 포맷
    /// </summary>
    public class SensorLastData
    {
        public int id { get; set; }
        public string category_name { get; set; }
        public string category_value { get; set; }
        public string xpos { get; set; }
        public string ypos { get; set; }
        public string name { get; set; }
        public string addr { get; set; }
        public List<string> grade { get; set; }
        public List<int> sensor_code { get; set; }
        public List<string> sensor_name { get; set; }
        public string wind_dir { get; set; } // 실제 타입에 맞게 변경 가능 (예: string, double?)
        public List<double> value { get; set; }
        public List<string> intime { get; set; }
    }
    
}