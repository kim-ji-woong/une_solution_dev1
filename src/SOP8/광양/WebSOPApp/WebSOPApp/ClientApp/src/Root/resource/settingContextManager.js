export class SettingContextManager {
    static SettingInfo = "SETTING_INFO";

    static eventOwners = {}

    static setEventOwner(actionType, ownerName, eventOwner) {
        let owners = SettingContextManager.eventOwners[actionType];

        if (!owners) {
            owners = {};
            SettingContextManager.eventOwners[actionType] = owners;
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
            settingState: null,
            message: null,
        }
    }

    static setActionState(state, action) {
        if (state === undefined) {
            return {
                settingState: null,
                message: null,
            }
        }

        let resultState = {};

        switch (action.type) {
            case SettingContextManager.SettingInfo:
                resultState = {
                    settingState: action.settingState,
                    message: action.message
                };
                SettingContextManager.sendEvent(resultState, action);
                return resultState;
        }

        return state;
    }

    static sendEvent(state, action) {
        const owners = SettingContextManager.eventOwners[action.type];

        if (owners) {
            for (const name in owners) {
                const eventOwner = owners[name];
                eventOwner.onDispatchAction(state, action);
            }
        }
    }
}