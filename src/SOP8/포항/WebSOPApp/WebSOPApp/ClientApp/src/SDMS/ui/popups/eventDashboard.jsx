import React, { useState, useEffect } from 'react';

import { EventDashboardComponent } from '../../styled/sdmsPopupsStyled';
import event_atmosphere from '../../images/event_atmosphere.svg';
import eventDashboard_spread from '../../images/eventDashboard_spread.svg';
import SdmsResource from "../../resource/id";

function EventDashboard(props) {
    const [close, setClose] = useState('');
    const [moveDisplayAlarm, setMoveDisplayAlarm] = useState(null);
    const [count, setCount] = useState(5);

    useEffect(() => {
        getMoveDisplayAlarm();
    }, [props.commonSettings]);

    useEffect(() => {
        if (moveDisplayAlarm === null) return;

        const intervalId = setInterval(() => {
            setCount(prev => prev - 1);
        }, 1000);

        // 5초 뒤에 언마운트 콜백 실행
        const timeoutId = setTimeout(() => {
            handlePopups();
        }, 5000);

        return () => {
            clearInterval(intervalId);
            clearTimeout(timeoutId);
        };
    }, [moveDisplayAlarm]);

    const getMoveDisplayAlarm = async () => {
        const moveDisplayAlarm = props.commonSettings ? 
            props.commonSettings.find(c => c.categoryType === "SDMS")?.settingDatas.find(o => o.name === "MoveDisplayAlarm")?.value || "2"
            : await props.getMoveDisplayAlarm();

        setMoveDisplayAlarm(moveDisplayAlarm);
    };

    const handlePopups = () => {
        /* 알람 리스트 변경 시 센서 선택
        / moveDisplayAlarm Area
        / Option 값에 따라 화면 이동 여부 설정
        / 알람 발생시 화면 자동전환 옵션(0 : 현재화면 유지, 1 : 첫번째 알람위치로 이동, 2 : 마지막 알람위치로 이동)
        / 포항은 0, 2만 사용
        */
        if (moveDisplayAlarm === "2") {
            const onAlarms = props.sensorAlarms.filter(alarm => alarm.isAlarm) || [];

            const targetAlarm = props.spreadAlarm ? props.spreadAlarm : onAlarms[0];

            const targetZoneNo = props.spreadAlarm ? props.spreadAlarm.sensorZoneNo : onAlarms[0]?.sensorZoneNo;

            if (targetAlarm) {
                props.setVisiblePopups(SdmsResource.ID.menu.event, true);
            }

            props.sendShowAlarm(targetAlarm);
            props.setSelectedSensorFromSensorZoneNo(targetZoneNo);
            props.setSelectedAlarm(targetAlarm);
        }

        setClose('closePopup');

        if (props.spreadAlarm) {
            props.setSpreadAlarm(null);
        }

        setTimeout(() => {
            props.handlePopups('eventDashboard', false);
        }, 200);
    }

    const formatReactionTime = (isoString) => {
        const date = new Date(isoString);

        const pad = (num) => String(num).padStart(2, '0');

        const year = date.getUTCFullYear();
        const month = pad(date.getUTCMonth() + 1);
        const day = pad(date.getUTCDate());
        const hours = pad(date.getUTCHours());
        const minutes = pad(date.getUTCMinutes());
        const seconds = pad(date.getUTCSeconds());

        return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
    }

    const getAlarmInfo = () => {
        let ui = [];

        // 재난신고 접수 시 표출되는 ui
        if (props.spreadAlarm) {
            const reactionTime = formatReactionTime(props.spreadAlarm.reactionTime);

            return <React.Fragment key='alarmInfo'>
                <p>{reactionTime}</p>
                <div className='text'>
                    <p>[{props.spreadAlarm.zoneName}]</p><p>에서</p>
                    <p>[{props.spreadAlarm.detectTypeString}]</p>
                    <p>실제 재난신고가 접수되었습니다.</p>
                </div>
            </React.Fragment>
        }

        if (!props.sensorAlarms || props.sensorAlarms.length === 0) return;

        const onAlarms = props.sensorAlarms.filter(alarm => alarm.isAlarm) || [];
        const alarm = onAlarms[0];
        if (!alarm) return;

        ui.push(
            <React.Fragment key='alarmInfo'>
                <p>{alarm.strDateTime}</p>
                <div className='text'>
                    <p>[{alarm.zoneName}]</p><p>에서</p>
                    <p>[{alarm.detectTypeString}]</p>
                    <p>알람이 발생했습니다.</p>
                </div>
            </React.Fragment>
        );

        return ui;
    }

    return (
        <EventDashboardComponent className={`UI_Section ${close}`}>
            <div>
                <div>
                    <div className='eventIcon'>
                        <img src={props.spreadAlarm ? eventDashboard_spread : event_atmosphere} alt='이벤트 아이콘' />
                    </div>
                    <div className='contentWrap'>
                        {getAlarmInfo()}
                        <p className='autoClose'>
                            {count}
                            {
                                moveDisplayAlarm === '0' ?
                                    "초 뒤 자동으로 알림창이 닫힙니다." :
                                    "초 뒤 자동으로 화면이 이동합니다."
                            }
                        </p>
                    </div>
                </div>
                <button className='dslX' onClick={handlePopups}>닫기</button>
            </div>
        </EventDashboardComponent>
    );
}

export default EventDashboard;