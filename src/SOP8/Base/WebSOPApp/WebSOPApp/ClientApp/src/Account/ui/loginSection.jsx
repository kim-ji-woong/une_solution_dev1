import React, { useEffect, useRef, useState } from 'react';
import AccountResource from '../resource/id';

import pwd_hide from '../images/pwd_hide.png';
import pwd_show from '../images/pwd_show.png';

function LoginSection(props) {
    const [isShowPwd, setIsShowPwd] = useState(false);

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

    const onKeyPressLogin = (e) => {
		if (e.key === 'Enter') {
			onClickLogin();
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
                            {AccountResource.ID.textTitleID}<span>*</span>
                        </label>
                        <label htmlFor='saveId'>
                            <input type='checkbox' id='saveId' />
                            {AccountResource.ID.textIDsave}
                        </label>
                    </div>
                    <input ref={refID} type='text' id='inputId' placeholder={AccountResource.ID.textIDInput} onKeyUp={(e) => onKeyPressLogin(e)} />
                </div>
                <div className='inputWrap'>
                    <div>
                        <label htmlFor="inputPwd">
                            {AccountResource.ID.textTitlePwd}<span>*</span>
                        </label>
                    </div>
                    <input ref={refPW} type='password' id='inputPwd' placeholder={AccountResource.ID.textPwdInput} onKeyUp={(e) => onKeyPressLogin(e)} />
                    <button 
                        type='button'
                        className='showPwdBtn' 
                        onClick={() => handleShowPwChecked()}
                    >
                        <img src={isShowPwd ? pwd_show : pwd_hide} alt='비밀번호 보기 버튼' />
                    </button>
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