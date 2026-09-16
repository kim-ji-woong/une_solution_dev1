import React, { useState } from 'react';

import { AccountUpdateUserComponent } from '../styled/accountManagerStyled';
import { ModalBackground } from '../../Root/styled/theme';

import close_btn from '../../Common/images/close_btn.png';
import tooltip_icon from '../../Settings/images/tooltip-icon.png';
import ProjectResource from '../../Root/resource/id';

function AccountUpdateUser(props) {
    const [isEditMode, setIsEditMode] = useState(false);
    const [errorMsg, setErrorMsg] = useState('필수값을 입력해주세요');

    const onEditMode = (isOn) => {
        if(isOn) {
            setIsEditMode(isOn);
        } else {
            props.showConfirmDialog(ProjectResource.dialogTypes.QUESTION, ['취소하시겠습니까?', '편집중이 내용이 있습니다.'], ['확인'], test);
        }
    }

    const onDeleteUser = () => {
        props.showConfirmDialog(ProjectResource.dialogTypes.QUESTION, ['삭제하시겠습니까?', '단, 조직정보는 삭제되지 않습니다.'], ['확인'], test);
    }
    
    const test = () => {
        props.onCloseConfirmDialog();
        setIsEditMode(false);
    }

    let errorMsgUI = null;

    if (errorMsg) {
		errorMsgUI = (
			<p>{errorMsg}</p>
		);
	}

    return (
        <ModalBackground>
        <AccountUpdateUserComponent>
            <header>
                <h2>사용자 선택</h2>
                <button onClick={() => props.handlePopup(false)} className={'closeBtn'}>
                    <img src={close_btn} alt='닫기 버튼' width={16} height={16} />
                </button>
            </header>
            <section>
                <div>
                    <button 
                        className={isEditMode ? 'on' : 'off'}
                        onClick={() => onEditMode(true)}
                    >
                        편집
                    </button>
                    <button
                        onClick={() => onDeleteUser()}
                    >
                        삭제
                    </button>
                </div>
                <ul>
                    <li>
                        <div>소속 조직<span>*</span></div>
                        <div>
                            <p>부산산단_안전관리팀</p> 
                        </div>
                    </li>
                    <li>
                        <div>이름<span>*</span></div>
                        <div>
                            <p>홍길동</p>
                        </div>
                    </li>
                    <li>
                        <div>직위<span>*</span></div>
                        <div>
                            <p>과장</p>
                        </div>
                    </li>
                    <li>
                        <div>사용자ID<span>*</span></div>
                        <div>
                            <p>SDFFRRD0124</p>
                            <img src={tooltip_icon} alt='도움말 아이콘' width={16} height={16} id='tooltip' />
                        </div>
                    </li>
                    <li>
                        <div>권한<span>*</span></div>
                        <div>
                            {
                                isEditMode ?
                                    <>
                                    <select className='error' defaultValue="">
                                        <option value="" disabled>권한을 지정해주세요.</option>
                                        <option>마스터</option>
                                        <option>총괄관리자</option>
                                        <option>관리자</option>
                                    </select>
                                    <div className='errorMsg'>
                                        {errorMsgUI}
                                    </div>
                                    </>
                                    : <p>총괄관리자</p>
                            }
                            <img src={tooltip_icon} alt='도움말 아이콘' width={16} height={16} id='tooltip' />
                        </div>
                    </li>
                    <li>
                        <div>메모</div>
                        <div>
                            {
                                isEditMode ?
                                    <textarea className='edit' />
                                    : <textarea value='메모입니다' disabled />
                            }
                        </div>
                    </li>
                </ul>
            </section>
            {
                isEditMode &&
                    <div className='btnWrap'>
                        <button className='cancle' onClick={() => onEditMode(false)}>취소</button>
                        <button className='submit'>저장</button>
                    </div>
            }
        </AccountUpdateUserComponent>
        </ModalBackground>
    );
}

export default AccountUpdateUser;