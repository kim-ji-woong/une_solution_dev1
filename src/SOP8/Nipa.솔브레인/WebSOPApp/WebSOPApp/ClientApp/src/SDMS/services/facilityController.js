import { SdmsJsonManager } from './sdmsJsonManager';

export class FacilityController {
    /*
    static async requestFacilityModelList() {
        try {
            const jsonData = SdmsJsonManager.makeRequestFacilityModelList();

            const res = await fetch('SDMS/Facility/RequestFacilityModelList', {
                method: 'post',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                },
                body: jsonData
            });

            if (res.ok) {
                const result = await res.json();

                if (result.success) {
                    return [result.models, ""];
                }
                else {
                    return [null, result.message];
                }
            }
        }
        catch (e) {
            console.log(e);
        }

        return [null, "requestFacilityModelList 실패"];
    }

    static async requestFacilityModelList() {
        try {
            const jsonData = SdmsJsonManager.makeRequestFacilityModelList();

            const res = await fetch('SDMS/Facility/RequestFacilityModelList', {
                method: 'post',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                },
                body: jsonData
            });

            if (res.ok) {
                const result = await res.json();

                if (result.success) {
                    return [result.models, ""];
                }
                else {
                    return [null, result.message];
                }
            }
        }
        catch (e) {
            console.log(e);
        }

        return [null, "requestFacilityModelList 실패"];
    }

    static async requestSaveFcltyViewport(_3dMaster, faModel, selFcltyInfo) {
        try {
            const fcltyNo = selFcltyInfo.fcltyNo;
            const zoneNo = selFcltyInfo.zoneNo;
            const model = SDMSController._getFcltyModel(fcltyNo, zoneNo, faModel);

            const jsonData = SdmsJsonManager.makeRequestSaveFcltyViewport(fcltyNo, _3dMaster.camera, _3dMaster.controls, zoneNo);

            const res = await fetch('SDMS/Facility/RequestSaveFcltyViewport', {
                method: 'post',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                },
                body: jsonData
            });

            if (res.ok) {
                const result = await res.json();

                if (result.success) {
                    SDMSController.setModelCamera(model, JSON.parse(jsonData));
                    return [true, ""];
                }
                else {
                    return [false, result.message];
                }
            }
        }
        catch (e) {
            console.log(e);
        }

        return [false, "requestSaveFcltyViewport 실패"];
    }
    */

    static async requestFacilityHistory(sensor_sn) {
        try {
            const res = await fetch('SDMS/Facility/RequestFacilityHistory', {
                method: 'post',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(
                    {
                        "sensorID": sensor_sn
                    }
                )
            });

            if (res.ok) {
                const result = await res.json();

                if (result.success) {

                    return [result, ""];
                }
                else {
                    return [result, result.message];
                }
            }
        }
        catch (e) {
            console.log(e);
        }

        return [null, "requestFacilityHistory 실패"];
    }

    static async requestPowerHistory(sensor_sn) {
        try {
            const res = await fetch('SDMS/Facility/RequestPowerHistory', {
                method: 'post',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(
                    {
                        "sensorID": sensor_sn
                    }
                )
            });

            if (res.ok) {
                const result = await res.json();

                if (result.success) {

                    return [result, ""];
                }
                else {
                    return [result, result.message];
                }
            }
        }
        catch (e) {
            console.log(e);
        }

        return [null, "requestPowerHistory 실패"];
    }

    static async requestFcltyPresvList() {
        try {
            const res = await fetch('SDMS/Facility/RequestFcltyPresvList', {
                method: 'post',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                }
            });

            if (res.ok) {
                const result = await res.json();

                if (result.success) {

                    return [result.fcltyPresvInfos, ""];
                }
                else {
                    return [null, result.message];
                }
            }
        }
        catch (e) {
            console.log(e);
        }

        return [null, "requestFcltyPresvList 실패"];
    }

    static async requestFcltyAnalysis(sensor_sn) {
        try {
            const res = await fetch('SDMS/Facility/RequestFcltyAnalysis', {
                method: 'post',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(
                    {
                        "sensorID": sensor_sn
                    }
                )
            });

            if (res.ok) {
                const result = await res.json();

                if (result.success) {

                    return [result, ""];
                }
                else {
                    return [null, result.message];
                }
            }
        }
        catch (e) {
            console.log(e);
        }

        return [null, "requestFcltyAnalysis 실패"];
    }

    static async requestFacilityMesures(presvNo) {
        try {
            const res = await fetch('SDMS/Facility/RequestFacilityMesures', {
                method: 'post',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(
                    {
                        "presvNo": presvNo
                    }
                )
            });

            if (res.ok) {
                const result = await res.json();

                if (result.success) {

                    return [result, ""];
                }
                else {
                    return [null, result.message];
                }
            }
        }
        catch (e) {
            console.log(e);
        }

        return [null, "requestFacilityMesures 실패"];
    }
}