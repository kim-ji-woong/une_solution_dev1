package egovframework.base.response;

import egovframework.base.response.MessageResult;
import java.util.ArrayList;
import java.util.List;

public class MessageResultListData<T> extends MessageResult {
    private List<T> datas = new ArrayList<>();

    public MessageResultListData() {
        super();
    }

    public MessageResultListData(boolean success, String message) {
        super(success, message);
    }

    public List<T> getDatas() {
        return datas;
    }

    public void setDatas(List<T> datas) {
        this.datas = datas;
    }
}