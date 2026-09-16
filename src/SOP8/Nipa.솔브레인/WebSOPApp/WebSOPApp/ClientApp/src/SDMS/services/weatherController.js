import store from '../../Root/store';
import { WeatherJsonManager } from './weatherJsonManager';

export class WeatherController {
    static StartWatchTimer() {
        // 타이머 실행 유무 판단
        if (this.timerCheck == true)
            return;

        // 타이머 실행 체크
        this.timerCheck = true;

        WeatherController.WatchWeather();
        
        let timerWeather = setTimeout(async function tick() {
            await WeatherController.WatchWeather();
            timerWeather = setTimeout(tick, 60000);
        }, 60000);
    }

    static async WatchWeather() {
        let [success, message, currentWeathers] = await WeatherController.requestCurrentWeather();

        if (success) {
            store.dispatch({ type: 'WEATHER_CURRENT', weatherDatas: currentWeathers });
        }
        else {
            console.log(message);
        }
    }

    static async requestCurrentWeather(weatherSiteNo = null) {
        try {
            const jsonData = WeatherJsonManager.makeRequestCurrentWeather(weatherSiteNo);

            const res = await fetch('SDMS/Weather/RequestCurrentWeather', {
                method: 'post',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                },
                body: jsonData
            });

            if (res.ok) {
                const result = await res.json();
                return [result.success, result.message, result.currentWeathers];
            }

        } catch (e) {
            console.log(e);
        }

        return [false, "requestCurrentWeather에 실패하였습니다.", null];
    }

    static async requestWeatherWeeklyInfo(weatherSiteNo = null) {
        try {
            const jsonData = WeatherJsonManager.makeRequestWeatherWeeklyInfo(weatherSiteNo);

            const res = await fetch('api/Weather/RequestWeatherWeeklyInfo', {
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
                    return [result.datas, result.message];
                }
                else {
                    return [null, result.message];
                }
            }

        } catch (e) {
            console.log(e);
        }

        return [null, "requestWeatherWeeklyInfo에 실패하였습니다."];
    }
}
