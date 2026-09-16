import React, { useEffect, useRef, useState } from 'react';
import AccountResource from '../resource/id';

import pwd_hide from '../images/pwd_hide.svg';
import pwd_show from '../images/pwd_show.svg';
import cancelIcon from '../images/cancelIcon.svg';
import une_logo from '../../Common/images/une_logo.png';
import Button from '../../Common/components/button';
import { LoginSectionComponent } from '../styled/loginPageStyled';

function LoginSection(props) {
    const [isShowPwd, setIsShowPwd] = useState(false);
    const [idValue, setIdValue] = useState('');
    const [pwdValue, setPwdValue] = useState('');
    const [saveId, setSaveId] = useState(false);

    const refID = useRef();
    const refPW = useRef();

    // 첫 마운트 시 ID input 포커스 + 저장된 아이디 로딩
    useEffect(() => {
        if (refID.current) {
            refID.current.focus();
        }

        try {
            const savedId = localStorage.getItem('savedId');
            if (savedId && refID.current) {
                refID.current.value = savedId;
                setIdValue(savedId);
                setSaveId(true);
            }
        } catch (e) {
            console.warn('Cannot access localStorage:', e);
        }
    }, []);

    useEffect(() => {
        if (!refID.current || !refPW.current) return;

        if (props.errorMsg === AccountResource.ID.textLoginIDError) {
            refID.current.classList.add('error');
        } else {
            refID.current.classList.remove('error');
        }

        if (props.errorMsg === AccountResource.ID.textLoginPwdError) {
            refPW.current.classList.add('error');
        } else {
            refPW.current.classList.remove('error');
        }

        if (props.errorMsg === AccountResource.ID.textLoginError) {
            refID.current.classList.add('error');
            refPW.current.classList.add('error');
        }
    }, [props.errorMsg]);

    const onKeyPressLogin = (e, type) => {
        if (e.key === 'Enter') {
            onClickLogin();
        } else if (type === 'id' && e.key === 'Tab') {
            e.preventDefault();
            refPW.current?.focus();
        } else if (type === 'pwd' && e.key === 'Tab' && e.shiftKey) {
            e.preventDefault();
            refID.current?.focus();
        }
        return;
    };

    const handleIDChange = (event) => {
        setIdValue(event.target.value);
    };

    const handlePWChange = (event) => {
        setPwdValue(event.target.value);
    };

    const onClickLogin = () => {
        const id = refID.current?.value?.toString().trim() ?? '';
        const pw = refPW.current?.value?.toString().trim() ?? '';

        // 아이디 로컬스토리지에 저장
        try {
            if (saveId && id.length > 0) {
                localStorage.setItem('savedId', id);
            } else {
                localStorage.removeItem('savedId');
            }
        } catch (e) {
            console.warn('Cannot write to localStorage:', e);
        }

        props.onClickLogin(id, pw);
    };

    const clearInputText = (type) => {
        if (type === 'id') {
            const id = refID.current;
            if (id) {
                id.value = '';
                id.focus();
                setIdValue('');
            }
        } else if (type === 'password') {
            const pw = refPW.current;
            if (pw) {
                pw.value = '';
                pw.focus();
                setPwdValue('');
                setIsShowPwd(false);
                pw.type = 'password';
            }
        }
    };

    const handleShowPwChecked = () => {
        const password = refPW.current;
        if (password === null) return;

        if (!isShowPwd) {
            password.type = 'text';
        } else {
            password.type = 'password';
        }
        setIsShowPwd(!isShowPwd);
    };

    const handleSaveIdChange = (e) => {
        const checked = e.target.checked;
        setSaveId(checked);

        // 체크 해제 시 저장값 제거
        if (!checked) {
            try {
                localStorage.removeItem('savedId');
            } catch (err) {
                console.warn('Cannot remove savedId from localStorage:', err);
            }
        } else {
            // 체크 시 현재 입력값 저장
            try {
                const currentId = refID.current?.value?.toString().trim() ?? '';
                if (currentId.length > 0) {
                    localStorage.setItem('savedId', currentId);
                }
            } catch (err) {
                console.warn('Cannot set savedId to localStorage:', err);
            }
        }
    };

    let errorMsgUI = null;
    if (props.errorMsg) {
        errorMsgUI = <p>{props.errorMsg}</p>;
    }

    return (
        <LoginSectionComponent>
            <div className='sectionWrap'>
                <div className='titleWrap login'>
                    <img src={une_logo} alt='솔브레인 로고' width={158} height={67} />
                </div>
                <form autoComplete='off'>
                    <div className='inputWrap'>
                        <input
                            ref={refID}
                            type='text'
                            id='inputId'
                            placeholder={AccountResource.ID.textIDInput}
                            onKeyDown={(e) => onKeyPressLogin(e, 'id')}
                            onChange={handleIDChange}
                        />
                        <button
                            type='button'
                            className={'clearBtn'}
                            style={{ display: idValue.length > 0 ? 'flex' : 'none' }}
                            onClick={() => clearInputText('id')}
                        >
                            <img src={cancelIcon} alt='입력 내용 초기화 버튼' />
                        </button>
                    </div>
                    <div className='inputWrap'>
                        <input
                            ref={refPW}
                            type='password'
                            id='inputPwd'
                            placeholder={AccountResource.ID.textPwdInput}
                            onKeyDown={(e) => onKeyPressLogin(e, 'pwd')}
                            onChange={handlePWChange}
                        />
                        <button
                            type='button'
                            className='showPwdBtn'
                            style={{ display: pwdValue.length > 0 ? 'flex' : 'none' }}
                            onClick={handleShowPwChecked}
                        >
                            <img src={isShowPwd ? pwd_show : pwd_hide} alt='비밀번호 보기 버튼' />
                        </button>
                        <button
                            type='button'
                            className={'clearBtn'}
                            style={{ display: pwdValue.length > 0 ? 'flex' : 'none' }}
                            onClick={() => clearInputText('password')}
                        >
                            <img src={cancelIcon} alt='입력 내용 초기화 버튼' />
                        </button>
                    </div>

                    <div className='contentWrap'>
                        <div>
                            <label htmlFor='saveId'>
                                <input
                                    type='checkbox'
                                    id='saveId'
                                    checked={saveId}
                                    onChange={handleSaveIdChange}
                                />
                                아이디 저장
                            </label>
                        </div>
                        <div>
                            <Button
                                className="submitBtn"
                                variant="unfill"
                                size="xxs"
                                onClick={() => props.onChangeSection(1)}
                            >
                                비밀번호 찾기
                            </Button>
                        </div>
                    </div>

                    {/* 로그인 유효성 검사시 사용 */}
                    <div className='errorMsg'>
                        {errorMsgUI}
                    </div>
                    <Button
                        className="submitBtn"
                        variant="fill"
                        size="xxxl"
                        onClick={onClickLogin}
                    >
                        로그인
                    </Button>
                </form>
            </div>
        </LoginSectionComponent>
    );
}

export default LoginSection;