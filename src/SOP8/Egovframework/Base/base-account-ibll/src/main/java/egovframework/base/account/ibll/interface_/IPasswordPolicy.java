package egovframework.base.account.ibll.interface_;

import java.util.List;

public interface IPasswordPolicy {

    boolean isNeedUpperCase();
    void setNeedUpperCase(boolean needUpperCase);

    boolean isNeedLowerCase();
    void setNeedLowerCase(boolean needLowerCase);

    boolean isNeedNumber();
    void setNeedNumber(boolean needNumber);

    boolean isNeedCharacter();
    void setNeedCharacter(boolean needCharacter);

    Integer getMinimumLength();
    void setMinimumLength(Integer minimumLength);

    Integer getMaximumLength();
    void setMaximumLength(Integer maximumLength);

    List<Character> getAllowCharacters();
    void setAllowCharacters(List<Character> allowCharacters);
}