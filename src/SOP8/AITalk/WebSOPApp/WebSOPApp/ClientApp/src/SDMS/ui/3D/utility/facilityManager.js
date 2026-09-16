import * as THREE from "three/build/three.module.js";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";
import { DRACOLoader } from "three/examples/jsm/loaders/DRACOLoader.js";
import { FBXLoader } from "three/examples/jsm/loaders/FBXLoader.js";
import { AnimationModel } from "./animationModel";

import { _3dMaster } from "./_3dMaster";
import SdmsResource from '../../../resource/id';


export class FacilityManager {
    static PipeHeadTag = "pipe-";
    static PipeGroupHeadTag = "pipeGroup-";
    static PipeColor_Normal = 0x16E5F8;

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
                
                console.log("FormatChange test");

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

                        // .TODO: 설비 임의 데이터
                        if (zone.zone_sn === 71) {
                            zone.fcltys = [];
                            const fclty = {
                                fclty_sn: 1,
                                titleText: "전처리 필터",
                                displayText: "MB Polisher",
                                x: 175.12,
                                y: 38,
                                z: -175.63
                            }

                            zone.fcltys.push(fclty);
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
                        if (child.name === "pipe-T2-13-1floor") {
                            child.material.color.set("red");
                        }
                        
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

            modelNode.userData.isIndoor = true;
            modelNode.userData.zoneNo = 99999;  // .TODO: 임의 존 숫자
            modelNode.userData.siteNo = _model.siteNo;

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

                facilityMaps.push(child);

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




        // .TODO: 해당 층에 대한 설비 정보







        //if (modelNode.name.startsWith(_3dMaster.FacilityHeadTag) && modelNode.name.endsWith(_3dMaster.BoundingBoxTag)) {
        //    for (let i = 0; i < childCount; i++) {
        //        const child = modelNode.children[i];

        //        //facilityMaps[child.name] = child;

        //        //if (visible) {
        //        //    child.visible = visible;
        //        //}
        //        //else {
        //        //    child.visible = false;
        //        //}
        //    }

        //    return;
        //}

        //for (let i = 0; i < childCount; i++) {
        //    //const child = _3dMaster.showFacilities(modelNode.children[i], visible, facilityMaps);
        //    FacilityManager.showFacilities_Fclty(modelNode.children[i], visible, facilityMaps);

        //    //if (child !== null) {
        //    //    return child;
        //    //}
        //}

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
            const siteNo = currentModel.userData.siteNo;
            const nextModel = params[1];
            const _this = params[2];

            if (_this.poiManager) {
                // 카메라 이동후에 새로 추가한다.
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



            // 설비 네임택 올리기

            // 해당 존 설비 네임택 불러오기
            const faModels = _this.props.faModel;
            const selFcltyInfo = _this.props.selFcltyInfo;

            const zoneNo = selFcltyInfo.zoneNo;

            const fcltys = [];

            const faModel = faModels.find(x => x.gltf_fclty_zone_model_sn === selFcltyInfo.fcltyNo);
            if (faModel?.zoneData?.length > 0) {
                for (const zone of faModel.zoneData) {
                    if (zoneNo !== null && zoneNo !== zone.zone_sn)
                        continue;

                    if (zone.fcltys?.length > 0) {
                        fcltys.push(...zone.fcltys);
                    }
                }
            }

            // 불러온 설비 네임택 올리기
            if (fcltys.length > 0) {
                for (const fclty of fcltys) {
                    _this.textPoiManager._addFcltyText(fclty.titleText, fclty.displayText, fclty);
                }
            }



            // 해당 모델 애니메이션 실행
            if (nextModel.userData?.animationModels?.length > 0) {
                _this.facilityManager.currentAnimationModels = nextModel.userData.animationModels;
            }


            // .TODO: 여러 존의 postLoadingEquipZones 구현 필요
            //const nextZoneNo = nextModel.userData.zoneNo;

            //if (nextZoneNo) {
            //    // 설비모드 경우 센서 없음
            //    //_this.props.spatialManager.postLoadingZoneSensors(_3dMaster.funcAddZoneSensors, [nextZoneNo, _this]);
            //    //_this.poiManager.addZoneSensors(nextZoneNo, _this.props.visibleSensorTypes);

            //    if (_this.textPoiManager) {
            //        _this.textPoiManager.showIndoorText();
            //        _this.props.spatialManager.postLoadingEquipZones(_3dMaster.funcAddEquipZoneText, [nextZoneNo, _this]);
            //        //_this.textPoiManager.addEquipZoneText(_this.props.spatialManager.getZone(nextZoneNo));
            //    }
            //}

            if (_this.textPoiManager) {
                _this.textPoiManager.initZoomValue();
            }

            // 설비모드 경우 가벽 없음
            //_this.editModeManager.fakeWallManager.loadFakeWalls(nextZoneNo, _this.scene);
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

    setFcltyModel = (selFcltyInfo) => {
        if (selFcltyInfo.fcltyNo > 0) {
            const currentModel = this._3dMaster.currentModel;
            const faModels = this.props.faModel;

            let selNodeName = null;
            let modelCamera = null;

            const faModel = faModels.find(x => x.gltf_fclty_zone_model_sn === selFcltyInfo.fcltyNo);
            if (!faModel)
                return;
            else if (!(currentModel?.children?.length > 0 && currentModel?.children[0].children?.length > 0))
                return;

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

            // 해당 층 설비 네임택 불러오기
            const zoneNo = selFcltyInfo.zoneNo;
            const fcltys = [];

            if (faModel.zoneData?.length > 0) {
                for (const zone of faModel.zoneData) {
                    if (zoneNo !== null && zoneNo !== zone.zone_sn)
                        continue;

                    if (zone.fcltys?.length > 0) {
                        fcltys.push(...zone.fcltys);
                    }
                }
            }

            // 불러온 설비 네임택 올리기
            if (fcltys.length > 0) {
                for (const fclty of fcltys) {
                    this._3dMaster.textPoiManager._addFcltyText(fclty.titleText, fclty.displayText, fclty);
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
