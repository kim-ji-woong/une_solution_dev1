package egovframework.base.account.ibll.response;

import java.util.List;
import egovframework.base.account.ibll.models.UserOption;
import egovframework.base.response.MessageResult;

public class ResponseOption extends MessageResult {

    private int userNo = -1;
    private List<UserOption> options = null;

    public int getUserNo() {
        return userNo;
    }

    public void setUserNo(int userNo) {
        this.userNo = userNo;
    }

    public List<UserOption> getOptions() {
        return options;
    }

    public void setOptions(List<UserOption> options) {
        this.options = options;
    }

    public ResponseOption() {
        super();
    }

    public ResponseOption(boolean success, String message) {
        super(success, message);
    }
}