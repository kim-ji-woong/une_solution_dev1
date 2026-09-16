import store from '../../Root/store';
import { SdmsJsonManager } from './sdmsJsonManager';
import SessionString from '../../Common/js/sessionString';
import { SDMSDataManager } from './sdmsDataManager';
import SettingsStore from '../../Settings/settingsStore';

import ProjectResource from '../../Root/resource/id';
import AccountResource from '../../Account/resource/id';
import { isEqual } from 'lodash';
import SdmsResource from "../resource/id";
import {ExternalController} from "./externalController";

export class SDMSController {
    static alarmTimer = null;
    static sensorTimer = null;

    static StartWatchSensorTimer() {
        // 타이머 실행 유무 판단
        if (this.sensorTimerCheck) return;

        // 타이머 실행 체크
        this.sensorTimerCheck = true;

        // 1초에 한번씩 실행 - 센서 리스트
        const sensorTick = async () => {
            try {
                if (!this.sensorTimerCheck) return;
                const result = await SDMSController.requestSensorList();
                const slk = await ExternalController.GetExternalSensorLinks();
                const st = await ExternalController.GetExternalSensorTypes();
                if (!st || st.length === 0 || !slk || slk.length === 0) {
                    console.log("External Sensor Type or Link is null : sdmsController.js line 30");
                }
                if (result && result[0] !== null) {
                    SDMSController.MakeSensorList(result[0], st, slk);
                }
            } catch (e) {
                console.log("Sensor Timer Error: ", e);
            } finally {
                if (this.sensorTimerCheck) {
                    this.sensorTimer = setTimeout(sensorTick, 1000);
                }
            }
        };
        sensorTick();
    }
    
    static StartWatchAlarmTimer() {
        
        if (this.alarmTimerCheck) return;
        
        this.alarmTimerCheck = true;
        
        const alarmTick = async () => {
            try {
                if (!this.alarmTimerCheck) return;
                await SDMSController.WatchSensorAlarm();
            } catch (e) {
                console.log("Alarm Timer Error: ", e);
            } finally {
                if (this.alarmTimerCheck) {
                    this.alarmTimer = setTimeout(alarmTick, 1500);
                }
            }
        };

        alarmTick();
    }

    static MakeSensorList = (allSensors, st, slk) => {
        if (!allSensors) return;
        
        for (let i = 0; i < allSensors.length; i++) {
            const temp = allSensors[i];
            if (temp.sensors) {
                allSensors[i].sensors = allSensors[i].sensors.sort((a, b) => {
                    return a.sensor.sensor_sn - b.sensor.sensor_sn;
                })
            }
        }

        let sensorTypes = store.getState().sensorTypes;
        let sensorLinks = store.getState().sensorLinks;

        if (!sensorTypes || sensorTypes.length === 0) sensorTypes = st;
        if (!sensorLinks || sensorLinks.length === 0) sensorLinks = slk;

        if (!sensorTypes || sensorTypes.length === 0 || !sensorLinks || sensorLinks.length === 0) return null;

        let sensorList = [];
        
        for (let i = 0; i < sensorTypes.length; i++) {
            sensorList.push({
                sensorType: sensorTypes[i],
                zones: []
            })
        }

        let sensorElements = [];
        for (let i = 0; i < allSensors.length; i++) {
            const sensorData = allSensors[i];
            if (SdmsResource.isSensorType(sensorData.sensorTypeCode)) {
                sensorElements = sensorElements.concat(sensorData.sensors);
            }
        }
        
        const cctvElements = allSensors.find((s) => s.sensorTypeCode === SdmsResource.facilityType.CCTV)?.sensors; 
        for (let i = 0; i < sensorLinks.length; i++) {
            
            const sensorLink = sensorLinks[i];
            const sensorTypeIdx = sensorLink.sensor_type_idx;
            
            const targetSensorType = sensorList.find(sl => sl.sensorType.sensor_type_idx === sensorTypeIdx);
            
            if (targetSensorType) {
                let zone = {
                    sensorLink: sensorLink,
                    sensors: []
                }
                
                const zone_sn = sensorLink.zone_sn;

                let filteredSensors = [];
                if(sensorLink.sensor_type_idx === SdmsResource.externalSensorType.trafficCCTV ||
                   sensorLink.sensor_type_idx === SdmsResource.externalSensorType.existingCCTV) 
                {

                    for (let j = 0; j < cctvElements?.length; j++) {
                        const s = cctvElements[j];
                        const sensor = s.sensor;
                        const cctv = s.cctv;
                        const sensorTypeNo = cctv?.unq_key.split('_')[1];
                        
                        if (sensorTypeIdx === parseInt(sensorTypeNo) && sensor.zone_sn === zone_sn) {
                            filteredSensors.push(s);
                        }
                    }
                    
                } else {
                    for (let j = 0; j < sensorElements.length; j++) {
                        const s = sensorElements[j];

                        const sensor = s.sensor
                        const sensorZoneData = s.sensorZoneData;
                        const sensorZone = sensorZoneData.sensorZone;

                        const sensorTypeNo = sensorZone.unq_key.split('_')[1];
                        if (sensorTypeIdx === parseInt(sensorTypeNo) && sensor.zone_sn === zone_sn) {
                            filteredSensors.push(s);
                        }
                    }
                }
                
                zone.sensors = filteredSensors;
                
                targetSensorType.zones.push(zone);
            }
        }
        
        const oldValue = store.getState().sensorList;
        const compare = isEqual(oldValue, sensorList);

        if (!compare) {
            store.dispatch({ type: 'SENSOR_LIST', sensorList: sensorList });
        }
        
        return sensorList;
    }
    
    /*
    * 단순 리스트 반환 Redux 업데이트 X
    */
    static async getSensorList() {
        try {
            const result = await SDMSController.requestSensorList();
            if (!result || !result[0] || result[0].length === 0) {
                return null;
            }
            
            const st = await ExternalController.GetExternalSensorTypes();
            const slk = await ExternalController.GetExternalSensorLinks();

            const sensorList = SDMSController.MakeSensorList(result[0], st, slk);
            return sensorList || null;

        } catch (e) {
            console.log(e);
            return null;
        }
    }
    
    static stopWatchSensorTimer() {
        if (this.sensorTimer) {
            clearTimeout(this.sensorTimer);
            this.sensorTimer = null;
        }
        this.sensorTimerCheck = false;

        store.dispatch({ type: 'SENSOR_LIST', sensorList: [] });
    }
    
    static stopWatchAlarmTimer() {
        if (this.alarmTimer) {
            clearTimeout(this.alarmTimer);
            this.alarmTimer = null;
        }
        this.alarmTimerCheck = false;
        
        store.dispatch({ type: 'SENSOR_ALARM', sensorAlarm: null, sensorAllAlarm: null });
    }
    
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
        let [result, message] = await SDMSController.requestTodayAlarmData();

        if (message && message.length > 0) {
            console.log(message);
        }
        else {
            result = result == null ? new Array() : result;
            if (result == null) {
                return new Array();
            }
            
            // 현재 센서 알람 히스토리 조회
            SDMSController.toCompareAlarm('SENSOR_ALARM', result);
        }
    }

    static toCompareAlarm(type, result) {
        const userInfo = ProjectResource.getUserInfo();
        if (!userInfo)
            return;

        let currentAlarm = store.getState().sensorAlarm;

        let receiveAlarm = [];
        for (let i = 0; i < result?.length; i++) {
            const alarmData = result[i];

            // 마스터 경우 모든 사이트 알람 체크
            // 마스터가 아닌 경우 해당 사이트 알람 체크
            if (userInfo.grad_sn === AccountResource.accountLevelNo.master || 
                userInfo.site_sn === alarmData.siteNo) {
                receiveAlarm.push(alarmData);
            } 
        }

        let temp = null; // 센서 비교에 사용

        currentAlarm = currentAlarm == null ? new Array() : currentAlarm;
        temp = currentAlarm.slice(); // 깊은 복사

        // 조회된 센서 알람와 표시되고 있는 센서 알람 비교 후 Redux에 저장
        if (receiveAlarm.length != currentAlarm.length) {
            // 알람 수가 같지 않을 때
            store.dispatch({ type: type, sensorAlarm: receiveAlarm });

        } else if (receiveAlarm.length == currentAlarm.length && receiveAlarm.length != 0) {
            const receiveAlarmCount = receiveAlarm.length;
            for (let i = 0; i < receiveAlarmCount; i++) {
                const alarmSensorZones = receiveAlarm[i].sensorZones;

                for (let j = 0; j < temp.length; j++) {
                    const tempSensorZones = temp[j].sensorZones;

                    // id 비교 같으면 삭제
                    if (receiveAlarm[i].dtTime == temp[j].dtTime &&
                        receiveAlarm[i].equipZoneNo == temp[j].equipZoneNo &&
                        receiveAlarm[i].sopStatus == temp[j].sopStatus &&
                        receiveAlarm[i].alarmDepth == temp[j].alarmDepth &&
                        receiveAlarm[i].isAlarm == temp[j].isAlarm &&
                        receiveAlarm[i].sensorZoneHistoryNo == temp[j].sensorZoneHistoryNo &&
                        receiveAlarm[i].reactionType == temp[j].reactionType &&
                        SDMSController.compareSensorZones(alarmSensorZones, tempSensorZones)) {
                        temp.splice(j, 1);
                        break;
                    }
                }
            }

            // currentAlarm 갯수가 남아있다면 >> 센서 알람이 동일하지 않음.
            if (temp.length === 0) return;

            const changedAlarm = receiveAlarm.find(alarm => alarm.sensorZoneHistoryNo === temp[0].sensorZoneHistoryNo);
            const isDisasterReported = changedAlarm?.reactionType === SdmsResource.reactionType.재난신고;

            store.dispatch({
                type,
                sensorAlarm: receiveAlarm,
                spreadAlarm: isDisasterReported ? changedAlarm : null,
            });
        }
    }

    static compareSensorZones(firstSensorZones, secondSensorZones) {
        const firstCount = firstSensorZones.length;
        const secondCount = secondSensorZones.length;

        for (let i = 0; i < firstCount; i++) {
            const sensorZone = firstSensorZones[i];
            let find = false;

            for (let j = 0; j < secondCount; j++) {
                const _sensorZone = secondSensorZones[j];

                if (sensorZone.sensorZoneNo === _sensorZone.sensorZoneNo) {
                    find = true;
                    break;
                }
            }

            if (!find) {
                return false;
            }
        }

        return true;
    }

    static async requestTodayAlarmData(siteNo = null, sensorType = null) {
        try {
            const jsonData = SdmsJsonManager.makeRequestTodayAlarmData(siteNo, sensorType);

            const res = await fetch(ProjectResource.baseUrl + '/api/SDMS/RequestTodayAlarms', {
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

        return [null, "requestTodayAlarmData 실패"];
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

    static async requestBuildingGroupList(siteNos) {
        try {
            //const jsonData = SdmsJsonManager.makeRequestBuildingGroupList(siteNos);
            const jsonData = JSON.stringify({ siteNos: siteNos });

            const res = await fetch('/api/SDMS/RequestBuildingGroupList', {
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

    static async requestSensorList(sensorTypes = null, siteNos = null, enabled = null, searchText = null, pageIndex = null, pageItemCount = null) {
        try {
            const jsonData = SdmsJsonManager.makeRequestSensorList(sensorTypes, siteNos, enabled, searchText, pageIndex, pageItemCount);

            const res = await fetch(ProjectResource.baseUrl + '/api/SDMS/RequestSensorList', {
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
                    /* Cannot read properties of undefined (reading 'length') 오류발생
                    SDMSDataManager.checkCCTVTypes(result.cctvs);
                    */
                    return [result.sensorTypes, result.totalCount, ""];
                }
                else {
                    return [null, 0, result.message];
                }
            }
        }
        catch (e) {
            console.log(e);
        }

        return [null, 0, "requestSensorList 실패"];
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

            const jsonData = SdmsJsonManager.makeRequestUpdatePOIPosition(userInfo.user_sn, sensorType, zoneID, sensorID, x, y, z);

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

            const jsonData = SdmsJsonManager.makeRequestUpdatePOIPositions(userInfo.user_sn, sensorPositions);

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

            const jsonData = SdmsJsonManager.makeRequestUpdateCCTVs(userInfo.user_sn, datas);

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

            const jsonData = SdmsJsonManager.makeRequestUpdateFakeWall(userInfo.user_sn, fakeWall, id, zoneID, mode);

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

            const jsonData = SdmsJsonManager.makeRequestUpdateFakeWalls(userInfo.user_sn, datas);

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

    static async requestClearManualReport(sensorType, sensorZoneID, sensorZoneHistoryNo, accessedUserID) {
        try {
            const jsonData = SdmsJsonManager.makeRequestClearManualReport(sensorType, sensorZoneID, sensorZoneHistoryNo, accessedUserID);

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
                    return [result.site_sn, ""];
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

    static async requestUpdateEquipZoneAreas(datas) {
        try {
            let userInfo = ProjectResource.getUserInfo();
            if (userInfo === null || userInfo === undefined)
                return null;

            const jsonData = SdmsJsonManager.makeRequestUpdateEquipZoneAreas(userInfo.user_sn, datas);

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

            const jsonData = SdmsJsonManager.makeRequestUpdateSensorEquipZones(userInfo.user_sn, datas);

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

    static async requestAlarm(siteNo = null, sensorType = null, beginDate = null, endDate = null) {
        try {
            const jsonData = SdmsJsonManager.makeRequestAlarm(siteNo, sensorType, beginDate, endDate);

            const res = await fetch(ProjectResource.baseUrl + '/api/SDMS/RequestAlarm', {
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

        return [null, "requestAlarm 실패"];
    }

    static async requestTodayAlarmData(siteNo = null, sensorType = null) {
        try {
            const jsonData = SdmsJsonManager.makeRequestTodayAlarmData(siteNo, sensorType);

            const res = await fetch(ProjectResource.baseUrl + '/api/SDMS/RequestTodayAlarms', {
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

        return [null, "requestTodayAlarmData 실패"];
    }

    static async requestAlarmMemo(sensorZoneHistoryNo) {
        try {
            const jsonData = SdmsJsonManager.makeRequestAlarmMemo(sensorZoneHistoryNo);

            const res = await fetch(ProjectResource.baseUrl + '/api/SDMS/RequestAlarmMemo', {
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
                    return [result.success, result.memo, ""];
                }
                else {
                    return [false, null, result.message];
                }
            }

        }
        catch (e) {
            //console.log(e);
        }

        return [false, null, "requestAlarmMemo 실패"];
    }

    static async saveAlarmMemo(sensorZoneHistoryNo, memo) {
        try {
            const jsonData = SdmsJsonManager.makeSaveAlarmMemo(sensorZoneHistoryNo, memo);

            const res = await fetch(ProjectResource.baseUrl + '/api/SDMS/SaveAlarmMemo', {
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
                    return [result.success, result.memo, ""];
                }
                else {
                    return [false, null, result.message];
                }
            }

        }
        catch (e) {
            //console.log(e);
        }

        return [false, null, "saveAlarmMemo 실패"];
    }

    static async clearAlarm(sensorZoneHistoryNo, isMalfunction, userNo, memo = null, timeStamp = null) {
        try {
            const jsonData = SdmsJsonManager.makeClearAlarm(sensorZoneHistoryNo, isMalfunction, userNo, memo, timeStamp);

            const res = await fetch(ProjectResource.baseUrl + '/api/SDMS/ClearAlarm', {
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
                    return [result.success, ""];
                }
                else {
                    return [false, result.message];
                }
            }

        }
        catch (e) {
            //console.log(e);
        }

        return [false, "clearAlarm 실패"];
    }

    static async clearAllAlarm(userNo, siteNo = null, sensorType = null, sensorSubType = null, timeStamp = null) {
        try {
            const jsonData = SdmsJsonManager.makeClearAllAlarm(userNo, siteNo, sensorType, sensorSubType, timeStamp);

            const res = await fetch(ProjectResource.baseUrl + '/api/SDMS/ClearAllAlarm', {
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
                    return [result.success, ""];
                }
                else {
                    return [false, result.message];
                }
            }

        }
        catch (e) {
            //console.log(e);
        }

        return [false, "clearAllAlarm 실패"];
    }

    static async runAlarmSop(sensorZoneHistoryNo, userNo) {
        try {
            const jsonData = SdmsJsonManager.makeRunAlarmSop(sensorZoneHistoryNo, userNo);

            const res = await fetch(ProjectResource.baseUrl + '/api/SDMS/BeginAlarmSop', {
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
                    return [result.success, ""];
                }
                else {
                    return [false, result.message];
                }
            }

        }
        catch (e) {
            //console.log(e);
        }

        return [false, "runAlarmSop 실패"];
    }

    // 재난상황으로 신고
    static async notifyAlarm(sensorZoneHistoryNo, userNo, timeStamp = null) {
        try {
            const jsonData = SdmsJsonManager.makeNotifyAlarm(sensorZoneHistoryNo, userNo, timeStamp);

            const res = await fetch('api/SDMS/NotifyAlarm', {
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
                    return [result, result.message];
                }
                else {
                    return [null, result.message];
                }
            }
        }
        catch (e) {
            console.log(e);
        }

        return [null, "notifyAlarm 실패"];
    }
    
}