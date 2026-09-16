import React from 'react';
import SectionComponent from './sectionComponent';
import SectionDataProcess from '../../models/sections/sectionDataProcess.js';
import SectionData from '../../models/sections/sectionData';
import SopManagerResource from '../../../SOPManager/resource/id';
import SectionGridCell from '../sectionGridCell';

class Process extends SectionComponent {
    constructor(props) {
        super(props);
        this.props = props;

        // ������ ��� ����
        if (this.props.mode !== "exec") {
            this.props.onClickComponent(this.props.sectionData);
        }
    }

    getMarkAreaElement() {
        return (
            <div className={'sectionMarkArea process'}>
                {
                    this.props.sectionData.checked &&
                    <div className={'sectionMark process checkComponent'}></div>
                }
            </div>
        );
    }

    getAutoElement() {
        if (this.props.sectionData.process.atmc_execut_yn) {
            return <div className={'sectionMark auto process'}>{SopManagerResource.ID.sectionMark.auto}</div>
        }

        return <></>
    }

    render() {
        const styleValue = this.getStyleValue("process");
        const arrowButtons = this.makeArrowButtons();
        let sectionID = "process";
        let statusClass = "";

        if (this.props.isSelected) {
            if (SectionGridCell.isEditMode(this.props.mode)) {
                sectionID = "selectedComponent";
            }
            else {
                sectionID = "currentComponent";
            }
        }

        if (this.props.status === SectionData.Status_Run) {
            sectionID = "currentComponent";
            statusClass = " " + "runComponent";
        } 
        else if (this.props.status === SectionData.Status_Done) {
            statusClass = " " + "doneComponent";
        } else if (this.props.status === SectionData.Status_Normal) {
            statusClass = " " + "waitComponent";
        } else if (this.props.status === SectionData.Status_Skip) {
            statusClass = " " + "runComponent";
        }

        return (
            <div className={'sectionProcess'}>
                {
                    this.getMarkAreaElement()
                }
                <div id={sectionID} className={"sectionComponent" + " " + "process" + " " + "round" + statusClass} style={styleValue} onClick={() => this.props.onClickComponent(this.getSectionData())}>
                    {
                        (this.props.mode === "exec") ? (this.props.sectionData.sectionNumber === null) ? '' : this.props.sectionData.sectionNumber + '.' : ''
                    }
                    {this.props.sectionData.process.title}
                    {arrowButtons}
                </div>
                {
                    this.getAutoElement()
                }
            </div>
        );
    }

    static makeSectionData() {
        return new SectionDataProcess();
    }
}

export default Process;