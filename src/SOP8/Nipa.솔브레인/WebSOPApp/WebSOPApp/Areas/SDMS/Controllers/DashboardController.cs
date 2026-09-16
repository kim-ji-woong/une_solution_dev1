using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Cors;
using dnsDapperDBUtil.DataAccessLayer.IDAL;
using Soulbrain.BLL;
using Soulbrain.BLL.Response;

namespace WebSOPApp.Areas.SDMS.Controllers
{
    [EnableCors("UnEPolicy")]
    [Route("SDMS/Dashboard/[action]")]
    [ApiController]
    public class DashboardController : Controller
    {
        private ProcessManager m_processManager = null;

        public DashboardController(IDataManager dataManager)
        {
            m_processManager = new ProcessManager(dataManager);
        }

        [HttpPost]
        public IActionResult RequestWeeklyStatus()
        {
            ResponseWeeklyStatus response = m_processManager.RequestWeeklyStatus();
            return Ok(response);
        }
    }
}
