import { ExternalJsonManager } from "./externalJsonManager";
import ProjectResource from "../../Root/resource/id";
import socketStore from "../webSocket/socketStore";
import SdmsResource from "../resource/id";
import JsonManager from "../../TeamEditor/services/jsonManager";
import HistoryController from "../../History/services/historyController";

export class ExternalController {
    
    static weatherTimer = null;
    static weatherTimerCheck = false;

    static WEATHER_POLL_INTERVAL_MS = 1000 * 60 * 20;
    static WEATHER_RETRY_DELAYS_MS = [5000, 15000, 30000]; // 1차/2차/3차 재시도 대기(ms)

    static StartWatchExternalWeatherData() {
        if (this.weatherTimerCheck) return;

        this.weatherTimerCheck = true;

        const weatherTick = async () => {
            if (!this.weatherTimerCheck) return;

            try {
                const result = await this.requestExternalWeatherDataWithRetry();

                if (!result) {
                    console.warn("[ExternalWeather] 데이터 수신 실패(재시도 소진). 다음 주기에 재시도합니다.");
                    return;
                }

                const wsMgr = socketStore.getState().wsMgr;
                if (wsMgr && wsMgr.connected) {
                    const weatherData = result[0];
                    const message = result[1];
                    
                    const targetWeatherData = weatherData?.find(w => w.lc_sn === SdmsResource.weatherSite.gwangyang)
                    if (targetWeatherData) {
                        const parameter = {
                            "sky": targetWeatherData.sky_status_value, // int
                            "pty": targetWeatherData.rain_status_value, // int
                        }
                        
                        wsMgr.sendWeatherStatement(parameter);
                        
                    } else {
                        console.info("[ExternalWeather] 날씨 정보를 불러올 수 없습니다.", message);
                    }
                } else {
                    console.info("[ExternalWeather] WebSocket 미연결 상태로 전송 생략.");
                }
            } catch (e) {
                console.error("[ExternalWeather] Tick 처리 중 예외:", e);
            } finally {
                if (this.weatherTimerCheck) {
                    this.weatherTimer = setTimeout(weatherTick, this.WEATHER_POLL_INTERVAL_MS);
                }
            }
        };

        return weatherTick();
    }

    static StopWatchExternalWeatherData() {
        this.weatherTimerCheck = false;

        if (this.weatherTimer) {
            clearTimeout(this.weatherTimer);
            this.weatherTimer = null;
        }

        console.info("[ExternalWeather] 폴링 중지 완료.");
    }

    static async requestExternalWeatherDataWithRetry() {
        const retryDelays = this.WEATHER_RETRY_DELAYS_MS;

        for (let attempt = 0; attempt <= retryDelays.length; attempt++) {
            const attemptNo = attempt + 1;

            try {
                const result = await this.requestExternalWeatherData();
                if (result) return result;

                console.warn(`[ExternalWeather] 요청 실패(응답 null). attempt=${attemptNo}`);
            } catch (e) {
                console.error(`[ExternalWeather] 요청 예외. attempt=${attemptNo}`, e);
            }

            if (attempt < retryDelays.length) {
                const delay = retryDelays[attempt];
                console.warn(`[ExternalWeather] ${delay}ms 후 재시도합니다. nextAttempt=${attemptNo + 1}`);
                await new Promise((resolve) => setTimeout(resolve, delay));
            }
        }

        return null;
    }
    
    static async GetExternalSensorTypes() {

        const jsonData = ExternalJsonManager.makeRequestExternalSensorTypes();

        try {
            const response = await fetch('api/GwangYang/RequestExternalSensorTypes', {
                method: 'post',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                },
                body: jsonData
            });

            if (response.ok) {
                const result = await response.json();

                if (result.success) {
                    return result.sensorTypes;
                } else {
                    console.log(result.message);
                    return null;
                }
            }
        } catch (e) {
            console.log(e);
        }

        return null;
    }

    static async GetExternalSensorCategories() {

        const jsonData = ExternalJsonManager.makeRequestExternalSensorCategories();

        try {
            const response = await fetch('api/GwangYang/RequestExternalSensorCategories', {
                method: 'post',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                },
                body: jsonData
            });

            if (response.ok) {
                const result = await response.json();

                if (result.success) {
                    return result.sensorCategories;
                } else {
                    console.log(result.message)
                    return null;
                }
            }
        } catch (e) {
            console.log(e);
        }

        return null;
    }

    static async GetExternalSensorLinks() {
        const jsonData = null;

        try {
            const response = await fetch('api/GwangYang/RequestExternalSensorLink', {
                method: 'post',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                },
                body: jsonData
            });

            if (response.ok) {
                const result = await response.json();

                if (result.success) {
                    return result.sensorLinks;
                } else {
                    console.log(result.message);
                    return null;
                }
            }
        } catch (e) {
            console.log(e);
        }
    }
    
    static async GetExternalPOIInfo() {
        const jsonData = null;

        try {
            const response = await fetch('api/GwangYang/RequestExternalPOIInfo', {
                method: 'post',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                },
                body: jsonData
            });

            if (response.ok) {
                const result = await response.json();
                return result.poiInfos;
            }
        } catch (e) {
            console.log(e);
        }
        
    }
    
    static async GetExternalSensorTypeSubTypes() {
        const jsonData = null;
        
        try {
            const response = await fetch('api/GwangYang/RequestExternalSensorTypeSubTypes', {
                method: 'post',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                },
                body: jsonData
            });

            if (response.ok) {
                const result = await response.json();

                if (result.success) {
                    return result.sensorTypeSubTypes;
                } else {
                    console.log(result.message);
                    return null;
                }
            }
        } catch(e) {
            console.log(e);
        }
    }
    
    static async GetExternalSensorHistories(nodeID) {
        const jsonData = ExternalJsonManager.makeRequestExternalSensorHistories(nodeID);

        try {
            const response = await fetch(ProjectResource.baseUrl + '/api/GwangYang/RequestExternalSensorHistories', {
                method: 'post',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                },
                body: jsonData
            });

            if (response.ok) {
                const result = await response.json();

                if (result.success) {
                    return result.sensorHistories;
                } else {
                    console.log(result.message);
                    return null;
                }
            }
        } catch (e) {
            console.log(e);
        }
    }

    static async requestSensorSubTypes() {
        try {
            const jsonData = null;

            const res = await fetch(ProjectResource.baseUrl + '/api/GwangYang/RequestSensorSubTypes', {
                method: 'post',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                },
                body: jsonData
            });

            if (res.ok) {
                const result = await res.json();
                return result.subTypes;
            }
        } catch (e) {
            console.log(e);
            return null;
        }

        return null;
    }
    
    static async requestExternalMaterialLinks () {
        try {
            const jsonData = null;
            
            const res = await fetch(ProjectResource.baseUrl + '/api/GwangYang/RequestExternalMaterialLinks', {
                method: 'post',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                },
                body: jsonData
            });
            
            if (res.ok) {
                const result = await res.json();
                return result.materialLinks;
            }
        } catch (e) {
            console.log(e);
            return null;
        }
        
        return null;
    }

    static async requestExternalWeatherData() {
        try {
            const jsonData = null;
            
            const res = await fetch(ProjectResource.baseUrl + '/api/GwangYang/RequestExternalWeatherData', {
                method: 'post',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                },
            });
            
            if (res.ok) {
                const result = await res.json();
                return [result.weatherData, result.message];
            }
        }
        catch (e) {
            console.log(e);
            return null;
        }
        
        return null;
    }

    // siteNo : null이면 전체
    static async downloadRegularTeam(siteNo = null) {
        try {
            const jsonData = JsonManager.makeRequestDownloadRegularTeam(siteNo);

            const res = await fetch('api/GwangYang/DownloadRegularTeam', {
                method: 'post',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                },
                body: jsonData
            });

            if (res.ok) {
                if (res.headers.get('content-type') === 'application/vnd.ms-excel') {
                    await HistoryController.downloadFile(res);
                    return [true, ""];
                }
                else {
                    const result = await res.json();

                    if (result.success) {
                        return [result.success, ""];
                    }
                    else {
                        return [null, result.message];
                    }
                }
            }
        } catch (e) {
            console.log(e);
        }

        return [null, "downloadRegularTeam 호출에 실패하였습니다."];
    }
}