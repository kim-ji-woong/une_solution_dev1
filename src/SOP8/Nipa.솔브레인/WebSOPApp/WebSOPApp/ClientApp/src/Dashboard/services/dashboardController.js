import DashboardJsonManager from './dashboardJsonManager';
import DashboardStore from '../dashboardStore';

import ProjectResource from '../../Root/resource/id';

export class DashboardController {
    static StartWatchTimer() {
        // 타이머 실행 유무 판단
        if (this.timerCheck == true)
            return;

        // 타이머 실행 체크
        this.timerCheck = true;

        // 1분에 한번씩 실행
        DashboardController.WatchWorkPermit();
        if (ProjectResource.SiteID === ProjectResource.Site.Soulbrain) {
            DashboardController.WatchWISH();
        }

        let timerWatchWorkPermit = setTimeout(async function tick() {
            await DashboardController.WatchWorkPermit();
            if (ProjectResource.SiteID === ProjectResource.Site.Soulbrain) {
                await DashboardController.WatchWISH();
            }
            timerWatchWorkPermit = setTimeout(tick, 60000);
        }, 60000);
    }

    static async WatchWorkPermit() {
        let [result, message] = await DashboardController.requestWorkPermit();

        if (result !== null && result.success === true) {
            // 값 비교 후 다를 경우 dispatch
            let workPermits = DashboardStore.getState().workPermit;

            let newPermits = new Object();
            newPermits.buildingGroupWorkPermits = result.buildingGroupWorkPermits;
            newPermits.buildingWorkPermits = result.buildingWorkPermits;
            newPermits.zoneWorkPermits = result.zoneWorkPermits;

            // 기존 데이터가 없을 경우
            if (!workPermits) {
                DashboardStore.dispatch({ type: 'WORK_PERMIT', workPermit: newPermits });
                return;
            }

            // 신규 데이터와 현재 데이터 숫자가 맞지 않을 경우
            if (workPermits?.buildingGroupWorkPermits?.length !== newPermits?.buildingGroupWorkPermits?.length ||
                workPermits?.buildingWorkPermits?.length !== newPermits?.buildingWorkPermits?.length ||
                workPermits?.zoneWorkPermits?.length !== newPermits?.zoneWorkPermits?.length) {
                DashboardStore.dispatch({ type: 'WORK_PERMIT', workPermit: newPermits });
                return;
            }

            // buildingGroup 데이터가 다를 경우
            if (newPermits?.buildingGroupWorkPermits?.length > 0 && workPermits?.buildingGroupWorkPermits?.length > 0) {
                for (const newPermit of newPermits.buildingGroupWorkPermits) {
                    const workPermit = workPermits.buildingGroupWorkPermits.find(x => x.id === newPermit.id && x.workerCount === newPermit.workerCount);

                    if (!workPermit) {
                        DashboardStore.dispatch({ type: 'WORK_PERMIT', workPermit: newPermit });
                        return;
                    }
                }
            }

             // building 데이터가 다를 경우
            if (newPermits?.buildingWorkPermits?.length > 0 && workPermits?.buildingWorkPermits?.length > 0) {
                for (const newPermit of newPermits.buildingWorkPermits) {
                    const workPermit = workPermits.buildingWorkPermits.find(x => x.id === newPermit.id && x.workerCount === newPermit.workerCount);

                    if (!workPermit) {
                        DashboardStore.dispatch({ type: 'WORK_PERMIT', workPermit: newPermits });
                        return;
                    }
                }
            }

             // zone 데이터가 다를 경우
            if (newPermits?.zoneWorkPermits?.length > 0 && workPermits?.zoneWorkPermits?.length > 0) {
                for (const newPermit of newPermits.zoneWorkPermits) {
                    const workPermit = workPermits.zoneWorkPermits.find(x => x.id === newPermit.id && x.workerCount === newPermit.workerCount);

                    if (!workPermit) {
                        DashboardStore.dispatch({ type: 'WORK_PERMIT', workPermit: newPermits });
                        return;
                    }
                }
            }
        }
       
    }

    static async requestWorkPermit() {
        try {
            const jsonData = DashboardJsonManager.makeRequestWorkPermit();

            const res = await fetch('Dashboard/Dashboard/RequestData', {
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
                    return [result, ""];
                } else {
                    return [null, result.message];
                }
            }
        }
        catch (e) {
            console.log(e);
        }

        return [null, "requestWorkPermit 실패"];
    }

    static async WatchWISH() {
        let [result, message] = await DashboardController.requestCurrentWorkPermit();

        if (result !== null && result !== undefined && result.length > 0) {
            let data = DashboardStore.getState().currentWork;

            if (data === null || data === undefined)
                DashboardStore.dispatch({ type: 'CURRENT_WORK', currentWork: result });
            else if (data.length > 0) {
                if (data[0].updateTime !== result[0].updateTime)
                    DashboardStore.dispatch({ type: 'CURRENT_WORK', currentWork: result });
            }
        }
    }

    static async requestCurrentWorkPermit() {
        try {
            const jsonData = DashboardJsonManager.makeRequestCurrentWorkPermit();

            const res = await fetch('Dashboard/Dashboard/RequestData', {
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
                    return [result.currentWorkPermits, ""];
                } else {
                    return [null, result.message];
                }
            }
        }
        catch (e) {
            console.log(e);
        }

        return [null, "requestCurrentWorkPermit 실패"];
    }

    static async requestUseSensor() {
        try {
            const jsonData = DashboardJsonManager.makeRequestUseSensor();

            const res = await fetch('Dashboard/Dashboard/RequestData', {
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
                    const sensorList = {};

                    sensorList.fireSensors = result.fireSensors;
                    sensorList.disabledFireSensors = result.disabledFireSensors;
                    sensorList.psmSensors = result.psmSensors;
                    sensorList.disabledPSMSensors = result.disabledPSMSensors;
                    sensorList.etcSensors = result.etcSensors;
                    sensorList.disabledEtcSensors = result.disabledEtcSensors;

                    sensorList.environmentSensors = result.environmentSensors;
                    sensorList.disabledEnvironmentSensors = result.disabledEnvironmentSensors;
                    sensorList.manufactureSensors = result.manufactureSensors;
                    sensorList.disabledManufactureSensors = result.disabledManufactureSensors;

                    sensorList.cctvs = result.cctVs;
                    sensorList.disabledCCTVs = result.disabledCCTVs;

                    return [sensorList, ""];
                } else {
                    return [null, result.message];
                }
            }
        }
        catch (e) {
            console.log(e);
        }

        return [null, "requestUseSensor 실패"];
    }

    static async requestTodayStatus() {
        try {
            const jsonData = DashboardJsonManager.makeRequestTodayStatus();

            const res = await fetch('Dashboard/Dashboard/RequestData', {
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

                    return [result.alarmInfos, ""];
                } else {
                    return [null, result.message];
                }
            }
        }
        catch (e) {
            console.log(e);
        }

        return [null, "requestTodayStatus 실패"];
    }

    static async requestMonthStatus() {
        try {
            const jsonData = DashboardJsonManager.makeRequestMonthStatus();

            const res = await fetch('Dashboard/Dashboard/RequestData', {
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

                    return [result.alarmInfos, ""];
                } else {
                    return [null, result.message];
                }
            }
        }
        catch (e) {
            console.log(e);
        }

        return [null, "requestMonthStatus 실패"];
    }

    static async requestWeatherWeeklyInfo() {
        try {
            const jsonData = DashboardJsonManager.makeRequestWeatherWeeklyInfo();

            const res = await fetch('Weather/Weather/RequestData', {
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
                    return [result.datas, ""];
                } else {
                    return [null, result.message];
                }
            }
        }
        catch (e) {
            console.log(e);
        }

        return [null, "requestWeatherWeeklyInfo 실패"];
    }


    static async requestGetSelectDay(userID) {
        try {
            const jsonData = DashboardJsonManager.makeRequestGetSelectDay(userID);

            const res = await fetch('Dashboard/Dashboard/RequestData', {
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

                    //return [result.alarmInfos, ""];
                } else {
                    return [null, result.message];
                }
            }
        }
        catch (e) {
            console.log(e);
        }

        return [null, "requestGetSelectDay 실패"];
    }    

    static async requestLoadSiteScores() {
        try {
            const res = await fetch('Dashboard/Dashboard/LoadSiteScores', {
                method: 'post',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                }
            });

            if (res.ok) {
                const result = await res.json();

                if (result.success) {
                    return [result.siteScores, null];
                }
                else {
                    return [null, result.message];
                }
            }
        } catch (e) {
            console.log("ERROR LoadSiteScores : " + e);
            return [null, e.message];
        }

        return [null, "requestLoadSiteScores 실패"];
    }


}