package egovframework.base.account.ibll.response;

import egovframework.base.account.ibll.models.ApplicationUser;
import egovframework.base.response.MessageResult;

public class LoginResult extends MessageResult {

    private ApplicationUser user = null;

    public ApplicationUser getUser() {
        return user;
    }

    public void setUser(ApplicationUser user) {
        this.user = user;
    }

    public LoginResult() {
        super();
    }

    public LoginResult(boolean success, String message) {
        super(success, message);
    }
}