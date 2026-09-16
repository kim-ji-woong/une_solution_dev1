using Microsoft.AspNetCore.Mvc;
using SOPWebServer.IBLL;
using SOPWebServer.IBLL.Models.Request;
using Response;

namespace SOPWebServer.Controller
{
    [Route("api/[controller]")]
    [ApiController]
    public class ClearAllController : ControllerBase
    {
        private IProcessManager m_processManager = null;

        public ClearAllController(IProcessManager processManager)
        {
            m_processManager = processManager;
        }

        [HttpPost]
        public IActionResult RequestClearAll([FromBody] ClearAll data)
        {
            if (data == null)
                return BadRequest();

            MessageResult response = m_processManager.ProcessClearAll(data);
            return Ok(response);
        }
    }
}
