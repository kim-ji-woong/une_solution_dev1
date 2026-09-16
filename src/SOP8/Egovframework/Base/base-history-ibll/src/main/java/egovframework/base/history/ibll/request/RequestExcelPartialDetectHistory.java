package egovframework.base.history.ibll.request;

import egovframework.base.history.ibll.models.history.SensorDetectHistory;
import java.util.ArrayList;
import java.util.List;

public class RequestExcelPartialDetectHistory extends RequestExcelDetectHistory {

    private List<SensorDetectHistory> histories = new ArrayList<>();

    public List<SensorDetectHistory> getHistories() {
        return histories;
    }

    public void setHistories(List<SensorDetectHistory> histories) {
        this.histories = histories;
    }

    public RequestExcelPartialDetectHistory() {
        // 기본 생성자
    }

    public RequestExcelPartialDetectHistory(RequestExcelDetectHistory data) {
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
        this.setUseDetectStatus(data.isUseDetectStatus());
        this.setUseClearType(data.isUseClearType());
        this.setUseAlarmDepthName(data.isUseAlarmDepthName());
        this.setUseSopName(data.isUseSopName());
        this.setUseMemo(data.isUseMemo());
    }
}