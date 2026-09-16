import React, { useState } from 'react';
import { withRouter } from 'react-router-dom';

import { ChangePwdComponent  } from '../styled/myPageStyled';
import { ModalBackground } from '../../Root/styled/theme';
import { AccountController } from '../services/accountController';
import ProjectResource from '../../Root/resource/id';
import IconButton from '../../Common/components/iconButton';
import TextButton from '../../Common/components/textButton';
import Icon from '../../Common/components/Icon/Icon';
import BoxButton from '../../Common/components/boxButton';
import InputBox from '../../Common/components/inputBox';
import AccountResource from '../resource/id';
import AccountStore from '../accountStore';

function ChangePwd(props) {
    const [currentPWValue, setCurrentPWValue] = useState('');
    const [newPW1Value, setNewPW1Value] = useState('');
    const [newPW2Value, setNewPW2Value] = useState('');

    const [errorMsg, setErrorMsg] = useState("");

    const changePassword = async () => {
        const currentPwd = currentPWValue.toString().trim();
        const newPwd1 = newPW1Value.toString().trim();
        const newPwd2 = newPW2Value.toString().trim();

        if (currentPwd.length === 0) {
            setErrorMsg(AccountResource.ID.textCurrentPwdPlaceholder);
            return;
        } else if (newPwd1.length === 0) {
            setErrorMsg(AccountResource.ID.textNewPwdPlaceholder);
            return;
        } else if (newPwd2.length === 0) {
            setErrorMsg(AccountResource.ID.textNewPwdConfirmPlaceholder);
            return;
        } else if (newPwd1.length > 0 && newPwd2.length > 0 && newPwd1 !== newPwd2) {
            setErrorMsg(AccountResource.ID.errorPwdMismatch);
            return;
        } else if (currentPwd === newPwd1) {
            setErrorMsg(AccountResource.ID.errorPwdSameAsCurrent);
            return;
        }

        // 유효성 검사
        const [success, message] = await AccountController.checkValidPassword(newPwd1);

        if (!success) {
            setErrorMsg(message);
            return;
        }

        setPassword(currentPwd, newPwd1);
    }

    const setPassword = async (currentPwd, newPwd) => {
        const userInfo = ProjectResource.getUserInfo();

        if (userInfo) {
            const [success, message] = await AccountController.setPassword(userInfo.user_sn, userInfo.user_id, currentPwd, newPwd);

            if (success) {
                resetFormAfterSuccess();
            }
            else {
                setErrorMsg(message);
            }
        }
    }

    const resetFormAfterSuccess = () => {
        setErrorMsg(AccountResource.ID.successPwdChanged);

        // 3초 후 자동 로그아웃 + 모달 종료 + 로그인 페이지로 이동
        setTimeout(() => {
            logoutAndRedirect();
        }, 3000);
    };

    const logoutAndRedirect = () => {
        AccountStore.dispatch({
            type: 'LOGIN_STATE',
            loginState: AccountResource.loginState.logout,
            message: '로그아웃 되었습니다.'
        });

        props.handlePopup('changePwd', false);
        props.history.push(ProjectResource.path.root);
    };


    const isCurrentError =
        errorMsg === AccountResource.ID.textCurrentPwdPlaceholder || 
        errorMsg === AccountResource.ID.errorPwdCurrentMismatch;

    const isNew1Error =
        errorMsg === AccountResource.ID.textNewPwdPlaceholder ||
        errorMsg === AccountResource.ID.errorPwdMismatch;

    const isNew2Error =
        errorMsg === AccountResource.ID.textNewPwdConfirmPlaceholder ||
        errorMsg === AccountResource.ID.errorPwdMismatch;

    return (
        <ModalBackground className='UI_Section'>
            <ChangePwdComponent>
                <div>
                    <div className='headerWrap'>
                        <TextButton
                            variant="unfill"
                            size="xs"
                            leftIcon={<Icon.Arrow direction={"left"} />}
                            onClick={() => props.handlePopup('myPage', true)}
                        >
                            취소하고 돌아가기
                        </TextButton>
                        <IconButton
                            variant="unfill"
                            size="md"
                            icon={<Icon.Closer />}
                            onClick={() => props.handlePopup('changePwd', false)}
                        >
                            닫기
                        </IconButton>
                    </div>
                    <header>
                        <h2>
                            <Icon.Lock size="xxs" isActive={false} />
                            비밀번호 변경
                        </h2>
                        <p><span>새 비밀번호</span>를 설정하세요</p>
                    </header>
                    <section>
                        <div className='infoWrap'>
                            <p>※ 비밀번호 변경 시 유의사항</p>
                            <pre>{`· 비밀번호는 5~10자 이내로 입력 
· 영문 대소문자, 숫자, 특수기호 _,-만 사용 가능`}</pre>
                        </div>
                        <ul>
                            <li>
                                <InputBox
                                    type="password"
                                    value={currentPWValue}
                                    onChange={setCurrentPWValue}
                                    placeholder={"현재 비밀번호 입력"}
                                    onClear={() => setCurrentPWValue("")}
                                    fullWidth={true}
                                    error={isCurrentError}
                                />
                            </li>
                            <li>
                                <InputBox
                                    type="password"
                                    value={newPW1Value}
                                    onChange={setNewPW1Value}
                                    placeholder={"새 비밀번호 입력"}
                                    onClear={() => setNewPW1Value("")}
                                    fullWidth={true}
                                    error={isNew1Error}
                                />
                            </li>
                            <li>
                                <InputBox
                                    type="password"
                                    value={newPW2Value}
                                    onChange={setNewPW2Value}
                                    placeholder={"새 비밀번호 확인"}
                                    onClear={() => setNewPW2Value("")}
                                    fullWidth={true}
                                    error={isNew2Error}
                                />
                            </li>
                        </ul>

                        <div className='errorMsg'>
                            <p className={errorMsg === AccountResource.ID.successPwdChanged ? 'success' : null}>{errorMsg}</p>
                        </div>

                        <BoxButton
                            variant="fill"
                            size="xl"
                            fullWidth={true}
                            onClick={() => changePassword()}
                        >
                            변경
                        </BoxButton>
                    </section>
                </div>
            </ChangePwdComponent>
        </ModalBackground>
    );
}

export default withRouter(ChangePwd);