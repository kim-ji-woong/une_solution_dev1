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
        //let statusBorder = "";

        if (this.props.isSelected) {
            sectionClassName += " " + "selected";
            statusClass = " " + "selected";
        }

        if (this.props.status === SectionData.Status_Run) {
            sectionClassName += " " + "selected";
            statusClass = " " + "selected";

            statusClass += " " + "runComponent";
            //statusBorder = " " + sectionStyles.runBorder;
            sectionClassName += " " + "runBorder";
        } else if (this.props.status === SectionData.Status_Done) {
            statusClass += " " + "doneComponent";
            //statusBorder = " " + sectionStyles.doneBorder;
            sectionClassName += " " + "doneBorder";
        } else if (this.props.status === SectionData.Status_Normal) {
            statusClass = " " + "waitComponent";

            if (!this.props.isSelected) {
                sectionClassName += " " + "waitBorder";
            }
        } else if (this.props.status === SectionData.Status_Skip) {
            statusClass += " " + "skipComponent";
            sectionClassName += " " + "exec";
        }

        return (
            <div className={"decisionArrowBox"}>
                <div className={sectionClassName}>
                    <div className={"sectionComponent" + " " + "decision" + statusClass} style={styleValue} onClick={() => this.props.onClickComponent(this.getSectionData())}>
                        {
                            (this.props.mode === "exec") ? (this.props.sectionData.sectionNumber === null) ? '' : this.props.sectionData.sectionNumber + '.' : ''
                        }
                        {this.props.sectionData.text}
                    </div>
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