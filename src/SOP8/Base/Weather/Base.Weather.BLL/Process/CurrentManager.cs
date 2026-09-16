using System.Collections.Generic;
using dnsDapperDBUtil.DataAccessLayer.IDAL;
using Base.Weather.IBLL.Request;
using Base.Weather.IBLL.Response;
using Base.Model.Weather;
using Base.Weather.IBLL.Models;

namespace Base.Weather.BLL.Process
{
    class CurrentManager
    {
        private IDataManager m_dataManager = null;

        public CurrentManager(IDataManager dataManager)
        {
            m_dataManager = dataManager;
        }

        public ResponseCurrent GetCurrentWeather(RequestCurrent data)
        {
            string strCondition = null;

            if (data.WeatherSiteNo != null)
                strCondition = string.Format("{0} = {1}", Current.Fields.wethr_site_sn, (int)data.WeatherSiteNo);

            string strErrorMessage;
            IEnumerable<Current> weathers = m_dataManager.GetSelect().Select<Current>(strCondition, out strErrorMessage);

            if (weathers == null)
                return new ResponseCurrent(false, strErrorMessage);

            IEnumerable<Site> sites = m_dataManager.GetSelect().Select<Site>(null, out strErrorMessage);

            if (sites == null)
                return new ResponseCurrent(false, strErrorMessage);

            Dictionary<int, Site> dicSites = new Dictionary<int, Site>();
            
            foreach (Site site in sites)
            {
                dicSites[site.wethr_site_sn] = site;
            }

            ResponseCurrent response = new ResponseCurrent(true, "");
            
            foreach (Current current in weathers)
            {
                Site site;

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
