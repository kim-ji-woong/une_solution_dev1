import { createStore } from 'redux';

export default createStore(function (state, action) {
    if (state === undefined) {
        return {
            sensorAlarm: [],
            sensorAllAlarm: [],
            sensorCount: 0,
            sopHistory: null,
            weatherDatas: null,
            newCCTVList: [],
            rangeSensors: [],
            doorStatus: [],
            totalDoorStatus: {
                totalCloseDoorCount: 0,
                zones: []
            },
            comingHistory: null,
            areaComingHistory: null,
            lastComingPerson: null,
            parkingInfo: null,
            actionType: null
        }
    }
    else if (action.type === 'SENSOR_ALARM') { // 개수 제한한 알람 리스트
        return {
            ...state,
            sensorAlarm: action.sensorAlarm,
            sensorAllAlarm: action.sensorAllAlarm,
            actionType: action.type
        }
    }
    else if (action.type === 'SENSOR_COUNT') {
        return {
            ...state,
            sensorCount: action.sensorCount,
            actionType: action.type
        }
    }
    else if (action.type === 'SOP_HISTORY') {
        return {
            ...state,
            sopHistory: action.sopHistory,
            actionType: action.type
        }
    }
    else if (action.type === 'WEATHER_CURRENT') {
        return {
            ...state,
            weatherDatas: action.weatherDatas,
            actionType: action.type
        }
    }
    else if (action.type === 'NEW_CCTV_LIST') {
        return {
            ...state,
            newCCTVList: action.newCCTVList,
            actionType: action.type
        }
    }
    else if (action.type === 'RANGE_SENSORS') {
        // 센서 수치 현황
        return {
            ...state,
            rangeSensors: action.rangeSensors,
            actionType: action.type
        }
    }
    else if (action.type === 'DOOR_STATUS') {
        // 출입문 현황
        return {
            ...state,
            doorStatus: action.doorStatus,
            actionType: action.type
        }
    }
    else if (action.type === 'TOTAL_DOOR_STATUS') {
        // 미개방 출입문 현황
        return {
            ...state,
            totalDoorStatus: {
                totalCloseDoorCount: action.payload.totalCloseDoorCount,
                zones: action.payload.zones
            },
            actionType: action.type
        }
    }
    else if (action.type === 'COMING_HISTORY') {
        // 출입자 현황 : 건물 내부
        return {
            ...state,
            comingHistory: action.comingHistory,
            actionType: action.type
        }
    }
    else if (action.type === 'AREA_COMING_HISTORY') {
        // 출입자 현황 : 중요구역
        return {
            ...state,
            areaComingHistory: action.areaComingHistory,
            actionType: action.type
        }
    }
    else if (action.type === 'LAST_COMING_PERSON') {
        // 출입자 현황 : 마지막 출입자
        return {
            ...state,
            lastComingPerson: action.lastComingPerson,
            actionType: action.type
        }
    }
    else if (action.type === 'PARKING_INFO') {
        // 출입차량 현황
        return {
            ...state,
            parkingInfo: action.parkingInfo,
            actionType: action.type
        }
    }

    return state;
}, window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__())
