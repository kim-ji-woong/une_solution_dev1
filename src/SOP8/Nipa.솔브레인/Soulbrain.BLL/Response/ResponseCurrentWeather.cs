using System;
using System.Collections.Generic;
using Response;
using Soulbrain.Model.Weather;

namespace Soulbrain.BLL.Response
{
    public class ResponseCurrentWeather : MessageResult
    {
        private List<CurrentEx> m_currentWeathers = new List<CurrentEx>();

        public List<CurrentEx> CurrentWeathers
        {
            get { return m_currentWeathers; }
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

    public class CurrentEx : Current
    {
        private string m_strSiteName = "";

        public string SiteName
        {
            get { return m_strSiteName; }
            set { m_strSiteName = value; }
        }

        public CurrentEx()
        {
        }

        public CurrentEx(Current current)
        {
            this.FromCopy(current);
        }
    }
}
