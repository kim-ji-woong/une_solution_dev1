import React, { useEffect, useState } from 'react';
import ColText from '../columns/colText';
import ColComboBox from '../columns/colComboBox';
import ColCheckBox from '../columns/colCheckBox';

import TeamEditorResource from '../../resource/id';

function ColRegularMemberNew(props) {

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
            <div><span>{props.member.teamName}</span></div>
            <ColText
                value={props.member.memb_name} member={props.member}
                colID={TeamEditorResource.ID.colTextMode.memberName + props.member.rgl_memb_sn} columnName={TeamEditorResource.ID.colTextMode.memberName} isEditMode={props.member.isEditMode} editColumnName={props.member.editType}
                showConfirmDialog={props.showConfirmDialog}
                onChangeMemberEditMode={props.onChangeMemberEditMode} onChangeMember={props.onChangeMember}
            />
            <ColComboBox
                value={props.member.ofcps_no} options={props.jobPositions} member={props.member}
                columnName={TeamEditorResource.ID.colTextMode.jobPosition} isEditMode={props.member.isEditMode} editColumnName={props.member.editType}
                onChangeMemberEditMode={props.onChangeMemberEditMode} onChangeMember={props.onChangeMember}
            />
            <ColComboBox
                value={props.member.clsf_no} options={props.jobLevels} member={props.member}
                columnName={TeamEditorResource.ID.colTextMode.jobLevel} isEditMode={props.member.isEditMode} editColumnName={props.member.editType}
                onChangeMemberEditMode={props.onChangeMemberEditMode} onChangeMember={props.onChangeMember}
            />
            <ColText
                value={props.member.unq_key} member={props.member} checkMemberID={props.checkMemberID}
                colID={TeamEditorResource.ID.colTextMode.memberID + props.member.rgl_memb_sn} columnName={TeamEditorResource.ID.colTextMode.memberID} isEditMode={props.member.isEditMode} editColumnName={props.member.editType}
                showConfirmDialog={props.showConfirmDialog}
                onChangeMemberEditMode={props.onChangeMemberEditMode} onChangeMember={props.onChangeMember}
            />
            <ColText
                value={props.member.telno} member={props.member} checkPhoneNumber={props.checkPhoneNumber}
                colID={TeamEditorResource.ID.colTextMode.phoneNumber + props.member.rgl_memb_sn} columnName={TeamEditorResource.ID.colTextMode.phoneNumber} isEditMode={props.member.isEditMode} editColumnName={props.member.editType}
                showConfirmDialog={props.showConfirmDialog}
                onChangeMemberEditMode={props.onChangeMemberEditMode} onChangeMember={props.onChangeMember}
            />
            <ColText
                value={props.member.offm_telno} member={props.member}
                colID={TeamEditorResource.ID.colTextMode.officePhoneNumber + props.member.rgl_memb_sn} columnName={TeamEditorResource.ID.colTextMode.officePhoneNumber} isEditMode={props.member.isEditMode} editColumnName={props.member.editType}
                showConfirmDialog={props.showConfirmDialog}
                onChangeMemberEditMode={props.onChangeMemberEditMode} onChangeMember={props.onChangeMember}
            />
            <ColText
                value={props.member.email} member={props.member}
                colID={TeamEditorResource.ID.colTextMode.email + props.member.rgl_memb_sn} columnName={TeamEditorResource.ID.colTextMode.email} isEditMode={props.member.isEditMode} editColumnName={props.member.editType}
                checkEmail={props.checkEmail}
                showConfirmDialog={props.showConfirmDialog}
                onChangeMemberEditMode={props.onChangeMemberEditMode} onChangeMember={props.onChangeMember}
            />
        </>
    );
}

export default ColRegularMemberNew;