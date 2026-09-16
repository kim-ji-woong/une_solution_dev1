package egovframework.base.response;

import egovframework.base.response.MessageResult;

public class PagingMessageResult extends MessageResult {
    private int totalCount = 0;

    // 전체 아이템 개수 Getter / Setter
    public int getTotalCount() {
        return totalCount;
    }

    public void setTotalCount(int totalCount) {
        this.totalCount = totalCount;
    }

    // 기본 생성자
    public PagingMessageResult() {
        super();
    }

    // 매개변수가 있는 생성자
    public PagingMessageResult(boolean success, String message) {
        super(success, message);
    }
}