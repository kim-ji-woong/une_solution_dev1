import { CfdJsonManager } from './cfdJsonManager';

export class CfdController {
    static async requestScenarioCase(materialName, targetLocation, buildingNo, windDir = null, windSpeed = null) {
        try {
            const jsonData = CfdJsonManager.makeRequestScenarioCase(materialName, targetLocation, buildingNo, windDir, windSpeed); 

            const res = await fetch('SDMS/Cfd/RequestScenarioCase', {
                method: 'post',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                },
                body: jsonData
            });

            if (res.ok) {
                const result = await res.json();
                return [result.success, result.message, result];
            }

        } catch (e) {
            console.log(e);
        }

        return [false, "requestScenarioCase 호출에 실패하였습니다.", null];
    }

    static async requestLocation() {
        try {
            const jsonData = CfdJsonManager.makeRequestLocation();

            const res = await fetch('SDMS/Cfd/RequestLocation', {
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
                    return [result.locations, result.message];
                }
                else {
                    return [null, result.message];
                }
            }

        } catch (e) {
            console.log(e);
        }

        return [null, "requestLocation 호출에 실패하였습니다."];
    }
}
