import { ui } from 'jquery';
import React, { Component } from 'react';
import $ from 'jquery';
import store from '../../../Root/store';

import dashboard from '../../css/dashboardNew.module.css';

import DashboardResource from '../../resource/id';
import ProjectResource from '../../../Root/resource/id';
import SdmsResource from '../../../SDMS/resource/id';

class InfoHeader extends Component {
    constructor(props) {
        super(props);

        this.state = {
            date: null,
            time: null,
            selectDay: [],
        };

        this.props = props;
        this.initDate();

        store.subscribe(function () {
            let data = store.getState();

            if (data.actionType === 'WEATHER_CURRENT') {
                this.reloadDate();
            }
        }.bind(this));
    }

    getSensorsUI = () => {
        const { sensorTypes } = this.props;

        const countSensors = (sensorTypeCode) => {
            const sensorType = sensorTypes?.find((s) => s.sensorTypeCode === sensorTypeCode);
            if (!sensorType) return { total: 0, active: 0 };

            const total = Array.isArray(sensorType.sensors) ? sensorType.sensors.length : 0;
            const active = Array.isArray(sensorType.sensors)
                ? sensorType.sensors.filter((s) => s?.sensor?.enab).length
                : 0;
            return { total, active };
        };

        const fire = countSensors(SdmsResource.facilityType.FIRE);
        const psm = countSensors(SdmsResource.facilityType.PSM_SENSOR);
        const pm = countSensors(SdmsResource.facilityType.PM);
        const ms = countSensors(SdmsResource.facilityType.MOBILE_SCANNER);
        const sump = countSensors(SdmsResource.facilityType.SUMP);
        const etc = countSensors(SdmsResource.facilityType.ETC);
        const cctv = countSensors(SdmsResource.facilityType.CCTV);

        return (
            <>
                <div className={dashboard.infoHeaderTxt}>화재<span className={dashboard.greenText}>{fire.active}</span> / {fire.total}</div>
                <div className={dashboard.infoHeaderTxt}>누출<span className={dashboard.greenText}>{psm.active}</span> / {psm.total}</div>
                <div className={dashboard.infoHeaderTxt}>미세먼지<span className={dashboard.greenText}>{pm.active}</span> / {pm.total}</div>
                <div className={dashboard.infoHeaderTxt}>이동식 스캐너<span className={dashboard.greenText}>{ms.active}</span> / {ms.total}</div>
                <div className={dashboard.infoHeaderTxt}>집수정<span className={dashboard.greenText}>{sump.active}</span> / {sump.total}</div>
                <div className={dashboard.infoHeaderTxt}>ETC<span className={dashboard.greenText}>{etc.active}</span> / {etc.total}</div>
                <div className={dashboard.infoHeaderTxt}>CCTV<span className={dashboard.greenText}>{cctv.active}</span> / {cctv.total}</div>
            </>
        );
    };

    getModeTabUI = (siteID) => {
        const mode = this.props.mode;
        let modeTabUI = [];
        let mainClass = dashboard.synthesis;
        let subClass = dashboard.details;
        let mainSpan = [];
        let subSpan = [];

        if (mode === DashboardResource.mode.main) {
            mainClass = dashboard.synthesis;
            mainSpan.push(<span key={'mainSpan'} className={dashboard.underLine}></span>);
        } else if (mode === DashboardResource.mode.sub) {
            subClass = dashboard.details;
            subSpan.push(<span key={'subSpan'} className={dashboard.underLine}></span>);
        }

        modeTabUI.push(
            <React.Fragment key={'modeTab'}>
                <div
                    key={'mainDiv'}
                    className={mainClass}
                    onClick={() => this.props.changeMode(DashboardResource.mode.main)}
                >
                    종합 현황{mainSpan}
                </div>
                <div
                    key={'subDiv'}
                    className={subClass}
                    onClick={() => this.props.changeMode(DashboardResource.mode.sub)}
                >
                    상세 현황{subSpan}
                </div>
            </React.Fragment>
        );

        return modeTabUI;
    };

    getDate = () => {
        let dt = new Date();
        const arrDayStr = ['일', '월', '화', '수', '목', '금', '토'];

        const year = dt.getFullYear();

        let month = dt.getMonth() + 1;
        if (month < 10) month = '0' + month;

        let day = dt.getDate();
        if (day < 10) day = '0' + day;

        const date = year + '.' + month + '.' + day;

        const dayString = arrDayStr[dt.getDay()];

        let unit = 'am';
        let hours = dt.getHours();
        if (hours < 10) hours = '0' + hours;
        else if (hours > 12) {
            unit = 'pm';
            hours = hours - 12;

            if (hours < 10) hours = '0' + hours;
        }

        let minutes = dt.getMinutes();
        if (minutes < 10) minutes = '0' + minutes;

        const time = dayString + ' ' + hours + ':' + minutes + ' ' + unit;

        return [date, time];
    };

    setSelectDay(index) {
        this.props.changeDay(index);
    }

    initDate = () => {
        const [date, time] = this.getDate();
        this.state.date = date;
        this.state.time = time;
    };

    reloadDate = () => {
        const [date, time] = this.getDate();
        const currentTime = this.state.time;
        const currentDate = this.state.date;

        if (currentTime === null || currentTime === undefined || currentTime !== time) {
            if (currentDate !== date) {
                this.props.reloadDate();
                this.setState({ date: date, time: time });
            } else {
                this.setState({ time: time });
            }
        }
    };

    getWatchDate = () => {
        let date = this.state.date;
        let time = this.state.time;

        if (!date || !time) return ['-', '-'];

        return [date, time];
    };

    getSelectDayUI() {
        let ui = [];
        const selectDay = this.props.selectDay;

        for (let i = 0; i < selectDay.length; i++) {
            ui.push(
                <React.Fragment key={'select_day_' + i}>
                    <input
                        key={'hsmUsr0_input_' + i}
                        type="checkbox"
                        id={'hsmUsr0' + i}
                        defaultChecked={selectDay[i].checked}
                        onChange={() => this.setSelectDay(i)}
                    />
                    <label key={'hsmUsr0_label_' + i} htmlFor={'hsmUsr0' + i}>
                        {selectDay[i].displayText}
                    </label>{' '}
                    &nbsp;
                </React.Fragment>
            );
        }

        return ui;
    }

    displaySiteUI = () => {
        const siteID = ProjectResource.SiteID;
        let displaySiteUI = [];

        const modeTabUI = this.getModeTabUI(siteID);

        const [date, time] = this.getWatchDate();
        const selectDayUI = this.getSelectDayUI();

        displaySiteUI.push(
            <header key="infoHeader" className={dashboard.infoHeader}>
                <div className={dashboard.infoHeaderWrap}>
                    {modeTabUI}
                    <span className={dashboard.clockIcon}></span>
                    <div className={dashboard.titleClock}>
                        {date}
                        <span>{time}</span>
                    </div>
                    <span className={dashboard.selectDay + ' ' + dashboard.dashCheck}>
                        {selectDayUI}
                    </span>
                    <div className={dashboard.infoHeaderTxtArea}>
                        {this.getSensorsUI()}
                    </div>
                </div>
            </header>
        );

        return displaySiteUI;
    };

    render() {
        const displaySiteUI = this.displaySiteUI();
        return <>{displaySiteUI}</>;
    }
}

export default InfoHeader