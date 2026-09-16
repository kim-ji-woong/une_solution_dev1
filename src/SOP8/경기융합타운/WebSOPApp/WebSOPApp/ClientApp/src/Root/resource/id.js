import SessionString from "../../Common/js/sessionString";

export default class ProjectResource {
    static targetLanguage = "ko";
    static baseUrl = "";
    static sites = null;

    static siteNo = null;

    static get ID() {
        return ProjectResource.id[ProjectResource.targetLanguage];
    }

    static get SiteNo() {
        return ProjectResource.siteNo;
    }

    static set SiteNo(id) {
        ProjectResource.siteNo = id;
    }

    static path = {
        root: "/",
        findPassword: "/findPassword",
        sdms: "/sdms",
        sopSimulator: "/sop-simulator",
        sopManager: "/sop-manager",
        history: "/history",
        teamEditor: "/team-editor",
        dashboard: "/dashboard"
    }

    static id = {
        "ko": {

            "title": {
                sdms: "3D 관제화면",
                dashboard: "대시보드",
                sopSimulator: "SOP",
                sopManager: "SOP 편집",
                history: "이력관리",
                teamEditor: "조직관리",
            }
        }
    }

    // 알림창 타입
    static dialogTypes = {
        ERROR: 'ERROR',
        WARNING: 'WARNING',
        INFO: 'INFO',
        QUESTION: 'QUESTION',
        SUCCESS: 'SUCCESS'
    }

    static styleMode = "default";

    static setMode = (mode) => {
        ProjectResource.styleMode = mode;
    }

    static getUserInfo() {
        const siteNo = ProjectResource.SiteNo;

        if (siteNo === null || siteNo === undefined ||
            window.localStorage.getItem(SessionString.Key.account + "_" + siteNo.toString()) == null)
            return null;

        let userInfo = JSON.parse(window.localStorage.getItem(SessionString.Key.account + "_" + siteNo.toString()));

        if (userInfo?.options) {
            // 계정 옵션 JSON string 일 경우 객체로 변환 
            if (typeof (userInfo.options) === "string")
                userInfo.options = JSON.parse(userInfo.options);
        }

        return userInfo;
    }

    static async initUserInfo() {
        let siteNo = ProjectResource.SiteNo;

        if (siteNo === null || siteNo === undefined) {
            siteNo = await ProjectResource.loadSiteNo();
        }

        return ProjectResource.getUserInfo();
    }

    static getUserAuthor() {
        const userInfo = ProjectResource.getUserInfo();
        let userAuthor = null;

        if (userInfo)
            userAuthor = userInfo.levelNo;

        return userAuthor;
    }

    static async initUserAuthor() {
        let siteNo = ProjectResource.SiteNo;

        if (siteNo === null || siteNo === undefined) {
            siteNo = await ProjectResource.loadSiteNo();
        }

        return ProjectResource.getUserAuthor();
    }

    static async loadSiteNo() {
        let siteNo = ProjectResource.SiteNo;

        if (siteNo === null || siteNo === undefined) {
            // 사이트 ID 요청
            try {
                const res = await fetch('Commons/Commons/RequestGetSiteNo', {
                    method: 'post',
                    headers: {
                        'Accept': 'application/json',
                        'Content-Type': 'application/json'
                    }
                    //body: jsonData
                });

                if (res.ok) {
                    const result = await res.json();

                    if (result.success === true) {
                        ProjectResource.SiteNo = result.sites[0].id;

                        return ProjectResource.SiteNo;
                    } 
                }

            } catch (e) {
                console.log(e);
            }
        }

        return siteNo;
    }

    static setLoginUser(user) {
        if (user === null || user === undefined)
            return;

        const siteNo = user.siteNo;
        /*const siteNo = ProjectResource.SiteNo;
        if (siteNo === null || siteNo === undefined)
            return;*/

        // showSiteNo 관련 추가
        const userInfo = JSON.parse(window.localStorage.getItem(SessionString.Key.account + "_" + siteNo.toString()));

        if (userInfo?.showSiteNo) {
            user.showSiteNo = userInfo.showSiteNo;
        } else {
            user.showSiteNo = siteNo;
        }

        ProjectResource.SiteNo = siteNo;
        window.localStorage.setItem(SessionString.Key.account + "_" + siteNo.toString(), JSON.stringify(user));
    }

    static Site = {        
        GG_A: 40,           // 종합방재실
        GG_B: 41,           // 도본청,도의회
        GG_C: 43,           // 도서관
        GG_D: 44,           // 복합시설관
        GG_E: 45,           // 신용보증재단
        GG_F: 46,           // 교육청
        GG_G: 47            // 경기주택도시공사 신사옥
    }
}

