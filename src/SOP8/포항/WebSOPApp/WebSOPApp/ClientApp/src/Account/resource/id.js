import ProjectResource from "../../Root/resource/id";

export default class AccountResource {
    static get ID() {
        return AccountResource.id[ProjectResource.targetLanguage];
    }

    static accountLevelID = {
        master: 0,
        admin: 1,
        user: 2,
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
            "textAutoLogin": "로그인 상태 유지",

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

    static accountLevelNo = {
        master: 0,
        admin: 1,
        user: 2,
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

    static sortType = {
        teamName: 0,
        jobLevel: 1,
        grade: 2
    }

    // 전화번호 형식의 데이터에 하이픈(-)이 없을 경우 formating
    static formatNumber = (value) => {
        // 이미 하이픈이 있는 경우 그대로 반환
        if (value === null || value.includes('-')) {
            return value;
        }
    
        // 숫자만 남기기 (공백이나 다른 문자 들어왔을 경우)
        const number = value.replace(/\D/g, '');

        // 02 지역번호 (9자리)
        if (/^02\d{7}$/.test(number)) {
            const formattedNumber = number.replace(/^(\d{2})(\d{3})(\d{4})$/, '$1-$2-$3');
            return formattedNumber;
        }

        // 0XX 지역번호 (10자리)
        if (/^0\d{2}\d{8}$/.test(number)) {
            const formattedNumber = number.replace(/^(\d{3})(\d{4})(\d{4})$/, '$1-$2-$3');
            return formattedNumber;
        }

        // 휴대폰 번호 (11자리)
        if (/^01\d{9}$/.test(number)) {
            const formattedNumber = number.replace(/^(\d{3})(\d{4})(\d{4})$/, '$1-$2-$3');
            return formattedNumber; 
        }

        return number;
    }
}