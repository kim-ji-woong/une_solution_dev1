import React, { Component } from 'react';
import $ from 'jquery';
import { Line } from 'react-chartjs-2';

import { DashboardController } from '../../services/dashboardController';

import dashboard from '../../css/dashboardNew.module.css';

import DashboardResource from '../../resource/id';
import SDMSResource from '../../../SDMS/resource/id';
import ProjectResource from '../../../Root/resource/id';

class WeeklyStatus extends Component {
    constructor(props) {
        super(props);
        this.state = {
            labels: null,
            sensorData: null,
        };
    }

    componentDidMount() {
        const resizableWeeklyStatus = '.' + dashboard.weeklyStatus;
        $(function () {
            $(resizableWeeklyStatus).resizable({ direction: 'left' });
        });
    }

    isSameYMD = (a, b) =>
        a.getFullYear() === b.getFullYear() &&
        a.getMonth() === b.getMonth() &&
        a.getDate() === b.getDate();

    getSensorData() {
        const type = this.props.type;
        const weeklyAlarms = this.props.weeklyAlarms || [];

        const base = [];
        const today = new Date();
        for (let i = 0; i < 7; i++) {
            const d = new Date(today);
            d.setHours(0, 0, 0, 0);
            d.setDate(today.getDate() - i);
            base.push(d); // base[0]=오늘, base[6]=6일 전
        }

        let counts = [0, 0, 0, 0, 0, 0, 0];

        if (weeklyAlarms.length === 0) return counts;

        for (let i = 0; i < weeklyAlarms.length; i++) {
            const w = weeklyAlarms[i];
            if (!w.time) continue;

            const facilityType = w.facilityType ?? w.sensorTypeNo;

            const typeMatch =
                (type === DashboardResource.displayInfoType.FIRE &&
                    facilityType === SDMSResource.facilityType.FIRE) ||
                (type === DashboardResource.displayInfoType.INTELLIGENT &&
                    SDMSResource.isSVMSSensorType(w.sensorSubTypeNo)) ||
                (type === DashboardResource.displayInfoType.PSM &&
                    SDMSResource.isPSMSensorType(facilityType)) ||
                (type === DashboardResource.displayInfoType.ETC &&
                    SDMSResource.isETCSensorType(w.sensorSubTypeNo));

            if (!typeMatch) continue;

            const d = new Date(w.time);
            d.setHours(0, 0, 0, 0);

            for (let idx = 0; idx < 7; idx++) {
                if (this.isSameYMD(d, base[idx])) {
                    const outIdx = 6 - idx; // 6일 전 -> 0, 오늘 -> 6
                    counts[outIdx]++;
                    break;
                }
            }
        }

        return counts;
    }

    getTypeName = () => {
        const type = this.props.type;
        if (type == null) return '-';
        return DashboardResource.displayInfoTypeName(type);
    };

    getDate() {
        const arrDayStr = ['일', '월', '화', '수', '목', '금', '토'];
        const today = new Date();
        const labels = [];

        for (let i = 6; i >= 0; i--) {
            const d = new Date(today);
            d.setDate(today.getDate() - i);
            const s =
                d.getMonth() + 1 + '/' + d.getDate() + ' (' + arrDayStr[d.getDay()] + ')';
            labels.push(s);
        }
        return labels;
    }

    getMaxSensorCount(sensorData) {
        const maxVal = Math.max(10, ...(sensorData || [0]));
        return Math.ceil(maxVal / 10) * 10;
    }

    getLineData() {
        const typeName = this.getTypeName();
        const sensorData = this.getSensorData();
        const maxCount = this.getMaxSensorCount(sensorData);
        const labels = this.getDate();

        const data = {
            labels,
            datasets: [
                {
                    type: 'line',
                    label: typeName,
                    data: sensorData,
                    lineTension: 0,
                    borderColor: '#1465EF',
                    borderWidth: 3,
                    fill: true,
                },
            ],
        };

        const chartOptions = {
            responsive: true,
            responsiveAnimationDuration: 1000,
            maintainAspectRatio: false,
            tooltips: { enabled: true, mode: 'nearest', position: 'average', intersect: false },
            hover: { mode: 'nearest', intersect: true },
            scales: {
                xAxes: [
                    {
                        display: true,
                        scaleLabel: { display: true, fontFamily: 'Montserrat', fontColor: 'rgb(255,255,255)' },
                        ticks: { maxTicksLimit: 7, fontColor: 'rgb(213,214,214)' },
                        gridLines: { color: 'rgb(57,72,81)' },
                    },
                ],
                yAxes: [
                    {
                        display: true,
                        scaleLabel: { display: true, fontFamily: 'Montserrat', fontColor: 'rgb(190,190,190)' },
                        ticks: {
                            beginAtZero: true,
                            maxTicksLimit: 6,
                            min: 0,
                            max: maxCount,
                            fontColor: 'rgb(213,214,214)',
                        },
                        gridLines: { color: 'rgb(57,72,81)' },
                    },
                ],
            },
        };

        const chartLegend = {
            display: false,
            labels: { fontColor: 'rgb(255,255,255)' },
            position: 'top',
        };

        return [
            <Line
                key="lineChart"
                id="lineChart"
                data={data}
                legend={chartLegend}
                options={chartOptions}
            />,
        ];
    }

    getBtnUI = (siteID) => {
        const type = this.props.type;
        let fireBtnClass = dashboard.iconFire;
        let cctvBtnClass = dashboard.iconCCTV;
        let psmBtnClass = dashboard.iconIOT;
        let etcBtnClass = dashboard.iconETC;

        if (type === DashboardResource.displayInfoType.FIRE) {
            fireBtnClass = dashboard.iconFireAct;
        } else if (type === DashboardResource.displayInfoType.INTELLIGENT) {
            cctvBtnClass = dashboard.iconCCTVAct;
        } else if (type === DashboardResource.displayInfoType.PSM) {
            psmBtnClass = dashboard.iconIOTAct;
        } else if (type === DashboardResource.displayInfoType.ETC) {
            etcBtnClass = dashboard.iconETCAct;
        }

        return [
            <ul key="sensor_btnSB">
                <li
                    onClick={() => this.props.changeType(DashboardResource.displayInfoType.FIRE)}
                    className={fireBtnClass}
                >
                    <p>화재</p>
                </li>
                <li
                    onClick={() => this.props.changeType(DashboardResource.displayInfoType.PSM)}
                    className={psmBtnClass}
                >
                    <p>누출</p>
                </li>
                <li
                    onClick={() => this.props.changeType(DashboardResource.displayInfoType.ETC)}
                    className={etcBtnClass}
                >
                    <p>ETC</p>
                </li>
                <li
                    onClick={() => this.props.changeType(DashboardResource.displayInfoType.INTELLIGENT)}
                    className={cctvBtnClass}
                >
                    <p>CCTV</p>
                </li>
            </ul>,
        ];
    };

    displaySiteUI = () => {
        const siteID = ProjectResource.SiteID;
        const [chartUI] = this.getLineData();
        const [btnUI] = this.getBtnUI(siteID);

        return [
            <div key="weekly_statusSB" className={dashboard.weeklyStatus}>
                <div className={dashboard.weeklyTitle}>주간 현황</div>
                <div className={dashboard.weekBox}>
                    <div className={dashboard.graph} id="chart_analysis">
                        {chartUI}
                    </div>
                    <div className={dashboard.weekIconBox}>{btnUI}</div>
                </div>
            </div>,
        ];
    };

    render() {
        const displaySiteUI = this.displaySiteUI();
        return <>{displaySiteUI}</>;
    }
}

export default WeeklyStatus;