import React from 'react';
import SectionData from '../../../Common/models/sections/sectionData';

import { EndPointComponent } from '../../styled/missionsStyled';

function EndPoint(props) {

    const runSection = async () => {        
        await props.runSection(props.sectionData);
    }

    let boxClassName = "";
    let textClassName = " " + 'textNormal';

    let bAmICurrentSection = false;
    if (props.currentSection?.component?.compn_sn === props.sectionData.component.compn_sn && props.currentSection?.component?.compn_code === props.sectionData.component.compn_code) {
        bAmICurrentSection = true;
    }

    // static Status_Normal = 1;
    // static Status_Run = 2;
    // static Status_Done = 3;
    // static Status_Input = 4;
    // static Status_Skip = 5;

    if (bAmICurrentSection) {
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
    //if (!props.sectionData.endpoint.begin_yn &&
    //    props.currentSection.component.compn_code === 3 && props.currentSection.endpoint.begin_yn) {
    if (!props.sectionData.endpoint.begin_yn &&
        props.currentSection && props.currentSection.component.compn_code === 3 && props.currentSection.endpoint.begin_yn) {
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
            <strong>{props.sectionData.endpoint.execut_no}.{props.sectionData.endpoint.title}</strong>
            <div className={'btnArea btnArea'}>
                <a className={btnNextClassName} onClick={runSection} title={props.sectionData.endpoint.title}>{props.sectionData.endpoint.title}</a>
            </div>
            </div>
        </EndPointComponent>
    );
}

export default EndPoint;