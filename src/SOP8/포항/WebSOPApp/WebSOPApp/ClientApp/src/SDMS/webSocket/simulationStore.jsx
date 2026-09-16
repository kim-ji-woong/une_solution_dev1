import {legacy_createStore as createStore} from "redux";

export default createStore(function(state = {}, action) {
    if (!state || state === {}) {
        return {
            hoursInfo: null,
            diffusionData: null,
            playEnd: false,
        }
    } else if (action.type === "HOURS_INFO") {
        return {
            hoursInfo: action.hoursInfo,
            diffusionData: state.diffusionData,
            playEnd: state.playEnd,
            actionType: action.type
        }
    } else if (action.type === "DIFFUSION_DATA") {
        return {
            hoursInfo: state.hoursInfo,
            diffusionData: action.diffusionData,
            playEnd: state.playEnd,
            actionType: action.type
        }
    } else if (action.type === "PLAY_END") {
        return {
            hoursInfo: state.hoursInfo,
            diffusionData: state.diffusionData,
            playEnd: action.playEnd,
            actionType: action.type
        }
    }
    
    return state;
}, window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__());