using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Cors;
using dnsDapperDBUtil.DataAccessLayer.IDAL;
using Kftc.BLL;
using Kftc.BLL.Response;
using Kftc.BLL.Request;

namespace WebSOPApp.Areas.SDMS.Controllers
{
    [EnableCors("UnEPolicy")]
    [Route("SDMS/SDMS/[action]")]
    [ApiController]
    public class SDMSController : Controller
    {
        private ProcessManager m_processManager = null;

        public SDMSController(IDataManager dataManager)
        {
            m_processManager = new ProcessManager(dataManager);
        }

        [EnableCors("UnEPolicy")]
        [HttpPost]
        public IActionResult RequesAllCCTVs()
        {
            ResponseAllCCTVs response = m_processManager.RequestAllCCTVs();
            return Ok(response);
        }

        [EnableCors("UnEPolicy")]
        [HttpPost]
        public IActionResult RequestDoorStatus(RequestDoorStatus data)
        {
            ResponseDoorStatus response = m_processManager.RequestDoorStatus(data);
            return Ok(response);
        }

        [EnableCors("UnEPolicy")]
        [HttpPost]
        public IActionResult RequestElevators()
        {
            ResponseElevators response = m_processManager.RequestElevators();
            return Ok(response);
        }

        [EnableCors("UnEPolicy")]
        [HttpPost]
        public IActionResult RequestTotalDoorStatus()
        {
            ResponseTotalDoorStatus response = m_processManager.RequestTotalDoorStatus();
            return Ok(response);
        }

        [EnableCors("UnEPolicy")]
        [HttpPost]
        public IActionResult RequestSensorInfo([FromBody] RequestSensorInfo data)
        {
            ResponseSensorinfo response = m_processManager.RequestSensorInfo(data);
            return Ok(response);
        }

        [EnableCors("UnEPolicy")]
        [HttpPost]
        public IActionResult RequestCCTVList([FromBody] RequestCCTVList data)
        {
            var response = m_processManager.RequestCCTVList(data);
            return Ok(response);
        }
    }
}
