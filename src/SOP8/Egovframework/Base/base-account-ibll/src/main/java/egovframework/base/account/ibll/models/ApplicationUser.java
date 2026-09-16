package egovframework.base.account.ibll.models;

import egovframework.base.model.account.User;
import egovframework.base.model.account.Grade;
import com.fasterxml.jackson.annotation.JsonIgnore;

public class ApplicationUser {

    private int userSn = -1;
    private int gradSn = -1;
    private String gradName = "";
    private String userId = "";
    private String userName = "";
    private String sessionKey = "";
    @JsonIgnore
    private Object options = new Object();
    private Integer siteSn = null;
    private Integer regularMemberNo = null;

    public int getUserSn() {
        return userSn;
    }

    public void setUserSn(int userSn) {
        this.userSn = userSn;
    }

    public int getGradSn() {
        return gradSn;
    }

    public void setGradSn(int gradSn) {
        this.gradSn = gradSn;
    }

    public String getGradName() {
        return gradName;
    }

    public void setGradName(String gradName) {
        this.gradName = gradName;
    }

    public String getUserId() {
        return userId;
    }

    public void setUserId(String userId) {
        this.userId = userId;
    }

    public String getUserName() {
        return userName;
    }

    public void setUserName(String userName) {
        this.userName = userName;
    }

    public String getSessionKey() {
        return sessionKey;
    }

    public void setSessionKey(String sessionKey) {
        this.sessionKey = sessionKey;
    }

    public Object getOptions() {
        return options;
    }

    public void setOptions(Object options) {
        this.options = options;
    }

    public Integer getSiteSn() {
        return siteSn;
    }

    public void setSiteSn(Integer siteSn) {
        this.siteSn = siteSn;
    }

    public Integer getRegularMemberNo() {
        return regularMemberNo;
    }

    public void setRegularMemberNo(Integer regularMemberNo) {
        this.regularMemberNo = regularMemberNo;
    }

    public static ApplicationUser makeUser(User user, Grade grade, String strSessionKey) {
        ApplicationUser appUser = new ApplicationUser();
        appUser.setUserSn(user.getUser_sn());
        appUser.setGradSn(user.getGrad_sn());
        appUser.setGradName(grade.getGrad_name());
        appUser.setUserId(user.getUser_id());
        appUser.setUserName(user.getUser_name());
        appUser.setSessionKey(strSessionKey);
        appUser.setSiteSn(user.getSite_sn());
        appUser.setRegularMemberNo(user.getRgl_memb_sn());
        return appUser;
    }
}