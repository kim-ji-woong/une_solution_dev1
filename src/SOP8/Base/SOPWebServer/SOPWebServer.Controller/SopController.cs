using Microsoft.AspNetCore.Mvc;
using SOPWebServer.IBLL;
using SOPWebServer.IBLL.Models.Request;
using Response;

namespace SOPWebServer.Controller
{

    [Route("api/[controller]")]
    [ApiController]
    public class SopController : ControllerBase
    {
        private IProcessManager m_processManager = null;
        private Base.SOPSimulator.IBLL.IProcessManager m_sopSimulatorProcessManager = null;

        public SopController(IProcessManager processManager, Base.SOPSimulator.IBLL.IProcessManager sopSimulatorProcessManager)
        {
            m_processManager = processManager;
            m_sopSimulatorProcessManager = sopSimulatorProcessManager;
        }

        [HttpPost]
        public IActionResult RunAlarmSop([FromBody] RequestRunAlarmSop data)
        {
            if (data == null)
                return BadRequest();

            MessageResult response = m_processManager.BeginAlarmSop(data, m_sopSimulatorProcessManager);
            return Ok(response);
        }
    }
}
