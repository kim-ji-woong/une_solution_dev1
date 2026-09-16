import * as THREE from "three/build/three.module.js";
import SdmsResource from "../../../resource/id";
import { RadomirManager } from "../effect/radomirManager";
import { PulseManager } from "../effect/pulseManager";

export class PoiManager {
    static PoiStatus = {
        normal: 0,
        hover: 1,
        selected: 2,
        alarm: 3,
        alarm_hover: 4,
        alarm_selected: 5,
        disabled: 6,
        disabled_hover: 7,
        disabled_selected: 8,
        master_selected: 9,
        slave_selected: 10
    };

    static PoiStatusType = {
        normal: "origin",
        hover: "hover",
        selected: "selected",
        alarm: "alarm",
        alarm_hover: "alarmHover",
        alarm_selected: "alarmSelected",
        disabled: "disabled",
        disabled_hover: "disabledHover",
        disabled_selected: "disabledSelected",
        master_selected: "masterSelected",
        slave_selected: "slaveSelected"
    }

    static PoiImageUrlType = {
        normal: "",
        hover: "_hover",
        selected: "_selected",
        alarm: "_alarm",
        alarm_hover: "_alarm_hover",
        alarm_selected: "_alarm_selected",
        disabled: "_disabled",
        disabled_hover: "_disabled_hover",
        disabled_selected: "_disabled_selected",
        master_selected: "_selected",
        slave_selected: "_slave_selected"
    }

    static DoorPointType = {
        none: 0,
        point: 1,
        important: 2
    }

    static OutdoorPoiScale = 1.5;
    static SelectedPoiScale = 2;
    static IndoorPoiScale = 1;
    static EquipZonePoiScale = 1.5;
    static OriginPoiScale = 1;

    static MovingForwardTime = 0.75;
    static MovingBackwardTime = 0.5;

    static Fire_Sensor = "300300_화재센서_fire";
    static EmergencyBell_Sensor = "300319_비상벨센서_emergencyBell";
    static DOOR_Sensor = "300316_출입문센서_door";

    static DOOR_Speedgate_Sensor = "300316-1_출입문센서(스피드게이트)_door";
    static DOOR_Important_Sensor = "300316-2_출입문센서(중요구역)_door";

    // .TODO: 출입문 이벤트 확정이 아님
    static DOOR_CLOSE_Sensor = "300316-3_출입문센서(강제 개방)_door";
    static DOOR_OPEN_Sensor = "300316-4_출입문센서(장시간 개방)_door";

    static CCTV_DOM_Sensor = "300303-1_CCTV(Dom)_cctv-dom";
    static CCTV_Bullet_Sensor = "300303-2_CCTV(Bullet)_cctv-bullet";
    static CCTV_Explosion_Sensor = "300303-3_CCTV(Explosion)_cctv-expl";
    static CCTV_AI_Sensor = "300303-4_CCTV(AI)_cctv-ai";
    static CCTV_Drone_Sensor = "300303-5_CCTV(Drone)_cctv-drone";

    static Invasion_Magnetic_Sensor = "300320-1_침입센서(자석)_invasion-magnetic";
    static Invasion_Glass_Sensor = "300320-2_침입센서(유리)_invasion-glass";
    static Invasion_Shutter_Sensor = "300320-3_침입센서(셔터)_invasion-shutter";
    static Invasion_Infrared_Sensor = "300320-4_침입센서(적외선)_invasion-infrared";
    
    static EquipZoneName = "구역명";

    static AlarmBlink = 5;

    static SENSOR_GROUP = {
        CCTV: [
            PoiManager.CCTV_DOM_Sensor,
            PoiManager.CCTV_Bullet_Sensor,
            PoiManager.CCTV_Explosion_Sensor,
            PoiManager.CCTV_AI_Sensor,
            PoiManager.CCTV_Drone_Sensor,
        ],
        INVASION: [
            PoiManager.Invasion_Magnetic_Sensor,
            PoiManager.Invasion_Glass_Sensor,
            PoiManager.Invasion_Shutter_Sensor,
            PoiManager.Invasion_Infrared_Sensor,
        ],
    };

    static PointScaleX = 1.1;
    static PointScaleY = 2.82;

    static ClosedDoorAlarmScaleY = 1.46;
    static PointClosedDoorAlarmScaleY = 3.44;

    constructor(scene, spatialManager, _3dMaster) {
        this.scene = scene;
        this.spatialManager = spatialManager;
        this._3dMaster = _3dMaster;

        this.spriteMaterials = { /*[url: string]: THREE.SpriteMaterial*/ };

        // 전체 센서 Layer
        this.baseSensorLayer = null;
        // 타입별 센서 Layer(SubType 고려)
        this.sensorLayers = {};
        // 전체 센서
        this.sensorPois = {};

        // 시뮬레이션 모드의 마크 Layer
        this.markLayer = null;
        this.markIconImage = null;

        // icon Click시 poi 크기변경 옵션
        this.smoothScalePois = [];

        this.selectedPoi = null;
        this.mouseOverPoi = null;

        this.alarmPois = {};
        this.alarmEffectManager = new RadomirManager(scene, _3dMaster.camera, {}, this);

        this.masterPoi = null;
        this.slavePois = [];

        this.closedDoorSpriteMaterial = this.initDoorMaterials();
        this.closedDoorSpriteMaterialPoint = this.initDoorMaterials();
        this.closedDoorSpriteMaterialImportant = this.initDoorMaterials();
        this.openedDoorSpriteMaterial = this.initDoorMaterials();
        this.openedDoorSpriteMaterialPoint = this.initDoorMaterials();
        this.openedDoorSpriteMaterialImportant = this.initDoorMaterials();

        this.doorPointPois = {};

        // 현재 화재 알람이 발생한 상태인가?
        this.currentFireAlarm = false;

        this.hidePointDoors = [];
    }

    initDoorMaterials() {
        const materials = {};

        materials[PoiManager.PoiStatus.normal] = null;
        materials[PoiManager.PoiStatus.hover] = null;
        materials[PoiManager.PoiStatus.selected] = null;
        materials[PoiManager.PoiStatus.alarm] = null;
        materials[PoiManager.PoiStatus.alarm_hover] = null;
        materials[PoiManager.PoiStatus.alarm_selected] = null;
        materials[PoiManager.PoiStatus.disabled] = null;
        materials[PoiManager.PoiStatus.disabled_hover] = null;
        materials[PoiManager.PoiStatus.disabled_selected] = null;

        return materials;
    }

    static getOriginVisibleSensorTypes() {
        const visibleSensorTypes = {};

        visibleSensorTypes[PoiManager.CCTV_DOM_Sensor] = true;
        visibleSensorTypes[PoiManager.CCTV_Bullet_Sensor] = true;
        visibleSensorTypes[PoiManager.CCTV_Explosion_Sensor] = true;
        visibleSensorTypes[PoiManager.CCTV_AI_Sensor] = true;
        visibleSensorTypes[PoiManager.CCTV_Drone_Sensor] = true;
        visibleSensorTypes[PoiManager.EmergencyBell_Sensor] = true;
        visibleSensorTypes[PoiManager.DOOR_Sensor] = true;
        visibleSensorTypes[PoiManager.DOOR_Speedgate_Sensor] = true;
        visibleSensorTypes[PoiManager.DOOR_Important_Sensor] = true;

        // .TODO: 출입문 이벤트 확정이 아님
        visibleSensorTypes[PoiManager.DOOR_CLOSE_Sensor] = true;
        visibleSensorTypes[PoiManager.DOOR_OPEN_Sensor] = true;

        visibleSensorTypes[PoiManager.Invasion_Magnetic_Sensor] = true;
        visibleSensorTypes[PoiManager.Invasion_Glass_Sensor] = true;
        visibleSensorTypes[PoiManager.Invasion_Shutter_Sensor] = true;
        visibleSensorTypes[PoiManager.Invasion_Infrared_Sensor] = true;
        visibleSensorTypes[PoiManager.EquipZoneName] = true;

        return visibleSensorTypes;
    }

    static getSensorTypeName(sensorType) {
        const index = sensorType.indexOf('_');

        if (index < 0) {
            return sensorType;
        }

        const index2 = sensorType.indexOf(index + 1);

        if (index2 < 0) {
            return sensorType.substring(index + 1).trim();
        }

        return sensorType.substring(index + 1, index2).trim();
    }

    static getSensorTypeImage(sensorType) {
        const index = sensorType.indexOf('_');

        if (index < 0) {
            return null;
        }

        const index2 = sensorType.indexOf('_', index + 1);

        if (index2 < 0) {
            return null;
        }

        return sensorType.substring(index2 + 1).trim();
    }

    getSensorPOI(zoneNo, sensorNo, sensorTypeCode, sensorSubTypeCode = null) {
        const key = PoiManager.getSensorKey(zoneNo, sensorNo, sensorTypeCode, sensorSubTypeCode);
        const sprite = this.sensorPois[key];
        return sprite;
    }

    static getSensorKey(zoneNo, sensorNo, sensorTypeCode, sensorSubTypeCode = null) {
        if (sensorSubTypeCode === null) {
            return sensorTypeCode + "_" + zoneNo + "_" + sensorNo;
        }

        return sensorTypeCode + "-" + sensorSubTypeCode + "_" + zoneNo + "_" + sensorNo;
    }

    static parseSensorKey(poi) {
        if (poi) {
            const index = poi.name.indexOf('_');

            if (index > 0) {
                const index2 = poi.name.indexOf('_', index + 1);

                const strSensorType = poi.name.substring(0, index).trim();
                const strZoneNo = poi.name.substring(index + 1, index2).trim();
                const strSensorNo = poi.name.substring(index2 + 1).trim();

                const index3 = strSensorType.indexOf('-');
                let sensorType = null, sensorSubType = null;

                if (index3 > 0) {
                    sensorType = parseInt(strSensorType.substring(0, index3).trim());
                    sensorSubType = parseInt(strSensorType.substring(index3 + 1).trim());
                }
                else {
                    sensorType = parseInt(strSensorType);
                }

                const zoneNo = parseInt(strZoneNo);
                const sensorNo = parseInt(strSensorNo);

                return [zoneNo, sensorNo, sensorType, sensorSubType];
            }
        }

        return [null, null, null, null];
    }

    addZoneSensors(zoneNo, visibleSensorTypes, textPoiManager) {
        const zone = this.spatialManager.getZone(zoneNo);

        if (zone?.sensors) {
            const alarmSensorNoMaps = this.getAlarmSensorNos(zoneNo);

            for (const typeName in zone.sensors) {
                let poiLayer = null;

                const sensors = zone.sensors[typeName];
                const alarmSensors = {};
                const isIndoor = zone.buildingNo !== null && zone.buildingNo !== undefined;
                this.addSensors(sensors, alarmSensorNoMaps, visibleSensorTypes, isIndoor, poiLayer, alarmSensors);
            }
        }
    }

    getAlarmSensorNos(zoneNo) {
        const alarmSensorNoMaps = {};
        const sensorAlarms = [...this._3dMaster.props.sensorAlarms];

        for (const sensorAlarm of sensorAlarms) {
            if (sensorAlarm.isAlarm) {
                alarmSensorNoMaps[sensorAlarm.sensorNo] = sensorAlarm.facilityType;
            }
        }

        return alarmSensorNoMaps;
    }

    addSensors(sensors, alarmSensorNoMaps, visibleSensorTypes, isIndoor, layer, alarmSensors) {
        const sprites = [];

        let sensorTypes = {};
        let visible = false;

        for (const sensor of sensors) {
            if (sensor.sensor && sensor.sensor.x !== null && sensor.sensor.y !== null && sensor.sensor.z !== null) {
                const code = sensor.sensor.subTypeNo === null ? sensor.sensor.sensor_ty_code.toString() : sensor.sensor.sensor_ty_code + "-" + sensor.sensor.subTypeNo;

                let sensorType = sensorTypes[code];

                if (!sensorType) {
                    sensorType = null;
                }

                if (sensorType === null) {
                    const [_sensorType, _visible] = this.getSensorType(sensor.sensor.sensor_ty_code, sensor.sensor.subTypeNo, visibleSensorTypes);
                    sensorType = _sensorType;
                    visible = _visible;
                }

                if (sensorType !== null) {
                    sensorTypes[code] = sensorType;
                }

                let image = PoiManager.getSensorTypeImage(sensorType);

                if (image) {
                    if (image === "door") {
                        image = this.setDoorImage(image, sensor);
                    }

                    const isAlarmSensor = alarmSensorNoMaps[sensor.sensor.sensor_sn];
                    const initStatus = isAlarmSensor ? PoiManager.PoiStatus.alarm : PoiManager.PoiStatus.normal;
                    const url = this.getSensorImageUrl(image);

                    const scale = isIndoor ? PoiManager.IndoorPoiScale : PoiManager.OutdoorPoiScale;
                    const sprite = this.addPOI(url, sensor.sensor.x, sensor.sensor.y, sensor.sensor.z, sensor.sensor.sensor_ty_code, scale, this.getSensorLayerKey(sensor.sensor), sensor.sensorZoneData, initStatus, layer);

                    if (sprite) {
                        sprite.name = PoiManager.getSensorKey(sensor.sensor.zone_sn, sensor.sensor.sensor_sn, sensor.sensor.sensor_ty_code, sensor.sensor.subTypeNo);
                        this.sensorPois[sprite.name] = sprite;

                        if (sensor.sensor.enab === false) {
                            this.changePoiObject(sprite, false, false, false, this.getPoiStatus(sprite));
                        }

                        sprite.parent.visible = visible;
                        sprites.push(sprite);

                        /*if (isAlarmSensor) {
                            if (this.isSelectedAlarmSensor(sensor.sensor.sensor_sn)) {
                                this.selectPoi(sprite);
                            }
                        }*/

                        if (isAlarmSensor) {
                            this.alarmPois[sprite.name] = sprite;
                            this.beginAlarmEffect(sprite);

                            if (this.isSelectedAlarmSensor(sensor.sensor.sensor_sn)) {
                                this.selectPoi(sprite);
                            }

                            if (alarmSensors) {
                                alarmSensors[sensor.sensor.sensor_sn] = true;
                            }                            
                        }
                    }
                }
            }
        }

        return sprites;
    }

    setDoorImage(image, sensor) {
        const _sensor = sensor.sensor;

        if (_sensor.isOpened === undefined) {
            const sensorZone = sensor.sensorZoneData?.sensorZone;

            if (sensorZone) {
                _sensor.isOpened = sensorZone.descp === null || sensorZone.descp.toLowerCase() === "closed" ? false : true;
            }
        }

        if (_sensor.isOpened) {
            return image + "-opened";
        }

        return image + "-closed";
    }

    isSelectedAlarmSensor(sensorNo) {
        const selectedAlarm = this._3dMaster.selectedAlarm;

        if (selectedAlarm) {
            return selectedAlarm.sensorNo === sensorNo;
        }

        return false;
    }

    addPOI(imgUrl, x, y, z, sensorTypeCode, scale, sensorLayerKey, sensorZoneData, initStatus = PoiManager.PoiStatus.normal, layer = null) {
        let spriteMaterial = this.spriteMaterials[imgUrl];

        if (!spriteMaterial) {
            if (sensorTypeCode === SdmsResource.facilityType.DOOR) {
                spriteMaterial = this.setDoorMaterial(imgUrl);
            }
            else {
                const spriteMap = new THREE.TextureLoader().load(imgUrl);
                spriteMaterial = new THREE.SpriteMaterial({ map: spriteMap, color: 0xffffff });
                spriteMaterial.name = this.getPoiType(imgUrl);
                this.spriteMaterials[imgUrl] = spriteMaterial;

                const [selectedImageUrl, spriteMaterialSelected] = this.registSelectedImage(imgUrl);
                const [hoverImageUrl, spriteMaterialHover] = this.registHoverImage(imgUrl);
                const [alarmImageUrl, spriteMaterialAlarm] = this.registAlarmImage(imgUrl);
                const [alarmHoverImageUrl, spriteMaterialAlarmHover] = this.registAlarmHoverImage(imgUrl);
                const [alarmSelectedImageUrl, spriteMaterialAlarmSelected] = this.registAlarmSelectedImage(imgUrl);
                const [disabledImageUrl, spriteMaterialDisabled] = this.registDisabledImage(imgUrl);
                const [disabledHoverImageUrl, spriteMaterialDisabledHover] = this.registDisabledHoverImage(imgUrl);
                const [disabledSelectedImageUrl, spriteMaterialDisabledSelected] = this.registDisabledSelectedImage(imgUrl);

                if (sensorTypeCode === SdmsResource.facilityType.CCTV) {
                    const [masterSelectedImageUrl, spriteMaterialMasterSelected] = this.registMasterSelectedImage(imgUrl);
                    const [slaveSelectedImageUrl, spriteMaterialSlaveSelected] = this.registSlaveSelectedImage(imgUrl);

                    spriteMaterial.userData[PoiManager.PoiStatusType.master_selected] = masterSelectedImageUrl;
                    spriteMaterial.userData[PoiManager.PoiStatusType.slave_selected] = slaveSelectedImageUrl;
                    spriteMaterialMasterSelected.userData[PoiManager.PoiStatusType.master_selected] = masterSelectedImageUrl;
                    spriteMaterialMasterSelected.userData[PoiManager.PoiStatusType.slave_selected] = slaveSelectedImageUrl;
                    spriteMaterialSlaveSelected.userData[PoiManager.PoiStatusType.master_selected] = masterSelectedImageUrl;
                    spriteMaterialSlaveSelected.userData[PoiManager.PoiStatusType.slave_selected] = slaveSelectedImageUrl;

                    this.setMaterialUrl(spriteMaterialMasterSelected, imgUrl, hoverImageUrl, selectedImageUrl, alarmImageUrl, alarmHoverImageUrl, alarmSelectedImageUrl, disabledImageUrl, disabledHoverImageUrl, disabledSelectedImageUrl);
                    this.setMaterialUrl(spriteMaterialSlaveSelected, imgUrl, hoverImageUrl, selectedImageUrl, alarmImageUrl, alarmHoverImageUrl, alarmSelectedImageUrl, disabledImageUrl, disabledHoverImageUrl, disabledSelectedImageUrl);
                }

                this.setMaterials(spriteMaterial, spriteMaterialHover, spriteMaterialSelected, spriteMaterialAlarm, spriteMaterialAlarmHover, spriteMaterialAlarmSelected, spriteMaterialDisabled, spriteMaterialDisabledHover, spriteMaterialDisabledSelected, imgUrl, hoverImageUrl, selectedImageUrl, alarmImageUrl, alarmHoverImageUrl, alarmSelectedImageUrl, disabledImageUrl, disabledHoverImageUrl, disabledSelectedImageUrl);
            }
        }

        const urlType = this.getPoiImageUrlType(initStatus);

        if (urlType !== PoiManager.PoiImageUrlType.normal) {
            spriteMaterial = this.spriteMaterials[this.getImageURL(imgUrl, urlType)];
        }

        const [isPulsePoi, poiStatus] = PulseManager.isPulsePoi(this._getDoorPoiInfo(spriteMaterial));
        const sprite = /*isPulsePoi ? this._3dMaster.pulseManager.addPoi(poiStatus) : */new THREE.Sprite(spriteMaterial);

        sprite.scale.x *= 1.4 * scale;
        //sprite.scale.y *= 1.75 * scale;
        //sprite.scale.z *= 1.75 * scale;
        sprite.scale.y *= 1.4 * scale;
        sprite.scale.z *= 1.4 * scale;

        if (sensorTypeCode === SdmsResource.facilityType.DOOR) {
            if (PoiManager.isPointMaterial(spriteMaterial)) {
                sprite.scale.x *= PoiManager.PointScaleX;
                sprite.scale.y *= PoiManager.PointScaleY;
                sprite.scale.z *= PoiManager.PointScaleY;
                this.doorPointPois[sprite.id] = sprite;
            }
        }

        sprite.position.x = x;
        sprite.position.y = y;
        sprite.position.z = z;

        sprite.userData.origin = {
            scale: {
                x: sprite.scale.x,
                y: sprite.scale.y,
                z: sprite.scale.z
            },
            position: {
                x: x,
                y: y,
                z: z
            }
        };

        if (sensorZoneData && sensorTypeCode === SdmsResource.facilityType.DOOR) {
            sprite.userData.sensorZoneData = sensorZoneData;

            const [isClosed, isMouseOver, isSelected, isAlarm, isDisabled] = this._getDoorPoiInfo(sprite.material);

            if (isClosed) {
                this.setAlarmPoi(sprite, this.currentFireAlarm, false);
            }
        }

        if (isPulsePoi) {
            this._3dMaster.pulseManager.addPoi(sprite);
            //this._3dMaster.pulseManager.spawnSquare(true, sprite, sprite.position);
        }

        if (layer) {
            layer.add(sprite);
        }
        else {
            this.getSensorLayer(sensorLayerKey).add(sprite);
        }

        return sprite;
    }

    static isPointMaterial(material) {
        if (material.name.includes("point") || material.name.includes("important")) {
            return true;
        }

        return false;
    }

    static getDoorPointType(material) {
        if (material.name.includes("point")) {
            return PoiManager.DoorPointType.point;
        }
        else if (material.name.includes("important")) {
            return PoiManager.DoorPointType.important;
        }

        return PoiManager.DoorPointType.none;
    }

    setDoorMaterial(imgUrl, recursive = true, tagIndex = 0) {
        const isClosed = imgUrl.toLowerCase().includes("closed");

        let _imgUrl = imgUrl;
        let tag = null;
        let doorPointType = PoiManager.DoorPointType.none;

        if (tagIndex === 1 || tagIndex === 4) {
            doorPointType = PoiManager.DoorPointType.point;
            tag = "point";
            _imgUrl = this.setImageTag(imgUrl, tag);
        }
        else if (tagIndex === 2 || tagIndex === 5) {
            doorPointType = PoiManager.DoorPointType.important;
            tag = "important";
            _imgUrl = this.setImageTag(imgUrl, tag);
        }

        const spriteMap = new THREE.TextureLoader().load(_imgUrl);
        const spriteMaterial = new THREE.SpriteMaterial({ map: spriteMap, color: 0xffffff });
        spriteMaterial.name = this.getPoiType(_imgUrl);
        this.spriteMaterials[_imgUrl] = spriteMaterial;

        const [selectedImageUrl, spriteMaterialSelected] = this.registSelectedImage(imgUrl, tag);
        const [hoverImageUrl, spriteMaterialHover] = this.registHoverImage(imgUrl, tag);
        const [alarmImageUrl, spriteMaterialAlarm] = this.registAlarmImage(imgUrl, tag);
        const [alarmHoverImageUrl, spriteMaterialAlarmHover] = isClosed ? [null, null] : this.registAlarmHoverImage(imgUrl, tag);
        const [alarmSelectedImageUrl, spriteMaterialAlarmSelected] = isClosed ? [null, null] : this.registAlarmSelectedImage(imgUrl, tag);
        const [disabledImageUrl, spriteMaterialDisabled] = isClosed ? this.registDisabledImage(imgUrl, tag) : [null, null];
        const [disabledHoverImageUrl, spriteMaterialDisabledHover] = isClosed ? this.registDisabledHoverImage(imgUrl, tag) : [null, null];
        const [disabledSelectedImageUrl, spriteMaterialDisabledSelected] = isClosed ? this.registDisabledSelectedImage(imgUrl, tag) : [null, null];

        this._setDoorMaterial(isClosed, false, false, false, false, doorPointType, spriteMaterial);
        this._setDoorMaterial(isClosed, false, true, false, false, doorPointType, spriteMaterialSelected);
        this._setDoorMaterial(isClosed, true, false, false, false, doorPointType, spriteMaterialHover);
        this._setDoorMaterial(isClosed, false, false, true, false, doorPointType, spriteMaterialAlarm);
        this._setDoorMaterial(isClosed, true, false, true, false, doorPointType, spriteMaterialAlarmHover);
        this._setDoorMaterial(isClosed, false, true, true, false, doorPointType, spriteMaterialAlarmSelected);
        this._setDoorMaterial(isClosed, false, false, false, true, doorPointType, spriteMaterialDisabled);
        this._setDoorMaterial(isClosed, true, false, false, true, doorPointType, spriteMaterialDisabledHover);
        this._setDoorMaterial(isClosed, false, true, false, true, doorPointType, spriteMaterialDisabledSelected);

        /*if (isClosed) {
            if (tagIndex === 0 || tagIndex === 3) {
                this.closedDoorSpriteMaterial = spriteMaterial;
            }

            this.closedDoorSpriteMaterial.userData.isOpened = false;
        }
        else {
            if (tagIndex === 0 || tagIndex === 3) {
                this.openedDoorSpriteMaterial = spriteMaterial;
            }

            this.openedDoorSpriteMaterial.userData.isOpened = true;
        }*/

        this.setMaterials(spriteMaterial, spriteMaterialHover, spriteMaterialSelected, spriteMaterialAlarm, spriteMaterialAlarmHover, spriteMaterialAlarmSelected, spriteMaterialDisabled, spriteMaterialDisabledHover, spriteMaterialDisabledSelected, _imgUrl, hoverImageUrl, selectedImageUrl, alarmImageUrl, alarmHoverImageUrl, alarmSelectedImageUrl, disabledImageUrl, disabledHoverImageUrl, disabledSelectedImageUrl);

        if (recursive) {
            tagIndex++;

            if (tagIndex === 3) {
                const imgUrl2 = isClosed ? imgUrl.replace("closed", "opened") : imgUrl.replace("opened", "closed");
                imgUrl = imgUrl2;
            }

            if (tagIndex >= 6) {
                recursive = false;
            }

            this.setDoorMaterial(imgUrl, recursive, tagIndex);
        }

        return spriteMaterial;
    }

    getDoorPoiType(isMouseOver, isSelected, isAlarm, isDisabled) {
        if (isDisabled) {
            if (isMouseOver) {
                return PoiManager.PoiStatus.disabled_hover;
            }
            else if (isSelected) {
                return PoiManager.PoiStatus.disabled_selected;
            }
            else {
                return PoiManager.PoiStatus.disabled;
            }
        }
        else if (isMouseOver) {
            if (isAlarm) {
                return PoiManager.PoiStatus.alarm_hover;
            }
            else {
                return PoiManager.PoiStatus.hover;
            }
        }
        else if (isSelected) {
            if (isAlarm) {
                return PoiManager.PoiStatus.alarm_selected;
            }
            else {
                return PoiManager.PoiStatus.selected;
            }
        }
        else {
            if (isAlarm) {
                return PoiManager.PoiStatus.alarm;
            }
            else {
                return PoiManager.PoiStatus.normal;
            }
        }
    }

    getDoorMaterialType(isClosed, doorPointType) {
        if (isClosed) {
            if (doorPointType === PoiManager.DoorPointType.none) {
                return this.closedDoorSpriteMaterial;
            }
            else if (doorPointType === PoiManager.DoorPointType.point) {
                return this.closedDoorSpriteMaterialPoint;
            }
            else /*if (doorPointType === PoiManager.DoorPointType.important)*/ {
                return this.closedDoorSpriteMaterialImportant;
            }
        }
        else {
            if (doorPointType === PoiManager.DoorPointType.none) {
                return this.openedDoorSpriteMaterial;
            }
            else if (doorPointType === PoiManager.DoorPointType.point) {
                return this.openedDoorSpriteMaterialPoint;
            }
            else /*if (doorPointType === PoiManager.DoorPointType.important)*/ {
                return this.openedDoorSpriteMaterialImportant;
            }
        }
    }

    _getDoorMaterial(isClosed, isMouseOver, isSelected, isAlarm, isDisabled, doorPointType) {
        const poiType = this.getDoorPoiType(isMouseOver, isSelected, isAlarm, isDisabled);
        const doorMaterialType = this.getDoorMaterialType(isClosed, doorPointType);
        return doorMaterialType[poiType];
    }

    _setDoorMaterial(isClosed, isMouseOver, isSelected, isAlarm, isDisabled, doorPointType, material) {
        if (material) {
            const poiType = this.getDoorPoiType(isMouseOver, isSelected, isAlarm, isDisabled);
            const doorMaterialType = this.getDoorMaterialType(isClosed, doorPointType);
            doorMaterialType[poiType] = material;

            material.userData.isOpened = !isClosed;
        }
    }

    clearTemporaryPoi() {
        if (this.temporaryPoi?.parent) {
            this.temporaryPoi.parent.remove(this.temporaryPoi);
        }

        this.temporaryPoi = null;
    }

    addTemporaryPoi(sensor, zoneNo, visibleSensorTypes) {
        const zone = this.spatialManager.getZone(zoneNo);

        if (!zone) {
            return null;
        }

        zoneNo = zone.zoneNo;

        if (zone.datas) {
            if (zone.datas.poiElevation !== 0 && !zone.datas.poiElevation) {
                return null;
            }
        }
        else {
            return null;
        }

        const isIndoor = zone.buildingNo !== null && zone.buildingNo !== undefined;
        const [sensorType, _visible] = this.getSensorType(sensor.sensor_ty_code, sensor.subTypeNo, visibleSensorTypes);

        const image = PoiManager.getSensorTypeImage(sensorType);

        if (image) {
            const initStatus = PoiManager.PoiStatus.normal;
            const url = this.getSensorImageUrl(image);

            const scale = isIndoor ? PoiManager.IndoorPoiScale : PoiManager.OutdoorPoiScale;

            // 외부 지형일 경우 지형의 높낮이가 천차만별이므로 특정 Elevation으로 고정할수 없다.
            const y = this.getPoiElevation(isIndoor, zone);
            const sprite = this.addPOI(url, -100, y, -100, sensor.sensor_ty_code, scale, null, null, initStatus);

            if (sprite) {
                sensor.zone_sn = zoneNo;
                sprite.name = PoiManager.getSensorKey(zoneNo, sensor.sensor_sn, sensor.sensor_ty_code, sensor.subTypeNo);

                // Temporary 센서는 임시 POI이기 때문에 무조건 보이게 한다.
                sprite.visible = true;
                this.temporaryPoi = sprite;
                return sprite;
            }
        }

        return null;
    }

    getPoiElevation(isIndoor, zone) {
        if (isIndoor === false && this._3dMaster?.camera) {
            return this._3dMaster.camera.position.y - 10;
        }

        return zone.datas.poiElevation;
    }

    checkTemporaryPoi(poi) {
        if (this.temporaryPoi && this.temporaryPoi === poi) {
            const [sensorType, sensorSubType] = PoiManager.getSensorType(poi.name);
            const key = this.makeSensorLayerKey(sensorType, sensorSubType);

            // scene에서 sensorLayer로 옮긴다.
            this.scene.remove(poi);
            this.getSensorLayer(key).add(poi);

            const sensor = this._3dMaster?.props?.temporarySensor?.sensor;

            if (sensor) {
                sensor.x = poi.position.x;
                sensor.y = poi.position.y;
                sensor.z = poi.position.z;
                this._3dMaster.props.setTemporarySensor(null);
            }

            this.temporaryPoi = null;
            return true;
        }

        return false;
    }

    addPoiWithLabel(imgUrl, text, x, y, z, scale) {
        this.makePoiWithLabel(imgUrl, text).then(sprite => {
            sprite.position.set(x, y, z);
            sprite.scale.set(scale, scale, scale);
            this.getMarkLayer().add(sprite);
        });
    }

    async makePoiWithLabel(imgUrl, textLines) {
        if (this.markIconImage === null) {
            this.markIconImage = new Promise(res => {
                const img = new Image();
                img.src = imgUrl;
                img.onload = () => res(img);
            });
        }

        const iconImage = await this.markIconImage;

        const iconSize = 64;

        const canvas = document.createElement('canvas');
        canvas.width = 800;
        canvas.height = 800;

        const ctx = canvas.getContext('2d');

        // 배경을 투명하게 한다.
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        await new Promise(res => {
            if (iconImage.complete) {
                res();
            }
            else {
                iconImage.onload = res;
            }
        });

        // 아이콘을 중앙에 배치
        const iconX = (canvas.width - iconSize) / 2;
        const iconY = 20;

        ctx.drawImage(iconImage, iconX, iconY, iconSize, iconSize);

        ctx.font = 'bold 100px Arial';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'top';
        // 내부색
        ctx.fillStyle = 'white';
        // 외곽선
        ctx.strokeStyle = 'black';
        ctx.lineWidth = 8;

        const lineHeight = 120;
        // 첫번째 줄의 Y 위치
        const startY = iconY + iconSize + 40; // 아이콘 아래 여백
        const textX = canvas.width / 2;

        textLines.forEach((line, i) => {
            const y = startY + i * lineHeight;
            // 테두리 먼저 그리고 내부색 채우기
            ctx.strokeText(line, textX, y);
            ctx.fillText(line, textX, y);
        });

        // Texture 생성
        const texture = new THREE.CanvasTexture(canvas);
        texture.needsUpdate = true;

        const material = new THREE.SpriteMaterial({
            map: texture,
            transparent: true
        });

        const sprite = new THREE.Sprite(material);
        return sprite;
    }

    showMarkLayers(visible, pois) {
        const layerKey = "mark";
        const layer = this.getMarkLayer();

        if (visible) {
            if (layer.children.length === 0) {
                const url = this.getSensorImageUrl(layerKey);
                const scale = PoiManager.OutdoorPoiScale * 40;

                if (pois) {
                    for (const poi of pois) {
                        this.addPoiWithLabel(url, poi.names, poi.x, poi.y, poi.z, scale);
                    }
                }
            }
        }

        layer.visible = visible;
    }

    setMaterials(spriteMaterial, spriteMaterialHover, spriteMaterialSelected, spriteMaterialAlarm, spriteMaterialAlarmHover, spriteMaterialAlarmSelected, spriteMaterialDisabled, spriteMaterialDisabledHover, spriteMaterialDisabledSelected, imgUrl, hoverImageUrl, selectedImageUrl, alarmImageUrl, alarmHoverImageUrl, alarmSelectedImageUrl, disabledImageUrl, disabledHoverImageUrl, disabledSelectedImageUrl) {
        this.setMaterialUrl(spriteMaterial, imgUrl, hoverImageUrl, selectedImageUrl, alarmImageUrl, alarmHoverImageUrl, alarmSelectedImageUrl, disabledImageUrl, disabledHoverImageUrl, disabledSelectedImageUrl);
        this.setMaterialUrl(spriteMaterialHover, imgUrl, hoverImageUrl, selectedImageUrl, alarmImageUrl, alarmHoverImageUrl, alarmSelectedImageUrl, disabledImageUrl, disabledHoverImageUrl, disabledSelectedImageUrl);
        this.setMaterialUrl(spriteMaterialSelected, imgUrl, hoverImageUrl, selectedImageUrl, alarmImageUrl, alarmHoverImageUrl, alarmSelectedImageUrl, disabledImageUrl, disabledHoverImageUrl, disabledSelectedImageUrl);

        this.setMaterialUrl(spriteMaterialAlarm, imgUrl, hoverImageUrl, selectedImageUrl, alarmImageUrl, alarmHoverImageUrl, alarmSelectedImageUrl, disabledImageUrl, disabledHoverImageUrl, disabledSelectedImageUrl);
        this.setMaterialUrl(spriteMaterialAlarmHover, imgUrl, hoverImageUrl, selectedImageUrl, alarmImageUrl, alarmHoverImageUrl, alarmSelectedImageUrl, disabledImageUrl, disabledHoverImageUrl, disabledSelectedImageUrl);
        this.setMaterialUrl(spriteMaterialAlarmSelected, imgUrl, hoverImageUrl, selectedImageUrl, alarmImageUrl, alarmHoverImageUrl, alarmSelectedImageUrl, disabledImageUrl, disabledHoverImageUrl, disabledSelectedImageUrl);

        this.setMaterialUrl(spriteMaterialDisabled, imgUrl, hoverImageUrl, selectedImageUrl, alarmImageUrl, alarmHoverImageUrl, alarmSelectedImageUrl, disabledImageUrl, disabledHoverImageUrl, disabledSelectedImageUrl);
        this.setMaterialUrl(spriteMaterialDisabledHover, imgUrl, hoverImageUrl, selectedImageUrl, alarmImageUrl, alarmHoverImageUrl, alarmSelectedImageUrl, disabledImageUrl, disabledHoverImageUrl, disabledSelectedImageUrl);
        this.setMaterialUrl(spriteMaterialDisabledSelected, imgUrl, hoverImageUrl, selectedImageUrl, alarmImageUrl, alarmHoverImageUrl, alarmSelectedImageUrl, disabledImageUrl, disabledHoverImageUrl, disabledSelectedImageUrl);
    }

    setMaterialUrl(spriteMaterial, imgUrl, hoverImageUrl, selectedImageUrl, alarmImageUrl, alarmHoverImageUrl, alarmSelectedImageUrl, disabledImageUrl, disabledHoverImageUrl, disabledSelectedImageUrl) {
        if (spriteMaterial) {
            if (imgUrl) {
                spriteMaterial.userData[PoiManager.PoiStatusType.normal] = imgUrl;
            }

            if (hoverImageUrl) {
                spriteMaterial.userData[PoiManager.PoiStatusType.hover] = hoverImageUrl;
            }

            if (selectedImageUrl) {
                spriteMaterial.userData[PoiManager.PoiStatusType.selected] = selectedImageUrl;
            }

            if (alarmImageUrl) {
                spriteMaterial.userData[PoiManager.PoiStatusType.alarm] = alarmImageUrl;
            }

            if (alarmHoverImageUrl) {
                spriteMaterial.userData[PoiManager.PoiStatusType.alarm_hover] = alarmHoverImageUrl;
            }

            if (alarmSelectedImageUrl) {
                spriteMaterial.userData[PoiManager.PoiStatusType.alarm_selected] = alarmSelectedImageUrl;
            }

            if (disabledImageUrl) {
                spriteMaterial.userData[PoiManager.PoiStatusType.disabled] = disabledImageUrl;
            }

            if (disabledHoverImageUrl) {
                spriteMaterial.userData[PoiManager.PoiStatusType.disabled_hover] = disabledHoverImageUrl;
            }

            if (disabledSelectedImageUrl) {
                spriteMaterial.userData[PoiManager.PoiStatusType.disabled_selected] = disabledSelectedImageUrl;
            }
        }
    }

    setImageTag(imgUrl, tag) {
        if (tag === null) {
            return imgUrl;
        }

        const index = imgUrl.lastIndexOf('.');

        if (index < 0) {
            return imgUrl;
        }

        const header = imgUrl.substring(0, index);
        const tail = imgUrl.substring(index);
        return header + "_" + tag + tail;
    }

    registSelectedImage(imgUrl, tag = null) {
        return this.registImage(imgUrl, PoiManager.PoiImageUrlType.selected, tag);
    }

    registDisabledImage(imgUrl, tag = null) {
        return this.registImage(imgUrl, PoiManager.PoiImageUrlType.disabled, tag);
    }

    registDisabledSelectedImage(imgUrl, tag = null) {
        return this.registImage(imgUrl, PoiManager.PoiImageUrlType.disabled_selected, tag);
    }

    registDisabledHoverImage(imgUrl, tag = null) {
        return this.registImage(imgUrl, PoiManager.PoiImageUrlType.disabled_hover, tag);
    }

    registHoverImage(imgUrl, tag = null) {
        return this.registImage(imgUrl, PoiManager.PoiImageUrlType.hover, tag);
    }

    registAlarmImage(imgUrl, tag = null) {
        return this.registImage(imgUrl, PoiManager.PoiImageUrlType.alarm, tag);
    }

    registAlarmHoverImage(imgUrl, tag = null) {
        return this.registImage(imgUrl, PoiManager.PoiImageUrlType.alarm_hover, tag);
    }

    registAlarmSelectedImage(imgUrl, tag = null) {
        return this.registImage(imgUrl, PoiManager.PoiImageUrlType.alarm_selected, tag);
    }

    registMasterSelectedImage(imgUrl, tag = null) {
        return this.registImage(imgUrl, PoiManager.PoiImageUrlType.master_selected, tag);
    }

    registSlaveSelectedImage(imgUrl, tag = null) {
        return this.registImage(imgUrl, PoiManager.PoiImageUrlType.slave_selected, tag);
    }

    registImage(imgUrl, target, tag = null) {
        let targetImageUrl = this.getImageURL(imgUrl, target);
        targetImageUrl = this.setImageTag(targetImageUrl, tag);

        const spriteMap = new THREE.TextureLoader().load(targetImageUrl);
        const spriteMaterial = new THREE.SpriteMaterial({ map: spriteMap, color: 0xffffff });
        spriteMaterial.name = this.getPoiType(targetImageUrl);
        this.spriteMaterials[targetImageUrl] = spriteMaterial;

        return [targetImageUrl, spriteMaterial];
    }

    getImageURL(imgURL, target) {
        const dotIndex = imgURL.lastIndexOf('.');
        const index = imgURL.indexOf('_');

        const alarmTag = "alarm";
        const alarmIndex = imgURL.lastIndexOf(alarmTag);

        let ext = "";

        if (dotIndex > 0) {
            ext = imgURL.substring(dotIndex).trim();
        }

        if (alarmIndex > 0) {
            const fileName = imgURL.substring(0, alarmIndex + alarmTag.length);
            return fileName + target + ext;
        }
        else if (index > 0) {
            const fileName = imgURL.substring(0, index);
            return fileName + target + ext;
        }
        else if (dotIndex > 0) {
            const fileName = imgURL.substring(0, dotIndex);
            return fileName + target + ext;
        }

        return imgURL;
    }

    getSensorImageUrl(image) {
        const url = "/resource/image/icon/poi/" + image + ".png";
        return url;
    }

    getAlarmSensorImageUrl(image) {
        const url = "/resource/image/icon/poi/" + image + "_alarm.png";
        return url;
    }

    getPoiType(imgUrl) {
        const index2 = imgUrl.lastIndexOf('.');
        const index1 = imgUrl.lastIndexOf('/');

        if (index1 > 0 && index2 > index1) {
            return imgUrl.substring(index1 + 1, index2);
        }

        return imgUrl;
    }

    getPoiStatus(poi) {
        const materialName = poi.material?.name;

        if (materialName) {
            if (materialName.includes("alarm")) {
                if (materialName.includes("selected")) {
                    return PoiManager.PoiStatus.alarm_selected;
                }
                else if (materialName.includes("hover")) {
                    return PoiManager.PoiStatus.alarm_hover;
                }
                else {
                    return PoiManager.PoiStatus.alarm;
                }
            }
            else if (materialName.includes("disabled")) {
                if (materialName.includes("selected")) {
                    return PoiManager.PoiStatus.disabled_selected;
                }
                else if (materialName.includes("hover")) {
                    return PoiManager.PoiStatus.disabled_hover;
                }
                else {
                    return PoiManager.PoiStatus.disabled;
                }
            }
            else {
                if (materialName.includes("selected")) {
                    return PoiManager.PoiStatus.selected;
                }
                else if (materialName.includes("hover")) {
                    return PoiManager.PoiStatus.hover;
                }
            }
        }

        return PoiManager.PoiStatus.normal;
    }

    isAlarmPoi(poi) {
        const status = this.getPoiStatus(poi);

        if (status === PoiManager.PoiStatus.alarm || status === PoiManager.PoiStatus.alarm_hover || status === PoiManager.PoiStatus.alarm_selected) {
            return true;
        }

        return false;
    }

    getPoiImageUrlType(poiStatus) {
        if (poiStatus === PoiManager.PoiStatus.hover) {
            return PoiManager.PoiImageUrlType.hover;
        }
        else if (poiStatus === PoiManager.PoiStatus.selected) {
            return PoiManager.PoiImageUrlType.selected;
        }
        else if (poiStatus === PoiManager.PoiStatus.alarm) {
            return PoiManager.PoiImageUrlType.alarm;
        }
        else if (poiStatus === PoiManager.PoiStatus.alarm_hover) {
            return PoiManager.PoiImageUrlType.alarm_hover;
        }
        else if (poiStatus === PoiManager.PoiStatus.alarm_selected) {
            return PoiManager.PoiImageUrlType.alarm_selected;
        }
        else if (poiStatus === PoiManager.PoiStatus.disabled) {
            return PoiManager.PoiImageUrlType.disabled;
        }
        else if (poiStatus === PoiManager.PoiStatus.disabled_hover) {
            return PoiManager.PoiImageUrlType.disabled_hover;
        }
        else if (poiStatus === PoiManager.PoiStatus.disabled_selected) {
            return PoiManager.PoiImageUrlType.disabled_selected;
        }

        return PoiManager.PoiImageUrlType.normal;
    }

    getSensorType(sensorTypeCode, sensorSubType, visibleSensorTypes) {
        const code = sensorSubType === null ? sensorTypeCode.toString() : sensorTypeCode + "-" + sensorSubType;

        for (const sensorType in visibleSensorTypes) {
            if (sensorType.startsWith(code)) {
                return [sensorType, visibleSensorTypes[sensorType]];
            }
        }

        return ["", false];
    }

    getSensorLayer(key) {
        let layer = this.sensorLayers[key];

        if (!layer) {
            if (!this.baseSensorLayer) {
                const baseLayer = new THREE.Object3D();
                baseLayer.matrixAutoUpdate = false;
                baseLayer.name = "sensors_base";

                this.baseSensorLayer = baseLayer;
                this.scene.add(baseLayer);
            }

            layer = new THREE.Object3D();
            layer.matrixAutoUpdate = false;
            layer.name = "sensors_" + key;

            this.sensorLayers[key] = layer;
            this.baseSensorLayer.add(layer);
        }

        return layer;
    }

    getMarkLayer() {
        let layer = this.markLayer;

        if (!layer) {
            layer = new THREE.Object3D();
            layer.matrixAutoUpdate = false;
            layer.name = "mark";

            this.markLayer = layer;
            this.scene.add(layer);

            this.markLayer.visible = false;
        }

        return layer;
    }

    getSensorLayerKey(sensor) {
        return this.makeSensorLayerKey(sensor.sensor_ty_code, sensor.subTypeNo);
    }

    makeSensorLayerKey(sensorTypeCode, sensorSubTypeNo) {
        if (sensorSubTypeNo === null) {
            return sensorTypeCode.toString();
        }

        return sensorTypeCode.toString() + "-" + sensorSubTypeNo.toString();
    }

    removeSensors(sensorTypeCode, sensorSubTypeNo = null) {
        if (sensorTypeCode === null) {
            for (const key in this.sensorLayers) {
                const layer = this.sensorLayers[key];
                const childCount = layer.children.length;

                for (let i = childCount - 1; i >= 0; i--) {
                    const child = layer.children[i];
                    layer.remove(child);
                }
            }

            this.alarmPois = {};
            this.sensorPois = {};
        }
        else {
            const key = this.makeSensorLayerKey(sensorTypeCode, sensorSubTypeNo);
            const layer = this.sensorLayers[key];
            const childCount = layer.children.length;

            for (let i = childCount - 1; i >= 0; i--) {
                const child = layer.children[i];

                delete this.sensorPois[child.name];
                layer.remove(child);

                delete this.alarmPois[child.name];
            }
        }

        const doorPointPois = { ...this.doorPointPois };

        for (const id in doorPointPois) {
            delete this.doorPointPois[id];
        }

        this.doorPointPois = {};

        this._3dMaster.pulseManager.removePois();
    }

    hitTest(event, camera) {
        const x = event.nativeEvent.offsetX;
        const y = event.nativeEvent.offsetY;
        return this._hitTest(x, y, camera);
    }

    _hitTest(x, y, camera) {
        if (this._3dMaster.props.isEditMode) {
            const subMenu = this._3dMaster.props.editSubMenu;

            if (subMenu === SdmsResource.ID.poi_editSubMenu.move_poi || subMenu === SdmsResource.ID.poi_editSubMenu.add_poi) {
                const currentMovingPoi = this._3dMaster.editModeManager.editPoiManager.selectedPoi;

                if (currentMovingPoi) {
                    // 현재 이동중인 Poi
                    const [sensorType, sensorSubType] = PoiManager.getSensorType(currentMovingPoi.name);
                    return [currentMovingPoi, sensorType, sensorSubType];
                }
            }
        }

        const mouse = new THREE.Vector2((x / window.innerWidth) * 2 - 1, -(y / window.innerHeight) * 2 + 1);

        const raycaster = new THREE.Raycaster();
        raycaster.setFromCamera(mouse, camera);

        const intersects = raycaster.intersectObjects(this.scene.children, true);
        const intersectCount = intersects.length;

        let minDistance = null;
        let intersectObject = null;
        let _sensorType = null;
        let _sensorSubType = null;

        for (let i = 0; i < intersectCount; i++) {
            const intersect = intersects[i];

            if (intersect.object.visible === false || (intersect.object.parent && intersect.object.parent.visible === false)) {
                continue;
            }

            if (PoiManager.isSprite(intersect) && intersect.object.name.length > 0) {
                if (this.isTransparentArea(intersect)) {
                    continue;
                }

                const [sensorType, sensorSubType] = PoiManager.getSensorType(intersect.object.name);

                if (minDistance === null || minDistance > intersect.distance) {
                    minDistance = intersect.distance;
                    _sensorType = sensorType;
                    _sensorSubType = sensorSubType;
                    intersectObject = intersect.object;
                }

                //return [intersect.object, sensorType, sensorSubType];
            }
        }

        if (minDistance !== null) {
            return [intersectObject, _sensorType, _sensorSubType];
        }

        return [null, null, null];
    }

    isTransparentArea(intersect) {
        if (intersect.uv && intersect.object.material.map && intersect.object.material.map.image) {
            const canvas = intersect.object.material.map.image;

            if (canvas instanceof HTMLCanvasElement) {
                const ctx = canvas.getContext('2d');

                const xPixel = Math.floor(intersect.uv.x * canvas.width);
                const yPixel = Math.floor((1 - intersect.uv.y) * canvas.height);

                const pixel = ctx.getImageData(xPixel, yPixel, 1, 1).data;

                // alpha값이 거의 0이면 무시
                if (pixel[3] < 10) {
                    return true;
                }
            }
        }

        return false;
    }

    isPointDoor(poi) {
        if (!poi) {
            return false;
        }

        if (poi.name.startsWith(SdmsResource.facilityType.DOOR.toString())) {
            if (poi.material.name.includes("point") || poi.material.name.includes("important")) {
                return true;
            }
        }

        return false;
    }

    prevSetSelectedNull() {
        if (this.selectedPoi && this._3dMaster?.accessRouteManager?.prevSelectedAccessRoute) {
            const [zoneNo, sensorNo, sensorType, sensorSubType] = PoiManager.parseSensorKey(this.selectedPoi);

            if (this._3dMaster.accessRouteManager.prevSelectedAccessRoute.sensorNo === sensorNo) {
                return [true, null];
            }
        }

        return [null, null];
    }

    prevSetSelectedPoi(poi) {
        if (this.selectedPoi === poi) {
            return [false, null];
        }

        if (poi) {
            const accessRoutes = this._3dMaster.props.accessRoutes;

            if (accessRoutes) {
                const [zoneNo, sensorNo, sensorType, sensorSubType] = PoiManager.parseSensorKey(poi);

                for (const accessRoute of accessRoutes) {
                    if (accessRoute.sensorNo === sensorNo) {
                        return [true, accessRoute];
                    }
                }
            }
        }

        return [false, null];
    }

    selectPoi(poi) {
        let changeAccessRoute, parameter;

        if (poi) {
            const [_changeAccessRoute, _parameter] = this.prevSetSelectedPoi(poi);
            changeAccessRoute = _changeAccessRoute;
            parameter = _parameter;
            //const status = this.getPoiStatus(poi);

            if (this.selectedPoi !== poi) {
                if (this.selectedPoi) {
                    this.changePoi(this.selectedPoi, false, this.isMouseOverPoi(this.selectedPoi));
                }

                // 편집모드에서는 Poi 선택시 크기를 변경하지 않는다.
                //if (!this._3dMaster.props.isEditMode) {
                    this.changePoi(poi, true, this.isMouseOverPoi(poi));
                //}
            }
        }
        else {
            const [_changeAccessRoute, _parameter] = this.prevSetSelectedNull();
            changeAccessRoute = _changeAccessRoute;
            parameter = _parameter;

            if (this.selectedPoi) {
                this.changePoi(this.selectedPoi, false, this.isMouseOverPoi(this.selectedPoi));
            }

            if (this.selectedPoi === this.masterPoi) {
                this.masterPoi = null;
            }
        }

        this.selectedPoi = poi;

        if (!this.selectedPoi) {
            this.clearSlavePois();
            this.clearMasterPoi();
        }

        if (changeAccessRoute) {
            this._3dMaster.props.setSelectedAccessRoute(parameter);
        }
    }

    selectSensor(sensor) {
        if (!sensor) {
            return;
        }

        const sensorType = sensor.sensor_ty_code.toString();

        for (const key in this.sensorLayers) {
            if (key.startsWith(sensorType)) {
                const sensorLayer = this.sensorLayers[key];
                const children = [...sensorLayer.children];

                for (const poi of children) {
                    const [zoneNo, sensorNo, sensorType, sensorSubType] = PoiManager.parseSensorKey(poi);

                    if (sensorNo === sensor.sensor_sn) {
                        this.selectPoi(poi);
                        return;
                    }
                }
            }
        }
    }

    static selectSensorData(params) {
        if (params && params.length === 2) {
            const _this = params[0];
            const sensor = params[1];
            _this.selectSensor(sensor);
        }
    }

    // 상태가 바뀌지 전에 값을 미리 확인하기 위하여 selectMasterPoi(...) 이외에 별도로 마련해둔다.
    /*setMasterPoi(poi) {
        this.masterPoi = poi;
    }*/

    getMasterPoi() {
        return this.masterPoi;
    }

    selectMasterPoi(poi) {
        if (!poi) {
            this.clearMasterPoi();
            return this.selectPoi(null);
        }

        const [zoneNo, sensorNo, sensorType, sensorSubType] = PoiManager.parseSensorKey(poi);

        if (sensorType === SdmsResource.facilityType.CCTV) {
            if (this.selectedPoi !== poi) {
                if (this.selectedPoi) {
                    this.changeMasterPoi(this.selectedPoi, false, this.isMouseOverPoi(this.selectedPoi));
                }

                this.changeMasterPoi(poi, true, this.isMouseOverPoi(poi));
            }

            this.selectedPoi = poi;
        }
        else {
            this.selectPoi(poi);
        }

        if (this.masterPoi !== poi && this.masterPoi) {
            this.clearMasterPoi();
        }

        this.masterPoi = this.selectedPoi;
    }

    hoverPoi(poi) {
        if (poi) {
            if (this.mouseOverPoi !== poi) {
                if (this.mouseOverPoi) {
                    this.changePoi(this.mouseOverPoi, this.isSelectedPoi(this.mouseOverPoi), false);
                }

                this.changePoi(poi, this.isSelectedPoi(poi), true);
            }
        }
        else {
            if (this.mouseOverPoi) {
                this.changePoi(this.mouseOverPoi, this.isSelectedPoi(this.mouseOverPoi), false);
            }
        }

        this.mouseOverPoi = poi;
    }

    isSelectedPoi(poi) {
        if (this.selectedPoi) {
            if (poi === this.selectedPoi) {
                return true;
            }
        }

        return false;
    }

    isMouseOverPoi(poi) {
        if (this.mouseOverPoi) {
            if (poi === this.mouseOverPoi) {
                return true;
            }
        }

        return false;
    }

    changePoi(poi, isSelected, isMouseOver) {
        if (poi) {
            const sensor = this.getSensor(poi);

            if (sensor) {
                const enabled = sensor.enab === null || sensor.enab === undefined || sensor.enab === true;
                this.changePoiObject(poi.object ? poi.object : poi, isSelected, isMouseOver, enabled, this.getPoiStatus(poi));
            }
        }
    }

    changeMasterPoi(poi, isSelected, isMouseOver) {
        if (poi) {
            const sensor = this.getSensor(poi);

            if (sensor) {
                const enabled = sensor.enab === null || sensor.enab === undefined || sensor.enab === true;
                this.changeMasterPoiObject(poi.object ? poi.object : poi, isSelected, isMouseOver, enabled, this.getPoiStatus(poi));
            }
        }
    }

    changeSlavePoi(poi, isSelected, isMouseOver) {
        if (poi) {
            const sensor = this.getSensor(poi);

            if (sensor) {
                const enabled = sensor.enab === null || sensor.enab === undefined || sensor.enab === true;
                this.changeSlavePoiObject(poi.object ? poi.object : poi, isSelected, isMouseOver, enabled, this.getPoiStatus(poi));
            }
        }
    }

    getDoorPoiInfo(poi) {
        return this._getDoorPoiInfo(poi?.material);
    }

    _getDoorPoiInfo(material) {
        if (material) {
            if (material.name.includes("door")) {
                const isClosed = material.name.includes("closed");
                const isAlarm = material.name.includes("alarm");
                const isMouseOver = material.name.includes("hover");
                const isDisabled = material.name.includes("disabled");
                const isSelected = material.name.includes("selected");
                return [isClosed, isMouseOver, isSelected, isAlarm, isDisabled];
            }
        }

        return [null, null, null, null, null];
    }

    changeDoorPoi(poi, isOpened, doorPointType = PoiManager.DoorPointType.none) {
        if (poi) {
            const prevStatus = PoiManager.isPointMaterial(poi.material);

            const [isClosed, isMouseOver, isSelected, isAlarm, isDisabled] = this.getDoorPoiInfo(poi);

            if (isClosed === null) {
                return;
            }

            const targetMaterial = this._getDoorMaterial(!isOpened, isMouseOver, isSelected, isAlarm, isDisabled, doorPointType);

            if (targetMaterial) {
                poi.material = targetMaterial;

                if (isClosed !== !isOpened) {
                    if (isOpened) {
                        this._3dMaster.pulseManager.addPoi(poi);
                    }
                    else {
                        this._3dMaster.pulseManager.removePoi(poi);
                    }
                }

                const targetStatus = PoiManager.isPointMaterial(targetMaterial);

                if (prevStatus !== targetStatus) {
                    if (targetStatus) {
                        let targetXScale = PoiManager.PointScaleX;
                        let targetYScale = PoiManager.PointScaleY;

                        if (!isOpened && isAlarm) {
                            targetYScale = PoiManager.PointClosedDoorAlarmScaleY;
                        }

                        if (this.selectedPoi === poi) {
                            targetXScale *= PoiManager.SelectedPoiScale;
                            targetYScale *= PoiManager.SelectedPoiScale;
                        }

                        poi.scale.x = poi.userData.origin.scale.x * targetXScale;
                        poi.scale.y = poi.userData.origin.scale.y * targetYScale;
                        poi.scale.z = poi.userData.origin.scale.z * targetYScale;
                        //poi.scale.x *= PoiManager.PointScaleX;
                        //poi.scale.y *= PoiManager.PointScaleY;
                        //poi.scale.z *= PoiManager.PointScaleY;
                        this.doorPointPois[poi.id] = poi;
                    }
                    else {
                        let scaleY = 1;

                        if (!isOpened && isAlarm) {
                            scaleY = PoiManager.ClosedDoorAlarmScaleY;
                        }

                        poi.scale.x = poi.userData.origin.scale.x;
                        poi.scale.y = poi.userData.origin.scale.y * scaleY;
                        poi.scale.z = poi.userData.origin.scale.z * scaleY;
                        //poi.scale.x /= PoiManager.PointScaleX;
                        //poi.scale.y /= PoiManager.PointScaleY;
                        //poi.scale.z /= PoiManager.PointScaleY;
                        delete this.doorPointPois[poi.id];
                    }
                }
            }

            /*const status = this.getPoiStatus(poi);
            const material = poi.material;

            if (material.userData.isOpened !== isOpened) {
                poi.material = isOpened ? this.openedDoorSpriteMaterial : this.closedDoorSpriteMaterial;
            }

            const isSelected = status === PoiManager.PoiStatus.selected || status === PoiManager.PoiStatus.alarm_selected || status === PoiManager.PoiStatus.disabled_selected;
            const isMouseOver = status === PoiManager.PoiStatus.hover || status === PoiManager.PoiStatus.alarm_hover || status === PoiManager.PoiStatus.disabled_hover;
            this.changePoi(poi, isSelected, isMouseOver);*/
        }
    }

    resetDoorPois() {
        const doorPointPois = { ...this.doorPointPois };

        for (const id in doorPointPois) {
            const poi = doorPointPois[id];
            this.changeDoorPoi(poi, poi.material.userData.isOpened);
            delete this.doorPointPois[poi.id];
        }
        // 선택 상태(selectedPoi)는 여기서 건드리지 않는다.
        // 경로 초기화가 사용자의 POI 선택을 임의로 해제해서는 안 되며,
        // zone 이동 시의 selectedPoi 정리는 removeSensors(2107-2108)가 이미 담당한다.
        //if (this.selectedPoi?.material && this.selectedPoi.material.name.includes("door")) {
        //    this.selectedPoi = null;
        //}
    }

    getSensor(poi) {
        const [zoneNo, sensorNo, sensorType, sensorSubType] = PoiManager.parseSensorKey(poi);

        if (zoneNo !== null && sensorNo !== null) {
            const zone = this.spatialManager.zones[zoneNo];

            if (zone?.sensors) {
                for (const sensorTypeName in zone.sensors) {
                    const sensors = zone.sensors[sensorTypeName];

                    for (const sensor of sensors) {
                        if (sensor.sensor) {
                            if (sensor.sensor.sensor_ty_code !== sensorType) {
                                break;
                            }

                            if (sensor.sensor.sensor_sn === sensorNo) {
                                return sensor.sensor;
                            }
                        }
                    }
                }
            }

            // 배치 가능한 센서 목록 중에서 찾는다.
            return this._3dMaster.findSensorInAddedSensors(sensorNo, sensorType);
        }

        return null;
    }

    _getPoiStatusType(poi) {
        const poiStatus = this.getPoiStatus(poi);

        if (poiStatus === PoiManager.PoiStatus.normal) {
            return PoiManager.PoiStatusType.normal;
        }
        else if (poiStatus === PoiManager.PoiStatus.selected) {
            return PoiManager.PoiStatusType.selected;
        }
        else if (poiStatus === PoiManager.PoiStatus.hover) {
            return PoiManager.PoiStatusType.hover;
        }
        else if (poiStatus === PoiManager.PoiStatus.alarm) {
            return PoiManager.PoiStatusType.alarm;
        }
        else if (poiStatus === PoiManager.PoiStatus.alarm_hover) {
            return PoiManager.PoiStatusType.alarm_hover;
        }
        else if (poiStatus === PoiManager.PoiStatus.alarm_selected) {
            return PoiManager.PoiStatusType.alarm_selected;
        }
        else if (poiStatus === PoiManager.PoiStatus.disabled) {
            return PoiManager.PoiStatusType.disabled;
        }
        else if (poiStatus === PoiManager.PoiStatus.disabled_hover) {
            return PoiManager.PoiStatusType.disabled_hover;
        }
        else if (poiStatus === PoiManager.PoiStatus.disabled_selected) {
            return PoiManager.PoiStatusType.disabled_selected;
        }

        return null;
    }

    getPoiStatusType(isSelected, isMouseOver, enabled, poiStatus) {
        if (isSelected) {
            if (enabled) {
                if (poiStatus === PoiManager.PoiStatus.normal || poiStatus === PoiManager.PoiStatus.hover || poiStatus === PoiManager.PoiStatus.selected) {
                    return PoiManager.PoiStatusType.selected;
                }
                else if (poiStatus === PoiManager.PoiStatus.alarm || poiStatus === PoiManager.PoiStatus.alarm_hover || poiStatus === PoiManager.PoiStatus.alarm_selected) {
                    return PoiManager.PoiStatusType.alarm_selected;
                }
                else {
                    return PoiManager.PoiStatusType.disabled_selected;
                }
            }
            else {
                return PoiManager.PoiStatusType.disabled_selected;
            }
        }
        else if (isMouseOver) {
            if (enabled) {
                if (poiStatus === PoiManager.PoiStatus.normal || poiStatus === PoiManager.PoiStatus.hover || poiStatus === PoiManager.PoiStatus.selected) {
                    return PoiManager.PoiStatusType.hover;
                }
                else if (poiStatus === PoiManager.PoiStatus.alarm || poiStatus === PoiManager.PoiStatus.alarm_hover || poiStatus === PoiManager.PoiStatus.alarm_selected) {
                    return PoiManager.PoiStatusType.alarm_hover;
                }
                else {
                    return PoiManager.PoiStatusType.disabled_hover;
                }
            }
            else {
                return PoiManager.PoiStatusType.disabled_hover;
            }
        }
        else {
            if (enabled) {
                if (poiStatus === PoiManager.PoiStatus.normal || poiStatus === PoiManager.PoiStatus.hover || poiStatus === PoiManager.PoiStatus.selected) {
                    return PoiManager.PoiStatusType.normal;
                }
                else if (poiStatus === PoiManager.PoiStatus.alarm || poiStatus === PoiManager.PoiStatus.alarm_hover || poiStatus === PoiManager.PoiStatus.alarm_selected) {
                    return PoiManager.PoiStatusType.alarm;
                }
                else {
                    return PoiManager.PoiStatusType.disabled;
                }
            }
        }

        return PoiManager.PoiStatusType.disabled;
    }

    changePoiObject(obj, isSelected, isMouseOver, enabled, poiStatus) {
        let imgUrl = null;

        if (obj) {
            const poiStatusType = this.getPoiStatusType(isSelected, isMouseOver, enabled, poiStatus);
            imgUrl = obj.material.userData[poiStatusType];

            if (isSelected) {
                this.setPoiTargetScale(obj, PoiManager.SelectedPoiScale, PoiManager.MovingForwardTime);
            }
            else {
                this.setPoiTargetScale(obj, PoiManager.OriginPoiScale, PoiManager.MovingBackwardTime);
            }

            if (imgUrl && imgUrl.length > 0) {
                let spriteMaterial = this.spriteMaterials[imgUrl];

                if (!spriteMaterial) {
                    /*const spriteMap = new THREE.TextureLoader().load(imgUrl);
                    spriteMaterial = new THREE.SpriteMaterial({ map: spriteMap, color: 0xffffff });
                    spriteMaterial.name = this.getPoiType(imgUrl);
                    this.spriteMaterials[imgUrl] = spriteMaterial;

                    spriteMaterial.userData["origin"] = this.getImageURL(imgUrl, "");
                    spriteMaterial.userData["selected"] = this.getImageURL(imgUrl, "_selected");
                    spriteMaterial.userData["disabled"] = this.getImageURL(imgUrl, "_disabled");
                    spriteMaterial.userData["disabledSelected"] = this.getImageURL(imgUrl, "_disabled_selected");*/
                }

                obj.material = spriteMaterial;

                /*if (poiStatus === PoiManager.PoiStatus.alarm || poiStatus === PoiManager.PoiStatus.alarm_hover || poiStatus === PoiManager.PoiStatus.alarm_selected) {
                    this.alarmPois[obj.name] = obj;
                    this.beginAlarmEffect(obj);
                }
                else {
                    delete this.alarmPois[obj.name];
                }*/
            }
        }
    }

    changeMasterPoiObject(obj, isSelected, isMouseOver, enabled, poiStatus) {
        let imgUrl = null;

        if (obj) {
            let poiStatusType = this.getPoiStatusType(isSelected, isMouseOver, enabled, poiStatus);

            if (isSelected) {
                poiStatusType = PoiManager.PoiStatusType.master_selected;
            }

            imgUrl = obj.material.userData[poiStatusType];

            if (isSelected) {
                this.setPoiTargetScale(obj, PoiManager.SelectedPoiScale, PoiManager.MovingForwardTime);
            }
            else {
                this.setPoiTargetScale(obj, PoiManager.OriginPoiScale, PoiManager.MovingBackwardTime);
            }

            if (imgUrl && imgUrl.length > 0) {
                let spriteMaterial = this.spriteMaterials[imgUrl];

                if (!spriteMaterial) {
                    /*const spriteMap = new THREE.TextureLoader().load(imgUrl);
                    spriteMaterial = new THREE.SpriteMaterial({ map: spriteMap, color: 0xffffff });
                    spriteMaterial.name = this.getPoiType(imgUrl);
                    this.spriteMaterials[imgUrl] = spriteMaterial;

                    spriteMaterial.userData["origin"] = this.getImageURL(imgUrl, "");
                    spriteMaterial.userData["selected"] = this.getImageURL(imgUrl, "_selected");
                    spriteMaterial.userData["disabled"] = this.getImageURL(imgUrl, "_disabled");
                    spriteMaterial.userData["disabledSelected"] = this.getImageURL(imgUrl, "_disabled_selected");*/
                }

                obj.material = spriteMaterial;

                /*if (poiStatus === PoiManager.PoiStatus.alarm || poiStatus === PoiManager.PoiStatus.alarm_hover || poiStatus === PoiManager.PoiStatus.alarm_selected) {
                    this.alarmPois[obj.name] = obj;
                    this.beginAlarmEffect(obj);
                }
                else {
                    delete this.alarmPois[obj.name];
                }*/
            }
        }
    }

    changeSlavePoiObject(obj, isSelected, isMouseOver, enabled, poiStatus) {
        let imgUrl = null;

        if (obj) {
            let poiStatusType = this.getPoiStatusType(isSelected, isMouseOver, enabled, poiStatus);

            if (isSelected) {
                poiStatusType = PoiManager.PoiStatusType.slave_selected;
            }

            imgUrl = obj.material.userData[poiStatusType];

            if (isSelected) {
                this.setPoiTargetScale(obj, PoiManager.SelectedPoiScale, PoiManager.MovingForwardTime);
            }
            else {
                this.setPoiTargetScale(obj, PoiManager.OriginPoiScale, PoiManager.MovingBackwardTime);
            }

            if (imgUrl && imgUrl.length > 0) {
                let spriteMaterial = this.spriteMaterials[imgUrl];

                if (!spriteMaterial) {
                }

                obj.material = spriteMaterial;
            }
        }
    }

    static isClosedAlarmDoor(material) {
        if (material.name.includes("door") && material.name.includes("closed") && material.name.includes("alarm")) {
            return true;
        }

        return false;
    }

    setPoiTargetScale(obj, targetScale, movingTime) {
        if (!obj.userData.origin) {
            return;
        }

        const isPointMaterial = PoiManager.isPointMaterial(obj.material);
        const isClosedDoorAlarm = PoiManager.isClosedAlarmDoor(obj.material);

        let targetXScale = targetScale;
        let targetYScale = targetScale;

        if (isPointMaterial) {
            if (isClosedDoorAlarm) {
                targetYScale *= PoiManager.PointClosedDoorAlarmScaleY;
            }
            else {
                targetYScale *= PoiManager.PointScaleY;
            }

            targetXScale *= PoiManager.PointScaleX;
        }
        else if (isClosedDoorAlarm) {
            targetYScale *= PoiManager.ClosedDoorAlarmScaleY;
        }

        //const targetXScale = isPointMaterial ? targetScale * PoiManager.PointScaleX : targetScale;
        //const targetYScale = isPointMaterial ? targetScale * PoiManager.PointScaleY : targetScale;
        const targetZScale = targetYScale;

        if (isPointMaterial) {
            this.doorPointPois[obj.id] = obj;
        }

        obj.userData.targetScale = {
            tx: obj.userData.origin.scale.x * targetXScale,
            ty: obj.userData.origin.scale.y * targetYScale,
            tz: obj.userData.origin.scale.z * targetZScale,
            bx: obj.scale.x,
            by: obj.scale.y,
            bz: obj.scale.z,
            movingTime: movingTime,
            elapsedTime: 0
        };

        const index = this.smoothScalePois.indexOf(obj);

        if (index < 0) {
            this.smoothScalePois.push(obj);
        }
    }

    changePoiScale(obj, delta, index) {
        obj.userData.targetScale.elapsedTime += delta;

        const elapsedTime = obj.userData.targetScale.elapsedTime;
        const movingTime = obj.userData.targetScale.movingTime;

        if (elapsedTime >= movingTime) {
            obj.scale.x = obj.userData.targetScale.tx;
            obj.scale.y = obj.userData.targetScale.ty;
            obj.scale.z = obj.userData.targetScale.tz;

            this.smoothScalePois.splice(index, 1);

            if (this.isPointDoor(obj)) {
                // POI의 크기가 달라졌기 때문에 이동지점을 새로 그리도록 한다.
                this._3dMaster.contents3D.showDoorPoint(true, true);
            }
        }
        else {
            obj.scale.x = obj.userData.targetScale.bx + (obj.userData.targetScale.tx - obj.userData.targetScale.bx) * elapsedTime / movingTime;
            obj.scale.y = obj.userData.targetScale.by + (obj.userData.targetScale.ty - obj.userData.targetScale.by) * elapsedTime / movingTime;
            obj.scale.z = obj.userData.targetScale.bz + (obj.userData.targetScale.tz - obj.userData.targetScale.bz) * elapsedTime / movingTime;
        }
    }

    changePoiScales(delta) {
        const count = this.smoothScalePois.length;

        for (let i = count - 1; i >= 0; i--) {
            const poi = this.smoothScalePois[i];

            if (poi) {
                this.changePoiScale(poi, delta, i);
            }
        }
    }

    showBaseSensorLayer(visible) {
        if (this.baseSensorLayer) {
            this.baseSensorLayer.visible = visible;
        }
    }

    showSensorLayer(header, visible) {
        const sensorLayers = { ...this.sensorLayers };

        for (const layerName in sensorLayers) {
            if (layerName.startsWith(header)) {
                const layer = sensorLayers[layerName];
                layer.visible = visible;
            }
        }
    }

    clearAllAlarmPois() {
        for (const poiName in this.sensorPois) {
            const poi = this.sensorPois[poiName];
            const poiStatus = this.getPoiStatus(poi);
            let statusType = null;

            if (poiStatus === PoiManager.PoiStatus.alarm) {
                this.changePoi(poi, false, false);
                statusType = PoiManager.PoiStatusType.normal;
            }
            else if (poiStatus === PoiManager.PoiStatus.alarm_hover) {
                this.changePoi(poi, false, true);
                statusType = PoiManager.PoiStatusType.hover;
            }
            else if (poiStatus === PoiManager.PoiStatus.alarm_selected) {
                this.changePoi(poi, true, false);
                statusType = PoiManager.PoiStatusType.selected;
            }

            if (statusType && poi.material) {
                const imgUrl = poi.material.userData[statusType];
                const spriteMaterial = this.spriteMaterials[imgUrl];

                if (spriteMaterial) {
                    poi.material = spriteMaterial;
                }
            }
        }

        this.alarmPois = {};
    }

    setAlarmPoi(poi, isAlarm = true, alarmEffect = true) {
        const material = poi.material;

        if (!material) {
            return;
        }

        let statusType = this._getPoiStatusType(poi);
        const [zoneNo, sensorNo, sensorType, sensorSubType] = PoiManager.parseSensorKey(poi);

        if (isAlarm) {
            if (statusType === PoiManager.PoiStatusType.normal) {
                statusType = PoiManager.PoiStatusType.alarm;
            }
            else if (statusType === PoiManager.PoiStatusType.hover) {
                statusType = PoiManager.PoiStatusType.alarm_hover;
            }
            else if (statusType === PoiManager.PoiStatusType.selected) {
                statusType = PoiManager.PoiStatusType.alarm_selected;
            }
            else {
                return;
            }

            this.alarmPois[poi.name] = poi;

            if (alarmEffect) {
                this.beginAlarmEffect(poi);
            }
        }
        else {
            if (statusType === PoiManager.PoiStatusType.alarm) {
                statusType = PoiManager.PoiStatusType.normal;
            }
            else if (statusType === PoiManager.PoiStatusType.alarm_hover) {
                statusType = PoiManager.PoiStatusType.hover;
            }
            else if (statusType === PoiManager.PoiStatusType.alarm_selected) {
                // 알람이 해제되면 선택도 해제시킨다.
                statusType = PoiManager.PoiStatusType.normal;
                this.setPoiTargetScale(poi, PoiManager.OriginPoiScale, PoiManager.MovingBackwardTime);
            }
            else {
                return;
            }

            delete this.alarmPois[poi.name];

            if (this.selectedPoi === poi) {
                this.selectedPoi = null;
            }
        }

        const imgUrl = material.userData[statusType];
        const spriteMaterial = this.spriteMaterials[imgUrl];

        if (spriteMaterial) {
            poi.material = spriteMaterial;
            this.setDoorAlarmPoiScale(poi);
        }
    }

    setDoorAlarmPoiScale(poi) {
        const materialName = poi.material.name;

        if (materialName.includes("door")) {
            const pointMaterial = PoiManager.isPointMaterial(poi.material);
            const doorClosedAlarm = PoiManager.isClosedAlarmDoor(poi.material);

            if (doorClosedAlarm) {
                if (pointMaterial) {
                    poi.scale.set(poi.userData.origin.scale.x * PoiManager.PointScaleX, poi.userData.origin.scale.y * PoiManager.PointClosedDoorAlarmScaleY, poi.userData.origin.scale.z * PoiManager.PointClosedDoorAlarmScaleY);
                }
                else {
                    poi.scale.set(poi.userData.origin.scale.x, poi.userData.origin.scale.y * PoiManager.ClosedDoorAlarmScaleY, poi.userData.origin.scale.z * PoiManager.ClosedDoorAlarmScaleY);
                }
            }
            else if (pointMaterial) {
                poi.scale.set(poi.userData.origin.scale.x * PoiManager.PointScaleX, poi.userData.origin.scale.y * PoiManager.PointScaleY, poi.userData.origin.scale.z * PoiManager.PointScaleY);
            }
            else {
                poi.scale.set(poi.userData.origin.scale.x, poi.userData.origin.scale.y, poi.userData.origin.scale.z);
            }
        }
    }

    onFinishAlarmEffect(poiName) {
        const poi = this.alarmPois[poiName];

        if (poi) {
            this.beginAlarmEffect(poi);
        }
    }

    checkAlarmEffect(poi) {
        let blinkCount = poi.userData.alarmBlink;

        if (!blinkCount) {
            blinkCount = 0;
            poi.userData.alarmBlink = blinkCount;
        }

        blinkCount = blinkCount + 1;

        if (blinkCount > PoiManager.AlarmBlink) {
            delete poi.userData.alarmBlink;
            return false;
        }

        poi.userData.alarmBlink = blinkCount;
        return true;
    }

    beginAlarmEffect(poi) {
        if (this.alarmEffectManager.checkPoi(poi)) {
            return;
        }

        if (this.checkAlarmEffect(poi) === false) {
            return;
        }

        const worldPos = new THREE.Vector3();
        poi.getWorldPosition(worldPos);
        this.alarmEffectManager.spawnCircle(this._3dMaster.isIndoor(), poi, worldPos, 0xff0000);
    }

    // 연결된 CCTV Poi들을 활성화시킨다.
    selectSlavePois(cctvList) {
        if (!this.masterPoi) {
        //if (!this.selectedPoi) {
            this.clearSlavePois();
            return;
        }

        const slavePois = [...this.slavePois];

        if (!cctvList) {
            for (const poi of slavePois) {
                this.changeSlavePoi(poi, false, false);
            }

            this.slavePois = [];
        }
        else {
            const newSlavePois = [];

            for (const cctv of cctvList) {
                const poi = this.getSlavePoi(cctv.sensor_sn, slavePois);

                if (poi) {
                    newSlavePois.push(poi);
                }
                else {
                    const _poi = this.getCCTVPoi(cctv.sensor_sn);

                    if (_poi) {
                        newSlavePois.push(_poi);
                    }
                }
            }

            for (const poi of slavePois) {
                this.changeSlavePoi(poi, false, false);
            }

            for (const poi of newSlavePois) {
                this.changeSlavePoi(poi, true, false);
            }

            this.slavePois = newSlavePois;
        }
    }

    clearMasterPoi() {
        if (this.masterPoi !== null) {
            this.changePoi(this.masterPoi, false, false);
        }

        this.masterPoi = null;
    }

    clearSlavePois() {
        const slavePois = [...this.slavePois];

        for (const poi of slavePois) {
            this.changePoi(poi, false, false);
        }

        this.slavePois = [];
        this._3dMaster.props.cctvMappingManager.clearCurrentSensorNo();
    }

    getCCTVPoi(sensorNo) {
        const target = SdmsResource.facilityType.CCTV.toString();

        for (const key in this.sensorLayers) {
            if (key.startsWith(target)) {
                const cctvLayer = this.sensorLayers[key];

                if (cctvLayer) {
                    const children = [...cctvLayer.children];

                    for (const poi of children) {
                        const [zoneNo, _sensorNo, sensorType, sensorSubType] = PoiManager.parseSensorKey(poi);

                        if (sensorNo === _sensorNo) {
                            return poi;
                        }
                    }
                }
            }
        }
        
        return null;
    }

    getSlavePoi(sensorNo, slavePois) {
        const len = slavePois.length;

        for (let i = 0; i < len; i++) {
            const poi = slavePois[i];

            const [zoneNo, _sensorNo, sensorType, sensorSubType] = PoiManager.parseSensorKey(poi);

            if (sensorNo === _sensorNo) {
                slavePois.splice(i, 1);
                return poi;
            }
        }

        return null;
    }

    // 미개방 출입문 처리
    setClosedDoorAlarm(isAlarm) {
        const baseSensorLayer = this.baseSensorLayer;

        if (!baseSensorLayer) {
            return;
        }

        const doorType = SdmsResource.facilityType.DOOR.toString();

        for (let i = baseSensorLayer.children.length - 1; i >= 0; i--) {
            const layer = baseSensorLayer.children[i];

            if (layer.name.includes(doorType)) {
                for (let j = layer.children.length - 1; j >= 0; j--) {
                    const poi = layer.children[j];
                    this.setClosedDoorPoi(poi, isAlarm);
                }
            }
        }
    }

    setClosedDoorPoi(poi, isAlarm) {
        if (!poi.userData.sensorZoneData) {
            return;
        }

        const [isClosed, isMouseOver, isSelected, _isAlarm, isDisabled] = this._getDoorPoiInfo(poi.material);

        if (isClosed && isAlarm !== _isAlarm) {
            this.setAlarmPoi(poi, isAlarm, false);
        }
    }

    showPoint(visible) {
        const baseSensorLayer = this.baseSensorLayer;

        if (baseSensorLayer) {
            const doorType = SdmsResource.facilityType.DOOR.toString();

            for (let i = baseSensorLayer.children.length - 1; i >= 0; i--) {
                const layer = baseSensorLayer.children[i];

                if (layer.name.includes(doorType)) {
                    if (visible) {
                        this._showPoint(layer);
                    }
                    else {
                        this._hidePoint(layer);
                    }
                }
            }

            if (visible) {
                this.hidePointDoors = [];
            }
        }
    }

    _hidePoint(layer) {
        for (let i = layer.children.length - 1; i >= 0; i--) {
            const poi = layer.children[i];

            if (this.isPointDoor(poi)) {
                const [isClosed, isMouseOver, isSelected, isAlarm, isDisabled] = this._getDoorPoiInfo(poi.material);
                this.changeDoorPoi(poi, !isClosed);
                this.hidePointDoors.push(poi);
            }
        }
    }

    _showPoint(layer) {
        for (let i = layer.children.length - 1; i >= 0; i--) {
            const poi = layer.children[i];
            const index = this.hidePointDoors.indexOf(poi);

            if (index >= 0) {
                const [zoneNo, sensorNo, sensorType, sensorSubType] = PoiManager.parseSensorKey(poi);
                const [isClosed, isMouseOver, isSelected, isAlarm, isDisabled] = this._getDoorPoiInfo(poi.material);
                const doorPointType = this.isImportantDoor(sensorNo) ? PoiManager.DoorPointType.important : PoiManager.DoorPointType.point;
                this.changeDoorPoi(poi, !isClosed, doorPointType);
                this.hidePointDoors.splice(index, 1);
            }
        }
    }

    isImportantDoor(sensorNo) {
        const accessRoutes = this._3dMaster.props.accessRoutes;

        if (accessRoutes) {
            const routes = [...accessRoutes];

            for (const accessRoute of routes) {
                if (accessRoute.sensorNo === sensorNo) {
                    return accessRoute.isImportant;
                }
            }
        }

        return false;
    }

    setFireAlarm(isAlarm) {
        if (isAlarm !== this.currentFireAlarm) {
            this.currentFireAlarm = isAlarm;
            this.setClosedDoorAlarm(isAlarm);
        }
    }

    static getSensorType(sensorName) {
        if (sensorName) {
            const index = sensorName.indexOf('_');

            if (index > 0) {
                const header = sensorName.substring(0, index).trim();
                const index2 = header.indexOf('-');

                if (index2 > 0) {
                    const sensorType = header.substring(0, index2).trim();
                    const sensorSubType = header.substring(index2 + 1).trim();
                    return [parseInt(sensorType), parseInt(sensorSubType)];
                }
                else {
                    const sensorType = parseInt(header);

                    if (isNaN(sensorType)) {
                        return [header, null];
                    }
                    else {
                        return [sensorType, null];
                    }
                }
            }
        }

        return [null, null];
    }

    static isSprite(obj) {
        if (obj.object && obj.object.type === "Sprite") {
            return true;
        }

        return false;
    }

    static isDeletable(poi) {
        const [zoneNo, sensorNo, sensorType, sensorSubType] = PoiManager.parseSensorKey(poi);

        if (sensorType === SdmsResource.facilityType.CCTV) {
            return true;
        }

        return false;
    }
}
