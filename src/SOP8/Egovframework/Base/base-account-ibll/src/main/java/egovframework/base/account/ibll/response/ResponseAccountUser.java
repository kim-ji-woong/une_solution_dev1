package egovframework.base.account.ibll.response;

import egovframework.base.account.ibll.models.AccountUser;
import egovframework.base.response.MessageResult;

public class ResponseAccountUser extends MessageResult {

    private AccountUser user = null;

    public AccountUser getUser() {
        return user;
    }

    public void setUser(AccountUser user) {
        this.user = user;
    }

    public ResponseAccountUser() {
        super();
    }

    public ResponseAccountUser(boolean success, String message) {
        super(success, message);
    }
}