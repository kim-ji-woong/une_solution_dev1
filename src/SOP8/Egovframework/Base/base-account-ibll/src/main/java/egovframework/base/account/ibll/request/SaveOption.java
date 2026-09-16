package egovframework.base.account.ibll.request;

import java.util.ArrayList;
import java.util.List;
import egovframework.base.account.ibll.models.UserOption;

public class SaveOption {

    private int userNo = -1;
    private List<UserOption> options = new ArrayList<>();

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
}