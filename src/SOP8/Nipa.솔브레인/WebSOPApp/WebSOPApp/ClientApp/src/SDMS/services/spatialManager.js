import SdmsResource from "../resource/id";
import { SDMSController } from "./sdmsController";

export class SpatialManager {
    constructor() {
        this.buildingGroups = {};
        this.buildings = {};
        this.zones = {};
        this.sites = {};
        this.sensors = {};

        this.tempBuildingGroupLink = {};
        this.tempBuildingLink = {};
        this.tempZoneLink = {};
        this.tempSiteLink = {};

        this.loadingZoneSensors = false;
        this.loadingEquipZones = false;
        this.loadingBuildingGroups = false;

        this.updatedZoneNo = null;
        this.outdoorZones = null;
        this.updateZoneSensorMethod = null;
    }

    static setBuildingGroupList(buildingGroups, outdoorZones) {
        const siteBuildingGroupList = {};

        for (const buildingGroup of buildingGroups) {
            let siteBuildingGroup = siteBuildingGroupList[buildingGroup.siteNo];

            if (!siteBuildingGroup) {
                siteBuildingGroup = {};
                siteBuildingGroup.buildingGroups = [];
                siteBuildingGroup.outdoorZones = [];

                siteBuildingGroupList[buildingGroup.siteNo] = siteBuildingGroup;
            }

            siteBuildingGroup.buildingGroups.push(buildingGroup);
        }

        for (const outdoorZone of outdoorZones) {
            let siteBuildingGroup = siteBuildingGroupList[outdoorZone.siteNo];

            if (!siteBuildingGroup) {
                siteBuildingGroup = {};
                siteBuildingGroup.buildingGroups = [];
                siteBuildingGroup.outdoorZones = [];

                siteBuildingGroupList[outdoorZone.siteNo] = siteBuildingGroup;
            }

            siteBuildingGroup.outdoorZones.push(outdoorZone);
        }

        return siteBuildingGroupList;
    }

    make3dModels(siteBuildingGroupList, siteModels, sensorList) {
        let firstSiteNo = null;

        for (const siteNo in siteModels) {
            if (firstSiteNo === null) {
                firstSiteNo = siteNo;
            }

            const siteModel = siteModels[siteNo];
            const indoorModels = siteModel.indoorModels;

            const siteBuildingGroup = siteBuildingGroupList[siteNo];

            if (indoorModels && siteBuildingGroup) {
                for (const indoorModel of indoorModels) {
                    SpatialManager.setModel(indoorModel, siteBuildingGroup);
                }

                if (siteBuildingGroup.buildingGroups) {
                    for (const buildingGroup of siteBuildingGroup.buildingGroups) {
                        this.buildingGroups[buildingGroup.buildingGroupNo] = buildingGroup;

                        if (buildingGroup.model?.file) {
                            this.addTempLink(this.tempBuildingGroupLink, buildingGroup.model.file, buildingGroup);
                        }

                        for (const building of buildingGroup.buildingDatas) {
                            building.siteNo = siteNo;
                            building.buildingGroupNo = buildingGroup.buildingGroupNo;
                            this.buildings[building.buildingNo] = building;

                            if (building.model?.file) {
                                this.addTempLink(this.tempBuildingLink, building.model.file, building);
                            }

                            for (const zone of building.zoneDatas) {
                                zone.siteNo = siteNo;
                                zone.buildingGroupNo = buildingGroup.buildingGroupNo;
                                zone.buildingNo = building.buildingNo;
                                this.zones[zone.zoneNo] = zone;

                                if (zone.model?.file) {
                                    this.addTempLink(this.tempZoneLink, zone.model.file, zone);
                                }
                            }
                        }
                    }
                }

                if (siteBuildingGroup.outdoorZones) {
                    for (const zone of siteBuildingGroup.outdoorZones) {
                        zone.siteNo = siteNo;
                        zone.buildingGroupNo = null;
                        zone.buildingNo = null;
                        this.zones[zone.zoneNo] = zone;
                    }
                }
            }

            const outdoorModel = siteModel.outdoorModel;

            if (outdoorModel && siteBuildingGroup) {
                siteBuildingGroup.model = SpatialManager.getModel(outdoorModel);
                this.sites[siteNo] = siteBuildingGroup;

                if (outdoorModel.file) {
                    this.addTempLink(this.tempSiteLink, outdoorModel.file, siteBuildingGroup);
                }
            }
        }

        const zones = SpatialManager.getZoneMaps(siteBuildingGroupList);
        SpatialManager.setZoneSensors(sensorList, zones);

        this.setSensorList2(sensorList);

        return [firstSiteNo, siteBuildingGroupList];
    }

    addTempLink(tempLink, file, data) {
        let linkArray = tempLink[file];

        if (!linkArray) {
            linkArray = [];
            tempLink[file] = linkArray;
        }

        linkArray.push(data);
    }

    setModelNode(modelNode, file) {
        const sites = this.tempSiteLink[file];

        if (sites) {
            for (const site of sites) {
                site.modelNode = modelNode;
                modelNode.userData.isIndoor = false;
                modelNode.userData.siteNo = this._getSiteNo(site);
            }
        }
        else {
            const buildingGroups = this.tempBuildingGroupLink[file];

            if (buildingGroups) {
                for (const buildingGroup of buildingGroups) {
                    buildingGroup.modelNode = modelNode;
                    modelNode.userData.isIndoor = false;
                    modelNode.userData.siteNo = buildingGroup.siteNo;

                    this.addToSite(modelNode, buildingGroup.siteNo);
                }
            }
            else {
                const buildings = this.tempBuildingLink[file];

                if (buildings) {
                    for (const building of buildings) {
                        building.modelNode = modelNode;
                        modelNode.userData.isIndoor = false;
                        modelNode.userData.siteNo = building.siteNo;
                        this.addToSite(modelNode, building.siteNo);
                    }
                }
                else {
                    const zones = this.tempZoneLink[file];

                    if (zones) {
                        for (const zone of zones) {
                            zone.modelNode = modelNode;
                            modelNode.userData.isIndoor = true;
                            modelNode.userData.siteNo = zone.siteNo;
                            modelNode.userData.zoneNo = zone.zoneNo;
                        }
                    }
                }
            }
        }
    }

    _getSiteNo(site) {
        if (site.buildingGroups) {
            for (const buildingGroup of site.buildingGroups) {
                return buildingGroup.siteNo;
            }
        }

        if (site.outdoorZones) {
            for (const outdoorZone of site.outdoorZones) {
                return outdoorZone.siteNo;
            }
        }

        return null;
    }

    addToSite(modelNode, siteNo) {
        const site = this.sites[siteNo];

        // 외부영역 모델은 제외한 나머지 모델들(건물그룹, 건물...)
        if (!site.outdoorModels) {
            site.outdoorModels = [];
        }

        site.outdoorModels.push(modelNode);
    }

    getSite(siteNo) {
        return this.sites[siteNo];
    }

    getBuildingGroup(buildingGroupNo) {
        return this.buildingGroups[buildingGroupNo];
    }

    getBuildingGroupFromName(buildingGroupName) {
        for (const buildingGroupNo in this.buildingGroups) {
            const buildingGroupData = this.buildingGroups[buildingGroupNo];

            if (buildingGroupData.name === buildingGroupName || buildingGroupData.displayText === buildingGroupName) {
                return buildingGroupData;
            }
        }

        return null;
    }

    getBuilding(buildingNo) {
        return this.buildings[buildingNo];
    }

    getBuildingFromName(buildingName) {
        for (const buildingNo in this.buildings) {
            const buildingData = this.buildings[buildingNo];

            if (buildingData.name === buildingName || buildingData.displayText === buildingName) {
                return buildingData;
            }
        }

        return null;
    }

    getZone(zoneNo) {
        if (zoneNo === null) {
            const outdoorZones = this.getOutdoorZones();

            if (outdoorZones) {
                for (const zone of outdoorZones) {
                    return zone;
                }
            }
        }

        return this.zones[zoneNo];
    }

    addZoneSensor(zoneNo, sensor, cctv) {
        const zone = this.getZone(zoneNo);

        if (zone) {
            let sensorList = null;
            const sensorTypeName = SdmsResource.getFacilityTypeString(sensor.sensor_ty_code);

            if (!sensorTypeName) {
                return;
            }

            if (!zone.sensors) {
                zone.sensors = {};

                if (sensorTypeName) {
                    sensorList = [];
                    zone.sensors[sensorTypeName] = sensorList;
                }
            }
            else {
                sensorList = zone.sensors[sensorTypeName];

                if (!sensorList) {
                    sensorList = [];
                    zone.sensors[sensorTypeName] = sensorList;
                }
            }

            for (const sensorData of sensorList) {
                if (sensorData.sensor?.sensor_sn === sensor.sensor_sn) {
                    return;
                }
            }

            sensorList.push({
                cctv: cctv ? cctv : null,
                sensor: sensor,
                sensorZoneData: null
            });
        }
    }

    removeZoneSensor(zoneNo, sensor) {
        const zone = this.getZone(zoneNo);

        if (zone) {
            const sensorTypeName = SdmsResource.getFacilityTypeString(sensor.sensor_ty_code);

            if (!sensorTypeName) {
                return;
            }

            if (zone.sensors) {
                const sensorList = zone.sensors[sensorTypeName];

                if (sensorList) {
                    const len = sensorList.length;

                    for (let i = 0; i < len; i++) {
                        const sensorData = sensorList[i];

                        if (sensorData.sensor?.sensor_sn === sensor.sensor_sn) {
                            sensorList.splice(i, 1);
                            return;
                        }
                    }
                }
            }
        }
    }

    getZoneSensor(zoneNo, sensorNo, sensorType) {
        const zone = this.getZone(zoneNo);

        if (zone?.sensors) {
            for (const sensorTypeName in zone.sensors) {
                const zoneSensors = zone.sensors[sensorTypeName];

                for (const sensor of zoneSensors) {
                    if (sensor.sensor?.sensor_ty_code !== sensorType) {
                        break;
                    }

                    if (sensor.sensor.sensor_sn === sensorNo) {
                        return sensor.sensor;
                    }
                }
            }
        }

        return null;
    }

    getSensorZoneNo(zoneNo, sensorNo, sensorType) {
        const zone = this.getZone(zoneNo);

        if (zone?.sensors) {
            for (const sensorTypeName in zone.sensors) {
                const zoneSensors = zone.sensors[sensorTypeName];

                for (const sensor of zoneSensors) {
                    if (sensor.sensor?.sensor_ty_code !== sensorType) {
                        break;
                    }

                    if (sensor.sensor.sensor_sn === sensorNo) {
                        if (sensor.sensorZoneData?.sensorZone) {
                            return sensor.sensorZoneData.sensorZone.sensor_zone_sn;
                        }

                        break;
                    }
                }
            }
        }

        return null;
    }

    getZoneSensor2(zoneNo, sensorNo, sensorType) {
        const zone = this.getZone(zoneNo);

        if (zone?.sensors) {
            for (const sensorTypeName in zone.sensors) {
                const zoneSensors = zone.sensors[sensorTypeName];

                for (const sensor of zoneSensors) {
                    if (sensor.sensor?.sensor_ty_code !== sensorType) {
                        break;
                    }

                    if (sensor.sensor.sensor_sn === sensorNo) {
                        return sensor;
                    }
                }
            }
        }

        return null;
    }

    removeZoneSensor(zoneNo, sensorNo, sensorType) {
        const zone = this.getZone(zoneNo);

        if (zone?.sensors) {
            for (const sensorTypeName in zone.sensors) {
                const zoneSensors = zone.sensors[sensorTypeName];
                const sensorCount = zoneSensors.length;

                for (let i = 0; i < sensorCount; i++) {
                    const sensor = zoneSensors[i];

                    if (sensor.sensor?.sensor_ty_code !== sensorType) {
                        break;
                    }

                    if (sensor.sensor.sensor_sn === sensorNo) {
                        zoneSensors.splice(i, 1);
                        return;
                    }
                }
            }
        }
    }

    // 화면에 보여지는 Zone이 달라지면 Zone 내부의 정보를 DB로부터 다시 읽어온다.
    // 다시 읽어오는 과정이 끝나면 읽어들인 정보를 화면에 표시한다.
    async updateZone(siteNo, zoneNo = null) {
        this.loadingZoneSensors = true;
        this.loadingEquipZones = true;
        this.loadingBuildingGroups = true;

        const [response, message] = await SDMSController.requestZoneInfo(siteNo, zoneNo);

        if (response) {
            this.setSensorList(response.sensorTypes);
            this.updateZoneSensors(response.sensorTypes);
            this.loadingZoneSensors = false;

            this.updateEquipZones(response.equipZoneDatas);
            this.loadingEquipZones = false;

            this.updateBuildingGroups(response.buildingGroupDatas);
            this.loadingBuildingGroups = false;

            if (this.updateZoneSensorMethod && this.updatedZoneNo !== zoneNo) {
                this.updateZoneSensorMethod(zoneNo);
            }

            this.updatedZoneNo = zoneNo;
        }
        else {
            this.loadingZoneSensors = false;
            this.loadingEquipZones = false;
            this.loadingBuildingGroups = false;
        }
    }

    setSensorList(sensorTypes) {
        if (sensorTypes) {
            for (const sensorType of sensorTypes) {
                if (sensorType.sensors) {
                    for (const sensor of sensorType.sensors) {
                        if (sensor.sensor) {
                            this.sensors[sensor.sensor.sensor_sn] = sensor.sensor;
                        }
                    }
                }
            }
        }
    }

    setSensorList2(sensorList) {
        for (const sensorTypeName in sensorList) {
            const sensors = sensorList[sensorTypeName];

            for (const sensor of sensors) {
                if (sensor.sensor) {
                    this.sensors[sensor.sensor.sensor_sn] = sensor.sensor;
                }
            }
        }
    }

    getSensor(sensorNo) {
        const sensor = this.sensors[sensorNo];

        if (!sensor) {
            return null;
        }

        return sensor;
    }

    isSameZone(zoneNo1, zoneNo2) {
        if (zoneNo1 === zoneNo2) {
            return true;
        }

        if (zoneNo1 === null) {
            const zone2 = this.getZone(zoneNo2);

            if (zone2 && SpatialManager.isOutdoorZone(zone2)) {
                return true;
            }
        }
        else if (zoneNo2 === null) {
            const zone1 = this.getZone(zoneNo1);

            if (zone1 && SpatialManager.isOutdoorZone(zone1)) {
                return true;
            }
        }

        return false;
    }

    async postLoadingZoneSensors(postMethod, postParams) {
        if (this.loadingZoneSensors === false) {
            postMethod(postParams);
        }
        else {
            setTimeout(() => this.postLoadingZoneSensors(postMethod, postParams), 100);
        }
    }

    async postLoadingEquipZones(postMethod, postParams) {
        if (this.loadingEquipZones === false) {
            postMethod(postParams);
        }
        else {
            setTimeout(() => this.postLoadingEquipZones(postMethod, postParams), 100);
        }
    }

    async postLoadingBuildingGroups(postMethod, postParams) {
        if (this.loadingBuildingGroups === false) {
            postMethod(postParams);
        }
        else {
            setTimeout(() => this.postLoadingBuildingGroups(postMethod, postParams), 100);
        }
    }

    getBuilldingGroup(buildingGroupNo) {
        return this.buildingGroups[buildingGroupNo];
    }

    getEquipZone(zone, equipZoneNo) {
        for (const equipZone of zone.equipmentZoneDatas) {
            if (equipZone.equipZoneNo === equipZoneNo) {
                return equipZone;
            }
        }

        return null;
    }

    updateBuildingGroups(buildingGroupDatas) {
        for (const buildingGroupData of buildingGroupDatas) {
            const buildingGroup = this.getBuilldingGroup(buildingGroupData.buildingGroupNo);

            if (buildingGroup) {
                buildingGroup.displayText = buildingGroupData.displayText;
                buildingGroup.x = buildingGroupData.x;
                buildingGroup.y = buildingGroupData.y;
                buildingGroup.z = buildingGroupData.z;

                for (const buildingData of buildingGroupData.buildingDatas) {
                    const building = this.getBuilding(buildingData.buildingNo);

                    if (building) {
                        building.displayText = buildingData.displayText;
                        building.x = buildingData.x;
                        building.y = buildingData.y;
                        building.z = buildingData.z;
                    }
                }
            }
        }
    }

    updateEquipZones(equipZoneDatas) {
        const zones = {};

        for (const equipZoneData of equipZoneDatas) {
            if (equipZoneData.linkedZoneNos) {
                for (const linkedZoneNo of equipZoneData.linkedZoneNos) {
                    let zone = zones[linkedZoneNo];

                    if (!zone) {
                        zone = this.getZone(linkedZoneNo);

                        if (!zone) {
                            continue;
                        }

                        zones[linkedZoneNo] = zone;
                    }

                    const equipZone = this.getEquipZone(zone, equipZoneData.equipZoneNo);

                    if (equipZone) {
                        equipZone.displayText = equipZoneData.displayText;
                        equipZone.x = equipZoneData.x;
                        equipZone.y = equipZoneData.y;
                        equipZone.z = equipZoneData.z;
                    }
                }
            }
        }
    }

    updateZoneSensors(sensorTypes) {
        const zones = {};
        const zoneSensorList = {};

        for (const sensorType of sensorTypes) {
            const sensorTypeName = sensorType.sensorTypeName;

            if (sensorType.sensors) {
                for (const sensor of sensorType.sensors) {
                    if (sensor.sensor) {
                        let zoneSensors = zoneSensorList[sensor.sensor.zone_sn];

                        if (!zoneSensors) {
                            const zone = this.getZone(sensor.sensor.zone_sn);

                            if (zone) {
                                zoneSensors = {};
                                zones[sensor.sensor.zone_sn] = zone;
                                zoneSensorList[sensor.sensor.zone_sn] = zoneSensors;
                            }
                        }

                        if (zoneSensors) {
                            let sensors = zoneSensors[sensorTypeName];

                            if (!sensors) {
                                sensors = [];
                                zoneSensors[sensorTypeName] = sensors;
                            }

                            sensors.push(sensor);
                        }
                    }
                }
            }
        }

        for (const zoneNo in zoneSensorList) {
            const zone = zones[zoneNo];
            zone.sensors = zoneSensorList[zoneNo];
        }
    }

    isIndoor(zoneNo, siteNo) {
        if (zoneNo === null || zoneNo === undefined || siteNo === null || siteNo === undefined) {
            return false;
        }

        const site = this.sites[siteNo];

        if (site?.outdoorZones) {
            for (const zone of site.outdoorZones) {
                if (zone.zoneNo === zoneNo) {
                    return false;
                }
            }
        }

        return true;
    }

    static setZoneSensors(sensorList, zones) {
        for (const sensorTypeName in sensorList) {
            const sensors = sensorList[sensorTypeName];

            for (const sensor of sensors) {
                if (sensor.sensor?.zone_sn) {
                    const zone = zones[sensor.sensor.zone_sn];

                    if (zone) {
                        if (!zone.sensors) {
                            zone.sensors = {};
                        }

                        let _sensors = zone.sensors[sensorTypeName];

                        if (!_sensors) {
                            _sensors = [];
                            zone.sensors[sensorTypeName] = _sensors;
                        }

                        _sensors.push(sensor);
                    }
                }
            }
        }
    }

    static getZoneMaps(siteBuildingGroupList) {
        const zones = {};

        for (const siteNo in siteBuildingGroupList) {
            const siteBuildingGroup = siteBuildingGroupList[siteNo];

            if (siteBuildingGroup.buildingGroups) {
                for (const buildingGroup of siteBuildingGroup.buildingGroups) {
                    if (buildingGroup.buildingDatas) {
                        for (const buildingData of buildingGroup.buildingDatas) {
                            if (buildingData.zoneDatas) {
                                for (const zoneData of buildingData.zoneDatas) {
                                    zones[zoneData.zoneNo] = zoneData;
                                }
                            }
                        }
                    }
                }
            }

            if (siteBuildingGroup.outdoorZones) {
                for (const zone of siteBuildingGroup.outdoorZones) {
                    zones[zone.zoneNo] = zone;
                }
            }
        }

        return zones;
    }

    static getModel(model) {
        if (!model.file) {
            return null;
        }

        const modelData = {};

        modelData.camera = model.camera;
        modelData.cameraOrtho = model.cameraOrtho;
        modelData.file = model.file;

        return modelData;
    }

    static setModel(model, siteBuildingGroup) {
        if (model.buildingGroupNo !== null) {
            if (siteBuildingGroup.buildingGroups) {
                for (const buildingGroup of siteBuildingGroup.buildingGroups) {
                    if (model.buildingGroupNo === buildingGroup.buildingGroupNo) {
                        SpatialManager.setBuildingGroupModel(model, buildingGroup);
                        return;
                    }
                }
            }
        }
        else if (model.buildingNo !== null) {
            if (siteBuildingGroup.buildingGroups) {
                for (const buildingGroup of siteBuildingGroup.buildingGroups) {
                    if (buildingGroup.buildingDatas) {
                        for (const buildingData of buildingGroup.buildingDatas) {
                            if (buildingData.buildingNo === model.buildingNo) {
                                SpatialManager.setBuildingModel(model, buildingData);
                                return;
                            }
                        }
                    }
                }
            }
        }
        else if (model.zoneNo !== null) {
            if (siteBuildingGroup.buildingGroups) {
                for (const buildingGroup of siteBuildingGroup.buildingGroups) {
                    if (buildingGroup.buildingDatas) {
                        for (const buildingData of buildingGroup.buildingDatas) {
                            if (buildingData.zoneDatas) {
                                for (const zoneData of buildingData.zoneDatas) {
                                    if (zoneData.zoneNo === model.zoneNo) {
                                        SpatialManager.setZoneModel(model, zoneData);
                                        return;
                                    }
                                }
                            }
                        }
                    }
                }
            }
        }
    }

    static setBuildingGroupModel(model, buildingGroup) {
        buildingGroup.model = SpatialManager.getModel(model);

        for (const child of model.children) {
            if (child.buildingNo !== null && buildingGroup.buildingDatas) {
                for (const buildingData of buildingGroup.buildingDatas) {
                    if (buildingData.buildingNo === child.buildingNo) {
                        SpatialManager.setBuildingModel(child, buildingData);
                        break;
                    }
                }
            }
        }
    }

    static setBuildingModel(model, building) {
        building.model = SpatialManager.getModel(model);

        for (const child of model.children) {
            if (child.zoneNo !== null && building.zoneDatas) {
                for (const zoneData of building.zoneDatas) {
                    if (zoneData.zoneNo === child.zoneNo) {
                        SpatialManager.setZoneModel(child, zoneData);
                        break;
                    }
                }
            }
        }
    }

    static setZoneModel(model, zone) {
        zone.model = SpatialManager.getModel(model);
    }

    static isOutdoorZone(zone) {
        if (zone) {
            if (zone.buildingNo === null) {
                return true;
            }
        }

        return false;
    }

    isOutdoorZoneNo(zoneNo) {
        const zone = this.getZone(zoneNo);

        if (zone) {
            return SpatialManager.isOutdoorZone(zone);
        }

        return false;
    }

    getOutdoorZones() {
        if (this.outdoorZones !== null) {
            return this.outdoorZones;
        }

        const outdoorZones = [];

        for (const zoneNo in this.zones) {
            const zone = this.zones[zoneNo];

            if (zone.buildingNo === null) {
                outdoorZones.push(zone);
            }
        }

        this.outdoorZones = outdoorZones;
        return this.outdoorZones;
    }
}