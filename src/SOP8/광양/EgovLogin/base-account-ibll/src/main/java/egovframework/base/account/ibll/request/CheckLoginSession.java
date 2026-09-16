package egovframework.base.account.ibll.request;

public class CheckLoginSession {

    private int userNo = -1;
    private String sessionKey = "";

    public int getUserNo() {
        return userNo;
    }

    public void setUserNo(int userNo) {
        this.userNo = userNo;
    }

    public String getSessionKey() {
        return sessionKey;
    }

    public void setSessionKey(String sessionKey) {
        this.sessionKey = sessionKey;
    }
}