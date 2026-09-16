import React, { useEffect, useState } from 'react';
import $ from 'jquery';
import SectionData from '../../../Common/models/sections/sectionData';

import { DecisionComponent } from '../../styled/missionsStyled';
import SelectBox from '../../../Common/components/selectBox';

function Decision(props) {
    const [returnValue, setReturnValue] = useState('');
    const [arrowValues, setArrowValues] = useState([]);

    useEffect(() => {
        const arrowValues = getArrowValue();
        if (arrowValues && arrowValues.length > 0) {
            setArrowValues(arrowValues);
            setReturnValue(arrowValues[0].arrowNo)
        }
    }, [])

    const getDecisionValue = (value) => {
        const arrowNo = parseInt(value);

        if (arrowNo === 0 || arrowNo) {
            for (const arrowValue of arrowValues) {
                if (arrowValue.arrowNo === arrowNo) {
                    return arrowValue;
                }
            }
        }

        return null;
    }

    const runSection = () => {
        const decisionValue = getDecisionValue(returnValue);

        if (decisionValue) {
            props.runSection(props.sectionData, decisionValue);
        }
        else {
            props.runSection(props.sectionData, returnValue);
        }
    }

    const onChangeValue = (value) => {   
        setReturnValue(value);
    }

    const getArrowValue = () => {
        if (!props.arrows || props.arrows.length === 0) {
            return null;
        }

        let values = [];

        const length = props.arrows.length;
        for (let i = 0; i < length; i++) {
            const arrow = props.arrows[i];

            if (!props.arrows[i].beginCell) {
                continue;
            }

            if (props.sectionData.component.column_no.toString() === props.arrows[i].beginCell.parentElement.dataset.index &&
                props.sectionData.component.row_no.toString() === props.arrows[i].beginCell.dataset.index) {
                const arrowValue = {
                    arrowNo: arrow.arrowNo,
                    arrowText: arrow.text
                }

                values.push(arrowValue);
            }
        }

        return values;
    }

    const getOptions = () => {
        let options = [];

        if (!arrowValues || arrowValues.length === 0) {
            return options;
        }

        for (let i = 0; i < arrowValues.length; i++) {
            const arrow = arrowValues[i];
            if (arrow.arrowText) {
                options.push({ value: arrow.arrowNo, label: arrow.arrowText });
            }
        }

        return options;
    }

    let bAmICurrentSection = false; // 자신이 현재 세션인지 여부
    if (props.currentSection?.component?.compn_sn === props.sectionData.component.compn_sn && props.currentSection?.component?.compn_code === props.sectionData.component.compn_code) {
        bAmICurrentSection = true;
    }

    let boxClassName = "";
    let textClassName = " " + 'textNormal';
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
    if (!props.sectionData.decision.execut_no) {
        // sectionNumber가 null일 때
        btnNextClassName = 'btnDisable';
    }
    else if (props.currentSection && SectionData.isEndpointType(props.currentSection.component.compn_code) && props.currentSection.endpoint.begin_yn) {
        // 현재 SOP가 시작되지 않았을 때 Disable
        btnNextClassName = 'btnDisable';
    }
    else if (props.sectionData.status === SectionData.Status_Done) {
        // 현재 임무가 완료된 상태라면 Disable
        btnNextClassName = 'btnDisable';
    }

    return (
        <DecisionComponent className={'sectionBox round' + boxClassName} id={props.id}>
            <div className={'tit clfix' + " " + 'hasFire' + textClassName}>    
                <strong>{props.sectionData.decision.execut_no}.{props.sectionData.decision.title}</strong>
                <div className='choiceBox'>
                    <SelectBox
                        value={returnValue}
                        onChange={onChangeValue}
                        options={getOptions()}
                    />
                </div>
                <div className={'btnArea btnArea'}>
                    <a className={btnNextClassName} onClick={runSection}>다음</a>
                </div>
            </div>
        </DecisionComponent> 
    );
}

export default Decision;