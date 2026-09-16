namespace Base.Weather.IBLL.Request
{
    public class RequestCurrent
    {
        private int? m_weatherSiteNo = null;

        public int? WeatherSiteNo
        {
            get { return m_weatherSiteNo; }
            set { m_weatherSiteNo = value; }
        }
    }
}
