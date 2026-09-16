using Microsoft.AspNetCore.Mvc;
using SDMS.BLL.Models.Alarm;
using System.Collections.Generic;
using SDMS.BLL.Models.Request;
using SDMS.BLL.Models.Response;
using SDMS.Model.CCTV;
using System.Collections;
using Microsoft.AspNetCore.Cors;

namespace WebSOPApp.Areas.SDMS.Controllers
{
    [Area("SDMS")]
    public class SDMSController : Controller
    {
        private global::SDMS.BLL.ProcessManager m_processManager = null;
        public SDMSController(global::SDMS.IDAL.IDataManager sdmsDataManager, global::Common.IDAL.IDataManager commonDataManager, global::SOPManager.IDAL.IDataManager sopDataManager, global::TeamEditor.IDAL.IDataManager teamDataManager)
        {          
            m_processManager = new global::SDMS.BLL.ProcessManager(commonDataManager, sdmsDataManager, sopDataManager, teamDataManager);
            m_processManager.SOPWebServerURL = Startup.ConfigManager.Site.SOPWebServerURL;
            m_processManager.StreamServerURL = Startup.ConfigManager.Site.StreamServerURL;
        }

        [EnableCors("UnEPolicy")]
        [HttpPost]
        public ResponseAlarm DisplayAlarm()
        {
            ResponseAlarm alarms = new ResponseAlarm();
            alarms.AlarmDatas = m_processManager.GetLoadManager().AlarmDatas;
            alarms.AllAlarmDatas = m_processManager.GetLoadManager().AllAlarmDatas;
            if (alarms.AlarmDatas == null || alarms.AllAlarmDatas == null)
                return null;

            return alarms;
        }

        [HttpPost]
        public IActionResult RequestData([FromBody] RequestData data)
        {
            if (data == null)
                return BadRequest();

            if (data.RequestBuildingGroupList != null)
                return RequestBuildingGroupList(data.RequestBuildingGroupList);
            else if (data.RequestGltfDataList != null)
                return RequestGltfDataList(data.RequestGltfDataList);
            else if (data.RequestSaveViewport != null)
                return RequestSaveViewport(data.RequestSaveViewport);
            else if (data.RequestMoveBuildingNameText != null)
                return RequestMoveBuildingNameText(data.RequestMoveBuildingNameText);
            else if (data.RequestMoveEquipZoneNameText != null)
                return RequestMoveEquipZoneNameText(data.RequestMoveEquipZoneNameText);
            else if (data.RequestSensorList != null)
                return RequestSensorList(data.RequestSensorList);
            else if (data.RequestMoveSensor != null)
                return RequestMoveSensor(data.RequestMoveSensor);
            else if (data.RequestMalfunction != null)
                return RequestMalfunction(data.RequestMalfunction);
            else if (data.RequestSituationNotice != null)
                return RequestSituationNotice(data.RequestSituationNotice);
            else if (data.RequestEquipZoneCCTV != null)
                return RequestEquipZoneCCTV(data.RequestEquipZoneCCTV);
            else if (data.RequestEquipZoneCCTVFromSensor != null)
                return RequestEquipZoneCCTVFromSensor(data.RequestEquipZoneCCTVFromSensor);
            else if (data.RequestEquipZoneSensorList != null)
                return RequestEquipZoneSensorList(data.RequestEquipZoneSensorList);
            else if (data.RequestUpdateEquipZoneCCTVs != null)
                return RequestUpdateEquipZoneCCTVs(data.RequestUpdateEquipZoneCCTVs);
            else if (data.RequestGetOrgSensorID != null)
                return GetOrgSensorID(data.RequestGetOrgSensorID);
            else if (data.RequestSensorCount != null)
                return RequestSensorCount(data.RequestSensorCount.SiteID);
            else if (data.RequestStreamServerURL != null)
                return GetStreamServerURL();
            else if (data.RequestFacilityTypes != null)
                return RequestFacilityTypes();
            else if (data.RequestFacilityType != null)
                return RequestFacilityType(data.RequestFacilityType);
            else if (data.RequestAllFacilityInfo != null)
                return RequestAllFacilityInfo();
            else if (data.RequestUpdatePOIPosition != null)
                return RequestUpdatePOIPosition(data.RequestUpdatePOIPosition);
            else if (data.RequestUpdatePOIPositions != null)
                return RequestUpdatePOIPositions(data.RequestUpdatePOIPositions);
            else if (data.RequestUpdateCCTVs != null)
                return RequestUpdateCCTVs(data.RequestUpdateCCTVs);
            else if (data.RequestFacilityInfoData != null)
                return RequestFacilityInfoData(data.RequestFacilityInfoData);
            else if (data.RequestBuildingData != null)
                return RequestBuildingData(data.RequestBuildingData.BuildingName);
            else if (data.RequestBuildingGroupData != null)
                return RequestBuildingGroupData(data.RequestBuildingGroupData.BuildingGroupID);
            else if (data.RequestOuterDatas != null)
                return RequestOuterDatas(data.RequestOuterDatas.SiteIDs);
            else if (data.RequestIndoorDatas != null)
                return RequestIndoorDatas(data.RequestIndoorDatas.ZoneID, data.RequestIndoorDatas.SiteIDs);
            else if (data.RequestSaveIndoorModelViewport != null)
                return RequestSaveIndoorModelViewport(data.RequestSaveIndoorModelViewport);
            else if (data.RequestSaveOrthoModelViewport != null)
                return RequestSaveOrthoModelViewport(data.RequestSaveOrthoModelViewport);
            else if (data.RequestFakeWalls != null)
                return RequestFakeWalls(data.RequestFakeWalls.ZoneID);
            else if (data.RequestUpdateFakeWall != null)
                return RequestUpdateFakeWall(data.RequestUpdateFakeWall);
            else if (data.RequestUpdateFakeWalls != null)
                return RequestUpdateFakeWalls(data.RequestUpdateFakeWalls);
            else if (data.RequestNewCCTVList != null)
                return RequestNewCCTVList();
            else if (data.RequestManualReport != null)
                return RequestManualReport(data.RequestManualReport);
            else if (data.RequestClearManualReport != null)
                return RequestClearManualReport(data.RequestClearManualReport);
            else if (data.RequestTodayAlarmData != null)
                return RequestTodayAlarmData();
            else if (data.RequestGetSiteID != null)
                return RequestGetSiteNo();
            else if (data.RequestGetSpreadMessage != null)
                return RequestGetSpreadMessage();
            else if (data.RequestSetSpreadMessage != null)
                return RequestSetSpreadMessage(data.RequestSetSpreadMessage);
            else if (data.RequestMaterials != null)
                return RequestMaterials();
            else if (data.RequestRangeSensors != null)
                return RequestRangeSensors();
            else if (data.RequestImagePath != null)
                return RequestImagePath(data.RequestImagePath.ZoneID);
            else if (data.RequestWorkerInfos != null)
                return RequestWorkerInfos();
            else if (data.RequestUpdateEquipZoneAreas != null)
                return RequestUpdateEquipZoneAreas(data.RequestUpdateEquipZoneAreas);
            else if (data.RequestEquipZoneAreas != null)
                return RequestEquipZoneAreas(data.RequestEquipZoneAreas);
            else if (data.RequestUpdateSensorEquipZones != null)
                return RequestUpdateSensorEquipZones(data.RequestUpdateSensorEquipZones);
            else if (data.RequestYearStatus != null)
                return RequestYearStatus();

            return null;
        }

        private IActionResult RequestWorkerInfos()
        {
            ResponseWorkerInfos response = global::SDMS.BLL.Models.Data.WorkerManager.GetWorkerInfos();
            return Ok(response);
        }

        private IActionResult RequestRangeSensors()
        {
            ResponseRangeSensors response = global::SDMS.BLL.Models.Data.SensorManager.GetRangeSensors();
            return Ok(response);
        }

        private IActionResult RequestUpdateCCTVs(RequestUpdateCCTVs request)
        {
            MessageResult result = m_processManager.GetSaveManager().UpdateCCTVs(request);
            return Ok(result);
        }

        private IActionResult RequestNewCCTVList()
        {
            ResponseNewCCTVList result = m_processManager.GetLoadManager().GetNewCCTVList();
            return Ok(result);
        }

        private IActionResult RequestFakeWalls(int nZoneID)
        {
            ResponseFakeWalls result = m_processManager.GetLoadManager().GetFakeWalls(nZoneID);
            return Ok(result);
        }

        private IActionResult RequestUpdateFakeWall(RequestUpdateFakeWall request)
        {
            ResponseUpdateFakeWall result = m_processManager.GetLoadManager().UpdateFakeWall(request);
            return Ok(result);
        }

        private IActionResult RequestUpdateFakeWalls(RequestUpdateFakeWalls request)
        {
            ResponseUpdateFakeWalls result = m_processManager.GetLoadManager().UpdateFakeWalls(request);
            return Ok(result);
        }

        private IActionResult RequestSaveOrthoModelViewport(RequestSaveOrthoModelViewport data)
        {
            MessageResult result = m_processManager.GetSaveManager().UpdateOrthoModelViewport(data);
            return Ok(result);
        }

        private IActionResult RequestSaveIndoorModelViewport(RequestSaveIndoorModelViewport data)
        {
            MessageResult result = m_processManager.GetSaveManager().UpdateIndoorModelViewport(data);
            return Ok(result);
        }

        private IActionResult RequestIndoorDatas(int nZoneID, List<int> siteNos)
        {
            ResponseIndoorDatas result = m_processManager.GetLoadManager().RequestIndoorDatas(nZoneID, siteNos);
            return Ok(result);
        }

        private IActionResult RequestOuterDatas(List<int> siteNos)
        {
            ResponseBuildingGroupList result = m_processManager.GetLoadManager().RequestOuterDatas(siteNos);
            return Ok(result);
        }

        private IActionResult RequestFacilityInfoData(RequestFacilityInfoData request)
        {
            ResponseFacilityInfoData result = m_processManager.GetLoadManager().GetFacilityInfoDatas(request.ModelName);
            return Ok(result);
        }

        private IActionResult RequestAllFacilityInfo()
        {
            ResponseAllFacilityInfo result = m_processManager.GetLoadManager().GetAllFacilityInfos();
            return Ok(result);
        }
        private IActionResult RequestBuildingData(string strBuildingName)
        {
            ResponseBuildingData result = m_processManager.GetLoadManager().GetBuildingDatas(strBuildingName);
            return Ok(result);
        }

        private IActionResult RequestBuildingGroupData(int nBuildingGroupID)
        {
            ResponseBuildingGroupData result = m_processManager.GetLoadManager().GetBuildingGroupDatas(nBuildingGroupID);
            return Ok(result);
        }

        private IActionResult RequestUpdatePOIPosition(RequestUpdatePOIPosition request)
        {
            MessageResult result = m_processManager.GetSaveManager().UpdatePOIPosition(request);
            return Ok(result);
        }

        private IActionResult RequestUpdatePOIPositions(RequestUpdatePOIPositions request)
        {
            MessageResult result = m_processManager.GetSaveManager().UpdatePOIPositions(request);
            return Ok(result);
        }

        private IActionResult RequestSensorCount(int? nSiteNo)
        {
            ResponseSensorCount result = m_processManager.GetLoadManager().GetSensorCount(nSiteNo);
            return Ok(result);
        }

        private IActionResult RequestMoveSensor(RequestMoveSensor request)
        {
            MessageResult result = m_processManager.GetLoadManager().MoveSensor(request);
            return Ok(result);
        }

        private IActionResult RequestSensorList(RequestSensorList request)
        {
            MessageResult result = m_processManager.GetLoadManager().GetSensorList(request);
            return Ok(result);
        }

        private IActionResult RequestMoveEquipZoneNameText(RequestMoveEquipZoneNameText request)
        {
            MessageResult result = m_processManager.GetSaveManager().MoveEquipZoneNameText(request);
            return Ok(result);
        }

        private IActionResult RequestMoveBuildingNameText(RequestMoveBuildingNameText request)
        {
            MessageResult result = m_processManager.GetSaveManager().MoveBuildingNameText(request);
            return Ok(result);
        }

        private IActionResult RequestSaveViewport(RequestSaveViewport request)
        {
            MessageResult result = m_processManager.GetSaveManager().SaveViewport(request);
            return Ok(result);
        }

        private IActionResult RequestGltfDataList(RequestGltfDataList request)
        {
            ResponseGltfDataList result = m_processManager.GetLoadManager().RequestGltfModelList(request.UserID, request.SiteIDs/*, Startup.ResourceRootPath*/);
            return Ok(result);
        }

        private IActionResult RequestBuildingGroupList(RequestBuildingGroupList data)
        {
            ResponseBuildingGroupList result = m_processManager.GetLoadManager().RequestBuildingGroupList(data.SiteIDs);
            return Ok(result);
        }

        private IActionResult RequestMalfunction(RequestMalfunction request)
        {
            m_processManager.GetAlarmManager().Malfunction(request);
            return Ok();
        }

        private IActionResult RequestSituationNotice(RequestSituationNotice request)
        {
            m_processManager.GetAlarmManager().SituationNotice(request);
            return Ok();
        }

        private IActionResult RequestManualReport(RequestManualReport request)
        {
            bool result = m_processManager.GetAlarmManager().ManualReport(request);
            return Ok(result);
        }

        private IActionResult RequestClearManualReport(RequestClearManualReport request)
        {
            bool result = m_processManager.GetAlarmManager().ClearManualReport(request);
            return Ok(result);
        }

        private IActionResult RequestEquipZoneCCTV(RequestEquipZoneCCTV request)
        {
            ResponseEquipZoneCCTV result = m_processManager.GetLoadManager().GetEquipZoneCCTV(request.EquipZoneID);
            return Ok(result);
        }

        private IActionResult RequestEquipZoneCCTVFromSensor(RequestEquipZoneCCTVFromSensor request)
        {
            ResponseEquipZoneCCTVFromSensor result = m_processManager.GetLoadManager().GetEquipZoneCCTV(request.SensorType, request.SensorID);
            return Ok(result);
        }

        private IActionResult RequestEquipZoneSensorList(RequestEquipZoneSensorList request)
        {
            ResponseEquipZoneSensorList result = m_processManager.GetLoadManager().GetEquipZoneSensorList(request.SensorType, request.SensorID);
            return Ok(result);
        }

        private IActionResult RequestUpdateEquipZoneCCTVs(RequestUpdateEquipZoneCCTVs request)
        {
            MessageResult result = m_processManager.GetSaveManager().UpdateEquipZoneCCTVs(request);
            return Ok(result);
        }

        public IActionResult GetOrgSensorID(RequestGetOrgSensorID request)
        {
            ArrayList orgSensor = m_processManager.GetLoadManager().GetOrgSensorID(request.SensorZoneID);
            return Ok(orgSensor);
        }

        public IActionResult GetStreamServerURL()
        {
            string strStreamServerURL = m_processManager.StreamServerURL;
            return Ok(strStreamServerURL);
        }

        private IActionResult RequestFacilityTypes()
        {
            ResponseFacilityTypes result = m_processManager.GetLoadManager().GetFacilityTypes();
            return Ok(result);
        }

        private IActionResult RequestFacilityType(RequestFacilityType request)
        {
            ResponseFacilityType result = m_processManager.GetLoadManager().GetFacilityType(request.FacilityTypeID);
            return Ok(result);
        }

        private IActionResult RequestTodayAlarmData()
        {
            ResponseTodayAlarmData result = m_processManager.GetLoadManager().GetTodayAlarmData();
            return Ok(result);
        }

        private IActionResult RequestGetSiteNo()
        {
            //MessageResult result = m_processManager.GetLoadManager().GetSiteNo(request);
            ResponseSiteID result = new ResponseSiteID();

            int? siteNo =  Startup.ConfigManager.Site.SiteNo;
            
            if (siteNo != null)
            {
                result.Success = true;
                result.SiteID = (int)siteNo;
            }
            else
            {
                result.Success = false;
                result.Message = "SiteNo 에 제대로 된 값이 들어가 있지 않습니다.";
            }

            result.Success = true;

            return Ok(result);
        }

        private IActionResult RequestGetSpreadMessage()
        {
            ResponseSpreadMessage result = m_processManager.GetLoadManager().GetSpreadMessage();
            return Ok(result);
        }

        private IActionResult RequestSetSpreadMessage(RequestSetSpreadMessage data)
        {
            MessageResult result = m_processManager.GetSaveManager().SetSpreadMessage(data);
            return Ok(result);
        }

        private IActionResult RequestMaterials()
        {
            ResponseMaterials result = m_processManager.GetLoadManager().GetMaterials();
            return Ok(result);
        }

        private IActionResult RequestImagePath(int ZoneID)
        {
            ResponseImagePath response = m_processManager.GetLoadManager().GetImagePath(ZoneID);
            return Ok(response);
        }

        private IActionResult RequestUpdateEquipZoneAreas(RequestUpdateEquipZoneAreas request)
        {
            MessageResult result = m_processManager.GetSaveManager().UpdateEquipZoneAreas(request);
            return Ok(result);
        }

        private IActionResult RequestEquipZoneAreas(RequestEquipZoneAreas request)
        {
            ResponseEquipZoneAreas result = m_processManager.GetLoadManager().GetEquipZoneAreas(request.ZoneID);
            return Ok(result);
        }

        private IActionResult RequestUpdateSensorEquipZones(RequestUpdateSensorEquipZones request)
        {
            MessageResult result = m_processManager.GetSaveManager().UpdateSensorEquipZones(request);
            return Ok(result);
        }

        private IActionResult RequestYearStatus()
        {
            // 이번 달 포함하여 1년 알람 이력
            int nAgoMonth = 11;

            ResponseWeeklyStatus result = m_processManager.GetLoadManager().GetMonthStatus(nAgoMonth);
            return Ok(result);
        }
    }
}
