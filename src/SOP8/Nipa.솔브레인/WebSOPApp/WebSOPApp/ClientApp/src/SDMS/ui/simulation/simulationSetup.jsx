import React, { useEffect, useMemo, useRef, useState } from 'react';
import { SimulationSetupComponent } from '../../styled/sdmsPopupsStyled';
import Icon from '../../../Common/components/Icon/Icon';
import SelectBox from '../../../Common/components/selectBox';
import Button from '../../../Common/components/button';
import SdmsResource from '../../resource/id';
import CommonLoading from '../../../Common/ui/loading';

function SimulationSetup(props) {
    const [isExecuted, setIsExecuted] = useState(false);
    const [isClicked, setIsClicked] = useState(false);      // 실행하기 버튼 중복 클릭 방지용

    // 초 배열 정렬, 맨 앞에 0 추가
    const valuesSec = useMemo(() => {
        const arr = Array.isArray(props.cfdFrameSeconds) ? props.cfdFrameSeconds : [];
        const nums = arr.map(v => Number(v)).filter(Number.isFinite).sort((a, b) => a - b);
        const base = nums.length ? nums : [0, 30 * 60, 60 * 60, 300 * 60]; // fallback(초)
        const deduped = base.filter((v, i) => i === 0 || v !== base[i - 1]);
        return deduped[0] === 0 ? deduped : [0, ...deduped];
    }, [props.cfdFrameSeconds]);

    // 분 단위로 변환 (화면 표출용)
    const values = useMemo(() => valuesSec.map(sec => sec / 60), [valuesSec]);

    const [currentIndex, setCurrentIndex] = useState(0);
    const [currentSeconds, setCurrentSeconds] = useState(0);

    const onTimestampChangeRef = useRef(props.onTimestampChange);
    useEffect(() => {
        onTimestampChangeRef.current = props.onTimestampChange;
    }, [props.onTimestampChange]);

    const changeCauseRef = useRef('silent');

    // 자동실행
    const [isAutoPlaying, setIsAutoPlaying] = useState(false);
    const timerRef = useRef(null);

    const stopAutoPlay = () => {
        if (timerRef.current) {
            clearInterval(timerRef.current);
            timerRef.current = null;
        }
        setIsAutoPlaying(false);
    };

    const startAutoPlay = () => {
        if (!valuesSec.length) return;
        changeCauseRef.current = 'silent';
        setCurrentIndex(0);
        setCurrentSeconds(valuesSec[0] ?? 0);

        setIsAutoPlaying(true);
        const interval = Number(props.autoPlayIntervalMs) > 0 ? Number(props.autoPlayIntervalMs) : 1000; // 기본 1s
        timerRef.current = setInterval(() => {
            setCurrentIndex(prev => {
                if (prev >= valuesSec.length - 1) {
                    stopAutoPlay();
                    return prev;
                }
                changeCauseRef.current = 'auto';
                return prev + 1;
            });
        }, interval);
    };

    const handleAutoPlayClick = () => {
        if (isAutoPlaying) stopAutoPlay();
        else startAutoPlay();
    };

    useEffect(() => () => stopAutoPlay(), []);

    useEffect(() => {
        stopAutoPlay();
        if (props.cfdFrameSeconds?.length > 0) {
            setIsExecuted(true);
            changeCauseRef.current = 'silent';
            setCurrentIndex(0);
            setCurrentSeconds(valuesSec[0] ?? 0);
            setIsClicked(false);
        }
    }, [props.cfdFrameSeconds, valuesSec]);

    useEffect(() => {
        const sec = valuesSec[currentIndex] ?? 0;
        setCurrentSeconds(sec);

        if (changeCauseRef.current === 'user' || changeCauseRef.current === 'auto') {
            onTimestampChangeRef.current?.(sec);
        }
        changeCauseRef.current = 'silent';
    }, [currentIndex, valuesSec]);

    const buildingGroupOptions = useMemo(() => {
        const directDatas = Array.isArray(props.spatialManager?.buildingDatas)
            ? props.spatialManager.buildingDatas
            : null;

        const groups = props.spatialManager?.buildingGroups;
        const fromGroups = groups
            ? Object.values(groups).flatMap(g => Array.isArray(g?.buildingDatas) ? g.buildingDatas : [])
            : [];

        const datas = directDatas ?? fromGroups;
        if (!datas || datas.length === 0) {
            return [{ value: "", label: "공장동 선택", disabled: true }];
        }

        const allowed = ["T5-1", "T6-2", "T6-3", "T10-1"];

        const normalize = s =>
            String(s ?? "")
                .toUpperCase()
                .replace(/\s+/g, "")
                .replace(/–/g, "-")
                .replace(/T0*(\d+)-0*(\d+)/, "T$1-$2")
                .replace(/T0*(\d+)/, "T$1");

        const allowedNorm = new Set(allowed.map(normalize));

        const hit = item => {
            const candidates = [
                String(item.buildingCode ?? ""),
                String(item.displayText ?? ""),
                String(item.name ?? "")
            ].map(normalize);

            return candidates.some(c =>
                allowedNorm.has(c) || [...allowedNorm].some(a => c.includes(a))
            );
        };

        const filtered = datas
            .filter(hit)
            .map(item => ({
                value: item.buildingNo,
                label: item.displayText || String(item.buildingCode || item.name || item.buildingNo),
            }));

        return [
            { value: "", label: "공장동 선택", disabled: true },
            ...filtered,
        ];
    }, [props.spatialManager]);

    const onClickReset = () => {
        stopAutoPlay();
        setIsExecuted(false);
        changeCauseRef.current = 'silent';
        setCurrentIndex(0);
        setCurrentSeconds(0);
        props.resetSimulation();
    };

    const fmt = (m) => (Number.isInteger(m) ? m : Math.round(m * 10) / 10);
    const currentMinutes = values[currentIndex] ?? 0;

    const handleSubmit = async () => {
        setIsClicked(true);

        const success = await props.doSimulation(
            Number(props.selectedSimulationInfo.buildingGroup),
            props.selectedSimulationInfo.materialName,
            props.selectedSimulationInfo.area,
            Number(props.selectedSimulationInfo.windDirection),
            Number(props.selectedSimulationInfo.windSpeed)
        );
        
        if (!success) {
            setIsClicked(false);
            props.handleToast("실행에 실패하였습니다");
        }
    }

    return (
        <SimulationSetupComponent>
            <CommonLoading 
                isOpen={isClicked} 
            />
            {
                !isExecuted ?
                <>
                    <div className='titleWrap'>
                        <h2>설정하기</h2>
                    </div>
                    <div>
                        <p>위치</p>
                        <div className='positionWrap'>
                            <SelectBox
                                value={props.selectedSimulationInfo.buildingGroup}
                                onChange={(option) => props.handleChangeBuildingGroup(option, buildingGroupOptions, false)}
                                options={buildingGroupOptions}
                            />
                            <SelectBox
                                value={props.selectedSimulationInfo.area}
                                onChange={props.handleChangeArea}
                                options={[
                                    { value: "", label: "구역 선택", disabled: true },
                                    { value: "ISO 체결", label: "ISO 체결" },
                                    { value: "저장 탱크", label: "저장 탱크" }
                                ]}
                            />
                        </div>
                    </div>

                    <div>
                        <p>풍향</p>
                        <div className='windDirectionWrap'>
                            <button
                                className={props.selectedSimulationInfo.windDirection === SdmsResource.windDirection.East ? "selected" : ""}
                                onClick={() => props.handleChangeWindDirection(SdmsResource.windDirection.East, "동(E)")}
                            >
                                <Icon.WindDirection size={8} direction="bottom" />동(E)
                            </button>
                            <button
                                className={props.selectedSimulationInfo.windDirection === SdmsResource.windDirection.West ? "selected" : ""}
                                onClick={() => props.handleChangeWindDirection(SdmsResource.windDirection.West, "서(W)")}
                            >
                                <Icon.WindDirection size={8} direction="top" />서(W)
                            </button>
                            <button
                                className={props.selectedSimulationInfo.windDirection === SdmsResource.windDirection.South ? "selected" : ""}
                                onClick={() => props.handleChangeWindDirection(SdmsResource.windDirection.South, "남(S)")}
                            >
                                <Icon.WindDirection size={8} direction="left" />남(S)
                            </button>
                            <button
                                className={props.selectedSimulationInfo.windDirection === SdmsResource.windDirection.North ? "selected" : ""}
                                onClick={() => props.handleChangeWindDirection(SdmsResource.windDirection.North, "북(N)")}
                            >
                                <Icon.WindDirection size={8} direction="right" />북(N)
                            </button>
                        </div>
                    </div>

                    <div>
                        <p>풍속</p>
                        <div className='windSpeedWrap'>
                            <button
                                className={props.selectedSimulationInfo.windSpeed === 0.5 ? "selected" : ""}
                                onClick={() => props.handleChangeWindSpeed(0.5)}
                            >
                                약 (0.5m/s)
                            </button>
                            <button
                                className={props.selectedSimulationInfo.windSpeed === 5 ? "selected" : ""}
                                onClick={() => props.handleChangeWindSpeed(5)}
                            >
                                강 (5m/s)
                            </button>
                        </div>
                    </div>

                    <Button
                        className="submitBtn"
                        variant="fill"
                        size="md"
                        disabled={
                            !props.selectedSimulationInfo.buildingGroup ||
                            !props.selectedSimulationInfo.area ||
                            !props.selectedSimulationInfo.windDirection ||
                            !props.selectedSimulationInfo.windSpeed ||
                            isClicked
                        }
                        onClick={() => handleSubmit()}
                    >
                        실행하기
                    </Button>
                </> :
                <>
                    <div className='titleWrap'>
                        <h2>설정정보</h2>
                        <button className="resetBtn" onClick={onClickReset}>
                            <Icon.Replay size={12} />
                            재설정하기
                        </button>
                    </div>
                    <div className='info'>
                        <p>물질</p>
                        <p>{props.selectedSimulationInfo.materialName}</p>
                    </div>
                    <div className='info'>
                        <p>위치</p>
                        <p>{`${props.selectedSimulationInfo.buildingGroupName} > ${props.selectedSimulationInfo.area}`}</p>
                    </div>
                    <div className='info'>
                        <p>풍향</p>
                        <p>{props.selectedSimulationInfo.windDirectionName}</p>
                    </div>
                    <div className='info'>
                        <p>풍속</p>
                        <p>
                            {props.selectedSimulationInfo.windSpeed === 0.5 && "약 (0.5m/s)"}
                            {props.selectedSimulationInfo.windSpeed === 5 && "강 (5m/s)"}
                        </p>
                    </div>

                    {/* 시간 표시 */}
                    <div className='info timeline'>
                        <p>시간</p>
                        <p>
                            <span>{fmt(currentMinutes)}</span> (min)
                        </p>
                        <button className="autoPlayBtn" onClick={handleAutoPlayClick} disabled={valuesSec.length <= 1}>
                            <Icon.AutoPlayIcon size={12} />
                            {isAutoPlaying ? '중지' : '자동실행'}
                        </button>
                    </div>

                    <div className='sliderWrap'>
                        <input
                            type="range"
                            className="timeStampInput"
                            min={0}
                            max={valuesSec.length - 1}
                            step={1}
                            value={currentIndex}
                            onChange={(e) => {
                                const idx = Number(e.target.value);
                                changeCauseRef.current = 'user';
                                setCurrentIndex(idx);

                                // 슬라이더가 0으로 맞춰지면 시뮬레이션 숨김
                                // if (idx === 0) {
                                //     props.hideSimulation();
                                // }
                            }}
                            disabled={false}
                        />
                        <div className="sliderLabel">
                            {values.map((min, i) => (
                                <span key={i}>{Number.isInteger(min) ? min : (Math.round(min * 10) / 10)}</span>
                            ))}
                        </div>
                    </div>
                </>
            }
        </SimulationSetupComponent>
    );
}

export default SimulationSetup;