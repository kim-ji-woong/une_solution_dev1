using System.Collections.Generic;
using Gwangyang.Model;
using Response;

namespace Gwangyang.IBLL.Response
{
    public class ResponseWeatherData : MessageResult
    {
        private List<WeatherData> m_weatherData = new List<WeatherData>();
        
        public List<WeatherData> WeatherData
        {
            get { return m_weatherData; }
            set { m_weatherData = value; }
        }
        
        public ResponseWeatherData()
            : base()
        {
        }
        
        public ResponseWeatherData(bool success, string message)
            : base(success, message)
        {
        }
        
    }
}