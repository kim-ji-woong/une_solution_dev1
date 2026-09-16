import React, { Component } from 'react';
import SectionDataAnnotation from '../../../Common/models/sections/sectionDataAnnotation';

import { AnnotationPropertyComponent } from '../../../SOPManager/styled/componentsStyled';

class AnnotationProperty extends Component {
    constructor(props) {
        super(props);
        this.props = props;

        const sectionData = new SectionDataAnnotation();

        if (this.props.sectionData) {
            SectionDataAnnotation.copyTo(this.props.sectionData, sectionData);
        }

        this.state = {
            instance: this,
            sectionData: sectionData,
            prevProps: this.props
        }

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

        let sectionData = new SectionDataAnnotation();

        if (props.sectionData) {
            SectionDataAnnotation.copyTo(props.sectionData, sectionData);
        }

        state.instance.refTitle.current.value = state.instance.refTitle.current.text = sectionData.text;

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
        sectionData.text = this.refTitle.current.value;
        this.props.onApplyComponentProperty(sectionData, this.props.actionStep, shouldUpdate);
    }

    render() {
        return (
            <AnnotationPropertyComponent>
                <div className={'sprCont'}>
                    <div className={'sprmExp'}>
                        <div className={'arrowBox'}>
                            <h4>설명문 작성</h4>
                            <div className={'scrollWrapper'}>
                            {/* <div className={"scroll-wrapper " + AnnotationProperty.cssStyles.sprmExTxt + " scrollbar-outer scroll-textarea"} id="pos_relative">
                                <div className="scroll-content" id="annotation_scrollContent"> */}
                                <span className={'scrollContentAnnotation'}>
                                    <textarea ref={this.refTitle} name="" id="" cols="30" rows="10" className={'sprmExTxt' + " " + 'scrollbarOuter'} defaultValue={this.state.sectionData?.text} onChange={this.onChangeText}></textarea>
                                </span>
                            {/* </div> */}
                            {/* </div> */}
                            </div>
                        </div>
                    </div>
                    <div className={'sprBot'}>
                        <a onClick={() => this.onClickApply(false)}>취소</a>
                        <a onClick={() => this.onClickApply(true)}>확인</a>
                    </div>
                </div>
            </AnnotationPropertyComponent>
        );
    }
    /*constructor(props) {
        super(props);
        this.props = props;

        this.state = {
            sectionData: this.props.sectionData
        }

        this.refText = React.createRef();
    }

    componentWillReceiveProps(nextProps) {
        if (this.state.sectionData !== nextProps.sectionData) {
            this.setState({ sectionData: nextProps.sectionData });
        }
    }

    onApplyComponentProperty = () => {
        const sectionData = { ...this.state.sectionData };
        sectionData.text = this.refText.current.value;
        this.props.onApplyComponentProperty(sectionData, this.props.actionStep);
    }

    onChangeText = (event) => {
        const sectionData = { ...this.state.sectionData };
        sectionData.text = this.refText.current.value;
        this.setState({ sectionData });
    }

    render() {
        return (
            <>
                <div className="componentProperties">
                    <span className="componentType">설명</span>
                    <div className="annotationProperty">
                        <label className="annotationLabel">내용</label>
                        <textarea ref={this.refText} className="componentText" value={this.state.sectionData.text} onChange={this.onChangeText}/>
                    </div>
                </div>
                <button className="btnApply" onClick={this.onApplyComponentProperty}>적용</button>
            </>
        );
    }*/
}

export default AnnotationProperty;