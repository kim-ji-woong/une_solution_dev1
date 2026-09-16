import ProjectResource from "../../Root/resource/id";
import { SopSimulatorJsonManager } from "./sopSimulatorJsonManager";

export class SopHistoryController {
    static async requestSopDisasterCategoryList(campusID) {
        try {
            const jsonData = SopSimulatorJsonManager.makeRequestSopDisasterCategoryList(campusID);

            const res = await fetch(ProjectResource.baseUrl + '/SOP/History/RequestSopDisasterCategoryList', {
                method: 'post',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                },
                body: jsonData
            });

            if (res.ok) {
                const result = await res.json();

                if (result.success) {
                    return [result.disasterCategories, ""];
                }
                else {
                    return [null, result.message];
                }
            }
        }
        catch (e) {
            console.log(e);
        }

        return [null, "requestSopDisasterCategoryList 실패"];
    }

    static async requestSopSubDisasterCategoryList(campusID) {
        try {
            const jsonData = SopSimulatorJsonManager.makeRequestSopSubDisasterCategoryList(campusID);

            const res = await fetch(ProjectResource.baseUrl + '/SOP/History/RequestSopSubDisasterCategoryList', {
                method: 'post',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                },
                body: jsonData
            });

            if (res.ok) {
                const result = await res.json();

                if (result.success) {
                    return [result.subDisasterCategories, ""];
                }
                else {
                    return [null, result.message];
                }
            }
        }
        catch (e) {
            console.log(e);
        }

        return [null, "requestSopDisasterCategoryList 실패"];
    }

    static async requestStandardActionStepNameList() {
        try {
            const jsonData = SopSimulatorJsonManager.makeRequestStandardActionStepNameList();

            const res = await fetch(ProjectResource.baseUrl + '/SOP/History/RequestStandardActionStepNameList', {
                method: 'post',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                },
                body: jsonData
            });

            if (res.ok) {
                const result = await res.json();
                return [result.actionStepNames, result.message];
            }
        }
        catch (e) {
            console.log(e);
        }

        return [null, "requestStandardActionStepNameList 실패"];
    }

    // disasterCategoryID : 0보다 작으면 전체
    // actionStepName : null이면 전체
    // accessedUserName : null이면 전체
    static async requestSOPHistories(beginTime, endTime, subDisasterCategoryID, actionStepName, accessedUserName, campusID) {

        if(actionStepName === '전체') {
            actionStepName = '';
        }

        try {
            const jsonData = SopSimulatorJsonManager.makeRequestSOPHistories(beginTime, endTime, subDisasterCategoryID, actionStepName, accessedUserName, campusID);

            const res = await fetch(ProjectResource.baseUrl + 'SOP/History/RequestSopHistories', {
                method: 'post',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                },
                body: jsonData
            });

            if (res.ok) {
                const result = await res.json();

                if (result.success) {
                    return [result.sopHistoryDatas, result.message];
                }
                else {
                    return [null, result.message];
                }
            }
        } catch (e) {
            console.log(e);
        }

        return [null, "requestSOPHistories 실패"];
    }

    static async requestComponentHistories(actionStepHistoryID, campusID) {
        try {
            const jsonData = SopSimulatorJsonManager.makeRequestComponentHistories(actionStepHistoryID, campusID);

            const res = await fetch(ProjectResource.baseUrl + '/SOP/History/RequestSopComponentHistories', {
                method: 'post',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                },
                body: jsonData
            });

            if (res.ok) {
                const result = await res.json();

                if (result.success) {
                    return [result.sopComponentHistoryDatas, ""];
                }
                else {
                    return [null, result.message];
                }
            }
        }
        catch (e) {
            console.log(e);
        }

        return [null, "requestComponentHistories 실패"];
    }
}