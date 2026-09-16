package egovframework.base.history.ibll.models.sop;

import java.util.ArrayList;
import java.util.List;

public class SOPHistoryComponentData {

    private int actionStepHistoryNo = -1;
    private int componentHistoryNo = -1;
    private int componentNo = -1;
    private int componentType = -1;
    private String title = "";
    private List<String> teamList = new ArrayList<>();
    private String time = "";
    private String status = "";
    private Integer userNo = null;
    private String userName = "";
    private String completion = "확인";
    private List<ComponentHistoryDetailData> missionDatas = new ArrayList<>();

    public int getActionStepHistoryNo() {
        return actionStepHistoryNo;
    }

    public void setActionStepHistoryNo(int actionStepHistoryNo) {
        this.actionStepHistoryNo = actionStepHistoryNo;
    }

    public int getComponentHistoryNo() {
        return componentHistoryNo;
    }

    public void setComponentHistoryNo(int componentHistoryNo) {
        this.componentHistoryNo = componentHistoryNo;
    }

    public int getComponentNo() {
        return componentNo;
    }

    public void setComponentNo(int componentNo) {
        this.componentNo = componentNo;
    }

    public int getComponentType() {
        return componentType;
    }

    public void setComponentType(int componentType) {
        this.componentType = componentType;
    }

    public String getTitle() {
        return title;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public List<String> getTeamList() {
        return teamList;
    }

    public void setTeamList(List<String> teamList) {
        this.teamList = teamList;
    }

    public String getTime() {
        return time;
    }

    public void setTime(String time) {
        this.time = time;
    }

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }

    public Integer getUserNo() {
        return userNo;
    }

    public void setUserNo(Integer userNo) {
        this.userNo = userNo;
    }

    public String getUserName() {
        return userName;
    }

    public void setUserName(String userName) {
        this.userName = userName;
    }

    public String getCompletion() {
        return completion;
    }

    public void setCompletion(String completion) {
        this.completion = completion;
    }

    public List<ComponentHistoryDetailData> getMissionDatas() {
        return missionDatas;
    }

    public void setMissionDatas(List<ComponentHistoryDetailData> missionDatas) {
        this.missionDatas = missionDatas;
    }

    // Inner class
    public static class ComponentHistoryDetailData {

        private int dataIndex = -1;
        private String sectionName = "";
        private String missionText = "";
        private String time = "";
        private String completion = "미완료";

        public int getDataIndex() {
            return dataIndex;
        }

        public void setDataIndex(int dataIndex) {
            this.dataIndex = dataIndex;
        }

        public String getSectionName() {
            return sectionName;
        }

        public void setSectionName(String sectionName) {
            this.sectionName = sectionName;
        }

        public String getMissionText() {
            return missionText;
        }

        public void setMissionText(String missionText) {
            this.missionText = missionText;
        }

        public String getTime() {
            return time;
        }

        public void setTime(String time) {
            this.time = time;
        }

        public String getCompletion() {
            return completion;
        }

        public void setCompletion(String completion) {
            this.completion = completion;
        }
    }
}