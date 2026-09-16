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
                etc: "기타"
            }
        }
    }

    static menu = {
        monitoring3D: 0,
        sopSet: 1,
        etc: 2
    }

    static spreadMenu = {
        spreadList: 0,
        addSpread: 1
    }

    static sortType = {
        sensorTypeName: 0,
        zoneName: 1,
        disasterCategoryName: 2,
        subDisasterCategoryName: 3
    }
    
    static convertReceiveTypeStringToID = (receiveTypeString) => {
        switch (receiveTypeString) {
            case "UseReceiveAtmosphere":
                return 1;
            case "UseReceiveRainfall":
                return 4;
            case "UseReceiveWaterLevel":
                return 2;
            case "UseReceiveOdor":
                return 13;
            case "UseReceiveAIOdor":
                return 14;
            default:
                return -1; // Invalid type
        }
    }
    
    static detectType = {
        "센서탐지": 300400,
        "재난신고": 300401,
        "복구신호": 300402
    }

    static convertDetectTypeStringToName = (detectTypeString) => {
        switch (detectTypeString) {
            case "센서탐지":
                return this.detectType.센서탐지;
            case "재난신고":
                return this.detectType.재난신고;
            case "복구신호":
                return this.detectType.복구신호;
        }
    }
}