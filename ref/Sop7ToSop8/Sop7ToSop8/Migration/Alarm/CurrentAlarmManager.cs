using System.Collections.Generic;
using Base.Model.Alarm;

namespace Sop7ToSop8.Migration.Alarm
{
	using History;

    class CurrentAlarmManager
    {
		private IMigrationClient m_client = null;

		private int m_nSop8SiteNo = -1;

		private SensorZoneHistoryManager m_sensorZoneHistoryManager = null;

		public CurrentAlarmManager(IMigrationClient client, int sop8SiteNo, SensorZoneHistoryManager sensorZoneHistoryManager)
		{
			m_client = client;
			m_nSop8SiteNo = sop8SiteNo;
			m_sensorZoneHistoryManager = sensorZoneHistoryManager;
		}

		public bool Run()
		{
			m_client.SendStatus("현재 알람 데이터를 읽어옵니다.");
			if (!ReadSop7(out var strErrorMessage))
			{
				m_client.SendStatus(strErrorMessage);
				return false;
			}
			m_client.SendStatus("현재 알람 데이터를 옮기는데 성공하였습니다.");
			return true;
		}

		private bool ReadSop7(out string strErrorMessage)
		{
			string strSQL = "Select SensorZoneHistoryID, SensorType, AlarmType, TimeStamp, SopStatus, AlarmDepth, AlarmSensorZoneIDs from SdmsAlarmCurrent";
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
			strErrorMessage = null;
			if (data.AlarmSensorZoneIDs == null)
			{
				return true;
			}

			string[] sensorZoneIDs = data.AlarmSensorZoneIDs.Split(',');
			string[] array = sensorZoneIDs;

			foreach (string strSensorZoneID in array)
			{
				if (!int.TryParse(strSensorZoneID.Trim(), out var sensorZoneID))
				{
					continue;
				}

				int sop8SensorZoneNo = m_sensorZoneHistoryManager.GetSop8SensorZoneNo(sensorZoneID);

				if (sop8SensorZoneNo >= 0)
				{
					Current alarm = new Current();
					alarm.sensor_zone_hist_sn = data.SensorZoneHistoryID;
					alarm.sensor_zone_sn = sop8SensorZoneNo;
					alarm.detct_ty_optn_code = 300400;
					alarm.detct_ty_code = 300400;
					alarm.alarm_tm = data.TimeStamp;
					alarm.sop_sttus_optn_code = 200100;
					alarm.sop_sttus_code = alarm.sop_sttus_optn_code + data.SopStatus + 1;
					alarm.alarm_level = data.AlarmDepth;
				
					if (!m_client.Sop8DataManager.GetCreate().Insert(alarm, out strErrorMessage))
					{
						return false;
					}
				}
			}

			return true;
		}
	}
}
