import ProjectResource from "../../Root/resource/id";
import store from "../../Root/store";
import { JsonManager } from "./jsonManager";
import { isEqual } from 'lodash';

export class MainController {
    static timerCheck = false;
    static timerWeather = 0;
    static timerAlarm = 0;

    static StartWatchTimer(dataCenterNo) {
        // 타이머 실행 유무 판단
        if (this.timerCheck)
            return false;

        // 타이머 실행 체크
        this.timerCheck = true;

        // 1초에 한번씩 실행 - 날씨 정보
        MainController.timerWeather = setTimeout(async function tick() {
            await MainController.WatchWeatherCheck(dataCenterNo);
            MainController.timerWeather = setTimeout(tick, 1000);
        }, 1000);

        // 1초에 한번씩 실행 - 알람 정보
        MainController.timerAlarm = setTimeout(async function tick() {
            await MainController.WatchAlarmCheck(dataCenterNo);
            MainController.timerAlarm = setTimeout(tick, 1000);
        }, 1000);

        return true;
    }

    static stopWatchTimer() {
        MainController.timerCheck = false;

        if (MainController.timerWeather > 0) {
            clearTimeout(MainController.timerWeather);
            MainController.timerWeather = 0;
            store.dispatch({ type: 'WEATHER_CURRENT', weatherDatas: {} });
        }

        if (MainController.timerAlarm > 0) {
            clearTimeout(MainController.timerAlarm);
            MainController.timerAlarm = 0;
            store.dispatch({ type: 'SENSOR_ALARM', sensorAlarm: [] });
        }
    }

    static async WatchWeatherCheck(dataCenterNo) {
        const [result, message] = await MainController.requestCurrentWeather(dataCenterNo);

        if (message) {
            store.dispatch({ type: 'WEATHER_CURRENT', weatherDatas: {} });
        }
        else if (result) {
            let currentDatas = store.getState().weatherDatas;
            let compare = isEqual(currentDatas, result);
            if (!compare) {
                store.dispatch({ type: 'WEATHER_CURRENT', weatherDatas: result });
            }
        }
    }

    static async WatchAlarmCheck(dataCenterNo) {
        const [result, message] = await MainController.requestAlarmList(dataCenterNo);
        
        if (message) {
            console.log(message);
        }
        else if (result) {
            let currentDatas = store.getState().sensorAlarm;
            let compare = isEqual(currentDatas, result);
            if (!compare) {
                store.dispatch({ type: 'SENSOR_ALARM', sensorAlarm: result });
            }
        }
    }

    static async requestCurrentWeather(dataCenterNo) {
        try {
            const jsonData = JsonManager.makeRequestCurrentWeather(dataCenterNo);

            const res = await fetch(ProjectResource.baseUrl + '/api/Main/RequestCurrentWeather', {
                method: 'post',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                },
                body: jsonData
            });

            if (res.ok) {
                const result = await res.json();

                if (result.success) {
                    return [result.weather, result.message];
                }
                else {
                    return [null, result.message];
                }
            }
        }
        catch (e) {
            console.log(e);
        }

        return [null, "requestCurrentWeather 호출에 실패하였습니다."];
    }

    static async requestRackGroupList(dataCenterNo, companyNo = null, type = null, unit = null, searchText = null, pageIndex = null, pageItemCount = null) {
        try {
            const jsonData = JsonManager.makeRequestRackGroupList(dataCenterNo, companyNo, type, unit, searchText, pageIndex, pageItemCount);

            const res = await fetch(ProjectResource.baseUrl + '/api/Main/RequestRackGroupList', {
                method: 'post',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                },
                body: jsonData
            });

            if (res.ok) {
                const result = await res.json();

                if (result.success) {
                    return [result.rackGroups, result.totalCount, result.message];
                }
                else {
                    return [null, 0, result.message];
                }
            }
        }
        catch (e) {
            console.log(e);
        }

        return [null, 0, "requestRackGroupList 호출에 실패하였습니다."];
    }

    static async requestRackItemList(rackNo, categoryName = null, equipmentTypeName = null, companyNo = null, type = null, unit = null, searchText = null, pageIndex = null, pageItemCount = null) {
        try {
            const jsonData = JsonManager.makeRequestRackItemList(rackNo, categoryName, equipmentTypeName, companyNo, type, unit, searchText, pageIndex, pageItemCount);

            const res = await fetch(ProjectResource.baseUrl + '/api/Main/RequestRackItemList', {
                method: 'post',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                },
                body: jsonData
            });

            if (res.ok) {
                const result = await res.json();

                if (result.success) {
                    return [result.items, result.totalCount, result.message];
                }
                else {
                    return [null, 0, result.message];
                }
            }
        }
        catch (e) {
            console.log(e);
        }

        return [null, 0, "requestRackItemList 호출에 실패하였습니다."];
    }

    static async requestDataCenterRackItemList(dataCenterNo, categoryName = null, equipmentTypeName = null, companyNo = null, type = null, unit = null, searchText = null, pageIndex = null, pageItemCount = null) {
        try {
            const jsonData = JsonManager.makeRequestDataCenterRackItemList(dataCenterNo, categoryName, equipmentTypeName, companyNo, type, unit, searchText, pageIndex, pageItemCount);

            const res = await fetch(ProjectResource.baseUrl + '/api/Main/RequestDataCenterRackItemList', {
                method: 'post',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                },
                body: jsonData
            });

            if (res.ok) {
                const result = await res.json();

                if (result.success) {
                    return [result.items, result.totalCount, result.message];
                }
                else {
                    return [null, 0, result.message];
                }
            }
        }
        catch (e) {
            console.log(e);
        }

        return [null, 0, "requestDataCenterRackItemList 호출에 실패하였습니다."];
    }

    // 자산의 온도와 소모전력을 얻어온다.
    static async requestItemData(itemNo) {
        try {
            const jsonData = JsonManager.makeRequestItemData(itemNo);

            const res = await fetch(ProjectResource.baseUrl + '/api/Main/RequestItemData', {
                method: 'post',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                },
                body: jsonData
            });

            if (res.ok) {
                const result = await res.json();

                if (result.success) {
                    return [result.itemData, result.message];
                }
                else {
                    return [null, result.message];
                }
            }
        }
        catch (e) {
            console.log(e);
        }

        return [null, "requestItemData 호출에 실패하였습니다."];
    }

    static async requestSensorList(dataCenterNo) {
        try {
            const jsonData = JsonManager.makeRequestSensorList(dataCenterNo);

            const res = await fetch(ProjectResource.baseUrl + '/api/Main/RequestSensorList', {
                method: 'post',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                },
                body: jsonData
            });

            if (res.ok) {
                const result = await res.json();

                if (result.success) {
                    return [result.sensors, result.message];
                }
                else {
                    return [null, result.message];
                }
            }
        }
        catch (e) {
            console.log(e);
        }

        return [null, "requestSensorList 호출에 실패하였습니다."];
    }

    static async requestRackTypeList(companyNo = null, type = null, unit = null, searchText = null, pageIndex = null, pageItemCount = null) {
        try {
            const jsonData = JsonManager.makeRequestRackTypeList(companyNo, type, unit, searchText, pageIndex, pageItemCount);

            const res = await fetch(ProjectResource.baseUrl + '/api/Main/RequestRackTypeList', {
                method: 'post',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                },
                body: jsonData
            });

            if (res.ok) {
                const result = await res.json();

                if (result.success) {
                    return [result.rackTypes, result.totalCount, result.message];
                }
                else {
                    return [null, 0, result.message];
                }
            }
        }
        catch (e) {
            console.log(e);
        }

        return [null, "requestRackTypeList 호출에 실패하였습니다."];
    }

    static async requestItemTypeList(categoryName = null, equipmentTypeName = null, companyNo = null, type = null, unit = null, searchText = null, pageIndex = null, pageItemCount = null) {
        try {
            const jsonData = JsonManager.makeRequestItemTypeList(categoryName, equipmentTypeName, companyNo, type, unit, searchText, pageIndex, pageItemCount);

            const res = await fetch(ProjectResource.baseUrl + '/api/Main/RequestItemTypeList', {
                method: 'post',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                },
                body: jsonData
            });

            if (res.ok) {
                const result = await res.json();

                if (result.success) {
                    return [result.itemTypes, result.totalCount, result.message];
                }
                else {
                    return [null, 0, result.message];
                }
            }
        }
        catch (e) {
            console.log(e);
        }

        return [null, "requestItemTypeList 호출에 실패하였습니다."];
    }

    static async requestRackFilterList() {
        try {
            const jsonData = JsonManager.makeRequestRackFilterList();

            const res = await fetch(ProjectResource.baseUrl + '/api/Main/RequestRackFilterList', {
                method: 'post',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                },
                body: jsonData
            });

            if (res.ok) {
                const result = await res.json();

                if (result.success) {
                    return [result, result.message];
                }
                else {
                    return [null, result.message];
                }
            }
        }
        catch (e) {
            console.log(e);
        }

        return [null, "requestRackFilterList 호출에 실패하였습니다."];
    }

    static async requestItemFilterList() {
        try {
            const jsonData = JsonManager.makeRequestItemFilterList();

            const res = await fetch(ProjectResource.baseUrl + '/api/Main/RequestItemFilterList', {
                method: 'post',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                },
                body: jsonData
            });

            if (res.ok) {
                const result = await res.json();

                if (result.success) {
                    return [result, result.message];
                }
                else {
                    return [null, result.message];
                }
            }
        }
        catch (e) {
            console.log(e);
        }

        return [null, "requestItemFilterList 호출에 실패하였습니다."];
    }

    static async requestAlarmList(dataCenterNo) {
        try {
            const jsonData = JsonManager.makeRequestAlarmList(dataCenterNo);

            const res = await fetch(ProjectResource.baseUrl + '/api/Main/RequestAlarmList', {
                method: 'post',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                },
                body: jsonData
            });

            if (res.ok) {
                const result = await res.json();

                if (result.success) {
                    return [result.alarms, result.message];
                }
                else {
                    return [null, result.message];
                }
            }
        }
        catch (e) {
            console.log(e);
        }

        return [null, "requestAlarmList 호출에 실패하였습니다."];
    }

    static async request360CameraUrl(dataCenterNo) {
        try {
            const jsonData = JsonManager.makeRequest360CameraUrl(dataCenterNo);

            const res = await fetch(ProjectResource.baseUrl + '/api/Main/Request360CameraUrl', {
                method: 'post',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                },
                body: jsonData
            });

            if (res.ok) {
                const result = await res.json();

                if (result.success) {
                    return [result.url, result.message];
                }
                else {
                    return [null, result.message];
                }
            }
        }
        catch (e) {
            console.log(e);
        }

        return [null, "request360CameraUrl 호출에 실패하였습니다."];
    }

    static async requestFacilityInfo(facilityNo) {
        try {
            const jsonData = JsonManager.makeRequestFacilityInfo(facilityNo);

            const res = await fetch(ProjectResource.baseUrl + '/api/Main/RequestFacilityInfo', {
                method: 'post',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                },
                body: jsonData
            });

            if (res.ok) {
                const result = await res.json();

                if (result.success) {
                    return [result.imagePath, result.message];
                }
                else {
                    return [null, result.message];
                }
            }
        }
        catch (e) {
            console.log(e);
        }

        return [null, "requestFacilityInfo 호출에 실패하였습니다."];
    }
}