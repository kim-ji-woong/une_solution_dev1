using Base.Account.IBLL;
using Base.Account.IBLL.Request;
using Base.Account.IBLL.Response;
using Base.Controller.Options;
using Microsoft.AspNetCore.Cors;
using Microsoft.AspNetCore.Mvc;
using System.Collections.Generic;

namespace WebSOPApp.Areas.Account.Controllers
{
    [EnableCors("UnEPolicy")]
    [Route("Account/[controller]/[action]")]
    [ApiController]
    public class AccountController : ControllerBase
    {
        private IProcessManager m_processManager = null;
        private LoginOption m_loginOption = null;

        public AccountController(IProcessManager processManager, ILoginOption loginOption)
        {
            m_processManager = processManager;
            m_loginOption = new LoginOption(loginOption);
        }

        [HttpPost]
        public IActionResult Login([FromBody] RequestLogin data)
        {
            LoginResult response = m_processManager.Login(data, m_loginOption.ExternalLoginUrl, m_loginOption.AutoLogin);

            if (response.User != null)
            {
                m_loginOption.ProjectType = Startup.ConfigManager.Site.ProjectType;
                m_loginOption.ZoneNos = Startup.ConfigManager.Site.ZoneNos;
                m_loginOption.Sensors = Startup.ConfigManager.Site.Sensors;
                response.User.Options = m_loginOption;
            }

            return Ok(response);
        }
    }

    class LoginOption : ILoginOption
    {
        public string ExternalLoginUrl { get; set; }
        public bool AutoLogin { get; set; }
        public string StreamServerUrl { get; set; }

        public string ProjectType { get; set; }
        public List<int> ZoneNos { get; set; }
        public WebSOPApp.Config.Sensors Sensors { get; set; }

        public LoginOption(ILoginOption option)
        {
            this.ExternalLoginUrl = option.ExternalLoginUrl;
            this.AutoLogin = option.AutoLogin;
            this.StreamServerUrl = option.StreamServerUrl;

            this.ProjectType = null;
            this.ZoneNos = null;
            this.Sensors = null;
        }
    }
}
