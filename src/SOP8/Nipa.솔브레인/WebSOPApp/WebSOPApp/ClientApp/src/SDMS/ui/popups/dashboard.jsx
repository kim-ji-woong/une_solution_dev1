import React, { useState } from 'react';
import { withRouter } from 'react-router-dom';

import PopupDraggable from './popupDraggable';
import { DashboardComponent } from '../../styled/sdmsPopupsStyled';
import SdmsResource from '../../resource/id';
import Icon from '../../../Common/components/Icon/Icon';
import ProjectResource from '../../../Root/resource/id';
import IconButton from '../../../Common/components/iconButton';
import { useSensorServerStatus } from '../../../Common/hooks/useSensorServerStatus';
import { getProjectTypeState } from '../../../Root/resource/projectType';

function Dashboard(props) {
    const { statusMap: sensorServerStatusMap } = useSensorServerStatus();
    const projectTypeState = getProjectTypeState();

    const onClickMoveDashboard = () => {
        props.showConfirmDialog(ProjectResource.dialogTypes.QUESTION, ['대시보드 화면으로 이동하시겠습니까?'], ['취소', '이동하기'], goDashboardPage);
    }

    const goDashboardPage = (index) => {
        if (index === 1) {
            props.history.push(ProjectResource.path.dashboard);
        }
    }

    const getSensorsUI = () => {

        const countSensors = (sensorTypeCode) => {
            // projectType에 따른 센서타입 필터링
            if (projectTypeState.isWater && sensorTypeCode === SdmsResource.facilityType.EQUIPMENT_PeakPower) return { total: 0, active: 0 };
            if (projectTypeState.isPower && sensorTypeCode === SdmsResource.facilityType.EQUIPMENT_PredictAlarm) return { total: 0, active: 0 };

            const sensorType = props.sensorTypes?.find(s => s.sensorTypeCode === sensorTypeCode);
            if (!sensorType) return { total: 0, active: 0 };

            // "수동신고" 포함 센서 제외
            let filteredSensors = sensorType.sensors.filter(
                s => !s.sensor.sensor_name?.includes("수동신고")
            );

            // permitZones 기반 센서 필터링
            const sensorsConfig = ProjectResource.getUserInfo()?.options?.sensors;
            if (sensorsConfig) {
                const permitZones = sensorsConfig.permitZones;
                const permitSensorNo = sensorsConfig.permitSensorNo;

                filteredSensors = filteredSensors.filter(s => {
                    const sensor = s.sensor;
                    if (permitZones?.zoneNo && permitZones.zoneNo.includes(sensor.zone_sn)) {
                        if (permitZones.exceptSensorNo && permitZones.exceptSensorNo.includes(sensor.sensor_sn)) {
                            return false;
                        }
                        return true;
                    }
                    if (permitSensorNo && permitSensorNo.includes(sensor.sensor_sn)) {
                        return true;
                    }
                    return false;
                });
            }

            const total = filteredSensors.length;
            const active = filteredSensors.filter(s => s.sensor.enab).length;

            return { total, active };
        };

        const allowedSensorCodes = (() => {
            if (projectTypeState.isPower) {
                return new Set([
                    SdmsResource.facilityType.FIRE,
                    SdmsResource.facilityType.PSM_SENSOR,
                    SdmsResource.facilityType.CCTV,
                ]);
            }
            if (projectTypeState.isWater) {
                return new Set([
                    SdmsResource.facilityType.FIRE,
                    SdmsResource.facilityType.CCTV,
                ]);
            }
            return null; // NORMAL: 전체 표시
        })();

        const sensorItems = [
            { label: '화재', code: SdmsResource.facilityType.FIRE },
            { label: '누출', code: SdmsResource.facilityType.PSM_SENSOR },
            { label: '미세먼지', code: SdmsResource.facilityType.PM },
            { label: '이동식 스캐너', code: SdmsResource.facilityType.MOBILE_SCANNER },
            { label: '집수정', code: SdmsResource.facilityType.SUMP },
            { label: 'etc', code: SdmsResource.facilityType.ETC },
            { label: 'CCTV', code: SdmsResource.facilityType.CCTV },
        ].filter(item => !allowedSensorCodes || allowedSensorCodes.has(item.code))
         .map(item => {
            const data = countSensors(item.code);
            const status = !sensorServerStatusMap[item.code]
                ? <Icon.ClipOffIcon size="xxxxxs" fill='#E48181' />
                : <Icon.ClipIcon size="xxxxxs" />;
            return { ...item, data, status };
         });

        return (
            <ul>
                {sensorItems.map(item => (
                    <li key={item.label}>{item.label} ( {item.status} {item.data.active} / {item.data.total} )</li>
                ))}
            </ul>
        );
    };

    const getAlarmsUI = () => {

        const countAlarms = (sensorTypeCode) => {
            // projectType에 따른 센서타입 필터링
            if (projectTypeState.isWater && sensorTypeCode === SdmsResource.facilityType.EQUIPMENT_PeakPower) return 0;
            if (projectTypeState.isPower && sensorTypeCode === SdmsResource.facilityType.EQUIPMENT_PredictAlarm) return 0;

            return props.sensorAlarm?.alarms?.filter(alarm => alarm.facilityType === sensorTypeCode).length || 0;
        };

        const allowedAlarmCodes = (() => {
            if (projectTypeState.isPower) {
                return new Set([
                    SdmsResource.facilityType.FIRE,
                    SdmsResource.facilityType.PSM_SENSOR,
                    SdmsResource.facilityType.CCTV,
                    SdmsResource.facilityType.EQUIPMENT_PeakPower,
                ]);
            }
            if (projectTypeState.isWater) {
                return new Set([
                    SdmsResource.facilityType.FIRE,
                    SdmsResource.facilityType.CCTV,
                    SdmsResource.facilityType.EQUIPMENT_PredictAlarm,
                ]);
            }
            return null; // NORMAL: 전체 표시
        })();

        const alarmItems = [
            { label: '화재', code: SdmsResource.facilityType.FIRE },
            { label: '누출', code: SdmsResource.facilityType.PSM_SENSOR },
            { label: '미세먼지', code: SdmsResource.facilityType.PM },
            { label: '비인가자 탐지', code: SdmsResource.facilityType.MOBILE_SCANNER },
            { label: '집수정', code: SdmsResource.facilityType.SUMP },
            { label: 'etc', code: SdmsResource.facilityType.ETC },
            { label: 'CCTV', code: SdmsResource.facilityType.CCTV },
            { label: 'AI 설비 예지보전', code: SdmsResource.facilityType.EQUIPMENT_PredictAlarm },
            { label: 'AI 전력 분석', code: SdmsResource.facilityType.EQUIPMENT_PeakPower },
        ].filter(item => !allowedAlarmCodes || allowedAlarmCodes.has(item.code))
         .map(item => ({ ...item, count: countAlarms(item.code) }));

        return (
            <ul>
                {alarmItems.map(item => (
                    <li key={item.label}>
                        {item.label} ( {item.count} ) 건
                    </li>
                ))}
            </ul>
        );
    };

    return (
        <DashboardComponent id={props.popupType} className='UI_Section Dashboard' $resize={false}>
            <PopupDraggable
                id={props.popupType}
                popupMinWidth={1190}
                popupMinHeight={80}
                topSize={40}
                popupState={props.popupState}
                setActiveDragPopup={props.setActiveDragPopup}
                setPopupState={props.setPopupState}
                usePopupResize={false}
            >
                <IconButton
                    className='dslX'
                    variant="unfill"
                    size="xxs"
                    icon={<Icon.Closer size={"xxs"} fill={"grayscale.g500"} />}
                    onClick={() => props.setVisiblePopups(SdmsResource.ID.menu.dashboard, false)}
                >
                    닫기
                </IconButton>
                <div className='dashboardContent'>
                    <div className='sensorWrap'>
                        <div>
                            <Icon.DashboardIcon />
                        </div>
                        {
                            getSensorsUI()
                        }
                    </div>
                    <div className={`eventWrap${(projectTypeState.isWater || projectTypeState.isPower) ? ' noButton' : ''}`}>
                        <div>
                            <Icon.EventIcon />
                        </div>
                        {
                            getAlarmsUI()
                        }
                        {!projectTypeState.isWater && !projectTypeState.isPower && (
                            <IconButton
                                variant="unfill"
                                size="xxs"
                                icon={<Icon.Arrow size={"xxs"} direction={"right"} fill={"grayscale.g500"} />}
                                onClick={() => onClickMoveDashboard()}
                            >
                                대시보드로 이동
                            </IconButton>
                        )}
                    </div>
                </div>
            </PopupDraggable>
        </DashboardComponent>
    );
}

export default withRouter(Dashboard);