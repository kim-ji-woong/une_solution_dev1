using Pohang.IBLL.Request;
using Pohang.IBLL.Response;
using Pohang.IBLL;
using Microsoft.AspNetCore.Mvc;

namespace WebSOPApp.ClientApp.Areas.Pohang.Controllers
{
    
    using Microsoft.AspNetCore.Cors;
    [EnableCors("UnEPolicy")]
    [Route("api/[controller]/[action]")]
    [ApiController]
    public class PohangController : ControllerBase
    {
        private IProcessManager m_processManager;
        
        public PohangController(IProcessManager processManager)
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
        public IActionResult RequestExternalPublicData()
        {
            ResponseExternalPublicData publicData = m_processManager.RequestExternalPublicData();
            return Ok(publicData);
        }

        [HttpPost]
        public IActionResult RequestConvertSpecialCharacters(RequestConvertSpecialCharacters data)
        {
            ResponseConvertSpecialCharacters response = m_processManager.RequestConvertSpecialCharacters(data);
            return Ok(response);
        }
    }
}