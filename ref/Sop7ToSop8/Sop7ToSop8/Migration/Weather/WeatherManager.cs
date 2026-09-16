using System;
using System.Collections.Generic;
using System.Text;

namespace Sop7ToSop8.Migration.Weather
{
    class WeatherManager
    {
		private IMigrationClient m_client = null;
		private int m_nSop8SiteNo = -1;

		public WeatherManager(IMigrationClient client, int sop8SiteNo)
		{
			m_client = client;
			m_nSop8SiteNo = sop8SiteNo;
		}

		public bool Run()
		{
			SiteManager siteManager = new SiteManager(m_client, m_nSop8SiteNo);
			if (!siteManager.Run())
			{
				return false;
			}

			CurrentManager currentManager = new CurrentManager(m_client, m_nSop8SiteNo);
			if (!currentManager.Run())
			{
				return false;
			}

			WeeklyManager weeklyManager = new WeeklyManager(m_client, m_nSop8SiteNo);
			if (!weeklyManager.Run())
			{
				return false;
			}

			return true;
		}
	}
}
