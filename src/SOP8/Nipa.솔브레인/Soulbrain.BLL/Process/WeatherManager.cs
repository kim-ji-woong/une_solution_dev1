using System.Collections.Generic;
using dnsDapperDBUtil.DataAccessLayer.IDAL;
using Soulbrain.Model.Weather;

namespace Soulbrain.BLL.Process
{
    using Request;
    using Response;

    class WeatherManager
    {
        private IDataManager m_dataManager = null;

        public WeatherManager(IDataManager dataManager)
        {
            m_dataManager = dataManager;
        }

        public ResponseCurrentWeather GetCurrentWeather(RequestCurrentWeather data)
        {
            string strCondition = null;

            if (data.WeatherSiteNo != null)
                strCondition = string.Format("{0} = {1}", Current.Fields.wethr_site_sn, (int)data.WeatherSiteNo);

            string strErrorMessage;
            IEnumerable<Current> weathers = m_dataManager.GetSelect().Select<Current>(strCondition, out strErrorMessage);

            if (weathers == null)
                return new ResponseCurrentWeather(false, strErrorMessage);

            IEnumerable<Base.Model.Weather.Site> sites = m_dataManager.GetSelect().Select<Base.Model.Weather.Site>(null, out strErrorMessage);

            if (sites == null)
                return new ResponseCurrentWeather(false, strErrorMessage);

            Dictionary<int, Base.Model.Weather.Site> dicSites = new Dictionary<int, Base.Model.Weather.Site>();

            foreach (Base.Model.Weather.Site site in sites)
            {
                dicSites[site.wethr_site_sn] = site;
            }

            ResponseCurrentWeather response = new ResponseCurrentWeather(true, "");

            foreach (Current current in weathers)
            {
                Base.Model.Weather.Site site;

                if (dicSites.TryGetValue(current.wethr_site_sn, out site))
                {
                    CurrentEx currentWeather = new CurrentEx(current);
                    currentWeather.SiteName = site.name;
                    response.CurrentWeathers.Add(currentWeather);
                }
            }

            return response;
        }
    }
}
