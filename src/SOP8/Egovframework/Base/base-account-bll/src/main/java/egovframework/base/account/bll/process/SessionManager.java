package egovframework.base.account.bll.process;

import egovframework.base.account.ibll.models.ApplicationUser;
import egovframework.base.account.ibll.response.LoginResult;
import egovframework.base.dal.IDatabase;
import egovframework.base.dal.account.SessionDAO;
import egovframework.base.dal.join.JoinDAO;
import egovframework.base.generic.Holder;
import egovframework.base.model.account.Grade;
import egovframework.base.model.account.Session;
import egovframework.base.model.account.User;
import egovframework.base.account.bll.resource.ErrorMessage;
import egovframework.base.response.resource.ID;

import java.time.Duration;
import java.time.LocalDateTime;
import java.util.Map;
import java.util.List;

public class SessionManager {

    private static final int SESSION_SECONDS = 300;

    public static LoginResult checkLoginSession(int userNo, String sessionKey, JoinDAO joinDao, SessionDAO sessionDao, IDatabase database) {
        LoginResult result = new LoginResult();

        try {
            Holder<String> errorMessage = new Holder<>();
            String condition = String.format("a.%s = %d", Session.Fields.user_sn, userNo);

            List<Map<String, Object>> dataList = joinDao.joinSessionUserGrade(condition, null, null, null, database, errorMessage);

            if (dataList == null) {
                System.err.println("Failed to read session");

                result.setSuccess(false);
                result.setMessage(ID.get(ErrorMessage.class, "failToReadSession").value());
                return result;
            }

            if (dataList.isEmpty()) {
                result.setSuccess(false);
                result.setMessage(ID.get(ErrorMessage.class, "noneSession").value());
                return result;
            }

            for (Map<String, Object> data : dataList) {
                Session session = (Session)data.get(Session.tableName);
                User user = (User)data.get(User.tableName);
                Grade grade = (Grade)data.get(Grade.tableName);

                if (session.getSession_key().equals(sessionKey)) {
                    if (!session.isAtmc_login_yn()) {
                        LocalDateTime sessionUpdate = session.getUpdt_de();
                        LocalDateTime now = LocalDateTime.now();

                        long diffSeconds = Duration.between(sessionUpdate, now).getSeconds();
                        if (diffSeconds > SESSION_SECONDS) {
                            result.setSuccess(false);
                            result.setMessage(ID.get(ErrorMessage.class, "logoutSession").value());
                            return result;
                        } else {
                            session.setUpdt_de(now);

                            if (!sessionDao.updateSession(session, errorMessage)) {
                                result.setSuccess(false);
                                result.setMessage(ID.get(ErrorMessage.class, "failToUpdateSession").value());
                                return result;
                            }
                        }
                    }

                    result.setSuccess(true);
                    result.setMessage(ID.get(ErrorMessage.class, "validSession").value());
                    result.setUser(ApplicationUser.makeUser(user, grade, session.getSession_key()));
                    return result;

                } else {
                    result.setSuccess(false);
                    result.setMessage(ID.get(ErrorMessage.class, "anotherOneLogin").value());
                    return result;
                }
            }

            result.setSuccess(false);
            result.setMessage(ID.get(ErrorMessage.class, "noneSession").value());

        } catch (Exception e) {
            result.setSuccess(false);
            result.setMessage(e.getMessage());
        }

        return result;
    }
}