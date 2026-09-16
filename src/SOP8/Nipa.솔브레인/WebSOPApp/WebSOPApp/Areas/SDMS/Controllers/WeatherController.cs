using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Cors;
using dnsDapperDBUtil.DataAccessLayer.IDAL;
using Soulbrain.BLL;
using Soulbrain.BLL.Response;
using Soulbrain.BLL.Request;

namespace WebSOPApp.Areas.SDMS.Controllers
{
    [EnableCors("UnEPolicy")]
    [Route("SDMS/Weather/[action]")]
    [ApiController]
    public class WeatherController : Controller
    {
        private ProcessManager m_processManager = null;

        public WeatherController(IDataManager dataManager)
        {
            m_processManager = new ProcessManager(dataManager);
        }

        [HttpPost]
        public IActionResult RequestCurrentWeather([FromBody] RequestCurrentWeather data)
        {
            ResponseCurrentWeather response = m_processManager.RequestCurrentWeather(data);
            return Ok(response);
        }
    }
}
