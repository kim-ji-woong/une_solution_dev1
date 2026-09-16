namespace SoulbrainWeather.Datas
{
    class CityData
    {
        private const string BaseURL = "https://www.weather.go.kr/w/obs-climate/land/city-obs.do?auto_man=m&stn=0&dtm=&type=t99&reg=";
        private string m_strTargetCity = "";
        private string m_strSourceCity = "";
        private string m_strURL = "";

        public string Target
        {
            get { return m_strTargetCity; }
            set { m_strTargetCity = value; }
        }

        public string Source
        {
            get { return m_strSourceCity; }
            set { m_strSourceCity = value; }
        }

        public string URL
        {
            get { return m_strURL; }
        }

        public void SetRegion(string strRegion)
        {
            m_strURL = BaseURL + strRegion;
        }
    }
}
