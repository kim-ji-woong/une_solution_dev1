export class SopContextManager {
    static RunSOP = "RUN_SOP";

    static eventOwners = {}

    static setEventOwner(actionType, ownerName, eventOwner) {
        let owners = SopContextManager.eventOwners[actionType];

        if (!owners) {
            owners = {};
            SopContextManager.eventOwners[actionType] = owners;
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
            sopHistory: null,
            message: null,
        }
    }

    static setActionState(state, action) {
        if (state === undefined) {
            return {
                sopHistory: null,
                message: null,
            }
        }

        let resultState = {};

        switch (action.type) {
            case SopContextManager.RunSOP:
                resultState = {
                    sopHistory: action.sopHistory,
                    message: action.message
                };
                SopContextManager.sendEvent(resultState, action);
                return resultState;
        }

        return state;
    }

    static sendEvent(state, action) {
        const owners = SopContextManager.eventOwners[action.type];

        if (owners) {
            for (const name in owners) {
                const eventOwner = owners[name];
                eventOwner.onDispatchAction(state, action);
            }
        }
    }
}