using Microsoft.AspNetCore.Mvc;
using SOPWebServer.IBLL;
using SOPWebServer.IBLL.Models.Request;
using SOPWebServer.IBLL.Models.Response;

namespace SOPWebServer.Controller
{
    [Route("api/[controller]")]
    [ApiController]
    public class ManualReport2Controller : ControllerBase
    {
        private IProcessManager m_processManager = null;

        public ManualReport2Controller(IProcessManager processManager)
        {
            m_processManager = processManager;
        }

        [HttpPost]
        public IActionResult RequestManualReport2([FromBody] ManualReport2 data)
        {
            if (data == null)
                return BadRequest();

            ResponseSensorSignal response = m_processManager.ProcessManualReport2(data);
            return Ok(response);
        }
    }
}
