import { ui } from 'jquery';
import React, { Component } from 'react';

// 알람 아이콘
import wonik_imgRedLightIco from '../../images/board_sos_icon.png';
import wonik_imgGrayLightIco from '../../images/board_sos_icon_gray.png';

import SDMS from '../sdms';
import SDMSMainMenu from '../sdmsMainMenu';

import SdmsResource from '../../resource/id';
import ProjectResource from '../../../Root/resource/id';

class StatusInfoZone extends Component {
    constructor(props) {
        super(props);

        this.refZoneName = React.createRef();
        this.refZoneNameList = React.createRef();
        this.refSensors = React.createRef();
        this.refSensorsList = React.createRef();
        this.refFireSensors = React.createRef();
        this.refFireSensorsList = React.createRef();
        this.refPsmSensors = React.createRef();
        this.refPsmSensorsList = React.createRef();
        this.refEtcSensors = React.createRef();
        this.refEtcSensorsList = React.createRef();

        this.refEarthquakeSensors = React.createRef();
        this.refEarthquakeSensorsList = React.createRef();
        this.refStrongWindSensors = React.createRef();
        this.refStrongWindSensorsList = React.createRef();

        this.refEnvironmentSensors = React.createRef();
        this.refEnvironmentSensorsList = React.createRef();
        this.refManufactureSensors = React.createRef();
        this.refManufactureSensorsList = React.createRef();

        this.refEmergencyBellSensors = React.createRef();
        this.refEmergencyBellSensorsList = React.createRef();
        
        this.refLaserSensors = React.createRef();
        this.refLaserSensorsList = React.createRef();
        
        this.refDoorSensors = React.createRef();
        this.refDoorSensorsList = React.createRef();

        this.refCCTVGroups = React.createRef();
        this.refCCTVGroupsList = React.createRef();
        this.refCCTVSubGroups = React.createRef();
        this.refCCTVSubGroupsList = React.createRef();
        this.refFacilityGroups = React.createRef();
        this.refFacilityGroupsList = React.createRef();
        this.refFacilitySubGroups = React.createRef();
        this.refFacilitySubGroupsList = React.createRef();

        // 사용자가 마우스로 조작하였는가?
        // true : 접혔다.
        // false : 펼쳐졌다.
        this.manualZoneNameExpand = null;
        this.showZoneNameResult = false;
        this.manualSensorsExpand = null;
        this.showSensorsResult = false;
        this.manualFireSensorsExpand = null;
        this.showFireSensorsResult = false;
        this.manualPsmSensorsExpand = null;
        this.showPsmSensorsResult = false;
        this.manualEtcSensorsExpand = null;
        this.showEtcSensorsResult = false;

        this.manualEarthquakeSensorsExpand = null;
        this.showEarthquakeSensorsResult = false;
        this.manualStrongWindSensorsExpand = null;
        this.showStrongWindSensorsResult = false;
        
        this.manualLaserSensorExpand = null;
        this.showLaserSensorResult = false;
        this.manualDoorSensorExpand = null;
        this.showDoorSensorResult = false;

        this.manualCCTVGroupsExpand = null;
        this.showCCTVGroupsResult = false;
        this.manualCCTVSubGroupsExpand = null;
        this.showCCTVSubGroupsResult = false;
        this.manualFacilityGroupsExpand = null;
        this.showFacilityGroupsResult = false;
        this.manualFacilitySubGroupsExpand = null;
        this.showFacilitySubGroupsResult = false;

        this.moveToX = this.moveToX.bind(this);
        this.prevSelectedSensor = [null, null, null];
    }

    componentDidMount() {
        this.checkChildVisible();

    }

    componentDidUpdate(prevProps, prevState) {
        this.checkChildVisible();
    }

    checkChildVisible() {
        this.checkChildVisibleData(this.refZoneName.current, this.refZoneNameList.current, this.showZoneNameResult);
        this.checkChildVisibleData(this.refSensors.current, this.refSensorsList.current, this.showSensorsResult);
        this.checkChildVisibleData(this.refFireSensors.current, this.refFireSensorsList.current, this.showFireSensorsResult);
        this.checkChildVisibleData(this.refPsmSensors.current, this.refPsmSensorsList.current, this.showPsmSensorsResult);
        this.checkChildVisibleData(this.refEtcSensors.current, this.refEtcSensorsList.current, this.showEtcSensorsResult);
        this.checkChildVisibleData(this.refCCTVGroups.current, this.refCCTVGroupsList.current, this.showCCTVGroupsResult);
        this.checkChildVisibleData(this.refCCTVSubGroups.current, this.refCCTVSubGroupsList.current, this.showCCTVSubGroupsResult);
        this.checkChildVisibleData(this.refFacilityGroups.current, this.refFacilityGroupsList.current, this.showFacilityGroupsResult);
        this.checkChildVisibleData(this.refFacilitySubGroups.current, this.refFacilitySubGroupsList.current, this.showFacilitySubGroupsResult);
        this.checkChildVisibleData(this.refEarthquakeSensors.current, this.refEarthquakeSensorsList.current, this.showEarthquakeSensorsResult);
        this.checkChildVisibleData(this.refStrongWindSensors.current, this.refStrongWindSensorsList.current, this.showStrongWindSensorsResult);
        this.checkChildVisibleData(this.refLaserSensors.current, this.refLaserSensorsList.current, this.showLaserSensorResult);
        this.checkChildVisibleData(this.refDoorSensors.current, this.refDoorSensorsList.current, this.showDoorSensorResult);
    }

    checkChildVisibleData(mainElement, listElement, showChild) {
        if (mainElement) {
            if (showChild) {
                if (mainElement.dataset.show_child !== 'true') {
                    mainElement.dataset.show_child = 'true';
                }

                if (listElement.classList.contains('on') === false) {
                    listElement.classList.add('on');
                }
            }
            else {
                if (mainElement.dataset.show_child !== 'false') {
                    mainElement.dataset.show_child = 'false';
                }

                if (listElement.classList.contains('on')) {
                    listElement.classList.remove('on');
                }
            }
        }
    }

    moveToX() {
        this.props.moveToX(SDMSMainMenu.Menu_MoveTo_Floor, this.props.zone);
    }

    moveToSensor(sensorType, sensorID) {
        if (sensorType === SDMSMainMenu.Facility) {
            this.props.moveToX(SDMSMainMenu.Menu_MoveTo_Facility, [this.props.zone.id, sensorID, this.props.zone?.siteID]);
        }
        else {
            this.props.moveToX(SDMSMainMenu.Menu_MoveTo_POI, [this.props.zone.id, sensorType, sensorID, this.props.zone?.siteID]);
        }        
    }

    onSelectSensor(sensorType, sensorID) {
        this.props.onSelectSensor(sensorType, this.props.zone.id, sensorID);
    }

    isAlarmSensor(facilityType, sensorID) {
        let alarmImgID = 'lightGrayICO';
        // let alarmImgSrc = imgGrayLightIco;
        let alarmImgSrc = wonik_imgGrayLightIco;
        
        if (this.props.sensorAlarms) {
            for (let j = 0; j < this.props.sensorAlarms.length; j++) {
                const alarm = this.props.sensorAlarms[j];
                if (!alarm.isAlarm) {
                    // 알람 발생한 센서는 상단에 있기 때문에 isAlarm=false가 나온 시점 이후에는 다 false만 있음
                    break;
                }
                if (facilityType === SdmsResource.facilityType.FIRE ||
                    (facilityType === SdmsResource.facilityType.PSM_SENSOR && SdmsResource.isPSMSensorType(facilityType)) ||
                    (facilityType === SdmsResource.facilityType.ETC && SdmsResource.isETCSensorType(facilityType)) ||
                    (facilityType === SdmsResource.facilityType.Intrusion_S1 && SdmsResource.isSVMSSensorType(facilityType))) {
                    if (/*alarm.facilityType === facilityType && */alarm.orgSensorID === sensorID && alarm.isAlarm) {
                        alarmImgID = 'lightRedICO';
                        // alarmImgSrc = imgRedLightIco;
                        alarmImgSrc = wonik_imgRedLightIco;
                        break;
                    }
                }
            }
        }
        
        return [alarmImgID, alarmImgSrc];
    }

    getSensorUI() {
        let fireSensorUI = [];
        let psmSensorUI = [];
        let etcSensorUI = [];
        let earthquakeSensorUI = [];
        let strongWindSensorUI = [];
        
        let environmentSensorUI = [];
        let manufactureSensorUI = [];
        let emergencyBellSensorUI = [];
        
        let laserSensorUI = [];
        let doorSensorUI = [];

        let cctvUI = [];
        let facilityInfosUI = [];

        const [sensorType, zoneID, sensorID] = this.props.selectedSensor;

        //const sensorList = this.props.sensorList;
        //if (sensorList === undefined || sensorList === null)
        //    return ui;
        
        if (this.props.fireSensors) {
            for (let i = 0; i < this.props.fireSensors.length; i++) {
                const sensor = this.props.fireSensors[i];
                const sensorClassName = sensorType === SDMSMainMenu.Fire_Sensor && sensorID === sensor.id ? 'viewList5DepthTxt selected' : 'viewList5DepthTxt';
                const sensorName = i18nUtil.convertText(sensor.name);

                if (sensor.zoneID === this.props.zone.id) {
                    if (this.props.isEditMode) {
                        fireSensorUI.push(
                            <li key={'fireSensor_' + sensor.id} id={'fireSensor_' + sensor.id}>
                                <span className={sensorClassName} onClick={() => this.moveToSensor(SDMSMainMenu.Fire_Sensor, sensor.id)}>{sensorName}</span>
                            </li>
                        );
                    }
                    else {
                        const [alarmImgID, alarmImgSrc] = this.isAlarmSensor(SdmsResource.facilityType.FIRE, sensor.id); // 알람이 발생한 센서인가 ?

                        // 화재센서 상태에 따라 색상 변화 수정 - K.D.R
                        let enableColor = 'grayDOTT';
                        if (sensor.enabled === true || sensor.enabled === null) {
                            enableColor = 'greenDOTT'; 
                        }

                        if (this.props.hasIndoorModel || (sensor.x && sensor.y && sensor.z)) {
                            fireSensorUI.push(
                                <li key={'fireSensor_' + sensor.id} id={'fireSensor_' + sensor.id}>
                                    <span className={sensorClassName} onClick={() => this.moveToSensor(SDMSMainMenu.Fire_Sensor, sensor.id)}>{sensorName}</span>
                                    <div className={'floatR' + ' ' + 'posiRelative' + " " + 'flexBox' + " " + 'linkArea'}>
                                        <span className={'goLink'} onClick={() => this.moveToSensor(SDMSMainMenu.Fire_Sensor, sensor.id)}><a className={'goA'}>이동</a></span>
                                        <div className={'iconHorizontal'}>
                                            <img className={'alarmImg'} id={alarmImgID} src={alarmImgSrc} />
                                            <span className={enableColor}></span>
                                        </div>
                                    </div>
                                </li>
                            );
                        }
                        else {
                            fireSensorUI.push(
                                <li key={'fireSensor_' + sensor.id} id={'fireSensor_' + sensor.id}>
                                    <span className={sensorClassName}>{sensorName}</span>
                                    <div className={'floatR' + ' ' + 'posiRelative' + " " + 'flexBox'}>
                                        <span><a/></span>
                                        <div className={'iconHorizontal'}>
                                            <img className={'alarmImg'} id={alarmImgID} src={alarmImgSrc} />
                                            <span className={enableColor}></span>
                                        </div>
                                    </div>
                                </li>
                            );
                        }
                    }
                }
            }
        }
        
        if (this.props.psmSensors) {
            for (let i = 0; i < this.props.psmSensors.length; i++) {
                const sensor = this.props.psmSensors[i];
                const sensorClassName = sensorType === SDMSMainMenu.PSM_Sensor && sensorID === sensor.id ? 'viewList5DepthTxt selected' : 'viewList5DepthTxt';
                const sensorName = i18nUtil.convertText(sensor.name);

                if (!sensor.linkedZones)
                    continue;

                if (sensor.zoneID === this.props.zone.id) {
                    if (this.props.isEditMode) {
                        psmSensorUI.push(
                            <li key={'psmSensor_' + sensor.id} id={'psmSensor_' + sensor.id}>
                                <span className={sensorClassName} onClick={() => this.moveToSensor(SDMSMainMenu.PSM_Sensor, sensor.id)}>{sensorName}</span>
                            </li>
                        );
                    }
                    else {
                        const [alarmImgID, alarmImgSrc] = this.isAlarmSensor(SdmsResource.facilityType.PSM_SENSOR, sensor.id); // 알람이 발생한 센서인가 ?
                        let enableColor = 'greenDOTT';
                        if (!sensor.enabled) {
                            enableColor = 'grayDOTT';
                        }

                        if (this.props.hasIndoorModel || (sensor.x && sensor.y && sensor.z)) {
                            psmSensorUI.push(
                                <li key={'psmSensor_' + sensor.id} id={'psmSensor_' + sensor.id}>
                                    <span className={sensorClassName} onClick={() => this.moveToSensor(SDMSMainMenu.PSM_Sensor, sensor.id)}>{sensorName}</span>
                                    <div className={'floatR' + ' ' + 'posiRelative' + " " + 'flexBox' + " " + 'linkArea'}>
                                        <span className={'goLink'} onClick={() => this.moveToSensor(SDMSMainMenu.PSM_Sensor, sensor.id)}><a className={'goA'}>이동</a></span>
                                        <div className={'iconHorizontal'}>
                                            <img className={'alarmImg'} id={alarmImgID} src={alarmImgSrc} />
                                            <span className={enableColor}></span>
                                        </div>
                                    </div>
                                </li>
                            );
                        } else {
                            psmSensorUI.push(
                                <li key={'psmSensor_' + sensor.id} id={'psmSensor_' + sensor.id}>
                                    <span className={sensorClassName}>{sensorName}</span>
                                    <div className={'floatR' + ' ' + 'posiRelative' + " " + 'flexBox'}>
                                        <span><a /></span>
                                        <div className={'iconHorizontal'}>
                                            <img className={'alarmImg'} id={alarmImgID} src={alarmImgSrc} />
                                            <span className={enableColor}></span>
                                        </div>
                                    </div>
                                </li>
                            );
                        }

                    }
                }
            }
        }

        if (this.props.etcSensors) {
            for (let i = 0; i < this.props.etcSensors.length; i++) {
                const sensor = this.props.etcSensors[i];
                const sensorName = i18nUtil.convertText(sensor.name);

                const sensorClassName = sensorType === SDMSMainMenu.Etc_Sensor && sensorID === sensor.id ? 'viewList5DepthTxt selected' : 'viewList5DepthTxt';

                if (sensor.zoneID === this.props.zone.id) {
                    if (this.props.isEditMode) {
                        etcSensorUI.push(
                            <li key={'etcSensor_' + sensor.id} id={'etcSensor_' + sensor.id}>
                                <span className={sensorClassName} onClick={() => this.moveToSensor(SDMSMainMenu.Etc_Sensor, sensor.id)}>{sensorName}</span>
                            </li>
                        );
                    }
                    else {
                        const [alarmImgID, alarmImgSrc] = this.isAlarmSensor(SdmsResource.facilityType.ETC, sensor.id); // 알람이 발생한 센서인가 ?
                        let enableColor = 'greenDOTT';
                        if (!sensor.enabled) {
                            enableColor = 'grayDOTT';
                        }

                        if (this.props.hasIndoorModel || (sensor.x && sensor.y && sensor.z)) {
                            etcSensorUI.push(
                                <li key={'etcSensor_' + sensor.id} id={'etcSensor_' + sensor.id}>
                                    <span className={sensorClassName} onClick={() => this.moveToSensor(SDMSMainMenu.Etc_Sensor, sensor.id)}>{sensorName}</span>
                                    <div className={'floatR' + ' ' + 'posiRelative' + " " + 'flexBox' + " " + 'linkArea'}>
                                        <span className={'goLink'} onClick={() => this.moveToSensor(SDMSMainMenu.Etc_Sensor, sensor.id)}>
                                            <a className={'goA'}>이동</a>
                                        </span>
                                        <div className={'iconHorizontal'}>
                                            <img className={'alarmImg'} id={alarmImgID} src={alarmImgSrc} />
                                            <span className={enableColor}></span>
                                        </div>
                                    </div>
                                </li>
                            );
                        }
                        else {
                            etcSensorUI.push(
                                <li key={'etcSensor_' + sensor.id} id={'etcSensor_' + sensor.id}>
                                    <span className={sensorClassName}>{sensorName}</span>
                                    <div className={'floatR' + ' ' + 'posiRelative' + " " + 'flexBox'}>
                                        <span><a /></span>
                                        <div className={'iconHorizontal'}>
                                            <img className={'alarmImg'} id={alarmImgID} src={alarmImgSrc} />
                                            <span className={enableColor}></span>
                                        </div>
                                    </div>
                                </li>
                            );
                        }
                    }
                }
            }
        }

        if (this.props.earthquakeSensors) {
            for (let i = 0; i < this.props.earthquakeSensors.length; i++) {
                const sensor = this.props.earthquakeSensors[i];
                const sensorClassName = sensorType === SDMSMainMenu.Earthquake_Sensor && sensorID === sensor.id ? 'viewList5DepthTxt selected' : 'viewList5DepthTxt';
                const sensorName = i18nUtil.convertText(sensor.name);

                if (sensor.zoneID === this.props.zone.id) {
                    if (this.props.isEditMode) {
                        earthquakeSensorUI.push(
                            <li key={'earthquakeSensor_' + sensor.id} id={'earthquakeSensor_' + sensor.id}>
                                <span className={sensorClassName} onClick={() => this.moveToSensor(SDMSMainMenu.Earthquake_Sensor, sensor.id)}>{sensorName}</span>
                            </li>
                        );
                    }
                    else {
                        const [alarmImgID, alarmImgSrc] = this.isAlarmSensor(SdmsResource.facilityType.Earthquake, sensor.id); // 알람이 발생한 센서인가 ?
                        let enableColor = 'greenDOTT';
                        if (!sensor.enabled) {
                            enableColor = 'grayDOTT';
                        }

                        if (this.props.hasIndoorModel || (sensor.x && sensor.y && sensor.z)) {
                            earthquakeSensorUI.push(
                                <li key={'earthquakeSensor_' + sensor.id} id={'earthquakeSensor_' + sensor.id}>
                                    <span className={sensorClassName} onClick={() => this.moveToSensor(SDMSMainMenu.Earthquake_Sensor, sensor.id)}>{sensorName}</span>
                                    <div className={'floatR' + ' ' + 'posiRelative' + " " + 'flexBox' + " " + 'linkArea'}>
                                        <span className={'goLink'} onClick={() => this.moveToSensor(SDMSMainMenu.Earthquake_Sensor, sensor.id)}><a className={'goA'}>이동</a></span>
                                        <div className={'iconHorizontal'}>
                                            <img className={'alarmImg'} id={alarmImgID} src={alarmImgSrc} />
                                            <span className={enableColor}></span>
                                        </div>
                                    </div>
                                </li>
                            );
                        } else {
                            earthquakeSensorUI.push(
                                <li key={'earthquakeSensor_' + sensor.id} id={'earthquakeSensor_' + sensor.id}>
                                    <span className={sensorClassName}>{sensorName}</span>
                                    <div className={'floatR' + ' ' + 'posiRelative' + " " + 'flexBox'}>
                                        <span><a /></span>
                                        <div className={'iconHorizontal'}>
                                            <img className={'alarmImg'} id={alarmImgID} src={alarmImgSrc} />
                                            <span className={enableColor}></span>
                                        </div>
                                    </div>
                                </li>
                            );
                        }

                    }
                }
            }
        }

        if (this.props.strongWindSensors) {
            for (let i = 0; i < this.props.strongWindSensors.length; i++) {
                const sensor = this.props.strongWindSensors[i];
                const sensorClassName = sensorType === SDMSMainMenu.Strongwind_Sensor && sensorID === sensor.id ? 'viewList5DepthTxt selected' : 'viewList5DepthTxt';
                const sensorName = i18nUtil.convertText(sensor.name);

                if (sensor.zoneID === this.props.zone.id) {
                    if (this.props.isEditMode) {
                        strongWindSensorUI.push(
                            <li key={'strongWindSensors_' + sensor.id} id={'strongWindSensors_' + sensor.id}>
                                <span className={sensorClassName} onClick={() => this.moveToSensor(SDMSMainMenu.Strongwind_Sensor, sensor.id)}>{sensorName}</span>
                            </li>
                        );
                    }
                    else {
                        const [alarmImgID, alarmImgSrc] = this.isAlarmSensor(SdmsResource.facilityType.STRONG_WIND, sensor.id); // 알람이 발생한 센서인가 ?
                        let enableColor = 'greenDOTT';
                        if (!sensor.enabled) {
                            enableColor = 'grayDOTT';
                        }

                        if (this.props.hasIndoorModel || (sensor.x && sensor.y && sensor.z)) {
                            strongWindSensorUI.push(
                                <li key={'strongWindSensors_' + sensor.id} id={'strongWindSensors_' + sensor.id}>
                                    <span className={sensorClassName} onClick={() => this.moveToSensor(SDMSMainMenu.Strongwind_Sensor, sensor.id)}>{sensorName}</span>
                                    <div className={'floatR' + ' ' + 'posiRelative' + " " + 'flexBox' + " " + 'linkArea'}>
                                        <span className={'goLink'} onClick={() => this.moveToSensor(SDMSMainMenu.Strongwind_Sensor, sensor.id)}><a className={'goA'}>이동</a></span>
                                        <div className={'iconHorizontal'}>
                                            <img className={'alarmImg'} id={alarmImgID} src={alarmImgSrc} />
                                            <span className={enableColor}></span>
                                        </div>
                                    </div>
                                </li>
                            );
                        } else {
                            strongWindSensorUI.push(
                                <li key={'strongWindSensors_' + sensor.id} id={'strongWindSensors_' + sensor.id}>
                                    <span className={sensorClassName}>{sensorName}</span>
                                    <div className={'floatR' + ' ' + 'posiRelative' + " " + 'flexBox'}>
                                        <span><a /></span>
                                        <div className={'iconHorizontal'}>
                                            <img className={'alarmImg'} id={alarmImgID} src={alarmImgSrc} />
                                            <span className={enableColor}></span>
                                        </div>
                                    </div>
                                </li>
                            );
                        }

                    }
                }
            }
        }

        if (this.props.environmentSensors) {
            for (let i = 0; i < this.props.environmentSensors.length; i++) {
                const sensor = this.props.environmentSensors[i];
                const sensorClassName = sensorType === SDMSMainMenu.Environment_Sensor && sensorID === sensor.id ? 'viewList5DepthTxt selected' : 'viewList5DepthTxt';
                const sensorName = i18nUtil.convertText(sensor.name);

                if (sensor.zoneID === this.props.zone.id) {
                    if (this.props.isEditMode) {
                        environmentSensorUI.push(
                            <li key={'environmentSensor_' + sensor.id} id={'environmentSensor_' + sensor.id}>
                                <span className={sensorClassName} onClick={() => this.moveToSensor(SDMSMainMenu.Environment_Sensor, sensor.id)}>{sensorName}</span>
                            </li>
                        );
                    }
                    else {
                        const [alarmImgID, alarmImgSrc] = this.isAlarmSensor(SdmsResource.facilityType.Environment, sensor.id); // 알람이 발생한 센서인가 ?
                        let enableColor = 'greenDOTT';
                        if (!sensor.enabled) {
                            enableColor = 'grayDOTT';
                        }

                        if (this.props.hasIndoorModel || (sensor.x && sensor.y && sensor.z)) {
                            environmentSensorUI.push(
                                <li key={'environmentSensor_' + sensor.id} id={'environmentSensor_' + sensor.id}>
                                    <span className={sensorClassName} onClick={() => this.moveToSensor(SDMSMainMenu.Environment_Sensor, sensor.id)}>{sensorName}</span>
                                    <div className={'floatR' + ' ' + 'posiRelative' + " " + 'flexBox' + " " + 'linkArea'}>
                                        <span className={'goLink'} onClick={() => this.moveToSensor(SDMSMainMenu.Environment_Sensor, sensor.id)}><a className={'goA'}>이동</a></span>
                                        <div className={'iconHorizontal'}>
                                            <img className={'alarmImg'} id={alarmImgID} src={alarmImgSrc} />
                                            <span className={enableColor}></span>
                                        </div>
                                    </div>
                                </li>
                            );
                        } else {
                            environmentSensorUI.push(
                                <li key={'environmentSensor_' + sensor.id} id={'environmentSensor_' + sensor.id}>
                                    <span className={sensorClassName}>{sensorName}</span>
                                    <div className={'floatR' + ' ' + 'posiRelative' + " " + 'flexBox'}>
                                        <span><a /></span>
                                        <div className={'iconHorizontal'}>
                                            <img className={'alarmImg'} id={alarmImgID} src={alarmImgSrc} />
                                            <span className={enableColor}></span>
                                        </div>
                                    </div>
                                </li>
                            );
                        }

                    }
                }
            }
        }

        if (this.props.manufactureSensors) {
            for (let i = 0; i < this.props.manufactureSensors.length; i++) {
                const sensor = this.props.manufactureSensors[i];
                const sensorClassName = sensorType === SDMSMainMenu.Manufacture_Sensor && sensorID === sensor.id ? 'viewList5DepthTxt selected' : 'viewList5DepthTxt';
                const sensorName = i18nUtil.convertText(sensor.name);

                if (sensor.zoneID === this.props.zone.id) {
                    if (this.props.isEditMode) {
                        manufactureSensorUI.push(
                            <li key={'manufactureSensor_' + sensor.id} id={'manufactureSensor_' + sensor.id}>
                                <span className={sensorClassName} onClick={() => this.moveToSensor(SDMSMainMenu.Manufacture_Sensor, sensor.id)}>{sensorName}</span>
                            </li>
                        );
                    }
                    else {
                        const [alarmImgID, alarmImgSrc] = this.isAlarmSensor(SdmsResource.facilityType.Manufacture, sensor.id); // 알람이 발생한 센서인가 ?
                        let enableColor = 'greenDOTT';
                        if (!sensor.enabled) {
                            enableColor = 'grayDOTT';
                        }

                        if (this.props.hasIndoorModel || (sensor.x && sensor.y && sensor.z)) {
                            manufactureSensorUI.push(
                                <li key={'manufactureSensor_' + sensor.id} id={'manufactureSensor_' + sensor.id}>
                                    <span className={sensorClassName} onClick={() => this.moveToSensor(SDMSMainMenu.Manufacture_Sensor, sensor.id)}>{sensorName}</span>
                                    <div className={'floatR' + ' ' + 'posiRelative' + " " + 'flexBox' + " " + 'linkArea'}>
                                        <span className={'goLink'} onClick={() => this.moveToSensor(SDMSMainMenu.Manufacture_Sensor, sensor.id)}><a className={'goA'}>이동</a></span>
                                        <div className={'iconHorizontal'}>
                                            <img className={'alarmImg'} id={alarmImgID} src={alarmImgSrc} />
                                            <span className={enableColor}></span>
                                        </div>
                                    </div>
                                </li>
                            );
                        } else {
                            manufactureSensorUI.push(
                                <li key={'manufactureSensor_' + sensor.id} id={'manufactureSensor_' + sensor.id}>
                                    <span className={sensorClassName}>{sensorName}</span>
                                    <div className={'floatR' + ' ' + 'posiRelative' + " " + 'flexBox'}>
                                        <span><a /></span>
                                        <div className={'iconHorizontal'}>
                                            <img className={'alarmImg'} id={alarmImgID} src={alarmImgSrc} />
                                            <span className={enableColor}></span>
                                        </div>
                                    </div>
                                </li>
                            );
                        }

                    }
                }
            }
        }

        if (this.props.laserSensors) {
            for (let i = 0; i < this.props.laserSensors.length; i++) {
                const sensor = this.props.laserSensors[i];
                const sensorClassName = sensorType === SDMSMainMenu.Laser_Sensor && sensorID === sensor.id ? 'viewList5DepthTxt selected' : 'viewList5DepthTxt';
                const sensorName = i18nUtil.convertText(sensor.name);

                if (sensor.zoneID === this.props.zone.id) {
                    if (this.props.isEditMode) {
                        environmentSensorUI.push(
                            <li key={'laserSensor_' + sensor.id} id={'laserSensor_' + sensor.id}>
                                <span className={sensorClassName} onClick={() => this.moveToSensor(SDMSMainMenu.Laser_Sensor, sensor.id)}>{sensorName}</span>
                            </li>
                        );
                    }
                    else {
                        const [alarmImgID, alarmImgSrc] = this.isAlarmSensor(SdmsResource.facilityType.Laser, sensor.id); // 알람이 발생한 센서인가 ?
                        let enableColor = 'greenDOTT';
                        if (!sensor.enabled) {
                            enableColor = 'grayDOTT';
                        }

                        if (this.props.hasIndoorModel || (sensor.x && sensor.y && sensor.z)) {
                            laserSensorUI.push(
                                <li key={'laserSensor_' + sensor.id} id={'laserSensor_' + sensor.id}>
                                    <span className={sensorClassName} onClick={() => this.moveToSensor(SDMSMainMenu.Laser_Sensor, sensor.id)}>{sensorName}</span>
                                    <div className={'floatR' + ' ' + 'posiRelative' + " " + 'flexBox' + " " + 'linkArea'}>
                                        <span className={'goLink'} onClick={() => this.moveToSensor(SDMSMainMenu.Laser_Sensor, sensor.id)}><a className={'goA'}>이동</a></span>
                                        <div className={'iconHorizontal'}>
                                            <img className={'alarmImg'} id={alarmImgID} src={alarmImgSrc} />
                                            <span className={enableColor}></span>
                                        </div>
                                    </div>
                                </li>
                            );
                        } else {
                            laserSensorUI.push(
                                <li key={'laserSensor_' + sensor.id} id={'laserSensor_' + sensor.id}>
                                    <span className={sensorClassName}>{sensorName}</span>
                                    <div className={'floatR' + ' ' + 'posiRelative' + " " + 'flexBox'}>
                                        <span><a /></span>
                                        <div className={'iconHorizontal'}>
                                            <img className={'alarmImg'} id={alarmImgID} src={alarmImgSrc} />
                                            <span className={enableColor}></span>
                                        </div>
                                    </div>
                                </li>
                            );
                        }

                    }
                }
            }
        }

        if (this.props.doorSensors) {
            for (let i = 0; i < this.props.doorSensors.length; i++) {
                const sensor = this.props.doorSensors[i];
                const sensorClassName = sensorType === SDMSMainMenu.Door_Sensor && sensorID === sensor.id ? 'viewList5DepthTxt selected' : 'viewList5DepthTxt';
                const sensorName = i18nUtil.convertText(sensor.name);

                if (sensor.zoneID === this.props.zone.id) {
                    if (this.props.isEditMode) {
                        doorSensorUI.push(
                            <li key={'doorSensor_' + sensor.id} id={'doorSensor_' + sensor.id}>
                                <span className={sensorClassName} onClick={() => this.moveToSensor(SDMSMainMenu.Door_Sensor, sensor.id)}>{sensorName}</span>
                            </li>
                        );
                    }
                    else {
                        const [alarmImgID, alarmImgSrc] = this.isAlarmSensor(SdmsResource.facilityType.DOOR, sensor.id); // 알람이 발생한 센서인가 ?
                        let enableColor = 'greenDOTT';
                        if (!sensor.enabled) {
                            enableColor = 'grayDOTT';
                        }

                        if (this.props.hasIndoorModel || (sensor.x && sensor.y && sensor.z)) {
                            doorSensorUI.push(
                                <li key={'doorSensor_' + sensor.id} id={'doorSensor_' + sensor.id}>
                                    <span className={sensorClassName} onClick={() => this.moveToSensor(SDMSMainMenu.Door_Sensor, sensor.id)}>{sensorName}</span>
                                    <div className={'floatR' + ' ' + 'posiRelative' + " " + 'flexBox' + " " + 'linkArea'}>
                                        <span className={'goLink'} onClick={() => this.moveToSensor(SDMSMainMenu.Door_Sensor, sensor.id)}><a className={'goA'}>이동</a></span>
                                        <div className={'iconHorizontal'}>
                                            <img className={'alarmImg'} id={alarmImgID} src={alarmImgSrc} />
                                            <span className={enableColor}></span>
                                        </div>
                                    </div>
                                </li>
                            );
                        } else {
                            doorSensorUI.push(
                                <li key={'doorSensor_' + sensor.id} id={'doorSensor_' + sensor.id}>
                                    <span className={sensorClassName}>{sensorName}</span>
                                    <div className={'floatR' + ' ' + 'posiRelative' + " " + 'flexBox'}>
                                        <span><a /></span>
                                        <div className={'iconHorizontal'}>
                                            <img className={'alarmImg'} id={alarmImgID} src={alarmImgSrc} />
                                            <span className={enableColor}></span>
                                        </div>
                                    </div>
                                </li>
                            );
                        }

                    }
                }
            }
        }

        if (this.props.cctvs) {
            for (let i = 0; i < this.props.cctvs.length; i++) {
                const sensor = this.props.cctvs[i];
                const sensorClassName = sensorType === SDMSMainMenu.CCTV_Type && sensorID === sensor.id ? 'viewList5DepthTxt selected' : 'viewList5DepthTxt';
                const sensorName = i18nUtil.convertText(sensor.name);

                if (sensor.zoneID === this.props.zone.id) {
                    let enableColor = 'grayDOTT';
                    if (sensor.enabled === true || sensor.enabled === null) {
                        enableColor = 'greenDOTT';
                    }

                    const [alarmImgID, alarmImgSrc] = this.isAlarmSensor(SdmsResource.facilityType.Intrusion_S1, sensor.id); // 알람이 발생한 센서인가 ?

                    cctvUI.push(
                        <li key={'cctv_' + sensor.id} id={'cctv_' + sensor.id}>
                            <span className={sensorClassName} /* style={{ width: '147px' }} */ onClick={() => this.moveToSensor(SDMSMainMenu.CCTV_Type, sensor.id)}>{sensorName}</span>
                            {
                                (this.props.isEditMode === false && (this.props.hasIndoorModel || (sensor.x && sensor.y && sensor.z))) &&
                                <>
                                    <div className={'linkArea'}>
                                        <span className={'goLink'} onClick={() => this.moveToSensor(SDMSMainMenu.CCTV_Type, sensor.id)}>
                                            <a className={'goA'}>이동</a>
                                        </span>
                                        <div className={'iconHorizontal'}>
                                            <img className={'alarmImg'} id={alarmImgID} src={alarmImgSrc} />
                                            <span className={enableColor}></span>
                                        </div>
                                   </div>
                                </>
                            }
                        </li>
                    );
                }
            }
        }

        if (this.props.facilityInfos) {

            const selectedFacility = this.props.selectedFacility;
            //getFacilityID = { this.props.getFacilityID }

            for (let i = 0; i < this.props.facilityInfos.length; i++) {
                const info = this.props.facilityInfos[i];                

                if (info.zoneID === this.props.zone.id) {
                    const sensorClassName = selectedFacility.facilityID === info.id ? 'viewList5DepthTxt selected' : 'viewList5DepthTxt';

                    facilityInfosUI.push(
                        <li key={'facilityInfo_' + info.id} id={'facilityInfo_' + info.id}>
                            <span className={sensorClassName} style={{ width: '147px' }} onClick={() => this.moveToSensor(SDMSMainMenu.Facility, info.id)}>{i18nUtil.convertText(info.facilityName)}</span>
                            {
                                (this.props.isEditMode === false) &&
                                <>
                                    <span className={'goLink'} onClick={() => this.moveToSensor(SDMSMainMenu.Facility, info.id)}>
                                        <a className={'goA'}>이동</a>
                                    </span>
                                </>
                            }
                        </li>
                    );
                }
            }
        }

        if (this.props.emergencyBellSensors) {
            for (let i = 0; i < this.props.emergencyBellSensors.length; i++) {
                const sensor = this.props.emergencyBellSensors[i];
                const sensorClassName = sensorType === SDMSMainMenu.Emergency_Sensor && sensorID === sensor.id ? 'viewList5DepthTxt selected' : 'viewList5DepthTxt';
                const sensorName = i18nUtil.convertText(sensor.name);

                if (sensor.zoneID === this.props.zone.id) {
                    if (this.props.isEditMode) {
                        emergencyBellSensorUI.push(
                            <li key={'emergencyBellSensor_' + sensor.id} id={'emergencyBellSensor_' + sensor.id}>
                                <span className={sensorClassName} onClick={() => this.moveToSensor(SDMSMainMenu.Emergency_Sensor, sensor.id)}>{sensorName}</span>
                            </li>
                        );
                    }
                    else {
                        const [alarmImgID, alarmImgSrc] = this.isAlarmSensor(SdmsResource.facilityType.EmergencyBell, sensor.id); // 알람이 발생한 센서인가 ?
                        let enableColor = 'greenDOTT';
                        if (!sensor.enabled) {
                            enableColor = 'grayDOTT';
                        }

                        if (this.props.hasIndoorModel || (sensor.x && sensor.y && sensor.z)) {
                            emergencyBellSensorUI.push(
                                <li key={'emergencyBellSensor_' + sensor.id} id={'emergencyBellSensor_' + sensor.id}>
                                    <span className={sensorClassName} onClick={() => this.moveToSensor(SDMSMainMenu.Emergency_Sensor, sensor.id)}>{sensorName}</span>
                                    <div className={'floatR' + ' ' + 'posiRelative' + " " + 'flexBox' + " " + 'linkArea'}>
                                        <span className={'goLink'} onClick={() => this.moveToSensor(SDMSMainMenu.Emergency_Sensor, sensor.id)}><a className={'goA'}>이동</a></span>
                                        <div className={'iconHorizontal'}>
                                            <img className={'alarmImg'} id={alarmImgID} src={alarmImgSrc} />
                                            <span className={enableColor}></span>
                                        </div>
                                    </div>
                                </li>
                            );
                        } else {
                            emergencyBellSensorUI.push(
                                <li key={'emergencyBellSensor_' + sensor.id} id={'emergencyBellSensor_' + sensor.id}>
                                    <span className={sensorClassName}>{sensorName}</span>
                                    <div className={'floatR' + ' ' + 'posiRelative' + " " + 'flexBox'}>
                                        <span><a /></span>
                                        <div className={'iconHorizontal'}>
                                            <img className={'alarmImg'} id={alarmImgID} src={alarmImgSrc} />
                                            <span className={enableColor}></span>
                                        </div>
                                    </div>
                                </li>
                            );
                        }

                    }
                }
            }
        }

        return [fireSensorUI, psmSensorUI, etcSensorUI, cctvUI, facilityInfosUI, earthquakeSensorUI, strongWindSensorUI, environmentSensorUI, manufactureSensorUI, emergencyBellSensorUI, laserSensorUI, doorSensorUI];
    }

    showChild(e) {
        const expand = this.props.showChild(e);

        // 현황정보 트리를 선택시 기존 선택된 POI는 선택해제 - K.D.R
        this.onSelectSensor(null, null);

        if (e.target === this.refZoneName.current) {
            this.manualZoneNameExpand = expand;
            if (this.manualZoneNameExpand && this.props.onChangeBuildingGroup) {
                this.props.onChangeBuildingGroup(this.props.zone, SDMS.SelectedStatusInfoType.zone);
            } else if (!this.manualZoneNameExpand && this.props.onChangeBuildingGroup) {
                // 층 트리가 열린 상태에서 다시 클릭하면 닫혀야 하는데 props값이 열린 상태로 유지되어서 닫히지 않는 오류 >> 층 트리가 닫힐 경우도 추가 - K.D.R
                this.props.onChangeBuildingGroup("zone", SDMS.SelectedStatusInfoType.closeZone);
            }
        }
        else if (e.target === this.refSensors.current) {
            this.manualSensorsExpand = expand;
            if (this.manualSensorsExpand && this.props.onChangeBuildingGroup) {
                this.props.onChangeBuildingGroup('sensorGroups', SDMS.SelectedStatusInfoType.sensorGroups);
            } else if (!this.manualSensorsExpand && this.props.onChangeBuildingGroup) {
                // 센서 트리가 열린 상태에서 다시 클릭하면 닫혀야 하는데 props값이 열린 상태로 유지되어서 닫히지 않는 오류 >> 센서 트리가 닫힐 경우도 추가 - K.D.R
                this.props.onChangeBuildingGroup(this.props.zone, SDMS.SelectedStatusInfoType.zone);
            }
        }
        else if (e.target === this.refFireSensors.current) {
            this.manualFireSensorsExpand = expand;
            if (this.manualFireSensorsExpand && this.props.onChangeBuildingGroup) {
                this.props.onChangeBuildingGroup('fireSensors', SDMS.SelectedStatusInfoType.fireSensors);
            } else if (!this.manualFireSensorsExpand && this.props.onChangeBuildingGroup) {
                // 화재센서 트리가 열린 상태에서 다시 클릭하면 닫혀야 하는데 props값이 열린 상태로 유지되어서 닫히지 않는 오류 >> 화재센서 트리가 닫힐 경우도 추가 - K.D.R
                this.props.onChangeBuildingGroup('sensorGroups', SDMS.SelectedStatusInfoType.sensorGroups);
            }
        }
        else if (e.target === this.refPsmSensors.current) {
            this.manualPsmSensorsExpand = expand;
            if (this.manualPsmSensorsExpand && this.props.onChangeBuildingGroup) {
                this.props.onChangeBuildingGroup('psmSensors', SDMS.SelectedStatusInfoType.psmSensors);
            } else if (!this.manualPsmSensorsExpand && this.props.onChangeBuildingGroup) {
                // PSM센서 트리가 열린 상태에서 다시 클릭하면 닫혀야 하는데 props값이 열린 상태로 유지되어서 닫히지 않는 오류 >> PSM센서 트리가 닫힐 경우도 추가 - K.D.R
                this.props.onChangeBuildingGroup('sensorGroups', SDMS.SelectedStatusInfoType.sensorGroups);
            }
        }
        else if (e.target === this.refEtcSensors.current) {
            this.manualEtcSensorsExpand = expand;
            if (this.manualEtcSensorsExpand && this.props.onChangeBuildingGroup) {
                this.props.onChangeBuildingGroup('etcSensors', SDMS.SelectedStatusInfoType.etcSensors);
            } else if (!this.manualEtcSensorsExpand && this.props.onChangeBuildingGroup) {
                // ETC센서 트리가 열린 상태에서 다시 클릭하면 닫혀야 하는데 props값이 열린 상태로 유지되어서 닫히지 않는 오류 >> ETC센서 트리가 닫힐 경우도 추가 - K.D.R
                this.props.onChangeBuildingGroup('sensorGroups', SDMS.SelectedStatusInfoType.sensorGroups);
            }
        }

        else if (e.target === this.refEarthquakeSensors.current) {
            this.manualEarthquakeSensorsExpand = expand;
            if (this.manualEarthquakeSensorsExpand && this.props.onChangeBuildingGroup) {
                this.props.onChangeBuildingGroup('earthquakSensors', SDMS.SelectedStatusInfoType.earthquakeSensors);
            } else if (!this.manualEarthquakeSensorsExpand && this.props.onChangeBuildingGroup) {
                // PSM센서 트리가 열린 상태에서 다시 클릭하면 닫혀야 하는데 props값이 열린 상태로 유지되어서 닫히지 않는 오류 >> PSM센서 트리가 닫힐 경우도 추가 - K.D.R
                this.props.onChangeBuildingGroup('sensorGroups', SDMS.SelectedStatusInfoType.sensorGroups);
            }
        }
        else if (e.target === this.refStrongWindSensors.current) {
            this.manualStrongWindSensorsExpand = expand;
            if (this.manualStrongWindSensorsExpand && this.props.onChangeBuildingGroup) {
                this.props.onChangeBuildingGroup('strongWindSensors', SDMS.SelectedStatusInfoType.strongWindSensors);
            } else if (!this.manualStrongWindSensorsExpand && this.props.onChangeBuildingGroup) {
                // PSM센서 트리가 열린 상태에서 다시 클릭하면 닫혀야 하는데 props값이 열린 상태로 유지되어서 닫히지 않는 오류 >> PSM센서 트리가 닫힐 경우도 추가 - K.D.R
                this.props.onChangeBuildingGroup('sensorGroups', SDMS.SelectedStatusInfoType.sensorGroups);
            }
        }
        
        else if (e.target === this.refLaserSensors.current) {
            this.manualLaserSensorExpand = expand;
            if (this.manualLaserSensorExpand && this.props.onChangeBuildingGroup) {
                this.props.onChangeBuildingGroup('laser', SDMS.SelectedStatusInfoType.laser);
            } else if (!this.manualLaserSensorExpand && this.props.onChangeBuildingGroup) {
                // PSM센서 트리가 열린 상태에서 다시 클릭하면 닫혀야 하는데 props값이 열린 상태로 유지되어서 닫히지 않는 오류 >> PSM센서 트리가 닫힐 경우도 추가 - K.D.R
                this.props.onChangeBuildingGroup('sensorGroups', SDMS.SelectedStatusInfoType.sensorGroups);
            }
        }
        
        else if (e.target === this.refDoorSensors.current) {
            this.manualDoorSensorExpand = expand;
            if (this.manualDoorSensorExpand && this.props.onChangeBuildingGroup) {
                this.props.onChangeBuildingGroup('door', SDMS.SelectedStatusInfoType.door);
            } else if (!this.manualDoorSensorExpand && this.props.onChangeBuildingGroup) {
                // PSM센서 트리가 열린 상태에서 다시 클릭하면 닫혀야 하는데 props값이 열린 상태로 유지되어서 닫히지 않는 오류 >> PSM센서 트리가 닫힐 경우도 추가 - K.D.R
                this.props.onChangeBuildingGroup('sensorGroups', SDMS.SelectedStatusInfoType.sensorGroups);
            }
        }

        else if (e.target === this.refCCTVGroups.current) {
            this.manualCCTVGroupsExpand = expand;
            if (this.manualCCTVGroupsExpand && this.props.onChangeBuildingGroup) {
                this.props.onChangeBuildingGroup('cctvGroups', SDMS.SelectedStatusInfoType.cctvGroups);
            } else if (!this.manualCCTVGroupsExpand && this.props.onChangeBuildingGroup) {
                // CCTV 트리가 열린 상태에서 다시 클릭하면 닫혀야 하는데 props값이 열린 상태로 유지되어 닫히지 않는 오류 >> CCTV 트리가 닫힐 경우도 추가 - K.D.R
                this.props.onChangeBuildingGroup(this.props.zone, SDMS.SelectedStatusInfoType.zone);
            }
        }
        else if (e.target === this.refCCTVSubGroups.current) {
            this.manualCCTVSubGroupsExpand = expand;
            if (this.manualCCTVSubGroupsExpand && this.props.onChangeBuildingGroup) {
                this.props.onChangeBuildingGroup('cctvSubGroups', SDMS.SelectedStatusInfoType.cctvSubGroups);
            } else if (!this.manualCCTVSubGroupsExpand && this.props.onChangeBuildingGroup) {
                // CCTV 서브트리가 열린 상태에서 다시 클릭하면 닫혀야 하는데 props값이 열린 상태로 유지되어 닫히지 않는 오류 >> CCTV 서브 트리가 닫힐 경우도 추가 - K.D.R
                this.props.onChangeBuildingGroup('cctvGroups', SDMS.SelectedStatusInfoType.cctvGroups);
            }
        }
        else if (e.target === this.refFacilityGroups.current) {
            this.manualFacilityGroupsExpand = expand;
            if (this.manualFacilityGroupsExpand && this.props.onChangeBuildingGroup) {
                this.props.onChangeBuildingGroup('facilityGroups', SDMS.SelectedStatusInfoType.facilityGroups);
            } else if (!this.manualFacilityGroupsExpand && this.props.onChangeBuildingGroup) {
                // 설비 트리가 열린 상태에서 다시 클릭하면 닫혀야 하는데 props값이 열린 상태로 유지되어서 닫히지 않는 오류 >> 설비 트리가 닫힐 경우도 추가 - K.D.R
                this.props.onChangeBuildingGroup(this.props.zone, SDMS.SelectedStatusInfoType.zone);
            }
        }
        else if (e.target === this.refFacilitySubGroups.current) {
            this.manualFacilitySubGroupsExpand = expand;
            if (this.manualFacilitySubGroupsExpand && this.props.onChangeBuildingGroup) {
                this.props.onChangeBuildingGroup('facilitySubGroups', SDMS.SelectedStatusInfoType.facilitySubGroups);
            } else if (!this.manualFacilitySubGroupsExpand && this.props.onChangeBuildingGroup) {
                // 설비 서브트리가 열린 상태에서 다시 클릭하면 닫혀야 하는데 props값이 열린 상태로 유지되어 닫히지 않는 오류 >> 설비 서브트리가 닫힐 경우도 추가 - K.D.R
                this.props.onChangeBuildingGroup('facilityGroups', SDMS.SelectedStatusInfoType.facilityGroups);
            }
        }        
    }

    isSelected() {
        let zoneShowChild = 'false';
        let sensorsShowChild = 'false';
        let fireSensorsShowChild = 'false';
        let psmSensorsShowChild = 'false';
        let etcSensorsShowChild = 'false';
        let earthquakeSensorsShowChild = 'false';
        let strongWindSensorsShowChild = 'false';
        let environmentSensorsShowChild = 'false';
        let manufactureSensorsShowChild = 'false';
        let emergencyBellSensorsShowChild = 'false';
        let laserSensorsShowChild = 'false';
        let doorSensorsShowChild = 'false';
        let cctvGroupsShowChild = 'false';
        let cctvSubGroupsShowChild = 'false';
        let facilityGroupsShowChild = 'false';
        let facilitySubGroupsShowChild = 'false';

        const [sensorType, zoneID, sensorID] = this.props.selectedSensor;

        if (this.prevSelectedSensor[0] !== sensorType ||
            this.prevSelectedSensor[1] !== zoneID ||
            this.prevSelectedSensor[2] !== sensorID) {

            this.manualZoneNameExpand = null;
            this.manualSensorsExpand = null;
            this.manualFireSensorsExpand = null;
            this.manualPsmSensorsExpand = null;
            this.manualEtcSensorsExpand = null;
            this.manualCCTVGroupsExpand = null;
            this.manualCCTVSubGroupsExpand = null;
            this.manualEarthquakeSensorsExpand = null;
            this.manualStrongWindSensorsExpand = null;
            this.manualEnvironmentSensorsExpand = null;
            this.manualManufactureSensorsExpand = null;
            this.manualEmergencyBellSensorsExpand = null;
            this.manualLaserSensorExpand = null;
            this.manualDoorSensorExpand = null;
        }

        this.prevSelectedSensor = [sensorType, zoneID, sensorID];

        if (sensorType !== null && zoneID !== null && sensorID !== null) {
            const zoneData = this.props.zone;

            if (zoneData && zoneData.id === zoneID) {
                // 선택된 센서가 있으니 Tree를 펼친다.
                zoneShowChild = 'true';

                if (sensorType === "cctv") {
                    cctvGroupsShowChild = 'true';
                    cctvSubGroupsShowChild = 'true';
                }
                else {
                    sensorsShowChild = 'true';

                    if (sensorType === "fire") {
                        fireSensorsShowChild = 'true';
                    }
                    else if (sensorType === "psm") {
                        psmSensorsShowChild = 'true';
                    }
                    else if (sensorType === "etc") {
                        etcSensorsShowChild = 'true';
                    }
                    else if (sensorType === "earthquake") {
                        earthquakeSensorsShowChild = 'true';
                    }
                    else if (sensorType === "strongWind") {
                        strongWindSensorsShowChild = 'true';
                    }
                    else if (sensorType === "environment") {
                        environmentSensorsShowChild = 'true';
                    }
                    else if (sensorType === "manufacture") {
                        manufactureSensorsShowChild = 'true';
                    }
                    else if (sensorType === "emergencyBell") {
                        emergencyBellSensorsShowChild = 'true';
                    }
                    else if (sensorType === "laser") {
                        laserSensorsShowChild = 'true';
                    }
                    else if (sensorType === "door") {
                        doorSensorsShowChild = 'true';
                    }
                }
            }
        }
        else {
            if (this.props.selectedInfo) {
                if (this.props.zone === this.props.selectedInfo.zone) {
                    zoneShowChild = 'true';

                    if (this.props.selectedInfo.sensorGroups) {
                        sensorsShowChild = 'true';
                        if (this.props.selectedInfo.fireSensors) {
                            fireSensorsShowChild = 'true';
                        }
                        else if (this.props.selectedInfo.psmSensors) {
                            psmSensorsShowChild = 'true';
                        }
                        else if (this.props.selectedInfo.etcSensors) {
                            etcSensorsShowChild = 'true';
                        }
                        else if (this.props.selectedInfo.earthquakeSensors) {
                            earthquakeSensorsShowChild = 'true';
                        }
                        else if (this.props.selectedInfo.strongWindSensors) {
                            strongWindSensorsShowChild = 'true';
                        }
                        else if (this.props.selectedInfo.environmentSensors) {
                            environmentSensorsShowChild = 'true';
                        }
                        else if (this.props.selectedInfo.manufactureSensors) {
                            manufactureSensorsShowChild = 'true';
                        }
                        else if (this.props.selectedInfo.emergencyBellSensors) {
                            emergencyBellSensorsShowChild = 'true';
                        }
                        else if (this.props.selectedInfo.laser) {
                            laserSensorsShowChild = 'true';
                        }
                        else if (this.props.selectedInfo.door) {
                            doorSensorsShowChild = 'true';
                        }
                    }                    
                    if (this.props.selectedInfo.cctvGroups) {
                        cctvGroupsShowChild = 'true';
                        if (this.props.selectedInfo.cctvSubGroups) {
                            cctvSubGroupsShowChild = 'true';
                        }
                    }                    
                    if (this.props.selectedInfo.facilityGroups) {
                        facilityGroupsShowChild = 'true';
                        if (this.props.selectedInfo.facilitySubGroups) {
                            facilitySubGroupsShowChild = 'true';
                        }
                    }                    
                }
            }
            else {
                if (this.manualZoneNameExpand !== null) {
                    zoneShowChild = this.manualZoneNameExpand ? 'true' : 'false';
                }

                if (this.manualSensorsExpand !== null) {
                    sensorsShowChild = this.manualSensorsExpand ? 'true' : 'false';
                }

                if (this.manualFireSensorsExpand !== null) {
                    fireSensorsShowChild = this.manualFireSensorsExpand ? 'true' : 'false';
                }

                if (this.manualPsmSensorsExpand !== null) {
                    psmSensorsShowChild = this.manualPsmSensorsExpand ? 'true' : 'false';
                }

                if (this.manualEtcSensorsExpand !== null) {
                    etcSensorsShowChild = this.manualEtcSensorsExpand ? 'true' : 'false';
                }

                if (this.manualEarthquakeSensorsExpand !== null) {
                    earthquakeSensorsShowChild = this.manualEarthquakeSensorsExpand ? 'true' : 'false';
                }

                if (this.manualStrongWindSensorsExpand !== null) {
                    strongWindSensorsShowChild = this.manualStrongWindSensorsExpand ? 'true' : 'false';
                }

                if (this.manualEnvironmentSensorsExpand !== null) {
                    environmentSensorsShowChild = this.manualEnvironmentSensorsExpand ? 'true' : 'false';
                }

                if (this.manualManufactureSensorsExpand !== null) {
                    manufactureSensorsShowChild = this.manualManufactureSensorsExpand ? 'true' : 'false';
                }

                if (this.manualEmergencyBellSensorsExpand !== null) {
                    emergencyBellSensorsShowChild = this.manualEmergencyBellSensorsExpand ? 'true' : 'false';
                }
                
                if (this.manualLaserSensorExpand !== null) {
                    laserSensorsShowChild = this.manualLaserSensorExpand ? 'true' : 'false';
                }
                
                if (this.manualDoorSensorExpand !== null) {
                    doorSensorsShowChild = this.manualDoorSensorExpand ? 'true' : 'false';
                }

                if (this.manualCCTVGroupsExpand !== null) {
                    cctvGroupsShowChild = this.manualCCTVGroupsExpand ? 'true' : 'false';
                }

                if (this.manualCCTVSubGroupsExpand !== null) {
                    cctvSubGroupsShowChild = this.manualCCTVSubGroupsExpand ? 'true' : 'false';
                }

                if (this.manualFacilityGroupsExpand !== null) {
                    facilityGroupsShowChild = this.manualFacilityGroupsExpand ? 'true' : 'false';
                }

                if (this.manualFacilitySubGroupsExpand !== null) {
                    facilitySubGroupsShowChild = this.manualFacilitySubGroupsExpand ? 'true' : 'false';
                }
            }
        }

        return [zoneShowChild, sensorsShowChild, fireSensorsShowChild, psmSensorsShowChild, etcSensorsShowChild, cctvGroupsShowChild, cctvSubGroupsShowChild, facilityGroupsShowChild, facilitySubGroupsShowChild, earthquakeSensorsShowChild, strongWindSensorsShowChild, environmentSensorsShowChild, manufactureSensorsShowChild, emergencyBellSensorsShowChild, laserSensorsShowChild, doorSensorsShowChild];
    }

    render() {
        let [fireSensorUI, psmSensorUI, etcSensorUI, cctvUI, facilityInfosUI, earthquakeSensorUI, strongWindSensorUI, environmentSensorUI, manufactureSensorUI, emergencyBellSensorUI, laserSensorUI, doorSensorUI] = this.getSensorUI();
        const [zoneShowChild, sensorsShowChild, fireSensorsShowChild, psmSensorsShowChild, etcSensorsShowChild, cctvGroupsShowChild, cctvSubGroupsShowChild, facilityGroupsShowChild, facilitySubGroupsShowChild, earthquakeSensorsShowChild, strongWindSensorsShowChild, environmentSensorsShowChild, manufactureSensorsShowChild, emergencyBellSensorsShowChild, laserSensorsShowChild, doorSensorsShowChild ] = this.isSelected();
        this.showZoneNameResult = zoneShowChild === 'true';
        this.showSensorsResult = sensorsShowChild === 'true';
        this.showFireSensorsResult = fireSensorsShowChild === 'true';
        this.showPsmSensorsResult = psmSensorsShowChild === 'true';
        this.showEtcSensorsResult = etcSensorsShowChild === 'true';
        this.showCCTVGroupsResult = cctvGroupsShowChild === 'true';
        this.showCCTVSubGroupsResult = cctvSubGroupsShowChild === 'true';
        this.showFacilityGroupsResult = facilityGroupsShowChild === 'true';
        this.showFacilitySubGroupsResult = facilitySubGroupsShowChild === 'true';

        this.showEarthquakeSensorsResult = earthquakeSensorsShowChild === 'true';
        this.showStrongWindSensorsResult = strongWindSensorsShowChild === 'true';
        
        this.showLaserSensorResult = laserSensorsShowChild === 'true';
        this.showDoorSensorResult = doorSensorsShowChild === 'true';

        const zoneName = this.props.zone.displayText ? i18nUtil.convertText(this.props.zone.displayText) : i18nUtil.convertText(this.props.zone.name);

        const fireSensorCount = (this.props.fireSensors) ? this.props.fireSensors.length : 0;
        const psmSensorCount = (this.props.psmSensors) ? this.props.psmSensors.length : 0;
        const etcSensorCount = (this.props.etcSensors) ? this.props.etcSensors.length : 0;
        const earthquakeSensorCount = (this.props.earthquakeSensors) ? this.props.earthquakeSensors.length : 0;
        const strongWindSensorCount = (this.props.strongWindSensors) ? this.props.strongWindSensors.length : 0;
        const environmentSensorCount = (this.props.environmentSensors) ? this.props.environmentSensors.length : 0;
        const manufactureSensorCount = (this.props.manufactureSensors) ? this.props.manufactureSensors.length : 0;
        const emergencyBellSensorCount = (this.props.emergencyBellSensors) ? this.props.emergencyBellSensors.length : 0;
        const laserSensorCount = (this.props.laserSensors) ? this.props.laserSensors.length : 0;
        const doorSensorCount = (this.props.doorSensors) ? this.props.doorSensors.length : 0;
        const cctvCount = (this.props.cctvs) ? this.props.cctvs.length : 0;
        const facilityCount = (this.props.facilityInfos) ? this.props.facilityInfos.length : 0;

        let allSensorCount = 0;

        if(ProjectResource.SiteNo === ProjectResource.Site.GG_A) {
            allSensorCount = fireSensorCount + psmSensorCount + etcSensorCount + emergencyBellSensorCount;
        }
        else {
            allSensorCount = fireSensorCount + psmSensorCount + etcSensorCount;
        }

        let sensorUI = [];

        if (this.props.useSensorTypes?.UseFire === true) {
            sensorUI.push(
                <li key={"UseFire_" + fireSensorCount}>
                    <span ref={this.refFireSensors} className={'viewList4DepthHead'} data-show_child={fireSensorsShowChild} data-target_class='viewList4Depth' onClick={(e) => { this.showChild(e) }}>화재센서 ({fireSensorCount})</span>
                    <ul ref={this.refFireSensorsList} className={fireSensorsShowChild === 'true' ? 'viewList5Depth on' : 'viewList5Depth'}>
                        {fireSensorUI}
                    </ul>
                </li>
            );
        }
        if (this.props.useSensorTypes?.UseETC === true) {
            sensorUI.push(
                <li key={"UseETC_" + etcSensorCount}>
                    <span ref={this.refEtcSensors} className={'viewList4DepthHead'} data-show_child={etcSensorsShowChild} data-target_class='viewList4Depth' onClick={(e) => { this.showChild(e) }}>기타센서 ({etcSensorCount})</span>
                    <ul ref={this.refEtcSensorsList} className={etcSensorsShowChild === 'true' ? 'viewList5Depth on' : 'viewList5Depth'}>
                        {etcSensorUI}
                    </ul>
                </li>
            );
        }
        if (this.props.useSensorTypes?.UseEarthquake === true && ProjectResource.SiteNo !== ProjectResource.Site.GG_A) {
            sensorUI.push(
                <li key={"UseEarthquake" + earthquakeSensorCount}>
                    <span ref={this.refEarthquakeSensors} className={'viewList4DepthHead'} data-show_child={earthquakeSensorsShowChild} data-target_class='viewList4Depth' onClick={(e) => { this.showChild(e) }}>지진센서 ({earthquakeSensorCount})</span>
                    <ul ref={this.refEarthquakeSensorsList} className={earthquakeSensorsShowChild === 'true' ? 'viewList5Depth on' : 'viewList5Depth'}>
                        {earthquakeSensorUI}
                    </ul>
                </li>
            );
        }

        if (this.props.useSensorTypes?.UseEmergencyBell === true) {
            sensorUI.push(
                <li key={"UseEmergencyBell" + manufactureSensorCount}>
                    <span ref={this.refEmergencyBellSensors} className={'viewList4DepthHead'} data-show_child={emergencyBellSensorsShowChild} data-target_class='viewList4Depth' onClick={(e) => { this.showChild(e) }}>비상벨 ({emergencyBellSensorCount})</span>
                    <ul ref={this.refEmergencyBellSensorsList} className={emergencyBellSensorsShowChild === 'true' ? 'viewList5Depth on' : 'viewList5Depth'}>
                        {emergencyBellSensorUI}
                    </ul>
                </li>
            );
        }

        return (            
            <li>
                <div id={this.props.id} className={'viewList2DepthHead'}>
                    <span ref={this.refZoneName} className={'viewList2DepthSpen'} data-show_child={zoneShowChild} data-target_class='viewList2Depth' onClick={(e) => { this.showChild(e) }}>{zoneName}</span>
                    {
                        // .TODO: 수소 관련 분기 임시 해제
                        (this.props.hasIndoorModel)
                            ? <span className={'goLink'} onClick={this.moveToX}><a className={'goA'}>이동</a></span> : <></>
                    }
                </div>
                {
                    this.props.sensorList &&
                    <ul ref={this.refZoneNameList} id={'zoneArea_' + this.props.zone.id} className={zoneShowChild === 'true' ? 'viewList3Depth on' : 'viewList3Depth'}>
                        <li>
                            <div ref={this.refSensors} id={'sensorGroups_' + this.props.zone.id} className={'viewList3DepthHead'} data-show_child={sensorsShowChild} data-target_class='viewList3Depth' onClick={(e) => { this.showChild(e) }}>센서 ({allSensorCount})</div>
                            <ul ref={this.refSensorsList} id={'sensorGroupsArea_' + this.props.zone.id} className={sensorsShowChild === 'true' ? 'viewList4Depth on' : 'viewList4Depth'}>
                                {sensorUI}
                            </ul>
                        </li>
                        <li>
                            <div ref={this.refCCTVGroups} id={'cctvGroups_' + this.props.zone.id} className={'viewList3DepthHead'} data-show_child={cctvGroupsShowChild} data-target_class='viewList3Depth' onClick={(e) => { this.showChild(e) }}>CCTV ({cctvCount})</div>
                            <ul ref={this.refCCTVGroupsList} id={'cctvGroupsArea_' + this.props.zone.id} className={cctvGroupsShowChild === 'true' ? 'viewList4Depth on' : 'viewList4Depth'}>
                                <li>
                                    <span ref={this.refCCTVSubGroups} className={'viewList4DepthHead'} data-show_child={cctvSubGroupsShowChild} data-target_class='viewList4Depth' onClick={(e) => { this.showChild(e) }}>CCTV ({cctvCount})</span>

                                    <ul ref={this.refCCTVSubGroupsList} className={cctvSubGroupsShowChild === 'true' ? 'viewList5Depth on' : 'viewList5Depth'}>
                                        {cctvUI}
                                    </ul>
                                </li>
                            </ul>
                        </li>
                    </ul>
                }
            </li>
        );
    }
}

export default StatusInfoZone;