import React, { Component } from 'react';
import $ from 'jquery';

import OperationBox from './operationBox';
import BoardView from './boardView';
import WeatherBox from './weatherBox';
import WeeklyStatus from './weeklyStatus';
import AlarmInfomation from './alarmInfomation';
import DashboardResource from '../../resource/id';
import ProjectResource from '../../../Root/resource/id';

import dashboard from '../../css/dashboardNew.module.css';

class Mainboard extends Component {
    constructor(props) {
        super(props);

        this.state = {
            type: DashboardResource.displayInfoType.FIRE,
        }

        this.props = props;
    }

    changeType = (type) => {
        this.setState({ type: type});
    }

    displaySiteUI = () => {
        let displaySiteUI = [];

        displaySiteUI.push(
            <div key='leftFlexAreaSB' className={dashboard.leftFlexArea}>

                <OperationBox currentWork={this.props.workPermit} />

                <WeatherBox />

                <BoardView
                    type={this.state.type}
                    changeType={this.changeType}
                    todayAlarms={this.props.todayAlarms}
                    selectSensors={this.props.selectSensors}
                    buildingGroupList={this.props.buildingGroupList}
                />
                
                <WeeklyStatus
                    type={this.state.type}
                    changeType={this.changeType}
                    weeklyAlarms={this.props.weeklyAlarms}
                />

                <AlarmInfomation
                    selectSensors={this.props.selectSensors}
                    type={this.state.type}
                    changeType={this.changeType}
                    changeMode={this.props.changeMode}
                    selectWeeklyAlarms={this.props.selectWeeklyAlarms}
                />
            </div>
        );

        return displaySiteUI;
    }

    render() {

        const displaySiteUI = this.displaySiteUI();

        return (
            <>
                {   /* 사이트별 UI */
                    displaySiteUI
                }
            </>
        );
    }
}
export default Mainboard;