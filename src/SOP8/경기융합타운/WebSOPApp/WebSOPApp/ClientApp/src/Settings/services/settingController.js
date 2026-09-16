import JsonManager from "./jsonManager";
import SettingsStore from '../settingsStore';
import ProjectResource from '../../Root/resource/id';
//import { object } from "@amcharts/amcharts4/core";

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

        const [sdmsSettings, sdmsMessage] = await SettingController.reloadSdmsCommonSettings(selectSiteNo);

        const [sopSettings, sopMessage] = await SettingController.reloadSopCommonSettings(selectSiteNo);

        const [accountSettings, accountMessage] = await SettingController.reloadAccountSettings(selectSiteNo);
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

        const userID = userInfo.id;

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

    static async requestSettings(userID, siteNo) {
        try {
            const jsonData = JsonManager.makeRequestSettings(userID, siteNo);

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
            else if (selectSiteNo === prop.siteNo)
                settings[prop.name] = prop.value;
        }

        return settings;
    }

    static async requestSaveSettings(saveData, siteNo) {
        try {
            const jsonData = JsonManager.makeSaveSettings(saveData, siteNo);

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

    static async requestUploadRegularTeamFile(file, selectedSiteNo) {
        try {
            const formData = new FormData();
            //formData.append('textFile', file);
            formData.append('files', file);
            formData.append('siteNo', selectedSiteNo);

            const res = await fetch('Settings/Settings/UploadRegularTeam', {
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

    static async requestDownloadRegularTeam(selectedSiteNo) {
        try {
            const jsonData = JsonManager.makeRequestDownloadRegularTeam(selectedSiteNo);

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

    static async requestGetSpreadMessage() {
        try {
            const jsonData = JsonManager.makeRequestGetSpreadMessage();

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
                    return [result.spreadMessages, null];
                }
                else {
                    return [null, result.message];
                }
            }
        }
        catch (e) {
            console.log(e);
        }

        return [null, "requestGetSpreadMessage 실패"];
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
}
