using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Cors;
using Base.SensorSimulator.IBLL;
using Base.SensorSimulator.IBLL.Request;
using Response;

namespace Base.Controller
{
    using Options;

    [Route("api/[controller]/[action]")]
    [ApiController]
    public class SensorSimulatorController : ControllerBase
    {
        private IProcessManager m_processManager = null;
        private IAlarmOption m_alarmOption = null;

        public SensorSimulatorController(IProcessManager processManager, IAlarmOption alarmOption)
        {
            m_processManager = processManager;
            m_alarmOption = alarmOption;
        }

        [EnableCors("UnEPolicy")]
        [HttpPost]
        public IActionResult RequestSendSensorAlarm([FromBody] RequestSendSensorAlarm data)
        {
            if (data == null)
                return BadRequest();

            MessageResult response = m_processManager.SendSensorAlarm(data, m_alarmOption.SOPWebServerURL);
            return Ok(response);
        }
    }
}
