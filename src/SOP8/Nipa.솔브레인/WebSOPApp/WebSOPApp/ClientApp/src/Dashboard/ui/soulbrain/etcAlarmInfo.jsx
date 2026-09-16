import React, { Component } from 'react';
import $ from 'jquery';

import dashboard from '../../css/dashboardNew.module.css';


class EtcAlarmInfo extends Component {
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


     displayEtcAlarmUI = () => {
        let etcAlarmUI1 = [];
         let etcAlarmUI2 = [];
         let etcAlarmUI3 = [];
         let etcAlarmUI4 = [];

        const alarms = this.props.alarms;

        if (alarms === null || alarms === undefined)
            return [etcAlarmUI1, etcAlarmUI2];

        for (let i = 0; i < 40; i++) {
            const alarm = alarms[i];

            if (alarm === null || alarm === undefined || alarm.typeName === "수동신고") {
                if (i < 10)
                    etcAlarmUI1.push(<tr key={"etc_" + i}><td>-</td><td>-</td></tr>); 
                else if (i > 9 && i < 20)
                    etcAlarmUI2.push(<tr key={"etc_" + i}><td>-</td><td>-</td></tr>);
                else if (i > 19 && i < 30)
                    etcAlarmUI3.push(<tr key={"etc_" + i}><td>-</td><td>-</td></tr>);
                else if (i > 29 && i < 40)
                    etcAlarmUI4.push(<tr key={"etc_" + i}><td>-</td><td>-</td></tr>);
            } else {
                if (i < 10)
                    etcAlarmUI1.push(<tr key={"etc_" + i}><td>{alarm.typeName}</td><td><span className={dashboard.fontRed}>{alarm.typeValue}</span></td></tr>); 
                else if (i > 9 && i < 20)
                    etcAlarmUI2.push(<tr key={"etc_" + i}><td>{alarm.typeName}</td><td><span className={dashboard.fontRed}>{alarm.typeValue}</span></td></tr>);
                else if (i > 19 && i < 30)
                    etcAlarmUI3.push(<tr key={"etc_" + i}><td>{alarm.typeName}</td><td><span className={dashboard.fontRed}>{alarm.typeValue}</span></td></tr>);
                else if (i > 29 && i < 40)
                    etcAlarmUI4.push(<tr key={"etc_" + i}><td>{alarm.typeName}</td><td><span className={dashboard.fontRed}>{alarm.typeValue}</span></td></tr>);
            }
        }

         return [etcAlarmUI1, etcAlarmUI2, etcAlarmUI3, etcAlarmUI4];
    } 


    render() {
        const [alarmCount, manualReportCount] = this.getAlarmCount();
        const [etcAlarmUI1, etcAlarmUI2, etcAlarmUI3, etcAlarmUI4] = this.displayEtcAlarmUI();


        return (
            <>
                <div className={dashboard.fiftyDivArea}>
                    <div className={dashboard.etcBox}>
                        <div className={dashboard.etcBoxTitle}>ETC</div>
                        <div className={dashboard.etcFlexBorder}>
                            <div className={dashboard.etcfirstFlex}>
                                <div className={dashboard.etcTotal}>
                                    <div>합계: <span className={dashboard.etcTotalNum}>{alarmCount}</span></div>
                                    <div>수동신고: <span className={dashboard.etcTotalNum}>{manualReportCount}</span></div>
                                </div>
                                <table>
                                    <thead className={dashboard.etcTbody1}>
                                        {etcAlarmUI1}
                                    </thead>
                                    <tbody className={dashboard.etcTbody2}>
                                        {etcAlarmUI2}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                        <div className={dashboard.etcSecondFlex}>
                            <table>
                                <thead className={dashboard.etcTbody3}>
                                    {etcAlarmUI3 }
                                </thead>
                                <tbody className={dashboard.etcTbody4}>
                                    {etcAlarmUI4}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </>
        );
    }
}
export default EtcAlarmInfo;