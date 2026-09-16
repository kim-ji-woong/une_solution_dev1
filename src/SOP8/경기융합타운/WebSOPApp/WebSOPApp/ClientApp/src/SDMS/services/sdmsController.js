import store from '../../Root/store';
import { SdmsJsonManager } from './sdmsJsonManager';
import SessionString from '../../Common/js/sessionString';
import { SDMSDataManager } from './sdmsDataManager';
import SettingsStore from '../../Settings/settingsStore';

import ProjectResource from '../../Root/resource/id';
import AccountResource from '../../Account/resource/id';

export class SDMSController {
    static timerElevator = 0;

    // 센서 히스토리 불러오기
    static async DisplayAlarm() {
        try {
            const response = await fetch('SDMS/SDMS/DisplayAlarm', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json;charset=utf-8'
                }
            });

            if (response.ok && response.status !== 204) {
                const data = await response.json();
                return data;
            }
        } catch (e) {
            console.log(e);
        }

        return null;
    }

    // 타이머로 센서 히스토리 불러오는 함수 리턴값을 Redux에 저장
    static async WatchSensorAlarm() {
        // 센서 알람 히스토리 조회
        let result = await SDMSController.DisplayAlarm();
        result = result == null ? new Array() : result;
        if (result == null) {
            return new Array();
        }
        
        // 현재 센서 알람 히스토리 조회
        SDMSController.toCompareAlarm('SENSOR_ALARM', result);

        SDMSController.watchSensorCount();
    }

    static toCompareAlarm(type, result) {
        
        const userInfo = ProjectResource.getUserInfo();
        if (!userInfo)
            return;

        let currentAlarm = store.getState().sensorAlarm;

        let receiveAlarm = [];
        for (let i = 0; i < result?.alarmDatas?.length; i++) {
            const alarmData = result.alarmDatas[i];

            // 마스터 경우 모든 사이트 알람 체크
            // 마스터가 아닌 경우 해당 사이트 알람 체크
            if (userInfo.levelNo === AccountResource.accountLevelID.master || 
                userInfo.siteNo === alarmData.siteNo) {
                receiveAlarm.push(alarmData);
            } 
        }

        let temp = null; // 센서 비교에 사용

        currentAlarm = currentAlarm == null ? new Array() : currentAlarm;
        temp = currentAlarm.slice(); // 깊은 복사

        // 조회된 센서 알람와 표시되고 있는 센서 알람 비교 후 Redux에 저장
        if (receiveAlarm !== null && receiveAlarm !== undefined && receiveAlarm.length != currentAlarm.length) {
            // 알람 수가 같지 않을 때
            store.dispatch({ type: type, sensorAlarm: receiveAlarm, sensorAllAlarm: result.allAlarmDatas });

        } else if (receiveAlarm !== null && receiveAlarm !== undefined && receiveAlarm.length == currentAlarm.length && receiveAlarm.length != 0) {
            const receiveAlarmCount = receiveAlarm.length;
            for (let i = 0; i < receiveAlarmCount; i++) {
                // 기존 알람과 SensorZoneIDs 비교 추가 - 2023.02.15 K.D.R
                const alarmSensorZoneIDs = receiveAlarm[i].alarmSensorZoneIDs.join();

                for (let j = 0; j < temp.length; j++) {
                    const tempSensorZoneIDs = temp[j].alarmSensorZoneIDs.join();

                    // id 비교 같으면 삭제
                    if (receiveAlarm[i].dtTime == temp[j].dtTime &&
                        receiveAlarm[i].equipZoneID == temp[j].equipZoneID &&
                        receiveAlarm[i].sopStatus == temp[j].sopStatus &&
                        receiveAlarm[i].alarmDepth == temp[j].alarmDepth &&
                        receiveAlarm[i].isAlarm == temp[j].isAlarm &&
                        receiveAlarm[i].sensorZoneHistoryID == temp[j].sensorZoneHistoryID &&
                        alarmSensorZoneIDs == tempSensorZoneIDs) {
                        temp.splice(j, 1);
                        break;
                    }
                }
            }

            // currentAlarm 갯수가 남아있다면 >> 센서 알람이 동일하지 않음.
            if (temp.length != 0) {
                if (type === 'SENSOR_ALARM') {
                    store.dispatch({ type: type, sensorAlarm: receiveAlarm, sensorAllAlarm: result.allAlarmDatas });
                }
            }
        }
    }

    static async RequestTodayAlarmData() {

        try {
            const jsonData = SdmsJsonManager.makeRequestTodayAlarmData();

            const res = await fetch('SDMS/SDMS/RequestData', {
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
                    return [result.alarmDatas, ""];
                }
                else {
                    return [null, result.message];
                }
            }

        }
        catch (e) {
            //console.log(e);
        }

        return [null, "requestSaveViewport 실패"];
    }

    static async watchSensorCount() {
        try {
            // 멀티사이트 경우 선택된 사이트 조회
            let selectSiteNo = null;
            if (ProjectResource.IsMultiSite === true) {
                let tempSiteNo = SettingsStore?.getState()?.selectSiteNo;
                if (tempSiteNo > 0)
                    selectSiteNo = tempSiteNo;
            }

            const jsonData = SdmsJsonManager.makeRequestSensorCount(selectSiteNo);

            const res = await fetch('SDMS/SDMS/RequestData', {
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
                    const sensorCount = {};

                    sensorCount.fireSensorCount = result.fireSensorCount;
                    sensorCount.disabledFireSensorCount = result.disabledFireSensorCount;
                    sensorCount.psmSensorCount = result.psmSensorCount;
                    sensorCount.disabledPsmSensorCount = result.disabledPSMSensorCount;
                    sensorCount.etcSensorCount = result.etcSensorCount;
                    sensorCount.disabledEtcSensorCount = result.disabledEtcSensorCount;
                    sensorCount.cctvCount = result.cctvCount;
                    sensorCount.disabledCCTVCount = result.disabledCCTVCount;
                    sensorCount.earthquakeSensorCount = result.earthquakeSensorCount;
                    sensorCount.disabledEarthquakeSensorCount = result.disabledEarthquakeSensorCount;
                    sensorCount.strongWindSensorCount = result.strongWindSensorCount;
                    sensorCount.disabledStrongWindSensorCount = result.disabledStrongWindSensorCount;
                    sensorCount.environmentSensorCount = result.environmentSensorCount;
                    sensorCount.disabledEnvironmentSensorCount = result.disabledEnvironmentSensorCount;
                    sensorCount.emergencyBellCount = result.emergencyBellCount;
                    sensorCount.disabledEmergencyBellCount = result.disabledEmergencyBellCount;

                    let currentData = store.getState().sensorCount;

                    if (!currentData) {
                        store.dispatch({ type: 'SENSOR_COUNT', sensorCount: sensorCount });
                    }
                    else {
                        if (currentData.fireSensorCount !== sensorCount.fireSensorCount ||
                            currentData.disabledFireSensorCount !== sensorCount.disabledFireSensorCount ||
                            currentData.psmSensorCount !== sensorCount.psmSensorCount ||
                            currentData.disabledPsmSensorCount !== sensorCount.disabledPsmSensorCount ||
                            currentData.etcSensorCount !== sensorCount.etcSensorCount ||
                            currentData.disabledEtcSensorCount !== sensorCount.disabledEtcSensorCount ||
                            currentData.cctvCount !== sensorCount.cctvCount ||
                            currentData.disabledCCTVCount !== sensorCount.disabledCCTVCount ||
                            currentData.earthquakeSensorCount !== sensorCount.earthquakeSensorCount ||
                            currentData.disabledEarthquakeSensorCount !== sensorCount.disabledEarthquakeSensorCount ||
                            currentData.strongWindSensorCount !== sensorCount.strongWindSensorCount ||
                            currentData.disabledStrongWindSensorCount !== sensorCount.disabledStrongWindSensorCount ||
                            currentData.environmentSensorCount !== sensorCount.environmentSensorCount ||
                            currentData.disabledEnvironmentSensorCount !== sensorCount.disabledEnvironmentSensorCount ||
                            currentData.emergencyBellCount !== sensorCount.emergencyBellCount ||
                            currentData.disabledEmergencyBellCount !== sensorCount.disabledEmergencyBellCount) {
                            store.dispatch({ type: 'SENSOR_COUNT', sensorCount: sensorCount });
                        }
                    }
                }
            }
        }
        catch (e) {
            //console.log(e);
        }
    }

    // 타이머로 날씨정보 불러오는 함수 리턴값을 Redux에 저장
    static async WatchWeather() {
        let result = await SDMSController.requestWeatherInfo();
        result = result === null || result.success === false ? [] : result.datas;
        store.dispatch({ type: 'WEATHER_CURRENT', weatherDatas: result });
    }

    // 타이머로 새로운 CCTV 정보 불러오는 함수 리턴값을 Redux에 저장
    static async WatchNewCCTVList() {
        let result = await SDMSController.requestNewCCTVList();
        result = result === null || result.success === false ? [] : result.cctVs;
        store.dispatch({ type: 'NEW_CCTV_LIST', newCCTVList: result });
    }

    static StartWatchTimer() {
        // 타이머 실행 유무 판단
        if (this.timerCheck == true)
            return;

        // 타이머 실행 체크
        this.timerCheck = true;

        // 1.5초에 한번씩 실행 - 알람 및 센서 수치
        let timerId = setTimeout(async function tick() {
            await SDMSController.WatchSensorAlarm();
            await SDMSController.WatchRangeSensors();
            await SDMSController.WatchWorkerInfos();
            timerId = setTimeout(tick, 1500);
        }, 1500);

        // 1분에 한번씩 실행 - 날씨, 인원현황, CCTV
        SDMSController.WatchWeather();
        SDMSController.WatchNewCCTVList();
        let timerWeather = setTimeout(async function tick() {
            await SDMSController.WatchWeather();
            await SDMSController.WatchNewCCTVList();
            timerWeather = setTimeout(tick, 60000);
        }, 60000);
    }

    static StartWatchTimerElevator() {
        // 타이머 실행 유무 판단
        if (this.timerCheckElevator == true)
            return;

        // 타이머 실행 체크
        this.timerCheckElevator = true;

        // 1초에 한번씩 실행 - 엘리베이터 정보
        SDMSController.timerElevator = setTimeout(async function tick() {
            await SDMSController.WatchElevatorInfos();
            SDMSController.timerElevator = setTimeout(tick, 1000);
        }, 1000);
    }

    static stopWatchTimer() {
        SDMSController.timerCheckElevator = false;
        clearTimeout(SDMSController.timerElevator);

        if (SDMSController.timerElevator > 0) {
            clearTimeout(SDMSController.timerElevator);
            SDMSController.timerElevator = 0;
        }
    }

    static async requestBuildingGroupList(siteNos) {
        try {
            const jsonData = SdmsJsonManager.makeRequestBuildingGroupList(siteNos);

            const res = await fetch('SDMS/SDMS/RequestData', {
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
                    return [result.buildingGroups, result.outdoorZones, ""];
                }
                else {
                    return [null, null, result.message];
                }
            }
        }
        catch (e) {
            console.log(e);
        }

        return [null, null, ""];
    }

    static async requestOuterDatas(siteNos) {
        try {
            const jsonData = SdmsJsonManager.makeRequestOuterDatas(siteNos);

            const res = await fetch('SDMS/SDMS/RequestData', {
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
                    const outdoorZoneCount = result.outdoorZones.length;

                    for (let i = 0; i < outdoorZoneCount; i++) {
                        const zone = result.outdoorZones[i];

                        if (zone.sensors?.cctvs) {
                            SDMSDataManager.checkCCTVTypes(zone.sensors.cctvs);
                        }
                    }

                    return [result.buildingGroups, result.outdoorZones, ""];
                }
                else {
                    return [null, null, result.message];
                }
            }
        }
        catch (e) {
            console.log(e);
        }

        return [null, null, ""];
    }

    static async requestIndoorDatas(zoneID, siteNos) {
        try {
            const jsonData = SdmsJsonManager.makeRequestIndoorDatas(zoneID, siteNos);

            const res = await fetch('SDMS/SDMS/RequestData', {
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
                    SDMSDataManager.checkCCTVTypes(result.cctvs);
                    return [result, ""];
                }
                else {
                    return [null, result.message];
                }
            }
        }
        catch (e) {
            console.log(e);
        }

        return [null, "requestIndoorDatas 실패"];
    }

    static async requestGltfModelList(userID, siteNos) {
        try {
            const jsonData = SdmsJsonManager.makeRequestGltfDataList(userID, siteNos);

            const res = await fetch('SDMS/SDMS/RequestData', {
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
                    return [result.models, result.gltfOption, ""];
                }
                else {
                    return [null, null, result.message];
                }
            }
        }
        catch (e) {
            console.log(e);
        }

        return [null, null, "requestGltfModelList 실패"];
    }

    static async requestSaveViewport(modelName, modelFile, camera, modelDisplayText, buildingGroupID, buildingID, zoneID) {
        try {
            const jsonData = SdmsJsonManager.makeRequestSaveViewport(modelName, modelFile, camera, modelDisplayText, buildingGroupID, buildingID, zoneID);

            const res = await fetch('SDMS/SDMS/RequestData', {
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
                    return [true, ""];
                }
                else {
                    return [false, result.message];
                }
            }
        }
        catch (e) {
            console.log(e);
        }

        return [false, "requestSaveViewport 실패"];
    }

    static async requestMoveBuildingNameText(buildingGroupName, buildingName, x, y, z) {
        try {
            const jsonData = SdmsJsonManager.makeRequestMoveBuildingNameText(buildingGroupName, buildingName, x, y, z);

            const res = await fetch('SDMS/SDMS/RequestData', {
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
                    return [true, ""];
                }
                else {
                    return [false, result.message];
                }
            }
        }
        catch (e) {
            console.log(e);
        }

        return [false, "requestMoveBuildingNameText 실패"];
    }

    static async requestMoveEquipZoneNameText(equipZoneID, equipZoneName, x, y, z) {
        try {
            const jsonData = SdmsJsonManager.makeRequestMoveEquipZoneNameText(equipZoneID, equipZoneName, x, y, z);

            const res = await fetch('SDMS/SDMS/RequestData', {
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
                    return [true, ""];
                }
                else {
                    return [false, result.message];
                }
            }
        }
        catch (e) {
            console.log(e);
        }

        return [false, "requestMoveBuildingNameText 실패"];
    }

    static async requestSensorList(siteNos) {
        try {
            const jsonData = SdmsJsonManager.makeRequestSensorList(siteNos);

            const res = await fetch('SDMS/SDMS/RequestData', {
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
                    SDMSDataManager.checkCCTVTypes(result.cctvs);
                    return [result, ""];
                }
                else {
                    return [null, result.message];
                }
            }
        }
        catch (e) {
            console.log(e);
        }

        return [null, "requestSensorList 실패"];
    }

    static async requestMoveSensor(sensorType, sensorID, x, z) {
        try {
            const jsonData = SdmsJsonManager.makeRequestSensor(sensorType, sensorID, x, z);

            const res = await fetch('SDMS/SDMS/RequestData', {
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
                    return [true, ""];
                }
                else {
                    return [false, result.message];
                }
            }
        }
        catch (e) {
            console.log(e);
        }

        return [false, "requestMoveSensor 실패"];
    }

    static async requestMalfunction(sensorType, sensorZoneID, accessedUserID, isMalfunction) {
        try {
            const jsonData = SdmsJsonManager.makeRequestMalfunction(sensorType, sensorZoneID, accessedUserID, isMalfunction);

            const res = await fetch('SDMS/SDMS/RequestData', {
                method: 'post',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                },
                body: jsonData
            });
        }
        catch (e) {
            console.log(e);
        }
    }

    static async requestSituationNotice(facilityType, sensorZoneID) {
        try {
            const jsonData = SdmsJsonManager.makeRequestSituationNotice(facilityType, sensorZoneID);

            const res = await fetch('SDMS/SDMS/RequestData', {
                method: 'post',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                },
                body: jsonData
            });
        }
        catch (e) {
            console.log(e);
        }
    }

    static async getEquipZoneCCTV(equipZoneID) {
        try {
            const jsonData = SdmsJsonManager.makeRequestEquipZoneCCTV(equipZoneID);

            const res = await fetch('SDMS/SDMS/RequestData', {
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
                    return [true, result.equipZoneCCTV];
                }
                else {
                    return [false, result.message];
                }
            }

        } catch (e) {
            console.log(e);
        }

        return [false, "getEquipZoneCCTV 실패"];
    }

    static async requestEquipZoneCCTVListFromSensor(sensorType, sensorID) {
        try {
            const jsonData = SdmsJsonManager.makeRequestEquipZoneCCTVListFromSensor(sensorType, sensorID);

            const res = await fetch('SDMS/SDMS/RequestData', {
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

        return null;
    }

    static async requestEquipZoneSensorList(sensorType, sensorID) {
        try {
            const jsonData = SdmsJsonManager.makeRequestEquipZoneSensorList(sensorType, sensorID);

            const res = await fetch('SDMS/SDMS/RequestData', {
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

        return null;
    }

    static async requestUpdateEquipZoneCCTVs(equipZoneCCTVs) {
        try {
            const jsonData = SdmsJsonManager.makeRequestUpdateEquipZoneCCTVs(equipZoneCCTVs);

            const res = await fetch('SDMS/SDMS/RequestData', {
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

        return null;
    }

    static async getOrgSensorID(sensorZoneID) {
        try {
            const jsonData = SdmsJsonManager.makeRequestGetOrgSensorID(sensorZoneID);
            const res = await fetch('SDMS/SDMS/RequestData', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json;charset=utf-8'
                },
                body: jsonData
            });

            if (res.ok) {
                const orgSensor = await res.json();
                return [orgSensor[0], orgSensor[1]]; // OrgSensorID, IsAlarmStatus
            }

        } catch (e) {
            console.log(e);
        }

        return null;
    }

    static async getStreamServerURL() {
        try {
            const jsonData = SdmsJsonManager.makeRequestStreamServerURL();

            const res = await fetch('SDMS/SDMS/GetStreamServerURL', {
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

        return null;
    }

    static async getFacilityTypes() {
        try {
            const jsonData = SdmsJsonManager.makeRequestFacilityTypes();

            const res = await fetch('SDMS/SDMS/RequestData', {
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
                    return [result.facilityTypes, null];
                }
                else {
                    return [null, result.message];
                }
            }
        }
        catch (e) {
            console.log(e);
        }

        return [null, ""];
    }

    static async getFacilityType(FacilityTypeID) {
        try {
            const jsonData = SdmsJsonManager.makeRequestFacilityType(FacilityTypeID);

            const res = await fetch('SDMS/SDMS/RequestData', {
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
                    return [true, result.facilityType];
                }
                else {
                    return [false, result.message];
                }
            }

        } catch (e) {
            console.log(e);
        }

        return [false, "getFacilityType 실패"];
    }


    static async requestUpdatePOIPosition(sensorType, zoneID, sensorID, x, y, z) {
        try {
            let userInfo = ProjectResource.getUserInfo();
            if (userInfo === null || userInfo === undefined)
                return[false, "유저 정보를 찾을 수 없습니다."];

            const jsonData = SdmsJsonManager.makeRequestUpdatePOIPosition(userInfo.id, sensorType, zoneID, sensorID, x, y, z);

            const res = await fetch('SDMS/SDMS/RequestData', {
                method: 'post',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                },
                body: jsonData
            });

            if (res.ok) {
                const result = await res.json();
                return [result.success, result.message];
            }

        } catch (e) {
            console.log(e);
            return [false, "requestUpdatePOIPosition 실패"];
        }
    }

    static async requestUpdatePOIPositions(sensorPositions) {
        try {
            let userInfo = ProjectResource.getUserInfo();
            if (userInfo === null || userInfo === undefined)
                return [false, "requestUpdatePOIPositions 실패 (해당 유저 정보를 찾을 수 없습니다.)"];

            const jsonData = SdmsJsonManager.makeRequestUpdatePOIPositions(userInfo.id, sensorPositions);

            const res = await fetch('SDMS/SDMS/RequestData', {
                method: 'post',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                },
                body: jsonData
            });

            if (res.ok) {
                const result = await res.json();
                return [result.success, result.message];
            }

        } catch (e) {
            console.log(e);
        }

        return [false, "requestUpdatePOIPosition 실패"];
    }

    static async requestUpdateCCTVs(datas) {
        try {
            let userInfo = ProjectResource.getUserInfo();
            if (userInfo === null || userInfo === undefined)
                return [false, "requestUpdateCCTVs 실패 (해당 유저정보를 찾을 수 없습니다.)"];

            const jsonData = SdmsJsonManager.makeRequestUpdateCCTVs(userInfo.id, datas);

            const res = await fetch('SDMS/SDMS/RequestData', {
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

        return [false, "requestUpdateNewCCTVs 실패"];
    }

    //옵션 획득(list)
    static async requestGetOption(UserID, Category) {
        try {
            const jsonData = SdmsJsonManager.makeRequestGetOption(UserID, Category);

            const res = await fetch('SOPManager/SOP/RequestData', {
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
                    return [true, result.options];
                } else {
                    return [false, result.message];
                }
            }
        } catch (e) {
            console.log(e);
        }

        return [false, 'requestGetOption 실패'];
    }

    //옵션 저장
    static async requestSaveOption(ID, UserID, Category, SubCategory, PropertyValue1, PropertyValue2, PropertyValue3, PropertyValue4) {
        try {
            const jsonData = SdmsJsonManager.makeRequestSaveOption(ID, UserID, Category, SubCategory, PropertyValue1, PropertyValue2, PropertyValue3, PropertyValue4);
            const res = await fetch('SOPManager/SOP/RequestData', {
                method: 'post',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                },
                body: jsonData
            });

            if (res.ok) {
                const result = await res.json();
                //데이터가 성공적으로 삽입 되면 primary id를 반환 받는다.
                if (result.success) {
                    return [true, result.options]
                } else {
                    return [false, result.message];
                }
            }

        } catch (e) {
            console.log(e);
        }
        return [false, 'requestSaveOption 실패'];
    }

    static async requestFacilityInfoData(modelName) {
        try {
            const jsonData = SdmsJsonManager.makeRequestFacilityInfoData(modelName);

            const res = await fetch('SDMS/SDMS/RequestData', {
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

        return null;
    }

    static async requestAllFacilityInfo() {
        try {
            const jsonData = SdmsJsonManager.makeRequestAllFacilityInfo();

            const res = await fetch('SDMS/SDMS/RequestData', {
                method: 'post',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                },
                body: jsonData
            });

            if (res.ok) {
                const result = await res.json();
                if (result === null) {
                    return null;
                }
                else {
                    return result.infos;
                }
            }

        } catch (e) {
            console.log(e);
        }

        return null;
    }

    static async requestBuildingData(buildingName) {
        try {
            const jsonData = SdmsJsonManager.makeRequestBuildingData(buildingName);

            const res = await fetch('SDMS/SDMS/RequestData', {
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

        return null;
    }

    static async requestBuildingGroupData(buildingGroupID) {
        try {
            const jsonData = SdmsJsonManager.makeRequestBuildingGroupData(buildingGroupID);

            const res = await fetch('SDMS/SDMS/RequestData', {
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

        return null;
    }

    static async requestSaveIndoorModelViewport(modelName, cameraData, zoneID) {
        try {
            const jsonData = SdmsJsonManager.makeRequestSaveIndoorModelViewport(modelName, cameraData, zoneID);

            const res = await fetch('SDMS/SDMS/RequestData', {
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

        return null;
    }

    static async requestSaveOrthoModelViewport(modelName, cameraData, zoneID) {
        try {
            const jsonData = SdmsJsonManager.makeRequestSaveOrthoModelViewport(modelName, cameraData, zoneID);

            const res = await fetch('SDMS/SDMS/RequestData', {
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

        return null;
    }

    static async requestWeatherInfo() {
        try {
            const jsonData = SdmsJsonManager.makeRequestWeatherInfo();

            const res = await fetch('Weather/Weather/RequestData', {
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

        return null;
    }

    static async requestFakeWalls(zoneID) {
        try {
            const jsonData = SdmsJsonManager.makeRequestFakeWalls(zoneID);

            const res = await fetch('SDMS/SDMS/RequestData', {
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

        return null;
    }

    static async requestUpdateFakeWall(fakeWall, id, zoneID, mode) {
        try {
            let userInfo = ProjectResource.getUserInfo();
            if (userInfo === null || userInfo === undefined)
                return null;

            const jsonData = SdmsJsonManager.makeRequestUpdateFakeWall(userInfo.id, fakeWall, id, zoneID, mode);

            const res = await fetch('SDMS/SDMS/RequestData', {
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

        return null;
    }

    static async requestUpdateFakeWalls(datas) {
        try {
            let userInfo = ProjectResource.getUserInfo();
            if (userInfo === null || userInfo === undefined)
                return null;

            const jsonData = SdmsJsonManager.makeRequestUpdateFakeWalls(userInfo.id, datas);

            const res = await fetch('SDMS/SDMS/RequestData', {
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

        return null;
    }

    static async requestManualReport(dateTime, sensorType, sensorZoneID, zoneID, alarmDepth, reportPerson, memo) {
        try {            
            const jsonData = SdmsJsonManager.makeRequestManualReport(dateTime, sensorType, sensorZoneID, zoneID, alarmDepth, reportPerson, memo);

            const res = await fetch('SDMS/SDMS/RequestData', {
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

        return null;
    }

    static async requestClearManualReport(sensorType, sensorZoneID, sensorZoneHistoryID, accessedUserID) {
        try {
            const jsonData = SdmsJsonManager.makeRequestClearManualReport(sensorType, sensorZoneID, sensorZoneHistoryID, accessedUserID);

            const res = await fetch('SDMS/SDMS/RequestData', {
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

        return null;
    }

    static async requestNewCCTVList() {
        try {
            const jsonData = SdmsJsonManager.makeRequestNewCCTVList();

            const res = await fetch('SDMS/SDMS/RequestData', {
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

        return null;
    }

    static async requestCommonSettings() {
        try {
            const jsonData = SdmsJsonManager.makeRequestCommonSettings();

            const res = await fetch('SDMS/SDMS/RequestData', {
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

        return null;
    }

    static async requestGetSiteNo() {
        try {
            const jsonData = SdmsJsonManager.makeRequestGetSiteNo();

            const res = await fetch('SDMS/SDMS/RequestData', {
                method: 'post',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                },
                body: jsonData
            });

            if (res.ok) {
                const result = await res.json();

                if (result.success === true) {
                    return [result.siteNo, ""];
                } else {
                    return [null, result.message];
                }
            }

        } catch (e) {
            console.log(e);
        }

        return [null, "requestGetSiteNo 실패"];
    }

    static async requestMaterials() {
        try {
            const jsonData = SdmsJsonManager.makeRequestMaterials();

            const res = await fetch('SDMS/SDMS/RequestData', {
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
                    return [result.materials, ""];
                } else {
                    return [null, result.message];
                }
            }

        } catch (e) {
            console.log(e);
        }

        return [null, "requestMaterials 실패"];
    }

    static async WatchRangeSensors() {
        let result = await SDMSController.requestRangeSensors();

        if (result !== null && result.success === true) {
            let rangeSensors = new Object();
            rangeSensors.rangePsmSensors = result.psmSensors;
            rangeSensors.rangeEtcSensors = result.etcSensors;
            store.dispatch({ type: 'RANGE_SENSORS', rangeSensors: rangeSensors });
        }

        
    }

    static async requestRangeSensors() {
        try {
            const jsonData = SdmsJsonManager.makeRequestRangeSensors();

            const res = await fetch('SDMS/SDMS/RequestData', {
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

        return null;
    }

    static async requestImageFilePath(zoneID) {
        try {
            const jsonData = SdmsJsonManager.makeRequestImagePath(zoneID);

            const res = await fetch('SDMS/SDMS/RequestData', {
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

        return null;
    }


    static async WatchWorkerInfos() {
        let result = await SDMSController.requestWorkerInfos();

        if (result !== null && result.success === true) {
            // 값 비교 후 다를 경우 dispatch
            let currentWorkers = store.getState().workerInfos;

            let newWorkers = new Object();
            newWorkers.buildingGroupWorkerInfos = result.buildingGroupWorkerInfos;
            newWorkers.buildingWorkerInfos = result.buildingWorkerInfos;
            newWorkers.zoneWorkerInfos = result.zoneWorkerInfos;
            newWorkers.equipZoneWorkerInfos = result.equipZoneWorkerInfos;

            // 기존 데이터가 없을 경우
            if (!currentWorkers) {
                store.dispatch({ type: 'WORKER_INFOS', workerInfos: newWorkers });
                return;
            }

            // 신규 WorkerInfos 데이터와 현재 데이터 숫자가 맞지 않을 경우
            if (currentWorkers?.buildingGroupWorkerInfos?.length !== newWorkers?.buildingGroupWorkerInfos?.length ||
                currentWorkers?.buildingWorkerInfos?.length !== newWorkers?.buildingWorkerInfos?.length ||
                currentWorkers?.zoneWorkerInfos?.length !== newWorkers?.zoneWorkerInfos?.length) {
                store.dispatch({ type: 'WORKER_INFOS', workerInfos: newWorkers });
                return;
            }

            // buildingGroup 데이터가 다를 경우
            if (newWorkers?.buildingGroupWorkerInfos?.length > 0 && currentWorkers?.buildingGroupWorkerInfos?.length > 0) {
                for (const newWorkerInfo of newWorkers.buildingGroupWorkerInfos) {
                    const workerInfo = currentWorkers.buildingGroupWorkerInfos.find(x => x.id === newWorkerInfo.id && x.workerCount === newWorkerInfo.workerCount);

                    if (!workerInfo) {
                        store.dispatch({ type: 'WORKER_INFOS', workerInfos: newWorkers });
                        return;
                    }
                }
            }

             // building 데이터가 다를 경우
            if (newWorkers?.buildingWorkerInfos?.length > 0 && currentWorkers?.buildingWorkerInfos?.length > 0) {
                for (const newWorkerInfo of newWorkers.buildingWorkerInfos) {
                    const workerInfo = currentWorkers.buildingWorkerInfos.find(x => x.id === newWorkerInfo.id && x.workerCount === newWorkerInfo.workerCount);

                    if (!workerInfo) {
                        store.dispatch({ type: 'WORKER_INFOS', workerInfos: newWorkers });
                        return;
                    }
                }
            }

             // zone 데이터가 다를 경우
            if (newWorkers?.zoneWorkerInfos?.length > 0 && currentWorkers?.zoneWorkerInfos?.length > 0) {
                for (const newWorkerInfo of newWorkers.zoneWorkerInfos) {
                    const workerInfo = currentWorkers.zoneWorkerInfos.find(x => x.id === newWorkerInfo.id && x.workerCount === newWorkerInfo.workerCount);

                    if (!workerInfo) {
                        store.dispatch({ type: 'WORKER_INFOS', workerInfos: newWorkers });
                        return;
                    }
                }
            }

            // equipZone 데이터가 다를 경우
            if (newWorkers?.equipZoneWorkerInfos?.length > 0 && currentWorkers?.equipZoneWorkerInfos?.length > 0) {
                for (const newWorkerInfo of newWorkers.equipZoneWorkerInfos) {
                    const workerInfo = currentWorkers.equipZoneWorkerInfos.find(x => x.id === newWorkerInfo.id && x.workerCount === newWorkerInfo.workerCount);

                    if (!workerInfo) {
                        store.dispatch({ type: 'WORKER_INFOS', workerInfos: newWorkers });
                        return;
                    }
                }
            }
        }
    }

    static async requestWorkerInfos() {
        try {
            const jsonData = SdmsJsonManager.makeRequestWorkerInfos();

            const res = await fetch('SDMS/SDMS/RequestData', {
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

        return null;
    }

    static async requestWonikEquipZoneMembers(equipZoneID) {
        try {
            const res = await fetch('http://localhost:2420/Beacon/RequestEquipZoneMembers', {
                method: 'post',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ EquipZoneID: equipZoneID })
            });

            if (res.ok) {
                const result = await res.json();

                if (result.success) {
                    return [result.equipZoneMembers, ""];
                }
                else {
                    return [null, result.message];
                }
            }
        }
        catch (e) {
            console.log(e);
        }

        return [null, "requestWonikEquipZoneMembers 실패"];
    }

    static async requestWonikRemainerMembers(equipZoneID) {
        try {
            const res = await fetch('http://localhost:2420/Beacon/RequestRemainerMembers', {
                method: 'post',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ EquipZoneID: equipZoneID })
            });

            if (res.ok) {
                const result = await res.json();

                if (result.success) {
                    return [result.equipZoneMembers, ""];
                }
                else {
                    return [null, result.message];
                }
            }
        }
        catch (e) {
            console.log(e);
        }

        return [null, "requestWonikEquipZoneMembers 실패"];
    }

    static async requestWonikRemainerSMS(phoneNumbers) {
        try {
            const res = await fetch('http://localhost:2420/Beacon/RequestRemainerSMS', {
                method: 'post',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ PhoneNumbers: phoneNumbers })
            });

            if (res.ok) {
                const result = await res.json();

                if (result.success) {
                    return [true, ""];
                }
                else {
                    return [false, result.message];
                }
            }
        }
        catch (e) {
            console.log(e);
        }

        return [false, "requestWonikRemainerSendSMS 실패"];
    }

    static async requestUpdateEquipZoneAreas(datas) {
        try {
            let userInfo = ProjectResource.getUserInfo();
            if (userInfo === null || userInfo === undefined)
                return null;

            const jsonData = SdmsJsonManager.makeRequestUpdateEquipZoneAreas(userInfo.id, datas);

            const res = await fetch('SDMS/SDMS/RequestData', {
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

        return null;
    }

    static async requestEquipZoneAreas(zoneID) {
        try {
            const jsonData = SdmsJsonManager.makeRequestEquipZoneAreas(zoneID);

            const res = await fetch('SDMS/SDMS/RequestData', {
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

        return null;
    }

    static async requestUpdateSensorEquipZones(datas) {
        try {
            let userInfo = ProjectResource.getUserInfo();
            if (userInfo === null || userInfo === undefined)
                return null;

            const jsonData = SdmsJsonManager.makeRequestUpdateSensorEquipZones(userInfo.id, datas);

            const res = await fetch('SDMS/SDMS/RequestData', {
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

        return null;
    }

    static async requestYearStatus() {
        try {
            const jsonData = SdmsJsonManager.makeRequestYearStatus();

            const res = await fetch('SDMS/SDMS/RequestData', {
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

                    return [result.alarmInfos, ""];
                } else {
                    return [null, result.message];
                }
            }
        }
        catch (e) {
            console.log(e);
        }

        return [null, "requestYearStatus 실패"];
    }

    static async requestElevators() {
        try {
            const jsonData = SdmsJsonManager.makeRequestElevators();
            
            const res = await fetch('SDMS/SDMS/RequestData', {
                method: 'post',
                headers: {
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
        
        return null;
    }
    
    static async WatchElevatorInfos() {
        // 엘리베이터 정보 조회
        let result = await SDMSController.requestElevators();

        let elevatorDatas = [];
        elevatorDatas = result.elevators;

        if (result !== null && result.success === true) {

            // 값 비교 후 다를 경우 dispatch
            let currentDatas = store.getState().elevatorDatas;

            // 기존 데이터가 없을 경우
            if (currentDatas.length === 0) {
                store.dispatch({ type: 'ELEVATOR_INFOS', elevatorDatas: elevatorDatas });
                return;
            }

            let compare = isEqual(currentDatas, elevatorDatas);

            if (!compare) {
                store.dispatch({ type: 'ELEVATOR_INFOS', elevatorDatas: elevatorDatas });
            }
        }
    }
}