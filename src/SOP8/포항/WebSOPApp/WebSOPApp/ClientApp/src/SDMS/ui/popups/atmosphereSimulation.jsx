import React, { useReducer, useEffect, useRef } from 'react';
import PopupDraggable from './popupDraggable';
import { AtmosphereSimulationComponent } from '../../styled/sdmsPopupsStyled';
import SdmsResource from '../../resource/id';
import calendar_icon from '../../images/calendar_icon.svg';
import pbb_img from '../../images/ppb_img.svg';
import tooltip_icon from '../../images/tooltip_icon.svg';
import ProjectResource from "../../../Root/resource/id";
import DateCalendar from '../../../Common/ui/calendar';
import socketStore from "../../webSocket/socketStore";
import simulationStore from "../../webSocket/simulationStore";
import wsManager from "../../webSocket/wsManager";

const initialState = {
    opacity: 1,
    menu: true,     // true: 실시간 모델, false: 예보 모델
    play: false,    // true: 시뮬레이션 실행, false: 정지
    date: new Date(),
    currentTime: 0,
    altitudes: [1.5, 15, 45, 60],
    times: [0],     // 데이터가 존재하는 시간목록
    isStart: false,
    averageData: { ou: 0, windSpeed: 0 },
    defaultValues: {
        realtime: { 
            play: false,
            date: new Date(),
            altitude: 1.5,
            time: 0,
            averageData: { ou: 0, windSpeed: 0 }
        },
        forecast: {
            play: false,
            date: new Date(),
            altitude: 1.5,
            time: 0,
            averageData: { ou: 0, windSpeed: 0 }
        }
    },
    showCalendar: false,
    selectedDate: new Date()
};

function reducer(state, action) {
    switch (action.type) {
        case 'SET_STATE':
            return { ...state, ...action.payload };
        default:
            return state;
    }
}

function AtmosphereSimulation(props) {
    const [state, dispatch] = useReducer(reducer, initialState);
    const isMounted = useRef(true);

    useEffect(() => {
        
        const simulationSubscribe = simulationStore.subscribe(() => {
            const data = simulationStore.getState();
            if (data.actionType === "HOURS_INFO") {
                const header = wsManager.appToWeb.SendDiffusionHoursInfo;
                setSimulationInfoFromApp(header, data.hoursInfo);
            } else if (data.actionType === "DIFFUSION_DATA") {
                const header = wsManager.appToWeb.ResponseDiffusionData;
                setSimulationInfoFromApp(header, data.diffusionData);
            } else if (data.actionType === "PLAY_END") {
                const header = wsManager.appToWeb.PlayEnd;
                if (data.playEnd) {
                    _setState({ play: false, isStart: false });
                    simulationStore.dispatch({ type: "PLAY_END", playEnd: false });
                }
            }
        });
        
        return () => {
            isMounted.current = false;
            
            simulationSubscribe();
        };
    }, []);
    
    useEffect(() => {
        sendDiffusionInfo();
    }, [state.selectedDate, state.menu]);

    const _setState = (newState) => {
        if (isMounted.current) {
            dispatch({ type: 'SET_STATE', payload: newState });
        }
    };

    const onClickDate = (date) => {
        _setState({ selectedDate: date, showCalendar: false });
    }

    const getSelectedDate = () => {
        const selectedDate = state.selectedDate;

        if (selectedDate) {
            const date = new Date(selectedDate);
            const year = date.getFullYear();
            const month = String(date.getMonth() + 1).padStart(2, '0');
            const day = String(date.getDate()).padStart(2, '0');
            return `${year}-${month}-${day}`;
        }
    }
    
    const setSimulationInfoFromApp = (header, content) => {
        if (header === 51) {
            let date = new Date(content.date);
            let times = content.hours.map(item => parseInt(item));

            if (!times || times.length === 0) {
                props.showConfirmDialog(ProjectResource.dialogTypes.INFO, ["데이터가 존재하지 않습니다."], ["확인"], props.onCloseConfirmDialog);
            }

            _setState({ date, times });
        }

        if (header === 52) {
            let currentTime = content.hour;
            let averageData = {
                ou: content.conc,
                windSpeed: content.wind
            };
            _setState({ currentTime, averageData });
        }
    };
    
    const getCurrentType = () => {
        // true : 실시간 모델, false: 예보 모델
        return state.menu ? "r" : "f";
    }
    
    const getNowDate = () => {
        const date = new Date('2024-11-11');
        const year = date.getFullYear();
        const month = date.getMonth() + 1;
        const day = date.getDate();
        
        return year + '-' + month + '-' + day;
    }

    const changePopupOpacity = (value) => {
        _setState({ opacity: value });
    }
    
    const changeTimeStampOnMouseUp = (e) => {
        const value = e.target.value;
        
        // send "hour" like "00", "01", "02", ..., "23"
        let parameter = {
            "hour": value.toString().padStart(2, '0'),
        };
        
        const wsMgr = socketStore.getState().wsMgr;
        if (wsMgr && wsMgr.connected) {
            wsMgr.sendDiffusionSimulationTimeChanged(parameter);
        }
        
        _setState({ currentTime: value });
    }
    
    const onClickDatepicker = (e) => {
        _setState({ showCalendar: !state.showCalendar });
	}
    
    const onClickAltitude = (value) => {
        let altitudes = state.altitudes;
        
        if (altitudes.includes(value)) {
            altitudes = altitudes.filter(item => item !== value);
            sendAltitude(value, 0);
        } else {
            altitudes.push(value);
            altitudes.sort((a, b) => a - b);
            sendAltitude(value, 1);
        }
        
        _setState({ altitudes });
    }
    
    const sendDiffusionInfo = () => {
        const date = state.selectedDate;
        let korDateFormat = date.getFullYear() + '-' + (date.getMonth() + 1).toString().padStart(2, '0') + '-' + date.getDate().toString().padStart(2, '0');
        let parameter = {
            "date": korDateFormat,
            "type": getCurrentType()
        }
        
        const wsMgr = socketStore.getState().wsMgr;
        if (wsMgr && wsMgr.connected) {
            wsMgr.sendDiffusionInfo(parameter);
        }
    }
    
    const sendAltitude = (altitude, status) => {
        const wsMgr = socketStore.getState().wsMgr;
        if (wsMgr && wsMgr.connected) {
            let parameter = {
                "heightType": altitude,
                "value": status
            }
            wsMgr.sendDiffusionHeightVisibleCategory(parameter);
        }
    }
    
    const getAltitudeUI = () => {
        let altitudes = state.altitudes;
        let altitude = [1.5, 15, 45, 60];
        let altitudeUI = [];
        
        for (let i = 0; i < altitude.length; i++) {
            const altitudeBtnClassName = altitudes.includes(altitude[i]) ? "on" : "off";
            altitudeUI.push(
                <button key={`altitude_${i}`} className={altitudeBtnClassName} onClick={() => onClickAltitude(altitude[i])}>{altitude[i] + "m"}</button>
            );
        }
        
        return altitudeUI;
    }
    
    const onClickPlay = () => {
        /*
        * 실행시 웹소켓으로 옵션값 전송 
        */
        const wsMgr = socketStore.getState().wsMgr;
        if (wsMgr && wsMgr.connected) {
            if (state.play) {
                // 정지
                wsMgr.sendStopDiffusionSimulation();
            } else {
                // 시작
                wsMgr.sendPlayDiffusionSimulation();
            }
        }

        _setState({ play: !state.play });
    }
    
    const onChangeMenu = (menu) => { // true: 실시간, false: 예보
        let parameter = {
            "date": getNowDate(),
            "type": menu ? "r" : "f"
        }
        
        if (props.wsMgr) {
            if (props.wsMgr.connected) {
                props.wsMgr.sendDiffusionInfo(parameter);
            }
        }
        
        _setState({ 
            menu, 
            play: false, 
            times: [0], 
            currentTime: 0,
            averageData: {
                ou: 0,
                windSpeed: 0
            },
            date: new Date(),
            altitudes: [1.5, 15, 45, 60]
            
        });
    }
    
    const getMinMaxTime = () => {
        const times = state.times;
        let min = 0;
        let max = 0;
        
        if (times.length > 0) {
            min = times[0];
            max = times[times.length - 1];
        }
        
        return [min, max];
    }

    const [min, max] = getMinMaxTime();
    
    return (
        <AtmosphereSimulationComponent id={props.popupType} className='UI_Section atmosphereSimulation' $opacity={state.opacity} $resize={false}>
            <PopupDraggable
                id={props.popupType}
                popupMinWidth={300}
                popupMinHeight={254}
                topSize={40}
                popupState={props.popupState}
                setActiveDragPopup={props.setActiveDragPopup}
                setPopupState={props.setPopupState}
                usePopupResize={false}
            >
                <div className='dslTop'>
                    <h5 className='dslTitle'>
                        {SdmsResource.ID.menu.atmosphereSimulation}
                    </h5>
                    <input
                        type="range"
                        className="rangeInput"
                        min={0.1}
                        max={1}
                        color="gray"
                        step={0.1}
                        defaultValue={state.opacity}
                        onChange={(e) => {
                            changePopupOpacity(e.target.valueAsNumber)
                        }}
                    />
                    <button className='dslX' onClick={() => props.setVisiblePopups(SdmsResource.ID.menu.atmosphereSimulation, false)}>닫기</button>
                </div>

                <div className={'content'}>
                    <div className='menuBtn'>
                        <button className={state.menu ? 'on' : null} onClick={() => onChangeMenu(true)}>실시간 모델</button>
                        <button className={!state.menu ? 'on' : null} onClick={() => onChangeMenu(false)}>예보 모델</button>
                    </div>
                    <div className="contentBox flex">
                        <div className='contentHeadWrap'>
                            <p className='contentName'>기본값 설정</p>
                            <div id='tooltip' data-tooltip={state.menu ? "특정 일자의 데이터를 실시간으로 불러올 수 있는 기능" : "한시간 뒤 데이터를 예보할 수 있는 기능"} >
                                <img src={tooltip_icon} alt='도움말 아이콘' />
                            </div>
                        </div>
                        <ul className='defaultWrap'>
                            <li>
                                <p>날짜</p>
                                {
                                    state.menu ? 
                                        <div className={'datepicker'}>
                                            {
                                                state.showCalendar ?
                                                <DateCalendar
                                                    onClickDate={onClickDate}
                                                    onClickDatepicker={onClickDatepicker}
                                                    selectedDate={state.selectedDate}
                                                /> : 
                                                <div
                                                    onClick={(e) => onClickDatepicker(e)}
                                                    style={{ background: '#222A38', width: '118px', height: '26px', padding: '5px 10px', borderRadius: '2px', display: 'flex', justifyContent: 'flex-start', alignItems: 'center', cursor: 'pointer' }}
                                                >{getSelectedDate()}</div>
                                            }
                                            <img src={calendar_icon} alt="" className={'btnCalendarBk'} onClick={(e) => onClickDatepicker(e)} style={{ cursor: 'pointer' }} />
                                        </div>
                                        : <div>{getNowDate()}</div>
                                }
                            </li>
                            <li>
                                <p>고도</p>
                                <div>
                                    {getAltitudeUI()}
                                </div>
                            </li>
                            <li>
                                <p>시뮬레이션 실행</p>
                                <div>
                                    <p>{state.currentTime}</p>
                                    <button className={state.play ? 'off' : 'on'} onClick={() => onClickPlay()}>실행 버튼</button>
                                </div>
                            </li>
                            <li>
                                <input
                                    type="range"
                                    className="timeStampInput"
                                    min={min}
                                    max={max}
                                    color="gray"
                                    step={1}
                                    value={state.currentTime}
                                    onChange={(e) => _setState({ currentTime: e.target.valueAsNumber })}
                                    onMouseUp={(e) => {
                                        changeTimeStampOnMouseUp(e)
                                    }}
                                    
                                />
                                <div>
                                    <p>{min}</p>
                                    <p>{max}</p>
                                </div>
                            </li>
                        </ul>
                    </div>
                    <div className="contentBox flex">
                        <p className='contentName'>평균 데이터</p>
                        <ul className='dataWrap'>
                            <li>
                                <p>대기유해물질</p>
                                <p>{state.averageData.ou}</p>
                            </li>
                            <li>
                                <p>풍속(m/s)</p>
                                <p>{state.averageData.windSpeed}</p>
                            </li>
                        </ul>
                    </div>
                    <div className="contentBox flex">
                        <p className='contentName'>대기유해물질 범례</p>
                        <div className='legendWrap'>
                            <div>
                                <p>0</p>
                                <p>3</p>
                                <p>10</p>
                                <p>50</p>
                                <p>100</p>
                            </div>
                            <img src={pbb_img} alt='대기유해물질 범례 이미지' />
                        </div>
                    </div>
                </div>
            </PopupDraggable>
        </AtmosphereSimulationComponent>
    );
}

export default AtmosphereSimulation;