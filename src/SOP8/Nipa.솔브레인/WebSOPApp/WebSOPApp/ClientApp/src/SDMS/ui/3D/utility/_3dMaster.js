import * as THREE from "three/build/three.module.js";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import Geometry from "../../../../Common/util/Geometry";
import { SDMSDataManager } from "../../../services/sdmsDataManager";
import { PoiManager } from "../poi/poiManager";
import { AlarmManager } from "./alarmManager";
import { AnimationModel } from "./animationModel";
import { BlinkManager } from "./blinkManager";
import { GlbLoader } from "./glbLoader";
import { CameraManager } from "./cameraManager";
import { EditModeManager } from "./editModeManager";
import { TextPoiManager } from "../poi/textPoiManager";
import { HtmlTextPoiManager } from "../poi/htmlTextPoiManager";
import { FacilityManager } from "./facilityManager";
import SdmsResource from '../../../resource/id';
import Vertex2D from "../../../../Common/util/Vertex2D";
import Contents3D from "../contents3D";
import { RadomirManager } from "../effect/radomirManager";
import { MovingScannerPoiManager } from "../poi/movingScannerPoiManager";
import ProjectResource from "../../../../Root/resource/id";

export class _3dMaster {
    static Mode_Outdoor_All = 0;
    static Mode_Outdoor_Part = 1;
    static Mode_Indoor = 2;

    static FacilityHeadTag = "equipment-";
    static BoundingBoxTag = "-0";

    static ExitArrowGroupTag = "arrow_Group";
    static ExitArrowBeginTag = "arrow_Y";
    static ExitArrowEndTag = "arrow_R";

    static MaxCameraDistance = 5000;
    //static MaxCameraDistance = 1800;

    static MouseLButton = 0;
    static MouseRButton = 2;

    constructor(timelog, ref3D, refBuildingGroupLabels, refBuildingLabels, refEquipZoneLabels, refFacilityTooltip, refFcltyLabels, refMovingScanners, setState, getState, contents3D) {
        this.renderer = null;
        this.scene = null;
        this.camera = null;
        this.dirLight = null;
        this.controls = null;
        this.clock = new THREE.Clock();

        this.boundingBoxModel = null;
        this.prevIndoorFacility = null;
        this.selectedFacility = null;

        this.blinkManager = new BlinkManager();
        this.cameraManager = new CameraManager();
        this.editModeManager = contents3D?.props?.editModeManager ?? null;

        if (this.editModeManager) {
            this.editModeManager.set3dMaster(this);
        }

        this.timelog = timelog;
        this.setState = setState;
        this.getState = getState;
        this.contents3D = contents3D;

        // 실내모델링이 로딩되지 않을 경우, 카메라 첫 외곽 이동 여부 체크 >> 타이밍 체크
        this.FirstIndoorNotOnMemoryCameraMove = false;
        this.useBoundingBox = true;

        // 실내모델 파일 로딩이 끝나지 않아서 보여주지 못했던 층정보
        this.lazyIndoorData = {};

        this.directionalLightPower = 3;

        this.currentModel = null;
        this.ref3D = ref3D;
        this.refBuildingGroupLabels = refBuildingGroupLabels;
        this.refBuildingLabels = refBuildingLabels;
        this.refEquipZoneLabels = refEquipZoneLabels;
        this.refFacilityTooltip = refFacilityTooltip;
        this.refFcltyLabels = refFcltyLabels;
        this.refMovingScanners =refMovingScanners;

        this.lastMouseMoveTime = new Date();
        // 즉시회전 명령을 받은 시간
        this.lastAutoRotationCommandTime = new Date();
        // 회전각, 회전반경
        this.cameraRotation = null;
        // 1초에 이만큼 회전하라(radian)
        this.cameraRotationPerSecond = 0.0276854928;
        // 버튼 클릭에 의한 강제회전
        this.rotateImmediately = false;

        this.isSimulationMode = false;

        this.frameCount = 0;
        this.frameTime = 0;

        this.normalTerrain = null;
        this.cfdTerrain = null;

        this.prevCameraRotation = 0;

        this.fixedBoundingBox = null;
        this.fixedBoundingBoxHover = false;
    }

    get props() {
        return this.contents3D.props;
    }

    initialize(buildingGroupList/*currentSiteNo, onCompleteOutdoorModelLoading*/) {
        this._init(buildingGroupList);
        _3dMaster.animate(this);

        const modelFiles = _3dMaster.getOutdoorModelFiles(buildingGroupList, this.props.currentModel.currentSiteNo);
        this.glbLoader.loadOutdoorModelFiles(modelFiles, buildingGroupList, this.props.gltfOptions, true);
    }

    onPostUpdate(prevProps) {
        if (this.props.isEditMode) {
            if (prevProps.temporarySensor.sensor !== this.props.temporarySensor.sensor && this.props.temporarySensor.sensor) {
                this.editModeManager.setTemporarySensor(this.poiManager, this.props.visibleSensorTypes, this.props.temporarySensor.sensor, this.props.temporarySensor.zoneNo, this.props.temporarySensor.cctv);
            }
            else if (this.editModeManager?.isCctvMappingMode()) {
                this.poiManager.selectSlavePois(this.props.editCCTVList?.cctvList);
            }
            /*else if (this.isChangedEditCCTVList(prevProps.editCCTVList, this.props.editCCTVList)) {
                this.poiManager.selectSlavePois(this.props.editCCTVList?.cctvList);
            }*/
        }
    }

    /*isChangedEditCCTVList(oldList, newList) {
        if (oldList === null && newList === null) {
            return false;
        }
        else if ((!oldList && newList) || (oldList && !newList)) {
            return true;
        }

        const oldLength = oldList.cctvList?.length;
        const newLength = newList.cctvList?.length;

        if (oldLength !== newLength) {
            return true;
        }

        for (let i = 0; i < newLength; i++) {
            const oldCCTV = oldList.cctvList[i];
            const newCCTV = newList.cctvList[i];

            if (oldCCTV.sensor_sn !== newCCTV.sensor_sn) {
                return true;
            }
        }

        return false;
    }*/

    getCurrentBuildingGroupList() {
        const currentBuildingGroupList = this.props.siteBuildingGroupList[this.props.currentModel.currentSiteNo];
        return currentBuildingGroupList;
    }

    _init(buildingGroupList) {
        this.internalModels = {};
        //this.initPoiMaterials();

        const outdoorModel = buildingGroupList.model;

        this.orthoGraphicCamera = new THREE.OrthographicCamera(window.innerWidth / - 2, window.innerWidth / 2, window.innerHeight / 2, window.innerHeight / - 2, 0.1, 5000);
        this.perspectiveCamera = new THREE.PerspectiveCamera(outdoorModel.camera.fov, window.innerWidth / window.innerHeight, outdoorModel.camera.near, outdoorModel.camera.far);
        this.camera = this.perspectiveCamera;

        this.scene = new THREE.Scene();

        this.facilityManager = new FacilityManager(this.timelog, this.scene, this.props, this.setState, this);

        this.alarmManager = new AlarmManager(this, this.props.spatialManager);
        this.glbLoader = new GlbLoader(this.timelog, this.scene, this.props, this.setState, this);
        this.glbLoader.setIndoorModelCount(this.props.siteBuildingGroupList);

        this.poiManager = new PoiManager(this.scene, this.props.spatialManager, this);
        this.cfdTextPoiManager = new HtmlTextPoiManager(this.refBuildingGroupLabels, this.refBuildingLabels, this.refEquipZoneLabels, this.refFacilityTooltip, this.refFcltyLabels, this.refMovingScanners, this.scene, this.props.spatialManager, this);
        this.movingScannerPoiManager = new MovingScannerPoiManager(this.cfdTextPoiManager);
        this.cfdTextPoiManager.initCfdLocation();
        this.textPoiManager = new TextPoiManager(this.scene, this.props.spatialManager, this);

        this.cfdTextPoiManager.initLabelRenderer(this.ref3D);

        const gltfOptions = this.props.gltfOptions;

        const currentSiteNo = parseInt(this.props.currentModel.currentSiteNo);
        this.glbLoader.loadSiteNo(currentSiteNo);

        //const bgTexture = new THREE.TextureLoader().load(gltfOptions.textureBaseUrl + '/' + gltfOptions.backgroundImage);
        this.scene.background = this.getGradationBackground("#ebebeb", "#819099");//bgTexture;

        const hemiLight = new THREE.HemisphereLight(0xffffff, 0x444444, 0.1);
        hemiLight.position.set(0, 20, 0);
        this.scene.add(hemiLight);

        this.dirLight = new THREE.DirectionalLight(0xffffff, this.directionalLightPower);
        this.dirLight.position.set(-3, 10, -10);

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

        this.renderer.outputColorSpace = THREE.SRGBColorSpace;
        //this.renderer.outputEncoding = THREE.sRGBEncoding;

        this.renderer.shadowMap.enabled = true;
        this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;
        this.ref3D.current.appendChild(this.renderer.domElement);

        this.controls = new OrbitControls(this.camera, this.ref3D.current/*this.renderer.domElement*/);
        this.controls.target.set(0, 0, 0);
        // 최대 회전각
        this.controls.maxPolarAngle = Math.PI / 3;
        // 최대 Zoom 허용치
        this.controls.maxDistance = _3dMaster.MaxCameraDistance;
        this.controls.update();

        this.correctControls();

        this.effectManager = new RadomirManager(this.scene, this.camera);
    }

    getGradationBackground(color1, color2) {
        const canvas = document.createElement('canvas');
        canvas.width = 16;
        canvas.height = 256;
        const context = canvas.getContext('2d');

        const gradient = context.createLinearGradient(0, 0, 0, 256);
        gradient.addColorStop(0, color1); // 위쪽 색
        gradient.addColorStop(1, color2); // 아래쪽 색

        context.fillStyle = gradient;
        context.fillRect(0, 0, 16, 256);

        const texture = new THREE.CanvasTexture(canvas);
        return texture;
    }

    // this.renderer 대신 this.ref3D를 OrbitControls에 사용하기 때문에
    // Panning과 Orbit Speed에 대한 보정이 필요하다.
    correctControls() {
        if (!this.controls) {
            return;
        }

        const baseH = this.renderer.domElement.clientHeight;
        const newH = this.ref3D.current.clientHeight;
        const k = newH / baseH; // 높이 비율

        // 최초 값을 저장해 두고 비율만 곱해 보정
        if (!this.controls._baseSpeeds) {
            this.controls._baseSpeeds = {
                rotate: this.controls.rotateSpeed ?? 1,
                pan: this.controls.panSpeed ?? 1,
            };
        }

        this.controls.rotateSpeed = this.controls._baseSpeeds.rotate * k;
        this.controls.panSpeed = this.controls._baseSpeeds.pan * k;
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
        
        //this.textPOIManager.clear();
    }

    static getOutdoorModelFiles(buildingGroupList, currentSiteNo) {
        const modelFiles = [];
        const fileMap = {};

        const siteNo = currentSiteNo ? parseInt(currentSiteNo) : currentSiteNo;

        if (buildingGroupList?.model?.file) {
            // 외부 Model은 SiteNo를 가진다.
            const _modelData = _3dMaster.makeModelData(buildingGroupList.model.file, siteNo, null, null, null);
            modelFiles.push(_modelData);
            fileMap[buildingGroupList.model.file] = _modelData;

            for (const buildingGroup of buildingGroupList.buildingGroups) {
                if (buildingGroup?.model?.file) {
                    if (!fileMap[buildingGroup.model.file]) {
                        // BuildingGroup Model은 SiteNo와 BuildingGroupNo를 가진다.
                        const modelData = _3dMaster.makeModelData(buildingGroup.model.file, siteNo, buildingGroup.buildingGroupNo, null, null);
                        fileMap[buildingGroup.model.file] = modelData;
                        modelFiles.push(modelData);
                    }
                }

                for (const building of buildingGroup.buildingDatas) {
                    if (building?.model?.file) {
                        if (!fileMap[building.model.file]) {
                            // Building Model은 SiteNo와 BuildingGroupNo, BuildingNo를 가진다.
                            const modelData = _3dMaster.makeModelData(buildingGroup.model.file, siteNo, buildingGroup.buildingGroupNo, building.buildingNo, null);
                            fileMap[building.model.file] = modelData;
                            modelFiles.push(modelData);
                        }
                    }
                }
            }
        }

        return modelFiles;
    }

    static makeModelData(fileName, siteNo, buildingGroupNo, buildingNo, zoneNo) {
        return {
            fileName,
            siteNo,
            buildingGroupNo,
            buildingNo,
            zoneNo
        };
    }

    checkCurrentModel(models) {
        // 컨트롤 모드에 따른 모델 및 카메라 이동 변경
        const controlMode = this.props.controlMode;

        if (this.isSimulationMode) {
            return;
        }

        const [model, modelNode, _postMethod, _params] = this.getCurrentModel(models, controlMode);
        const modelCamera = this.props.isEditMode ? model?.cameraOrtho : model?.camera;

        if (modelCamera && modelNode && this.currentModel && ((modelNode !== this.currentModel) || models.backToOrigin)) {
            const [postMethod, prevMethod, params] = this.getPostMethod(this.currentModel, modelNode, controlMode);

            prevMethod(params);

            if (_postMethod) {
                // _postMethod는 postMethod 실행 이후에 실행된다.
                this.cameraManager.ready([postMethod, _postMethod], [params, _params], this.camera, this.controls, modelCamera, 0.75);
            }
            else {
                const [checkAlarmMethod, checkAlarmMethodParams] = this.getCheckAlarmMethod(modelNode);

                if (checkAlarmMethod) {
                    this.cameraManager.ready([postMethod, checkAlarmMethod], [params, checkAlarmMethodParams], this.camera, this.controls, modelCamera, 0.75);
                }
                else {
                    this.cameraManager.ready([postMethod], [params], this.camera, this.controls, modelCamera, 0.75);
                }
            }

            models.backToOrigin = false;
            return true;
        }

        return false;
    }

    getPostMethod(currentModel, nextModel, controlMode) {
        // 설비 예지보전 모드 경우
        if (controlMode === SdmsResource.controlMode.equipment) {
            return [FacilityManager.postFcltyToIndoor, FacilityManager.prevFcltyToIndoor, [currentModel, nextModel, this]];
        }

        if (currentModel.userData.isIndoor) {
            if (nextModel.userData.isIndoor) {
                return [_3dMaster.postIndoorToIndoor, _3dMaster.prevIndoorToIndoor, [currentModel, nextModel, this]];
            }
            else {
                return [_3dMaster.postIndoorToOutdoor, _3dMaster.prevIndoorToOutdoor, [currentModel, nextModel.userData.siteNo, this]];
            }
        }
        else {
            if (nextModel.userData.isIndoor) {
                return [_3dMaster.postOutdoorToIndoor, _3dMaster.prevOutdoorToIndoor, [currentModel.userData.siteNo, nextModel, this]];
            }
            else {
                return [_3dMaster.postOutdoorToOutdoor, _3dMaster.prevOutdoorToOutdoor, [currentModel.userData.siteNo, nextModel.userData.siteNo, this]];
            }
        }
    }

    static prevIndoorToIndoor(params) {
        if (params && params.length >= 3) {
            const currentModel = params[0];
            const nextModel = params[1];
            const _this = params[2];

            _this.props.setShowCompass(false);

            const currentZoneNo = currentModel.userData.zoneNo;
            const nextZoneNo = nextModel.userData.zoneNo;

            if (currentZoneNo && nextZoneNo && currentZoneNo !== nextZoneNo) {
                _this.selectFacility(null);
                _this.props.spatialManager.updateZone(parseInt(nextModel.userData.siteNo), nextZoneNo);
                // 카메라 이동후에 새로 추가한다.
                _this.poiManager.removeSensors(null);
            }

            if (_this.cfdTextPoiManager) {
                _this.cfdTextPoiManager.clearText(null);
            }
            if (_this.textPoiManager) {
                _this.textPoiManager.clearText(null);
            }

            _this.editModeManager?.fakeWallManager?.clear();
        }
    }

    static prevIndoorToOutdoor(params) {
        if (params && params.length >= 3) {
            const currentModel = params[0];
            const nextSiteNo = params[1];
            const _this = params[2];

            const currentZoneNo = currentModel.userData.zoneNo;

            if (currentZoneNo && nextSiteNo) {
                _this.selectFacility(null);
                _this.props.spatialManager.updateZone(parseInt(nextSiteNo));
                // 카메라 이동후에 새로 추가한다.
                _this.poiManager.removeSensors(null);
            }

            if (_this.cfdTextPoiManager) {
                _this.cfdTextPoiManager.clearText(null);
            }
            if (_this.textPoiManager) {
                _this.textPoiManager.clearText(null);
            }

            _this.editModeManager?.fakeWallManager?.clear();
        }
    }

    static prevOutdoorToOutdoor(params) {
        if (params && params.length >= 3) {
            const currentSiteNo = params[0];
            const nextSiteNo = params[1];
            const _this = params[2];

            if (currentSiteNo === nextSiteNo) {
                return;
            }

            _this.selectFacility(null);
            // 카메라 이동후에 새로 추가한다.
            _this.poiManager.removeSensors(null);
        }
    }

    static prevOutdoorToIndoor(params) {
        if (params && params.length >= 3) {
            const siteNo = params[0];
            const nextModel = params[1];
            const _this = params[2];

            _this.props.setShowCompass(false);

            const nextZoneNo = nextModel.userData.zoneNo;

            if (siteNo && nextZoneNo) {
                _this.selectFacility(null);
                _this.props.spatialManager.updateZone(siteNo, nextZoneNo);
                // 카메라 이동후에 새로 추가한다.
                _this.poiManager.removeSensors(null);
            }

            if (_this.cfdTextPoiManager) {
                _this.cfdTextPoiManager.clearText(null);
            }
            if (_this.textPoiManager) {
                _this.textPoiManager.clearText(null);
            }
        }
    }

    static postIndoorToIndoor(params) {
        if (params && params.length >= 3) {
            const currentModel = params[0];
            const nextModel = params[1];
            const _this = params[2];

            currentModel.visible = false;
            nextModel.visible = true;
            _this.currentModel = nextModel;

            const currentZoneNo = currentModel.userData.zoneNo;
            const nextZoneNo = nextModel.userData.zoneNo;

            if (currentZoneNo && nextZoneNo && currentZoneNo !== nextZoneNo) {
                _this.props.spatialManager.postLoadingZoneSensors(_3dMaster.funcAddZoneSensors, [nextZoneNo, _this]);
                //_this.poiManager.addZoneSensors(nextZoneNo, _this.props.visibleSensorTypes);

                if (_this.cfdTextPoiManager && _this.textPoiManager) {
                    _this.cfdTextPoiManager.initZoomValue();
                    _this.textPoiManager.initZoomValue();
                    _this.props.spatialManager.postLoadingEquipZones(_3dMaster.funcAddEquipZoneText, [nextZoneNo, _this]);
                    //_this.textPoiManager.addEquipZoneText(_this.props.spatialManager.getZone(nextZoneNo));
                }

                _this.editModeManager.fakeWallManager.loadFakeWalls(nextZoneNo, _this.scene);
            }
        }
    }

    static postIndoorToOutdoor(params) {
        if (params && params.length >= 3) {
            const currentModel = params[0];
            const nextSiteNo = params[1];
            const _this = params[2];

            _this.props.setShowCompass(true);

            currentModel.visible = false;

            const nextSite = _this.props.spatialManager.getSite(nextSiteNo);
            _3dMaster.showSite(nextSite, true, _this);

            if (nextSite) {
                for (const zone of nextSite.outdoorZones) {
                    _this.props.spatialManager.postLoadingZoneSensors(_3dMaster.funcAddZoneSensors, [zone.zoneNo, _this]);
                    //_this.poiManager.addZoneSensors(zone.zoneNo, _this.props.visibleSensorTypes);
                }

                if (_this.cfdTextPoiManager) {
                    _this.props.spatialManager.postLoadingBuildingGroups(_3dMaster.funcAddOutdoorText, [nextSite, _this]);
                    //_this.textPoiManager.addBuildingGroupText(nextSite.buildingGroups);
                    //_this.textPoiManager.addBuildingText(nextSite.buildingGroups);
                }
            }

            if (_this.cfdTextPoiManager) {
                _this.cfdTextPoiManager.initZoomValue();
            }
            if (_this.textPoiManager) {
                _this.textPoiManager.initZoomValue();
            }
        }
    }

    static postOutdoorToOutdoor(params) {
        if (params && params.length >= 3) {
            const currentSiteNo = params[0];
            const nextSiteNo = params[1];
            const _this = params[2];

            _this.initCurrentModel();

            if (currentSiteNo === nextSiteNo) {
                return;
            }

            const currentSite = _this.props.spatialManager.getSite(currentSiteNo);
            _3dMaster.showSite(currentSite, false, _this);

            const nextSite = _this.props.spatialManager.getSite(nextSiteNo);
            _3dMaster.showSite(nextSite, true, _this);
        }
    }

    initCurrentModel() {
        this.props.currentModel.currentBuildingGroupNo = null;
        this.props.currentModel.currentBuildingNo = null;
    }

    static postOutdoorToIndoor(params) {
        if (params && params.length >= 3) {
            const siteNo = params[0];
            const nextModel = params[1];
            const _this = params[2];

            const site = _this.props.spatialManager.getSite(siteNo);
            _3dMaster.showSite(site, false, _this);

            nextModel.visible = true;
            _this.currentModel = nextModel;

            const nextZoneNo = nextModel.userData.zoneNo;

            if (nextZoneNo) {
                _this.props.spatialManager.postLoadingZoneSensors(_3dMaster.funcAddZoneSensors, [nextZoneNo, _this]);
                //_this.poiManager.addZoneSensors(nextZoneNo, _this.props.visibleSensorTypes);

                if (_this.cfdTextPoiManager && _this.textPoiManager) {
                    _this.cfdTextPoiManager.showIndoorText();
                    _this.textPoiManager.showIndoorText();
                    _this.props.spatialManager.postLoadingEquipZones(_3dMaster.funcAddEquipZoneText, [nextZoneNo, _this]);
                    //_this.textPoiManager.addEquipZoneText(_this.props.spatialManager.getZone(nextZoneNo));
                }
            }

            if (_this.cfdTextPoiManager) {
                _this.cfdTextPoiManager.initZoomValue();
            }
            if (_this.textPoiManager) {
                _this.textPoiManager.initZoomValue();
            }

            _this.editModeManager.fakeWallManager.loadFakeWalls(nextZoneNo, _this.scene);
        }
    }

    static funcAddOutdoorText(params) {
        const site = params[0];
        const _this = params[1];
        _this.textPoiManager.addBuildingGroupText(site.buildingGroups);
        _this.textPoiManager.addBuildingText(site.buildingGroups);
    }

    static funcAddEquipZoneText(params) {
        const zoneNo = params[0];
        const _this = params[1];
        _this.textPoiManager.addEquipZoneText(_this.props.spatialManager.getZone(zoneNo));
    }

    static funcAddZoneSensors(params) {
        const zoneNo = params[0];
        const _this = params[1];
        _this.poiManager.addZoneSensors(zoneNo, _this.props.visibleSensorTypes, _this.cfdTextPoiManager);
        _this.movingScannerPoiManager.setEditMode(_this.props.isEditMode, _this.poiManager);
    }

    static showSite(site, visible, _this) {
        if (site) {
            if (site.modelNode) {
                if (visible && _this.props.controlMode === SdmsResource.controlMode.simulation) {
                    _this.cfdTerrain.visible = visible;
                }
                else {
                    site.modelNode.visible = visible;
                }

                if (visible) {
                    if (_this.props.controlMode === SdmsResource.controlMode.simulation)
                        _this.currentModel = _this.cfdTerrain;
                    else
                        _this.currentModel = site.modelNode;
                }
            }

            if (site.outdoorModels) {
                for (const outdoorModel of site.outdoorModels) {
                    outdoorModel.visible = visible;
                }
            }
        }
    }

    getCurrentModel(models, controlMode) {
        // 설비 모드 경우 
        if (controlMode === SdmsResource.controlMode.equipment) {
            const faModel = this.props.faModel;
            const selFcltyInfo = this.props.selFcltyInfo;

            const fclty = FacilityManager.getModel(selFcltyInfo.fcltyNo, selFcltyInfo.zoneNo, faModel);
            if (fclty) {
                models.backToOrigin = false;

                return [fclty.model, fclty.modelNode, fclty.postMethod, fclty.params];
            }            
        }

        if (models.currentZoneNo !== null) {
            const zone = this.props.spatialManager.getZone(models.currentZoneNo);

            if (zone) {
                return [zone.model, zone.modelNode, models.postMethod, models.params];
            }
        }
        else if (models.currentBuildingNo !== null) {
            const building = this.props.spatialManager.getBuilding(models.currentBuildingNo);

            if (building) {
                return [building.model, building.modelNode, models.postMethod, models.params];
            }
        }
        else if (models.currentBuildingGroupNo !== null) {
            const buildingGroup = this.props.spatialManager.getBuildingGroup(models.currentBuildingGroupNo);

            if (buildingGroup) {
                return [buildingGroup.model, buildingGroup.modelNode, models.postMethod, models.params];
            }
        }
        else if (models.currentSiteNo !== null) {
            const site = this.props.spatialManager.getSite(models.currentSiteNo);

            if (site) {
                return [site.model, site.modelNode, models.postMethod, models.params];
            }
        }

        return [null, null, null, null];
    }

    static animate(_this) {
        requestAnimationFrame(() => {
            _3dMaster.animate(_this);
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

        let zoomValue = null;

        if (_this.cameraManager) {
            zoomValue = _this.cameraManager.getZoomValue(_this.camera, _this.controls, _this.props.isEditMode);
        }

        if (_this.cfdTextPoiManager && zoomValue !== null) {
            _this.cfdTextPoiManager.checkZoomValue(_this.isIndoor(), zoomValue, _this.props.isEditMode);
        }
        if (_this.textPoiManager && zoomValue !== null) {
            _this.textPoiManager.checkZoomValue(_this.isIndoor(), zoomValue, _this.props.isEditMode);
        }

        if (_this.renderer && _this.scene && _this.camera) {
            _this.cfdTextPoiManager.makeBillboard(_this.camera);

            _this.renderer.render(_this.scene, _this.camera);
            _this.cfdTextPoiManager.render(_this.scene, _this.camera);
        }

        _this.blinkManager.blink(delta);
        _this.alarmManager.runMoving(delta);
        _this.cameraManager.run(delta);
        _this.effectManager.update(delta);

        if (_this.poiManager?.alarmEffectManager) {
            _this.poiManager.alarmEffectManager.update(delta);
        }

        if (_this.alarmManager) {
            _this.alarmManager.animateAlarm(delta);
        }

        AnimationModel.animateModels(delta, _this.currentAnimationModels);
        _this.poiManager.changePoiScales(delta);
        /*_this.poiManager.showSmoothVisible(delta);
        _this.textPOIManager.showSmoothVisible(delta);

        _this.watchAlarmSoundTime();*/

        // 설비모드 애니메이션
        if (_this.props.controlMode === SdmsResource.controlMode.equipment && _this.facilityManager.currentAnimationModels?.length > 0) {
            const deltaData = delta / 4;

            AnimationModel.animateModels(deltaData, _this.facilityManager.currentAnimationModels);
        }

        _this.checkCameraAngle();
        //_this.showFps(delta);
    }

    checkCameraAngle() {
        if (this.cameraManager.movingData || !this.props.showCompass) {
            // 모델 이동을 위하여 카메라가 움직일때에는 성능을 위하여 나침반을 고정시킨다.
            return;
        }

        // 카메라의 위치와 바라보는 방향을 이용해 Y축 기준 각도를 계산
        const dir = new THREE.Vector3();
        // 카메라가 바라보는 방향 벡터
        this.camera.getWorldDirection(dir);

        // atan2를 사용해서 수평면에서의 각도(라디안)를 구함
        const rad = Math.atan2(dir.x, dir.z);

        if (isNaN(rad)) {
            return;
        }

        const cameraAngle = rad * 180 / Math.PI;

        if (this.prevCameraRotation !== cameraAngle) {
            let compassAngle = cameraAngle - 221.213;

            if (compassAngle < 0) {
                compassAngle += 360;
            }
            else if (compassAngle >= 360) {
                compassAngle -= 360;
            }

            this.props.setCompassAngle(compassAngle);
            this.prevCameraRotation = cameraAngle;
        }
    }

    showFps(delta) {
        const frameTime = this.frameTime + delta;;
        const frameCount = this.frameCount + 1;

        if (frameTime >= 1) {
            const fps = frameCount * 1.0 / frameTime;
            //console.log("fps : " + Math.round(fps));
            //this.setState({ fpsData: Math.round(fps) });

            this.frameTime = 0;
            this.frameCount = 0;
        }
        else {
            this.frameTime = frameTime;
            this.frameCount = frameCount;
        }
    }

    setTerrainModel(cfdTerrainModel) {
        this.cfdTerrain = cfdTerrainModel;

        if (cfdTerrainModel?.parent) {
            for (const child of cfdTerrainModel.parent.children) {
                if (child !== cfdTerrainModel) {
                    this.normalTerrain = child;
                    this.cfdTerrain.userData = this.normalTerrain.userData;
                    break;
                }
            }
        }
    }

    moveCamera(delta) {

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

    needCameraRotation() {
        if (this.props.isEditMode) {
            return false;
        }

        if (this.cameraManager?.isMoving()) {
            this.cameraRotation = null;
            return false;
        }

        if (this.rotateImmediately === false && this.props.useCameraIdleTime === false)
            return false;

        // 알람시 카메라 회전 사용여부 확인
        //if (this.checkAlarmTurn() === false)
        //    return false;

        if (this.camera === this.perspectiveCamera) {
            const current = new Date();
            const timeSpan = current - this.lastMouseMoveTime;

            let idleTime = this.props.cameraIdleTime * 1000;  // 밀리세컨드로 변환
            //let idleTime = this.getState().idleTime * 60000;     // 분 단위 변환

            if (timeSpan >= idleTime) {
                if (this.cameraRotation) {
                    return true;
                }

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
                //this.hideVisiblePopupsBeforeRotation();
                return true;
            }
        }

        if (this.cameraRotation) {
            //this.showVisiblePopupsAfterRotation();
        }

        this.cameraRotation = null;
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

            //this.setMovingCamera(this.lazyMovingCameraData.cameraOptions, this.lazyMovingCameraData.mode, null);

            this.lazyMovingCameraData = {};
        }
        else if (this.lazyMovingCameraData?.orthoCameraData) {
            // 편집모드 경우
            this.camera.position.set(this.lazyMovingCameraData.orthoCameraData.position[0], this.lazyMovingCameraData.orthoCameraData.position[1], this.lazyMovingCameraData.orthoCameraData.position[2]);
            this.camera.rotation.set(this.lazyMovingCameraData.orthoCameraData.rotation[0], this.lazyMovingCameraData.orthoCameraData.rotation[1], this.lazyMovingCameraData.orthoCameraData.rotation[2]);
            //this.camera.quaternion.set(this.lazyMovingCameraData.orthoCameraData.quaternion[0], this.lazyMovingCameraData.orthoCameraData.quaternion[1], this.lazyMovingCameraData.orthoCameraData.quaternion[2], this.lazyMovingCameraData.orthoCameraData.quaternion[3]);
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

    showLazyIndoorData() {
        if (this.lazyIndoorData.zoneID) {
            /*const _3dOptions = SpatialManager.get3dOptionsFromZoneID(this.lazyIndoorData.zoneID, this.props.site3dOptions);

            this.poiManager.addZoneSensors(this.lazyIndoorData.zoneID, POIManager.IndoorPoiScale, _3dOptions.outdoorZones, _3dOptions.zones, this.props.visibleSensorTypes);

            this.textPOIManager.hideEquipZoneSprites();
            this.textPOIManager.showEquipZoneSprites(this.lazyIndoorData.zoneID, _3dOptions?.siteID);
            this.fakeWallManager.showFakeWalls();

            // 영역 생성 관련
            this.equipZoneAreaManager.showEquipZoneAreas();*/

            this.lazyIndoorData = {};
        }
    }

    /*setMovingCamera(cameraOptions, mode, param, speedUpRatio) {
        const distancePos = Geometry.getDistance3(this.camera.position.x, this.camera.position.y, this.camera.position.z, cameraOptions.position[0], cameraOptions.position[1], cameraOptions.position[2]);
        //const distanceQua = cameraOptions.quaternion === null ? null : Geometry.getDistance4(this.camera.quaternion.x, this.camera.quaternion.y, this.camera.quaternion.z, this.camera.quaternion.w, cameraOptions.quaternion[0], cameraOptions.quaternion[1], cameraOptions.quaternion[2], cameraOptions.quaternion[3]);
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
            //distanceQuaternion: distanceQua,
            distanceRotation: distanceRot,
            beginCameraPos: new THREE.Vector3(this.camera.position.x, this.camera.position.y, this.camera.position.z),
            //beginCameraQuaternion: new THREE.Quaternion(this.camera.quaternion.x, this.camera.quaternion.y, this.camera.quaternion.z, this.camera.quaternion.w),
            beginCameraRotation: new THREE.Vector3(this.camera.rotation.x, this.camera.rotation.y, this.camera.rotation.z),
            targetCameraOptions: cameraOptions,
            fov: cameraOptions.fov,
            far: cameraOptions.far,
            near: cameraOptions.near,
            zoom: cameraOptions.zoom,
            mode: mode,
            param: param
        };

        // 실내로 이동할 때에는 이동이 끝난후에 outdoor를 감춘다.
        if (mode !== _3dMaster.Mode_Indoor) {
            this.showOutdoor(mode);
        }
    }*/

    showOutdoor(mode) {
        this.useBoundingBox = true;
        this.removeBoundingBox();

        const _3dOptions = this.props.site3dOptions[this.props.currentSiteID];

        let outdoorZoneID = null;

        if (mode !== _3dMaster.Mode_Indoor) {

            for (let zoneID in _3dOptions?.outdoorZones) {
                zoneID = Number(zoneID);

                if (zoneID !== NaN && zoneID !== 30000)
                    outdoorZoneID = zoneID;
            }

            //this.equipZoneAreaManager.setZoneID(outdoorZoneID);
            //this.textPOIManager.hideEquipZoneSprites();

            // 외곽 공간 표시
            if (_3dOptions) {
                //this.textPOIManager.updateOutdoorEquipZoneData(_3dOptions);
            }
        }

        if (this.prevIndoorFacility) {
            this.prevIndoorFacility.object.visible = false;
            this.prevIndoorFacility = null;
        }

        const outdoorModels = this.glbLoader.getSiteOutdoorModels(parseInt(this.props.currentModel.currentSiteNo));
        
        // 멀티사이트 경우 초기 로딩시 현재 사이트 외곽(outdoorModels)이 올라오지 않았을 경우가 있다.
        if (!_3dOptions/* || !outdoorModels*/) {
            return;
        }

        if (mode === _3dMaster.Mode_Indoor/* && outdoorModels*/) {
            // 멀티사이트 관련
            if (this.props.multiSite) {
                for (const siteNo in this.glbLoader.siteOutdoorModels) {
                    // 전 사이트 외부영역 끄기
                    const _outdoorModels = this.glbLoader.siteOutdoorModels[siteNo];
                    _outdoorModels.map(model => {
                        model.visible = false;
                    });

                    // 현재 사이트 외 외부텍스트 끄기
                    const tempSite = parseInt(siteNo);
                    if (tempSite !== NaN && this.props.currentModel.currentSiteNo !== tempSite) {
                        //this.textPOIManager.setVisible(false, tempSite);
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
            if (this.glbLoader.prevIndoorModel) {
                this.glbLoader.prevIndoorModel.visible = false;
                this.glbLoader.prevIndoorModel = null;
            }

            if (this.glbLoader.currentIndoorModel) {
                this.glbLoader.currentIndoorModel.visible = false;
                this.glbLoader.currentIndoorModel = null;
            }

            if (outdoorModels) {
                outdoorModels.map(model => {
                    model.visible = true;
                });

                if (outdoorModels.length > 0) {
                    this.currentModel = outdoorModels[0];
                }
            }

            this.blinkManager.clearBlink();
            this.cameraManager.stop();
            this.alarmManager.clearMoving();

            // 실내 센서들 제거
            /*this.poiManager.removeSensors(null);
            this.poiManager.addOutdoorSensors(_3dOptions.outdoorZones, _3dOptions.zones, this.props.visibleSensorTypes);

            // 가벽 제거
            this.fakeWallManager.clear();

            // 외부영역의 가벽 로딩하기
            this.fakeWallManager.setZoneID(null);
            this.fakeWallManager.showFakeWalls();

            // 영역 생성 관련
            this.equipZoneAreaManager.showEquipZoneAreas();*/

            // 외부에 있는 POI 이동을 했을땐 트리가 접히지 않는다
            if (!this.nonChangedStatusInfo) {
                // 외부영역에 POI를 선택하여 이동할때, showOutdoor를 다중호출로 인해서 POI 선택이 해제되어 주석처리 - K.D.R
                //this.props.onChangeBuildingGroup(null, SDMS.SelectedStatusInfoType.none);     

                this.nonChangedStatusInfo = false;
            }

            if (_3dOptions.indoorModelOnMemory === false) {
                // 실내 모델을 메모리에서 해제한다.
                //SpatialManager.clearIndoorModels(this);
            }
        }

        const animationModels = [];

        if (mode !== _3dMaster.Mode_Indoor) {
            this.props.setCurrentView(outdoorZoneID);

            if (outdoorModels) {
                const outdoorModelCount = outdoorModels.length;

                for (let i = 0; i < outdoorModelCount; i++) {
                    const animationModel = this.glbLoader.modelAnimations[outdoorModels[i].name];

                    if (animationModel) {
                        animationModels.push(animationModel);
                    }
                }
            }
        }
        else {
            if (this.glbLoader.currentIndoorModel) {
                const animationModel = this.glbLoader.modelAnimations[this.glbLoader.currentIndoorModel.name];

                if (animationModel) {
                    animationModels.push(animationModel);
                }
            }
        }

        this.glbLoader.currentAnimationModels = animationModels;
    }

    removeBoundingBox() {
        if (this.boundingBoxModel) {
            this.boundingBoxModel.visible = false;
            this.boundingBoxModel = null;
        }
    }

    isIndoor() {
        if (this.currentModel?.userData?.isIndoor) {
            return true;
        }

        return false;
    }

    async onCompleteOutdoorModelLoading(siteNo) {
        this.props.onCompleteOutdoorModelLoading(siteNo);

        const site = this.props.spatialManager.getSite(siteNo);
        
        if (site) {
            await this.props.spatialManager.updateZone(siteNo);

            for (const zone of site.outdoorZones) {
                this.poiManager.addZoneSensors(zone.zoneNo, this.props.visibleSensorTypes, this.cfdTextPoiManager);
                this.movingScannerPoiManager.setEditMode(this.props.isEditMode, this.poiManager);
            }

            this.textPoiManager.addBuildingGroupText(site.buildingGroups);
            this.textPoiManager.addBuildingText(site.buildingGroups);
        }
    }

    onDoubleClick(event) {
        if (this.props.isEditMode) {
            if (this.textPoiManager && this.props.editSubMenu === SdmsResource.ID.name_area) {
                this.editModeManager.setEditEquipZoneText(null, event);
            }
        }
    }

    onClick(event) {
        if (event.button !== _3dMaster.MouseRButton) {
            this.setState({ popupMenu: null });
        }

        // EquipZone 편집중인가?
        /*if (this.props.isEditMode && this.textPoiManager?.editingLabel) {
            const poi = this.textPoiManager.select(event.nativeEvent.offsetX, event.nativeEvent.offsetY);

            if (poi !== this.textPoiManager.editingLabel) {
                this.textPoiManager.finishEdit();
            }

            return;
        }*/

        this.lastMouseMoveTime = new Date();

        if (this.poiManager) {
            this.movingScannerPoiManager.selectLabel(null);
            let [poi, sensorType, sensorSubType] = this.poiManager.hitTest(event, this.camera);

            if (this.props.isEditMode) {
                this.editModeManager.onClick(poi, this.camera, this.props.editMenu, event, this.props.currentModel.currentZoneNo, this.props.spatialManager, this.scene);
            }
            else if (event.button === _3dMaster.MouseLButton) {
                if (!poi) {
                    poi = this.cfdTextPoiManager.select(event.nativeEvent.offsetX, event.nativeEvent.offsetY, this.movingScannerPoiManager);

                    if (poi) {
                        sensorType = poi.element.id;
                    }
                    else if (this.cfdTextPoiManager.onClickCfdText(event)) {
                        return;
                    }
                    else if (this.cfdTextPoiManager.onClickFacilityTooltip(event)) {
                        return;
                    }
                }

                if (poi) {
                    if (HtmlTextPoiManager.isTextPoi(sensorType)) {
                        this.textPoiManager.selectPoi(poi, true);
                        this.poiManager.selectPoi(null);
                    }
                    else {
                        this.textPoiManager.selectPoi(null);

                        if (!this.props.isEditMode) {
                            const worldPos = new THREE.Vector3();
                            poi.getWorldPosition(worldPos);

                            // Html Element가 아닐 경우에만...
                            if (!poi.element) {
                                this.effectManager.spawnCircle(this.isIndoor(), poi, worldPos, 0xffffff);
                            }
                        }

                        this.poiManager.selectPoi(poi);

                        const [_zoneNo, _sensorNo, _sensorType] = this.poiManager.parseSensorKey2(poi);
                        //const [_zoneNo, _sensorNo, _sensorType, _sensorSubType] = PoiManager.parseSensorKey(poi);

                        if (_sensorNo && _sensorType) {
                            this.props.onSelectPOI(_sensorType, _sensorNo);
                        }

                        if (_sensorType === SdmsResource.facilityType.CCTV) {
                            this.props.setSelectedCCTVInfo({
                                zoneNo: _zoneNo,
                                sensorNo: _sensorNo
                            });
                            if (!this.props.showPopups[SdmsResource.ID.menu.cctvInfo]) this.props.setVisiblePopups(SdmsResource.ID.menu.cctvInfo, true);
                        }
                    }
                    return;
                }
                else {
                    this.textPoiManager.selectPoi(null);
                    this.poiManager.selectPoi(null);
                    this.props.onSelectPOI(null, null);

                    if (this.boundingBoxModel || this.fixedBoundingBoxHover) {
                        const boundingBoxModel = this.boundingBoxModel ? this.boundingBoxModel : this.fixedBoundingBox;
                        const buildingGroup = this.getBuildingGroup(boundingBoxModel);

                        if (buildingGroup) {
                            this.props.onSelectBuildingGroup(buildingGroup);
                        }
                        else {
                            const building = this.getBuilding(boundingBoxModel);

                            if (building) {
                                if (this.props.controlMode === SdmsResource.controlMode.simulation) {
                                    this.contents3D.handleSelectBuilding(building.name);
                                }
                                else {
                                    this.props.onSelectBuilding(building);
                                }
                            }
                        }
                    }
                    else if (this.prevIndoorFacility) {
                        if (this.props.controlMode === SdmsResource.controlMode.equipment) {
                            // 설비 모드 경우
                            this.props.onSelectFclty(this.prevIndoorFacility.object.name);
                            this.selectFacility(this.prevIndoorFacility.object);
                        }
                        else {
                            this.props.onSelectFacility(this.prevIndoorFacility.object.name, this.props.currentModel.currentZoneNo);
                            this.selectFacility(this.prevIndoorFacility.object);
                        }
                    }
                    else {
                        if (this.props.controlMode === SdmsResource.controlMode.equipment) {
                            // 설비 모드 경우 리스트 해제
                            const selFcltyInfo = this.props.selFcltyInfo;
                            selFcltyInfo.presvNo = null;
                        }

                        this.selectFacility(null);                        
                    }
                }
            }
        }
    }

    // 배치 가능한 센서 목록 중에서 찾는다.
    findSensorInAddedSensors(sensorNo, sensorType) {
        const addPoiSensorList = this.props.addPOIsensorList;

        if (addPoiSensorList) {
            for (const sensorList of addPoiSensorList) {
                if (sensorList.sensorTypeCode === sensorType) {
                    for (const sensorData of sensorList.sensors) {
                        if (sensorData.sensor?.sensor_sn === sensorNo) {
                            return sensorData.sensor;
                        }
                    }

                    break;
                }
            }
        }

        return null;
    }

    showDeletePoiMenu(x, y) {
        if (x === null || y === null) {
            this.setState({ popupMenu: null });
        }
        else {
            if (this.poiManager) {
                let [poi, sensorType, sensorSubType] = this.poiManager._hitTest(x, y, this.camera);

                if (poi) {
                    this.targetPoi = poi;
                    this.setState({ popupMenu: [x, y] });
                }
            }
        }
    }

    deletePoi() {
        if (this.targetPoi/*this.poiManager.selectedPoi*/) {
            const poi = this.targetPoi;
            this.targetPoi = null;
            //const poi = this.poiManager.selectedPoi;
            //this.poiManager.selectPoi(null);

            const [zoneNo, sensorNo, sensorType, sensorSubType] = PoiManager.parseSensorKey(poi);
            //const [sensorNo, sensorType] = this.poiManager.deletePOI(this.poiManager.selectedPoi);

            if (sensorNo) {
                let sensor = this.props.spatialManager.getSensor(sensorNo);

                if (!sensor) {
                    if (poi.userData.sensor) {
                        sensor = poi.userData.sensor;
                    }
                }

                if (sensor) {
                    this.props.deleteSensor(sensor);
                    this.editModeManager.deletePoi(poi, sensor.sensor_sn);
                    poi.userData.sensor = sensor;
                    sensor.deleted = true;
                }
            }
        }
    }

    selectFacility(facility) {
        if (this.selectedFacility === facility) {
            return;
        }
         
        if (this.props.controlMode === SdmsResource.controlMode.equipment && this.selectedFacility?.userData?.isAlarmBounding === true) {
            // 설비 모드 경우 알람 경우는 바운딩 박스 해제 안함
        }
        else if (this.selectedFacility) {
            this.selectedFacility.visible = false;
        }

        this.selectedFacility = facility;

        if (!this.selectedFacility) {
            this.props.setVisiblePopups(SdmsResource.ID.menu.equipmentDetailInfo, false);
        }
    }

    static selectFacilityData(params) {
        if (params && params.length === 2) {
            const modelName = params[0];
            const _this = params[1];

            const facilityModel = FacilityManager.findFacility(_this.currentModel, modelName);

            if (facilityModel) {
                facilityModel.visible = true;
                _this.selectFacility(facilityModel);
            }
        }
    }

    getBuildingGroup(boundingBoxModel) {
        const len = boundingBoxModel.name.length;
        const name = boundingBoxModel.name.substring(0, len - _3dMaster.BoundingBoxTag.length);
        return this.props.spatialManager.getBuildingGroupFromName(name);
    }

    getBuilding(boundingBoxModel) {
        const len = boundingBoxModel.name.length;
        const name = boundingBoxModel.name.substring(0, len - _3dMaster.BoundingBoxTag.length);
        return this.props.spatialManager.getBuildingFromName(name);
    }

    onMouseMove(event) {
        if (this.props.isEditMode) {
            this.editModeManager.move(event.nativeEvent.offsetX, event.nativeEvent.offsetY, this.props.editMenu, this.props.editSubMenu);
        }
        else {
            const current = new Date();
            const timeSpan = current - this.lastAutoRotationCommandTime;

            if (timeSpan > Contents3D.AUTO_ROTATION_IDLE_TIME) {
                // 즉시회전 버튼을 누른뒤 AUTO_ROTATION_IDLE_TIME 동안은 자동회전이 멈추지 않도록 한다.
                this.lastMouseMoveTime = current;
                this.rotateImmediately = false;
            }

            this.removeBoundingBox();
            this.checkBoundingBox(event.nativeEvent.offsetX, event.nativeEvent.offsetY);
            this.checkPoiHover(event);
        }
    }

    checkPoiHover(event) {
        let [poi, sensorType, sensorSubType] = this.poiManager.hitTest(event, this.camera);

        if (poi) {
            this.movingScannerPoiManager.hoverLabel(null);
            this.poiManager.hoverPoi(poi);
        }
        else {
            const label = this.movingScannerPoiManager.hitTest(event);

            this.movingScannerPoiManager.hoverLabel(label);
            this.poiManager.hoverPoi(null);
        }
    }

    onKeyDown(e) {
        if (this.props.isEditMode) {
            if (e.key === "Escape") {
                this.editModeManager.quit(this.props.editMenu);
                this.props.setTemporarySensor(null, null);
            }
        }
    }

    checkBoundingBox(x, y) {
        const mouse = new THREE.Vector2((x / window.innerWidth) * 2 - 1, -(y / window.innerHeight) * 2 + 1);

        const raycaster = new THREE.Raycaster();
        raycaster.setFromCamera(mouse, this.camera);

        if (this.currentModel != null && this.currentModel.userData.isIndoor) {
            if (this.checkIndoorBoundingBox(raycaster)) {
                return;
            }
        }
        else {
            if (this.checkOutdoorBoundingBox(raycaster)) {
                return;
            }
        }

        if (this.prevIndoorFacility) {
            if (this.selectedFacility === null || this.prevIndoorFacility.object !== this.selectedFacility) {
                if (this.props.controlMode === SdmsResource.controlMode.equipment && this.prevIndoorFacility.object?.userData?.isAlarmBounding === true) {
                    // 설비 모드 경우 알람 경우는 바운딩 박스 해제 안함
                }
                else 
                    this.prevIndoorFacility.object.visible = false;
            }
            this.prevIndoorFacility = null;
        }

        //this.optionManager.onPostMouseMove(event);
    }

    // 부모가 모두 visible 상태인지 확인한다.
    checkParentVisible(model) {
        if (model.parent === null) {
            return true;
        }

        if (!model.parent.visible) {
            return false;
        }

        return this.checkParentVisible(model.parent);
    }

    // BoundingBox Check
    isBuildingGroup(obj) {
        if (obj.name.endsWith(_3dMaster.BoundingBoxTag) === false) {
            if (obj.parent === null) {
                return null;
            }

            return this.isBuildingGroup(obj.parent);
        }

        const len = obj.name.length;
        let objName = obj.name.substring(0, len - _3dMaster.BoundingBoxTag.length);

        for (const buildingGroupNo in this.props.spatialManager.buildingGroups) {
            const buildingGroup = this.props.spatialManager.buildingGroups[buildingGroupNo];

            if (buildingGroup.name === objName) {
                if (this.checkParentVisible(obj)) {
                    obj.userData.buildingGroup = buildingGroup;
                    return obj;
                }
                else {
                    return null;
                }
            }
        }

        if (obj.parent === null) {
            return null;
        }

        return this.isBuildingGroup(obj.parent);
    }

    // BoundingBox Check
    isBuilding(obj) {
        if (obj.name.endsWith(_3dMaster.BoundingBoxTag) === false) {
            if (obj.parent === null) {
                return null;
            }

            return this.isBuilding(obj.parent);
        }

        const len = obj.name.length;
        const objName = obj.name.substring(0, len - _3dMaster.BoundingBoxTag.length);

        for (const buildingNo in this.props.spatialManager.buildings) {
            const building = this.props.spatialManager.buildings[buildingNo];

            if (building.name === objName) {
                if (this.checkParentVisible(obj)) {
                    obj.userData.building = building;
                    return obj;
                }
                else {
                    return null;
                }
            }
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

        for (let i = 0; i < objectCount; i++) {
            const obj = objects[i];

            if (PoiManager.isSprite(obj) === false) {
                return obj;
            }
        }

        return objects[0];
    }

    checkIndoorBoundingBox(raycaster) {
        const controlMode = this.props.controlMode;
        let internalModel = this.internalModels[this.currentModel.name];

        // 설비 모드 경우
        if (controlMode === SdmsResource.controlMode.equipment) {
            const faModel = this.props.faModel;
            const selFcltyInfo = this.props.selFcltyInfo;

            const modelNode = FacilityManager.getModelNode(selFcltyInfo.fcltyNo, selFcltyInfo.zoneNo, faModel);
            if (modelNode) {
                internalModel = modelNode;
            }
        }
       
        if (internalModel && internalModel[4]) {
            const intersects = raycaster.intersectObjects(internalModel[4].children, true);
            const intersectCount = intersects.length;

            for (let i = 0; i < intersectCount; i++) {
                const intersect = intersects[i];

                if (intersect.object.parent === internalModel[4] ||
                    controlMode === SdmsResource.controlMode.equipment/*설비모드 경우는 데이터를 가공하여 parent 맞지 않음 */) {
                    if (this.prevIndoorFacility && this.prevIndoorFacility !== intersect) {

                        if (this.selectedFacility === null || this.prevIndoorFacility.object !== this.selectedFacility) {
                            this.prevIndoorFacility.object.visible = false;
                        }
                    }

                    intersect.object.visible = true;

                    this.prevIndoorFacility = intersect;
                    //this.optionManager.onPostMouseMove(event);
                    return true;
                }
            }
        }

        return false;
    }

    checkOutdoorBoundingBox(raycaster) {
        this.fixedBoundingBoxHover = false;

        const intersects = raycaster.intersectObjects(this.scene.children, true);
        const intersectCount = intersects.length;

        if (intersectCount > 0) {
            const nearestIntersect = this.sortIntersects(intersects, intersectCount);

            if (nearestIntersect) {
                const zoomValue = this.cameraManager.getZoomValue(this.camera, this.controls, this.props.isEditMode);
                let model = null;

                if (this.props.controlMode !== SdmsResource.controlMode.simulation && zoomValue >= HtmlTextPoiManager.BuildingGroupTextDistance) {
                    let _model = this.isBuildingGroup(nearestIntersect.object);

                    if (_model && this.checkModelZoneNo(_model)) {
                        model = _model;
                    }

                    if (!model) {
                        const secondNearest = intersectCount > 1 ? intersects[1] : null;

                        if (secondNearest) {
                            _model = this.isBuildingGroup(secondNearest.object);

                            if (_model && this.checkModelZoneNo(_model)) {
                                model = _model;
                            }
                        }
                    }
                }
                else {
                    for (let i = 0; i < intersectCount; i++) {
                        const intersect = intersects[i];

                        const _model = this.isBuilding(intersect.object);

                        if (_model && this.checkModelZoneNo(_model)) {
                            model = _model;
                            break;
                        }
                    }
                }

                if (model !== null/* && this.checkModelZoneNo(model)*/) {
                    model.visible = true;

                    if (model !== this.fixedBoundingBox) {
                        this.boundingBoxModel = model;
                    }
                    else {
                        this.fixedBoundingBoxHover = true;
                    }
                }
                else {
                    // 실외모델의 설비
                    for (let i = 0; i < intersectCount; i++) {
                        const intersect = intersects[i];

                        if (intersect.object.name.startsWith(_3dMaster.FacilityHeadTag)) {
                            if (this.prevIndoorFacility && this.prevIndoorFacility !== intersect) {

                                if (this.selectedFacility === null || this.prevIndoorFacility.object !== this.selectedFacility) {
                                    this.prevIndoorFacility.object.visible = false;
                                }
                            }

                            intersect.object.visible = true;

                            this.prevIndoorFacility = intersect;
                            //this.optionManager.onPostMouseMove(event);
                            return true;
                        }
                    }
                }
            }
        }

        return false;
    }

    checkModelZoneNo(model) {
        const userInfo = ProjectResource.getUserInfo();
        const zoneNos = userInfo?.options?.zoneNos;

        if (!zoneNos) {
            return true;
        }

        if (model.userData.buildingGroup) {
            return _3dMaster.checkUserBuildingGroup(model.userData.buildingGroup, userInfo);
        }

        if (model.userData.building) {
            return _3dMaster.checkUserBuilding(model.userData.building, userInfo);
        }

        return false;
    }

    static checkUserBuildingGroup(buildingGroup, userInfo = null) {
        if (!userInfo) {
            userInfo = ProjectResource.getUserInfo();

            if (!userInfo) {
                return true;
            }
        }

        const zoneNos = userInfo?.options?.zoneNos;

        if (!zoneNos) {
            return true;
        }

        for (const building of buildingGroup.buildingDatas) {
            for (const zone of building.zoneDatas) {
                if (zoneNos.includes(zone.zoneNo)) {
                    return true;
                }
            }
        }

        return false;
    }

    static checkUserBuilding(building, userInfo = null) {
        if (!userInfo) {
            userInfo = ProjectResource.getUserInfo();

            if (!userInfo) {
                return true;
            }
        }

        const zoneNos = userInfo?.options?.zoneNos;

        if (!zoneNos) {
            return true;
        }

        for (const zone of building.zoneDatas) {
            if (zoneNos.includes(zone.zoneNo)) {
                return true;
            }
        }

        return false;
    }

    setPerspectiveCameraData(zoneNo) {
        return {
            position: [this.perspectiveCamera.position.x, this.perspectiveCamera.position.y, this.perspectiveCamera.position.z],
            rotation: [this.perspectiveCamera.rotation.x, this.perspectiveCamera.rotation.y, this.perspectiveCamera.rotation.z],
            targetControl: [this.controls.target.x, this.controls.target.y, this.controls.target.z],
            zoneNo: zoneNo
        };
    }

    getPerspectiveCameraData(zoneNo, cameraData) {
        if (zoneNo === this.perspectiveControlOrigin.zoneNo) {
            return {
                position: this.perspectiveControlOrigin.position,
                rotation: this.perspectiveControlOrigin.rotation,
                orbit: this.perspectiveControlOrigin.targetControl
            };
        }

        return cameraData;
    }

    changeCamera(isEditMode) {
        this.movingScannerPoiManager.setEditMode(isEditMode, this.poiManager);

        if (isEditMode) {
            this.camera = this.orthoGraphicCamera;
            this.controls.object = this.camera;

            // 편집모드 해제시 DB에 저장된 Viewport가 아니라 사용자가 마지막에 사용하던 Viewport로 돌아갈 수 있도록 한다.
            this.perspectiveControlOrigin = this.setPerspectiveCameraData(this.props.currentModel.currentZoneNo);

            const orthoCameraData = this.cameraManager.getCurrentCameraData(this.props.currentModel, this.props.spatialManager, isEditMode);

            if (!orthoCameraData) {
                return;
            }

            const cameraOptions = {
                far: this.camera.far,
                fov: this.camera.fov,
                near: this.camera.near,
                position: orthoCameraData.position,
                rotation: orthoCameraData.rotation,
                targetControl: orthoCameraData.targetControl,
                zoom: orthoCameraData.zoom
            };

            this.cameraManager.ready([_3dMaster.postChangeCamera], [[this, cameraOptions, isEditMode]], this.camera, this.controls, cameraOptions, 0.75);
        }
        else {
            this.camera = this.perspectiveCamera;
            this.camera.updateProjectionMatrix();
            this.controls.object = this.camera;
            this.controls.enableRotate = true;

            let cameraData = this.cameraManager.getCurrentCameraData(this.props.currentModel, this.props.spatialManager, isEditMode);

            if (!cameraData) {
                return;
            }

            cameraData = this.getPerspectiveCameraData(this.props.currentModel.currentZoneNo, cameraData);

            if (cameraData) {
                const cameraOptions = {
                    far: this.camera.far,
                    fov: this.camera.fov,
                    near: this.camera.near,
                    position: cameraData.position,
                    rotation: cameraData.rotation,
                    targetControl: cameraData.orbit
                };

                this.cameraManager.ready([_3dMaster.postChangeCamera], [[this, cameraOptions, isEditMode]], this.camera, this.controls, cameraOptions, 0.75);
            }
            else {
                this.controls.update();
            }
        }

        if (this.cfdTextPoiManager) {
            // Camera 모드가 바뀌면 BuildingGroupText 표시여부를 위한 값도 초기화 시킨다.
            this.cfdTextPoiManager.initZoomValue();
        }
        if (this.textPoiManager) {
            // Camera 모드가 바뀌면 BuildingGroupText 표시여부를 위한 값도 초기화 시킨다.
            this.textPoiManager.initZoomValue();
        }
    }

    getCheckAlarmMethod(modelNode) {
        const zoneNo = modelNode?.userData?.zoneNo;

        if (zoneNo) {
            const sensorAlarms = [...this.props.sensorAlarms];

            for (const sensorAlarm of sensorAlarms) {
                if (sensorAlarm.isAlarm && sensorAlarm.zoneNo === zoneNo) {
                    if (this.props.selectedAlarm?.sensorZoneHistoryNo !== sensorAlarm.sensorZoneHistoryNo) {
                        this.props.setSensorAlarms(sensorAlarms, sensorAlarm);
                    }

                    return [_3dMaster._checkAlarm, [sensorAlarm, sensorAlarms, this]];
                }
            }
        }

        return [null, null];
    }

    static _checkAlarm(params) {
        const selectedAlarm = params[0];
        const sensorAlarms = params[1];
        const _this = params[2];

        _this.checkAlarm(selectedAlarm, sensorAlarms);
    }

    checkAlarm(selectedAlarm, sensorAlarms) {
        this.selectedAlarm = selectedAlarm;

        if (this.alarmManager) {
            this.alarmManager.selectAlarm(selectedAlarm, sensorAlarms);
        }
    }

    getZoneModelData(zoneNo) {
        const zoneData = this.props.spatialManager.zones[zoneNo];

        if (zoneData?.model) {
            return zoneData.model;
        }

        return null;
    }

    getInternalModel(modelName) {
        return this.internalModels[modelName];
    }

    static postChangeCamera(params) {
        const _this = params[0];
        const cameraOptions = params[1];
        const isEditMode = params[2];

        if (isEditMode) {
            _this.orthoGraphicCamera.position.set(cameraOptions.position[0], cameraOptions.position[1], cameraOptions.position[2]);
            _this.orthoGraphicCamera.rotation.set(cameraOptions.rotation[0], cameraOptions.rotation[1], cameraOptions.rotation[2]);
            _this.orthoGraphicCamera.zoom = cameraOptions.zoom;

            _this.camera = _this.orthoGraphicCamera;
            _this.camera.up.set(0, 1, 0);
            _this.camera.updateProjectionMatrix();
        }
        else {
            _this.perspectiveCamera.position.set(cameraOptions.position[0], cameraOptions.position[1], cameraOptions.position[2]);
            _this.perspectiveCamera.rotation.set(cameraOptions.rotation[0], cameraOptions.rotation[1], cameraOptions.rotation[2]);

            _this.camera = _this.perspectiveCamera;
        }

        _this.controls.object = _this.camera;
        _this.controls.target.set(cameraOptions.targetControl[0], cameraOptions.targetControl[1], cameraOptions.targetControl[2]);
        _this.controls.enableRotate = isEditMode === false;
        _this.controls.update();
    }

    static hideBoundingBoxes(obj) {
        let childCount = obj.children.length;

        if (childCount === 1) {
            obj = obj.children[0];
            childCount = obj.children.length;
        }

        // BoundingBox 감추기
        for (let i = 0; i < childCount; i++) {
            const child = obj.children[i];

            if (child.name.endsWith(SDMSDataManager.BoundingBoxTag)) {
                child.visible = false;
            }
        }
    }

    /*static hideBuildingBoundingBox(obj, buildings) {
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
    }*/

    static showFacilities(modelNode, visible, facilityMaps) {
        const childCount = modelNode.children.length;

        if (modelNode.name.startsWith(_3dMaster.FacilityHeadTag) && modelNode.name.endsWith(_3dMaster.BoundingBoxTag)) {
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
            const child = _3dMaster.showFacilities(modelNode.children[i], visible, facilityMaps);

            if (child !== null) {
                return child;
            }
        }

        return null;
    }    

    static showExit(modelNode, visible) {
        if (modelNode.name.startsWith(_3dMaster.ExitArrowGroupTag)) {
            if (visible) {
                modelNode.visible = visible;
            }
            else {
                modelNode.visible = false;
            }

            return [modelNode, _3dMaster.setArrowDatas(modelNode)];
        }

        const childCount = modelNode.children.length;

        for (let i = 0; i < childCount; i++) {
            const child = _3dMaster.showExit(modelNode.children[i], visible);

            if (child !== null) {
                return child;
            }
        }

        return null;
    }

    static setArrowDatas(modelNode) {
        const childCount = modelNode.children.length;
        const datas = {};

        const beginLength = _3dMaster.ExitArrowBeginTag.length;
        const endLength = _3dMaster.ExitArrowEndTag.length;

        for (let i = 0; i < childCount; i++) {
            const child = modelNode.children[i];

            if (child.name.startsWith(_3dMaster.ExitArrowBeginTag)) {
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
            else if (child.name.startsWith(_3dMaster.ExitArrowEndTag)) {
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
                arrowDatas.push([data.begin, new THREE.Vector3(data.begin.position.x, data.begin.position.y, data.begin.position.z), new THREE.Vector3(data.end.position.x, data.end.position.y, data.end.position.z), distance]);
            }
        }

        return arrowDatas;
    }

    static setCamera(camera, controls, cameraOptions) {
        if (camera?.position)
            camera.position.set(cameraOptions.position[0], cameraOptions.position[1], cameraOptions.position[2]);

        if (camera?.rotation)
            camera.rotation.set(cameraOptions.rotation[0], cameraOptions.rotation[1], cameraOptions.rotation[2]);
        if (controls?.target)
            controls.target.set(cameraOptions.orbit[0], cameraOptions.orbit[1], cameraOptions.orbit[2]);

        if (camera && cameraOptions) {
            camera.near = cameraOptions.near;
            camera.far = cameraOptions.far;
            camera.fov = cameraOptions.fov;
        }
    }

    checkWorkerType() {
        if (this.textPoiManager && this.props.currentModel?.currentSiteNo) {
            this.textPoiManager.setWorkerVisibleType(this.props.visibleSensorTypes[PoiManager.Worker], this.props.visibleSensorTypes[PoiManager.Visitor], this.props.currentModel.currentSiteNo);
        }
    }

    _getCurrentModel() {
        const zoneNo = this.props.currentModel.currentZoneNo;

        if (zoneNo === null) {
            const siteData = this.props.spatialManager.sites[this.props.currentModel.currentSiteNo];

            if (siteData?.model) {
                return siteData.model;
            }
        }
        else {
            const zone = this.props.spatialManager.getZone(zoneNo);

            if (zone?.model) {
                return zone.model;
            }
        }

        return null;
    }

    // 설정된 Viewport로 이동한다.
    goHome() {
        // 자동 회전 중이라면 중지 
        this.lastMouseMoveTime = new Date();

        const model = this._getCurrentModel();

        if (this.props.isEditMode && model?.cameraOrtho) {
            const cameraOptions = {
                far: this.camera.far,
                fov: this.camera.fov,
                near: this.camera.near,
                position: model.cameraOrtho.position,
                rotation: model.cameraOrtho.rotation,
                targetControl: model.cameraOrtho.targetControl,
                zoom: model.cameraOrtho.zoom
            };

            this.cameraManager.ready([_3dMaster.postChangeCamera], [[this, cameraOptions, this.props.isEditMode]], this.camera, this.controls, cameraOptions, 0.75);
        }
        else if (!this.props.isEditMode && model?.camera) {
            this.cameraManager.ready([], [], this.camera, this.controls, model.camera, 0.75);
        }
    }

    onCompleteLoadingCfd(frameSeconds, buildingNo, cfdLoader) {
        this.cfdFrameSeconds = frameSeconds;
        this.cfdLoader = cfdLoader;

        if (this.cfdFrameSeconds && this.cfdFrameSeconds.length > 0) {
            this.cfdTextPoiManager.setCfdBuilding(buildingNo);
            this.props.handleCfdFrameSeconds(this.cfdFrameSeconds);
        }
    }

    setCfdLoader(cfdLoader) {
        this.cfdLoader = cfdLoader;
    }

    showCfd(frame) {
        if (this.cfdFrameSeconds) {
            const cfdFrameSeconds = [...this.cfdFrameSeconds];
            const frameCount = cfdFrameSeconds.length;

            for (let i = 0; i < frameCount; i++) {
                const frameSecond = cfdFrameSeconds[i];

                if (i < frameCount - 1) {
                    if (frame >= frameSecond && frame < cfdFrameSeconds[i + 1]) {
                        this.cfdLoader.showCfd(frameSecond);
                        return;
                    }
                }
                else {
                    if (frame >= frameSecond) {
                        this.cfdLoader.showCfd(frameSecond);
                        return;
                    }
                }
            }
        }
    }

    checkVisibleSensorTypes() {
        if (!this.poiManager) {
            return;
        }

        const visibleSensorTypes = { ...this.props.visibleSensorTypes };

        for (const sensorType in visibleSensorTypes) {
            const visible = visibleSensorTypes[sensorType];

            if (sensorType === PoiManager.EquipZoneName) {
                if (this.textPoiManager) {
                    // null을 입력하면 baseTextLayer를 얻어온다.
                    this.textPoiManager.showTextLayer(null, visible);
                    //this.textPoiManager.showTextLayer(TextPoiManager.EquipZoneNameText, visible);
                }
            }
            else {
                const index = sensorType.indexOf('_');

                if (index > 0) {
                    const sensorTypeCode = sensorType.substring(0, index);
                    this.poiManager.showSensorLayer(sensorTypeCode, visible);
                }
                else {
                    this.poiManager.showSensorLayer(sensorType, visible);
                }
            }
        }
    }

    setSimulationMode(mode) {
        this.isSimulationMode = mode;

        if (this.cfdTextPoiManager) {
            this.cfdTextPoiManager.setCfdMode(this.isSimulationMode);
        }

        this.showTerrain(!this.isSimulationMode);

        if (this.poiManager) {
            this.poiManager.showBaseSensorLayer(!this.isSimulationMode);
            this.poiManager.showMarkLayers(mode, this.props.simulationPois);
        }
    }

    showTerrain(isNormal) {
        if (!this.normalTerrain || !this.cfdTerrain) {
            return;
        }

        this.normalTerrain.visible = isNormal;
        this.cfdTerrain.visible = !isNormal;

        // 시뮬레이션 모드에서는 영역이 커지기 때문에 더 멀리 볼수 있도록 한다.
        this.perspectiveCamera.far = isNormal ? 5000 : 100000;
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

    startAutoRotation = () => {
        const current = new Date();
        const idleTime = this.props.cameraIdleTime * 1000;  // 밀리세컨드로 변환
        //const idleTime = this.getState().idleTime * 60000;
        this.lastMouseMoveTime = new Date(current.getTime() - idleTime);
        this.lastAutoRotationCommandTime = current;
        this.rotateImmediately = true;
    }
    
    stopRotation = () => {
        this.lastMouseMoveTime = new Date();
        this.rotateImmediately = false;
    }

    setIdleTime = (minutes, use) => {
        let time = this.props.cameraIdleTime / 60;
        //let time = Contents3D.CAMERA_IDLE_TIME / 60000;        // 기본 idleTime 값
        let useIdleTime = true;

        if (minutes === null || minutes === undefined || minutes === "") {
            // 값이 없다면 기본 idleTime 값
        } else {
            time = minutes;
            useIdleTime = use;
        }

        if (time || time === 0) {
            this.setState({ idleTime: time, useIdleTime: useIdleTime });
        }
    }

    updateScanerInfo(info) {
        this.movingScannerPoiManager?.updateScanerInfo(info);
    }

    getScanerInfo(sensorNo) {
        return this.movingScannerPoiManager?.getScanerInfo(sensorNo);
    }

    updateScanerText(label, sensorNo, permissionCount, nonPermissionCount) {
        label.userData.sensorNo = sensorNo;
        this.movingScannerPoiManager?.updateScanerText(label, permissionCount, nonPermissionCount);
    }

    setFixedBoundingBox(buildingName, showPopup) {
        if (buildingName) {
            const targetName = buildingName + _3dMaster.BoundingBoxTag;

            if (this.fixedBoundingBox && this.fixedBoundingBox.userData.name !== targetName) {
                this.fixedBoundingBox.visible = false;
                this.fixedBoundingBox = null;
            }

            const boundingBoxModel = this.findBoundingBoxModel(buildingName);

            if (boundingBoxModel) {
                this.fixedBoundingBox = boundingBoxModel;
                this.fixedBoundingBox.visible = true;

                if (this.boundingBoxModel) {
                    if (this.boundingBoxModel !== this.fixedBoundingBox) {
                        this.boundingBoxModel.visible = false;
                    }

                    this.boundingBoxModel = null;
                }
            }

            const label = this.cfdTextPoiManager.getCfdLabel(buildingName);

            if (label?.element) {
                const rect = label.element.getBoundingClientRect();
                const x = rect.left + rect.width + 5;
                const y = rect.top;

                if (showPopup) {
                    this.contents3D.setSimulationPopupMenu(true, x, y);
                }
                else {
                    this.contents3D.setSimulationPopupMenu(false, x, y);
                }
            }
        }
        else {
            if (this.fixedBoundingBox) {
                this.fixedBoundingBox.visible = false;
                this.fixedBoundingBox = null;
            }
        }
    }

    setSimulationPopupMenu(visible, x, y) {
        this.contents3D.setState({ expandedCode: visible });
    }

    setFixedBoundingBoxModel(model) {
        if (model === this.fixedBoundingBox) {
            return;
        }

        if (this.fixedBoundingBox) {
            this.fixedBoundingBox.visible = false;
        }

        this.fixedBoundingBox = model;

        if (this.fixedBoundingBox) {
            this.fixedBoundingBox.visible = true;
        }
    }

    findBoundingBoxModel(buildingName) {
        const targetName = buildingName + _3dMaster.BoundingBoxTag;
        const len = this.scene.children.length;

        for (let i = len - 1; i >= 0; i--) {
            const child = this.scene.children[i];

            if (child.name.toLocaleLowerCase() === "modellayer_outdoor") {
                const len2 = child.children.length;

                for (let j = len2 - 1; j >= 0; j--) {
                    const child2 = child.children[j];

                    if (child2.name.toLowerCase() === "soubrain_out_cfd.glb") {
                        for (const child3 of child2.children) {
                            for (const child4 of child3.children) {
                                if (child4.name === targetName) {
                                    return child4;
                                }
                            }
                        }

                        break;
                    }
                }

                break;
            }
        }

        return null;
    }
}