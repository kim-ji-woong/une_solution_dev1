package egovframework.base.account.bll.resource;

import java.util.HashMap;
import java.util.Map;
import egovframework.base.response.resource.MessageMap;
import egovframework.base.response.resource.ID.LanguageTypes;

public class ErrorMessage extends MessageMap {

    private static Map<LanguageTypes, Map<String, Object>> messageMaps = null;

    private static void init() {
        Map<LanguageTypes, Map<String, Object>> tempMessageMaps = new HashMap<>();

        // 한글 메시지
        setMessage(tempMessageMaps, LanguageTypes.ko, "moreParameter", "Parameter가 부족합니다.");
        setMessage(tempMessageMaps, LanguageTypes.ko, "unknownID", "존재하지 않는 계정입니다.\n입력한 정보를 다시 확인해주세요.");
        setMessage(tempMessageMaps, LanguageTypes.ko, "unknownUser", "계정정보를 찾을수 없습니다.");
        setMessage(tempMessageMaps, LanguageTypes.ko, "noneUserLevel", "계정등급 정보를 찾을수 없습니다.");
        setMessage(tempMessageMaps, LanguageTypes.ko, "failToCreateUser", "계정 생성에 실패하였습니다.");
        setMessage(tempMessageMaps, LanguageTypes.ko, "failToSession", "세션 생성에 실패하였습니다.");
        setMessage(tempMessageMaps, LanguageTypes.ko, "invalidUserInfo", "아이디 또는 비밀번호가 잘못되었습니다.");
        setMessage(tempMessageMaps, LanguageTypes.ko, "failToInitLoginFail", "로그인 실패횟수 초기화에 실패하였습니다.");
        setMessage(tempMessageMaps, LanguageTypes.ko, "failToUpdateLoginFail", "로그인 실패횟수 업데이트에 실패하였습니다.");
        setMessage(tempMessageMaps, LanguageTypes.ko, "successToLogin", "로그인에 성공하였습니다.");
        setMessage(tempMessageMaps, LanguageTypes.ko, "failToReadSession", "세션 정보를 읽어오는데 실패하였습니다.");
        setMessage(tempMessageMaps, LanguageTypes.ko, "failToUpdateSession", "세션 업데이트에 실패하였습니다.");
        setMessage(tempMessageMaps, LanguageTypes.ko, "noneSession", "세션 정보가 존재하지 않습니다.");
        setMessage(tempMessageMaps, LanguageTypes.ko, "logoutSession", "로그아웃 되었습니다.");
        setMessage(tempMessageMaps, LanguageTypes.ko, "validSession", "해당 Session은 유효합니다.");
        setMessage(tempMessageMaps, LanguageTypes.ko, "anotherOneLogin", "다른 곳에서 로그인하였습니다.");
        setMessage(tempMessageMaps, LanguageTypes.ko, "failToReadOption", "사용자의 옵션 정보를 읽을 수 없습니다.");
        setMessage(tempMessageMaps, LanguageTypes.ko, "failToSaveOption", "사용자의 옵션 정보를 저장할 수 없습니다.");

        // TODO: 영어 메시지 추가

        messageMaps = tempMessageMaps;
    }

    public ErrorMessage(Map<String, Object> messageMaps) {
        super(messageMaps);
    }

    public ErrorMessage() {
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