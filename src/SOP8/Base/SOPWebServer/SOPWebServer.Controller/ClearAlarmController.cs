using Microsoft.AspNetCore.Mvc;
using SOPWebServer.IBLL;
using SOPWebServer.IBLL.Models.Request;
using SOPWebServer.IBLL.Models.Response;
using Response;

namespace SOPWebServer.Controller
{
    [Route("api/[controller]/[action]")]
    [ApiController]
    public class ClearAlarmController : ControllerBase
    {
        private IProcessManager m_processManager = null;

        public ClearAlarmController(IProcessManager processManager)
        {
            m_processManager = processManager;
        }

        [HttpPost]
        public IActionResult RequestClearAlarm([FromBody] ClearAlarm data)
        {
            if (data == null)
                return BadRequest();

            ResponseSensorSignal response = m_processManager.ProcessClearAlarm(data);
            return Ok(response);
        }

        [HttpPost]
        public IActionResult RequestClearAlarmList([FromBody] ClearAlarmList data)
        {
            if (data == null)
                return BadRequest();

            ResponseSensorSignalList response = m_processManager.ProcessClearAlarmList(data);
            return Ok(response);
        }

        [HttpPost]
        public IActionResult CheckTimeout()
        {
            MessageResult response = m_processManager.CheckTimeoutAlarm();
            return Ok(response);
        }
    }
}
