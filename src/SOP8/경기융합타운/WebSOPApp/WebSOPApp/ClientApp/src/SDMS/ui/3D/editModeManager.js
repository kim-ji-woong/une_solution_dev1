import Vertex3D from "../../../Common/util/Vertex3D";
import { SDMSController } from "../../services/sdmsController";
import SDMS from "../sdms";
import SDMSMainMenu from "../sdmsMainMenu";
import { FakeWallManager } from "./fakeWallManager";
import { TextPOIManager } from "./textPOIManager";
import { EquipZoneAreaManager } from "./equipZoneAreaManager";

export class EditModeManager {
    static CheckIcon = 0;
    static MoveIcon = 1;
    static DeleteIcon = 2;
    static CheckNDelete = 3;
    static ChangeEquipZone = 4;
    static ChangeEquipZone_OneClick = 5;

    constructor() {
        this.editSensors = {};
        this.editFakeWalls = {};
        // Zone ID별 Origin FakeWalls
        this.originFakeWalls = {};
        this.fakeWallManager = null;

        this.sensorForCCTVGroup = null;
        this.cctvGroupDatas = [];
        // EquipZoneID별 CCTV List
        this.editCCTVGroups = {};
        this.editOriginCCTVGroups = {};

        // ZoneID별 신규 CCTV POI
        this.newCCTVPOIs = {};
        this.poiManager = null;

        // ZoneID별 삭제할 CCTV POI
        this.deleteCCTVPOIs = {};

        this.poiEditMode = EditModeManager.CheckIcon;
        this.contents3D = null;

        this.editEquipZoneAreas = {};
        this.originEquipZoneAreas = {};
        this.equipZoneAreaManager = null;

        // [센서타입] - [센서ID] 별  [EquipZoneID, ZoneID]
        this.editSensorEquipZones = {};
    }

    setContents3D(contents3D) {
        this.contents3D = contents3D;
    }

    initPOIEditMode() {
        this.poiEditMode = EditModeManager.MoveIcon;
    }

    setOriginFakeWalls(zoneID, fakeWalls) {
        // 편집모드에서 가벽이 편집되면 원본 또한 편집됨 - K.D.R
        //this.originFakeWalls[zoneID] = fakeWalls;
        let fakes = [];

        if (fakeWalls !== null && fakeWalls !== undefined) {
            for (let i = 0; i < fakeWalls.length; i++) {
                const fakeWallData = fakeWalls[i];

                const fakeWall = {
                    "id": fakeWallData.id,
                    "rotate": fakeWallData.rotate,
                    "scale": fakeWallData.scale,
                    "x": fakeWallData.x,
                    "y": fakeWallData.y,
                    "z": fakeWallData.z,
                    "zoneID": fakeWallData.zoneID,
                };

                fakes.push(fakeWall);
            }
        }

        this.originFakeWalls[zoneID] = fakes;
    }

    getOriginFakeWall(id, zoneID) {
        if (id < 0 || id === null || id === undefined) {
            return null;
        }

        const fakeWalls = this.originFakeWalls[zoneID];

        if (!fakeWalls) {
            return null;
        }

        const fakeWallCount = fakeWalls.length;

        for (let i = 0; i < fakeWallCount; i++) {
            const fakeWall = fakeWalls[i];

            if (fakeWall.id === id) {
                return fakeWall;
            }
        }

        return null;
    }

    setFakeWallManager(fakeWallManager) {
        this.fakeWallManager = fakeWallManager;
    }

    addFakeWallData(fakeWall, mode, zoneID, fakeWallManager) {
        this.fakeWallManager = fakeWallManager;

        let zoneDatas = this.editFakeWalls[zoneID];

        if (!zoneDatas) {
            zoneDatas = [];
            this.editFakeWalls[zoneID] = zoneDatas;
        }

        const dataCount = zoneDatas.length;

        for (let i = 0; i < dataCount; i++) {
            const fakeWallData = zoneDatas[i];

            // 같은 객체에 대하여 여러개의 UpdateData를 만들지 않도록 한다.
            // DB 저장시 각각의 데이터가 같은 객체로부터 생성되었음을 확인할 방법이 없다.
            if (fakeWallData[0] === fakeWall) {
                zoneDatas[i] = [fakeWall, mode, fakeWallData[2]];
                return;
            }
        }
        
        zoneDatas.push([fakeWall, mode, this.getOriginFakeWall(FakeWallManager.getWallID(fakeWall), zoneID)]);
    }

    clearFakeWalls() {
        this.editFakeWalls = [];

        // 편집모드에서 수정 내용 취소할 경우 유지를 위해 주석처리 - K.D.R
        //this.originFakeWalls = [];
    }

    addSensor(poi, _3dOptions) {
        if (!poi) {
            return;
        }

        const [sensorType, zoneID, sensorID] = SDMS.getSensorInfo(poi);

        if (!sensorType || !zoneID || !sensorID) {
            return;
        }

        let sensors = this.editSensors[sensorType];

        if (!sensors) {
            sensors = {};
            this.editSensors[sensorType] = sensors;
        }

        let sensor = sensors[sensorID];

        if (!sensor) {
            // 아직 DB에 적용하지 않았기 때문에, 원상복구할 경우를 대비하여 원래 좌표를 기억시킨다.
            sensor = [poi, zoneID, this.getOriginSensor(sensorType, zoneID, sensorID, _3dOptions)];
            sensors[sensorID] = sensor;
        }
        else {
            sensor[0] = poi;
            sensor[1] = zoneID;
        }
    }

    getOriginSensor(sensorType, zoneID, sensorID, _3dOptions) {
        if (TextPOIManager.isTextPOI(sensorType)) {
            return this.getTextOriginSensor(sensorType, zoneID, sensorID, _3dOptions);
        }

        let zoneData = _3dOptions.zones[zoneID];

        if (!zoneData) {
            zoneData = _3dOptions.outdoorZones[zoneID];

            if (!zoneData || !zoneData.sensors) {
                return null;
            }
        }

        if (sensorType.startsWith(SDMSMainMenu.CCTV_Type)) {
            sensorType = SDMSMainMenu.CCTV_Type;
        }

        const sensors = zoneData.sensors[sensorType];

        if (!sensors) {
            return null;
        }

        const sensorCount = sensors.length;

        for (let i = 0; i < sensorCount; i++) {
            const sensor = sensors[i];

            if (sensor.id === sensorID) {
                return sensor;
            }
        }

        return null;
    }

    getTextOriginSensor(sensorType, zoneID, sensorID, _3dOptions) {
        if (sensorType === SDMSMainMenu.BuildingGroupNameText) {
            const buildingGroupCount = _3dOptions.buildingGroups.length;

            for (let i = 0; i < buildingGroupCount; i++) {
                const buildingGroup = _3dOptions.buildingGroups[i];

                if (buildingGroup.length >= 7) {
                    if (buildingGroup[6] === sensorID) {
                        return { x: buildingGroup[3], y: buildingGroup[4], z: buildingGroup[5], origin: buildingGroup, text: buildingGroup[1] };
                    }
                }
            }
        }
        else if (sensorType === SDMSMainMenu.BuildingNameText) {
            const building = _3dOptions.buildingIDs[sensorID];

            if (building && building.length >= 7) {
                return { x: building[4], y: building[5], z: building[6], origin: building, text: building[2] };
            }
        }
        else if (sensorType === SDMSMainMenu.EquipZoneNameText) {
            const zone = _3dOptions.zones[zoneID];

            if (zone && zone.equipZones) {
                const equipZone = zone.equipZones[sensorID];

                if (equipZone && equipZone.length >= 3) {
                    const position = equipZone[2];
                    return { x: position.x, y: position.y, z: position.z, origin: position, text: equipZone[1] };
                }
            }
        }

        return null;
    }

    clearSensors() {
        this.editSensors = {};
    }

    clearCCTVGroups() {
        this.sensorForCCTVGroup = null;
        this.cctvGroupDatas = [];
        this.editCCTVGroups = {};
        this.editOriginCCTVGroups = {};
    }

    clear() {
        this.clearSensors();
        this.clearFakeWalls();
        this.clearCCTVGroups();
        this.clearNewCCTVPOIs();
        this.clearDeleteCCTVPOIs();
        this.clearEquipZoneAreas();
    }

    backToOrigin(currentZoneID) {
        this.backToOriginSensors();

        // 구역명 초기화 후 해당 층 EquipZoneText 리로드 - K.D.R
        if (this.contents3D?.textPOIManager) {
            this.contents3D.textPOIManager.reloadEquipZoneText();
        }
        
        if (this.fakeWallManager) {
            const originFakeWalls = this.originFakeWalls[this.fakeWallManager.zoneID];
            this.fakeWallManager.backToOrigin(originFakeWalls);
        }

        if (this.equipZoneAreaManager) {
            const originEquipZoneAreas = this.originEquipZoneAreas[this.equipZoneAreaManager.zoneID];
            this.equipZoneAreaManager.backToOrigin(originEquipZoneAreas);
        }

        this.backToNewCCTVs();
        this.backToDeleteCCTVs(currentZoneID);
    }

    backToDeleteCCTVs(currentZoneID) {
        if (!this.poiManager) {
            return;
        }

        for (const zoneID in this.deleteCCTVPOIs) {
            const pois = this.deleteCCTVPOIs[zoneID];
            const poiCount = pois.length;

            for (let i = 0; i < poiCount; i++) {
                const poi = pois[i];

                // 지금 보고 있는 층에만 삭제된 cctv 다시 표시 - K.D.R
                if (currentZoneID !== null && currentZoneID !== undefined && currentZoneID === poi.zoneID) 
                    this.poiManager.addSensor(SDMSMainMenu.CCTV_Type, poi.id, poi.x, poi.y, poi.z, poi.zoneID, poi.isIndoor);
                else if (currentZoneID === null || currentZoneID === undefined) 
                    this.poiManager.addSensor(SDMSMainMenu.CCTV_Type, poi.id, poi.x, poi.y, poi.z, poi.zoneID, poi.isIndoor);
            }
        }
    }

    backToNewCCTVs() {
        if (!this.poiManager) {
            return;
        }

        for (const zoneID in this.newCCTVPOIs) {
            const pois = this.newCCTVPOIs[zoneID];
            const poiCount = pois.length;

            for (let i = 0; i < poiCount; i++) {
                const poi = pois[i];
                this.poiManager.remove(SDMSMainMenu.CCTV_Type, poi);
            }
        }
    }

    backToOriginSensors() {
        for (const sensorType in this.editSensors) {
            const sensors = this.editSensors[sensorType];

            for (const sensorID in sensors) {
                const sensor = sensors[sensorID];

                const poi = sensor[0];
                const originSensor = sensor[2];

                if (poi && originSensor) {
                    const obj = poi.object ? poi.object : poi;
                    obj.position.set(originSensor.x, originSensor.y, originSensor.z);

                    if (originSensor.text && TextPOIManager.isTextPOI(sensorType)) {
                        if (this.contents3D?.textPOIManager) {
                            this.contents3D.textPOIManager.setEquipZonePoiText(poi, originSensor.text, this.contents3D.props._3dOptions);
                        }
                    }
                }
            }
        }
    }

    // 편집중이었던 모든 센서들을 원래 위치로 되돌려 놓는다.
    moveToOriginPosition() {
        for (const sensorType in this.editSensors) {
            const sensors = this.editSensors[sensorType];

            for (const sensorID in sensors) {
                const [poi, zoneID, originSensor] = sensors[sensorID];

                if (poi && originSensor && originSensor.x !== null && originSensor.x !== undefined && originSensor.y !== null && originSensor.y !== undefined && originSensor.z !== null && originSensor.z !== undefined) {
                    poi.object.position.x = originSensor.x;
                    poi.object.position.y = originSensor.y;
                    poi.object.position.z = originSensor.z;
                }
            }
        }
    }

    applyTo3DOptions() {
        for (const sensorType in this.editSensors) {
            const sensors = this.editSensors[sensorType];

            for (const sensorID in sensors) {
                const [poi, zoneID, originSensor] = sensors[sensorID];

                if (poi && originSensor) {
                    if (TextPOIManager.isTextPOI(sensorType)) {
                        this.applyToText3DOptions(sensorType, poi, originSensor.origin);
                    }
                    else {
                        originSensor.x = poi.object.position.x;
                        originSensor.y = poi.object.position.y;
                        originSensor.z = poi.object.position.z;
                    }
                }
            }
        }
    }

    applyToText3DOptions(sensorType, poi, origin) {
        const obj = poi.object ? poi.object : poi;

        if (sensorType === SDMSMainMenu.BuildingGroupNameText) {
            const buildingGroup = origin;

            buildingGroup[3] = obj.position.x;
            buildingGroup[4] = obj.position.y;
            buildingGroup[5] = obj.position.z;
        }
        else if (sensorType === SDMSMainMenu.BuildingNameText) {
            const building = origin;

            building[4] = obj.position.x;
            building[5] = obj.position.y;
            building[6] = obj.position.z;
        }
        else if (sensorType === SDMSMainMenu.EquipZoneNameText) {
            const position = origin;

            position.x = obj.position.x;
            position.y = obj.position.y;
            position.z = obj.position.z;
        }
    }

    // 편집중인 센서가 있는가?
    isEmpty() {
        for (const sensorType in this.editSensors) {
            const sensors = this.editSensors[sensorType];

            for (const sensorID in sensors) {
                return false;
            }
        }

        for (const zoneID in this.editFakeWalls) {
            const fakeWallDatas = this.editFakeWalls[zoneID];
            const fakeWallCount = fakeWallDatas.length;

            if (fakeWallCount > 0) {
                return false;
            }
        }

        for (const equipZoneID in this.editCCTVGroups) {
            const cctvGroup = this.editCCTVGroups[equipZoneID];
            const originCCTVGroup = this.editOriginCCTVGroups[equipZoneID];

            if (cctvGroup && originCCTVGroup) {
                if (this.isSame(cctvGroup, originCCTVGroup) === false) {
                    return false;
                }
            }
        }

        for (const zoneID in this.newCCTVPOIs) {
            const pois = this.newCCTVPOIs[zoneID];

            if (pois.length > 0) {
                return false;
            }
        }

        for (const zoneID in this.deleteCCTVPOIs) {
            const pois = this.deleteCCTVPOIs[zoneID];

            if (pois.length > 0) {
                return false;
            }
        }

        for (const zoneID in this.editEquipZoneAreas) {
            const areas = this.editEquipZoneAreas[zoneID];

            if (areas.length > 0) {
                return false;
            }
        }

        return true;
    }

    isSame(cctvGroup1, cctvGroup2) {
        const count1 = cctvGroup1.length;
        const count2 = cctvGroup2.length;

        if (count1 !== count2) {
            return false;
        }

        for (let i = 0; i < count1; i++) {
            if (cctvGroup1[i] !== cctvGroup2[i]) {
                return false;
            }
        }

        return true;
    }

    saveAll(sdms, postMethod) {
        // 완료횟수, 전체 함수개수, 오류 메시지, 데이터 저장 회수
        const result = [0, 4, null, 0];

        this.saveSensorDatas(sdms, postMethod, result);
        this.saveFakeWallDatas(sdms, postMethod, result);
        this.saveCCTVGroups(sdms, postMethod, result);
        this.saveNewCCTVPOIs(sdms, postMethod, result);
        this.saveDeleteCCTVPOIs(sdms, postMethod, result);
        this.saveEquipZoneAreaDatas(sdms, postMethod, result);
        this.saveSensorEquipZoneDatas(sdms, postMethod, result);
    }

    onPostSave(sdms, postMethod, saveResult, errorMessage, processSave) {
        saveResult[0] += 1;

        if (processSave) {
            saveResult[3] += 1;
        }

        if (errorMessage !== null) {
            saveResult[2] = errorMessage;
        }

        if (saveResult[0] >= saveResult[1]) {
            if (saveResult[2] === null) {
                if (postMethod) {
                    postMethod();
                }

                if (saveResult[3] > 0) {
                    sdms.showConfirmDialog("확인", ["저장되었습니다."], null, null);
                }
            }
            else {
                sdms.showConfirmDialog("오류", [saveResult[2]], null, null);
            }
        }
    }

    saveDeleteCCTVPOIs(sdms, postMethod, saveResult) {
        const datas = [];
        const zoneCCTVs = {};

        for (const zoneID in this.deleteCCTVPOIs) {
            const pois = this.deleteCCTVPOIs[zoneID];
            const poiCount = pois.length;

            for (let i = 0; i < poiCount; i++) {
                const poi = pois[i];
                let zoneID = poi.zoneID;
                const sensorID = poi.id;

                // 삭제되었음을 로그에 기록하기 위하여 zoneID를 음수값으로 전달한다.
                // DB에는 null로 기록된다.

                // 예외처리 - K.D.R
                if (zoneID === 0)
                    zoneID = 1;

                datas.push([sensorID, -zoneID, null, null, null]);

                let cctvs = zoneCCTVs[zoneID];

                if (!cctvs) {
                    cctvs = [];
                    zoneCCTVs[zoneID] = cctvs;
                }

                cctvs.push(poi);
            }
        }

        if (datas.length > 0) {
            this.saveDeleteCCTVs(datas, zoneCCTVs, postMethod, sdms, saveResult);
        }
        else {
            this.onPostSave(sdms, postMethod, saveResult, null, false);
        }
    }

    async saveDeleteCCTVs(datas, zoneCCTVs, postMethod, sdms, saveResult) {
        const result = await SDMSController.requestUpdateCCTVs(datas);

        if (result && result.success) {
            this.deleteCCTVsTo3DOptions(zoneCCTVs, sdms);
            this.clearDeleteCCTVPOIs();

            this.onPostSave(sdms, postMethod, saveResult, null, true);
        }
        else {
            this.onPostSave(sdms, postMethod, saveResult, result ? result.message : "삭제된 CCTV POI 저장에 실패하였습니다.", false);
        }
    }

    deleteCCTVsTo3DOptions(zoneCCTVs, sdms) {
        for (const zoneID in zoneCCTVs) {
            const cctvs = zoneCCTVs[zoneID];
            const cctvCount = cctvs.length;

            if (cctvCount === 0)
                continue;

            const cctvMap = {};

            for (let i = 0; i < cctvCount; i++) {
                const cctv = cctvs[i];
                cctvMap[cctv.id] = cctv;
            }

            let zone = sdms.state._3dOptions.zones[zoneID];

            if (!zone) {
                zone = sdms.state._3dOptions.outdoorZones[zoneID];

                if (!zone) {
                    continue;
                }
            }

            const sensors = zone.sensors[SDMSMainMenu.CCTV_Type];

            if (!sensors) {
                continue;
            }

            let sensorCount = sensors.length;

            for (let i = 0; i < sensorCount; i++) {
                const cctv = sensors[i];

                if (cctvMap[cctv.id]) {
                    sensors.splice(i, 1);
                    sensorCount--;
                }
            }
        }
    }

    saveNewCCTVPOIs(sdms, postMethod, saveResult) {
        const datas = [];

        for (const zoneID in this.newCCTVPOIs) {
            const pois = this.newCCTVPOIs[zoneID];
            const poiCount = pois.length;

            for (let i = 0; i < poiCount; i++) {
                const poi = pois[i];
                const [sensorType, zoneID, sensorID] = SDMS.getSensorInfo(poi);
                datas.push([sensorID, zoneID, poi.position.x, poi.position.y, poi.position.z]);
            }
        }

        if (datas.length > 0) {
            this.saveNewCCTVs(datas, postMethod, sdms, saveResult);
        }
        else {
            this.onPostSave(sdms, postMethod, saveResult, null, false);
        }
    }

    async saveNewCCTVs(datas, postMethod, sdms, saveResult) {
        const result = await SDMSController.requestUpdateCCTVs(datas);

        if (result && result.success) {
            this.newCCTVsTo3DOptions(datas, sdms);
            this.clearNewCCTVPOIs();

            this.onPostSave(sdms, postMethod, saveResult, null, true);
        }
        else {
            this.onPostSave(sdms, postMethod, saveResult, result ? result.message : "신규 CCTV POI 저장에 실패하였습니다.", false);
        }
    }

    newCCTVsTo3DOptions(datas, sdms) {
        let zone = null;
        const dataCount = datas.length;
        const _3dOptions = sdms.state._3dOptions;
        const newCCTVList = sdms.state.newCCTVList;

        for (let i = 0; i < dataCount; i++) {
            const [cctvID, zoneID, x, y, z] = datas[i];

            const cctvIndex = this.getNewCCTVIndex(cctvID, newCCTVList);

            if (cctvIndex < 0) {
                continue;
            }

            const cctv = newCCTVList[cctvIndex];

            cctv.zoneID = zoneID;
            cctv.x = x;
            cctv.y = y;
            cctv.z = z;

            if (!zone || zone.id !== zoneID) {
                zone = _3dOptions.zones[zoneID];
            }

            if (!zone) {
                zone = _3dOptions.outdoorZones[zoneID];
            }

            if (!zone) {
                continue;
            }

            if (!zone.sensors) {
                zone.sensors = { cctv: [] };
            }

            zone.sensors.cctv.push(cctv);
            newCCTVList.splice(cctvIndex, 1);
        }
    }

    getNewCCTVIndex(cctvID, newCCTVList) {
        const cctvCount = newCCTVList.length;

        for (let i = 0; i < cctvCount; i++) {
            const cctv = newCCTVList[i];

            if (cctv.id === cctvID) {
                return i;
            }
        }

        return -1;
    }

    clearDeleteCCTVPOIs() {
        this.deleteCCTVPOIs = {};
    }

    clearNewCCTVPOIs() {
        this.newCCTVPOIs = {};
    }

    saveCCTVGroups(sdms, postMethod, saveResult) {
        const equipZoneCCTVs = {};
        let dataCount = 0;

        for (const equipZoneID in this.editCCTVGroups) {
            const cctvGroup = this.editCCTVGroups[equipZoneID];
            const originCCTVGroup = this.editOriginCCTVGroups[equipZoneID];

            if (cctvGroup && originCCTVGroup) {
                if (this.isSame(cctvGroup, originCCTVGroup) === false) {
                    equipZoneCCTVs[equipZoneID] = cctvGroup;
                    dataCount++;
                }
            }
        }

        if (dataCount > 0) {
            this.saveEquipZoneCCTVs(equipZoneCCTVs, postMethod, sdms, saveResult);
        }
        else {
            this.onPostSave(sdms, postMethod, saveResult, null, false);
        }
    }

    async saveEquipZoneCCTVs(equipZoneCCTVs, postMethod, sdms, saveResult) {
        const result = await SDMSController.requestUpdateEquipZoneCCTVs(equipZoneCCTVs);

        if (result && result.success) {
            this.clearCCTVGroups();

            this.onPostSave(sdms, postMethod, saveResult, null, true);
            /*if (postMethod) {
                postMethod();
            }

            sdms.showConfirmDialog("확인", ["저장되었습니다."], null, null);*/
        }
        else {
            this.onPostSave(sdms, postMethod, saveResult, result ? result.message : "구역별 CCTV정보 저장에 실패하였습니다.", false);
            //sdms.showConfirmDialog("에러", [result.message], null, null);
        }
    }

    saveFakeWallDatas(sdms, postMethod, saveResult) {
        const datas = [];
        let dataCount = 0;

        for (const zoneID in this.editFakeWalls) {
            const fakeWallDatas = this.editFakeWalls[zoneID];
            const fakeWallCount = fakeWallDatas.length;

            let chk = false;

            for (let i = 0; i < fakeWallCount; i++) {
                const [fakeWall, mode, originFakeWall] = fakeWallDatas[i];

                // 추가된 가벽을 수정한 경우 - K.D.R
                if (originFakeWall === null && datas.length > 0 && mode !== FakeWallManager.UpdateMode.Add) {
                    let fakeWallID = FakeWallManager.getWallID(fakeWall);
                    
                    for (let j = 0; j < datas.length; j++) {
                        let fakeWallData = datas[j].fakeWall;

                        if (fakeWallData.id === fakeWallID) {
                            if (mode === FakeWallManager.UpdateMode.Delete) {
                                datas.splice(j, 1);

                                chk = true;
                                break;
                            } else {
                                fakeWallData.position.x = fakeWall.position.x;
                                fakeWallData.position.z = fakeWall.position.z;
                                fakeWallData.scale.x = fakeWall.scale.x;
                                fakeWallData.rotation.y = fakeWall.rotation.y;

                                chk = true;
                                break;
                            }
                        }
                    }

                    if (chk)
                        continue;
                }

                if (fakeWall && mode) {
                    datas.push({
                        fakeWall: fakeWall,
                        id: FakeWallManager.getWallID(fakeWall),
                        zoneID: zoneID,
                        mode: mode
                    });

                    dataCount++;
                }
            }
        }

        if (dataCount > 0) {
            this.saveFakeWalls(datas, postMethod, sdms, saveResult);
        }
        else {
            this.onPostSave(sdms, postMethod, saveResult, null, false);
        }
    }

    setFakeWallIDs(ids, datas) {
        const dataCount = datas.length;
        const idCount = ids.length;

        if (dataCount === idCount) {
            for (let i = 0; i < dataCount; i++) {
                const fakeWall = datas[i].fakeWall;
                FakeWallManager.changeWallName(fakeWall, ids[i]);
                //fakeWall.id = ids[i];
            }
        }
    }

    async saveFakeWalls(datas, postMethod, sdms, saveResult) {
        const result = await SDMSController.requestUpdateFakeWalls(datas);

        if (result && result.success) {
            this.setFakeWallIDs(result.iDs, datas);
            this.clearFakeWalls();

            // 저장 후 OriginFakeWalls 다시 불러오기 - K.D.R
            this.fakeWallManager.reloadFakeWalls();

            this.onPostSave(sdms, postMethod, saveResult, null, true);
            /*if (postMethod) {
                postMethod();
            }

            sdms.showConfirmDialog("확인", ["저장되었습니다."], null, null);*/
        }
        else {
            this.onPostSave(sdms, postMethod, saveResult, result ? result.message : "가벽 정보 저장에 실패하였습니다.", false);
            //sdms.showConfirmDialog("에러", [result.message], null, null);
        }
    }

    cancleFakeWall() {
        // 가벽 추가 중 취소했다면 생성 중인 가벽 삭제
        if (this.fakeWallManager) {
            this.fakeWallManager.cancleFakeWall();
        } 
    }

    cancleEquipZoneArea() {
        // 영역 추가 중 취소했다면 생성 중인 영역 삭제 및 초기화
        if (this.equipZoneAreaManager) {
            this.equipZoneAreaManager.cancleEquipZoneArea();
        } 
    }

    saveSensorDatas(sdms, postMethod, saveResult) {
        const sensorPositions = [];
        let dataCount = 0;

        for (const sensorType in this.editSensors) {
            const sensors = this.editSensors[sensorType];

            for (const sensorID in sensors) {
                const [poi, zoneID, originSensor] = sensors[sensorID];

                if (poi) {
                    const sensorInfo = SDMS.getSensorInfo(poi);

                    if (sensorInfo[2] !== null) {
                        const obj = poi.object ? poi.object : poi;

                        sensorPositions.push({
                            sensorType: sensorType,
                            zoneID: zoneID,
                            sensorID: sensorInfo[2],
                            x: obj.position.x,
                            y: obj.position.y,
                            z: obj.position.z,
                            text: obj.userData.text
                        });

                        dataCount++;
                    }
                }
            }
        }

        if (dataCount > 0) {
            this.saveSensors(sensorPositions, postMethod, sdms, saveResult);
        }
        else {
            this.onPostSave(sdms, postMethod, saveResult, null, false);
        }
    }

    async saveSensors(sensorPositions, postMethod, sdms, saveResult) {
        const [result, message] = await SDMSController.requestUpdatePOIPositions(sensorPositions);

        if (result) {
            this.applyTo3DOptions();
            this.clearSensors();

            this.onPostSave(sdms, postMethod, saveResult, null, true);
            /*if (postMethod) {
                postMethod();
            }

            sdms.showConfirmDialog("확인", ["저장되었습니다."], null, null);*/
        }
        else {
            this.onPostSave(sdms, postMethod, saveResult, message, false);
            //sdms.showConfirmDialog("에러", [message], null, null);
        }
    }

    async setSensorForCCTVGroup(poi, postMethod, postErrorMethod, contents3D) {
        this.cctvGroupDatas = [];

        if (!poi) {
            this.sensorForCCTVGroup = null;
            postMethod(null, null, null, null);
            return;
        }

        if (this.sensorForCCTVGroup === poi) {
            return;
        }

        const [sensorType, zoneID, sensorID] = SDMS.getSensorInfo(poi);

        if (!sensorType || !zoneID || !sensorID) {
            return;
        }

        if (TextPOIManager.isTextPOI(sensorType)) {
            return;
        }

        this.sensorForCCTVGroup = poi;

        const result = await SDMSController.requestEquipZoneCCTVListFromSensor(sensorType, sensorID);

        if (result) {
            if (result.success) {
                if ((result.equipZoneID === 0 || result.equipZoneID) && result.equipZoneDisplayName) {
                    this.setOriginEquipZoneCCTVGroup(result.equipZoneID, result.equipZoneCCTV);

                    // 이미 수정된 구역별 cctv 리스트가 있다면 적용하기 - K.D.R
                    let equipZoneCCTV = Object.assign({}, result.equipZoneCCTV);

                    let editCCTVList = this.getEquipZoneCCTVGroup(result.equipZoneID);
                    if (editCCTVList !== null && editCCTVList !== undefined) {
                        let cctv1 = parseInt(editCCTVList[0]);
                        if (cctv1 !== NaN)
                            equipZoneCCTV.cctV1 = cctv1;

                        let cctv2 = parseInt(editCCTVList[1]);
                        if (cctv2 !== NaN)
                            equipZoneCCTV.cctV2 = cctv2;

                        let cctv3 = parseInt(editCCTVList[2]);
                        if (cctv3 !== NaN)
                            equipZoneCCTV.cctV3 = cctv3;

                        let cctv4 = parseInt(editCCTVList[3]);
                        if (cctv4 !== NaN)
                            equipZoneCCTV.cctV4 = cctv4;
                    }
                    
                    this.cctvGroupDatas = [result.equipZoneID, result.equipZoneDisplayName, this.getEquipZoneCCTVList(equipZoneCCTV)];
                    contents3D.poiManager.selectEquipZoneCCTVs(equipZoneCCTV);
                    postMethod(poi, this.cctvGroupDatas[0], this.cctvGroupDatas[1], this.cctvGroupDatas[2]);
                }
            }
            else {
                postMethod(null, null, null, null);
                postErrorMethod("오류", result.message);
            }
        }
    }

    getEquipZoneCCTVList(equipZoneCCTV) {
        if (!equipZoneCCTV) {
            return "";
        }

        let cctvList = "";

        if (equipZoneCCTV.cctV1 !== null && equipZoneCCTV.cctV1 !== undefined) {
            cctvList = equipZoneCCTV.cctV1;

            if (equipZoneCCTV.cctV2 !== null && equipZoneCCTV.cctV2 !== undefined) {
                cctvList += "," + equipZoneCCTV.cctV2;

                if (equipZoneCCTV.cctV3 !== null && equipZoneCCTV.cctV3 !== undefined) {
                    cctvList += "," + equipZoneCCTV.cctV3;

                    if (equipZoneCCTV.cctV4 !== null && equipZoneCCTV.cctV4 !== undefined) {
                        cctvList += "," + equipZoneCCTV.cctV4;
                    }
                }
            }
        }

        return cctvList;
    }

    setOriginEquipZoneCCTVGroup(equipZoneID, equipZoneCCTV) {
        const cctvList = [null, null, null, null, null, null];

        if (equipZoneCCTV) {
            if (equipZoneCCTV.cctV1 !== null && equipZoneCCTV.cctV1 !== undefined) {
                cctvList[0] = equipZoneCCTV.cctV1;
            }

            if (equipZoneCCTV.cctV2 !== null && equipZoneCCTV.cctV2 !== undefined) {
                cctvList[1] = equipZoneCCTV.cctV2;
            }

            if (equipZoneCCTV.cctV3 !== null && equipZoneCCTV.cctV3 !== undefined) {
                cctvList[2] = equipZoneCCTV.cctV3;
            }

            if (equipZoneCCTV.cctV4 !== null && equipZoneCCTV.cctV4 !== undefined) {
                cctvList[3] = equipZoneCCTV.cctV4;
            }

            if (equipZoneCCTV.cctV5 !== null && equipZoneCCTV.cctV5 !== undefined) {
                cctvList[4] = equipZoneCCTV.cctV5;
            }

            if (equipZoneCCTV.cctV6 !== null && equipZoneCCTV.cctV6 !== undefined) {
                cctvList[5] = equipZoneCCTV.cctV6;
            }
        }

        this.editOriginCCTVGroups[equipZoneID] = cctvList;
    }

    setEquipZoneCCTVGroup(equipZoneID, cctv1, cctv2, cctv3, cctv4) {
        let cctvGroup = this.editCCTVGroups[equipZoneID];

        if (cctvGroup) {
            cctvGroup[0] = cctv1;
            cctvGroup[1] = cctv2;
            cctvGroup[2] = cctv3;
            cctvGroup[3] = cctv4;
        }
        else {
            cctvGroup = [cctv1, cctv2, cctv3, cctv4, null, null];
            this.editCCTVGroups[equipZoneID] = cctvGroup;
        }
    }

    getEquipZoneCCTVGroup(equipZoneID) {
        return this.editCCTVGroups[equipZoneID];
    }

    addNewCCTVPOI(poi, zoneID, poiManager) {
        let pois = this.newCCTVPOIs[zoneID];
        this.poiManager = poiManager;

        if (!pois) {
            pois = [];
            this.newCCTVPOIs[zoneID] = pois;
        }

        pois.push(poi);
    }

    deleteNewCCTVPOI(cctvID, zoneID) {
        const pois = this.newCCTVPOIs[zoneID];

        if (pois) {
            const poiCount = pois.length;

            for (let i = 0; i < poiCount; i++) {
                const poi = pois[i];
                const [sensorType, zoneID, sensorID] = SDMS.getSensorInfo(poi);

                if (cctvID === sensorID) {
                    pois.splice(i, 1);
                    return;
                }
            }
        }
    }

    addDeleteCCTVPOI(cctv, zoneID, poiManager) {
        this.poiManager = poiManager;
        let cctvs = this.deleteCCTVPOIs[zoneID];

        if (!cctvs) {
            cctvs = [];
            this.deleteCCTVPOIs[zoneID] = cctvs;
        }

        cctvs.push(cctv);
    }

    insertDeleteCCTVs(cctvList) {
        const cctvCount = cctvList.length;
        const cctvMap = {};

        for (let i = 0; i < cctvCount; i++) {
            const cctv = cctvList[i];
            cctvMap[cctv.id] = cctv;
        }

        const addingList = [];
        const deleteCCTVPOIs = { ...this.deleteCCTVPOIs };

        for (const zoneID in deleteCCTVPOIs) {
            const zoneCCTVs = [...deleteCCTVPOIs[zoneID]];
            const zoneCCTVCount = zoneCCTVs.length;

            for (let i = 0; i < zoneCCTVCount; i++) {
                const zoneCCTV = zoneCCTVs[i];

                if (!cctvMap[zoneCCTV.id]) {
                    addingList.push(zoneCCTV);
                }
            }
        }

        const addingCount = addingList.length;

        for (let i = 0; i < addingCount; i++) {
            cctvList.push(addingList[i]);
        }
    }

    setEquipZoneAreaManager(equipZoneAreaManager) {
        this.equipZoneAreaManager = equipZoneAreaManager;
    }

    addEquipZoneAreaData(area, mode, zoneID, equipZoneAreaManager) {
        this.equipZoneAreaManager = equipZoneAreaManager;

        let zoneDatas = this.editEquipZoneAreas[zoneID];

        if (!zoneDatas) {
            zoneDatas = [];
            this.editEquipZoneAreas[zoneID] = zoneDatas;
        }

        const dataCount = zoneDatas.length;

        for (let i = 0; i < dataCount; i++) {
            const equipZoneAreaData = zoneDatas[i];

            // 같은 equipZoneID 처리
            if (equipZoneAreaData[0].equipZoneID === area.equipZoneID) {
                zoneDatas[i] = [area, mode];
                return;
            }
        }
        
        zoneDatas.push([area, mode]);
    }

    clearEquipZoneAreas() {
        this.editEquipZoneAreas = [];
    }

    saveEquipZoneAreaDatas(sdms, postMethod, saveResult) {
        const datas = [];
        let dataCount = 0;

        for (const zoneID in this.editEquipZoneAreas) {
            const equipZoneAreaDatas = this.editEquipZoneAreas[zoneID];
            const equipZoneAreaCount = equipZoneAreaDatas.length;

            let chk = false;

            for (let i = 0; i < equipZoneAreaCount; i++) {
                const [equipZoneArea, mode] = equipZoneAreaDatas[i];

                if (equipZoneArea && mode) {
                    datas.push({
                        lines: equipZoneArea.lines,
                        zoneID: equipZoneArea.zoneID,
                        equipZoneID: equipZoneArea.equipZoneID,
                        mode: mode
                    });

                    dataCount++;
                }
            }
        }

        if (dataCount > 0) {
            this.saveEquipZoneAreas(datas, postMethod, sdms, saveResult);
        }
        else {
            this.onPostSave(sdms, postMethod, saveResult, null, false);
        }
    }

    async saveEquipZoneAreas(datas, postMethod, sdms, saveResult) {
        const result = await SDMSController.requestUpdateEquipZoneAreas(datas);

        if (result && result.success) {
            this.clearEquipZoneAreas();

            // 저장 후 OriginEquipZoneAreas 다시 불러오기
            if (this.equipZoneAreaManager)
                this.equipZoneAreaManager.reloadEquipZoneAreas();

            this.onPostSave(sdms, postMethod, saveResult, null, true);
        }
        else {
            this.onPostSave(sdms, postMethod, saveResult, result ? result.message : "영역 정보 저장에 실패하였습니다.", false);
        }

    }

    setOriginEquipZoneAreas(zoneID, equipZoneAreas) {
        let areas = [];

        for (let i = 0; i < equipZoneAreas?.length; i++) {
            const equipZoneAreaData = equipZoneAreas[i];

            const equipZoneArea = {
                "equipZoneID": equipZoneAreaData.equipZoneID,
                "equipZoneName": equipZoneAreaData.equipZoneName,
                "zoneID": equipZoneAreaData.zoneID,
                "lines": equipZoneAreaData.lines,
            };

            areas.push(equipZoneArea);
        }

        this.originEquipZoneAreas[zoneID] = areas;
    }

    saveSensorEquipZoneDatas(sdms, postMethod, saveResult) {
        const datas = [];
        let dataCount = 0;

        for (const sensorType in this.editSensorEquipZones) {
            const sensors = this.editSensorEquipZones[sensorType];

            for (const data in sensors) {
                const sensorID = parseInt(data);
                if (sensorID !== NaN) {
                    const [equipZoneID, zoneID] = sensors[sensorID];

                    datas.push({
                        sensorType: sensorType,
                        sensorID: sensorID,
                        equipZoneID: equipZoneID,
                        zoneID: zoneID
                    });

                    dataCount++;
                }
            }
        }

        if (dataCount > 0) {
            this.saveSensorEquipZones(datas, postMethod, sdms, saveResult);
        }
        else {
            this.onPostSave(sdms, postMethod, saveResult, null, false);
        }
    }

    async saveSensorEquipZones(datas, postMethod, sdms, saveResult) {
        const result = await SDMSController.requestUpdateSensorEquipZones(datas);

        //if (result && result.success) {
        //    this.clearEquipZoneAreas();

        //    // 저장 후 OriginEquipZoneAreas 다시 불러오기
        //    if (this.equipZoneAreaManager)
        //        this.equipZoneAreaManager.reloadEquipZoneAreas();

        //    this.onPostSave(sdms, postMethod, saveResult, null, true);
        //}
        //else {
        //    this.onPostSave(sdms, postMethod, saveResult, result ? result.message : "영역 정보 저장에 실패하였습니다.", false);
        //}

    }

    movePoiMode() {
        return this.poiEditMode === EditModeManager.MoveIcon;
    }

    checkPoiMode() {
        return this.poiEditMode === EditModeManager.CheckIcon;
    }

    deletePoiMode() {
        return this.poiEditMode === EditModeManager.DeleteIcon;
    }

    checkNDeletePoiMode() {
        return this.poiEditMode === EditModeManager.CheckNDelete;
    }

    changeEquipZonePoiMode() {
        return (this.poiEditMode === EditModeManager.ChangeEquipZone ||
            this.poiEditMode === EditModeManager.ChangeEquipZone_OneClick);
    }
}
