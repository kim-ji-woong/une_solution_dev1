using System.Threading.Tasks;
using Microsoft.AspNetCore.Cors;
using Microsoft.AspNetCore.Mvc;
using Soulbrain.BLL.Process;
using Soulbrain.BLL.Response;

namespace WebSOPApp.Areas.SDMS.Controllers
{
    [EnableCors("UnEPolicy")]
    [Route("SDMS/Wish/[action]")]
    public class WishController : Controller
    {
        private WishManager m_wishManager = null;

        public WishController(WishManager wishManager)
        {
            m_wishManager = wishManager;
        }
        
        [HttpPost]
        public async Task<IActionResult> RequestTodayWorkList()
        {
            ResponseTodayWorkList response = await m_wishManager.RequestTodayWorkList();
            return Ok(response);       
        }

        public async Task<IActionResult> RequestCurrentWorkPermitData()
        {
            ResponseCurrentWorkPermitData response = await m_wishManager.RequestCurrentWorkPermitData();
            return Ok(response);
        }
        
    }
}