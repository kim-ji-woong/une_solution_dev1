import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { ElectricChartInfoComponent } from '../../styled/sdmsPopupsStyled';
import SdmsResource from '../../resource/id';
import IconButton from '../../../Common/components/iconButton';
import Icon from '../../../Common/components/Icon/Icon';
import Loader from '../../../Common/ui/loader';
import { ModalBackground } from '../../../Root/styled/theme';
import { FacilityController } from '../../services/facilityController';
import ProjectResource from '../../../Root/resource/id';
import 'react-datepicker/dist/react-datepicker.css';

import PredictionLineEChart from './charts/predictionLineEChart';

function ElectricChartInfo(props) {
    const [sensorNo, setSensorNo] = useState(props.selectedStatusInfo?.sensorNo);

    // 창 열릴 때 값으로 조회하는 것으로 주석처리
    // props.selectedStatusInfo 변경 시 sensorNo 동기화
    //useEffect(() => {
        //setSensorNo(props.selectedStatusInfo?.sensorNo);
    //}, [props.selectedStatusInfo]);

    // 설비 이력 / 센서 데이터 상태
    const [powerInfos, setPowerInfos] = useState([]);      // API의 powerInfos
    const [powerDatas, setPowerDatas] = useState([]);      // API의 powerDatas (현재값)
    const [fcltyName, setFcltyName] = useState('');  
    
    const [loading, setLoading] = useState(false);
    const [isInitialLoading, setIsInitialLoading] = useState(true);
    const [error, setError] = useState(null);

    const ONE_DAY = 24 * 60 * 60 * 1000;

    const [viewRange, setViewRange] = useState({
        xStart: null,
        xEnd: null,
        yStart: 0,
        yEnd: null,
    });

    const initialViewRangeRef = useRef(null);

    useEffect(() => {
        if (!viewRange?.xStart || !viewRange?.xEnd) return;

        // 최초 조회 시에만 저장
        if (!initialViewRangeRef.current) {
            initialViewRangeRef.current = viewRange;
        }
    }, [viewRange]);

    const getNodataUI = () => (
        <div className="noData">
            <Icon.QuestionCircleIcon size="xs" fill={"grayscale.g500"} />
            <p>AI 전력예측 대상 설비가 아닙니다.</p>
        </div>
    );

    const getFcltyInfos = useCallback(async () => {
        if (!sensorNo) return;

        try {
            setLoading(true);
            setError(null);

            const [result, message] = await FacilityController.requestPowerHistory(sensorNo);

            console.log('조회 결과:', result);

            if (result?.success) {
                setFcltyName(result?.fclty_name || '');
                setPowerDatas(result?.powerDatas || []);
                setPowerInfos(result?.powerInfos || []);
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
    }, [sensorNo]);

    // 1분마다 getFcltyInfos 호출
    useEffect(() => {
        getFcltyInfos();

        const intervalId = setInterval(() => {
            getFcltyInfos();
        }, 60_000);

        return () => clearInterval(intervalId);
    }, [getFcltyInfos]);

    // AI 전력 예측용 데이터 (전력예측값 / 전력사용량)
    // 전력예측값 (예측치)
    const predictInfo = useMemo(
        () => powerInfos.find(info => info.tagName === '전력예측값'),
        [powerInfos]
    );

    // 전력사용량 (실측치)
    const measuredInfo = useMemo(
        () => powerInfos.find(info => info.tagName === '전력사용량'),
        [powerInfos]
    );

    // 예측치 라인 데이터
    const predictSeries = useMemo(() => {
        if (!predictInfo || !Array.isArray(predictInfo.predicts)) return [];
        return predictInfo.predicts.map(p => ({
            x: new Date(p.mesure_tm),
            y: p.mesure_value,
        }));
    }, [predictInfo]);

    // 실측치 라인 데이터
    const measuredSeries = useMemo(() => {
        if (!measuredInfo || !Array.isArray(measuredInfo.mesures)) return [];
        return measuredInfo.mesures.map(m => ({
            x: new Date(m.mesure_tm),
            y: m.mesure_value,
        }));
    }, [measuredInfo]);

    // y축 구간: [0, nLimit1, nLimit2, nLimit3, nLimit4, maxY]
    const predictYTicks = useMemo(() => {
        if (!predictInfo) return [];

        const { nLimit1, nLimit2, nLimit3, nLimit4, max_y } = predictInfo;

        const limits = [nLimit1, nLimit2, nLimit3, nLimit4].filter(
            (v) => typeof v === 'number' && v > 0
        );

        // max_y가 없으면 데이터에서 최대값을 구해서 사용
        let maxY = max_y;
        if (maxY == null || maxY <= 0) {
            const values = [
                ...(predictInfo.predicts || []).map(p => p.mesure_value ?? 0),
                ...(measuredInfo?.mesures || []).map(m => m.mesure_value ?? 0),
                ...limits,
                10,
            ];
            maxY = Math.max(...values);
        }

        return [0, ...limits, maxY];
    }, [predictInfo, measuredInfo]);

    useEffect(() => {
        if (!predictSeries.length && !measuredSeries.length) return;

        // 이미 초기값이 세팅되어 있으면 다시 안 함
        if (initialViewRangeRef.current) return;

        const times = [
            ...predictSeries.map(v => v.x.getTime()),
            ...measuredSeries.map(v => v.x.getTime()),
        ];

        const min = Math.min(...times);
        const max = Math.max(...times);

        const initialRange = {
            xStart: min,
            xEnd: Math.min(min + ONE_DAY, max), // ⭐ 1일치
            yStart: 0,
            yEnd: predictYTicks[predictYTicks.length - 1],
        };

        setViewRange(initialRange);
        initialViewRangeRef.current = initialRange;

    }, [predictSeries, measuredSeries, predictYTicks]);


    // x축 시간 범위 (예측치/실측치 전체 구간)
    const predictTimeRange = useMemo(() => {
        const times = [];

        const pushRange = (arr) => {
            if (arr?.length) {
                const first = new Date(arr[0].mesure_tm);
                const last = new Date(arr[arr.length - 1].mesure_tm);
                times.push(first, last);
            }
        };

        pushRange(predictInfo?.predicts);
        pushRange(measuredInfo?.mesures);

        if (times.length === 0) return null;

        times.sort((a, b) => a - b);
        const start = times[0];
        const end = times[times.length - 1];

        const pad = (n) => String(n).padStart(2, '0');
        const baseDate = `${start.getFullYear()}-${pad(start.getMonth() + 1)}-${pad(start.getDate())}`;
        const startTime = `${pad(start.getHours())}:${pad(start.getMinutes())}:${pad(start.getSeconds())}`;
        const endTime = `${pad(end.getHours())}:${pad(end.getMinutes())}:${pad(end.getSeconds())}`;

        return { baseDate, startTime, endTime };
    }, [predictInfo, measuredInfo]);

    // tagName으로 powerDatas에서 현재값 조회
    const getValue = useCallback((tag) => {
        const item = powerDatas.find(d => d.tagName === tag);

        if (!item) return "-";

        // 소수점 자리수 제어(원하면)
        const value = item.mesure_value ?? "-";
        const uom = item.mesure_uom ?? "";

        return `${value} ${uom}`;
    }, [powerDatas]);

    const closePopup = () => {
        props.setVisiblePopups(SdmsResource.ID.menu.electricChartInfo, false);
    }

    return (
        <ModalBackground>
            <ElectricChartInfoComponent className='UI_Section equipmentChartInfo' $resize={false}>
                <div className='dslTop'>
                    <h5 className='dslTitle'>
                        설비정보
                    </h5>
                    <div>
                        <p>{fcltyName.toUpperCase()}</p>
                        <IconButton
                            variant="unfill"
                            size="xxs"
                            icon={<Icon.Closer size={"xxs"} />}
                            onClick={() => props.setVisiblePopups(SdmsResource.ID.menu.electricChartInfo, false)}
                        >
                            닫기
                        </IconButton>
                    </div>
                </div>

                <div className={`content ${isInitialLoading && loading ? 'loading' : ''}`}>
                    {isInitialLoading && loading ? (
                        <div className="fullLoader">
                            <Loader message="데이터를 조회하고 있습니다." />
                        </div>
                    ) : (
                        <>
                    <header>
                        <p>전력설비</p>
                        <p>{fcltyName.toUpperCase()}</p>
                    </header>

                    <div>
                        <section className="chartSection">
                            <article className="aiChartWrap">
                                {
                                    (!predictInfo && !measuredInfo) ?
                                        getNodataUI() :
                                        <>
                                            <div className='titleWrap'>
                                                <h3>AI 설비이상 예측</h3>
                                                <div className="legendWrap">
                                                    <ul className='legend'>
                                                        <li>실측치</li>
                                                        <li>예측치</li>
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
                                                {predictTimeRange && (
                                                    <PredictionLineEChart
                                                        type="electric"
                                                        baseDate={predictTimeRange.baseDate}
                                                        startTime={predictTimeRange.startTime}
                                                        endTime={predictTimeRange.endTime}
                                                        minuteSeries1={predictSeries}
                                                        minuteSeries2={measuredSeries}
                                                        yTicks={predictYTicks}
                                                        viewRange={viewRange}
                                                        onViewChange={setViewRange}
                                                        initialViewRangeRef={initialViewRangeRef}
                                                    />
                                                )}
                                            </div>
                                        </>
                                }
                            </article>
                        </section>

                        <section className="infoSection">
                            <div className='detailWrap'>
                                <ul>
                                    <li>
                                        <p>전력</p>
                                        <p>{getValue("전력")}</p>
                                    </li>
                                    <li>
                                        <p>누설전류</p>
                                        <p>{getValue("누설전류")}</p>
                                    </li>
                                    <li>
                                        <p>온도</p>
                                        <p>{getValue("온도")}</p>
                                    </li>
                                    <li>
                                        <p>습도</p>
                                        <p>{getValue("습도")}</p>
                                    </li>
                                    <li>
                                        <p>Vrs</p>
                                        <p>{getValue("Vrs")}</p>
                                    </li>
                                    <li>
                                        <p>Vst</p>
                                        <p>{getValue("Vst")}</p>
                                    </li>
                                    <li>
                                        <p>Vtr</p>
                                        <p>{getValue("Vtr")}</p>
                                    </li>
                                </ul>

                                <ul>
                                    <li>
                                        <p>유효전력량</p>
                                        <p>{getValue("유효전력량")}</p>
                                    </li>
                                    <li>
                                        <p>역률</p>
                                        <p>{getValue("역률")}</p>
                                    </li>
                                    <li>
                                        <p>Ar</p>
                                        <p>{getValue("Ar")}</p>
                                    </li>
                                    <li>
                                        <p>As</p>
                                        <p>{getValue("As")}</p>
                                    </li>
                                    <li>
                                        <p>At</p>
                                        <p>{getValue("At")}</p>
                                    </li>
                                    <li>
                                        <p>수요전력 최대값</p>
                                        <p>{getValue("수요전력 최대값")}</p>
                                    </li>
                                </ul>
                            </div>
                        </section>

                        <div className='btnWrap'>
                            <button>
                                <span>상세보기</span>
                                <Icon.IconMove size='xs' />
                            </button>
                        </div>
                    </div>
                        </>
                    )}
                </div>
            </ElectricChartInfoComponent>
        </ModalBackground>
    );
}

export default ElectricChartInfo;
