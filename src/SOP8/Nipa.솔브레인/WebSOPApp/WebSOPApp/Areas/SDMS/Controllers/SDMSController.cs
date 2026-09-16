using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Cors;
using dnsDapperDBUtil.DataAccessLayer.IDAL;
using Soulbrain.BLL;
using Soulbrain.BLL.Response;
using Soulbrain.BLL.Request;
using Base.SDMS.IBLL.Request;
using Base.SDMS.IBLL.Response;
using System.Collections.Generic;

namespace WebSOPApp.Areas.SDMS.Controllers
{
    [EnableCors("UnEPolicy")]
    [Route("SDMS/SDMS/[action]")]
    [ApiController]
    public class SDMSController : Controller
    {
        private ProcessManager m_processManager = null;
        private Base.SDMS.IBLL.IProcessManager m_sdmsProcessManager = null;

        public SDMSController(IDataManager dataManager, Base.SDMS.IBLL.IProcessManager sdmsProcessManager)
        {
            m_processManager = new ProcessManager(dataManager);
            m_sdmsProcessManager = sdmsProcessManager;
        }

        [EnableCors("UnEPolicy")]
        [HttpPost]
        public IActionResult RequesAllFacility()
        {
            ResponseAllFacility response = m_processManager.RequestAllFacility();
            return Ok(response);
        }

        [EnableCors("UnEPolicy")]
        [HttpPost]
        public IActionResult RequesFacilityList([FromBody] RequestFacilityList data)
        {
            ResponseAllFacility response = m_processManager.RequestFacilityList(data);
            return Ok(response);
        }

        [EnableCors("UnEPolicy")]
        [HttpPost]
        public IActionResult RequesFacilityData([FromBody] RequestFacilityData data)
        {
            ResponseFacilityData response = m_processManager.RequestFacilityData(data);
            return Ok(response);
        }

        [EnableCors("UnEPolicy")]
        [HttpPost]
        public IActionResult RequestTodayAlarms([FromBody] RequestTodayAlarms data)
        {
            ResponseAlarm alarms = m_sdmsProcessManager.RequestTodayAlarms(data);
            ResponseAlarmEx response = new ResponseAlarmEx(alarms.Success, alarms.Message);

            if (response.Success)
            {
                List<int> zoneNos = Startup.ConfigManager.Site.ZoneNos;

                foreach (var alarmData in alarms.AlarmDatas)
                {
                    if (CheckAlarmZoneNo(zoneNos, alarmData))
                    {
                        AlarmDataEx _alarmData = new AlarmDataEx(alarmData);
                        _alarmData.IsSensorAlarm = _alarmData.FacilityType < 300330;
                        response.AlarmDatas.Add(_alarmData);
                    }
                }
            }

            return Ok(response);
        }

        private bool CheckAlarmZoneNo(List<int> zoneNos, Base.SDMS.IBLL.Models.AlarmData alarmData)
        {
            if (zoneNos == null)
                return true;

            var sensors = Startup.ConfigManager.Site.Sensors;

            if (sensors == null)
            {
                foreach (int zoneNo in zoneNos)
                {
                    if (zoneNo == alarmData.ZoneNo)
                        return true;
                }

                return false;
            }

            if (sensors.PermitZones?.ZoneNo != null)
            {
                foreach (int zoneNo in sensors.PermitZones.ZoneNo)
                {
                    if (zoneNo == alarmData.ZoneNo)
                    {
                        if (sensors.PermitZones.ExceptSensorNo != null)
                        {
                            foreach (int sensorNo in sensors.PermitZones.ExceptSensorNo)
                            {
                                if (sensorNo == alarmData.SensorNo)
                                    return false;
                            }
                        }

                        return true;
                    }
                }

                if (sensors.PermitSensorNo != null)
                {
                    foreach (int sensorNo in sensors.PermitSensorNo)
                    {
                        if (sensorNo == alarmData.SensorNo)
                            return true;
                    }
                }
            }

            return false;
        }

        [EnableCors("UnEPolicy")]
        [HttpPost]
        public IActionResult RequestSimulationPoi()
        {
            ResponseSimulationPoi response = m_processManager.RequestSimulationPois();
            return Ok(response);
        }

        [EnableCors("UnEPolicy")]
        [HttpPost]
        public IActionResult RequesAllCCTVs()
        {
            ResponseAllCCTVs response = m_processManager.RequestAllCCTVs();
            return Ok(response);
        }

        [EnableCors("UnEPolicy")]
        [HttpPost]
        public IActionResult RequesSensorInfo([FromBody] RequestSensorInfo data)
        {
            ResponseSensorinfo response = m_processManager.RequestSensorInfo(data);
            return Ok(response);
        }
        
        [EnableCors("UnEPolicy")]
        [HttpPost]
        public IActionResult RequestScannerInfo([FromBody] RequestScannerInfo data)
        {
            ResponseScannerInfo response = m_processManager.RequestScannerInfo(data);
            return Ok(response);
        }
        
        [EnableCors("UnEPolicy")]
        [HttpPost]
        public IActionResult RequestScannerTagInfo([FromBody] RequestScannerTagInfo data)
        {
            ResponseScannerTagInfo response = m_processManager.RequestScannerTagInfo(data);
            return Ok(response);
        }
        
        [EnableCors("UnEPolicy")]
        [HttpPost]
        public IActionResult RequestScannerEmergencyInfo([FromBody] RequestScannerEmergencyInfo data)
        {
            ResponseScannerEmergencyInfo response = m_processManager.RequestScannerEmergencyInfo(data);
            return Ok(response);
        }

        [EnableCors("UnEPolicy")]
        [HttpPost]
        public IActionResult RequestAdditableSensors([FromBody] Soulbrain.BLL.Request.RequestAdditableSensors data)
        {
            Soulbrain.BLL.Response.ResponseAdditableSensors response = m_processManager.RequestAdditableSensors(data);
            return Ok(response);
        }

        [EnableCors("UnEPolicy")]
        [HttpPost]
        public IActionResult RequestCCTVList([FromBody] RequestCCTVList data)
        {
            var response = m_processManager.RequestCCTVList(data);
            return Ok(response);
        }

        [EnableCors("UnEPolicy")]
        [HttpPost]
        public IActionResult RequestDustMeasurementInfo()
        {
            ResponseDustMeasurementInfo response = m_processManager.RequestDustMeasurementInfo();
            return Ok(response);
        }
        
        [EnableCors("UnePolicy")]
        [HttpPost]
        public IActionResult RequestDustForecastInfo([FromBody] RequestDustForecastInfo data)
        {
            ResponseDustForecastInfo response = m_processManager.RequestDustForecastInfo(data);
            return Ok(response);
        }
        
        [EnableCors("UnEPolicy")]
        [HttpPost]
        public IActionResult RequestWaterGatherInfo([FromBody] RequestWaterGatherInfo data)
        {
            ResponseWaterGatherInfo response = m_processManager.RequestWaterGatherInfo(data);
            return Ok(response);
        }

        [EnableCors("UnePolicy")]
        [HttpPost]
        public IActionResult RequestWaterGatherForecastInfo([FromBody] RequestWaterGatherForecastInfo data)
        {
            ResponseWaterGatherForecast response = m_processManager.RequestWaterGatherForecastInfo(data);
            return Ok(response);
        }
    }
}
