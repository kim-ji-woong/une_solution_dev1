import { SDMSController } from "../../../services/sdmsController";
import { EditPoiManager } from "../poi/editPoiManager";
import { PoiManager } from "../poi/poiManager";
import SDMSResource from '../../../resource/id';
import { FakeWallManager } from "./fakeWallManager";
import { EditEquipZoneManager } from "../poi/editEquipZoneManager";

export class EditModeManager {
    static msg_error = 0;
    static msg_info = 1;

    constructor() {
        this.editPoiManager = new EditPoiManager(this);
        this.fakeWallManager = new FakeWallManager(this);
        this.editEquipZoneManager = new EditEquipZoneManager(this);

        this.onChange = null;
        this._messageHandler = null;
    }

    set3dMaster(_3dMaster) {
        this._3dMaster = _3dMaster;
        this.editEquipZoneManager.set3dMaster(_3dMaster);
    }

    onClick(poi, camera, editMenu, x, y, zoneNo, spatialManager, scene) {
        if (editMenu === SDMSResource.ID.menu.editMode_poi) {
            this.editPoiManager.selectPoi(poi, camera);
        }
        else if (editMenu === SDMSResource.ID.menu.editMode_fakeWall) {
            this.fakeWallManager.onClick(x, y, zoneNo, camera, spatialManager, scene);
        }

        this.spatialManager = spatialManager;

        const changed = this.isChanged();
        this.onChange?.(changed);
    }

    move(x, y, editMenu) {
        if (editMenu === SDMSResource.ID.menu.editMode_poi) {
            this.editPoiManager.move(x, y);
        }
        else if (editMenu === SDMSResource.ID.menu.editMode_fakeWall) {
            this.fakeWallManager.move(x, y);
        }
    }

    onMove(poi) {
        this.editPoiManager.onMove(poi, this.spatialManager);
    }

    quit(editMenu) {
        if (editMenu === SDMSResource.ID.menu.editMode_fakeWall) {
            this.fakeWallManager.stop();
        }
    }

    setSubMenu(editMenu, subMenu) {
        if (editMenu === SDMSResource.ID.menu.editMode_fakeWall) {
            this.fakeWallManager.changeMode(subMenu);
        }
    }

    isChanged() {
        if (this.editPoiManager.isChanged() ||
            !this.fakeWallManager.isEmptyFakeWallData() ||
            !this.editEquipZoneManager.isEmpty()) {
            return true;
        }

        return false;
    }

    resetChanges() {
        this.fakeWallManager?.reset?.();
        this.editPoiManager?.reset?.();
        this.editEquipZoneManager?.reset?.();

        if (typeof this.onChange === 'function') {
            this.onChange(false);
        }
    }

    async save(userNo) {
        const [success1, message1] = await this.editPoiManager.savePois(userNo);

        if (success1) {
            return await this.fakeWallManager.saveFakeWalls(userNo);
        }

        return [success1, message1];
    }

    setFakeWallModel(model, scene) {
        this.fakeWallManager.setModel(model, scene);
    }

    addFakeWallData(fakeWall, mode, zoneNo, fakeWallManager) {
        this.fakeWallManager = fakeWallManager;
        this.fakeWallManager.addFakeWallData(fakeWall, mode, zoneNo);
    }

    setEquipZoneText(equipZoneNo, equipZoneName, zoneNo) {
        this.editEquipZoneManager.changeEquipZoneName(equipZoneNo, equipZoneName, zoneNo);
    }

    setMessageHandler(fn) {
        this._messageHandler = fn;
    }

    showMessageBox(msgType, message) {
        if (typeof this._messageHandler === "function") {
            this._messageHandler(message);
        } else {
            console.log(message);
        }
    }
}
