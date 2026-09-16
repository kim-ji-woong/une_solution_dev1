package egovframework.base.history.ibll.response;

import egovframework.base.history.ibll.models.history.SensorDetectHistory;
import egovframework.base.response.PagingMessageResult;

import java.util.ArrayList;
import java.util.List;

public class ResponseSensorDetectHistory extends PagingMessageResult {

    private List<SensorDetectHistory> histories = new ArrayList<>();

    // Constructors
    public ResponseSensorDetectHistory() {
        super();
    }

    public ResponseSensorDetectHistory(boolean success, String message) {
        super(success, message);
    }

    // Getter and Setter
    public List<SensorDetectHistory> getHistories() {
        return histories;
    }

    public void setHistories(List<SensorDetectHistory> histories) {
        this.histories = histories;
    }
}