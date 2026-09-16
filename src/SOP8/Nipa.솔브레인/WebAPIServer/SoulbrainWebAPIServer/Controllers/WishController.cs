using Microsoft.AspNetCore.Mvc;
using NetTopologySuite.Utilities;
using SoulbrainWebAPIServer.Managers;
using SoulbrainWebAPIServer.Model;

namespace SoulbrainWebAPIServer.Controllers
{
    
    [Route("api/[controller]")]
    [ApiController]
    public class WishController : ControllerBase
    {
        private ProcessManager m_processManager = null;

        public WishController(global::SoulbrainWebAPIServer.Managers.ProcessManager processManager)
        {
            m_processManager = processManager;
        }

        [HttpPost]
        [Route("/WishData/RequestTodayWorkList")]
        [ProducesResponseType(typeof(ResponseTodayWorkList), 200)]
        public IActionResult RequestTodayWorkList()
        {
            ResponseTodayWorkList response = m_processManager.GetTodayWorkList();
            return Ok(response);
        }
        
        [HttpPost]
        [Route("/WishData/RequestCurrentWorkPermitData")]
        [ProducesResponseType(typeof(ResponseCurrentWorkPermitData), 200)]
        public IActionResult RequestCurrentWorkPermitData()
        {
            ResponseCurrentWorkPermitData response = m_processManager.GetCurrentWorkPermitData();
            return Ok(response);
        }
    }
}