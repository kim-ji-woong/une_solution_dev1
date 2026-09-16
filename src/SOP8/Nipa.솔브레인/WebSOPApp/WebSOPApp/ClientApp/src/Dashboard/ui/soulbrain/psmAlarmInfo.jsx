import React, { Component } from 'react';
import $ from 'jquery';

import dashboard from '../../css/dashboardNew.module.css';

class PSMAlarmInfo extends Component {
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

    displayPSMAlarmUI = () => {
        let iotAlarmUI1 = [];
        let iotAlarmUI2 = [];
        let iotAlarmUI3 = [];
        let iotAlarmUI4 = [];

        const alarms = this.props.alarms;

        if (alarms === null || alarms === undefined)
            return [iotAlarmUI1, iotAlarmUI2]; 

        for (let i = 0; i < 40; i++) {
            const alarm = alarms[i];

            if (alarm === null || alarm === undefined || alarm.typeName === "수동신고") {
                if (i < 10)
                    iotAlarmUI1.push(<tr key={"psm_" + i}><td>-</td><td>-</td></tr>);
                else if (i > 9 && i < 20)
                    iotAlarmUI2.push(<tr key={"psm_" + i}><td>-</td><td>-</td></tr>);
                else if (i > 19 && i < 30)
                    iotAlarmUI3.push(<tr key={"psm_" + i}><td>-</td><td>-</td></tr>);
                else if (i > 29 && i < 40)
                    iotAlarmUI4.push(<tr key={"psm_" + i}><td>-</td><td>-</td></tr>);
            } else {
                if (i < 10)
                    iotAlarmUI1.push(<tr key={"psm_" + i}><td>{alarm.typeName}</td><td><span className={dashboard.fontRed}>{alarm.typeValue}</span></td></tr>);
                else if (i > 9 && i < 20)
                    iotAlarmUI2.push(<tr key={"psm_" + i}><td>{alarm.typeName}</td><td><span className={dashboard.fontRed}>{alarm.typeValue}</span></td></tr>);
                else if (i > 19 && i < 30)
                    iotAlarmUI3.push(<tr key={"psm_" + i}><td>{alarm.typeName}</td><td><span className={dashboard.fontRed}>{alarm.typeValue}</span></td></tr>);
                else if (i > 29 && i < 40)
                    iotAlarmUI4.push(<tr key={"psm_" + i}><td>{alarm.typeName}</td><td><span className={dashboard.fontRed}>{alarm.typeValue}</span></td></tr>);

            }
        }

        return [iotAlarmUI1, iotAlarmUI2, iotAlarmUI3, iotAlarmUI4];
    }

    render() {
        
        const [alarmCount, manualReportCount] = this.getAlarmCount();
        const [psmAlarmUI1, psmAlarmUI2, psmAlarmUI3, psmAlarmUI4] = this.displayPSMAlarmUI();

        return (
            <>
                <div className={dashboard.ioTBox}>
                    <div className={dashboard.ioTBoxTitle}>누출 센서 이상 감지</div>
                    <div className={dashboard.ioTFlexBorder}>
                        <div className={dashboard.ioTfirstFlex}>
                            <div className={dashboard.ioTTotal}>
                                <div>합계: <span className={dashboard.ioTTotalNum}>{alarmCount}건</span></div>
                                <div>수동신고: <span className={dashboard.ioTTotalNum}>{manualReportCount}건</span></div>
                            </div>
                            <table>
                                <thead className={dashboard.psmTbody1}>
                                    {psmAlarmUI1}
                                </thead>
                                <tbody className={dashboard.psmTbody2}>
                                    {psmAlarmUI2 }
                                </tbody>
                            </table>
                        </div>
                    </div>
                    <div className={dashboard.ioTSecondFlex}>
                        <table>
                            <thead className={dashboard.psmTbody3}>
                                {psmAlarmUI3}
                            </thead>
                            <tbody className={dashboard.psmTbody4}>
                                {psmAlarmUI4 }
                            </tbody>
                        </table>
                    </div>
                </div>
            </>
        );
    }
}
export default PSMAlarmInfo;