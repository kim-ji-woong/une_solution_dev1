import { legacy_createStore as createStore } from "redux";

export default createStore(function (state = {}, action) {
    
    if (!state || state === {}) {
        return {
            wsMgr: null, 
            wsProcessManager: null,
            measurementResult: null,
        }
    } else if (action.type === "WS_MANAGER") {
        return {
            wsMgr: action.wsMgr,
            wsProcessManager: state.wsProcessManager,
            measurementResult: state.measurementResult,
            actionType: action.type
        }
    } else if (action.type === "PROCESS_MANAGER") {
        return {
            wsMgr: state.wsMgr,
            wsProcessManager: action.wsProcessManager,
            measurementResult: state.measurementResult,
            actionType: action.type
        }
    } else if (action.type === "MEASUREMENT_RESULT") {
        return {
            wsMgr: state.wsMgr,
            wsProcessManager: state.wsProcessManager,
            measurementResult: action.measurementResult,
            actionType: action.type
        }
    }
    
    return state;
}, window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__());