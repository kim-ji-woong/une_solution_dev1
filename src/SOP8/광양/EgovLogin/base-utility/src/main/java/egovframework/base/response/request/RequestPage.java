package egovframework.base.response.request;

public class RequestPage {
    private Integer pageRowCount = null;
    private int pageNo = 1;

    // 한 페이지에 보여줄 행의 개수 (null이면 전체)
    public Integer getPageRowCount() {
        return pageRowCount;
    }

    public void setPageRowCount(Integer pageRowCount) {
        this.pageRowCount = pageRowCount;
    }

    // 1부터 시작
    public int getPageNo() {
        return pageNo;
    }

    public void setPageNo(int pageNo) {
        this.pageNo = pageNo;
    }

    public Integer getBeginIndex() {
        if (pageRowCount != null && pageRowCount > 0 && pageNo > 0) {
            return pageRowCount * (pageNo - 1) + 1;
        }
        return null;
    }
}