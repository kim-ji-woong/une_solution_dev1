import React, { useMemo } from 'react';
import { Line } from 'react-chartjs-2';

function PMSensorLineChart({
    type,
    minuteSeries1 = [],
    minuteSeries2 = [],
    yTicks = [],
}) {

    // X축 min/max 자동 계산 (데이터 기반)
    const allX = useMemo(() => {
        const arr = [
            ...minuteSeries1.map(d => new Date(d.x)),
            ...minuteSeries2.map(d => new Date(d.x)),
        ].filter(d => !isNaN(d));

        return arr;
    }, [minuteSeries1, minuteSeries2]);

    const xMin = allX.length ? new Date(Math.min(...allX)) : null;
    const xMax = allX.length ? new Date(Math.max(...allX)) : null;

    // x축 양 옆 5분 여백 주는 버전
    // const xMin = allX.length
    //     ? new Date(Math.min(...allX) - 5 * 60 * 1000)
    //     : null;

    // const xMax = allX.length
    //     ? new Date(Math.max(...allX) + 5 * 60 * 1000)
    //     : null;

    const data1 = useMemo(() => minuteSeries1, [minuteSeries1]);
    const bars2 = useMemo(() => minuteSeries2, [minuteSeries2]);

    const allowedHHMM = useMemo(() => {
        if (!xMin || !xMax) return new Set();

        const total = xMax - xMin;
        const step = total / 4; // 총 5개 tick (start / 25% / 50% / 75% / end)

        const stamps = [
            new Date(xMin),
            new Date(xMin.getTime() + step),
            new Date(xMin.getTime() + step * 2),
            new Date(xMin.getTime() + step * 3),
            new Date(xMax),
        ];

        const toHHMM = (d) =>
            `${String(d.getHours()).padStart(2, '0')}:${String(d.getMinutes()).padStart(2, '0')}`;

        return new Set(stamps.map(toHHMM));
    }, [xMin, xMax]);

    const datas = useMemo(() => ({
        datasets: [
            // {
            //     label: '예측치',
            //     data: data1,     // minuteSeries1 = 예측치 (bar)
            //     type: 'bar',
            //     backgroundColor: 'rgba(94, 156, 255, 0.40)',
            //     borderColor: '#5E9CFF',
            //     borderWidth: 1,
            //     barThickness: 12,
            // },
            {
                label: '실측치',
                data: bars2,     // minuteSeries2 = 실측치 (line)
                type: 'line',
                borderColor: '#FFAE5E',
                backgroundColor: '#FFAE5E',
                fill: false,
                borderWidth: 1,
                lineTension: 0,
                pointRadius: 0,
                pointHoverRadius: 3,   // hover 시 크게 표시
                pointHitRadius: 20,
            },
        ]
    }), [data1, bars2]);

    const highlightPlugin = {
        beforeDraw: function (chart) {
            if (!yTicks || yTicks.length < 6) return;

            const ctx = chart.ctx;
            const yScale = chart.scales['y-axis-0'];
            const { left, right, top: areaTop, bottom: areaBottom } = chart.chartArea;

            let ranges = [];

            if (type === "sump") {
                ranges = [
                    [yTicks[0], yTicks[1], 'rgba(255, 60, 60, 0.20)', 'rgba(255, 60, 60, 0.32)'],
                    [yTicks[1], yTicks[2], 'rgba(255, 199, 58, 0.20)', 'rgba(255, 199, 58, 0.32)'],
                    [yTicks[4], yTicks[5], 'rgba(255, 199, 58, 0.20)', 'rgba(255, 199, 58, 0.32)'],
                    [yTicks[5], yTicks[6], 'rgba(255, 60, 60, 0.20)', 'rgba(255, 60, 60, 0.32)'],
                ];
            } else {
                ranges = [
                    [yTicks[1], yTicks[2], 'rgba(73, 113, 255, 0.20)', 'rgba(73, 113, 255, 0.32)'],
                    [yTicks[2], yTicks[3], 'rgba(255, 199, 58, 0.20)', 'rgba(255, 199, 58, 0.32)'],
                    [yTicks[3], yTicks[4], 'rgba(252, 107, 25, 0.20)', 'rgba(252, 107, 25, 0.32)'],
                    [yTicks[4], yTicks[5], 'rgba(255, 60, 60, 0.20)', 'rgba(255, 60, 60, 0.32)'],
                ];
            }

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

            // sump는 초록색 기준선 유지
            if (type === 'sump' && yTicks.length > 3) {
                const yVal = yTicks[3];
                const yPix = yScale.getPixelForValue(yVal);
                if (yPix >= areaTop && yPix <= areaBottom) {
                    ctx.beginPath();
                    ctx.moveTo(left, yPix);
                    ctx.lineTo(right, yPix);
                    ctx.lineWidth = 1;
                    ctx.strokeStyle = '#37B44A';
                    ctx.setLineDash([2, 2]);
                    ctx.stroke();
                }
            }

            ctx.restore();
        }
    };

    const options = useMemo(() => ({
        maintainAspectRatio: false,
        scales: {
            xAxes: [
                {
                    id: 'x-axis-0',
                    type: 'time',
                    time: {
                        unit: 'minute',
                        stepSize: 15,
                        displayFormats: { minute: 'HH:mm' },
                        min: xMin,
                        max: xMax,
                    },
                    ticks: {
                        fontColor: '#CECFD2',
                        fontSize: 9,
                    },
                    gridLines: {
                        color: 'rgba(255,255,255,0)',
                        zeroLineColor: 'rgba(255,255,255,0.20)',
                    }
                }
            ],
            yAxes: [
                {
                    id: 'y-axis-0',
                    ticks: {
                        min: yTicks.length ? Math.min(...yTicks) : undefined,
                        max: yTicks.length ? Math.max(...yTicks) : undefined,
                        callback: v => v,
                        fontColor: '#CECFD2',
                        fontSize: 9,
                    },
                    afterBuildTicks: (axis) => {
                        if (yTicks.length > 0) axis.ticks = yTicks;
                    },
                    gridLines: {
                        color: 'rgba(255,255,255,0)',
                        zeroLineColor: 'rgba(255,255,255,0.20)',
                    }
                }
            ]
        },
        legend: {
            display: true,
            position: 'top',
            align: 'end',
            labels: {
                fontColor: '#FFF',
                fontSize: 9,
                boxWidth: 8,
                boxHeight: 8,
            }
        },
        tooltips: {
            enabled: true,
            mode: 'index',
            intersect: false,
            backgroundColor: '#fff',
            titleFontSize: 12,
            titleFontColor: '#000',
            bodyFontSize: 12,
            bodyFontColor: '#000',
            callbacks: {
                title: function (items, data) {
                    const p = data.datasets[items[0].datasetIndex].data[items[0].index];
                    const d = new Date(p.x);
                    return `${d.getHours().toString().padStart(2,'0')}:${d.getMinutes().toString().padStart(2,'0')}`;
                },
                label: function (item, data) {
                    const ds = data.datasets[item.datasetIndex];
                    return `${ds.label}: ${item.value}`;
                }
            }
        }
    }), [xMin, xMax, allowedHHMM, yTicks]);


    return (
        <Line
            data={datas}
            options={options}
            plugins={[highlightPlugin]}
        />
    );
}

export default PMSensorLineChart;