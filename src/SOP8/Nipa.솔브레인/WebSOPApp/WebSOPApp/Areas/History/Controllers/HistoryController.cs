using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Cors;
using Base.History.IBLL;
using Base.History.IBLL.Request;
using Base.History.IBLL.Response;
using Soulbrain.BLL.Request;
using dnsExcelReport.Models;

namespace WebSOPApp.Areas.History.Controllers
{
    [EnableCors("UnEPolicy")]
    [Route("History/History/[action]")]
    [ApiController]
    public class HistoryController : Controller
    {
        private IProcessManager m_processManager = null;

        public HistoryController(IProcessManager processManager)
        {
            m_processManager = processManager;
        }

        [HttpPost]
        public IActionResult RequestSensorDetectHistory([FromBody] RequestSensorDetectHistoryEx data)
        {
            var sensors = WebSOPApp.Startup.ConfigManager.Site.Sensors;

            if (sensors != null)
            {
                if (sensors.PermitZones != null)
                {
                    var zoneNos = sensors.PermitZones.ZoneNo;
                    var exceptSensorNos = sensors.PermitZones.ExceptSensorNo;

                    if (zoneNos != null && zoneNos.Count > 0 && exceptSensorNos != null && exceptSensorNos.Count > 0)
                    {
                        data.PermitZones = new RequestSensorDetectHistoryEx._PermitZones();
                        data.PermitZones.ZoneNo = zoneNos;
                        data.PermitZones.ExceptSensorNo = exceptSensorNos;
                    }
                }

                if (sensors.PermitSensorNo != null)
                    data.PermitSensorNo = sensors.PermitSensorNo;
            }

            ResponseSensorDetectHistory response = m_processManager.RequestSensorDetectHistory(data);
            return Ok(response);
        }

        [HttpPost]
        public IActionResult RequestSensorAnalysisHistory([FromBody] RequestSensorAnalysisHistoryEx data)
        {
            var sensors = WebSOPApp.Startup.ConfigManager.Site.Sensors;

            if (sensors != null)
            {
                if (sensors.PermitZones != null)
                {
                    var zoneNos = sensors.PermitZones.ZoneNo;
                    var exceptSensorNos = sensors.PermitZones.ExceptSensorNo;

                    if (zoneNos != null && zoneNos.Count > 0 && exceptSensorNos != null && exceptSensorNos.Count > 0)
                    {
                        data.PermitZones = new RequestSensorAnalysisHistoryEx._PermitZones();
                        data.PermitZones.ZoneNo = zoneNos;
                        data.PermitZones.ExceptSensorNo = exceptSensorNos;
                    }
                }

                if (sensors.PermitSensorNo != null)
                    data.PermitSensorNo = sensors.PermitSensorNo;
            }

            ResponseSensorAnalysisHistory response = m_processManager.RequestSensorAnalysisHistory(data);
            return Ok(response);
        }

        [HttpPost]
        public IActionResult DownloadAllSensorDetectHistory([FromBody] RequestExcelDetectHistoryEx data)
        {
            var sensors = WebSOPApp.Startup.ConfigManager.Site.Sensors;

            if (sensors != null)
            {
                if (sensors.PermitZones != null)
                {
                    var zoneNos = sensors.PermitZones.ZoneNo;
                    var exceptSensorNos = sensors.PermitZones.ExceptSensorNo;

                    if (zoneNos != null && zoneNos.Count > 0 && exceptSensorNos != null && exceptSensorNos.Count > 0)
                    {
                        data.PermitZones = new RequestExcelDetectHistoryEx._PermitZones();
                        data.PermitZones.ZoneNo = zoneNos;
                        data.PermitZones.ExceptSensorNo = exceptSensorNos;
                    }
                }

                if (sensors.PermitSensorNo != null)
                    data.PermitSensorNo = sensors.PermitSensorNo;
            }

            ResponseExcelInfo response = m_processManager.DownloadExcelAllSensorDetectHistory(data);

            if (response.Success == false || response.Bytes == null)
                return Ok(response);

            return File(response.Bytes, "application/vnd.ms-excel", response.FileName);
        }

        [HttpPost]
        public IActionResult DownloadAllSensorAnalysisHistory([FromBody] RequestExcelAnalysisHistoryEx data)
        {
            var sensors = WebSOPApp.Startup.ConfigManager.Site.Sensors;

            if (sensors != null)
            {
                if (sensors.PermitZones != null)
                {
                    var zoneNos = sensors.PermitZones.ZoneNo;
                    var exceptSensorNos = sensors.PermitZones.ExceptSensorNo;

                    if (zoneNos != null && zoneNos.Count > 0 && exceptSensorNos != null && exceptSensorNos.Count > 0)
                    {
                        data.PermitZones = new RequestExcelAnalysisHistoryEx._PermitZones();
                        data.PermitZones.ZoneNo = zoneNos;
                        data.PermitZones.ExceptSensorNo = exceptSensorNos;
                    }
                }

                if (sensors.PermitSensorNo != null)
                    data.PermitSensorNo = sensors.PermitSensorNo;
            }

            ResponseExcelInfo response = m_processManager.DownloadExcelAllSensorAnalysisHistory(data);

            if (response.Success == false || response.Bytes == null)
                return Ok(response);

            return File(response.Bytes, "application/vnd.ms-excel", response.FileName);
        }
    }
}
