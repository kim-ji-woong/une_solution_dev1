import React, { Component } from 'react';
import { ModalBackground } from '../../../Root/styled/theme';

import { EndPopupComponent } from '../../styled/sopPopupStyled';

function EndPopup(props) {
    const [showTooltip, setShowTooltip] = useState(false);
    const [tooltipTop, setTooltipTop] = useState(0);
    const [tooltipLeft, setTooltipLeft] = useState(0);
    const [tooltipContent, setTooltipContent] = useState('');

    useEffect(() => {
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
        if (this.timerHandle) {
            clearTimeout(this.timerHandle);
        }
        const history = this.props.sopRunData.sopData.currentActionStep._ActionStepHistory;
        this.props.closeSOP(null, history.id, history.endTime, this.props.loginUser.id);
        this.props.changeContent('');
    }

    const onClickClose = () => {
        this.onClose();
    }

    const sopRunData = this.props.sopRunData;
    const _actionStepHistory = sopRunData.sopData.currentActionStep._ActionStepHistory;
    const detectTime = _actionStepHistory.detectTime.replace('T', ' ');
    const beginTime = _actionStepHistory.beginTime.replace('T', ' ');
    const endTime = _actionStepHistory.endTime.replace('T', ' ');

    return (
        <ModalBackground className='UI_Section'>
        {
            showTooltip &&
            <div id={'tooltipArea'} style={{ top: tooltipTop, left: tooltipLeft }}>
                {tooltipContent}
            </div>
        }
        <EndPopupComponent className={'endBox' + ' UI_Section'}>
            <div className={'endBoxTop'}>
                <p>SOP 결과요약</p>
                <a onClick={() => this.onClickClose()}>닫기</a>
            </div>
            <div className={'endBoxCont'}>
                <dl>
                    <dt>1.SOP 유형</dt>
                    <dd>{sopRunData.sopData.disaster.disasterName}</dd>
                </dl>
                <dl>
                    <dt>2.재난 위치</dt>
                    <dd>
                        <span
                            onMouseOver={(e) => this.handleTooltip(e, sopRunData.position)}
                            onMouseLeave={() => this.removeTooltip()}
                        >
                            {sopRunData.position}
                        </span>
                    </dd>
                </dl>
                <dl>
                    <dt>3.발생시간</dt>
                    <dd>{detectTime}</dd>
                </dl>
                <dl>
                    <dt>4.SOP 시작시간</dt>
                    <dd>{beginTime}</dd>
                </dl>
                <dl>
                    <dt>5.SOP 종료시간</dt>
                    <dd>{endTime}</dd>
                </dl>
                <dl>
                    <dt>6.단계</dt>
                    <dd>{sopRunData.sopData.currentActionStep.stepName}</dd>
                </dl>
            </div>
            <div className={'endBoxBtn'}>
                <a className={'endBoxClose'} onClick={() => this.onClickClose()}>닫기</a>
                {/*<a className={uneStyles.endBoxDetail}>상세보기</a>*/}
            </div>
        </EndPopupComponent>
        </ModalBackground>
    );
}

export default EndPopup;