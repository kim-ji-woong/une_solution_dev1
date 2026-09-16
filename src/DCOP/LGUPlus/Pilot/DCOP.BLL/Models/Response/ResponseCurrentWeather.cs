using DCOP.Model.Weather;

namespace DCOP.BLL.Models.Response
{
    public class ResponseCurrentWeather : MessageResult
    {
        private Current m_current = null;

        public Current Weather
        {
            get { return m_current; }
            set { m_current = value; }
        }

        public ResponseCurrentWeather()
            : base()
        {
        }

        public ResponseCurrentWeather(bool success, string message)
            : base(success, message)
        {
        }
    }
}
