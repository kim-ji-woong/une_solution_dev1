import React, { useState, useEffect } from 'react';

import { EventDashboardComponent } from '../../styled/sdmsPopupsStyled';
import SdmsResource from "../../resource/id";
import IconButton from '../../../Common/components/iconButton';
import Icon from '../../../Common/components/Icon/Icon';
import fireImg from '../../images/eventDashboard_fire.svg';

function EventDashboard(props) {
    const [close, setClose] = useState('');

    const alarms = props.sensorAlarm?.alarms || [];
    const onAlarms = alarms.filter(a => a.isAlarm) || [];
    const alarm = onAlarms[0] || null;

    // 마운트 후 5초 뒤 자동 언마운트
    useEffect(() => {
        const timer = setTimeout(() => {
            props.setShowEventDashboard(false);
        }, 5000);
        return () => clearTimeout(timer);
    }, [props.setShowEventDashboard]);

    // 알람이 없으면 언마운트
    useEffect(() => {
        if (!alarm) {
            props.setShowEventDashboard(false);
        }
    }, [alarm, props.setShowEventDashboard]);

    const handleSelectAlarm = (e) => {
        const targetAlarm = onAlarms[0];

        if (targetAlarm) {
            props.setVisiblePopups(SdmsResource.ID.menu.event, true);
        }

        props.setSensorAlarms([...alarms], targetAlarm);
        props.setShowEventDashboard(false);
    };

    const handlePopups = (e) => {
        e.stopPropagation();
        setClose('closePopup');
        props.setShowEventDashboard(false);
    };

    const getAlarmInfo = () => {
        if (!alarm) return null;

        return (
            <React.Fragment key='alarmInfo'>
                <p><span>{alarm.isSensorAlarm ? '센서탐지' : '예측분석'}</span>{` · ${alarm.strDateTime}`}</p>
                <p>
                    <span>{`[${alarm.zoneName} > ${alarm.sensorName}]`}</span> 에서
                    <span>{` [${alarm.facilityTypeName}]`}</span> 알람이 발생했습니다
                </p>
            </React.Fragment>
        );
    };

    const getEventIcon = () => {
        if (!alarm) return null;

        const getIconImg = (facilityType) => {
            if (facilityType === SdmsResource.facilityType.FIRE) {
                return fireImg;
            }
            return null;
        };

        const iconSrc = getIconImg(alarm.facilityType);
        if (!iconSrc) return null;

        return (
            <div className='eventIcon' key='eventIcon'>
                <img src={iconSrc} alt='이벤트 아이콘' />
                <p>{alarm.sensorZoneNo >= 1000000 ? '수동신고' : '센서탐지'}</p>
            </div>
        );
    };

    return (
        <EventDashboardComponent className={close}>
            <div onClick={(e) => handleSelectAlarm(e)}>
                <div>
                    {getEventIcon()}
                    <div className='contentWrap'>
                        {getAlarmInfo()}
                    </div>
                </div>
                <IconButton
                    className='dslX'
                    variant="unfill"
                    size="xxs"
                    icon={<Icon.Closer size={"xxs"} />}
                    onClick={(e) => handlePopups(e)}
                >
                    닫기
                </IconButton>
            </div>
        </EventDashboardComponent>
    );
}

export default EventDashboard;