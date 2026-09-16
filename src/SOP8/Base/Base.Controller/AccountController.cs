using Microsoft.AspNetCore.Mvc;
using Base.Account.IBLL;
using Base.Account.IBLL.Request;
using Base.Account.IBLL.Response;
using Base.Account.IBLL.Interface;
using Microsoft.AspNetCore.Cors;
using Response;

namespace Base.Controller
{
    using Options;

    [EnableCors("UnEPolicy")]
    [Route("api/[controller]/[action]")]
    [ApiController]
    public class AccountController : ControllerBase
    {
        private IProcessManager m_processManager = null;
        private ILoginOption m_loginOption = null;
        private IPasswordPolicy m_passwordPolicy = null;
        private IUserCreator m_userCreator = null;

        public AccountController(IProcessManager processManager, ILoginOption loginOption, IPasswordPolicy passwordPolicy, IUserCreator userCreator)
        {
            m_processManager = processManager;
            m_loginOption = loginOption;
            m_passwordPolicy = passwordPolicy;
            m_userCreator = userCreator;
        }

        [HttpGet]
        public string LoginKey(long num)
        {
            return m_processManager.GetLoginKey(num);
        }

        [HttpPost]
        public IActionResult LoginKey2([FromBody] RequestLoginKey data)
        {
            bool isExternalLogin = m_loginOption.ExternalLoginUrl != null && m_loginOption.ExternalLoginUrl.Trim().Length > 0;
            ResponseLoginKey response = m_processManager.RequestLoginKey(data, isExternalLogin);
            return Ok(response);
        }

        [HttpPost]
        public IActionResult Login([FromBody] RequestLogin data)
        {
            LoginResult response = m_processManager.Login(data, m_loginOption.ExternalLoginUrl, m_loginOption.AutoLogin);

            if (response.User != null)
                response.User.Options = m_loginOption;

            return Ok(response);
        }

        [HttpPost]
        public IActionResult CheckLoginSession([FromBody] CheckLoginSession data)
        {
            LoginResult result = m_processManager.CheckLoginSession(data.UserNo, data.SessionKey);

            if (result.User != null)
                result.User.Options = m_loginOption;

            return Ok(result);
        }

        [HttpPost]
        public IActionResult RequestOptions([FromBody] RequestOption data)
        {
            ResponseOption response = m_processManager.GetOption(data);
            return Ok(response);
        }

        [HttpPost]
        public IActionResult SaveOptions([FromBody] SaveOption data)
        {
            MessageResult response = m_processManager.SaveOptions(data);
            return Ok(response);
        }

        [HttpPost]
        public IActionResult RequestAllSite()
        {
            ResponseSite response = m_processManager.GetAllSites();
            return Ok(response);
        }

        [HttpPost]
        public IActionResult RequestUserList([FromBody] RequestUserList data)
        {
            ResponseUserList response = m_processManager.GetUserList(data);
            return Ok(response);
        }

        [HttpPost]
        public IActionResult RequestGradeList()
        {
            ResponseGradeList response = m_processManager.GetGradeList();
            return Ok(response);
        }

        [HttpPost]
        public IActionResult UpdateUserInfo([FromBody] RequestUpdateUserInfo data)
        {
            MessageResult response = m_processManager.UpdateUserInfo(data);
            return Ok(response);
        }

        [HttpPost]
        public IActionResult DeleteUser([FromBody] RequestDeleteUser data)
        {
            MessageResult response = m_processManager.DeleteUser(data);
            return Ok(response);
        }

        [HttpPost]
        public IActionResult CreateUser([FromBody] RequestNewUser data)
        {
            ResponseAccountUser response = m_processManager.AddNewUser(data, m_userCreator, m_passwordPolicy);
            return Ok(response);
        }

        [HttpPost]
        public IActionResult RequestPasswordPolicy()
        {
            ResponsePasswordPolicy response = new ResponsePasswordPolicy(true, "");

            response.AllowCharacters = m_passwordPolicy.AllowCharacters;
            response.MinimumLength = m_passwordPolicy.MinimumLength;
            response.MaximumLength = m_passwordPolicy.MaximumLength;
            response.NeedCharacter = m_passwordPolicy.NeedCharacter;
            response.NeedLowerCase = m_passwordPolicy.NeedLowerCase;
            response.NeedUpperCase = m_passwordPolicy.NeedUpperCase;
            response.NeedAlphabet = m_passwordPolicy.NeedAlphabet;
            response.NeedNumber = m_passwordPolicy.NeedNumber;
            response.NeedNumberOrCharacter = m_passwordPolicy.NeedNumberOrCharacter;

            return Ok(response);
        }

        [HttpPost]
        public IActionResult RequestChangePassword([FromBody] RequestChangePassword data)
        {
            MessageResult response = m_processManager.ChangePassword(data);
            return Ok(response);
        }

        [HttpPost]
        public IActionResult RequestTemporaryPasswordWithSMS([FromBody] RequestTemporaryPasswordWithSMS data)
        {
            MessageResult response = m_processManager.MakeTemporaryPasswordWithSMS(m_userCreator, m_passwordPolicy, data.UserName, data.PhoneNumber);
            return Ok(response);
        }

        [HttpPost]
        public IActionResult RequestTemporaryPasswordWithEmail([FromBody] RequestTemporaryPasswordWithEmail data)
        {
            MessageResult response = m_processManager.MakeTemporaryPasswordWithEmail(m_userCreator, m_passwordPolicy, data.UserName, data.Email);
            return Ok(response);
        }
    }
}
