import ProjectResource from "../../Root/resource/id";
// import { POIManager } from "../ui/3D/poiManager";
import { SDMSController } from "./sdmsController";
import SdmsResource from "../resource/id";

export class SDMSDataManager {
    static BoundingBoxTag = "-0";

    static async get3DOptions(buildingGroupList, outdoorZones, errorMessage, userID, siteNos) {

        if (!buildingGroupList && errorMessage && errorMessage.length > 0) {
            alert(errorMessage);
            return {};
        }
        else {
            const siteBuildingGroups = {};
            const siteBuildings = {};
            const siteZones = {};
            const siteOutdoorZones = {};

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

                buildings[buildingGroup.name] = SDMSDataManager.getBuildings(buildingGroup.buildingDatas, zones);

                const bgData = [];

                bgData.push(buildingGroup.name);
                bgData.push(buildingGroup.displayText);
                bgData.push(buildingGroup.name + SDMSDataManager.BoundingBoxTag);

                if (buildingGroup.x !== null && buildingGroup.y !== null && buildingGroup.z !== null) {
                    bgData.push(buildingGroup.x);
                    bgData.push(buildingGroup.y);
                    bgData.push(buildingGroup.z);
                }
                else {
                    bgData.push(null);
                    bgData.push(null);
                    bgData.push(null);
                }

                bgData.push(buildingGroup.buildingGroupNo);

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

            const site3DOptions = {};

            for (const site_sn in siteBuildingGroups) {
                const buildingGroups = siteBuildingGroups[site_sn];
                const _outdoorZones = siteOutdoorZones[site_sn];
                const buildings = siteBuildings[site_sn];
                const zones = siteZones[site_sn];

                const _3DOptions = this.make3DOptions(buildingGroups, _outdoorZones, buildings, zones);

                if (_3DOptions !== null) {
                    _3DOptions.site_sn = site_sn;
                    site3DOptions[site_sn] = _3DOptions;
                }
            }

            // 같은 외부모델을 사용하는 Site들은 같은 외부영역을 공유하도록 한다.
            SDMSDataManager.shareOutdoorZones(site3DOptions);

            return site3DOptions;
        }

        //return {};
    }

    // 같은 외부모델을 사용하는 Site들은 같은 외부영역을 공유하도록 한다.
    static shareOutdoorZones(site3DOptions) {
        // key : outdoor model file name
        const sharingOutdoors = {};

        for (const site_sn in site3DOptions) {
            const _3dOptions = site3DOptions[site_sn];

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

    static getSiteModels(models, site_sn) {
        const siteModels = [];
        const modelCount = models.length;

        for (let i = 0; i < modelCount; i++) {
            const model = models[i];

            if (model.site_sn.toString() === site_sn) {
                siteModels.push(model);
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

            buildingData.push(building.buildingNo);
            buildingData.push(building.displayText);
            buildingData.push(building.name + SDMSDataManager.BoundingBoxTag);

            if (building.x !== null && building.y !== null && building.z !== null) {
                buildingData.push(building.x);
                buildingData.push(building.y);
                buildingData.push(building.z);
            }
            else {
                buildingData.push(null);
                buildingData.push(null);
                buildingData.push(null);
            }

            const buildingZones = {};
            const equipZoneData = {};
            SDMSDataManager.getZones(building.zoneDatas, buildingZones, equipZoneData);
            buildingData.push(buildingZones);
            buildings[building.name] = buildingData;

            for (const zoneID in buildingZones) {
                const zone = [...buildingZones[zoneID]];
                zone.sensors = {};
                zones[zoneID] = zone;
                zone.equipZones = {};
                zone.datas = SDMSDataManager.getZoneDatas(parseInt(zoneID), building.zoneDatas);

                const equipmentZoneDatas = equipZoneData[parseInt(zoneID)];

                if (equipmentZoneDatas) {
                    const equipZoneCount = equipmentZoneDatas.length;

                    for (let j = 0; j < equipZoneCount; j++) {
                        const equipmentZoneData = equipmentZoneDatas[j];
                        const equipZoneData = [];

                        equipZoneData.push(equipmentZoneData.eqp_zone_sn);
                        equipZoneData.push(equipmentZoneData.name);
                        equipZoneData.push(equipmentZoneData.x);
                        equipZoneData.push(equipmentZoneData.y);
                        equipZoneData.push(equipmentZoneData.z);

                        zone.equipZones[equipmentZoneData.eqp_zone_sn] = equipZoneData;
                    }
                }
            }
        }

        return buildings;
    }

    static getZoneDatas(zons_sn, zoneDatas) {
        const dataCount = zoneDatas.length;

        for (let i = 0; i < dataCount; i++) {
            const zoneData = zoneDatas[i];

            if (zoneData.zoneNo === zons_sn) {
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

            if (zone.x === null && zone.y === null && zone.z === null) {
                zones[zone.zoneNo] = [SDMSDataManager.getZoneFloor(zone), zone.buildingNo, zone.name, zone.displayText, null, null, null];
            }
            else {
                zones[zone.zoneNo] = [SDMSDataManager.getZoneFloor(zone), zone.buildingNo, zone.name, zone.displayText, zone.x, zone.y, zone.z];
            }

            equipZoneDatas[zone.zoneNo] = zone.equipmentZoneDatas;
        }
    }

    static getZoneFloor(zone) {
        if (zone.additionalFloor === null)
            return zone.floorIndex;

        return zone.floorIndex + zone.additionalFloor;
    }

    static make3DOptions(buildingGroups, outdoorZones, buildings, zones) {
        const _3DOptions = {};

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

            zoneData.name = zone.name;
            zoneData.id = zone.zoneNo;
            zoneData.sensors = {};
            zoneData.datas = zone.datas;

            _outdoorZones[zone.zoneNo.toString()] = zoneData;
        }

        _3DOptions.buildingGroups = buildingGroups;
        _3DOptions.buildings = buildings;
        _3DOptions.allBuildings = allBuildings;
        _3DOptions.buildingIDs = buildingIDs;
        _3DOptions.zones = zones;
        _3DOptions.outdoorZones = _outdoorZones;

        return _3DOptions;
    }

    static addModel(model, site_sn) {        
        const data = {};
        const childModelCount = model.childModels.length;

        for (let i = 0; i < childModelCount; i++) {
            const childModel = model.childModels[i];
            const json = SDMSDataManager.addModel(childModel, site_sn);

            data[childModel.modelName] = json;
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

    static getSensor(sensorTypes, sensorNo, sensorType) {
        for (const sensors of sensorTypes) {
            if (sensors.sensorTypeCode !== sensorType || !sensors.sensors) {
                continue;
            }

            for (const sensor of sensors.sensors) {
                if (sensor.sensor.sensor_sn === sensorNo) {
                    return sensor.sensor;
                }
            }
        }
    }

    static updateDoorStatus(sensorTypes, doorStatus) {
        for (const status of doorStatus) {
            const sensor = SDMSDataManager.getSensor(sensorTypes, status.sensorNo, SdmsResource.facilityType.DOOR);

            if (sensor) {
                sensor.isOpened = status.isOpened ? true : false;
            }
        }
    }
}