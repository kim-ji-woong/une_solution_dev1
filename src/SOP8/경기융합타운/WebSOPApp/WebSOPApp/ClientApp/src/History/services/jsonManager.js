export default class JsonManager{    
    static makeRequestUserHistories(beginTime, endTime, siteNo) {
        const json = {
            "requestUserHistories":
            {
                "BeginTime": beginTime,
                "EndTime": endTime,
                "SiteNo": siteNo
            }
        };

        return JSON.stringify(json);
    }

    static makeRequestGetMinMaxIndex(beginTime, endTime, facilityType, buildingGroupID, buildingID, zoneID) {
        const json = {
            "requestGetMinMaxIndex":
            {
                "BeginTime": beginTime,
                "EndTime": endTime,
                "FacilityType": facilityType,
                "BuildingGroupID": buildingGroupID,
                "BuildingID": buildingID,
                "ZoneID": zoneID
            }
        };

        return JSON.stringify(json);
    }

    static makeRequestSensorDetectHistories(beginTime, endTime, facilityType, buildingGroupID, buildingID, zoneID, lastSensorZoneHistoryID, rowCount, isDesc, siteNo) {
        const json = {
            "requestSensorDetectHistories":
            {
                "BeginTime": beginTime,
                "EndTime": endTime,
                "FacilityType": facilityType,
                "BuildingGroupID": buildingGroupID,
                "BuildingID": buildingID,
                "ZoneID": zoneID,
                "LastSensorZoneHistoryID": lastSensorZoneHistoryID,
                "RowCount": rowCount,
                "IsDesc": isDesc,
                "SiteNo": siteNo
            }
        };

        return JSON.stringify(json);
    }

    static makeRequestSensorDetectAnalysis(beginTime, endTime, facilityType, buildingGroupID, buildingID, zoneID, siteNo) {
        const json = {
            "requestSensorDetectAnalysis":
            {
                "BeginTime": beginTime,
                "EndTime": endTime,
                "FacilityType": facilityType,
                "BuildingGroupID": buildingGroupID,
                "BuildingID": buildingID,
                "ZoneID": zoneID,
                "SiteNo": siteNo
            }
        };

        return JSON.stringify(json);
    }

    static makeRequestSOPHistories(beginTime, endTime, siteNo) {
        const json = {
            "requestSOPHistories":
            {
                "BeginTime": beginTime,
                "EndTime": endTime,
                "SiteNo": siteNo
            }
        };

        return JSON.stringify(json);
    }

    static makeRequestSOPComponentHistories(actionStepHistoryID) {
        const json = {
            "requestSOPComponentHistories":
            {
                "ActionStepHistoryID": actionStepHistoryID
            }
        };

        return JSON.stringify(json);
    }

    static makeRequestDisasterCategories(siteNo) {
        const json = {
            "requestDisasterCategories":
            {
                "SiteNo": siteNo
            }
        };

        return JSON.stringify(json);
    }

    static makeRequestUpdateAlarmMemo(sensorZoneHistoryID, memo) {
        const json = {
            "RequestUpdateAlarmMemo":
            {
                "SensorZoneHistoryID": sensorZoneHistoryID,
                "Memo": memo
            }
        };

        return JSON.stringify(json);
    }

    static makeRequestAssessmentHistories(beginTime, endTime, buildingGroupID, buildingID, zoneID, score, evaluator, siteNo, equipZoneID) {
        const json = {
            "RequestAssessmentHistories":
            {
                "BeginTime": beginTime,
                "EndTime": endTime,
                "BuildingGroupID": buildingGroupID,
                "BuildingID": buildingID,
                "ZoneID": zoneID,
                "Score": score,
                "Evaluator": evaluator,
                "SiteNo": siteNo,
                "EquipZoneID": equipZoneID
            }
        };

        return JSON.stringify(json);
    }

    static makeRequestAssessmentDetail(assessmentID, siteNo) {
        const json = {
            "RequestAssessmentDetail":
            {
                "AssessmentID": assessmentID,
                "SiteNo": siteNo
            }
        };

        return JSON.stringify(json);
    }

    static makeRequestLoadAssessmentClass(siteNo) {
        const json = {
            "RequestLoadAssessmentClass":
            {
                "SiteNo": siteNo
            }
        };

        return JSON.stringify(json);
    }
}