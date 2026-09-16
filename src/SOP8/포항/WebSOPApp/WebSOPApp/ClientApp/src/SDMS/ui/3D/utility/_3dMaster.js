import * as THREE from "three/build/three.module.js";
import Geometry from "../../../../Common/util/Geometry";
import { AlarmManager } from "./alarmManager";
import { AnimationModel } from "./animationModel";
import { BlinkManager } from "./blinkManager";
import { GlbLoader } from "./glbLoader";
import { MovingManager } from "./movingManager";

export class _3dMaster {
    static Mode_Outdoor_All = 0;
    static Mode_Outdoor_Part = 1;
    static Mode_Indoor = 2;

    static FacilityHeadTag = "equipment-";
    static BoundingBoxTag = "-0";

    static ExitArrowGroupTag = "arrow_Group";
    static ExitArrowBeginTag = "arrow_Y";
    static ExitArrowEndTag = "arrow_R";

    //constructor(timelog, setState, getState) {
    //    this.renderer = null;
    //    this.scene = null;
    //    this.camera = null;
    //    this.dirLight = null;
    //    this.controls = null;
    //    this.clock = new THREE.Clock();

    //    this.boundingBoxModel = null;
    //    this.prevIndoorFacility = null;

    //    this.blinkManager = new BlinkManager();
    //    this.movingManager = new MovingManager();

    //    this.timelog = timelog;
    //    this.setState = setState;
    //    this.getState = getState;

    //    // 실내모델링이 로딩되지 않을 경우, 카메라 첫 외곽 이동 여부 체크 >> 타이밍 체크
    //    this.FirstIndoorNotOnMemoryCameraMove = false;
    //    this.useBoundingBox = true;

    //    // 실내모델 파일 로딩이 끝나지 않아서 보여주지 못했던 층정보
    //    this.lazyIndoorData = {};

    //    this.currentModel = null;
    //}

    //initialize(_3dOptions, props/*currentSiteNo, onCompleteOutdoorModelLoading*/) {
    //    this.props = props;
    //    this._init(_3dOptions);
    //    _3dMaster.animate(this);

    //    this.alarmManager = new AlarmManager();

    //    const modelFiles = _3dMaster.getOutdoorModelFiles(_3dOptions);
    //    this.glbLoader.loadOutdoorModelFiles(modelFiles, _3dOptions, true);
    //}

    //_init(_3dOptions) {
    //    this.internalModels = {};
    //    //this.initPoiMaterials();

    //    const outdoorModel = _3dOptions.outdoorModel;

    //    this.orthoGraphicCamera = new THREE.OrthographicCamera(window.innerWidth / - 2, window.innerWidth / 2, window.innerHeight / 2, window.innerHeight / - 2, 0.1, 5000);
    //    this.perspectiveCamera = new THREE.PerspectiveCamera(outdoorModel.camera.fov, window.innerWidth / window.innerHeight, outdoorModel.camera.near, outdoorModel.camera.far);
    //    this.camera = this.perspectiveCamera;

    //    this.scene = new THREE.Scene();
    //    this.glbLoader = new GlbLoader(this.timelog, this.scene, this.props, this.setState, this);
    //    this.glbLoader.setIndoorModelCount();

    //    // 멀티사이트 경우, 선택된 사이트로 textPOI 초기화 
    //    const currentSiteNo = parseInt(this.props.currentSiteNo);
    //    this.glbLoader.loadSiteNo(currentSiteNo);

    //    /*if (ProjectResource.IsMultiSite === true && currentSiteNo > 0 && ProjectResource.SiteID !== currentSiteNo) {
    //        this.textPOIManager.setScene(this.scene, currentSiteID);
    //    } else {
    //        this.textPOIManager.Scene = this.scene;
    //    }

    //    this.poiManager.Scene = this.scene;
        
    //    this.optionManager = new OptionManager(this.scene, this);*/

    //    const bgTexture = new THREE.TextureLoader().load(_3dOptions.textureBaseURL + '/' + _3dOptions.backgroundImage);
    //    this.scene.background = bgTexture;

    //    const hemiLight = new THREE.HemisphereLight(0xffffff, 0x444444, 0.1);
    //    hemiLight.position.set(0, 20, 0);
    //    this.scene.add(hemiLight);

    //    this.dirLight = new THREE.DirectionalLight(0xffffff/*, this.directionalLightPower*/);
    //    this.dirLight.position.set(-3, 10, -10);

    //    this.dirLight.castShadow = true;

    //    this.dirLight.shadow.bias = -0.0008;
    //    this.dirLight.shadow.mapSize.width = 2048;
    //    this.dirLight.shadow.mapSize.height = 2048;
    //    this.dirLight.shadow.camera.updateProjectionMatrix();
    //    this.scene.add(this.dirLight);
    //    this.scene.add(this.dirLight.target);

    //    this.renderer = new THREE.WebGLRenderer({ antialias: true });
    //    this.renderer.setPixelRatio(window.devicePixelRatio);
    //    this.renderer.setSize(window.innerWidth, window.innerHeight);

    //    this.renderer.outputEncoding = THREE.sRGBEncoding;
    //    this.renderer.shadowMap.enabled = true;
    //    this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    //    this.ref3D.current.appendChild(this.renderer.domElement);

    //    this.controls = new OrbitControls(this.camera, this.renderer.domElement);
    //    this.controls.target.set(0, 0, 0);
    //    // 최대 회전각
    //    this.controls.maxPolarAngle = Math.PI / 3;
    //    this.controls.update();

    //    //this.equipZoneAreaManager.setContents3D(this);
    //}

    //detach3D() {
    //    if (this.renderer === null || this.scene === null) {
    //        return;
    //    }

    //    this.ref3D.current.removeChild(this.renderer.domElement);

    //    const meshes = [];
    //    const materials = [];
    //    const textures = [];
    //    const geometries = [];

    //    this.scene.traverse(obj => {
    //        if (obj instanceof THREE.Mesh) {
    //            meshes.push(obj);

    //            if (obj.geometry instanceof THREE.BufferGeometry) {
    //                geometries.push(obj.geometry);
    //            }

    //            if (obj.material instanceof THREE.Material) {
    //                materials.push(obj.material);

    //                if (obj.material.map instanceof THREE.Texture) {
    //                    textures.push(obj.material.map);
    //                }
    //            }
    //        }
    //    });

    //    for (let i = 0; i < this.alarmAnimationMixers.length; i++) {
    //        const mixers = this.alarmAnimationMixers[i];
    //        const alarmModels = this.alarmModels[i];

    //        const mixerCount = mixers.length;

    //        for (let j = 0; j < mixerCount; j++) {
    //            const mixer = mixers[j];
    //            const alarmModel = alarmModels[j];

    //            if (mixer && alarmModel) {
    //                mixer.stopAllAction();
    //                mixer.uncacheRoot(alarmModel);
    //            }
    //        }
    //    }
        
    //    this.scene.clear();

    //    meshes.forEach((obj) => {
    //        if (obj.parent !== null) {
    //            obj.parent.remove(obj);
    //        }
    //        if (obj.dispose) {
    //            obj.dispose();
    //        }
    //    });

    //    materials.forEach((mat) => {
    //        if (mat.dispose) {
    //            mat.dispose();
    //        }
    //    });

    //    textures.forEach((tex) => {
    //        tex.dispose();
    //    });

    //    geometries.forEach((geom) => {
    //        geom.dispose();
    //    });

    //    if (this.scene.background instanceof THREE.Texture) {
    //        this.scene.background.dispose();
    //        this.scene.background = null;
    //    }

    //    this.renderer.dispose();

    //    this.boundingBoxModel = null;
    //    this.renderer = null;
    //    this.scene = null;
    //    this.camera = null;
    //    this.dirLight = null;
    //    this.controls = null;
    //    this.currentModel = null;
    //    this.internalModels = {};
    //    this.spriteMaterials = {};
        
    //    //this.textPOIManager.clear();
    //}

    //static getOutdoorModelFiles(_3dOptions) {
    //    const modelFiles = [];

    //    if (_3dOptions?.outdoorModel?.file)
    //        modelFiles.push(_3dOptions.outdoorModel.file);

    //    for (const buildingGroupName in _3dOptions.indoorModels) {
    //        const buildingGroup = _3dOptions.indoorModels[buildingGroupName];

    //        if (buildingGroup.file) {
    //            modelFiles.push(buildingGroup.file);
    //        }
    //    }

    //    return modelFiles;
    //}

    

    //static animate(_this) {
    //    requestAnimationFrame(() => {
    //        _3dMaster.animate(_this);
    //    });

    //    const delta = _this.clock.getDelta();

    //    if (_this.movingCamera) {
    //        _this.moveCamera(delta);
    //    }
    //    else {
    //        if (_this.needCameraRotation()) {
    //            _this.rotateCamera(delta);
    //        }
    //    }

    //    if (_this.renderer && _this.scene && _this.camera) {
    //        _this.renderer.render(_this.scene, _this.camera);
    //    }

    //    _this.blinkManager.blink(delta);
    //    _this.movingManager.runMoving(delta);
    //    _this.alarmManager.animateAlarm(delta);

    //    AnimationModel.animateModels(delta, _this.currentAnimationModels);
    //    /*_this.poiManager.changePoiScales(delta);
    //    _this.poiManager.showSmoothVisible(delta);
    //    _this.textPOIManager.showSmoothVisible(delta);

    //    _this.watchAlarmSoundTime();*/
    //}

    //setLazyMovingCamera(cameraOptions, mode) {
    //    // 실내모델 파일 로딩이 끝나지 않아서 못한 카메라 셋팅 저장
    //    this.lazyMovingCameraData = {
    //        cameraOptions: cameraOptions,
    //        mode: mode,
    //        orthoCameraData: null
    //    };
    //}

    //setLazyOrthoCamera(orthoCameraData) {
    //    this.lazyMovingCameraData = {
    //        cameraOptions: null,
    //        mode: null,
    //        orthoCameraData: orthoCameraData
    //    };
    //}

    //showLazyMovingCamera() {
    //    if (this.lazyMovingCameraData?.cameraOptions && this.lazyMovingCameraData?.mode) {
    //        // 실내모델링이 로딩되지 않을 경우, 카메라 첫 외곽 이동 여부 체크
    //        if (this.FirstIndoorNotOnMemoryCameraMove === false) {
    //            setTimeout(() => this.showLazyMovingCamera(), 500);
    //            return;
    //        }

    //        this.setMovingCamera(this.lazyMovingCameraData.cameraOptions, this.lazyMovingCameraData.mode, null);

    //        this.lazyMovingCameraData = {};
    //    }
    //    else if (this.lazyMovingCameraData?.orthoCameraData) {
    //        // 편집모드 경우
    //        this.camera.position.set(this.lazyMovingCameraData.orthoCameraData.position[0], this.lazyMovingCameraData.orthoCameraData.position[1], this.lazyMovingCameraData.orthoCameraData.position[2]);
    //        this.camera.rotation.set(this.lazyMovingCameraData.orthoCameraData.rotation[0], this.lazyMovingCameraData.orthoCameraData.rotation[1], this.lazyMovingCameraData.orthoCameraData.rotation[2]);
    //        this.camera.quaternion.set(this.lazyMovingCameraData.orthoCameraData.quaternion[0], this.lazyMovingCameraData.orthoCameraData.quaternion[1], this.lazyMovingCameraData.orthoCameraData.quaternion[2], this.lazyMovingCameraData.orthoCameraData.quaternion[3]);
    //        this.camera.zoom = this.lazyMovingCameraData.orthoCameraData.zoom;
    //        this.controls.target.set(this.lazyMovingCameraData.orthoCameraData.targetControl[0], this.lazyMovingCameraData.orthoCameraData.targetControl[1], this.lazyMovingCameraData.orthoCameraData.targetControl[2]);

    //        this.camera.lookAt(this.camera.position.x, this.controls.target.y, this.camera.position.z);

    //        this.camera.up.set(0, 1, 0);
    //        this.camera.updateProjectionMatrix();
    //        this.controls.update();

    //        this.controls.enableRotate = false;

    //        this.lazyMovingCameraData = {};
    //    }
    //}

    //showLazyIndoorData() {
    //    if (this.lazyIndoorData.zoneID) {
    //        /*const _3dOptions = SpatialManager.get3dOptionsFromZoneID(this.lazyIndoorData.zoneID, this.props.site3dOptions);

    //        this.poiManager.addZoneSensors(this.lazyIndoorData.zoneID, POIManager.IndoorPoiScale, _3dOptions.outdoorZones, _3dOptions.zones, this.props.visibleSensorTypes);

    //        this.textPOIManager.hideEquipZoneSprites();
    //        this.textPOIManager.showEquipZoneSprites(this.lazyIndoorData.zoneID, _3dOptions?.siteID);
    //        this.fakeWallManager.showFakeWalls();

    //        // 영역 생성 관련
    //        this.equipZoneAreaManager.showEquipZoneAreas();*/

    //        this.lazyIndoorData = {};
    //    }
    //}

    //setMovingCamera(cameraOptions, mode, param, speedUpRatio) {
    //    if (!this.getState().loading) {
    //        this.setState({ loading: true });
    //    }

    //    const distancePos = Geometry.getDistance3(this.camera.position.x, this.camera.position.y, this.camera.position.z, cameraOptions.position[0], cameraOptions.position[1], cameraOptions.position[2]);
    //    const distanceQua = cameraOptions.quaternion === null ? null : Geometry.getDistance4(this.camera.quaternion.x, this.camera.quaternion.y, this.camera.quaternion.z, this.camera.quaternion.w, cameraOptions.quaternion[0], cameraOptions.quaternion[1], cameraOptions.quaternion[2], cameraOptions.quaternion[3]);
    //    const distanceRot = Geometry.getDistance3(this.camera.rotation.x, this.camera.rotation.y, this.camera.rotation.z, cameraOptions.rotation[0], cameraOptions.rotation[1], cameraOptions.rotation[2]);

    //    const movingTime = 0.75;
    //    let speedUp = null;

    //    if (speedUpRatio !== undefined && speedUpRatio !== null && speedUpRatio.length >= 2) {
    //        speedUp = {
    //            begin: movingTime * speedUpRatio[0],
    //            end: movingTime * speedUpRatio[1]
    //        }
    //    }

    //    this.movingCamera = {
    //        // 초
    //        movingTime: movingTime,
    //        //movingTime: 1.5,
    //        elapsedTime: 0,
    //        speedUp: speedUp,
    //        distancePosition: distancePos,
    //        distanceQuaternion: distanceQua,
    //        distanceRotation: distanceRot,
    //        beginCameraPos: new THREE.Vector3(this.camera.position.x, this.camera.position.y, this.camera.position.z),
    //        beginCameraQuaternion: new THREE.Quaternion(this.camera.quaternion.x, this.camera.quaternion.y, this.camera.quaternion.z, this.camera.quaternion.w),
    //        beginCameraRotation: new THREE.Vector3(this.camera.rotation.x, this.camera.rotation.y, this.camera.rotation.z),
    //        targetCameraOptions: cameraOptions,
    //        fov: cameraOptions.fov,
    //        far: cameraOptions.far,
    //        near: cameraOptions.near,
    //        mode: mode,
    //        param: param
    //    };

    //    // 실내로 이동할 때에는 이동이 끝난후에 outdoor를 감춘다.
    //    if (mode !== _3dMaster.Mode_Indoor) {
    //        this.showOutdoor(mode);
    //    }
    //}

    //showOutdoor(mode) {
    //    this.useBoundingBox = true;
    //    this.removeBoundingBox();

    //    const _3dOptions = this.props.site3dOptions[this.props.currentSiteID];

    //    let outdoorZoneID = null;

    //    if (mode !== _3dMaster.Mode_Indoor) {

    //        for (let zoneID in _3dOptions?.outdoorZones) {
    //            zoneID = Number(zoneID);

    //            if (zoneID !== NaN && zoneID !== 30000)
    //                outdoorZoneID = zoneID;
    //        }

    //        //this.equipZoneAreaManager.setZoneID(outdoorZoneID);
    //        //this.textPOIManager.hideEquipZoneSprites();

    //        // 외곽 공간 표시
    //        if (_3dOptions) {
    //            //this.textPOIManager.updateOutdoorEquipZoneData(_3dOptions);
    //        }
    //    }

    //    if (this.prevIndoorFacility) {
    //        this.prevIndoorFacility.object.visible = false;
    //        this.prevIndoorFacility = null;
    //    }

    //    const outdoorModels = this.glbLoader.getSiteOutdoorModels(parseInt(this.props.currentSiteNo));
        
    //    // 멀티사이트 경우 초기 로딩시 현재 사이트 외곽(outdoorModels)이 올라오지 않았을 경우가 있다.
    //    if (!_3dOptions/* || !outdoorModels*/) {
    //        return;
    //    }

    //    if (mode === _3dMaster.Mode_Indoor/* && outdoorModels*/) {
    //        // 멀티사이트 관련
    //        if (this.props.multiSite) {
    //            for (const siteNo in this.glbLoader.siteOutdoorModels) {
    //                // 전 사이트 외부영역 끄기
    //                const _outdoorModels = this.glbLoader.siteOutdoorModels[siteNo];
    //                _outdoorModels.map(model => {
    //                    model.visible = false;
    //                });

    //                // 현재 사이트 외 외부텍스트 끄기
    //                const tempSite = parseInt(siteNo);
    //                if (tempSite !== NaN && this.props.currentSiteNo !== tempSite) {
    //                    //this.textPOIManager.setVisible(false, tempSite);
    //                }
    //            }
    //        }
    //        else if (outdoorModels) {
    //            outdoorModels.map(model => {
    //                model.visible = false;
    //            });
    //        }

    //    }
    //    else {
    //        if (this.glbLoader.prevIndoorModel) {
    //            this.glbLoader.prevIndoorModel.visible = false;
    //            this.glbLoader.prevIndoorModel = null;
    //        }

    //        if (this.glbLoader.currentIndoorModel) {
    //            this.glbLoader.currentIndoorModel.visible = false;
    //            this.glbLoader.currentIndoorModel = null;
    //        }

    //        if (outdoorModels) {
    //            outdoorModels.map(model => {
    //                model.visible = true;
    //            });

    //            if (outdoorModels.length > 0) {
    //                this.currentModel = outdoorModels[0];
    //            }
    //        }

    //        this.blinkManager.clearBlink();
    //        this.movingManager.clearMoving();

    //        // 실내 센서들 제거
    //        /*this.poiManager.removeSensors(null);
    //        this.poiManager.addOutdoorSensors(_3dOptions.outdoorZones, _3dOptions.zones, this.props.visibleSensorTypes);

    //        // 가벽 제거
    //        this.fakeWallManager.clear();

    //        // 외부영역의 가벽 로딩하기
    //        this.fakeWallManager.setZoneID(null);
    //        this.fakeWallManager.showFakeWalls();

    //        // 영역 생성 관련
    //        this.equipZoneAreaManager.showEquipZoneAreas();*/

    //        // 외부에 있는 POI 이동을 했을땐 트리가 접히지 않는다
    //        if (!this.nonChangedStatusInfo) {
    //            // 외부영역에 POI를 선택하여 이동할때, showOutdoor를 다중호출로 인해서 POI 선택이 해제되어 주석처리 - K.D.R
    //            //this.props.onChangeBuildingGroup(null, SDMS.SelectedStatusInfoType.none);     

    //            this.nonChangedStatusInfo = false;
    //        }

    //        if (_3dOptions.indoorModelOnMemory === false) {
    //            // 실내 모델을 메모리에서 해제한다.
    //            //SpatialManager.clearIndoorModels(this);
    //        }
    //    }

    //    const animationModels = [];

    //    if (mode !== _3dMaster.Mode_Indoor) {
    //        this.props.setCurrentView(outdoorZoneID);

    //        if (outdoorModels) {
    //            const outdoorModelCount = outdoorModels.length;

    //            for (let i = 0; i < outdoorModelCount; i++) {
    //                const animationModel = this.glbLoader.modelAnimations[outdoorModels[i].name];

    //                if (animationModel) {
    //                    animationModels.push(animationModel);
    //                }
    //            }
    //        }
    //    }
    //    else {
    //        if (this.glbLoader.currentIndoorModel) {
    //            const animationModel = this.glbLoader.modelAnimations[this.glbLoader.currentIndoorModel.name];

    //            if (animationModel) {
    //                animationModels.push(animationModel);
    //            }
    //        }
    //    }

    //    this.glbLoader.currentAnimationModels = animationModels;
    //}

    //removeBoundingBox() {
    //    if (this.boundingBoxModel) {
    //        this.boundingBoxModel.visible = false;
    //        this.boundingBoxModel = null;
    //    }
    //}

    //isIndoor() {
    //    if (!this.currentModel) {
    //        return false;
    //    }

    //    if (!this.props._3dOptions || !this.props._3dOptions.outdoorModel) {
    //        return false;
    //    }

    //    if (this.currentModel.name === this.props._3dOptions.outdoorModel.file) {
    //        return false;
    //    }

    //    return true;
    //}

    //static hideBoundingBoxes(obj, buildingGroups, buildings) {
    //    let childCount = obj.children.length;

    //    if (childCount === 1) {
    //        obj = obj.children[0];
    //        childCount = obj.children.length;
    //    }

    //    const buildingGroupCount = buildingGroups.length;

    //    // BoundingBox 감추기
    //    for (let i = 0; i < childCount; i++) {
    //        const child = obj.children[i];

    //        if (child.name.endsWith(SDMSDataManager.BoundingBoxTag)) {
    //            child.visible = false;
    //        }
    //    }
    //}

    //static hideBuildingBoundingBox(obj, buildings) {
    //    for (const buildingGroupName in buildings) {
    //        const buildingGroup = buildings[buildingGroupName];

    //        for (const buildingName in buildingGroup) {
    //            const building = buildingGroup[buildingName];

    //            if (obj.name === building[2]) {
    //                obj.visible = false;
    //                return true;
    //            }
    //        }
    //    }

    //    return false;
    //}

    //static showFacilities(modelNode, visible, facilityMaps) {
    //    const childCount = modelNode.children.length;

    //    if (modelNode.name.startsWith(_3dMaster.FacilityHeadTag) && modelNode.name.endsWith(_3dMaster.BoundingBoxTag)) {
    //        for (let i = 0; i < childCount; i++) {
    //            const child = modelNode.children[i];
    //            facilityMaps[child.name] = child;

    //            if (visible) {
    //                child.visible = visible;
    //            }
    //            else {
    //                child.visible = false;
    //            }
    //        }

    //        return modelNode;
    //    }

    //    for (let i = 0; i < childCount; i++) {
    //        const child = _3dMaster.showFacilities(modelNode.children[i], visible, facilityMaps);

    //        if (child !== null) {
    //            return child;
    //        }
    //    }

    //    return null;
    //}

    //static showExit(modelNode, visible) {
    //    if (modelNode.name.startsWith(_3dMaster.ExitArrowGroupTag)) {
    //        if (visible) {
    //            modelNode.visible = visible;
    //        }
    //        else {
    //            modelNode.visible = false;
    //        }

    //        return [modelNode, _3dMaster.setArrowDatas(modelNode)];
    //    }

    //    const childCount = modelNode.children.length;

    //    for (let i = 0; i < childCount; i++) {
    //        const child = _3dMaster.showExit(modelNode.children[i], visible);

    //        if (child !== null) {
    //            return child;
    //        }
    //    }

    //    return null;
    //}

    //static setArrowDatas(modelNode) {
    //    const childCount = modelNode.children.length;
    //    const datas = {};

    //    const beginLength = _3dMaster.ExitArrowBeginTag.length;
    //    const endLength = _3dMaster.ExitArrowEndTag.length;

    //    for (let i = 0; i < childCount; i++) {
    //        const child = modelNode.children[i];

    //        if (child.name.startsWith(_3dMaster.ExitArrowBeginTag)) {
    //            const tagName = child.name.substring(beginLength);
    //            let data = datas[tagName];

    //            if (data) {
    //                data.begin = child;
    //            }
    //            else {
    //                data = { begin: child };
    //                datas[tagName] = data;
    //            }
    //        }
    //        else if (child.name.startsWith(_3dMaster.ExitArrowEndTag)) {
    //            const tagName = child.name.substring(endLength);
    //            let data = datas[tagName];

    //            if (data) {
    //                data.end = child;
    //            }
    //            else {
    //                data = { end: child };
    //                datas[tagName] = data;
    //            }
    //        }
    //    }

    //    const arrowDatas = [];

    //    for (const key in datas) {
    //        const data = datas[key];

    //        if (data.begin && data.end) {
    //            data.end.visible = false;
    //            const distance = Geometry.getDistance3(data.begin.position.x, data.begin.position.y, data.begin.position.z, data.end.position.x, data.end.position.y, data.end.position.z);
    //            arrowDatas.push([data.begin, new Vector3(data.begin.position.x, data.begin.position.y, data.begin.position.z), new Vector3(data.end.position.x, data.end.position.y, data.end.position.z), distance]);
    //        }
    //    }

    //    return arrowDatas;
    //}

    //static setCamera(camera, controls, cameraOptions) {
    //    if (camera?.position)
    //        camera.position.set(cameraOptions.position[0], cameraOptions.position[1], cameraOptions.position[2]);

    //    if (camera && cameraOptions && cameraOptions.quaternion)
    //        camera.quaternion.set(cameraOptions.quaternion[0], cameraOptions.quaternion[1], cameraOptions.quaternion[2], cameraOptions.quaternion[3]);

    //    if (camera?.rotation)
    //        camera.rotation.set(cameraOptions.rotation[0], cameraOptions.rotation[1], cameraOptions.rotation[2]);
    //    if (controls?.target)
    //        controls.target.set(cameraOptions.targetControl[0], cameraOptions.targetControl[1], cameraOptions.targetControl[2]);

    //    if (camera && cameraOptions) {
    //        camera.near = cameraOptions.near;
    //        camera.far = cameraOptions.far;
    //        camera.fov = cameraOptions.fov;
    //    }
    //}
}