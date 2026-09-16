package egovframework.base.account.bll.process.login;

import java.time.Duration;
import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.Map;

import egovframework.base.account.ibll.response.LoginResult;
import egovframework.base.account.ibll.models.ApplicationUser;
import egovframework.base.model.account.Grade;
import egovframework.base.model.account.Session;
import egovframework.base.model.account.User;
import egovframework.base.account.bll.resource.ErrorMessage;
import egovframework.base.account.bll.resource.ErrorMessageFormat;
import egovframework.base.response.resource.ID;
import egovframework.base.generic.Holder;
import egovframework.base.dal.account.*;

public class LoginManager {

    private static final int LOGIN_FAIL_LIMIT = 5;
    private static final int LOCK_LOGIN_MINUTES = 30;

    private UserDAO userDao;
    private SessionDAO sessionDao;
    private GradeDAO gradeDao;

    public LoginManager(UserDAO userDao, SessionDAO sessionDao, GradeDAO gradeDao) {
        this.userDao = userDao;
        this.sessionDao = sessionDao;
        this.gradeDao = gradeDao;
    }

    public LoginResult login(String userID, String password, String sessionKey, boolean autoLogin) {
        String condition = String.format("%s = '%s'", User.Fields.user_id, userID);
        Holder<String> errorMessage = new Holder<String>();

        User user = this.userDao.selectUser(null, condition, errorMessage);
        //User user = dataManager.getSelect().selectFirst(User.class, condition);
        if (user == null) {
            if (errorMessage.value != null) {
                return new LoginResult(false, ID.get(ErrorMessage.class, "unknownUser").value());
            }
            else {
                return new LoginResult(false, ID.get(ErrorMessage.class, "invalidUserInfo").value());
            }
        }

        if (!checkLoginFailCount(user, "로그인", errorMessage)) {
            return new LoginResult(false, errorMessage.value);
        }

        if (!user.getPassword().equals(password)) {
            if (setLoginFailCount(user, errorMessage)) {
                if (errorMessage.value == null)
                    errorMessage.value = ID.get(ErrorMessage.class, "invalidUserInfo").value();
            }

            return new LoginResult(false, errorMessage.value);
        }

        if (!updateSession(this.sessionDao, user.getUser_sn(), sessionKey, autoLogin, errorMessage)) {
            return new LoginResult(false, errorMessage.value);
        }

        condition = String.format("%s = %d", Grade.Fields.grad_sn, user.getGrad_sn());
        Grade grade = this.gradeDao.selectGrade(null, condition, errorMessage);
        //Grade grade = dataManager.getSelect().selectFirst(Grade.class, condition);

        if (grade == null) {
            return new LoginResult(false, ID.get(ErrorMessage.class, "noneUserLevel").value());
        }

        // Reset password_key
        Map<User.Fields, Object> updates = new HashMap<>();
        updates.put(User.Fields.password_key, null);

        condition = String.format("%s = %d", User.Fields.user_sn, user.getUser_sn());

        if (!this.userDao.updateUser(updates, condition, errorMessage)) {
        //if (!dataManager.getUpdate().update(User.class, updates, condition)) {
            return new LoginResult(false, ID.get(ErrorMessage.class, "failToInitLoginFail").value());
        }

        LoginResult result = new LoginResult(true, "");
        result.setUser(ApplicationUser.makeUser(user, grade, sessionKey));
        return result;
    }

    public static boolean updateSession(SessionDAO sessionDao, int userNo, String sessionKey, boolean autoLogin, Holder<String> errorMessage) {
        // 해당 계정 세션 유무 확인
        String condition = String.format("%s = %d", Session.Fields.user_sn, userNo);
        Session session = sessionDao.selectSession(null, condition, errorMessage);
        //Session session = dataManager.getSelect().selectFirst(Session.class, condition);

        if (session != null && !sessionDao.deleteSession(condition, errorMessage)) {
            return false;
        }

        session = new Session();
        session.setUser_sn(userNo);
        session.setSession_key(sessionKey);
        session.setCreat_de(LocalDateTime.now());
        session.setUpdt_de(session.getCreat_de());
        session.setAtmc_login_yn(autoLogin);

        return sessionDao.insertSession(session, errorMessage);
    }

    private boolean checkLoginFailCount(User user, String target, Holder<String> errorMessage) {
        errorMessage.value = null;

        if (user.getPassword_key() == null || !user.getPassword_key().contains("_")) {
            return true;
        }

        if (target == null)
            target = "로그인";

        String[] parts = user.getPassword_key().split("_");
        int failCount = Integer.parseInt(parts[0]);
        long failTimeBinary = Long.parseLong(parts[1]);
        LocalDateTime failTime = LocalDateTime.ofEpochSecond(failTimeBinary, 0, java.time.ZoneOffset.UTC);

        if (failCount >= LOGIN_FAIL_LIMIT) {
            long minutesElapsed = Duration.between(failTime, LocalDateTime.now()).toMinutes();
            if (minutesElapsed <= LOCK_LOGIN_MINUTES) {
                int remaining = (int) (LOCK_LOGIN_MINUTES - minutesElapsed + 0.9999);
                errorMessage.value = String.format(ID.get(ErrorMessageFormat.class, "lockFail").value(),
                        LOGIN_FAIL_LIMIT, remaining, target);
                return false;
            } else {
                user.setPassword_key(null);
                Map<User.Fields, Object> updates = new HashMap<>();
                updates.put(User.Fields.password_key, null);
                String condition = String.format("%s = %d", User.Fields.user_sn, user.getUser_sn());

                if (!this.userDao.updateUser(updates, condition, errorMessage)) {
                    errorMessage.value = ID.get(ErrorMessage.class, "failToInitLoginFail").value();
                    return false;
                }
            }
        }

        return true;
    }

    private boolean setLoginFailCount(User user, Holder<String> errorMessage) {
        errorMessage.value = null;

        int failCount = 1;
        boolean updated = false;
        LocalDateTime now = LocalDateTime.now();

        if (user.getPassword_key() != null && user.getPassword_key().contains("_")) {
            String[] parts = user.getPassword_key().split("_");
            failCount = Integer.parseInt(parts[0]) + 1;
            updated = true;
        }

        user.setPassword_key(String.format("%d_%d", failCount, now.toEpochSecond(java.time.ZoneOffset.UTC)));

        if (failCount < LOGIN_FAIL_LIMIT) {
            errorMessage.value = String.format(ID.get(ErrorMessageFormat.class, "lockLoginFail").value(), LOGIN_FAIL_LIMIT, LOCK_LOGIN_MINUTES);
            /*dataManager.setLastError(String.format(ID.get(ErrorMessageFormat.class, "lockLoginFail").value(),
                    LOGIN_FAIL_LIMIT, LOCK_LOGIN_MINUTES));*/
        } else {
            errorMessage.value = String.format(ID.get(ErrorMessageFormat.class, "lockLoginFail2").value(),
                    failCount, LOGIN_FAIL_LIMIT, LOCK_LOGIN_MINUTES);
        }

        if (this.userDao.updateUser(user, errorMessage) == false)
        {
            errorMessage.value = ID.get(ErrorMessageFormat.class, "failToUpdateLoginFail").value();
            return false;
        }

        return true;
    }
}