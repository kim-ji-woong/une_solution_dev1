import * as THREE from "three/build/three.module.js";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";
import { DRACOLoader } from "three/examples/jsm/loaders/DRACOLoader.js";
import { FBXLoader } from "three/examples/jsm/loaders/FBXLoader.js";
import { AnimationModel } from "./animationModel";
import { PoiManager } from "../poi/poiManager.js";

import { _3dMaster } from "./_3dMaster";
import SdmsResource from '../../../resource/id';


export class FacilityManager {
    static PipeHeadTag = "pipe-";
    static PipeGroupHeadTag = "pipeGroup-";
    static PipeColor_Normal = 0x16E5F8;

    static T2_13_2F = 72;
    static Facility_Pre = 300701;
    static Facility_Post = 300702;
    static Facility_Power = 300703;

    static T2_13_2F_HIGHT_ADD = 13;

    constructor(timelog, scene, props, setState, master3d) {
        this.timelog = timelog;
        this.scene = scene;
        this.props = props;
        this.setState = setState;
        this._3dMaster = master3d;

        this.modelLayer = null;

        this.facilityMaps = [];

        this.currentAnimationModels = [];
    }

    static FormatChange(faModels) {
        if (faModels?.length > 0) {
            for (var model of faModels) {

                // camera 데이터 생성
                if (!model.camera && 
                    (model.camera_lc_x && model.camera_lc_y && model.camera_lc_z && model.camera_rtate_x && model.camera_rtate_y && model.camera_rtate_z &&
                        model.orbit_x && model.orbit_y && model.orbit_z && model.far && model.fov && model.near)) {
                    model.camera = {
                        far: model.far,
                        fov: model.fov,
                        near: model.near,
                        orbit: [model.orbit_x, model.orbit_y, model.orbit_z],
                        position: [model.camera_lc_x, model.camera_lc_y, model.camera_lc_z],
                        rotation: [model.camera_rtate_x, model.camera_rtate_y, model.camera_rtate_z]
                    };
                }

                // zone data 조회 및 zone camera 데이터 생성
                if (model.zoneData?.length > 0) {
                    for (var zone of model.zoneData) {
                        if (!zone.camera &&
                            (zone.camera_lc_x && zone.camera_lc_y && zone.camera_lc_z && zone.camera_rtate_x && zone.camera_rtate_y && zone.camera_rtate_z &&
                                zone.orbit_x && zone.orbit_y && zone.orbit_z && zone.far && zone.fov && zone.near)) {
                            zone.camera = {
                                far: zone.far,
                                fov: zone.fov,
                                near: zone.near,
                                orbit: [zone.orbit_x, zone.orbit_y, zone.orbit_z],
                                position: [zone.camera_lc_x, zone.camera_lc_y, zone.camera_lc_z],
                                rotation: [zone.camera_rtate_x, zone.camera_rtate_y, zone.camera_rtate_z]
                            };
                        }                        
                    }
                }
            }
        }

        return faModels;
    }

    LoadFile() {
        const faModel = this.props.faModel;
        const gltfOptions = this.props.gltfOptions;

        if (faModel?.length > 0) {
            for (var model of faModel) {
                this.loadFile(model.model_file, gltfOptions, model);
            }
        }
    }
    
    loadFile(contents, gltfOptions, model) {

        const contentsFile = contents.fileName ? contents.fileName : contents;
        const fileName = gltfOptions.modelBaseUrl + "/" + contentsFile;
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

        const _this = this;
        let _model = model;

        loader.load(fileName, function (object) {
            const obj = loader instanceof GLTFLoader ? object.scene : object;
            obj.traverse((child) => {
                if (child instanceof THREE.Mesh) {
                    // 실내 모델이기 때문에 그림자 없음
                    child.castShadow = false;
                    child.receiveShadow = false;

                    // 설비모드 투명도 조절
                    child.material.opacity = 0.4;

                    // 파이프 색상 조절
                    if (child.name.startsWith(FacilityManager.PipeHeadTag)) {
                        child.material.color.set(FacilityManager.PipeColor_Normal);

                        // .TODO: 중간시연 빨간 색상
                        //if (child.name === "pipe-T2-13-1floor") {
                        //    child.material.color.set("red");
                        //}
                        
                    }

                    const localBox = new THREE.Box3();
                    localBox.expandByObject(child);
                    FacilityManager._setWorldBox(localBox, worldBox, child);
                }
            });

            const modelNode = new THREE.Object3D();
            modelNode.add(obj);
            modelNode.matrixAutoUpdate = false;
            modelNode.name = contentsFile;

            let zoneNos = [];
            if (_model.zoneData?.length > 0) {
                for (let zoneInfo of _model.zoneData) {
                    zoneNos.push(zoneInfo.zone_sn);
                }
            }
          
            modelNode.userData.isIndoor = true;
            modelNode.userData.zoneNo = zoneNos;
            modelNode.userData.siteNo = _model.siteNo;
            modelNode.userData.gltf_fclty_zone_model_sn = _model.gltf_fclty_zone_model_sn;

            _model.modelNode = modelNode;

            //_this.props.addModelNode(modelNode, contentsFile);

            // 처음 로드할 경우 숨김처리
            modelNode.visible = false;

            // 설비 바운딩 박스 숨김처리
            //_3dMaster.hideBoundingBoxes(modelNode);
            FacilityManager.showFacilities_Fclty(modelNode, false, _this.facilityMaps);

            // AnimationModel이 있는지 확인한다.
            const animationModels = _this.loadAnimationModels(object, modelNode);
            if (animationModels) {
                modelNode.userData.animationModels = animationModels;
            }

            // 레이어 추가
            _this.getModelLayer().add(modelNode);
        });
    }

    getModelLayer() {
        let modelLayer = this.modelLayer;

        if (!modelLayer) {
            modelLayer = new THREE.Object3D();
            modelLayer.matrixAutoUpdate = false;
            modelLayer.name = "modelLayer_Facility";

            this.scene.add(modelLayer);
        }

        return modelLayer;
    }

    static getModel(fcltyNo, zoneNo, faModels) {
        let modelData = null;

        if (faModels?.length > 0 && fcltyNo > 0) {
            const faModel = faModels.find(x => x.gltf_fclty_zone_model_sn === fcltyNo);
            if (faModel) {
                // 해당 존 제외하고 숨김
                let selNodeName = null;

                let camera = faModel.camera;
                if (zoneNo != null && faModel.zoneData?.length > 0) {

                    const zone = faModel.zoneData.find(x => x.zone_sn === zoneNo);
                    if (zone) {
                        // 해당 존 카메라
                        camera = zone.camera;

                        // 해당 존 제외하고 숨김
                        selNodeName = zone.zoneName;                       
                    }                    
                }

                // modelNode 조절
                if (faModel.modelNode?.children?.length > 0 && faModel.modelNode?.children[0].children?.length > 0) {
                    const modelGroup = faModel.modelNode.children[0].children;

                    for (let mode of modelGroup) {
                        if (selNodeName === null || selNodeName === mode.name) {
                            mode.visible = true;
                        }
                        else {
                            mode.visible = false;
                        }
                    }
                }

                const data = {
                    file: faModel.model_file,
                    camera: camera
                };

                modelData = {
                    model: data,
                    modelNode: faModel.modelNode,
                    postMethod: null,
                    params: null
                };
            }            
        }

        return modelData;
    }

    static _setWorldBox(localBox, worldBox, mesh) {
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

    static showFacilities_Fclty(modelNode, visible, facilityMaps) {
        const childCount = modelNode.children.length;

        if (modelNode.name.startsWith(_3dMaster.FacilityHeadTag) && modelNode.name.endsWith(_3dMaster.BoundingBoxTag)) {
            for (let i = 0; i < childCount; i++) {
                const child = modelNode.children[i];

                //child.userData.isAlarmBounding = false;

                facilityMaps.push(child);
                //facilityMaps[child.name] = child;

                if (visible === true || visible === false) {
                    child.visible = visible;
                }                
            }

            return;
        }

        for (let i = 0; i < childCount; i++) {
            //const child = _3dMaster.showFacilities(modelNode.children[i], visible, facilityMaps);
            FacilityManager.showFacilities_Fclty(modelNode.children[i], visible, facilityMaps);

            //if (child !== null) {
            //    return child;
            //}
        }

        return;
    }

    selectFcltBoundingBox(modelName) {
        let object = this.facilityMaps.find(x => x.name == modelName);    //name = "equipment-T2-13-1F-004"
        if (object) {
            // 바운더리 박스 선택
            object.visible = true;
            this._3dMaster.selectFacility(object);
        }
    }

    static findFacility(modelNode, facilityName) {
        if (modelNode) {
            if (modelNode.children.length > 0) {
                for (const child of modelNode.children[0].children) {
                    if (child.name.startsWith("arrow")) {
                        continue;
                    }
                    else {
                        const facilityParent = FacilityManager.getFacilityParentModel(child);

                        if (facilityParent) {
                            return FacilityManager.findModel(facilityParent, facilityName);
                        }
                    }
                }
            }
        }

        return null;
    }

    static findModel(modelNode, childName) {
        for (const child of modelNode.children) {
            if (child.name === childName) {
                return child;
            }
        }

        return null;
    }

    static getFacilityParentModel(modelNode) {
        for (const child of modelNode.children) {
            if (child.name.startsWith("equipment-")) {
                return child;
            }
        }

        return null;
    }
    
    static getFacilities(modelNode, zoneName) {
        let childCount = modelNode.children.length;
        let facilities = [];

        // 그룹 >> 개별 층 노드 >> 설비 그룹
        if (childCount != 1) {
            return facilities;
        }

        const zoneNodes = modelNode.children[0];
        childCount = zoneNodes.children.length;

        for (let i = 0; i < childCount; i++) {
            const zoneNode = zoneNodes.children[i];

            if (zoneName != null && zoneNode.name !== zoneName) {
                continue;
            }

            FacilityManager.showFacilities_Fclty(zoneNode, null, facilities);
        }

        return facilities;
    }
    
    static getModelNode(fcltyNo, zoneNo, faModels) {
        let modelData = null;

        if (faModels?.length > 0 && fcltyNo > 0) {
            const faModel = faModels.find(x => x.gltf_fclty_zone_model_sn === fcltyNo);
            let zoneName = null;

            if (zoneNo > 0 && faModel?.zoneData?.length > 0) {
                const zone = faModel.zoneData.find(x => x.zone_sn === zoneNo);
                if (zone) {
                    zoneName = zone.zoneName;
                }
            }

            const facilities = FacilityManager.getFacilities(faModel.modelNode, zoneName);
            const facilityGroup = {
                children: facilities
            };

            modelData = [faModel.modelNode, faModel.camera, null, null, facilityGroup];
        }

        return modelData;
    }

    static prevFcltyToIndoor(params) {
        if (params && params.length >= 3) {
            const currentModel = params[0];            
            const nextModel = params[1];
            const _this = params[2];

            const siteNo = currentModel.userData.siteNo;
            const nextZoneNos = nextModel.userData.zoneNo;

            if (_this.poiManager) {
                // 카메라 이동후에 새로 추가한다.
                if (nextZoneNos?.length > 0) {
                    for (const nextZoneNo of nextZoneNos) {
                        _this.props.spatialManager.updateZone(siteNo, nextZoneNo);
                    }
                }                
                _this.poiManager.removeSensors(null);
            }

            if (_this.textPoiManager) {
                _this.textPoiManager.clearText(null);
            }

            // 설비모드 애니메이션 초기화
            if (_this.facilityManager.currentAnimationModels?.length > 0) {
                _this.facilityManager.currentAnimationModels = [];
            }
        }
    }

    static postFcltyToIndoor(params) {
        if (params && params.length >= 3) {
            const currentModel = params[0];
            const siteNo = currentModel.userData.siteNo;
            const nextModel = params[1];
            const _this = params[2];


            if (currentModel.userData.isIndoor === true) {
                currentModel.visible = false;
            }
            else {
                const site = _this.props.spatialManager.getSite(siteNo);
                _3dMaster.showSite(site, false, _this);
            }
           
            nextModel.visible = true;
            _this.currentModel = nextModel;


            // 설비 네임택 올리기 >> 네임택에서 POI 변경
            // 해당 존 설비 네임택 불러오기 >> POI 불러오기
            const faModels = _this.props.faModel;
            const selFcltyInfo = _this.props.selFcltyInfo;

            const zoneNo = selFcltyInfo.zoneNo;            

            const fcltys = [];

            const faModel = faModels.find(x => x.gltf_fclty_zone_model_sn === selFcltyInfo.fcltyNo);
            if (faModel?.zoneData?.length > 0) {
                // 구역명 레이어 ON
                if (_this.textPoiManager) {
                    _this.textPoiManager.showIndoorText();
                }

                // 알람 바운딩 박스 초기화                   
                if (_this.facilityManager?.facilityMaps?.length > 0) {
                    // 알람 처리 초기화
                    const boxs = _this.facilityManager.facilityMaps.filter(x => x.userData.isAlarmBounding === true);
                    if (boxs?.length > 0) {
                        for (const box of boxs) {
                            box.userData.isAlarmBounding = false;
                        }
                    }
                }

                for (const zone of faModel.zoneData) {
                    if (zoneNo !== null && zoneNo !== zone.zone_sn)
                        continue;

                    const zoneData = _this.props.spatialManager?.getZone(zone.zone_sn);

                    // 층별 구역명 올리기
                    if (_this.textPoiManager) {
                        //_this.props.spatialManager.postLoadingEquipZones(_3dMaster.funcAddEquipZoneText, [zone.zone_sn, _this]);
                        const _zone = _this.props.spatialManager.getZone(zone.zone_sn);

                        for (const equipZone of _zone?.equipmentZoneDatas) {
                            const _equipZone = structuredClone(equipZone); // 깊은 복사

                            if (zoneData.zoneNo === FacilityManager.T2_13_2F) {
                                // 높이 조절 필요
                                _equipZone.y += FacilityManager.T2_13_2F_HIGHT_ADD;
                            }

                            _this.textPoiManager._addEquipZoneText(_equipZone.displayText, _equipZone);
                        }
                    }


                    // 층별 센서 올리기
                    if (zoneData?.sensors) {
                        const alarmSensorNoMaps = _this.poiManager?.getAlarmSensorNos(zone.zone_sn);

                       
                        

                        for (const typeName in zoneData.sensors) {
                            if ((PoiManager.Equipment_Predict.includes(typeName) && (faModel.fclty_type_code === FacilityManager.Facility_Pre || faModel.fclty_type_code === FacilityManager.Facility_Post))
                                || (PoiManager.Equipment_Power.includes(typeName) && faModel.fclty_type_code === FacilityManager.Facility_Power)) {
                                const sensors = zoneData.sensors[typeName];

                                const _sensors = structuredClone(sensors); // 깊은 복사
                                if (zoneData.zoneNo === FacilityManager.T2_13_2F) {
                                    for (const _sensorData of _sensors) {
                                        const sensor = _sensorData.sensor;
                                        // 층 높이 추가
                                        sensor.y += FacilityManager.T2_13_2F_HIGHT_ADD;
                                    }
                                }

                                // 설비 POI 추가
                                _this.poiManager?.addSensors(_sensors, alarmSensorNoMaps, _this.props.visibleSensorTypes, zoneData.buildingNo !== null && zoneData.buildingNo !== undefined);

                                // 알람 센서에 해당하는 바운딩 박스 선택
                                if (_this.facilityManager?.facilityMaps?.length > 0) {
                                    const fcltyInfos = _this.props.fcltyInfos;

                                    for (const _sensorData of _sensors) {
                                        const sensor = _sensorData.sensor;

                                        const chkAlarm = alarmSensorNoMaps[sensor.sensor_sn];
                                        if (!chkAlarm)
                                            continue;

                                        const fcltyInfo = fcltyInfos.find(x => x.sensor_sn === sensor.sensor_sn);

                                        if (fcltyInfo?.fclty_presv_model_name?.length > 0) {
                                            const object = _this.facilityManager.facilityMaps.find(x => x.name === fcltyInfo.fclty_presv_model_name);
                                            if (object) {
                                                object.userData.isAlarmBounding = true;
                                                object.visible = true;
                                            }
                                        }
                                    }
                                }
                            }                            
                        }
                    }
                }
            }

            // 해당 모델 애니메이션 실행
            if (nextModel.userData?.animationModels?.length > 0) {
                _this.facilityManager.currentAnimationModels = nextModel.userData.animationModels;
            }

            if (_this.textPoiManager) {
                _this.textPoiManager.initZoomValue();
            }

        }
    }

    loadAnimationModels(object, modelNode) {
        //let modelAnimations = {};
        let modelAnimations = [];

        if (!object?.animations) {
            return modelAnimations;
        }

        if (object.animations.length > 0) {
            const mixer = new THREE.AnimationMixer(modelNode);

            for (let i = 0; i < object.animations.length; i++) {
                mixer.clipAction(object.animations[i]).play();;
            }

            const animationModel = new AnimationModel(mixer, modelNode);
            //modelAnimations[modelNode.name] = animationModel;
            modelAnimations.push(animationModel);
        }

        return modelAnimations;
    }

    setFcltyModel = (_3dMaster, selFcltyInfo, isFirst = true) => {
        if (selFcltyInfo.fcltyNo > 0) {
            const currentModel = this._3dMaster.currentModel;
            const faModels = this.props.faModel;

            // 모델링 불러오는 타이밍이 안맞아서 예외처리 >> 다시 불러오기
            if (currentModel.userData.gltf_fclty_zone_model_sn !== selFcltyInfo.fcltyNo && isFirst === true) {
                // 다시 불러오기 
                setTimeout(() => this.setFcltyModel(_3dMaster, selFcltyInfo, false), 1000);
                return;
            }

            if (_3dMaster.poiManager) {
                // 카메라 이동후에 새로 센서 POI 추가한다.
                _3dMaster.poiManager.removeSensors(null);
            }

            let selNodeName = null;
            let modelCamera = null;

            const faModel = faModels.find(x => x.gltf_fclty_zone_model_sn === selFcltyInfo.fcltyNo);
            if (!faModel)
                return;
            else if (!(currentModel?.children?.length > 0 && currentModel?.children[0].children?.length > 0))
                return;

            // 알람 바운딩 박스 초기화                   
            if (_3dMaster.facilityManager?.facilityMaps?.length > 0) {
                // 알람 처리 초기화
                const boxs = _3dMaster.facilityManager.facilityMaps.filter(x => x.userData.isAlarmBounding === true);
                if (boxs?.length > 0) {
                    for (const box of boxs) {
                        box.userData.isAlarmBounding = false;
                    }
                }
            }

            // 카메라 추출
            modelCamera = faModel.camera;
            
            if (selFcltyInfo.zoneNo > 0 && faModel.zoneData?.length > 0) {                
                const zone = faModel.zoneData.find(x => x.zone_sn === selFcltyInfo.zoneNo);
                if (zone) {
                    selNodeName = zone.zoneName;
                    modelCamera = zone.camera;
                }
            }

            // modelNode 조절
            const modelGroup = currentModel.children[0].children;

            for (let mode of modelGroup) {
                if (selNodeName === null || selNodeName === mode.name) {
                    mode.visible = true;
                }
                else {
                    mode.visible = false;
                }
            }

            // 공정 흐름도 표시 여부 
            if (selFcltyInfo.useFlow === true) {
                FacilityManager.showFcltyPipeGroup(currentModel, true);
            }
            else {
                FacilityManager.showFcltyPipeGroup(currentModel, false);
            }


            // 설비 네임택 초기화
            if (this._3dMaster.textPoiManager) {
                this._3dMaster.textPoiManager.clearText(null);
            }

            // 해당 층 설비 네임택 불러오기 >> POI 불러오기
            const zoneNo = selFcltyInfo.zoneNo;
            const fcltys = [];

            if (faModel.zoneData?.length > 0) {
                // 구역명 레이어 ON
                if (_3dMaster.textPoiManager) {
                    _3dMaster.textPoiManager.showIndoorText();
                }

                for (const zone of faModel.zoneData) {
                    if (zoneNo !== null && zoneNo !== zone.zone_sn)
                        continue;
                   
                    const zoneData = _3dMaster.props.spatialManager?.getZone(zone.zone_sn);

                     // 층별 구역명 올리기
                    if (_3dMaster.textPoiManager) {
                        //_3dMaster.props.spatialManager.postLoadingEquipZones(_3dMaster.funcAddEquipZoneText, [nextZoneNo, _this]);
                        const _zone = _3dMaster.props.spatialManager.getZone(zone.zone_sn);

                        for (const equipZone of _zone?.equipmentZoneDatas) {
                            const _equipZone = structuredClone(equipZone); // 깊은 복사

                            if (zoneData.zoneNo === FacilityManager.T2_13_2F) {
                                // 높이 조절 필요
                                _equipZone.y += FacilityManager.T2_13_2F_HIGHT_ADD;
                            }

                            _3dMaster.textPoiManager._addEquipZoneText(_equipZone.displayText, _equipZone);
                        }
                    }

                    // 층별 센서 올리기
                    if (zoneData?.sensors) {
                        const alarmSensorNoMaps = _3dMaster.poiManager?.getAlarmSensorNos(zone.zone_sn);

                        // .TODO: 알람 바운딩 박스 처리 필요

                        for (const typeName in zoneData.sensors) {
                            if ((PoiManager.Equipment_Predict.includes(typeName) && (faModel.fclty_type_code === FacilityManager.Facility_Pre || faModel.fclty_type_code === FacilityManager.Facility_Post))
                                || (PoiManager.Equipment_Power.includes(typeName) && faModel.fclty_type_code === FacilityManager.Facility_Power)) {
                                const sensors = zoneData.sensors[typeName];

                                const _sensors = structuredClone(sensors); // 깊은 복사
                                if (zoneData.zoneNo === FacilityManager.T2_13_2F) {
                                    for (const _sensorData of _sensors) {
                                        const sensor = _sensorData.sensor;
                                        // 층 높이 추가
                                        sensor.y += FacilityManager.T2_13_2F_HIGHT_ADD;
                                    }
                                }

                                // 설비 POI 추가
                                _3dMaster.poiManager?.addSensors(_sensors, alarmSensorNoMaps, _3dMaster.props.visibleSensorTypes, zoneData.buildingNo !== null && zoneData.buildingNo !== undefined);


                                // 알람 센서에 해당하는 바운딩 박스 선택
                                if (_3dMaster.facilityManager?.facilityMaps?.length > 0) {
                                    const fcltyInfos = _3dMaster.props.fcltyInfos;

                                    for (const _sensorData of _sensors) {
                                        const sensor = _sensorData.sensor;

                                        const chkAlarm = alarmSensorNoMaps[sensor.sensor_sn];
                                        if (!chkAlarm)
                                            continue;

                                        const fcltyInfo = fcltyInfos.find(x => x.sensor_sn === sensor.sensor_sn);

                                        if (fcltyInfo?.fclty_presv_model_name?.length > 0) {
                                            const object = _3dMaster.facilityManager.facilityMaps.find(x => x.name === fcltyInfo.fclty_presv_model_name);
                                            if (object) {
                                                object.userData.isAlarmBounding = true;
                                                object.visible = true;
                                            }
                                        }
                                    }
                                }
                            }
                        }
                    }
                }
            }

            // 카메라 무빙
            this._3dMaster.cameraManager.ready(null, null, this._3dMaster.camera, this._3dMaster.controls, modelCamera, 0.75);
        }
    }

    static showFcltyPipeGroup(modelNode, visible) {
        const childCount = modelNode.children.length;

        if (modelNode.name.startsWith(FacilityManager.PipeGroupHeadTag)) {
            modelNode.visible = visible;
        }

        for (let i = 0; i < childCount; i++) {
            FacilityManager.showFcltyPipeGroup(modelNode.children[i], visible);
        }

        return;
    }
}
