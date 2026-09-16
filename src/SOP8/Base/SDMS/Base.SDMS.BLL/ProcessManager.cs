using Base.SDMS.BLL.Process;
using Base.SDMS.IBLL;
using Base.SDMS.IBLL.Response;
using Base.SDMS.IBLL.Request;
using dnsDapperDBUtil.DataAccessLayer.IDAL;
using Response;

namespace Base.SDMS.BLL
{
    public class ProcessManager : IProcessManager
    {
        private IDataManager m_dataManager = null;

        public ProcessManager(IDataManager dataManager)
        {
            m_dataManager = dataManager;
        }

        public ResponseAlarm RequestAlarm(RequestAlarm data)
        {
            AlarmManager alarmManager = new AlarmManager(m_dataManager);
            return alarmManager.GetAlarms(data);
        }

        public ResponseAlarm RequestTodayAlarms(RequestTodayAlarms data)
        {
            AlarmManager alarmManager = new AlarmManager(m_dataManager);
            return alarmManager.GetTodayAlarms(data);
        }

        public ResponseSensorList RequestSensorList(RequestSensorList data)
        {
            SensorManager sensorManager = new SensorManager(m_dataManager);
            return sensorManager.GetSensorList(data);
        }

        public ResponseSensorList RequestZoneSensorList(RequestZoneSensorList data)
        {
            SensorManager sensorManager = new SensorManager(m_dataManager);
            return sensorManager.GetZoneSensorList(data);
        }

        public ResponseAlarmMemo RequestAlarmMemo(RequestAlarmMemo data)
        {
            AlarmManager alarmManager = new AlarmManager(m_dataManager);
            return alarmManager.GetAlarmMemo(data);
        }

        public ResponseAlarmMemo SaveAlarmMemo(SaveAlarmMemo data)
        {
            AlarmManager alarmManager = new AlarmManager(m_dataManager);
            return alarmManager.SaveAlarmMemo(data);
        }

        public MessageResult ClearAlarm(ClearAlarm data, string strSopWebServerUrl)
        {
            AlarmManager alarmManager = new AlarmManager(m_dataManager);
            return alarmManager.ClearAlarm(data, strSopWebServerUrl);
        }

        public MessageResult ClearAlarmList(ClearAlarmList data, string strSopWebServerUrl)
        {
            AlarmManager alarmManager = new AlarmManager(m_dataManager);
            return alarmManager.ClearAlarmList(data, strSopWebServerUrl);
        }

        public MessageResult ClearAllAlarm(ClearAllAlarm data, string strSopWebServerUrl)
        {
            AlarmManager alarmManager = new AlarmManager(m_dataManager);
            return alarmManager.ClearAllAlarm(data, strSopWebServerUrl);
        }

        public MessageResult BeginAlarmSop(RequestBeginSop data, string strSopWebServerUrl)
        {
            return SopManager.BeginAlarmSop(data, strSopWebServerUrl);
        }
        
        public ResponseBuildingGroupList RequestBuildingGroupList(RequestBuildingGroupList data)
        {
            LoadManager loadManager = new LoadManager(m_dataManager);
            ResponseBuildingGroupList response = loadManager.GetBuildingGroupList(data.SiteNos);
            return response;
        }

        public ResponseAlarmPosition RequestAlarmPosition(RequestAlarmPosition data)
        {
            AlarmManager alarmManager = new AlarmManager(m_dataManager);
            return alarmManager.GetAlarmPosition(data);
        }

        public ResponseAlarmNotifications RequestAlarmNotification(RequestAlarmNotification data)
        {
            AlarmNotifyManager alarmManager = new AlarmNotifyManager(m_dataManager);
            return alarmManager.RequestAlarmNotification(data);
        }

        public ResponseAlarmNotification SaveAlarmNotification(RequestSaveAlarmNotification data)
        {
            AlarmNotifyManager alarmManager = new AlarmNotifyManager(m_dataManager);
            return alarmManager.SaveAlarmNotification(data);
        }

        public MessageResult DeleteAlarmNotification(RequestDeleteAlarmNotification data)
        {
            AlarmNotifyManager alarmManager = new AlarmNotifyManager(m_dataManager);
            return alarmManager.DeleteAlarmNotification(data);
        }

        public ResponseGltfModelList RequestGltfModelList(RequestGltfModelList data)
        {
            GltfManager gltfManager = new GltfManager(m_dataManager);
            return gltfManager.GetGltfModelList(data);
        }

        public MessageResult UpdateSensorList(UpdateSensorData data)
        {
            SensorManager sensorManager = new SensorManager(m_dataManager);
            return sensorManager.UpdateSensorList(data);
        }

        public MessageResult UpdateFakeWallList(RequestUpdateFakeWall data)
        {
            FakeWallManager fakeWallManager = new FakeWallManager(m_dataManager);
            return fakeWallManager.UpdateList(data);
        }

        public ResponseZone RequestZoneInfo(RequestZone data)
        {
            SensorManager sensorManager = new SensorManager(m_dataManager);
            return sensorManager.GetZoneInfo(data);
        }

        // 재난신고
        public ResponseNotifyAlarm NotifyAlarm(NotifyAlarm data, string strSopWebServerUrl)
        {
            AlarmNotifyManager alarmManager = new AlarmNotifyManager(m_dataManager);
            return alarmManager.NotifyAlarm(data, strSopWebServerUrl);
        }

        public MessageResult RequestManualReport(RequestManualReport data, string strSopWebServerUrl)
        {
            AlarmManager alarmManager = new AlarmManager(m_dataManager);
            return alarmManager.RequestManualReport(data, strSopWebServerUrl);
        }

        public MessageResult SaveViewport(RequestSaveViewport data)
        {
            GltfManager manager = new GltfManager(m_dataManager);
            return manager.SaveViewport(data);
        }

        public MessageResult SaveOrthoViewport(RequestSaveOrthoViewport data)
        {
            GltfManager manager = new GltfManager(m_dataManager);
            return manager.SaveOrthoViewport(data);
        }

        public ResponseFakeWall RequestFakeWalls(RequestFakeWall data)
        {
            FakeWallManager fakeWallManager = new FakeWallManager(m_dataManager);
            return fakeWallManager.RequestFakeWalls(data);
        }

        public ResponseBuildingGroupData RequestBuildingGroupData(RequestBuildingGroupData data)
        {
            LoadManager loadManager = new LoadManager(m_dataManager);
            return loadManager.LoadBuildingGroupDatas(data);
        }

        public ResponseBuildingData RequestBuildingData(RequestBuildingData data)
        {
            LoadManager loadManager = new LoadManager(m_dataManager);
            return loadManager.LoadBuildingDatas(data);
        }

        public ResponseAlarmCCTVList RequestAlarmCCTVList(RequestAlarmCCTVList data)
        {
            AlarmManager alarmManager = new AlarmManager(m_dataManager);
            return alarmManager.RequestAlarmCCTVList(data);
        }

        public ResponseAlarmMemoList RequestAlarmMemoList(RequestAlarmMemoList data)
        {
            AlarmManager alarmManager = new AlarmManager(m_dataManager);
            return alarmManager.RequestAlarmMemoList(data);
        }

        public ResponseAlarmMemoList SaveAlarmMemoList(SaveAlarmMemoList data)
        {
            AlarmManager alarmManager = new AlarmManager(m_dataManager);
            return alarmManager.SaveAlarmMemoList(data);
        }

        public ResponseSensorServerStatus RequestSensorServerStatus(RequestSensorServerStatus data)
        {
            SensorManager sensorManager = new SensorManager(m_dataManager);
            return sensorManager.RequestSensorServerStatus(data);
        }

        public ResponseSensorServerInfo RequestSensorServerInfo(RequestSensorServerInfo data)
        {
            SensorManager sensorManager = new SensorManager(m_dataManager);
            return sensorManager.RequestSensorServerInfo(data);
        }

        public MessageResult UpdateSensorZoneCCTVs(UpdateSensorZoneCCTVs data)
        {
            AlarmManager alarmManager = new AlarmManager(m_dataManager);
            return alarmManager.UpdateSensorZoneCCTVs(data);
        }

        public ResponseEquipZoneCCTVList RequestEquipZoneCCTVList(RequestEquipZoneCCTV data)
        {
            CCTVManager cctvManager = new CCTVManager(m_dataManager);
            return cctvManager.GetEquipZoneCCTVList(data);
        }

        public ResponseSensorZoneCCTVList RequestSensorZoneCCTVList(RequestSensorZoneCCTV data)
        {
            CCTVManager cctvManager = new CCTVManager(m_dataManager);
            return cctvManager.GetSensorZoneCCTVList(data);
        }

        public MessageResult SaveEquipZoneCCTVList(SaveEquipZoneCCTVList data)
        {
            CCTVManager cctvManager = new CCTVManager(m_dataManager);
            return cctvManager.SaveEquipZoneCCTVList(data);
        }

        public MessageResult SaveSensorZoneCCTVList(SaveSensorZoneCCTVList data)
        {
            CCTVManager cctvManager = new CCTVManager(m_dataManager);
            return cctvManager.SaveSensorZoneCCTVList(data);
        }

        public MessageResult UpdateEquipZones(UpdateEquipZones data)
        {
            EquipZoneManager equipZoneManager = new EquipZoneManager(m_dataManager);
            return equipZoneManager.UpdateEquipZones(data);
        }

        public ResponseAdditableSensors RequestAdditableSensors(RequestAdditableSensors data)
        {
            SensorManager sensorManager = new SensorManager(m_dataManager);
            return sensorManager.GetAdditableSensors(data);
        }
    }
}
