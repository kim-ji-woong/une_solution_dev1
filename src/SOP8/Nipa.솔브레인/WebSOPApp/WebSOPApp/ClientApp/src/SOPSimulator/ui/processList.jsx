import React, { useEffect } from 'react';
import $ from 'jquery';
import { ProcessListComponent } from '../styled/sopSimulatorStyled';
import SectionData from '../../Common/models/sections/sectionData';

function ProcessList(props) {
    useEffect(() => {
        // SOP 진행 내역 버튼
        $('.pgProgress').on('click', '.btnToggle', function () {
            $(this).closest('.pgProgress').toggleClass("isHidden");
        });

        // SOP 진행 내역 목록
        // $('.progressHistoryWrap' + ' ' + '.numList').on('click', '.btnList', function () {
        //     $(this).closest('.list').toggleClass("isShow");
        //     $(this).siblings('.detailInfo').slideToggle();
        // });
    }, [])

    const getHMS = (time) => {
        const now = new Date(time);

        const hour = now.getHours();
        const min = now.getMinutes();
        const sec = now.getSeconds();

        const strHour = hour >= 10 ? hour.toString() : "0" + hour;
        const strMin = min >= 10 ? min.toString() : "0" + min;
        const strSec = sec >= 10 ? sec.toString() : "0" + sec;

        return strHour + ':' + strMin + ':' + strSec;
    }

    const makeHistories = () => {
        let historyUI = [];

        let summaries = new Array();

        const actionStepDatasLength = props.sopRunData?.actionStepDatas.length;
        for (let i = 0; i < actionStepDatasLength; i++) {
            const actionStepData = props.sopRunData.actionStepDatas[i];
            if (!actionStepData.actionStep) {
                continue;
            }

            if (actionStepData.actionStep.action_step_sn !== props.sopRunData.currentActionStep.actionStep.action_step_sn) {
                continue;
            }

            if (!actionStepData.componentHistories) {
                continue;
            }

            const histroyLength = actionStepData.componentHistories.length;
            for (let j = 0; j < histroyLength; j++) {
                const history = actionStepData.componentHistories[j];

                const sectionLength = actionStepData.stepMemberDatas[0].sections.length;
                for (let k = 0; k < sectionLength; k++) {
                    const section = actionStepData.stepMemberDatas[0].sections[k];
                    if (section.component.compn_sn === history.compn_sn && section.component.compn_code === history.compn_code) {
                        const key = section.component.compn_code + '_' + section.component.compn_sn;
                        const value = [];
                        value.key = key;
                        value.time = getHMS(history.time);
                        value.title = section.text;

                        let detail = null;

                        if ((history.sop_sttus_code - history.sop_sttus_optn_code) === 3) {
                            value.status = '확인';

                            if (SectionData.isProcessType(section.component.compn_code)) {
                                // 프로세스
                                if (section.checked) {
                                    value.status = "완료";
                                }
                                else {
                                    if (section.process.missions) {
                                        let checked = false;
                                        for (let q = 0; q < section.process.missions.length; q++) {
                                            if (section.process.missions[q].checked) {
                                                checked = true;
                                                break;
                                            }
                                        }
                                        if (checked) {
                                            value.status = "부분 완료";
                                        }
                                    }
                                }
                            }
                            else if (SectionData.isTransmissionType(section.component.compn_code)) {
                                if (section.checked) {
                                    value.status = "완료";
                                }
                            }
                        }
                        else if ((history.sop_sttus_code - history.sop_sttus_optn_code) === 2) {
                            value.status = '실행중';
                        }
                        else {
                            value.status = '대기';
                        }

                        if (SectionData.isProcessType(section.component.compn_code) || SectionData.isTransmissionType(section.component.compn_code)) {
                            // if (historyDetail) {
                            //     if (!detail) {
                            //         detail = [];
                            //     }

                            //     // 0: 체크해제, 1: 체크, 10: 문자메시지 전파, 20: 메일전파, 30: 방송전파
                            //     if (historyDetail.dataIndex === -1) {                                    
                            //         // 전체 전파                                    
                            //         detail.title = '전체 임무 문자메시지, 메일 전파';
                            //     }
                            //     else {
                            //         detail.title = (historyDetail.dataIndex + 1) + '번 임무 ';
                            //         if (historyDetail.datai === 10) {
                            //             detail.title += ' 문자메시지 전파';
                            //         }
                            //         else if (historyDetail.datai === 20) {
                            //             detail.title += ' 메일 전파';
                            //         }
                            //         else if (historyDetail.datai === 30) {
                            //             detail.title += ' 방송 전파';
                            //         }
                            //     }
                            // }
                        }

                        let match = false;
                        for (let q = 0; q < summaries.length; q++) {
                            if (key === summaries[q].key) {
                                value.details = [];
                                if (summaries[q].details) {
                                    value.details = summaries[q].details;
                                } 

                                if (detail) {
                                    value.details.push(detail);
                                }

                                summaries[q] = value;
                                
                                match = true;
                                break;
                            }
                        }

                        if (!match) {
                            summaries.push(value);
                        }

                        break;
                    }
                }       
            }
        }

        for (let i = 0; i < summaries.length; i++) {
            const summary = summaries[i];
            
            let detailsUI = [];
            let haveDetailClassName = "btnList";
            if (summary.details) {
                haveDetailClassName = "btnList";
                for (let j = 0; j < summary.details.length; j++) {
                    const detail = summary.details[j];

                    detailsUI.push(
                        <div key={'summaryDetail_' + j} className={'detailInfo clfix'}>
                            <span className={'message'}>{detail.title}</span>
                        </div>
                    );
                }
            }

            historyUI.push(
                <li key={'summary_' + i} className={'list'}>
                    <a className={haveDetailClassName}>
                        <span className={'text'}>{summary.title}</span>
                        <span className={'statue'}>{summary.status}</span>
                        <span className={'time'}>{summary.time}</span>
                    </a>
                    {detailsUI}
                </li>
            );
        }

        return historyUI;
    }
    
    const getSubSection = () => {
        let ui = [];

        if (props.sopRunData) {
            const position = props.sopRunData.currentActionStep?.actionStepHistory?.lc ? props.sopRunData.currentActionStep?.actionStepHistory?.lc : '';
            const type = props.sopRunData?.disaster.sclas_name;
            const stepName = props.sopRunData?.currentActionStep.stepName;
            const beginTime = props.sopRunData.currentActionStep?.actionStepHistory?.begin_time ? props.sopRunData.currentActionStep?.actionStepHistory?.begin_time.replace('T', ' ') : '';

            ui.push(
                <ul key={position}>
                    <li>발생위치 : {position}</li>
                    <li>발생일시 : {beginTime}</li>
                    <li>감지센서 : {props.sensorNames}</li>
                    <li>이벤트 유형 : {type}</li>
                    <li>위험단계 : {stepName}</li>
                </ul>
            );
        }

        return ui;
    }

    return (
        <>
            <ProcessListComponent className={'subSection progressHistoryWrap'}>
                <div className={'tit clfix'}>
                    <div>SOP 정보</div>
                    <button className={'btnToggle'}><i className={'iconArrowLeft'}></i></button>
                </div>
                <div className={'subSection innerSectionn'}>
                    {getSubSection()}
                </div>
                <div className={'tit clfix'}>
                    <div className={'step step01'}>SOP 진행 내역</div>
                    <button className={'btnToggle'}><i className={'iconArrowLeft'}></i></button>
                    </div>
                    <div className={'innerSectionnn scrollbar'}>
                    <ol className={'numList'}>
                        {makeHistories()}
                    </ol>
                </div>
            </ProcessListComponent>
        </>
    );
}

export default ProcessList;