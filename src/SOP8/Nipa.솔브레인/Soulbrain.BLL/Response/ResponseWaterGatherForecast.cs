using System;
using System.Collections.Generic;
using Response;

namespace Soulbrain.BLL.Response
{
    public class ResponseWaterGatherForecast : MessageResult
    {
        private List<MaterialMeasurement> m_lstWaterGatherInfo = new List<MaterialMeasurement>();
        private List<MaterialMeasurementForecast> m_lstWaterGatherForecastInfo = new List<MaterialMeasurementForecast>();
        
        public List<MaterialMeasurement> MaterialMeasurementInfo
        {
            get { return m_lstWaterGatherInfo; }
            set { m_lstWaterGatherInfo = value; }
        }
        
        public List<MaterialMeasurementForecast> MaterialMeasurementForecastInfo
        {
            get { return m_lstWaterGatherForecastInfo; }
            set { m_lstWaterGatherForecastInfo = value; }
        }
        
        public ResponseWaterGatherForecast()
        : base()
        {
        }
        
        public ResponseWaterGatherForecast(bool success, string message) : base(success, message)
        {
        }
    }
    
    // 예측치
    public class MaterialMeasurementForecast
    {
        private DateTime tm;
        private double? value;
        
        public DateTime Time
        {
            get { return tm; }
            set { tm = value; }
        }
        
        public double? Value
        {
            get { return value; }
            set { this.value = value; }
        }
        
        public MaterialMeasurementForecast()
        {
        }
        
        public MaterialMeasurementForecast(DateTime time, double? value)
        {
            this.tm = time;
            this.value = value;
        }
    }
    
    // 실측치
    public class MaterialMeasurement
    {
        private DateTime tm;
        private double? value;
        
        public DateTime Time
        {
            get { return tm; }
            set { tm = value; }
        }
        
        public double? Value
        {
            get { return value; }
            set { this.value = value; }
        }
        
        public MaterialMeasurement()
        {
        }
        
        public MaterialMeasurement(DateTime time, double? value)
        {
            this.tm = time;
            this.value = value;
        }
    }
}