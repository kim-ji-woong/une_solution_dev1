import dashboardStore from '../../Dashboard/dashboardStore';
import { DashboardJsonManager } from './dashboardJsonManager';
import { SDMSController } from './sdmsController';
import DashboardStore from '../../Dashboard/dashboardStore';

export class DashboardController {
    static timerId = null;

    static StartWatchTimer() {
        // 이미 돌고 있으면 또 만들지 않음
        if (this.timerId) return;

        // 최초 한 번 바로 실행
        this.WatchWorkPermit();

        // 1분마다 실행
        this.timerId = setInterval(() => {
            this.WatchWorkPermit();
        }, 60000);
    }

    static async WatchWorkPermit() {
        let [result, success, message] = await SDMSController.requestCurrentWorkPermitData();

        if (!success) {
            console.log(message);
            return;
        }

        const newPermits = Array.isArray(result) ? result : [result];

        if (!newPermits || newPermits.length === 0) {
            return;
        }

        const workPermit = dashboardStore.getState().workPermit;

        // 기존 데이터가 없거나, 배열이 다르면 dispatch
        const isSame =
            Array.isArray(workPermit) &&
            JSON.stringify(workPermit) === JSON.stringify(newPermits);

        if (!workPermit || !isSame) {
            DashboardStore.dispatch({
                type: 'WORK_PERMIT',
                workPermit: newPermits
            });
        }
    }

    static stopWatchTimer() {
        if (this.timerId) {
            clearInterval(this.timerId);
            this.timerId = null;
        }
    }

    static async requestWeeklyStatus() {
        try {
            const jsonData = DashboardJsonManager.makeRequestWeeklyStatus();

            const res = await fetch('SDMS/Dashboard/RequestWeeklyStatus', {
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
                    return [result.alarmInfos, result.message];
                }
                else {
                    return [null, result.message];
                }
            }

        } catch (e) {
            console.log(e);
        }

        return [null, "requestWeeklyStatus 호출에 실패하였습니다."];
    }
}
