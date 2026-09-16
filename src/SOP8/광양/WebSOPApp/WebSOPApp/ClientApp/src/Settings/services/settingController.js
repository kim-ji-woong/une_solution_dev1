import JsonManager from "./jsonManager";
import SettingsStore from '../settingsStore';
import ProjectResource from '../../Root/resource/id';
//import { object } from "@amcharts/amcharts4/core";
import { isEqual } from 'lodash';

export class SettingController {
    static StartWatchTimer() {
        // 타이머 실행 유무 판단
        if (this.timerCheck == true)
            return;

        // 타이머 실행 체크
        this.timerCheck = true;

        SettingController.WatchSettings();
        let timerSettings = setTimeout(async function tick() {
            await SettingController.WatchSettings();
            timerSettings = setTimeout(tick, 2000);
        }, 2000);
    }

    // 공용 옵션들 불러오기
    static async WatchSettings() {
        const selectSiteNo = SettingsStore?.getState()?.selectSiteNo;
        if (!selectSiteNo)
            return;

        const [settings, message] = await SettingController.requestSetting(selectSiteNo);

        if (!settings) {
            console.log(message);
            return;
        }

        let currentSettings = SettingsStore.getState().commonSettings;

        if (currentSettings === null || currentSettings === undefined) {
            console.log('settings first updated!');
            SettingsStore.dispatch({ type: 'COMMON_SETTINGS', commonSettings: settings });
        }
        else {
            for (const name in settings) {
                const oldValue = currentSettings[name];
                const newValue = settings[name];

                const compare = isEqual(oldValue, newValue);

                if (!compare) {
                    console.log('settings updated!');
                    SettingsStore.dispatch({ type: 'COMMON_SETTINGS', commonSettings: settings });
                    break;
                }
            }
        }
    }

    static async reloadSdmsCommonSettings(selectSiteNo) {
        const [sdmsSettings, sdmsMessage] = await SettingController.requestSdmsCommonSettings(selectSiteNo);

        if (sdmsSettings === null) 
            return [false, sdmsMessage];
        
        let currentSettings = SettingsStore.getState().sdmsCommonSettings;

        if (currentSettings === null || currentSettings === undefined) {

            SettingsStore.dispatch({ type: 'SDMS_COMMON_SETTINGS', sdmsCommonSettings: sdmsSettings });
        } else {
            for (const name in sdmsSettings) {
                const oldValue = currentSettings[name];
                const newValue = sdmsSettings[name];

                if (oldValue !== newValue) {
                    SettingsStore.dispatch({ type: 'SDMS_COMMON_SETTINGS', sdmsCommonSettings: sdmsSettings });
                    break;
                }
            }
        }

        return [true, sdmsMessage];
    }

    static async reloadSopCommonSettings(selectSiteNo) {
        const [sopSettings, sopMessage] = await SettingController.requestSopCommonSettings(selectSiteNo);

        if (sopSettings === null)
            return [false, sopMessage];

        let currentSettings = SettingsStore.getState().sopCommonSettings;

        if (currentSettings === null || currentSettings === undefined)
            SettingsStore.dispatch({ type: 'SOP_COMMON_SETTINGS', sopCommonSettings: sopSettings });
        else {
            for (const name in sopSettings) {
                const oldValue = currentSettings[name];
                const newValue = sopSettings[name];

                if (oldValue !== newValue) {
                    SettingsStore.dispatch({ type: 'SOP_COMMON_SETTINGS', sopCommonSettings: sopSettings });
                    break;
                }
            }
        }

        return [true, sopMessage];
    }

    static async reloadAccountSettings() {
        const userInfo = await ProjectResource.initUserInfo();

        if (userInfo === null || userInfo === undefined) 
            return [false, "해당 계정 정보가 없습니다."];

        const userID = userInfo.user_sn;

        const [accountSettings, accountMessage] = await SettingController.requestAccountSettings(userID);

        if (accountSettings === null)
            return [false, accountMessage];

        if (accountSettings !== null || accountSettings !== undefined) {
            let shortcutKey = accountSettings.shortcutKey;
            let currentKey = SettingsStore.getState().shortcutKey;

            if (currentKey === null || currentKey === undefined)
                SettingsStore.dispatch({ type: 'SHORTCUT_KEY', shortcutKey: shortcutKey });
            else {
                if (shortcutKey.dashboard !== currentKey.dashboard ||
                    shortcutKey.history !== currentKey.history ||
                    shortcutKey.home !== currentKey.home ||
                    shortcutKey.rotation !== currentKey.rotation ||
                    shortcutKey.sdms !== currentKey.sdms ||
                    shortcutKey.settings !== currentKey.settings ||
                    shortcutKey.sop !== currentKey.sop ||
                    shortcutKey.sopMgr !== currentKey.sopMgr ||
                    shortcutKey.teamEdit !== currentKey.teamEdit)
                    SettingsStore.dispatch({ type: 'SHORTCUT_KEY', shortcutKey: shortcutKey });
            }

            // SDMS 페이지를 동시에 띄워 (팝업창 위치/사이즈, 자동회전 대기시간) 서로 동기화 시킬 필요는 없음
            //let popupState = SettingsStore.getState().popupState;
            //let idleTime = SettingsStore.getState().idleTime;
        }

        return [true, accountMessage];
    }

    static async requestSettings(userID, site_sn) {
        try {
            const jsonData = JsonManager.makeRequestSettings(userID, site_sn);

            const res = await fetch('Settings/Settings/RequestData', {
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
                    return [result, null];
                }
                else {
                    return [null, result.message];
                }
            }
        }
        catch (e) {
            console.log(e);
        }

        return [null, "requestSettings 실패"];
    }

    static async requestSdmsCommonSettings(selectSiteNo) {
        try {
            const jsonData = JsonManager.makeRequestSdmsCommonSettings();

            const res = await fetch('Settings/Settings/RequestData', {
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
                    return [SettingController.makeSettingDatas(result.properties, selectSiteNo), null];
                }
                else {
                    return [null, result.message];
                }
            }
        }
        catch (e) {
            console.log(e);
        }

        return [null, "requestSdmsCommonSettings 실패"];
    }

    static async requestSopCommonSettings(selectSiteNo) {
        try {
            const jsonData = JsonManager.makeRequestSopCommonSettings();

            const res = await fetch('Settings/Settings/RequestData', {
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
                    return [SettingController.makeSettingDatas(result.properties, selectSiteNo), null];
                }
                else {
                    return [null, result.message];
                }
            }
        }
        catch (e) {
            console.log(e);
        }

        return [null, "requestSopCommonSettings 실패"];
    }

    static async requestAccountSettings(id) {
        try {
            const jsonData = JsonManager.makeRequestAccountSettings(id);

            const res = await fetch('Settings/Settings/RequestData', {
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
                    return [result, null];
                }
                else {
                    return [null, result.message];
                }
            }
        }
        catch (e) {
            console.log(e);
        }

        return [null, "requestAccountSettings 실패"];
    }

    static makeSettingDatas(properties, selectSiteNo) {
        const len = properties.length;
        const settings = {};

        for (let i = 0; i < len; i++) {
            const prop = properties[i];

            if (!selectSiteNo)
                settings[prop.name] = prop.value;
            else if (selectSiteNo === prop.site_sn)
                settings[prop.name] = prop.value;
        }

        return settings;
    }

    static async requestSaveSettings(saveData, site_sn) {
        try {
            const jsonData = JsonManager.makeSaveSettings(saveData, site_sn);

            const res = await fetch('Settings/Settings/RequestData', {
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
                    return [result.success, null];
                }
                else {
                    return [null, result.message];
                }
            }
        }
        catch (e) {
            console.log(e);
        }

        return [null, "requestSaveSettings 실패"];
    }

    static async requestSaveSetting(propertyName, propertyValue) {
        try {
            const res = await fetch('Settings/Settings/SaveSOPSetting', {
                method: 'post',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ PropertyName: propertyName, PropertyValue: propertyValue })
            });

            if (res.ok) {
                const result = await res.json();
                return result.success;
            }
        }
        catch (e) {
            console.log(e);
        }

        return [null, "requestSaveSettings 실패"];
    }

    static async requestUpdateSdmsSettings(settings) {
        try {
            const jsonData = JsonManager.makeUpdateSdmsSettings(settings);

            const res = await fetch('Settings/Settings/RequestData', {
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
                    return [result.success, null];
                }
                else {
                    return [null, result.message];
                }
            }
        }
        catch (e) {
            console.log(e);
        }

        return [null, "requestUpdateSdmsSettings 실패"];
    }

    static async requestResetPopup(id, popupState) {
        try {
            const jsonData = JsonManager.makeRequestResetPopup(id, popupState);

            const res = await fetch('Settings/Settings/RequestData', {
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
                    return [result.success, null];
                }
                else {
                    return [null, result.message];
                }
            }
        }
        catch (e) {
            console.log(e);
        }

        return [null, "requestResetPopup 실패"];
    }

    static async requestUploadBuildingFile(file) {
        try {
            const formData = new FormData();
            //formData.append('textFile', file);
            formData.append('files', file);

            const res = await fetch('Settings/Settings/UploadBuildingFile', {
                method: 'post',
                body: formData
            });

            if (res.ok) {
                const result = await res.json();

                if (result.success) {
                    return [result.success, ""];
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

    static async requestUploadBuildingGroupFile(file) {
        try {
            const formData = new FormData();
            //formData.append('textFile', file);
            formData.append('files', file);

            const res = await fetch('Settings/Settings/UploadBuildingGroupFile', {
                method: 'post',
                body: formData
            });

            if (res.ok) {
                const result = await res.json();

                if (result.success) {
                    return [result.success, ""];
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

    static async requestUploadFacilityFile(file) {
        try {
            const formData = new FormData();
            //formData.append('textFile', file);
            formData.append('files', file);

            const res = await fetch('Settings/Settings/UploadFacilityFile', {
                method: 'post',
                body: formData
            });

            if (res.ok) {
                const result = await res.json();

                if (result.success) {
                    return [result.success, ""];
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

    static async requestDownloadBuilding(selectedSiteNo) {
        try {
            const jsonData = JsonManager.makeRequestDownloadBuilding(selectedSiteNo);

            const res = await fetch('Settings/Settings/RequestData', {
                method: 'post',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                },
                body: jsonData
            });

            if (res.ok) {
                if (res.headers.get('content-type') === 'application/vnd.ms-excel') {
                    await SettingController.downloadFile(res);
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
        }
        catch (e) {
            console.log(e);
        }

        return [null, ""];
    }

    static async requestDownloadBuildingGroup(selectedSiteNo) {
        try {
            const jsonData = JsonManager.makeRequestDownloadBuildingGroup(selectedSiteNo);

            const res = await fetch('Settings/Settings/RequestData', {
                method: 'post',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                },
                body: jsonData
            });

            if (res.ok) {
                if (res.headers.get('content-type') === 'application/vnd.ms-excel') {
                    await SettingController.downloadFile(res);
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
        }
        catch (e) {
            console.log(e);
        }

        return [null, ""];
    }

    static async requestDownloadFacility(selectedSiteNo) {
        try {
            const jsonData = JsonManager.makeRequestDownloadFacility(selectedSiteNo);

            const res = await fetch('Settings/Settings/RequestData', {
                method: 'post',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                },
                body: jsonData
            });

            if (res.ok) {
                if (res.headers.get('content-type') === 'application/vnd.ms-excel') {
                    await SettingController.downloadFile(res);
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
        }
        catch (e) {
            console.log(e);
        }

        return [null, ""];
    }

    static async downloadFile(response) {
        const fileName = SettingController.getFileName(response);

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

    static async requestSetSpreadMessage(addSpread, updateSpread, deleteSpread) {
        try {
            const jsonData = JsonManager.makeRequestSetSpreadMessage(addSpread, updateSpread, deleteSpread);

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
                    return [result.success, null];
                }
                else {
                    return [null, result.message];
                }
            }
        }
        catch (e) {
            console.log(e);
        }

        return [null, "requestSetSpreadMessage 실패"];
    }

    static async requestSetAccoutPopup(id) {
        try {
            const jsonData = JsonManager.makeRequestSetAccoutPopup(id);

            const res = await fetch('Settings/Settings/RequestData', {
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
                    return [result.success, null];
                }
                else {
                    return [null, result.message];
                }
            }
        }
        catch (e) {
            console.log(e);
        }

        return [null, "requestSetAccoutPopup 실패"];
    }

    static async requestResetAccoutPopup(id) {
        try {
            const jsonData = JsonManager.makeRequestResetAccoutPopup(id);

            const res = await fetch('Settings/Settings/RequestData', {
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
                    return [result.accountPopups, null];
                }
                else {
                    return [null, result.message];
                }
            }
        }
        catch (e) {
            console.log(e);
        }

        return [null, "requestResetAccoutPopup 실패"];
    }



    static async requestOnOffBroadcast(onOff, buildingID) {
        try {
            const jsonData = JsonManager.makeRequestOnOffBroadcast(onOff, buildingID);

            const res = await fetch('Settings/Settings/RequestData', {
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
                    return [result.success, null];
                }
                else {
                    return [null, result.message];
                }
            }
        }
        catch (e) {
            console.log(e);
        }

        return [null, "requestUpdateSdmsSettings 실패"];
    }

    ////////////////////////////////////////////////////////////////////////////////////
    // categoryName : SOP, Etc, SDMS ...(생략시 모두 요청)
    // propertyName : 생략시 모두 요청
    static async requestSetting(siteNo, categoryName, propertyName) {
        try {
            const jsonData = JsonManager.makeRequestSetting(siteNo, categoryName, propertyName);

            const res = await fetch('api/Settings/RequestSetting', {
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
                    return [result.categories, null];
                }
                else {
                    return [null, result.message];
                }
            }
        }
        catch (e) {
            console.log(e);
        }

        return [null, "requestSetting 실패"];
    }

    static async requestSave(categories) {
        try {
            const jsonData = JsonManager.makeRequestSave(categories.categories);

            const res = await fetch('api/Settings/Save', {
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
                    return [result.success, null];
                }
                else {
                    return [null, result.message];
                }
            }
        }
        catch (e) {
            console.log(e);
        }

        return [null, "requestSave 실패"];
    }

    static async requestInitialize(siteNo) {
        try {
            const jsonData = JsonManager.makeRequestInitialize(siteNo);

            const res = await fetch('api/Settings/Initialize', {
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
                    return [result.success, null];
                }
                else {
                    return [null, result.message];
                }
            }
        }
        catch (e) {
            console.log(e);
        }

        return [null, "requestInitialize 실패"];
    }

    // useDetectType : 전파구분을 검색할 것인가?
    // useNotificationName : 전파관리명을 검색할 것인가?
    // useSensorType : 센서유형을 검색할 것인가?
    // useReceiver : 전파대상자를 검색할 것인가?
    // useActivate : 활성화여부를 검색할 것인가?
    // detectTypes : {300400: "센서탐지", 300401: "재난신고", 300402: "복구신호"}
    // activateText : "활성화", "Yes", "예", "네"
    // inactivateText : "비활성화", "No", "아니오"
    static makeSearchTextTypes(useDetectType, useNotificationName, useSensorType, useReceiver, useActivate, detectTypes = null, activateText = null, inactivateText = null) {
        let detectTypeList = [];

        for (const typeCode in detectTypes) {
            detectTypeList.push(typeCode.toString() + "_" + detectTypes[typeCode]);
        }

        return {
            "useDetectType": useDetectType,
            "useNotificationName": useNotificationName,
            "useSensorType": useSensorType,
            "useReceiver": useReceiver,
            "useActivate": useActivate,
            "detectTypes": detectTypeList,
            "activateText": activateText,
            "inactivateText": inactivateText
        };
    }

    // sensorType : -1이면 모든 타입
    // messageType : -1이면 모든 타입(400400 : 문자메시지, 400401 : 이메일)
    // detectType : -1이면 모든 타입(300400 : 센서탐지, 300401 : 재난신고, 300402 : 복구신호)
    // sensorTypeDatas : [{sensorTypeCode, sensorSubTypeNo, sensorTypeName}]
    // sortType : 정렬 기준 컬럼 선택값
    // sortMethod : 정렬 방향(true=ASC, false=DESC)
    // sample : [{"sensorTypeCode": 300300, "sensorSubTypeNo": 0, "sensorTypeName": '열'}, {"sensorTypeCode": 300300, "sensorSubTypeNo": 1, "sensorTypeName": '연기'}, {"sensorTypeCode": 300312, "sensorSubTypeNo": null, "sensorTypeName": '지진'}]
    static async requestGetSpreadMessage(sensorType = -1, sensorSubType = null, messageType = -1, detectType = -1, isActive = null, buildingGroupNo = null, buildingNo = null, zoneNo = null, searchText = null, pageIndex = null, pageItemCount = null, searchTextTypes = null, sensorTypeDatas = null, sortType = null, sortMethod = false) {
        try {
            const jsonData = JsonManager.makeRequestGetSpreadMessage(sensorType, sensorSubType, messageType, detectType, isActive, buildingGroupNo, buildingNo, zoneNo, searchText, pageIndex, pageItemCount, searchTextTypes, sensorTypeDatas, sortType, sortMethod);

            const res = await fetch('api/SDMS/RequestAlarmNotificationMessage', {
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
                    return [result.notifications, result.totalCount, null];
                }
                else {
                    return [null, null, result.message];
                }
            }
        }
        catch (e) {
            console.log(e);
        }

        return [null, null, "requestGetSpreadMessage 실패"];
    }

    // notificationNo : 신규등록이면 -1을 넣는다.
    // messageType : (400400 : 문자메시지, 400401 : 이메일)
    // detectType : (300400 : 센서탐지, 300401 : 재난신고, 300402 : 복구신호)
    static async requestSetSpreadMessage(notificationName, notifyMessage, sensorType, sensorSubType, messageType, detectType, isActive, notificationNo = -1, buildingGroupNo = null, buildingNo = null, zoneNo = null, regularNos = [], regularMemberNos = [], temporaryNos = [], temporaryMemberNos = []) {
        try {
            const jsonData = JsonManager.makeRequestSetSpreadMessage(notificationName, notifyMessage, sensorType, sensorSubType, messageType, detectType, isActive, notificationNo, buildingGroupNo, buildingNo, zoneNo, regularNos, regularMemberNos, temporaryNos, temporaryMemberNos);

            const res = await fetch('api/SDMS/RequestSaveAlarmNotificationMessage', {
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
                    return [result, null, null];
                }
                else {
                    return [null, result.errorCode, result.message];
                }
            }
        }
        catch (e) {
            console.log(e);
        }

        return [null, "requestSetSpreadMessage 실패"];
    }

    static async deleteSpreadMessage(notificationNo) {
        try {
            const jsonData = JsonManager.makeDeleteSpreadMessage(notificationNo);

            const res = await fetch('api/SDMS/RequestDeleteAlarmNotificationMessage', {
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
                    return [result.success, null];
                }
                else {
                    return [null, result.message];
                }
            }
        }
        catch (e) {
            console.log(e);
        }

        return [null, "deleteSpreadMessage 실패"];
    }
}
