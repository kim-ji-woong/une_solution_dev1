import React, { Component } from 'react';
import { ChangeManagementComponent } from '../styled/dashboardStyled';

class ChangeManagement extends Component {

    constructor(props){
        super(props);

        this.state = {
        }
    }

    getChangeListUI = () => {
        let ui = [];
        const changeManagementList = {
            id: 'changeList1',
            items: [
                { num: '1', time: '2024-02-06 13:36:00', name: '랙 변경', place: '수원 국사' },
                { num: '2', time: '2024-02-06 10:36:00', name: 'IT장비 변경', place: '발산 국사' },
                { num: '3', time: '2024-02-06 09:36:00', name: '랙 변경', place: '평택 국사' },
            ]
        }

        if(changeManagementList.items.length > 0){
            for(let i = 0; i < changeManagementList.items.length; i++){
                ui.push(
                    <div className={'changeListBox'} key={changeManagementList.items[i].num}>
                        <div className={'changeListTitle'}>
                            <span>{changeManagementList.items[i].num}</span>
                            <span>{changeManagementList.items[i].time} / </span>
                            <span>{changeManagementList.items[i].name}</span>
                            <span>{changeManagementList.items[i].place}</span>
                        </div>
                    </div>
                );
            }
        }
        return ui;
    }

    render(){
        const changeListUI = this.getChangeListUI();

        return(
            <ChangeManagementComponent>
                <div className={'changeManagementTitle'}>
                    <span className={'changeIcon'}></span>
                    <span className={'changeTitle'}>변경 관리 현황</span>
                </div>
                <div className={'changeListArea'}>
                    {changeListUI}
                </div>
            </ChangeManagementComponent>
        );
    }
}

export default ChangeManagement;