package egovframework.base.history.ibll.request;

import egovframework.base.history.ibll.models.history.SensorTypeData;

import java.util.List;

public class RequestExcelDetectHistory {

    private int beginYear = -1;
    private int beginMonth = -1;
    private int beginDay = -1;
    private int endYear = -1;
    private int endMonth = -1;
    private int endDay = -1;

    private Integer sensorType = null;
    private List<Integer> sensorSubTypes = null;
    private Integer buildingGroupNo = null;
    private Integer buildingNo = null;
    private Integer zoneNo = null;
    private Integer sensorNo = null;
    private Integer siteNo = null;

    private List<SensorTypeData> sensorTypeDatas = null;

    private boolean useSensorTypeName = true;
    private boolean useSensorName = true;
    private boolean useLocationName = true;
    private boolean useDetectStatus = false;
    private boolean useClearType = true;
    private boolean useAlarmDepthName = true;
    private boolean useSopName = false;
    private boolean useMemo = false;

    // Getters and Setters

    public int getBeginYear() {
        return beginYear;
    }

    public void setBeginYear(int beginYear) {
        this.beginYear = beginYear;
    }

    public int getBeginMonth() {
        return beginMonth;
    }

    public void setBeginMonth(int beginMonth) {
        this.beginMonth = beginMonth;
    }

    public int getBeginDay() {
        return beginDay;
    }

    public void setBeginDay(int beginDay) {
        this.beginDay = beginDay;
    }

    public int getEndYear() {
        return endYear;
    }

    public void setEndYear(int endYear) {
        this.endYear = endYear;
    }

    public int getEndMonth() {
        return endMonth;
    }

    public void setEndMonth(int endMonth) {
        this.endMonth = endMonth;
    }

    public int getEndDay() {
        return endDay;
    }

    public void setEndDay(int endDay) {
        this.endDay = endDay;
    }

    public Integer getSensorType() {
        return sensorType;
    }

    public void setSensorType(Integer sensorType) {
        this.sensorType = sensorType;
    }

    public List<Integer> getSensorSubTypes() {
        return sensorSubTypes;
    }

    public void setSensorSubTypes(List<Integer> sensorSubTypes) {
        this.sensorSubTypes = sensorSubTypes;
    }

    public Integer getBuildingGroupNo() {
        return buildingGroupNo;
    }

    public void setBuildingGroupNo(Integer buildingGroupNo) {
        this.buildingGroupNo = buildingGroupNo;
    }

    public Integer getBuildingNo() {
        return buildingNo;
    }

    public void setBuildingNo(Integer buildingNo) {
        this.buildingNo = buildingNo;
    }

    public Integer getZoneNo() {
        return zoneNo;
    }

    public void setZoneNo(Integer zoneNo) {
        this.zoneNo = zoneNo;
    }

    public Integer getSensorNo() {
        return sensorNo;
    }

    public void setSensorNo(Integer sensorNo) {
        this.sensorNo = sensorNo;
    }

    public Integer getSiteNo() {
        return siteNo;
    }

    public void setSiteNo(Integer siteNo) {
        this.siteNo = siteNo;
    }

    public List<SensorTypeData> getSensorTypeDatas() {
        return sensorTypeDatas;
    }

    public void setSensorTypeDatas(List<SensorTypeData> sensorTypeDatas) {
        this.sensorTypeDatas = sensorTypeDatas;
    }

    public boolean isUseSensorTypeName() {
        return useSensorTypeName;
    }

    public void setUseSensorTypeName(boolean useSensorTypeName) {
        this.useSensorTypeName = useSensorTypeName;
    }

    public boolean isUseSensorName() {
        return useSensorName;
    }

    public void setUseSensorName(boolean useSensorName) {
        this.useSensorName = useSensorName;
    }

    public boolean isUseLocationName() {
        return useLocationName;
    }

    public void setUseLocationName(boolean useLocationName) {
        this.useLocationName = useLocationName;
    }

    public boolean isUseDetectStatus() {
        return useDetectStatus;
    }

    public void setUseDetectStatus(boolean useDetectStatus) {
        this.useDetectStatus = useDetectStatus;
    }

    public boolean isUseClearType() {
        return useClearType;
    }

    public void setUseClearType(boolean useClearType) {
        this.useClearType = useClearType;
    }

    public boolean isUseAlarmDepthName() {
        return useAlarmDepthName;
    }

    public void setUseAlarmDepthName(boolean useAlarmDepthName) {
        this.useAlarmDepthName = useAlarmDepthName;
    }

    public boolean isUseSopName() {
        return useSopName;
    }

    public void setUseSopName(boolean useSopName) {
        this.useSopName = useSopName;
    }

    public boolean isUseMemo() {
        return useMemo;
    }

    public void setUseMemo(boolean useMemo) {
        this.useMemo = useMemo;
    }
}