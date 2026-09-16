using Base.Model.Account;
using Response;
using System.Collections.Generic;

namespace Base.Account.IBLL
{
    using Request;
    using Response;
    using Interface;
    using Models;

    public interface IProcessManager
    {
        ResponseLoginKey RequestLoginKey(RequestLoginKey data, bool isExternalLogin);
        string GetLoginKey(long num);
        LoginResult Login(RequestLogin data, string strExternalLoginUrl, bool autoLogin);
        LoginResult CheckLoginSession(int nUserNo, string strSessionKey);
        ResponseOption GetOption(RequestOption data);
        MessageResult SaveOptions(SaveOption data);
        ResponseSite GetAllSites();
        ResponseUserList GetUserList(RequestUserList data);
        ResponseGradeList GetGradeList();
        MessageResult UpdateUserInfo(RequestUpdateUserInfo data);
        MessageResult DeleteUser(RequestDeleteUser data);
        ResponseAccountUser AddNewUser(RequestNewUser data, IUserCreator userCreator, IPasswordPolicy passwordPolicy);
        MessageResult ChangePassword(RequestChangePassword data);
        string MakeRandomPassword(IPasswordPolicy passwordPolicy, int userNo, string strID, ref string strSalt, out string strErrorMessage);
        MessageResult MakeTemporaryPasswordWithSMS(IUserCreator userCreator, IPasswordPolicy passwordPolicy, string strUserName, string strPhoneNumber);
        MessageResult MakeTemporaryPasswordWithEmail(IUserCreator userCreator, IPasswordPolicy passwordPolicy, string strUserName, string strEmail);
    }
}
