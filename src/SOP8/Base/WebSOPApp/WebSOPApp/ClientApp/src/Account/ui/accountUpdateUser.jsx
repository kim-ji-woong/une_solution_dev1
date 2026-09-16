import React, { useRef, useState } from 'react';

import { AccountUpdateUserComponent } from '../styled/accountManagerStyled';
import { ModalBackground } from '../../Root/styled/theme';

import close_btn from '../../Common/images/close_btn.png';
import tooltip_icon from '../../Settings/images/tooltip-icon.png';
import ProjectResource from '../../Root/resource/id';
import { AccountController } from '../services/accountController';

function AccountUpdateUser(props) {
    const [isEditMode, setIsEditMode] = useState(false);
    const [errorMsg, setErrorMsg] = useState('필수값을 입력해주세요');
    const [isUpdated, setIsUpdated] = useState(false);

    const refOption = useRef(null);
    const refMemo = useRef(null);

    const onEditMode = (isOn) => {
        if(isOn) {
            setIsEditMode(isOn);
        } else {
            if (isUpdated) {
                props.showConfirmDialog(ProjectResource.dialogTypes.QUESTION, ['취소하시겠습니까?', '편집중이 내용이 있습니다.'], ['확인'], handleEditMode);
            }
            else {
                handleEditMode();
            }
        }
    }

    const onClickDeleteUser = () => {
        props.showConfirmDialog(ProjectResource.dialogTypes.QUESTION, ['삭제하시겠습니까?', '단, 조직정보는 삭제되지 않습니다.'], ['확인'], deleteUserInfo);
    }

    const deleteUserInfo = async () => {
        const userNo = props.selectedUser.userNo;

        if (!userNo) return;

        const [success, message] = await AccountController.deleteUser(userNo);

        if (success) {
            props.searchAccountUsers();
            props.showConfirmDialog(ProjectResource.dialogTypes.SUCCESS, ['삭제되었습니다.'], ['확인'], handlePopup);
        }
        else {
            props.showConfirmDialog(ProjectResource.dialogTypes.ERROR, [message], null, null);
        }
    }

    const onClickUpdateUser = () => {
        props.showConfirmDialog(ProjectResource.dialogTypes.QUESTION, ['저장하시겠습니까?'], ['확인'], updateUserInfo);
    }

    const updateUserInfo = async () => {
        const userNo = props.selectedUser.userNo;
        const gradeNo =  refOption.current.value.toString();
        const memo =  refMemo.current.value.toString();

        if (!userNo || !gradeNo) return;

        const [success, message] = await AccountController.updateUserInfo(userNo, null, gradeNo, memo);

        if (success) {
            props.searchAccountUsers();
            props.showConfirmDialog(ProjectResource.dialogTypes.SUCCESS, ['저장되었습니다.'], ['확인'], handlePopup);
        }
        else {
            props.showConfirmDialog(ProjectResource.dialogTypes.ERROR, [message], null, null);
        }
    }

    const onChangeUserInfo = () => {
        if (!isUpdated) {
            setIsUpdated(true);
        }
    }
    
    const handleEditMode = () => {
        props.onCloseConfirmDialog();
        setIsEditMode(false);
    }

    const handlePopup = () => {
        props.onCloseConfirmDialog();
        props.handlePopup(false);
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
                        onClick={() => onClickDeleteUser()}
                    >
                        삭제
                    </button>
                </div>
                <ul>
                    <li>
                        <div>소속 조직<span>*</span></div>
                        <div>
                            <p>{props.selectedUser?.teamName ? props.selectedUser.teamName : '-'}</p> 
                        </div>
                    </li>
                    <li>
                        <div>이름<span>*</span></div>
                        <div>
                            <p>{props.selectedUser?.memberName ? props.selectedUser.memberName : '-'}</p>
                        </div>
                    </li>
                    <li>
                        <div>직위<span>*</span></div>
                        <div>
                            <p>{props.selectedUser?.jobLevel ? props.selectedUser.jobLevel : '-'}</p>
                        </div>
                    </li>
                    <li>
                        <div>사용자ID<span>*</span></div>
                        <div>
                            <p>{props.selectedUser?.userID ? props.selectedUser.userID : '-'}</p>
                        </div>
                    </li>
                    <li>
                        <div>권한<span>*</span></div>
                        <div>
                            {
                                isEditMode ?
                                    <>
                                    <select ref={refOption} /* className='error' */ defaultValue={props.selectedUser?.gradeNo || ""} onChange={onChangeUserInfo}>
                                        {/* <option value="-1" disabled>권한을 지정해주세요.</option> */}
                                        {
                                            props.grades && props.grades.length > 0 &&
                                                props.grades.map((grade) => <option key={grade.grad_sn} value={grade.grad_sn}>{grade.grad_name}</option>)
                                        }
                                    </select>
                                    {/* <div className='errorMsg'>
                                        {errorMsgUI}
                                    </div> */}
                                    </>
                                    : <p>{props.selectedUser?.grade ? props.selectedUser.grade : '-'}</p>
                            }
                            <div id='tooltip' data-tooltip="상위 권한 및 동일 권한은 편집이 불가합니다.">
                                <img src={tooltip_icon} alt='도움말 아이콘' width={16} height={16} />
                            </div>
                        </div>
                    </li>
                    <li>
                        <div>메모</div>
                        <div>
                            {
                                isEditMode ?
                                    <textarea ref={refMemo} className='edit' />
                                    : <textarea value={props.selectedUser?.memo || ''} disabled />
                            }
                        </div>
                    </li>
                </ul>
            </section>
            {
                isEditMode &&
                    <div className='btnWrap'>
                        <button className='cancle' onClick={() => onEditMode(false)}>취소</button>
                        <button className='submit' onClick={() => onClickUpdateUser()}>저장</button>
                    </div>
            }
        </AccountUpdateUserComponent>
        </ModalBackground>
    );
}

export default AccountUpdateUser;