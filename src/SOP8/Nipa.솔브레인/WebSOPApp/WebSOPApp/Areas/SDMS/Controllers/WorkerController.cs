using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Cors;
using dnsDapperDBUtil.DataAccessLayer.IDAL;
using Soulbrain.BLL;
using Soulbrain.BLL.Response;

namespace WebSOPApp.Areas.SDMS.Controllers
{
    [EnableCors("UnEPolicy")]
    [Route("SDMS/[controller]/[action]")]
    [ApiController]
    public class WorkerController : Controller
    {
        private ProcessManager m_processManager = null;

        public WorkerController(IDataManager dataManager)
        {
            m_processManager = new ProcessManager(dataManager);
        }

        [EnableCors("UnEPolicy")]
        [HttpPost]
        public IActionResult RequestWorkers()
        {
            ResponseWorker response = m_processManager.GetWorkers();
            return Ok(response);
        }
    }
}
