package egovframework.base.account.bll.process.login;

import egovframework.base.account.ibll.models.ApplicationUser;
import egovframework.base.account.ibll.response.LoginResult;
import egovframework.base.model.account.Grade;
import egovframework.base.model.account.User;
import egovframework.base.model.account.Session;
import egovframework.base.model.common.Site;
import org.json.JSONObject;
import org.json.JSONArray;
import org.json.JSONException;
import egovframework.base.account.bll.resource.ErrorMessage;
import egovframework.base.response.resource.ID;
import egovframework.base.account.bll.process.LoadManager;
import egovframework.base.generic.Holder;

import egovframework.base.dal.account.*;
import egovframework.base.dal.common.SiteDAO;

import java.io.*;
import java.net.HttpURLConnection;
import java.net.URL;
import java.nio.charset.StandardCharsets;
import java.util.*;

public class ExternalLoginManager {

    private GradeDAO gradeDao;
    private UserDAO userDao;
    private SiteDAO siteDao;
    private SessionDAO sessionDao;
    //private IDataManager dataManager;

    public ExternalLoginManager(GradeDAO gradeDao, UserDAO userDao, SiteDAO siteDao, SessionDAO sessionDao) {
        this.gradeDao = gradeDao;
        this.userDao = userDao;
        this.siteDao = siteDao;
        this.sessionDao = sessionDao;
        //this.dataManager = dataManager;
    }

    public LoginResult externalLogin(String userID, String password, String externalLoginUrl,
                                     String sessionKey, boolean autoLogin) {
        try {
            JSONObject jsonData = new JSONObject();
            jsonData.put("userID", userID);
            jsonData.put("hashCode", password);

            JSONObject jsonWrapper = new JSONObject();
            jsonWrapper.put("externalLogin", jsonData);

            String jsonString = jsonWrapper.toString();
            byte[] bytes = jsonString.getBytes(StandardCharsets.UTF_8);

            HttpURLConnection conn = (HttpURLConnection) new URL(externalLoginUrl).openConnection();
            conn.setRequestMethod("POST");
            conn.setRequestProperty("Content-Type", "application/json; charset=UTF-8");
            conn.setDoOutput(true);
            conn.getOutputStream().write(bytes);

            BufferedReader reader = new BufferedReader(new InputStreamReader(conn.getInputStream(), StandardCharsets.UTF_8));
            StringBuilder responseBuilder = new StringBuilder();
            String line;

            while ((line = reader.readLine()) != null) {
                responseBuilder.append(line.trim());
            }

            reader.close();
            conn.disconnect();

            return getExternalLoginResult(responseBuilder.toString(), sessionKey, autoLogin);
        } catch (IOException e) {
            return new LoginResult(false, e.getMessage());
        }
    }

    private LoginResult getExternalLoginResult(String response, String sessionKey, boolean autoLogin) {
        try {
            JSONObject json = new JSONObject(response);

            String userID = json.optString("userID");
            String userName = json.optString("name");
            String teamName = json.optString("teamName");
            String _errorMessage = json.optString("message");
            String successStr = json.optString("success", "false").toLowerCase();

            if (userID.isEmpty() || userName.isEmpty() || !successStr.equals("true")) {
                return new LoginResult(false, _errorMessage);
            }

            Holder<String> errorMessage = new Holder<String>();

            // 등급 조회
            List<Grade> grades = this.gradeDao.selectGrades(null, null, null, errorMessage);
            //List<Grade> grades = dataManager.getSelect().select(Grade.class);
            if (grades == null) {
                return new LoginResult(false, errorMessage.value);
            }

            if (grades.isEmpty()) {
                return new LoginResult(false, ID.get(ErrorMessage.class, "noneUserLevel").value());
            }

            Grade grade = grades.get(0);

            // 사용자 정보 조회 또는 생성
            String condition = String.format("%s = '%s'", User.Fields.user_id, userID);
            User user = this.userDao.selectUser(null, condition, errorMessage);
            //User user = dataManager.getSelect().selectFirst(User.class, condition);

            if (user == null) {
                user = new User();
                user.setGrad_sn(grade.getGrad_sn());
                user.setPassword("");
                user.setUser_id(userID);
                user.setUser_name(userName);
                user.setPassword_salt(LoadManager.makeSalt());
                user.setSite_sn(getFirstSiteNo());

                //int addedId = dataManager.getCreate().insert(user);
                if (!this.userDao.insertUser(user, errorMessage)) {
                    return new LoginResult(false, ID.get(ErrorMessage.class, "failToCreateUser").value());
                }

                //user.user_sn = addedId;
            }

            if (!LoginManager.updateSession(this.sessionDao, user.getUser_sn(), sessionKey, autoLogin, errorMessage)) {
                return new LoginResult(false, ID.get(ErrorMessage.class, "failToSession").value());
            }

            ApplicationUser appUser = new ApplicationUser();
            appUser.setUserSn(user.getUser_sn());
            appUser.setGradName(grade.getGrad_name());
            appUser.setGradSn(grade.getGrad_sn());
            appUser.setUserName(userName);
            appUser.setUserId(userID);
            appUser.setSessionKey(sessionKey);
            appUser.setSiteSn(user.getSite_sn());
            appUser.setRegularMemberNo(user.getRgl_memb_sn());

            LoginResult result = new LoginResult(true, "");
            result.setUser(appUser);
            return result;

        } catch (JSONException e) {
            return new LoginResult(false, "JSON parsing error: " + e.getMessage());
        }
    }

    private Integer getFirstSiteNo() {
        Holder<String> errorMessage = new Holder<String>();
        List<Site> sites = this.siteDao.selectSites(null, null, null, errorMessage);
        //List<Site> sites = dataManager.getSelect().select(Site.class);
        if (sites == null || sites.isEmpty()) {
            return null;
        }
        return sites.get(0).getSite_sn();
    }
}