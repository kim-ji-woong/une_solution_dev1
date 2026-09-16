import React, { useEffect, useRef, useState } from 'react';
import AccountResource from '../resource/id';

import TextButton from '../../Common/components/textButton';
import { LoginSectionComponent } from '../styled/loginPageStyled';
import Icon from '../../Common/components/Icon/Icon';
import BoxButton from '../../Common/components/boxButton';
import InputBox from '../../Common/components/inputBox';

function LoginSection(props) {
    const [idValue, setIdValue] = useState('');
    const [pwdValue, setPwdValue] = useState('');

    const onClickLogin = () => {
        const id = idValue.toString().trim();
        const pw = pwdValue.toString().trim();

        // 아이디 로컬스토리지에 저장
        try {
            if (id.length > 0) {
                localStorage.setItem('savedId', id);
            } else {
                localStorage.removeItem('savedId');
            }
        } catch (e) {
            console.warn('Cannot write to localStorage:', e);
        }

        props.onClickLogin(id, pw);
    };

    const onChangeAutoLogin = (target) => {
        props.setIsAutoLogin(target.checked);
    }

    const isIdError =
        props.errorMsg === AccountResource.ID.textLoginIDError ||
        props.errorMsg === AccountResource.ID.textLoginError;

    const isPwdError =
        props.errorMsg === AccountResource.ID.textLoginPwdError ||
        props.errorMsg === AccountResource.ID.textLoginError;

    let errorMsgUI = null;
    if (props.errorMsg) {
        errorMsgUI = <p>{props.errorMsg}</p>;
    }

    return (
        <LoginSectionComponent>
            <div>
                <div className='headerWrap'>
                    <p>로그인</p>
                    <span>아이디와 비밀번호를 입력하세요</span>
                </div>
                <div className='sectionWrap'>
                    <div className='inputWrap'>
                        <p>아이디</p>
                        <div>
                            <InputBox
                                value={idValue}
                                onChange={setIdValue}
                                placeholder={"입력하세요"}
                                onClear={() => setIdValue("")}
                                fullWidth={true}
                                leftIcon={<Icon.User size={"sm"} />}
                                error={isIdError}
                            />
                        </div>
                    </div>
                    <div className='inputWrap'>
                        <p>비밀번호</p>
                        <div>
                            <InputBox
                                type="password"
                                value={pwdValue}
                                onChange={setPwdValue}
                                placeholder={"입력하세요"}
                                onClear={() => setPwdValue("")}
                                fullWidth={true}
                                leftIcon={<Icon.Lock size={"sm"} isActive={false} />}
                                onKeyDown={(e) => {
                                    if (e.key === 'Enter') {
                                        onClickLogin();
                                    }
                                }}
                                error={isPwdError}
                            />
                        </div>
                    </div>

                    <div className='contentWrap'>
                        {/* 로그인 유효성 검사시 사용 */}
                        <div className='errorMsg'>
                            {errorMsgUI}
                        </div>
                        <label htmlFor='saveId'>
                            <input
                                type='checkbox'
                                id='saveId'
                                checked={props.isAutoLogin}
                                onChange={(e) => onChangeAutoLogin(e.target)}
                            />
                            로그인 상태 유지
                        </label>
                    </div>

                    <BoxButton
                        className='submitBtn'
                        variant="fill"
                        size="xl"
                        fullWidth={true}
                        onClick={onClickLogin}
                    >
                        로그인
                    </BoxButton>
                    <TextButton
                        variant="unfill"
                        size="xl"
                        fullWidth={true}
                        onClick={() => props.onChangeSection(1)}
                    >
                        비밀번호 찾기
                    </TextButton>
                </div>
            </div>
        </LoginSectionComponent>
    );
}

export default LoginSection;