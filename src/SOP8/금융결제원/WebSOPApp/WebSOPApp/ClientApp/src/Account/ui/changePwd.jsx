import React, { useRef, useState, useEffect } from 'react';
import { withRouter } from 'react-router-dom';
import { ChangePwdComponent  } from '../styled/myPageStyled';
import { ModalBackground } from '../../Root/styled/theme';
import close_btn_gray from '../../Common/images/close_btn_gray.svg';

import pwd_hide from '../images/pwd_hide.svg';
import pwd_show from '../images/pwd_show.svg';
import cancelIcon from '../images/cancelIcon.svg';
import { AccountController } from '../services/accountController';
import ProjectResource from '../../Root/resource/id';
import AccountResource from '../resource/id';
import Button from '../../Common/components/button';
import AccountStore from '../accountStore';

function ChangePwd(props) {
    const [isShowCurrentPwd, setIsShowCurrentPwd] = useState(false);
    const [isShowNewPwd1, setIsShowNewPwd1] = useState(false);
    const [isShowNewPwd2, setIsShowNewPwd2] = useState(false);

    const [currentPwValue, setCurrentPwValue] = useState('');
    const [newPw1Value, setNewPw1Value] = useState('');
    const [newPw2Value, setNewPw2Value] = useState('');

    const [errorMsg, setErrorMsg] = useState('');

    const refCurrentPW = useRef();
    const refNewPW1 = useRef();
    const refNewPW2 = useRef();

    useEffect(() => {
        refCurrentPW.current.classList.remove('error');
        refNewPW1.current.classList.remove('error');
        refNewPW2.current.classList.remove('error');

        switch (errorMsg) {
            case AccountResource.ID.textCurrentPwdError:
                refCurrentPW.current.classList.add('error');
                break;
            case AccountResource.ID.textNewPwd1Error:
                refNewPW1.current.classList.add('error');
                break;
            case AccountResource.ID.textNewPwd2Error:
                refNewPW2.current.classList.add('error');
                break;
            case AccountResource.ID.textPasswordMismatchError:
                refNewPW1.current.classList.add('error');
                refNewPW2.current.classList.add('error');
                break;
            case AccountResource.ID.textSamePasswordErrorMessage:
                refCurrentPW.current.classList.add('error');
                refNewPW1.current.classList.add('error');
                refNewPW2.current.classList.add('error');
                break;
            case AccountResource.ID.textPasswordRule:
                refNewPW1.current.classList.add('error');
                break;
            case AccountResource.ID.textCurrentPwdError:
                refCurrentPW.current.classList.add('error');
                break;
            default:
                break;
        }
    }, [errorMsg]);

    const handleShowPwChecked = (refType, stateType) => {
        const password = refType.current;
        if (password === null)
            return;

        if (stateType === 'isShowCurrentPwd') {
            if(!isShowCurrentPwd) {
                password.type = 'text';
            } else {
                password.type = 'password';
            }
            setIsShowCurrentPwd(!isShowCurrentPwd);
        }
        else if (stateType === 'isShowNewPwd1') {
            if(!isShowNewPwd1) {
                password.type = 'text';
            } else {
                password.type = 'password';
            }
            setIsShowNewPwd1(!isShowNewPwd1);
        }
        else if (stateType === 'isShowNewPwd2') {
            if(!isShowNewPwd2) {
                password.type = 'text';
            } else {
                password.type = 'password';
            }
            setIsShowNewPwd2(!isShowNewPwd2)
        }
    }

    const changePassword = async () => {
        let errorMsg = "";
        
        const currentPwd = refCurrentPW.current.value.toString().trim();
        const newPwd1 = refNewPW1.current.value.toString().trim();
        const newPwd2 = refNewPW2.current.value.toString().trim();

        if (currentPwd.length === 0) {
            errorMsg = AccountResource.ID.textCurrentPwdError;
        } else if (newPwd1.length === 0) {
            errorMsg = AccountResource.ID.textNewPwd1Error;
        } else if (newPwd2.length === 0) {
            errorMsg = AccountResource.ID.textNewPwd2Error;
        } else if (newPwd1.length > 0 && newPwd2.length > 0 && newPwd1 !== newPwd2) {
            errorMsg = AccountResource.ID.textPasswordMismatchError;
        } else if (currentPwd === newPwd1) {
            errorMsg = AccountResource.ID.textSamePasswordErrorMessage;
        } 

        if (errorMsg.length > 0) {
            setErrorMsg(errorMsg);
            return;
        }

        const [success, message] = await AccountController.checkValidPassword(newPwd1);
        if (!success) {
            setErrorMsg(message);
            return;
        }

        setPassword(currentPwd, newPwd1);
    };

    const setPassword = async (currentPwd, newPwd) => {
        const userInfo = ProjectResource.getUserInfo();

        if (userInfo) {
            const [success, message] = await AccountController.setPassword(
                userInfo.user_sn, userInfo.user_id, currentPwd, newPwd
            );

            if (success) {
                resetFormAfterSuccess();
            } else {
                setErrorMsg(message);
            }
        }
    };

    const clearInputText = (type) => {
		if (type === 'current') {
			const currentPW = refCurrentPW.current;
			if (currentPW) {
				currentPW.value = '';
				currentPW.focus();
                setCurrentPwValue('');
			}
		}
		else if (type === 'new1') {
			const newPW1 = refNewPW1.current;
			if (newPW1) {
				newPW1.value = '';
				newPW1.focus();
                setNewPw1Value('');
                setIsShowNewPwd1(false);
			}
		}
		else if (type === 'new2') {
			const newPW2 = refNewPW2.current;
			if (newPW2) {
				newPW2.value = '';
				newPW2.focus();
                setNewPw2Value('');
                setIsShowNewPwd2(false);
			}
		}
	}

    const handleCurrentPWChange = (event) => {
        setCurrentPwValue(event.target.value);
	}

    const handleNewPW1Change = (event) => {
        setNewPw1Value(event.target.value);
	}

    const handleNewPW2Change = (event) => {
        setNewPw2Value(event.target.value);
	}

    const resetFormAfterSuccess = () => {
        refCurrentPW.current?.classList.remove('error');
        refNewPW1.current?.classList.remove('error');
        refNewPW2.current?.classList.remove('error');

        if (refCurrentPW.current) {
            refCurrentPW.current.value = '';
            refCurrentPW.current.type = 'password';
        }
        if (refNewPW1.current) {
            refNewPW1.current.value = '';
            refNewPW1.current.type = 'password';
        }
        if (refNewPW2.current) {
            refNewPW2.current.value = '';
            refNewPW2.current.type = 'password';
        }

        setIsShowCurrentPwd(false);
        setIsShowNewPwd1(false);
        setIsShowNewPwd2(false);

        setCurrentPwValue('');
        setNewPw1Value('');
        setNewPw2Value('');

        setErrorMsg(AccountResource.ID.textSuccessChangePwd);

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

    const isSuccessMsg = errorMsg === AccountResource.ID.textSuccessChangePwd;

    return (
        <ModalBackground>
        <ChangePwdComponent>
            <header>
                <button
                    onClick={() => {
                        if (isSuccessMsg) {
                            // 비밀번호 변경 성공 상태면 즉시 로그아웃
                            logoutAndRedirect();
                        } else {
                            // 일반 상태면 그냥 모달 닫기
                            props.handlePopup('changePwd', false);
                        }
                    }}
                    className={'closeBtn'}
                >
                    <img src={close_btn_gray} alt='닫기 버튼' width={16} height={16} />
                </button>
            </header>
            <section>
                <div className='titleWrap'>
                    <h2>비밀번호 변경</h2>
                </div>
                <div className='inputWrap'>
                    <input ref={refCurrentPW} type='password' placeholder="현재 비밀번호" onChange={(e) => handleCurrentPWChange(e)} />
                    <button 
                        type='button'
                        className='showPwdBtn' 
                        style={{ display: currentPwValue.length > 0 ? 'flex' : 'none' }}
                        onClick={() => handleShowPwChecked(refCurrentPW, 'isShowCurrentPwd')}
                    >
                        <img src={isShowCurrentPwd ? pwd_show : pwd_hide} alt='비밀번호 보기 버튼' />
                    </button>
                    <button
                        type='button'
                        className={'clearBtn'} 
                        style={{ display: currentPwValue.length > 0 ? 'flex' : 'none' }}
                        onClick={() => clearInputText('current')}
                    >
                        <img src={cancelIcon} alt='입력 내용 초기화 버튼'/>
                    </button>
                </div>
                <div className='inputWrap'>
                    <input ref={refNewPW1} type='password' placeholder="새 비밀번호" onChange={(e) => handleNewPW1Change(e)} />
                    <button 
                        type='button'
                        className='showPwdBtn' 
                        style={{ display: newPw1Value.length > 0 ? 'flex' : 'none' }}
                        onClick={() => handleShowPwChecked(refNewPW1, 'isShowNewPwd1')}
                    >
                        <img src={isShowNewPwd1 ? pwd_show : pwd_hide} alt='비밀번호 보기 버튼' />
                    </button>
                    <button
                        type='button'
                        className={'clearBtn'} 
                        style={{ display: newPw1Value.length > 0 ? 'flex' : 'none' }}
                        onClick={() => clearInputText('new1')}
                    >
                        <img src={cancelIcon} alt='입력 내용 초기화 버튼'/>
                    </button>
                </div>
                <div className='inputWrap'>
                    <input ref={refNewPW2} type='password' placeholder="새 비밀번호 확인" onChange={(e) => handleNewPW2Change(e)} />
                    <button 
                        type='button'
                        className='showPwdBtn' 
                        style={{ display: newPw2Value.length > 0 ? 'flex' : 'none' }}
                        onClick={() => handleShowPwChecked(refNewPW2, 'isShowNewPwd2')}
                    >
                        <img src={isShowNewPwd2 ? pwd_show : pwd_hide} alt='비밀번호 보기 버튼' />
                    </button>
                    <button
                        type='button'
                        className={'clearBtn'} 
                        style={{ display: newPw2Value.length > 0 ? 'flex' : 'none' }}
                        onClick={() => clearInputText('new2')}
                    >
                        <img src={cancelIcon} alt='입력 내용 초기화 버튼'/>
                    </button>
                </div>

                <div className='errorMsg'>
                    <p className={isSuccessMsg ? 'success' : 'error'}>
                        {errorMsg}
                    </p>
                </div>
                <Button className="submitBtn" variant="fill" size="xxxl" onClick={() => changePassword()}>
                    변경
                </Button>
                <Button className="findPwdBtn" variant="unfill" size="xxs" onClick={() => props.handlePopup('findPwd', true)}>
                    비밀번호 찾기
                </Button>
            </section>
        </ChangePwdComponent>
        </ModalBackground>
    );
}

export default withRouter(ChangePwd);