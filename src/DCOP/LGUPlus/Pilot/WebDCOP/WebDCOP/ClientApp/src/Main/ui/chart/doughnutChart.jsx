import React, { Component } from 'react';

import { Doughnut } from 'react-chartjs-2';

class DoughnutChart extends Component {

    getDoughnutData = () => {
        const colors = this.props.colors;
        let labels = this.props.labels;
        let datasets = this.props.datasets;
        let datas = [];

        const options = {
            // layout: {
            //     padding: {
            //         top: 20
            //     }
            // },
            responsive: false,
            aspectRatio: 1,
            cutoutPercentage: 60, // 도넛 굵기
            legend: {
                display: false,
            },
            tooltips: {
                enabled: false,
            },
            hover: {
                mode: null
            },
            // animation: {
            //     duration: 0
            // }
        };

        datas = {
            labels,
            datasets: [
                { 
                    data: datasets,
                    backgroundColor: colors,
                    borderWidth: 0, // border 삭제
                },
            ], 
        };

        return [datas, options];
    }

    render() {
        const [datas, options] = this.getDoughnutData();

        return (
            <Doughnut 
                width={88}  
                height={88}
                data={datas} 
                options={options}
            />
        );
    }
}

export default DoughnutChart;