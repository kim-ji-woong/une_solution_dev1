import React, { Component } from 'react';

import { SDMSController } from '../../SDMS/services/sdmsController';
import { DashboardController } from '../../SDMS/services/dashboardController';
import ProjectResource from '../../Root/resource/id';
import AccountResource from '../../Account/resource/id';
import store from '../../Root/store';

import DashboardStore from '../dashboardStore';
import DashboardNew from './soulbrain/dashboardNew';
import SettingsStore from '../../Settings/settingsStore';
import { WeatherController } from '../../SDMS/services/weatherController';


class Dashboard extends Component {
    static arrDayStr = ['일', '월', '화', '수', '목', '금', '토'];

    constructor(props) {
        super(props);

        this.state = {
            buildingGroupList: [],
            outdoorZones: [],
            weeklyAlarms: [],
            useSensorList: null,
            todayAllAlarms: store.getState().sensorAlarm,
            sensorTodayAlarm: store.getState().sensorAlarm,
            workPermit: DashboardStore.getState().workPermit,
            workerInfos: store.getState().workerInfos,          // 인원현황
            useSensorTypes: null,                               // 사용 중인 센서 타입  
            weatherDatas: store.getState().weatherDatas,
            weeklyDatas: null,
        }
        
        this.props = props;

        this.initSensorTypes = true;

        store.subscribe(function () {
            let data = store.getState();
            // console.log(data);

            if (data.actionType === 'SENSOR_ALARM') {
                this.changeAlarm(data.sensorAlarm);
            } else if (data.actionType === 'TODAY_ALARM') {
                this.changeTodayAlarm(data.sensorAlarm);
            } else if (data.actionType === 'WORKER_INFOS' && data.workerInfos) {
                this.setWorkerInfos(data.workerInfos);
            } else if (data.actionType === 'WEATHER_CURRENT' && data.weatherDatas) {
                this.changeWeather(data.weatherDatas);
                this.reloadWeeklyData();
            }
            
        }.bind(this));

        DashboardStore.subscribe(function () {
            let data = DashboardStore.getState();

            if ((data.workPermit !== null && data.workPermit !== undefined)
                && data.actionType === 'WORK_PERMIT') {
                this.changeWorkPermit(data.workPermit);
            }

        }.bind(this));

        SettingsStore.subscribe(function () {
            let data = SettingsStore.getState();

            if (data.actionType === 'SDMS_COMMON_SETTINGS') {
                // 사용중인 센서타입 reload
                this.reloadUseSensorTypes(data.sdmsCommonSettings);
            }

        }.bind(this));

        this.init();
        this.initUseSensorTypes();
    }
    
    componentDidMount() {
        this.props.menuEvent.onClickLogo = this.onClickLogo;

        SDMSController.StartWatchAlarmTimer();
        DashboardController.StartWatchTimer();
    }

    componentWillUnmount() {
        SDMSController.stopWatchAlarmTimer();
        DashboardController.stopWatchTimer();
    }

    initUseSensorTypes = () => {
        const sdmsCommonSettings = SettingsStore.getState().sdmsCommonSettings;

        if (sdmsCommonSettings) {
            this.reloadUseSensorTypes(sdmsCommonSettings);
        }
    }

    onClickLogo = () => {
    }

    reloadUseSensorTypes = (sdmsCommonSettings) => {
        let data = sdmsCommonSettings;
        let useSensorTypes = this.state.useSensorTypes;

        if (data?.UseFire !== undefined ||
            data?.UsePSM !== undefined ||
            data?.UseETC !== undefined ||
            data?.UseSVMS !== undefined ||
            data?.UseEarthquake !== undefined ||
            data?.UseStrongWind !== undefined ||
            data?.UseBlackOut !== undefined ||
            data?.UseBecon !== undefined ||
            data?.UseEnvironment !== undefined ||
            data?.UseManufacture !== undefined) {

            let sensorTypes = new Object();
            sensorTypes.UseFire = false;
            sensorTypes.UsePSM = false;
            sensorTypes.UseETC = false;
            sensorTypes.UseSVMS = false;
            sensorTypes.UseEarthquake = false;
            sensorTypes.UseStrongWind = false;
            sensorTypes.UseBlackOut = false;
            sensorTypes.UseBecon = false;
            sensorTypes.UseEnvironment = false;
            sensorTypes.UseManufacture = false;

            if (data.UseFire === "true")
                sensorTypes.UseFire = true;
            if (data.UsePSM === "true")
                sensorTypes.UsePSM = true;
            if (data.UseETC === "true")
                sensorTypes.UseETC = true;
            if (data.UseSVMS === "true")
                sensorTypes.UseSVMS = true;
            if (data.UseEarthquake === "true")
                sensorTypes.UseEarthquake = true;
            if (data.UseStrongWind === "true")
                sensorTypes.UseStrongWind = true;
            if (data.UseBlackOut === "true")
                sensorTypes.UseBlackOut = true;
            if (data.UseBecon === "true")
                sensorTypes.UseBecon = true;
            if (data.UseEnvironment === "true")
                sensorTypes.UseEnvironment = true;
            if (data.UseManufacture === "true")
                sensorTypes.UseManufacture = true;

            if (useSensorTypes === null ||
                useSensorTypes.UseFire !== data.UseFire ||
                useSensorTypes.UsePSM !== data.UsePSM ||
                useSensorTypes.UseETC !== data.UseETC ||
                useSensorTypes.UseSVMS !== data.UseSVMS ||
                useSensorTypes.UseEarthquake !== data.UseEarthquake ||
                useSensorTypes.UseStrongWind !== data.UseStrongWind ||
                useSensorTypes.UseBlackOut !== data.UseBlackOut ||
                useSensorTypes.UseBecon !== data.UseBecon ||
                useSensorTypes.UseEnvironment !== data.UseEnvironment ||
                useSensorTypes.UseManufacture !== data.UseManufacture) {

                if (this.initSensorTypes === true) {
                    this.initSensorTypes = false;
                    this.state.useSensorTypes = sensorTypes;
                }

                this.setState({ useSensorTypes: sensorTypes });
                
            }
        }
    }


    changeWeather(weatherDatas) {
        this.setState({ weatherDatas });
    }

    async reloadWeeklyData() {
        const weeklyDatas = this.state.weeklyDatas;
        const [result, message] = await WeatherController.requestWeatherWeeklyInfo();

        if (result === null || result === undefined)
            return;

        if (!weeklyDatas) {
            this.setState({ weeklyDatas: result });
            return;
        } else {
            for (let i = 0; i < result?.length; i++) {
                const data = result[i];
                let chk = false;

                for (let j = 0; j < weeklyDatas?.length; j++) {
                    const weeklyData = weeklyDatas[j];

                    if (data.site?.id === weeklyData.site?.id) {
                        chk = true;

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

                if (chk === false) {
                    this.setState({ weeklyDatas: result });
                    return;
                }
            }
        }
    }

    // 인원 현황 관련
    setWorkerInfos(workerInfos) {
        this.setState({ workerInfos });
    }

    changeWorkPermit(workPermit) {
        this.setState({ workPermit });
    }

    changeAlarm(todayAllAlarms) {
        this.setState({ todayAllAlarms });
    }

    changeTodayAlarm(sensorTodayAlarm) {
        this.setState({ sensorTodayAlarm });
    }

    async init() {
        // 건물 정보 가져오기
        let buildingGroupList = [];
        let weeklyAlarms = [];
        let useSensorList = null;
        let outdoorZones = [];

        let siteIDs = null;
        const userInfo = await ProjectResource.initUserInfo();
        if (userInfo?.levelID !== AccountResource.accountLevelNo.master &&
            userInfo?.siteID) {
            siteIDs = [userInfo.siteID];
        }

        const [buildingGroupListData, outdoorZoneData, errorMessage] = await SDMSController.requestBuildingGroupList(siteIDs);
        if (buildingGroupListData)
            buildingGroupList = buildingGroupListData;
        if (outdoorZoneData)
            outdoorZones = outdoorZoneData;

        // 1주일 알람 정보 가져오기
        const [weeklyAlarmData, message] = await DashboardController.requestWeeklyStatus();
        if (weeklyAlarmData)
            weeklyAlarms = weeklyAlarmData;

        // 사용중인 센서 리스트 조회
        const [useSensorListData, count, useSensorMessage] = await SDMSController.requestSensorList();
        if (useSensorListData) {
            useSensorList = useSensorListData;
        }

        this.setState({ buildingGroupList, weeklyAlarms, useSensorList, outdoorZones });
    }

    render() {
        
        return (
            <DashboardNew
                buildingGroupList={this.state.buildingGroupList}
                todayAllAlarms={this.state.todayAllAlarms}
                weeklyAlarms={this.state.weeklyAlarms}
                useSensorList={this.state.useSensorList}
                workPermit={this.state.workPermit}
                workerInfos={this.state.workerInfos}
                sensorTypes={this.state.useSensorTypes}
            />
        );
    }
}

export default Dashboard;