import React, { useEffect, useState, useRef } from 'react';
import $ from 'jquery';
import { withRouter } from 'react-router-dom';
import SDMSResource from '../resource/id';
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
import { WorkerManager } from './3D/workers/workerManager';
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
import SimulationToolbar from './simulation/simulationToolbar';
import SimulationSetup from './simulation/simulationSetup';

import { FacilityManager } from "./3D/utility/facilityManager";
import EquipmentToolbar from './equipment/equipmentToolbar';
import EquipmentInfo from './equipment/equipmentInfo';
import EquipmentAnalysis from './equipment/equipmentAnalysis';
import EquipmentAnalysisFixed from './equipment/equipmentAnalysisFixed';
import EquipmentDetailInfo from './equipment/equipmentDetailInfo';
import EquipmentChartDetailInfo from './equipment/equipmentChartDetailInfo';
import { useSensorServerStatus } from '../../Common/hooks/useSensorServerStatus';

function SDMS(props) {
    const { sensorTypes } = useSensorList();
    const { sensorServers } = useSensorServerStatus();
    const { onShowToast } = useToast();

    const menu = {
        none: null,
        statusInfo: SDMSResource.ID.menu.statusInfo,                  // 현황정보
        dashboard: SDMSResource.ID.menu.dashboard,                    // 대시보드
        event: SDMSResource.ID.menu.event,                            // 이벤트 정보
        manualReport: SDMSResource.ID.menu.manualReport,              // 수동신고
        detailInfo: SDMSResource.ID.menu.detailInfo,                  // 공장동/공장/설비 정보
        cctvInfo: SDMSResource.ID.menu.cctvInfo,                      // CCTV
        alarmCCTVInfo: SDMSResource.ID.menu.alarmCCTVInfo,            // 알람 CCTV
        editMode_poi: SDMSResource.ID.menu.editMode_poi,              // 편집모드_POI
        editMode_fakeWall: SDMSResource.ID.menu.editMode_fakeWall,    // 편집모드_가벽
        editMode_areaName: SDMSResource.ID.menu.editMode_areaName,    // 편집모드_구역명편집
        editMode_addPoi: SDMSResource.ID.menu.editMode_addPoi,        // 편집모드_추가 POI 목록
        editMode_cctvMapping: SDMSResource.ID.menu.editMode_cctvMapping,    // 편집모드_CCTV 매핑
        equipmentAnalysis: SDMSResource.ID.menu.equipmentAnalysis,
        equipmentDetailInfo: SDMSResource.ID.menu.equipmentDetailInfo,
        equipmentChartDetailInfo: SDMSResource.ID.menu.equipmentChartDetailInfo,
    }

    // 편집모드 메뉴
    const EDIT_MODE_MENU = [
        SDMSResource.ID.menu.editMode_poi,
        SDMSResource.ID.menu.editMode_fakeWall,
        SDMSResource.ID.menu.editMode_areaName,
    ];

    const [showPopups, setShowPopups] = useState({});
    const [popupStateValue, setPopupStateValue] = useState({});
    const [visibleSensorTypes, setVisibleSensorTypes] = useState(PoiManager.getOriginVisibleSensorTypes());
    const [sensorAlarm, _setSensorAlarms] = useState({ alarms: [], selectedAlarm: null });
    const [spatialManager, setSpatialManager] = useState(new SpatialManager());
    const [models, setModels] = useState({ siteBuildingGroupList: null, currentSiteNo: null, currentBuildingGroupNo: null, currentBuildingNo: null, currentZoneNo: null, currentZoneName: null, backToOrigin: false, gltfOptions: {} });
    const [editMode, setEditMode] = useState({ isEditMode: false, parameter: null, selectedMenu: SDMSResource.ID.menu.editMode_poi });
    const [controlMode, setControlMode] = useState(SDMSResource.controlMode.integrated);

    const [showEventDashboard, setShowEventDashboard] = useState(false);    // 이벤트 대시보드 팝업
    const [showEditAddPoi, setShowEditAddPoi] = useState(false); 
    const [showEditCCTVMapping, setShowEditCCTVMapping] = useState(false); 

    const [showNavBar, setShowNavBar] = useState(false);
    const [autoRotation, setAutoRotation] = useState(false);

    const [selectedStatusInfo, setSelectedStatusInfo] = useState({
        buildingGroupNo: null,
        buildingNo: null,
        zoneNo: null,
        showSensorTypes: false,
        sensorTypeCode: null,
        sensorNo: null
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
    const selFcltyInfoRef = useRef({ fcltyNo: null, zoneNo: null, useFlow: true });
    const [refreshFcltyInfo, setRefreshFcltyInfo] = useState(false);

    const [selected3DInfo, setSelected3DInfo] = useState({
        buildingGroup: null,
        building: null,
        zone: null,
        facility: null
    });

    const [confirmMessage, setConfirmMessage] = useState({
        visible: false,
        type: null,
        messages: [""],
        buttons: ["확인"],
        onClickButton: null
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

    if (!editModeManagerRef.current) {
        editModeManagerRef.current = new EditModeManager();
        editModeManagerRef.current.onChange = onChangedEdit;
    }

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
        pickSetting(initialCommon, "MoveDisplayAlarm", "2")
    );

    const moveDisplayAlarmRef = useRef(moveDisplayAlarm);
    useEffect(() => {
        moveDisplayAlarmRef.current = moveDisplayAlarm;
    }, [moveDisplayAlarm]);

    useEffect(() => {
        SDMSController.StartWatchAlarmTimer();

        props.menuEvent.onClickLogo = onClickLogo;
        
        // 처음부터 뜰 메뉴
        let showPopupInfo = {};
        showPopupInfo[menu.statusInfo] = true;
        showPopupInfo[menu.dashboard] = false;
        showPopupInfo[menu.event] = false;
        showPopupInfo[menu.manualReport] = false;
        showPopupInfo[menu.detailInfo] = false;
        showPopupInfo[menu.cctvInfo] = false;
        showPopupInfo[menu.alarmCCTVInfo] = false;
        showPopupInfo[menu.editMode_poi] = true;
        showPopupInfo[menu.editMode_fakeWall] = false;
        showPopupInfo[menu.editMode_areaName] = false;
        showPopupInfo[menu.equipmentAnalysis] = false;
        showPopupInfo[menu.equipmentDetailInfo] = false;
        showPopupInfo[menu.equipmentChartDetailInfo] = false;
        setShowPopups(showPopupInfo);

        request3DOptions();

        // SDMS 컴포넌트 마운트 시, 저장된 위치 값 호출
        getPopupState();

        const unsubscribe = store.subscribe(() => {
            const data = store.getState();

            if (data.actionType === 'SENSOR_ALARM') {
                changeAlarm(data.sensorAlarm);
            }
            else if (data.actionType === "WORKERS") {
                WorkerManager.setWorkers(data.workers);
            }
        });

        // MoveDisplayAlarm, UseAlarmSound 판별용
        const unsubscribeSettings = SettingsStore.subscribe(() => {
            const data = SettingsStore.getState();
            if (data.actionType === 'COMMON_SETTINGS') {
                setCommonSettings(data.commonSettings);

                const nextUseAlarmSound = pickSetting(data.commonSettings, "UseAlarmSound", true);
                const nextMoveDisplayAlarm = pickSetting(data.commonSettings, "MoveDisplayAlarm", "2");

                setUseAlarmSound(nextUseAlarmSound);
                setMoveDisplayAlarm(nextMoveDisplayAlarm);
            } else if (data.actionType === 'RESET_POPUP') {
                resetPopupState(data.popupState);
            }
        });

        return () => {
            unsubscribe();
            unsubscribeSettings();
            SDMSController.stopWatchAlarmTimer();
        }
    }, []);

    const handleToast = (message) => {
        onShowToast(message);
    };

    useEffect(() => {
        const mgr = editModeManagerRef.current;
        if (!mgr) return;

        mgr.setMessageHandler?.(handleToast);

        return () => {
            mgr.setMessageHandler?.(null);
        };
    }, [handleToast]);

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

    const setSensorAlarms = (alarms, selectedAlarm) => {
        if (selectedAlarm) {
            selectedAlarm.movedAlarm = false;
        }

        _setSensorAlarms({ alarms, selectedAlarm });
    }

    const makeSensorAlarms = (alarms, selectedAlarm) => {
        if (selectedAlarm) {
            // 알람 선택에 의하여 해당 공간으로 이동한 상태인가?
            if (selectedAlarm.movedAlarm === undefined) {
                // 알람 발생에 의한 자동이동을 막는다.
                // 자동 이동시키려면 false로 바꾸면 된다.
                const moveDisplayAlarmValue = moveDisplayAlarmRef.current;
                const moveDisplayAlarmNo = parseInt(moveDisplayAlarmValue, 10);

                if (Number.isFinite(moveDisplayAlarmNo)) {
                    // 2이면 자동이동 금지
                    selectedAlarm.movedAlarm = moveDisplayAlarmNo !== 2;
                } else {
                    selectedAlarm.movedAlarm = true;
                }
            }
        }

        return {
            alarms,
            selectedAlarm
        };
    }

    const changeAlarm = async (data) => {
        if (data) {
            // data.dtTime을 내림차순으로 정렬
            data.sort((a, b) => new Date(b.dtTime) - new Date(a.dtTime));

            if (!showPopups[menu.event]) setVisiblePopups(menu.event, true);

            const selectedAlarm = checkSelectedAlarm(data);
            _setSensorAlarms(makeSensorAlarms(data, selectedAlarm));
            
            const onAlarms = data?.filter(alarm => alarm.isAlarm) || [];
            if (onAlarms.length > 0) setShowEventDashboard(true);
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

    const requestSensorList = () => {
        if (!sensorTypes) {
            return null;
        }

        const sensorList = {};

        for (const sensorType of sensorTypes) {
            sensorList[sensorType.sensorTypeName] = sensorType.sensors;
        }

        return sensorList;
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
            }));
        }
    };

    // 드래그로 선택된 팝업과 나머지 팝업의 z-index를 조절한다. (선택된 팝업이 앞으로 나오도록)
    const setActiveDragPopup = (popupType) => {
        // CCTV 팝업창이 제대로 동작하지 않아 제이쿼리 방식으로 수정 - K.D.R
        for (const key in SDMSResource.popupLayer) {
            const layerName = SDMSResource.popupLayer[key];

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
        onSelectBuilding({ buildingNo: zone.buildingNo }, zone);

        if (zone) {
            setModels({
                siteBuildingGroupList: models.siteBuildingGroupList,
                currentSiteNo: zone.siteNo,
                currentBuildingGroupNo: zone.buildingGroupNo,
                currentBuildingNo: zone.buildingNo,
                currentZoneNo: zone.zoneNo,
                currentZoneName: zone.displayText,
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
            parameter: editMode.parameter,
            selectedMenu: SDMSResource.ID.menu.editMode_poi
        });
    }

    const getZoneName = () => {
        if (!models.currentZoneName || controlMode === SDMSResource.controlMode.equipment) return null;

        return <p style={{ 
                    position: 'absolute', 
                    bottom: '12px', 
                    right: controlMode === SDMSResource.controlMode.integrated && !editMode.isEditMode ? '92px' : '20px', 
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

            if (!showPopups[menu.detailInfo]) setVisiblePopups(menu.detailInfo, true);
        }
        else {
            handleToast(message);
        }
    }

    const onSelectFacility = async (facilityName) => {
        const [success, message, result] = await SDMSController.requestFacilityData(facilityName);

        if (success) {
            setSelected3DInfo({ 
                buildingGroup: null,
                building: null,
                zone: null,
                facility: result
            });

            if (!showPopups[menu.detailInfo]) setVisiblePopups(menu.detailInfo, true);
        }
        else {
            handleToast(message);
        }
    }

    const handleEditMode = (isEditMode) => {
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
                next[SDMSResource.ID.menu.editMode_poi] = true;
                next[SDMSResource.ID.menu.editMode_fakeWall] = false;
                next[SDMSResource.ID.menu.editMode_areaName] = false;
    
                return next;
            });
        }
        else {
            handleToast("편집 모드로 전환되었습니다");
        }

        setEditMode({ isEditMode: isEditMode, parameter: null, selectedMenu: SDMSResource.ID.menu.editMode_poi });
    }

    const handleControlMode = (mode, value) => {
        if (mode === SDMSResource.controlMode.editMode) {
            handleEditMode(value);

            if (!value) {
                setControlMode(SDMSResource.controlMode.integrated);
                return;
            }
        }
        else if (mode === SDMSResource.controlMode.equipment) {
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

            handleToast("설비 모드로 전환되었습니다");
        }
        else if (mode === SDMSResource.controlMode.simulation) {
            // 시뮬레이션 모드를 선택하면 외부영역으로 이동
            onClickLogo();

            handleToast("누출 확산 시뮬레이션 모드로 전환되었습니다");
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
            if (controlMode === SDMSResource.controlMode.equipment) {
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

    const handleChangeBuildingGroup = (val, buildingGroupOptions) => {
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
    };

    const handleChangeArea = val => {
        const value = getValueFromChange(val);
        if (value === "") return;
        setSelectedSimulationInfo(prev => ({ ...prev, area: value }));
    };

    const handleChangeWindDirection = (direction, label) => {
        setSelectedSimulationInfo(prev => ({ ...prev, windDirection: direction, windDirectionName: label }));
    };

    const handleChangeWindSpeed = speed => {
        setSelectedSimulationInfo(prev => ({ ...prev, windSpeed: speed }));
    };

    const doSimulation = (buildingNo, materialName, targetLocation, windDir, windSpeed) => {
        const _3dMaster = _3dMasterRef.current;
        if (!_3dMaster?.cfdLoader) {
            console.log("!_3dMaster.cfdLoader");
            return;
        } 

        _3dMaster.cfdLoader.loadScenario(_3dMaster, materialName, buildingNo, targetLocation, windDir, windSpeed);
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
        setSelectedSimulationInfo({
            buildingGroup: "",
            buildingGroupName: "",
            materialName: "",
            area: "",
            windDirection: null,
            windDirectionName: "",
            windSpeed: null,
        });

        hideSimulation();
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

    const setFcltyFlow = (value) => {
        if (selFcltyInfoRef.current.useFlow !== value) {
            selFcltyInfoRef.current.useFlow = value;

            setRefreshFcltyInfo(!refreshFcltyInfo);
        }
    }

    const getSensorServerStatus = (sensorType) => {
        const server = sensorServers?.find(
            (s) => s.sensor_server_ty_code === sensorType
        );

        if (!server) return null;

        // cnnc_sttus가 false일 때만 연결 비정상, 그 외에는 연결 정상
        return server.cnnc_sttus !== false;
    };

    const getPopupUI = () => {
        if (controlMode === SDMSResource.controlMode.simulation || controlMode === SDMSResource.controlMode.equipment) return;

        let popups = [];

        if (!editMode.isEditMode && showPopups[menu.statusInfo]) {
            popups.push(
                <StatusInfo key='sdms_popup_statusInfo'
                    popupType={SDMSResource.popupLayer.statusInfo}
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
                    showPopups={showPopups}
                    setSelectedCCTVInfo={setSelectedCCTVInfo}
                    sensorServers={sensorServers}
                    getSensorServerStatus={getSensorServerStatus}
                />
            );
        }

        if (!editMode.isEditMode && showPopups[menu.manualReport]) {
            popups.push(
                <ManualReport key='sdms_popup_manualReport'
                    popupType={SDMSResource.popupLayer.manualReport}
                    popupState={popupStateValue.manualReport}
                    setVisiblePopups={setVisiblePopups}
                    setActiveDragPopup={setActiveDragPopup}
                    setPopupState={setPopupState}
                    buildingGroupList={models.siteBuildingGroupList}
                    siteNo={models.currentSiteNo}
                />
            );
        }

        if (!editMode.isEditMode && showPopups[menu.event]) {
            popups.push(
                <Event key='sdms_popup_event'
                    popupType={SDMSResource.popupLayer.event}
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
                    popupType={SDMSResource.popupLayer.dashboard}
                    popupState={popupStateValue.dashboard}
                    setVisiblePopups={setVisiblePopups}
                    setActiveDragPopup={setActiveDragPopup}
                    setPopupState={setPopupState}
                    showConfirmDialog={showConfirmDialog}
                    sensorTypes={sensorTypes}
                    sensorAlarm={sensorAlarm}
                    sensorServers={sensorServers}
                    getSensorServerStatus={getSensorServerStatus}
                />
            );
        }

        if (showPopups[menu.detailInfo]) {
            popups.push(
                <DetailInfo key='sdms_popup_detailInfo'
                    popupType={SDMSResource.popupLayer.detailInfo}
                    popupState={popupStateValue.detailInfo}
                    setVisiblePopups={setVisiblePopups}
                    setActiveDragPopup={setActiveDragPopup}
                    setPopupState={setPopupState}
                    selected3DInfo={selected3DInfo}
                />
            );
        }

        if (showPopups[menu.cctvInfo]) {
            popups.push(
                <CCTVInfo key='sdms_popup_cctvInfo'
                    popupType={SDMSResource.popupLayer.cctvInfo}
                    popupState={popupStateValue.cctvInfo}
                    setVisiblePopups={setVisiblePopups}
                    setActiveDragPopup={setActiveDragPopup}
                    setPopupState={setPopupState}
                    spatialManager={spatialManager}
                    selectedCCTVInfo={selectedCCTVInfo}
                />
            );
        }

        if (showPopups[menu.alarmCCTVInfo]) {
            popups.push(
                <AlarmCCTVInfo key='sdms_popup_alarmCCTVInfo'
                    popupType={SDMSResource.popupLayer.alarmCCTVInfo}
                    popupState={popupStateValue.alarmCCTVInfo}
                    setVisiblePopups={setVisiblePopups}
                    setActiveDragPopup={setActiveDragPopup}
                    setPopupState={setPopupState}
                    alarmCCTVList={alarmCCTVList}
                    setAlarmCCTVList={setAlarmCCTVList}
                    spatialManager={spatialManager}
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
                changeEditMode={changeEditMode}
                onChangedEdit={onChangedEdit}
                sensorAlarms={sensorAlarm.alarms}
                selectedAlarm={sensorAlarm.selectedAlarm}
                moveToBuildingGroup={moveToBuildingGroup}
                moveToZone={moveToZone}
                editModeManager={editModeManagerRef.current}
                set3dMaster={set3dMaster}
                onSelectBuildingGroup={onSelectBuildingGroup}
                onSelectBuilding={onSelectBuilding}
                onSelectFacility={onSelectFacility}
                faModel={faModelRef.current}
                setSelectedCCTVInfo={setSelectedCCTVInfo}
                showPopups={showPopups}
                setShowPopups={setShowPopups}
                setVisiblePopups={setVisiblePopups}
                selFcltyInfo={selFcltyInfoRef.current}
                refreshFcltyInfo={refreshFcltyInfo}
                controlMode={controlMode}
                selectedSimulationInfo={selectedSimulationInfo}
                handleChangeBuildingGroup={handleChangeBuildingGroup}
                handleChangeArea={handleChangeArea}
                handleCfdFrameSeconds={handleCfdFrameSeconds}
            />
            {
                (!editMode.isEditMode && showEventDashboard) &&
                    <EventDashboard
                        sensorAlarm={sensorAlarm}
                        setShowEventDashboard={setShowEventDashboard}
                        setVisiblePopups={setVisiblePopups}
                        setSensorAlarms={setSensorAlarms}
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
                        selectedMenu={editMode.selectedMenu}
                        showEditAddPoi={showEditAddPoi}
                        setShowEditAddPoi={setShowEditAddPoi}
                        showEditCCTVMapping={showEditCCTVMapping}
                        setShowEditCCTVMapping={setShowEditCCTVMapping}
                        editModeManager={editModeManagerRef.current}
                        handleToast={handleToast}
                        showConfirmDialog={showConfirmDialog}
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
                (editMode.isEditMode && showEditAddPoi) &&
                    <EditAddPoi
                        popupType={SDMSResource.popupLayer.editMode_addPoi}
                        popupState={popupStateValue.editMode_addPoi}
                        setVisiblePopups={setVisiblePopups}
                        setActiveDragPopup={setActiveDragPopup}
                        setPopupState={setPopupState}
                        setShowEditAddPoi={setShowEditAddPoi}
                    />
            }
            {
                (editMode.isEditMode && showEditCCTVMapping) &&
                    <EditCCTVMapping
                        popupType={SDMSResource.popupLayer.editMode_cctvMapping}
                        popupState={popupStateValue.editMode_cctvMapping}
                        setVisiblePopups={setVisiblePopups}
                        setActiveDragPopup={setActiveDragPopup}
                        setPopupState={setPopupState}
                        setShowEditCCTVMapping={setShowEditCCTVMapping}
                    />
            }

            {/* 시뮬레이션 관련 UI */}
            {
                controlMode === SDMSResource.controlMode.simulation &&
                    <SimulationToolbar
                        handleControlMode={handleControlMode}
                        resetSimulation={resetSimulation}
                    />
            }
            {
                controlMode === SDMSResource.controlMode.simulation &&
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

            {/* 설비모드 관련 UI */}
            {
                controlMode === SDMSResource.controlMode.equipment &&
                    <EquipmentToolbar
                    handleControlMode={handleControlMode}
                    faModel={faModelRef.current}
                    selFcltyInfo={selFcltyInfoRef.current}
                    moveToZone={moveToZone}
                    />
            }
            {
                controlMode === SDMSResource.controlMode.equipment &&
                    <EquipmentInfo
                    faModel={faModelRef.current}
                    selFcltyInfo={selFcltyInfoRef.current}
                    setFcltyZone={setFcltyZone}
                    setFcltyFlow={setFcltyFlow}
                    />
            }
            {
                (controlMode === SDMSResource.controlMode.equipment && showPopups[menu.equipmentDetailInfo]) &&
                    <EquipmentDetailInfo
                        popupType={SDMSResource.popupLayer.equipmentDetailInfo}
                        popupState={popupStateValue.equipmentDetailInfo}
                        setVisiblePopups={setVisiblePopups}
                        setActiveDragPopup={setActiveDragPopup}
                        setPopupState={setPopupState}
                        showPopups={showPopups}
                    />
            }
            {
                (controlMode !== SDMSResource.controlMode.equipment && showPopups[menu.equipmentAnalysis]) &&
                <EquipmentAnalysis key='sdms_popup_equipmentAnalysis'
                    type={'draggable'}
                    popupType={SDMSResource.popupLayer.equipmentAnalysis}
                    popupState={popupStateValue.equipmentAnalysis}
                    setVisiblePopups={setVisiblePopups}
                    setActiveDragPopup={setActiveDragPopup}
                    setPopupState={setPopupState}
                    handleControlMode={handleControlMode}
                    showPopups={showPopups}
                />
            }
            {
                (controlMode === SDMSResource.controlMode.equipment && showPopups[menu.equipmentChartDetailInfo]) &&
                    <EquipmentChartDetailInfo
                        popupType={SDMSResource.popupLayer.equipmentChartDetailInfo}
                        popupState={popupStateValue.equipmentChartDetailInfo}
                        setVisiblePopups={setVisiblePopups}
                        setActiveDragPopup={setActiveDragPopup}
                        setPopupState={setPopupState}
                    />
            }
            {
                controlMode === SDMSResource.controlMode.equipment &&
                <EquipmentAnalysisFixed />
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
                />
            }
        </div>
    );
}

export default withRouter(SDMS);