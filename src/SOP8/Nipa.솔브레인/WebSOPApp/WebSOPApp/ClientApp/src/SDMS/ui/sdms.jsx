import React, { useEffect, useState, useRef, useCallback } from 'react';
import $ from 'jquery';
import { withRouter } from 'react-router-dom';
import ProjectResource from '../../Root/resource/id';
import ConfirmDialog from '../../Common/ui/confirmDialog';
import QuickMenuBar from './popups/quickMenuBar';

import { SDMSController } from '../services/sdmsController';
import Contents3D from './3D/contents3D';

import Loader from '../../Common/ui/loader';
import { SpatialManager } from '../services/spatialManager';
import { PoiManager } from './3D/poi/poiManager';
import { AccountController } from '../../Account/services/accountController';
import store from '../../Root/store';
import Dashboard from './popups/dashboard';
import Event from './popups/event';
import { useSensorList } from '../../Common/hooks/useSensorList';
import ManualReport from './popups/manualReport';
import { useToast } from '../../Common/components/Toast/ToastProvider';
import { WorkerManager } from './3D/poi/workers/workerManager';
import EventDashboard from './popups/eventDashboard';
import { SettingController } from '../../Settings/services/settingController';
import SettingsStore from '../../Settings/settingsStore';
import AccountResource from '../../Account/resource/id';
import EditToolbar from './editMode/editToolbar';
import EditStatusInfo from './editMode/editStatusInfo';
import EditAddPoi from './editMode/editAddPoi';
import EditCCTVMapping from './editMode/editCCTVMapping';
import { EditModeManager } from './3D/utility/editModeManager';
import Toolbar3D from './popups/toolbar3D';
import SdmsResource from '../resource/id';
import StatusInfo from './popups/statusInfo';
import DetailInfo from './popups/detailInfo';
import CCTVInfo from './popups/cctvInfo';
import AlarmCCTVInfo from './popups/alarmCCTVInfo';
import WorkerInfo from './popups/workerInfo';
import SimulationToolbar from './simulation/simulationToolbar';
import SimulationSetup from './simulation/simulationSetup';

import { FacilityManager } from "./3D/utility/facilityManager";
import { FacilityController } from '../services/facilityController';
import EquipmentToolbar from './equipment/equipmentToolbar';
import EquipmentInfo from './equipment/equipmentInfo';
import EquipmentAnalysis from './equipment/equipmentAnalysis';
import EquipmentDetailInfo from './equipment/equipmentDetailInfo';
import EquipmentChartInfo from './equipment/equipmentChartInfo';
import ElectricChartInfo from './equipment/electricChartInfo';
import compass from '../images/compass.png';
import SensorInfo from './popups/sensorInfo';
import { useCCTVList } from '../../Common/hooks/useCCTVList';
import { useFacilityList } from '../../Common/hooks/useFacilityList';
import SimulationLegend from './simulation/simulationLegend';
import LoadingScreen from '../../Common/ui/loadingScreen';
import EditPOIViewer from './editMode/editPOIViewer';
import EditCCTVInfo from './editMode/editCCTVInfo';
import { CctvMappingManager } from './3D/utility/cctvMapping/cctvMappingManager';
import { CctvSlaveManager } from './3D/utility/cctvMapping/cctvSlaveManager';
import { _3dMaster } from './3D/utility/_3dMaster';

function SDMS(props) {
    const { sensorTypes, updateSensorsByZone, fetchSensorList } = useSensorList();
    const { facilityList } = useFacilityList();
    const { cctvs, refetchCCTV } = useCCTVList();
    const { onShowToast } = useToast();

    const menu = {
        none: null,
        statusInfo: SdmsResource.ID.menu.statusInfo,                  // 현황정보
        dashboard: SdmsResource.ID.menu.dashboard,                    // 대시보드
        event: SdmsResource.ID.menu.event,                            // 이벤트 정보
        manualReport: SdmsResource.ID.menu.manualReport,              // 수동신고
        detailInfo: SdmsResource.ID.menu.detailInfo,                  // 공장동/공장/설비 정보
        sensorInfo: SdmsResource.ID.menu.sensorInfo,                  // 센서정보
        cctvInfo: SdmsResource.ID.menu.cctvInfo,                      // CCTV
        alarmCCTVInfo: SdmsResource.ID.menu.alarmCCTVInfo,            // 알람 CCTV
        workerInfo: SdmsResource.ID.menu.workerInfo,                  // 작업자 정보
        editMode_poi: SdmsResource.ID.menu.editMode_poi,              // 편집모드_POI
        editMode_fakeWall: SdmsResource.ID.menu.editMode_fakeWall,    // 편집모드_가벽
        editMode_areaName: SdmsResource.ID.menu.editMode_areaName,    // 편집모드_구역명편집
        editMode_addPoi: SdmsResource.ID.menu.editMode_addPoi,        // 편집모드_추가 POI 목록
        editMode_cctvMapping: SdmsResource.ID.menu.editMode_cctvMapping,    // 편집모드_CCTV 매핑
        editMode_cctvInfo: SdmsResource.ID.menu.editMode_cctvInfo,    // 편집모드_CCTV 영상정보
        equipmentAnalysis: SdmsResource.ID.menu.equipmentAnalysis,
        equipmentDetailInfo: SdmsResource.ID.menu.equipmentDetailInfo,
        equipmentChartDetailInfo: SdmsResource.ID.menu.equipmentChartDetailInfo,
        equipmentChartInfo: SdmsResource.ID.menu.equipmentChartInfo,
        electricChartInfo: SdmsResource.ID.menu.electricChartInfo,
    }

    // 편집모드 메뉴
    const EDIT_MODE_MENU = [
        SdmsResource.ID.menu.editMode_poi,
        SdmsResource.ID.menu.editMode_fakeWall,
        SdmsResource.ID.menu.editMode_areaName,
    ];

    const [showPopups, setShowPopups] = useState({});
    const [popupStateValue, setPopupStateValue] = useState({});
    const [visibleSensorTypes, setVisibleSensorTypes] = useState(PoiManager.getOriginVisibleSensorTypes());

    const [sensorAlarm, _setSensorAlarms] = useState({ alarms: store.getState().sensorAlarm, selectedAlarm: null });
    const sensorAlarmRef = useRef(sensorAlarm);

    useEffect(() => {
        sensorAlarmRef.current = sensorAlarm;
    }, [sensorAlarm]);

    const [spatialManager, setSpatialManager] = useState(new SpatialManager());
    const [models, setModels] = useState({ siteBuildingGroupList: null, currentSiteNo: null, currentBuildingGroupNo: null, currentBuildingNo: null, currentZoneNo: null, currentZoneName: null, backToOrigin: false, gltfOptions: {} });

    const [editMode, setEditMode] = useState({ isEditMode: false, selectedMenu: SdmsResource.ID.menu.editMode_poi, subMenu: SdmsResource.ID.poi_editSubMenu.none });
    const editModeRef = useRef(editMode);
    useEffect(() => {
        // editMode 변경될 때 ref도 갱신
        editModeRef.current = editMode;
    }, [editMode]);

    const [editModeAlarmCount, setEditModeAlarmCount] = useState(0);    // 편집모드일 때 이벤트가 몇번 울렸는지 (편집모드 나가면 초기화)
    useEffect(() => {
        if (!editMode.isEditMode) {
            setEditModeAlarmCount(0);
        }
    }, [editMode.isEditMode]);

    const [addPOIsensorList, setaddPOISensorList] = useState(null);
    const [editCCTVList, setEditCCTVList] = useState(null);      // 자식에 그대로 내려줄 CCTV 리스트
    const [sensorZoneCCTVs, setSensorZoneCCTVs] = useState([]);  // 저장할 업데이트 CCTV 리스트 (센서 POI)
    const [equipZoneCCTVs, setEquipZoneCCTVs] = useState([]);    // 저장할 업데이트 CCTV 리스트 (구역명)
    const [cctvMappingManager, setCctvMappingManager] = useState(new CctvMappingManager());

    const sensorCacheRef  = useRef({});
    const equipCacheRef  = useRef({});

    const [mbZoneNos, setMbZoneNos] = useState([]);

    const [showEditCCTVInfo, setShowEditCCTVInfo] = useState(false);

    const [controlMode, setControlMode] = useState(SdmsResource.controlMode.integrated);
    const controlModeRef = useRef(controlMode);
    useEffect(() => {
        controlModeRef.current = controlMode;
    }, [controlMode]);

    const [showEventDashboard, setShowEventDashboard] = useState(false);    // 이벤트 대시보드 팝업

    const [showNavBar, setShowNavBar] = useState(false);
    const [autoRotation, setAutoRotation] = useState(false);

    const [simulationPois, setSimulationPois] = useState(null);
    const [textPoiManager, setTextPoiManager] = useState(null);

    const [selectedStatusInfo, setSelectedStatusInfo] = useState({
        buildingGroupNo: null,
        buildingNo: null,
        zoneNo: null,
        showSensorTypes: false,
        sensorTypeCode: null,
        sensorNo: null,
        facilityNo: null
    });

    const [alarmCCTVList, setAlarmCCTVList] = useState({
        alarm: null,
        cctvs: []
    });
    const [selectedCCTVInfo, setSelectedCCTVInfo] = useState({
        zoneNo: null,
        sensorNo: null
    });

    const faModelRef = useRef([]);
    const selFcltyInfoRef = useRef({ fcltyNo: null, zoneNo: null, useFlow: true, presvNo: null });
    const [refreshFcltyInfo, setRefreshFcltyInfo] = useState(false);
    const fcltyInfosRef = useRef([]);

    const [selected3DInfo, setSelected3DInfo] = useState({
        buildingGroup: null,
        building: null,
        zone: null,
        facility: null
    });

    const [sensorDetailInfo, setSensorDetailInfo] = useState({
        sensor: null,
        datas: null
    });

    const [scannerInfo, setScannerInfo] = useState(null);

    const [confirmMessage, setConfirmMessage] = useState({
        visible: false,
        type: null,
        messages: [""],
        buttons: ["확인"],
        onClickButton: null,
        isManualAlarm: false,
        hideMalfunctionCheck: false,
    });

    const [changedEdit, setChangedEdit] = useState(false);

    const [selectedSimulationInfo, setSelectedSimulationInfo] = useState({
        buildingGroup: "",
        buildingGroupName: "",
        materialName: "",
        area: "",
        windDirection: null,
        windDirectionName: "",
        windSpeed: null,
    });
    const [cfdFrameSeconds, setCfdFrameSeconds] = useState([]);
    const [simulationLegendInfo, setSimulationLegendInfo] = useState(null);


    const [showCompass, setShowCompass] = useState(true);   // 나침반 show/hide
    const [compassAngle, setCompassAngle] = useState(0);    // 나침반 이미지 회전 각도 (도 단위, 0~360)

    const [temporarySensor, _setTemporarySensor] = useState({
        sensor: null, zoneNo: null, cctv: null
    });

    const setTemporarySensor = (sensor, cctv) => {
        if (sensor) {
            const zoneNo = models.currentZoneNo;
            _setTemporarySensor({ sensor, zoneNo, cctv });
        }
        else {
            _setTemporarySensor({ sensor: null, zoneNo: null, cctv: null });
        }
    }

    const editModeManagerRef = useRef(null);
    const _3dMasterRef = useRef(null);

    const set3dMaster = (__3dMaster) => {
        _3dMasterRef.current = __3dMaster;
    }

    const onChangedEdit = (isChanged) => {
        if (changedEdit !== isChanged) {
            setChangedEdit(isChanged);
        }
    }

    const _setEditCCTVList = (data, sensorNo, isOrigin = false) => {
        if (!data) {
            setEditCCTVList(null);
        }
        else {
            if (data.type === CctvSlaveManager.SensorZoneType) {
                cctvMappingManager.setSensorZoneCctvs(sensorNo, data.zoneNo, data.cctvList, isOrigin);
            }
            else if (data.type === CctvSlaveManager.EquipZoneType) {
                cctvMappingManager.setEquipZoneCctvs(sensorNo, data.zoneNo, data.cctvList, isOrigin);
            }

            setEditCCTVList(data);
        }
    }

    const getCctvList = async (type, apiMap, value, zoneNo) => {
        const apiFunc = apiMap[type];
        if (!apiFunc) {
            return [null, null];
        }

        if (type === CctvSlaveManager.EquipZoneType) {
            return await apiFunc(zoneNo);
        }

        const [result, equipZoneNo, sensorZoneNo, message] = await apiFunc(value);
        return [result, message];
    }
    
    // 편집모드 > 구역명 > CCTV 매핑
    // 구역명이나 센서 POI 클릭 시 매핑된 CCTV LIST 받아오는 함수
    const handleEditCCTVList = useCallback(
        async (type, zoneNo, sensorNo) => {
            const key = String(zoneNo);

            // 캐시 먼저 확인
            const info = cctvMappingManager.getSensorBasicInfo(sensorNo);

            if (info) {
                const cctvs = cctvMappingManager.getMappingCctvs(sensorNo);

                if (info.equipZoneNo === 0 || info.equipZoneNo) {
                    _setEditCCTVList({ type: CctvSlaveManager.EquipZoneType, zoneNo, cctvList: cctvs }, sensorNo);
                    return;
                }
                else if (info.sensorZoneNo === 0 || info.sensorZoneNo) {
                    _setEditCCTVList({ type: CctvSlaveManager.SensorZoneType, zoneNo, cctvList: cctvs }, sensorNo);
                    return;
                }
            }
            /*if (type === 'sensor') {
                const cachedList = sensorCacheRef.current[key];
                if (cachedList) {
                    _setEditCCTVList({ type, zoneNo, cctvList: cachedList }, sensorNo);
                    return;
                }
            } else if (type === 'nameTag') {
                const cachedList = equipCacheRef.current[key];
                if (cachedList) {
                    _setEditCCTVList({ type, zoneNo, cctvList: cachedList }, sensorNo);
                    return;
                }
            }*/

            // 2캐시에 없으면 → API 호출
            const apiMap = {
                nameTag: SDMSController.requestEquipZoneCCTVList,
                sensor: SDMSController.requestCCTVListFromSensor,
            };

            const [result, message] = await getCctvList(type, apiMap, sensorNo, zoneNo);

            if (result === null && message === null) {
                return;
            }

            /*const apiFunc = apiMap[type];
            if (!apiFunc) return;

            const [result, message] = await apiFunc(value);*/

            if (result) {
                _setEditCCTVList({ type, zoneNo, cctvList: result }, sensorNo, true);
                
            } else {
                handleToast(message);
                _setEditCCTVList(null, sensorNo);
            }
        },
        []
    );

    const onCloseEditMode = () => {
        // 편집모드에서 관제로 나올 때 내부 변경 내역 초기화
        editModeManagerRef.current.resetChanges?.();
        handleControlMode(SdmsResource.controlMode.editMode, [false, SdmsResource.ID.menu.editMode_poi, SdmsResource.ID.poi_editSubMenu.none]);
        editModeManagerRef.current.onClose();
    }

    const onClickSaveEditMode = async (isClose) => {
        // 편집모드에서 변경된 내용 저장
        const userInfo = ProjectResource.getUserInfo();

        if (userInfo) {
            const [success, message] = await editModeManagerRef.current.save(userInfo.user_sn);
            handleToast(success ? "저장되었습니다" : message);

            if (success) {
                setChangedEdit(false);
                fetchSensorList();  // 저장 성공 시 센서리스트 새로 받아 오기
            }

            if (isClose) {
                handleControlMode(SdmsResource.controlMode.editMode, [false, SdmsResource.ID.menu.editMode_poi, SdmsResource.ID.poi_editSubMenu.none]);
                editModeManagerRef.current.onClose();
            }
        }
    }

    if (!editModeManagerRef.current) {
        editModeManagerRef.current = new EditModeManager();
        editModeManagerRef.current.onChange = onChangedEdit;
        editModeManagerRef.current.handleEditCCTVList = handleEditCCTVList;
        editModeManagerRef.current.sensorZoneCCTVs = sensorCacheRef.current;
        editModeManagerRef.current.equipZoneCCTVs = equipCacheRef.current;
    }

    // (편집모드 CCTV 매핑) 자식에서 CCTV 리스트가 변경될 때마다 호출되는 콜백
    const handleChangeCCTVList = (type, zoneNo, nextList) => {
        setEditCCTVList(prev => ({
            ...prev,
            type,
            zoneNo,
            cctvList: nextList,
        }));

        if (type === "sensor") {
            setSensorZoneCCTVs(prev => {
                // prev = [{ 12486: [...] }, { 12487: [...] }]

                const existIndex = prev.findIndex(item => Object.keys(item)[0] === String(zoneNo));

                // 이미 같은 zoneNo가 존재하면 → 덮어쓰기
                if (existIndex !== -1) {
                    const updated = [...prev];
                    updated[existIndex] = { [zoneNo]: nextList };
                    return updated;
                }

                // 새로운 zoneNo이면 → push
                return [...prev, { [zoneNo]: nextList }];
            });

            if (Array.isArray(nextList)) {
                sensorCacheRef.current[String(zoneNo)] = nextList;
            } 
        }
        else if (type === 'nameTag') {
            setEquipZoneCCTVs(prev => {
                const existIndex = prev.findIndex(item => Object.keys(item)[0] === String(zoneNo));

                // 이미 같은 zoneNo가 존재하면 → 덮어쓰기
                if (existIndex !== -1) {
                    const updated = [...prev];
                    updated[existIndex] = { [zoneNo]: nextList };
                    return updated;
                }

                // 새로운 zoneNo이면 → push
                return [...prev, { [zoneNo]: nextList }];
            });

            if (Array.isArray(nextList)) {
                equipCacheRef.current[String(zoneNo)] = nextList;
            }
        }
    };

    // 환경설정 (SDMS) 설정값
    const pickSetting = (commonSettings, name, fallback) => {
        const sdms = commonSettings?.find(c => c.categoryType === "SDMS");
        const v = sdms?.settingDatas?.find(o => o.name === name)?.value;
        return v ?? fallback; // 0도 그대로 살림
    };

    const initialCommon = SettingsStore.getState().commonSettings ?? [];
    const [commonSettings, setCommonSettings] = useState(initialCommon);

    const [useAlarmSound, setUseAlarmSound] = useState(
        pickSetting(initialCommon, "UseAlarmSound", true)
    );
    const [moveDisplayAlarm, setMoveDisplayAlarm] = useState(
        pickSetting(initialCommon, "MoveDisplayAlarm", SdmsResource.alarmOption.moveToLastAlarm.toString())
    );
    const [moveFacilityDisplayAlarm, setMoveFacilityDisplayAlarm] = useState(
        pickSetting(initialCommon, "MoveFacilityDisplayAlarm", SdmsResource.alarmOption.moveToLastAlarm.toString())
    );
    const [cameraIdleTime, setCameraIdleTime] = useState(
        pickSetting(initialCommon, "CameraIdleTime", { use: true, second: 600 })
    );

    const [popupLocationPosition, setPopupLocationPosition] = useState(true);
    const didMount = useRef(false);

    useEffect(() => {
        if (!initialCommon) return;

        const next = pickSetting(initialCommon, "PopupLocationPosition", true);
        setPopupLocationPosition(next);
    }, [initialCommon]);

    useEffect(() => {
        if (!didMount.current) {
            didMount.current = true;
            return; // 첫 로그 무시
        }

        // 환경설정 > 정보창 위치/사이즈 설정 값이 사용자 설정일 경우에만 저장된 논모달 사이즈, 위치값 호출
        if (popupLocationPosition === "false") {
            getPopupState();
        }
    }, [popupLocationPosition]);

    const [progressValue, setProgressValue] = useState(0);

    const moveDisplayAlarmRef = useRef(moveDisplayAlarm);
    useEffect(() => {
        moveDisplayAlarmRef.current = moveDisplayAlarm;
    }, [moveDisplayAlarm]);

    const moveFacilityDisplayAlarmRef = useRef(moveFacilityDisplayAlarm);
    useEffect(() => {
        moveFacilityDisplayAlarmRef.current = moveFacilityDisplayAlarm;
    }, [moveFacilityDisplayAlarm]);

    useEffect(() => {
        SDMSController.StartWatchAlarmTimer();

        // 처음 로딩시 이동형 스캐너 정보를 읽어온다.
        SDMSController.WatchScannerInfo();

        props.menuEvent.onClickLogo = onClickLogo;
        
        // 처음부터 뜰 메뉴
        let showPopupInfo = {};
        showPopupInfo[menu.statusInfo] = true;
        showPopupInfo[menu.dashboard] = true;
        showPopupInfo[menu.event] = false;
        showPopupInfo[menu.manualReport] = false;
        showPopupInfo[menu.detailInfo] = false;
        showPopupInfo[menu.sensorInfo] = false;
        showPopupInfo[menu.cctvInfo] = false;
        showPopupInfo[menu.alarmCCTVInfo] = false;
        showPopupInfo[menu.workerInfo] = false;
        showPopupInfo[menu.editMode_poi] = true;
        showPopupInfo[menu.editMode_fakeWall] = false;
        showPopupInfo[menu.editMode_areaName] = false;
        showPopupInfo[menu.equipmentAnalysis] = false;
        showPopupInfo[menu.equipmentDetailInfo] = false;
        showPopupInfo[menu.equipmentChartDetailInfo] = false;
        showPopupInfo[menu.equipmentChartInfo] = false;
        showPopupInfo[menu.electricChartInfo] = false;
        setShowPopups(showPopupInfo);

        request3DOptions();
        requestSimulationPois();

        initFcltyInfos();

        const unsubscribe = store.subscribe(() => {
            const data = store.getState();

            if (data.actionType === 'SENSOR_ALARM') {
                changeAlarm(data.sensorAlarm);
            }
            else if (data.actionType === "WORKERS") {
                WorkerManager.setWorkers(data.workers);
            }
            else if (data.actionType === "SCANNER_INFO") {
                setScannerInfo(data.scannerInfo);
            }
        });

        const persistedAlarms = store.getState().sensorAlarm;
        if (Array.isArray(persistedAlarms) && persistedAlarms.length > 0) {
            changeAlarm([...persistedAlarms]);
        }

        const getBoolean = (value) => {
            if (value === null || value.length === 0) {
                return null;
            } else if (typeof value === "boolean") {
                return value;
            }

            const str = value.toLowerCase();

            if (str === "true" || str === "1") {
                return true;
            }
            else if (str === "false" || str === "0") {
                return false;
            }

            return null;
        }

        const getInt = (value) => {
            if (value === null || value.length === 0) {
                return null;
            }

            const num = parseInt(value);

            if (isNaN(num)) {
                return null;
            }

            return num;
        }

        // 알람옵션을 처음 읽어오기전에 수신된 알람이 있으면 처리한다.
        const checkTempAlarms = () => {
            if (Contents3D.tempAlarms.length > 0) {
                changeAlarm(Contents3D.tempAlarms);
            }
        }

        // MoveDisplayAlarm, UseAlarmSound 판별용
        const unsubscribeSettings = SettingsStore.subscribe(() => {
            const data = SettingsStore.getState();
            if (data.actionType === 'COMMON_SETTINGS') {
                setCommonSettings(data.commonSettings);

                const nextUseAlarmSound = pickSetting(data.commonSettings, "UseAlarmSound", true);
                const nextMoveDisplayAlarm = pickSetting(data.commonSettings, "MoveDisplayAlarm", SdmsResource.alarmOption.moveToLastAlarm.toString());
                const nextMoveFacilityDisplayAlarm = pickSetting(data.commonSettings, "MoveFacilityDisplayAlarm", SdmsResource.alarmOption.moveToLastAlarm.toString());
                // 자동회전 대기시간(초)
                const nextCameraIdleTime = pickSetting(data.commonSettings, "CameraIdleTime", 600);
                const nextUseCameraIdleTime = pickSetting(data.commonSettings, "UseCameraIdleTime", true);
                const nextPopupLocationPosition = pickSetting(data.commonSettings, "PopupLocationPosition", true);

                setUseAlarmSound(nextUseAlarmSound);
                setMoveDisplayAlarm(nextMoveDisplayAlarm);
                setMoveFacilityDisplayAlarm(nextMoveFacilityDisplayAlarm);
                setCameraIdleTime({ use: getBoolean(nextUseCameraIdleTime), second: getInt(nextCameraIdleTime) });
                setPopupLocationPosition(nextPopupLocationPosition);

                // 알람옵션을 처음 읽어오기전에 수신된 알람이 있으면 처리한다.
                if (!Contents3D.initAlarmOptions) {
                    Contents3D.initAlarmOptions = true;
                    setTimeout(() => checkTempAlarms(), 500);
                }
            }
        });

        return () => {
            unsubscribe();
            unsubscribeSettings();
            SDMSController.stopWatchAlarmTimer();
        }
    }, []);

    // 선택된 센서, 설비에 따라 팝업 show/hide
    useEffect(() => {
        const { sensorNo, sensorTypeCode, facilityNo } = selectedStatusInfo;
        
        const isCCTV = sensorTypeCode === SdmsResource.facilityType.CCTV;
        const isPredictAlarm = sensorTypeCode === SdmsResource.facilityType.EQUIPMENT_PredictAlarm;
        const isPeakPower = sensorTypeCode === SdmsResource.facilityType.EQUIPMENT_PeakPower;

        // 센서 정보가 없거나 설비 정보가 있는 경우 -> 센서정보 닫기
        if (!sensorNo || !sensorTypeCode || facilityNo) {
            setVisiblePopups(menu.sensorInfo, false);
            setSensorDetailInfo({
                sensor: null,
                datas: null
            });
        }

        // 센서가 선택된 경우 -> 설비정보 닫기
        if (isCCTV && sensorNo) {
            setVisiblePopups(menu.cctvInfo, true);
            setVisiblePopups(menu.sensorInfo, false);

            setSelectedCCTVInfo({
                zoneNo: models.currentZoneNo,
                sensorNo: sensorNo,
                facilityNo: null
            });
        }
        else if (sensorNo) {
            setVisiblePopups(menu.detailInfo, false);
            setVisiblePopups(menu.cctvInfo, false);
        }
        else {
            setVisiblePopups(menu.cctvInfo, false);
            setVisiblePopups(menu.sensorInfo, false);
        }

        // 설비나 CCTV가 아닌 일반 센서가 선택된 경우 -> 센서정보 열기
        if (sensorNo && !isCCTV && !isPredictAlarm && !isPeakPower) {
            setVisiblePopups(menu.sensorInfo, true);

            // 설비차트 팝업이 열려 있으면 닫기
            if (showPopups[menu.equipmentAnalysis]) {
                setVisiblePopups(menu.equipmentAnalysis, false);
            }
        } else {
            setVisiblePopups(menu.sensorInfo, false);
            
            setSensorDetailInfo({
                sensor: null,
                datas: null
            });
        }

        // AI 설비 예지보전 센서인 경우 설비차트 팝업 열기
        if (isPredictAlarm) {
            const fcltyInfos = fcltyInfosRef.current;
            const fcltyInfo = fcltyInfos?.find(x => x.sensor_sn === sensorNo);

            if (fcltyInfo) {
                const Code_Pre = 300701;
                const Code_Post = 300702;

                if (controlMode === SdmsResource.controlMode.equipment) {

                    // 바운딩 박스 선택
                    if (fcltyInfo.fclty_presv_model_name?.length > 0) {
                        _3dMasterRef?.current?.facilityManager?.selectFcltBoundingBox(fcltyInfo.fclty_presv_model_name);
                    }

                    // 선택된 POI 그리고 현재 층이 다르다면 이동
                    if (selFcltyInfoRef.current.zoneNo !== null && fcltyInfo?.zone_sn && selFcltyInfoRef.current.zoneNo !== fcltyInfo.zone_sn) {
                        selFcltyInfoRef.current.zoneNo = fcltyInfo.zone_sn;
                    }

                    // 리스트 선택
                    selFcltyInfoRef.current.presvNo = fcltyInfo.fclty_presv_sn;

                    if (fcltyInfo.fclty_ty_code === Code_Pre) {
                        // 설비 정보 리스트 닫기
                        if (showPopups[menu.equipmentDetailInfo] == true)
                            showPopups[menu.equipmentDetailInfo] = false;
                        // 설비 이상치 팝업 띄우기
                        setVisiblePopups(menu.equipmentChartInfo, true);
                    }
                    else {
                        // 설비 정보 리스트 띄우기
                        setVisiblePopups(menu.equipmentDetailInfo, true);
                    }
                }
                else {
                    if (fcltyInfo.fclty_ty_code === Code_Pre) {
                        // 설비 정보 리스트 닫기
                        if (showPopups[menu.equipmentDetailInfo] == true)
                            showPopups[menu.equipmentDetailInfo] = false;
                        // 설비 이상치 팝업 띄우기
                        setVisiblePopups(menu.equipmentAnalysis, true);
                    }
                    else if (fcltyInfo.fclty_ty_code === Code_Post) {
                        // 설비 이상치 팝업 닫기
                        if (showPopups[menu.equipmentAnalysis] == true)
                            showPopups[menu.equipmentAnalysis] = false;
                        // 설비 정보 리스트 띄우기         
                        selFcltyInfoRef.current.presvNo = fcltyInfo.fclty_presv_sn;
                        setVisiblePopups(menu.equipmentDetailInfo, true);
                    }
                }
            }

        } else if (isPeakPower) {
            const fcltyInfos = fcltyInfosRef.current;
            const fcltyInfo = fcltyInfos?.find(x => x.sensor_sn === sensorNo);

            // 설비 모드 경우 구분 
            if (controlMode === SdmsResource.controlMode.equipment) {

                // 선택된 POI 그리고 현재 층이 다르다면 이동
                if (fcltyInfo?.zone_sn && selFcltyInfoRef.current.zoneNo !== fcltyInfo.zone_sn) {
                    selFcltyInfoRef.current.zoneNo = fcltyInfo.zone_sn;
                }

                // 리스트 선택
                selFcltyInfoRef.current.presvNo = fcltyInfo.fclty_presv_sn;

                // 설비 정보 리스트 닫기
                if (showPopups[menu.equipmentDetailInfo] == true)
                    showPopups[menu.equipmentDetailInfo] = false;
                // 설비 이상치 상세 팝업 띄우기
                setVisiblePopups(menu.electricChartInfo, true);
            }
            else {
                // 설비 정보 리스트 닫기
                if (showPopups[menu.equipmentDetailInfo] == true)
                    showPopups[menu.equipmentDetailInfo] = false;
                // 설비 이상치 팝업 띄우기
                setVisiblePopups(menu.equipmentAnalysis, true);
            }
        } else if (controlMode !== SdmsResource.controlMode.equipment) {
            // 설비 이상치 팝업 닫기
            if (showPopups[menu.equipmentAnalysis] == true)
                showPopups[menu.equipmentAnalysis] = false;
            // 설비 정보 리스트 닫기
            if (showPopups[menu.equipmentDetailInfo] == true)
                showPopups[menu.equipmentDetailInfo] = false;
        } else if (controlMode === SdmsResource.controlMode.equipment && sensorNo === null) {
            // 리스트 선택
            selFcltyInfoRef.current.presvNo = null;
        }


    }, [selectedStatusInfo.sensorNo, selectedStatusInfo.facilityNo]);

    useEffect(() => {
        if (!models.siteBuildingGroupList) return;
        
        if (sensorTypes?.length > 0) {
            initMobileScannerZones();
        }
    }, [sensorTypes, models.siteBuildingGroupList]);
    
    const initMobileScannerZones = () => {
        // 이동식 스캐너 zoneNo 가져오기
        const mbSensors = sensorTypes.find(
            (sensor) => sensor.sensorTypeCode === SdmsResource.facilityType.MOBILE_SCANNER
        );

        let mbZoneNos = [];
        if (mbSensors) {
            for (const sensor of mbSensors.sensors) {
                const zoneNo = sensor.sensor.zone_sn;

                if (zoneNo && !mbZoneNos.includes(zoneNo)) {
                    mbZoneNos.push(zoneNo);
                }
            }
        }

        setMbZoneNos(mbZoneNos);
    };

    useEffect(() => {
        if (!models.siteBuildingGroupList) return;

        if (mbZoneNos.length > 0 && models.currentZoneNo === null) {
            // 이동식 스캐너 센서가 외부영역에 존재하는지 검사
            for (const mbZoneNo of mbZoneNos) {
                const isOutdoorZoneNo = spatialManager.isOutdoorZoneNo(mbZoneNo);

                if (isOutdoorZoneNo) {
                    SDMSController.StartScannerTimer();
                }
            }
        }
        else if (mbZoneNos.length > 0 && mbZoneNos.includes(models.currentZoneNo)) {
            // 이동식 스캐너 센서가 존재하는 zone이면 이동식 스캐너 api 호출 timer 시작
            SDMSController.StartScannerTimer();
        }
        else {
            SDMSController.stopScannerTimer();
        }
    }, [models.currentZoneNo, models.siteBuildingGroupList, mbZoneNos]);

    const handleToast = (message, status) => {
        onShowToast(message, status);
    };

    useEffect(() => {
        const mgr = editModeManagerRef.current;
        if (!mgr) return;

        mgr.setMessageHandler?.(handleToast);

        return () => {
            mgr.setMessageHandler?.(null);
        };
    }, [handleToast]);

    useEffect(() => {
        // zone을 이동할때마다 sensorList를 새로 받아온다.
        fetchSensorList();
    }, [models.currentZoneNo]);

    const getZoneSensorList = async (sensorTypeCode, zoneNo) => {
        const [sensorTypes, _, message] = await SDMSController.requestZoneSensorList([sensorTypeCode], zoneNo);

        if (sensorTypes === null) {
            handleToast(message);
            return;
        }

        updateSensorsByZone(zoneNo, sensorTypes);
    }

    useEffect(() => {
        if (!selectedStatusInfo.sensorTypeCode) return;

        // sensorType 트리가 열리면 해당 zone, sensorType에 해당하는 sensor를 새로 받아온다.
        getZoneSensorList(selectedStatusInfo.sensorTypeCode, selectedStatusInfo.zoneNo);
    }, [selectedStatusInfo.sensorTypeCode]);

    const showConfirmDialog = (type, messages, buttons, onClickButton, isManualAlarm, hideMalfunctionCheck) => {
        const confirmInfo = {};
        confirmInfo.visible = true;
		confirmInfo.type = type;
        confirmInfo.messages = messages;
		confirmInfo.buttons = buttons;
		confirmInfo.onClickButton = onClickButton;
		confirmInfo.isManualAlarm = isManualAlarm;
		confirmInfo.hideMalfunctionCheck = hideMalfunctionCheck;

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

    const setSensorAlarms = (alarms, selectedAlarm) => {
        if (selectedAlarm) {
            selectedAlarm.movedAlarm = false;

            const sensor = spatialManager.getSensor(selectedAlarm.sensorNo);
            onSelectSensor(sensor);

            getAlarmCCTVList(selectedAlarm);

            setSelectedStatusInfo(prev => {
                const keepAll = prev.buildingGroupNo === '__all__';
                return {
                    buildingGroupNo: keepAll ? '__all__' : String(selectedAlarm.buildingGroupNo),
                    buildingNo: selectedAlarm.buildingNo,
                    zoneNo: selectedAlarm.zoneNo,
                    sensorTypeCode: selectedAlarm.facilityType,
                    sensorNo: selectedAlarm.sensorNo,
                    facilityNo: null
                };
            });
        }

        _setSensorAlarms({ alarms, selectedAlarm });
    }

    // 알람이 발생하면 자동이동 하는가?
    const _useAlarmMove = (alarm) => {
        let moveDisplayAlarmNo = null;

        if (alarm.isSensorAlarm) {
            const moveDisplayAlarmValue = moveDisplayAlarmRef.current;
            moveDisplayAlarmNo = parseInt(moveDisplayAlarmValue, 10);
        }
        else {
            const moveFacilityDisplayAlarmValue = moveFacilityDisplayAlarmRef.current;
            moveDisplayAlarmNo = parseInt(moveFacilityDisplayAlarmValue, 10);
        }

        return Number.isFinite(moveDisplayAlarmNo) && moveDisplayAlarmNo === SdmsResource.alarmOption.moveToLastAlarm;
    }

    const makeSensorAlarms = (alarms, selectedAlarm) => {
        if (selectedAlarm) {
            // 알람 선택에 의하여 해당 공간으로 이동한 상태인가?
            if (selectedAlarm.movedAlarm === undefined) {
                // 알람 발생에 의한 자동이동을 막는다.
                // 자동 이동시키려면 false로 바꾸면 된다.
                selectedAlarm.movedAlarm = !_useAlarmMove(selectedAlarm);
                /*const moveDisplayAlarmValue = moveDisplayAlarmRef.current;
                const moveDisplayAlarmNo = parseInt(moveDisplayAlarmValue, 10);

                if (Number.isFinite(moveDisplayAlarmNo)) {
                    // 2이면 자동이동
                    selectedAlarm.movedAlarm = moveDisplayAlarmNo !== 2;
                } else {
                    selectedAlarm.movedAlarm = true;
                }*/
            }
        }

        return {
            alarms,
            selectedAlarm
        };
    }

    const getNewAlarm = (alarms) => {
        const len1 = alarms.length;
        const len2 = sensorAlarmRef.current?.alarms?.length;

        if (len1 === len2) {
            return null;
        }

        if (len1 > len2) {
            let latestAlarm = null;

            for (const alarm of alarms) {
                if (alarm.isAlarm) {
                    if (latestAlarm === null || alarm.dtTime > latestAlarm.dtTime) {
                        latestAlarm = alarm;
                    }
                }
            }

            return latestAlarm;
        }

        return null;
    }

    // 가장 최근에 발생한 알람을 얻어온다.
    const getLatestAlarm = (alarms) => {
        for (const alarm of alarms) {
            if (alarm.isAlarm) {
                return alarm;
            }
        }

        return null;
    }

    const getAliveSelectedAlarm = (alarms) => {
        const prevSelectedAlarm = sensorAlarmRef.current.selectedAlarm;

        if (!prevSelectedAlarm?.sensorZoneHistoryNo) {
            return null;
        }

        return alarms.find(alarm =>
            alarm.sensorZoneHistoryNo === prevSelectedAlarm.sensorZoneHistoryNo &&
            alarm.isAlarm === true
        ) ?? null;
    }

    // 가장 최근에 종료된 알람을 얻어온다.
    const getLatestClosingAlarm = (alarms) => {
        let latestAlarm = null;

        for (const alarm of alarms) {
            if (!alarm.isAlarm) {
                if (latestAlarm === null || latestAlarm.reactionTime < alarm.reactionTime) {
                    latestAlarm = alarm;
                }
            }
        }

        return latestAlarm;
    }

    const changeAlarm = async (data) => {
        if (!Contents3D.initAlarmOptions) {
            Contents3D.tempAlarms = data;

            // 알람옵션을 읽기전에는 처리하지 않는다.
            return;
        }

        if (data) {
            // data.dtTime을 내림차순으로 정렬
            data.sort((a, b) => new Date(b.dtTime) - new Date(a.dtTime));

            if (!showPopups[menu.event]) setVisiblePopups(menu.event, true);

            // 알람발생시 자동이동 하지않는다.
            const newAlarm = getNewAlarm(data);
            const shouldMoveToNewAlarm = newAlarm ? _useAlarmMove(newAlarm) : false;
            let autoOpenAlarmCCTV = false;
            let selectedAlarm = shouldMoveToNewAlarm ? newAlarm : null;//checkSelectedAlarm(data);

            if (selectedAlarm) {
                autoOpenAlarmCCTV = true;
            }

            if (!selectedAlarm) {
                const aliveSelectedAlarm = getAliveSelectedAlarm(data);
                if (aliveSelectedAlarm) {
                    selectedAlarm = aliveSelectedAlarm;
                }
                else if (!newAlarm || shouldMoveToNewAlarm) {
                    // 가장 최근에 발생한 알람을 얻어온다.
                    selectedAlarm = getLatestAlarm(data);

                    if (selectedAlarm && _useAlarmMove(selectedAlarm)) {
                        autoOpenAlarmCCTV = true;
                    }
                }
            }

            _setSensorAlarms(makeSensorAlarms(data, selectedAlarm));

            if (autoOpenAlarmCCTV && selectedAlarm) {
                getAlarmCCTVList(selectedAlarm);
            }

            // 선택된 알람이 없으면 알람 CCTV 팝업 닫기
            if (!selectedAlarm) {
                setAlarmCCTVList({ alarm: null, cctvs: [] });
                setVisiblePopups(menu.alarmCCTVInfo, false);
            }

            if (selectedAlarm && controlModeRef.current !== SdmsResource.controlMode.equipment) {
                setSelectedStatusInfo(prev => {
                    const keepAll = prev.buildingGroupNo === '__all__';
                    return {
                        buildingGroupNo: keepAll ? '__all__' : String(selectedAlarm.buildingGroupNo),
                        buildingNo: selectedAlarm.buildingNo,
                        zoneNo: selectedAlarm.zoneNo,
                        sensorTypeCode: selectedAlarm.facilityType,
                        sensorNo: selectedAlarm.sensorNo,
                        facilityNo: null
                    };
                });
            }
            else {
                if (data.length > 0) {
                    // 알람이 모두 종료되었을 경우 가장 최근에 종료된 알람이 센서알람인지 설비알람인지 구별한다.
                    // 해당 알람타입의 옵션에 따라 이동옵션일 경우 외부영역으로 이동한다.
                    const latestClosingAlarm = getLatestClosingAlarm(data);

                    if (latestClosingAlarm) {
                        if (_useAlarmMove(latestClosingAlarm) && editModeRef.current.isEditMode === false) {
                            onClickLogo();
                        }
                    }
                }
            }
            
            // ===============================
            // 이벤트 대시보드 표시 여부 판단
            // ===============================
            if (data.length === 0) return;

            const latestAlarm = data.reduce((latest, curr) =>
                new Date(curr.dtTime) > new Date(latest.dtTime) ? curr : latest
            );

            if (!latestAlarm.isAlarm) return;

            const latestAlarmTime = new Date(
                latestAlarm.reactionTime || latestAlarm.dtTime
            ).getTime();

            const now = new Date();

            const ALARM_VALID_GAP_MS = 3 * 60 * 1000; // 클라이언트 시간과 3분 차이나면 표출X

            const gap = now - latestAlarmTime;

            setShowEventDashboard(gap <= ALARM_VALID_GAP_MS);

            if (gap <= ALARM_VALID_GAP_MS && editModeRef.current.isEditMode) {
                setEditModeAlarmCount(prev => prev + 1);
            }
        }
    };

    const checkSelectedAlarm = (alarms) => {
        let selectedAlarm = null;

        if (alarms && alarms.length > 0) {
            const sensorZoneHistoryNo = selectedAlarm?.sensorZoneHistoryNo;
            let findAlarm = null;

            if (sensorZoneHistoryNo) {
                // 기존에 선택된 알람이 있고 새로운 알람 리스트에 선택된 알람이 있다면 유지
                findAlarm = alarms.find(x => x.sensorZoneHistoryNo === sensorZoneHistoryNo && x.isAlarm === true);
            }

            if (findAlarm) {
                selectedAlarm = findAlarm;
            }
            else {
                // 없다면 알람 리스트 중 첫번째 알람 선택
                for (const alarm of alarms) {
                    if (alarm.isAlarm) {
                        selectedAlarm = alarm;
                        break;
                    }
                }
            }
        }
        else {
            selectedAlarm = null;
        }

        return selectedAlarm;
    }

    const request3DOptions = async () => {
        const sensorList = await requestSensorList();

        if (sensorList) {
            const [buildingGroups, outdoorZones, message] = await SDMSController.requestBuildingGroupList();

            if (buildingGroups) {
                const siteBuildingGroupList = SpatialManager.setBuildingGroupList(buildingGroups, outdoorZones);                

                // 설비 예지보전 관련 정보 가져오기
                let [facilityModels, message3] = await SDMSController.requestFacilityModelList();
                if (facilityModels) {
                    facilityModels = FacilityManager.FormatChange(facilityModels);

                    faModelRef.current = facilityModels;
                }
                else {
                    console.log(message3);
                }

                const userInfo = ProjectResource.getUserInfo();
                const [siteModels, gltfOptions, message2] = await SDMSController.requestGltfModelList(userInfo.user_sn, [userInfo.site_sn]);

                if (siteModels) {
                    // siteModels와 siteBuildingGroupList 통합
                    const [firstSiteNo, _siteBuildingGroupList] = spatialManager.make3dModels(siteBuildingGroupList, siteModels, sensorList);
                    setModels({
                        siteBuildingGroupList: _siteBuildingGroupList,
                        currentSiteNo: firstSiteNo,
                        currentBuildingGroupNo: null,
                        currentBuildingNo: null,
                        currentZoneNo: null,
                        currentZoneName: null,
                        backToOrigin: false,
                        gltfOptions
                    });
                }
                else {
                    console.log(message2);
                }

                
            }
            else {
                console.log(message);
            }
        }
    }

    const requestSimulationPois = async () => {
        let [pois, errorMessage] = await SDMSController.requestSimulationPoi();

        if (pois) {
            setSimulationPois(pois);
        }
        else {
            console.log(errorMessage);
        }
    }

    const requestSensorList = async () => {
        /*if (!sensorTypes) {
            return null;
        }*/

        const [sensorTypes, totalCount, message] = await SDMSController.requestSensorList();

        if (sensorTypes === null) {
            return null;
        }

        const sensorList = {};

        for (const sensorType of sensorTypes) {
            sensorList[sensorType.sensorTypeName] = sensorType.sensors;
        }

        return sensorList;
    }

    const initFcltyInfos = async () => {
        // 설비 정보 불러오기
        let fcltyInfos = [];

        // DB에서 값 불러오기
        const [result, message] = await FacilityController.requestFcltyPresvList();
        if (result) {
            fcltyInfos = result;
        }

        fcltyInfosRef.current = fcltyInfos;
    }

    const onCompleteOutdoorModelLoading = (siteNo) => {
        if (models.siteBuildingGroupList) {
            const siteBuildingGroupList = { ...models.siteBuildingGroupList };
            const buildingGroupList = siteBuildingGroupList[siteNo];

            if (buildingGroupList?.buildingGroups) {
                for (const buildingGroup of buildingGroupList.buildingGroups) {
                    buildingGroup.completeLoading = true;
                }

                setModels(models);
            }
        }
    }

    let onSelectPOI = null;

    const setVisiblePopups = (menu, visible) => {
        const targets = Array.isArray(menu) ? menu : [menu];
        const touchesEditMenu = targets.some(t => EDIT_MODE_MENU.includes(t));

        if (visible === false) {
            if (_3dMasterRef.current && (menu === SdmsResource.ID.menu.equipmentChartInfo || menu === SdmsResource.ID.menu.electricChartInfo)) {
                _3dMasterRef.current.poiManager.selectPoi(null);
                _3dMasterRef.current.selectFacility(null);

                if (onSelectPOI) {
                    onSelectPOI(null, null);
                }
            }
        }

        let nextSelectedMenu; // undefined: 건드리지 않음, null: 해제, string: 설정

        setShowPopups(prev => {
            const next = { ...prev };

            // 편집모드 메뉴를 건드리면 같은 그룹의 나머지는 끈다
            if (touchesEditMenu) {
                EDIT_MODE_MENU.forEach(key => {
                    if (!targets.includes(key)) next[key] = false;
                });
            }

            // visible 지정/토글 반영 + selectedMenu 계산
            targets.forEach(key => {
            const willBeVisible = (visible === undefined) ? !Boolean(next[key]) : visible;
            next[key] = willBeVisible;

            // 편집모드 그룹 중 하나만 조작하는 경우 selectedMenu 갱신
            if (touchesEditMenu && EDIT_MODE_MENU.includes(key) && targets.length === 1) {
                nextSelectedMenu = willBeVisible ? key : null; // 꺼지면 해제
            }
            });

            return next;
        });

        // 편집메뉴를 건드린 경우에만 editMode 갱신
        if (touchesEditMenu) {
            setEditMode(prev => ({
                ...prev,
                selectedMenu: nextSelectedMenu === undefined ? prev.selectedMenu : nextSelectedMenu,
                subMenu: SdmsResource.ID.poi_editSubMenu.none
            }));
        }

        if (menu === SdmsResource.ID.menu.sensorInfo && !visible) {
            setSensorDetailInfo({
                sensor: null,
                datas: null
            });
        }
    };

    // 드래그로 선택된 팝업과 나머지 팝업의 z-index를 조절한다. (선택된 팝업이 앞으로 나오도록)
    const setActiveDragPopup = (popupType) => {
        // CCTV 팝업창이 제대로 동작하지 않아 제이쿼리 방식으로 수정 - K.D.R
        for (const key in SdmsResource.popupLayer) {
            const layerName = SdmsResource.popupLayer[key];

            if (layerName === popupType) {
                $("#" + layerName).css({ "z-index": 2 });
            } else {
                $("#" + layerName).css({ "z-index": 1 });
            }

        }
    }

    const setVisiblePoi = (typeName, visible) => {
        let types = { ...visibleSensorTypes };

        types[typeName] = visible;
        
        setVisibleSensorTypes(types);
    }

    const onClickLogo = () => {
        setSelectedStatusInfo({
            buildingGroupNo: 1,
            buildingNo: null,
            zoneNo: null,
            sensorTypeCode: null,
            sensorNo: null,
            facilityNo: null
        });

        for (const siteNo in spatialManager.sites) {
            moveToSite(siteNo, true);
            return;
        }
    }

    const moveToSite = (siteNo, backToOrigin = false) => {
        const site = spatialManager.getSite(siteNo);

        if (site) {
            const siteBuildingGroupList = models.siteBuildingGroupList ? models.siteBuildingGroupList : spatialManager.sites;

            setModels({
                siteBuildingGroupList: siteBuildingGroupList,
                currentSiteNo: siteNo,
                currentBuildingGroupNo: null,
                currentBuildingNo: null,
                currentZoneNo: null,
                currentZoneName: null,
                backToOrigin: backToOrigin,
                gltfOptions: models.gltfOptions
            });
        }
    }

    const moveToBuildingGroup = (buildingGroupNo) => {
        if (buildingGroupNo === 'OUTDOOR' || buildingGroupNo === '__all__') {
            for (const siteNo in spatialManager.sites) {
                moveToSite(siteNo, true);
                break;
            }
            return;
        }

        const buildingGroup = spatialManager.getBuildingGroup(buildingGroupNo);
        onSelectBuildingGroup(buildingGroup);

        if (buildingGroup) {
            setModels({
                siteBuildingGroupList: models.siteBuildingGroupList,
                currentSiteNo: buildingGroup.siteNo,
                currentBuildingGroupNo: buildingGroup.buildingGroupNo,
                currentBuildingNo: null,
                currentZoneNo: null,
                currentZoneName: null,
                backToOrigin: false,
                gltfOptions: models.gltfOptions
            });
        }
    }

    const moveToBuilding = (buildingNo) => {
        const building = spatialManager.getBuilding(buildingNo);
        onSelectBuildingGroup(building);

        if (building) {
            setModels({
                siteBuildingGroupList: models.siteBuildingGroupList,
                currentSiteNo: building.siteNo,
                currentBuildingGroupNo: building.buildingGroupNo,
                currentBuildingNo: building.buildingNo,
                currentZoneNo: null,
                currentZoneName: null,
                backToOrigin: false,
                gltfOptions: models.gltfOptions
            });
        }
    }

    const moveToZone = (zoneNo, backToOrigin = false, postMethod = null, params = null) => {
        const zone = spatialManager.getZone(zoneNo);
        
        if (!params) {
            onSelectBuilding({ buildingNo: zone.buildingNo }, zone);
        }

        if (zone) {
            let _zoneNo = zone.zoneNo;
            let displayText = zone.displayText;

            if (SpatialManager.isOutdoorZone(zone)) {
                _zoneNo = null;
                displayText = null;
            }

            setModels({
                siteBuildingGroupList: models.siteBuildingGroupList,
                currentSiteNo: zone.siteNo,
                currentBuildingGroupNo: zone.buildingGroupNo,
                currentBuildingNo: zone.buildingNo,
                currentZoneNo: _zoneNo,
                currentZoneName: displayText,
                backToOrigin: backToOrigin,
                gltfOptions: models.gltfOptions,
                postMethod,
                params
            });
        }
    }

    const addModelNode = (modelNode, file) => {
        spatialManager.setModelNode(modelNode, file);
    }

    const changeEditMode = (isEditMode) => {
        setEditMode({
            isEditMode: isEditMode,
            selectedMenu: SdmsResource.ID.menu.editMode_poi,
            subMenu: editMode.subMenu
        });

        if (!isEditMode) {
            setTemporarySensor({
                sensor: null, zoneNo: null, cctv: null
            });
        }
    }

    const requestAdditableSensors = async () => {
        const [sensorList, message] = await SDMSController.requestAdditableSensors();

        if (sensorList) {
            setaddPOISensorList(sensorList);
        } else {
            handleToast(message);
        }
    };

    const makeAdditableSensor = (sensor) => {
        const sensorType = sensor.sensor_ty_code;

        const sensorList = {
            "sensorTypeCode": sensorType,
            "sensorTypeName": SdmsResource.getFacilityTypeString(sensorType),
            "sensors": []
        };

        const sensorData = {
            "sensor": sensor,
            "sensorZoneData": {
                "sensorMaterial": null,
                "sensorZone": null
            }
        }

        sensorList.sensors.push(sensorData);
        return sensorList;
    }

    const includeSensor = (sensors, sensor) => {
        for (const _sensor of sensors) {
            if (_sensor.sensor.sensor_sn === sensor.sensor.sensor_sn) {
                return true;
            }
        }

        return false;
    }

    const deleteSensor = (sensor) => {
        if (!addPOIsensorList) {
            const sensorList = makeAdditableSensor(sensor);
            setaddPOISensorList([sensorList]);
        }
        else {
            const _addPOIsensorList = [...addPOIsensorList];
            const sensorList = makeAdditableSensor(sensor);

            for (const _sensorList of _addPOIsensorList) {
                if (_sensorList.sensorTypeCode === sensor.sensor_ty_code) {
                    if (includeSensor(_sensorList.sensors, sensorList.sensors[0]) === false) {
                        _sensorList.sensors.push(sensorList.sensors[0]);
                    }

                    break;
                }
            }

            setaddPOISensorList(_addPOIsensorList);
        }
    }

    const getZoneName = () => {
        if (!models.currentZoneName || controlMode === SdmsResource.controlMode.equipment) return null;

        return <p style={{ 
                    position: 'absolute', 
                    bottom: '12px', 
                    right: controlMode === SdmsResource.controlMode.integrated && !editMode.isEditMode ? '92px' : '20px',
                    fontSize: '2.5rem', 
                    fontWeight: 700, 
                    lineHeight: '172%', 
                    letterSpacing: '-1.2px',
                    zIndex: 1
                }}>
                    {models.currentZoneName}
                </p>
    }

    const onAuthorError = () => {
        handleToast("권한이 없습니다");
    }

    const onSelectBuildingGroup = async (buildingGroup) => {
        const [success, message, result] = await SDMSController.requestBuildingGroupData(buildingGroup.buildingGroupNo);

        if (success) {
            setSelected3DInfo({ 
                buildingGroup: result,
                building: null,
                zone: null,
                facility: null
            });

            setSelectedStatusInfo({
                buildingGroupNo: buildingGroup.buildingGroupNo,
                buildingNo: null,
                zoneNo: null,
                sensorTypeCode: null,
                sensorNo: null,
                facilityNo: null
            });

            if (!showPopups[menu.detailInfo]) setVisiblePopups(menu.detailInfo, true);
        }
        else {
            handleToast(message);
        }
    }

    const onSelectBuilding = async (building, zone) => {
        const [success, message, result] = await SDMSController.requestBuildingData(building.buildingNo);
        
        if (success) {
            setSelected3DInfo({ 
                buildingGroup: null,
                building: result,
                zone: zone,
                facility: null
            });

            setSelectedStatusInfo(prev => ({
                ...prev,
                buildingNo: building.buildingNo,
                zoneNo: zone?.zoneNo ?? null,
                sensorTypeCode: null,
                sensorNo: null,
                facilityNo: null
            }));

            if (!showPopups[menu.detailInfo]) setVisiblePopups(menu.detailInfo, true);
        }
        else {
            handleToast(message);
        }
    }

    const onSelectFacility = async (facilityName, zoneNo) => {
        const [success, message, result] = await SDMSController.requestFacilityData(facilityName);

        if (success) {
            setSelected3DInfo({ 
                buildingGroup: null,
                building: null,
                zone: null,
                facility: result
            });

            setSelectedStatusInfo(prev => ({
                ...prev,
                buildingGroupNo: result.buildingGroupNo,
                buildingNo: result.buildingNo,
                zoneNo: result.zoneNo,
                sensorTypeCode: null,
                sensorNo: null,
                facilityNo: result.facilityDatas[0]?.fclty_sn
            }));

            if (!showPopups[menu.detailInfo]) setVisiblePopups(menu.detailInfo, true);
            if (showPopups[menu.sensorInfo]) setVisiblePopups(menu.sensorInfo, false);
        }
        else {
            handleToast(message);
        }

        if (models?.currentZoneNo === zoneNo) {
            _3dMaster.selectFacilityData([facilityName, _3dMasterRef.current]);
        }
        else {
            moveToZone(zoneNo, false, _3dMaster.selectFacilityData, [facilityName, _3dMasterRef.current]);
        }
    }

    onSelectPOI = (sensorType, sensorNo) => {
        if (sensorNo !== null && sensorNo !== undefined) {
            const sensor = spatialManager.getSensor(sensorNo);
            onSelectSensor(sensor);
        }

        setSelectedStatusInfo(prev => ({
            ...prev,
            sensorTypeCode: sensorType,
            sensorNo: sensorNo,
            facilityNo: null
        }));

        // 3D에서 POI 선택을 풀었을 경우 선택된 알람도 삭제한다.
        if (!sensorType && !sensorNo) {
            _setSensorAlarms(prev => ({
                ...prev,
                selectedAlarm: null
            }));

            setAlarmCCTVList({
                alarm: null,
                cctvs: []
            });

            if (showPopups[menu.alarmCCTVInfo]) setVisiblePopups(menu.alarmCCTVInfo, false);
        }
    }

    const reloadSensorDatas = () => {
        const sensor = spatialManager.getSensor(selectedStatusInfo.sensorNo);
        onSelectSensor(sensor);
    }

    const checkAlarmMovingOption = (sensorNo) => {
        if (sensorAlarm?.selectedAlarm) {
            if (sensorAlarm.selectedAlarm.sensorNo === sensorNo) {
                if (sensorAlarm.selectedAlarm.movedAlarm) {
                    // 이미 이동된 알람이거나 자동이동을 허락하지 않는 상황이다.
                    return false;
                }
            }
        }

        return true;
    }

    const onSelectSensor = async (sensor) => {
        if (!sensor) return;

        if (sensor.sensor_ty_code === SdmsResource.facilityType.FIRE ||
            sensor.sensor_ty_code === SdmsResource.facilityType.PSM_SENSOR ||
            sensor.sensor_ty_code === SdmsResource.facilityType.ETC
        ) {
            const [sensorDatas, message] = await SDMSController.requestSensorInfo(Number(sensor.sensor_sn));
    
            if (sensorDatas) {
                setSensorDetailInfo({
                    sensor: sensor,
                    datas: sensorDatas
                })
            }
            else {
                console.log(message);
            }
        }
        else if (sensor.sensor_ty_code === SdmsResource.facilityType.MOBILE_SCANNER) {
            if (scannerInfo) {
                const matchedScanner = scannerInfo.find(
                    (scanner) => scanner.sensor_sn === sensor.sensor_sn
                );

                if (matchedScanner) {
                    setSensorDetailInfo({
                        sensor: sensor,
                        datas: matchedScanner
                    });
                }
            }
        }
        else if (sensor.sensor_ty_code === SdmsResource.facilityType.PM ||
                sensor.sensor_ty_code === SdmsResource.facilityType.SUMP) {
            setSensorDetailInfo({
                sensor,
                datas: null
            });
        }

        if (sensor && spatialManager.isSameZone(models?.currentZoneNo, sensor.zone_sn)) {
            _3dMasterRef.current?.poiManager?.selectSensor(sensor);
        }
        else {
            if (editModeRef.current.isEditMode === false && checkAlarmMovingOption(sensor.sensor_sn)) {
                moveToZone(sensor.zone_sn, false, PoiManager.selectSensorData, [_3dMasterRef.current?.poiManager, sensor]);
            }
        }
    }

    const handleEditMode = (isEditMode, menu, subMenu) => {
        // 계정 권한 확인
        const userAuthor = ProjectResource.getUserAuthor();
        if (userAuthor !== AccountResource.accountLevelNo.master &&
            userAuthor !== AccountResource.accountLevelNo.admin) {
            onAuthorError();
            return;
        }

        if (!isEditMode) {
            setShowPopups(prev => {
                const next = { ...prev };
                next[SdmsResource.ID.menu.editMode_poi] = true;
                next[SdmsResource.ID.menu.editMode_fakeWall] = false;
                next[SdmsResource.ID.menu.editMode_areaName] = false;
    
                return next;
            });
        }
        else {
            handleToast("편집 모드로 전환되었습니다");
        }

        setEditMode({ isEditMode: isEditMode, selectedMenu: menu, subMenu: subMenu });

        if (!isEditMode && temporarySensor) {
            _setTemporarySensor({ sensor: null, zoneNo: null, cctv: null });
        }
    }

    const handleControlMode = (mode, value) => {
        let _showCompass = true;

        if (mode === SdmsResource.controlMode.editMode) {
            handleEditMode(value[0], value[1], value[2]);
            setShowCompass(false);
            _showCompass = false;

            if (value[0]) {
                requestAdditableSensors();
            }
            else {
                setControlMode(SdmsResource.controlMode.integrated);
                setaddPOISensorList(null);
                setEditCCTVList(null);
                setSensorZoneCCTVs([]);
                setEquipZoneCCTVs([]);

                sensorCacheRef.current = {};
                equipCacheRef.current = {};

                return;
            }
        }
        else if (mode === SdmsResource.controlMode.equipment) {
            // 기본 설비 선택 값
            let fcltyNo = 1;
            let zoneNo = null;

            // 설비 선택 값 확인 
            if (value?.fcltyNo !== null && value?.fcltyNo !== undefined) {
                fcltyNo = value.fcltyNo;

                if (value?.zoneNo !== null && value?.zoneNo !== undefined) {
                    zoneNo = value.zoneNo;
                }
            }

            selFcltyInfoRef.current.fcltyNo = fcltyNo;
            selFcltyInfoRef.current.zoneNo = zoneNo;

            setShowCompass(false);
            _showCompass = false;

            handleToast("설비 모드로 전환되었습니다");

            // POI 선택 해제
            onSelectPOI(null, null);
        }
        else if (mode === SdmsResource.controlMode.simulation) {
            // 시뮬레이션 모드를 선택하면 외부영역으로 이동
            onClickLogo();

            handleToast("누출 확산 시뮬레이션 모드로 전환되었습니다");
        }

        if (_showCompass) {
            setShowCompass(true);
        }

        setControlMode(mode);
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

    const onClickToolBtn = async (type) => {
        let userInfo = ProjectResource.getUserInfo();

        if (type === SdmsResource.toolbar3DMenu.setInitScene) {
            if (controlMode === SdmsResource.controlMode.equipment) {
                // 설비 모드 경우 따로 저장
                const [seccess, message] = await SDMSController.requestSaveFcltyViewport(_3dMasterRef.current, faModelRef.current, selFcltyInfoRef.current);
                handleToast(seccess ? '초기화면이 지정되었습니다' : message);
            }
            else {
                const [seccess, message] = await SDMSController.requestSaveViewport(userInfo, _3dMasterRef.current);
                handleToast(seccess ? '초기화면이 지정되었습니다' : message);
            }
        }
        else if (type === SdmsResource.toolbar3DMenu.initScene) {
            _3dMasterRef.current.goHome();
        }
        else if (type === SdmsResource.toolbar3DMenu.zoomIn) {
            _3dMasterRef.current.zoom(true);
        }
        else if (type === SdmsResource.toolbar3DMenu.zoomOut) {
            _3dMasterRef.current.zoom(false);
        }
    }

    const handleAutoRotation = (e) => {
        e.stopPropagation();
        if (autoRotation) {
            _3dMasterRef.current.stopRotation();
        }
        else {
            _3dMasterRef.current.startAutoRotation();
        }
        setAutoRotation(!autoRotation);
    }

    const getAlarmCCTVList = async (alarm) => {
        const [cctvDatas, message] = await SDMSController.requestAlarmCCTVList(alarm.sensorZoneHistoryNo);

        if (!cctvDatas) {
            handleToast(message);
            return;
        }

        setAlarmCCTVList({
            alarm: alarm,
            cctvs: cctvDatas
        });

        setVisiblePopups(menu.alarmCCTVInfo, true);
    }

    const getValueFromChange = arg => (arg && arg.target ? arg.target.value : arg);

    const handleChangeBuildingGroup = (val, buildingGroupOptions, showPopup = true) => {
        const value = getValueFromChange(val);
        if (value === "") return;

        // 선택된 옵션 찾기 (value는 buildingNo)
        const selectedOption = buildingGroupOptions.find(o => String(o.value) === String(value));
        const label = selectedOption?.label ? String(selectedOption.label) : "";

        // 라벨에 T6-2가 포함되면 암모니아, 그 외는 무수불산
        const isT62 = label.toUpperCase().replace(/\s+/g, "").includes("T6-2");

        setSelectedSimulationInfo(prev => ({
            ...prev,
            buildingGroup: value,
            buildingGroupName: label,
            materialName: isT62 ? "암모니아" : "무수불산",
        }));

        if (_3dMasterRef.current) {
            _3dMasterRef.current.setFixedBoundingBox(label, showPopup);
        }
    };

    const handleChangeArea = val => {
        if (_3dMasterRef.current) {
            _3dMasterRef.current.setSimulationPopupMenu(false, 0, 0);
        }

        const value = getValueFromChange(val);
        if (value === "") return;
        setSelectedSimulationInfo(prev => ({ ...prev, area: value }));
    };

    const handleChangeWindDirection = (direction, label) => {
        if (_3dMasterRef.current) {
            _3dMasterRef.current.setSimulationPopupMenu(false, 0, 0);
        }

        setSelectedSimulationInfo(prev => ({ ...prev, windDirection: direction, windDirectionName: label }));
    };

    const handleChangeWindSpeed = speed => {
        if (_3dMasterRef.current) {
            _3dMasterRef.current.setSimulationPopupMenu(false, 0, 0);
        }

        setSelectedSimulationInfo(prev => ({ ...prev, windSpeed: speed }));
    };

    const doSimulation = async (buildingNo, materialName, targetLocation, windDir, windSpeed) => {
        const _3dMaster = _3dMasterRef.current;
        if (!_3dMaster?.cfdLoader) {
            console.log("!_3dMaster.cfdLoader");
            return false;
        }

        if (_3dMaster) {
            _3dMaster.setSimulationPopupMenu(false, 0, 0);
        }

        const [success, result] = await _3dMaster.cfdLoader.loadScenario(_3dMaster, materialName, buildingNo, targetLocation, windDir, windSpeed);

        if (success) {
            setSimulationLegendInfo(result);
        }

        return success;
    }

    const handleCfdFrameSeconds = (cfdFrameSeconds) => {
        if (cfdFrameSeconds.length > 0) {
            setCfdFrameSeconds(cfdFrameSeconds);
        }
    }

    const onTimestampChange = (frame) => {
        const _3dMaster = _3dMasterRef.current;
        if (!_3dMaster?.cfdLoader) {
            console.log("!_3dMaster.cfdLoader");
            return;
        } 

        _3dMaster.cfdLoader.showCfd(frame);
    }

    const resetSimulation = () => {
        setCfdFrameSeconds([]);
        hideSimulation();
        setSimulationLegendInfo(null);

        // 재설정하기 버튼 클릭 시 기존에 선택했던 데이터 보존 요청하여 주석처리
        // setSelectedSimulationInfo({
        //     buildingGroup: "",
        //     buildingGroupName: "",
        //     materialName: "",
        //     area: "",
        //     windDirection: null,
        //     windDirectionName: "",
        //     windSpeed: null,
        // });
    }

    const hideSimulation = () => {
        const _3dMaster = _3dMasterRef.current;
        if (!_3dMaster?.cfdLoader) {
            console.log("!_3dMaster.cfdLoader");
            return;
        } 

        // 실행중인 시뮬레이션 중지
        _3dMaster.cfdLoader.hideCfd(_3dMaster);
    }

    const setFcltyZone = (zoneNo) => {
        if (selFcltyInfoRef.current.zoneNo !== zoneNo) {
            selFcltyInfoRef.current.zoneNo = zoneNo;

            setRefreshFcltyInfo(!refreshFcltyInfo);
        }
    }

    const setFcltyInfo = (value) => {
        // 기본 설비 선택 값
        let fcltyNo = null;
        let zoneNo = null;

        // 설비 선택 값 확인 
        if (value?.fcltyNo !== null && value?.fcltyNo !== undefined) {
            fcltyNo = value.fcltyNo;

            if (value?.zoneNo !== null && value?.zoneNo !== undefined) {
                zoneNo = value.zoneNo;
            }
        }

        if (fcltyNo !== null && (selFcltyInfoRef.current.fcltyNo !== fcltyNo || selFcltyInfoRef.current.zoneNo !== zoneNo)) {
            selFcltyInfoRef.current.fcltyNo = fcltyNo;
            selFcltyInfoRef.current.zoneNo = zoneNo;

            setRefreshFcltyInfo(!refreshFcltyInfo);
        }
    }

    const onSelectFclty = (modelName) => {
        // 설비 모드에서 설비 모델링 클릭
        const fcltyInfos = fcltyInfosRef.current;

        // 해당 POI가 있는 여부 확인 필요
        const fcltyInfo = fcltyInfos?.find(x => x.fclty_presv_model_name === modelName);
        if (fcltyInfo) {
            // 설비 모드 리스트 클릭 정보 및 equipmentDetailInfo 전달 값
            selFcltyInfoRef.current.presvNo = fcltyInfo.fclty_presv_sn;

            if (fcltyInfo.sensor_sn !== null) {
                // POI가 있는 경우 POI 선택 그리고 해당 설비창
                // 센서 관련 정보 띄우기
                onSelectPOI(fcltyInfo.sensor_ty_code, fcltyInfo.sensor_sn);

                // 센서 poi 클릭 이미지 변경
                const sensor = spatialManager.getSensor(fcltyInfo.sensor_sn);
                if (sensor) {
                    const poi = _3dMasterRef.current.poiManager.getSensorPOI(sensor.zone_sn, sensor.sensor_sn, sensor.sensor_ty_code, sensor.subTypeNo);
                    if (poi) {
                        _3dMasterRef.current.poiManager.selectPoi(poi);
                    }
                }
            }
            else {
                // POI가 없는 경우 해당 정보
                selFcltyInfoRef.current.presvNo = fcltyInfo.fclty_presv_sn;
                if (!showPopups[SdmsResource.ID.menu.equipmentDetailInfo])
                    setVisiblePopups(SdmsResource.ID.menu.equipmentDetailInfo, true);
            }
        }
    }

    const onSelectFcltyItem = (fcltyNo) => {
        // 설비 모드에 리스트 클릭

        if (fcltyNo === null) {
            // 선택된 poi 해제
            onSelectPOI(null, null);
            _3dMasterRef.current.poiManager?.selectPoi(null);
            return;
        }

        const fcltyInfos = fcltyInfosRef.current;

        // 해당 POI가 있는 여부 확인 필요
        const fcltyInfo = fcltyInfos?.find(x => x.fclty_presv_sn === fcltyNo);
        if (fcltyInfo) {
            // 선택된 POI 그리고 현재 층이 다르다면 이동
            if (selFcltyInfoRef.current.zoneNo !== null && fcltyInfo?.zone_sn && selFcltyInfoRef.current.zoneNo !== fcltyInfo.zone_sn) {
                selFcltyInfoRef.current.zoneNo = fcltyInfo.zone_sn;
                setRefreshFcltyInfo(!refreshFcltyInfo);
            }

            // POI가 있는 경우 POI 선택
            if (fcltyInfo.sensor_sn !== null) {
                // 센서 관련 정보 띄우기
                onSelectPOI(fcltyInfo.sensor_ty_code, fcltyInfo.sensor_sn);

                // 센서 poi 클릭 이미지 변경
                const sensor = spatialManager.getSensor(fcltyInfo.sensor_sn);
                if (sensor) {
                    const poi = _3dMasterRef.current.poiManager.getSensorPOI(sensor.zone_sn, sensor.sensor_sn, sensor.sensor_ty_code, sensor.subTypeNo);
                    if (poi) {
                        _3dMasterRef.current.poiManager.selectPoi(poi);
                    }
                    else {
                        // 화면이 이동하기 전에 POI 찾지 못한다면 다시 재시도
                        setTimeout(() => {
                            const poi = _3dMasterRef.current.poiManager.getSensorPOI(sensor.zone_sn, sensor.sensor_sn, sensor.sensor_ty_code, sensor.subTypeNo);
                            if (poi) {
                                _3dMasterRef.current.poiManager.selectPoi(poi);
                            }
                        }, 2000);
                    }
                }
            }
            else {
                // 선택된 poi 해제
                onSelectPOI(null, null);
                _3dMasterRef.current.poiManager.selectPoi(null);

                // POI가 없는 경우 해당 정보 
                selFcltyInfoRef.current.presvNo = fcltyInfo.fclty_presv_sn;
                if (!showPopups[SdmsResource.ID.menu.equipmentDetailInfo])
                    setVisiblePopups(SdmsResource.ID.menu.equipmentDetailInfo, true);

                // 해당 모델이 있을 경우 바운더리 박스 선택 >> contents3D로 fcltyInfo 값 전달
                if (fcltyInfo.fclty_presv_model_name?.length > 0) {
                    _3dMasterRef.current?.facilityManager?.selectFcltBoundingBox(fcltyInfo.fclty_presv_model_name);
                }
            }
        }        
    }

    const setFcltyFlow = (value) => {
        if (selFcltyInfoRef.current.useFlow !== value) {
            selFcltyInfoRef.current.useFlow = value;

            setRefreshFcltyInfo(!refreshFcltyInfo);
        }
    }

    const getPopupUI = () => {
        if (controlMode === SdmsResource.controlMode.simulation || controlMode === SdmsResource.controlMode.equipment) return;

        let popups = [];

        if (!editMode.isEditMode && showPopups[menu.statusInfo]) {
            popups.push(
                <StatusInfo key='sdms_popup_statusInfo'
                    popupType={SdmsResource.popupLayer.statusInfo}
                    popupState={popupStateValue.statusInfo}
                    setVisiblePopups={setVisiblePopups}
                    setActiveDragPopup={setActiveDragPopup}
                    setPopupState={setPopupState}
                    siteNo={models.currentSiteNo}
                    spatialManager={spatialManager}
                    sensorTypes={sensorTypes}
                    sensorAlarms={sensorAlarm.alarms}
                    moveToBuildingGroup={moveToBuildingGroup}
                    moveToZone={moveToZone}
                    visibleSensorTypes={visibleSensorTypes}
                    setVisiblePoi={setVisiblePoi}
                    setVisibleSensorTypes={setVisibleSensorTypes}
                    selectedStatusInfo={selectedStatusInfo}
                    setSelectedStatusInfo={setSelectedStatusInfo}
                    onSelectBuilding={onSelectBuilding}
                    onSelectFacility={onSelectFacility}
                    showPopups={showPopups}
                    setSelectedCCTVInfo={setSelectedCCTVInfo}
                    facilityList={facilityList}
                    onSelectSensor={onSelectSensor}
                />
            );
        }

        if (!editMode.isEditMode && showPopups[menu.manualReport]) {
            popups.push(
                <ManualReport key='sdms_popup_manualReport'
                    popupType={SdmsResource.popupLayer.manualReport}
                    popupState={popupStateValue.manualReport}
                    setVisiblePopups={setVisiblePopups}
                    setActiveDragPopup={setActiveDragPopup}
                    setPopupState={setPopupState}
                    buildingGroupList={models.siteBuildingGroupList}
                    siteNo={models.currentSiteNo}
                    sensorTypes={sensorTypes}
                />
            );
        }

        if (!editMode.isEditMode && showPopups[menu.event]) {
            popups.push(
                <Event key='sdms_popup_event'
                    popupType={SdmsResource.popupLayer.event}
                    popupState={popupStateValue.event}
                    setVisiblePopups={setVisiblePopups}
                    setActiveDragPopup={setActiveDragPopup}
                    setPopupState={setPopupState}
                    sensorTypes={sensorTypes}
                    sensorAlarm={sensorAlarm}
                    setSensorAlarms={setSensorAlarms}
                    showConfirmDialog={showConfirmDialog}
                    onCloseConfirmDialog={onCloseConfirmDialog}
                    handleToast={handleToast}
                    getAlarmCCTVList={getAlarmCCTVList}
                    alarmCCTVList={alarmCCTVList}
                />
            );
        }

        if (!editMode.isEditMode && showPopups[menu.dashboard]) {
            popups.push(
                <Dashboard key='sdms_popup_dashboard'
                    popupType={SdmsResource.popupLayer.dashboard}
                    popupState={popupStateValue.dashboard}
                    setVisiblePopups={setVisiblePopups}
                    setActiveDragPopup={setActiveDragPopup}
                    setPopupState={setPopupState}
                    showConfirmDialog={showConfirmDialog}
                    sensorTypes={sensorTypes}
                    sensorAlarm={sensorAlarm}
                />
            );
        }

        if (!editMode.isEditMode && showPopups[menu.workerInfo]) {
            popups.push(
                <WorkerInfo key='sdms_popup_workerInfo'
                    popupType={SdmsResource.popupLayer.workerInfo}
                    popupState={popupStateValue.workerInfo}
                    setVisiblePopups={setVisiblePopups}
                    setActiveDragPopup={setActiveDragPopup}
                    setPopupState={setPopupState}
                    showConfirmDialog={showConfirmDialog}
                    moveToZone={moveToZone}
                    moveToBuilding={moveToBuilding}
                    moveToBuildingGroup={moveToBuildingGroup}
                    onClickLogo={onClickLogo}
                />
            );
        }

        if (showPopups[menu.detailInfo]) {
            popups.push(
                <DetailInfo key='sdms_popup_detailInfo'
                    popupType={SdmsResource.popupLayer.detailInfo}
                    popupState={popupStateValue.detailInfo}
                    setVisiblePopups={setVisiblePopups}
                    setActiveDragPopup={setActiveDragPopup}
                    setPopupState={setPopupState}
                    selected3DInfo={selected3DInfo}
                />
            );
        }

        if (showPopups[menu.sensorInfo]) {
            popups.push(
                <SensorInfo key='sdms_popup_sensorInfo'
                    popupType={SdmsResource.popupLayer.sensorInfo}
                    popupState={popupStateValue.sensorInfo}
                    setVisiblePopups={setVisiblePopups}
                    setActiveDragPopup={setActiveDragPopup}
                    setPopupState={setPopupState}
                    selected3DInfo={selected3DInfo}
                    sensorType={selectedStatusInfo.sensorTypeCode}
                    sensorDetailInfo={sensorDetailInfo}
                    spatialManager={spatialManager}
                    handleControlMode={handleControlMode}
                    showConfirmDialog={showConfirmDialog}
                    onCloseConfirmDialog={onCloseConfirmDialog}
                    reloadSensorDatas={reloadSensorDatas}
                />
            );
        }

        if (showPopups[menu.cctvInfo]) {
            popups.push(
                <CCTVInfo key='sdms_popup_cctvInfo'
                    popupType={SdmsResource.popupLayer.cctvInfo}
                    popupState={popupStateValue.cctvInfo}
                    setVisiblePopups={setVisiblePopups}
                    setActiveDragPopup={setActiveDragPopup}
                    setPopupState={setPopupState}
                    spatialManager={spatialManager}
                    selectedCCTVInfo={selectedCCTVInfo}
                    cctvAllList={cctvs}
                    refetchCCTV={refetchCCTV}
                />
            );
        }

        if (showPopups[menu.alarmCCTVInfo]) {
            popups.push(
                <AlarmCCTVInfo key='sdms_popup_alarmCCTVInfo'
                    popupType={SdmsResource.popupLayer.alarmCCTVInfo}
                    popupState={popupStateValue.alarmCCTVInfo}
                    setVisiblePopups={setVisiblePopups}
                    setActiveDragPopup={setActiveDragPopup}
                    setPopupState={setPopupState}
                    alarmCCTVList={alarmCCTVList}
                    setAlarmCCTVList={setAlarmCCTVList}
                    spatialManager={spatialManager}
                    cctvAllList={cctvs}
                    refetchCCTV={refetchCCTV}
                />
            );
        }

        if (showPopups[menu.equipmentAnalysis]) {
            popups.push(
                <EquipmentAnalysis key='sdms_popup_equipmentAnalysis'
                    popupType={SdmsResource.popupLayer.equipmentAnalysis}
                    popupState={popupStateValue.equipmentAnalysis}
                    setVisiblePopups={setVisiblePopups}
                    setActiveDragPopup={setActiveDragPopup}
                    setPopupState={setPopupState}
                    showPopups={showPopups}
                    handleControlMode={handleControlMode}
                    selectedStatusInfo={selectedStatusInfo}
                    fcltyInfos={fcltyInfosRef.current}
                    faModel={faModelRef.current}
                />
            );
        }

        return popups;
    }

    if (!models.siteBuildingGroupList) {
        return <></>
    }

    // 나침반 라벨 관련 코드
    const LABEL_RADIUS = 28;    // 라벨이 회전하는 반지름 크기
    const BASE_DEG = { N: 0, E: 90, S: 180, W: 270 };

    const Label = ({ baseDeg, text, angle }) => (
        <div
            style={{
                position: 'absolute',
                left: '50%',
                top: '50%',
                transform: `translate(-50%, -50%) rotate(${angle + baseDeg}deg) translate(0, -${LABEL_RADIUS}px)`,
                transformOrigin: 'center',
                transition: 'transform 0.5s ease-in-out',
                pointerEvents: 'none',
            }}
        >
            <span
                style={{
                    display: 'inline-block',
                    transform: `rotate(-${angle + baseDeg}deg)`,
                    transition: 'transform 0.5s ease-in-out',
                    color: '#fff',
                    fontSize: 10,
                    fontWeight: 400,
                    letterSpacing: '-0.3px',
                }}
            >
                {text}
            </span>
        </div>
    );

    const changeSimulationText = () => {
        if (controlMode === SdmsResource.controlMode.simulation) {
            if (textPoiManager && selectedSimulationInfo?.area && selectedSimulationInfo.area.length > 0) {
                textPoiManager.changeCfdElementText(selectedSimulationInfo.buildingGroup, selectedSimulationInfo.buildingGroupName + " > " + selectedSimulationInfo.area);
            }
            else if (textPoiManager) {
                textPoiManager.changeCfdElementText(null, null);
            }
        }
    }

    changeSimulationText();

    return (
        <div>
            <Contents3D
                siteBuildingGroupList={models.siteBuildingGroupList}
                currentModel={models}
                gltfOptions={models.gltfOptions}
                visibleSensorTypes={visibleSensorTypes}
                spatialManager={spatialManager}
                onCompleteOutdoorModelLoading={onCompleteOutdoorModelLoading}
                addModelNode={addModelNode}
                isEditMode={editMode.isEditMode}
                editMenu={editMode.selectedMenu}
                editSubMenu={editMode.subMenu}
                changeEditMode={changeEditMode}
                onChangedEdit={onChangedEdit}
                handleEditMode={handleEditMode}
                sensorAlarms={sensorAlarm.alarms}
                selectedAlarm={sensorAlarm.selectedAlarm}
                moveToBuildingGroup={moveToBuildingGroup}
                moveToZone={moveToZone}
                editModeManager={editModeManagerRef.current}
                set3dMaster={set3dMaster}
                onSelectBuildingGroup={onSelectBuildingGroup}
                onSelectBuilding={onSelectBuilding}
                onSelectFacility={onSelectFacility}
                onSelectPOI={onSelectPOI}
                faModel={faModelRef.current}
                setSelectedCCTVInfo={setSelectedCCTVInfo}
                showPopups={showPopups}
                setShowPopups={setShowPopups}
                setVisiblePopups={setVisiblePopups}
                selFcltyInfo={selFcltyInfoRef.current}
                onSelectFclty={onSelectFclty}
                refreshFcltyInfo={refreshFcltyInfo}
                fcltyInfos={fcltyInfosRef.current}
                controlMode={controlMode}
                selectedSimulationInfo={selectedSimulationInfo}
                handleChangeBuildingGroup={handleChangeBuildingGroup}
                handleChangeArea={handleChangeArea}
                handleCfdFrameSeconds={handleCfdFrameSeconds}
                setCompassAngle={setCompassAngle}
                setShowCompass={setShowCompass}
                showCompass={showCompass}
                simulationPois={simulationPois}
                setProgressValue={setProgressValue}
                temporarySensor={temporarySensor}
                setTemporarySensor={setTemporarySensor}
                deleteSensor={deleteSensor}
                addPOIsensorList={addPOIsensorList}
                editCCTVList={editCCTVList}
                cctvMappingManager={cctvMappingManager}
                setEditCCTVList={_setEditCCTVList}
                scannerInfo={scannerInfo}
                setSensorAlarms={setSensorAlarms}
                useCameraIdleTime={cameraIdleTime.use}
                cameraIdleTime={cameraIdleTime.second}
                setTextPoiManager={setTextPoiManager}
            />
            {progressValue < 100 ?
                <LoadingScreen
                    progress={progressValue}
                /> :
                <>
                {showEventDashboard &&
                    <EventDashboard
                        sensorAlarm={sensorAlarm}
                        setShowEventDashboard={setShowEventDashboard}
                        setVisiblePopups={setVisiblePopups}
                        setSensorAlarms={setSensorAlarms}
                        isEditMode={editMode.isEditMode}
                        changedEdit={changedEdit}
                        showConfirmDialog={showConfirmDialog}
                        onCloseConfirmDialog={onCloseConfirmDialog}
                        onCloseEditMode={onCloseEditMode}
                        onClickSaveEditMode={onClickSaveEditMode}
                        handleToast={handleToast}
                        editModeAlarmCount={editModeAlarmCount}
                    />
                }
                {/* <Loader /> */}
                {
                    getPopupUI()
                }
                {
                    getZoneName()
                }
                <QuickMenuBar 
                    setVisiblePopups={setVisiblePopups}
                    visiblePopups={showPopups}
                    controlMode={controlMode}
                    handleControlMode={handleControlMode}
                    isEditMode={editMode.isEditMode}
                />
                <Toolbar3D 
                    handleNavBar={handleNavBar}
                    handleAutoRotation={handleAutoRotation}
                    showNavBar={showNavBar}
                    autoRotation={autoRotation}
                    onClickToolBtn={onClickToolBtn}
                    isEditMode={editMode.isEditMode}
                />

                {/* 편집모드 관련 UI */}
                {
                    editMode.isEditMode &&
                        <EditToolbar
                            handleControlMode={handleControlMode}
                            editModeManager={editModeManagerRef.current}
                            handleToast={handleToast}
                            showConfirmDialog={showConfirmDialog}
                            onCloseConfirmDialog={onCloseConfirmDialog}
                            editMode={editMode}
                            setEditMode={setEditMode}
                            cctvMappingManager={cctvMappingManager}
                            onCloseEditMode={onCloseEditMode}
                            onClickSaveEditMode={onClickSaveEditMode}
                            changedEdit={changedEdit}
                        />
                }
                {
                    editMode.isEditMode &&
                        <EditStatusInfo
                            spatialManager={spatialManager}
                            sensorTypes={sensorTypes}
                            sensorAlarms={sensorAlarm.alarms}
                            moveToZone={moveToZone}
                        />
                }
                {
                    (editMode.isEditMode && 
                            editMode.selectedMenu === SdmsResource.ID.menu.editMode_poi &&
                            editMode.subMenu === SdmsResource.ID.poi_editSubMenu.add_poi) &&
                        <EditAddPoi
                            popupType={SdmsResource.popupLayer.editMode_addPoi}
                            popupState={popupStateValue.editMode_addPoi}
                            setVisiblePopups={setVisiblePopups}
                            setActiveDragPopup={setActiveDragPopup}
                            setPopupState={setPopupState}
                            handleToast={handleToast}
                            temporarySensor={temporarySensor}
                            setTemporarySensor={setTemporarySensor}
                            sensorList={addPOIsensorList}
                            setEditMode={setEditMode}
                        />
                }
                {
                    (editMode.isEditMode && 
                            editMode.selectedMenu === SdmsResource.ID.menu.editMode_areaName &&
                            editMode.subMenu === SdmsResource.ID.poi_editSubMenu.cctv_area) &&
                        <EditCCTVMapping
                            popupType={SdmsResource.popupLayer.editMode_cctvMapping}
                            popupState={popupStateValue.editMode_cctvMapping}
                            setVisiblePopups={setVisiblePopups}
                            setActiveDragPopup={setActiveDragPopup}
                            setPopupState={setPopupState}
                            setEditMode={setEditMode}
                            editCCTVList={editCCTVList}
                            showEditCCTVInfo={showEditCCTVInfo}
                            setShowEditCCTVInfo={setShowEditCCTVInfo}
                            handleChangeCCTVList={handleChangeCCTVList}
                            setEditCCTVList={_setEditCCTVList}
                            cctvMappingManager={cctvMappingManager}
                        />
                }
                {
                    showEditCCTVInfo &&
                        <EditCCTVInfo
                            popupType={SdmsResource.popupLayer.editMode_cctvInfo}
                            popupState={popupStateValue.editMode_cctvInfo}
                            setVisiblePopups={setVisiblePopups}
                            setActiveDragPopup={setActiveDragPopup}
                            setPopupState={setPopupState}
                            setShowEditCCTVInfo={setShowEditCCTVInfo}
                            editCCTVList={editCCTVList}
                        />
                }
                {
                        (editMode.isEditMode && editMode.selectedMenu === SdmsResource.ID.menu.editMode_poi) &&
                        <EditPOIViewer
                            visibleSensorTypes={visibleSensorTypes}
                            setVisiblePoi={setVisiblePoi}
                        />
                }

                {/* 시뮬레이션 관련 UI */}
                {
                        controlMode === SdmsResource.controlMode.simulation &&
                        <SimulationToolbar
                            handleControlMode={handleControlMode}
                            resetSimulation={resetSimulation}
                            setSelectedSimulationInfo={setSelectedSimulationInfo}
                        />
                }
                {
                        controlMode === SdmsResource.controlMode.simulation &&
                        <SimulationSetup
                            handleToast={handleToast}
                            spatialManager={spatialManager}
                            doSimulation={doSimulation}
                            selectedSimulationInfo={selectedSimulationInfo}
                            handleChangeBuildingGroup={handleChangeBuildingGroup}
                            handleChangeArea={handleChangeArea}
                            handleChangeWindDirection={handleChangeWindDirection}
                            handleChangeWindSpeed={handleChangeWindSpeed}
                            cfdFrameSeconds={cfdFrameSeconds}
                            resetSimulation={resetSimulation}
                            onTimestampChange={onTimestampChange}
                            hideSimulation={hideSimulation}
                        />
                }
                {
                        (controlMode === SdmsResource.controlMode.simulation &&
                    simulationLegendInfo) &&
                        <SimulationLegend
                            simulationLegendInfo={simulationLegendInfo}
                        />
                }

                {/* 설비모드 관련 UI */}
                {
                        controlMode === SdmsResource.controlMode.equipment &&
                        <EquipmentToolbar
                        handleControlMode={handleControlMode}
                        faModel={faModelRef.current}
                        selFcltyInfo={selFcltyInfoRef.current}
                        moveToZone={moveToZone}
                        />
                }
                {
                        controlMode === SdmsResource.controlMode.equipment &&
                        <EquipmentInfo
                            faModel={faModelRef.current}
                            selFcltyInfo={selFcltyInfoRef.current}
                            setFcltyZone={setFcltyZone}
                            setFcltyFlow={setFcltyFlow}
                            setFcltyInfo={setFcltyInfo}
                            fcltyInfos={fcltyInfosRef.current}
                            onSelectFcltyItem={onSelectFcltyItem}
                            _3dMaster={_3dMasterRef.current}
                            setVisiblePoi={setVisiblePoi}
                            visibleSensorTypes={visibleSensorTypes}
                            setVisiblePopups={setVisiblePopups}
                        />
                }
                {
                    (showPopups[menu.equipmentDetailInfo]) &&
                        <EquipmentDetailInfo
                            popupType={SdmsResource.popupLayer.equipmentDetailInfo}
                            popupState={popupStateValue.equipmentDetailInfo}
                            setVisiblePopups={setVisiblePopups}
                            setActiveDragPopup={setActiveDragPopup}
                            setPopupState={setPopupState}
                            showPopups={showPopups}
                            selectedStatusInfo={selectedStatusInfo}
                            controlMode={controlMode}
                            selFcltyInfoRef={selFcltyInfoRef.current}
                            fcltyInfos={fcltyInfosRef.current}
                            faModel={faModelRef.current}
                            handleControlMode={handleControlMode}
                        />
                }
                {
                    (controlMode === SdmsResource.controlMode.equipment && showPopups[menu.equipmentChartInfo]) &&
                        <EquipmentChartInfo
                            popupType={SdmsResource.popupLayer.equipmentChartInfo}
                            popupState={popupStateValue.equipmentChartInfo}
                            setVisiblePopups={setVisiblePopups}
                            setActiveDragPopup={setActiveDragPopup}
                            setPopupState={setPopupState}
                            selectedStatusInfo={selectedStatusInfo}
                            sensorAlarm={sensorAlarm.alarms}
                            showConfirmDialog={showConfirmDialog}
                            onCloseConfirmDialog={onCloseConfirmDialog}
                            handleToast={handleToast}
                            showConfirmDialog={showConfirmDialog}
                        />
                }
                {
                    (controlMode === SdmsResource.controlMode.equipment && showPopups[menu.electricChartInfo]) &&
                        <ElectricChartInfo
                            popupType={SdmsResource.popupLayer.electricChartInfo}
                            popupState={popupStateValue.electricChartInfo}
                            setVisiblePopups={setVisiblePopups}
                            setActiveDragPopup={setActiveDragPopup}
                            setPopupState={setPopupState}
                            selectedStatusInfo={selectedStatusInfo}
                            sensorAlarm={sensorAlarm.alarms}
                            showConfirmDialog={showConfirmDialog}
                            onCloseConfirmDialog={onCloseConfirmDialog}
                            handleToast={handleToast}
                            showConfirmDialog={showConfirmDialog}
                        />
                }

                {
                    showCompass &&
                        <div style={{ position: 'absolute', top: controlMode === SdmsResource.controlMode.integrated ? '70px' : '120px', right: 20 }}>
                            <div style={{ position: 'relative', width: 120, height: 120 }}>
                                <div 
                                    style={{
                                        position: 'absolute', inset: 0,
                                        transform: `rotate(${compassAngle}deg)`,
                                        transition: 'transform 0.5s ease-in-out'
                                    }}
                                >
                                    <img
                                        src={compass}
                                        alt="나침반 이미지"
                                        style={{ width: '120px', height: '120px', display: 'block' }}
                                    />
                                </div>
                                <div style={{ position: 'absolute', inset: 0, pointerEvents: 'none' }}>
                                    <Label baseDeg={BASE_DEG.N} text="북" angle={compassAngle} />
                                    <Label baseDeg={BASE_DEG.E} text="동" angle={compassAngle} />
                                    <Label baseDeg={BASE_DEG.S} text="남" angle={compassAngle} />
                                    <Label baseDeg={BASE_DEG.W} text="서" angle={compassAngle} />
                                </div>
                            </div>
                        </div>
                }

                {
                    /* alert창 대신 사용 */
                    confirmMessage.visible &&
                    <ConfirmDialog 
                        type={confirmMessage.type}
                        messages={confirmMessage.messages} 
                        buttons={confirmMessage.buttons} 
                        onClickButton={confirmMessage.onClickButton}
                        onCloseConfirmDialog={onCloseConfirmDialog}
                        isManualAlarm={confirmMessage.isManualAlarm}
                        hideMalfunctionCheck={confirmMessage.hideMalfunctionCheck}
                    />
                }
                </>
            }
        </div>
    );
}

export default withRouter(SDMS);