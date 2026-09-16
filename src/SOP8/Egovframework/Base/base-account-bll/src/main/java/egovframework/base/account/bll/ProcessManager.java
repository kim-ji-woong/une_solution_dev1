package egovframework.base.account.bll;

import egovframework.base.account.bll.process.*;
import egovframework.base.account.ibll.IProcessManager;
import egovframework.base.account.ibll.interface_.*;
import egovframework.base.account.ibll.request.*;
import egovframework.base.account.ibll.response.*;
import egovframework.base.account.ibll.request.SaveOption;
import egovframework.base.dal.IDatabase;
import egovframework.base.dal.join.JoinDAO;
import egovframework.base.response.MessageResult;
import egovframework.base.dal.account.*;
import egovframework.base.dal.common.SiteDAO;
import egovframework.base.generic.Holder;

import org.springframework.stereotype.Service;

@Service
public class ProcessManager implements IProcessManager {
    private GradeDAO gradeDao;
    private UserDAO userDao;
    private SiteDAO siteDao;
    private SessionDAO sessionDao;
    private JoinDAO joinDao;
    private IDatabase database;

    public ProcessManager(GradeDAO gradeDao, UserDAO userDao, SiteDAO siteDao, SessionDAO sessionDao, JoinDAO joinDao, IDatabase database) {
        this.gradeDao = gradeDao;
        this.userDao = userDao;
        this.siteDao = siteDao;
        this.sessionDao = sessionDao;
        this.joinDao = joinDao;
        this.database = database;
    }

    @Override
    public ResponseLoginKey requestLoginKey(RequestLoginKey data, boolean isExternalLogin) {
        LoadManager loadManager = new LoadManager(this.gradeDao, this.userDao, this.siteDao, this.sessionDao);
        return loadManager.getLoginKey(data, isExternalLogin);
    }

    @Override
    public String getLoginKey(long num) {
        return LoadManager.getLoginKey(num);
    }

    @Override
    public LoginResult login(RequestLogin data, String externalLoginUrl, boolean autoLogin) {
        LoadManager loadManager = new LoadManager(this.gradeDao, this.userDao, this.siteDao, this.sessionDao);
        return loadManager.login(data, externalLoginUrl, autoLogin);
    }

    @Override
    public LoginResult checkLoginSession(int userNo, String sessionKey) {
        return null;
        //return SessionManager.checkLoginSession(dataManager, userNo, sessionKey);
    }

    @Override
    public ResponseOption getOption(RequestOption data) {
        return null;
        //return OptionManager.getOption(data, dataManager);
    }

    @Override
    public MessageResult saveOptions(SaveOption data) {
        return null;
        //return OptionManager.saveOption(data.getUserNo(), data.getOptions(), dataManager);
    }

    @Override
    public ResponseSite getAllSites() {
        LoadManager loadManager = new LoadManager(this.gradeDao, this.userDao, this.siteDao, this.sessionDao);
        return loadManager.getAllSites();
    }

    @Override
    public ResponseUserList getUserList(RequestUserList data) {
        return null;
        //UserManager userManager = new UserManager(dataManager);
        //return userManager.getUserList(data);
    }

    @Override
    public ResponseGradeList getGradeList() {
        LoadManager loadManager = new LoadManager(this.gradeDao, this.userDao, this.siteDao, this.sessionDao);
        return loadManager.getGradeList();
    }

    @Override
    public MessageResult updateUserInfo(RequestUpdateUserInfo data) {
        return null;
        //UserManager userManager = new UserManager(dataManager);
        //return userManager.updateUserInfo(data);
    }

    @Override
    public MessageResult deleteUser(RequestDeleteUser data) {
        return null;
        //UserManager userManager = new UserManager(dataManager);
        //return userManager.deleteUser(data);
    }

    @Override
    public ResponseAccountUser addNewUser(RequestNewUser data, IUserCreator userCreator, IPasswordPolicy passwordPolicy) {
        return null;
        //UserManager userManager = new UserManager(dataManager);
        //return userManager.addNewUser(data, this, userCreator, passwordPolicy);
    }

    @Override
    public MessageResult changePassword(RequestChangePassword data) {
        return null;
        //UserManager userManager = new UserManager(dataManager);
        //return userManager.changePassword(data);
    }

    @Override
    public String makeRandomPassword(IPasswordPolicy passwordPolicy, int userNo, String userId, StringBuilder salt, Holder<String> errorMessage) {
        return null;
        //UserManager userManager = new UserManager(dataManager);
        //return userManager.makeRandomPassword(passwordPolicy, userNo, userId, salt, errorMessage);
    }

    @Override
    public MessageResult makeTemporaryPasswordWithSMS(IUserCreator userCreator, IPasswordPolicy passwordPolicy, String userName, String phoneNumber) {
        return null;
        //UserManager userManager = new UserManager(dataManager);
        //return userManager.makeTemporaryPasswordWithSMS(this, userCreator, passwordPolicy, userName, phoneNumber);
    }

    @Override
    public MessageResult makeTemporaryPasswordWithEmail(IUserCreator userCreator, IPasswordPolicy passwordPolicy, String userName, String email) {
        return null;
        //UserManager userManager = new UserManager(dataManager);
        //return userManager.makeTemporaryPasswordWithEmail(this, userCreator, passwordPolicy, userName, email);
    }
}