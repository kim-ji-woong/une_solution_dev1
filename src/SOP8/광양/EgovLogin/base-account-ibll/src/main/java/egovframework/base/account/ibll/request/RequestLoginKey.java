package egovframework.base.account.ibll.request;

public class RequestLoginKey {

    public enum ModeType {
        Email(0),
        PhoneNumber(1);

        private final int code;

        ModeType(int code) {
            this.code = code;
        }

        public int getCode() {
            return code;
        }
    }

    private Long num = null;
    private String userID = null;
    private String name = null;
    private String data = null;
    private Integer mode = null;

    public Long getNum() {
        return num;
    }

    public void setNum(Long num) {
        this.num = num;
    }

    public String getUserID() {
        return userID;
    }

    public void setUserID(String userID) {
        this.userID = userID;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getData() {
        return data;
    }

    public void setData(String data) {
        this.data = data;
    }

    public Integer getMode() {
        return mode;
    }

    public void setMode(Integer mode) {
        this.mode = mode;
    }
}