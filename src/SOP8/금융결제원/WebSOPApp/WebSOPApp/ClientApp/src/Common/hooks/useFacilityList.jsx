import { useEffect, useState } from 'react';
import { SDMSController } from '../../SDMS/services/sdmsController';

export const useFacilityList = () => {
    const [facilityList, setFacilityList] = useState([]);
    const [message, setMessage] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchFacilities = async () => {
            try {
                setLoading(true);
                /*const [success, message, facilities = []] = await SDMSController.requestFacilityList();
                setMessage(message);

                if (!success) {
                    setError(new Error(message));
                    return;
                }
                
                setFacilityList(facilities);*/
            } catch (err) {
                setError(err);
            } finally {
                setLoading(false);
            }
        };

        fetchFacilities();
    }, []);

    return { 
        facilityList, 
        message, 
        loading, 
        error
    };
};