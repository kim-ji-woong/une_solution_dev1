export class ContextManager {
    static LoginState = "LOGIN_STATE";
    static UpdateInfo = "UPDATE_INFO";

    static eventOwners = {}

    static setEventOwner(actionType, ownerName, eventOwner) {
        let owners = ContextManager.eventOwners[actionType];

        if (!owners) {
            owners = {};
            ContextManager.eventOwners[actionType] = owners;
        }

        if (eventOwner === null) {
            if (owners[ownerName]) {
                delete owners[ownerName];
            }
        }
        else {
            owners[ownerName] = eventOwner;
        }
    }

    static initialState() {
        return {
            loginState: null,
            message: null,
            user: null,
        }
    }

    static setActionState(state, action) {
        if (state === undefined) {
            return {
                loginState: null,
                message: null,
                user: null,
            }
        }

        let resultState = {};

        switch (action.type) {
            case ContextManager.LoginState:
                resultState = {
                    loginState: action.loginState,
                    message: action.message
                }

                ContextManager.sendEvent(resultState, action);
                return resultState;
            case ContextManager.UpdateInfo:
                resultState = {
                    loginState: state.loginState,
                    message: state.message,
                    user: action.user
                };
                ContextManager.sendEvent(resultState, action);
                return resultState;
        }

        return state;
    }

    static sendEvent(state, action) {
        const owners = ContextManager.eventOwners[action.type];

        if (owners) {
            for (const name in owners) {
                const eventOwner = owners[name];
                eventOwner.onDispatchAction(state, action);
            }
        }
    }
}