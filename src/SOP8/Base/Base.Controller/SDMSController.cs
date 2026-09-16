using Microsoft.AspNetCore.Mvc;
using Base.SDMS.IBLL;
using Base.SDMS.IBLL.Request;
using Base.SDMS.IBLL.Response;
using Response;

namespace Base.Controller
{
    using Options;

    using Microsoft.AspNetCore.Cors;

    [Route("api/[controller]/[action]")]
    [ApiController]
    public class SDMSController : ControllerBase
    {
        private IProcessManager m_processManager = null;
        private IAlarmOption m_alarmOption = null;

        public SDMSController(IProcessManager processManager, IAlarmOption alarmOption)
        {
            m_processManager = processManager;
            m_alarmOption = alarmOption;
        }

        [EnableCors("UnEPolicy")]
        [HttpPost]
        public IActionResult RequestAlarm([FromBody] RequestAlarm data)
        {
            ResponseAlarm alarms = m_processManager.RequestAlarm(data);
            return Ok(alarms);
        }

        [EnableCors("UnEPolicy")]
        [HttpPost]
        public IActionResult RequestTodayAlarms([FromBody] RequestTodayAlarms data)
        {
            ResponseAlarm alarms = m_processManager.RequestTodayAlarms(data);
            return Ok(alarms);
        }

        [EnableCors("UnEPolicy")]
        [HttpPost]
        public IActionResult RequestSensorList([FromBody] RequestSensorList data)
        {
            ResponseSensorList sensors = m_processManager.RequestSensorList(data);
            return Ok(sensors);
        }

        [EnableCors("UnEPolicy")]
        [HttpPost]
        public IActionResult RequestZoneSensorList([FromBody] RequestZoneSensorList data)
        {
            ResponseSensorList sensors = m_processManager.RequestZoneSensorList(data);
            return Ok(sensors);
        }

        [EnableCors("UnEPolicy")]
        [HttpPost]
        public IActionResult RequestAlarmMemo([FromBody] RequestAlarmMemo data)
        {
            ResponseAlarmMemo response = m_processManager.RequestAlarmMemo(data);
            return Ok(response);
        }

        [EnableCors("UnEPolicy")]
        [HttpPost]
        public IActionResult RequestAlarmMemoList([FromBody] RequestAlarmMemoList data)
        {
            ResponseAlarmMemoList response = m_processManager.RequestAlarmMemoList(data);
            return Ok(response);
        }

        [EnableCors("UnEPolicy")]
        [HttpPost]
        public IActionResult SaveAlarmMemo([FromBody] SaveAlarmMemo data)
        {
            ResponseAlarmMemo response = m_processManager.SaveAlarmMemo(data);
            return Ok(response);
        }

        [EnableCors("UnEPolicy")]
        [HttpPost]
        public IActionResult SaveAlarmMemoList([FromBody] SaveAlarmMemoList data)
        {
            ResponseAlarmMemoList response = m_processManager.SaveAlarmMemoList(data);
            return Ok(response);
        }

        [EnableCors("UnEPolicy")]
        [HttpPost]
        public IActionResult ClearAlarm([FromBody] ClearAlarm data)
        {
            MessageResult response = m_processManager.ClearAlarm(data, m_alarmOption.SOPWebServerURL);
            return Ok(response);
        }

        [EnableCors("UnEPolicy")]
        [HttpPost]
        public IActionResult ClearAlarmList([FromBody] ClearAlarmList data)
        {
            MessageResult response = m_processManager.ClearAlarmList(data, m_alarmOption.SOPWebServerURL);
            return Ok(response);
        }

        [EnableCors("UnEPolicy")]
        [HttpPost]
        public IActionResult ClearAllAlarm([FromBody] ClearAllAlarm data)
        {
            MessageResult response = m_processManager.ClearAllAlarm(data, m_alarmOption.SOPWebServerURL);
            return Ok(response);
        }

        [EnableCors("UnEPolicy")]
        [HttpPost]
        public IActionResult BeginAlarmSop([FromBody] RequestBeginSop data)
        {
            MessageResult response = m_processManager.BeginAlarmSop(data, m_alarmOption.SOPWebServerURL);
            return Ok(response);
        }
        
        [EnableCors("UnEPolicy")]
        [HttpPost]
        public IActionResult RequestBuildingGroupList([FromBody] RequestBuildingGroupList data)
        {
            ResponseBuildingGroupList response = m_processManager.RequestBuildingGroupList(data);
            return Ok(response);
        }

        [EnableCors("UnEPolicy")]
        [HttpPost]
        public IActionResult RequestAlarmNotificationMessage([FromBody] RequestAlarmNotification data)
        {
            ResponseAlarmNotifications response = m_processManager.RequestAlarmNotification(data);
            return Ok(response);
        }

        [EnableCors("UnEPolicy")]
        [HttpPost]
        public IActionResult RequestSaveAlarmNotificationMessage([FromBody] RequestSaveAlarmNotification data)
        {
            ResponseAlarmNotification response = m_processManager.SaveAlarmNotification(data);
            return Ok(response);
        }

        [EnableCors("UnEPolicy")]
        [HttpPost]
        public IActionResult RequestDeleteAlarmNotificationMessage([FromBody] RequestDeleteAlarmNotification data)
        {
            MessageResult response = m_processManager.DeleteAlarmNotification(data);
            return Ok(response);
        }

        [EnableCors("UnEPolicy")]
        [HttpPost]
        public IActionResult RequestGltfModelList([FromBody] RequestGltfModelList data)
        {
            ResponseGltfModelList response = m_processManager.RequestGltfModelList(data);
            return Ok(response);
        }

        [EnableCors("UnEPolicy")]
        [HttpPost]
        public IActionResult UpdateSensorList([FromBody] UpdateSensorData data)
        {
            MessageResult response = m_processManager.UpdateSensorList(data);
            return Ok(response);
        }

        [EnableCors("UnEPolicy")]
        [HttpPost]
        public IActionResult UpdateFakeWallList([FromBody] RequestUpdateFakeWall data)
        {
            MessageResult response = m_processManager.UpdateFakeWallList(data);
            return Ok(response);
        }

        [EnableCors("UnEPolicy")]
        [HttpPost]
        public IActionResult RequestZoneInfo([FromBody] RequestZone data)
        {
            ResponseZone response = m_processManager.RequestZoneInfo(data);
            return Ok(response);
        }

        [EnableCors("UnEPolicy")]
        [HttpPost]
        public IActionResult NotifyAlarm([FromBody] NotifyAlarm data)
        {
            ResponseNotifyAlarm response = m_processManager.NotifyAlarm(data, m_alarmOption.SOPWebServerURL);
            return Ok(response);
        }

        // 수동신고
        [EnableCors("UnEPolicy")]
        [HttpPost]
        public IActionResult RequestManualReport([FromBody] RequestManualReport data)
        {
            MessageResult response = m_processManager.RequestManualReport(data, m_alarmOption.SOPWebServerURL);
            return Ok(response);
        }

        [EnableCors("UnEPolicy")]
        [HttpPost]
        public IActionResult SaveViewport([FromBody] RequestSaveViewport data)
        {
            MessageResult response = m_processManager.SaveViewport(data);
            return Ok(response);
        }

        [EnableCors("UnEPolicy")]
        [HttpPost]
        public IActionResult SaveOrthoViewport([FromBody] RequestSaveOrthoViewport data)
        {
            MessageResult response = m_processManager.SaveOrthoViewport(data);
            return Ok(response);
        }

        [EnableCors("UnEPolicy")]
        [HttpPost]
        public IActionResult RequestFakeWalls([FromBody] RequestFakeWall data)
        {
            ResponseFakeWall response = m_processManager.RequestFakeWalls(data);
            return Ok(response);
        }

        [EnableCors("UnEPolicy")]
        [HttpPost]
        public IActionResult RequestBuildingGroupDatas([FromBody] RequestBuildingGroupData data)
        {
            ResponseBuildingGroupData response = m_processManager.RequestBuildingGroupData(data);
            return Ok(response);
        }

        [EnableCors("UnEPolicy")]
        [HttpPost]
        public IActionResult RequestBuildingDatas([FromBody] RequestBuildingData data)
        {
            ResponseBuildingData response = m_processManager.RequestBuildingData(data);
            return Ok(response);
        }

        [EnableCors("UnEPolicy")]
        [HttpPost]
        public IActionResult RequestAlarmCCTVs([FromBody] RequestAlarmCCTVList data)
        {
            ResponseAlarmCCTVList response = m_processManager.RequestAlarmCCTVList(data);
            return Ok(response);
        }

        [EnableCors("UnEPolicy")]
        [HttpPost]
        public IActionResult RequestSensorServerStatus([FromBody] RequestSensorServerStatus data)
        {
            ResponseSensorServerStatus response = m_processManager.RequestSensorServerStatus(data);
            return Ok(response);
        }

        [EnableCors("UnEPolicy")]
        [HttpPost]
        public IActionResult RequestSensorServerInfo([FromBody] RequestSensorServerInfo data)
        {
            ResponseSensorServerInfo response = m_processManager.RequestSensorServerInfo(data);
            return Ok(response);
        }

        [EnableCors("UnEPolicy")]
        [HttpPost]
        public IActionResult UpdateSensorZoneCCTVs([FromBody] UpdateSensorZoneCCTVs data)
        {
            MessageResult response = m_processManager.UpdateSensorZoneCCTVs(data);
            return Ok(response);
        }

        [EnableCors("UnEPolicy")]
        [HttpPost]
        public IActionResult RequestEquipZoneCCTVList([FromBody] RequestEquipZoneCCTV data)
        {
            ResponseEquipZoneCCTVList response = m_processManager.RequestEquipZoneCCTVList(data);
            return Ok(response);
        }

        [EnableCors("UnEPolicy")]
        [HttpPost]
        public IActionResult RequestSensorZoneCCTVList([FromBody] RequestSensorZoneCCTV data)
        {
            ResponseSensorZoneCCTVList response = m_processManager.RequestSensorZoneCCTVList(data);
            return Ok(response);
        }

        [EnableCors("UnEPolicy")]
        [HttpPost]
        public IActionResult SaveEquipZoneCCTVList([FromBody] SaveEquipZoneCCTVList data)
        {
            MessageResult response = m_processManager.SaveEquipZoneCCTVList(data);
            return Ok(response);
        }

        [EnableCors("UnEPolicy")]
        [HttpPost]
        public IActionResult SaveSensorZoneCCTVList([FromBody] SaveSensorZoneCCTVList data)
        {
            MessageResult response = m_processManager.SaveSensorZoneCCTVList(data);
            return Ok(response);
        }

        [EnableCors("UnEPolicy")]
        [HttpPost]
        public IActionResult UpdateEquipZoneList([FromBody] UpdateEquipZones data)
        {
            MessageResult response = m_processManager.UpdateEquipZones(data);
            return Ok(response);
        }

        [EnableCors("UnEPolicy")]
        [HttpPost]
        public IActionResult RequestAdditableSensors([FromBody] RequestAdditableSensors data)
        {
            ResponseAdditableSensors response = m_processManager.RequestAdditableSensors(data);
            return Ok(response);
        }
    }
}
