import React, { Component } from 'react';
import EndpointProperty from './endpointProperty';
import ProcessProperty from './processProperty';
import AnnotationProperty from './annotationProperty';
import DecisionProperty from './decisionProperty';
import InternalProperty from './internalProperty';
import SectionDataEndpoint from '../../../Common/models/sections/sectionDataEndpoint';
import SectionDataProcess from '../../../Common/models/sections/sectionDataProcess';
import SectionDataAnnotation from '../../../Common/models/sections/sectionDataAnnotation';
import SectionDataDecision from '../../../Common/models/sections/sectionDataDecision';
import SectionDataInternal from '../../../Common/models/sections/sectionDataInternal';
import SectionData from '../../../Common/models/sections/sectionData';
import SopManagerResource from '../../resource/id';
import ArrowProperty from './arrowProperty';
import { SprTitle } from '../../../SOPManager/styled/componentsStyled';


class ComponentProperties extends Component {

    getComponentProperty() {
        if (this.props.sectionData.component.compn_code === SectionData.EndpointType) {
            return <EndpointProperty sectionData={this.props.sectionData} actionStep={this.props.actionStep} onApplyComponentProperty={this.props.onApplyComponentProperty} onClickCancel={this.onClickCancel} />
        }
        else if (this.props.sectionData.component.compn_code === SectionData.ProcessType) {
            return <ProcessProperty sectionData={this.props.sectionData} teamAllTreeDatas={this.props.sopData.teamAllTreeDatas} actionStep={this.props.actionStep} onApplyComponentProperty={this.props.onApplyComponentProperty} onClickCancel={this.onClickCancel} showConfirmDialog={this.props.showConfirmDialog} />
        }
        else if (this.props.sectionData.component.compn_code === SectionData.AnnotationType) {
            return <AnnotationProperty sectionData={this.props.sectionData} actionStep={this.props.actionStep} onApplyComponentProperty={this.props.onApplyComponentProperty} onClickCancel={this.onClickCancel} />
        }
        else if (this.props.sectionData.component.compn_code === SectionData.DecisionType) {
            return <DecisionProperty sectionData={this.props.sectionData} actionStep={this.props.actionStep} onApplyComponentProperty={this.props.onApplyComponentProperty} onClickCancel={this.onClickCancel} />
        }
        else if (this.props.sectionData.component.compn_code === SectionData.InternalType) {
            return <InternalProperty sectionData={this.props.sectionData} teamAllTreeDatas={this.props.sopData.teamAllTreeDatas} actionStep={this.props.actionStep} onApplyComponentProperty={this.props.onApplyComponentProperty} onClickCancel={this.onClickCancel} showConfirmDialog={this.props.showConfirmDialog} />
        }
        return <></>
    }

    onClickCancel = () => {
        this.props.onSelectComponent(null, this.props.actionStep);
    }

    render() {
        if (this.props.sectionData === null || this.props.actionStep === null) {
            if (this.props.arrowData === null || this.props.actionStep === null) {
                return <SprTitle>{SopManagerResource.ID.componentProperty.title}</SprTitle>
            }
            else {
                return (
                    <>
                        <SprTitle>{SopManagerResource.ID.componentProperty.title}</SprTitle>
                        <ArrowProperty arrowData={this.props.arrowData} actionStep={this.props.actionStep} onApplyComponentProperty={this.props.onApplyComponentProperty} onClickCancel={this.onClickCancel} />
                    </>
                );
            }
        }

        return (
            <>
                <SprTitle>{SopManagerResource.ID.componentProperty.title}</SprTitle>
                {
                    this.getComponentProperty()
                }
            </>
        );
    }
}

export default ComponentProperties;