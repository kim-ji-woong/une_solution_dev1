package egovframework.base.account.ibll.response;

import java.util.ArrayList;
import java.util.List;
import egovframework.base.response.MessageResult;

public class ResponsePasswordPolicy extends MessageResult {

    private boolean needUpperCase = false;
    private boolean needLowerCase = false;
    private boolean needNumber = false;
    private boolean needCharacter = false;
    private Integer minimumLength = null;
    private Integer maximumLength = null;
    private List<Character> allowCharacters = new ArrayList<>();

    public boolean isNeedUpperCase() {
        return needUpperCase;
    }

    public void setNeedUpperCase(boolean needUpperCase) {
        this.needUpperCase = needUpperCase;
    }

    public boolean isNeedLowerCase() {
        return needLowerCase;
    }

    public void setNeedLowerCase(boolean needLowerCase) {
        this.needLowerCase = needLowerCase;
    }

    public boolean isNeedNumber() {
        return needNumber;
    }

    public void setNeedNumber(boolean needNumber) {
        this.needNumber = needNumber;
    }

    public boolean isNeedCharacter() {
        return needCharacter;
    }

    public void setNeedCharacter(boolean needCharacter) {
        this.needCharacter = needCharacter;
    }

    public Integer getMinimumLength() {
        return minimumLength;
    }

    public void setMinimumLength(Integer minimumLength) {
        this.minimumLength = minimumLength;
    }

    public Integer getMaximumLength() {
        return maximumLength;
    }

    public void setMaximumLength(Integer maximumLength) {
        this.maximumLength = maximumLength;
    }

    public List<Character> getAllowCharacters() {
        return allowCharacters;
    }

    public void setAllowCharacters(List<Character> allowCharacters) {
        this.allowCharacters = allowCharacters;
    }

    public ResponsePasswordPolicy() {
        super();
    }

    public ResponsePasswordPolicy(boolean success, String message) {
        super(success, message);
    }
}