import React, { Component } from 'react';
import $ from 'jquery';

import dashboard from '../../css/dashboardNew.module.css';

import DashboardResource from '../../resource/id';
import SDMSResource from '../../../SDMS/resource/id';
import ProjectResource from '../../../Root/resource/id';

class AlarmComponet extends Component {
    constructor(props) {
        super(props);

        this.state = {
            open: true,
            type: DashboardResource.displayInfoType.FIRE,
        }

        this.props = props;
    }

    componentWillUpdate(nextProps, nextState) {
        if (this.props.type !== nextProps.type && nextProps.type !== DashboardResource.displayInfoType.SAFETY_EYE)
            this.state.type = nextProps.type;
    }

    init = () => {
        const buildingGroupID = this.props.buildingGroupID;
        const buildingID = this.props.buildingID;
        const buildingGroupList = this.props.buildingGroupList;
        const selectSensors = this.props.selectSensors;
        let todayAlarms = [];

        if (this.props.todayAlarms !== null && this.props.todayAlarms !== undefined)
            todayAlarms = this.props.todayAlarms;

        let sensorList = {};
        sensorList.fireSensors = [];
        sensorList.disabledFireSensors = [];

        sensorList.psmSensors = [];
        sensorList.disabledPSMSensors = [];

        sensorList.pmSensors = [];
        sensorList.disabledPmSensors = [];

        sensorList.msSensors = [];
        sensorList.disabledMsSensors = [];

        sensorList.sumpSensors = [];
        sensorList.disabledSumpSensors = [];

        sensorList.etcSensors = [];
        sensorList.disabledEtcSensors = [];

        sensorList.cctvs = [];
        sensorList.disabledCCTVs = [];

        let alarms = {};
        alarms.fireAlarm = 0;
        alarms.psmAlarm = 0;
        alarms.pmAlarm = 0;
        alarms.msAlarm = 0;
        alarms.sumpAlarm = 0;
        alarms.cctvAlarm = 0;
        alarms.etcAlarm = 0;

        let currentAlarm = {};
        let currentFireAlarm = false;
        let currentPSMAlarm = false;
        let currentPMAlarm = false;
        let currentMSAlarm = false;
        let currentSumpAlarm = false;
        let currentETCAlarm = false;
        let currentCCTVAlarm = false;

        currentAlarm.fireAlarm = currentFireAlarm;
        currentAlarm.psmAlarm = currentPSMAlarm;
        currentAlarm.pmAlarm = currentPMAlarm;
        currentAlarm.msAlarm = currentMSAlarm;
        currentAlarm.sumpAlarm = currentSumpAlarm;
        currentAlarm.etcAlarm = currentETCAlarm;
        currentAlarm.cctvAlarm = currentCCTVAlarm;

        let buildingGroupName = "";
        let displayText = "";

        if (((buildingGroupID === null || buildingGroupID === undefined) && (buildingID === null || buildingID === undefined))||
            buildingGroupList === null || buildingGroupList === undefined ||
            selectSensors === null || selectSensors === undefined)
            return [buildingGroupName, displayText, sensorList, alarms, currentAlarm];


        // 선택된 센서 리스트
        let fireSensors = [];
        let disabledFireSensors = [];
        let psmSensors = [];
        let disabledPSMSensors = [];
        let pmSensors = [];
        let disabledPMSensors = [];
        let msSensors = [];
        let disabledMSSensors = [];
        let sumpSensors = [];
        let disabledSumpSensors = [];
        let etcSensors = [];
        let disabledEtcSensors = [];
        let cctvs = [];
        let disabledCCTVs = [];

        let fireAlarm = 0;
        let psmAlarm = 0;
        let pmAlarm = 0;
        let msAlarm = 0;
        let sumpAlarm = 0;
        let etcAlarm = 0;
        let cctvAlarm = 0;

        for (let i = 0; i < this.props.buildingGroupList.length; i++) {
            let buildingGroup = this.props.buildingGroupList[i];

            if ((buildingID === null && buildingGroupID !== buildingGroup.buildingGroupNo) ||
                (buildingGroupID === null && (buildingID === null || buildingID === undefined)))
                continue;

            if (buildingGroupID === buildingGroup.buildingGroupNo) {
                buildingGroupName = buildingGroup.name;
                displayText = buildingGroup.displayText;

                for (let k = 0; k < todayAlarms.length; k++) {
                    let alarm = todayAlarms[k];

                    if (buildingGroup.buildingGroupNo === alarm.buildingGroupNo) {

                        if (alarm.facilityType === SDMSResource.facilityType.FIRE) {
                            fireAlarm++;

                            if (alarm.isAlarm === true)
                                currentFireAlarm = true;
                        } else if (SDMSResource.isSVMSSensorType(alarm.facilityType)) {
                            cctvAlarm++;

                            if (alarm.isAlarm === true)
                                currentCCTVAlarm = true;
                        } else if (alarm.facilityType === SDMSResource.facilityType.PM) {
                            pmAlarm++;

                            if (alarm.isAlarm === true)
                                currentPMAlarm = true;
                        } else if (alarm.facilityType === SDMSResource.facilityType.MOBILE_SCANNER) {
                            msAlarm++;

                            if (alarm.isAlarm === true)
                                currentMSAlarm = true;
                        } else if (alarm.facilityType === SDMSResource.facilityType.SUMP) {
                            sumpAlarm++;

                            if (alarm.isAlarm === true)
                                currentSumpAlarm = true;
                        } else if (SDMSResource.isPSMSensorType(alarm.facilityType)) {
                            psmAlarm++;

                            if (alarm.isAlarm === true)
                                currentPSMAlarm = true;
                        }
                        else if (SDMSResource.isETCSensorType(alarm.facilityType)) {
                            etcAlarm++;

                            if (alarm.isAlarm === true)
                                currentETCAlarm = true;
                        }
                    }
                }
            }

            for (let j = 0; j < buildingGroup.buildingDatas.length; j++) {
                let building = buildingGroup.buildingDatas[j];

                if (buildingGroupID !== buildingGroup.buildingGroupNo && buildingID !== building.buildingNo)
                    continue;


                if (buildingGroupID === null && buildingID === building.buildingNo) {
                    buildingGroupName = building.name;
                    displayText = building.displayText;

                    for (let k = 0; k < todayAlarms.length; k++) {
                        let alarm = todayAlarms[k];

                        if (building.buildingNo === alarm.buildingNo) {

                            if (alarm.facilityType === SDMSResource.facilityType.FIRE) {
                                fireAlarm++;

                                if (alarm.isAlarm === true)
                                    currentFireAlarm = true;
                            } else if (SDMSResource.isSVMSSensorType(alarm.facilityType)) {
                                cctvAlarm++;

                                if (alarm.isAlarm === true)
                                    currentCCTVAlarm = true;
                            } else if (alarm.facilityType === SDMSResource.facilityType.PM) {
                                pmAlarm++;

                                if (alarm.isAlarm === true)
                                    currentPMAlarm = true;
                            } else if (alarm.facilityType === SDMSResource.facilityType.MOBILE_SCANNER) {
                                msAlarm++;

                                if (alarm.isAlarm === true)
                                    currentMSAlarm = true;
                            } else if (alarm.facilityType === SDMSResource.facilityType.SUMP) {
                                sumpAlarm++;

                                if (alarm.isAlarm === true)
                                    currentSumpAlarm = true;
                            } else if (SDMSResource.isPSMSensorType(alarm.facilityType)) {
                                psmAlarm++;

                                if (alarm.isAlarm === true)
                                    currentPSMAlarm = true;
                            }
                            else if (SDMSResource.isETCSensorType(alarm.facilityType)) {
                                etcAlarm++;

                                if (alarm.isAlarm === true)
                                    currentETCAlarm = true;
                            }
                        }
                    }
                }

                for (let y = 0; y < building.zoneDatas.length; y++) {
                    let zone = building.zoneDatas[y];

                    // fire 갯수 파악
                    for (let k = 0; k < selectSensors.fireSensors.length; k++) {
                        let fireSensor = selectSensors.fireSensors[k];

                        if (fireSensor.sensor.zone_sn === zone.zoneNo) {
                            fireSensors.push(fireSensor);
                        }
                    }

                    for (let k = 0; k < selectSensors.disabledFireSensors.length; k++) {
                        let disabledFireSensor = selectSensors.disabledFireSensors[k];

                        if (disabledFireSensor.sensor.zone_sn === zone.zoneNo) {
                            disabledFireSensors.push(disabledFireSensor);
                        }
                    }

                    // psm 갯수 파악
                    for (let k = 0; k < selectSensors.psmSensors.length; k++) {
                        let psmSensor = selectSensors.psmSensors[k];

                        if (psmSensor.sensor.zone_sn === zone.zoneNo) {
                            psmSensors.push(psmSensor);
                        }
                    }

                    for (let k = 0; k < selectSensors.disabledPSMSensors.length; k++) {
                        let disabledPSMSensor = selectSensors.disabledPSMSensors[k];

                        if (disabledPSMSensor.sensor.zone_sn === zone.zoneNo) {
                            disabledPSMSensors.push(disabledPSMSensor);
                        }
                    }

                    // pm 갯수 파악
                    for (let k = 0; k < selectSensors.pmSensors.length; k++) {
                        let pmSensor = selectSensors.pmSensors[k];

                        if (pmSensor.sensor.zone_sn === zone.zoneNo) {
                            pmSensors.push(pmSensor);
                        }
                    }

                    for (let k = 0; k < selectSensors.disabledPmSensors.length; k++) {
                        let disabledPMSensor = selectSensors.disabledPmSensors[k];

                        if (disabledPMSensor.sensor.zone_sn === zone.zoneNo) {
                            disabledPMSensors.push(disabledPMSensor);
                        }
                    }

                    // mobile scanner 갯수 파악
                    for (let k = 0; k < selectSensors.msSensors.length; k++) {
                        let msSensor = selectSensors.msSensors[k];

                        if (msSensor.sensor.zone_sn === zone.zoneNo) {
                            msSensors.push(msSensor);
                        }
                    }

                    for (let k = 0; k < selectSensors.disabledMsSensors.length; k++) {
                        let disabledMsSensor = selectSensors.disabledMsSensors[k];

                        if (disabledMsSensor.sensor.zone_sn === zone.zoneNo) {
                            disabledMSSensors.push(disabledMsSensor);
                        }
                    }

                    // sump 갯수 파악
                    for (let k = 0; k < selectSensors.sumpSensors.length; k++) {
                        let sumpSensor = selectSensors.sumpSensors[k];

                        if (sumpSensor.sensor.zone_sn === zone.zoneNo) {
                            sumpSensors.push(sumpSensor);
                        }
                    }

                    for (let k = 0; k < selectSensors.disabledSumpSensors.length; k++) {
                        let disabledSumpSensor = selectSensors.disabledSumpSensors[k];

                        if (disabledSumpSensor.sensor.zone_sn === zone.zoneNo) {
                            disabledSumpSensors.push(disabledSumpSensor);
                        }
                    }

                    // etc 갯수 파악
                    for (let k = 0; k < selectSensors.etcSensors.length; k++) {
                        let etcSensor = selectSensors.etcSensors[k];

                        if (etcSensor.sensor.zone_sn === zone.zoneNo) {
                            etcSensors.push(etcSensor);
                        }
                    }

                    for (let k = 0; k < selectSensors.disabledEtcSensors.length; k++) {
                        let disabledEtcSensor = selectSensors.disabledEtcSensors[k];

                        if (disabledEtcSensor.sensor.zone_sn === zone.zoneNo) {
                            disabledEtcSensors.push(disabledEtcSensor);
                        }
                    }

                    // cctv 갯수 파악
                    for (let k = 0; k < selectSensors.cctvs.length; k++) {
                        let cctv = selectSensors.cctvs[k];

                        if (cctv.sensor.zone_sn === zone.zoneNo) {
                            cctvs.push(cctv);
                        }
                    }

                    for (let k = 0; k < selectSensors.disabledCCTVs.length; k++) {
                        let disabledCCTV = selectSensors.disabledCCTVs[k];

                        if (disabledCCTV.sensor.zone_sn === zone.zoneNo) {
                            disabledCCTVs.push(disabledCCTV);
                        }
                    }
                }

            }
        }

        sensorList.fireSensors = fireSensors;
        sensorList.disabledFireSensors = disabledFireSensors;
        sensorList.psmSensors = psmSensors;
        sensorList.disabledPSMSensors = disabledPSMSensors;
        sensorList.pmSensors = pmSensors;
        sensorList.disabledPMSensors = disabledPMSensors;
        sensorList.msSensors = msSensors;
        sensorList.disabledMSSensors = disabledMSSensors;
        sensorList.sumpSensors = sumpSensors;
        sensorList.disabledSumpSensors = disabledSumpSensors;
        sensorList.etcSensors = etcSensors;
        sensorList.disabledEtcSensors = disabledEtcSensors;
        sensorList.cctvs = cctvs;
        sensorList.disabledCCTVs = disabledCCTVs;

        
        alarms.fireAlarm = fireAlarm;
        alarms.psmAlarm = psmAlarm;
        alarms.pmAlarm = pmAlarm;
        alarms.msAlarm = msAlarm;
        alarms.sumpAlarm = sumpAlarm;
        alarms.cctvAlarm = cctvAlarm;
        alarms.etcAlarm = etcAlarm;

        currentAlarm.fireAlarm = currentFireAlarm;
        currentAlarm.psmAlarm = currentPSMAlarm;
        currentAlarm.pmAlarm = currentPMAlarm;
        currentAlarm.msAlarm = currentMSAlarm;
        currentAlarm.sumpAlarm = currentSumpAlarm;
        currentAlarm.etcAlarm = currentETCAlarm;
        currentAlarm.cctvAlarm = currentCCTVAlarm;

        return [buildingGroupName, displayText, sensorList, alarms, currentAlarm];
    }

    getOpenCloseUI = (currentAlarm) => {
        const open = this.state.open;
        let upDownClass = dashboard.downIcon;
        let openCloseClass = dashboard.sensorInfo;

        if (currentAlarm !== null && currentAlarm !== undefined &&
            (currentAlarm.fireAlarm === true || currentAlarm.cctvAlarm === true || currentAlarm.psmAlarm === true || currentAlarm.etcAlarm === true)) {
            openCloseClass = dashboard.sensorAlarm;
        }

        if (open === true) {
            upDownClass = dashboard.upIcon;
            openCloseClass = dashboard.sensorInfoOpen;

            if (currentAlarm !== null && currentAlarm !== undefined &&
                (currentAlarm.fireAlarm === true || currentAlarm.cctvAlarm === true || currentAlarm.psmAlarm === true || currentAlarm.etcAlarm === true)) {
                openCloseClass = dashboard.sensorAlarmOpen;
            }
        }

        return [upDownClass, openCloseClass];
    }

    openCloseComponet = () => {
        let open = this.state.open;

        if (open === false)
            open = true;
        else
            open = false

        this.setState({ open: open});
    }

    typeAlarmSort = (buildingGroupName, sensorList, alarms, siteID) => {
        const type = this.state.type;

        let enabledFireSensors = sensorList.fireSensors.length - sensorList.disabledFireSensors.length;
        let enabledPSMSensors = sensorList.psmSensors.length - sensorList.disabledPSMSensors.length;
        let enabledPMSensors = sensorList.pmSensors.length - sensorList.disabledPmSensors.length;
        let enabledMSSensors = sensorList.msSensors.length - sensorList.disabledMsSensors.length;
        let enabledSumpSensors = sensorList.sumpSensors.length - sensorList.disabledSumpSensors.length;
        let enabledEtcSensors = sensorList.etcSensors.length - sensorList.disabledEtcSensors.length;
        let enabledCCTVs = sensorList.cctvs.length - sensorList.disabledCCTVs.length;

        let typeAlarmSort = [];

        if (type === DashboardResource.displayInfoType.FIRE) {
            typeAlarmSort.push({ typeName: "화재", sensorNum: sensorList.fireSensors.length, enabled: enabledFireSensors, alarm: alarms.fireAlarm, type: DashboardResource.displayInfoType.FIRE });
            typeAlarmSort.push({ typeName: "누출", sensorNum: (sensorList.psmSensors.length), enabled: enabledPSMSensors, alarm: alarms.psmAlarm, type: DashboardResource.displayInfoType.PSM });
            typeAlarmSort.push({ typeName: "미세먼지", sensorNum: (sensorList.pmSensors.length), enabled: enabledPMSensors, alarm: alarms.pmAlarm, type: DashboardResource.displayInfoType.PM });
            typeAlarmSort.push({ typeName: "이동식 스캐너", sensorNum: (sensorList.msSensors.length), enabled: enabledMSSensors, alarm: alarms.msAlarm, type: DashboardResource.displayInfoType.MS });
            typeAlarmSort.push({ typeName: "집수정", sensorNum: (sensorList.sumpSensors.length), enabled: enabledSumpSensors, alarm: alarms.sumpAlarm, type: DashboardResource.displayInfoType.SUMP });
            typeAlarmSort.push({ typeName: "ETC", sensorNum: (sensorList.etcSensors.length), enabled: enabledEtcSensors, alarm: alarms.etcAlarm, type: DashboardResource.displayInfoType.ETC });
            typeAlarmSort.push({ typeName: "CCTV", sensorNum: sensorList.cctvs.length, enabled: enabledCCTVs, alarm: alarms.cctvAlarm, type: DashboardResource.displayInfoType.INTELLIGENT });

        } else if (type === DashboardResource.displayInfoType.PSM) {
            typeAlarmSort.push({ typeName: "누출", sensorNum: (sensorList.psmSensors.length), enabled: enabledPSMSensors, alarm: alarms.psmAlarm, type: DashboardResource.displayInfoType.PSM });
            typeAlarmSort.push({ typeName: "화재", sensorNum: sensorList.fireSensors.length, enabled: enabledFireSensors, alarm: alarms.fireAlarm, type: DashboardResource.displayInfoType.FIRE });
            typeAlarmSort.push({ typeName: "미세먼지", sensorNum: (sensorList.pmSensors.length), enabled: enabledPMSensors, alarm: alarms.pmAlarm, type: DashboardResource.displayInfoType.PM });
            typeAlarmSort.push({ typeName: "이동식 스캐너", sensorNum: (sensorList.msSensors.length), enabled: enabledMSSensors, alarm: alarms.msAlarm, type: DashboardResource.displayInfoType.MS });
            typeAlarmSort.push({ typeName: "집수정", sensorNum: (sensorList.sumpSensors.length), enabled: enabledSumpSensors, alarm: alarms.sumpAlarm, type: DashboardResource.displayInfoType.SUMP });
            typeAlarmSort.push({ typeName: "ETC", sensorNum: (sensorList.etcSensors.length), enabled: enabledEtcSensors, alarm: alarms.etcAlarm, type: DashboardResource.displayInfoType.ETC });
            typeAlarmSort.push({ typeName: "CCTV", sensorNum: sensorList.cctvs.length, enabled: enabledCCTVs, alarm: alarms.cctvAlarm, type: DashboardResource.displayInfoType.INTELLIGENT });

        } else if (type === DashboardResource.displayInfoType.PM) {
            typeAlarmSort.push({ typeName: "미세먼지", sensorNum: (sensorList.pmSensors.length), enabled: enabledPMSensors, alarm: alarms.pmAlarm, type: DashboardResource.displayInfoType.PM });
            typeAlarmSort.push({ typeName: "화재", sensorNum: sensorList.fireSensors.length, enabled: enabledFireSensors, alarm: alarms.fireAlarm, type: DashboardResource.displayInfoType.FIRE });
            typeAlarmSort.push({ typeName: "누출", sensorNum: (sensorList.psmSensors.length), enabled: enabledPSMSensors, alarm: alarms.psmAlarm, type: DashboardResource.displayInfoType.PSM });
            typeAlarmSort.push({ typeName: "이동식 스캐너", sensorNum: (sensorList.msSensors.length), enabled: enabledMSSensors, alarm: alarms.msAlarm, type: DashboardResource.displayInfoType.MS });
            typeAlarmSort.push({ typeName: "집수정", sensorNum: (sensorList.sumpSensors.length), enabled: enabledSumpSensors, alarm: alarms.sumpAlarm, type: DashboardResource.displayInfoType.SUMP });
            typeAlarmSort.push({ typeName: "ETC", sensorNum: (sensorList.etcSensors.length), enabled: enabledEtcSensors, alarm: alarms.etcAlarm, type: DashboardResource.displayInfoType.ETC });
            typeAlarmSort.push({ typeName: "CCTV", sensorNum: sensorList.cctvs.length, enabled: enabledCCTVs, alarm: alarms.cctvAlarm, type: DashboardResource.displayInfoType.INTELLIGENT });

        } else if (type === DashboardResource.displayInfoType.MS) {
            typeAlarmSort.push({ typeName: "이동식 스캐너", sensorNum: (sensorList.msSensors.length), enabled: enabledMSSensors, alarm: alarms.msAlarm, type: DashboardResource.displayInfoType.MS });
            typeAlarmSort.push({ typeName: "화재", sensorNum: sensorList.fireSensors.length, enabled: enabledFireSensors, alarm: alarms.fireAlarm, type: DashboardResource.displayInfoType.FIRE });
            typeAlarmSort.push({ typeName: "누출", sensorNum: (sensorList.psmSensors.length), enabled: enabledPSMSensors, alarm: alarms.psmAlarm, type: DashboardResource.displayInfoType.PSM });
            typeAlarmSort.push({ typeName: "미세먼지", sensorNum: (sensorList.pmSensors.length), enabled: enabledPMSensors, alarm: alarms.pmAlarm, type: DashboardResource.displayInfoType.PM });
            typeAlarmSort.push({ typeName: "집수정", sensorNum: (sensorList.sumpSensors.length), enabled: enabledSumpSensors, alarm: alarms.sumpAlarm, type: DashboardResource.displayInfoType.SUMP });
            typeAlarmSort.push({ typeName: "ETC", sensorNum: (sensorList.etcSensors.length), enabled: enabledEtcSensors, alarm: alarms.etcAlarm, type: DashboardResource.displayInfoType.ETC });
            typeAlarmSort.push({ typeName: "CCTV", sensorNum: sensorList.cctvs.length, enabled: enabledCCTVs, alarm: alarms.cctvAlarm, type: DashboardResource.displayInfoType.INTELLIGENT });

        } else if (type === DashboardResource.displayInfoType.SUMP) {
            typeAlarmSort.push({ typeName: "집수정", sensorNum: (sensorList.sumpSensors.length), enabled: enabledSumpSensors, alarm: alarms.sumpAlarm, type: DashboardResource.displayInfoType.SUMP });
            typeAlarmSort.push({ typeName: "화재", sensorNum: sensorList.fireSensors.length, enabled: enabledFireSensors, alarm: alarms.fireAlarm, type: DashboardResource.displayInfoType.FIRE });
            typeAlarmSort.push({ typeName: "누출", sensorNum: (sensorList.psmSensors.length), enabled: enabledPSMSensors, alarm: alarms.psmAlarm, type: DashboardResource.displayInfoType.PSM });
            typeAlarmSort.push({ typeName: "미세먼지", sensorNum: (sensorList.pmSensors.length), enabled: enabledPMSensors, alarm: alarms.pmAlarm, type: DashboardResource.displayInfoType.PM });
            typeAlarmSort.push({ typeName: "이동식 스캐너", sensorNum: (sensorList.msSensors.length), enabled: enabledMSSensors, alarm: alarms.msAlarm, type: DashboardResource.displayInfoType.MS });
            typeAlarmSort.push({ typeName: "ETC", sensorNum: (sensorList.etcSensors.length), enabled: enabledEtcSensors, alarm: alarms.etcAlarm, type: DashboardResource.displayInfoType.ETC });
            typeAlarmSort.push({ typeName: "CCTV", sensorNum: sensorList.cctvs.length, enabled: enabledCCTVs, alarm: alarms.cctvAlarm, type: DashboardResource.displayInfoType.INTELLIGENT });

        } else if (type === DashboardResource.displayInfoType.ETC) {
            typeAlarmSort.push({ typeName: "ETC", sensorNum: (sensorList.etcSensors.length), enabled: enabledEtcSensors, alarm: alarms.etcAlarm, type: DashboardResource.displayInfoType.ETC });
            typeAlarmSort.push({ typeName: "화재", sensorNum: sensorList.fireSensors.length, enabled: enabledFireSensors, alarm: alarms.fireAlarm, type: DashboardResource.displayInfoType.FIRE });
            typeAlarmSort.push({ typeName: "누출", sensorNum: (sensorList.psmSensors.length), enabled: enabledPSMSensors, alarm: alarms.psmAlarm, type: DashboardResource.displayInfoType.PSM });
            typeAlarmSort.push({ typeName: "미세먼지", sensorNum: (sensorList.pmSensors.length), enabled: enabledPMSensors, alarm: alarms.pmAlarm, type: DashboardResource.displayInfoType.PM });
            typeAlarmSort.push({ typeName: "이동식 스캐너", sensorNum: (sensorList.msSensors.length), enabled: enabledMSSensors, alarm: alarms.msAlarm, type: DashboardResource.displayInfoType.MS });
            typeAlarmSort.push({ typeName: "집수정", sensorNum: (sensorList.sumpSensors.length), enabled: enabledSumpSensors, alarm: alarms.sumpAlarm, type: DashboardResource.displayInfoType.SUMP });
            typeAlarmSort.push({ typeName: "CCTV", sensorNum: sensorList.cctvs.length, enabled: enabledCCTVs, alarm: alarms.cctvAlarm, type: DashboardResource.displayInfoType.INTELLIGENT });

        } else if (type === DashboardResource.displayInfoType.INTELLIGENT) {
            typeAlarmSort.push({ typeName: "CCTV", sensorNum: sensorList.cctvs.length, enabled: enabledCCTVs, alarm: alarms.cctvAlarm, type: DashboardResource.displayInfoType.INTELLIGENT });
            typeAlarmSort.push({ typeName: "화재", sensorNum: sensorList.fireSensors.length, enabled: enabledFireSensors, alarm: alarms.fireAlarm, type: DashboardResource.displayInfoType.FIRE });
            typeAlarmSort.push({ typeName: "누출", sensorNum: (sensorList.psmSensors.length), enabled: enabledPSMSensors, alarm: alarms.psmAlarm, type: DashboardResource.displayInfoType.PSM });
            typeAlarmSort.push({ typeName: "미세먼지", sensorNum: (sensorList.pmSensors.length), enabled: enabledPMSensors, alarm: alarms.pmAlarm, type: DashboardResource.displayInfoType.PM });
            typeAlarmSort.push({ typeName: "이동식 스캐너", sensorNum: (sensorList.msSensors.length), enabled: enabledMSSensors, alarm: alarms.msAlarm, type: DashboardResource.displayInfoType.MS });
            typeAlarmSort.push({ typeName: "집수정", sensorNum: (sensorList.sumpSensors.length), enabled: enabledSumpSensors, alarm: alarms.sumpAlarm, type: DashboardResource.displayInfoType.SUMP });
            typeAlarmSort.push({ typeName: "ETC", sensorNum: (sensorList.etcSensors.length), enabled: enabledEtcSensors, alarm: alarms.etcAlarm, type: DashboardResource.displayInfoType.ETC });
        }

        return typeAlarmSort;
    }

    getCurrentAlarmUI = (currentAlarm) => {
        let currentAlarmUI = [];

        if (currentAlarm === null || currentAlarm === undefined)
            return currentAlarmUI;

        const buildingGroupID = this.props.buildingGroupID;

        if (currentAlarm.fireAlarm === true)
            currentAlarmUI.push(<span key={"fireAlarm_" + buildingGroupID} className={dashboard.popFireIcon}></span>);
        if (currentAlarm.etcAlarm === true)
            currentAlarmUI.push(<span key={"etcAlarm" + buildingGroupID} className={dashboard.popEtcIcon}></span>);
        if (currentAlarm.cctvAlarm === true)
            currentAlarmUI.push(<span key={"cctvAlarm" + buildingGroupID} className={dashboard.popCCTVIcon}></span>); 

        return currentAlarmUI;
    }

    displaySiteUI = () => {
        const siteID = ProjectResource.SiteID;
        let displaySiteUI = [];

        const [buildingGroupName, displayText, sensorList, alarms, currentAlarm] = this.init();

        let typeAlarmSort = this.typeAlarmSort(buildingGroupName, sensorList, alarms, siteID);
        let [upDownClass, openCloseClass] = this.getOpenCloseUI(currentAlarm);

        const currentAlarmUI = this.getCurrentAlarmUI(currentAlarm);

        displaySiteUI.push(
            <div key='alarmSB' className={openCloseClass}>
                <div className={dashboard.sensorTitle}><div className={dashboard.sersorPopTxt}>{displayText}</div>
                    <div className={dashboard.sensorIconArea}>
                        {currentAlarmUI}
                    </div>
                    <span className={upDownClass} onClick={() => this.openCloseComponet()}></span></div>
                <div className={dashboard.sensorText}>
                    <span className={dashboard.sensorReport}>{typeAlarmSort[0].typeName}: </span>
                    <span className={dashboard.senserNum}>{typeAlarmSort[0].enabled}</span> /
                    <span className={dashboard.senserNum2}>{typeAlarmSort[0].sensorNum}</span> /
                    <span className={dashboard.senserNum3}>{typeAlarmSort[0].alarm}</span>
                </div>
                <div onClick={() => this.props.changeType(typeAlarmSort[1].type)} className={dashboard.sensorText}>
                    <span className={dashboard.sensorReport}>{typeAlarmSort[1].typeName}: </span>
                    <span className={dashboard.senserNum}>{typeAlarmSort[1].enabled}</span> /
                    <span className={dashboard.senserNum2}>{typeAlarmSort[1].sensorNum}</span> /
                    <span className={dashboard.senserNum3}>{typeAlarmSort[1].alarm}</span>
                </div>
                <div onClick={() => this.props.changeType(typeAlarmSort[2].type)} className={dashboard.sensorText}>
                    <span className={dashboard.sensorReport}>{typeAlarmSort[2].typeName}: </span>
                    <span className={dashboard.senserNum}>{typeAlarmSort[2].enabled}</span> /
                    <span className={dashboard.senserNum2}>{typeAlarmSort[2].sensorNum}</span> /
                    <span className={dashboard.senserNum3}>{typeAlarmSort[2].alarm}</span>
                </div>
                <div onClick={() => this.props.changeType(typeAlarmSort[3].type)} className={dashboard.sensorText}>
                    <span className={dashboard.sensorReport}>{typeAlarmSort[3].typeName}: </span>
                    <span className={dashboard.senserNum}>{typeAlarmSort[3].enabled}</span> /
                    <span className={dashboard.senserNum2}>{typeAlarmSort[3].sensorNum}</span> /
                    <span className={dashboard.senserNum3}>{typeAlarmSort[3].alarm}</span>
                </div>
                <div onClick={() => this.props.changeType(typeAlarmSort[4].type)} className={dashboard.sensorText}>
                    <span className={dashboard.sensorReport}>{typeAlarmSort[4].typeName}: </span>
                    <span className={dashboard.senserNum}>{typeAlarmSort[4].enabled}</span> /
                    <span className={dashboard.senserNum2}>{typeAlarmSort[4].sensorNum}</span> /
                    <span className={dashboard.senserNum3}>{typeAlarmSort[4].alarm}</span>
                </div>
                <div onClick={() => this.props.changeType(typeAlarmSort[5].type)} className={dashboard.sensorText}>
                    <span className={dashboard.sensorReport}>{typeAlarmSort[5].typeName}: </span>
                    <span className={dashboard.senserNum}>{typeAlarmSort[5].enabled}</span> /
                    <span className={dashboard.senserNum2}>{typeAlarmSort[5].sensorNum}</span> /
                    <span className={dashboard.senserNum3}>{typeAlarmSort[5].alarm}</span>
                </div>
                <div onClick={() => this.props.changeType(typeAlarmSort[6].type)} className={dashboard.sensorText}>
                    <span className={dashboard.sensorReport}>{typeAlarmSort[6].typeName}: </span>
                    <span className={dashboard.senserNum}>{typeAlarmSort[6].enabled}</span> /
                    <span className={dashboard.senserNum2}>{typeAlarmSort[6].sensorNum}</span> /
                    <span className={dashboard.senserNum3}>{typeAlarmSort[6].alarm}</span>
                </div>
            </div>
        );

        return displaySiteUI;
    }

    render() {
        const displaySiteUI = this.displaySiteUI();

        return (
            <>
                {/* 사이트별 UI */
                    displaySiteUI
                }
            </>
        );
    }
}
export default AlarmComponet;