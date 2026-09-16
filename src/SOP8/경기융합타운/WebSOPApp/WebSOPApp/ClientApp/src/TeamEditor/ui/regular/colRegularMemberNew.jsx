import React, { useEffect, useState } from 'react';
import ColText from '../columns/colText';
import ColComboBox from '../columns/colComboBox';
import ColCheckBox from '../columns/colCheckBox';

import { TeamEditController } from '../../services/teamEditController';
import TeamEditorResource from '../../resource/id';
import ProjectResource from '../../../Root/resource/id';
import AccountResource from '../../../Account/resource/id';

function ColRegularMemberNew(props) {
    const [member, setMember] = useState(props.member);
    const [jobLevels, setJobLevels] = useState(props.jobLevels);
    const [jobPositions, setJobPositions] = useState(props.jobPositions);

    const onChangeCheckBox = (checked, index) => {
        props.onCheckedRow(checked, index);
    }

    let checkBoxUI = null;
    checkBoxUI = <ColCheckBox
        defaultChecked={props.member.checked}
        onChange={onChangeCheckBox}
        index={props.index}
    />;

    return (
        <>
            {checkBoxUI}
            <div><span>{props.index + 1}</span></div>
            <div><span>{member.teamName}</span></div>
            <ColText
                value={member.MemberName} member={member}
                colID={TeamEditorResource.ID.colTextMode.memberName + member.ID} columnName={TeamEditorResource.ID.colTextMode.memberName} isEditMode={member.isEditMode} editColumnName={member.editType}
                showConfirmDialog={props.showConfirmDialog}
                onChangeMemberEditMode={props.onChangeMemberEditMode} onChangeMember={props.onChangeMember}
            />
            <ColComboBox
                value={member.JobPositionID} options={props.jobPositions} member={member}
                columnName={TeamEditorResource.ID.colTextMode.jobPosition} isEditMode={member.isEditMode} editColumnName={member.editType}
                onChangeMemberEditMode={props.onChangeMemberEditMode} onChangeMember={props.onChangeMember}
            />
            <ColComboBox
                value={member.JobLevelID} options={props.jobLevels} member={member}
                columnName={TeamEditorResource.ID.colTextMode.jobLevel} isEditMode={member.isEditMode} editColumnName={member.editType}
                onChangeMemberEditMode={props.onChangeMemberEditMode} onChangeMember={props.onChangeMember}
            />
            <ColText
                value={member.PhoneNumber} member={member} checkPhoneNumber={props.checkPhoneNumber}
                colID={TeamEditorResource.ID.colTextMode.phoneNumber + member.ID} columnName={TeamEditorResource.ID.colTextMode.phoneNumber} isEditMode={member.isEditMode} editColumnName={member.editType}
                showConfirmDialog={props.showConfirmDialog}
                onChangeMemberEditMode={props.onChangeMemberEditMode} onChangeMember={props.onChangeMember}
            />
            <ColText
                value={member.OfficePhoneNumber} member={member}
                colID={TeamEditorResource.ID.colTextMode.officePhoneNumber + member.ID} columnName={TeamEditorResource.ID.colTextMode.officePhoneNumber} isEditMode={member.isEditMode} editColumnName={member.editType}
                showConfirmDialog={props.showConfirmDialog}
                onChangeMemberEditMode={props.onChangeMemberEditMode} onChangeMember={props.onChangeMember}
            />
            <ColText
                value={member.Email} member={member}
                colID={TeamEditorResource.ID.colTextMode.email + member.ID} columnName={TeamEditorResource.ID.colTextMode.email} isEditMode={member.isEditMode} editColumnName={member.editType}
                checkEmail={props.checkEmail}
                showConfirmDialog={props.showConfirmDialog}
                onChangeMemberEditMode={props.onChangeMemberEditMode} onChangeMember={props.onChangeMember}
            />
        </>
    );
}

export default ColRegularMemberNew;