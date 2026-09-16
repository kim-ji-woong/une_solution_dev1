package egovframework.base.history.ibll.models.history;

import java.time.LocalDateTime;

public class SensorDetectHistory {

    private LocalDateTime beginTime = LocalDateTime.now();
    private LocalDateTime endTime = null;
    private String sensorTypeName;
    private String sensorName;
    private String locationName;
    private String detectStatus;
    private String clearType;
    private String alarmDepthName;
    private String sopName;
    private String memo;
    private int rowNo = -1;

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

    public String getSensorTypeName() {
        return sensorTypeName;
    }

    public void setSensorTypeName(String sensorTypeName) {
        this.sensorTypeName = sensorTypeName;
    }

    public String getSensorName() {
        return sensorName;
    }

    public void setSensorName(String sensorName) {
        this.sensorName = sensorName;
    }

    public String getLocationName() {
        return locationName;
    }

    public void setLocationName(String locationName) {
        this.locationName = locationName;
    }

    public String getDetectStatus() {
        return detectStatus;
    }

    public void setDetectStatus(String detectStatus) {
        this.detectStatus = detectStatus;
    }

    public String getClearType() {
        return clearType;
    }

    public void setClearType(String clearType) {
        this.clearType = clearType;
    }

    public String getAlarmDepthName() {
        return alarmDepthName;
    }

    public void setAlarmDepthName(String alarmDepthName) {
        this.alarmDepthName = alarmDepthName;
    }

    public String getSopName() {
        return sopName;
    }

    public void setSopName(String sopName) {
        this.sopName = sopName;
    }

    public String getMemo() {
        return memo;
    }

    public void setMemo(String memo) {
        this.memo = memo;
    }

    public int getRowNo() {
        return rowNo;
    }

    public void setRowNo(int rowNo) {
        this.rowNo = rowNo;
    }
}