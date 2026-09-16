import Contents3D from "./contents3D";
import * as THREE from "three/build/three.module.js";
import { FBXLoader } from "three/examples/jsm/loaders/FBXLoader.js";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";
import { DRACOLoader } from "three/examples/jsm/loaders/DRACOLoader.js";
import { AccountController } from '../../../Account/services/accountController';

import ProjectResource from '../../../Root/resource/id';
import SDMSResource from '../../resource/id';

export class SpatialManager {
    static using2DImage = true;

    static get3dOptionsFromSiteID(siteID, site3dOptions) {
        for (const _siteID in site3dOptions) {
            if (_siteID === siteID) {
                const _3dOptions = site3dOptions[_siteID];
                return _3dOptions;
            }
        }

        return null;
    }

    static get3dOptionsFromBuildingID(buildingID, site3dOptions) {
        for (const siteID in site3dOptions) {
            const _3dOptions = site3dOptions[siteID];

            const building = _3dOptions.buildingIDs[buildingID];

            if (building !== null && building !== undefined) {
                return _3dOptions;
            }
        }

        return null;
    }

    static get3dOptionsFromZoneID(zoneID, site3dOptions) {
        for (const siteID in site3dOptions) {
            const _3dOptions = site3dOptions[siteID];

            const zone = _3dOptions.zones[zoneID];

            if (zone !== null && zone !== undefined) {
                return _3dOptions;
            }
            else if (zoneID >= SDMSResource.zoneID.outdoor)
            {   // 외곽일 경우
                const siteData = ProjectResource.SiteNo + zoneID - SDMSResource.zoneID.outdoor;
                if (siteID === siteData?.toString())
                    return _3dOptions;
            }
        }

        return null;
    }

    static showIndoor2(zoneID, site3dOptions, contents3D) {
        const internalModels = SpatialManager.prepareClearIndoorModels(contents3D);
        const _3dOptions = SpatialManager.get3dOptionsFromZoneID(zoneID, site3dOptions);

        if (_3dOptions) {
            const floor = SpatialManager.getZoneFloor(zoneID, _3dOptions);

            if (floor?.file && floor?.camera) {
                const param = {
                    zoneID: zoneID
                };

                // 카메라 이동이 끝난후 나타나게 한다.
                contents3D.poiManager.removeSensors(null);

                // contents3D.isInoodr()에서 true로 표시되도록 하기 위하여 임시 데이터를 사용한다.
                contents3D.currentModel = {
                    name: floor.file
                };

                if (contents3D.prevIndoorModel) {
                    contents3D.prevIndoorModel.visible = false;
                }

                contents3D.loadFile(floor.file, true, floor.camera, Contents3D.Mode_Indoor, _3dOptions, SpatialManager.postIndoorModelFile, [floor.file, contents3D]);
                setTimeout(() => contents3D.setMovingCamera(floor.camera, Contents3D.Mode_Indoor, param), 750);
            }
        }

        if (SpatialManager.isEmpty(contents3D.tempInternalModels) === false) {
            return contents3D.tempInternalModels;
        }

        return internalModels;
    }

    static isEmpty(obj) {
        for (const key in obj) {
            return false;
        }

        return true;
    }

    static postShowIndoor(internalModels, contents3D) {
        SpatialManager.processClearIndoorModels(contents3D, internalModels);
    }

    static showIndoor(zoneID, site3dOptions, contents3D, isSetMovingCamera) {
        SpatialManager.clearIndoorModels(contents3D);
        const _3dOptions = SpatialManager.get3dOptionsFromZoneID(zoneID, site3dOptions);

        if (_3dOptions) {
            const floor = SpatialManager.getZoneFloor(zoneID, _3dOptions);

            if (floor?.file && floor?.camera) {
                const param = {
                    zoneID: zoneID
                };

                // 카메라 이동이 끝난후 나타나게 한다.
                contents3D.poiManager.removeSensors(null);

                // contents3D.isInoodr()에서 true로 표시되도록 하기 위하여 임시 데이터를 사용한다.
                contents3D.currentModel = {
                    name: floor.file
                };

                if (contents3D.prevIndoorModel) {
                    contents3D.prevIndoorModel.visible = false;
                }

                contents3D.loadFile(floor.file, true, floor.camera, Contents3D.Mode_Indoor, _3dOptions, SpatialManager.postIndoorModelFile, [floor.file, contents3D]);

                // 알람 센서로 카메라 이동을 위한 조건 처리 
                if (isSetMovingCamera !== false)
                    setTimeout(() => contents3D.setMovingCamera(floor.camera, Contents3D.Mode_Indoor, param), 750);
                //contents3D.setMovingCamera(floor.camera, Contents3D.Mode_Indoor, param);
                //contents3D.loadFile(floor.file, true, floor.camera, Contents3D.Mode_Indoor, _3dOptions, SpatialManager.postIndoorModelFile, [floor.file, contents3D]);
            }
        }
    }

    static postIndoorModelFile(params) {
        const fileName = params[0];
        const contents3D = params[1];

        const modelData = contents3D.internalModels[fileName];

        if (modelData) {
            contents3D.currentModel = modelData[0];
        }
    }

    static getZoneFloor(zoneID, _3dOptions) {
        const zone = _3dOptions.zones[zoneID];

        if (zone) {
            const buildingID = zone[1];
            const building = _3dOptions.buildingIDs[buildingID];

            if (building) {
                const buildingDisplayName = building[2];
                let model = _3dOptions.indoorModels[buildingDisplayName];

                if (model) {
                    for (const keyName in model) {
                        const data = model[keyName];

                        if (data.buildingID === buildingID) {
                            if (data.floors) {
                                const floorCount = data.floors.length;

                                for (let i = 0; i < floorCount; i++) {
                                    const floor = data.floors[i];

                                    if (floor.zoneID === zoneID) {
                                        return floor;
                                    }
                                }
                            }

                            return null;
                        }
                    }
                }
                else {
                    for (const modelName in _3dOptions.indoorModels) {
                        const _model = _3dOptions.indoorModels[modelName];

                        for (const keyName in _model) {
                            const data = _model[keyName];

                            if (data.buildingID === buildingID) {
                                if (data.floors) {
                                    const floorCount = data.floors.length;

                                    for (let i = 0; i < floorCount; i++) {
                                        const floor = data.floors[i];

                                        if (floor.zoneID === zoneID) {
                                            return floor;
                                        }
                                    }
                                }

                                return null;
                            }
                        }
                    }
                }
            }
        }

        return null;
    }

    static loadPartialFiles(contents, visible, cameraOptions, mode, _3dOptions, contents3D, postMethod = null, postMethodParam = null) {
        contents3D.timelog("loadPartialFiles");
        if (visible) {
            contents3D.setState({ loading: true });
        }

        const parentNode = new THREE.Object3D();
        parentNode.matrixAutoUpdate = false;
        parentNode.visible = visible;

        contents3D.scene.add(parentNode);

        const contentsCount = contents.length;

        if (contentsCount > 0) {
            SpatialManager._loadPartialFile([contents, parentNode, cameraOptions, mode, _3dOptions, 0, contentsCount, contents3D, postMethod, postMethodParam]);
        }

        /*for (let i = 0; i < contentsCount; i++) {
            if (i < contentsCount - 1) {
                SpatialManager.loadPartialFile(contents[i], parentNode, cameraOptions, mode, _3dOptions, false, contents3D);
            }
            else {
                SpatialManager.loadPartialFile(contents[i], parentNode, cameraOptions, mode, _3dOptions, true, contents3D, postMethod, postMethodParam);
            }
        }*/
    }

    static _loadPartialFile(params) {
        const contents = params[0];
        const parentNode = params[1];
        const cameraOptions = params[2];
        const mode = params[3];
        const _3dOptions = params[4];
        const index = params[5];
        const contentsCount = params[6];
        const contents3D = params[7];
        const postMethod = params[8];
        const postMethodParam = params[9];

        contents3D.timelog("loadPartialFile[" + index + "]");

        if (index === contentsCount - 1) {
            SpatialManager.loadPartialFile(contents[index], parentNode, cameraOptions, mode, _3dOptions, true, contents3D, postMethod, postMethodParam);
        }
        else {
            SpatialManager.loadPartialFile(contents[index], parentNode, cameraOptions, mode, _3dOptions, false, contents3D, SpatialManager._loadPartialFile, [contents, parentNode, cameraOptions, mode, _3dOptions, index + 1, contentsCount, contents3D, postMethod, postMethodParam]);
        }
    }

    static loadPartialFile(contents, parentNode, cameraOptions, mode, _3dOptions, isLast, constents3D, postMethod = null, postMethodParam = null) {
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

        const _this = constents3D;
        
        loader.load(fileName, function (object) {
            const obj = loader instanceof GLTFLoader ? object.scene : object;
            obj.traverse((child) => {
                if (child instanceof THREE.Mesh) {
                    child.castShadow = mode !== Contents3D.Mode_Indoor;
                    child.receiveShadow = mode !== Contents3D.Mode_Indoor;
                }
            });

            const modelNode = new THREE.Object3D();
            modelNode.add(obj);
            modelNode.matrixAutoUpdate = false;
            modelNode.name = contents;
            //modelNode.visible = visible;

            parentNode.add(modelNode);
            modelNode.updateMatrixWorld(true);

            // AnimationModel이 있는지 확인한다.
            _this.loadAnimationModels(object, modelNode);

            if (mode === Contents3D.Mode_Outdoor_All || mode === contents.Mode_Outdoor_Part) {
                _this.hideBoundingBoxes(modelNode, _3dOptions.buildingGroups, _3dOptions.buildings);
            }

            if (mode === Contents3D.Mode_Outdoor_Part) {
                if (isLast) {
                    _this.onCompleteOutdoorModelLoading(modelNode, _3dOptions);
                }

                const facilityGroup = Contents3D.showFacilities(modelNode, false, _this.facilityMaps);

                if (facilityGroup) {
                    _this.this.outdoorFacilities[contents] = facilityGroup;
                }
            }
            else {
                const exitArrowData = Contents3D.showExit(modelNode, false);
                _this.internalModels[contents] = [modelNode, cameraOptions, exitArrowData && exitArrowData.length >= 1 ? exitArrowData[0] : null, exitArrowData && exitArrowData.length >= 2 ? exitArrowData[1] : null];

                const facilityGroup = Contents3D.showFacilities(modelNode, false, _this.facilityMaps);
                _this.internalModels[contents].push(facilityGroup);
            }

            if (mode === Contents3D.Mode_Indoor) {
                if (isLast) {
                    _this.indoorModelCountTemp++;
                    const rate = _this.indoorModelCountTemp / _this.indoorModelCount * 100;

                    if (rate >= 100) {
                        AccountController.loading3DChk = false;
                        _this.setState({ progressValue: rate, progressActive: false });

                        if (_3dOptions.indoorModelOnMemory) {
                            // 실내 모델을 메모리에 미리 로딩해 놓고 필요할때 꺼내어 쓰는 경우
                            _this.loadNextSiteModels();
                        }
                    } else {
                        AccountController.loading3DChk = true;
                        _this.setState({ progressValue: rate });
                    }
                }
            }

            _this.timelog(contents);

            if (isLast) {
                _this.setState({ loading: false });
            }

            if (postMethod) {
                if (postMethodParam !== null) {
                    postMethod(postMethodParam);
                }
                else {
                    postMethod();
                }
            }
        });
    }

    static prepareClearIndoorModels(contents3D) {
        const internalModels = { ...contents3D.internalModels };
        contents3D.internalModels = {};

        return internalModels;
    }

    static async processClearIndoorModels(contents3D, internalModels) {
        const models = [];

        for (const contentsName in internalModels) {
            const model = internalModels[contentsName];

            if (model && model[0]) {
                contents3D.scene.remove(model[0]);
                models.push(model[0]);
            }
        }

        SpatialManager.clearModel(models);
    }

    static async clearIndoorModels(contents3D) {
        const internalModels = { ...contents3D.internalModels };
        contents3D.internalModels = {};

        const models = [];

        for (const contentsName in internalModels) {
            const model = internalModels[contentsName];

            if (model && model[0]) {
                contents3D.scene.remove(model[0]);
                models.push(model[0]);
            }
        }

        SpatialManager.clearModel(models);
    }

    static clearModel(models) {
        const data = {
            meshes: [],
            materials: [],
            textures: [],
            geometries: []
        }

        models.map(model => {
            SpatialManager.findMeshs(model, data);
        });

        data.meshes.forEach((obj) => {
            if (obj.parent !== null) {
                obj.parent.remove(obj);
            }
            if (obj.dispose) {
                obj.dispose();
            }
        });

        data.materials.forEach((mat) => {
            if (mat.dispose) {
                mat.dispose();
            }
        });

        data.textures.forEach((tex) => {
            tex.dispose();
        });

        data.geometries.forEach((geom) => {
            geom.dispose();
        });
    }

    static findMeshs(model, data) {
        if (model instanceof THREE.Mesh) {
            data.meshes.push(model);

            if (model.geometry instanceof THREE.BufferGeometry) {
                data.geometries.push(model.geometry);
            }

            if (model.material instanceof THREE.Material) {
                data.materials.push(model.material);

                if (model.material.map instanceof THREE.Texture) {
                    data.textures.push(model.material.map);
                }
            }
        }

        model.children.map(child => SpatialManager.findMeshs(child, data));
    }
}