package egovframework.base.history.ibll.request;

import egovframework.base.response.request.RequestPage;

public class RequestSOPHistory extends RequestPage {

    private int beginYear = -1;
    private int beginMonth = -1;
    private int beginDay = -1;
    private int endYear = -1;
    private int endMonth = -1;
    private int endDay = -1;
    private int siteNo = -1;

    private String disasterCategoryName = null; // null이면 전체
    private String actionStepName = null;       // null이면 전체
    private String userName = null;             // null이면 전체

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

    public int getSiteNo() {
        return siteNo;
    }

    public void setSiteNo(int siteNo) {
        this.siteNo = siteNo;
    }

    public String getDisasterCategoryName() {
        return disasterCategoryName;
    }

    public void setDisasterCategoryName(String disasterCategoryName) {
        this.disasterCategoryName = disasterCategoryName;
    }

    public String getActionStepName() {
        return actionStepName;
    }

    public void setActionStepName(String actionStepName) {
        this.actionStepName = actionStepName;
    }

    public String getUserName() {
        return userName;
    }

    public void setUserName(String userName) {
        this.userName = userName;
    }
}