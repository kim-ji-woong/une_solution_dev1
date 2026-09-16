import React, { Component } from 'react';
import { ArrowPropertyComponent } from '../../../SOPManager/styled/componentsStyled';

class ArrowProperty extends Component {
    constructor(props) {
        super(props);
        this.props = props;

        let arrowData = null;

        if (this.props.arrowData) {
            arrowData = this.props.arrowData.clone();
        }

        this.state = {
            instance: this,
            arrowData: arrowData,
            prevProps: this.props
        }

        this.refText = React.createRef();
        this.canceled = false;
    }

    componentWillUnmount() {
        // 창이 닫히게 될 경우 편집한 내용을 저장한다.
        if (!this.canceled) {
            this.saveData(true);
        }
    }

    static getDerivedStateFromProps(props, state) {
        if (props === state.prevProps) {
            return state;
        }

        if (props.arrowData !== state.prevProps.arrowData && state.arrowData) {
            // 다른 Process를 선택하여 창이 바뀌게 될 경우 편집한 내용을 저장한다.
            state.instance.saveData(true);
        }

        let arrowData = null;

        if (props.arrowData) {
            arrowData = props.arrowData.clone();
        }

        state.instance.refText.current.value = state.instance.refText.current.text = arrowData.text;

        return {
            instance: state.instance,
            arrowData: arrowData,
            prevProps: props
        };
    }

    onChangeText = (event) => {
    }

    onClickApply(ok) {
        if (ok) {
            this.saveData(true);
            // 확인 버튼을 누르면 강제로 초기화 시키도록 한다.
            this.props.onClickCancel();
        }
        else {
            this.setState({
                arrowData: null
            });

            this.canceled = true;
            this.props.onClickCancel();
        }
    }

    saveData(shouldUpdate) {
        const arrowData = { ...this.state.arrowData };
        arrowData.text = this.refText.current.value;
        this.props.onApplyComponentProperty(arrowData, this.props.actionStep, shouldUpdate);
    }

    render() {
        return (
            <ArrowPropertyComponent>
                <div className={'sprCont'}>
                    <div className={'sprmExp'}>
                        <div className={'arrowBox'}>
                            <h4>화살표 작성</h4>
                            <div className={'scrollWrapperArrow'}>
                                <span className={'scrollContentArrow'}>
                                    <textarea ref={this.refText} name="" id="" cols="30" rows="10" className={'sprmExTxt' + " " + 'scrollbarOuter'} defaultValue={this.state.arrowData?.text} onChange={this.onChangeText}></textarea>
                                </span>
                            </div>
                        </div>
                    </div>
                    <div className={'sprBot'}>
                        <a onClick={() => this.onClickApply(false)}>취소</a>
                        <a onClick={() => this.onClickApply(true)}>확인</a>
                    </div>
                </div>
            </ArrowPropertyComponent>
        );
    }
}

export default ArrowProperty;