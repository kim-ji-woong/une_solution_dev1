using Microsoft.AspNetCore.Mvc;

namespace WebSOPApp.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class AppConfigController : ControllerBase
    {
        [HttpGet("Client")]
        public IActionResult Client()
        {
            var site = Startup.ConfigManager.Site;

            return Ok(new
            {
                egovLogin = site.EgovLogin,
                egovLoginUrl = site.EgovLoginUrl
            });
        }
    }
}
