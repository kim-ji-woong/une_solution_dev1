import * as THREE from "three/build/three.module.js";
import { CSS3DRenderer, CSS3DObject } from 'three/examples/jsm/renderers/CSS3DRenderer.js';

export class HtmlTextPoiManager {
    static EquipZoneNameText = "textEquipZoneName";
    static BuildingNameText = "textBuildingName";
    static BuildingGroupNameText = "textBuildingGroupName";

    static BuildingGroupTextDistance = 500;
    static BuildingGroupTextEditModeDistance = 2.78;

    constructor(refBuildingGroupLabels, refBuildingLabels, refEquipZoneLabels, scene, spatialManager, _3dMaster) {
        this.refBuildingGroupLabels = refBuildingGroupLabels;
        this.refBuildingLabels = refBuildingLabels;
        this.refEquipZoneLabels = refEquipZoneLabels;

        this.scene = scene;
        this.spatialManager = spatialManager;
        this._3dMaster = _3dMaster;

        this.buildingGroupTextVisible = null;

        this.completeBuildingGroupText = false;
        this.completeBuildingText = false;

        this.baseTextLayer = null;
        this.textLayers = [];

        this.selectedTextPoi = null;
    }

    initLabelRenderer(ref3D) {
        this.labelRenderer = new CSS3DRenderer();
        this.labelRenderer.setSize(window.innerWidth, window.innerHeight);
        this.labelRenderer.domElement.style.position = 'absolute';
        this.labelRenderer.domElement.style.top = '0';
        this.labelRenderer.domElement.style.left = '0';

        // label Element를 Click할 수 있도록 한다.
        this.labelRenderer.domElement.style.pointerEvents = 'auto';

        // canvas보다 더 위에 나오도록 한다.
        this.labelRenderer.domElement.style.zIndex = '1';

        ref3D.current.appendChild(this.labelRenderer.domElement);
    }

    render(scene, camera) {
        if (this.labelRenderer) {
            this.labelRenderer.render(scene, camera);
        }
    }

    makeBillboard(camera) {
        if (this.buildingGroupTextVisible) {
            const textLayer = this.getTextLayer(HtmlTextPoiManager.BuildingGroupNameText);

            if (textLayer?.visible) {
                for (const label of textLayer.children) {
                    label.quaternion.copy(camera.quaternion);
                }
            }
        }
        else {
            let textLayer = this.getTextLayer(HtmlTextPoiManager.BuildingNameText);

            if (textLayer?.visible) {
                for (const label of textLayer.children) {
                    label.quaternion.copy(camera.quaternion);
                }
            }
            else {
                textLayer = this.getTextLayer(HtmlTextPoiManager.EquipZoneNameText);

                if (textLayer?.visible) {
                    for (const label of textLayer.children) {
                        label.quaternion.copy(camera.quaternion);
                    }
                }
            }
        }
    }

    addBuildingGroupText(buildingGroups) {
        this.completeBuildingGroupText = false;

        for (const buildingGroup of buildingGroups) {
            if (buildingGroup.x !== null && buildingGroup.x !== undefined &&
                buildingGroup.y !== null && buildingGroup.y !== undefined &&
                buildingGroup.z !== null && buildingGroup.z !== undefined) {
                this._addBuildingGroupText(buildingGroup.displayText, buildingGroup);
            }
        }

        this.completeBuildingGroupText = true;
    }

    addBuildingText(buildingGroups) {
        this.completeBuildingText = false;

        for (const buildingGroup of buildingGroups) {
            if (buildingGroup.buildingDatas) {
                for (const building of buildingGroup.buildingDatas) {
                    this._addBuildingText(building.displayText, building);
                }
            }
        }

        this.completeBuildingText = true;
    }

    addEquipZoneText(zone) {
        if (!zone) {
            return;
        }

        for (const equipZone of zone.equipmentZoneDatas) {
            this._addEquipZoneText(equipZone.displayText, equipZone);
        }
    }

    _addBuildingGroupText(displayText, buildingGroup) {
        const x = buildingGroup.x;
        const y = buildingGroup.y;
        const z = buildingGroup.z;

        if (x !== null && x !== undefined &&
            y !== null && y !== undefined &&
            z !== null && z !== undefined) {
            const label = this._createLabel(this.refBuildingGroupLabels, displayText, x, y, z, HtmlTextPoiManager.BuildingGroupNameText);

            if (label) {
                label.name = HtmlTextPoiManager.BuildingGroupNameText + "_" + buildingGroup.buildingGroupNo;
                label.element.id = label.name;

                const textLayer = this.getTextLayer(HtmlTextPoiManager.BuildingGroupNameText);
                textLayer.add(label);
            }
        }
    }

    _addBuildingText(displayText, building) {
        const x = building.x;
        const y = building.y;
        const z = building.z;

        if (x !== null && x !== undefined && y !== null && y !== undefined && z !== null && z !== undefined) {
            const label = this._createLabel(this.refBuildingLabels, displayText, x, y, z, HtmlTextPoiManager.BuildingNameText);

            if (label) {
                label.name = HtmlTextPoiManager.BuildingNameText + "_" + building.buildingNo;
                label.element.id = label.name;

                const textLayer = this.getTextLayer(HtmlTextPoiManager.BuildingNameText);
                textLayer.add(label);
            }
        }
    }

    _addEquipZoneText(displayText, equipZone) {
        const x = equipZone.x;
        const y = equipZone.y;
        const z = equipZone.z;

        if (x !== null && x !== undefined && y !== null && y !== undefined && z !== null && z !== undefined) {
            const label = this._createLabel(this.refEquipZoneLabels, displayText, x, y, z, HtmlTextPoiManager.EquipZoneNameText);

            if (label) {
                label.name = HtmlTextPoiManager.EquipZoneNameText + "_" + equipZone.equipZoneNo;
                label.element.id = label.name;
                label.scale.set(0.1, 0.1, 0.1);

                const textLayer = this.getTextLayer(HtmlTextPoiManager.EquipZoneNameText);
                textLayer.add(label);
            }
        }
    }

    _createLabel(labels, displayText, x, y, z, tag) {
        const parent = labels.current;

        const el = document.createElement('div');
        el.textContent = displayText;
        el.style.position = 'absolute';
        el.style.transform = 'translate(-50%, -50%)';
        el.style.transformOrigin = '50% 50%';

        //el.style.pointerEvents = 'auto';
        //el.style.userSelect = 'none';
        el.className = parent.className;

        parent.appendChild(el);

        const label = new CSS3DObject(el);
        label.position.set(x, y, z);
        return label;
    }

    getLabel(element, tag) {
        const textLayer = this.getTextLayer(tag);

        if (textLayer) {
            for (const label of textLayer.children) {
                if (label.name === element.id) {
                    return label;
                }
            }
        }

        return null;
    }

    getTextLayer(tag) {
        let textLayer = this.textLayers[tag];

        if (!textLayer) {
            textLayer = new THREE.Object3D();
            textLayer.matrixAutoUpdate = false;
            textLayer.name = "textLayer_" + tag;

            if (!this.baseTextLayer) {
                this.baseTextLayer = new THREE.Object3D();
                this.baseTextLayer.matrixAutoUpdate = false;
                this.baseTextLayer.name = "textLayer_base";

                this.scene.add(this.baseTextLayer);
            }

            this.baseTextLayer.add(textLayer);
            //this.scene.add(textLayer);
            this.textLayers[tag] = textLayer;
        }

        return textLayer;
    }

    showTextLayer(tag, visible) {
        const textLayer = this.getTextLayer(tag);

        if (textLayer) {
            textLayer.visible = visible;
        }
    }

    showBaseTextLayer(visible) {
        if (this.baseTextLayer) {
            this.baseTextLayer.visible = visible;
        }
    }

    showOutdoorText(isBuildingGroup) {
        if (isBuildingGroup) {
            this.showTextLayer(HtmlTextPoiManager.BuildingGroupNameText, true);
            this.showTextLayer(HtmlTextPoiManager.BuildingNameText, false);
        }
        else {
            this.showTextLayer(HtmlTextPoiManager.BuildingGroupNameText, false);
            this.showTextLayer(HtmlTextPoiManager.BuildingNameText, true);
        }

        this.showTextLayer(HtmlTextPoiManager.EquipZoneNameText, false);
    }

    showIndoorText() {
        this.showTextLayer(HtmlTextPoiManager.BuildingGroupNameText, false);
        this.showTextLayer(HtmlTextPoiManager.BuildingNameText, false);
        this.showTextLayer(HtmlTextPoiManager.EquipZoneNameText, true);
    }

    clearText(layerName) {
        if (layerName) {
            const textLayer = this.textLayers[layerName];
            this.clearTextLayer(textLayer);
        }
        else {
            for (const layerName in this.textLayers) {
                const textLayer = this.textLayers[layerName];
                this.clearTextLayer(textLayer);
            }
        }
    }

    clearTextLayer(textLayer) {
        if (textLayer) {
            const childCount = textLayer.children.length;

            for (let i = childCount - 1; i >= 0; i--) {
                const child = textLayer.children[i];
                textLayer.remove(child);
            }
        }
    }

    initZoomValue() {
        this.buildingGroupTextVisible = null;
    }

    checkZoomValue(isIndoor, zoomValue, isEditMode) {
        if (isIndoor === false) {
            if (this.buildingGroupTextVisible === null) {
                const buildingGroupTextVisible = this._checkZoomValue(zoomValue, isEditMode);

                this.showOutdoorText(buildingGroupTextVisible);
                //this.showTextLayer(HtmlTextPoiManager.BuildingGroupNameText, buildingGroupTextVisible);
                //this.showTextLayer(HtmlTextPoiManager.BuildingNameText, !buildingGroupTextVisible);
                this.buildingGroupTextVisible = buildingGroupTextVisible;
            }
            else if (this.buildingGroupTextVisible) {
                if (this._checkZoomValue(zoomValue, isEditMode) === false) {
                    this.showOutdoorText(false);
                    //this.showTextLayer(HtmlTextPoiManager.BuildingGroupNameText, false);
                    //this.showTextLayer(HtmlTextPoiManager.BuildingNameText, true);
                    this.buildingGroupTextVisible = false;
                }
            }
            else {
                if (this._checkZoomValue(zoomValue, isEditMode)) {
                    this.showOutdoorText(true);
                    //this.showTextLayer(HtmlTextPoiManager.BuildingGroupNameText, true);
                    //this.showTextLayer(HtmlTextPoiManager.BuildingNameText, false);
                    this.buildingGroupTextVisible = true;
                }
            }
        }
    }

    _checkZoomValue(zoomValue, isEditMode) {
        if (isEditMode) {
            return zoomValue < HtmlTextPoiManager.BuildingGroupTextEditModeDistance;
        }

        return zoomValue >= HtmlTextPoiManager.BuildingGroupTextDistance;
    }

    select(x, y) {
        let tag = null;

        if (this.buildingGroupTextVisible) {
            tag = HtmlTextPoiManager.BuildingGroupNameText;
        }
        else {
            tag = HtmlTextPoiManager.BuildingNameText;
        }

        let textLayer = this.getTextLayer(tag);

        if (!textLayer || !textLayer.visible) {
            textLayer = this.getTextLayer(HtmlTextPoiManager.EquipZoneNameText);
        }

        if (textLayer?.visible) {
            for (const child of textLayer.children) {
                const rect = child.element.getBoundingClientRect();

                if (rect.width <= 0 || rect.height <= 0) {
                    continue;
                }

                // client 좌표는 boundingClientRect와 같은 기준(뷰포트)입니다.
                if (x >= rect.left && x <= rect.right &&
                    y >= rect.top && y <= rect.bottom) {
                    return child;
                }
            }
        }

        return null;
    }

    selectPoi(poi, moveTo = false) {
        if (poi) {
            if (moveTo) {
                const buildingGroup = this._isBuildingGroup(poi);

                if (buildingGroup) {
                    this._3dMaster.contents3D.props.moveToBuildingGroup(buildingGroup.buildingGroupNo);
                }
                else {
                    const building = this._isBuilding(poi);

                    if (building) {
                        const firstZone = this._getFirstZone(building);

                        if (firstZone) {
                            this._3dMaster.contents3D.props.moveToZone(firstZone.zoneNo);
                        }
                    }
                }
            }
        }

        this.selectedTextPoi = poi;
    }

    _isBuildingGroup(poi) {
        if (poi.name.startsWith(HtmlTextPoiManager.BuildingGroupNameText)) {
            const tokens = poi.name.split('_');

            if (tokens.length >= 2) {
                const buildingGroupNo = parseInt(tokens[1].trim());

                if (isNaN(buildingGroupNo) === false) {
                    return this.spatialManager.buildingGroups[buildingGroupNo];
                }
            }
        }

        return null;
    }

    _isBuilding(poi) {
        if (poi.name.startsWith(HtmlTextPoiManager.BuildingNameText)) {
            const tokens = poi.name.split('_');

            if (tokens.length >= 2) {
                const buildingNo = parseInt(tokens[1].trim());

                if (isNaN(buildingNo) === false) {
                    return this.spatialManager.buildings[buildingNo];
                }
            }
        }

        return 0;
    }

    _getFirstZone(building) {
        if (building?.zoneDatas) {
            for (const zoneData of building.zoneDatas) {
                return zoneData;
            }
        }

        return null;
    }

    static isTextPoi(sensorType) {
        if (sensorType?.startsWith && sensorType.startsWith("text")) {
            return true;
        }

        return false;
    }

    setWorkerVisibleType(worker, visitor, siteNo) {
    }

    updateWorker() {

    }
}
