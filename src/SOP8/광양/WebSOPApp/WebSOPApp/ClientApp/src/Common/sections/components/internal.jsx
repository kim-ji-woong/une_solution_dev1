import React from 'react';
import SectionComponent from './sectionComponent';
import SectionDataInternal from '../../models/sections/sectionDataInternal.js';
import sectionStyles from '../../css/section.module.css';
import SectionData from '../../models/sections/sectionData';
import SopManagerResource from '../../../SOPManager/resource/id';
import SectionGridCell from '../sectionGridCell';

class Internal extends SectionComponent {
    constructor(props) {
        super(props);
        this.props = props;

        // ������ ��� ����
        if (this.props.mode !== "exec") {
            this.props.onClickComponent(this.props.sectionData);
        }
    }

    getTranstypeElement() {
        return (
            <div className={'sectionMarkArea'}>
                {/* {
                    this.props.sectionData.transmission.brdcst_yn &&
                    <div className={'sectionMark' + " " + 'broad' + " " + 'internal'}>{SopManagerResource.ID.sectionMark.broadcast}</div>
                        
                }  */}
                {
                    this.props.sectionData.transmission.sms_yn &&
                    <div className={'sectionMark' + " " + 'sms' + " " + 'internal'}>{SopManagerResource.ID.sectionMark.sms}</div>
                        
                }                
                {
                    this.props.sectionData.transmission.email_yn &&
                    <div className={'sectionMark' + " " + 'email' + " " + 'internal'}>{SopManagerResource.ID.sectionMark.email}</div>
                }
                {
                    this.props.sectionData.checked &&
                    <div className={'sectionMark' + " " + 'internal' + " " + 'checkComponent'}></div>
                }
            </div>
        );
    }

    getAutoElement() {
        if (this.props.sectionData.transmission.atmc_execut_yn) {
            return <div className={"sectionMark" + " " + "auto" + " " + "internal"}>{SopManagerResource.ID.sectionMark.auto}</div>
        }

        return <></>
    }

    render() {
        const styleValue = this.getStyleValue("internal");
        const arrowButtons = this.makeArrowButtons();
        let sectionClassName = "internalOuter";
        let sectionClassName2 = "sectionComponent" + " " + "internal";
        let statusClass = "";
        let statusBorder = "";

        if (this.props.isSelected) {
            if (SectionGridCell.isEditMode(this.props.mode)) {
                sectionClassName += " " + "selected";
                sectionClassName2 += " " + "selected";
            }
            else {
                sectionClassName += " " + "current";
                sectionClassName2 += " " + "current";
            }
        }

        if (this.props.status === SectionData.Status_Run) {
            sectionClassName += " " + "current";
            sectionClassName2 += " " + "current";

            statusClass = " " + "runComponent";

            if (!this.props.isSelected) {
                statusBorder = " " + "runBorder";
            }
            //statusBorder = " " + sectionStyles.runBorder;
        } else if (this.props.status === SectionData.Status_Done) {
            statusClass = " " + "doneComponent";

            if (!this.props.isSelected) {
                statusBorder = " " + "doneBorder";
            }
            //statusBorder = " " + sectionStyles.doneBorder;
        } else if (this.props.status === SectionData.Status_Normal) {
            statusClass = " " + "waitComponent";

            if (!this.props.isSelected) {
                statusBorder = " " + "waitBorder";
            }
        } else if (this.props.status === SectionData.Status_Skip) {
            statusClass = " " + "runComponent";
            sectionClassName += " " + "exec";
        }

        return (
            <div className={'sectionInternal'}>
                {
                    this.getTranstypeElement()
                }
                <div className={'internalArrowBox'}>
                    <div className={sectionClassName + statusBorder}>
                        <div className={sectionClassName2 + statusClass} style={styleValue} onClick={() => this.props.onClickComponent(this.getSectionData())}>
                            {
                                (this.props.mode === "exec") ? (this.props.sectionData.sectionNumber === null) ? '' : this.props.sectionData.sectionNumber + '.' : ''
                            }
                            {this.props.sectionData.transmission.title}
                        </div>
                    </div>
                    {arrowButtons}
                </div>
                {
                    this.getAutoElement()
                }
            </div>
        );
    }

    static makeSectionData() {
        return new SectionDataInternal();
    }
}

export default Internal;