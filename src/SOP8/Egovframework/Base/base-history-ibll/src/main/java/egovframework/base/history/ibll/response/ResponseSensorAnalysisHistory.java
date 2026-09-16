package egovframework.base.history.ibll.response;

import egovframework.base.history.ibll.models.history.SensorAnalysisHistory;
import response.PagingMessageResult;

import java.util.ArrayList;
import java.util.List;

public class ResponseSensorAnalysisHistory extends PagingMessageResult {

    private List<SensorAnalysisHistory> histories = new ArrayList<>();
    private int totalDetectionCount = 0;
    private double totalMalfunctionRatio = 0;

    private String mostDetectionSensorName = null;
    private Integer mostDetectionSensorCount = null;

    private String mostDetectionLocationName = null;
    private Integer mostDetectionLocationCount = null;

    private String mostDetectionSensorTypeName = null;
    private Integer mostDetectionSensorTypeCount = null;

    private String topMalfunctionSensorName = null;
    private double topMalfunctionSensorRatio = 0;

    // Constructors
    public ResponseSensorAnalysisHistory() {
        super();
    }

    public ResponseSensorAnalysisHistory(boolean success, String message) {
        super(success, message);
    }

    // Getters and Setters

    public List<SensorAnalysisHistory> getHistories() {
        return histories;
    }

    public void setHistories(List<SensorAnalysisHistory> histories) {
        this.histories = histories;
    }

    public int getTotalDetectionCount() {
        return totalDetectionCount;
    }

    public void setTotalDetectionCount(int totalDetectionCount) {
        this.totalDetectionCount = totalDetectionCount;
    }

    public double getTotalMalfunctionRatio() {
        return totalMalfunctionRatio;
    }

    public void setTotalMalfunctionRatio(double totalMalfunctionRatio) {
        this.totalMalfunctionRatio = totalMalfunctionRatio;
    }

    public String getMostDetectionSensorName() {
        return mostDetectionSensorName;
    }

    public void setMostDetectionSensorName(String mostDetectionSensorName) {
        this.mostDetectionSensorName = mostDetectionSensorName;
    }

    public Integer getMostDetectionSensorCount() {
        return mostDetectionSensorCount;
    }

    public void setMostDetectionSensorCount(Integer mostDetectionSensorCount) {
        this.mostDetectionSensorCount = mostDetectionSensorCount;
    }

    public String getMostDetectionLocationName() {
        return mostDetectionLocationName;
    }

    public void setMostDetectionLocationName(String mostDetectionLocationName) {
        this.mostDetectionLocationName = mostDetectionLocationName;
    }

    public Integer getMostDetectionLocationCount() {
        return mostDetectionLocationCount;
    }

    public void setMostDetectionLocationCount(Integer mostDetectionLocationCount) {
        this.mostDetectionLocationCount = mostDetectionLocationCount;
    }

    public String getMostDetectionSensorTypeName() {
        return mostDetectionSensorTypeName;
    }

    public void setMostDetectionSensorTypeName(String mostDetectionSensorTypeName) {
        this.mostDetectionSensorTypeName = mostDetectionSensorTypeName;
    }

    public Integer getMostDetectionSensorTypeCount() {
        return mostDetectionSensorTypeCount;
    }

    public void setMostDetectionSensorTypeCount(Integer mostDetectionSensorTypeCount) {
        this.mostDetectionSensorTypeCount = mostDetectionSensorTypeCount;
    }

    public String getTopMalfunctionSensorName() {
        return topMalfunctionSensorName;
    }

    public void setTopMalfunctionSensorName(String topMalfunctionSensorName) {
        this.topMalfunctionSensorName = topMalfunctionSensorName;
    }

    public double getTopMalfunctionSensorRatio() {
        return topMalfunctionSensorRatio;
    }

    public void setTopMalfunctionSensorRatio(double topMalfunctionSensorRatio) {
        this.topMalfunctionSensorRatio = topMalfunctionSensorRatio;
    }
}