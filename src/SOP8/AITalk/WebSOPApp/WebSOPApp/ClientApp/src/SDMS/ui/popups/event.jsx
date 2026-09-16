import React, { useEffect, useRef, useState } from 'react';
import { withRouter } from 'react-router-dom';

import PopupDraggable from './popupDraggable';
import { EventComponent } from '../../styled/sdmsPopupsStyled';
import SdmsResource from '../../resource/id';
import EventMemo from './eventMemo';
import { SDMSController } from '../../services/sdmsController';
import ProjectResource from '../../../Root/resource/id';
import { SettingController } from '../../../Settings/services/settingController';
import Button from '../../../Common/components/button';
import Icon from '../../../Common/components/Icon/Icon';
import SopManagerResource from '../../../SOPManager/resource/id';
import IconButton from '../../../Common/components/iconButton';
import SelectBox from '../../../Common/components/selectBox';
import noDataIcon from '../../../Common/images/noDataIcon.svg';

function Event(props) {
    const [menuType, setMenuType] = useState('sensor');
    const [alarmMemo, setAlarmMemo] = useState(null);
    const [showMemoPopup, setShowMemoPopup] = useState(false);
    const [displayAlarmList, setDisplayAlarmList] = useState([]);
    const [filter, setFilter] = useState('all');    // sensorTypes
    const [sort, setSort] = useState('newest');     // 최신순, 오래된순
    const [count, setCount] = useState({all: 0, sensor: 0, report: 0, predictiveAnalytics: 0});
    const [displayUI, setDisplayUI] = useState([]);
    const [allChecked, setAllChecked] = useState(true);
    const [checkedAlarmList, setCheckedAlarmList] = useState([]);
    const [memoMode, setMemoMode] = useState('single');

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
    }, [props.sensorAlarm, filter, sort]);

    useEffect(() => {
        const renderUI = async () => {
            let allAlarmCount = 0;
            let sensorAlarmCount = 0;
            let reportAlarmCount = 0;
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
        
            const listByMenu = (displayAlarmList || []).filter(a =>
                menuType === 'sensor' ? a.isSensorAlarm : !a.isSensorAlarm
            );

            if (listByMenu?.length > 0) {
                for (const alarm of listByMenu) {
                    let selected = '';
                    let isManualReportAlarm = false;

                    let isOpenMemo = false;
                    let isOpenCCTV = false;

                    // 수동신고된 알람인지 확인
                    if (alarm.sensorZoneNo >= 1000000) {
                        isManualReportAlarm = true;
                        reportAlarmCount++;
                    } else {
                        sensorAlarmCount++;
                    }
                    
                    if (props.sensorAlarm.selectedAlarm) { 
                        selected = alarm.sensorZoneHistoryNo === props.sensorAlarm.selectedAlarm.sensorZoneHistoryNo ? 'onEvent' : '';
                    }

                    if (selectedAlarmRef.current?.sensorZoneHistoryNo === alarm.sensorZoneHistoryNo && showMemoPopup) {
                        isOpenMemo = true;
                    }

                    if (props.alarmCCTVList?.alarm?.sensorZoneHistoryNo === alarm.sensorZoneHistoryNo) {
                        isOpenCCTV = true;
                    }

                    ui.push(
                        <div
                            key={alarm.sensorZoneHistoryNo}
                            className={alarm.isAlarm ? 'eventItem' : 'eventItem closed'}
                            id={selected}
                            onClick={() => handleSelectAlarm(alarm)}
                        >
                            <header>
                                <div className='eventInfoWrap'>
                                    {
                                        alarm.isAlarm &&
                                            <input
                                                type='checkbox'
                                                checked={checkedAlarmList.includes(alarm.sensorZoneHistoryNo)}
                                                onChange={(e) => onCheckedAlarm(e.target.checked, alarm.sensorZoneHistoryNo)}
                                                onClick={(e) => e.stopPropagation()}   // 리스트 아이템 onClick 방지
                                            />
                                    }
                                    <p className='sensorTypeName'>{`${SdmsResource.getFacilityTypeString(alarm.facilityType)}`} {alarm.sensorSubType && `(${SdmsResource.getFacilityTypeString(alarm.sensorSubType)})`}</p>
                                </div>
                                <div className='eventIconWrap'>
                                    <IconButton
                                        className={isOpenCCTV ? 'selected' : null}
                                        variant="unfill"
                                        size="xxs"
                                        icon={<Icon.CCTVIcon size={"xxxs"} />}
                                        disabled={alarm.isAlarm ? false : true}
                                        onClick={() => props.getAlarmCCTVList(alarm)}
                                    >
                                        CCTV
                                    </IconButton>
                                    <IconButton
                                        className={`${alarm.memo ? 'on' : ''} ${isOpenMemo ? 'selected' : ''}`}
                                        variant="unfill"
                                        size="xxs"
                                        icon={<Icon.MemoIcon size={"xxxs"} />}
                                        onClick={(e) => onClickOpenMemo(e, alarm)}
                                        disabled={alarm.isAlarm ? false : true}
                                    >
                                        메모
                                    </IconButton>
                                    <IconButton
                                        variant="unfill"
                                        size="xxs"
                                        icon={<Icon.CloseIcon size={"xxxs"} />}
                                        onClick={(e) => onClickClearAlarm(e, false, alarm)}
                                        disabled={alarm.isAlarm ? false : true}
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
                                    <span className={isManualReportAlarm ? 'type report' : alarm.isSensorAlarm ? 'type sensor': 'type equipment'}>
                                        {isManualReportAlarm ? '수동신고' : alarm.isSensorAlarm ? '센서탐지' : '예측분석'}
                                    </span>
                                </p>
                                <p>메모내용<span>{alarm.memo ? alarm.memo : '-'}</span></p>
                            </section>
                            {
                                selected &&
                                    <footer>
                                        {getSopStatus(alarm.sopStatus)}
                                        <Button 
                                            variant="unfill_light" size="xxs"
                                            onClick={(e) => onClickAlarmSop(e, alarm)}
                                            rightIcon={<Icon.Arrow size={"xxs"} direction={"right"} fill={alarm.isAlarm ? "grayscale.g500" : "grayscale.g700"} />}
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
            setCount({all: allAlarmCount, sensor: sensorAlarmCount, report: reportAlarmCount, predictiveAnalytics: 0});
        };

        renderUI();
    }, [displayAlarmList, props.sensorAlarm, props.selectedSensor, props.alarmCCTVList, checkedAlarmList, menuType, selectedAlarmRef.current]);

    useEffect(() => {
        const activeIds = getActiveIdsInCurrentTab();
        const isAll = activeIds.length > 0 && activeIds.every(x => checkedAlarmList.includes(x));
        setAllChecked(isAll);
    }, [displayAlarmList, checkedAlarmList, menuType]);

    // 현재 탭(menuType)에 보이는 활성 알람의 ID 목록
    const getActiveIdsInCurrentTab = () => {
        return displayAlarmList
            .filter(a => (menuType === 'sensor' ? a.isSensorAlarm : !a.isSensorAlarm))
            .filter(a => a.isAlarm)
            .map(a => a.sensorZoneHistoryNo);
    };

    const onCheckedAlarm = (checked, id) => {
        if (id === -1) {
            const activeIds = getActiveIdsInCurrentTab();

            if (checked) {
                setCheckedAlarmList(activeIds);
                setAllChecked(activeIds.length > 0);
            } else {
                setCheckedAlarmList([]);
                setAllChecked(false);
            }
            return;
        }

        // 개별 토글
        setCheckedAlarmList(prev => {
            const next = checked
                ? Array.from(new Set([...prev, id]))
                : prev.filter(x => x !== id);

            const activeIds = getActiveIdsInCurrentTab();
            const isAll = activeIds.length > 0 && activeIds.every(x => next.includes(x));
            setAllChecked(isAll);

            return next;
        });
    };

    const handleSelectAlarm = (alarm) => {
        props.setSensorAlarms([...props.sensorAlarm.alarms], alarm);
        props.getAlarmCCTVList(alarm);
    };

    const getSensorTypes = () => {
        let options = [];

        options.push({ value: 'all', label: '전체' });

        if (menuType === 'sensor') {
            for (const sensorType of props.sensorTypes) {
                if (sensorType.sensorTypeCode === SdmsResource.facilityType.FIRE ||
                    sensorType.sensorTypeCode === SdmsResource.facilityType.CCTV ||
                    sensorType.sensorTypeCode === SdmsResource.facilityType.PSM_SENSOR ||
                    sensorType.sensorTypeCode === SdmsResource.facilityType.ETC
                ) {
                    options.push({ value: sensorType.sensorTypeCode, label: sensorType.sensorTypeName });
                }
            }
        }
        else if (menuType === 'equipment') {
            for (const sensorType of props.sensorTypes) {
                if (sensorType.sensorTypeCode === SdmsResource.facilityType.EQUIPMENT) {
                    options.push({ value: sensorType.sensorTypeCode, label: sensorType.sensorTypeName });
                }
            }
        }

        return options;
    }

    const handleFilterChange = (value) => {
        setFilter(value);
    };

    const handleSortChange = (value) => {
        setSort(value);
    };

    const onClickClearAlarm = async (e, allSelectedAlarms, alarm) => {
        e.stopPropagation();

        if (allSelectedAlarms) {
            props.showConfirmDialog(ProjectResource.dialogTypes.MALFUNCTION, ["이벤트 알람을 선택 종료하시겠습니까?", `총 ${checkedAlarmList.length} 건의 종료된 이벤트는 되돌릴 수 없으며, 이력 관리 화면에서 확인 가능합니다.`], ["취소", "종료하기"], clearSelectedAlarms);
        }
        else {
            selectedAlarmRef.current = alarm; // ref에 선택된 alarm 저장
            props.showConfirmDialog(ProjectResource.dialogTypes.MALFUNCTION, ["이벤트 알람을 종료하시겠습니까?", "종료된 이벤트는 되돌릴 수 없으며, 이력 관리 화면에서 확인 가능합니다."], ["취소", "종료하기"], clearAlarm);
        }
    } 

    const clearSelectedAlarms = async (index, isMalfunction) => {
        if (index === 1) {
            const userInfo = ProjectResource.getUserInfo();
    
            if (userInfo) {
                const [result, message] = await SDMSController.clearAlarmList(checkedAlarmList, isMalfunction, userInfo.user_sn, null, null);
    
                if (!result) {
                    props.showConfirmDialog(ProjectResource.dialogTypes.ERROR, [message], null, null);
                }
                else {
                    props.handleToast("선택된 이벤트 알람이 모두 종료되었습니다");
                    removeElementID(); // 선택된 알람 섹션 element의 id 삭제
                    setCheckedAlarmList([]);
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
        setMemoMode('single');

        const [success, memo, message] = await SDMSController.requestAlarmMemo(alarm.sensorZoneHistoryNo);

        if (success) {
            selectedAlarmRef.current = alarm; // 개별 저장 대상
            setAlarmMemo(memo);
            setShowMemoPopup(true);
        } else {
            props.showConfirmDialog(ProjectResource.dialogTypes.ERROR, [message], null, null);
        }
    };

    const onClickOpenBatchMemo = (e) => {
        e.stopPropagation();
        if (!checkedAlarmList || checkedAlarmList.length === 0) return;

        setMemoMode('batch');
        selectedAlarmRef.current = null;     // 단일 대상 비움
        setAlarmMemo('');                    // 새로 작성
        setShowMemoPopup(true);
    };

    const onClickSaveMemo = async (memo, mode = 'single') => {
        if (mode === 'batch' && checkedAlarmList && checkedAlarmList.length > 0) {
            const [success, _, message] = await SDMSController.saveAlarmMemoList(checkedAlarmList, memo);
            if (success) {
                props.handleToast("선택된 알람들의 메모가 저장되었습니다");
                closeMemoPopup();
            } else {
                props.showConfirmDialog(ProjectResource.dialogTypes.ERROR, [message], null, null);
            }
            return;
        }

        // single
        const alarm = selectedAlarmRef.current;
        if (!alarm) return;

        const [success, _, message] = await SDMSController.saveAlarmMemo(alarm.sensorZoneHistoryNo, memo);
        if (success) {
            props.handleToast("메모가 저장되었습니다");
            closeMemoPopup();
        } else {
            props.showConfirmDialog(ProjectResource.dialogTypes.ERROR, [message], null, null);
        }
    };

    const closeMemoPopup = () => {
        selectedAlarmRef.current = null;
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
                props.history.push(ProjectResource.path.sopSimulator);
                await SDMSController.runAlarmSop(alarm.sensorZoneHistoryNo, userInfo.user_sn);
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

    const onChangeMenuType = (menu) => {
        setMenuType(menu);
        setFilter('all');
        setSort('newest');
        setCheckedAlarmList([]);
    }

    return (
        <>
        <EventComponent id={props.popupType} className='UI_Section event' $resize={true}>
            <PopupDraggable
                id={props.popupType}
                popupMinWidth={340}
                popupMinHeight={784}
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
                <ul className='menuTypeWrap'>
                    <li
                        className={menuType === 'sensor' ? 'on' : null}
                        onClick={() => onChangeMenuType('sensor')}
                    >
                        {`센서 (${props.sensorAlarm.alarms.filter(a => a.isSensorAlarm).length})`}
                    </li>
                    <li
                        className={menuType === 'equipment' ? 'on' : null}
                        onClick={() => onChangeMenuType('equipment')}
                    >
                        {`설비 (${props.sensorAlarm.alarms.filter(a => !a.isSensorAlarm).length})`}
                    </li>
                </ul>
                {
                    props.sensorAlarm.alarms.length > 0 ? 
                        <div className={'content'}>
                            <div className='sortWrap'>
                                <SelectBox
                                    value={filter}
                                    onChange={handleFilterChange}
                                    options={getSensorTypes()}
                                />
                                <SelectBox
                                    value={sort}
                                    onChange={handleSortChange}
                                    options={[
                                        { value: "newest", label: "최신순" },
                                        { value: "oldest", label: "오래된순" },
                                    ]}
                                />
                            </div>

                            <div className='textWrap'>
                                <label>
                                    <input
                                        type="checkbox"
                                        checked={allChecked}
                                        disabled={
                                            displayAlarmList
                                                .filter(a => (menuType === 'sensor' ? a.isSensorAlarm : !a.isSensorAlarm))
                                                .every(a => !a.isAlarm)
                                        }
                                        onChange={(e) => onCheckedAlarm(e.target.checked, -1)}
                                        onClick={(e) => e.stopPropagation()}
                                    />
                                    전체선택
                                </label>
                                <div>
                                    <p>센서탐지 : <span>{count.sensor}</span></p>
                                    {
                                        menuType === 'sensor' ?
                                        <p>수동신고 : <span>{count.report}</span></p>
                                        : <p>예측분석 : <span>{count.predictiveAnalytics}</span></p>
                                    }
                                </div>
                            </div>

                            <div className='eventWrap scrollbar'>
                                {displayUI}
                            </div>
                            <div className='btnWrap'>
                                <Button
                                    variant="line"
                                    size="md"
                                    disabled={checkedAlarmList.length === 0}
                                    onClick={onClickOpenBatchMemo}
                                >
                                    메모 작성하기
                                </Button>

                                <Button
                                    variant="fill"
                                    size="md"
                                    disabled={checkedAlarmList.length === 0}
                                    onClick={(e) => onClickClearAlarm(e, true)} // 선택 종료하기
                                >
                                    선택 종료하기
                                </Button>
                            </div>
                        </div> :
                        <div className={'content noData'}>
                            <img src={noDataIcon} alt='데이터 없음 아이콘' />
                            <p>진행 중인 이벤트가 없습니다</p>
                            <p>이전 이벤트 정보는 이력관리에서 확인하세요</p>
                            <button onClick={() => props.history.push(ProjectResource.path.history)}>이동하기</button>
                        </div>
                }
            </PopupDraggable>
        </EventComponent>
        {showMemoPopup && 
            <EventMemo 
                popupType='SDMS'
                closeMemoPopup={closeMemoPopup}
                alarmMemo={alarmMemo}
                onClickSaveMemo={onClickSaveMemo}
                checkedAlarmList={checkedAlarmList}
                memoMode={memoMode}
            />
        }
        </>
    );
}

export default withRouter(Event);