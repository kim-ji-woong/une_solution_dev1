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
            "beginTime": beginTime,
            "endTime": endTime,
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
}