import { createStore } from 'redux';

export default createStore(function (state, action) {
    if (state === undefined) {
        return {
            currentWork: null,
            workPermit: null,
        }
    }
    else if (action.type === 'CURRENT_WORK') {
        return {
            currentWork: action.currentWork,
            workPermit: state.workPermit,
            actionType: 'CURRENT_WORK',
        }
    }
     else if (action.type === 'WORK_PERMIT') {
        return {
            currentWork: state.currentWork,
            workPermit: action.workPermit,
            actionType: 'WORK_PERMIT',
        }
    }

    return state;
}, window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__())
