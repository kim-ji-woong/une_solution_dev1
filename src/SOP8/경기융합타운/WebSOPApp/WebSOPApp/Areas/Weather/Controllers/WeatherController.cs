using Microsoft.AspNetCore.Mvc;
using Weather.BLL;
using Weather.IDAL;
using Weather.BLL.Models.Request;
using Weather.BLL.Models.Response;

// For more information on enabling Web API for empty projects, visit https://go.microsoft.com/fwlink/?LinkID=397860

namespace WebSOPApp.Areas.Weather.Controllers
{
    [Area("Weather")]
    public class WeatherController : Controller
    {
        private ProcessManager m_processManager = null;
        public WeatherController(IDataManager dataManager)
        {
            m_processManager = new ProcessManager(dataManager);
        }

        [HttpPost]
        public IActionResult RequestData([FromBody] RequestData data)
        {
            if (data == null)
                return BadRequest();

            if (data.RequestWeatherInfo != null)
                return RequestWeatherInfo();
            else if (data.RequestWeatherWeeklyInfo != null)
                return RequestWeatherWeeklyInfo();

            return null;
        }

        private IActionResult RequestWeatherInfo()
        {
            ResponseWeatherInfo result = m_processManager.GetLoadManager().GetWeatherInfo();
            return Ok(result);
        }

        private IActionResult RequestWeatherWeeklyInfo()
        {
            ResponseWeatherWeeklyInfo result = m_processManager.GetLoadManager().GetWeatherWeeklyInfo();
            return Ok(result);
        }
    }
}
