export default class JsonManager{    
    static makeRequestUserHistories(beginTime, endTime, site_sn) {
        const json = {
            "requestUserHistories":
            {
                "BeginTime": beginTime,
                "EndTime": endTime,
                "site_sn": site_sn
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

    static makeRequestSOPHistories(beginTime, endTime, site_sn) {
        const json = {
            "requestSOPHistories":
            {
                "BeginTime": beginTime,
                "EndTime": endTime,
                "site_sn": site_sn
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

    static makeRequestDisasterCategories(site_sn) {
        const json = {
            "requestDisasterCategories":
            {
                "site_sn": site_sn
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

    static makeRequestAssessmentHistories(beginTime, endTime, buildingGroupID, buildingID, zoneID, score, evaluator, site_sn, equipZoneID) {
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
                "site_sn": site_sn,
                "EquipZoneID": equipZoneID
            }
        };

        return JSON.stringify(json);
    }

    static makeRequestAssessmentDetail(assessmentID, site_sn) {
        const json = {
            "RequestAssessmentDetail":
            {
                "AssessmentID": assessmentID,
                "site_sn": site_sn
            }
        };

        return JSON.stringify(json);
    }

    static makeRequestLoadAssessmentClass(site_sn) {
        const json = {
            "RequestLoadAssessmentClass":
            {
                "site_sn": site_sn
            }
        };

        return JSON.stringify(json);
    }

    static makeRequestSOPHistory(beginYear, beginMonth, beginDay, endYear, endMonth, endDay, siteNo, disasterCategoryName, actionStepName, userName, pageRowCount, pageNo) {
        const json = {
            "beginYear": beginYear,
            "beginMonth": beginMonth,
            "beginDay": beginDay,
            "endYear": endYear,
            "endMonth": endMonth,
            "endDay": endDay,
            "siteNo": siteNo,
            "disasterCategoryName": disasterCategoryName,
            "actionStepName": actionStepName,
            "userName": userName,
            "pageRowCount": pageRowCount,
            "pageNo": pageNo
        };

        return JSON.stringify(json);
    }

    static makeRequestSOPComponentHistory(actionStepHistoryNo) {
        const json = {
            "actionStepHistoryNo": actionStepHistoryNo
        };

        return JSON.stringify(json);
    }

    static makeDownloadPartialSOPHistory(beginYear, beginMonth, beginDay, endYear, endMonth, endDay, disasterCategoryName, actionStepName, actionStepHistoryNoList) {
        const json = {
            "beginYear": beginYear,
            "beginMonth": beginMonth,
            "beginDay": beginDay,
            "endYear": endYear,
            "endMonth": endMonth,
            "endDay": endDay,
            "disasterCategoryName": disasterCategoryName,
            "actionStepName": actionStepName,
            "actionStepHistoryNos": actionStepHistoryNoList
        };

        return JSON.stringify(json);
    }

    static makeDownloadAllSOPHistory(beginYear, beginMonth, beginDay, endYear, endMonth, endDay, siteNo, disasterCategoryName, actionStepName, userName) {
        const json = {
            "beginYear": beginYear,
            "beginMonth": beginMonth,
            "beginDay": beginDay,
            "endYear": endYear,
            "endMonth": endMonth,
            "endDay": endDay,
            "siteNo": siteNo,
            "disasterCategoryName": disasterCategoryName,
            "actionStepName": actionStepName,
            "userName": userName
        };

        return JSON.stringify(json);
    }

    static makeDownloadPartialSensorDetectHistory(histories, beginYear, beginMonth, beginDay, endYear, endMonth, endDay, sensorTypeDatas, sensorType, sensorSubTypes, buildingGroupNo, buildingNo, zoneNo, sensorNo, useSensorTypeName, useSensorName, useLocationName, useDetectStatus, useClearType, useAlarmDepthName, useSopName, useMemo) {
        const json = {
            "histories": histories,
            "beginYear": beginYear,
            "beginMonth": beginMonth,
            "beginDay": beginDay,
            "endYear": endYear,
            "endMonth": endMonth,
            "endDay": endDay,
            "sensorTypeDatas": sensorTypeDatas,
            "sensorType": sensorType,
            "sensorSubTypes": sensorSubTypes,
            "buildingGroupNo": buildingGroupNo,
            "buildingNo": buildingNo,
            "zoneNo": zoneNo,
            "sensorNo": sensorNo,
            "useSensorTypeName": useSensorTypeName,
            "useSensorName": useSensorName,
            "useLocationName": useLocationName,
            "useDetectStatus": useDetectStatus,
            "useClearType": useClearType,
            "useAlarmDepthName": useAlarmDepthName,
            "useSopName": useSopName,
            "useMemo": useMemo
        };

        return JSON.stringify(json);
    }

    static makeDownloadAllSensorDetectHistory(beginYear, beginMonth, beginDay, endYear, endMonth, endDay, sensorTypeDatas, sensorType, sensorSubTypes, buildingGroupNo, buildingNo, zoneNo, sensorNo, siteNo, useSensorTypeName, useSensorName, useLocationName, useDetectStatus, useClearType, useAlarmDepthName, useSopName, useMemo) {
        const json = {
            "beginYear": beginYear,
            "beginMonth": beginMonth,
            "beginDay": beginDay,
            "endYear": endYear,
            "endMonth": endMonth,
            "endDay": endDay,
            "sensorTypeDatas": sensorTypeDatas,
            "sensorType": sensorType,
            "sensorSubTypes": sensorSubTypes,
            "buildingGroupNo": buildingGroupNo,
            "buildingNo": buildingNo,
            "zoneNo": zoneNo,
            "sensorNo": sensorNo,
            "siteNo": siteNo,
            "useSensorTypeName": useSensorTypeName,
            "useSensorName": useSensorName,
            "useLocationName": useLocationName,
            "useDetectStatus": useDetectStatus,
            "useClearType": useClearType,
            "useAlarmDepthName": useAlarmDepthName,
            "useSopName": useSopName,
            "useMemo": useMemo
        };

        return JSON.stringify(json);
    }

    static makeDownloadPartialSensorAnalysisHistory(histories, beginYear, beginMonth, beginDay, endYear, endMonth, endDay, sensorTypeDatas, sensorType, sensorSubTypes, buildingGroupNo, buildingNo, zoneNo, sensorNo, useSensorTypeName, useSensorName, useLocationName, useDetectCount, useMalfunctionCount, useSensorClearCount, useUserResetCount, useMalfunctionRatio) {
        const json = {
            "histories": histories,
            "beginYear": beginYear,
            "beginMonth": beginMonth,
            "beginDay": beginDay,
            "endYear": endYear,
            "endMonth": endMonth,
            "endDay": endDay,
            "sensorTypeDatas": sensorTypeDatas,
            "sensorType": sensorType,
            "sensorSubTypes": sensorSubTypes,
            "buildingGroupNo": buildingGroupNo,
            "buildingNo": buildingNo,
            "zoneNo": zoneNo,
            "sensorNo": sensorNo,
            "useSensorTypeName": useSensorTypeName,
            "useSensorName": useSensorName,
            "useLocationName": useLocationName,
            "useDetectCount": useDetectCount,
            "useMalfunctionCount": useMalfunctionCount,
            "useSensorClearCount": useSensorClearCount,
            "useUserResetCount": useUserResetCount,
            "useMalfunctionRatio": useMalfunctionRatio
        };

        return JSON.stringify(json);
    }

    static makeDownloadAllSensorAnalysisHistory(beginYear, beginMonth, beginDay, endYear, endMonth, endDay, sensorTypeDatas, sensorType, sensorSubTypes, buildingGroupNo, buildingNo, zoneNo, sensorNo, siteNo, useSensorTypeName, useSensorName, useLocationName, useDetectCount, useMalfunctionCount, useSensorClearCount, useUserResetCount, useMalfunctionRatio) {
        const json = {
            "beginYear": beginYear,
            "beginMonth": beginMonth,
            "beginDay": beginDay,
            "endYear": endYear,
            "endMonth": endMonth,
            "endDay": endDay,
            "sensorTypeDatas": sensorTypeDatas,
            "sensorType": sensorType,
            "sensorSubTypes": sensorSubTypes,
            "buildingGroupNo": buildingGroupNo,
            "buildingNo": buildingNo,
            "zoneNo": zoneNo,
            "sensorNo": sensorNo,
            "siteNo": siteNo,
            "useSensorTypeName": useSensorTypeName,
            "useSensorName": useSensorName,
            "useLocationName": useLocationName,
            "useDetectCount": useDetectCount,
            "useMalfunctionCount": useMalfunctionCount,
            "useSensorClearCount": useSensorClearCount,
            "useUserResetCount": useUserResetCount,
            "useMalfunctionRatio": useMalfunctionRatio
        };

        return JSON.stringify(json);
    }

    static makeRequestSensorDetectHistory(beginYear, beginMonth, beginDay, endYear, endMonth, endDay, pageRowCount, pageNo, sensorTypeDatas, buildingGroupNo, buildingNo, zoneNo, sensorNo, sensorType, sensorSubTypes, siteNo, useSensorTypeName, useSensorName, useLocationName, useDetectStatus, useClearType, useAlarmDepthName, useSopName, useMemo) {
        const json = {
            "beginYear": beginYear,
            "beginMonth": beginMonth,
            "beginDay": beginDay,
            "endYear": endYear,
            "endMonth": endMonth,
            "endDay": endDay,
            "pageRowCount": pageRowCount,
            "pageNo": pageNo,
            "sensorTypeDatas": sensorTypeDatas,
            "buildingGroupNo": buildingGroupNo,
            "buildingNo": buildingNo,
            "zoneNo": zoneNo,
            "sensorNo": sensorNo,
            "sensorType": sensorType,
            "sensorSubTypes": sensorSubTypes,
            "siteNo": siteNo,
            "useSensorTypeName": useSensorTypeName,
            "useSensorName": useSensorName,
            "useLocationName": useLocationName,
            "useDetectStatus": useDetectStatus,
            "useClearType": useClearType,
            "useAlarmDepthName": useAlarmDepthName,
            "useSopName": useSopName,
            "useMemo": useMemo
        };

        return JSON.stringify(json);
    }

    static makeRequestSensorAnalysisHistory(beginYear, beginMonth, beginDay, endYear, endMonth, endDay, pageRowCount, pageNo, sensorTypeDatas, buildingGroupNo, buildingNo, zoneNo, sensorNo, sensorType, sensorSubTypes, siteNo, useSensorTypeName, useSensorName, useLocationName, useDetectCount, useMalfunctionCount, useSensorClearCount, useUserResetCount, useMalfunctionRatio) {
        const json = {
            "beginYear": beginYear,
            "beginMonth": beginMonth,
            "beginDay": beginDay,
            "endYear": endYear,
            "endMonth": endMonth,
            "endDay": endDay,
            "pageRowCount": pageRowCount,
            "pageNo": pageNo,
            "sensorTypeDatas": sensorTypeDatas,
            "buildingGroupNo": buildingGroupNo,
            "buildingNo": buildingNo,
            "zoneNo": zoneNo,
            "sensorNo": sensorNo,
            "sensorType": sensorType,
            "sensorSubTypes": sensorSubTypes,
            "siteNo": siteNo,
            "useSensorTypeName": useSensorTypeName,
            "useSensorName": useSensorName,
            "useLocationName": useLocationName,
            "useDetectCount": useDetectCount,
            "useMalfunctionCount": useMalfunctionCount,
            "useSensorClearCount": useSensorClearCount,
            "useUserResetCount": useUserResetCount,
            "useMalfunctionRatio": useMalfunctionRatio
        };

        return JSON.stringify(json);
    }

    static makeRequestPatrolHistory(beginYear, beginMonth, beginDay, endYear, endMonth, endDay, pageRowCount, pageNo, courseName, workerName) {
        const json = {
            "beginYear": beginYear,
            "beginMonth": beginMonth,
            "beginDay": beginDay,
            "endYear": endYear,
            "endMonth": endMonth,
            "endDay": endDay,
            "pageRowCount": pageRowCount,
            "pageNo": pageNo,
            "courseName": courseName,
            "workerName": workerName,
        };

        return JSON.stringify(json);
    }

    static makeDownloadExcelPartialPatrolHistory(histories) {
        const json = {
            "histories": histories,
        };

        return JSON.stringify(json);
    }

    static makeDownloadExcelAllPatrolHistory(beginYear, beginMonth, beginDay, endYear, endMonth, endDay, courseName, workerName) {
        const json = {
            "beginYear": beginYear,
            "beginMonth": beginMonth,
            "beginDay": beginDay,
            "endYear": endYear,
            "endMonth": endMonth,
            "endDay": endDay,
            "courseName": courseName,
            "workerName": workerName,
        };

        return JSON.stringify(json);
    }

    static makeRequestComingHistories(beginYear, beginMonth, beginDay, endYear, endMonth, endDay, pageRowCount, pageNo, isVisitor, doorNo, personName, isImportArea) {
        const json = {
            "beginYear": beginYear,
            "beginMonth": beginMonth,
            "beginDay": beginDay,
            "endYear": endYear,
            "endMonth": endMonth,
            "endDay": endDay,
            "pageRowCount": pageRowCount,
            "pageNo": pageNo,
            "isVisitor": isVisitor,
            "doorNo": doorNo,
            "personName": personName,
            "isImportArea": isImportArea
        };

        return JSON.stringify(json);
    }

    static makeRequestExcelAllComingHistory(beginYear, beginMonth, beginDay, endYear, endMonth, endDay, isVisitor, doorNo, personName, isImportArea) {
        const json = {
            "beginYear": beginYear,
            "beginMonth": beginMonth,
            "beginDay": beginDay,
            "endYear": endYear,
            "endMonth": endMonth,
            "endDay": endDay,
            "isVisitor": isVisitor,
            "doorNo": doorNo,
            "personName": personName,
            "isImportArea": isImportArea,
        };

        return JSON.stringify(json);
    }

    static makeRequestExcelPartialComingHistory(histories) {
        const json = {
            "histories": histories,
        };

        return JSON.stringify(json);
    }

    static makeRequestParkingHistory(beginYear, beginMonth, beginDay, endYear, endMonth, endDay, pageRowCount, pageNo, cmmtktYn, parkngNo) {
        const json = {
            "beginYear": beginYear,
            "beginMonth": beginMonth,
            "beginDay": beginDay,
            "endYear": endYear,
            "endMonth": endMonth,
            "endDay": endDay,
            "pageRowCount": pageRowCount,
            "pageNo": pageNo,
            "cmmtktYn": cmmtktYn,
            "parkngNo": parkngNo
        };

        return JSON.stringify(json);
    }

    static makeRequestExcelAllParkingHistory(beginYear, beginMonth, beginDay, endYear, endMonth, endDay, cmmtktYn, parkngNo) {
        const json = {
            "beginYear": beginYear,
            "beginMonth": beginMonth,
            "beginDay": beginDay,
            "endYear": endYear,
            "endMonth": endMonth,
            "endDay": endDay,
            "cmmtktYn": cmmtktYn,
            "parkngNo": parkngNo
        };

        return JSON.stringify(json);
    }

    static makeRequestExcelPartialParkingHistory(histories) {
        const json = {
            "histories": histories,
        };

        return JSON.stringify(json);
    }
}