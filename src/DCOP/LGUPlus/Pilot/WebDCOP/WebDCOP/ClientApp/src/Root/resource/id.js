import SessionString from "../../Common/js/sessionString";

export default class ProjectResource {
    static targetLanguage = "ko";
    static siteID = 1;

    static version = "1.0.0";   // DCOP 버전

    /* 개발1팀 개발환경 */
    static baseUrl = "";

    static loginUser = null;

    static get ID() {
        return ProjectResource.id[ProjectResource.targetLanguage];
    }

    static id = {
        "ko": {
            button: {
                confirm: '확인',
                initialize: '초기화',
                save: '저장'
            },
            messageBox: {
                title: {
                    error: "에러",
                    warning: "오류",
                    info: "정보",
                    confirm: "확인",
                    confirmCancel: "삭제",
                }
            },
            errorMessage: {
                sameRackName: "이미 같은 이름의 Rack이 존재합니다.",
                failMakeRackGroup: "이미 다른 그룹에 속해있습니다.",
                sameRackGroupName: "이미 같은 이름의 Rack 그룹이 존재합니다.",
                noPermissionToUser: "일반사용자는 사용할 수 없는 기능입니다."
            }
        }
    }

    static path = {
        root: "/",
        dashboard: "/dashboard",
        main: '/main'
    }

    // 알림창 타입
    static dialogTypes = {
        ERROR: 'ERROR',
        WARNING: 'WARNING',
        INFO: 'INFO',
        QUESTION: 'QUESTION',
        SUCCESS: 'SUCCESS'
    }

    static dataCenter = {
        bakdal: 1,
        magok: 2
    }

    static getUserInfo() {
        if (window.localStorage.getItem(SessionString.Key.account) == null)
            return null;

        let userInfo = JSON.parse(window.localStorage.getItem(SessionString.Key.account));

        if (userInfo?.options)  {
            // 계정 옵션 JSON string 일 경우 객체로 변환 
            if (typeof (userInfo.options) === "string")
                userInfo.options = JSON.parse(userInfo.options);
        }

        return userInfo;
    }

    static async initUserInfo() {
        return ProjectResource.getUserInfo();
    }

    static getUserAuthor() {
        const userInfo = ProjectResource.getUserInfo();
        let userAuthor = null;

        if (userInfo !== null && userInfo !== undefined)
            userAuthor = userInfo.level;

        return userAuthor;
    }

    static async initUserAuthor() {
        return ProjectResource.getUserAuthor();
    }

    static setLoginUser(user) {
        ProjectResource.loginUser = user;

        window.localStorage.setItem(SessionString.Key.account, JSON.stringify(user));
    }

    static clearLoginUser() {
        ProjectResource.loginUser = null;
    }

    static styleMode = "default";

    static setMode = (mode) => {
        ProjectResource.styleMode = mode;
    }

    static moveTo(target) {
        if (ProjectResource.targetLanguage === "ko") {
            return target + "  이동 >>";
        }

        return "move to " + target + " >>";
    }

    static getSiteName(site) {
        if (!site) {
            return "";
        }

        if (ProjectResource.targetLanguage === "ko") {
            return site.name;
        }

        return site.engName;
    }

    static getNationName(nation) {
        if (!nation) {
            return "";
        }

        if (ProjectResource.targetLanguage === "ko") {
            return nation.name;
        }

        return nation.engName;
    }

    static getCompanyName(company) {
        if (!company) {
            return "";
        }

        if (ProjectResource.targetLanguage === "ko") {
            return company.name;
        }

        return company.engName;
    }

    static deleteObject(obj) {
        for (const key in obj) {
            const data = obj[key];

            if (data instanceof HTMLElement) {
                continue;
            }
            else if (data && !Array.isArray(data) && data instanceof Object) {
                ProjectResource.deleteObject(data);
            }

            delete obj[key];
        }
    }

    static makeClone(obj) {
        if (!obj) {
            return obj;
        }

        let _obj;

        if (Array.isArray(obj)) {
            _obj = [...obj];
            const count = _obj.length;

            for (let i = 0; i < count; i++) {
                _obj.splice(i, 1, ProjectResource.makeClone(_obj[i]));
            }
        }
        else if (obj instanceof Object) {
            _obj = { ...obj };

            for (const key in _obj) {
                _obj[key] = ProjectResource.makeClone(_obj[key]);
            }
        }
        else {
            return obj;
        }

        return _obj;
    }
}

