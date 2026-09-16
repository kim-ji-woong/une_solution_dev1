package egovframework.base.account.ibll.request;

public class RequestNewUser {

    private Integer regularMemberNo = null;
    private String userID = "";
    private String nickName = "";
    private int grade = -1;
    private Integer siteNo = null;
    private String memo = null;

    public Integer getRegularMemberNo() {
        return regularMemberNo;
    }

    public void setRegularMemberNo(Integer regularMemberNo) {
        this.regularMemberNo = regularMemberNo;
    }

    public String getUserID() {
        return userID;
    }

    public void setUserID(String userID) {
        this.userID = userID;
    }

    public String getNickName() {
        return nickName;
    }

    public void setNickName(String nickName) {
        this.nickName = nickName;
    }

    public int getGrade() {
        return grade;
    }

    public void setGrade(int grade) {
        this.grade = grade;
    }

    public Integer getSiteNo() {
        return siteNo;
    }

    public void setSiteNo(Integer siteNo) {
        this.siteNo = siteNo;
    }

    public String getMemo() {
        return memo;
    }

    public void setMemo(String memo) {
        this.memo = memo;
    }
}