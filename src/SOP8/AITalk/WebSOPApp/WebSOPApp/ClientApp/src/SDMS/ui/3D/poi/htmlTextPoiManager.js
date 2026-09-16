import * as THREE from "three/build/three.module.js";
import { CSS3DRenderer, CSS3DObject } from 'three/examples/jsm/renderers/CSS3DRenderer.js';
import { CfdController } from "../../../services/cfdController";
import SdmsResource from '../../../resource/id';

export class HtmlTextPoiManager {
    static EquipZoneNameText = "textEquipZoneName";
    static BuildingNameText = "textBuildingName";
    static BuildingGroupNameText = "textBuildingGroupName";
    static FacilityTooltipText = "textFacilityTooltip";
    static FcltyText = "textFclty";

    static FacilityTooltipTypeName = "AI 설비 예지보전";

    static BuildingGroupTextDistance = 500;
    static BuildingGroupTextEditModeDistance = 2.78;

    constructor(refBuildingGroupLabels, refBuildingLabels, refEquipZoneLabels, refFacilityTooltip, refFcltyLabels, scene, spatialManager, _3dMaster) {
        this.refBuildingGroupLabels = refBuildingGroupLabels;
        this.refBuildingLabels = refBuildingLabels;
        this.refEquipZoneLabels = refEquipZoneLabels;
        this.refFacilityTooltip = refFacilityTooltip;
        this.refFcltyLabels = refFcltyLabels;

        this.scene = scene;
        this.spatialManager = spatialManager;
        this._3dMaster = _3dMaster;

        this.buildingGroupTextVisible = null;

        this.completeBuildingGroupText = false;
        this.completeBuildingText = false;

        this.facilityTooltipLayer = null;
        this.cfdTextLayer = null;
        this.baseTextLayer = null;
        this.textLayers = [];

        this.selectedTextPoi = null;
        this.editingLabel = null;
        this.editingInputBox = null;

        this.isCfdMode = false;
        this.cfdBuildings = {};
        this.cfdBuildingGroupNames = {};
        this.cfdBuildingNodes = {};
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
                this._makeBillboard(camera, textLayer);
                /*for (const label of textLayer.children) {
                    label.quaternion.copy(camera.quaternion);
                }*/
            }
        }
        else {
            let textLayer = this.getTextLayer(HtmlTextPoiManager.BuildingNameText);

            if (textLayer?.visible) {
                this._makeBillboard(camera, textLayer);
                /*for (const label of textLayer.children) {
                    label.quaternion.copy(camera.quaternion);
                }*/
            }
            else {
                textLayer = this.getTextLayer(HtmlTextPoiManager.EquipZoneNameText);

                if (textLayer?.visible) {
                    this._makeBillboard(camera, textLayer);
                    /*for (const label of textLayer.children) {
                        label.quaternion.copy(camera.quaternion);
                    }*/
                }
            }
        }

        if (this.isCfdMode && this.cfdTextLayer) {
            this._makeBillboard(camera, this.cfdTextLayer);
        }

        if (this.facilityTooltipLayer && this.facilityTooltipLayer.children.length > 0) {
            this._makeBillboard(camera, this.facilityTooltipLayer);
        }

        // 설비 textLayer
        const fcltyLayer = this.getTextLayer(HtmlTextPoiManager.FcltyText);
        if (fcltyLayer?.visible && fcltyLayer?.children.length > 0) {
            this._makeBillboard(camera, fcltyLayer);
        }
    }

    _makeBillboard(camera, textLayer) {
        const children = [...textLayer.children];

        for (const label of children) {
            label.quaternion.copy(camera.quaternion);
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

        if (zone.sensors) {
            const sensors = zone.sensors[HtmlTextPoiManager.FacilityTooltipTypeName];

            if (sensors) {
                for (const sensor of sensors) {
                    this._addFacilityTooltip(sensor.sensor);
                }
            }
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

    _addFacilityTooltip(sensor) {
        if (!sensor || !this.refFacilityTooltip.current) {
            return;
        }

        if ((sensor.x === 0 || sensor.x) && (sensor.y === 0 || sensor.y) && (sensor.z === 0 || sensor.z)) {
            const clone = this.refFacilityTooltip.current.cloneNode(true);
            clone.setAttribute('data-facility-clone', sensor.sensor_sn);

            const label = this.setElementPosition(clone, sensor.x, sensor.y, sensor.z);

            if (label) {
                label.element.hidden = false;
                label.name = HtmlTextPoiManager.FacilityTooltipText + "_" + sensor.sensor_sn;
                label.scale.set(0.05, 0.05, 0.05);

                label.element.id = label.name;
                this.facilityTooltipLayer.add(label);
            }
        }
    }

    _addFcltyText(titleText, displayText, fclty) {
        const x = fclty.x;
        const y = fclty.y;
        const z = fclty.z;

        if (x !== null && x !== undefined && y !== null && y !== undefined && z !== null && z !== undefined) {
            const label = this._createFcltyLabel(this.refEquipZoneLabels, titleText, displayText, x, y, z, HtmlTextPoiManager.FcltyText);

            if (label) {
                label.name = HtmlTextPoiManager.FcltyText + "_" + fclty.fclty_sn;
                label.element.id = label.name;
                label.scale.set(0.05, 0.05, 0.05);

                const textLayer = this.getTextLayer(HtmlTextPoiManager.FcltyText);
                textLayer.add(label);
            }
        }
    }

    _createLabel(labels, displayText, x, y, z, tag) {
        const parent = labels.current;

        if (!parent) {
            return null;
        }

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

    _createFcltyLabel(labels, titleText, displayText, x, y, z, tag) {
        const parent = labels.current;

        const el = document.createElement('div');
        el.className = "equipmentLabel";

        el.style.position = 'absolute';
        el.style.transform = 'translate(-50%, -50%)';
        el.style.transformOrigin = '50% 50%';

        const title = document.createElement('p');
        title.textContent = titleText;
        const display = document.createElement('p');
        display.textContent = displayText;

        el.appendChild(title);
        el.appendChild(display);

        parent.appendChild(el);

        const label = new CSS3DObject(el);
        label.position.set(x, y, z);
        return label;
    }

    setElementPosition(element, x, y, z) {
        const label = new CSS3DObject(element);
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

                this.facilityTooltipLayer = new THREE.Object3D();
                this.facilityTooltipLayer.matrixAutoUpdate = false;
                this.facilityTooltipLayer.name = "textLayer_facilityTooltip";

                this.scene.add(this.facilityTooltipLayer);
            }

            this.baseTextLayer.add(textLayer);
            //this.scene.add(textLayer);
            this.textLayers[tag] = textLayer;
        }

        return textLayer;
    }

    setCfdMode(visible) {
        if (!this.scene) {
            return;
        }

        this.isCfdMode = visible;

        if (!this.cfdTextLayer) {
            this.cfdTextLayer = new THREE.Object3D();
            this.cfdTextLayer.matrixAutoUpdate = false;
            this.cfdTextLayer.name = "textLayer_cfd";

            this.scene.add(this.cfdTextLayer);
        }

        this.cfdTextLayer.visible = visible;
        this.showBaseTextLayer(!visible);

        if (visible) {
            for (const buildingNo in this.cfdBuildings) {
                const div = document.getElementById(buildingNo.toString());

                if (div) {
                    const building = this.spatialManager.getBuilding(buildingNo);

                    if (building) {
                        const clone = div.cloneNode(true);

                        // id 중복 방지
                        clone.removeAttribute('id');
                        clone.setAttribute('data-cfd-clone', building.name);
                        
                        const label = this.setElementPosition(clone, building.x, building.y, building.z);
                        this.cfdTextLayer.add(label);
                    }
                }
            }
        }
        else {
            const childCount = this.cfdTextLayer.children.length;

            for (let i = childCount - 1; i >= 0; i--) {
                const child = this.cfdTextLayer.children[i];
                this.cfdTextLayer.remove(child);
                child.element?.remove?.();
            }

            this.setCfdBuilding(null);
        }
    }

    onClickCfdText = (event) => {
        const cfdText = this.selectCfdText(event.nativeEvent.offsetX, event.nativeEvent.offsetY);

        if (cfdText) {
            const buildingName = cfdText.element.dataset?.cfdClone;

            if (buildingName) {
                this._3dMaster.contents3D.handleSelectBuilding(buildingName);
                return true;
            }
        }

        return false;
    }

    onClickFacilityTooltip = (event) => {
        const tooltip = this.selectFacilityTooltip(event.nativeEvent.offsetX, event.nativeEvent.offsetY);

        if (tooltip) {
            const sensorNo = tooltip.element.dataset?.facilityClone;
            console.log("onClickFacilityTooltip : " + sensorNo);

            this._3dMaster.props.setVisiblePopups(SdmsResource.ID.menu.equipmentAnalysis, true);

            return true;
        }

        return false;
    }

    async initCfdLocation() {
        const [locations, message] = await CfdController.requestLocation();

        if (locations) {
            const buildingGroupNames = {};
            const buildings = {};

            for (const location of locations) {
                buildings[location.buildingNo] = location;

                let buildingNos = buildingGroupNames[location.buildingGroupName];

                if (!buildingNos) {
                    buildingNos = [];
                    buildingGroupNames[location.buildingGroupName] = buildingNos;
                }

                if (buildingNos.includes(location.buildingNo) === false) {
                    buildingNos.push(location.buildingNo);
                }
            }

            this.cfdBuildings = buildings;
            this.cfdBuildingGroupNames = buildingGroupNames;
        }
    }

    showCfdText(visible) {
        if (this.cfdTextLayer) {
            this.cfdTextLayer.visible = visible;
        }
    }

    showTextLayer(tag, visible) {
        const textLayer = this.getTextLayer(tag);

        if (textLayer) {
            textLayer.visible = visible;
        }
    }

    showBaseTextLayer(visible) {
        if (this.baseTextLayer) {
            if (this.isCfdMode) {
                this.baseTextLayer.visible = false;
            }
            else {
                this.baseTextLayer.visible = visible;
            }
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

            this.clearTextLayer(this.facilityTooltipLayer);
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
        if (this.editingInputBox) {
            if (this.hitTest(this.editingInputBox, x, y)) {
                return this.editingLabel;
            }

            if (this.hitTest(this.editingLabel.element, x, y)) {
                return this.editingLabel;
            }
        }

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
                if (this.hitTest(child.element, x, y)) {
                    return child;
                }
            }
        }

        // 값이 확인 안된다면 설비 textLayer 확인
        textLayer = this.getTextLayer(HtmlTextPoiManager.FcltyText);
        if (textLayer?.visible) {
            for (const child of textLayer.children) {
                if (this.hitTest(child.element, x, y)) {
                    return child;
                }
            }
        }

        return null;
    }

    hitTest(element, x, y) {
        const rect = element.getBoundingClientRect();

        if (rect.width <= 0 || rect.height <= 0) {
            return false;
        }

        // client 좌표는 boundingClientRect와 같은 기준(뷰포트)입니다.
        if (x >= rect.left && x <= rect.right &&
            y >= rect.top && y <= rect.bottom) {
            return true;
        }

        return false;
    }

    selectCfdText(x, y) {
        if (this.isCfdMode && this.cfdTextLayer?.visible) {
            for (const child of this.cfdTextLayer.children) {
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

    selectFacilityTooltip(x, y) {
        if (this.facilityTooltipLayer) {
            for (const child of this.facilityTooltipLayer.children) {
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
                    else {
                        // 설비 text 선택 시
                        const fclty = this._isFclty(poi);

                        if (fclty) {
                            const showPopups = this._3dMaster.props.showPopups;
                            const showPopupData = Object.assign({}, showPopups);

                            // 팝업 띄우기
                            showPopupData[SdmsResource.ID.menu.equipmentAnalysis] = false;
                            showPopupData[SdmsResource.ID.menu.equipmentDetailInfo] = true;

                            this._3dMaster.contents3D.props.setShowPopups(showPopupData);
                        }
                    }                    
                }
            }
        }

        this.selectedTextPoi = poi;
    }

    checkCfdBuildingGroupNode(modelNode) {
        const index1 = modelNode.name.indexOf('_');
        const index2 = modelNode.name.indexOf('.');
        let modelName = "";

        if (index1 > 0 && index2 > index1) {
            modelName = modelNode.name.substring(index1 + 1, index2);
        }
        else {
            return;
        }

        const cfdBuildingGroupNames = { ...this.cfdBuildingGroupNames };

        for (const buildingGroupName in cfdBuildingGroupNames) {
            if (modelName === buildingGroupName) {
                if (modelNode.children.length > 0) {
                    const buildingNos = cfdBuildingGroupNames[buildingGroupName];

                    for (const buildingNo of buildingNos) {
                        const buildingModelNode = this.getBuildingNormalModelNode(buildingNo, modelNode.children[0]);

                        if (buildingModelNode) {
                            this.cfdBuildingNodes[buildingNo] = buildingModelNode;

                            const cfdNode = this.get1FNode(buildingModelNode);

                            if (cfdNode) {
                                // 시뮬레이션 모드에서만 보이게 한다.
                                cfdNode.visible = false;

                                buildingModelNode.userData.pair = cfdNode;
                                cfdNode.userData.pair = buildingModelNode;
                            }
                        }
                    }
                }

                break;
            }
        }
    }

    getBuildingNormalModelNode(buildingNo, parent) {
        const building = this.spatialManager.getBuilding(buildingNo);

        if (building) {
            // 건물이름과 일치하는 노드를 찾는다.
            for (const child of parent.children) {
                if (child.name === building.name) {
                    return child;
                }
            }

            // 건물이름과 일치하는 노드가 없으면 이름이 가장 짧은 노드를 찾는다.
            let minChild = null;
            let minNameLength = 10000;

            for (const child of parent.children) {
                const len = child.name.length;

                if (len < minNameLength) {
                    minChild = child;
                    minNameLength = len;
                }
            }

            return minChild;
        }

        return null;
    }

    get1FNode(node) {
        if (node.parent) {
            const nodeName = node.name + "-1F";
            let otherNode = null;

            for (const _node of node.parent.children) {
                if (_node.name === nodeName) {
                    return _node;
                }

                if (_node !== node) {
                    otherNode = _node;
                }
            }

            return otherNode;
        }

        return null;
    }

    setVisibleNode(node, visible) {
        node.visible = visible;

        if (node.userData.pair) {
            node.userData.pair.visible = !visible;
        }
    }

    setCfdBuilding(buildingNo) {
        const cfdBuildingNodes = { ...this.cfdBuildingNodes };

        if (buildingNo !== null) {
            const strBuildingNo = buildingNo.toString();

            for (const _buildingNo in cfdBuildingNodes) {
                const modelNode = cfdBuildingNodes[_buildingNo];

                if (strBuildingNo === _buildingNo.toString()) {
                    this.setVisibleNode(modelNode, false);
                    //modelNode.visible = false;
                }
                else {
                    this.setVisibleNode(modelNode, true);
                    //modelNode.visible = true;
                }
            }
        }
        else {
            for (const _buildingNo in cfdBuildingNodes) {
                const modelNode = cfdBuildingNodes[_buildingNo];
                this.setVisibleNode(modelNode, true);
                //modelNode.visible = true;
            }
        }
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

    _isFclty(poi) {
        if (poi.name.startsWith(HtmlTextPoiManager.FcltyText)) {
            const tokens = poi.name.split('_');

            if (tokens.length >= 2) {
                const fcltyNo = parseInt(tokens[1].trim());

                if (isNaN(fcltyNo) === false) {
                    return fcltyNo;
                }
            }
        }

        return 0;
    }

    getEquipZoneTextLabel(equipZoneNo) {
        const textLayer = this.getTextLayer(HtmlTextPoiManager.EquipZoneNameText);

        if (textLayer) {
            for (const child of textLayer.children) {
                if (this.getEquipZoneNo(child) === equipZoneNo) {
                    return child;
                }
            }
        }

        return null;
    }

    rollbackEquipZoneText(label, equipZoneNo) {
        if (this._3dMaster?.props?.spatialManager) {
            const zone = this._3dMaster.props.spatialManager.getZone(this._3dMaster.props.currentModel.currentZoneNo);

            if (zone?.equipmentZoneDatas) {
                for (const equipZone of zone.equipmentZoneDatas) {
                    label.element.textContent = equipZone.displayText;
                    break;
                }
            }
        }
    }

    cancelEdit() {
        if (this.editingInputBox) {
            const equipZoneNo = this.editingInputBox.dataset?.equipZoneNo;

            if (equipZoneNo) {
                this.changeEquipZoneText(parseInt(equipZoneNo), null);
            }
        }
    }

    finishEdit() {
        if (this.editingInputBox) {
            const equipZoneNo = this.editingInputBox.dataset?.equipZoneNo;

            if (equipZoneNo) {
                this.changeEquipZoneText(parseInt(equipZoneNo), this.editingInputBox.value);
            }
        }
    }

    onKeyDownEditableInput(e) {
        if (e.key === "Enter") {
            const equipZoneNo = parseInt(e.currentTarget.dataset.equipZoneNo);
            const text = e.currentTarget.value;

            if (text) {
                this._3dMaster.props.editModeManager.setEquipZoneText(equipZoneNo, text, this._3dMaster.props.currentModel.currentZoneNo);
                this.changeEquipZoneText(equipZoneNo, text);
            }
        }
        else if (e.key === "Escape") {
            const equipZoneNo = parseInt(e.currentTarget.dataset.equipZoneNo);
            this.changeEquipZoneText(equipZoneNo, null);
        }
    }

    setEditText(label) {
        if (this._3dMaster?.contents3D?.refEditableInput?.current) {
            const equipZoneNo = this.getEquipZoneNo(label);

            if (equipZoneNo !== null) {
                const clone = this._3dMaster.contents3D.refEditableInput.current.cloneNode(true);
                label.element.appendChild(clone);

                const _this = this;
                this.editingLabel = label;
                this.editingInputBox = clone;

                clone.addEventListener("keydown", (event) => {
                    _this.onKeyDownEditableInput(event);
                });

                clone.id = 'areaInput';
                clone.setAttribute('data-equip-zone-no', equipZoneNo);
                clone.focus();
            }
        }
    }

    getEquipZoneNo(label) {
        const index = label.name.lastIndexOf('_');

        if (index > 0) {
            const equipZoneNo = parseInt(label.name.substring(index + 1));

            if (isNaN(equipZoneNo)) {
                return null;
            }

            return equipZoneNo;
        }

        return null;
    }

    changeEquipZoneText(equipZoneNo, equipZoneName) {
        const editModeManager = this._3dMaster?.props?.editModeManager;

        if (!editModeManager) {
            return;
        }

        const textLayer = this.getTextLayer(HtmlTextPoiManager.EquipZoneNameText);

        if (textLayer) {
            for (const label of textLayer.children) {
                if (this.getEquipZoneNo(label) === equipZoneNo) {
                    const originText = label.element.textContent;

                    // 모든 자식 element 제거
                    label.element.replaceChildren();

                    if (equipZoneName) {
                        label.element.textContent = equipZoneName;
                    }
                    else {
                        label.element.textContent = originText;
                    }

                    editModeManager.setEquipZoneText(equipZoneNo, label.element.textContent, this._3dMaster.props.currentModel.currentZoneNo);
                    break;
                }
            }
        }

        this.editingLabel = null;
        this.editingInputBox = null;
        this._3dMaster.props.onChangedEdit(editModeManager.isChanged());
    }

    isEquipZoneText(label) {
        if (label?.parent) {
            const parentName = label?.parent.name;

            if (parentName.includes(HtmlTextPoiManager.EquipZoneNameText)) {
                return true;
            }
        }

        return false;
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
