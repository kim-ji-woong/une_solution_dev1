import React, { useState } from 'react';
import { withRouter } from 'react-router-dom';

import PopupDraggable from './popupDraggable';
import { DashboardComponent } from '../../styled/sdmsPopupsStyled';
import SdmsResource from '../../resource/id';
import Icon from '../../../Common/components/Icon/Icon';
import ProjectResource from '../../../Root/resource/id';
import IconButton from '../../../Common/components/iconButton';
import { useSensorServerStatus } from '../../../Common/hooks/useSensorServerStatus';

function Dashboard(props) {
    const { statusMap: sensorServerStatusMap } = useSensorServerStatus();

    const getSensorsUI = () => {

        const countSensors = (sensorTypeCode) => {
            const sensorType = props.sensorTypes?.find(s => s.sensorTypeCode === sensorTypeCode);
            if (!sensorType) return { total: 0, active: 0 };

            // "수동신고" 포함 센서 제외
            const filteredSensors = sensorType.sensors.filter(
                s => !s.sensor.sensor_name?.includes("수동신고")
            );

            const total = filteredSensors.length;
            const active = filteredSensors.filter(s => s.sensor.enab).length;

            return { total, active };
        };

        const fire = countSensors(SdmsResource.facilityType.FIRE);
        const eb = countSensors(SdmsResource.facilityType.EmergencyBell);
        const door = countSensors(SdmsResource.facilityType.DOOR);
        const invasion = countSensors(SdmsResource.facilityType.Invasion);
        const cctv = countSensors(SdmsResource.facilityType.CCTV);

        const fireStatus = !sensorServerStatusMap[SdmsResource.facilityType.FIRE] ? <Icon.ClipOffIcon size="xxxxxs" fill='#E48181' /> : <Icon.ClipIcon size="xxxxxs" />;
        const ebStatus = !sensorServerStatusMap[SdmsResource.facilityType.EmergencyBell] ? <Icon.ClipOffIcon size="xxxxxs" fill='#E48181' /> : <Icon.ClipIcon size="xxxxxs" />;
        const doorStatus = !sensorServerStatusMap[SdmsResource.facilityType.DOOR] ? <Icon.ClipOffIcon size="xxxxxs" fill='#E48181' /> : <Icon.ClipIcon size="xxxxxs" />;
        const invasionStatus = !sensorServerStatusMap[SdmsResource.facilityType.Invasion] ? <Icon.ClipOffIcon size="xxxxxs" fill='#E48181' /> : <Icon.ClipIcon size="xxxxxs" />;
        const cctvStatus = !sensorServerStatusMap[SdmsResource.facilityType.CCTV] ? <Icon.ClipOffIcon size="xxxxxs" fill='#E48181' /> : <Icon.ClipIcon size="xxxxxs" />;

        return (
            <ul>
                <li>화재 ( {fireStatus} {fire.active} / {fire.total} )</li>
                <li>비상벨 ( {ebStatus} {eb.active} / {eb.total} )</li>
                <li>출입문 ( {doorStatus} {door.active} / {door.total} )</li>
                <li>침입 ( {invasionStatus} {invasion.active} / {invasion.total} )</li>
                <li>CCTV ( {cctvStatus} {cctv.active} / {cctv.total} )</li>
            </ul>
        );
    };

    const getAlarmsUI = () => {

        const countAlarms = (sensorTypeCode) => {
            return props.sensorAlarm?.alarms?.filter(alarm => alarm.facilityType === sensorTypeCode).length || 0;
        };

        const fire = countAlarms(SdmsResource.facilityType.FIRE);
        const eb = countAlarms(SdmsResource.facilityType.EmergencyBell);
        const door = countAlarms(SdmsResource.facilityType.DOOR);
        const invasion = countAlarms(SdmsResource.facilityType.Invasion);

        return (
            <ul>
                <li>
                    화재 ( {fire} ) 건
                </li>
                <li>
                    비상벨 ( {eb} ) 건
                </li>
                <li>
                    출입문 ( {door} ) 건
                </li>
                <li>
                    침입 ( {invasion} ) 건
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
                        <span />
                    </div>
                </div>
            </PopupDraggable>
        </DashboardComponent>
    );
}

export default withRouter(Dashboard);