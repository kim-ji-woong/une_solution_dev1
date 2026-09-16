import { useEffect, useState } from 'react';
import { SDMSController } from '../../SDMS/services/sdmsController';

export const useSensorServerStatus = () => {
    const [sensorServers, setSensorServers] = useState([]);
    const [message, setMessage] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetch = async () => {
        try {
            setLoading(true);
            const [sensorServers, msg] = await SDMSController.requestSensorServerStatus();
            setSensorServers(sensorServers);
            setMessage(msg);
        } catch (err) {
            setError(err);
        } finally {
            setLoading(false);
        }
        };

        fetch();
    }, []);

    return { 
        sensorServers, 
        message, 
        loading, 
        error
    };
};