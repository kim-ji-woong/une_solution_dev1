using Microsoft.AspNetCore.Mvc;
using SOPWebServer.IBLL;
using SOPWebServer.IBLL.Models.Request;
using SOPWebServer.IBLL.Models.Response;

namespace SOPWebServer.Controller
{
    [Route("api/[controller]/[action]")]
    [ApiController]
    public class SensorController : ControllerBase
    {
        private IProcessManager m_processManager = null;

        public SensorController(IProcessManager processManager)
        {
            m_processManager = processManager;
        }

        [HttpPost]
        public IActionResult RequestSensorSignal([FromBody] SensorSignal data)
        {
            if (data == null)
                return BadRequest();

            ResponseSensorSignal response = m_processManager.ProcessSensorSignal(data);
            return Ok(response);
        }

        [HttpPost]
        public IActionResult NotifyAlarm([FromBody] NotifyAlarm data)
        {
            if (data == null)
                return BadRequest();

            ResponseSensorSignal response = m_processManager.NotifyAlarm(data);
            return Ok(response);
        }
    }
}
