import React, {useCallback, useEffect, useRef, useState} from 'react';
import $ from 'jquery';
import {withRouter} from 'react-router-dom';
import SDMSResource from '../resource/id';
import SdmsResource from '../resource/id';
import ProjectResource from '../../Root/resource/id';
import SDMSMainMenu from './sdmsMainMenu';

import NavigationBar from './popups/navigationBar';
import StatusInfo from './popups/statusInfo';
import StatusSensorInfo from './popups/statusSensorInfo';
import WeatherInfo from './popups/weatherInfo';
import Event from './popups/event';

import {SDMSController} from '../services/sdmsController';
import Contents3D from './3D/contents3D';
import {ExternalController} from "../services/externalController";

import store from '../../Root/store';
import ConfirmDialog from '../../Common/ui/confirmDialog';
import socketStore from "../webSocket/socketStore";
import SettingsStore from "../../Settings/settingsStore";
import {SettingController} from "../../Settings/services/settingController";
import EventDashboard from './popups/eventDashboard';
import MiniMap from './popups/miniMap';
import AtmosphereSimulation from './popups/atmosphereSimulation';
import { AccountController } from '../../Account/services/accountController';
import Loader from "../../Common/ui/loader";
import QuickMenuBar from './popups/quickMenuBar';
import { useToast } from '../../Common/components/Toast/ToastProvider';
import Toolbar3D from './popups/toolbar3D';
import KeyMap from './popups/keyMap';
import DistanceMeasure from './popups/distanceMeasure';
import PublicData from './popups/publicData';

function SDMS(props) {
    const { onShowToast } = useToast();

    const menu = {
        none: null,
        statusInfo: SDMSResource.ID.menu.statusInfo,                // 센서현황
        statusSensorInfo: SDMSResource.ID.menu.statusSensorInfo,    // 센서 상세정보
        weatherInfo: SDMSResource.ID.menu.weatherInfo,              // 기상센서 상세정보
        event: SDMSResource.ID.menu.event,                          // 이벤트 현황
        publicData: SDMSResource.ID.menu.publicData,                // 공공데이터
        miniMap: SDMSResource.ID.menu.miniMap,                      // 미니맵
        atmosphereSimulation: SdmsResource.ID.menu.atmosphereSimulation,                // 대기 시뮬레이션
        eventDashboard: SDMSResource.ID.menu.eventDashboard,        // 이벤트 대시보드
    }

    const defaultVisibleSensorTypes = {
        [SDMSMainMenu.Atmosphere_Sensor]: true,
        [SDMSMainMenu.Weather_Sensor]: true,
        [SDMSMainMenu.Water_Sensor]: true,
        [SDMSMainMenu.WaterDisaster_Sensor]: true,
        [SDMSMainMenu.NaturalCCTV_Sensor]: true,
        [SDMSMainMenu.TrafficCCTV_Sensor]: true,
        [SDMSMainMenu.ZoneName_Sensor]: true,
    };

    const isProcessingRef = useRef(false);
    
    const [showPopups, setShowPopups] = useState({});
    const [tempShowPopups, setTempShowPopups] = useState({});
    const [popupLayer, setPopupLayer] = useState({
        statusInfoZIndex: 0,
        statusSensorInfoZIndex: 0,
        weatherInfoZIndex: 0,
        miniMapZIndex: 0,
        cctvInfoZIndex: 0,
        eventZIndex: 0,
        eventMemoZIndex: 0,
        loading: false,
    });
    const [popupStateValue, setPopupStateValue] = useState({});
    const [visibleSensorTypes, setVisibleSensorTypes] = useState(defaultVisibleSensorTypes);
    const [cctvList, setCctvList] = useState([]);
    const [selectedCCTV, setSelectedCCTV] = useState([]);
    const [cctvIds, setCctvIds] = useState('');
    const [showEventDashboard, setShowEventDashboard] = useState(false); // 이벤트 대시보드 팝업

    const [site3dOptions, setSite3dOptions] = useState({});
    const [currentSiteNo, setCurrentSiteNo] = useState(null);
    const [buildingGroupList, setBuildingGroupList] = useState([]);
    const [facilityInfos, setFacilityInfos] = useState(null);
    
    const [sensorSubTypes, setSensorSubTypes] = useState(null);
    const [sensorCategories, setSensorCategories] = useState(null);
    const [sensorTypes, setSensorTypes] = useState(null);
    const [sensorLinks, setSensorLinks] = useState(null);
    const [materialLinks, setMaterialLinks] = useState(null);
    const [sensorList, setSensorList] = useState([]);
    const [selectedSensor, setSelectedSensor] = useState({
        dataGroup: null,
        sensorGroup: null,
        sensor: null
    });
    const [selectedAlarm, setSelectedAlarm] = useState(null);

    const [sensorAlarms, setSensorAlarms] = useState([]);
    const [spreadAlarm, setSpreadAlarm] = useState(null);
    
    // MoveDisplay 판별용
    const [commonSettings, setCommonSettings] = useState(SettingsStore.getState().commonSettings);
    const [useAlarmSound, setUseAlarmSound] = useState(false);
    const [initCompleted, setInitCompleted] = useState(false);
    
    const [selectedSensorCategory, setSelectedSensorCategory] = useState(null);
    const [selectedSensorType, setSelectedSensorType] = useState(null);

    const [isSimulationMode, setIsSimulationMode] = useState(false);

    // 3d toolbar 관련
    const [showNavBar, setShowNavBar] = useState(false);
    const [autoRotation, setAutoRotation] = useState(false);
    const [showKeyMapPopup, setShowKeyMapPopup] = useState(false);
    const [distanceMeasurement, setDistanceMeasurement] = useState(false);
    
    const [tempPopupList, setTempPopupList] = useState(null);

    const [confirmMessage, setConfirmMessage] = useState({
        visible: false,
        type: null,
        messages: [""],
        buttons: ["확인"],
        onClickButton: null
    });
    
    const [loaderProps, setLoaderProps] = useState({
        visible: false,
        percentage: 0,
    })
    
    const sdmsRef = useRef(null);
    const closureRef = useRef({ sensorLinks, sensorList, sensorTypes, sensorCategories, sensorSubTypes, materialLinks });
    const previousCCTVRef = useRef(null);
    const selectedCCTVRef = useRef(selectedCCTV);
    const audioRef = useRef(null);

    const parseOptionBoolean = (value, defaultValue = true) => {
        if (value === null || value === undefined) {
            return defaultValue;
        }

        if (typeof value === "boolean") {
            return value;
        }

        const normalizedValue = String(value).trim().toLowerCase();
        if (normalizedValue === "true" || normalizedValue === "1") {
            return true;
        }

        if (normalizedValue === "false" || normalizedValue === "0") {
            return false;
        }

        return defaultValue;
    };

    const getUseAlarmSoundFromSettings = (settings) => {
        const settingValue = settings
            ?.find(c => c.categoryType === "SDMS")
            ?.settingDatas
            ?.find(o => o.name === "UseAlarmSound")
            ?.value;

        return parseOptionBoolean(settingValue, true);
    };

    const getUseAlarmSoundFromUserOptions = (options) => {
        const optionValue = options
            ?.find(option => option.category === "sdms" && option.subCategory === "alarmSound")
            ?.values?.[0];

        return optionValue === undefined ? null : parseOptionBoolean(optionValue, true);
    };

    const applyUseAlarmSound = (options, settings = SettingsStore.getState().commonSettings) => {
        const optionValue = getUseAlarmSoundFromUserOptions(options);

        if (optionValue !== null) {
            setUseAlarmSound(optionValue);
            return;
        }

        setUseAlarmSound(getUseAlarmSoundFromSettings(settings));
    };

    const loadUseAlarmSound = async () => {
        const userInfo = await ProjectResource.initUserInfo();
        if (!userInfo) {
            setUseAlarmSound(getUseAlarmSoundFromSettings(SettingsStore.getState().commonSettings));
            return;
        }

        const [options] = await AccountController.requestOptions(userInfo.user_sn, "sdms", "alarmSound");
        if (Array.isArray(options)) {
            SettingsStore.dispatch({ type: 'USER_OPTIONS', userOptions: options });
            applyUseAlarmSound(options);
            return;
        }

        setUseAlarmSound(getUseAlarmSoundFromSettings(SettingsStore.getState().commonSettings));
    };
    
    useEffect(() => {
        selectedCCTVRef.current = selectedCCTV;
    }, [selectedCCTV]);

    useEffect(() => {

        // 센서의 전체 리스트와 해당 센서 내부의 수치값 정보를 업데이트 한다.
        SDMSController.StartWatchSensorTimer();
        ExternalController.StartWatchExternalWeatherData();
        
        async function initializeData() {
            await init();
            await loadUseAlarmSound();
        }
        
        initializeData().then(() => {
                console.log('SDMS 초기화 완료');
            }
        ).catch((error) => {
            showError(error);
        });
        
        setMenuEvent();

        // SDMS 컴포넌트 마운트 시, 저장된 위치 값 호출
        getPopupState();

        const unsubscribe = store.subscribe(() => {
            const data = store.getState();

            if (data.actionType === 'SENSOR_LIST') {
                setSensorList(data.sensorList);
            }

            if (data.actionType === 'SENSOR_ALARM') {
                changeAlarm(data.sensorAlarm, data.spreadAlarm);
            }
        });
        
        // MoveDisplayAlarm, UseAlarmSound 판별용
        const unsubscribeSettings = SettingsStore.subscribe(() => {
            const data = SettingsStore.getState();
            if (data.actionType === 'COMMON_SETTINGS') {
                setCommonSettings(data.commonSettings);
                applyUseAlarmSound(data.userOptions, data.commonSettings);
            }
            else if (data.actionType === 'USER_OPTIONS') {
                applyUseAlarmSound(data.userOptions, data.commonSettings);
            }
            else if (data.actionType === 'RESET_POPUP') {
                resetPopupState(data.popupState);
            }
        });

        const handleFirstClick = () => {
            if (audioRef.current) {
                audioRef.current.muted = false;
                audioRef.current.play().catch((e) => {
                    console.warn("자동재생 실패:", e);
                });
            }
            document.removeEventListener("click", handleFirstClick);
        };

        document.addEventListener("click", handleFirstClick);
        
        return () => {
            unsubscribe();
            unsubscribeSettings();
            SDMSController.stopWatchAlarmTimer();
            SDMSController.stopWatchSensorTimer();
            document.removeEventListener("click", handleFirstClick);
        }
    }, []);

    // 센서 리스트와 관련된 데이터가 변경될 때마다 sdmsRef를 업데이트
    // 함수형 컴포넌트 특성상 함수 진입시의 상태를 유지하기 위해 useRef 사용
    useEffect(() => {
        sdmsRef.current = {
            state: {
                sensorList,
                sensorTypes,
                sensorLinks,
                selectedSensor,
                sensorSubTypes
            },
            functions: {
                setSelectedSensorInfo,
                setVisiblePopups,
                setSelectPOI,
                showConfirmDialog,
                closeCCTVPopup,
                processLoading
            }
        };
        
        closureRef.current = { sensorLinks, sensorList, sensorTypes, sensorCategories, sensorSubTypes };

        let wsMgr = socketStore.getState().wsMgr;
        if (wsMgr) {
            wsMgr.setSdms(sdmsRef.current);
            socketStore.dispatch({ type: 'WS_MANAGER', wsMgr: wsMgr });
        }
    }, [sensorList, sensorTypes, sensorLinks, selectedSensor, sensorSubTypes]);

    const handleToast = (message, status) => {
        onShowToast(message, status);
    };

    const showError = (error) => {
        // 새 Error 객체 생성 후 stack 추출
        const stackTrace = new Error().stack.split('\n');

        // 호출 위치(2번째 라인) 파싱
        const callerLocation = stackTrace[2]?.match(/\((.*):(\d+):(\d+)\)/);

        if (callerLocation) {
            const [_, filePath, line, col] = callerLocation;
            console.error(`[ERROR] (${filePath}:${line}:${col}):`, error);
        } else {
            console.log(`[ERROR] (Unknown Location):`, error);
        }
    };
    
    const processLoading = (header, content) => {
        if (header === 31) {
            setLoaderProps({
                visible: true,
                percentage: "00",
            });
        } else if (header === 32) {
            const strPercentage = content.value.toString().padStart(2, "0");
            setLoaderProps({
                visible: true,
                percentage: strPercentage,
            });
        } else if (header === 33) {
            setLoaderProps({
                visible: false,
                percentage: "100",
            });
        }
    }
    
    const initPopupState = () => {
        // 처음부터 뜰 메뉴
        let showPopupInfo = {};
        showPopupInfo[menu.statusInfo] = true;
        showPopupInfo[menu.statusSensorInfo] = false;
        showPopupInfo[menu.weatherInfo] = false;
        showPopupInfo[menu.event] = true;
        showPopupInfo[menu.miniMap] = true;
        showPopupInfo[menu.atmosphereSimulation] = false;
        showPopupInfo[menu.publicData] = false;
        setShowPopups(showPopupInfo);

        // 센서타입 초기화
        // let visibleSensorTypes = {};
        // visibleSensorTypes[SDMSMainMenu.Atmosphere_Sensor] = true;
        // visibleSensorTypes[SDMSMainMenu.Weather_Sensor] = true;
        // visibleSensorTypes[SDMSMainMenu.Water_Sensor] = true;
        // visibleSensorTypes[SDMSMainMenu.WaterDisaster_Sensor] = true;
        // visibleSensorTypes[SDMSMainMenu.NaturalCCTV_Sensor] = true;
        // visibleSensorTypes[SDMSMainMenu.TrafficCCTV_Sensor] = true;
        // visibleSensorTypes[SDMSMainMenu.ZoneName_Sensor] = true;
        // setVisibleSensorTypes(visibleSensorTypes);

        setVisibleSensorTypes(defaultVisibleSensorTypes);

    }
    
    const setMenuEvent = () => {
        const prevSdmsEvent = props.menuEvent;
        prevSdmsEvent.onClickLogo = moveInitialViewport;
        props.setSdmsEvent({
            ...prevSdmsEvent,
        });
    }
    
    const moveInitialViewport = () => {
        const target = SettingsStore.getState()?.commonSettings
            ?.flatMap(item =>
                (item?.categoryType === "SDMS")
                    ? [item.settingDatas.find?.(setting => setting.name === "InitialViewport")].filter(Boolean)
                    : []
            )[0];

        if (target?.value) {
            const wsMgr = socketStore.getState().wsMgr;
            if (wsMgr && wsMgr.connected) {
                const content = {
                    "cameraInfo": target.value
                }
                return wsMgr.sendMoveToInitialScreen(content);
            }
        }
    }

    const init = async () => {
        try {
            // API 호출 병렬 처리
            const [categories, types, links, subTypes, materialLinks, result] = await Promise.all([
                ExternalController.GetExternalSensorCategories(),
                ExternalController.GetExternalSensorTypes(),
                ExternalController.GetExternalSensorLinks(),
                ExternalController.requestSensorSubTypes(),
                ExternalController.requestExternalMaterialLinks(),
                SDMSController.requestSensorList()
            ]);

            // 데이터와 액션 타입을 맵핑하여 처리
            const dataMap = [
                { data: categories, type: 'SENSOR_CATEGORY', setter: setSensorCategories },
                { data: types, type: 'SENSOR_TYPES', setter: setSensorTypes },
                { data: links, type: 'SENSOR_LINKS', setter: setSensorLinks }
            ];

            // 각 데이터 처리
            dataMap.forEach(item => {
                if (item.data) {
                    store.dispatch({ type: item.type, [item.type.toLowerCase()]: item.data });
                    item.setter(item.data);
                }
            });

            // 센서 리스트 처리
            if (result?.[0]) {
                const sensorList = SDMSController.MakeSensorList(result[0], types, links);
                store.dispatch({ type: 'SENSOR_LIST', sensorList });
                setSensorList(sensorList);
            }

            if (subTypes) {
                const filteredAndSortedSubTypes = subTypes
                    .filter(item => item.descp !== null && item.descp !== "")
                    .sort((a, b) => a.sensor_sub_ty_no - b.sensor_sub_ty_no);

                store.dispatch({ type: 'SENSOR_SUB_TYPES', sensorSubTypes: filteredAndSortedSubTypes });
                setSensorSubTypes(filteredAndSortedSubTypes);
            }
            
            if (materialLinks) {
                store.dispatch({ type: 'EXTERNAL_MATERIAL_LINKS', materialLinks });
                setMaterialLinks(materialLinks);
            }

            return false;
        } catch (error) {
            showError(error);
            return false;
        }
    };

    useEffect(() => {
        const allDataLoaded = [sensorList, sensorLinks, sensorTypes, sensorCategories, sensorSubTypes]
            .every(array => array && array.length > 0);

        if (allDataLoaded) {
            setInitCompleted(true);
        }
    }, [sensorList, sensorLinks, sensorTypes, sensorCategories, sensorSubTypes]);
    
    useEffect(() => {
        if (initCompleted) {
            // 모든 데이터가 로드된 후에 실행할 코드
            SDMSController.StartWatchAlarmTimer();

            initPopupState();
            
            // webToApp responsePOIList (header:12)
            responsePOIList(sensorAlarms);
        }
    }, [initCompleted]);

    // 1초 폴링으로 sensorList가 갱신될 때, 열려있는 센서 상세정보(selectedSensor.sensor)도
    // 최신 zone으로 재유도하여 수치값(cur_data)을 실시간 갱신한다.
    // setSelectedSensorInfo는 sendSelectPOI 전송/팝업 토글 등 부작용이 있어 사용하지 않고
    // 상태만 직접 교체한다.
    useEffect(() => {
        setSelectedSensor(prev => {
            const current = prev?.sensor;
            if (!current?.sensorLink) return prev;

            const node_id = current.sensorLink.node_id;
            const sensor_type_idx = current.sensorLink.sensor_type_idx;

            const freshZone = sensorList
                ?.find(t => t.sensorType.sensor_type_idx === sensor_type_idx)
                ?.zones
                ?.find(z => z.sensorLink.node_id === node_id);

            if (!freshZone || freshZone === current) return prev;

            return { ...prev, sensor: freshZone };
        });
    }, [sensorList]);

    const changeAlarm = async (sensorAlarm, spreadAlarm) => {
        if (spreadAlarm) {
            setSpreadAlarm(spreadAlarm);
        }

        sensorAlarm.sort((a, b) => new Date(b.dtTime) - new Date(a.dtTime));

        setMaterialTypeToAlarms(sensorAlarm);
        
        setSensorAlarms(sensorAlarm);
        
        responsePOIList(sensorAlarm);

        const onAlarms = sensorAlarm?.filter(alarm => alarm.isAlarm) || [];

        if (onAlarms.length > 0) {
            if (!distanceMeasurement)
                handlePopups('eventDashboard', true);
        }
    };
    
    const closeCCTVPopup = () => {
        setSelectedCCTV([]);
    }
    
    const setMaterialTypeToAlarms = (alarms) => {
        if (!alarms || alarms.length === 0) return;

        const sensorTypeMap = new Map(closureRef.current.sensorTypes.map(type =>
            [type.sensor_type_idx, type]));

        alarms.forEach(alarm => {
            const targetSensorLink = closureRef.current.sensorLinks.find(sl => sl.zone_sn === alarm.zoneNo);
            if (!targetSensorLink) return;

            const targetSensorType = sensorTypeMap.get(targetSensorLink.sensor_type_idx);
            if (!targetSensorType) return;
            
            // externalSensorType idx와 해당 오염 종류 추가
            alarm.detectType = targetSensorType.sensor_type_idx;
            alarm.detectTypeString = SDMSResource.getDetectTypeString(targetSensorType.sensor_type_idx);
        });
    }

    const getMoveDisplayAlarm = async () => {
        const [settings, message] = await SettingController.requestSetting();
        if (!settings) return console.log(message);

        const sdmsSettings = settings.find(c => c.categoryType === "SDMS");
        return sdmsSettings?.settingDatas.find(optn => optn.name === "MoveDisplayAlarm")?.value || "2";
    };
    
    // 초기 한번, 알람 업데이트시 전송
    const responsePOIList = async (data) => {
        const poiList = await ExternalController.GetExternalPOIInfo();
        
        if (!poiList) return;
        
        // 이벤트가 있는 경우만 필터링
        const activeAlarms = data?.filter(alarm => alarm.isAlarm) || [];

        const elements = poiList.map(poi => {
            const node_id = poi.node_id;
            const targetAlarm = activeAlarms.find(alarm => alarm.zoneNo === node_id);
            const targets = activeAlarms.filter(alarm => alarm.zoneNo === node_id);
            
            let isReported = false;
            if (targets.find(alarm => alarm.reactionType === 400222)) {
                isReported = true;
            }

            return {
                "nodeID": node_id,
                "poiType": poi.sensor_type_idx,
                "poiName": getPOINameFromNodeID(node_id),
                "position": {
                    "x": poi.x,
                    "y": poi.y,
                    "z": poi.z
                },
                "cctvInfo": {
                    "url": getCCTVAddressFromNodeID(node_id),
                },
                "state": {
                    "isAlarm": !!targetAlarm,
                    "isConnected": getSensorStateFromSensorList(node_id),
                    "isReported": isReported
                }
            };
        });
        
        const wsMgr = socketStore.getState().wsMgr;
        
        if (wsMgr && wsMgr.connected) {
            wsMgr.sendResponsePOIList(elements);
        }
        
    }
    
    //#region webToApp responsePOIList에 필요한 항목 가공  
    const getSensorStateFromSensorList = (zone_sn) => {
        try {
            const { sensorList } = closureRef.current;
            
            if (!sensorList) {
                return null;
            }

            // 모든 센서 타입을 순회하면서 일치하는 zone 찾기
            const targetZone = sensorList.flatMap(sensorType => sensorType.zones)
                .find(zone => zone.sensorLink?.zone_sn === zone_sn);

            if (!targetZone) {
                return null;
            }

            // 활성화된 센서가 하나라도 있는지 확인
            return !!targetZone.sensors.find(s => s.sensor.enab === true);
        } catch (error) {
            showError(error);
            return null;
        }
    }

    const getPOINameFromNodeID = (node_id) => {
        try {
            const sensorLinks = closureRef.current.sensorLinks;

            if (!sensorLinks || sensorLinks.length === 0)
                return "";

            const target = sensorLinks.find((sl) => sl.node_id === node_id);
            
            if (target) {
                return target.sensor_name;
            } else {
                // name tag
                return SdmsResource.getNameTag(node_id);
            }
        } catch (error) {
            showError(error);
            return "";
        }
    }

    const getCCTVAddressFromNodeID = (node_id) => {
        try {
            const { sensorList, sensorLinks } = closureRef.current;
            
            if (!sensorList || !sensorLinks) return null;

            const targetLink = sensorLinks.find(sl => sl.node_id === node_id);

            if (!targetLink || !SdmsResource.isCCTVType(targetLink.sensor_type_idx)) return null;

            const targetSensorTypeList = sensorList.find(slt =>
                slt.sensorType.sensor_type_idx === targetLink.sensor_type_idx
            );

            if (!targetSensorTypeList) return null;

            const targetZone = targetSensorTypeList.zones.find(zone =>
                zone.sensorLink.node_id === node_id
            );

            return targetZone?.sensors[0]?.cctv?.url || null;
        } catch (error) {
            showError(error);
            return null;
        }
    }
    //#endregion
    
    const sendShowAlarm = (alarm) => {
        const refs = closureRef?.current;
        
        if (!refs || !alarm) return;
        
        const tgSensorType = refs.sensorList.flatMap((sensorType) => sensorType.zones)
                                            .find((zone) => zone.sensorLink.node_id === alarm.zoneNo);
        
        const wsMgr = socketStore.getState().wsMgr;
        if (wsMgr && wsMgr.connected) {
            const poi = {
                "nodeID": tgSensorType.sensorLink.node_id,
                "sensorType": tgSensorType.sensorLink.sensor_type_idx,
            };
            console.log("sendShowAlarm", poi);
            return wsMgr.sendShowAlarm([poi]);
        }
    }
    
    const setSelectedSensorFromSensorZoneNo = async (sensorZoneNo) => {
        let tgSensor = null;
        
        if (!closureRef.current.sensorList)
            return;
        
        if (!sensorZoneNo)
            return;
        
        try {
            tgSensor = closureRef.current.sensorList
                .flatMap(sensorType => sensorType.zones)
                .find(zone =>
                    zone.sensors.some(s =>
                        s.sensorZoneData?.sensorZone?.sensor_zone_sn === sensorZoneNo
                    )
                );
        } catch(error) {
            showError(error);
            return;
        }
        
        if (tgSensor?.sensorLink.zone_sn === selectedSensor?.sensor?.sensorLink.zone_sn) {
            return;
        }
        
        return setSelectedSensorInfo(0, tgSensor)
        
    }

    const showConfirmDialog = (type, messages, buttons, onClickButton) => {
        const confirmInfo = {};
        confirmInfo.visible = true;
		confirmInfo.type = type;
        confirmInfo.messages = messages;
		confirmInfo.buttons = buttons;
		confirmInfo.onClickButton = onClickButton;

        if (!messages) {
            confirmInfo.messages = [""];
        }
        else if (Array.isArray(messages)) {
            confirmInfo.messages = messages;
        }
        else {
            confirmInfo.messages = [messages];
        }

        setConfirmMessage(confirmInfo);
    }

    const onCloseConfirmDialog = () => {
		const confirmInfo = {};
		confirmInfo.visible = false;

        setConfirmMessage(confirmInfo);
	}

    const setVisiblePopups = (menu, visible) => {
        if (menu === SdmsResource.ID.menu.atmosphereSimulation) {
            if (visible === null || visible === undefined) {
                setIsSimulationMode(!isSimulationMode);
            } else 
                setIsSimulationMode(visible);
            
            const wsMgr = socketStore.getState().wsMgr;
            if (wsMgr && wsMgr.connected) {
                const content = {
                    "value": !isSimulationMode ? 1 : 0
                }
                
                wsMgr.sendDiffusionSimulationMode(content);
            }
        }

        setShowPopups(prevState => {
            const newMenus = { ...prevState };

            if (newMenus[menu] === true) {
                if (visible === false || visible === undefined) {
                    const wsMgr = socketStore.getState().wsMgr;
                    if (wsMgr && wsMgr.connected) {
                        wsMgr.sendClosePopup();
                    }
                }
            }
    
            if (visible === undefined) {
                if (Array.isArray(menu)) {
                    menu.forEach(menuItem => {
                        newMenus[menuItem] = !newMenus[menuItem];
                    });
                } else {
                    newMenus[menu] = !newMenus[menu];
                    
                }
            } else {
                if (Array.isArray(menu)) {
                    menu.forEach(menuItem => {
                        newMenus[menuItem] = visible;
                    });
                } else {
                    newMenus[menu] = visible;
                }
            }
            
            return newMenus;
        });
    };

    // 팝업 닫히는 애니메이션 효과
    const hideAnimatePopup = (menus, menus_old, callback) => {

        let hideIDs = "";

        if (menus !== null && menus !== undefined &&
            menus_old !== null && menus_old !== undefined) {
            let target = null;
            let cssLeft = null;
            let cssTop = null;

            for (let key in menus) {
                const visibleOld = menus_old[key];
                const visibleNew = menus[key];
                let hideID = null;

                if (visibleNew === false && (visibleOld === undefined || visibleOld !== visibleNew)) {
                    // 기존에 존재하지 않는 팝업 또는 상태 변화가 생긴 팝업
                    if (key === menu.event && sensorAlarms !== null && sensorAlarms?.length > 0) {
                        hideID = "#" + SDMSResource.popupLayer.event;
                        target = document.getElementById("dsBot_" + SDMSResource.popupLayer.event);
                    }
                    else if (key === menu.statusInfo) {
                        hideID = "#" + SDMSResource.popupLayer.statusInfo;
                        target = document.getElementById("dsBot_" + SDMSResource.popupLayer.statusInfo);
                    }
                }

                if (hideID !== null) {
                    if (hideIDs === "") {
                        hideIDs = hideID;
                    } else if (hideIDs !== "") {
                        hideIDs = hideIDs + ", " + hideID;
                    }

                    if (target !== null && target !== undefined) {
                        const clientRect = target.getBoundingClientRect();
                        cssLeft = clientRect.left;
                        cssTop = clientRect.top;
                    }

                    //break;
                }
            }

            if (hideIDs === "") {
                callback();
            } else if (hideIDs !== "") {
                // 창이 서서히 사라지는 효과
                if (cssLeft !== null && cssTop !== null) {
                    cssLeft = cssLeft + "px";
                    cssTop = cssTop + "px";

                    let hideValue = "80px";

                    $(hideIDs).animate({ opacity: 0, width: hideValue, height: hideValue, left: cssLeft, top: cssTop }, SDMSResource.PopupAniTime, () => {
                        $(hideIDs).css("opacity", "0");
                        callback();
                    });
                }
                else {
                    $(hideIDs).animate({ opacity: 0 }, SDMSResource.PopupAniTime, () => {
                        $(hideIDs).css("opacity", "0");
                        callback();
                    });
                }
            }
        }
        else {
            callback();
        }
    }

    // 드래그로 선택된 팝업과 나머지 팝업의 z-index를 조절한다. (선택된 팝업이 앞으로 나오도록)
    const setActiveDragPopup = (popupType) => {
        // CCTV 팝업창이 제대로 동작하지 않아 제이쿼리 방식으로 수정 - K.D.R
        for (const key in SDMSResource.popupLayer) {
            const layerName = SDMSResource.popupLayer[key];

            if (layerName === popupType) {
                $("#" + layerName).css({ "z-index": 2 });
            } else {
                $("#" + layerName).css({ "z-index": 0 });
            }

        }
    }

    const getPopupState = async () => {
        let userInfo = await ProjectResource.initUserInfo();
        if (userInfo === null || userInfo === undefined)
            return;

        const [options, message] = await AccountController.requestOptions(userInfo.user_sn, 'popup');

        if (!options) {
            showConfirmDialog(ProjectResource.dialogTypes.ERROR, [message], null, null);
            return;
        }
        
        if (options.length > 0) {
            let popupState = {}
            for (const option of options) {
                popupState[option.subCategory] = {
                    x: option.values[0],
                    y: option.values[1],
                    height: option.values[2],
                    width: option.values[3]
                };
            }

            setPopupStateValue(popupState);
        }
    }

    // 팝업 크기, 위치값 저장
    const setPopupState = async (popup, state) => {
        const newPopupState = {
            ...popupStateValue,
            [popup]: {
                x: state.x,
                y: state.y,
                height: state.height,
                width: state.width
            }
        };

        let userInfo = ProjectResource.getUserInfo();
        if (!userInfo)
            return;

        const options = [{ 
            category: 'popup', 
            subCategory: popup, 
            values: [state.x, state.y, state.height, state.width] 
        }];

        //DB 전달
        const [result, message] = await AccountController.requestSaveOptions(
            userInfo.user_sn,
            options
        );

        if (!result) {
            showConfirmDialog(ProjectResource.dialogTypes.ERROR, [message], null, null);
        }
        else {
            setPopupStateValue(newPopupState);
        }
    }

    const resetPopupState = (popupState) => {
        setPopupStateValue(popupState);
    }

    const setVisiblePoi = (typeName, visible) => {
        let types = { ...visibleSensorTypes };

        types[typeName] = visible;
        
        const wsMgr = socketStore.getState().wsMgr;
        if (wsMgr && wsMgr.connected) {
            const content = {
                "poiType": SDMSMainMenu.getSensorTypeSn(typeName),
                "value": visible === true ? 1 : 0
            }
            wsMgr.sendVisiblePOICategory(content);
        }
        
        setVisibleSensorTypes(types);
    }

    const handlePopups = (type, value) => {
        if(type === 'eventDashboard') {
            setShowEventDashboard(value);
        }
    }


    const setSelectPOI = useCallback((node_id, sensor_type_idx) => {
        
        if (node_id === -1 || sensor_type_idx === -1) {
            return setSelectedSensorInfo(3, selectedSensor.sensor ? selectedSensor.sensor : null, true);
        }
        
        const zone = sensorList
            ?.find(type => type.sensorType.sensor_type_idx === sensor_type_idx)
            ?.zones
            ?.find(zone => zone.sensorLink.node_id === node_id);

        if (zone) {
            setSelectedSensorInfo(0, zone, true);
        }

    }, [sensorList]);

    const setSelectedSensorInfo = (depth, value, socketAction = false, alarm) => {

        if (isProcessingRef.current) {
            return;
        }
        
        setSelectedSensor(prev => {
            // Closure reference
            isProcessingRef.current = true;
            
            const { sensorTypes, sensorCategories } = closureRef.current;

            try {

                if (depth === 1) {
                    return prev.dataGroup === value
                        ? { ...prev, dataGroup: null, sensorGroup: null }
                        : { ...prev, dataGroup: value };
                }

                if (depth === 2) {
                    return prev.sensorGroup === value
                        ? { ...prev, sensorGroup: null }
                        : { ...prev, sensorGroup: value };
                }
                
                if (value === null || value === undefined) {
                    return prev;
                }

                // sensor.enab이 전부 false면 센서 연결 불량 상태
                // -> 클릭해도 센서 상세정보 팝업이 열리지 않음
                let isDisable = false;
                if (!SdmsResource.isCCTVType(value?.sensorLink.sensor_type_idx) && value.sensors?.every(x => !x.sensor.enab)) {
                    isDisable = true;
                }
                
                if (depth === 3) {
                    if (!isDisable) {
                        if (value.sensorLink.sensor_type_idx === SDMSResource.externalSensorType.atmosphere ||
                            value.sensorLink.sensor_type_idx === SDMSResource.externalSensorType.water ||
                            value.sensorLink.sensor_type_idx === SDMSResource.externalSensorType.waterDisaster)
                        {
                            setVisiblePopups(menu.weatherInfo, false);
                            setVisiblePopups(menu.statusSensorInfo, true);
                        }
    
                        if (value.sensorLink.sensor_type_idx === SDMSResource.externalSensorType.weather) {
                            setVisiblePopups(menu.statusSensorInfo, false);
                            setVisiblePopups(menu.weatherInfo, true);
                        }
                        
                        if (SDMSResource.isCCTVType(value.sensorLink.sensor_type_idx)) {
                            // CCTV 선택일 경우 센서 팝업을 닫지 않는다.
                            setSelectedCCTVList(value.sensorLink, prev);
                        }
                        
                    } else {
                        setVisiblePopups(menu.statusSensorInfo, false);
                        setVisiblePopups(menu.weatherInfo, false);
                    }
                    
                    if (!socketAction) {
                        const wsMgr = socketStore.getState().wsMgr;
                        if (wsMgr && wsMgr.connected) {
                            const poi = {
                                "nodeID": value.sensorLink.node_id,
                                "sensorType": value.sensorLink.sensor_type_idx,
                            };
                            console.log("sendSelectPOI", poi);
                            wsMgr.sendSelectPOI([poi]);
                        }
                    }

                    // CCTV 타입이 아닐 경우에만 센서 상세정보 팝업을 닫는다.
                    if (!SDMSResource.isCCTVType(value.sensorLink.sensor_type_idx)) {
                        if (prev.sensor?.sensorLink.node_id === value?.sensorLink.node_id) {
                            setSelectedAlarmFromSelectedSensor(null, alarm)
                            return { ...prev, sensor: null };
                        } else {
                            setSelectedAlarmFromSelectedSensor(value, alarm)
                            return { ...prev, sensor: value };
                        }
                    }
                }

                if (depth === 0) {
                    if (!showPopups[menu.statusInfo]) {
                        setVisiblePopups(menu.statusInfo, true);
                    }

                    if (!isDisable) {

                        if (value.sensorLink.sensor_type_idx === SDMSResource.externalSensorType.atmosphere ||
                            value.sensorLink.sensor_type_idx === SDMSResource.externalSensorType.stinks ||
                            value.sensorLink.sensor_type_idx === SDMSResource.externalSensorType.aiStinks) {
                            setVisiblePopups(menu.weatherInfo, false);
                            setVisiblePopups(menu.statusSensorInfo, true);
                        } else if (value.sensorLink.sensor_type_idx === 5) {
                            setVisiblePopups(menu.statusSensorInfo, false);
                            setVisiblePopups(menu.weatherInfo, true);
                        } else if (SDMSResource.isCCTVType(value.sensorLink.sensor_type_idx)) {
                            setSelectedCCTVList(value.sensorLink, prev)
                        }

                        const sensorGroupValue = sensorTypes?.find((x) => x.sensor_type_idx === value.sensorLink.sensor_type_idx);
                        const dataGroupValue = sensorCategories?.find((x) => x.sensor_category_idx === sensorGroupValue.sensor_category_idx);
                        
                        if (prev.sensor && prev.sensor.sensorLink.node_id === value.sensorLink.node_id) {
                            
                            if (prev.sensorGroup !== sensorGroupValue.sensor_type_idx) {
                                return {
                                    sensor: prev.sensor,
                                    dataGroup: dataGroupValue.sensor_category_idx,
                                    sensorGroup: sensorGroupValue.sensor_type_idx,
                                }
                            }

                            if (value.sensorLink.sensor_type_idx === SDMSResource.externalSensorType.atmosphere) {
                                setVisiblePopups(menu.statusSensorInfo, false);
                            } else if (value.sensorLink.sensor_type_idx === SDMSResource.externalSensorType.weather) {
                                setVisiblePopups(menu.weatherInfo, false);
                            }

                            return {
                                ...prev,
                                sensor: null,
                            }
                        }

                        if (SdmsResource.isCCTVType(value.sensorLink.sensor_type_idx)) {
                            return {
                                dataGroup: dataGroupValue.sensor_category_idx,
                                sensorGroup: sensorGroupValue.sensor_type_idx,
                                sensor: prev.sensor
                            }
                        }

                        return {
                            dataGroup: dataGroupValue.sensor_category_idx,
                            sensorGroup: sensorGroupValue.sensor_type_idx,
                            sensor: value,
                        };
                    } else {
                        setVisiblePopups(menu.statusSensorInfo, false);
                        setVisiblePopups(menu.weatherInfo, false);
                    }
                }
                
                return prev;

            } catch(e) {
                showError(e);
                return prev;
            } finally {
                // 처리 완료
                isProcessingRef.current = false;
            }
        });

    };
    
    const setSelectedAlarmFromSelectedSensor = (sensor, alarm) => {
        if (!sensor) {
            return setSelectedAlarm(null);
        }
        
        if (sensorAlarms?.length > 0 && alarm) {
            setSelectedAlarm(sensorAlarms.find(al => al.sensorZoneHistoryNo === alarm.sensorZoneHistoryNo) || null);
        }
    }

    const selectAlarmPanel = (alarm) => {
        if (!alarm) {
            return;
        }
        
        if (selectedAlarm?.sensorZoneHistoryNo === alarm.sensorZoneHistoryNo) {
            setSelectedAlarm(null);
        } else {
            setSelectedAlarm(alarm);
        }
        
        // 선택된 알람이 현재 선택된 알람과 같으면 아무 동작도 하지 않음
        if ((selectedAlarm?.zoneNo === alarm.zoneNo) && selectedAlarm?.sensorZoneHistoryNo !== alarm.sensorZoneHistoryNo) {
            return;
        }

        const zoneNo = alarm.zoneNo;
        const targetSensorLink = sensorLinks.find(sl => sl.zone_sn === zoneNo);
        if (!targetSensorLink) return;

        const targetSensorList = sensorList.find(slt => slt.sensorType.sensor_type_idx === targetSensorLink.sensor_type_idx);
        if (!targetSensorList) return;

        const targetZone = targetSensorList.zones.find(zone => zone.sensorLink.zone_sn === zoneNo);
        if (targetZone) setSelectedSensorInfo(3, targetZone, true, alarm);
    };

    const setSelectedCCTVList = (sensorLink, prev) => {
        const node_id = sensorLink.node_id;
        const sl = sensorLink;
        // 선택된 CCTV가 없거나 리스트와의 타입이 다르면 초기화
        if (selectedCCTVRef.current.length === 0 || sensorLink.sensor_type_idx !== previousCCTVRef.current?.sensor_type_idx) {
            previousCCTVRef.current = sl;
            selectedCCTVRef.current = [node_id];
            setSelectedCCTV([node_id]);
            return;
        }

        // 선택된 CCTV와 리스트의 타입이 같을 때
        if (selectedCCTVRef.current.includes(node_id)) {
            if (prev.sensorGroup === sensorLink.sensor_type_idx) {
                setSelectedCCTV(selectedCCTVRef.current.filter(element => element !== node_id));
            }
        } else {
            const newList = selectedCCTVRef.current.length >= 4
                ? [node_id]
                : [...selectedCCTVRef.current, node_id];
            previousCCTVRef.current = sl;
            setSelectedCCTV(newList);
        }
    }
    
    const getSelectedSensorTypeFromCCTVNodeID = (node_id) => {
        const targetLink = sensorLinks.find(link => link.node_id === node_id);
        return targetLink?.sensor_type_idx;
    }

    const getAlarmSound = () => {
        if (!useAlarmSound || selectedAlarm?.isAlarm === false || sensorAlarms?.length === 0) {
            return <></>;
        }

        if (!selectedAlarm) {
            return <></>;
        }
        
        const alarmSoundSrc = {
            [SDMSResource.reactionType.알람신호]: "/sound/alarmSound_normal.mp3",
            [SDMSResource.reactionType.재난신고]: "/sound/alarmSound_reported.mp3",
        }
        
        const src = alarmSoundSrc[selectedAlarm?.reactionType];

        if (!src) {
            return <></>;
        }

        return (
            <audio
                ref={audioRef}
                src={src}
                autoPlay
                loop
            />
        );
    };

    const getPopupUI = () => {
        let popups = [];

        if (isSimulationMode) return popups;

        if (showPopups[menu.statusInfo]) {
            popups.push(
                <StatusInfo key='sdms_popup_statusInfo'
                    popupType={SDMSResource.popupLayer.statusInfo}
                    popupState={popupStateValue.statusInfo}
                    setVisiblePopups={setVisiblePopups}
                    setActiveDragPopup={setActiveDragPopup}
                    setPopupState={setPopupState}
                    visibleSensorTypes={visibleSensorTypes}
                    setVisiblePoi={setVisiblePoi}
                    sensorList={sensorList}
                    sensorCategories={sensorCategories}
                    sensorTypes={sensorTypes}
                    selectedSensor={selectedSensor}
                    setSelectedSensorInfo={setSelectedSensorInfo}
                    getSelectedSensorTypeFromCCTVNodeID={getSelectedSensorTypeFromCCTVNodeID}
                    selectedCCTV={selectedCCTV}
                    sensorAlarms={sensorAlarms}
                />
            );
        }

        if (showPopups[menu.statusSensorInfo]) {
            popups.push(
                <StatusSensorInfo key='sdms_popup_statusSensorInfo'
                    popupType={SDMSResource.popupLayer.statusSensorInfo}
                    popupState={popupStateValue.statusSensorInfo}
                    setVisiblePopups={setVisiblePopups}
                    setActiveDragPopup={setActiveDragPopup}
                    setPopupState={setPopupState}
                    visibleSensorTypes={visibleSensorTypes}
                    selectedSensor={selectedSensor.sensor}
                    sensorList={sensorList}
                    sensorSubTypes={sensorSubTypes}
                    setSelectedSensorInfo={setSelectedSensorInfo}
                    sensorLinks={sensorLinks}
                    materialLinks={materialLinks}
                />
            );
        }

        if (showPopups[menu.weatherInfo]) {
            popups.push(
                <WeatherInfo key='sdms_popup_weatherInfo'
                    popupType={SDMSResource.popupLayer.weatherInfo}
                    popupState={popupStateValue.weatherInfo}
                    setVisiblePopups={setVisiblePopups}
                    setActiveDragPopup={setActiveDragPopup}
                    setPopupState={setPopupState}
                    selectedSensor={selectedSensor.sensor} 
                    setSelectedSensorInfo={setSelectedSensorInfo}
                />
            );
        }

        if (showPopups[menu.event]) {
            popups.push(
                <Event key='sdms_popup_event'
                    popupType={SDMSResource.popupLayer.event}
                    popupState={popupStateValue.event}
                    setVisiblePopups={setVisiblePopups}
                    setActiveDragPopup={setActiveDragPopup}
                    setPopupState={setPopupState}
                    visibleSensorTypes={visibleSensorTypes}
                    setSensorAlarms={setSensorAlarms}
                    sensorAlarms={sensorAlarms}
                    sensorList={sensorList}
                    showConfirmDialog={showConfirmDialog}
                    onCloseConfirmDialog={onCloseConfirmDialog}
                    setSelectedAlarm={setSelectedAlarm}
                    sendShowAlarm={sendShowAlarm}
                    selectAlarmPanel={selectAlarmPanel}
                    selectedAlarm={selectedAlarm}
                    selectedSensor={selectedSensor}
                    handleToast={handleToast}
                />
            );
        }

        if (showPopups[menu.miniMap]) {
            popups.push(
                <MiniMap key='sdms_popup_miniMap' 
                    popupType={SDMSResource.popupLayer.miniMap} 
                    popupState={popupStateValue.miniMap} 
                    selectedSensor={selectedSensor} 
                    sensorAlarms={sensorAlarms}
                    sensorLinks={sensorLinks}
                    setVisiblePopups={setVisiblePopups} 
                    setActiveDragPopup={setActiveDragPopup} 
                    setPopupState={setPopupState}
                />
            );
        }

        if (showPopups[menu.publicData]) {
            popups.push(
                <PublicData key='sdms_popup_publicData'
                    popupType={SDMSResource.popupLayer.publicData}
                    popupState={popupStateValue.publicData}
                    setVisiblePopups={setVisiblePopups}
                    setActiveDragPopup={setActiveDragPopup}
                    setPopupState={setPopupState}
                />
            );
        }

        return popups;
    }
    
    const disappearPopups = (value, mode) => {
        if (value) {
            setTempShowPopups({...showPopups});
            setShowPopups(prevState => {
                for(const key in prevState) {
                    if (prevState[key] === true) {
                        prevState[key] = false;
                    }
                }
                return prevState;
            });
        } else {
            setShowPopups({...tempShowPopups});
            setTempShowPopups({});
        }
        
    }

    const handleNavBar = () => {
        setShowNavBar(!showNavBar);

        const btns = document.getElementById('navigationBtns');
        if(!showNavBar) {
            btns.classList.add('on');
            btns.classList.remove('off');
        }
        else {
            btns.classList.add('off');
            btns.classList.remove('on');
        }
    }
    
    const handleAutoRotation = (e) => {
        e.stopPropagation();
        setAutoRotation(!autoRotation);
        
        const wsMgr = socketStore.getState().wsMgr;
        if (wsMgr && wsMgr.connected) {
            const parameter = { "value": !autoRotation ? 1 : 0 };
            wsMgr.sendAutoRotation(parameter);
        }
    }

    const onClickToolBtn = async (type) => {
        
        const wsMgr = socketStore.getState().wsMgr;
        
        if (!wsMgr || !wsMgr.connected) return;
        
        switch (type) {
            case SdmsResource.toolbar3DMenu.initScene:
                const settings = SettingsStore.getState().commonSettings;
                const targetSetting = settings?.find(x => x.categoryType === "SDMS")?.settingDatas?.find(x => x.name === "InitialViewport");
                if (!targetSetting) break;
                wsMgr.sendMoveToInitialScreen({ "cameraInfo": targetSetting.value});
                break;
            case SdmsResource.toolbar3DMenu.zoomIn:
                wsMgr.sendZoom({"value": 1})
                break;
            case SdmsResource.toolbar3DMenu.zoomOut:
                wsMgr.sendZoom({"value": 0})
                break;
            case SdmsResource.toolbar3DMenu.setInitScene:
                wsMgr.sendRequestCameraLocation()
                break;
        }
    }
    
    const setChangeDistanceMeasure = () => {
        const wsMgr = socketStore.getState().wsMgr;
        if (!wsMgr || !wsMgr.connected) {
            showConfirmDialog(ProjectResource.dialogTypes.ERROR, "Socket 연결이 잘못되었습니다.", null, null)
        }
        if (!distanceMeasurement) {
            setTempShowPopups({...showPopups});
            setShowPopups(prevState => {
                for(const key in prevState) {
                    if (prevState[key] === true) {
                        prevState[key] = false;
                    }
                }
                return prevState;
            });
            wsMgr.sendAutoRotation({ "value": 0 });
            setAutoRotation(false);
            setShowKeyMapPopup(false);
            
        } else {
            setShowPopups({...tempShowPopups});
            setTempShowPopups({});
        }
        
        wsMgr.sendMeasurementMode({ "value": !distanceMeasurement === true ? 1 : 0 });
        setDistanceMeasurement(!distanceMeasurement);
        
    }

    return (
        // <SdmsStyled>
        <div>
            <Contents3D />
            {
                (!isSimulationMode && showEventDashboard && !distanceMeasurement) &&
                    <EventDashboard
                        commonSettings={commonSettings}
                        sensorAlarms={sensorAlarms}
                        handlePopups={handlePopups}
                        getMoveDisplayAlarm={getMoveDisplayAlarm}
                        distanceMeasurement={distanceMeasurement}
                        sendShowAlarm={sendShowAlarm}
                        setSelectedSensorFromSensorZoneNo={setSelectedSensorFromSensorZoneNo}
                        selectedSensor={selectedSensor}
                        setSelectedAlarm={setSelectedAlarm}
                        setVisiblePopups={setVisiblePopups}
                        spreadAlarm={spreadAlarm}
                        setSpreadAlarm={setSpreadAlarm}
                    />
            }
            {
                showPopups[menu.atmosphereSimulation] &&
                    <AtmosphereSimulation key='sdms_popup_atmosphereSimulation'
                        popupType={SDMSResource.popupLayer.atmosphereSimulation}
                        popupState={popupStateValue.atmosphereSimulation}
                        setVisiblePopups={setVisiblePopups}
                        setActiveDragPopup={setActiveDragPopup}
                        setPopupState={setPopupState}
                        showConfirmDialog={showConfirmDialog}
                        onCloseConfirmDialog={onCloseConfirmDialog}
                    />
            }
            {
                loaderProps?.visible && <Loader percentage={loaderProps.percentage}/>
            }
            {/* <NavigationBar 
                setVisiblePopups={setVisiblePopups}
                visiblePopups={showPopups}
                sensorAlarms={sensorAlarms}
                showConfirmDialog={showConfirmDialog}
                onCloseConfirmDialog={onCloseConfirmDialog}
                disappearPopups={disappearPopups}
                moveInitialViewport={moveInitialViewport}
                isSimulationMode={isSimulationMode}
            /> */}

            {
                !distanceMeasurement &&
                <QuickMenuBar
                    setVisiblePopups={setVisiblePopups}
                    visiblePopups={showPopups}
                    disappearPopups={disappearPopups}
                    visibleSensorTypes={visibleSensorTypes}
                    setVisiblePoi={setVisiblePoi}
                />
            }

            <Toolbar3D 
                showNavBar={showNavBar}
                handleNavBar={handleNavBar}
                autoRotation={autoRotation}
                handleAutoRotation={handleAutoRotation}
                onClickToolBtn={onClickToolBtn}
                setShowKeyMapPopup={setShowKeyMapPopup}
                setChangeDistanceMeasure={setChangeDistanceMeasure}
                distanceMeasurement={distanceMeasurement}
            />

            {distanceMeasurement &&
                <DistanceMeasure
                    distanceMeasurement={distanceMeasurement}
                    setChangeDistanceMeasure={setChangeDistanceMeasure}
                    showConfirmDialog={showConfirmDialog}
                    onCloseConfirmDialog={onCloseConfirmDialog}
                    handleToast={handleToast}
                />
            }

            {showKeyMapPopup &&
                <KeyMap
                    setShowKeyMapPopup={setShowKeyMapPopup}
                />
            }

            {getPopupUI()}

            <figure>
                {getAlarmSound()}
            </figure>
            {
                /* alert창 대신 사용 */
                confirmMessage.visible &&
                <ConfirmDialog 
                    type={confirmMessage.type}
                    messages={confirmMessage.messages} 
                    buttons={confirmMessage.buttons} 
                    onClickButton={confirmMessage.onClickButton}
                    onCloseConfirmDialog={onCloseConfirmDialog}
                />
            }
        {/*</SdmsStyled>*/}
        </div>
    );
}

export default withRouter(SDMS);
