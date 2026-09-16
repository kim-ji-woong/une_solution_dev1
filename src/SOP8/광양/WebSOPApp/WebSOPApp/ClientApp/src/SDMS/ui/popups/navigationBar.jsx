import React, {useEffect, useRef, useState} from 'react';

import { KeyMapComponent, NavigationBarComponent } from '../../styled/sdmsPopupsStyled';
import SdmsResource from '../../resource/id';
import socketStore from "../../webSocket/socketStore";
import { DistanceMeasureComponent } from '../../styled/sdmsPopupsStyled';
import ProjectResource from '../../../Root/resource/id';


function NavigationBar(props) {
    const [showPOIviewer, setShowPOIviewer] = useState(false);
    const [show3Dtypes, setShow3Dtypes] = useState(false);
    const [showSimulation, setShowSimulation] = useState(false);

    const [isShowAtmosphere, setIsShowAtmosphere] = useState(true);
    const [isShowWeather, setIsShowWeather] = useState(true);
    const [isShowEnvironmentCCTV, setIsShowEnvironmentCCTV] = useState(true);
    const [isShowBuildingName, setIsShowBuildingName] = useState(true);
    
    const [autoRotate, setAutoRotate] = useState(false);

    const [showDistanceMeasurePopup, setShowDistanceMeasurePopup] = useState(false);
    const [showKeyMapPopup, setShowKeyMapPopup] = useState(false);
    
    const [isSpecialMode, setIsSpecialMode] = useState(false);
    
    const setVisiblePopups = (menu, visible) => {
        props.setVisiblePopups(menu, visible);
    }

    const setVisibleTools = (type) => {
        if (isSpecialMode) {
            props.showConfirmDialog(ProjectResource.dialogTypes.INFO, ["특수모드를 먼저 해제 해주세요."], ["확인"], props.onCloseConfirmDialog);
            return;
        }
        
        if (type === 'POIviewer' && props.isSimulationMode) return;
        
        const types = {
            "POIviewer": setShowPOIviewer,
            "3Dtypes": setShow3Dtypes,
            "simulations": setShowSimulation,
        };

        Object.entries(types).forEach(([key, setter]) => {
            if (key !== type) setter(false);
        });

        if (types[type]) {
            types[type]((prevState) => !prevState);
        }
    }

    const getQuickButtonClassName = (name) => {

        if (props.isSimulationMode || isSpecialMode) {
            return 'disable';
        }
        
        // 알람이 1건도 없으면 버튼 비활성화
        if (name === SdmsResource.ID.menu.event && props.sensorAlarms?.length === 0) {
            return 'disable';
        }

        if (props.visiblePopups[name]) {
            return 'on';
        }

        return 'off';
    }

    // isSpecialMode는 특수모드에서만 사용
    // 특수모드: 거리측정, 시뮬레이션
    useEffect(() => {
        setIsSpecialMode(showDistanceMeasurePopup);
    }, [showDistanceMeasurePopup]);
    
    const onClickShowPOI = (type) => {
        let isShow = null;
        
        switch(type) {
            case SdmsResource.externalSensorType.atmosphere:
                isShow = isShowAtmosphere;
                setIsShowAtmosphere(prev => !prev);
                break;
            case SdmsResource.externalSensorType.weather:
                isShow = isShowWeather
                setIsShowWeather(prev => !prev);
                break;
            case SdmsResource.externalSensorType.environmentCCTV:
                isShow = isShowEnvironmentCCTV
                setIsShowEnvironmentCCTV(prev => !prev);
                break;
            case SdmsResource.externalSensorType.buildingName:
                isShow = isShowBuildingName
                setIsShowBuildingName(prev => !prev);
                break;
        }
        
        const wsMgr = socketStore.getState().wsMgr;
        if (wsMgr && wsMgr.connected) {
            const content = {
                "poiType": type,
                "isShow": !isShow,
            }
            
            wsMgr.sendVisiblePOICategory(content);
        }
    }
    
    const onClickToolIcon = (type) => {
        switch (type) {
            case SdmsResource.navigationBarIcon.initScene:
                if (isSpecialMode) {
                    props.showConfirmDialog(ProjectResource.dialogTypes.INFO, ["초기화면 이동은 특수모드에서 지원하지 않습니다."], ["확인"], props.onCloseConfirmDialog);
                }
                moveInitialDisplay();
                break;
            case SdmsResource.navigationBarIcon.setInitScene:
                if (isSpecialMode) {
                    props.showConfirmDialog(ProjectResource.dialogTypes.INFO, ["초기화면 지정은 특수모드에서 지원하지 않습니다."], ["확인"], props.onCloseConfirmDialog);
                }
                setInitScene();
                break;
            case SdmsResource.navigationBarIcon.zoomIn:
                zoom(1);
                break;
            case SdmsResource.navigationBarIcon.zoomOut:
                zoom(0);
                break;
            case SdmsResource.navigationBarIcon.autoRotate:
                if (isSpecialMode) {
                    props.showConfirmDialog(ProjectResource.dialogTypes.INFO, ["즉시회전은 특수모드에서 지원하지 않습니다."], ["확인"], props.onCloseConfirmDialog);
                    return;
                }
                setAutoRotation();
                break;
            case SdmsResource.navigationBarIcon.distanceMeasure:
                if (autoRotate) {
                    return props.showConfirmDialog(ProjectResource.dialogTypes.INFO, ["거리측정은 즉시회전 모드 활성화시 불가능합니다."], ["확인"], props.onCloseConfirmDialog);
                }
                setShowDistanceMeasurePopup((prev) => {
                    props.disappearPopups(!prev, SdmsResource.navigationBarIcon.distanceMeasure);
                    if (!prev) {
                        setShowKeyMapPopup(false);
                    }
                    
                    const wsMgr = socketStore.getState().wsMgr;
                    if (wsMgr && wsMgr.connected) {
                        const content = {
                            "value": !prev ? 1 : 0,
                        }
                        wsMgr.sendMeasurementMode(content);
                    }
                        
                    return !prev
                });
                break;
            case SdmsResource.navigationBarIcon.keyMap:
                if (showDistanceMeasurePopup) {
                    props.showConfirmDialog(ProjectResource.dialogTypes.INFO, ["거리측정은 키 맵과 동시에 사용이 불가능합니다."], ["확인"], props.onCloseConfirmDialog);
                    break;
                }
                
                setShowKeyMapPopup(prev => !prev)
                break;
        }
    }
    
    // 초기화면 이동 신호
    const moveInitialDisplay = () => {
        props.moveInitialViewport();
    }
    
    // 초기화면 지정
    const setInitScene = () => {
        const wsMgr = socketStore.getState().wsMgr;
        if (wsMgr && wsMgr.connected) {
            return wsMgr.sendRequestCameraLocation();
        }
    }
    
    // 확대, 축소
    const zoom = (value) => {
        const wsMgr = socketStore.getState().wsMgr;
        if (wsMgr && wsMgr.connected) {
            const content = {
                "value": value,
            }
            wsMgr.sendZoom(content);
        }
    }
    
    // 즉시회전
    const setAutoRotation = () => {
        setAutoRotate((prev) => {
            
            const wsMgr = socketStore.getState().wsMgr;
            if (wsMgr && wsMgr.connected) {
                const content = {
                    "value": !prev ? 1 : 0,
                }
                wsMgr.sendAutoRotation(content);
            }
            return !prev
        });
    }
    
    const onClickIcon = (type) => {
        if (type === SdmsResource.ID.menu.event) {
            if (props.sensorAlarms.length > 0 && !isSpecialMode) {
                return setVisiblePopups(type);
            } else if (props.sensorAlarms.length === 0) {
                return props.showConfirmDialog(ProjectResource.dialogTypes.INFO, ["이벤트 정보가 없습니다."], ["확인"], props.onCloseConfirmDialog);
            } else if (isSpecialMode) {
                return props.showConfirmDialog(ProjectResource.dialogTypes.INFO, ["상태창은 특수모드에서 지원하지 않습니다."], ["확인"], props.onCloseConfirmDialog);
            }
        }
        
        if (isSpecialMode) {
            return props.showConfirmDialog(ProjectResource.dialogTypes.INFO, ["상태창은 특수모드에서 지원하지 않습니다."], ["확인"], props.onCloseConfirmDialog);
        } else {
            return setVisiblePopups(type);
        }
    }

    const onClickSimulationIcon = (type) => {
        switch (type) {
            case SdmsResource.simulationType.atmosphere:
                setVisiblePopups(SdmsResource.ID.menu.atmosphereSimulation);
                break;
            case SdmsResource.simulationType.flood:
                setVisiblePopups(SdmsResource.ID.menu.floodSimulation);
                break;
        }
    }

    return (
        
        <>
        <NavigationBarComponent className='UI_Section'>
            <div>
                <ul>
                    <li data-title="센서현황" className={getQuickButtonClassName(SdmsResource.ID.menu.statusInfo) + " " + 'statusInfoIcon'}>
                        <button id={"dsBot_" + SdmsResource.popupLayer.statusInfo} onClick={() => onClickIcon(SdmsResource.ID.menu.statusInfo)} />
                    </li>
                    <li data-title="이벤트 현황" className={getQuickButtonClassName(SdmsResource.ID.menu.event) + " " + 'eventIcon'}>
                        <button id={"dsBot_" + SdmsResource.popupLayer.event} onClick={() => props.sensorAlarms.length > 0 && onClickIcon(SdmsResource.ID.menu.event)} />
                    </li>
                    <li data-title="공공데이터" className={getQuickButtonClassName(SdmsResource.ID.menu.publicData) + " " + 'publicDataIcon'}>
                        <button id={"dsBot_" + SdmsResource.popupLayer.publicData} onClick={() => onClickIcon(SdmsResource.ID.menu.publicData)} />
                    </li>
                    <li data-title="미니맵" className={getQuickButtonClassName(SdmsResource.ID.menu.miniMap) + " " + 'miniMapIcon'}>
                        <button id={"dsBot_" + SdmsResource.popupLayer.miniMap} onClick={() => onClickIcon(SdmsResource.ID.menu.miniMap)} />
                    </li>
                </ul>
                <ul>
                    <li data-title="POI 뷰어" className={(isSpecialMode || props.isSimulationMode) ? 'poiViewerIcon disable' : (showPOIviewer ? 'poiViewerIcon on' : 'poiViewerIcon')} onClick={() => setVisibleTools('POIviewer')}>
                        <button />
                    </li>
                    {
                        showPOIviewer &&
                            <li className='poiIcon'>
                                {/* className on 추가시 효과 적용*/}
                                <button className={'UI_Section ' + (isShowAtmosphere ? 'on' : '')} onClick={() => onClickShowPOI(SdmsResource.externalSensorType.atmosphere)} data-title="대기유해물질측정기"></button>
                                <button className={'UI_Section ' + (isShowWeather ? 'on' : '')} onClick={() => onClickShowPOI(SdmsResource.externalSensorType.weather)} data-title="통합기상측정기"></button>
                                <button className={'UI_Section ' + (isShowEnvironmentCCTV ? 'on' : '')} onClick={() => onClickShowPOI(SdmsResource.externalSensorType.environmentCCTV)} data-title="환경감시 CCTV"></button>
                                <button className={'UI_Section ' + (isShowBuildingName ? 'on' : '')} onClick={() => onClickShowPOI(SdmsResource.externalSensorType.buildingName)} data-title="건물명"></button>
                            </li>
                    }
                    <li data-title="3D 툴" className={show3Dtypes ? 'tool3DIcon on' : 'tool3DIcon'} onClick={() => setVisibleTools('3Dtypes')}>
                        <button />
                    </li>
                    {
                        show3Dtypes &&
                            <li className='toolIcon'>
                                <button className={(isSpecialMode ? 'disable ' : '') + 'UI_Section'} data-title="초기화면" onClick={() => onClickToolIcon(SdmsResource.navigationBarIcon.initScene)}></button>
                                <button className={(isSpecialMode ? 'disable ' : '') + 'UI_Section'} data-title="초기화면 지정" onClick={() => onClickToolIcon(SdmsResource.navigationBarIcon.setInitScene)}></button>
                                <button className='UI_Section' data-title="확대" onClick={() => onClickToolIcon(SdmsResource.navigationBarIcon.zoomIn)}></button>
                                <button className='UI_Section' data-title="축소" onClick={() => onClickToolIcon(SdmsResource.navigationBarIcon.zoomOut)}></button>
                                <button className={(isSpecialMode ? 'disable ' : '') + (autoRotate ? 'rotate ' : '') + 'UI_Section'} data-title="즉시회전" onClick={() => onClickToolIcon(SdmsResource.navigationBarIcon.autoRotate)}></button>
                                <button className={showDistanceMeasurePopup&& 'on'} data-title="거리측정" onClick={() => onClickToolIcon(SdmsResource.navigationBarIcon.distanceMeasure)}></button>
                                <button className={(isSpecialMode ? 'disable ' : '') + 'UI_Section'} data-title="키 맵" onClick={() => onClickToolIcon(SdmsResource.navigationBarIcon.keyMap)}></button>
                            </li>
                    }
                </ul>
            </div>
            <div>
                <ul>
                    <li data-title="확산 시뮬레이션" className={showSimulation ? 'simulationIcon on' : 'simulationIcon'} onClick={() => setVisibleTools('simulations')}>
                        <button />
                    </li>
                    {
                        showSimulation &&
                            <li className='simulationTypeIcon'>
                                <button className={props.visiblePopups[SdmsResource.ID.menu.atmosphereSimulation] ? 'UI_Section on' : 'UI_Section'} data-title="대기 시뮬레이션" onClick={() => onClickSimulationIcon(SdmsResource.simulationType.atmosphere)}></button>
                                {/*<button className={props.visiblePopups[SdmsResource.ID.menu.floodSimulation] ? 'UI_Section on' : 'UI_Section'} data-title="홍수 시뮬레이션" onClick={() => onClickSimulationIcon(SdmsResource.simulationType.flood)}></button>*/}
                            </li>
                    }
                </ul>
            </div>
        </NavigationBarComponent>
        {
            showDistanceMeasurePopup &&
                <DistanceMeasure
                    onClickToolIcon={onClickToolIcon}
                    showConfirmDialog={props.showConfirmDialog}
                    onCloseConfirmDialog={props.onCloseConfirmDialog}
                />
        }
        {
            showKeyMapPopup &&
                <KeyMap
                    onClickToolIcon={onClickToolIcon}
                />
        }
        </>
    );
}

export default NavigationBar;


// 거리측정 팝업
function DistanceMeasure(props) {
    const [start, setStart] = useState(false);
    const [totalDistance, setTotalDistance] = useState(null);
    const [totalArea, setTotalArea] = useState(null);
    
    const totalDistanceRef = useRef(null);
    const totalAreaRef = useRef(null);

    useEffect(() => {
        totalDistanceRef.current = totalDistance;
        totalAreaRef.current = totalArea;
    }, [totalDistance, totalArea]);


    useEffect (() => {
        const unsubscribeSocket = socketStore.subscribe(() => {
            const data = socketStore.getState();
            const td = totalDistanceRef.current;
            const ta = totalAreaRef.current;
            if (data.actionType === "MEASUREMENT_RESULT") {
                const measurementResult = data.measurementResult;
                if (measurementResult) {
                    // 측정 끝난 시점에 ESC 한번더 입력시 측정 시작으로 인식하여 조건추가
                    if (ta === measurementResult.totalArea && td === measurementResult.totalDistance &&
                        ta !== 0 && td !== 0) {
                        return;
                    }
                    
                    if (ta !== measurementResult.totalArea && td === measurementResult.totalDistance) {
                        setTotalDistance(measurementResult.totalDistance);
                        setTotalArea(measurementResult.totalArea);
                        setStart(false);
                        return;
                    }

                    setTotalDistance(measurementResult.totalDistance);
                    setTotalArea(measurementResult.totalArea);
                    setStart(true);
                }
            }
        });
        
        return () => {
            unsubscribeSocket();
        }
        
    }, []);

    const onClickClosePopup = () => {
        props.showConfirmDialog(ProjectResource.dialogTypes.QUESTION, ["거리측정 모드를 종료하시겠습니까?"], ["취소", "종료하기"], doClosePopup);
    }
    
    const doClosePopup = (index) => {
        if (index === 0) {
            props.onCloseConfirmDialog();
            return;
        }
        
        props.onClickToolIcon(SdmsResource.navigationBarIcon.distanceMeasure);
        props.onCloseConfirmDialog();
    }

    return (
        <DistanceMeasureComponent className={"UI_Section"}>
            <div className='dslTop'>
                <h5 className='dslTitle'>
                    거리측정
                </h5>
                <button className='dslX' onClick={() => onClickClosePopup()}>닫기</button>
            </div>
            <div className='rangeContent'>
                <ul className='range'>
                    {
                        !start ?
                        <li>시작점을 선택하여<br />거리를 측정해주세요.</li> :
                        <li>‘ESC’키를 눌러<br />측정을 마칠 수 있습니다.</li>
                    }
                </ul>
                <ul className='total'>
                    <li className={totalDistance ? 'on' : null}>
                        <p>총 거리</p>
                        <p>{totalDistance ? 
                            totalDistance + 'm' :
                            '-'
                        }</p>
                    </li>
                    <li className={totalArea ? 'on' : null}>
                        <p>총 면적</p>
                        <p>{totalArea ? 
                            totalArea + '㎡' :
                            '-'
                        }</p>
                    </li>
                </ul>
            </div>
        </DistanceMeasureComponent>
    );
} 


// 키 맵 팝업
function KeyMap(props) {

    return (
        <KeyMapComponent className={"UI_Section"}>
            <div className='dslTop'>
                <h5 className='dslTitle'>
                    키 맵 도움말
                </h5>
                <button className='dslX' onClick={() => props.onClickToolIcon(SdmsResource.navigationBarIcon.keyMap)}>닫기</button>
            </div>
            <div className='keyMapContent'>
                <ul>
                    <li>
                        <p>TOP</p>
                        <div>
                            <p>Ctrl</p>
                            <p>T</p>
                        </div>
                    </li>
                    <li>
                        <p>FRONT</p>
                        <div>
                            <p>Ctrl</p>
                            <p>F</p>
                        </div>
                    </li>
                    <li>
                        <p>LEFT</p>
                        <div>
                            <p>Ctrl</p>
                            <p>L</p>
                        </div>
                    </li>
                    <li>
                        <p>RIGHT</p>
                        <div>
                            <p>Ctrl</p>
                            <p>R</p>
                        </div>
                    </li>
                    <li>
                        <p>ISO</p>
                        <div>
                            <p>Ctrl</p>
                            <p>S</p>
                        </div>
                    </li>
                </ul>
            </div>
        </KeyMapComponent>
    );
}