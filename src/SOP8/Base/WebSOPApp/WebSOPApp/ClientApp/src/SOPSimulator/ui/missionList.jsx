import React, { useEffect } from 'react';
import '../../Common/css/scroll.css';
import $ from 'jquery';
import { TabContent } from 'reactstrap';
import SopController from '../../SOPManager/services/sopController';
import Arrow from '../../Common/sections/components/arrow';

import Process from './missions/process';
import EndPoint from './missions/endPoint';
import Decision from './missions/decision';
import Internal from './missions/internal';

import { MissionListComponent } from '../styled/sopSimulatorStyled';

function MissionList(props) {
    useEffect(() => {
        $('html, body').css({ 'display': 'block', 'height': '100%', 'overflow': 'hidden' });
        // 각 페이지 별로 클래스 초기화
        $('#subPage').removeClass('sop');

        $('.scrollbar').scrollTop(0);
    }, [])

    useEffect(() => {
        if (!props.currentSection) {
            return;
        }

        if (props.commonSettings?.UseAutoMoveSOPScreen?.value === 'true') {
            let currentSectionID = -1;
            let currentSectionType = -1;

            if (props.currentSection) {
                currentSectionID = props.currentSection.component.compn_sn;
                currentSectionType = props.currentSection.component.compn_code;
            }
            else {
                currentSectionID = props.currentSection.component.compn_sn;
                currentSectionType = props.currentSection.component.compn_code;
            }

            let height = 0;
            for (let i = 0; i < props.sections.length; i++) {
                if (props.sections[i] === undefined)
                    continue;

                if (props.sections[i].component.compn_sn === currentSectionID && props.sections[i].component.compn_code === currentSectionType) {
                    break;
                }

                var height2 = $('#section_' + props.sopTabIndex + '_' + i).height();
                if (height2 !== undefined) 
                    height += height2;
                
            }

            // 애니메이션 효과
            $('.scrollbar').animate({ scrollTop: height }, 500);
        }
    }, [props.currentSection])

    const runSection = (section, decisionResult) => {       
        props.runSection(section, decisionResult);
    }

    const setMissionUI = () => {
        let list = [];

        const sectionsLength =  props.sections?.length;
        for (let i = 0; i < sectionsLength; i++) {            
            if (props.sections[i].component.compn_code === 0) {
                list.push(
                    <Process
                        key={i}
                        id={'section_' + props.sopTabIndex + '_' + i}
                        sectionData={props.sections[i]}
                        runSection={runSection}
                        currentSection={props.currentSection}
                        onProgressMission={props.onProgressMission}
                        runSectionFromChart={props.runSectionFromChart}
                        onProgressSpread={props.onProgressSpread}
                        onExcuteExternalProgram={props.onExcuteExternalProgram}
                        teamDatas={props.teamDatas}
                        showConfirmDialog={props.showConfirmDialog}
                        onCloseConfirmDialog={props.onCloseConfirmDialog}
                        commonSettings={props.commonSettings}
                    />
                );
            }
            else if (props.sections[i].component.compn_code === 1) {
                // 판단
                list.push(
                    <Decision
                        key={i}
                        id={'section_' + props.sopTabIndex + '_' + i}
                        sectionData={props.sections[i]}
                        runSection={runSection}
                        currentSection={props.currentSection}
                        arrows={props.arrows}
                    />
                );
            }
            else if (props.sections[i].component.compn_code === 3) {
                // 시작, 종료
                list.push(
                    <EndPoint
                        key={i}
                        id={'section_' + props.sopTabIndex + '_' + i}
                        sectionData={props.sections[i]}
                        runSection={runSection}
                        currentSection={props.currentSection}
                    />
                );
            }
            else if (props.sections[i].component.compn_code === 4) {
                // 상황 전파
                list.push(
                    <Internal
                        key={i}
                        id={'section_' + props.sopTabIndex + '_' + i}
                        sectionData={props.sections[i]}
                        runSection={runSection}
                        currentSection={props.currentSection}
                        onProgressMission={props.onProgressMission}
                        runSectionFromChart={props.runSectionFromChart}
                        onProgressSpread={props.onProgressSpread}
                        teamDatas={props.teamDatas}
                        showConfirmDialog={props.showConfirmDialog}
                        onCloseConfirmDialog={props.onCloseConfirmDialog}
                        commonSettings={props.commonSettings}
                    />
                );
            }
        }
        return list;
    }

    const listUI = setMissionUI();

    return (
        <>
            <MissionListComponent className={'subSection taskListWrap'}>
                <strong className={'tit'}>SOP 임무 목록</strong>
                    <div className={'innerSectionnnn scrollbar'}>
                    <div className={'taskSectionArea'}>
                        {listUI}
                    </div> {/*taskSectionArea*/}
                </div> {/*innerSection*/}
            </MissionListComponent>
        </>
    );
}


export default MissionList;