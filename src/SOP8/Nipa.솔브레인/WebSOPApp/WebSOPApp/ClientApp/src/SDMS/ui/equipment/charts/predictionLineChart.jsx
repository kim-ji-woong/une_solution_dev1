import React, { useMemo } from 'react';
import { Line } from 'react-chartjs-2';

function PredictionLineChart({
    type,
    baseDate = null,
    startTime = null,
    endTime = null,
    minuteSeries1 = [], // 예측치
    minuteSeries2 = [], // 실측치
    yTicks = [],
}) {
    const isXY1 = minuteSeries1[0]?.x !== undefined;
    const isXY2 = minuteSeries2[0]?.x !== undefined;

    const xyTimes = useMemo(() => {
        const arr = [
            ...minuteSeries1.filter(v => v?.x).map(v => new Date(v.x)),
            ...minuteSeries2.filter(v => v?.x).map(v => new Date(v.x)),
        ].filter(t => t instanceof Date && !isNaN(t));
        return arr.sort((a, b) => a - b);
    }, [minuteSeries1, minuteSeries2]);

    let computedMin = null;
    let computedMax = null;

    if (xyTimes.length > 0) {
        // ElectricChartInfo 용
        computedMin = xyTimes[0];
        computedMax = xyTimes[xyTimes.length - 1];
    } else if (baseDate && startTime && endTime) {
        // EquipmentChartInfo 용
        computedMin = new Date(`${baseDate} ${startTime}`);
        computedMax = new Date(`${baseDate} ${endTime}`);
    }

    const stamps = useMemo(() => {
        if (!computedMin || !computedMax) return [];
        const out = [];
        const diffMin = Math.max(0, Math.round((computedMax - computedMin) / 60000));

        for (let i = 0; i <= diffMin; i++) {
            out.push(new Date(computedMin.getTime() + i * 60000));
        }
        return out;
    }, [computedMin, computedMax]);

    const normalize = (series, isXY) => {
        if (!series?.length) return [];
        if (isXY) return series;

        // 숫자 배열이면 stamps 기반으로 변환
        return series.map((v, i) => ({
            x: stamps[i],
            y: v ?? null,
        }));
    };

    const data1 = useMemo(
        () => normalize(minuteSeries1, isXY1),
        [minuteSeries1, isXY1, stamps]
    );

    const data2 = useMemo(
        () => normalize(minuteSeries2, isXY2),
        [minuteSeries2, isXY2, stamps]
    );

    const datas = useMemo(() => {
        const datasets = [];

        if (data1.length > 0) {
            datasets.push({
                label: '예측치',
                data: data1,
                type: 'line',
                yAxisID: 'y-axis-0',
                xAxisID: 'x-axis-0',
                borderColor: '#4EB6FF',
                fill: false,
                borderWidth: 1,
                lineTension: 0,
                pointRadius: 0,
                pointHoverRadius: 3,
                pointHitRadius: 5,
            });
        }

        if (type === 'electric' && data2.length > 0) {
            datasets.push({
                label: '실측치',
                data: data2,
                type: 'line',
                yAxisID: 'y-axis-0',
                xAxisID: 'x-axis-0',
                borderColor: '#FF8A00',
                fill: false,
                borderWidth: 1,
                lineTension: 0,
                pointRadius: 0,
                pointHoverRadius: 3,
                pointHitRadius: 5,
            });
        }

        return { datasets };
    }, [data1, data2, type]);

    // 하이라이트 플러그인
    const highlightPlugin = {
        beforeDraw: function (chart) {
            if (!yTicks || yTicks.length < 6) return;

            const ctx = chart.ctx;
            const yScale = chart.scales['y-axis-0'];
            const { left, right, top: areaTop, bottom: areaBottom } = chart.chartArea;

            const ranges = [
                [yTicks[1], yTicks[2], 'rgba(73, 113, 255, 0.20)', 'rgba(73, 113, 255, 0.32)'],
                [yTicks[2], yTicks[3], 'rgba(255, 199, 58, 0.20)', 'rgba(255, 199, 58, 0.32)'],
                [yTicks[3], yTicks[4], 'rgba(252, 107, 25, 0.20)', 'rgba(252, 107, 25, 0.32)'],
                [yTicks[4], yTicks[5], 'rgba(255, 60, 60, 0.20)', 'rgba(255, 60, 60, 0.32)'],
            ];

            ctx.save();

            ranges.forEach(([low, high, fill, stroke]) => {
                const t = yScale.getPixelForValue(low);
                const b = yScale.getPixelForValue(high);
                const h = b - t;

                ctx.fillStyle = fill;
                ctx.fillRect(left, t, right - left, h);

                ctx.beginPath();
                ctx.moveTo(left, t);
                ctx.lineTo(right, t);
                ctx.lineWidth = 1;
                ctx.strokeStyle = stroke;
                ctx.stroke();
            });

            // yTicks[1] 위치에 초록 점선 (초순수만 적용)
            if (type === 'equipment' && yTicks && yTicks.length > 1) {
                const yVal = yTicks[1];
                const yPix = yScale.getPixelForValue(yVal);

                if (yPix >= areaTop && yPix <= areaBottom) {
                    ctx.beginPath();
                    ctx.moveTo(left, yPix);
                    ctx.lineTo(right, yPix);
                    ctx.lineWidth = 1;
                    ctx.strokeStyle = '#37B44A';
                    ctx.setLineDash([4, 3]);
                    ctx.stroke();
                    ctx.setLineDash([]);
                }
            }

            ctx.restore();
        },
    };

    const options = useMemo(() => ({
        maintainAspectRatio: false,
        elements: {
            line: { tension: 0, borderWidth: 1 },
            point: { radius: 0, hoverRadius: 3, hitRadius: 5 },
        },
        hover: { mode: 'nearest', intersect: true },
        scales: {
            xAxes: [
                {
                    id: 'x-axis-0',
                    type: 'time',
                    time: {
                        unit: 'minute',
                        stepSize: 60,
                        min: computedMin,
                        max: computedMax,
                        displayFormats: { minute: 'HH' },
                    },
                    distribution: 'linear',
                    gridLines: {
                        drawBorder: true,
                        display: true,
                        color: 'rgba(255,255,255,0)',
                        zeroLineColor: 'rgba(255, 255, 255, 0.20)',
                        zeroLineWidth: 1,
                    },
                    ticks: {
                        fontFamily: 'Spoqa Han Sans Neo',
                        fontSize: 9,
                        fontColor: '#CECFD2',
                        maxRotation: 0,
                        minRotation: 0,
                        callback: (value) => {
                            if (value instanceof Date) {
                                return String(value.getHours()).padStart(2, '0');
                            }
                            const s = String(value).split(':')[0];
                            return s.padStart(2, '0');
                        },
                    },
                },
            ],
            yAxes: [
                {
                    id: 'y-axis-0',
                    gridLines: {
                        drawBorder: true,
                        display: true,
                        color: 'rgba(255,255,255,0)',
                        zeroLineColor: 'rgba(255, 255, 255, 0.20)',
                        zeroLineWidth: 1,
                    },
                    ticks: {
                        beginAtZero: true,
                        min: 0,
                        max: yTicks.length > 0 ? yTicks[yTicks.length - 1] : 10,
                        callback: (v) => v,
                        fontFamily: 'Spoqa Han Sans Neo',
                        fontSize: 9,
                        fontColor: '#CECFD2',
                    },
                    afterBuildTicks: (axis) => {
                        if (yTicks && yTicks.length > 0) axis.ticks = yTicks;
                    },
                },
            ],
        },
        legend: { display: false },
        tooltips: {
            enabled: true,
            mode: 'nearest',
            intersect: true,
            backgroundColor: '#fff',
            titleFontSize: 12,
            titleFontFamily: 'Spoqa Han Sans Neo',
            titleFontColor: '#424242',
            bodyFontSize: 12,
            bodyFontFamily: 'Spoqa Han Sans Neo',
            bodyFontColor: '#424242',
            displayColors: true,
            cornerRadius: 2,
            callbacks: {
                title: function (tooltipItems, data) {
                    const item = tooltipItems && tooltipItems[0];
                    if (!item) return '';
                    const ds = data.datasets[item.datasetIndex] || {};
                    const point = ds.data && ds.data[item.index];
                    const x = point && point.x ? new Date(point.x) : null;
                    if (!x || isNaN(x)) return String(item.xLabel || item.label || '');
                    const hh = String(x.getHours()).padStart(2, '0');
                    const mm = String(x.getMinutes()).padStart(2, '0');
                    return `${hh}:${mm}`;
                },
                label: function (tooltipItem, data) {
                    const ds = data.datasets[tooltipItem.datasetIndex] || {};
                    const label = ds.label || '';
                    const value = tooltipItem.yLabel ?? tooltipItem.value ?? '';
                    return `${label} : ${value}`;
                },
            },
        },
    }), [computedMin, computedMax, yTicks]);

    return (
        <Line
            key={type}
            data={datas}
            options={options}
            plugins={[highlightPlugin]}
        />
    );
}

export default PredictionLineChart;