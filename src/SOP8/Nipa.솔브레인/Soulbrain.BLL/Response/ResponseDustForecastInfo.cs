using System;
using System.Collections.Generic;
using Response;
using Soulbrain.Model.Forecast;

namespace Soulbrain.BLL.Response
{
    public class ResponseDustForecastInfo : MessageResult
    {
        private List<MaterialMeasurement> m_dustMeasurementInfo = new List<MaterialMeasurement>();
        private List<MaterialMeasurementForecast> m_dustForecastInfo = new List<MaterialMeasurementForecast>();
        
        public List<MaterialMeasurementForecast> DustMeasurementForecasts
        {
            get { return m_dustForecastInfo; }
            set { m_dustForecastInfo = value; }
        }
        
        public List<MaterialMeasurement> DustMeasurementHistories
        {
            get { return m_dustMeasurementInfo; }
            set { m_dustMeasurementInfo = value; }
        }
        
        public ResponseDustForecastInfo()
            : base()
        {
        }
        
        public ResponseDustForecastInfo(bool success, string message)
            : base(success, message)
        {
        }
    }
    
}