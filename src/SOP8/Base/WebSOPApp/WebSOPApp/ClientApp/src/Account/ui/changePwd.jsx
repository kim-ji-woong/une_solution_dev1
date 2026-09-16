import React, { useRef, useState } from 'react';
import { ChangePwdComponent  } from '../styled/myPageStyled';
import { ModalBackground } from '../../Root/styled/theme';
import close_btn from '../../Common/images/close_btn.png';

import pwd_hide from '../images/pwd_hide.png';
import pwd_show from '../images/pwd_show.png';
import { AccountController } from '../services/accountController';
import ProjectResource from '../../Root/resource/id';
import ConfirmDialog from '../../Common/ui/confirmDialog';

function ChangePwd(props) {
    const [isShowCurrentPwd, setIsShowCurrentPwd] = useState(false);
    const [isShowNewPwd1, setIsShowNewPwd1] = useState(false);
    const [isShowNewPwd2, setIsShowNewPwd2] = useState(false);
    const [confirmMessage, setConfirmMessage] = useState({
        visible: false,
        type: null,
        messages: [""],
        buttons: ["확인"],
        onClickButton: null
    });

    const refCurrentPW = useRef();
    const refNewPW1 = useRef();
    const refNewPW2 = useRef();

    const showConfirmDialog = (type, messages, buttons, onClickButton) => {
        const confirmInfo = {};
        confirmInfo.visible = true;
		confirmInfo.type = type;
        confirmInfo.messages = messages;
		confirmInfo.buttons = buttons;
		confirmInfo.onClickButton = onClickButton;

        if (!messages) {
            confirmInfo.messages = [""];
        }
        else if (Array.isArray(messages)) {
            confirmInfo.messages = messages;
        }
        else {
            confirmInfo.messages = [messages];
        }

        setConfirmMessage(confirmInfo);
    }

    const onCloseConfirmDialog = () => {
		const confirmInfo = {};
		confirmInfo.visible = false;

        setConfirmMessage(confirmInfo);
	}

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
            errorMsg = '비밀번호를 입력하세요.';
        } else if (newPwd1.length === 0) {
            errorMsg = '새로운 비밀번호를 입력하세요.';
        } else if (newPwd2.length === 0) {
            errorMsg = '새로운 비밀번호를 한번 더 입력하세요.';
        } else if (newPwd1.length > 0 && newPwd2.length > 0 && newPwd1 !== newPwd2) {
            errorMsg = '새로운 비밀번호가 서로 일치하지 않습니다.';
        } else if (currentPwd === newPwd1) {
            errorMsg = '같은 비밀번호로 변경하실 수 없습니다.';
        }

        if (errorMsg.length > 0) {
            showConfirmDialog(ProjectResource.dialogTypes.WARNING, [errorMsg], null, null);
            return;
        }

        // 유효성 검사
        const [success, message] = await AccountController.checkValidPassword(newPwd1);

        if (!success) {
            showConfirmDialog(ProjectResource.dialogTypes.WARNING, [message], null, null);
            return;
        }

        setPassword(currentPwd, newPwd1);
    }

    const setPassword = async (currentPwd, newPwd) => {
        const userInfo = ProjectResource.getUserInfo();

        if (userInfo) {
            const [success, message] = await AccountController.setPassword(userInfo.user_sn, userInfo.user_id, currentPwd, newPwd);

            if (success) {
                showConfirmDialog(ProjectResource.dialogTypes.SUCCESS, ['비밀번호가 변경되었습니다.'], ['확인'], handlePopup);
            }
            else {
                showConfirmDialog(ProjectResource.dialogTypes.ERROR, [message], null, null);
            }
        }
    }

    const handlePopup = () => {
        onCloseConfirmDialog();
        props.handlePopup('changePwd', false);
    }

    return (
        <ModalBackground>
        <ChangePwdComponent>
            <header>
                <div>
                    <h2>비밀번호 변경</h2>
                    <div>
                        <span>새 비밀번호</span>
                        <span>를 설정하세요</span>
                    </div>
                </div>
                <button onClick={() => props.handlePopup('changePwd', false)} className={'closeBtn'}>
                    <img src={close_btn} alt='닫기 버튼' width={16} height={16} />
                </button>
            </header>
            <section>
                <div className='infoWrap'>
                    <p>비밀번호 변경 시 유의사항</p>
                    <p>비밀번호는 5~10자 이내로 입력</p>
                    <p>영문 대소문자, 숫자, 특수기호 _,-만 사용 가능</p>
                </div>
                <ul>
                    <li>
                        <span>현재 비밀번호</span>
                        <span>
                            <input ref={refCurrentPW} type='password' placeholder='현재 비밀번호 입력' />
                            <button 
                                type='button'
                                className='showPwdBtn' 
                                onClick={() => handleShowPwChecked(refCurrentPW, 'isShowCurrentPwd')}
                            >
                                <img src={isShowCurrentPwd ? pwd_show : pwd_hide} alt='비밀번호 보기 버튼' />
                            </button>
                        </span>
                    </li>
                    <li>
                        <span>새 비밀번호</span>
                        <span>
                            <input ref={refNewPW1} type='password' placeholder='새 비밀번호 입력' />
                            <button 
                                type='button'
                                className='showPwdBtn' 
                                onClick={() => handleShowPwChecked(refNewPW1, 'isShowNewPwd1')}
                            >
                                <img src={isShowNewPwd1 ? pwd_show : pwd_hide} alt='비밀번호 보기 버튼' />
                            </button>
                        </span>
                    </li>
                    <li>
                        <span>새 비밀번호 확인</span>
                        <span>
                            <input ref={refNewPW2} type='password' placeholder='새 비밀번호 확인' />
                            <button 
                                type='button'
                                className='showPwdBtn' 
                                onClick={() => handleShowPwChecked(refNewPW2, 'isShowNewPwd2')}
                            >
                                <img src={isShowNewPwd2 ? pwd_show : pwd_hide} alt='비밀번호 보기 버튼' />
                            </button>
                        </span>
                    </li>
                </ul>
                <div className='btnWrap'>
                    <button className='cancle' onClick={() => props.handlePopup('myPage', true)}>마이페이지로 돌아가기</button>
                    <button className='submit' onClick={() => changePassword()}>변경</button>
                </div>
            </section>
        </ChangePwdComponent>
        {
            /* alert창 대신 사용 */
            confirmMessage.visible &&
            <ConfirmDialog 
                type={confirmMessage.type}
                messages={confirmMessage.messages} 
                buttons={confirmMessage.buttons} 
                onClickButton={confirmMessage.onClickButton}
                onCloseConfirmDialog={onCloseConfirmDialog}
            />
        } 
        </ModalBackground>
    );
}

export default ChangePwd;