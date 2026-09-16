import { SensorSimulatorJsonManager } from "./sensorSimulatorJsonManager";

export class SensorSimulatorController {
    static async sendAlarm(sensorType, sensorZoneNo) {
        try {
            const jsonData = SensorSimulatorJsonManager.makeRequestSendSensorAlarm(sensorType, sensorZoneNo);

            const response = await fetch('api/SensorSimulator/RequestSendSensorAlarm', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json;charset=utf-8'
                },
                body: jsonData
            });

            if (response.ok) {
                const result = await response.json();

                if (result.success) {
                    return [true, ""];
                }
                else {
                    return [false, result.message];
                }
            }
        }
        catch (e) {
            console.log(e);
        }

        return [false, "sendAlarm 실패"];
    }

    static async clearAlarm(sensorType, sensorTagInfoID, sensorZoneIDs) {
        try {
            const jsonData = SensorSimulatorJsonManager.makeRequestClearSensorAlarm(sensorType, sensorTagInfoID, sensorZoneIDs);

            const response = await fetch('SDMS/SensorSimulator/RequestData', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json;charset=utf-8'
                },
                body: jsonData
            });

            if (response.ok) {
                const result = await response.json();

                if (result.success) {
                    return [result.alarmDatas, ""];
                }
                else {
                    return [null, result.message];
                }
            }
        }
        catch (e) {
            console.log(e);
        }

        return [null, "sendAlarm 실패"];
    }

    static async requestAlarmList() {
        try {
            const jsonData = SensorSimulatorJsonManager.makeRequestAlarmList();

            const response = await fetch('SDMS/SensorSimulator/RequestData', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json;charset=utf-8'
                },
                body: jsonData
            });

            if (response.ok) {
                const result = await response.json();

                if (result.success) {
                    return [result.alarms, ""];
                }
                else {
                    return [null, result.message];
                }
            }
        }
        catch (e) {
            console.log(e);
        }

        return [null, "requestAlarmList 실패"];
    }
}