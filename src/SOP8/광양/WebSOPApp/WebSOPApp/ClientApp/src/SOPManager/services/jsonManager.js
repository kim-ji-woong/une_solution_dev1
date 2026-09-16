// import SpecialMessageParameter from "../../Common/js/specialMessageParameter";
import Arrow from "../../Common/sections/components/arrow";
import SopDataManager from "./sopDataManager";

export default class JsonManager{
    static contentsType = {
        DB: 0,
        XML: 1
    };

    static makeRequestDefault(site_sn) {
        const json = {
            "site_sn": site_sn,
            "requestActionSteps": true
        };

        return JSON.stringify(json);
    }

    static makeRequestDisasterCategories(isNormal, site_sn) {
        const json = {
            "site_sn": site_sn,
            "isNormal": isNormal
        };

        return JSON.stringify(json);
    }

    static makeRequestStepMemberData(actionStepNo) {
        const json = {
            "actionStepNo": actionStepNo
        };

        return JSON.stringify(json);
    }

    static makeRequestActionStepDatas(site_sn) {
        const json = {
            "site_sn": site_sn,
            "requestActionSteps": true
        };

        return JSON.stringify(json);
    }

    static makeRequestDisasterVersions(sopData) {
        if (sopData.disaster) {
            const json = {
                "disasterNo": sopData.disaster.sclas_sn
            };

            return JSON.stringify(json);
        }

        return null;
    }

    static makeRequestSaveXML(user_sn, sopData) {
        const jsonSopData = SopDataManager.sopDataToJson(sopData);

        if (jsonSopData === null) {
            return null;
        }

        const json = {
            "target": JsonManager.contentsType.XML,
            "user_sn": user_sn,
            "sopData": jsonSopData
        };

        return JSON.stringify(json);
    }

    static makeRequestSaveDB(user_sn, sopData) {
        const jsonSopData = SopDataManager.sopDataToJson(sopData);

        if (jsonSopData === null) {
            return null;
        }

        const json = {
            "target": JsonManager.contentsType.DB,
            "user_sn": user_sn,
            "sopData": jsonSopData
        };

        return JSON.stringify(json);
    }

    static makeRequestOpenDB(disasterNo) {
        const json = {
            "target": JsonManager.contentsType.DB,
            "disasterNo": disasterNo
        };

        return JSON.stringify(json);
    }

    static makeRequestOpenAll(siteNo) {
        const json = {
            "siteNo": siteNo
        };

        return JSON.stringify(json);
    }

    static makeRequestDeleteDB(versionNos) {
        const json = {
            "versionNos": versionNos
        };

        return JSON.stringify(json);
    }

    static newStepMemberData(id = -1, teamID = -1, teamType = 2, actionStepID = -1, stepMemberName = '') {
        const stepMemberData = {
            stepMember: { id: id, teamID: teamID, teamType: teamType, actionStepID: actionStepID },
            stepMemberName: stepMemberName,
            sections: [],
            arrows: []
        };

        return stepMemberData;
    }

    static newActionStepData(id = -1, stepName = '경계', disasterID = -1, stepMemberData = null) {
        const stepMemberDatas = stepMemberData === null ? [] : [stepMemberData];

        const actionStepData = {
            actionStep: { action_step_sn: id, action_step_name: stepName, sclas_sn: disasterID },
            stepMemberDatas: stepMemberDatas
        };

        return actionStepData;
    }

    static newSubDisasterCategoryData(disasterCategoryID, subCategoryName, id = -1) {
        const sdcData = {
            subDisasterCategory: { id: id, disasterCategoryID: disasterCategoryID, subCategoryName: subCategoryName },
            disasters: {}
        };

        return sdcData;
    }

    static sectionsForArrows = null;

    static replacer(key, value) {
        if (key === "sections") {
            JsonManager.sectionsForArrows = value;
        }

        if (value instanceof Arrow)
        {
            if (JsonManager.sectionsForArrows === null) {
                return {};
            }

            return Arrow.toJson(value, JsonManager.sectionsForArrows);
        }

        return value;
    }

    static makeRequestParseSpecialMessage(param) {
        const json = param.toJson();

        return JSON.stringify(json);
    }

    static makeRequestSpecialMessageList() {
        const json = {
        };

        return JSON.stringify(json);
    }

    static makeRequestLinkedSopDatas(siteNo, sensorTypeDatas) {
        const json = {
            "siteNo": siteNo,
            "sensorTypeDatas": sensorTypeDatas
        };

        return JSON.stringify(json);
    }

    static makeRequestLoadLinkedSopVersions(site_sn, versionNos) {
        const json = {
            "site_sn": site_sn,
            "versionNos": versionNos
        };

        return JSON.stringify(json);
    }

    static makeCheckSectionValidation(sectionData, stepMemberNo, userNo) {
        const json = {
            "sectionData": SopDataManager.sectionToJson(sectionData),
            "stepMemberNo": stepMemberNo,
            "userNo": userNo
        };

        return JSON.stringify(json);
    }

    static makeCheckArrowValidation(arrowData, stepMemberNo, userNo) {
        const json = {
            "arrowData": JsonManager.arrowDataToJson(arrowData),
            "stepMemberNo": stepMemberNo,
            "userNo": userNo
        };

        return JSON.stringify(json);
    }

    static arrowDataToJson(arrowData) {
        const json = {
            "arrw_sn": arrowData.arrowNo,
            "contents": arrowData.text
        }

        return json;
    }
}