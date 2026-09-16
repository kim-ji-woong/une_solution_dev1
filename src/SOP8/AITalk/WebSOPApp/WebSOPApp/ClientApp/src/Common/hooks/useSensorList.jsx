import { useEffect, useState } from 'react';
import { SDMSController } from '../../SDMS/services/sdmsController';

export const useSensorList = () => {
    const [sensorTypes, setSensorTypes] = useState([]);
    const [totalCount, setTotalCount] = useState(0);
    const [message, setMessage] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetch = async () => {
        try {
            setLoading(true);
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

        fetch();
    }, []);

    return { 
        sensorTypes, 
        totalCount, 
        message, 
        loading, 
        error
    };
};