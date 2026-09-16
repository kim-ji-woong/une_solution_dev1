using Microsoft.AspNetCore.Mvc;
using Base.Weather.IBLL;
using Base.Weather.IBLL.Request;
using Base.Weather.IBLL.Response;

namespace Base.Controller
{
    [Route("api/[controller]/[action]")]
    [ApiController]
    public class WeatherController : ControllerBase
    {
        private IProcessManager m_processManager = null;

        public WeatherController(IProcessManager processManager)
        {
            m_processManager = processManager;
        }

        [HttpPost]
        public IActionResult RequestCurrentWeather([FromBody] RequestCurrent data)
        {
            ResponseCurrent response = m_processManager.RequestCurrentWeather(data);
            return Ok(response);
        }

        [HttpPost]
        public IActionResult RequestWeatherWeeklyInfo([FromBody] RequestWeatherWeeklyInfo data)
        {
            ResponseWeatherWeeklyInfo response = m_processManager.RequestWeatherWeeklyInfo(data);
            return Ok(response);
        }
    }
}
