import StatusInfo from "../../Main/ui/popups/statusInfo";
import wsProcessManager from "./wsProcessManager";

export default class wsManager {
    constructor(port) {
        this.wsProcessManager = new wsProcessManager();

        // WebSocket이 정상적으로 통신하기 위해선 App의 서버가 먼저 실행중이어야 한다.
        const wsUri = "ws://127.0.0.1:" + port + "/";
        this.webSocket = new WebSocket(wsUri);
        this.connected = false;
        this.main = null;

        const wsMgr = this;
        this.messageBuffers = [];

        this.webSocket.onopen = (e) => {
            wsMgr.connected = true;
            wsMgr.checkBuffers();
        }

        this.webSocket.onclose = (e) => {
            wsMgr.connected = false;
        }

        this.webSocket.onmessage = (e) => {
            const json = e.data;

            if (json.length > 0) {
                try {
                    const obj = JSON.parse(json);

                    if (obj) {
                        for (const key in obj) {
                            wsMgr.onMessage(key.toLowerCase(), obj[key]);
                            break;
                        }
                    }
                }
                catch (e) {
                }
            }
        }

        this.webSocket.onerror = (e) => {
            console.log("webSocket error : " + e.data);
        }

        this.currentViewMode = wsManager.mode3D.none;
    }

    close() {
        this.webSocket.close();
    }

    static webToApp = {
        header: {
            // 특정 DataCenter를 로딩한다.
            loadDataCenter: "loadDataCenter",
            responseRackList: "responseRackList",
            responseItemList: "responseItemList",
            responseRackTypeList: "responseRackTypeList",
            responseItemTypeList: "responseItemTypeList",
            setLayerState: "setLayerState",
            selectRack: "selectRack",
            selectItem: "selectItem",
            goOriginViewport: "goOriginViewport",
            zoom: "zoom",
            autoRotation: "autoRotation",
            open360Camera: "open360Camera",
            showAlarm: "showAlarm",
            viewMode: "viewMode",
            responseAlarmList: "responseAlarmList",
            showThermalData: "showThermalData",
            closePopup: "closePopup"
        }
    };

    static appToWeb = {
        header: {
            requestRackList: "requestracklist",
            requestItemList: "requestitemlist",
            requestRackTypeList: "requestracktypelist",
            requestItemTypeList: "requestitemtypelist",
            requestLayerState: "requestlayerstate",
            selectRack: "selectrack",
            selectItem: "selectitem",
            open360Camera: "open360camera",
            requestAlarmList: "requestalarmlist",
            showFacilityInfo: "showfacilityinfo"
        }
    };

    static mode3D = {
        fps: 1,
        birdView: 2,
        edit: 3,
        editITProperty: 4,
        newRegist: 5,
        modelCompare: 6,
        none: 7
    }

    static layer = {
        temperature: 1,
        signal: 2,
        electric: 3,
        nameTag: 4,
        wall: 5,
        tray: 6,
        facility: 7
    }

    static unitOfLength = {
        mm: 0,
        cm: 1,
        m: 2,
        km: 3
    }

    static layerTypeNameToID(typeName) {
        if (typeName === StatusInfo.poi_menu.temperature) {
            return wsManager.layer.temperature;
        }
        else if (typeName === StatusInfo.poi_menu.nameTag) {
            return wsManager.layer.nameTag;
        }
        else if (typeName === StatusInfo.poi_menu.wall) {
            return wsManager.layer.wall;
        }
        else if (typeName === StatusInfo.poi_menu.tray) {
            return wsManager.layer.tray;
        }
        else if (typeName === StatusInfo.poi_menu.facility) {
            return wsManager.layer.facility;
        }

        return null;
    }

    sendMessage(name, value) {
        if (!this.connected) {
            this.messageBuffers.push([name, value]);
            return;
        }

        const obj = {};
        obj[name] = value;
        this.webSocket.send(JSON.stringify(obj));
    }

    checkBuffers() {
        for (const message of this.messageBuffers) {
            this.sendMessage(message[0], message[1]);
        }

        this.messageBuffers = [];
    }

    onMessage(name, value) {
        if (name === wsManager.appToWeb.header.requestRackList) {
            this.wsProcessManager.onResponseRackList(value, this);
        }
        else if (name === wsManager.appToWeb.header.requestItemList) {
            this.wsProcessManager.onResponseItemList(value, this);
        }
        else if (name === wsManager.appToWeb.header.requestRackTypeList) {
            this.wsProcessManager.onResponseRackTypeList(this);
        }
        else if (name === wsManager.appToWeb.header.requestItemTypeList) {
            this.wsProcessManager.onResponseItemTypeList(this);
        }
        else if (name === wsManager.appToWeb.header.requestLayerState) {
            this.wsProcessManager.onResponseLayerState(this);
        }
        else if (name === wsManager.appToWeb.header.selectRack) {
            this.wsProcessManager.selectRack(value, this);
        }
        else if (name === wsManager.appToWeb.header.selectItem) {
            this.wsProcessManager.selectItem(value, this);
        }
        else if (name === wsManager.appToWeb.header.open360Camera) {
            this.wsProcessManager.open360Camera(value, this);
        }
        else if (name === wsManager.appToWeb.header.requestAlarmList) {
            this.wsProcessManager.requestAlarmList(value, this);
        }
        else if (name === wsManager.appToWeb.header.showFacilityInfo) {
            this.wsProcessManager.showFacilityInfo(value, this);
        }
    }

    setMain(main) {
        this.main = main;
    }

    loadDataCenter(dataCenterNo) {
        this.sendMessage(wsManager.webToApp.header.loadDataCenter, { "dataCenterNo": dataCenterNo });
    }

    setLayerState(layerStates) {
        const datas = [];

        for (const layerType in layerStates) {
            const layerNo = wsManager.layerTypeNameToID(layerType);
            
            const onOff = layerStates[layerType] ? true : false;
            datas.push({
                "layerNo": layerNo,
                "visible": onOff
            });
        }

        this.sendMessage(wsManager.webToApp.header.setLayerState, datas);
    }

    selectRack(rackNo) {
        this.sendMessage(wsManager.webToApp.header.selectRack, { "rackNo": rackNo });
    }

    selectItem(itemNo) {
        this.sendMessage(wsManager.webToApp.header.selectItem, { "itemNo": itemNo });
    }

    goOriginViewport() {
        this.sendMessage(wsManager.webToApp.header.goOriginViewport, null);
    }

    zoom(zoomValue) {
        this.sendMessage(wsManager.webToApp.header.zoom, zoomValue);
    }

    autoRotation(value) {
        this.sendMessage(wsManager.webToApp.header.autoRotation, value);
    }

    open360Camera(dataCenterNo, url) {
        const data = {
            "dataCenterNo": dataCenterNo,
            "url": url
        };

        this.sendMessage(wsManager.webToApp.header.open360Camera, data);
    }

    showAlarm(rackNo, itemNo) {
        const data = {
            "rackNo": rackNo,
            "itemNo": itemNo
        };

        this.sendMessage(wsManager.webToApp.header.showAlarm, data);
    }

    setViewMode(personalView) {
        const data = {
            "viewMode": {
                "personalView": personalView
            }
        };

        this.sendMessage(wsManager.webToApp.header.viewMode, data);
    }

    showThermalData(dataCenterNo, visible) {
        const data = {
            "showThermalData": {
                "dataCenterNo": dataCenterNo,
                "visible": visible
            }
        };

        this.sendMessage(wsManager.webToApp.header.showThermalData, data);
    }

    closePopup() {
        const data = {
            "closePopup": null
        };

        this.sendMessage(wsManager.webToApp.header.closePopup, data);
    }
}