namespace Soulbrain.BLL.Request
{
    public class RequestCurrentWeather
    {
        private int? m_weatherSiteNo = null;

        public int? WeatherSiteNo
        {
            get { return m_weatherSiteNo; }
            set { m_weatherSiteNo = value; }
        }
    }
}
