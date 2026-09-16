using Microsoft.AspNetCore.Mvc;
using SOPWebServer.IBLL;
using SOPWebServer.IBLL.Models.Request;
using Response;

namespace SOPWebServer.Controller
{
    [Route("api/[controller]")]
    [ApiController]
    public class ManualReportController : ControllerBase
    {
        private IProcessManager m_processManager = null;

        public ManualReportController(IProcessManager processManager)
        {
            m_processManager = processManager;
        }

        [HttpPost]
        public IActionResult RequestManualReport([FromBody] ManualReport data)
        {
            if (data == null)
                return BadRequest();

            MessageResult response = m_processManager.ProcessManualReport(data);
            return Ok(response);
        }
    }
}
