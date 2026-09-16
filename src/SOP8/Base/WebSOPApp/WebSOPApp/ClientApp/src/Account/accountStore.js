import { createStore } from 'redux';

export default createStore(function (state, action) {
    if (state === undefined) {
        return {
            loginState: null,
            message: null,
        }
    }
    else if (action.type === 'LOGIN_STATE') {
        return {
            loginState: action.loginState,
            message: action.message,
            actionType: action.type
        }
    }
    else if (action.type === 'UPDATE_INFO') {
        return {
            loginState: state.loginState,
            message: state.message,
            user: action.user,
            actionType: action.type
        }
    }

    return state;
}, window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__())
