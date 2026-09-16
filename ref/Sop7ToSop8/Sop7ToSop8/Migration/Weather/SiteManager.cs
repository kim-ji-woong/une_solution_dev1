using System.Collections.Generic;
using Base.Model.Weather;

namespace Sop7ToSop8.Migration.Weather
{
    class SiteManager
    {
		private IMigrationClient m_client = null;
		private int m_nSop8SiteNo = -1;

		public SiteManager(IMigrationClient client, int sop8SiteNo)
		{
			m_client = client;
			m_nSop8SiteNo = sop8SiteNo;
		}

		public bool Run()
		{
			m_client.SendStatus("날씨 사이트 데이터를 읽어옵니다.");

			if (!ReadSop7(out var strErrorMessage))
			{
				m_client.SendStatus(strErrorMessage);
				return false;
			}

			m_client.SendStatus("날씨 사이트 데이터를 옮기는데 성공하였습니다.");
			return true;
		}

		private bool ReadSop7(out string strErrorMessage)
		{
			string strSQL = "Select ID, Name, Description from WeatherSite";
			IEnumerable<object> arrResults = m_client.Sop7DataManager.GetSelect().Select(strSQL, out strErrorMessage);

			if (arrResults == null)
			{
				return false;
			}

			foreach (dynamic data in arrResults)
			{
				if (this.CreateSop8(data, out strErrorMessage) == false)
				{
					return false;
				}
			}

			return true;
		}

		private bool CreateSop8(dynamic data, out string strErrorMessage)
		{
			Site site = new Site();
			site.wethr_site_sn = data.ID;
			site.name = data.Name;
			site.descp = data.Description;

			return m_client.Sop8DataManager.GetCreate().Insert(site, out strErrorMessage);
		}
	}
}
