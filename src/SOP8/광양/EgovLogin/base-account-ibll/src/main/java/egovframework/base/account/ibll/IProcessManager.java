package egovframework.base.account.ibll;

import egovframework.base.model.account.*;
import egovframework.base.account.ibll.request.*;
import egovframework.base.account.ibll.response.*;
import egovframework.base.account.ibll.interface_.*;
import egovframework.base.account.ibll.models.*;
import egovframework.base.response.*;
import egovframework.base.generic.Holder;

public interface IProcessManager {

    ResponseLoginKey requestLoginKey(RequestLoginKey data, boolean isExternalLogin);

    String getLoginKey(long num);

    LoginResult login(RequestLogin data, String strExternalLoginUrl, boolean autoLogin);

    LoginResult checkLoginSession(int nUserNo, String strSessionKey);

    ResponseOption getOption(RequestOption data);

    MessageResult saveOptions(SaveOption data);

    ResponseSite getAllSites();

    ResponseUserList getUserList(RequestUserList data);

    ResponseGradeList getGradeList();

    MessageResult updateUserInfo(RequestUpdateUserInfo data);

    MessageResult deleteUser(RequestDeleteUser data);

    ResponseAccountUser addNewUser(RequestNewUser data, IUserCreator userCreator, IPasswordPolicy passwordPolicy);

    MessageResult changePassword(RequestChangePassword data);

    String makeRandomPassword(IPasswordPolicy passwordPolicy, int userNo, String strID, StringBuilder strSalt, Holder<String> errorMessage);

    MessageResult makeTemporaryPasswordWithSMS(IUserCreator userCreator, IPasswordPolicy passwordPolicy, String strUserName, String strPhoneNumber);

    MessageResult makeTemporaryPasswordWithEmail(IUserCreator userCreator, IPasswordPolicy passwordPolicy, String strUserName, String strEmail);
}