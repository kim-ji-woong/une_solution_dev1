import * as THREE from "three/build/three.module.js";
import SdmsResource from "../../../resource/id";
import { SDMSController } from "../../../services/sdmsController";
import { EditPoiManager } from "./editPoiManager";

export class LabelMovingManager {
    constructor(editModeManager) {
        this.editModeManager = editModeManager;
        this.movedLabels = [];
        
        this.selectedLabel = null;
        this.vOrigin = null;

        // Click한 마우스의 위치와 Label의 위치간의 간격
        this.movingPos = [0, 0];
    }

    selectLabel(label, camera, x, y) {
        if (this.selectedLabel !== null && this.selectedLabel === label) {
            this.selectedLabel = null;
            this.camera = null;

            this.onMove(label);
            return true;
        }
        else {
            if (label) {
                this.vOrigin = new THREE.Vector3(label.position.x, label.position.y, label.position.z);
            }

            this.selectedLabel = label;
            this.camera = camera;
            this.setMovingPosition(x, y, camera, label);
        }

        return false;
    }

    setMovingPosition(x, y, camera, label) {
        if (label) {
            if (!label.userData.origin) {
                label.userData.origin = {
                    position: new THREE.Vector3(label.position.x, label.position.y, label.position.z)
                };
            }

            const [_x, _z] = EditPoiManager.screenToGlobal(x, y, camera);
            this.movingPos[0] = label.position.x - _x;
            this.movingPos[1] = label.position.z - _z;
        }
    }

    move(x, y) {
        if (!this.selectedLabel) {
            return;
        }

        const label = this.selectedLabel;
        const camera = this.camera;

        if (label && camera) {
            const [_x, _z] = EditPoiManager.screenToGlobal(x, y, camera);
            label.position.set(_x + this.movingPos[0], label.position.y, _z + this.movingPos[1]);
        }
    }

    onMove(label) {
        if (!label || label.userData.origin?.position) {
            if (label) {
                if (this.movedLabels.includes(label) === false) {
                    this.movedLabels.push(label);
                }
            }

            return;
        }

        const spatialManager = this.editModeManager._3dMaster.props.spatialManager;

        if (this.movedLabels.includes(label) === false) {
            this.movedLabels.push(label);

            const zoneNo = this.editModeManager._3dMaster.props.currentModel.currentZoneNo;
            const equipZoneNo = this.editModeManager._3dMaster.textPoiManager.getEquipZoneNo(label);

            if (zoneNo && equipZoneNo) {
                if (spatialManager) {
                    const zone = spatialManager.getZone(zoneNo);

                    if (zone) {
                        const equipZone = spatialManager.getEquipZone(zone, equipZoneNo);

                        if (equipZone) {
                            label.userData.origin = {
                                position: new THREE.Vector3(equipZone.x, equipZone.y, equipZone.z)
                            }
                        }
                    }
                }
            }
        }
    }

    stop() {
        if (this.selectedLabel && this.vOrigin) {
            this.selectedLabel.position.set(this.vOrigin.x, this.vOrigin.y, this.vOrigin.z);
            this.selectedLabel = null;
            this.vOrigin = null;
        }
        else {
            this.editModeManager.changeMode(SdmsResource.ID.menu.editMode_areaName, SdmsResource.ID.poi_editSubMenu.none);
        }
    }

    isChanged() {
        if (this.movedLabels.length > 0) {
            return true;
        }

        return false;
    }

    async save(editEquipZoneManager) {
        const updateDatas = {};

        const movedLabels = [...this.movedLabels];

        for (const label of movedLabels) {
            const equipZoneNo = this.editModeManager._3dMaster.textPoiManager.getEquipZoneNo(label);
            const updateData = this.makeUpdateData(label.position.x, label.position.y, label.position.z, null);

            updateDatas[equipZoneNo] = updateData;
        }

        const changedEquipZoneNames = editEquipZoneManager.getChangedEquipZoneNames();

        for (const equipZoneNo in changedEquipZoneNames) {
            const equipZoneName = changedEquipZoneNames[equipZoneNo];

            let updateData = updateDatas[equipZoneNo];

            if (!updateData) {
                updateData = this.makeUpdateData(null, null, null, equipZoneName);
                updateDatas[equipZoneNo] = updateData;
            }

            updateData.name = equipZoneName;
        }

        const [success, message] = await SDMSController.UpdateEquipZoneList(this.toArray(updateDatas));

        if (success) {
            this.clear();
        }

        this.resetSelectedLabel();
        return [success, message];
    }

    resetSelectedLabel() {
        const label = this.selectedLabel;

        if (label) {
            if (label.userData.origin?.position) {
                label.position.set(label.userData.origin.position.x, label.userData.origin.position.y, label.userData.origin.position.z);
                label.userData.origin = undefined;
            }
        }

        this.selectedLabel = null;
    }

    reset() {
        for (const label of this.movedLabels) {
            if (label.userData.origin?.position) {
                label.position.set(label.userData.origin.position.x, label.userData.origin.position.y, label.userData.origin.position.z);
                label.userData.origin = undefined;
            }
        }

        const temporaryLabel = this.selectedLabel;

        // 이동하는 도중에 종료된 경우
        if (temporaryLabel?.userData?.origin?.position) {
            temporaryLabel.position.set(temporaryLabel.userData.origin.position.x, temporaryLabel.userData.origin.position.y, temporaryLabel.userData.origin.position.z);
            temporaryLabel.userData.origin = undefined;
            this.selectedLabel = null;
        }

        this.movedLabels = [];
        this.resetSelectedLabel();
    }

    clear() {
        for (const label of this.movedLabels) {
            label.userData.origin = undefined;
        }

        this.movedLabels = [];
        this.resetSelectedLabel();
    }

    makeUpdateData(x, y, z, name) {
        return { x, y, z, name, equipZoneNo: null };
    }

    toArray(updateDatas) {
        const datas = [];

        for (const equipZoneNo in updateDatas) {
            const updateData = updateDatas[equipZoneNo];
            updateData.equipZoneNo = parseInt(equipZoneNo);
            datas.push(updateData);
        }

        return datas;
    }
}