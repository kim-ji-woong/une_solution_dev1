import React, { useState } from 'react';
import ColText from '../columns/colText';
import ColComboBox from '../columns/colComboBox';
import ColCheckBox from '../columns/colCheckBox';

import TeamEditorResource from '../../resource/id';
//import ProjectResource from '../../../Root/resource/id';
//import AccountResource from '../../../Account/resource/id';

import { ColTemporaryMemberNewComponent } from '../../../TeamEditor/styled/teamStyled';

function ColTemporaryMemberNew(props) {

    const onChangeCheckBox = (checked, index) => {
        props.onCheckedRow(checked, index);
    }

    const openPopup = (columnName) => {
        const member = props.member;
        props.onChangeMemberEditMode(props.member, columnName, true);
        props.openPopup(member);
    }


    let checkBoxUI = null;
    checkBoxUI = <ColCheckBox
        defaultChecked={props.member.checked}
        onChange={onChangeCheckBox}
        index={props.index}
    />;

    let regularTeamName = "";
    let regularMemberName = "";
    let jobPositionName = "";

    if (props.member.regular !== null && props.member.regular !== undefined)
        regularTeamName = props.member.regular.team_name;

    if (props.member.regularMember !== null && props.member.regularMember !== undefined) {
        const regularMember = props.member.regularMember;
        regularMemberName = regularMember.memb_name;

        const jobPositions = props.jobPositions;

        for (let i = 0; i < jobPositions.length; i++) {
            let jobPosition = jobPositions[i];

            if (regularMember.ofcps_no === jobPosition.value) {
                jobPositionName = jobPosition.name;
                break;
            }
        }
    }
        
    return (
        <>
            {checkBoxUI}
            <div><span>{props.index + 1}</span></div>
            <div>
                <span className={'colTextLink'} onMouseDown={() => openPopup(TeamEditorResource.ID.colTextMode.regularMemberName)}>{props.member?.regular?.team_name}</span>
            </div>
            <div>
                <span className={'colTextLink'} onMouseDown={() => openPopup(TeamEditorResource.ID.colTextMode.regularMemberName)}>{regularMemberName ? regularMemberName : '-'}</span>
            </div>
            <div>
                <span>{jobPositionName ? jobPositionName : '-'}</span>
            </div>
            <ColComboBox
                value={props.member?.role} options={props.roles} member={props.member}
                columnName={TeamEditorResource.ID.colTextMode.role} isEditMode={props.member.isEditMode} editColumnName={props.member.editType}
                onChangeMemberEditMode={props.onChangeMemberEditMode} onChangeMember={props.onChangeMember}
            />
            <ColText
                value={props.member.displaySOPName} member={props.member}
                colID={TeamEditorResource.ID.colTextMode.displaySOPName + props.member.memberNo} columnName={TeamEditorResource.ID.colTextMode.displaySOPName} isEditMode={props.member.isEditMode} editColumnName={props.member.editType}
                onChangeMemberEditMode={props.onChangeMemberEditMode} onChangeMember={props.onChangeMember}
            />
        </>
    );
}

export default ColTemporaryMemberNew;