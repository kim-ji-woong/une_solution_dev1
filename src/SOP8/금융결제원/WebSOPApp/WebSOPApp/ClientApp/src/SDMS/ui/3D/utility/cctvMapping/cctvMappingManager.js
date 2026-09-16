import { SDMSController } from "../../../../services/sdmsController";

export class CctvMappingManager {
    constructor() {
        // key : sensorNo
        // value : equipZoneNo에 연결되었는지 sensorZoneNo에 연결되었는지 정보
        this.sensorBasicInfos = {};
        // key : sensorZoneNo
        // value : cctv object array
        this.sensorZoneCctvs = {};
        this.originSensorZoneCctvs = {};
        // key : equipZoneNo
        // value : cctv object array
        this.equipZoneCctvs = {};
        this.originEquipZoneCctvs = {};
        this.currentSensorNo = null;
    }

    setSensorZoneCctvs(sensorNo, sensorZoneNo, cctvs, isOrigin) {
        this._setSensorBasicInfo(sensorNo, sensorZoneNo, null);
        this.sensorZoneCctvs[sensorZoneNo] = cctvs;
        this.currentSensorNo = sensorNo;

        if (isOrigin) {
            this.originSensorZoneCctvs[sensorZoneNo] = [...cctvs];
        }
    }

    setEquipZoneCctvs(sensorNo, equipZoneNo, cctvs, isOrigin) {
        this._setSensorBasicInfo(sensorNo, null, equipZoneNo);
        this.equipZoneCctvs[equipZoneNo] = cctvs;
        this.currentSensorNo = sensorNo;

        if (isOrigin) {
            this.originEquipZoneCctvs[equipZoneNo] = [...cctvs];
        }
    }

    getMappingCctvs(sensorNo) {
        const info = this.getSensorBasicInfo(sensorNo);

        if (!info) {
            return [];
        }

        let cctvs = null;

        if (info.sensorZoneNo === 0 || info.sensorZoneNo) {
            cctvs = this.sensorZoneCctvs[info.sensorZoneNo];
        }
        else if (info.equipZoneNo === 0 || info.equipZoneNo) {
            cctvs = this.equipZoneCctvs[info.equipZoneNo];
        }

        if (cctvs) {
            return cctvs;
        }

        return [];
    }

    getCurrentSensorNo() {
        return this.currentSensorNo;
    }

    clearCurrentSensorNo() {
        this.currentSensorNo = null;
    }

    clear() {
        this.sensorBasicInfos = {};
        this.sensorZoneCctvs = {};
        this.equipZoneCctvs = {};
        this.originSensorZoneCctvs = {};
        this.originEquipZoneCctvs = {};
        this.currentSensorNo = null;
    }

    getSensorBasicInfo(sensorNo) {
        if (sensorNo === 0 || sensorNo) {
            return this.sensorBasicInfos[sensorNo];
        }

        return null;
    }

    isChanged() {
        if (this._isChanged(this.originSensorZoneCctvs, this.sensorZoneCctvs)) {
            return true;
        }

        if (this._isChanged(this.originEquipZoneCctvs, this.equipZoneCctvs)) {
            return true;
        }

        return false;
    }

    async save() {
        const changedEquipZoneCctvs = this._getChangedEquipZonevCctvs();

        if (this._isEmpty(changedEquipZoneCctvs) === false) {
            const [success, message] = await SDMSController.saveEquipZoneCCTVList(changedEquipZoneCctvs);

            if (!success) {
                console.log(message);
                return [success, message];
            }
            else {
                this.originEquipZoneCctvs = { ...this.equipZoneCctvs };
            }
        }

        const changedSensorZoneCctvs = this._getChangedSensorZonevCctvs();

        if (this._isEmpty(changedSensorZoneCctvs) === false) {
            const [success, message] = await SDMSController.saveSensorZoneCCTVList(changedSensorZoneCctvs);

            if (!success) {
                console.log(message);
                return [success, message];
            }
            else {
                this.originSensorZoneCctvs = { ...this.sensorZoneCctvs };
            }
        }

        if (this.saveNClear) {
            this.clear(false);
        }

        return [true, ""];
    }

    _isEmpty(changedCctvs) {
        for (const key in changedCctvs) {
            return false;
        }

        return true;
    }

    _getChangedEquipZonevCctvs() {
        return this._getChangedCctvs(this.originEquipZoneCctvs, this.equipZoneCctvs);
    }

    _getChangedSensorZonevCctvs() {
        return this._getChangedCctvs(this.originSensorZoneCctvs, this.sensorZoneCctvs);
    }

    _getChangedCctvs(originCctvs, currentCctvs) {
        const updateDatas = {};

        const _originCctvs = { ...originCctvs };
        const _currentCctvs = { ...currentCctvs };

        for (const key in originCctvs) {
            const originCctvs = _originCctvs[key];
            const cctvs = _currentCctvs[key];

            if (!cctvs) {
                updateDatas[key] = [];
                continue;
            }

            const len1 = originCctvs.length;
            const len2 = cctvs.length;

            if (len1 !== len2) {
                updateDatas[key] = cctvs;
                continue;
            }

            for (let i = 0; i < len1; i++) {
                const cctv1 = originCctvs[i];

                if (this._findCctv(cctv1.sensor_sn, cctvs) === null) {
                    updateDatas[key] = cctvs;
                    break;
                }
            }
        }

        for (const key in _currentCctvs) {
            const cctvs = _currentCctvs[key];
            const originCctvs = _originCctvs[key];

            if (!originCctvs) {
                updateDatas[key] = cctvs;
            }
        }

        return updateDatas;
    }

    _isChanged(originCctvs, currentCctvs) {
        const _originCctvs = { ...originCctvs };
        const _currentCctvs = { ...currentCctvs };

        for (const key in originCctvs) {
            const originCctvs = _originCctvs[key];
            const cctvs = _currentCctvs[key];

            if (!cctvs) {
                return true;
            }

            const len1 = originCctvs.length;
            const len2 = cctvs.length;

            if (len1 !== len2) {
                return true;
            }

            for (let i = 0; i < len1; i++) {
                const cctv1 = originCctvs[i];

                if (this._findCctv(cctv1.sensor_sn, cctvs) === null) {
                    return true;
                }
            }
        }

        for (const key in _currentCctvs) {
            const cctvs = _currentCctvs[key];
            const originCctvs = _originCctvs[key];

            if (!originCctvs) {
                return true;
            }
        }

        return false;
    }

    _findCctv(sensorNo, cctvs) {
        for (const cctv of cctvs) {
            if (cctv?.sensor_sn === sensorNo) {
                return cctv;
            }
        }

        return null;
    }

    _setSensorBasicInfo(sensorNo, sensorZoneNo, equipZoneNo) {
        let info = this.sensorBasicInfos[sensorNo];

        if (!info) {
            info = {
                sensorZoneNo: null,
                equipZoneNo: null
            };

            this.sensorBasicInfos[sensorNo] = info;
        }

        info.sensorZoneNo = sensorZoneNo;
        info.equipZoneNo = equipZoneNo;
    }
}