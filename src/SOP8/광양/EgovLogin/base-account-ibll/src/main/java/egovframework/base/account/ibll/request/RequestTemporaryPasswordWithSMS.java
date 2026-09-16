package egovframework.base.account.ibll.request;

public class RequestTemporaryPasswordWithSMS {

    private String userName = null;
    private String phoneNumber = null;

    public String getUserName() {
        return userName;
    }

    public void setUserName(String userName) {
        this.userName = userName;
    }

    public String getPhoneNumber() {
        return phoneNumber;
    }

    public void setPhoneNumber(String phoneNumber) {
        this.phoneNumber = phoneNumber;
    }
}