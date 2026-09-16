import imgCloudy from '../images/weather/cloudy.png';
import imgCloudDay from '../images/weather/cloud_day.png';
import imgCloudNight from '../images/weather/cloud_night.png';
import imgHeavySnow from '../images/weather/heavySnow.png';
import imgSnow from '../images/weather/snow.png';
import imgSnowRain from '../images/weather/snowRain.png';
import imgHeavyRain from '../images/weather/heavyRain.png';
import imgRain from '../images/weather/rain.png';
import imgSunnyDay from '../images/weather/sunny_day.png';
import imgSunnyNight from '../images/weather/sunny_night.png';
import imgThunder from '../images/weather/thunder.png';
import imgDustStorm from '../images/weather/dustStorm.png';
import ProjectResource from '../../Root/resource/id';

export default class MainResource {
    static get ID() {
        return MainResource.id[ProjectResource.targetLanguage];
    }

    static id = {
        "ko": {
            menu:
            {
                statusInfo: "랙/통신 장비 관리",
                assets3DInfo: "전국 3D 모델 관리",
                rackInfo: "랙 정보",
                rackDetailInfo: "랙 상세정보",
                signalDeviceInfo: "통신 장비 정보",
                signalDeviceDetailInfo: "통신 장비 상세정보",
                viewImg: "현장이미지 보기",
                alarmDetailInfo: "알람 상세정보",
                dataCenterInfo: "국사 정보",
            },
        }
    }

    static popupLayer = {
        statusInfo: "statusInfo",               // 랙/통신 장비 관리
        assets3DInfo: "assets3DInfo",           // 3D 모델 관리
        rackInfo: "rackInfo",                   // 랙 정보
        signalDeviceInfo: "signalDeviceInfo",   // 통신 장비 정보
        dataCenterInfo: "dataCenterInfo",       // 국사 정보
    }

    static section = {
        rack: "Rack",
        item: "통신장비",
        powerEquipment: "전원환경설비"
    }

    static WeatherInfo = {
        Unknown: 0,
        Sunshine: 1,
        Thunder: 2,
        SnowRain: 3,
        HeavySnow: 4,
        Snow: 5,
        HeavyRain: 6,
        Rain: 7,
        Cloudy: 8,
        Cloud: 9,
        DustStorm: 10,
        FineDust: 11,
    }

    static isDayLight() {
        const now = new Date();
        const hour = now.getHours();

        if (hour < 6 || hour >= 19) {
            return false;
        }

        return true;
    }

    static getStateImage(state) {
        if (state === MainResource.WeatherInfo.Sunshine) {
            if (MainResource.isDayLight()) {
                return imgSunnyDay;
            }
            else {
                return imgSunnyNight;
            }
        }
        else if (state === MainResource.WeatherInfo.Thunder) {
            return imgThunder;
        }
        else if (state === MainResource.WeatherInfo.SnowRain) {
            return imgSnowRain;
        }
        else if (state === MainResource.WeatherInfo.HeavySnow) {
            return imgHeavySnow;
        }
        else if (state === MainResource.WeatherInfo.Snow) {
            return imgSnow;
        }
        else if (state === MainResource.WeatherInfo.HeavyRain) {
            return imgHeavyRain;
        }
        else if (state === MainResource.WeatherInfo.Rain) {
            return imgRain;
        }
        else if (state === MainResource.WeatherInfo.Cloudy) {
            return imgCloudy;
        }
        else if (state === MainResource.WeatherInfo.DustStorm) {
            return imgDustStorm;
        }

        if (MainResource.isDayLight()) {
            return imgCloudDay;
        }

        return imgCloudNight;
    }

    static getDoubleString(num) {
        if (num < 10) {
            return "0" + num;
        }

        return num;
    }

    static getDate(date) {
        const dt = new Date(date);
        let mm = dt.getMonth() + 1;
        let dd = dt.getDate();
        let ss = dt.getSeconds();
        const ymd = dt.getFullYear() + '-' + MainResource.getDoubleString(mm) + '-' + MainResource.getDoubleString(dd);
        const hms = MainResource.getDoubleString(dt.getHours()) + ':' + MainResource.getDoubleString(dt.getMinutes()) + ':' + MainResource.getDoubleString(ss);

        const formattedDate = `${ymd} ${hms}`;
        return formattedDate;
    }
} 