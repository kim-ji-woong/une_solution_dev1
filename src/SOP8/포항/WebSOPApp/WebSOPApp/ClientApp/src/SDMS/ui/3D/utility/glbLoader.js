import { _3dMaster } from "./_3dMaster";
import * as THREE from "three/build/three.module.js";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";
import { DRACOLoader } from "three/examples/jsm/loaders/DRACOLoader.js";
import { FBXLoader } from "three/examples/jsm/loaders/FBXLoader.js";
import ProjectResource from "../../../../Root/resource/id";
import { AlarmManager } from "./alarmManager";

export class GlbLoader {
    //get AlarmManager() {
    //    return this.alarmManager;
    //}

    //constructor(timelog, scene, props, setState, master3d) {
    //    this.internalTryModels = {};

    //    this.outdoorModelCount = 0;
    //    this.completeOutdoorModelCount = 0;
    //    this.outdoorModelTotalCount = 0;
    //    this.indoorModelCount = 0;
    //    this.indoorModelCountTemp = 0;
    //    this.loadingSiteNos = [];
    //    this.siteOutdoorModels = {};
    //    this.outdoorFacilities = {};

    //    // 모델 파일별 Animation
    //    // Key : ModelFile Name
    //    // Value : AnimationModel
    //    this.modelAnimations = {};
    //    this.currentAnimationModels = [];

    //    // 외부모델보다 실내모델이 먼저 로딩되지 않도록 한다.
    //    this.tempIndoorModels = [];

    //    this.prevIndoorModel = null;
    //    this.currentIndoorModel = null;

    //    this.timelog = timelog;
    //    this.scene = scene;
    //    this.props = props;
    //    this.setState = setState;

    //    this.alarmManager = new AlarmManager();
    //    this._3dMaster = master3d;
    //}

    //loadOutdoorModelFiles(modelFiles, _3dOptions, visible) {
    //    /*if (!TextPOIManager.loadSpriteIconImage()) {
    //        setTimeout(() => this.loadOutdoorModelFiles(modelFiles, _3dOptions, visible), 500);
    //        return;
    //    }*/

    //    // 중복된 파일 제거
    //    modelFiles = this._removeDuplicate(modelFiles);

    //    this.timelog("Begin Loading");
    //    const fileCount = modelFiles.length;

    //    this.outdoorModelCount = fileCount;
    //    this.completeOutdoorModelCount = 0;

    //    if (fileCount > 0) {
    //        this.outdoorModelTotalCount = fileCount;
    //        this._loadRootModel(modelFiles[0], 1, modelFiles, _3dMaster.Mode_Outdoor_All, visible, _3dOptions);
    //    }

    //    this._loadComponentModels();
    //}

    //_loadComponentModels() {
    //    const contents = "Component/FakeWall.glb";
    //    const fileName = this.props._3dOptions.modelBaseURL + "/" + contents;
    //    const worldBox = new THREE.Box3();

    //    let loader = null;

    //    if (fileName.endsWith('.fbx')) {
    //        loader = new FBXLoader();
    //    } else if (fileName.endsWith('.glb') || fileName.endsWith('.gltf')) {
    //        loader = new GLTFLoader();
    //        // Optional: Provide a DRACOLoader instance to decode compressed mesh data
    //        const dracoLoader = new DRACOLoader();
    //        dracoLoader.setDecoderPath('/three/examples/js/libs/draco/');
    //        loader.setDRACOLoader(dracoLoader);
    //    }

    //    const worldPos = new THREE.Vector3();
    //    const worldScale = new THREE.Vector3();
    //    const worldQuat = new THREE.Quaternion();

    //    const _this = this;

    //    loader.load(fileName, function (object) {
    //        const obj = loader instanceof GLTFLoader ? object.scene : object;
    //        obj.traverse((child) => {
    //            child.getWorldPosition(worldPos);
    //            child.getWorldScale(worldScale);
    //            child.getWorldQuaternion(worldQuat);

    //            if (child instanceof THREE.Mesh) {
    //                child.castShadow = true;
    //                child.receiveShadow = true;
    //                worldBox.expandByObject(child);
    //            }
    //        });

    //        const modelNode = new THREE.Object3D();
    //        modelNode.add(obj);
    //        modelNode.matrixAutoUpdate = false;
    //        modelNode.name = contents;

    //        const fakeWall = _this._setModelVisible(modelNode, "fake_wall_002", true);

    //        if (fakeWall) {
    //            fakeWall.scale.set(2, 2, 2);
    //            //_this.fakeWallManager.setContents3D(fakeWall, _this);
    //        }

    //        modelNode.updateMatrixWorld(true);

    //        const boxSize = new THREE.Vector3();
    //        worldBox.getSize(boxSize);

    //        const sceneMaxLen = boxSize.length();
    //        const sceneHalfMaxLen = sceneMaxLen * 0.5;

    //        worldBox.getCenter(_this._3dMaster.dirLight.target.position);
    //        _this._3dMaster.dirLight.position.copy(_this._3dMaster.dirLight.target.position);

    //        const lightPos = new THREE.Vector3(sceneHalfMaxLen, sceneMaxLen, sceneHalfMaxLen);
    //        _this._3dMaster.dirLight.position.add(lightPos);

    //        const lightDistance = lightPos.length();

    //        _this._3dMaster.dirLight.shadow.camera.near = lightDistance - sceneHalfMaxLen;
    //        _this._3dMaster.dirLight.shadow.camera.far = lightDistance + sceneHalfMaxLen;
    //        _this._3dMaster.dirLight.shadow.camera.right = sceneHalfMaxLen;
    //        _this._3dMaster.dirLight.shadow.camera.left = -sceneHalfMaxLen;
    //        _this._3dMaster.dirLight.shadow.camera.top = sceneHalfMaxLen;
    //        _this._3dMaster.dirLight.shadow.camera.bottom = -sceneHalfMaxLen;
    //        _this._3dMaster.dirLight.shadow.camera.updateProjectionMatrix();
    //        _this._3dMaster.renderer.shadowMap.needsUpdate = true;
    //    });
    //}

    //_setModelVisible(obj, targetName, visible) {
    //    if (obj.name === targetName) {
    //        obj.visible = visible;
    //        return obj;
    //    }

    //    const childCount = obj.children.length;

    //    for (let i = 0; i < childCount; i++) {
    //        const _obj = this._setModelVisible(obj.children[i], targetName, visible);

    //        if (_obj) {
    //            return _obj;
    //        }
    //    }

    //    return null;
    //}

    //// 중복된 파일 제거
    //_removeDuplicate(files) {
    //    const fileMap = {};

    //    for (const fileName of files) {
    //        fileMap[fileName] = fileName;
    //    }

    //    const _files = [];

    //    for (const fileName in fileMap) {
    //        _files.push(fileName);
    //    }

    //    return _files;
    //}

    //_loadRootModel(contents, nextIndex, files, mode, visible, _3dOptions) {
    //    this.setState({ loading: true });

    //    const fileName = _3dOptions.modelBaseURL + "/" + contents;
    //    const worldBox = new THREE.Box3();

    //    let loader = null;

    //    if (fileName.endsWith('.fbx')) {
    //        loader = new FBXLoader();
    //    } else if (fileName.endsWith('.glb') || fileName.endsWith('.gltf')) {
    //        loader = new GLTFLoader();
    //        // Optional: Provide a DRACOLoader instance to decode compressed mesh data
    //        const dracoLoader = new DRACOLoader();
    //        dracoLoader.setDecoderPath('/three/examples/js/libs/draco/');
    //        loader.setDRACOLoader(dracoLoader);
    //    }

    //    const worldPos = new THREE.Vector3();
    //    const worldScale = new THREE.Vector3();
    //    const worldQuat = new THREE.Quaternion();

    //    const _this = this;
    //    const cameraOptions = _3dOptions.outdoorModel.camera;

    //    // 서로다른 Zone에서 같은 모델 파일을 로딩하는 경우 굳이 같은 파일을 여러번 로딩하지 않도록 한다.
    //    if (this.internalTryModels[contents]) {
    //        this._onCompleteOutdoorModelLoading(null, _3dOptions);

    //        if (nextIndex !== null && nextIndex !== undefined && files) {
    //            if (nextIndex < files.length) {
    //                for (let i = nextIndex; i < files.length; i++) {
    //                    this.loadFile(files[i], visible, null, _3dMaster.Mode_Outdoor_Part, _3dOptions);
    //                }
    //            }
    //        }

    //        return;
    //    }
    //    else {
    //        this.internalTryModels[contents] = true;
    //    }

    //    loader.load(fileName, function (object) {
    //        const obj = loader instanceof GLTFLoader ? object.scene : object;
    //        obj.traverse((child) => {
    //            child.getWorldPosition(worldPos);
    //            child.getWorldScale(worldScale);
    //            child.getWorldQuaternion(worldQuat);

    //            if (child instanceof THREE.Mesh) {
    //                child.castShadow = true;
    //                child.receiveShadow = true;

    //                const localBox = new THREE.Box3();
    //                localBox.expandByObject(child);
    //                GlbLoader._setWorldBox(localBox, worldBox, child);
    //            }
    //        });

    //        const isIndoor = _this.isIndoor();

    //        const modelNode = new THREE.Object3D();
    //        modelNode.add(obj);
    //        modelNode.matrixAutoUpdate = false;
    //        modelNode.name = contents;

    //        if (isIndoor) {
    //            modelNode.visible = false;
    //        }
    //        else {
    //            modelNode.visible = visible;
    //        }

    //        _this.scene.add(modelNode);
    //        modelNode.updateMatrixWorld(true);

    //        // AnimationModel이 있는지 확인한다.
    //        _this.loadAnimationModels(object, modelNode);

    //        _this._removeBoundingBoxShadow(modelNode);

    //        const boxSize = new THREE.Vector3();
    //        worldBox.getSize(boxSize);
    //        //_this.optionManager.setModelSize(contents, worldBox);

    //        const sceneMaxLen = boxSize.length();
    //        const sceneHalfMaxLen = sceneMaxLen * 0.5;

    //        worldBox.getCenter(_this._3dMaster.dirLight.target.position);
    //        _this._3dMaster.dirLight.position.copy(_this._3dMaster.dirLight.target.position);

    //        const lightPos = new THREE.Vector3(sceneHalfMaxLen, sceneMaxLen, sceneHalfMaxLen);
    //        _this._3dMaster.dirLight.position.add(lightPos);

    //        const lightDistance = lightPos.length();

    //        _this._3dMaster.dirLight.shadow.camera.near = lightDistance - sceneHalfMaxLen;
    //        _this._3dMaster.dirLight.shadow.camera.far = lightDistance + sceneHalfMaxLen;
    //        _this._3dMaster.dirLight.shadow.camera.right = sceneHalfMaxLen;
    //        _this._3dMaster.dirLight.shadow.camera.left = -sceneHalfMaxLen;
    //        _this._3dMaster.dirLight.shadow.camera.top = sceneHalfMaxLen;
    //        _this._3dMaster.dirLight.shadow.camera.bottom = -sceneHalfMaxLen;
    //        _this._3dMaster.dirLight.shadow.camera.updateProjectionMatrix();
    //        _this._3dMaster.renderer.shadowMap.needsUpdate = true;

    //        if (visible) {
    //            // .TODO: 실내 모델링을 로딩하지 않을 경우, 카메라 첫 외곽 이동 여부 체크
    //            if (_this._3dMaster.FirstIndoorNotOnMemoryCameraMove === false && _3dOptions.indoorModelOnMemory === false) {
    //                _this._3dMaster.FirstIndoorNotOnMemoryCameraMove = true;
    //            }

    //            _3dMaster.setCamera(_this._3dMaster.camera, _this._3dMaster.controls, cameraOptions);
    //        }

    //        if (isIndoor === false && visible) {
    //            _this._3dMaster.currentModel = modelNode;
    //        }

    //        _this._onCompleteOutdoorModelLoading(modelNode, _3dOptions);

    //        if (mode === _3dMaster.Mode_Outdoor_All || mode === _3dMaster.Mode_Outdoor_Part) {
    //            //_this.textPOIManager.addBuildingGroupText(_3dOptions.buildingGroups, _3dOptions.siteNo);
    //            _this.useBoundingBox = true;

    //            //_this.textPOIManager.addBuildingText(_3dOptions.buildingGroups, _3dOptions.buildings, _3dOptions.siteNo);
    //            _3dMaster.hideBoundingBoxes(modelNode, _3dOptions.buildingGroups, _3dOptions.buildings);
    //        }

    //        _this.setState({ loading: false });

    //        if (nextIndex !== null && nextIndex !== undefined && files) {
    //            if (nextIndex < files.length) {
    //                for (let i = nextIndex; i < files.length; i++) {
    //                    _this.loadFile(files[i], visible, null, _3dMaster.Mode_Outdoor_Part, _3dOptions);
    //                }
    //            }
    //        }

    //        if (isIndoor === false) {
    //            // 현재 사이트만 외곽 POI 불러오기
    //            if (_this.props.currentSiteNo === _3dOptions.siteNo) {
    //                //_this.poiManager.addOutdoorSensors(_3dOptions.outdoorZones, _3dOptions.zones, _this.props.visibleSensorTypes);

    //                // 외곽 공간 표시
    //                //_this.textPOIManager.updateOutdoorEquipZoneData(_3dOptions);

    //                let outdoorZoneNo = null;

    //                for (let zoneNo in _3dOptions.outdoorZones) {
    //                    zoneNo = Number(zoneNo);

    //                    if (zoneNo !== NaN && zoneNo !== 30000)
    //                        outdoorZoneNo = zoneNo;
    //                }

    //                // 외곽 공간영역 표시
    //                if (outdoorZoneNo !== null) {
    //                    //_this.equipZoneAreaManager.setZoneNo(outdoorZoneNo);
    //                }

    //                // 현재 뷰 외곽뷰 설정
    //                _this.props.setCurrentView(outdoorZoneNo);
    //            }

    //            // 외부영역의 가벽 로딩하기
    //            //_this.fakeWallManager.setZoneID(null);
    //            //_this.fakeWallManager.showFakeWalls();

    //            // 영역 생성 관련
    //            if (_this.equipZoneAreaManager) {
    //                _this.equipZoneAreaManager.showEquipZoneAreas();
    //            }
    //        }
    //    });
    //}

    //// BoundingBox 모델의 그림자를 없앤다.
    //_removeBoundingBoxShadow(modelNode) {
    //    if (modelNode.name.endsWith(_3dMaster.BoundingBoxTag)) {
    //        modelNode.castShadow = false;
    //        modelNode.receiveShadow = false;
    //    }

    //    const childCount = modelNode.children.length;

    //    for (let i = 0; i < childCount; i++) {
    //        const child = modelNode.children[i];
    //        this._removeBoundingBoxShadow(child);
    //    }
    //}

    //_onCompleteOutdoorModelLoading(modelNode, _3dOptions) {
    //    this.completeOutdoorModelCount = this.completeOutdoorModelCount + 1;

    //    if (this.completeOutdoorModelCount >= this.outdoorModelCount) {
    //        // 알람모델은 한번만 로딩하면 된다.
    //        if (_3dOptions.siteNo === ProjectResource.siteNo.toString()) {
    //            this.alarmManager.loadAlarmModels(_3dOptions);
    //        }

    //        this.props.onCompleteOutdoorModelLoading(_3dOptions.siteID);

    //        if (this.props.multiSite && this.outdoorModelTotalCount > 0) {
    //            const rate = this.completeOutdoorModelCount / this.outdoorModelTotalCount * 100;

    //            if (rate >= 100) {
    //                this.setState({ progressValue: rate, progressActive: false });
    //            } else {
    //                this.setState({ progressValue: rate });
    //            }
    //        } else if (ProjectResource.IsMultiSite === true && this.state.progressValue === 0) {
    //            // MultiSite 경우이면서, 계정 권한으로 site 하나만 볼 수 있을 경우
    //            const rate = this.completeOutdoorModelCount / this.outdoorModelCount * 100;

    //            if (rate >= 100) {
    //                this.setState({ progressValue: rate, progressActive: false });
    //            } else {
    //                this.setState({ progressValue: rate });
    //            }
    //        }

    //        if (_3dOptions.indoorModelOnMemory) {
    //            this.loadIndoorModels(_3dOptions);
    //        }
    //        else {
    //            this._clearTempIndoorModels();
    //        }
    //    }

    //    if (modelNode) {
    //        const oldModel = this._checkExistOutdoorModel(modelNode, _3dOptions.siteNo);

    //        if (oldModel) {
    //            // 같은 모델이 이미 존재한다면 신규모델을 삭제하고 기존모델을 사용한다.
    //            modelNode.parent.remove(modelNode);
    //            modelNode = oldModel;
    //        }

    //        let outdoorModels = this.siteOutdoorModels[_3dOptions.siteNo];

    //        if (!outdoorModels) {
    //            outdoorModels = [];
    //            outdoorModels = this._setSiteOutdoorModels(_3dOptions.siteNo, outdoorModels);
    //        }

    //        outdoorModels.push(modelNode);

    //        const animationModel = this.modelAnimations[modelNode.name];

    //        if (animationModel) {
    //            // 외부 모델들을 불러오는 도중이다.
    //            // 하나씩 외부 모델들이 추가된다.
    //            this.currentAnimationModels.push(animationModel);
    //        }
    //    }
    //}

    //_setSiteOutdoorModels(siteNo, outdoorModels) {
    //    if (!this.siteOutdoorModels[siteNo]) {
    //        this.siteOutdoorModels[siteNo] = outdoorModels;
    //    }

    //    return this.siteOutdoorModels[siteNo];
    //}

    //_checkExistOutdoorModel(modelNode, currentSiteNo) {
    //    const siteOutdoorModels = { ...this.siteOutdoorModels };

    //    for (const siteNo in siteOutdoorModels) {
    //        if (siteNo === currentSiteNo) {
    //            continue;
    //        }

    //        const outdoorModels = siteOutdoorModels[siteNo];

    //        for (const outdoorModel of outdoorModels) {
    //            if (outdoorModel.name === modelNode.name) {
    //                return outdoorModel;
    //            }
    //        }
    //    }

    //    return null;
    //}

    //_clearTempIndoorModels() {
    //    for (const modelData of this.tempIndoorModels) {
    //        this._addIndoorModel(modelData[0], modelData[1], modelData[2], modelData[3], modelData[4], modelData[5], modelData[6], modelData[7]);
    //    }
    //}

    //// 실내공간 로딩
    //async loadIndoorModels(_3dOptions) {
    //    for (const buildingGroupName in _3dOptions.indoorModels) {
    //        const buildingGroup = _3dOptions.indoorModels[buildingGroupName];

    //        for (const buildingName in buildingGroup) {
    //            const building = buildingGroup[buildingName];

    //            if (building && building.floors) {
    //                const floorCount = building.floors.length;

    //                for (let i = 0; i < floorCount; i++) {
    //                    const floor = building.floors[i];

    //                    if (floor.file && floor.camera) {
    //                        this.addEquipZoneText(floor.zoneID, _3dOptions);
    //                        this.loadFile(floor.file, false, floor.camera, _3dMaster.Mode_Indoor, _3dOptions);
    //                    }
    //                }
    //            }
    //        }
    //    }
    //}

    //addEquipZoneText(zoneID, _3dOptions) {
    //    const zone = _3dOptions.zones[zoneID];

    //    if (zone && zone.equipZones) {
    //        //this.textPOIManager.addEquipZoneText(zoneID, zone.equipZones, _3dOptions.siteID);
    //    }
    //}

    //loadFile(contents, visible, cameraOptions, mode, _3dOptions, postMethod = null, postMethodParam = null) {
    //    if (visible) {
    //        this.setState({ loading: true });
    //    }

    //    const fileName = _3dOptions.modelBaseURL + "/" + contents;
    //    const worldBox = new THREE.Box3();

    //    let loader = null;

    //    if (fileName.endsWith('.fbx')) {
    //        loader = new FBXLoader();
    //    } else if (fileName.endsWith('.glb') || fileName.endsWith('.gltf')) {
    //        loader = new GLTFLoader();
    //        // Optional: Provide a DRACOLoader instance to decode compressed mesh data
    //        const dracoLoader = new DRACOLoader();
    //        dracoLoader.setDecoderPath('/three/examples/js/libs/draco/');
    //        loader.setDRACOLoader(dracoLoader);
    //    }

    //    // 서로다른 Zone에서 같은 모델 파일을 로딩하는 경우 굳이 같은 파일을 여러번 로딩하지 않도록 한다.
    //    if (mode !== _3dMaster.Mode_Indoor && this.internalTryModels[contents]) {
    //        if (mode === _3dMaster.Mode_Outdoor_Part/*visible*/) {
    //            this._onCompleteOutdoorModelLoading(null, _3dOptions);
    //        }

    //        this._onAfterLoadFile(contents, _3dOptions, mode, postMethod, postMethodParam);
    //        return;
    //    }
    //    else {
    //        this.internalTryModels[contents] = true;
    //    }

    //    const _this = this;
        
    //    loader.load(fileName, function (object) {
    //        const obj = loader instanceof GLTFLoader ? object.scene : object;
    //        obj.traverse((child) => {
    //            if (child instanceof THREE.Mesh) {
    //                child.castShadow = mode !== Contents3D.Mode_Indoor;
    //                child.receiveShadow = mode !== Contents3D.Mode_Indoor;
                    
    //                const localBox = new THREE.Box3();
    //                localBox.expandByObject(child);
    //                GlbLoader._setWorldBox(localBox, worldBox, child);
    //            }
    //        });

    //        const modelNode = new THREE.Object3D();
    //        modelNode.add(obj);
    //        modelNode.matrixAutoUpdate = false;
    //        modelNode.name = contents;

    //        //_this.optionManager.setModelSize(modelNode.name, worldBox);

    //        if (_this._3dMaster.isIndoor() && mode !== _3dMaster.Mode_Indoor) {
    //            // 실내모드일 경우 외부모델 파일을 로딩하면 무조건 안보이도록 한다.
    //            modelNode.visible = false;
    //        }
    //        else {
    //            modelNode.visible = visible;
    //        }

    //        if (mode === _3dMaster.Mode_Indoor && _this.completeOutdoorModelCount === 0) {
    //            // 아직 외부영역이 로딩되지 않았다.
    //            _this.tempIndoorModels.push([modelNode, mode, object, _3dOptions, contents, postMethod, postMethodParam, cameraOptions]);
    //        }
    //        else {
    //            _this._addIndoorModel(modelNode, mode, object, _3dOptions, contents, postMethod, postMethodParam, cameraOptions);
    //        }
    //    });
    //}

    //_addIndoorModel(modelNode, mode, object, _3dOptions, contents, postMethod, postMethodParam, cameraOptions) {
    //    this.scene.add(modelNode);
    //    modelNode.updateMatrixWorld(true);

    //    // AnimationModel이 있는지 확인한다.
    //    this.loadAnimationModels(object, modelNode);

    //    if (mode === _3dMaster.Mode_Outdoor_All || mode === _3dMaster.Mode_Outdoor_Part) {
    //        _3dMaster.hideBoundingBoxes(modelNode, _3dOptions.buildingGroups, _3dOptions.buildings);
    //    }

    //    if (mode === _3dMaster.Mode_Outdoor_Part/*visible*/) {
    //        this._onCompleteOutdoorModelLoading(modelNode, _3dOptions);

    //        const facilityGroup = _3dMaster.showFacilities(modelNode, false, this.facilityMaps);

    //        if (facilityGroup) {
    //            this.outdoorFacilities[contents] = facilityGroup;
    //        }
    //    }
    //    else {
    //        const exitArrowData = _3dMaster.showExit(modelNode, false);
    //        this._3dMaster.internalModels[contents] = [modelNode, cameraOptions, exitArrowData && exitArrowData.length >= 1 ? exitArrowData[0] : null, exitArrowData && exitArrowData.length >= 2 ? exitArrowData[1] : null];

    //        const facilityGroup = _3dMaster.showFacilities(modelNode, false, this.facilityMaps);
    //        this._3dMaster.internalModels[contents].push(facilityGroup);
    //    }

    //    this._onAfterLoadFile(contents, _3dOptions, mode, postMethod, postMethodParam);
    //    this.timelog(contents);
    //}

    //static _setWorldBox(localBox, worldBox, mesh) {
    //    let parent = mesh.parent;

    //    while (parent) {
    //        localBox.max.x += parent.position.x;
    //        localBox.max.y += parent.position.y;
    //        localBox.max.z += parent.position.z;

    //        localBox.min.x += parent.position.x;
    //        localBox.min.y += parent.position.y;
    //        localBox.min.z += parent.position.z;

    //        parent = parent.parent;
    //    }

    //    if (Number.isFinite(worldBox.max.x) === false) {
    //        worldBox.max.x = localBox.max.x;
    //        worldBox.max.y = localBox.max.y;
    //        worldBox.max.z = localBox.max.z;

    //        worldBox.min.x = localBox.min.x;
    //        worldBox.min.y = localBox.min.y;
    //        worldBox.min.z = localBox.min.z;
    //    }
    //    else {
    //        if (worldBox.max.x < localBox.max.x)
    //            worldBox.max.x = localBox.max.x;
    //        if (worldBox.max.y < localBox.max.y)
    //            worldBox.max.y = localBox.max.y;
    //        if (worldBox.max.z < localBox.max.z)
    //            worldBox.max.z = localBox.max.z;

    //        if (worldBox.min.x > localBox.min.x)
    //            worldBox.min.x = localBox.min.x;
    //        if (worldBox.min.y > localBox.min.y)
    //            worldBox.min.y = localBox.min.y;
    //        if (worldBox.min.z > localBox.min.z)
    //            worldBox.min.z = localBox.min.z;
    //    }
    //}

    //_onAfterLoadFile(contents, _3dOptions, mode, postMethod, postMethodParam) {
    //    if (mode === _3dMaster.Mode_Indoor && this.indoorModelCount > 0) {

    //        // 실내모델이 미리 로딩된 경우만 카운팅
    //        if (_3dOptions.indoorModelOnMemory)
    //            this.indoorModelCountTemp++;

    //        const rate = this.indoorModelCountTemp / this.indoorModelCount * 100;

    //        if (this.indoorModelCountTemp === this.indoorModelCount) {
    //            //this.optionManager.onLoadingComplete(this.props.currentView?.zoneID, this.props.currentView.buildingID === null, this.currentModel?.name);
    //            this.setState({ progressValue: rate, progressActive: false });

    //            if (_3dOptions.indoorModelOnMemory) {
    //                // 실내 모델을 메모리에 미리 로딩해 놓고 필요할때 꺼내어 쓰는 경우
    //                this.loadNextSiteModels();
    //                // 실내 모델이 로딩되지 않아서 표시하지 못했던 알람정보를 표현한다.
    //                this.alarmManager.showLazyAlarmData();
    //            }
    //        }
    //        else if (_3dOptions.indoorModelOnMemory === false) {
    //            // 실내모델이 미리 로딩되지 않은 경우

    //            // 실내모델 파일 로딩이 끝나지 않아서 못한 카메라 셋팅
    //            this._3dMaster.showLazyMovingCamera();

    //            // 실내모델 파일 로딩이 끝나지 않아서 보여주지 못했던 층 정보(textPOI, SensorPOI 등)
    //            this._3dMaster.showLazyIndoorData();

    //            // 실내모델이 미리 로딩되지 않아서 보여주지 못한 알람 모델링
    //            this.alarmManager.showLazyAlarmModel(contents);
    //        }
    //        else {
    //            this.setState({ progressValue: rate });
    //        }
    //    }

    //    this.setState({ loading: false });

    //    if (postMethod) {
    //        if (postMethodParam !== null) {
    //            postMethod(postMethodParam);
    //        }
    //        else {
    //            postMethod();
    //        }
    //    }
    //}

    //loadSiteNo(siteNo) {
    //    this.loadingSiteNos.push(siteNo);
    //}

    //loadNextSiteModels() {
    //    for (const siteNo in this.props.site3dOptions) {
    //        if (this.loadingSiteNos.includes(siteNo) === false) {
    //            this.loadingSiteNos.push(siteNo);

    //            const _3dOptions = this.props.site3dOptions[siteNo];

    //            if (_3dOptions) {
    //                const modelFiles = _3dMaster.getOutdoorModelFiles(_3dOptions);
    //                this.loadOutdoorModelFiles(modelFiles, _3dOptions, false);
    //                return;
    //            }
    //        }
    //    }
    //}

    //setIndoorModelCount() {
    //    let fileCount = 0;
    //    const _3dOptions = this.props._3dOptions;

    //    if (_3dOptions) {
    //        for (const buildingGroupName in _3dOptions.indoorModels) {
    //            const buildingGroup = _3dOptions.indoorModels[buildingGroupName];

    //            for (const buildingName in buildingGroup) {
    //                const building = buildingGroup[buildingName];

    //                if (building && building.floors) {
    //                    const floorCount = building.floors.length;

    //                    for (let i = 0; i < floorCount; i++) {
    //                        const floor = building.floors[i];

    //                        if (floor.file && floor.camera) {
    //                            fileCount++;
    //                        }
    //                    }
    //                }
    //            }
    //        }
    //    }

    //    this.indoorModelCount = fileCount;
    //}

    //getSiteOutdoorModels(siteNo) {
    //    return this.siteOutdoorModels[siteNo];
    //}

    //loadAnimationModels(object, modelNode) {
    //    if (!object?.animations) {
    //        return;
    //    }

    //    if (object.animations.length > 0) {
    //        const mixer = new THREE.AnimationMixer(modelNode);

    //        for (let i = 0; i < object.animations.length; i++) {
    //            mixer.clipAction(object.animations[i]).play();;
    //        }

    //        const animationModel = new AnimationModel(mixer, modelNode);
    //        this.modelAnimations[modelNode.name] = animationModel;
    //    }
    //}
}
