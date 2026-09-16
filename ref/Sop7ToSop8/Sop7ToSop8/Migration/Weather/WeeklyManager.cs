using System.Collections.Generic;
using Base.Model.Weather;
using dnsData.CommonCode;

namespace Sop7ToSop8.Migration.Weather
{
    class WeeklyManager
    {
		private IMigrationClient m_client = null;
		private int m_nSop8SiteNo = -1;

		public WeeklyManager(IMigrationClient client, int sop8SiteNo)
		{
			m_client = client;
			m_nSop8SiteNo = sop8SiteNo;
		}

		public bool Run()
		{
			m_client.SendStatus("주간 날씨 데이터를 읽어옵니다.");

			if (!ReadSop7(out var strErrorMessage))
			{
				m_client.SendStatus(strErrorMessage);
				return false;
			}

			m_client.SendStatus("주간 날씨 데이터를 옮기는데 성공하였습니다.");
			return true;
		}

		private bool ReadSop7(out string strErrorMessage)
		{
			string strSQL = "Select WeatherSiteID, OneDayLaterTemp, OneDayLaterState, TwoDayLaterTemp, TwoDayLaterState, ThreeDayLaterTemp, ThreeDayLaterState, FourDayLaterTemp, FourDayLaterState, FiveDayLaterTemp, FiveDayLaterState, SixDayLaterTemp, SixDayLaterState, UpdateTime, OneDayMiniTemp, TwoDayMiniTemp, ThreeDayMiniTemp, FourDayMiniTemp, FiveDayMiniTemp, SixDayMiniTemp from WeatherWeekly";
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
			Weekly weekly = new Weekly();
			weekly.wethr_site_sn = data.WeatherSiteID;
			weekly.wethr_sttus_optn_code = (int)CodeType.WeatherStatus;
			weekly.oneday_after_tp = data.OneDayLaterTemp;
			weekly.oneday_after_min_tp = data.OneDayMiniTemp;
			weekly.oneday_after_wethr_sttus_code = weekly.wethr_sttus_optn_code + data.OneDayLaterState;
			weekly.twoday_after_tp = data.TwoDayLaterTemp;
			weekly.twoday_after_min_tp = data.TwoDayMiniTemp;
			weekly.twoday_after_wethr_sttus_code = weekly.wethr_sttus_optn_code + data.TwoDayLaterState;
			weekly.thrday_after_tp = data.ThreeDayLaterTemp;
			weekly.thrday_after_min_tp = data.ThreeDayMiniTemp;
			weekly.thrday_after_wethr_sttus_code = weekly.wethr_sttus_optn_code + data.ThreeDayLaterState;
			weekly.fourday_after_tp = data.FourDayLaterTemp;
			weekly.fourday_after_min_tp = data.FourDayMiniTemp;
			weekly.fourday_after_wethr_sttus_code = weekly.wethr_sttus_optn_code + data.FourDayLaterState;
			weekly.fiveday_after_tp = data.FiveDayLaterTemp;
			weekly.fiveday_after_min_tp = data.FiveDayMiniTemp;
			weekly.fiveday_after_wethr_sttus_code = weekly.wethr_sttus_optn_code + data.FiveDayLaterState;
			weekly.sixday_after_tp = data.SixDayLaterTemp;
			weekly.sixday_after_min_tp = data.SixDayMiniTemp;
			weekly.sixday_after_wethr_sttus_code = weekly.wethr_sttus_optn_code + data.SixDayLaterState;
			weekly.updt_tm = data.UpdateTime;

			return m_client.Sop8DataManager.GetCreate().Insert(weekly, out strErrorMessage);
		}
	}
}
