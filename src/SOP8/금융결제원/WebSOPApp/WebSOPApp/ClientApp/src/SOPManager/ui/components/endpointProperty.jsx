import React, { Component } from 'react';
import SectionDataEndpoint from '../../../Common/models/sections/sectionDataEndpoint';

import { EndpointPropertyComponent } from '../../../SOPManager/styled/componentsStyled';

class EndpointProperty extends Component {
    constructor(props) {
        super(props);
        this.props = props;

        const sectionData = new SectionDataEndpoint();

        if (this.props.sectionData) {
            SectionDataEndpoint.copyTo(this.props.sectionData, sectionData);
        }

        this.state = {
            instance: this,
            sectionData: sectionData,
            prevProps: this.props
        };

        this.refTitle = React.createRef();
        this.canceled = false;
    }

    componentWillUnmount() {
        // 창이 닫히게 될 경우 편집한 내용을 저장한다.
        if (!this.canceled) {
            this.saveSectionData(true);
        }
    }

    static getDerivedStateFromProps(props, state) {
        if (props === state.prevProps) {
            return state;
        }

        if (props.sectionData !== state.prevProps.sectionData && state.sectionData) {
            // 다른 Process를 선택하여 창이 바뀌게 될 경우 편집한 내용을 저장한다.
            state.instance.saveSectionData(true);
        }

        let sectionData = new SectionDataEndpoint();

        if (props.sectionData) {
            SectionDataEndpoint.copyTo(props.sectionData, sectionData);
        }

        state.instance.refTitle.current.value = state.instance.refTitle.current.title = sectionData.endpoint.title;

        if (sectionData.removed) {
            sectionData = null;
        }

        return {
            instance: state.instance,
            sectionData: sectionData,
            prevProps: props
        };
    }

    onChangeText = (event) => {
    }

    onChange(begin_yn) {
        const sectionData = { ...this.state.sectionData };
        sectionData.endpoint.begin_yn = begin_yn;
        this.setState({sectionData: sectionData});
    }

    onClickApply(ok) {
        if (ok) {
            this.saveSectionData(true);
            // 확인 버튼을 누르면 강제로 초기화 시키도록 한다.
            this.props.onClickCancel();
        }
        else {
            this.setState({
                sectionData: null
            });

            this.canceled = true;
            this.props.onClickCancel();
        }
    }

    saveSectionData(shouldUpdate) {
        const sectionData = { ...this.state.sectionData };
        sectionData.endpoint.title = this.refTitle.current.value;
        this.props.onApplyComponentProperty(sectionData, this.props.actionStep, shouldUpdate);
    }

    render() {
        return (
            <EndpointPropertyComponent>
            <div className={'sprCont'}>
                <div className={'sprmExp'}>
                    <div className={'sprStartBox'}>
                        <h4>시작/종료 작성</h4>
                        <div className={'scrollWrapperStart'}>
                            <span className={'scrollContentStart'}>
                                <textarea ref={this.refTitle} name="" id="" cols="30" rows="10" className={'sprmExTxt' + " " + 'scrollbarOuter'} defaultValue={this.state.sectionData?.endpoint?.title} onChange={this.onChangeText}></textarea>
                            </span>
                            {/* <div className="scroll-element scroll-x">
                                <div className="scroll-element_outer">
                                    <div className="scroll-element_size">
                                    </div>
                                    <div className="scroll-element_track">
                                    </div>
                                    <div className="scroll-bar" id="width_100px">
                                    </div>
                                </div>
                            </div>
                            <div className="scroll-element scroll-y">
                                <div className="scroll-element_outer">
                                    <div className="scroll-element_size">
                                    </div>
                                    <div className="scroll-element_track">
                                    </div>
                                    <div className="scroll-bar" id="height_100">
                                    </div>
                                </div>
                            </div> */}
                        </div>
                        <div className={'sprmStend'}>
                            <li>
                                <label>
                                    <span className={'labelInputRadio'}>
                                        <input type="radio" name="sprmStend" className={'labelInput'} id={'sprmStend01'} checked={this.state.sectionData?.endpoint?.begin_yn} onChange={() => this.onChange(true)} />
                                    </span>
                                    시작
                                </label>
                            </li>
                            <li>
                                <label>
                                    <span className={'labelInputRadio'}>
                                        <input type="radio" name="sprmStend" className={'labelInput'} id={'sprmStend02'} checked={!this.state.sectionData?.endpoint?.begin_yn} onChange={() => this.onChange(false)} />
                                    </span>
                                    종료
                                </label>
                            </li>
                        </div>
                    </div>
                </div>
                <div className={'sprBot'}>
                    <a onClick={() => this.onClickApply(false)}>취소</a>
                    <a onClick={() => this.onClickApply(true)}>확인</a>
                </div>
            </div>
            </EndpointPropertyComponent>
            );
    }
    /*constructor(props)
    {
        super(props);
        this.props = props;

        this.state = {
            sectionData: this.props.sectionData
        }

        this.refBegin = React.createRef();
        this.refEnd = React.createRef();
        this.refText = React.createRef();
    }

    componentWillReceiveProps(nextProps) {
        if (this.state.sectionData !== nextProps.sectionData) {
            this.setState({ sectionData: nextProps.sectionData });
        }
    }

    onApplyComponentProperty = () => {
        const sectionData = { ...this.state.sectionData };
        sectionData.begin_yn = this.refBegin.current.checked;
        sectionData.title = this.refText.current.value;

        this.props.onApplyComponentProperty(sectionData, this.props.actionStep);
    }

    onChange(begin_yn) {
        const sectionData = { ...this.state.sectionData };
        sectionData.begin_yn = begin_yn;
        this.setState({ sectionData });
    }

    onChangeText = (event) => {
        const sectionData = { ...this.state.sectionData };
        sectionData.title = event.target.value;
        this.setState({ sectionData });
    }

    render() {
        return (
            <>
                <div className="componentProperties">
                    <span className="componentType">시작/종료</span>
                    <div className="endpointProperty">
                        <div>
                            <input ref={this.refBegin} type="radio" name="begin" onChange={() => this.onChange(true)} checked={this.state.sectionData.begin_yn === true} />
                            <label htmlFor="begin">시작</label>
                        </div>

                        <div className="optionItem">
                            <input ref={this.refEnd} type="radio" name="end" onChange={() => this.onChange(false)} checked={this.state.sectionData.begin_yn === false} />
                            <label htmlFor="end">종료</label>
                        </div>
                    </div>
                    <textarea ref={this.refText} className="componentText" value={this.state.sectionData.title} onChange={this.onChangeText} />
                </div>
                <button className="btnApply" onClick={this.onApplyComponentProperty}>적용</button>
            </>
        );
    }*/
}

export default EndpointProperty;