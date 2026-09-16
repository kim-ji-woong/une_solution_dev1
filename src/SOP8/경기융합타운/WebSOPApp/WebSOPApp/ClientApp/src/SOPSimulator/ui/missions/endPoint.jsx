import React from 'react';
//import uis from '../../../Common/css/ui.module.css';
import SectionData from '../../../Common/models/sections/sectionData';

import { EndPointComponent } from '../../styled/missionsStyled';

function EndPoint(props) {

    const runSection = async () => {        
        await props.runSection(props.sectionData);
    }

    let boxClassName = "";
    let textClassName = " " + 'textNormal';

    let bAmICurrentSection = false; // 자신이 현재 세션인지 여부
    const currentSectionCount = props.currentSection.length;
    for (let i = 0; i < currentSectionCount; i++) {
        const currentSection = props.currentSection[i];
        if (currentSection.id === props.sectionData.id && currentSection.componentType === props.sectionData.componentType) {
            bAmICurrentSection = true;
        }
    }

    if (bAmICurrentSection) {
        //boxClassName = " " + uis.sectionCurrent + " " + uneStyles.currentBox;
        boxClassName = " " + 'sectionCurrent' + " " + 'borderCurrent';
        textClassName = " " + 'textCurrent';
    } else if (props.sectionData.status === SectionData.Status_Run) {
        boxClassName = " " + 'sectionCurrent' + " " + 'borderCurrent';
        textClassName = " " + 'textCurrent';
    } else if (props.sectionData.status === SectionData.Status_Done) {
        boxClassName = " " + 'sectionDone';
        textClassName = " " + 'textDone';
    } else if (props.sectionData.status === SectionData.Status_Skip) {
        boxClassName = " " + 'sectionRun';
        textClassName = " " + 'textRun';
    } 

    // 다음 버튼 활성화
    var btnNextClassName = 'btnAllCheck';
    // TODO: 테스트를 위한
    //if (!props.sectionData.isBegin &&
    //    props.currentSection.componentType === 3 && props.currentSection.isBegin) {
    if (!props.sectionData.isBegin &&
        props.currentSection?.length > 0 && props.currentSection[0].componentType === 3 && props.currentSection[0].isBegin) {
        // 현재 SOP가 시작되지 않았을 때 Disable
        btnNextClassName = 'btnDisable';
    }
    else if (props.sectionData.status === SectionData.Status_Done) {
        // 현재 임무가 완료된 상태라면 Disable
        btnNextClassName = 'btnDisable';
    }

    return (
        <EndPointComponent className={'sectionBox' + boxClassName} id={props.id}>
            <div className={'tit clfix' + " " + 'sectionBoxStart' + textClassName}>
            <strong>{props.sectionData.sectionNumber}.{props.sectionData.text}</strong>
            <div className={'btnArea btnArea'}>
                <a className={btnNextClassName} onClick={runSection} title={props.sectionData.text}>{props.sectionData.text}</a>
            </div>
            </div>
        </EndPointComponent>
    );
}

export default EndPoint;