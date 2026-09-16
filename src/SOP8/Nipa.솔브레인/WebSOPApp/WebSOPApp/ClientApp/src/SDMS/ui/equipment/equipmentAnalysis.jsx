import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { EquipmentAnalysisComponent } from '../../styled/sdmsPopupsStyled';
import SdmsResource from '../../resource/id';
import IconButton from '../../../Common/components/iconButton';
import PopupDraggable from '../popups/popupDraggable';
import Icon from '../../../Common/components/Icon/Icon';
import PredictionLineChart from './charts/predictionLineChart';
import { FacilityController } from '../../services/facilityController';

function EquipmentAnalysis(props) {

    const [sensorNo, setSensorNo] = useState(props.selectedStatusInfo?.sensorNo);
    const [data, setData] = useState(null);  // API 결과 저장
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [sensorType, setSensorType] = useState("equipment");

    useEffect(() => {
        setSensorNo(props.selectedStatusInfo?.sensorNo);
    }, [props.selectedStatusInfo]);

    const getFcltyInfos = useCallback(async () => {
        if (!sensorNo) return;

        try {
            const [result, message] = await FacilityController.requestFcltyAnalysis(sensorNo)

            console.log('조회 결과:', result);

            if (result.success) {
                setData(result);

                // 실측치 데이터가 존재한다면 전력 차트
                if (result.mesures) {
                    setSensorType("electric");
                }
            } else {
                props.handleToast(message);
            }
        } catch (e) {
            console.error(e);
            setError(e);
        } finally {
            setLoading(false);
        }
    }, [sensorNo]);

    useEffect(() => {
        getFcltyInfos();
        const intervalId = setInterval(() => getFcltyInfos(), 60000);
        return () => clearInterval(intervalId);
    }, [getFcltyInfos]);

    // 예측 데이터
    const predictSeries = useMemo(() => {
        if (!data || !data.predicts) return [];

        // equipment > 숫자 배열
        if (sensorType === "equipment") {
            return data.predicts.map(p => p.mesure_value);
        }

        // electric > 객체 배열 { x, y }
        if (sensorType === "electric") {
            return data.predicts.map(p => ({
                x: new Date(p.mesure_tm),
                y: p.mesure_value,
            }));
        }

        return [];
    }, [data, sensorType]);

    // 실측치 데이터
    const measuredSeries = useMemo(() => {
        if (!data || !data.mesures) return [];

        // equipment > 숫자 배열
        if (sensorType === "equipment") {
            return data.mesures.map(m => m.mesure_value);
        }

        // electric > 객체 배열 { x, y }
        if (sensorType === "electric") {
            return data.mesures.map(m => ({
                x: new Date(m.mesure_tm),
                y: m.mesure_value,
            }));
        }

        return [];
    }, [data, sensorType]);

    // yTicks 계산
    const predictYTicks = useMemo(() => {
        if (!data) return [];

        const { nLimit1, nLimit2, nLimit3, nLimit4, max_y } = data;

        return [0, nLimit1, nLimit2, nLimit3, nLimit4, max_y].filter(v => v !== undefined);
    }, [data]);

    // 시간 범위 계산
    const predictTimeRange = useMemo(() => {
        const times = [];

        const pushRange = (arr) => {
            if (arr?.length) {
                const first = new Date(arr[0].mesure_tm);
                const last = new Date(arr[arr.length - 1].mesure_tm);
                times.push(first, last);
            }
        };

        pushRange(data?.predicts);
        pushRange(data?.mesures);

        if (times.length === 0) return null;

        times.sort((a, b) => a - b);
        const start = times[0];
        const end = times[times.length - 1];

        const pad = (n) => String(n).padStart(2, '0');
        const baseDate = `${start.getFullYear()}-${pad(start.getMonth() + 1)}-${pad(start.getDate())}`;
        const startTime = `${pad(start.getHours())}:${pad(start.getMinutes())}:${pad(start.getSeconds())}`;
        const endTime = `${pad(end.getHours())}:${pad(end.getMinutes())}:${pad(end.getSeconds())}`;

        return { baseDate, startTime, endTime };
    }, [data]);

    const changeMode = () => {
        const fcltyInfos = props.fcltyInfos;
        const faModels = props.faModel;

        let faModeNo = null;
        let zoneDataNo = null;

        // fcltyInfos, sensorNo 이용해서 해당 존 그리고 설비 타입 찾기
        if (fcltyInfos?.length > 0) {
            const fcltyInfo = fcltyInfos.find(x => x.sensor_sn === sensorNo);
            if (fcltyInfo && faModels.length > 0) {

                const faModelDatas = faModels.filter(x => x.fclty_type_code === fcltyInfo.fclty_ty_code);

                if (faModelDatas?.length > 0) {

                    for (const faModel of faModelDatas) {

                        for (const zone of faModel.zoneData) {

                            if (zone.zone_sn === fcltyInfo.zone_sn) {
                                faModeNo = faModel.gltf_fclty_zone_model_sn;
                                zoneDataNo = fcltyInfo.zone_sn;
                                break;
                            }
                        }

                        if (faModeNo !== null)
                            break;
                    }

                }

            }
        }

        if (faModeNo !== null && zoneDataNo !== null) {
            let showPopups = props.showPopups;
            showPopups[SdmsResource.ID.menu.equipmentAnalysis] = false;

            props.handleControlMode(
                SdmsResource.controlMode.equipment,
                { fcltyNo: faModeNo, zoneNo: zoneDataNo }
            );
        }
    };

    return (
        <EquipmentAnalysisComponent id={props.popupType} className='UI_Section equipmentAnalysis' $resize={true}>
            <PopupDraggable
                id={props.popupType}
                popupMinWidth={340}
                popupMinHeight={312}
                topSize={40}
                popupState={props.popupState}
                setActiveDragPopup={props.setActiveDragPopup}
                setPopupState={props.setPopupState}
            >
                <div className='dslTop'>
                    <h5 className='dslTitle'>
                        {SdmsResource.ID.menu.equipmentAnalysis}
                    </h5>
                    <IconButton
                        variant="unfill"
                        size="xxs"
                        icon={<Icon.Closer size={"xxs"} />}
                        onClick={() => props.setVisiblePopups(SdmsResource.ID.menu.equipmentAnalysis, false)}
                    >
                        닫기
                    </IconButton>
                </div>

                <div className='content'>
                    <div className='infoWrap'>
                        <p>설비 명</p>
                        <p>{data?.fclty_name?.toUpperCase() || ""}</p>
                    </div>

                    <div className='chartWrap'>
                        <article className="aiChartWrap">
                            <div className="legendWrap">
                                {
                                    sensorType === "equipment" ?
                                        <ul className="legend eq">
                                            <li>예측치</li>
                                            <li>임계치</li>
                                        </ul> :
                                        <ul className="legend el">
                                            <li>실측치</li>
                                            <li>예측치</li>
                                        </ul>
                                }
                                <ul className='actionStep'>
                                    <li>관심</li>
                                    <li>주의</li>
                                    <li>경계</li>
                                    <li>심각</li>
                                </ul>
                            </div>
                            <div className="chart">
                                {data && predictTimeRange && (
                                    <PredictionLineChart
                                        type={sensorType}
                                        baseDate={predictTimeRange.baseDate}
                                        startTime={predictTimeRange.startTime}
                                        endTime={predictTimeRange.endTime}
                                        minuteSeries1={predictSeries}  // 예측치(없으면 [])
                                        minuteSeries2={measuredSeries} // 실측치(없으면 [])
                                        yTicks={predictYTicks}
                                    />
                                )}
                            </div>
                        </article>
                        <button onClick={changeMode}>
                            설비모드 바로가기
                            <Icon.Arrow size={12} direction="right" />
                        </button>
                    </div>
                </div>
            </PopupDraggable>
        </EquipmentAnalysisComponent>
    );
}

export default EquipmentAnalysis;