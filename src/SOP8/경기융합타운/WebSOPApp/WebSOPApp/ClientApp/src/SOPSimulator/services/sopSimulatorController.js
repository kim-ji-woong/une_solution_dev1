import store from '../../Root/store';
import { SettingController } from '../../Settings/services/settingController';

export default class SopSimulatorController {
    static async DisplaySopRun() {
        try {
            const response = await fetch('SOPSimulator/SOPSimulator/DisplaySopRun', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json;charset=utf-8'
                }
            });

            if (response.ok && response.status !== 204) {
                const datas = await response.json();
                return datas;
            }
        } catch (e) {
            console.log(e);
        }
    }

    static async WatchSopRun() {
        let sopHistory = await SopSimulatorController.DisplaySopRun();
        
        // 현재
        //const storeState = store.getState();
        //if (storeState.actionType !== 'SOP_HISTORY') {
        //    return;
        //}
        let value = store.getState().sopHistory;
        let lastHistory = (!value) ? null : value.sopRunDatas;

        // 변경되었거나
        // 변경은 안되었지만 클라이언트가 처음 켜진 경우라서 data가 없을 때
        if (sopHistory?.changed ||
            (value && sopHistory?.nChanged !== value?.nChanged) ||
            (!sopHistory?.changed && lastHistory === null)) {
            // console.log('update sop history');
            store.dispatch({
                type: 'SOP_HISTORY',
                sopHistory: sopHistory
            });
        }
    }

    /*
    static async WatchCommonSettings() {
        const [settings, message] = await SettingController.requestSopCommonSettings();

        if (settings !== null) {
            store.dispatch({ type: 'SOP_COMMON_SETTINGS', sopCommonSettings: settings });
        }
    }
    */

    static StartWatchTimer() {
        // 타이머 실행 유무 판단
        if (this.timerCheck == true)
            return;

        // 타이머 실행 체크
        this.timerCheck = true;

        /*  SettingController 에서 일괄 관리
        SopSimulatorController.WatchCommonSettings();
        let timerWatchCommonSettings = setTimeout(function tick() {
            SopSimulatorController.WatchCommonSettings();
            timerWatchCommonSettings = setTimeout(tick, 1500);
        }, 1500);
        */

        let timerId = setTimeout(async function tick() {
            await SopSimulatorController.WatchSopRun();
            timerId = setTimeout(tick, 500);
        }, 500);
    }

    static async excuteSOP(beginDate, versionID, actionStepID, position, userID, sensorZoneHistoryID) {
        try {
            let ymdhms = '';
            if (beginDate !== null) {
                const y = beginDate.getFullYear();
                const m = beginDate.getMonth() + 1;
                const d = beginDate.getDate();
                const h = (beginDate.getHours() + 24) % 12
                const m2 = beginDate.getMinutes()

                ymdhms = y + "-" + m + "-" + d + " " + h + ":" + m2 + ":0";
            }

            const response = await fetch('SOPSimulator/SOPSimulator/ExcuteSOP', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json;charset=utf-8'
                },
                body: JSON.stringify({
                    strBeginTime: ymdhms,
                    VersionID: versionID,
                    ActionStepID: actionStepID,
                    Position: position,
                    LastAccessedUserID: userID,
                    SensorZoneHistoryID: sensorZoneHistoryID
                })
            });
            const actionStepHistoryID = await response.json();
            return actionStepHistoryID; // result : ActionStepHistory ID
        } catch (e) {
            console.log(e);
        }
    }

    static async closeSOP(actionStepHistoryID, endTime, accessedUserID) {
        try {
            const response = await fetch('SOPSimulator/SOPSimulator/CloseSOPByUser', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json;charset=utf-8'
                },
                body: JSON.stringify({ ActionStepHistoryID: actionStepHistoryID, EndTime:endTime, LastAccessedUserID: accessedUserID })
            });
        } catch (e) {
            console.log(e);
        }
    }

    static async progressSOP(actionStepHistoryID, componentID, componentType, accessedUserID, status, text) {
        try {
            const response = await fetch('SOPSimulator/SOPSimulator/ProgressSOP', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json;charset=utf-8'
                },
                body: JSON.stringify({
                    ActionStepHistoryID: actionStepHistoryID,
                    ComponentID: componentID,
                    ComponentType: componentType,
                    AccessedUserID: accessedUserID,
                    Status: status,
                    Text: text
                })
            });

            const history = await response.json();
            return history; // result : ComponentHistory
        } catch (e) {
            console.log(e);
        }
    }

    static async nextActionStep(sopKey, nextActionStepID, prevActionStepID, accessedUserID) {
        try {
            const response = await fetch('SOPSimulator/SOPSimulator/NextActionStep', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json;charset=utf-8'
                },
                body: JSON.stringify({
                    SopKey: sopKey,
                    nextActionStepID: nextActionStepID,
                    prevActionStepID: prevActionStepID,
                    AccessedUserID: accessedUserID
                })
            });

            const history = await response.json();
            return history; // result : ComponentHistory
        } catch (e) {
            console.log(e);
        }
    }

    static async runSection(sopKey, actionStepID, actionStepHistoryID, section, accessedUserID, decisionValue, isSkip) {
        try {
            if (!decisionValue)
                decisionValue = null;

            const response = await fetch('SOPSimulator/SOPSimulator/RunSection', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json;charset=utf-8'
                },
                body: JSON.stringify({
                    SopKey: sopKey,
                    ActionStepID: actionStepID,
                    ActionStepHistoryID: actionStepHistoryID,
                    ComponentID: section.id,
                    ComponentType: section.componentType,
                    AccessedUserID: accessedUserID,
                    DecisionValue: decisionValue,
                    Text: section.text,
                    Status: section.status,
                    Skip:isSkip
                })
            });

            const history = await response.json();
            return history; // result : ComponentHistory
        } catch (e) {
            console.log(e);
        }
    }

    static async monitorComponentHistory() {
        try {
            const response = await fetch('SOPSimulator/SOPSimulator/MonitorComponentHistory');
            const datas = await response.json();
            
            return datas;
        } catch (e) {
            console.log(e);
        }
    }

    static async progressMission(sopKey, actionStepHistoryID, componentType, componentID, dataIndex, componentStatus, userID, checked) {
        try {
            const response = await fetch('SOPSimulator/SOPSimulator/ProgressMission', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json;charset=utf-8'
                },
                body: JSON.stringify({
                    SopKey: sopKey,
                    ActionStepHistoryID: actionStepHistoryID,
                    ComponentType: componentType,
                    ComponentID: componentID,
                    DataIndex: dataIndex,
                    ComponentStatus: componentStatus,
                    AccessedUserID: userID,
                    Checked: checked
                })
            });

            const detail = await response.json();
            return detail; // result : ComponentHistoryDetail
        } catch (e) {
            console.log(e);
        }
    }

    static async progressSpread(sopKey, actionStepHistoryID, componentType, componentID, dataIndex, componentStatus, userID, isSMS, isEmail, isBroadcast, isSiren, message) {
        try {
            const response = await fetch('SOPSimulator/SOPSimulator/ProgressSpread', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json;charset=utf-8'
                },
                body: JSON.stringify({
                    SopKey: sopKey,
                    ActionStepHistoryID: actionStepHistoryID,
                    ComponentType: componentType,
                    ComponentID: componentID,
                    DataIndex: dataIndex,
                    ComponentStatus: componentStatus,
                    AccessedUserID: userID,
                    IsSMS: isSMS,                    
                    IsEmail: isEmail,
                    IsBroadcast: isBroadcast,
                    IsSiren: isSiren,
                    Message: message
                })
            });

            const detail = await response.json();
            return detail; // result : 
        } catch (e) {
            console.log(e);
        }
    }

    // 상황전파 컴포넌트 전파, 전파할 팀을 재선택 할수 있는 기능 추가
    static async progressInternalSpread(sopKey, actionStepHistoryID, componentType, componentID, dataIndex, componentStatus, userID, isSMS, isEmail, isBroadcast, isSiren, message, teams) {
        try {
            const response = await fetch('SOPSimulator/SOPSimulator/ProgressInternalSpread', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json;charset=utf-8'
                },
                body: JSON.stringify({
                    SopKey: sopKey,
                    ActionStepHistoryID: actionStepHistoryID,
                    ComponentType: componentType,
                    ComponentID: componentID,
                    DataIndex: dataIndex,
                    ComponentStatus: componentStatus,
                    AccessedUserID: userID,
                    IsSMS: isSMS,
                    IsEmail: isEmail,
                    IsBroadcast: isBroadcast,
                    IsSiren: isSiren,
                    Message: message,
                    Teams: teams
                })
            });

            const detail = await response.json();
            return detail; // result : 
        } catch (e) {
            console.log(e);
        }
    }

    static async excuteExternalProgram(sopKey, actionStepHistoryID, componentType, componentID, dataIndex, componentStatus, userID) {
        try {
            const response = await fetch('SOPSimulator/SOPSimulator/ExcuteExternalProgram', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json;charset=utf-8'
                },
                body: JSON.stringify({
                    SopKey: sopKey,
                    ActionStepHistoryID: actionStepHistoryID,
                    ComponentType: componentType,
                    ComponentID: componentID,
                    DataIndex: dataIndex,
                    ComponentStatus: componentStatus,
                    AccessedUserID: userID
                })
            });

            const detail = await response.json();
            return detail; // result : 
        } catch (e) {
            console.log(e);
        }
    }

    static async requestSensorName(sensorZoneHistoryID) {
        try {
            const response = await fetch('SOPSimulator/SOPSimulator/RequestSensorName', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json;charset=utf-8'
                },
                body: JSON.stringify({
                    SensorZoneHistoryID: sensorZoneHistoryID
                })
            });

            const value = await response.json();
            return value.sensorName; // result : Disaster ID
        } catch (e) {
            console.log(e);
        }
    }
}