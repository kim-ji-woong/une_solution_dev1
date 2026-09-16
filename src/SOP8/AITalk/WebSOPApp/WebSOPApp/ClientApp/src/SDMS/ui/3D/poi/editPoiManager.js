import * as THREE from "three/build/three.module.js";
import { SDMSController } from "../../../services/sdmsController";
import { PoiManager } from "./poiManager";

export class EditPoiManager {
    constructor(editModeManager) {
        this.editModeManager = editModeManager;

        this.movedPois = [];
        this.deletedPois = [];

        this.selectedPoi = null;
        this.camera = null;
    }

    selectPoi(poi, camera) {
        if (this.selectedPoi !== null && this.selectedPoi === poi) {
            this.selectedPoi = null;
            this.camera = null;
            this.editModeManager.onMove(poi);
        }
        else {
            this.selectedPoi = poi;
            this.camera = camera;
        }
    }

    move(x, y) {
        const poi = this.selectedPoi;
        const camera = this.camera;

        if (poi && camera) {
            const [_x, _z] = this.screenToGlobal(x, y, camera);
            poi.position.set(_x, poi.position.y, _z);
        }
    }

    delete(poi) {
        if (this.deletedPois.includes(poi) === false) {
            this.deletedPois.push(poi);

            poi.visible = false;
        }
    }

    screenToGlobal(x, y, camera) {
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

            updateData.x = poi.position.x;
            updateData.y = poi.position.y;
            updateData.z = poi.position.z;

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

            const sensor = spatialManager.getZoneSensor(zoneNo, sensorNo, sensorType);

            if (sensor) {
                sensor.x = poi.position.x;
                sensor.y = poi.position.y;
                sensor.z = poi.position.z;
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
        }

        const deletedPois = [...this.deletedPois];

        for (const poi of deletedPois) {
            poi.visible = true;
        }

        this.movedPois = [];
        this.deletedPois = [];
    }
}
