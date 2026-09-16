import { useEffect, useRef, useState } from "react";
import Contents3D from "../../SDMS/ui/3D/contents3D";
import store from "../../Root/store";

export function useSDMSAlarms({
    onOpenEventPopup,
    onSelectAlarmTarget,
    onShowEventDashboard,
    onMoveToOrigin,
    shouldMoveByAlarm,
    setEditModeAlarmCount
}) {
    const [sensorAlarm, _setSensorAlarms] = useState({
        alarms: store.getState().sensorAlarm,
        selectedAlarm: null
    });

    const alarmRef = useRef(sensorAlarm);

    useEffect(() => {
        alarmRef.current = sensorAlarm;
    }, [sensorAlarm]);

    /* ===============================
     * Utils
     * =============================== */

    const getNewAlarm = (alarms) => {
        const prev = alarmRef.current?.alarms ?? [];

        if (alarms.length <= prev.length) {
            return null;
        }

        return (
            alarms
                .filter(a => a.isAlarm)
                .sort((a, b) => new Date(b.dtTime) - new Date(a.dtTime))[0] ?? null
        );
    };

    // 가장 최근에 발생한 알람을 얻어온다.
    const getLatestAlarm = (alarms) => {
        return alarms.find(a => a.isAlarm) ?? null;
    };

    // 가장 최근에 종료된 알람을 얻어온다.
    const getLatestClosingAlarm = (alarms) => {
        return alarms.find(a => !a.isAlarm) ?? null;
    };

    const makeSensorAlarms = (alarms, selectedAlarm) => {
        // 알람 선택에 의하여 해당 공간으로 이동한 상태인가?
        if (selectedAlarm && selectedAlarm.movedAlarm === undefined) {
            // 알람 발생에 의한 자동이동을 막는다.
            // 자동 이동시키려면 false로 바꾸면 된다.
            selectedAlarm.movedAlarm = !shouldMoveByAlarm?.(selectedAlarm);
        }

        return {
            alarms,
            selectedAlarm
        };
    };

    /* ===============================
     * Main Logic
     * =============================== */

    const changeAlarm = (data) => {
        if (!Contents3D.initAlarmOptions) {
            Contents3D.tempAlarms = data;

            // 알람옵션을 읽기전에는 처리하지 않는다.
            return;
        }

        if (!data) return;

        // data.dtTime을 내림차순으로 정렬
        const sorted = [...data].sort(
            (a, b) => new Date(b.dtTime) - new Date(a.dtTime)
        );

        // 알람발생시 자동이동 하지않는다.
        let selectedAlarm = getNewAlarm(sorted);

        if (!selectedAlarm) {
            if (alarmRef.current?.selectedAlarm?.isAlarm) {
                selectedAlarm = alarmRef.current.selectedAlarm;
            } else {
                // 가장 최근에 발생한 알람을 얻어온다.
                selectedAlarm = getLatestAlarm(sorted);
            }
        }

        const sensorAlarms = makeSensorAlarms(sorted, selectedAlarm);

        if (selectedAlarm) {
            selectedAlarm = { ...selectedAlarm };
        }

        _setSensorAlarms(sensorAlarms);

        //_setSensorAlarms(makeSensorAlarms(sorted, selectedAlarm));

        if (selectedAlarm) {
            onOpenEventPopup?.();
            onSelectAlarmTarget?.(selectedAlarm);
        } else if (sorted.length > 0) {
            // 알람이 모두 종료되었을 경우 가장 최근에 종료된 알람이 센서알람인지 설비알람인지 구별한다.
            // 해당 알람타입의 옵션에 따라 이동옵션일 경우 외부영역으로 이동한다.
            const latestClosingAlarm = getLatestClosingAlarm(sorted);

            if (latestClosingAlarm && shouldMoveByAlarm?.(latestClosingAlarm)) {
                onMoveToOrigin?.();
            }
        }

        if (sorted.some(a => a.isAlarm)) {
            onShowEventDashboard?.();
            setEditModeAlarmCount(prev => prev + 1);
        }
    };

    /* ===============================
     * Store Subscribe
     * =============================== */

    useEffect(() => {
        const unsubscribe = store.subscribe(() => {
            const { actionType, sensorAlarm } = store.getState();

            if (actionType === "SENSOR_ALARM") {
                changeAlarm(sensorAlarm);
            }
        });

        return unsubscribe;
    }, []);

    return {
        sensorAlarm,
        _setSensorAlarms,
        changeAlarm
    };
}