import React, { useState, useEffect } from 'react';

import { EventDashboardComponent } from '../../styled/sdmsPopupsStyled';
import SdmsResource from "../../resource/id";
import IconButton from '../../../Common/components/iconButton';
import Icon from '../../../Common/components/Icon/Icon';
import fireImg from '../../images/eventDashboard_fire.svg';
import fireManualImg from '../../images/eventDashboard_fire_manual.svg';
import ebImg from '../../images/eventDashboard_eb.svg';
import ebManualImg from '../../images/eventDashboard_eb_manual.svg';
import doorImg from '../../images/eventDashboard_door.svg';
import doorManualImg from '../../images/eventDashboard_door_manual.svg';
import invasionImg from '../../images/eventDashboard_invasion.svg';
import invasionManualImg from '../../images/eventDashboard_invasion_manual.svg';
import ProjectResource from '../../../Root/resource/id';

function EventDashboard(props) {
    const [close, setClose] = useState('');

    const alarms = props.sensorAlarm?.alarms || [];
    const onAlarms = alarms.filter(a => a.isAlarm) || [];
    const alarm = onAlarms[0] || null;

    // 화재 알람은 별도 안내 모달(FireAlarmModal)로 표출하므로 이벤트 대시보드는 표출하지 않는다.
    const isFireAlarm = alarm?.facilityType === SdmsResource.facilityType.FIRE;

    // 마운트 후 5초 뒤 자동 언마운트
    useEffect(() => {
        const timer = setTimeout(() => {
            props.setShowEventDashboard(false);
        }, 5000);
        return () => clearTimeout(timer);
    }, [props.setShowEventDashboard]);

    // 편집모드에서 이벤트 발생 시 자동 화면 전환이 일시 중지됨을 토스트로 1회 안내. (편집 세션당 1회 노출)
    useEffect(() => {
        if (props.isEditMode && props.editModeAlarmCount === 0) {
            props.handleToast("편집모드에서는 자동 화면 전환이 일시 중지됩니다", "warning");
        }
    }, [props.setShowEventDashboard]);

    // 알람이 없거나 화재 알람이면 언마운트 (화재는 안내 모달로 표출)
    useEffect(() => {
        if (!alarm || isFireAlarm) {
            props.setShowEventDashboard(false);
        }
    }, [alarm, isFireAlarm, props.setShowEventDashboard]);

    const handleSelectAlarm = (e) => {
        if (props.isEditMode) { // 편집모드 상태에서 알람이 발생했을 경우
            // 편집된 내용이 존재할 경우
            if (props.changedEdit) {
                props.showConfirmDialog(ProjectResource.dialogTypes.QUESTION, ["편집 중인 내용을 저장하시겠습니까?", "이벤트 관제 화면으로 이동 시 편집모드가 종료됩니다."], ["취소", "저장 안 하기", "저장하기"], handleEditMode);
            }
            // 편집된 내용이 없을 경우
            else {
                props.showConfirmDialog(ProjectResource.dialogTypes.QUESTION, ["이벤트 관제 화면으로 이동하시겠습니까?", "이벤트 관제 화면으로 이동 시 편집모드가 종료됩니다."], ["취소", "이동하기"], handleEditMode);
            }
        }
        else {
            moveSelectedAlarm();
        }
    };

    const handleEditMode = (index) => {
        if (index === 0) { // 취소
            props.onCloseConfirmDialog();
        }
        else if (index === 1) { // 저장 안 하기 & 이동하기
            moveSelectedAlarm();
            props.onCloseEditMode();
        }
        else if (index === 2) { // 저장하기
            moveSelectedAlarm();
            props.onClickSaveEditMode();
        }
    };

    const moveSelectedAlarm = () => {
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

        // 수동신고된 알람인지 확인
        let isManualReportAlarm = false;
        if (alarm.isManual) {
            isManualReportAlarm = true;
        } 

        return (
            <React.Fragment key='alarmInfo'>
                <p><span className={isManualReportAlarm ? 'manual' : 'sensor'}>{isManualReportAlarm ? '수동신고' : '센서탐지'}</span>{` · ${alarm.strDateTime}`}</p>
                <p>{alarm.message}</p>
            </React.Fragment>
        );
    };

    const getEventIcon = () => {
        if (!alarm) return null;

        const getIconImg = (facilityType, isManual) => {
            if (facilityType === SdmsResource.facilityType.FIRE) {
                return isManual ? fireManualImg : fireImg;
            }
            else if (facilityType === SdmsResource.facilityType.EmergencyBell) {
                return isManual ? ebManualImg : ebImg;
            }
            else if (facilityType === SdmsResource.facilityType.DOOR) {
                return isManual ? doorManualImg : doorImg;
            }
            else if (facilityType === SdmsResource.facilityType.Invasion) {
                return isManual ? invasionManualImg : invasionImg;
            }

            return null;
        };

        const iconSrc = getIconImg(alarm.facilityType, alarm.isManual);
        if (!iconSrc) return null;

        return (
            <div className='eventIcon' key='eventIcon'>
                <img src={iconSrc} alt='이벤트 아이콘' />
            </div>
        );
    };

    // 화재 알람은 안내 모달로 표출하므로 이벤트 대시보드는 렌더링하지 않는다.
    if (isFireAlarm) return null;

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