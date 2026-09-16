export class AlarmContextManager {
    static AlarmInfo = "ALARM_INFO";

    static eventOwners = {}

    static setEventOwner(actionType, ownerName, eventOwner) {
        let owners = AlarmContextManager.eventOwners[actionType];

        if (!owners) {
            owners = {};
            AlarmContextManager.eventOwners[actionType] = owners;
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
            alarmState: null,
            message: null,
        }
    }

    static setActionState(state, action) {
        if (state === undefined) {
            return {
                alarmState: null,
                message: null,
            }
        }

        let resultState = {};

        switch (action.type) {
            case AlarmContextManager.AlarmInfo:
                resultState = {
                    alarmState: action.alarmState,
                    message: action.message
                };
                AlarmContextManager.sendEvent(resultState, action);
                return resultState;
        }

        return state;
    }

    static sendEvent(state, action) {
        const owners = AlarmContextManager.eventOwners[action.type];

        if (owners) {
            for (const name in owners) {
                const eventOwner = owners[name];
                eventOwner.onDispatchAction(state, action);
            }
        }
    }
}