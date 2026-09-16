import React, { Component } from 'react';
import { PowerSituationComponent } from '../styled/dashboardStyled';

class PowerSituation extends Component {

    constructor(props){
        super(props);

        this.state = {
        }
    }
    
    getPowerListUI = () => {
        let ui = [];
        const items = [
            { id: '1', title: '수원 국사', place: '경기도', percent: 43, value: 450, color: '#4BE5DD' },
            { id: '2', title: '발산 국사', place: '서울특별시', percent: 33, value: 380, color: '#4386FB' },
            { id: '3', title: '부산 국사', place: '부산광역시', percent: 21, value: 290, color: '#985EFF' },
            { id: '4', title: '마곡 국사', place: '서울특별시', percent: 19, value: 250, color: '#95A4F5' },
        ]

        if(items.length > 0){
            for(let i = 0; i < items.length; i++){
                ui.push(
                    <div className={'powerListBox'} key={items[i].id}>
                        <div className={'powerChartTitle'}>
                            <span>{items[i].id}</span>
                            <span>{items[i].title}</span>
                            <span>{items[i].place}</span>
                            <span>{items[i].value}<p>kW</p></span>
                        </div>
                        <div className={'powerChartBox'}>
                            <div id="myProgress">
                                <div id="myBar" style={{ width: items[i].percent + "%", background: items[i].color }}></div>
                            </div>
                        </div>
                    </div>
                );
            }
        }
        return ui;
    }


    render(){
        const powerListUI = this.getPowerListUI();

        return (
            <PowerSituationComponent>
                <div className={'powerSituationTitle'}>
                    <span className={'powerIcon'}></span>
                    <span className={'powerTitle'}>소모 전력 현황</span>
                </div>
                <div className={'powerListArea'}>
                    {powerListUI}
                </div>
            </PowerSituationComponent>
        );
    }
}

export default PowerSituation;

