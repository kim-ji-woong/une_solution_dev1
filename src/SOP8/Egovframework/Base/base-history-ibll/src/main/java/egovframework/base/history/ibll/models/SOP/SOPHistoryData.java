package egovframework.base.history.ibll.models.sop;

import java.time.LocalDateTime;
import java.util.List;

public class SOPHistoryData {

    private int rowNo = -1;
    private Integer sensorZoneHistoryNo = null;
    private int actionStepHistoryNo = -1;
    private Integer lastAccessedUserNo = null;
    private String disasterCategoryName = "";
    private String sopName = "";
    private String actionStepName = "";
    private String sensorName = null;
    private String position = "";
    private LocalDateTime beginTime = LocalDateTime.now();
    private LocalDateTime endTime = null;
    private String userName = null;
    private List<Integer> allSensorZoneNos = null;

    public int getRowNo() {
        return rowNo;
    }

    public void setRowNo(int rowNo) {
        this.rowNo = rowNo;
    }

    public Integer getSensorZoneHistoryNo() {
        return sensorZoneHistoryNo;
    }

    public void setSensorZoneHistoryNo(Integer sensorZoneHistoryNo) {
        this.sensorZoneHistoryNo = sensorZoneHistoryNo;
    }

    public int getActionStepHistoryNo() {
        return actionStepHistoryNo;
    }

    public void setActionStepHistoryNo(int actionStepHistoryNo) {
        this.actionStepHistoryNo = actionStepHistoryNo;
    }

    public Integer getLastAccessedUserNo() {
        return lastAccessedUserNo;
    }

    public void setLastAccessedUserNo(Integer lastAccessedUserNo) {
        this.lastAccessedUserNo = lastAccessedUserNo;
    }

    public String getDisasterCategoryName() {
        return disasterCategoryName;
    }

    public void setDisasterCategoryName(String disasterCategoryName) {
        this.disasterCategoryName = disasterCategoryName;
    }

    public String getSopName() {
        return sopName;
    }

    public void setSopName(String sopName) {
        this.sopName = sopName;
    }

    public String getActionStepName() {
        return actionStepName;
    }

    public void setActionStepName(String actionStepName) {
        this.actionStepName = actionStepName;
    }

    public String getSensorName() {
        return sensorName;
    }

    public void setSensorName(String sensorName) {
        this.sensorName = sensorName;
    }

    public String getPosition() {
        return position;
    }

    public void setPosition(String position) {
        this.position = position;
    }

    public LocalDateTime getBeginTime() {
        return beginTime;
    }

    public void setBeginTime(LocalDateTime beginTime) {
        this.beginTime = beginTime;
    }

    public LocalDateTime getEndTime() {
        return endTime;
    }

    public void setEndTime(LocalDateTime endTime) {
        this.endTime = endTime;
    }

    public String getUserName() {
        return userName;
    }

    public void setUserName(String userName) {
        this.userName = userName;
    }

    public List<Integer> getAllSensorZoneNos() {
        return allSensorZoneNos;
    }

    public void setAllSensorZoneNos(List<Integer> allSensorZoneNos) {
        this.allSensorZoneNos = allSensorZoneNos;
    }
}