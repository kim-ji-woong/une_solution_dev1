using Gwangyang.IBLL;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Cors;
using Gwangyang.IBLL.Request;
using Gwangyang.IBLL.Response;

namespace WebSOPApp.ClientApp.Areas.Gwangyang.Controllers
{
    [EnableCors("UnEPolicy")]
    [Route("api/[controller]/[action]")]
    [ApiController]
    public class CCTVController : ControllerBase
    {
        private IProcessManager m_processManager;

        public CCTVController(IProcessManager processManager)
        {
            m_processManager = processManager;
        }

        public IActionResult RequestCCTVInfo([FromBody] RequestCCTVInfo data)
        {
            ResponseCCTVInfo response = m_processManager.RequestCCTVInfo(data);
            return Ok(response);
        }
    }
}
