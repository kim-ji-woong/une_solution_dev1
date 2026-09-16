export class ExternalJsonManager {
    static makeRequestExternalSensorTypes() {
        const json = {
            "bRequestExternalSensorTypes": true
        };
        
        return JSON.stringify(json);
    }
    
    static makeRequestExternalSensorCategories() {
        const json = {
            "bRequestExternalSensorCategories": true
        };
        
        return JSON.stringify(json);
    }
    
    static makeRequestExternalSensorHistories(nodeID) {
        const json = {
            // "RequestExternalSensorHistories": {
            //     "nodeID": nodeID,
            // },
            "nodeID": nodeID,
        };
        
        return JSON.stringify(json);
    }
}