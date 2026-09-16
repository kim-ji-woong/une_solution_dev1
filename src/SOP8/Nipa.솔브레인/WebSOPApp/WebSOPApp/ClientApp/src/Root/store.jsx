import { createStore } from 'redux';

const SENSOR_ALARM_STORAGE_KEY = 'sdms.sensorAlarm';

function getTodayString() {
    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, '0');
    const day = String(now.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
}

function readPersistedSensorAlarm() {
    try {
        if (typeof window === 'undefined' || !window.localStorage) {
            return [];
        }

        const raw = window.localStorage.getItem(SENSOR_ALARM_STORAGE_KEY);
        if (!raw) {
            return [];
        }

        const parsed = JSON.parse(raw);
        if (parsed?.date !== getTodayString()) {
            return [];
        }

        return Array.isArray(parsed?.alarms) ? parsed.alarms : [];
    } catch (e) {
        console.warn('Failed to read persisted sensorAlarm:', e);
        return [];
    }
}

function persistSensorAlarm(sensorAlarm) {
    try {
        if (typeof window === 'undefined' || !window.localStorage) {
            return;
        }

        window.localStorage.setItem(SENSOR_ALARM_STORAGE_KEY, JSON.stringify({
            date: getTodayString(),
            alarms: Array.isArray(sensorAlarm) ? sensorAlarm : [],
        }));
    } catch (e) {
        console.warn('Failed to persist sensorAlarm:', e);
    }
}

export default createStore(function (state, action) {
    if (state === undefined) {
        return {
            sensorAlarm: readPersistedSensorAlarm(),
            sensorAllAlarm: [],
            rangeSensors: [],
            workers: null,
            scannerInfo: null
        }
    }
    else if (action.type === 'SENSOR_ALARM') {
        const nextSensorAlarm = Array.isArray(action.sensorAlarm) ? action.sensorAlarm : [];
        persistSensorAlarm(nextSensorAlarm);

        return {
            sensorAlarm: nextSensorAlarm,
            sensorAllAlarm: action.sensorAllAlarm,
            sensorCount: state.sensorCount,
            sopHistory: state.sopHistory,
            weatherDatas: state.weatherDatas,
            newCCTVList: state.newCCTVList,
            rangeSensors: state.rangeSensors,
            workers: state.workers,
            scannerInfo: state.scannerInfo,
            actionType: action.type
        }
    }
    else if (action.type === 'SENSOR_COUNT') {
        return {
            sensorAlarm: state.sensorAlarm,
            sensorAllAlarm: state.sensorAllAlarm,
            sensorCount: action.sensorCount,
            sopHistory: state.sopHistory,
            weatherDatas: state.weatherDatas,
            newCCTVList: state.newCCTVList,
            rangeSensors: state.rangeSensors,
            workers: state.workers,
            scannerInfo: state.scannerInfo,
            actionType: action.type
        }
    }
    else if (action.type === 'SOP_HISTORY') {
        return {
            sensorAlarm: state.sensorAlarm,
            sensorAllAlarm: state.sensorAllAlarm,
            sensorCount: state.sensorCount,
            sopHistory: action.sopHistory,
            weatherDatas: state.weatherDatas,
            newCCTVList: state.newCCTVList,
            rangeSensors: state.rangeSensors,
            workers: state.workers,
            scannerInfo: state.scannerInfo,
            actionType: action.type
        }
    }
    else if (action.type === 'WEATHER_CURRENT') {
        return {
            sensorAlarm: state.sensorAlarm,
            sensorAllAlarm: state.sensorAllAlarm,
            sensorCount: state.sensorCount,
            sopHistory: state.sopHistory,
            weatherDatas: action.weatherDatas,
            newCCTVList: state.newCCTVList,
            rangeSensors: state.rangeSensors,
            workers: state.workers,
            scannerInfo: state.scannerInfo,
            actionType: action.type
        }
    }
    else if (action.type === 'NEW_CCTV_LIST') {
        return {
            sensorAlarm: state.sensorAlarm,
            sensorAllAlarm: state.sensorAllAlarm,
            sensorCount: state.sensorCount,
            sopHistory: state.sopHistory,
            weatherDatas: state.weatherDatas,
            newCCTVList: action.newCCTVList,
            rangeSensors: state.rangeSensors,
            workers: state.workers,
            scannerInfo: state.scannerInfo,
            actionType: action.type
        }
    }
    else if (action.type === 'RANGE_SENSORS') {
        // 센서 수치 현황
        return {
            sensorAlarm: state.sensorAlarm,
            sensorAllAlarm: state.sensorAllAlarm,
            sensorCount: state.sensorCount,
            sopHistory: state.sopHistory,
            weatherDatas: state.weatherDatas,
            newCCTVList: state.newCCTVList,
            rangeSensors: action.rangeSensors,
            workers: state.workers,
            scannerInfo: state.scannerInfo,
            actionType: action.type
        }
    }
    else if (action.type === 'WORKERS') {
        // 인원 현황
        return {
            sensorAlarm: state.sensorAlarm,
            sensorAllAlarm: state.sensorAllAlarm,
            sensorCount: state.sensorCount,
            sopHistory: state.sopHistory,
            weatherDatas: state.weatherDatas,
            newCCTVList: state.newCCTVList,
            rangeSensors: state.rangeSensors,
            workers: action.workers,
            scannerInfo: state.scannerInfo,
            actionType: action.type
        }
    }
    else if (action.type === 'SCANNER_INFO') {
        // 인원 현황
        return {
            sensorAlarm: state.sensorAlarm,
            sensorAllAlarm: state.sensorAllAlarm,
            sensorCount: state.sensorCount,
            sopHistory: state.sopHistory,
            weatherDatas: state.weatherDatas,
            newCCTVList: state.newCCTVList,
            rangeSensors: state.rangeSensors,
            workers: state.workers,
            scannerInfo: action.scannerInfo,
            actionType: action.type
        }
    }

    return state;
}, window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__())
