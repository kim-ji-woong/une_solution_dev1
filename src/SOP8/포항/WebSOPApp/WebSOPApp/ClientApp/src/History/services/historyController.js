import JsonManager from "./jsonManager";

export default class HistoryController {
    static async DisplayUserHistories(beginTime, endTime, site_sn) {
        try {
            const jsonData = JsonManager.makeRequestUserHistories(beginTime, endTime, site_sn);

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

    static async DisplaySOPHistories(beginTime, endTime, site_sn) {
        try {
            const jsonData = JsonManager.makeRequestSOPHistories(beginTime, endTime, site_sn);

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

    static async LoadDisasterCategories(site_sn) {
        try {
            const jsonData = JsonManager.makeRequestDisasterCategories(site_sn);

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


    static async DisplayAssessmentHistories(beginTime, endTime, buildingGroupID, buildingID, zoneID, score, evaluator, site_sn, equipZoneID = null) {
        try {
            const jsonData = JsonManager.makeRequestAssessmentHistories(beginTime, endTime, buildingGroupID, buildingID, zoneID, score, evaluator, site_sn, equipZoneID);

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

    static async DisplayAssessmentDetail(assessmentID, site_sn) {
        try {
            const jsonData = JsonManager.makeRequestAssessmentDetail(assessmentID, site_sn);

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

    static async LoadAssessmentClass(site_sn) {
        try {
            const jsonData = JsonManager.makeRequestLoadAssessmentClass(site_sn);

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

    //////////////////////////////////////////////////////////////////////////////////
    // disasterCategoryName : null일 경우 전체
    // actionStepName : null일 경우 전체
    // userName : null일 경우 전체
    // pageRowCount : 한 페이지에 몇 개의 행이 표시될 것인가?(null일 경우 전체)
    // pageNo : 페이지 번호
    static async requestSOPHistory(beginYear, beginMonth, beginDay, endYear, endMonth, endDay, siteNo, disasterCategoryName, actionStepName, userName, pageRowCount, pageNo = 1) {
        try {
            const jsonData = JsonManager.makeRequestSOPHistory(beginYear, beginMonth, beginDay, endYear, endMonth, endDay, siteNo, disasterCategoryName, actionStepName, userName, pageRowCount, pageNo);

            const res = await fetch('api/History/RequestSOPHistory', {
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
                    return [result.sopHistoryDatas, result.totalCount, ""];
                }
                else {
                    return [null, null, result.message];
                }
            }
        } catch (e) {
            console.log(e);
        }

        return [null, "requestSOPHistory 호출에 실패하였습니다."];
    }

    static async requestSOPComponentHistory(actionStepHistoryNo) {
        try {
            const jsonData = JsonManager.makeRequestSOPComponentHistory(actionStepHistoryNo);

            const res = await fetch('api/History/RequestSOPComponentHistory', {
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
        } catch (e) {
            console.log(e);
        }

        return [null, "requestSOPComponentHistory 호출에 실패하였습니다."];
    }

    static async downloadPartialSOPHistory(beginYear, beginMonth, beginDay, endYear, endMonth, endDay, disasterCategoryName, actionStepName, actionStepHistoryNoList) {
        try {
            const jsonData = JsonManager.makeDownloadPartialSOPHistory(beginYear, beginMonth, beginDay, endYear, endMonth, endDay, disasterCategoryName, actionStepName, actionStepHistoryNoList);

            const res = await fetch('api/History/DownloadPartialSOPHistory', {
                method: 'post',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                },
                body: jsonData
            });

            if (res.ok) {
                if (res.headers.get('content-type') === 'application/vnd.ms-excel') {
                    await HistoryController.downloadFile(res);
                    return [true, ""];
                }
                else {
                    const result = await res.json();

                    if (result.success) {
                        return [result.success, ""];
                    }
                    else {
                        return [null, result.message];
                    }
                }
            }
        } catch (e) {
            console.log(e);
        }

        return [null, "downloadPartialSOPHistory 호출에 실패하였습니다."];
    }

    // disasterCategoryName : null일 경우 전체
    // actionStepName : null일 경우 전체
    // userName : null일 경우 전체
    static async downloadAllSOPHistory(beginYear, beginMonth, beginDay, endYear, endMonth, endDay, siteNo, disasterCategoryName, actionStepName, userName) {
        try {
            const jsonData = JsonManager.makeDownloadAllSOPHistory(beginYear, beginMonth, beginDay, endYear, endMonth, endDay, siteNo, disasterCategoryName, actionStepName, userName);

            const res = await fetch('api/History/DownloadAllSOPHistory', {
                method: 'post',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                },
                body: jsonData
            });

            if (res.ok) {
                if (res.headers.get('content-type') === 'application/vnd.ms-excel') {
                    await HistoryController.downloadFile(res);
                    return [true, ""];
                }
                else {
                    const result = await res.json();

                    if (result.success) {
                        return [result.success, ""];
                    }
                    else {
                        return [null, result.message];
                    }
                }
            }
        } catch (e) {
            console.log(e);
        }

        return [null, "downloadAllSOPHistory 호출에 실패하였습니다."];
    }

    static async downloadPartialSensorDetectHistory(histories, beginYear, beginMonth, beginDay, endYear, endMonth, endDay, sensorTypeDatas = null, sensorType = null, sensorSubTypes = null, buildingGroupNo = null, buildingNo = null, zoneNo = null, sensorNo = null, useSensorTypeName = true, useSensorName = true, useLocationName = true, useDetectStatus = false, useClearType = true, useAlarmDepthName = true, useSopName = false, useMemo = false) {
        try {
            const jsonData = JsonManager.makeDownloadPartialSensorDetectHistory(histories, beginYear, beginMonth, beginDay, endYear, endMonth, endDay, sensorTypeDatas, sensorType, sensorSubTypes, buildingGroupNo, buildingNo, zoneNo, sensorNo, useSensorTypeName, useSensorName, useLocationName, useDetectStatus, useClearType, useAlarmDepthName, useSopName, useMemo);

            const res = await fetch('api/History/DownloadPartialSensorDetectHistory', {
                method: 'post',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                },
                body: jsonData
            });

            if (res.ok) {
                if (res.headers.get('content-type') === 'application/vnd.ms-excel') {
                    await HistoryController.downloadFile(res);
                    return [true, ""];
                }
                else {
                    const result = await res.json();

                    if (result.success) {
                        return [result.success, ""];
                    }
                    else {
                        return [null, result.message];
                    }
                }
            }
        } catch (e) {
            console.log(e);
        }

        return [null, "downloadPartialSensorDetectHistory 호출에 실패하였습니다."];
    }

    static async downloadAllSensorDetectHistory(beginYear, beginMonth, beginDay, endYear, endMonth, endDay, sensorTypeDatas = null, sensorType = null, sensorSubTypes = null, buildingGroupNo = null, buildingNo = null, zoneNo = null, sensorNo = null, siteNo = null, useSensorTypeName = true, useSensorName = true, useLocationName = true, useDetectStatus = false, useClearType = true, useAlarmDepthName = true, useSopName = false, useMemo = false) {
        try {
            const jsonData = JsonManager.makeDownloadAllSensorDetectHistory(beginYear, beginMonth, beginDay, endYear, endMonth, endDay, sensorTypeDatas, sensorType, sensorSubTypes, buildingGroupNo, buildingNo, zoneNo, sensorNo, siteNo, useSensorTypeName, useSensorName, useLocationName, useDetectStatus, useClearType, useAlarmDepthName, useSopName, useMemo);

            const res = await fetch('api/History/DownloadAllSensorDetectHistory', {
                method: 'post',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                },
                body: jsonData
            });

            if (res.ok) {
                if (res.headers.get('content-type') === 'application/vnd.ms-excel') {
                    await HistoryController.downloadFile(res);
                    return [true, ""];
                }
                else {
                    const result = await res.json();

                    if (result.success) {
                        return [result.success, ""];
                    }
                    else {
                        return [null, result.message];
                    }
                }
            }
        } catch (e) {
            console.log(e);
        }

        return [null, "downloadAllSensorDetectHistory 호출에 실패하였습니다."];
    }

    static async downloadPartialSensorAnalysisHistory(histories, beginYear, beginMonth, beginDay, endYear, endMonth, endDay,  sensorTypeDatas = null, sensorType = null, sensorSubTypes = null, buildingGroupNo = null, buildingNo = null, zoneNo = null, sensorNo = null, useSensorTypeName = true, useSensorName = true, useLocationName = true, useDetectCount = true, useMalfunctionCount = true, useSensorClearCount = true, useUserResetCount = true, useMalfunctionRatio = true) {
        try {
            const jsonData = JsonManager.makeDownloadPartialSensorAnalysisHistory(histories, beginYear, beginMonth, beginDay, endYear, endMonth, endDay, sensorTypeDatas, sensorType, sensorSubTypes, buildingGroupNo, buildingNo, zoneNo, sensorNo, useSensorTypeName, useSensorName, useLocationName, useDetectCount, useMalfunctionCount, useSensorClearCount, useUserResetCount, useMalfunctionRatio);

            const res = await fetch('api/History/DownloadPartialSensorAnalysisHistory', {
                method: 'post',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                },
                body: jsonData
            });

            if (res.ok) {
                if (res.headers.get('content-type') === 'application/vnd.ms-excel') {
                    await HistoryController.downloadFile(res);
                    return [true, ""];
                }
                else {
                    const result = await res.json();

                    if (result.success) {
                        return [result.success, ""];
                    }
                    else {
                        return [null, result.message];
                    }
                }
            }
        } catch (e) {
            console.log(e);
        }

        return [null, "downloadPartialSensorAnalysisHistory 호출에 실패하였습니다."];
    }

    static async downloadAllSensorAnalysisHistory(beginYear, beginMonth, beginDay, endYear, endMonth, endDay, sensorTypeDatas = null, sensorType = null, sensorSubTypes = null, buildingGroupNo = null, buildingNo = null, zoneNo = null, sensorNo = null, siteNo = null, useSensorTypeName = true, useSensorName = true, useLocationName = true, useDetectCount = true, useMalfunctionCount = true, useSensorClearCount = true, useUserResetCount = true, useMalfunctionRatio = true) {
        try {
            const jsonData = JsonManager.makeDownloadAllSensorAnalysisHistory(beginYear, beginMonth, beginDay, endYear, endMonth, endDay, sensorTypeDatas, sensorType, sensorSubTypes, buildingGroupNo, buildingNo, zoneNo, sensorNo, siteNo, useSensorTypeName, useSensorName, useLocationName, useDetectCount, useMalfunctionCount, useSensorClearCount, useUserResetCount, useMalfunctionRatio);

            const res = await fetch('api/History/DownloadAllSensorAnalysisHistory', {
                method: 'post',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                },
                body: jsonData
            });

            if (res.ok) {
                if (res.headers.get('content-type') === 'application/vnd.ms-excel') {
                    await HistoryController.downloadFile(res);
                    return [true, ""];
                }
                else {
                    const result = await res.json();

                    if (result.success) {
                        return [result.success, ""];
                    }
                    else {
                        return [null, result.message];
                    }
                }
            }
        } catch (e) {
            console.log(e);
        }

        return [null, "downloadAllSensorAnalysisHistory 호출에 실패하였습니다."];
    }

    // sensorTypeDatas : [{sensorTypeCode, sensorSubTypeNo, sensorTypeName}]
    // sample : [{"sensorTypeCode": 300300, "sensorSubTypeNo": 0, "sensorTypeName": '열'}, {"sensorTypeCode": 300300, "sensorSubTypeNo": 1, "sensorTypeName": '연기'}, {"sensorTypeCode": 300312, "sensorSubTypeNo": null, "sensorTypeName": '지진'}]

    // 포항에서 sensorTypeDatas는 null일 수 없음
    // 센서유형이 전체가 아닐 경우 sensorType, sensorSubTypes null일 수 없음
    // 위치 값이 선택되었을 경우 zoneNo가 null일 수 없음
    static async requestSensorDetectHistory(beginYear, beginMonth, beginDay, endYear, endMonth, endDay, pageRowCount, pageNo = 1, sensorTypeDatas = null, buildingGroupNo = null, buildingNo = null, zoneNo = null, sensorNo = null, sensorType = null, sensorSubTypes = null, siteNo = null, useSensorTypeName = true, useSensorName = true, useLocationName = true, useDetectStatus = false, useClearType = true, useAlarmDepthName = true, useSopName = false, useMemo = true) {
        try {
            const jsonData = JsonManager.makeRequestSensorDetectHistory(beginYear, beginMonth, beginDay, endYear, endMonth, endDay, pageRowCount, pageNo, sensorTypeDatas, buildingGroupNo, buildingNo, zoneNo, sensorNo, sensorType, sensorSubTypes, siteNo, useSensorTypeName, useSensorName, useLocationName, useDetectStatus, useClearType, useAlarmDepthName, useSopName, useMemo);

            const res = await fetch('api/History/RequestSensorDetectHistory', {
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
                    return [result.histories, result.totalCount, ""];
                }
                else {
                    return [null, null, result.message];
                }
            }
        } catch (e) {
            console.log(e);
        }

        return [null, "requestSensorDetectHistory 호출에 실패하였습니다."];
    }

    // sensorTypeDatas : [{sensorTypeCode, sensorSubTypeNo, sensorTypeName}]
    // sample : [{"sensorTypeCode": 300300, "sensorSubTypeNo": 0, "sensorTypeName": '열'}, {"sensorTypeCode": 300300, "sensorSubTypeNo": 1, "sensorTypeName": '연기'}, {"sensorTypeCode": 300312, "sensorSubTypeNo": null, "sensorTypeName": '지진'}]
    static async requestSensorAnalysisHistory(beginYear, beginMonth, beginDay, endYear, endMonth, endDay, pageRowCount, pageNo = 1, sensorTypeDatas = null, buildingGroupNo = null, buildingNo = null, zoneNo = null, sensorNo = null, sensorType = null, sensorSubTypes = null, siteNo = null, useSensorTypeName = true, useSensorName = true, useLocationName = true, useDetectCount = true, useMalfunctionCount = true, useSensorClearCount = true, useUserResetCount = true, useMalfunctionRatio = true) {
        try {
            const jsonData = JsonManager.makeRequestSensorAnalysisHistory(beginYear, beginMonth, beginDay, endYear, endMonth, endDay, pageRowCount, pageNo, sensorTypeDatas, buildingGroupNo, buildingNo, zoneNo, sensorNo, sensorType, sensorSubTypes, siteNo, useSensorTypeName, useSensorName, useLocationName, useDetectCount, useMalfunctionCount, useSensorClearCount, useUserResetCount, useMalfunctionRatio);

            const res = await fetch('api/History/RequestSensorAnalysisHistory', {
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
                    const summary = {
                        "totalDetectionCount": result.totalDetectionCount,
                        "totalMalfunctionRatio": result.totalMalfunctionRatio,
                        "mostDetectionSensorName": result.mostDetectionSensorName,
                        "mostDetectionSensorCount": result.mostDetectionSensorCount,
                        "mostDetectionLocationName": result.mostDetectionLocationName,
                        "mostDetectionLocationCount": result.mostDetectionLocationCount,
                        "mostDetectionSensorTypeName": result.mostDetectionSensorTypeName,
                        "mostDetectionSensorTypeCount": result.mostDetectionSensorTypeCount,
                        "topMalfunctionSensorName": result.topMalfunctionSensorName,
                        "topMalfunctionSensorRatio": result.topMalfunctionSensorRatio
                    }
                    return [result.histories, summary, result.totalCount, ""];
                }
                else {
                    return [null, null, null, result.message];
                }
            }
        } catch (e) {
            console.log(e);
        }
 
        return [null, "requestSensorAnalysisHistory 호출에 실패하였습니다."];
    }

    static async downloadFile(response) {
        const fileName = HistoryController.getFileName(response);

        if (fileName.length === 0) {
            return;
        }

        const blob = await response.blob();
        const newBlob = new Blob([blob]);

        const blobUrl = window.URL.createObjectURL(newBlob);

        const link = document.createElement('a');
        link.href = blobUrl;
        link.setAttribute('download', fileName);
        document.body.appendChild(link);
        link.click();
        link.parentNode.removeChild(link);

        window.URL.revokeObjectURL(blob);
    }

    static getFileName(response) {
        const result = response.headers.get('content-disposition');
        const tokens = result.split(';');

        const tokenCount = tokens.length;

        for (let i = 0; i < tokenCount; i++) {
            const token = tokens[i].trim();
            const index = token.indexOf('=');

            if (index > 0) {
                const key = token.substring(0, index).trim();
                const value = token.substring(index + 1).trim();

                if (key === 'filename*') {
                    const index2 = value.indexOf("''");

                    if (index2 >= 0) {
                        const uri = value.substring(index2 + 2).trim();
                        return decodeURI(uri);
                    }
                }
            }
        }

        return "";
    }
}