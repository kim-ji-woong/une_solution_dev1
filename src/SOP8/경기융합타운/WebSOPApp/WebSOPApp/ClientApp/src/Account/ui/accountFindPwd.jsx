import React, { useRef, useState } from 'react';
import { withRouter } from 'react-router-dom';

import Slider from "react-slick";
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';

import ProjectResource from '../../Root/resource/id';
import AccountResource from '../resource/id';

import { AccountFindPwdWrap } from '../styled/loginPageStyled';
import ConfirmDialog from '../../Common/ui/confirmDialog';
import { AccountController } from '../services/accountController';

function AccountFindPwd(props) {
    const [mode, setMode] = useState(AccountResource.findMode.email);
    const [errorMessage, setErrorMessage] = useState('');
    const [confirmMessage, setConfirmMessage] = useState({
        visible: false,
        type: null,
        messages: [""],
        buttons: ["확인"],
        onClickButton: null
    });

    const refID = useRef();
    const refEmail = useRef();
    const refPhone = useRef();
    const refEmailMode = useRef();
    const refSMSMode = useRef();

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

    const onClickCancle = () => {
        // 메인 페이지 이동
        props.history.push('/');
    }

    const displayInputUI = () => {
		let displayInputUI = [];

		displayInputUI.push(
			<div key='input_name'>
                <label htmlFor='inputName'>이름</label>
                <input type='text' ref={refID} className='check' id='inputName' placeholder={'이름을 입력하세요'} />
			</div>);

		if (mode === AccountResource.findMode.email) {
			displayInputUI.push(
				<div key='input_mail'>
                    <label htmlFor='inputEmail'>메일</label>
                    <input type='text' ref={refEmail} className='check' id='inputEmail' placeholder={'Email를 입력하세요'} />
				</div>);
		} else {
			displayInputUI.push(
				<div key='input_sms'>
                    <label htmlFor='inputSMS'>SMS</label>
                    <input type='text' ref={refPhone} className='check' id='inputSMS' onChange={(e) => onChangeCheck(e.target)} placeholder={'핸드폰 번호를 입력하세요'} />
				</div>);
		}

		return displayInputUI;
    }

    const onChangeCheck = (e) => {
        let target = e;
        if (!target)
            return;

        let value = target.value;
        let inputValue = value.replace(/[^0-9]/g, '');           

        if (inputValue.length >= 11) {
            inputValue = inputValue.replace(/(\d{3})(\d{4})(\d{4})/, '$1-$2-$3');
        }
        else if (inputValue.length >= 10) {
            inputValue = inputValue.replace(/(\d{3})(\d{3})(\d{4})/, '$1-$2-$3');
        }
        else if (inputValue.length >= 8) {
            inputValue = inputValue.replace(/(\d{3})(\d{4})(\d{1})/, '$1-$2-$3');
        }
        else if (inputValue.length >= 4) {
            inputValue = inputValue.replace(/(\d{3})(\d{1})/, '$1-$2');
        }

        target.value = inputValue;      
    }

    const onChangeMode = (mode) => {
        setMode(mode);
    }

	const onClick = async () => {
        let value = null;
        const name = refID.current.value.toString().trim();
        
        if (name.length === 0) {
            setErrorMessage('이름을 입력하세요');
            return;
        }

        if (mode === AccountResource.findMode.email) {            
            value = refEmail.current.value.toString().trim();

            if (value.length === 0) {
                setErrorMessage('Email를 입력하세요');
                return;
            }

            // eslint-disable-next-line
            const patternEmail = /^([0-9a-zA-Z_\.-]+)@([0-9a-zA-Z_-]+)(\.[0-9a-zA-Z_-]+){1,2}$/;
            const emailValid = patternEmail.test(value);

            if (!emailValid) {
                setErrorMessage('이메일 주소 형식이 아닙니다');
                return;
            }

        } else if (mode === AccountResource.findMode.sms) {
            value = refPhone.current.value.toString().trim();

            if (value.length === 0) {
                setErrorMessage('핸드폰 번호를 입력하세요');
                return;
            }

            const patternPhone = /01[016789]-[^0][0-9]{2,3}-[0-9]{3,4}/;
            const phoneValid = patternPhone.test(value);

            if (!phoneValid) {
                setErrorMessage('핸드폰 번호 형식이 아닙니다');
                return;
            }
        }
        
        const [result, message] = await AccountController.changePassword(name, value, mode);

        if (result === null) {
            setErrorMessage(message);
        } else if (result.success === true) {
            setErrorMessage('');
            showConfirmDialog(ProjectResource.dialogTypes.SUCCESS, [message], ['확인'], onClickCancle);
        }
        else {
            setErrorMessage(message);
        }
    }

    const settings = {
        dots: true,
        fade: true,
        infinite: true,
        slidesToShow: 1,
        slidesToScroll: 1,
        autoplay: true,
        speed: 500,
        pauseOnHover: false
    };

    return (
        <AccountFindPwdWrap>
            <Slider {...settings}>
                <div className='company-img1' />
                <div className='company-img2' />
                <div className='company-img3' />
            </Slider>
            <div className='gradient-bg' />

            <section className='content-wrap'>
                <h2 className='blind'>비밀번호 찾기</h2>
                <p>비밀번호 찾기</p>
                <p className='description'>비밀번호 찾을 계정 정보를 입력해주세요</p>

                <ul>
                    <li>
                        <input type="radio" ref={refEmailMode} name='findPwd' onChange={() => onChangeMode(AccountResource.findMode.email)} defaultChecked />
                        <span>Email로 찾기</span>
                    </li>
                    <li>
                        <input type="radio" ref={refSMSMode} name='findPwd' onChange={() => onChangeMode(AccountResource.findMode.sms)} />
                        <span>SMS로 찾기</span>
                    </li>
                </ul>

                <form autoComplete='off'>

                    {displayInputUI()}
                    {
                        errorMessage?.length > 0 &&
                        <div className='error-msg' style={{ display: "on" }}>
                            <p>{errorMessage}</p>
                        </div>
                    }
                    <div className='button-wrap'>
                        <button type='button' onClick={onClick}>확인</button>
                        <button type='button' onClick={onClickCancle}>취소</button>
                    </div>
                </form>
            </section>

            <footer>
                <p>Copyright 2024. UNE inc. all rights reserved.</p>
            </footer>

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
        </AccountFindPwdWrap>
    );
}

export default withRouter(AccountFindPwd);