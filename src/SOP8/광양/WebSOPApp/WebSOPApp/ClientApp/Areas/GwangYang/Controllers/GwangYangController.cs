using Gwangyang.IBLL;
using Gwangyang.IBLL.Request;
using Gwangyang.IBLL.Response;
using Microsoft.AspNetCore.Mvc;
using Base.TeamEditor.IBLL.Request;
using Base.TeamEditor.IBLL.Response;
using dnsExcelReport.Models;

namespace WebSOPApp.ClientApp.Areas.Gwangyang.Controllers
{
    
    using Microsoft.AspNetCore.Cors;
    [EnableCors("UnEPolicy")]
    [Route("api/[controller]/[action]")]
    [ApiController]
    public class GwangYangController : ControllerBase
    {
        private IProcessManager m_processManager;
        
        public GwangYangController(IProcessManager processManager)
        {
            m_processManager = processManager;
        }
        
        [HttpPost]
        public IActionResult RequestExternalSensorTypes([FromBody] RequestExternalSensorTypes data)
        {
            ResponseExternalSensorTypes sensorTypes = m_processManager.RequestExternalSensorTypes(data);
            return Ok(sensorTypes);
        }
        
        [HttpPost]
        public IActionResult RequestExternalSensorCategories([FromBody] RequestExternalSensorCategories data)
        {
            ResponseExternalSensorCategories sensorCategories = m_processManager.RequestExternalSensorCategories(data);
            return Ok(sensorCategories);
        }

        [HttpPost]
        public IActionResult RequestExternalSensorLink()
        {
            ResponseExternalSensorLink sensorLink = m_processManager.RequestExternalSensorLink();
            return Ok(sensorLink);
        }

        [HttpPost]
        public IActionResult RequestExternalPOIInfo()
        {
            ResponseExternalPOIInfo poiInfo = m_processManager.RequestExternalPOIInfo();
            return Ok(poiInfo);
        }
        
        [HttpPost]
        public IActionResult RequestExternalSensorTypeSubTypes()
        {
            ResponseExternalSensorTypeSubTypes sensorTypeSubTypes = m_processManager.RequestExternalSensorTypeSubTypes();
            return Ok(sensorTypeSubTypes);
        }
        
        [HttpPost]
        public IActionResult RequestExternalSensorHistories([FromBody] RequestExternalSensorHistories data)
        {
            ResponseExternalSensorHistories sensorHistories = m_processManager.RequestExternalSensorHistories(data);
            return Ok(sensorHistories);
        }

        [HttpPost]
        public IActionResult RequestSensorSubTypes()
        {
            ResponseSensorSubTypes sensorSubTypes = m_processManager.RequestSensorSubTypes();
            return Ok(sensorSubTypes);
        }

        [HttpPost]
        public IActionResult RequestExternalMaterialLinks()
        {
            ResponseExternalMaterialLinks materialLinks = m_processManager.RequestExternalMaterialLinks();
            return Ok(materialLinks);
        }

        [HttpPost]
        public IActionResult RequestExternalWeatherData()
        {
            ResponseWeatherData weatherData = m_processManager.RequestExternalWeatherData();
            return Ok(weatherData);
        }

        [HttpPost]
        public IActionResult DownloadRegularTeam([FromBody] RequestDownloadRegularTeam data)
        {
            ResponseExcelInfo response = m_processManager.DownloadExcelRegularTeam(data);

            if (response.Success == false || response.Bytes == null)
                return Ok(response);

            return File(response.Bytes, "application/vnd.ms-excel", response.FileName);
        }
    }
}