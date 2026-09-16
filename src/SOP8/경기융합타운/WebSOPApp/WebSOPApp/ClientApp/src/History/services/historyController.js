import JsonManager from "./jsonManager";

export default class HistoryController {
    static async DisplayUserHistories(beginTime, endTime, siteNo) {
        try {
            const jsonData = JsonManager.makeRequestUserHistories(beginTime, endTime, siteNo);

            const res = await fetch('History/History/RequestData', {
                method: 'post',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                },
                body: jsonData
            });

            if (res.ok) {
                const result = await res.json();
                return result.userHistoryDatas;
            }
        } catch (e) {
            console.log(e);
        }
    }

    static async GetMinMaxIndex(beginTime, endTime, facilityType, buildingGroupID, buildingID, zoneID) {
        try {
            const jsonData = JsonManager.makeRequestGetMinMaxIndex(beginTime, endTime, facilityType, buildingGroupID, buildingID, zoneID);

            const res = await fetch('History/History/RequestData', {
                method: 'post',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                },
                body: jsonData
            });

            if (res.ok) {
                const result = await res.json();
                const minID = result.minReactionHistoryID;
                const maxID = result.maxReactionHistoryID;

                return [minID, maxID];
            }
        } catch (e) {
            console.log(e);
        }
    }

    static async DisplaySensorDetectHistories(beginTime, endTime, facilityType, buildingGroupID, buildingID, zoneID, lastSensorZoneHistoryID, rowCount, isDesc, siteNo) {
        try {
            const jsonData = JsonManager.makeRequestSensorDetectHistories(beginTime, endTime, facilityType, buildingGroupID, buildingID, zoneID, lastSensorZoneHistoryID, rowCount, isDesc, siteNo);

            const res = await fetch('History/History/RequestData', {
                method: 'post',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                },
                body: jsonData
            });

            if (res.ok) {
                const result = await res.json();
                return [result.sensorDetectHistoryDatas, result.lastSensorReactionHistoryID];
            }
        } catch (e) {
            console.log(e);
            return [null, null]
        }
    }

    static async DisplaySensorDetectAnalysis(beginTime, endTime, facilityType, buildingGroupID, buildingID, zoneID, siteNo) {
        try {
            const jsonData = JsonManager.makeRequestSensorDetectAnalysis(beginTime, endTime, facilityType, buildingGroupID, buildingID, zoneID, siteNo);

            const res = await fetch('History/History/RequestData', {
                method: 'post',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                },
                body: jsonData
            });

            if (res.ok) {
                const result = await res.json();
                return result;
            }
        } catch (e) {
            console.log(e);
        }
    }

    static async DisplaySOPHistories(beginTime, endTime, siteNo) {
        try {
            const jsonData = JsonManager.makeRequestSOPHistories(beginTime, endTime, siteNo);

            const res = await fetch('History/History/RequestData', {
                method: 'post',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                },
                body: jsonData
            });

            if (res.ok) {
                const result = await res.json();
                return result.sopHistoryDatas;
            }
        } catch (e) {
            console.log(e);
        }
    }

    static async DisplaySOPComponentHistories(actionStepHistoryID) {
        try {
            const jsonData = JsonManager.makeRequestSOPComponentHistories(actionStepHistoryID);

            const res = await fetch('History/History/RequestData', {
                method: 'post',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                },
                body: jsonData
            });

            if (res.ok) {
                const result = await res.json();
                return result.sopComponentHistoryDatas;
            }
        } catch (e) {
            console.log(e);
        }
    }

    static async LoadDisasterCategories(siteNo) {
        try {
            const jsonData = JsonManager.makeRequestDisasterCategories(siteNo);

            const res = await fetch('History/History/RequestData', {
                method: 'post',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                },
                body: jsonData
            });

            if (res.ok) {
                const result = await res.json();
                return result.disasterCategories;
            }
        } catch (e) {
            console.log(e);
        }
    }

    static async UpdateAlarmMemo(sensorZoneHistoryID, memo) {
        try {
            const jsonData = JsonManager.makeRequestUpdateAlarmMemo(sensorZoneHistoryID, memo);

            const res = await fetch('History/History/RequestData', {
                method: 'post',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                },
                body: jsonData
            });

            if (res.ok) {
                const result = await res.json();
                return result;
            }
        } catch (e) {
            console.log(e);
        }
    }


    static async DisplayAssessmentHistories(beginTime, endTime, buildingGroupID, buildingID, zoneID, score, evaluator, siteNo, equipZoneID = null) {
        try {
            const jsonData = JsonManager.makeRequestAssessmentHistories(beginTime, endTime, buildingGroupID, buildingID, zoneID, score, evaluator, siteNo, equipZoneID);

            const res = await fetch('History/History/RequestData', {
                method: 'post',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                },
                body: jsonData
            });

            if (res.ok) {
                const result = await res.json();
                return result.assessmentHistories;
            }
        } catch (e) {
            console.log(e);
        }
    }

    static async DisplayAssessmentDetail(assessmentID, siteNo) {
        try {
            const jsonData = JsonManager.makeRequestAssessmentDetail(assessmentID, siteNo);

            const res = await fetch('History/History/RequestData', {
                method: 'post',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                },
                body: jsonData
            });

            if (res.ok) {
                const result = await res.json();
                return [result.aList, result.memberScores];
            }
        } catch (e) {
            console.log(e);
        }
    }

    static async LoadAssessmentClass(nSiteNo) {
        try {
            const jsonData = JsonManager.makeRequestLoadAssessmentClass(nSiteNo);

            const res = await fetch('History/History/RequestData', {
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
                    return [result.assessmentClasses, null];
                }
                else {
                    return [null, result.message];
                }
            }
        } catch (e) {
            console.log("ERROR LoadAssessmentClass : " + e);
            return [false, e.message];
        }
    }
}