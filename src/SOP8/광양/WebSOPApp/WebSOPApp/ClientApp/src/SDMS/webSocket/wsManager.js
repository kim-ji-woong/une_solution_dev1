
import wsProcessManager from "./wsProcessManager";


export default class wsManager {
    constructor(port) {
        
        // OnMessage 정보 전달용 객체
        this.sdms = null;
        this.titleBar = null;
        
        this.processManager = new wsProcessManager();
        
        this.port = port;
        
        const wsUri = "ws://127.0.0.1:" + port + "/";
        this.websocket = new WebSocket(wsUri);
        this.connected = false;
        
        const wsMgr = this;
        this.messageBuffer = [];
        
        this.websocket.onopen = (event) => {
            wsMgr.connected = true;
            wsMgr.checkBuffers();
            console.log("WebSocket connection opened");
        }
        
        this.websocket.onclose = (event) => {
            wsMgr.connected = false;
            console.log("WebSocket connection closed");
        }

        this.websocket.onmessage = (evt) => {
            // 문자열이 아닌 경우 처리하지 않음
            if (typeof evt.data !== "string") return;

            try {
                let json = null;
                if (typeof evt.data === "string") {
                    try {
                        json = JSON.parse(evt.data);
                    } catch (e) {
                        return;
                    }
                } else if (typeof evt.data === "object") {
                    // Handle object type if necessary
                }

                if (json && json.header !== null && json.header !== undefined) {
                    const header = json.header;
                    const content = json.content || {};

                    console.log("Received Message : " + json.header + " : " + JSON.stringify(json.content));

                    this.handleMessage(header, content);
                }
            }
            catch(e) {
                // 파싱 오류 시 무시
                console.log("메시지 파싱 오류:", e);
            }
            
        }

        this.websocket.onerror = (evt) => {
            console.log("WebSocket Error : " + evt.data);
        }
    }
    
    setSdms = (sdms) => {
        this.sdms = sdms;
        this.processManager.setSdms(sdms);
    }

    getSDMS = () => {
        return this.sdms;
    }
    
    getTitleBar = () => {
        return this.titleBar;
    }
    
    setTitleBar = (titleBar) => {
        this.titleBar = titleBar;
        // wsProcessManager 사용시 객체 전달 필요
    }

    checkBuffers = () => {
        for (const message of this.messageBuffer) {
            this.sendMessage(message[0], message[1]);
        }

        this.messageBuffer = [];
    }
    
    /*
    -- AppToWeb 
    */
    handleMessage = (header, content) => {
        if (header === undefined || header === null) {
            return;
        }
        
        if (header === wsManager.appToWeb.SelectPOI) {
            return this.processManager.responseSelectPOI(content);
        } else if (header === wsManager.appToWeb.RequestSpaceList) {
            
        } else if (header === wsManager.appToWeb.RequestPOIList) {
            //return this.processManager.responsePOIList(this);
        } else if (header === wsManager.appToWeb.ResponseCameraLocation) {
            return this.processManager.processCameraLocation(content);
        } else if (header === wsManager.appToWeb.ResponseMeasuredDistance) {
            return this.processManager.processMeasuredDistance(content);
        } else if (header === wsManager.appToWeb.KeymapProhibited) {
            return this.processManager.processKeymapProhibited(content);
        } else if (header === wsManager.appToWeb.CloseCCTVPopup) {
            return this.processManager.processCloseCCTVPopup();
        } else if (header === wsManager.appToWeb.SendDiffusionHoursInfo) {
            return this.processManager.processSendDiffusionHoursInfo(content);
        } else if (header === wsManager.appToWeb.ResponseDiffusionData) {
            return this.processManager.processResponseDiffusionData(content);
        } else if (header === wsManager.appToWeb.PlayEnd) {
            return this.processManager.processPlayEnd();
        } else if (header === wsManager.appToWeb.StartLoading) {
            return this.processManager.processLoadingProps(header);
        } else if (header === wsManager.appToWeb.UpdateLoading) {
            return this.processManager.processLoadingProps(header, content)
        } else if (header === wsManager.appToWeb.EndLoading) {
            return this.processManager.processLoadingProps(header)
        } else if (header === wsManager.appToWeb.RequestAutoRotationSettings) {
            return this.processManager.processRequestAutoRotationSettings();
        } else if (header === wsManager.appToWeb.ResponseAlarmLayerSettings) {
            return this.processManager.processResponseAlarmLayerSettings();
        }
    }
    
    //#region Header List 
    static webToApp = {
        header: {
            
            /* Monitoring */
            ShowAlarm: 1,
            VisiblePOICategory: 2,
            SelectPOI: 3,
            ResponsePOIList: 12,

            /* Nav Tool */
            MoveToInitialScreen: 21,
            RequestCameraLocation: 22,
            Zoom: 23,
            AutoRotation: 24,
            
            /* Mode */
            MeasurementMode: 31,
            EndMeasurement: 32,
            ShiftPressed: 33,
            DeletePressed: 34,
            ChangeView: 35,

            /* Status */
            CheckLogin: 41,
            CheckLogout: 42,
            CheckExit: 43,
            CheckMenuState: 44,

            /* Etc */
            ClosePopup: 51,
            ResponseAutoRotationSettings: 52,
            ResponseAlarmLayerSettings: 53,
            ResponseOpenUrl: 55,
            WeatherEffect: 56,
            LightEffect: 57,
            WeatherStatement: 58,

            /* Simulator */
            DiffusionSimulationMode: 61,
            SendDiffusionInfo: 62,
            PlayDiffusionSimulation: 63,
            StopDiffusionSimulation: 64,
            DiffusionSimulationTimeChanged: 65,
            DiffusionHeightVisibleCategory: 66,
            
        }
    }
    
    static appToWeb = {
        /* Monitoring */
        SelectPOI: 1,
        
        /* Data */
        RequestSpaceList: 11,
        RequestPOIList: 12,
        
        /* Nav Tool */
        ResponseCameraLocation: 21,
        ResponseMeasuredDistance: 22,
        KeymapProhibited: 23,
        
        /* Status */
        StartLoading: 31,
        UpdateLoading: 32,
        EndLoading: 33,
        
        /* Etc */
        CloseCCTVPopup: 41,
        RequestAutoRotationSettings : 42,
        ResponseAlarmLayerSettings: 43,

        /* Simulator */
        SendDiffusionHoursInfo: 51,
        ResponseDiffusionData: 52,
        PlayEnd: 53

    }
    //#endregion

    sendMessage = (header, parameter) => {
        if (!this.connected) { // 연결이 안되어있으면 무반응
            return;
        }

        let json = {
            "header": header
        }

        if (parameter !== null && parameter !== undefined) {
            // 객체 내의 문자열화된 JSON 찾아 객체로 변환
            if (typeof parameter === "object") {
                // 깊은 복사를 통해 원본 객체 보존
                const processedParam = JSON.parse(JSON.stringify(parameter));

                // 객체 속성 중 JSON 문자열이 있는지 확인
                for (const key in processedParam) {
                    if (typeof processedParam[key] === 'string') {
                        try {
                            // JSON 문자열 형태인지 확인
                            if (processedParam[key].startsWith('{') && processedParam[key].endsWith('}')) {
                                const parsed = JSON.parse(processedParam[key]);
                                processedParam[key] = parsed; // 문자열을 객체로 변환
                            }
                        } catch (e) {
                            // 파싱 실패 시 원본 유지
                        }
                    }
                }
                json["content"] = processedParam;
            } else {
                json["content"] = parameter;
            }
        }

        this.websocket.send(JSON.stringify(json));
    }

    // webToApp 1
    sendShowAlarm = (poi) => {
        this.sendMessage(wsManager.webToApp.header.ShowAlarm, poi)
    }

    // webToApp 2
    sendVisiblePOICategory = (type) => {
        this.sendMessage(wsManager.webToApp.header.VisiblePOICategory, type)
    }
    
    // webToApp 3
    sendSelectPOI = (poi) => { 
        this.sendMessage(wsManager.webToApp.header.SelectPOI, poi);
    }
    
    // webToApp 12
    sendResponsePOIList = (poiList) => {
        this.sendMessage(wsManager.webToApp.header.ResponsePOIList, poiList);
    }
    
    
    // webToApp 21
    sendMoveToInitialScreen = (location) => {
        // location이 문자열이면 객체로 파싱
        if (typeof location === 'string') {
            try {
                location = JSON.parse(location);
            } catch (e) {
                // 파싱 실패 시 원본 유지
                console.log("JSON 파싱 실패:", e);
                return;
            }
        }
        this.sendMessage(wsManager.webToApp.header.MoveToInitialScreen, location);
    }
    
    // webToApp 22
    sendRequestCameraLocation = () => {
        this.sendMessage(wsManager.webToApp.header.RequestCameraLocation, null);
    }
    
    // webToApp 23
    sendZoom = (zoom) => {
        this.sendMessage(wsManager.webToApp.header.Zoom, zoom);
    }
    
    // webToApp 24
    sendAutoRotation = (autoRotation) => {
        this.sendMessage(wsManager.webToApp.header.AutoRotation, autoRotation);
    }
    
    // webToApp 31
    sendMeasurementMode = (mode) => {
        this.sendMessage(wsManager.webToApp.header.MeasurementMode, mode);
    }
    
    // webToApp 41
    sendCheckLogin = () => {
        this.sendMessage(wsManager.webToApp.header.CheckLogin, null)
    }

    // webToApp 42
    sendCheckLogout = () => {
        this.sendMessage(wsManager.webToApp.header.CheckLogout, null)
    }

    // webToApp 43
    sendCheckExit = () => {
        this.sendMessage(wsManager.webToApp.header.CheckExit, null)
    }

    // webToApp 44
    sendCheckMenuState = (menuState) => {
        this.sendMessage(wsManager.webToApp.header.CheckMenuState, menuState);
    }
    
    // webToApp 51
    sendClosePopup = () => {
        this.sendMessage(wsManager.webToApp.header.ClosePopup, null);
    }
    
    // webToApp 52
    sendResponseAutoRotationSettings = (content) => {
        this.sendMessage(wsManager.webToApp.header.ResponseAutoRotationSettings, content);
    }
    
    // webToApp 53
    sendResponseAlarmLayerSettings = (content) => {
        this.sendMessage(wsManager.webToApp.header.ResponseAlarmLayerSettings, content);
    }
    
    // webToApp 55
    sendOpenUrl = (url) => {
        this.sendMessage(wsManager.webToApp.header.ResponseOpenUrl, url);
    }
    
    // webToApp 56
    sendWeatherEffect = (effect) => {
        this.sendMessage(wsManager.webToApp.header.WeatherEffect, effect);
    }
    
    // webToApp 57
    sendLightEffect = (effect) => {
        this.sendMessage(wsManager.webToApp.header.LightEffect, effect);
    }
    
    // webToApp 58
    sendWeatherStatement = (statement) => {
        this.sendMessage(wsManager.webToApp.header.WeatherStatement, statement);
    }
    
    //#region
    
    // webToApp 61
    sendDiffusionSimulationMode = (mode) => {
        this.sendMessage(wsManager.webToApp.header.DiffusionSimulationMode, mode);
    }
    
    // webToApp 62
    sendDiffusionInfo = (diffusionInfo) => {
        this.sendMessage(wsManager.webToApp.header.SendDiffusionInfo, diffusionInfo);
    }
    
    // webToApp 63
    sendPlayDiffusionSimulation = () => {
        this.sendMessage(wsManager.webToApp.header.PlayDiffusionSimulation, null);
    }
    
    // webToApp 64
    sendStopDiffusionSimulation = () => {
        this.sendMessage(wsManager.webToApp.header.StopDiffusionSimulation, null);
    }
    
    // webToApp 65
    sendDiffusionSimulationTimeChanged = (time) => {
        this.sendMessage(wsManager.webToApp.header.DiffusionSimulationTimeChanged, time);
    }
    
    // webToApp 66
    sendDiffusionHeightVisibleCategory = (category) => {
        this.sendMessage(wsManager.webToApp.header.DiffusionHeightVisibleCategory, category);
    }
    
    //#endregion
}