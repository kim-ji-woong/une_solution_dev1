import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';

import PopupDraggable from './popupDraggable';

import { DashboardComponent } from '../../styled/sdmsPopupsStyled';

import SDMSResource from '../../resource/id';

class Dashboard extends Component {
    constructor(props) {
        super(props);

        this.state = {

        }

        this.props = props;
    }

    
    getSensorCount() {
        const sensorList = this.props.sensorList;

        // 전체 센서 수
        let fireSensorCount = 0;
        let cctvSensorCount = 0;
        let emergencyBellSensorCount = 0;

        // 활성화된 센서 수
        let fireSensorEnabledCount = 0;
        let cctvSensorEnabledCount = 0;
        let emergencyBellSensorEnabledCount = 0;

        if (sensorList) {
            for (const sensor in sensorList) {
                if (sensor === 'fireSensors') {
                    fireSensorCount = sensorList[sensor].length;

                    fireSensorEnabledCount = this.getSensorEnabledCount(fireSensorCount, sensorList[sensor]);
                }
                else if (sensor === 'cctvs') {
                    cctvSensorCount = sensorList[sensor].length;

                    cctvSensorEnabledCount = this.getSensorEnabledCount(cctvSensorCount, sensorList[sensor]);
                }
                else if (sensor === 'emergencyBells') {
                    emergencyBellSensorCount = sensorList[sensor].length;

                    emergencyBellSensorEnabledCount = this.getSensorEnabledCount(emergencyBellSensorCount, sensorList[sensor]);
                }
            }
        }

        return [emergencyBellSensorCount, fireSensorCount, cctvSensorCount, emergencyBellSensorEnabledCount, fireSensorEnabledCount, cctvSensorEnabledCount];
    }

    getAlarmCount() {
        let fireAlarmCount = 0;
        let emergencyBellAlarmCount = 0;

        if (alarms) {
            for (const alarm in alarms) {

                if (alarm === 'fireAlarmDatas') {
                    fireAlarmCount = alarms[alarm].length;
                }
                else if (alarm === 'emergencyBellAlarmDatas') {
                    emergencyBellAlarmCount = alarms[alarm].length;
                }
            }
        }

        return [emergencyBellAlarmCount, fireAlarmCount];
    }

    // 활성화된 센서 수 구하기
    getSensorEnabledCount = (allSensorsCount, sensors) => {
        let count = 0;

        if (sensors) {
            for (let i = 0; i < allSensorsCount; i++) {
                
                if (sensors[i].enabled){
                    count++;
                }
            }
        }
        
        return count;
    }

    render() {
        // const [emergencyBellSensorCount, fireSensorCount, cctvSensorCount, emergencyBellSensorEnabledCount, fireSensorEnabledCount, cctvSensorEnabledCount] = this.getSensorCount();
        
        // const [emergencyBellAlarmCount, fireAlarmCount] = this.getAlarmCount();

        return (
            <DashboardComponent id={this.props.popupType} className='UI_Section dashboard'>
                <PopupDraggable
                    id={this.props.popupType}
                    popupMinWidth={700}
                    popupMinHeight={100}
                    topSize={40}
                    popupState={this.props.popupState}
                    setActiveDragPopup={this.props.setActiveDragPopup}
                    setPopupState={this.props.setPopupState}
                    usePopupResize={false}
                >
                    <div className={'dslX'}>
                        <a href="#none">닫기버튼</a>
                    </div>
                    <div className={'viewDashboardSectionConts'}>
                        <div className={'sectionblank'}>
                            <div className={'flexBox'}>
                                <span>{SDMSResource.ID.sensor.fire}</span> ( <span className='greenTxt'>● </span>0 / <span>● </span>0 ) 
                            </div>
                            <div className={'flexBox'}>
                                <span>{SDMSResource.ID.sensor.cctv}</span> ( <span className='greenTxt'>● </span>0 / <span>● </span>0 ) 
                            </div>
                            <div className={'flexBox'}>
                                <span>{SDMSResource.ID.sensor.emergencyBell}</span> ( <span className='greenTxt'>● </span>0 / <span>● </span>0 ) 
                            </div>
                            {/* <div className={'flexBox'}>
                                <span>{SDMSResource.ID.sensor.fire}</span> ( <span className='greenTxt'>● </span>{fireSensorEnabledCount} / <span>● </span>{fireSensorCount} ) 
                            </div>
                            <div className={'flexBox'}>
                                <span>{SDMSResource.ID.sensor.cctv}</span> ( <span className='greenTxt'>● </span>{cctvSensorEnabledCount} / <span>● </span>{cctvSensorCount} ) 
                            </div>
                            <div className={'flexBox'}>
                                <span>{SDMSResource.ID.sensor.emergencyBell}</span> ( <span className='greenTxt'>● </span>{emergencyBellSensorEnabledCount} / <span>● </span>{emergencyBellSensorCount} ) 
                            </div> */}
                        </div>

                        <div className={'viewDashboardTemperature'}>
                            <ul>
                                <li>{SDMSResource.ID.sensor.fire} (0)건</li>
                                {/* <li>{SDMSResource.ID.sensor.fire} ({fireAlarmCount})건</li>
                                <li>{SDMSResource.ID.sensor.emergencyBell} ({emergencyBellAlarmCount})건</li> */}
                            </ul>
                        </div>
                    </div>
                </PopupDraggable>
            </DashboardComponent>  
        );
    }
}

export default withRouter(Dashboard);