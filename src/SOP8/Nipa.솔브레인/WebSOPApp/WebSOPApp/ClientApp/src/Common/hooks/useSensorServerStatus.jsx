import { useEffect, useMemo, useState } from 'react';
import { SDMSController } from '../../SDMS/services/sdmsController';

export const useSensorServerStatus = () => {
    const [sensorServers, setSensorServers] = useState([]);
    const [message, setMessage] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    useEffect(() => {
        let cancelled = false;

        const fetchSensorServerStatus = async () => {
            try {
                setLoading(true);

                const [servers, msg] = await SDMSController.requestSensorServerInfo();

                if (cancelled) return;

                setSensorServers(servers || []);
                setMessage(msg || '');
            } catch (err) {
                if (!cancelled) setError(err);
            } finally {
                if (!cancelled) setLoading(false);
            }
        };

        fetchSensorServerStatus();

        return () => {
            cancelled = true;
        };
    }, []);

    // sensorTypeCode -> connected 상태 맵
    const statusMap = useMemo(() => {
        const map = {};
        for (let i = 0; i < sensorServers.length; i++) {
            const s = sensorServers[i];
            if (s && s.sensorTypeCode != null) {
                map[s.sensorTypeCode] = !!s.connected;
            }
        }
        return map;
    }, [sensorServers]);

    return {
        sensorServers,
        statusMap,
        message,
        loading,
        error,
    };
};