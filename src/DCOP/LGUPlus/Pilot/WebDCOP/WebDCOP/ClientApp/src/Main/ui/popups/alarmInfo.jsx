import React, { Component } from 'react';
import { AlarmInfoComponent } from '../../styled/mainStyled';
import MainResource from '../../resource/id';

class AlarmInfo extends Component {
    constructor(props) {
        super(props);

        this.state = {
            showAlarms: false
        }
    }

    getRackInfo = (rackNo) => {
        let rackData = null;
        const rackGroups = this.props.rackGroups;

        if (rackGroups) {
            for (const rackGroup of this.props.rackGroups) {
                for (const rack of rackGroup.racks) {
                    if (rack.rackNo === rackNo) {
                        rackData = rack;
                    }
                }
            }
        }

        return rackData;
    }

    getItemInfo = (itemNo) => {
        let itemData = null;
        const itemList = this.props.itemList;

        if (itemList) {
            for (const item of itemList) {
                if (item.itemNo === itemNo) {
                    itemData = item;
                }
            }
        }

        return itemData;
    }

    getAlarmUI = () => {
        const sensorAlarms = this.props.sensorAlarms;
        let ui = [];
        
        if (sensorAlarms && sensorAlarms.length > 0) {
            for (let alarm of sensorAlarms) {
                const date = MainResource.getDate(alarm.alarmTime); 
                const rackData = this.getRackInfo(alarm.rackNo);
                const itemData = this.getItemInfo(alarm.itemNo);

                if (rackData === null) {
                    continue;
                }

                let className = '';
                if (alarm.alarmType === '고온') {
                    className = 'temperature';
                }
                else if (alarm.alarmType === '저전력') {
                    className = 'power';
                }

                ui.push(
                    <div 
                        key={alarm.alarmNo} 
                        className={this.props.selectedStatusInfo?.item?.itemNo === alarm.itemNo ? 'on' : null}
                        onClick={() => this.props.setSelectedAlarm(alarm)}
                    >
                        <p className={className}>{alarm.alarmType}</p>
                        <ul>
                            <li>발생일시 : {date}</li>
                            <li>발생위치 : {rackData.rackName} &gt; R_{itemData.uPos}</li>
                        </ul>
                        {
                            this.props.selectedStatusInfo?.item?.itemNo === alarm.itemNo &&
                                <button 
                                    className={this.props.showAlarmDetailPopup ? 'on' : null}
                                    onClick={() => this.props.handleModalPopup('alarmDetail', true)}
                                >
                                    더보기
                                </button>
                        }
                    </div>
                );
            }
        }

        return ui;
    }

    handleAlramsUI = () => {
        this.setState({ showAlarms: !this.state.showAlarms });
    }

    render() {
        const alarmCount = this.props.sensorAlarms ? this.props.sensorAlarms?.length : '-';

        return (
            <AlarmInfoComponent>
                <div
                    className={`UI_Section btnWrap ${alarmCount > 0 && 'on'}`}
                    style={{ userSelect: alarmCount > 0 ? 'all' : 'none' }}
                    onClick={() => {
                        if (alarmCount > 0) {
                            this.handleAlramsUI();
                        }
                    }}
                >
                    <button style={{ border: this.state.showAlarms ? '1px solid #CECFD2' : '1px solid #444A57' }}>알람 상세보기</button>
                    <div className='badge'>{alarmCount}</div>
                </div>
                <div className='UI_Section cardWrap' style={{ display: this.state.showAlarms && alarmCount > 0 ? 'block' : 'none' }}>
                    {this.getAlarmUI()}
                </div>
            </AlarmInfoComponent>
        );
    }
}

export default AlarmInfo;