import { useCallback, useEffect, useState, useMemo } from 'react';
import IconButton from '../../../../Common/components/iconButton';
import Icon from '../../../../Common/components/Icon/Icon';
import Button from '../../../../Common/components/button';
import PMSensorLineChart from '../../charts/pmSensorLineChart';
import { SDMSController } from '../../../services/sdmsController';
import SdmsResource from '../../../resource/id';

function RiskDepth({ depth = 0 }) {
    const className =
        depth === 1 ? 'first' :
        depth === 2 ? 'second' :
        depth === 3 ? 'third' :
        depth === 4 ? 'fourth' : 'normal';

    return <span className={`depth ${className}`} />;
}

export default function PMSensorInfo(props) {
    const [sensorNo, setSensorNo] = useState(props.sensorDetailInfo?.sensor?.sensor_sn);

    useEffect(() => {
        setSensorNo(props.sensorDetailInfo?.sensor?.sensor_sn);
    }, [props.sensorDetailInfo]);

    const [dustMeasurementInfos, setDustMeasurementInfos] = useState(null);
    const [currentSensorInfo, setCurrentSensorInfo] = useState(null);

    const [dustMeasurementHistories, setDustMeasurementHistories] = useState([]);
    const [dustMeasurementForecasts, setDustMeasurementForecasts] = useState([]);

    const [isChartUI, setIsChartUI] = useState(false);
    const [selectedType, setSelectedType] = useState(null);
    const [loading, setLoading] = useState(false);

    const getDustMeasurementInfos = useCallback(async () => {
        if (isChartUI) setIsChartUI(false);
        if (!sensorNo) return;

        try {
            setLoading(true);
            const dustMeasurementInfoRes = await SDMSController.requestDustMeasurementInfo();

            if (dustMeasurementInfoRes.success) {
                const currentSensorInfo = dustMeasurementInfoRes.dustMeasurements.find((data) => data.sensor_sn === sensorNo);

                setDustMeasurementInfos(dustMeasurementInfoRes.dustMeasurements ?? null);
                setCurrentSensorInfo(currentSensorInfo);
            }
        } catch (e) {
            console.error(e);
        } finally {
            setLoading(false);
        }
    }, [sensorNo]);

    useEffect(() => {
        getDustMeasurementInfos();
        const intervalId = setInterval(() => {
            getDustMeasurementInfos();
        }, 60_000);
        return () => clearInterval(intervalId);
    }, [getDustMeasurementInfos]);

    // 차트 화면에서 예측/실측 데이터 1분마다 자동 갱신
    useEffect(() => {
        if (!isChartUI || !selectedType) return;

        setChartDatas(selectedType.subType);

        const intervalId = setInterval(() => {
            setChartDatas(selectedType.subType);
        }, 60_000);

        return () => clearInterval(intervalId);
    }, [isChartUI, selectedType]);

    const setChartDatas = async (subType) => {
        if (!sensorNo) return;

        const forecastInfoRes = await SDMSController.requestDustForecastInfo(sensorNo, subType);

        if (forecastInfoRes.success) {
            const forecasts = forecastInfoRes.dustMeasurementForecasts || [];
            const histories = forecastInfoRes.dustMeasurementHistories || [];

            const forecastSeries = forecasts
                .filter(i => i.time)
                .map(i => ({
                    x: new Date(i.time),
                    y: i.value ?? null,
                }));

            const historySeries = histories
                .filter(i => i.time)
                .map(i => ({
                    x: new Date(i.time),
                    y: i.value ?? null,
                }));

            setDustMeasurementForecasts(forecastSeries);
            setDustMeasurementHistories(historySeries);
        }
    };

    const pmItems = useMemo(
        () => [
            { 
                label: '미세먼지 (PM10)', 
                value: currentSensorInfo?.fptc_value, 
                unit: '㎍/㎥', 
                subType: SdmsResource.sensorSubType.PM10,
                yTicks: [0, 31, 51, 101, 150, 250],
            },
            { 
                label: '미세먼지 (PM2.5)', 
                value: currentSensorInfo?.ulfptc_value, 
                unit: '㎍/㎥', 
                subType: SdmsResource.sensorSubType.PM2_5,
                yTicks: [0, 16, 26, 36, 75, 100],
            },
            { 
                label: '이산화탄소 (CO2)', 
                value: currentSensorInfo?.co2_value,
                unit: 'ppm', 
                subType: SdmsResource.sensorSubType.CO2,
                yTicks: [0, 801, 901, 1001, 1501, 1700],
            },
            { 
                label: '휘발성유기화합물 (VOCS)', 
                value: currentSensorInfo?.vlnms_value, 
                unit: 'ppb', 
                subType: SdmsResource.sensorSubType.VOCS,
                yTicks: [0, 71, 131, 271, 531, 600],
            },
        ],
        [currentSensorInfo]
    );

    const handleSelectedType = (item) => {
        setIsChartUI(true);
        setSelectedType(item);
    };

    // 위험 단계 표시
    const getRiskDepth = (value, yTicks) => {
        if (!value) return <RiskDepth depth={0} />;

        if (value >= yTicks[1] && value < yTicks[2]) return <RiskDepth depth={1} />;
        else if (value >= yTicks[2] && value < yTicks[3]) return <RiskDepth depth={2} />;
        else if (value >= yTicks[3] && value < yTicks[4]) return <RiskDepth depth={3} />;
        else if (value >= yTicks[4] && value < yTicks[5]) return <RiskDepth depth={4} />;
        return <RiskDepth depth={0} />;
    };

    if (isChartUI && selectedType) {
        return (
            <div className='scrollbar'>
            <div className="chartWrap">
                <Button 
                    variant="unfill" 
                    size="xxxs" 
                    leftIcon={<Icon.Arrow size={"xxxxs"} direction={"left"} />} 
                    onClick={() => {
                        setIsChartUI(false);
                        setSelectedType(null);
                    }}
                >
                    이전화면으로 돌아가기
                </Button>

                <div className="chart">
                    <PMSensorLineChart
                        type={selectedType}
                        // minuteSeries1={dustMeasurementForecasts}   // 예측치(bar) -> 예측치는 표출하지 않기로 협의
                        minuteSeries2={dustMeasurementHistories}   // 실측치(line)
                        yTicks={selectedType.yTicks}
                    />
                </div>

                <div className='riskInfo'>
                    <div>
                        {getRiskDepth(selectedType.value, selectedType.yTicks)}
                        <span>
                            {selectedType.label === '이산화탄소 (CO2)' ? (
                                <>이산화탄소 (CO<sub>2</sub>)</>
                            ) : selectedType.label === '휘발성유기화합물 (VOCS)' ? (
                                <>휘발성유기화합물 (VOC<sub>S</sub>)</>
                            ) : (
                                selectedType.label
                            )}
                        </span>
                    </div>
                    <div>
                        <span>{selectedType.value} {selectedType.unit}</span>
                    </div>
                </div>
            </div>
            </div>
        );
    }

    const sensor_322001 = dustMeasurementInfos?.find((data) => data.sensor_sn === 322001);   // 원료투입실 미세먼지 센서
    const sensor_322002 = dustMeasurementInfos?.find((data) => data.sensor_sn === 322002);   // 포장실 미세먼지 센서

    return (
        <div className='scrollbar'>
            {loading ? 
                <div className='loading'>
                    <p>데이터를 불러오고 있습니다.</p>
                </div>
                :
                <>
                    <div className="valueWrap">
                        <ul>
                            <li>
                                <div>항목</div>
                                <div>수치</div>
                            </li>
                            {pmItems.map((item, idx) => (
                                <li key={`${item.label}-${idx}`}>
                                    <div>
                                        {getRiskDepth(item.value, item.yTicks)}
                                        <span>
                                            {item.label === '이산화탄소 (CO2)' ? (
                                                <>이산화탄소 (CO<sub>2</sub>)</>
                                            ) : item.label === '휘발성유기화합물 (VOCS)' ? (
                                                <>휘발성유기화합물 (VOC<sub>S</sub>)</>
                                            ) : (
                                                item.label
                                            )}
                                        </span>
                                    </div>

                                    <div>
                                        <span>{item.value ?? '-'} {item.unit}</span>
                                        <IconButton
                                            type="button"
                                            variant="unfill"
                                            size="xxxs"
                                            icon={<Icon.Arrow size="xxxxs" direction="right" />}
                                            aria-label={`${item.label} 차트 보기`}
                                            onClick={() => handleSelectedType(item)}
                                        >
                                            차트 보기
                                        </IconButton>
                                    </div>
                                </li>
                            ))}
                        </ul>
                    </div>

                    <div className="statusWrap">
                        <div>
                            <span>원료투입실 환풍기 (4)</span>
                            <span className={sensor_322001?.exrfn_opr_yn ? "on" : "off"}>
                                {sensor_322001?.exrfn_opr_yn ? 
                                    <>
                                        <Icon.CircleCheck size="xxs" fill="state.success" /> ON
                                    </> :
                                    <>
                                        <Icon.CircleX size="xxs" fill="state.error" /> OFF
                                    </>  
                                }
                            </span>
                        </div>
                        <div>
                            <span>포장실 환풍기 (1)</span>
                            <span className={sensor_322002?.exrfn_opr_yn ? "on" : "off"}>
                                {sensor_322002?.exrfn_opr_yn ? 
                                    <>
                                        <Icon.CircleCheck size="xxs" fill="state.success" /> ON
                                    </> :
                                    <>
                                        <Icon.CircleX size="xxs" fill="state.error" /> OFF
                                    </>  
                                }
                            </span>
                        </div>
                    </div>
                </>
            }
        </div>
    );
}
