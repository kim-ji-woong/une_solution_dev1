import * as THREE from "three/build/three.module.js";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";
import { DRACOLoader } from "three/examples/jsm/loaders/DRACOLoader.js";
import { PoiManager } from "../poi/poiManager";

export class AlarmManager {
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

    constructor(_3dMaster, spatialManager) {
        this.alarmAnimationMixers = [[], [], [], []];
        this.alarmModels = [[], [], [], []];

        // 실내모델 파일 로딩이 끝나지 않아서 보여주지 못했던 알람정보
        this.lazyAlarmData = null;
        this.selectedAlarm = null;

        this._3dMaster = _3dMaster;
        this.spatialManager = spatialManager;

        this.alarmLayers = null;
        this.loadAlarmModels(this._3dMaster.props.gltfOptions, this._3dMaster.scene);
    }

    async loadAlarmModels(gltfOptions, scene) {
        this.loadAnimationFile(AlarmManager.Alarm_Model[AlarmManager.ALARM_2 - 1], false, AlarmManager.ALARM_2, gltfOptions, scene);
        this.loadAnimationFile(AlarmManager.Alarm_Model[AlarmManager.ALARM_3 - 1], false, AlarmManager.ALARM_3, gltfOptions, scene);
        this.loadAnimationFile(AlarmManager.Alarm_Model[AlarmManager.ALARM_4 - 1], false, AlarmManager.ALARM_4, gltfOptions, scene);
    }

    loadAnimationFile(contents, visible, alarmLevel, gltfOptions, scene) {
        const fileName = gltfOptions.modelBaseUrl + "/" + contents;

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

        const alarmLayer = this._makeLayer(scene, alarmLevel);
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

            alarmLayer.add(modelNode);
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

                _this.alarmAnimationMixers[alarmLevel - 1].push(mixer);
                _this.alarmModels[alarmLevel - 1].push(modelNode);

                for (let i = 0; i < 99; i++) {
                    const cloneModel = modelNode.clone();
                    _this.alarmModels[alarmLevel - 1].push(cloneModel);
                    alarmLayer.add(cloneModel);

                    const mixer2 = new THREE.AnimationMixer(cloneModel);

                    for (let j = 0; j < object.animations.length; j++) {
                        mixer2.clipAction(object.animations[j]).play();;
                    }

                    _this.alarmAnimationMixers[alarmLevel - 1].push(mixer2);
                }

                modelNode.updateMatrixWorld(true);
            }
        });
    }

    animateAlarm(delta) {
        const count = this.alarmAnimationMixers.length;

        for (let j = 0; j < count; j++) {
            const animationMixers = this.alarmAnimationMixers[j];
            const animationModels = this.alarmModels[j];

            const mixerCount = animationMixers.length;

            for (let i = 0; i < mixerCount; i++) {
                const animationMixer = animationMixers[i];
                const animationModel = animationModels[i];

                if (animationMixer !== null && animationModel?.visible) {
                    animationMixer.update(delta);
                }
                else {
                    break;
                }
            }
        }
    }

    //setLazyAlarmInfo(zoneID, sensorType, sensorID, alarmLevel, isAlarm) {
    //    // 실내모델 파일 로딩이 끝나지 않아서 보여주지 못했던 알람정보
    //    this.lazyAlarmData = {
    //        zoneID: zoneID,
    //        sensorType: sensorType,
    //        sensorID: sensorID,
    //        alarmLevel: alarmLevel,
    //        isAlarm: isAlarm
    //    };
    //}

    // 실내 모델이 로딩되지 않아서 표시하지 못했던 알람정보를 표현한다.
    showLazyAlarmData() {
        if (this.lazyAlarmData.isAlarm) {
            const [file, modelNode] = this.getAlarmModel(this.lazyAlarmData);

            if (modelNode) {
                this.moveToAlarm(this.lazyAlarmData, this._3dMaster.props.sensorAlarms);
            }

            this.lazyAlarmData = null;
        }
    }

    _makeLayer(scene, alarmLevel) {
        if (this.alarmLayers === null) {
            const layer = new THREE.Object3D();
            layer.matrixAutoUpdate = false;
            layer.name = "alarmModels";

            scene.add(layer);
            this.alarmLayers = layer;
        }

        const alarmLevelLayer = new THREE.Object3D();
        alarmLevelLayer.matrixAutoUpdate = false;
        alarmLevelLayer.name = "alarmModels_level" + alarmLevel;

        this.alarmLayers.add(alarmLevelLayer);
        return alarmLevelLayer;
    }

    selectAlarm(alarm, sensorAlarms) {
        if (alarm) {
            // 이미 해당 공간으로 이동한 알람이면 무시한다.
            if (alarm.movedAlarm) {
                this.checkChangedAlarm(sensorAlarms);
                return;
            }
            else {
                alarm.movedAlarm = true;
            }

            this.showAlarm(alarm, sensorAlarms);
        }
        else {
            if (this.selectedAlarm) {
                this.showAlarm(null, sensorAlarms);
            }
        }

        this.checkChangedAlarm(sensorAlarms);
        this.selectedAlarm = alarm;
    }

    checkChangedAlarm(sensorAlarms) {
        for (const sensorAlarm of sensorAlarms) {
            if (sensorAlarm.isChanged) {
                sensorAlarm.isChanged = false;

                if (sensorAlarm.isAlarm === false) {
                    this._hideAlarm(sensorAlarm);
                }
            }
        }
    }

    compareAlarm(alarm1, alarm2) {
        if (alarm1.sensorZoneHistoryNo !== alarm2.sensorZoneHistoryNo) {
            return false;
        }

        if (alarm1.alarmDepth !== alarm2.alarmDepth) {
            // 알람단계가 바뀌었으니 기존 애니메이션은 삭제한다.
            this._hideAlarm(alarm1);
            return false;
        }

        const firstCount = alarm1.sensorZones.length;
        const secondCount = alarm2.sensorZones.length;

        for (let i = 0; i < firstCount; i++) {
            const sensorZone = alarm1.sensorZones[i];
            let find = false;

            for (let j = 0; j < secondCount; j++) {
                const _sensorZone = alarm2.sensorZones[j];

                if (sensorZone.sensorZoneNo === _sensorZone.sensorZoneNo) {
                    find = true;
                    break;
                }
            }

            if (!find) {
                return false;
            }
        }

        return true;
    }

    showAlarm(alarm, sensorAlarms) {
        if (alarm) {
            const [file, modelNode] = this.getAlarmModel(alarm);

            if (file) {
                if (modelNode) {
                    this.moveToAlarm(alarm, sensorAlarms);
                }
                else {
                    this.lazyAlarmData = alarm;
                }
            }
        }
        else {
            this._hideAlarm(this.selectedAlarm);
        }
    }

    getCurrentZoneAlarms(alarm, sensorAlarms) {
        const alarms = [];

        for (const sensorAlarm of sensorAlarms) {
            if (sensorAlarm.isAlarm && sensorAlarm.zoneNo === alarm.zoneNo) {
                alarms.push(sensorAlarm);
            }
        }

        return alarms;
    }

    static _showAlarm(params) {
        const _alarm = params[0];
        const _this = params[1];
        const sensorAlarms = params[2];

        // 같은 Zone에서 발생한 모든 알람정보를 얻어온다.
        const alarms = _this.getCurrentZoneAlarms(_alarm, sensorAlarms);

        // 일단 모든 알람을 삭제한다.
        _this._hideAlarm(null);

        for (const alarm of alarms) {
            const poi = _this._3dMaster.poiManager.getSensorPOI(alarm.zoneNo, alarm.sensorNo, alarm.facilityType, alarm.sensorSubType);

            if (poi) {
                const alarmModels = _this.alarmModels[alarm.alarmDepth - 1];

                if (alarmModels) {
                    const scale = _this._3dMaster.isIndoor() ? PoiManager.IndoorPoiScale : PoiManager.OutdoorPoiScale;
                    const modelCount = alarmModels.length;

                    for (let i = 0; i < modelCount; i++) {
                        const alarmModel = alarmModels[i];

                        if (alarmModel && alarmModel.visible === false) {
                            alarmModel.scale.x = scale;
                            alarmModel.scale.z = scale;
                            _this.moveAnimationChild(alarmModel, poi.position.x, poi.position.y, poi.position.z, scale);

                            alarmModel.visible = true;
                            alarmModel.userData.sensorZoneHistoryNo = alarm.sensorZoneHistoryNo;
                            alarmModel.alarmName = alarm.facilityType + "_" + alarm.sensorNo;

                            break;
                        }
                    }
                }
            }
        }
    }

    _hideAlarm(alarm) {
        if (alarm) {
            const poi = this._3dMaster.poiManager.getSensorPOI(alarm.zoneNo, alarm.sensorNo, alarm.facilityType, alarm.sensorSubType);

            if (poi) {
                const alarmModels = this.alarmModels[alarm.alarmDepth - 1];
                const mixers = this.alarmAnimationMixers[alarm.alarmDepth - 1];

                if (alarmModels && mixers) {
                    const modelCount = alarmModels.length;

                    for (let i = 0; i < modelCount; i++) {
                        const alarmModel = alarmModels[i];

                        if (alarmModel && alarmModel.visible) {
                            if (alarmModel.userData.sensorZoneHistoryNo === alarm.sensorZoneHistoryNo) {
                                alarmModel.visible = false;

                                if (i < modelCount - 1 && alarmModels[i + 1].visible) {
                                    // 다음 알람 모델이 존재할 경우 비활성화 시킨 모델을 배열의 제일 끝으로 이동시킨다.
                                    // 이렇게 하면 배열의 처음부터 활성화된 모델만 찾기 편하다.
                                    alarmModels.splice(i, 1);
                                    alarmModels.push(alarmModel);

                                    const mixer = mixers[i];
                                    mixers.splice(i, 1);
                                    mixers.push(mixer);
                                }

                                break;
                            }
                        }
                    }
                }
            }
        }
        else {
            for (const alarmModels of this.alarmModels) {
                for (const alarmModel of alarmModels) {
                    if (alarmModel.visible) {
                        alarmModel.visible = false;
                    }
                    else {
                        break;
                    }
                }
            }
        }
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

    moveToAlarm(alarm, sensorAlarms) {
        if (alarm) {
            if (this._3dMaster.props.currentModel?.currentZoneNo !== alarm.zoneNo) {
                this._3dMaster.props.moveToZone(alarm.zoneNo, false, AlarmManager._showAlarm, [alarm, this, sensorAlarms]);
            }
            else {
                AlarmManager._showAlarm([alarm, this, sensorAlarms]);
            }
        }
    }

    getAlarmModel(alarm) {
        const zone = this.spatialManager.getZone(alarm.zoneNo);

        if (zone) {
            const model = zone.model;

            if (model?.file) {
                return [model.file, zone.modelNode];
            }
        }

        return [null, null];
    }
}