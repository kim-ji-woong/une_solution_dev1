using Base.Model.Sensor;
using dnsDapperDBUtil.DataAccessLayer.DAL;
using Soulbrain.Model.Facility;
using SoulbrainWebAPIServer.Model.UniAETModels;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Threading.Tasks;

namespace SoulbrainWebAPIServer.Managers.UniAETAPIManagers
{
    public class UniAETManager
    {
        DataManager m_dataManager;
        string m_strSOPWebServerUrl;

        // 초순수, 전력
        DataManager m_dataManager_power;
        DataManager m_dataManager_facility;
        string m_strSOPWebServerUrl_Power;
        string m_strSOPWebServerUrl_Facility;

        AlarmManager m_alarmManager;

        public static int SENSOR_SUB_TYPE_PRESV_REAL = 276;
        public static int SENSOR_SUB_TYPE_POWER_REAL = 277;
        public static int SENSOR_SUB_TYPE_POWER_ANALYS = 278;

        private const int STATUS_NORMAL = 0;
        private const string LOG_TAG = "UniAET";

        private Logger Logger = new Logger(LOG_TAG);

        public UniAETManager(DataManager dataManager, DataManager dataManager_power, DataManager dataManager_facility, string sopWebServerUrl, string strSOPWebServerUrl_Power, string strSOPWebServerUrl_Facility)
        {
            m_dataManager = dataManager;
            m_strSOPWebServerUrl = sopWebServerUrl;

            // 초순수, 전력
            m_dataManager_power = dataManager_power;
            m_dataManager_facility = dataManager_facility;

            m_strSOPWebServerUrl_Power = strSOPWebServerUrl_Power;
            m_strSOPWebServerUrl_Facility = strSOPWebServerUrl_Facility;

            m_alarmManager = new AlarmManager();
        }

        public ResponseUniAET ReadIngestData(RequestIngest req, bool isCheckMesure)
        {
            ResponseUniAET res = new ResponseUniAET();

            try
            {
                // 먼저 fclty_id 값을 이용해서 fclty_presv_sn 값을 찾고 
                string strConditions = $"{FacilityPresv.Fields.fclty_id} = '{req.facility_id}'";

                FacilityPresv presv = m_dataManager.GetSelect().SelectFirst<FacilityPresv>(strConditions, out string strErrMsg);
                if (presv == null)
                {
                    throw new ApplicationException($"SelectFirst FacilityPresv Error({req.facility_id}): " + strErrMsg);                    
                }

                if (req.data.Count == 0)
                {
                    throw new ApplicationException("data 배열 값이 존재하지 않습니다.");
                }

                foreach (IngestDetail detail in req.data)
                {                   
                    // his_fclty_presv 값 추가
                    Soulbrain.Model.History.FacilityPresv presvHistory = new Soulbrain.Model.History.FacilityPresv();
                    presvHistory.fclty_presv_sn = presv.fclty_presv_sn;
                    presvHistory.fclty_id = req.facility_id;
                    presvHistory.mesure_id = detail.measurement_id;

                    //presvHistory.mesure_tm =  detail.ts;
                    if (DateTime.TryParse(detail.ts, out DateTime dateTime))
                        presvHistory.mesure_tm = dateTime;
                    else
                    {
                        throw new ApplicationException("data ts 값이 올바르지 않습니다. ts: " + detail.ts);
                    }

                    presvHistory.mesure_value = detail.value;
                    presvHistory.mesure_uom = detail.unit;
                    presvHistory.data_ty_optn_code = (int)dnsDataSoulbrain.CommonCode.CodeType.FacilityDataType;
                    presvHistory.data_ty_code = dnsDataSoulbrain.CommonCode.FacilityData.FacilityDataType.Measurement;
                    presvHistory.hist_tm = DateTime.Now;

                    if (m_dataManager.GetCreate().Insert<Soulbrain.Model.History.FacilityPresv>(presvHistory, out strErrMsg) == false)
                    {
                        throw new ApplicationException("Insert History.FacilityPresv Error: " + strErrMsg);
                    }
                    else
                    {   // 초순수, 전력 설비 데이터 추가
                        Task.Run(() =>
                        {
                            if (m_dataManager_power != null && m_dataManager_power.GetCreate().Insert<Soulbrain.Model.History.FacilityPresv>(presvHistory, out strErrMsg) == false)
                            {
                                Logger.Write("[UniAETManager] Power FacilityPresv Insert Error " + presvHistory.mesure_id);
                            }

                            if (m_dataManager_facility != null && m_dataManager_facility.GetCreate().Insert<Soulbrain.Model.History.FacilityPresv>(presvHistory, out strErrMsg) == false)
                            {
                                Logger.Write("[UniAETManager] Facility FacilityPresv ReadIngestData CheckMesure " + presvHistory.mesure_id);
                            }
                        });
                    }

                    if (isCheckMesure)
                    {
                        Logger.Write("[UniAETManager] ReadIngestData CheckMesure " + presvHistory.mesure_id);
                    }
                }

                res.resultCode = (int)ResponseUniAET.HttpStatusCode.OK;
            }
            catch (Exception e)
            {
                Logger.Write("[UniAETManager] ReadIngestData " + e.Message);

                //res.Error = e.Message;
                res.resultCode = (int)HttpStatusCode.InternalServerError;
            }

            return res;
        }

        public ResponseUniAET ReadFcltyAnalysisData(RequestFcltyAnalysis req)
        {
            ResponseUniAET res = new ResponseUniAET();

            try
            {
                // 먼저 fclty_id 값을 이용해서 fclty_presv_sn 값을 찾고 
                string strConditions = $"{FacilityPresv.Fields.fclty_id} = '{req.facility_id}'";

                FacilityPresv presv = m_dataManager.GetSelect().SelectFirst<FacilityPresv>(strConditions, out string strErrMsg);
                if (presv == null)
                {
                    throw new ApplicationException($"SelectFirst FacilityPresv Error({req.facility_id}): " + strErrMsg);
                }

                // his_fclty_presv 값 추가
                Soulbrain.Model.History.FacilityPresv presvHistory = new Soulbrain.Model.History.FacilityPresv();
                presvHistory.fclty_presv_sn = presv.fclty_presv_sn;
                presvHistory.fclty_id = req.facility_id;
                presvHistory.mesure_id = req.measurement_id;

                //presvHistory.mesure_tm = req.data.ts;
                if (DateTime.TryParse(req.data.ts, out DateTime dateTime))
                    presvHistory.mesure_tm = dateTime;
                else
                {
                    throw new ApplicationException("data ts 값이 올바르지 않습니다. ts: " + req.data.ts);
                }

                presvHistory.mesure_value = req.data.value;
                presvHistory.mesure_uom = req.data.unit;
                presvHistory.data_ty_optn_code = (int)dnsDataSoulbrain.CommonCode.CodeType.FacilityDataType;
                presvHistory.data_ty_code = dnsDataSoulbrain.CommonCode.FacilityData.FacilityDataType.Prediction;

                //presvHistory.mesure_lim_level_1 = req.thresholds.status_0.range;
                //presvHistory.mesure_lim_level_2 = req.thresholds.status_1.range;
                //presvHistory.mesure_lim_level_3 = req.thresholds.status_2.range;
                //presvHistory.mesure_lim_level_4 = req.thresholds.status_3.range;
                //presvHistory.mesure_lim_level_5 = req.thresholds.status_4.range;
                if (req.thresholds.status_0.range != null && req.thresholds.status_1.range != null && req.thresholds.status_2.range != null && req.thresholds.status_3.range != null && req.thresholds.status_4.range != null)
                {
                    int nIdx1 = req.thresholds.status_0.range.IndexOf(" < ");
                    int nIdx2 = req.thresholds.status_1.range.IndexOf(" - ");
                    int nIdx3 = req.thresholds.status_2.range.IndexOf(" - ");
                    int nIdx4 = req.thresholds.status_3.range.IndexOf(" - ");
                    int nIdx5 = req.thresholds.status_4.range.IndexOf(" > ");

                    if (nIdx1 > 0 && nIdx2 > 0 && nIdx3 > 0 && nIdx4 > 0 && nIdx5 > 0)
                    {
                        string strLevel1 = req.thresholds.status_0.range.Substring(nIdx1 + 3);
                        string strLevel2 = req.thresholds.status_1.range.Substring(0, nIdx2);
                        string strLevel3 = req.thresholds.status_2.range.Substring(0, nIdx3);
                        string strLevel4 = req.thresholds.status_3.range.Substring(0, nIdx4);
                        string strLevel5 = req.thresholds.status_4.range.Substring(nIdx5 + 3);

                        if (double.TryParse(strLevel1, out double nLevel1) && double.TryParse(strLevel2, out double nLevel2) && double.TryParse(strLevel3, out double nLevel3) && double.TryParse(strLevel4, out double nLevel4) && double.TryParse(strLevel5, out double nLevel5))
                        {
                            presvHistory.mesure_lim_level_1 = nLevel1;
                            presvHistory.mesure_lim_level_2 = nLevel2;
                            presvHistory.mesure_lim_level_3 = nLevel3;
                            presvHistory.mesure_lim_level_4 = nLevel4;
                            presvHistory.mesure_lim_level_5 = nLevel5;
                        }
                    }
                }

                presvHistory.hist_tm = DateTime.Now;

                if (m_dataManager.GetCreate().Insert<Soulbrain.Model.History.FacilityPresv>(presvHistory, out strErrMsg) == false)
                {
                    throw new ApplicationException("Insert History.FacilityPresv Error: " + strErrMsg);
                }
                else
                {   // 초순수, 전력 설비 데이터 추가
                    Task.Run(() =>
                    {
                        if (m_dataManager_power != null && m_dataManager_power.GetCreate().Insert<Soulbrain.Model.History.FacilityPresv>(presvHistory, out strErrMsg) == false)
                        {
                            Logger.Write("[UniAETManager] Power ReadFcltyAnalysisData Insert Error " + presvHistory.mesure_id);
                        }

                        if (m_dataManager_facility != null && m_dataManager_facility.GetCreate().Insert<Soulbrain.Model.History.FacilityPresv>(presvHistory, out strErrMsg) == false)
                        {
                            Logger.Write("[UniAETManager] Facility ReadFcltyAnalysisData Insert Error " + presvHistory.mesure_id);
                        }
                    });
                }
                

                res.resultCode = (int)ResponseUniAET.HttpStatusCode.OK;
            }
            catch (Exception e)
            {
                Logger.Write("[UniAETManager] ReadFcltyAnalysisData " + e.Message);

                //res.Error = e.Message;
                res.resultCode = (int)HttpStatusCode.InternalServerError;
            }

            return res;
        }

        public ResponseUniAET RequestAlert(RequestFcltyAnalysis req, int nSubType)
        {
            ResponseUniAET res = new ResponseUniAET();

            try
            {
                // 먼저 fclty_id 값을 이용해서 fclty_presv_sn 값을 찾고 
                string strConditions = $"{FacilityPresv.Fields.fclty_id} = '{req.facility_id}'";

                FacilityPresv presv = m_dataManager.GetSelect().SelectFirst<FacilityPresv>(strConditions, out string strErrMsg);
                if (presv == null)
                {
                    throw new ApplicationException($"SelectFirst FacilityPresv Error({req.facility_id}): " + strErrMsg);
                }

                // 알람 신호 데이터 생성
                int nSensorType = dnsDataSoulbrain.CommonCode.SdmsSensor.SensorType.PredictAlarm;

                int? sensor_sn = presv.sensor_sn;
                if (sensor_sn == null)
                {
                    throw new ApplicationException("facility_id 값에 대한 sensor_sn 값이 존재하지 않습니다.");
                }

                int nAlarmDepth = req.data.status;
                if (nAlarmDepth == STATUS_NORMAL)
                {
                    throw new ApplicationException($"data status 값이 {STATUS_NORMAL} 입니다.");
                }

                //DateTime dtTimeStamp = req.data.ts;
                if (DateTime.TryParse(req.data.ts, out DateTime dtTimeStamp) == false)
                {
                    throw new ApplicationException("data ts 값이 올바르지 않습니다. ts: " + req.data.ts);
                }

                strConditions = $"{SensorZone.Fields.sensor_sn} = {sensor_sn} AND {SensorZone.Fields.sensor_sub_ty_no} = {nSubType}";

                SensorZone sz = m_dataManager.GetSelect().SelectFirst<SensorZone>(strConditions, out strErrMsg);
                if (sz == null)
                {
                    throw new ApplicationException($"sensor_sn 값에 대한 SensorZone 값이 존재하지 않습니다. sensor_sn: {sensor_sn}, sensor_sub_ty_no: {SENSOR_SUB_TYPE_PRESV_REAL}");
                }

                string strSignalUrl = GetSendAlarmSOPWebServerUrl(m_strSOPWebServerUrl, out strErrMsg);
                if (strSignalUrl == null)
                {
                    throw new ApplicationException($"GetSendAlarmSOPWebServerUrl Error: " + strErrMsg);
                }

                // 알람 신호 송신
                if (m_alarmManager.SendSensorAlarm(nSensorType, sz.sensor_zone_sn, true, null, strSignalUrl, nAlarmDepth, dtTimeStamp, out strErrMsg) == false)
                {
                    throw new ApplicationException($"SendSensorAlarm Error sensor_zone_sn: {sz.sensor_zone_sn}, URL: {strSignalUrl}, AlarmDepth: {nAlarmDepth}, Msg:" + strErrMsg);
                }
                else
                {
                    Logger.Write($"[UniAETManager] RequestFcltyAlert 알람 발생 name: {presv.fclty_presv_name}, facility_id: {req.facility_id}, measurement_id: {req.measurement_id}, sensor_zone_sn: {sz.sensor_zone_sn}, AlarmDepth: {nAlarmDepth}");

                    // 초순수, 전력 알람 발생
                    Task.Run(() =>
                    {
                        strSignalUrl = GetSendAlarmSOPWebServerUrl(m_strSOPWebServerUrl_Power, out strErrMsg);
                        if (strSignalUrl == null)
                            Logger.Write($"GetSendAlarmSOPWebServerUrl_Power Error: " + strErrMsg);
                        else
                        {
                            if (m_alarmManager.SendSensorAlarm(nSensorType, sz.sensor_zone_sn, true, null, strSignalUrl, nAlarmDepth, dtTimeStamp, out strErrMsg) == false)
                                Logger.Write($"SendSensorAlarm_Power Error sensor_zone_sn: {sz.sensor_zone_sn}, URL: {strSignalUrl}, AlarmDepth: {nAlarmDepth}, Msg:" + strErrMsg);
                        }

                        strSignalUrl = GetSendAlarmSOPWebServerUrl(m_strSOPWebServerUrl_Facility, out strErrMsg);
                        if (strSignalUrl == null)
                            Logger.Write($"GetSendAlarmSOPWebServerUrl_Facility Error: " + strErrMsg);
                        else
                        {
                            if (m_alarmManager.SendSensorAlarm(nSensorType, sz.sensor_zone_sn, true, null, strSignalUrl, nAlarmDepth, dtTimeStamp, out strErrMsg) == false)
                                Logger.Write($"SendSensorAlarm_Facility Error sensor_zone_sn: {sz.sensor_zone_sn}, URL: {strSignalUrl}, AlarmDepth: {nAlarmDepth}, Msg:" + strErrMsg);
                        }

                        
                    });


                }

                res.resultCode = (int)ResponseUniAET.HttpStatusCode.OK;
            }
            catch (Exception e)
            {
                Logger.Write("[UniAETManager] RequestAlert " + e.Message);

                //res.Error = e.Message;
                res.resultCode = (int)HttpStatusCode.InternalServerError;
            }

            return res;
        }

        public ResponseUniAET ReadPowerAnalysisData(RequestPowerAnalysis req)
        {
            ResponseUniAET res = new ResponseUniAET();

            try
            {
                if (req.data == null || req.data.Count == 0)
                {
                    throw new ApplicationException("req.data 데이터가 존재하지 않습니다.");
                }

                string? strfacility_ids = null;
                foreach (AnalysisDetailPower detailPower in req.data)
                {
                    if (strfacility_ids == null)
                        strfacility_ids = $"'{detailPower.facility_id}'";
                    else
                        strfacility_ids += $", '{detailPower.facility_id}'";
                }

                // 먼저 fclty_id 값을 이용해서 fclty_presv_sn 값을 찾고 
                string strConditions = $"{FacilityPresv.Fields.fclty_id} in ({strfacility_ids})";
                IEnumerable<FacilityPresv> _presvs = m_dataManager.GetSelect().Select<FacilityPresv>(strConditions, out string strErrMsg);
                if (_presvs == null)
                {
                    throw new ApplicationException($"SelectFirst FacilityPresv Error({strfacility_ids}): " + strErrMsg);
                }

                List<FacilityPresv> presvs = _presvs.ToList();

                // 오늘 전력 예측 데이터가 이미 들어온 경우 삭제 
                strConditions = $"{Soulbrain.Model.History.FacilityPresv.Fields.fclty_id} in ({strfacility_ids}) and {Soulbrain.Model.History.FacilityPresv.Fields.data_ty_code} = {dnsDataSoulbrain.CommonCode.FacilityData.FacilityDataType.Prediction} and {Soulbrain.Model.History.FacilityPresv.Fields.mesure_tm} >= '{DateTime.Today.ToString("yyyy-MM-dd 00:00:00")}' and {Soulbrain.Model.History.FacilityPresv.Fields.mesure_tm} <= '{DateTime.Today.ToString("yyyy-MM-dd 23:59:59")}'";
                Soulbrain.Model.History.FacilityPresv hisPresv = m_dataManager.GetSelect().SelectFirst<Soulbrain.Model.History.FacilityPresv>(strConditions, out strErrMsg);
                if (hisPresv != null)
                {
                    // 삭제 처리
                    if (m_dataManager.GetDelete().Delete<Soulbrain.Model.History.FacilityPresv>(strConditions, out strErrMsg) == false)
                    {
                        Logger.Write($"Today Power Delete FacilityPresv Error: " + strErrMsg);
                    }
                    else
                    {
                        Logger.Write($"Today Power Delete FacilityPresv Success");

                        string strConditions2 = strConditions;

                        // 초순수, 전력 데이터 삭제
                        Task.Run(() =>
                        {
                            // 전력 여부 확인 및 삭제
                            Soulbrain.Model.History.FacilityPresv hisPresv2 = m_dataManager_power.GetSelect().SelectFirst<Soulbrain.Model.History.FacilityPresv>(strConditions2, out strErrMsg);
                            if (hisPresv2 != null)
                            {
                                if (m_dataManager_power.GetDelete().Delete<Soulbrain.Model.History.FacilityPresv>(strConditions2, out strErrMsg) == false)
                                {
                                    Logger.Write($"Today Power Delete_power FacilityPresv Error: " + strErrMsg);
                                }
                                else
                                {
                                    Logger.Write($"Today Power Delete_power FacilityPresv Success");
                                }

                            }

                            // 설비 여부 확인 및 삭제
                            hisPresv2 = m_dataManager_facility.GetSelect().SelectFirst<Soulbrain.Model.History.FacilityPresv>(strConditions2, out strErrMsg);
                            if (hisPresv2 != null)
                            {
                                if (m_dataManager_facility.GetDelete().Delete<Soulbrain.Model.History.FacilityPresv>(strConditions2, out strErrMsg) == false)
                                {
                                    Logger.Write($"Today Power Delete_facility FacilityPresv Error: " + strErrMsg);
                                }
                                else
                                {
                                    Logger.Write($"Today Power Delete_facility FacilityPresv Success");
                                }
                            }
                        });
                    }                    
                }

                // 5일 전 설비예지보전 데이터 배치 삭제 (대량 삭제 시 30초 타임아웃 방지: TOP N 반복)
                DateTime date = DateTime.Today.AddDays(-5);
                string strTableName = new Soulbrain.Model.History.FacilityPresv().GetTableName();
                string strDeleteSQL = $"DELETE TOP (@nBatch) FROM {strTableName} " +
                                      $"WHERE {Soulbrain.Model.History.FacilityPresv.Fields.mesure_tm} < @cutoff; SELECT @@ROWCOUNT;";

                int nDeletedMain = DeleteOldFacilityPresvInBatches(m_dataManager, strDeleteSQL, date, "main");
                if (nDeletedMain > 0)
                {
                    // 초순수, 전력 DB도 동일 조건으로 배치 삭제 (기존 카스케이드 요구사항 유지)
                    Task.Run(() =>
                    {
                        DeleteOldFacilityPresvInBatches(m_dataManager_power, strDeleteSQL, date, "power");
                        DeleteOldFacilityPresvInBatches(m_dataManager_facility, strDeleteSQL, date, "facility");
                    });
                }


                foreach (AnalysisDetailPower detailPower in req.data)
                {
                    FacilityPresv? presv = presvs.Find(x => x.fclty_id == detailPower.facility_id);
                    if (presv == null)
                    {
                        Logger.Write($"[UniAETManager] ReadPowerAnalysisData facility_id 값과 일치하는 데이터가 존재하지 않습니다. ({detailPower.facility_id})");
                        continue;
                    }

                    int fclty_presv_sn = presv.fclty_presv_sn;
                    string fclty_id = detailPower.facility_id;
                    Thresholds thresholds = detailPower.thresholds;

                    if (detailPower.series == null || detailPower.series.Count == 0)
                    {
                        Logger.Write("[UniAETManager] ReadPowerAnalysisData series 데이터가 존재하지 않습니다.");
                        continue;
                    }

                    double? mesure_lim_level_1 = null;
                    double? mesure_lim_level_2 = null;
                    double? mesure_lim_level_3 = null;
                    double? mesure_lim_level_4 = null;
                    double? mesure_lim_level_5 = null;

                    if (detailPower.thresholds.status_0.range != null && detailPower.thresholds.status_1.range != null && detailPower.thresholds.status_2.range != null && detailPower.thresholds.status_3.range != null && detailPower.thresholds.status_4.range != null)
                    {
                        int nIdx1 = detailPower.thresholds.status_0.range.IndexOf(" < ");
                        int nIdx2 = detailPower.thresholds.status_1.range.IndexOf(" - ");
                        int nIdx3 = detailPower.thresholds.status_2.range.IndexOf(" - ");
                        int nIdx4 = detailPower.thresholds.status_3.range.IndexOf(" - ");
                        int nIdx5 = detailPower.thresholds.status_4.range.IndexOf(" > ");

                        if (nIdx1 > 0 && nIdx2 > 0 && nIdx3 > 0 && nIdx4 > 0 && nIdx5 > 0)
                        {
                            string strLevel1 = detailPower.thresholds.status_0.range.Substring(nIdx1 + 3);
                            string strLevel2 = detailPower.thresholds.status_1.range.Substring(0, nIdx2);
                            string strLevel3 = detailPower.thresholds.status_2.range.Substring(0, nIdx3);
                            string strLevel4 = detailPower.thresholds.status_3.range.Substring(0, nIdx4);
                            string strLevel5 = detailPower.thresholds.status_4.range.Substring(nIdx5 + 3);

                            if (double.TryParse(strLevel1, out double nLevel1) && double.TryParse(strLevel2, out double nLevel2) && double.TryParse(strLevel3, out double nLevel3) && double.TryParse(strLevel4, out double nLevel4) && double.TryParse(strLevel5, out double nLevel5))
                            {
                                mesure_lim_level_1 = nLevel1;
                                mesure_lim_level_2 = nLevel2;
                                mesure_lim_level_3 = nLevel3;
                                mesure_lim_level_4 = nLevel4;
                                mesure_lim_level_5 = nLevel5;
                            }
                        }
                    }

                    foreach (AnalysisDetail detail in detailPower.series)
                    {
                        // his_fclty_presv 값 추가
                        Soulbrain.Model.History.FacilityPresv presvHistory = new Soulbrain.Model.History.FacilityPresv();
                        presvHistory.fclty_presv_sn = presv.fclty_presv_sn;
                        presvHistory.fclty_id = detailPower.facility_id;
                        presvHistory.mesure_id = detailPower.measurement_id;

                        //presvHistory.mesure_tm = detail.ts;
                        if (DateTime.TryParse(detail.ts, out DateTime dateTime))
                            presvHistory.mesure_tm = dateTime;
                        else
                        {
                            throw new ApplicationException("series ts 값이 올바르지 않습니다. ts: " + detail.ts);
                        }

                        presvHistory.mesure_value = detail.value;
                        presvHistory.mesure_uom = detail.unit;

                        presvHistory.mesure_lim_level_1 = mesure_lim_level_1;
                        presvHistory.mesure_lim_level_2 = mesure_lim_level_2;
                        presvHistory.mesure_lim_level_3 = mesure_lim_level_3;
                        presvHistory.mesure_lim_level_4 = mesure_lim_level_4;
                        presvHistory.mesure_lim_level_5 = mesure_lim_level_5;

                        presvHistory.data_ty_optn_code = (int)dnsDataSoulbrain.CommonCode.CodeType.FacilityDataType;
                        presvHistory.data_ty_code = dnsDataSoulbrain.CommonCode.FacilityData.FacilityDataType.Prediction;
                        presvHistory.hist_tm = DateTime.Now;

                        if (m_dataManager.GetCreate().Insert<Soulbrain.Model.History.FacilityPresv>(presvHistory, out strErrMsg) == false)
                        {
                            Logger.Write("[UniAETManager] ReadPowerAnalysisData Insert History.FacilityPresv Error: " + strErrMsg);
                            continue;
                        }
                        else
                        {
                            // 초순수, 전력 DB 데이터 추가
                            Task.Run(() =>
                            {
                                if (m_dataManager_power != null && m_dataManager_power.GetCreate().Insert<Soulbrain.Model.History.FacilityPresv>(presvHistory, out strErrMsg) == false)
                                {
                                    Logger.Write("[UniAETManager] Power ReadFcltyAnalysisData Insert Error " + presvHistory.mesure_id);
                                }

                                if (m_dataManager_facility != null && m_dataManager_facility.GetCreate().Insert<Soulbrain.Model.History.FacilityPresv>(presvHistory, out strErrMsg) == false)
                                {
                                    Logger.Write("[UniAETManager] Facility ReadFcltyAnalysisData Insert Error " + presvHistory.mesure_id);
                                }
                            });
                        }                        
                    }
                }

                res.resultCode = (int)ResponseUniAET.HttpStatusCode.OK;
            }
            catch (Exception e)
            {
                Logger.Write("[UniAETManager] ReadPowerAnalysisData " + e.Message);

                //res.Error = e.Message;
                res.resultCode = (int)HttpStatusCode.InternalServerError;
            }

            return res;
        }

        /// <summary>
        /// his_fclty_presv에서 기준일 이전 데이터를 배치(1만 건)로 나눠 삭제한다.
        /// 단일 대량 DELETE는 라이브러리 고정 30초 CommandTimeout을 초과하므로 TOP N 반복으로 처리한다.
        /// dnsDapperDBUtil의 Excute는 삭제 건수를 반환하지 않아, Query&lt;int&gt; + SELECT @@ROWCOUNT로
        /// 배치별 삭제 건수를 받아 루프 종료를 판단한다.
        /// </summary>
        private int DeleteOldFacilityPresvInBatches(DataManager dataManager, string strDeleteSQL, DateTime cutoff, string strDbLabel)
        {
            const int nBatchSize = 10000;   // 배치당 삭제 건수 (각 배치가 30초 내 완료되도록)
            int nTotalDeleted = 0;

            // 1. 삭제 대상이 없어질 때까지 TOP N 반복 삭제
            while (true)
            {
                IEnumerable<int> retRows = dataManager.GetDBManager().Query<int>(
                    strDeleteSQL, new { nBatch = nBatchSize, cutoff = cutoff }, out string strErrMsg);

                // 1-1. 조회 실패 시 로그 남기고 중단 (조용한 실패 방지)
                if (retRows == null)
                {
                    Logger.Write($"Delete History FacilityPresv_{strDbLabel} Error: " + strErrMsg);
                    break;
                }

                int nDeleted = retRows.FirstOrDefault();
                nTotalDeleted += nDeleted;

                // 1-2. 이번 배치가 배치크기 미만이면 남은 대상 없음 → 종료
                if (nDeleted < nBatchSize) break;
            }

            // 2. 실제 삭제된 경우에만 성공 로그
            if (nTotalDeleted > 0)
            {
                Logger.Write($"Delete History FacilityPresv_{strDbLabel} Success ({nTotalDeleted}건)");
            }

            return nTotalDeleted;
        }

        private string GetSendAlarmSOPWebServerUrl(string strSOPWebServerUrl, out string strErrorMessage)
        {
            strErrorMessage = string.Empty;

            if (string.IsNullOrEmpty(strSOPWebServerUrl))
            {
                strErrorMessage = "SOP Web Server Url is null";
                return null;
            }

            if (m_strSOPWebServerUrl.EndsWith("/") == false)
                return m_strSOPWebServerUrl + "/api/Sensor/RequestSensorSignal";
            else
                return m_strSOPWebServerUrl + "api/Sensor/RequestSensorSignal";
        }
    }
}
