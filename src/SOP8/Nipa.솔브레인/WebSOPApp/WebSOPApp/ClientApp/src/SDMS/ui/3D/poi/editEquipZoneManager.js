export class EditEquipZoneManager {
    constructor(editModeManager) {
        this.editModeManager = editModeManager;

        // key : equipZoneNo
        this.changedEquipZoneNames = {};
        this.editingLabel = null;
    }

    set3dMaster(_3dMaster) {
        this._3dMaster = _3dMaster;
    }

    changeEquipZoneName(equipZoneNo, equipZoneName, zoneNo) {
        if (this.editModeManager?.spatialManager) {
            const zone = this.editModeManager.spatialManager.getZone(zoneNo);

            if (zone) {
                for (const equipZoneData of zone.equipmentZoneDatas) {
                    if (equipZoneData.equipZoneNo === equipZoneNo) {
                        if (equipZoneName === equipZoneData.displayText) {
                            // 원래 이름과 같다면...
                            delete this.changedEquipZoneNames[equipZoneNo];
                            return;
                        }

                        break;
                    }
                }

                this.changedEquipZoneNames[equipZoneNo] = { equipZoneName, zoneNo };
            }
        }
    }

    isEmpty() {
        const changedEquipZoneNames = { ...this.changedEquipZoneNames };

        for (const equipZoneNo in changedEquipZoneNames) {
            return false;
        }

        return true;
    }

    getChangedEquipZoneNames() {
        return { ...this.changedEquipZoneNames };
    }

    reset() {
        const changedEquipZoneNames = { ...this.changedEquipZoneNames };

        if (this._3dMaster?.textPoiManager) {
            for (const _equipZoneNo in changedEquipZoneNames) {
                const equipZoneNo = parseInt(_equipZoneNo);
                const label = this._3dMaster.textPoiManager.getEquipZoneTextLabel(equipZoneNo);

                if (label) {
                    this._3dMaster.textPoiManager.rollbackEquipZoneText(label, equipZoneNo);
                }
            }
        }

        this.changedEquipZoneNames = {};
    }

    clear() {
        this.changedEquipZoneNames = {};
    }

    setEditingLabel(label) {
        this.editingLabel = label;
    }

    getEditingLabel() {
        return this.editingLabel;
    }
}
