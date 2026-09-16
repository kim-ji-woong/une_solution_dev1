package egovframework.base.account.ibll.request;

public class RequestLogin {

    private String value = "";
    private String key = "";
    private String externalLoginUrl = null;
    private boolean autoLogin = false;

    public String getValue() {
        return value;
    }

    public void setValue(String value) {
        this.value = value;
    }

    public String getKey() {
        return key;
    }

    public void setKey(String key) {
        this.key = key;
    }

    public String getExternalLoginUrl() { return externalLoginUrl; }

    public void setExternalLoginUrl(String externalLoginUrl) { this.externalLoginUrl = externalLoginUrl; }

    public boolean getAutoLogin() { return autoLogin; }

    public void setAutoLogin(boolean autoLogin) { this.autoLogin = autoLogin; }
}