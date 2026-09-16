package egovframework.base.account.ibll.response;

import egovframework.base.response.MessageResult;

public class ResponseLoginKey extends MessageResult {

    private String loginKey = "";
    private String salt = "";
    private boolean externalLogin = false;

    public String getLoginKey() {
        return loginKey;
    }

    public void setLoginKey(String loginKey) {
        this.loginKey = loginKey;
    }

    public String getSalt() {
        return salt;
    }

    public void setSalt(String salt) {
        this.salt = salt;
    }

    public boolean isExternalLogin() {
        return externalLogin;
    }

    public void setExternalLogin(boolean externalLogin) {
        this.externalLogin = externalLogin;
    }
}