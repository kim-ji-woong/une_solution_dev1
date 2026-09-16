import React, { Component } from 'react';
import SdmsResource from '../SDMS/resource/id';
import { SDMSController } from '../SDMS/services/sdmsController';
import { SDMSDataManager } from '../SDMS/services/sdmsDataManager';

import sensor from '../SensorSimulator/css/sensor.module.css';
import $ from 'jquery';
import { SensorSimulatorController } from './services/sensorSimulatorController';

import ProjectResource from '../Root/resource/id';
import AccountResource from '../Account/resource/id';
import { isEqual } from 'lodash';

class SensorSimulator extends Component {

    constructor(props) {
        super(props);

        this.state = {
            loading: false,
            sensorList: null,
            sensorTypes: [],
            currentSensorType: null,
            selectedSensor: null,
            selectedAlarm: null,
            currentAlarms: []
        }

        this.refSelect = React.createRef();
    }

    componentDidMount() {
        this.readSensorList();
        setTimeout(() => this.checkAlarmList(), 1000);
    }

    async checkAlarmList() {
        const [alarmList, message] = await SDMSController.requestAlarm();

        if (!alarmList) {
            if (message && message.length > 0) {
                console.log("checkAlarmList Error : " + message);
            }
        }
        else {
            this.checkAlarms(alarmList);
        }

        setTimeout(() => this.checkAlarmList(), 1000);
    }

    // 알람상태가 바뀌었으면 화면을 갱신한다.
    checkAlarms(alarmList) {
        const currentAlarms = [...this.state.currentAlarms];

        const compare = isEqual(currentAlarms, alarmList);

        if (!compare) {
            console.log('Alarm list updated!');
            this.setState({ currentAlarms: alarmList });
        }
    }

    async readSensorList() {
        const [result, _, message] = await SDMSController.requestSensorList();
        const sensorList = {};

        if (result && result.length > 0) {
            const _3dOptions = await this.get3DOptions();

            const sensorTypes = [];

            for (const sensor of result) {
                this.setSensorList(sensor.sensors, _3dOptions, sensorList, sensor.sensorTypeCode);
                sensorTypes.push(sensor.sensorTypeName);
            }

            const currentSensorType = sensorTypes.length > 0 ? sensorTypes[0] : "";
            this.setState({ loading: false, sensorList, sensorTypes, currentSensorType });
        }
        else {
            if (message && message.length > 0) {
                alert(message);
            }
        }

        $('.' + sensor.trAct).click(function () {
            $('.' + sensor.trAct).removeClass(sensor.selectedArea);
            $(this).addClass(sensor.selectedArea);
        });

        $('.' + sensor.sensorName).click(function () {
            $('.' + sensor.sensorName).removeClass(sensor.selected);
            $(this).addClass(sensor.selected);
        });
    }

    setSensorList(sensors, _3dOptions, sensorList, facilityType) {
        for (const sensor of sensors) {
            const facilityName = SdmsResource.getFacilityTypeString(facilityType);

            if (facilityName.length === 0) {
                return;
            }

            let buildingGroups = sensorList[facilityName];

            if (!buildingGroups) {
                buildingGroups = {};
                sensorList[facilityName] = buildingGroups;
            }

            let zoneData = null;
            let _3dOption = null;

            for (const siteID in _3dOptions) {
                _3dOption = _3dOptions[siteID];

                const data = _3dOption.zones[sensor.sensor.zone_sn];
                if (data?.length > 3) {
                    zoneData = data;
                    break;
                }
            }

            if (!zoneData)
                continue;
            
            //const buildingData = _3dOptions.buildingIDs[zoneData[1]];
            const buildingData = _3dOption?.buildingIDs[zoneData[1]];

            if (!buildingData || buildingData.length < 3) {
                continue;
            }

            const buildingGroupName = buildingData[1];
            const buildingName = buildingData[2];

            let buildingGroup = buildingGroups[buildingGroupName];

            if (!buildingGroup) {
                buildingGroup = {};
                buildingGroups[buildingGroupName] = buildingGroup;
            }

            let building = buildingGroup[buildingName];

            if (!building) {
                building = {};
                buildingGroup[buildingName] = building;
            }

            const zoneName = zoneData[3];
            let zoneSensors = building[zoneName];

            if (!zoneSensors) {
                zoneSensors = {};
                building[zoneName] = zoneSensors;
            }

            zoneSensors[sensor.sensor.sensor_name] = sensor;
        }
    }

    async get3DOptions() {
        let siteIDs = null;
        const userInfo = await ProjectResource.initUserInfo();
        if (userInfo?.grad_sn !== AccountResource.accountLevelNo.master && userInfo?.site_sn) {
            siteIDs = [userInfo.site_sn];
        }
        
        if (siteIDs === null) {
            siteIDs = [ProjectResource.site_sn];
        }

        const [buildingGroupList, outdoorZones, errorMessage] = await SDMSController.requestBuildingGroupList(siteIDs);
        const site3dOptions = await SDMSDataManager.get3DOptions(buildingGroupList, outdoorZones, errorMessage, 0, siteIDs);

        if (site3dOptions) {
            /* 멀티 사이트 관련 수정
            for (const siteID in site3dOptions) {
                const _3dOptions = site3dOptions[siteID];
                return _3dOptions;
            }
            */
            return site3dOptions;
        }

        return null;
    }

    getSortedKeys(obj) {
        const keys = [];

        for (const keyName in obj) {
            keys.push(keyName);
        }

        keys.sort();
        return keys;
    }

    getSensorElements() {
        const sensorList = { ...this.state.sensorList };
        const currentSensorType = this.state.currentSensorType;
    
        if (!sensorList) {
            return <></>
        }
    
        const sensors = sensorList[currentSensorType];
    
        if (!sensors) {
            return <></>
        }
    
        const rootElements = [];
        rootElements.push(<input key="root-checkbox" type="checkbox" id="tab1" />);
        rootElements.push(<label key="root-label" htmlFor="tab1">{currentSensorType}</label>);
    
        let bgIndex = 1, bIndex = 1, zIndex = 1, sIndex = 1;
        const buildingGroupLiElements = [];
    
        for (const buildingGroupName of this.getSortedKeys(sensors)) {
            const bgID = "tabBG_" + bgIndex++;
            const buildingGroupElements = [];
    
            buildingGroupElements.push(<input key={'checkbox_' + bgID} type="checkbox" id={bgID} />);
            buildingGroupElements.push(<label key={'label_' + bgID} htmlFor={bgID}>{buildingGroupName}</label>);
    
            const buildingGroupData = sensors[buildingGroupName];
            const buildingLiElements = [];
    
            for (const buildingName of this.getSortedKeys(buildingGroupData)) {
                const bID = "tabB_" + bIndex++;
                const buildingElements = [];
    
                buildingElements.push(<input key={'checkbox_' + bID} type="checkbox" id={bID} />);
                buildingElements.push(<label key={'label_' + bID} htmlFor={bID}>{buildingName}</label>);
    
                const buildingData = buildingGroupData[buildingName];
                const zoneLiElements = [];
    
                for (const zoneName of this.getSortedKeys(buildingData)) {
                    const zID = "tabZ_" + zIndex++;
                    const zoneElements = [];
    
                    zoneElements.push(<input key={'checkbox_' + zID} type="checkbox" id={zID} defaultChecked />);
                    zoneElements.push(<label key={'label_' + zID} htmlFor={zID}>{zoneName}</label>);
    
                    const zoneData = buildingData[zoneName];
                    const sensorElements = [];
    
                    for (const sensorName of this.getSortedKeys(zoneData)) {
                        const _sensor = zoneData[sensorName];
                        const sID = "tabS_" + sIndex++;
                        const sensorClassName = _sensor === this.state.selectedSensor 
                            ? sensor.sensorName + " " + sensor.selected 
                            : sensor.sensorName;
    
                        sensorElements.push(
                            <li key={'sensor_' + sID} className={sensor.lastTab}>
                                <input key={'input_' + sID} type="checkbox" id={sID}/>
                                <p className={sensorClassName}>
                                    <label htmlFor={sID} onClick={() => this.onSelectSensor(_sensor)}>{sensorName}</label>
                                </p>
                            </li>
                        );
                    }
    
                    zoneElements.push(
                        <ul key={'zoneElements_' + zID} className={sensor.fiftyTab}>
                            {sensorElements}
                        </ul>
                    );
    
                    zoneLiElements.push(
                        <li key={'zoneLi_' + zID}>
                            {zoneElements}
                        </li>
                    );
                }
    
                buildingElements.push(
                    <ul key={'buildingElements_' + bID} className={sensor.fourthTab}>
                        {zoneLiElements}
                    </ul>
                );
    
                buildingLiElements.push(
                    <li key={'buildingLi_' + bID}>
                        {buildingElements}
                    </li>
                );
            }
    
            buildingGroupElements.push(
                <ul key={'buildingGroupElements_' + bgID} className={sensor.thirdTab}>
                    {buildingLiElements}
                </ul>
            );
    
            buildingGroupLiElements.push(
                <li key={'buildingGroupLi_' + bgID}>
                    {buildingGroupElements}
                </li>
            );
        }
    
        rootElements.push(
            <ul key="rootElements" className={sensor.secondTab}>
                {buildingGroupLiElements}
            </ul>
        );
    
        return rootElements;
    }
    

    getAlarmElements() {
        const currentAlarms = [...this.state.currentAlarms];
        const alarmElements = [];
        const alarmCount = currentAlarms.length;

        let index = 1;

        for (let i = 0; i < alarmCount; i++) {
            const alarm = currentAlarms[i];
            if (alarm.isAlarm) {

                const sensorType = SdmsResource.getFacilityTypeString(alarm.facilityType);
                const alarmClassName = alarm.sensorZoneHistoryNo === this.state.selectedAlarm?.sensorZoneHistoryNo ? sensor.trAct + " " + sensor.selectedArea : sensor.trAct;
    
                alarmElements.push(
                    <tr key={`${sensorType}_${index}`} className={alarmClassName} onClick={() => this.onSelectAlarm(alarm)}>
                        <td style={{ width: "8%" }}>{index}</td>
                        <td style={{ width: "25%" }}>{alarm.strDateTime}</td>
                        <td style={{ width: "37%" }}>{alarm.positionName}</td>
                        <td style={{ width: "30%" }}>{sensorType}</td>
                    </tr>
                );

                index++;
            }
        }

        return alarmElements;
    }

    onSelectAlarm(alarm) {
        this.setState({ selectedAlarm: alarm });
    }

    onSelectSensor(sensor) {
        this.setState({ selectedSensor: sensor });
    }

    getSensorTypes() {
        const sensorTypeElements = [];
        const sensorTypes = [...this.state.sensorTypes];

        for (const sensorTypeName of sensorTypes) {
            sensorTypeElements.push(
                <option key={sensorTypeName} value={sensorTypeName}>{sensorTypeName}</option>
            );
        }

        return sensorTypeElements; 
    }

    onChangeSensorType() {
        const currentSensorType = this.refSelect.current.options[this.refSelect.current.selectedIndex].value;
        this.setState({ currentSensorType, selectedSensor: null });
    }

    getSensorType(sensor) {
        return sensor.sensor.sensor_ty_code;
    }

    onClickSendAlarm = async (isAlarm, allClear) => {
        if (isAlarm) {
            const selectedSensor = this.state.selectedSensor;

            if (!selectedSensor) {
                alert("먼저 센서를 선택하세요.");
            }
            else {
                const sensorType = this.getSensorType(selectedSensor);
                const [result, message] = await SensorSimulatorController.sendAlarm(sensorType, selectedSensor.sensorZoneData.sensorZone.sensor_zone_sn);

                if (!result) {
                    alert(message);
                }
            }
        }
        else {
            const userInfo = ProjectResource.getUserInfo();

            if (userInfo) {
                if (allClear) {
                    const [result, message] = await SDMSController.clearAllAlarm(userInfo.user_sn);
                    if (!result) {
                        alert(message);
                    }
                }
                else {
                    const selectedAlarm = this.state.selectedAlarm;
    
                    if (!selectedAlarm) {
                        alert("먼저 알람을 선택하세요.");
                    }
                    else {
                        const [result, message] = await SDMSController.clearAlarm(selectedAlarm.sensorZoneHistoryNo, false, userInfo.user_sn, null, null);
                        if (!result) {
                            alert(message);
                        }
                    }
                }
    
                this.setState({ selectedAlarm: null });
            }
        }
    }

    render() {
        if (this.state.loading) {
            return <></>
        }

        return (
            <div style={{ width: '100vw', height: '100vh', backgroundColor: '#141B27', position: 'absolute', top: 0, left: 0 }}>
                <div className={sensor.sensorPopBox} style={{ backgroundColor: '#141B27' }}>
                    <div className={sensor.sensorBoxTitle}>
                        <span className={sensor.sensorText}>SensorSimulator</span>
                    </div>
                    <div className={sensor.titleArea}>
                        <span className={sensor.titleText}>센서타입 : </span>
                        <span>
                            <select ref={this.refSelect} className={sensor.sensorSelect} value={this.state.currentSensorType ?? ""} onChange={() => this.onChangeSensorType()}>
                                {
                                    this.getSensorTypes()
                                }
                            </select>
                        </span>
                    </div>

                    <div className={sensor.sensorTableArea}>
                        <div className={sensor.sensorFlex}>
                            <div className={sensor.alarmTable}>
                                <table>
                                    <thead>
                                        <tr>
                                            <th style={{ width: "8%" }}>No</th>
                                            <th style={{ width: "25%" }}>발생시간</th>
                                            <th style={{ width: "37%" }}>위치</th>
                                            <th style={{ width: "30%" }}>센서타입</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {this.getAlarmElements()}
                                    </tbody>
                                </table>
                            </div>

                            <div className={sensor.alarmBox}>
                                <span className={sensor.alarmClose2} onClick={() => this.onClickSendAlarm(false, true)}><a>전체알람해제</a></span>
                                <span className={sensor.alarmClose} onClick={() => this.onClickSendAlarm(false)}><a>알람해제</a></span>
                            </div>
                            </div>

                            <div className={sensor.sensorFlex}>
                            <div className={sensor.sensorTable}>
                                <span className={sensor.sensorList}>센서 리스트</span>
                                <div className={sensor.sensorTreeArea}>
                                    <ul className={sensor.firstTab}>
                                        <li>
                                        {
                                            this.getSensorElements()
                                        }
                                        </li>
                                    </ul>
                                </div> {/* sensorTreeArea */}
                            </div> {/* sensorTable */}
                            <div className={sensor.alarmBox2}>
                                <span className={sensor.alarmOpen} onClick={() => this.onClickSendAlarm(true)}><a>알람발생</a></span>
                            </div>
                        </div>
                    </div> {/* sensorTableArea */}

                </div>
            </div>
        );
    }
}
export default SensorSimulator;