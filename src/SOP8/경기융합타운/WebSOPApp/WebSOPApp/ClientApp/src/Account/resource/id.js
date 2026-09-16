import ProjectResource from "../../Root/resource/id";

export default class AccountResource {
    static get ID() {
        return AccountResource.id[ProjectResource.targetLanguage];
    }

    static id = {
        "ko": {
            "textTitleID": "ID",
            "textIDInput": "아이디를 입력하세요.",
            "textTitlePwd": "Password",
            "textPwdInput": "비밀번호를 입력하세요.",
            "textPwdFind": "비밀번호를 잊으셨나요?",
            "textLoginIDError": "아이디를 입력하세요.",
            "textLoginPwdError": "비밀번호를 입력하세요.",
            "textLoginError": "ID 또는 Password가 일치하지 않습니다.",
            "textIDsave": "ID 저장",
            "textTitleName": "Name",
            "textPlaceName": "이름을 입력하세요.",
            "textTitlePhone": "Phone number",
            "textPlacePhone": "휴대전화번호를 입력하세요.",
            "textGoLoginPage": "로그인페이지로 돌아가기",

            menu: {
                accountList: "목록",
                accountAddUser: "신규등록"
            }
        }
    }
    
    static menu = {
        accountList: 0,
        accountAddUser: 1
    }

    static accountLevelID = {
        master: 1,      // 총괄관리자 (종합방재실)
        admin: 2,       // 관리자 (입주기관)
        user: 3,        // 사용자 (입주기관)
    }

    static findMode = {
        email: 0,
        sms: 1,
    }

    // login : 로그인 
    // logout : 로그아웃
    // false: 세션 조회 실패
    // disconnected : 네트워크 연결 끊김
    static loginState = {
        login: 0,
        logout: 1,
        false: 2,
        disconnected: 3,
    }
}