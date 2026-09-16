import * as THREE from "three/build/three.module.js";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";
import { DRACOLoader } from "three/examples/jsm/loaders/DRACOLoader.js";

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

    //constructor() {
    //    this.alarmAnimationMixers = [[], [], [], []];
    //    this.alarmModels = [[], [], [], []];

    //    // 실내모델 파일 로딩이 끝나지 않아서 보여주지 못했던 알람정보
    //    this.lazyAlarmData = {};
    //}

    //async loadAlarmModels(_3dOptions) {
    //    this.loadAnimationFile(AlarmManager.Alarm_Model[Contents3D.ALARM_2 - 1], false, AlarmManager.ALARM_2, _3dOptions);
    //    this.loadAnimationFile(AlarmManager.Alarm_Model[Contents3D.ALARM_3 - 1], false, AlarmManager.ALARM_3, _3dOptions);
    //    this.loadAnimationFile(AlarmManager.Alarm_Model[Contents3D.ALARM_4 - 1], false, AlarmManager.ALARM_4, _3dOptions);
    //}

    //loadAnimationFile(contents, visible, alarmLevel, _3dOptions, scene) {
    //    const fileName = _3dOptions.modelBaseURL + "/" + contents;

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

    //    const alarmLayer = this._makeLayer(scene);
    //    const _this = this;

    //    loader.load(fileName, function (object) {
    //        const obj = loader instanceof GLTFLoader ? object.scene : object;
    //        obj.traverse((child) => {
    //            if (child instanceof THREE.Mesh) {
    //                child.castShadow = false;
    //                child.receiveShadow = false;
    //            }
    //        });

    //        const modelNode = new THREE.Object3D();
    //        modelNode.add(obj);
    //        modelNode.matrixAutoUpdate = false;
    //        modelNode.name = contents;
    //        modelNode.visible = visible;

    //        alarmLayer.add(modelNode);
    //        modelNode.updateMatrixWorld(true);

    //        if (object.animations.length > 0) {
    //            const childCount = modelNode.children.length;

    //            // animation Object는 직접 옮길수 없고 child object들을 모두 옮겨야 한다.
    //            for (let i = 0; i < childCount; i++) {
    //                const childModel = modelNode.children[i];
    //                childModel.position.y += 10;
    //                childModel.scale.x *= 0.20;
    //                childModel.scale.z *= 0.20;

    //                const meshCount = childModel.children.length;

    //                // animation Object에 의한 그림자가 생기는것을 차단한다.
    //                for (let j = 0; j < meshCount; j++) {
    //                    const childMesh = childModel.children[j];
    //                    childMesh.castShadow = false;
    //                    childMesh.receiveShadow = false;
    //                }
    //            }

    //            const mixer = new THREE.AnimationMixer(modelNode);

    //            for (let i = 0; i < object.animations.length; i++) {
    //                mixer.clipAction(object.animations[i]).play();;
    //            }

    //            _this.alarmAnimationMixers[alarmLevel - 1].push(mixer);
    //            _this.alarmModels[alarmLevel - 1].push(modelNode);

    //            for (let i = 0; i < 99; i++) {
    //                const cloneModel = modelNode.clone();
    //                _this.alarmModels[alarmLevel - 1].push(cloneModel);
    //                alarmLayer.add(cloneModel);

    //                const mixer2 = new THREE.AnimationMixer(cloneModel);

    //                for (let j = 0; j < object.animations.length; j++) {
    //                    mixer2.clipAction(object.animations[j]).play();;
    //                }

    //                _this.alarmAnimationMixers[alarmLevel - 1].push(mixer2);
    //            }

    //            modelNode.updateMatrixWorld(true);
    //        }
    //    });
    //}

    //animateAlarm(delta, alarm) {
    //    const currentAlarmLevel = alarm;

    //    if (currentAlarmLevel > 0) {
    //        const animationMixers = this.alarmAnimationMixers[currentAlarmLevel - 1];
    //        const animationModels = this.alarmModels[currentAlarmLevel - 1];

    //        const mixerCount = animationMixers.length;

    //        for (let i = 0; i < mixerCount; i++) {
    //            const animationMixer = animationMixers[i];
    //            const animationModel = animationModels[i];

    //            if (animationMixer !== null && animationModel && animationModel.visible) {
    //                animationMixer.update(delta);
    //            }
    //        }
    //    }
    //}

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

    //// 실내 모델이 로딩되지 않아서 표시하지 못했던 알람정보를 표현한다.
    //showLazyAlarmData() {
    //    if (this.lazyAlarmData.isAlarm) {
    //        this.showAlarm(this.lazyAlarmData.zoneID, this.lazyAlarmData.sensorType, this.lazyAlarmData.sensorID, this.lazyAlarmData.alarmLevel, this.lazyAlarmData.isAlarm);
    //        this.lazyAlarmData = {};
    //    }
    //}

    //_makeLayer(scene) {
    //    const layer = new THREE.Object3D();
    //    layer.matrixAutoUpdate = false;
    //    layer.name = "alarmModels";

    //    scene.add(layer);
    //    return layer;
    //}
}