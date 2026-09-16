import * as THREE from "three/build/three.module.js";

export class PoiManager {
    static OutdoorPoiScale = 6;
    static SelectedPoiScale = 2;
    static IndoorPoiScale = 1;
    static EquipZonePoiScale = 1.5;
    static OriginPoiScale = 1;

    static MovingForwardTime = 0.75;
    static MovingBackwardTime = 0.5;

    static Fire_Sensor = "300300_화재센서_fire";
    static CCTV_Sensor = "300303_CCTV_cctv";
    static PSM_Sensor = "300311_누출센서_psm";
    static Etc_Sensor = "300321_기타센서_etc";
    static EquipZoneName = "구역명";

    static Worker = "작업자";
    static Visitor = "방문자";
    static PM25 = "미세먼지";
    static Sump = "집수정";

    constructor(scene, spatialManager) {
        this.scene = scene;
        this.spatialManager = spatialManager;

        this.spriteMaterials = { /*[url: string]: THREE.SpriteMaterial*/ };

        // 전체 센서 Layer
        this.baseSensorLayer = null;
        // 타입별 센서 Layer(SubType 고려)
        this.sensorLayers = {};
        // 전체 센서
        this.sensorPois = {};

        // icon Click시 poi 크기변경 옵션
        this.smoothScalePois = [];

        this.selectedPoi = null;
    }

    static getOriginVisibleSensorTypes() {
        const visibleSensorTypes = {};

        visibleSensorTypes[PoiManager.Fire_Sensor] = true;
        visibleSensorTypes[PoiManager.CCTV_Sensor] = true;
        visibleSensorTypes[PoiManager.PSM_Sensor] = true;
        visibleSensorTypes[PoiManager.Etc_Sensor] = true;
        visibleSensorTypes[PoiManager.EquipZoneName] = true;
        visibleSensorTypes[PoiManager.Worker] = true;
        visibleSensorTypes[PoiManager.Visitor] = true;
        visibleSensorTypes[PoiManager.PM25] = true;
        visibleSensorTypes[PoiManager.Sump] = true;

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

    addZoneSensors(zoneNo, visibleSensorTypes) {
        const zone = this.spatialManager.getZone(zoneNo);

        if (zone?.sensors) {
            for (const typeName in zone.sensors) {
                const sensors = zone.sensors[typeName];
                this.addSensors(sensors, visibleSensorTypes, zone.buildingNo !== null && zone.buildingNo !== undefined);
            }
        }
    }

    addSensors(sensors, visibleSensorTypes, isIndoor) {
        const sprites = [];

        let sensorType = null;
        let visible = false;

        for (const sensor of sensors) {
            if (sensor.sensor && sensor.sensor.x !== null && sensor.sensor.y !== null && sensor.sensor.z !== null) {
                if (sensorType === null) {
                    const [_sensorType, _visible] = this.getSensorType(sensor.sensor.sensor_ty_code, visibleSensorTypes);
                    sensorType = _sensorType;
                    visible = _visible;
                }

                const image = PoiManager.getSensorTypeImage(sensorType);

                if (image) {
                    const url = this.getSensorImageUrl(image);
                    const scale = isIndoor ? PoiManager.IndoorPoiScale : PoiManager.OutdoorPoiScale;
                    const sprite = this.addPOI(url, sensor.sensor.x, sensor.sensor.y, sensor.sensor.z, scale, this.getSensorLayerKey(sensor.sensor));

                    if (sprite) {
                        sprite.name = PoiManager.getSensorKey(sensor.sensor.zone_sn, sensor.sensor.sensor_sn, sensor.sensor.sensor_ty_code, sensor.sensor.subTypeNo);
                        this.sensorPois[sprite.name] = sprite;

                        if (sensor.sensor.enab === false) {
                            this.changePoiObject(sprite, false, false);
                        }

                        sprite.visible = visible;
                        sprites.push(sprite);
                    }
                }
            }
        }

        return sprites;
    }

    addPOI(imgUrl, x, y, z, scale, sensorLayerKey) {
        let spriteMaterial = this.spriteMaterials[imgUrl];

        if (!spriteMaterial) {
            const spriteMap = new THREE.TextureLoader().load(imgUrl);
            spriteMaterial = new THREE.SpriteMaterial({ map: spriteMap, color: 0xffffff });
            this.spriteMaterials[imgUrl] = spriteMaterial;

            const [selectedImageUrl, spriteMaterialSelected] = this.registSelectedImage(imgUrl);
            const [disabledImageUrl, spriteMaterialDisabled] = this.registDisabledImage(imgUrl);
            const [disabledSelectedImageUrl, spriteMaterialDisabledSelected] = this.registDisabledSelectedImage(imgUrl);
            
            this.setMaterials(spriteMaterial, spriteMaterialSelected, spriteMaterialDisabled, spriteMaterialDisabledSelected, imgUrl, selectedImageUrl, disabledImageUrl, disabledSelectedImageUrl);
        }

        const sprite = new THREE.Sprite(spriteMaterial);

        sprite.scale.x *= 1.4 * scale;
        //sprite.scale.y *= 1.75 * scale;
        //sprite.scale.z *= 1.75 * scale;
        sprite.scale.y *= 1.4 * scale;
        sprite.scale.z *= 1.4 * scale;

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

        this.getSensorLayer(sensorLayerKey).add(sprite);
        return sprite;
    }

    setMaterials(spriteMaterial, spriteMaterialSelected, spriteMaterialDisabled, spriteMaterialDisabledSelected, imgUrl, selectedImageUrl, disabledImageUrl, disabledSelectedImageUrl) {
        this.setMaterialUrl(spriteMaterial, imgUrl, selectedImageUrl, disabledImageUrl, disabledSelectedImageUrl);
        this.setMaterialUrl(spriteMaterialSelected, imgUrl, selectedImageUrl, disabledImageUrl, disabledSelectedImageUrl);
        this.setMaterialUrl(spriteMaterialDisabled, imgUrl, selectedImageUrl, disabledImageUrl, disabledSelectedImageUrl);
        this.setMaterialUrl(spriteMaterialDisabledSelected, imgUrl, selectedImageUrl, disabledImageUrl, disabledSelectedImageUrl);
    }

    setMaterialUrl(spriteMaterial, imgUrl, selectedImageUrl, disabledImageUrl, disabledSelectedImageUrl) {
        spriteMaterial.userData["origin"] = imgUrl;
        spriteMaterial.userData["selected"] = selectedImageUrl;
        spriteMaterial.userData["disabled"] = disabledImageUrl;
        spriteMaterial.userData["disabledSelected"] = disabledSelectedImageUrl;
    }

    registSelectedImage(imgUrl) {
        return this.registImage(imgUrl, "_selected");
    }

    registDisabledImage(imgUrl) {
        return this.registImage(imgUrl, "_disabled");
    }

    registDisabledSelectedImage(imgUrl) {
        return this.registImage(imgUrl, "_disabled_selected");
    }

    registImage(imgUrl, target) {
        const targetImageUrl = this.getImageURL(imgUrl, target);

        const spriteMap = new THREE.TextureLoader().load(targetImageUrl);
        const spriteMaterial = new THREE.SpriteMaterial({ map: spriteMap, color: 0xffffff });
        this.spriteMaterials[targetImageUrl] = spriteMaterial;

        return [targetImageUrl, spriteMaterial];
    }

    getImageURL(imgURL, target) {
        const dotIndex = imgURL.lastIndexOf('.');
        const index = imgURL.indexOf('_');

        let ext = "";

        if (dotIndex > 0) {
            ext = imgURL.substring(dotIndex).trim();
        }

        if (index > 0) {
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
        let url = "/resource/image/icon/poi/" + image + ".png";
        return url;
    }

    getSensorType(sensorTypeCode, visibleSensorTypes) {
        const code = sensorTypeCode.toString();

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
            }
        }
    }

    hitTest(event, camera) {
        const x = event.nativeEvent.offsetX;
        const y = event.nativeEvent.offsetY;
        const mouse = new THREE.Vector2((x / window.innerWidth) * 2 - 1, -(y / window.innerHeight) * 2 + 1);

        const raycaster = new THREE.Raycaster();
        raycaster.setFromCamera(mouse, camera);

        const intersects = raycaster.intersectObjects(this.scene.children, true);
        const intersectCount = intersects.length;

        for (let i = 0; i < intersectCount; i++) {
            const intersect = intersects[i];

            if (intersect.object.visible === false || (intersect.object.parent && intersect.object.parent.visible === false)) {
                continue;
            }

            if (PoiManager.isSprite(intersect) && intersect.object.name.length > 0) {
                const [sensorType, sensorSubType] = PoiManager.getSensorType(intersect.object.name);
                return [intersect.object, sensorType, sensorSubType];
            }
        }

        return [null, null, null];
    }

    selectPoi(poi) {
        if (poi) {
            if (this.selectedPoi !== poi) {
                if (this.selectedPoi) {
                    this.changePoi(this.selectedPoi, false);
                }

                this.changePoi(poi, true);
            }
        }
        else {
            if (this.selectedPoi) {
                this.changePoi(this.selectedPoi, false);
            }
        }

        this.selectedPoi = poi;
    }

    changePoi(poi, isSelected) {
        if (poi) {
            const sensor = this.getSensor(poi);

            if (sensor) {
                const enabled = sensor.enab === null || sensor.enab === undefined || sensor.enab === true;
                this.changePoiObject(poi.object ? poi.object : poi, isSelected, enabled);
            }
        }
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
        }

        return null;
    }

    changePoiObject(obj, isSelected, enabled) {
        let imgUrl = null;

        if (obj) {
            if (isSelected) {
                if (enabled) {
                    imgUrl = obj.material.userData["selected"];
                }
                else {
                    imgUrl = obj.material.userData["disabledSelected"];
                }

                this.setPoiTargetScale(obj, PoiManager.SelectedPoiScale, PoiManager.MovingForwardTime);
            }
            else {
                if (enabled) {
                    imgUrl = obj.material.userData["origin"];
                }
                else {
                    imgUrl = obj.material.userData["disabled"];
                }

                this.setPoiTargetScale(obj, PoiManager.OriginPoiScale, PoiManager.MovingBackwardTime);
            }

            if (imgUrl && imgUrl.length > 0) {
                let spriteMaterial = this.spriteMaterials[imgUrl];

                if (!spriteMaterial) {
                    const spriteMap = new THREE.TextureLoader().load(imgUrl);
                    spriteMaterial = new THREE.SpriteMaterial({ map: spriteMap, color: 0xffffff });
                    this.spriteMaterials[imgUrl] = spriteMaterial;

                    spriteMaterial.userData["origin"] = this.getImageURL(imgUrl, "");
                    spriteMaterial.userData["selected"] = this.getImageURL(imgUrl, "_selected");
                    spriteMaterial.userData["disabled"] = this.getImageURL(imgUrl, "_disabled");
                    spriteMaterial.userData["disabledSelected"] = this.getImageURL(imgUrl, "_disabled_selected");
                }

                obj.material = spriteMaterial;
            }
        }
    }

    setPoiTargetScale(obj, targetScale, movingTime) {
        if (!obj.userData.origin) {
            return;
        }

        obj.userData.targetScale = {
            tx: obj.userData.origin.scale.x * targetScale,
            ty: obj.userData.origin.scale.y * targetScale,
            tz: obj.userData.origin.scale.z * targetScale,
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
}
