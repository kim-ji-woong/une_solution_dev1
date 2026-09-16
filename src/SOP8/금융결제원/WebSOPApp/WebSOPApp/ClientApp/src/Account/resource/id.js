import ProjectResource from "../../Root/resource/id";

export default class AccountResource {
    static get ID() {
        return AccountResource.id[ProjectResource.targetLanguage];
    }

    static id = {
        "ko": {
            "textIDInput": "아이디",
            "textPwdInput": "비밀번호",
            "textPwdFind": "비밀번호 찾기",
            "textLoginIDError": "아이디를 입력하세요.",
            "textLoginPwdError": "비밀번호를 입력하세요.",
            "textLoginError": "아이디 또는 비밀번호를 잘못 입력했습니다.\n입력하신 내용을 다시 한번 확인하세요.",
            "textIDsave": "ID 저장",
            "textTitleName": "이름",
            "textPlaceName": "사용자 이름을 입력하세요.",
            "textTitlePhone": "핸드폰 번호",
            "textTitleEmail": "이메일",
            "textPlacePhone": "핸드폰 번호를 입력하세요.",
            "textPlaceEmail": "이메일을 입력하세요.",
            "textFindPwdError": "조회된 사용자 정보가 없습니다.\n입력하신 내용을 다시 확인하세요.",
            "textFindPwdSuccessPhone": "임시 비밀번호 전송이 완료되었습니다.\n문자 메세지 확인 후 비밀번호 변경을 진행하세요.",
            "textFindPwdSuccessEmail": "임시 비밀번호 전송이 완료되었습니다.\n메일 확인 후 비밀번호 변경을 진행하세요.",
            "textGoLoginPage": "취소하고 돌아기기",
            "textCurrentPwdError": "현재 비밀번호를 입력하세요.\n비밀번호를 잃어버린 경우 비밀번호 찾기 기능을 이용하세요.",
            "textNewPwd1Error": "새 비밀번호를 입력하세요.",
            "textNewPwd2Error": "새 비밀번호 확인을 입력하세요.",
            "textPasswordMismatchError": "새 비밀번호와 비밀번호 확인이 일치하지 않습니다.\n다시 확인하세요.",
            "textSamePasswordErrorMessage": "같은 비밀번호로 변경하실 수 없습니다.\n다시 확인하세요.",
            "textPasswordRule": "영문 대소문자와 숫자 또는 특수문자 (_,-) 조합으로 5~10자로 입력하세요.",
            "textSuccessChangePwd": "비밀번호가 변경되었습니다.\n다시 로그인 하세요.",

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
        master: 1,
        admin: 2,
        user: 3,
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

    static findMode = {
        email: 0,
        sms: 1,
    }

    static sortType = {
        teamName: 0,
        jobLevel: 1,
        grade: 2
    }

    // 전화번호 형식의 데이터에 하이픈(-)이 없을 경우 formating
    static formatNumber = (value) => {
        // 이미 하이픈이 있는 경우 그대로 반환
        if (value.includes('-')) {
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