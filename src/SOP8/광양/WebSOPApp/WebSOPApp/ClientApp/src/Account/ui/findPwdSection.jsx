import React, { useState } from 'react';
import AccountResource from '../resource/id';
import { FindPwdSectionComponent } from '../styled/loginPageStyled';
import InputBox from '../../Common/components/inputBox';
import Icon from '../../Common/components/Icon/Icon';
import BoxButton from '../../Common/components/boxButton';
import TextButton from '../../Common/components/textButton';

function FindPwdSection(props) {
    const [nameValue, setNameValue] = useState('');
    const [phoneValue, setPhoneValue] = useState('');
    
    const onClickFindPwd = () => {
        const name = nameValue.toString().trim();
		const phone = phoneValue.toString().trim();

        props.onClickFindPwd(name, phone)
    }

    const isNameError =
        props.errorMsg === AccountResource.ID.textPlaceName ||
        props.errorMsg === AccountResource.ID.textFindPwdError;

    const isPhoneError =
        props.errorMsg === AccountResource.ID.textPlacePhone ||
        props.errorMsg === AccountResource.ID.textFindPwdError;

    let errorMsgUI = null;
    if (props.errorMsg) {
        errorMsgUI = <p className={props.errorMsg === AccountResource.ID.textFindPwdSuccessPhone ? 'success' : null}>{props.errorMsg}</p>;
    }

    return (
        <FindPwdSectionComponent>
            <div>
                <div className='headerWrap'>
                    <p>비밀번호 찾기</p>
                    <span>찾고자 하는 계정 정보를 입력하세요.</span>
                </div>
                <div className='sectionWrap'>
                    <div className='inputWrap'>
                        <p>이름</p>
                        <div>
                            <InputBox
                                value={nameValue}
                                onChange={setNameValue}
                                placeholder={"입력하세요"}
                                onClear={() => setNameValue("")}
                                fullWidth={true}
                                leftIcon={<Icon.User size={"sm"} />}
                                error={isNameError}
                            />
                        </div>
                    </div>
                    <div className='inputWrap'>
                        <p>핸드폰번호</p>
                        <div>
                            <InputBox
                                value={phoneValue}
                                onChange={setPhoneValue}
                                placeholder={"입력하세요"}
                                onClear={() => setPhoneValue("")}
                                fullWidth={true}
                                leftIcon={<Icon.IconPhone size={"sm"} />}
                                error={isPhoneError}
                            />
                        </div>
                    </div>

                    <div className='contentWrap'>
                        {/* 유효성 검사시 사용 */}
                        <div className='errorMsg'>
                            {errorMsgUI}
                        </div>
                    </div>

                    <BoxButton
                        className='submitBtn'
                        variant="fill"
                        size="xl"
                        fullWidth={true}
                        onClick={onClickFindPwd}
                    >
                        찾기
                    </BoxButton>
                    <TextButton
                        variant="unfill"
                        size="xl"
                        fullWidth={true}
                        onClick={() => props.onChangeSection(0)}
                    >
                        로그인 페이지로 돌아가기
                    </TextButton>
                </div>
            </div>
        </FindPwdSectionComponent>
    );
}

export default FindPwdSection;