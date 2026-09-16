import React, { useState } from 'react';
import ColText from '../columns/colText';
import ColComboBox from '../columns/colComboBox';
import ColCheckBox from '../columns/colCheckBox';

import TeamEditorResource from '../../resource/id';
//import ProjectResource from '../../../Root/resource/id';
//import AccountResource from '../../../Account/resource/id';

import { ColTemporaryMemberNewComponent } from '../../../TeamEditor/styled/teamStyled';

function ColTemporaryMemberNew(props) {
    const [member, setMember] = useState(props.member);

    const onChangeCheckBox = (checked) => {
        member.check = checked;
        return;
    }

    const onChangeRole = (role) => {
        props.member.role = role;
    }

    const onChangeDisplaySOPName = (displaySOPName) => {
        props.member.displaySOPName = displaySOPName;
    }

    const openPopup = (columnName) => {
        const member = props.member;
        props.onChangeMemberEditMode(props.member, columnName, true);
        props.openPopup(member);
    }

    const onChangeMemberEditMode = (columnName) => {
        let isEditMode = true;
        if (props.member.editType === columnName) {
            isEditMode = false;
        }

        props.onChangeMemberEditMode(props.member, columnName, isEditMode);
    }

    let regularTeamName = "";
    let regularMemberName = "";
    let jobPositionName = "";

    if (props.member.regular !== null && props.member.regular !== undefined)
        regularTeamName = props.member.regular.teamName;

    if (props.member.regularMember !== null && props.member.regularMember !== undefined) {
        const regularMember = props.member.regularMember;
        regularMemberName = regularMember.memberName;

        const jobPositions = props.jobPositions;

        for (let i = 0; i < jobPositions.length; i++) {
            let jobPosition = jobPositions[i];

            if (regularMember.jobPositionID === jobPosition.value) {
                jobPositionName = jobPosition.name;
                break;
            }
        }
    }

    // 권한에 따라 삭제 컬럼 표시
    let checkBoxUI = null;
    checkBoxUI = <ColCheckBox
        defaultChecked={props.member.check}
        onChange={onChangeCheckBox}
    />;

    // const userAuthor = ProjectResource.getUserAuthor();
    // let checkBoxUI = null;

    // if (userAuthor === AccountResource.ID.accountLevel.admin) {
    //     checkBoxUI = <ColCheckBox
    //         defaultChecked={member.check}
    //         onChange={onChangeCheckBox}
    //     />;
    // }
        
    return (
        <>
            <ColTemporaryMemberNewComponent>
                {checkBoxUI}
                <div><span>{props.index + 1}</span></div>
                <div><span>{member?.regular?.teamName}</span></div>
                <div>
                    <span className={'colTextLink'} onMouseDown={() => openPopup(TeamEditorResource.ID.colTextMode.regularMemberName)}>{regularMemberName}</span>
                </div>
                <div>
                    <span>{jobPositionName}</span>
                </div>
                <ColComboBox
                    value={member.role} options={props.roles} member={member}
                    columnName={TeamEditorResource.ID.colTextMode.role} isEditMode={member.isEditMode} editColumnName={member.editType}
                    onChangeMemberEditMode={props.onChangeMemberEditMode} onChangeMember={props.onChangeMember}
                />
                <ColText
                    value={member.displaySOPName} member={member}
                    colID={TeamEditorResource.ID.colTextMode.displaySOPName + member.id} columnName={TeamEditorResource.ID.colTextMode.displaySOPName} isEditMode={member.isEditMode} editColumnName={member.editType}
                    onChangeMemberEditMode={props.onChangeMemberEditMode} onChangeMember={props.onChangeMember}
                />
                {/* <div>
                    <span className={styles.fixation + " " + teamEditors.colTextLink} onMouseDown={() => openPopup(TeamEditorResource.ID.colTextMode.regularTeamName)}>{regularTeamName}</span>
                </div> */}
            </ColTemporaryMemberNewComponent>
        </>
    );
}

export default ColTemporaryMemberNew;