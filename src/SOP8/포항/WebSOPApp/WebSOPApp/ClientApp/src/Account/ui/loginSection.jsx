import React, { useEffect, useRef, useState } from 'react';
import AccountResource from '../resource/id';

import pwd_hide from '../images/pwd_hide.png';
import pwd_show from '../images/pwd_show.png';
import input_x from '../images/input_x.svg';

function LoginSection(props) {
    const [isShowPwd, setIsShowPwd] = useState(false);
    const [isAutoLogin, setIsAutoLogin] = useState(false);
    const [savedID, setSavedID] = useState(null);
    const [idValue, setIdValue] = useState('');
    const [pwdValue, setPwdValue] = useState('');

    const refID = useRef();
    const refPW = useRef();

    useEffect(() => {
        refID.current.focus();
    }, [])

    useEffect(() => {
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

        if(props.errorMsg === AccountResource.ID.textLoginError) {
            refID.current.classList.add('error');
            refPW.current.classList.add('error');
        }
    }, [props.errorMsg])

    const onKeyPressLogin = (e, type) => {
		if (e.key === 'Enter') {
			onClickLogin();
		}
        else if (type === 'id' && e.key === 'Tab') {
			e.preventDefault();
			refPW.current.focus();
		}
		else if (type === 'pwd' && e.key === 'Tab' && e.shiftKey) {
			e.preventDefault();
			refID.current.focus();
		}

		return;
	}

    const onClickLogin = () => {
        const id = refID.current.value.toString().trim();
        const pw = refPW.current.value.toString().trim();

        props.onClickLogin(id, pw);
    }

    const handleShowPwChecked = () => {
        const password = refPW.current;
        if (password === null)
            return;

        if(!isShowPwd) {
            password.type = 'text';
        } else {
            password.type = 'password';
        }

        setIsShowPwd(!isShowPwd);
    }

    const handleIDChange = (event) => {
        setIdValue(event.target.value);
    }

    const handlePWChange = (event) => {
        setPwdValue(event.target.value);
    }

    const clearInputText = (type) => {
		if (type === 'id') {
			const id = refID.current;
			if (id) {
                id.value = '';
				id.focus();
                setIdValue('');
            }
		}
		else if (type === 'pwd') {
			const pw = refPW.current;
			if (pw) {
                pw.value = '';
				refPW.current.type = 'password';
				pw.focus();
                setPwdValue('');
                setIsShowPwd(false);
            }
		}
	}

    const onChangeAutoLogin = (target) => {
        props.setIsAutoLogin(target.checked);
    }

    let errorMsgUI = null;

    if (props.errorMsg) {
		errorMsgUI = (
			<p>{props.errorMsg}</p>
		);
	}

    return (
        <div className='sectionWrap'>
            <div className='titleWrap'>
                <h2>로그인</h2>
                <p>아이디와 비밀번호를 입력해주세요.</p>
            </div>
            <form autoComplete='off'>
                <div className='inputWrap'>
                    <div>
                        <label htmlFor="inputId">
                            {AccountResource.ID.textTitleID}
                        </label>
                        <label htmlFor='saveId'>
                            <input type='checkbox' id='saveId' checked={props.isAutoLogin} onChange={(e) => onChangeAutoLogin(e.target)}/>
                            {AccountResource.ID.textAutoLogin}
                        </label>
                    </div>
                    <div className='inputWrap id'>
                        <input ref={refID} type='text' id='inputId' placeholder={AccountResource.ID.textIDInput} onKeyDown={(e) => onKeyPressLogin(e, 'id')} value={idValue} onChange={handleIDChange} />
                        <button
                            type='button'
                            onClick={() => clearInputText('id')}
                            style={{ display: idValue.length > 0 ? 'inline-block' : 'none' }}
                        >
                            <img className='clearBtn'src={input_x} alt='삭제 버튼' />
                        </button>
                    </div>
                </div>
                <div className='inputWrap'>
                    <div>
                        <label htmlFor="inputPwd">
                            {AccountResource.ID.textTitlePwd}
                        </label>
                    </div>
                    <div className='inputWrap pwd'>
                        <input ref={refPW} type='password' id='inputPwd' placeholder={AccountResource.ID.textPwdInput} onKeyDown={(e) => onKeyPressLogin(e, 'pwd')} value={pwdValue} onChange={handlePWChange} />
                        <button 
                            type='button'
                            style={{ display: pwdValue.length > 0 ? 'inline-block' : 'none' }}
                            onClick={() => handleShowPwChecked()}
                        >
                            <img className='showPwdBtn' src={isShowPwd ? pwd_show : pwd_hide} alt='비밀번호 보기 버튼' /> 
                        </button>
                        <button
                            type='button'
                            style={{ display: pwdValue.length > 0 ? 'inline-block' : 'none' }}
                            onClick={() => clearInputText('pwd')}
                        >
                            <img className='clearBtn'src={input_x} alt='삭제 버튼' />
                        </button>
                    </div>
                </div>

                {/* 로그인 유효성 검사시 사용 */}
                <div className='errorMsg'>
                    {errorMsgUI}
                </div>
                
                <button type='button' className='submitBtn' onClick={() => onClickLogin()}>로그인</button>
            </form>
        </div>
    );
}

export default LoginSection;