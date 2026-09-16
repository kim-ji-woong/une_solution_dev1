import ProjectResource from "../../Root/resource/id";

export default class SettingsResource {
    static get ID() {
        return SettingsResource.id[ProjectResource.targetLanguage];
    }

    static id = {
        "ko": {
            menu: {
                monitoring3D: "3D 관제",
                sopSet: "SOP",
                cctv: "CCTV",
                etc: "기타"
            }
        }
    }

    static menu = {
        monitoring3D: 0,
        sopSet: 1,
        cctv: 2,
        etc: 3
    }
}