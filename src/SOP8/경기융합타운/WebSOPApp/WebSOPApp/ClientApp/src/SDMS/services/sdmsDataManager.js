import ProjectResource from "../../Root/resource/id";
// import { POIManager } from "../ui/3D/poiManager";
import SDMSMainMenu from "../ui/sdmsMainMenu";
import { SDMSController } from "./sdmsController";

export class SDMSDataManager {
    static BoundingBoxTag = "-0";

    static async get3DOptions(buildingGroupList, outdoorZones, errorMessage, userID, siteNos) {
        //const [buildingGroupList, outdoorZones, errorMessage] = await SDMSController.requestBuildingGroupList();

        if (!buildingGroupList && errorMessage && errorMessage.length > 0) {
            alert(errorMessage);
            return {};
        }
        else {
            const siteBuildingGroups = {};
            const siteBuildings = {};
            const siteZones = {};
            const siteOutdoorZones = {};

            /*const buildingGroups = [];
            const buildings = {};
            const zones = {};*/
            const buildingGroupCount = buildingGroupList.length;

            for (let i = 0; i < buildingGroupCount; i++) {
                const buildingGroup = buildingGroupList[i];
                buildingGroup.completeLoading = false;

                let buildingGroups = siteBuildingGroups[buildingGroup.siteNo];
                let buildings = siteBuildings[buildingGroup.siteNo];
                let zones = siteZones[buildingGroup.siteNo];

                if (!buildingGroups) {
                    buildingGroups = [];
                    buildings = {};
                    zones = {};

                    siteBuildingGroups[buildingGroup.siteNo] = buildingGroups;
                    siteBuildings[buildingGroup.siteNo] = buildings;
                    siteZones[buildingGroup.siteNo] = zones;
                }

                buildings[buildingGroup.groupName] = SDMSDataManager.getBuildings(buildingGroup.buildingDatas, zones);

                /*if (!buildingGroup.textCenter) {
                    continue;
                }*/

                const bgData = [];

                bgData.push(buildingGroup.groupName);
                bgData.push(buildingGroup.displayText);
                bgData.push(buildingGroup.groupName + SDMSDataManager.BoundingBoxTag);

                if (buildingGroup.textCenter) {
                    bgData.push(buildingGroup.textCenter.x);
                    bgData.push(buildingGroup.textCenter.y);
                    bgData.push(buildingGroup.textCenter.z);
                }
                else {
                    bgData.push(undefined);
                    bgData.push(undefined);
                    bgData.push(undefined);
                }

                bgData.push(buildingGroup.id);

                buildingGroups.push(bgData);
            }

            const outdoorZoneCount = outdoorZones.length;

            for (let i = 0; i < outdoorZoneCount; i++) {
                const outdoorZone = outdoorZones[i];
                let _outdoorZones = siteOutdoorZones[outdoorZone.siteNo];

                if (!_outdoorZones) {
                    _outdoorZones = [];
                    siteOutdoorZones[outdoorZone.siteNo] = _outdoorZones;
                }

                _outdoorZones.push(outdoorZone);
            }

            /*if (buildingGroups.length === 0) {
                alert("buildingGroups is empty");
            }*/

            const [models, option, message] = await SDMSController.requestGltfModelList(userID, siteNos);

            if (!models && message && message.length > 0) {
                alert(message);
                return {};
            }
            else {
                const site3DOptions = {};

                for (const siteNo in siteBuildingGroups) {
                    const buildingGroups = siteBuildingGroups[siteNo];
                    const _outdoorZones = siteOutdoorZones[siteNo];
                    const buildings = siteBuildings[siteNo];
                    const zones = siteZones[siteNo];
                    const siteModels = SDMSDataManager.getSiteModels(models, siteNo);

                    const _3DOptions = this.make3DOptions(buildingGroups, _outdoorZones, buildings, zones, option, siteModels, Number(siteNo));

                    if (_3DOptions !== null) {
                        _3DOptions.siteNo = siteNo;
                        site3DOptions[siteNo] = _3DOptions;
                    }
                }

                // 같은 외부모델을 사용하는 Site들은 같은 외부영역을 공유하도록 한다.
                SDMSDataManager.shareOutdoorZones(site3DOptions);

                return site3DOptions;
                /*const _3DOptions = this.make3DOptions(buildingGroups, outdoorZones, buildings, zones, option, models);
                return _3DOptions;*/
            }
        }

        //return {};
    }

    // 같은 외부모델을 사용하는 Site들은 같은 외부영역을 공유하도록 한다.
    static shareOutdoorZones(site3DOptions) {
        // key : outdoor model file name
        const sharingOutdoors = {};

        for (const siteNo in site3DOptions) {
            const _3dOptions = site3DOptions[siteNo];

            if (_3dOptions.outdoorModel?.file) {
                let outdoorZones = sharingOutdoors[_3dOptions.outdoorModel.file];

                if (!outdoorZones) {
                    outdoorZones = {};
                    sharingOutdoors[_3dOptions.outdoorModel.file] = outdoorZones;
                }

                for (const zoneID in _3dOptions.outdoorZones) {
                    const outdoorZone = _3dOptions.outdoorZones[zoneID];
                    outdoorZones[zoneID] = outdoorZone;
                }

                _3dOptions.outdoorZones = outdoorZones;
            }
        }
    }

    static async getGltfModelList(userID, siteNos) {
        const [models, /* option, */ message] = await SDMSController.requestGltfModelList(userID, siteNos);
        if (!models && message && message.length > 0) {
            alert(message);
            return {};
        }
        else {
            return models;
        }
    }

    static getSiteModels(models, siteNo) {
        const siteModels = [];
        const modelCount = models.length;

        for (let i = 0; i < modelCount; i++) {
            const model = models[i];

            if (siteNo >= ProjectResource.Site.GG_A.toString() && siteNo <= ProjectResource.Site.GG_D.toString()) {
                siteModels.push(model);
            }
            else {
                if (model.siteID.toString() === siteNo) {
                    siteModels.push(model);
                }
            }
        }

        return siteModels;
    }

    static getBuildings(buildingDatas, zones) {
        const buildings = {};
        const buildingCount = buildingDatas.length;

        for (let i = 0; i < buildingCount; i++) {
            const building = buildingDatas[i];
            const buildingData = [];

            buildingData.push(building.id);
            buildingData.push(building.displayText);
            buildingData.push(building.buildingName + SDMSDataManager.BoundingBoxTag);

            if (building.textCenter) {
                buildingData.push(building.textCenter.x);
                buildingData.push(building.textCenter.y);
                buildingData.push(building.textCenter.z);
            }
            else {
                buildingData.push(null);
                buildingData.push(null);
                buildingData.push(null);
            }

            const buildingZones = {};
            const equipZoneDatas = {};
            SDMSDataManager.getZones(building.zoneDatas, buildingZones, equipZoneDatas);
            buildingData.push(buildingZones);
            buildings[building.buildingName] = buildingData;

            for (const zoneID in buildingZones) {
                const zone = [...buildingZones[zoneID]];
                zone.sensors = {};
                zones[zoneID] = zone;
                zone.equipZones = {};
                zone.datas = SDMSDataManager.getZoneDatas(parseInt(zoneID), building.zoneDatas);

                const equipmentZoneDatas = equipZoneDatas[parseInt(zoneID)];

                if (equipmentZoneDatas) {
                    const equipZoneCount = equipmentZoneDatas.length;

                    for (let j = 0; j < equipZoneCount; j++) {
                        const equipmentZoneData = equipmentZoneDatas[j];
                        const equipZoneData = [];

                        equipZoneData.push(equipmentZoneData.id);
                        equipZoneData.push(equipmentZoneData.zoneName);
                        equipZoneData.push(equipmentZoneData.textCenter);
                        equipZoneData.push(equipmentZoneData.type);

                        zone.equipZones[equipmentZoneData.id] = equipZoneData;
                    }
                }
            }
        }

        return buildings;
    }

    static getZoneDatas(zoneID, zoneDatas) {
        const dataCount = zoneDatas.length;

        for (let i = 0; i < dataCount; i++) {
            const zoneData = zoneDatas[i];

            if (zoneData.id === zoneID) {
                return zoneData.datas;
            }
        }

        return {};
    }

    static getZones(zoneDatas, zones, equipZoneDatas) {
        zoneDatas.sort((zone1, zone2) => {
            const floor1 = SDMSDataManager.getZoneFloor(zone1);
            const floor2 = SDMSDataManager.getZoneFloor(zone2);
            return floor1 - floor2;
        });

        const zoneCount = zoneDatas.length;

        for (let i = 0; i < zoneCount; i++) {
            const zone = zoneDatas[i];

            if (zone.textCenter === null) {
                zones[zone.id] = [SDMSDataManager.getZoneFloor(zone), zone.buildingID, zone.zoneName, zone.displayText, null, null, null];
            }
            else {
                zones[zone.id] = [SDMSDataManager.getZoneFloor(zone), zone.buildingID, zone.zoneName, zone.displayText, zone.textCenter.x, zone.textCenter.y, zone.textCenter.z];
            }

            equipZoneDatas[zone.id] = zone.equipmentZoneDatas;
        }
    }

    static getZoneFloor(zone) {
        if (zone.addFloor === null)
            return zone.floorIndex;

        return zone.floorIndex + zone.addFloor;
    }

    static make3DOptions(buildingGroups, outdoorZones, buildings, zones, option, models, siteNo) {
        const _3DOptions = {};
        const modelCount = models.length;

        for (let i = 0; i < modelCount; i++) {
            const model = models[i];
            const json = SDMSDataManager.addModel(model, siteNo);

            _3DOptions[model.modelName] = json;
            /*if (SDMSDataManager.isEmpty(json) === false) {
                _3DOptions[model.modelName] = json;
            }*/
        }

        const allBuildings = {};
        const buildingIDs = {};

        for (const buildingGroupName in buildings) {
            const buildingGroup = buildings[buildingGroupName];

            for (const buildingName in buildingGroup) {
                const building = [...buildingGroup[buildingName]];

                // BuildingGroupName 추가
                building.unshift(buildingGroupName);
                building.unshift(building[1]);
                building.splice(2, 1);

                allBuildings[buildingName] = building;
                buildingIDs[building[0].toString()] = building;
            }
        }

        const _outdoorZones = {};
        const outdoorZoneCount = outdoorZones?.length;

        for (let i = 0; i < outdoorZoneCount; i++) {
            const zone = outdoorZones[i];
            const zoneData = {};

            zoneData.name = zone.zoneName;
            zoneData.id = zone.id;
            zoneData.sensors = {};
            zoneData.datas = zone.datas;

            _outdoorZones[zone.id.toString()] = zoneData;
        }

        _3DOptions.buildingGroups = buildingGroups;
        _3DOptions.buildings = buildings;
        _3DOptions.allBuildings = allBuildings;
        _3DOptions.buildingIDs = buildingIDs;
        _3DOptions.zones = zones;
        _3DOptions.outdoorZones = _outdoorZones;
        _3DOptions.modelBaseURL = option._3DModelBaseURL;
        _3DOptions.textureBaseURL = option._3DTextureBaseURL;
        _3DOptions.backgroundImage = option._3DBackgroundImage;
        _3DOptions.indoorModelOnMemory = option.indoorModelOnMemory;

        return _3DOptions;
    }

    static getSensor(sensorType, zoneID, sensorID, _3dOptions) {
        let zoneData = _3dOptions.zones[zoneID];

        if (!zoneData) {
            zoneData = _3dOptions.outdoorZones[zoneID];

            if (!zoneData)
                return null;
        }

        if (!zoneData.sensors)
            return null;

        if (SDMSMainMenu.isCCTVType(sensorType)) {
            sensorType = SDMSMainMenu.CCTV_Type;
        }

        const sensors = zoneData.sensors[sensorType];

        if (sensors) {
            const sensorCount = sensors.length;

            for (let i = 0; i < sensorCount; i++) {
                const sensor = sensors[i];

                if (sensor.id === sensorID)
                    return sensor;
            }
        }

        return null;
    }

    static addModel(model, siteNo) {        
        const data = {};
        const childModelCount = model.childModels.length;

        for (let i = 0; i < childModelCount; i++) {
            const childModel = model.childModels[i];
            if (siteNo && Number(siteNo) >= ProjectResource.Site.GG_A && Number(siteNo) <= ProjectResource.Site.GG_D) {
                // 경기도청
                // 통합방재실 > 전체 모델
                // 입주기관 > 지하층, 각 기관 모델
                if (Number(siteNo) === ProjectResource.Site.GG_A) {
                    const json = SDMSDataManager.addModel(childModel, siteNo);
                    data[childModel.modelName] = json;
                }
                else {
                    if (childModel.siteNo === ProjectResource.Site.GG_A || Number(siteNo) === childModel.siteNo) {
                        const json = SDMSDataManager.addModel(childModel, siteNo);
                        data[childModel.modelName] = json;
                    }
                }

                //if (siteNo === ProjectResource.Site.GG_A || childModel.siteNo === ProjectResource.Site.GG_A || Number(siteNo) === childModel.siteNo) {
                //    const json = SDMSDataManager.addModel(childModel);
                //    data[childModel.modelName] = json;
                //}
            }
            else {
                const json = SDMSDataManager.addModel(childModel, siteNo);

                data[childModel.modelName] = json;
            }            
            /*if (this.isEmpty(json) === false) {
                data[childModel.modelName] = json;
            }*/
        }

        const modelDataCount = model.modelDatas.length;
        const floors = [];

        for (let i = 0; i < modelDataCount; i++) {
            const modelData = model.modelDatas[i];
            const modelOrthoData = SDMSDataManager.getOrthoDataModel(modelData.modelFile, model.modelOrthoDatas);

            if (modelData.floorIndex !== null && modelData.floorIndex !== undefined) {
                const floor = {};

                if (modelData.modelFile && modelData.modelFile.indexOf(';') >= 0) {
                    // 여러개의 파일로 구성되었다.
                    floor.file = SDMSDataManager.getModelFileArray(modelData.modelFile);
                }
                else {
                    floor.file = modelData.modelFile;
                }

                floor.camera = SDMSDataManager.getCameraData(modelData);
                floor.modelDisplayText = modelData.modelDisplayText;
                floor.floorIndex = modelData.floorIndex;

                if (modelOrthoData) {
                    floor.cameraOrtho = SDMSDataManager.getCameraOrthoData(modelOrthoData);
                }

                if (modelData.buildingGroupID) {
                    floor.buildingGroupID = modelData.buildingGroupID;
                }

                if (modelData.buildingID) {
                    floor.buildingID = modelData.buildingID;
                }

                if (modelData.zoneID) {
                    floor.zoneID = modelData.zoneID;
                }

                floors.push(floor);
            }
            else {
                data.file = modelData.modelFile;
                data.camera = SDMSDataManager.getCameraData(modelData);
                data.modelDisplayText = modelData.modelDisplayText;

                if (modelOrthoData) {
                    data.cameraOrtho = SDMSDataManager.getCameraOrthoData(modelOrthoData);
                }

                if (modelData.buildingGroupID) {
                    data.buildingGroupID = modelData.buildingGroupID;
                }

                if (modelData.buildingID) {
                    data.buildingID = modelData.buildingID;
                }

                if (modelData.zoneID) {
                    data.zoneID = modelData.zoneID;
                }
            }
        }

        if (floors.length > 0) {
            data.floors = floors;
        }

        return data;
    }

    static getModelFileArray(fileName) {
        return fileName.split(';');
    }

    static getOrthoDataModel(modelFileName, modelOrthoDatas) {
        if (!modelOrthoDatas) {
            return null;
        }

        const modelCount = modelOrthoDatas.length;

        for (let i = 0; i < modelCount; i++) {
            const modelOrtho = modelOrthoDatas[i];

            if (modelOrtho.modelFile === modelFileName) {
                return modelOrtho;
            }
        }

        return null;
    }

    static isEmpty(json) {
        for (const key in json) {
            return false;
        }

        return true;
    }

    static getCameraData(modelData) {
        const data = {};

        data.position = SDMSDataManager.getVector3(modelData.cameraPosition);
        data.quaternion = SDMSDataManager.getVector3(modelData.cameraQuaternion);
        data.quaternion.push(modelData.cameraQuaternion.w);
        data.rotation = SDMSDataManager.getVector3(modelData.cameraRotation);
        data.targetControl = SDMSDataManager.getVector3(modelData.orbitTarget);
        data.fov = modelData.cameraFov;
        data.near = modelData.cameraNear;
        data.far = modelData.cameraFar;

        return data;
    }

    static getCameraOrthoData(modelOrthoData) {
        const data = {};

        data.position = SDMSDataManager.getVector3(modelOrthoData.cameraPosition);
        data.quaternion = SDMSDataManager.getVector3(modelOrthoData.cameraQuaternion);
        data.quaternion.push(modelOrthoData.cameraQuaternion.w);
        data.rotation = SDMSDataManager.getVector3(modelOrthoData.cameraRotation);
        data.targetControl = SDMSDataManager.getVector3(modelOrthoData.target);
        data.zoom = modelOrthoData.zoom;

        return data;
    }

    static getVector3(vector) {
        const data = [];

        data.push(vector.x);
        data.push(vector.y);
        data.push(vector.z);

        return data;
    }

    static getZoneModelData(_3dOptions, zoneID) {
        const zone = _3dOptions.zones[zoneID.toString()];

        if (!zone) {  
            return null;
        }

        const buildingID = zone[1];
        const building = _3dOptions.buildingIDs[buildingID.toString()];

        if (!building) {
            return null;
        }

        const buildingGroupName = building[1];
        const buildingName = building[2];

        if (!_3dOptions.indoorModels) {
            return null;
        }

        let buildingGroup = _3dOptions.indoorModels[buildingGroupName];

        if (!buildingGroup) {
            buildingGroup = SDMSDataManager.getBuildingGroupIndoorModel(_3dOptions, buildingGroupName, buildingName);
        }

        if (!buildingGroup) {
            return null;
        }

        const buildingData = SDMSDataManager.getBuildingDataFromID(building[0], buildingGroup);
        //const buildingData = buildingGroup[buildingName];

        if (!buildingData || !buildingData.floors) {
            return null;
        }

        const floorCount = buildingData.floors.length;

        for (let i = 0; i < floorCount; i++) {
            const floor = buildingData.floors[i];

            if (floor.zoneID === zoneID) {
                return floor.file && floor.camera ? [floor.file, floor.modelDisplayText, floor.camera] : null;
            }
        }

        return null;
    }

    static getBuildingGroupIndoorModel(_3dOptions, buildingGroupName, buildingName) {
        const indoorModels = _3dOptions.indoorModels;
        const buildingGroup = indoorModels[buildingGroupName];

        if (buildingGroup) {
            let buildingData = buildingGroup[buildingName];

            if (!buildingData) {
                buildingData = SDMSDataManager.getBuildingDataFromDisplayText(buildingName, buildingGroup);
            }

            if (buildingData) {
                return buildingGroup;
            }
        }

        for (const name in indoorModels) {
            const bg = indoorModels[name];

            if (bg) {
                let buildingData = bg[buildingName];

                if (!buildingData) {
                    buildingData = SDMSDataManager.getBuildingDataFromDisplayText(buildingName, bg);
                }

                if (buildingData) {
                    return bg;
                }
            }
        }

        return null;
    }

    static getBuildingDataFromDisplayText(displayText, buildingGroup) {
        for (const buildingName in buildingGroup) {
            const buildingData = buildingGroup[buildingName];

            if (buildingData?.modelDisplayText === displayText) {
                return buildingData;
            }
        }

        return null;
    }

    static getBuildingDataFromID(buildingID, buildingGroup) {
        for (const buildingName in buildingGroup) {
            const buildingData = buildingGroup[buildingName];

            if (buildingData !== null && buildingData !== undefined && buildingData.buildingID === buildingID) {
                return buildingData;
            }
        }

        return null;
    }

    static checkCCTVTypes(cctvs) {
        const cctvCount = cctvs.length;

        for (let i = 0; i < cctvCount; i++) {
            const cctv = cctvs[i];

            // if (cctv.name.endsWith(POIManager.PTZ_Type))
            //     cctv.type = POIManager.PTZ_Type;
        }
    }

    static getBuildingGroupNameFromZoneID(zoneID, _3dOptions) {
        const zoneData = _3dOptions.zones[zoneID];

        if (zoneData && zoneData.length >= 2) {
            const buildingID = zoneData[1];
            const buildingData = _3dOptions.buildingIDs[buildingID];

            if (buildingData && buildingData.length >= 2) {
                return buildingData[1];
            }
        }

        return null;
    }

    /*static async updateOuterDatas(_3dOptions, buildingGroups, outdoorZones, buildingGroupTextSprite, buildingTextSprite) {
        SDMSDataManager.checkBuildingGroups(_3dOptions, buildingGroups, buildingGroupTextSprite);
        console.log(outdoorZones);
    }

    static checkBuildingGroups(_3dOptions, buildingGroups, buildingGroupTextSprite) {
        const buildingGroupCount = buildingGroups.length;

        for (let i = 0; i < buildingGroupCount; i++) {
            const _buildingGroup = buildingGroups[i];
            const spriteData = buildingGroupTextSprite[_buildingGroup.groupName];

            if (spriteData) {
                const buildingGroup = SDMSDataManager.getBuildingGroup(_3dOptions, _buildingGroup.groupName);

                if (buildingGroup && buildingGroup[1]) {
                    if (_buildingGroup.displayText !== buildingGroup[1]) {

                    }
                }
            }
        }
    }

    static getBuildingGroup(_3dOptions, buildingGroupName) {
        const buildingGroupCount = _3dOptions.buildingGroups.length;

        for (let i = 0; i < buildingGroupCount; i++) {
            const buildingGroup = _3dOptions.buildingGroups[i];

            if (buildingGroup && buildingGroup.length >= 6 && buildingGroup[0]) {
                return buildingGroup;
            }
        }

        return null;
    }*/
}