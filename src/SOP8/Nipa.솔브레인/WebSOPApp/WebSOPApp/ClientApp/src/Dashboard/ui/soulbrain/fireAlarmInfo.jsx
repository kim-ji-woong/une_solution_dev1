import React, { Component } from 'react';
import $ from 'jquery';

import dashboard from '../../css/dashboardNew.module.css';

class FireAlarmInfo extends Component {
    constructor(props) {
        super(props);

        this.props = props;
    }

    getAlarmCount = () => {
        const alarms = this.props.alarms;
        let alarmCount = 0;
        let manualReportCount = 0;

        if (alarms === null || alarms === undefined)
            return alarmCount;

        for (let i = 0; i < alarms.length; i++) {
            const alarm = alarms[i];

            if (alarm.typeName === "수동신고")
                manualReportCount = alarm.typeValue;

            alarmCount += alarm.typeValue;
        }

        return [alarmCount, manualReportCount];
    }

    displayAlarmUI = () => {
        let alarmUI = [];
        const alarms = this.props.alarms;

        if (alarms === null || alarms === undefined)
            return alarmUI;

        for (let i = 0; i < 8; i++) {
            const alarm = alarms[i];

            if (alarm === null || alarm === undefined || alarm.typeName === "수동신고") {
                alarmUI.push(<tr key={"fire_" + i}><td>-</td><td>-</td></tr>);
            } else {
                if (alarm.typeName === "일반") {
                    alarmUI.push(<tr key={"fire_" + i}><td className={dashboard.GeneralTableIcon}>{alarm.typeName}</td><td><span className={dashboard.fontRed}>{alarm.typeValue}</span></td></tr>);
                } else if (alarm.typeName === "열") {
                    alarmUI.push(<tr key={"fire_" + i}><td className={dashboard.FireTableIcon}>{alarm.typeName}</td><td><span className={dashboard.fontRed}>{alarm.typeValue}</span></td></tr>);
                } else if (alarm.typeName === "연기") {
                    alarmUI.push(<tr key={"fire_" + i}><td className={dashboard.SmokeTableIcon}>{alarm.typeName}</td><td><span className={dashboard.fontRed}>{alarm.typeValue}</span></td></tr>);
                } else if (alarm.typeName === "불꽃") {
                    alarmUI.push(<tr key={"fire_" + i}><td className={dashboard.FlameTableIcon}>{alarm.typeName}</td><td><span className={dashboard.fontRed}>{alarm.typeValue}</span></td></tr>);
                }
            }
        }

        return alarmUI;
    }

    render() {
        
        const [alarmCount, manualReportCount] = this.getAlarmCount();
        const alarmUI = this.displayAlarmUI();

        return (
            <div className={dashboard.secondDivArea}>
                <div className={dashboard.fireBox}>
                    <div className={dashboard.fireBoxTitle}>화재센서</div>
                    <div className={dashboard.fireTotal}>
                        <div >합계: <span className={dashboard.fireTotalNum}>{alarmCount}건</span></div>
                        <div >수동신고: <span className={dashboard.fireTotalNum}>{manualReportCount}건</span></div>
                    </div>
                    <div className={dashboard.fireFlexBox}>
                        <table>
                            <tbody>
                                {alarmUI}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        );
    }
}
export default FireAlarmInfo;