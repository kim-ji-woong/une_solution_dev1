export default class DashboardJsonManager {
    static makeRequestUseSensor() {
        const json = {
            "requestUseSensor": true
        };

        return JSON.stringify(json);
    }

    static makeRequestWeeklyStatus() {
        const json = {
            "requestWeeklyStatus": true
        };

        return JSON.stringify(json);
    }

    static makeRequestMonthStatus() {
        const json = {
            "requestMonthStatus": true
        };

        return JSON.stringify(json);
    }

    static makeRequestWeatherWeeklyInfo() {
        const json = {
            "requestWeatherWeeklyInfo": true
        };

        return JSON.stringify(json);
    }

    static makeRequestCurrentWorkPermit() {
        const json = {
            "requestCurrentWorkPermit": true
        };

        return JSON.stringify(json);
    }

    static makeRequestGetSelectDay(useID) {
        const json = {
            "requestGetSelectDay": {
                "userID": useID,
            }
        };

        return JSON.stringify(json);
    }

    static makeRequestWorkPermit() {
        const json = {
            "requestWorkPermit": true
        };

        return JSON.stringify(json);
    }
}