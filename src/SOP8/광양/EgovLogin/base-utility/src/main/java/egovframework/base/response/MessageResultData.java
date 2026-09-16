package egovframework.base.response;

import egovframework.base.response.MessageResult;

public class MessageResultData<T> extends MessageResult {
    private T data;

    public MessageResultData() {
        super();
    }

    public MessageResultData(boolean success, String message) {
        super(success, message);
    }

    public T getData() {
        return data;
    }

    public void setData(T data) {
        this.data = data;
    }
}