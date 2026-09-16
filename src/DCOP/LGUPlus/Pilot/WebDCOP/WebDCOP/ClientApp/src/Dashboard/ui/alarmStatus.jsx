import React, { Component } from 'react';
import { AlarmStatusComponent } from '../styled/dashboardStyled';
import { Doughnut } from 'react-chartjs-2';

class AlarmStatus extends Component {

    constructor(props){
        super(props);
    }

    getDoughnutData = (item) => {
        let doughnutUI = [];

        const options = {
            responsive: false,
            aspectRatio: 1,
            cutoutPercentage: 55, 
            legend: {
                display: false
            },
            layout: {
                padding: {
                    left: 0,
                    right: 0,
                    top: 0,
                    bottom: 0,
                }
            },
            tooltips: {
                enabled: false
            },
            hover: {
                mode: null
            },
            animation: {
                duration: 0
            }
        };

        const backgroundData = 100 - item.total;

        const data = () => {
            return {
                labels: ['1', '2', '3', '4'],     
                datasets: [
                    {
                        type: 'doughnut',
                        label: '알람 발생 현황',
                        data: [backgroundData, item.total],
                        backgroundColor: ['#222B33', item.color],
                        borderWidth: 0, // border 삭제
                        fontFamily: 'Spoqa Han Sans Neo',
                        fontSize: '11px',
                        lineTension: 0
                    },
                ],
            }
        };

        doughnutUI.push(
            <Doughnut 
                key={"doughnutChart"} 
                options={options} 
                data={data} 
                width={60} 
                height={60}
            />);
        return [doughnutUI];
    }

    getAlarmStatusList = () => {
        let ui = [];
        const items = [
            { num: '1', title: '발산 국사', place: '서울특별시', total: 16, color: '#4BE5DD' },
            { num: '2', title: '마곡 국사', place: '서울특별시', total: 11, color: '#4386FB'},
            { num: '3', title: '수원 국사', place: '경기도', total: 8, color: '#985EFF' },
            { num: '4', title: '강릉 국사', place: '강원특별자치도', total: 6, color: '#95A4F5'}
        ];
        
        if(items.length > 0){
            for(let i = 0; i < items.length; i++){
                const [doughnutUI] = this.getDoughnutData(items[i]);

                ui.push(
                    <div className={'alarmListBox'} key={items[i].num}>
                        <div className={'chartTitle'}>
                            <span>{items[i].num}</span>
                            <span>{items[i].title}</span>
                            <span>{items[i].place}</span>
                        </div>
                        <div className={'alarmChartBox'}>
                            <div style={{ position: 'relative', left: '30px' }}>
                                {doughnutUI}
                            </div>
                            <span>{items[i].total}<p>건</p></span>
                        </div>
                    </div>
                );
            }
        }
        return ui;
    }


    render(){
        const alarmStatusList = this.getAlarmStatusList();

        return (
            <AlarmStatusComponent>
                <div className={'alarmStatusTitle'}>
                    <span className={'alarmIcon'}></span>
                    <span className={'alarmTitle'}>알람 발생 현황</span>
                </div>
                <div className={'alarmListArea'}>
                    {alarmStatusList}
                </div>
            </AlarmStatusComponent>
        );
    }
}

export default AlarmStatus;
