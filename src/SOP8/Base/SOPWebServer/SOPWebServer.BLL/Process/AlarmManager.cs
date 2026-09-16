using System;
using System.Collections.Generic;
using dnsDapperDBUtil.DataAccessLayer.IDAL;
using Base.Model.Sensor;

namespace SOPWebServer.BLL.Process
{
    class AlarmManager
    {
        private static AlarmManager m_alarmManager = null;

        public static AlarmManager Instance
        {
            get
            {
                if (m_alarmManager == null)
                    m_alarmManager = new AlarmManager();

                return m_alarmManager;
            }
        }

        private AlarmManager()
        {
        }

        // 이미 존재하는 알람에 특정 센서가 추가되었을 경우 DB 정보를 갱신해준다.
        public bool AddAlarmSensor(SensorZone sensorZone, int nSensorZoneHistoryNo, IDataManager dataManager, out string strErrorMessage)
        {
            string strCondition = string.Format("{0} = {1} and {2} = {3}", Base.Model.History.SensorZoneDetail.Fields.sensor_zone_hist_sn, nSensorZoneHistoryNo, Base.Model.History.SensorZoneDetail.Fields.sensor_zone_sn, sensorZone.sensor_zone_sn);
            IEnumerable<Base.Model.History.SensorZoneDetail> sensorZoneList = dataManager.GetSelect().Select<Base.Model.History.SensorZoneDetail>(strCondition, out strErrorMessage);

            if (sensorZoneList == null)
                return false;

            if (IsEmpty(sensorZoneList) == false)
                return true;

            Base.Model.History.SensorZoneDetail sensorZoneListData = new Base.Model.History.SensorZoneDetail();
            sensorZoneListData.sensor_zone_hist_sn = nSensorZoneHistoryNo;
            sensorZoneListData.sensor_zone_sn = sensorZone.sensor_zone_sn;
            sensorZoneListData.tm = DateTime.Now;

            return dataManager.GetCreate().Insert<Base.Model.History.SensorZoneDetail>(sensorZoneListData, out strErrorMessage);
        }

        private bool IsEmpty<T>(IEnumerable<T> list)
        {
            foreach (T data in list)
            {
                return false;
            }

            return true;
        }
    }
}
