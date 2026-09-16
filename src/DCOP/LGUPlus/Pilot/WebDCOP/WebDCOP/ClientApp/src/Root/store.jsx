import { createStore } from 'redux';

export default createStore(function (state, action) {
    if (state === undefined) {
        return {
            selectedDataCenter: {},
            weatherDatas: {},
            sensorAlarm: [],
        }
    }
    else if (action.type === 'SELECTED_DATA_CENTER') { // 선택된 국사
        return {
            selectedDataCenter: action.selectedDataCenter,
            weatherDatas: state.weatherDatas,
            sensorAlarm: state.sensorAlarm,
            actionType: action.type
        }
    }
    else if (action.type === 'WEATHER_CURRENT') {
        return {
            selectedDataCenter: state.selectedDataCenter,
            weatherDatas: action.weatherDatas,
            sensorAlarm: state.sensorAlarm,
            actionType: action.type
        }
    }
    else if (action.type === 'SENSOR_ALARM') {
        return {
            selectedDataCenter: state.selectedDataCenter,
            weatherDatas: state.weatherDatas,
            sensorAlarm: action.sensorAlarm,
            actionType: action.type
        }
    }

    return state;
}, window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__())