import React, { useEffect, useState } from 'react';
import TeamEditorResource from '../../resource/id';

import { ColComboBoxComponent } from '../../../TeamEditor/styled/teamStyled';

function ColComboBox(props) {
    const [value, setValue] = useState(props.value);                // 선택된 값
    const [options, setOptions] = useState(props.options);          // 콤보박스 리스트
    const [isClickChk, setIsClickChk] = useState(false);            // 더블클릭 체크값
    const [columnName, setColumnName] = useState(props.columnName);

    useEffect(() => {
        if(value === null) {
            setValue("");
        }
    }, [])

    useEffect(() => {
        if (props.options !== options) {
            setOptions(props.options);
        }
    }, [props.options]);

    const onChangeEditMode = (isEditMode) => {
        props.onChangeMemberEditMode(props.member, columnName, isEditMode);
    }

    const onChangeCheck = (e) => {
        let val = Number(e.target.value);
        setValue(val);

        let isUpdate = true;
        if (props.value === val) {
            isUpdate = false;
        }

        if (columnName === TeamEditorResource.ID.colTextMode.jobLevel) {
            props.member.JobLevelID = val;
        }
        else if (columnName === TeamEditorResource.ID.colTextMode.jobPosition) {
            props.member.JobPositionID = val;
        }
        else if (columnName === TeamEditorResource.ID.colTextMode.role) {
            props.member.role = val;
        }
        else {
            return;
        }

        props.onChangeMember(props.member, isUpdate);
    }

    var strName = null;
    if (props.options !== null) {
        for (var i = 0; i < props.options.length; i++) {
            if (props.options[i].value === props.value) {
                strName = props.options[i].name;
                break;
            }
        }
    }

    return (
        props.isEditMode && columnName === props.editColumnName ?
            <ColComboBoxComponent>
                <div>
                    <select onChange={(e) => onChangeCheck(e)} defaultValue={props.value} autoFocus className={'selectCombo'}>
                    {
                        props.options.map((level, index) =>
                        (
                            <option key={level.value} value={level.value}>{level.name}</option>
                        ))
                    }
                    </select>
                </div>
            </ColComboBoxComponent>
            :
            <div onMouseDown={() => onChangeEditMode(true)}>
                <span>{strName}</span>
            </div>
    );
}

export default ColComboBox;