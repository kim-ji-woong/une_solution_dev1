package egovframework.base.response;

public class MessageResult {
    private String message = "";
    private boolean success = false;
    private Integer errorCode = null;

    public MessageResult() {
    }

    public MessageResult(boolean success, String message) {
        this.success = success;
        this.message = message;
    }

    public MessageResult(boolean success, String message, int errorCode) {
        this.success = success;
        this.message = message;
        this.errorCode = errorCode;
    }

    public String getMessage() {
        return message;
    }

    public void setMessage(String message) {
        this.message = message;
    }

    public boolean isSuccess() {
        return success;
    }

    public void setSuccess(boolean success) {
        this.success = success;
    }

    public Integer getErrorCode() {
        return errorCode;
    }

    public void setErrorCode(Integer errorCode) {
        this.errorCode = errorCode;
    }
}