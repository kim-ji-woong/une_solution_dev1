import React, { useState } from 'react';
import TeamEditorResource from '../../resource/id';
import ProjectResource from '../../../Root/resource/id';

import { ColTextComponent } from '../../../TeamEditor/styled/teamStyled';
import AccountResource from '../../../Account/resource/id';

function ColText(props) {
    const [value, setValue] = useState(props.value);
    const [columnName] = useState(props.columnName);

    const onChangeEditMode = (isEditMode) => {
        props.onChangeMemberEditMode(props.member, columnName, isEditMode);
    };

    const isValidMobilePhoneNumber = (inputValue) => {
        const normalizedValue = (inputValue ?? "").replace(/-/g, "").trim();
        return /^01\d{8,9}$/.test(normalizedValue);
    };

    const isValidOfficePhoneNumber = (inputValue) => {
        const normalizedValue = (inputValue ?? "").replace(/-/g, "").trim();

        if (/^02\d{7,8}$/.test(normalizedValue)) {
            return true;
        }

        if (/^0\d{2}\d{7,8}$/.test(normalizedValue)) {
            return true;
        }

        return false;
    };

    const onBlurCheck = (target) => {
        let isUpdate = true;

        if (columnName === '휴대전화번호') {
            if (target.value !== '' && !isValidMobilePhoneNumber(target.value)) {
                props.showConfirmDialog(ProjectResource.dialogTypes.ERROR, [target.value + " 휴대전화번호 형식이 맞지 않습니다."], null, null);
                setValue(props.value ?? '');
                onChangeEditMode(false);
                return;
            }

            if (target.value.includes('-')) {
                target.value = target.value.replace(/-/g, '');
            }

            props.member.telno = target.value;
        }
        else if (columnName === '근무처 전화번호') {
            if (target.value !== '' && !isValidOfficePhoneNumber(target.value)) {
                props.showConfirmDialog(ProjectResource.dialogTypes.ERROR, [target.value + " 근무처 전화번호 형식이 맞지 않습니다."], null, null);
                setValue(props.value ?? '');
                onChangeEditMode(false);
                return;
            }

            if (target.value.includes('-')) {
                target.value = target.value.replace(/-/g, '');
            }

            props.member.offm_telno = target.value;
        }
        else if (columnName === '이메일') {
            const patternEmail = /^([0-9a-zA-Z_\.-]+)@([0-9a-zA-Z_-]+)(\.[0-9a-zA-Z_-]+){1,2}$/;
            const emailValid = patternEmail.test(target.value);
            if (target.value !== "" && !emailValid) {
                props.showConfirmDialog(ProjectResource.dialogTypes.ERROR, [target.value + "이메일 형식이 맞지 않습니다"], null, null);
                setValue(props.value ?? '');
                props.member.email = '';
                onChangeEditMode(false);
                return;
            }

            props.member.email = target.value;
        }
        else if (columnName === '사번') {
            if (target.value !== '') {
                const chk = props.checkMemberID(props.member.rgl_memb_sn, target.value, target);

                if (chk) {
                    setValue(props.value ?? '');
                    onChangeEditMode(false);
                    return;
                }
            }

            props.member.unq_key = target.value;
        }
        else if (columnName === '이름') {
            props.member.memb_name = target.value;
        }
        else if (columnName === '정/부') {
            props.member.role = target.value;
        }
        else if (columnName === 'SOP이름') {
            props.member.displaySOPName = target.value;
        }
        else {
            return;
        }

        if (props.value === target.value) {
            isUpdate = false;
        }

        props.onChangeMember(props.member, isUpdate);
    };

    const onChangeCheck = (target) => {
        if (value === target.value) {
            return;
        }

        if (columnName === '휴대전화번호' || columnName === '근무처 전화번호') {
            const regex = /^[0-9\b -]{0,13}$/;
            if (regex.test(target.value)) {
                let currentValue = target.value;
                let inputValue = currentValue.replace(/-/g, '').replace(/ /g, '');

                if (inputValue.length === 4) {
                    if (columnName === '근무처 전화번호' && inputValue.indexOf('02') === 0) {
                        inputValue = inputValue.replace(/(\d{2})(\d{2})/, '$1-$2');
                    } else {
                        inputValue = inputValue.replace(/(\d{3})(\d{1})/, '$1-$2');
                    }
                } else if (inputValue.length === 8) {
                    if (columnName === '근무처 전화번호' && inputValue.indexOf('02') === 0) {
                        inputValue = inputValue.replace(/(\d{2})(\d{3})(\d{3})/, '$1-$2-$3');
                    } else {
                        inputValue = inputValue.replace(/(\d{3})(\d{4})(\d{1})/, '$1-$2-$3');
                    }
                } else if (inputValue.length === 9) {
                    if (columnName === '근무처 전화번호' && inputValue.indexOf('02') === 0) {
                        inputValue = inputValue.replace(/(\d{2})(\d{3})(\d{4})/, '$1-$2-$3');
                    }
                } else if (inputValue.length === 10) {
                    if (columnName === '근무처 전화번호' && inputValue.indexOf('02') === 0) {
                        inputValue = inputValue.replace(/(\d{2})(\d{4})(\d{4})/, '$1-$2-$3');
                    } else {
                        inputValue = inputValue.replace(/(\d{3})(\d{3})(\d{4})/, '$1-$2-$3');
                    }
                } else if (inputValue.length === 11 && !(columnName === '근무처 전화번호' && inputValue.indexOf('02') === 0)) {
                    inputValue = inputValue.replace(/(\d{3})(\d{4})(\d{4})/, '$1-$2-$3');
                } else {
                    inputValue = currentValue;
                }

                setValue(inputValue);
            }
        }
        else if (columnName === '이름') {
            const currentValue = target.value;
            const reg = /^[ㄱ-ㅎ|가-힣|a-z\s|A-Z\s|]+$/;
            const chk = reg.test(currentValue);

            if (currentValue === "" || chk) {
                setValue(currentValue);
            }
        }
        else if (columnName === '사번' || columnName === 'SOP이름') {
            const currentValue = target.value;
            const reg = /^[ㄱ-ㅎ|가-힣|a-z|A-Z|0-9~!@#$%^*()_|+\-=?;:,.\{\}\[\]\\]*$/;
            const chk = reg.test(currentValue);

            if (currentValue === "" || chk) {
                setValue(currentValue);
            }
        }
        else {
            setValue(target.value);
        }
    };

    const handleKeyPress = (e) => {
        if (e.key === "Enter") {
            e.target.blur();
        }
        else if (e.key === 'Escape') {
            setValue(props.value);
            onChangeEditMode(false);
        }
    };

    const formatValue = (currentValue) => {
        if (!currentValue || !["휴대전화번호", "근무처 전화번호"].includes(columnName)) {
            return currentValue;
        }

        return AccountResource.formatNumber(currentValue);
    };

    let placeholder = '';
    if (columnName === TeamEditorResource.ID.colTextMode.memberName ||
        columnName === TeamEditorResource.ID.colTextMode.displaySOPName) {
        if (value === '새 인원') {
            placeholder = '새 인원';
        }
    }

    return (
        props.isEditMode && columnName === props.editColumnName ?
            <ColTextComponent>
                <div id={'td_' + props.colID}>
                    <input
                        type="text"
                        id={'input_' + props.colID}
                        autoFocus={true}
                        onMouseDown={(e) => e.stopPropagation()}
                        onChange={(e) => onChangeCheck(e.target)}
                        onBlur={(e) => onBlurCheck(e.target)}
                        onKeyPress={handleKeyPress}
                        value={value || ''}
                        placeholder={placeholder}
                    />
                </div>
            </ColTextComponent>
            :
            <div id={'td_' + props.colID} onClick={() => onChangeEditMode(true)}>
                <span className={'colTextSpan'}>{formatValue(value)}</span>
            </div>
    );
}

export default ColText;
