import { AccountController } from "../../Account/services/accountController";
import SessionString from "../../Common/js/sessionString";
import TreeNode from "../../TeamEditor/ui/utility/treenode";

export default class ProjectResource {
    static targetLanguage = "ko";
    static baseUrl = "";
    static sites = null;

    static _siteSn = null;

    static get ID() {
        return ProjectResource.id[ProjectResource.targetLanguage];
    }

    static get site_sn() {
        return ProjectResource._siteSn;
    }

    static set site_sn(id) {
        ProjectResource._siteSn = id;
    }

    static path = {
        root: "/",
        sdms: "/sdms",
        dashboard: "/dashboard",
        sopSimulator: "/sop-simulator",
        sopManager: "/sop-manager",
        history: "/history",
        teamEditor: "/team-editor",
        sensorSimulator: '/sensors',
    }

    static id = {
        "ko": {

            "title": {
                sdms: "관제 서비스",
                dashboard: "대시보드",
                sopSimulator: "SOP 서비스",
                sopManager: "SOP 편집",
                teamEditor: "조직관리",
                history: "이력관리",
                sensorSimulator: "센서테스트",
                report: "리포트",
            }
        }
    }

    // 알림창 타입
    static dialogTypes = {
        ERROR: 'ERROR',
        WARNING: 'WARNING',
        INFO: 'INFO',
        QUESTION: 'QUESTION',
        SUCCESS: 'SUCCESS',
        CHECK: 'CHECK',
        MALFUNCTION: 'MALFUNCTION'
    }

    static styleMode = "default";

    static setMode = (mode) => {
        ProjectResource.styleMode = mode;
    }

    static getUserInfo() {
        const site_sn = ProjectResource.site_sn;

        if (site_sn === null || site_sn === undefined ||
            window.localStorage.getItem(SessionString.Key.account + "_" + site_sn.toString()) == null)
            return null;

        let userInfo = JSON.parse(window.localStorage.getItem(SessionString.Key.account + "_" + site_sn.toString()));

        if (userInfo?.options) {
            // 계정 옵션 JSON string 일 경우 객체로 변환 
            if (typeof (userInfo.options) === "string")
                userInfo.options = JSON.parse(userInfo.options);
        }

        return userInfo;
    }

    static async initUserInfo() {
        let site_sn = ProjectResource.site_sn;

        if (site_sn === null || site_sn === undefined) {
            site_sn = await ProjectResource.loadSiteID();
        }

        return ProjectResource.getUserInfo();
    }

    static getUserAuthor() {
        const userInfo = ProjectResource.getUserInfo();
        let userAuthor = null;
        
        if (userInfo !== null && userInfo !== undefined)
            userAuthor = userInfo.grad_sn;
        
        return userAuthor;
    }
    
    static async initUserAuthor() {
        let site_sn = ProjectResource.site_sn;

        if (site_sn === null || site_sn === undefined) {
            site_sn = await ProjectResource.loadSiteID();
        }

        return ProjectResource.getUserAuthor();
    }

    static async loadSiteID() {
        let site_sn = ProjectResource.site_sn;

        if (site_sn === null || site_sn === undefined) {
            const [result, message] = await AccountController.requestAllSite();

            if (result?.success) {
                ProjectResource.site_sn = result.sites[0].site_sn;
                ProjectResource.sites = result.sites;

                if (result.useMultiSite) {
                    ProjectResource.bMultiSite = result.useMultiSite;
                }
            }
            else {
                console.log(message);
            }
        }

        return site_sn;
    }

    static setLoginUser(user) {
        if (user === null || user === undefined)
            return;

        const site_sn = user.site_sn;

        // showSiteNo 관련 추가
        const strSiteNo = !site_sn ? null : site_sn.toString();
        const userInfo = JSON.parse(window.localStorage.getItem(SessionString.Key.account + "_" + strSiteNo));

        if (userInfo?.showSiteNo) {
            user.showSiteNo = userInfo.showSiteNo;
        } else {
            user.showSiteNo = site_sn;
        }

        ProjectResource.site_sn = site_sn;
        window.localStorage.setItem(SessionString.Key.account + "_" + strSiteNo, JSON.stringify(user));
    }

    static treeCascadeMode() {
        return TreeNode.CheckBox_NormalUse;
    }

    static errorCode = {
        beginTransactionFail: 1000,
        commitTransactionFail: 1001,
        duplicateData: 1100,
        noParameters: 1101,
        invalidParameters: 1102,
        unknownError: 1999
    }
}

