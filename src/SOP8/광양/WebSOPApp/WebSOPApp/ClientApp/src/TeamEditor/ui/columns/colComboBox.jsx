import React, { useEffect, useState } from 'react';
import TeamEditorResource from '../../resource/id';

import { ColComboBoxComponent } from '../../../TeamEditor/styled/teamStyled';

function ColComboBox(props) {
    const [value, setValue] = useState(props.value);
    const [options, setOptions] = useState(props.options);
    const [columnName] = useState(props.columnName);

    useEffect(() => {
        if (value === null) {
            setValue("");
        }
    }, []);

    useEffect(() => {
        if (props.value !== value) {
            setValue(props.value ?? "");
        }
    }, [props.value]);

    useEffect(() => {
        if (props.options !== options) {
            setOptions(props.options);
        }
    }, [props.options]);

    const onChangeEditMode = (isEditMode) => {
        props.onChangeMemberEditMode(props.member, columnName, isEditMode);
    };

    const onChangeCheck = (e) => {
        const val = Number(e.target.value);
        setValue(val);

        let isUpdate = true;
        if (props.value === val) {
            isUpdate = false;
        }

        if (columnName === TeamEditorResource.ID.colTextMode.jobLevel) {
            props.member.clsf_no = val;
        }
        else if (columnName === TeamEditorResource.ID.colTextMode.jobPosition) {
            props.member.ofcps_no = val;
        }
        else if (columnName === TeamEditorResource.ID.colTextMode.role) {
            props.member.role = val;
        }
        else {
            return;
        }

        props.onChangeMember(props.member, isUpdate);
    };

    const getName = () => {
        let strName = null;
        const currentValue = value === "" ? null : value;

        if (options !== null) {
            for (let i = 0; i < options.length; i++) {
                if (columnName === TeamEditorResource.ID.colTextMode.role) {
                    if (options[i].roleNo === currentValue) {
                        strName = options[i].roleName;
                        break;
                    }
                }
                else {
                    if (options[i].value === currentValue) {
                        strName = options[i].name;
                        break;
                    }
                }
            }
        }

        return strName;
    };

    return (
        props.isEditMode && columnName === props.editColumnName ?
            <ColComboBoxComponent>
                <div>
                    <select
                        onMouseDown={(e) => e.stopPropagation()}
                        onChange={(e) => onChangeCheck(e)}
                        onBlur={() => onChangeEditMode(false)}
                        value={value ?? ""}
                        autoFocus
                        className={'selectCombo'}
                    >
                        <option value="">{`${props.columnName} 선택`}</option>
                        {options.map((level) => (
                            <option
                                key={columnName === TeamEditorResource.ID.colTextMode.role ? level.roleNo : level.value}
                                value={columnName === TeamEditorResource.ID.colTextMode.role ? level.roleNo : level.value}
                            >
                                {columnName === TeamEditorResource.ID.colTextMode.role ? level.roleName : level.name}
                            </option>
                        ))}
                    </select>
                </div>
            </ColComboBoxComponent>
            :
            <div onClick={() => onChangeEditMode(true)}>
                <span>{getName()}</span>
            </div>
    );
}

export default ColComboBox;
