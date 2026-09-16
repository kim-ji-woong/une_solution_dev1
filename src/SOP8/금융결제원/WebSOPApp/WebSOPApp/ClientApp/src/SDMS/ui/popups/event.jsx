import React, { useEffect, useRef, useState } from 'react';
import { withRouter } from 'react-router-dom';

import PopupDraggable from './popupDraggable';
import { EventComponent } from '../../styled/sdmsPopupsStyled';
import SdmsResource from '../../resource/id';
import EventMemo from './eventMemo';
import { SDMSController } from '../../services/sdmsController';
import ProjectResource from '../../../Root/resource/id';
import Button from '../../../Common/components/button';
import Icon from '../../../Common/components/Icon/Icon';
import SopManagerResource from '../../../SOPManager/resource/id';
import IconButton from '../../../Common/components/iconButton';
import EmptyContent from '../../../Common/components/emptyContent';
import DropBox from '../../../Common/components/dropBox';

function Event(props) {
    const [openDropId, setOpenDropId] = useState(null);
    const [alarmMemo, setAlarmMemo] = useState(null);
    const [showMemoPopup, setShowMemoPopup] = useState(false);
    const [displayAlarmList, setDisplayAlarmList] = useState([]);
    const [memoAlarm, setMemoAlarm] = useState(null);
    const [filter, setFilter] = useState('all');    // sensorTypes
    const [sort, setSort] = useState('newest');     // 최신순, 오래된순
    const [count, setCount] = useState({all: 0, sensor: 0, report: 0, isAlarm: 0});
    const [displayUI, setDisplayUI] = useState([]);

    const selectedAlarmRef = useRef(null);

    useEffect(() => {
        if (!props.sensorAlarm) return;
        
        let sensorAlarm = [...props.sensorAlarm.alarms];
        let sortedAlarms = [];

        if (filter === 'all') {
            sortedAlarms = sensorAlarm;
        } else {
            sortedAlarms = sensorAlarm.filter((alarm) => String(alarm.facilityType) === String(filter));
        }

        sortedAlarms.sort((a, b) => {
            if (sort === 'newest') {
                return new Date(b.dtTime) - new Date(a.dtTime);
            } else if (sort === 'oldest') {
                return new Date(a.dtTime) - new Date(b.dtTime);
            }
            return 0;
        });

        setDisplayAlarmList(sortedAlarms);
    }, [props.sensorAlarm, filter, sort]);

    useEffect(() => {
        const renderUI = async () => {
            let allAlarmCount = 0;
            let sensorAlarmCount = 0;
            let reportAlarmCount = 0;
            let isAlarmCount = 0;

            const ui = [];

            const getSopStatus = (sopStatus) => {
                if (sopStatus === 200102) {
                    return <p className='sop action'>SOP 실행</p>
                } 
                else if (sopStatus === 200103) {
                    return <p className='sop end'>SOP 완료</p>
                }

                return <p className='sop'>SOP 대기</p>
            }

            const getAlarmDepth = (alarmDepth) => {
                if (alarmDepth === 1) {
                    return <span className='depth first'>{SopManagerResource.ID.actionStep._1st}</span>
                } 
                else if (alarmDepth === 2) {
                    return <span className='depth second'>{SopManagerResource.ID.actionStep._2nd}</span>
                }
                else if (alarmDepth === 3) {
                    return <span className='depth third'>{SopManagerResource.ID.actionStep._3rd}</span>
                }
                else if (alarmDepth === 4) {
                    return <span className='depth fourth'>{SopManagerResource.ID.actionStep._4th}</span>
                }

                return null;
            }
        
            if (displayAlarmList?.length > 0) {
                for (const alarm of displayAlarmList) {

                    // 종료되지 않은 알람만 표출
                    if (!alarm.isAlarm) continue;

                    let selected = '';
                    let isManualReportAlarm = false;

                    let isOpenMemo = false;
                    let isOpenCCTV = false;

                    // 수동신고된 알람인지 확인
                    if (alarm.isManual) {
                        isManualReportAlarm = true;
                        reportAlarmCount++;
                    } else {
                        sensorAlarmCount++;
                    }
                    
                    if (props.sensorAlarm.selectedAlarm) { 
                        selected = alarm.sensorZoneHistoryNo === props.sensorAlarm.selectedAlarm.sensorZoneHistoryNo ? 'onEvent' : '';
                    }
                    if (memoAlarm?.sensorZoneHistoryNo === alarm.sensorZoneHistoryNo) {
                        isOpenMemo = true;
                    }

                    if (props.alarmCCTVList?.alarm?.sensorZoneHistoryNo === alarm.sensorZoneHistoryNo) {
                        isOpenCCTV = true;
                    }

                    ui.push(
                        <div
                            key={alarm.sensorZoneHistoryNo}
                            className='eventItem'
                            id={selected}
                            onClick={() => handleSelectAlarm(alarm)}
                        >
                            <header>
                                <div className='eventInfoWrap'>
                                    <p className='sensorTypeName'>{`${SdmsResource.getFacilityTypeString(alarm.facilityType)}`} {(alarm.sensorSubTypeName) && `(${alarm.sensorSubTypeName})`}</p>
                                </div>
                                <div className='eventIconWrap'>
                                    {
                                        // 수동신고 알람, 화재 알람은 이벤트 CCTV 논모달 표출X
                                        (!isManualReportAlarm && alarm.facilityType !== SdmsResource.facilityType.FIRE) &&
                                            <IconButton
                                                className={isOpenCCTV ? 'selected' : null}
                                                variant="unfill"
                                                size="xxs"
                                                icon={<Icon.CCTVIcon size={"xxxs"} />}
                                                onClick={() => props.getAlarmCCTVList(alarm)}
                                            >
                                                CCTV
                                            </IconButton>
                                    }
                                    {
                                        // 수동신고 알람이 아닌 화재 알람에만 출입문 버튼 표출
                                        (!isManualReportAlarm && alarm.facilityType === SdmsResource.facilityType.FIRE) &&
                                            <IconButton
                                                className={props.showPopups[SdmsResource.ID.menu.doorInfo] ? 'selected' : null}
                                                variant="unfill"
                                                size="xxs"
                                                icon={<Icon.DoorIcon size={"xxs"} isFill={false} />}
                                                disabled={!props.hasClosedDoor}
                                                onClick={(e) => {
                                                    props.startDoorInfoWatch();
                                                }}
                                            >
                                                출입문
                                            </IconButton>
                                    }
                                    <IconButton
                                        className={`${alarm.memo ? 'on' : ''} ${isOpenMemo ? 'selected' : ''}`}
                                        variant="unfill"
                                        size="xxs"
                                        icon={<Icon.MemoIcon size={"xxs"} />}
                                        onClick={(e) => onClickOpenMemo(e, alarm)}
                                    >
                                        메모
                                    </IconButton>
                                    <IconButton
                                        variant="unfill"
                                        size="xxs"
                                        icon={<Icon.PowerIcon size={"xxs"} />}
                                        onClick={(e) => onClickClearAlarm(e, false, alarm)}
                                    >
                                        알람 종료
                                    </IconButton>
                                </div>
                            </header>
                            <section>
                                <p>발생위치<span>{`${alarm.zoneName} > ${alarm.sensorName}`}</span></p>
                                <p>발생일시<span>{alarm.strDateTime}</span></p>
                                <p>
                                    알람정보
                                    {getAlarmDepth(alarm.alarmDepth)}
                                    <span className={isManualReportAlarm ? 'type report' : 'type sensor'}>
                                        {isManualReportAlarm ? '수동신고' : '센서탐지'}
                                    </span>
                                </p>
                                <p>메모내용<span>{alarm.memo ? alarm.memo : '-'}</span></p>
                            </section>
                            {
                                (selected) &&
                                    <footer>
                                        {getSopStatus(alarm.sopStatus)}
                                        <Button 
                                            variant="unfill_light" size="xxs"
                                            onClick={(e) => onClickAlarmSop(e, alarm)}
                                            rightIcon={<Icon.Arrow size={"xxs"} direction={"right"} />}
                                        >
                                            SOP 바로가기
                                        </Button>
                                    </footer>
                            }
                        </div>
                    );

                    allAlarmCount++;
                }
            }
        
            setDisplayUI(ui);
            setCount({all: allAlarmCount, sensor: sensorAlarmCount, report: reportAlarmCount, isAlarm: allAlarmCount});
        };

        renderUI();
    }, [displayAlarmList, props.sensorAlarm, props.selectedSensor, props.alarmCCTVList, memoAlarm, props.showPopups[SdmsResource.ID.menu.doorInfo]]);

    const handleSelectAlarm = (alarm) => {
        props.setSensorAlarms([...props.sensorAlarm.alarms], alarm);
    };

    const getSensorTypes = () => {
        let options = [];

        options.push({ value: 'all', label: '전체' });

        for (const sensorType of props.sensorTypes) {
            if (sensorType.sensorTypeCode === SdmsResource.facilityType.CCTV) continue;
            
            options.push({ value: sensorType.sensorTypeCode, label: sensorType.sensorTypeName });
        }

        return options;
    }

    const handleFilterChange = (value) => {
        setFilter(value);
    };

    const onClickClearAlarm = async (e, allClear, alarm) => {
        e.stopPropagation();

        if (allClear) {
            props.showConfirmDialog(ProjectResource.dialogTypes.QUESTION, ["이벤트 알람을 전체 종료하시겠습니까?", "종료된 이벤트는 되돌릴 수 없으며, 이력 관리 화면에서 확인 가능합니다."], ["취소", "종료하기"], clearAllAlarms);
        }
        else {
            selectedAlarmRef.current = alarm; // ref에 선택된 alarm 저장
            props.showConfirmDialog(ProjectResource.dialogTypes.MALFUNCTION, ["이벤트 알람을 종료하시겠습니까?", "종료된 이벤트는 되돌릴 수 없으며, 이력 관리 화면에서 확인 가능합니다."], ["취소", "종료하기"], clearAlarm);
        }
    } 

    const clearAllAlarms = async (index) => {
        if (index === 1) {
            const userInfo = ProjectResource.getUserInfo();
    
            if (userInfo) {
                const [result, message] = await SDMSController.clearAllAlarm(userInfo.user_sn);
    
                if (!result) {
                    props.showConfirmDialog(ProjectResource.dialogTypes.ERROR, [message], null, null);
                }
                else {
                    props.handleToast("이벤트 알람이 전체 종료되었습니다");
                    removeElementID(); // 선택된 알람 섹션 element의 id 삭제
                }
            }
        }

        props.onCloseConfirmDialog();
    }

    const clearAlarm = async (index, isMalfunction) => {
        if (index === 1) {
            const alarm = selectedAlarmRef.current;
            if (!alarm) return;
    
            const userInfo = ProjectResource.getUserInfo();
    
            if (userInfo) {
                const [result, message] = await SDMSController.clearAlarm(alarm.sensorZoneHistoryNo, isMalfunction, userInfo.user_sn, null, null);
    
                if (!result) {
                    props.showConfirmDialog(ProjectResource.dialogTypes.ERROR, [message], null, null);
                }
                else {
                    props.handleToast("이벤트 알람이 종료되었습니다");
                    removeElementID(); // 선택된 알람 섹션 element의 id 삭제
                }
            }
        }

        props.onCloseConfirmDialog();
    }

    const onClickOpenMemo = async (e, alarm) => {
        e.stopPropagation();

        const [success, memo, message] = await SDMSController.requestAlarmMemo(alarm.sensorZoneHistoryNo);

        if (success) {
            selectedAlarmRef.current = alarm; // 개별 저장 대상
            setMemoAlarm(alarm);
            setAlarmMemo(memo);
            setShowMemoPopup(true);
        } else {
            props.showConfirmDialog(ProjectResource.dialogTypes.ERROR, [message], null, null);
        }
    };

    const onClickSaveMemo = async (memo) => {
        const alarm = selectedAlarmRef.current;
        if (!alarm) return;

        const [success, _, message] = await SDMSController.saveAlarmMemo(alarm.sensorZoneHistoryNo, memo);

        if (success) {
            props.handleToast("메모가 저장되었습니다");
            closeMemoPopup();
        }
        else {
            props.showConfirmDialog(ProjectResource.dialogTypes.ERROR, [message], null, null);
        }
    }

    const closeMemoPopup = () => {
        selectedAlarmRef.current = null;
        setMemoAlarm(null);
        setShowMemoPopup(false);
    }

    const onClickAlarmSop = (e, alarm) => {
        e.stopPropagation();

        // SOP 실행 상태 (-1: SOP 시작 하기전, 0: SOP 실행 요청, 1: SOP 실행중, 2: SOP종료)
        if (alarm.sopStatus === 200100) {
            selectedAlarmRef.current = alarm; // ref에 선택된 alarm 저장
            props.showConfirmDialog(ProjectResource.dialogTypes.QUESTION, ["SOP 서비스를 실행하시겠습니까?"], ["취소", "실행하기"], runAlarmSop);
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

    const runAlarmSop = async (index) => {
        if (index === 1) {
            const alarm = selectedAlarmRef.current;
            if (!alarm) return;
    
            const userInfo = ProjectResource?.getUserInfo();
            
            if (userInfo) {
                const [success, message] = await SDMSController.runAlarmSop(alarm.sensorZoneHistoryNo, userInfo.user_sn);
                
                if (!success) {
                    props.handleToast(message);
                }
                else {
                    // sop 바로가기 실행 시 새 탭으로 띄우기
                    window.open(ProjectResource.path.sopSimulator);
                }
            }
        }

        props.onCloseConfirmDialog();
    }

    const removeElementID = () => {
        const element = document.getElementById('onEvent');

        if (element) {
            element.id = '';
        }
    }

    return (
        <>
        <EventComponent id={props.popupType} className='UI_Section event' $resize={true}>
            <PopupDraggable
                id={props.popupType}
                popupMinWidth={340}
                popupMinHeight={450}
                topSize={40}
                popupState={props.popupState}
                setActiveDragPopup={props.setActiveDragPopup}
                setPopupState={props.setPopupState}
            >
                <div className='dslTop'>
                    <h5 className='dslTitle'>
                        {SdmsResource.ID.menu.event}
                    </h5>
                    <IconButton
                        variant="unfill"
                        size="xxs"
                        icon={<Icon.Closer size={"xxs"} />}
                        onClick={() => props.setVisiblePopups(SdmsResource.ID.menu.event, false)}
                    >
                        닫기
                    </IconButton>
                </div>
                <div className={'content'}>
                    <div className='sortWrap'>
                        <DropBox
                            id="filter"
                            value={filter}
                            onChange={handleFilterChange}
                            options={getSensorTypes()}
                            openId={openDropId}
                            setOpenId={setOpenDropId}
                        />
                        <DropBox
                            id="sort"
                            value={sort}
                            onChange={setSort}
                            options={[
                                { value: 'newest', label: '최신순' },
                                { value: 'oldest', label: '오래된순' },
                            ]}
                            openId={openDropId}
                            setOpenId={setOpenDropId}
                        />
                    </div>

                    <div className='textWrap'>
                        <div>
                            <p>센서탐지 : <span>{count.sensor}</span></p>
                            <p>수동신고 : <span>{count.report}</span></p>
                        </div>
                        <span>총 {count.all}건</span>
                    </div>
                    {displayUI.length > 0 ?
                        <>
                            <div className='eventWrap scrollbar'>
                                {displayUI}
                            </div>
                            <div className='btnWrap'>
                                <Button
                                    variant="fill"
                                    size="md"
                                    disabled={count.isAlarm > 0 ? false : true}
                                    onClick={(e) => onClickClearAlarm(e, true)}
                                >
                                    전체 종료
                                </Button>
                            </div>
                        </> :
                        <EmptyContent
                            title="진행 중인 이벤트가 없습니다"
                            description="이전 이벤트 정보는 이력관리에서 확인하세요"
                            action={{
                                label: '이동하기',
                                onClick: () => props.history.push(ProjectResource.path.history),
                            }}
                        />
                    }
                </div>
            </PopupDraggable>
        </EventComponent>
        {showMemoPopup && 
            <EventMemo 
                popupType='SDMS'
                closeMemoPopup={closeMemoPopup}
                alarmMemo={alarmMemo}
                onClickSaveMemo={onClickSaveMemo}
            />
        }
        </>
    );
}

export default withRouter(Event);