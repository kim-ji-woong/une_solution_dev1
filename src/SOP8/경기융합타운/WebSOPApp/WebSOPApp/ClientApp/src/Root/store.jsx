import { createStore } from 'redux';

export default createStore(function (state, action) {
    if (state === undefined) {
        return {
            sensorAlarm: [],
            sensorAllAlarm: [],
            rangeSensors: [],
            workerInfos: null,
            elevatorDatas: [],
        }
    }
    else if (action.type === 'SENSOR_ALARM') { // 개수 제한한 알람 리스트
        return {
            sensorAlarm: action.sensorAlarm,
            sensorAllAlarm: action.sensorAllAlarm,
            sensorCount: state.sensorCount,
            sopHistory: state.sopHistory,
            weatherDatas: state.weatherDatas,
            newCCTVList: state.newCCTVList,
            rangeSensors: state.rangeSensors,
            workerInfos: state.workerInfos,
            cctvAllList: state.cctvAllList,
            elevatorDatas: state.elevatorDatas,
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
            workerInfos: state.workerInfos,
            cctvAllList: state.cctvAllList,
            elevatorDatas: state.elevatorDatas,
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
            workerInfos: state.workerInfos,
            cctvAllList: state.cctvAllList,
            elevatorDatas: state.elevatorDatas,
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
            workerInfos: state.workerInfos,
            cctvAllList: state.cctvAllList,
            elevatorDatas: state.elevatorDatas,
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
            workerInfos: state.workerInfos,
            cctvAllList: action.cctvAllList,
            elevatorDatas: state.elevatorDatas,
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
            workerInfos: state.workerInfos,
            cctvAllList: state.cctvAllList,
            elevatorDatas: state.elevatorDatas,
            actionType: action.type
        }
    }
    else if (action.type === 'WORKER_INFOS') {
        // 인원 현황
        return {
            sensorAlarm: state.sensorAlarm,
            sensorAllAlarm: state.sensorAllAlarm,
            sensorCount: state.sensorCount,
            sopHistory: state.sopHistory,
            weatherDatas: state.weatherDatas,
            newCCTVList: state.newCCTVList,
            rangeSensors: state.rangeSensors,
            workerInfos: action.workerInfos,
            cctvAllList: state.cctvAllList,
            elevatorDatas: state.elevatorDatas,
            actionType: action.type
        }
    }
    else if (action.type === 'ELEVATOR_INFOS') {
        // 엘리베이터 정보
        return {
            sensorAlarm: state.sensorAlarm,
            sensorAllAlarm: state.sensorAllAlarm,
            sensorCount: state.sensorCount,
            sopHistory: state.sopHistory,
            weatherDatas: state.weatherDatas,
            newCCTVList: state.newCCTVList,
            rangeSensors: state.rangeSensors,
            workerInfos: state.workerInfos,
            cctvAllList: state.cctvAllList,
            elevatorDatas: action.elevatorDatas,
            actionType: action.type
        }
    }

    return state;
}, window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__())