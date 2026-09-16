package egovframework.base.account.ibll.request;

public class RequestTemporaryPasswordWithEmail {

    private String userName = null;
    private String email = null;

    public String getUserName() {
        return userName;
    }

    public void setUserName(String userName) {
        this.userName = userName;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }
}