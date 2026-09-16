package egovframework.base.history.ibll.response;

import egovframework.base.history.ibll.models.sop.SOPHistoryData;
import egovframework.base.response.MessageResult;

import java.util.ArrayList;
import java.util.List;

public class ResponseSOPHistory extends MessageResult {

    private List<SOPHistoryData> sopHistoryDatas = new ArrayList<>();
    private int totalCount = -1;

    // Constructors
    public ResponseSOPHistory() {
        super();
    }

    public ResponseSOPHistory(boolean success, String message) {
        super(success, message);
    }

    // Getters and Setters
    public List<SOPHistoryData> getSopHistoryDatas() {
        return sopHistoryDatas;
    }

    public void setSopHistoryDatas(List<SOPHistoryData> sopHistoryDatas) {
        this.sopHistoryDatas = sopHistoryDatas;
    }

    public int getTotalCount() {
        return totalCount;
    }

    public void setTotalCount(int totalCount) {
        this.totalCount = totalCount;
    }
}