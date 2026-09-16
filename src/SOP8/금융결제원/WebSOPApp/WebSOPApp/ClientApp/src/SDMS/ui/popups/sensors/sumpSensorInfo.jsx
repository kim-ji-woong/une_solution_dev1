import { useCallback, useEffect, useState, useMemo } from 'react';
import PMSensorLineChart from '../../charts/pmSensorLineChart';
import { SDMSController } from '../../../services/sdmsController';

export default function SumpSensorInfo(props) {
    const [sensorNo, setSensorNo] = useState(props.sensorDetailInfo?.sensor?.sensor_sn);

    useEffect(() => {
        setSensorNo(props.sensorDetailInfo?.sensor?.sensor_sn);
    }, [props.sensorDetailInfo]);

    const [waterGatherInfo, setWaterGatherInfo] = useState(null);
    const [materialMeasurementInfo, setMaterialMeasurementInfo] = useState([]); // 실측치
    const [materialMeasurementForecastInfo, setMaterialMeasurementForecastInfo] = useState([]); // 예측치

    const [loading, setLoading] = useState(false);

    const getWaterGatherInfos = useCallback(async () => {
        if (!sensorNo) return;

        try {
            setLoading(true);

            const [waterGatherInfoRes, forecastInfoRes] = await Promise.all([
                SDMSController.requestWaterGatherInfo(sensorNo),
                SDMSController.requestWaterGatherForecastInfo(sensorNo),
            ]);

            if (waterGatherInfoRes.success) {
                setWaterGatherInfo(waterGatherInfoRes?.waterGather ?? null);
            }

            if (forecastInfoRes.success) {
                setMaterialMeasurementInfo(forecastInfoRes?.materialMeasurementForecastInfo ?? []);
                setMaterialMeasurementForecastInfo(forecastInfoRes?.materialMeasurementInfo ?? []);
            }
        } catch (e) {
            console.error(e);
        } finally {
            setLoading(false);
        }
    }, [sensorNo]);

    useEffect(() => {
        getWaterGatherInfos();

        const intervalId = setInterval(() => {
            getWaterGatherInfos();
        }, 60_000);

        return () => clearInterval(intervalId);
    }, [getWaterGatherInfos]);

    const convertToXY = (arr) => {
        if (!arr) return [];
        return arr.map(item => ({
            x: new Date(item.time),
            y: item.value,
        }));
    };

    const dataXY1 = useMemo(() => convertToXY(materialMeasurementInfo), [materialMeasurementInfo]);
    const dataXY2 = useMemo(() => convertToXY(materialMeasurementForecastInfo), [materialMeasurementForecastInfo]);

    // 모든 time 값을 모아서 min/max 시간 계산
    const allTimes = useMemo(() => {
        const arr = [
            ...materialMeasurementInfo.map(i => new Date(i.time)),
            ...materialMeasurementForecastInfo.map(i => new Date(i.time)),
        ].filter(Boolean);
        return arr;
    }, [materialMeasurementInfo, materialMeasurementForecastInfo]);

    const minTime = allTimes.length ? new Date(Math.min(...allTimes)) : null;
    const maxTime = allTimes.length ? new Date(Math.max(...allTimes)) : null;

    // 시간 포맷(HH:mm:ss)
    const formatToHHMMSS = (d) => {
        if (!d) return "00:00:00";
        const hh = String(d.getHours()).padStart(2, "0");
        const mm = String(d.getMinutes()).padStart(2, "0");
        const ss = String(d.getSeconds()).padStart(2, "0");
        return `${hh}:${mm}:${ss}`;
    };

    const baseDate = minTime ? minTime.toISOString().slice(0, 10) : "2025-01-01";
    const startTime = minTime ? formatToHHMMSS(minTime) : "00:00:00";
    const endTime = maxTime ? formatToHHMMSS(maxTime) : "00:00:00";

    // yTicks 설정
    const cfg = {
        yTicks: [0, 5.8, 6, 7, 8, 8.6, 14],
    };

    return (
        <>
            {loading ? 
                <div className='loading'>
                    <p>데이터를 불러오고 있습니다.</p>
                </div>
                : 
                <>
                    <div className="chartWrap">
                        
                            <div className="chart">
                                <PMSensorLineChart
                                    type="sump"
                                    baseDate={baseDate}
                                    startTime={startTime}
                                    endTime={endTime}
                                    minuteSeries1={dataXY1}   // 실측치
                                    minuteSeries2={dataXY2}   // 예측치
                                    yTicks={cfg.yTicks}
                                />
                            </div>
                    </div>
                    <div className="valueWrap">
                        <ul>
                            <li>
                                <span>수문 개도율</span>
                                <span>{waterGatherInfo?.flugt_opn_rate ?? '-'}%</span>
                            </li>

                            <li>
                                <span>집수조 pH</span>
                                <span>{waterGatherInfo?.hydro_ion_dnsty_idex ?? '-'}</span>
                            </li>
                        </ul>
                    </div>
                </>
            }
        </>
    );
}