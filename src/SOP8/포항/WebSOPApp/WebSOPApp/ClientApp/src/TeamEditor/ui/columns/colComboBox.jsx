import React, { useEffect, useState, useRef } from 'react';
import TeamEditorResource from '../../resource/id';

import { ColComboBoxComponent } from '../../../TeamEditor/styled/teamStyled';

function ColComboBox(props) {
    const [value, setValue] = useState(props.value);                // 선택된 값
    const [options, setOptions] = useState(props.options);          // 콤보박스 리스트
    const [columnName, setColumnName] = useState(props.columnName);

    const ref = useRef(null);

    useEffect(() => {
        const handleClick = (event) => {
            if (ref.current && !ref.current.contains(event.target)) {
                onChangeEditMode(false);
            }
        };

        document.addEventListener("mousedown", handleClick);

        return () => {
            document.removeEventListener("mousedown", handleClick);
        };
    }, []);

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
    }

    const getName = () => {
        let strName = null;
        if (props.options !== null) {
            for (let i = 0; i < props.options.length; i++) {
                if (columnName === TeamEditorResource.ID.colTextMode.role) {
                    if (props.options[i].roleNo === props.value) {
                        strName = props.options[i].roleName;
                        break;
                    }
                }
                else {
                    if (props.options[i].value === props.value) {
                        strName = props.options[i].name;
                        break;
                    }
                }
            }
        }

        return strName;
    }

    return (
        props.isEditMode && columnName === props.editColumnName ?
            <ColComboBoxComponent ref={ref}>
                <div>
                    <select onChange={(e) => onChangeCheck(e)} autoFocus className={'selectCombo'}>
                    <option value="">{`${props.columnName} 선택`}</option>
                    {
                        props.options.map((level, index) =>
                        (
                            <option key={columnName === TeamEditorResource.ID.colTextMode.role ? level.roleNo : level.value} value={columnName === TeamEditorResource.ID.colTextMode.role ? level.roleNo : level.value}>{columnName === TeamEditorResource.ID.colTextMode.role ? level.roleName : level.name}</option>
                        ))
                    }
                    </select>
                </div>
            </ColComboBoxComponent>
            :
            <div onMouseDown={() => onChangeEditMode(true)}>
                <span>{getName()}</span>
            </div>
    );
}

export default ColComboBox;