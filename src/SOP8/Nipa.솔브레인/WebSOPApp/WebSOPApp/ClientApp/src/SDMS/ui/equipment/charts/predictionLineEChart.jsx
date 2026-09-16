import React, { useMemo, useRef } from 'react';
import ReactECharts from 'echarts-for-react';
import { defaultIcons } from '../../../../Common/components/Icon/data.Icon';

function PredictionLineEChart({
    type,
    minuteSeries1 = [], // 예측치
    minuteSeries2 = [], // 실측치
    yTicks = [],
    viewRange = { xStart: null, xEnd: null, yStart: 0, yEnd: null },
    onViewChange,
    initialViewRangeRef,
}) {
    const chartRef = useRef(null);

    const isXY1 = minuteSeries1[0]?.x !== undefined;
    const isXY2 = minuteSeries2[0]?.x !== undefined;

    /** ---------------------------
     * 데이터 정규화 (XY만 사용)
     * --------------------------- */
    const normalize = (series, isXY) => {
        if (!series?.length || !isXY) return [];
        return series.map(v => [new Date(v.x).getTime(), v.y]);
    };

    const data1 = useMemo(
        () => normalize(minuteSeries1, isXY1),
        [minuteSeries1, isXY1]
    );

    const data2 = useMemo(
        () => normalize(minuteSeries2, isXY2),
        [minuteSeries2, isXY2]
    );

    const option = useMemo(() => {
        const iconPath = defaultIcons.ZoomIn;

        return {
            animation: false,

            grid: {
                left: 0,
                right: 5,
                top: 10,
                bottom: 10,
                containLabel: true,
            },

            tooltip: {
                trigger: 'axis',
                backgroundColor: '#fff',
                textStyle: {
                    color: '#424242',
                    fontSize: 13,
                },
                formatter: (params) => {
                    if (!params?.length) return '';
                    if (!Array.isArray(params[0].value)) return '';
                    const t = new Date(params[0].value[0]);
                    const yyyy = t.getFullYear();
                    const mmDate = String(t.getMonth() + 1).padStart(2, '0');
                    const dd = String(t.getDate()).padStart(2, '0');
                    const hh = String(t.getHours()).padStart(2, '0');
                    const mmTime = String(t.getMinutes()).padStart(2, '0');
                    const detailRows = params
                        .filter(p => Array.isArray(p.value))
                        .map(p => `<div style="color:#424242;font-size:13px;font-weight:500;line-height:1.5;">${p.seriesName} : ${p.value[1]}</div>`)
                        .join('');

                    return `
                        <div style="color:#616161;font-size:11px;font-weight:500;line-height:1.4;margin-bottom:4px;">
                            ${yyyy}-${mmDate}-${dd} ${hh}:${mmTime}
                        </div>
                        ${detailRows}
                    `;
                },
            },

            xAxis: {
                type: 'time',
                minInterval: 60 * 60 * 1000,
                maxInterval: 60 * 60 * 1000,
                axisLabel: {
                    fontSize: 9,
                    color: '#CECFD2',
                    formatter: (value) => {
                        const d = new Date(value);
                        const hh = String(d.getHours()).padStart(2, '0');

                        // 자정이면 날짜도 같이
                        if (d.getHours() === 0) {
                            return `${d.getMonth() + 1}/${d.getDate()}\n00`;
                        }

                        return hh;
                    },
                },
                axisLine: {
                    lineStyle: { color: 'rgba(255,255,255,0.2)' },
                },
                splitLine: { show: false },
            },

            yAxis: {
                type: 'value',
                scale: true,
                min: 0,
                max: yTicks[yTicks.length - 1],
                axisLabel: {
                    fontSize: 9,
                    color: '#CECFD2',
                },
                axisLine: {
                    show: true,
                    lineStyle: { color: '#444A57', width: 1 },
                },
                splitLine: { show: false },
            },

            // toolbox: {
            /*
                show: true,
                right: 0,
                top: 10,
                feature: {
                    dataZoom: {
                        xAxisIndex: 0,
                        yAxisIndex: 0,   // y축 포함
                        icon: {
                            zoom: `path://${iconPath}`,
                            back: 'none',
                        },
                        iconStyle: {
                            color: '#fff',        // 아이콘 색
                            borderColor: 'none',
                            // borderWidth: 1,
                        },
                        emphasis: {
                            iconStyle: {
                                color: '#3C69FC',    // hover 색
                                borderColor: 'none',
                            },
                        },
                        title: {
                            zoom: '',
                        },
                        // 줌박스 스타일
                        brushStyle: {
                            color: 'rgba(233, 233, 233, 0.25)',     // 내부 채움
                            borderColor: 'rgba(233, 233, 233, 0.5)',    // 테두리
                            borderWidth: 1,
                        },
                    },
                    // restore: {}, // 아이콘 삭제
                },
            }, */

            /** viewRange로만 제어 */
            dataZoom: [
                {
                    type: 'inside',
                    xAxisIndex: 0,
                    startValue: viewRange.xStart,
                    endValue: viewRange.xEnd,
                    filterMode: 'none',
                },
                {
                    type: 'inside',
                    yAxisIndex: 0,
                    startValue: viewRange.yStart,
                    endValue: viewRange.yEnd,
                    filterMode: 'none',
                },
            ],

            series: [
                {
                    name: '예측치',
                    type: 'line',
                    data: data1,
                    showSymbol: false,
                    lineStyle: { color: '#4EB6FF', width: 1 },
                    ...(yTicks.length >= 6 ? {
                        markArea: {
                            silent: true,
                            data: [
                                [{ yAxis: yTicks[1], itemStyle: { color: 'rgba(73,113,255,0.20)' } }, { yAxis: yTicks[2] }],
                                [{ yAxis: yTicks[2], itemStyle: { color: 'rgba(255,199,58,0.20)' } }, { yAxis: yTicks[3] }],
                                [{ yAxis: yTicks[3], itemStyle: { color: 'rgba(252,107,25,0.20)' } }, { yAxis: yTicks[4] }],
                                [{ yAxis: yTicks[4], itemStyle: { color: 'rgba(255,60,60,0.20)' } }, { yAxis: yTicks[5] }],
                            ],
                        },
                    } : {}),
                    // 경계치 초록 점선: yTicks[1] = nLimit1 위치에 표시 (초순수 설비 전용)
                    ...(type === 'equipment' && yTicks.length > 1 ? {
                        markLine: {
                            silent: true,
                            symbol: 'none',
                            data: [
                                {
                                    yAxis: yTicks[1], // nLimit1 (이상 징후 시작 기준선)
                                    lineStyle: {
                                        color: '#37B44A',
                                        width: 1,
                                        type: [4, 3], // dash: 4px, gap: 3px
                                    },
                                    label: { show: false },
                                },
                            ],
                        },
                    } : {}),
                },

                ...(type === 'electric'
                    ? [{
                        name: '실측치',
                        type: 'line',
                        data: data2,
                        showSymbol: false,
                        lineStyle: { color: '#FF8A00', width: 1 },
                    }]
                    : []),
            ],
        };
    }, [data1, data2, yTicks, type, viewRange]);

    return (
        <ReactECharts
            ref={chartRef}
            option={option}
            style={{ width: '100%', height: '100%' }}
            notMerge={false}
            lazyUpdate={true}
            onEvents={{
                datazoom: (_, chart) => {
                    if (!onViewChange) return;
                    const [dzX, dzY] = chart.getOption().dataZoom;

                    onViewChange(v => {
                        if (
                            v.xStart === dzX.startValue &&
                            v.xEnd === dzX.endValue &&
                            v.yStart === dzY.startValue &&
                            v.yEnd === dzY.endValue
                        ) return v;

                        return {
                            ...v,
                            xStart: dzX.startValue,
                            xEnd: dzX.endValue,
                            yStart: dzY.startValue,
                            yEnd: dzY.endValue,
                        };
                    });
                },
            }}
            onChartReady={(chart) => {
                const zr = chart.getZr();
                zr.on('dblclick', () => {
                    if (onViewChange && initialViewRangeRef?.current) {
                        onViewChange(initialViewRangeRef.current);
                    }
                });
            }}
        />
    );
}

export default PredictionLineEChart;
