using Base.Account.IBLL;
using Base.Account.IBLL.Request;
using Base.Account.IBLL.Response;
using Base.Account.IBLL.Interface;
using Base.Account.IBLL.Models;
using dnsDapperDBUtil.DataAccessLayer.IDAL;
using System.Collections.Generic;
using Response;

namespace Base.Account.BLL
{
    using Process;

    public class ProcessManager : IProcessManager
    {
        private IDataManager m_dataManager = null;

        public ProcessManager(IDataManager dataManager)
        {
            m_dataManager = dataManager;
        }

        public ResponseLoginKey RequestLoginKey(RequestLoginKey data, bool isExternalLogin)
        {
            LoadManager loadManager = new LoadManager(m_dataManager);
            return loadManager.GetLoginKey(data, isExternalLogin);
        }

        public string GetLoginKey(long num)
        {
            return LoadManager.GetLoginKey(num);
        }

        public LoginResult Login(RequestLogin data, string strExternalLoginUrl, bool autoLogin)
        {
            LoadManager loadManager = new LoadManager(m_dataManager);
            return loadManager.Login(data, strExternalLoginUrl, autoLogin);
        }

        public LoginResult CheckLoginSession(int nUserNo, string strSessionKey)
        {
            return SessionManager.CheckLoginSession(m_dataManager, nUserNo, strSessionKey);
        }

        public ResponseOption GetOption(RequestOption data)
        {
            return OptionManager.GetOption(data, m_dataManager);
        }

        public MessageResult SaveOptions(SaveOption data)
        {
            return OptionManager.SaveOption(data.UserNo, data.Options, m_dataManager);
        }

        public ResponseSite GetAllSites()
        {
            LoadManager loadManager = new LoadManager(m_dataManager);
            return loadManager.GetAllSites();
        }

        public ResponseUserList GetUserList(RequestUserList data)
        {
            UserManager userManager = new UserManager(m_dataManager);
            return userManager.GetUserList(data);
        }

        public ResponseGradeList GetGradeList()
        {
            LoadManager loadManager = new LoadManager(m_dataManager);
            return loadManager.GetGradeList();
        }

        public MessageResult UpdateUserInfo(RequestUpdateUserInfo data)
        {
            UserManager userManager = new UserManager(m_dataManager);
            return userManager.UpdateUserInfo(data);
        }

        public MessageResult DeleteUser(RequestDeleteUser data)
        {
            UserManager userManager = new UserManager(m_dataManager);
            return userManager.DeleteUser(data);
        }

        public ResponseAccountUser AddNewUser(RequestNewUser data, IUserCreator userCreator, IPasswordPolicy passwordPolicy)
        {
            UserManager userManager = new UserManager(m_dataManager);
            return userManager.AddNewUser(data, this, userCreator, passwordPolicy);
        }

        public MessageResult ChangePassword(RequestChangePassword data)
        {
            UserManager userManager = new UserManager(m_dataManager);
            return userManager.ChangePassword(data);
        }

        public string MakeRandomPassword(IPasswordPolicy passwordPolicy, int userNo, string strID, ref string strSalt, out string strErrorMessage)
        {
            UserManager userManager = new UserManager(m_dataManager);
            return userManager.MakeRandomPassword(passwordPolicy, userNo, strID, ref strSalt, out strErrorMessage);
        }

        public MessageResult MakeTemporaryPasswordWithSMS(IUserCreator userCreator, IPasswordPolicy passwordPolicy, string strUserName, string strPhoneNumber)
        {
            UserManager userManager = new UserManager(m_dataManager);
            return userManager.MakeTemporaryPasswordWithSMS(this, userCreator, passwordPolicy, strUserName, strPhoneNumber);
        }

        public MessageResult MakeTemporaryPasswordWithEmail(IUserCreator userCreator, IPasswordPolicy passwordPolicy, string strUserName, string strEmail)
        {
            UserManager userManager = new UserManager(m_dataManager);
            return userManager.MakeTemporaryPasswordWithEmail(this, userCreator, passwordPolicy, strUserName, strEmail);
        }
    }
}
