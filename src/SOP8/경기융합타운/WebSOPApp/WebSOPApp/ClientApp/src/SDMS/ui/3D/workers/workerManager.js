import * as THREE from "three/build/three.module.js";
import SDMSMainMenu from "../../sdmsMainMenu";
import { TextPOIManager } from "../textPOIManager";
import { i18n } from "../../../../language/i18n.js";

export class WorkerManager {
    set BaseLayer(layer) {
        this.baseLayer = layer;
    }

    constructor() {
        this.typeName = "";
        this.languageTextLayers = {};
        this.languageBuildingGroupTextLayers = {};
        this.languageBuildingTextLayers = {};
        //this.siteTextLayers = {};
        //this.siteBuildingGroupTextLayers = {};
        //this.siteBuildingTextLayers = {};

        this.baseLayer = null;
        this.buildingGroupText/*: { [buildingGroupName: string]: [THREE.Sprite, string] }*/ = {};
        this.buildingText/*: { [buildingGroupName: string]: { [buildingName: string]: THREE.Sprite } }*/ = {};

        // Key : buildingGroupID, Value : sprite
        this.buildingGroupTextID = {};
        // Key : buildingID, Value : sprite
        this.buildingTextID = {};
    }

    setVisible(visible, siteID) {
        const textLayer = this.getTextLayer(siteID);
        textLayer.visible = visible;
    }

    getTextLayer(siteID) {
        const language = i18n.language;
        let siteTextLayers = this.languageTextLayers[language];

        if (!siteTextLayers) {
            siteTextLayers = {};
            this.languageTextLayers[language] = siteTextLayers;
        }

        let textLayer = siteTextLayers[siteID];
        //let textLayer = this.siteTextLayers[siteID];

        if (!textLayer && this.baseLayer) {
            textLayer = new THREE.Object3D();
            textLayer.matrixAutoUpdate = false;
            textLayer.name = "textLayer_" + this.typeName + siteID;

            this.baseLayer.add(textLayer);
            siteTextLayers[siteID] = textLayer;
            textLayer.visible = false;

            const buildingGroupTextLayer = new THREE.Object3D();
            buildingGroupTextLayer.matrixAutoUpdate = false;
            buildingGroupTextLayer.name = "buildingGroupTextLayer_" + this.typeName + siteID;

            let siteBuildingGroupTextLayers = this.languageBuildingGroupTextLayers[language];

            if (!siteBuildingGroupTextLayers) {
                siteBuildingGroupTextLayers = {};
                this.languageBuildingGroupTextLayers[language] = siteBuildingGroupTextLayers;
            }

            textLayer.add(buildingGroupTextLayer);
            siteBuildingGroupTextLayers[siteID] = buildingGroupTextLayer;
            //this.siteBuildingGroupTextLayers[siteID] = buildingGroupTextLayer;

            const buildingTextLayer = new THREE.Object3D();
            buildingTextLayer.matrixAutoUpdate = false;
            buildingTextLayer.name = "buildingTextLayer_" + this.typeName + siteID;

            let siteBuildingTextLayers = this.languageBuildingTextLayers[language];

            if (!siteBuildingTextLayers) {
                siteBuildingTextLayers = {};
                this.languageBuildingTextLayers[language] = siteBuildingTextLayers;
            }

            textLayer.add(buildingTextLayer);
            siteBuildingTextLayers[siteID] = buildingTextLayer;
            //this.siteBuildingTextLayers[siteID] = buildingTextLayer;
            buildingTextLayer.visible = false;
        }

        return textLayer;
    }

    getBuildingGroupTextLayer(siteID) {
        this.getTextLayer(siteID);
        //return this.siteBuildingGroupTextLayers[siteID];

        const siteBuildingGroupTextLayers = this.languageBuildingGroupTextLayers[i18n.language];

        if (siteBuildingGroupTextLayers) {
            return siteBuildingGroupTextLayers[siteID];
        }

        return null;
    }

    getBuildingTextLayer(siteID) {
        this.getTextLayer(siteID);
        //return this.siteBuildingTextLayers[siteID];

        const siteBuildingTextLayers = this.languageBuildingTextLayers[i18n.language];

        if (siteBuildingTextLayers) {
            return siteBuildingTextLayers[siteID];
        }

        return null;
    }

    addBuildingGroupText(buildingGroupName, displayText, id, x, y, z, fontSize, siteID, textPOIManager, workerCount, visitorCount) {
        const sprite = this.makeBuildingGroupText(displayText, id, x, y, z, fontSize, siteID, textPOIManager, workerCount, visitorCount);

        if (sprite) {
            this.buildingGroupText[buildingGroupName] = [sprite, displayText];
        }
    }

    makeBuildingGroupText(text/*: string*/, id/*: number*/, x/*: number*/, y/*: number*/, z/*: number*/, fontSize/*: number*/, siteID, textPOIManager, workerCount, visitorCount)/*: THREE.Sprite | null*/ {
        const backgroundColor = { r: 0, g: 0, b: 0, a: 0.7 };
        const borderColor = textPOIManager.buildingTextBorderColor;
        //const borderColor = { r: 63, g: 108, b: 219, a: 1.0 };
        const textColor = textPOIManager.textColor;
        //const textColor = { r: 255, g: 255, b: 255, a: 1.0 };
        const borderThickness = textPOIManager.borderThickness;
        const sprite = this.addText(SDMSMainMenu.BuildingGroupNameText, text, -1, id, x, y, z, fontSize, backgroundColor, borderColor, textColor, borderThickness, textPOIManager, this.getBuildingGroupTextLayer(siteID), workerCount, visitorCount);

        if (sprite) {
            this.buildingGroupTextID[id] = sprite;
        }

        return sprite;
    }

    addBuildingText(buildingGroupName, buildingName, displayText, id, x, y, z, fontSize, siteID, textPOIManager, workerCount, visitorCount) {
        const sprite = this.makeBuildingText(displayText, -1, id, x, y, z, fontSize, siteID, textPOIManager, workerCount, visitorCount);

        if (sprite) {
            let buildingSprites = this.buildingText[buildingGroupName];

            if (!buildingSprites) {
                buildingSprites = {};
                this.buildingText[buildingGroupName] = buildingSprites;
            }

            buildingSprites[buildingName] = sprite;
        }
    }

    makeBuildingText(text/*: string*/, zoneID/*: number*/, id/*: number*/, x/*: number*/, y/*: number*/, z/*: number*/, fontSize/*: number*/, siteID, textPOIManager, workerCount, visitorCount)/*: THREE.Sprite | null*/ {
        const backgroundColor = { r: 0, g: 0, b: 0, a: 0.7 };
        const borderColor = textPOIManager.buildingTextBorderColor;
        //const borderColor = { r: 63, g: 108, b: 219, a: 1.0 };
        const textColor = textPOIManager.textColor;
        //const textColor = { r: 255, g: 255, b: 255, a: 1.0 };
        const borderThickness = textPOIManager.borderThickness;
        const sprite = this.addText(SDMSMainMenu.BuildingNameText, text, zoneID, id, x, y, z, fontSize, backgroundColor, borderColor, textColor, borderThickness, textPOIManager, this.getBuildingTextLayer(siteID), workerCount, visitorCount);

        if (sprite) {
            this.buildingTextID[id] = sprite;
        }

        return sprite;
    }

    setBuildingGroupTextVisible(visible) {
        const languageBuildingGroupTextLayers = { ...this.languageBuildingGroupTextLayers };

        for (const languageType in languageBuildingGroupTextLayers) {
            const siteBuildingGroupTextLayers = { ...languageBuildingGroupTextLayers[languageType] };
            //const siteBuildingGroupTextLayers = { ...this.siteBuildingGroupTextLayers };

            for (const siteID in siteBuildingGroupTextLayers) {
                const buildingGroupTextLayer = siteBuildingGroupTextLayers[siteID];
                buildingGroupTextLayer.visible = visible;
            }
        }
    }

    setBuildingTextVisible(visible) {
        const languageBuildingTextLayers = { ...this.languageBuildingTextLayers };

        for (const languageType in languageBuildingTextLayers) {
            const siteBuildingTextLayers = { ...languageBuildingTextLayers[languageType] };
            //const siteBuildingTextLayers = { ...this.siteBuildingTextLayers };

            for (const siteID in siteBuildingTextLayers) {
                const buildingTextLayer = siteBuildingTextLayers[siteID];
                buildingTextLayer.visible = visible;
            }
        }
    }

    // all이 true이면 buildingGroupID에 해당하지 않는 모든 POI들은 visible과 반대 속성을 갖게된다.
    setBuildingGroupTextVisibleUsingID(buildingGroupID, visible, all) {
        const buildingGroupText = this.buildingGroupTextID[buildingGroupID];

        if (buildingGroupText) {
            buildingGroupText.visible = visible;

            if (all) {
                const bgID = buildingGroupID.toString();

                for (const id in this.buildingGroupTextID) {
                    if (id.toString() === bgID) {
                        continue;
                    }

                    const bgText = this.buildingGroupTextID[id];
                    bgText.visible = !visible;
                }
            }
        }
    }

    // all이 true이면 buildingID에 해당하지 않는 모든 POI들은 visible과 반대 속성을 갖게된다.
    setBuildingTextVisibleUsingID(buildingID, visible, all) {
        const buildingText = this.buildingTextID[buildingID];

        if (buildingText) {
            buildingText.visible = visible;

            if (all) {
                const bID = buildingID.toString();

                for (const id in this.buildingTextID) {
                    if (id.toString() === bID) {
                        continue;
                    }

                    const bText = this.buildingTextID[id];
                    bText.visible = !visible;
                }
            }
        }
    }

    setBuildingTextAllVisible(visible) {
        if (this.buildingTextID) {
            for (const [bKey, bValue] of Object.entries(this.buildingTextID)) {
                bValue.visible = visible;
            }
        }
    }

    reloadBuildingText(language) {
        console.log(language);

        //if (this.buildingTextID) {
        //    for (const [bKey, bValue] of Object.entries(this.buildingTextID)) {
        //        bValue.userData.text = 
        //    }
        //}

        //const buildingText = this.buildingTextID[buildingID];

        //if (buildingText) {
        //    buildingText.visible = visible;

        //    if (all) {
        //        const bID = buildingID.toString();

        //        for (const id in this.buildingTextID) {
        //            if (id.toString() === bID) {
        //                continue;
        //            }

        //            const bText = this.buildingTextID[id];
        //            bText.visible = !visible;
        //        }
        //    }
        //}
    }

    getBuildingTextSprite(buildingGroupName/*: string*/, buildingName/*: string*/)/*: THREE.Sprite | null*/ {
        const buildingGroup = this.buildingText[buildingGroupName];

        if (buildingGroup) {
            const sprite = buildingGroup[buildingName];
            return sprite;
        }

        return null;
    }

    clear() {
        for (const languageType in this.languageTextLayers) {
            const siteTextLayers = { ...this.languageTextLayers[languageType] };
            //const siteTextLayers = { ...this.siteTextLayers };

            //this.siteTextLayers = {};
            //this.siteBuildingGroupTextLayers = {};
            //this.siteBuildingTextLayers = {};

            this.buildingGroupTextID = {};
            this.buildingTextID = {};

            for (const siteID in siteTextLayers) {
                const textLayer = siteTextLayers[siteID];
                textLayer.clear();

                if (this.baseLayer) {
                    this.baseLayer.remove(textLayer);
                }
            }
        }

        this.languageTextLayers = {};
        this.languageBuildingGroupTextLayers = {};
        this.languageBuildingTextLayers = {};
    }

    checkBuildingGroups(_3dOptions, buildingGroups, textPOIManager) {
        const buildingGroupTextSprite = this.buildingGroupText;
        const buildingGroupCount = buildingGroups.length;

        for (let i = 0; i < buildingGroupCount; i++) {
            const _buildingGroup = buildingGroups[i];
            const spriteData = buildingGroupTextSprite[_buildingGroup.groupName];

            if (spriteData) {
                const buildingGroup = textPOIManager.getBuildingGroup(_3dOptions, _buildingGroup.groupName); // as [buildingGroupName: string, displayText: string, boundingBoxName: string, x, y, z]

                if (buildingGroup && buildingGroup[1]) {
                    if (_buildingGroup.displayText !== buildingGroup[1] ||
                        TextPOIManager.isSameCoord(_buildingGroup.textCenter.x, buildingGroup[3]) === false ||
                        TextPOIManager.isSameCoord(_buildingGroup.textCenter.y, buildingGroup[4]) === false ||
                        TextPOIManager.isSameCoord(_buildingGroup.textCenter.z, buildingGroup[5]) === false) {

                        const pos = _buildingGroup.textCenter;
                        const sprite = this.makeBuildingGroupText(_buildingGroup.displayText, _buildingGroup.id, pos.x, pos.y, pos.z, textPOIManager.buildingGroupFontSize, _3dOptions.siteID, textPOIManager);
                        const buildingGroupTextLayer = this.getBuildingGroupTextLayer(_3dOptions.siteID);

                        if (sprite && buildingGroupTextLayer) {
                            buildingGroupTextLayer.remove(spriteData[0]);

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
        }
    }

    checkBuildings(_3dOptions, buildingGroups, textPOIManager) {
        const buildingTextSprite = this.buildingText;
        const buildingGroupCount = buildingGroups.length;

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
                        this._updateBuildingText(buildingData, buildingIDData, allBuildingData, building, buildingSprites, buildingSprite, _3dOptions.siteID, textPOIManager);
                    }
                }
            }
        }
    }

    updateBuildingGroupText(buildingGroupName, displayText, id, x, y, z, fontSize, siteID, textPOIManager, workerCount, visitorCount) {
        const oldData = this.buildingGroupText[buildingGroupName];

        if (oldData && oldData[0] && oldData[0].parent) {
            oldData[0].visible = false;
            oldData[0].parent.remove(oldData[0]);

            const sprite = this.makeBuildingGroupText(displayText, id, x, y, z, fontSize, siteID, textPOIManager, workerCount, visitorCount);

            if (sprite) {
                this.buildingGroupText[buildingGroupName] = [sprite, displayText];
            }
        }
    }

    updateBuildingText(buildingGroupName, buildingName, displayText, id, x, y, z, fontSize, siteID, textPOIManager, workerCount, visitorCount) {
        const oldBuildingGroupData = this.buildingText[buildingGroupName];

        if (oldBuildingGroupData) {
            const oldSprite = oldBuildingGroupData[buildingName];

            if (oldSprite && oldSprite.parent) {
                oldSprite.visible = false;
                oldSprite.parent.remove(oldSprite);

                const sprite = this.makeBuildingText(displayText, -1, id, x, y, z, fontSize, siteID, textPOIManager, workerCount, visitorCount);

                if (sprite) {
                    let buildingSprites = this.buildingText[buildingGroupName];

                    if (!buildingSprites) {
                        buildingSprites = {};
                        this.buildingText[buildingGroupName] = buildingSprites;
                    }

                    buildingSprites[buildingName] = sprite;
                }
            }
        }
    }

    _updateBuildingText(buildingData, buildingIDData, allBuildingData, building, buildingSprites, oldSprite, siteID, textPOIManager) {
        const pos = buildingData.textCenter;
        const sprite = this.makeBuildingText(buildingData.displayText, -1, building.id, pos.x, pos.y, pos.z, TextPOIManager.BuildingFontSize, siteID, textPOIManager);
        const buildingTextLayer = this.getBuildingTextLayer(siteID);

        if (sprite && buildingTextLayer) {
            sprite.visible = oldSprite.visible;
            buildingTextLayer.remove(oldSprite);

            buildingSprites[buildingData.buildingName] = sprite;

            allBuildingData[2] = buildingData.displayText;
            buildingIDData[2] = buildingData.displayText;

            building[1] = buildingData.displayText;
            building[3] = pos.x;
            building[4] = pos.y;
            building[5] = pos.z;
        }
    }
}
