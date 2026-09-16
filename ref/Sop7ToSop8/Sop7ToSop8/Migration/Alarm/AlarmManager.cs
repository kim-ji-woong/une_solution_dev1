namespace Sop7ToSop8.Migration.Alarm
{
	using History;

    class AlarmManager
    {
		private IMigrationClient m_client = null;
		private int m_nSop8SiteNo = -1;
		private SensorZoneHistoryManager m_sensorZoneHistoryManager = null;

		public AlarmManager(IMigrationClient client, int sop8SiteNo, SensorZoneHistoryManager sensorZoneHistoryManager)
		{
			m_client = client;
			m_nSop8SiteNo = sop8SiteNo;
			m_sensorZoneHistoryManager = sensorZoneHistoryManager;
		}

		public bool Run()
		{
			CurrentAlarmManager currentAlarmManager = new CurrentAlarmManager(m_client, m_nSop8SiteNo, m_sensorZoneHistoryManager);
			if (!currentAlarmManager.Run())
			{
				return false;
			}
			return true;
		}
	}
}
