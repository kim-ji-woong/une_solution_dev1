import React from 'react';
import { BoardWeeklyComponent } from '../styled/dashboardStyled';

import { Line } from 'react-chartjs-2';

const BoardWeekly = () => {

    // 차트
    const getLineData = () => {
        const labels = ['1/3(수)', '1/4(목)', '1/5(금)', '1/6(토)', '1/7(일)', '1/8(월)', '1/9(화)'];
        const values = [ 0, 8, 4, 6, 2, 4, 6];

        let maxValue = 10;

        if (values?.length > 0) {
            for (let i = 0; i < values.length; i++) {
                const value = values[i];

                if (maxValue < value) {
                    maxValue = value;
                }
            }

            let temp = maxValue % 5;
            temp = 5 - temp;

            if (temp !== 0 && temp !== 5) {
                maxValue += temp;
            }
        }

        let lineChartUI = [];

        const options = {
            responsive: true,
            maintainAspectRatio: false,
            tooltips: {
                enabled: true,
                backgroundColor: '#0E162D',
                bodyFontSize: 14,
                bodyFontFamily: "Pretendard",
                padding: 3,
                displayColors: false,
                cornerRadius: 5,
                padding: 3,
                callbacks: {
                    title: function() {
                        return null; // labels hide
                    },
                    label: (context) => {
                        return `${context.value}건`;
                    }
                },
            },
            plugins: {
                title: {
                    text: 'Chart.js Line Chart',
                },
            },
            legend: {
                display: false
            },
            labels: {
                fontColor: "rgb(255,255,255)",
            },
            position: "left",
            scales: {
                xAxes: [{
                    gridLines: {
                        display: true,
                        color: "rgba(60, 66, 85, 1)",
                    },
                    ticks: {
                        fontSize: 14,
                        fontColor: "#fff",
                        fontFamily: "Pretendard"
                    }
                }],
                yAxes: [{
                    gridLines: {
                        display: true,
                        color: "rgba(60, 66, 85, 1)",
                        zeroLineColor: 'rgba(255, 255, 255, 1)',
                        borderDash: [3, 2],
                    },
                    ticks: {
                        min: 0,                 // 수치 최소값
                        max: maxValue,               // 수치 최대값
                        stepSize: (maxValue/5),           // 열 스탭 사이즈
                        fontSize: 14,
                        fontColor: "#fff",
                        fontFamily: "Pretendard"
                    }
                }],
            },
        };

        const data = (canvas) => {
            const ctx = canvas.getContext("2d");
            const gradient = ctx.createLinearGradient(0, 0, 0, 200);
            const gradient2 = ctx.createLinearGradient(0, 0, 0, 0);
            gradient.addColorStop(0, 'rgba(0,75,185,1)');
            gradient.addColorStop(1, 'rgba(25,165,255,0)');
            gradient2.addColorStop(0, 'rgba(25,165,255,0)');
            gradient2.addColorStop(1, 'rgba(25,165,255,0)');

            return {
                labels,         // 라벨 배열
                datasets: [
                    {
                        label: '기간별 이벤트 발생 건수',
                        data: values,        // 데이터 값 배열
                        borderColor: 'transparent',
                        backgroundColor: gradient,
                        borderWidth: 2,
                        pointBorderColor: '#fff',
                        fontFamily: 'Pretendard',
                        fontSize: '11px',
                        lineTension: 0
                    },
                ],
            }
        };

        lineChartUI.push(<Line key={"lineChart"} options={options} data={data} style={{ position: 'absolute', width: '100vw', height: '30vh' }} />);
        return [lineChartUI];
    }

    return (
        <BoardWeeklyComponent className='weekly-area'>
            <h2>기간별 이벤트 발생 건수</h2>

            <div className='chartWrap'>
                {getLineData()}
            </div>
        </BoardWeeklyComponent>
    );
};

export default BoardWeekly;