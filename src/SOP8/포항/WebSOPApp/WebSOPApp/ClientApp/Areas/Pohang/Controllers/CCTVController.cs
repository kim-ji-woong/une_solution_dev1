using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Cors;
using Pohang.IBLL.Request;
using Pohang.IBLL.Response;
using Pohang.IBLL;

namespace WebSOPApp.ClientApp.Areas.Pohang.Controllers
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
