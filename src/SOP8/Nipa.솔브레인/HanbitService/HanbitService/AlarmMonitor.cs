using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Net.Http;
using System.Text;
using System.Threading;
using dnsDapperDBUtil.DataAccessLayer.IDAL;

using HistSensorZone = Base.Model.History.SensorZone;
using HistSensorReaction = Base.Model.History.SensorReaction;
using HistSensorZoneDetail = Base.Model.History.SensorZoneDetail;
using SenSensorZone = Base.Model.Sensor.SensorZone;
using SenSensor = Base.Model.Sensor.Sensor;
using SpZone = Base.Model.Spatial.Zone;
using SpBuilding = Base.Model.Spatial.Building;
using SpBuildingGroup = Base.Model.Spatial.BuildingGroup;
using SpEquipmentZone = Base.Model.Spatial.EquipmentZone;
using SpEquipmentZoneLinkedZone = Base.Model.Spatial.EquipmentZoneLinkedZone;

namespace HanbitService
{
    public class AlarmMonitor
    {
        private IDataManager m_dataManager;
        private string m_strApiUrl;
        private string m_strLogFolder;
        private int m_nSiteNo;
        private System.Threading.Timer m_timer;
        private int m_nLastProcessedReactionSn = 0;
        private bool m_bFirstLoad = true;
        private readonly object m_lockObj = new object();
        private static readonly HttpClient s_httpClient = new HttpClient();
        private const int POLL_INTERVAL_MS = 1000;
        private const int FIRE_ALARM_TYPE_CODE = 300300;

        public AlarmMonitor()
        {
            SetConfig();
            LoadLastProcessedSn();
        }

        private void SetConfig()
        {
            string strDbType = System.Configuration.ConfigurationManager.AppSettings["DbType"];
            string strDbHost = System.Configuration.ConfigurationManager.AppSettings["DbHost"];
            string strDbName = System.Configuration.ConfigurationManager.AppSettings["DbName"];
            string strDbId = System.Configuration.ConfigurationManager.AppSettings["DbId"];
            string strDbPw = System.Configuration.ConfigurationManager.AppSettings["DbPw"];
            m_strLogFolder = System.Configuration.ConfigurationManager.AppSettings["LogFolder"];
            string strSiteNo = System.Configuration.ConfigurationManager.AppSettings["SiteNo"];
            m_strApiUrl = System.Configuration.ConfigurationManager.AppSettings["ApiUrl"];

            if (strSiteNo != null)
                int.TryParse(strSiteNo, out m_nSiteNo);

            int dbType;
            if (strDbType != null && int.TryParse(strDbType, out dbType))
            {
                string dbId = dnsDapperDBUtil.AES256Cipher.AES_decrypt(strDbId);
                string dbPw = dnsDapperDBUtil.AES256Cipher.AES_decrypt(strDbPw);
                m_dataManager = new dnsDapperDBUtil.DataAccessLayer.DAL.DataManager(dbType, strDbHost, strDbName, dbId, dbPw);
            }
        }

        private string GetLogFilePath()
        {
            if (!Directory.Exists(m_strLogFolder))
                Directory.CreateDirectory(m_strLogFolder);
            return Path.Combine(m_strLogFolder, "HanbitAlarmLog.txt");
        }

        private void LoadLastProcessedSn()
        {
            string logPath = GetLogFilePath();
            if (!File.Exists(logPath))
                return;

            string content = File.ReadAllText(logPath).Trim();
            if (int.TryParse(content, out int lastSn))
            {
                m_nLastProcessedReactionSn = lastSn;
                m_bFirstLoad = false;
            }
        }

        private void SaveLastProcessedSn()
        {
            string logPath = GetLogFilePath();
            File.WriteAllText(logPath, m_nLastProcessedReactionSn.ToString());
        }

        public void Start()
        {
            if (m_dataManager == null)
                return;

            m_timer = new System.Threading.Timer(PollAlarms, null, 0, POLL_INTERVAL_MS);
        }

        public void Stop()
        {
            m_timer?.Change(Timeout.Infinite, Timeout.Infinite);
            m_timer?.Dispose();
            m_timer = null;
        }

        private void PollAlarms(object state)
        {
            if (!Monitor.TryEnter(m_lockObj))
                return;

            try
            {
                ProcessNewReactions();
            }
            catch (Exception ex)
            {
                WriteErrorLog($"PollAlarms Error: {ex.Message}");
            }
            finally
            {
                Monitor.Exit(m_lockObj);
            }
        }

        private void ProcessNewReactions()
        {
            // 새로운 SensorReaction 레코드 조회 (마지막 처리한 sn 이후, 화재 알람만, 최신 10건)
            string strSQL = $@"SELECT * FROM (
                    SELECT TOP 10
                        sr.{HistSensorReaction.Fields.sensor_react_hist_sn},
                        sr.{HistSensorReaction.Fields.sensor_zone_hist_sn},
                        sr.{HistSensorReaction.Fields.react_ty_code},
                        sr.{HistSensorReaction.Fields.tm},
                        sr.{HistSensorReaction.Fields.mssage},
                        sz.{HistSensorZone.Fields.tm} AS alarm_tm,
                        sz.{HistSensorZone.Fields.zone_sn} AS hist_zone_sn
                    FROM {HistSensorReaction.TableName} sr
                    INNER JOIN {HistSensorZone.TableName} sz
                        ON sr.{HistSensorReaction.Fields.sensor_zone_hist_sn} = sz.{HistSensorZone.Fields.sensor_zone_hist_sn}
                    WHERE sr.{HistSensorReaction.Fields.sensor_react_hist_sn} > {m_nLastProcessedReactionSn}
                        AND sr.{HistSensorReaction.Fields.react_ty_code} IN (400200, 400221, 400250, 400264, 400299)
                        AND sz.{HistSensorZone.Fields.sensor_ty_code} = {FIRE_ALARM_TYPE_CODE}
                        AND sz.{HistSensorZone.Fields.site_sn} = {m_nSiteNo}
                    ORDER BY sr.{HistSensorReaction.Fields.sensor_react_hist_sn} DESC
                ) t ORDER BY t.{HistSensorReaction.Fields.sensor_react_hist_sn}";

            IEnumerable<dynamic> reactions = m_dataManager.GetSelect().Select(strSQL, out string strErrMsg);

            if (reactions == null)
                return;

            DateTime dtNow = DateTime.Now;

            foreach (dynamic reaction in reactions)
            {
                int reactionSn = (int)reaction.sensor_react_hist_sn;
                int sensorZoneHistSn = (int)reaction.sensor_zone_hist_sn;
                int reactTyCode = (int)reaction.react_ty_code;
                DateTime reactionTm = (DateTime)reaction.tm;
                string message = reaction.mssage as string;

                bool isAlarm = (reactTyCode == 400200);

                // 최초 로딩(로그 파일 없음)이면 복구 신호는 무시 (알람을 보낸 적이 없으므로)
                if (m_bFirstLoad && !isAlarm)
                {
                    m_nLastProcessedReactionSn = reactionSn;
                    SaveLastProcessedSn();
                    continue;
                }

                // 1분 이내 알람인지 확인 (복구는 항상 전달)
                TimeSpan timeDiff = dtNow - reactionTm;
                if (isAlarm && timeDiff.TotalMinutes > 1)
                {
                    // 1분 초과된 알람 발생 이벤트는 스킵
                    m_nLastProcessedReactionSn = reactionSn;
                    SaveLastProcessedSn();
                    continue;
                }

                // 알람 상세 정보 조회
                var alarmData = GetAlarmDetail(sensorZoneHistSn, reactionTm, isAlarm, message);

                if (alarmData != null)
                {
                    bool sent = SendAlarmToApi(alarmData);
                    if (sent)
                    {
                        m_nLastProcessedReactionSn = reactionSn;
                        m_bFirstLoad = false;
                        SaveLastProcessedSn();
                    }
                }
                else
                {
                    // 상세 정보를 가져올 수 없는 경우에도 건너뛰기
                    m_nLastProcessedReactionSn = reactionSn;
                    SaveLastProcessedSn();
                }
            }
        }

        private AlarmData GetAlarmDetail(int sensorZoneHistSn, DateTime timestamp, bool isAlarm, string message)
        {
            string strSQL = $@"SELECT
                    hz.{HistSensorZone.Fields.sensor_zone_hist_sn},
                    hz.{HistSensorZone.Fields.tm},
                    ssz.{SenSensorZone.Fields.sensor_zone_sn},
                    ssz.{SenSensorZone.Fields.sensor_sn},
                    ssz.{SenSensorZone.Fields.sensor_sub_ty_no},
                    s.{SenSensor.Fields.sensor_name},
                    s.{SenSensor.Fields.manual_yn},
                    s.{SenSensor.Fields.zone_sn} AS sensor_zone_sn,
                    z.{SpZone.Fields.zone_sn} AS floor_zone_sn,
                    z.{SpZone.Fields.name} AS floor_name,
                    z.{SpZone.Fields.buld_sn},
                    b.{SpBuilding.Fields.buld_sn} AS building_sn,
                    b.{SpBuilding.Fields.name} AS building_name,
                    b.{SpBuilding.Fields.buld_group_sn},
                    bg.{SpBuildingGroup.Fields.buld_group_sn} AS bg_sn,
                    bg.{SpBuildingGroup.Fields.name} AS bg_name
                FROM {HistSensorZone.TableName} hz
                INNER JOIN {HistSensorZoneDetail.TableName} hzd
                    ON hz.{HistSensorZone.Fields.sensor_zone_hist_sn} = hzd.{HistSensorZoneDetail.Fields.sensor_zone_hist_sn}
                INNER JOIN {SenSensorZone.TableName} ssz
                    ON hzd.{HistSensorZoneDetail.Fields.sensor_zone_sn} = ssz.{SenSensorZone.Fields.sensor_zone_sn}
                INNER JOIN {SenSensor.TableName} s
                    ON ssz.{SenSensorZone.Fields.sensor_sn} = s.{SenSensor.Fields.sensor_sn}
                INNER JOIN {SpZone.TableName} z
                    ON s.{SenSensor.Fields.zone_sn} = z.{SpZone.Fields.zone_sn}
                LEFT JOIN {SpBuilding.TableName} b
                    ON z.{SpZone.Fields.buld_sn} = b.{SpBuilding.Fields.buld_sn}
                LEFT JOIN {SpBuildingGroup.TableName} bg
                    ON b.{SpBuilding.Fields.buld_group_sn} = bg.{SpBuildingGroup.Fields.buld_group_sn}
                WHERE hz.{HistSensorZone.Fields.sensor_zone_hist_sn} = {sensorZoneHistSn}";

            IEnumerable<dynamic> results = m_dataManager.GetSelect().Select(strSQL, out string strErrMsg);
            if (results == null)
                return null;

            dynamic first = results.FirstOrDefault();
            if (first == null)
                return null;

            int sensorSn = (int)first.sensor_sn;
            int floorZoneSn = (int)first.floor_zone_sn;

            // EquipmentZone 조회
            int? equipZoneId = null;
            string equipZoneName = null;
            string eqpSQL = $@"SELECT
                    ez.{SpEquipmentZone.Fields.eqp_zone_sn},
                    ez.{SpEquipmentZone.Fields.name}
                FROM {SpEquipmentZoneLinkedZone.TableName} ezlz
                INNER JOIN {SpEquipmentZone.TableName} ez
                    ON ezlz.{SpEquipmentZoneLinkedZone.Fields.eqp_zone_sn} = ez.{SpEquipmentZone.Fields.eqp_zone_sn}
                WHERE ezlz.{SpEquipmentZoneLinkedZone.Fields.zone_sn} = {floorZoneSn}";

            IEnumerable<dynamic> eqpResults = m_dataManager.GetSelect().Select(eqpSQL, out string strEqpErrMsg);
            if (eqpResults != null)
            {
                dynamic eqpFirst = eqpResults.FirstOrDefault();
                if (eqpFirst != null)
                {
                    equipZoneId = (int)eqpFirst.eqp_zone_sn;
                    equipZoneName = eqpFirst.name as string;
                }
            }

            // sensorType 결정
            int? sensorSubTyNo = first.sensor_sub_ty_no as int?;
            string sensorType = null;
            if (sensorSubTyNo.HasValue)
            {
                switch (sensorSubTyNo.Value)
                {
                    case 0: sensorType = "열감지기"; break;
                    case 1: sensorType = "연기감지기"; break;
                    case 2: sensorType = "불꽃감지기"; break;
                }
            }

            var alarmData = new AlarmData
            {
                alarmCode = sensorZoneHistSn,
                timestamp = timestamp.ToString("yyyy-MM-dd HH:mm:ss"),
                floorID = floorZoneSn,
                floorName = first.floor_name as string,
                sensorID = sensorSn,
                sensorName = first.sensor_name as string,
                sensorType = sensorType,
                isAlarm = isAlarm,
                isManual = (bool)first.manual_yn,
                message = message
            };

            // null이 아닌 경우만 설정
            int? buildingSn = first.building_sn as int?;
            if (buildingSn.HasValue)
            {
                alarmData.buildingID = buildingSn.Value;
                alarmData.buildingName = first.building_name as string;
            }

            int? bgSn = first.bg_sn as int?;
            if (bgSn.HasValue)
            {
                alarmData.buildingGroupID = bgSn.Value;
                alarmData.buildingGroupName = first.bg_name as string;
            }

            if (equipZoneId.HasValue)
            {
                alarmData.equipZoneID = equipZoneId.Value;
                alarmData.equipZoneName = equipZoneName;
            }

            return alarmData;
        }

        private bool SendAlarmToApi(AlarmData alarmData)
        {
            try
            {
                string json = alarmData.ToJson();
                var content = new StringContent(json, Encoding.UTF8, "application/json");
                var response = s_httpClient.PostAsync(m_strApiUrl, content).Result;

                WriteInfoLog($"API 전송 완료 - alarmCode: {alarmData.alarmCode}, isAlarm: {alarmData.isAlarm}, status: {response.StatusCode}");
                return true;
            }
            catch (Exception ex)
            {
                WriteErrorLog($"API 전송 실패 - alarmCode: {alarmData.alarmCode}, error: {ex.Message}");
                return false;
            }
        }

        private void WriteInfoLog(string msg)
        {
            WriteLog("INFO", msg);
        }

        private void WriteErrorLog(string msg)
        {
            WriteLog("ERROR", msg);
        }

        private void WriteLog(string level, string msg)
        {
            try
            {
                if (!Directory.Exists(m_strLogFolder))
                    Directory.CreateDirectory(m_strLogFolder);

                string logPath = Path.Combine(m_strLogFolder, $"HanbitService_{DateTime.Now:yyyyMMdd}.log");
                string logLine = $"[{DateTime.Now:yyyy-MM-dd HH:mm:ss}] [{level}] {msg}";
                File.AppendAllText(logPath, logLine + Environment.NewLine);
            }
            catch { }
        }
    }
}
