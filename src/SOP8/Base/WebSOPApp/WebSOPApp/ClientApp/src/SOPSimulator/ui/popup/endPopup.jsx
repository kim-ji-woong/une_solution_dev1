import React, { useState, useEffect } from 'react';
import { ModalBackground } from '../../../Root/styled/theme';

import { EndPopupComponent } from '../../styled/sopPopupStyled';

function EndPopup(props) {
    const [showTooltip, setShowTooltip] = useState(false);
    const [tooltipTop, setTooltipTop] = useState(0);
    const [tooltipLeft, setTooltipLeft] = useState(0);
    const [tooltipContent, setTooltipContent] = useState('');

    useEffect(() => {
        const timerHandle = setTimeout(() => {
            onClose();
        }, 10000);

        return () => {
            if (timerHandle) {
                clearTimeout(timerHandle);
            }
        };
    }, []);

    const handleTooltip = (e, data) => {
        const target = e.target;
        const parent = e.target.parentElement;

        const parentNode = parent.getBoundingClientRect();
        const targetNode = target.getBoundingClientRect();

        // span.width > li.width &&
        if(targetNode.width > parentNode.width) {
            setShowTooltip(!showTooltip);
            setTooltipTop(parentNode.top + 33);
            setTooltipLeft(parentNode.left + 10);
            setTooltipContent(data);
        }
    }

    const removeTooltip = () => {
        setShowTooltip(false);
    }

    const onClose = () => {
        const actionStepHistoryNo = props.sopRunData.currentActionStep.actionStepHistory.action_step_hist_sn;
        const endTime = props.sopRunData.currentActionStep.actionStepHistory.end_time;

        props.closeSOP(null, actionStepHistoryNo, endTime, props.loginUser.user_sn);
        props.changeContent('');
    }

    const onClickClose = () => {
        onClose();
    }

    return (
        <ModalBackground className='UI_Section'>
        {
            showTooltip &&
            <div id={"tooltipArea"} style={{ top: tooltipTop, left: tooltipLeft }}>
                {tooltipContent}
            </div>
        }
        <EndPopupComponent className={'endBox' + ' UI_Section'}>
            <div className={'endBoxTop'}>
                <p>SOP 결과요약</p>
                <a onClick={() => onClickClose()}>닫기</a>
            </div>
            <div className={'endBoxCont'}>
                <dl>
                    <dt>1.SOP 유형</dt>
                    <dd>{props.sopRunData.disaster.sclas_name}</dd>
                </dl>
                <dl>
                    <dt>2.재난 위치</dt>
                    <dd>
                        <span
                            onMouseOver={(e) => handleTooltip(e, props.sopRunData.currentActionStep.actionStepHistory.lc)}
                            onMouseLeave={() => removeTooltip()}
                        >
                            {props.sopRunData.currentActionStep.actionStepHistory.lc}
                        </span>
                    </dd>
                </dl>
                <dl>
                    <dt>3.발생시간</dt>
                    <dd>{props.sopRunData.currentActionStep.actionStepHistory.detct_time ? props.sopRunData.currentActionStep.actionStepHistory.detct_time?.replace('T', ' ') : '-'}</dd>
                </dl>
                <dl>
                    <dt>4.SOP 시작시간</dt>
                    <dd>{props.sopRunData.currentActionStep.actionStepHistory.begin_time.replace('T', ' ')}</dd>
                </dl>
                <dl>
                    <dt>5.SOP 종료시간</dt>
                    <dd>{props.sopRunData.currentActionStep.actionStepHistory.end_time.replace('T', ' ')}</dd>
                </dl>
                <dl>
                    <dt>6.단계</dt>
                    <dd>{props.sopRunData.currentActionStep.actionStep.action_step_name}</dd>
                </dl>
            </div>
            <div className={'endBoxBtn'}>
                <a className={'endBoxClose'} onClick={() => onClickClose()}>닫기</a>
            </div>
        </EndPopupComponent>
        </ModalBackground>
    );
}

export default EndPopup;