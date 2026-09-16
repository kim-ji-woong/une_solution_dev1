import React, { Component } from 'react';
import $ from 'jquery';

import FireAlarmInfo from './fireAlarmInfo';
import SVMSAlarmInfo from './svmsAlarmInfo';
import PSMAlarmInfo from './psmAlarmInfo';
import EtcAlarmInfo from './etcAlarmInfo';

import WeatherBoxSub from './weatherBoxSub';
import OperationBoxSub from './operationBoxSub';
import SafetyAlarmInfo from './safetyAlarmInfo';

import dashboard from '../../css/dashboardNew.module.css';

import DashboardResource from '../../resource/id';
import SDMSResource from '../../../SDMS/resource/id';

class Subboard extends Component {
    constructor(props) {
        super(props);

        this.props = props;
    }

    getAlarmList = (type) => {
        // 타입별 항목 가져오기
        //const type = this.props.type;
        const selectWeeklyAlarms = this.props.selectWeeklyAlarms;
        const selectSensors = this.props.selectSensors;
        let alarmList = [];
        let materialList = [];

        if (type === null || type === undefined ||
            selectSensors === null || selectSensors === undefined)
            return alarmList;

        if (type === DashboardResource.displayInfoType.FIRE) {

            if (selectSensors.fireSensors === null || selectSensors.fireSensors === undefined)
                return alarmList;

            const fireSensors = selectSensors.fireSensors;

            let normalCount = 0;
            let smokeCount = 0;
            let flameCount = 0;
            let heatCount = 0;
            let manualReportCount = 0;

            for (let i = 0; i < selectWeeklyAlarms.length; i++) {
                let alarm = selectWeeklyAlarms[i];

                if (alarm.sensorTypeNo === SDMSResource.facilityType.FIRE) {

                    if (alarm.isManual) {
                        manualReportCount++;
                        continue;
                    } 

                    for (let j = 0; j < fireSensors.length; j++) {
                        let fireSensor = fireSensors[j];

                        if (alarm.sensorNo === fireSensor.sensor.sensor_sn) {

                            let fireType = fireSensor.sensor.subTypeNo;

                            if (fireType === DashboardResource.fireSubType.HEAT)
                                heatCount++;
                            else if (fireType === DashboardResource.fireSubType.FLAME)
                                flameCount++;
                            else if (fireType === DashboardResource.fireSubType.SMOKE)
                                smokeCount++;
                            else
                                normalCount++;

                            break;
                        }
                    }
                }
            }

            alarmList.push({ typeName: "일반", typeValue: normalCount });
            alarmList.push({ typeName: "열", typeValue: heatCount });
            alarmList.push({ typeName: "연기", typeValue: smokeCount });
            alarmList.push({ typeName: "불꽃", typeValue: flameCount });
            alarmList.push({ typeName: "수동신고", typeValue: manualReportCount });

        } else if (type === DashboardResource.displayInfoType.INTELLIGENT) {
            if (selectSensors.cctvs === null || selectSensors.cctvs === undefined)
                return alarmList;

            const cctvs = selectSensors.cctvs;

            let invasion = 0;   // 침입
            let loiter = 0;      // 배회
            let collapse = 0;       // 쓰러짐
            let theft = 0;      // 도난
            let neglect = 0;    // 방치
            let fence = 0;      // 가상 펜스
            let fire = 0;       // 화재

            for (let i = 0; i < selectWeeklyAlarms.length; i++) {
                let alarm = selectWeeklyAlarms[i];

                if (SDMSResource.isSVMSSensorType(alarm.sensorTypeNo)) {

                    if (alarm.sensorTypeNo === SDMSResource.facilityType.Intrusion_S1) {
                        invasion++;
                    } else if (alarm.sensorTypeNo === SDMSResource.facilityType.Loiter_S1) {
                        loiter++;
                    } else if (alarm.sensorTypeNo === SDMSResource.facilityType.Collapse_S1) {
                        collapse++;
                    } else if (alarm.sensorTypeNo === SDMSResource.facilityType.Theft_S1) {
                        theft++;
                    } else if (alarm.sensorTypeNo === SDMSResource.facilityType.Neglect_S1) {
                        neglect++;
                    } else if (alarm.sensorTypeNo === SDMSResource.facilityType.VirtualFence_S1) {
                        fence++;
                    } else if (alarm.sensorTypeNo === SDMSResource.facilityType.Fire_S1) {
                        fire++;
                    }
                }
            }

            alarmList.push({ typeName: "침입", typeValue: invasion });
            alarmList.push({ typeName: "배회", typeValue: loiter });
            alarmList.push({ typeName: "쓰러짐", typeValue: collapse });
            alarmList.push({ typeName: "도난", typeValue: theft });
            alarmList.push({ typeName: "방치", typeValue: neglect });
            alarmList.push({ typeName: "가상 펜스", typeValue: fence });
            alarmList.push({ typeName: "화재", typeValue: fire });

        } else if (type === DashboardResource.displayInfoType.PSM) {
            let HF = 0;
            let CO = 0;
            let HCL = 0;
            let CH3C = 0;
            let N2H4 = 0;
            let CA = 0;
            let EA = 0;
            let VOC = 0;
            let H2O2 = 0;
            let THC = 0;
            let HNO3 = 0;
            let CL = 0;
            let TOLUENE = 0;
            let F2 = 0;
            let NH3 = 0;
            let LNG = 0;
            let PGMEA = 0;
            let H2S = 0;

            let F = 0;
            let H2 = 0;
            let CL2 = 0;
            let C2H6O = 0;
            let TEPO = 0;

            let manualReportCount = 0;

            for (let i = 0; i < selectWeeklyAlarms.length; i++) {
                let alarm = selectWeeklyAlarms[i];
                const nType = alarm.sensorTypeNo;
                const materialType = alarm.sensorSubTypeNo;

                if (SDMSResource.isPSMSensorType(nType)) {

                    if (alarm.isManual) {
                        manualReportCount++;
                        continue;
                    }
                    
                    if (materialType === DashboardResource.materialType.HF)
                        HF++;
                    else if (materialType === DashboardResource.materialType.CO)
                        CO++;
                    else if (materialType === DashboardResource.materialType.HCL)
                        HCL++;
                    else if (materialType === DashboardResource.materialType.CH3C)
                        CH3C++;
                    else if (materialType === DashboardResource.materialType.N2H4)
                        N2H4++;
                    else if (materialType === DashboardResource.materialType.CA)
                        CA++;
                    else if (materialType === DashboardResource.materialType.EA)
                        EA++;
                    else if (materialType === DashboardResource.materialType.VOC)
                        VOC++;
                    else if (materialType === DashboardResource.materialType.H2O2)
                        H2O2++;
                    else if (materialType === DashboardResource.materialType.THC)
                        THC++;
                    else if (materialType === DashboardResource.materialType.HNO3)
                        HNO3++;
                    else if (materialType === DashboardResource.materialType.CL)
                        CL++;
                    else if (materialType === DashboardResource.materialType.TOLUENE)
                        TOLUENE++;
                    else if (materialType === DashboardResource.materialType.F2)
                        F2++;
                    else if (materialType === DashboardResource.materialType.NH3)
                        NH3++;
                    else if (materialType === DashboardResource.materialType.LNG)
                        LNG++;
                    else if (materialType === DashboardResource.materialType.PGMEA)
                        PGMEA++;
                    else if (materialType === DashboardResource.materialType.H2S)
                        H2S++;
                    else if (materialType === DashboardResource.materialType.F)
                        F++;
                    else if (materialType === DashboardResource.materialType.H2)
                        H2++;
                    else if (materialType === DashboardResource.materialType.CL2)
                        CL2++;
                    else if (materialType === DashboardResource.materialType.C2H6O)
                        C2H6O++;
                    else if (materialType === DashboardResource.materialType.TEPO)
                        TEPO++;
                } 
            }

            alarmList.push({ typeName: "불화수소", typeValue: HF });
            alarmList.push({ typeName: "일산화탄소", typeValue: CO });
            alarmList.push({ typeName: "염화수소", typeValue: HCL });
            alarmList.push({ typeName: "초산", typeValue: CH3C });
            alarmList.push({ typeName: "하이드라진", typeValue: N2H4 });
            alarmList.push({ typeName: "CA Gas", typeValue: CA });
            alarmList.push({ typeName: "에틸알콜", typeValue: EA });
            alarmList.push({ typeName: "VOC", typeValue: VOC });
            alarmList.push({ typeName: "과수", typeValue: H2O2 });
            alarmList.push({ typeName: "에탄올", typeValue: THC });
            alarmList.push({ typeName: "질산", typeValue: HNO3 });
            alarmList.push({ typeName: "염소가스", typeValue: CL });
            alarmList.push({ typeName: "톨루엔", typeValue: TOLUENE });
            alarmList.push({ typeName: "불소", typeValue: F2 });
            alarmList.push({ typeName: "암모니아", typeValue: NH3 });
            alarmList.push({ typeName: "액화천연가스", typeValue: LNG });
            alarmList.push({ typeName: "유기가스", typeValue: PGMEA });
            alarmList.push({ typeName: "황화수소", typeValue: H2S });

            alarmList.push({ typeName: "F", typeValue: F });
            alarmList.push({ typeName: "수소", typeValue: H2 });
            alarmList.push({ typeName: "CL2", typeValue: CL2 });
            alarmList.push({ typeName: "C2H6O", typeValue: C2H6O });
            alarmList.push({ typeName: "TEPO", typeValue: TEPO });

            alarmList.push({ typeName: "수동신고", typeValue: manualReportCount });

        } else if (type === DashboardResource.displayInfoType.ETC) {

            let Temp = 0;
            let Humi = 0;
            let CO2 = 0;
            let TVOC = 0;
            let Dust_PM1 = 0;
            let Dust_PM2 = 0;
            let Dust_PM10 = 0;
            let AirPress = 0;
            let Inclin_X = 0;
            let Inclin_Y = 0;
            let Vib_X = 0;
            let Vib_Y = 0;
            let Vib_Z = 0;
            let Noise = 0;
            let BLE_Count = 0;
            let O2 = 0;
            let Value = 0;
            let mA = 0;
            let Contact = 0;
            let Relay = 0;

            let pH = 0;
            let AUTO = 0;
            let GATE1_OPEN = 0;
            let GATE1_CLOSE = 0;
            let GATE1_RATE = 0;
            let GATE1_FAULT = 0;
            let GATE2_OPEN = 0;
            let GATE2_CLOSE = 0;
            let GATE2_RATE = 0;
            let GATE2_FAULT = 0;
            let BATTERY = 0;
            let OPERATION = 0;
            let WATER_TEMP = 0;
            let SCRUBBER = 0;
            let Flame = 0;
            let Leak = 0;
            let LEL = 0;
            let CONNECT = 0;

            let manualReportCount = 0;

            for (let i = 0; i < selectWeeklyAlarms.length; i++) {
                let alarm = selectWeeklyAlarms[i];
                const nType = alarm.sensorTypeNo;
                const materialType = alarm.sensorSubTypeNo;

                if (SDMSResource.isETCSensorType(nType)) {

                    if (alarm.isManual) {
                        manualReportCount++;
                        continue;
                    }

                    if (materialType === DashboardResource.materialType.Temp)
                        Temp++;
                    else if (materialType === DashboardResource.materialType.Humi)
                        Humi++;
                    else if (materialType === DashboardResource.materialType.CO2)
                        CO2++;
                    else if (materialType === DashboardResource.materialType.TVOC)
                        TVOC++;
                    else if (materialType === DashboardResource.materialType.Dust_PM1)
                        Dust_PM1++;
                    else if (materialType === DashboardResource.materialType.Dust_PM2)
                        Dust_PM2++;
                    else if (materialType === DashboardResource.materialType.Dust_PM10)
                        Dust_PM10++;
                    else if (materialType === DashboardResource.materialType.AirPress)
                        AirPress++;
                    else if (materialType === DashboardResource.materialType.Inclin_X)
                        Inclin_X++;
                    else if (materialType === DashboardResource.materialType.Inclin_Y)
                        Inclin_Y++;
                    else if (materialType === DashboardResource.materialType.Vib_X)
                        Vib_X++;
                    else if (materialType === DashboardResource.materialType.Vib_Y)
                        Vib_Y++;
                    else if (materialType === DashboardResource.materialType.Vib_Z)
                        Vib_Z++;
                    else if (materialType === DashboardResource.materialType.Noise)
                        Noise++;
                    else if (materialType === DashboardResource.materialType.BLE_Count)
                        BLE_Count++;
                    else if (materialType === DashboardResource.materialType.O2)
                        O2++;
                    else if (materialType === DashboardResource.materialType.Value)
                        Value++;
                    else if (materialType === DashboardResource.materialType.mA)
                        mA++;
                    else if (materialType === DashboardResource.materialType.Contact)
                        Contact++;
                    else if (materialType === DashboardResource.materialType.Relay)
                        Relay++;
                    else if (materialType === DashboardResource.materialType.pH)
                        pH++;
                    else if (materialType === DashboardResource.materialType.AUTO)
                        AUTO++;
                    else if (materialType === DashboardResource.materialType.GATE1_OPEN)
                        GATE1_OPEN++;
                    else if (materialType === DashboardResource.materialType.GATE1_CLOSE)
                        GATE1_CLOSE++;
                    else if (materialType === DashboardResource.materialType.GATE1_RATE)
                        GATE1_RATE++;
                    else if (materialType === DashboardResource.materialType.GATE1_FAULT)
                        GATE1_FAULT++;
                    else if (materialType === DashboardResource.materialType.GATE2_OPEN)
                        GATE2_OPEN++;
                    else if (materialType === DashboardResource.materialType.GATE2_CLOSE)
                        GATE2_CLOSE++;
                    else if (materialType === DashboardResource.materialType.BATTERY)
                        BATTERY++;
                    else if (materialType === DashboardResource.materialType.OPERATION)
                        OPERATION++;
                    else if (materialType === DashboardResource.materialType.WATER_TEMP)
                        WATER_TEMP++;
                    else if (materialType === DashboardResource.materialType.SCRUBBER)
                        SCRUBBER++;
                    else if (materialType === DashboardResource.materialType.Flame)
                        Flame++;
                    else if (materialType === DashboardResource.materialType.Leak)
                        Leak++;
                    else if (materialType === DashboardResource.materialType.LEL)
                        LEL++;
                    else if (materialType === DashboardResource.materialType.CONNECT)
                        CONNECT++;
                }
            }

            alarmList.push({ typeName: "온도", typeValue: Temp });
            alarmList.push({ typeName: "습도", typeValue: Humi });
            alarmList.push({ typeName: "이산화탄소", typeValue: CO2 });
            alarmList.push({ typeName: "TVOC", typeValue: TVOC });
            alarmList.push({ typeName: "미세먼지(PM 1.0)", typeValue: Dust_PM1 });
            alarmList.push({ typeName: "미세먼지(PM 2.5)", typeValue: Dust_PM2 });
            alarmList.push({ typeName: "미세먼지(PM 10)", typeValue: Dust_PM10 });
            alarmList.push({ typeName: "기압", typeValue: AirPress });
            alarmList.push({ typeName: "기울기(X)", typeValue: Inclin_X });
            alarmList.push({ typeName: "기울기(Y)", typeValue: Inclin_Y });
            alarmList.push({ typeName: "진동(X)", typeValue: Vib_X });
            alarmList.push({ typeName: "진동(Y)", typeValue: Vib_Y });
            alarmList.push({ typeName: "진동(Z)", typeValue: Vib_Z });
            alarmList.push({ typeName: "소음", typeValue: Noise });
            alarmList.push({ typeName: "BLE Count", typeValue: BLE_Count });
            alarmList.push({ typeName: "산소", typeValue: O2 });
            alarmList.push({ typeName: "ESH_v5.1 측정값", typeValue: Value });
            alarmList.push({ typeName: "mA", typeValue: mA });
            alarmList.push({ typeName: "접점", typeValue: Contact });
            alarmList.push({ typeName: "릴레이", typeValue: Relay });

            alarmList.push({ typeName: "pH", typeValue: pH });
            alarmList.push({ typeName: "자동모드", typeValue: AUTO });
            alarmList.push({ typeName: "수문1 열림", typeValue: GATE1_OPEN });
            alarmList.push({ typeName: "수문1 닫힘", typeValue: GATE1_CLOSE });
            alarmList.push({ typeName: "수문1 개도율", typeValue: GATE1_RATE });
            alarmList.push({ typeName: "수문1 FAULT", typeValue: GATE1_FAULT });
            alarmList.push({ typeName: "수문2 열림", typeValue: GATE2_OPEN });
            alarmList.push({ typeName: "수문2 닫힘", typeValue: GATE2_CLOSE });
            alarmList.push({ typeName: "수문2 개도율", typeValue: GATE2_RATE });
            alarmList.push({ typeName: "수문2 FAULT", typeValue: GATE2_FAULT });
            alarmList.push({ typeName: "배터리", typeValue: BATTERY });
            alarmList.push({ typeName: "동작상태", typeValue: OPERATION });
            alarmList.push({ typeName: "수온", typeValue: WATER_TEMP });
            alarmList.push({ typeName: "스크러버", typeValue: SCRUBBER });
            alarmList.push({ typeName: "Flame", typeValue: Flame });
            alarmList.push({ typeName: "Leak", typeValue: Leak });
            alarmList.push({ typeName: "LEL", typeValue: LEL });
            alarmList.push({ typeName: "통신상태", typeValue: CONNECT });

            alarmList.push({ typeName: "수동신고", typeValue: manualReportCount });

        }

        return alarmList;
    }

    render() {
        const fireAlarms = this.getAlarmList(DashboardResource.displayInfoType.FIRE);
        const psmAlarms = this.getAlarmList(DashboardResource.displayInfoType.PSM);
        const etcAlarms = this.getAlarmList(DashboardResource.displayInfoType.ETC);
        const svmsAlarms = this.getAlarmList(DashboardResource.displayInfoType.INTELLIGENT);
        const safetyAlarms = this.getAlarmList(DashboardResource.displayInfoType.SAFETY_EYE);


        return (
            <>
                <div className={dashboard.topDivArea}>
                    <div className={dashboard.firstDivArea}>

                        <WeatherBoxSub />

                        <OperationBoxSub currentWork={this.props.workPermit} />

                    </div>

                    <FireAlarmInfo alarms={fireAlarms} />

                    <SVMSAlarmInfo alarms={svmsAlarms} />

                    {/* <SafetyAlarmInfo alarms={safetyAlarms} /> */}

                </div>


                <div className={dashboard.bottomDivArea}>

                    <PSMAlarmInfo alarms={psmAlarms} />

                    <EtcAlarmInfo alarms={etcAlarms} />

                </div>

            </>
        );
    }
}
export default Subboard;