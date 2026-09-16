import { useEffect, useState } from 'react';
import { SDMSController } from '../../SDMS/services/sdmsController';

export const useCCTVList = () => {
    const [cctvs, setCctvs] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const fetchCCTVs = async () => {
        try {
            setLoading(true);
            setError(null);

            const res = await SDMSController.requesAllCCTVs();
            const { cctVs = [], success, message } = res || {};

            if (!success) throw new Error(message || 'Failed to load CCTV list');
            setCctvs(cctVs);
        } catch (err) {
            setError(err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchCCTVs();
    }, []);

    return { cctvs, loading, error, refetchCCTV: fetchCCTVs };
};