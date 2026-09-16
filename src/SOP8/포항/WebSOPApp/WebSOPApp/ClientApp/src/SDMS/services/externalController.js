import { ExternalJsonManager } from "./externalJsonManager";
import ProjectResource from "../../Root/resource/id";

export class ExternalController {
    static async GetExternalSensorTypes() {

        const jsonData = ExternalJsonManager.makeRequestExternalSensorTypes();

        try {
            const response = await fetch('api/Pohang/RequestExternalSensorTypes', {
                method: 'post',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                },
                body: jsonData
            });

            if (response.ok) {
                const result = await response.json();

                if (result.success) {
                    return result.sensorTypes;
                } else {
                    console.log(result.message);
                    return null;
                }
            }
        } catch (e) {
            console.log(e);
        }

        return null;
    }

    static async GetExternalSensorCategories() {

        const jsonData = ExternalJsonManager.makeRequestExternalSensorCategories();

        try {
            const response = await fetch('api/Pohang/RequestExternalSensorCategories', {
                method: 'post',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                },
                body: jsonData
            });

            if (response.ok) {
                const result = await response.json();

                if (result.success) {
                    return result.sensorCategories;
                } else {
                    console.log(result.message)
                    return null;
                }
            }
        } catch (e) {
            console.log(e);
        }

        return null;
    }

    static async GetExternalSensorLinks() {
        const jsonData = null;

        try {
            const response = await fetch('api/Pohang/RequestExternalSensorLink', {
                method: 'post',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                },
                body: jsonData
            });

            if (response.ok) {
                const result = await response.json();

                if (result.success) {
                    return result.sensorLinks;
                } else {
                    console.log(result.message);
                    return null;
                }
            }
        } catch (e) {
            console.log(e);
        }
    }
    
    static async GetExternalPOIInfo() {
        const jsonData = null;

        try {
            const response = await fetch('api/Pohang/RequestExternalPOIInfo', {
                method: 'post',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                },
                body: jsonData
            });

            if (response.ok) {
                const result = await response.json();
                return result.poiInfos;
            }
        } catch (e) {
            console.log(e);
        }
        
    }
    
    static async GetExternalSensorTypeSubTypes() {
        const jsonData = null;
        
        try {
            const response = await fetch('api/Pohang/RequestExternalSensorTypeSubTypes', {
                method: 'post',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                },
                body: jsonData
            });

            if (response.ok) {
                const result = await response.json();

                if (result.success) {
                    return result.sensorTypeSubTypes;
                } else {
                    console.log(result.message);
                    return null;
                }
            }
        } catch(e) {
            console.log(e);
        }
    }
    
    static async GetExternalSensorHistories(nodeID) {
        const jsonData = ExternalJsonManager.makeRequestExternalSensorHistories(nodeID);

        try {
            const response = await fetch(ProjectResource.baseUrl + '/api/Pohang/RequestExternalSensorHistories', {
                method: 'post',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                },
                body: jsonData
            });

            if (response.ok) {
                const result = await response.json();

                if (result.success) {
                    return result.sensorHistories;
                } else {
                    console.log(result.message);
                    return null;
                }
            }
        } catch (e) {
            console.log(e);
        }
    }

    static async requestSensorSubTypes() {
        try {
            const jsonData = null;

            const res = await fetch(ProjectResource.baseUrl + '/api/Pohang/RequestSensorSubTypes', {
                method: 'post',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                },
                body: jsonData
            });

            if (res.ok) {
                const result = await res.json();
                return result.subTypes;
            }
        } catch (e) {
            console.log(e);
            return null;
        }

        return null;
    }
    
    static async requestExternalMaterialLinks () {
        try {
            const jsonData = null;
            
            const res = await fetch(ProjectResource.baseUrl + '/api/Pohang/RequestExternalMaterialLinks', {
                method: 'post',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                },
                body: jsonData
            });
            
            if (res.ok) {
                const result = await res.json();
                return result.materialLinks;
            }
        } catch (e) {
            console.log(e);
            return null;
        }
        
        return null;
    }
    
    static async requestExternalPublicData () {
        try {
            const jsonData = null;
            
            const res = await fetch(ProjectResource.baseUrl + '/api/Pohang/RequestExternalPublicData', {
                method: 'post',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                },
                body: jsonData
            })
            
            if (res.ok) {
                const result = await res.json();
                return result;
            }
        } catch (e) {
            console.log(e);
        }
    }

}