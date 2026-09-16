package egovframework.base.history.ibll.request;

import egovframework.base.history.ibll.models.history.SensorAnalysisHistory;
import java.util.ArrayList;
import java.util.List;

public class RequestExcelPartialAnalysisHistory extends RequestExcelAnalysisHistory {

    private List<SensorAnalysisHistory> histories = new ArrayList<>();

    public List<SensorAnalysisHistory> getHistories() {
        return histories;
    }

    public void setHistories(List<SensorAnalysisHistory> histories) {
        this.histories = histories;
    }

    public RequestExcelPartialAnalysisHistory() {
        // 기본 생성자
    }

    public RequestExcelPartialAnalysisHistory(RequestExcelAnalysisHistory data) {
        this.setBeginYear(data.getBeginYear());
        this.setBeginMonth(data.getBeginMonth());
        this.setBeginDay(data.getBeginDay());
        this.setEndYear(data.getEndYear());
        this.setEndMonth(data.getEndMonth());
        this.setEndDay(data.getEndDay());
        this.setBuildingGroupNo(data.getBuildingGroupNo());
        this.setBuildingNo(data.getBuildingNo());
        this.setZoneNo(data.getZoneNo());
        this.setSensorNo(data.getSensorNo());
        this.setSensorType(data.getSensorType());
        this.setSensorSubTypes(data.getSensorSubTypes());
        this.setSensorTypeDatas(data.getSensorTypeDatas());
        this.setUseSensorTypeName(data.isUseSensorTypeName());
        this.setUseSensorName(data.isUseSensorName());
        this.setUseLocationName(data.isUseLocationName());
        this.setUseDetectCount(data.isUseDetectCount());
        this.setUseSensorClearCount(data.isUseSensorClearCount());
        this.setUseMalfunctionCount(data.isUseMalfunctionCount());
        this.setUseUserResetCount(data.isUseUserResetCount());
        this.setUseMalfunctionRatio(data.isUseMalfunctionRatio());
    }
}