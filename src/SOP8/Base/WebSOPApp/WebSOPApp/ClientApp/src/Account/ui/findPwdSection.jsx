import React, { useEffect, useRef } from 'react';
import AccountResource from '../resource/id';

function FindPwdSection(props) {
    const refPwdName = useRef();
    const refPhone = useRef();

    useEffect(() => {
        refPwdName.current.focus();
    }, []);

    useEffect(() => {
        if (props.errorMsg === AccountResource.ID.textPlaceName) {
            refPwdName.current.classList.add('error');
        } else {
            refPwdName.current.classList.remove('error');
        }

        if (props.errorMsg === AccountResource.ID.textPlacePhone) {
            refPhone.current.classList.add('error');
        } else {
            refPhone.current.classList.remove('error');
        }
    }, [props.errorMsg])

    const onClickFindPwd = () => {
        const name = refPwdName.current.value.toString().trim();
		const phone = refPhone.current.value.toString().trim();

        props.onClickFindPwd(name, phone)
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
                <h2>임시 비밀번호 발급</h2>
                <p>이름과 휴대전화번호를 입력하시면 임시 비밀번호가 발급됩니다.</p>
            </div>
            <form autoComplete='off'>
                <div className='inputWrap'>
                    <div>
                        <label htmlFor="inputName">
                            {AccountResource.ID.textTitleName}<span>*</span>
                        </label>
                    </div>
                    <input ref={refPwdName} type='text' id='inputName' placeholder={AccountResource.ID.textPlaceName} />
                </div>
                <div className='inputWrap'>
                    <div>
                        <label htmlFor="inputName">
                            {AccountResource.ID.textTitlePhone}<span>*</span>
                        </label>
                    </div>
                    <input ref={refPhone} type='text' id='inputName' placeholder={AccountResource.ID.textPlacePhone} />
                </div>


                {/* 로그인 유효성 검사시 사용 */}
                <div className='errorMsg'>
                    {errorMsgUI}
                </div>
                
                <button type='button' className='submitBtn' onClick={() => onClickFindPwd()}>확인</button>
            </form>
        </div>
    );
}

export default FindPwdSection;