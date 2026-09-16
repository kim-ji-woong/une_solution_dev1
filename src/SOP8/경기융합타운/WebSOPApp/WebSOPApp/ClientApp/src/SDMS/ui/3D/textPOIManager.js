import { SDMSController } from "../../services/sdmsController";
import * as THREE from "three/build/three.module.js";
import SDMSMainMenu from "../sdmsMainMenu";
import Geometry from '../../../Common/util/Geometry.js';
import ProjectResource from "../../../Root/resource/id";
import SDMSResource from '../../resource/id';
import SDMS from "../sdms";
import { WorkerManagerNormal } from "./workers/workerManagerNormal";
import { WorkerManagerWorker } from "./workers/workerManagerWorker";
import { WorkerManagerVisitor } from "./workers/workerManagerVisitor";
import { WorkerManagerBoth } from "./workers/workerManagerBoth";
import Contents3D from "./contents3D";
//const THREE = require('three/build/three.module.js');

import { AssessmentController } from '../../services/assessmentController';
import { i18n } from "../../../language/i18n";
import AccountResource from "../../../Account/resource/id";

/*type rgbaColor = {
    r: number,
    g: number,
    b: number,
    a: number
};

type nullableNumber = number | null | undefined;

export interface IScene {
    add(param: object): void;
}*/

export class TextPOIManager {
    static BuildingGroupTextDistance = 500;
    //static BuildingGroupFontSize = 36;
    //static BuildingFontSize = 12;
    static EquipZoneFontSize = 12;

    static Mode_MoveText = 0;
    static Mode_EditText = 1;
    static Mode_EditEquipZoneSensor = 2;
    static Mode_AddArea = 3;
    static Mode_RemoveArea = 4;

    static WorkerType = {
        noWorker: 0,
        workerOnly: 1,
        visitorOnly: 2,
        workerNVisitor: 3
    }

    static EquipZoneType = {
        interest: 1,
        caution: 2,
        alert: 3,
        seriousness: 4,
    }

    scene = null;
    buildingGroupTextVisible = false;
    //buildingGroupText/*: { [buildingGroupName: string]: [THREE.Sprite, string] }*/ = {};
    buildingTextVisible = false;
    //buildingText/*: { [buildingGroupName: string]: { [buildingName: string]: THREE.Sprite } }*/ = {};
    equipZoneText/*: { [zoneID: number]: { [equipZoneID: number]: THREE.Sprite } }*/ = {};
    // 최근에 실내에서 표시되었던 EquipZone Text Sprite
    prevEquipZoneSprites/*: THREE.Sprite[]*/ = [];

    languageTextLayers = {};
    //siteTextLayers = {};

    //textLayer = null;

    // 구역 평가 등급 관련
    assessImgURL = {};      // 등급별 assess 이미지 URL   { [rank]: assess Img URL }
    isVisibleAssess = false;

    _2TextWidth = null;
    borderThickness = 1;
    textColor = { r: 255, g: 255, b: 255, a: 1.0 };
    buildingTextBorderColor = { r: 63, g: 108, b: 219, a: 1.0 };
    buildingGroupFontSize = 36;
    buildingFontSize = 12;
    prevZoneID = -1;
    prevSiteID = null;

    backColor_Interest = { r: 83, g: 152, b: 255, a: 0.7 };
    borderColor_Interest = { r: 83, g: 152, b: 255, a: 0.7 };
    backColor_Caution = { r: 255, g: 215, b: 83, a: 0.7 };
    borderColor_Caution = { r: 255, g: 233, b: 161, a: 1.0 };
    backColor_Alert = { r: 255, g: 30, b: 0, a: 0.7 };
    borderColor_Alert = { r: 255, g: 206, b: 132, a: 1.0 };
    backColor_Seriousness = { r: 240, g: 0, b: 0, a: 0.7 };
    borderColor_Seriousness = { r: 243, g: 137, b: 137, a: 1.0 };

    // smoothVisible Options
    movingSprites = [];
    static smoothVisibleTime = 1;
    elapsedSmoothVisibleTime = 0;
    beginSmoothVisibleTime = false;
    useSmoothVisible = false;

    static loadSpriteIconImageCount = 0;

    selectedPOI = null;
        
    get Scene() {
        return this.scene;
    }

    set Scene(scene) {
        this.scene = scene;
        this.workerManagerNormal.Scene = scene;
        this.workerManagerWorker.Scene = scene;
        this.workerManagerVisitor.Scene = scene;
        this.workerManagerBoth.Scene = scene;

        const textLayer = this.getTextLayer(ProjectResource.siteID);
        this.workerManagerNormal.baseLayer = textLayer;
        this.workerManagerWorker.baseLayer = textLayer;
        this.workerManagerVisitor.baseLayer = textLayer;
        this.workerManagerBoth.baseLayer = textLayer;

        this._setWorkerType(this.workerManagerNormal);
    }

    setScene(scene, siteID) {
        this.scene = scene;
        this.workerManagerNormal.Scene = scene;
        this.workerManagerWorker.Scene = scene;
        this.workerManagerVisitor.Scene = scene;
        this.workerManagerBoth.Scene = scene;

        const textLayer = this.getTextLayer(siteID);
        this.workerManagerNormal.baseLayer = textLayer;
        this.workerManagerWorker.baseLayer = textLayer;
        this.workerManagerVisitor.baseLayer = textLayer;
        this.workerManagerBoth.baseLayer = textLayer;

        this._setWorkerType(this.workerManagerNormal, siteID);
    }

    // 구역 평가 관련 옵션
    useEquipZoneAssess = false;    

    constructor(getBuildingGroupWorkerInfo, getBuildingWorkerInfo) {
        if (ProjectResource.siteID === ProjectResource.Site.GCC) {
            this.buildingGroupFontSize = 24;
            this.borderThickness = 2;
            this.buildingTextBorderColor = { r: 255, g: 255, b: 255, a: 1.0 };
        }

        this.useWorker = Contents3D.useWorkerInfo();
        this.initializeWorkerManger(getBuildingGroupWorkerInfo, getBuildingWorkerInfo);

        // 등급 이미지 초기화
        this.initAssessment();
    }

    // 등급 이미지 초기화
    initAssessment() {
        let rank = SDMSResource.AssessmentClass.A;
        this.assessImgURL[rank] = this.getRankImg(rank);
        rank = SDMSResource.AssessmentClass.B;
        this.assessImgURL[rank] = this.getRankImg(rank);
        rank = SDMSResource.AssessmentClass.C;
        this.assessImgURL[rank] = this.getRankImg(rank);
        rank = SDMSResource.AssessmentClass.D;
        this.assessImgURL[rank] = this.getRankImg(rank);
        rank = SDMSResource.AssessmentClass.E;
        this.assessImgURL[rank] = this.getRankImg(rank);
        rank = SDMSResource.AssessmentClass.B  + "_wonik";
        this.assessImgURL[rank] = this.getRankImg(rank);
        rank = SDMSResource.AssessmentClass.C + "_wonik";
        this.assessImgURL[rank] = this.getRankImg(rank);
    }

    getRankImg(rank) {
        if (!rank)
            return null;

        const img = new Image(128, 128);
        img.src = '/resource/image/icon/assess' + rank + '.png';

        return img;
    }

    setVisibleAssessment(isShow, siteID) {
        const isVisible = (isShow === true);

        if (this.isVisibleAssess === isVisible)
            return;

        this.isVisibleAssess = isVisible;

        this.showAssessment(this.prevZoneID, siteID);
    }

    setUseEquipZoneAssess(useEquipZoneAssess) {
        this.useEquipZoneAssess = useEquipZoneAssess;
    }

    initializeWorkerManger(getBuildingGroupWorkerInfo, getBuildingWorkerInfo) {
        this.getBuildingGroupWorkerInfo = getBuildingGroupWorkerInfo;
        this.getBuildingWorkerInfo = getBuildingWorkerInfo;

        this.workerManagerNormal = new WorkerManagerNormal();
        this.workerManagerWorker = new WorkerManagerWorker();
        this.workerManagerVisitor = new WorkerManagerVisitor();
        this.workerManagerBoth = new WorkerManagerBoth();

        const spriteIconImage_PersonNormal = new Image(128, 128);
        const spriteIconImage_PersonZero = new Image(128, 128);
        const spriteIconImage_PeopleNormal = new Image(128, 128);
        const spriteIconImage_PeopleZero = new Image(128, 128);

        spriteIconImage_PersonNormal.src = "resource/image/icon/person_green.png";
        spriteIconImage_PersonZero.src = "resource/image/icon/person_gray.png";
        spriteIconImage_PeopleNormal.src = "resource/image/icon/people_yellow.png";
        spriteIconImage_PeopleZero.src = "resource/image/icon/people_gray.png";

        spriteIconImage_PersonNormal.onload = () => {
            TextPOIManager.loadSpriteIconImageCount++;
            this.workerManagerWorker.setWorkerImage(spriteIconImage_PersonNormal, true);
            this.workerManagerBoth.setWorkerImage(spriteIconImage_PersonNormal, true);
        };

        spriteIconImage_PersonZero.onload = () => {
            TextPOIManager.loadSpriteIconImageCount++;
            this.workerManagerWorker.setWorkerImage(spriteIconImage_PersonZero, false);
            this.workerManagerBoth.setWorkerImage(spriteIconImage_PersonZero, false);
        };

        spriteIconImage_PeopleNormal.onload = () => {
            TextPOIManager.loadSpriteIconImageCount++;
            this.workerManagerVisitor.setVisitorImage(spriteIconImage_PeopleNormal, true);
            this.workerManagerBoth.setVisitorImage(spriteIconImage_PeopleNormal, true);
        };

        spriteIconImage_PeopleZero.onload = () => {
            TextPOIManager.loadSpriteIconImageCount++;
            this.workerManagerVisitor.setVisitorImage(spriteIconImage_PeopleZero, false);
            this.workerManagerBoth.setVisitorImage(spriteIconImage_PeopleZero, false);
        };
    }

    setWorkerVisibleType(worker, visitor, siteID) {
        if (!this.currentWorkerManager?.baseLayer) {
            return;
        }

        if (worker && visitor) {
            this.setWorkerType(TextPOIManager.WorkerType.workerNVisitor, siteID);
        }
        else if (worker) {
            this.setWorkerType(TextPOIManager.WorkerType.workerOnly, siteID);
        }
        else if (visitor) {
            this.setWorkerType(TextPOIManager.WorkerType.visitorOnly, siteID);
        }
        else {
            this.setWorkerType(TextPOIManager.WorkerType.noWorker, siteID);
        }
    }

    setWorkerType(workerType, siteID) {
        if (this.useWorker) {
            if (workerType === TextPOIManager.WorkerType.noWorker) {
                this._setWorkerType(this.workerManagerNormal, siteID);
            }
            else if (workerType === TextPOIManager.WorkerType.workerOnly) {
                this._setWorkerType(this.workerManagerWorker, siteID);
            }
            else if (workerType === TextPOIManager.WorkerType.visitorOnly) {
                this._setWorkerType(this.workerManagerVisitor, siteID);
            }
            else if (workerType === TextPOIManager.WorkerType.workerNVisitor) {
                this._setWorkerType(this.workerManagerBoth, siteID);
            }
        }
        else {
            this._setWorkerType(this.workerManagerNormal, siteID);
        }
    }

    _setWorkerType(workerManager, siteID) {
        if (this.currentWorkerManager !== workerManager) {
            if (this.currentWorkerManager) {
                //this.currentWorkerManager.setVisible(false, ProjectResource.siteID);
                this.currentWorkerManager.setVisible(false, siteID);
            }

            //workerManager.setVisible(true, ProjectResource.siteID);
            workerManager.setVisible(true, siteID);
            this.currentWorkerManager = workerManager;
            this.currentWorkerManagerSiteID = siteID;
        } else if (this.currentWorkerManagerSiteID !== siteID) {
            // 사이트가 달라질 경우
            workerManager.setVisible(true, siteID);
            this.currentWorkerManagerSiteID = siteID;
        }
    }

    static loadSpriteIconImage() {
        return TextPOIManager.loadSpriteIconImageCount >= 4;
    }

    static parseJson(str) {
        try {
            return JSON.parse(str);
        }
        catch (e) {

        }

        return str;
    }

    getBuildingGroupLanguageList(buildingGroups) {
        const languageTypes = [];
        const buildingGroupCount = buildingGroups.length;

        for (let i = 0; i < buildingGroupCount; i++) {
            const buildingGroup = buildingGroups[i];
            // buildingGroup Name 대신 buildingGroup DisplayText 으로 구성 변경 
            //const buildingGroupName = TextPOIManager.parseJson(buildingGroup[0]);
            const buildingGroupDisplayText = TextPOIManager.parseJson(buildingGroup[1]);

            if (typeof buildingGroupDisplayText === 'object') {
                for (const languageType in buildingGroupDisplayText) {
                    languageTypes.push(languageType);
                }
            }

            break;
        }

        return languageTypes;
    }

    addBuildingGroupText(buildingGroups/*: Array<[string, string, string, number, number, number]>*/, siteID)/*:void*/ {
        const currentLanguage = i18n.language;
        const languageTypes = this.getBuildingGroupLanguageList(buildingGroups);

        const buildingGroupCount = buildingGroups.length;

        if (languageTypes.length > 0) {
            for (const languageType of languageTypes) {
                i18n.changeLanguage(languageType);

                for (let i = 0; i < buildingGroupCount; i++) {
                    const buildingGroup = buildingGroups[i];
                    // buildingGroup Name 대신 buildingGroup DisplayText 으로 구성 변경 
                    //const buildingGroupName = TextPOIManager.parseJson(buildingGroup[0]);
                    //const _buildingGroupName = buildingGroupName[languageType];
                    const buildingGroupDisplayText = TextPOIManager.parseJson(buildingGroup[1]);
                    const _buildingGroupDisplayText = buildingGroupDisplayText[languageType];

                    this._addBuildingGroupText(_buildingGroupDisplayText, buildingGroup, siteID, languageType);

                    /*const displayText = buildingGroup[1];
                    const x = buildingGroup[3];
                    const y = buildingGroup[4];
                    const z = buildingGroup[5];
                    const id = buildingGroup[6];
        
                    if (x !== null && x !== undefined &&
                        y !== null && y !== undefined &&
                        z !== null && z !== undefined) {
                        this.workerManagerNormal.addBuildingGroupText(buildingGroupName, displayText, id, x, y, z, this.buildingGroupFontSize, siteID, this);
        
                        if (this.useWorker) {
                            const [workerCount, visitorCount] = this.getBuildingGroupWorkerInfo(id);
        
                            this.workerManagerWorker.addBuildingGroupText(buildingGroupName, displayText, id, x, y, z, this.buildingGroupFontSize, siteID, this, workerCount, visitorCount);
                            this.workerManagerVisitor.addBuildingGroupText(buildingGroupName, displayText, id, x, y, z, this.buildingGroupFontSize, siteID, this, workerCount, visitorCount);
                            this.workerManagerBoth.addBuildingGroupText(buildingGroupName, displayText, id, x, y, z, this.buildingGroupFontSize, siteID, this, workerCount, visitorCount);
                        }
                    }*/
                }
            }

            i18n.changeLanguage(currentLanguage);
        }
        else {
            for (let i = 0; i < buildingGroupCount; i++) {
                const buildingGroup = buildingGroups[i];
                const buildingGroupName = TextPOIManager.parseJson(buildingGroup[0]);
                this._addBuildingGroupText(buildingGroupName, buildingGroup, siteID, "");
            }
        }

        this.buildingGroupTextVisible = true;
    }

    _addBuildingGroupText(buildingGroupName, buildingGroup, siteID, language) {
        const displayText = TextPOIManager.getLanguageName(TextPOIManager.parseJson(buildingGroup[1]), language);
        const x = buildingGroup[3];
        const y = buildingGroup[4];
        const z = buildingGroup[5];
        const id = buildingGroup[6];

        if (x !== null && x !== undefined &&
            y !== null && y !== undefined &&
            z !== null && z !== undefined) {
            this.workerManagerNormal.addBuildingGroupText(buildingGroupName, displayText, id, x, y, z, this.buildingGroupFontSize, siteID, this);

            if (this.useWorker) {
                const [workerCount, visitorCount] = this.getBuildingGroupWorkerInfo(id);

                this.workerManagerWorker.addBuildingGroupText(buildingGroupName, displayText, id, x, y, z, this.buildingGroupFontSize, siteID, this, workerCount, visitorCount);
                this.workerManagerVisitor.addBuildingGroupText(buildingGroupName, displayText, id, x, y, z, this.buildingGroupFontSize, siteID, this, workerCount, visitorCount);
                this.workerManagerBoth.addBuildingGroupText(buildingGroupName, displayText, id, x, y, z, this.buildingGroupFontSize, siteID, this, workerCount, visitorCount);
            }
            /*const sprite = this.makeBuildingGroupText(displayText, id, x, y, z, this.buildingGroupFontSize, siteID);

            if (sprite) {
                this.buildingGroupText[buildingGroupName] = [sprite, displayText];
            }*/
        }
    }

    getBuildingLanguageList(buildings) {
        const languageTypes = [];

        for (const buildingGroupName in buildings) {
            const objBuildingGroupName = TextPOIManager.parseJson(buildingGroupName);

            if (typeof objBuildingGroupName === 'object') {
                for (const languageType in objBuildingGroupName) {
                    languageTypes.push(languageType);
                }
            }

            break;
        }

        return languageTypes;
    }

    //addBuildingText(buildings, siteID) {
    addBuildingText(buildingGroups, buildings, siteID) {
        const currentLanguage = i18n.language;
        //const languageTypes = this.getBuildingLanguageList(buildings);
        const languageTypes = this.getBuildingGroupLanguageList(buildingGroups);

        if (languageTypes.length > 0) {
            for (const languageType of languageTypes) {
                i18n.changeLanguage(languageType);

                for (const buildingGroupName in buildings) {
                    // .TODO: buildingGroup Name 대신 buildingGroup DisplayText 으로 구성 변경 
                    const buildingGroup = buildings[buildingGroupName];
                    //const objBuildingGroupName = TextPOIManager.parseJson(buildingGroupName);
                    //const _buildingGroupName = objBuildingGroupName[languageType];
                    //this._addBuildingText(_buildingGroupName, buildingGroup, siteID, languageType);

                    const buildingGroupCount = buildingGroups.length;

                    for (let i = 0; i < buildingGroupCount; i++) {
                        const _buildingGroup = buildingGroups[i];
                        const _buildingGroupName = _buildingGroup[0];

                        if (buildingGroupName === _buildingGroupName) {
                            const buildingGroupDisplayText = _buildingGroup[1];
                            const objBuildingGroupDisplayText = TextPOIManager.parseJson(buildingGroupDisplayText);
                            const _buildingGroupDisplayText = objBuildingGroupDisplayText[languageType];
                            this._addBuildingText(_buildingGroupDisplayText, buildingGroup, siteID, languageType);
                            break;
                        }
                    }
                }
            }
        }
        else {
            for (const buildingGroupName in buildings) {
                const buildingGroup = buildings[buildingGroupName];
                this._addBuildingText(buildingGroupName, buildingGroup, siteID, "");
            }
        }

        i18n.changeLanguage(currentLanguage);
        this.buildingTextVisible = false;
    }

    _addBuildingText(buildingGroupName, buildingGroup, siteID, language) {
        for (const buildingName in buildingGroup) {
            const objBuildingName = TextPOIManager.parseJson(buildingName);
            const _buildingName = TextPOIManager.getLanguageName(objBuildingName, language);
            const building = buildingGroup[buildingName];

            const displayText = TextPOIManager.getLanguageName(TextPOIManager.parseJson(building[1]), language);
            const x = building[3];
            const y = building[4];
            const z = building[5];
            const id = building[0];

            if (x !== null && x !== undefined && y !== null && y !== undefined && z !== null && z !== undefined) {
                // 각 사이트 textPOI Layer에 추가되지 않는 문제로 추가사항
                const textLayer = this.getTextLayer(siteID);
                this.workerManagerNormal.baseLayer = textLayer;
                this.workerManagerWorker.baseLayer = textLayer;
                this.workerManagerVisitor.baseLayer = textLayer;
                this.workerManagerBoth.baseLayer = textLayer;

                this.workerManagerNormal.addBuildingText(buildingGroupName, _buildingName, displayText, id, x, y, z, this.buildingFontSize, siteID, this);

                if (this.useWorker) {
                    const [workerCount, visitorCount] = this.getBuildingWorkerInfo(id);

                    this.workerManagerWorker.addBuildingText(buildingGroupName, _buildingName, displayText, id, x, y, z, this.buildingFontSize, siteID, this, workerCount, visitorCount);
                    this.workerManagerVisitor.addBuildingText(buildingGroupName, _buildingName, displayText, id, x, y, z, this.buildingFontSize, siteID, this, workerCount, visitorCount);
                    this.workerManagerBoth.addBuildingText(buildingGroupName, _buildingName, displayText, id, x, y, z, this.buildingFontSize, siteID, this, workerCount, visitorCount);
                }
            }
        }
    }

    static getLanguageName(name, language) {
        const languageName = name[language];

        if (!languageName) {
            return name;
        }

        return languageName;
    }

    static getEquipZoneLanguageList(_3dOptions) {
        const languageTypes = [];

        for (const buildingGroupName in _3dOptions.indoorModels) {
            const buildingGroup = _3dOptions.indoorModels[buildingGroupName];

            for (const buildingName in buildingGroup) {
                const building = buildingGroup[buildingName];

                if (building && building.floors) {
                    const floorCount = building.floors.length;

                    for (let i = 0; i < floorCount; i++) {
                        const floor = building.floors[i];

                        if (floor.file && floor.camera) {
                            const zone = _3dOptions.zones[floor.zoneID];

                            if (zone && zone.equipZones) {
                                for (const equipZoneID in zone.equipZones) {
                                    const equipZone = zone.equipZones[equipZoneID];

                                    if (equipZone && equipZone[1].length > 0 && equipZone[2] !== null) {
                                        const equipZoneName = TextPOIManager.parseJson(equipZone[1]);

                                        if (typeof equipZoneName === 'object') {
                                            for (const languageType in equipZoneName) {
                                                languageTypes.push(languageType);
                                            }
                                        }
                                    }

                                    return languageTypes;
                                }
                            }
                        }
                    }
                }
            }
        }

        return [];
    }

    addEquipZoneText(zoneID/*: number*/, equipZones/*: { [equipZoneID: number]: [number, string, THREE.Vector3] }*/, siteID, languageType)/*: void*/ {
        //const currentLanguage = i18n.language;

        const equipZoneSprites = this.equipZoneText[zoneID] ? this.equipZoneText[zoneID] : {};
        //const equipZoneSprites/*: { [equipZoneID: number]: THREE.Sprite }*/ = {};
        this.equipZoneText[zoneID] = equipZoneSprites;

        for (const equipZoneID in equipZones) {
            const equipZone = equipZones[equipZoneID];

            if (equipZone && equipZone[1].length > 0 && equipZone[2] !== null) {
                //const id = equipZone[0];
                const equipZoneName = TextPOIManager.parseJson(equipZone[1]);

                if (languageType) {
                    const _equipZoneName = equipZoneName[languageType];
                    this._addEquipZoneText(_equipZoneName, equipZone, zoneID, equipZoneID, siteID, equipZoneSprites);
                }
                else {
                    this._addEquipZoneText(equipZoneName, equipZone, zoneID, equipZoneID, siteID, equipZoneSprites);
                }

                /*const textCenter = equipZone[2];
                const type = equipZone[3];

                const sprite = this.makeEquipZoneText(SDMSMainMenu.EquipZoneNameText, equipZoneName, zoneID, equipZoneID, textCenter.x, textCenter.y, textCenter.z, TextPOIManager.EquipZoneFontSize, siteID, type);

                if (sprite) {
                    sprite.scale.set(12.5, 6.25, 1.0);
                    sprite.visible = false;
                    equipZoneSprites[equipZoneID] = sprite;
                }*/
            }
        }

        //i18n.changeLanguage(currentLanguage);
    }

    _addEquipZoneText(equipZoneName, equipZone, zoneID, equipZoneID, siteID, equipZoneSprites) {
        const textCenter = equipZone[2];
        const type = equipZone[3];

        const sprite = this.makeEquipZoneText(SDMSMainMenu.EquipZoneNameText, equipZoneName, zoneID, equipZoneID, textCenter.x, textCenter.y, textCenter.z, TextPOIManager.EquipZoneFontSize, siteID, type);

        if (sprite) {
            sprite.scale.set(12.5, 6.25, 1.0);
            if (zoneID >= 20000)
                sprite.scale.set(40, 20, 1.0);

            sprite.visible = false;

            if (this.checkDuplicate(sprite, equipZoneSprites) === null) {
                equipZoneSprites[equipZoneID] = sprite;
            }
            else {
                // 같은 이름의 Sprite가 이미 존재하므로 삭제한다.
                sprite.parent.remove(sprite);
            }
        }
    }

    checkDuplicate(sprite, sprites) {
        for (const key in sprites) {
            const _sprite = sprites[key];

            if (_sprite.name === sprite.name) {
                return _sprite;
            }
        }

        return null;
    }

    //makeBuildingGroupText(text/*: string*/, id/*: number*/, x/*: number*/, y/*: number*/, z/*: number*/, fontSize/*: number*/, siteID)/*: THREE.Sprite | null*/ {
    //    const backgroundColor = { r: 0, g: 0, b: 0, a: 0.7 };
    //    const borderColor = this.buildingTextBorderColor;
    //    //const borderColor = { r: 63, g: 108, b: 219, a: 1.0 };
    //    const textColor = this.textColor;
    //    //const textColor = { r: 255, g: 255, b: 255, a: 1.0 };
    //    const borderThickness = this.borderThickness;
    //    return this.addText(SDMSMainMenu.BuildingGroupNameText, text, -1, id, x, y, z, fontSize, backgroundColor, borderColor, textColor, borderThickness, siteID);
    //}

    makeEquipZoneText(textTag/*: string*/, text/*: string*/, zoneID/*: number*/, id/*: number*/, x/*: number*/, y/*: number*/, z/*: number*/, fontSize/*: number*/, siteID, type = null, rank = null)/*: THREE.Sprite | null*/ {
        //const backgroundColor = { r: 0, g: 0, b: 0, a: 0.7 };
        let backgroundColor = { r: 0, g: 0, b: 0, a: 0.7 };
        let borderColor = this.buildingTextBorderColor;

        // 구역 타입에 따라 색상 변경
        if (type === TextPOIManager.EquipZoneType.interest) {
            backgroundColor = this.backColor_Interest;
            borderColor = this.borderColor_Interest;
        }
        else if (type === TextPOIManager.EquipZoneType.caution) {
            backgroundColor = this.backColor_Caution;
            borderColor = this.borderColor_Caution;
        }
        else if (type === TextPOIManager.EquipZoneType.alert) {
            backgroundColor = this.backColor_Alert;
            borderColor = this.borderColor_Alert;
        }
        else if (type === TextPOIManager.EquipZoneType.seriousness) {
            backgroundColor = this.backColor_Seriousness;
            borderColor = this.borderColor_Seriousness;
        }

        const textColor = this.textColor;
        const borderThickness = this.borderThickness;
        return this.addText(textTag, text, zoneID, id, x, y, z, fontSize, backgroundColor, borderColor, textColor, borderThickness, siteID, type, rank);
    }

    makeFocusEquipZoneText(textTag, text, zoneID, id, x, y, z, fontSize, siteID) {
        const backgroundColor = this.buildingTextBorderColor;
        const borderColor = this.buildingTextBorderColor;
        const textColor = this.textColor;
        const borderThickness = this.borderThickness;
        return this.addText(textTag, text, zoneID, id, x, y, z, fontSize, backgroundColor, borderColor, textColor, borderThickness, siteID);
    }

    setBuildingGroupTextVisible(visible/*: boolean*/)/*: void*/ {
        this.workerManagerNormal.setBuildingGroupTextVisible(visible);

        if (this.useWorker) {
            this.workerManagerWorker.setBuildingGroupTextVisible(visible);
            this.workerManagerVisitor.setBuildingGroupTextVisible(visible);
            this.workerManagerBoth.setBuildingGroupTextVisible(visible);
        }
        /*const buildingGroupText = { ...this.buildingGroupText };

        for (const buildingGroupName in buildingGroupText) {
            const [sprite, spriteText] = buildingGroupText[buildingGroupName];

            if (sprite && spriteText) {
                sprite.visible = visible;
            }
        }*/

        this.buildingGroupTextVisible = visible;
    }

    showBuildingGroupText(zoomValue/*: number*/, isIndoor/*: boolean*/)/*: boolean*/ {
        if (this.buildingGroupTextVisible) {
            if (isIndoor || zoomValue < TextPOIManager.BuildingGroupTextDistance) {
                this.setBuildingGroupTextVisible(false);
                return false;
            }
        }
        else {
            if (!isIndoor && zoomValue >= TextPOIManager.BuildingGroupTextDistance) {
                this.setBuildingGroupTextVisible(true);
            }
        }

        return true;
    }

    showBuildingText(zoomValue/*: number*/, isIndoor/*: boolean*/)/*: void*/ {
        if (this.buildingTextVisible) {
            if (isIndoor || zoomValue >= TextPOIManager.BuildingGroupTextDistance) {
                this.setBuildingTextVisible(false);
            }
        }
        else {
            if (!isIndoor && zoomValue < TextPOIManager.BuildingGroupTextDistance) {
                this.setBuildingTextVisible(true);
            }
        }
    }

    setUserDataTargetPosition(sprite) {
        sprite.userData.targetPosition = {
            x: sprite.position.x,
            y: sprite.position.y,
            z: sprite.position.z
        };

        sprite.userData.beginPosition = {
            x: sprite.position.x + 1,
            y: sprite.position.y,
            z: sprite.position.z
        };

        sprite.position.set(sprite.userData.beginPosition.x, sprite.userData.beginPosition.y, sprite.userData.beginPosition.z);

        this.movingSprites.push(sprite);
        this.elapsedSmoothVisibleTime = 0;
        this.beginSmoothVisibleTime = true;
    }

    showSmoothVisible(delta) {
        if (this.useSmoothVisible && this.beginSmoothVisibleTime) {
            this.elapsedSmoothVisibleTime += delta;

            const movingSprites = [...this.movingSprites];
            const spriteCount = movingSprites.length;

            const ratio = this.elapsedSmoothVisibleTime / TextPOIManager.smoothVisibleTime;

            if (this.elapsedSmoothVisibleTime < TextPOIManager.smoothVisibleTime) {
                for (let i = 0; i < spriteCount; i++) {
                    const sprite = movingSprites[i];

                    const x = sprite.userData.beginPosition.x + (sprite.userData.targetPosition.x - sprite.userData.beginPosition.x) * ratio;
                    const y = sprite.userData.beginPosition.y + (sprite.userData.targetPosition.y - sprite.userData.beginPosition.y) * ratio;
                    const z = sprite.userData.beginPosition.z + (sprite.userData.targetPosition.z - sprite.userData.beginPosition.z) * ratio;

                    sprite.position.set(x, y, z);

                    if (sprite.material) {
                        sprite.material.opacity = ratio;
                    }
                }
            }
            else {
                for (let i = 0; i < spriteCount; i++) {
                    const sprite = movingSprites[i];
                    sprite.position.set(sprite.userData.targetPosition.x, sprite.userData.targetPosition.y, sprite.userData.targetPosition.z);

                    if (sprite.material) {
                        sprite.material.opacity = 1;
                    }
                }

                this.beginSmoothVisibleTime = false;
            }
        }
    }

    setSmoothVisible(options) {
        if (options) {
            this.useSmoothVisible = options.three?.textPoi?.useSmoothVisible ? true : false;
        }
    }

    showEquipZoneSprites(zoneID/*: number*/, siteID, isReload = false)/*: void*/ {
        const equipZoneSprites = this.equipZoneText[zoneID];

        if (equipZoneSprites) {
            for (const equipZoneID in equipZoneSprites) {
                const sprite = equipZoneSprites[equipZoneID];

                if (this.useSmoothVisible) {
                    this.setUserDataTargetPosition(sprite);
                }

                sprite.visible = true;
            }

            // 등급 여부 확인 및 표시
            this.showAssessment(zoneID, siteID);
        }
        else {
            // 내부모델링 로딩되지 않을 경우 타이밍 문제로 인한 Reload
            if (isReload === false)
                setTimeout(() => this.showEquipZoneSprites(zoneID, siteID, true), 300);
        }
        
        this.prevZoneID = zoneID;
        this.prevSiteID = siteID;
    }

    async showAssessment(zoneID, siteID) {
        // 옵션 여부 확인
        if (this.useEquipZoneAssess !== true)
            return;

        const equipZoneSprites = this.equipZoneText[zoneID];
        if (!equipZoneSprites) 
            return;

        // 해당 층 등급 여부 불러오기
        siteID = parseInt(siteID);
        if (siteID === NaN)
            siteID = null;

        const [scores, message] = await AssessmentController.LoadScoreByZone(zoneID, siteID);
        if (!scores)
            return;

        for (const equipZoneID in equipZoneSprites) {
            const sprite = equipZoneSprites[equipZoneID];
            
            if (!sprite)
                continue;

            let rank = null;

            // 등급 표시 여부 확인
            if (this.isVisibleAssess) {
                for (let i = 0; i < scores?.length; i++) {
                    const data = scores[i];
                
                    if (data?.equipmentZoneID.toString() === equipZoneID) {
                        const score = data.score;

                        if (score && score !== "-") {
                            rank = score;
                        }                       

                        break; 
                    }
                }
            }

            if (sprite.userData.rank !== rank) {

                // 따로 생성하는 것이 아니라, 포함하여 같이 생성한다.
                const rankSprite = this.makeEquipZoneText(SDMSMainMenu.EquipZoneNameText, sprite.userData.text, zoneID, equipZoneID, sprite.position.x, sprite.position.y, sprite.position.z, TextPOIManager.EquipZoneFontSize, sprite.userData.siteID, sprite.userData.type, rank);
                
                // 생성 성공한다면 기존은 삭제
                if (rankSprite && equipZoneSprites) {
                    // 기존 데이터 제거
                    sprite.visible = false;
                    sprite.parent.remove(sprite);

                    rankSprite.scale.set(12.5, 6.25, 1.0);
                    if (zoneID >= 20000)
                        rankSprite.scale.set(40, 20, 1.0);

                    rankSprite.visible = true;
                    equipZoneSprites[equipZoneID] = rankSprite;
                }


            }

        }
    }

    async reloadEquipZoneText() {
        // EquipZoneText 리로드 - K.D.R
        this.hideAllEquipZoneSprites();

        this.showEquipZoneSprites(this.prevZoneID, this.prevSiteID);
    }

    hideEquipZoneSprites() {
        const equipZoneSprites = this.equipZoneText[this.prevZoneID];

        if (equipZoneSprites) {
            for (const equipZoneID in equipZoneSprites) {
                const sprite = equipZoneSprites[equipZoneID];
                sprite.visible = false;
            }
        }
        /*for (let i = 0; i < this.prevEquipZoneSprites.length; i++) {
            const sprite = this.prevEquipZoneSprites[i];
            sprite.visible = false;
        }

        this.prevEquipZoneSprites = [];*/
    }

    hideAllEquipZoneSprites() {
        for (const zoneID in this.equipZoneText) {
            const equipZoneSprites = this.equipZoneText[zoneID];

            if (equipZoneSprites) {
                for (const equipZoneID in equipZoneSprites) {
                    const sprite = equipZoneSprites[equipZoneID];
                    sprite.visible = false;
                }
            }
        }
    }

    setBuildingTextVisible(visible/*: boolean*/)/*: void*/ {
        this.workerManagerNormal.setBuildingTextVisible(visible);

        if (this.useWorker) {
            this.workerManagerWorker.setBuildingTextVisible(visible);
            this.workerManagerVisitor.setBuildingTextVisible(visible);
            this.workerManagerBoth.setBuildingTextVisible(visible);
        }
        /*const buildingText = { ...this.buildingText };

        for (const buildingGroupName in buildingText) {
            const buildingGroup = buildingText[buildingGroupName];

            for (const buildingName in buildingGroup) {
                const text = buildingGroup[buildingName];
                text.visible = visible;
            }
        }*/

        this.buildingTextVisible = visible;
    }

    getBuildingTextSprite(buildingGroupName/*: string*/, buildingName/*: string*/)/*: THREE.Sprite | null*/ {
        return this.currentWorkerManager.getBuildingTextSprite(buildingGroupName, buildingName);
        /*const buildingGroup = this.buildingText[buildingGroupName];

        if (buildingGroup) {
            const sprite = buildingGroup[buildingName];
            return sprite;
        }

        return null;*/
    }

    clear() {
        // 다국어
        //const languageTextLayers = { ...this.languageTextLayers };
        //this.languageTextLayers = {};

        //for (const language in languageTextLayers) {
        //    const textLayer = languageTextLayers[language];
        //    textLayer.clear();

        //    if (this.Scene) {
        //        this.Scene.remove(textLayer);
        //    }
        //}

        //this.workerManagerNormal.clear();

        for (const languageType in this.languageTextLayers) {
            const siteTextLayers = this.languageTextLayers[languageType];
            //const siteTextLayers = { ...this.siteTextLayers };
            //this.siteTextLayers = {};

            for (const siteID in siteTextLayers) {
                const textLayer = siteTextLayers[siteID];
                textLayer.clear();

                if (this.Scene) {
                    this.Scene.remove(textLayer);
                }
            }

            this.workerManagerNormal.clear();

            if (this.useWorker) {
                /*this.workerManagerWorker.clear();
                this.workerManagerVisitor.clear();
                this.workerManagerBoth.clear();*/
            }
        }

        this.languageTextLayers = {};
    }

    async moveEquipZoneNameText(zoneID/*: number*/, equipZoneID/*: number*/, equipZoneName/*: string*/, x/*: number*/, y/*: number*/, z/*: number*/, successMethod/*: (zoneID: number, equipZoneID: number, equipZoneName: string, x: number, y: number, z: number) => void*/) {
        const result = await SDMSController.requestMoveEquipZoneNameText(equipZoneID, equipZoneName, x, y, z);// as [boolean, string];
        const success = result[0];
        const message = result[1];

        if (success) {
            const equipZoneSprites = this.equipZoneText[zoneID];

            if (equipZoneSprites) {
                const sprite = equipZoneSprites[equipZoneID];

                if (sprite) {
                    sprite.position.x = x;
                    sprite.position.y = y;
                    sprite.position.z = z;
                }
            }

            successMethod(zoneID, equipZoneID, equipZoneName, x, y, z);
        }
        else {
            alert(message);
        }
    }

    // 건물그룹, 건물의 이름과 좌표를 새로 얻어온다.
    async updateOuterDatas(_3dOptions/*: object*/, poiManager/*: POIManager*/) {
        let siteIDs = null;
        if (ProjectResource.siteID >= ProjectResource.Site.GG_A && ProjectResource.siteID <= ProjectResource.Site.GG_D) {
            const userInfo = await ProjectResource.initUserInfo();

            if (ProjectResource.siteID === ProjectResource.Site.GG_A && userInfo?.levelID === AccountResource.accountLevelID.master) {
                // 통합방재실 > 모든 공간
                siteIDs = [];
                siteIDs.push(ProjectResource.Site.GG_A);
                siteIDs.push(ProjectResource.Site.GG_B);
                siteIDs.push(ProjectResource.Site.GG_C);
                siteIDs.push(ProjectResource.Site.GG_D);
            }
            else {
                // 그 외 > 공통으로 사용하는 지하층만 포함
                siteIDs = [];
                //siteIDs.push(ProjectResource.Site.GG_A); // 지하층
                siteIDs.push(userInfo.siteID);
            }
        }

        const result = await SDMSController.requestOuterDatas(siteIDs);// as [object, object, string];

        if (result && result[0] && result[1]) {
            const buildingGroups = result[0];
            const outdoorZones = result[1];

            this.checkBuildingGroups(_3dOptions, buildingGroups/*, this.buildingGroupText*/);
            this.checkBuildings(_3dOptions, buildingGroups/*, this.buildingText*/);

            const zoneCount = outdoorZones.length;
            
            for (let i = 0; i < zoneCount; i++) {
                const zone = outdoorZones[i];
                const zoneData = this.getZone(zone.id, _3dOptions);

                if (zoneData) {
                    poiManager.checkSensors(zoneData, zone.id, zone.sensors);
                }
            }
        }
    }

    // 외곽 공간 표시
    async updateOutdoorEquipZoneData(_3dOptions) {
        const outdoorZones = _3dOptions.outdoorZones;
        const siteIDs = [];

        siteIDs.push(_3dOptions.siteID);
       
        for (let zoneID in outdoorZones) {
            zoneID = Number(zoneID);

            if (zoneID === NaN || zoneID === 30000)
                continue;

            const zone = outdoorZones[zoneID];

            const zoneData = this.getZone(zoneID, _3dOptions);
            if (zoneData) {

                const [result, message] = await SDMSController.requestIndoorDatas(zoneID, siteIDs);
                if (result.equipZones) {

                    // 외각 데이터가 없을 경우
                    if (!zoneData.equipZones) {

                        zoneData.equipZones = [];

                        for (let i = 0; i < result.equipZones?.length; i++) {
                            const equipZone = result.equipZones[i];
                            const eqData = [];

                            eqData.push(equipZone.id);
                            eqData.push(equipZone.zoneName);
                            eqData.push(equipZone.textCenter);
                            eqData.push(equipZone.type);

                            zoneData.equipZones[equipZone.id] = eqData;
                        }
                    }

                    this.checkEquipZones(result.equipZones, zoneData.equipZones, zoneID, _3dOptions.siteID);

                    this.showEquipZoneSprites(zoneID, _3dOptions.siteID);
                }
            }
        }        
    }

    async updateIndoorDatas(zoneID/*: number*/, _3dOptions/*: object*/, poiManager/*: POIManager*/) {
        const zoneData = this.getZone(zoneID, _3dOptions);

        if (zoneData) {
            let siteIDs = null;
            if (ProjectResource.siteID >= ProjectResource.Site.GG_A && ProjectResource.siteID <= ProjectResource.Site.GG_D) {
                const userInfo = await ProjectResource.initUserInfo();

                if (ProjectResource.siteID === ProjectResource.Site.GG_A && userInfo?.levelID === AccountResource.accountLevelID.master) {
                    // 통합방재실 > 모든 공간
                    siteIDs = [];
                    siteIDs.push(ProjectResource.Site.GG_A);
                    siteIDs.push(ProjectResource.Site.GG_B);
                    siteIDs.push(ProjectResource.Site.GG_C);
                    siteIDs.push(ProjectResource.Site.GG_D);
                }
                else {
                    // 그 외 > 공통으로 사용하는 지하층만 포함
                    siteIDs = [];
                    //siteIDs.push(ProjectResource.Site.GG_A); // 지하층
                    siteIDs.push(userInfo.siteID);
                }
            }

            const [result, message] = await SDMSController.requestIndoorDatas(zoneID, siteIDs);

            if (result === null) {
                console.log(message);
            }
            else {
                if (result.equipZones) {
                    this.checkEquipZones(result.equipZones, zoneData.equipZones, zoneID, _3dOptions.siteID);
                }

                poiManager.checkSensors(zoneData, zoneID, result);
            }
        }
    }

    checkEquipZones(equipZoneDatas, equipZones, zoneID, siteID) {
        const equipZoneCount = equipZoneDatas.length;
        let equipZoneSprites = this.equipZoneText[zoneID];

        // 실내공간 로딩이 되지 않았을 경우 (멀티사이트)
        if (!equipZoneSprites && equipZones && zoneID && siteID) {
            this.addEquipZoneText(zoneID, equipZones, siteID);
            equipZoneSprites = this.equipZoneText[zoneID];
        } 

        if (!equipZoneSprites) {
            return;
        }

        for (let i = 0; i < equipZoneCount; i++) {
            const equipZoneData = equipZoneDatas[i];

            const sprite = equipZoneSprites[equipZoneData.id];
            const equipZone = equipZones[equipZoneData.id];

            if (sprite && equipZone) {
                const prevPos = equipZone[2];

                if (!equipZoneData.textCenter && prevPos) {
                    this.scene.remove(sprite);
                    delete equipZoneSprites[equipZoneData.id];
                    equipZone[2] = null;
                }
                else if ((equipZoneData.textCenter && !prevPos) ||
                    equipZoneData.zoneName !== equipZone[1]) {
                    this.updateEquipZoneText(equipZoneData, equipZone, equipZoneSprites, sprite, siteID);
                }
                else if (equipZoneData.textCenter && prevPos &&
                        (TextPOIManager.isSameCoord(equipZoneData.textCenter.x, prevPos.x) === false ||
                        TextPOIManager.isSameCoord(equipZoneData.textCenter.y, prevPos.y) === false ||
                        TextPOIManager.isSameCoord(equipZoneData.textCenter.z, prevPos.z) === false)) {
                    this.updateEquipZoneText(equipZoneData, equipZone, equipZoneSprites, sprite, siteID);
                }
            }
        }
    }

    getZone(zoneID/*: number*/, _3dOptions/*: object*/)/*: [floorIndex: number, buildingID: number, zoneName: string, displayText: string, x: number, y: number, z: number, sensors: object]*/ {
        let zoneData = _3dOptions.zones[zoneID];

        if (zoneData) {
            return zoneData;
        }
        else {
            zoneData = _3dOptions.outdoorZones[zoneID];

            if (zoneData) {
                return zoneData;
            }
        }

        return null;
    }

    checkBuildings(_3dOptions, buildingGroups/*, buildingTextSprite*/) {
        this.workerManagerNormal.checkBuildings(_3dOptions, buildingGroups, this);

        if (this.useWorker) {
            /*this.workerManagerWorker.checkBuildings(_3dOptions, buildingGroups, this);
            this.workerManagerVisitor.checkBuildings(_3dOptions, buildingGroups, this);
            this.workerManagerBoth.checkBuildings(_3dOptions, buildingGroups, this);*/
        }
        /*const buildingGroupCount = buildingGroups.length;

        for (let i = 0; i < buildingGroupCount; i++) {
            const buildingGroupName = buildingGroups[i].groupName;
            const buildingDatas = buildingGroups[i].buildingDatas;
            const buildingCount = buildingDatas.length;

            const buildings = _3dOptions.buildings[buildingGroupName];
            const buildingSprites = buildingTextSprite[buildingGroupName];

            if (buildings && buildingSprites) {
                for (let j = 0; j < buildingCount; j++) {
                    const buildingData = buildingDatas[j];
                    const buildingSprite = buildingSprites[buildingData.buildingName];

                    if (!buildingSprite) {
                        continue;
                    }

                    const building = buildings[buildingData.buildingName]; // as [id: number, buildingName: string, displayText: string, x, y, z];

                    if (!building) {
                        continue;
                    }

                    if (building[1] !== buildingData.displayText ||
                        TextPOIManager.isSameCoord(building[3], buildingData.textCenter.x) === false ||
                        TextPOIManager.isSameCoord(building[4], buildingData.textCenter.y) === false ||
                        TextPOIManager.isSameCoord(building[5], buildingData.textCenter.z) === false) {
                        const buildingIDData = _3dOptions.buildingIDs[building[0]];
                        const allBuildingData = _3dOptions.allBuildings[buildingData.buildingName];
                        this.updateBuildingText(buildingData, buildingIDData, allBuildingData, building, buildingSprites, buildingSprite, _3dOptions.siteID);
                    }
                }
            }
        }*/
    }

    static isSameCoord(data1/*: number*/, data2/*: number*/)/*: boolean*/ {
        const diff = data1 - data2;

        if (diff > -0.1 && diff < 0.1) {
            return true;
        }

        return false;
    }

    /*updateBuildingText(buildingData, buildingIDData, allBuildingData, building, buildingSprites, oldSprite, siteID) {
        const pos = buildingData.textCenter;
        const sprite = this.makeEquipZoneText(buildingData.displayText, pos.x, pos.y, pos.z, TextPOIManager.BuildingFontSize, siteID);

        if (sprite) {
            sprite.visible = oldSprite.visible;
            this.scene.remove(oldSprite);

            buildingSprites[buildingData.buildingName] = sprite;

            allBuildingData[2] = buildingData.displayText;
            buildingIDData[2] = buildingData.displayText;

            building[1] = buildingData.displayText;
            building[3] = pos.x;
            building[4] = pos.y;
            building[5] = pos.z;
        }
    }*/

    getFirstLinkedZoneID(equipZoneData) {
        if (equipZoneData.zoneID !== null && equipZoneData.zoneID !== undefined) {
            return equipZoneData.zoneID;
        }

        for (let i = 0; i < equipZoneData.linkedZoneIDs.length; i++) {
            return equipZoneData.linkedZoneIDs[i];
        }

        return null;
    }

    updateEquipZoneText(equipZoneData, equipZone, equipZoneSprites, oldSprite, siteID) {
        const pos = equipZoneData.textCenter;
        const sprite = this.makeEquipZoneText(SDMSMainMenu.EquipZoneNameText, equipZoneData.zoneName, this.getFirstLinkedZoneID(equipZoneData), equipZoneData.id, pos.x, pos.y, pos.z, TextPOIManager.EquipZoneFontSize, siteID);

        if (sprite) {
            const oldObj = oldSprite.object ? oldSprite.object : oldSprite;
            const textLayer = this.getTextLayer(siteID);

            if (textLayer) {
                textLayer.remove(oldObj);
            }

            const zoneID = this.getFirstLinkedZoneID(equipZoneData);
            const equipZoneSprites = zoneID !== null && zoneID !== undefined ? this.equipZoneText[zoneID] : null;

            if (equipZoneSprites) {
                equipZoneSprites[equipZoneData.id] = sprite;
            }
            
            sprite.scale.set(12.5, 6.25, 1.0);

            equipZone[1] = equipZoneData.zoneName;
            // equipZoneName만 변경처리 - K.D.R
            //equipZone[2] = { x: pos.x, y: pos.y, z: pos.z };
        }

        return sprite;
    }

    checkBuildingGroups(_3dOptions, buildingGroups/*, buildingGroupTextSprite*/) {
        this.workerManagerNormal.checkBuildingGroups(_3dOptions, buildingGroups, this);

        if (this.useWorker) {
            /*this.workerManagerWorker.checkBuildingGroups(_3dOptions, buildingGroups, this);
            this.workerManagerVisitor.checkBuildingGroups(_3dOptions, buildingGroups, this);
            this.workerManagerBoth.checkBuildingGroups(_3dOptions, buildingGroups, this);*/
        }
        /*const buildingGroupCount = buildingGroups.length;

        for (let i = 0; i < buildingGroupCount; i++) {
            const _buildingGroup = buildingGroups[i];
            const spriteData = buildingGroupTextSprite[_buildingGroup.groupName];

            if (spriteData) {
                const buildingGroup = this.getBuildingGroup(_3dOptions, _buildingGroup.groupName); // as [buildingGroupName: string, displayText: string, boundingBoxName: string, x, y, z]

                if (buildingGroup && buildingGroup[1]) {
                    if (_buildingGroup.displayText !== buildingGroup[1] ||
                        TextPOIManager.isSameCoord(_buildingGroup.textCenter.x, buildingGroup[3]) === false ||
                        TextPOIManager.isSameCoord(_buildingGroup.textCenter.y, buildingGroup[4]) === false ||
                        TextPOIManager.isSameCoord(_buildingGroup.textCenter.z, buildingGroup[5]) === false) {

                        const pos = _buildingGroup.textCenter;
                        const sprite = this.makeBuildingGroupText(_buildingGroup.displayText, _buildingGroup.id, pos.x, pos.y, pos.z, this.buildingGroupFontSize, _3dOptions.siteID);

                        if (sprite) {
                            this.scene.remove(spriteData[0]);

                            spriteData[0] = sprite;
                            spriteData[1] = _buildingGroup.displayText;
                            buildingGroup[1] = _buildingGroup.displayText;
                            buildingGroup[3] = pos.x;
                            buildingGroup[4] = pos.y;
                            buildingGroup[5] = pos.z;
                        }
                    }
                }
            }
        }*/
    }

    getBuildingGroup(_3dOptions, buildingGroupName) {
        const buildingGroupCount = _3dOptions.buildingGroups.length;

        for (let i = 0; i < buildingGroupCount; i++) {
            const buildingGroup = _3dOptions.buildingGroups[i];

            if (buildingGroup && buildingGroup.length >= 6 && buildingGroup[0] === buildingGroupName) {
                return buildingGroup;
            }
        }

        return null;
    }

    addText(tag/*: string*/, text/*: string*/, zoneID/*: number*/, id/*: number*/, x/*: number*/, y/*: number*/, z/*: number*/, fontSize/*: number*/, backgroundColor/*: rgbaColor*/, borderColor/*: rgbaColor*/, textColor/*: rgbaColor*/, borderThickness/*: number*/, siteID, type = null, rank = null)/*: THREE.Sprite | null*/ {
        const canvas = document.createElement('canvas');
        const context = canvas.getContext('2d');

        if (context === null) {
            return null;
        }

        const fontFace = 'malgun gothic';
        //const fontFace = 'Arial';

        context.font = fontSize + "px " + fontFace;
        //context.font = "Bold " + fontSize + "px " + fontFace;
        context.fillStyle = "rgba(" + backgroundColor.r + "," + backgroundColor.g + "," + backgroundColor.b + "," + backgroundColor.a + ")";
        // border color
        context.strokeStyle = "rgba(" + borderColor.r + "," + borderColor.g + "," + borderColor.b + "," + borderColor.a + ")";
        context.lineWidth = borderThickness;

        const metrics = context.measureText(text);
        const width = metrics.width + 10;
        
        const textWidth = metrics.width;

        let w = width + borderThickness;
        const originWidth = w;

        if (tag === SDMSMainMenu.BuildingGroupNameText) {
            if (text.length === 2) {
                if (!this._2TextWidth) {
                    this._2TextWidth = w + 10;
                }

                w = this._2TextWidth;
            }
            else if (text.length < 2) {
                w = this._2TextWidth;
            }
        }

        const h = fontSize * 1.4 + borderThickness;
        const rectX = (canvas.width - w - borderThickness) / 2;
        const rectY = (canvas.height - h - borderThickness) / 2;

        this.roundRect(context, rectX, rectY, w, h, 6);
        //Contents3D.roundRect(context, borderThickness / 2, borderThickness / 2, width + borderThickness, fontSize * 1.4 + borderThickness, 6);

        // text color
        context.fillStyle = "rgba(" + textColor.r + "," + textColor.g + "," + textColor.b + "," + textColor.a + ")";
        //context.fillStyle = "rgba(0, 0, 0, 1.0)";

        //const textY = rectY + borderThickness;
        // metrics.width보다 10만큼 크게 잡았으니 5만큼 띄워서 시작한다.
        context.fillText(text, rectX + 5 + (w - originWidth) / 2, rectY + fontSize);
        //context.fillText(text, borderThickness + 5, fontSize + borderThickness);

        // 등급이 존재한다면 표시        
        if (rank) {
            if (ProjectResource.SiteNo === ProjectResource.Site.Wonik && (rank === "B" || rank === "C")) {
                rank += "_wonik";
            }

            if (this.assessImgURL[rank]) {
                const assessImg = this.assessImgURL[rank];
                const imgWidth = 44;
                const imgHeight = 75;

                context.drawImage(assessImg, rectX + (textWidth / 2) - 14, rectY - (fontSize * 2 + 36), imgWidth, imgHeight);
            }
        }
        

        // canvas contents will be used for a texture
        const texture = new THREE.Texture(canvas)
        texture.needsUpdate = true;

        // const spriteAlignment = THREE.SpriteAlignment.topLeft;

        const spriteMaterial = new THREE.SpriteMaterial(
            { map: texture/*, useScreenCoordinates: false, alignment: spriteAlignment*/ });
        const sprite = new THREE.Sprite(spriteMaterial);
        if (ProjectResource.siteID === ProjectResource.Site.Hydrogen) {
            sprite.scale.set(16, 8, 1.0);
        }
        else {
            sprite.scale.set(100, 50, 1.0);
        }

        sprite.material.depthWrite = false;
        sprite.material.depthTest = false;
        sprite.position.x = x;
        sprite.position.y = y;
        sprite.position.z = z;
        sprite.name = tag + "_" + zoneID + "_" + id;
        //sprite.name = "text_" + id + "_" + text;

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

        sprite.userData.siteID = siteID;
        sprite.userData.rank = rank;
        sprite.userData.type = type;

        const textLayer = this.getTextLayer(siteID);

        /*if (!this.textLayer) {
            this.textLayer = new THREE.Object3D();
            this.textLayer.matrixAutoUpdate = false;
            this.textLayer.name = "textLayer";

            this.scene.add(this.textLayer);
        }*/

        if (this.scene !== null && textLayer !== null) {
            textLayer.add(sprite);
            //this.scene.add(sprite);
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

    getTextLayer(siteID) {
        // 다국어
        //const resourcesArray = Object.keys(i18n.options.resources);

        //let textLayer = this.languageTextLayers["ko"];

        //if (!textLayer && this.scene) {
        //    textLayer = new THREE.Object3D();
        //    textLayer.matrixAutoUpdate = false;
        //    textLayer.name = "textLayer_" + siteID;

        //    this.scene.add(textLayer);

        //    let siteTextLayers = {};
        //    siteTextLayers[siteID] = textLayer;
        //    //languageTextLayers["ko"] = {};
        //    //languageTextLayers["en"] = {};
        //    this.languageTextLayers["ko"] = siteTextLayers;
        //    this.languageTextLayers["en"] = siteTextLayers;
        //}

        //return textLayer;
        // Site별로 TextLayer를 관리하지 않는다.
        // 모든 Site가 하나의 TextLayer를 공유하도록 한다.
        if (ProjectResource.SiteNo === ProjectResource.Site.GG_A) {
            siteID = 1;
        }

        const language = i18n.language;
        let siteTextLayers = this.languageTextLayers[language];

        if (!siteTextLayers) {
            siteTextLayers = {};
            this.languageTextLayers[language] = siteTextLayers;
        }

        if (siteTextLayers) {
            let textLayer = siteTextLayers[siteID];

            if (!textLayer && this.scene) {
                textLayer = new THREE.Object3D();
                textLayer.matrixAutoUpdate = false;
                textLayer.name = "textLayer_" + language + "_" + siteID;

                this.scene.add(textLayer);
                siteTextLayers[siteID] = textLayer;
            }

            return textLayer;
        }

        return null;
    }

    visibleTextLayers(language, siteID) {        
        for (const [bKey, bValue] of Object.entries(this.languageTextLayers)) {
            if (bKey === language) {
                if (bValue[siteID]) {
                    bValue[siteID].visible = true;

                    for (const childLayer of bValue[siteID].children) {
                        childLayer.visible = true;
                    }
                }
            }
            else {
                if (bValue[siteID]) {
                    bValue[siteID].visible = false;
                }
            }
        }
    }

    setVisible(visible, siteID) {
        const textLayer = this.getTextLayer(siteID);

        if (textLayer) {
            // visible 값이 true 이면서 기존 textLayer visible 값이 false 이라면
            if (visible === true /*&& textLayer.visible === false*/) {
                this.workerManagerNormal.baseLayer = textLayer;
                this.workerManagerWorker.baseLayer = textLayer;
                this.workerManagerVisitor.baseLayer = textLayer;
                this.workerManagerBoth.baseLayer = textLayer;
            }

            textLayer.visible = visible;
        }
    }

    setBuildingGroupTextVisibleUsingID(buildingGroupID, visible, all = false) {
        this.workerManagerNormal.setBuildingGroupTextVisibleUsingID(buildingGroupID, visible, all);
        this.workerManagerWorker.setBuildingGroupTextVisibleUsingID(buildingGroupID, visible, all);
        this.workerManagerVisitor.setBuildingGroupTextVisibleUsingID(buildingGroupID, visible, all);
        this.workerManagerBoth.setBuildingGroupTextVisibleUsingID(buildingGroupID, visible, all);
    }

    setBuildingTextVisibleUsingID(buildingID, visible, all = false) {
        this.workerManagerNormal.setBuildingTextVisibleUsingID(buildingID, visible, all);
        this.workerManagerWorker.setBuildingTextVisibleUsingID(buildingID, visible, all);
        this.workerManagerVisitor.setBuildingTextVisibleUsingID(buildingID, visible, all);
        this.workerManagerBoth.setBuildingTextVisibleUsingID(buildingID, visible, all);
    }

    setBuildingTextAllVisible(visible) {
        this.workerManagerNormal.setBuildingTextAllVisible(visible);
        this.workerManagerWorker.setBuildingTextAllVisible(visible);
        this.workerManagerVisitor.setBuildingTextAllVisible(visible);
        this.workerManagerBoth.setBuildingTextAllVisible(visible);
    }

    reloadBuildingText(language) {
        console.log(language);
        const layers = this.getTextLayer(15);
        //this.workerManagerNormal.reloadBuildingText(language);
        
    }

    setEquipZonePoiText(poi, text, _3dOptions) {
        if (!poi) {
            return null;
        }

        const [/*sensorType*/, zoneID, equipZoneID] = SDMS.getSensorInfo(poi);

        if (zoneID > 0 && equipZoneID > 0) {
            let zone = _3dOptions.zones[zoneID];

            if (!zone) {
                zone = _3dOptions.outdoorZones[zoneID];
            }

            const equipZones = zone?.equipZones;

            if (!equipZones) {
                return null;
            }

            const equipZone = equipZones[equipZoneID];

            if (!equipZone) {
                return null;
            }

            if (equipZone.length >= 3) {
                const pos = poi.object ? poi.object.position : poi.position;

                const equipZoneData = {
                    id: equipZone[0],
                    zoneName: text,
                    zoneID: zoneID,
                    textCenter: {
                        x: pos.x,
                        y: pos.y,
                        z: pos.z
                    }
                }

                const equipZoneSprites = this.equipZoneText[zoneID];

                if (equipZoneSprites) {
                    const oldEquipZoneName = equipZone[1];
                    const sprite = this.updateEquipZoneText(equipZoneData, equipZone, equipZoneSprites, poi, _3dOptions.siteID);

                    equipZone[1] = oldEquipZoneName;
                    return sprite;
                }
            }
        }

        return null;
    }

    /*selectTextPoi(poi) {
        console.log("selectTextPoi");
    }*/

    static isTextPOI(sensorType) {
        if (sensorType.startsWith("text")) {
            return true;
        }

        return false;
    }

    static hitTest(textPoi, x, z) {
        const boundingBox = textPoi.object.userData.boundingBox;

        if (!boundingBox || !boundingBox.tl || !boundingBox.br) {
            return false;
        }

        if (x >= boundingBox.tl.x && x <= boundingBox.br.x &&
            z >= boundingBox.tl.z && z <= boundingBox.br.z) {
            textPoi.object.userData.origin = { x: textPoi.object.position.x, z: textPoi.object.position.z };
            return true;
        }

        return false;
    }

    static updateEquipZoneTextBounding(poi, raycaster) {
        const origin = poi?.object?.userData?.origin;
        const boundingBox = poi?.object?.userData?.boundingBox;

        if (origin && boundingBox) {
            const halfWidth = boundingBox.br.x - origin.x;
            const halfHeight = boundingBox.br.z - origin.z;

            boundingBox.tl.x = poi.object.position.x - halfWidth;
            boundingBox.tl.z = poi.object.position.z - halfHeight;
            boundingBox.br.x = poi.object.position.x + halfWidth;
            boundingBox.br.z = poi.object.position.z + halfHeight;
        }
    }

    // raycaster를 이용하여 hitTest를 실시한다.
    static hitTest3D(textPoi, rayCenter, rayLeft, rayTop) {
        const boundingBox = textPoi.object.userData.boundingBox;

        if (!boundingBox) {
            return false;
        }

        const vCameraOrigin = rayCenter.ray.origin;
        const vCameraDir = rayCenter.ray.direction;
        const vCameraLook = new THREE.Vector3(vCameraOrigin.x + vCameraDir.x * 100, vCameraOrigin.y + vCameraDir.y * 100, vCameraOrigin.z + vCameraDir.z * 100);

        const vPoiPos = textPoi.object.position;
        const [posX, posY, posZ] = Geometry.getNearestVertex3(vPoiPos.x, vPoiPos.y, vPoiPos.z, vCameraOrigin.x, vCameraOrigin.y, vCameraOrigin.z, vCameraLook.x, vCameraLook.y, vCameraLook.z, true);
        const vMousePos = new THREE.Vector3(posX, posY, posZ);

        const vLeftDir = rayLeft.ray.direction;
        const vTopDir = rayTop.ray.direction;

        const [leftX, leftY, leftZ] = TextPOIManager.getLeftVertex(vCameraOrigin, vMousePos, vLeftDir);
        const [topX, topY, topZ] = TextPOIManager.getLeftVertex(vCameraOrigin, vMousePos, vTopDir);

        const width = boundingBox.br.x - boundingBox.tl.x;
        const height = boundingBox.br.z - boundingBox.tl.z;

        const [leftTargetX, leftTargetY, leftTargetZ] = Geometry.getLinearVertex3(vMousePos.x, vMousePos.y, vMousePos.z, leftX, leftY, leftZ, width / 2);
        const [topTargetX, topTargetY, topTargetZ] = Geometry.getLinearVertex3(vMousePos.x, vMousePos.y, vMousePos.z, topX, topY, topZ, height / 2);

        const vPoiLeft = new THREE.Vector3(leftTargetX - vMousePos.x + vPoiPos.x, leftTargetY - vMousePos.y + vPoiPos.y, leftTargetZ - vMousePos.z + vPoiPos.z);
        const vPoiTop = new THREE.Vector3(topTargetX - vMousePos.x + vPoiPos.x, topTargetY - vMousePos.y + vPoiPos.y, topTargetZ - vMousePos.z + vPoiPos.z);

        const vPoiTL = new THREE.Vector3(vPoiLeft.x + vPoiTop.x - vPoiPos.x, vPoiLeft.y + vPoiTop.y - vPoiPos.y, vPoiLeft.z + vPoiTop.z - vPoiPos.z);
        const vPoiBL = new THREE.Vector3(vPoiLeft.x * 2 - vPoiTL.x, vPoiLeft.y * 2 - vPoiTL.y, vPoiLeft.z * 2 - vPoiTL.z);
        const vPoiBR = new THREE.Vector3(vPoiPos.x * 2 - vPoiTL.x, vPoiPos.y * 2 - vPoiTL.y, vPoiPos.z * 2 - vPoiTL.z);

        return TextPOIManager._hitTest3D(vPoiTL, vPoiBL, vPoiBR, vMousePos);
    }

    static _hitTest3D(vTL, vBL, vBR, vPos) {
        const vTR = new THREE.Vector3(vTL.x + vBR.x - vBL.x, vTL.y + vBR.y - vBL.y, vTL.z + vBR.z - vBL.z);

        const width = Geometry.getDistance3(vBR.x, vBR.y, vBR.z, vBL.x, vBL.y, vBL.z);
        const height = Geometry.getDistance3(vTL.x, vTL.y, vTL.z, vBL.x, vBL.y, vBL.z);

        const len1 = Geometry.getDistanceFromLine3(vPos.x, vPos.y, vPos.z, vTL.x, vTL.y, vTL.z, vBL.x, vBL.y, vBL.z, false);

        if (len1 > width) {
            return false;
        }

        const len2 = Geometry.getDistanceFromLine3(vPos.x, vPos.y, vPos.z, vBL.x, vBL.y, vBL.z, vBR.x, vBR.y, vBR.z, false);

        if (len2 > height) {
            return false;
        }

        const len3 = Geometry.getDistanceFromLine3(vPos.x, vPos.y, vPos.z, vBR.x, vBR.y, vBR.z, vTR.x, vTR.y, vTR.z, false);

        if (len3 > width) {
            return false;
        }

        const len4 = Geometry.getDistanceFromLine3(vPos.x, vPos.y, vPos.z, vTR.x, vTR.y, vTR.z, vTL.x, vTL.y, vTL.z, false);

        if (len4 > height) {
            return false;
        }

        return true;
    }

    static getLeftVertex(vOrigin, vCenter, vDir) {
        const vDirectionEnd = new THREE.Vector3(vOrigin.x + vDir.x * 100, vOrigin.y + vDir.y * 100, vOrigin.z + vDir.z * 100);
        const theta = Geometry.getAngle3(vCenter.x, vCenter.y, vCenter.z, vOrigin.x, vOrigin.y, vOrigin.z, vDirectionEnd.x, vDirectionEnd.y, vDirectionEnd.z);

        const len = Geometry.getDistance3(vOrigin.x, vOrigin.y, vOrigin.z, vCenter.x, vCenter.y, vCenter.z);
        const targetLength = len / Math.cos(theta);

        return Geometry.getLinearVertex3(vOrigin.x, vOrigin.y, vOrigin.z, vDirectionEnd.x, vDirectionEnd.y, vDirectionEnd.z, targetLength);
    }

    updateWorker(_3dOptions) {
        if (!this.useWorker || !_3dOptions?.buildingGroups) {
            return;
        }

        for (const buildingGroupData of _3dOptions.buildingGroups) {
            if (buildingGroupData.length < 7) {
                continue;
            }

            const buildingGroupName = buildingGroupData[0];
            const displayText = buildingGroupData[1];
            const x = buildingGroupData[3];
            const y = buildingGroupData[4];
            const z = buildingGroupData[5];
            const buildingGroupID = buildingGroupData[6];
            const [workerCount, visitorCount] = this.getBuildingGroupWorkerInfo(buildingGroupID);

            const workerChanged = this.workerManagerWorker.checkWorkerCount(buildingGroupID, workerCount) === false;
            const visitorChanged = this.workerManagerVisitor.checkVisitorCount(buildingGroupID, visitorCount) === false;

            if (workerChanged) {
                this.workerManagerWorker.updateBuildingGroupText(buildingGroupName, displayText, buildingGroupID, x, y, z, this.buildingGroupFontSize, _3dOptions.siteID, this, workerCount, visitorCount);
            }

            if (visitorChanged) {
                this.workerManagerVisitor.updateBuildingGroupText(buildingGroupName, displayText, buildingGroupID, x, y, z, this.buildingGroupFontSize, _3dOptions.siteID, this, workerCount, visitorCount);
            }

            if (workerChanged || visitorChanged) {
                this.workerManagerBoth.updateBuildingGroupText(buildingGroupName, displayText, buildingGroupID, x, y, z, this.buildingGroupFontSize, _3dOptions.siteID, this, workerCount, visitorCount);
            }
        }

        for (const buildingID in _3dOptions.buildingIDs) {
            const buildingData = _3dOptions.buildingIDs[buildingID];

            if (buildingData.length >= 8) {
                const buildingGroupName = buildingData[1];
                const buildingName = buildingData[2];
                const x = buildingData[4];
                const y = buildingData[5];
                const z = buildingData[6];
                const id = buildingData[0];

                const [workerCount, visitorCount] = this.getBuildingWorkerInfo(id);

                const workerChanged = this.workerManagerWorker.checkBuildingWorkerCount(id, workerCount) === false;
                const visitorChanged = this.workerManagerVisitor.checkBuildingVisitorCount(id, visitorCount) === false;

                if (workerChanged) {
                    this.workerManagerWorker.updateBuildingText(buildingGroupName, buildingName, buildingName, id, x, y, z, this.buildingFontSize, _3dOptions.siteID, this, workerCount, visitorCount);
                }

                if (visitorChanged) {
                    this.workerManagerVisitor.updateBuildingText(buildingGroupName, buildingName, buildingName, id, x, y, z, this.buildingFontSize, _3dOptions.siteID, this, workerCount, visitorCount);
                }

                if (workerChanged || visitorChanged) {
                    this.workerManagerBoth.updateBuildingText(buildingGroupName, buildingName, buildingName, id, x, y, z, this.buildingFontSize, _3dOptions.siteID, this, workerCount, visitorCount);
                }
            }
        }
    }

    selectEquipZonePOI(poi, editMode, editModeParam, currentSiteID) {
        let _poi = null;
        if (SDMSMainMenu.isEquipZoneText(poi?.object?.name)) 
            _poi = poi;

        if (!_poi) {
            if (!this.selectedPOI) {
                return;
            }
            else {
                this.changePOI(this.selectedPOI, false);
            }
        }
        else {
            if (TextPOIManager.isSamePOI(this.selectedPOI, _poi) === false) {
                if (this.selectedPOI) {
                    this.changePOI(this.selectedPOI, false, currentSiteID);
                }

                this.changePOI(_poi, true, currentSiteID);
            }
        }

        this.selectedPOI = _poi;
    }

    changePOI(poi, isSelected, currentSiteID) {
        if (poi) {
            const [sensorType, zoneID, equipZoneID] = SDMS.getSensorInfo(poi);
            
            // equipZone 한해서 포커스 처리 >> 이외에는 아직 미구현
            if (sensorType && sensorType === SDMSMainMenu.EquipZoneNameText &&
                poi.object.userData?.text && poi.object.position) {
                
                const equipZoneSprites = this.equipZoneText[zoneID];
                let sprite = null;

                if (isSelected)
                    sprite = this.makeFocusEquipZoneText(SDMSMainMenu.EquipZoneNameText, poi.object.userData.text, zoneID, equipZoneID, poi.object.position.x, poi.object.position.y, poi.object.position.z, TextPOIManager.EquipZoneFontSize, currentSiteID);
                else 
                    sprite = this.makeEquipZoneText(SDMSMainMenu.EquipZoneNameText, poi.object.userData.text, zoneID, equipZoneID, poi.object.position.x, poi.object.position.y, poi.object.position.z, TextPOIManager.EquipZoneFontSize, currentSiteID);

                if (sprite && equipZoneSprites) {
                    // 기존 데이터 제거
                    const oldData = equipZoneSprites[equipZoneID];
                    if (oldData) {
                        oldData.visible = false;
                        oldData.parent.remove(oldData);
                    }

                    sprite.scale.set(12.5, 6.25, 1.0);
                    if (zoneID >= 20000)
                        sprite.scale.set(40, 20, 1.0);

                    sprite.visible = true;
                    equipZoneSprites[equipZoneID] = sprite;
                }
            }
        }
    }

    static isSamePOI(poi1, poi2) {
        if (poi1 === null && poi2 === null) {
            return true;
        }
        else if (poi1 === null) {
            return false;
        }
        else if (poi2 === null) {
            return false;
        }

        const obj1 = poi1.object ? poi1.object : poi1;
        const obj2 = poi2.object ? poi2.object : poi2;
        return obj1.uuid === obj2.uuid;
    }

    getTextPOI(sensorType, zoneID, equipZoneID) {
        let sprite = null;

        if (sensorType && sensorType === SDMSMainMenu.EquipZoneNameText) {        
            const equipZones = this.equipZoneText[zoneID];
            if (equipZones) {
                sprite = equipZones[equipZoneID];
            }
        }
        
        return sprite;
    }

    getEquipZonePOI(zoneID, equipZoneID) {
        let sprite = null;

        const equipZoneSprites = this.equipZoneText[zoneID];
        if (equipZoneSprites) {
            for (const _equipZoneID in equipZoneSprites) {
                if (_equipZoneID === equipZoneID.toString()) {
                    sprite = equipZoneSprites[equipZoneID];
                    break;
                }
            }
        }

        return sprite;
    }
}