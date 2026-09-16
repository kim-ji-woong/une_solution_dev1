import * as THREE from "three/build/three.module.js";
import { SDMSController } from "../../../services/sdmsController";
import { PoiManager } from "./poiManager";
import Vertex2D from "../../../../Common/util/Vertex2D";
import SdmsResource from "../../../resource/id";

export class EditPoiManager {
    constructor(editModeManager) {
        this.editModeManager = editModeManager;

        this.movedPois = [];
        this.deletedPois = [];
        this.addedPois = [];

        this.selectedPoi = null;
        this.camera = null;
    }

    selectPoi(poi, camera) {
        if (this.selectedPoi !== null && this.selectedPoi === poi) {
            this.selectedPoi = null;
            this.camera = null;

            this.editModeManager.onMove(poi);
            this.movePoiCircle(poi);

            return true;
        }
        else {
            this.selectedPoi = poi;
            this.camera = camera;
        }

        return false;
    }

    movePoiCircle(poi) {
        if (poi.userData?.circle?.group) {
            const worldPos = new THREE.Vector3();
            poi.getWorldPosition(worldPos);
            poi.userData.circle.group.position.set(worldPos.x, poi.userData.circle.group.position.y, worldPos.z);
        }
    }

    move(x, y) {
        const poi = this.selectedPoi;
        const camera = this.camera;

        if (poi && camera) {
            const [_x, _z] = EditPoiManager.screenToGlobal(x, y, camera);
            poi.position.set(_x, poi.position.y, _z);
        }
    }

    delete(poi, sensorNo) {
        if (this.deletedPois.includes(poi) === false) {
            const index1 = this.movedPois.indexOf(poi);

            if (index1 >= 0) {
                this.movedPois.splice(index1, 1);
            }
            else {
                const index2 = this.addedPois.indexOf(poi);

                if (index2 >= 0) {
                    this.addedPois.splice(index2, 1);
                }
                else {
                    this.deletedPois.push(poi);
                }
            }

            poi.visible = false;

            const poiManager = this.editModeManager._3dMaster?.poiManager;

            if (poiManager) {
                const sensor = poiManager.getSensor(poi);

                if (sensor) {
                    sensor.deleted = true;
                }
            }

            if (poi.userData?.circle?.group) {
                poi.userData.circle.group.visible = false;

                const movingScannerLayer = this.editModeManager._3dMaster?.textPoiManager?.movingScannerLayer;

                if (movingScannerLayer) {
                    const label = this.findMovingSannerLabel(movingScannerLayer, sensorNo);

                    if (label) {
                        label.visible = false;
                        return;
                    }
                }
            }
        }
    }

    findMovingSannerLabel(layer, sensorNo) {
        for (const child of layer.children) {
            if (child.userData.sensorNo === sensorNo) {
                return child;
            }
        }

        return null;
    }

    static screenToGlobal(x, y, camera) {
        const mouse = new THREE.Vector2((x / window.innerWidth) * 2 - 1, -(y / window.innerHeight) * 2 + 1);

        const raycaster = new THREE.Raycaster();
        raycaster.setFromCamera(mouse, camera);
        return [raycaster.ray.origin.x, raycaster.ray.origin.z];
    }

    onMove(poi, spatialManager) {
        if (this.movedPois.includes(poi) === false) {
            this.movedPois.push(poi);

            const [zoneNo, sensorNo, sensorType, sensorSubType] = PoiManager.parseSensorKey(poi);

            if (zoneNo && sensorNo && sensorType) {
                const poiManager = this.editModeManager._3dMaster?.poiManager;

                if (poiManager) {
                    const sensor = poiManager.getSensor(poi);

                    if (sensor) {
                        sensor.deleted = false;
                    }
                }

                if (sensorType === SdmsResource.facilityType.MOBILE_SCANNER) {
                    const movingScannerLayer = this.editModeManager._3dMaster?.textPoiManager?.movingScannerLayer;

                    // sensorNo를 사용하는 기존 Label이 있으면 삭제한다.
                    if (movingScannerLayer) {
                        const label = this.findMovingSannerLabel(movingScannerLayer, sensorNo);

                        if (label) {
                            label.parent.remove(label);
                        }
                    }

                    poiManager.addMovingScanerEffect(poi);
                }
            }

            if (this.spatialManager) {
                const sensor = spatialManager.getZoneSensor(zoneNo, sensorNo, sensorType);

                if (sensor) {
                    poi.userData.origin.position.set(sensor.x, sensor.y, sensor.z);
                }
            }
        }
    }

    setAddedPoi(poi) {
        if (poi) {
            this.addedPois.push(poi);

            // 배치 가능한 센서 목록 중에서 찾는다.
            const [zoneNo, sensorNo, sensorType, sensorSubType] = PoiManager.parseSensorKey(poi);
            const sensor = this.editModeManager._3dMaster.findSensorInAddedSensors(sensorNo, sensorType);

            if (sensor) {
                poi.userData.sensor = sensor;
                sensor.deleted = false;
            }
        }
    }

    isChanged() {
        if (this.movedPois.length > 0 || this.deletedPois.length > 0) {
            return true;
        }

        return false;
    }

    async savePois(userNo) {
        const updateDatas = [];
        const updateMovingScanerCCTVs = {};
        const deleteMovingScanerCCTVs = [];
        const movingScanerPoiInfos = [];
        const deletingScanerSensorNos = [];
        let updateMovingScanerCount = 0;

        for (const poi of this.movedPois) {
            const updateData = this.makeUpdateData(poi);
            const [zoneNo, sensorNo, sensorType, sensorSubType] = PoiManager.parseSensorKey(poi);

            updateData.x = poi.position.x;
            updateData.y = poi.position.y;
            updateData.z = poi.position.z;
            updateData.zoneNo = zoneNo;
            updateData.deleted = false;

            updateDatas.push(updateData);

            if (sensorType === SdmsResource.facilityType.MOBILE_SCANNER) {
                const cctvSensorNos = this.getNearCCTVs(zoneNo, updateData.x, updateData.z);

                if (cctvSensorNos.length > 0) {
                    movingScanerPoiInfos.push([sensorNo, updateData.x, updateData.y, updateData.z]);
                    const sensorZoneNo = this.getMovingScanerSensorZoneNo(zoneNo, sensorNo);

                    if (sensorZoneNo) {
                        updateMovingScanerCCTVs[sensorZoneNo] = cctvSensorNos;
                        updateMovingScanerCount++;
                    }
                }
            }
        }

        for (const poi of this.deletedPois) {
            const updateData = this.makeUpdateData(poi);

            updateData.deleted = true;
            updateDatas.push(updateData);

            const [zoneNo, sensorNo, sensorType, sensorSubType] = PoiManager.parseSensorKey(poi);

            if (sensorType === SdmsResource.facilityType.MOBILE_SCANNER) {
                deletingScanerSensorNos.push(sensorNo);
                const sensorZoneNo = this.getMovingScanerSensorZoneNo(zoneNo, sensorNo);

                if (sensorZoneNo) {
                    deleteMovingScanerCCTVs.push(sensorZoneNo);
                    updateMovingScanerCount++;
                }
            }
        }

        for (const poi of this.addedPois) {
            const [zoneNo, sensorNo, sensorType, sensorSubType] = PoiManager.parseSensorKey(poi);

            if (sensorType === SdmsResource.facilityType.MOBILE_SCANNER) {
                const poiManager = this.editModeManager?.poiManager;

                if (poiManager) {
                    const poiLayer = poiManager.getSensorLayer(PoiManager.MovingScanerPoi);

                    if (poiLayer) {
                        if (poi.parent) {
                            poi.parent.remove(poi);
                        }

                        poiLayer.add(poi);
                    }
                }
            }
        }

        if (updateDatas.length > 0) {
            const [success, message] = await SDMSController.updateSensorDatas(userNo, updateDatas);

            if (success) {
                this.updateSensors(movingScanerPoiInfos, deletingScanerSensorNos);
            }
        }

        if (updateMovingScanerCount > 0) {
            await SDMSController.requestUpdateSensorZoneCCTVs(updateMovingScanerCCTVs, deleteMovingScanerCCTVs);
        }

        return [true, "update할 센서가 지정되지 않았습니다."];
    }

    getMovingScanerSensorZoneNo(zoneNo, sensorNo) {
        const zone = this.editModeManager.spatialManager.getZone(zoneNo);

        if (zone?.sensors) {
            const typeName = SdmsResource.getFacilityTypeString(SdmsResource.facilityType.MOBILE_SCANNER);
            const sensors = zone.sensors[typeName];

            if (sensors) {
                for (const sensor of sensors) {
                    if (sensor.sensor?.sensor_sn === sensorNo) {
                        if (sensor.sensorZoneData?.sensorZone) {
                            return sensor.sensorZoneData.sensorZone.sensor_zone_sn;
                        }

                        return null;
                    }
                }
            }
            else {
                const sensorList = this.editModeManager?.poiManager?._3dMaster?.props?.addPOIsensorList;

                if (sensorList) {
                    for (const sensorInfo of sensorList) {
                        if (sensorInfo.sensors) {
                            for (const sensor of sensorInfo.sensors) {
                                if (sensor.sensor && sensor.sensor.sensor_sn === sensorNo) {
                                    if (sensor.sensorZoneData?.sensorZone) {
                                        return sensor.sensorZoneData.sensorZone.sensor_zone_sn;
                                    }

                                    return null;
                                }
                            }
                        }
                    }
                }
            }
        }

        return null;
    }

    getNearCCTVs(zoneNo, x, z) {
        const vPoi = new Vertex2D(x, z);

        const results = [];
        const zone = this.editModeManager.spatialManager.getZone(zoneNo);

        if (zone?.sensors) {
            const cctvs = [];
            const typeName = SdmsResource.getFacilityTypeString(SdmsResource.facilityType.CCTV);
            const sensors = zone.sensors[typeName];

            for (const sensor of sensors) {
                if (sensor.cctv && sensor.sensor && sensor.sensor.x !== null && sensor.sensor.x !== undefined && sensor.sensor.z !== null && sensor.sensor.z !== undefined) {
                    const vSensor = new Vertex2D(sensor.sensor.x, sensor.sensor.z);
                    const distance = vPoi.getDistance(vSensor);

                    vSensor.sensor = sensor;
                    vSensor.distance = distance;
                    cctvs.push(vSensor);
                }
            }

            const len = cctvs.length;

            if (len > 0) {
                cctvs.sort((a, b) => {
                    if (a.distance > b.distance) {
                        return 1;
                    }
                    else if (a.distance < b.distance) {
                        return -1;
                    }

                    return 0;
                });
            }

            for (let i = 0; i < len && i < 4; i++) {
                const sensorNo = cctvs[i].sensor.sensor.sensor_sn;
                results.push(sensorNo);
            }
        }

        return results;
    }

    updateSensors(movingScanerPoiInfos, deletingScanerSensorNos) {
        const spatialManager = this.editModeManager.spatialManager;

        if (!spatialManager) {
            return;
        }

        const movedPois = [...this.movedPois];

        for (const poi of movedPois) {
            const [zoneNo, sensorNo, sensorType, sensorSubType] = PoiManager.parseSensorKey(poi);

            let sensor = spatialManager.getZoneSensor(zoneNo, sensorNo, sensorType);

            if (!sensor) {
                if (poi.userData.sensor) {
                    sensor = poi.userData.sensor;
                }
            }

            if (sensor) {
                sensor.x = poi.position.x;
                sensor.y = poi.position.y;
                sensor.z = poi.position.z;

                sensor.zone_sn = zoneNo;
                sensor.deleted = false;

                if (this.addedPois.includes(poi)) {
                    spatialManager.addZoneSensor(zoneNo, sensor, poi.userData.cctv);
                }
            }
        }

        for (const info of movingScanerPoiInfos) {
            const sensorNo = info[0];
            const x = info[1];
            const y = info[2];
            const z = info[3];
            this.editModeManager._3dMaster.movingScannerPoiManager.updatePoiPosition(sensorNo, x, y, z, this.editModeManager._3dMaster.poiManager);
        }

        for (const sensorNo of deletingScanerSensorNos) {
            this.editModeManager._3dMaster.movingScannerPoiManager.removeLabel(sensorNo);
        }

        const deletedPois = [...this.deletedPois];

        for (const poi of deletedPois) {
            const [zoneNo, sensorNo, sensorType, sensorSubType] = PoiManager.parseSensorKey(poi);

            poi.parent.remove(poi);
            spatialManager.removeZoneSensor(zoneNo, sensorNo, sensorType);
        }

        this.movedPois = [];
        this.deletedPois = [];
        this.addedPois = [];
    }

    makeUpdateData(poi) {
        const [zoneNo, sensorNo, sensorType, sensorSubType] = PoiManager.parseSensorKey(poi);

        const updateData = {
            "sensorNo": sensorNo,
            "deleted": false
        };

        return updateData;
    }

    reset() {
        const movedPois = [...this.movedPois];

        for (const poi of movedPois) {
            poi.position.set(poi.userData.origin.position.x, poi.userData.origin.position.y, poi.userData.origin.position.z);
            this.movePoiCircle(poi);
        }

        const temporaryPoi = this.selectedPoi;

        // poi 이동 도중에 종료된 경우
        if (temporaryPoi?.userData?.origin?.position) {
            temporaryPoi.position.set(temporaryPoi.userData.origin.position.x, temporaryPoi.userData.origin.position.y, temporaryPoi.userData.origin.position.z);
            this.movePoiCircle(temporaryPoi);
            this.selectedPoi = null;
        }

        const poiManager = this.editModeManager._3dMaster?.poiManager;

        if (poiManager) {
            poiManager.clearTemporaryPoi();
        }

        const addedPois = [...this.addedPois];

        for (const poi of addedPois) {
            if (poi.userData.sensor) {
                poi.userData.sensor.deleted = true;

                if (poiManager.isMovingScaner(poi)) {
                    poiManager.removeMovingScaner(poi.userData.sensor.sensor_sn, poi.name);
                }

                if (poi.parent) {
                    poi.parent.remove(poi);
                }
            }
        }

        const deletedPois = [...this.deletedPois];

        for (const poi of deletedPois) {
            poi.visible = true;

            if (poiManager) {
                const sensor = poiManager.getSensor(poi);

                if (sensor) {
                    sensor.deleted = false;
                }
            }

            if (poi.userData?.circle?.group) {
                poi.userData.circle.group.visible = true;

                const movingScannerLayer = this.editModeManager._3dMaster?.textPoiManager?.movingScannerLayer;

                if (movingScannerLayer) {
                    const [zoneNo, sensorNo, sensorType, sensorSubType] = PoiManager.parseSensorKey(poi);
                    const label = this.findMovingSannerLabel(movingScannerLayer, sensorNo);

                    if (label) {
                        label.visible = true;
                    }
                }
            }

            if (poi.userData?.sensor) {
                poi.userData.sensor.deleted = false;
            }
        }

        this.movedPois = [];
        this.deletedPois = [];
        this.addedPois = [];
    }
}
