
// 소켓 통신시 로직 처리 클래스
import {ExternalController} from "../services/externalController";

import store from "../../Root/store";

import SdmsResource from "../resource/id";
import ProjectResource from "../../Root/resource/id";
import {SettingController} from "../../Settings/services/settingController";
import socketStore from "./socketStore";
import simulationStore from "../simulationStore";
import {AccountController} from "../../Account/services/accountController";

export default class wsProcessManager {
    
    constructor() {
        this.sdms = null;
    }
    
    setSdms = (sdms) => {
        this.sdms = sdms;
    }
    
    responseSelectPOI = (content) => {
        if (this.sdms) {
            if (content) {
                return this.sdms.functions.setSelectPOI(content[0].nodeID, content[0].sensorType);
            }
            else
                return console.log("appToWeb header 1 : content.POI is not valid");
        }
        else 
            return console.error("SDMS is not defined in wsProcessManager");
    }
    
    processCameraLocation = async (content) => {
        if (!content) {
            return;
        }
        
        let obj = {};
        
        const element = {
            "siteNo": ProjectResource.site_sn,
            "name": "InitialViewport",
            "value": JSON.stringify(content)
        } 
        
        obj.categoryType = "SDMS";
        obj.settingDatas = [element];
        
        const parameter = {
            "categories": [obj]
        }
        
        const [result, message] = await SettingController.requestSave(parameter);
        
        if (result) {
            this.sdms.functions.showConfirmDialog(ProjectResource.dialogTypes.INFO, ["카메라 위치가 저장되었습니다.", null, null]);
        } else {
            this.sdms.functions.showConfirmDialog(ProjectResource.dialogTypes.ERROR, ["카메라 위치 저장에 실패했습니다.", null, null]);
        }
        
    }

    processMeasuredDistance = (content) => {
        if (!content)
            return null;
        
        socketStore.dispatch({type: "MEASUREMENT_RESULT", measurementResult: content});
        
    }
    
    processKeymapProhibited = (content) => {
        return this.sdms.functions.showConfirmDialog(ProjectResource.dialogTypes.INFO, ["현재 모드는 키맵이 비활성화되어 있습니다.", null, null]);
    }
    
    processCloseCCTVPopup = () => {
        return this.sdms.functions.closeCCTVPopup();
    }
    
    processSendDiffusionHoursInfo = (content) => {
        if (!content) {
            return this.sdms.functions.showConfirmDialog(ProjectResource.dialogTypes.ERROR, ["잘못된 시뮬레이션 시간정보입니다.", null, null]);
        }
        simulationStore.dispatch({ type: "HOURS_INFO", hoursInfo: content });
    }

    processResponseDiffusionData = (content) => {
        if (!content) {
            return this.sdms.functions.showConfirmDialog(ProjectResource.dialogTypes.ERROR, ["잘못된 확산 시뮬레이션 데이터입니다.", null, null]);
        }
        simulationStore.dispatch({ type: "DIFFUSION_DATA", diffusionData: content });
    }
    
    processPlayEnd = () => {
        simulationStore.dispatch({type: "PLAY_END", playEnd: true });
    }
    
    processLoadingProps = (header, content) => {
        this.sdms.functions.processLoading(header, content)
    }

    processRequestAutoRotationSettings = async () => {
        const userInfo = ProjectResource.getUserInfo();
        
        if (!userInfo)
            return;
        
        const [userOptions, message] = await AccountController.requestOptions(userInfo.user_sn, "sdms", "idleTime");
        
        if (!userOptions)
            return;
        
        const wsMgr = socketStore.getState().wsMgr;
        if (wsMgr.connected) {
            const idleTime = userOptions.find(o => o.subCategory === "idleTime");
            
            let content = {
                "autoRotation": {
                    "active": 0,
                    "time": "15"
                }
            }
            
            const [time, use] = idleTime?.values.split(':');
            
            if (!idleTime) {
                content.autoRotation.active = 0;
                content.autoRotation.time = "15";
            } else {
                content.autoRotation.active = use === "true" ? 1 : 0;
                content.autoRotation.time = time;
            }
            
            wsMgr.sendResponseAutoRotationSettings(content);
        }
    }

    processResponseAlarmLayerSettings = async () => {
        const userInfo = ProjectResource.getUserInfo();
        if (!userInfo)
            return;
        
        const [sdmsOptions, message] = await SettingController.requestSetting(userInfo.site_sn, "SDMS", null);
        
        if (!sdmsOptions)
            return;
        
        const settingDatas = sdmsOptions[0]?.settingDatas;
        if (!settingDatas)
            return;

        const useReceiveItems = settingDatas.filter(item => item.name.includes("UseReceive"));

        let sendOptions = { 
            "allowEvents": []
        };
        
        for (const item of useReceiveItems) {
            if (item.name.includes("Atmosphere")) {
                const element = {
                    "poiType": 1,
                    "value": item.value === "true" ? 1 : 0
                }
                sendOptions.allowEvents.push(element);
            } else if (item.name.includes("Water")) {
                const element = {
                    "poiType": 3,
                    "value": item.value === "true" ? 1 : 0
                }
                sendOptions.allowEvents.push(element);
            } else if (item.name.includes("WaterDisaster")) {
                const element = {
                    "poiType": 4,
                    "value": item.value === "true" ? 1 : 0
                }
                sendOptions.allowEvents.push(element);
            }
        }
        
        const wsMgr = socketStore.getState().wsMgr;
        if (wsMgr.connected) {
            wsMgr.sendResponseAlarmLayerSettings(sendOptions);
        }
    }
}