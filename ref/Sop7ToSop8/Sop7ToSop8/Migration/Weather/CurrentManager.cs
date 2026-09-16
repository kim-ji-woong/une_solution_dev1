using System.Collections.Generic;
using Base.Model.Weather;
using dnsData.CommonCode;

namespace Sop7ToSop8.Migration.Weather
{
    class CurrentManager
    {
		private IMigrationClient m_client = null;
		private int m_nSop8SiteNo = -1;

		public CurrentManager(IMigrationClient client, int sop8SiteNo)
		{
			m_client = client;
			m_nSop8SiteNo = sop8SiteNo;
		}

		public bool Run()
		{
			m_client.SendStatus("현재 날씨 데이터를 읽어옵니다.");

			if (!ReadSop7(out var strErrorMessage))
			{
				m_client.SendStatus(strErrorMessage);
				return false;
			}

			m_client.SendStatus("현재 날씨 데이터를 옮기는데 성공하였습니다.");
			return true;
		}

		private bool ReadSop7(out string strErrorMessage)
		{
			string strSQL = "Select WeatherSiteID, Temperature, SensibleTemp, Rain, Humidity, WindSpeed, WindDirection, Atm, UpdateTime, State from WeatherCurrent";
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
			Current current = new Current();
			current.wethr_site_sn = data.WeatherSiteID;
			current.tp = data.Temperature;
			current.sensb_tp = data.SensibleTemp;
			current.rain = data.Rain;
			current.hd = data.Humidity;
			current.wind_spd = data.WindSpeed;
			current.atm = data.Atm;
			current.updt_tm = data.UpdateTime;

			if (data.State != null)
			{
				current.wethr_sttus_optn_code = (int)CodeType.WeatherStatus;
				current.wethr_sttus_code = current.wethr_sttus_optn_code + (int)data.State;
			}

			if (data.WindDirection != null)
			{
				current.wind_drc_optn_code = (int)CodeType.WindDirection;
				current.wind_drc_code = current.wind_drc_optn_code + (int)data.WindDirection;
			}

			return m_client.Sop8DataManager.GetCreate().Insert(current, out strErrorMessage);
		}
	}
}
