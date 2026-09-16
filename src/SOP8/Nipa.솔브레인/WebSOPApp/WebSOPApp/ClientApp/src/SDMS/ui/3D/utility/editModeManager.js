import { SDMSController } from "../../../services/sdmsController";
import { EditPoiManager } from "../poi/editPoiManager";
import { PoiManager } from "../poi/poiManager";
import SDMSResource from '../../../resource/id';
import { FakeWallManager } from "./fakeWallManager";
import { EditEquipZoneManager } from "../poi/editEquipZoneManager";
import { _3dMaster } from "./_3dMaster";
import { CctvSlaveManager } from "./cctvMapping/cctvSlaveManager";
import { LabelMovingManager } from "../poi/labelMovingManager";
import { TextPoiManager } from "../poi/textPoiManager";
import * as THREE from "three/build/three.module.js";

export class EditModeManager {
    static msg_error = 0;
    static msg_info = 1;

    constructor() {
        this.editPoiManager = new EditPoiManager(this);
        this.fakeWallManager = new FakeWallManager(this);
        this.editEquipZoneManager = new EditEquipZoneManager(this);
        this.labelMovingManager = new LabelMovingManager(this);

        this.poiManager = null;

        this.onChange = null;
        this._messageHandler = null;
        this.somethingChanged = false;
    }

    set3dMaster(__3dMaster) {
        this._3dMaster = __3dMaster;
        this.editEquipZoneManager.set3dMaster(__3dMaster);
    }

    onClick(poi, camera, editMenu, event, zoneNo, spatialManager, scene) {
        const x = event.nativeEvent.offsetX;
        const y = event.nativeEvent.offsetY;
        const btn = event.button;
        let showPopupMenu = false;
        let resetEditingInput = true;

        const subMenu = this._3dMaster.props.editSubMenu;
        let finishMoving = false;

        if (editMenu === SDMSResource.ID.menu.editMode_poi) {
            if (subMenu === SDMSResource.ID.poi_editSubMenu.move_poi ||
                (subMenu === SDMSResource.ID.poi_editSubMenu.add_poi && this.editPoiManager.selectedPoi)) {
                if (btn === _3dMaster.MouseLButton) {
                    if (poi && poi.name.startsWith("text")) {
                        // textPoi는 poi 편집모드에서 선택할 수 없도록 한다.
                        return;
                    }

                    finishMoving = this.editPoiManager.selectPoi(poi, camera);
                }
            }

            if (subMenu === SDMSResource.ID.poi_editSubMenu.add_poi && this.poiManager?.temporaryPoi) {
                if (this.poiManager.checkTemporaryPoi(poi)) {
                    this.editPoiManager.setAddedPoi(poi);
                }
            }
            else {
                if (poi && btn === _3dMaster.MouseRButton && PoiManager.isDeletable(poi)) {
                    this.selectPoi(poi);
                    this._3dMaster.showDeletePoiMenu(x, y);
                    showPopupMenu = true;
                }
                else if (btn === _3dMaster.MouseLButton) {
                    this.selectPoi(poi, finishMoving);
                }
                else if (!poi && btn === _3dMaster.MouseRButton) {
                    this.selectPoi(null);
                }
            }
        }
        else if (editMenu === SDMSResource.ID.menu.editMode_fakeWall) {
            this.fakeWallManager.onClick(x, y, zoneNo, camera, spatialManager, scene);
        }
        else if (editMenu === SDMSResource.ID.menu.editMode_areaName) {
            if (subMenu === SDMSResource.ID.poi_editSubMenu.move_area && this.labelMovingManager.selectedLabel) {
                this.labelMovingManager.selectLabel(this.labelMovingManager.selectedLabel, this._3dMaster.camera, x, y);
            }
            else {
                const label = poi && TextPoiManager.isEquipmentZone(poi) ? poi : this._3dMaster.textPoiManager.select(x, y, TextPoiManager.EquipZoneNameText);

                if (label) {
                    if (subMenu === SDMSResource.ID.poi_editSubMenu.move_area) {
                        this.labelMovingManager.selectLabel(label, this._3dMaster.camera, x, y);
                    }
                    else if (subMenu === SDMSResource.ID.poi_editSubMenu.name_area) {
                        this.setEditEquipZoneText(label, null);
                        resetEditingInput = false;
                    }
                    else if (subMenu === SDMSResource.ID.poi_editSubMenu.cctv_area) {
                        const equipZoneNo = this._3dMaster.textPoiManager.getEquipZoneNo(label);

                        this.handleEditCCTVList('nameTag', equipZoneNo, equipZoneNo);
                        this._3dMaster.poiManager.selectMasterPoi(label);
                        this._3dMaster.textPoiManager.highlightEquipZoneLabel(label);
                    }
                }
                else if (poi) {
                    if (subMenu === SDMSResource.ID.poi_editSubMenu.cctv_area) {
                        CctvSlaveManager.onClickPoi(poi, this._3dMaster);
                        /*const [zoneNo, sensorNo, sensorType] = PoiManager.parseSensorKey(poi);
    
                        if (sensorNo) {
                            const sensorZoneNo = spatialManager.getSensorZoneNo(zoneNo, sensorNo, sensorType);
    
                            this.handleEditCCTVList('sensor', sensorZoneNo, sensorNo);
                        }
    
                        this.selectMasterPoi(poi, subMenu);*/
                    }
                }
                else {
                    this.selectPoi(null);
                    this._3dMaster.props.setEditCCTVList(null, null);
                    this._3dMaster.textPoiManager.clearEquipZoneHighlight();
                }
            }
        }

        if (resetEditingInput) {
            this.checkEditingLabel();
        }

        this.spatialManager = spatialManager;

        const changed = this.isChanged();
        this.onChange?.(changed);

        if (showPopupMenu === false) {
            this._3dMaster.showDeletePoiMenu(null, null);
        }

        if (this._3dMaster) {
            this._3dMaster.props.onChangedEdit(this.isChanged());

            if (resetEditingInput) {
                this.resetEditableInput();
            }
        }
    }

    checkEditingLabel() {
        const editingLabel = this.editEquipZoneManager.getEditingLabel();

        if (editingLabel) {
            const element = this._3dMaster?.contents3D?.refEditableInput?.current;

            if (element) {
                const [zoneNo, equipZoneNo, sensorType, sensorSubType] = PoiManager.parseSensorKey(editingLabel);
                this.editEquipZoneManager.changeEquipZoneName(equipZoneNo, element.value, zoneNo);
            }
        }
    }

    resetEditableInput() {
        const label = this.editEquipZoneManager.getEditingLabel();

        if (label) {
            const element = this._3dMaster?.contents3D?.refEditableInput?.current;

            if (element) {
                const [zoneNo, equipZoneNo, sensorType, sensorSubType] = PoiManager.parseSensorKey(label);

                this.editEquipZoneManager.setEditingLabel(null);
                this._3dMaster.setState({ editableInput: false });
                this._3dMaster.textPoiManager.updateEquipZoneText(label, element.value, zoneNo, equipZoneNo);
            }
        }
    }

    setEditEquipZoneText(label, event) {
        if (!label && event) {
            label = this._3dMaster.textPoiManager.select(event.nativeEvent.offsetX, event.nativeEvent.offsetY);
        }

        if (label) {
            if (TextPoiManager.isEquipmentZone(label)) {
                this.editEquipZoneManager.setEditingLabel(label);
                this.setInputTextPosition(label);
                label.visible = false;
            }
        }
    }

    setInputTextPosition(label) {
        const pos = new THREE.Vector3(label.position.x, label.position.y, label.position.z);

        // 카메라 기준으로 투영
        pos.project(this._3dMaster.camera);

        // 스크린 좌표 계산
        const width = window.innerWidth;
        const height = window.innerHeight;

        const x = (pos.x + 1) * width / 2;
        const y = (-pos.y + 1) * height / 2;
        const element = this._3dMaster?.contents3D?.refEditableInput?.current;

        if (element) {
            element.style.left = parseInt(x) + "px";
            element.style.top = parseInt(y) + "px";
            element.value = label.userData.text;

            this._3dMaster.setState({ editableInput: true });
        }
    }

    selectPoi(poi, finishMoving = false) {
        if (this._3dMaster.poiManager) {
            if (poi) {
                if (!finishMoving && this.editPoiManager.selectedPoi !== poi) {
                    this._3dMaster.poiManager.selectPoi(poi);
                }
            }
            else {
                this._3dMaster.poiManager.selectPoi(null);
            }
        }
    }

    selectMasterPoi(poi, subMenu) {
        if (subMenu === SDMSResource.ID.poi_editSubMenu.cctv_area) {
            this._3dMaster.poiManager.selectMasterPoi(poi);
        }
        else {
            this.selectPoi(poi);
        }
    }

    // 연결된 CCTV Poi들을 활성화시킨다.
    selectSlavePois(cctvList) {
        this._3dMaster.poiManager.selectSlavePois(cctvList);
    }

    move(x, y, editMenu, editSubMenu) {
        if (editMenu === SDMSResource.ID.menu.editMode_poi) {
            if (editSubMenu === SDMSResource.ID.poi_editSubMenu.move_poi || editSubMenu === SDMSResource.ID.poi_editSubMenu.add_poi) {
                this.editPoiManager.move(x, y);
            }
        }
        else if (editMenu === SDMSResource.ID.menu.editMode_fakeWall) {
            this.fakeWallManager.move(x, y);
        }
        else if (editMenu === SDMSResource.ID.menu.editMode_areaName) {
            this.labelMovingManager.move(x, y);
        }
    }

    onMove(poi) {
        if (this._3dMaster) {
            if (this._3dMaster.isIndoor() === false) {
                // 외부영역의 경우 지형의 높이가 일정하지 않기 때문에 poi의 x, z값에 따라 최적의 elevation을 구해야 한다.
                this.setPoiElevation(poi, this._3dMaster.camera, this._3dMaster.props.currentModel);
            }
        }

        this.editPoiManager.onMove(poi, this.spatialManager);

        if (this._3dMaster) {
            this._3dMaster.props.onChangedEdit(this.isChanged());
        }
    }

    setPoiElevation(poi, camera, currentModel) {
        if (camera && currentModel) {
            const raycaster = new THREE.Raycaster();

            const origin = new THREE.Vector3(camera.position.x, camera.position.y, camera.position.z);
            // 아래 방향
            const direction = new THREE.Vector3(0, -1, 0);
            raycaster.set(origin, direction);

            if (currentModel.siteBuildingGroupList) {
                let maxElevation = null;

                for (const siteNo in currentModel.siteBuildingGroupList) {
                    const siteModel = currentModel.siteBuildingGroupList[siteNo];

                    if (siteModel.modelNode && siteModel.modelNode.visible) {
                        const elevation = this.getMaxIntersectElevation(raycaster, siteModel.modelNode);

                        if (elevation !== null) {
                            if (maxElevation === null || maxElevation < elevation) {
                                maxElevation = elevation;
                            }
                        }
                    }

                    if (siteModel.outdoorModels) {
                        for (const outdoorModel of siteModel.outdoorModels) {
                            if (outdoorModel.visible) {
                                const elevation = this.getMaxIntersectElevation(raycaster, outdoorModel);

                                if (elevation !== null) {
                                    if (maxElevation === null || maxElevation < elevation) {
                                        maxElevation = elevation;
                                    }
                                }
                            }
                        }
                    }
                }

                if (maxElevation !== null) {
                    poi.position.set(poi.position.x, maxElevation + 10, poi.position.z);
                }
            }
        }
    }

    getMaxIntersectElevation(raycaster, modelNode) {
        const intersects = raycaster.intersectObject(modelNode, true);
        const intersectCount = intersects.length;
        let maxElevation = null;

        for (let i = 0; i < intersectCount; i++) {
            const intersect = intersects[i];

            if (intersect.object.isSprite) {
                continue;
            }

            if (maxElevation === null) {
                maxElevation = intersect.object.position.y;
            }
            else if (maxElevation < intersect.object.position.y) {
                maxElevation = intersect.object.position.y;
            }
        }

        return maxElevation;
    }

    quit(editMenu) {
        if (editMenu === SDMSResource.ID.menu.editMode_fakeWall) {
            this.fakeWallManager.stop();
        }
    }

    setSubMenu(editMenu, subMenu) {
        if (editMenu === SDMSResource.ID.menu.editMode_fakeWall) {
            this.fakeWallManager.changeMode(subMenu);
        }

        if (this._3dMaster.poiManager) {
            this._3dMaster.poiManager.clearTemporaryPoi();
        }
    }

    setTemporarySensor(poiManager, visibleSensorTypes, sensor, zoneNo, cctv) {
        this.poiManager = poiManager;
        const temporaryPoi = poiManager.addTemporaryPoi(sensor, zoneNo, visibleSensorTypes);

        if (temporaryPoi) {
            temporaryPoi.userData.cctv = cctv;
            temporaryPoi.userData.sensor = sensor;
            this.editPoiManager.selectPoi(temporaryPoi, this._3dMaster.camera);
        }
    }

    isChanged() {
        if (this.editPoiManager.isChanged() ||
            !this.fakeWallManager.isEmptyFakeWallData() ||
            !this.editEquipZoneManager.isEmpty() ||
            this._3dMaster.props.cctvMappingManager.isChanged() ||
            this.labelMovingManager.isChanged()) {
            this.somethingChanged = true;
            return true;
        }

        this.somethingChanged = false;
        return false;
    }

    resetChanges() {
        this.fakeWallManager?.reset?.();
        this.editPoiManager?.reset?.();
        this.editEquipZoneManager?.reset?.();
        this.labelMovingManager?.reset?.();

        if (typeof this.onChange === 'function') {
            this.onChange(false);

            if (this._3dMaster) {
                this._3dMaster.props.onChangedEdit(this.isChanged());
            }
        }
    }

    isCctvMappingMode() {
        if (this._3dMaster?.props.editSubMenu === SDMSResource.ID.poi_editSubMenu.cctv_area) {
            return true;
        }

        return false;
    }

    async save(userNo) {
        const [success1, message1] = await this.editPoiManager.savePois(userNo);
        const [success2, message2] = await this._3dMaster.props.cctvMappingManager.save();
        const [success3, message3] = await this.labelMovingManager.save(this.editEquipZoneManager);
        /*const sensorZoneCCTVs = this.sensorZoneCCTVs;
        const equipZoneCCTVs = this.equipZoneCCTVs;

        if (sensorZoneCCTVs) {
            const [success, message] = await SDMSController.saveSensorZoneCCTVList(sensorZoneCCTVs);

            if (!success) {
                return [success, message];
            }
        }

        if (equipZoneCCTVs) {
            const [success, message] = await SDMSController.saveEquipZoneCCTVList(equipZoneCCTVs);

            if (!success) {
                return [success, message];
            }
        }*/

        if (success1 && success2 && success3) {
            return await this.fakeWallManager.saveFakeWalls(userNo);
        }

        if (!success1) {
            return [success1, message1];
        }
        else if (!success2) {
            return [success2, message2];
        }
        else if (!success3) {
            return [success3, message3];
        }

        return [true, ""];
    }

    onClose() {
        this._3dMaster.props.cctvMappingManager.clear();
        this._3dMaster.poiManager.setMasterPoi(null);
        this._3dMaster.poiManager.selectPoi(null);
        this._3dMaster.poiManager.clearTemporaryPoi();
    }

    setFakeWallModel(model, scene) {
        this.fakeWallManager.setModel(model, scene);
    }

    addFakeWallData(fakeWall, mode, zoneNo, fakeWallManager) {
        this.fakeWallManager = fakeWallManager;
        this.fakeWallManager.addFakeWallData(fakeWall, mode, zoneNo);
    }

    setEquipZoneText(equipZoneNo, equipZoneName, zoneNo) {
        this.editEquipZoneManager.changeEquipZoneName(equipZoneNo, equipZoneName, zoneNo);
    }

    setMessageHandler(fn) {
        this._messageHandler = fn;
    }

    showMessageBox(msgType, message) {
        if (typeof this._messageHandler === "function") {
            this._messageHandler(message);
        } else {
            console.log(message);
        }
    }

    deletePoi(poi, sensorNo) {
        this.editPoiManager.delete(poi, sensorNo);
        this.onChange?.(true);

        if (this._3dMaster) {
            this._3dMaster.props.onChangedEdit(this.isChanged());
        }
    }
}
