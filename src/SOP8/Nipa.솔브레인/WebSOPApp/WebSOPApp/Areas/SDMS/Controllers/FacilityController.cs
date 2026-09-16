using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Cors;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using dnsDapperDBUtil.DataAccessLayer.IDAL;
using Soulbrain.BLL;
using Soulbrain.BLL.Response;


namespace WebSOPApp.Areas.SDMS.Controllers
{
    [EnableCors("UnEPolicy")]
    [Route("SDMS/[controller]/[action]")]
    [ApiController]
    public class FacilityController : Controller
    {
        private ProcessManager m_processManager = null;

        public FacilityController(IDataManager dataManager)
        {
            m_processManager = new ProcessManager(dataManager);
        }

        [EnableCors("UnEPolicy")]
        [HttpPost]
        public IActionResult RequestFacilityModelList()
        {
            ResponseFacilityModelList response = m_processManager.GetFacilityModelList();
            return Ok(response);
        }

        [EnableCors("UnEPolicy")]
        [HttpPost]
        public IActionResult RequestSaveFcltyViewport([FromBody] Soulbrain.BLL.Request.RequestSaveFcltyViewport data)
        {
            Response.MessageResult response = m_processManager.SaveFcltyViewport(data);
            return Ok(response);
        }

        [EnableCors("UnEPolicy")]
        [HttpPost]
        public IActionResult RequestFacilityHistory([FromBody] Soulbrain.BLL.Request.RequestFacilityHistory data)
        {
            ResponseFacilityHistory response = m_processManager.GetFacilityHistory(data);
            return Ok(response);
        }

        [EnableCors("UnEPolicy")]
        [HttpPost]
        public IActionResult RequestPowerHistory([FromBody] Soulbrain.BLL.Request.RequestFacilityHistory data)
        {
            ResponsePowerHistory response = m_processManager.GetPowerHistory(data);
            return Ok(response);
        }

        [EnableCors("UnEPolicy")]
        [HttpPost]
        public IActionResult RequestFcltyPresvList()
        {
            ResponseFcltyPresvList response = m_processManager.GetFcltyPresvList();
            return Ok(response);
        }

        [EnableCors("UnEPolicy")]
        [HttpPost]
        public IActionResult RequestFcltyAnalysis([FromBody] Soulbrain.BLL.Request.RequestFacilityHistory data)
        {
            ResponseFcltyAnalysis response = m_processManager.GetFcltyAnalysis(data);
            return Ok(response);
        }

        [EnableCors("UnEPolicy")]
        [HttpPost]
        public IActionResult RequestFacilityMesures([FromBody] Soulbrain.BLL.Request.RequestFacilityMesures data)
        {
            ResponseFacilityMesureData response = m_processManager.GetFacilityMesures(data);
            return Ok(response);
        }
    }
}
