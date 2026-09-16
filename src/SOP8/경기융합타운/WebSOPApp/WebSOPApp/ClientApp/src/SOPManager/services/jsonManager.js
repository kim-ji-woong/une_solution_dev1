// import SpecialMessageParameter from "../../Common/js/specialMessageParameter";
import Arrow from "../../Common/sections/components/arrow";
import SopDataManager from "./sopDataManager";

export default class JsonManager{
    static contentsType = {
        DB: 0,
        XML: 1
    };

    static makeRequestDisasterCategories(isNormal) {
        const json = {
            "requestDisasterCategories":
            {
                "isNormal": isNormal
            }
        };

        return JSON.stringify(json);
    }

    static makeRequestStepMemberData() {
        const json = {
            "requestDefault":
            {
                "requestStepMember": true
            }
        };

        return JSON.stringify(json);
    }

    static makeRequestActionStepDatas() {
        const json = {
            "requestDefault":
            {
                "requestActionSteps": true
            }
        };

        return JSON.stringify(json);
    }

    static makeRequestDisasterVersions(sopData, isNormal) {
        if (sopData.disaster) {
            const json = {
                "requestDisasterVersions":
                {
                    "disasterID": sopData.disaster.id,
                    "isNormal": isNormal
                }
            };

            return JSON.stringify(json);
        }

        return null;
    }

    static makeRequestSaveXML(userID, sopData) {
        const jsonSopData = SopDataManager.sopDataToJson(sopData);

        if (jsonSopData === null) {
            return null;
        }

        const json = {
            "requestSave":
            {
                "target": JsonManager.contentsType.XML,
                "userID": userID,
                "sopData": jsonSopData
            }
        };

        return JSON.stringify(json);
    }

    static makeRequestSaveDB(userID, sopData) {
        const jsonSopData = SopDataManager.sopDataToJson(sopData);

        if (jsonSopData === null) {
            return null;
        }

        const json = {
            "requestSave":
            {
                "target": JsonManager.contentsType.DB,
                "userID": userID,
                "sopData": jsonSopData
            }
        };

        return JSON.stringify(json);
    }

    static makeRequestOpenDB(versionID) {
        const json = {
            "requestOpen":
            {
                "target": JsonManager.contentsType.DB,
                "versionID": versionID
            }
        };

        return JSON.stringify(json);
    }

    static makeRequestDeleteDB(versionIDs) {
        const json = {
            "requestDelete":
            {
                "versionIDs": versionIDs
            }
        };

        return JSON.stringify(json);
    }

    static makeRequestExternalPrograms() {
        const json = {
            "requestExternalProgram":
            {
                "programID": -1
            }
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
            actionStep: { id: id, stepName: stepName, disasterID: disasterID, userDefinedConfigID: null },
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
        const json = {
            "requestParseSpecialMessage": param.toJson()
        };

        return JSON.stringify(json);
    }

    static makeRequestSpecialMessageList() {
        const json = {
            "requestSpecialMessageList": true
        };

        return JSON.stringify(json);
    }

    static makeRequestLinkedSopDatas(siteNo) {
        const json = {
            "requestLinkedSopDatas": {
                "SiteNo": siteNo
            }
        };

        return JSON.stringify(json);
    }

    static makeCheckSectionValidation(sectionData, stepMemberID, userID) {
        const json = {
            "checkSectionData": {
                "sectionData": sectionData,
                "stepMemberID": stepMemberID,
                "userID": userID
            }
        };

        return JSON.stringify(json);
    }

    static makeCheckArrowValidation(arrowData, stepMemberID, userID) {
        const json = {
            "checkSectionData": {
                "sectionData": {
                    "componentType": arrowData.componentType,
                    "text": arrowData.text
                },
                "stepMemberID": stepMemberID,
                "userID": userID
            }
        };

        return JSON.stringify(json);
    }
}