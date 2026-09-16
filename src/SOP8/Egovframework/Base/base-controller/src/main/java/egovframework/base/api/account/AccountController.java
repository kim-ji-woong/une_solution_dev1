package egovframework.base.api.account;

//import java.util.Map;
//import java.util.HashMap;
//import java.util.List;

import egovframework.base.account.ibll.interface_.IPasswordPolicy;
import egovframework.base.account.ibll.interface_.IUserCreator;
import egovframework.base.account.ibll.request.*;
import egovframework.base.account.ibll.response.*;
import egovframework.base.response.MessageResult;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import egovframework.base.account.ibll.IProcessManager;
import egovframework.base.api.options.ILoginOption;

@RestController
@RequestMapping("/api/Account")
public class AccountController {
	private final IProcessManager processManager;
	private final ILoginOption loginOption;
	private final IUserCreator userCreator;
	private final IPasswordPolicy passwordPolicy;

	@Autowired
	public AccountController(IProcessManager processManager, ILoginOption loginOption, IPasswordPolicy passwordPolicy, IUserCreator userCreator)
	{
		this.processManager = processManager;
		this.loginOption = loginOption;
		this.userCreator = userCreator;
		this.passwordPolicy = passwordPolicy;
	}

	@GetMapping("/LoginKey")
	@ResponseBody
	public String LoginKey(long num) {
		return this.processManager.getLoginKey(num);
	}

	@PostMapping("/LoginKey2")
	@ResponseBody
	public ResponseLoginKey LoginKey2(@RequestBody RequestLoginKey data) {
		boolean isExternalLogin = this.loginOption.getExternalLoginUrl() != null && !this.loginOption.getExternalLoginUrl().trim().isEmpty();
		return this.processManager.requestLoginKey(data, isExternalLogin);
	}

	@PostMapping("/Login")
	@ResponseBody
	public LoginResult Login(@RequestBody RequestLogin data) {
		return this.processManager.login(data, this.loginOption.getExternalLoginUrl(), this.loginOption.getAutoLogin());
	}

	@PostMapping("/CheckLoginSession")
	@ResponseBody
	public LoginResult CheckLoginSession(@RequestBody CheckLoginSession data) {
		return this.processManager.checkLoginSession(data.getUserNo(), data.getSessionKey());
	}

	@PostMapping("/RequestOptions")
	@ResponseBody
	public ResponseOption RequestOptions(@RequestBody RequestOption data) {
		return this.processManager.getOption(data);
	}

	@PostMapping("/SaveOptions")
	@ResponseBody
	public MessageResult SaveOptions(@RequestBody SaveOption data) {
		return this.processManager.saveOptions(data);
	}

	@PostMapping("/RequestAllSite")
	@ResponseBody
	public ResponseSite RequestAllSite() {
		return this.processManager.getAllSites();
	}

	@PostMapping("/RequestUserList")
	@ResponseBody
	public ResponseUserList RequestUserList(@RequestBody RequestUserList data) {
		return this.processManager.getUserList(data);
	}

	@PostMapping("/RequestGradeList")
	@ResponseBody
	public ResponseGradeList RequestGradeList() {
		return this.processManager.getGradeList();
	}

	@PostMapping("/UpdateUserInfo")
	@ResponseBody
	public MessageResult UpdateUserInfo(@RequestBody RequestUpdateUserInfo data) {
		return this.processManager.updateUserInfo(data);
	}

	@PostMapping("/DeleteUser")
	@ResponseBody
	public MessageResult DeleteUser(@RequestBody RequestDeleteUser data) {
		return this.processManager.deleteUser(data);
	}

	@PostMapping("/CreateUser")
	@ResponseBody
	public ResponseAccountUser CreateUser(@RequestBody RequestNewUser data) {
		return this.processManager.addNewUser(data, this.userCreator, this.passwordPolicy);
	}

	@PostMapping("/RequestPasswordPolicy")
	@ResponseBody
	public ResponsePasswordPolicy RequestPasswordPolicy() {
		ResponsePasswordPolicy response = new ResponsePasswordPolicy(true, "");

		response.setAllowCharacters(this.passwordPolicy.getAllowCharacters());
		response.setMinimumLength(this.passwordPolicy.getMinimumLength());
		response.setMaximumLength(this.passwordPolicy.getMaximumLength());
		response.setNeedCharacter(this.passwordPolicy.isNeedCharacter());
		response.setNeedLowerCase(this.passwordPolicy.isNeedLowerCase());
		response.setNeedUpperCase(this.passwordPolicy.isNeedUpperCase());
		response.setNeedNumber(this.passwordPolicy.isNeedNumber());

		return response;
	}

	@PostMapping("/RequestChangePassword")
	@ResponseBody
	public MessageResult RequestChangePassword(@RequestBody RequestChangePassword data) {
		return this.processManager.changePassword(data);
	}

	@PostMapping("/RequestTemporaryPasswordWithSMS")
	@ResponseBody
	public MessageResult RequestTemporaryPasswordWithSMS(@RequestBody RequestTemporaryPasswordWithSMS data) {
		return this.processManager.makeTemporaryPasswordWithSMS(this.userCreator, this.passwordPolicy, data.getUserName(), data.getPhoneNumber());
	}

	@PostMapping("/RequestTemporaryPasswordWithEmail")
	@ResponseBody
	public MessageResult RequestTemporaryPasswordWithEmail(@RequestBody RequestTemporaryPasswordWithEmail data) {
		return this.processManager.makeTemporaryPasswordWithEmail(this.userCreator, this.passwordPolicy, data.getUserName(), data.getEmail());
	}
}
