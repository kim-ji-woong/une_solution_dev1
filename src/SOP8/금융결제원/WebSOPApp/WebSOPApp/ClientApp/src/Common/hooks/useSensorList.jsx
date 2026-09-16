import { useEffect, useState } from 'react';
import { SDMSController } from '../../SDMS/services/sdmsController';

export const useSensorList = () => {
    const [sensorTypes, setSensorTypes] = useState([]);
    const [totalCount, setTotalCount] = useState(0);
    const [message, setMessage] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const fetchSensorList = async () => {
        try {
            setLoading(true);
            setError(null);

            const [types, count, msg] = await SDMSController.requestSensorList();

            setSensorTypes(types);
            setTotalCount(count);
            setMessage(msg);
        } catch (err) {
            setError(err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchSensorList();
    }, []);

    const updateSensorsByZone = (zoneNo, incomingSensorTypes) => {
        if (zoneNo == null || !Array.isArray(incomingSensorTypes)) return;

        const targetZoneNo = Number(zoneNo);

        // sensors가 있는 타입만 추림
        const validTypes = incomingSensorTypes.filter(
            t => Array.isArray(t.sensors) && t.sensors.length > 0
        );

        if (validTypes.length === 0) return;

        setSensorTypes(prev =>
            prev.map(prevType => {
                const matchedType = validTypes.find(
                    t => t.sensorTypeCode === prevType.sensorTypeCode
                );

                // 업데이트 대상 타입이 아니면 그대로
                if (!matchedType) {
                    return prevType;
                }

                // 새로 들어온 zone 센서만 추림
                const newZoneSensors = matchedType.sensors.filter(
                    s => Number(s.sensor.zone_sn) === targetZoneNo
                );

                if (newZoneSensors.length === 0) {
                    return prevType;
                }

                // 기존 sensors 중 해당 zone 것만 제거
                const preservedSensors = (prevType.sensors ?? []).filter(
                    s => Number(s.sensor.zone_sn) !== targetZoneNo
                );

                return {
                    ...prevType,
                    sensors: [
                        ...preservedSensors,
                        ...newZoneSensors
                    ]
                };
            })
        );
    };

    return { 
        sensorTypes, 
        totalCount, 
        message, 
        loading, 
        error,
        updateSensorsByZone,
        fetchSensorList
    };
};