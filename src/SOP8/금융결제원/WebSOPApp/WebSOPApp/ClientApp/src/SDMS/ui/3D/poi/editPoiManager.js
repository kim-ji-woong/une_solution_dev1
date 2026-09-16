import * as THREE from "three/build/three.module.js";
import SdmsResource from "../../../resource/id";
import { SDMSController } from "../../../services/sdmsController";
import { PoiManager } from "./poiManager";

export class EditPoiManager {
    constructor(editModeManager) {
        this.editModeManager = editModeManager;

        this.movedPois = [];
        this.deletedPois = [];
        this.addedPois = [];

        this.vOrigin = null;
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
            if (poi !== null) {
                this.vOrigin = new THREE.Vector3(poi.position.x, poi.position.y, poi.position.z);
            }

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

    delete(poi) {
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

            if (poi.userData?.circle?.group) {
                poi.userData.circle.group.visible = false;
            }
        }
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
                if (this.spatialManager) {
                    const sensor = spatialManager.getZoneSensor(zoneNo, sensorNo, sensorType);

                    if (sensor) {
                        poi.userData.origin.position.set(sensor.x, sensor.y, sensor.z);
                    }
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
        
        for (const poi of this.movedPois) {
            const updateData = this.makeUpdateData(poi);
            const [zoneNo, sensorNo, sensorType, sensorSubType] = PoiManager.parseSensorKey(poi);

            updateData.x = poi.position.x;
            updateData.y = poi.position.y;
            updateData.z = poi.position.z;
            updateData.zoneNo = zoneNo;
            updateData.deleted = false;

            updateDatas.push(updateData);
        }

        for (const poi of this.deletedPois) {
            const updateData = this.makeUpdateData(poi);

            updateData.deleted = true;
            updateDatas.push(updateData);
        }

        if (updateDatas.length > 0) {
            const [success, message] = await SDMSController.updateSensorDatas(userNo, updateDatas);

            if (success) {
                this.updateSensors();
            }
        }

        return [true, "update할 센서가 지정되지 않았습니다."];
    }

    updateSensors() {
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
            }
        }

        const deletedPois = [...this.deletedPois];

        for (const poi of deletedPois) {
            poi.visible = true;

            if (poi.userData?.circle?.group) {
                poi.userData.circle.group.visible = true;
            }

            if (poi.userData?.sensor) {
                poi.userData.sensor.deleted = false;
            }
        }

        this.movedPois = [];
        this.deletedPois = [];
        this.addedPois = [];
    }

    stop() {
        if (this.selectedPoi && this.vOrigin) {
            this.selectedPoi.position.set(this.vOrigin.x, this.vOrigin.y, this.vOrigin.z);
            this.selectedPoi = null;
            this.vOrigin = null;
        }
        else {
            this.editModeManager.changeMode(SdmsResource.ID.menu.editMode_poi, SdmsResource.ID.poi_editSubMenu.none);
        }
    }
}
