package egovframework.base.account.ibll.response;

import java.util.ArrayList;
import java.util.List;
import egovframework.base.account.ibll.models.AccountUser;
import egovframework.base.response.PagingMessageResult;

public class ResponseUserList extends PagingMessageResult {

    private List<AccountUser> users = new ArrayList<>();

    public List<AccountUser> getUsers() {
        return users;
    }

    public void setUsers(List<AccountUser> users) {
        this.users = users;
    }

    public ResponseUserList() {
        super();
    }

    public ResponseUserList(boolean success, String message) {
        super(success, message);
    }
}