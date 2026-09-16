import ProjectResource from "../../Root/resource/id";

export default class AccountResource {
    static get ID() {
        return AccountResource.id[ProjectResource.targetLanguage];
    }

    static id = {
        "ko": {
            "textLogin": "로그인",
            "textSignUp": "회원가입",
            "textEmailInput": "이메일 입력",
            "textIDInput": "아이디를 입력해주세요",
            "textPwdInput": "비밀번호를 입력해주세요",
            "textIDFind": "아이디 찾기",
            "textPwdFind": "비밀번호 찾기",
            "textLoginError": "가입하지 않은 아이디 이거나 잘못된 비밀번호 입니다.",
            "textLoginIDError": "아이디를 입력하세요.",
            "textLoginPwdError": "비밀번호를 입력하세요.",
            "textSearch": "검색",
            "textRemove": "삭제",
            "textRegister": "등록",
            "textReRegister": "재등록",
            "textBefore": "이전",
            "textSetPasswordMessage": "안전한 비밀번호로 내정보를 보호하세요.",
            "textSetPasswordInfo": "비밀번호 찾을 계정 정보를 입력해주세요.",
            "textTitleID": "ID",
            "textTitleName": "이름",
            "textTitlePwd": "새 비밀번호",
            "textTitleRePwd": "새 비밀번호 확인",
            "textTitleEmail": "이메일",
            "textPlacePwd": "새 비밀번호를 입력하세요.",
            "textPlaceID": "ID를 입력하세요.",
            "textPlaceEmail": "Email를 입력하세요.",
            "textPlaceName": "이름을 입력하세요.",
            "textTitlePwdConfirm": "비밀번호",
            "textPlacePwdConfirm": "기존 비밀번호를 입력하세요.",
            "textTitlePhone": "핸드폰 번호",
            "textPlacePhone": "핸드폰 번호를 입력하세요.",

            popupMode:
            {
                manager: "사용자 권한 관리",
                register: "사용자 권한 등록",
                report: "삭제이력",
            },

            setPwdMode:
            {
                userInfo: "사용자 정보",
                setPwd: "비밀번호 변경",
                message: "메시지",
            },

            arrDayStr: ['일', '월', '화', '수', '목', '금', '토'],

            accountLevel: 
            {
                vdsManager: "마스터",
                vdcSupervisor: "총괄관리자",
                user: "관리자"
            }
        },
        "en": {

        }
    }

    static accountLevel = {
        vdsManager: 1,
        vdcSupervisor: 2,
        user: 3
    }

    // login : 로그인 
    // logout : 로그아웃
    // false: 세션 조회 실패
    // disconnected : 네트워크 연결 끊김
    // licenseWait: 아직 라이센스가 유효한 시작일자가 되지 않았음
    // licenseExpired: 라이센스 만료됨. 하지만 사용할 수는 있음
    // licenseAlert: 라이센스 만료일이 다가오니 알려준다.
    // licenseInvalid: 라이센스 사용불가
    static loginState = {
        login: 0,
        logout: 1,
        false: 2,
        disconnected: 3
    }

    static findMode = {
        email: 0,
        sms: 1,
    }
}