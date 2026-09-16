package egovframework.base.account.bll.resource;

import java.util.HashMap;
import java.util.Map;
import egovframework.base.response.resource.MessageMap;
import egovframework.base.response.resource.ID.LanguageTypes;

public class ErrorMessageFormat extends MessageMap {

    private static Map<LanguageTypes, Map<String, Object>> messageMaps = null;

    private static void init() {
        Map<LanguageTypes, Map<String, Object>> tempMessageMaps = new HashMap<>();

        // 한글 메시지 설정
        setMessage(tempMessageMaps, LanguageTypes.ko, "lockFail",
                "{0}회 이상 로그인에 실패하였기 때문에 앞으로 {1}분 동안 {2} 할수 없습니다.");
        setMessage(tempMessageMaps, LanguageTypes.ko, "lockLoginFail",
                "{0}회 이상 로그인에 실패하였기 때문에 앞으로 {1}분 동안 로그인 할수 없습니다.");
        setMessage(tempMessageMaps, LanguageTypes.ko, "lockLoginFail2",
                "ID 또는 비밀번호를 잘못 입력하였습니다. ({0}/{1}회)\n연속으로 {1}회 이상 로그인에 실패하면 {2}분동안 해당 계정으로 로그인 할 수 없습니다.");

        // TODO: 영어 메시지 설정

        messageMaps = tempMessageMaps;
    }

    public ErrorMessageFormat(Map<String, Object> messageMaps) {
        super(messageMaps);
    }

    public ErrorMessageFormat() {
        super(null);
    }

    @Override
    public MessageMap get(LanguageTypes type) {
        if (messageMaps == null) {
            init();
        }

        Map<String, Object> maps = messageMaps.get(type);
        if (maps != null) {
            this.maps = maps;
        } else {
            this.maps = null;
        }

        return this;
    }
}