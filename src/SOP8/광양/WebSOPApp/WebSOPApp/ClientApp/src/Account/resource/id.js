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
            "textTitlePwd": "Password",
            "textPwdInput": "비밀번호를 입력하세요.",
            "textPwdFind": "비밀번호를 잊으셨나요?",
            "textLoginIDError": "아이디를 입력하세요.",
            "textLoginPwdError": "비밀번호를 입력하세요.",
            "textLoginError": "아이디 또는 비밀번호를 잘못 입력했습니다.\n입력하신 내용을 다시 한번 확인하세요.",
            "textIDsave": "ID 저장",
            "textTitleName": "Name",
            "textPlaceName": "사용자 이름을 입력하세요.", 
            "textTitlePhone": "Phone number",
            "textPlacePhone": "핸드폰 번호를 입력하세요.",
            "textFindPwdError": "조회된 사용자 정보가 없습니다.\n입력하신 내용을 다시 확인하세요.",
            "textFindPwdSuccessPhone": "임시 비밀번호 전송이 완료되었습니다.\n문자 확인 후 비밀번호 변경을 진행하세요.",
            "textGoLoginPage": "로그인페이지로 돌아가기",
            "textAutoLogin": "로그인 상태 유지",
            "textCurrentPwdPlaceholder": "현재 비밀번호를 입력하세요.",
            "textNewPwdPlaceholder": "새 비밀번호를 입력하세요.",
            "textNewPwdConfirmPlaceholder": "새 비밀번호 확인을 입력하세요.",
            "errorPwdMismatch": "새 비밀번호와 비밀번호 확인이 일치하지 않습니다.\n다시 확인하세요.",
            "errorPwdCurrentMismatch": "기존 비밀번호가 맞지 않습니다. 확인바랍니다.",
            "errorPwdSameAsCurrent": "같은 비밀번호로 변경하실 수 없습니다.",
            "successPwdChanged": "비밀번호가 변경되었습니다.\n다시 로그인 하세요.",

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

    /*
        [계정관리]
        총괄관리자 : 동일권한 제외 생성/편집/삭제 가능
        관리자 : 동일권한 및 상위권한 제외 생성/편집/삭제 가능
        사용자 : 전부 불가 (읽기만 가능)

        [조직관리]
        총괄관리자 : 파일업로드/다운로드/생성/편집/삭제 가능
        관리자 : 파일업로드/다운로드/생성/편집/삭제 가능
        사용자 : 파일 다운로드만 가능

        [환경설정]
        총괄관리자 : 모든 탭 표출
        관리자 : 사용자 옵션 탭만 표출
        사용자 : 사용자 옵션 탭만 표출

        [SOP 환경설정]
        총괄관리자 : 환경설정 버튼 표출
        관리자 : 버튼 미표출
        사용자 : 버튼 미표출

        [SOP 편집]
        총괄관리자 : 편집 가능
        관리자 : 편집 가능
        사용자 : 편집 불가능
    */
    static accountLevelNo = {
        master: 1,  // 총괄관리자
        admin: 2,   // 관리자
        user: 3,    // 사용자
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
        memberName: 0,
        userID: 1,
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

        if (/^02\d{7}$/.test(number)) {
            return number.replace(/^(\d{2})(\d{3})(\d{4})$/, '$1-$2-$3');
        }

        if (/^02\d{8}$/.test(number)) {
            return number.replace(/^(\d{2})(\d{4})(\d{4})$/, '$1-$2-$3');
        }

        if (/^01\d{9}$/.test(number)) {
            return number.replace(/^(\d{3})(\d{4})(\d{4})$/, '$1-$2-$3');
        }

        if (/^0\d{2}\d{7}$/.test(number)) {
            return number.replace(/^(\d{3})(\d{3})(\d{4})$/, '$1-$2-$3');
        }

        if (/^0\d{2}\d{8}$/.test(number)) {
            return number.replace(/^(\d{3})(\d{4})(\d{4})$/, '$1-$2-$3');
        }

        return number;
    }
}