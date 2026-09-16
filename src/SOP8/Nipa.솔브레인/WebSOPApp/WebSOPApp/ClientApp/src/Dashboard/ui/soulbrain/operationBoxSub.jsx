import React, { Component } from 'react';
import $ from 'jquery';

import DashboardResource from '../../resource/id';
import dashboard from '../../css/dashboardNew.module.css';

class OperationBoxSub extends Component {
    constructor(props) {
        super(props);

        this.state = {
            type: DashboardResource.operationType.normal,
        }

        this.props = props;
    }

    changeType = (type) => {
        this.setState({ type: type});
    }

    displayOperationUI = () => {
        let type = this.state.type;
        const currentWork = this.props.currentWork;

        let operationUI = [];
        let normal = "";
        let fire = "";
        let high = "";
        let radiation = "";
        let electric = "";
        let welding = "";
        let heavy = "";
        let excavation = "";

        let normalCnt = 0;
        let fireCnt = 0;
        let highCnt = 0;
        let radiationCnt = 0;
        let electricCnt = 0;
        let weldingCnt = 0;
        let heavyCnt = 0;
        let excavationCnt = 0;
        let totaLCnt = 0;

        if (currentWork !== null && currentWork !== undefined) {
            let currentWorkData = null;
            let date = null;

            for (let i = 0; i < currentWork.length; i++) {
                let temp = currentWork[i];

                if (temp.planT_PRCS_ID === "1000") {
                    currentWorkData = temp;
                    date = new Date(temp.updateTime);
                    break;
                }
            }

            if (date !== null && currentWorkData !== null) {
                let today = new Date();

                let second = today.getTime() - date.getTime();
                let minute = second / 1000 / 60;

                if (minute < 30) {
                    normalCnt = currentWorkData.generaL_CNT;
                    fireCnt = currentWorkData.firE_CNT;
                    highCnt = currentWorkData.higH_CNT;
                    radiationCnt = currentWorkData.radI_CNT;
                    electricCnt = currentWorkData.eleC_CNT;
                    weldingCnt = currentWorkData.closenesS_CNT;
                    heavyCnt = currentWorkData.cranE_CNT;
                    excavationCnt = currentWorkData.digG_CNT;
                    totaLCnt = currentWorkData.totaL_CNT;
                }
            }
        }

        //operationUI.push(
        //    <ul>
        //        <li className={normal} onClick={() => this.changeType(DashboardResource.operationType.normal)}><span className={dashboard.generalTitle}>일반</span><div className={dashboard.general} alt="" /><span>-건/-명</span></li>
        //        <li className={fire} onClick={() => this.changeType(DashboardResource.operationType.fire)}><span>화기</span><div className={dashboard.fire} alt="" /><span>-건/-명</span></li>
        //        <li className={high} onClick={() => this.changeType(DashboardResource.operationType.high)}><span>고소</span><div className={dashboard.highPlaceWork} alt="" /><span>-건/-명</span></li>
        //        <li className={radiation} onClick={() => this.changeType(DashboardResource.operationType.radiation)}><span>방사선</span><div className={dashboard.radiocative} alt="" /><span>-건/-명</span></li>
        //        <li className={electric} onClick={() => this.changeType(DashboardResource.operationType.electric)}><span>전기</span><div className={dashboard.electric} alt="" /><span>-건/-명</span></li>
        //        <li className={welding} onClick={() => this.changeType(DashboardResource.operationType.welding)}><span>용접</span><div className={dashboard.welding} alt="" /><span>-건/-명</span></li>
        //        <li className={heavy} onClick={() => this.changeType(DashboardResource.operationType.heavy)}><span>중장비</span><div className={dashboard.heavyEquip} alt="" /><span>-건/-명</span></li>
        //        <li className={excavation} onClick={() => this.changeType(DashboardResource.operationType.excavation)}><span>굴착</span><div className={dashboard.heavyEquipCopy} alt="" /><span>-건/-명</span></li>
        //    </ul>);

        operationUI.push(
            <ul key={"operationUI"}>
                <li><span className={dashboard.generalTitle}>일반</span><div className={dashboard.general} alt="" /><span>{normalCnt}건</span></li>
                <li><span>화기</span><div className={dashboard.fire} alt="" /><span>{fireCnt}건</span></li>
                <li><span>고소</span><div className={dashboard.highPlaceWork} alt="" /><span>{highCnt}건</span></li>
                <li><span>방사선</span><div className={dashboard.radiocative} alt="" /><span>{radiationCnt}건</span></li>
                <li><span>전기</span><div className={dashboard.electric} alt="" /><span>{electricCnt}건</span></li>
                <li><span>용접</span><div className={dashboard.welding} alt="" /><span>{weldingCnt}건</span></li>
                <li><span>중장비</span><div className={dashboard.heavyEquip} alt="" /><span>{heavyCnt}건</span></li>
                <li><span>굴착</span><div className={dashboard.heavyEquipCopy} alt="" /><span>{excavationCnt}건</span></li>
            </ul>);

        return operationUI;
    }

    render() {
        const displayOperationUI = this.displayOperationUI();

        return (
            <>

                {/*
                <div className={dashboard.operationBox}>
                    <div className={dashboard.operationTitle}>실시간 작업 현황</div>
                    <div className={dashboard.operationBoard}>
                        <div className={dashboard.whole}>
                            <div className={dashboard.blueSquare}><span className={dashboard.iconWork}></span></div><span className={dashboard.workTitle}>총 작업수</span>
                            <div className={dashboard.wholeNum}>-<span>건</span></div>
                        </div>
                        <div className={dashboard.person}>
                            <div className={dashboard.blueSquare}><span className={dashboard.iconWorker}></span></div><span className={dashboard.workerTitle}>총 인원수</span>
                            <div className={dashboard.personNum}>-<span>명</span></div>
                        </div>
                    </div>
                    <div className={dashboard.iconFlex}>
                        {displayOperationUI}
                    </div>
                </div>
                */}

                <div className={dashboard.operBox}>
                    <div className={dashboard.operBoxTitle}>작업현황</div>
                    <div className={dashboard.iconFlex}>
                        {displayOperationUI}
                    </div>
                </div>
            </>
        );
    }
}
export default OperationBoxSub;