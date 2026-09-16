package egovframework.base.api.account;

import egovframework.base.account.ibll.request.*;
import egovframework.base.account.ibll.response.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import egovframework.base.account.ibll.IProcessManager;
//import egovframework.base.api.options.ILoginOption;

@RestController
@RequestMapping("/api/Account")
public class AccountController {
	private final IProcessManager processManager;
	//private final ILoginOption loginOption;

	@Autowired
	public AccountController(IProcessManager processManager/*, ILoginOption loginOption*/)
	{
		this.processManager = processManager;
		//this.loginOption = loginOption;
	}

	@PostMapping("/Login")
	@ResponseBody
	public LoginResult Login(@RequestBody RequestLogin data) {
		return this.processManager.login(data, data.getExternalLoginUrl(), data.getAutoLogin());
	}
}
