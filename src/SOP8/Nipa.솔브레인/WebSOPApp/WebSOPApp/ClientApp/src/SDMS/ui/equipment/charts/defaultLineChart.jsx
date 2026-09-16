import React, { useMemo, useRef, useState } from 'react';
import ReactECharts from 'echarts-for-react';

function DefaultLineChart({ type, data = [], labels = [], tooltipLabels = [] }) {
    const initialViewRangeRef = useRef({
        xStart: 0,
        xEnd: 100,
        yStart: 0,
        yEnd: 100,
    });
    const [viewRange, setViewRange] = useState(initialViewRangeRef.current);

    const seriesData = useMemo(
        () => labels.map((label, index) => [label, data[index]]),
        [labels, data]
    );

    const yAxisLabelPrecision = useMemo(() => {
        const numericValues = data.filter((value) => Number.isFinite(Number(value))).map(Number);
        if (numericValues.length === 0) return 1;

        const minValue = Math.min(...numericValues);
        const maxValue = Math.max(...numericValues);
        const fullSpan = Math.max(maxValue - minValue, 0);
        const zoomRatio = Math.max((viewRange.yEnd - viewRange.yStart) / 100, 0.0001);
        const visibleSpan = fullSpan * zoomRatio;

        if (visibleSpan <= 0) return 1;

        const estimatedTickStep = visibleSpan / 5;
        const precision = Math.ceil(-Math.log10(estimatedTickStep));

        return Math.min(Math.max(precision, 0), 4);
    }, [data, viewRange.yEnd, viewRange.yStart]);

    const option = useMemo(() => ({
        animation: false,
        grid: {
            left: 6,
            right: 10,
            top: 6,
            bottom: 3,
            containLabel: true,
        },
        tooltip: {
            trigger: 'axis',
            renderMode: 'html',
            appendToBody: true,
            confine: false,
            backgroundColor: '#fff',
            borderWidth: 0,
            extraCssText: 'z-index: 9999;',
            textStyle: {
                color: '#424242',
                fontSize: 10,
                fontFamily: 'Spoqa Han Sans Neo',
                fontWeight: 700,
            },
            formatter: (params) => {
                if (!params?.length) return '';

                const pointIndex = params[0]?.dataIndex ?? 0;
                const axisValue = params[0]?.axisValue ?? '';
                const rawTooltipLabel = tooltipLabels[pointIndex] ?? axisValue;
                const parsedDate = new Date(rawTooltipLabel);
                const isValidDate = !Number.isNaN(parsedDate.getTime());

                const header = isValidDate
                    ? (() => {
                        const yyyy = parsedDate.getFullYear();
                        const mmDate = String(parsedDate.getMonth() + 1).padStart(2, '0');
                        const dd = String(parsedDate.getDate()).padStart(2, '0');
                        const hh = String(parsedDate.getHours()).padStart(2, '0');
                        const mmTime = String(parsedDate.getMinutes()).padStart(2, '0');

                        return `${yyyy}-${mmDate}-${dd} ${hh}:${mmTime}`;
                    })()
                    : axisValue;

                const detailRows = params
                    .map((p) => `<div style="color:#424242;font-size:13px;font-weight:500;line-height:1.5;">${p.data?.[1] ?? '-'}</div>`)
                    .join('');

                return `
                    <div style="color:#616161;font-size:11px;font-weight:500;line-height:1.4;margin-bottom:4px;">
                        ${header}
                    </div>
                    ${detailRows}
                `;
            },
        },
        xAxis: {
            type: 'category',
            boundaryGap: false,
            data: labels,
            axisLabel: {
                color: '#CECFD2',
                fontSize: 9,
                fontFamily: 'Spoqa Han Sans Neo',
            },
            axisLine: {
                lineStyle: {
                    color: '#313644',
                },
            },
            axisTick: {
                show: false,
            },
            splitLine: {
                show: false,
            },
        },
        yAxis: {
            type: 'value',
            scale: true,
            axisLabel: {
                color: '#CECFD2',
                fontSize: 8,
                fontFamily: 'Spoqa Han Sans Neo',
                formatter: (value) => {
                    const numericValue = Number(value);
                    if (!Number.isFinite(numericValue)) return value;

                    return numericValue
                        .toFixed(yAxisLabelPrecision)
                        .replace(/\.?0+$/, '');
                },
            },
            axisLine: {
                show: true,
                lineStyle: {
                    color: '#313644',
                },
            },
            axisTick: {
                show: false,
            },
            splitLine: {
                lineStyle: {
                    color: '#313644',
                },
            },
        },
        dataZoom: [
            {
                type: 'inside',
                xAxisIndex: 0,
                start: viewRange.xStart,
                end: viewRange.xEnd,
                filterMode: 'none',
                zoomOnMouseWheel: true,
                moveOnMouseWheel: false,
                moveOnMouseMove: true,
            },
            {
                type: 'inside',
                yAxisIndex: 0,
                start: viewRange.yStart,
                end: viewRange.yEnd,
                filterMode: 'none',
                zoomOnMouseWheel: true,
                moveOnMouseWheel: false,
                moveOnMouseMove: true,
            },
        ],
        series: [
            {
                name: 'line chart',
                type: 'line',
                data: seriesData,
                showSymbol: false,
                symbol: 'circle',
                symbolSize: 6,
                lineStyle: {
                    color: '#3C69FC',
                    width: 1,
                },
                itemStyle: {
                    color: '#3C69FC',
                },
                emphasis: {
                    focus: 'series',
                    itemStyle: {
                        color: '#3C69FC',
                    },
                },
            },
        ],
    }), [seriesData, viewRange, yAxisLabelPrecision]);

    return (
        <ReactECharts
            option={option}
            style={{ width: '100%', height: "100%" }}
            notMerge={false}
            lazyUpdate={true}
            onEvents={{
                datazoom: (_, chart) => {
                    const [dzX, dzY] = chart.getOption().dataZoom ?? [];

                    setViewRange((prev) => {
                        const next = {
                            xStart: dzX?.start ?? prev.xStart,
                            xEnd: dzX?.end ?? prev.xEnd,
                            yStart: dzY?.start ?? prev.yStart,
                            yEnd: dzY?.end ?? prev.yEnd,
                        };

                        if (
                            prev.xStart === next.xStart &&
                            prev.xEnd === next.xEnd &&
                            prev.yStart === next.yStart &&
                            prev.yEnd === next.yEnd
                        ) {
                            return prev;
                        }

                        return next;
                    });
                },
            }}
            onChartReady={(chart) => {
                const zr = chart.getZr();
                zr.on('dblclick', () => {
                    setViewRange(initialViewRangeRef.current);
                });
            }}
        />
    );
}

export default DefaultLineChart;
