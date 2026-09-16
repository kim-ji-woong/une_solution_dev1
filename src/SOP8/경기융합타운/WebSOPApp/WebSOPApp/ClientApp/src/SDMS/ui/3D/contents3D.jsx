import React, { Component } from 'react';
import * as THREE from "three/build/three.module.js";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";
import { DRACOLoader } from "three/examples/jsm/loaders/DRACOLoader.js";
import { FBXLoader } from "three/examples/jsm/loaders/FBXLoader.js";
import SDMSMainMenu from '../sdmsMainMenu';
import SDMS from '../sdms';
import Geometry from '../../../Common/util/Geometry.js';
import { SDMSController } from '../../services/sdmsController';
import { SDMSDataManager } from '../../services/sdmsDataManager';
import SettingsStore from '../../../Settings/settingsStore';
import SettingResource from '../../../Settings/resource/id';
import { AccountController } from '../../../Account/services/accountController';

import $ from 'jquery';
import { Vector3 } from 'three';
import SdmsResource from '../../resource/id';
import Vertex2D from '../../../Common/util/Vertex2D';
import { TextPOIManager } from './textPOIManager';
import { DataInfo } from './dataInfo';
import { POIManager } from './poiManager';
import { FakeWallManager } from './fakeWallManager';
import { EquipZoneAreaManager } from './equipZoneAreaManager';
import { SpatialManager } from './spatialManager';
import { EditModeManager } from './editModeManager';
import Toolbar from '../popups/toolbar';
import CCTVInfo from '../popups/cctvInfo';

import { WalkingAvatar } from '../components/walkingAvatar';

import ProgressBar from './progressBar';
import ProjectResource from '../../../Root/resource/id';
import { AnimationModel } from '../components/animationModel';
import { OptionManager } from './options/optionManager.js';

import { Contents3DComponent } from '../../styled/sdmsPopupsStyled.js';
import { FloorBoundingBoxManager } from './floorBoundingBoxManager';

export class Contents3D extends Component {
    static Mode_Outdoor_All = 0;
    static Mode_Outdoor_Part = 1;
    static Mode_Indoor = 2;

    static ExitArrowGroupTag = "arrow_Group";
    static ExitArrowBeginTag = "arrow_Y";
    static ExitArrowEndTag = "arrow_R";

    // 두번째 비상구 화살표 태그
    static ExitSmallArrowGroupTag = "arrow_small_Group";    
    static ExitArrowFirstTag = "arrow_a";
    static ExitArrowSecondTag = "arrow_b";
    static ExitArrowThirdTag = "arrow_c";
    static ExitArrowFourthTag = "arrow_d";

    // multi site 옵션일때 Camera 이동후 이전 모델을 끌것인가? (default: true)
    static MoveNHide = false;

    static FacilityHeadTag = "equipment-";

    static Alarm_Model = ["", "Alarm_Level1.glb", "Alarm_Level2.glb", "Alarm_Level3.glb"];

    static NO_ALARM = 0;
    // 관심
    static ALARM_1 = 1;
    // 주의
    static ALARM_2 = 2;
    // 경계
    static ALARM_3 = 3;
    // 심각
    static ALARM_4 = 4;

    static Edit_Mode_None = 0;
    static Edit_Mode_MovePOI = 1;
    static Edit_Mode_FakeWall = 2;
    static Edit_Mode_Text = 3;
    static Edit_Mode_CCTVGroup = 4;

    // 아무 입력없이 몇 밀리세컨드가 지나면 카메라를 회전시킬 것인가?
    //static CAMERA_IDLE_TIME = 1000 * 10;
    static CAMERA_IDLE_TIME = 1000 * 3000;
    // 즉시회전 버튼을 Click한 뒤 마우스가 화면을 빠져나가는 동안
    // 즉시회전이 풀리지 않도록 한다.
    static AUTO_ROTATION_IDLE_TIME = 3 * 1000;

    constructor(props) {
        super(props);

        this.props = props;
        this.ref3D = React.createRef();
        this.refQuickButton = React.createRef();
        this.refEditableInput = React.createRef();

        this.state =
        {
            loading: false,
            /*mode: this.props.command.mode,
            modeParameter: this.props.command.modeParameter,*/
            prevInstance: this,
            prevProps: this.props,
            //visibleSensorTypes: [SDMSMainMenu.Fire_Sensor, SDMSMainMenu.CCTV_Type],
            alarm: Contents3D.NO_ALARM,
            alarmType: null,            // 알람 센서 타입 - 알람 소리 구분용도
            alarmTime: null,            // 알람 일정 시간 후 소리off 구분용도
            alarmSoundOff: false,       // 알람 소리 자동off 여부 확인
            idleTime: Contents3D.CAMERA_IDLE_TIME / 60000,         // 기존 CAMERA_IDLE_TIME 값
            useIdleTime: true,
            //moveDisplayAlarm: SettingResource.moveDisplayAlarm.moveAlarm,
            progressActive: true,
            progressValue: 0,
            editableInput: false,
            commonSettings: {},
            turnStart: SettingsStore.getState().turnStart,
            useAlarmTurn: SettingsStore.getState().useAlarmTurn,
        };

        this.indoorModelCount = 0;
        this.indoorModelCountTemp = 0;
        this.clock = new THREE.Clock();
        this.boundingBoxModel = null;
        //this.boundingBoxEdge = null;
        this.useBoundingBox = true;//this.props.command.mode !== Contents3D.Mode_Indoor;
        this.renderer = null;
        this.scene = null;
        this.camera = null;
        this.dirLight = null;
        this.controls = null;
        this.currentModel = null;
        this.currentIndoorModel = null;
        this.siteOutdoorModels = {};
        //this.outdoorModels = [];
        this.outdoorFacilities = {};
        this.internalModels = {};
        this.internalTryModels = {};
        /*this.spriteMaterials = {};
        this.sensorPOIs = {};*/

        this.prevIndoorModel = null;
        this.movingCamera = null;

        this.blinkDatas = [];
        this.movingDatas = [];

        this.outdoorModelTotalCount = 0;
        this.outdoorModelTotalCountTemp = 0;
        this.outdoorModelCount = -1;
        this.completeOutdoorModelCount = -1;

        this.alarmAnimationMixers = [[], [], [], []];
        this.alarmModels = [[], [], [], []];

        this.prevIndoorFacility = null;

        this.pickPOI = null;
        //this.editMode = Contents3D.Edit_Mode_None;
        //this.movePOIMode = false;
        this.perspectiveCamera = null;
        this.orthoGraphicCamera = null;
        this.perspectiveControlOrigin = new Vector3(0, 0, 0);

        this.lastMouseMoveTime = new Date();
        // 즉시회전 명령을 받은 시간
        this.lastAutoRotationCommandTime = new Date();
        // 회전각, 회전반경
        this.cameraRotation = null;
        // 1초에 이만큼 회전하라(radian)
        this.cameraRotationPerSecond = 0.0276854928;
        // 카메라가 자동 회전하기 전에 팝업창들의 상태(Show/Hide)
        this.visiblePopups = {};

        this.textPOIManager = new TextPOIManager(props.getBuildingGroupWorkerInfo, props.getBuildingWorkerInfo);
        this.poiManager = new POIManager(this);
        this.fakeWallManager = new FakeWallManager(this);
        this.equipZoneAreaManager = new EquipZoneAreaManager();

        this.selectedFacility = null;
        this.facilityMaps = {};
        this.loadingSiteIDs = [];

        this.useEditModeMovingCamera = true;

        if (SDMS.UseWalkingAvatar) {
            this.walker = new WalkingAvatar();
        }

        // 모델 파일별 Animation
        // Key : ModelFile Name
        // Value : AnimationModel
        this.modelAnimations = {};
        this.currentAnimationModels = [];

        this.prevOutdoorCameraViewport = {
            position: [],
            rotation: [],
            quaternion: [],
            fov: null,
            near: null,
            far: null
        };

        // 실내모델 파일 로딩이 끝나지 않아서 보여주지 못했던 알람정보
        this.lazyAlarmData = {};
        // 실내모델 파일 로딩이 끝나지 않아서 보여주지 못했던 층정보
        this.lazyIndoormData = {};

        // 실내모델링이 로딩되지 않을 경우, 카메라 첫 외곽 이동 여부 체크 >> 타이밍 체크
        this.FirstIndoorNotOnMemoryCameraMove = false;

        this.initIdleTime();
        //this.initMoveDisplayAlarm();

        this.setDirectionalLightPower();

        //this.stats = null; // fps 확인

        SettingsStore.subscribe(function () {
            let data = SettingsStore.getState();

            if (data.actionType === 'SETTINGS') {
                this.setIdleTime(data.idleTime);
                this.setTurnStart(data.turnStart);
                this.setUseAlarmTurn(data.useAlarmTurn);
            } else if (data.actionType === 'SDMS_COMMON_SETTINGS') {
                this.changeSDMSCommonSettings(data.sdmsCommonSettings);
            }
        }.bind(this));

        this.initSdmsCommonSettings();
    }

    initSdmsCommonSettings() {
        let data = SettingsStore.getState().sdmsCommonSettings;

        if (data === null || data === undefined)
            return;

        this.state.commonSettings = data;
    }

    setDirectionalLightPower() {
        this.directionalLightPower = 6;
    }

    componentDidMount() {
        window.progressbar = this;
        const _3dOptions = this.props._3dOptions;
        
        if (_3dOptions.outdoorModel) {
            this.init();
            Contents3D.animate(this);

            this.loadingSiteIDs.push(this.props.currentSiteID);

            const modelFiles = this.getOutdoorModelFiles(_3dOptions);
            this.loadOutdoorModelFiles(modelFiles, _3dOptions, true);

            this.resizeMethod = () => Contents3D.onWindowResize(this.camera, this.renderer);
            window.addEventListener('resize', this.resizeMethod, false);
            window.addEventListener('keydown', this.onKeyDown, false);
        }

        // 하단 메뉴 버튼 관련
        this.popupBtm();

        this.fakeWallManager.setEditModeManager(this.props.editModeManager);

        if (this.props.editModeManager) {
            this.props.editModeManager.setContents3D(this);
        }

        if (this.textPOIManager && this.props.site3dOptions && this.props.currentSiteID) {
            this.textPOIManager.updateWorker(this.props.site3dOptions[this.props.currentSiteID]);
        }

        this.equipZoneAreaManager.setEditModeManager(this.props.editModeManager);

        // 구역평가 옵션 설정
        this.textPOIManager.setUseEquipZoneAssess(Contents3D.useEquipZoneAssess());
        this.equipZoneAreaManager.setUseEquipZoneAssess(Contents3D.useEquipZoneAssess());
    }

    componentDidUpdate() {
        if (this.textPOIManager && this.props.site3dOptions && this.props.currentSiteID) {
            this.textPOIManager.updateWorker(this.props.site3dOptions[this.props.currentSiteID]);
        }
    }

    componentWillUnmount() {
        window.removeEventListener('resize', this.resizeMethod);
        window.removeEventListener('keydown', this.onKeyDown);
        this.detach3D();
    }

    getOutdoorModelFiles(_3dOptions) {
        const modelFiles = [];

        if (_3dOptions?.outdoorModel?.file)
            modelFiles.push(_3dOptions.outdoorModel.file);

        for (const buildingGroupName in _3dOptions.indoorModels) {
            const buildingGroup = _3dOptions.indoorModels[buildingGroupName];

            if (buildingGroup.file) {
                modelFiles.push(buildingGroup.file);
            }
        }

        return modelFiles;
    }

    getSensor(zoneID, sensorType, sensorID) {
        let _3dOptions = this.props._3dOptions;
        // 멀티 사이트일 경우
        if (this.props.multiSite)
            _3dOptions = SpatialManager.get3dOptionsFromZoneID(zoneID, this.props.site3dOptions);

        let zone = _3dOptions.zones[zoneID];

        if (!zone) {
            zone = _3dOptions.outdoorZones[zoneID];
        }

        if (zone) {
            const sensors = zone.sensors[sensorType];

            if (sensors) {
                const sensorCount = sensors.length;

                for (let i = 0; i < sensorCount; i++) {
                    const sensor = sensors[i];

                    if (sensor.id === sensorID) {
                        return sensor;
                    }
                }
            }
        }

        return null;
    }

    getPOISensor(zoneID, sensorType, sensorName) {
        const _3dOptions = SpatialManager.get3dOptionsFromZoneID(zoneID, this.props.site3dOptions);

        if (!_3dOptions?.zones) {
            return null;
        }

        let zone = _3dOptions.zones[zoneID];

        if (!zone) {
            zone = _3dOptions.outdoorZones[zoneID];
        }

        if (zone) {
            const sensors = zone.sensors[sensorType];

            if (sensors) {
                const sensorCount = sensors.length;

                for (let i = 0; i < sensorCount; i++) {
                    const sensor = sensors[i];

                    if (sensor.name === sensorName && sensor.x !== null && sensor.y !== null && sensor.z !== null) {
                        return sensor;
                    }
                }
            }
        }

        return null;
    }

    static getDerivedStateFromProps(props, state) {
        if (props === state.prevProps) {
            return state;
        }

        let editableInput = state.editableInput;

        if (props.command && props.command.menu !== SDMSMainMenu.Menu_None) {
            editableInput = false;
            state.prevInstance.backToOriginPickPOI();
        }

        /*const movingCamera = */Contents3D.processMenu(props, state);

        return {
            loading: state.loading,
            /*mode: mode,
            modeParameter: modeParameter,*/
            prevInstance: state.prevInstance,
            prevProps: props,
            editableInput: editableInput
        };
    }

    backToOriginPickPOI() {
        const poi = this.pickPOI;

        if (!poi) {
            return;
        }

        const obj = poi.object ? poi.object : poi;

        if (obj.userData?.origin) {
            obj.position.x = obj.userData.origin.x;
            obj.position.z = obj.userData.origin.z;
        }

        this.pickPOI = null;
    }

    static processMenu(props, state) {
        if (props.isEditMode) {
            Contents3D.editModeProcessMenu(props, state);
            return;
        }
        else {
            if (state.prevInstance.camera === state.prevInstance.orthoGraphicCamera && state.prevInstance.perspectiveCamera) {
                state.prevInstance.changeCamera(false);
            }
        }

        if (props.command) {
            if (props.command.menu == SDMSMainMenu.Menu_Save_BuildingGroup_Viewport) {
                state.prevInstance.saveViewport(props.command.menuParameter, props._3dOptions.indoorModels, props.command.menuParameter, null, null);
                state.prevInstance.changeCamera(false);
            }
            else if (props.command.menu == SDMSMainMenu.Menu_Save_Building_Viewport) {
                state.prevInstance.saveViewport(props.command.menuParameter, props._3dOptions.indoorModels, null, props.command.menuParameter, null);
                state.prevInstance.changeCamera(false);
            }
            else if (props.command.menu == SDMSMainMenu.Menu_Debugging) {
                state.prevInstance.hideBoundingBoxes(props._3dOptions.outdoorModel, props._3dOptions.buildingGroups, props._3dOptions.buildings);
            }
            else if (props.command.menu == SDMSMainMenu.Menu_Move_BuildingName) {
                const [buildingGroupName, buildingName, x, y, z] = props.command.menuParameter;
                state.prevInstance.moveBuildingNameText(buildingGroupName, buildingName, x, y, z);
            }
            else if (props.command.menu == SDMSMainMenu.Menu_Move_EquipZoneName) {
                const [zoneID, equipZoneID, equipZoneName, x, y, z] = props.command.menuParameter;
                state.prevInstance.textPOIManager.moveEquipZoneNameText(zoneID, equipZoneID, equipZoneName, x, y, z, state.prevInstance.postMoveEquipZoneNameText);
            }
            else if (props.command.menu == SDMSMainMenu.Menu_Move_Sensor) {
                const [sensorType, sensorID, zoneID, x, y, z] = props.command.menuParameter;
                state.prevInstance.poiManager.moveSensor(sensorType, sensorID, zoneID, x, y, z);
            }
            else if (props.command.menu == SDMSMainMenu.Menu_Add_Sensors) {
                const [sensorType, sensors, zoneID] = props.command.menuParameter;
                state.prevInstance.poiManager.removeSensors(null);
                state.prevInstance.poiManager.addSensors(sensorType, sensors, 1, zoneID);
            }
            else if (props.command.menu == SDMSMainMenu.Menu_Show_Alarm) {
                const [zoneID, sensorType, sensorID, alarmLevel, isAlarm] = props.command.menuParameter;

                // 기존 알람 표시 제거 및 해당 층에 대한 알람 표시- K.D.R
                state.prevInstance.hideAlarms();
                if (zoneID > 0) {
                    state.prevInstance.checkAlarms(zoneID);
                }

                state.prevInstance.showAlarm(zoneID, sensorType, sensorID, alarmLevel, isAlarm);
                //movingCamera = true;
            }
            else if (props.command.menu == SDMSMainMenu.Menu_Hide_Alarm) {
                state.prevInstance.hideAlarms();
            }
            else if (props.command.menu == SDMSMainMenu.Menu_Add_Alarm) {
                const [zoneID, sensorType, sensorID, alarmLevel, alarmTime] = props.command.menuParameter;
                state.prevInstance.addAlarm(zoneID, sensorType, sensorID, alarmLevel, alarmTime);
            }
            else if (props.command.menu == SDMSMainMenu.Menu_Remove_Alarm) {
                const [sensorType, sensorID, alarmLevel] = props.command.menuParameter;
                state.prevInstance.removeAlarm(sensorType, sensorID, alarmLevel);
            }
            else if (props.command.menu == SDMSMainMenu.Menu_MoveTo_BuildingGroup) {
                const buildingGroupName = props.command.menuParameter;

                if (buildingGroupName) {
                    if (Array.isArray(buildingGroupName) === false) {
                        state.prevInstance.moveToBuildingGroup(buildingGroupName);
                    }
                    else if (buildingGroupName.length > 0) {
                        state.prevInstance.moveToBuildingGroup(buildingGroupName[0]);
                    }
                }
                else {
                    props.initOutdoorViewport();
                }
                //movingCamera = true;
            }
            else if (props.command.menu == SDMSMainMenu.Menu_MoveTo_Building) {
                const buildingName = props.command.menuParameter;
                state.prevInstance.moveToBuilding(buildingName);
                //movingCamera = true;
            }
            else if (props.command.menu == SDMSMainMenu.Menu_MoveTo_POI) {
                state.prevInstance.hideAlarms();

                const [zoneID, sensorType, sensorID, siteID] = props.command.menuParameter;
                state.prevInstance.moveToSensor(zoneID, sensorType, sensorID);
                state.prevInstance.showBuildingInfo(sensorType, sensorID, siteID);    // 정보창 띄우기 - K.D.R
                state.prevInstance.checkAlarms(zoneID, props.selectedPOI);
                //movingCamera = true;
            }
            else if (props.command.menu == SDMSMainMenu.Menu_MoveTo_Floor) {
                state.prevInstance.hideAlarms();

                const [buildingID, floorIndex] = props.command.menuParameter;

                if (buildingID !== undefined && buildingID !== null &&
                    floorIndex !== undefined && floorIndex !== null && isNaN(floorIndex) === false) {
                    const zoneID = state.prevInstance.moveToFloor(buildingID, floorIndex);

                    if (zoneID > 0) {
                        state.prevInstance.checkAlarms(zoneID);
                    }
                }
                else {
                    props.initOutdoorViewport();
                }
                //movingCamera = true;
            }
            else if (props.command.menu == SDMSMainMenu.Menu_MoveTo_Facility) {
                state.prevInstance.hideAlarms();

                const [zoneID, facilityID] = props.command.menuParameter;
                state.prevInstance.moveToFacility(zoneID, facilityID);
                state.prevInstance.checkAlarms(zoneID, props.selectedPOI);     // 현황정보에 설비를 클릭하여 이동시 알람표시가 뜨지 않아 추가 - K.D.R
            }
            else if (props.command.menu == SDMSMainMenu.Menu_Show_Outdoor) {
                if (state) {
                    const model = props.command.menuParameter;
                    state.prevInstance.goBackOutdoor(model, model.camera);
                }
            }
            else if (props.command.menu === SDMSMainMenu.Menu_Move_POI) {
                state.prevInstance.editMode = Contents3D.Edit_Mode_MovePOI;
                //state.prevInstance.movePOIMode = true;
                state.prevInstance.pickPOI = null;
                state.prevInstance.changeCamera(true);
            }
            else if (props.command.menu === SDMSMainMenu.Menu_FakeWall) {
                state.prevInstance.editMode = Contents3D.Edit_Mode_FakeWall;
                state.prevInstance.pickPOI = null;
                state.prevInstance.changeCamera(true);
            }
            else if (props.command.menu === SDMSMainMenu.Menu_ClearSelection) {
                state.prevInstance.poiManager.selectPOI(null, props.editMode, props.editModeParam);
            }
            else if (props.command.menu === SDMSMainMenu.Menu_MoveTo_Site) {
                state.prevInstance.moveToSite(props.command.menuParameter);
            }

            props.command.menu = SDMSMainMenu.Menu_None;
            props.command.menuParameter = null;
        }
    }

    moveToSite(parameter) {
        if (parameter || parameter.length >= 2) {
            const siteID = parameter[0];
            const isMovingCamera = parameter[1];

            const _3dOptions = this.props.site3dOptions[siteID];

            if (_3dOptions) {
                this.textPOIManager.setVisible(false, this.props.currentSiteID);
                this.equipZoneAreaManager.setZoneID(0);
                this.textPOIManager.hideEquipZoneSprites();
                this.poiManager.removeSensors(null);

                const model = _3dOptions.outdoorModel;

                // 외곽 모델링 카메라 이동 여부 확인
                if (isMovingCamera) {
                    // 사이트 이동 카메라 시간 단축
                    this.setMovingCamera(model.camera, Contents3D.Mode_Outdoor_All, { prevSiteID: this.props.currentSiteID, currentSiteID: siteID }, [0, 1]);
                    // 외곽 바닥 이미지 다시 불러오기
                    this.optionManager.onPrevChangeView(null, true, model.file);
                    // 현황정보 트리 닫기
                    this.props.onChangeBuildingGroup(null, SDMS.SelectedStatusInfoType.none);
                }
                    
                this.textPOIManager.updateOuterDatas(_3dOptions, this.poiManager);
            }
        }
    }

    setOutdoorModelVisible(siteID, visible) {
        const models = this.siteOutdoorModels[siteID];

        if (models) {
            const modelCount = models.length;

            for (let i = 0; i < modelCount; i++) {
                models[i].visible = visible;
            }
        }
    }

    checkAlarms(zoneID, selectedPOI) {
        if (!this.props.sensorAlarms) {
            return;
        }

        const alarms = [...this.props.sensorAlarms];
        const alarmCount = alarms.length;

        for (let i = 0; i < alarmCount; i++) {
            const alarm = alarms[i];

            if (alarm.isAlarm && alarm.zoneID === zoneID) {
                const [_zoneID, sensorType, sensorID, alarmLevel, isAlarm] = SDMS.getAlarmInfo(alarm);

                if (selectedPOI && selectedPOI.length >= 2 && selectedPOI[1] === sensorID) {
                    this.showAlarm(zoneID, sensorType, sensorID, alarmLevel, isAlarm, selectedPOI);
                }
                return;
            }
        }
    }

    static editModeProcessMenu(props, state) {
        if (state.prevInstance.camera !== state.prevInstance.orthoGraphicCamera) {
            state.prevInstance.changeCamera(true);

            // 알람효과 숨기기
            state.prevInstance.hideAlarms();
        }

        if (props.editMode === Contents3D.Edit_Mode_FakeWall) {
            state.prevInstance.fakeWallManager.setMode(props.editModeParam);
        }

        // 구역명 편집에서 구역명 편집 중 구역명 이동 버튼 클릭시 POI 선택해제 및 구역명 편집 텍스트 창 닫힘 - K.D.R
        if (props.editMode === Contents3D.Edit_Mode_Text &&
            props.editModeParam === TextPOIManager.Mode_MoveText) {
            state.prevInstance.visibleEditableInput(false);
        }

        if (props.command) {
            if (props.command.menu == SDMSMainMenu.Menu_MoveTo_Floor) {
                const [buildingID, floorIndex] = props.command.menuParameter;

                if (buildingID !== undefined && buildingID !== null &&
                    floorIndex !== undefined && floorIndex !== null && isNaN(floorIndex) === false) {
                    state.prevInstance.moveToFloor(buildingID, floorIndex);
                }
                else {
                    props.initOutdoorViewport();
                }
            }
            else if (props.command.menu == SDMSMainMenu.Menu_Show_Outdoor) {
                state.prevInstance.showOutdoorOrtho();
            }
            else if (props.command.menu === SDMSMainMenu.Menu_ClearSelection) {
                state.prevInstance.poiManager.selectPOI(null, props.editMode, props.editModeParam);
            }
            else if (props.command.menu == SDMSMainMenu.Menu_MoveTo_BuildingGroup) {
                const buildingGroupName = props.command.menuParameter;

                if (buildingGroupName && Array.isArray(buildingGroupName) === false) {
                    state.prevInstance.moveToBuildingGroup(buildingGroupName);
                }
                else {
                    props.initOutdoorViewport();
                }
            }
            else if (props.command.menu == SDMSMainMenu.Menu_MoveTo_POI) {
                const [zoneID, sensorType, sensorID, siteID] = props.command.menuParameter;

                state.prevInstance.showBuildingInfo(sensorType, sensorID, siteID);    // 정보창 띄우기 - K.D.R
            }

            props.command.menu = SDMSMainMenu.Menu_None;
            props.command.menuParameter = null;
        }
    }

    visibleEditableInput = (visible) => {
        let editableInput = this.state.editableInput;

        if (editableInput !== visible) {
            this.pickPOI = null;
            this.setState({ editableInput: visible });
        }
    }

    static rollbackOrthoCamera(contents3D) {
        contents3D.orthoGraphicCamera = contents3D.tempOrthoGraphicCamera;
        contents3D.tempOrthoGraphicCamera = undefined;

        if (contents3D.isIndoor() === false) {
            contents3D.showOutdoor(Contents3D.Mode_Outdoor_All);
        }

        contents3D._changeCamera(true);
    }

    static finishChangeToPerspective(contents3D) {
        if (contents3D.isIndoor() === false) {
            contents3D.showOutdoor(Contents3D.Mode_Outdoor_All);
        }

        contents3D.controls.update();

        contents3D.controls.enableRotate = true;
        contents3D.useBoundingBox = true;
    }

    changeCamera(orthoMode) {
        if (orthoMode) {
            if (this.useEditModeMovingCamera) {
                this.tempOrthoGraphicCamera = this.orthoGraphicCamera;
                this.orthoGraphicCamera = this.perspectiveCamera;

                this.camera = this.orthoGraphicCamera;
                this.controls.object = this.camera;
                this.perspectiveControlOrigin = new Vector3(this.controls.target.x, this.controls.target.y, this.controls.target.z);

                const orthoCameraData = this.getCurrentOrthoCameraData();

                if (!orthoCameraData) {
                    //this._changeCamera(orthoMode);
                    return;
                }

                const cameraOptions = {
                    far: this.camera.far,
                    fov: this.camera.fov,
                    near: this.camera.near,
                    position: orthoCameraData.position,
                    rotation: orthoCameraData.rotation,
                    quaternion: orthoCameraData.quaternion,
                    targetControl: orthoCameraData.targetControl
                };

                const postMoveParam = {
                    method: Contents3D.rollbackOrthoCamera,
                    methodParam: this
                };

                // 카메라 이동이 50% 이상 진행되면 빠르게 움직인다.
                this.setMovingCamera(cameraOptions, Contents3D.Mode_Indoor, postMoveParam, [0.5, 1]);
            }
            else {
                this._changeCamera(orthoMode);
            }
        }
        else {
            if (this.useEditModeMovingCamera) {
                this.camera = this.perspectiveCamera;
                this.camera.updateProjectionMatrix();
                this.controls.object = this.camera;

                const cameraData = this.getCurrentCameraData();

                if (cameraData) {
                    const cameraOptions = {
                        far: this.camera.far,
                        fov: this.camera.fov,
                        near: this.camera.near,
                        position: cameraData.position,
                        rotation: cameraData.rotation,
                        quaternion: cameraData.quaternion,
                        targetControl: cameraData.targetControl
                    };

                    const postMoveParam = {
                        method: Contents3D.finishChangeToPerspective,
                        methodParam: this
                    };

                    // 카메라가 처음 움직였을때부터 이동이 50% 이상 진행될때 까지만 빠르게 움직인다.
                    this.setMovingCamera(cameraOptions, Contents3D.Mode_Indoor, postMoveParam, [0, 0.5]);
                }
                else {
                    this._changeCamera(orthoMode);
                }
            }
            else {
                this._changeCamera(orthoMode);
            }
        }
    }

    _changeCamera(orthoMode) {
        if (orthoMode) {
            this.camera = this.orthoGraphicCamera;
            this.controls.object = this.camera;
            this.perspectiveControlOrigin = new Vector3(this.controls.target.x, this.controls.target.y, this.controls.target.z);

            const orthoCameraData = this.getCurrentOrthoCameraData();

            if (orthoCameraData) {
                this.camera.position.set(orthoCameraData.position[0], orthoCameraData.position[1], orthoCameraData.position[2]);
                this.camera.rotation.x = orthoCameraData.rotation[0];
                this.camera.rotation.y = orthoCameraData.rotation[1];
                this.camera.rotation.z = orthoCameraData.rotation[2];
                //this.camera.rotation.set(orthoCameraData.rotation[0], orthoCameraData.rotation[1], orthoCameraData.rotation[2]);
                //this.camera.quaternion.set(orthoCameraData.quaternion[0], orthoCameraData.quaternion[1], orthoCameraData.quaternion[2], orthoCameraData.quaternion[3]);
                this.camera.zoom = orthoCameraData.zoom;
                this.controls.target.set(this.camera.position.x, orthoCameraData.targetControl[1], this.camera.position.z);
                //this.controls.target.set(orthoCameraData.targetControl[0], orthoCameraData.targetControl[1], orthoCameraData.targetControl[2]);

                this.camera.lookAt(this.camera.position.x, this.controls.target.y, this.camera.position.z);
            }
            else {
                this.camera.position.set(this.perspectiveCamera.position.x, this.perspectiveCamera.position.y, this.perspectiveCamera.position.z);
                this.controls.target.set(this.camera.position.x, this.controls.target.y, this.camera.position.z);

                this.camera.lookAt(this.camera.position.x, this.controls.target.y, this.camera.position.z);
            }

            this.camera.up.set(0, 1, 0);
            this.camera.updateProjectionMatrix();
            this.controls.update();

            this.controls.enableRotate = false;
            this.useBoundingBox = false;
        }
        else {
            this.camera = this.perspectiveCamera;
            this.camera.updateProjectionMatrix();
            this.controls.object = this.camera;

            const cameraData = this.getCurrentCameraData();

            if (cameraData) {
                this.camera.position.set(cameraData.position[0], cameraData.position[1], cameraData.position[2]);
                this.camera.rotation.set(cameraData.rotation[0], cameraData.rotation[1], cameraData.rotation[2]);
                this.camera.quaternion.set(cameraData.quaternion[0], cameraData.quaternion[1], cameraData.quaternion[2], cameraData.quaternion[3]);
                this.controls.target.set(cameraData.targetControl[0], cameraData.targetControl[1], cameraData.targetControl[2]);
            }
            else {
                this.controls.target.set(this.perspectiveControlOrigin.x, this.perspectiveControlOrigin.y, this.perspectiveControlOrigin.z);
            }

            this.controls.update();

            this.controls.enableRotate = true;
            this.useBoundingBox = true;
        }
    }

    getCurrentCameraData() {
        if (!this.props.currentView) {
            return null;
        }

        const buildingID = this.props.currentView.buildingID;
        const zoneID = this.props.currentView.zoneID;

        return this.getCameraData(zoneID, buildingID);
    }

    getCameraData(zoneID, buildingID) {
        if (zoneID === null || zoneID === undefined ||
            buildingID === null || buildingID === undefined) {
            if (this.isIndoor()) {
                return null;
            }
            else {
                const camera = this.props._3dOptions.outdoorModel.camera;

                if (!camera) {
                    return null;
                }

                return camera;
            }
        }

        const buildingData = this.props._3dOptions.buildingIDs[buildingID];

        if (!buildingData || buildingData.length < 8) {
            return null;
        }

        const buildingGroupName = buildingData[1];
        const buildingName = buildingData[2];

        const buildingGroupData = this.props._3dOptions.indoorModels[buildingGroupName];

        if (!buildingGroupData) {
            return null;
        }

        let building = buildingGroupData[buildingName];

        if (!building) {
            building = this.getBuildingDataFromDisplayText(buildingName, buildingGroupData);
        }

        if (!building || !building.floors) {
            return null;
        }

        const floorCount = building.floors.length;

        for (let i = 0; i < floorCount; i++) {
            const floor = building.floors[i];

            if (floor.zoneID === zoneID) {
                return floor.camera;
            }
        }

        return null;
    }

    getCurrentOrthoCameraData() {
        if (!this.props.currentView) {
            return null;
        }

        const buildingID = this.props.currentView.buildingID;
        const zoneID = this.props.currentView.zoneID;

        return this.getOrthoCameraData(zoneID, buildingID);
    }

    getOrthoCameraData(zoneID, buildingID) {
        if (zoneID === null || zoneID === undefined ||
            buildingID === null || buildingID === undefined) {
            if (this.isIndoor()) {
                return null;
            }
            else {
                const cameraOrtho = this.props._3dOptions.outdoorModel.cameraOrtho;

                if (!cameraOrtho) {
                    return null;
                }

                return cameraOrtho;
            }
        }

        const buildingData = this.props._3dOptions.buildingIDs[buildingID];

        if (!buildingData || buildingData.length < 8) {
            return null;
        }

        const buildingGroupName = buildingData[1];
        const buildingName = buildingData[2];

        const buildingGroupData = this.getBuildingGroupIndoorModel(buildingGroupName, buildingName);
        //const buildingGroupData = this.props._3dOptions.indoorModels[buildingGroupName];

        if (!buildingGroupData) {
            return null;
        }

        let building = buildingGroupData[buildingName];

        if (!building) {
            building = this.getBuildingDataFromDisplayText(buildingName, buildingGroupData);
        }

        if (!building || !building.floors) {
            return null;
        }

        const floorCount = building.floors.length;

        for (let i = 0; i < floorCount; i++) {
            const floor = building.floors[i];

            if (floor.zoneID === zoneID) {
                return floor.cameraOrtho;
            }
        }

        return null;
    }

    getBuildingIDFromZone(zoneID) {
        const zoneData = this.props._3dOptions.zones[zoneID];

        if (!zoneData || zoneData.length < 2) {
            return null;
        }

        const buildingID = parseInt(zoneData[1]);

        if (buildingID !== 0 && !buildingID) {
            return null;
        }

        return buildingID;
    }

    // Outdoor Mode로 전환해야 하는가?
    static needUpdateToOutdoor(currentModel) {
        if (currentModel && currentModel.visible === false) {
            // Outdoor Mode인데 Outdoor 모델이 로딩된 상태에서 감춰져있다.
            return true;
        }

        return false;
    }

    static needUpdateToIndoor(currentModel, prevIndoorModel) {
        if (currentModel && currentModel.visible && prevIndoorModel && prevIndoorModel.visible === false) {
            return true;
        }

        return false;
    }

    saveViewport(modelName, _3dOptions, buildingGroupName, buildingName, zoneID) {
        const model = this.getModel(modelName, _3dOptions);

        if (model === null) {
            return;
        }

        const hitPoint = this.getRaycastingPosition(window.innerWidth / 2, window.innerHeight / 2);

        const camera = {};

        camera.position = [this.camera.position.x, this.camera.position.y, this.camera.position.z];
        camera.quaternion = [this.camera.quaternion.x, this.camera.quaternion.y, this.camera.quaternion.z, this.camera.quaternion.w];
        camera.rotation = [this.camera.rotation.x, this.camera.rotation.y, this.camera.rotation.z];
        camera.fov = model.camera.fov;
        camera.near = model.camera.near;
        camera.far = model.camera.far;

        if (hitPoint) {
            camera.targetControl = [hitPoint.x, hitPoint.y, hitPoint.z];
        }
        else {
            camera.targetControl = [this.controls.target.x, this.controls.target.y, this.controls.target.z];
        }

        const buildingGroupID = this.getBuildingGroupID(buildingGroupName);
        const buildingID = this.getBuildingID(buildingName);

        this.requestSaveViewport(model, modelName, model.file, camera, buildingGroupID, buildingID, zoneID);
    }

    getBuildingGroupID(buildingGroupName) {
        if (buildingGroupName) {
            const buildingGroup = this.props._3dOptions.indoorModels[buildingGroupName];

            if (buildingGroup) {
                return buildingGroup.buildingGroupID;
            }
        }

        return null;
    }

    getBuildingID(buildingName) {
        if (buildingName) {
            const building = this.props._3dOptions.allBuildings[buildingName];

            if (building) {
                return building[0];
            }
        }

        return null;
    }

    async requestSaveViewport(model, modelName, file, camera, buildingGroupID, buildingID, zoneID) {
        const [success, message] = await SDMSController.requestSaveViewport(modelName, file, camera, model.modelDisplayText, buildingGroupID, buildingID, zoneID);

        if (success) {
            model.camera = camera;
            model.file = file;
            alert("뷰포트 저장 성공");
        }
        else {
            alert(message);
        }
    }

    getModel(modelName, data) {
        for (const key in data) {
            const child = data[key];

            if (key === modelName) {
                return child;
            }

            if (child instanceof Object) {
                const model = this.getModel(modelName, child);

                if (model) {
                    return model;
                }
            }
        }

        return null;
    }

    detach3D() {
        if (this.renderer === null || this.scene === null) {
            return;
        }

        this.ref3D.current.removeChild(this.renderer.domElement);

        const meshes = [];
        const materials = [];
        const textures = [];
        const geometries = [];

        this.scene.traverse(obj => {
            if (obj instanceof THREE.Mesh) {
                meshes.push(obj);

                if (obj.geometry instanceof THREE.BufferGeometry) {
                    geometries.push(obj.geometry);
                }

                if (obj.material instanceof THREE.Material) {
                    materials.push(obj.material);

                    if (obj.material.map instanceof THREE.Texture) {
                        textures.push(obj.material.map);
                    }
                }
            }
        });

        for (let i = 0; i < this.alarmAnimationMixers.length; i++) {
            const mixers = this.alarmAnimationMixers[i];
            const alarmModels = this.alarmModels[i];

            const mixerCount = mixers.length;

            for (let j = 0; j < mixerCount; j++) {
                const mixer = mixers[j];
                const alarmModel = alarmModels[j];

                if (mixer && alarmModel) {
                    mixer.stopAllAction();
                    mixer.uncacheRoot(alarmModel);
                }
            }
        }
        /*for (let i = 0; i < this.alarmAnimationMixers.length; i++) {
            const mixer = this.alarmAnimationMixers[i];
            const alarmModel = this.alarmModels[i];

            if (mixer && alarmModel) {
                mixer.stopAllAction();
                mixer.uncacheRoot(alarmModel);
            }
        }*/

        this.scene.clear();

        meshes.forEach((obj) => {
            if (obj.parent !== null) {
                obj.parent.remove(obj);
            }
            if (obj.dispose) {
                obj.dispose();
            }
        });

        materials.forEach((mat) => {
            if (mat.dispose) {
                mat.dispose();
            }
        });

        textures.forEach((tex) => {
            tex.dispose();
        });

        geometries.forEach((geom) => {
            geom.dispose();
        });

        if (this.scene.background instanceof THREE.Texture) {
            this.scene.background.dispose();
            this.scene.background = null;
        }

        this.renderer.dispose();

        this.boundingBoxModel = null;
        this.renderer = null;
        this.scene = null;
        this.camera = null;
        this.dirLight = null;
        this.controls = null;
        this.currentModel = null;
        this.internalModels = {};
        this.spriteMaterials = {};
        //this.buildingGroupText = {};

        this.textPOIManager.clear();
    }

    init() {
        this.internalModels = {};

        this.setIndoorModelCount();
        const outdoorModel = this.props._3dOptions.outdoorModel;

        this.orthoGraphicCamera = new THREE.OrthographicCamera(window.innerWidth / - 2, window.innerWidth / 2, window.innerHeight / 2, window.innerHeight / - 2, 0.1, 5000);
        this.perspectiveCamera = new THREE.PerspectiveCamera(outdoorModel.camera.fov, window.innerWidth / window.innerHeight, outdoorModel.camera.near, outdoorModel.camera.far);
        this.camera = this.perspectiveCamera;

        this.scene = new THREE.Scene();
        

        // 멀티사이트 경우, 선택된 사이트로 textPOI 초기화 
        //this.textPOIManager.Scene = this.scene;
        const currentSiteID = parseInt(this.props.currentSiteID);
        if (ProjectResource.IsMultiSite === true && currentSiteID > 0 && ProjectResource.SiteNo !== currentSiteID) {
            this.textPOIManager.setScene(this.scene, currentSiteID);
        } else {
            this.textPOIManager.Scene = this.scene;
        }

        this.poiManager.Scene = this.scene;
        //this.scene.background = new THREE.Color( 0xa0a0a0 );

        this.optionManager = new OptionManager(this.scene, this);

        const bgTexture = new THREE.TextureLoader().load(this.props._3dOptions.textureBaseURL + '/' + this.props._3dOptions.backgroundImage);
        this.scene.background = bgTexture;

        const hemiLight = new THREE.HemisphereLight(0xffffff, 0x444444, 0.1);
        hemiLight.position.set(0, 20, 0);
        this.scene.add(hemiLight);

        this.dirLight = new THREE.DirectionalLight(0xffffff/*, this.directionalLightPower*/);
        //this.dirLight = new THREE.DirectionalLight(0xffffff, 8.0);
        this.dirLight.position.set(-3, 10, -10);
        //this.dirLight.position.set(0, 200, 100);

        this.dirLight.castShadow = true;

        this.dirLight.shadow.bias = -0.0008;
        this.dirLight.shadow.mapSize.width = 2048;
        this.dirLight.shadow.mapSize.height = 2048;
        this.dirLight.shadow.camera.updateProjectionMatrix();
        this.scene.add(this.dirLight);
        this.scene.add(this.dirLight.target);

        this.renderer = new THREE.WebGLRenderer({ antialias: true });
        this.renderer.setPixelRatio(window.devicePixelRatio);
        this.renderer.setSize(window.innerWidth, window.innerHeight);
        //this.renderer.physicallyCorrectLights = true;
        this.renderer.outputEncoding = THREE.sRGBEncoding;
        /*this.renderer.toneMapping = THREE.ACESFilmicToneMapping;
        this.renderer.toneMappingExposure = 0.5;*/
        this.renderer.shadowMap.enabled = true;
        this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;
        /*this.renderer.shadowMap.type = THREE.VSMShadowMap;
        this.renderer.shadowMap.autoUpdate = false;*/
        this.ref3D.current.appendChild(this.renderer.domElement);

        //this.scene.add(new THREE.AmbientLight(0x666666, 9));
        //this.scene.add(new THREE.AmbientLight(0x666666, 10));

        this.controls = new OrbitControls(this.camera, this.renderer.domElement);
        this.controls.target.set(0, 0, 0);
        // 최대 회전각
        this.controls.maxPolarAngle = Math.PI / 3;
        this.controls.update();

        this.equipZoneAreaManager.setContents3D(this);
    }

    setIndoorModelCount() {
        let fileCount = 0;
        const _3dOptions = this.props._3dOptions;

        if (_3dOptions) {
            for (const buildingGroupName in _3dOptions.indoorModels) {
                const buildingGroup = _3dOptions.indoorModels[buildingGroupName];

                for (const buildingName in buildingGroup) {
                    const building = buildingGroup[buildingName];

                    if (building && building.floors) {
                        const floorCount = building.floors.length;

                        for (let i = 0; i < floorCount; i++) {
                            const floor = building.floors[i];

                            if (floor.file && floor.camera) {
                                fileCount++;
                            }
                        }
                    }
                }
            }
        }

        this.indoorModelCount = fileCount;
    }

    /*getSensorPOI(sensorType, sensorID) {
        const key = POIManager.getSensorKey(sensorType, sensorID);
        const sprite = this.sensorPOIs[key];
        return sprite;
    }*/

    /*addOutdoorSensors() {
        for (const zoneID in this.props._3dOptions.outdoorZones) {
            //this.addZoneSensors(parseInt(zoneID), Contents3D.size);
            this.addZoneSensors(parseInt(zoneID), 4);
        }
    }

    addZoneSensors(zoneID, scale) {
        let zone = this.props._3dOptions.zones[zoneID.toString()];

        if (!zone) {
            zone = this.props._3dOptions.outdoorZones[zoneID.toString()];
        }

        if (zone) {
            const sensorTypeCount = this.props.visibleSensorTypes.length;

            for (let i = 0; i < sensorTypeCount; i++) {
                const sensorType = this.props.visibleSensorTypes[i];
                const sensors = zone.sensors[sensorType];

                if (sensors) {
                    this.addSensors(sensorType, sensors, scale, zoneID);
                }
            }
        }
    }

    addSensor(sensorType, sensorID, x, y, z, zoneID) {
        if (!zoneID) {
            return;
        }

        if (x === null || x === undefined ||
            y === null || y === undefined ||
            z === null || z === undefined) {
            return;
        }

        const url = '/resource/image/icon/' + sensorType + '.png';
        const sprite = this.addPOI(url, x, y, z, 1);

        if (sprite) {
            sprite.name = POIManager.getSensorKey(sensorType, zoneID, sensorID);
            this.sensorPOIs[sprite.name] = sprite;
        }

        return sprite;
    }

    addSensors(sensorType, sensors, scale, zoneID) {
        if (!sensors || !zoneID) {
            return;
        }

        const urlPath = '/resource/image/icon/';

        const sensorCount = sensors.length;

        for (let i = 0; i < sensorCount; i++) {            
            const sensor = sensors[i];

            if (sensor.x === null || sensor.x === undefined ||
                sensor.y === null || sensor.y === undefined ||
                sensor.z === null || sensor.z === undefined) {
                continue;
            }

            let url = urlPath + sensorType + '.png'
            if (sensor.sensorSubType !== null && sensor.sensorSubType >= 0) {
                url = urlPath + sensorType + sensor.sensorSubType + '.png';
            }

            const sprite = this.addPOI(url, sensor.x, sensor.y, sensor.z, scale);

            if (sprite) {
                sprite.name = POIManager.getSensorKey(sensorType, zoneID, sensor.id);
                this.sensorPOIs[sprite.name] = sprite;
            }
        }
    }*/

    /*getSensorKey(sensorType, zoneID, sensorID) {
        return sensorType + "_" + zoneID + "_" + sensorID;
    }*/

    /*getSensorType(SensorName) {
        // 센서 타입 가져오기
        // Name 규칙이 타입 + "_" + Zone ID + "_" SensorID 인 것을 이용

        let index = SensorName.indexOf("_");
        if (index === -1)
            return null;

        let type = SensorName.substring(0, index);

        return type;
    }*/

    /*getSensorID(SensorName) {
        // 해당 센서 아이디 가져오기
        // Name 규칙이 타입 + "_" + Zone ID + "_" SensorID 인 것을 이용

        let index = SensorName.indexOf("_");
        if (index === -1)
            return null;

        let type = SensorName.substring(0, index);
        let zone_id = SensorName.substring(index + 1);

        index = zone_id.indexOf("_");
        if (index === -1)
            return null;

        let zone = zone_id.substring(0, index);
        let id = zone_id.substring(index + 1);

        return id;
    }*/

    /*removeSensors(sensorType) {
        const removeKeys = [];
        const removeNames = {};

        if (sensorType) {
            for (const sensorID in this.sensorPOIs) {
                if (sensorID.startsWith(sensorType)) {
                    const sprite = this.sensorPOIs[sensorID];
                    this.scene.remove(sprite);
                    removeKeys.push(sensorID);

                    removeNames[sensorID] = sensorID;
                }
            }
        }
        else {
            for (const sensorID in this.sensorPOIs) {
                const sprite = this.sensorPOIs[sensorID];
                this.scene.remove(sprite);
                removeKeys.push(sensorID);

                removeNames[sensorID] = sensorID;
            }
        }

        const sceneChildCount = this.scene.children.length;

        for (let i = sceneChildCount - 1; i >= 0; i--) {
            const child = this.scene.children[i];

            if (removeNames[child.name]) {
                this.scene.remove(child);
            }
        }

        const removeCount = removeKeys.length;

        for (let i = 0; i < removeCount; i++) {
            const sensorID = removeKeys[i];
            delete this.sensorPOIs[sensorID];
        }
    }*/

    /*moveSensor(sensorType, sensorID, zoneID, x, y, z) {
        const key = sensorType + "_" + zoneID + "_" + sensorID;
        const sprite = this.sensorPOIs[key];

        if (sprite) {
            sprite.position.x = x;
            sprite.position.y = y;
            sprite.position.z = z;
        }
    }*/

    /*addPOI(imgURL, x, y, z, scale) {
        let spriteMaterial = this.spriteMaterials[imgURL];

        if (!spriteMaterial) {
            const spriteMap = new THREE.TextureLoader().load(imgURL);
            spriteMaterial = new THREE.SpriteMaterial({ map: spriteMap, color: 0xffffff });
            this.spriteMaterials[imgURL] = spriteMaterial;
        }

        const sprite = new THREE.Sprite(spriteMaterial);

        //sprite.material.depthWrite = false;
        //sprite.material.depthTest = false;

        sprite.scale.x *= 2.5 * scale;
        sprite.scale.y *= 2.5 * scale;
        sprite.scale.z *= 2.5 * scale;

        sprite.position.x = x;
        sprite.position.y = y;
        sprite.position.z = z;

        this.scene.add(sprite);

        return sprite;
    }*/

    postMoveEquipZoneNameText(zoneID, equipZoneID, equipZoneName, x, y, z) {
        const zone = this.props._3dOptions.zones[zoneID];

        if (zone && zone.equipZones) {
            const equipZone = zone.equipZones[equipZoneID];

            if (equipZone && equipZone[2] !== null) {
                equipZone[1] = equipZoneName;
                equipZone[2].x = x;
                equipZone[2].y = y;
                equipZone[2].z = z;

                this.props.onSelectMenu(SDMSMainMenu.Menu_Refresh, null);
            }
        }
    }

    async moveBuildingNameText(buildingGroupName, buildingName, x, y, z) {
        const sprite = this.textPOIManager.getBuildingTextSprite(buildingGroupName, buildingName);

        if (sprite) {
            const [success, message] = await SDMSController.requestMoveBuildingNameText(buildingGroupName, buildingName, x, y, z);

            if (success) {
                sprite.position.x = x;
                sprite.position.y = y;
                sprite.position.z = z;

                this.props.onSelectMenu(SDMSMainMenu.Menu_Refresh, null);
            }
            else {
                alert(message);
            }
        }
    }

    addBuildingGroupText() {
        this.textPOIManager.addBuildingGroupText(this.props._3dOptions.buildingGroups, this.props.currentSiteID);
        this.useBoundingBox = true;
    }

    addEquipZoneText(zoneID, _3dOptions, languageType) {
        const zone = _3dOptions.zones[zoneID];

        if (zone && zone.equipZones) {
            this.textPOIManager.addEquipZoneText(zoneID, zone.equipZones, _3dOptions.siteID, languageType);
        }
    }

    // stats : FPS 표시
    static animate(_this) {
        requestAnimationFrame(() => {
            Contents3D.animate(_this);
        });

        const delta = _this.clock.getDelta();

        if (_this.movingCamera) {
            _this.moveCamera(delta);
        }
        else {
            if (_this.needCameraRotation()) {
                _this.rotateCamera(delta);
            }
        }

        const zoomValue = _this.getZoomValue();

        if (zoomValue) {
            const isIndoor = _this.isIndoor();
            _this.showBuildingGroupText(zoomValue, isIndoor);
            _this.textPOIManager.showBuildingText(zoomValue, isIndoor);
        }

        if (SDMS.UseWalkingAvatar) {
            _this.walker.animate(delta);
        }

        if (_this.renderer && _this.scene && _this.camera) {
            _this.renderer.render(_this.scene, _this.camera);
        }

        _this.blink(delta);
        _this.runMoving(delta);
        _this.animateAlarm(delta);

        AnimationModel.animateModels(delta, _this.currentAnimationModels);
        _this.poiManager.changePoiScales(delta);
        _this.poiManager.showSmoothVisible(delta);
        _this.textPOIManager.showSmoothVisible(delta);

        // fps 확인
        //if (_this.stats === null) {
        //    _this.stats = new Stats();
        //    _this.stats.showPanel(0) // 0: fps, 1: ms, 2: mb, 3+: custom
        //    document.body.appendChild(_this.stats.dom)
        //}                
        //_this.stats.update();

        _this.watchAlarmSoundTime();
    }

    rotateCamera(delta) {
        const [theta, radius] = this.cameraRotation;
        const angle = theta + this.cameraRotationPerSecond * delta;

        // Y축을 중심으로 회전
        this.camera.position.z = this.controls.target.z + Math.sin(angle) * radius;
        this.camera.position.x = this.controls.target.x + Math.cos(angle) * radius;
        this.camera.lookAt(this.controls.target);

        this.cameraRotation[0] = angle;
    }

    startAutoRotation = () => {
        if (this.state.useIdleTime) {
            const current = new Date();
            const idleTime = this.state.idleTime * 60000;
            this.lastMouseMoveTime = new Date(current.getTime() - idleTime);
            this.lastAutoRotationCommandTime = current;
        }
    }

    setUseIdleTime = (use) => {
        this.setState({ useIdleTime: use });
    }

    setTurnStart = (data) => {
        if (data === null || data === undefined)
            return;

        if (this.state.turnStart !== data)
            this.setState({ turnStart: data});
    }

    setUseAlarmTurn = (data) => {
        if (data === null || data === undefined)
            return;

        if (this.state.useAlarmTurn !== data)
            this.setState({ useAlarmTurn: data });
    }

    checkAlarmTurn = () => {
        // 알람시 카메라 회전 사용여부 확인

        // 현재 알람 상태인지 확인
        let isAlarm = (this.props.selectedAlarm !== null && this.props.selectedAlarm !== undefined && this.props.selectedAlarm.isAlarm) ? true : false;

        // 현재 동작중인 알람을 선택중이고 알람시 회전기능을 사용하지 않는다면
        if (isAlarm === true && this.state.useAlarmTurn !== SettingResource.useAlarmTurn.on)
            return false;

        return true;
    }

    needCameraRotation() {
        if (this.props.editMode !== Contents3D.Edit_Mode_None) {
            return false;
        }

        if (this.state.useIdleTime === false) 
            return false;

        // 알람시 카메라 회전 사용여부 확인
        if (this.checkAlarmTurn() === false) 
            return false;

        if (this.camera === this.perspectiveCamera) {
            const current = new Date();
            const timeSpan = current - this.lastMouseMoveTime;

            let idleTime = this.state.idleTime * 60000;     // 분 단위 변환

            //if (timeSpan >= Contents3D.CAMERA_IDLE_TIME) {
            if (timeSpan >= idleTime) {
                if (this.cameraRotation) {
                    return true;
                }

                // .TODO: 회전시 기준화면 설정 여부에 따른 화면이동
                //this.initViewport();


                // Y축을 중심으로 회전
                // 회전 중심점 : this.controls.target
                const vCenter = new Vertex2D(this.controls.target.x, this.controls.target.z);
                const vPos = new Vertex2D(this.camera.position.x, this.camera.position.z);
                const radius = vCenter.getDistance(vPos);

                const vRight = new Vertex2D(vCenter.x + radius, vCenter.y);
                let theta = Geometry.getAngle(vRight, vCenter, vPos);

                if (vPos.y < vCenter.y) {
                    theta = Math.PI * 2 - theta;
                }

                this.cameraRotation = [theta, radius];
                this.hideVisiblePopupsBeforeRotation();
                return true;
            }
        }

        if (this.cameraRotation) {
            this.showVisiblePopupsAfterRotation();
        }

        this.cameraRotation = null;
        return false;
    }

    showVisiblePopupsAfterRotation() {
        /*const showPopups = [];

        for (const menu in this.visiblePopups) {
            if (this.visiblePopups[menu]) {
                showPopups.push(menu);
            }
        }

        this.visiblePopups = {};
        this.props.setVisiblePopups(showPopups, true);*/
    }

    hideVisiblePopupsBeforeRotation() {
        /*this.visiblePopups[SDMS.menu.statusInfo] = this.props.getVisiblePopups(SDMS.menu.statusInfo);
        this.visiblePopups[SDMS.menu.cctv] = this.props.getVisiblePopups(SDMS.menu.cctv);
        this.visiblePopups[SDMS.menu.eventInfo] = this.props.getVisiblePopups(SDMS.menu.eventInfo);
        this.visiblePopups[SDMS.menu.miniMap] = this.props.getVisiblePopups(SDMS.menu.miniMap);

        const hidePopups = [];

        for (const menu in this.visiblePopups) {
            if (this.visiblePopups[menu]) {
                hidePopups.push(menu);
            }
        }

        this.props.setVisiblePopups(hidePopups, false);*/
    }

    initIdleTime = () => {
        let idleTime = SettingsStore.getState().idleTime;

        if (idleTime === null || idleTime === undefined || idleTime === "")
            return;

        let arrIdleTime = idleTime.split(";");

        if (arrIdleTime.length !== 2) {
            idleTime = "10;1";  // 기본값
            arrIdleTime = idleTime.split(";");
        }

        idleTime = arrIdleTime[0];
        idleTime = parseFloat(idleTime);

        let useIdleTime = true

        if (arrIdleTime[1] === "0")
            useIdleTime = false;

        if (idleTime || idleTime === 0) {
            //this.setState({ idleTime: idleTime });
            this.state.idleTime = idleTime;
            this.state.useIdleTime = useIdleTime;
        }
    }

    setIdleTime = (idleTime) => {
        let time = Contents3D.CAMERA_IDLE_TIME / 60000;        // 기본 idleTime 값
        let useIdleTime = true;

        if (idleTime === null || idleTime === undefined || idleTime === "") {
            // 값이 없다면 기본 idleTime 값
        } else {
            //parseFloat(inputValue);
            let arrIdleTime = idleTime.split(";");

            if (arrIdleTime.length !== 2) {
                idleTime = "10;1";
                arrIdleTime = idleTime.split(";");
            }

            idleTime = arrIdleTime[0];
            time = parseFloat(idleTime);

            if (arrIdleTime[1] === "0")
                useIdleTime = false;
        }

        if (time || time === 0) {
            this.setState({ idleTime: time, useIdleTime: useIdleTime });
        }
    }

    changeSDMSCommonSettings(storeValue) {
        const commonSettings = storeValue ? storeValue : {};

        this.setState({ commonSettings: commonSettings });
    }

    animateAlarm(delta) {
        const currentAlarmLevel = this.state.alarm;

        if (currentAlarmLevel > 0) {
            const animationMixers = this.alarmAnimationMixers[currentAlarmLevel - 1];
            const animationModels = this.alarmModels[currentAlarmLevel - 1];

            const mixerCount = animationMixers.length;

            for (let i = 0; i < mixerCount; i++) {
                const animationMixer = animationMixers[i];
                const animationModel = animationModels[i];

                if (animationMixer !== null && animationModel && animationModel.visible) {
                    animationMixer.update(delta);
                }
            }
            /*const animationMixer = this.alarmAnimationMixers[currentAlarmLevel - 1];
            const animationModel = this.alarmModels[currentAlarmLevel - 1];

            if (animationMixer !== null && animationModel && animationModel.visible) {
                animationMixer.update(delta);
            }*/
        }
    }

    isIndoor() {
        if (!this.currentModel) {
            return false;
        }

        if (!this.props._3dOptions || !this.props._3dOptions.outdoorModel) {
            return false;
        }

        if (this.currentModel.name === this.props._3dOptions.outdoorModel.file) {
            return false;
        }

        return true;
    }

    runMoving(delta) {
        const movingDatas = [...this.movingDatas];
        const movingCount = movingDatas.length;

        for (let i = 0; i < movingCount; i++) {
            const movingData = movingDatas[i];
            const elapsed = movingData.delta + delta;

            this.moveObject(elapsed, movingData.interval, movingData.models);
            movingData.delta = elapsed;

            while (movingData.delta >= movingData.interval) {
                movingData.delta -= movingData.interval;
            }
        }
    }

    moveObject(delta, interval, models) {
        const modelCount = models.length;
        const halfTime = interval / 2;

        for (let i = 0; i < modelCount; i++) {
            const modelData = models[i];
            const model = modelData[0];
            const begin = modelData[1];
            const end = modelData[2];
            const distance = modelData[3];

            if (delta <= halfTime) {
                const pos = Geometry.getLinearVertex3(begin.x, begin.y, begin.z, end.x, end.y, end.z, delta / halfTime * distance);
                model.position.set(pos[0], pos[1], pos[2]);
            }
            else {
                const pos = Geometry.getLinearVertex3(end.x, end.y, end.z, begin.x, begin.y, begin.z, (delta - halfTime) / halfTime * distance);
                model.position.set(pos[0], pos[1], pos[2]);
            }
        }
    }

    blink(delta) {
        const blinkDatas = [...this.blinkDatas];
        const blinkCount = blinkDatas.length;

        for (let i = 0; i < blinkCount; i++) {
            const blinkData = blinkDatas[i];
            const visible = blinkData.visible;
            const _delta = blinkData.delta + delta;
            const targetTime = visible ? blinkData.interval : blinkData.wait;

            if (_delta >= targetTime) {
                blinkData.model.visible = !visible;
                blinkData.visible = !visible;
                blinkData.delta = _delta - targetTime;
            }
            else {
                blinkData.delta = _delta;
            }
        }
    }

    loadOutdoorModelFiles(modelFiles, _3dOptions, visible) {
        if (!TextPOIManager.loadSpriteIconImage()) {
            setTimeout(() => this.loadOutdoorModelFiles(modelFiles, _3dOptions, visible), 500);
            return;
        }

        // 중복된 파일 제거
        modelFiles = this.removeDuplicate(modelFiles);

        this.timelog("Begin Loading");
        const fileCount = modelFiles.length;

        this.outdoorModelCount = fileCount;
        this.completeOutdoorModelCount = 0;

        if (fileCount > 0) {
            this.outdoorModelTotalCount = fileCount;
            this.loadRootModel(modelFiles[0], 1, modelFiles, Contents3D.Mode_Outdoor_All, visible, _3dOptions);
        }

        this.loadComponentModels();
    }

    // 중복된 파일 제거
    removeDuplicate(files) {
        const fileMap = {};

        for (const fileName of files) {
            fileMap[fileName] = fileName;
        }

        const _files = [];

        for (const fileName in fileMap) {
            _files.push(fileName);
        }

        return _files;
    }

    onCompleteOutdoorModelLoading(modelNode, _3dOptions) {
        this.completeOutdoorModelCount = this.completeOutdoorModelCount + 1;

        if (this.completeOutdoorModelCount >= this.outdoorModelCount) {
            // 알람모델은 한번만 로딩하면 된다.
            if (_3dOptions.siteID === ProjectResource.siteNo.toString()) {
                this.loadAlarmModels(_3dOptions);
            }

            this.props.onCompleteOutdoorModelLoading(_3dOptions.siteID);

            if (this.props.multiSite && this.outdoorModelTotalCount > 0) {
                this.outdoorModelTotalCountTemp++;
                const rate = this.outdoorModelTotalCountTemp / this.outdoorModelTotalCount * 100;

                if (rate >= 100) {
                    AccountController.loading3DChk = false;
                    this.setState({ progressValue: rate, progressActive: false });
                } else {
                    AccountController.loading3DChk = true;
                    this.setState({ progressValue: rate });
                }
            } else if (ProjectResource.IsMultiSite === true && this.state.progressValue === 0) {
                // MultiSite 경우이면서, 계정 권한으로 site 하나만 볼 수 있을 경우
                const rate = this.completeOutdoorModelCount / this.outdoorModelCount * 100;
                
                if (rate >= 100) {
                    AccountController.loading3DChk = false;
                    this.setState({ progressValue: rate, progressActive: false });
                } else {
                    AccountController.loading3DChk = true;
                    this.setState({ progressValue: rate });
                }
            }

            if (_3dOptions.indoorModelOnMemory) {
                this.loadIndoorModels(_3dOptions);
            }
            else {
                // 실내 모델을 필요할 때에만 실시간으로 로딩하는 경우
                this.loadNextSiteModels();
            }

            if (SDMS.UseWalkingAvatar && _3dOptions.siteID === ProjectResource.siteNo.toString()) {
                this.walker.loadModel('resource/gltf/Component/WalkingMan.glb', this, true, Math.PI);
                //this.walker.loadModel('resource/gltf/Component/Soldier.glb', this);
                this.props.setMovingAvatar(this.walker);
            }
        }

        const oldModel = this.checkExistOutdoorModel(modelNode, _3dOptions.siteID);

        if (oldModel) {
            // 같은 모델이 이미 존재한다면 신규모델을 삭제하고 기존모델을 사용한다.
            modelNode.parent.remove(modelNode);
            modelNode = oldModel;
        }

        let outdoorModels = this.siteOutdoorModels[_3dOptions.siteID];

        if (!outdoorModels) {
            outdoorModels = [];
            this.siteOutdoorModels[_3dOptions.siteID] = outdoorModels;
        }

        outdoorModels.push(modelNode);
        //this.outdoorModels.push(modelNode);

        const animationModel = this.modelAnimations[modelNode.name];

        if (animationModel) {
            // 외부 모델들을 불러오는 도중이다.
            // 하나씩 외부 모델들이 추가된다.
            this.currentAnimationModels.push(animationModel);
        }
    }

    checkExistOutdoorModel(modelNode, currentSiteID) {
        const siteOutdoorModels = { ...this.siteOutdoorModels };

        for (const siteID in siteOutdoorModels) {
            if (siteID === currentSiteID) {
                continue;
            }

            const outdoorModels = siteOutdoorModels[siteID];

            for (const outdoorModel of outdoorModels) {
                if (outdoorModel.name === modelNode.name) {
                    return outdoorModel;
                }
            }
        }

        return null;
    }

    loadComponentModels() {
        const contents = "Component/FakeWall.glb";
        const fileName = this.props._3dOptions.modelBaseURL + "/" + contents;
        const worldBox = new THREE.Box3();

        let loader = null;

        if (fileName.endsWith('.fbx')) {
            loader = new FBXLoader();
        } else if (fileName.endsWith('.glb') || fileName.endsWith('.gltf')) {
            loader = new GLTFLoader();
            // Optional: Provide a DRACOLoader instance to decode compressed mesh data
            const dracoLoader = new DRACOLoader();
            dracoLoader.setDecoderPath('/three/examples/js/libs/draco/');
            loader.setDRACOLoader(dracoLoader);
        }

        const worldPos = new THREE.Vector3();
        const worldScale = new THREE.Vector3();
        const worldQuat = new THREE.Quaternion();

        const _this = this;

        loader.load(fileName, function (object) {
            const obj = loader instanceof GLTFLoader ? object.scene : object;
            obj.traverse((child) => {
                child.getWorldPosition(worldPos);
                child.getWorldScale(worldScale);
                child.getWorldQuaternion(worldQuat);

                if (child instanceof THREE.Mesh) {
                    child.castShadow = true;
                    child.receiveShadow = true;
                    worldBox.expandByObject(child);
                }
            });

            const modelNode = new THREE.Object3D();
            modelNode.add(obj);
            modelNode.matrixAutoUpdate = false;
            modelNode.name = contents;
            //_this.scene.add(modelNode);

            const fakeWall = _this.setModelVisible(modelNode, "fake_wall_002", true);

            if (fakeWall) {
                fakeWall.scale.set(2, 2, 2);
                _this.fakeWallManager.setContents3D(fakeWall, _this);
            }

            /*fakeWall.position.set(20.4, 30, -318);*/
            //_this.fakeWalls.position.set(-9, -1.5, -16);
            /*_this.setModelVisible(modelNode, "fake_wall_004", false);
            _this.fakeWalls = _this.setModelVisible(modelNode, "fake_wall_003", true);
            _this.setModelVisible(modelNode, "fake_wall_002", false);
            _this.setModelVisible(modelNode, "fake_wall_001", false);*/

            modelNode.updateMatrixWorld(true);

            const boxSize = new THREE.Vector3();
            worldBox.getSize(boxSize);

            const sceneMaxLen = boxSize.length();
            const sceneHalfMaxLen = sceneMaxLen * 0.5;

            worldBox.getCenter(_this.dirLight.target.position);
            _this.dirLight.position.copy(_this.dirLight.target.position);

            const lightPos = new THREE.Vector3(sceneHalfMaxLen, sceneMaxLen, sceneHalfMaxLen);
            _this.dirLight.position.add(lightPos);

            const lightDistance = lightPos.length();

            _this.dirLight.shadow.camera.near = lightDistance - sceneHalfMaxLen;
            _this.dirLight.shadow.camera.far = lightDistance + sceneHalfMaxLen;
            _this.dirLight.shadow.camera.right = sceneHalfMaxLen;
            _this.dirLight.shadow.camera.left = -sceneHalfMaxLen;
            _this.dirLight.shadow.camera.top = sceneHalfMaxLen;
            _this.dirLight.shadow.camera.bottom = -sceneHalfMaxLen;
            _this.dirLight.shadow.camera.updateProjectionMatrix();
            _this.renderer.shadowMap.needsUpdate = true;
        });
    }

    setModelVisible(obj, targetName, visible) {
        if (obj.name === targetName) {
            obj.visible = visible;
            return obj;
        }

        const childCount = obj.children.length;

        for (let i = 0; i < childCount; i++) {
            const _obj = this.setModelVisible(obj.children[i], targetName, visible);

            if (_obj) {
                return _obj;
            }
        }

        return null;
    }

    loadRootModel(contents, nextIndex, files, mode, visible, _3dOptions) {
        this.setState({ loading: true });

        const fileName = _3dOptions.modelBaseURL + "/" + contents;
        const worldBox = new THREE.Box3();

        let loader = null;

        if (fileName.endsWith('.fbx')) {
            loader = new FBXLoader();
        } else if (fileName.endsWith('.glb') || fileName.endsWith('.gltf')) {
            loader = new GLTFLoader();
            // Optional: Provide a DRACOLoader instance to decode compressed mesh data
            const dracoLoader = new DRACOLoader();
            dracoLoader.setDecoderPath('/three/examples/js/libs/draco/');
            loader.setDRACOLoader(dracoLoader);
        }

        const worldPos = new THREE.Vector3();
        const worldScale = new THREE.Vector3();
        const worldQuat = new THREE.Quaternion();

        const _this = this;
        //const mode = this.state.mode;
        const cameraOptions = _3dOptions.outdoorModel.camera;

        loader.load(fileName, function (object) {
            const obj = loader instanceof GLTFLoader ? object.scene : object;
            obj.traverse((child) => {
                child.getWorldPosition(worldPos);
                child.getWorldScale(worldScale);
                child.getWorldQuaternion(worldQuat);

                if (child instanceof THREE.Mesh) {
                    child.castShadow = true;
                    child.receiveShadow = true;
                    //worldBox.expandByObject(child);

                    const localBox = new THREE.Box3();
                    localBox.expandByObject(child);
                    Contents3D.setWorldBox(localBox, worldBox, child);
                }
            });

            const isIndoor = _this.isIndoor();

            const modelNode = new THREE.Object3D();
            modelNode.add(obj);
            modelNode.matrixAutoUpdate = false;
            modelNode.name = contents;

            if (isIndoor) {
                modelNode.visible = false;
            }
            else {
                modelNode.visible = visible;
            }

            _this.scene.add(modelNode);
            modelNode.updateMatrixWorld(true);

            // AnimationModel이 있는지 확인한다.
            _this.loadAnimationModels(object, modelNode);

            _this.removeBoundingBoxShadow(modelNode);

            const boxSize = new THREE.Vector3();
            worldBox.getSize(boxSize);
            _this.optionManager.setModelSize(contents, worldBox);

            const sceneMaxLen = boxSize.length();
            const sceneHalfMaxLen = sceneMaxLen * 0.5;

            worldBox.getCenter(_this.dirLight.target.position);
            _this.dirLight.position.copy(_this.dirLight.target.position);

            const lightPos = new THREE.Vector3(sceneHalfMaxLen, sceneMaxLen, sceneHalfMaxLen);
            _this.dirLight.position.add(lightPos);

            const lightDistance = lightPos.length();

            _this.dirLight.shadow.camera.near = lightDistance - sceneHalfMaxLen;
            _this.dirLight.shadow.camera.far = lightDistance + sceneHalfMaxLen;
            _this.dirLight.shadow.camera.right = sceneHalfMaxLen;
            _this.dirLight.shadow.camera.left = -sceneHalfMaxLen;
            _this.dirLight.shadow.camera.top = sceneHalfMaxLen;
            _this.dirLight.shadow.camera.bottom = -sceneHalfMaxLen;
            _this.dirLight.shadow.camera.updateProjectionMatrix();
            _this.renderer.shadowMap.needsUpdate = true;

            if (visible) {
                // .TODO: 실내 모델링을 로딩하지 않을 경우, 카메라 첫 외곽 이동 여부 체크
                if (_this.FirstIndoorNotOnMemoryCameraMove === false && _3dOptions.indoorModelOnMemory === false) {
                    _this.FirstIndoorNotOnMemoryCameraMove = true;
                }

                Contents3D.setCamera(_this.camera, _this.controls, cameraOptions);
            }

            if (isIndoor === false && visible) {
                _this.currentModel = modelNode;
            }

            //_this.outdoorModelTotalCountTemp++;
            _this.onCompleteOutdoorModelLoading(modelNode, _3dOptions);

            if (mode === Contents3D.Mode_Outdoor_All || mode === contents.Mode_Outdoor_Part) {
                _this.textPOIManager.addBuildingGroupText(_3dOptions.buildingGroups, _3dOptions.siteID);
                _this.useBoundingBox = true;
                // 다국어 관련 수정
                //_this.textPOIManager.addBuildingText(_3dOptions.buildings, _3dOptions.siteID);
                _this.textPOIManager.addBuildingText(_3dOptions.buildingGroups, _3dOptions.buildings, _3dOptions.siteID);
                Contents3D.hideBoundingBoxes(modelNode, _3dOptions.buildingGroups, _3dOptions.buildings);
            }

            _this.setState({ loading: false });

            if (nextIndex !== null && nextIndex !== undefined && files) {
                if (nextIndex < files.length) {
                    for (let i = nextIndex; i < files.length; i++) {
                        _this.loadFile(files[i], visible, null, Contents3D.Mode_Outdoor_Part, _3dOptions);
                    }
                }
            }

            if (isIndoor === false) {
                // 현재 사이트만 외곽 POI 불러오기
                if (_this.props.currentSiteID === _3dOptions.siteID) {
                    _this.poiManager.addOutdoorSensors(_3dOptions.outdoorZones, _3dOptions.zones, _this.props.visibleSensorTypes);

                    // 외곽 공간 표시
                    _this.textPOIManager.updateOutdoorEquipZoneData(_3dOptions);

                    let outdoorZoneID = null;

                    for (let zoneID in _3dOptions.outdoorZones) {
                        zoneID = Number(zoneID);

                        if (zoneID !== NaN && zoneID !== 30000)
                            outdoorZoneID = zoneID;
                    }

                    // 외곽 공간영역 표시
                    if (outdoorZoneID !== null)
                        _this.equipZoneAreaManager.setZoneID(outdoorZoneID);
                    // 현재 뷰 외곽뷰 설정
                    _this.props.setCurrentView(outdoorZoneID);
                }                

                // 외부영역의 가벽 로딩하기
                _this.fakeWallManager.setZoneID(null);
                _this.fakeWallManager.showFakeWalls();

                // 영역 생성 관련
                if (_this.equipZoneAreaManager)
                    _this.equipZoneAreaManager.showEquipZoneAreas();
            }
        });
    }

    // BoundingBox 모델의 그림자를 없앤다.
    removeBoundingBoxShadow(modelNode) {
        if (modelNode.name.endsWith(SDMSDataManager.BoundingBoxTag)) {
            modelNode.castShadow = false;
            modelNode.receiveShadow = false;
        }

        const childCount = modelNode.children.length;

        for (let i = 0; i < childCount; i++) {
            const child = modelNode.children[i];
            this.removeBoundingBoxShadow(child);
        }
    }

    async loadAlarmModels(_3dOptions) {
        this.loadAnimationFile(Contents3D.Alarm_Model[Contents3D.ALARM_2 - 1], false, Contents3D.ALARM_2, _3dOptions);
        this.loadAnimationFile(Contents3D.Alarm_Model[Contents3D.ALARM_3 - 1], false, Contents3D.ALARM_3, _3dOptions);
        this.loadAnimationFile(Contents3D.Alarm_Model[Contents3D.ALARM_4 - 1], false, Contents3D.ALARM_4, _3dOptions);
    }

    // 실내공간 로딩
    async loadIndoorModels(_3dOptions) {
        /*let fileCount = 0;
        for (const buildingGroupName in _3dOptions.indoorModels) {
            const buildingGroup = _3dOptions.indoorModels[buildingGroupName];

            for (const buildingName in buildingGroup) {
                const building = buildingGroup[buildingName];

                if (building && building.floors) {
                    const floorCount = building.floors.length;

                    for (let i = 0; i < floorCount; i++) {
                        const floor = building.floors[i];

                        if (floor.file && floor.camera) {
                            fileCount++;
                        }
                    }
                }
            }
        }

        this.indoorModelCount = fileCount;*/
        for (const buildingGroupName in _3dOptions.indoorModels) {
            const buildingGroup = _3dOptions.indoorModels[buildingGroupName];

            for (const buildingName in buildingGroup) {
                const building = buildingGroup[buildingName];

                if (building && building.floors) {
                    const floorCount = building.floors.length;

                    for (let i = 0; i < floorCount; i++) {
                        const floor = building.floors[i];

                        if (floor.file && floor.camera) {
                            this.addEquipZoneText(floor.zoneID, _3dOptions);
                            this.loadFile(floor.file, false, floor.camera, Contents3D.Mode_Indoor, _3dOptions);
                        }
                    }
                }
            }
        }
    }

    timelog(log) {
        const now = new Date();
        const time = now.getMinutes() + ":" + now.getSeconds();
        // console.log(time + " : " + log);
    }

    static setWorldBox(localBox, worldBox, mesh) {
        let parent = mesh.parent;

        while (parent) {
            localBox.max.x += parent.position.x;
            localBox.max.y += parent.position.y;
            localBox.max.z += parent.position.z;

            localBox.min.x += parent.position.x;
            localBox.min.y += parent.position.y;
            localBox.min.z += parent.position.z;

            parent = parent.parent;
        }

        if (Number.isFinite(worldBox.max.x) === false) {
            worldBox.max.x = localBox.max.x;
            worldBox.max.y = localBox.max.y;
            worldBox.max.z = localBox.max.z;

            worldBox.min.x = localBox.min.x;
            worldBox.min.y = localBox.min.y;
            worldBox.min.z = localBox.min.z;
        }
        else {
            if (worldBox.max.x < localBox.max.x)
                worldBox.max.x = localBox.max.x;
            if (worldBox.max.y < localBox.max.y)
                worldBox.max.y = localBox.max.y;
            if (worldBox.max.z < localBox.max.z)
                worldBox.max.z = localBox.max.z;

            if (worldBox.min.x > localBox.min.x)
                worldBox.min.x = localBox.min.x;
            if (worldBox.min.y > localBox.min.y)
                worldBox.min.y = localBox.min.y;
            if (worldBox.min.z > localBox.min.z)
                worldBox.min.z = localBox.min.z;
        }
    }

    loadFile(contents, visible, cameraOptions, mode, _3dOptions, postMethod = null, postMethodParam = null) {
        // Model 파일이 여러개로 나뉘어져 있을 경우
        /*if (Array.isArray(contents)) {
            SpatialManager.loadPartialFiles(contents, visible, cameraOptions, mode, _3dOptions, this, postMethod, postMethodParam);
            return;
        }*/

        if (visible) {
            this.setState({ loading: true });
        }

        const fileName = _3dOptions.modelBaseURL + "/" + contents;
        const worldBox = new THREE.Box3();

        let loader = null;

        if (fileName.endsWith('.fbx')) {
            loader = new FBXLoader();
        } else if (fileName.endsWith('.glb') || fileName.endsWith('.gltf')) {
            loader = new GLTFLoader();
            // Optional: Provide a DRACOLoader instance to decode compressed mesh data
            const dracoLoader = new DRACOLoader();
            dracoLoader.setDecoderPath('/three/examples/js/libs/draco/');
            loader.setDRACOLoader(dracoLoader);
        }

        // 서로다른 Zone에서 같은 모델 파일을 로딩하는 경우 굳이 같은 파일을 여러번 로딩하지 않도록 한다.
        if (this.internalTryModels[contents]) {
            this.onAfterLoadFile(contents, _3dOptions, mode, postMethod, postMethodParam);
            return;
        }
        else {
            this.internalTryModels[contents] = true;
        }

        const _this = this;
        //const mode = this.state.mode;

        loader.load(fileName, function (object) {
            const obj = loader instanceof GLTFLoader ? object.scene : object;
            obj.traverse((child) => {
                /*child.getWorldPosition(worldPos);
                child.getWorldScale(worldScale);
                child.getWorldQuaternion(worldQuat);*/

                if (child instanceof THREE.Mesh) {
                    child.castShadow = mode !== Contents3D.Mode_Indoor;
                    child.receiveShadow = mode !== Contents3D.Mode_Indoor;
                    //worldBox.expandByObject(child);

                    const localBox = new THREE.Box3();
                    localBox.expandByObject(child);
                    Contents3D.setWorldBox(localBox, worldBox, child);
                }
            });

            const modelNode = new THREE.Object3D();
            modelNode.add(obj);
            modelNode.matrixAutoUpdate = false;
            modelNode.name = contents;

            _this.optionManager.setModelSize(modelNode.name, worldBox);

            if (_this.isIndoor() && mode !== Contents3D.Mode_Indoor) {
                // 실내모드일 경우 외부모델 파일을 로딩하면 무조건 안보이도록 한다.
                modelNode.visible = false;
            }
            else {
                modelNode.visible = visible;
            }

            _this.scene.add(modelNode);
            modelNode.updateMatrixWorld(true);

            // AnimationModel이 있는지 확인한다.
            _this.loadAnimationModels(object, modelNode);

            if (mode === Contents3D.Mode_Outdoor_All || mode === contents.Mode_Outdoor_Part) {
                Contents3D.hideBoundingBoxes(modelNode, _3dOptions.buildingGroups, _3dOptions.buildings);
            }

            if (mode === Contents3D.Mode_Outdoor_Part/*visible*/) {
                _this.onCompleteOutdoorModelLoading(modelNode, _3dOptions);

                const facilityGroup = Contents3D.showFacilities(modelNode, false, _this.facilityMaps);

                if (facilityGroup) {
                    _this.outdoorFacilities[contents] = facilityGroup;
                }
            }
            else {
                const exitArrowData = Contents3D.showExit(modelNode, false);
                _this.internalModels[contents] = [modelNode, cameraOptions, exitArrowData && exitArrowData.length >= 1 ? exitArrowData[0] : null, exitArrowData && exitArrowData.length >= 2 ? exitArrowData[1] : null];

                const facilityGroup = Contents3D.showFacilities(modelNode, false, _this.facilityMaps);
                _this.internalModels[contents].push(facilityGroup);
            }

            _this.onAfterLoadFile(contents, _3dOptions, mode, postMethod, postMethodParam);
            delete _this.internalTryModels[contents];
            _this.timelog(contents);
        });
    }

    onAfterLoadFile(contents, _3dOptions, mode, postMethod, postMethodParam) {
        if (mode === Contents3D.Mode_Indoor && this.indoorModelCount > 0) {

            // 실내모델이 미리 로딩된 경우만 카운팅
            if (_3dOptions.indoorModelOnMemory)
                this.indoorModelCountTemp++;

            const rate = this.indoorModelCountTemp / this.indoorModelCount * 100;

            if (rate >= 100) {
                AccountController.loading3DChk = false;
                this.optionManager.onLoadingComplete(this.props.currentView?.zoneID, this.props.currentView.buildingID === null, this.currentModel?.name);
                this.setFloorBoundingBox();
                this.setState({ progressValue: rate, progressActive: false });

                if (_3dOptions.indoorModelOnMemory) {
                    // 실내 모델을 메모리에 미리 로딩해 놓고 필요할때 꺼내어 쓰는 경우
                    this.loadNextSiteModels();
                    // 실내 모델이 로딩되지 않아서 표시하지 못했던 알람정보를 표현한다.
                    this.showLazyAlarmData();
                } 
            } 
            else if (_3dOptions.indoorModelOnMemory === false) {
                // 실내모델이 미리 로딩되지 않은 경우

                // 실내모델 파일 로딩이 끝나지 않아서 못한 카메라 셋팅
                this.showLazyMovingCamera();

                // 실내모델 파일 로딩이 끝나지 않아서 보여주지 못했던 층 정보(textPOI, SensorPOI 등)
                this.showLazyIndoorData();

                // 실내모델이 미리 로딩되지 않아서 보여주지 못한 알람 모델링
                this.showLazyAlarmModel(contents);
            }
            else {
                AccountController.loading3DChk = true;
                this.setState({ progressValue: rate });
            }
        }

        this.setState({ loading: false });

        if (postMethod) {
            if (postMethodParam !== null) {
                postMethod(postMethodParam);
            }
            else {
                postMethod();
            }
        }
    }

    // 층별 BoundingBox 모델을 설정한다.(경기융합센터)
    setFloorBoundingBox() {
        if (ProjectResource.siteNo === ProjectResource.Site.GG_A) {
            FloorBoundingBoxManager.setFloorBoundingBox(this);
            this.props.setFloorBoundingBoxManager(this.floorBoundingBoxManager);
        }
    }

    loadNextSiteModels() {
        for (const siteID in this.props.site3dOptions) {
            if (this.loadingSiteIDs.includes(siteID) === false) {
                this.loadingSiteIDs.push(siteID);

                // console.log("load Site" + siteID);
                const _3dOptions = this.props.site3dOptions[siteID];

                if (_3dOptions) {
                    const modelFiles = this.getOutdoorModelFiles(_3dOptions);
                    this.loadOutdoorModelFiles(modelFiles, _3dOptions, false);
                    return;
                }
            }
        }
    }

    loadAnimationFile(contents, visible, alarmLevel, _3dOptions) {
        const fileName = _3dOptions.modelBaseURL + "/" + contents;

        let loader = null;

        if (fileName.endsWith('.fbx')) {
            loader = new FBXLoader();
        } else if (fileName.endsWith('.glb') || fileName.endsWith('.gltf')) {
            loader = new GLTFLoader();
            // Optional: Provide a DRACOLoader instance to decode compressed mesh data
            const dracoLoader = new DRACOLoader();
            dracoLoader.setDecoderPath('/three/examples/js/libs/draco/');
            loader.setDRACOLoader(dracoLoader);
        }

        const _this = this;

        loader.load(fileName, function (object) {
            const obj = loader instanceof GLTFLoader ? object.scene : object;
            obj.traverse((child) => {
                if (child instanceof THREE.Mesh) {
                    child.castShadow = false;
                    child.receiveShadow = false;
                }
            });

            const modelNode = new THREE.Object3D();
            modelNode.add(obj);
            modelNode.matrixAutoUpdate = false;
            modelNode.name = contents;
            modelNode.visible = visible;

            _this.scene.add(modelNode);
            modelNode.updateMatrixWorld(true);

            if (object.animations.length > 0) {
                const childCount = modelNode.children.length;

                // animation Object는 직접 옮길수 없고 child object들을 모두 옮겨야 한다.
                for (let i = 0; i < childCount; i++) {
                    const childModel = modelNode.children[i];
                    childModel.position.y += 10;
                    childModel.scale.x *= 0.20;
                    childModel.scale.z *= 0.20;

                    const meshCount = childModel.children.length;

                    // animation Object에 의한 그림자가 생기는것을 차단한다.
                    for (let j = 0; j < meshCount; j++) {
                        const childMesh = childModel.children[j];
                        childMesh.castShadow = false;
                        childMesh.receiveShadow = false;
                    }
                }

                const mixer = new THREE.AnimationMixer(modelNode);

                for (let i = 0; i < object.animations.length; i++) {
                    mixer.clipAction(object.animations[i]).play();;
                }

                //_this.alarmAnimationMixers[alarmLevel - 1] = mixer;
                //_this.alarmModels[alarmLevel - 1] = modelNode;

                _this.alarmAnimationMixers[alarmLevel - 1].push(mixer);
                _this.alarmModels[alarmLevel - 1].push(modelNode);

                for (let i = 0; i < 99; i++) {
                    const cloneModel = modelNode.clone();
                    _this.alarmModels[alarmLevel - 1].push(cloneModel);
                    _this.scene.add(cloneModel);

                    const mixer2 = new THREE.AnimationMixer(cloneModel);

                    for (let j = 0; j < object.animations.length; j++) {
                        mixer2.clipAction(object.animations[j]).play();;
                    }

                    _this.alarmAnimationMixers[alarmLevel - 1].push(mixer2);
                }

                modelNode.updateMatrixWorld(true);

                _this.timelog(contents);
            }
        });
    }

    loadAnimationModels(object, modelNode) {
        if (!object?.animations) {
            return;
        }

        if (object.animations.length > 0) {
            const mixer = new THREE.AnimationMixer(modelNode);

            for (let i = 0; i < object.animations.length; i++) {
                mixer.clipAction(object.animations[i]).play();;
            }

            const animationModel = new AnimationModel(mixer, modelNode);
            this.modelAnimations[modelNode.name] = animationModel;
        }
    }

    addMoving(movingGroup, movingChildren, interval) {
        movingGroup.visible = true;

        const moving = {
            models: movingChildren,
            interval: interval,
            delta: 0
        };

        this.movingDatas.push(moving);
    }

    clearMoving() {
        this.movingDatas = [];
    }

    // interval : 초
    addBlink(modelNode, interval, wait) {
        modelNode.visible = false;

        const blink = {
            model: modelNode,
            interval: interval,
            wait: wait,
            delta: 0,
            visible: modelNode.visible
        };

        this.blinkDatas.push(blink);
    }

    removeBlink(modelNode, visible) {
        const blinkCount = this.blinkDatas.length;

        for (let i = 0; i < blinkCount; i++) {
            const blink = this.blinkDatas[i];

            if (blink.model === modelNode) {
                this.blinkDatas.splice(i, 1);
                break;
            }
        }

        modelNode.visible = visible;
    }

    clearBlink(visible) {
        const blinkCount = this.blinkDatas.length;

        for (let i = 0; i < blinkCount; i++) {
            const blink = this.blinkDatas[i];
            blink.model.visible = visible;
        }

        this.blinkDatas = [];
    }

    static showFacilities(modelNode, visible, facilityMaps) {
        const childCount = modelNode.children.length;

        if (modelNode.name.startsWith(Contents3D.FacilityHeadTag) && modelNode.name.endsWith(SDMSDataManager.BoundingBoxTag)) {
            /*if (visible) {
                modelNode.visible = visible;
            }
            else {
                modelNode.visible = false;
            }*/

            for (let i = 0; i < childCount; i++) {
                const child = modelNode.children[i];
                facilityMaps[child.name] = child;

                if (visible) {
                    child.visible = visible;
                }
                else {
                    child.visible = false;
                }
            }

            return modelNode;
        }

        for (let i = 0; i < childCount; i++) {
            const child = Contents3D.showFacilities(modelNode.children[i], visible, facilityMaps);

            if (child !== null) {
                return child;
            }
        }

        return null;
    }

    static showExit(modelNode, visible) {
        if (modelNode.name.startsWith(Contents3D.ExitArrowGroupTag)) {
            if (visible) {
                modelNode.visible = visible;
            }
            else {
                modelNode.visible = false;
            }

            return [modelNode, Contents3D.setArrowDatas(modelNode)];
        }

        const childCount = modelNode.children.length;

        for (let i = 0; i < childCount; i++) {
            const child = Contents3D.showExit(modelNode.children[i], visible);

            if (child !== null) {
                return child;
            }
        }

        return null;
    }

    static setArrowDatas(modelNode) {
        const childCount = modelNode.children.length;
        const datas = {};

        const beginLength = Contents3D.ExitArrowBeginTag.length;
        const endLength = Contents3D.ExitArrowEndTag.length;

        for (let i = 0; i < childCount; i++) {
            const child = modelNode.children[i];

            if (child.name.startsWith(Contents3D.ExitArrowBeginTag)) {
                const tagName = child.name.substring(beginLength);
                let data = datas[tagName];

                if (data) {
                    data.begin = child;
                }
                else {
                    data = { begin: child };
                    datas[tagName] = data;
                }
            }
            else if (child.name.startsWith(Contents3D.ExitArrowEndTag)) {
                const tagName = child.name.substring(endLength);
                let data = datas[tagName];

                if (data) {
                    data.end = child;
                }
                else {
                    data = { end: child };
                    datas[tagName] = data;
                }
            }
        }

        const arrowDatas = [];

        for (const key in datas) {
            const data = datas[key];

            if (data.begin && data.end) {
                data.end.visible = false;
                const distance = Geometry.getDistance3(data.begin.position.x, data.begin.position.y, data.begin.position.z, data.end.position.x, data.end.position.y, data.end.position.z);
                arrowDatas.push([data.begin, new Vector3(data.begin.position.x, data.begin.position.y, data.begin.position.z), new Vector3(data.end.position.x, data.end.position.y, data.end.position.z), distance]);
            }
        }

        return arrowDatas;
    }

    static hideBoundingBoxes(obj, buildingGroups, buildings) {
        let childCount = obj.children.length;

        if (childCount === 1) {
            obj = obj.children[0];
            childCount = obj.children.length;
        }

        const buildingGroupCount = buildingGroups.length;

        // BoundingBox 감추기
        for (let i = 0; i < childCount; i++) {
            const child = obj.children[i];

            if (child.name.endsWith(SDMSDataManager.BoundingBoxTag)) {
                child.visible = false;
            }

            /*let findObject = false;

            if (child.name.endsWith(SDMSDataManager.BoundingBoxTag) === false)
                continue;

            for (let j = 0; j < buildingGroupCount; j++) {
                const buildingGroup = buildingGroups[j];

                if (child.name === buildingGroup[2]) {
                    child.visible = false;
                    findObject = true;
                    break;
                }
            }

            if (findObject) {
                continue;
            }

            findObject = Contents3D.hideBuildingBoundingBox(child, buildings);

            if (findObject === false) {
                console.log("unknown building name : " + child.name);
            }*/
        }
    }

    static hideBuildingBoundingBox(obj, buildings) {
        for (const buildingGroupName in buildings) {
            const buildingGroup = buildings[buildingGroupName];

            for (const buildingName in buildingGroup) {
                const building = buildingGroup[buildingName];

                if (obj.name === building[2]) {
                    obj.visible = false;
                    return true;
                }
            }
        }

        return false;
    }

    setMovingCamera(cameraOptions, mode, param, speedUpRatio) {
        this.setState({ loading: true });

        const distancePos = Geometry.getDistance3(this.camera.position.x, this.camera.position.y, this.camera.position.z, cameraOptions.position[0], cameraOptions.position[1], cameraOptions.position[2]);
        const distanceQua = cameraOptions.quaternion === null ? null : Geometry.getDistance4(this.camera.quaternion.x, this.camera.quaternion.y, this.camera.quaternion.z, this.camera.quaternion.w, cameraOptions.quaternion[0], cameraOptions.quaternion[1], cameraOptions.quaternion[2], cameraOptions.quaternion[3]);
        const distanceRot = Geometry.getDistance3(this.camera.rotation.x, this.camera.rotation.y, this.camera.rotation.z, cameraOptions.rotation[0], cameraOptions.rotation[1], cameraOptions.rotation[2]);

        const movingTime = 0.75;
        let speedUp = null;

        if (speedUpRatio !== undefined && speedUpRatio !== null && speedUpRatio.length >= 2) {
            speedUp = {
                begin: movingTime * speedUpRatio[0],
                end: movingTime * speedUpRatio[1]
            }
        }

        this.movingCamera = {
            // 초
            movingTime: movingTime,
            //movingTime: 1.5,
            elapsedTime: 0,
            speedUp: speedUp,
            distancePosition: distancePos,
            distanceQuaternion: distanceQua,
            distanceRotation: distanceRot,
            beginCameraPos: new THREE.Vector3(this.camera.position.x, this.camera.position.y, this.camera.position.z),
            beginCameraQuaternion: new THREE.Quaternion(this.camera.quaternion.x, this.camera.quaternion.y, this.camera.quaternion.z, this.camera.quaternion.w),
            beginCameraRotation: new THREE.Vector3(this.camera.rotation.x, this.camera.rotation.y, this.camera.rotation.z),
            targetCameraOptions: cameraOptions,
            fov: cameraOptions.fov,
            far: cameraOptions.far,
            near: cameraOptions.near,
            mode: mode,
            param: param
        };

        // 실내로 이동할 때에는 이동이 끝난후에 outdoor를 감춘다.
        if (mode !== Contents3D.Mode_Indoor) {
            this.showOutdoor(mode);
        }
    }

    moveCamera(delta) {
        const cameraOptions = {
            position: [],
            quaternion: [],
            rotation: [],
            targetControl: [...this.movingCamera.targetCameraOptions.targetControl]
        }

        if (this.movingCamera) {
            if (this.movingCamera.elapsedTime === 0) {
                this.timelog("begin camera move");
            }

            if (this.movingCamera.speedUp !== null && this.movingCamera.speedUp !== undefined && this.movingCamera.elapsedTime >= this.movingCamera.speedUp.begin && this.movingCamera.elapsedTime <= this.movingCamera.speedUp.end) {
                // speedUp 구간에서는 속도를 2배로 올린다.
                this.movingCamera.elapsedTime += delta * 2;
            }
            else {
                this.movingCamera.elapsedTime += delta;
            }

            if (this.movingCamera.elapsedTime >= this.movingCamera.movingTime) {
                const movingCamera = this.movingCamera;
                this.movingCamera = null;

                cameraOptions.position = [...movingCamera.targetCameraOptions.position];
                cameraOptions.quaternion = movingCamera.targetCameraOptions.quaternion === null ? null : [...movingCamera.targetCameraOptions.quaternion];
                cameraOptions.rotation = [...movingCamera.targetCameraOptions.rotation];

                Contents3D.setCamera(this.camera, this.controls, cameraOptions);
                //this.camera.updateProjectionMatrix();

                this.postMoveCamera(movingCamera.mode, movingCamera.fov, movingCamera.far, movingCamera.near, movingCamera.param);
                this.optionManager.onPostChangeView(this.props.currentView?.zoneID, this.props.currentView?.buildingID === null, this.currentModel?.name);

                if (this.cameraRotation) {
                    this.cameraRotation[1] = Geometry.getDistance3(this.camera.position.x, this.camera.position.y, this.camera.position.z, this.controls.target.x, this.controls.target.y, this.controls.target.z);
                }

                this.timelog("end camera move");
                this.setState({ loading: false });
            }
            else {
                cameraOptions.position = Geometry.getLinearVertex3(this.movingCamera.beginCameraPos.x, this.movingCamera.beginCameraPos.y, this.movingCamera.beginCameraPos.z, this.movingCamera.targetCameraOptions.position[0], this.movingCamera.targetCameraOptions.position[1], this.movingCamera.targetCameraOptions.position[2], this.movingCamera.distancePosition * this.movingCamera.elapsedTime / this.movingCamera.movingTime);
                cameraOptions.quaternion = this.movingCamera.targetCameraOptions.quaternion === null ? null : Geometry.getLinearVertex4(this.movingCamera.beginCameraQuaternion.x, this.movingCamera.beginCameraQuaternion.y, this.movingCamera.beginCameraQuaternion.z, this.movingCamera.beginCameraQuaternion.w, this.movingCamera.targetCameraOptions.quaternion[0], this.movingCamera.targetCameraOptions.quaternion[1], this.movingCamera.targetCameraOptions.quaternion[2], this.movingCamera.targetCameraOptions.quaternion[3], this.movingCamera.distanceQuaternion * this.movingCamera.elapsedTime / this.movingCamera.movingTime);
                cameraOptions.rotation = Geometry.getLinearVertex3(this.movingCamera.beginCameraRotation.x, this.movingCamera.beginCameraRotation.y, this.movingCamera.beginCameraRotation.z, this.movingCamera.targetCameraOptions.rotation[0], this.movingCamera.targetCameraOptions.rotation[1], this.movingCamera.targetCameraOptions.rotation[2], this.movingCamera.distanceRotation * this.movingCamera.elapsedTime / this.movingCamera.movingTime);

                Contents3D.setCamera(this.camera, this.controls, cameraOptions);
            }
        }
    }

    postMoveCamera(mode, fov, far, near, param) {
        if (Contents3D.MoveNHide && this.tempInternalModels) {
            SpatialManager.postShowIndoor(this.tempInternalModels, this);
            this.tempInternalModels = null;
        }

        if (mode === Contents3D.Mode_Indoor) {
            if (this.prevIndoorModel) {
                this.prevIndoorModel.visible = true;
            }

            if (SDMS.UseWalkingAvatar) {
                this.walker.moveToZone(this.getCurrentZoneID());
            }
        }

        if (this.camera) {
            this.camera.fov = fov;
            this.camera.far = far;
            this.camera.near = near;
        }

        this.showOutdoor(mode);

        if (param) {
            /*if (param.zoneID !== null && param.zoneID !== undefined) {
                this.poiManager.addZoneSensors(param.zoneID, POIManager.IndoorPoiScale, this.props._3dOptions.outdoorZones, this.props._3dOptions.zones, this.props.visibleSensorTypes);

                this.textPOIManager.hideEquipZoneSprites();
                this.textPOIManager.showEquipZoneSprites(param.zoneID);
                this.fakeWallManager.showFakeWalls();

                if (param.sensorType && param.sensorID !== null && param.sensorID !== undefined) {
                    this.moveToSensor(param.zoneID, param.sensorType, param.sensorID);
                }
            }*/

            if (param.method) {
                param.method(param.methodParam);
            }

            if (mode === Contents3D.Mode_Outdoor_All) {
                if (param.prevSiteID) {
                    // 이전 사이트의 외부모델을 감춘다.
                    this.setOutdoorModelVisible(param.prevSiteID, false);
                }

                if (param.currentSiteID) {
                    // 현재 사이트의 텍스트를 표시한다.
                    this.textPOIManager.setVisible(true, param.currentSiteID);
                }
            }
        }
        else if (this.props.multiSite === true && mode === Contents3D.Mode_Outdoor_All && this.siteOutdoorModels[this.props.currentSiteID]) {
            const currentSiteOutdoorModels = this.siteOutdoorModels[this.props.currentSiteID];

            // .TODO: 멀티 사이트 경우, 다른 외곽으로 이동시 현재 외곽 숨김
            for (const siteID in this.siteOutdoorModels) {
                // 현재 사이트 외부영역 제외
                if (this.props.currentSiteID?.toString() === siteID)
                    continue;

                // 전 사이트 외부영역 끄기
                const _outdoorModels = this.siteOutdoorModels[siteID];

                for (const outdoorModel of _outdoorModels) {
                    // 현재 사이트의 모델과 같은 모델을 공유하고 있다면 감추면 안된다.
                    if (this.includeModel(outdoorModel, currentSiteOutdoorModels) === false) {
                        outdoorModel.visible = false;
                    }
                }
                /*_outdoorModels.map(model => {
                    model.visible = false;
                });*/
            }
        }
    }

    includeModel(model, models) {
        for (const _model of models) {
            if (model === _model) {
                return true;
            }
        }

        return false;
    }

    static setCamera(camera, controls, cameraOptions) {
        if (camera?.position) 
            camera.position.set(cameraOptions.position[0], cameraOptions.position[1], cameraOptions.position[2]);
       
        if (camera && cameraOptions && cameraOptions.quaternion)
            camera.quaternion.set(cameraOptions.quaternion[0], cameraOptions.quaternion[1], cameraOptions.quaternion[2], cameraOptions.quaternion[3]);
        
        if (camera?.rotation)
            camera.rotation.set(cameraOptions.rotation[0], cameraOptions.rotation[1], cameraOptions.rotation[2]);
        if (controls?.target)
            controls.target.set(cameraOptions.targetControl[0], cameraOptions.targetControl[1], cameraOptions.targetControl[2]);

        if (camera && cameraOptions) {
            camera.near = cameraOptions.near;
            camera.far = cameraOptions.far;
            camera.fov = cameraOptions.fov;
        }
    }

    static onWindowResize(camera, renderer) {
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(window.innerWidth, window.innerHeight);
    }

    onKeyDown = (event) => {
        if (this.props.editMode === Contents3D.Edit_Mode_FakeWall) {
            this.fakeWallManager.onKeyDown(event);
            return;
        } else if (this.props.editMode === Contents3D.Edit_Mode_Text) {
            this.equipZoneAreaManager.onKeyDown(event);
            return;
        } else if (this.props.editModeManager.poiEditMode === EditModeManager.ChangeEquipZone_OneClick) {
            // 모드 전환
            this.props.editModeManager.poiEditMode = EditModeManager.ChangeEquipZone;
            // EquipZone 명칭 하이라이트 제거
            this.props.onSelectEquipZonePOI(null);
            // 선택된 POI 해제
            this.poiManager.selectPOI(null, this.props.editMode, this.props.editModeParam);
            this.props.onSelectPOI(null, false, this);
            return;
        }

        if (this.walker) {
            this.walker.move(event);
        }
    }

    getMousePos(event) {
        const x = event.nativeEvent.offsetX;
        const y = event.nativeEvent.offsetY;
        const mouse = new THREE.Vector2((x / window.innerWidth) * 2 - 1, -(y / window.innerHeight) * 2 + 1);

        const raycaster = new THREE.Raycaster();
        raycaster.setFromCamera(mouse, this.camera);

        const intersects = raycaster.intersectObjects(this.scene.children, true);
        const intersectCount = intersects.length;

        if (intersectCount > 0) {
            const nearestIntersect = this.sortIntersects(intersects, intersectCount);

            if (nearestIntersect) {
                /*console.log(nearestIntersect);

                const tab = '\t';
                let str = `mouse Point${tab}${this.camera.position.x}${tab}${this.camera.position.y}${tab}${this.camera.position.z}${tab}${this.camera.quaternion.x}${tab}${this.camera.quaternion.y}${tab}${this.camera.quaternion.z}${tab}${this.camera.quaternion.w}${tab}${this.camera.rotation.x}${tab}${this.camera.rotation.y}${tab}${this.camera.rotation.z}${tab}${nearestIntersect.point.x}${tab}${nearestIntersect.point.y}${tab}${nearestIntersect.point.z}`;
                console.log(str);*/

                if (event.altKey && event.ctrlKey && this.isIndoor()) {
                    // DB에 직접 값을 저장한다.
                    this.saveIndoorModelViewport({ ...this.camera }, nearestIntersect);
                }
            }
        }
    }

    async saveIndoorModelViewport(camera, target) {
        const modelName = this.currentModel?.name;

        if (!modelName) {
            return false;
        }

        const cameraData = {
            pos: {
                x: camera.position.x,
                y: camera.position.y,
                z: camera.position.z
            },
            quaternion: {
                x: camera.quaternion.x,
                y: camera.quaternion.y,
                z: camera.quaternion.z,
                w: camera.quaternion.w
            },
            rotation: {
                x: camera.rotation.x,
                y: camera.rotation.y,
                z: camera.rotation.z
            }
        };

        if (this.props.isEditMode) {
            cameraData.zoom = camera.zoom;
            cameraData.target = {
                x: target ? target.point.x : this.controls.target.x,
                y: target ? target.point.y : this.controls.target.y,
                z: target ? target.point.z : this.controls.target.z
            }
        }
        else {
            cameraData.orbitTarget = {
                x: target ? target.point.x : this.controls.target.x,
                y: target ? target.point.y : this.controls.target.y,
                z: target ? target.point.z : this.controls.target.z
            }
        }

        const result = this.props.isEditMode ? await SDMSController.requestSaveOrthoModelViewport(modelName, cameraData, this.props.currentView.zoneID) : await SDMSController.requestSaveIndoorModelViewport(modelName, cameraData, this.props.currentView.zoneID);

        if (result?.success) {
            const floor = this.getModelFloor(/*modelName*/this.props.currentView.zoneID);

            if (floor) {
                if (!floor.camera) {
                    floor.camera = {
                        far: 5000,
                        fov: 60,
                        near: 0.1
                    };
                }

                if (this.props.isEditMode) {
                    if (!floor.cameraOrtho) {
                        floor.cameraOrtho = {};
                    }

                    floor.cameraOrtho.position = [cameraData.pos.x, cameraData.pos.y, cameraData.pos.z];
                    floor.cameraOrtho.quaternion = [cameraData.quaternion.x, cameraData.quaternion.y, cameraData.quaternion.z, cameraData.quaternion.w];
                    floor.cameraOrtho.rotation = [cameraData.rotation.x, cameraData.rotation.y, cameraData.rotation.z];
                    floor.cameraOrtho.targetControl = [cameraData.target.x, cameraData.target.y, cameraData.target.z];
                    floor.cameraOrtho.zoom = cameraData.zoom;
                }
                else {
                    floor.camera.position = [cameraData.pos.x, cameraData.pos.y, cameraData.pos.z];
                    floor.camera.quaternion = [cameraData.quaternion.x, cameraData.quaternion.y, cameraData.quaternion.z, cameraData.quaternion.w];
                    floor.camera.rotation = [cameraData.rotation.x, cameraData.rotation.y, cameraData.rotation.z];
                    floor.camera.targetControl = [cameraData.orbitTarget.x, cameraData.orbitTarget.y, cameraData.orbitTarget.z];
                }
            }
            /*const index = modelName.indexOf('/');

            if (index !== null && index !== undefined) {
                const buildingGroupName = modelName.substring(0, index);
                const buildingGroup = this.props._3dOptions.indoorModels[buildingGroupName];

                if (buildingGroup) {
                    let processed = false;

                    for (const buildingName in buildingGroup) {
                        const building = buildingGroup[buildingName];

                        if (building && building.floors) {
                            const floorCount = building.floors.length;

                            for (let i = 0; i < floorCount; i++) {
                                const floor = building.floors[i];

                                if (floor.file === modelName) {
                                    if (!floor.camera) {
                                        floor.camera = {
                                            far: 5000,
                                            fov: 60,
                                            near: 0.1
                                        };
                                    }

                                    if (this.props.isEditMode) {
                                        if (!floor.cameraOrtho) {
                                            floor.cameraOrtho = {};
                                        }

                                        floor.cameraOrtho.position = [cameraData.pos.x, cameraData.pos.y, cameraData.pos.z];
                                        floor.cameraOrtho.quaternion = [cameraData.quaternion.x, cameraData.quaternion.y, cameraData.quaternion.z, cameraData.quaternion.w];
                                        floor.cameraOrtho.rotation = [cameraData.rotation.x, cameraData.rotation.y, cameraData.rotation.z];
                                        floor.cameraOrtho.targetControl = [cameraData.target.x, cameraData.target.y, cameraData.target.z];
                                        floor.cameraOrtho.zoom = cameraData.zoom;
                                    }
                                    else {
                                        floor.camera.position = [cameraData.pos.x, cameraData.pos.y, cameraData.pos.z];
                                        floor.camera.quaternion = [cameraData.quaternion.x, cameraData.quaternion.y, cameraData.quaternion.z, cameraData.quaternion.w];
                                        floor.camera.rotation = [cameraData.rotation.x, cameraData.rotation.y, cameraData.rotation.z];
                                        floor.camera.targetControl = [cameraData.orbitTarget.x, cameraData.orbitTarget.y, cameraData.orbitTarget.z];
                                    }

                                    processed = true;
                                    break;
                                }
                            }

                            if (processed) {
                                break;
                            }
                        }
                    }
                }
            }*/

            return true;
        }

        return false;
    }

    getModelFloor(/*modelName, */zoneID) {
        const indoorModels = this.props._3dOptions.indoorModels;

        for (const buildingGroupName in indoorModels) {
            const buildingGroupData = indoorModels[buildingGroupName];

            for (const buildingName in buildingGroupData) {
                const buildingData = buildingGroupData[buildingName];

                if (!buildingData) {
                    continue;
                }

                const floors = buildingData.floors;

                if (floors) {
                    const floorCount = floors.length;

                    for (let i = 0; i < floorCount; i++) {
                        const floor = floors[i];

                        if (floor.zoneID === zoneID) {
                        //if (floor.file === modelName) {
                            return floor;
                        }
                    }
                }
            }
        }

        return null;
    }

    async saveOutdoorModelViewport(camera, target) {
        const modelName = this.props._3dOptions.outdoorModel.file;

        if (!modelName) {
            return false;
        }

        const cameraData = {
            pos: {
                x: camera.position.x,
                y: camera.position.y,
                z: camera.position.z
            },
            quaternion: {
                x: camera.quaternion.x,
                y: camera.quaternion.y,
                z: camera.quaternion.z,
                w: camera.quaternion.w
            },
            rotation: {
                x: camera.rotation.x,
                y: camera.rotation.y,
                z: camera.rotation.z
            }
        };

        if (this.props.isEditMode) {
            cameraData.zoom = camera.zoom;
            cameraData.target = {
                x: target ? target.point.x : this.controls.target.x,
                y: target ? target.point.y : this.controls.target.y,
                z: target ? target.point.z : this.controls.target.z
            }
        }
        else {
            cameraData.orbitTarget = {
                x: target ? target.point.x : this.controls.target.x,
                y: target ? target.point.y : this.controls.target.y,
                z: target ? target.point.z : this.controls.target.z
            }
        }

        const result = this.props.isEditMode ? await SDMSController.requestSaveOrthoModelViewport(modelName, cameraData, this.props.currentView.zoneID) : await SDMSController.requestSaveIndoorModelViewport(modelName, cameraData, this.props.currentView.zoneID);

        if (result.success) {
            let outdoorCamera = this.props._3dOptions.outdoorModel.camera;

            if (!outdoorCamera) {
                outdoorCamera = {
                    far: 5000,
                    fov: 60,
                    near: 0.1
                };

                this.props._3dOptions.outdoorModel.camera = outdoorCamera;
            }

            if (this.props.isEditMode) {
                let outdoorCameraOrtho = this.props._3dOptions.outdoorModel.cameraOrtho;

                if (!outdoorCameraOrtho) {
                    outdoorCameraOrtho = {};
                    this.props._3dOptions.outdoorModel.cameraOrtho = outdoorCameraOrtho;
                }

                outdoorCameraOrtho.position = [cameraData.pos.x, cameraData.pos.y, cameraData.pos.z];
                outdoorCameraOrtho.quaternion = [cameraData.quaternion.x, cameraData.quaternion.y, cameraData.quaternion.z, cameraData.quaternion.w];
                outdoorCameraOrtho.rotation = [cameraData.rotation.x, cameraData.rotation.y, cameraData.rotation.z];
                outdoorCameraOrtho.targetControl = [cameraData.target.x, cameraData.target.y, cameraData.target.z];
                outdoorCameraOrtho.zoom = cameraData.zoom;
            }
            else {
                outdoorCamera.position = [cameraData.pos.x, cameraData.pos.y, cameraData.pos.z];
                outdoorCamera.quaternion = [cameraData.quaternion.x, cameraData.quaternion.y, cameraData.quaternion.z, cameraData.quaternion.w];
                outdoorCamera.rotation = [cameraData.rotation.x, cameraData.rotation.y, cameraData.rotation.z];
                outdoorCamera.targetControl = [cameraData.orbitTarget.x, cameraData.orbitTarget.y, cameraData.orbitTarget.z];
            }
            return true;
        }

        return false;
    }

    moveToBuildingGroupFromID(buildingGroupID) {
        const buildingGroups = this.props._3dOptions.buildingGroups;
        const buildingGroupCount = buildingGroups.length;

        for (let i = 0; i < buildingGroupCount; i++) {
            const buildingGroup = buildingGroups[i];

            if (buildingGroup.length >= 7 && buildingGroup[6] === buildingGroupID) {
                DataInfo.processBuildingGroupData(buildingGroupID, this.props.showBuildingInfo);
                this.moveToBuildingGroup(buildingGroup[0]);

                // 빌딩그룹 트리 열기 - K.D.R
                const buildingGroupInfo = this.props.getSpatialBuildingGroupInfo(buildingGroup[0]);
                if (buildingGroupInfo) {
                    this.props.onChangeBuildingGroup(buildingGroupInfo, SDMS.SelectedStatusInfoType.buildingGroup);
                }

                return;
            }
        }
    }

    moveToBuildingGroup(buildingGroupName) {
        if (this.props.multiSite) {
            for (const siteID in this.props.site3dOptions) {
                const site3dOptions = this.props.site3dOptions[siteID];
                const nSiteID = parseInt(siteID);

                if (!site3dOptions.buildingGroups) {
                    continue;
                }

                const buildingGroupCount = site3dOptions.buildingGroups.length;

                for (let i = 0; i < buildingGroupCount; i++) {
                    const buildingGroupData = site3dOptions.buildingGroups[0];

                    if (buildingGroupData[0] === buildingGroupName) {
                        if (this.props.currentSiteID === siteID || this.props.currentSiteID === nSiteID) {
                            this._moveToBuildingGroup(buildingGroupName);
                            return;
                        }
                        else {
                            this.props.changeSite(siteID);
                            return;
                        }
                    }
                }
            }
        }
        else {
            this._moveToBuildingGroup(buildingGroupName);
        }
    }

    _moveToBuildingGroup(buildingGroupName) {
        const modelName = buildingGroupName + SDMSDataManager.BoundingBoxTag;
        const buildingGroup = this.getBuildingGroupModel(modelName);

        if (buildingGroup && buildingGroup.camera) {
            DataInfo.processBuildingGroupData(buildingGroup.buildingGroupID, this.props.showBuildingInfo);
            this.setMovingCamera(buildingGroup.camera, Contents3D.Mode_Outdoor_Part, null);
        }
    }

    moveToIndoorFromID(buildingID) {
        const building = this.props._3dOptions.buildingIDs[buildingID]

        if (building) {
            const modelName = building[3];
            const indoorModel = this.getIndoorModel(modelName);

            if (indoorModel) {
                this.showIndoor(indoorModel.file, indoorModel.modelDisplayText, indoorModel.camera, indoorModel.zoneID);
            }
        }
    }

    moveToBuilding(buildingName) {
        const building = this.props._3dOptions.allBuildings[buildingName];

        if (building) {
            const buildingGroupName = building[1];
            const buildingGroup = this.props._3dOptions.indoorModels[buildingGroupName];

            if (buildingGroup) {
                const buildingModel = buildingGroup[buildingName];

                if (buildingModel && buildingModel.camera) {
                    this.setMovingCamera(buildingModel.camera, Contents3D.Mode_Outdoor_Part, null);
                }
            }
        }
    }

    getBuildingGroupIndoorModel(buildingGroupName, buildingName, buildingID) {
        const indoorModels = this.props._3dOptions.indoorModels;
        let buildingGroup = indoorModels[buildingGroupName];

        // 멀티 사이트 관련
        if (!buildingGroup && this.props.multiSite && buildingID) {
            const _3dOptions = SpatialManager.get3dOptionsFromBuildingID(buildingID, this.props.site3dOptions);
            buildingGroup = _3dOptions?.indoorModels[buildingGroupName];
        }

        if (buildingGroup) {
            let buildingData = buildingGroup[buildingName];

            if (!buildingData) {
                buildingData = this.getBuildingDataFromDisplayText(buildingName, buildingGroup);
            }

            if (buildingData) {
                return buildingGroup;
            }
        }

        for (const name in indoorModels) {
            const bg = indoorModels[name];

            if (bg) {
                let buildingData = bg[buildingName];

                if (!buildingData) {
                    buildingData = this.getBuildingDataFromDisplayText(buildingName, bg);
                }

                if (buildingData) {
                    return bg;
                }
            }
        }

        return null;
    }

    moveToFloorAndAlarm = (buildingID, floorIndex) => {
        // 층 이동시 알람표시 - K.D.R
        this.state.prevInstance.hideAlarms();

        const zoneID = this.state.prevInstance.moveToFloor(buildingID, floorIndex);

        if (zoneID > 0) {
            this.state.prevInstance.checkAlarms(zoneID);
        }
    }

    moveToFloor = (buildingID, floorIndex) => {
        let building = this.props._3dOptions.buildingIDs[buildingID.toString()];

        // 멀티 사이트 관련
        if (!building && this.props.multiSite) {
            const _3dOptions = SpatialManager.get3dOptionsFromBuildingID(buildingID, this.props.site3dOptions);
            building = _3dOptions.buildingIDs[buildingID.toString()];

            
        }

        if (building) {
            const buildingGroupName = building[1];
            const buildingName = building[2];

            const buildingGroup = this.getBuildingGroupIndoorModel(buildingGroupName, buildingName, buildingID);
            //const buildingGroup = this.props._3dOptions.indoorModels[buildingGroupName];

            if (buildingGroup) {
                let buildingData = buildingGroup[buildingName];

                if (!buildingData) {
                    buildingData = this.getBuildingDataFromDisplayText(buildingName, buildingGroup);
                }

                if (buildingData && buildingData.floors) {
                    for (let i = 0; i < buildingData.floors.length; i++) {
                        const floor = buildingData.floors[i];

                        if (floor.floorIndex === floorIndex) {
                            if (floor.file) {
                                if (this.props.isEditMode) {
                                    this.showIndoorOrtho(floor.file, floor.cameraOrtho, floor.zoneID);
                                }
                                else {
                                    this.optionManager.onPrevChangeView(floor.zoneID, false, floor.file);
                                    this.showIndoor(floor.file, floor.modelDisplayText, floor.camera, floor.zoneID);
                                }
                                return floor.zoneID;
                            }
                        }
                    }
                }

                // 층이동에 실패하면 건물로 이동한다.
                if (buildingData && buildingData.file && buildingData.camera) {
                    this.moveToBuilding(buildingName);
                    return -1;
                }

                // 건물로 이동하는 것에도 실패하면 건물그룹으로 이동한다.
                this.moveToBuildingGroup(buildingGroupName);
            }
        }

        return -1;
    }

    getBuildingDataFromDisplayText(displayText, buildingGroup) {
        for (const buildingName in buildingGroup) {
            const buildingData = buildingGroup[buildingName];

            if (buildingData.modelDisplayText === displayText) {
                return buildingData;
            }
        }

        return null;
    }

    moveToSensor(zoneID, sensorType, sensorID) {
        let isIndoor = true;
        let model = null;
        let _3dOptions = this.props._3dOptions;
        // 멀티사이트 관련
        if (this.props.multiSite) {
            _3dOptions = SpatialManager.get3dOptionsFromZoneID(zoneID, this.props.site3dOptions);
        }

        let zone = _3dOptions.zones[zoneID.toString()];        

        if (!zone) {
            zone = _3dOptions.outdoorZones[zoneID.toString()];

            if (!zone) {
                return;
            }

            isIndoor = false;
            model = _3dOptions.outdoorModel;
        }
        else {
            model = this.getIndoorZoneModel(zoneID);
        }

        if (model === this.currentModel || !isIndoor) {
            this._moveToSensor(zone, model, isIndoor, sensorType, sensorID, zoneID);
        }
        else {
            let sensor = this.getSensor(zoneID, sensorType, sensorID);

            if (!sensor) {
                return;
            } else if (sensorType === "psm" || sensorType === "etc") {
                sensor = this.getPOISensor(zoneID, sensorType, sensor.name);
            }

            // 해당 센서의 위치로 이동
            const cameraOption = this.getSensorCameraOption(sensor, model.camera, isIndoor);
            this.showIndoor(model.file, model.modelDisplayText, cameraOption, zoneID, null, sensorType);

            const movingCameraParam = this.movingCamera?.param;

            if (movingCameraParam) {
                // 카메라 이동이 끝난후 센서 위치로 이동하도록 한다.
                movingCameraParam.sensorType = sensorType;
                movingCameraParam.sensorID = sensorID;
            }
        }
    }

    _moveToSensor(zone, model, isIndoor, sensorType, sensorID, zoneID) {
        if (zone.sensors && model && model.camera && model.file) {
            const sensors = zone.sensors[sensorType];

            if (sensors) {
                const sensorCount = sensors.length;

                for (let i = 0; i < sensorCount; i++) {
                    const sensor = sensors[i];

                    if (sensor.id === sensorID) {
                        const poi = this.poiManager.getSensorPOI(sensorType, zoneID, sensorID);
                        //const key = POIManager.getSensorKey(sensorType, sensorID);
                        //const poi = this.sensorPOIs[key];

                        if (!poi) {
                            this.poiManager.addSensor(sensorType, sensorID, sensor.x, sensor.y, sensor.z, zoneID, isIndoor);
                        }

                        const camera = this.getSensorCameraOption(sensor, model.camera, isIndoor);

                        if (!this.currentModel || this.currentModel.name !== model.file) {
                            if (isIndoor) {
                                this.showIndoor(model.file, model.modelDisplayText, camera, zoneID);
                            }
                            else {
                                //this.showOutdoor(Contents3D.Mode_Outdoor_All);    // setMovingCamera 내에서도 showOutdoor 호출하여 주석처리 - K.D.R
                                this.setMovingCamera(camera, Contents3D.Mode_Outdoor_All, null);
                            }
                        }
                        else {
                            if (!isIndoor) {
                                this.nonChangedStatusInfo = true;
                                this.setMovingCamera(camera, Contents3D.Mode_Outdoor_All, null);
                            }
                            else {
                                this.setMovingCamera(camera, Contents3D.Mode_Indoor, null);
                            }
                        }

                        return;
                    }
                }
            }
        }
    }

    // 설비로 이동
    moveToFacility(zoneID, facilityID) {
        let _3dOptions = this.props._3dOptions;
        // 멀티사이트 관련
        if (this.props.multiSite) {
            _3dOptions = SpatialManager.get3dOptionsFromZoneID(zoneID, this.props.site3dOptions);
        }

        const modelData = SDMSDataManager.getZoneModelData(_3dOptions, zoneID);

        if (!modelData) {
            if (_3dOptions.outdoorZones[zoneID.toString()]) {
                this.showOutdoor(Contents3D.Mode_Outdoor_All);
            }
            else {
                return;
            }
        } else {

            this.showIndoor(modelData[0], modelData[1], modelData[2], zoneID);
        }

        //const model = this.internalModels[modelData[0]];
        //let model = this.getIndoorZoneModel(zoneID);

        const facility = this.getFacility(facilityID);
        if (facility) {
            DataInfo.processFacilityInfo(facility.name, this.props.showBuildingInfo);   // 설비 정보창 띄우기 - K.D.R
            this.setSelectedFacility(facility);
        }
    }

    // POI 포커스 옵션 여부에 따른 카메라 이동 설정
    getSensorCameraOption(sensor, modelCamera, isIndoor) {
        const usePoiFocus = this.state.commonSettings?.UsePoiFocus;

        if (usePoiFocus !== SettingResource.usePoiFocus.on) {
            return modelCamera;
        }
 
        //const movePos = isIndoor ? [-1.37737, 7.332775, 6.8244] : [-5.783151245, 32.45516205, 30.26660156];
        const movePos = isIndoor ? [-1.37737, 21.332775, 13.8244] : [-5.783151245, 67.45516205, 47.26660156];
        const rotation = [-0.9901062846183777, -0.10070063918828964, -0.15202930569648743];

        const camera = {};

        //camera.position = [sensor.x + movePos[0], sensor.y + movePos[1], sensor.z + movePos[2]];
        //camera.quaternion = null;
        //camera.rotation = [...rotation];
        //camera.targetControl = [sensor.x, sensor.y, sensor.z];
        //camera.targetControl = [...modelCamera.targetControl];
        if (sensor && (sensor.x === 0 || sensor.x) && (sensor.y === 0 || sensor.y) && (sensor.z === 0 || sensor.z)) {
            camera.position = [sensor.x + movePos[0], sensor.y + movePos[1], sensor.z + movePos[2]];
            camera.quaternion = null;
            camera.rotation = [...rotation];
            camera.targetControl = [sensor.x, sensor.y, sensor.z];
        } else {
            camera.position = [...modelCamera.position];
            camera.quaternion = [...modelCamera.quaternion];
            camera.rotation = [...modelCamera.rotation];
            camera.targetControl = [...modelCamera.targetControl];
        }
     
        camera.fov = modelCamera ? modelCamera.fov : this.camera.fov;
        camera.near = modelCamera ? modelCamera.near : this.camera.near;
        camera.far = modelCamera ? modelCamera.far : this.camera.far;

        return camera;
    }

    getCurrentZoneID() {
        if (this.isIndoor()) {
            return this.fakeWallManager.zoneID;
        }

        for (const zoneID in this.props._3dOptions.outdoorZones) {
            return zoneID;
        }

        return -1;
    }

    setSelectedFacility(facility) {
        if (this.selectedFacility === facility) {
            return;
        }

        if (this.selectedFacility !== null) {
            this.selectedFacility.visible = false;
        }

        this.selectedFacility = facility;
        this.props.selectFacility(this.selectedFacility);

        if (this.selectedFacility) {
            this.selectedFacility.visible = true;
        }
    }

    onClick = (event) => {
        this.optionManager.onPrevClick(event);

        // Text 편집하는 도중에 다른 곳을 Click하면 편집창이 사라지게 한다.
        if (this.state.editableInput) {
            this.setState({ editableInput: false });
            this.optionManager.onPostClick(event);
            return;
        }

        const raycaster = this.traceMousePos(event);
        this.lastMouseMoveTime = new Date();

        this.setSelectedFacility(null);

        // 숨겨진 기능
        // Alt와 Ctrl Key를 누른 상태에서 Mouse Click 하면 현재의 Viewport를 DB에 저장한다.
        // 실내공간에서만 동작한다.
        /*if (event.altKey && event.ctrlKey) {
            this.getMousePos(event);
        }*/
        //this.traceMousePos(event);


        // 영역 생성 관련
        if (this.props.editMode === Contents3D.Edit_Mode_Text && this.equipZoneAreaManager.addAreaMode()) {
            this.equipZoneAreaManager.onClick(event, this.props.currentView.zoneID);
            return;
        }
        

        if (this.props.editMode === Contents3D.Edit_Mode_FakeWall) {
            this.fakeWallManager.onClick(event, this.props.currentView.zoneID);
            this.optionManager.onPostClick(event);
            return;
        }

        if (this.pickPOI) {
            const poi = this.pickPOI;
            this.pickPOI = null;
            TextPOIManager.updateEquipZoneTextBounding(poi, raycaster)
            this.props.onSelectPOI(poi, true, this);
            this.optionManager.onPostClick(event);
            return;
        }

        if (this.state.loading || this.movingCamera) {
            this.optionManager.onPostClick(event);
            return;
        }

        const isIndoor = this.isIndoor();
        const currentZoneID = this.getCurrentZoneID();
        const newPOI = this.poiManager.putTempCCTV(event, this.camera, isIndoor, currentZoneID, this.props.selectedNewCCTV, this.props._3dOptions);

        if (newPOI) {
            this.props.onNewCCTVPOI(newPOI, currentZoneID, this.poiManager);
            this.optionManager.onPostClick(event);
            return;
        }

        // POI 구역 수정 경우도 textPOI 선택 
        const isEditTextMode = (this.props.editMode === Contents3D.Edit_Mode_Text ||
            this.props.editModeManager.poiEditMode === EditModeManager.ChangeEquipZone_OneClick);

        const poi = this.poiManager.getPOI(event, this.camera, isEditTextMode, this.props.editModeParam === TextPOIManager.Mode_RemoveArea);
        this.onClickPOI(poi, event);
        
        let selectEquipZoneID = null;
        const [eqPoiID, eqPoiType] = this.poiManager.getEquipZoneTextPOI(event, this.camera);

        if (poi === null && isIndoor === false && this.props.editMode === Contents3D.Edit_Mode_None && eqPoiType !== SDMSMainMenu.EquipZoneNameText) {
            // BuildingGroup이나 Building Text를 Click하면 해당 위치로 이동하도록 한다.
            const [poiID, poiType] = this.poiManager.getBuildingTextPOI(event, this.camera);

            if (poiID !== null && poiType !== null) {
                if (poiType === SDMSMainMenu.BuildingGroupNameText) {
                    this.moveToBuildingGroupFromID(poiID);
                }
                else if (poiType === SDMSMainMenu.BuildingNameText) {
                    this.moveToIndoorFromID(poiID);
                }

                this.optionManager.onPostClick(event);
                return;
            }
        }
        else if (poi === null && /*isIndoor === true &&*/ eqPoiType === SDMSMainMenu.EquipZoneNameText) {
            // 선택된 eqZoneID 값 가져오기             
            selectEquipZoneID = eqPoiID;
        }
        else if (poi !== null) {
            this.optionManager.onPostClick(event);
            return;
        }

        // 선택된 eqZoneID 전달
        this.props.selectEquipZoneID(selectEquipZoneID);

        /*if (poi !== null) {
            this.onClickPOI(poi, event);
            //return;
        }
        else {
            this.onClickPOI(null, event);
        }*/

        if (!this.useBoundingBox) {
            this.optionManager.onPostClick(event);
            return;
        }

        if (this.boundingBoxModel && this.isIndoor() === false) {
            const modelName = this.boundingBoxModel.name;

            const buildingGroup = this.getBuildingGroupModel(modelName);

            if (event.ctrlKey) {
                if (buildingGroup) {
                    this.props.onSelectMenu(SDMSMainMenu.Menu_Show_Outdoor, buildingGroup);
                    //this.props.onChangeMode(Contents3D.Mode_Outdoor_Part, buildingGroup);
                }
                else {
                    const indoorModel = this.getIndoorModel(modelName);

                    if (indoorModel) {
                        this.showIndoor(indoorModel.file, indoorModel.modelDisplayText, indoorModel.camera, indoorModel.zoneID);
                    }
                }
            }
            else {
                if (buildingGroup) {
                    DataInfo.processBuildingGroupData(buildingGroup.buildingGroupID, this.props.showBuildingInfo);
                    //this.processBuildingInfo(true, buildingGroup);
                }
                else {
                    DataInfo.processBuildingData(modelName, this.props.showBuildingInfo);
                    //const buildingName = this.getBuildingName(modelName);
                    //this.processBuildingInfo(false, buildingName);
                }
            }
        }
        else /*if (this.isIndoor())*/ {
            const facility = this.prevIndoorFacility;

            if (facility) {
                this.setSelectedFacility(facility.object);
                console.log("onClick Facility : " + facility.object.name);
                DataInfo.processFacilityInfo(facility.object.name, this.props.showBuildingInfo);
                //this.processFacilityInfo(facility.object.name);
            }
            else {
                DataInfo.processFacilityInfo(null, this.props.showBuildingInfo);
            }
        }

        this.optionManager.onPostClick(event);
    }

    getFacility(facilityID) {
        const modelName = this.props.getFacilityModelName(facilityID);

        if (modelName === null) {
            return null;
        }

        return this.facilityMaps[modelName];
    }

    traceMousePos(event/*: MouseEvent*/) {
        const x = event.nativeEvent.offsetX;
        const y = event.nativeEvent.offsetY;
        const mouse = new THREE.Vector2((x / window.innerWidth) * 2 - 1, -(y / window.innerHeight) * 2 + 1);

        const raycaster = new THREE.Raycaster();
        raycaster.setFromCamera(mouse, this.camera);

        //console.log("Mouse Position : " + raycaster.ray.origin.x + ", " + raycaster.ray.origin.z);
        return raycaster;
    }

    /*getBuildingName(boundingBoxName) {
        return boundingBoxName.substring(0, boundingBoxName.length - SDMSDataManager.BoundingBoxTag.length);
    }

    async processFacilityInfo(modelName) {
        const response = await SDMSController.requestFacilityInfoData(modelName);

        if (response === null) {
            alert(SdmsResource.ID.errorMessage.loadFailFacilityInfo);
        }
        else if (response.success === false) {
            alert(response.message);
        }
        else {
            const datas = [];
            const dataCount = response.datas.length;

            for (let i = 0; i < dataCount; i++) {
                const data = response.datas[i];
                datas.push([data.propertyName, data.propertyValue]);
            }

            const arrInfo = new Array();

            arrInfo[0] = SdmsResource.ID.buildingInfo.equipmentType;       // 건물 or 설비
            arrInfo[1] = response.facilityName;                            // 설비 이름
            arrInfo[2] = datas;

            this.props.showBuildingInfo(SdmsResource.ID.buildingInfo.equipmentType, arrInfo);
        }
    }

    processBuildingInfo(isBuildingGroup, datas) {
        const arrInfo = new Array();

        if (isBuildingGroup) {
            arrInfo[0] = SdmsResource.ID.buildingInfo.buildingGroupType;            
        }
        else {
            arrInfo[0] = SdmsResource.ID.buildingInfo.buildingType;
        }
        arrInfo[1] = datas;

        this.props.showBuildingInfo(arrInfo[0], arrInfo);
    }*/

    onClickPOI(poi, event) {
        if (!poi) {
            // 구역별 CCTV 편집에서 CCTV 선택모드일 때, 빈공간을 클릭시 선택된 센서 하이라이트가 풀리지 않도록 수정 - K.D.R 
            if ((this.props.editMode === Contents3D.Edit_Mode_CCTVGroup && this.props.editModeParam === CCTVInfo.Mode_Select_CCTV) ||
                (this.props.editMode === Contents3D.Edit_Mode_CCTVGroup && this.props.editModeParam === CCTVInfo.Mode_Delete_CCTV) ||
                (this.props.editMode === Contents3D.Edit_Mode_MovePOI && this.props.editModeManager.poiEditMode === EditModeManager.ChangeEquipZone_OneClick))
                return;

            this.poiManager.selectPOI(null, this.props.editMode, this.props.editModeParam);
            this.props.onSelectPOI(null, false, this);
            return;
        }

        let poiName = poi.object.name;
        if (poiName === undefined || poiName === "")
            return;

        let type = this.poiManager.getSensorType(poiName);
        if (type === null)
            return;

        let id = this.poiManager.getSensorID(poiName);
        if (id === null)
            return;

        this.showBuildingInfo(type, id);

        // 타입에 따라 기능 구별
        if (type === SDMSMainMenu.CCTV_Type || type === SDMSMainMenu.CCTV_SafetyI_Type || type === SDMSMainMenu.CCTV_PTZ_Type ||
            (this.props.editMode === Contents3D.Edit_Mode_CCTVGroup && this.props.editModeParam === CCTVInfo.Mode_Select_CCTV)) {

            if (type === SDMSMainMenu.CCTV_Type || type === SDMSMainMenu.CCTV_SafetyI_Type || type === SDMSMainMenu.CCTV_PTZ_Type) {
                // CCTV ID 전달하기
                this.props.onSelectCCTV(id, poi, this.poiManager);
            }
            else {
                return;
            }
        }
        else if (this.props.editMode === Contents3D.Edit_Mode_MovePOI &&
            (type === SDMSMainMenu.Fire_Sensor || type === SDMSMainMenu.PSM_Sensor || type === SDMSMainMenu.Etc_Sensor)) {
            // POI 편집모드에서 정보확인 클릭 후 CCTV 이외에 POI를 클릭시 하이라이트 효과 - K.D.R
            this.props.onSelectPOI(poi, false, this);
        }
        else if (type === SDMSMainMenu.PSM_Sensor || type === SDMSMainMenu.Etc_Sensor) {
            this.props.onSelectSensorPOI(id, type, poi, this.poiManager, false);
        }

        this.clickForMovePOI(poi, event);
    }

    // 정보 팝업에 POI 정보 표현
    showBuildingInfo(type, id, siteID) {
        const datas = [];
        const arrInfo = new Array();
        let _3dOptions = this.props._3dOptions;

        // 멀티사이트 관련
        if (this.props.multiSite && siteID && siteID !== this.props.currentSiteID) {
            _3dOptions = SpatialManager.get3dOptionsFromSiteID(siteID?.toString(), this.props.site3dOptions);
        }

        if (type === SDMSMainMenu.Fire_Sensor) {
            let sensorCount = this.props.sensorList['fireSensors'].length;
            for (let i = 0; i < sensorCount; i++) {
                const sensor = this.props.sensorList['fireSensors'][i];
                if (Number(id) === sensor.id) {
                    let zone = _3dOptions.zones[sensor.zoneID.toString()];
                    if (!zone) {
                        zone = _3dOptions.outdoorZones[sensor.zoneID.toString()];
                        datas.push(['위치 : ' + zone.name, true, null]);
                    } else {
                        datas.push(['위치 : ' + zone[3], true, null]);
                    }


                    if (sensor.sensorSubType === 0) {
                        datas.push(['감지기 종류 : 열 감지기', true, null]);
                    } else if (sensor.sensorSubType === 1) {
                        datas.push(['감지기 종류 : 연기 감지기', true, null]);
                    } else if (sensor.sensorSubType === 2) {
                        datas.push(['감지기 종류 : 불꽃 감지기', true, null]);
                    } else {
                        datas.push(['감지기 종류 : 일반 감지기', true, null]);
                    }

                    arrInfo[0] = '센서정보';
                    //arrInfo[1] = sensor.id + ". " + sensor.name;
                    arrInfo[1] = sensor.name;
                    arrInfo[2] = datas;
                    
                    /*if (sensor.departmentPhoneNumber) {
                        datas.push(['중계기 번호 : ' + sensor.departmentPhoneNumber, true, null]);
                    }*/

                    this.props.showBuildingInfo(arrInfo[0], arrInfo);
                    break;
                }
            }
        }
        else if (type === SDMSMainMenu.Etc_Sensor) {
            let sensorCount = this.props.sensorList['etcSensors'].length;
            for (let i = 0; i < sensorCount; i++) {
                const sensor = this.props.sensorList['etcSensors'][i];
                if (Number(id) === sensor.id) {
                    let zone = _3dOptions.zones[sensor.zoneID.toString()];
                    if (!zone) {
                        zone = _3dOptions.outdoorZones[sensor.zoneID.toString()];
                        datas.push(['위치 : ' + zone.name, true, null]);
                    } else {
                        datas.push(['위치 : ' + zone[3], true, null]);
                    }

                    arrInfo[0] = '센서정보';
                    //arrInfo[1] = sensor.id + ". " + sensor.name;
                    arrInfo[1] = sensor.name;
                    arrInfo[2] = datas;

                    this.props.showBuildingInfo(arrInfo[0], arrInfo);
                    break;
                }
            }
        }
        else if (type === SDMSMainMenu.PSM_Sensor) {
            let sensorCount = this.props.sensorList['psmSensors'].length;
            for (let i = 0; i < sensorCount; i++) {
                const sensor = this.props.sensorList['psmSensors'][i];
                if (Number(id) === sensor.id) {
                    let zone = _3dOptions.zones[sensor.zoneID.toString()];
                    if (!zone) {
                        zone = _3dOptions.outdoorZones[sensor.zoneID.toString()];
                        datas.push(['위치 : ' + zone.name, true, null]);
                    } else {
                        datas.push(['위치 : ' + zone[3], true, null]);
                    }

                    const typeName = SdmsResource.getFacilityTypeString(sensor.facilityType);
                    datas.push(['센서 종류 : ' + typeName, true, null]);

                    arrInfo[0] = '센서정보';
                    //arrInfo[1] = sensor.id + ". " + sensor.name;
                    arrInfo[1] = sensor.name;
                    arrInfo[2] = datas;

                    this.props.showBuildingInfo(arrInfo[0], arrInfo);
                    break;
                }
            }
        }
        else if (type === SDMSMainMenu.Environment_Sensor) {
            let sensorCount = this.props.sensorList['environmentSensors'].length;
            for (let i = 0; i < sensorCount; i++) {
                const sensor = this.props.sensorList['environmentSensors'][i];
                if (Number(id) === sensor.id) {
                    let zone = _3dOptions.zones[sensor.zoneID.toString()];
                    if (!zone) {
                        zone = _3dOptions.outdoorZones[sensor.zoneID.toString()];
                        datas.push(['위치 : ' + zone.name, true, null]);
                    } else {
                        datas.push(['위치 : ' + zone[3], true, null]);
                    }

                    arrInfo[0] = '센서정보';
                    //arrInfo[1] = sensor.id + ". " + sensor.name;
                    arrInfo[1] = sensor.name;
                    arrInfo[2] = datas;

                    this.props.showBuildingInfo(arrInfo[0], arrInfo);
                    break;
                }
            }
        }
        else if (type === SDMSMainMenu.Manufacture_Sensor) {
            let sensorCount = this.props.sensorList['manufactureSensors'].length;
            for (let i = 0; i < sensorCount; i++) {
                const sensor = this.props.sensorList['manufactureSensors'][i];
                if (Number(id) === sensor.id) {
                    let zone = _3dOptions.zones[sensor.zoneID.toString()];
                    if (!zone) {
                        zone = _3dOptions.outdoorZones[sensor.zoneID.toString()];
                        datas.push(['위치 : ' + zone.name, true, null]);
                    } else {
                        datas.push(['위치 : ' + zone[3], true, null]);
                    }

                    arrInfo[0] = '센서정보';
                    //arrInfo[1] = sensor.id + ". " + sensor.name;
                    arrInfo[1] = sensor.name;
                    arrInfo[2] = datas;

                    this.props.showBuildingInfo(arrInfo[0], arrInfo);
                    break;
                }
            }
        }
        else if (type === SDMSMainMenu.Emergency_Sensor) {
            let sensorCount = this.props.sensorList['emergencyBellSensors'].length;
            for (let i = 0; i < sensorCount; i++) {
                const sensor = this.props.sensorList['emergencyBellSensors'][i];
                if (Number(id) === sensor.id) {
                    let zone = _3dOptions.zones[sensor.zoneID.toString()];
                    if (!zone) {
                        zone = _3dOptions.outdoorZones[sensor.zoneID.toString()];
                        datas.push(['위치 : ' + zone.name, true, null]);
                    } else {
                        datas.push(['위치 : ' + zone[3], true, null]);
                    }

                    arrInfo[0] = '센서정보';
                    //arrInfo[1] = sensor.id + ". " + sensor.name;
                    arrInfo[1] = sensor.name;
                    arrInfo[2] = datas;

                    this.props.showBuildingInfo(arrInfo[0], arrInfo);
                    break;
                }
            }
        }
        else if (type === SDMSMainMenu.CCTV_Type ||
            type === SDMSMainMenu.CCTV_PTZ_Type ||
            type === SDMSMainMenu.CCTV_SafetyI_Type) {
            let sensorCount = this.props.sensorList['cctvs'].length;
            for (let i = 0; i < sensorCount; i++) {
                const sensor = this.props.sensorList['cctvs'][i];
                if (Number(id) === sensor.id) {
                    let zoneID = sensor.zoneID;

                    if (sensor.zoneID === null || sensor.zoneID === undefined) {
                        zoneID = this.poiManager.getSensorZoneID(sensor.id, SDMSMainMenu.CCTV_Type);

                        if (isNaN(zoneID) || zoneID === null || zoneID === undefined) {
                            continue;
                        }
                    }

                    //if (Number(id) === sensor.id && sensor.zoneID !== null && sensor.zoneID !== undefined) {
                    let zone = _3dOptions.zones[zoneID.toString()];
                    if (!zone) {
                        zone = _3dOptions.outdoorZones[zoneID.toString()];
                        datas.push(['위치 : ' + zone.name, true, null]);
                    }
                    else {
                        datas.push(['위치 : ' + zone[3], true, null]);
                    }

                    if (sensor.cameraName.indexOf('PTZ') > 0) {
                        datas.push(['CCTV 종류 : PTZ', true, null]);
                    }
                    else {
                        datas.push(['CCTV 종류 : ' + sensor.type, true, null]);
                    }

                    if (sensor.cameraIP && sensor.cameraIP.length > 0) {
                        datas.push(['IP : ' + sensor.cameraIP, true, null]);
                    }

                    if (sensor.cameraCompanyName && sensor.cameraCompanyName.length > 0) {
                        datas.push(['제조사 : ' + sensor.cameraCompanyName, true, null]);
                    }

                    if (sensor.cameraModelName && sensor.cameraModelName.length > 0) {
                        datas.push(['모델명 : ' + sensor.cameraModelName, true, null]);
                    }

                    arrInfo[0] = '센서정보';
                    arrInfo[1] = sensor.id + '. ' + sensor.cameraName;
                    if (ProjectResource.SiteNo === ProjectResource.Site.Soulbrain)
                        arrInfo[1] = sensor.id + '. ' + sensor.cameraName;
                    else
                        arrInfo[1] = sensor.cameraName;
                    arrInfo[2] = datas;

                    this.props.showBuildingInfo(arrInfo[0], arrInfo);
                    break;
                }
            }
        }
    }

    doesClickEquipZoneTextInEditTextMode(poi) {
        if (!poi) {
            return false;
        }

        if (this.props.editMode === Contents3D.Edit_Mode_Text &&
            this.props.editModeParam === TextPOIManager.Mode_EditText &&
            SDMSMainMenu.isEquipZoneText(poi.object.name)) {
            return true;
        }

        return false;
    }

    doesClickEquipZoneSensorInEditTextMode(poi) {
        if (!poi) {
            return false;
        }

        if (this.props.editMode === Contents3D.Edit_Mode_Text &&
            this.props.editModeParam === TextPOIManager.Mode_EditEquipZoneSensor &&
            SDMSMainMenu.isEquipZoneText(poi.object.name)) {
            return true;
        }

        return false;
    }

    setEditableInput(poi, visible, event) {
        if (visible) {
            const input = this.refEditableInput.current;

            if (!input || !poi) {
                return;
            }

            /*const [sensorType, zoneID, equipZoneID] = SDMS.getSensorInfo(poi);
            const equipZoneName = this.getEquipZoneName(zoneID, equipZoneID);*/
            const equipZoneName = poi.object ? poi.object.userData.text : poi.userData.text;

            if (equipZoneName) {
                input.value = equipZoneName;
            }

            const width = (100 * equipZoneName.length / 7).toFixed();
            const height = 38;
            input.style.width = width + "px";
            input.style.height = height + "px";

            input.style.left = (event.clientX - width / 2).toString() + "px";
            input.style.top = (event.clientY - height / 2).toString() + "px";
        }

        this.setState({ editableInput: visible });
    }

    getEquipZoneName(zoneID, equipZoneID) {
        if (zoneID === null || zoneID === undefined ||
            equipZoneID === null || equipZoneID === undefined) {
            return null;
        }

        let zone = this.props._3dOptions.zones[zoneID];

        if (!zone) {
            zone = this.props._3dOptions.outdoorZones[zoneID];
        }

        const equipZones = zone?.equipZones;

        if (!equipZones) {
            return null;
        }

        const equipZone = equipZones[equipZoneID];

        if (!equipZone) {
            return null;
        }

        if (equipZone.length >= 3) {
            return equipZone[1];
        }

        return null;
    }

    onKeyDownEditableInput(e) {
        if (e.key === "Enter") {
            const input = this.refEditableInput.current;

            if (input) {
                const text = input.value.trim();

                if (text.length === 0) {
                    // 빈문자열은 허용하지 않는다.
                    this.setState({ editableInput: false });
                    return;
                }

                const changedPoi = this.textPOIManager.setEquipZonePoiText(this.pickPOI, text, this.props._3dOptions);

                if (changedPoi) {
                    this.props.onSelectPOI(changedPoi, true, this);
                    this.pickPOI = null;
                }

                this.setState({ editableInput: false });
            }
        }
        else if (e.key === "Escape") {
            this.setState({ editableInput: false });
        }
    }

    async clickForMovePOI(poi, event) {
        if (this.props.editMode === Contents3D.Edit_Mode_MovePOI ||
            this.props.editMode === Contents3D.Edit_Mode_Text) {
            if (this.pickPOI) {
                this.pickPOI = null;
            }
            else {
                if (this.props.editMode === Contents3D.Edit_Mode_Text && this.props.editModeParam === TextPOIManager.Mode_AddArea) {
                    // 영역 생성
                    this.pickPOI = null;
                        
                    if (SDMSMainMenu.isEquipZoneText(poi?.object?.name)) {
                        const equipZoneName = poi?.object?.userData?.text;
                        if (equipZoneName) {
                            const [sensorType, zoneID, equipZoneID] = SDMS.getSensorInfo(poi);

                            if (this.equipZoneAreaManager.checkDoubleArea(equipZoneID)) {
                                const _message = [equipZoneName + ` 영역이 존재합니다.`];
                                this.props.showConfirmDialog("중복", _message, null, null);
                                return;
                            }

                            // EquipZone 명칭 하이라이트
                            this.props.onSelectEquipZonePOI(poi);

                            this.confirmDialogData = poi;
                            const message = [equipZoneName + ` 영역을 생성하시겠습니까?`];
                            this.props.showConfirmDialog("영역 생성", message, ["예", "아니오"], this.onClickAddAreaYesNo);
                        }
                    }  
                    
                    return;
                }
                else if (this.props.editMode === Contents3D.Edit_Mode_Text && this.props.editModeParam === TextPOIManager.Mode_RemoveArea) {
                    // 영역 삭제
                    this.pickPOI = null;
                        
                    if (SDMSMainMenu.isEquipZoneArea(poi?.object?.name)) {
                        const equipZoneName = poi?.object?.userData?.equipZoneName;
                        if (equipZoneName) {

                            const [sensorType, zoneID, equipZoneID] = SDMS.getSensorInfo(poi);

                            // EquipZone 명칭 하이라이트
                            const equipZonePOI = this.textPOIManager?.getEquipZonePOI(zoneID, equipZoneID);
                            if (equipZonePOI) 
                                this.props.onSelectEquipZonePOI(equipZonePOI);

                            // EquipZoneArea 명칭 하이라이트
                            this.props.onSelectEquipZoneArea(poi);

                            this.confirmDialogData = poi;
                            const message = [equipZoneName + ` 영역을 삭제하시겠습니까?`];
                            this.props.showConfirmDialog("영역 삭제", message, ["예", "아니오"], this.onClickRemoveAreaYesNo);
                        }
                    }  
                
                    return;
                }
                else if (this.doesClickEquipZoneTextInEditTextMode(poi)) {
                    // 구역명 편집
                    this.pickPOI = poi;

                    this.setEditableInput(poi, true, event);
                }
                else if (this.props.editModeManager.movePoiMode() ||
                    this.props.editMode === Contents3D.Edit_Mode_Text && this.props.editModeParam === TextPOIManager.Mode_MoveText) {
                    // POI 이동 또는 구역명 이동
                    this.pickPOI = poi;

                    // 아직 센서 위치가 정해지지 않았지만 일단 원래 위치에서 이동했기 때문에 편집되었다고 알려준다.
                    this.props.onSelectPOI(poi, true, this);

                    if (this.doesClickEquipZoneSensorInEditTextMode(poi)) {
                        //this.textPOIManager.selectTextPoi(poi);
                    }
                }
                else if (this.props.editModeManager.deletePoiMode()) {
                    this.pickPOI = null;

                    if (this.poiManager.deleteCCTV(poi, this.props._3dOptions)) {
                        this.props.onDeleteCCTV(poi, this.poiManager);
                    }

                    return;
                }
                else if (this.props.editModeManager.checkNDeletePoiMode()) {
                    this.pickPOI = null;
                    const [sensorType, zoneID, sensorID] = SDMS.getSensorInfo(poi);

                    if (sensorType && sensorID !== null) {
                        this.showBuildingInfo(sensorType, sensorID);
                    }

                    if (sensorType === SDMSMainMenu.CCTV_Type ||
                        sensorType === SDMSMainMenu.CCTV_SafetyI_Type) {
                        const cctv = SDMSDataManager.getSensor(sensorType, zoneID, sensorID, this.props._3dOptions);

                        if (cctv) {
                            this.confirmDialogData = poi;
                            const message = [`선택한 cctv(${cctv.id}.${cctv.cameraName})를 삭제하시겠습니까?`];
                            this.props.showConfirmDialog("확인", message, ["예", "아니오"], this.onClickDeleteCCTVYesNo);
                        }
                    }

                    return;
                }
                else if (this.props.editModeManager.checkPoiMode()) {
                    this.pickPOI = null;
                    const [sensorType, zoneID, sensorID] = SDMS.getSensorInfo(poi);

                    if (sensorType && sensorID !== null) {
                        this.showBuildingInfo(sensorType, sensorID);
                    }
                    return;
                }
                else if (this.props.editModeManager.changeEquipZonePoiMode()) {
                    // POI 구역 수정
                    this.pickPOI = null;

                    const [type, poiZoneID, poiID] = SDMS.getSensorInfo(poi);
                    if (type && poiZoneID && poiID) {

                        if (this.props.editModeManager.poiEditMode === EditModeManager.ChangeEquipZone) {
                            // POI를 선택한 경우

                            // 변경된 equipZone 1차 조회
                            const typeSensorEquipZones = this.props.editModeManager.editSensorEquipZones[type];
                            let [equipZoneID, zoneID] = typeSensorEquipZones ? (typeSensorEquipZones[poiID] ? typeSensorEquipZones[poiID] : [null, null]) : [null, null];

                            if (!equipZoneID) {
                                // 없을 경우
                                const result = await SDMSController.requestEquipZoneSensorList(type, poiID);

                                if (result && result.success) {
                                    equipZoneID = result.equipZoneID;
                                }
                            }

                            if (equipZoneID) {
                                // 해당 equipZone 포커스
                                const equipZonePOI = this.textPOIManager?.getEquipZonePOI(poiZoneID, equipZoneID);
                                if (equipZonePOI)
                                    this.props.onSelectEquipZonePOI(equipZonePOI);

                                // 모드 전환
                                this.props.editModeManager.poiEditMode = EditModeManager.ChangeEquipZone_OneClick;
                            }
                        }
                        else if (this.props.editModeManager.poiEditMode === EditModeManager.ChangeEquipZone_OneClick) {
                            // 구역을 선택한 경우
                            const equipZonePOI = this.textPOIManager?.getEquipZonePOI(poiZoneID, poiID);
                            if (equipZonePOI) {
                                const [sensorType, zoneID_sensor, sensorID] = this.props.selectedSensor;

                                // EquipZone 명칭 하이라이트
                                this.props.onSelectEquipZonePOI(equipZonePOI);

                                // 변경된 EquipZone 저장
                                let typeSensorEquipZones = this.props.editModeManager.editSensorEquipZones[sensorType];
                                if (!typeSensorEquipZones) {
                                    this.props.editModeManager.editSensorEquipZones[sensorType] = {};                                    
                                    typeSensorEquipZones = this.props.editModeManager.editSensorEquipZones[sensorType];
                                }

                                typeSensorEquipZones[sensorID] = [poiID, zoneID_sensor];
                            }

                            return;
                        }
                    }                    
                }
            }
            // Ctrl Key를 누른 상태에서는 POI를 이동시키지 않고 선택만 되도록 한다.
            /*if (event.ctrlKey === false) {
                if (this.pickPOI) {
                    this.editMode = Contents3D.Edit_Mode_None;
                    this.pickPOI = null;
                }
                else {
                    this.pickPOI = poi;
                }
            }*/
        }

        this.poiManager.selectPOI(poi, this.props.editMode, this.props.editModeParam);
        this.props.onSelectPOI(poi, false, this);
    }

    onClickDeleteCCTVYesNo = (index) => {
        if (index === 0) {
            // yes
            if (this.confirmDialogData) {
                const poi = this.confirmDialogData;

                if (this.poiManager.deleteCCTV(poi, this.props._3dOptions)) {
                    this.props.onDeleteCCTV(poi, this.poiManager);
                }

                this.confirmDialogData = undefined;
                this.props.closeConfirmDialog();
            }
        }
        else if (index === 1) {
            // no
            this.confirmDialogData = undefined;
            this.props.closeConfirmDialog();
        }
    }

    onClickAddAreaYesNo = (index) => {
        if (index === 0) {
            // yes
            if (this.confirmDialogData) {
                const poi = this.confirmDialogData;
                
                // EquipZone 선택
                this.equipZoneAreaManager.pickEquipZone(poi);

                this.equipZoneAreaManager.changeMode(EquipZoneAreaManager.Mode_Add_NoClick);

                this.confirmDialogData = undefined;
                this.props.closeConfirmDialog();
            }
        }
        else if (index === 1) {
            // no
            this.props.onSelectEquipZonePOI(null);

            this.confirmDialogData = undefined;
            this.props.closeConfirmDialog();
        }
    }

    onClickRemoveAreaYesNo = (index) => {
        if (index === 0) {
            // yes
            if (this.confirmDialogData) {
                const poi = this.confirmDialogData;
                
                this.props.onSelectEquipZoneArea(null);
                this.props.onSelectEquipZonePOI(null);

                // EquipZoneArea 삭제
                this.equipZoneAreaManager.removeEquipZoneArea(poi.object);

                this.confirmDialogData = undefined;
                this.props.closeConfirmDialog();
            }
        }
        else if (index === 1) {
            // no
            this.props.onSelectEquipZoneArea(null);
            this.props.onSelectEquipZonePOI(null);

            this.confirmDialogData = undefined;
            this.props.closeConfirmDialog();
        }
    }

    //getPOI(event) {
    //    const x = event.nativeEvent.offsetX;
    //    const y = event.nativeEvent.offsetY;
    //    const mouse = new THREE.Vector2((x / window.innerWidth) * 2 - 1, -(y / window.innerHeight) * 2 + 1);

    //    const raycaster = new THREE.Raycaster();
    //    raycaster.setFromCamera(mouse, this.camera);

    //    const intersects = raycaster.intersectObjects(this.scene.children, true);
    //    const intersectCount = intersects.length;

    //    for (let i = 0; i < intersectCount; i++) {
    //        const intersect = intersects[i];

    //        if (intersect.object.visible === false) {
    //            continue;
    //        }

    //        if (this.isSprite(intersect) && intersect.object.name.length > 0) {
    //            const sensorType = this.getSensorType(intersect.object.name);

    //            if (sensorType !== "text") {
    //                return intersect;
    //            }
    //        }
    //    }

    //    /*if (intersectCount > 0) {
    //        const nearestIntersect = this.sortIntersects(intersects, intersectCount);

    //        if (nearestIntersect) {
    //            if (this.isSprite(nearestIntersect) && nearestIntersect.object.name.length > 0) {
    //                return nearestIntersect;
    //            }
    //        }
    //    }*/

    //    return null;
    //}

    getZoomValue() {
        if (!this.camera) {
            return null;
        }

        return Geometry.getDistance3(this.camera.position.x, this.camera.position.y, this.camera.position.z, this.controls.target.x, this.controls.target.y, this.controls.target.z);
    }

    getBuildingGroupModel(boundingBoxName) {
        const buildingGroupCount = this.props._3dOptions.buildingGroups.length;
        let buildingGroupName = null;

        for (let i = 0; i < buildingGroupCount; i++) {
            const buildingGroup = this.props._3dOptions.buildingGroups[i];

            if (buildingGroup[2] === boundingBoxName) {
                buildingGroupName = buildingGroup[0];
                break;
            }
        }

        if (buildingGroupName === null) {
            return null;
        }

        return this.props._3dOptions.indoorModels[buildingGroupName];
    }

    getBuildingModel(buildingName) {
        const building = this.props._3dOptions.allBuildings[buildingName];

        if (building) {
            const buildingGroupName = building[1];
            let buildingGroup = this.props._3dOptions.indoorModels[buildingGroupName];

            if (!buildingGroup) {
                buildingName = building[2];
                buildingGroup = this.getBuildingGroupIndoorModel(buildingGroupName, buildingName);
            }

            if (buildingGroup) {
                let buildingData = buildingGroup[buildingName];

                if (!buildingData) {
                    buildingData = this.getBuildingDataFromDisplayText(buildingName, buildingGroup);
                }

                if (buildingData && buildingData.floors) {
                    return buildingData.floors;
                }
            }
        }

        return null;
    }

    getIndoorModel(boundingBoxName) {
        const buildingName = boundingBoxName.substring(0, boundingBoxName.length - SDMSDataManager.BoundingBoxTag.length);
        const floors = this.getBuildingModel(buildingName);

        if (floors) {
            const floorCount = floors.length;

            for (let i = 0; i < floorCount; i++) {
                const floor = floors[i];

                if (floor.file && floor.camera) {
                    return floor;
                }
            }
        }

        return null;
    }

    getIndoorZoneModel(zoneID) {
        let _3dOptions = this.props._3dOptions;
        if (this.props.multiSite) {
            _3dOptions = SpatialManager.get3dOptionsFromZoneID(zoneID, this.props.site3dOptions);
        }
        
        const zone = _3dOptions.zones[zoneID.toString()];

        if (zone) {
            const buildingID = zone[1];
            const building = _3dOptions.buildingIDs[buildingID.toString()];

            if (building) {
                const buildingGroupName = building[1];
                const buildingName = building[2];

                let buildingGroup = _3dOptions.indoorModels[buildingGroupName];

                if (!buildingGroup) {
                    buildingGroup = this.getBuildingGroupIndoorModel(buildingGroupName, buildingName);
                }

                if (buildingGroup) {
                    let buildingData = buildingGroup[buildingName];

                    if (!buildingData) {
                        buildingData = this.getBuildingDataFromDisplayText(buildingName, buildingGroup);
                    }

                    if (buildingData && buildingData.floors) {
                        for (let i = 0; i < buildingData.floors.length; i++) {
                            const floor = buildingData.floors[i];

                            if (floor.zoneID === zoneID) {
                                return floor;
                            }
                        }
                    }
                }
            }
        }

        return null;
    }

    getBuildingDataFromDisplayText(displayText, buildingGroup) {
        for (const buildingName in buildingGroup) {
            const buildingData = buildingGroup[buildingName];

            if (buildingData?.modelDisplayText === displayText) {
                return buildingData;
            }
        }

        return null;
    }

    setLazyAlarmInfo(zoneID, sensorType, sensorID, alarmLevel, isAlarm) {
        // 실내모델 파일 로딩이 끝나지 않아서 보여주지 못했던 알람정보
        this.lazyAlarmData = {
            zoneID: zoneID,
            sensorType: sensorType,
            sensorID: sensorID,
            alarmLevel: alarmLevel,
            isAlarm: isAlarm
        };
    }

    // 실내 모델이 로딩되지 않아서 표시하지 못했던 알람정보를 표현한다.
    showLazyAlarmData() {
        if (this.lazyAlarmData.isAlarm) {
            this.showAlarm(this.lazyAlarmData.zoneID, this.lazyAlarmData.sensorType, this.lazyAlarmData.sensorID, this.lazyAlarmData.alarmLevel, this.lazyAlarmData.isAlarm);
            this.lazyAlarmData = {};
        }
    }

    showAlarm(zoneID, sensorType, sensorID, alarmLevel, isAlarm, selectedPOI) {
        // 외부영역 알람 표시 추가 - K.D.R
        // isIndoor 변수로 판단하여 실내이라면 기존 로직
        let _3dOptions = this.props._3dOptions;

        // 멀티 사이트일 경우
        if (this.props.multiSite)
            _3dOptions = SpatialManager.get3dOptionsFromZoneID(zoneID, this.props.site3dOptions);

        // 알람이 외부인지 실내인지 판단
        let isIndoor = true;
        let zone = _3dOptions?.zones[zoneID.toString()];

        if (!zone) 
            isIndoor = false;

        let modelData = null;

        if (isIndoor) {
            modelData = SDMSDataManager.getZoneModelData(_3dOptions, zoneID);
        } else {
            const outdoorModel = _3dOptions.outdoorModel;
            modelData = [outdoorModel.file, outdoorModel.modelDisplayText, outdoorModel.camera];
        }

        if (!modelData) {
            if (this.indoorModelCountTemp < this.indoorModelCount) {
                // 아직 전체 실내모델 파일들의 로딩이 끝나지 않은 경우
                this.setLazyAlarmInfo(zoneID, sensorType, sensorID, alarmLevel, isAlarm);
            }
            else {
                // 실내모델이 없는 센서에 알람이 발생한 경우 해당 건물그룹으로 Focus를 이동한다.
                const buildingGroupName = SDMSDataManager.getBuildingGroupNameFromZoneID(zoneID, _3dOptions);

                if (buildingGroupName)
                    this.moveToBuildingGroup(buildingGroupName);
            }

            return;
        }

        // 내부 모델링이 로딩되지 않은 경우 알람 정보 
        let lazyAlarmData = null;

        let model = null;
        let modelName = "";

        if (isIndoor) {
            model = this.internalModels[modelData[0]];
            modelName = modelData[0];

            // 내부 모델링이 로딩되지 않은 경우 알람 정보 
            if (!model) {
                lazyAlarmData = {};
                lazyAlarmData.zoneID = zoneID;
                lazyAlarmData.sensorType = sensorType;
                lazyAlarmData.sensorID = sensorID;
                lazyAlarmData.alarmLevel = alarmLevel;
                lazyAlarmData.isAlarm = isAlarm;
                lazyAlarmData.selectedPOI = selectedPOI;
            }
        }
        else {
            model = {};

            const outdoorModels = this.siteOutdoorModels[_3dOptions.siteID];

            if (outdoorModels && outdoorModels.length > 0)
                modelName = outdoorModels[0].name;
        }

        if (modelName.length > 0) {
            this.optionManager.onPrevChangeView(zoneID, !isIndoor, modelName);
        }
        
        let sensor = this.getSensor(zoneID, sensorType, sensorID);

        if (sensor) {
            if (sensorType === SDMSMainMenu.PSM_Sensor || sensorType === SDMSMainMenu.Etc_Sensor) {
                this.props.onSelectSensorPOI(sensorID, sensorType, this.poiManager.getSensorPOI(sensorType, zoneID, sensorID), this.poiManager, true);
            }
        }

        let _cameraOption = modelData[2];
        if (_3dOptions?.indoorModelOnMemory === false && isIndoor && !selectedPOI) {
            // 내부 모델링이 로딩되지 않은 경우 알람 카메라 옵션 정보
            _cameraOption = this.getSensorCameraOption(sensor, modelData[2], isIndoor);
        }

        if ((!model || !sensor)) {
            // 해당 Zone의 기본 Viewport를 사용
            if (isIndoor === false) {
                // 해당 센서 정보가 없고 Indoor가 아니라면 외부로 이동
                if (!sensor) {
                    const outdoorModel = _3dOptions.outdoorModel;
                    const cameraOption = this.getSensorCameraOption(sensor, outdoorModel.camera, isIndoor);
                    this.setMovingCamera(cameraOption, Contents3D.Mode_Outdoor_All, null);
                }

                this.setLazyAlarmInfo(zoneID, sensorType, sensorID, alarmLevel, isAlarm);
            } else if (this.showIndoor(modelData[0], modelData[1], _cameraOption, zoneID, selectedPOI) === false) {
                this.setLazyAlarmInfo(zoneID, sensorType, sensorID, alarmLevel, isAlarm);
            }
        }
        else {
            if (!model.camera) {
                model.camera = modelData[2];
            }

            if (model.camera) {
                if ((sensor !== null && sensor !== undefined) &&
                    sensorType === SDMSMainMenu.PSM_Sensor || sensorType === SDMSMainMenu.Etc_Sensor ||
                    sensorType === SDMSMainMenu.Environment_Sensor || sensorType === SDMSMainMenu.Manufacture_Sensor || sensorType === SDMSMainMenu.Emergency_Sensor) {
                    sensor = this.getPOISensor(zoneID, sensorType, sensor.name);
                }

                // 해당 센서의 위치로 이동
                // 지금 현재 외부인지 실내인지가 아니라 알람이 외부인지 실내인지 수정 - K.D.R
                //const cameraOption = this.getSensorCameraOption(sensor, model, this.isIndoor()); 
                const cameraOption = this.getSensorCameraOption(sensor, model.camera, isIndoor);
                if (isIndoor === false) {
                    // 선택된 센서와 알람 센서와 다를 경우 카메라 이동을 하지 않도록 수정 - K.D.R
                    if (!selectedPOI || (selectedPOI[0] === sensorType && selectedPOI[1] === sensorID && selectedPOI[2] === zoneID))
                        this.setMovingCamera(cameraOption, Contents3D.Mode_Outdoor_All, null);
                } else if (isIndoor === true && this.showIndoor(modelData[0], modelData[1], cameraOption, zoneID) === false) {
                    this.setLazyAlarmInfo(zoneID, sensorType, sensorID, alarmLevel, isAlarm);
                }
            }
        }

        //const model = this.internalModels[modelData[0]];

        if (model) {
            this.tempAlarmModelInfo = null;
            const exitArrow = model[2];
            const exitArrowDatas = model[3];

            if (exitArrow && exitArrowDatas) {
                this.addMoving(exitArrow, exitArrowDatas, 2);
                //this.addBlink(exitArrow, 1.5, 1);
            }

            let sensorPOI = this.poiManager.getSensorPOI(sensorType, zoneID, sensorID);

            if (sensorPOI) {
                sensorPOI.visible = true;

                if (!selectedPOI || /*selectedPOI === null ||*/ (selectedPOI && selectedPOI[0] === sensorType && selectedPOI[1] === sensorID && selectedPOI[2] === zoneID)) {
                    sensorPOI.object = sensorPOI;
                    this.poiManager.selectPOI(sensorPOI, this.props.editMode, this.props.editModeParam);
                    this.props.onSelectPOI(sensorPOI, false, this);
                }
            }
            else {
                //const sensor = this.getSensor(zoneID, sensorType, sensorID);

                if (sensor) {
                    if (sensorType === SDMSMainMenu.Etc_Sensor || sensorType === SDMSMainMenu.PSM_Sensor ||
                        sensorType === SDMSMainMenu.Environment_Sensor || sensorType === SDMSMainMenu.Manufacture_Sensor || sensorType === SDMSMainMenu.Emergency_Sensor) {
                        let sensorPOIData = this.getPOISensor(zoneID, sensorType, sensor.name);

                        if (sensorPOIData) {
                            sensorPOI = this.poiManager.addSensor(sensorType, sensorPOIData.id, sensorPOIData.x, sensorPOIData.y, sensorPOIData.z, zoneID, true);
                        }
                    } else
                        sensorPOI = this.poiManager.addSensor(sensorType, sensorID, sensor.x, sensor.y, sensor.z, zoneID, true);

                    const movingCameraParam = this.movingCamera?.param;

                    if (movingCameraParam) {
                        // 카메라 이동이 끝난후 센서 위치로 이동하도록 한다.
                        movingCameraParam.sensorType = sensorType;
                        movingCameraParam.sensorID = sensorID;
                    }
                }

                if (sensorPOI) {
                    sensorPOI.visible = true;

                    if (!selectedPOI || (selectedPOI && selectedPOI[0] === sensorType && selectedPOI[1] === sensorID && selectedPOI[2] === zoneID)) {   // 현황정보 트리에서 POI를 클릭하여 이동시 알람 POI로 체크가 변경되어서 if문 추가 - K.D.R
                        sensorPOI.object = sensorPOI;
                        this.poiManager.selectPOI(sensorPOI, this.props.editMode, this.props.editModeParam);
                        this.props.onSelectPOI(sensorPOI, false, this);
                    }
                }
            }

            if (isAlarm) {
                const alarmModels = this.getCurrentAlarmModels(alarmLevel);

                if (alarmModels && alarmModels.length > 0) {
                    this.hideAlarms();

                    if (sensorPOI) {
                        const alarmModel = this.moveAlarmAnimation(sensorPOI.position.x, sensorPOI.position.y, sensorPOI.position.z, alarmLevel);

                        if (alarmModel) {
                            alarmModel.visible = true;
                            alarmModel.alarmName = sensorType + "_" + sensorID;
                        }
                    }

                    // 알람 발생시간 체크
                    let dtTime = this.props.selectedAlarm?.dtTime;
                    if (!dtTime)
                        dtTime = null;

                    this.setState({ alarm: alarmLevel, alarmType: sensorType, alarmTime: dtTime, alarmSoundOff: false });
                }
            }
        }
        else if (_3dOptions?.indoorModelOnMemory === false) {
            this.setLazyAlarmModel(modelName, lazyAlarmData);
        }
    }

    addAlarm(zoneID, sensorType, sensorID, alarmLevel, alarmTime = null) {
        const modelData = SDMSDataManager.getZoneModelData(this.props._3dOptions, zoneID);

        if (!modelData) {
            return;
        }

        //this.showIndoor(modelData[0], modelData[1], modelData[2], zoneID);

        const model2 = this.internalModels[modelData[0]];

        if (model2) {
            const exitArrow = model2[2];
            const exitArrowDatas = model2[3];

            if (exitArrow && exitArrowDatas) {
                this.addMoving(exitArrow, exitArrowDatas, 2);
                //this.addBlink(exitArrow, 1.5, 1);
            }
        }
        //

        let sensorPOI = this.poiManager.getSensorPOI(sensorType, zoneID, sensorID);

        if (this.currentModel) {
            const model = this.getIndoorZoneModel(zoneID);
            if (model !== null && model.name !== this.currentModel.name) {
                this.hideAlarms();
            }

        }

        if (sensorPOI) {
            sensorPOI.visible = true;

            sensorPOI.object = sensorPOI;
            this.poiManager.selectPOI(sensorPOI, this.props.editMode, this.props.editModeParam);
            this.props.onSelectPOI(sensorPOI, false, this);
        }
        else {
            const sensor = this.getSensor(zoneID, sensorType, sensorID);

            if (sensor) {
                if (sensorType === "etc" || sensorType === "psm") {
                    let sensorPOIData = this.getPOISensor(zoneID, sensorType, sensor.name);

                    if (sensorPOIData) {
                        sensorPOI = this.poiManager.addSensor(sensorType, sensorPOIData.id, sensorPOIData.x, sensorPOIData.y, sensorPOIData.z, zoneID, true);
                    }
                } else
                    sensorPOI = this.poiManager.addSensor(sensorType, sensorID, sensor.x, sensor.y, sensor.z, zoneID, true);
            }

            if (sensorPOI) {
                sensorPOI.visible = true;
            }
        }

        const alarmModels = this.getCurrentAlarmModels(alarmLevel);

        if (alarmModels && alarmModels.length > 0 && sensorPOI) {
            const alarmModel = this.moveAlarmAnimation(sensorPOI.position.x, sensorPOI.position.y, sensorPOI.position.z, alarmLevel);

            if (alarmModel) {
                alarmModel.visible = true;
                alarmModel.alarmName = sensorType + "_" + sensorID;
            }

            this.setState({ alarm: alarmLevel, alarmType: sensorType, alarmTime: alarmTime, alarmSoundOff: false });
        }
    }

    removeAlarm(sensorType, sensorID, alarmLevel) {
        const alarmModels = this.getCurrentAlarmModels(alarmLevel);

        if (alarmModels) {
            const modelCount = alarmModels.length;
            const target = sensorType + "_" + sensorID;

            for (let i = 0; i < modelCount; i++) {
                const alarmModel = alarmModels[i];

                if (alarmModel && alarmModel.alarmName === target) {
                    alarmModel.visible = false;
                    break;
                }
            }
        }
    }

    getCurrentAlarmModels(alarmLevel) {
        if (alarmLevel > 0) {
            const alarmModels = this.alarmModels[alarmLevel - 1];
            return alarmModels;
        }

        return null;
    }

    hideAlarms() {
        const modelCount = this.alarmModels.length;

        for (let i = 0; i < modelCount; i++) {
            const alarmModels = this.alarmModels[i];
            const alarmModelCount = alarmModels.length;

            for (let j = 0; j < alarmModelCount; j++) {
                const alarmModel = alarmModels[j];

                if (alarmModel && alarmModel.visible) {
                    alarmModel.visible = false;
                }
            }
            /*const alarmModel = this.alarmModels[i];

            if (alarmModel) {
                alarmModel.visible = false;
            }*/
        }

        this.setState({ alarm: Contents3D.NO_ALARM, alarmType: null, alarmTime: null, alarmSoundOff: false });
    }

    moveAlarmAnimation(x, y, z, alarmLevel) {
        const alarmModels = this.alarmModels[alarmLevel - 1];
        const modelCount = alarmModels.length;

        const scale = this.isIndoor() ? POIManager.IndoorPoiScale : POIManager.OutdoorPoiScale;

        for (let i = 0; i < modelCount; i++) {
            const alarmModel = alarmModels[i];

            if (alarmModel && alarmModel.visible === false) {
                alarmModel.scale.x = scale;
                alarmModel.scale.z = scale;
                this.moveAnimationChild(alarmModel, x, y, z, scale);
                return alarmModel;
            }
        }

        return null;
        /*  const modelCount = this.alarmModels.length;

            for (let i = 0; i < modelCount; i++) {
            const alarmModel = this.alarmModels[i];

            if (alarmModel !== null) {
                const childCount = alarmModel.children.length;

                // animation Object는 직접 옮길수 없고 child object들을 모두 옮겨야 한다.
                for (let i = 0; i < childCount; i++) {
                    const childModel = alarmModel.children[i];
                    childModel.position.x = x;
                    childModel.position.y = y;
                    childModel.position.z = z;
                }
            }
        }*/
    }

    moveAnimationChild(model, x, y, z, scale) {
        if (model) {
            const childCount = model.children.length;

            // animation Object는 직접 옮길수 없고 child object들을 모두 옮겨야 한다.
            for (let i = 0; i < childCount; i++) {
                const childModel = model.children[i];
                childModel.position.x = x;
                childModel.position.y = y;
                childModel.position.z = z;

                if (!childModel.userData?.scale) {
                    childModel.userData =
                    {
                        scale: {
                            x: childModel.scale.x,
                            z: childModel.scale.z
                        }
                    }
                }

                childModel.scale.x = childModel.userData.scale.x * scale;
                childModel.scale.z = childModel.userData.scale.z * scale;
            }
        }
    }

    showOutdoorOrtho() {
        const orthoCameraData = this.props._3dOptions.outdoorModel.cameraOrtho;

        if (!orthoCameraData) {
            return;
        }

        this.showOutdoor(Contents3D.Mode_Outdoor_All);

        this.camera.position.set(orthoCameraData.position[0], orthoCameraData.position[1], orthoCameraData.position[2]);
        this.camera.rotation.set(orthoCameraData.rotation[0], orthoCameraData.rotation[1], orthoCameraData.rotation[2]);
        this.camera.quaternion.set(orthoCameraData.quaternion[0], orthoCameraData.quaternion[1], orthoCameraData.quaternion[2], orthoCameraData.quaternion[3]);
        this.camera.zoom = orthoCameraData.zoom;
        this.controls.target.set(orthoCameraData.targetControl[0], orthoCameraData.targetControl[1], orthoCameraData.targetControl[2]);

        this.camera.lookAt(this.camera.position.x, this.controls.target.y, this.camera.position.z);

        this.camera.up.set(0, 1, 0);
        this.camera.updateProjectionMatrix();
        this.controls.update();

        this.controls.enableRotate = false;
        this.useBoundingBox = false;
    }

    showIndoorOrtho(modelFile, cameraOrtho, zoneID) {
        const orthoCameraData = this.getOrthoCameraData(zoneID, this.getBuildingIDFromZone(zoneID));

        if (!orthoCameraData) {
            return;
        }

        this.setSelectedFacility(null);
        this.fakeWallManager.setZoneID(zoneID);

        // 카메라 이동이 끝난후 나타나게 한다.
        this.textPOIManager.hideEquipZoneSprites();

        this.textPOIManager.updateIndoorDatas(zoneID, this.props._3dOptions, this.poiManager);

        if (this.prevIndoorFacility) {
            this.prevIndoorFacility.object.visible = false;
            this.prevIndoorFacility = null;
        }

        const modelData = this.internalModels[modelFile];

        if (modelData) {
            // 카메라 이동이 끝난후 나타나게 한다.
            this.poiManager.removeSensors(null);

            const model = modelData[0];

            if (this.prevIndoorModel) {
                this.prevIndoorModel.visible = false;
            }

            const param = {
                zoneID: zoneID
            };

            model.visible = true;
            this.prevIndoorModel = model;
            this.currentIndoorModel = model;
            this.currentModel = model;

            // 편집모드 층 이동 시 트리 선택 - K.D.R
            if (zoneID) {
                const value = this.props.getSpatialInfo(param.zoneID);
                if (value && value.length === 3) {
                    this.props.onChangeBuildingGroup(value[0], SDMS.SelectedStatusInfoType.buildingGroup);
                    this.props.onChangeBuildingGroup(value[1], SDMS.SelectedStatusInfoType.building);
                    this.props.onChangeBuildingGroup(value[2], SDMS.SelectedStatusInfoType.zone);
                }
            }

            const exitArrow = modelData[2];

            if (exitArrow !== null) {
                exitArrow.visible = false;
            }

            this.camera.position.set(orthoCameraData.position[0], orthoCameraData.position[1], orthoCameraData.position[2]);
            this.camera.rotation.set(orthoCameraData.rotation[0], orthoCameraData.rotation[1], orthoCameraData.rotation[2]);
            this.camera.quaternion.set(orthoCameraData.quaternion[0], orthoCameraData.quaternion[1], orthoCameraData.quaternion[2], orthoCameraData.quaternion[3]);
            this.camera.zoom = orthoCameraData.zoom;
            this.controls.target.set(orthoCameraData.targetControl[0], orthoCameraData.targetControl[1], orthoCameraData.targetControl[2]);

            this.camera.lookAt(this.camera.position.x, this.controls.target.y, this.camera.position.z);

            this.camera.up.set(0, 1, 0);
            this.camera.updateProjectionMatrix();
            this.controls.update();

            this.controls.enableRotate = false;

            this.poiManager.addZoneSensors(zoneID, 1, this.props._3dOptions.outdoorZones, this.props._3dOptions.zones, this.props.visibleSensorTypes);

            this.textPOIManager.showEquipZoneSprites(zoneID, this.props._3dOptions?.siteID);
            this.fakeWallManager.showFakeWalls();

            this.props.setCurrentView(zoneID);
            this.useBoundingBox = false;

            this.showOutdoor(Contents3D.Mode_Indoor);
        }
        else if (this.props._3dOptions.indoorModelOnMemory === false) {

            // 실내모델 파일 로딩이 끝나지 않아서 보여주지 못했던 층 정보 저장
            this.setLazyIndoorInfo(zoneID);

            // 실내모델 파일 로딩이 끝나지 않아서 못한 카메라 셋팅
            this.setLazyOrthoCamera(orthoCameraData);

            // 현황정보 팝업창 해당 위치 열기
            if (zoneID) {
                const value = this.props.getSpatialInfo(zoneID);
                if (value && value.length === 3) {
                    this.props.onChangeBuildingGroup(value[0], SDMS.SelectedStatusInfoType.buildingGroup);
                    this.props.onChangeBuildingGroup(value[1], SDMS.SelectedStatusInfoType.building);
                    this.props.onChangeBuildingGroup(value[2], SDMS.SelectedStatusInfoType.zone);
                }
            }

            if (Contents3D.MoveNHide) {
                this.tempInternalModels = SpatialManager.showIndoor2(zoneID, this.props.site3dOptions, this);
            }
            else {
                const isSetMovingCamera = false;
                SpatialManager.showIndoor(zoneID, this.props.site3dOptions, this, isSetMovingCamera);
            }

            this.props.setCurrentView(zoneID);
        }
    }

    static showZoneSensors(param) {
        const contents3D = param.contents3D;

        if (param.zoneID !== null && param.zoneID !== undefined) {
            contents3D.poiManager.addZoneSensors(param.zoneID, POIManager.IndoorPoiScale, contents3D.props._3dOptions.outdoorZones, contents3D.props._3dOptions.zones, contents3D.props.visibleSensorTypes);

            contents3D.textPOIManager.hideEquipZoneSprites();
            contents3D.textPOIManager.showEquipZoneSprites(param.zoneID, contents3D.props._3dOptions?.siteID);
            contents3D.fakeWallManager.showFakeWalls();
            contents3D.equipZoneAreaManager.showEquipZoneAreas();

            if (param.sensorType && param.sensorID !== null && param.sensorID !== undefined) {
                contents3D.moveToSensor(param.zoneID, param.sensorType, param.sensorID);
            }
        }
    }

    goBackOutdoor(model, cameraOption) {
        if (!model || !model.file || model.file.length === 0)
            return;

        // 외부에서 내부 알람이 표시되어 보이지 않도록 수정 - K.D.R
        this.hideAlarms();

        // 현황정보 트리 닫기 - K.D.R
        this.props.onChangeBuildingGroup(null, SDMS.SelectedStatusInfoType.none);

        this.optionManager.onPrevChangeView(null, true, model.file);
        this.setMovingCamera(cameraOption, Contents3D.Mode_Outdoor_All);
        // 건물그룹, 건물의 이름과 좌표를 새로 얻어온다.
        this.textPOIManager.updateOuterDatas(this.props._3dOptions, this.poiManager);
    }

    goBackPrevOutdoor = () => {
        const prevOutdoorCameraViewport = { ...this.prevOutdoorCameraViewport };

        if (prevOutdoorCameraViewport.position.length === 3) {
            this.goBackOutdoor(this.props._3dOptions.outdoorModel, prevOutdoorCameraViewport);
        }
    }

    setPrevOutdoorViewport() {
        this.prevOutdoorCameraViewport = {
            position: [this.camera.position.x, this.camera.position.y, this.camera.position.z],
            rotation: [this.camera.rotation.x, this.camera.rotation.y, this.camera.rotation.z],
            quaternion: [this.camera.quaternion.x, this.camera.quaternion.y, this.camera.quaternion.z, this.camera.quaternion.w],
            targetControl: [this.controls.target.x, this.controls.target.y, this.controls.target.z],
            far: this.camera.far,
            near: this.camera.near,
            fov: this.camera.fov
        }
    }

    showIndoor(modelFile, modelDescription, cameraOptions, zoneID, selectedPOI, sensorType) {
        if (this.props.isEditMode === false && !this.isIndoor()) {
            this.setPrevOutdoorViewport();
        }

        if (this.props?.currentView?.zoneID === zoneID && this.prevIndoorModel && this.prevIndoorModel.name === modelFile && this.currentIndoorModel && this.currentIndoorModel.name === modelFile) {
            if (Geometry.getDistance3(this.camera.position.x, this.camera.position.y, this.camera.position.z, cameraOptions.position[0], cameraOptions.position[1], cameraOptions.position[2]) > Geometry.Tolerance ||
                Geometry.getDistance3(this.camera.rotation.x, this.camera.rotation.y, this.camera.rotation.z, cameraOptions.rotation[0], cameraOptions.rotation[1], cameraOptions.rotation[2]) > Geometry.Tolerance) {
                const param = {
                    method: Contents3D.showZoneSensors,
                    methodParam: {
                        contents3D: this,
                        zoneID: zoneID
                    }
                };
                this.setMovingCamera(cameraOptions, Contents3D.Mode_Indoor, param);
            }

            return true;
        }

        const _3dOptions = SpatialManager.get3dOptionsFromZoneID(zoneID, this.props.site3dOptions);

        this.setSelectedFacility(null);
        const zoneData = _3dOptions.zones[zoneID];

        if (zoneData) {
            if (zoneData.length >= 2) {
                const buildingID = zoneData[1];
                const buildingData = _3dOptions.buildingIDs[buildingID];

                if (buildingData && buildingData.length >= 4) {
                    const modelName = buildingData[3];
                    DataInfo.processBuildingData(modelName, this.props.showBuildingInfo);
                }
            }
        }

        this.fakeWallManager.setZoneID(zoneID);

        // 영역 생성 관련
        this.equipZoneAreaManager.setZoneID(zoneID, _3dOptions?.siteID);

        // 카메라 이동이 끝난후 나타나게 한다.
        this.textPOIManager.hideEquipZoneSprites();
        //this.showEquipZoneSprites(zoneID);

        this.textPOIManager.updateIndoorDatas(zoneID, _3dOptions, this.poiManager);

        if (this.prevIndoorFacility) {
            this.prevIndoorFacility.object.visible = false;
            this.prevIndoorFacility = null;
        }

        const modelData = this.internalModels[modelFile];
        
        if (modelData) {
            // 카메라 이동이 끝난후 나타나게 한다.
            this.poiManager.removeSensors(null);
            //this.addZoneSensors(zoneID, 1);

            const model = modelData[0];

            if (this.prevIndoorModel) {
                this.prevIndoorModel.visible = false;
            }

            const param = {
                method: Contents3D.showZoneSensors,
                methodParam: {
                    contents3D: this,
                    zoneID: zoneID
                }
            };

            model.visible = true;
            this.prevIndoorModel = model;
            this.currentIndoorModel = model;
            this.currentModel = model;

            this.setMovingCamera(cameraOptions, Contents3D.Mode_Indoor, param);
            //this.setMovingCamera(modelData[1], Contents3D.Mode_Indoor, param);
            if (param.methodParam.zoneID) {
                const value = this.props.getSpatialInfo(param.methodParam.zoneID);
                if (value && value.length === 3) {
                    this.props.onChangeBuildingGroup(value[0], SDMS.SelectedStatusInfoType.buildingGroup);
                    this.props.onChangeBuildingGroup(value[1], SDMS.SelectedStatusInfoType.building);
                    this.props.onChangeBuildingGroup(value[2], SDMS.SelectedStatusInfoType.zone);

                    if (sensorType === "fire")
                        this.props.onChangeBuildingGroup('fireSensors', SDMS.SelectedStatusInfoType.fireSensors);
                    else if (sensorType === "psm")
                        this.props.onChangeBuildingGroup('psmSensors', SDMS.SelectedStatusInfoType.psmSensors);
                    else if (sensorType === "etc")
                        this.props.onChangeBuildingGroup('etcSensors', SDMS.SelectedStatusInfoType.etcSensors);
                    else if (sensorType === "earthquake")
                        this.props.onChangeBuildingGroup('earthquakSensors', SDMS.SelectedStatusInfoType.earthquakeSensors);
                    else if (sensorType === "strongWind")
                        this.props.onChangeBuildingGroup('strongWindSensors', SDMS.SelectedStatusInfoType.strongWindSensors);
                }
            }

            const exitArrow = modelData[2];

            if (exitArrow !== null) {
                exitArrow.visible = false;
                //this.addBlink(exitArrow, 1.5, 1);
            }

            this.props.setCurrentView(zoneID);
            this.useBoundingBox = false;
            return true;
        }
        else if (_3dOptions?.indoorModelOnMemory === false) {
            // 실내모델 파일 로딩이 끝나지 않아서 보여주지 못했던 층 정보 저장
            this.setLazyIndoorInfo(zoneID);

            // 실내모델 파일 로딩이 끝나지 않아서 못한 카메라 셋팅
            if (!selectedPOI) {
                // checkAlarm 으로 인한 showIndoor 호출은 카메라 설정은 X
                this.setLazyMovingCamera(cameraOptions, Contents3D.Mode_Indoor);

                // 현황정보 팝업창 해당 위치 열기
                if (zoneID) {
                    const value = this.props.getSpatialInfo(zoneID);
                    if (value && value.length === 3) {
                        this.props.onChangeBuildingGroup(value[0], SDMS.SelectedStatusInfoType.buildingGroup);
                        this.props.onChangeBuildingGroup(value[1], SDMS.SelectedStatusInfoType.building);
                        this.props.onChangeBuildingGroup(value[2], SDMS.SelectedStatusInfoType.zone);

                        if (sensorType === "fire") 
                            this.props.onChangeBuildingGroup('fireSensors', SDMS.SelectedStatusInfoType.fireSensors);
                        else if (sensorType === "psm") 
                            this.props.onChangeBuildingGroup('psmSensors', SDMS.SelectedStatusInfoType.psmSensors);
                        else if (sensorType === "etc") 
                            this.props.onChangeBuildingGroup('etcSensors', SDMS.SelectedStatusInfoType.etcSensors);
                        else if (sensorType === "earthquake") 
                            this.props.onChangeBuildingGroup('earthquakSensors', SDMS.SelectedStatusInfoType.earthquakeSensors);
                        else if (sensorType === "strongWind") 
                            this.props.onChangeBuildingGroup('strongWindSensors', SDMS.SelectedStatusInfoType.strongWindSensors);
                        
                    }
                }
            }

            if (Contents3D.MoveNHide) {
                this.tempInternalModels = SpatialManager.showIndoor2(zoneID, this.props.site3dOptions, this);
            }
            else {
                const isSetMovingCamera = false;
                SpatialManager.showIndoor(zoneID, this.props.site3dOptions, this, isSetMovingCamera);
            }

            this.props.setCurrentView(zoneID);
            return true;
        }

        //this.showBuildingInfo();
        return false;
    }

    setLazyMovingCamera(cameraOptions, mode) {
        // 실내모델 파일 로딩이 끝나지 않아서 못한 카메라 셋팅 저장
        this.lazyMovingCameraData = {
            cameraOptions: cameraOptions,
            mode: mode,
            orthoCameraData: null
        };
    }

    setLazyOrthoCamera(orthoCameraData) {
        this.lazyMovingCameraData = {
            cameraOptions: null,
            mode: null,
            orthoCameraData: orthoCameraData
        };
    }

    showLazyMovingCamera() {
        if (this.lazyMovingCameraData?.cameraOptions && this.lazyMovingCameraData?.mode) {
            // 실내모델링이 로딩되지 않을 경우, 카메라 첫 외곽 이동 여부 체크
            if (this.FirstIndoorNotOnMemoryCameraMove === false) {
                setTimeout(() => this.showLazyMovingCamera(), 500);
                return;
            }

            this.setMovingCamera(this.lazyMovingCameraData.cameraOptions, this.lazyMovingCameraData.mode, null);

            this.lazyMovingCameraData = {};
        }
        else if (this.lazyMovingCameraData?.orthoCameraData) {
            // 편집모드 경우
            this.camera.position.set(this.lazyMovingCameraData.orthoCameraData.position[0], this.lazyMovingCameraData.orthoCameraData.position[1], this.lazyMovingCameraData.orthoCameraData.position[2]);
            this.camera.rotation.set(this.lazyMovingCameraData.orthoCameraData.rotation[0], this.lazyMovingCameraData.orthoCameraData.rotation[1], this.lazyMovingCameraData.orthoCameraData.rotation[2]);
            this.camera.quaternion.set(this.lazyMovingCameraData.orthoCameraData.quaternion[0], this.lazyMovingCameraData.orthoCameraData.quaternion[1], this.lazyMovingCameraData.orthoCameraData.quaternion[2], this.lazyMovingCameraData.orthoCameraData.quaternion[3]);
            this.camera.zoom = this.lazyMovingCameraData.orthoCameraData.zoom;
            this.controls.target.set(this.lazyMovingCameraData.orthoCameraData.targetControl[0], this.lazyMovingCameraData.orthoCameraData.targetControl[1], this.lazyMovingCameraData.orthoCameraData.targetControl[2]);

            this.camera.lookAt(this.camera.position.x, this.controls.target.y, this.camera.position.z);

            this.camera.up.set(0, 1, 0);
            this.camera.updateProjectionMatrix();
            this.controls.update();

            this.controls.enableRotate = false;

            this.lazyMovingCameraData = {};
        }
    }

    setLazyIndoorInfo(zoneID) {
        // 실내모델 파일 로딩이 끝나지 않아서 보여주지 못했던 층 정보(textPOI, SensorPOI 등) 저장
        this.lazyIndoormData = {
            zoneID: zoneID
        };
    }

    showLazyIndoorData() {
        if (this.lazyIndoormData.zoneID) {
            const _3dOptions = SpatialManager.get3dOptionsFromZoneID(this.lazyIndoormData.zoneID, this.props.site3dOptions);

            this.poiManager.addZoneSensors(this.lazyIndoormData.zoneID, POIManager.IndoorPoiScale, _3dOptions.outdoorZones, _3dOptions.zones, this.props.visibleSensorTypes);

            this.textPOIManager.hideEquipZoneSprites();
            this.textPOIManager.showEquipZoneSprites(this.lazyIndoormData.zoneID, _3dOptions?.siteID);
            this.fakeWallManager.showFakeWalls();

            // 영역 생성 관련
            this.equipZoneAreaManager.showEquipZoneAreas();

            this.lazyIndoormData = {};
        }
    }

    setLazyAlarmModel = (modelName, lazyAlarmData) => {
        if (modelName && lazyAlarmData) {
            this.lazyAlarmModelData = {
                modelName: modelName,
                lazyAlarmData: lazyAlarmData
            };
        }
    }

    showLazyAlarmModel = (contents) => {
        if (this.lazyAlarmModelData && this.lazyAlarmModelData?.modelName === contents) {
            const lazyAlarmData = this.lazyAlarmModelData.lazyAlarmData;
            const model = this.internalModels[contents];

            if (model) {
                this.tempAlarmModelInfo = null;
                const exitArrow = model[2];
                const exitArrowDatas = model[3];

                if (exitArrow && exitArrowDatas) {
                    this.addMoving(exitArrow, exitArrowDatas, 2);
                }

                let sensorPOI = this.poiManager.getSensorPOI(lazyAlarmData.sensorType, lazyAlarmData.zoneID, lazyAlarmData.sensorID);

                if (sensorPOI) {
                    sensorPOI.visible = true;

                    if (!lazyAlarmData.selectedPOI || (lazyAlarmData.selectedPOI && lazyAlarmData.selectedPOI[0] === lazyAlarmData.sensorType && lazyAlarmData.selectedPOI[1] === lazyAlarmData.sensorID && lazyAlarmData.selectedPOI[2] === lazyAlarmData.zoneID)) {
                        sensorPOI.object = sensorPOI;
                        this.poiManager.selectPOI(sensorPOI, this.props.editMode, this.props.editModeParam);
                        this.props.onSelectPOI(sensorPOI, false, this);
                    }
                }
                else {
                    const sensor = this.getSensor(lazyAlarmData.zoneID, lazyAlarmData.sensorType, lazyAlarmData.sensorID);
                    
                    if (sensor) {
                        if (lazyAlarmData.sensorType === "etc" || lazyAlarmData.sensorType === "psm") {
                            let sensorPOIData = this.getPOISensor(lazyAlarmData.zoneID, lazyAlarmData.sensorType, sensor.name);

                            if (sensorPOIData) {
                                sensorPOI = this.poiManager.addSensor(lazyAlarmData.sensorType, sensorPOIData.id, sensorPOIData.x, sensorPOIData.y, sensorPOIData.z, lazyAlarmData.zoneID, true);
                            }
                        } else
                            sensorPOI = this.poiManager.addSensor(lazyAlarmData.sensorType, lazyAlarmData.sensorID, sensor.x, sensor.y, sensor.z, lazyAlarmData.zoneID, true);

                        const movingCameraParam = this.movingCamera?.param;

                        if (movingCameraParam) {
                            // 카메라 이동이 끝난후 센서 위치로 이동하도록 한다.
                            movingCameraParam.sensorType = lazyAlarmData.sensorType;
                            movingCameraParam.sensorID = lazyAlarmData.sensorID;
                        }
                    }

                    if (sensorPOI) {
                        sensorPOI.visible = true;

                        if (!lazyAlarmData.selectedPOI || (lazyAlarmData.selectedPOI && lazyAlarmData.selectedPOI[0] === lazyAlarmData.sensorType && lazyAlarmData.selectedPOI[1] === lazyAlarmData.sensorID && lazyAlarmData.selectedPOI[2] === lazyAlarmData.zoneID)) {   // 현황정보 트리에서 POI를 클릭하여 이동시 알람 POI로 체크가 변경되어서 if문 추가 - K.D.R
                            sensorPOI.object = sensorPOI;
                            this.poiManager.selectPOI(sensorPOI, this.props.editMode, this.props.editModeParam);
                            this.props.onSelectPOI(sensorPOI, false, this);
                        }
                    }
                }

                if (lazyAlarmData.isAlarm) {
                    const alarmModels = this.getCurrentAlarmModels(lazyAlarmData.alarmLevel);

                    if (alarmModels && alarmModels.length > 0 && sensorPOI) {
                        this.hideAlarms();

                        const alarmModel = this.moveAlarmAnimation(sensorPOI.position.x, sensorPOI.position.y, sensorPOI.position.z, lazyAlarmData.alarmLevel);

                        if (alarmModel) {
                            alarmModel.visible = true;
                            alarmModel.alarmName = lazyAlarmData.sensorType + "_" + lazyAlarmData.sensorID;
                        }

                        // 알람 발생시간 체크
                        let dtTime = this.props.selectedAlarm?.dtTime;
                        if (!dtTime)
                            dtTime = null;

                        this.setState({ alarm: lazyAlarmData.alarmLevel, alarmType: lazyAlarmData.sensorType, alarmTime: dtTime, alarmSoundOff: false });
                    }
                }
            }

            this.lazyAlarmModelData = null;
        }
    }

    removeIndoor() {
        if (this.currentIndoorModel) {
            this.currentIndoorModel.visible = false;
            this.currentIndoorModel = null;
        }
    }

    showOutdoor(mode) {
        //this.setSelectedFacility(null);
        this.useBoundingBox = true;
        this.removeBoundingBox();

        const _3dOptions = this.props.site3dOptions[this.props.currentSiteID];

        let outdoorZoneID = null;

        if (mode !== Contents3D.Mode_Indoor) {

            for (let zoneID in _3dOptions?.outdoorZones) {
                zoneID = Number(zoneID);

                if (zoneID !== NaN && zoneID !== 30000)
                    outdoorZoneID = zoneID;
            }

            this.equipZoneAreaManager.setZoneID(outdoorZoneID);
            this.textPOIManager.hideEquipZoneSprites();

            // 외곽 공간 표시
            if (_3dOptions)
                this.textPOIManager.updateOutdoorEquipZoneData(_3dOptions);
        }

        if (this.prevIndoorFacility) {
            this.prevIndoorFacility.object.visible = false;
            this.prevIndoorFacility = null;
        }
        
        const outdoorModels = this.siteOutdoorModels[this.props.currentSiteID];

        // 멀티사이트 경우 초기 로딩시 현재 사이트 외곽(outdoorModels)이 올라오지 않았을 경우가 있다.
        if (!_3dOptions/* || !outdoorModels*/) {
            return;
        }

        if (mode === Contents3D.Mode_Indoor/* && outdoorModels*/) {
            // 멀티사이트 관련
            if (this.props.multiSite) {
                for (const siteID in this.siteOutdoorModels) {
                    // 전 사이트 외부영역 끄기
                    const _outdoorModels = this.siteOutdoorModels[siteID];
                    _outdoorModels.map(model => {
                        model.visible = false;
                    });

                    // 현재 사이트 외 외부텍스트 끄기
                    const tempSite = parseInt(siteID);
                    if (tempSite !== NaN && this.props.currentSiteID !== tempSite) {
                        this.textPOIManager.setVisible(false, tempSite);
                    }
                }
            }
            else if (outdoorModels) {
                outdoorModels.map(model => {
                    model.visible = false;
                });
            }
            
        }
        else {
            if (this.prevIndoorModel) {
                this.prevIndoorModel.visible = false;
                this.prevIndoorModel = null;
            }

            if (this.currentIndoorModel) {
                this.currentIndoorModel.visible = false;
                this.currentIndoorModel = null;
            }

            if (outdoorModels) {
                outdoorModels.map(model => {
                    model.visible = true;
                });

                if (outdoorModels.length > 0) {
                    this.currentModel = outdoorModels[0];
                }
            }

            this.clearBlink();
            this.clearMoving();

            // 실내 센서들 제거
            this.poiManager.removeSensors(null);
            this.poiManager.addOutdoorSensors(_3dOptions.outdoorZones, _3dOptions.zones, this.props.visibleSensorTypes);

            // 가벽 제거
            this.fakeWallManager.clear();

            // 외부영역의 가벽 로딩하기
            this.fakeWallManager.setZoneID(null);
            this.fakeWallManager.showFakeWalls();

            // 영역 생성 관련
            this.equipZoneAreaManager.showEquipZoneAreas();

            // 외부에 있는 POI 이동을 했을땐 트리가 접히지 않는다
            if (!this.nonChangedStatusInfo) {
                // 외부영역에 POI를 선택하여 이동할때, showOutdoor를 다중호출로 인해서 POI 선택이 해제되어 주석처리 - K.D.R
                //this.props.onChangeBuildingGroup(null, SDMS.SelectedStatusInfoType.none);     

                this.nonChangedStatusInfo = false;
            }

            if (_3dOptions.indoorModelOnMemory === false) {
                // 실내 모델을 메모리에서 해제한다.
                SpatialManager.clearIndoorModels(this);
            }
        }

        /*const childCount = this.scene.children.length;

        for (let i = 0; i < childCount; i++) {
            const child = this.scene.children[i];

            if (child.name === this.props._3dOptions.outdoorModel.file) {
                child.visible = mode !== Contents3D.Mode_Indoor;
                break;
            }
        }*/

        //this.showBuildingInfo();

        const animationModels = [];

        if (mode !== Contents3D.Mode_Indoor) {
            //this.props.setCurrentView(null);
            this.props.setCurrentView(outdoorZoneID);

            if (outdoorModels) {
                const outdoorModelCount = outdoorModels.length;

                for (let i = 0; i < outdoorModelCount; i++) {
                    const animationModel = this.modelAnimations[outdoorModels[i].name];

                    if (animationModel) {
                        animationModels.push(animationModel);
                    }
                }
            }
        }
        else {
            if (this.currentIndoorModel) {
                const animationModel = this.modelAnimations[this.currentIndoorModel.name];

                if (animationModel) {
                    animationModels.push(animationModel);
                }
            }
        }

        this.currentAnimationModels = animationModels;
    }

    /*showBuildingInfo() {
        const arrInfo = new Array();
        arrInfo[0] = SdmsResource.ID.buildingInfo.buildingType;       // 건물 or 설비
        arrInfo[1] = "1동";
        arrInfo[2] = "CVD 공장";
        arrInfo[3] = "9,501.86m2";
        arrInfo[4] = "2012년 8월 15일";

        this.props.showBuildingInfo(arrInfo);
    }*/

    showBuildingGroupText(zoomValue, isIndoor) {
        if (this.textPOIManager.showBuildingGroupText(zoomValue, isIndoor) === false) {
            this.removeBoundingBox();
        }
    }

    onMouseMove = (event) => {
        const current = new Date();
        const timeSpan = current - this.lastAutoRotationCommandTime;

        this.optionManager.onPrevMouseMove(event);

        if (timeSpan > Contents3D.AUTO_ROTATION_IDLE_TIME) {
            // 즉시회전 버튼을 누른뒤 AUTO_ROTATION_IDLE_TIME 동안은 자동회전이 멈추지 않도록 한다.
            this.lastMouseMoveTime = current;
        }

        // 영역 생성 관련
        if (this.props.editMode === Contents3D.Edit_Mode_Text && this.equipZoneAreaManager.addAreaMode()) {
            this.equipZoneAreaManager.onMouseMove(event);
        }

        if (this.props.editMode === Contents3D.Edit_Mode_FakeWall) {
            this.fakeWallManager.onMouseMove(event);
            this.poiManager.showTempCCTVPOI(this.isIndoor(), false);
            this.optionManager.onPostMouseMove(event);
            return;
        }

        if (!this.camera || !this.useBoundingBox || this.state.loading || this.movingCamera || this.props.isEditMode) {
            if (this.camera && this.state.loading === false) {
                this.movePOI(event);
            }

            this.optionManager.onPostMouseMove(event);
            return;
        }

        this.poiManager.showTempCCTVPOI(this.isIndoor(), false);
        this.removeBoundingBox();

        const x = event.nativeEvent.offsetX;
        const y = event.nativeEvent.offsetY;
        const mouse = new THREE.Vector2((x / window.innerWidth) * 2 - 1, -(y / window.innerHeight) * 2 + 1);

        const raycaster = new THREE.Raycaster();
        raycaster.setFromCamera(mouse, this.camera);

        if (this.currentIndoorModel === this.currentModel && this.currentModel !== null) {
            // 실내공간
            const internalModel = this.internalModels[this.currentModel.name];

            if (internalModel && internalModel[4]) {
                const intersects = raycaster.intersectObjects(internalModel[4].children, true);
                const intersectCount = intersects.length;

                for (let i = 0; i < intersectCount; i++) {
                    const intersect = intersects[i];

                    if (intersect.object.parent === internalModel[4]) {
                        if (this.prevIndoorFacility && this.prevIndoorFacility !== intersect) {

                            if (this.selectedFacility === null || this.prevIndoorFacility.object !== this.selectedFacility) {
                                this.prevIndoorFacility.object.visible = false;
                            }
                        }

                        intersect.object.visible = true;

                        this.prevIndoorFacility = intersect;
                        this.optionManager.onPostMouseMove(event);
                        return;
                    }
                }
            }
        }
        else {
            // 실외공간
            const intersects = raycaster.intersectObjects(this.scene.children, true);
            const intersectCount = intersects.length;

            if (intersectCount > 0) {
                const nearestIntersect = this.sortIntersects(intersects, intersectCount);
                //const nearestIntersect = this.getNearest(intersects, intersectCount);

                if (nearestIntersect) {
                    const zoomValue = this.getZoomValue();
                    let model = null;

                    if (zoomValue >= TextPOIManager.BuildingGroupTextDistance) {
                        model = this.isBuildingGroup(nearestIntersect.object);

                        if (!model) {
                            const secondNearest = intersectCount > 1 ? intersects[1] : null;

                            if (secondNearest) {
                                model = this.isBuildingGroup(secondNearest.object);
                            }
                        }
                    }
                    else {
                        for (let i = 0; i < intersectCount; i++) {
                            const intersect = intersects[i];

                            /*if (this.isBuildingGroup(intersect.object)) {
                                continue;
                            }*/

                            model = this.isBuilding(intersect.object);

                            if (model) {
                                break;
                            }
                        }
                    }

                    if (model !== null) {
                        model.visible = true;
                        this.boundingBoxModel = model;

                        // BoundingBox Edge 표시
                        //const boundingBox = this.getBoundingBox(model);
                        /*const boundingBox = new THREE.BoxHelper(model, 0xffff00);
                        this.scene.add(boundingBox);
                        this.boundingBoxEdge = boundingBox;*/
                    }
                    else {
                        // 실외모델의 설비
                        for (let i = 0; i < intersectCount; i++) {
                            const intersect = intersects[i];

                            if (intersect.object.name.startsWith(Contents3D.FacilityHeadTag)) {
                                if (this.prevIndoorFacility && this.prevIndoorFacility !== intersect) {

                                    if (this.selectedFacility === null || this.prevIndoorFacility.object !== this.selectedFacility) {
                                        this.prevIndoorFacility.object.visible = false;
                                    }
                                }

                                intersect.object.visible = true;

                                this.prevIndoorFacility = intersect;
                                this.optionManager.onPostMouseMove(event);
                                return;
                            }
                        }
                    }
                }
            }
        }

        if (this.prevIndoorFacility) {
            if (this.selectedFacility === null || this.prevIndoorFacility.object !== this.selectedFacility) {
                this.prevIndoorFacility.object.visible = false;
            }
            this.prevIndoorFacility = null;
        }

        this.optionManager.onPostMouseMove(event);
    }

    movePOI(event) {
        if (this.pickPOI && (this.props.editMode === Contents3D.Edit_Mode_MovePOI ||
            (this.props.editMode === Contents3D.Edit_Mode_Text && this.props.editModeParam === TextPOIManager.Mode_MoveText))) {
            const [x, z] = this.screenToGlobal(event);
            this.pickPOI.object.position.set(x, this.pickPOI.object.position.y, z);
            /*const x = event.nativeEvent.offsetX;
            const y = event.nativeEvent.offsetY;
            const mouse = new THREE.Vector2((x / window.innerWidth) * 2 - 1, -(y / window.innerHeight) * 2 + 1);

            const raycaster = new THREE.Raycaster();
            raycaster.setFromCamera(mouse, this.camera);
            this.pickPOI.object.position.set(raycaster.ray.origin.x, this.pickPOI.object.position.y, raycaster.ray.origin.z);*/
        }
        else if (this.props.editMode === Contents3D.Edit_Mode_MovePOI && this.props.selectedNewCCTV) {
            const [x, z] = this.screenToGlobal(event);
            const y = (this.camera.position.y + this.controls.target.y) / 2;
            this.poiManager.showTempCCTVPOI(this.isIndoor(), true, x, y, z);
            return;
        }

        this.poiManager.showTempCCTVPOI(this.isIndoor(), false);
    }

    screenToGlobal(event) {
        const x = event.nativeEvent.offsetX;
        const y = event.nativeEvent.offsetY;
        const mouse = new THREE.Vector2((x / window.innerWidth) * 2 - 1, -(y / window.innerHeight) * 2 + 1);

        const raycaster = new THREE.Raycaster();
        raycaster.setFromCamera(mouse, this.camera);
        return [raycaster.ray.origin.x, raycaster.ray.origin.z];
    }

    getRaycastingPosition(x, y) {
        const mouse = new THREE.Vector2((x / window.innerWidth) * 2 - 1, -(y / window.innerHeight) * 2 + 1);

        const raycaster = new THREE.Raycaster();
        raycaster.setFromCamera(mouse, this.camera);

        const intersects = raycaster.intersectObjects(this.scene.children, true);
        const intersectCount = intersects.length;

        if (intersectCount > 0) {
            return intersects[0].point;
        }

        return null;
    }

    removeBoundingBox() {
        if (this.boundingBoxModel) {
            this.boundingBoxModel.visible = false;
            this.boundingBoxModel = null;
        }

        /*if (this.boundingBoxEdge) {
            this.scene.remove(this.boundingBoxEdge);
            this.boundingBoxEdge = null;
        }*/
    }

    getChildModel(parent, childName) {
        const childCount = parent.children.length;

        for (let i = 0; i < childCount; i++) {
            const child = parent.children[i];

            if (child.name === childName) {
                return child;
            }
        }

        return null;
    }

    // BoundingBox Check
    isBuildingGroup(obj) {
        if (obj.name.endsWith(SDMSDataManager.BoundingBoxTag) === false) {
            if (obj.parent === null) {
                return null;
            }

            return this.isBuildingGroup(obj.parent);
        }

        const len = obj.name.length;
        let objName = obj.name.substring(0, len - SDMSDataManager.BoundingBoxTag.length);

        const buildingGroup = this.props._3dOptions.buildings[objName];

        if (buildingGroup) {
            return obj;
        }

        if (obj.parent === null) {
            return null;
        }

        return this.isBuildingGroup(obj.parent);
        /*const buildingGroupCount = this.props._3dOptions.buildingGroups.length;

        for (let i = 0; i < buildingGroupCount; i++) {
            const buildingGroup = this.props._3dOptions.buildingGroups[i];

            if (obj.name === buildingGroup[2]) {
                return obj;
            }
        }

        if (obj.parent === null) {
            return null;
        }*/

        return this.isBuildingGroup(obj.parent);
    }

    // BoundingBox Check
    isBuilding(obj) {
        if (obj.name.endsWith(SDMSDataManager.BoundingBoxTag) === false) {
            if (obj.parent === null) {
                return null;
            }

            return this.isBuilding(obj.parent);
        }

        const len = obj.name.length;
        const objName = obj.name.substring(0, len - SDMSDataManager.BoundingBoxTag.length);

        const building = this.props._3dOptions.allBuildings[objName];

        if (building) {
            return obj;
        }

        if (obj.parent === null) {
            return null;
        }

        return this.isBuilding(obj.parent);
    }

    // objects를 가까운 순서대로 정렬한다.
    sortIntersects(objects, objectCount) {
        objects.sort((obj1, obj2) => {
            if (obj1.distance < obj2.distance) {
                return -1;
            }
            else if (obj1.distance > obj2.distance) {
                return 1;
            }

            return 0;
        });

        // sprite가 있으면 거리에 상관없이 sprite를 먼저 선택하도록 한다.
        /*for (let i = 0; i < objectCount; i++) {
            const obj = objects[i];

            if (this.isSprite(obj)) {
                return obj;
            }
        }*/
        for (let i = 0; i < objectCount; i++) {
            const obj = objects[i];

            if (POIManager.isSprite(obj) === false) {
                return obj;
            }
        }

        return objects[0];
    }

    /*isSprite(obj) {
        if (obj.object && obj.object.type === "Sprite") {
            return true;
        }

        return false;
    }*/

    getNearest(objects, objectCount) {
        let min = objects[0].distance;
        let obj = objects[0];

        for (let i = 1; i < objectCount; i++) {
            const distance = objects[i].distance;

            if (distance < min) {
                min = distance;
                obj = objects[i];
            }
        }

        return obj;
    }

    popupBtm = () => {
        const buttons = this.refQuickButton.current;

        if (buttons) {
            if (buttons.classList.contains('off')) {
                buttons.classList.add('on');
                buttons.classList.remove('off');
                $(buttons).slideUp();
            }
            else/* if (buttons.classList.contains('on'))*/ {
                buttons.classList.add('off');
                buttons.classList.remove('on');
                $(buttons).slideDown();
            }
        }
        /*let popup = document.getElementById("BTMPopup");
        popup.classList.toggle(styles.hide);*/
    }

    getAlarmElements() {
        if (!this.props.alarmSound || this.state.alarmSoundOff) {
            return (
                <></>
            );
        }
        
        if (this.state.alarm === Contents3D.ALARM_2) {
            let src = "/resource/sound/alarm_level2.mp3";

            return (
                <audio autoPlay={true} loop={true}
                    src={src}>
                </audio>
            );
        }
        else if (this.state.alarm === Contents3D.ALARM_3) {
            return (
                <audio autoPlay={true} loop={true}
                    src="/resource/sound/alarm_level3.mp3">
                </audio>
            );
        }
        else if (this.state.alarm === Contents3D.ALARM_4) {
            return (
                <audio autoPlay={true} loop={true}
                    src="/resource/sound/alarm_level4.mp3">
                </audio>
            );
        }

        return (
            <></>
        );
    }

    watchAlarmSoundTime() {
        let alarmTime = this.state.alarmTime;
        let alarmSoundOffTime = this.state.commonSettings?.AlarmSoundOffTime;
        let alarm = this.state.alarm;
        let alarmSoundOff = this.state.alarmSoundOff;

        if (!alarmTime || !alarmSoundOffTime || alarm === Contents3D.NO_ALARM || alarmSoundOff)
            return;

        alarmTime = new Date(alarmTime).getTime();
        alarmSoundOffTime = Number(alarmSoundOffTime);

        if (alarmTime === NaN || alarmSoundOffTime === NaN || alarmSoundOffTime <= 0)
            return;      

        alarmSoundOffTime = alarmSoundOffTime * 1000;

        const now = new Date().getTime();
        const diff = now - alarmTime;

        if (diff > alarmSoundOffTime) {
            //console.log("watchAlarmSound");
            this.setState({ alarmSoundOff: true });
        }
    }

    setVisiblePopups(menu) {
        this.props.setVisiblePopups(menu);
    }

    getQuickButtonClassName(name) {
        if (this.props.visiblePopups[name]) {
            return 'on';
        }

        return 'off';
    }

    initViewport = () => {
        // 자동 회전 중이라면 중지 
        this.lastMouseMoveTime = new Date();

        if (this.isIndoor()) {
            if (!this.props.currentView) {
                return;
            }

            const buildingID = this.props.currentView.buildingID;
            const zoneID = this.props.currentView.zoneID;

            if ((buildingID === 0 || buildingID) && (zoneID === 0 || zoneID)) {
                const zoneData = this.props._3dOptions.zones[zoneID];

                if (zoneData) {
                    const floorIndex = zoneData[0];
                    this.currentIndoorModel = null;
                    this.moveToFloor(buildingID, floorIndex);
                }
            }
        }
        else {
            this.props.initOutdoorViewport();
        }
    }

    // 현재 View를 기본 View로 만든다.
    setInitialViewport = () => {
        this.setInitialViewportWithIntersect([]);
        /*const width = window.innerWidth;
        const height = window.innerHeight;

        const x = width / 2;
        const y = height / 2;
        const mouse = new THREE.Vector2((x / window.innerWidth) * 2 - 1, -(y / window.innerHeight) * 2 + 1);

        const raycaster = new THREE.Raycaster();
        raycaster.setFromCamera(mouse, this.camera);

        const intersects = raycaster.intersectObjects(this.scene.children, true);
        this.setInitialViewportWithIntersect(intersects);*/
    }

    async setInitialViewportWithIntersect(intersects) {
        const intersectCount = intersects.length;
        let success = false;

        if (intersectCount > 0) {
            const nearestIntersect = this.sortIntersects(intersects, intersectCount);

            if (nearestIntersect) {
                if (this.isIndoor()) {
                    // DB에 직접 값을 저장한다.
                    success = await this.saveIndoorModelViewport({ ...this.camera }, nearestIntersect);
                }
                else {
                    // DB에 직접 값을 저장한다.
                    success = await this.saveOutdoorModelViewport({ ...this.camera }, nearestIntersect);
                }
            }
        }
        else {
            if (this.isIndoor()) {
                // DB에 직접 값을 저장한다.
                success = await this.saveIndoorModelViewport({ ...this.camera }, null);
            }
            else {
                // DB에 직접 값을 저장한다.
                success = await this.saveOutdoorModelViewport({ ...this.camera }, null);
            }
        }

        if (success) {
            alert("변경되었습니다.");
        }
    }

    zoom = (near) => {
        // 자동 회전 중이라면 중지 
        this.lastMouseMoveTime = new Date();

        if (this.camera === this.perspectiveCamera) {
            const vCurrent = { ...this.camera.position };
            const vTarget = { ...this.controls.target };

            const targetDistance = Geometry.getDistance3(vCurrent.x, vCurrent.y, vCurrent.z, vTarget.x, vTarget.y, vTarget.z);
            const movingDistance = near ? targetDistance * 0.05 : targetDistance * -0.05;
            const [x, y, z] = Geometry.getLinearVertex3(vCurrent.x, vCurrent.y, vCurrent.z, vTarget.x, vTarget.y, vTarget.z, movingDistance);

            this.camera.position.x = x;
            this.camera.position.y = y;
            this.camera.position.z = z;
        } else {
            // 편집모드 경우 - K.D.R
            if (near) {
                this.camera.zoom *= 1.1;
                this.camera.updateProjectionMatrix();
            }
            else {
                this.camera.zoom *= 0.9;
                this.camera.updateProjectionMatrix();
            }
        }
    }

    getCurrentBuildingFloors() {
        const currentView = this.props.currentView;

        if (currentView.buildingID === null || currentView.buildingID === undefined ||
            currentView.zoneID === null || currentView.zoneID === undefined) {
            return [null, null];
        }

        if (!this.props._3dOptions || !this.props._3dOptions.buildingIDs) {
            return [null, null];
        }

        const buildingData = this.props._3dOptions.buildingIDs[currentView.buildingID];

        if (!buildingData || buildingData.length < 8) {
            return [null, null];
        }

        const floorDatas = [];
        const floors = buildingData[7];

        for (const zoneID in floors) {
            const floorData = floors[zoneID];

            if (floorData.length > 0) {
                const floorIndex = floorData[0];

                const floorName = floorIndex < 0 ? '지하' + (-floorIndex) + "층" : (floorIndex + 1) + "층";

                if (zoneID !== currentView.zoneID.toString()) {
                    floorDatas.push([floorIndex, floorName]);
                }
                else {
                    floorDatas.push([floorIndex, floorName, true]);
                }
            }
        }

        floorDatas.sort((floor1, floor2) => {
            if (floor1[0] < floor2[0]) {
                return -1;
            }
            else if (floor1[0] > floor2[0]) {
                return 1;
            }

            return 0;
        });

        return [currentView.buildingID, floorDatas];
    }

    getSelectedPOI() {
        const [sensorType, zoneID, sensorID] = this.props.selectedSensor;

        if (sensorType &&
            zoneID !== null && zoneID !== undefined &&
            sensorID !== null && sensorID !== undefined) {

            const poi = this.poiManager.getSensorPOI(sensorType, zoneID, sensorID);

            if (poi) {
                const node = {
                    object: poi
                };

                return node;
            }
        }

        return null;
    }

    getSelectEquipZonePOI() {
        const selectEquipZonePOI = this.props.selectEquipZonePOI;
        const [sensorType, zoneID, equipZoneID] = SDMS.getSensorInfo(selectEquipZonePOI);     

        if (sensorType && 
            zoneID !== null && zoneID !== undefined &&
            equipZoneID !== null && equipZoneID !== undefined) {

            const poi = this.textPOIManager.getTextPOI(sensorType, zoneID, equipZoneID);

            if (poi) {
                const node = {
                    object: poi
                };

                return node;
            }
        }

        return null;
    }

    clearSelectEquipZonePOI() {
        this.props.onSelectEquipZonePOI(null);
    }

    useSensorList() {
        const userInfo = ProjectResource.getUserInfo();
        return (userInfo?.options?.ui?.useSensorList === true);
    }

    static useWorkerInfo() {
        const userInfo = ProjectResource.getUserInfo();
        return (userInfo?.options?.ui?.useWorkerInfo === true);
    }

    static useEquipZoneArea() {
        const userInfo = ProjectResource.getUserInfo();
        return (userInfo?.options?.ui?.useEquipZoneArea === true);
    }

    static useEquipZoneAssess() {
        const userInfo = ProjectResource.getUserInfo();
        return (userInfo?.options?.ui?.useEquipZoneAssess === true);
    }

    getVisibleArea() {
        let visibleArea = this.props.visibleSensorTypes[SDMSMainMenu.EquipZoneArea];

        const useEquipZoneArea = Contents3D.useEquipZoneArea();
        
        visibleArea = (visibleArea && useEquipZoneArea);

        return visibleArea;
    }

    getInput() {
        return (
            <>
                <main>
                    <ul>
                        <li>
                            <input type="radio" value="normal" id="Normal" checked={this.state.selectValue === "normal"} onChange={this.handlePopupRadioChange} />
                            <label htmlFor="Normal">일반</label>
                        </li>
                        <li>
                            <input type="radio" value="danger" id="Danger" checked={this.state.selectValue === "danger"} onChange={this.handlePopupRadioChange} />
                            <label htmlFor="Danger">위험구역</label>
                        </li>
                        <li>
                            <input type="radio" value="separation" id="Separation" checked={this.state.selectValue === "separation"} onChange={this.handlePopupRadioChange} />
                            <label htmlFor="Separation">분리구역</label>
                        </li>
                    </ul>
                    <div>
                        <label htmlFor='areaName'>구역명 :</label>
                        <input type='text' className='check' id='areaName' placeholder='소방펌프실' />
                    </div>
                </main>
                <footer>
                    <button>취소</button>
                    <button>확인</button>
                </footer>
            </>
        );
    }

    getVisibleAssess() {
        let visibleAssess = this.props.visibleSensorTypes[SDMSMainMenu.EquipZoneAssess];
        const useEquipZoneAssess = Contents3D.useEquipZoneAssess();
        
        visibleAssess = (visibleAssess && (this.props.isEditMode !== true) && useEquipZoneAssess);

        return visibleAssess;
    }

    render() {
        const userAuthor = ProjectResource.getUserAuthor();

        const className = this.state.loading ? 'contents3DArea' + " " + 'loading' : 'contents3DArea';
        const [currentBuildingID, currentFloorDatas] = this.getCurrentBuildingFloors();
        const siteID = ProjectResource.SiteNo;

        this.poiManager.setVisibleSensorTypes(this.props.visibleSensorTypes);
        this.poiManager.selectPOI(this.getSelectedPOI(), this.props.editMode, this.props.editModeParam);
        this.textPOIManager.setVisible(this.props.visibleSensorTypes[SDMSMainMenu.EquipZoneName], this.props.currentSiteID);
        this.textPOIManager.setWorkerVisibleType(this.props.visibleSensorTypes[SDMSMainMenu.Worker], this.props.visibleSensorTypes[SDMSMainMenu.Visitor], this.props.currentSiteID);
        this.textPOIManager.selectEquipZonePOI(this.getSelectEquipZonePOI(), this.props.editMode, this.props.editModeParam, this.props.currentSiteID);

        if (Contents3D.useEquipZoneAssess()) {
            this.textPOIManager.setVisibleAssessment(this.getVisibleAssess(), this.props._3dOptions?.siteID);  // 구역 등급 표시 설정
        }

        // 알람 영역 표시 여부 
        this.equipZoneAreaManager.showAlarmArea(this.props.selectedAlarm, (this.state.commonSettings?.UseAlarmArea === "true"), this.getVisibleAssess());  // 알람 영역 표시
        this.equipZoneAreaManager.setVisibleArea(this.getVisibleArea());

        const editInputID = this.state.editableInput ? 'areaInput' : 'areaInputHidden';


        // 옵션 퀵버튼
        let quickButtons = [];
        let siteQuickButtons = null;

        if (this.useSensorList()) {
            quickButtons.push(
                <li key={"liQuickKey_sensorStatus"}><span className={"shortcutKey" + " " + 'shortCut' + " " + 'hideKey'}>Ct+9</span><a id={"dsBot_" + SdmsResource.popupLayer.sensorStatus} className={this.getQuickButtonClassName(SDMS.menu.sensorStatus) + " " + 'sensorInfoIcon'} onClick={() => this.props.setVisiblePopups(SDMS.menu.sensorStatus)}><span><em>센서정보<br />현황</em></span></a></li>
            );
        }
        if (Contents3D.useWorkerInfo()) {
            quickButtons.push(
                <li key={"liQuickKey_workerPath"}><span className={"shortcutKey" + " " + 'shortCut' + " " + 'hideKey'}>Ct+0</span><a id={"dsBot_" + SdmsResource.popupLayer.workerPath} className={this.getQuickButtonClassName(SDMS.menu.workerPath) + " " + 'workerInfoIcon'} onClick={() => this.props.setVisiblePopups(SDMS.menu.workerPath)}><span><em>인원<br />현황</em></span></a></li>
            );
        }

        if (ProjectResource.SiteNo === ProjectResource.Site.GG_A) {
            siteQuickButtons = (
                <ul ref={this.refQuickButton}>
                    <li key={"liQuickKey_statusInfo"}><span className={"shortcutKey" + " " + 'shortCut' + " " + 'hideKey'}>Ct+1</span><a id={"dsBot_" + SdmsResource.popupLayer.statusInfo} className={this.getQuickButtonClassName(SDMS.menu.statusInfo) + " " + 'statusInfoIcon'} onClick={() => this.setVisiblePopups(SDMS.menu.statusInfo)}><span><em>현황<br />정보</em></span></a></li>
                    <li key={"liQuickKey_dashboard"}><span className={"shortcutKey" + " " + 'shortCut' + " " + 'hideKey'}>Ct+3</span><a id={"dsBot_" + SdmsResource.popupLayer.dashboard} className={this.getQuickButtonClassName(SDMS.menu.dashboard) + " " + 'dashboardIcon'} onClick={() => this.setVisiblePopups(SDMS.menu.dashboard)}><span><em>대시보드<br />요약창</em></span></a></li>
                    <li key={"liQuickKey_waterLevelInfo"}><span className={"shortcutKey" + " " + 'shortCut' + " " + 'hideKey'}>Ct+4</span><a id={"dsBot_" + SdmsResource.popupLayer.waterLevelInfo} className={this.getQuickButtonClassName(SDMS.menu.waterLevelInfo) + " " + 'waterLevelIcon'} onClick={() => this.setVisiblePopups(SDMS.menu.waterLevelInfo)}><span><em>집수정</em></span></a></li>
                    <li key={"liQuickKey_electricInInfo"}><span className={"shortcutKey" + " " + 'shortCut' + " " + 'hideKey'}>Ct+5</span><a id={"dsBot_" + SdmsResource.popupLayer.electricInInfo} className={this.getQuickButtonClassName(SDMS.menu.electricInInfo) + " " + 'electricIcon'} onClick={() => this.setVisiblePopups(SDMS.menu.electricInInfo)}><span><em>전력</em></span></a></li>
                    <li key={"liQuickKey_elevatorInfo"}><span className={"shortcutKey" + " " + 'shortCut' + " " + 'hideKey'}>Ct+6</span><a id={"dsBot_" + SdmsResource.popupLayer.elevatorInfo} className={this.getQuickButtonClassName(SDMS.menu.elevatorInfo) + " " + 'elevatorIcon'} onClick={() => this.setVisiblePopups(SDMS.menu.elevatorInfo)}><span><em>E/V</em></span></a></li>
                    <li key={"liQuickKey_allCCTV"}><span className={"shortcutKey" + " " + 'shortCut' + " " + 'hideKey'}>Ct+7</span><a id={"dsBot_" + SdmsResource.popupLayer.cctvInfo} className={this.getQuickButtonClassName(SDMS.menu.allCCTV) + " " + 'cctvInfoIcon'} onClick={() => this.setVisiblePopups(SDMS.menu.allCCTV)}><span><em>CC<br />TV</em></span></a></li>
                    <li key={"liQuickKey_eventInfo"}><span className={"shortcutKey" + " " + 'shortCut' + " " + 'hideKey'}>Ct+8</span><a id={"dsBot_" + SdmsResource.popupLayer.event} className={this.getQuickButtonClassName(SDMS.menu.eventInfo) + " " + 'eventIcon'} onClick={() => this.setVisiblePopups(SDMS.menu.eventInfo)}><span><em>이벤트<br />정보</em></span></a></li>
                    <li key={"liQuickKey_manualReport"}><span className={"shortcutKey" + " " + 'shortCut' + " " + 'hideKey'}>Ct+9</span><a id={"dsBot_" + SdmsResource.popupLayer.manualReport} className={this.getQuickButtonClassName(SDMS.menu.manualReport) + " " + 'manualReportIcon'} onClick={() => this.props.checkAuthPopups(SDMS.menu.manualReport)}><span><em>수동<br />신고</em></span></a></li>
                    <li key={"liQuickKey_miniMap"}><span className={"shortcutKey" + " " + 'shortCut' + " " + 'hideKey'}>Ct+0</span><a id={"dsBot_" + SdmsResource.popupLayer.miniMap} className={this.getQuickButtonClassName(SDMS.menu.miniMap) + " " + 'miniMapIcon'} onClick={() => this.setVisiblePopups(SDMS.menu.miniMap)}><span><em>미니맵</em></span></a></li>
                    <li key={"liQuickKey_editMode"}><span className={"shortcutKey" + " " + 'shortCut' + " " + 'hideKey'}>Ct+e</span><a id={"dsBot_" + SdmsResource.popupLayer.editModeStatusInfo} className={this.getQuickButtonClassName(SDMS.menu.editMode) + " " + 'editModeIcon'} onClick={() => this.props.setEditMode(true)}><span><em>편집<br />모드</em></span></a></li>
                </ul>
            );
        }
        else {
            siteQuickButtons = (
                <ul ref={this.refQuickButton}>
                    <li key={"liQuickKey_statusInfo"}><span className={"shortcutKey" + " " + 'shortCut' + " " + 'hideKey'}>Ct+1</span><a id={"dsBot_" + SdmsResource.popupLayer.statusInfo} className={this.getQuickButtonClassName(SDMS.menu.statusInfo) + " " + 'statusInfoIcon'} onClick={() => this.setVisiblePopups(SDMS.menu.statusInfo)}><span><em>현황<br />정보</em></span></a></li>
                    <li key={"liQuickKey_allCCTV"}><span className={"shortcutKey" + " " + 'shortCut' + " " + 'hideKey'}>Ct+2</span><a id={"dsBot_" + SdmsResource.popupLayer.cctvInfo} className={this.getQuickButtonClassName(SDMS.menu.allCCTV) + " " + 'cctvInfoIcon'} onClick={() => this.setVisiblePopups(SDMS.menu.allCCTV)}><span><em>CC<br />TV</em></span></a></li>
                    <li key={"liQuickKey_dashboard"}><span className={"shortcutKey" + " " + 'shortCut' + " " + 'hideKey'}>Ct+3</span><a id={"dsBot_" + SdmsResource.popupLayer.dashboard} className={this.getQuickButtonClassName(SDMS.menu.dashboard) + " " + 'dashboardIcon'} onClick={() => this.setVisiblePopups(SDMS.menu.dashboard)}><span><em>대시<br />보드</em></span></a></li>
                    <li key={"liQuickKey_eventInfo"}><span className={"shortcutKey" + " " + 'shortCut' + " " + 'hideKey'}>Ct+4</span><a id={"dsBot_" + SdmsResource.popupLayer.event} className={this.getQuickButtonClassName(SDMS.menu.eventInfo) + " " + 'eventIcon'} onClick={() => this.setVisiblePopups(SDMS.menu.eventInfo)}><span><em>이벤트<br />정보</em></span></a></li>
                    <li key={"liQuickKey_miniMap"}><span className={"shortcutKey" + " " + 'shortCut' + " " + 'hideKey'}>Ct+5</span><a id={"dsBot_" + SdmsResource.popupLayer.miniMap} className={this.getQuickButtonClassName(SDMS.menu.miniMap) + " " + 'miniMapIcon'} onClick={() => this.setVisiblePopups(SDMS.menu.miniMap)}><span><em>미니맵</em></span></a></li>
                    <li key={"liQuickKey_manualReport"}><span className={"shortcutKey" + " " + 'shortCut' + " " + 'hideKey'}>Ct+6</span><a id={"dsBot_" + SdmsResource.popupLayer.manualReport} className={this.getQuickButtonClassName(SDMS.menu.manualReport) + " " + 'manualReportIcon'} onClick={() => this.props.checkAuthPopups(SDMS.menu.manualReport)}><span><em>수동<br />신고</em></span></a></li>
                    <li key={"liQuickKey_editMode"}><span className={"shortcutKey" + " " + 'shortCut' + " " + 'hideKey'}>Ct+8</span><a id={"dsBot_" + SdmsResource.popupLayer.editModeStatusInfo} className={this.getQuickButtonClassName(SDMS.menu.editMode) + " " + 'editModeIcon'} onClick={() => this.props.setEditMode(true)}><span><em>편집<br />모드</em></span></a></li>

                    {quickButtons}

                </ul>
            );
        }

        return (
            <>
                <Contents3DComponent className={'appWrap posi_relative'} $siteID={ProjectResource.SiteNo}>
                    {
                        (this.state.progressActive) ?
                            <ProgressBar active={this.state.progressActive} progress={this.state.progressValue} />
                            : null
                    }
                    <Toolbar
                        useIdleTime={this.state.useIdleTime}
                        setUseIdleTime={this.setUseIdleTime}
                        startAutoRotation={this.startAutoRotation}
                        initViewport={this.initViewport}
                        setInitialViewport={this.setInitialViewport}
                        zoom={this.zoom}
                        buildingID={currentBuildingID}
                        floorDatas={currentFloorDatas}
                        moveToFloor={this.moveToFloorAndAlarm}  // 층 이동시 알람표시 - K.D.R
                        goBackPrevOutdoor={this.goBackPrevOutdoor}
                        isIndoor={this.isIndoor()}
                    />
                    <section className={'appContainerWrap clfix'}>
                        <div ref={this.ref3D} className={className} onClick={this.onClick} onMouseMove={this.onMouseMove}>
                        </div>
                        <>
                            <div id={'dsSoulBot'}></div>
                            {siteQuickButtons}
                        </>
                    </section>
                    <figure>
                        {
                            this.getAlarmElements()
                        }
                    </figure>
                    <input ref={this.refEditableInput} type="text" id={editInputID} onKeyDown={(e) => this.onKeyDownEditableInput(e)} />
                </Contents3DComponent>
            </>
        );
    }
}

export default Contents3D;