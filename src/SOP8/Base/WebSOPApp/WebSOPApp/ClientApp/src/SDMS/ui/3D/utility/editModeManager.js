import { SDMSController } from "../../../services/sdmsController";
import { EditPoiManager } from "../poi/editPoiManager";
import { PoiManager } from "../poi/poiManager";

export class EditModeManager {
    constructor() {
        this.editPoiManager = new EditPoiManager(this);

        this.movedPois = [];
        this.deletedPois = [];
    }

    selectPoi(poi, camera) {
        this.editPoiManager.selectPoi(poi, camera);
    }

    move(event) {
        this.editPoiManager.move(event);
    }

    onMove(poi) {
        if (this.movedPois.includes(poi) === false) {
            this.movedPois.push(poi);
        }
    }

    isChanged() {
        if (this.movedPois.length > 0 || this.deletedPois.length > 0) {
            return true;
        }

        return false;
    }

    async save(userNo) {
        const updateDatas = [];

        for (const poi of this.movedPois) {
            const updateData = this.makeUpdateData(poi);

            updateData.x = poi.position.x;
            updateData.y = poi.position.y;
            updateData.z = poi.position.z;

            updateDatas.push(updateData);
        }

        for (const poi of this.deletedPois) {
            const updateData = this.makeUpdateData(poi);
            updateData.deleted = true;
            
            updateDatas.push(updateData);
        }

        if (updateDatas.length > 0) {
            return await SDMSController.updateSensorDatas(userNo, updateDatas);
        }

        return [true, "update할 센서가 지정되지 않았습니다."];
    }

    makeUpdateData(poi) {
        const [zoneNo, sensorNo, sensorType, sensorSubType] = PoiManager.parseSensorKey(poi);

        const updateData = {
            "sensorNo": sensorNo,
            "deleted": false
        };

        return updateData;
    }
}
