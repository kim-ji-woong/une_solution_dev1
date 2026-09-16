import React, { useEffect, useState, useRef } from 'react';
import TeamEditorResource from '../../resource/id';
import ProjectResource from '../../../Root/resource/id';

import { ColTextComponent } from '../../../TeamEditor/styled/teamStyled';
import AccountResource from '../../../Account/resource/id';


function ColText(props) {
    const [value, setValue] = useState(props.value);
    const [columnName, setColumnName] = useState(props.columnName);

    const ref = useRef(null);

    useEffect(() => {
        const handleClick = (event) => {
            if (ref.current && !ref.current.contains(event.target)) {
                const element = document.getElementById('input_' + props.colID);
                if (element) {
                    onBlurCheck(element);
                } 
            }
        };

        document.addEventListener("mousedown", handleClick);

        return () => {
            document.removeEventListener("mousedown", handleClick);
        };
    }, []);

    const onChangeEditMode = (isEditMode) => {
        props.onChangeMemberEditMode(props.member, columnName, isEditMode);
    }

    //정규식
    const onBlurCheck = (e) => {
        let target = e;
        let isUpdate = true;

        if (columnName === '휴대전화번호') {
            // 중복 검사
            if (target.value !== '') {
                const chk = props.checkPhoneNumber(props.member.rgl_memb_sn, target.value, target);

                if (chk) {
                    setValue('');
                    return;
                }
            }

            props.member.telno = target.value;
        }
        else if (columnName === '근무처 전화번호') {
            props.member.offm_telno = target.value;
        }
        else if (columnName === '이메일') {
            let patternEmail = /^([0-9a-zA-Z_\.-]+)@([0-9a-zA-Z_-]+)(\.[0-9a-zA-Z_-]+){1,2}$/;

            const emailValid = patternEmail.test(target.value);
            if (target.value != "" && !emailValid) {
                props.showConfirmDialog(ProjectResource.dialogTypes.ERROR, [target.value + "이메일 형식이 맞지 않습니다"], null, null);
                setValue('');
                props.member.email = '';
                return;
            }

            // 중복 검사
            if (target.value !== '') {
                const chk = props.checkEmail(props.member.rgl_memb_sn, target.value, target);

                if (chk) {
                    setValue('');
                    return;
                }
            }

            props.member.email = target.value;
        }
        else if (columnName === '사번') {

            // 중복 검사
            if (target.value !== '') {
                const chk = props.checkMemberID(props.member.rgl_memb_sn, target.value, target);

                if (chk) {
                    setValue('');
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

        console.log("props.value: " + props.value + ", target.value: " + target.value + ", state.value: " + value);

        props.onChangeMember(props.member, isUpdate);
    }

    const onChangeCheck = (e) => {
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
        if (e.key === "Enter") {
            e.target.blur();
        }
        else if (e.key === 'Escape') {
            setValue(props.value);
            onChangeEditMode(false);
        }
    }

    const formatValue = (value) => {
        // 휴대전화번호와 근무처 전화번호의 값만 formating
        if (!value || !["휴대전화번호", "근무처 전화번호"].includes(columnName)) {
            return value;
        }

        const number = AccountResource.formatNumber(value);
        return number;
    }

    let placeholder = '';
    if (columnName === TeamEditorResource.ID.colTextMode.memberName ||
        columnName === TeamEditorResource.ID.colTextMode.displaySOPName) {
        if (value === '새 인원') {
            // setValue('');
            placeholder = '새 인원';
        }
    }

    return (
        props.isEditMode && columnName === props.editColumnName ?
            <ColTextComponent ref={ref}>
                <div id={'td_' + props.colID}>
                    <input
                        type="text"
                        id={'input_' + props.colID}
                        autoFocus={true}
                        onChange={(e) => onChangeCheck(e.target)}
                        onBlur={(e) => onBlurCheck(e.target)}
                        onKeyPress={handleKeyPress}
                        value={value || ''}
                        placeholder={placeholder}                        
                    />
                </div>
            </ColTextComponent>
            :
            <div id={'td_' + props.colID} onMouseDown={() => onChangeEditMode(true)}>
                <span className={'colTextSpan'}>{formatValue(value)}</span>
            </div>
    );
}

export default ColText;