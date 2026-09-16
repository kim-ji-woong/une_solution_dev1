import React, { useEffect, useState } from 'react';
import TeamEditorResource from '../../resource/id';
import ProjectResource from '../../../Root/resource/id';

import { ColTextComponent } from '../../../TeamEditor/styled/teamStyled';


function ColText(props) {
    let isFristFocus = true;

    const [value, setValue] = useState(props.value);
    const [columnName, setColumnName] = useState(props.columnName);

    useEffect(() => {
        const form = document.getElementById('td_' + props.colID);
        form.addEventListener('focusout', (event) => {

            const txt = document.getElementById('input_' + props.colID);
            if (txt !== null) {
                onBlurCheck(txt);
            }            
        });
    }, [])

    const onChangeEditMode = (isEditMode) => {
        props.onChangeMemberEditMode(props.member, columnName, isEditMode);
    }

    //정규식
    const onBlurCheck = (e) => {
        if (isFristFocus) {
            return;
        }

        let target = e;
        let isUpdate = true;

        if (columnName === '휴대전화번호') {
            // 중복 검사
            if (target.value !== '') {
                props.checkPhoneNumber(props.member.ID, target.value, target);
            }

            props.member.PhoneNumber = target.value;
        }
        else if (columnName === '근무처 전화번호') {
            props.member.OfficePhoneNumber = target.value;
        }
        else if (columnName === '메일') {
            let patternEmail = /^([0-9a-zA-Z_\.-]+)@([0-9a-zA-Z_-]+)(\.[0-9a-zA-Z_-]+){1,2}$/;

            const emailValid = patternEmail.test(target.value);
            if (target.value != "" && !emailValid) {
                props.showConfirmDialog(ProjectResource.dialogTypes.ERROR, [target.value + "이메일 형식이 맞지 않습니다"], null, null);
                setValue('');
                props.member.Email = '';
                return;
            }

            // 중복 검사
            if (target.value !== '') {
                props.checkEmail(props.member.ID, target.value, target);
            }

            props.member.Email = target.value;
        }
        else if (columnName === '사번') {

            // 중복 검사
            if (target.value !== '') {
                props.checkMemberID(props.member.ID, target.value, target);
            }

            props.member.MemberID = target.value;
        }
        else if (columnName === '이름') {
            props.member.MemberName = target.value;
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

        console.log("props.value: " + props.value + ", target.value: " + target.value + ", state.value: " + value);

        props.onChangeMember(props.member, isUpdate);
    }

    const onChangeCheck = (e) => {
        isFristFocus = false;

        let target = e;
        if (value === target.value) {
            return;
        }

        if (columnName === '휴대전화번호' ||
            columnName === '근무처 전화번호') {
            // 휴대전화일 경우 숫자 및 자릿수 제한
            const regex = /^[0-9\b -]{0,13}$/;
            if (regex.test(target.value)) {
                let value = target.value;
                let inputValue = value.replace(/-/g, '');
                inputValue = inputValue.replace(/ /g, '');

                if (inputValue.length === 4) {
                    // 지역번호 02 경우
                    if (columnName === '근무처 전화번호' &&
                        inputValue.indexOf('02') === 0) {
                        inputValue = inputValue.replace(/(\d{2})(\d{2})/, '$1-$2');
                    } else {
                        inputValue = inputValue.replace(/(\d{3})(\d{1})/, '$1-$2');
                    }
                } else if (inputValue.length === 8) {
                    if (columnName === '근무처 전화번호' &&
                        inputValue.indexOf('02') === 0) {
                        // 지역번호 02 경우
                        inputValue = inputValue.replace(/(\d{2})(\d{3})(\d{3})/, '$1-$2-$3');
                    } else 
                        inputValue = inputValue.replace(/(\d{3})(\d{4})(\d{1})/, '$1-$2-$3');
                } else if (inputValue.length === 9) {
                    if (columnName === '근무처 전화번호' &&
                        inputValue.indexOf('02') === 0) {
                        // 지역번호 02 경우
                        inputValue = inputValue.replace(/(\d{2})(\d{3})(\d{4})/, '$1-$2-$3');
                    } 
                } else if (inputValue.length === 10) {
                    if (columnName === '근무처 전화번호' &&
                        inputValue.indexOf('02') === 0) {
                        // 지역번호 02 경우
                        inputValue = inputValue.replace(/(\d{2})(\d{4})(\d{4})/, '$1-$2-$3');
                    } else
                        inputValue = inputValue.replace(/(\d{3})(\d{3})(\d{4})/, '$1-$2-$3');
                } else if (inputValue.length === 11 &&
                    !(columnName === '근무처 전화번호' && inputValue.indexOf('02') === 0)) {
                    inputValue = inputValue.replace(/(\d{3})(\d{4})(\d{4})/, '$1-$2-$3');
                } else {
                    inputValue = value;
                }

                setValue(inputValue);
            }
        }
        else if (columnName === '이름') {
            let value = target.value;
            const stateValue = value;

            // 한글, 영문만 허용
            const reg = /^[ㄱ-ㅎ|가-힣|a-z\s|A-Z\s|]+$/;
            const chk = reg.test(value);

            let inputValue = stateValue;

            if (value === "" || chk)
                inputValue = value;

            setValue(inputValue);
        }
        else if (columnName === '사번' ||
            columnName === 'SOP이름') {
            let value = target.value;
            const stateValue = value;

            // <,>,",',&,/ 특수문자 제외
            const reg = /^[ㄱ-ㅎ|가-힣|a-z|A-Z|0-9~!@#$%^*()_|+\-=?;:,.\{\}\[\]\\]*$/;
            const chk = reg.test(value);

            let inputValue = stateValue;

            if (value === "" || chk)
                inputValue = value;

            setValue(inputValue)
        }
        else {
            setValue(target.value);
        } 

        return;
    }

    const handleKeyPress = (e) => {
        isFristFocus = false;
        if (e.key === "Enter") {
            e.target.blur();
        }
        else if (e.key === 'Escape') {
            setValue(props.value);
            onChangeEditMode(false);
        }
    }

    let placeholder = '';
    if (columnName === TeamEditorResource.ID.colTextMode.memberName ||
        columnName === TeamEditorResource.ID.colTextMode.displaySOPName) {
        if (value === '새 인원') {
            setValue('');
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
                        onChange={(e) => onChangeCheck(e.target)}
                        //onBlur={(e) => onBlurCheck(e.target)} componentDidMount에 선언된 onBlurCheck하고 중복되어 이중으로 호출되어 주석처리 
                        onKeyPress={handleKeyPress}
                        value={value || ''}
                        placeholder={placeholder}                        
                    />
                </div>
            </ColTextComponent>
            :
            <div id={'td_' + props.colID} onMouseDown={() => onChangeEditMode(true)}>
                <span className={'colTextSpan'}>{value}</span>
            </div>
    );
}

export default ColText;