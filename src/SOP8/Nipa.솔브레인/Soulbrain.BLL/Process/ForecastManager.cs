using System;
using System.Collections.Generic;
using System.Linq;
using Base.Model.Sensor;
using dnsDapperDBUtil.DataAccessLayer.IDAL;
using dnsDataSoulbrain.CommonCode;
using NPOI.SS.Formula.Functions;
using Soulbrain.BLL.Request;
using Soulbrain.BLL.Response;

namespace Soulbrain.BLL.Process
{
    public class ForecastManager
    {
        private IDataManager m_dataManager = null;

        private const int PM10 = 270;
        private const int PM25 = 271;
        private const int CO2 = 272;
        private const int VOCS = 273;

        public ForecastManager(IDataManager dataManager)
        {
            m_dataManager = dataManager;
        }

        public ResponseDustForecastInfo RequestDustForecastInfo(RequestDustForecastInfo data)
        {
            DateTime dtNow = DateTime.Now;

            int minutesToAdd = 15 - (dtNow.Minute % 15);
            if (minutesToAdd == 0)
                minutesToAdd = 15; // 이미 15분 배수라면 다음 슬롯으로 이동

            DateTime dtTempNext = dtNow.AddMinutes(minutesToAdd);
            DateTime dtNextQuarter = new DateTime(dtTempNext.Year, dtTempNext.Month, dtTempNext.Day, dtTempNext.Hour, dtTempNext.Minute, 0, DateTimeKind.Unspecified);

            int minutesPastQuarter = dtNow.Minute % 15;

            DateTime dtTempPrev = dtNow.AddMinutes(-minutesPastQuarter);
            DateTime dtPrevQuarter = new DateTime(dtTempPrev.Year, dtTempPrev.Month, dtTempPrev.Day, dtTempPrev.Hour, dtTempPrev.Minute, 0, DateTimeKind.Unspecified);
            
            int facilitySn = GetFacilitySn(data.SensorSn, SdmsSensor.SensorType.FineDust);

            try
            {
                ResponseDustForecastInfo response = new ResponseDustForecastInfo(true, "");

                response.DustMeasurementForecasts = GetDustMeasurementForecast(facilitySn, data.SensorSubType, dtNextQuarter);
                response.DustMeasurementHistories = GetDustMeasurementHistories(facilitySn, data.SensorSubType, dtPrevQuarter);

                return response;
            }
            catch (Exception ex)
            {
                return new ResponseDustForecastInfo(false, ex.Message);
            }
        }

        private List<MaterialMeasurementForecast> GetDustMeasurementForecast(int sensorSn, int sensorSubType, DateTime forecastDate)
        {
            Model.Forecast.DustMeasurement.Fields field = GetDustMsrrFields(sensorSubType).ForecastField;

            string strQuery = $@"Select Top 5 
                                {Model.Forecast.DustMeasurement.Fields.tm},
                                {field.ToString()} as value
                                From {Model.Forecast.DustMeasurement.TableName}
                                Where (1=1) 
                                And {Model.Forecast.DustMeasurement.Fields.dust_msrr_sn} = {sensorSn}
                                Order By {Model.Forecast.DustMeasurement.Fields.tm} DESC;";

            IEnumerable<dynamic> results = m_dataManager.GetSelect().Select(strQuery, out string strErrorMessage);
            
            if (results == null)
                throw new Exception($@"예측치를 조회할 수 없습니다. ErrorMessage : {strErrorMessage} / SensorSn : {sensorSn}");

            List<MaterialMeasurementForecast> forecasts = new List<MaterialMeasurementForecast>();
            
            List<dynamic> list = results.ToList();
            List<MaterialMeasurementForecast> resultList = new List<MaterialMeasurementForecast>();
            foreach (dynamic o in list)
            {
                MaterialMeasurementForecast mmf = new MaterialMeasurementForecast();
                mmf.Time = o.tm;
                mmf.Value = o.value;
                resultList.Add(mmf);
            }
            
            MaterialMeasurementForecast last = resultList.Find(x => 
                x.Time.Year == forecastDate.Year && 
                x.Time.Month == forecastDate.Month && 
                x.Time.Day == forecastDate.Day && 
                x.Time.Hour == forecastDate.Hour && 
                x.Time.Minute == forecastDate.Minute);
            
            if (last == null) 
                forecasts.Add(new MaterialMeasurementForecast(forecastDate, null));
            else
                forecasts.Add(new MaterialMeasurementForecast(forecastDate, last.Value));
            
            DateTime loopDt = forecastDate.AddMinutes(-15);
            for (int i = 0; i < 4; i++)
            {
                MaterialMeasurementForecast mmf = new MaterialMeasurementForecast();
                
                dynamic target = list.Find(x => 
                    x.tm.Year == loopDt.Year && 
                    x.tm.Month == loopDt.Month && 
                    x.tm.Day == loopDt.Day && 
                    x.tm.Hour == loopDt.Hour && 
                    x.tm.Minute == loopDt.Minute);
                mmf.Time = loopDt;
                if (target == null)
                    mmf.Value = null;
                else
                    mmf.Value = target.value;
                forecasts.Add(mmf);
                
                loopDt = loopDt.AddMinutes(-15);
            }
            
            return forecasts;
        }

        private List<MaterialMeasurement> GetDustMeasurementHistories(int sensorSn, int sensorSubType, DateTime prevDate)
        {
            List<MaterialMeasurement> histories = new List<MaterialMeasurement>();

            Model.History.DustMeasurement.Fields field = GetDustMsrrFields(sensorSubType).HistoryField;
            
            string formattedPrevDate = prevDate.ToString("yyyy-MM-dd HH:mm:ss.fff");
            
            string strQuery = $@"
                Select Top 46 
                    tm,
                    {field.ToString()} as value  
                    From {Model.History.DustMeasurement.TableName}
                Where (1=1) 
                And {Model.History.DustMeasurement.Fields.dust_msrr_sn} = {sensorSn}
                And {Model.History.DustMeasurement.Fields.tm} <= '{formattedPrevDate}'
                order by tm desc";
            
            IEnumerable<dynamic> results = m_dataManager.GetSelect().Select(strQuery, out string strErrorMessage);
            if (results == null)
                throw new Exception("미세먼지 센서 측정 기록 조회 실패: " + strErrorMessage + $@" / SensorSn : {sensorSn}");
            
            List<dynamic> list = results.ToList();
            
            List<MaterialMeasurement> resultList = new List<MaterialMeasurement>();
            foreach (dynamic o in list)
            {
                MaterialMeasurement mm = new MaterialMeasurement();
                mm.Time = o.tm;
                mm.Value = o.value;
                resultList.Add(mm);
            }

            MaterialMeasurement last = new MaterialMeasurement();
            last = resultList.Find(x => 
                x.Time.Year == prevDate.Year && 
                x.Time.Month == prevDate.Month && 
                x.Time.Day == prevDate.Day && 
                x.Time.Hour == prevDate.Hour && 
                x.Time.Minute == prevDate.Minute);
            
            if (last != null) 
                histories.Add(new MaterialMeasurement(last.Time, last.Value));
            else 
                histories.Add(new MaterialMeasurement(prevDate, null));
            
            DateTime loopDt = prevDate.AddMinutes(-1);
            loopDt = new DateTime(loopDt.Year, loopDt.Month, loopDt.Day, loopDt.Hour, loopDt.Minute, 0, loopDt.Kind);

            for (int i = 0; i < 45; i++)
            {
                MaterialMeasurement target = resultList.Find(x => 
                    x.Time.Year == loopDt.Year && 
                    x.Time.Month == loopDt.Month && 
                    x.Time.Day == loopDt.Day && 
                    x.Time.Hour == loopDt.Hour && 
                    x.Time.Minute == loopDt.Minute);

                if (target == null)
                {
                    histories.Add(new MaterialMeasurement(loopDt, null));
                }
                else
                {
                    histories.Add(new MaterialMeasurement(loopDt, target.Value));
                }
                
                loopDt = loopDt.AddMinutes(-1);
            }
            
            return histories;
        }

        private (Model.Forecast.DustMeasurement.Fields ForecastField, Model.History.DustMeasurement.Fields HistoryField) GetDustMsrrFields(int sensorSubType)
        {
            switch (sensorSubType)
            {
                case PM10:
                    return (Model.Forecast.DustMeasurement.Fields.fptc_value, Model.History.DustMeasurement.Fields.fptc_value);
                case PM25:
                    return (Model.Forecast.DustMeasurement.Fields.ulfptc_value, Model.History.DustMeasurement.Fields.ulfptc_value);
                case CO2:
                    return (Model.Forecast.DustMeasurement.Fields.co2_value, Model.History.DustMeasurement.Fields.co2_value);
                case VOCS:
                    return (Model.Forecast.DustMeasurement.Fields.vlnms_value, Model.History.DustMeasurement.Fields.vlnms_value);
                default:
                    throw new Exception("올바르지 않은 물질 타입입니다. 파라미터를 확인해주세요.");
            }
        }

    private int GetFacilitySn(int sensorSn, int sensorType)
        {
            Table obj = new Table();
            
            string strTargetFacilityColumn = string.Empty;
            
            // 센서 종류별 대상 컬럼 명을 찾는다.
            if (sensorType == SdmsSensor.SensorType.FineDust) // 미세먼지 센서 
            {
                obj = new Soulbrain.Model.Facility.DustMeasurement();
                strTargetFacilityColumn = nameof(Soulbrain.Model.Forecast.DustMeasurement.Fields.dust_msrr_sn);
            }
            else if (sensorType == SdmsSensor.SensorType.Submerge) // 집수정
            {
                obj = new Soulbrain.Model.Facility.WaterGather();
                strTargetFacilityColumn = nameof(Soulbrain.Model.Forecast.WaterGather.Fields.wgr_sn);
            }
            else 
                throw new Exception("예측치를 조회할 수 없는 센서입니다. 센서 파라미터를 확인해주세요.");

            string strQuery = $@"SELECT TOP 1 {obj.GetTableName()}.{strTargetFacilityColumn} As facility_sn FROM {obj.GetTableName()}";

            dynamic sn = m_dataManager.GetSelect().SelectFirst(strQuery, out string strErrorMessage);

            if (sn == null || sn.facility_sn == 0)
                throw new Exception(strErrorMessage);
            
            return sn.facility_sn;
        }

        private double GetMatchedValueFromSubType(Soulbrain.Model.Forecast.DustMeasurement dustMeasurement, int subType)
        {
            if (subType == PM10)
                return dustMeasurement.fptc_value;
            else if (subType == PM25)
                return dustMeasurement.ulfptc_value;
            else if (subType == CO2)
                return dustMeasurement.co2_value;
            else if (subType == VOCS)
                return dustMeasurement.vlnms_value;
            else
                throw new Exception("잘못된 SubType입니다. 파라미터를 확인해주세요.");
        }
        
        
        public ResponseWaterGatherForecast RequestWaterGatherForecastInfo(RequestWaterGatherForecastInfo data)
        {
            DateTime dtNow = DateTime.Now;

            int minutesToAdd = 15 - (dtNow.Minute % 15);
            if (minutesToAdd == 0)
                minutesToAdd = 15; // 이미 15분 배수라면 다음 슬롯으로 이동

            DateTime dtTempNext = dtNow.AddMinutes(minutesToAdd);
            DateTime dtNextQuarter = new DateTime(dtTempNext.Year, dtTempNext.Month, dtTempNext.Day, dtTempNext.Hour, dtTempNext.Minute, 0, DateTimeKind.Unspecified);

            int minutesPastQuarter = dtNow.Minute % 15;

            DateTime dtTempPrev = dtNow.AddMinutes(-minutesPastQuarter);
            DateTime dtPrevQuarter = new DateTime(dtTempPrev.Year, dtTempPrev.Month, dtTempPrev.Day, dtTempPrev.Hour, dtTempPrev.Minute, 0, DateTimeKind.Unspecified);
            
            try
            {
                ResponseWaterGatherForecast response = new ResponseWaterGatherForecast(true, "");
                
                int nWaterGatherSn = GetFacilitySn(data.SensorSn, SdmsSensor.SensorType.Submerge);
                
                response.MaterialMeasurementForecastInfo = GetWaterGatherForecast(nWaterGatherSn, dtNextQuarter);
                response.MaterialMeasurementInfo = GetWaterGatherHistory(nWaterGatherSn, dtPrevQuarter);
                return response;
            }
            catch (Exception exception)
            {
                return new ResponseWaterGatherForecast(false, exception.Message);
            }
        }

        private List<MaterialMeasurementForecast> GetWaterGatherForecast(int sensorSn, DateTime forecastDate)
        {
            string strQuery = $@"Select Top 5
                                 {Model.Forecast.WaterGather.Fields.tm},
                                 {Model.Forecast.WaterGather.Fields.wgr_sn},
                                 {Model.Forecast.WaterGather.Fields.hydro_ion_dnsty_idex}
                                From {Model.Forecast.WaterGather.TableName}
                                Where {Model.Forecast.WaterGather.Fields.wgr_sn} = {sensorSn}
                                Order By {Model.Forecast.WaterGather.Fields.tm} DESC";

            IEnumerable<dynamic> results = m_dataManager.GetSelect().Select(strQuery, out string strErrorMessage);
            
            if (results == null)
                throw new Exception(strErrorMessage + $@" 예측치 조회에 실패하였습니다. SensorSn : {sensorSn}");
            
            List<Model.Forecast.WaterGather> wgForecasts = results.Select(x => new Model.Forecast.WaterGather()
            {
                wgr_sn = x.wgr_sn,
                tm = x.tm,
                hydro_ion_dnsty_idex = x.hydro_ion_dnsty_idex
            }).ToList();

            Model.Forecast.WaterGather last = wgForecasts.Find( x =>
                x.tm.Year == forecastDate.Year &&
                x.tm.Month == forecastDate.Month &&
                x.tm.Day == forecastDate.Day &&
                x.tm.Hour == forecastDate.Hour &&
                x.tm.Minute == forecastDate.Minute
            );
            
            List<MaterialMeasurementForecast> forecasts = new List<MaterialMeasurementForecast>();
            
            if (last == null) 
                forecasts.Add(new MaterialMeasurementForecast(forecastDate, null));
            else 
                forecasts.Add(new MaterialMeasurementForecast(last.tm, last.hydro_ion_dnsty_idex));
            
            DateTime loopDt = forecastDate.AddMinutes(-15);
            loopDt = new DateTime(loopDt.Year, loopDt.Month, loopDt.Day, loopDt.Hour, loopDt.Minute, 0, loopDt.Kind);
            for (int i = 0; i < 4; i++)
            {
                
                Model.Forecast.WaterGather target = wgForecasts.Find(x =>
                    x.tm.Year == loopDt.Year && x.tm.Month == loopDt.Month && x.tm.Day == loopDt.Day &&
                    x.tm.Hour == loopDt.Hour && x.tm.Minute == loopDt.Minute);
                if (target == null)
                {
                    forecasts.Add(new MaterialMeasurementForecast(loopDt, null));
                }
                else
                {
                    forecasts.Add(new MaterialMeasurementForecast(loopDt, target.hydro_ion_dnsty_idex));
                }
                
                loopDt = loopDt.AddMinutes(-15);
            }
            
            return forecasts;
        }

        private List<MaterialMeasurement> GetWaterGatherHistory(int sensorSn, DateTime prevDate)
        {
            string formattedPrevDate = prevDate.ToString("yyyy-MM-dd HH:mm:ss.fff");
            
            string strQuery = $@"
                                Select Top (46)
                                    {Model.History.WaterGather.Fields.hydro_ion_dnsty_idex},
                                    {Model.History.WaterGather.Fields.tm}
                                From {Model.History.WaterGather.TableName}
                                Where (1=1) 
                                And {Model.History.WaterGather.Fields.wgr_sn} = {sensorSn}
                                And {Model.History.WaterGather.Fields.tm} <= '{formattedPrevDate}'
                                Order By {Model.History.WaterGather.Fields.tm} DESC
                                ";
            
            IEnumerable<dynamic> results = m_dataManager.GetSelect().Select(strQuery, out string strErrorMessage);
            
            if (results == null)
                throw new Exception($@"Failed to retrieve water gather history data / ErrorMessage : {strErrorMessage} / wgr_sn : {sensorSn}");
            
            List<Model.History.WaterGather> listWaterGather = results.Select(x => new Model.History.WaterGather()
            {
                hydro_ion_dnsty_idex = x.hydro_ion_dnsty_idex,
                tm = x.tm
            }).ToList();
            
            List<MaterialMeasurement> histories = new List<MaterialMeasurement>();
            Model.History.WaterGather last = listWaterGather.Find(x => x.tm.Year == prevDate.Year && x.tm.Month == prevDate.Month && x.tm.Day == prevDate.Day && x.tm.Hour == prevDate.Hour && x.tm.Minute == prevDate.Minute);

            if (last != null) histories.Add(new MaterialMeasurement(last.tm, last.hydro_ion_dnsty_idex));
            else histories.Add(new MaterialMeasurement(prevDate, null));
            
            DateTime loopDt = prevDate.AddMinutes(-1);
            loopDt = new DateTime(loopDt.Year, loopDt.Month, loopDt.Day, loopDt.Hour, loopDt.Minute, 0, loopDt.Kind);
            for (int i = 0; i < 45; i++)
            {
                MaterialMeasurement mm = new MaterialMeasurement();
                
                Model.History.WaterGather target = listWaterGather.Find(x => x.tm.Year == loopDt.Year && x.tm.Month == loopDt.Month && x.tm.Day == loopDt.Day && x.tm.Hour == loopDt.Hour && x.tm.Minute == loopDt.Minute);

                if (target == null)
                {
                    mm.Time = loopDt;
                    mm.Value = null;
                    histories.Add(mm);
                }
                else
                {
                    mm.Value = target.hydro_ion_dnsty_idex;
                    mm.Time = target.tm;
                    histories.Add(mm);
                }
                    
                loopDt = loopDt.AddMinutes(-1);
            }
            
            return histories;
        }
    }
}