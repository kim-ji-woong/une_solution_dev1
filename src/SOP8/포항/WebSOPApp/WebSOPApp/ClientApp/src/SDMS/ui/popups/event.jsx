import React, { useEffect, useRef, useState } from 'react';
import { withRouter } from 'react-router-dom';

import PopupDraggable from './popupDraggable';
import { EventComponent } from '../../styled/sdmsPopupsStyled';
import SdmsResource from '../../resource/id';
import EventMemo from './eventMemo';
import { SDMSController } from '../../services/sdmsController';
import ProjectResource from '../../../Root/resource/id';
import { SettingController } from '../../../Settings/services/settingController';
import socketStore from "../../webSocket/socketStore";
import store from "../../../Root/store";

function Event(props) {
    const [opacity, setOpacity] = useState(1); 
    const [alarmMemo, setAlarmMemo] = useState(null);
    const [showMemoPopup, setShowMemoPopup] = useState(false);
    const [displayAlarmList, setDisplayAlarmList] = useState([]);
    const [filter, setFilter] = useState('all');    // 전체, 미대응, 대응
    const [sort, setSort] = useState('newest');     // 최신순, 오래된순
    const [count, setCount] = useState(0);
    const [displayUI, setDisplayUI] = useState([]);

    const selectedAlarmRef = useRef(null);

    useEffect(() => {
        if (!props.sensorAlarms) return;
        
        let sensorAlarms = [...props.sensorAlarms];
        let sortedAlarms = [];

        if (filter === 'all') {
            sortedAlarms = sensorAlarms;
        }
        else if (filter === 'pending') {
            sortedAlarms = sensorAlarms.filter((alarm) => alarm.isAlarm);
        }
        else if (filter === 'responded') {
            sortedAlarms = sensorAlarms.filter((alarm) => !alarm.isAlarm);
        }

        sortedAlarms.sort((a, b) => {
            if (a.isAlarm !== b.isAlarm) {
                return b.isAlarm - a.isAlarm; // true가 위로, false가 아래로
            }

            if (sort === 'newest') {
                return new Date(b.dtTime) - new Date(a.dtTime);
            } else if (sort === 'oldest') {
                return new Date(a.dtTime) - new Date(b.dtTime);
            }
            return 0;
        });

        setDisplayAlarmList(sortedAlarms);
    }, [props.sensorAlarms, filter, sort]);

    useEffect(() => {
        const renderUI = async () => {
            let alarmCount = 0;
            const ui = [];
        
            if (displayAlarmList?.length > 0 && props.sensorList) {
                for (const alarm of displayAlarmList) {
                    let sopStatusText = '대기';
                    if (alarm.sopStatus === 200102) {
                        sopStatusText = '실행중';
                    } else if (alarm.sopStatus === 200103) {
                        sopStatusText = '종료';
                    }
                    
                    let selected = '';
                    
                    if (props.selectedAlarm) {
                        selected = alarm.sensorZoneHistoryNo === props.selectedAlarm.sensorZoneHistoryNo ? 'onEvent' : '';
                    }
    
                    // 전파관리에 등록된 재난신고 전파데이터가 존재하는지 확인
                    const hasSpread = await checkSpreadExists(alarm);

                    // 재난신고가 완료된 알람인지 확인
                    const isSpreadSent = alarm.reactionType === SdmsResource.reactionType.재난신고 ? true : false;
    
                    ui.push(
                        <div
                            key={alarm.sensorZoneHistoryNo}
                            className={alarm.isAlarm ? 'eventItem' : 'eventItem closed'}
                            id={selected}
                            onClick={(e) => handleEventItem(e, alarm)}
                        >
                            <header>
                                <div className='eventInfoWrap'>
                                    {
                                        isSpreadSent &&
                                            <p className='spreadSent'>신고</p>
                                    }
                                    <p className='sensorTypeName'>{getSensorType(alarm)}</p>
                                </div>
                                <div className='eventIconWrap'>
                                    <button className="eventMemo" onClick={(e) => onClickOpenMemo(e, alarm)}>메모</button>
                                    {
                                        hasSpread &&
                                            <button className="eventSpread" onClick={(e) => onClickNotifyAlarm(e, alarm)}>재난신고</button>
                                    }
                                    <button className="eventClose" onClick={(e) => onClickClearAlarm(e, false, alarm)}>알람 종료</button>
                                </div>
                            </header>
                            <section>
                                <p>발생일시 : {alarm.strDateTime}</p>
                                <p>발생위치 : {alarm.zoneName + "_" + getMaterialNameFromSensorZoneNo(alarm.zoneNo, alarm.sensorZoneNo)}</p>
                                <p>SOP 실행 상태 : {sopStatusText}</p>
                            </section>
                            <footer>
                                <button onClick={() => onClickAlarmSop(alarm)}>SOP 바로가기</button>
                            </footer>
                        </div>
                    );
            
                    alarmCount++;
                }
            }
        
            setDisplayUI(ui);
            setCount(alarmCount);
        };

        renderUI();
    }, [displayAlarmList, props.sensorList, props.selectedAlarm, props.selectedSensor]);

    const getMaterialNameFromSensorZoneNo = (zoneNo, sensorZoneNo) => {
        const { sensorList } = props;

        if (!sensorList?.length) return "";

        const targetSensor = sensorList
            .flatMap(s => s.zones)
            .find(zone => zone.sensorLink.zone_sn === zoneNo)
            ?.sensors.find(sensor => sensor.sensorZoneData.sensorZone.sensor_zone_sn === sensorZoneNo);

        return targetSensor?.sensorZoneData.sensorZone.unq_key.split('_')[2] || "";
    };

    const getSensorType = (alarm) => {
        const { sensorList } = props;
        const { zoneNo, sensorZoneNo } = alarm;

        if (!sensorList?.length) return null;

        for (const sensor of sensorList) {
            const targetZone = sensor.zones?.find(
                zone => zone.sensorLink.zone_sn === zoneNo
            );

            if (!targetZone) continue;

            const targetSensor = targetZone.sensors.find(
                zs => zs.sensorZoneData.sensorZone.sensor_zone_sn === sensorZoneNo
            );

            if (targetSensor) return sensor.sensorType.sensor_type_name;
        }

        return null;
    };

    const changePopupOpacity = (value) => {
        setOpacity(value);
    }

    const handleEventItem = (e, alarm) => {
        //const element = document.getElementById('onEvent');

        //if(element && element !== e.currentTarget) element.id = '';

        //if(e.currentTarget.id === 'onEvent') e.currentTarget.id = '';
        // else {
        //     props.setSelectedAlarm(alarm);
        //    
        //     // ShowAlarm
        //     props.sendShowAlarm(alarm);
        //    
        //    e.currentTarget.id = 'onEvent';
        // }
        props.sendShowAlarm(alarm);
        props.selectAlarmPanel(alarm);
    }

    const handleFilterChange = (e) => {
        setFilter(e.target.value);
    };

    const handleSortChange = (e) => {
        setSort(e.target.value);
    };

    const onClickClearAlarm = async (e, allClear, alarm) => {
        e.stopPropagation();

        if (allClear) {
            props.showConfirmDialog(ProjectResource.dialogTypes.QUESTION, ["알람을 전체 종료하시겠습니까?"], ["확인"], clearAllAlarms);
        }
        else {
            selectedAlarmRef.current = alarm; // ref에 선택된 alarm 저장
            props.showConfirmDialog(ProjectResource.dialogTypes.QUESTION, ["알람을 종료하시겠습니까?"], ["오작동", "확인"], clearAlarm);
        }
    } 

    const clearAllAlarms = async () => {
        const userInfo = ProjectResource.getUserInfo();

        if (userInfo) {
            const [result, message] = await SDMSController.clearAllAlarm(userInfo.user_sn);

            if (!result) {
                props.showConfirmDialog(ProjectResource.dialogTypes.ERROR, [message], null, null);
            }
            else {
                props.showConfirmDialog(ProjectResource.dialogTypes.SUCCESS, ["알람이 전체 종료되었습니다."], null, null);
                removeElementID(); // 선택된 알람 섹션 element의 id 삭제
            }
        }
    }

    const clearAlarm = async (index) => {
        const alarm = selectedAlarmRef.current;
        if (!alarm) return;

        const userInfo = ProjectResource.getUserInfo();

        if (userInfo) {
            const [result, message] = await SDMSController.clearAlarm(alarm.sensorZoneHistoryNo, index === 0 ? true : false, userInfo.user_sn, null, null);

            if (!result) {
                props.showConfirmDialog(ProjectResource.dialogTypes.ERROR, [message], null, null);
                console.error(message);
            }
            else {
                props.showConfirmDialog(ProjectResource.dialogTypes.SUCCESS, ["알람이 종료되었습니다."], null, null);
                removeElementID(); // 선택된 알람 섹션 element의 id 삭제
            }
        }
    }

    const onClickOpenMemo = async (e, alarm) => {
        e.stopPropagation();

        const [success, memo, message] = await SDMSController.requestAlarmMemo(alarm.sensorZoneHistoryNo);

        if (success) {
            selectedAlarmRef.current = alarm; // ref에 선택된 alarm 저장
            setAlarmMemo(memo);
            setShowMemoPopup(true);
        }
        else {
            props.showConfirmDialog(ProjectResource.dialogTypes.ERROR, [message], null, null);
        }
    }

    const onClickSaveMemo = async (memo) => {
        const alarm = selectedAlarmRef.current;
        if (!alarm) return;

        const [success, _, message] = await SDMSController.saveAlarmMemo(alarm.sensorZoneHistoryNo, memo);

        if (success) {
            props.showConfirmDialog(ProjectResource.dialogTypes.SUCCESS, ["저장되었습니다."], null, null);
            setShowMemoPopup(false);
        }
        else {
            props.showConfirmDialog(ProjectResource.dialogTypes.ERROR, [message], null, null);
        }
    }

    const checkSpreadExists = async (alarm) => {
        const sensorType = alarm.facilityType;
        const sensorSubType = null;
        const messageType = -1;
        const detectType = 300401;

        const [result, _, message] = await SettingController.requestGetSpreadMessage(
            sensorType, sensorSubType, messageType, detectType
        );

        if (result === null) {
            props.showConfirmDialog(ProjectResource.dialogTypes.ERROR, [message], null, null);
            return false;
        }

        return result.length > 0;
    };

    const onClickNotifyAlarm = (e, alarm) => {
        e.stopPropagation();

        if (alarm.reactionType === SdmsResource.reactionType.재난신고) {
            props.showConfirmDialog(ProjectResource.dialogTypes.WARNING, ["해당 재난은 접수가 완료되어 현재 조치 중입니다.", "동일한 내용의 중복 신고는 제한됩니다."], null, null);
            return;
        }

        selectedAlarmRef.current = alarm; // ref에 선택된 alarm 저장
        props.showConfirmDialog(ProjectResource.dialogTypes.QUESTION, ["실제 재난 신고를 진행하시겠습니까?", "설정한 전파 대상자에게 문자가 전송됩니다."], ["확인"], doNotifyAlarm);
    }

    const doNotifyAlarm = async () => {
        const userInfo = ProjectResource.getUserInfo();

        const alarm = selectedAlarmRef.current;
        if (!alarm || !userInfo) return;

        const [result, message] = await SDMSController.notifyAlarm(alarm.sensorZoneHistoryNo, userInfo.user_sn);

        if (result) {
            props.showConfirmDialog(ProjectResource.dialogTypes.SUCCESS, ["실제 재난 신고가 완료되었습니다."], null, null);
        }
        else if (result === null) {
            props.showConfirmDialog(ProjectResource.dialogTypes.ERROR, [message], null, null);
        }
    }

    const onClickAlarmSop = (alarm) => {
        // SOP 실행 상태 (-1: SOP 시작 하기전, 0: SOP 실행 요청, 1: SOP 실행중, 2: SOP종료)
        if (alarm.sopStatus === 200100) {
            selectedAlarmRef.current = alarm; // ref에 선택된 alarm 저장
            props.showConfirmDialog(ProjectResource.dialogTypes.QUESTION, ["SOP를 실행하시겠습니까?"], ["확인"], runAlarmSop);
        }
        else if (alarm.sopStatus === 200101) {
            props.showConfirmDialog(ProjectResource.dialogTypes.WARNING, ["해당 SOP는 이미 실행 요청되었습니다."], null, null);
        }
        else if (alarm.sopStatus === 200102) {
            props.showConfirmDialog(ProjectResource.dialogTypes.WARNING, ["해당 SOP가 이미 진행중입니다."], null, null);
        }
        else if (alarm.sopStatus === 200103) {
            props.showConfirmDialog(ProjectResource.dialogTypes.WARNING, ["해당 SOP는 이미 종료되었습니다."], null, null);
        }  
    }

    // 일렉트론에서 SOP열기
    const runAlarmSop = async () => {
        const alarm = selectedAlarmRef.current;
        if (!alarm) return;

        const userInfo = ProjectResource?.getUserInfo();

        if (userInfo) {
            //props.history.push(ProjectResource.path.sopSimulator);
            const wsMgr = socketStore.getState().wsMgr;

            if (wsMgr && wsMgr.connected) {
                const param = {
                    menuType: 2
                }
                wsMgr.sendCheckMenuState(param);

                props.onCloseConfirmDialog();

                return await SDMSController.runAlarmSop(alarm.sensorZoneHistoryNo, userInfo.user_sn);
            }

            props.showConfirmDialog(ProjectResource.dialogTypes.ERROR, ['SOP 시뮬레이터를 실행할 수 없습니다. 소켓 통신을 확인해주세요.'], null, null);
        }
    }

    // 페이지 이동
    // const runAlarmSop = async () => {
    //     const alarm = selectedAlarmRef.current;
    //     if (!alarm) return;
    //
    //     const userInfo = ProjectResource?.getUserInfo();
    //    
    //     if (userInfo) {
    //         props.history.push(ProjectResource.path.sopSimulator);
    //         await SDMSController.runAlarmSop(alarm.sensorZoneHistoryNo, userInfo.user_sn);
    //     }
    // }

    const removeElementID = () => {
        const element = document.getElementById('onEvent');

        if (element) {
            element.id = '';
        }
    }

    return (
        <>
        <EventComponent id={props.popupType} className='UI_Section event' $opacity={opacity} $resize={true}>
            <PopupDraggable
                id={props.popupType}
                popupMinWidth={300}
                popupMinHeight={600}
                topSize={40}
                popupState={props.popupState}
                setActiveDragPopup={props.setActiveDragPopup}
                setPopupState={props.setPopupState}
            >
                <div className='dslTop'>
                    <h5 className='dslTitle'>
                        {SdmsResource.ID.menu.event}
                    </h5>
                    <input
                        type="range"
                        className="rangeInput"
                        min={0.1}
                        max={1}
                        color="gray"
                        step={0.1}
                        defaultValue={opacity}
                        onChange={(e) => {changePopupOpacity(e.target.valueAsNumber)}}
                    />
                    <button className='dslX' onClick={() => props.setVisiblePopups(SdmsResource.ID.menu.event, false)}>닫기</button>
                </div>
                <div className={'content'}>
                    <div className='sortWrap'>
                        <select value={filter} onChange={handleFilterChange}>
                            <option value='all'>전체</option>
                            <option value='pending'>미대응</option>
                            <option value='responded'>대응</option>
                        </select>
                        <select className='short' value={sort} onChange={handleSortChange}>
                            <option value='newest'>최신순</option>
                            <option value='oldest'>오래된순</option>
                        </select>
                    </div>

                    <div className='textWrap'>
                        <p>전체 <span>{count}건</span>의 이벤트가 검색되었습니다.</p>
                    </div>

                    <div className='eventWrap scrollbar'>
                        {displayUI}
                    </div>
                    <div className='btnWrap'>
                        <button onClick={(e) => onClickClearAlarm(e, true)}>이벤트 전체 종료</button>
                    </div>
                </div>
            </PopupDraggable>
        </EventComponent>
        {
            showMemoPopup && 
                <EventMemo 
                    popupType='SDMS'
                    setShowMemoPopup={setShowMemoPopup}
                    alarmMemo={alarmMemo}
                    onClickSaveMemo={onClickSaveMemo}
                />
        }
        </>
    );
}

export default withRouter(Event);