import React, { useEffect, useRef, useState } from 'react';
import AccountResource from '../resource/id';
import Button from '../../Common/components/button';
import Icon from "../../Common/components/Icon/Icon";
import cancelIcon from '../images/cancelIcon.svg';
import { FindPwdSectionComponent } from '../styled/loginPageStyled';
import { ModalBackground } from '../../Root/styled/theme';

function FindPwdSection(props) {
    const [mode, setMode] = useState(AccountResource.findMode.email);
    const [nameValue, setNameValue] = useState('');
    const [phoneValue, setPhoneValue] = useState('');
    const [emailValue, setEmailValue] = useState('');

    const refName = useRef();
    const refPhone = useRef();
    const refEmail = useRef();

    useEffect(() => {
        refName.current.focus();
    }, []);

    useEffect(() => {
        if (props.errorMsg === AccountResource.ID.textPlaceName) {
            refName.current.classList.add('error');
        } else {
            refName.current.classList.remove('error');
        }

        if (props.errorMsg === AccountResource.ID.textPlacePhone) {
            refPhone.current?.classList.add('error');
        } else {
            refPhone.current?.classList.remove('error');
        }

        if (props.errorMsg === AccountResource.ID.textPlaceEmail) {
            refEmail.current?.classList.add('error');
        } else {
            refEmail.current?.classList.remove('error');
        }
    }, [props.errorMsg]);

    const onChangeMode = (mode) => {
        const name = refName.current;
        const phone = refPhone.current;
        const email = refEmail.current;

        if (mode === AccountResource.findMode.email) {
            phone.value = '';
            setPhoneValue('');
        }
        else if (mode === AccountResource.findMode.sms) {
            email.value = '';
            setEmailValue('');
        }

        name.value = '';
        setNameValue('');
        setMode(mode);
        props.setErrorMsg('');
    }

    const handleNameChange = (event) => {
        setNameValue(event.target.value);
	}

    const handlePhoneChange = (event) => {
        setPhoneValue(event.target.value);
	}

    const handleEmailChange = (event) => {
        setEmailValue(event.target.value);
	}

    const onClickFindPwd = () => {
        const name = refName.current.value.toString().trim();
        let phone = null;
        let email = null;

        if (mode === AccountResource.findMode.sms) {
            phone = refPhone.current.value.toString().trim();
        }
        else if (mode === AccountResource.findMode.email) {
            email = refEmail.current.value.toString().trim();
        }
        
        props.onClickFindPwd(mode, name, mode === AccountResource.findMode.sms ? phone : email);
    }

    const clearInputText = (type) => {
		if (type === 'name') {
			const name = refName.current;
			if (name) {
				name.value = '';
				name.focus();
                setNameValue('');
			}
		}
		else if (type === 'sms') {
			const phone = refPhone.current;
			if (phone) {
				phone.value = '';
				phone.focus();
                setPhoneValue('');
			}
		}
		else if (type === 'email') {
			const email = refEmail.current;
			if (email) {
				email.value = '';
				email.focus();
                setEmailValue('');
			}
		}
	}

    const onChangeSection = () => {
        if (props.type === 'loginPage') {
            props.onChangeSection(0);
        }
        else if (props.type === 'gnb') {
            props.onChangeSection('findPwd', false);
        }
    }

    let errorMsgUI = null;

    if (props.errorMsg) {
		errorMsgUI = (
			<p>{props.errorMsg}</p>
		);
	}

    const content = (
        <FindPwdSectionComponent>
            <div className='headerWrap'>
                <Button className="cancleBtn" variant="unfill" size="md" leftIcon={<Icon.Arrow size={"xxxs"} direction={"left"} fill={"grayscale.g600"} />} onClick={() => onChangeSection()}>
                    취소하고 돌아가기
                </Button>
            </div>
            <div className='sectionWrap'>
                <div className='titleWrap'>
                    <h2>비밀번호 찾기</h2>
                    <p>찾고자 하는 계정 정보를 입력하시기 바랍니다.</p>
                </div>
                <ul>
                    <li>
                        <input type="radio" name="mode" id="EmailMode" onChange={() => onChangeMode(AccountResource.findMode.email)} defaultChecked />
                        <label htmlFor="EmailMode">이메일로 찾기</label>
                    </li>
                    <li>
                        <input type="radio" name="mode" id="SMSMode" onChange={() => onChangeMode(AccountResource.findMode.sms)} />
                        <label htmlFor="SMSMode">핸드폰 번호로 찾기</label>
                    </li>
                </ul>
                <form autoComplete='off'>
                    <div className='inputWrap'>
                        <div>
                            <label htmlFor="inputName">
                                {AccountResource.ID.textTitleName}
                            </label>
                        </div>
                        <input ref={refName} type='text' id='inputName' placeholder={AccountResource.ID.textPlaceName} onChange={(e) => handleNameChange(e)} />
                        <button
                            type='button'
                            className={'clearBtn'} 
                            style={{ display: nameValue.length > 0 ? 'flex' : 'none' }}
                            onClick={() => clearInputText('name')}
                        >
                            <img src={cancelIcon} alt='입력 내용 초기화 버튼'/>
                        </button>
                    </div>
                    <div className='inputWrap findPwd'>
                        
                        {
                            mode === AccountResource.findMode.sms ?
                            <>
                                <div>
                                    <label htmlFor="inputPhone">
                                        {AccountResource.ID.textTitlePhone}
                                    </label>
                                </div>
                                <input ref={refPhone} type='text' id='inputPhone' placeholder={AccountResource.ID.textPlacePhone} onChange={(e) => handlePhoneChange(e)} />
                                <button
                                    type='button'
                                    className={'clearBtn'} 
                                    style={{ display: phoneValue.length > 0 ? 'flex' : 'none' }}
                                    onClick={() => clearInputText('sms')}
                                >
                                    <img src={cancelIcon} alt='입력 내용 초기화 버튼'/>
                                </button>
                            </>
                            : <>
                                <div>
                                    <label htmlFor="inputEmail">
                                        {AccountResource.ID.textTitleEmail}
                                    </label>
                                </div>
                                <input ref={refEmail} type='text' id='inputEmail' placeholder={AccountResource.ID.textPlaceEmail} onChange={(e) => handleEmailChange(e)} />
                                <button
                                    type='button'
                                    className={'clearBtn'} 
                                    style={{ display: emailValue.length > 0 ? 'flex' : 'none' }}
                                    onClick={() => clearInputText('email')}
                                >
                                    <img src={cancelIcon} alt='입력 내용 초기화 버튼'/>
                                </button>
                            </>
                        }
                    </div>

                    {/* 로그인 유효성 검사시 사용 */}
                    <div className='errorMsg'>
                        {errorMsgUI}
                    </div>
                    <Button className="submitBtn" variant="fill" size="xxxl" onClick={() => onClickFindPwd()}>
                        찾기
                    </Button>
                </form>
            </div>
        </FindPwdSectionComponent>
    );

    return props.type === 'gnb' ? <ModalBackground>{content}</ModalBackground> : content;
}

export default FindPwdSection;