using Base.SDMS.IBLL.Response;
using Response;

namespace Base.SDMS.IBLL
{
    using Request;

    public interface IProcessManager
    {
        ResponseAlarm RequestAlarm(RequestAlarm data);
        ResponseAlarm RequestTodayAlarms(RequestTodayAlarms data);
        ResponseSensorList RequestSensorList(RequestSensorList data);
        ResponseSensorList RequestZoneSensorList(RequestZoneSensorList data);
        ResponseAlarmMemo RequestAlarmMemo(RequestAlarmMemo data);
        ResponseAlarmMemo SaveAlarmMemo(SaveAlarmMemo data);
        MessageResult ClearAlarm(ClearAlarm data, string strSopWebServerUrl);
        MessageResult ClearAlarmList(ClearAlarmList data, string strSopWebServerUrl);
        MessageResult ClearAllAlarm(ClearAllAlarm data, string strSopWebServerUrl);
        MessageResult BeginAlarmSop(RequestBeginSop data, string strSopWebServerUrl);
        ResponseBuildingGroupList RequestBuildingGroupList(RequestBuildingGroupList data);
        ResponseAlarmPosition RequestAlarmPosition(RequestAlarmPosition data);
        ResponseAlarmNotifications RequestAlarmNotification(RequestAlarmNotification data);
        ResponseAlarmNotification SaveAlarmNotification(RequestSaveAlarmNotification data);
        MessageResult DeleteAlarmNotification(RequestDeleteAlarmNotification data);
        ResponseGltfModelList RequestGltfModelList(RequestGltfModelList data);
        MessageResult UpdateSensorList(UpdateSensorData data);
        MessageResult UpdateFakeWallList(RequestUpdateFakeWall data);
        ResponseZone RequestZoneInfo(RequestZone data);
        ResponseNotifyAlarm NotifyAlarm(NotifyAlarm data, string strSopWebServerUrl);
        MessageResult RequestManualReport(RequestManualReport data, string strSopWebServerUrl);
        MessageResult SaveViewport(RequestSaveViewport data);
        MessageResult SaveOrthoViewport(RequestSaveOrthoViewport data);
        ResponseFakeWall RequestFakeWalls(RequestFakeWall data);
        ResponseBuildingGroupData RequestBuildingGroupData(RequestBuildingGroupData data);
        ResponseBuildingData RequestBuildingData(RequestBuildingData data);
        ResponseAlarmCCTVList RequestAlarmCCTVList(RequestAlarmCCTVList data);
        ResponseAlarmMemoList RequestAlarmMemoList(RequestAlarmMemoList data);
        ResponseAlarmMemoList SaveAlarmMemoList(SaveAlarmMemoList data);
        ResponseSensorServerStatus RequestSensorServerStatus(RequestSensorServerStatus data);
        ResponseSensorServerInfo RequestSensorServerInfo(RequestSensorServerInfo data);
        MessageResult UpdateSensorZoneCCTVs(UpdateSensorZoneCCTVs data);
        ResponseEquipZoneCCTVList RequestEquipZoneCCTVList(RequestEquipZoneCCTV data);
        ResponseSensorZoneCCTVList RequestSensorZoneCCTVList(RequestSensorZoneCCTV data);
        MessageResult SaveEquipZoneCCTVList(SaveEquipZoneCCTVList data);
        MessageResult SaveSensorZoneCCTVList(SaveSensorZoneCCTVList data);
        MessageResult UpdateEquipZones(UpdateEquipZones data);
        ResponseAdditableSensors RequestAdditableSensors(RequestAdditableSensors data);
    }
}
