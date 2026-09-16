import React, { useEffect, useState } from 'react';
import $ from 'jquery';
import SectionData from '../../../Common/models/sections/sectionData';

import { DecisionComponent } from '../../styled/missionsStyled';

function Decision(props) {
    const [returnValue, setReturnValue] = useState('');
    const [arrowValues, setArrowValues] = useState([]);

    useEffect(() => {
        $('html, body').css({ 'display': 'block', 'height': '100%', 'overflow': 'hidden', 'color': '#fff' });

        // Selete Box UI
        $('.seleteBox').on('click', '.' + 'seletedTxt', function () {
            $(this).closest('.seleteBox').toggleClass("isShow");
        }).on('click', '.' + "value" , function () {
                var value = $(this).closest('li').data('val');
                $(this).closest('.seleteBox').toggleClass("isShow");
                $(this).closest('.seleteBox').removeClass('.step01', '.step02', '.step03', '.step04').addClass(value);
                $(this).closest('.seleteBox').find('.seletedTxt').text($(this).text());
        });

        const arrowValues = getArrowValue();
        if (arrowValues && arrowValues.length > 0) {
            setArrowValues(arrowValues);
            setReturnValue(arrowValues[0])
        }
    }, [])

    const runSection = () => {
        props.runSection(props.sectionData, returnValue);
    }

    const onChangeValue = (e) => {        
        let arrowValue = null;
        for (var i = 0; i < arrowValues.length; i++) {
            if (arrowValues[i].arrowNo.toString() === e.target.value) {
                arrowValue = arrowValues[i];
                break;
            }
        }

        if (arrowValue === null || arrowValue === returnValue)
            return;

        setReturnValue(arrowValue);
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

    const getArrowText = () => {
        if (!arrowValues || arrowValues.length === 0) {
            return null;
        }

        let ui = [];

        const length = arrowValues.length;
        for (let i = 0; i < length; i++) {
            const arrow = arrowValues[i];
            if (arrow.arrowText) {
                ui.push(<option key={arrow.arrowNo + '_' + i} value={arrow.arrowNo}>{arrow.arrowText}</option>);
            }
        }

        return ui;
    }

    const arrowTexts = getArrowText();

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
    else if (props.currentSection && props.currentSection.component.compn_code === 3 && props.currentSection.endpoint.begin_yn) {
        // 현재 SOP가 시작되지 않았을 때 Disable
        btnNextClassName = 'btnDisable';
    }
    else if (props.sectionData.status === SectionData.Status_Done) {
        // 현재 임무가 완료된 상태라면 Disable
        btnNextClassName = 'btnDisable';
    }

    return (
        <DecisionComponent className={'sectionBox' + boxClassName} id={props.id}>
            <div className={'tit clfix' + " " + 'hasFire' + textClassName}>    
                <strong>{props.sectionData.decision.execut_no}.{props.sectionData.decision.title}</strong>
                {
                    <select className={'choiceBox'} name="" id="" onChange={(e) => onChangeValue(e)} >
                        {arrowTexts}
                    </select>
                }
                <div className={'btnArea btnArea'}>
                    <a className={btnNextClassName} onClick={runSection}>다음</a>
                </div>
            </div>
        </DecisionComponent> 
    );
}

export default Decision;