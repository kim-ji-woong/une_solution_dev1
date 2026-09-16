import React from 'react';
import SectionComponent from './sectionComponent';
import SectionDataEndpoint from '../../models/sections/sectionDataEndpoint.js';
import SectionData from '../../models/sections/sectionData';

class Endpoint extends SectionComponent {
    constructor(props) {
        super(props);
        this.props = props;

        // ������ ��� ����
        if (this.props.mode !== "exec") {
            this.props.onClickComponent(this.props.sectionData);
        }
    }

    render() {
        const styleValue = this.getStyleValue("endpoint");
        const arrowButtons = this.makeArrowButtons(this.props.drawingAreaRect);
        let sectionID = "endpoint";
        let statusClass = "";

        if (this.props.isSelected) {
            sectionID = "selectedComponent";
        }

        if (this.props.status === SectionData.Status_Run) {
            sectionID = "selectedComponent";
            statusClass = " " + "runComponent";
        } else if (this.props.status === SectionData.Status_Done) {
            statusClass = " " + "doneComponent";
        } else if (this.props.status === SectionData.Status_Normal) {
            statusClass = " " + "waitComponent";
        } else if (this.props.status === SectionData.Status_Skip) {
            statusClass = " " + "runComponent";
        }

        return (
            <div id={sectionID} className={'sectionComponent' + " " + 'endpoint' + statusClass} style={styleValue} onClick={() => this.props.onClickComponent(this.getSectionData())}>
                {
                    (this.props.mode === "exec") ? (this.props.sectionData.sectionNumber === null) ? '' : this.props.sectionData.sectionNumber + '.' : ''
                }
                {this.props.sectionData.endpoint.title}
                {arrowButtons}
            </div>
        );
    }

    static makeSectionData() {
        return new SectionDataEndpoint();
    }
}

export default Endpoint;