import * as THREE from "three/build/three.module.js";
import ProjectResource from "../../../../Root/resource/id";
import { WorkerManager } from "./workers/workerManager";
import { WorkerManagerBoth } from "./workers/workerManagerBoth";
import { WorkerManagerNormal } from "./workers/workerManagerNormal";
import { WorkerManagerVisitor } from "./workers/workerManagerVisitor";
import { WorkerManagerWorker } from "./workers/workerManagerWorker";
import { PoiManager } from "./poiManager";
import { _3dMaster } from "../utility/_3dMaster";

export class TextPoiManager {
    static EquipZoneNameText = "textEquipZoneName";
    static BuildingNameText = "textBuildingName";
    static BuildingGroupNameText = "textBuildingGroupName";

    static BuildingGroupTextDistance = 500;
    static BuildingGroupTextEditModeDistance = 2.78;

    static loadSpriteIconImageCount = 0;

    static WorkerType = {
        noWorker: 0,
        workerOnly: 1,
        visitorOnly: 2,
        workerNVisitor: 3
    }

    constructor(scene, spatialManager, __3dMaster) {
        this.scene = scene;
        this.spatialManager = spatialManager;
        this._3dMaster = __3dMaster;

        //this.buildingGroupText/*: { [buildingGroupName: string]: [THREE.Sprite, string] }*/ = {};
        //this.buildingText/*: { [buildingGroupName: string]: [THREE.Sprite, string] }*/ = {};

        this.buildingGroupTextWidth = null;

        this.textLayers = {};

        this.borderThickness = 1;
        this.textColor = { r: 255, g: 255, b: 255, a: 1.0 };
        this.buildingTextBorderColor = { r: 63, g: 108, b: 219, a: 1.0 };

        this.buildingGroupFontSize = 36;
        this.buildingFontSize = 12;
        this.equipZoneFontSize = 12;

        this.buildingGroupTextVisible = null;

        this.completeBuildingGroupText = false;
        this.completeBuildingText = false;

        this.selectedTextPoi = null;
        // CCTV 매핑 모드에서 현재 선택(하이라이트)된 공간명(설비구역) Label
        this.highlightedEquipZoneLabel = null;
        this.initWorker();
    }

    initWorker() {
        const buildingGroupTextLayer = this.getTextLayer(TextPoiManager.BuildingGroupNameText);
        const buildingTextLayer = this.getTextLayer(TextPoiManager.BuildingNameText);

        this.workerManagerNormal = new WorkerManagerNormal(this.spatialManager, buildingGroupTextLayer, buildingTextLayer);
        this.workerManagerWorker = new WorkerManagerWorker(this.spatialManager, buildingGroupTextLayer, buildingTextLayer);
        this.workerManagerVisitor = new WorkerManagerVisitor(this.spatialManager, buildingGroupTextLayer, buildingTextLayer);
        this.workerManagerBoth = new WorkerManagerBoth(this.spatialManager, buildingGroupTextLayer, buildingTextLayer);

        this.initWorkerImage();
        this.initWorkerType();
    }

    initWorkerImage() {
        const spriteIconImage_PersonNormal = new Image(128, 128);
        const spriteIconImage_PersonZero = new Image(128, 128);
        const spriteIconImage_PeopleNormal = new Image(128, 128);
        const spriteIconImage_PeopleZero = new Image(128, 128);

        spriteIconImage_PersonNormal.src = "resource/image/icon/person_green.png";
        spriteIconImage_PersonZero.src = "resource/image/icon/person_gray.png";
        spriteIconImage_PeopleNormal.src = "resource/image/icon/people_yellow.png";
        spriteIconImage_PeopleZero.src = "resource/image/icon/people_gray.png";

        spriteIconImage_PersonNormal.onload = () => {
            TextPoiManager.loadSpriteIconImageCount++;
            this.workerManagerWorker.setWorkerImage(spriteIconImage_PersonNormal, true);
            this.workerManagerBoth.setWorkerImage(spriteIconImage_PersonNormal, true);
        };

        spriteIconImage_PersonZero.onload = () => {
            TextPoiManager.loadSpriteIconImageCount++;
            this.workerManagerWorker.setWorkerImage(spriteIconImage_PersonZero, false);
            this.workerManagerBoth.setWorkerImage(spriteIconImage_PersonZero, false);
        };

        spriteIconImage_PeopleNormal.onload = () => {
            TextPoiManager.loadSpriteIconImageCount++;
            this.workerManagerVisitor.setVisitorImage(spriteIconImage_PeopleNormal, true);
            this.workerManagerBoth.setVisitorImage(spriteIconImage_PeopleNormal, true);
        };

        spriteIconImage_PeopleZero.onload = () => {
            TextPoiManager.loadSpriteIconImageCount++;
            this.workerManagerVisitor.setVisitorImage(spriteIconImage_PeopleZero, false);
            this.workerManagerBoth.setVisitorImage(spriteIconImage_PeopleZero, false);
        };
    }

    async initWorkerType() {
        let userInfo = await ProjectResource.initUserInfo();

        this.useWorker = userInfo?.options?.useWorker;
        this.setWorkerType(TextPoiManager.WorkerType.noWorker, this._3dMaster.props.currentModel?.currentSiteNo);
    }

    addBuildingGroupText(buildingGroups) {
        const userInfo = ProjectResource.getUserInfo();

        for (const buildingGroup of buildingGroups) {
            if (buildingGroup.x !== null && buildingGroup.x !== undefined &&
                buildingGroup.y !== null && buildingGroup.y !== undefined &&
                buildingGroup.z !== null && buildingGroup.z !== undefined) {
                if (_3dMaster.checkUserBuildingGroup(buildingGroup, userInfo)) {
                    this._addBuildingGroupText(buildingGroup.displayText, buildingGroup);
                }
            }
        }

        this.completeBuildingGroupText = true;
        //this.showTextLayer(TextPoiManager.BuildingGroupNameText, false);
    }

    addBuildingText(buildingGroups) {
        const userInfo = ProjectResource.getUserInfo();

        for (const buildingGroup of buildingGroups) {
            if (buildingGroup.buildingDatas) {
                for (const building of buildingGroup.buildingDatas) {
                    if (_3dMaster.checkUserBuilding(building, userInfo)) {
                        this._addBuildingText(building.displayText, building, buildingGroup.name, buildingGroup.siteNo);
                    }
                }
            }
        }

        this.completeBuildingText = true;
        //this.showTextLayer(TextPoiManager.BuildingNameText, false);
    }

    addEquipZoneText(zone) {
        if (!zone) {
            return;
        }

        for (const equipZone of zone.equipmentZoneDatas) {
            this._addEquipZoneText(equipZone.displayText, equipZone, zone.zoneNo);
        }
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

    _addBuildingGroupText(displayText, buildingGroup) {
        const x = buildingGroup.x;
        const y = buildingGroup.y;
        const z = buildingGroup.z;

        if (x !== null && x !== undefined &&
            y !== null && y !== undefined &&
            z !== null && z !== undefined) {
            this.workerManagerNormal.addBuildingGroupText(buildingGroup.name, displayText, buildingGroup.buildingGroupNo, x, y, z, this.buildingGroupFontSize, buildingGroup.siteNo, this, null, null);

            if (this.useWorker) {
                const [workerCount, visitorCount] = WorkerManager.getBuildingGroupWorker(buildingGroup.buildingGroupNo);

                this.workerManagerWorker.addBuildingGroupText(buildingGroup.name, displayText, buildingGroup.buildingGroupNo, x, y, z, this.buildingGroupFontSize, buildingGroup.siteNo, this, workerCount, visitorCount);
                this.workerManagerVisitor.addBuildingGroupText(buildingGroup.name, displayText, buildingGroup.buildingGroupNo, x, y, z, this.buildingGroupFontSize, buildingGroup.siteNo, this, workerCount, visitorCount);
                this.workerManagerBoth.addBuildingGroupText(buildingGroup.name, displayText, buildingGroup.buildingGroupNo, x, y, z, this.buildingGroupFontSize, buildingGroup.siteNo, this, workerCount, visitorCount);
            }
            /*const sprite = this.makeBuildingGroupText(displayText, id, x, y, z, this.buildingGroupFontSize, siteID);

            if (sprite) {
                this.buildingGroupText[buildingGroupName] = [sprite, displayText];
            }*/
        }
        /*const sprite = this.makeBuildingGroupText(displayText, buildingGroup.buildingGroupNo, buildingGroup.x, buildingGroup.y, buildingGroup.z, this.buildingGroupFontSize);

        if (sprite) {
            //this.buildingGroupText[displayText] = [sprite, displayText];
        }

        return sprite;*/
    }

    _addBuildingText(displayText, building, buildingGroupName, siteNo) {
        const x = building.x;
        const y = building.y;
        const z = building.z;

        if (x !== null && x !== undefined && y !== null && y !== undefined && z !== null && z !== undefined) {
            this.workerManagerNormal.addBuildingText(buildingGroupName, building.name, displayText, building.buildingNo, x, y, z, this.buildingFontSize, siteNo, this, null, null);

            if (this.useWorker) {
                const [workerCount, visitorCount] = WorkerManager.getBuildingWorker(building.buildingNo);

                this.workerManagerWorker.addBuildingText(buildingGroupName, building.name, displayText, building.buildingNo, x, y, z, this.buildingFontSize, siteNo, this, workerCount, visitorCount);
                this.workerManagerVisitor.addBuildingText(buildingGroupName, building.name, displayText, building.buildingNo, x, y, z, this.buildingFontSize, siteNo, this, workerCount, visitorCount);
                this.workerManagerBoth.addBuildingText(buildingGroupName, building.name, displayText, building.buildingNo, x, y, z, this.buildingFontSize, siteNo, this, workerCount, visitorCount);
            }
            /*const sprite = this.makeBuildingText(displayText, building.buildingNo, x, y, z, this.buildingFontSize);

            if (sprite) {
                //this.buildingText[displayText] = [sprite, displayText];
            }

            return sprite;*/
        }

        //return null;
    }

    _addEquipZoneText(displayText, equipZone, zoneNo) {
        const x = equipZone.x;
        const y = equipZone.y;
        const z = equipZone.z;

        if (x !== null && x !== undefined && y !== null && y !== undefined && z !== null && z !== undefined) {
            const sprite = this.makeEquipZoneText(displayText, zoneNo, equipZone.equipZoneNo, x, y, z, this.equipZoneFontSize);

            if (sprite) {
                sprite.scale.set(12.5, 6.25, 1.0);
                /*if (zoneID >= 20000)
                    sprite.scale.set(40, 20, 1.0);*/
            }

            return sprite;
        }

        return null;
    }

    updateEquipZoneText(sprite, displayText, zoneNo, equipZoneNo) {
        const originText = sprite.userData.originText ? sprite.userData.originText : sprite.userData.text;
        const equipZone = { x: sprite.position.x, y: sprite.position.y, z: sprite.position.z, equipZoneNo };
        sprite.parent.remove(sprite);

        const textPoi = this._addEquipZoneText(displayText, equipZone, zoneNo)

        if (textPoi) {
            textPoi.userData.originText = originText;
        }

        return textPoi;
    }

    getEquipZoneTextLabel(equipZoneNo) {
        const textLayer = this.getTextLayer(TextPoiManager.EquipZoneNameText);

        if (textLayer) {
            for (const child of textLayer.children) {
                const [zoneNo, _equipZoneNo, sensorType, sensorSubType] = PoiManager.parseSensorKey(child);

                if (_equipZoneNo === equipZoneNo) {
                    return child;
                }
            }
        }

        return null;
    }

    rollbackEquipZoneText(label, equipZoneNo) {
        const originText = label?.userData?.originText;

        if (originText) {
            const [zoneNo, _equipZoneNo, sensorType, sensorSubType] = PoiManager.parseSensorKey(label);
            const equipZone = { x: label.position.x, y: label.position.y, z: label.position.z, equipZoneNo };
            label.parent.remove(label);

            this._addEquipZoneText(originText, equipZone, zoneNo)
        }
    }

    makeBuildingGroupText(text/*: string*/, buildingGroupNo/*: number*/, x/*: number*/, y/*: number*/, z/*: number*/, fontSize/*: number*/)/*: THREE.Sprite | null*/ {
        const backgroundColor = { r: 0, g: 0, b: 0, a: 0.7 };
        const borderColor = this.buildingTextBorderColor;
        const textColor = this.textColor;
        const borderThickness = this.borderThickness;
        return this.addText(TextPoiManager.BuildingGroupNameText, text, -1, buildingGroupNo, x, y, z, fontSize, backgroundColor, borderColor, textColor, borderThickness);
    }

    makeBuildingText(text/*: string*/, buildingNo/*: number*/, x/*: number*/, y/*: number*/, z/*: number*/, fontSize/*: number*/)/*: THREE.Sprite | null*/ {
        const backgroundColor = { r: 0, g: 0, b: 0, a: 0.7 };
        const borderColor = this.buildingTextBorderColor;
        const textColor = this.textColor;
        const borderThickness = this.borderThickness;
        return this.addText(TextPoiManager.BuildingNameText, text, -1, buildingNo, x, y, z, fontSize, backgroundColor, borderColor, textColor, borderThickness);
    }

    makeEquipZoneText(text/*: string*/, zoneNo/*: number*/, equipZoneNo/*: number*/, x/*: number*/, y/*: number*/, z/*: number*/, fontSize/*: number*/)/*: THREE.Sprite | null*/ {
        let backgroundColor = { r: 0, g: 0, b: 0, a: 0.7 };
        let borderColor = this.buildingTextBorderColor;
        const textColor = this.textColor;
        const borderThickness = this.borderThickness;
        return this.addText(TextPoiManager.EquipZoneNameText, text, zoneNo, equipZoneNo, x, y, z, fontSize, backgroundColor, borderColor, textColor, borderThickness);
    }

    addText(tag/*: string*/, text/*: string*/, zoneNo/*: number*/, no/*: number*/, x/*: number*/, y/*: number*/, z/*: number*/, fontSize/*: number*/, backgroundColor/*: rgbaColor*/, borderColor/*: rgbaColor*/, textColor/*: rgbaColor*/, borderThickness/*: number*/)/*: THREE.Sprite | null*/ {
        const canvas = document.createElement('canvas');
        const context = canvas.getContext('2d');

        if (context === null) {
            return null;
        }

        const fontScale = 1;//TextPoiManager.getFontScale(fontSize, text);
        fontSize *= fontScale;

        const fontFace = 'malgun gothic';

        context.font = fontSize + "px " + fontFace;
        //context.font = "Bold " + fontSize + "px " + fontFace;
        context.fillStyle = "rgba(" + backgroundColor.r + "," + backgroundColor.g + "," + backgroundColor.b + "," + backgroundColor.a + ")";
        // border color
        context.strokeStyle = "rgba(" + borderColor.r + "," + borderColor.g + "," + borderColor.b + "," + borderColor.a + ")";
        context.lineWidth = borderThickness;

        const padding = 10;
        const metrics = context.measureText(text);
        const width = metrics.width + padding;

        let w = width + borderThickness;
        const originWidth = w;

        if (tag === TextPoiManager.BuildingGroupNameText) {
            if (text.length === 2) {
                if (!this.buildingGroupTextWidth) {
                    this.buildingGroupTextWidth = w + padding;
                }

                w = this.buildingGroupTextWidth;
            }
            else if (text.length < 2) {
                w = this.buildingGroupTextWidth;
            }
        }

        const h = fontSize * 1.4 + borderThickness;
        const rectX = (canvas.width - w - borderThickness) / 2;
        const rectY = (canvas.height - h - borderThickness) / 2;

        this.roundRect(context, rectX, rectY, w, h, 6);

        // text color
        context.fillStyle = "rgba(" + textColor.r + "," + textColor.g + "," + textColor.b + "," + textColor.a + ")";
        context.fillText(text, rectX + padding / 2 + (w - originWidth) / 2, rectY + fontSize);

        // canvas contents will be used for a texture
        const texture = new THREE.Texture(canvas)
        texture.needsUpdate = true;

        // const spriteAlignment = THREE.SpriteAlignment.topLeft;

        const spriteMaterial = new THREE.SpriteMaterial(
            { map: texture/*, useScreenCoordinates: false, alignment: spriteAlignment*/ });

        const sprite = new THREE.Sprite(spriteMaterial);
        sprite.scale.set(100 / fontScale, 50 / fontScale, 1.0 / fontScale);

        sprite.material.depthWrite = false;
        sprite.material.depthTest = false;
        sprite.position.x = x;
        sprite.position.y = y;
        sprite.position.z = z;
        sprite.name = tag + "_" + zoneNo + "_" + no;

        sprite.userData.boundingBox = {
            tl: {
                x: x - rectX / 80,
                z: z - rectY / 80
            },
            br: {
                x: x + rectX / 80,
                z: z + rectY / 80
            }
        };

        sprite.userData.uvArea = {
            top: 0.5 + (h / sprite.scale.x) / 2,
            bottom: 0.5 - (h / sprite.scale.x) / 2,
            left: 0.5 - rectX / rectY * (h / sprite.scale.x) / 2,
            right: 0.5 + rectX / rectY * (h / sprite.scale.x) / 2
        };

        sprite.userData.text = text;

        const textLayer = this.getTextLayer(tag);

        if (textLayer) {
            textLayer.add(sprite);
        }

        return sprite;
    }

    roundRect(context/*: CanvasRenderingContext2D*/, x/*: number*/, y/*: number*/, w/*: number*/, h/*: number*/, r/*: number*/)/*: void*/ {
        context.beginPath();
        context.moveTo(x + r, y);
        context.lineTo(x + w - r, y);
        context.quadraticCurveTo(x + w, y, x + w, y + r);
        context.lineTo(x + w, y + h - r);
        context.quadraticCurveTo(x + w, y + h, x + w - r, y + h);
        context.lineTo(x + r, y + h);
        context.quadraticCurveTo(x, y + h, x, y + h - r);
        context.lineTo(x, y + r);
        context.quadraticCurveTo(x, y, x + r, y);
        context.closePath();
        context.fill();
        context.stroke();
    }

    getTextLayer(tag) {
        if (!this.baseTextLayer) {
            this.baseTextLayer = new THREE.Object3D();
            this.baseTextLayer.matrixAutoUpdate = false;
            this.baseTextLayer.name = "textLayerBase";

            this.scene.add(this.baseTextLayer);
        }

        if (tag === null) {
            return this.baseTextLayer;
        }

        let textLayer = this.textLayers[tag];

        if (!textLayer) {
            textLayer = new THREE.Object3D();
            textLayer.matrixAutoUpdate = false;
            textLayer.name = "textLayer_" + tag;

            this.baseTextLayer.add(textLayer);
            this.textLayers[tag] = textLayer;
        }

        return textLayer;
    }

    showIndoorText() {
        this.showTextLayer(TextPoiManager.BuildingGroupNameText, false);
        this.showTextLayer(TextPoiManager.BuildingNameText, false);
        this.showTextLayer(TextPoiManager.EquipZoneNameText, true);
    }

    showTextLayer(tag, visible) {
        const textLayer = this.getTextLayer(tag);

        if (textLayer) {
            textLayer.visible = visible;
        }
    }

    checkZoomValue(isIndoor, zoomValue, isEditMode) {
        if (isIndoor === false) {
            if (this.buildingGroupTextVisible === null) {
                const buildingGroupTextVisible = this._checkZoomValue(zoomValue, isEditMode);

                this.showTextLayer(TextPoiManager.BuildingGroupNameText, buildingGroupTextVisible);
                this.showTextLayer(TextPoiManager.BuildingNameText, !buildingGroupTextVisible);
                this.buildingGroupTextVisible = buildingGroupTextVisible;
            }
            else if (this.buildingGroupTextVisible) {
                if (this._checkZoomValue(zoomValue, isEditMode) === false) {
                    this.showTextLayer(TextPoiManager.BuildingGroupNameText, false);
                    this.showTextLayer(TextPoiManager.BuildingNameText, true);
                    this.buildingGroupTextVisible = false;
                }
            }
            else {
                if (this._checkZoomValue(zoomValue, isEditMode)) {
                    this.showTextLayer(TextPoiManager.BuildingGroupNameText, true);
                    this.showTextLayer(TextPoiManager.BuildingNameText, false);
                    this.buildingGroupTextVisible = true;
                }
            }
        }
    }

    _checkZoomValue(zoomValue, isEditMode) {
        if (isEditMode) {
            return zoomValue < TextPoiManager.BuildingGroupTextEditModeDistance;
        }

        return zoomValue >= TextPoiManager.BuildingGroupTextDistance;
    }

    initZoomValue() {
        this.buildingGroupTextVisible = null;
    }

    selectPoi(poi, moveTo = false) {
        if (poi) {
            if (moveTo) {
                const buildingGroup = this.isBuildingGroup(poi);

                if (buildingGroup) {
                    if (_3dMaster.checkUserBuildingGroup(buildingGroup)) {
                        this._3dMaster.contents3D.props.moveToBuildingGroup(buildingGroup.buildingGroupNo);
                    }
                }
                else {
                    const building = this.isBuilding(poi);

                    if (building) {
                        if (_3dMaster.checkUserBuilding(building)) {
                            const firstZone = this.getFirstZone(building);

                            if (firstZone) {
                                this._3dMaster.contents3D.props.moveToZone(firstZone.zoneNo);
                            }
                        }
                    }
                }
            }
        }

        this.selectedTextPoi = poi;
    }

    getFirstZone(building) {
        if (building?.zoneDatas) {
            for (const zoneData of building.zoneDatas) {
                return zoneData;
            }
        }

        return null;
    }

    updateText(poi, text) {
        //let textPoi = null;

        if (poi && text) {
            if (this.selectedTextPoi === poi) {
                this.selectedTextPoi = null;
            }

            const [tag, zoneNo, no] = TextPoiManager.getPoiInfo(poi);

            if (tag === TextPoiManager.BuildingGroupNameText) {
                /*const buildingGroup = {
                    buildingGroupNo: no,
                    x: poi.position.x,
                    y: poi.position.y,
                    z: poi.position.z
                };*/

                const buildingGroup = this.spatialManager.getBuildingGroup(no);

                if (buildingGroup) {
                    /*textPoi = */this._addBuildingGroupText(text, buildingGroup);
                }
            }
            else if (tag === TextPoiManager.BuildingNameText) {
                /*const building = {
                    buildingNo: no,
                    x: poi.position.x,
                    y: poi.position.y,
                    z: poi.position.z
                };*/

                const building = this.spatialManager.getBuilding(no);

                if (building) {
                    const buildingGroup = this.spatialManager.getBuildingGroup(building.buildingGroupNo);

                    if (buildingGroup) {
                        /*textPoi = */this._addBuildingText(text, building, buildingGroup.name, buildingGroup.siteNo);
                    }
                }
            }
            else if (tag === TextPoiManager.EquipZoneNameText) {
                const equipZone = {
                    equipZoneNo: no,
                    x: poi.position.x,
                    y: poi.position.y,
                    z: poi.position.z
                };

                /*textPoi = */this._addEquipZoneText(text, equipZone, zoneNo);
            }

            poi.parent.remove(poi);
        }

        //return textPoi;
    }

    static getPoiInfo(poi) {
        const index = poi.name.indexOf('_');

        if (index > 0) {
            const index2 = poi.name.indexOf('_', index + 1);

            if (index2 > index) {
                const tag = poi.name.substring(0, index).trim();
                const strZoneNo = poi.name.substring(index + 1, index2).trim();
                const strNo = poi.name.substring(index2 + 1).trim();

                const zoneNo = parseInt(strZoneNo);
                const no = parseInt(strNo);

                if (isNaN(zoneNo) || isNaN(no)) {
                    return [null, null, null];
                }

                return [tag, zoneNo, no];
            }
        }

        return [null, null, null];
    }

    // 3D Text의 선명도를 높이기 위해 폰트를 몇배로 키울것인가?
    static getFontScale(fontSize, text) {
        if (!text || text.length >= 11) {
            return 1.0;
        }

        if (fontSize <= 12) {
            return 2.0;
        }

        if (fontSize <= 36) {
            return 36 / fontSize;
        }

        return 1.0;
    }

    static isTextPoi(sensorType) {
        if (sensorType?.startsWith && sensorType.startsWith("text")) {
            return true;
        }

        return false;
    }

    isBuildingGroup(poi) {
        if (poi.name.startsWith(TextPoiManager.BuildingGroupNameText)) {
            const tokens = poi.name.split('_');

            if (tokens.length >= 3) {
                const buildingGroupNo = parseInt(tokens[2].trim());

                if (isNaN(buildingGroupNo) === false) {
                    return this.spatialManager.buildingGroups[buildingGroupNo];
                }
            }
        }

        return null;
    }

    isBuilding(poi) {
        if (poi.name.startsWith(TextPoiManager.BuildingNameText)) {
            const tokens = poi.name.split('_');

            if (tokens.length >= 3) {
                const buildingNo = parseInt(tokens[2].trim());

                if (isNaN(buildingNo) === false) {
                    return this.spatialManager.buildings[buildingNo];
                }
            }
        }

        return 0;
    }

    setWorkerVisibleType(worker, visitor, siteNo) {
        if (!this.currentWorkerManager?.baseBuildingGroupTextLayer || !this.currentWorkerManager?.baseBuildingTextLayer) {
            return;
        }

        if (!this.useWorker) {
            return;
        }

        if (worker && visitor) {
            this.setWorkerType(TextPoiManager.WorkerType.workerNVisitor, siteNo);
        }
        else if (worker) {
            this.setWorkerType(TextPoiManager.WorkerType.workerOnly, siteNo);
        }
        else if (visitor) {
            this.setWorkerType(TextPoiManager.WorkerType.visitorOnly, siteNo);
        }
        else {
            this.setWorkerType(TextPoiManager.WorkerType.noWorker, siteNo);
        }
    }

    setWorkerType(workerType, siteNo) {
        if (this.useWorker) {
            if (workerType === TextPoiManager.WorkerType.noWorker) {
                this._setWorkerType(this.workerManagerNormal, siteNo);
            }
            else if (workerType === TextPoiManager.WorkerType.workerOnly) {
                this._setWorkerType(this.workerManagerWorker, siteNo);
            }
            else if (workerType === TextPoiManager.WorkerType.visitorOnly) {
                this._setWorkerType(this.workerManagerVisitor, siteNo);
            }
            else if (workerType === TextPoiManager.WorkerType.workerNVisitor) {
                this._setWorkerType(this.workerManagerBoth, siteNo);
            }
        }
        else {
            this._setWorkerType(this.workerManagerNormal, siteNo);
        }
    }

    _setWorkerType(workerManager, siteNo) {
        if (this.currentWorkerManager !== workerManager) {
            if (this.currentWorkerManager) {
                this.currentWorkerManager.setVisible(false, siteNo);
            }

            workerManager.setVisible(true, siteNo);
            this.currentWorkerManager = workerManager;
            this.currentWorkerManagerSiteNo = siteNo;
        } else if (this.currentWorkerManagerSiteNo !== siteNo) {
            // 사이트가 달라질 경우
            workerManager.setVisible(true, siteNo);
            this.currentWorkerManagerSiteNo = siteNo;
        }
    }

    updateWorker() {
        if (!this.useWorker || !this.completeBuildingGroupText || !this.completeBuildingText) {
            return;
        }

        const buildingGroups = { ...this.spatialManager.buildingGroups }

        for (const buildingGroupNo in buildingGroups) {
            const buildingGroup = buildingGroups[buildingGroupNo];

            const x = buildingGroup.x;
            const y = buildingGroup.y;
            const z = buildingGroup.z;

            if (x !== null && x !== undefined &&
                y !== null && y !== undefined &&
                z !== null && z !== undefined) {
                const [workerCount, visitorCount] = WorkerManager.getBuildingGroupWorker(buildingGroup.buildingGroupNo);

                const workerChanged = this.workerManagerWorker.checkWorkerCount(buildingGroup.buildingGroupNo, workerCount) === false;
                const visitorChanged = this.workerManagerVisitor.checkVisitorCount(buildingGroup.buildingGroupNo, visitorCount) === false;

                if (workerChanged) {
                    this.workerManagerWorker.setBuildingGroupWorkerCount(buildingGroup.buildingGroupNo, workerCount);
                    this.workerManagerWorker.updateBuildingGroupText(buildingGroup.name, buildingGroup.displayText, buildingGroup.buildingGroupNo, x, y, z, this.buildingGroupFontSize, buildingGroup.siteNo, this, workerCount, visitorCount);
                }

                if (visitorChanged) {
                    this.workerManagerVisitor.setBuildingGroupVisitorCount(buildingGroup.buildingGroupNo, visitorCount);
                    this.workerManagerVisitor.updateBuildingGroupText(buildingGroup.name, buildingGroup.displayText, buildingGroup.buildingGroupNo, x, y, z, this.buildingGroupFontSize, buildingGroup.siteNo, this, workerCount, visitorCount);
                }

                if (workerChanged || visitorChanged) {
                    this.workerManagerBoth.updateBuildingGroupText(buildingGroup.name, buildingGroup.displayText, buildingGroup.buildingGroupNo, x, y, z, this.buildingGroupFontSize, buildingGroup.siteNo, this, workerCount, visitorCount);
                }
            }
        }

        const buildings = { ...this.spatialManager.buildings }

        /*for (const buildingNo in buildings) {
            const building = buildings[buildingNo];
            const [workerCount, visitorCount] = WorkerManager.getBuildingWorker(building.buildingNo);

            const workerChanged = this.workerManagerWorker.checkBuildingWorkerCount(buildingGroup.buildingGroupNo, workerCount) === false;
            const visitorChanged = this.workerManagerVisitor.checkBuildingVisitorCount(buildingGroup.buildingGroupNo, visitorCount) === false;

            if (workerChanged) {
                this.workerManagerWorker.updateBuildingText(building.name, displayText, building.buildingNo, x, y, z, this.buildingFontSize, buildingGroup.siteNo, this, workerCount, visitorCount);
            }

            if (visitorChanged) {
                this.workerManagerVisitor.updateBuildingText(buildingGroup.name, displayText, buildingGroup.buildingGroupNo, x, y, z, this.buildingGroupFontSize, buildingGroup.siteNo, this, workerCount, visitorCount);
            }

            if (workerChanged || visitorChanged) {
                this.workerManagerBoth.updateBuildingText(buildingGroup.name, displayText, buildingGroup.buildingGroupNo, x, y, z, this.buildingGroupFontSize, buildingGroup.siteNo, this, workerCount, visitorCount);
            }
        }*/
    }

    select(x, y, tag) {
        const textLayer = this.getTextLayer(tag);

        if (textLayer && this._3dMaster?.camera) {
            const mouse = new THREE.Vector2((x / window.innerWidth) * 2 - 1, -(y / window.innerHeight) * 2 + 1);

            const raycaster = new THREE.Raycaster();
            raycaster.setFromCamera(mouse, this._3dMaster.camera);

            for (const child of textLayer.children) {
                if (this._hitTest(child, raycaster.ray.origin.x, raycaster.ray.origin.z)) {
                    return child;
                }
            }
        }

        return null;
    }

    // 선택된 공간명(설비구역) Label을 하이라이트한다.
    highlightEquipZoneLabel(label) {
        if (!label) {
            return;
        }

        if (this.highlightedEquipZoneLabel === label) {
            return;
        }

        this.clearEquipZoneHighlight();

        const highlightBackgroundColor = { r: 63, g: 108, b: 219, a: 0.95 };
        const highlightBorderColor = { r: 255, g: 255, b: 255, a: 1.0 };

        this._applyEquipZoneTexture(label, highlightBackgroundColor, highlightBorderColor, this.textColor);
        this.highlightedEquipZoneLabel = label;
    }

    // 공간명(설비구역) Label의 하이라이트를 원래 색으로 되돌린다.
    clearEquipZoneHighlight() {
        const label = this.highlightedEquipZoneLabel;

        if (!label) {
            return;
        }

        this.highlightedEquipZoneLabel = null;

        // 이미 교체/제거된 Label이면 복원하지 않는다.
        if (!label.parent) {
            return;
        }

        const backgroundColor = { r: 0, g: 0, b: 0, a: 0.7 };
        this._applyEquipZoneTexture(label, backgroundColor, this.buildingTextBorderColor, this.textColor);
    }

    _applyEquipZoneTexture(label, backgroundColor, borderColor, textColor) {
        const text = label?.userData?.text;

        if (text === null || text === undefined) {
            return;
        }

        const texture = this._createEquipZoneTexture(text, backgroundColor, borderColor, textColor, this.borderThickness);

        if (!texture) {
            return;
        }

        const oldMap = label.material.map;
        label.material.map = texture;
        label.material.needsUpdate = true;

        if (oldMap) {
            oldMap.dispose();
        }
    }

    // addText(...)의 공간명(EquipZone) 그리기 로직과 동일한 방식으로 Texture만 다시 생성한다.
    _createEquipZoneTexture(text, backgroundColor, borderColor, textColor, borderThickness) {
        const canvas = document.createElement('canvas');
        const context = canvas.getContext('2d');

        if (context === null) {
            return null;
        }

        const fontSize = this.equipZoneFontSize;
        const fontFace = 'malgun gothic';

        context.font = fontSize + "px " + fontFace;
        context.fillStyle = "rgba(" + backgroundColor.r + "," + backgroundColor.g + "," + backgroundColor.b + "," + backgroundColor.a + ")";
        context.strokeStyle = "rgba(" + borderColor.r + "," + borderColor.g + "," + borderColor.b + "," + borderColor.a + ")";
        context.lineWidth = borderThickness;

        const padding = 10;
        const metrics = context.measureText(text);
        const width = metrics.width + padding;

        const w = width + borderThickness;
        const originWidth = w;

        const h = fontSize * 1.4 + borderThickness;
        const rectX = (canvas.width - w - borderThickness) / 2;
        const rectY = (canvas.height - h - borderThickness) / 2;

        this.roundRect(context, rectX, rectY, w, h, 6);

        context.fillStyle = "rgba(" + textColor.r + "," + textColor.g + "," + textColor.b + "," + textColor.a + ")";
        context.fillText(text, rectX + padding / 2 + (w - originWidth) / 2, rectY + fontSize);

        const texture = new THREE.Texture(canvas);
        texture.needsUpdate = true;

        return texture;
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

    _hitTest(textPoi, x, z) {
        const boundingBox = textPoi.userData.boundingBox;

        if (!boundingBox || !boundingBox.tl || !boundingBox.br) {
            return false;
        }

        if (x >= boundingBox.tl.x && x <= boundingBox.br.x &&
            z >= boundingBox.tl.z && z <= boundingBox.br.z) {
            textPoi.userData.origin = { x: textPoi.position.x, z: textPoi.position.z };
            return true;
        }

        return false;
    }

    static isEquipmentZone(poi) {
        if (poi.name.startsWith(TextPoiManager.EquipZoneNameText)) {
            const tokens = poi.name.split('_');

            if (tokens.length >= 3) {
                const equipZoneNo = parseInt(tokens[2].trim());

                if (isNaN(equipZoneNo) === false) {
                    return equipZoneNo;
                }
            }
        }

        return 0;
    }

    static isSameCoord(data1/*: number*/, data2/*: number*/)/*: boolean*/ {
        const diff = data1 - data2;

        if (diff > -0.1 && diff < 0.1) {
            return true;
        }

        return false;
    }

    static loadSpriteIconImage() {
        return TextPoiManager.loadSpriteIconImageCount >= 4;
    }
}