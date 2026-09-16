package egovframework.base.account.ibll.request;

import egovframework.base.response.request.RequestSearchTextPage;

public class RequestUserList extends RequestSearchTextPage {

    private Integer siteNo = null;
    private boolean useTeamName = false;
    private boolean useMemberName = false;
    private boolean useNickName = false;
    private boolean useJobLevel = false;
    private boolean useJobPosition = false;
    private boolean useGrade = false;
    private boolean usePhoneNumber = false;
    private boolean useEmail = false;
    private boolean linkRegularMember = true;

    public Integer getSiteNo() {
        return siteNo;
    }

    public void setSiteNo(Integer siteNo) {
        this.siteNo = siteNo;
    }

    public boolean isUseTeamName() {
        return useTeamName;
    }

    public void setUseTeamName(boolean useTeamName) {
        this.useTeamName = useTeamName;
    }

    public boolean isUseMemberName() {
        return useMemberName;
    }

    public void setUseMemberName(boolean useMemberName) {
        this.useMemberName = useMemberName;
    }

    public boolean isUseNickName() {
        return useNickName;
    }

    public void setUseNickName(boolean useNickName) {
        this.useNickName = useNickName;
    }

    public boolean isUseJobLevel() {
        return useJobLevel;
    }

    public void setUseJobLevel(boolean useJobLevel) {
        this.useJobLevel = useJobLevel;
    }

    public boolean isUseJobPosition() {
        return useJobPosition;
    }

    public void setUseJobPosition(boolean useJobPosition) {
        this.useJobPosition = useJobPosition;
    }

    public boolean isUseGrade() {
        return useGrade;
    }

    public void setUseGrade(boolean useGrade) {
        this.useGrade = useGrade;
    }

    public boolean isUsePhoneNumber() {
        return usePhoneNumber;
    }

    public void setUsePhoneNumber(boolean usePhoneNumber) {
        this.usePhoneNumber = usePhoneNumber;
    }

    public boolean isUseEmail() {
        return useEmail;
    }

    public void setUseEmail(boolean useEmail) {
        this.useEmail = useEmail;
    }

    public boolean isLinkRegularMember() {
        return linkRegularMember;
    }

    public void setLinkRegularMember(boolean linkRegularMember) {
        this.linkRegularMember = linkRegularMember;
    }

    public RequestUserList() {
    }

    public RequestUserList(String searchText, int pageNo, Integer pageRowCount, Integer siteNo,
                            boolean useTeamName, boolean useMemberName, boolean useNickName,
                            boolean useJobLevel, boolean useJobPosition, boolean useGrade,
                            boolean usePhoneNumber, boolean useEmail) {
        this.setSearchText(searchText);
        this.setPageNo(pageNo);
        this.setPageRowCount(pageRowCount);
        this.siteNo = siteNo;
        this.useTeamName = useTeamName;
        this.useMemberName = useMemberName;
        this.useNickName = useNickName;
        this.useJobLevel = useJobLevel;
        this.useJobPosition = useJobPosition;
        this.useGrade = useGrade;
        this.usePhoneNumber = usePhoneNumber;
        this.useEmail = useEmail;
    }
}