using System;
using System.Collections.Generic;
using dnsDapperDBUtil.DataAccessLayer.IDAL;
using DCOP.Model.Weather;

namespace DCOP.BLL
{
    using Models.Response;

    public class WeatherManager
    {
        private IDataManager m_dataManager = null;

        public WeatherManager(IDataManager dataManager)
        {
            m_dataManager = dataManager;
        }

        public ResponseCurrentWeather GetCurrentWeather(int nDataCenterNo)
        {
            string strCondition = string.Format("{0} = (Select {1} from {2} where {3} = {4})",
                Current.Fields.WeatherSiteNo,
                DCOP.Model.DataCenter.Fields.WeatherSiteNo,
                DCOP.Model.DataCenter.TableName,
                DCOP.Model.DataCenter.Fields.DataCenterNo,
                nDataCenterNo);
            /*string strCondition = string.Format("{0} = (Select {1} from {2} where {3} = {4})",
                Current.Fields.WeatherSiteNo,
                DCOP.Model.Site.Fields.WeatherSiteNo,
                DCOP.Model.Site.TableName,
                DCOP.Model.Site.Fields.SiteNo,
                nSiteNo);*/

            string strErrorMessage;
            Current current = m_dataManager.GetSelect().SelectFirst<Current>(strCondition, out strErrorMessage);

            if (current == null)
            {
                if (strErrorMessage != null)
                    return new ResponseCurrentWeather(false, strErrorMessage);
                else
                    return new ResponseCurrentWeather(false, "주어진 Site에 대한 날씨정보가 존재하지 않습니다.");
            }

            ResponseCurrentWeather response = new ResponseCurrentWeather(true, "");
            response.Weather = current;
            return response;
        }
    }
}
