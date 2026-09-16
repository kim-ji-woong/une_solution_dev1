import * as THREE from "three/build/three.module.js";

export class WorkerManager {
    static workers = {};

    constructor(spatialManager, buildingGroupTextLayer, buildingTextLayer) {
        this.spatialManager = spatialManager;

        this.typeName = "";
        //this.siteTextLayers = {};
        this.siteBuildingGroupTextLayers = {};
        this.siteBuildingTextLayers = {};

        this.baseBuildingGroupTextLayer = buildingGroupTextLayer;
        this.baseBuildingTextLayer = buildingTextLayer;
        this.buildingGroupText/*: { [buildingGroupName: string]: [THREE.Sprite, string] }*/ = {};
        this.buildingText/*: { [buildingGroupName: string]: { [buildingName: string]: THREE.Sprite } }*/ = {};

        // Key : buildingGroupNo, Value : sprite
        this.buildingGroupTextNo = {};
        // Key : buildingNo, Value : sprite
        this.buildingTextNo = {};
    }

    setVisible(visible, siteNo) {
        const [buildingGroupTextLayer, buildingTextLayer] = this.getTextLayer(siteNo);
        buildingGroupTextLayer.visible = visible;
        buildingTextLayer.visible = visible;
    }

    getTextLayer(siteNo) {
        let buildingGroupTextLayer = this.siteBuildingGroupTextLayers[siteNo];
        let buildingTextLayer = this.siteBuildingTextLayers[siteNo];

        if (!buildingGroupTextLayer && !buildingTextLayer && this.baseBuildingGroupTextLayer && this.baseBuildingTextLayer) {
            /*textLayer = new THREE.Object3D();
            textLayer.matrixAutoUpdate = false;
            textLayer.name = "textLayer_" + this.typeName + siteNo;

            this.baseLayer.add(textLayer);
            this.siteTextLayers[siteNo] = textLayer;
            textLayer.visible = false;*/

            buildingGroupTextLayer = new THREE.Object3D();
            buildingGroupTextLayer.matrixAutoUpdate = false;
            buildingGroupTextLayer.name = "buildingGroupTextLayer_" + this.typeName + siteNo;

            this.baseBuildingGroupTextLayer.add(buildingGroupTextLayer);
            this.siteBuildingGroupTextLayers[siteNo] = buildingGroupTextLayer;

            buildingTextLayer = new THREE.Object3D();
            buildingTextLayer.matrixAutoUpdate = false;
            buildingTextLayer.name = "buildingTextLayer_" + this.typeName + siteNo;

            this.baseBuildingTextLayer.add(buildingTextLayer);
            this.siteBuildingTextLayers[siteNo] = buildingTextLayer;
            buildingTextLayer.visible = false;
        }

        return [buildingGroupTextLayer, buildingTextLayer];
    }

    getBuildingGroupTextLayer(siteNo) {
        return this.siteBuildingGroupTextLayers[siteNo];
    }

    getBuildingTextLayer(siteNo) {
        return this.siteBuildingTextLayers[siteNo];
    }

    addBuildingGroupText(buildingGroupName, displayText, buildingGroupNo, x, y, z, fontSize, siteNo, textPOIManager, workerCount, visitorCount) {
        /*const sprite = this.makeBuildingGroupText(displayText, buildingGroupNo, x, y, z, fontSize, siteNo, textPOIManager, workerCount, visitorCount);

        if (sprite) {
            this.buildingGroupText[buildingGroupName] = [sprite, displayText];
        }*/
    }

    makeBuildingGroupText(text/*: string*/, buildingGroupNo/*: number*/, x/*: number*/, y/*: number*/, z/*: number*/, fontSize/*: number*/, siteNo, textPOIManager, workerCount, visitorCount)/*: THREE.Sprite | null*/ {
        /*const backgroundColor = { r: 0, g: 0, b: 0, a: 0.7 };
        const borderColor = textPOIManager.buildingTextBorderColor;
        //const borderColor = { r: 63, g: 108, b: 219, a: 1.0 };
        const textColor = textPOIManager.textColor;
        //const textColor = { r: 255, g: 255, b: 255, a: 1.0 };
        const borderThickness = textPOIManager.borderThickness;
        const sprite = this.addText(TextPoiManager.BuildingGroupNameText, text, -1, buildingGroupNo, x, y, z, fontSize, backgroundColor, borderColor, textColor, borderThickness, textPOIManager, this.getBuildingGroupTextLayer(siteNo), workerCount, visitorCount);

        if (sprite) {
            this.buildingGroupTextNo[buildingGroupNo] = sprite;
        }

        return sprite;*/
    }

    addBuildingText(buildingGroupName, buildingName, displayText, buildingNo, x, y, z, fontSize, siteNo, textPOIManager, workerCount, visitorCount) {
        /*const sprite = this.makeBuildingText(displayText, -1, buildingNo, x, y, z, fontSize, siteNo, textPOIManager, workerCount, visitorCount);

        if (sprite) {
            let buildingSprites = this.buildingText[buildingGroupName];

            if (!buildingSprites) {
                buildingSprites = {};
                this.buildingText[buildingGroupName] = buildingSprites;
            }

            buildingSprites[buildingName] = sprite;
        }*/
    }

    makeBuildingText(text/*: string*/, zoneNo/*: number*/, buildingNo/*: number*/, x/*: number*/, y/*: number*/, z/*: number*/, fontSize/*: number*/, siteNo, textPOIManager, workerCount, visitorCount)/*: THREE.Sprite | null*/ {
        /*const backgroundColor = { r: 0, g: 0, b: 0, a: 0.7 };
        const borderColor = textPOIManager.buildingTextBorderColor;
        //const borderColor = { r: 63, g: 108, b: 219, a: 1.0 };
        const textColor = textPOIManager.textColor;
        //const textColor = { r: 255, g: 255, b: 255, a: 1.0 };
        const borderThickness = textPOIManager.borderThickness;
        const sprite = this.addText(TextPoiManager.BuildingNameText, text, zoneNo, buildingNo, x, y, z, fontSize, backgroundColor, borderColor, textColor, borderThickness, textPOIManager, this.getBuildingTextLayer(siteNo), workerCount, visitorCount);

        if (sprite) {
            this.buildingTextNo[buildingNo] = sprite;
        }

        return sprite;*/
    }

    setBuildingGroupTextVisible(visible, siteNo) {
        /*const siteBuildingGroupTextLayers = { ...this.siteBuildingGroupTextLayers };

        if (visible) {
            for (const _siteNo in siteBuildingGroupTextLayers) {
                const buildingGroupTextLayer = siteBuildingGroupTextLayers[_siteNo];

                if (_siteNo === siteNo) {
                    buildingGroupTextLayer.visible = true;
                }
                else {
                    buildingGroupTextLayer.visible = false;
                }
            }
        }
        else {
            for (const _siteNo in siteBuildingGroupTextLayers) {
                const buildingGroupTextLayer = siteBuildingGroupTextLayers[_siteNo];
                buildingGroupTextLayer.visible = visible;
            }
        }*/
    }

    setBuildingTextVisible(visible, siteNo) {
        /*const siteBuildingTextLayers = { ...this.siteBuildingTextLayers };

        if (visible) {
            siteNo = siteNo.toString();

            for (const _siteNo in siteBuildingTextLayers) {
                const buildingTextLayer = siteBuildingTextLayers[_siteNo];

                if (_siteNo === siteNo) {
                    buildingTextLayer.visible = true;
                }
                else {
                    buildingTextLayer.visible = false;
                }
            }
        }
        else {
            for (const _siteNo in siteBuildingTextLayers) {
                const buildingTextLayer = siteBuildingTextLayers[_siteNo];
                buildingTextLayer.visible = visible;
            }
        }*/
    }

    // all이 true이면 buildingGroupNo에 해당하지 않는 모든 POI들은 visible과 반대 속성을 갖게된다.
    setBuildingGroupTextVisibleUsingNo(buildingGroupNo, visible, all) {
        /*const buildingGroupText = this.buildingGroupTextNo[buildingGroupNo];

        if (buildingGroupText) {
            buildingGroupText.visible = visible;

            if (all) {
                const strBuildingGroupNo = buildingGroupNo.toString();

                for (const no in this.buildingGroupTextNo) {
                    if (no.toString() === strBuildingGroupNo) {
                        continue;
                    }

                    const bgText = this.buildingGroupTextNo[no];
                    bgText.visible = !visible;
                }
            }
        }*/
    }

    // all이 true이면 buildingNo에 해당하지 않는 모든 POI들은 visible과 반대 속성을 갖게된다.
    setBuildingTextVisibleUsingNo(buildingNo, visible, all) {
        /*const buildingText = this.buildingTextNo[buildingNo];

        if (buildingText) {
            buildingText.visible = visible;

            if (all) {
                const strBuildingNo = buildingNo.toString();

                for (const no in this.buildingTextNo) {
                    if (no.toString() === strBuildingNo) {
                        continue;
                    }

                    const bText = this.buildingTextNo[no];
                    bText.visible = !visible;
                }
            }
        }*/
    }

    setBuildingTextAllVisible(visible) {
        /*if (this.buildingTextNo) {
            for (const [bKey, bValue] of Object.entries(this.buildingTextNo)) {
                bValue.visible = visible;
            }
        }*/
    }

    getBuildingTextSprite(buildingGroupName/*: string*/, buildingName/*: string*/)/*: THREE.Sprite | null*/ {
        /*const buildingGroup = this.buildingText[buildingGroupName];

        if (buildingGroup) {
            const sprite = buildingGroup[buildingName];
            return sprite;
        }

        return null;*/
    }

    clear() {
        /*const siteBuildingGroupTextLayers = { ...this.siteBuildingGroupTextLayers };
        const siteBuildingTextLayers = { ...this.siteBuildingTextLayers };

        for (const siteNo in siteBuildingGroupTextLayers) {
            const buildingGroupTextLayer = siteBuildingGroupTextLayers[siteNo];
            buildingGroupTextLayer.clear();

            if (this.baseBuildingGroupTextLayer) {
                this.baseBuildingGroupTextLayer.remove(buildingGroupTextLayer);
            }
        }

        for (const siteNo in siteBuildingTextLayers) {
            const buildingTextLayer = siteBuildingTextLayers[siteNo];
            buildingTextLayer.clear();

            if (this.baseBuildingTextLayer) {
                this.baseBuildingTextLayer.remove(buildingTextLayer);
            }
        }*/
    }

    updateBuildingGroupText(buildingGroupName, displayText, buildingGroupNo, x, y, z, fontSize, siteNo, textPOIManager, workerCount, visitorCount) {
        /*const oldData = this.buildingGroupText[buildingGroupName];

        if (oldData && oldData[0] && oldData[0].parent) {
            oldData[0].visible = false;
            oldData[0].parent.remove(oldData[0]);

            const sprite = this.makeBuildingGroupText(displayText, buildingGroupNo, x, y, z, fontSize, siteNo, textPOIManager, workerCount, visitorCount);

            if (sprite) {
                this.buildingGroupText[buildingGroupName] = [sprite, displayText];
            }
        }*/
    }

    updateBuildingText(buildingGroupName, buildingName, displayText, buildingNo, x, y, z, fontSize, siteNo, textPOIManager, workerCount, visitorCount) {
        /*const oldBuildingGroupData = this.buildingText[buildingGroupName];

        if (oldBuildingGroupData) {
            const oldSprite = oldBuildingGroupData[buildingName];

            if (oldSprite && oldSprite.parent) {
                oldSprite.visible = false;
                oldSprite.parent.remove(oldSprite);

                const sprite = this.makeBuildingText(displayText, -1, buildingNo, x, y, z, fontSize, siteNo, textPOIManager, workerCount, visitorCount);

                if (sprite) {
                    let buildingSprites = this.buildingText[buildingGroupName];

                    if (!buildingSprites) {
                        buildingSprites = {};
                        this.buildingText[buildingGroupName] = buildingSprites;
                    }

                    buildingSprites[buildingName] = sprite;
                }
            }
        }*/
    }

    _updateBuildingText(buildingData, buildingIDData, allBuildingData, building, buildingSprites, oldSprite, siteNo, textPOIManager) {
        /*const pos = buildingData.textCenter;
        const sprite = this.makeBuildingText(buildingData.displayText, -1, building.id, pos.x, pos.y, pos.z, textPOIManager.BuildingFontSize, siteNo, textPOIManager);
        const buildingTextLayer = this.getBuildingTextLayer(siteNo);

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
        }*/
    }

    static setWorkers(workers) {
        WorkerManager.workers = workers;
    }

    static getBuildingGroupWorker(buildingGroupNo) {
        const workers = { ...WorkerManager.workers }
        return WorkerManager.getWorker("buld_group_sn", buildingGroupNo, workers.buildingGroupWorkers);
    }

    static getBuildingWorker(buildingNo) {
        const workers = { ...WorkerManager.workers }
        return WorkerManager.getWorker("buld_sn", buildingNo, workers.buildingWorkers);
    }

    static getZoneWorker(zoneNo) {
        const workers = { ...WorkerManager.workers }
        return WorkerManager.getWorker("zone_sn", zoneNo, workers.zoneWorkers);
    }

    static getEquipZoneWorker(equipZoneNo) {
        const workers = { ...WorkerManager.workers }
        return WorkerManager.getWorker("eqp_zone_sn", equipZoneNo, workers.equipZoneWorkers);
    }

    static getWorker(target, no, workers) {
        if (workers) {
            let currentWorkerCount = 0;
            let currentVisitorCount = 0;
            let yesterdayWorkerCount = 0;
            let scheduledVisitorCount = 0;

            for (const worker of workers) {
                if (worker[target] === no) {
                    if (worker.wrkr_ty_code === 500500) {
                        currentWorkerCount = worker.wrkr_co;
                    }
                    else if (worker.wrkr_ty_code === 500501) {
                        currentVisitorCount = worker.wrkr_co;
                    }
                    else if (worker.wrkr_ty_code === 500502) {
                        yesterdayWorkerCount = worker.wrkr_co;
                    }
                    else if (worker.wrkr_ty_code === 500503) {
                        scheduledVisitorCount = worker.wrkr_co;
                    }
                }
            }

            return [currentWorkerCount, currentVisitorCount, yesterdayWorkerCount, scheduledVisitorCount];
        }

        return [null, null, null, null];
    }
}
