using Microsoft.AspNetCore.Mvc;
using Base.SOPSimulator.IBLL;
using Base.SOPSimulator.IBLL.Request;
using Base.SOPSimulator.IBLL.Response;
using Response;

namespace Base.Controller
{
    [Route("api/[controller]/[action]")]
    [ApiController]
    public class SOPSimulatorController : ControllerBase
    {
        private IProcessManager m_processManager = null;

        public SOPSimulatorController(IProcessManager processManager, SOPManager.IBLL.IProcessManager sopManagerProcessManager, SDMS.IBLL.IProcessManager sdmsProcessManager)
        {
            m_processManager = processManager;
            m_processManager.SopManagerProcessManager = sopManagerProcessManager;
            m_processManager.SdmsProcessManager = sdmsProcessManager;
        }

        [HttpPost]
        public IActionResult DisplaySopRun([FromBody] RequestCurrentHistory data)
        {
            ResponseCurrentHistory response = m_processManager.RequestCurrentSOPHistory(data);
            return Ok(response);
        }

        [HttpPost]
        public IActionResult ExcuteSOP([FromBody] RequestExecuteSOP data)
        {
            ResponseExecuteSOP response = m_processManager.BeginSOP(data);
            return Ok(response);
        }

        [HttpPost]
        public IActionResult CloseSOPByUser([FromBody] RequestCloseSOP data)
        {
            MessageResult response = m_processManager.CloseSOPByUser(data);
            return Ok(response);
        }

        [HttpPost]
        public IActionResult NextActionStep([FromBody] RequestNextActionStep data)
        {
            MessageResult response = m_processManager.NextActionStep(data);
            return Ok(response);
        }

        [HttpPost]
        public IActionResult RunSection([FromBody] RequestProgressSOP data)
        {
            MessageResult response = m_processManager.RunSection(data);
            return Ok(response);
        }

        [HttpPost]
        public IActionResult SetCurrentSection([FromBody] RequestProgressSOP data)
        {
            MessageResult response = m_processManager.SetCurrentSection(data);
            return Ok(response);
        }

        [HttpPost]
        public IActionResult GetComponentHistory([FromBody] RequestComponentHistory data)
        //public IActionResult MonitorComponentHistory([FromBody] RequestComponentHistory data)
        {
            ResponseComponentHistory response = m_processManager.GetComponentHistory(data);
            return Ok(response);
        }

        [HttpPost]
        public IActionResult ProgressMission([FromBody] RequestProgressMission data)
        {
            MessageResult response = m_processManager.ProgressMission(data);
            return Ok(response);
        }

        [HttpPost]
        public IActionResult SendMessage([FromBody] RequestSendMessage data)
        {
            MessageResult response = m_processManager.SendMessage(data);
            return Ok(response);
        }
    }
}
