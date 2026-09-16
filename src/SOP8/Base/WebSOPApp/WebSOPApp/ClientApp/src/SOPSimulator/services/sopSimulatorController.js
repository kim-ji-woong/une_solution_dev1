import ProjectResource from '../../Root/resource/id';
import store from '../../Root/store';
import { SettingController } from '../../Settings/services/settingController';
import SopController from '../../SOPManager/services/sopController';
import { SopSimulatorJsonManager } from './sopSimulatorJsonManager';

export default class SopSimulatorController {
    static timerCheck = false;
    static timer = 0;
    
    static isFirstRender = true; 
    static componentHistoryDatas = null;
    static allChartDatas = null;
    static sopHistoryOriginal = null;

    static async WatchSopRun() {
        const userInfo = ProjectResource?.getUserInfo();

        if (userInfo) {
            if (this.isFirstRender) {
                // const [sopDataResult] = await SopController.requestOpenDB(2701);
                const [sopAllDatas, message] = await SopController.requestOpenAll(userInfo.site_sn);

                if (sopAllDatas && sopAllDatas.success) {
                    // 클라이언트가 처음 켜진 경우라서 data가 없을 때
                    console.log('First update sop history');
                    
                    // 전체 Chart Data 저장
                    this.allChartDatas = sopAllDatas.disasterCategories;

                    let [success, message, _sopHistory] = await SopSimulatorController.displaySopRun(userInfo.site_sn, userInfo.user_sn, null);

                    if (success) {
                        this.sopHistoryOriginal = _sopHistory;
                        // this.setComponentHistoryDatas(_sopHistory?.actionStepHistoryDatas);
                        const sopHistory = await this.setStepMemberDatas(_sopHistory);

                        store.dispatch({
                            type: 'SOP_HISTORY',
                            sopHistory: sopHistory
                        });
                    }
                    else {
                        console.log(message);
                    }

                    this.isFirstRender = false;
                } else {
                    console.log(message);
                }
            }
            else {
                let [success, message, _sopHistory] = await SopSimulatorController.displaySopRun(userInfo.site_sn, userInfo.user_sn, this.componentHistoryDatas);
    
                if (success) {
                    const currentSopHistory = this.sopHistoryOriginal;
                    // 변경된 sop 실행 데이터가 있는지 확인
                    const isChanged = this.checkChangedSopDatas(currentSopHistory, _sopHistory);

                    if (isChanged) {
                        console.log('update sop history');

                        this.sopHistoryOriginal = _sopHistory;
                        const sopHistory = await this.setStepMemberDatas(_sopHistory);

                        store.dispatch({
                            type: 'SOP_HISTORY',
                            sopHistory: sopHistory,
                        });
                    }
                }
                else {
                    console.log(message);
                }
            }
        }
    }

    static checkChangedSopDatas = (currentSopHistory, newSopHistory) => {
        if (currentSopHistory.lastAccessActionStepHistoryNo !== newSopHistory.lastAccessActionStepHistoryNo) {
            return true;
        }

        const currentData = currentSopHistory.actionStepHistoryDatas;
        const newData = newSopHistory.actionStepHistoryDatas;

        if (currentData.length !== newData.length) {
            return true;
        }

        // 데이터 비교
        for (let i = 0; i < currentData.length; i++) {
            const currentActionSteps = currentData[i].actionStepDatas;
            const newActionSteps = newData[i]?.actionStepDatas;

            if (currentActionSteps.length !== newActionSteps.length) {
                return true;
            }

            for (let j = 0; j < currentActionSteps.length; j++) {
                const currentComponents = currentActionSteps[j].componentHistories;
                const newComponents = newActionSteps[j].componentHistories;

                if (currentComponents.length !== newComponents.length) {
                    return true;
                }

                if (currentActionSteps[j].actionStepHistory && newActionSteps[j].actionStepHistory.end_time !== null) { // 종료
                    return true;
                }

                // 개별 컴포넌트 비교
                for (let k = 0; k < currentComponents.length; k++) {
                    const currentComp = currentComponents[k];
                    const newComp = newComponents[k];

                    if (
                        currentComp.compn_code !== newComp.compn_code ||
                        currentComp.compn_hist_sn !== newComp.compn_hist_sn ||
                        currentComp.compn_sn !== newComp.compn_sn ||
                        currentComp.time !== newComp.time ||
                        currentComp.sop_sttus_code !== newComp.sop_sttus_code ||
                        currentComp.compt_cnt !== newComp.compt_cnt ||
                        currentComp.user_sn !== newComp.user_sn ||
                        currentComp.descp !== newComp.descp
                    ) {
                        return true;
                    }
                }
            }
        }

        return false;
    }

    static setStepMemberDatas = async (sopHistoryDatas) => {
        if (sopHistoryDatas && sopHistoryDatas.actionStepHistoryDatas.length > 0) {

            for (const actionStepHistory of sopHistoryDatas.actionStepHistoryDatas) {
                // actionStepHistory : 실행중인 SOP 임무
                let sclas_sn = null;

                for (let i = 0; i < actionStepHistory.actionStepDatas.length; i++) {
                    // actionStep : 관심, 주의, 경계, 심각 (Array4)
                    const actionStep = actionStepHistory.actionStepDatas[i];

                    if (actionStep.actionStep) {
                        sclas_sn = actionStep.actionStep.sclas_sn;
                    }
                }

                await this.getStepMemberDatas(sclas_sn, actionStepHistory);
            }

            return sopHistoryDatas;
        }
        else {
            return sopHistoryDatas;
        }
    }

    static getStepMemberDatas = async (sclassNo, actionStepHistory) => {
        const allChartDatas = JSON.parse(JSON.stringify(this.allChartDatas));

        if (allChartDatas && allChartDatas.length > 0) {

            for (const disasterCategory of allChartDatas) {
                for (const subDisasterCategory of disasterCategory.subDisasterCategories) {
                    for (const sopData of subDisasterCategory.sopDatas) {
                        
                        if (sopData.disaster.sclas_sn === sclassNo) {
                            SopSimulatorController.setActionStepHistory(sopData, actionStepHistory);
                            /*const actionStepDatas = sopData.actionStepDatas;
                            actionStepHistory.key = '';
                            actionStepHistory.disaster = sopData.disaster;
                            actionStepHistory.disasterCategory = sopData.disasterCategory;
                            actionStepHistory.subDisasterCategory = sopData.subDisasterCategory;
                            actionStepHistory.version = sopData.version;

                            for (let i = 0; i < actionStepHistory.actionStepDatas.length; i++) {
                                const actionStep = actionStepHistory.actionStepDatas[i];
                                actionStep.stepMemberDatas = actionStepDatas[i].stepMemberDatas;

                                if (actionStep.sopKey.length > 0) {
                                    actionStepHistory.key = actionStep.sopKey;
                                }
                            }*/

                            return actionStepHistory;
                        }
                    }
                }
            }

            const [sopDataResult, message] = await SopController.requestOpenDB(sclassNo);

            if (sopDataResult?.sopData?.disaster?.sclas_sn === sclassNo) {
                SopSimulatorController.setActionStepHistory(sopDataResult.sopData, actionStepHistory);
            }
        }

        return actionStepHistory;
    }

    static setActionStepHistory(sopData, actionStepHistory) {
        const actionStepDatas = sopData.actionStepDatas;

        actionStepHistory.key = '';
        actionStepHistory.disaster = sopData.disaster;
        actionStepHistory.disasterCategory = sopData.disasterCategory;
        actionStepHistory.subDisasterCategory = sopData.subDisasterCategory;
        actionStepHistory.version = sopData.version;

        for (let i = 0; i < actionStepHistory.actionStepDatas.length; i++) {
            const actionStep = actionStepHistory.actionStepDatas[i];
            actionStep.stepMemberDatas = actionStepDatas[i].stepMemberDatas;

            if (actionStep.sopKey.length > 0) {
                actionStepHistory.key = actionStep.sopKey;
            }
        }
    }
    

    static setComponentHistoryDatas = (actionStepHistoryDatas) => {
        let datas = [];

        for (let actionStepDatas of actionStepHistoryDatas) {

            const componentHistory = actionStepDatas.componentHistories;
            let componentHistoryDatas = {};

            if (componentHistory.length > 0) {
                componentHistoryDatas = {
                    actionStepHistoryNo: componentHistory[componentHistory.length - 1].action_step_hist_sn,
                    lastComponentHistoryNo: componentHistory[componentHistory.length - 1].compn_hist_sn,
                }
            }
            else {
                componentHistoryDatas = {
                    actionStepHistoryNo: actionStepDatas.actionStepHistory.action_step_hist_sn,
                    lastComponentHistoryNo: null
                }
            }
        
            datas.push(componentHistoryDatas);
        }

        this.componentHistoryDatas = datas;
    }

    static StartWatchTimer() {
        // 타이머 실행 유무 판단
        if (this.timerCheck == true)
            return;

        // 타이머 실행 체크
        this.timerCheck = true;

        SopSimulatorController.timer = setTimeout(async function tick() {
            await SopSimulatorController.WatchSopRun();
            SopSimulatorController.timer = setTimeout(tick, 500);
        }, 500);
    }

    static stopWatchTimer() {
        SopSimulatorController.timerCheck = false;

        if (SopSimulatorController.timer > 0) {
            clearTimeout(SopSimulatorController.timer);
            SopSimulatorController.timer = 0;
            this.isFirstRender = true;
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

    static async progressSpread(sopKey, actionStepHistoryID, componentType, componentID, dataIndex, componentStatus, userID, useSMS, useEmail, useBroadcast, useSiren, message) {
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
                    UseSMS: useSMS,                    
                    UseEmail: useEmail,
                    UseBroadcast: useBroadcast,
                    UseSiren: useSiren,
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
    static async progressInternalSpread(sopKey, actionStepHistoryID, componentType, componentID, dataIndex, componentStatus, userID, useSMS, useEmail, useBroadcast, useSiren, message, teams) {
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
                    UseSMS: useSMS,
                    UseEmail: useEmail,
                    UseBroadcast: useBroadcast,
                    UseSiren: useSiren,
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

    // companentHistoryDatas : [{actionStepHistoryNo(not null), lastComponentHistoryNo(nullable)}]
    static async displaySopRun(siteNo, userNo, componentHistoryDatas) {
        try {
            const jsonData = SopSimulatorJsonManager.makeDisplaySopRun(siteNo, userNo, componentHistoryDatas);

            const response = await fetch('api/SOPSimulator/DisplaySopRun', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json;charset=utf-8'
                },
                body: jsonData
            });

            if (response.ok) {
                const datas = await response.json();
                return [datas.success, datas.message, datas];
            }
        } catch (e) {
            console.log(e);
            return [false, e.message, null];
        }

        return [false, "displaySopRun 호출에 실패하였습니다.", null];
    }

    /**
     * beginTime -> null : 현재 시간을 사용 / Null이 아니면 : 입력된 시간으로 sop 시작시간이 결정
     */
    static async excuteSOP(smallClassNo, actionStepNo, userNo, position = null, beginTime = null, sensorZoneHistoryNo = null) {
        try {
            const jsonData = SopSimulatorJsonManager.makeExcuteSOP(smallClassNo, actionStepNo, userNo, position, beginTime, sensorZoneHistoryNo);

            const response = await fetch('api/SOPSimulator/ExcuteSOP', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json;charset=utf-8'
                },
                body: jsonData
            });

            if (response.ok) {
                const datas = await response.json();
                return [datas.success, datas.message, datas.actionStepHistoryNo];
            }
        } catch (e) {
            console.log(e);
            return [false, e.message, null];
        }

        return [false, "excuteSOP 호출에 실패하였습니다.", null];
    }

    // endTime : null이면 현재 시간으로 종료
    static async closeSOPByUser(actionStepHistoryNo, endTime = null, userNo = null) {
        try {
            const jsonData = SopSimulatorJsonManager.makeCloseSOPByUser(actionStepHistoryNo, endTime, userNo);

            const response = await fetch('api/SOPSimulator/CloseSOPByUser', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json;charset=utf-8'
                },
                body: jsonData
            });

            if (response.ok) {
                const datas = await response.json();
                return [datas.success, datas.message, datas];
            }
        } catch (e) {
            console.log(e);
            return [false, e.message, null];
        }

        return [false, "closeSOPByUser 호출에 실패하였습니다.", null];
    }

    static async nextActionStep(largeClassNo, middleClassNo, smallClassNo, nextActionStepNo, currentActionStepNo, userNo, sensorZoneHistoryNo = null) {
        try {
            const jsonData = SopSimulatorJsonManager.makeNextActionStep(largeClassNo, middleClassNo, smallClassNo, nextActionStepNo, currentActionStepNo, userNo, sensorZoneHistoryNo);

            const response = await fetch('api/SOPSimulator/NextActionStep', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json;charset=utf-8'
                },
                body: jsonData
            });

            if (response.ok) {
                const datas = await response.json();
                return [datas.success, datas.message, datas];
            }
        } catch (e) {
            console.log(e);
            return [false, e.message, null];
        }

        return [false, "nextActionStep 호출에 실패하였습니다.", null];
    }

    static async runSection(actionStepNo, actionStepHistoryNo, componentNo, componentType, accessedUserNo, sensorZoneHistoryNo = null, decisionValue = null) {
        try {
            const jsonData = SopSimulatorJsonManager.makeRunSection(actionStepNo, actionStepHistoryNo, componentNo, componentType, accessedUserNo, sensorZoneHistoryNo, decisionValue);

            const response = await fetch('api/SOPSimulator/RunSection', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json;charset=utf-8'
                },
                body: jsonData
            });

            if (response.ok) {
                const datas = await response.json();
                return [datas.success, datas.message, datas];
            }
        } catch (e) {
            console.log(e);
            return [false, e.message, null];
        }

        return [false, "runSection 호출에 실패하였습니다.", null];
    }

    static async setCurrentSection(actionStepNo, actionStepHistoryNo, componentNo, componentType, accessedUserNo, sensorZoneHistoryNo = null, decisionValue = null) {
        try {
            const jsonData = SopSimulatorJsonManager.makeSetCurrentSection(actionStepNo, actionStepHistoryNo, componentNo, componentType, accessedUserNo, sensorZoneHistoryNo, decisionValue);

            const response = await fetch('api/SOPSimulator/SetCurrentSection', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json;charset=utf-8'
                },
                body: jsonData
            });

            if (response.ok) {
                const datas = await response.json();
                return [datas.success, datas.message, datas];
            }
        } catch (e) {
            console.log(e);
            return [false, e.message, null];
        }

        return [false, "setCurrentSection 호출에 실패하였습니다.", null];
    }

    static async getComponentHistory(actionStepHistoryNo, lastComponentHistoryNo) {
        try {
            const jsonData = SopSimulatorJsonManager.makeGetComponentHistory(actionStepHistoryNo, lastComponentHistoryNo);

            const response = await fetch('api/SOPSimulator/GetComponentHistory', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json;charset=utf-8'
                },
                body: jsonData
            });

            if (response.ok) {
                const datas = await response.json();
                return [datas.success, datas.message, datas];
            }
        } catch (e) {
            console.log(e);
            return [false, e.message, null];
        }

        return [false, "getComponentHistory 호출에 실패하였습니다.", null];
    }

    static async progressMission(actionStepHistoryNo, actionStepNo, componentNo, componentType, dataIndex, componentStatus, userNo, checked) {
        try {
            const jsonData = SopSimulatorJsonManager.makeProgressMission(actionStepHistoryNo, actionStepNo, componentNo, componentType, dataIndex, componentStatus, userNo, checked);

            const response = await fetch('api/SOPSimulator/ProgressMission', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json;charset=utf-8'
                },
                body: jsonData
            });

            if (response.ok) {
                const datas = await response.json();
                return [datas.success, datas.message, datas];
            }
        } catch (e) {
            console.log(e);
            return [false, e.message, null];
        }

        return [false, "progressMission 호출에 실패하였습니다.", null];
    }

    static async sendMessage(actionStepHistoryNo, componentNo, componentType, userNo, useSMS, useEmail, useBroadcast, useSiren, message, receivers, siteNo) {
        try {
            const jsonData = SopSimulatorJsonManager.makeSendMessage(actionStepHistoryNo, componentNo, componentType, userNo, useSMS, useEmail, useBroadcast, useSiren, message, receivers, siteNo);

            const response = await fetch('api/SOPSimulator/SendMessage', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json;charset=utf-8'
                },
                body: jsonData
            });

            if (response.ok) {
                const datas = await response.json();
                return [datas.success, datas.message];
            }
        } catch (e) {
            console.log(e);
            return [false, e.message, null];
        }

        return [false, "sendMessage 호출에 실패하였습니다.", null];
    }
}