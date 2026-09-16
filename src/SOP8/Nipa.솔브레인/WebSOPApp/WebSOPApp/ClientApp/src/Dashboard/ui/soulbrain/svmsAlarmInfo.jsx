import React, { Component } from 'react';
import $ from 'jquery';

import dashboard from '../../css/dashboardNew.module.css';

class SVMSAlarmInfo extends Component {
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

    displaySMVSAlarmUI = () => {
        let SVMSAlarmUI1 = [];
        let SVMSAlarmUI2 = [];
        const alarms = this.props.alarms;

        if (alarms === null || alarms === undefined)
            return [SVMSAlarmUI1, SVMSAlarmUI2];

        for (let i = 0; i < 16; i++) {
            const alarm = alarms[i];

            if (alarm === null || alarm === undefined) {
                if (i < 8)
                    SVMSAlarmUI1.push(<tr key={"svms_" + i}><td>-</td><td>-</td></tr>);
                else
                    SVMSAlarmUI2.push(<tr key={"svms_" + i}><td>-</td><td>-</td></tr>);
            } else {
                if (i < 8)
                    SVMSAlarmUI1.push(<tr key={"svms_" + i}><td>{alarm.typeName}</td><td><span className={dashboard.fontRed}>{alarm.typeValue}</span></td></tr>);
                else
                    SVMSAlarmUI2.push(<tr key={"svms_" + i}><td>{alarm.typeName}</td><td><span className={dashboard.fontRed}>{alarm.typeValue}</span></td></tr>);
            }
        }

        return [SVMSAlarmUI1, SVMSAlarmUI2];
    }

    render() {
        
        const alarmCount = this.getAlarmCount();
        const [SVMSAlarmUI1, SVMSAlarmUI2] = this.displaySMVSAlarmUI();

        return (
            <>
                
                <div className={dashboard.thirdDivArea}>
                    <div className={dashboard.IntellBox}>
                        <div className={dashboard.IntellBoxTitle}>지능형 영상</div>
                        <div className={dashboard.IntellLeft}>
                            <div className={dashboard.IntellTotal}>합계: <span className={dashboard.IntellTotalNum}>{alarmCount}건</span></div>
                            <div className={dashboard.IntellLeftFlex}>
                                <table>
                                    <tbody>
                                        {SVMSAlarmUI1}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                        <div className={dashboard.IntellRight}>
                            <div className={dashboard.IntellRightFlex}>
                                <table>
                                    <tbody>
                                        {SVMSAlarmUI2}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                </div>
            </>
        );
    }
}
export default SVMSAlarmInfo;