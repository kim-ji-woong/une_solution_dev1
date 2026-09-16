import { MainController } from "../../Main/services/mainController";
import wsManager from "./wsManager";

export default class wsProcessManager {
    async onResponseRackList(value, wsMgr) {
        const dataCenterNo = this.getTargetValue("datacenterno", value);

        if (!dataCenterNo) {
            return;
        }

        const [rackGroups, errorMessage] = await MainController.requestRackGroupList(dataCenterNo);

        if (rackGroups) {
            const rackList = [];

            for (const rackGroup of rackGroups) {
                for (const rack of rackGroup.racks) {
                    rackList.push({
                        "rackNo": rack.rackNo,
                        "rackName": rack.rackName,
                        "rackTypeNo": rack.rackType.rackTypeNo,
                        "rotation": rack.rotation,
                        "x": rack.x,
                        "y": rack.y,
                        "z": rack.z
                    });
                }
            }

            wsMgr.sendMessage(wsManager.webToApp.header.responseRackList, rackList);
        }
        else {
            console.log(errorMessage);
        }
    }

    async onResponseItemList(value, wsMgr) {
        const dataCenterNo = this.getTargetValue("datacenterno", value);

        if (!dataCenterNo) {
            return;
        }

        const [items, totalCount, errorMessage] = await MainController.requestDataCenterRackItemList(dataCenterNo);

        if (items) {
            const itemDatas = [];

            for (const item of items) {
                itemDatas.push({
                    "rackNo": item.rackNo,
                    "itemNo": item.itemNo,
                    "itemTypeNo": item.itemType.itemTypeNo,
                    "uPos": item.uPos
                });
            }

            wsMgr.sendMessage(wsManager.webToApp.header.responseItemList, itemDatas);
        }
        else {
            console.log(errorMessage);
        }
    }

    async onResponseRackTypeList(wsMgr) {
        const [rackTypes, errorMessage] = await MainController.requestRackTypeList();

        if (rackTypes) {
            const rackTypeDatas = [];

            for (const rackType of rackTypes) {
                rackTypeDatas.push({
                    "rackTypeNo": rackType.rackTypeNo,
                    "companyNo": rackType.companyNo,
                    "companyName": rackType.company.companyName,
                    "modelName": rackType.modelName,
                    "fbxUrl": rackType.fbxUrl
                });
            }

            wsMgr.sendMessage(wsManager.webToApp.header.responseRackTypeList, rackTypeDatas);
        }
        else {
            console.log(errorMessage);
        }
    }

    async onResponseItemTypeList(wsMgr) {
        const [itemTypes, errorMessage] = await MainController.requestItemTypeList();

        if (itemTypes) {
            const itemTypeDatas = [];

            for (const itemType of itemTypes) {
                itemTypeDatas.push({
                    "itemTypeNo": itemType.itemTypeNo,
                    "itemTypeName": itemType.itemTypeName,
                    "equipmentTypeNo": itemType.equipmentTypeNo,
                    "companyNo": itemType.companyNo,
                    "companyName": itemType.company.companyName,
                    "modelName": itemType.modelName,
                    "height": itemType.height,
                    "width": itemType.width,
                    "depth": itemType.depth,
                    "unit": itemType.unit,
                    "type": itemType.type,
                    "glbUrl": itemType.glbUrl,
                    "fbxUrl": itemType.fbxUrl
                });
            }

            wsMgr.sendMessage(wsManager.webToApp.header.responseItemTypeList, itemTypeDatas);
        }
        else {
            console.log(errorMessage);
        }
    }

    onResponseLayerState(wsMgr) {
        const layerStates = {temperature: true, signal: true, electric: true, nameTag: true, wall: true, tray: true, facility: true};
        wsMgr.setLayerState(layerStates);
    }

    selectRack(value, wsMgr) {
        const rackNo = this.getTargetValue("rackno", value);
    
        if (rackNo && wsMgr?.main) {
            wsMgr.main.selectRackFromApp(rackNo);
        }
    }

    selectItem(value, wsMgr) {
        const itemNo = this.getTargetValue("itemno", value);
    
        if (itemNo && wsMgr?.main) {
            wsMgr.main.selectItemFromApp(itemNo);
        }
    }

    open360Camera(value, wsMgr) {
    }

    async requestAlarmList(value, wsMgr) {
        const dataCenterNo = value.dataCenterNo;

        if (dataCenterNo && dataCenterNo > 0) {
            const [alarmDatas, errorMessage] = await MainController.requestAlarmList(dataCenterNo);

            if (alarmDatas) {
                const alarmList = [];

                for (const alarm of alarmDatas) {
                    alarmList.push({
                        "dataCenterNo": dataCenterNo,
                        "alarms": [
                            {
                                "alarmNo": alarm.alarmNo,
                                "alarmType": alarm.alarmType,
                                "alarmTime": alarm.alarmTime,
                                "clearTime": alarm.clearTime,
                                "rackNo": alarm.rackNo,
                                "itemNo": alarm.itemNo
                            }
                        ]
                    })
                }

                wsMgr.sendMessage(wsManager.webToApp.header.responseAlarmList, alarmList);
            }
            else {
                console.log(errorMessage);
            }
        }
    }

    showFacilityInfo(value, wsMgr) {
        const facilityNo = this.getTargetValue("facilityno", value);

        if (facilityNo && wsMgr?.main) {
            wsMgr.main.showFacilityInfo(facilityNo);
        }
    }

    getTargetValue(target, obj) {
        for (const key in obj) {
            if (key.toLowerCase() === target) {
                return obj[key];
            }
        }

        return undefined;
    }
}