import React, { Component } from 'react';
import $ from 'jquery';

import InfoHeader from './infoHeaderNew';
import { SDMSController } from '../../../SDMS/services/sdmsController';
import { DashboardController } from '../../../SDMS/services/dashboardController';
import store from '../../../Root/store';
import DashboardResource from '../../resource/id';
import SDMSResource from '../../../SDMS/resource/id';

import dashboards from '../../css/dashboardNew.module.css';

import Mainboard from './mainboard';
import Subboard from './subboard';

import Dashboard from '../dashboard';

import DashboardStore from '../../dashboardStore';

import ProjectResource from '../../../Root/resource/id';
import SdmsResource from '../../../SDMS/resource/id';

class DashboardNew extends Component {

    constructor(props) {
        super(props);

        this.state = {
            //buildingGroupList: [],
            buildingGroup: -1,
            building: -1,
            zone: -1,
            //useSensorList: null,
            mode: DashboardResource.mode.main,

            //todayAllAlarms: store.getState().sensorAllAlarm,
            currentWork: DashboardStore.getState().currentWork,

            selectDay: [],
            //weeklyAlarms: [],
        }

        this.props = props;

        DashboardStore.subscribe(function () {
            let data = DashboardStore.getState();

            if ((data.currentWork !== null && data.currentWork !== undefined)
                && data.actionType === 'CURRENT_WORK') {
                this.changeCurrentWork(data.currentWork);
            }

        }.bind(this));

        this.init();
    }

    changeCurrentWork(currentWork) {
        this.setState({ currentWork: currentWork});
    }

    async init() {
        // 선택 날짜 초기화
        this.makeWeek();
    }

    makeWeek() {
        let week = new Array();
        const arrDayStr = Dashboard.arrDayStr;

        for (let i = 6; i >= 0; i--) {
            const value = {};

            let today = new Date();
            let date = new Date(today.setDate(today.getDate() - i));

            const year = date.getFullYear();
            let month = date.getMonth() + 1;
            if (month < 10)
                month = "0" + month;

            let day = date.getDate();
            if (day < 10)
                day = "0" + day;

            const dayString = arrDayStr[date.getDay()];

            const displayText = month + '/' + day + '(' + dayString + ')'
            value.displayText = displayText;
            value.value = year + '-' + month + '-' + day;

            const selectDay = this.state.selectDay;

            if (selectDay[i] === null || selectDay[i] === undefined) {
                // 해당 값이 없다면
                value.checked = true;
                selectDay[6 - i] = value;
            }
            else {
                // 해당 값이 이미 존재한다면
                value.checked = selectDay[i].checked;
                selectDay[6 - i] = value;
            }

            week.push(value);
        }
    }

    setSelectSensors() {
        if (this.props.useSensorList === null || this.props.useSensorList === undefined) {
            return null;
        }

        const buildingGroupID = this.state.buildingGroup;
        const useSensorList = this.props.useSensorList;

        const getSensorsTotal = (sensorTypeCode) => {
            const sensorType = useSensorList?.find((s) => s.sensorTypeCode === sensorTypeCode);
            if (!sensorType) return null;

            return sensorType.sensors;
        };

        const getSensorsDisabled = (sensorTypeCode) => {
            const sensorType = useSensorList?.find((s) => s.sensorTypeCode === sensorTypeCode);
            if (!sensorType) return null;

            const disabledSensors = sensorType?.sensors?.filter((s) => !s.sensor.enab);
            return disabledSensors;
        };

        // 전체 센서 갯수
        if (buildingGroupID === -1) {
            let sensorList = {};
            sensorList.fireSensors = getSensorsTotal(SdmsResource.facilityType.FIRE);
            sensorList.disabledFireSensors = getSensorsDisabled(SdmsResource.facilityType.FIRE);

            sensorList.psmSensors = getSensorsTotal(SdmsResource.facilityType.PSM_SENSOR);
            sensorList.disabledPSMSensors = getSensorsDisabled(SdmsResource.facilityType.PSM_SENSOR);

            sensorList.pmSensors = getSensorsTotal(SdmsResource.facilityType.PM);
            sensorList.disabledPmSensors = getSensorsDisabled(SdmsResource.facilityType.PM);

            sensorList.msSensors = getSensorsTotal(SdmsResource.facilityType.MOBILE_SCANNER);
            sensorList.disabledMsSensors = getSensorsDisabled(SdmsResource.facilityType.MOBILE_SCANNER);

            sensorList.sumpSensors = getSensorsTotal(SdmsResource.facilityType.SUMP);
            sensorList.disabledSumpSensors = getSensorsDisabled(SdmsResource.facilityType.SUMP);

            sensorList.etcSensors = getSensorsTotal(SdmsResource.facilityType.ETC);
            sensorList.disabledEtcSensors = getSensorsDisabled(SdmsResource.facilityType.ETC);
            
            sensorList.cctvs = getSensorsTotal(SdmsResource.facilityType.CCTV);
            sensorList.disabledCCTVs = getSensorsDisabled(SdmsResource.facilityType.CCTV);

            return sensorList;
        }
    }

    selectSpatial = (buildingGroup, building, zone) => {
        console.log(buildingGroup + "," + building + "," + zone);

        this.setState({ buildingGroup: buildingGroup, building: building, zone: zone});
    }

    todayAlarms = () => {
        let todayAllAlarms = [];
        let todayAlarms = [];
        const buildingGroupList = this.props.buildingGroupList;

        if (this.props.todayAllAlarms === null || this.props.todayAllAlarms === undefined || this.props.todayAllAlarms.length === 0) {
            return todayAlarms;
        }

        todayAllAlarms = this.props.todayAllAlarms;

        for (let i = 0; i < todayAllAlarms.length; i++) {
            let chk = false;
            let todayAlarm = new Object();
            let todayAlarmData = todayAllAlarms[i];

            // 해당 알람 빌딩그룹 정보 가져오기
            if (buildingGroupList !== null && buildingGroupList !== undefined) {

                for (let j = 0; j < buildingGroupList.length; j++) {
                    const buildingGroup = buildingGroupList[j];

                    for (let z = 0; z < buildingGroup.buildingDatas.length; z++) {
                        const building = buildingGroup.buildingDatas[z];

                        for (let n = 0; n < building.zoneDatas.length; n++) {
                            const zone = building.zoneDatas[n];

                            if (zone.id === todayAlarmData.zoneID) {
                                chk = true;
                                todayAlarm.buildingGroupID = buildingGroup.id;
                                todayAlarm.buildingID = building.id;
                                break;
                            }
                        }

                        if (chk === true)
                            break;
                    }

                    if (chk === true)
                        break;
                }
            }

            if (chk === false) {
                todayAlarm.buildingGroupID = null;
                todayAlarm.buildingID = null;
            }

            todayAlarm.time = todayAlarmData.dtTime;
            todayAlarm.sensorZoneNo = todayAlarmData.sensorZoneNo;
            todayAlarm.facilityType = todayAlarmData.facilityType;
            todayAlarm.zoneID = todayAlarmData.zoneID;
            todayAlarm.sensorZoneID = todayAlarmData.sensorZoneID;
            todayAlarm.isAlarm = todayAlarmData.isAlarm;
            todayAlarm.materialType = todayAlarmData.materialType;

            todayAlarms.push(todayAlarm);
        }

        return todayAlarms;
    }

    changeMode = (mode) => {
        let currentMode = this.state.mode;
        let changeMode = this.state.mode;

        if (currentMode === mode) {
            return;
        } else if (mode === DashboardResource.mode.main) {
            changeMode = DashboardResource.mode.main;
        } else if (mode === DashboardResource.mode.sub) {
            changeMode = DashboardResource.mode.sub;
        }

        this.setState({ mode: changeMode});
    }

    selectWeeklyAlarms() {
        let weeklyAlarms = [];
        let selectWeeklyAlarms = [];

        if (this.props.weeklyAlarms?.length > 0) {
            weeklyAlarms = this.props.weeklyAlarms;

            for (let i = 0; i < weeklyAlarms.length; i++) {
                const weeklyAlarm = weeklyAlarms[i];

                // 해당 날짜 알람 데이터 확인
                let chkDate = this.checkAlarmDate(weeklyAlarm.time);

                if (chkDate === true)
                    selectWeeklyAlarms.push(weeklyAlarm);
            }
        }

        return selectWeeklyAlarms;
    }

    checkAlarmDate(alarmTime) {
        const selectDay = this.state.selectDay;

        if (selectDay === null || selectDay === undefined || selectDay.length === 0) {
            return true;
        }

        let alarmDate = new Date(alarmTime);

        for (let i = 0; i < 7; i++) {
            let date = new Date(selectDay[i].value);

            if (alarmDate.getDate() === date.getDate()) {
                if (selectDay[i].checked === true)
                    return true;
                else
                    return false;
            }
        }

        return false;
    }

    displayBoardContent = () => {
        const mode = this.state.mode;

        let selectSensors = this.setSelectSensors();
        const selectWeeklyAlarms = this.selectWeeklyAlarms();

        if (mode === DashboardResource.mode.main) {
            return <Mainboard
                todayAlarms={this.props.todayAllAlarms}
                selectSensors={selectSensors}
                buildingGroupList={this.props.buildingGroupList}
                changeMode={this.changeMode}
                currentWork={this.state.currentWork}
                weeklyAlarms={this.props.weeklyAlarms}
                selectWeeklyAlarms={selectWeeklyAlarms}
                workPermit={this.props.workPermit}
            />;

        } else if (mode === DashboardResource.mode.sub) {
            return <Subboard
                selectSensors={selectSensors}
                selectDay={this.state.selectDay}
                sensorZoneHistorys={this.state.sensorZoneHistorys}
                selectWeeklyAlarms={selectWeeklyAlarms}
                workPermit={this.props.workPermit}
            />;
        }

        return <></>;
    }

    changeDay = (index) => {
        let selectDay = this.state.selectDay;

        if (selectDay.length === 0)
            return;

        let checked = selectDay[index].checked;

        if (checked === true)
            selectDay[index].checked = false;
        else
            selectDay[index].checked = true;

        this.setState({ selectDay: selectDay });

        // 선택된 날짜 설정 저장하기
        this.setSelectDay();    
    }

    async setSelectDay() {
        let selectDay = this.state.selectDay;
        let userInfo = ProjectResource.getUserInfo();
        let strSelectDay = "";

        if (userInfo === null || userInfo === undefined || selectDay === null || selectDay === undefined)
            return;

        for (let i = 0; i < 7; i++) {
            let chk = selectDay[i].checked;

            if (strSelectDay === "")
                strSelectDay = strSelectDay + selectDay[i].checked;
            else
                strSelectDay = strSelectDay + "," + selectDay[i].checked;
        }
    }

    changedDate = () => {
        // 날짜가 바뀌는 이벤트
        this.reloadDate();
    }

    async reloadDate() {
        // 선택 날짜 다시 불러오기
        this.makeWeek();

        let sensorZoneHistorys = [];

        const [sensorZoneHistorysData, message] = await DashboardController.requestWeeklyStatus();

        if (sensorZoneHistorysData !== null && sensorZoneHistorysData !== undefined)
            sensorZoneHistorys = sensorZoneHistorysData;

        this.setState({ sensorZoneHistorys: sensorZoneHistorys });
    }

    render() {

        let selectSensors = this.setSelectSensors();
        

        return (
            <aside className={dashboards.bythemDashboard + " " + dashboards.stopDragging}  >

                <div className={dashboards.dashboardContainer + " " + dashboards.dashboardHasTitle} >

                    <div className={dashboards.dashboardBody} >
                        
                        <InfoHeader selectSensors={selectSensors} mode={this.state.mode} changeMode={this.changeMode} selectDay={this.state.selectDay} changeDay={this.changeDay}  reloadDate={this.changedDate} sensorTypes={this.props.useSensorList} />

                        <div className={dashboards.infoContainer}>

                            <figure className={dashboards.infoContent}>

                                {this.displayBoardContent()}

                            </figure>

                        </div>
                        
                    </div>

                </div>

            </aside>
        );
    }
}
export default DashboardNew;