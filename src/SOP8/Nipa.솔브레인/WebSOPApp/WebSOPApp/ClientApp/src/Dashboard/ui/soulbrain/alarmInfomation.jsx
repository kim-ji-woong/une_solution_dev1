import React, { Component } from 'react';
import $ from 'jquery';

import dashboard from '../../css/dashboardNew.module.css';
import SDMSResource from '../../../SDMS/resource/id';
import DashboardResource from '../../resource/id';
import ProjectResource from '../../../Root/resource/id';

class AlarmInfomation extends Component {
    constructor(props) {
        super(props);

        this.props = props;
    }

    getAlarmCount = () => {
        if (this.props.selectWeeklyAlarms === null || this.props.selectWeeklyAlarms === undefined)
            return [0, 0, 0, 0, 0];

        let selectWeeklyAlarms = this.props.selectWeeklyAlarms;
        const selectSensors = this.props.selectSensors;

        let fireCount = 0;
        let iotCount = 0;
        let psmCount = 0;
        let etcCount = 0;
        let safetyCount = 0;
        let svmsCount = 0;

        let safetyCCTVs = [];

        // .TODO: safety 카운팅
        if (selectSensors !== null && selectSensors !== undefined && Array.isArray(selectSensors.cctvs)) {
            const cctvs = selectSensors.cctvs;

            for (let i = 0; i < cctvs.length; i++) {
                const cctv = cctvs[i];

                if (cctv.type === 'SAFETY-I' || cctv.type === 'SAFETY-1')
                    safetyCCTVs.push(cctv);
            }
        }

        for (let i = 0; i < selectWeeklyAlarms.length; i++) {
            let alarm = selectWeeklyAlarms[i];
            let facilityType = alarm.sensorTypeNo;

            if (facilityType === SDMSResource.facilityType.FIRE) {
                fireCount++;
            } else if (SDMSResource.isSVMSSensorType(alarm.sensorSubTypeNo)) {
                // CCTV sensorSubTypeNo 기준
                svmsCount++;

                for (let i = 0; i < selectWeeklyAlarms.length; i++) {
                    let alarm = selectWeeklyAlarms[i];

                    if (SDMSResource.isSVMSSensorType(alarm.sensorSubTypeNo)) {
                        for (let j = 0; j < safetyCCTVs.length; j++) {
                            const cctv = safetyCCTVs[j];

                            if (cctv.sensorNo === alarm.sensorZoneNo) {
                                safetyCount++;
                                break;
                            }
                        }
                    }
                }
            } else if (SDMSResource.isPSMSensorType(facilityType)) {
                //iotCount++;
                psmCount++;

                // .TODO: safety 카운팅
            } else if (SDMSResource.isETCSensorType(alarm.sensorSubTypeNo)) {
                // ETC sensorSubTypeNo 기준
                //iotCount++;
                etcCount++;

                // .TODO: safety 카운팅
            }
        }

        return [fireCount, svmsCount, psmCount, etcCount, safetyCount];
    }

    getAlarmBoard() {
        const alarmList = this.getAlarmList();

        let alarmBoard = [];

        let pageNum = alarmList.length / 6;
        pageNum = Math.ceil(pageNum);

        //// 페이징 ui
        //alarmBoard.push(<div className={dashboard.nextCircle}>);

        if (pageNum > 0) {
            for (let i = 0; i < pageNum; i++) {
                if (i === 0) {
                    alarmBoard.push(<span key={'alarmBoard' + i} className={dashboard.miniCircle + ' ' + dashboard.miniCircleAct}></span>);
                } else {
                    alarmBoard.push(<span key={'alarmBoard' + i} className={dashboard.miniCircle}></span>);
                }
            }
        }
    }

    getAlarmList = () => {
        // 타입별 항목 가져오기
        const type = this.props.type;
        const selectWeeklyAlarms = this.props.selectWeeklyAlarms;
        const selectSensors = this.props.selectSensors;

        let alarmList = [];
        let materialList = [];

        if (selectSensors === null || selectSensors === undefined)
            return alarmList;

        let tempList = [];
        let maxCount = 0;

        if (type === DashboardResource.displayInfoType.FIRE) {
            if (selectSensors.fireSensors === null || selectSensors.fireSensors === undefined)
                return alarmList;

            const fireSensors = selectSensors.fireSensors;

            let normalCount = 0;
            let smokeCount = 0;
            let flameCount = 0;
            let heatCount = 0;

            for (let i = 0; i < selectWeeklyAlarms.length; i++) {
                let alarm = selectWeeklyAlarms[i];

                if (alarm.sensorTypeNo === SDMSResource.facilityType.FIRE) {
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

            if (normalCount > 0)
                tempList.push({ typeName: '일반', typeValue: normalCount });
            if (heatCount > 0)
                tempList.push({ typeName: '열', typeValue: heatCount });
            if (smokeCount > 0)
                tempList.push({ typeName: '연기', typeValue: smokeCount });
            if (flameCount > 0)
                tempList.push({ typeName: '불꽃', typeValue: flameCount });

            for (let i = 0; i < tempList.length; i++) {
                let data = tempList[i];

                if (data.typeValue === 0 || alarmList.length === 0) {
                    alarmList.push(data);

                    if (maxCount < data.typeValue)
                        maxCount = data.typeValue;
                } else if (maxCount < data.typeValue) {
                    maxCount = data.typeValue;
                    alarmList.unshift(data);
                } else {
                    let chk = false;

                    for (let j = 0; j < alarmList.length; j++) {
                        let temp = alarmList[j];

                        if (temp.typeValue < data.typeValue) {
                            alarmList.splice(j, 0, data);
                            chk = true;
                            break;
                        }
                    }

                    if (chk === false)
                        alarmList.push(data);
                }
            }
        } else if (type === DashboardResource.displayInfoType.INTELLIGENT) {
            if (selectSensors.cctvs === null || selectSensors.cctvs === undefined)
                return alarmList;

            let invasion = 0;   // 침입
            let loiter = 0;     // 배회
            let collapse = 0;   // 쓰러짐
            let theft = 0;      // 도난
            let neglect = 0;    // 방치
            let fence = 0;      // 가상 펜스
            let fire = 0;       // 화재

            for (let i = 0; i < selectWeeklyAlarms.length; i++) {
                let alarm = selectWeeklyAlarms[i];

                // CCTV sensorSubTypeNo 기준
                if (SDMSResource.isSVMSSensorType(alarm.sensorSubTypeNo)) {
                    if (alarm.sensorSubTypeNo === SDMSResource.facilityType.Intrusion_S1) {
                        invasion++;
                    } else if (alarm.sensorSubTypeNo === SDMSResource.facilityType.Loiter_S1) {
                        loiter++;
                    } else if (alarm.sensorSubTypeNo === SDMSResource.facilityType.Collapse_S1) {
                        collapse++;
                    } else if (alarm.sensorSubTypeNo === SDMSResource.facilityType.Theft_S1) {
                        theft++;
                    } else if (alarm.sensorSubTypeNo === SDMSResource.facilityType.Neglect_S1) {
                        neglect++;
                    } else if (alarm.sensorSubTypeNo === SDMSResource.facilityType.VirtualFence_S1) {
                        fence++;
                    } else if (alarm.sensorSubTypeNo === SDMSResource.facilityType.Fire_S1) {
                        fire++;
                    }
                }
            }

            if (invasion > 0)
                tempList.push({ typeName: '침입', typeValue: invasion });
            if (loiter > 0)
                tempList.push({ typeName: '배회', typeValue: loiter });
            if (collapse > 0)
                tempList.push({ typeName: '쓰러짐', typeValue: collapse });
            if (theft > 0)
                tempList.push({ typeName: '도난', typeValue: theft });
            if (neglect > 0)
                tempList.push({ typeName: '방치', typeValue: neglect });
            if (fence > 0)
                tempList.push({ typeName: '가상 펜스', typeValue: fence });
            if (fire > 0)
                tempList.push({ typeName: '화재', typeValue: fire });

            for (let i = 0; i < tempList.length; i++) {
                let data = tempList[i];

                if (data.typeValue === 0 || alarmList.length === 0) {
                    alarmList.push(data);

                    if (maxCount < data.typeValue)
                        maxCount = data.typeValue;
                } else if (maxCount < data.typeValue) {
                    maxCount = data.typeValue;
                    alarmList.unshift(data);
                } else {
                    let chk = false;

                    for (let j = 0; j < alarmList.length; j++) {
                        let temp = alarmList[j];

                        if (temp.typeValue < data.typeValue) {
                            alarmList.splice(j, 0, data);
                            chk = true;
                            break;
                        }
                    }

                    if (chk === false)
                        alarmList.push(data);
                }
            }
        } 
        else if (type === DashboardResource.displayInfoType.ETC) {
            const countBySubType = {};   // sensorSubTypeNo 별 카운트
            const tempList = [];

            // 1. weekly 알람 돌면서 ETC sensorSubTypeNo 기준으로 카운트
            for (let i = 0; i < selectWeeklyAlarms.length; i++) {
                let alarm = selectWeeklyAlarms[i];
                let sensorSubTypeNo = alarm.sensorSubTypeNo;

                // ETC sensorSubTypeNo 기준
                if (!SDMSResource.isETCSensorType(sensorSubTypeNo)) {
                    continue;
                }

                // null / undefined 는 'null' key 로 통일
                const key = (sensorSubTypeNo === null || sensorSubTypeNo === undefined)
                    ? 'null'
                    : sensorSubTypeNo.toString();

                if (!countBySubType[key]) {
                    countBySubType[key] = 1;
                } else {
                    countBySubType[key] += 1;
                }
            }

            // 2. subtype별 카운트를 tempList 형태로 변환
            for (let key in countBySubType) {
                const cnt = countBySubType[key];
                let typeName;

                if (key === 'null') {
                    // subtype 정보가 없으면 통합해서 "기타"로 표시
                    typeName = '기타';
                } else {
                    const subTypeNo = Number(key);

                    // 센서/설비 이름 매핑 함수 활용
                    typeName = SDMSResource.getFacilityTypeString(subTypeNo);

                    // 혹시 매핑 안될 경우 대비
                    if (!typeName) {
                        typeName = `SubType ${key}`;
                    }
                }

                tempList.push({
                    typeName: typeName,
                    typeValue: cnt
                });
            }

            // 3. tempList 를 기존 로직대로 alarmList에 정렬 삽입
            for (let i = 0; i < tempList.length; i++) {
                let data = tempList[i];

                if (data.typeValue === 0 || alarmList.length === 0) {
                    alarmList.push(data);

                    if (maxCount < data.typeValue)
                        maxCount = data.typeValue;
                } else if (maxCount < data.typeValue) {
                    maxCount = data.typeValue;
                    alarmList.unshift(data);
                } else {
                    let chk = false;

                    for (let j = 0; j < alarmList.length; j++) {
                        let temp = alarmList[j];

                        if (temp.typeValue < data.typeValue) {
                            alarmList.splice(j, 0, data);
                            chk = true;
                            break;
                        }
                    }

                    if (chk === false)
                        alarmList.push(data);
                }
            }
        }
        else if (type === DashboardResource.displayInfoType.PSM) {
            const countBySubType = {};   // sensorSubTypeNo 별 카운트
            const tempList = [];

            // 1. weekly 알람 돌면서 PSM 센서만 subtype별로 카운트
            for (let i = 0; i < selectWeeklyAlarms.length; i++) {
                const alarm = selectWeeklyAlarms[i];
                const nType = alarm.sensorTypeNo;

                // PSM 센서만 집계
                if (!SDMSResource.isPSMSensorType(nType)) {
                    continue;
                }

                let sensorSubTypeNo = alarm.sensorSubTypeNo; // 예: null, 229(THC), 217(O2) 등

                // null / undefined 는 'null' 이라는 key로 공통 처리
                const key = (sensorSubTypeNo === null || sensorSubTypeNo === undefined)
                    ? 'null'
                    : sensorSubTypeNo.toString();

                if (!countBySubType[key]) {
                    countBySubType[key] = 1;
                } else {
                    countBySubType[key] += 1;
                }
            }

            // 2. subtype별 카운트를 tempList 형태로 변환
            for (let key in countBySubType) {
                const cnt = countBySubType[key];
                let typeName;

                if (key === 'null') {
                    // subtype 정보가 없는 경우
                    typeName = '유해화학물질';  // 기존에 쓰던 공통 이름
                } else {
                    const subTypeNo = Number(key);

                    // 이미 만들어둔 맵핑 함수 활용
                    typeName = SDMSResource.getFacilityTypeString(subTypeNo);

                    // 혹시 매핑 안 되는 값이면 fallback
                    if (!typeName) {
                        typeName = `SubType ${key}`;
                    }
                }

                tempList.push({
                    typeName: typeName,
                    typeValue: cnt
                });
            }

            // 3. tempList 를 기존 로직대로 alarmList에 정렬 삽입
            for (let i = 0; i < tempList.length; i++) {
                let data = tempList[i];

                if (data.typeValue === 0 || alarmList.length === 0) {
                    alarmList.push(data);

                    if (maxCount < data.typeValue)
                        maxCount = data.typeValue;
                } else if (maxCount < data.typeValue) {
                    maxCount = data.typeValue;
                    alarmList.unshift(data);
                } else {
                    let chk = false;

                    for (let j = 0; j < alarmList.length; j++) {
                        let temp = alarmList[j];

                        if (temp.typeValue < data.typeValue) {
                            alarmList.splice(j, 0, data);
                            chk = true;
                            break;
                        }
                    }

                    if (chk === false)
                        alarmList.push(data);
                }
            }
        }


        let alarmListUI = [];

        for (let i = 0; i < alarmList.length; i++) {
            let alarm = alarmList[i];

            alarmListUI.push(<p key={'alarmListUI_' + i}>{alarm.typeName}<span>{alarm.typeValue}</span></p>);
        }

        return alarmListUI;
    }

    getTypeBtnClass = () => {
        const type = this.props.type;
        let fireClass = '';
        let svmsClass = '';
        let safetyClass = '';
        let psmClass = '';
        let etcClass = '';

        if (type === DashboardResource.displayInfoType.FIRE) {
            fireClass = dashboard.typeAct;
        } else if (type === DashboardResource.displayInfoType.INTELLIGENT) {
            svmsClass = dashboard.typeAct;
        } else if (type === DashboardResource.displayInfoType.SAFETY_EYE) {
            safetyClass = dashboard.typeAct;
        } else if (type === DashboardResource.displayInfoType.PSM) {
            psmClass = dashboard.typeAct;
        } else if (type === DashboardResource.displayInfoType.ETC) {
            etcClass = dashboard.typeAct;
        }

        return [fireClass, svmsClass, safetyClass, psmClass, etcClass];
    }

    componentDidMount() {

    }

    displaySiteUI = () => {
        const siteID = ProjectResource.SiteID;
        let displaySiteUI = [];
        //const [fireCount, svmsCount, iotCount, safetyCount] = this.getAlarmCount();
        const [fireCount, svmsCount, psmCount, etcCount, safetyCount] = this.getAlarmCount();
        const alarmListUI = this.getAlarmList();
        const [fireClass, svmsClass, safetyClass, psmClass, etcClass] = this.getTypeBtnClass();

        /* 솔브레인 */
        displaySiteUI.push(
            <div key='alarmInformationSB' className={dashboard.alarmInfomation}>
                <div className={dashboard.alarmInTitle}>이상 센서 알람</div>
                <div className={dashboard.alarmFlex}>
                    <ul>
                        <li className={fireClass} onClick={() => this.props.changeType(DashboardResource.displayInfoType.FIRE)}><div className={dashboard.blueSquare}><span className={dashboard.typeFire}></span></div><span className={dashboard.fireTitle}>화재</span><div className={dashboard.alarmInfo1}>{fireCount}<span>건</span></div></li>
                        <li className={psmClass} onClick={() => this.props.changeType(DashboardResource.displayInfoType.PSM)}><div className={dashboard.blueSquare}><span className={dashboard.typeIOT}></span></div><span className={dashboard.iotTitle}>누출</span><div className={dashboard.alarmInfo4}>{psmCount}<span>건</span></div></li>
                        <li className={etcClass} onClick={() => this.props.changeType(DashboardResource.displayInfoType.ETC)}><div className={dashboard.blueSquare}><span className={dashboard.typeETC}></span></div><span className={dashboard.etcTitle}>ETC</span><div className={dashboard.alarmInfo5}>{etcCount}<span>건</span></div></li>
                        <li className={svmsClass} onClick={() => this.props.changeType(DashboardResource.displayInfoType.INTELLIGENT)}><div className={dashboard.blueSquare}><span className={dashboard.typeCCTV}></span></div><span className={dashboard.cctvTitle}>CCTV</span><div className={dashboard.alarmInfo2}>{svmsCount}<span>건</span></div></li>
                    </ul>
                </div>
                <div className={dashboard.alarmListTitle}>감지항목별 알림현황 (단위: 건)</div>
                <div className={dashboard.alarmcategory + ' ' + dashboard.scrollbar}>
                    <div className={dashboard.alarmList}>
                        {alarmListUI}
                    </div>
                </div>
                <div onClick={() => this.props.changeMode(DashboardResource.mode.sub)} className={dashboard.listButton}>상세 현황 모두 보기</div>
            </div>
        );

        return displaySiteUI;
    }

    render() {
        const displaySiteUI = this.displaySiteUI();
        return <>{displaySiteUI}</>;
    }
}
export default AlarmInfomation;