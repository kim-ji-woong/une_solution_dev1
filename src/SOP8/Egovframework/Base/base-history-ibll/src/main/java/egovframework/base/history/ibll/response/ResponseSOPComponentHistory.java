package egovframework.base.history.ibll.response;

import egovframework.base.history.ibll.models.sop.SOPHistoryComponentData;
import egovframework.base.response.MessageResult;

import java.util.ArrayList;
import java.util.List;

public class ResponseSOPComponentHistory extends MessageResult {

    private List<SOPHistoryComponentData> sopComponentHistoryDatas = new ArrayList<>();

    // Constructors
    public ResponseSOPComponentHistory() {
        super();
    }

    public ResponseSOPComponentHistory(boolean success, String message) {
        super(success, message);
    }

    // Getter and Setter
    public List<SOPHistoryComponentData> getSopComponentHistoryDatas() {
        return sopComponentHistoryDatas;
    }

    public void setSopComponentHistoryDatas(List<SOPHistoryComponentData> sopComponentHistoryDatas) {
        this.sopComponentHistoryDatas = sopComponentHistoryDatas;
    }
}