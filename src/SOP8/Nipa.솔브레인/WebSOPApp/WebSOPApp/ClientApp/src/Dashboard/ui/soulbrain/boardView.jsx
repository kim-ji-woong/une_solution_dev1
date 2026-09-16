import React, { Component } from 'react';
import $ from 'jquery';

import AlarmComponet from './alarmComponet';
import ProjectResource from '../../../Root/resource/id';

import dashboard from '../../css/dashboardNew.module.css';
import dashboardImage from '../../css/image/solbrain06.jpg';

class BoardView extends Component {
    constructor(props) {
        super(props);

        this.props = props;
    }

    displaySiteUI = () => {
        let displaySiteUI = [];

        displaySiteUI.push(
            <div key='boardViewSB' className={dashboard.boardView}>
                <span className={dashboard.imageFilter} id={dashboard.def}></span>
                <img src={dashboardImage} alt="솔브레인 항공사진" className={dashboard.dashboardImage} id={dashboard.ghi} />

                <div className={dashboard.sensorBox}>
                    <div className={dashboard.redCircle1}></div>
                    <div className={dashboard.redLine1}></div>
                    <AlarmComponet buildingGroupID={1} buildingID={null} type={this.props.type} changeType={this.props.changeType} todayAlarms={this.props.todayAlarms} selectSensors={this.props.selectSensors} buildingGroupList={this.props.buildingGroupList} />
                </div>
                <div className={dashboard.sensorBox}>
                    <div className={dashboard.redCircle2}></div>
                    <div className={dashboard.redLine2}></div>
                    <AlarmComponet buildingGroupID={2} buildingID={null} type={this.props.type} changeType={this.props.changeType} todayAlarms={this.props.todayAlarms} selectSensors={this.props.selectSensors} buildingGroupList={this.props.buildingGroupList} />
                </div>
                <div className={dashboard.sensorBox}>
                    <div className={dashboard.redCircle3}></div>
                    <div className={dashboard.redLine3}></div>
                    <AlarmComponet buildingGroupID={3} buildingID={null} type={this.props.type} changeType={this.props.changeType} todayAlarms={this.props.todayAlarms} selectSensors={this.props.selectSensors} buildingGroupList={this.props.buildingGroupList} />
                </div>
                <div className={dashboard.sensorBox}>
                    <div className={dashboard.redCircle4}></div>
                    <div className={dashboard.redLine4}></div>
                    <AlarmComponet buildingGroupID={4} buildingID={null} type={this.props.type} changeType={this.props.changeType} todayAlarms={this.props.todayAlarms} selectSensors={this.props.selectSensors} buildingGroupList={this.props.buildingGroupList} />
                </div>
                <div className={dashboard.sensorBox}>
                    <div className={dashboard.redCircle5}></div>
                    <div className={dashboard.redLine5}></div>
                    <AlarmComponet buildingGroupID={5} buildingID={null} type={this.props.type} changeType={this.props.changeType} todayAlarms={this.props.todayAlarms} selectSensors={this.props.selectSensors} buildingGroupList={this.props.buildingGroupList} />
                </div>
                <div className={dashboard.sensorBox}>
                    <div className={dashboard.redCircle6}></div>
                    <div className={dashboard.redLine6}></div>
                    <AlarmComponet buildingGroupID={6} buildingID={null} type={this.props.type} changeType={this.props.changeType} todayAlarms={this.props.todayAlarms} selectSensors={this.props.selectSensors} buildingGroupList={this.props.buildingGroupList} />
                </div>
                <div className={dashboard.sensorBox}>
                    <div className={dashboard.redCircle7}></div>
                    <div className={dashboard.redLine7}></div>
                    <AlarmComponet buildingGroupID={7} buildingID={null} type={this.props.type} changeType={this.props.changeType} todayAlarms={this.props.todayAlarms} selectSensors={this.props.selectSensors} buildingGroupList={this.props.buildingGroupList} />
                </div>
                <div className={dashboard.sensorBox}>
                    <div className={dashboard.redCircle7_1}></div>
                    <div className={dashboard.redLine7_1}></div>
                    <AlarmComponet buildingGroupID={13} buildingID={null} type={this.props.type} changeType={this.props.changeType} todayAlarms={this.props.todayAlarms} selectSensors={this.props.selectSensors} buildingGroupList={this.props.buildingGroupList} />
                </div>
                <div className={dashboard.sensorBox}>
                    <div className={dashboard.redCircle8}></div>
                    <div className={dashboard.redLine8}></div>
                    <AlarmComponet buildingGroupID={10} buildingID={null} type={this.props.type} changeType={this.props.changeType} todayAlarms={this.props.todayAlarms} selectSensors={this.props.selectSensors} buildingGroupList={this.props.buildingGroupList} />
                </div>
                <div className={dashboard.sensorBox}>
                    <div className={dashboard.redCircle9}></div>
                    <div className={dashboard.redLine9}></div>
                    <AlarmComponet buildingGroupID={11} buildingID={null} type={this.props.type} changeType={this.props.changeType} todayAlarms={this.props.todayAlarms} selectSensors={this.props.selectSensors} buildingGroupList={this.props.buildingGroupList} />
                </div>
                <div className={dashboard.sensorBox}>
                    <div className={dashboard.redCircle10}></div>
                    <div className={dashboard.redLine10}></div>
                    <AlarmComponet buildingGroupID={12} buildingID={null} type={this.props.type} changeType={this.props.changeType} todayAlarms={this.props.todayAlarms} selectSensors={this.props.selectSensors} buildingGroupList={this.props.buildingGroupList} />
                </div>
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
export default BoardView;