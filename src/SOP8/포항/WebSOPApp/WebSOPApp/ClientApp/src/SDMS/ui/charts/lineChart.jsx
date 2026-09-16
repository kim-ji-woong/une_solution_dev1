import React from 'react';
import { Line } from 'react-chartjs-2';

function LineChart(props) {

    const getLineData = () => {
        const labels = props.labels;
        const data = props.data;
        
        const datas = {
            labels,
            datasets: [{
                label: 'line chart',
                data: data,
                borderColor: '#0095FF',
                backgroundColor: '#0095FF',
                fill: false,
                borderWidth: 1,
                lineTension: 0,
                pointStyle:'rect',
                pointBorderColor: '#fff'
            }]
        };

        const options = {
            // responsive: false,
            maintainAspectRatio: false,
            drawTicks: false,
            scales: {
                xAxes: [
                    {
                        gridLines: {
                            display: false,
                        },
                        ticks: {
                            fontSize: 10,
                            fontColor: 'lightgrey'
                        }
                    }
                ],
                yAxes: [
                    {
                        gridLines: {
                            drawBorder: false,
                            color: "rgba(255, 255, 255, 0.20)",
                            borderDash: [3, 2],
                        },
                        ticks: {
                            beginAtZero: false,
                            stepSize: 2,
                            fontFamily: "Spoqa Han Sans Neo",
                            fontColor: "rgba(0, 0, 0, 0)",
                            fontSize: 10,
                            callback: function(value) {
                                return parseFloat(value.toFixed(2));
                            }
                        }
                    }
                ]
            },
            legend: {
                display: false,
            },
            tooltips: {
                enabled: true,
                backgroundColor: '#fff',
                bodyFontSize: 12,
                bodyFontFamily: "Spoqa Han Sans Neo",
                bodyFontColor: "#424242",
                bodyFontStyle: "bold",
                //padding: 2,
                displayColors: false,
                cornerRadius: 2,
                padding: 3,
                callbacks: {
                    title: function() {
                        return null; // labels hide
                    },
                    label: (context) => {
                        return `${context.value}${props.unit}`;
                    }
                },
            },
        };

        return [datas, options];
    }

    const [datas, options] = getLineData();

    return (
        <Line 
            key='lineChart'
            data={datas}
            options={options}
            height={90}
        />
    );
}

export default LineChart;