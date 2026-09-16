using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Cors;
using dnsDapperDBUtil.DataAccessLayer.IDAL;
using Soulbrain.BLL;
using Soulbrain.BLL.Response;
using Soulbrain.BLL.Request;

namespace WebSOPApp.Areas.SDMS.Controllers
{
    [EnableCors("UnEPolicy")]
    [Route("SDMS/Cfd/[action]")]
    [ApiController]
    public class CfdController : Controller
    {
        private ProcessManager m_processManager = null;

        public CfdController(IDataManager dataManager)
        {
            m_processManager = new ProcessManager(dataManager);
        }

        [HttpPost]
        public IActionResult RequestScenarioCase([FromBody] RequestCfdScenarioCase data)
        {
            ResponseCfdScenarioCase response = m_processManager.RequestCfdScenarioCase(data);
            return Ok(response);
        }

        [HttpPost]
        public IActionResult RequestLocation()
        {
            ResponseCfdLocation response = m_processManager.RequestCfdLocation();
            return Ok(response);
        }
    }
}
