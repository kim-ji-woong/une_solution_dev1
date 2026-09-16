import React from 'react';
import SectionComponent from './sectionComponent';
import SectionDataAnnotation from '../../models/sections/sectionDataAnnotation.js';
import SectionData from '../../models/sections/sectionData';

class Annotation extends SectionComponent {
    constructor(props) {
        super(props);
        this.props = props;

        // ������ ��� ����
        if (this.props.mode !== "exec") {
            this.props.onClickComponent(this.props.sectionData);
        }
    }

    render() {
        const styleValue = this.getStyleValue("annotation");
        styleValue.color = this.props.mode === "exec" ? "#CECFD2" : "#000";

        const arrowButtons = this.makeArrowButtons(this.props.drawingAreaRect);
        let sectionClassName = "sectionComponent" + " " + "annotation";
        let sectionID = "annotation";
        let statusFillClass = " ";
        let statusBorderClass = " ";

        if (this.props.isSelected) {
            if (this.props.mode !== "exec") {
                sectionClassName += " " + "selected";
                sectionID = "selectedComponent";
                statusFillClass += " " + "selected";
            }
        }

        // SOP �����忡���� ������ �����¿��߸� �Ѵ�.
        if (this.props.mode === "exec") {
            statusFillClass = " " + "waitAnnoFill";
            statusBorderClass += " " + "waitAnnoBorder";
        }

        return (
            <div className={'annotationArrowBox'}>
                <div id={sectionID} className={sectionClassName + statusBorderClass}>
                    <div className={'inner' + statusFillClass} style={styleValue} onClick={() => this.props.onClickComponent(this.getSectionData())}>
                        {this.props.sectionData.comment.contents}
                    </div>
                    <div id={sectionID} className={'edge'}></div>
                </div>
                {arrowButtons}
            </div>
        );
    }

    static makeSectionData() {
        return new SectionDataAnnotation();
    }
}

export default Annotation;