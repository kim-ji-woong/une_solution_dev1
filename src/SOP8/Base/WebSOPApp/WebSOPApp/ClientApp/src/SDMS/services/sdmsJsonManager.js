export class SdmsJsonManager {   
    static makeRequestBuildingGroupList(siteData) {
        let siteNos = null;
        if (siteData?.length > 0) {
            siteNos = siteData;
        }

        const json = {
            "requestBuildingGroupList": {
                "siteNos": siteNos
            }
        };  

        return JSON.stringify(json);
    }

    static makeRequestOuterDatas(siteNos) {
        const json = {
            "requestOuterDatas":
            {
                "siteNos": siteNos
            }
        };

        return JSON.stringify(json);
    }

    static makeRequestIndoorDatas(siteNos) {
        const json = {
            "siteNos": siteNos
        };

        return JSON.stringify(json);
    }

    static makeRequestGltfModelList(userNo, siteNos) {
        const json = {
            "userNo": userNo,
            "siteNos": siteNos
        };

        return JSON.stringify(json);
    }

    static makeRequestSaveViewport(userNo, modelName, camera, controls, zoneNo) {
        const json = {
            "userNo": userNo,
            "modelName": modelName,
            "cameraPositionX": camera.position.x,
            "cameraPositionY": camera.position.y,
            "cameraPositionZ": camera.position.z,
            "cameraRotationX": camera.rotation.x,
            "cameraRotationY": camera.rotation.y,
            "cameraRotationZ": camera.rotation.z,
            "orbitTargetX": controls.target.x,
            "orbitTargetY": controls.target.y,
            "orbitTargetZ": controls.target.z,
            "zoneNo": zoneNo
        };

        return JSON.stringify(json);
    }

    static makeRequestMoveBuildingNameText(buildingGroupName, buildingName, x, y, z) {
        const json = {
            "requestMoveBuildingNameText":
            {
                "buildingGroupName": buildingGroupName,
                "buildingName": buildingName,
                "x": x,
                "y": y,
                "z": z
            }
        };

        return JSON.stringify(json);
    }

    static makeRequestMoveEquipZoneNameText(equipZoneID, equipZoneName, x, y, z) {
        const json = {
            "requestMoveEquipZoneNameText":
            {
                "equipZoneID": equipZoneID,
                "displayText": equipZoneName,
                "x": x,
                "y": y,
                "z": z
            }
        };

        return JSON.stringify(json);
    }

    static makeRequestSensorList(sensorTypes, siteNos, enabled, searchText, pageIndex, pageItemCount) {
        const json = {
            "sensorTypes": sensorTypes,
            "siteNos": siteNos,
            "enabled": enabled,
            "searchText": searchText,
            "pageIndex": pageIndex,
            "pageItemCount": pageItemCount
        };

        return JSON.stringify(json);
    }

    static makeRequestSensor(sensorType, sensorID, x, z) {
        const json = {
            "requestMoveSensor":
            {
                "SensorType": sensorType,
                "SensorID": sensorID,
                "x": x,
                "z": z
            }
        };

        return JSON.stringify(json);
    }

    static makeRequestMalfunction(sensorType, sensorZoneID, accessedUserID, isMalfunction) {
        const json = {
            "requestMalfunction":
            {
                "sensorType": sensorType,
                "sensorZoneID": sensorZoneID,
                "accessedUserID": accessedUserID,
                "isMalfunction": isMalfunction
            }
        };

        return JSON.stringify(json);
    }

    static makeRequestSituationNotice(sensorType, sensorZoneID) {
        const json = {
            "requestSituationNotice":
            {
                "sensorType": sensorType,
                "sensorZoneID": sensorZoneID
            }
        };

        return JSON.stringify(json);
    }

    static makeRequestClearManualReport(sensorType, sensorZoneID, sensorZoneHistoryID, accessedUserID) {
        const json = {
            "requestClearManualReport":
            {
                "sensorType": sensorType,
                "sensorZoneID": sensorZoneID,
                "sensorZoneHistoryID": sensorZoneHistoryID,
                "accessedUserID": accessedUserID
            }
        };

        return JSON.stringify(json);
    }

    static makeRequestEquipZoneCCTV(EquipZoneID) {
        const json = {
            "requestEquipZoneCCTV":
            {
                "equipZoneID": EquipZoneID
            }
        };

        return JSON.stringify(json);
    }

    static makeRequestEquipZoneCCTVListFromSensor(sensorType, sensorID) {
        const json = {
            "requestEquipZoneCCTVFromSensor":
            {
                "sensorType": sensorType,
                "sensorID": sensorID
            }
        };

        return JSON.stringify(json);
    }

    static makeRequestEquipZoneSensorList(sensorType, sensorID) {
        const json = {
            "requestEquipZoneSensorList":
            {
                "sensorType": sensorType,
                "sensorID": sensorID
            }
        };

        return JSON.stringify(json);
    }

    static makeRequestUpdateEquipZoneCCTVs(equipZoneCCTVs) {
        const datas = [];

        for (const equipZoneID in equipZoneCCTVs) {
            const cctvList = equipZoneCCTVs[equipZoneID];
            const cctvCount = cctvList.length;

            datas.push({
                "equipZoneID": equipZoneID,
                "cctV1": cctvCount > 0 ? cctvList[0] : null,
                "cctV2": cctvCount > 1 ? cctvList[1] : null,
                "cctV3": cctvCount > 2 ? cctvList[2] : null,
                "cctV4": cctvCount > 3 ? cctvList[3] : null,
                "cctV5": cctvCount > 4 ? cctvList[4] : null,
                "cctV6": cctvCount > 5 ? cctvList[5] : null
            });
        }

        const json = {
            "requestUpdateEquipZoneCCTVs":
            {
                "equipZoneCCTVs": datas
            }
        };

        return JSON.stringify(json);
    }

    static makeRequestGetOrgSensorID(sensorZoneID) {
        const json = {
            "requestGetOrgSensorID":
            {
                "SensorZoneID": sensorZoneID
            }
        };

        return JSON.stringify(json);
    }

    static makeRequestSensorCount(selectSiteNo) {
        const json = {
            "requestSensorCount": 
            {
                "site_sn": selectSiteNo
            }
        };

        return JSON.stringify(json);
    }

    static makeRequestStreamServerURL() {
        const json = {
            "requestStreamServerURL": true
        };

        return JSON.stringify(json);
    }

    static makeRequestFacilityTypes() {
        const json = {
            "requestFacilityTypes": true
        };

        return JSON.stringify(json);
    }

    static makeRequestFacilityType(FacilityTypeID) {
        const json = {
            "requestFacilityType":
            {
                "facilityTypeID": FacilityTypeID
            }
        };

        return JSON.stringify(json);
    }

    // 옵션 요청
    static makeRequestGetOption(UserID, Category) {
        const json = {
            "requestOption":
            {
                "userID": UserID,
                "category": Category

            }
        }
        return JSON.stringify(json);
    }

    static makeRequestSaveOption(ID, UserID, Category, SubCategory, PropertyValue1, PropertyValue2, PropertyValue3, PropertyValue4) {
        const json = {
            "requestSaveOption":
            {
                'saveOption': {
                    "id": ID,
                    "userID": UserID,
                    "category": Category,
                    "subCategory": SubCategory,
                    "propertyValue1": PropertyValue1,
                    "propertyValue2": PropertyValue2,
                    "propertyValue3": PropertyValue3,
                    "propertyValue4": PropertyValue4,
                }
            }
        }
        return JSON.stringify(json);
    }

    static makeRequestUpdatePOIPosition(userID, sensorType, zoneID, sensorID, x, y, z) {
        const json = {
            "requestUpdatePOIPosition":
            {
                "userID": userID,
                "sensorType": sensorType,
                "zoneID": zoneID,
                "sensorID": sensorID,
                "position":
                {
                    x: x,
                    y: y,
                    z: z
                }
            }
        };

        return JSON.stringify(json);
    }

    static makeRequestUpdatePOIPositions(userID, sensorPositions) {
        const positions = [];
        const dataCount = sensorPositions.length;

        for (let i = 0; i < dataCount; i++) {
            const sensorData = sensorPositions[i];

            positions.push({
                "userID": userID,
                "sensorType": sensorData.sensorType,
                "zoneID": sensorData.zoneID,
                "sensorID": sensorData.sensorID,
                "position":
                {
                    x: sensorData.x,
                    y: sensorData.y,
                    z: sensorData.z
                },
                "text": sensorData.text
            });
        }

        const json = {
            "requestUpdatePOIPositions":
            {
                "datas": positions
            }
        };

        return JSON.stringify(json);
    }

    static makeRequestUpdateCCTVs(userID, datas) {
        const updateDatas = [];
        const dataCount = datas.length;

        for (let i = 0; i < dataCount; i++) {
            const [cctvID, zoneID, x, y, z] = datas[i];

            updateDatas.push({
                id: cctvID,
                zoneID: zoneID,
                x: x,
                y: y,
                z: z
            });
        }

        const json = {
            "requestUpdateCCTVs":
            {
                "userID": userID,
                "updateCCTVs": updateDatas
            }
        };

        return JSON.stringify(json);
    }

    static makeRequestFacilityInfoData(modelName) {
        const json = {
            "requestFacilityInfoData":
            {
                "modelName": modelName
            }
        };

        return JSON.stringify(json);
    }

    static makeRequestAllFacilityInfo() {        
        const json = {
            "requestAllFacilityInfo": true
        };

        return JSON.stringify(json);
    }

    static makeRequestBuildingData(buildingName) {
        const json = {
            "requestBuildingData":
            {
                "buildingName": buildingName
            }
        };

        return JSON.stringify(json);
    }

    static makeRequestBuildingGroupData(buildingGroupID) {
        const json = {
            "requestBuildingGroupData":
            {
                "buildingGroupID": buildingGroupID
            }
        };

        return JSON.stringify(json);
    }

    static makeRequestSaveOrthoViewport(userNo, modelName, orthoCamera, controls, zoneNo) {
        const json = {
            "userNo": userNo,
            "modelName": modelName,
            "cameraPositionX": orthoCamera.position.x,
            "cameraPositionY": orthoCamera.position.y,
            "cameraPositionZ": orthoCamera.position.z,
            "cameraRotationX": orthoCamera.rotation.x,
            "cameraRotationY": orthoCamera.rotation.y,
            "cameraRotationZ": orthoCamera.rotation.z,
            "targetX": orthoCamera.position.x,
            "targetY": controls.target.y,
            "targetZ": orthoCamera.position.z,
            "zoneNo": zoneNo,
            "zoom": orthoCamera.zoom
        };

        return JSON.stringify(json);
    }

    static makeRequestWeatherInfo() {
        const json = {
            "requestWeatherInfo": true
        };

        return JSON.stringify(json);
    }

    static makeRequestFakeWalls(zoneID) {
        const json = {
            "requestFakeWalls":
            {
                "zoneID": zoneID
            }
        };

        return JSON.stringify(json);
    }

    static makeRequestUpdateFakeWall(userID, fakeWall, id, zoneID, mode) {
        const json = {
            "requestUpdateFakeWall":
            {
                "userID": userID,
                "fakeWallID": id,
                "zoneID": zoneID,
                "x": fakeWall.position.x,
                "y": fakeWall.position.y,
                "z": fakeWall.position.z,
                "rotate": fakeWall.rotation.y,
                "scale": fakeWall.scale.x,
                "mode": mode
            }
        };

        return JSON.stringify(json);
    }

    static makeRequestUpdateFakeWalls(userID, fakeWallDatas) {
        const datas = [];
        const dataCount = fakeWallDatas.length;

        for (let i = 0; i < dataCount; i++) {
            const fakeWallData = fakeWallDatas[i];
            const fakeWall = fakeWallData.fakeWall;

            datas.push({
                "userID": userID,
                "fakeWallID": fakeWallData.id,
                "zoneID": fakeWallData.zoneID,
                "x": fakeWall.position.x,
                "y": fakeWall.position.y,
                "z": fakeWall.position.z,
                "rotate": fakeWall.rotation.y,
                "scale": fakeWall.scale.x,
                "mode": fakeWallData.mode
            });
        }

        const json = {
            "requestUpdateFakeWalls":
            {
                "updateDatas": datas
            }
        };

        return JSON.stringify(json);
    }

    static makeRequestNewCCTVList() {
        const json = {
            "requestNewCCTVList": true
        };

        return JSON.stringify(json);
    }

    static makeRequestAlarm(siteNo, sensorType, beginDate, endDate) {
        const json = {
            "siteNo": siteNo,
            "sensorType": sensorType,
            "beginDate": beginDate,
            "endDate": endDate
        };

        return JSON.stringify(json);
    }

    static makeRequestTodayAlarmData(siteNo, sensorType) {
        const json = {
            "siteNo": siteNo,
            "sensorType": sensorType
        };

        return JSON.stringify(json);
    }

    static makeRequestAlarmMemo(sensorZoneHistoryNo) {
        const json = {
            "sensorZoneHistoryNo": sensorZoneHistoryNo
        };

        return JSON.stringify(json);
    }

    static makeSaveAlarmMemo(sensorZoneHistoryNo, memo) {
        const json = {
            "sensorZoneHistoryNo": sensorZoneHistoryNo,
            "memo": memo
        };

        return JSON.stringify(json);
    }

    static makeClearAlarm(sensorZoneHistoryNo, isMalfunction, userNo, memo, timeStamp) {
        const json = {
            "sensorZoneHistoryNo": sensorZoneHistoryNo,
            "isMalfunction": isMalfunction,
            "userNo": userNo,
            "memo": memo,
            "timeStamp": timeStamp
        };

        return JSON.stringify(json);
    }

    static makeClearAllAlarm(userNo, siteNo, sensorType, sensorSubType, timeStamp) {
        const json = {
            "userNo": userNo,
            "siteNo": siteNo,
            "sensorType": sensorType,
            "sensorSubType": sensorSubType,
            "timeStamp": timeStamp
        };

        return JSON.stringify(json);
    }

    static makeRunAlarmSop(sensorZoneHistoryNo, userNo) {
        const json = {
            "sensorZoneHistoryNo": sensorZoneHistoryNo,
            "userNo": userNo
        };

        return JSON.stringify(json);
    }

    static makeRequestGetSiteNo() {
        const json = {
            "requestGetSiteNo": true
        };

        return JSON.stringify(json);
    }

    static makeRequestMaterials() {
        const json = {
            "requestMaterials": true
        };

        return JSON.stringify(json);
    }

    static makeRequestRangeSensors() {
        const json = {
            "requestRangeSensors": true
        };

        return JSON.stringify(json);
    }

    static makeRequestImagePath(zoneID) {
        const json = {
            "requestImagePath": {
                "ZoneID": zoneID
            }
        }

        return JSON.stringify(json);
    }

    static makeRequestWorkerInfos() {
        const json = {
            "requestWorkerInfos": true
        };

        return JSON.stringify(json);
    }

    static makeRequestUpdateEquipZoneAreas(userID, equipZoneAreaDatas) {
        const datas = [];
        const dataCount = equipZoneAreaDatas.length;

        for (let i = 0; i < dataCount; i++) {
            const equipZoneAreaData = equipZoneAreaDatas[i];

            datas.push({
                "userID": userID,
                "zoneID": equipZoneAreaData.zoneID,
                "equipZoneID": equipZoneAreaData.equipZoneID,
                "lines": equipZoneAreaData.lines,
                "mode": equipZoneAreaData.mode
            });
        }

        const json = {
            "requestUpdateEquipZoneAreas":
            {
                "updateDatas": datas
            }
        };

        return JSON.stringify(json);
    }

    static makeRequestEquipZoneAreas(zoneID) {
        const json = {
            "requestEquipZoneAreas":
            {
                "zoneID": zoneID
            }
        };

        return JSON.stringify(json);
    }

    static makeRequestUpdateSensorEquipZones(userID, sensorEquipZoneDatas) {
        const datas = [];
        const dataCount = sensorEquipZoneDatas.length;

        for (let i = 0; i < dataCount; i++) {
            const data = sensorEquipZoneDatas[i];

            datas.push({
                "userID": userID,
                "sensorType": data.sensorType,
                "sensorID": data.sensorID,
                "equipZoneID": data.equipZoneID,
                "zoneID": data.zoneID
            });
        }

        const json = {
            "requestUpdateSensorEquipZones":
            {
                "updateDatas": datas
            }
        };

        return JSON.stringify(json);
    }

    static makeRequestYearStatus() {
        const json = {
            "requestYearStatus": true
        };

        return JSON.stringify(json);
    }

    static makeUpdateSensorDatas(userNo, updateDatas) {
        const json = {
            "userNo": userNo,
            "updateDatas": updateDatas
        };

        return JSON.stringify(json);
    }

    static makeRequestZoneInfo(siteNo, zoneNo) {
        const json = {
            "siteNo": siteNo,
            "zoneNo": zoneNo
        };

        return JSON.stringify(json);
    }

    static makeNotifyAlarm(sensorZoneHistoryNo, userNo, timeStamp) {
        const json = {
            "sensorZoneHistoryNo": sensorZoneHistoryNo,
            "userNo": userNo,
            "timeStamp": timeStamp
        };

        return JSON.stringify(json);
    }

    static makeRequestManualReport(sensorType, zoneNo, userNo, sensorSubType, alarmDepth, reportPerson, memo, timeStamp) {
        const json = {
            "sensorType": sensorType,
            "zoneNo": zoneNo,
            "userNo": userNo,
            "sensorSubType": sensorSubType,
            "alarmDepth": alarmDepth,
            "reportPerson": reportPerson,
            "memo": memo,
            "timeStamp": timeStamp
        };

        return JSON.stringify(json);
    }
}