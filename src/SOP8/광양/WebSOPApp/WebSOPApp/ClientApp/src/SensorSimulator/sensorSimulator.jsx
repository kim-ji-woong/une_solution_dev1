import React, { Component } from 'react';
import SdmsResource from '../SDMS/resource/id';
import { SDMSController } from '../SDMS/services/sdmsController';
import { SDMSDataManager } from '../SDMS/services/sdmsDataManager';

import $ from 'jquery';
import { SensorSimulatorController } from './services/sensorSimulatorController';

import ProjectResource from '../Root/resource/id';
import AccountResource from '../Account/resource/id';
import { isEqual } from 'lodash';
import ConfirmDialog from "../Common/ui/confirmDialog";
import SettingsStore from "../Settings/settingsStore";
import { SensorSimulatorComponent } from './styled/sensorSimulatorStyled';
import DropBox from '../Common/components/dropBox';
import BoxButton from '../Common/components/boxButton';

class SensorSimulator extends Component {
    
    constructor(props) {
        super(props);

        this.state = {
            loading: false,
            openDropId: null,
            sensorList: null,
            sensorTypes: [],
            currentSensorType: null,
            selectedSensor: null,
            selectedAlarm: null,
            checkedAlarms: new Set(),
            currentAlarms: [],
            commonSettings: SettingsStore.getState().commonSettings,
            useReceiveEventSettings: null,

            confirmDialog: {
                visible: false,
                type: null,
                messages: [""],
                buttons: ["확인"],
                onClickButton: null
            }
        }

        this.refSelect = React.createRef();
        this.alarmCheckTimer = null;
        
        this.unSubscribeSettingsStore = SettingsStore.subscribe(() => {
            const data = SettingsStore.getState();
            if (data.actionType === 'COMMON_SETTINGS') {
                const commonSettings = data.commonSettings;
                this.setUseReceiveEventSettings(data.commonSettings)
                this.setState({ commonSettings });
            }
        });
    }

    componentDidMount() {
        this.readSensorList();
        this.setUseReceiveEventSettings(this.state.commonSettings ? this.state.commonSettings : null);
        this.alarmCheckTimer = setTimeout(() => this.checkAlarmList(), 1000);
    }
    
    componentWillUnmount() {
        
        if (this.unSubscribeSettingsStore) {
            this.unSubscribeSettingsStore();
        }
        
        if (this.alarmCheckTimer) {
            clearTimeout(this.alarmCheckTimer);
            this.alarmCheckTimer = null;
        }
    }
    
    showConfirmDialog = (type, messages, buttons, onClickButton) => {
        const confirmDialog = {};
        confirmDialog.visible = true;
        confirmDialog.type = type;
        confirmDialog.messages = messages;
        confirmDialog.buttons = buttons;
        confirmDialog.onClickButton = onClickButton;

        if (!messages) {
            confirmDialog.messages = [""];
        }
        else if (Array.isArray(messages)) {
            confirmDialog.messages = messages;
        }
        else {
            confirmDialog.messages = [messages];
        }

        this.setState({ confirmDialog });
    }
    
    onCloseConfirmDialog = () => {
        const confirmDialog = {};
        confirmDialog.visible = false;
        
        this.setState({ confirmDialog });
    }

    setUseReceiveEventSettings = (commonSettings) => {
        if (!commonSettings || typeof commonSettings !== 'object')
            return;
        
        const sdmsSettings = commonSettings.find((category) => category.categoryType === 'SDMS');
        let useReceiveEventSettings = {};
        
        sdmsSettings.settingDatas.forEach((setting) => {
            if (setting.name.includes('UseReceive')) {
                useReceiveEventSettings[setting.name] = setting.value;
            }
        })
        
        this.setState({ useReceiveEventSettings });
    }

    async checkAlarmList() {
        // 컴포넌트가 언마운트된 이후 재귀 호출 중단
        if (!this.alarmCheckTimer) {
            return;
        }

        const [alarmList, message] = await SDMSController.requestAlarm();

        if (!alarmList) {
            if (message && message.length > 0) {
                console.log("checkAlarmList Error : " + message);
                this.showConfirmDialog(ProjectResource.dialogTypes.ERROR, ["센서 정보를 불러올 수 없습니다."], null, null)
            }
        } else {
            this.checkAlarms(alarmList);
        }

        if (this.alarmCheckTimer) {
            this.alarmCheckTimer = setTimeout(() => this.checkAlarmList(), 1000);
        }
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
                this.showConfirmDialog(ProjectResource.dialogTypes.ERROR, [message], null, null);
            }
        }

        $('.trAct').click(function () {
            $('.trAct').removeClass("selectedArea");
            $(this).addClass("selectedArea");
        });

        $('.sensorName').click(function () {
            $('.sensorName').removeClass("selected");
            $(this).addClass("selected");
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
        if (userInfo?.grad_sn !== AccountResource.accountLevelID.master && userInfo?.site_sn) {
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
    
                    zoneElements.push(<input key={'checkbox_' + zID} type="checkbox" id={zID} />);
                    zoneElements.push(<label key={'label_' + zID} htmlFor={zID}>{zoneName}</label>);
    
                    const zoneData = buildingData[zoneName];
                    const sensorElements = [];
    
                    for (const sensorName of this.getSortedKeys(zoneData)) {
                        const _sensor = zoneData[sensorName];
                        const sID = "tabS_" + sIndex++;
                        const sensorClassName = _sensor === this.state.selectedSensor 
                            ? "sensorName selected" 
                            : "sensorName";
                        
                        if (!this.isAlarmSensor(_sensor) || !this.isAlarmMaterial(_sensor))
                            continue;
    
                        sensorElements.push(
                            <li key={'sensor_' + sID} className="lastTab">
                                <input key={'input_' + sID} type="checkbox" id={sID}/>
                                <p className={sensorClassName}>
                                    <label htmlFor={sID} onClick={() => this.onSelectSensor(_sensor)}>{sensorName}</label>
                                </p>
                            </li>
                        );
                    }
    
                    zoneElements.push(
                        <ul key={'zoneElements_' + zID} className="fifthTab">
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
                    <ul key={'buildingElements_' + bID} className="fourthTab">
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
                <ul key={'buildingGroupElements_' + bgID} className="thirdTab">
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
            <ul key="rootElements" className="secondTab">
                {buildingGroupLiElements}
            </ul>
        );
    
        return rootElements;
    }
    
    isAlarmSensor = (sensor) => {
        return !(sensor.sensor.sensor_ty_code === SdmsResource.facilityType.ETC ||
            sensor.sensor.sensor_ty_code === SdmsResource.facilityType.FIRE ||
            sensor.sensor.sensor_ty_code === SdmsResource.facilityType.CCTV);
    } 
    
    isAlarmMaterial = (sensor) => {
        return !(sensor.sensor.subTypeName === "Temp" ||
            sensor.sensor.subTypeName === "Humi" ||
            sensor.sensor.subTypeName === "WD" ||
            sensor.sensor.subTypeName === "WS");
        
    }
    
    isNoneAlarmTypeCode = (sensor_ty_code) => {
        return sensor_ty_code === SdmsResource.facilityType.FIRE ||
               sensor_ty_code === SdmsResource.facilityType.CCTV ||
               sensor_ty_code === SdmsResource.facilityType.ETC;
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
                const isChecked = this.state.checkedAlarms.has(alarm.sensorZoneHistoryNo);
                const isSelected = alarm.sensorZoneHistoryNo === this.state.selectedAlarm?.sensorZoneHistoryNo;
                const alarmClassName = isSelected ? "trAct selectedArea" : "trAct";

                alarmElements.push(
                    <tr key={`${sensorType}_${index}`} className={alarmClassName} onClick={() => this.onSelectAlarm(alarm)}>
                        <td>
                            <input type="checkbox" checked={isChecked} onChange={() => this.onToggleAlarmCheck(alarm.sensorZoneHistoryNo)} />
                        </td>
                        <td>{index}</td>
                        <td>{alarm.strDateTime}</td>
                        <td>{alarm.positionName}</td>
                        <td>{sensorType}</td>
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

    setOpenDropId = (id) => {
        this.setState({ openDropId: id });
    }

    onToggleAlarmCheck = (alarmNo) => {
        this.setState(prev => {
            const checkedAlarms = new Set(prev.checkedAlarms);
            if (checkedAlarms.has(alarmNo)) {
                checkedAlarms.delete(alarmNo);
            } else {
                checkedAlarms.add(alarmNo);
            }
            return { checkedAlarms };
        });
    }

    onToggleAllAlarmCheck = () => {
        const activeAlarms = this.state.currentAlarms.filter(a => a.isAlarm);
        const allChecked = activeAlarms.length > 0 && activeAlarms.every(a => this.state.checkedAlarms.has(a.sensorZoneHistoryNo));
        if (allChecked) {
            this.setState({ checkedAlarms: new Set() });
        } else {
            const checkedAlarms = new Set(activeAlarms.map(a => a.sensorZoneHistoryNo));
            this.setState({ checkedAlarms });
        }
    }

    getSensorTypes() {
        const sensorTypes = [...this.state.sensorTypes];
        return sensorTypes.map(name => ({ value: name, label: name }));
    }

    onChangeSensorType = (value) => {
        this.setState({ currentSensorType: value, selectedSensor: null });
    }

    getSensorType(sensor) {
        return sensor.sensor.sensor_ty_code;
    }

    onClickSendAlarm = async (isAlarm, allClear) => {
        if (isAlarm) {
            const selectedSensor = this.state.selectedSensor;

            if (!selectedSensor) {
                this.showConfirmDialog(ProjectResource.dialogTypes.WARNING, ["센서를 선택해주세요."], null, null);
                return;
            }

            const sensorType = this.getSensorType(selectedSensor);
            
            const useReceiveEventSettings = this.state.useReceiveEventSettings;
            
            if (!useReceiveEventSettings)
                return this.showConfirmDialog(ProjectResource.dialogTypes.ERROR, ["이벤트 수신 여부에 대한 정보를 불러올 수 없습니다."], null, null);
            
            if (useReceiveEventSettings["UseReceive" + SdmsResource.getSensorCodeString(sensorType)] !== "true")
                return this.showConfirmDialog(ProjectResource.dialogTypes.INFO, ["이벤트 수신 여부를 확인해주세요."], null, null);
            
            const [result, message] = await SensorSimulatorController.sendAlarm(sensorType, selectedSensor.sensorZoneData.sensorZone.sensor_zone_sn);

            if (!result) {
                this.showConfirmDialog(ProjectResource.dialogTypes.ERROR, [message], null, null);
            }
        }
        else {
            const userInfo = ProjectResource.getUserInfo();

            if (userInfo) {
                if (allClear) {
                    const [result, message] = await SDMSController.clearAllAlarm(userInfo.user_sn);
                    if (!result) {
                        this.showConfirmDialog(ProjectResource.dialogTypes.ERROR, [message], null, null);
                    }
                }
                else {
                    const checkedAlarms = this.state.checkedAlarms;

                    if (checkedAlarms.size === 0) {
                        this.showConfirmDialog(ProjectResource.dialogTypes.ERROR, ["알람을 선택해주세요."], null, null);
                    }
                    else {
                        for (const alarmNo of checkedAlarms) {
                            const [result, message] = await SDMSController.clearAlarm(alarmNo, false, userInfo.user_sn, null, null);
                            if (!result) {
                                this.showConfirmDialog(ProjectResource.dialogTypes.ERROR, [message], null, null);
                                break;
                            }
                        }
                    }
                }
    
                this.setState({ selectedAlarm: null, checkedAlarms: new Set() });
            }
        }
    }

    render() {
        const { openDropId, currentSensorType, currentAlarms, checkedAlarms } = this.state;

        if (this.state.loading) {
            return <></>
        }

        const activeAlarms = currentAlarms.filter(a => a.isAlarm);
        const allChecked = activeAlarms.length > 0 && activeAlarms.every(a => checkedAlarms.has(a.sensorZoneHistoryNo));

        return (
            <SensorSimulatorComponent>
                <div className="sensorPopBox">
                    <div className="sensorBoxTitle">
                        <span className="sensorText">Sensor Test</span>
                    </div>

                    <div className="sensorTableArea">
                        {/* 왼쪽: 센서 리스트 */}
                        <div className="tableWrap">
                            <div className="sensorTable">
                                <div className="sensorListHeader">
                                    <span className="sensorListTitle">센서 리스트</span>
                                    <DropBox
                                        size="sm"
                                        id="sensorType"
                                        value={currentSensorType}
                                        onChange={this.onChangeSensorType}
                                        options={this.getSensorTypes()}
                                        openId={openDropId}
                                        setOpenId={this.setOpenDropId}
                                    />
                                </div>
                                <div className="sensorTreeArea">
                                    <ul className="firstTab">
                                        <li>
                                            {this.getSensorElements()}
                                        </li>
                                    </ul>
                                </div>
                            </div>
                            <div className="buttonWrap">
                                <BoxButton
                                    variant="fill"
                                    size="sm"
                                    onClick={() => this.onClickSendAlarm(true)}
                                >
                                    알람 발생
                                </BoxButton>
                            </div>
                        </div>

                        {/* 오른쪽: 알람 테이블 */}
                        <div className="tableWrap">
                            <div className="alarmTable">
                                <div className="alarmTableScroll">
                                    <table>
                                        <colgroup>
                                            <col style={{ width: '8%' }} />
                                            <col style={{ width: '8%' }} />
                                            <col style={{ width: '28%' }} />
                                            <col style={{ width: '28%' }} />
                                            <col style={{ width: '28%' }} />
                                        </colgroup>
                                        <thead>
                                            <tr>
                                                <th>
                                                    <input type="checkbox" checked={allChecked} onChange={this.onToggleAllAlarmCheck} />
                                                </th>
                                                <th>No</th>
                                                <th>발생 시간</th>
                                                <th>위치</th>
                                                <th>센서 유형</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {this.getAlarmElements()}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                            <div className="buttonWrap">
                                <BoxButton
                                    variant="ghost"
                                    size="sm"
                                    onClick={() => this.onClickSendAlarm(false, true)}
                                >
                                    알람 전체해제
                                </BoxButton>
                                <BoxButton
                                    variant="ghost"
                                    size="sm"
                                    disabled={checkedAlarms.size === 0}
                                    onClick={() => this.onClickSendAlarm(false)}
                                >
                                    알람 선택해제
                                </BoxButton>
                            </div>
                        </div>
                    </div>
                </div>
                {
                    this.state.confirmDialog.visible &&
                    <ConfirmDialog
                        type={this.state.confirmDialog.type}
                        messages={this.state.confirmDialog.messages}
                        buttons={this.state.confirmDialog.buttons}
                        onClickButton={this.state.confirmDialog.onClickButton}
                        onCloseConfirmDialog={this.onCloseConfirmDialog}
                    />
                }
            </SensorSimulatorComponent>
        );
    }
}
export default SensorSimulator;