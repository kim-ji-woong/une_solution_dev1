export class CfdJsonManager {
    static makeRequestScenarioCase(materialName, targetLocation, buildingNo, windDir, windSpeed) {
        const json = {
            "materialName": materialName,
            "targetLocation": targetLocation,
            "buildingNo": buildingNo,
            "windDirection": windDir,
            "windSpeed": windSpeed
        };

        return JSON.stringify(json);
    }

    static makeRequestLocation() {
        const json = {
        };

        return JSON.stringify(json);
    }
}
