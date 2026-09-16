using System.Collections.Generic;
using dnsDapperDBUtil.DataAccessLayer.IDAL;
using Base.Weather.IBLL.Request;
using Base.Weather.IBLL.Response;
using Base.Model.Weather;
using Base.Weather.IBLL.Models;

namespace Base.Weather.BLL.Process
{
    class WeeklyManager
    {
        private IDataManager m_dataManager = null;

        public WeeklyManager(IDataManager dataManager)
        {
            m_dataManager = dataManager;
        }

        public ResponseWeatherWeeklyInfo GetWeatherWeeklyInfo(RequestWeatherWeeklyInfo data)
        {
            string strErrorMessage;
            string strCondition = data.WeatherSiteNo == null ? null : string.Format("{0} = {1}", Weekly.Fields.wethr_site_sn, (int)data.WeatherSiteNo);
            IEnumerable<Weekly> weeklies = m_dataManager.GetSelect().Select<Weekly>(strCondition, out strErrorMessage);

            if (weeklies == null)
                return new ResponseWeatherWeeklyInfo(false, strErrorMessage);

            Dictionary<int, Site> dicSites = new Dictionary<int, Site>();

            strCondition = data.WeatherSiteNo == null ? null : string.Format("{0} = {1}", Site.Fields.wethr_site_sn, (int)data.WeatherSiteNo);
            IEnumerable<Site> sites = m_dataManager.GetSelect().Select<Site>(strCondition, out strErrorMessage);

            if (sites == null)
                return new ResponseWeatherWeeklyInfo(false, strErrorMessage);

            foreach (Site site in sites)
            {
                dicSites[site.wethr_site_sn] = site;
            }

            ResponseWeatherWeeklyInfo response = new ResponseWeatherWeeklyInfo(true, "");

            foreach (Weekly weekly in weeklies)
            {
                Site site;

                if (dicSites.TryGetValue(weekly.wethr_site_sn, out site))
                {
                    WeatherWeeklyData weeklyData = new WeatherWeeklyData();
                    weeklyData.Site = site;
                    weeklyData.Weekly = weekly;

                    response.Datas.Add(weeklyData);
                }
            }

            return response;
        }
    }
}
