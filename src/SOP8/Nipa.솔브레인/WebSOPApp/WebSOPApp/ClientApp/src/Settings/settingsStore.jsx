import { createStore } from 'redux';

export default createStore(function (state, action) {
    if (state === undefined) {
        return {
            shortcutKey: null,
            idleTime: null,
            moveDisplayAlarm: null,
            sdmsCommonSettings: null,
            sopCommonSettings: null,
            turnStart: null,
            useAlarmTurn: null,
            selectSiteNo: null,
        }
    }
    else if (action.type === 'SETTINGS') {
        return {
            shortcutKey: state.shortcutKey,
            idleTime: action.idleTime,
            moveDisplayAlarm: action.moveDisplayAlarm,
            sdmsCommonSettings: state.sdmsCommonSettings,
            sopCommonSettings: state.sopCommonSettings,
            turnStart: action.turnStart,
            useAlarmTurn: action.useAlarmTurn,
            selectSiteNo: state.selectSiteNo,
            actionType: action.type
        }
    }
    else if (action.type === 'SHORTCUT_KEY') {
        return {
            shortcutKey: action.shortcutKey,
            idleTime: state.idleTime,
            moveDisplayAlarm: state.moveDisplayAlarm,
            sdmsCommonSettings: state.sdmsCommonSettings,
            sopCommonSettings: state.sopCommonSettings,
            turnStart: state.turnStart,
            useAlarmTurn: state.useAlarmTurn,
            selectSiteNo: state.selectSiteNo,
            actionType: action.type
        }
    }
    else if (action.type === 'SDMS_COMMON_SETTINGS') {
        return {
            shortcutKey: state.shortcutKey,
            idleTime: state.idleTime,
            moveDisplayAlarm: state.moveDisplayAlarm,
            sdmsCommonSettings: action.sdmsCommonSettings,
            sopCommonSettings: state.sopCommonSettings,
            turnStart: state.turnStart,
            useAlarmTurn: state.useAlarmTurn,
            selectSiteNo: state.selectSiteNo,
            actionType: action.type
        }
    }
    else if (action.type === 'SOP_COMMON_SETTINGS') {
        return {
            shortcutKey: state.shortcutKey,
            idleTime: state.idleTime,
            moveDisplayAlarm: state.moveDisplayAlarm,
            sdmsCommonSettings: state.sdmsCommonSettings,
            sopCommonSettings: action.sopCommonSettings,
            turnStart: state.turnStart,
            useAlarmTurn: state.useAlarmTurn,
            selectSiteNo: state.selectSiteNo,
            actionType: action.type
        }
    }
    else if (action.type === 'SELECT_SITENO') {
        return {
            shortcutKey: state.shortcutKey,
            idleTime: state.idleTime,
            moveDisplayAlarm: state.moveDisplayAlarm,
            sdmsCommonSettings: state.sdmsCommonSettings,
            sopCommonSettings: state.sopCommonSettings,
            turnStart: state.turnStart,
            useAlarmTurn: state.useAlarmTurn,
            selectSiteNo: action.selectSiteNo,
            actionType: action.type
        }
    }
    else if (action.type === 'COMMON_SETTINGS') {
        return {
            shortcutKey: state.shortcutKey,
            idleTime: state.idleTime,
            moveDisplayAlarm: state.moveDisplayAlarm,
            sdmsCommonSettings: state.sdmsCommonSettings,
            sopCommonSettings: state.sopCommonSettings,
            turnStart: state.turnStart,
            useAlarmTurn: state.useAlarmTurn,
            selectSiteNo: state.selectSiteNo,
            commonSettings: action.commonSettings,
            actionType: action.type
        }
    }

    return state;
}, window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__())
