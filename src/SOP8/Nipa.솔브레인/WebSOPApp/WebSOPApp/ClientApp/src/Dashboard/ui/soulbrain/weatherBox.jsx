import React, { Component } from 'react';
import $ from 'jquery';

import dashboard from '../../css/dashboardNew.module.css';

import { DashboardController } from '../../services/dashboardController';

import store from '../../../Root/store';
import SDMSResource from '../../../SDMS/resource/id';
import DashboardResource from '../../resource/id';
import ProjectResource from '../../../Root/resource/id';
import { WeatherController } from '../../../SDMS/services/weatherController';
import SdmsResource from '../../../SDMS/resource/id';

class WeatherBox extends Component {
    constructor(props) {
        super(props);

        this.state = {
            site: DashboardResource.weatherSite.GONGJU,
            weatherDatas: store.getState().weatherDatas,
            weeklyDatas: null,
        }

        this.props = props;

        this.init();

        store.subscribe(function () {
            let data = store.getState();

            if (data.actionType === "WEATHER_CURRENT") {
                this.changeWeather(data.weatherDatas);
                this.reloadWeeklyData();
            } 
        }.bind(this));
    }

    async changeWeather(weatherDatas) {
        if (weatherDatas !== null && weatherDatas !== undefined)
            this.setState({ weatherDatas: weatherDatas });
    }

    async init() {
        const [result, message] = await WeatherController.requestWeatherWeeklyInfo();

        if (result !== null && result !== undefined) {
            this.setState({ weeklyDatas: result });
        }

    }

    setWeatherData(id) {
        let temperature = "-";
        let humidity = "-";
        let windDirection = "-";
        let windSpeed = "-";
        let img = DashboardResource.getStateImage(0);
        let state = "-";
        let rain = "-";
        let name = "-";

        let data = null;

        if (this.state.weatherDatas !== null && this.state.weatherDatas !== undefined && this.state.weatherDatas.length > 0) {
            const weatherDatas = this.state.weatherDatas;

            for (let i = 0; i < weatherDatas.length; i++) {
                const weatherData = weatherDatas[i];

                if (weatherData.wethr_site_sn === id) {
                    data = weatherDatas[i];
                    break;
                }
            }

            if (data !== null) {
                // 데이터 업데이트 시간 비교 >> 현재 시간보다 30분 전 데이터이라면 표시X
                let today = new Date();
                let date = new Date(data.updt_tm);

                let second = today.getTime() - date.getTime();
                let minute = second / 1000 / 60;

                if (minute > 30)
                    return [name, temperature, humidity, windDirection, windSpeed, img];

                temperature = data.sensb_tp ? data.sensb_tp.toFixed(1) : '-';
                humidity = data.hd;
                windDirection = SdmsResource.windDirectionNames[data.wind_drc_code] || '-';
                windSpeed = data.wind_spd ? data.wind_spd.toFixed(1) : '-';

                img = DashboardResource.getStateImage(data.wethr_sttus_code, 30);
                state = SdmsResource.getWeatherStateString(data.wethr_sttus_code);
                rain = data.rain;
                name = data.siteName;
            }
        }

        return [name, temperature, humidity, windDirection, windSpeed, img, state, rain];
    }

    getWeartherBtnClass = () => {
        let site = this.state.site;
        let pajuClass = "";
        let gongjuClass = "";
        let pangyoClass = "";

        if (site === DashboardResource.weatherSite.PAJU) {
            pajuClass = dashboard.weatherAct;
        } else if (site === DashboardResource.weatherSite.GONGJU) {
            gongjuClass = dashboard.weatherAct;
        } else if (site === DashboardResource.weatherSite.PANGYO) {
            pangyoClass = dashboard.weatherAct;
        }

        return [pajuClass, gongjuClass, pangyoClass];
    }

    changeSite = (site) => {
        this.setState({site: site});
    }

    getWeatherWeeklyInfo = () => {
        let weeklyDatas = this.state.weeklyDatas;
        let site = this.state.site;

        // 요일 구하기
        let days = [];
        let dt = new Date();
        const arrDayStr = ['일', '월', '화', '수', '목', '금', '토'];

        days.push(arrDayStr[dt.getDay()]);
        dt.setDate(dt.getDate() + 1);
        days.push(arrDayStr[dt.getDay()]);
        dt.setDate(dt.getDate() + 1);
        days.push(arrDayStr[dt.getDay()]);
        dt.setDate(dt.getDate() + 1);
        days.push(arrDayStr[dt.getDay()]);
        dt.setDate(dt.getDate() + 1);
        days.push(arrDayStr[dt.getDay()]);
        dt.setDate(dt.getDate() + 1);
        days.push(arrDayStr[dt.getDay()]);

        // 기상 정보 구하기
        let weeklyInfo = [];
        if (weeklyDatas === null || weeklyDatas === undefined) {
            weeklyInfo = [
                { temp: "-", state: DashboardResource.getStateImage("-") },
                { temp: "-", state: DashboardResource.getStateImage("-") },
                { temp: "-", state: DashboardResource.getStateImage("-") },
                { temp: "-", state: DashboardResource.getStateImage("-") },
                { temp: "-", state: DashboardResource.getStateImage("-") }
            ];
        } else {
            for (let i = 0; i < weeklyDatas.length; i++) {
                let weeklyData = weeklyDatas[i];

                if (weeklyData.site.wethr_site_sn === site) {
                    // 데이터 업데이트 시간 비교 >> 현재 시간보다 30분 전 데이터이라면 표시X
                    let today = new Date();
                    let date = new Date(weeklyData.weekly.updt_tm);

                    let second = today.getTime() - date.getTime();
                    let minute = second / 1000 / 60;

                    if (minute > 30) {
                        weeklyInfo = [
                            { temp: "-", state: DashboardResource.getStateImage("-") },
                            { temp: "-", state: DashboardResource.getStateImage("-") },
                            { temp: "-", state: DashboardResource.getStateImage("-") },
                            { temp: "-", state: DashboardResource.getStateImage("-") },
                            { temp: "-", state: DashboardResource.getStateImage("-") }
                        ];
                    } else {
                        weeklyInfo.push({ temp: weeklyData.weekly.oneday_after_tp, state: DashboardResource.getStateImage(weeklyData.weekly.oneday_after_wethr_sttus_code) });

                        weeklyInfo.push({ temp: weeklyData.weekly.twoday_after_tp, state: DashboardResource.getStateImage(weeklyData.weekly.twoday_after_wethr_sttus_code) });
                        weeklyInfo.push({ temp: weeklyData.weekly.thrday_after_tp, state: DashboardResource.getStateImage(weeklyData.weekly.thrday_after_wethr_sttus_code) });

                        weeklyInfo.push({ temp: weeklyData.weekly.fourday_after_tp, state: DashboardResource.getStateImage(weeklyData.weekly.fourday_after_wethr_sttus_code) });

                        weeklyInfo.push({ temp: weeklyData.weekly.fiveday_after_tp, state: DashboardResource.getStateImage(weeklyData.weekly.fiveday_after_wethr_sttus_code) });
                    }

                    break;
                }
            }
        }

        return [days, weeklyInfo];
    }

    async reloadWeeklyData() {
        const weeklyDatas = this.state.weeklyDatas;
        const [result, message] = await WeatherController.requestWeatherWeeklyInfo();

        if (result === null || result === undefined)
            return;

        if (weeklyDatas === null || weeklyDatas === undefined) {
            this.setState({ weeklyDatas: result });
            return;
        } else {
            if (weeklyDatas.length !== 3 && result.length === 3) {
                this.setState({ weeklyDatas: result });
                return;
            } else if (result.length !== 3) {
                return;
            }

            for (let i = 0; i < 3; i++) {
                const weeklyData = weeklyDatas[i];
                const data = result[i];

                if (weeklyData.weekly === null || weeklyData.weekly === undefined ||
                    data.weekly === null || data.weekly === undefined)
                    return;

                if (weeklyData.weekly.oneDayLaterTemp !== data.weekly.oneDayLaterTemp ||
                    weeklyData.weekly.oneDayLaterState !== data.weekly.oneDayLaterState ||
                    weeklyData.weekly.twoDayLaterTemp !== data.weekly.twoDayLaterTemp ||
                    weeklyData.weekly.twoDayLaterState !== data.weekly.twoDayLaterState ||
                    weeklyData.weekly.threeDayLaterTemp !== data.weekly.threeDayLaterTemp ||
                    weeklyData.weekly.threeDayLaterState !== data.weekly.threeDayLaterState ||
                    weeklyData.weekly.fourDayLaterTemp !== data.weekly.fourDayLaterTemp ||
                    weeklyData.weekly.fourDayLaterState !== data.weekly.fourDayLaterState ||
                    weeklyData.weekly.fiveDayLaterTemp !== data.weekly.fiveDayLaterTemp ||
                    weeklyData.weekly.fiveDayLaterState !== data.weekly.fiveDayLaterState) {
                    this.setState({ weeklyDatas: result });
                    return;
                }
            }
        }
    }

    componentDidMount() {
        const resizaleWeatherBoxColumn = "." + dashboard.weatherBox + " ." + dashboard.operationBox;
        const resizaleWeatherBoxRow = "." + dashboard.weatherBox;
    };

    displaySiteUI = () => {
        let displaySiteUI = [];
        let [firstName, gongjuTemperature, gongjuHumidity, gongjuWindDirection, gongjuWindSpeed, gongjuImg, gongjuState, gongjuRain] = this.setWeatherData(DashboardResource.weatherSite.GONGJU);
        let [secondName, pajuTemperature, pajuHumidity, pajuWindDirection, pajuWindSpeed, pajuImg, pajuState, pajuRain] = this.setWeatherData(DashboardResource.weatherSite.PAJU);
        let [thirdName, pangyoTemperature, pangyoHumidity, pangyoWindDirection, pangyoWindSpeed, pangyoImg, pangyoState, pangyoRain] = this.setWeatherData(DashboardResource.weatherSite.PANGYO);
        let [pajuClass, gongjuClass, pangyoClass] = this.getWeartherBtnClass();
        let [name, temperature, humidity, windDirection, windSpeed, img, state, rain] = this.setWeatherData(this.state.site);
        let [days, weeklyInfo] = this.getWeatherWeeklyInfo();

        displaySiteUI.push(
            <div key='weatherBox' className={dashboard.weatherBox}>
                <div className={dashboard.weatherTitle}>기상 정보</div>
                <div className={dashboard.weatherWeek}>
                    <div className={dashboard.weatherWeekTop}>
                        <div className={dashboard.weatherIcon}>
                            <p>{days[0]}<span className={dashboard.today}>오늘</span></p>
                            <i className={dashboard.icon}><img src={img} alt="날씨 아이콘" /></i>
                        </div>
                        <div className={dashboard.temperature}>{temperature}<span>℃</span><span>{state}</span></div>
                        <div className={dashboard.wind}>
                            <p>바람 : {windSpeed} m/s</p>
                            <p>강수량 : {rain} mm</p>
                            <p>습도 : {humidity}%</p>
                        </div>
                    </div>
                    <div className={dashboard.weatherWeekBottom}>
                        <ul>
                            <li className={dashboard.sun}>
                                <p>{days[1]}</p>
                                <i><img src={weeklyInfo[0].state} alt="일" /></i>
                                <p className={dashboard.celsius}>{weeklyInfo[0].temp}℃</p>
                            </li>
                            <li className={dashboard.mon}>
                                <p>{days[2]}</p>
                                <i><img src={weeklyInfo[1].state} alt="월" /></i>
                                <p className={dashboard.celsius}>{weeklyInfo[1].temp}℃</p>
                            </li>
                            <li className={dashboard.tue}>
                                <p>{days[3]}</p>
                                <i><img src={weeklyInfo[2].state} alt="화" /></i>
                                <p className={dashboard.celsius}>{weeklyInfo[2].temp}℃</p>
                            </li>
                            <li className={dashboard.wed}>
                                <p>{days[4]}</p>
                                <i><img src={weeklyInfo[3].state} alt="수" /></i>
                                <p className={dashboard.celsius}>{weeklyInfo[3].temp}℃</p>
                            </li>
                            <li className={dashboard.thu}>
                                <p>{days[5]}</p>
                                <i><img src={weeklyInfo[4].state} alt="목" /></i>
                                <p className={dashboard.celsius}>{weeklyInfo[4].temp}℃</p>
                            </li>
                        </ul>
                    </div>
                </div>
            <div className={dashboard.weatherRight}>
                <div className={dashboard.weatherContent}>
                    <div className={dashboard.gongju + " " + gongjuClass} onClick={() => this.changeSite(DashboardResource.weatherSite.GONGJU)}>
                        <p className={dashboard.name}>{firstName}</p>
                        <p className={dashboard.img}><img src={gongjuImg} alt="" /></p>
                        <p className={dashboard.date}>{gongjuTemperature} ℃</p>
                    </div>
                    <div className={dashboard.paju + " " + pajuClass} onClick={() => this.changeSite(DashboardResource.weatherSite.PAJU)}>
                        <p className={dashboard.name}>{secondName}</p>
                        <p className={dashboard.img}><img src={pajuImg} alt="" /></p>
                        <p className={dashboard.date}>{pajuTemperature} ℃</p>
                    </div>
                    <div className={dashboard.headquarters + " " + pangyoClass} onClick={() => this.changeSite(DashboardResource.weatherSite.PANGYO)}>
                        <p className={dashboard.name}>{thirdName}</p>
                        <p className={dashboard.img}><img src={pangyoImg} alt="" /></p>
                        <p className={dashboard.date}>{pangyoTemperature} ℃</p>
                    </div>
                </div>
                </div>
                </div>
        );

        return displaySiteUI;
    }

    render() {

        return (
            <>
                {
                    this.displaySiteUI()
                }
            </>
        );
    }
}
export default WeatherBox;