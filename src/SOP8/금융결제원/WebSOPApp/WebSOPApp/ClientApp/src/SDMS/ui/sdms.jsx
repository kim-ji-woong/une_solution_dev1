import React, { useEffect, useState, useRef, useCallback } from 'react';
import { useSelector } from 'react-redux';
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
import EventDashboard from './popups/eventDashboard';
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
import FireAlarmModal from './popups/fireAlarmModal';

import SensorInfo from './popups/sensorInfo';
import { useCCTVList } from '../../Common/hooks/useCCTVList';
import { useFacilityList } from '../../Common/hooks/useFacilityList';
import LoadingScreen from '../../Common/ui/loadingScreen';
import EditPOIViewer from './editMode/editPOIViewer';
import EditCCTVInfo from './editMode/editCCTVInfo';
import { CctvMappingManager } from './3D/utility/cctvMapping/cctvMappingManager';
import { CctvSlaveManager } from './3D/utility/cctvMapping/cctvSlaveManager';
import { _3dMaster } from './3D/utility/_3dMaster';
import { useSDMSAlarms } from '../../Common/hooks/useSDMSAlarms';
import AccessInfo from './popups/accessInfo';
import AccessInfoCollapsed from './popups/accessInfoCollapsed';
import ParkingInfo from './popups/parkingInfo';
import AccessRoute from './popups/accessRoute';
import DoorInfo from './popups/doorInfo';
import TpsInfo from './popups/tpsInfo';

function SDMS(props) {
    /* ============================================================
     * Hooks
     * ============================================================ */
    const { sensorTypes, updateSensorsByZone, fetchSensorList } = useSensorList();
    const { facilityList } = useFacilityList();
    const { cctvs, refetchCCTV } = useCCTVList();
    const { onShowToast } = useToast();

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

    // 이벤트 별 자동 화면 전환 설정값이 '마지막 알람으로 이동'인가?
    const isMoveToLastAlarmOption = () => {
        const moveDisplayAlarmNo = parseInt(moveDisplayAlarmRef.current, 10);
        return Number.isFinite(moveDisplayAlarmNo) && moveDisplayAlarmNo === SdmsResource.alarmOption.moveToLastAlarm;
    }

    // 알람이 발생하면 자동이동 하는가?
    const _useAlarmMove = (alarm) => {
        // 화재 알람 '발생' 시에는 자동 이동하지 않는다. (안내 모달의 '확인' 클릭 시점에 설정값에 따라 이동 처리)
        // 단, 화재 알람 '종료' 시 원점 복귀 동작은 기존대로 유지한다.
        if (alarm?.facilityType === SdmsResource.facilityType.FIRE && alarm?.isAlarm) {
            return false;
        }

        return isMoveToLastAlarmOption();
    }

    // 편집모드일 때 이벤트가 몇번 울렸는지 (편집모드 나가면 초기화)
    const [editModeAlarmCount, setEditModeAlarmCount] = useState(0);

    const { sensorAlarm, _setSensorAlarms, changeAlarm} = useSDMSAlarms({
        onOpenEventPopup: () => {
            setVisiblePopups(menu.event, true);
        },

        onSelectAlarmTarget: (alarm) => {
            // 화재 알람은 안내 모달의 '확인' 클릭 시점에 설정값에 따라 이동을 처리하므로 여기서는 이동하지 않는다.
            if (alarm.facilityType === SdmsResource.facilityType.FIRE) {
                return;
            }

            setSelectedStatusInfo({
                buildingGroupNo: alarm.buildingGroupNo,
                buildingNo: alarm.buildingNo,
                zoneNo: alarm.zoneNo,
                sensorTypeCode: alarm.facilityType,
                sensorNo: alarm.sensorNo,
                facilityNo: null
            });
        },

        onShowEventDashboard: () => setShowEventDashboard(true),

        onMoveToOrigin: onClickLogo,

        shouldMoveByAlarm: _useAlarmMove,

        setEditModeAlarmCount: setEditModeAlarmCount
    });

    /* ============================================================
     * 화재 알람 안내 모달
     * ============================================================ */
    const [fireAlarmModal, setFireAlarmModal] = useState({ visible: false, alarm: null });
    const shownFireAlarmIdsRef = useRef(new Set());

    // 새로 발생한 화재 알람이 있으면 안내 모달을 띄운다.
    useEffect(() => {
        const alarms = sensorAlarm?.alarms ?? [];

        // 아직 안내하지 않은 활성 화재 알람을 찾는다. (alarms는 dtTime 내림차순 정렬됨)
        const freshFireAlarm = alarms.find(a =>
            a.isAlarm
            && a.facilityType === SdmsResource.facilityType.FIRE
            && !shownFireAlarmIdsRef.current.has(a.sensorZoneHistoryNo)
        );

        if (freshFireAlarm) {
            shownFireAlarmIdsRef.current.add(freshFireAlarm.sensorZoneHistoryNo);
            setFireAlarmModal({ visible: true, alarm: freshFireAlarm });
        }
    }, [sensorAlarm]);

    const onCloseFireAlarmModal = () => {
        const alarm = fireAlarmModal.alarm;
        setFireAlarmModal({ visible: false, alarm: null });

        // 편집모드에서는 자동 화면 전환이 일시 중지되므로 이동하지 않는다. (비화재 알람과 동일 정책)
        if (editModeRef.current?.isEditMode) {
            return;
        }

        // 확인 클릭 시 이벤트 별 자동 화면 전환 설정값에 따라 3D를 이동한다. (이동 옵션이 아니면 현재 화면 유지)
        if (alarm && isMoveToLastAlarmOption()) {
            onClickLogo();
        }
    };

    /* ============================================================
     * Constants
     * ============================================================ */
    const menu = {
        none: null,
        statusInfo: SdmsResource.ID.menu.statusInfo,                  // 현황정보
        dashboard: SdmsResource.ID.menu.dashboard,                    // 대시보드
        event: SdmsResource.ID.menu.event,                            // 이벤트 정보
        manualReport: SdmsResource.ID.menu.manualReport,              // 수동신고
        detailInfo: SdmsResource.ID.menu.detailInfo,                  // 공장동/공장/설비 정보
        sensorInfo: SdmsResource.ID.menu.sensorInfo,                  // 센서정보
        accessInfo: SdmsResource.ID.menu.accessInfo,                  // 출입자 현황정보
        accessRoute: SdmsResource.ID.menu.accessRoute,                // 출입자 이동 동선
        parkingInfo: SdmsResource.ID.menu.parkingInfo,                // 출입차량 현황정보
        doorInfo: SdmsResource.ID.menu.doorInfo,                      // 출입문 현황정보
        cctvInfo: SdmsResource.ID.menu.cctvInfo,                      // CCTV
        alarmCCTVInfo: SdmsResource.ID.menu.alarmCCTVInfo,            // 알람 CCTV
        editMode_poi: SdmsResource.ID.menu.editMode_poi,              // 편집모드_POI
        editMode_fakeWall: SdmsResource.ID.menu.editMode_fakeWall,    // 편집모드_가벽
        editMode_areaName: SdmsResource.ID.menu.editMode_areaName,    // 편집모드_구역명편집
        editMode_addPoi: SdmsResource.ID.menu.editMode_addPoi,        // 편집모드_추가 POI 목록
        editMode_cctvMapping: SdmsResource.ID.menu.editMode_cctvMapping,    // 편집모드_CCTV 매핑
        editMode_cctvInfo: SdmsResource.ID.menu.editMode_cctvInfo,    // 편집모드_CCTV 영상정보
        tpsInfo: SdmsResource.ID.menu.tpsInfo,                        // TPS실 정보
    }

    // 편집모드 메뉴
    const EDIT_MODE_MENU = [
        SdmsResource.ID.menu.editMode_poi,
        SdmsResource.ID.menu.editMode_fakeWall,
        SdmsResource.ID.menu.editMode_areaName,
    ];

    /* ============================================================
     * Redux Datas
     * ============================================================ */
    const totalDoorStatus = useSelector(state => state.totalDoorStatus);   // 미개방 출입문 현황

    /* ============================================================
     * UI State (팝업, 토글, 선택 상태)
     * ============================================================ */
    const [showPopups, setShowPopups] = useState({});
    const [showEditCCTVInfo, setShowEditCCTVInfo] = useState(false);
    const [showEventDashboard, setShowEventDashboard] = useState(false);
    const [showNavBar, setShowNavBar] = useState(false);
    const [popupStateValue, setPopupStateValue] = useState({});
    const [visibleSensorTypes, setVisibleSensorTypes] = useState(PoiManager.getOriginVisibleSensorTypes());
    const [progressValue, setProgressValue] = useState(0);
    const [refreshFcltyInfo, setRefreshFcltyInfo] = useState(false);
    const [isCollapsedAccessInfo, setIsCollapsedAccessInfo] = useState(false);  // 출입자 현황정보 확대 축소 여부

    const [confirmMessage, setConfirmMessage] = useState({
        visible: false,
        type: null,
        messages: [""],
        buttons: ["확인"],
        onClickButton: null,
        isManualAlarm: false,
        hideMalfunctionCheck: false,
    });

    /* ============================================================
     * Domain State
     * ============================================================ */
    const [models, setModels] = useState({ siteBuildingGroupList: null, currentSiteNo: null, currentBuildingGroupNo: null, currentBuildingNo: null, currentZoneNo: null, currentZoneName: null, backToOrigin: false, gltfOptions: {} });

    const [selectedStatusInfo, setSelectedStatusInfo] = useState({
        buildingGroupNo: null,
        buildingNo: null,
        zoneNo: null,
        showSensorTypes: false,
        sensorTypeCode: null,
        sensorNo: null,
        facilityNo: null
    });

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

    const [spatialManager, setSpatialManager] = useState(new SpatialManager());

    const [addPOIsensorList, setaddPOISensorList] = useState(null);

    const [temporarySensor, _setTemporarySensor] = useState({
        sensor: null, zoneNo: null, cctv: null
    });

    const [doorStatus, setDoorStatus] = useState(null);

    const [selectedComingPerson, setSelectedComingPerson] = useState(null);
    const [selectedAccessRoute, setSelectedAccessRoute] = useState(null);
    const [accessRoutes, setAccessRoutes] = useState(null);

    /* ============================================================
     * 편집모드 State
     * ============================================================ */
    const [editMode, setEditMode] = useState({ isEditMode: false, selectedMenu: SdmsResource.ID.menu.editMode_poi, subMenu: SdmsResource.ID.poi_editSubMenu.none });
    const [changedEdit, setChangedEdit] = useState(false);
    const [controlMode, setControlMode] = useState(SdmsResource.controlMode.integrated);

    /* ============================================================
     * CCTV Mapping State
     * ============================================================ */
    const [editCCTVList, setEditCCTVList] = useState(null);
    const [cctvMappingManager, setCctvMappingManager] = useState(new CctvMappingManager());
    const [selectedCCTVInfo, setSelectedCCTVInfo] = useState({
        zoneNo: null,
        sensorNo: null
    });
    const [alarmCCTVList, setAlarmCCTVList] = useState({
        alarm: null,
        cctvs: []
    });

    /* ============================================================
     * Settings State
     * ============================================================ */
    const pickSetting = (commonSettings, name, fallback) => {
        const sdms = commonSettings?.find(c => c.categoryType === "SDMS");
        const v = sdms?.settingDatas?.find(o => o.name === name)?.value;
        return v ?? fallback;
    };

    const initialCommon = SettingsStore.getState().commonSettings ?? [];
    const [moveDisplayAlarm, setMoveDisplayAlarm] = useState(
        pickSetting(initialCommon, "MoveDisplayAlarm", SdmsResource.alarmOption.moveToLastAlarm.toString())
    );
    const [moveFacilityDisplayAlarm, setMoveFacilityDisplayAlarm] = useState(
        pickSetting(initialCommon, "MoveFacilityDisplayAlarm", SdmsResource.alarmOption.moveToLastAlarm.toString())
    );
    const [cameraIdleTime, setCameraIdleTime] = useState(
        pickSetting(initialCommon, "CameraIdleTime", { use: true, second: 600 })
    );

    const [useDoorAnimation, setUseDoorAnimation] = useState(
        pickSetting(initialCommon, "UseDoorAnimation", false)
    );

    const [autoRotation, setAutoRotation] = useState(false);
    const [popupLocationPosition, setPopupLocationPosition] = useState(true);

    /* ============================================================
     * Refs
     * ============================================================ */
    const didMount = useRef(false);
    const sensorAlarmRef = useRef(sensorAlarm);
    const editModeManagerRef = useRef(null);
    const _3dMasterRef = useRef(null);
    const sensorCacheRef  = useRef({});
    const equipCacheRef  = useRef({});
    const fcltyInfosRef = useRef([]);
    const faModelRef = useRef([]);
    const selFcltyInfoRef = useRef({ fcltyNo: null, zoneNo: null, useFlow: true, presvNo: null });
    const tpsInfoRef = useRef({ tpsNo: null });
    const moveDisplayAlarmRef = useRef(moveDisplayAlarm);
    const moveFacilityDisplayAlarmRef = useRef(moveFacilityDisplayAlarm);
    const editModeRef = useRef(editMode);
    const prevCloseDoorCountRef = useRef(0);

    /* ============================================================
     * Callbacks
     * ============================================================ */
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

            // 2캐시에 없으면 → API 호출
            const apiMap = {
                nameTag: SDMSController.requestEquipZoneCCTVList,
                sensor: SDMSController.requestCCTVListFromSensor,
            };

            const [result, message] = await getCctvList(type, apiMap, sensorNo, zoneNo);

            if (result === null && message === null) {
                return;
            }

            if (result) {
                _setEditCCTVList({ type, zoneNo, cctvList: result }, sensorNo, true);
                
            } else {
                handleToast(message);
                _setEditCCTVList(null, sensorNo);
            }
        }, []
    );

    /* ============================================================
     * Effects
     * ============================================================ */
    // 초기화
    useEffect(() => {
        props.menuEvent.onClickLogo = onClickLogo;

        // 처음부터 뜰 메뉴
        let showPopupInfo = {};
        showPopupInfo[menu.statusInfo] = true;
        showPopupInfo[menu.dashboard] = true;
        showPopupInfo[menu.event] = false;
        showPopupInfo[menu.manualReport] = false;
        showPopupInfo[menu.accessInfo] = false;
        showPopupInfo[menu.accessRoute] = false;
        showPopupInfo[menu.parkingInfo] = false;
        showPopupInfo[menu.doorInfo] = false;
        showPopupInfo[menu.detailInfo] = false;
        showPopupInfo[menu.sensorInfo] = false;
        showPopupInfo[menu.cctvInfo] = false;
        showPopupInfo[menu.alarmCCTVInfo] = false;
        showPopupInfo[menu.editMode_poi] = true;
        showPopupInfo[menu.editMode_fakeWall] = false;
        showPopupInfo[menu.editMode_areaName] = false;
        showPopupInfo[menu.tpsInfo] = false;
        setShowPopups(showPopupInfo);

        request3DOptions();
        initFcltyInfos();
    }, []);

    // 타이머
    useEffect(() => {
        SDMSController.StartWatchAlarmTimer();

        return () => {
            SDMSController.stopWatchAlarmTimer();
            SDMSController.stopWatchDoorTimer();
        }
    }, []);

    // Store 구독
    useEffect(() => {
        const unsubscribe = store.subscribe(() => {
            const data = store.getState();

            if (data.actionType === 'DOOR_STATUS') {
                setDoorStatus(data.doorStatus);

                if (_3dMasterRef?.current?.poiManager && spatialManager) {
                    spatialManager.updateDoorStatus(data.doorStatus, _3dMasterRef.current.props.currentModel?.currentZoneNo, _3dMasterRef.current.poiManager);
                }
            }
        });

        // 알람옵션을 처음 읽어오기전에 수신된 알람이 있으면 처리한다.
        const checkTempAlarms = () => {
            if (Contents3D.tempAlarms.length > 0) {
                changeAlarm(Contents3D.tempAlarms);
            }
        }

        const unsubscribeSettings = SettingsStore.subscribe(() => {
            const data = SettingsStore.getState();
            if (data.actionType === 'COMMON_SETTINGS') {
                const nextMoveDisplayAlarm = pickSetting(data.commonSettings, "MoveDisplayAlarm", SdmsResource.alarmOption.moveToLastAlarm.toString());
                const nextMoveFacilityDisplayAlarm = pickSetting(data.commonSettings, "MoveFacilityDisplayAlarm", SdmsResource.alarmOption.moveToLastAlarm.toString());
                // 자동회전 대기시간(초)
                const nextCameraIdleTime = pickSetting(data.commonSettings, "CameraIdleTime", 600);
                const nextUseCameraIdleTime = pickSetting(data.commonSettings, "UseCameraIdleTime", true);
                const nextPopupLocationPosition = pickSetting(data.commonSettings, "PopupLocationPosition", true);
                const nextUseDoorAnimation = pickSetting(data.commonSettings, "UseDoorAnimation", true);

                setMoveDisplayAlarm(nextMoveDisplayAlarm);
                setMoveFacilityDisplayAlarm(nextMoveFacilityDisplayAlarm);
                setCameraIdleTime({ use: getBoolean(nextUseCameraIdleTime), second: getInt(nextCameraIdleTime) });
                setPopupLocationPosition(nextPopupLocationPosition);
                setUseDoorAnimation(nextUseDoorAnimation);

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
        }
    }, []);

    useEffect(() => {
        sensorAlarmRef.current = sensorAlarm;
    }, [sensorAlarm]);

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

    useEffect(() => {
        moveDisplayAlarmRef.current = moveDisplayAlarm;
    }, [moveDisplayAlarm]);

    useEffect(() => {
        moveFacilityDisplayAlarmRef.current = moveFacilityDisplayAlarm;
    }, [moveFacilityDisplayAlarm]);

    // 선택된 센서, 설비에 따라 팝업 show/hide
    useEffect(() => {
        const { sensorNo, sensorTypeCode, facilityNo } = selectedStatusInfo;
        
        const isCCTV = sensorTypeCode === SdmsResource.facilityType.CCTV;

        // 센서 정보가 없거나 설비 정보가 있는 경우 -> 센서정보 닫기
        if (!sensorNo || !sensorTypeCode || facilityNo) {
            setVisiblePopups(menu.sensorInfo, false);
            setSensorDetailInfo({
                sensor: null,
                datas: null
            });
        }

        // 설비나 CCTV가 아닌 일반 센서가 선택된 경우 -> 센서정보 열기
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

            // 수동신고 알람 선택은 센서정보 논모달 띄우지 않음
            if (sensorAlarm.selectedAlarm && sensorAlarm.selectedAlarm.sensorNo === sensorNo && sensorAlarm.selectedAlarm.isManual) {
                setVisiblePopups(menu.sensorInfo, false);
                return;
            }

            setVisiblePopups(menu.sensorInfo, true);
            setVisiblePopups(menu.detailInfo, false);
            setVisiblePopups(menu.cctvInfo, false);
        } 
        else {
            setVisiblePopups(menu.cctvInfo, false);
            setVisiblePopups(menu.sensorInfo, false);
            setSensorDetailInfo({
                sensor: null,
                datas: null
            });
        }

    }, [selectedStatusInfo.sensorNo, selectedStatusInfo.facilityNo]);

    // zone 변경 시 출입문 상태 갱신
    useEffect(() => {
        SDMSController.stopWatchDoorTimer();

        if (!models.currentZoneNo) return;

        SDMSController.StartWatchDoorTimer(models.currentZoneNo);

        return () => {
            SDMSController.stopWatchDoorTimer();
        };
    }, [models.currentZoneNo]);

    const getBoolean = (value) => {
        if (value === null || value.length === 0) {
            return null;
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
        // editMode 변경될 때 ref도 갱신
        editModeRef.current = editMode;
    }, [editMode]);

    useEffect(() => {
        // zone을 이동할때마다 sensorList를 새로 받아온다.
        fetchSensorList();
    }, [models.currentZoneNo]);

    useEffect(() => {
        if (!selectedStatusInfo.sensorTypeCode) return;

        // sensorType 트리가 열리면 해당 zone, sensorType에 해당하는 sensor를 새로 받아온다.
        getZoneSensorList(selectedStatusInfo.sensorTypeCode, selectedStatusInfo.zoneNo);
    }, [selectedStatusInfo.sensorTypeCode]);

    useEffect(() => {
        if (!editMode.isEditMode) {
            setEditModeAlarmCount(0);
        }
    }, [editMode.isEditMode]);

    useEffect(() => {
        // 출입자 현황정보 논모달에서 출입자를 선택했을 때 출입자 이동 동선 논모달 show
        if (selectedComingPerson && !showPopups[menu.accessRoute]) {
            setVisiblePopups(menu.accessRoute, true);
        }
    }, [selectedComingPerson]);

    useEffect(() => {
        // 출입자 현황정보 논모달이 닫히거나, 최소화 되었을 경우 출입자 이동 동선 논모달 hide
        if (!showPopups[menu.accessInfo] || isCollapsedAccessInfo) {
            setVisiblePopups(menu.accessRoute, false);
            setSelectedComingPerson(null);
            setSelectedAccessRoute(null);
            setAccessRoutes(null);
        }
    }, [showPopups[menu.accessInfo], isCollapsedAccessInfo]);

    useEffect(() => {
        startDoorInfoWatch();
    }, [sensorAlarm.selectedAlarm]);

    useEffect(() => {
        // 출입문 상태 변화 감시
        if (!totalDoorStatus) return;

        const { totalCloseDoorCount } = totalDoorStatus;
        const prev = prevCloseDoorCountRef.current;

        if (prev === 0 && totalCloseDoorCount > 0) {
            setVisiblePopups(menu.doorInfo, true);
        }

        if (prev > 0 && totalCloseDoorCount === 0) {
            setVisiblePopups(menu.doorInfo, false);
        }

        prevCloseDoorCountRef.current = totalCloseDoorCount;
    }, [totalDoorStatus]);

    useEffect(() => {
        // 출입문 현황정보 논모달이 닫혔을 경우 타이머 종료
        if (!showPopups[menu.doorInfo]) {
            SDMSController.stopWatchTotalDoorStatusTimer();
        }
    }, [showPopups[menu.doorInfo]]);

    const setTemporarySensor = (sensor, cctv) => {
        if (sensor) {
            const zoneNo = models.currentZoneNo;
            _setTemporarySensor({ sensor, zoneNo, cctv });
        }
        else {
            _setTemporarySensor({ sensor: null, zoneNo: null, cctv: null });
        }
    }

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
            else {
                return;
            }

            setEditCCTVList(data);

            const mgr = editModeManagerRef.current;

            if (!mgr) {
                return;
            }

            onChangedEdit(mgr.isChanged());
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
            if (Array.isArray(nextList)) {
                sensorCacheRef.current[String(zoneNo)] = nextList;
            } 
        }
        else if (type === 'nameTag') {
            if (Array.isArray(nextList)) {
                equipCacheRef.current[String(zoneNo)] = nextList;
            }
        }
    };

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

            if (selectedAlarm.facilityType === SdmsResource.facilityType.FIRE) {
                onClickLogo();
            }
            else {
                setSelectedStatusInfo({
                    buildingGroupNo: selectedAlarm.buildingGroupNo,
                    buildingNo: selectedAlarm.buildingNo,
                    zoneNo: selectedAlarm.zoneNo,
                    sensorTypeCode: selectedAlarm.facilityType,
                    sensorNo: selectedAlarm.sensorNo,
                    facilityNo: null
                });
            }
        }

        _setSensorAlarms({ alarms, selectedAlarm });
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
                /*let [facilityModels, message3] = await SDMSController.requestFacilityModelList();
                if (facilityModels) {
                    facilityModels = FacilityManager.FormatChange(facilityModels);

                    faModelRef.current = facilityModels;
                }
                else {
                    console.log(message3);
                }*/

                const userInfo = ProjectResource.getUserInfo();
                const [siteModels, gltfOptions, message2] = await SDMSController.requestGltfModelList(userInfo.user_sn, [userInfo.site_sn]);

                // TPS실 정보 가져오기
                const [tpsList, message3] = await SDMSController.requestTpsZoneList();

                if (siteModels) {
                    // siteModels와 siteBuildingGroupList 통합
                    const [firstSiteNo, _siteBuildingGroupList] = spatialManager.make3dModels(siteBuildingGroupList, siteModels, sensorList, tpsList);
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
        /*const [result, message] = await FacilityController.requestFcltyPresvList();
        if (result) {
            fcltyInfos = result;
        }*/

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

    const setVisiblePopups = (menu, visible) => {
        const targets = Array.isArray(menu) ? menu : [menu];
        const touchesEditMenu = targets.some(t => EDIT_MODE_MENU.includes(t));

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

    const _getSensorType = (typeName) => {
        const index1 = typeName.indexOf('_');
        const index2 = typeName.indexOf('-');
        let index = -1;

        if (index1 > 0) {
            if (index2 > 0) {
                index = index1 < index2 ? index1 : index2;
            }
            else {
                index = index1;
            }
        }
        else if (index2 > 0) {
            index = index2;
        }
        else {
            return null;
        }

        return parseInt(typeName.substring(0, index));
    }

    const setVisiblePoi = (typeName, visible) => {
        const sensorType = _getSensorType(typeName);

        let types = { ...visibleSensorTypes };

        if (sensorType === SdmsResource.facilityType.DOOR) {
            for (const sensorTypeName in types) {
                if (sensorTypeName.startsWith(sensorType)) {
                    types[sensorTypeName] = visible;
                }
            }
        }
        else {
            types[typeName] = visible;
        }        
        
        setVisibleSensorTypes(types);
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
        if (!models.currentZoneName) return null;

        return <p style={{ 
                    position: 'absolute', 
                    bottom: '12px', 
                    right: !editMode.isEditMode ? '92px' : '20px',
                    fontSize: '2.5rem', 
                    fontWeight: 700, 
                    lineHeight: '172%', 
                    letterSpacing: '-1.2px',
                    zIndex: 2
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

            // 금융결제원은 건물 정보를 표출하지 않으므로 주석처리
            // if (!showPopups[menu.detailInfo]) setVisiblePopups(menu.detailInfo, true);
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

            // 금융결제원은 건물 정보를 표출하지 않으므로 주석처리
            // if (!showPopups[menu.detailInfo]) setVisiblePopups(menu.detailInfo, true);
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

    const onSelectPOI = (sensorType, sensorNo) => {
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
            sensor.sensor_ty_code === SdmsResource.facilityType.EmergencyBell ||
            sensor.sensor_ty_code === SdmsResource.facilityType.DOOR ||
            sensor.sensor_ty_code === SdmsResource.facilityType.Invasion
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

        setEditMode({ isEditMode: isEditMode, selectedMenu: menu, subMenu: subMenu });

        if (!isEditMode && temporarySensor) {
            _setTemporarySensor({ sensor: null, zoneNo: null, cctv: null });
        }
    }

    const handleControlMode = (mode, value) => {
        if (mode === SdmsResource.controlMode.editMode) {
            handleEditMode(value[0], value[1], value[2]);

            if (value[0]) {
                requestAdditableSensors();
                handleToast("편집 모드로 전환되었습니다");
            }
            else {
                setControlMode(SdmsResource.controlMode.integrated);
                setaddPOISensorList(null);
                setEditCCTVList(null);

                sensorCacheRef.current = {};
                equipCacheRef.current = {};

                return;
            }
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
            const [seccess, message] = editMode.isEditMode ? await SDMSController.requestSaveOrthoViewport(userInfo, _3dMasterRef.current) : await SDMSController.requestSaveViewport(userInfo, _3dMasterRef.current);
            handleToast(seccess ? '초기화면이 지정되었습니다' : message);
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
        // 수동신고 알람, 화재 알람은 이벤트 CCTV 논모달 표출X
        if (alarm.isManual || alarm.facilityType === SdmsResource.facilityType.FIRE) return;

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

    const getZoneSensorList = async (sensorTypeCode, zoneNo) => {
        const [sensorTypes, _, message] = await SDMSController.requestZoneSensorList([sensorTypeCode], zoneNo);

        if (sensorTypes === null) {
            handleToast(message);
            return;
        }

        updateSensorsByZone(zoneNo, sensorTypes);
    }

    const startDoorInfoWatch = () => {
        /* 미개방 출입문 논모달 표시 조건
        * - 화재 알람인 경우
        * - 수동 신고 알람은 제외
        * - 이벤트 정보 논모달에서 알람 카드가 선택되어 있을 때만 표시
        */

        const alarm = sensorAlarm.selectedAlarm;

        // 선택된 알람이 화재 알람이 아닌 경우 출입문 논모달 닫기
        if (
            !alarm ||
            alarm.facilityType !== SdmsResource.facilityType.FIRE ||
            alarm.isManual
        ) {
            if (showPopups[menu.doorInfo]) {
                setVisiblePopups(menu.doorInfo, false);
            }
            return;
        }

        // 화재 알람인 경우 타이머 감시 시작
        SDMSController.StartWatchTotalDoorStatusTimer();

        // 이미 미개방 출입문이 있으면 논모달 열기
        if (totalDoorStatus?.totalCloseDoorCount > 0) {
            setVisiblePopups(menu.doorInfo, true);
        }
    };

    const setTpsZone = (tpsNo) => {
        // tpsZoneNo 전달
        tpsInfoRef.current.tpsNo = tpsNo;

        // 팝업 열기
        setVisiblePopups(menu.tpsInfo, true);
    }

    const getPopupUI = () => {
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
                    showConfirmDialog={showConfirmDialog}
                    onCloseConfirmDialog={onCloseConfirmDialog}
                />
            );
        }

        // 미개방 출입문이 존재하는지? (화재 알람카드에 사용)
        const hasClosedDoor = totalDoorStatus?.totalCloseDoorCount > 0;

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
                    showPopups={showPopups}
                    startDoorInfoWatch={startDoorInfoWatch}
                    hasClosedDoor={hasClosedDoor}
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

        if (!editMode.isEditMode && showPopups[menu.accessInfo]) {
            if (isCollapsedAccessInfo) {
                // 축소 버전
                popups.push(
                    <AccessInfoCollapsed key='sdms_popup_accessInfo_collapsed'
                        popupType={SdmsResource.popupLayer.accessInfoCollapsed}
                        popupState={popupStateValue.accessInfoCollapsed}
                        setVisiblePopups={setVisiblePopups}
                        setActiveDragPopup={setActiveDragPopup}
                        setPopupState={setPopupState}
                        setIsCollapsedAccessInfo={setIsCollapsedAccessInfo}
                    />
                );
            }
            else {
                // 확대 버전
                popups.push(
                    <AccessInfo key='sdms_popup_accessInfo_expanded'
                        popupType={SdmsResource.popupLayer.accessInfo}
                        popupState={popupStateValue.accessInfo}
                        setVisiblePopups={setVisiblePopups}
                        setActiveDragPopup={setActiveDragPopup}
                        setPopupState={setPopupState}
                        setIsCollapsedAccessInfo={setIsCollapsedAccessInfo}
                        selectedComingPerson={selectedComingPerson}
                        setSelectedComingPerson={setSelectedComingPerson}
                    />
                );
            }
        }

        if (!editMode.isEditMode && showPopups[menu.parkingInfo]) {
            popups.push(
                <ParkingInfo key='sdms_popup_parkingInfo'
                    popupType={SdmsResource.popupLayer.parkingInfo}
                    popupState={popupStateValue.parkingInfo}
                    setVisiblePopups={setVisiblePopups}
                    setActiveDragPopup={setActiveDragPopup}
                    setPopupState={setPopupState}
                    showConfirmDialog={showConfirmDialog}
                    onCloseConfirmDialog={onCloseConfirmDialog}
                    handleToast={handleToast}
                />
            );
        }

        if (!editMode.isEditMode && showPopups[menu.accessRoute]) {
            popups.push(
                <AccessRoute key='sdms_popup_accessRoute'
                    popupType={SdmsResource.popupLayer.accessRoute}
                    popupState={popupStateValue.accessRoute}
                    setVisiblePopups={setVisiblePopups}
                    setActiveDragPopup={setActiveDragPopup}
                    setPopupState={setPopupState}
                    selectedComingPerson={selectedComingPerson}
                    setSelectedComingPerson={setSelectedComingPerson}
                    showConfirmDialog={showConfirmDialog}
                    onCloseConfirmDialog={onCloseConfirmDialog}
                    selectedAccessRoute={selectedAccessRoute}
                    setSelectedAccessRoute={setSelectedAccessRoute}
                    accessRoutes={accessRoutes}
                    setAccessRoutes={setAccessRoutes}
                    moveToZone={moveToZone}
                    handleToast={handleToast}
                />
            )
        }

        if (!editMode.isEditMode && showPopups[menu.tpsInfo]) {
            popups.push(
                <TpsInfo key='sdms_popup_tpsInfo'
                    popupType={SdmsResource.popupLayer.tpsInfo}
                    popupState={popupStateValue.tpsInfo}
                    setVisiblePopups={setVisiblePopups}
                    setActiveDragPopup={setActiveDragPopup}
                    setPopupState={setPopupState}
                    showConfirmDialog={showConfirmDialog}
                    onCloseConfirmDialog={onCloseConfirmDialog}
                    handleToast={handleToast}
                    tpsNo={tpsInfoRef.current.tpsNo}
                />
            )
        }

        if (!editMode.isEditMode && showPopups[menu.doorInfo]) {
            popups.push(
                <DoorInfo key='sdms_popup_doorInfo'
                    popupType={SdmsResource.popupLayer.doorInfo}
                    popupState={popupStateValue.doorInfo}
                    setVisiblePopups={setVisiblePopups}
                    setActiveDragPopup={setActiveDragPopup}
                    setPopupState={setPopupState}
                    totalDoorStatus={totalDoorStatus}
                    moveToZone={moveToZone}
                    currentZoneNo={models.currentZoneNo}
                />
            )
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
                    selectedAlarm={sensorAlarm.selectedAlarm}
                />
            );
        }

        return popups;
    }

    if (!models.siteBuildingGroupList) {
        return <></>
    }

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
                setProgressValue={setProgressValue}
                temporarySensor={temporarySensor}
                setTemporarySensor={setTemporarySensor}
                deleteSensor={deleteSensor}
                addPOIsensorList={addPOIsensorList}
                editCCTVList={editCCTVList}
                cctvMappingManager={cctvMappingManager}
                setEditCCTVList={_setEditCCTVList}
                setSensorAlarms={setSensorAlarms}
                useCameraIdleTime={cameraIdleTime.use}
                cameraIdleTime={cameraIdleTime.second}
                accessRoutes={accessRoutes}
                selectedAccessRoute={selectedAccessRoute}
                useDoorAnimation={useDoorAnimation}
                setSelectedAccessRoute={setSelectedAccessRoute}
                setTpsZone={setTpsZone}
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
                            selectedStatusInfo={selectedStatusInfo}
                            setSelectedStatusInfo={setSelectedStatusInfo}
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
                            zoneNo={models.currentZoneNo}
                            spatialManager={spatialManager}
                        />
                }
                {
                        (editMode.isEditMode && editMode.selectedMenu === SdmsResource.ID.menu.editMode_poi) &&
                        <EditPOIViewer
                            visibleSensorTypes={visibleSensorTypes}
                            setVisiblePoi={setVisiblePoi}
                            setVisibleSensorTypes={setVisibleSensorTypes}
                        />
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
                {
                    /* 화재 알람 발생 시 안내 모달 */
                    fireAlarmModal.visible &&
                    <FireAlarmModal
                        alarm={fireAlarmModal.alarm}
                        onClose={onCloseFireAlarmModal}
                    />
                }
                </>
            }
        </div>
    );
}

export default withRouter(SDMS);