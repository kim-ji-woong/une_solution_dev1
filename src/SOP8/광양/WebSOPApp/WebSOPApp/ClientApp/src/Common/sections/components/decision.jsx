import React from 'react';
import SectionComponent from './sectionComponent';
import SectionDataDecision from '../../models/sections/sectionDataDecision.js';
import SectionData from '../../models/sections/sectionData';

class Decision extends SectionComponent {
    constructor(props) {
        super(props);
        this.props = props;

        // ������ ��� ����
        if (this.props.mode !== "exec") {
            this.props.onClickComponent(this.props.sectionData);
        }
    }

    render() {
        const styleValue = this.getStyleValue("decision");
        const arrowButtons = this.makeArrowButtons();
        let sectionClassName = "decisionOuter";
        let statusClass = "";
        let txtStatusClass = "";
        //let statusBorder = "";

        if (this.props.isSelected) {
            sectionClassName += " " + "selected";
            statusClass = " " + "selected";
            txtStatusClass = " " + "selectedTxt";
        }

        if (this.props.status === SectionData.Status_Run) {
            sectionClassName += " " + "selected";
            statusClass = " " + "selected";
            txtStatusClass = " " + "selectedTxt";

            statusClass += " " + "runComponent";
            txtStatusClass += " " + "runComponentTxt";
            //statusBorder = " " + sectionStyles.runBorder;
            sectionClassName += " " + "runBorder";
        } else if (this.props.status === SectionData.Status_Done) {
            statusClass += " " + "doneComponent";
            txtStatusClass += " " + "doneComponentTxt";
            //statusBorder = " " + sectionStyles.doneBorder;
            sectionClassName += " " + "doneBorder";
        } else if (this.props.status === SectionData.Status_Normal) {
            statusClass = " " + "waitComponent";
            txtStatusClass = " " + "waitComponentTxt";

            if (!this.props.isSelected) {
                sectionClassName += " " + "waitBorder";
            }
        } else if (this.props.status === SectionData.Status_Skip) {
            statusClass += " " + "runComponent";
            txtStatusClass += " " + "skipComponentTxt";
            sectionClassName += " " + "exec";
        }

        return (
            <div className={'decisionArrowBox'}>
                <div className={sectionClassName}>
                    <div className={'sectionComponent' + " " + 'decision' + statusClass} style={styleValue} onClick={() => this.props.onClickComponent(this.getSectionData())}>
                        {/* {
                            (this.props.mode === "exec") ? (this.props.sectionData.sectionNumber === null) ? '' : this.props.sectionData.sectionNumber + '.' : ''
                        }
                        {this.props.sectionData.decision.title} */}
                    </div>
                </div>
                <div className={'decisionTxtWrap' + txtStatusClass} onClick={() => this.props.onClickComponent(this.getSectionData())}>
                    {
                        (this.props.mode === "exec") ? (this.props.sectionData.sectionNumber === null) ? '' : this.props.sectionData.sectionNumber + '.' : ''
                    }
                    {this.props.sectionData.decision.title}
                </div>
                {arrowButtons}
            </div>
        );
    }

    static makeSectionData() {
        return new SectionDataDecision();
    }
}

export default Decision;