export class WeatherJsonManager {
    static makeRequestCurrentWeather(weatherSiteNo) {
        const json = {
            "weatherSiteNo": weatherSiteNo
        };

        return JSON.stringify(json);
    }

    static makeRequestWeatherWeeklyInfo(weatherSiteNo) {
        const json = {
            "weatherSiteNo": weatherSiteNo
        };

        return JSON.stringify(json);
    }
}