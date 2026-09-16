import React, { useState } from 'react';
import { withRouter } from 'react-router-dom';

import PopupDraggable from './popupDraggable';
import { DashboardComponent } from '../../styled/sdmsPopupsStyled';
import SdmsResource from '../../resource/id';
import Icon from '../../../Common/components/Icon/Icon';
import ProjectResource from '../../../Root/resource/id';
import IconButton from '../../../Common/components/iconButton';

function Dashboard(props) {

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
            const sensorType = props.sensorTypes?.find(s => s.sensorTypeCode === sensorTypeCode);
            if (!sensorType) return { total: 0, active: 0 };

            const total = sensorType.sensors.length;
            const active = sensorType.sensors.filter(s => s.sensor.enab).length;
            return { total, active };
        };

        const fire = countSensors(SdmsResource.facilityType.FIRE);
        const psm = countSensors(SdmsResource.facilityType.PSM_SENSOR);
        const etc = countSensors(SdmsResource.facilityType.ETC);
        const cctv = countSensors(SdmsResource.facilityType.CCTV);

        const fireStatus = !props.getSensorServerStatus(SdmsResource.facilityType.FIRE) ? <Icon.ClipOffIcon size="xxxxxs" fill='#E48181' /> : <Icon.ClipIcon size="xxxxxs" />;
        const psmStatus = !props.getSensorServerStatus(SdmsResource.facilityType.PSM_SENSOR) ? <Icon.ClipOffIcon size="xxxxxs" fill='#E48181' /> : <Icon.ClipIcon size="xxxxxs" />;
        const etcStatus = !props.getSensorServerStatus(SdmsResource.facilityType.ETC) ? <Icon.ClipOffIcon size="xxxxxs" fill='#E48181' /> : <Icon.ClipIcon size="xxxxxs" />;
        const cctvStatus = !props.getSensorServerStatus(SdmsResource.facilityType.CCTV) ? <Icon.ClipOffIcon size="xxxxxs" fill='#E48181' /> : <Icon.ClipIcon size="xxxxxs" />;
        const pmStatus = !props.getSensorServerStatus(SdmsResource.facilityType.PM) ? <Icon.ClipOffIcon size="xxxxxs" fill='#E48181' /> : <Icon.ClipIcon size="xxxxxs" />;
        const mcStatus = !props.getSensorServerStatus(SdmsResource.facilityType.MOBILE_SCANNER) ? <Icon.ClipOffIcon size="xxxxxs" fill='#E48181' /> : <Icon.ClipIcon size="xxxxxs" />;
        const sumpStatus = !props.getSensorServerStatus(SdmsResource.facilityType.SUMP) ? <Icon.ClipOffIcon size="xxxxxs" fill='#E48181' /> : <Icon.ClipIcon size="xxxxxs" />;

        return (
            <ul>
                <li>화재 ( {fireStatus} {fire.active} / {fire.total} )</li>
                <li>누출 ( {psmStatus} {psm.active} / {psm.total} )</li>
                <li>미세먼지 ( {pmStatus} 0 / 0 )</li>
                <li>이동식 스캐너 ( {mcStatus} 0 / 0 )</li>
                <li>집수정 ( {sumpStatus} 0 / 0 )</li>
                <li>etc ( {etcStatus} {etc.active} / {etc.total} )</li>
                <li>CCTV ( {cctvStatus} {cctv.active} / {cctv.total} )</li>
            </ul>
        );
    };

    const getAlarmsUI = () => {

        const countAlarms = (sensorTypeCode) => {
            return props.sensorAlarm?.alarms?.filter(alarm => alarm.facilityType === sensorTypeCode).length || 0;
        };

        const fire = countAlarms(SdmsResource.facilityType.FIRE);
        const psm = countAlarms(SdmsResource.facilityType.PSM_SENSOR);
        const etc = countAlarms(SdmsResource.facilityType.ETC);
        const cctv = countAlarms(SdmsResource.facilityType.CCTV);
        const equipment = countAlarms(SdmsResource.facilityType.EQUIPMENT);

        return (
            <ul>
                <li>
                    화재 ( {fire} ) 건
                </li>
                <li>
                    누출 ( {psm} ) 건
                </li>
                <li>
                    미세먼지 ( 0 ) 건
                </li>
                <li>
                    비인가자 탐지 ( 0 ) 건
                </li>
                <li>
                    집수정 ( 0 ) 건
                </li>
                <li>
                    etc ( {etc} ) 건
                </li>
                <li>
                    CCTV ( {cctv} ) 건
                </li>
                <li>
                    AI 설비 예지보전 ( {equipment} ) 건
                </li>
                <li>
                    AI 전력 분석 ( 0 ) 건
                </li>
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
                    <div className='eventWrap'>
                        <div>
                            <Icon.EventIcon />
                        </div>
                        {
                            getAlarmsUI()
                        }
                        <IconButton
                            variant="unfill"
                            size="xxs"
                            icon={<Icon.Arrow size={"xxs"} direction={"right"} fill={"grayscale.g500"} />}
                            onClick={() => onClickMoveDashboard()}
                        >
                            대시보드로 이동
                        </IconButton>
                    </div>
                </div>
            </PopupDraggable>
        </DashboardComponent>
    );
}

export default withRouter(Dashboard);