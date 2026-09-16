import { legacy_createStore as createStore } from 'redux';

export default createStore(function (state, action) {
    if (state === undefined) {
        return {
            sensorAlarm: [],
            sensorList: [],
            sensorCategory: [],
            sensorTypes: [],
            sensorLinks: [],
            materialLinks: [],
            sensorSubTypes: [],
            poiInfo: [],
            sopHistory: [],
            spreadAlarm: null
        }
    } else if (action.type === 'SENSOR_LIST') {
        return {
            sensorAlarm: state.sensorAlarm,
            sensorList: action.sensorList,
            sensorCategory: state.sensorCategory,
            sensorTypes: state.sensorTypes,
            sensorLinks: state.sensorLinks,
            materialLinks: state.materialLinks,
            sensorSubTypes: state.sensorSubTypes,
            poiInfo: state.poiInfo,
            sopHistory: state.sopHistory,
            actionType: action.type
        }
    } else if (action.type === 'SENSOR_CATEGORY') {
        return {
            sensorAlarm: state.sensorAlarm,
            sensorList: state.sensorList,
            sensorCategory: action.sensorCategory,
            sensorTypes: state.sensorTypes,
            sensorLinks: state.sensorLinks,
            materialLinks: state.materialLinks,
            sensorSubTypes: state.sensorSubTypes,
            poiInfo: state.poiInfo,
            sopHistory: state.sopHistory,
            actionType: action.type
        }
    } else if (action.type === 'SENSOR_TYPES') {
        return {
            sensorAlarm: state.sensorAlarm,
            sensorList: state.sensorList,
            sensorCategory: state.sensorCategory,
            sensorTypes: action.sensorTypes,
            sensorLinks: state.sensorLinks,
            materialLinks: state.materialLinks,
            sensorSubTypes: state.sensorSubTypes,
            poiInfo: state.poiInfo,
            sopHistory: state.sopHistory,
            actionType: action.type
        }
    } else if (action.type === 'SENSOR_LINKS') {
        return {
            sensorAlarm: state.sensorAlarm,
            sensorList: state.sensorList,
            sensorCategory: state.sensorCategory,
            sensorTypes: state.sensorTypes,
            sensorLinks: action.sensorLinks,
            materialLinks: state.materialLinks,
            sensorSubTypes: state.sensorSubTypes,
            poiInfo: state.poiInfo,
            sopHistory: state.sopHistory,
            actionType: action.type
        }
    } else if (action.type === 'POI_INFO') {
        return {
            sensorAlarm: state.sensorAlarm,
            sensorList: state.sensorList,
            sensorCategory: state.sensorCategory,
            sensorTypes: state.sensorTypes,
            sensorLinks: state.sensorLinks,
            materialLinks: state.materialLinks,
            sensorSubTypes: state.sensorSubTypes,
            poiInfo: action.poiInfo,
            sopHistory: state.sopHistory,
            actionType: action.type
        }
    } else if (action.type === 'SENSOR_ALARM') { // 개수 제한한 알람 리스트
        return {
            sensorAlarm: action.sensorAlarm,
            spreadAlarm: action.spreadAlarm,
            sensorCount: state.sensorCount,
            sopHistory: state.sopHistory,
            weatherDatas: state.weatherDatas,
            newCCTVList: state.newCCTVList,
            rangeSensors: state.rangeSensors,
            workerInfos: state.workerInfos,
            sensorList: state.sensorList,
            sensorCategory: state.sensorCategory,
            sensorTypes: state.sensorTypes,
            sensorLinks: state.sensorLinks,
            materialLinks: state.materialLinks,
            sensorSubTypes: state.sensorSubTypes,
            poiInfo: state.poiInfo,
            actionType: action.type
        }
    }
    else if (action.type === 'SENSOR_COUNT') {
        return {
            sensorAlarm: state.sensorAlarm,
            sensorCount: action.sensorCount,
            sopHistory: state.sopHistory,
            weatherDatas: state.weatherDatas,
            newCCTVList: state.newCCTVList,
            rangeSensors: state.rangeSensors,
            workerInfos: state.workerInfos,
            sensorList: state.sensorList,
            sensorCategory: state.sensorCategory,
            sensorTypes: state.sensorTypes,
            sensorLinks: state.sensorLinks,
            materialLinks: state.materialLinks,
            sensorSubTypes: state.sensorSubTypes,
            poiInfo: state.poiInfo,
            actionType: action.type
        }
    }
    else if (action.type === 'SOP_HISTORY') {
        return {
            sensorAlarm: state.sensorAlarm,
            sensorCount: state.sensorCount,
            sopHistory: action.sopHistory,
            weatherDatas: state.weatherDatas,
            newCCTVList: state.newCCTVList,
            rangeSensors: state.rangeSensors,
            workerInfos: state.workerInfos,
            sensorList: state.sensorList,
            sensorCategory: state.sensorCategory,
            sensorTypes: state.sensorTypes,
            sensorLinks: state.sensorLinks,
            materialLinks: state.materialLinks,
            sensorSubTypes: state.sensorSubTypes,
            actionType: action.type
        }
    }
    else if (action.type === 'WEATHER_CURRENT') {
        return {
            sensorAlarm: state.sensorAlarm,
            sensorCount: state.sensorCount,
            sopHistory: state.sopHistory,
            weatherDatas: action.weatherDatas,
            newCCTVList: state.newCCTVList,
            rangeSensors: state.rangeSensors,
            workerInfos: state.workerInfos,
            sensorList: state.sensorList,
            sensorCategory: state.sensorCategory,
            sensorTypes: state.sensorTypes,
            sensorLinks: state.sensorLinks,
            materialLinks: state.materialLinks,
            sensorSubTypes: state.sensorSubTypes,
            poiInfo: state.poiInfo,
            actionType: action.type
        }
    }
    else if (action.type === 'NEW_CCTV_LIST') {
        return {
            sensorAlarm: state.sensorAlarm,
            sensorCount: state.sensorCount,
            sopHistory: state.sopHistory,
            weatherDatas: state.weatherDatas,
            newCCTVList: action.newCCTVList,
            rangeSensors: state.rangeSensors,
            workerInfos: state.workerInfos,
            sensorList: state.sensorList,
            sensorCategory: state.sensorCategory,
            sensorTypes: state.sensorTypes,
            sensorLinks: state.sensorLinks,
            materialLinks: state.materialLinks,
            sensorSubTypes: state.sensorSubTypes,
            poiInfo: state.poiInfo,
            actionType: action.type
        }
    }
    else if (action.type === 'RANGE_SENSORS') {
        // 센서 수치 현황
        return {
            sensorAlarm: state.sensorAlarm,
            sensorCount: state.sensorCount,
            sopHistory: state.sopHistory,
            weatherDatas: state.weatherDatas,
            newCCTVList: state.newCCTVList,
            rangeSensors: action.rangeSensors,
            workerInfos: state.workerInfos,
            sensorList: state.sensorList,
            sensorCategory: state.sensorCategory,
            sensorTypes: state.sensorTypes,
            sensorLinks: state.sensorLinks,
            materialLinks: state.materialLinks,
            sensorSubTypes: state.sensorSubTypes,
            actionType: action.type
        }
    }
    else if (action.type === 'WORKER_INFOS') {
        // 인원 현황
        return {
            sensorAlarm: state.sensorAlarm,
            sensorCount: state.sensorCount,
            sopHistory: state.sopHistory,
            weatherDatas: state.weatherDatas,
            newCCTVList: state.newCCTVList,
            rangeSensors: state.rangeSensors,
            workerInfos: action.workerInfos,
            sensorList: state.sensorList,
            sensorCategory: state.sensorCategory,
            sensorTypes: state.sensorTypes,
            sensorLinks: state.sensorLinks,
            materialLinks: state.materialLinks,
            sensorSubTypes: state.sensorSubTypes,
            poiInfo: state.poiInfo,
            actionType: action.type
        }
    } else if (action.type === 'SENSOR_SUB_TYPES') {
        return {
            sensorAlarm: state.sensorAlarm,
            sensorList: state.sensorList,
            sensorCategory: state.sensorCategory,
            sensorTypes: state.sensorTypes,
            sensorLinks: state.sensorLinks,
            materialLinks: state.materialLinks,
            poiInfo: state.poiInfo,
            sopHistory: state.sopHistory,
            sensorSubTypes: action.sensorSubTypes,
            actionType: action.type
        }
    } else if (action.type === 'EXTERNAL_MATERIAL_LINKS') {
        return {
            sensorAlarm: state.sensorAlarm,
            sensorList: state.sensorList,
            sensorCategory: state.sensorCategory,
            sensorTypes: state.sensorTypes,
            sensorLinks: state.sensorLinks,
            materialLinks: action.materialLinks,
            poiInfo: state.poiInfo,
            sopHistory: state.sopHistory,
            sensorSubTypes: state.sensorSubTypes,
        }
    }

    return state;
}, window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__())
