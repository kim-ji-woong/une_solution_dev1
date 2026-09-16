import React, { Component } from 'react';
import $ from 'jquery';

import dashboard from '../../css/dashboardNew.module.css';

class SafetyAlarmInfo extends Component {
    constructor(props) {
        super(props);

        this.props = props;
    }

    getAlarmCount = () => {
        const alarms = this.props.alarms;
        let alarmCount = 0;

        if (alarms === null || alarms === undefined)
            return alarmCount;

        for (let i = 0; i < alarms.length; i++) {
            const alarm = alarms[i];

            alarmCount += alarm.typeValue;
        }

        return alarmCount;
    }

    displayAlarmUI = () => {
        let alarmUI = [];
        const alarms = this.props.alarms;

        if (alarms === null || alarms === undefined)
            return alarmUI;

        for (let i = 0; i < 8; i++) {
            const alarm = alarms[i];

            if (alarm === null || alarm === undefined) {
                alarmUI.push(<tr key={"safety_" + i}><td>-</td><td>-</td></tr>);
            } else {
                alarmUI.push(<tr key={"safety_" + i}><td>{alarm.typeName}</td><td><span className={dashboard.fontRed}>{alarm.typeValue}</span></td></tr>);
            }
        }

        return alarmUI;
    }

    render() {
        
        const alarmCount = this.getAlarmCount();
        const alarmUI = this.displayAlarmUI();

        return (
            <>

                <div className={dashboard.fourtyDivArea}>
                    <div className={dashboard.safetyBox}>
                        <div className={dashboard.safetyBoxTitle}>세이프티 아이</div>
                        <div className={dashboard.safetyTotal}>합계: <span className={dashboard.safetyTotalNum}>{alarmCount}건</span></div>
                        <div className={dashboard.safetyFlex}>
                            <table>
                                <tbody>
                                    {alarmUI}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>




            </>
        );
    }
}
export default SafetyAlarmInfo;