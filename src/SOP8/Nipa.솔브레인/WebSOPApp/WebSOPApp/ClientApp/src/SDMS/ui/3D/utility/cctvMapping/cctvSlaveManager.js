import SdmsResource from "../../../../resource/id";
import { SDMSController } from "../../../../services/sdmsController";
import { PoiManager } from "../../poi/poiManager";

export class CctvSlaveManager {
    static EquipZoneType = 'nameTag';
    static SensorZoneType = 'sensor';

    static onClickPoi(poi, _3dMaster) {
        const [zoneNo, sensorNo, sensorType] = PoiManager.parseSensorKey(poi);

        const poiManager = _3dMaster.poiManager;
        const editModeManager = _3dMaster.editModeManager;
        const spatialManager = _3dMaster.props.spatialManager;
        const cctvMappingManager = _3dMaster.props.cctvMappingManager;

        if (sensorNo) {
            const masterPoi = CctvSlaveManager._getMasterPoi(poiManager);

            if (masterPoi) {
                const [_zoneNo, masterSensorNo, _sensorType] = PoiManager.parseSensorKey(masterPoi);

                if (masterSensorNo === sensorNo) {
                    // Master Poi를 Click하였다.
                    return;
                }
                else {
                    if (CctvSlaveManager._isSlavePoi(cctvMappingManager, masterSensorNo, sensorNo)) {
                        // Slave Poi를 Click하였다.
                        // Slave 목록에서 삭제한다.
                        CctvSlaveManager._removeFromSlave(_3dMaster, cctvMappingManager, masterSensorNo, sensorNo, _zoneNo);
                    }
                    else if (sensorType === SdmsResource.facilityType.CCTV) {
                        // Slave가 아닌 CCTV Poi를 Click하였다.
                        // Slave 목록에 추가한다.
                        CctvSlaveManager._addToSlave(_3dMaster, cctvMappingManager, masterSensorNo, _zoneNo, sensorNo, spatialManager, zoneNo, sensorType);
                    }
                    else {
                        // Slave도 아니고 CCTV도 아닌 Poi를 Click하였다.
                        // 새로운 Master로 설정한다.
                        CctvSlaveManager._setMaster(cctvMappingManager, editModeManager, poiManager, sensorNo, zoneNo, sensorType, poi);
                    }
                }
            }
            else {
                // 새로운 Master로 설정한다.
                CctvSlaveManager._setMaster(cctvMappingManager, editModeManager, poiManager, sensorNo, zoneNo, sensorType, poi);
            }
        }
    }

    static async _setMaster(cctvMappingManager, editModeManager, poiManager, sensorNo, zoneNo, sensorType, poi) {
        poiManager.setMasterPoi(poi);

        // 공간명이 아닌 센서 Poi가 새 Master가 되므로 기존 공간명 하이라이트는 해제한다.
        editModeManager?._3dMaster?.textPoiManager?.clearEquipZoneHighlight();

        const [cctvs, equipZoneNo, sensorZoneNo] = await CctvSlaveManager._getCctvList(cctvMappingManager, sensorNo);

        if (cctvs === null) {
            return;
        }

        if (equipZoneNo === 0 || equipZoneNo) {
            editModeManager.handleEditCCTVList(CctvSlaveManager.EquipZoneType, equipZoneNo, sensorNo);
        }
        else if (sensorZoneNo === 0 || sensorZoneNo) {
            editModeManager.handleEditCCTVList(CctvSlaveManager.SensorZoneType, sensorZoneNo, sensorNo);
        }

        editModeManager.selectMasterPoi(poi, SdmsResource.ID.poi_editSubMenu.cctv_area);
    }

    static async _getCctvList(cctvMappingManager, sensorNo) {
        const info = cctvMappingManager.getSensorBasicInfo(sensorNo);

        let equipZoneNo = null;
        let sensorZoneNo = null;
        let cctvs = null;

        if (!info) {
            const [_cctvs, _equipZoneNo, _sensorZoneNo, message] = await SDMSController.requestCCTVListFromSensor(sensorNo);

            if (_cctvs === null) {
                return [null, null, null];
            }

            equipZoneNo = _equipZoneNo;
            sensorZoneNo = _sensorZoneNo;
            cctvs = _cctvs;
        }
        else {
            equipZoneNo = info.equipZoneNo;
            sensorZoneNo = info.sensorZoneNo;
            cctvs = cctvMappingManager.getMappingCctvs(sensorNo);
        }

        return [cctvs, equipZoneNo, sensorZoneNo];
    }

    static _addToSlave(_3dMaster, cctvMappingManager, masterSensorNo, masterZoneNo, sensorNo, spatialManager, zoneNo, sensorType) {
        const info = cctvMappingManager.getSensorBasicInfo(masterSensorNo);

        if (!info) {
            return;
        }

        const sensor = spatialManager.getZoneSensor2(zoneNo, sensorNo, sensorType);

        if (!sensor?.cctv) {
            return;
        }

        const cctvs = cctvMappingManager.getMappingCctvs(masterSensorNo);
        const len = cctvs.length;

        if (len >= 4) {
            cctvs.splice(0, 1);
        }

        const cctv = { ...sensor.cctv };
        cctv.cameraName = sensor.sensor?.sensor_name;

        cctvs.push(cctv);

        let type = null;
        let _zoneNo = null;

        if (info.equipZoneNo === 0 || info.equipZoneNo) {
            type = CctvSlaveManager.EquipZoneType;
            _zoneNo = info.equipZoneNo;
            //cctvMappingManager.setEquipZoneCctvs(masterSensorNo, info.equipZoneNo, cctvs);
        }
        else if (info.sensorZoneNo === 0 || info.sensorZoneNo) {
            type = CctvSlaveManager.SensorZoneType;
            _zoneNo = info.sensorZoneNo;
            //cctvMappingManager.setSensorZoneCctvs(masterSensorNo, info.sensorZoneNo, cctvs);
        }
        else {
            return;
        }

        CctvSlaveManager._setEditCCTVList(_3dMaster, cctvs, _zoneNo, masterSensorNo, type);
    }

    static _removeFromSlave(_3dMaster, cctvMappingManager, masterSensorNo, sensorNo, masterZoneNo) {
        const info = cctvMappingManager.getSensorBasicInfo(masterSensorNo);

        if (!info) {
            return;
        }

        const cctvs = cctvMappingManager.getMappingCctvs(masterSensorNo);
        const len = cctvs.length;

        for (let i = 0; i < len; i++) {
            const cctv = cctvs[i];

            if (cctv.sensor_sn === sensorNo) {
                cctvs.splice(i, 1);
                break;
            }
        }

        let type = null;
        let zoneNo = null;

        if (info.equipZoneNo === 0 || info.equipZoneNo) {
            type = CctvSlaveManager.EquipZoneType;
            zoneNo = info.equipZoneNo;
            //cctvMappingManager.setEquipZoneCctvs(masterSensorNo, info.equipZoneNo, cctvs);
        }
        else if (info.sensorZoneNo === 0 || info.sensorZoneNo) {
            type = CctvSlaveManager.SensorZoneType;
            zoneNo = info.sensorZoneNo;
            //cctvMappingManager.setSensorZoneCctvs(masterSensorNo, info.sensorZoneNo, cctvs);
        }
        else {
            return;
        }

        CctvSlaveManager._setEditCCTVList(_3dMaster, cctvs, zoneNo, masterSensorNo, type);
    }

    // zoneNo : equipZoneNo 또는 sensorZoneNo
    static _setEditCCTVList(_3dMaster, cctvs, zoneNo, sensorNo, type) {
        _3dMaster.props.setEditCCTVList({ type, zoneNo, cctvList: cctvs }, sensorNo);
    }

    static _isSlavePoi(cctvMappingManager, masterSensorNo, sensorNo) {
        const cctvs = cctvMappingManager.getMappingCctvs(masterSensorNo);

        for (const cctv of cctvs) {
            if (cctv.sensor_sn === sensorNo) {
                return cctvs;
            }
        }

        return null;
    }

    static _getMasterPoi(poiManager) {
        return poiManager.selectedPoi;
    }
}