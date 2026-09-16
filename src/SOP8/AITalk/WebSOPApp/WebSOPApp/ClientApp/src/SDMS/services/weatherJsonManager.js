export class WeatherJsonManager {
    static makeRequestCurrentWeathe(weatherSiteNo) {
        const json = {
            "weatherSiteNo": weatherSiteNo
        };

        return JSON.stringify(json);
    }
}