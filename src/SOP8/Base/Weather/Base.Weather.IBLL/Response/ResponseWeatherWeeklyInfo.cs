using System.Collections.Generic;
using Base.Model.Weather;
using Response;

namespace Base.Weather.IBLL.Response
{
    public class ResponseWeatherWeeklyInfo : MessageResult
    {
        private List<WeatherWeeklyData> m_datas = new List<WeatherWeeklyData>();

        public List<WeatherWeeklyData> Datas
        {
            get { return m_datas; }
            set { m_datas = value; }
        }

        public ResponseWeatherWeeklyInfo()
            : base()
        {
        }

        public ResponseWeatherWeeklyInfo(bool success, string message)
            : base(success, message)
        {
        }
    }

    public class WeatherWeeklyData
    {
        private Site m_site = null;
        private Weekly m_weekly = null;

        public Site Site
        {
            get { return m_site; }
            set { m_site = value; }
        }

        public Weekly Weekly
        {
            get { return m_weekly; }
            set { m_weekly = value; }
        }
    }
}
