import React, { useEffect } from 'react';
import '../../Common/css/scroll.css';
import $ from 'jquery';
import { TabContent } from 'reactstrap';

import uis from '../../Common/css/ui.module.css';

import SopController from '../../SOPManager/services/sopController';
import Arrow from '../../Common/sections/components/arrow';

import Process from './missions/process';
import EndPoint from './missions/endPoint';
import Decision from './missions/decision';
import Internal from './missions/internal';

import { MissionListSBComponent } from '../styled/sopSimulatorStyled';

function MissionListSB(props) {
    useEffect(() => {
        $('html, body').css({ 'display': 'block', 'height': '100%', 'overflow': 'hidden' });
        // 각 페이지 별로 클래스 초기화
        $('#subPage').removeClass('sop');

        $('.' + uis.scrollbar).scrollTop(0);
    }, [])

    useEffect(() => {
        if (!props.currentSection) {
            return;
        }

        if (props.commonSettings.UseAutoMoveSOPScreen === 'true') {
            let currentSectionID = -1;
            let currentSectionType = -1;

            if (props.currentSection?.length > 0) {
                const lastIndex = props.currentSection.length - 1;
                currentSectionID = props.currentSection[lastIndex].id;
                currentSectionType = props.currentSection[lastIndex].componentType;
            }
            else {
                currentSectionID = props.currentSection.id;
                currentSectionType = props.currentSection.componentType;
            }

            let height = 0;
            for (let i = 0; i < props.sections.length; i++) {
                if (props.sections[i] === undefined)
                    continue;

                if (props.sections[i].id === currentSectionID && props.sections[i].componentType === currentSectionType) {
                    break;
                }

                var height2 = $('#section_' + props.sopTabIndex + '_' + i).height();
                if (height !== undefined)
                    height += height2;
            }

            //$('.' + uis.scrollbar).scrollTop(height);
            // 애니메이션 효과
            $('.' + uis.scrollbar).animate({ scrollTop: height }, 500);
        }
    }, [props.currentSection])

    const runSection = (section, decisionResult) => {       
        props.runSection(section, decisionResult);
    }

    const setMissionUI = () => {
        let list = [];

        const sectionsLength =  props.sections?.length;
        for (let i = 0; i < sectionsLength; i++) {            
            if (props.sections[i].componentType === 0) {
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
            else if (props.sections[i].componentType === 1) {
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
            else if (props.sections[i].componentType === 3) {
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
            else if (props.sections[i].componentType === 6) {
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
            { /*soulBrainMission*/ }
            <MissionListSBComponent className={'subSection taskListWrap'}>
                <strong className={'tit'}>SOP 임무 목록</strong>
                    {/*<div className={uneStyles.currentTime}>현재시간</div>*/}
                    <div className={'innerSectionnnn scrollbar'}>
                    <div className={'taskSectionArea'}>
                        {listUI}
                    </div> {/*taskSectionArea*/}
                </div> {/*innerSection*/}
            </MissionListSBComponent> {/*soulBrainMission */}
        </>
    );
}


export default MissionListSB;