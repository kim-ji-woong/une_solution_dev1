import React, { useState, useEffect, useCallback, useMemo, useRef } from 'react';
import { EquipmentChartInfoComponent } from '../../styled/sdmsPopupsStyled';
import SdmsResource from '../../resource/id';
import IconButton from '../../../Common/components/iconButton';
import Icon from '../../../Common/components/Icon/Icon';
import Loader from '../../../Common/ui/loader';
import { ModalBackground } from '../../../Root/styled/theme';
import { FacilityController } from '../../services/facilityController';
import DefaultLineChart from './charts/defaultLineChart';
import PredictionLineEChart from './charts/predictionLineEChart';
import ProjectResource from '../../../Root/resource/id';

function EquipmentChartInfo(props) {
    const [sensorNo, setSensorNo] = useState(props.selectedStatusInfo?.sensorNo);

    const [facilityInfos, setFacilityInfos] = useState([]);
    const [facilityDatas, setFacilityDatas] = useState([]);
    const [fcltyName, setFcltyName] = useState('');

    const [loading, setLoading] = useState(false);
    const [isInitialLoading, setIsInitialLoading] = useState(true);
    const [error, setError] = useState(null);

    const [viewRange, setViewRange] = useState({
        xStart: null,
        xEnd: null,
        yStart: 0,
        yEnd: null,
    });
    const initialViewRangeRef = useRef(null);

    const getFcltyInfos = useCallback(async () => {
        if (!sensorNo) return;

        try {
            setLoading(true);
            setError(null);

            const [result, message] = await FacilityController.requestFacilityHistory(sensorNo);

            if (result?.success) {
                setFcltyName(result?.fclty_name || '');
                setFacilityDatas(result?.facilityDatas || []);
                setFacilityInfos(result?.facilityInfos || []);
            } else {
                props.showConfirmDialog(ProjectResource.dialogTypes.ERROR, ["데이터 조회에 실패하였습니다."], ["확인"], closePopup);
            }
        } catch (e) {
            console.error(e);
            setError(e);
        } finally {
            setLoading(false);
            setIsInitialLoading(false);
        }
    }, [sensorNo, props]);

    useEffect(() => {
        getFcltyInfos();

        const intervalId = setInterval(() => {
            getFcltyInfos();
        }, 60_000);

        return () => clearInterval(intervalId);
    }, [getFcltyInfos]);

    const sensorList = useMemo(() => {
        if (!facilityDatas || !Array.isArray(facilityDatas)) return [];

        const formatTimeLabel = (tm) => {
            if (!tm) return '';
            const [, time] = tm.split('T');
            return time ? time.slice(0, 5) : '';
        };

        return facilityDatas
            .filter((data) => {
                const info = facilityInfos.find((item) => item.mesure_id === data.mesure_id);
                return info ? !info.isAlarmFacility : true;
            })
            .map((data) => {
                const info = facilityInfos.find((item) => item.mesure_id === data.mesure_id);
                const mesures = info?.mesures || [];

                return {
                    mesureId: data.mesure_id,
                    title: data.tagName,
                    value:
                        typeof data.mesure_value === 'number'
                            ? data.mesure_value.toFixed(3)
                            : data.mesure_value ?? '-',
                    unit: data.mesure_uom || '',
                    chartLabels: mesures.map((m) => formatTimeLabel(m.mesure_tm)),
                    chartTooltipLabels: mesures.map((m) => m.mesure_tm),
                    chartData: mesures.map((m) => m.mesure_value),
                };
            });
    }, [facilityDatas, facilityInfos]);

    const alarmFacility = useMemo(
        () => facilityInfos.find((info) => info.isAlarmFacility),
        [facilityInfos]
    );

    const predictSeries = useMemo(() => {
        if (!alarmFacility || !Array.isArray(alarmFacility.predicts)) return [];
        return alarmFacility.predicts.map((p) => ({ x: p.mesure_tm, y: p.mesure_value }));
    }, [alarmFacility]);

    const predictYTicks = useMemo(() => {
        if (!alarmFacility) return [];

        const { nLimit1, nLimit2, nLimit3, nLimit4, max_y } = alarmFacility;
        const limits = [nLimit1, nLimit2, nLimit3, nLimit4].filter((v) => typeof v === 'number');

        if (limits.length === 0) return [0, max_y];
        return [0, ...limits, max_y];
    }, [alarmFacility]);

    const predictTimeRange = useMemo(() => {
        if (!alarmFacility || !Array.isArray(alarmFacility.predicts) || alarmFacility.predicts.length === 0) {
            return null;
        }

        const first = alarmFacility.predicts[0];
        const last = alarmFacility.predicts[alarmFacility.predicts.length - 1];
        const [baseDate, startTime] = first.mesure_tm.split('T');
        const [, endTime] = last.mesure_tm.split('T');

        return { baseDate, startTime, endTime };
    }, [alarmFacility]);

    useEffect(() => {
        if (!predictSeries.length || initialViewRangeRef.current) return;

        const times = predictSeries.map(v => new Date(v.x).getTime());
        const min = Math.min(...times);
        const max = Math.max(...times);

        const initialRange = {
            xStart: min,
            xEnd: max,
            yStart: 0,
            yEnd: predictYTicks[predictYTicks.length - 1],
        };

        setViewRange(initialRange);
        initialViewRangeRef.current = initialRange;
    }, [predictSeries, predictYTicks]);

    const getNodataUI = () => (
        <div className="noData" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: '100%', height: '100%' }}>
            <Icon.QuestionCircleIcon size="xs" fill={"grayscale.g500"} />
            <p>데이터가 없습니다</p>
        </div>
    );

    const closePopup = () => {
        props.setVisiblePopups(SdmsResource.ID.menu.equipmentChartInfo, false);
    }

    return (
        <ModalBackground>
            <EquipmentChartInfoComponent className='UI_Section equipmentChartInfo' $resize={false} $type={fcltyName}>
                <div className='dslTop'>
                    <h5 className='dslTitle'>설비정보</h5>
                    <div>
                        <p>{fcltyName.toUpperCase()}</p>
                        <IconButton
                            variant="unfill"
                            size="xxs"
                            icon={<Icon.Closer size="xxs" />}
                            onClick={() => props.setVisiblePopups(SdmsResource.ID.menu.equipmentChartInfo, false)}
                        >
                            닫기
                        </IconButton>
                    </div>
                </div>

                <div className="content">
                    {isInitialLoading && loading ? (
                        <Loader message="데이터를 조회하고 있습니다." />
                    ) : !(alarmFacility && predictTimeRange) && sensorList.length === 0 ? (
                        getNodataUI()
                    ) : (
                        <>
                            <figure className="eqWrap">
                                <figcaption>
                                    <p>{fcltyName === 'Ro Safety Filter' ? '전처리필터' : '혼상 이온교환수지'}</p>
                                    <p>{fcltyName.toUpperCase()}</p>
                                </figcaption>
                            </figure>

                            <article className="aiChartWrap">
                                <div className='titleWrap'>
                                    <h3>AI 설비이상 예측</h3>
                                    <div className="legendWrap">
                                        <ul className='legend'>
                                            <li>예측치</li>
                                            <li>경계치</li>
                                        </ul>
                                        <ul className='actionStep'>
                                            <li>관심</li>
                                            <li>주의</li>
                                            <li>경계</li>
                                            <li>심각</li>
                                        </ul>
                                    </div>
                                </div>
                                <div style={{ width: '100%', height: 'calc(100% - 20px)', minHeight: 0 }}>
                                    {alarmFacility && predictTimeRange ? (
                                        <PredictionLineEChart
                                            type="equipment"
                                            baseDate={predictTimeRange.baseDate}
                                            startTime={predictTimeRange.startTime}
                                            endTime={predictTimeRange.endTime}
                                            minuteSeries1={predictSeries}
                                            yTicks={predictYTicks}
                                            viewRange={viewRange}
                                            onViewChange={setViewRange}
                                            initialViewRangeRef={initialViewRangeRef}
                                        />
                                    ) : (
                                        getNodataUI()
                                    )}
                                </div>
                            </article>

                            <article className={`sensorChartWrap ${fcltyName !== 'Ro Safety Filter' ? 'flex' : ''}`}>
                                {sensorList.length === 0 ? (
                                    getNodataUI()
                                ) : fcltyName !== 'Ro Safety Filter' ? (
                                    <>
                                        {sensorList
                                            .slice(0, Math.max(0, sensorList.length - 2))
                                            .map((sensor, idx) => (
                                                <div key={sensor.mesureId ?? idx} className="sensorItem">
                                                    <header>
                                                        <p>{sensor.title}</p>
                                                        <p>
                                                            {sensor.value}
                                                            <span>{sensor.unit}</span>
                                                        </p>
                                                    </header>
                                                    <div className="chart">
                                                        <DefaultLineChart
                                                            type={fcltyName}
                                                            data={sensor.chartData}
                                                            labels={sensor.chartLabels}
                                                            tooltipLabels={sensor.chartTooltipLabels}
                                                        />
                                                    </div>
                                                </div>
                                            ))}

                                        {sensorList.length > 0 && (
                                            <div className="flex">
                                                {sensorList
                                                    .slice(Math.max(0, sensorList.length - 2))
                                                    .map((sensor, i) => {
                                                        const baseIndex = Math.max(0, sensorList.length - 2);

                                                        return (
                                                            <div key={sensor.mesureId ?? baseIndex + i} className="sensorItem">
                                                                <header>
                                                                    <p>{sensor.title}</p>
                                                                    <p>
                                                                        {sensor.value}
                                                                        <span>{sensor.unit}</span>
                                                                    </p>
                                                                </header>
                                                                <div className="chart">
                                                                    <DefaultLineChart
                                                                        type={fcltyName}
                                                                        data={sensor.chartData}
                                                                        labels={sensor.chartLabels}
                                                                        tooltipLabels={sensor.chartTooltipLabels}
                                                                    />
                                                                </div>
                                                            </div>
                                                        );
                                                    })}
                                            </div>
                                        )}
                                    </>
                                ) : (
                                    sensorList.map((sensor, idx) => (
                                        <div key={sensor.mesureId ?? idx} className="sensorItem">
                                            <header>
                                                <p>{sensor.title}</p>
                                                <p>
                                                    {sensor.value}
                                                    <span>{sensor.unit}</span>
                                                </p>
                                            </header>
                                            <div className="chart">
                                                <DefaultLineChart
                                                    type={fcltyName}
                                                    data={sensor.chartData}
                                                    labels={sensor.chartLabels}
                                                    tooltipLabels={sensor.chartTooltipLabels}
                                                />
                                            </div>
                                        </div>
                                    ))
                                )}
                            </article>

                        </>
                    )}

                    {!(isInitialLoading && loading) && (
                        <div className='btnWrap' style={{ position: 'absolute', bottom: '20px', left: '50%', transform: 'translateX(-50%)' }}>
                            <button>
                                <span>상세보기</span>
                                <Icon.IconMove size='xs' />
                            </button>
                        </div>
                    )}
                </div>
            </EquipmentChartInfoComponent>
        </ModalBackground>
    );
}

export default EquipmentChartInfo;
