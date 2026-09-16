export class SopSimulatorJsonManager {
    static makeRequestSopDisasterCategoryList(campusID) {
        const json = {
            "campusID": campusID
        };

        return JSON.stringify(json);
    }

    static makeRequestSopSubDisasterCategoryList(campusID) {
        const json = {
            "campusID": campusID
        };

        return JSON.stringify(json);
    }

    static makeRequestStandardActionStepNameList() {
        const json = {
        };

        return JSON.stringify(json);
    }

    static makeRequestSOPHistories(beginTime, endTime, subDisasterCategoryID, actionStepName, accessedUserName, campusID) {
        const json = {
            "beginTime": SopSimulatorJsonManager.makeTime(beginTime),
            "endTime": SopSimulatorJsonManager.makeTime(endTime),
            "subDisasterCategoryID": subDisasterCategoryID,
            "actionStepName": actionStepName,
            "lastAccessedUserName": accessedUserName,
            "campusID": campusID
        };

        return JSON.stringify(json);
    }

    static makeRequestComponentHistories(actionStepHistoryID, campusID) {
        const json = {
            "actionStepHistoryID": actionStepHistoryID,
            "campusID": campusID
        };

        return JSON.stringify(json);
    }

    static makeDisplaySopRun(siteNo, userNo, componentHistoryDatas) {
        const json = {
            "siteNo": siteNo,
            "userNo": userNo,
            "actionStepHistoryDatas": componentHistoryDatas
        };

        return JSON.stringify(json);
    }

    static makeExcuteSOP(smallClassNo, actionStepNo, userNo, position, beginTime, sensorZoneHistoryNo) {
        const json = {
            "smallClassNo": smallClassNo,
            "actionStepNo": actionStepNo,
            "lastAccessedUserNo": userNo,
            "position": position,
            "beginTime": SopSimulatorJsonManager.makeTime(beginTime),
            "sensorZoneHistoryNo": sensorZoneHistoryNo
        };

        return JSON.stringify(json);
    }

    static makeCloseSOPByUser(actionStepHistoryNo, endTime, userNo) {
        const json = {
            "actionStepHistoryNo": actionStepHistoryNo,
            "endTime": SopSimulatorJsonManager.makeTime(endTime),
            "lastAccessedUserNo": userNo
        };

        return JSON.stringify(json);
    }

    static makeNextActionStep(largeClassNo, middleClassNo, smallClassNo, nextActionStepNo, currentActionStepNo, userNo, sensorZoneHistoryNo) {
        const json = {
            "largeClassNo": largeClassNo,
            "middleClassNo": middleClassNo,
            "smallClassNo": smallClassNo,
            "nextActionStepNo": nextActionStepNo,
            "prevActionStepNo": currentActionStepNo,
            "accessedUserNo": userNo,
            "sensorZoneHistoryNo": sensorZoneHistoryNo
        };

        return JSON.stringify(json);
    }

    static makeRunSection(actionStepNo, actionStepHistoryNo, componentNo, componentType, accessedUserNo, sensorZoneHistoryNo, decisionValue) {
        const json = {
            "actionStepNo": actionStepNo,
            "actionStepHistoryNo": actionStepHistoryNo,
            "componentNo": componentNo,
            "componentType": componentType,
            "accessedUserNo": accessedUserNo,
            "sensorZoneHistoryNo": sensorZoneHistoryNo,
            "decisionValue": decisionValue
        };

        return JSON.stringify(json);
    }

    static makeSetCurrentSection(actionStepNo, actionStepHistoryNo, componentNo, componentType, accessedUserNo, sensorZoneHistoryNo, decisionValue) {
        const json = {
            "actionStepNo": actionStepNo,
            "actionStepHistoryNo": actionStepHistoryNo,
            "componentNo": componentNo,
            "componentType": componentType,
            "accessedUserNo": accessedUserNo,
            "sensorZoneHistoryNo": sensorZoneHistoryNo,
            "decisionValue": decisionValue
        };

        return JSON.stringify(json);
    }

    static makeGetComponentHistory(actionStepHistoryNo, lastComponentHistoryNo) {
        const json = {
            "actionStepHistoryNo": actionStepHistoryNo,
            "lastComponentHistoryNo": lastComponentHistoryNo
        };

        return JSON.stringify(json);
    }

    static makeProgressMission(actionStepHistoryNo, actionStepNo, componentNo, componentType, dataIndex, componentStatus, userNo, checked) {
        const json = {
            "actionStepHistoryNo": actionStepHistoryNo,
            "actionStepNo": actionStepNo,
            "componentNo": componentNo,
            "componentType": componentType,
            "dataIndex": dataIndex,
            "componentStatus": componentStatus,
            "accessedUserNo": userNo,
            "checked": checked
        };

        return JSON.stringify(json);
    }

    static makeSendMessage(actionStepHistoryNo, componentNo, componentType, userNo, useSMS, useEmail, useBroadcast, useSiren, message, receivers, siteNo) {
        const json = {
            "actionStepHistoryNo": actionStepHistoryNo,
            "componentNo": componentNo,
            "componentType": componentType,
            "accessedUserNo": userNo,
            "useSMS": useSMS,
            "useEmail": useEmail,
            "useBroadcast": useBroadcast,
            "useSiren": useSiren,
            "message": message,
            "receivers": receivers,
            "siteNo": siteNo
        };

        return JSON.stringify(json);
    }

    static makeRequestConvertSpecialCharacters(actionStepHistoryNo, message) {
        const json = {
            "actionStepHistoryNo": actionStepHistoryNo,
            "message": message
        };

        return JSON.stringify(json);
    }

    static makeTime(time) {
        if (!time) {
            return null;
        }

        time = time.trim();
        let index = time.indexOf(' ');

        if (index > 0) {
            time = time.substring(0, index) + "T" + time.substring(index + 1);
        }

        return time;
    }
}